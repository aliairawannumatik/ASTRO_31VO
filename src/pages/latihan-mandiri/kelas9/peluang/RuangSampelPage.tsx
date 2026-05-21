import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Dices } from "lucide-react";

const accentColor = "cyan";
const accentHex = "#22d3ee";

const FreqTable = ({ headers, rows, caption }: { headers: string[]; rows: (string | number)[][]; caption?: string }) => (
  <div className="overflow-x-auto rounded-xl border border-cyan-500/30 my-2">
    {caption && <div className="text-[10px] text-cyan-300/70 font-bold text-center pt-2 px-2">{caption}</div>}
    <table className="min-w-full text-xs font-body">
      <thead>
        <tr className="bg-cyan-900/40">
          {headers.map((h, i) => (
            <th key={i} className="px-3 py-2 text-cyan-200 font-bold text-center border-b border-cyan-500/30">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? "bg-white/3" : "bg-cyan-900/10"}>
            {row.map((cell, ci) => (
              <td key={ci} className="px-3 py-2 text-center text-white/80 border-b border-white/5">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DiceGrid = ({ highlight }: { highlight?: (i: number, j: number) => boolean }) => (
  <div className="overflow-x-auto rounded-xl border border-cyan-500/30 my-2">
    <table className="text-[10px] font-body">
      <thead>
        <tr className="bg-cyan-900/50">
          <th className="px-2 py-1 text-cyan-300 border border-cyan-500/20 w-10">🎲₁\🎲₂</th>
          {[1,2,3,4,5,6].map(n => (
            <th key={n} className="px-2 py-1 text-cyan-300 border border-cyan-500/20 w-10">{n}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[1,2,3,4,5,6].map(i => (
          <tr key={i}>
            <td className="px-2 py-1 text-cyan-300 font-bold bg-cyan-900/40 border border-cyan-500/20 text-center">{i}</td>
            {[1,2,3,4,5,6].map(j => (
              <td key={j} className={`px-1 py-1 border border-cyan-500/10 text-center transition-colors ${highlight && highlight(i,j) ? 'bg-cyan-400/30 text-cyan-200 font-bold' : 'text-white/60'}`}>
                ({i},{j})
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TreeDiagram = ({ title, branches }: { title: string; branches: { label: string; children: string[] }[] }) => (
  <svg viewBox={`0 0 320 ${branches.reduce((s,b) => s + b.children.length * 30, 0) + 40}`} className="w-full max-w-xs mx-auto" style={{maxHeight:220}}>
    <text x="10" y="20" fill="#22d3ee" fontSize="11" fontWeight="bold">{title}</text>
    {(() => {
      const items: React.ReactNode[] = [];
      let y = 45;
      const startY = (branches.reduce((s,b) => s + b.children.length * 30, 0) + 40) / 2;
      let branchStart = 45;
      branches.forEach((b, bi) => {
        const mid = branchStart + (b.children.length * 30) / 2 - 10;
        items.push(
          <line key={`l${bi}`} x1={60} y1={startY} x2={110} y2={mid} stroke="#22d3ee" strokeWidth={1.5} opacity={0.7} />,
          <text key={`t${bi}`} x={115} y={mid+4} fill="#67e8f9" fontSize={10} fontWeight="bold">{b.label}</text>
        );
        b.children.forEach((c, ci) => {
          const cy = branchStart + ci * 30 + 10;
          items.push(
            <line key={`l${bi}${ci}`} x1={165} y1={mid} x2={195} y2={cy} stroke="#0e7490" strokeWidth={1} opacity={0.8} />,
            <text key={`t${bi}${ci}`} x={200} y={cy+4} fill="#e2e8f0" fontSize={9}>{c}</text>
          );
        });
        branchStart += b.children.length * 30;
      });
      items.push(<circle key="root" cx={60} cy={startY} r={5} fill="#22d3ee" />);
      return items;
    })()}
  </svg>
);

const SpinnerDiagram = ({ sectors }: { sectors: { label: string; color: string; angle: number }[] }) => {
  let currentAngle = 0;
  const cx = 80, cy = 80, r = 65;
  const paths: React.ReactNode[] = [];
  sectors.forEach((s, i) => {
    const start = currentAngle;
    const end = currentAngle + s.angle;
    const startRad = (start - 90) * Math.PI / 180;
    const endRad = (end - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = s.angle > 180 ? 1 : 0;
    const midRad = ((start + end) / 2 - 90) * Math.PI / 180;
    const tx = cx + (r * 0.62) * Math.cos(midRad);
    const ty = cy + (r * 0.62) * Math.sin(midRad);
    paths.push(
      <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`} fill={s.color} stroke="#0f172a" strokeWidth={2} />,
      <text key={`t${i}`} x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={10} fontWeight="bold">{s.label}</text>
    );
    currentAngle = end;
  });
  return (
    <svg viewBox="0 0 160 160" className="w-32 h-32 mx-auto">
      {paths}
      <circle cx={cx} cy={cy} r={5} fill="white" />
    </svg>
  );
};

type PGOpt = { key: string; text: string; math?: boolean };
type PGQ = { n: number; content: string; options: PGOpt[]; diagram?: React.ReactNode };
const pgQuestions: PGQ[] = [
  {
    n: 1,
    content: "Ruang sampel dari percobaan melempar 2 keping uang koin adalah ....",
    options: [
      { key: "A", text: "S = \\{(A, G)\\}", math: true },
      { key: "B", text: "S = \\{(A, A),\\ (G, G)\\}", math: true },
      { key: "C", text: "S = \\{(A, A),\\ (A, G),\\ (G, A),\\ (G, G)\\}", math: true },
      { key: "D", text: "S = \\{(A, G),\\ (G, A)\\}", math: true },
    ],
  },
  {
    n: 2,
    content: "Dua buah dadu dilempar bersamaan. Himpunan kejadian jumlah mata kedua dadu adalah 7 merupakan ....",
    options: [
      { key: "A", text: "\\{(1,6),\\ (6,1),\\ (2,5),\\ (5,2)\\}", math: true },
      { key: "B", text: "\\{(1,6),\\ (2,5),\\ (3,4)\\}", math: true },
      { key: "C", text: "\\{(1,6),\\ (6,1),\\ (2,5),\\ (5,2),\\ (3,4),\\ (4,3)\\}", math: true },
      { key: "D", text: "\\{(1,6),\\ (6,1),\\ (2,5),\\ (5,2),\\ (3,4)\\}", math: true },
    ],
  },
  {
    n: 3,
    content: "Sebuah kantong berisi kartu bernomor 1, 2, 3, 4 dan kartu berhuruf A, B, C. Jika diambil satu kartu secara acak, banyaknya titik sampelnya adalah ....",
    options: [
      { key: "A", text: "5" },
      { key: "B", text: "6" },
      { key: "C", text: "7" },
      { key: "D", text: "8" },
    ],
  },
  {
    n: 4,
    content: "Sebuah koin dan sebuah dadu dilempar bersama-sama. Banyaknya anggota ruang sampel percobaan tersebut adalah ....",
    diagram: (
      <FreqTable
        caption="Tabel ruang sampel: Dadu + Koin"
        headers={["Dadu", "Koin A", "Koin G"]}
        rows={[
          [1,"(1,A)","(1,G)"],
          [2,"(2,A)","(2,G)"],
          [3,"(3,A)","(3,G)"],
          [4,"(4,A)","(4,G)"],
          [5,"(5,A)","(5,G)"],
          [6,"(6,A)","(6,G)"],
        ]}
      />
    ),
    options: [
      { key: "A", text: "6" },
      { key: "B", text: "8" },
      { key: "C", text: "12" },
      { key: "D", text: "18" },
    ],
  },
  {
    n: 5,
    content: "Reza mempunyai 3 kaos, 4 celana, dan 2 pasang sepatu. Banyaknya cara Reza dapat memilih busana yang akan dikenakan adalah ....",
    options: [
      { key: "A", text: "9" },
      { key: "B", text: "12" },
      { key: "C", text: "18" },
      { key: "D", text: "24" },
    ],
  },
  {
    n: 6,
    content: "Banyaknya titik sampel pada percobaan melempar 2 buah dadu secara bersamaan adalah ....",
    options: [
      { key: "A", text: "12" },
      { key: "B", text: "18" },
      { key: "C", text: "36" },
      { key: "D", text: "48" },
    ],
  },
  {
    n: 7,
    content: "Tiga keping uang logam dilempar bersama-sama. Banyaknya kejadian muncul tepat dua sisi Angka adalah ....",
    options: [
      { key: "A", text: "2" },
      { key: "B", text: "3" },
      { key: "C", text: "4" },
      { key: "D", text: "5" },
    ],
  },
  {
    n: 8,
    content: "Dua keping uang logam dan sebuah dadu dilempar secara bersamaan. Banyaknya titik sampel percobaan ini adalah ....",
    options: [
      { key: "A", text: "12" },
      { key: "B", text: "18" },
      { key: "C", text: "24" },
      { key: "D", text: "36" },
    ],
  },
  {
    n: 9,
    content: "Dua buah dadu dilempar bersama-sama. Banyaknya kejadian muncul jumlah mata dadu 4 atau 8 adalah ....",
    options: [
      { key: "A", text: "6" },
      { key: "B", text: "8" },
      { key: "C", text: "10" },
      { key: "D", text: "12" },
    ],
  },
  {
    n: 10,
    content: "Sebuah dadu dilempar satu kali. Banyaknya kemungkinan muncul mata dadu bukan angka 2 adalah ....",
    options: [
      { key: "A", text: "4" },
      { key: "B", text: "5" },
      { key: "C", text: "6" },
      { key: "D", text: "7" },
    ],
  },
  {
    n: 11,
    content: "Pasangan suami istri berencana memiliki 3 orang anak. Banyaknya titik sampel dari jenis kelamin anak yang mungkin terjadi adalah ....",
    options: [
      { key: "A", text: "4" },
      { key: "B", text: "6" },
      { key: "C", text: "8" },
      { key: "D", text: "12" },
    ],
  },
  {
    n: 12,
    content: "Dua keping uang logam dilempar bersamaan. Kejadian muncul tepat satu sisi Angka adalah ....",
    options: [
      { key: "A", text: "\\{(A, A)\\}", math: true },
      { key: "B", text: "\\{(G, G)\\}", math: true },
      { key: "C", text: "\\{(A, G),\\ (G, A)\\}", math: true },
      { key: "D", text: "\\{(G, G),\\ (A, G),\\ (G, A)\\}", math: true },
    ],
  },
  {
    n: 13,
    content: "Tiga keping uang logam dilempar secara bersamaan. Banyaknya anggota ruang sampel dari percobaan tersebut adalah ....",
    diagram: (
      <TreeDiagram
        title="Percobaan 3 Koin"
        branches={[
          { label: "A-A", children: ["(A,A,A)", "(A,A,G)"] },
          { label: "A-G", children: ["(A,G,A)", "(A,G,G)"] },
          { label: "G-A", children: ["(G,A,A)", "(G,A,G)"] },
          { label: "G-G", children: ["(G,G,A)", "(G,G,G)"] },
        ]}
      />
    ),
    options: [
      { key: "A", text: "4" },
      { key: "B", text: "6" },
      { key: "C", text: "8" },
      { key: "D", text: "10" },
    ],
  },
  {
    n: 14,
    content: "Dari kota A ke kota B tersedia 3 jalur berbeda, dan dari kota B ke kota C tersedia 4 jalur berbeda. Banyaknya rute yang dapat ditempuh dari kota A ke kota C melalui kota B adalah ....",
    diagram: (
      <svg viewBox="0 0 340 210" className="w-full max-w-sm mx-auto">
        {/* A→B: 3 jalur */}
        <path d="M 62,83 Q 115,30 148,83"  fill="none" stroke="#22d3ee" strokeWidth="2"   strokeDasharray="5,3"/>
        <path d="M 62,90 L 148,90"          fill="none" stroke="#06b6d4" strokeWidth="2"   strokeDasharray="5,3"/>
        <path d="M 62,97 Q 115,152 148,97"  fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5,3"/>
        {/* B→C: 4 jalur */}
        <path d="M 192,82 Q 247,22  278,82" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,3"/>
        <path d="M 192,87 Q 247,60  278,87" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="5,3"/>
        <path d="M 192,93 Q 247,120 278,93" fill="none" stroke="#d946ef" strokeWidth="2" strokeDasharray="5,3"/>
        <path d="M 192,98 Q 247,158 278,98" fill="none" stroke="#e879f9" strokeWidth="2" strokeDasharray="5,3"/>
        {/* City A */}
        <circle cx="40" cy="90" r="22" fill="#0f2a3a" stroke="#22d3ee" strokeWidth="2.5"/>
        <text x="40" y="95" textAnchor="middle" fill="#22d3ee" fontSize="16" fontWeight="bold">A</text>
        {/* City B */}
        <circle cx="170" cy="90" r="22" fill="#1a0f3a" stroke="#a855f7" strokeWidth="2.5"/>
        <text x="170" y="95" textAnchor="middle" fill="#c084fc" fontSize="16" fontWeight="bold">B</text>
        {/* City C */}
        <circle cx="300" cy="90" r="22" fill="#2a0f1a" stroke="#e879f9" strokeWidth="2.5"/>
        <text x="300" y="95" textAnchor="middle" fill="#e879f9" fontSize="16" fontWeight="bold">C</text>
        {/* Arrowheads */}
        <polygon points="148,90 138,86 138,94" fill="#06b6d4"/>
        <polygon points="278,90 268,86 268,94" fill="#c084fc"/>
        {/* Legend */}
        <rect x="4" y="193" width="100" height="14" rx="5" fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="1"/>
        <text x="54" y="203" textAnchor="middle" fill="#67e8f9" fontSize="9" fontWeight="bold">A → B : 3 jalur</text>
        <rect x="116" y="193" width="110" height="14" rx="5" fill="rgba(168,85,247,0.08)" stroke="#a855f7" strokeWidth="1"/>
        <text x="171" y="203" textAnchor="middle" fill="#d8b4fe" fontSize="9" fontWeight="bold">B → C : 4 jalur</text>
      </svg>
    ),
    options: [
      { key: "A", text: "7" },
      { key: "B", text: "10" },
      { key: "C", text: "12" },
      { key: "D", text: "16" },
    ],
  },
];

const RuangSampelPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <Dices className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: `0 0 20px rgba(34,211,238,0.7)` }}>
            RUANG SAMPEL DAN TITIK SAMPEL
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Peluang · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 14 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-cyan-300 text-xs font-bold mb-2">📌 Ingat — Konsep Utama</p>
          <div className="grid grid-cols-3 gap-2 text-xs font-body">
            {[
              { name: "Ruang Sampel (S)", emoji: "🎯" },
              { name: "Titik Sampel", emoji: "🔵" },
              { name: "n(S) = Banyak Sampel", emoji: "🔢" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-2 py-2 text-center">
                <div className="text-lg mb-1">{r.emoji}</div>
                <span className="text-white/60 text-[10px]">{r.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── PILIHAN GANDA ── */}
        <div className="mb-5 mt-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-cyan-500/20" />
            <span className="text-cyan-300 text-xs font-bold uppercase tracking-widest px-2">A. Pilihan Ganda</span>
            <div className="h-px flex-1 bg-cyan-500/20" />
          </div>
          <p className="text-white/40 text-[11px] font-body mb-4 text-center">Pilihlah satu jawaban yang paling tepat.</p>
          <div className="flex flex-col gap-3">
            {pgQuestions.map((q, i) => (
              <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 0.02}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
                <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-teal-500 rounded-l-2xl" />
                <div className="relative px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                      <span className="text-cyan-300 text-xs font-bold">{q.n}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>
                      {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                      <div className="grid grid-cols-1 gap-1.5">
                        {q.options.map(opt => (
                          <div key={opt.key} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-cyan-300 text-xs font-bold shrink-0 min-w-[18px]">{opt.key}.</span>
                            {opt.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={opt.text} /></div>
                              : <span className="font-body text-sm text-white/80">{opt.text}</span>
                            }
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/peluang"); }}
            className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Peluang
          </button>
        </div>
      </div>
    </div>
  );
};

export default RuangSampelPage;
