import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type Q = { n: number; title: string; content: string; mathContent?: string; diagram?: React.ReactNode };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

// soal 5 — freq 75:10, freq 85:7
const TabelModusFreq = () => (
  <svg width="300" height="150" viewBox="0 0 300 150" className="mx-auto">
    <rect x="4" y="4" width="292" height="142" rx="10" fill="#4c1d95" fillOpacity="0.2" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="150" y="20" fill="#a78bfa" fontSize="10" textAnchor="middle" fontWeight="bold">Tabel Frekuensi Nilai Ulangan</text>
    <rect x="10" y="26" width="272" height="18" rx="3" fill="#6d28d9" fillOpacity="0.35" />
    <text x="80" y="38" fill="#c4b5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Nilai</text>
    <text x="180" y="38" fill="#c4b5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi</text>
    {[
      ["65","4"],["70","7"],["75","10"],["80","9"],["85","7"],["90","3"],
    ].map(([v,f], i) => (
      <g key={i}>
        <rect x="10" y={45+i*16} width="272" height="15"
          fill={f==="10" && v==="75" ? "#7c3aed" : i%2===0 ? "#2e1065" : "transparent"}
          fillOpacity={f==="10" && v==="75" ? 0.4 : 0.2} />
        <text x="80" y={56+i*16} fill={f==="10"&&v==="75"?"#f5f3ff":"#ddd6fe"} fontSize="9" textAnchor="middle" fontWeight={f==="10"&&v==="75"?"bold":"normal"}>{v}</text>
        <text x="180" y={56+i*16} fill={f==="10"&&v==="75"?"#a78bfa":"#c4b5fd"} fontSize="9" textAnchor="middle" fontWeight={f==="10"&&v==="75"?"bold":"normal"}>{f}</text>
      </g>
    ))}
  </svg>
);

// soal 4
const TabelFrekuensiKumulatif = () => {
  const rows = [
    ["60","2","2"],
    ["65","4","6"],
    ["70","8","14"],
    ["75","10","24"],
    ["80","7","31"],
  ];
  return (
    <svg width="300" height="140" viewBox="0 0 300 140" className="mx-auto">
      <rect x="4" y="4" width="292" height="132" rx="10" fill="#4c1d95" fillOpacity="0.2" stroke="#a78bfa" strokeWidth="1.5" />
      <text x="150" y="18" fill="#a78bfa" fontSize="10" textAnchor="middle" fontWeight="bold">Tabel Frekuensi Nilai Ujian</text>
      <rect x="10" y="23" width="272" height="18" rx="3" fill="#6d28d9" fillOpacity="0.35" />
      <text x="60" y="35" fill="#c4b5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Nilai</text>
      <text x="150" y="35" fill="#c4b5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi</text>
      <text x="240" y="35" fill="#c4b5fd" fontSize="9" textAnchor="middle" fontWeight="bold">F. Kumulatif</text>
      {rows.map(([val, f, fk], i) => (
        <g key={i}>
          <rect x="10" y={42+i*18} width="272" height="17"
            fill={fk==="24" ? "#7c3aed" : i%2===0 ? "#2e1065" : "transparent"}
            fillOpacity={fk==="24" ? 0.35 : 0.2} />
          <text x="60" y={53+i*18} fill="#ddd6fe" fontSize="9" textAnchor="middle">{val}</text>
          <text x="150" y={53+i*18} fill="#c4b5fd" fontSize="9" textAnchor="middle">{f}</text>
          <text x="240" y={53+i*18} fill={fk==="24"?"#a78bfa":"#c4b5fd"} fontSize="9" textAnchor="middle" fontWeight={fk==="24"?"bold":"normal"}>{fk}</text>
        </g>
      ))}
    </svg>
  );
};

// soal 7 — fix: y0=32 agar angka 20 tidak bertabrakan dengan judul
const DiagramSepatuBar = () => {
  const bars = [
    { label: "39", value: 5,  color: "#6d28d9" },
    { label: "40", value: 12, color: "#7c3aed" },
    { label: "41", value: 20, color: "#a78bfa" },
    { label: "42", value: 15, color: "#8b5cf6" },
    { label: "43", value: 8,  color: "#7c3aed" },
  ];
  const maxVal = 20, chartH = 106, x0 = 50, y0 = 32, y1 = y0 + chartH, barW = 34, gap = 18;
  return (
    <svg width="320" height="182" viewBox="0 0 320 182" className="mx-auto">
      <rect x="2" y="2" width="316" height="178" rx="10" fill="#4c1d95" fillOpacity="0.2" stroke="#a78bfa" strokeWidth="1.5" />
      <text x="160" y="16" fill="#a78bfa" fontSize="10" textAnchor="middle" fontWeight="bold">Penjualan Sepatu (pasang)</text>
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="#a78bfa" strokeWidth="1.5" />
      <line x1={x0} y1={y1} x2="315" y2={y1} stroke="#a78bfa" strokeWidth="1.5" />
      {[0,5,10,15,20].map((v,i) => {
        const gy = y1 - (v / maxVal) * chartH;
        return (
          <g key={i}>
            <line x1={x0-3} y1={gy} x2={x0} y2={gy} stroke="#a78bfa" strokeWidth="1" />
            <line x1={x0} y1={gy} x2="315" y2={gy} stroke="#a78bfa" strokeWidth="0.4" strokeOpacity="0.3" />
            <text x={x0-5} y={gy+3} fill="#94a3b8" fontSize="7" textAnchor="end">{v}</text>
          </g>
        );
      })}
      {bars.map((b, i) => {
        const bh = (b.value / maxVal) * chartH;
        const bx = x0 + 12 + i * (barW + gap);
        const by = y1 - bh;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={barW} height={bh} fill={b.color} fillOpacity="0.85" rx="3" />
            <text x={bx + barW/2} y={by - 4} fill="#e0d9ff" fontSize="8" textAnchor="middle">{b.value}</text>
            <text x={bx + barW/2} y={y1 + 13} fill="#c4b5fd" fontSize="9" textAnchor="middle">{b.label}</text>
          </g>
        );
      })}
      <text x="185" y="175" fill="#94a3b8" fontSize="8" textAnchor="middle">Ukuran Sepatu</text>
    </svg>
  );
};

// soal 10 — data baru (nilai rapor), fix collision, berbeda dari soal 7
const DiagramBatangNilai = () => {
  const bars = [
    { label: "70", value: 5,  color: "#6d28d9" },
    { label: "75", value: 12, color: "#7c3aed" },
    { label: "80", value: 20, color: "#a78bfa" },
    { label: "85", value: 9,  color: "#8b5cf6" },
    { label: "90", value: 4,  color: "#6d28d9" },
  ];
  const maxVal = 20, chartH = 106, x0 = 55, y0 = 32, y1 = y0 + chartH, barW = 34, gap = 16;
  return (
    <svg width="320" height="182" viewBox="0 0 320 182" className="mx-auto">
      <rect x="2" y="2" width="316" height="178" rx="10" fill="#4c1d95" fillOpacity="0.2" stroke="#a78bfa" strokeWidth="1.5" />
      <text x="160" y="16" fill="#a78bfa" fontSize="10" textAnchor="middle" fontWeight="bold">Distribusi Nilai Rapor Siswa</text>
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="#a78bfa" strokeWidth="1.5" />
      <line x1={x0} y1={y1} x2="315" y2={y1} stroke="#a78bfa" strokeWidth="1.5" />
      {[0,5,10,15,20].map((v,i) => {
        const gy = y1 - (v / maxVal) * chartH;
        return (
          <g key={i}>
            <line x1={x0-3} y1={gy} x2={x0} y2={gy} stroke="#a78bfa" strokeWidth="1" />
            <line x1={x0} y1={gy} x2="315" y2={gy} stroke="#a78bfa" strokeWidth="0.4" strokeOpacity="0.3" />
            <text x={x0-5} y={gy+3} fill="#94a3b8" fontSize="7" textAnchor="end">{v}</text>
          </g>
        );
      })}
      {bars.map((b, i) => {
        const bh = (b.value / maxVal) * chartH;
        const bx = x0 + 12 + i * (barW + gap);
        const by = y1 - bh;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={barW} height={bh} fill={b.color} fillOpacity="0.85" rx="3" />
            <text x={bx + barW/2} y={by - 4} fill="#e0d9ff" fontSize="8" textAnchor="middle">{b.value}</text>
            <text x={bx + barW/2} y={y1 + 13} fill="#c4b5fd" fontSize="9" textAnchor="middle">{b.label}</text>
          </g>
        );
      })}
      <text x="190" y="175" fill="#94a3b8" fontSize="8" textAnchor="middle">Nilai Rapor</text>
    </svg>
  );
};

const questions: Q[] = [
  Qn(1, "Median dan Modus Data Ganjil – UN", {
    content: "Tujuh siswa mengikuti lomba cerdas cermat dan memperoleh skor berikut: 15, 8, 20, 8, 25, 8, 12. Tentukan median dan modus dari skor ketujuh siswa tersebut!",
  }),
  Qn(2, "Median dan Modus Data Genap – ANBK", {
    content: "Delapan siswa mendapat nilai ulangan sebagai berikut: 85, 70, 80, 75, 80, 90, 95, 80. Tentukan median dan modus dari nilai kedelapan siswa tersebut!",
  }),
  Qn(3, "Median dan Modus dari Data Survei – ANBK", {
    content: "Nilai hasil tes sejumlah siswa: 72, 85, 68, 72, 90, 78, 72, 85, 72, 80, 65. Tentukan median dan modus dari data tersebut!",
  }),
  Qn(4, "Median dan Modus dari Tabel Frekuensi Kumulatif – TKA", {
    diagram: <TabelFrekuensiKumulatif />,
    content: "Tabel di atas menunjukkan distribusi nilai ujian sejumlah siswa beserta frekuensi kumulatifnya. Tentukan median dan modus dari data nilai ujian tersebut!",
  }),
  Qn(5, "Modus dan Median dari Tabel Frekuensi – UN", {
    diagram: <TabelModusFreq />,
    content: "Tabel di atas menunjukkan frekuensi nilai ulangan matematika sejumlah siswa. Tentukan modus dan median dari data pada tabel tersebut!",
  }),
  Qn(6, "Menentukan Nilai Data dari Median – UN", {
    content: "Lima data: 10, 4, a, 12, 6. Diketahui median dari kelima data tersebut adalah 8. Tentukan nilai a!",
  }),
  Qn(7, "Modus dalam Kehidupan Nyata – TKA", {
    diagram: <DiagramSepatuBar />,
    content: "Seorang penjual sepatu mencatat ukuran sepatu yang terjual selama satu minggu sebagaimana tampak pada diagram batang di atas. Tentukan ukuran sepatu yang paling laku (modus) dan jelaskan mengapa modus lebih berguna daripada rata-rata untuk kasus ini!",
  }),
  Qn(8, "Menentukan Dua Data Tak Diketahui – ANBK", {
    content: "Lima data yang sudah diurutkan dari kecil ke besar adalah: a, 5, 8, b, 12. Diketahui median dari kelima data tersebut adalah 8 dan rata-rata kelima data tersebut juga 8. Tentukan nilai a dan nilai b!",
  }),
  Qn(9, "Nilai k agar Modus Tetap 8 – UN", {
    content: "Diketahui data: 3, 5, 7, 8, k, 8, 10, 12. Modus dari data tersebut adalah 8. Tentukan semua kemungkinan nilai k yang membuat modus data tetap 8, dan jelaskan alasannya!",
  }),
  Qn(10, "Modus dan Median dari Diagram Batang – UN", {
    diagram: <DiagramBatangNilai />,
    content: "Diagram batang di atas menunjukkan distribusi nilai rapor sejumlah siswa. Tentukan modus dan median dari data tersebut!",
  }),
];

const MedianModusPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🎯</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.7)' }}>
            UKURAN PEMUSATAN DATA
          </h1>
          <p className="text-violet-200/70 text-sm text-center font-body mb-1">Median dan Modus</p>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 10 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-3">📌 Rumus Kunci</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { name: "Median (n ganjil)", math: "Me = x_{\\frac{n+1}{2}}" },
              { name: "Median (n genap)", math: "Me = \\frac{x_{n/2} + x_{n/2+1}}{2}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-3">
                <div className="text-violet-400 text-[9px] uppercase font-bold min-w-[120px]">{r.name}</div>
                <div className="text-violet-200 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
            <div className="bg-white/5 rounded-lg px-3 py-2 flex items-start gap-3">
              <div className="text-violet-400 text-[9px] uppercase font-bold min-w-[120px] pt-0.5">Modus</div>
              <div className="text-violet-200 text-xs leading-relaxed">Nilai yang paling sering muncul, atau nilai dengan frekuensi terbesar dalam data</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-900/80 to-purple-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-violet-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-400 to-purple-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/50 flex items-center justify-center shrink-0">
                    <span className="text-violet-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3 overflow-x-auto">{q.diagram}</div>}
                    {q.mathContent && (
                      <div className="mb-3 bg-violet-900/20 border border-violet-500/20 rounded-lg px-4 py-3 flex justify-center overflow-x-auto">
                        <InlineMath math={q.mathContent} />
                      </div>
                    )}
                    <p className="font-body text-sm text-white/90 leading-relaxed">{q.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};
export default MedianModusPage;
