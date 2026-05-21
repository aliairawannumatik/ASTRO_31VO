import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
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

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" | "diagram-only" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

type PGOpt = { key: string; text: string; math?: boolean };
type PGQ = { n: number; content: string; options: PGOpt[] };
const pgQuestions: PGQ[] = [
  {
    n: 1,
    content: "Ruang sampel dari percobaan melempar 2 keping uang koin adalah ....",
    options: [
      { key: "a", text: "S = \\{(A, G)\\}", math: true },
      { key: "b", text: "S = \\{(A, A),\\ (G, G)\\}", math: true },
      { key: "c", text: "S = \\{(A, A),\\ (A, G),\\ (G, A),\\ (G, G)\\}", math: true },
      { key: "d", text: "S = \\{(A, G),\\ (G, A)\\}", math: true },
    ],
  },
  {
    n: 2,
    content: "Dua buah dadu dilempar bersamaan. Himpunan kejadian jumlah mata kedua dadu adalah 7 merupakan ....",
    options: [
      { key: "a", text: "\\{(1,6),\\ (6,1),\\ (2,5),\\ (5,2)\\}", math: true },
      { key: "b", text: "\\{(1,6),\\ (2,5),\\ (3,4)\\}", math: true },
      { key: "c", text: "\\{(1,6),\\ (6,1),\\ (2,5),\\ (5,2),\\ (3,4),\\ (4,3)\\}", math: true },
      { key: "d", text: "\\{(1,6),\\ (6,1),\\ (2,5),\\ (5,2),\\ (3,4)\\}", math: true },
    ],
  },
  {
    n: 3,
    content: "Sebuah kantong berisi kartu bernomor 1, 2, 3, 4 dan kartu berhuruf A, B, C. Jika diambil satu kartu secara acak, banyaknya titik sampelnya adalah ....",
    options: [
      { key: "a", text: "5" },
      { key: "b", text: "6" },
      { key: "c", text: "7" },
      { key: "d", text: "8" },
    ],
  },
  {
    n: 4,
    content: "Sebuah koin dan sebuah dadu dilempar bersama-sama. Banyaknya anggota ruang sampel percobaan tersebut adalah ....",
    options: [
      { key: "a", text: "6" },
      { key: "b", text: "8" },
      { key: "c", text: "12" },
      { key: "d", text: "18" },
    ],
  },
  {
    n: 5,
    content: "Reza mempunyai 3 kaos, 4 celana, dan 2 pasang sepatu. Banyaknya cara Reza dapat memilih busana yang akan dikenakan adalah ....",
    options: [
      { key: "a", text: "9" },
      { key: "b", text: "12" },
      { key: "c", text: "18" },
      { key: "d", text: "24" },
    ],
  },
  {
    n: 6,
    content: "Banyaknya titik sampel pada percobaan melempar 2 buah dadu secara bersamaan adalah ....",
    options: [
      { key: "a", text: "12" },
      { key: "b", text: "18" },
      { key: "c", text: "36" },
      { key: "d", text: "48" },
    ],
  },
  {
    n: 7,
    content: "Tiga keping uang logam dilempar bersama-sama. Banyaknya kejadian muncul tepat dua sisi Angka adalah ....",
    options: [
      { key: "a", text: "2" },
      { key: "b", text: "3" },
      { key: "c", text: "4" },
      { key: "d", text: "5" },
    ],
  },
  {
    n: 8,
    content: "Dua keping uang logam dan sebuah dadu dilempar secara bersamaan. Banyaknya titik sampel percobaan ini adalah ....",
    options: [
      { key: "a", text: "12" },
      { key: "b", text: "18" },
      { key: "c", text: "24" },
      { key: "d", text: "36" },
    ],
  },
  {
    n: 9,
    content: "Dua buah dadu dilempar bersama-sama. Banyaknya kejadian muncul jumlah mata dadu 4 atau 8 adalah ....",
    options: [
      { key: "a", text: "6" },
      { key: "b", text: "8" },
      { key: "c", text: "10" },
      { key: "d", text: "12" },
    ],
  },
  {
    n: 10,
    content: "Sebuah dadu dilempar satu kali. Banyaknya kemungkinan muncul mata dadu bukan angka 2 adalah ....",
    options: [
      { key: "a", text: "4" },
      { key: "b", text: "5" },
      { key: "c", text: "6" },
      { key: "d", text: "7" },
    ],
  },
  {
    n: 11,
    content: "Pasangan suami istri berencana memiliki 3 orang anak. Banyaknya titik sampel dari jenis kelamin anak yang mungkin terjadi adalah ....",
    options: [
      { key: "a", text: "4" },
      { key: "b", text: "6" },
      { key: "c", text: "8" },
      { key: "d", text: "12" },
    ],
  },
  {
    n: 12,
    content: "Dua keping uang logam dilempar bersamaan. Kejadian muncul tepat satu sisi Angka adalah ....",
    options: [
      { key: "a", text: "\\{(A, A)\\}", math: true },
      { key: "b", text: "\\{(G, G)\\}", math: true },
      { key: "c", text: "\\{(A, G),\\ (G, A)\\}", math: true },
      { key: "d", text: "\\{(G, G),\\ (A, G),\\ (G, A)\\}", math: true },
    ],
  },
];

const questions: Q[] = [
  Qn(1, "Ruang Sampel Koin Tunggal", {
    type: "mixed",
    content: "Sebuah koin dilempar satu kali. Sisi koin adalah Angka (A) dan Gambar (G).",
    parts: [
      { label: "a.", text: "Tuliskan ruang sampel S dari percobaan tersebut." },
      { label: "b.", text: "Berapa banyak titik sampel n(S)?" },
      { label: "c.", text: "Apa yang dimaksud dengan titik sampel? Sebutkan contohnya." },
    ],
  }),
  Qn(2, "Ruang Sampel Dadu Tunggal", {
    type: "mixed",
    content: "Sebuah dadu bersisi enam dilempar satu kali.",
    parts: [
      { label: "a.", text: "Tuliskan ruang sampel S dari percobaan tersebut." },
      { label: "b.", text: "Berapa nilai n(S)?" },
      { label: "c.", text: "Sebutkan titik sampel yang merupakan bilangan prima." },
      { label: "d.", text: "Sebutkan titik sampel yang merupakan bilangan ganjil." },
    ],
  }),
  Qn(3, "Ruang Sampel Dua Koin", {
    type: "mixed",
    diagram: (
      <TreeDiagram
        title="Percobaan 2 Koin"
        branches={[
          { label: "A", children: ["(A,A)", "(A,G)"] },
          { label: "G", children: ["(G,A)", "(G,G)"] },
        ]}
      />
    ),
    content: "Dua koin dilempar bersamaan. Gunakan diagram pohon di atas.",
    parts: [
      { label: "a.", text: "Tuliskan semua anggota ruang sampel S." },
      { label: "b.", text: "Tentukan n(S)." },
      { label: "c.", text: "Sebutkan titik sampel yang menghasilkan tepat satu sisi Angka." },
    ],
  }),
  Qn(4, "Tabel Ruang Sampel Dua Dadu", {
    type: "mixed",
    diagram: <DiceGrid />,
    content: "Dua buah dadu dilempar bersamaan. Perhatikan tabel ruang sampel di atas.",
    parts: [
      { label: "a.", text: "Tentukan n(S)." },
      { label: "b.", text: "Berapa banyak titik sampel dengan jumlah kedua dadu sama dengan 7?" },
      { label: "c.", text: "Berapa banyak titik sampel dengan kedua dadu menunjukkan angka yang sama?" },
    ],
  }),
  Qn(5, "Dua Dadu – Selisih Tertentu", {
    type: "mixed",
    diagram: <DiceGrid highlight={(i,j) => Math.abs(i-j) === 2} />,
    content: "Dua dadu dilempar. Sel diarsir menunjukkan titik sampel dengan selisih = 2.",
    parts: [
      { label: "a.", text: "Sebutkan semua titik sampel dengan selisih kedua dadu = 2." },
      { label: "b.", text: "Berapa banyak titik sampel tersebut?" },
      { label: "c.", text: "Berapa banyak titik sampel dengan selisih = 0 (angka sama)?" },
    ],
  }),
  Qn(6, "Dua Dadu – Hasil Kali Tertentu", {
    type: "mixed",
    diagram: <DiceGrid highlight={(i,j) => i*j === 12} />,
    content: "Dua dadu dilempar. Sel diarsir menunjukkan titik sampel dengan hasil kali = 12.",
    parts: [
      { label: "a.", text: "Sebutkan semua titik sampel dengan hasil kali kedua dadu = 12." },
      { label: "b.", text: "Berapa banyak titik sampel tersebut?" },
      { label: "c.", text: "Berapa banyak titik sampel dengan hasil kali ≤ 6?" },
    ],
  }),
  Qn(7, "Kartu dari 1 sampai 10", {
    type: "mixed",
    content: "Sebuah kotak berisi kartu bernomor 1 sampai 10. Satu kartu diambil secara acak.",
    parts: [
      { label: "a.", text: "Tuliskan ruang sampel S." },
      { label: "b.", text: "Tentukan n(S)." },
      { label: "c.", text: "Sebutkan titik sampel yang merupakan bilangan prima." },
      { label: "d.", text: "Sebutkan titik sampel yang merupakan kelipatan 3." },
    ],
  }),
  Qn(8, "Tiga Koin – Diagram Pohon", {
    type: "mixed",
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
    content: "Tiga koin dilempar bersamaan.",
    parts: [
      { label: "a.", text: "Tentukan n(S) dari diagram pohon di atas." },
      { label: "b.", text: "Sebutkan titik sampel dengan tepat dua sisi Angka." },
      { label: "c.", text: "Berapa banyak titik sampel dengan paling sedikit satu Gambar?" },
    ],
  }),
  Qn(9, "Kartu Remi – Ruang Sampel", {
    type: "mixed",
    content: "Satu set kartu remi terdiri dari 52 kartu: 4 jenis (♠ ♥ ♦ ♣), masing-masing 13 nilai (A,2,3,...,10,J,Q,K). Satu kartu diambil.",
    parts: [
      { label: "a.", text: "Tentukan n(S)." },
      { label: "b.", text: "Berapa banyak titik sampel kartu berwarna merah (♥ dan ♦)?" },
      { label: "c.", text: "Berapa banyak titik sampel kartu gambar (J, Q, K)?" },
      { label: "d.", text: "Berapa banyak titik sampel kartu As (A)?" },
    ],
  }),
  Qn(10, "Percobaan Koin Tidak Seimbang – Ruang Sampel", {
    type: "mixed",
    content: "Sebuah koin dilempar tiga kali secara berurutan. Catat urutan Angka (A) dan Gambar (G).",
    parts: [
      { label: "a.", math: "n(S) = 2^3 = \\ldots" },
      { label: "b.", text: "Tuliskan semua 8 anggota ruang sampel." },
      { label: "c.", text: "Sebutkan titik sampel dengan jumlah Angka lebih banyak dari Gambar." },
    ],
  }),
  Qn(11, "Diagram Pohon – Koin dan Dadu", {
    type: "mixed",
    diagram: (
      <TreeDiagram
        title="Koin + Dadu"
        branches={[
          { label: "A", children: ["(A,1)", "(A,2)", "(A,3)", "(A,4)", "(A,5)", "(A,6)"] },
          { label: "G", children: ["(G,1)", "(G,2)", "(G,3)", "(G,4)", "(G,5)", "(G,6)"] },
        ]}
      />
    ),
    content: "Sebuah koin dan sebuah dadu dilempar bersamaan.",
    parts: [
      { label: "a.", text: "Tentukan n(S) dari percobaan ini." },
      { label: "b.", text: "Sebutkan titik sampel dengan sisi Gambar dan angka genap pada dadu." },
      { label: "c.", text: "Berapa banyak titik sampel yang memuat sisi Angka?" },
    ],
  }),
  Qn(12, "Tabel – Dadu dan Koin", {
    type: "mixed",
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
    content: "Sebuah dadu dan sebuah koin dilempar bersama.",
    parts: [
      { label: "a.", text: "Berapa n(S) berdasarkan tabel?" },
      { label: "b.", text: "Sebutkan titik sampel dengan dadu genap dan koin Angka." },
      { label: "c.", text: "Sebutkan titik sampel dengan dadu prima dan koin Gambar." },
    ],
  }),
  Qn(13, "Aturan Perkalian – Menghitung n(S)", {
    type: "mixed",
    content: "Sebuah restoran menyediakan 3 pilihan makanan utama, 2 pilihan minuman, dan 4 pilihan dessert. Seorang pelanggan memilih satu dari setiap kategori.",
    parts: [
      { label: "a.", math: "n(S) = 3 \\times 2 \\times 4 = \\ldots" },
      { label: "b.", text: "Apakah semua kombinasi merupakan titik sampel yang valid? Mengapa?" },
      { label: "c.", text: "Jika 1 menu dessert habis, berapa n(S) yang baru?" },
    ],
  }),
  Qn(14, "Pengambilan Tanpa Pengembalian", {
    type: "mixed",
    content: "Kotak berisi 3 bola: Merah (M), Biru (B), Hijau (H). Dua bola diambil satu per satu tanpa pengembalian.",
    diagram: (
      <FreqTable
        caption="Ruang sampel (tanpa pengembalian)"
        headers={["Ambil ke-1", "Ambil ke-2", "Titik Sampel"]}
        rows={[
          ["M","B","(M,B)"],["M","H","(M,H)"],
          ["B","M","(B,M)"],["B","H","(B,H)"],
          ["H","M","(H,M)"],["H","B","(H,B)"],
        ]}
      />
    ),
    parts: [
      { label: "a.", text: "Tentukan n(S)." },
      { label: "b.", text: "Berapa banyak titik sampel yang mengandung bola Merah?" },
      { label: "c.", text: "Bandingkan dengan pengambilan dengan pengembalian: mana yang n(S)-nya lebih besar?" },
    ],
  }),
  Qn(15, "Soal TKA – Pengambilan Kelereng", {
    type: "mixed",
    content: "Kantong berisi 4 kelereng: 2 merah (M1, M2) dan 2 putih (P1, P2). Dua kelereng diambil bersamaan.",
    diagram: (
      <FreqTable
        caption="Semua pasangan yang mungkin"
        headers={["Pasangan", "Warna"]}
        rows={[
          ["(M1,M2)","Merah-Merah"],
          ["(M1,P1)","Merah-Putih"],
          ["(M1,P2)","Merah-Putih"],
          ["(M2,P1)","Merah-Putih"],
          ["(M2,P2)","Merah-Putih"],
          ["(P1,P2)","Putih-Putih"],
        ]}
      />
    ),
    parts: [
      { label: "a.", text: "Tentukan n(S)." },
      { label: "b.", text: "Berapa banyak titik sampel dengan kedua kelereng berwarna sama?" },
      { label: "c.", text: "Berapa banyak titik sampel dengan kedua kelereng berwarna berbeda?" },
    ],
  }),
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
            <span className="text-cyan-400 text-xs font-bold">📋 27 Soal</span>
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

        {/* ── URAIAN ── */}
        <div className="mb-4 mt-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-cyan-500/20" />
            <span className="text-cyan-300 text-xs font-bold uppercase tracking-widest px-2">B. Uraian</span>
            <div className="h-px flex-1 bg-cyan-500/20" />
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
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
                    <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.math && <div className="mb-3 text-white overflow-x-auto"><BlockMath math={q.math} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? "bg-white/5" : "bg-transparent px-0"}`}>
                            {p.label && <span className="text-cyan-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{p.text}</p>
                            }
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
