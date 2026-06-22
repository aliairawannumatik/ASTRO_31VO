import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Q = { n: number; title: string; content: string; diagram?: React.ReactNode };
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
    {([["60","Min"],[100,"Q₁"],[160,"Q₂"],[220,"Q₃"],[260,"Max"]] as [string|number, string][]).map(([x,label], i) => (
      <g key={i}>
        <text x={Number(x)} y={108} fill="#86efac" fontSize="8" textAnchor="middle">{label}</text>
      </g>
    ))}
    <text x="150" y="34" fill="#86efac" fontSize="8" textAnchor="middle">← IQR = Q₃ − Q₁ →</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pengertian Kuartil – UN", {
    diagram: <KuartilGarisData />,
    content: "Perhatikan diagram di atas yang menunjukkan letak kuartil pada data terurut. Jelaskan apa yang dimaksud dengan Q₁, Q₂, dan Q₃, serta sebutkan berapa persen data yang berada di antara Q₁ dan Q₃!",
  }),
  Qn(2, "Menentukan Kuartil Data Ganjil – ANBK", {
    content: "Sebelas data yang sudah diurutkan dari kecil ke besar: 5, 8, 10, 12, 14, 15, 18, 20, 22, 25, 30. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(3, "Kuartil Data Genap – TKA", {
    content: "Delapan data yang sudah diurutkan dari kecil ke besar: 3, 6, 9, 12, 15, 18, 21, 24. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(4, "Box Plot dan IQR – UN", {
    diagram: <BoxPlotSVG />,
    content: "Sebuah data nilai ujian memiliki lima rangkuman berikut: nilai minimum = 55, Q₁ = 65, Q₂ = 75, Q₃ = 85, nilai maksimum = 95. Tentukan IQR (jangkauan interkuartil) dari data tersebut dan jelaskan berapa persen data yang berada di dalam kotak (antara Q₁ dan Q₃)!",
  }),
  Qn(5, "Kuartil Tinggi Badan Siswa – TKA", {
    content: "Data tinggi badan 12 siswa (dalam cm) yang sudah diurutkan: 148, 150, 152, 154, 155, 157, 158, 160, 162, 164, 166, 170. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(6, "Interpretasi Kuartil Nilai Ujian – ANBK", {
    content: "Dari data nilai ujian 40 siswa, diperoleh Q₁ = 65, Q₂ = 75, dan Q₃ = 85. Berapa banyak siswa yang mendapat nilai antara 65 dan 85? Berapa banyak siswa yang mendapat nilai di bawah Q₁?",
  }),
  Qn(7, "Posisi Kuartil dalam Data – UN", {
    content: "Suatu data terdiri dari 20 nilai yang sudah diurutkan dari kecil ke besar. Tentukan posisi (letak) Q₁, Q₂, dan Q₃ menggunakan rumus letak kuartil, kemudian jelaskan cara membaca hasil posisi desimal tersebut!",
  }),
  Qn(8, "Kuartil 16 Data Terurut – UN", {
    content: "Enam belas data yang sudah diurutkan dari kecil ke besar: 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(9, "Kuartil Nilai Ujian 9 Siswa – UN", {
    content: "Nilai ujian 9 siswa yang sudah diurutkan dari kecil ke besar: 55, 62, 68, 72, 75, 80, 85, 88, 92. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(10, "Kuartil Nilai Rapor 20 Siswa – UN", {
    content: "Nilai rapor 20 siswa yang sudah diurutkan dari kecil ke besar:\n60, 62, 65, 68, 70, 72, 73, 75, 76, 78, 80, 80, 82, 84, 85, 87, 88, 90, 92, 95.\nTentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(11, "Kuartil Nilai 12 Siswa – UN", {
    content: "Data nilai 12 siswa yang sudah diurutkan dari kecil ke besar: 55, 60, 62, 65, 68, 70, 72, 75, 78, 80, 85, 90. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(12, "Kuartil 16 Data Campuran – ANBK", {
    content: "Enam belas data yang sudah diurutkan dari kecil ke besar: 5, 8, 10, 12, 14, 15, 17, 20, 22, 24, 26, 28, 30, 32, 35, 40. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
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
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · Tugas - Latihan Mandiri</p>
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
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3 overflow-x-auto">{q.diagram}</div>}
                    <p className="font-body text-sm text-white/90 leading-relaxed whitespace-pre-line">{q.content}</p>
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
