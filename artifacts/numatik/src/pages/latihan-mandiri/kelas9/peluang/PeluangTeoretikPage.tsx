import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Calculator } from "lucide-react";

const FreqTable = ({ headers, rows, caption }: { headers: string[]; rows: (string | number)[][]; caption?: string }) => (
  <div className="overflow-x-auto rounded-xl border border-violet-500/30 my-2">
    {caption && <div className="text-[10px] text-violet-300/70 font-bold text-center pt-2 px-2">{caption}</div>}
    <table className="min-w-full text-xs font-body">
      <thead>
        <tr className="bg-violet-900/40">
          {headers.map((h, i) => <th key={i} className="px-3 py-2 text-violet-200 font-bold text-center border-b border-violet-500/30">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? "bg-white/3" : "bg-violet-900/10"}>
            {row.map((cell, ci) => <td key={ci} className="px-3 py-2 text-center text-white/80 border-b border-white/5">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const renderOpt = (opt: string) => {
  if (opt.includes('\\')) return <InlineMath math={opt} />;
  return <>{opt}</>;
};

type MCQ = { n: number; title: string; content: string; diagram?: React.ReactNode; options: string[]; answer: number };

const questions: MCQ[] = [
  {
    n: 1, title: "Peluang – Dadu Angka Prima",
    content: "Sebuah dadu dilempar sekali. Peluang muncul angka prima adalah ...",
    options: ["\\frac{1}{6}", "\\frac{1}{2}", "\\frac{2}{3}", "\\frac{1}{3}"],
    answer: 1,
  },
  {
    n: 2, title: "Peluang – Dua Koin Bersamaan",
    content: "Dua koin dilempar bersamaan. Peluang muncul tepat satu sisi Angka adalah ...",
    options: ["\\frac{1}{4}", "\\frac{1}{2}", "\\frac{3}{4}", "\\frac{1}{3}"],
    answer: 1,
  },
  {
    n: 3, title: "Peluang – Dua Dadu, Jumlah 7",
    content: "Dua dadu dilempar bersamaan. Peluang jumlah kedua dadu sama dengan 7 adalah ...",
    options: ["\\frac{5}{36}", "\\frac{1}{6}", "\\frac{7}{36}", "\\frac{1}{9}"],
    answer: 1,
  },
  {
    n: 4, title: "Peluang Kartu – As dari Remi",
    content: "Satu kartu diambil secara acak dari 52 kartu remi. Peluang terambilnya kartu As adalah ...",
    options: ["\\frac{1}{52}", "\\frac{1}{26}", "\\frac{1}{13}", "\\frac{4}{13}"],
    answer: 2,
  },
  {
    n: 5, title: "Peluang Kartu – Kartu Merah",
    content: "Satu kartu diambil secara acak dari 52 kartu remi. Peluang terambilnya kartu merah adalah ...",
    options: ["\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}"],
    answer: 2,
  },
  {
    n: 6, title: "Peluang – Bola dalam Kantong",
    content: "Sebuah kantong berisi 6 bola merah, 4 bola biru, dan 2 bola kuning. Satu bola diambil secara acak. Peluang terambilnya bola biru adalah ...",
    options: ["\\frac{1}{6}", "\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}"],
    answer: 2,
  },
  {
    n: 7, title: "Peluang – Kartu Bernomor 1–20",
    content: "Kartu bernomor 1 sampai 20 disimpan dalam kotak. Satu kartu diambil secara acak. Peluang terambilnya kartu bernomor prima adalah ...",
    options: ["\\frac{7}{20}", "\\frac{2}{5}", "\\frac{9}{20}", "\\frac{3}{10}"],
    answer: 1,
  },
  {
    n: 8, title: "Peluang – Kelereng Campuran",
    content: "Sebuah kotak berisi 5 kelereng merah, 3 putih, 7 hijau, dan 5 hitam. Satu kelereng diambil acak. Peluang terambilnya kelereng Merah atau Hitam adalah ...",
    options: ["\\frac{9}{20}", "\\frac{1}{2}", "\\frac{11}{20}", "\\frac{7}{20}"],
    answer: 1,
  },
  {
    n: 9, title: "Peluang – Dua Dadu, Hasil Kali 12",
    content: "Dua dadu dilempar bersamaan. Peluang hasil kali kedua dadu sama dengan 12 adalah ...",
    options: ["\\frac{1}{12}", "\\frac{1}{9}", "\\frac{5}{36}", "\\frac{1}{6}"],
    answer: 1,
  },
  {
    n: 10, title: "Peluang – Kartu As Merah",
    content: "Satu kartu diambil dari 52 kartu remi. Peluang terambilnya kartu As Merah adalah ...",
    options: ["\\frac{1}{52}", "\\frac{1}{26}", "\\frac{1}{13}", "\\frac{2}{13}"],
    answer: 1,
  },
  {
    n: 11, title: "Peluang – Huruf A dari MATEMATIKA",
    content: "Jika dipilih satu huruf dari kata M A T E M A T I K A (10 huruf), huruf A muncul sebanyak 3 kali. Maka peluang yang terpilih huruf A adalah ...",
    options: ["\\frac{1}{6}", "\\frac{1}{5}", "\\frac{1}{4}", "\\frac{3}{10}"],
    answer: 3,
  },
  {
    n: 12, title: "Peluang – Seleksi Pegawai (Tes Akademik & Fisik)",
    content: "Pada seleksi pegawai, 25 orang lulus tes akademik, 20 orang lulus tes fisik, dan 15 orang lulus keduanya. Peluang terpanggil peserta yang hanya lulus tes fisik adalah ...",
    options: ["\\frac{5}{6}", "\\frac{2}{3}", "\\frac{1}{2}", "\\frac{1}{6}"],
    answer: 3,
  },
  {
    n: 13, title: "Peluang – Tiga Koin, Dua Angka Satu Gambar",
    content: "Tiga mata uang dilempar bersama-sama. Peluang munculnya dua angka dan satu gambar adalah ...",
    options: ["\\frac{3}{4}", "\\frac{2}{4}", "\\frac{3}{8}", "\\frac{2}{8}"],
    answer: 2,
  },
  {
    n: 14, title: "Peluang – Tiga Koin, Minimal 2 Angka",
    content: "Dalam percobaan melempar 3 uang logam secara bersamaan, ruang sampel terdiri dari 8 titik. Peluang muncul minimal 2 angka adalah ...",
    options: ["0,375", "0,500", "0,667", "0,875"],
    answer: 1,
  },
  {
    n: 15, title: "Peluang – Permen Warna Merah (Grafik)",
    content: "Roni mengambil 1 permen secara acak dari kantong. Banyaknya permen tiap warna ditunjukkan pada grafik berikut. Berapa peluang Roni mengambil permen warna merah?",
    diagram: (
      <div className="my-2 flex justify-center">
        <svg viewBox="0 0 320 210" width="100%" style={{ maxWidth: 320 }} aria-label="Grafik jumlah permen per warna">
          {/* Background */}
          <rect x="0" y="0" width="320" height="210" rx="10" fill="rgba(109,40,217,0.08)" stroke="rgba(139,92,246,0.25)" strokeWidth="1" />
          {/* Title */}
          <text x="160" y="18" textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(196,181,253,0.9)" fontFamily="sans-serif">Banyaknya Permen per Warna</text>
          {/* Grid lines — only at actual bar values: 6, 7, 8, 9 */}
          {[6, 7, 8, 9].map((v) => {
            const y = 165 - v * 14;
            return (
              <g key={v}>
                <line x1="45" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" />
                <text x="40" y={y + 3.5} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.55)" fontFamily="sans-serif">{v}</text>
              </g>
            );
          })}
          {/* Baseline 0 */}
          <text x="40" y="168.5" textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.55)" fontFamily="sans-serif">0</text>
          {/* Y-axis */}
          <line x1="45" y1="39" x2="45" y2="165" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {/* X-axis */}
          <line x1="45" y1="165" x2="300" y2="165" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* Bars: Merah=6, Biru=9, Kuning=8, Hijau=7  (total=30) */}
          {/* Bar: Merah */}
          <rect x="60" y={165 - 6*14} width="42" height={6*14} rx="3" fill="#ef4444" fillOpacity="0.85" />
          <text x="81" y={165 - 6*14 - 4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fca5a5" fontFamily="sans-serif">6</text>
          <text x="81" y="178" textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">Merah</text>
          <rect x="60" y={165 - 6*14} width="42" height={6*14} rx="3" fill="url(#gradMerah)" />

          {/* Bar: Biru */}
          <rect x="118" y={165 - 9*14} width="42" height={9*14} rx="3" fill="#3b82f6" fillOpacity="0.85" />
          <text x="139" y={165 - 9*14 - 4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#93c5fd" fontFamily="sans-serif">9</text>
          <text x="139" y="178" textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">Biru</text>

          {/* Bar: Kuning */}
          <rect x="176" y={165 - 8*14} width="42" height={8*14} rx="3" fill="#eab308" fillOpacity="0.85" />
          <text x="197" y={165 - 8*14 - 4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fde047" fontFamily="sans-serif">8</text>
          <text x="197" y="178" textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">Kuning</text>

          {/* Bar: Hijau */}
          <rect x="234" y={165 - 7*14} width="42" height={7*14} rx="3" fill="#22c55e" fillOpacity="0.85" />
          <text x="255" y={165 - 7*14 - 4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#86efac" fontFamily="sans-serif">7</text>
          <text x="255" y="178" textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">Hijau</text>

          {/* Y-axis label */}
          <text x="12" y="100" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif" transform="rotate(-90,12,100)">Jumlah</text>

        </svg>
      </div>
    ),
    options: ["10\\%", "20\\%", "25\\%", "50\\%"],
    answer: 1,
  },
];

const OPTS = ["A", "B", "C", "D"];

const PeluangTeoretikPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleSelect = (qn: number, idx: number) => { if (revealed[qn]) return; setSelected(s => ({ ...s, [qn]: idx })); };
  const handleReveal = (qn: number) => { setRevealed(r => ({ ...r, [qn]: true })); };

  const score = questions.filter(q => revealed[q.n] && selected[q.n] === q.answer).length;
  const totalRevealed = Object.keys(revealed).length;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <Calculator className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1" style={{ textShadow: "0 0 20px rgba(167,139,250,0.7)" }}>
            PELUANG TEORETIK
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Peluang · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 {questions.length} {t('practice.suffixSoal')} {t('practice.multipleChoice')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
          {totalRevealed > 0 && (
            <div className="mt-2 bg-violet-900/30 border border-violet-500/30 rounded-lg px-4 py-1.5 text-xs font-body text-violet-300">
              Skor: {score} / {totalRevealed} soal dijawab
            </div>
          )}
        </div>
        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-2">📌 Rumus Utama</p>
          <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
            <BlockMath math="P(A) = \frac{n(A)}{n(S)}, \quad 0 \leq P(A) \leq 1" />
          </div>
        </div>
        <div className="flex flex-col gap-5 animate-slide-up">
          {questions.map((q, qi) => {
            const sel = selected[q.n];
            const isRevealed = revealed[q.n];
            const hasSel = sel !== undefined;
            return (
              <div key={q.n} className="relative rounded-2xl overflow-hidden" style={{ animationDelay: `${qi * 0.02}s` }}>
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
                      {q.diagram && <div className="mb-3">{q.diagram}</div>}
                      <p className="font-body text-sm text-white/90 leading-relaxed mb-4">{q.content}</p>
                      <div className="flex flex-col gap-2">
                        {q.options.map((opt, oi) => {
                          let cls = "bg-white/5 border border-white/10 text-white/80";
                          if (isRevealed) {
                            if (oi === q.answer) cls = "bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 font-bold";
                            else if (oi === sel) cls = "bg-red-500/20 border border-red-400/60 text-red-300";
                            else cls = "bg-white/3 border border-white/5 text-white/40";
                          } else if (hasSel && oi === sel) {
                            cls = "bg-violet-500/25 border border-violet-400/60 text-violet-200";
                          }
                          return (
                            <button key={oi} onClick={() => handleSelect(q.n, oi)}
                              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-all duration-200 ${cls} ${!isRevealed ? "cursor-pointer hover:border-violet-400/40" : "cursor-default"}`}>
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${isRevealed && oi === q.answer ? "bg-emerald-500/30 border-emerald-400" : isRevealed && oi === sel ? "bg-red-500/30 border-red-400" : hasSel && oi === sel ? "bg-violet-500/30 border-violet-400" : "bg-white/10 border-white/20"}`}>
                                {OPTS[oi]}
                              </span>
                              <span className="font-body text-sm overflow-x-auto">{renderOpt(opt)}</span>
                              {isRevealed && oi === q.answer && <span className="ml-auto text-emerald-400 text-xs font-bold shrink-0">✓ Benar</span>}
                              {isRevealed && oi === sel && oi !== q.answer && <span className="ml-auto text-red-400 text-xs font-bold shrink-0">✗ Salah</span>}
                            </button>
                          );
                        })}
                      </div>
                      {hasSel && !isRevealed && (
                        <button onClick={() => handleReveal(q.n)}
                          className="mt-3 text-xs bg-violet-500/20 hover:bg-violet-500/30 border border-violet-400/40 text-violet-300 rounded-lg px-4 py-1.5 transition-colors font-body cursor-pointer">
                          Cek Jawaban
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/peluang"); }}
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Peluang
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeluangTeoretikPage;
