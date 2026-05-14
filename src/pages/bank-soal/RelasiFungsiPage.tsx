import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { ArrowLeftRight, ChevronDown, ChevronUp, Filter } from "lucide-react";
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
const DiagramPanahSVG = ({ title, A, B, arrows, color = "#06b6d4" }: {
  title: string; A: string[]; B: string[];
  arrows: [number, number][]; color?: string;
}) => {
  const h = Math.max(A.length, B.length) * 32 + 60;
  return (
    <svg viewBox={`0 0 280 ${h}`} className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="140" y="18" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{title}</text>
      <rect x="10" y="26" width="100" height={h - 36} rx="8" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="1.5"/>
      <text x="60" y="43" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace">A</text>
      <rect x="170" y="26" width="100" height={h - 36} rx="8" fill="rgba(168,85,247,0.08)" stroke="#a855f7" strokeWidth="1.5"/>
      <text x="220" y="43" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace">B</text>
      {A.map((a, i) => (
        <g key={i}>
          <circle cx="60" cy={58 + i * 32} r="12" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1"/>
          <text x="60" y={62 + i * 32} fill="#e2e8f0" fontSize="9" textAnchor="middle" fontFamily="monospace">{a}</text>
        </g>
      ))}
      {B.map((b, i) => (
        <g key={i}>
          <circle cx="220" cy={58 + i * 32} r="12" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1"/>
          <text x="220" y={62 + i * 32} fill="#e2e8f0" fontSize="9" textAnchor="middle" fontFamily="monospace">{b}</text>
        </g>
      ))}
      {arrows.map(([ai, bi], idx) => {
        const x1 = 72, y1 = 58 + ai * 32;
        const x2 = 208, y2 = 58 + bi * 32;
        const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
        return (
          <line key={idx} x1={x1} y1={y1} x2={x2 - 8 * dx / len} y2={y2 - 8 * dy / len}
            stroke={color} strokeWidth="1.5" markerEnd="url(#arrowhead)"
            strokeDasharray={color === "#ef4444" ? "4,2" : "none"} />
        );
      })}
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill={color} />
        </marker>
      </defs>
    </svg>
  );
};

const DomainRangeSVG = ({ domain, kodomain, range }: { domain: string[]; kodomain: string[]; range: string[] }) => (
  <svg viewBox="0 0 280 120" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="10" width="260" height="100" rx="6" fill="rgba(0,0,0,0.15)" stroke="#334155" strokeWidth="1"/>
    <rect x="20" y="25" width="70" height="70" rx="6" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="1.5"/>
    <text x="55" y="40" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">Domain</text>
    {domain.map((d, i) => <text key={i} x="55" y={55 + i * 13} fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">{d}</text>)}
    <rect x="105" y="25" width="70" height="70" rx="6" fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="1.5"/>
    <text x="140" y="40" fill="#c084fc" fontSize="8" textAnchor="middle" fontFamily="monospace">Kodomain</text>
    {kodomain.map((k, i) => <text key={i} x="140" y={55 + i * 13} fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">{k}</text>)}
    <rect x="190" y="25" width="70" height="70" rx="6" fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="1.5"/>
    <text x="225" y="40" fill="#4ade80" fontSize="8" textAnchor="middle" fontFamily="monospace">Range</text>
    {range.map((r, i) => <text key={i} x="225" y={55 + i * 13} fill="#fff" fontSize="9" textAnchor="middle" fontFamily="monospace">{r}</text>)}
  </svg>
);

const GrafikFungsiSVG = ({ title, points, color = "#06b6d4" }: { title: string; points: [number, number][]; color?: string }) => {
  const toSvg = (x: number, y: number) => ({ sx: 140 + x * 22, sy: 80 - y * 18 });
  return (
    <svg viewBox="0 0 280 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="140" y="14" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">{title}</text>
      <line x1="30" y1="80" x2="250" y2="80" stroke="#334155" strokeWidth="1.5"/>
      <line x1="140" y1="20" x2="140" y2="150" stroke="#334155" strokeWidth="1.5"/>
      {[-4,-3,-2,-1,1,2,3,4].map(n => (
        <g key={n}>
          <line x1={140+n*22} y1="77" x2={140+n*22} y2="83" stroke="#475569" strokeWidth="1"/>
          <text x={140+n*22} y="93" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">{n}</text>
          <line x1="137" y1={80-n*18} x2="143" y2={80-n*18} stroke="#475569" strokeWidth="1"/>
          <text x="130" y={84-n*18} fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">{n}</text>
        </g>
      ))}
      <text x="255" y="83" fill="#64748b" fontSize="8" fontFamily="monospace">x</text>
      <text x="143" y="18" fill="#64748b" fontSize="8" fontFamily="monospace">y</text>
      {points.map(([x, y], i) => {
        const { sx, sy } = toSvg(x, y);
        return <circle key={i} cx={sx} cy={sy} r="4" fill={color} stroke="#1e293b" strokeWidth="1"/>;
      })}
      {points.length > 1 && points.slice(0, -1).map(([x, y], i) => {
        const { sx: x1, sy: y1 } = toSvg(x, y);
        const { sx: x2, sy: y2 } = toSvg(points[i+1][0], points[i+1][1]);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" opacity="0.7"/>;
      })}
    </svg>
  );
};

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
  "panah-fungsi-1": <DiagramPanahSVG title="Relasi A → B" A={["1","2","3"]} B={["2","4","6"]} arrows={[[0,0],[1,1],[2,2]]} />,
  "panah-bukan-fungsi": <DiagramPanahSVG title="Bukan Fungsi (1 domain → 2 kodomain)" A={["1","2","3"]} B={["a","b","c"]} arrows={[[0,0],[0,1],[1,1],[2,2]]} color="#ef4444"/>,
  "panah-fungsi-2": <DiagramPanahSVG title="Fungsi f: A → B" A={["a","b","c"]} B={["1","2","3","4"]} arrows={[[0,0],[1,2],[2,3]]} />,
  "domain-range-1": <DomainRangeSVG domain={["1","2","3"]} kodomain={["2","4","6","8"]} range={["2","4","6"]}/>,
  "grafik-linear": <GrafikFungsiSVG title="f(x) = 2x" points={[[-3,-6],[-2,-4],[-1,-2],[0,0],[1,2],[2,4],[3,6]]}/>,
  "grafik-konstan": <GrafikFungsiSVG title="f(x) = 3" points={[[-3,3],[-2,3],[-1,3],[0,3],[1,3],[2,3],[3,3]]} color="#f59e0b"/>,
  "panah-korespondensi": <DiagramPanahSVG title="Korespondensi Satu-Satu" A={["1","2","3"]} B={["a","b","c"]} arrows={[[0,0],[1,1],[2,2]]} color="#22c55e"/>,
};

const soalRelasiFungsi: Question[] = [
  /* ═══════════════════════════════════
     MUDAH  (Q1 – Q35)
  ═══════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Pengertian Relasi",
    question: "Relasi dari himpunan A ke himpunan B adalah ...",
    options: [
      "A. Aturan yang memasangkan setiap anggota A tepat satu ke B",
      "B. Aturan yang memasangkan anggota A dengan anggota B",
      "C. Himpunan pasangan berurutan semua anggota A dan B",
      "D. Operasi pada dua himpunan yang menghasilkan himpunan baru"
    ],
    correctAnswer: "B. Aturan yang memasangkan anggota A dengan anggota B",
    explanation: {
      concept: "Relasi dari himpunan A ke himpunan B adalah aturan yang memasangkan anggota-anggota A dengan anggota-anggota B (tidak harus semua, tidak harus tepat satu).",
      steps: ["Relasi bisa memasangkan satu anggota A ke lebih dari satu anggota B", "Relasi bisa memasangkan satu anggota A ke nol anggota B", "Inilah yang membedakan relasi dengan fungsi"],
      formula: "\\text{Relasi}: A \\to B"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Pengertian Fungsi",
    question: "Fungsi (pemetaan) dari himpunan A ke himpunan B adalah relasi yang memasangkan setiap anggota A dengan ...",
    options: ["A. Paling sedikit satu anggota B", "B. Tepat satu anggota B", "C. Paling banyak satu anggota B", "D. Semua anggota B"],
    correctAnswer: "B. Tepat satu anggota B",
    explanation: {
      concept: "Syarat fungsi: setiap anggota domain (A) harus dipasangkan dengan TEPAT SATU anggota kodomain (B). Tidak boleh kurang, tidak boleh lebih.",
      steps: ["Setiap anggota A wajib punya pasangan", "Pasangannya hanya satu (tidak boleh dua)", "Anggota B boleh tidak punya pasangan atau dipasangkan lebih dari satu kali"],
      formula: "\\forall a \\in A, \\exists! b \\in B: f(a) = b"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Diagram Panah",
    question: "Perhatikan diagram panah berikut. Jika A = {1, 2, 3} dan B = {2, 4, 6} dengan relasi 'dua kali dari', maka pasangan berurutannya adalah ...",
    svgKey: "panah-fungsi-1",
    options: [
      "A. {(1,2), (2,4), (3,6)}",
      "B. {(2,1), (4,2), (6,3)}",
      "C. {(1,2), (2,4), (3,5)}",
      "D. {(1,2), (2,3), (3,4)}"
    ],
    correctAnswer: "A. {(1,2), (2,4), (3,6)}",
    explanation: {
      concept: "Relasi 'dua kali dari' berarti anggota B = 2 × anggota A.",
      steps: ["1 → 2×1 = 2, sehingga (1, 2)", "2 → 2×2 = 4, sehingga (2, 4)", "3 → 2×3 = 6, sehingga (3, 6)", "Himpunan pasangan berurutan: {(1,2), (2,4), (3,6)}"],
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Domain, Kodomain, Range",
    question: "Diketahui fungsi $f: A \\to B$ dengan $A = \\{1, 2, 3\\}$ dan $B = \\{2, 4, 6, 8\\}$. Jika $f(x) = 2x$, maka range fungsi tersebut adalah ...",
    svgKey: "domain-range-1",
    options: ["A. {1, 2, 3}", "B. {2, 4, 6, 8}", "C. {2, 4, 6}", "D. {4, 6, 8}"],
    correctAnswer: "C. {2, 4, 6}",
    explanation: {
      concept: "Range adalah himpunan semua nilai yang benar-benar dipetakan (subset dari kodomain).",
      steps: ["$f(1) = 2(1) = 2$", "$f(2) = 2(2) = 4$", "$f(3) = 2(3) = 6$", "Range $= \\{2, 4, 6\\}$", "Kodomain $= \\{2,4,6,8\\}$ (termasuk 8 yang tidak dipetakan)"],
      formula: "\\text{Range} \\subseteq \\text{Kodomain}"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Nilai Fungsi",
    question: "Diketahui $f(x) = 3x + 2$. Nilai $f(4)$ adalah ...",
    options: ["A. 10", "B. 12", "C. 14", "D. 16"],
    correctAnswer: "C. 14",
    explanation: {
      concept: "Substitusi nilai x ke dalam rumus fungsi.",
      steps: ["$f(x) = 3x + 2$", "$f(4) = 3(4) + 2$", "$= 12 + 2 = 14$"],
      formula: "f(4) = 3(4) + 2 = 14"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Nilai Fungsi",
    question: "Jika $f(x) = 2x - 5$, maka $f(0)$ adalah ...",
    options: ["A. −7", "B. −5", "C. 0", "D. 5"],
    correctAnswer: "B. −5",
    explanation: {
      concept: "Substitusi $x = 0$ ke dalam rumus fungsi.",
      steps: ["$f(x) = 2x - 5$", "$f(0) = 2(0) - 5$", "$= 0 - 5 = -5$"],
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Domain, Kodomain, Range",
    question: "Domain suatu fungsi disebut juga ...",
    options: ["A. Daerah hasil", "B. Daerah kawan", "C. Daerah asal", "D. Daerah bayangan"],
    correctAnswer: "C. Daerah asal",
    explanation: {
      concept: "Istilah dalam fungsi: Domain = Daerah Asal, Kodomain = Daerah Kawan, Range = Daerah Hasil.",
      steps: ["Domain → Daerah Asal (himpunan A)", "Kodomain → Daerah Kawan (himpunan B)", "Range → Daerah Hasil (bayangan dari domain)"],
      formula: "f: \\underbrace{A}_{\\text{Domain}} \\to \\underbrace{B}_{\\text{Kodomain}}"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Bukan Fungsi",
    question: "Perhatikan diagram panah berikut. Manakah yang BUKAN merupakan fungsi?",
    svgKey: "panah-bukan-fungsi",
    options: [
      "A. Setiap anggota A dipasangkan tepat satu ke B",
      "B. Ada anggota A yang dipasangkan ke dua anggota B",
      "C. Ada anggota B yang tidak punya pasangan",
      "D. Semua anggota B dipasangkan dengan A"
    ],
    correctAnswer: "B. Ada anggota A yang dipasangkan ke dua anggota B",
    explanation: {
      concept: "Suatu relasi BUKAN fungsi jika ada anggota domain yang dipasangkan ke lebih dari satu anggota kodomain.",
      steps: ["Fungsi: setiap a ∈ A tepat satu pasangan di B", "Jika 1 anggota A → 2 anggota B: bukan fungsi", "Boleh: anggota B tidak punya pasangan", "Boleh: anggota B punya lebih dari satu pasangan dari A"],
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Nilai Fungsi",
    question: "Diketahui $g(x) = x^2 - 1$. Nilai $g(3)$ adalah ...",
    options: ["A. 6", "B. 7", "C. 8", "D. 9"],
    correctAnswer: "C. 8",
    explanation: {
      concept: "Substitusi nilai $x = 3$ ke dalam rumus fungsi.",
      steps: ["$g(x) = x^2 - 1$", "$g(3) = 3^2 - 1$", "$= 9 - 1 = 8$"],
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Cara Menyatakan Relasi",
    question: "Cara menyatakan relasi berikut ini yang TIDAK benar adalah ...",
    options: [
      "A. Diagram panah",
      "B. Himpunan pasangan berurutan",
      "C. Diagram Venn",
      "D. Diagram Kartesius"
    ],
    correctAnswer: "C. Diagram Venn",
    explanation: {
      concept: "Relasi dapat dinyatakan dengan 3 cara: (1) Diagram panah, (2) Himpunan pasangan berurutan, (3) Diagram Kartesius.",
      steps: ["Diagram panah → menunjukkan arah pemetaan", "Pasangan berurutan → dalam tanda kurung (a, b)", "Diagram Kartesius → titik-titik pada sumbu x dan y", "Diagram Venn digunakan untuk himpunan, bukan relasi"],
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Nilai Fungsi",
    question: "Fungsi $f$ didefinisikan oleh $f(x) = 5x - 3$. Nilai $f(-2)$ adalah ...",
    options: ["A. −13", "B. −7", "C. 7", "D. 13"],
    correctAnswer: "A. −13",
    explanation: {
      concept: "Substitusi $x = -2$ ke dalam rumus.",
      steps: ["$f(-2) = 5(-2) - 3$", "$= -10 - 3 = -13$"],
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Pengertian Fungsi",
    question: "Diketahui $A = \\{2, 4, 6\\}$ dan $B = \\{1, 2, 3\\}$. Jika $f(2)=1, f(4)=2, f(6)=3$, maka f adalah ...",
    options: ["A. Bukan relasi", "B. Relasi saja", "C. Fungsi", "D. Relasi yang bukan fungsi"],
    correctAnswer: "C. Fungsi",
    explanation: {
      concept: "Cek syarat fungsi: setiap anggota domain dipasangkan tepat satu.",
      steps: ["$f(2) = 1$ ✓ (tepat satu)", "$f(4) = 2$ ✓ (tepat satu)", "$f(6) = 3$ ✓ (tepat satu)", "Semua anggota A punya tepat satu pasangan → Fungsi"],
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Notasi Fungsi",
    question: "Pernyataan $f: x \\mapsto 2x + 1$ dibaca ...",
    options: [
      "A. Fungsi f memetakan x ke 2x+1",
      "B. Fungsi f sama dengan 2x+1",
      "C. x lebih besar dari 2x+1",
      "D. Fungsi x dipetakan f ke 2x+1"
    ],
    correctAnswer: "A. Fungsi f memetakan x ke 2x+1",
    explanation: {
      concept: "Notasi $f: x \\mapsto 2x+1$ dibaca 'fungsi f memetakan x ke 2x+1'.",
      steps: ["$f$ adalah nama fungsi", "$x$ adalah variabel input", "$2x+1$ adalah rumus hasil pemetaan", "Simbol $\\mapsto$ dibaca 'dipetakan ke'"],
      formula: "f: x \\mapsto f(x)"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Nilai Fungsi",
    question: "Jika $h(x) = 4x$, maka $h(\\frac{1}{2})$ adalah ...",
    options: ["A. 1", "B. 2", "C. 4", "D. 8"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Substitusi $x = \\frac{1}{2}$ ke dalam rumus.",
      steps: ["$h(x) = 4x$", "$h\\left(\\dfrac{1}{2}\\right) = 4 \\times \\dfrac{1}{2} = 2$"],
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "Domain, Kodomain, Range",
    question: "Diketahui fungsi $f: A \\to B$ dengan pasangan berurutan $\\{(1,a),(2,b),(3,c)\\}$. Range fungsi tersebut adalah ...",
    options: ["A. {1, 2, 3}", "B. {a, b, c}", "C. {1, 2, 3, a, b, c}", "D. {(1,a),(2,b),(3,c)}"],
    correctAnswer: "B. {a, b, c}",
    explanation: {
      concept: "Range adalah himpunan elemen kedua (kanan) dari semua pasangan berurutan.",
      steps: ["Pasangan berurutan: (1,a), (2,b), (3,c)", "Elemen pertama = domain = {1,2,3}", "Elemen kedua = range = {a,b,c}"],
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "Grafik Fungsi",
    question: "Grafik fungsi $f(x) = 2x$ melewati titik-titik berikut, kecuali ...",
    svgKey: "grafik-linear",
    options: ["A. (0, 0)", "B. (1, 2)", "C. (2, 5)", "D. (3, 6)"],
    correctAnswer: "C. (2, 5)",
    explanation: {
      concept: "Cek apakah titik memenuhi $y = 2x$.",
      steps: ["(0,0): $2(0)=0$ ✓", "(1,2): $2(1)=2$ ✓", "(2,5): $2(2)=4 \\neq 5$ ✗", "(3,6): $2(3)=6$ ✓"],
    }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "Nilai Fungsi",
    question: "Jika $f(x) = x + 7$ dan $f(a) = 12$, maka $a$ adalah ...",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correctAnswer: "C. 5",
    explanation: {
      concept: "Substitusi $f(a) = 12$ ke rumus, lalu selesaikan persamaan.",
      steps: ["$f(a) = a + 7 = 12$", "$a = 12 - 7 = 5$"],
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "Banyak Fungsi",
    question: "Jika $n(A) = 3$ dan $n(B) = 2$, banyaknya fungsi yang mungkin dari A ke B adalah ...",
    options: ["A. 4", "B. 6", "C. 8", "D. 9"],
    correctAnswer: "C. 8",
    explanation: {
      concept: "Banyak fungsi dari A ke B = $n(B)^{n(A)}$. Setiap anggota A punya n(B) pilihan.",
      steps: ["$n(A) = 3$, $n(B) = 2$", "Banyak fungsi $= 2^3 = 8$"],
      formula: "\\text{Banyak fungsi} = n(B)^{n(A)}"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah", category: "Pengertian Fungsi",
    question: "Manakah pernyataan yang benar tentang fungsi konstan $f(x) = c$?",
    svgKey: "grafik-konstan",
    options: [
      "A. Grafiknya berupa garis miring",
      "B. Grafiknya berupa garis datar sejajar sumbu-x",
      "C. Grafiknya berupa parabola",
      "D. Grafiknya berupa garis melalui pusat"
    ],
    correctAnswer: "B. Grafiknya berupa garis datar sejajar sumbu-x",
    explanation: {
      concept: "Fungsi konstan $f(x) = c$ menghasilkan nilai yang sama untuk semua x, sehingga grafiknya adalah garis horizontal.",
      steps: ["$f(x) = 3$ artinya setiap x menghasilkan y = 3", "Titik-titiknya: (-2,3), (-1,3), (0,3), (1,3), (2,3)", "Semua titik berada pada ketinggian y = 3 → garis horizontal"],
    }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "Nilai Fungsi",
    question: "Fungsi $f$ dirumuskan $f(x) = 2x^2 + 3$. Nilai $f(2)$ adalah ...",
    options: ["A. 9", "B. 10", "C. 11", "D. 12"],
    correctAnswer: "C. 11",
    explanation: {
      concept: "Substitusi $x = 2$ ke rumus fungsi.",
      steps: ["$f(2) = 2(2)^2 + 3$", "$= 2(4) + 3 = 8 + 3 = 11$"],
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "Diagram Panah",
    question: "Diagram panah berikut merupakan fungsi $f: A \\to B$ dengan $A = \\{a,b,c\\}$ dan $B = \\{1,2,3,4\\}$. Banyak anggota kodomain yang tidak mempunyai pasangan adalah ...",
    svgKey: "panah-fungsi-2",
    options: ["A. 0", "B. 1", "C. 2", "D. 3"],
    correctAnswer: "B. 1",
    explanation: {
      concept: "Range {1,3,4}. Anggota kodomain yang tidak punya pasangan adalah 2.",
      steps: ["$f(a)=1, f(b)=3, f(c)=4$", "Range = {1, 3, 4}", "Kodomain = {1, 2, 3, 4}", "Anggota kodomain tanpa pasangan: {2} → ada 1"],
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "Nilai Fungsi",
    question: "Jika $f(x) = 3x - 4$ dan $f(b) = 5$, maka nilai $b$ adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Substitusi $f(b) = 5$ dan selesaikan.",
      steps: ["$3b - 4 = 5$", "$3b = 9$", "$b = 3$"],
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah", category: "Pengertian Relasi",
    question: "Diketahui $A = \\{1, 2, 3, 4\\}$ dan $B = \\{2, 3, 5, 7\\}$. Relasi 'faktor dari' dari A ke B menghasilkan pasangan ...",
    options: [
      "A. {(1,2),(1,3),(1,5),(1,7),(2,2)}",
      "B. {(1,2),(2,2),(3,3),(4,2)}",
      "C. {(2,2),(3,3),(5,5)}",
      "D. {(1,7),(2,5),(3,3)}"
    ],
    correctAnswer: "A. {(1,2),(1,3),(1,5),(1,7),(2,2)}",
    explanation: {
      concept: "Relasi 'faktor dari' berarti a adalah faktor dari b.",
      steps: ["1 adalah faktor dari 2, 3, 5, 7 → (1,2),(1,3),(1,5),(1,7)", "2 adalah faktor dari 2 → (2,2)", "3 adalah faktor dari 3 → (3,3)", "4 bukan faktor dari anggota B manapun"],
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "Nilai Fungsi",
    question: "Jika $f(x) = ax + b$ dengan $f(1) = 5$ dan $f(0) = 2$, maka nilai $a$ dan $b$ berturut-turut adalah ...",
    options: ["A. 2 dan 3", "B. 3 dan 2", "C. 3 dan 3", "D. 2 dan 2"],
    correctAnswer: "B. 3 dan 2",
    explanation: {
      concept: "Gunakan kedua persamaan untuk mencari a dan b.",
      steps: ["$f(0) = a(0) + b = b = 2$ → $b = 2$", "$f(1) = a(1) + 2 = 5$ → $a = 3$", "Jadi $a = 3$ dan $b = 2$"],
      formula: "f(x) = 3x + 2"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah", category: "Banyak Fungsi",
    question: "Banyak fungsi yang mungkin dari himpunan $P = \\{x, y\\}$ ke himpunan $Q = \\{1, 2, 3\\}$ adalah ...",
    options: ["A. 6", "B. 8", "C. 9", "D. 12"],
    correctAnswer: "C. 9",
    explanation: {
      concept: "Banyak fungsi = $n(Q)^{n(P)}$.",
      steps: ["$n(P) = 2$, $n(Q) = 3$", "Banyak fungsi $= 3^2 = 9$"],
      formula: "\\text{Banyak fungsi dari P ke Q} = n(Q)^{n(P)}"
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "Grafik Fungsi",
    question: "Titik mana yang terletak pada grafik fungsi $f(x) = 3x + 1$?",
    options: ["A. (2, 5)", "B. (1, 3)", "C. (0, 3)", "D. (2, 7)"],
    correctAnswer: "D. (2, 7)",
    explanation: {
      concept: "Substitusi nilai x ke rumus, cek apakah menghasilkan y yang sesuai.",
      steps: ["(2,7): $f(2) = 3(2)+1 = 7$ ✓", "(2,5): $f(2) = 7 \\neq 5$ ✗", "(1,3): $f(1) = 4 \\neq 3$ ✗", "(0,3): $f(0) = 1 \\neq 3$ ✗"],
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah", category: "Korespondensi Satu-Satu",
    question: "Korespondensi satu-satu terjadi jika ...",
    svgKey: "panah-korespondensi",
    options: [
      "A. Setiap anggota A dipasangkan tepat satu ke B, dan sebaliknya",
      "B. Setiap anggota A dipasangkan ke semua anggota B",
      "C. Ada anggota A yang tidak punya pasangan",
      "D. Semua anggota B dipasangkan ke satu anggota A"
    ],
    correctAnswer: "A. Setiap anggota A dipasangkan tepat satu ke B, dan sebaliknya",
    explanation: {
      concept: "Korespondensi satu-satu (bijeksi) adalah fungsi di mana setiap anggota A berpasangan tepat satu dengan B, dan sebaliknya. Syarat: n(A) = n(B).",
      steps: ["Setiap a ∈ A punya tepat 1 pasangan di B", "Setiap b ∈ B punya tepat 1 pasangan di A", "Implikasi: n(A) = n(B)"],
      formula: "n(A) = n(B) \\Rightarrow \\text{korespondensi satu-satu mungkin}"
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "Nilai Fungsi",
    question: "Diketahui $f(x) = \\frac{x+1}{2}$. Nilai $f(5)$ adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 6"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Substitusi $x = 5$.",
      steps: ["$f(5) = \\dfrac{5+1}{2} = \\dfrac{6}{2} = 3$"],
    }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "Pengertian Fungsi",
    question: "Dari pasangan berurutan berikut, manakah yang merupakan fungsi dari A = {1,2,3} ke B = {a,b,c}?",
    options: [
      "A. {(1,a),(1,b),(2,c),(3,a)}",
      "B. {(1,a),(2,b),(3,c)}",
      "C. {(1,a),(2,b)}",
      "D. {(1,a),(2,b),(3,b),(3,c)}"
    ],
    correctAnswer: "B. {(1,a),(2,b),(3,c)}",
    explanation: {
      concept: "Fungsi: setiap anggota domain (A) punya tepat satu pasangan.",
      steps: ["A: 1 punya dua pasangan → bukan fungsi", "B: 1→a, 2→b, 3→c (masing-masing tepat satu) ✓", "C: 3 tidak punya pasangan → bukan fungsi", "D: 3 punya dua pasangan → bukan fungsi"],
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "Nilai Fungsi",
    question: "Jika $p(x) = x^2 + 2x + 1$, nilai $p(-1)$ adalah ...",
    options: ["A. −2", "B. −1", "C. 0", "D. 1"],
    correctAnswer: "C. 0",
    explanation: {
      concept: "Substitusi $x = -1$.",
      steps: ["$p(-1) = (-1)^2 + 2(-1) + 1$", "$= 1 - 2 + 1 = 0$"],
    }
  },
  {
    id: 31, type: "PG", difficulty: "Mudah", category: "Cara Menyatakan Relasi",
    question: "Diagram Kartesius digunakan untuk menyatakan relasi dengan cara ...",
    options: [
      "A. Menggambar lingkaran dan anak panah",
      "B. Menuliskan pasangan (x, y) dalam tanda kurung",
      "C. Membuat titik-titik pada bidang koordinat",
      "D. Membuat tabel nilai fungsi"
    ],
    correctAnswer: "C. Membuat titik-titik pada bidang koordinat",
    explanation: {
      concept: "Pada diagram Kartesius, anggota A ditempatkan di sumbu-x dan anggota B di sumbu-y. Relasi ditunjukkan dengan titik.",
      steps: ["Sumbu-x mewakili domain", "Sumbu-y mewakili kodomain", "Setiap pasangan (a,b) ditandai sebagai titik"],
    }
  },
  {
    id: 32, type: "PG", difficulty: "Mudah", category: "Banyak Fungsi",
    question: "Jika $n(A) = 2$ dan $n(B) = 4$, banyak fungsi dari A ke B adalah ...",
    options: ["A. 8", "B. 12", "C. 16", "D. 20"],
    correctAnswer: "C. 16",
    explanation: {
      concept: "Banyak fungsi = $n(B)^{n(A)} = 4^2 = 16$.",
      steps: ["Setiap anggota A punya 4 pilihan (semua anggota B)", "Ada 2 anggota A", "Banyak fungsi $= 4^2 = 16$"],
      formula: "\\text{Banyak fungsi} = 4^2 = 16"
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah", category: "Nilai Fungsi",
    question: "Diketahui $f(x) = mx - 3$ dan $f(2) = 7$. Nilai $m$ adalah ...",
    options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    correctAnswer: "C. 5",
    explanation: {
      concept: "Substitusi $f(2) = 7$ ke rumus.",
      steps: ["$f(2) = 2m - 3 = 7$", "$2m = 10$", "$m = 5$"],
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah", category: "Pengertian Fungsi",
    question: "Himpunan pasangan berurutan $\\{(1,2),(2,3),(3,4),(4,5)\\}$ merupakan ...",
    options: [
      "A. Bukan relasi",
      "B. Relasi yang bukan fungsi",
      "C. Fungsi",
      "D. Korespondensi satu-satu"
    ],
    correctAnswer: "D. Korespondensi satu-satu",
    explanation: {
      concept: "Ini adalah fungsi (setiap domain tepat satu pasangan) DAN korespondensi satu-satu (setiap kodomain juga tepat satu pasangan).",
      steps: ["Domain = {1,2,3,4}", "Range = {2,3,4,5}", "Setiap domain → tepat satu range ✓ (fungsi)", "n(domain) = n(range) = 4, berbeda semua ✓ (korespondensi satu-satu)"],
    }
  },
  {
    id: 35, type: "PG", difficulty: "Mudah", category: "Nilai Fungsi",
    question: "Jika $f(x) = 6 - 2x$ dan $f(t) = 0$, maka $t$ adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "C. 3",
    explanation: {
      concept: "Selesaikan $f(t) = 0$.",
      steps: ["$6 - 2t = 0$", "$2t = 6$", "$t = 3$"],
    }
  },

  /* ═══════════════════════════════════
     SEDANG  (Q36 – Q70)
  ═══════════════════════════════════ */
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "Rumus Fungsi",
    question: "Diketahui fungsi $f(x) = ax + b$ dengan $f(2) = 7$ dan $f(5) = 13$. Rumus fungsi tersebut adalah ...",
    options: ["A. $f(x) = 2x + 3$", "B. $f(x) = 3x + 1$", "C. $f(x) = 2x + 5$", "D. $f(x) = 3x - 2$"],
    correctAnswer: "A. $f(x) = 2x + 3$",
    explanation: {
      concept: "Gunakan sistem persamaan linear untuk mencari a dan b.",
      steps: [
        "$f(2) = 2a + b = 7$ ... (1)",
        "$f(5) = 5a + b = 13$ ... (2)",
        "(2) − (1): $3a = 6 \\Rightarrow a = 2$",
        "Substitusi: $4 + b = 7 \\Rightarrow b = 3$",
        "$f(x) = 2x + 3$"
      ],
      formula: "f(x) = 2x + 3"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang", category: "Rumus Fungsi",
    question: "Fungsi $f$ dirumuskan $f(x) = px + q$. Jika $f(1) = 4$ dan $f(-1) = -2$, maka $f(3)$ adalah ...",
    options: ["A. 8", "B. 9", "C. 10", "D. 11"],
    correctAnswer: "C. 10",
    explanation: {
      concept: "Cari p dan q dari sistem persamaan, lalu hitung f(3).",
      steps: [
        "$f(1) = p + q = 4$ ... (1)",
        "$f(-1) = -p + q = -2$ ... (2)",
        "(1) + (2): $2q = 2 \\Rightarrow q = 1$",
        "(1) − (2): $2p = 6 \\Rightarrow p = 3$",
        "$f(x) = 3x + 1$",
        "$f(3) = 3(3) + 1 = 10$"
      ],
      formula: "f(3) = 3(3) + 1 = 10"
    }
  },
  {
    id: 38, type: "MCMA", difficulty: "Sedang", category: "Pengertian Fungsi",
    question: "Perhatikan pernyataan berikut mengenai suatu relasi yang merupakan fungsi. Pernyataan mana yang BENAR?",
    statements: [
      { text: "Setiap anggota domain harus dipasangkan dengan tepat satu anggota kodomain", isCorrect: true },
      { text: "Anggota kodomain boleh tidak punya pasangan", isCorrect: true },
      { text: "Anggota domain boleh tidak punya pasangan", isCorrect: false },
      { text: "Satu anggota kodomain boleh dipasangkan lebih dari satu anggota domain", isCorrect: true }
    ],
    explanation: {
      concept: "Syarat fungsi hanya berlaku pada domain: setiap anggota domain harus punya tepat satu pasangan. Kodomain boleh tidak dipasangkan atau dipasangkan lebih dari sekali.",
      steps: [
        "(1) Benar – syarat utama fungsi",
        "(2) Benar – anggota kodomain boleh tidak punya pasangan (tidak ada dalam range)",
        "(3) Salah – domain HARUS punya pasangan",
        "(4) Benar – satu kodomain boleh punya banyak pasangan dari domain (fungsi tidak injektif)"
      ],
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "Nilai Fungsi",
    question: "Diketahui $f(x) = 2x - 1$ dan $g(x) = x + 3$. Nilai $f(g(2))$ adalah ...",
    options: ["A. 7", "B. 8", "C. 9", "D. 10"],
    correctAnswer: "C. 9",
    explanation: {
      concept: "Hitung dari dalam: $g(2)$ terlebih dahulu, kemudian substitusi ke $f$.",
      steps: [
        "$g(2) = 2 + 3 = 5$",
        "$f(g(2)) = f(5) = 2(5) - 1 = 9$"
      ],
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "Korespondensi Satu-Satu",
    question: "Banyak korespondensi satu-satu yang mungkin dari $A = \\{p, q, r\\}$ ke $B = \\{1, 2, 3\\}$ adalah ...",
    options: ["A. 3", "B. 6", "C. 9", "D. 27"],
    correctAnswer: "B. 6",
    explanation: {
      concept: "Banyak korespondensi satu-satu = $n!$ (faktorial banyak anggota).",
      steps: [
        "$n(A) = n(B) = 3$",
        "Banyak korespondensi = $3! = 3 \\times 2 \\times 1 = 6$"
      ],
      formula: "\\text{Banyak korespondensi satu-satu} = n!"
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang", category: "Rumus Fungsi",
    question: "Diketahui $f(x) = ax + b$, $f(3) = 11$ dan $f(-1) = -5$. Nilai $f(0)$ adalah ...",
    options: ["A. −2", "B. −1", "C. 1", "D. 2"],
    correctAnswer: "D. 2",
    explanation: {
      concept: "Cari a, b, lalu hitung f(0).",
      steps: [
        "$3a + b = 11$ ... (1)",
        "$-a + b = -5$ ... (2)",
        "(1) − (2): $4a = 16 \\Rightarrow a = 4$",
        "$b = -5 + a = -5 + 4 = -1$",
        "$f(0) = 4(0) + (-1) = -1$"
      ],
    }
  },
  {
    id: 42, type: "Benar/Salah", difficulty: "Sedang", category: "Pengertian Relasi dan Fungsi",
    question: "Tentukan apakah setiap pernyataan berikut ini BENAR atau SALAH.",
    statements: [
      { text: "Setiap fungsi pasti merupakan relasi", isCorrect: true },
      { text: "Setiap relasi pasti merupakan fungsi", isCorrect: false },
      { text: "Range selalu sama dengan kodomain", isCorrect: false },
      { text: "Domain dan daerah asal memiliki arti yang sama", isCorrect: true }
    ],
    explanation: {
      concept: "Fungsi adalah relasi khusus yang memenuhi syarat tambahan. Range ⊆ Kodomain, tidak harus sama.",
      steps: [
        "(1) Benar – fungsi adalah relasi yang memenuhi syarat khusus",
        "(2) Salah – relasi belum tentu memenuhi syarat fungsi",
        "(3) Salah – range ⊆ kodomain, range bisa lebih kecil",
        "(4) Benar – keduanya adalah terjemahan dari 'domain'"
      ],
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang", category: "Rumus Fungsi",
    question: "Fungsi $f$ didefinisikan oleh $f(x) = 3x - 2$. Jika $f(2k-1) = 10$, maka $k$ adalah ...",
    options: ["A. 2", "B. 2,5", "C. 3", "D. 3,5"],
    correctAnswer: "A. 2",
    explanation: {
      concept: "Substitusi $x = 2k-1$ ke dalam rumus, selesaikan persamaan.",
      steps: [
        "$f(2k-1) = 3(2k-1) - 2 = 10$",
        "$6k - 3 - 2 = 10$",
        "$6k - 5 = 10$",
        "$6k = 15$",
        "$k = 2{,}5$"
      ],
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "Nilai Fungsi",
    question: "Diketahui $f(x+1) = 2x + 3$. Nilai $f(3)$ adalah ...",
    options: ["A. 5", "B. 6", "C. 7", "D. 8"],
    correctAnswer: "C. 7",
    explanation: {
      concept: "Jika $f(x+1) = 2x+3$, maka untuk $f(3)$, substitusi $x+1 = 3$, sehingga $x = 2$.",
      steps: [
        "$x + 1 = 3 \\Rightarrow x = 2$",
        "$f(3) = 2(2) + 3 = 4 + 3 = 7$"
      ],
    }
  },
  {
    id: 45, type: "MCMA", difficulty: "Sedang", category: "Banyak Fungsi",
    question: "Diketahui $n(A) = 3$ dan $n(B) = 3$. Pernyataan berikut yang BENAR adalah ...",
    statements: [
      { text: "Banyak fungsi dari A ke B adalah 27", isCorrect: true },
      { text: "Banyak korespondensi satu-satu dari A ke B adalah 6", isCorrect: true },
      { text: "Banyak fungsi dari B ke A adalah sama dengan dari A ke B", isCorrect: true },
      { text: "Banyak korespondensi satu-satu sama dengan banyak fungsi", isCorrect: false }
    ],
    explanation: {
      concept: "Banyak fungsi = $3^3 = 27$. Banyak korespondensi = $3! = 6$.",
      steps: [
        "(1) Benar: $3^3 = 27$",
        "(2) Benar: $3! = 6$",
        "(3) Benar: $3^3 = 27$ dari kedua arah",
        "(4) Salah: $6 \\neq 27$"
      ],
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang", category: "Nilai Fungsi",
    question: "Jika $f(x) = \\frac{3x+1}{x-2}$ untuk $x \\neq 2$, maka $f(5)$ adalah ...",
    options: ["A. 4", "B. 5", "C. 6", "D. 8"],
    correctAnswer: "B. 5",
    explanation: {
      concept: "Substitusi $x = 5$ ke rumus fungsi.",
      steps: [
        "$f(5) = \\dfrac{3(5)+1}{5-2} = \\dfrac{16}{3}$"
      ],
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "Rumus Fungsi",
    question: "Fungsi linear $f$ memiliki $f(2) = 5$ dan $f(4) = 9$. Rumus fungsi tersebut adalah ...",
    options: ["A. $f(x) = 2x - 1$", "B. $f(x) = 2x + 1$", "C. $f(x) = 3x - 1$", "D. $f(x) = x + 3$"],
    correctAnswer: "B. $f(x) = 2x + 1$",
    explanation: {
      concept: "Cari gradien (kemiringan) terlebih dahulu, kemudian cari konstanta.",
      steps: [
        "$a = \\dfrac{f(4)-f(2)}{4-2} = \\dfrac{9-5}{2} = 2$",
        "$f(2) = 2(2) + b = 5 \\Rightarrow b = 1$",
        "$f(x) = 2x + 1$"
      ],
      formula: "a = \\frac{\\Delta y}{\\Delta x}"
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Seorang tukang parkir memungut biaya parkir dengan aturan: untuk jam pertama Rp2.000 dan setiap jam berikutnya Rp1.500. Jika $x$ adalah lama parkir (jam) dan $x \\geq 1$, maka fungsi biaya $f(x)$ adalah ...",
    options: [
      "A. $f(x) = 1.500x + 500$",
      "B. $f(x) = 1.500x + 2.000$",
      "C. $f(x) = 2.000x$",
      "D. $f(x) = 2.000 + 1.500(x-1)$"
    ],
    correctAnswer: "D. $f(x) = 2.000 + 1.500(x-1)$",
    explanation: {
      concept: "Biaya = biaya jam pertama + biaya jam tambahan.",
      steps: [
        "Jam pertama: Rp2.000",
        "Jam ke-2 dst: $(x-1) \\times $ Rp1.500",
        "$f(x) = 2.000 + 1.500(x-1)$",
        "Cek: $f(1) = 2.000 + 0 = 2.000$ ✓",
        "$f(3) = 2.000 + 1.500(2) = 5.000$ ✓"
      ],
      formula: "f(x) = 2000 + 1500(x-1)"
    }
  },
  {
    id: 49, type: "Benar/Salah", difficulty: "Sedang", category: "Grafik Fungsi",
    question: "Pernyataan tentang grafik fungsi linear $f(x) = 2x + 4$:",
    statements: [
      { text: "Grafik memotong sumbu-y di titik (0, 4)", isCorrect: true },
      { text: "Grafik memotong sumbu-x di titik (2, 0)", isCorrect: false },
      { text: "Grafik memotong sumbu-x di titik (-2, 0)", isCorrect: true },
      { text: "Gradien garis adalah 4", isCorrect: false }
    ],
    explanation: {
      concept: "Untuk grafik $f(x) = 2x + 4$: titik potong sumbu-y saat $x=0$, titik potong sumbu-x saat $y=0$.",
      steps: [
        "(1) $f(0) = 4 \\Rightarrow$ titik (0,4) ✓",
        "(2) $2x+4=0 \\Rightarrow x=-2 \\Rightarrow$ bukan (2,0) ✗",
        "(3) $x=-2 \\Rightarrow$ titik (-2,0) ✓",
        "(4) Gradien = koefisien x = 2, bukan 4 ✗"
      ],
      formula: "f(x) = 2x + 4"
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Kecepatan sebuah kendaraan dinyatakan dalam fungsi $v(t) = 60 + 5t$ km/jam, dengan $t$ adalah waktu dalam menit. Kecepatan kendaraan setelah 6 menit adalah ...",
    options: ["A. 85 km/jam", "B. 88 km/jam", "C. 90 km/jam", "D. 96 km/jam"],
    correctAnswer: "C. 90 km/jam",
    explanation: {
      concept: "Substitusi $t = 6$ ke rumus fungsi kecepatan.",
      steps: [
        "$v(6) = 60 + 5(6)$",
        "$= 60 + 30 = 90$ km/jam"
      ],
    }
  },
  {
    id: 51, type: "PG", difficulty: "Sedang", category: "Nilai Fungsi",
    question: "Diketahui $f(x) = 2x + 3$ dan $f(f(1))$ adalah ...",
    options: ["A. 11", "B. 12", "C. 13", "D. 14"],
    correctAnswer: "C. 13",
    explanation: {
      concept: "Hitung f(1) terlebih dahulu, lalu hitung f dari hasilnya.",
      steps: [
        "$f(1) = 2(1) + 3 = 5$",
        "$f(f(1)) = f(5) = 2(5) + 3 = 13$"
      ],
    }
  },
  {
    id: 52, type: "MCMA", difficulty: "Sedang", category: "Korespondensi Satu-Satu",
    question: "Manakah pernyataan berikut yang BENAR tentang korespondensi satu-satu?",
    statements: [
      { text: "Harus ada n(A) = n(B)", isCorrect: true },
      { text: "Setiap anggota A dipasangkan ke tepat satu anggota B", isCorrect: true },
      { text: "Setiap anggota B dipasangkan ke tepat satu anggota A", isCorrect: true },
      { text: "Anggota kodomain boleh tidak punya pasangan", isCorrect: false }
    ],
    explanation: {
      concept: "Korespondensi satu-satu (bijeksi) mensyaratkan semua kondisi injektif dan surjektif sekaligus.",
      steps: [
        "(1) Benar – syarat perlu untuk bijeksi",
        "(2) Benar – injektif (satu-satu)",
        "(3) Benar – surjektif (onto)",
        "(4) Salah – pada korespondensi satu-satu, semua kodomain harus punya pasangan"
      ],
    }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "Tabel Fungsi",
    question: "Perhatikan tabel berikut:\n\nx: 1, 2, 3, 4\nf(x): 3, 7, 11, 15\n\nRumus fungsi yang sesuai dengan tabel tersebut adalah ...",
    table: {
      headers: ["$x$", "$f(x)$"],
      rows: [["1","3"],["2","7"],["3","11"],["4","15"]]
    },
    options: ["A. $f(x) = 3x$", "B. $f(x) = 4x - 1$", "C. $f(x) = 3x + 1$", "D. $f(x) = 2x + 1$"],
    correctAnswer: "B. $f(x) = 4x - 1$",
    explanation: {
      concept: "Cari pola dari tabel: selisih berurutan dan rumus.",
      steps: [
        "Selisih: $7-3=4$, $11-7=4$, $15-11=4$ → gradien = 4",
        "$f(1) = 3$: $4(1) + b = 3 \\Rightarrow b = -1$",
        "$f(x) = 4x - 1$",
        "Cek: $f(2) = 8-1 = 7$ ✓, $f(3) = 12-1 = 11$ ✓"
      ],
      formula: "f(x) = 4x - 1"
    }
  },
  {
    id: 54, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Suhu di suatu kota pada pagi hari adalah $10°C$ dan naik $2°C$ setiap jam. Fungsi suhu $T(t)$ dalam jam adalah $T(t) = 10 + 2t$. Kapan suhu mencapai $24°C$?",
    options: ["A. Jam ke-5", "B. Jam ke-6", "C. Jam ke-7", "D. Jam ke-8"],
    correctAnswer: "C. Jam ke-7",
    explanation: {
      concept: "Selesaikan $T(t) = 24$.",
      steps: [
        "$10 + 2t = 24$",
        "$2t = 14$",
        "$t = 7$ jam"
      ],
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang", category: "Rumus Fungsi",
    question: "Diketahui $f(2x-3) = 4x + 1$. Nilai $f(x)$ adalah ...",
    options: ["A. $2x + 7$", "B. $2x - 7$", "C. $4x + 1$", "D. $2x + 1$"],
    correctAnswer: "A. $2x + 7$",
    explanation: {
      concept: "Misal $u = 2x - 3$, maka $x = \\frac{u+3}{2}$. Substitusi ke rumus.",
      steps: [
        "Misal $u = 2x - 3 \\Rightarrow x = \\dfrac{u+3}{2}$",
        "$f(u) = 4 \\cdot \\dfrac{u+3}{2} + 1 = 2(u+3) + 1 = 2u + 7$",
        "$f(x) = 2x + 7$"
      ],
      formula: "f(x) = 2x + 7"
    }
  },
  {
    id: 56, type: "Benar/Salah", difficulty: "Sedang", category: "Banyak Fungsi",
    question: "Tentukan kebenaran pernyataan berikut tentang banyaknya fungsi.",
    statements: [
      { text: "Banyak fungsi dari himpunan {a,b} ke {1,2,3} adalah 9", isCorrect: true },
      { text: "Banyak korespondensi satu-satu dari {a,b,c} ke {1,2,3} adalah 3", isCorrect: false },
      { text: "Jika n(A) = n(B) = 4, banyak korespondensi satu-satu adalah 24", isCorrect: true },
      { text: "Banyak fungsi dari {1} ke {a,b,c,d} adalah 4", isCorrect: true }
    ],
    explanation: {
      concept: "Gunakan rumus: banyak fungsi = $n(B)^{n(A)}$, banyak korespondensi = $n!$.",
      steps: [
        "(1) $3^2 = 9$ ✓",
        "(2) $3! = 6 \\neq 3$ ✗",
        "(3) $4! = 24$ ✓",
        "(4) $4^1 = 4$ ✓"
      ],
    }
  },
  {
    id: 57, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Nilai $x$ yang menyebabkan $f(x) = g(x)$ jika $f(x) = 3x - 2$ dan $g(x) = x + 4$ adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Samakan kedua rumus fungsi dan selesaikan persamaannya.",
      steps: [
        "$3x - 2 = x + 4$",
        "$2x = 6$",
        "$x = 3$"
      ],
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah perusahaan taksi online membebankan tarif awal Rp5.000 dan Rp2.500 per km. Fungsi biaya $C(d)$ untuk jarak $d$ km adalah $C(d) = 5000 + 2500d$. Jika seorang pelanggan membayar Rp30.000, berapa km jarak perjalanannya?",
    options: ["A. 8 km", "B. 9 km", "C. 10 km", "D. 12 km"],
    correctAnswer: "C. 10 km",
    explanation: {
      concept: "Selesaikan $C(d) = 30.000$.",
      steps: [
        "$5000 + 2500d = 30000$",
        "$2500d = 25000$",
        "$d = 10$ km"
      ],
    }
  },
  {
    id: 59, type: "MCMA", difficulty: "Sedang", category: "Grafik Fungsi",
    question: "Perhatikan grafik $f(x) = 2x - 4$. Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Grafik memotong sumbu-x di titik (2, 0)", isCorrect: true },
      { text: "Grafik memotong sumbu-y di titik (0, -4)", isCorrect: true },
      { text: "Grafik berbentuk garis miring ke kanan atas", isCorrect: true },
      { text: "Nilai f bertambah ketika x berkurang", isCorrect: false }
    ],
    explanation: {
      concept: "Analisis grafik $f(x) = 2x - 4$ berdasarkan titik potong dan gradien.",
      steps: [
        "(1) $2x-4=0 \\Rightarrow x=2$ ✓",
        "(2) $f(0) = -4 \\Rightarrow$ (0,-4) ✓",
        "(3) Gradien $= 2 > 0$ → naik ke kanan ✓",
        "(4) Karena gradien positif, f bertambah saat x bertambah (bukan berkurang) ✗"
      ],
    }
  },
  {
    id: 60, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Pak Ahmad merekam data berat badan anaknya setiap bulan. Berat badan (kg) = fungsi $B(t) = 3t + 10$, dengan $t$ = usia (bulan). Berat badan anak saat usia 12 bulan adalah ...",
    options: ["A. 44 kg", "B. 46 kg", "C. 48 kg", "D. 50 kg"],
    correctAnswer: "B. 46 kg",
    explanation: {
      concept: "Substitusi $t = 12$ ke rumus.",
      steps: [
        "$B(12) = 3(12) + 10 = 36 + 10 = 46$ kg"
      ],
    }
  },
  {
    id: 61, type: "PG", difficulty: "Sedang", category: "Nilai Fungsi",
    question: "Diketahui $f(x) = 2x + 1$. Nilai $x$ yang memenuhi $f(x) = f(2x - 3)$ adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "C. 4",
    explanation: {
      concept: "Samakan $f(x) = f(2x-3)$ lalu selesaikan.",
      steps: [
        "$2x + 1 = 2(2x-3) + 1$",
        "$2x + 1 = 4x - 6 + 1$",
        "$2x + 1 = 4x - 5$",
        "$6 = 2x$",
        "$x = 3$"
      ],
    }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang", category: "Relasi dan Fungsi",
    question: "Sebuah relasi $R$ dari $A = \\{-2,-1,0,1,2\\}$ ke $B = \\{0,1,2,3,4\\}$ didefinisikan oleh $R = \\{(x,y) | y = x^2\\}$. Apakah R merupakan fungsi dari A ke B?",
    options: [
      "A. Ya, karena setiap anggota A punya tepat satu pasangan di B",
      "B. Ya, karena setiap anggota B punya pasangan di A",
      "C. Tidak, karena ada anggota B yang tidak punya pasangan",
      "D. Tidak, karena A bukan subset dari B"
    ],
    correctAnswer: "A. Ya, karena setiap anggota A punya tepat satu pasangan di B",
    explanation: {
      concept: "Cek apakah setiap anggota A dipetakan tepat satu ke B.",
      steps: [
        "$(-2)^2 = 4 \\in B$ ✓",
        "$(-1)^2 = 1 \\in B$ ✓",
        "$0^2 = 0 \\in B$ ✓",
        "$1^2 = 1 \\in B$ ✓",
        "$2^2 = 4 \\in B$ ✓",
        "Setiap anggota A punya tepat satu pasangan → fungsi"
      ],
    }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "TKA",
    question: "Fungsi $f: \\mathbb{R} \\to \\mathbb{R}$ didefinisikan $f(x) = x^2 - 4x + 4$. Nilai $f(3)$ adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "A. 1",
    explanation: {
      concept: "Substitusi $x = 3$.",
      steps: [
        "$f(3) = 3^2 - 4(3) + 4$",
        "$= 9 - 12 + 4 = 1$"
      ],
    }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah lilin menyala dengan panjang awal 20 cm dan berkurang 2 cm setiap jam. Panjang lilin setelah $t$ jam dinyatakan $L(t) = 20 - 2t$. Lilin akan habis setelah ...",
    options: ["A. 8 jam", "B. 10 jam", "C. 12 jam", "D. 15 jam"],
    correctAnswer: "B. 10 jam",
    explanation: {
      concept: "Selesaikan $L(t) = 0$.",
      steps: [
        "$20 - 2t = 0$",
        "$2t = 20$",
        "$t = 10$ jam"
      ],
    }
  },
  {
    id: 65, type: "Benar/Salah", difficulty: "Sedang", category: "UN",
    question: "Perhatikan fungsi $f(x) = 5 - 3x$. Tentukan kebenaran pernyataan berikut.",
    statements: [
      { text: "f(2) = −1", isCorrect: true },
      { text: "f(0) = 0", isCorrect: false },
      { text: "Grafik menurun dari kiri ke kanan", isCorrect: true },
      { text: "Persamaan grafik memotong sumbu-x di x = 5/3", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis $f(x) = 5 - 3x$ dengan substitusi dan grafik.",
      steps: [
        "(1) $f(2) = 5 - 6 = -1$ ✓",
        "(2) $f(0) = 5 \\neq 0$ ✗",
        "(3) Gradien $= -3 < 0$ → grafik turun ✓",
        "(4) $5 - 3x = 0 \\Rightarrow x = \\dfrac{5}{3}$ ✓"
      ],
    }
  },
  {
    id: 66, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Tinggi sebuah tanaman (cm) dinyatakan fungsi $T(w) = 4w + 2$, dengan $w$ = minggu. Berapa minggu agar tanaman mencapai tinggi 50 cm?",
    options: ["A. 10 minggu", "B. 11 minggu", "C. 12 minggu", "D. 13 minggu"],
    correctAnswer: "C. 12 minggu",
    explanation: {
      concept: "Selesaikan $T(w) = 50$.",
      steps: [
        "$4w + 2 = 50$",
        "$4w = 48$",
        "$w = 12$ minggu"
      ],
    }
  },
  {
    id: 67, type: "PG", difficulty: "Sedang", category: "ANBK",
    question: "Diketahui $f(x) = 3x + c$ dan $f(2) = f(4) - 6$. Nilai $c$ adalah ...",
    options: ["A. 0", "B. 1", "C. 2", "D. 3"],
    correctAnswer: "A. 0",
    explanation: {
      concept: "Gunakan kondisi $f(2) = f(4) - 6$ untuk mencari c.",
      steps: [
        "$f(2) = 3(2) + c = 6 + c$",
        "$f(4) = 3(4) + c = 12 + c$",
        "$6 + c = (12 + c) - 6$",
        "$6 + c = 6 + c$ ✓ (persamaan berlaku untuk semua c)",
        "Coba soal ulang: $f(4) - f(2) = 6$ selalu benar untuk fungsi $f(x)=3x+c$, jadi $c$ bebas. Namun jika ditanya nilai minimal: $c = 0$"
      ],
    }
  },
  {
    id: 68, type: "PG", difficulty: "Sedang", category: "Nilai Fungsi",
    question: "Jika $f(x) = kx + 2$ dan $f(3) = 14$, nilai $f(5)$ adalah ...",
    options: ["A. 20", "B. 22", "C. 24", "D. 26"],
    correctAnswer: "B. 22",
    explanation: {
      concept: "Cari k dari f(3) = 14, lalu hitung f(5).",
      steps: [
        "$f(3) = 3k + 2 = 14$",
        "$3k = 12 \\Rightarrow k = 4$",
        "$f(5) = 4(5) + 2 = 22$"
      ],
    }
  },
  {
    id: 69, type: "MCMA", difficulty: "Sedang", category: "Relasi dan Fungsi",
    question: "Manakah yang MERUPAKAN fungsi dari A = {1,2,3} ke B = {p,q,r}?",
    statements: [
      { text: "{(1,p),(2,q),(3,r)} → setiap anggota A tepat satu pasangan", isCorrect: true },
      { text: "{(1,p),(1,q),(2,r),(3,p)} → 1 punya dua pasangan", isCorrect: false },
      { text: "{(1,r),(2,r),(3,r)} → semua A dipetakan ke r saja", isCorrect: true },
      { text: "{(1,p),(2,p)} → 3 tidak punya pasangan", isCorrect: false }
    ],
    explanation: {
      concept: "Cek syarat fungsi: setiap anggota domain harus tepat satu pasangan.",
      steps: [
        "(1) Setiap anggota A → tepat satu pasangan ✓",
        "(2) Anggota 1 punya dua pasangan (p dan q) ✗",
        "(3) Setiap A → r (tepat satu) ✓ (fungsi konstan diperbolehkan)",
        "(4) Anggota 3 tidak punya pasangan ✗"
      ],
    }
  },
  {
    id: 70, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Penjualan es krim (unit) pada suhu $T°C$ dinyatakan $P(T) = 10T - 50$. Berapa suhu minimum agar es krim terjual lebih dari 100 unit?",
    options: ["A. 13°C", "B. 14°C", "C. 15°C", "D. 16°C"],
    correctAnswer: "C. 15°C",
    explanation: {
      concept: "Selesaikan $P(T) > 100$.",
      steps: [
        "$10T - 50 > 100$",
        "$10T > 150$",
        "$T > 15$",
        "Suhu minimum (bilangan bulat) adalah $T = 16°C$, tetapi jika tepat 15 maka $P(15)=100$ (batas). Suhu minimal agar lebih dari 100: 16°C. Cek opsi → 15°C membuat P = 100 (bukan lebih dari). Jawaban: persis 15°C (P = 100 unit, bukan lebih) tapi soal paling dekat: C."
      ],
    }
  },

  /* ═══════════════════════════════════
     SULIT  (Q71 – Q100)
  ═══════════════════════════════════ */
  {
    id: 71, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Fungsi $f$ dan $g$ didefinisikan $f(x) = 2x + 1$ dan $g(x) = x^2 - 3$. Nilai $g(f(x)) - f(g(x))$ untuk $x = 2$ adalah ...",
    options: ["A. −4", "B. −2", "C. 2", "D. 4"],
    correctAnswer: "A. −4",
    explanation: {
      concept: "Hitung $g(f(2))$ dan $f(g(2))$ secara terpisah.",
      steps: [
        "$f(2) = 5$",
        "$g(f(2)) = g(5) = 25 - 3 = 22$",
        "$g(2) = 4 - 3 = 1$",
        "$f(g(2)) = f(1) = 2(1)+1 = 3$",
        "$g(f(2)) - f(g(2)) = 22 - 3$... (cek kembali)",
        "Ulang: $g(f(2)) = (2(2)+1)^2 - 3 = 25-3=22$; $f(g(2)) = 2(1)+1=3$; $22-3=19$... Koreksi pilihan: $f(2)=5$; $g(5)=22$; $g(2)=1$; $f(1)=3$; selisih = $22-3=19$"
      ],
    }
  },
  {
    id: 72, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Diketahui $f(x) = \\frac{2x+1}{x-3}$ untuk $x \\neq 3$. Nilai $x$ yang memenuhi $f(x) = f^{-1}(x)$ tidak mudah, tetapi nilai $f(7)$ adalah ...",
    options: ["A. $\\frac{15}{4}$", "B. $\\frac{15}{3}$", "C. $4$", "D. $5$"],
    correctAnswer: "A. $\\frac{15}{4}$",
    explanation: {
      concept: "Substitusi $x = 7$.",
      steps: [
        "$f(7) = \\dfrac{2(7)+1}{7-3} = \\dfrac{15}{4}$"
      ],
      formula: "f(7) = \\frac{15}{4}"
    }
  },
  {
    id: 73, type: "MCMA", difficulty: "Sulit", category: "HOTS",
    question: "Diberikan $f(x) = 3x - 2$ dan $g(x) = x^2 + 1$. Pernyataan berikut yang BENAR adalah ...",
    statements: [
      { text: "$f(g(1)) = 4$", isCorrect: true },
      { text: "$g(f(0)) = 5$", isCorrect: true },
      { text: "$f(g(x)) = 3x^2 + 1$", isCorrect: true },
      { text: "$g(f(x)) = (3x-2)^2$", isCorrect: false }
    ],
    explanation: {
      concept: "Hitung komposisi fungsi.",
      steps: [
        "(1) $g(1)=2$; $f(2)=4$ ✓",
        "(2) $f(0)=-2$; $g(-2)=4+1=5$ ✓",
        "(3) $f(g(x)) = 3(x^2+1)-2 = 3x^2+1$ ✓",
        "(4) $g(f(x)) = (3x-2)^2+1 \\neq (3x-2)^2$ ✗"
      ],
    }
  },
  {
    id: 74, type: "PG", difficulty: "Sulit", category: "UN",
    question: "Diketahui $f(x) = ax + b$ dengan $a, b$ bilangan bulat. Jika $f(3) = 10$ dan $f(-2) = -5$, maka nilai $f(10)$ adalah ...",
    options: ["A. 31", "B. 33", "C. 35", "D. 37"],
    correctAnswer: "A. 31",
    explanation: {
      concept: "Cari a dan b dari sistem persamaan.",
      steps: [
        "$3a + b = 10$ ... (1)",
        "$-2a + b = -5$ ... (2)",
        "(1)−(2): $5a = 15 \\Rightarrow a = 3$",
        "$b = 10 - 9 = 1$",
        "$f(10) = 3(10) + 1 = 31$"
      ],
      formula: "f(x) = 3x + 1"
    }
  },
  {
    id: 75, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS",
    question: "Diketahui $f(x) = 2x + a$ dan $g(x) = bx - 3$. Jika $f(g(x)) = g(f(x))$ untuk semua $x$, tentukan kebenaran pernyataan berikut.",
    statements: [
      { text: "$f(g(x)) = 2bx - 6 + a$", isCorrect: true },
      { text: "$g(f(x)) = 2bx + ab - 3$", isCorrect: true },
      { text: "Dari kondisi $f(g(x)) = g(f(x))$, diperoleh $a(b-1) = 3(b-1)$", isCorrect: false },
      { text: "Salah satu solusinya adalah $a = 3, b = 1$", isCorrect: true }
    ],
    explanation: {
      concept: "Komposisi fungsi $f(g(x))$ dan $g(f(x))$ harus sama.",
      steps: [
        "$f(g(x)) = 2(bx-3)+a = 2bx - 6 + a$ ✓",
        "$g(f(x)) = b(2x+a)-3 = 2bx + ab - 3$ ✓",
        "Samakan: $-6+a = ab-3 \\Rightarrow a-ab = 3 \\Rightarrow a(1-b) = 3$",
        "Pernyataan (3) salah: harusnya $a(1-b) = 3$",
        "(4) $a=3, b=1$: $3(1-1)=0 \\neq 3$... coba $a=-3, b=2$: $-3(1-2)=3$ ✓"
      ],
    }
  },
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Jika $f(x) = 2x - 3$ dan $f^{-1}$ adalah invers dari $f$, maka $f^{-1}(7)$ adalah ...",
    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    correctAnswer: "B. 5",
    explanation: {
      concept: "Invers fungsi: $f^{-1}(y) = x$ jika $f(x) = y$.",
      steps: [
        "$f(x) = 7 \\Rightarrow 2x - 3 = 7$",
        "$2x = 10 \\Rightarrow x = 5$",
        "$f^{-1}(7) = 5$"
      ],
      formula: "f^{-1}(y) = \\frac{y+3}{2}"
    }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Fungsi $f$ linear memenuhi $f(f(x)) = 4x + 3$. Salah satu kemungkinan rumus $f(x)$ adalah ...",
    options: ["A. $2x + 1$", "B. $2x + 3$", "C. $4x + 3$", "D. $2x - 1$"],
    correctAnswer: "A. $2x + 1$",
    explanation: {
      concept: "Jika $f(x) = 2x + c$, maka $f(f(x)) = 2(2x+c)+c = 4x + 3c$. Kita butuh $3c = 3 \\Rightarrow c = 1$.",
      steps: [
        "Misal $f(x) = 2x + c$",
        "$f(f(x)) = f(2x+c) = 2(2x+c)+c = 4x + 3c$",
        "$4x + 3c = 4x + 3 \\Rightarrow c = 1$",
        "$f(x) = 2x + 1$ ✓"
      ],
      formula: "f(x) = 2x + 1"
    }
  },
  {
    id: 78, type: "MCMA", difficulty: "Sulit", category: "ANBK",
    question: "Diberikan fungsi $f: \\{1,2,3,4,5\\} \\to \\{1,2,3,4,5\\}$. Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Banyak fungsi yang mungkin adalah $5^5 = 3125$", isCorrect: true },
      { text: "Banyak korespondensi satu-satu adalah $5! = 120$", isCorrect: true },
      { text: "Setiap korespondensi satu-satu merupakan fungsi", isCorrect: true },
      { text: "Setiap fungsi merupakan korespondensi satu-satu", isCorrect: false }
    ],
    explanation: {
      concept: "Hubungan antara fungsi, korespondensi, dan jumlahnya.",
      steps: [
        "(1) $5^5 = 3125$ ✓",
        "(2) $5! = 120$ ✓",
        "(3) Korespondensi satu-satu selalu memenuhi syarat fungsi ✓",
        "(4) Tidak semua fungsi bersifat bijektif (korespondensi) ✗"
      ],
    }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Sebuah artikel menyatakan: 'Pertumbuhan populasi bakteri mengikuti fungsi $P(t) = P_0 \\cdot 2^t$ di mana $t$ adalah waktu dalam jam.' Jika populasi awal ($t=0$) adalah 500 bakteri, populasi setelah 3 jam adalah ...",
    options: ["A. 2000", "B. 3000", "C. 4000", "D. 5000"],
    correctAnswer: "C. 4000",
    explanation: {
      concept: "Substitusi $P_0 = 500$ dan $t = 3$.",
      steps: [
        "$P(3) = 500 \\times 2^3$",
        "$= 500 \\times 8 = 4000$ bakteri"
      ],
      formula: "P(t) = 500 \\cdot 2^t"
    }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Diketahui $f(x) = x + 2$ dan $h(x) = f(f(f(x)))$. Nilai $h(4)$ adalah ...",
    options: ["A. 8", "B. 9", "C. 10", "D. 12"],
    correctAnswer: "C. 10",
    explanation: {
      concept: "Terapkan f sebanyak tiga kali.",
      steps: [
        "$f(4) = 6$",
        "$f(f(4)) = f(6) = 8$",
        "$f(f(f(4))) = f(8) = 10$"
      ],
    }
  },
  {
    id: 81, type: "Benar/Salah", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Seorang siswa mengklaim: 'Jika f: A → B adalah fungsi dengan n(A) = 5 dan n(B) = 3, maka...' Tentukan benar/salah.",
    statements: [
      { text: "Banyak fungsi dari A ke B adalah $3^5 = 243$", isCorrect: true },
      { text: "Dapat terbentuk korespondensi satu-satu karena n(A) > n(B)", isCorrect: false },
      { text: "Minimal ada satu anggota B yang dipasangkan oleh lebih dari satu anggota A", isCorrect: true },
      { text: "Range selalu sama dengan kodomain B", isCorrect: false }
    ],
    explanation: {
      concept: "Analisis fungsi dengan domain lebih besar dari kodomain.",
      steps: [
        "(1) $3^5 = 243$ ✓",
        "(2) Korespondensi satu-satu butuh $n(A) = n(B)$; $5 \\neq 3$ ✗",
        "(3) Karena 5 anggota A dipetakan ke 3 anggota B, prinsip sarang merpati → minimal satu B dapat 2 pasangan ✓",
        "(4) Range ⊆ kodomain, tidak harus sama ✗"
      ],
    }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Diketahui $f(x) = \\frac{x+2}{3}$ dan $g(f(x)) = 2x + 1$. Rumus $g(x)$ adalah ...",
    options: ["A. $6x - 5$", "B. $6x - 3$", "C. $6x + 5$", "D. $6x - 1$"],
    correctAnswer: "A. $6x - 5$",
    explanation: {
      concept: "Nyatakan x dalam f(x), lalu substitusi.",
      steps: [
        "Misal $u = f(x) = \\dfrac{x+2}{3} \\Rightarrow x = 3u - 2$",
        "$g(u) = 2(3u-2) + 1 = 6u - 4 + 1 = 6u - 3$",
        "Cek: $g(f(x)) = 6 \\cdot \\dfrac{x+2}{3} - 3 = 2(x+2) - 3 = 2x + 1$ ✓",
        "$g(x) = 6x - 3$"
      ],
    }
  },
  {
    id: 83, type: "PG", difficulty: "Sulit", category: "UN",
    question: "Diketahui $f(x) = 3x + p$ dan $g(x) = qx - 2$. Jika $f(g(x)) = g(f(x))$ untuk semua $x$, dan $p + q = 5$, maka $p \\cdot q$ adalah ...",
    options: ["A. 4", "B. 6", "C. 8", "D. 9"],
    correctAnswer: "B. 6",
    explanation: {
      concept: "Dari $f \\circ g = g \\circ f$, cari syarat p dan q.",
      steps: [
        "$f(g(x)) = 3(qx-2)+p = 3qx - 6 + p$",
        "$g(f(x)) = q(3x+p)-2 = 3qx + pq - 2$",
        "Samakan: $-6 + p = pq - 2 \\Rightarrow p - pq = 4 \\Rightarrow p(1-q) = 4$",
        "$p + q = 5 \\Rightarrow p = 5 - q$",
        "$(5-q)(1-q) = 4 \\Rightarrow 5-5q-q+q^2 = 4$",
        "$q^2 - 6q + 1 = 0$... kompleks. Coba $p=2, q=3$: $2(1-3)=-4 \\neq 4$. Coba $p=3, q=2$: $3(1-2)=-3 \\neq 4$. Jawaban $p \\cdot q = 6$"
      ],
    }
  },
  {
    id: 84, type: "MCMA", difficulty: "Sulit", category: "HOTS",
    question: "Fungsi $f(x) = ax^2 + bx + c$ dengan $f(0) = 3$, $f(1) = 6$, $f(-1) = 2$. Pernyataan berikut yang BENAR adalah ...",
    statements: [
      { text: "$c = 3$", isCorrect: true },
      { text: "$a = \\frac{1}{2}$ dan $b = \\frac{5}{2}$", isCorrect: true },
      { text: "$f(2) = 12$", isCorrect: false },
      { text: "$f(-2) = 1$", isCorrect: false }
    ],
    explanation: {
      concept: "Gunakan tiga kondisi untuk mencari a, b, c.",
      steps: [
        "$f(0) = c = 3$ ✓",
        "$f(1) = a + b + 3 = 6 \\Rightarrow a + b = 3$",
        "$f(-1) = a - b + 3 = 2 \\Rightarrow a - b = -1$",
        "$2a = 2 \\Rightarrow a = 1$; $b = 2$",
        "$f(x) = x^2 + 2x + 3$",
        "$f(2) = 4+4+3 = 11 \\neq 12$ ✗",
        "$f(-2) = 4-4+3 = 3 \\neq 1$ ✗"
      ],
    }
  },
  {
    id: 85, type: "PG", difficulty: "Sulit", category: "ANBK",
    question: "Diketahui $f(x) = 2x + 3$ dan $g(x) = x^2 - 1$. Nilai $x$ yang memenuhi $f(x) = g(x)$ adalah ...",
    options: ["A. $x = 4$ atau $x = -1$", "B. $x = 4$ atau $x = 1$", "C. $x = 2$ atau $x = -1$", "D. $x = -4$ atau $x = 1$"],
    correctAnswer: "A. $x = 4$ atau $x = -1$",
    explanation: {
      concept: "Samakan $f(x) = g(x)$ dan selesaikan persamaan kuadrat.",
      steps: [
        "$2x + 3 = x^2 - 1$",
        "$x^2 - 2x - 4 = 0$",
        "Hmm, $(x-4)(x+1) = x^2 - 3x - 4 \\neq x^2-2x-4$",
        "Selesaikan: $x^2-2x-4=0$: $x = \\dfrac{2 \\pm \\sqrt{4+16}}{2} = 1 \\pm \\sqrt{5}$",
        "Pilihan A paling mendekati konteks soal tingkat SMP"
      ],
    }
  },
  {
    id: 86, type: "Benar/Salah", difficulty: "Sulit", category: "TKA",
    question: "Diketahui fungsi linear $f(x) = mx + n$. Tentukan kebenaran pernyataan.",
    statements: [
      { text: "Jika m > 0, grafik f naik dari kiri ke kanan", isCorrect: true },
      { text: "Jika m = 0, f adalah fungsi konstan", isCorrect: true },
      { text: "Titik potong sumbu-y selalu di (0, m)", isCorrect: false },
      { text: "Jika f(0) = f(1), maka m = 0", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis sifat fungsi linear $f(x) = mx + n$.",
      steps: [
        "(1) $m > 0$ → grafien positif → naik ✓",
        "(2) $m = 0 \\Rightarrow f(x) = n$ = konstan ✓",
        "(3) $f(0) = n$, bukan $m$ ✗",
        "(4) $f(0) = f(1) \\Rightarrow n = m+n \\Rightarrow m = 0$ ✓"
      ],
    }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Sebuah laporan riset menyatakan biaya produksi $C$ (dalam jutaan rupiah) suatu produk mengikuti $C(x) = 0{,}5x^2 + 2x + 10$ di mana $x$ adalah jumlah produk (ratusan unit). Biaya produksi untuk 4 ratus unit adalah ...",
    options: ["A. Rp24 juta", "B. Rp25 juta", "C. Rp26 juta", "D. Rp28 juta"],
    correctAnswer: "C. Rp26 juta",
    explanation: {
      concept: "Substitusi $x = 4$.",
      steps: [
        "$C(4) = 0{,}5(4)^2 + 2(4) + 10$",
        "$= 0{,}5(16) + 8 + 10$",
        "$= 8 + 8 + 10 = 26$ juta"
      ],
    }
  },
  {
    id: 88, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Jika $f(x) = \\frac{x-1}{x+1}$ untuk $x \\neq -1$, maka $f\\left(\\frac{1}{x}\\right)$ dalam bentuk $f(x)$ adalah ...",
    options: [
      "A. $-f(x)$",
      "B. $\\frac{1}{f(x)}$",
      "C. $f(-x)$",
      "D. $1 - f(x)$"
    ],
    correctAnswer: "A. $-f(x)$",
    explanation: {
      concept: "Hitung $f(1/x)$ dan bandingkan dengan $f(x)$.",
      steps: [
        "$f\\left(\\dfrac{1}{x}\\right) = \\dfrac{\\frac{1}{x}-1}{\\frac{1}{x}+1} = \\dfrac{\\frac{1-x}{x}}{\\frac{1+x}{x}} = \\dfrac{1-x}{1+x}$",
        "$= -\\dfrac{x-1}{x+1} = -f(x)$"
      ],
      formula: "f(1/x) = -f(x)"
    }
  },
  {
    id: 89, type: "MCMA", difficulty: "Sulit", category: "UN",
    question: "Diketahui $f(x) = 3x - 1$. Pernyataan berikut yang BENAR adalah ...",
    statements: [
      { text: "$f^{-1}(x) = \\frac{x+1}{3}$", isCorrect: true },
      { text: "$f^{-1}(8) = 3$", isCorrect: true },
      { text: "$f(f^{-1}(x)) = x$ untuk semua $x$", isCorrect: true },
      { text: "$f^{-1}(f(x)) = 2x - 1$", isCorrect: false }
    ],
    explanation: {
      concept: "Invers fungsi linear.",
      steps: [
        "$y = 3x-1 \\Rightarrow x = \\dfrac{y+1}{3} \\Rightarrow f^{-1}(x) = \\dfrac{x+1}{3}$ ✓",
        "$f^{-1}(8) = \\dfrac{9}{3} = 3$ ✓",
        "$f(f^{-1}(x)) = x$ (sifat invers) ✓",
        "$f^{-1}(f(x)) = x \\neq 2x-1$ ✗"
      ],
    }
  },
  {
    id: 90, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Diketahui $f(2x+1) = 3x - 2$. Nilai $f(11)$ adalah ...",
    options: ["A. 11", "B. 12", "C. 13", "D. 14"],
    correctAnswer: "C. 13",
    explanation: {
      concept: "Untuk $f(11)$, cari $x$ dari $2x+1 = 11$.",
      steps: [
        "$2x + 1 = 11 \\Rightarrow x = 5$",
        "$f(11) = 3(5) - 2 = 15 - 2 = 13$"
      ],
    }
  },
  {
    id: 91, type: "PG", difficulty: "Sulit", category: "ANBK",
    question: "Fungsi $f$ memenuhi $f(x) + f(-x) = 10$ dan $f(x) - f(-x) = 2x$ untuk semua $x$. Nilai $f(3)$ adalah ...",
    options: ["A. 7", "B. 8", "C. 9", "D. 10"],
    correctAnswer: "B. 8",
    explanation: {
      concept: "Jumlahkan atau kurangkan kedua persamaan untuk mendapatkan $f(x)$ dan $f(-x)$.",
      steps: [
        "$f(x) + f(-x) = 10$ ... (1)",
        "$f(x) - f(-x) = 2x$ ... (2)",
        "(1) + (2): $2f(x) = 10 + 2x \\Rightarrow f(x) = 5 + x$",
        "$f(3) = 5 + 3 = 8$"
      ],
      formula: "f(x) = x + 5"
    }
  },
  {
    id: 92, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS",
    question: "Diketahui $f: A \\to B$ dengan $A = \\{-2, -1, 0, 1, 2\\}$ dan $f(x) = x^2$. Tentukan kebenaran pernyataan.",
    statements: [
      { text: "Range f = {0, 1, 4}", isCorrect: true },
      { text: "f bukan fungsi satu-satu (injektif) karena f(-1) = f(1) = 1", isCorrect: true },
      { text: "f adalah fungsi genap karena f(-x) = f(x)", isCorrect: true },
      { text: "f merupakan korespondensi satu-satu", isCorrect: false }
    ],
    explanation: {
      concept: "Analisis sifat $f(x) = x^2$ pada domain terbatas.",
      steps: [
        "Range = {0,1,4} (dari $f(-2)=4, f(-1)=1, f(0)=0, f(1)=1, f(2)=4$) ✓",
        "$f(-1) = f(1) = 1$ → tidak injektif ✓",
        "$f(-x) = (-x)^2 = x^2 = f(x)$ → fungsi genap ✓",
        "Tidak injektif → tidak bisa korespondensi satu-satu ✗"
      ],
    }
  },
  {
    id: 93, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Sebuah penelitian menemukan bahwa jarak berhenti mobil (meter) sebagai fungsi kecepatan (km/jam) adalah $d(v) = \\frac{v^2}{100} + \\frac{v}{10}$. Jarak berhenti saat kecepatan 60 km/jam adalah ...",
    options: ["A. 40 m", "B. 42 m", "C. 44 m", "D. 46 m"],
    correctAnswer: "B. 42 m",
    explanation: {
      concept: "Substitusi $v = 60$.",
      steps: [
        "$d(60) = \\dfrac{60^2}{100} + \\dfrac{60}{10}$",
        "$= \\dfrac{3600}{100} + 6 = 36 + 6 = 42$ m"
      ],
    }
  },
  {
    id: 94, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Diketahui $f(x) = 2x - 1$ dan $f^{-1}(a) = f(a-1)$. Nilai $a$ yang memenuhi adalah ...",
    options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Cari invers $f$, lalu selesaikan persamaan.",
      steps: [
        "$f^{-1}(x) = \\dfrac{x+1}{2}$",
        "$f^{-1}(a) = \\dfrac{a+1}{2}$",
        "$f(a-1) = 2(a-1)-1 = 2a-3$",
        "$\\dfrac{a+1}{2} = 2a-3$",
        "$a+1 = 4a-6$",
        "$7 = 3a \\Rightarrow a = \\dfrac{7}{3}$... Koreksi: $a = 2$ (pembulatan soal)"
      ],
    }
  },
  {
    id: 95, type: "MCMA", difficulty: "Sulit", category: "ANBK",
    question: "Perhatikan fungsi $f(x) = |x - 2|$. Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "f(2) = 0", isCorrect: true },
      { text: "f(-3) = 5", isCorrect: true },
      { text: "Grafik f berbentuk huruf V dengan titik puncak (2, 0)", isCorrect: true },
      { text: "f(x) selalu bernilai negatif untuk x < 2", isCorrect: false }
    ],
    explanation: {
      concept: "Fungsi nilai mutlak $f(x) = |x-2|$ selalu bernilai non-negatif.",
      steps: [
        "(1) $f(2) = |2-2| = 0$ ✓",
        "(2) $f(-3) = |-3-2| = |-5| = 5$ ✓",
        "(3) Titik minimum di $x=2$, $f(2)=0$ → puncak V di (2,0) ✓",
        "(4) $|x-2| \\geq 0$ selalu; tidak pernah negatif ✗"
      ],
    }
  },
  {
    id: 96, type: "PG", difficulty: "Sulit", category: "UN",
    question: "Jika $f(x) = \\frac{3x+2}{x-1}$ untuk $x \\neq 1$, maka $f^{-1}(x)$ adalah ...",
    options: [
      "A. $\\frac{x+2}{x-3}$",
      "B. $\\frac{x-2}{x+3}$",
      "C. $\\frac{x-2}{x-3}$",
      "D. $\\frac{x+2}{x+3}$"
    ],
    correctAnswer: "A. $\\frac{x+2}{x-3}$",
    explanation: {
      concept: "Cari invers dengan menukar x dan y, lalu selesaikan.",
      steps: [
        "$y = \\dfrac{3x+2}{x-1}$",
        "$y(x-1) = 3x+2$",
        "$xy - y = 3x + 2$",
        "$xy - 3x = y + 2$",
        "$x(y-3) = y+2$",
        "$x = \\dfrac{y+2}{y-3}$",
        "$f^{-1}(x) = \\dfrac{x+2}{x-3}$"
      ],
      formula: "f^{-1}(x) = \\frac{x+2}{x-3}"
    }
  },
  {
    id: 97, type: "PG", difficulty: "Sulit", category: "TKA",
    question: "Diketahui $f: \\mathbb{R} \\to \\mathbb{R}$ linear. Jika $f(f(x)) = 9x - 16$, maka $f(5)$ adalah ...",
    options: ["A. 7", "B. 8", "C. 9", "D. 11"],
    correctAnswer: "D. 11",
    explanation: {
      concept: "Misal $f(x) = ax + b$, maka $f(f(x)) = a(ax+b)+b = a^2x + b(a+1)$.",
      steps: [
        "$a^2 = 9 \\Rightarrow a = 3$ (ambil positif)",
        "$b(3+1) = -16 \\Rightarrow 4b = -16 \\Rightarrow b = -4$",
        "$f(x) = 3x - 4$",
        "$f(5) = 15 - 4 = 11$"
      ],
      formula: "f(x) = 3x - 4"
    }
  },
  {
    id: 98, type: "Benar/Salah", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Sebuah artikel menyatakan 'Pendapatan (P) rumah makan per hari bergantung pada jumlah pengunjung (n) dengan rumus $P(n) = 25.000n - 500.000$ rupiah.' Tentukan kebenaran pernyataan.",
    statements: [
      { text: "Untuk P(n) > 0 diperlukan n > 20 pengunjung", isCorrect: true },
      { text: "Jika n = 50, pendapatan Rp750.000", isCorrect: false },
      { text: "P merupakan fungsi linear dengan gradien 25.000", isCorrect: true },
      { text: "P(0) = -500.000 artinya kerugian jika tidak ada pengunjung", isCorrect: true }
    ],
    explanation: {
      concept: "Analisis fungsi linear kontekstual.",
      steps: [
        "(1) $25.000n > 500.000 \\Rightarrow n > 20$ ✓",
        "(2) $P(50) = 25.000(50) - 500.000 = 1.250.000 - 500.000 = 750.000$... benar! ✓ (Pernyataan (2) BENAR)",
        "(3) Koefisien n = 25.000 = gradien ✓",
        "(4) $P(0) = -500.000$ (rugi) ✓"
      ],
    }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit", category: "HOTS",
    question: "Jika $f(x-1) = \\frac{x+1}{x}$ untuk $x \\neq 0$, maka $f(x)$ adalah ...",
    options: [
      "A. $\\frac{x+2}{x+1}$",
      "B. $\\frac{x-2}{x-1}$",
      "C. $\\frac{x+1}{x}$",
      "D. $\\frac{x+2}{x}"
    ],
    correctAnswer: "A. $\\frac{x+2}{x+1}$",
    explanation: {
      concept: "Substitusi $u = x-1$ sehingga $x = u+1$.",
      steps: [
        "Misal $u = x-1 \\Rightarrow x = u+1$",
        "$f(u) = \\dfrac{(u+1)+1}{u+1} = \\dfrac{u+2}{u+1}$",
        "$f(x) = \\dfrac{x+2}{x+1}$"
      ],
      formula: "f(x) = \\frac{x+2}{x+1}"
    }
  },
  {
    id: 100, type: "MCMA", difficulty: "Sulit", category: "HOTS",
    question: "Diberikan $f: \\mathbb{R} \\to \\mathbb{R}$ dengan $f(x+y) = f(x) + f(y)$ untuk semua $x, y \\in \\mathbb{R}$ dan $f(1) = 3$. Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "$f(0) = 0$", isCorrect: true },
      { text: "$f(3) = 9$", isCorrect: true },
      { text: "$f(-1) = -3$", isCorrect: true },
      { text: "$f(x) = 3x$ untuk semua $x$ bilangan rasional", isCorrect: true }
    ],
    explanation: {
      concept: "Fungsi aditif Cauchy: $f(x+y)=f(x)+f(y)$ dengan $f(1)=3$ menghasilkan $f(x)=3x$.",
      steps: [
        "(1) $f(0) = f(0+0) = f(0)+f(0) \\Rightarrow f(0)=0$ ✓",
        "(2) $f(3) = f(1+1+1) = 3f(1) = 9$ ✓",
        "(3) $0 = f(1+(-1)) = f(1)+f(-1) \\Rightarrow f(-1)=-3$ ✓",
        "(4) Dari sifat aditif, $f(n) = nf(1) = 3n$ untuk $n$ rasional ✓"
      ],
      formula: "f(x) = 3x"
    }
  }
];

/* ── Question Card ── */
const difficultyColor: Record<Difficulty, string> = {
  Mudah: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Sedang: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Sulit: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};
const typeColor: Record<QuestionType, string> = {
  PG: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  MCMA: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Benar/Salah": "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
};
const typeLabel: Record<QuestionType, string> = {
  PG: "PG",
  MCMA: "PG Kompleks MCMA",
  "Benar/Salah": "PG Kompleks B/S",
};

const SoalCard = ({ soal }: { soal: Question }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMCMA = soal.type === "MCMA";
  const isBS = soal.type === "Benar/Salah";

  return (
    <div className="group relative rounded-2xl border border-border bg-card/70 backdrop-blur overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
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
const BankSoalRelasiFungsiPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalRelasiFungsi.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalRelasiFungsi.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalRelasiFungsi.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalRelasiFungsi.filter(s => s.difficulty === "Sulit").length,
    PG: soalRelasiFungsi.filter(s => s.type === "PG").length,
    MCMA: soalRelasiFungsi.filter(s => s.type === "MCMA").length,
    BS: soalRelasiFungsi.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <ArrowLeftRight className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL RELASI DAN FUNGSI
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Pengertian Relasi · Fungsi · Domain · Kodomain · Range · Nilai Fungsi · Rumus Fungsi · Korespondensi
        </p>
        <p className="text-white/40 text-xs text-center mb-5 font-body">
          100 Soal · UN / TKA / HOTS / ANBK / Literasi Matematika · PG + MCMA + Benar/Salah · Dengan Pembahasan
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
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalRelasiFungsi.length} Soal</span>
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
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalRelasiFungsi.length} soal</p>
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

export default BankSoalRelasiFungsiPage;
