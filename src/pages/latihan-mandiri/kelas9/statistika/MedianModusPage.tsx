import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Q = { n: number; title: string; content: string; mathContent?: string; diagram?: React.ReactNode };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const GarisMedian = () => (
  <svg width="310" height="110" viewBox="0 0 310 110" className="mx-auto">
    <rect x="4" y="4" width="302" height="102" rx="10" fill="#4c1d95" fillOpacity="0.25" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="155" y="20" fill="#a78bfa" fontSize="10" textAnchor="middle" fontWeight="bold">Median Data Ganjil vs Genap</text>
    <text x="15" y="38" fill="#c4b5fd" fontSize="9" fontWeight="bold">Ganjil (n=7):</text>
    {[2,4,6,7,8,10,12].map((v,i) => (
      <g key={i}>
        <rect x={60+i*30} y={42} width="26" height="22" rx="4"
          fill={i===3 ? "#7c3aed" : "#2e1065"} fillOpacity={i===3?0.9:0.5}
          stroke={i===3 ? "#a78bfa" : "#6d28d9"} strokeWidth={i===3?2:1} />
        <text x={73+i*30} y={57} fill={i===3?"#f5f3ff":"#c4b5fd"} fontSize="10" textAnchor="middle" fontWeight={i===3?"bold":"normal"}>{v}</text>
      </g>
    ))}
    <text x={73+3*30} y={78} fill="#a78bfa" fontSize="8" textAnchor="middle">Me=7</text>
    <text x="15" y="95" fill="#c4b5fd" fontSize="9" fontWeight="bold">Genap (n=6):</text>
    {[3,5,7,9,11,13].map((v,i) => (
      <g key={i}>
        <rect x={60+i*30} y={79} width="26" height="22" rx="4"
          fill={i===2||i===3 ? "#7c3aed" : "#2e1065"} fillOpacity={i===2||i===3?0.9:0.5}
          stroke={i===2||i===3 ? "#a78bfa" : "#6d28d9"} strokeWidth={i===2||i===3?2:1} />
        <text x={73+i*30} y={94} fill={i===2||i===3?"#f5f3ff":"#c4b5fd"} fontSize="10" textAnchor="middle" fontWeight={i===2||i===3?"bold":"normal"}>{v}</text>
      </g>
    ))}
  </svg>
);

const TabelModusFreq = () => (
  <svg width="300" height="150" viewBox="0 0 300 150" className="mx-auto">
    <rect x="4" y="4" width="292" height="142" rx="10" fill="#4c1d95" fillOpacity="0.2" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="150" y="20" fill="#a78bfa" fontSize="10" textAnchor="middle" fontWeight="bold">Tabel Frekuensi Nilai Ulangan</text>
    <rect x="10" y="26" width="272" height="18" rx="3" fill="#6d28d9" fillOpacity="0.35" />
    <text x="80" y="38" fill="#c4b5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Nilai</text>
    <text x="180" y="38" fill="#c4b5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi</text>
    {[
      ["65","4"],["70","7"],["75","12"],["80","9"],["85","5"],["90","3"],
    ].map(([v,f], i) => (
      <g key={i}>
        <rect x="10" y={45+i*16} width="272" height="15"
          fill={f==="12" ? "#7c3aed" : i%2===0 ? "#2e1065" : "transparent"}
          fillOpacity={f==="12" ? 0.4 : 0.2} />
        <text x="80" y={56+i*16} fill={f==="12"?"#f5f3ff":"#ddd6fe"} fontSize="9" textAnchor="middle" fontWeight={f==="12"?"bold":"normal"}>{v}</text>
        <text x="180" y={56+i*16} fill={f==="12"?"#a78bfa":"#c4b5fd"} fontSize="9" textAnchor="middle" fontWeight={f==="12"?"bold":"normal"}>{f}</text>
      </g>
    ))}
  </svg>
);

const TabelFrekuensiKumulatif = () => {
  const rows = [
    ["60","2","2"],
    ["65","4","6"],
    ["70","8","14"],
    ["75","10","24"],
    ["80","6","30"],
  ];
  return (
    <svg width="300" height="155" viewBox="0 0 300 155" className="mx-auto">
      <rect x="4" y="4" width="292" height="147" rx="10" fill="#4c1d95" fillOpacity="0.2" stroke="#a78bfa" strokeWidth="1.5" />
      <text x="150" y="18" fill="#a78bfa" fontSize="10" textAnchor="middle" fontWeight="bold">Tabel Frekuensi Nilai Ujian</text>
      <rect x="10" y="23" width="272" height="18" rx="3" fill="#6d28d9" fillOpacity="0.35" />
      <text x="60" y="35" fill="#c4b5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Nilai</text>
      <text x="150" y="35" fill="#c4b5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi</text>
      <text x="240" y="35" fill="#c4b5fd" fontSize="9" textAnchor="middle" fontWeight="bold">F. Kumulatif</text>
      {rows.map(([val, f, fk], i) => (
        <g key={i}>
          <rect x="10" y={42+i*20} width="272" height="19"
            fill={fk==="24" ? "#7c3aed" : i%2===0 ? "#2e1065" : "transparent"}
            fillOpacity={fk==="24" ? 0.35 : 0.2} />
          <text x="60" y={55+i*20} fill="#ddd6fe" fontSize="9" textAnchor="middle">{val}</text>
          <text x="150" y={55+i*20} fill="#c4b5fd" fontSize="9" textAnchor="middle">{f}</text>
          <text x="240" y={55+i*20} fill={fk==="24"?"#a78bfa":"#c4b5fd"} fontSize="9" textAnchor="middle" fontWeight={fk==="24"?"bold":"normal"}>{fk}</text>
        </g>
      ))}
      <text x="150" y="146" fill="#94a3b8" fontSize="8" textAnchor="middle">n = 30 siswa</text>
    </svg>
  );
};

const DiagramBatangKategori = () => {
  const bars = [
    { label: "A", value: 8,  color: "#6d28d9" },
    { label: "B", value: 12, color: "#7c3aed" },
    { label: "C", value: 20, color: "#a78bfa" },
    { label: "D", value: 15, color: "#8b5cf6" },
    { label: "E", value: 5,  color: "#6d28d9" },
  ];
  const maxVal = 20, chartH = 100, x0 = 40, y0 = 20, y1 = y0 + chartH, barW = 32, gap = 20;
  return (
    <svg width="280" height="170" viewBox="0 0 280 170" className="mx-auto">
      <rect x="2" y="2" width="276" height="166" rx="10" fill="#4c1d95" fillOpacity="0.2" stroke="#a78bfa" strokeWidth="1.5" />
      <text x="140" y="16" fill="#a78bfa" fontSize="10" textAnchor="middle" fontWeight="bold">Diagram Batang Frekuensi</text>
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="#a78bfa" strokeWidth="1.5" />
      <line x1={x0} y1={y1} x2="270" y2={y1} stroke="#a78bfa" strokeWidth="1.5" />
      {[0,5,10,15,20].map((v,i) => {
        const gy = y1 - (v / maxVal) * chartH;
        return (
          <g key={i}>
            <line x1={x0-3} y1={gy} x2={x0} y2={gy} stroke="#a78bfa" strokeWidth="1" />
            <text x={x0-5} y={gy+3} fill="#94a3b8" fontSize="7" textAnchor="end">{v}</text>
          </g>
        );
      })}
      {bars.map((b, i) => {
        const bh = (b.value / maxVal) * chartH;
        const bx = x0 + 10 + i * (barW + gap);
        const by = y1 - bh;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={barW} height={bh} fill={b.color} fillOpacity="0.85" rx="3" />
            <text x={bx + barW/2} y={by - 4} fill="#e0d9ff" fontSize="8" textAnchor="middle">{b.value}</text>
            <text x={bx + barW/2} y={y1 + 12} fill="#c4b5fd" fontSize="9" textAnchor="middle">{b.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

const questions: Q[] = [
  Qn(1, "Median Data Ganjil – UN", {
    diagram: <GarisMedian />,
    content: "Tujuh siswa mengikuti lomba cerdas cermat dan memperoleh skor: 5, 8, 12, 15, 20, 25, 30. Data sudah diurutkan dari kecil ke besar. Tentukan median (nilai tengah) dari skor ke-7 siswa tersebut!",
  }),
  Qn(2, "Median Data Genap – ANBK", {
    content: "Enam siswa mendapat nilai ulangan: 70, 75, 80, 85, 90, 95. Data sudah diurutkan dari kecil ke besar. Tentukan median dari nilai keenam siswa tersebut!",
  }),
  Qn(3, "Modus Data Tunggal – UN", {
    diagram: <TabelModusFreq />,
    content: "Tabel di atas menunjukkan frekuensi nilai ulangan matematika sejumlah siswa. Tentukan modus (nilai yang paling sering muncul) dari data pada tabel tersebut!",
  }),
  Qn(4, "Median dari Tabel Frekuensi – TKA", {
    diagram: <TabelFrekuensiKumulatif />,
    content: "Tabel di atas menunjukkan distribusi nilai ujian 30 siswa beserta frekuensi kumulatifnya. Tentukan median dari data nilai ujian tersebut!",
  }),
  Qn(5, "Menentukan Nilai Data dari Median – UN", {
    content: "Lima data yang sudah diurutkan dari kecil ke besar adalah: 4, 6, a, 10, 12. Diketahui bahwa median dari kelima data tersebut adalah 8. Tentukan nilai a!",
  }),
  Qn(6, "Modus dan Median Bersamaan – TKA", {
    content: "Data nilai ujian 8 siswa yang sudah diurutkan adalah: 7, 7, 8, 8, 8, 9, 9, 10. Tentukan modus dan median dari data tersebut, kemudian bandingkan keduanya!",
  }),
  Qn(7, "Modus Data Kategori – ANBK", {
    content: "Sebuah survei dilakukan kepada sejumlah siswa tentang warna favorit mereka. Hasilnya: Merah dipilih 12 siswa, Biru 18 siswa, Hijau 15 siswa, Kuning 8 siswa, dan Ungu 7 siswa. Tentukan modus warna favorit siswa tersebut!",
  }),
  Qn(8, "Menentukan Data Hilang dari Median – TKA", {
    content: "Enam data yang sudah diurutkan dari kecil ke besar adalah: 5, 7, x, 10, 13, 15. Diketahui median dari keenam data tersebut adalah 9. Tentukan nilai x dan pastikan nilai tersebut valid dalam urutan yang ada!",
  }),
  Qn(9, "Modus dalam Kehidupan Nyata – TKA", {
    content: "Seorang penjual sepatu mencatat ukuran sepatu yang terjual selama satu minggu: ukuran 39 terjual 5 pasang, ukuran 40 terjual 12 pasang, ukuran 41 terjual 20 pasang, ukuran 42 terjual 15 pasang, dan ukuran 43 terjual 8 pasang. Tentukan ukuran sepatu yang paling laku (modus) dan jelaskan mengapa modus lebih berguna daripada rata-rata untuk kasus ini!",
  }),
  Qn(10, "Median Nilai Ujian – ANBK", {
    content: "Nilai ujian 10 siswa belum diurutkan: 78, 65, 92, 85, 71, 88, 76, 69, 83, 90. Urutkan data dari kecil ke besar, kemudian tentukan median dari nilai ke-10 siswa tersebut!",
  }),
  Qn(11, "Median Data Rapor – TKA", {
    content: "Data nilai rapor 12 siswa yang sudah diurutkan: 68, 72, 74, 75, 76, 78, 79, 80, 82, 85, 88, 92. Tentukan median dari data nilai rapor tersebut!",
  }),
  Qn(12, "Modus dan Median Berat Badan – ANBK", {
    content: "Data berat badan (kg) 10 siswa yang sudah diurutkan: 45, 48, 50, 50, 52, 55, 55, 55, 58, 60. Tentukan modus dan median dari data berat badan tersebut!",
  }),
  Qn(13, "Modus dari Tabel Frekuensi – UN", {
    content: "Dari 25 siswa yang mengikuti ujian, hasil nilainya adalah sebagai berikut: 9 siswa mendapat nilai 7, 7 siswa mendapat nilai 8, 10 siswa mendapat nilai 9, dan 5 siswa mendapat nilai 10. Tentukan modus nilai ujian dari 25 siswa tersebut, kemudian tentukan pula mediannya!",
  }),
  Qn(14, "Menentukan Dua Data Tak Diketahui – ANBK", {
    content: "Lima data yang sudah diurutkan dari kecil ke besar adalah: a, 5, 8, b, 12. Diketahui median dari kelima data tersebut adalah 8 dan rata-rata kelima data tersebut juga 8. Tentukan nilai a dan nilai b!",
  }),
  Qn(15, "Nilai k agar Modus Tetap 8 – UN", {
    content: "Diketahui data: 3, 5, 7, 8, k, 8, 10, 12. Modus dari data tersebut adalah 8. Tentukan semua kemungkinan nilai k yang membuat modus data tetap 8, dan jelaskan alasannya!",
  }),
  Qn(16, "Modus dari Diagram Batang – UN", {
    diagram: <DiagramBatangKategori />,
    content: "Diagram batang di atas menunjukkan frekuensi lima kategori data (A, B, C, D, E). Tentukan modus dari data tersebut, kemudian hitung berapa persen frekuensi kategori modus terhadap total frekuensi seluruh kategori!",
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
            <span className="text-violet-400 text-xs font-bold">📋 16 Soal</span>
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
              { name: "Median Berkelompok", math: "Me = L + p \\cdot \\frac{\\frac{n}{2} - F}{f}" },
              { name: "Modus Berkelompok", math: "Mo = L + p \\cdot \\frac{d_1}{d_1+d_2}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-3">
                <div className="text-violet-400 text-[9px] uppercase font-bold min-w-[120px]">{r.name}</div>
                <div className="text-violet-200 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
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
                    {q.mathContent && <div className="mb-3 bg-violet-900/20 border border-violet-500/20 rounded-lg px-4 py-3 flex justify-center overflow-x-auto"><BlockMath math={q.mathContent} /></div>}
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
