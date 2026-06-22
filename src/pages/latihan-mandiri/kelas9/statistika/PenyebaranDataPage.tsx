import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type Q = { n: number; title: string; content: string; diagram?: React.ReactNode };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

// soal 4 — tabel horizontal, n=30
const TabelHorizontal30 = () => {
  const nilai = ["60","65","70","75","80","85"];
  const frek  = ["3","5","8","8","5","1"];
  const colW = 34, x0 = 8, rowH = 22, hdrW = 68;
  return (
    <svg width="320" height="112" viewBox="0 0 320 112" className="mx-auto">
      <rect x="2" y="2" width="316" height="108" rx="10" fill="#7c2d12" fillOpacity="0.2" stroke="#fb923c" strokeWidth="1.5"/>
      <text x="160" y="16" fill="#fb923c" fontSize="10" textAnchor="middle" fontWeight="bold">Distribusi Nilai Ujian Matematika</text>
      <rect x={x0} y="22" width={hdrW} height={rowH} fill="#c2410c" fillOpacity="0.45" rx="3"/>
      <text x={x0+hdrW/2} y="36" fill="#fed7aa" fontSize="9" textAnchor="middle" fontWeight="bold">Nilai</text>
      {nilai.map((v,i)=>(
        <g key={i}>
          <rect x={x0+hdrW+i*colW} y="22" width={colW} height={rowH} fill="#c2410c" fillOpacity="0.35" rx="2"/>
          <text x={x0+hdrW+i*colW+colW/2} y="36" fill="#fed7aa" fontSize="9" textAnchor="middle" fontWeight="bold">{v}</text>
        </g>
      ))}
      <rect x={x0} y="44" width={hdrW} height={rowH} fill="#7c2d12" fillOpacity="0.4" rx="3"/>
      <text x={x0+hdrW/2} y="58" fill="#fed7aa" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi</text>
      {frek.map((f,i)=>(
        <g key={i}>
          <rect x={x0+hdrW+i*colW} y="44" width={colW} height={rowH} fill={i%2===0?"#431407":"transparent"} fillOpacity="0.35" rx="2"/>
          <text x={x0+hdrW+i*colW+colW/2} y="58" fill="#fdba74" fontSize="9" textAnchor="middle">{f}</text>
        </g>
      ))}
      <rect x={x0} y="66" width={hdrW+nilai.length*colW} height={rowH} fill="#c2410c" fillOpacity="0.2" rx="3"/>
      <text x={x0+hdrW/2} y="80" fill="#fb923c" fontSize="9" textAnchor="middle" fontWeight="bold">Total</text>
      <text x={x0+hdrW+nilai.length*colW/2} y="80" fill="#fb923c" fontSize="9" textAnchor="middle" fontWeight="bold">30 siswa</text>
    </svg>
  );
};

// soal 5 — tabel vertikal, n=27
const TabelVertikal27 = () => {
  const rows = [["50","3"],["55","5"],["60","9"],["65","7"],["70","3"]];
  return (
    <svg width="240" height="175" viewBox="0 0 240 175" className="mx-auto">
      <rect x="4" y="4" width="232" height="167" rx="10" fill="#7c2d12" fillOpacity="0.2" stroke="#fb923c" strokeWidth="1.5"/>
      <text x="120" y="18" fill="#fb923c" fontSize="10" textAnchor="middle" fontWeight="bold">Nilai Ulangan Harian</text>
      <rect x="10" y="24" width="212" height="18" rx="3" fill="#c2410c" fillOpacity="0.4"/>
      <text x="70" y="36" fill="#fed7aa" fontSize="9" textAnchor="middle" fontWeight="bold">Nilai</text>
      <text x="165" y="36" fill="#fed7aa" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi</text>
      {rows.map(([v,f],i)=>(
        <g key={i}>
          <rect x="10" y={43+i*19} width="212" height="18" fill={i%2===0?"#7c2d12":"transparent"} fillOpacity="0.3" rx="2"/>
          <text x="70" y={55+i*19} fill="#fdba74" fontSize="9" textAnchor="middle">{v}</text>
          <text x="165" y={55+i*19} fill="#fed7aa" fontSize="9" textAnchor="middle">{f}</text>
        </g>
      ))}
      <rect x="10" y="138" width="212" height="18" rx="3" fill="#c2410c" fillOpacity="0.25"/>
      <text x="70" y="150" fill="#fb923c" fontSize="9" textAnchor="middle" fontWeight="bold">Total</text>
      <text x="165" y="150" fill="#fb923c" fontSize="9" textAnchor="middle" fontWeight="bold">27 siswa</text>
    </svg>
  );
};

// soal 6 — diagram batang, n=27
const DiagramBatang27 = () => {
  const bars = [
    { label:"70", value:3,  color:"#c2410c" },
    { label:"75", value:6,  color:"#ea580c" },
    { label:"80", value:9,  color:"#fb923c" },
    { label:"85", value:6,  color:"#ea580c" },
    { label:"90", value:3,  color:"#c2410c" },
  ];
  const maxVal = 10, chartH = 100, x0 = 48, y0 = 28, y1 = y0+chartH, barW = 34, gap = 18;
  return (
    <svg width="320" height="178" viewBox="0 0 320 178" className="mx-auto">
      <rect x="2" y="2" width="316" height="174" rx="10" fill="#7c2d12" fillOpacity="0.2" stroke="#fb923c" strokeWidth="1.5"/>
      <text x="160" y="16" fill="#fb923c" fontSize="10" textAnchor="middle" fontWeight="bold">Nilai Rapor Siswa (n = 27)</text>
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="#fb923c" strokeWidth="1.5"/>
      <line x1={x0} y1={y1} x2="315" y2={y1} stroke="#fb923c" strokeWidth="1.5"/>
      {[0,2,4,6,8,10].map((v,i)=>{
        const gy = y1-(v/maxVal)*chartH;
        return (
          <g key={i}>
            <line x1={x0-3} y1={gy} x2={x0} y2={gy} stroke="#fb923c" strokeWidth="1"/>
            <line x1={x0} y1={gy} x2="315" y2={gy} stroke="#fb923c" strokeWidth="0.4" strokeOpacity="0.3"/>
            <text x={x0-5} y={gy+3} fill="#fdba74" fontSize="7" textAnchor="end">{v}</text>
          </g>
        );
      })}
      {bars.map((b,i)=>{
        const bh = (b.value/maxVal)*chartH;
        const bx = x0+10+i*(barW+gap);
        const by = y1-bh;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={barW} height={bh} fill={b.color} fillOpacity="0.85" rx="3"/>
            <text x={bx+barW/2} y={by-4} fill="#fed7aa" fontSize="8" textAnchor="middle">{b.value}</text>
            <text x={bx+barW/2} y={y1+13} fill="#fdba74" fontSize="9" textAnchor="middle">{b.label}</text>
          </g>
        );
      })}
      <text x="190" y="170" fill="#fdba74" fontSize="8" textAnchor="middle">Nilai Rapor</text>
    </svg>
  );
};

// soal 2 — tabel frekuensi vertikal, tanya jangkauan
const TabelFrekuensiJangkauan = () => {
  const rows = [["40","2"],["50","5"],["60","8"],["70","6"],["80","3"]];
  return (
    <svg width="240" height="175" viewBox="0 0 240 175" className="mx-auto">
      <rect x="4" y="4" width="232" height="167" rx="10" fill="#7c2d12" fillOpacity="0.2" stroke="#fb923c" strokeWidth="1.5"/>
      <text x="120" y="18" fill="#fb923c" fontSize="10" textAnchor="middle" fontWeight="bold">Nilai Ulangan Matematika</text>
      <rect x="10" y="24" width="212" height="18" rx="3" fill="#c2410c" fillOpacity="0.4"/>
      <text x="70" y="36" fill="#fed7aa" fontSize="9" textAnchor="middle" fontWeight="bold">Nilai</text>
      <text x="165" y="36" fill="#fed7aa" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi</text>
      {rows.map(([v,f],i)=>(
        <g key={i}>
          <rect x="10" y={43+i*19} width="212" height="18" fill={i%2===0?"#7c2d12":"transparent"} fillOpacity="0.3" rx="2"/>
          <text x="70" y={55+i*19} fill="#fdba74" fontSize="9" textAnchor="middle">{v}</text>
          <text x="165" y={55+i*19} fill="#fed7aa" fontSize="9" textAnchor="middle">{f}</text>
        </g>
      ))}
      <rect x="10" y="138" width="212" height="18" rx="3" fill="#c2410c" fillOpacity="0.25"/>
      <text x="70" y="150" fill="#fb923c" fontSize="9" textAnchor="middle" fontWeight="bold">Total</text>
      <text x="165" y="150" fill="#fb923c" fontSize="9" textAnchor="middle" fontWeight="bold">24 siswa</text>
    </svg>
  );
};

const questions: Q[] = [
  Qn(1, "Jangkauan (Range) – ANBK", {
    content: "Nilai ulangan harian enam siswa adalah: 65, 72, 58, 80, 90, 45. Tentukan jangkauan dari data nilai tersebut, kemudian jelaskan satu kelemahan jangkauan sebagai ukuran penyebaran data!",
  }),
  Qn(2, "Jangkauan dari Tabel Frekuensi – UN", {
    diagram: <TabelFrekuensiJangkauan />,
    content: "Tabel di atas menunjukkan distribusi nilai ulangan matematika 24 siswa. Tentukan jangkauan dari data tersebut!",
  }),
  Qn(3, "Jangkauan Antarkuartil (QR) – UN", {
    content: "Data nilai 10 siswa: 72, 88, 60, 80, 95, 65, 55, 82, 70, 75. Diketahui Q\u2081 = 63,75 dan Q\u2083 = 83,5. Tentukan Q\u1D63 (jangkauan antarkuartil) dan Q\u1D48 (simpangan kuartil) dari data tersebut!",
  }),
  Qn(4, "QR dan Simpangan Kuartil dari Data – ANBK", {
    content: "Data nilai 11 siswa: 82, 65, 75, 55, 88, 70, 95, 60, 72, 80, 45. Tentukan Q\u2081, Q\u2083, Q\u1D63, dan Q\u1D48 dari data tersebut!",
  }),
  Qn(5, "QR dan Simpangan Kuartil dari Tabel – UN", {
    diagram: <TabelHorizontal30 />,
    content: "Tabel di atas menunjukkan distribusi nilai ujian matematika 30 siswa. Tentukan Q\u2081, Q\u2082, Q\u2083, Q\u1D63, dan Q\u1D48 dari data tersebut!",
  }),
  Qn(6, "QR dan Simpangan Kuartil dari Tabel – ANBK", {
    diagram: <TabelVertikal27 />,
    content: "Tabel di atas menunjukkan distribusi nilai ulangan harian 27 siswa. Tentukan Q\u2081, Q\u2082, Q\u2083, Q\u1D63, dan Q\u1D48 dari data tersebut!",
  }),
  Qn(7, "QR dan Simpangan Kuartil dari Diagram – TKA", {
    diagram: <DiagramBatang27 />,
    content: "Diagram batang di atas menunjukkan distribusi nilai rapor 27 siswa. Tentukan Q\u2081, Q\u2082, Q\u2083, Q\u1D63, dan Q\u1D48 dari data tersebut!",
  }),
  Qn(8, "Varians dan Simpangan Baku – UN", {
    content: "Data nilai ulangan 5 siswa: 6, 2, 8, 4, 5. Tentukan varians (s\u00B2) dan simpangan baku (s) dari data tersebut!",
  }),
  Qn(9, "Simpangan Rata-Rata – ANBK", {
    content: "Data nilai ulangan 5 siswa: 8, 4, 6, 7, 5. Tentukan rata-rata dan simpangan rata-rata (SR) dari data tersebut!",
  }),
];

const PenyebaranDataPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📡</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,146,60,0.7)' }}>
            UKURAN PENYEBARAN DATA
          </h1>
          <p className="text-orange-200/70 text-sm text-center font-body mb-1">
            Jangkauan, Q<sub>R</sub>, dan Q<sub>d</sub>
          </p>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 9 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-3">📌 Rumus Kunci</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { name: "Jangkauan", math: "J = x_{\\max} - x_{\\min}" },
              { name: "Q_R (Jangkauan Antarkuartil)", math: "Q_R = Q_3 - Q_1" },
              { name: "Q_d (Simpangan Kuartil)", math: "Q_d = \\frac{Q_3 - Q_1}{2}" },
              { name: "Simpangan Rata-Rata", math: "SR = \\frac{\\sum|x_i-\\bar{x}|}{n}" },
              { name: "Varians", math: "s^2 = \\frac{\\sum(x_i-\\bar{x})^2}{n}" },
              { name: "Simpangan Baku", math: "s = \\sqrt{s^2}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-3">
                <div className="text-orange-400 text-[9px] uppercase font-bold min-w-[160px]">{r.name}</div>
                <div className="text-orange-200 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-red-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-red-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center shrink-0">
                    <span className="text-orange-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3 overflow-x-auto">{q.diagram}</div>}
                    <p className="font-body text-sm text-white/90 leading-relaxed">{q.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-orange-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};
export default PenyebaranDataPage;
