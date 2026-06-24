import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Layers } from "lucide-react";

const accentColor = "#a78bfa";
const accentDim = "rgba(167,139,250,0.13)";
const borderColor = "rgba(167,139,250,0.25)";

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
  Q(1, "Mengenal PLDV", {
    badge: "ANBK",
    type: "mixed",
    content: "Perhatikan persamaan-persamaan berikut. Tentukan mana yang merupakan Persamaan Linear Dua Variabel (PLDV).",
    parts: [
      { label: "a.", math: "2x + 3y = 7" },
      { label: "b.", math: "x^2 + y = 5" },
      { label: "c.", math: "4x - 2y = 10" },
      { label: "d.", math: "x + y^2 = 9" },
      { label: "e.", math: "3x - 5y = 0" },
    ],
  }),
  Q(2, "Kaitan PLDV dan SPLDV", {
    badge: "UN",
    type: "mixed",
    content: "Jelaskan hubungan antara PLDV dan SPLDV dengan menjawab pertanyaan berikut:",
    parts: [
      { label: "a.", text: "Berapa banyak PLDV yang membentuk sebuah SPLDV?" },
      { label: "b.", text: "Apakah setiap PLDV bisa digabungkan menjadi SPLDV?" },
      { label: "c.", text: "Apa perbedaan mendasar antara PLDV dan SPLDV dalam hal penyelesaian?" },
    ],
  }),
  Q(3, "Identifikasi SPLDV", {
    badge: "TKA",
    type: "mixed",
    content: "Dari sistem persamaan berikut, manakah yang merupakan SPLDV? Berikan alasanmu!",
    parts: [
      { label: "a.", math: "\\begin{cases} x + y = 10 \\\\ x - y = 4 \\end{cases}" },
      { label: "b.", math: "\\begin{cases} x^2 + y = 6 \\\\ x + y = 3 \\end{cases}" },
      { label: "c.", math: "\\begin{cases} 2x + 3y = 12 \\\\ x = 4 \\end{cases}" },
      { label: "d.", math: "\\begin{cases} xy = 6 \\\\ x + y = 5 \\end{cases}" },
    ],
  }),
  Q(4, "Penyelesaian SPLDV", {
    badge: "ANBK",
    type: "mixed",
    content: "Diketahui SPLDV:",
    blockMath: "\\begin{cases} x + y = 10 \\\\ x - y = 4 \\end{cases}",
    parts: [
      { label: "a.", text: "Periksa apakah pasangan (7, 3) merupakan penyelesaian sistem tersebut!" },
      { label: "b.", text: "Periksa apakah pasangan (6, 4) merupakan penyelesaian sistem tersebut!" },
      { label: "c.", text: "Ada berapa penyelesaian SPLDV pada umumnya?" },
    ],
  }),
  Q(5, "Verifikasi Solusi", {
    badge: "UN",
    type: "mixed",
    content: "Periksa apakah setiap pasangan berurutan berikut merupakan penyelesaian SPLDV:",
    blockMath: "\\begin{cases} 2x + y = 8 \\\\ x - y = 1 \\end{cases}",
    parts: [
      { label: "a.", math: "(3, 2)" },
      { label: "b.", math: "(4, 0)" },
      { label: "c.", math: "(2, 4)" },
      { label: "d.", math: "(5, -2)" },
    ],
  }),
  Q(6, "Bentuk Persamaan", {
    badge: "ANBK",
    type: "mixed",
    content: "Ubah setiap kalimat berikut menjadi PLDV:",
    parts: [
      { label: "a.", text: "Harga 2 buku dan 3 pensil adalah Rp 13.000." },
      { label: "b.", text: "Jumlah dua bilangan adalah 25 dan selisihnya adalah 7." },
      { label: "c.", text: "Lima kali umur Ani ditambah dua kali umur Budi sama dengan 40 tahun." },
    ],
  }),
  Q(7, "Menentukan Variabel", {
    badge: "UN",
    type: "mixed",
    content: "Untuk setiap situasi berikut, tentukan variabel yang tepat dan tuliskan SPLDV-nya:",
    parts: [
      { label: "a.", text: "Seorang pedagang menjual jeruk dan apel. Total 50 buah dengan harga total Rp 75.000. Harga jeruk Rp 1.000/buah dan apel Rp 2.000/buah." },
      { label: "b.", text: "Dua bilangan jika dijumlahkan hasilnya 30, dan jika dikurangkan hasilnya 10." },
    ],
  }),
  Q(8, "Himpunan Penyelesaian", {
    badge: "UN",
    type: "mixed",
    content: "Tentukan himpunan penyelesaian dari SPLDV berikut (tanpa mencari solusinya, hanya tentukan apakah ada solusi, tak ada solusi, atau tak hingga solusi):",
    parts: [
      { label: "a.", math: "\\begin{cases} 2x + 4y = 8 \\\\ x + 2y = 4 \\end{cases}" },
      { label: "b.", math: "\\begin{cases} x + y = 5 \\\\ x + y = 7 \\end{cases}" },
      { label: "c.", math: "\\begin{cases} 3x - y = 4 \\\\ 6x - 2y = 8 \\end{cases}" },
    ],
  }),
  Q(9, "Contoh Nyata SPLDV", {
    badge: "AKM",
    type: "mixed",
    content: "Seorang kasir toko menerima uang dari penjualan 5 kemeja dan 3 celana = Rp 650.000, serta 2 kemeja dan 4 celana = Rp 520.000.",
    parts: [
      { label: "a.", text: "Tentukan variabel yang digunakan (misalnya x = harga kemeja, y = harga celana)." },
      { label: "b.", text: "Tuliskan SPLDV dari permasalahan tersebut." },
      { label: "c.", text: "Apakah ini termasuk SPLDV? Jelaskan!" },
    ],
  }),
  Q(10, "SPLDV dari Konteks", {
    badge: "UN",
    type: "mixed",
    content: "Budi membeli 3 kg mangga dan 2 kg jeruk seharga Rp 54.000. Andi membeli 1 kg mangga dan 4 kg jeruk seharga Rp 42.000.",
    parts: [
      { label: "a.", text: "Misal harga mangga = x dan harga jeruk = y. Tuliskan SPLDV-nya." },
      { label: "b.", text: "Periksa apakah (10.000, 12.000) merupakan penyelesaiannya." },
      { label: "c.", text: "Periksa apakah (12.000, 9.000) merupakan penyelesaiannya." },
    ],
  }),
  Q(11, "Variabel dalam SPLDV", {
    badge: "TKA",
    type: "mixed",
    content: "Identifikasikan variabel-variabel dari situasi berikut dan tuliskan SPLDV-nya:",
    parts: [
      { label: "a.", text: "Umur ayah 30 tahun lebih tua dari umur Rina. Tiga kali umur Rina sama dengan umur ayah ditambah 10." },
      { label: "b.", text: "Sebuah lapangan berbentuk persegi panjang dengan keliling 60 m. Panjangnya 6 m lebih dari lebarnya." },
    ],
  }),
  Q(12, "Mengubah ke Bentuk Standar", {
    badge: "ANBK",
    type: "mixed",
    content: "Ubah setiap persamaan berikut ke bentuk standar ax + by = c:",
    parts: [
      { label: "a.", math: "y = 3x - 5" },
      { label: "b.", math: "\\frac{x}{2} + \\frac{y}{3} = 1" },
      { label: "c.", math: "2(x+1) = 3(y-2) + 4" },
      { label: "d.", math: "0.5x - 1.5y = 6" },
    ],
  }),
  Q(13, "Banyak Solusi — Identifikasi", {
    badge: "AKM",
    type: "mixed",
    content: "Tanpa menyelesaikan, tentukan jenis penyelesaian SPLDV berikut (satu solusi, tidak ada solusi, atau tak berhingga solusi) dengan cara melihat perbandingan koefisiennya:",
    parts: [
      { label: "a.", math: "\\begin{cases} x + 2y = 6 \\\\ 2x + 4y = 12 \\end{cases}" },
      { label: "b.", math: "\\begin{cases} 3x - y = 4 \\\\ x + 2y = 5 \\end{cases}" },
      { label: "c.", math: "\\begin{cases} 2x + 6y = 10 \\\\ x + 3y = 8 \\end{cases}" },
      { label: "d.", math: "\\begin{cases} 4x - 2y = 8 \\\\ -2x + y = -4 \\end{cases}" },
    ],
  }),
  Q(14, "Penyelesaian Tunggal", {
    badge: "ANBK",
    type: "mixed",
    content: "Diketahui SPLDV:",
    blockMath: "\\begin{cases} 2x + y = 7 \\\\ x - y = 2 \\end{cases}",
    parts: [
      { label: "a.", text: "Berapa banyak penyelesaian SPLDV ini? Jelaskan tanpa menghitung!" },
      { label: "b.", text: "Periksa apakah (3, 1) memenuhi kedua persamaan tersebut." },
      { label: "c.", text: "Adakah pasangan lain yang memenuhi kedua persamaan?" },
    ],
  }),
  Q(15, "Substitusi Cepat — Verifikasi", {
    badge: "TKA",
    type: "mixed",
    content: "Tanpa menyelesaikan SPLDV, periksa apakah solusi berikut benar:",
    parts: [
      { label: "a.", math: "\\begin{cases} x + y = 5 \\\\ 2x - y = 4 \\end{cases} \\Rightarrow (3, 2)?" },
      { label: "b.", math: "\\begin{cases} 3x + 2y = 13 \\\\ x - y = 1 \\end{cases} \\Rightarrow (3, 2)?" },
      { label: "c.", math: "\\begin{cases} 4x - y = 10 \\\\ x + 3y = 9 \\end{cases} \\Rightarrow (3, 2)?" },
    ],
  }),
  Q(16, "Soal UN {t('practice.multipleChoice')} Style", {
    badge: "UN",
    type: "mixed",
    content: "Pasangan bilangan yang merupakan penyelesaian dari SPLDV:",
    blockMath: "\\begin{cases} 2x + 3y = 16 \\\\ x - y = 1 \\end{cases}",
    parts: [
      { label: "A.", math: "(1, 4)" },
      { label: "B.", math: "(5, 2)" },
      { label: "C.", math: "(4, 3)" },
      { label: "D.", math: "(3, 4)" },
    ],
  }),
  Q(17, "Soal Cerita Bilangan", {
    badge: "UN",
    type: "mixed",
    content: "Jumlah dua bilangan adalah 48. Selisih kedua bilangan itu adalah 12. Tuliskan SPLDV untuk situasi tersebut:",
    parts: [
      { label: "a.", text: "Misal bilangan pertama = x dan bilangan kedua = y (x > y). Tuliskan SPLDV!" },
      { label: "b.", text: "Verifikasi apakah (30, 18) adalah solusinya." },
    ],
  }),
  Q(18, "Persamaan Pecahan", {
    badge: "TKA",
    type: "mixed",
    content: "Ubah SPLDV berikut ke bentuk standar (kalikan agar tidak ada pecahan):",
    parts: [
      { label: "a.", math: "\\begin{cases} \\frac{x}{2} + \\frac{y}{3} = 4 \\\\ \\frac{x}{4} - \\frac{y}{2} = 1 \\end{cases}" },
      { label: "b.", math: "\\begin{cases} 0.2x + 0.5y = 3 \\\\ 0.4x - 0.1y = 2 \\end{cases}" },
    ],
  }),
  Q(19, "Syarat Solusi Unik", {
    badge: "ANBK",
    type: "mixed",
    content: "Untuk SPLDV",
    blockMath: "\\begin{cases} ax + by = c \\\\ px + qy = r \\end{cases}",
    parts: [
      { label: "a.", text: "Apa syarat agar sistem memiliki solusi unik (berpotongan di satu titik)?" },
      { label: "b.", math: "\\frac{a}{p} \\neq \\frac{b}{q}" },
      { label: "c.", text: "Berikan contoh SPLDV yang memenuhi syarat tersebut." },
    ],
  }),
  Q(20, "ANBK — Benar atau Salah", {
    badge: "ANBK",
    type: "mixed",
    content: "Tentukan pernyataan BENAR (B) atau SALAH (S):",
    parts: [
      { label: "(1)", text: "SPLDV selalu memiliki tepat satu penyelesaian." },
      { label: "(2)", text: "Jika koefisien x dan y pada dua persamaan sebanding tapi konstantanya tidak, maka tidak ada penyelesaian." },
      { label: "(3)", text: "Setiap PLDV dapat dijadikan bagian dari suatu SPLDV." },
      { label: "(4)", text: "Penyelesaian SPLDV berupa pasangan bilangan (x, y) yang memenuhi kedua persamaan." },
    ],
  }),
  Q(21, "Rekap Definisi", {
    badge: "AKM",
    type: "mixed",
    content: "Lengkapi pernyataan berikut dengan jawaban yang tepat:",
    parts: [
      { label: "a.", text: "SPLDV adalah sistem yang terdiri dari ... persamaan linear dengan ... variabel." },
      { label: "b.", text: "Penyelesaian SPLDV adalah pasangan (x, y) yang ... kedua persamaan." },
      { label: "c.", text: "Jika kedua garis sejajar, maka SPLDV tidak memiliki ..." },
      { label: "d.", text: "Jika kedua garis berimpit, maka SPLDV memiliki ... penyelesaian." },
      { label: "e.", text: "Metode untuk mencari penyelesaian SPLDV antara lain: ..., ..., ..., dan ..." },
    ],
  }),
];

const DefinisiSPLDVPage = () => {
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
            <Layers className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}88` }}>
            DEFINISI DAN BENTUK UMUM SPLDV
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
                style={{ borderColor, background: "rgba(167,139,250,0.08)" }}>
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
                    style={{ background: "rgba(167,139,250,0.08)", border: `1px solid ${borderColor}` }}>
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

export default DefinisiSPLDVPage;
