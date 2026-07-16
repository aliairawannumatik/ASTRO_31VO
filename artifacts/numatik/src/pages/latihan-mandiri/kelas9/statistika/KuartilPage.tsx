import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type Q = { n: number; title: string; content: string; diagram?: React.ReactNode };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

// soal 6 — tabel frekuensi horizontal, n=25 (ganjil)
const TabelHorizontalGanjil = () => {
  const nilai = ["60","65","70","75","80"];
  const frek  = ["3","5","9","5","3"];
  const colW = 40, x0 = 10, rowH = 22, hdrW = 72;
  const tableW = hdrW + nilai.length * colW;
  return (
    <svg width="320" height="110" viewBox="0 0 320 110" className="mx-auto">
      <rect x="4" y="4" width="312" height="102" rx="10" fill="#14532d" fillOpacity="0.2" stroke="#4ade80" strokeWidth="1.5"/>
      <text x="160" y="18" fill="#4ade80" fontSize="10" textAnchor="middle" fontWeight="bold">Distribusi Nilai Ulangan Matematika</text>
      {/* header row */}
      <rect x={x0} y="24" width={hdrW} height={rowH} fill="#166534" fillOpacity="0.5" rx="3"/>
      <text x={x0+hdrW/2} y="38" fill="#86efac" fontSize="9" textAnchor="middle" fontWeight="bold">Nilai</text>
      {nilai.map((v,i)=>(
        <g key={i}>
          <rect x={x0+hdrW+i*colW} y="24" width={colW} height={rowH} fill="#166534" fillOpacity="0.4" rx="2"/>
          <text x={x0+hdrW+i*colW+colW/2} y="38" fill="#86efac" fontSize="9" textAnchor="middle" fontWeight="bold">{v}</text>
        </g>
      ))}
      {/* frekuensi row */}
      <rect x={x0} y="46" width={hdrW} height={rowH} fill="#14532d" fillOpacity="0.4" rx="3"/>
      <text x={x0+hdrW/2} y="61" fill="#86efac" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi</text>
      {frek.map((f,i)=>(
        <g key={i}>
          <rect x={x0+hdrW+i*colW} y="46" width={colW} height={rowH} fill={i%2===0?"#1a3a1a":"transparent"} fillOpacity="0.3" rx="2"/>
          <text x={x0+hdrW+i*colW+colW/2} y="61" fill="#d1fae5" fontSize="9" textAnchor="middle">{f}</text>
        </g>
      ))}
      {/* total row */}
      <rect x={x0} y="68" width={tableW} height={rowH} fill="#166534" fillOpacity="0.25" rx="3"/>
      <text x={x0+hdrW/2} y="82" fill="#86efac" fontSize="9" textAnchor="middle" fontWeight="bold">Total</text>
      <text x={x0+hdrW+nilai.length*colW/2} y="82" fill="#4ade80" fontSize="9" textAnchor="middle" fontWeight="bold">25 siswa</text>
    </svg>
  );
};

// soal 7 — tabel frekuensi vertikal, n=28 (genap)
const TabelVertikalGenap = () => {
  const rows = [["60","4"],["65","6"],["70","8"],["75","6"],["80","4"]];
  return (
    <svg width="260" height="170" viewBox="0 0 260 170" className="mx-auto">
      <rect x="4" y="4" width="252" height="162" rx="10" fill="#14532d" fillOpacity="0.2" stroke="#4ade80" strokeWidth="1.5"/>
      <text x="130" y="18" fill="#4ade80" fontSize="10" textAnchor="middle" fontWeight="bold">Nilai Ujian Akhir Semester</text>
      <rect x="10" y="24" width="232" height="18" rx="3" fill="#166534" fillOpacity="0.5"/>
      <text x="80" y="36" fill="#86efac" fontSize="9" textAnchor="middle" fontWeight="bold">Nilai</text>
      <text x="180" y="36" fill="#86efac" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi</text>
      {rows.map(([v,f],i)=>(
        <g key={i}>
          <rect x="10" y={43+i*18} width="232" height="17" fill={i%2===0?"#14532d":"transparent"} fillOpacity="0.3" rx="2"/>
          <text x="80" y={55+i*18} fill="#d1fae5" fontSize="9" textAnchor="middle">{v}</text>
          <text x="180" y={55+i*18} fill="#86efac" fontSize="9" textAnchor="middle">{f}</text>
        </g>
      ))}
      <rect x="10" y="133" width="232" height="18" rx="3" fill="#166534" fillOpacity="0.35"/>
      <text x="80" y="145" fill="#4ade80" fontSize="9" textAnchor="middle" fontWeight="bold">Total</text>
      <text x="180" y="145" fill="#4ade80" fontSize="9" textAnchor="middle" fontWeight="bold">28 siswa</text>
    </svg>
  );
};

// soal 8 — diagram batang, n=23 (ganjil)
const DiagramBatangGanjil = () => {
  const bars = [
    { label: "70", value: 3,  color: "#166534" },
    { label: "75", value: 5,  color: "#15803d" },
    { label: "80", value: 7,  color: "#16a34a" },
    { label: "85", value: 5,  color: "#15803d" },
    { label: "90", value: 3,  color: "#166534" },
  ];
  const maxVal = 8, chartH = 100, x0 = 50, y0 = 30, y1 = y0 + chartH, barW = 34, gap = 18;
  return (
    <svg width="320" height="178" viewBox="0 0 320 178" className="mx-auto">
      <rect x="2" y="2" width="316" height="174" rx="10" fill="#14532d" fillOpacity="0.2" stroke="#4ade80" strokeWidth="1.5"/>
      <text x="160" y="16" fill="#4ade80" fontSize="10" textAnchor="middle" fontWeight="bold">Nilai Ulangan Harian (n = 23 siswa)</text>
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="#4ade80" strokeWidth="1.5"/>
      <line x1={x0} y1={y1} x2="315" y2={y1} stroke="#4ade80" strokeWidth="1.5"/>
      {[0,2,4,6,8].map((v,i)=>{
        const gy = y1 - (v/maxVal)*chartH;
        return (
          <g key={i}>
            <line x1={x0-3} y1={gy} x2={x0} y2={gy} stroke="#4ade80" strokeWidth="1"/>
            <line x1={x0} y1={gy} x2="315" y2={gy} stroke="#4ade80" strokeWidth="0.4" strokeOpacity="0.3"/>
            <text x={x0-5} y={gy+3} fill="#86efac" fontSize="7" textAnchor="end">{v}</text>
          </g>
        );
      })}
      {bars.map((b,i)=>{
        const bh = (b.value/maxVal)*chartH;
        const bx = x0 + 10 + i*(barW+gap);
        const by = y1 - bh;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={barW} height={bh} fill={b.color} fillOpacity="0.85" rx="3"/>
            <text x={bx+barW/2} y={by-4} fill="#d1fae5" fontSize="8" textAnchor="middle">{b.value}</text>
            <text x={bx+barW/2} y={y1+13} fill="#86efac" fontSize="9" textAnchor="middle">{b.label}</text>
          </g>
        );
      })}
      <text x="190" y="170" fill="#86efac" fontSize="8" textAnchor="middle">Nilai Ulangan</text>
    </svg>
  );
};

// soal 9 — diagram batang, n=28 (genap)
const DiagramBatangGenap = () => {
  const bars = [
    { label: "65", value: 4,  color: "#166534" },
    { label: "70", value: 6,  color: "#15803d" },
    { label: "75", value: 8,  color: "#16a34a" },
    { label: "80", value: 6,  color: "#15803d" },
    { label: "85", value: 4,  color: "#166534" },
  ];
  const maxVal = 10, chartH = 100, x0 = 50, y0 = 30, y1 = y0 + chartH, barW = 34, gap = 18;
  return (
    <svg width="320" height="178" viewBox="0 0 320 178" className="mx-auto">
      <rect x="2" y="2" width="316" height="174" rx="10" fill="#14532d" fillOpacity="0.2" stroke="#4ade80" strokeWidth="1.5"/>
      <text x="160" y="16" fill="#4ade80" fontSize="10" textAnchor="middle" fontWeight="bold">Nilai Ujian Semester (n = 28 siswa)</text>
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="#4ade80" strokeWidth="1.5"/>
      <line x1={x0} y1={y1} x2="315" y2={y1} stroke="#4ade80" strokeWidth="1.5"/>
      {[0,2,4,6,8,10].map((v,i)=>{
        const gy = y1 - (v/maxVal)*chartH;
        return (
          <g key={i}>
            <line x1={x0-3} y1={gy} x2={x0} y2={gy} stroke="#4ade80" strokeWidth="1"/>
            <line x1={x0} y1={gy} x2="315" y2={gy} stroke="#4ade80" strokeWidth="0.4" strokeOpacity="0.3"/>
            <text x={x0-5} y={gy+3} fill="#86efac" fontSize="7" textAnchor="end">{v}</text>
          </g>
        );
      })}
      {bars.map((b,i)=>{
        const bh = (b.value/maxVal)*chartH;
        const bx = x0 + 10 + i*(barW+gap);
        const by = y1 - bh;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={barW} height={bh} fill={b.color} fillOpacity="0.85" rx="3"/>
            <text x={bx+barW/2} y={by-4} fill="#d1fae5" fontSize="8" textAnchor="middle">{b.value}</text>
            <text x={bx+barW/2} y={y1+13} fill="#86efac" fontSize="9" textAnchor="middle">{b.label}</text>
          </g>
        );
      })}
      <text x="190" y="170" fill="#86efac" fontSize="8" textAnchor="middle">Nilai Ujian</text>
    </svg>
  );
};

const questions: Q[] = [
  Qn(1, "Menentukan Kuartil Data Ganjil – ANBK", {
    content: "Data nilai ulangan 11 siswa: 14, 25, 8, 20, 5, 18, 12, 30, 10, 22, 15. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(2, "Kuartil Data Genap – TKA", {
    content: "Dua belas data: 18, 4, 27, 9, 15, 3, 21, 12, 6, 30, 7, 24. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(3, "Kuartil Tinggi Badan Siswa – TKA", {
    content: "Data tinggi badan 9 siswa (dalam cm): 164, 152, 170, 155, 160, 150, 162, 157, 166. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(4, "Interpretasi Kuartil Nilai Ujian – ANBK", {
    content: "Dari data nilai ujian 40 siswa, diperoleh Q₁ = 65, Q₂ = 75, dan Q₃ = 85. Berapa banyak siswa yang mendapat nilai antara 65 dan 85? Berapa banyak siswa yang mendapat nilai di bawah Q₁?",
  }),
  Qn(5, "Kuartil Nilai 12 Siswa – UN", {
    content: "Data nilai 12 siswa yang sudah diurutkan dari kecil ke besar: 55, 60, 62, 65, 68, 70, 72, 75, 78, 80, 85, 90. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(6, "Kuartil dari Tabel Frekuensi – UN", {
    diagram: <TabelHorizontalGanjil />,
    content: "Tabel di atas menunjukkan distribusi nilai ulangan matematika 25 siswa. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(7, "Kuartil dari Tabel Frekuensi – ANBK", {
    diagram: <TabelVertikalGenap />,
    content: "Tabel di atas menunjukkan distribusi nilai ujian akhir semester 28 siswa. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(8, "Kuartil dari Diagram Batang – TKA", {
    diagram: <DiagramBatangGanjil />,
    content: "Diagram batang di atas menunjukkan distribusi nilai ulangan harian 23 siswa. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(9, "Kuartil dari Diagram Batang – UN", {
    diagram: <DiagramBatangGenap />,
    content: "Diagram batang di atas menunjukkan distribusi nilai ujian semester 28 siswa. Tentukan nilai Q₁, Q₂, dan Q₃ dari data tersebut!",
  }),
  Qn(10, "Menentukan Nilai x dari Q₃ – UN", {
    content: "Diketahui tujuh data: 20, 4, x, 16, 8, 28, 24. Jika Q₃ dari data tersebut adalah 26, tentukan nilai x!",
  }),
];

const KuartilPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
            <span className="text-green-400 text-xs font-bold">📋 10 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-green-900/20 border border-green-500/20 rounded-xl p-4">
          <p className="text-green-300 text-xs font-bold mb-3">{t('practice.keyFormula')}</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { name: "Kuartil Data Tunggal", math: "Q_i = x_{\\frac{i(n+1)}{4}}" },
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
            {t('practice.backTo')} Statistika
          </button>
        </div>
      </div>
    </div>
  );
};
export default KuartilPage;
