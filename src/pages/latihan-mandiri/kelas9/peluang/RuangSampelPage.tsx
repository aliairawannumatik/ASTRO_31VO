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
      <text key={`t${i}`} x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill="var(--icon-color)" fontSize={10} fontWeight="bold">{s.label}</text>
    );
    currentAngle = end;
  });
  return (
    <svg viewBox="0 0 160 160" className="w-32 h-32 mx-auto">
      {paths}
      <circle cx={cx} cy={cy} r={5} fill="var(--icon-color)" />
    </svg>
  );
};

type PGOpt = { key: string; text: string; math?: boolean };
type PGQ = { n: number; content: string; options: PGOpt[]; diagram?: React.ReactNode };
const OutfitDiagram = () => (
  <div className="bg-slate-800/70 border border-cyan-500/30 rounded-xl p-4 mb-2">
    <p className="text-[11px] font-bold text-center text-cyan-300 mb-4 tracking-wide">🎽 Ilustrasi Pilihan Busana Reza</p>
    <div className="flex flex-col gap-4">
      {/* Kaos */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1 bg-red-400/30" />
          <span className="text-[10px] text-red-300 font-bold tracking-widest">👕 3 KAOS</span>
          <div className="h-px flex-1 bg-red-400/30" />
        </div>
        <div className="flex justify-center gap-3">
          {[
            { label: "K₁", warna: "Merah", bg: "bg-red-500/20", border: "border-red-400/50", dot: "#ef4444" },
            { label: "K₂", warna: "Biru",  bg: "bg-blue-500/20", border: "border-blue-400/50", dot: "#3b82f6" },
            { label: "K₃", warna: "Hijau", bg: "bg-green-500/20", border: "border-green-400/50", dot: "#22c55e" },
          ].map(item => (
            <div key={item.label} className={`flex flex-col items-center gap-1.5 rounded-xl px-3 py-2 border ${item.bg} ${item.border}`}>
              <svg viewBox="0 0 40 38" width="42" height="40">
                <path d="M14,2 L6,10 L2,8 L2,18 L10,18 L10,36 L30,36 L30,18 L38,18 L38,8 L34,10 L26,2 Q20,6 14,2 Z"
                  fill={item.dot} stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinejoin="round"/>
                <path d="M14,2 Q20,6 26,2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
              </svg>
              <span className="text-[10px] font-bold text-white/80">{item.label}</span>
              <span className="text-[9px] text-white/40">{item.warna}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Celana */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1 bg-blue-400/30" />
          <span className="text-[10px] text-blue-300 font-bold tracking-widest">👖 4 CELANA</span>
          <div className="h-px flex-1 bg-blue-400/30" />
        </div>
        <div className="flex justify-center gap-2">
          {[
            { label: "C₁", warna: "Hitam",  color: "#1e293b", border: "#475569" },
            { label: "C₂", warna: "Abu",    color: "#64748b", border: "#94a3b8" },
            { label: "C₃", warna: "Coklat", color: "#92400e", border: "#d97706" },
            { label: "C₄", warna: "Navy",   color: "#1e3a5f", border: "#3b82f6" },
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-2 bg-white/5 border border-white/10">
              <svg viewBox="0 0 36 40" width="36" height="40">
                <rect x="2" y="2" width="32" height="12" rx="2" fill={item.color} stroke={item.border} strokeWidth="1.2"/>
                <rect x="2" y="13" width="14" height="25" rx="2" fill={item.color} stroke={item.border} strokeWidth="1.2"/>
                <rect x="20" y="13" width="14" height="25" rx="2" fill={item.color} stroke={item.border} strokeWidth="1.2"/>
                <line x1="18" y1="13" x2="18" y2="38" stroke={item.border} strokeWidth="1" strokeDasharray="2,2"/>
              </svg>
              <span className="text-[10px] font-bold text-white/80">{item.label}</span>
              <span className="text-[9px] text-white/40">{item.warna}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Sepatu */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1 bg-purple-400/30" />
          <span className="text-[10px] text-purple-300 font-bold tracking-widest">👟 2 PASANG SEPATU</span>
          <div className="h-px flex-1 bg-purple-400/30" />
        </div>
        <div className="flex justify-center gap-6">
          {[
            { label: "S₁", warna: "Kets Putih", color: "#e2e8f0", stroke: "#94a3b8", heel: "rgba(148,163,184,0.4)", stripe: "rgba(100,116,139,0.6)" },
            { label: "S₂", warna: "Sepatu Hitam", color: "#1e293b", stroke: "#475569", heel: "rgba(71,85,105,0.5)", stripe: "rgba(148,163,184,0.3)" },
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center gap-1.5 rounded-xl px-4 py-2 bg-purple-500/10 border border-purple-400/30">
              <svg viewBox="0 0 74 50" width="74" height="50">
                {/* Outsole — dark rubber, full width, rounded toe & heel */}
                <path d="M8,44 Q8,49 15,49 L62,49 Q70,49 70,44 L70,40 L8,40 Z"
                  fill="#0f172a" stroke="#334155" strokeWidth="0.8"/>
                {/* Midsole — lighter cushion strip */}
                <rect x="8" y="35" width="62" height="7" rx="3"
                  fill="#1e293b" stroke="#475569" strokeWidth="0.8"/>
                {/* Upper body — heel right (tall), toe left (rounded & lower) */}
                <path d="M10,35 L10,21 Q10,12 21,11 L46,11 Q58,11 65,17 L70,26 L70,35 Z"
                  fill={item.color} stroke={item.stroke} strokeWidth="1.3" strokeLinejoin="round"/>
                {/* Toe cap highlight */}
                <path d="M10,21 Q10,12 21,11 L27,11 Q19,14 15,21 L10,23 Z"
                  fill="rgba(255,255,255,0.18)"/>
                {/* Collar — opening where foot goes in */}
                <path d="M10,23 Q18,8 36,8 L36,13 Q24,13 15,26 Z"
                  fill="rgba(0,0,0,0.22)"/>
                {/* Tongue */}
                <path d="M36,8 L36,26 Q40,28 44,26 L44,8 Q40,6 36,8 Z"
                  fill={item.color} stroke={item.stroke} strokeWidth="0.8"/>
                {/* Laces on tongue */}
                <line x1="38" y1="12" x2="42" y2="12" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2"/>
                <line x1="38" y1="15.5" x2="42" y2="15.5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2"/>
                <line x1="38" y1="19" x2="42" y2="19" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2"/>
                {/* Heel counter */}
                <path d="M61,35 L61,20 Q66,15 70,21 L70,35 Z"
                  fill={item.heel}/>
                {/* Side stripe */}
                <path d="M24,15 Q44,11 63,19" fill="none" stroke={item.stripe} strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span className="text-[10px] font-bold text-white/80">{item.label}</span>
              <span className="text-[9px] text-white/40">{item.warna}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-cyan-500/20 pt-3 text-center">
        <p className="text-[10px] text-cyan-400/70 font-body">Gunakan <span className="text-cyan-300 font-bold">kaidah perkalian</span>: 3 × 4 × 2 = ?</p>
      </div>
    </div>
  </div>
);

const pgQuestions: PGQ[] = [
  /* ── 1 ── */
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
  /* ── 2 (was 6) ── */
  {
    n: 2,
    content: "Banyaknya titik sampel pada percobaan melempar 2 buah dadu secara bersamaan adalah ....",
    options: [
      { key: "A", text: "12" },
      { key: "B", text: "18" },
      { key: "C", text: "36" },
      { key: "D", text: "48" },
    ],
  },
  /* ── 3 (was 7) ── */
  {
    n: 3,
    content: "Tiga keping uang logam dilempar bersama-sama. Banyaknya kejadian muncul tepat dua sisi Angka adalah ....",
    options: [
      { key: "A", text: "2" },
      { key: "B", text: "3" },
      { key: "C", text: "4" },
      { key: "D", text: "5" },
    ],
  },
  /* ── 4 (was 8) ── */
  {
    n: 4,
    content: "Dua keping uang logam dan sebuah dadu dilempar secara bersamaan. Banyaknya titik sampel percobaan ini adalah ....",
    options: [
      { key: "A", text: "12" },
      { key: "B", text: "18" },
      { key: "C", text: "24" },
      { key: "D", text: "36" },
    ],
  },
  /* ── 5 (was 12) ── */
  {
    n: 5,
    content: "Dua keping uang logam dilempar bersamaan. Kejadian muncul tepat satu sisi Angka adalah ....",
    options: [
      { key: "A", text: "\\{(A, A)\\}", math: true },
      { key: "B", text: "\\{(G, G)\\}", math: true },
      { key: "C", text: "\\{(A, G),\\ (G, A)\\}", math: true },
      { key: "D", text: "\\{(G, G),\\ (A, G),\\ (G, A)\\}", math: true },
    ],
  },
  /* ── 6 (was 13) ── */
  {
    n: 6,
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
  /* ── 7 (was 14) ── */
  {
    n: 7,
    content: "Dari kota A ke kota B tersedia 3 jalur berbeda, dan dari kota B ke kota C tersedia 4 jalur berbeda. Banyaknya rute yang dapat ditempuh dari kota A ke kota C melalui kota B adalah ....",
    diagram: (
      <svg viewBox="0 0 340 210" className="w-full max-w-sm mx-auto">
        <path d="M 62,83 Q 115,30 148,83"  fill="none" stroke="#22d3ee" strokeWidth="2"   strokeDasharray="5,3"/>
        <path d="M 62,90 L 148,90"          fill="none" stroke="#06b6d4" strokeWidth="2"   strokeDasharray="5,3"/>
        <path d="M 62,97 Q 115,152 148,97"  fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5,3"/>
        <path d="M 192,82 Q 247,22  278,82" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,3"/>
        <path d="M 192,87 Q 247,60  278,87" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="5,3"/>
        <path d="M 192,93 Q 247,120 278,93" fill="none" stroke="#d946ef" strokeWidth="2" strokeDasharray="5,3"/>
        <path d="M 192,98 Q 247,158 278,98" fill="none" stroke="#e879f9" strokeWidth="2" strokeDasharray="5,3"/>
        <circle cx="40" cy="90" r="22" fill="#0f2a3a" stroke="#22d3ee" strokeWidth="2.5"/>
        <text x="40" y="95" textAnchor="middle" fill="#22d3ee" fontSize="16" fontWeight="bold">A</text>
        <circle cx="170" cy="90" r="22" fill="#1a0f3a" stroke="#a855f7" strokeWidth="2.5"/>
        <text x="170" y="95" textAnchor="middle" fill="#c084fc" fontSize="16" fontWeight="bold">B</text>
        <circle cx="300" cy="90" r="22" fill="#2a0f1a" stroke="#e879f9" strokeWidth="2.5"/>
        <text x="300" y="95" textAnchor="middle" fill="#e879f9" fontSize="16" fontWeight="bold">C</text>
        <polygon points="148,90 138,86 138,94" fill="#06b6d4"/>
        <polygon points="278,90 268,86 268,94" fill="#c084fc"/>
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
  /* ── 8 (was 2) ── */
  {
    n: 8,
    content: "Dua buah dadu dilempar bersamaan. Himpunan kejadian jumlah mata kedua dadu adalah 7 merupakan ....",
    options: [
      { key: "A", text: "\\{(1,6),\\ (6,1),\\ (2,5),\\ (5,2)\\}", math: true },
      { key: "B", text: "\\{(1,6),\\ (2,5),\\ (3,4)\\}", math: true },
      { key: "C", text: "\\{(1,6),\\ (6,1),\\ (2,5),\\ (5,2),\\ (3,4),\\ (4,3)\\}", math: true },
      { key: "D", text: "\\{(1,6),\\ (6,1),\\ (2,5),\\ (5,2),\\ (3,4)\\}", math: true },
    ],
  },
  /* ── 9 (was 9) ── */
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
  /* ── 10 (NEW) ── */
  {
    n: 10,
    content: "Dua buah dadu dilempar bersama-sama. Banyaknya kejadian muncul jumlah mata dadu lebih dari 3 dan kurang dari 7 adalah ....",
    diagram: (
      <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-3 mb-1">
        <p className="text-[10px] text-cyan-300 font-bold mb-2 text-center">🎲 Jumlah yang memenuhi: lebih dari 3 DAN kurang dari 7</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {[
            { sum: 4, pairs: ["(1,3)","(2,2)","(3,1)"], color: "bg-cyan-500/15 border-cyan-400/40 text-cyan-200" },
            { sum: 5, pairs: ["(1,4)","(2,3)","(3,2)","(4,1)"], color: "bg-blue-500/15 border-blue-400/40 text-blue-200" },
            { sum: 6, pairs: ["(1,5)","(2,4)","(3,3)","(4,2)","(5,1)"], color: "bg-indigo-500/15 border-indigo-400/40 text-indigo-200" },
          ].map(row => (
            <div key={row.sum} className={`rounded-lg border px-3 py-2 ${row.color}`}>
              <p className="text-[10px] font-bold mb-1 text-center">Jumlah = {row.sum}</p>
              <div className="flex gap-1 flex-wrap justify-center">
                {row.pairs.map(p => (
                  <span key={p} className="text-[9px] bg-white/10 rounded px-1 py-0.5">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    options: [
      { key: "A", text: "8" },
      { key: "B", text: "10" },
      { key: "C", text: "12" },
      { key: "D", text: "14" },
    ],
  },
  /* ── 11 (was 3) ── */
  {
    n: 11,
    content: "Sebuah kantong berisi kartu bernomor 1, 2, 3, 4 dan kartu berhuruf A, B, C. Jika diambil satu kartu secara acak, banyaknya titik sampelnya adalah ....",
    options: [
      { key: "A", text: "5" },
      { key: "B", text: "6" },
      { key: "C", text: "7" },
      { key: "D", text: "8" },
    ],
  },
  /* ── 12 (was 4) ── */
  {
    n: 12,
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
  /* ── 13 (was 5, + ilustrasi busana) ── */
  {
    n: 13,
    content: "Reza mempunyai 3 kaos, 4 celana, dan 2 pasang sepatu. Banyaknya cara Reza dapat memilih busana yang akan dikenakan adalah ....",
    diagram: <OutfitDiagram />,
    options: [
      { key: "A", text: "9" },
      { key: "B", text: "12" },
      { key: "C", text: "18" },
      { key: "D", text: "24" },
    ],
  },
  /* ── 14 (was 10) ── */
  {
    n: 14,
    content: "Sebuah dadu dilempar satu kali. Banyaknya kemungkinan muncul mata dadu bukan angka 2 adalah ....",
    options: [
      { key: "A", text: "4" },
      { key: "B", text: "5" },
      { key: "C", text: "6" },
      { key: "D", text: "7" },
    ],
  },
  /* ── 15 (was 11) ── */
  {
    n: 15,
    content: "Pasangan suami istri berencana memiliki 3 orang anak. Banyaknya titik sampel dari jenis kelamin anak yang mungkin terjadi adalah ....",
    options: [
      { key: "A", text: "4" },
      { key: "B", text: "6" },
      { key: "C", text: "8" },
      { key: "D", text: "12" },
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
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Peluang · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 15 Soal</span>
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
