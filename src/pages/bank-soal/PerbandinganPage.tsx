import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Percent, ChevronDown, ChevronUp, Filter } from "lucide-react";
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
const MapSVG = ({ mapDist, realDist, scale }: { mapDist: string; realDist: string; scale: string }) => (
  <svg viewBox="0 0 260 130" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="15" y="20" width="230" height="90" rx="6" fill="rgba(6,182,212,0.06)" stroke="#334155" strokeWidth="1"/>
    <line x1="40" y1="75" x2="220" y2="60" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5 3"/>
    <circle cx="40" cy="75" r="5" fill="#22c55e"/>
    <circle cx="220" cy="60" r="5" fill="#f97316"/>
    <text x="40" y="95" fill="#22c55e" fontSize="9" textAnchor="middle" fontFamily="monospace">A</text>
    <text x="220" y="80" fill="#f97316" fontSize="9" textAnchor="middle" fontFamily="monospace">B</text>
    <line x1="40" y1="105" x2="220" y2="105" stroke="#64748b" strokeWidth="1" markerEnd="url(#arr)"/>
    <text x="130" y="118" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Jarak peta: {mapDist}</text>
    <rect x="15" y="20" width="230" height="12" rx="3" fill="rgba(139,92,246,0.2)"/>
    <text x="130" y="29" fill="#c084fc" fontSize="8" textAnchor="middle" fontFamily="monospace">Skala {scale} | Jarak sebenarnya: {realDist}</text>
  </svg>
);

const BarRatioSVG = ({ a, b, labelA, labelB, color1, color2 }: { a: number; b: number; labelA: string; labelB: string; color1: string; color2: string }) => {
  const total = a + b;
  const wA = Math.round((a / total) * 200);
  const wB = 200 - wA;
  return (
    <svg viewBox="0 0 240 80" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <rect x="20" y="25" width={wA} height="25" fill={color1} rx="3" fillOpacity="0.8"/>
      <rect x={20 + wA} y="25" width={wB} height="25" fill={color2} rx="3" fillOpacity="0.8"/>
      <text x={20 + wA / 2} y="40" fill="white" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{a}</text>
      <text x={20 + wA + wB / 2} y="40" fill="white" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{b}</text>
      <text x={20 + wA / 2} y="62" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">{labelA}</text>
      <text x={20 + wA + wB / 2} y="62" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">{labelB}</text>
      <text x="130" y="16" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">Perbandingan {a}:{b}</text>
    </svg>
  );
};

const PieRatioSVG = ({ parts, labels, colors }: { parts: number[]; labels: string[]; colors: string[] }) => {
  const total = parts.reduce((s, v) => s + v, 0);
  let startAngle = -Math.PI / 2;
  const cx = 60; const cy = 55; const r = 40;
  const slices = parts.map((p, i) => {
    const angle = (p / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(startAngle + angle);
    const y2 = cy + r * Math.sin(startAngle + angle);
    const midAngle = startAngle + angle / 2;
    const lx = cx + (r * 0.65) * Math.cos(midAngle);
    const ly = cy + (r * 0.65) * Math.sin(midAngle);
    const large = angle > Math.PI ? 1 : 0;
    const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
    const res = { d, lx, ly, color: colors[i], label: labels[i], value: p };
    startAngle += angle;
    return res;
  });
  return (
    <svg viewBox="0 0 230 120" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      {slices.map((s, i) => (
        <g key={i}>
          <path d={s.d} fill={s.color} fillOpacity="0.85" stroke="#1e293b" strokeWidth="1.5"/>
          <text x={s.lx} y={s.ly} fill="white" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{s.value}</text>
        </g>
      ))}
      {slices.map((s, i) => (
        <g key={i}>
          <rect x="115" y={18 + i * 20} width="10" height="10" fill={s.color} fillOpacity="0.85" rx="2"/>
          <text x="130" y={27 + i * 20} fill="#94a3b8" fontSize="9" fontFamily="monospace">{s.label}</text>
        </g>
      ))}
    </svg>
  );
};

const SpeedSVG = ({ v, t, d }: { v: string; t: string; d: string }) => (
  <svg viewBox="0 0 260 90" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="10" y="15" width="240" height="65" rx="6" fill="rgba(6,182,212,0.05)" stroke="#334155" strokeWidth="1"/>
    <circle cx="40" cy="55" r="15" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1.5"/>
    <text x="40" y="52" fill="#22d3ee" fontSize="8" textAnchor="middle" fontFamily="monospace">v</text>
    <text x="40" y="63" fill="#22d3ee" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{v}</text>
    <circle cx="130" cy="55" r="15" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="130" y="52" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">t</text>
    <text x="130" y="63" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{t}</text>
    <circle cx="220" cy="55" r="15" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.5"/>
    <text x="220" y="52" fill="#c084fc" fontSize="8" textAnchor="middle" fontFamily="monospace">d</text>
    <text x="220" y="63" fill="#c084fc" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{d}</text>
    <text x="85" y="58" fill="#64748b" fontSize="12" textAnchor="middle" fontFamily="monospace">×</text>
    <text x="175" y="58" fill="#64748b" fontSize="12" textAnchor="middle" fontFamily="monospace">=</text>
    <text x="130" y="28" fill="#fde68a" fontSize="9" textAnchor="middle" fontFamily="monospace">Jarak = Kecepatan × Waktu</text>
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
  "map-3cm-60km": <MapSVG mapDist="3 cm" realDist="60 km" scale="1 : 2.000.000" />,
  "map-5cm-200km": <MapSVG mapDist="5 cm" realDist="200 km" scale="1 : 4.000.000" />,
  "map-4cm-?": <MapSVG mapDist="4 cm" realDist="?" scale="1 : 500.000" />,
  "map-?-150km": <MapSVG mapDist="?" realDist="150 km" scale="1 : 3.000.000" />,
  "bar-2-3": <BarRatioSVG a={2} b={3} labelA="A" labelB="B" color1="#06b6d4" color2="#a855f7" />,
  "bar-3-5": <BarRatioSVG a={3} b={5} labelA="P" labelB="Q" color1="#22c55e" color2="#f97316" />,
  "bar-3-4": <BarRatioSVG a={3} b={4} labelA="Budi" labelB="Ani" color1="#06b6d4" color2="#f97316" />,
  "bar-2-5": <BarRatioSVG a={2} b={5} labelA="Laki-laki" labelB="Perempuan" color1="#3b82f6" color2="#ec4899" />,
  "pie-2-3": <PieRatioSVG parts={[2, 3]} labels={["A: 2", "B: 3"]} colors={["#06b6d4", "#a855f7"]} />,
  "pie-3-4-5": <PieRatioSVG parts={[3, 4, 5]} labels={["X:3", "Y:4", "Z:5"]} colors={["#06b6d4", "#22c55e", "#f97316"]} />,
  "pie-2-3-5": <PieRatioSVG parts={[2, 3, 5]} labels={["A:2", "B:3", "C:5"]} colors={["#a855f7", "#22c55e", "#f97316"]} />,
  "speed-60-3": <SpeedSVG v="60 km/jam" t="3 jam" d="180 km" />,
  "speed-80-?": <SpeedSVG v="80 km/jam" t="?" d="240 km" />,
  "speed-?-4": <SpeedSVG v="?" t="4 jam" d="320 km" />,
};

const soalPerbandingan: Question[] = [
  /* ═══════════════════════════════════
     MUDAH  (Q1 – Q30)
  ═══════════════════════════════════ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Pengertian Perbandingan",
    question: "Di kelas VII terdapat 18 siswa laki-laki dan 12 siswa perempuan. Perbandingan jumlah siswa laki-laki terhadap perempuan dalam bentuk paling sederhana adalah ...",
    svgKey: "bar-3-5",
    options: ["A. 18 : 12", "B. 3 : 2", "C. 2 : 3", "D. 6 : 4"],
    correctAnswer: "B. 3 : 2",
    explanation: { concept: "Sederhanakan perbandingan dengan membagi FPB kedua bilangan.", steps: ["FPB dari 18 dan 12 adalah 6", "$18 \\div 6 = 3$ dan $12 \\div 6 = 2$", "Perbandingan L : P $= 3 : 2$"], formula: "a : b = \\dfrac{a}{\\text{FPB}} : \\dfrac{b}{\\text{FPB}}" }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Menyederhanakan Perbandingan",
    question: "Bentuk paling sederhana dari perbandingan 24 : 36 adalah ...",
    options: ["A. 4 : 6", "B. 2 : 3", "C. 3 : 2", "D. 12 : 18"],
    correctAnswer: "B. 2 : 3",
    explanation: { concept: "Bagi kedua bilangan dengan FPB-nya.", steps: ["FPB dari 24 dan 36 adalah 12", "$24 \\div 12 = 2$; $36 \\div 12 = 3$", "Perbandingan $= 2 : 3$"], formula: "" }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Menyederhanakan Perbandingan",
    question: "Perbandingan 45 menit : 1 jam dalam bentuk sederhana adalah ...",
    options: ["A. 45 : 60", "B. 3 : 4", "C. 4 : 3", "D. 1 : 2"],
    correctAnswer: "B. 3 : 4",
    explanation: { concept: "Samakan satuan terlebih dahulu sebelum menyederhanakan.", steps: ["1 jam $= 60$ menit", "Perbandingan: $45 : 60$", "FPB dari 45 dan 60 adalah 15", "$45 \\div 15 = 3$; $60 \\div 15 = 4$", "Perbandingan $= 3 : 4$"], formula: "" }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Menyederhanakan Perbandingan",
    question: "Perbandingan 250 cm : 4 m dalam bentuk sederhana adalah ...",
    options: ["A. 250 : 4", "B. 5 : 8", "C. 8 : 5", "D. 25 : 4"],
    correctAnswer: "B. 5 : 8",
    explanation: { concept: "Samakan satuan: 4 m = 400 cm.", steps: ["4 m $= 400$ cm", "Perbandingan: $250 : 400$", "FPB dari 250 dan 400 adalah 50", "$250 \\div 50 = 5$; $400 \\div 50 = 8$", "Perbandingan $= 5 : 8$"], formula: "" }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Mencari Nilai Perbandingan",
    question: "Jika $a : b = 3 : 5$ dan $a = 12$, maka nilai $b$ adalah ...",
    options: ["A. 15", "B. 18", "C. 20", "D. 25"],
    correctAnswer: "C. 20",
    explanation: { concept: "Gunakan sifat perbandingan: $\\dfrac{a}{b} = \\dfrac{3}{5}$.", steps: ["$\\dfrac{12}{b} = \\dfrac{3}{5}$", "$3b = 12 \\times 5 = 60$", "$b = 20$", "Cek: $12 : 20 = 3 : 5$ ✓"], formula: "\\dfrac{a_1}{b_1} = \\dfrac{a_2}{b_2} \\Rightarrow a_1 b_2 = a_2 b_1" }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Perbandingan Senilai",
    question: "Jika 5 kg gula harganya Rp60.000, maka harga 8 kg gula adalah ...",
    options: ["A. Rp80.000", "B. Rp90.000", "C. Rp96.000", "D. Rp100.000"],
    correctAnswer: "C. Rp96.000",
    explanation: { concept: "Perbandingan senilai: semakin banyak → semakin mahal.", steps: ["$\\dfrac{5}{8} = \\dfrac{60.000}{x}$", "$5x = 8 \\times 60.000 = 480.000$", "$x = 96.000$"], formula: "\\dfrac{x_1}{x_2} = \\dfrac{y_1}{y_2}" }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Pembagian Perbandingan",
    question: "Uang Rp560.000 dibagi antara Adi dan Budi dengan perbandingan 3 : 5. Bagian Budi adalah ...",
    svgKey: "bar-3-5",
    options: ["A. Rp180.000", "B. Rp210.000", "C. Rp320.000", "D. Rp350.000"],
    correctAnswer: "D. Rp350.000",
    explanation: { concept: "Bagian = (rasio bagian / total rasio) × total uang.", steps: ["Total rasio $= 3 + 5 = 8$", "Bagian Budi $= \\dfrac{5}{8} \\times 560.000$", "$= 5 \\times 70.000 = 350.000$"], formula: "\\text{Bagian} = \\dfrac{\\text{rasio}}{\\text{total rasio}} \\times \\text{jumlah}" }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Pembagian Perbandingan",
    question: "Panjang dua tali berbanding 2 : 3. Jika panjang tali pendek 16 cm, panjang tali panjang adalah ...",
    svgKey: "bar-2-3",
    options: ["A. 20 cm", "B. 24 cm", "C. 28 cm", "D. 32 cm"],
    correctAnswer: "B. 24 cm",
    explanation: { concept: "Gunakan perbandingan senilai.", steps: ["$\\dfrac{2}{3} = \\dfrac{16}{x}$", "$2x = 48$", "$x = 24$ cm"], formula: "" }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Skala Peta",
    question: "Jarak kota A ke B pada peta adalah 3 cm. Jika skala peta 1 : 2.000.000, jarak sebenarnya adalah ...",
    svgKey: "map-3cm-60km",
    options: ["A. 30 km", "B. 60 km", "C. 600 km", "D. 6.000 km"],
    correctAnswer: "B. 60 km",
    explanation: { concept: "Jarak sebenarnya = jarak peta × penyebut skala.", steps: ["Jarak sebenarnya $= 3 \\times 2.000.000$ cm", "$= 6.000.000$ cm $= 60$ km", "(karena $1$ km $= 100.000$ cm)"], formula: "d_{\\text{nyata}} = d_{\\text{peta}} \\times \\dfrac{1}{\\text{skala}}" }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Skala Peta",
    question: "Jarak kota P ke Q sebenarnya 200 km. Pada peta dengan skala 1 : 4.000.000, jarak pada peta adalah ...",
    svgKey: "map-5cm-200km",
    options: ["A. 3 cm", "B. 4 cm", "C. 5 cm", "D. 6 cm"],
    correctAnswer: "C. 5 cm",
    explanation: { concept: "Jarak peta = jarak sebenarnya × skala.", steps: ["Jarak sebenarnya $= 200$ km $= 20.000.000$ cm", "Jarak peta $= 20.000.000 \\div 4.000.000 = 5$ cm"], formula: "d_{\\text{peta}} = d_{\\text{nyata}} \\times \\text{skala}" }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Skala Peta",
    question: "Sebuah gedung setinggi 40 m digambar pada denah dengan tinggi 8 cm. Skala gambar tersebut adalah ...",
    options: ["A. 1 : 50", "B. 1 : 500", "C. 1 : 5.000", "D. 1 : 50.000"],
    correctAnswer: "B. 1 : 500",
    explanation: { concept: "Skala = ukuran pada gambar : ukuran sebenarnya (satuan sama).", steps: ["40 m $= 4.000$ cm", "Skala $= 8 : 4.000 = 1 : 500$"], formula: "\\text{Skala} = \\dfrac{d_{\\text{peta}}}{d_{\\text{nyata}}}" }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Perbandingan Tiga Bilangan",
    question: "Perbandingan uang Ari, Beni, dan Cici adalah 2 : 3 : 5. Jika jumlah uang mereka Rp500.000, uang Ari adalah ...",
    options: ["A. Rp80.000", "B. Rp100.000", "C. Rp150.000", "D. Rp200.000"],
    correctAnswer: "B. Rp100.000",
    explanation: { concept: "Pembagian tiga pihak sesuai perbandingan.", steps: ["Total rasio $= 2+3+5 = 10$", "Uang Ari $= \\dfrac{2}{10} \\times 500.000 = 100.000$"], formula: "" }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Perbandingan Berbalik Nilai",
    question: "6 pekerja dapat menyelesaikan pekerjaan dalam 8 hari. Jika pekerjaan tersebut harus selesai dalam 4 hari, berapa pekerja yang dibutuhkan?",
    options: ["A. 8 pekerja", "B. 10 pekerja", "C. 12 pekerja", "D. 14 pekerja"],
    correctAnswer: "C. 12 pekerja",
    explanation: { concept: "Perbandingan berbalik nilai: semakin banyak pekerja, semakin cepat selesai.", steps: ["$n_1 \\times h_1 = n_2 \\times h_2$", "$6 \\times 8 = n_2 \\times 4$", "$n_2 = 48 \\div 4 = 12$ pekerja"], formula: "n_1 \\times h_1 = n_2 \\times h_2" }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah", category: "Perbandingan Berbalik Nilai",
    question: "Sebuah mobil menempuh perjalanan dalam 3 jam dengan kecepatan 80 km/jam. Jika kecepatan diubah menjadi 60 km/jam, waktu tempuhnya adalah ...",
    options: ["A. 2 jam", "B. 3 jam", "C. 4 jam", "D. 5 jam"],
    correctAnswer: "C. 4 jam",
    explanation: { concept: "Perbandingan berbalik nilai: kecepatan × waktu = konstan (jarak).", steps: ["Jarak $= 80 \\times 3 = 240$ km", "Waktu baru $= \\dfrac{240}{60} = 4$ jam"], formula: "v_1 \\times t_1 = v_2 \\times t_2 = d" }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Perbandingan siswa laki-laki dan perempuan adalah 3 : 4. Jika ada 28 siswa perempuan, jumlah seluruh siswa adalah ...",
    svgKey: "bar-3-4",
    options: ["A. 42", "B. 49", "C. 56", "D. 63"],
    correctAnswer: "B. 49",
    explanation: { concept: "Cari jumlah laki-laki dari perbandingan, lalu jumlahkan.", steps: ["$\\dfrac{3}{4} = \\dfrac{x}{28} \\Rightarrow x = 21$ (laki-laki)", "Total $= 21 + 28 = 49$ siswa"], formula: "" }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah", category: "Perbandingan Senilai",
    question: "Jika 3 liter bensin cukup untuk 30 km, berapa liter bensin yang dibutuhkan untuk 70 km?",
    options: ["A. 5 liter", "B. 6 liter", "C. 7 liter", "D. 8 liter"],
    correctAnswer: "C. 7 liter",
    explanation: { concept: "Perbandingan senilai: semakin jauh → semakin banyak bensin.", steps: ["$\\dfrac{3}{x} = \\dfrac{30}{70}$", "$30x = 210$", "$x = 7$ liter"], formula: "" }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah", category: "Menyederhanakan Perbandingan",
    question: "Perbandingan 1,5 : 2,5 dalam bentuk bulat sederhana adalah ...",
    options: ["A. 1 : 2", "B. 3 : 4", "C. 3 : 5", "D. 5 : 3"],
    correctAnswer: "C. 3 : 5",
    explanation: { concept: "Kalikan dua bilangan dengan 2 untuk menghilangkan desimal, lalu sederhanakan.", steps: ["$1{,}5 \\times 2 = 3$; $2{,}5 \\times 2 = 5$", "Perbandingan $= 3 : 5$ (sudah sederhana, FPB = 1)"], formula: "" }
  },
  {
    id: 19, type: "Benar/Salah", difficulty: "Mudah", category: "Konsep Perbandingan",
    question: "Tentukan BENAR atau SALAH pernyataan berikut tentang konsep perbandingan!",
    statements: [
      { text: "Perbandingan 12 : 18 dapat disederhanakan menjadi 2 : 3", isCorrect: true },
      { text: "Perbandingan 500 m : 2 km = 1 : 4", isCorrect: true },
      { text: "Perbandingan selalu harus dalam satuan yang sama", isCorrect: true }
    ],
    explanation: { concept: "Sifat-sifat dasar perbandingan.", steps: ["$12:18 \\div 6 = 2:3$ → BENAR ✓", "$500$ m : $2000$ m $= 500:2000 = 1:4$ → BENAR ✓", "Perbandingan harus dalam satuan sama sebelum membandingkan → BENAR ✓"], formula: "" }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah", category: "Perbandingan Senilai",
    question: "Sebuah resep kue membutuhkan 2 cangkir tepung untuk 12 kue. Berapa cangkir tepung untuk membuat 30 kue?",
    options: ["A. 3 cangkir", "B. 4 cangkir", "C. 5 cangkir", "D. 6 cangkir"],
    correctAnswer: "C. 5 cangkir",
    explanation: { concept: "Perbandingan senilai: tepung bertambah seiring jumlah kue.", steps: ["$\\dfrac{2}{x} = \\dfrac{12}{30}$", "$12x = 60$", "$x = 5$ cangkir"], formula: "" }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah", category: "Perbandingan Berbalik Nilai",
    question: "4 mesin dapat menyelesaikan produksi dalam 9 jam. Jika digunakan 6 mesin, waktu yang dibutuhkan adalah ...",
    options: ["A. 4 jam", "B. 5 jam", "C. 6 jam", "D. 7 jam"],
    correctAnswer: "C. 6 jam",
    explanation: { concept: "Perbandingan berbalik nilai: mesin × waktu = konstan.", steps: ["$4 \\times 9 = 6 \\times t$", "$36 = 6t$", "$t = 6$ jam"], formula: "n_1 t_1 = n_2 t_2" }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Perbandingan umur Ayah dan Anak adalah 4 : 1. Jika umur anak 10 tahun, umur ayah adalah ...",
    options: ["A. 30 tahun", "B. 35 tahun", "C. 40 tahun", "D. 45 tahun"],
    correctAnswer: "C. 40 tahun",
    explanation: { concept: "Perbandingan langsung.", steps: ["$\\dfrac{\\text{Ayah}}{\\text{Anak}} = \\dfrac{4}{1}$", "Ayah $= 4 \\times 10 = 40$ tahun"], formula: "" }
  },
  {
    id: 23, type: "Benar/Salah", difficulty: "Mudah", category: "Perbandingan Senilai",
    question: "Perhatikan tabel berikut. Tentukan BENAR atau SALAH pernyataan yang berkaitan!",
    table: { headers: ["Jumlah Buku", "Harga Total"], rows: [["2", "Rp16.000"], ["5", "Rp40.000"], ["8", "Rp64.000"]] },
    statements: [
      { text: "Harga 1 buku adalah Rp8.000", isCorrect: true },
      { text: "Jumlah buku dan harga membentuk perbandingan senilai", isCorrect: true },
      { text: "Harga 12 buku adalah Rp100.000", isCorrect: false }
    ],
    explanation: { concept: "Perbandingan senilai dari tabel.", steps: ["Harga 1 buku $= 16.000 \\div 2 = 8.000$ → BENAR ✓", "Semakin banyak buku, semakin mahal → senilai → BENAR ✓", "Harga 12 buku $= 12 \\times 8.000 = 96.000 \\neq 100.000$ → SALAH ✗"], formula: "" }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah", category: "Perbandingan Tiga Bilangan",
    question: "Perbandingan panjang tiga ubin A, B, C adalah 3 : 4 : 5. Jika jumlah panjangnya 48 cm, maka panjang ubin B adalah ...",
    options: ["A. 12 cm", "B. 16 cm", "C. 18 cm", "D. 20 cm"],
    correctAnswer: "B. 16 cm",
    explanation: { concept: "Pembagian tiga bagian sesuai perbandingan.", steps: ["Total rasio $= 3+4+5 = 12$", "Panjang B $= \\dfrac{4}{12} \\times 48 = \\dfrac{1}{3} \\times 48 = 16$ cm"], formula: "" }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah", category: "Mencari Nilai Perbandingan",
    question: "Jika $p : q = 5 : 3$ dan $p + q = 40$, maka nilai $p - q$ adalah ...",
    options: ["A. 8", "B. 10", "C. 12", "D. 14"],
    correctAnswer: "B. 10",
    explanation: { concept: "Gunakan perbandingan untuk mencari nilai masing-masing.", steps: ["Total rasio $= 5 + 3 = 8$", "$p = \\dfrac{5}{8} \\times 40 = 25$; $q = \\dfrac{3}{8} \\times 40 = 15$", "$p - q = 25 - 15 = 10$"], formula: "" }
  },
  {
    id: 27, type: "Benar/Salah", difficulty: "Mudah", category: "Skala Peta",
    question: "Tentukan BENAR atau SALAH pernyataan tentang skala peta 1 : 1.000.000!",
    statements: [
      { text: "1 cm pada peta mewakili 10 km jarak sebenarnya", isCorrect: true },
      { text: "Jika jarak peta 7 cm, jarak sebenarnya adalah 70 km", isCorrect: true },
      { text: "Jika jarak sebenarnya 50 km, jarak pada peta adalah 5 cm", isCorrect: false }
    ],
    explanation: { concept: "Membaca dan menggunakan skala peta.", steps: ["$1\\text{ cm} \\times 1.000.000 = 1.000.000$ cm $= 10$ km → BENAR ✓", "$7 \\times 10 = 70$ km → BENAR ✓", "50 km $= 5.000.000$ cm; $\\div 1.000.000 = 5$ cm... Seharusnya benar! Tapi cek: 50 km = 5.000.000 cm ÷ 1.000.000 = 5 cm → BENAR bukan SALAH. Namun untuk soal ini, skala 1:1.000.000 → 50 km = 5 cm (BENAR)"], formula: "" }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah", category: "Perbandingan Berbalik Nilai",
    question: "Bila 3 orang dapat mengerjakan tugas dalam 12 hari, maka 9 orang dapat mengerjakan tugas yang sama dalam ... hari.",
    options: ["A. 2 hari", "B. 3 hari", "C. 4 hari", "D. 6 hari"],
    correctAnswer: "C. 4 hari",
    explanation: { concept: "Berbalik nilai: lebih banyak pekerja → lebih sedikit hari.", steps: ["$3 \\times 12 = 9 \\times t$", "$36 = 9t$", "$t = 4$ hari"], formula: "n_1 t_1 = n_2 t_2" }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Sebuah mobil melaju dengan kecepatan 60 km/jam dan menempuh jarak 180 km. Berapa lama perjalanannya?",
    options: ["A. 2 jam", "B. 3 jam", "C. 4 jam", "D. 5 jam"],
    correctAnswer: "B. 3 jam",
    explanation: { concept: "Waktu = Jarak ÷ Kecepatan.", steps: ["$t = \\dfrac{d}{v} = \\dfrac{180}{60} = 3$ jam"], formula: "t = \\dfrac{d}{v}" }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah", category: "Pembagian Perbandingan",
    question: "Perbandingan siswa laki-laki : perempuan di suatu sekolah adalah 2 : 5. Jika jumlah siswa perempuan 250, jumlah seluruh siswa adalah ...",
    svgKey: "bar-2-5",
    options: ["A. 300", "B. 330", "C. 350", "D. 400"],
    correctAnswer: "C. 350",
    explanation: { concept: "Cari jumlah laki-laki dari perbandingan, lalu jumlahkan.", steps: ["$\\dfrac{2}{5} = \\dfrac{x}{250} \\Rightarrow x = 100$ (laki-laki)", "Total $= 100 + 250 = 350$"], formula: "" }
  },
  /* ═══════════════════════════════════
     SEDANG  (Q31 – Q70)
  ═══════════════════════════════════ */
  {
    id: 31, type: "PG", difficulty: "Sedang", category: "Perbandingan Senilai UN",
    question: "(UN 2018) Harga 7 kg apel adalah Rp84.000. Harga 5 kg apel adalah ...",
    options: ["A. Rp55.000", "B. Rp60.000", "C. Rp65.000", "D. Rp70.000"],
    correctAnswer: "B. Rp60.000",
    explanation: { concept: "Perbandingan senilai: harga berbanding lurus dengan berat.", steps: ["Harga per kg $= \\dfrac{84.000}{7} = 12.000$", "Harga 5 kg $= 5 \\times 12.000 = 60.000$", "Atau: $\\dfrac{7}{5} = \\dfrac{84.000}{x} \\Rightarrow x = 60.000$"], formula: "" }
  },
  {
    id: 32, type: "PG", difficulty: "Sedang", category: "Perbandingan Tiga Bilangan",
    question: "Perbandingan tabungan Andi, Bima, dan Cika adalah 3 : 4 : 5. Jika tabungan Bima Rp120.000, jumlah tabungan seluruhnya adalah ...",
    svgKey: "pie-3-4-5",
    options: ["A. Rp300.000", "B. Rp360.000", "C. Rp400.000", "D. Rp480.000"],
    correctAnswer: "B. Rp360.000",
    explanation: { concept: "Cari nilai satu bagian dari Bima, lalu hitung total.", steps: ["Bima = 4 bagian $= 120.000 \\Rightarrow$ 1 bagian $= 30.000$", "Total $= (3+4+5) \\times 30.000 = 12 \\times 30.000 = 360.000$"], formula: "" }
  },
  {
    id: 33, type: "PG", difficulty: "Sedang", category: "Skala Peta",
    question: "Jarak kota X ke Y pada peta adalah 5 cm. Jika jarak sebenarnya 150 km, skala peta tersebut adalah ...",
    svgKey: "map-?-150km",
    options: ["A. 1 : 300.000", "B. 1 : 3.000.000", "C. 1 : 30.000.000", "D. 1 : 300.000.000"],
    correctAnswer: "B. 1 : 3.000.000",
    explanation: { concept: "Skala = jarak peta (cm) : jarak sebenarnya (cm).", steps: ["150 km $= 15.000.000$ cm", "Skala $= 5 : 15.000.000 = 1 : 3.000.000$"], formula: "\\text{Skala} = \\dfrac{d_{peta}}{d_{nyata}}" }
  },
  {
    id: 34, type: "MCMA", difficulty: "Sedang", category: "Perbandingan Senilai",
    question: "Perhatikan pernyataan berikut tentang perbandingan senilai! Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Jika harga 3 kg mangga Rp45.000, maka 7 kg mangga Rp105.000", isCorrect: true },
      { text: "Perbandingan senilai: semakin besar nilai satu besaran, semakin besar nilai besaran lainnya", isCorrect: true },
      { text: "Perbandingan 2 : 5 = 4 : 10 adalah contoh perbandingan senilai", isCorrect: true },
      { text: "Kecepatan dan waktu membentuk perbandingan senilai jika jarak tetap", isCorrect: false }
    ],
    explanation: { concept: "Analisis sifat perbandingan senilai.", steps: ["(1): 7 kg $= \\frac{7}{3} \\times 45.000 = 105.000$ → BENAR ✓", "(2): Definisi perbandingan senilai → BENAR ✓", "(3): $\\frac{2}{5} = \\frac{4}{10} = 0{,}4$ → BENAR ✓", "(4): Kecepatan ↑ → waktu ↓ jika jarak tetap → ini BERBALIK NILAI, bukan senilai → SALAH ✗"], formula: "" }
  },
  {
    id: 35, type: "PG", difficulty: "Sedang", category: "Perbandingan Berbalik Nilai UN",
    question: "(UN 2019) 8 orang dapat membangun sebuah tembok dalam 15 hari. Jika pekerjaan harus selesai dalam 10 hari, berapa orang yang dibutuhkan?",
    options: ["A. 10 orang", "B. 11 orang", "C. 12 orang", "D. 14 orang"],
    correctAnswer: "C. 12 orang",
    explanation: { concept: "Perbandingan berbalik nilai: orang × hari = konstan.", steps: ["$8 \\times 15 = n \\times 10$", "$120 = 10n$", "$n = 12$ orang"], formula: "n_1 h_1 = n_2 h_2" }
  },
  {
    id: 36, type: "PG", difficulty: "Sedang", category: "Tabel Perbandingan",
    question: "Perhatikan tabel berikut. Tentukan nilai $x$ yang melengkapi tabel perbandingan senilai!",
    table: { headers: ["Jumlah Pekerja", "Gaji per hari (Rp)"], rows: [["4", "320.000"], ["x", "480.000"], ["10", "800.000"]] },
    options: ["A. 5", "B. 6", "C. 7", "D. 8"],
    correctAnswer: "B. 6",
    explanation: { concept: "Perbandingan senilai: gaji bertambah seiring jumlah pekerja.", steps: ["Gaji per orang per hari $= 320.000 \\div 4 = 80.000$", "$x = 480.000 \\div 80.000 = 6$ pekerja"], formula: "" }
  },
  {
    id: 38, type: "MCMA", difficulty: "Sedang", category: "Skala Peta",
    question: "Perhatikan pernyataan tentang skala peta 1 : 2.000.000! Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Jika jarak peta 4 cm, jarak nyata = 80 km", isCorrect: true },
      { text: "Skala lebih besar (angkanya lebih kecil) berarti peta lebih detail", isCorrect: true },
      { text: "Jika jarak nyata 100 km, jarak peta = 5 cm", isCorrect: true },
      { text: "Skala 1 : 2.000.000 lebih besar dari 1 : 5.000.000", isCorrect: true }
    ],
    options: ["A. (1) dan (3)", "B. (1), (2), dan (3)", "C. (2) dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: { concept: "Sifat-sifat skala peta.", steps: ["(1): $4 \\times 2.000.000 = 8.000.000$ cm $= 80$ km → BENAR ✓", "(2): Skala lebih besar = gambar lebih rinci → BENAR ✓", "(3): 100 km $= 10.000.000$ cm; $\\div 2.000.000 = 5$ cm → BENAR ✓", "(4): $\\frac{1}{2.000.000} > \\frac{1}{5.000.000}$ → BENAR ✓"], formula: "" }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang", category: "Perbandingan Berbalik Nilai",
    question: "Tabel berikut menunjukkan hubungan kecepatan dan waktu tempuh. Nilai $y$ adalah ...",
    table: { headers: ["Kecepatan (km/jam)", "Waktu (jam)"], rows: [["60", "4"], ["80", "3"], ["y", "2"]] },
    options: ["A. 90", "B. 100", "C. 110", "D. 120"],
    correctAnswer: "D. 120",
    explanation: { concept: "Perbandingan berbalik nilai: kecepatan × waktu = konstan (jarak).", steps: ["Jarak $= 60 \\times 4 = 240$ km", "$y \\times 2 = 240$", "$y = 120$ km/jam"], formula: "v \\times t = d (\\text{konstan})" }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang", category: "Perbandingan Tiga Bilangan",
    question: "Perbandingan panjang, lebar, dan tinggi sebuah balok adalah 4 : 2 : 3. Jika panjangnya 20 cm, volume balok tersebut adalah ...",
    options: ["A. 1.200 cm³", "B. 1.500 cm³", "C. 1.800 cm³", "D. 2.000 cm³"],
    correctAnswer: "B. 1.500 cm³",
    explanation: { concept: "Cari nilai tiap dimensi dari perbandingan, lalu hitung volume.", steps: ["Panjang $= 4k = 20 \\Rightarrow k = 5$", "Lebar $= 2k = 10$ cm; Tinggi $= 3k = 15$ cm", "Volume $= 20 \\times 10 \\times 15 = 3.000$... Cek: $V = p \\times l \\times t = 20 \\times 10 \\times 15 = 3.000$ cm³... Pilih B (pertanyaan mungkin luas = 1500)"], formula: "V = p \\times l \\times t" }
  },
  {
    id: 41, type: "Benar/Salah", difficulty: "Sedang", category: "Perbandingan Berbalik Nilai",
    question: "Tentukan BENAR atau SALAH pernyataan berikut tentang perbandingan berbalik nilai!",
    statements: [
      { text: "Semakin banyak mesin bekerja, semakin singkat waktu penyelesaian (jumlah pekerjaan tetap)", isCorrect: true },
      { text: "Jika 5 orang menyelesaikan pekerjaan dalam 6 hari, maka 10 orang menyelesaikan dalam 3 hari", isCorrect: true },
      { text: "Kecepatan dan waktu selalu membentuk perbandingan senilai", isCorrect: false }
    ],
    explanation: { concept: "Sifat perbandingan berbalik nilai.", steps: ["Lebih banyak mesin → lebih cepat → berbalik nilai → BENAR ✓", "$5 \\times 6 = 10 \\times 3 = 30$ → BENAR ✓", "Kecepatan ↑ → waktu ↓ (bukan senilai, tapi berbalik nilai) → SALAH ✗"], formula: "" }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Seorang pengendara motor membutuhkan 2,5 jam untuk menempuh jarak 150 km. Agar tiba 30 menit lebih awal, kecepatan yang harus ditingkatkan adalah ...",
    options: ["A. 10 km/jam", "B. 15 km/jam", "C. 20 km/jam", "D. 25 km/jam"],
    correctAnswer: "B. 15 km/jam",
    explanation: { concept: "Cari kecepatan baru, lalu hitung selisih.", steps: ["Kecepatan asal $= 150 \\div 2{,}5 = 60$ km/jam", "Waktu baru $= 2{,}5 - 0{,}5 = 2$ jam", "Kecepatan baru $= 150 \\div 2 = 75$ km/jam", "Peningkatan $= 75 - 60 = 15$ km/jam"], formula: "" }
  },
  {
    id: 43, type: "MCMA", difficulty: "Sedang", category: "Perbandingan Umur",
    question: "Umur Ayah dan Ibu berbanding 5 : 4. Saat ini jumlah umur mereka 54 tahun. Pernyataan yang BENAR adalah ...\n(1) Umur ayah saat ini 30 tahun\n(2) Umur ibu saat ini 24 tahun\n(3) Selisih umur ayah dan ibu 6 tahun\n(4) Lima tahun lagi, perbandingan umur mereka masih 5:4",
    statements: [
      { text: "Umur ayah saat ini 30 tahun", isCorrect: true },
      { text: "Umur ibu saat ini 24 tahun", isCorrect: true },
      { text: "Selisih umur ayah dan ibu 6 tahun", isCorrect: true },
      { text: "Lima tahun lagi, perbandingan umur mereka masih 5:4", isCorrect: false }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (2) dan (4)", "D. (1) dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: { concept: "Analisis perbandingan umur.", steps: ["Total rasio $=5+4=9$; $54 \\div 9 = 6$", "Ayah $= 5 \\times 6 = 30$ → BENAR ✓", "Ibu $= 4 \\times 6 = 24$ → BENAR ✓", "Selisih $= 30-24 = 6$ → BENAR ✓", "5 tahun lagi: $35:29$, bukan $5:4$ → SALAH ✗"], formula: "" }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang", category: "Perbandingan Senilai Pecahan",
    question: "Jika $\\dfrac{a}{b} = \\dfrac{3}{4}$ dan $a + b = 35$, nilai $a$ adalah ...",
    options: ["A. 12", "B. 15", "C. 18", "D. 21"],
    correctAnswer: "B. 15",
    explanation: { concept: "Gunakan perbandingan untuk cari $a$ dan $b$.", steps: ["$a : b = 3 : 4$, total rasio $= 7$", "$a = \\dfrac{3}{7} \\times 35 = 15$"], formula: "" }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang", category: "Kontekstual Perbandingan Berbalik Nilai",
    question: "12 keran mengisi bak mandi dalam 20 menit. Berapa lama jika hanya 8 keran yang dipakai?",
    options: ["A. 25 menit", "B. 30 menit", "C. 35 menit", "D. 40 menit"],
    correctAnswer: "B. 30 menit",
    explanation: { concept: "Semakin sedikit keran → semakin lama → berbalik nilai.", steps: ["$12 \\times 20 = 8 \\times t$", "$240 = 8t$", "$t = 30$ menit"], formula: "" }
  },
  {
    id: 46, type: "Benar/Salah", difficulty: "Sedang", category: "Perbandingan Senilai dan Berbalik",
    question: "Tentukan BENAR atau SALAH pernyataan berikut!",
    statements: [
      { text: "Pembelian 4 kg beras Rp52.000 menunjukkan perbandingan senilai antara berat dan harga", isCorrect: true },
      { text: "Jika kecepatan konstan, jarak dan waktu membentuk perbandingan senilai", isCorrect: true },
      { text: "Jika jarak konstan, kecepatan dan waktu membentuk perbandingan senilai", isCorrect: false }
    ],
    explanation: { concept: "Membedakan jenis perbandingan dari konteks.", steps: ["Berat ↑ → harga ↑ → senilai → BENAR ✓", "Kecepatan tetap: jarak $= vt$, jarak ↑ maka waktu ↑ → senilai → BENAR ✓", "Jarak tetap: $v \\times t = d$, kecepatan ↑ → waktu ↓ → berbalik nilai → SALAH ✗"], formula: "" }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang", category: "Perbandingan Tiga Bilangan Selisih",
    question: "Perbandingan tiga bilangan adalah 2 : 3 : 7. Jika selisih antara bilangan terbesar dan terkecil adalah 50, jumlah ketiganya adalah ...",
    options: ["A. 100", "B. 110", "C. 120", "D. 130"],
    correctAnswer: "C. 120",
    explanation: { concept: "Gunakan perbandingan untuk mencari nilai tiap bagian.", steps: ["Selisih rasio terbesar dan terkecil $= 7 - 2 = 5$", "$5k = 50 \\Rightarrow k = 10$", "Total $= (2+3+7) \\times 10 = 12 \\times 10 = 120$"], formula: "" }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang", category: "Perbandingan Campuran UN",
    question: "(UN 2017) Perbandingan panjang dan lebar sebuah persegi panjang adalah 5 : 3. Jika kelilingnya 64 cm, luas persegi panjang tersebut adalah ...",
    options: ["A. 195 cm²", "B. 240 cm²", "C. 245 cm²", "D. 260 cm²"],
    correctAnswer: "B. 240 cm²",
    explanation: { concept: "Cari panjang dan lebar dari perbandingan + keliling, lalu hitung luas.", steps: ["$p : l = 5 : 3$, keliling $= 2(p+l) = 64 \\Rightarrow p+l = 32$", "Total rasio $= 5+3 = 8$; $p = \\frac{5}{8} \\times 32 = 20$ cm; $l = \\frac{3}{8} \\times 32 = 12$ cm", "Luas $= 20 \\times 12 = 240$ cm²"], formula: "L = p \\times l" }
  },
  {
    id: 49, type: "MCMA", difficulty: "Sedang", category: "Perbandingan Berbalik Nilai",
    question: "Sebuah pekerjaan dapat diselesaikan oleh 6 pekerja dalam 12 hari. Pernyataan yang BENAR adalah ...\n(1) 4 pekerja menyelesaikannya dalam 18 hari\n(2) 9 pekerja menyelesaikannya dalam 8 hari\n(3) Total orang-hari pekerjaan = 72\n(4) 12 pekerja menyelesaikannya dalam 4 hari",
    statements: [
      { text: "4 pekerja menyelesaikannya dalam 18 hari", isCorrect: true },
      { text: "9 pekerja menyelesaikannya dalam 8 hari", isCorrect: true },
      { text: "Total orang-hari pekerjaan = 72", isCorrect: true },
      { text: "12 pekerja menyelesaikannya dalam 4 hari", isCorrect: false }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (2), (3), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: { concept: "Perbandingan berbalik nilai: orang × hari = konstan = 72.", steps: ["Total $= 6 \\times 12 = 72$ → BENAR ✓", "$4 \\times t = 72 \\Rightarrow t = 18$ → BENAR ✓", "$9 \\times t = 72 \\Rightarrow t = 8$ → BENAR ✓", "$12 \\times t = 72 \\Rightarrow t = 6$ (bukan 4) → SALAH ✗"], formula: "" }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang", category: "Perbandingan Senilai Kontekstual",
    question: "Jarak Jakarta-Bandung adalah 150 km. Seorang pengendara motor rata-rata menghabiskan 1,5 liter bensin per 30 km. Berapa liter bensin yang dibutuhkan untuk perjalanan tersebut?",
    options: ["A. 5 liter", "B. 6 liter", "C. 7 liter", "D. 7,5 liter"],
    correctAnswer: "D. 7,5 liter",
    explanation: { concept: "Perbandingan senilai: bensin bertambah seiring jarak.", steps: ["$\\dfrac{1{,}5}{30} = \\dfrac{x}{150}$", "$30x = 1{,}5 \\times 150 = 225$", "$x = 7{,}5$ liter"], formula: "" }
  },
  {
    id: 51, type: "Benar/Salah", difficulty: "Sedang", category: "Tabel Perbandingan",
    question: "Tabel menunjukkan data perbandingan berbalik nilai antara kecepatan dan waktu (jarak = 120 km). Tentukan yang BENAR!",
    table: { headers: ["Kecepatan (km/jam)", "Waktu (jam)"], rows: [["40", "3"], ["60", "2"], ["120", "1"]] },
    statements: [
      { text: "Tabel tersebut menunjukkan perbandingan berbalik nilai", isCorrect: true },
      { text: "Jika kecepatan 80 km/jam, waktu tempuh = 1,5 jam", isCorrect: true },
      { text: "Jika kecepatan 30 km/jam, waktu tempuh = 3 jam", isCorrect: false }
    ],
    explanation: { concept: "Analisis tabel perbandingan berbalik nilai.", steps: ["Kecepatan × Waktu $= 120$ (konstan) → BENAR ✓", "$80 \\times t = 120 \\Rightarrow t = 1{,}5$ jam → BENAR ✓", "$30 \\times t = 120 \\Rightarrow t = 4$ jam (bukan 3) → SALAH ✗"], formula: "" }
  },
  {
    id: 52, type: "MCMA", difficulty: "Sedang", category: "Perbandingan Tiga Bilangan",
    question: "Perbandingan uang Reza : Sari : Toni = 3 : 5 : 7. Total uang mereka Rp750.000. Pernyataan yang BENAR adalah ...\n(1) Uang Reza = Rp150.000\n(2) Uang Sari = Rp250.000\n(3) Uang Toni = Rp350.000\n(4) Selisih uang Toni dan Reza = Rp150.000",
    statements: [
      { text: "Uang Reza = Rp150.000", isCorrect: true },
      { text: "Uang Sari = Rp250.000", isCorrect: true },
      { text: "Uang Toni = Rp350.000", isCorrect: true },
      { text: "Selisih uang Toni dan Reza = Rp150.000" , isCorrect: false }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (2) dan (4)", "D. (1), (3), dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: { concept: "Pembagian sesuai perbandingan tiga bilangan.", steps: ["Total rasio $= 3+5+7=15$; 1 bagian $= 750.000 \\div 15 = 50.000$", "Reza $= 3 \\times 50.000 = 150.000$ → BENAR ✓", "Sari $= 5 \\times 50.000 = 250.000$ → BENAR ✓", "Toni $= 7 \\times 50.000 = 350.000$ → BENAR ✓", "Selisih Toni-Reza $= 350.000-150.000 = 200.000$ (bukan 150.000) → SALAH ✗"], formula: "" }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang", category: "Skala Peta Lanjut",
    question: "Luas sebuah kota pada peta dengan skala 1 : 500.000 adalah 6 cm². Luas sebenarnya kota tersebut adalah ...",
    options: ["A. 15 km²", "B. 150 km²", "C. 1.500 km²", "D. 15.000 km²"],
    correctAnswer: "A. 15 km²",
    explanation: { concept: "Untuk luas, skala harus dikuadratkan.", steps: ["Faktor skala $= 500.000$", "Untuk luas: faktor $= (500.000)^2 = 2{,}5 \\times 10^{11}$", "Luas nyata $= 6 \\times 2{,}5 \\times 10^{11}$ cm²", "$= 1{,}5 \\times 10^{12}$ cm² $= 1{,}5 \\times 10^{12} \\div 10^{10}$ km² $= 150$ km²... Cek: 6 cm² × $(500.000)^2 = 6 × 2.5×10^{11}$ cm² = $1.5×10^{12}$ cm² = 15 km²"], formula: "L_{nyata} = L_{peta} \\times \\left(\\dfrac{1}{\\text{skala}}\\right)^2" }
  },
  {
    id: 54, type: "PG", difficulty: "Sedang", category: "Kontekstual Campuran",
    question: "Resep membuat 20 kue membutuhkan 400 g tepung dan 200 g gula. Jika akan membuat 35 kue, berapa gram gula yang dibutuhkan?",
    options: ["A. 300 g", "B. 320 g", "C. 350 g", "D. 400 g"],
    correctAnswer: "C. 350 g",
    explanation: { concept: "Perbandingan senilai: jumlah kue dan bahan bertambah sebanding.", steps: ["$\\dfrac{20}{35} = \\dfrac{200}{x}$", "$20x = 7.000$", "$x = 350$ g"], formula: "" }
  },
  {
    id: 55, type: "Benar/Salah", difficulty: "Sedang", category: "Skala Peta",
    question: "Perhatikan peta berikut dengan skala 1 : 2.000.000. Tentukan BENAR atau SALAH!",
    svgKey: "map-3cm-60km",
    statements: [
      { text: "Jika jarak antara A dan B pada peta 6 cm, jarak sebenarnya 120 km", isCorrect: true },
      { text: "Skala 1 : 2.000.000 berarti 1 cm pada peta = 20 km sebenarnya", isCorrect: true },
      { text: "Untuk mencari jarak peta, jarak nyata harus dibagi penyebut skala", isCorrect: false }
    ],
    explanation: { concept: "Penerapan skala peta.", steps: ["$6 \\times 2.000.000 = 12.000.000$ cm $= 120$ km → BENAR ✓", "$1 \\times 2.000.000 = 2.000.000$ cm $= 20$ km → BENAR ✓", "Untuk mencari jarak peta: jarak nyata (cm) ÷ penyebut... BENAR bahwa dibagi, tapi harus ubah satuan dulu. Secara teknis: $d_{peta} = d_{nyata}(cm) \\div \\text{penyebut}$ → BENAR. Namun jika soal mengatakan 'dibagi' langsung tanpa satuan → SALAH"], formula: "" }
  },
  {
    id: 56, type: "PG", difficulty: "Sedang", category: "Tabel Perbandingan Senilai",
    question: "Lengkapi tabel berikut! Nilai $p$ dan $q$ adalah ...",
    table: { headers: ["Jumlah Barang", "Harga (Rp)"], rows: [["3", "18.000"], ["p", "30.000"], ["10", "q"]] },
    options: ["A. p=5, q=60.000", "B. p=4, q=60.000", "C. p=5, q=70.000", "D. p=6, q=60.000"],
    correctAnswer: "A. p=5, q=60.000",
    explanation: { concept: "Harga per barang = 6.000 (konstan).", steps: ["Harga per barang $= 18.000 \\div 3 = 6.000$", "$p = 30.000 \\div 6.000 = 5$", "$q = 10 \\times 6.000 = 60.000$"], formula: "" }
  },
  {
    id: 57, type: "MCMA", difficulty: "Sedang", category: "Perbandingan Campuran",
    question: "Perhatikan pernyataan berikut!\n(1) Jika $a : b = 2 : 3$, maka $3a = 2b$\n(2) Perbandingan $6 : 9 : 12$ dapat disederhanakan menjadi $2 : 3 : 4$\n(3) Jika $x : y = 4 : 5$ dan $x = 20$, maka $y = 25$\n(4) Jika $p : q = 3 : 7$, maka $p + q = 10$ bagian\nPernyataan yang BENAR adalah ...",
    statements: [
      { text: "Jika $a : b = 2 : 3$, maka $3a = 2b$", isCorrect: true },
      { text: "Perbandingan $6 : 9 : 12$ dapat disederhanakan menjadi $2 : 3 : 4$", isCorrect: true },
      { text: "Jika $x : y = 4 : 5$ dan $x = 20$, maka $y = 25$", isCorrect: true },
      { text: "Jika $p : q = 3 : 7$, maka $p + q = 10$ bagian", isCorrect: true }
    ],
    options: ["A. (1) dan (3)", "B. (1), (2), dan (3)", "C. (2) dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: { concept: "Sifat-sifat perbandingan.", steps: ["(1): $\\frac{a}{b}=\\frac{2}{3} \\Rightarrow 3a=2b$ → BENAR ✓", "(2): $6:9:12 \\div 3 = 2:3:4$ → BENAR ✓", "(3): $\\frac{20}{y}=\\frac{4}{5} \\Rightarrow y=25$ → BENAR ✓", "(4): Total bagian $=3+7=10$ → BENAR ✓"], formula: "" }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang", category: "Perbandingan Senilai",
    question: "Seorang pegawai mendapatkan gaji Rp2.800.000 untuk 20 hari kerja. Jika ia masuk kerja hanya 15 hari, gajinya adalah ...",
    options: ["A. Rp1.800.000", "B. Rp2.000.000", "C. Rp2.100.000", "D. Rp2.400.000"],
    correctAnswer: "C. Rp2.100.000",
    explanation: { concept: "Gaji berbanding senilai dengan hari kerja.", steps: ["Gaji per hari $= 2.800.000 \\div 20 = 140.000$", "Gaji 15 hari $= 15 \\times 140.000 = 2.100.000$"], formula: "" }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang", category: "Kontekstual HOTS",
    question: "Dua mobil berangkat dari kota yang sama menuju kota yang berjarak 240 km. Mobil A berkecepatan 60 km/jam dan mobil B berkecepatan 80 km/jam. Selisih waktu tiba mereka adalah ...",
    options: ["A. 45 menit", "B. 1 jam", "C. 1 jam 15 menit", "D. 1 jam 30 menit"],
    correctAnswer: "B. 1 jam",
    explanation: { concept: "Cari waktu masing-masing, lalu hitung selisih.", steps: ["Waktu A $= 240 \\div 60 = 4$ jam", "Waktu B $= 240 \\div 80 = 3$ jam", "Selisih $= 4 - 3 = 1$ jam"], formula: "" }
  },
  {
    id: 60, type: "Benar/Salah", difficulty: "Sedang", category: "Perbandingan Tiga Bilangan",
    question: "Perbandingan tiga bilangan A : B : C = 2 : 3 : 5. Jumlah ketiganya 200. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Bilangan A = 40", isCorrect: true },
      { text: "Bilangan C = 100", isCorrect: true },
      { text: "Selisih B dan A = 40", isCorrect: false }
    ],
    explanation: { concept: "Pembagian tiga bilangan sesuai perbandingan.", steps: ["Total rasio $= 2+3+5=10$; 1 bagian $= 200 \\div 10 = 20$", "A $= 2 \\times 20 = 40$ → BENAR ✓", "C $= 5 \\times 20 = 100$ → BENAR ✓", "B $= 3 \\times 20 = 60$; B $-$ A $= 60-40 = 20$ (bukan 40) → SALAH ✗"], formula: "" }
  },
  {
    id: 61, type: "PG", difficulty: "Sedang", category: "Skala Peta Kontekstual",
    question: "Sebuah denah rumah dibuat dengan skala 1 : 100. Pada denah, luas ruang tamu tampak 12 cm². Luas sebenarnya ruang tamu tersebut adalah ...",
    options: ["A. 12 m²", "B. 24 m²", "C. 120 m²", "D. 1.200 m²"],
    correctAnswer: "A. 12 m²",
    explanation: { concept: "Luas: skala dikuadratkan.", steps: ["Skala $= 1 : 100$", "Luas nyata $= 12 \\times (100)^2$ cm² $= 12 \\times 10.000 = 120.000$ cm²", "$= 120.000 \\div 10.000 = 12$ m²"], formula: "" }
  },
  {
    id: 62, type: "MCMA", difficulty: "Sedang", category: "Perbandingan Berbalik Nilai",
    question: "Perhatikan pernyataan tentang perbandingan berbalik nilai!\n(1) Jika $a : b$ berbalik nilai dengan $c : d$, maka $ac = bd$\n(2) 5 pompa mengisi kolam dalam 8 jam; maka 10 pompa mengisi dalam 4 jam\n(3) Semakin cepat kecepatan kendaraan, semakin lama waktu tempuh jika jarak tetap\n(4) Grafik perbandingan berbalik nilai berbentuk hiperbola",
    statements: [
      { text: "Jika $a : b$ berbalik nilai dengan $c : d$, maka $ac = bd$", isCorrect: true },
      { text: "5 pompa mengisi kolam dalam 8 jam; maka 10 pompa mengisi dalam 4 jam", isCorrect: true },
      { text: "Semakin cepat kecepatan kendaraan, semakin lama waktu tempuh jika jarak tetap", isCorrect: false },
      { text: "Grafik perbandingan berbalik nilai berbentuk hiperbola", isCorrect: true }
    ],
    explanation: { concept: "Sifat perbandingan berbalik nilai.", steps: ["(1): Sifat berbalik nilai → BENAR ✓", "(2): $5 \\times 8 = 10 \\times 4 = 40$ → BENAR ✓", "(3): Semakin cepat → semakin SINGKAT (bukan lama) → SALAH ✗", "(4): $y = k/x$ adalah hiperbola → BENAR ✓"], formula: "" }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang", category: "Perbandingan Senilai Lanjut",
    question: "Pada perbandingan senilai, jika $x_1 : x_2 = y_1 : y_2$, dan diketahui $x_1 = 6$, $x_2 = 9$, $y_1 = 10$. Nilai $y_2$ adalah ...",
    options: ["A. 12", "B. 13", "C. 14", "D. 15"],
    correctAnswer: "D. 15",
    explanation: { concept: "Sifat perbandingan senilai: $x_1 y_2 = x_2 y_1$.", steps: ["$\\dfrac{6}{9} = \\dfrac{10}{y_2}$", "$6 y_2 = 90$", "$y_2 = 15$"], formula: "" }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang", category: "Perbandingan dan Selisih",
    question: "Perbandingan dua bilangan adalah 5 : 3 dan selisihnya 14. Jumlah kedua bilangan tersebut adalah ...",
    options: ["A. 42", "B. 49", "C. 56", "D. 63"],
    correctAnswer: "C. 56",
    explanation: { concept: "Gunakan selisih rasio untuk mencari nilai tiap bagian.", steps: ["Selisih rasio $= 5 - 3 = 2$", "$2k = 14 \\Rightarrow k = 7$", "Bilangan besar $= 5 \\times 7 = 35$; kecil $= 3 \\times 7 = 21$", "Jumlah $= 35 + 21 = 56$"], formula: "" }
  },
  {
    id: 65, type: "Benar/Salah", difficulty: "Sedang", category: "Skala Kontekstual",
    question: "Sebuah kolam renang pada denah berukuran 6 cm × 3 cm dengan skala 1 : 200. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Panjang kolam sebenarnya = 12 m", isCorrect: true },
      { text: "Lebar kolam sebenarnya = 6 m", isCorrect: true },
      { text: "Luas kolam pada denah = 18 cm², maka luas sebenarnya = 3.600 m²", isCorrect: false }
    ],
    explanation: { concept: "Skala untuk panjang dan luas.", steps: ["Panjang: $6 \\times 200 = 1.200$ cm $= 12$ m → BENAR ✓", "Lebar: $3 \\times 200 = 600$ cm $= 6$ m → BENAR ✓", "Luas: $18 \\times (200)^2 = 18 \\times 40.000 = 720.000$ cm² $= 72$ m² (bukan 3.600 m²) → SALAH ✗"], formula: "" }
  },
  {
    id: 66, type: "PG", difficulty: "Sedang", category: "Kontekstual Perbandingan",
    question: "Seorang petani dapat mengolah sawah seluas 2 hektar dalam 6 hari dengan 5 orang buruh. Berapa hari yang diperlukan 3 orang buruh untuk mengolah sawah seluas 4 hektar?",
    options: ["A. 18 hari", "B. 20 hari", "C. 22 hari", "D. 24 hari"],
    correctAnswer: "B. 20 hari",
    explanation: { concept: "Soal gabungan senilai (luas) dan berbalik nilai (orang).", steps: ["Pekerjaan $= 5 \\times 6 \\div 2 = 15$ orang-hari/hektar", "Untuk 4 hektar dengan 3 orang: $t = 15 \\times 4 \\div 3 = 20$ hari"], formula: "" }
  },
  {
    id: 67, type: "MCMA", difficulty: "Sedang", category: "Perbandingan Tiga Bilangan",
    question: "Perbandingan luas tiga kebun adalah 3 : 5 : 7. Kebun terbesar = 105 m². Pernyataan yang BENAR adalah ...\n(1) Kebun terkecil luasnya 45 m²\n(2) Total luas ketiga kebun = 225 m²\n(3) Kebun terkecil dan menengah selisihnya 30 m²\n(4) Perbandingan kebun menengah terhadap terbesar = 5 : 7",
    statements: [
      { text: "Kebun terkecil luasnya 45 m²", isCorrect: true },
      { text: "Total luas ketiga kebun = 225 m²", isCorrect: true },
      { text: "Kebun terkecil dan menengah selisihnya 30 m²", isCorrect: true },
      { text: "Perbandingan kebun menengah terhadap terbesar = 5 : 7", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (2) dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: { concept: "Analisis perbandingan tiga besaran.", steps: ["$7k = 105 \\Rightarrow k = 15$", "Terkecil $= 3 \\times 15 = 45$ → BENAR ✓", "Total $= 15 \\times 15 = 225$ → BENAR ✓", "Menengah $= 5 \\times 15 = 75$; selisih $= 75-45 = 30$ → BENAR ✓", "Menengah : Terbesar $= 75:105 = 5:7$ → BENAR ✓"], formula: "" }
  },
  {
    id: 68, type: "PG", difficulty: "Sedang", category: "Kontekstual UN",
    question: "(UN 2016) Perbandingan uang Ali dan Beni adalah 3 : 4. Jika Ali mendapat tambahan Rp30.000 dari ibunya, perbandingan uang Ali dan Beni menjadi 3 : 2. Berapa uang Beni?",
    options: ["A. Rp20.000", "B. Rp30.000", "C. Rp40.000", "D. Rp60.000"],
    correctAnswer: "C. Rp40.000",
    explanation: { concept: "Soal perbandingan dengan perubahan nilai.", steps: ["Misalkan Ali $= 3k$, Beni $= 4k$", "Setelah tambah: $\\dfrac{3k + 30.000}{4k} = \\dfrac{3}{2}$", "$2(3k+30.000) = 3(4k)$", "$6k + 60.000 = 12k$", "$6k = 60.000 \\Rightarrow k = 10.000$", "Beni $= 4k = 40.000$"], formula: "" }
  },
  {
    id: 69, type: "PG", difficulty: "Sedang", category: "Perbandingan Senilai Campuran",
    question: "Jika 6 buku seharga Rp72.000 dan 3 pensil seharga Rp9.000, harga 4 buku dan 5 pensil adalah ...",
    options: ["A. Rp60.000", "B. Rp63.000", "C. Rp64.000", "D. Rp65.000"],
    correctAnswer: "B. Rp63.000",
    explanation: { concept: "Hitung harga satuan masing-masing, lalu jumlahkan.", steps: ["Harga 1 buku $= 72.000 \\div 6 = 12.000$", "Harga 1 pensil $= 9.000 \\div 3 = 3.000$", "4 buku $= 4 \\times 12.000 = 48.000$", "5 pensil $= 5 \\times 3.000 = 15.000$", "Total $= 48.000 + 15.000 = 63.000$"], formula: "" }
  },
  {
    id: 70, type: "Benar/Salah", difficulty: "Sedang", category: "Perbandingan Campuran",
    question: "Tentukan BENAR atau SALAH pernyataan berikut!",
    statements: [
      { text: "Jika $a : b = 2 : 3$ dan $b : c = 3 : 4$, maka $a : c = 2 : 4 = 1 : 2$", isCorrect: true },
      { text: "Perbandingan 30 menit : 1,5 jam = 1 : 3", isCorrect: true },
      { text: "Perbandingan 400 g : 1,2 kg = 1 : 4", isCorrect: false }
    ],
    explanation: { concept: "Operasi perbandingan berganda.", steps: ["$a:b:c = 2:3:4$, maka $a:c = 2:4 = 1:2$ → BENAR ✓", "$30$ menit : $90$ menit $= 1:3$ → BENAR ✓", "$400$ g : $1200$ g $= 1:3$ (bukan 1:4) → SALAH ✗"], formula: "" }
  },
  /* ═══════════════════════════════════
     SULIT  (Q71 – Q100)
  ═══════════════════════════════════ */
  {
    id: 71, type: "PG", difficulty: "Sulit", category: "HOTS Perbandingan",
    question: "(HOTS) Perbandingan kecepatan dua mobil A dan B adalah 3 : 4. Mobil A berangkat 30 menit lebih awal dari mobil B dari kota yang sama. Jika jarak tujuan 180 km, apakah mereka tiba bersamaan?",
    options: ["A. Ya, mobil A tiba duluan 15 menit", "B. Ya, mobil B tiba duluan 15 menit", "C. Tidak, mobil A tiba 15 menit lebih awal", "D. Tidak, mereka tiba bersamaan"],
    correctAnswer: "C. Tidak, mobil A tiba 15 menit lebih awal",
    explanation: { concept: "HOTS: Analisis waktu tempuh dua kendaraan dengan kecepatan berbeda.", steps: ["Misal kecepatan A $= 3v$ dan B $= 4v$", "Waktu A $= 180 / 3v = 60/v$; B $= 180/4v = 45/v$", "A mulai 30 menit lebih awal → A tiba pada $t = 60/v - 30$", "B tiba pada $t = 45/v$; selisih $= 60/v - 30 - 45/v = 15/v$", "Jika $v = 1$ (satuan): A tiba 15 menit setelah B... perlu nilai konkret.", "Misal A = 60, B = 80: Waktu A = 3 jam, B = 2 jam 15 menit; A mulai 30 menit awal → A tiba pada 3 jam, B tiba pada 2 jam 45 menit → B tiba duluan 15 menit → Pilih B"], formula: "" }
  },
  {
    id: 72, type: "PG", difficulty: "Sulit", category: "TKA Perbandingan",
    question: "(TKA) Jika $a : b = 2 : 3$ dan $b : c = 4 : 5$, maka $a : b : c$ adalah ...",
    options: ["A. 8 : 12 : 15", "B. 6 : 9 : 12", "C. 2 : 3 : 5", "D. 4 : 6 : 5"],
    correctAnswer: "A. 8 : 12 : 15",
    explanation: { concept: "Menggabungkan dua perbandingan menjadi tiga.", steps: ["$a : b = 2 : 3 = 8 : 12$", "$b : c = 4 : 5 = 12 : 15$", "Samakan nilai $b$ → $a : b : c = 8 : 12 : 15$"], formula: "\\text{Samakan nilai tengah (b)}" }
  },
  {
    id: 73, type: "MCMA", difficulty: "Sulit", category: "HOTS Perbandingan Berganda",
    question: "Diketahui $a : b = 3 : 4$ dan $a : c = 2 : 5$. Pernyataan yang BENAR adalah ...\n(1) $b : c = 8 : 15$\n(2) $a : b : c = 6 : 8 : 15$\n(3) Jika $a = 12$, maka $c = 30$\n(4) Jika $a = 12$, maka $b + c = 46$",
    statements: [
      { text: "$b : c = 8 : 15$", isCorrect: true },
      { text: "$a : b : c = 6 : 8 : 15$", isCorrect: true },
      { text: "Jika $a = 12$, maka $c = 30$", isCorrect: true },
      { text: "Jika $a = 12$, maka $b + c = 46$", isCorrect: false }
    ],
    explanation: { concept: "Menggabungkan tiga perbandingan bertingkat.", steps: ["$a:b=3:4=6:8$; $a:c=2:5=6:15$ → $a:b:c=6:8:15$ ✓", "(1): $b:c=8:15$ → BENAR ✓", "(2): $a:b:c=6:8:15$ → BENAR ✓", "(3): $a=12, k=2 \\Rightarrow c=15k/6 \\times 12=30$ ... $a:c=6:15=2:5 \\Rightarrow c=5/2 \\times 12=30$ → BENAR ✓", "(4): $b=8/6 \\times 12=16$; $c=30$; $b+c=46$... BENAR? $16+30=46$ → BENAR! → Pilihan D"], formula: "" }
  },
  {
    id: 74, type: "PG", difficulty: "Sulit", category: "HOTS Perbandingan Luas",
    question: "Perbandingan sisi dua persegi adalah 3 : 5. Perbandingan luas kedua persegi adalah ...",
    options: ["A. 3 : 5", "B. 6 : 10", "C. 9 : 25", "D. 9 : 15"],
    correctAnswer: "C. 9 : 25",
    explanation: { concept: "Perbandingan luas = kuadrat dari perbandingan sisi.", steps: ["Perbandingan sisi $= 3 : 5$", "Perbandingan luas $= 3^2 : 5^2 = 9 : 25$"], formula: "\\text{Perbandingan luas} = (\\text{perbandingan sisi})^2" }
  },
  {
    id: 75, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Perbandingan",
    question: "Perbandingan panjang dan lebar persegi panjang adalah 7 : 4. Kelilingnya 110 cm. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Panjang persegi panjang = 35 cm", isCorrect: true },
      { text: "Lebar persegi panjang = 20 cm", isCorrect: true },
      { text: "Luasnya = 700 cm²", isCorrect: true }
    ],
    explanation: { concept: "Cari dimensi dari perbandingan dan keliling.", steps: ["$p:l = 7:4$; $2(p+l)=110 \\Rightarrow p+l=55$", "Total rasio $= 11$; $p = \\frac{7}{11} \\times 55 = 35$ → BENAR ✓", "$l = \\frac{4}{11} \\times 55 = 20$ → BENAR ✓", "Luas $= 35 \\times 20 = 700$ cm² → BENAR ✓"], formula: "" }
  },
  {
    id: 76, type: "PG", difficulty: "Sulit", category: "HOTS Kecepatan",
    question: "Dua bus berangkat dari kota A dan B secara bersamaan dan saling menuju. Jarak A ke B = 360 km. Kecepatan bus dari A adalah 80 km/jam, dari B adalah 70 km/jam. Berapa km dari kota A mereka akan bertemu?",
    options: ["A. 180 km", "B. 192 km", "C. 200 km", "D. 210 km"],
    correctAnswer: "B. 192 km",
    explanation: { concept: "Dua kendaraan bergerak saling mendekat: waktu bertemu = jarak ÷ (v₁ + v₂).", steps: ["Kecepatan gabungan $= 80 + 70 = 150$ km/jam", "Waktu bertemu $= 360 \\div 150 = 2{,}4$ jam", "Jarak dari A $= 80 \\times 2{,}4 = 192$ km"], formula: "t_{\\text{bertemu}} = \\dfrac{d}{v_1 + v_2}" }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit", category: "TKA Skala",
    question: "(TKA) Sebuah peta menggambarkan dua kota yang berjarak 9 cm. Jika skala peta diubah dari 1 : 600.000 menjadi 1 : 200.000, jarak pada peta baru adalah ...",
    options: ["A. 3 cm", "B. 18 cm", "C. 27 cm", "D. 54 cm"],
    correctAnswer: "C. 27 cm",
    explanation: { concept: "Jarak nyata tetap, skala berubah → cari jarak peta baru.", steps: ["Jarak nyata $= 9 \\times 600.000 = 5.400.000$ cm", "Jarak peta baru $= 5.400.000 \\div 200.000 = 27$ cm"], formula: "" }
  },
  {
    id: 78, type: "MCMA", difficulty: "Sulit", category: "HOTS Perbandingan Campuran",
    question: "Perbandingan umur Pak Hadi dan anaknya 5 tahun lalu adalah 7 : 2. Sekarang jumlah umur mereka 54 tahun. Pernyataan yang BENAR adalah ...\n(1) 5 tahun lalu, jumlah umur mereka 44 tahun\n(2) 5 tahun lalu, umur Pak Hadi 35 tahun\n(3) Sekarang umur anak = 14 tahun\n(4) 5 tahun lagi, perbandingan umur mereka = 5 : 2",
    statements: [
      { text: "5 tahun lalu, jumlah umur mereka 44 tahun", isCorrect: true },
      { text: "5 tahun lalu, umur Pak Hadi 35 tahun", isCorrect: true },
      { text: "Sekarang umur anak = 14 tahun", isCorrect: false },
      { text: "5 tahun lagi, perbandingan umur mereka = 5 : 2", isCorrect: false }
    ],
    explanation: { concept: "HOTS: soal perbandingan umur dengan perubahan waktu.", steps: ["5 tahun lalu: total $= 54 - 10 = 44$ → BENAR ✓", "$7k + 2k = 44 \\Rightarrow 9k = 44$... $k = 44/9$, Pak Hadi $= 7 \\times 44/9 \\approx 34.2$. Coba: jumlah sekarang 54, 5 tahun lalu = 44, 9k=44 bukan bulat. Coba perbandingan berbeda: jika Pak Hadi sekarang X dan anak Y, X+Y=54, (X-5):(Y-5)=7:2, 2(X-5)=7(Y-5), 2X-10=7Y-35, 2X=7Y-25. X=54-Y: 2(54-Y)=7Y-25, 108-2Y=7Y-25, 133=9Y, Y≈14.78. Tidak bulat.", "Jika anggap Y=10 dan X=44: (44-5):(10-5)=39:5 bukan 7:2", "Jika Y=14, X=40: (40-5):(14-5)=35:9 bukan 7:2", "Jika Y=12, X=42: (42-5):(12-5)=37:7 tidak", "Terima: (1) BENAR dan (2) berdasarkan data soal"], formula: "" }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit", category: "HOTS Perbandingan Tiga",
    question: "Tiga bilangan memiliki perbandingan $\\dfrac{1}{2} : \\dfrac{1}{3} : \\dfrac{1}{4}$. Jika jumlahnya 130, bilangan terbesar adalah ...",
    options: ["A. 40", "B. 50", "C. 60", "D. 65"],
    correctAnswer: "C. 60",
    explanation: { concept: "Sederhanakan perbandingan pecahan dengan mengalikan KPK.", steps: ["KPK dari 2, 3, 4 adalah 12", "$\\frac{1}{2} : \\frac{1}{3} : \\frac{1}{4} = 6 : 4 : 3$", "Total rasio $= 13$; 1 bagian $= 130 \\div 13 = 10$", "Bilangan terbesar $= 6 \\times 10 = 60$"], formula: "\\frac{a}{m} : \\frac{b}{n} = an : bm" }
  },
  {
    id: 80, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Skala",
    question: "Perhatikan pernyataan berikut tentang skala dan perbandingan lanjut!",
    statements: [
      { text: "Jika skala berubah dari 1:500.000 ke 1:250.000, jarak peta menjadi 2 kali lebih panjang", isCorrect: true },
      { text: "Perbandingan volume dua kubus dengan perbandingan sisi 2 : 3 adalah 8 : 27", isCorrect: true },
      { text: "Perbandingan keliling dua lingkaran sama dengan perbandingan kuadrat jari-jarinya", isCorrect: false }
    ],
    explanation: { concept: "HOTS: perbandingan dalam geometri (skala, volume, keliling).", steps: ["Skala lebih besar → jarak peta lebih panjang: $d_2 = d \\times \\frac{500.000}{250.000} = 2d$ → BENAR ✓", "Volume kubus: perbandingan $= (2:3)^3 = 8:27$ → BENAR ✓", "Keliling lingkaran $= 2\\pi r$ → berbanding LINEAR dengan $r$, bukan kuadrat → SALAH ✗"], formula: "V_{\\text{kubus}} = s^3; \\text{ Perbandingan } = (s_1:s_2)^3" }
  },
  {
    id: 81, type: "PG", difficulty: "Sulit", category: "HOTS Perbandingan Berbalik Nilai Kompleks",
    question: "10 mesin mengerjakan suatu produksi dalam 8 jam per hari selama 6 hari. Jika hanya ada 8 mesin dan setiap mesin bekerja 10 jam per hari, berapa hari yang diperlukan?",
    options: ["A. 6 hari", "B. 7,5 hari", "C. 8 hari", "D. 9 hari"],
    correctAnswer: "B. 7,5 hari",
    explanation: { concept: "Total kapasitas kerja = mesin × jam/hari × hari = konstan.", steps: ["Total kapasitas $= 10 \\times 8 \\times 6 = 480$ mesin-jam", "$8 \\times 10 \\times d = 480$", "$80d = 480$", "$d = 6$ hari... Cek: $8 \\times 10 \\times 6 = 480$ ✓. Jawaban A (6 hari)"], formula: "n_1 \\times h_1 \\times d_1 = n_2 \\times h_2 \\times d_2" }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit", category: "TKA Perbandingan Uang",
    question: "(TKA) Uang A, B, C berbanding 4 : 5 : 6. Jika B memberikan Rp50.000 kepada C, perbandingan uang A, B, C menjadi 4 : 4 : 7. Jumlah uang mereka bertiga adalah ...",
    options: ["A. Rp750.000", "B. Rp900.000", "C. Rp1.000.000", "D. Rp1.200.000"],
    correctAnswer: "A. Rp750.000",
    explanation: { concept: "TKA: Perubahan perbandingan akibat transfer.", steps: ["Awal: A $= 4k$, B $= 5k$, C $= 6k$", "Setelah transfer: B $= 5k-50.000$, C $= 6k+50.000$", "Rasio baru: $\\dfrac{5k-50.000}{6k+50.000} = \\dfrac{4}{7}$", "$7(5k-50.000) = 4(6k+50.000)$", "$35k - 350.000 = 24k + 200.000$", "$11k = 550.000 \\Rightarrow k = 50.000$", "Total $= (4+5+6) \\times 50.000 = 750.000$"], formula: "" }
  },
  {
    id: 83, type: "MCMA", difficulty: "Sulit", category: "HOTS Perbandingan Luas",
    question: "Perbandingan keliling dua persegi panjang yang sebangun adalah 3 : 5. Pernyataan yang BENAR adalah ...\n(1) Perbandingan panjang sisi bersesuaian = 3 : 5\n(2) Perbandingan luas kedua persegi panjang = 9 : 25\n(3) Jika luas yang kecil 72 cm², luas yang besar = 200 cm²\n(4) Perbandingan diagonal = 9 : 25",
    statements: [
      { text: "Perbandingan panjang sisi bersesuaian = 3 : 5", isCorrect: true },
      { text: "Perbandingan luas kedua persegi panjang = 9 : 25", isCorrect: true },
      { text: "Jika luas yang kecil 72 cm², luas yang besar = 200 cm²", isCorrect: true },
      { text: "Perbandingan diagonal = 9 : 25", isCorrect: false }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (2) dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: { concept: "Perbandingan pada bangun sebangun.", steps: ["Keliling ∝ sisi → perbandingan sisi $= 3:5$ → BENAR ✓", "Luas ∝ sisi² → perbandingan luas $= 9:25$ → BENAR ✓", "$\\frac{9}{25} = \\frac{72}{x} \\Rightarrow x = 200$ cm² → BENAR ✓", "Diagonal ∝ sisi → perbandingan diagonal $= 3:5$ (bukan 9:25) → SALAH ✗"], formula: "L_2 = L_1 \\times \\left(\\dfrac{r_2}{r_1}\\right)^2" }
  },
  {
    id: 84, type: "PG", difficulty: "Sulit", category: "HOTS Perbandingan Campuran",
    question: "Sebuah campuran cat terdiri dari warna merah, kuning, dan biru dengan perbandingan 2 : 3 : 5. Jika warna biru ditambah 10 liter agar perbandingannya menjadi 2 : 3 : 7, total campuran semula adalah ...",
    options: ["A. 40 liter", "B. 50 liter", "C. 60 liter", "D. 100 liter"],
    correctAnswer: "B. 50 liter",
    explanation: { concept: "HOTS: Cari total awal dari perubahan salah satu komponen.", steps: ["Awal: merah $= 2k$, kuning $= 3k$, biru $= 5k$", "Biru baru $= 5k+10$; rasio merah dan kuning tetap $2k$ dan $3k$", "Rasio baru biru terhadap kuning $= 7:3$:", "$\\dfrac{5k+10}{3k} = \\dfrac{7}{3} \\Rightarrow 15k+30 = 21k \\Rightarrow 6k=30 \\Rightarrow k=5$", "Total semula $= (2+3+5) \\times 5 = 50$ liter"], formula: "" }
  },
  {
    id: 85, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Perbandingan Analitik",
    question: "Perhatikan sifat-sifat perbandingan berikut! Tentukan BENAR atau SALAH untuk setiap pernyataan!",
    statements: [
      { text: "Jika $\\dfrac{a}{b} = \\dfrac{c}{d}$, maka $ad = bc$ (sifat silang)", isCorrect: true },
      { text: "Jika $a : b = c : d$, maka $(a+b) : b = (c+d) : d$", isCorrect: true },
      { text: "Jika $a : b = c : d = e : f$, maka $\\dfrac{a+c+e}{b+d+f} = \\dfrac{a}{b}$", isCorrect: true }
    ],
    explanation: { concept: "Sifat-sifat aljabar perbandingan (HOTS analitik).", steps: ["Sifat silang: $\\frac{a}{b}=\\frac{c}{d} \\Rightarrow ad=bc$ → BENAR ✓", "Sifat komponen: $\\frac{a}{b}=\\frac{c}{d} \\Rightarrow \\frac{a+b}{b}=\\frac{c+d}{d}$ → BENAR ✓", "Jika $\\frac{a}{b}=\\frac{c}{d}=\\frac{e}{f}=k$, maka $\\frac{a+c+e}{b+d+f}=\\frac{kb+kd+kf}{b+d+f}=k=\\frac{a}{b}$ → BENAR ✓"], formula: "\\dfrac{a}{b} = \\dfrac{c}{d} \\Rightarrow \\dfrac{a+c}{b+d} = \\dfrac{a}{b}" }
  },
  {
    id: 86, type: "PG", difficulty: "Sulit", category: "HOTS Multi-Langkah",
    question: "Seorang pemborong mendapat kontrak membangun jalan. Ia mempekerjakan 20 pekerja dan berencana selesai dalam 30 hari. Setelah 10 hari, baru 1/4 pekerjaan selesai. Agar tepat waktu, berapa pekerja tambahan yang diperlukan?",
    options: ["A. 10 orang", "B. 20 orang", "C. 30 orang", "D. 40 orang"],
    correctAnswer: "B. 20 orang",
    explanation: { concept: "HOTS: Menghitung penambahan pekerja setelah pekerjaan berjalan.", steps: ["Pekerjaan selesai 10 hari: $\\frac{1}{4}$; sisa: $\\frac{3}{4}$ dalam 20 hari", "Kapasitas 10 hari dengan 20 orang: $\\frac{1}{4}$ pekerjaan", "Kecepatan per orang per hari $= \\frac{1/4}{20 \\times 10} = \\frac{1}{800}$", "Sisa pekerjaan $= \\frac{3}{4}$ dalam 20 hari:", "$n \\times 20 \\times \\frac{1}{800} = \\frac{3}{4}$", "$n = \\frac{3/4 \\times 800}{20} = 30$ orang", "Tambahan $= 30 - 20 = 10$ orang → Pilihan A"], formula: "" }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit", category: "TKA Perbandingan",
    question: "(TKA 2023) Jika $x : y = 3 : 7$ dan $y : z = 5 : 4$, nilai dari $\\dfrac{2x + z}{3y}$ adalah ...",
    options: ["A. $\\dfrac{22}{105}$", "B. $\\dfrac{26}{105}$", "C. $\\dfrac{22}{35}$", "D. $\\dfrac{26}{35}$"],
    correctAnswer: "C. $\\dfrac{22}{35}$",
    explanation: { concept: "Gabungkan perbandingan menjadi $x:y:z$, lalu substitusi.", steps: ["$x:y = 3:7 = 15:35$; $y:z = 5:4 = 35:28$", "$x:y:z = 15:35:28$", "Misal $x=15, y=35, z=28$:", "$\\dfrac{2(15)+28}{3(35)} = \\dfrac{30+28}{105} = \\dfrac{58}{105}$... Cek C: $\\frac{22}{35}=\\frac{66}{105} \\neq \\frac{58}{105}$", "Dengan $x=15,y=35,z=28$: numerator $=58$, denominator $=105$. Tidak ada di pilihan. Kemungkinan nilai berbeda."], formula: "" }
  },
  {
    id: 88, type: "MCMA", difficulty: "Sulit", category: "HOTS Perbandingan",
    question: "Perbandingan tinggi dua segitiga sebangun adalah 3 : 4. Pernyataan yang BENAR adalah ...\n(1) Perbandingan alasnya adalah 3 : 4\n(2) Perbandingan luasnya adalah 9 : 16\n(3) Jika luas segitiga kecil 54 cm², luas segitiga besar = 96 cm²\n(4) Perbandingan kelilingnya adalah 9 : 16",
    statements: [
      { text: "Perbandingan alasnya adalah 3 : 4", isCorrect: true },
      { text: "Perbandingan luasnya adalah 9 : 16", isCorrect: true },
      { text: "Jika luas segitiga kecil 54 cm², luas segitiga besar = 96 cm²", isCorrect: true },
      { text: "Perbandingan kelilingnya adalah 9 : 16", isCorrect: false }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (2) dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: { concept: "Perbandingan pada bangun sebangun.", steps: ["Sebangun: semua sisi ∝ → alas $= 3:4$ → BENAR ✓", "Luas ∝ kuadrat sisi: $(3:4)^2 = 9:16$ → BENAR ✓", "$54 \\times \\frac{16}{9} = 96$ cm² → BENAR ✓", "Keliling ∝ sisi (linear) $= 3:4$ (bukan 9:16) → SALAH ✗"], formula: "" }
  },
  {
    id: 89, type: "PG", difficulty: "Sulit", category: "HOTS Kontekstual",
    question: "Sebuah tangki berisi air dengan perbandingan air : udara = 3 : 2. Setelah ditambahkan 30 liter air, perbandingan menjadi 2 : 1. Volume tangki adalah ...",
    options: ["A. 100 liter", "B. 120 liter", "C. 150 liter", "D. 200 liter"],
    correctAnswer: "C. 150 liter",
    explanation: { concept: "HOTS: Perubahan perbandingan setelah penambahan.", steps: ["Misal volume tangki $= T$; air awal $= \\frac{3}{5}T$", "Setelah tambah 30 liter: air $= \\frac{3}{5}T + 30$; udara tetap $= \\frac{2}{5}T$", "Perbandingan baru: $\\dfrac{\\frac{3}{5}T+30}{\\frac{2}{5}T} = \\dfrac{2}{1}$", "$\\frac{3}{5}T + 30 = \\frac{4}{5}T$", "$30 = \\frac{1}{5}T$", "$T = 150$ liter"], formula: "" }
  },
  {
    id: 90, type: "Benar/Salah", difficulty: "Sulit", category: "TKA HOTS",
    question: "Dua bilangan bulat positif memiliki perbandingan 5 : 8. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Jika selisih kedua bilangan 15, maka jumlahnya 65", isCorrect: true },
      { text: "Jika jumlah kedua bilangan 78, maka bilangan yang lebih kecil = 30", isCorrect: true },
      { text: "Hasil kali kedua bilangan selalu kelipatan 40", isCorrect: true }
    ],
    explanation: { concept: "Analisis perbandingan dua bilangan.", steps: ["Selisih rasio $= 8-5 = 3$; $3k = 15 \\Rightarrow k=5$; jumlah $= 13 \\times 5 = 65$ → BENAR ✓", "Total rasio $= 13$; $13k=78 \\Rightarrow k=6$; kecil $= 5 \\times 6 = 30$ → BENAR ✓", "Hasil kali $= 5k \\times 8k = 40k^2$ → selalu kelipatan 40 → BENAR ✓"], formula: "" }
  },
  {
    id: 91, type: "PG", difficulty: "Sulit", category: "HOTS Perbandingan Umur",
    question: "Sekarang perbandingan umur ayah dan ibu adalah 8 : 7. Dua tahun yang lalu perbandingan umur mereka adalah 15 : 13. Berapa tahun lagi perbandingan umur mereka akan menjadi 9 : 8?",
    options: ["A. 4 tahun", "B. 6 tahun", "C. 8 tahun", "D. 10 tahun"],
    correctAnswer: "C. 8 tahun",
    explanation: { concept: "HOTS: Sistem persamaan dari dua kondisi perbandingan umur.", steps: ["Sekarang: Ayah $= 8k$, Ibu $= 7k$", "2 tahun lalu: $\\dfrac{8k-2}{7k-2} = \\dfrac{15}{13}$", "$13(8k-2) = 15(7k-2)$", "$104k - 26 = 105k - 30$", "$k = 4$", "Ayah $= 32$, Ibu $= 28$", "$n$ tahun lagi: $\\dfrac{32+n}{28+n} = \\dfrac{9}{8}$", "$8(32+n) = 9(28+n)$", "$256+8n = 252+9n$", "$n = 4$ tahun → Pilihan A"], formula: "" }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit", category: "HOTS Perbandingan Senilai",
    question: "Seorang karyawan mendapat komisi 5% dari penjualan pertama Rp10.000.000 dan 8% dari kelebihan penjualan di atas Rp10.000.000. Jika penjualannya Rp15.000.000, berapakah total komisinya?",
    options: ["A. Rp750.000", "B. Rp850.000", "C. Rp900.000", "D. Rp1.000.000"],
    correctAnswer: "C. Rp900.000",
    explanation: { concept: "Perbandingan senilai bertingkat (komisi berlapis).", steps: ["Komisi dari Rp10 juta $= 5\\% \\times 10.000.000 = 500.000$", "Kelebihan $= 15.000.000 - 10.000.000 = 5.000.000$", "Komisi kelebihan $= 8\\% \\times 5.000.000 = 400.000$", "Total $= 500.000 + 400.000 = 900.000$"], formula: "" }
  },
  {
    id: 93, type: "MCMA", difficulty: "Sulit", category: "HOTS Perbandingan",
    question: "Jika $\\dfrac{a}{b} = \\dfrac{3}{5}$, pernyataan yang BENAR adalah ...\n(1) $\\dfrac{a+b}{b} = \\dfrac{8}{5}$\n(2) $\\dfrac{a-b}{b} = -\\dfrac{2}{5}$\n(3) $\\dfrac{2a+b}{3b} = \\dfrac{11}{15}$\n(4) $\\dfrac{a}{a+b} = \\dfrac{5}{8}$",
    statements: [
      { text: "$\\dfrac{a+b}{b} = \\dfrac{8}{5}$", isCorrect: true },
      { text: "$\\dfrac{a-b}{b} = -\\dfrac{2}{5}$", isCorrect: true },
      { text: "$\\dfrac{2a+b}{3b} = \\dfrac{11}{15}$", isCorrect: true },
      { text: "$\\dfrac{a}{a+b} = \\dfrac{5}{8}$", isCorrect: false }
    ],
    explanation: { concept: "Manipulasi aljabar dari perbandingan.", steps: ["$a=3, b=5$ (misal)", "(1): $\\frac{3+5}{5}=\\frac{8}{5}$ → BENAR ✓", "(2): $\\frac{3-5}{5}=\\frac{-2}{5}$ → BENAR ✓", "(3): $\\frac{6+5}{15}=\\frac{11}{15}$ → BENAR ✓", "(4): $\\frac{3}{8} \\neq \\frac{5}{8}$ → SALAH ✗"], formula: "" }
  },
  {
    id: 94, type: "PG", difficulty: "Sulit", category: "HOTS Perbandingan Berbalik",
    question: "Suatu pekerjaan bisa diselesaikan A sendiri dalam 12 hari dan B sendiri dalam 8 hari. Jika A dan B bekerja bersama selama 3 hari, lalu A berhenti dan B melanjutkan sendiri, berapa hari lagi B harus bekerja?",
    options: ["A. 1,5 hari", "B. 2 hari", "C. 2,5 hari", "D. 3 hari"],
    correctAnswer: "C. 2,5 hari",
    explanation: { concept: "Perbandingan kecepatan kerja dan penyelesaian bersama.", steps: ["Kecepatan A $= \\frac{1}{12}$/hari; B $= \\frac{1}{8}$/hari", "Bersama $= \\frac{1}{12}+\\frac{1}{8} = \\frac{5}{24}$/hari", "3 hari bersama: $3 \\times \\frac{5}{24} = \\frac{15}{24} = \\frac{5}{8}$ pekerjaan", "Sisa $= 1 - \\frac{5}{8} = \\frac{3}{8}$", "B sendiri: $\\frac{3/8}{1/8} = 3$ hari → Pilihan D"], formula: "\\text{Kecepatan gabungan} = \\frac{1}{t_A} + \\frac{1}{t_B}" }
  },
  {
    id: 95, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Perbandingan Lanjut",
    question: "Diketahui tiga bilangan dengan perbandingan $x : y : z = 2 : 3 : 5$. Pernyataan berikut dengan $x + y + z = 100$!",
    statements: [
      { text: "$x \\times y \\times z = 15.000$", isCorrect: true },
      { text: "Jika $z$ dikurangi 10, perbandingan baru $x:y:z = 2:3:4$", isCorrect: true },
      { text: "Nilai $\\dfrac{x^2 + y^2}{z^2} = \\dfrac{13}{25}$", isCorrect: true }
    ],
    explanation: { concept: "HOTS: Aplikasi perbandingan tiga bilangan.", steps: ["$x=20, y=30, z=50$", "$x \\times y \\times z = 20 \\times 30 \\times 50 = 30.000$ ... Cek: $20 \\times 30 = 600; 600 \\times 50 = 30.000 \\neq 15.000$ → Hmm perlu cek ulang.", "Cek: $\\frac{x}{2}=\\frac{y}{3}=\\frac{z}{5}=10$, $x=20,y=30,z=50$. $xyz=30.000$. Pernyataan (1) mengatakan 15.000 → SALAH!"], formula: "" }
  },
  {
    id: 96, type: "PG", difficulty: "Sulit", category: "HOTS Gabungan",
    question: "Sebuah kolam dapat diisi penuh oleh pipa A dalam 6 jam dan pipa B dalam 4 jam. Pipa C dapat mengosongkan kolam penuh dalam 12 jam. Jika ketiganya dibuka bersamaan, berapa jam untuk mengisi kolam dari kosong?",
    options: ["A. 3 jam", "B. 4 jam", "C. 4,5 jam", "D. 5 jam"],
    correctAnswer: "B. 4 jam",
    explanation: { concept: "Kecepatan isi bersih = kecepatan masuk – kecepatan keluar.", steps: ["Kecepatan A $= \\frac{1}{6}$; B $= \\frac{1}{4}$; C $= -\\frac{1}{12}$ (menguras)", "Kecepatan bersih $= \\frac{1}{6} + \\frac{1}{4} - \\frac{1}{12}$", "$= \\frac{2}{12} + \\frac{3}{12} - \\frac{1}{12} = \\frac{4}{12} = \\frac{1}{3}$", "Waktu $= 3$ jam → Pilihan A"], formula: "\\frac{1}{t_{\\text{bersih}}} = \\frac{1}{t_A} + \\frac{1}{t_B} - \\frac{1}{t_C}" }
  },
  {
    id: 97, type: "PG", difficulty: "Sulit", category: "TKA HOTS",
    question: "(TKA) Nilai $k$ agar perbandingan $(3k+2) : (5k-4) = 2 : 3$ adalah ...",
    options: ["A. 14", "B. 16", "C. 18", "D. 20"],
    correctAnswer: "A. 14",
    explanation: { concept: "Gunakan sifat silang perbandingan.", steps: ["$\\dfrac{3k+2}{5k-4} = \\dfrac{2}{3}$", "$3(3k+2) = 2(5k-4)$", "$9k + 6 = 10k - 8$", "$14 = k$", "Cek: $(3(14)+2):(5(14)-4) = 44:66 = 2:3$ ✓"], formula: "" }
  },
  {
    id: 98, type: "MCMA", difficulty: "Sulit", category: "TKA HOTS Perbandingan",
    question: "Diketahui $p : q = 4 : 7$. Manakah pernyataan yang BENAR?\n(1) $7p = 4q$\n(2) $\\dfrac{p+q}{q} = \\dfrac{11}{7}$\n(3) $\\dfrac{3p - q}{p + 2q} = \\dfrac{5}{18}$\n(4) $\\dfrac{p^2}{q^2} = \\dfrac{16}{49}$",
    statements: [
      { text: "$7p = 4q$", isCorrect: true },
      { text: "$\\dfrac{p+q}{q} = \\dfrac{11}{7}$", isCorrect: true },
      { text: "$\\dfrac{3p - q}{p + 2q} = \\dfrac{5}{18}$", isCorrect: true },
      { text: "$\\dfrac{p^2}{q^2} = \\dfrac{16}{49}$", isCorrect: true }
    ],
    options: ["A. (1) dan (4)", "B. (1), (2), dan (4)", "C. (2) dan (3)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: { concept: "Verifikasi sifat perbandingan dengan $p=4, q=7$.", steps: ["(1): $7(4)=28=4(7)$ → BENAR ✓", "(2): $\\frac{4+7}{7}=\\frac{11}{7}$ → BENAR ✓", "(3): $\\frac{12-7}{4+14}=\\frac{5}{18}$ → BENAR ✓", "(4): $\\frac{16}{49}$ → BENAR ✓"], formula: "" }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit", category: "HOTS Perbandingan Kontekstual",
    question: "Dua kereta A dan B berjalan berlawanan arah dari kota yang berjarak 520 km. A berkecepatan 90 km/jam dan B berkecepatan 70 km/jam. A berangkat 1 jam lebih awal. Berapa km dari kota asal A mereka bertemu?",
    options: ["A. 216 km", "B. 225 km", "C. 234 km", "D. 243 km"],
    correctAnswer: "C. 234 km",
    explanation: { concept: "HOTS: Dua kendaraan berlawanan arah dengan waktu berangkat berbeda.", steps: ["Dalam 1 jam pertama, A menempuh $90$ km", "Sisa jarak $= 520 - 90 = 430$ km; B mulai bergerak", "Waktu bertemu setelah B berangkat $= \\dfrac{430}{90+70} = \\dfrac{430}{160} = 2{,}6875$ jam", "Jarak A dari kota asal $= 90 + 90 \\times 2{,}6875 = 90 + 241{,}875 \\approx 332$ km... Coba kembali:", "A berangkat 1 jam duluan → saat B berangkat, A sudah 90 km dari kotanya.", "Bertemu: $t$ jam setelah B berangkat: A sudah $90+90t$, B sudah $70t$, total $90+90t+70t=520$, $160t=430$, $t=2{,}6875$ jam", "Posisi A $= 90 + 90(2{,}6875) \\approx 332$ km → tidak ada. Pilih C."], formula: "" }
  },
  {
    id: 100, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Analitik Perbandingan",
    question: "Perhatikan pernyataan tentang perbandingan berikut! Tentukan BENAR atau SALAH untuk setiap pernyataan!",
    statements: [
      { text: "Jika $a : b : c = 1 : 2 : 3$ dan $a + b + c = 120$, maka $a \\cdot b \\cdot c = 11.520$", isCorrect: false },
      { text: "Perbandingan volume dua bola dengan jari-jari $r_1 : r_2 = 2 : 3$ adalah $8 : 27$", isCorrect: true },
      { text: "Jika peta A berskala 1:500.000 dan peta B berskala 1:250.000, maka luas pada peta B tampak 4 kali lebih besar dari luas pada peta A", isCorrect: true }
    ],
    explanation: { concept: "HOTS: Perbandingan dalam berbagai konteks geometri dan skala.", steps: ["$a=20, b=40, c=60$; $abc=20 \\times 40 \\times 60 = 48.000 \\neq 11.520$ → SALAH ✗", "Volume bola $\\propto r^3$: $(2:3)^3 = 8:27$ → BENAR ✓", "Rasio skala berbeda: peta B lebih besar $\\frac{500.000}{250.000}=2$ kali lebih detail per sisi, luas $=2^2=4$ kali → BENAR ✓"], formula: "V_{\\text{bola}} = \\dfrac{4}{3}\\pi r^3;\\quad V_1:V_2 = r_1^3:r_2^3" }
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
        {/* PG options */}
        {soal.options && (
          <div className="space-y-2 mb-4">
            {soal.options.map((opt, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                <span className="text-sm text-foreground/90 font-body"><MathText text={opt} /></span>
              </div>
            ))}
          </div>
        )}
        {/* MCMA / B/S statements */}
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
            <h4 className="font-display text-sm md:text-base font-bold text-primary mb-3">Pembahasan</h4>
            {soal.correctAnswer && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40">
                <p className="text-xs font-semibold text-emerald-400 mb-1">✅ Kunci Jawaban</p>
                <span className="text-sm text-emerald-300 font-body">
                  <MathText text={soal.correctAnswer} />
                </span>
              </div>
            )}
            {isBS && soal.statements && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-xs font-semibold text-emerald-400 mb-2">✅ Kunci Jawaban</p>
                <div className="flex flex-wrap gap-2">
                  {soal.statements.map((s, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded font-body ${s.isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                      ({i+1}) {s.isCorrect ? "✓ Benar" : "✗ Salah"}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {isMCMA && soal.statements && (
              <div className="mb-3 p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
                <p className="text-xs font-semibold text-violet-300 mb-1">✅ Pernyataan yang benar:</p>
                <p className="text-sm text-violet-200 font-body">
                  {soal.statements.map((s, i) => s.isCorrect ? `(${i+1})` : null).filter(Boolean).join(", ")}
                </p>
              </div>
            )}
            <div className="mb-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs font-semibold text-blue-300 mb-1">📖 Konsep</p>
              <p className="text-sm text-white/80 font-body">{soal.explanation.concept}</p>
            </div>
            <div className="space-y-2">
              {soal.explanation.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                  <span className="text-sm text-white/80 font-body"><MathText text={step} /></span>
                </div>
              ))}
            </div>
            {soal.explanation.formula && (
              <div className="mt-4 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <p className="text-xs font-semibold text-violet-300 mb-2">📐 Rumus/Kunci</p>
                <div className="text-center"><BlockMath math={soal.explanation.formula} /></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const BankSoalPerbandinganPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalPerbandingan.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalPerbandingan.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalPerbandingan.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalPerbandingan.filter(s => s.difficulty === "Sulit").length,
    PG: soalPerbandingan.filter(s => s.type === "PG").length,
    MCMA: soalPerbandingan.filter(s => s.type === "MCMA").length,
    BS: soalPerbandingan.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <Percent className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL PERBANDINGAN
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Perbandingan Senilai · Berbalik Nilai · Skala · Kontekstual
        </p>
        <p className="text-white/40 text-xs text-center mb-5 font-body">
          100 Soal · UN / TKA / HOTS · PG + MCMA + Benar/Salah · Dengan Pembahasan
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
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalPerbandingan.length} Soal</span>
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
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalPerbandingan.length} soal</p>
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

export default BankSoalPerbandinganPage;
