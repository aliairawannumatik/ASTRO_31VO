import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const KuartilGarisData = () => (
  <svg width="320" height="120" viewBox="0 0 320 120" className="mx-auto">
    <rect x="4" y="4" width="312" height="112" rx="10" fill="#14532d" fillOpacity="0.25" stroke="#4ade80" strokeWidth="1.5" />
    <text x="160" y="20" fill="#4ade80" fontSize="10" textAnchor="middle" fontWeight="bold">Letak Kuartil pada Data Terurut</text>
    <line x1="20" y1="60" x2="300" y2="60" stroke="#4ade80" strokeWidth="2" />
    {[20, 100, 160, 230, 300].map((x, i) => (
      <g key={i}>
        <circle cx={x} cy={60} r={i===0||i===4?4:6} fill={["#166534","#15803d","#16a34a","#15803d","#166534"][i]} stroke={["#4ade80","#86efac","#4ade80","#86efac","#4ade80"][i]} strokeWidth="1.5" />
      </g>
    ))}
    <text x="20" y="80" fill="#86efac" fontSize="9" textAnchor="middle">Min</text>
    <text x="100" y="80" fill="#4ade80" fontSize="10" textAnchor="middle" fontWeight="bold">Q₁</text>
    <text x="160" y="80" fill="#4ade80" fontSize="10" textAnchor="middle" fontWeight="bold">Q₂</text>
    <text x="230" y="80" fill="#4ade80" fontSize="10" textAnchor="middle" fontWeight="bold">Q₃</text>
    <text x="300" y="80" fill="#86efac" fontSize="9" textAnchor="middle">Max</text>
    <text x="60" y="48" fill="#86efac" fontSize="8" textAnchor="middle">25%</text>
    <text x="130" y="48" fill="#86efac" fontSize="8" textAnchor="middle">25%</text>
    <text x="195" y="48" fill="#86efac" fontSize="8" textAnchor="middle">25%</text>
    <text x="265" y="48" fill="#86efac" fontSize="8" textAnchor="middle">25%</text>
    <rect x="25" y="90" width="270" height="20" rx="5" fill="#14532d" fillOpacity="0.5" />
    <text x="160" y="104" fill="#86efac" fontSize="8" textAnchor="middle">Q₁ = batas bawah 25% data | Q₂ = Median | Q₃ = batas atas 75% data</text>
  </svg>
);

const BoxPlotSVG = () => (
  <svg width="320" height="120" viewBox="0 0 320 120" className="mx-auto">
    <rect x="4" y="4" width="312" height="112" rx="10" fill="#14532d" fillOpacity="0.2" stroke="#4ade80" strokeWidth="1.5" />
    <text x="160" y="18" fill="#4ade80" fontSize="10" textAnchor="middle" fontWeight="bold">Box Plot (Kotak Garis)</text>
    <line x1="40" y1="70" x2="280" y2="70" stroke="#4ade80" strokeWidth="0.8" strokeOpacity="0.3" />
    <line x1="60" y1="50" x2="60" y2="90" stroke="#4ade80" strokeWidth="1.5" />
    <rect x="100" y="45" width="120" height="50" fill="#15803d" fillOpacity="0.35" stroke="#4ade80" strokeWidth="1.5" rx="3" />
    <line x1="160" y1="45" x2="160" y2="95" stroke="#86efac" strokeWidth="2" />
    <line x1="220" y1="50" x2="220" y2="90" stroke="#4ade80" strokeWidth="1.5" />
    <line x1="60" y1="70" x2="100" y2="70" stroke="#4ade80" strokeWidth="1.5" />
    <line x1="220" y1="70" x2="260" y2="70" stroke="#4ade80" strokeWidth="1.5" />
    <line x1="260" y1="50" x2="260" y2="90" stroke="#4ade80" strokeWidth="1.5" />
    {[["60","Min"],[100,"Q₁"],[160,"Q₂\n(Median)"],[220,"Q₃"],[260,"Max"]].map(([x,label], i) => (
      <g key={i}>
        <text x={Number(x)} y={108} fill="#86efac" fontSize="8" textAnchor="middle">{String(label).split("\n")[0]}</text>
      </g>
    ))}
    <text x="150" y="34" fill="#86efac" fontSize="8" textAnchor="middle">← IQR = Q₃ − Q₁ →</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pengertian Kuartil – UN", {
    type: "mixed",
    diagram: <KuartilGarisData />,
    content: "Kuartil membagi data yang telah diurutkan menjadi empat bagian yang sama besar.",
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan Q₁, Q₂, dan Q₃?" },
      { label: "b.", text: "Berapa persen data yang berada di bawah Q₁?" },
      { label: "c.", text: "Berapa persen data yang berada di antara Q₁ dan Q₃?" },
    ],
  }),
  Qn(2, "Menentukan Kuartil Data Ganjil – ANBK", {
    type: "mixed",
    mathContent: "Q_i = x_{\\frac{i(n+1)}{4}}",
    content: "Data (n=11): 5, 8, 10, 12, 14, 15, 18, 20, 22, 25, 30.",
    parts: [
      { label: "a.", math: "Q_1 = x_{\\frac{1 \\times 12}{4}} = x_3 = \\ldots" },
      { label: "b.", math: "Q_2 = x_{\\frac{2 \\times 12}{4}} = x_6 = \\ldots" },
      { label: "c.", math: "Q_3 = x_{\\frac{3 \\times 12}{4}} = x_9 = \\ldots" },
    ],
  }),
  Qn(3, "Kuartil Data Genap – TKA", {
    type: "mixed",
    content: "Data (n=8): 3, 6, 9, 12, 15, 18, 21, 24.",
    parts: [
      { label: "a.", math: "Q_1 = x_{\\frac{1 \\times 9}{4}} = x_{2{,}25} = x_2 + 0{,}25(x_3 - x_2) = 6 + 0{,}25(3) = \\ldots" },
      { label: "b.", math: "Q_2 = \\frac{x_4+x_5}{2} = \\frac{12+15}{2} = \\ldots" },
      { label: "c.", math: "Q_3 = x_{6{,}75} = x_6 + 0{,}75(x_7-x_6) = 18+0{,}75(3) = \\ldots" },
    ],
  }),
  Qn(4, "Box Plot – UN", {
    type: "mixed",
    diagram: <BoxPlotSVG />,
    content: "Data nilai: min=55, Q₁=65, Q₂=75, Q₃=85, max=95.",
    parts: [
      { label: "a.", math: "\\text{IQR} = Q_3 - Q_1 = 85 - 65 = \\ldots" },
      { label: "b.", text: "Gambarkan box plot dari data tersebut. Beri label semua komponen." },
      { label: "c.", text: "Berapa persen data yang berada di dalam kotak (box)?" },
    ],
  }),
  Qn(5, "Kuartil dari Data Terurut – TKA", {
    type: "mixed",
    content: "Data tinggi badan 12 siswa (cm): 148, 150, 152, 154, 155, 157, 158, 160, 162, 164, 166, 170.",
    parts: [
      { label: "a.", math: "Q_1 = x_{\\frac{13}{4}} = x_{3{,}25} = 152 + 0{,}25(154-152) = 152 + 0{,}5 = \\ldots" },
      { label: "b.", math: "Q_2 = \\frac{x_6+x_7}{2} = \\frac{157+158}{2} = \\ldots" },
      { label: "c.", math: "Q_3 = x_{9{,}75} = 162 + 0{,}75(164-162) = 162 + 1{,}5 = \\ldots" },
    ],
  }),
  Qn(6, "Interpretasi Kuartil – ANBK", {
    type: "mixed",
    content: "Dari data nilai ujian 40 siswa: Q₁=65, Q₂=75, Q₃=85.",
    parts: [
      { label: "a.", text: "Berapa persen siswa yang mendapat nilai di bawah 65?" },
      { label: "b.", text: "Berapa persen siswa yang nilainya antara 65 dan 85?" },
      { label: "c.", text: "Berapa persen siswa yang nilainya di atas Q₃=85?" },
    ],
  }),
  Qn(7, "Posisi Kuartil dalam Data – UN", {
    type: "mixed",
    content: "Data (n=20) yang sudah diurutkan. Tentukan posisi Q₁, Q₂, Q₃:",
    parts: [
      { label: "a.", math: "\\text{Posisi } Q_1 = \\frac{1(20+1)}{4} = \\frac{21}{4} = 5{,}25 \\Rightarrow \\text{interpolasi antara data ke-5 dan ke-6}" },
      { label: "b.", math: "\\text{Posisi } Q_2 = \\frac{2(21)}{4} = 10{,}5 \\Rightarrow \\text{interpolasi antara data ke-10 dan ke-11}" },
      { label: "c.", math: "\\text{Posisi } Q_3 = \\frac{3(21)}{4} = 15{,}75 \\Rightarrow \\text{interpolasi antara data ke-15 dan ke-16}" },
    ],
  }),
  Qn(8, "Kuartil Data 16 Nilai – UN", {
    type: "mixed",
    content: "Data n=16 terurut: 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42.",
    parts: [
      { label: "a.", math: "Q_1 = x_{4{,}25} = x_4 + 0{,}25(x_5-x_4) = 18+0{,}25(2) = \\ldots" },
      { label: "b.", math: "Q_2 = \\frac{x_8+x_9}{2} = \\frac{26+28}{2} = \\ldots" },
      { label: "c.", math: "Q_3 = x_{12{,}75} = x_{12}+0{,}75(x_{13}-x_{12}) = 34+0{,}75(2) = \\ldots" },
    ],
  }),
  Qn(9, "Soal Cerita Kuartil – UN", {
    type: "mixed",
    content: "Nilai ujian 9 siswa (sudah urut): 55, 62, 68, 72, 75, 80, 85, 88, 92.",
    parts: [
      { label: "a.", math: "Q_1 = x_{\\frac{10}{4}} = x_{2{,}5} = \\frac{x_2+x_3}{2} = \\frac{62+68}{2} = \\ldots" },
      { label: "b.", math: "Q_2 = x_5 = \\ldots" },
      { label: "c.", math: "Q_3 = x_{7{,}5} = \\frac{x_7+x_8}{2} = \\frac{85+88}{2} = \\ldots" },
    ],
  }),
  Qn(10, "Soal Cerita – Kuartil Nilai Rapor – UN", {
    type: "mixed",
    content: "Nilai rapor 20 siswa (sudah urut dari kecil):\n60, 62, 65, 68, 70, 72, 73, 75, 76, 78,\n80, 80, 82, 84, 85, 87, 88, 90, 92, 95.",
    parts: [
      { label: "a.", math: "Q_1 = x_{5{,}25} = 70+0{,}25(72-70) = 70{,}5" },
      { label: "b.", math: "Q_2 = \\frac{x_{10}+x_{11}}{2} = \\frac{78+80}{2} = \\ldots" },
      { label: "c.", math: "Q_3 = x_{15{,}75} = 85+0{,}75(87-85) = 85+1{,}5 = \\ldots" },
    ],
  }),
  Qn(11, "Soal UN – Kuartil dan Median", {
    type: "mixed",
    content: "Data nilai 12 siswa: 55, 60, 62, 65, 68, 70, 72, 75, 78, 80, 85, 90.",
    parts: [
      { label: "a.", math: "Q_1 = \\frac{x_3+x_4}{2} = \\frac{62+65}{2} = \\ldots" },
      { label: "b.", math: "Q_2 = \\frac{x_6+x_7}{2} = \\frac{70+72}{2} = \\ldots" },
      { label: "c.", math: "Q_3 = \\frac{x_9+x_{10}}{2} = \\frac{78+80}{2} = \\ldots" },
    ],
  }),
  Qn(12, "Soal ANBK – Kuartil Berganda", {
    type: "mixed",
    content: "Data n=16: 5, 8, 10, 12, 14, 15, 17, 20, 22, 24, 26, 28, 30, 32, 35, 40.",
    parts: [
      { label: "a.", math: "Q_1 = x_{4{,}25} = 12+0{,}25(14-12) = 12{,}5" },
      { label: "b.", math: "Q_2 = \\frac{x_8+x_9}{2} = \\frac{20+22}{2} = 21" },
      { label: "c.", math: "Q_3 = x_{12{,}75} = 28+0{,}75(30-28) = 29{,}5" },
    ],
  }),
];

const KuartilPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📦</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-green-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(74,222,128,0.7)' }}>
            UKURAN LETAK DATA
          </h1>
          <p className="text-green-200/70 text-sm text-center font-body mb-1">Kuartil</p>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
            <span className="text-green-400 text-xs font-bold">📋 12 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-green-900/20 border border-green-500/20 rounded-xl p-4">
          <p className="text-green-300 text-xs font-bold mb-3">📌 Rumus Kunci</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { name: "Kuartil Data Tunggal", math: "Q_i = x_{\\frac{i(n+1)}{4}}" },
              { name: "Kuartil Berkelompok", math: "Q_i = L + p \\cdot \\frac{\\frac{in}{4}-F}{f}" },
              { name: "IQR", math: "\\text{IQR} = Q_3 - Q_1" },
              { name: "Batas Pencilan", math: "Q_1 - 1{,}5\\text{IQR} \\leq \\text{data} \\leq Q_3 + 1{,}5\\text{IQR}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-3">
                <div className="text-green-400 text-[9px] uppercase font-bold min-w-[120px]">{r.name}</div>
                <div className="text-green-200 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-slate-900/80 to-emerald-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-green-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-emerald-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-400/50 flex items-center justify-center shrink-0">
                    <span className="text-green-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-green-400 text-[10px] font-bold uppercase tracking-wider bg-green-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3 whitespace-pre-line">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-green-900/20 border border-green-500/20 rounded-lg px-4 py-3 flex justify-center overflow-x-auto"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3 overflow-x-auto">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-green-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>}
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-green-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};
export default KuartilPage;
