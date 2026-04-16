import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
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
    <text x="150" y="20" fill="#a78bfa" fontSize="10" textAnchor="middle" fontWeight="bold">Tabel Frekuensi – Mencari Modus</text>
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
        <text x="180" y={56+i*16} fill={f==="12"?"#a78bfa":"#c4b5fd"} fontSize="9" textAnchor="middle" fontWeight={f==="12"?"bold":"normal"}>{f} {f==="12"?"← Modus":""}</text>
      </g>
    ))}
  </svg>
);

const questions: Q[] = [
  Qn(1, "Median Data Ganjil – UN", {
    type: "mixed",
    diagram: <GarisMedian />,
    mathContent: "\\text{Data ganjil (n): } Me = x_{\\frac{n+1}{2}}",
    content: "Tentukan median dari data berikut:",
    parts: [
      { label: "a.", math: "\\text{Data: } 5, 8, 12, 15, 20, 25, 30 \\Rightarrow Me = x_{\\frac{7+1}{2}} = x_4 = \\ldots" },
      { label: "b.", math: "\\text{Data: } 3, 7, 9, 11, 14 \\Rightarrow Me = \\ldots" },
      { label: "c.", math: "\\text{Data: } 65, 70, 72, 75, 78, 80, 85, 88, 90 \\Rightarrow Me = \\ldots" },
    ],
  }),
  Qn(2, "Median Data Genap – ANBK", {
    type: "mixed",
    mathContent: "\\text{Data genap (n): } Me = \\frac{x_{\\frac{n}{2}} + x_{\\frac{n}{2}+1}}{2}",
    content: "Tentukan median dari data berikut:",
    parts: [
      { label: "a.", math: "\\text{Data: } 4, 6, 8, 10, 12, 14 \\Rightarrow Me = \\frac{x_3 + x_4}{2} = \\frac{8+10}{2} = \\ldots" },
      { label: "b.", math: "\\text{Data: } 70, 75, 80, 85, 90, 95 \\Rightarrow Me = \\ldots" },
      { label: "c.", math: "\\text{Data: } 5, 10, 15, 20, 25, 30, 35, 40 \\Rightarrow Me = \\ldots" },
    ],
  }),
  Qn(3, "Modus Data Tunggal – UN", {
    type: "mixed",
    diagram: <TabelModusFreq />,
    content: "Tentukan modus dari data berikut:",
    parts: [
      { label: "a.", text: "Data: 3, 5, 5, 7, 8, 8, 8, 9, 10 → Modus = ?" },
      { label: "b.", text: "Data: 6, 7, 7, 8, 8, 9, 9, 10 → Modus = ? (bimodal)" },
      { label: "c.", text: "Data: 2, 4, 6, 8, 10 → Modus = ? (tidak ada modus)" },
    ],
  }),
  Qn(4, "Median dari Tabel Frekuensi – TKA", {
    type: "mixed",
    content: "Nilai (frekuensi): 60 (2), 65 (4), 70 (8), 75 (10), 80 (6). Total n = 30.",
    parts: [
      { label: "a.", text: "Susun frekuensi kumulatif: 2, 6, 14, 24, 30." },
      { label: "b.", math: "\\frac{n}{2} = \\frac{30}{2} = 15 \\Rightarrow \\text{ data ke-15 ada di nilai 75}" },
      { label: "c.", text: "Jadi median = ?" },
    ],
  }),
  Qn(5, "Menentukan Nilai Data dari Median – UN", {
    type: "mixed",
    content: "Median dari 5 data yang sudah diurutkan adalah 8. Data tersebut: 4, 6, a, 10, 12.",
    parts: [
      { label: "a.", math: "\\text{Data sudah urut, median} = x_3 = a = 8" },
      { label: "b.", text: "Verifikasi bahwa urutan data tetap valid." },
      { label: "c.", text: "Jika data bertambah satu lagi yaitu 14, berapa median baru (n=6)?" },
    ],
  }),
  Qn(6, "Modus dan Median Bersamaan – TKA", {
    type: "mixed",
    content: "Data nilai ujian: 7, 7, 8, 8, 8, 9, 9, 10.",
    parts: [
      { label: "a.", text: "Tentukan modus dari data tersebut." },
      { label: "b.", math: "n=8 \\text{ (genap)}: Me = \\frac{x_4 + x_5}{2} = \\frac{8+8}{2} = \\ldots" },
      { label: "c.", math: "\\bar{x} = \\frac{7+7+8+8+8+9+9+10}{8} = \\ldots" },
    ],
  }),
  Qn(7, "Modus Data Tidak Bergolong – ANBK", {
    type: "mixed",
    content: "Dari hasil survei warna favorit siswa: Merah(12), Biru(18), Hijau(15), Kuning(8), Ungu(7).",
    parts: [
      { label: "a.", text: "Tentukan modus dari data tersebut." },
      { label: "b.", text: "Berapa frekuensi warna yang paling banyak dipilih?" },
      { label: "c.", text: "Apakah modus selalu satu? Beri contoh bila tidak." },
    ],
  }),
  Qn(8, "Menentukan Data Hilang dari Median – TKA", {
    type: "mixed",
    content: "Enam data yang sudah diurutkan: 5, 7, x, 10, 13, 15. Median = 9.",
    parts: [
      { label: "a.", math: "Me = \\frac{x_3 + x_4}{2} = \\frac{x + 10}{2} = 9" },
      { label: "b.", math: "x + 10 = 18 \\Rightarrow x = \\ldots" },
      { label: "c.", text: "Apakah nilai x yang diperoleh valid dalam urutan yang ada?" },
    ],
  }),
  Qn(9, "Aplikasi Modus dalam Kehidupan – TKA", {
    type: "mixed",
    content: "Seorang penjual sepatu mencatat ukuran sepatu yang terjual: 39 (5), 40 (12), 41 (20), 42 (15), 43 (8).",
    parts: [
      { label: "a.", text: "Tentukan modus ukuran sepatu yang terjual." },
      { label: "b.", text: "Mengapa modus lebih berguna dari rata-rata untuk kasus ini?" },
      { label: "c.", math: "\\bar{x} = \\frac{39(5)+40(12)+41(20)+42(15)+43(8)}{60} = \\ldots" },
    ],
  }),
  Qn(10, "Median Nilai Ujian – ANBK", {
    type: "mixed",
    content: "Nilai ujian 10 siswa (belum diurutkan): 78, 65, 92, 85, 71, 88, 76, 69, 83, 90.",
    parts: [
      { label: "a.", text: "Urutkan data dari kecil ke besar." },
      { label: "b.", math: "n=10 \\text{ (genap)}: Me = \\frac{x_5 + x_6}{2} = \\ldots" },
      { label: "c.", text: "Berapa banyak siswa yang nilainya di atas median?" },
    ],
  }),
  Qn(11, "Nilai Tengah Data – TKA", {
    type: "mixed",
    content: "Data nilai rapor 12 siswa: 68, 72, 74, 75, 76, 78, 79, 80, 82, 85, 88, 92.",
    parts: [
      { label: "a.", math: "n=12: Me = \\frac{x_6 + x_7}{2} = \\frac{78+79}{2} = \\ldots" },
      { label: "b.", text: "Berapa siswa yang nilainya berada tepat di atas median?" },
      { label: "c.", math: "\\bar{x} = \\frac{68+72+...+92}{12} = \\frac{949}{12} \\approx \\ldots" },
    ],
  }),
  Qn(12, "Soal Modus dan Median – ANBK", {
    type: "mixed",
    content: "Data berat badan (kg): 45, 48, 50, 50, 52, 55, 55, 55, 58, 60.",
    parts: [
      { label: "a.", text: "Tentukan modus dari data tersebut." },
      { label: "b.", math: "n=10: Me = \\frac{x_5+x_6}{2} = \\frac{52+55}{2} = \\ldots" },
      { label: "c.", math: "\\bar{x} = \\frac{45+48+50+50+52+55+55+55+58+60}{10} = \\ldots" },
    ],
  }),
  Qn(13, "Soal Cerita Modus – UN", {
    type: "mixed",
    content: "Dari 25 siswa yang disurvei, nilai ujian adalah:\n7 (3), 8 (7), 9 (10), 10 (5).",
    parts: [
      { label: "a.", text: "Tentukan modus nilai ujian tersebut." },
      { label: "b.", math: "Me \\text{ (n=25, ganjil)} = x_{13} = \\ldots" },
      { label: "c.", math: "\\bar{x} = \\frac{7(3)+8(7)+9(10)+10(5)}{25} = \\frac{21+56+90+50}{25} = \\ldots" },
    ],
  }),
  Qn(14, "Soal ANBK – Menentukan Data", {
    type: "mixed",
    content: "Lima data berurutan: a, 5, 8, b, 12. Median = 8 dan rata-rata = 8.",
    parts: [
      { label: "a.", text: "Dari median: data ke-3 = 8. Apakah ini konsisten?" },
      { label: "b.", math: "\\text{Rata-rata}: \\frac{a+5+8+b+12}{5} = 8 \\Rightarrow a+b = 15" },
      { label: "c.", text: "Jika a < 5, tentukan nilai a dan b." },
    ],
  }),
  Qn(15, "Soal UN – Mencari Nilai dari Modus", {
    type: "mixed",
    content: "Data: 3, 5, 7, 8, k, 8, 10, 12. Modus = 8.",
    parts: [
      { label: "a.", text: "Apakah nilai k harus = 8 agar modus = 8? Jelaskan." },
      { label: "b.", text: "Berapa nilai k yang memungkinkan selain 8 agar modus tetap 8?" },
      { label: "c.", text: "Apakah mungkin ada modus lain jika k = 5? Jelaskan." },
    ],
  }),
  Qn(16, "Soal UN – Modus dari Diagram Batang", {
    type: "mixed",
    content: "Dari diagram batang, tinggi batang masing-masing: A=8, B=12, C=20, D=15, E=5.",
    parts: [
      { label: "a.", text: "Kategori mana yang menjadi modus?" },
      { label: "b.", text: "Berapa total frekuensi semua kategori?" },
      { label: "c.", math: "\\text{Persentase kategori C} = \\frac{20}{60} \\times 100\\% = \\ldots" },
    ],
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
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · Latihan Mandiri</p>
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
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3 whitespace-pre-line">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-violet-900/20 border border-violet-500/20 rounded-lg px-4 py-3 flex justify-center overflow-x-auto"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3 overflow-x-auto">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-violet-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};
export default MedianModusPage;
