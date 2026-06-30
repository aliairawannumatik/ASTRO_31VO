import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { LineChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const pageUi = {
  id: { title: "PENYELESAIAN SPLDV — METODE GRAFIK" },
  en: { title: "SOLVING SLETV — GRAPHICAL METHOD" },
  ja: { title: "連立方程式 — グラフ法" },
};

const accentColor = "#34d399";
const accentDim = "rgba(52,211,153,0.12)";
const borderColor = "rgba(52,211,153,0.25)";

type Part = { label: string; math?: string; text?: string };
type Badge = "UN" | "ANBK" | "TKA" | "AKM";
type Q = {
  n: number; title: string;
  content?: string; math?: string; blockMath?: string;
  parts?: Part[];
  badge?: Badge;
  type: "essay" | "mixed";
};

const badgeStyle: Record<Badge, string> = {
  UN: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
  ANBK: "bg-blue-500/20 text-blue-300 border-blue-400/40",
  TKA: "bg-orange-500/20 text-orange-300 border-orange-400/40",
  AKM: "bg-green-500/20 text-green-300 border-green-400/40",
};

const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Membuat Tabel Nilai — Garis Pertama", {
    badge: "ANBK", type: "mixed",
    content: "Diketahui persamaan garis pertama:",
    blockMath: "x + y = 6",
    parts: [
      { label: "a.", text: "Buat tabel nilai: pilih x = 0, 2, 6 lalu hitung y masing-masing." },
      { label: "b.", text: "Tentukan titik potong dengan sumbu-x (y = 0) dan sumbu-y (x = 0)." },
      { label: "c.", text: "Gambarkan garis tersebut pada bidang koordinat." },
    ],
  }),
  Q(2, "Tabel Nilai Garis Kedua", {
    badge: "UN", type: "mixed",
    content: "Diketahui persamaan garis kedua:",
    blockMath: "x - y = 2",
    parts: [
      { label: "a.", text: "Buat tabel nilai untuk x = 0, 2, 4." },
      { label: "b.", text: "Tentukan dua titik pada garis dan gambarkan." },
      { label: "c.", text: "Apakah titik (3, 1) terletak pada garis ini? Verifikasi!" },
    ],
  }),
  Q(3, "Garis Berimpit — Tak Hingga Solusi", {
    badge: "AKM", type: "mixed",
    content: "Perhatikan sistem:",
    blockMath: "\\begin{cases} 2x + 4y = 8 \\\\ x + 2y = 4 \\end{cases}",
    parts: [
      { label: "a.", text: "Tunjukkan bahwa kedua garis ini sebenarnya sama (berimpit)." },
      { label: "b.", text: "Apa artinya secara grafis jika dua garis berimpit?" },
      { label: "c.", text: "Berapa banyak solusi yang dimiliki sistem ini?" },
    ],
  }),
  Q(4, "Metode Grafik — Langkah Demi Langkah", {
    badge: "UN", type: "mixed",
    blockMath: "\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}",
    parts: [
      { label: "Langkah 1:", text: "Tentukan dua titik pada garis pertama." },
      { label: "Langkah 2:", text: "Tentukan dua titik pada garis kedua." },
      { label: "Langkah 3:", text: "Gambarkan kedua garis dan tentukan titik perpotongannya." },
      { label: "Langkah 4:", text: "Verifikasi titik perpotongan di kedua persamaan." },
    ],
  }),
  Q(5, "Titik Potong Sumbu", {
    badge: "TKA", type: "mixed",
    content: "Untuk setiap garis berikut, tentukan titik potong dengan sumbu-x dan sumbu-y:",
    parts: [
      { label: "a.", math: "2x + 3y = 12" },
      { label: "b.", math: "4x - 2y = 8" },
      { label: "c.", math: "x + 5y = 10" },
      { label: "d.", math: "3x - y = 9" },
    ],
  }),
  Q(6, "Menentukan Persamaan dari Grafik", {
    badge: "ANBK", type: "mixed",
    content: "Sebuah garis melewati titik-titik berikut. Tentukan persamaan garisnya:",
    parts: [
      { label: "a.", text: "Titik (0, 3) dan (6, 0)" },
      { label: "b.", text: "Titik (0, -4) dan (2, 0)" },
      { label: "c.", text: "Titik (1, 5) dan (3, 1)" },
    ],
  }),
  Q(7, "Mencari Himpunan Penyelesaian — Grafik", {
    badge: "UN", type: "mixed",
    blockMath: "\\begin{cases} 2x + y = 7 \\\\ x + 2y = 8 \\end{cases}",
    parts: [
      { label: "a.", text: "Tentukan titik potong sumbu masing-masing garis." },
      { label: "b.", text: "Gambarkan dan tentukan titik perpotongan secara grafis." },
      { label: "c.", text: "Verifikasi titik potong dengan substitusi ke kedua persamaan." },
    ],
  }),
  Q(8, "Persamaan Vertikal dalam Grafik", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} x = 3 \\\\ 2x + y = 10 \\end{cases}",
    parts: [
      { label: "a.", text: "Apa bentuk grafik dari persamaan x = 3?" },
      { label: "b.", text: "Substitusikan x = 3 ke persamaan kedua untuk mencari y." },
      { label: "c.", text: "Tuliskan HP = {(x, y)}." },
    ],
  }),
  Q(9, "Grafik Tiga Garis", {
    badge: "AKM", type: "mixed",
    content: "Diketahui tiga persamaan. Tentukan titik potong dari setiap pasang garis:",
    parts: [
      { label: "(i)", math: "x + y = 6" },
      { label: "(ii)", math: "x - y = 2" },
      { label: "(iii)", math: "2x + y = 9" },
      { label: "a.", text: "Titik potong garis (i) dan (ii)." },
      { label: "b.", text: "Titik potong garis (i) dan (iii)." },
      { label: "c.", text: "Apakah ketiga garis bertemu di satu titik?" },
    ],
  }),
  Q(10, "Mencari Solusi Grafik Lengkap", {
    badge: "UN", type: "mixed",
    blockMath: "\\begin{cases} 3x - y = 5 \\\\ x + y = 7 \\end{cases}",
    parts: [
      { label: "a.", text: "Tentukan dua titik untuk setiap garis." },
      { label: "b.", text: "Gambarkan kedua garis." },
      { label: "c.", text: "Baca koordinat titik perpotongan dari grafik." },
      { label: "d.", text: "Verifikasi solusi secara aljabar." },
    ],
  }),
  Q(11, "Nilai Titik Potong", {
    badge: "ANBK", type: "mixed",
    content: "Dua garis berpotongan di titik (2, 5). Garis pertama melewati (0, 1) dan (2, 5). Garis kedua melewati (0, 9) dan (2, 5).",
    parts: [
      { label: "a.", text: "Tentukan persamaan garis pertama." },
      { label: "b.", text: "Tentukan persamaan garis kedua." },
      { label: "c.", text: "Tuliskan SPLDV yang penyelesaiannya adalah (2, 5)." },
    ],
  }),
  Q(12, "Titik Potong dan Konteks", {
    badge: "AKM", type: "mixed",
    content: "Dua penjual: Penjual A menjual x buah jeruk dengan harga total y = 3.000x. Penjual B menjual dengan harga y = 2.000x + 10.000.",
    parts: [
      { label: "a.", text: "Pada berapa buah jeruk harga keduanya sama?" },
      { label: "b.", text: "Tentukan secara grafis dengan membuat tabel nilai." },
      { label: "c.", text: "Verifikasi secara aljabar." },
    ],
  }),
  Q(13, "SPLDV Dengan Desimal", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 0.5x + y = 4 \\\\ x - 0.5y = 3 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan setiap persamaan dengan 2 untuk menghilangkan desimal." },
      { label: "b.", text: "Tentukan titik potong sumbu untuk setiap garis." },
      { label: "c.", text: "Tentukan solusi secara grafis atau aljabar." },
    ],
  }),
  Q(14, "SPLDV Garis Berpotongan di Asal", {
    badge: "ANBK", type: "mixed",
    blockMath: "\\begin{cases} y = 2x \\\\ y = -x + 6 \\end{cases}",
    parts: [
      { label: "a.", text: "Buat tabel nilai untuk y = 2x (x = 0, 1, 2)." },
      { label: "b.", text: "Buat tabel nilai untuk y = -x + 6 (x = 0, 3, 6)." },
      { label: "c.", text: "Tentukan titik perpotongan." },
    ],
  }),
  Q(15, "Kasus Khusus — Garis Berimpit", {
    badge: "AKM", type: "mixed",
    content: "Perhatikan SPLDV:",
    blockMath: "\\begin{cases} 3x - y = 4 \\\\ 6x - 2y = 8 \\end{cases}",
    parts: [
      { label: "a.", text: "Tunjukkan bahwa persamaan kedua adalah kelipatan dari persamaan pertama." },
      { label: "b.", text: "Apa yang terjadi jika digambar pada grafik?" },
      { label: "c.", text: "Berapa banyak solusinya? Jelaskan!" },
    ],
  }),
  Q(16, "Baca Grafik — Pasangan Nilai", {
    badge: "UN", type: "mixed",
    content: "Dari grafik SPLDV berikut (dijelaskan secara deskriptif):",
    parts: [
      { label: "Garis 1:", text: "Memotong sumbu-x di (4, 0) dan sumbu-y di (0, 2)." },
      { label: "Garis 2:", text: "Memotong sumbu-x di (6, 0) dan sumbu-y di (0, 6)." },
      { label: "a.", text: "Tuliskan persamaan garis 1." },
      { label: "b.", text: "Tuliskan persamaan garis 2." },
      { label: "c.", text: "Tentukan titik perpotongan (solusi SPLDV)." },
    ],
  }),
  Q(17, "Menentukan Solusi Grafik", {
    badge: "UN", type: "mixed",
    blockMath: "\\begin{cases} 4x + 2y = 16 \\\\ x - y = -1 \\end{cases}",
    parts: [
      { label: "a.", text: "Tentukan titik potong sumbu untuk setiap garis." },
      { label: "b.", text: "Gambarkan dan baca titik potongnya." },
      { label: "c.", text: "Selesaikan secara aljabar dan bandingkan hasilnya." },
    ],
  }),
  Q(18, "Aplikasi Grafik — Masalah Ekonomi", {
    badge: "AKM", type: "mixed",
    content: "Biaya produksi: C = 500x + 2.000 (ribu rupiah). Pendapatan: R = 1.000x (ribu rupiah). x = jumlah unit produksi.",
    parts: [
      { label: "a.", text: "Buat tabel nilai untuk C dan R (x = 0, 2, 4, 6, 8)." },
      { label: "b.", text: "Pada nilai x berapa C = R (titik impas/BEP)?" },
      { label: "c.", text: "Verifikasi secara aljabar." },
    ],
  }),
  Q(19, "Koordinat Perpotongan", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} 5x - 3y = 1 \\\\ 2x + y = 8 \\end{cases}",
    parts: [
      { label: "a.", text: "Tentukan dua titik pada setiap garis." },
      { label: "b.", text: "Sketsa grafik dan baca titik perpotongan." },
      { label: "c.", text: "Verifikasi dengan substitusi." },
    ],
  }),
  Q(20, "Titik Potong — ANBK", {
    badge: "ANBK", type: "mixed",
    content: "Tentukan pernyataan BENAR (B) atau SALAH (S) tentang metode grafik:",
    parts: [
      { label: "(1)", text: "Titik perpotongan dua garis pada grafik SPLDV adalah solusi sistem tersebut." },
      { label: "(2)", text: "Jika dua garis sejajar, mereka tidak berpotongan sehingga SPLDV tidak punya solusi." },
      { label: "(3)", text: "Metode grafik selalu memberikan solusi yang tepat (eksak)." },
      { label: "(4)", text: "Dua garis yang berimpit memiliki tak berhingga banyaknya titik potong." },
    ],
  }),
  Q(21, "Grafik Pecahan", {
    badge: "TKA", type: "mixed",
    blockMath: "\\begin{cases} \\frac{x}{3} + \\frac{y}{2} = 2 \\\\ x - y = 1 \\end{cases}",
    parts: [
      { label: "a.", text: "Kalikan persamaan pertama dengan 6 untuk menghilangkan pecahan." },
      { label: "b.", text: "Tentukan titik potong sumbu untuk kedua garis." },
      { label: "c.", text: "Tentukan solusi SPLDV secara grafis dan verifikasi secara aljabar." },
    ],
  }),
];

const MetodeGrafikPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const pu = pageUi[language as keyof typeof pageUi] ?? pageUi.id;
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: accentDim, border: `1.5px solid ${borderColor}` }}>
            <LineChart className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}88` }}>
            {pu.title}
          </h1>
          <p className="text-white/40 text-xs font-body text-center">Kelas 8 · {t('practice.breadcrumb')} · 21 Soal</p>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {(["UN","ANBK","TKA","AKM"] as Badge[]).map(b => (
              <span key={b} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle[b]}`}>{b}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl overflow-hidden border"
              style={{ background: accentDim, borderColor }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b"
                style={{ borderColor, background: "rgba(52,211,153,0.08)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: accentColor + "30", color: accentColor }}>
                  {q.n}
                </div>
                <span className="font-display text-sm font-bold" style={{ color: accentColor }}>{q.title}</span>
                {q.badge && (
                  <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badgeStyle[q.badge]}`}>
                    {q.badge}
                  </span>
                )}
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.content && <p className="font-body text-sm text-white/85 leading-relaxed">{q.content}</p>}
                {q.math && <div className="text-white/90 text-sm"><InlineMath math={q.math} /></div>}
                {q.blockMath && (
                  <div className="rounded-xl px-4 py-3 text-white/90 overflow-x-auto"
                    style={{ background: "rgba(52,211,153,0.08)", border: `1px solid ${borderColor}` }}>
                    <BlockMath math={q.blockMath} />
                  </div>
                )}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1">
                    {q.parts.map((p, pi) => (
                      <div key={pi} className="flex items-start gap-2">
                        <span className="font-bold text-xs shrink-0 mt-0.5" style={{ color: accentColor }}>{p.label}</span>
                        <span className="font-body text-sm text-white/80 leading-relaxed">
                          {p.text && p.text}
                          {p.math && <InlineMath math={p.math} />}
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

export default MetodeGrafikPage;
