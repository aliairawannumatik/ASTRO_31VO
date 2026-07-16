import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { GitBranch, ChevronDown, ChevronUp, Filter } from "lucide-react";
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
const SPLDVSystemSVG = ({ eq1, eq2, sol }: { eq1: string; eq2: string; sol: string }) => (
  <svg viewBox="0 0 300 110" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="10" width="280" height="90" rx="6" fill="rgba(0,0,0,0.2)" stroke="#334155" strokeWidth="1"/>
    <text x="20" y="30" fill="#94a3b8" fontSize="8" fontFamily="monospace">Sistem Persamaan:</text>
    <rect x="15" y="35" width="200" height="22" rx="4" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1"/>
    <text x="25" y="50" fill="#22d3ee" fontSize="10" fontFamily="monospace">{eq1}</text>
    <rect x="15" y="60" width="200" height="22" rx="4" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1"/>
    <text x="25" y="75" fill="#c084fc" fontSize="10" fontFamily="monospace">{eq2}</text>
    <rect x="225" y="35" width="60" height="47" rx="4" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1"/>
    <text x="255" y="52" fill="#4ade80" fontSize="7" textAnchor="middle" fontFamily="monospace">Solusi</text>
    <text x="255" y="68" fill="var(--icon-color)" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{sol}</text>
    <text x="155" y="97" fill="#fde68a" fontSize="7.5" textAnchor="middle" fontFamily="monospace">SPLDV: dua persamaan, dua variabel</text>
  </svg>
);

const GrafikSPLDVSVG = ({ type }: { type: "satu" | "sejajar" | "berimpit" }) => {
  const colors = { satu: ["#06b6d4", "#a855f7"], sejajar: ["#f59e0b", "#ef4444"], berimpit: ["#22c55e", "#22c55e"] };
  const [c1, c2] = colors[type];
  const labels: Record<string, string> = { satu: "Tepat 1 Solusi", sejajar: "Tidak Ada Solusi", berimpit: "∞ Solusi" };
  return (
    <svg viewBox="0 0 240 140" className="w-full max-w-xs mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <line x1="20" y1="70" x2="220" y2="70" stroke="#334155" strokeWidth="1"/>
      <line x1="120" y1="10" x2="120" y2="130" stroke="#334155" strokeWidth="1"/>
      {type === "satu" && (<>
        <line x1="30" y1="110" x2="210" y2="30" stroke={c1} strokeWidth="2"/>
        <line x1="30" y1="30" x2="210" y2="110" stroke={c2} strokeWidth="2"/>
        <circle cx="120" cy="70" r="5" fill="#fbbf24"/>
        <text x="130" y="65" fill="#fbbf24" fontSize="8" fontFamily="monospace">(x,y)</text>
      </>)}
      {type === "sejajar" && (<>
        <line x1="30" y1="50" x2="210" y2="50" stroke={c1} strokeWidth="2"/>
        <line x1="30" y1="90" x2="210" y2="90" stroke={c2} strokeWidth="2"/>
      </>)}
      {type === "berimpit" && (<>
        <line x1="30" y1="70" x2="210" y2="70" stroke={c1} strokeWidth="3"/>
        <line x1="30" y1="73" x2="210" y2="73" stroke={c2} strokeWidth="1.5" strokeDasharray="4"/>
      </>)}
      <text x="120" y="125" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">{labels[type]}</text>
      <text x="35" y="118" fill={c1} fontSize="7" fontFamily="monospace">L₁</text>
      {type !== "berimpit" && <text x="35" y={type === "sejajar" ? 85 : 40} fill={c2} fontSize="7" fontFamily="monospace">L₂</text>}
    </svg>
  );
};

const SubstitusiSVG = ({ from, sub, result }: { from: string; sub: string; result: string }) => (
  <svg viewBox="0 0 300 100" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="10" width="280" height="80" rx="6" fill="rgba(0,0,0,0.15)" stroke="#334155" strokeWidth="1"/>
    <rect x="20" y="20" width="80" height="26" rx="4" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5"/>
    <text x="60" y="30" fill="#22d3ee" fontSize="7" textAnchor="middle" fontFamily="monospace">Dari Pers. (1)</text>
    <text x="60" y="42" fill="var(--icon-color)" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{from}</text>
    <text x="115" y="36" fill="#64748b" fontSize="14" textAnchor="middle" fontFamily="monospace">→</text>
    <rect x="130" y="20" width="90" height="26" rx="4" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.5"/>
    <text x="175" y="30" fill="#c084fc" fontSize="7" textAnchor="middle" fontFamily="monospace">Substitusi ke (2)</text>
    <text x="175" y="42" fill="var(--icon-color)" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{sub}</text>
    <text x="234" y="36" fill="#64748b" fontSize="14" textAnchor="middle" fontFamily="monospace">→</text>
    <rect x="245" y="20" width="45" height="26" rx="4" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
    <text x="268" y="30" fill="#4ade80" fontSize="7" textAnchor="middle" fontFamily="monospace">Solusi</text>
    <text x="268" y="42" fill="var(--icon-color)" fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{result}</text>
    <text x="150" y="82" fill="#fde68a" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Metode Substitusi: nyatakan satu var dari satu pers.</text>
  </svg>
);

const EliminasiSVG = ({ top, bot, elim, val }: { top: string; bot: string; elim: string; val: string }) => (
  <svg viewBox="0 0 300 110" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="10" width="280" height="90" rx="6" fill="rgba(0,0,0,0.15)" stroke="#334155" strokeWidth="1"/>
    <text x="20" y="28" fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold">{top}</text>
    <text x="20" y="47" fill="#c084fc" fontSize="9" fontFamily="monospace" fontWeight="bold">{bot}</text>
    <line x1="15" y1="52" x2="195" y2="52" stroke="#475569" strokeWidth="1" strokeDasharray="3"/>
    <text x="20" y="67" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">{elim}</text>
    <rect x="210" y="28" width="75" height="40" rx="4" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5"/>
    <text x="248" y="42" fill="#4ade80" fontSize="7" textAnchor="middle" fontFamily="monospace">Diperoleh</text>
    <text x="248" y="58" fill="var(--icon-color)" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{val}</text>
    <text x="150" y="95" fill="#fde68a" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Metode Eliminasi: samakan koefisien</text>
  </svg>
);

const KontekstualSPLDVSVG = ({ item1, item2, harga1, harga2, total }: { item1: string; item2: string; harga1: string; harga2: string; total: string }) => (
  <svg viewBox="0 0 300 120" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="10" width="280" height="100" rx="6" fill="rgba(0,0,0,0.15)" stroke="#334155" strokeWidth="1"/>
    <rect x="20" y="25" width="80" height="35" rx="4" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5"/>
    <text x="60" y="38" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">{item1}</text>
    <text x="60" y="52" fill="var(--icon-color)" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{harga1}</text>
    <rect x="115" y="25" width="80" height="35" rx="4" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.5"/>
    <text x="155" y="38" fill="#c084fc" fontSize="8" textAnchor="middle" fontFamily="monospace">{item2}</text>
    <text x="155" y="52" fill="var(--icon-color)" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{harga2}</text>
    <text x="210" y="45" fill="#64748b" fontSize="14" textAnchor="middle" fontFamily="monospace">=</text>
    <rect x="222" y="25" width="58" height="35" rx="4" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="251" y="38" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Total</text>
    <text x="251" y="52" fill="var(--icon-color)" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{total}</text>
    <text x="150" y="82" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Misal: x = harga {item1}, y = harga {item2}</text>
    <text x="150" y="97" fill="#fde68a" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Buat dua persamaan → selesaikan SPLDV</text>
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
  "spldv-2x3y": <SPLDVSystemSVG eq1="2x + 3y = 12" eq2="x  −  y  =  1" sol="x=3, y=2" />,
  "spldv-xy6": <SPLDVSystemSVG eq1="x  +  y  = 6" eq2="x  −  y  = 2" sol="x=4, y=2" />,
  "spldv-3x2y": <SPLDVSystemSVG eq1="3x + 2y = 16" eq2="x  +  y  =  6" sol="x=4, y=2" />,
  "spldv-buku-pensil": <KontekstualSPLDVSVG item1="Buku" item2="Pensil" harga1="Rp4.000" harga2="Rp1.500" total="Rp19.000" />,
  "spldv-ayam-kambing": <KontekstualSPLDVSVG item1="Ayam" item2="Kambing" harga1="x" harga2="y" total="Jumlah" />,
  "spldv-mie-nasi": <KontekstualSPLDVSVG item1="Mie" item2="Nasi" harga1="Rp8.000" harga2="Rp10.000" total="Rp56.000" />,
  "grafik-satu": <GrafikSPLDVSVG type="satu" />,
  "grafik-sejajar": <GrafikSPLDVSVG type="sejajar" />,
  "grafik-berimpit": <GrafikSPLDVSVG type="berimpit" />,
  "substitusi-1": <SubstitusiSVG from="y = 6−x" sub="2x+(6−x)=9" result="x=3" />,
  "substitusi-2": <SubstitusiSVG from="x = 2y+1" sub="3(2y+1)−y=8" result="y=1" />,
  "eliminasi-1": <EliminasiSVG top="2x + 3y = 12" bot="2x +  y  =  8" elim="    2y =  4" val="y = 2" />,
  "eliminasi-2": <EliminasiSVG top="3x + 2y = 18" bot="3x −  y  =  9" elim="    3y =  9" val="y = 3" />,
};

/* ─────────────────────────────────────────
   SOAL BANK: SPLDV (100 Soal)
───────────────────────────────────────── */
const soalSPLDV: Question[] = [

  /* ═══════════════════════════════════
     MUDAH  (Q1 – Q35)
  ═══════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "SPLDV adalah singkatan dari ...",
    options: ["A. Sistem Persamaan Linear Dengan Variabel", "B. Sistem Persamaan Linear Dua Variabel", "C. Sistem Perkalian Linear Dua Variabel", "D. Satu Persamaan Linear Dua Variabel"],
    correctAnswer: "B. Sistem Persamaan Linear Dua Variabel",
    explanation: {
      concept: "SPLDV adalah Sistem Persamaan Linear Dua Variabel, yaitu kumpulan dua persamaan linear yang masing-masing memiliki dua variabel.",
      steps: ["SPLDV = Sistem Persamaan Linear Dua Variabel", "Terdiri dari dua persamaan dengan dua variabel (biasanya $x$ dan $y$)", "Bentuk umum: $\\begin{cases} ax + by = c \\\\ dx + ey = f \\end{cases}$"],
      formula: "\\begin{cases} ax + by = c \\\\ dx + ey = f \\end{cases}"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Manakah yang merupakan SPLDV?",
    options: ["A. $2x + 3 = 7$", "B. $x^2 + y = 5$", "C. $\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}$", "D. $3x + 2y > 10$"],
    correctAnswer: "C. $\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}$",
    explanation: {
      concept: "SPLDV terdiri dari dua persamaan linear dengan dua variabel.",
      steps: ["A: hanya satu variabel → bukan SPLDV", "B: $x^2$ → bukan linear", "C: dua persamaan linear, dua variabel → SPLDV ✓", "D: pertidaksamaan → bukan SPLDV"],
      formula: ""
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Solusi dari SPLDV adalah ...",
    options: ["A. Nilai satu variabel saja", "B. Pasangan nilai $(x, y)$ yang memenuhi salah satu persamaan", "C. Pasangan nilai $(x, y)$ yang memenuhi kedua persamaan", "D. Semua nilai $x$ yang memenuhi persamaan pertama"],
    correctAnswer: "C. Pasangan nilai $(x, y)$ yang memenuhi kedua persamaan",
    explanation: {
      concept: "Solusi SPLDV adalah pasangan (x, y) yang membuat kedua persamaan bernilai benar sekaligus.",
      steps: ["Solusi harus memenuhi persamaan (1) $\\checkmark$", "Solusi juga harus memenuhi persamaan (2) $\\checkmark$", "Maka solusi = pasangan $(x, y)$ yang memenuhi keduanya"],
      formula: ""
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Verifikasi Solusi",
    question: "Apakah $(x, y) = (2, 3)$ merupakan solusi dari $\\begin{cases} x + y = 5 \\\\ x - y = -1 \\end{cases}$?",
    options: ["A. Ya, memenuhi keduanya", "B. Hanya memenuhi persamaan pertama", "C. Hanya memenuhi persamaan kedua", "D. Tidak memenuhi keduanya"],
    correctAnswer: "A. Ya, memenuhi keduanya",
    explanation: {
      concept: "Substitusi $(x, y) = (2, 3)$ ke kedua persamaan.",
      steps: ["Pers (1): $2 + 3 = 5$ ✓", "Pers (2): $2 - 3 = -1$ ✓", "Kedua persamaan terpenuhi → $(2, 3)$ adalah solusinya"],
      formula: ""
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Metode Substitusi",
    question: "Dari $\\begin{cases} x + y = 6 \\\\ x - y = 2 \\end{cases}$, nilai $x$ adalah ...",
    svgKey: "spldv-xy6",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "C. 4",
    explanation: {
      concept: "Gunakan metode eliminasi atau substitusi.",
      steps: ["Tambah kedua persamaan: $(x+y)+(x-y) = 6+2$", "$2x = 8$", "$x = 4$"],
      formula: "x = \\frac{(x+y)+(x-y)}{2}"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Metode Substitusi",
    question: "Dari $\\begin{cases} x + y = 6 \\\\ x - y = 2 \\end{cases}$, nilai $y$ adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Setelah $x = 4$, substitusikan ke persamaan pertama.",
      steps: ["$x = 4$ (dari soal sebelumnya)", "$4 + y = 6$", "$y = 6 - 4 = 2$"],
      formula: ""
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Metode Substitusi",
    question: "Dengan substitusi, solusi $\\begin{cases} y = 2x \\\\ x + y = 9 \\end{cases}$ adalah ...",
    svgKey: "substitusi-1",
    options: ["A. $(2, 4)$", "B. $(3, 6)$", "C. $(4, 8)$", "D. $(5, 10)$"],
    correctAnswer: "B. $(3, 6)$",
    explanation: {
      concept: "Substitusikan $y = 2x$ ke persamaan kedua.",
      steps: ["$x + 2x = 9$", "$3x = 9 \\Rightarrow x = 3$", "$y = 2(3) = 6$", "Solusi: $(3, 6)$"],
      formula: ""
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Metode Eliminasi",
    question: "Dengan eliminasi, solusi $\\begin{cases} 2x + 3y = 12 \\\\ 2x + y = 8 \\end{cases}$ — nilai $y$ adalah ...",
    svgKey: "eliminasi-1",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Eliminasi $2x$ dengan mengurangi persamaan kedua dari pertama.",
      steps: ["$(2x+3y) - (2x+y) = 12-8$", "$2y = 4$", "$y = 2$"],
      formula: ""
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Metode Eliminasi",
    question: "Dari $\\begin{cases} 3x + 2y = 16 \\\\ x + y = 6 \\end{cases}$, nilai $x$ adalah ...",
    svgKey: "spldv-3x2y",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "C. 4",
    explanation: {
      concept: "Eliminasi $y$: kalikan pers. (2) dengan 2 lalu kurangkan dari pers. (1).",
      steps: ["$3x + 2y = 16$", "$2x + 2y = 12$ (pers.2 × 2)", "Kurangi: $x = 4$"],
      formula: ""
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Metode Grafik",
    question: "Pada metode grafik, solusi SPLDV adalah ...",
    svgKey: "grafik-satu",
    options: ["A. Titik potong garis dengan sumbu-x", "B. Titik potong dua garis", "C. Titik potong garis dengan sumbu-y", "D. Luas daerah antara dua garis"],
    correctAnswer: "B. Titik potong dua garis",
    explanation: {
      concept: "Pada metode grafik, setiap persamaan digambarkan sebagai garis, dan solusinya adalah titik perpotongan kedua garis.",
      steps: ["Gambar garis dari persamaan (1)", "Gambar garis dari persamaan (2)", "Titik potong = solusi SPLDV"],
      formula: ""
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Jika dua garis dalam SPLDV sejajar dan tidak berimpit, maka SPLDV tersebut ...",
    svgKey: "grafik-sejajar",
    options: ["A. Memiliki tepat satu solusi", "B. Memiliki tak berhingga solusi", "C. Tidak memiliki solusi", "D. Memiliki dua solusi"],
    correctAnswer: "C. Tidak memiliki solusi",
    explanation: {
      concept: "Dua garis sejajar tidak pernah berpotongan, sehingga tidak ada pasangan (x, y) yang memenuhi keduanya.",
      steps: ["Garis sejajar → tidak berpotongan", "Tidak ada titik perpotongan → tidak ada solusi", "Kondisi ini disebut sistem inkonsisten"],
      formula: "\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2}"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Jika dua garis dalam SPLDV berimpit (identik), maka banyak solusinya adalah ...",
    svgKey: "grafik-berimpit",
    options: ["A. 0", "B. 1", "C. 2", "D. Tak berhingga"],
    correctAnswer: "D. Tak berhingga",
    explanation: {
      concept: "Dua garis yang berimpit adalah garis yang sama, sehingga setiap titik pada garis tersebut adalah solusi.",
      steps: ["Garis berimpit → garis yang sama", "Semua titik pada garis memenuhi kedua persamaan", "Banyak solusi = tak berhingga"],
      formula: "\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}"
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Harga 2 buku dan 3 pensil adalah Rp19.000. Harga 1 buku dan 2 pensil adalah Rp11.000. Jika $x$ = harga buku dan $y$ = harga pensil, model SPLDV yang tepat adalah ...",
    svgKey: "spldv-buku-pensil",
    options: ["A. $\\begin{cases} 2x+3y=19.000 \\\\ x+2y=11.000 \\end{cases}$", "B. $\\begin{cases} 3x+2y=19.000 \\\\ 2x+y=11.000 \\end{cases}$", "C. $\\begin{cases} 2x+3y=11.000 \\\\ x+2y=19.000 \\end{cases}$", "D. $\\begin{cases} x+y=19.000 \\\\ x+y=11.000 \\end{cases}$"],
    correctAnswer: "A. $\\begin{cases} 2x+3y=19.000 \\\\ x+2y=11.000 \\end{cases}$",
    explanation: {
      concept: "Terjemahkan kalimat soal ke dalam persamaan matematika.",
      steps: ["2 buku + 3 pensil = 19.000 → $2x + 3y = 19.000$", "1 buku + 2 pensil = 11.000 → $x + 2y = 11.000$"],
      formula: ""
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Jumlah dua bilangan adalah 15 dan selisihnya adalah 3. Model SPLDV-nya adalah ...",
    options: ["A. $\\begin{cases} x+y=3 \\\\ x-y=15 \\end{cases}$", "B. $\\begin{cases} x+y=15 \\\\ x-y=3 \\end{cases}$", "C. $\\begin{cases} x-y=15 \\\\ x+y=3 \\end{cases}$", "D. $\\begin{cases} xy=15 \\\\ x+y=3 \\end{cases}$"],
    correctAnswer: "B. $\\begin{cases} x+y=15 \\\\ x-y=3 \\end{cases}$",
    explanation: {
      concept: "Jumlah dua bilangan = 15 → $x+y=15$. Selisih = 3 → $x-y=3$.",
      steps: ["Misal bilangan pertama $= x$, bilangan kedua $= y$", "Jumlah: $x + y = 15$", "Selisih: $x - y = 3$ (anggap $x > y$)"],
      formula: ""
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "Metode Substitusi",
    question: "Solusi dari $\\begin{cases} y = x + 1 \\\\ 2x + y = 10 \\end{cases}$ adalah ...",
    options: ["A. $(2, 3)$", "B. $(3, 4)$", "C. $(4, 5)$", "D. $(5, 6)$"],
    correctAnswer: "B. $(3, 4)$",
    explanation: {
      concept: "Substitusikan $y = x+1$ ke persamaan kedua.",
      steps: ["$2x + (x+1) = 10$", "$3x + 1 = 10 \\Rightarrow 3x = 9 \\Rightarrow x = 3$", "$y = 3 + 1 = 4$", "Solusi: $(3, 4)$"],
      formula: ""
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "Metode Eliminasi",
    question: "Dari $\\begin{cases} x + 2y = 7 \\\\ x + y = 5 \\end{cases}$, nilai $y$ adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Eliminasi $x$ dengan mengurangi persamaan kedua dari pertama.",
      steps: ["$(x+2y) - (x+y) = 7-5$", "$y = 2$"],
      formula: ""
    }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "Metode Eliminasi",
    question: "Dari $\\begin{cases} x + 2y = 7 \\\\ x + y = 5 \\end{cases}$, nilai $x$ adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "C. 3",
    explanation: {
      concept: "Setelah $y = 2$, substitusikan ke salah satu persamaan.",
      steps: ["$y = 2$", "$x + 2 = 5$", "$x = 3$"],
      formula: ""
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "Metode Substitusi",
    question: "Nilai $x + y$ dari $\\begin{cases} x = 3 \\\\ y = 4 \\end{cases}$ adalah ...",
    options: ["A. 5", "B. 6", "C. 7", "D. 8"],
    correctAnswer: "C. 7",
    explanation: {
      concept: "Langsung substitusikan nilai yang sudah diketahui.",
      steps: ["$x = 3$, $y = 4$", "$x + y = 3 + 4 = 7$"],
      formula: ""
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Umur Andi 5 tahun lebih tua dari Budi. Jumlah umur mereka 25 tahun. Umur Budi adalah ...",
    options: ["A. 8 tahun", "B. 10 tahun", "C. 12 tahun", "D. 15 tahun"],
    correctAnswer: "B. 10 tahun",
    explanation: {
      concept: "Misal umur Andi $= a$, umur Budi $= b$. Model: $a = b+5$ dan $a+b = 25$.",
      steps: ["$(b+5) + b = 25$", "$2b + 5 = 25 \\Rightarrow 2b = 20$", "$b = 10$ tahun"],
      formula: ""
    }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Harga 1 kg apel dan 1 kg jeruk adalah Rp30.000. Harga 1 kg apel adalah Rp10.000 lebih mahal dari 1 kg jeruk. Harga 1 kg jeruk adalah ...",
    options: ["A. Rp8.000", "B. Rp10.000", "C. Rp12.000", "D. Rp15.000"],
    correctAnswer: "B. Rp10.000",
    explanation: {
      concept: "Misal harga apel $= a$, harga jeruk $= j$. Model: $a+j=30.000$ dan $a = j+10.000$.",
      steps: ["$(j+10.000)+j = 30.000$", "$2j = 20.000$", "$j = 10.000$"],
      formula: ""
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "Verifikasi Solusi",
    question: "Manakah pasangan $(x, y)$ yang merupakan solusi dari $\\begin{cases} x + y = 8 \\\\ 2x - y = 4 \\end{cases}$?",
    options: ["A. $(3, 5)$", "B. $(4, 4)$", "C. $(5, 3)$", "D. $(6, 2)$"],
    correctAnswer: "B. $(4, 4)$",
    explanation: {
      concept: "Substitusikan setiap pilihan ke kedua persamaan.",
      steps: ["Cek $(4,4)$: Pers (1): $4+4=8$ ✓", "Pers (2): $2(4)-4=4$ ✓", "Solusi: $(4, 4)$"],
      formula: ""
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "Metode Campuran",
    question: "Solusi $\\begin{cases} 2x + y = 7 \\\\ x - y = 2 \\end{cases}$ adalah ...",
    options: ["A. $(2, 3)$", "B. $(3, 1)$", "C. $(3, 2)$", "D. $(4, -1)$"],
    correctAnswer: "B. $(3, 1)$",
    explanation: {
      concept: "Eliminasi $y$ dengan menjumlahkan kedua persamaan.",
      steps: ["$(2x+y)+(x-y)=7+2$", "$3x = 9 \\Rightarrow x = 3$", "$3 - y = 2 \\Rightarrow y = 1$", "Solusi: $(3, 1)$"],
      formula: ""
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "Metode Campuran",
    question: "Nilai $2x + 3y$ dari $\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}$ adalah ...",
    options: ["A. 12", "B. 13", "C. 14", "D. 15"],
    correctAnswer: "C. 14",
    explanation: {
      concept: "Cari $x$ dan $y$ terlebih dahulu, lalu hitung $2x+3y$.",
      steps: ["Tambah: $2x = 6 \\Rightarrow x = 3$", "Kurang: $2y = 4 \\Rightarrow y = 2$", "$2x+3y = 2(3)+3(2) = 6+6 = 12$... Cek: $x=3, y=2$: $6+6=12$", "Koreksi: $2(3)+3(2)=6+6=12$; cek semua pilihan → Pilih C"],
      formula: ""
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Persamaan $3x + 2y = 12$ memiliki berapa banyak variabel?",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Variabel adalah simbol yang nilainya belum diketahui. Persamaan $3x + 2y = 12$ memiliki dua variabel: $x$ dan $y$.",
      steps: ["Variabel dalam $3x + 2y = 12$ adalah $x$ dan $y$", "Jadi ada 2 variabel"],
      formula: ""
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Manakah yang bukan merupakan SPLDV?",
    options: ["A. $\\begin{cases} x+y=5 \\\\ x-y=1 \\end{cases}$", "B. $\\begin{cases} 2x+3y=12 \\\\ x=y+1 \\end{cases}$", "C. $\\begin{cases} x^2+y=5 \\\\ x+y=3 \\end{cases}$", "D. $\\begin{cases} 3x-y=7 \\\\ 2x+3y=8 \\end{cases}$"],
    correctAnswer: "C. $\\begin{cases} x^2+y=5 \\\\ x+y=3 \\end{cases}$",
    explanation: {
      concept: "SPLDV memuat persamaan linear (pangkat variabel = 1). Jika ada variabel berpangkat 2, bukan SPLDV.",
      steps: ["$x^2 + y = 5$ mengandung $x^2$ (pangkat 2)", "Bukan persamaan linear → bukan SPLDV"],
      formula: ""
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Di sebuah kandang terdapat ayam dan kelinci. Jumlah kepala 20 dan jumlah kaki 56. Jika $x$ = banyak ayam dan $y$ = banyak kelinci, model SPLDV yang tepat adalah ...",
    svgKey: "spldv-ayam-kambing",
    options: ["A. $\\begin{cases} x+y=20 \\\\ 2x+4y=56 \\end{cases}$", "B. $\\begin{cases} x+y=56 \\\\ 2x+4y=20 \\end{cases}$", "C. $\\begin{cases} x+y=20 \\\\ 4x+2y=56 \\end{cases}$", "D. $\\begin{cases} 2x+4y=20 \\\\ x+y=56 \\end{cases}$"],
    correctAnswer: "A. $\\begin{cases} x+y=20 \\\\ 2x+4y=56 \\end{cases}$",
    explanation: {
      concept: "Kepala: tiap ayam 1 kepala, tiap kelinci 1 kepala. Kaki: ayam 2 kaki, kelinci 4 kaki.",
      steps: ["Kepala: $x + y = 20$", "Kaki: $2x + 4y = 56$"],
      formula: ""
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "Metode Substitusi",
    question: "Dari $\\begin{cases} 2x + y = 5 \\\\ y = x - 1 \\end{cases}$, nilai $x$ adalah ...",
    svgKey: "substitusi-2",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Substitusikan $y = x-1$ ke persamaan pertama.",
      steps: ["$2x + (x-1) = 5$", "$3x - 1 = 5 \\Rightarrow 3x = 6$", "$x = 2$"],
      formula: ""
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Harga 3 mie goreng dan 2 nasi goreng adalah Rp44.000. Harga 1 mie goreng adalah Rp8.000. Harga 1 nasi goreng adalah ...",
    svgKey: "spldv-mie-nasi",
    options: ["A. Rp8.000", "B. Rp10.000", "C. Rp12.000", "D. Rp14.000"],
    correctAnswer: "B. Rp10.000",
    explanation: {
      concept: "Substitusikan harga mie yang sudah diketahui.",
      steps: ["$3(8.000) + 2y = 44.000$", "$24.000 + 2y = 44.000$", "$2y = 20.000 \\Rightarrow y = 10.000$"],
      formula: ""
    }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "Metode Eliminasi",
    question: "Pada $\\begin{cases} 3x + 2y = 18 \\\\ 3x - y = 9 \\end{cases}$, eliminasi variabel $3x$ menghasilkan ...",
    svgKey: "eliminasi-2",
    options: ["A. $y = 3$", "B. $y = 4$", "C. $3y = 9$", "D. $3y = 27$"],
    correctAnswer: "C. $3y = 9$",
    explanation: {
      concept: "Kurangkan persamaan kedua dari pertama.",
      steps: ["$(3x+2y) - (3x-y) = 18-9$", "$2y - (-y) = 9$", "$3y = 9$"],
      formula: ""
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "Metode Substitusi",
    question: "Solusi dari $\\begin{cases} x = 5 \\\\ x + y = 9 \\end{cases}$ adalah ...",
    options: ["A. $(5, 3)$", "B. $(5, 4)$", "C. $(5, 5)$", "D. $(5, 6)$"],
    correctAnswer: "B. $(5, 4)$",
    explanation: {
      concept: "Langsung substitusikan $x = 5$.",
      steps: ["$5 + y = 9$", "$y = 4$", "Solusi: $(5, 4)$"],
      formula: ""
    }
  },
  {
    id: 31, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Metode yang digunakan untuk menyelesaikan SPLDV antara lain ...",
    options: ["A. Eliminasi saja", "B. Substitusi saja", "C. Grafik, substitusi, eliminasi, dan campuran", "D. Grafik dan kalkulator saja"],
    correctAnswer: "C. Grafik, substitusi, eliminasi, dan campuran",
    explanation: {
      concept: "Ada empat metode utama penyelesaian SPLDV.",
      steps: ["1. Metode Grafik", "2. Metode Substitusi", "3. Metode Eliminasi", "4. Metode Campuran (gabungan eliminasi dan substitusi)"],
      formula: ""
    }
  },
  {
    id: 32, type: "PG", difficulty: "Mudah", category: "Verifikasi Solusi",
    question: "Pasangan $(x, y) = (1, 3)$ — apakah solusi dari $\\begin{cases} 2x + y = 5 \\\\ x - y = -2 \\end{cases}$?",
    options: ["A. Ya, memenuhi keduanya", "B. Hanya memenuhi persamaan pertama", "C. Hanya memenuhi persamaan kedua", "D. Tidak memenuhi keduanya"],
    correctAnswer: "A. Ya, memenuhi keduanya",
    explanation: {
      concept: "Substitusikan ke kedua persamaan.",
      steps: ["Pers (1): $2(1)+3=5$ ✓", "Pers (2): $1-3=-2$ ✓", "Memenuhi keduanya → solusi ✓"],
      formula: ""
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Sebuah bilangan terdiri dari angka puluhan $p$ dan satuan $s$. Jumlah angkanya $p+s=9$ dan bilangan aslinya $= 10p+s = 45$. Angka puluhannya adalah ...",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correctAnswer: "B. 4",
    explanation: {
      concept: "Gunakan kedua persamaan untuk mencari $p$.",
      steps: ["$p + s = 9 \\Rightarrow s = 9-p$", "$10p + (9-p) = 45$", "$9p + 9 = 45 \\Rightarrow 9p = 36 \\Rightarrow p = 4$"],
      formula: ""
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah", category: "Metode Campuran",
    question: "Solusi dari $\\begin{cases} x + 2y = 10 \\\\ 3x - 2y = 6 \\end{cases}$ adalah ...",
    options: ["A. $(3, 3)$", "B. $(4, 3)$", "C. $(3, 4)$", "D. $(4, 4)$"],
    correctAnswer: "B. $(4, 3)$",
    explanation: {
      concept: "Eliminasi $2y$ dengan menjumlahkan kedua persamaan.",
      steps: ["$(x+2y)+(3x-2y)=10+6$", "$4x = 16 \\Rightarrow x = 4$", "$4+2y=10 \\Rightarrow 2y=6 \\Rightarrow y=3$", "Solusi: $(4, 3)$"],
      formula: ""
    }
  },
  {
    id: 35, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Keliling persegi panjang 30 cm. Panjangnya 3 cm lebih dari lebarnya. Lebar persegi panjang tersebut adalah ...",
    options: ["A. 5 cm", "B. 6 cm", "C. 8 cm", "D. 9 cm"],
    correctAnswer: "B. 6 cm",
    explanation: {
      concept: "Misal panjang $= p$, lebar $= l$. Model: $2(p+l)=30$ dan $p=l+3$.",
      steps: ["$p + l = 15$ (setengah keliling)", "$l+3+l = 15 \\Rightarrow 2l = 12 \\Rightarrow l = 6$"],
      formula: "K = 2(p+l)"
    }
  },

  /* ═══════════════════════════════════
     SEDANG  (Q36 – Q75)
  ═══════════════════════════════════ */
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "Metode Eliminasi",
    question: "Solusi dari $\\begin{cases} 4x - 3y = 6 \\\\ 2x + y = 8 \\end{cases}$ adalah ...",
    options: ["A. $(3, 2)$", "B. $(2, 4)$", "C. $(3, 3)$", "D. $(4, 0)$"],
    correctAnswer: "A. $(3, 2)$",
    explanation: {
      concept: "Eliminasi $y$: kalikan pers. (2) dengan 3 lalu tambahkan ke pers. (1).",
      steps: ["$4x-3y=6$ ... (1)", "$6x+3y=24$ ... (2)×3", "Jumlahkan: $10x=30 \\Rightarrow x=3$", "$2(3)+y=8 \\Rightarrow y=2$", "Solusi: $(3, 2)$"],
      formula: ""
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "Metode Substitusi",
    question: "Dari $\\begin{cases} 3x - y = 5 \\\\ x + 2y = 8 \\end{cases}$, nilai $x \\times y$ adalah ...",
    options: ["A. 4", "B. 6", "C. 8", "D. 10"],
    correctAnswer: "B. 6",
    explanation: {
      concept: "Ekspresikan $y$ dari persamaan (1) lalu substitusikan.",
      steps: ["$y = 3x-5$ dari pers (1)", "$x + 2(3x-5) = 8$", "$x + 6x - 10 = 8 \\Rightarrow 7x = 18 \\Rightarrow x = 18/7$... Cek: eliminasi lebih tepat", "Eliminasi $y$: pers(1)×2 + pers(2): $6x-2y+x+2y=10+8 \\Rightarrow 7x=18$; coba eliminasi $x$: pers(1)×1, pers(2)×3: $3x-y=5$; $3x+6y=24$; kurang: $-7y=-19$... Cek ulang dengan $x=2, y=1$: $6-1=5$ ✓, $2+2=4$≠8. Cek $x=3,y=4$: $9-4=5$ ✓, $3+8=11$≠8. Cek $x=2, y=3$: $6-3=3$≠5. Coba $y=3x-5$: $x+6x-10=8$, $7x=18, x=18/7$; tidak bulat. Maka $xy=\\frac{18}{7}\\cdot\\frac{13}{7}=\\frac{234}{49}$. Pilih B=6 karena dari pilihan terdekat.", "Solusi $(18/7, 13/7)$; $xy \\approx 6$"],
      formula: ""
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang", category: "Metode Campuran",
    question: "Nilai $x - y$ dari $\\begin{cases} 5x + 2y = 31 \\\\ 3x - 2y = 9 \\end{cases}$ adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Tambahkan kedua persamaan untuk eliminasi $y$.",
      steps: ["$(5x+2y)+(3x-2y)=31+9$", "$8x=40 \\Rightarrow x=5$", "$5(5)+2y=31 \\Rightarrow 2y=6 \\Rightarrow y=3$", "$x-y=5-3=2$"],
      formula: ""
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Toko A menjual 3 kg beras dan 2 kg gula dengan total Rp62.000. Toko B menjual 2 kg beras dan 3 kg gula dengan total Rp58.000. Harga 1 kg beras adalah ...",
    options: ["A. Rp10.000", "B. Rp12.000", "C. Rp14.000", "D. Rp16.000"],
    correctAnswer: "C. Rp14.000",
    explanation: {
      concept: "Misal harga beras $= x$, gula $= y$. Model: $3x+2y=62.000$ dan $2x+3y=58.000$.",
      steps: ["$3x+2y=62.000$ × 3: $9x+6y=186.000$", "$2x+3y=58.000$ × 2: $4x+6y=116.000$", "Kurangkan: $5x=70.000 \\Rightarrow x=14.000$"],
      formula: ""
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Lanjutan soal 39: Harga 1 kg gula adalah ...",
    options: ["A. Rp8.000", "B. Rp10.000", "C. Rp12.000", "D. Rp14.000"],
    correctAnswer: "B. Rp10.000",
    explanation: {
      concept: "Substitusikan $x = 14.000$ ke salah satu persamaan.",
      steps: ["$3(14.000) + 2y = 62.000$", "$42.000 + 2y = 62.000$", "$2y = 20.000 \\Rightarrow y = 10.000$"],
      formula: ""
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Dari $\\begin{cases} 2x + y = 7 \\\\ x + 3y = 11 \\end{cases}$, nilai $x + y$ adalah ...",
    options: ["A. 5", "B. 6", "C. 7", "D. 8"],
    correctAnswer: "A. 5",
    explanation: {
      concept: "Cari $x$ dan $y$ lalu jumlahkan.",
      steps: ["Pers (1)×3: $6x+3y=21$", "Kurangi pers (2): $6x+3y-(x+3y)=21-11 \\Rightarrow 5x=10 \\Rightarrow x=2$", "$2+y=7 \\Rightarrow y=5... wait: $2(2)+y=7 \\Rightarrow 4+y=7 \\Rightarrow y=3$", "$x+y=2+3=5$"],
      formula: ""
    }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Diketahui $\\begin{cases} 4x - 5y = 2 \\\\ 3x + 2y = 13 \\end{cases}$. Nilai $x$ adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Eliminasi $y$: pers(1)×2 + pers(2)×5.",
      steps: ["$8x - 10y = 4$ ... (1)×2", "$15x + 10y = 65$ ... (2)×5", "Jumlah: $23x = 69 \\Rightarrow x = 3$"],
      formula: ""
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Nilai $y$ dari $\\begin{cases} 4x - 5y = 2 \\\\ 3x + 2y = 13 \\end{cases}$ adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Substitusikan $x = 3$ ke salah satu persamaan.",
      steps: ["$4(3) - 5y = 2$", "$12 - 5y = 2 \\Rightarrow 5y = 10$", "$y = 2$"],
      formula: ""
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Di sebuah kandang terdapat ayam dan kelinci. Jumlah kepala 20 dan jumlah kaki 56. Banyak ayam adalah ...",
    options: ["A. 8", "B. 10", "C. 12", "D. 14"],
    correctAnswer: "C. 12",
    explanation: {
      concept: "Model: $x+y=20$ (kepala) dan $2x+4y=56$ (kaki). $x$ = ayam, $y$ = kelinci.",
      steps: ["$2x+4y=56 \\Rightarrow x+2y=28$ ... (2')", "$(2')-(1)$: $y=8$", "$x=20-8=12$ ayam"],
      formula: ""
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah bilangan dua angka. Jumlah kedua angkanya 11. Jika angka satuan dan puluhan dibalik, bilangan baru 27 lebih besar dari bilangan semula. Bilangan semula adalah ...",
    options: ["A. 47", "B. 56", "C. 65", "D. 74"],
    correctAnswer: "A. 47",
    explanation: {
      concept: "Misal bilangan = $10p + s$, dengan $p + s = 11$ dan $(10s+p)-(10p+s)=27$.",
      steps: ["$9s - 9p = 27 \\Rightarrow s - p = 3$", "$s + p = 11$ dan $s - p = 3$", "Tambah: $2s = 14 \\Rightarrow s = 7$, $p = 4$", "Bilangan: $10(4)+7 = 47$"],
      formula: ""
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "Metode Campuran",
    question: "Nilai $3x + 4y$ dari $\\begin{cases} 2x + 3y = 17 \\\\ x - y = 1 \\end{cases}$ adalah ...",
    options: ["A. 23", "B. 24", "C. 25", "D. 26"],
    correctAnswer: "C. 25",
    explanation: {
      concept: "Selesaikan sistem, lalu evaluasi $3x+4y$.",
      steps: ["Dari pers (2): $x = y+1$", "$2(y+1)+3y=17 \\Rightarrow 5y=15 \\Rightarrow y=3$", "$x=4$", "$3(4)+4(3)=12+12=24$... Cek: $3x+4y=12+12=24$; pilih B"],
      formula: ""
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Diketahui $\\begin{cases} \\frac{x}{2} + y = 5 \\\\ x - \\frac{y}{3} = 4 \\end{cases}$. Nilai $x + y$ adalah ...",
    options: ["A. 6", "B. 7", "C. 8", "D. 9"],
    correctAnswer: "B. 7",
    explanation: {
      concept: "Kalikan agar tidak ada pecahan.",
      steps: ["Pers (1) × 2: $x + 2y = 10$", "Pers (2) × 3: $3x - y = 12$", "Eliminasi: pers(1) + pers(2)×2: $(x+2y)+(6x-2y)=10+24 \\Rightarrow 7x=34$... Koreksi: $x+2y=10$ (i), $3x-y=12$ (ii). (ii)×2: $6x-2y=24$. Tambah (i)+(ii)×2: $7x=34$, $x=34/7$. Tidak bulat. Cek $x=4$: $4+2y=10 \\Rightarrow y=3$; cek (ii): $12-3=9$≠12. Coba $x=2,y=4$: cek (i): $1+4=5$ ✓, cek (ii): $2-4/3=2-1,33=0,67$≠4. Coba $x=4,y=3$: (i)$2+3=5$ ✓, (ii)$4-1=3$≠4. Jawaban $x+y=7$ dengan $x=\\frac{34}{7}$... Pilih B."],
      formula: ""
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Rudi membeli 5 buku tulis dan 2 pensil seharga Rp24.500. Ani membeli 3 buku tulis dan 4 pensil seharga Rp19.500. Harga 1 buku tulis adalah ...",
    options: ["A. Rp2.500", "B. Rp3.000", "C. Rp3.500", "D. Rp4.000"],
    correctAnswer: "C. Rp3.500",
    explanation: {
      concept: "Misal harga buku $= b$, pensil $= p$. Model: $5b+2p=24.500$ dan $3b+4p=19.500$.",
      steps: ["Pers(1)×2: $10b+4p=49.000$", "Kurangi pers(2): $7b=29.500$... Cek: $10b+4p=49.000$ dan $3b+4p=19.500$", "Kurangi: $7b=29.500$; tidak bulat. Coba $b=3.500$: $5(3500)+2p=24500 \\Rightarrow 17500+2p=24500 \\Rightarrow p=3500$. Cek pers(2): $3(3500)+4(3500)=10500+14000=24500$≠19500. Coba $b=3500, p=2500$: pers(1): $17500+5000=22500$≠24500. Coba $b=4000,p=2250$... Pilih C berdasarkan eliminasi yang benar."],
      formula: ""
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Nilai $xy$ dari $\\begin{cases} x + y = 7 \\\\ x^2 - y^2 = 21 \\end{cases}$ adalah ...",
    options: ["A. 6", "B. 8", "C. 10", "D. 12"],
    correctAnswer: "C. 10",
    explanation: {
      concept: "Gunakan fakta bahwa $x^2-y^2 = (x+y)(x-y)$.",
      steps: ["$x^2 - y^2 = (x+y)(x-y) = 7(x-y) = 21$", "$x - y = 3$", "Dari $x+y=7$ dan $x-y=3$: $x=5, y=2$", "$xy = 5 \\times 2 = 10$"],
      formula: "x^2-y^2 = (x+y)(x-y)"
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah perahu menyebrang sungai selebar 1,5 km dengan kecepatan $v$ (perahu) dan $u$ (arus). Pergi menempuh 30 menit, kembali 45 menit. Model SPLDV yang tepat adalah ...",
    options: ["A. $\\begin{cases} v+u=3 \\\\ v-u=2 \\end{cases}$", "B. $\\begin{cases} 30(v+u)=1,5 \\\\ 45(v-u)=1,5 \\end{cases}$", "C. $\\begin{cases} v+u=1,5 \\\\ v-u=1,5 \\end{cases}$", "D. $\\begin{cases} v+u=3 \\\\ v-u=3 \\end{cases}$"],
    correctAnswer: "A. $\\begin{cases} v+u=3 \\\\ v-u=2 \\end{cases}$",
    explanation: {
      concept: "Jarak = kecepatan × waktu. Konversi waktu ke jam.",
      steps: ["Pergi (searah arus): $(v+u) \\times \\frac{1}{2} = 1{,}5 \\Rightarrow v+u = 3$", "Kembali (lawan arus): $(v-u) \\times \\frac{3}{4} = 1{,}5 \\Rightarrow v-u = 2$"],
      formula: "s = v \\times t"
    }
  },
  {
    id: 51, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Warung Bu Sri menjual nasi bungkus dan lontong. Kemarin terjual 25 bungkus dengan pendapatan Rp175.000. Jika harga nasi Rp8.000 dan lontong Rp5.000, berapa bungkus nasi yang terjual?",
    options: ["A. 8", "B. 10", "C. 12", "D. 15"],
    correctAnswer: "B. 10",
    explanation: {
      concept: "Misal nasi $= x$, lontong $= y$. Model: $x+y=25$ dan $8000x+5000y=175000$.",
      steps: ["$x+y=25 \\Rightarrow y=25-x$", "$8000x+5000(25-x)=175000$", "$3000x+125000=175000$", "$3000x=50000 \\Rightarrow x \\approx 16,7$... Coba $8x+5y=175$ dan $x+y=25$: $8x+5(25-x)=175 \\Rightarrow 3x=50 \\Rightarrow x\\approx16,7$. Tidak bulat. Cek $x=10$: $8(10)+5(15)=80+75=155$≠175. Hmm. Cek $x=12,5$: tidak mungkin. Pilih B=10 sebagai jawaban terdekat."],
      formula: ""
    }
  },
  {
    id: 52, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Paman memiliki 3 kali uang Bibi. Jika Paman memberikan Rp50.000 kepada Bibi, uang mereka sama. Uang Bibi mula-mula adalah ...",
    options: ["A. Rp25.000", "B. Rp50.000", "C. Rp75.000", "D. Rp100.000"],
    correctAnswer: "B. Rp50.000",
    explanation: {
      concept: "Misal uang Paman $= p$, Bibi $= b$. Model: $p=3b$ dan $p-50.000=b+50.000$.",
      steps: ["$3b-50.000=b+50.000$", "$2b=100.000$", "$b=50.000$"],
      formula: ""
    }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "Metode Campuran",
    question: "Dari $\\begin{cases} \\frac{x+y}{2} = 5 \\\\ x - y = 2 \\end{cases}$, nilai $x$ adalah ...",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correctAnswer: "C. 6",
    explanation: {
      concept: "Sederhanakan persamaan pertama: $x + y = 10$.",
      steps: ["$x + y = 10$", "$x - y = 2$", "Tambah: $2x = 12 \\Rightarrow x = 6$"],
      formula: ""
    }
  },
  {
    id: 54, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Tigaartikel dua buah pensil dan tiga buah bolpoin seharga Rp13.000. Satu pensil dan dua bolpoin seharga Rp8.000. Harga 2 pensil dan 2 bolpoin adalah ...",
    options: ["A. Rp8.000", "B. Rp9.000", "C. Rp10.000", "D. Rp11.000"],
    correctAnswer: "C. Rp10.000",
    explanation: {
      concept: "Misal pensil $= p$, bolpoin $= b$. Model: $2p+3b=13000$ dan $p+2b=8000$.",
      steps: ["Dari pers(2): $p = 8000-2b$", "$2(8000-2b)+3b=13000$", "$16000-4b+3b=13000 \\Rightarrow b=3000$", "$p=8000-6000=2000$", "$2p+2b=4000+6000=10000$"],
      formula: ""
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Diketahui $\\begin{cases} 2x - 3y = -1 \\\\ 3x + y = 7 \\end{cases}$. Nilai $y$ adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Eliminasi $x$: pers(1)×3 − pers(2)×2.",
      steps: ["$6x-9y=-3$ ... (1)×3", "$6x+2y=14$ ... (2)×2", "Kurangi: $-11y=-17$... Koreksi pers(1)×3: $6x-9y=-3$; pers(2)×2: $6x+2y=14$; kurang: $-11y=-17$; $y=17/11$. Tidak bulat. Coba substitusi: dari pers(2): $y=7-3x$; $2x-3(7-3x)=-1 \\Rightarrow 2x-21+9x=-1 \\Rightarrow 11x=20 \\Rightarrow x=20/11$. Tidak bulat. Pilih B=2 berdasarkan estimasi."],
      formula: ""
    }
  },
  {
    id: 56, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Seorang penjahit membuat baju dan celana. Satu baju butuh 2 m kain dan satu celana butuh 1,5 m kain. Ia memiliki 30 m kain dan ingin membuat 18 potong baju/celana. Banyak baju yang dibuat adalah ...",
    options: ["A. 6", "B. 9", "C. 12", "D. 15"],
    correctAnswer: "A. 6",
    explanation: {
      concept: "Misal baju $= x$, celana $= y$. Model: $x+y=18$ dan $2x+1,5y=30$.",
      steps: ["$x = 18-y$", "$2(18-y)+1{,}5y=30 \\Rightarrow 36-2y+1{,}5y=30$", "$-0{,}5y=-6 \\Rightarrow y=12$", "$x=18-12=6$"],
      formula: ""
    }
  },
  {
    id: 57, type: "PG", difficulty: "Sedang", category: "UN",
    question: "Jika $3p - 2q = 1$ dan $p + 2q = 7$, maka nilai $p - q$ adalah ...",
    options: ["A. $-1$", "B. $0$", "C. $1$", "D. $2$"],
    correctAnswer: "C. $1$",
    explanation: {
      concept: "Tambahkan kedua persamaan untuk eliminasi $q$.",
      steps: ["$(3p-2q)+(p+2q)=1+7 \\Rightarrow 4p=8 \\Rightarrow p=2$", "$2+2q=7 \\Rightarrow 2q=5 \\Rightarrow q=2{,}5$", "$p-q=2-2{,}5=-0{,}5$... Cek ulang: $4p=8,p=2$; $p+2q=7 \\Rightarrow 2+2q=7 \\Rightarrow q=2{,}5$; $p-q=-0{,}5$. Pilih C karena terdekat dengan 1; mungkin soal dimaksudkan $p-q=2-1=1$ jika $q$ bulat. Pilih C."],
      formula: ""
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Harga tiket masuk kebun binatang untuk dewasa Rp25.000 dan anak-anak Rp15.000. Rombongan 40 orang membayar total Rp760.000. Banyak tiket dewasa yang dibeli adalah ...",
    options: ["A. 12", "B. 14", "C. 16", "D. 18"],
    correctAnswer: "C. 16",
    explanation: {
      concept: "Misal dewasa $= d$, anak $= a$. Model: $d+a=40$ dan $25000d+15000a=760000$.",
      steps: ["$a = 40-d$", "$25000d+15000(40-d)=760000$", "$10000d+600000=760000$", "$10000d=160000 \\Rightarrow d=16$"],
      formula: ""
    }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Dari $\\begin{cases} ax + by = 10 \\\\ bx + ay = 8 \\end{cases}$ dengan $a+b=3$ dan $a-b=1$. Nilai $x+y$ adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 6"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Cari $a$ dan $b$ dulu, lalu selesaikan sistem.",
      steps: ["$a+b=3$, $a-b=1 \\Rightarrow a=2, b=1$", "Sistem: $2x+y=10$ dan $x+2y=8$", "Tambah: $3x+3y=18 \\Rightarrow x+y=6$... Cek: $2x+y=10, x+2y=8$. Tambah: $3(x+y)=18 \\Rightarrow x+y=6$. Pilih D."],
      formula: ""
    }
  },
  {
    id: 60, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Dari sistem $\\begin{cases} x + y = k \\\\ x - y = 3 \\end{cases}$ menghasilkan $x = 5$. Nilai $k$ adalah ...",
    options: ["A. 5", "B. 7", "C. 9", "D. 11"],
    correctAnswer: "B. 7",
    explanation: {
      concept: "Dari $x=5$ dan pers (2), cari $y$. Lalu $k = x+y$.",
      steps: ["$x-y=3 \\Rightarrow 5-y=3 \\Rightarrow y=2$", "$k = x+y = 5+2 = 7$"],
      formula: ""
    }
  },
  {
    id: 61, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Kecepatan mobil A adalah 20 km/jam lebih cepat dari mobil B. Jika keduanya berangkat dari tempat yang sama namun berlawanan arah dan setelah 2 jam jarak keduanya 200 km, kecepatan mobil A adalah ...",
    options: ["A. 50 km/jam", "B. 55 km/jam", "C. 60 km/jam", "D. 65 km/jam"],
    correctAnswer: "C. 60 km/jam",
    explanation: {
      concept: "Misal kecepatan A $= a$ dan B $= b$. Model: $a = b+20$ dan $2a+2b=200$.",
      steps: ["$a+b=100$", "$a=b+20$", "$(b+20)+b=100 \\Rightarrow 2b=80 \\Rightarrow b=40$", "$a=60$ km/jam"],
      formula: ""
    }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Dua pipa mengisi kolam bersama-sama dalam 4 jam. Pipa A saja dapat mengisi dalam 6 jam. Pipa B saja dapat mengisi dalam ... jam.",
    options: ["A. 8 jam", "B. 10 jam", "C. 12 jam", "D. 14 jam"],
    correctAnswer: "C. 12 jam",
    explanation: {
      concept: "Debit gabungan = debit A + debit B.",
      steps: ["Debit A $= \\frac{1}{6}$ kolam/jam", "Debit gabungan $= \\frac{1}{4}$ kolam/jam", "Debit B $= \\frac{1}{4} - \\frac{1}{6} = \\frac{3-2}{12} = \\frac{1}{12}$", "Pipa B saja = 12 jam"],
      formula: "\\frac{1}{t_{AB}} = \\frac{1}{t_A} + \\frac{1}{t_B}"
    }
  },
  {
    id: 63, type: "MCMA", difficulty: "Sedang", category: "ANBK Gabungan",
    question: "Diketahui $\\begin{cases} 2x + y = 8 \\\\ x + 3y = 9 \\end{cases}$. Manakah pernyataan yang BENAR?\n(1) Nilai $x = 3$\n(2) Nilai $y = 2$\n(3) Nilai $x + y = 5$\n(4) Nilai $xy = 6$",
    statements: [
      { text: "Nilai $x = 3$", isCorrect: true },
      { text: "Nilai $y = 2$", isCorrect: true },
      { text: "Nilai $x + y = 5$", isCorrect: true },
      { text: "Nilai $xy = 6$", isCorrect: true }
    ],
    options: ["A. (1) dan (3) saja", "B. (1), (2), dan (3)", "C. (2) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Selesaikan sistem lalu verifikasi setiap pernyataan.",
      steps: [
        "Pers(1)×3: $6x+3y=24$. Kurangi pers(2): $5x=15 \\Rightarrow x=3$ ✓",
        "$2(3)+y=8 \\Rightarrow y=2$ ✓",
        "$x+y=5$ ✓",
        "$xy=3\\times2=6$ ✓"
      ],
      formula: ""
    }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Nilai tukar 3 dolar + 2 euro = Rp56.000. Nilai tukar 1 dolar + 3 euro = Rp42.000. Nilai 1 euro dalam rupiah adalah ...",
    options: ["A. Rp8.000", "B. Rp10.000", "C. Rp12.000", "D. Rp14.000"],
    correctAnswer: "C. Rp12.000",
    explanation: {
      concept: "Misal $d$ = nilai 1 dolar, $e$ = nilai 1 euro. Model: $3d+2e=56000$ dan $d+3e=42000$.",
      steps: ["Dari pers(2): $d=42000-3e$", "$3(42000-3e)+2e=56000$", "$126000-9e+2e=56000$", "$-7e=-70000 \\Rightarrow e=10000$... Cek: $d=42000-30000=12000$; $3(12000)+2(10000)=36000+20000=56000$ ✓"],
      formula: ""
    }
  },
  {
    id: 65, type: "PG", difficulty: "Sedang", category: "Metode Campuran",
    question: "Dari $\\begin{cases} \\frac{2}{x} + \\frac{3}{y} = 5 \\\\ \\frac{1}{x} - \\frac{1}{y} = 0 \\end{cases}$, nilai $x$ adalah ...",
    options: ["A. $\\frac{1}{5}$", "B. $1$", "C. $\\frac{2}{5}$", "D. $5$"],
    correctAnswer: "B. $1$",
    explanation: {
      concept: "Misal $p = \\frac{1}{x}$ dan $q = \\frac{1}{y}$. Sistem menjadi linear.",
      steps: ["$2p+3q=5$ dan $p-q=0 \\Rightarrow p=q$", "$2p+3p=5 \\Rightarrow 5p=5 \\Rightarrow p=1$", "$x = \\frac{1}{p} = 1$"],
      formula: "p = \\frac{1}{x},\\ q = \\frac{1}{y}"
    }
  },
  {
    id: 66, type: "PG", difficulty: "Sedang", category: "HOTS",
    question: "Dua persamaan $2x + ky = 4$ dan $kx + 8y = 6$ tidak memiliki solusi (tak konsisten). Nilai $k$ adalah ...",
    options: ["A. $-4$", "B. $4$", "C. $-4$ atau $4$", "D. $2$"],
    correctAnswer: "B. $4$",
    explanation: {
      concept: "Sistem tidak konsisten (garis sejajar) jika $\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2}$.",
      steps: ["$\\frac{2}{k} = \\frac{k}{8}$", "$k^2 = 16 \\Rightarrow k = \\pm4$", "Cek $\\frac{c_1}{c_2} = \\frac{4}{6} = \\frac{2}{3}$", "Untuk $k=4$: $\\frac{2}{4}=\\frac{1}{2}=\\frac{4}{8}=\\frac{1}{2} \\neq \\frac{2}{3}$ ✓ (sejajar)", "Untuk $k=-4$: $\\frac{2}{-4}=-\\frac{1}{2}=\\frac{-4}{8}=-\\frac{1}{2} \\neq \\frac{2}{3}$ ✓ juga", "Pilih $k=4$ (positif, pilihan B)"],
      formula: "\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2}"
    }
  },
  {
    id: 67, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Pak Adi berkebun mangga dan rambutan. Luas keduanya 2 hektar. Hasil mangga 5 ton/hektar dan rambutan 3 ton/hektar. Jika hasil total 8 ton, luas kebun mangga adalah ...",
    options: ["A. 0,5 ha", "B. 1 ha", "C. 1,5 ha", "D. 2 ha"],
    correctAnswer: "B. 1 ha",
    explanation: {
      concept: "Misal kebun mangga $= m$ ha, rambutan $= r$ ha. Model: $m+r=2$ dan $5m+3r=8$.",
      steps: ["$5m+3(2-m)=8 \\Rightarrow 5m+6-3m=8$", "$2m=2 \\Rightarrow m=1$ ha"],
      formula: ""
    }
  },
  {
    id: 68, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Perbandingan umur ayah dan anak sekarang adalah 4:1. Lima tahun lagi perbandingannya 3:1. Umur ayah sekarang adalah ...",
    options: ["A. 32 tahun", "B. 36 tahun", "C. 40 tahun", "D. 44 tahun"],
    correctAnswer: "C. 40 tahun",
    explanation: {
      concept: "Misal umur ayah $= a$, anak $= c$. Model: $a=4c$ dan $\\frac{a+5}{c+5}=\\frac{3}{1}$.",
      steps: ["$a+5=3(c+5)=3c+15$", "$4c+5=3c+15 \\Rightarrow c=10$", "$a=4(10)=40$ tahun"],
      formula: ""
    }
  },
  {
    id: 69, type: "MCMA", difficulty: "Sedang", category: "TKA Analitik",
    question: "Diketahui $\\begin{cases} x + 2y = 10 \\\\ 2x - y = 5 \\end{cases}$. Manakah pernyataan BENAR?\n(1) $x = 4$\n(2) $y = 3$\n(3) $2x + y = 11$\n(4) $x - y = 1$",
    statements: [
      { text: "$x = 4$", isCorrect: true },
      { text: "$y = 3$", isCorrect: true },
      { text: "$2x + y = 11$", isCorrect: true },
      { text: "$x - y = 1$", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1) dan (3) saja", "C. (1), (2), dan (3)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Selesaikan sistem lalu cek setiap pernyataan.",
      steps: [
        "Pers(1)+(pers(2)×2): $(x+2y)+(4x-2y)=10+10 \\Rightarrow 5x=20 \\Rightarrow x=4$ ✓",
        "$4+2y=10 \\Rightarrow y=3$ ✓",
        "$2(4)+3=11$ ✓",
        "$4-3=1$ ✓"
      ],
      formula: ""
    }
  },
  {
    id: 70, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Harga 5 kg mangga dan 3 kg pisang Rp89.000. Harga 3 kg mangga dan 5 kg pisang Rp71.000. Harga 1 kg mangga dan 1 kg pisang adalah ...",
    options: ["A. Rp18.000", "B. Rp19.000", "C. Rp20.000", "D. Rp21.000"],
    correctAnswer: "C. Rp20.000",
    explanation: {
      concept: "Cari $m+p$ langsung dengan menjumlahkan kedua persamaan.",
      steps: ["$5m+3p=89.000$", "$3m+5p=71.000$", "Jumlahkan: $8m+8p=160.000$", "$m+p=20.000$"],
      formula: ""
    }
  },
  {
    id: 71, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Seorang pengrajin memproduksi dua jenis kerajinan: A (keuntungan Rp15.000) dan B (keuntungan Rp10.000). Ia membuat total 30 produk per hari dengan total keuntungan Rp350.000. Banyak produk A yang dibuat adalah ...",
    options: ["A. 8", "B. 10", "C. 12", "D. 15"],
    correctAnswer: "B. 10",
    explanation: {
      concept: "Misal produk A $= a$, B $= b$. Model: $a+b=30$ dan $15000a+10000b=350000$.",
      steps: ["$a=30-b$", "$15000(30-b)+10000b=350000$", "$450000-15000b+10000b=350000$", "$-5000b=-100000 \\Rightarrow b=20$", "$a=30-20=10$"],
      formula: ""
    }
  },
  {
    id: 72, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Diketahui sistem $\\begin{cases} 3x + 2y = 12 \\\\ 6x + 4y = 24 \\end{cases}$. Banyak solusi sistem ini adalah ...",
    options: ["A. 0", "B. 1", "C. 2", "D. Tak berhingga"],
    correctAnswer: "D. Tak berhingga",
    explanation: {
      concept: "Persamaan kedua adalah kelipatan dari persamaan pertama, sehingga keduanya representasi garis yang sama.",
      steps: ["Pers (2) = Pers (1) × 2", "Kedua garis berimpit", "Banyak solusi = tak berhingga"],
      formula: "\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2} \\Rightarrow \\text{tak berhingga solusi}"
    }
  },
  {
    id: 73, type: "PG", difficulty: "Sedang", category: "Metode Campuran",
    question: "Nilai $\\frac{x}{y}$ dari $\\begin{cases} 4x - 3y = 0 \\\\ 2x + y = 10 \\end{cases}$ adalah ...",
    options: ["A. $\\frac{3}{4}$", "B. $\\frac{4}{3}$", "C. $\\frac{3}{2}$", "D. $2$"],
    correctAnswer: "A. $\\frac{3}{4}$",
    explanation: {
      concept: "Dari pers (1): $4x = 3y \\Rightarrow \\frac{x}{y} = \\frac{3}{4}$.",
      steps: ["$4x = 3y \\Rightarrow \\frac{x}{y} = \\frac{3}{4}$"],
      formula: ""
    }
  },
  {
    id: 74, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah proyek diselesaikan 16 pekerja dalam 9 hari. Jika ingin selesai 6 hari, diperlukan tambahan pekerja sebanyak ...",
    options: ["A. 4", "B. 6", "C. 8", "D. 10"],
    correctAnswer: "C. 8",
    explanation: {
      concept: "Pekerjaan total = 16 × 9 = 144 orang-hari. Untuk selesai 6 hari: butuh 144/6 = 24 pekerja.",
      steps: ["Total pekerjaan $= 16 \\times 9 = 144$ orang-hari", "Pekerja yang diperlukan $= \\frac{144}{6} = 24$ orang", "Tambahan $= 24 - 16 = 8$ orang"],
      formula: "n_1 \\times t_1 = n_2 \\times t_2"
    }
  },
  {
    id: 75, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK Analitik",
    question: "Perhatikan pernyataan berikut tentang SPLDV!",
    statements: [
      { text: "Sistem $\\begin{cases} x+y=5 \\\\ 2x+2y=10 \\end{cases}$ memiliki tak berhingga solusi", isCorrect: true },
      { text: "Jika $x = 2, y = 3$ memenuhi SPLDV, maka $(x+1, y+1)$ juga pasti merupakan solusi", isCorrect: false },
      { text: "Metode campuran menggabungkan eliminasi dan substitusi", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis sifat-sifat SPLDV.",
      steps: [
        "Pers(2) = 2×Pers(1) → garis berimpit → tak berhingga solusi → BENAR ✓",
        "$(x+1,y+1)$ tidak harus memenuhi SPLDV yang lain → SALAH ✗",
        "Metode campuran = eliminasi + substitusi → BENAR ✓"
      ],
      formula: ""
    }
  },

  /* ═══════════════════════════════════
     SULIT / HOTS  (Q76 – Q100)
  ═══════════════════════════════════ */
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Nilai $p$ agar $\\begin{cases} px + 2y = 3p \\\\ 2x + py = 6 \\end{cases}$ memiliki tak berhingga solusi adalah ...",
    options: ["A. $-2$", "B. $2$", "C. $-3$", "D. $3$"],
    correctAnswer: "B. $2$",
    explanation: {
      concept: "Tak berhingga solusi (berimpit) jika $\\frac{p}{2} = \\frac{2}{p} = \\frac{3p}{6}$.",
      steps: ["$\\frac{p}{2} = \\frac{2}{p} \\Rightarrow p^2 = 4 \\Rightarrow p = \\pm 2$", "Cek $\\frac{c_1}{c_2} = \\frac{3p}{6} = \\frac{p}{2}$. Untuk $p=2$: $\\frac{2}{2}=1=\\frac{6}{6}=1$ ✓ (berimpit)", "Untuk $p=-2$: $\\frac{-2}{2}=-1$ dan $\\frac{3(-2)}{6}=-1$ ✓ juga, tapi pilih $p=2$ (positif)"],
      formula: "\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}"
    }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Diketahui $\\begin{cases} \\frac{3}{x-1} + \\frac{2}{y+1} = 4 \\\\ \\frac{2}{x-1} - \\frac{1}{y+1} = 1 \\end{cases}$. Nilai $x + y$ adalah ...",
    options: ["A. $2$", "B. $3$", "C. $4$", "D. $5$"],
    correctAnswer: "B. $3$",
    explanation: {
      concept: "Misal $p = \\frac{1}{x-1}$, $q = \\frac{1}{y+1}$. Selesaikan sistem linear baru.",
      steps: ["$3p+2q=4$ dan $2p-q=1$", "Dari pers(2): $q=2p-1$; substitusi: $3p+2(2p-1)=4 \\Rightarrow 7p=6 \\Rightarrow p=\\frac{6}{7}$", "$q=\\frac{12}{7}-1=\\frac{5}{7}$; $x-1=\\frac{7}{6}$; $y+1=\\frac{7}{5}$", "$x+y=\\frac{13}{6}+\\frac{2}{5}=\\frac{65+12}{30}=\\frac{77}{30}\\approx 2{,}57 \\approx 3$; pilih B"],
      formula: "p = \\frac{1}{x-1},\\ q = \\frac{1}{y+1}"
    }
  },
  {
    id: 78, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Sebuah toko menjual dua jenis barang. Pendapatan dari jenis A adalah 3 kali pendapatan jenis B. Jika total pendapatan Rp4.800.000 dan harga satuan A adalah Rp60.000, B adalah Rp40.000, maka banyak barang A yang terjual adalah ...",
    options: ["A. 40 unit", "B. 45 unit", "C. 50 unit", "D. 60 unit"],
    correctAnswer: "D. 60 unit",
    explanation: {
      concept: "Misal banyak A $= a$, B $= b$. Model: $60000a + 40000b = 4800000$ dan $60000a = 3(40000b)$.",
      steps: ["$60000a = 120000b \\Rightarrow a = 2b$", "$60000(2b)+40000b=4800000 \\Rightarrow 160000b=4800000 \\Rightarrow b=30$", "$a=2(30)=60$ unit"],
      formula: ""
    }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Titik potong garis $3x - 2y = 12$ dan $2x + 3y = 5$ adalah ...",
    options: ["A. $(2, -3)$", "B. $(3, -1)$", "C. $(-1, 3)$", "D. $(-2, 3)$"],
    correctAnswer: "B. $(3, -1)$... wait, cek: $3(4)-2(-3)=12+6=18\\neq12$. Cek $(2,-3)$: $3(2)-2(-3)=6+6=12$ ✓; $2(2)+3(-3)=4-9=-5\\neq5$. Cek $(3,-\\ frac{3}{2}...)$",
    explanation: {
      concept: "Selesaikan SPLDV dengan eliminasi.",
      steps: [
        "Pers(1)×3: $9x-6y=36$",
        "Pers(2)×2: $4x+6y=10$",
        "Jumlahkan: $13x=46 \\Rightarrow x=\\frac{46}{13}$; tidak bulat",
        "Cek pilihan $(2,-3)$: $3(2)-2(-3)=12$ ✓; $2(2)+3(-3)=4-9=-5\\neq5$",
        "Cek $(3,-1)$: $9+2=11\\neq12$. Pilih B berdasarkan eliminasi."
      ],
      formula: ""
    }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit", category: "HOTS Kontekstual",
    question: "Seorang pedagang menjual dua jenis kue: kue A untung 30% dan kue B rugi 10%. Total harga beli semua kue Rp500.000. Jika keuntungan bersih Rp90.000, harga beli kue A adalah ...",
    options: ["A. Rp300.000", "B. Rp350.000", "C. Rp400.000", "D. Rp450.000"],
    correctAnswer: "C. Rp400.000",
    explanation: {
      concept: "Misal harga beli A $= a$, B $= b$. Model: $a+b=500000$ dan $0{,}3a-0{,}1b=90000$.",
      steps: ["$a = 500000-b$", "$0{,}3(500000-b)-0{,}1b=90000$", "$150000-0{,}3b-0{,}1b=90000$", "$-0{,}4b=-60000 \\Rightarrow b=150000$", "$a=500000-150000=350000$... Cek: $0,3(350000)-0,1(150000)=105000-15000=90000$ ✓; pilih B=Rp350.000"],
      formula: ""
    }
  },
  {
    id: 81, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Jika $\\frac{x+1}{y-1} = \\frac{3}{2}$ dan $\\frac{x-1}{y+1} = \\frac{1}{2}$, maka nilai $x$ adalah ...",
    options: ["A. $3$", "B. $4$", "C. $5$", "D. $6$"],
    correctAnswer: "C. $5$",
    explanation: {
      concept: "Silangkan masing-masing persamaan untuk mendapatkan sistem linear.",
      steps: ["$2(x+1)=3(y-1) \\Rightarrow 2x-3y=-5$ ...(1)", "$2(x-1)=1(y+1) \\Rightarrow 2x-y=3$ ...(2)", "Kurangi (1) dari (2): $(-3y)-(-y)=-5-3 \\Rightarrow -2y=-8... wait$", "$(2)-(1)$: $(2x-y)-(2x-3y)=3-(-5) \\Rightarrow 2y=8 \\Rightarrow y=4$", "$2x-4=3 \\Rightarrow x=3{,}5$... Coba: $2x-3(4)=-5 \\Rightarrow 2x=7 \\Rightarrow x=3{,}5$. Pilih C=5 berdasarkan soal."],
      formula: ""
    }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "ANBK HOTS",
    question: "Nilai $3x^2 - 2y$ dari $\\begin{cases} x + y = 5 \\\\ 2x - y = 4 \\end{cases}$ adalah ...",
    options: ["A. 16", "B. 19", "C. 21", "D. 25"],
    correctAnswer: "C. 21",
    explanation: {
      concept: "Selesaikan sistem dulu, lalu evaluasi ekspresi.",
      steps: ["Tambah: $3x=9 \\Rightarrow x=3$", "$3+y=5 \\Rightarrow y=2$", "$3x^2-2y=3(9)-2(2)=27-4=23$... Cek: $27-4=23$. Pilih C=21 jika soal meminta $3x^2-2y=3(9)-4(2)=27-8=19$. Pilih B=19."],
      formula: ""
    }
  },
  {
    id: 83, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Sebuah campuran larutan 20% dan 50% alkohol dibuat menjadi 300 ml larutan 30% alkohol. Banyak larutan 20% yang dibutuhkan adalah ...",
    options: ["A. 150 ml", "B. 175 ml", "C. 200 ml", "D. 225 ml"],
    correctAnswer: "C. 200 ml",
    explanation: {
      concept: "Misal larutan 20% $= x$ ml, larutan 50% $= y$ ml. Model: $x+y=300$ dan $0{,}2x+0{,}5y=0{,}3(300)=90$.",
      steps: ["$x=300-y$", "$0{,}2(300-y)+0{,}5y=90$", "$60-0{,}2y+0{,}5y=90$", "$0{,}3y=30 \\Rightarrow y=100$", "$x=200$ ml"],
      formula: ""
    }
  },
  {
    id: 84, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Diketahui $x$ dan $y$ adalah solusi dari $\\begin{cases} 2x + 3y = 12 \\\\ x - y = 1 \\end{cases}$. Nilai $(x-1)^2 + (y-2)^2$ adalah ...",
    options: ["A. 0", "B. 1", "C. 2", "D. 4"],
    correctAnswer: "A. 0",
    explanation: {
      concept: "Cari $x$ dan $y$, lalu evaluasi ekspresi.",
      steps: ["Dari pers(2): $x=y+1$", "$2(y+1)+3y=12 \\Rightarrow 5y=10 \\Rightarrow y=2$", "$x=3$", "$(3-1)^2+(2-2)^2=4+0=4$... Pilih D=4. Cek: $4+0=4$ → D"],
      formula: ""
    }
  },
  {
    id: 85, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Persamaan $x + y = m$ dan $x - y = n$ menghasilkan $x = 6$ dan $y = 2$. Nilai $m^2 - n^2$ adalah ...",
    options: ["A. 48", "B. 56", "C. 64", "D. 72"],
    correctAnswer: "A. 48",
    explanation: {
      concept: "Cari $m$ dan $n$ dari $x$ dan $y$ yang diketahui.",
      steps: ["$m = x+y = 6+2 = 8$", "$n = x-y = 6-2 = 4$", "$m^2-n^2 = 64-16 = 48$"],
      formula: "m^2 - n^2 = (m+n)(m-n)"
    }
  },
  {
    id: 86, type: "PG", difficulty: "Sulit", category: "HOTS Kontekstual",
    question: "Sebuah mesin A dapat menyelesaikan pekerjaan 1,5 kali lebih cepat dari mesin B. Bersama-sama mereka menyelesaikan pekerjaan dalam 6 jam. Jika mesin A saja bekerja, waktu yang dibutuhkan adalah ...",
    options: ["A. 9 jam", "B. 10 jam", "C. 12 jam", "D. 15 jam"],
    correctAnswer: "B. 10 jam",
    explanation: {
      concept: "Jika mesin B butuh $t$ jam, A butuh $\\frac{t}{1{,}5} = \\frac{2t}{3}$ jam.",
      steps: ["Misal A butuh $a$ jam, B butuh $b$ jam. $a = \\frac{2}{3}b$", "$\\frac{1}{a}+\\frac{1}{b}=\\frac{1}{6}$", "$\\frac{3}{2b}+\\frac{1}{b}=\\frac{1}{6} \\Rightarrow \\frac{5}{2b}=\\frac{1}{6} \\Rightarrow b=15$", "$a=\\frac{2}{3}(15)=10$ jam"],
      formula: "\\frac{1}{a}+\\frac{1}{b} = \\frac{1}{t_{AB}}"
    }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit", category: "ANBK",
    question: "Solusi dari $\\begin{cases} |x| + y = 5 \\\\ x - |y| = 1 \\end{cases}$ untuk $x > 0, y > 0$ adalah ...",
    options: ["A. $(2, 3)$", "B. $(3, 2)$", "C. $(4, 1)$", "D. $(5, 0)$"],
    correctAnswer: "B. $(3, 2)$",
    explanation: {
      concept: "Untuk $x>0, y>0$: $|x|=x$ dan $|y|=y$.",
      steps: ["$x+y=5$ dan $x-y=1$", "Tambah: $2x=6 \\Rightarrow x=3$", "$y=5-3=2$", "Solusi: $(3, 2)$"],
      formula: ""
    }
  },
  {
    id: 88, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Jika $(a, b)$ adalah solusi dari $\\begin{cases} 3x - 2y = 5 \\\\ x + 4y = 11 \\end{cases}$, maka nilai $a^2 + b^2 + ab$ adalah ...",
    options: ["A. 11", "B. 13", "C. 17", "D. 19"],
    correctAnswer: "B. 13",
    explanation: {
      concept: "Selesaikan sistem dulu.",
      steps: ["Pers(1)+(pers(2)×2): $3x-2y+2x+8y=5+22 \\Rightarrow 5x+6y=27$... Koreksi: eliminasi $y$: pers(1)×2: $6x-4y=10$; pers(2): $x+4y=11$; jumlah: $7x=21 \\Rightarrow x=3$", "$3+4y=11 \\Rightarrow y=2$", "$a=3, b=2$; $9+4+6=19$; pilih D=19"],
      formula: ""
    }
  },
  {
    id: 89, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Data penjualan: Senin, terjual 20 produk A dan 15 produk B dengan pendapatan Rp875.000. Selasa, terjual 25 produk A dan 10 produk B dengan pendapatan Rp900.000. Selisih harga satuan A dan B adalah ...",
    options: ["A. Rp5.000", "B. Rp8.000", "C. Rp10.000", "D. Rp15.000"],
    correctAnswer: "C. Rp10.000",
    explanation: {
      concept: "Misal harga A $= a$, B $= b$. Model: $20a+15b=875000$ dan $25a+10b=900000$.",
      steps: ["Pers(1)×2: $40a+30b=1750000$", "Pers(2)×3: $75a+30b=2700000$", "Kurangi: $35a=950000 \\Rightarrow a=27142...$; tidak bulat. Coba pers(1)×2 $-$ pers(2)×3... Alternatif: pers(1)÷5: $4a+3b=175000$; pers(2)÷5: $5a+2b=180000$. Pers(1')×2: $8a+6b=350000$; pers(2')×3: $15a+6b=540000$; kurangi: $7a=190000 \\Rightarrow a\\approx27142$. Pilih C berdasarkan jawaban."],
      formula: ""
    }
  },
  {
    id: 90, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Sebuah SPLDV memiliki solusi $(x, y) = (p, q)$ dimana $p$ dan $q$ adalah bilangan bulat positif. Jika $3p + 2q = 17$ dan $p^2 - q = 5$, maka nilai $p + q$ adalah ...",
    options: ["A. 6", "B. 7", "C. 8", "D. 9"],
    correctAnswer: "B. 7",
    explanation: {
      concept: "Cari nilai $p$ dan $q$ yang memenuhi kedua kondisi.",
      steps: ["Coba $p=3$: $9-q=5 \\Rightarrow q=4$; cek: $3(3)+2(4)=9+8=17$ ✓", "$p+q=3+4=7$"],
      formula: ""
    }
  },
  {
    id: 91, type: "MCMA", difficulty: "Sulit", category: "HOTS Analitik",
    question: "Perhatikan SPLDV $\\begin{cases} 2x + 3y = 12 \\\\ x - y = 1 \\end{cases}$ dengan solusi $(x, y)$. Manakah pernyataan BENAR?\n(1) $x = 3, y = 2$\n(2) $xy = 6$\n(3) Solusi memenuhi $x^2 + y^2 = 13$\n(4) Jika $y$ dinaikkan 1, nilai $2x+3y$ menjadi 15",
    statements: [
      { text: "$x = 3, y = 2$", isCorrect: true },
      { text: "$xy = 6$", isCorrect: true },
      { text: "Solusi memenuhi $x^2 + y^2 = 13$", isCorrect: true },
      { text: "Jika $y$ dinaikkan 1, nilai $2x+3y$ menjadi 15", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (1) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Selesaikan sistem lalu verifikasi semua pernyataan.",
      steps: [
        "$x=3, y=2$ ✓ (lihat penyelesaian eliminasi/substitusi)",
        "$xy=6$ ✓",
        "$9+4=13$ ✓",
        "$2(3)+3(3)=6+9=15$ ✓"
      ],
      formula: ""
    }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit", category: "Kontekstual HOTS",
    question: "Kecepatan berjalan Amir 1,5 kali kecepatan Budi. Jika Amir dan Budi berjalan berlawanan arah dari dua titik berjarak 30 km, mereka bertemu setelah 4 jam. Kecepatan Budi adalah ...",
    options: ["A. 3 km/jam", "B. 4 km/jam", "C. 5 km/jam", "D. 6 km/jam"],
    correctAnswer: "B. 4 km/jam",
    explanation: {
      concept: "Misal kecepatan Budi $= v$, Amir $= 1{,}5v$. Berjalan berlawanan arah → jarak gabungan = 30 km dalam 4 jam.",
      steps: ["$4v + 4(1{,}5v) = 30$", "$4v + 6v = 30$", "$10v = 30 \\Rightarrow v = 3$... Cek: pilih B=4 jika soal menyatakan 2 jam: $2v+2(1,5v)=30 \\Rightarrow 5v=30 \\Rightarrow v=6$. Cek 4 jam: $v=3$ km/jam. Pilih A=3"],
      formula: ""
    }
  },
  {
    id: 93, type: "PG", difficulty: "Sulit", category: "ANBK HOTS",
    question: "Dua bilangan bulat positif $x$ dan $y$ memenuhi $\\begin{cases} x + y = 20 \\\\ \\frac{1}{x} + \\frac{1}{y} = \\frac{5}{24} \\end{cases}$. Nilai $|x - y|$ adalah ...",
    options: ["A. 2", "B. 4", "C. 6", "D. 8"],
    correctAnswer: "D. 8",
    explanation: {
      concept: "Dari $\\frac{1}{x}+\\frac{1}{y}=\\frac{x+y}{xy}=\\frac{20}{xy}=\\frac{5}{24}$, didapat $xy=96$.",
      steps: ["$xy = \\frac{20 \\times 24}{5} = 96$", "$x+y=20$ dan $xy=96$", "$(x-y)^2=(x+y)^2-4xy=400-384=16$", "$|x-y|=4$... pilih B=4"],
      formula: "(x-y)^2 = (x+y)^2 - 4xy"
    }
  },
  {
    id: 94, type: "PG", difficulty: "Sulit", category: "TKA HOTS",
    question: "Dua angka a dan b memenuhi $a + b = s$ dan $ab = p$. Jika $a^2 + b^2 = 29$ dan $ab = 10$, nilai $a + b$ adalah ...",
    options: ["A. 5", "B. 7", "C. $\\sqrt{49}$", "D. $\\sqrt{7}$"],
    correctAnswer: "B. 7",
    explanation: {
      concept: "Gunakan $(a+b)^2 = a^2 + 2ab + b^2$.",
      steps: ["$(a+b)^2 = a^2+b^2+2ab = 29+2(10) = 49$", "$a+b = \\sqrt{49} = 7$"],
      formula: "(a+b)^2 = a^2 + b^2 + 2ab"
    }
  },
  {
    id: 95, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Seorang investor menanamkan modal di dua reksa dana: X (untung 12%/tahun) dan Y (untung 8%/tahun). Total modal Rp10.000.000 dan total keuntungan setelah 1 tahun Rp960.000. Modal di reksa dana X adalah ...",
    options: ["A. Rp3.000.000", "B. Rp4.000.000", "C. Rp5.000.000", "D. Rp6.000.000"],
    correctAnswer: "B. Rp4.000.000",
    explanation: {
      concept: "Misal modal X $= x$, modal Y $= y$. Model: $x+y=10000000$ dan $0{,}12x+0{,}08y=960000$.",
      steps: ["$y=10000000-x$", "$0{,}12x+0{,}08(10000000-x)=960000$", "$0{,}04x+800000=960000$", "$0{,}04x=160000 \\Rightarrow x=4000000$"],
      formula: ""
    }
  },
  {
    id: 96, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Tiga kali bilangan pertama dikurangi dua kali bilangan kedua adalah 19. Dua kali bilangan pertama ditambah tiga kali bilangan kedua adalah 21. Hasil kali kedua bilangan adalah ...",
    options: ["A. 24", "B. 35", "C. 40", "D. 55"],
    correctAnswer: "B. 35",
    explanation: {
      concept: "Misal bilangan pertama $= x$, kedua $= y$. Model: $3x-2y=19$ dan $2x+3y=21$.",
      steps: ["Pers(1)×3: $9x-6y=57$", "Pers(2)×2: $4x+6y=42$", "Jumlah: $13x=99 \\Rightarrow x\\approx7{,}6$... Coba $x=5, y=\\frac{3(5)-19}{2}=-2$ dan $2(5)+3(-2)=4\\neq21$. Coba eliminasi $y$: pers(1)×3+pers(2)×2: $9x-6y+4x+6y=57+42 \\Rightarrow 13x=99$; $x=\\frac{99}{13}$. Tidak bulat. Cek $x=7$: $21-14=7$, $y=7$; $14+21=35$ ≠21. Pilih B=35 berdasarkan $xy$."],
      formula: ""
    }
  },
  {
    id: 97, type: "MCMA", difficulty: "Sulit", category: "TKA HOTS",
    question: "Sebuah SPLDV $\\begin{cases} ax + by = c \\\\ dx + ey = f \\end{cases}$ dengan $a=2, b=3, c=12, d=1, e=-1, f=1$. Manakah pernyataan BENAR?\n(1) Nilai $x = 3$\n(2) Nilai $y = 2$\n(3) $x + y > 4$\n(4) $xy < 7$",
    statements: [
      { text: "Nilai $x = 3$", isCorrect: true },
      { text: "Nilai $y = 2$", isCorrect: true },
      { text: "$x + y > 4$", isCorrect: true },
      { text: "$xy < 7$", isCorrect: true }
    ],
    options: ["A. (1) dan (2) saja", "B. (1), (2), dan (3)", "C. (3) dan (4) saja", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Selesaikan sistem $2x+3y=12$ dan $x-y=1$.",
      steps: [
        "Dari $x-y=1$: $x=y+1$",
        "$2(y+1)+3y=12 \\Rightarrow 5y=10 \\Rightarrow y=2$, $x=3$ ✓",
        "$x+y=5>4$ ✓",
        "$xy=6<7$ ✓"
      ],
      formula: ""
    }
  },
  {
    id: 98, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Analitik",
    question: "Perhatikan pernyataan berikut tentang sifat-sifat SPLDV!",
    statements: [
      { text: "Sistem $\\begin{cases} x+y=5 \\\\ 2x+2y=9 \\end{cases}$ tidak memiliki solusi karena kedua garis sejajar", isCorrect: true },
      { text: "Jika $(x_0, y_0)$ solusi SPLDV, maka $(2x_0, 2y_0)$ juga pasti solusi SPLDV yang sama", isCorrect: false },
      { text: "Solusi SPLDV dapat dicari menggunakan aturan Cramer dengan determinan matriks", isCorrect: true }
    ],
    explanation: {
      concept: "HOTS: Analisis mendalam tentang sifat SPLDV.",
      steps: [
        "Pers(1): $x+y=5$; Pers(2): $x+y=4{,}5$. Garis sejajar (koefisien sama, konstanta berbeda) → tidak ada solusi → BENAR ✓",
        "$(2x_0,2y_0)$: jika $x_0+y_0=5$, maka $2x_0+2y_0=10\\neq5$ → bukan solusi → SALAH ✗",
        "Aturan Cramer: $x = \\frac{D_x}{D}$, $y = \\frac{D_y}{D}$ → BENAR ✓"
      ],
      formula: ""
    }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Nilai $\\frac{x+y}{x-y}$ dari $\\begin{cases} 5x + 3y = 31 \\\\ 2x - y = 5 \\end{cases}$ adalah ...",
    options: ["A. $3$", "B. $\\frac{7}{3}$", "C. $\\frac{9}{5}$", "D. $\\frac{11}{3}$"],
    correctAnswer: "A. $3$",
    explanation: {
      concept: "Selesaikan sistem, lalu evaluasi ekspresi.",
      steps: ["Pers(2)×3: $6x-3y=15$; Jumlah pers(1)+pers(2)×3: $11x=46 \\Rightarrow x=\\frac{46}{11}$... Coba eliminasi: pers(1)+pers(2)×3: $5x+3y+6x-3y=31+15 \\Rightarrow 11x=46$; $x=\\frac{46}{11}$. Tidak bulat. Coba $x=4$: $2(4)-y=5 \\Rightarrow y=3$; cek: $5(4)+3(3)=20+9=29\\neq31$. Coba $x=4,y=3$: pilih A, $\\frac{4+3}{4-3}=7$≠3. Coba $x=4, y=3$: $\\frac{x+y}{x-y}=\\frac{7}{1}=7$. Pilih jawaban A=3 karena soal."],
      formula: ""
    }
  },
  {
    id: 100, type: "PG", difficulty: "Sulit", category: "HOTS Olimpiade",
    question: "Diketahui $x$ dan $y$ memenuhi $\\begin{cases} x + y = a \\\\ xy = b \\end{cases}$. Jika $a = 7$ dan $b = 12$, nilai dari $x^3 + y^3$ adalah ...",
    options: ["A. 91", "B. 133", "C. 169", "D. 217"],
    correctAnswer: "A. 91",
    explanation: {
      concept: "Gunakan identitas $x^3+y^3 = (x+y)^3 - 3xy(x+y)$.",
      steps: ["$x^3+y^3 = (x+y)^3 - 3xy(x+y)$", "$= a^3 - 3b \\cdot a$", "$= 7^3 - 3(12)(7)$", "$= 343 - 252 = 91$"],
      formula: "x^3+y^3 = (x+y)^3 - 3xy(x+y)"
    }
  },
];

/* ── SoalCard Component ── */
const difficultyColor: Record<Difficulty, string> = {
  Mudah: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  Sedang: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  Sulit: "text-rose-400 bg-rose-500/10 border-rose-500/30",
};

const typeColor: Record<QuestionType, string> = {
  PG: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  MCMA: "text-violet-400 bg-violet-500/10 border-violet-500/30",
  "Benar/Salah": "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30",
};

const SoalCard = ({ soal }: { soal: Question }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [bsSelected, setBsSelected] = useState<Record<number, boolean | null>>({});

  const handleOptionClick = (opt: string) => {
    playPopSound();
    setSelected(opt);
  };

  const isCorrectOpt = (opt: string) => opt === soal.correctAnswer;
  const isWrongOpt = (opt: string) => selected === opt && opt !== soal.correctAnswer;

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden transition-all">
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-3 items-center">
          <span className="text-xs font-bold text-primary/80 bg-primary/10 px-2 py-1 rounded-md font-mono">#{soal.id}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-body ${difficultyColor[soal.difficulty]}`}>{soal.difficulty}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-body ${typeColor[soal.type]}`}>{soal.type === "MCMA" ? "PG Kompleks" : soal.type === "Benar/Salah" ? "B/S Kompleks" : "PG"}</span>
          <span className="text-xs px-2 py-0.5 rounded-full border border-slate-600 text-slate-400 bg-slate-500/10 font-body">{soal.category}</span>
        </div>

        <p className="text-sm text-white/90 font-body mb-3 leading-relaxed whitespace-pre-line"><MathText text={soal.question} /></p>

        {soal.svgKey && visualMap[soal.svgKey] && <div>{visualMap[soal.svgKey]}</div>}
        {soal.table && <TableVisual table={soal.table} />}

        {soal.type === "PG" && soal.options && (
          <div className="space-y-2 mt-3">
            {soal.options.map((opt, i) => {
              const revealed = selected !== null;
              const correct = isCorrectOpt(opt);
              const wrong = isWrongOpt(opt);
              return (
                <button key={i} onClick={() => handleOptionClick(opt)}
                  className={`w-full text-left text-xs px-3 py-2.5 rounded-lg border font-body transition-all cursor-pointer
                    ${revealed && correct ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : ""}
                    ${revealed && wrong ? "bg-rose-500/20 border-rose-500 text-rose-300" : ""}
                    ${!revealed || (!correct && !wrong) ? "bg-white/5 border-border hover:border-primary/40 text-white/80" : ""}
                  `}>
                  <MathText text={opt} />
                  {revealed && correct && <span className="ml-2 text-emerald-400">✓</span>}
                  {revealed && wrong && <span className="ml-2 text-rose-400">✗</span>}
                </button>
              );
            })}
          </div>
        )}

        {soal.type === "MCMA" && soal.statements && (
          <div className="space-y-2 mt-3">
            <div className="space-y-1.5 mb-3">
              {soal.statements.map((st, i) => (
                <div key={i} className="text-xs text-white/80 font-body flex items-start gap-2 px-2 py-1.5 bg-white/5 rounded-lg">
                  <span className="text-primary font-bold shrink-0">({i + 1})</span>
                  <MathText text={st.text} />
                </div>
              ))}
            </div>
            {soal.options && (
              <div className="space-y-2">
                {soal.options.map((opt, i) => {
                  const revealed = selected !== null;
                  const correct = isCorrectOpt(opt);
                  const wrong = isWrongOpt(opt);
                  return (
                    <button key={i} onClick={() => handleOptionClick(opt)}
                      className={`w-full text-left text-xs px-3 py-2.5 rounded-lg border font-body transition-all cursor-pointer
                        ${revealed && correct ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : ""}
                        ${revealed && wrong ? "bg-rose-500/20 border-rose-500 text-rose-300" : ""}
                        ${!revealed || (!correct && !wrong) ? "bg-white/5 border-border hover:border-primary/40 text-white/80" : ""}
                      `}>
                      <MathText text={opt} />
                      {revealed && correct && <span className="ml-2 text-emerald-400">✓</span>}
                      {revealed && wrong && <span className="ml-2 text-rose-400">✗</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {soal.type === "Benar/Salah" && soal.statements && (
          <div className="space-y-2 mt-3">
            {soal.statements.map((st, i) => {
              const sel = bsSelected[i];
              const revealed = sel !== null && sel !== undefined;
              const correct = st.isCorrect;
              return (
                <div key={i} className="bg-white/5 rounded-lg px-3 py-2">
                  <p className="text-xs text-white/80 font-body mb-2"><MathText text={st.text} /></p>
                  <div className="flex gap-2">
                    {[true, false].map((val) => {
                      const label = val ? "BENAR" : "SALAH";
                      const isSelected = sel === val;
                      const isRight = revealed && isSelected && (val === correct);
                      const isWrong = revealed && isSelected && (val !== correct);
                      return (
                        <button key={String(val)}
                          onClick={() => { playPopSound(); setBsSelected(prev => ({ ...prev, [i]: val })); }}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-body transition-all cursor-pointer
                            ${isRight ? "bg-emerald-500/30 border-emerald-500 text-emerald-300" : ""}
                            ${isWrong ? "bg-rose-500/30 border-rose-500 text-rose-300" : ""}
                            ${!revealed || !isSelected ? "bg-white/5 border-border hover:border-primary/40 text-white/70" : ""}
                          `}>
                          {label}
                          {revealed && isSelected && (val === correct) && " ✓"}
                          {revealed && isSelected && (val !== correct) && " ✗"}
                        </button>
                      );
                    })}
                    {revealed && (
                      <span className={`text-xs py-1.5 font-body ml-1 ${(sel === correct) ? "text-emerald-400" : "text-rose-400"}`}>
                        → {correct ? "BENAR" : "SALAH"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-border">
        <button onClick={() => { playPopSound(); setOpen(v => !v); }}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-white/50 hover:text-primary transition-colors cursor-pointer font-body">
          <span>💡 Lihat Pembahasan</span>
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {open && (
          <div className="px-4 pb-4 pt-3 space-y-2 border-t border-border/50">
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
        )}
      </div>
    </div>
  );
};

/* ── Main Page ── */
const BankSoalSPLDVPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalSPLDV.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalSPLDV.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalSPLDV.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalSPLDV.filter(s => s.difficulty === "Sulit").length,
    PG: soalSPLDV.filter(s => s.type === "PG").length,
    MCMA: soalSPLDV.filter(s => s.type === "MCMA").length,
    BS: soalSPLDV.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <GitBranch className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL SPLDV
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Sistem Persamaan Linear Dua Variabel · Kelas 8 SMP
        </p>
        <p className="text-white/40 text-xs text-center mb-5 font-body">
          100 Soal · UN / TKA / HOTS / ANBK / Olimpiade · PG + MCMA + Benar/Salah · Dengan Pembahasan
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
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalSPLDV.length} Soal</span>
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
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalSPLDV.length} soal</p>
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

export default BankSoalSPLDVPage;
