import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Shuffle } from "lucide-react";

const accentColor = "#f472b6";
const accentDim = "rgba(244,114,182,0.12)";
const borderColor = "rgba(244,114,182,0.25)";

type Part = { label: string; math?: string; text?: string };
type Badge = "UN" | "ANBK" | "TKA" | "AKM";
type Q = { n: number; title: string; content?: string; math?: string; blockMath?: string; parts?: Part[]; badge?: Badge; type: "essay" | "mixed"; };
const badgeStyle: Record<Badge, string> = {
  UN: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
  ANBK: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  TKA: "bg-orange-500/20 text-orange-300 border-orange-400/40",
  AKM: "bg-green-500/20 text-green-300 border-green-400/40",
};
const Qf = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qf(1, "Langkah Metode Campuran", {
    badge: "ANBK", type: "mixed",
    content: "Metode campuran menggabungkan eliminasi (untuk menghilangkan satu variabel) dan substitusi (untuk mencari variabel yang lain).",
    blockMath: "\\begin{cases} 3x + 2y = 16 \\\\ 2x - y = 6 \\end{cases}",
    parts: [
      { label: "Langkah 1:", text: "Eliminasi y: kalikan pers. kedua × 2, lalu jumlahkan." },
      { label: "Langkah 2:", text: "Dari nilai x, substitusikan ke salah satu persamaan untuk mencari y." },
      { label: "Langkah 3:", text: "Tulis HP dan verifikasi." },
    ],
  }),
  Qf(2, "Campuran — Eliminasi dulu", {
    badge: "UN", type: "mixed",
    blockMath: "\\begin{cases} x + 3y = 10 \\\\ 4x - y = 15 \\end{cases}",
    parts: [
      { label: "a.", text: "Eliminasi x (kalikan pers. pertama × 4, lalu kurangkan)." },
      { label: "b.", text: "Dari nilai y, substitusikan ke pers. pertama untuk cari x." },
      { label: "c.", text: "Verifikasi di pers. kedua." },
    ],
  }),
  Qf(3, "Soal Bilangan — Metode Campuran", {
    badge: "UN", type: "mixed",
    content: "Jumlah dua bilangan adalah 45. Dua kali bilangan pertama dikurangi bilangan kedua sama dengan 30.",
    parts: [
      { label: "a.", text: "Misal bilangan pertama = x dan kedua = y. Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan metode campuran." },
      { label: "c.", text: "Tentukan kedua bilangan." },
    ],
  }),
  Qf(4, "Koefisien Besar — Campuran", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 7x + 4y = 41 \\\\ 3x - 2y = 7 \\end{cases}",
    parts: [
      { label: "a.", text: "Eliminasi y (kalikan pers. kedua × 2, jumlahkan)." },
      { label: "b.", text: "Substitusikan nilai x ke pers. kedua untuk cari y." },
    ],
  }),
  Qf(5, "Campuran — Koefisien Negatif", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} 2x - 5y = -3 \\\\ 3x + y = 14 \\end{cases}",
    parts: [
      { label: "a.", text: "Eliminasi y: kalikan pers. kedua × 5, lalu jumlahkan." },
      { label: "b.", text: "Substitusikan x ke pers. kedua untuk cari y." },
    ],
  }),
  Qf(6, "Soal Harga — UN Klasik", {
    badge: "UN", type: "mixed",
    content: "Harga 4 apel dan 5 mangga = Rp 47.000. Harga 2 apel dan 3 mangga = Rp 27.000.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV (apel = x, mangga = y)." },
      { label: "b.", text: "Selesaikan dengan metode campuran." },
      { label: "c.", text: "Berapa harga 1 apel dan 1 mangga?" },
    ],
  }),
  Qf(7, "Campuran — Tiga Langkah", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 6x - y = 20 \\\\ x + 2y = 10 \\end{cases}",
    parts: [
      { label: "a.", text: "Nyatakan y dari pers. pertama: y = 6x − 20 (substitusi)." },
      { label: "b.", text: "Substitusikan ke pers. kedua." },
      { label: "c.", text: "Tentukan x, lalu y. Verifikasi." },
    ],
  }),
  Qf(8, "Pecahan — Campuran", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} \\frac{x}{2} + y = 7 \\\\ 2x - 3y = 4 \\end{cases}",
    parts: [
      { label: "a.", text: "Nyatakan x dari pers. pertama: x = 2(7 − y) = 14 − 2y." },
      { label: "b.", text: "Substitusikan ke pers. kedua dan selesaikan." },
    ],
  }),
  Qf(9, "Campuran — Soal Campuran Kontekstual", {
    badge: "AKM", type: "mixed",
    content: "Sebuah parkiran menampung sepeda motor dan mobil. Jumlah kendaraan = 50. Jumlah roda = 136. (Motor = 2 roda, Mobil = 4 roda)",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV (motor = x, mobil = y)." },
      { label: "b.", text: "Selesaikan dengan campuran." },
      { label: "c.", text: "Berapa jumlah motor dan mobil?" },
    ],
  }),
  Qf(10, "Campuran — Hasil Negatif", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} x - 4y = -10 \\\\ 3x + 2y = 2 \\end{cases}",
    parts: [
      { label: "a.", text: "Eliminasi y (kalikan pers. pertama × 2, pinjam tanda)." },
      { label: "b.", text: "Tentukan x, lalu substitusikan untuk cari y." },
    ],
  }),
  Qf(11, "Langkah Eliminasi Pilihan", {
    badge: "UN", type: "mixed",
    blockMath: "\\begin{cases} 4x + 3y = 23 \\\\ 5x - 6y = 1 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan pers. pertama × 2 agar koefisien y berlawanan." },
      { label: "b.", text: "Jumlahkan dengan pers. kedua untuk hilangkan y." },
      { label: "c.", text: "Substitusikan x untuk cari y." },
    ],
  }),
  Qf(12, "Soal Beli Online", {
    badge: "AKM", type: "mixed",
    content: "Hani membeli 3 buku A dan 2 buku B seharga Rp 78.000. Dani membeli 1 buku A dan 4 buku B seharga Rp 74.000.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan campuran." },
      { label: "c.", text: "Berapa harga masing-masing buku?" },
    ],
  }),
  Qf(13, "Campuran — Soal Standar UN", {
    badge: "UN", type: "mixed",
    blockMath: "\\begin{cases} 8x + 3y = 40 \\\\ 4x - y = 12 \\end{cases}",
    parts: [
      { label: "a.", text: "Eliminasi y (kalikan pers. kedua × 3, jumlahkan)." },
      { label: "b.", text: "Tentukan x." },
      { label: "c.", text: "Substitusikan untuk cari y." },
    ],
  }),
  Qf(14, "Campuran — Hasil HP", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} 5x - 3y = 7 \\\\ 2x + 5y = 19 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan pers. pertama × 5 dan pers. kedua × 3." },
      { label: "b.", text: "Jumlahkan untuk menghilangkan y." },
      { label: "c.", text: "Tentukan x dan y." },
    ],
  }),
  Qf(15, "Rekap — Metode Campuran vs Lainnya", {
    badge: "AKM", type: "mixed",
    content: "Jelaskan keunggulan metode campuran dibanding metode grafik, substitusi, atau eliminasi saja:",
    parts: [
      { label: "a.", text: "Kapan metode campuran lebih efisien dari substitusi saja?" },
      { label: "b.", text: "Kapan metode campuran lebih efisien dari eliminasi saja?" },
      { label: "c.", text: "Berikan contoh SPLDV yang paling mudah diselesaikan dengan campuran." },
    ],
  }),
  Qf(16, "Soal {t('practice.multipleChoice')} — UN", {
    badge: "UN", type: "mixed",
    content: "Penyelesaian dari SPLDV dengan campuran:",
    blockMath: "\\begin{cases} 4x + y = 14 \\\\ 2x - 3y = 0 \\end{cases}",
    parts: [
      { label: "A.", math: "(3,\\ 2)" },
      { label: "B.", math: "(2,\\ 6)" },
      { label: "C.", math: "(3,\\ 2)" },
      { label: "D.", math: "(4,\\ -2)" },
    ],
  }),
  Qf(17, "Campuran — Soal Panjang", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 11x + 7y = 68 \\\\ 3x - 5y = -6 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan pers. pertama × 5 dan pers. kedua × 7." },
      { label: "b.", text: "Jumlahkan untuk hilangkan y." },
      { label: "c.", text: "Tentukan x, lalu y." },
    ],
  }),
  Qf(18, "Campuran — Ubah Persamaan", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} 2(x+y) = 3x + 4 \\\\ 3x - 2y = 6 \\end{cases}",
    parts: [
      { label: "a.", text: "Sederhanakan persamaan pertama terlebih dahulu." },
      { label: "b.", text: "Selesaikan SPLDV yang sudah disederhanakan dengan campuran." },
    ],
  }),
  Qf(19, "ANBK — Pernyataan B/S", {
    badge: "ANBK", type: "mixed",
    content: "Tentukan BENAR (B) atau SALAH (S):",
    parts: [
      { label: "(1)", text: "Metode campuran menggunakan eliminasi untuk mendapat nilai satu variabel, lalu substitusi untuk variabel lainnya." },
      { label: "(2)", text: "Metode campuran selalu lebih cepat dari eliminasi murni." },
      { label: "(3)", text: "Dalam metode campuran, urutan (eliminasi dulu atau substitusi dulu) tidak mempengaruhi hasil." },
      { label: "(4)", text: "Metode campuran tidak bisa digunakan jika koefisiennya pecahan." },
    ],
  }),
];

const MetodeCampuranPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: accentDim, border: `1.5px solid ${borderColor}` }}>
            <Shuffle className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}88` }}>
            PENYELESAIAN SPLDV — METODE CAMPURAN
          </h1>
          <p className="text-white/40 text-xs font-body text-center">Kelas 8 · {t('practice.breadcrumb')} · 19 Soal</p>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {(["UN","ANBK","TKA","AKM"] as Badge[]).map(b => (
              <span key={b} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle[b]}`}>{b}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl overflow-hidden border" style={{ background: accentDim, borderColor }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor, background: "rgba(244,114,182,0.08)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: accentColor + "30", color: accentColor }}>{q.n}</div>
                <span className="font-display text-sm font-bold" style={{ color: accentColor }}>{q.title}</span>
                {q.badge && <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle[q.badge]}`}>{q.badge}</span>}
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.content && <p className="font-body text-sm text-white/85 leading-relaxed">{q.content}</p>}
                {q.math && <div className="text-white/90 text-sm"><InlineMath math={q.math} /></div>}
                {q.blockMath && (
                  <div className="rounded-xl px-4 py-3 text-white/90 overflow-x-auto"
                    style={{ background: "rgba(244,114,182,0.08)", border: `1px solid ${borderColor}` }}>
                    <BlockMath math={q.blockMath} />
                  </div>
                )}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1">
                    {q.parts.map((p, pi) => (
                      <div key={pi} className="flex items-start gap-2">
                        <span className="font-bold text-xs shrink-0 mt-0.5" style={{ color: accentColor }}>{p.label}</span>
                        <span className="font-body text-sm text-white/80 leading-relaxed">
                          {p.text && p.text}{p.math && <InlineMath math={p.math} />}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/spldv"); }}
            className="text-sm text-white/40 hover:text-white/80 transition-colors cursor-pointer font-body">
            ← {t('practice.backToMenu')} SPLDV
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetodeCampuranPage;
