import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Replace } from "lucide-react";

const accentColor = "#60a5fa";
const accentDim = "rgba(96,165,250,0.12)";
const borderColor = "rgba(96,165,250,0.25)";

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
  Q(1, "Langkah Substitusi Dasar", {
    badge: "ANBK",
    type: "mixed",
    blockMath: "\\begin{cases} y = 2x - 1 \\\\ x + y = 8 \\end{cases}",
    parts: [
      { label: "a.", text: "Substitusikan y = 2x − 1 ke persamaan x + y = 8." },
      { label: "b.", text: "Selesaikan untuk x." },
      { label: "c.", text: "Tentukan nilai y, lalu tulis HP." },
    ],
  }),
  Q(2, "Ubah Variabel Dulu", {
    badge: "UN",
    type: "mixed",
    blockMath: "\\begin{cases} x + y = 10 \\\\ 2x + 3y = 24 \\end{cases}",
    parts: [
      { label: "a.", text: "Dari persamaan pertama, nyatakan x dalam y." },
      { label: "b.", text: "Substitusikan ke persamaan kedua." },
      { label: "c.", text: "Selesaikan untuk y, lalu cari x." },
    ],
  }),
  Q(3, "Substitusi — Variabel y", {
    badge: "TKA",
    type: "mixed",
    blockMath: "\\begin{cases} 3x - y = 5 \\\\ x + 2y = 12 \\end{cases}",
    parts: [
      { label: "a.", text: "Dari persamaan pertama, nyatakan y dalam x." },
      { label: "b.", text: "Substitusikan ke persamaan kedua." },
      { label: "c.", text: "Tentukan nilai x dan y." },
    ],
  }),
  Q(4, "Soal Bilangan UN", {
    badge: "UN",
    type: "mixed",
    content: "Jumlah dua bilangan adalah 30 dan selisihnya adalah 8.",
    parts: [
      { label: "a.", text: "Misal bilangan pertama = x dan kedua = y. Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan metode substitusi." },
      { label: "c.", text: "Tentukan kedua bilangan tersebut." },
    ],
  }),
  Q(5, "Koefisien Pecahan", {
    badge: "TKA",
    type: "mixed",
    blockMath: "\\begin{cases} \\frac{x}{2} + y = 5 \\\\ x - 2y = 2 \\end{cases}",
    parts: [
      { label: "a.", text: "Nyatakan x dari persamaan kedua." },
      { label: "b.", text: "Substitusikan ke persamaan pertama." },
      { label: "c.", text: "Tentukan HP." },
    ],
  }),
  Q(6, "SPLDV dengan Bilangan Besar", {
    badge: "ANBK",
    type: "mixed",
    blockMath: "\\begin{cases} 5x + 2y = 36 \\\\ x = 4 \\end{cases}",
    parts: [
      { label: "a.", text: "Substitusikan x = 4 ke persamaan pertama." },
      { label: "b.", text: "Tentukan nilai y." },
      { label: "c.", text: "Tuliskan HP = {(x, y)}." },
    ],
  }),
  Q(7, "Substitusi dari Persamaan Kompleks", {
    badge: "UN",
    type: "mixed",
    blockMath: "\\begin{cases} 2x + y = 14 \\\\ 3x - 2y = 9 \\end{cases}",
    parts: [
      { label: "a.", text: "Nyatakan y dari persamaan pertama (y = ...)." },
      { label: "b.", text: "Substitusikan ke persamaan kedua." },
      { label: "c.", text: "Tentukan x dan y." },
    ],
  }),
  Q(8, "Soal Usia", {
    badge: "UN",
    type: "mixed",
    content: "Umur Ayah 28 tahun lebih tua dari umur Anak. Tiga tahun lagi, umur Ayah dua kali umur Anak.",
    parts: [
      { label: "a.", text: "Misal umur Ayah = x dan umur Anak = y. Tuliskan SPLDV!" },
      { label: "b.", text: "Selesaikan dengan metode substitusi." },
      { label: "c.", text: "Tentukan umur Ayah dan Anak sekarang." },
    ],
  }),
  Q(9, "Soal Harga Barang", {
    badge: "UN",
    type: "mixed",
    content: "Harga 3 buku dan 4 pensil = Rp 29.000. Harga 1 buku dan 2 pensil = Rp 11.000.",
    parts: [
      { label: "a.", text: "Misal harga buku = x dan pensil = y. Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan metode substitusi." },
      { label: "c.", text: "Berapa harga 5 buku dan 3 pensil?" },
    ],
  }),
  Q(10, "Soal Tiket Masuk", {
    badge: "UN",
    type: "mixed",
    content: "Harga tiket dewasa = Rp 15.000 dan tiket anak = Rp 8.000. Sekelompok orang membeli 12 tiket seharga Rp 120.000.",
    parts: [
      { label: "a.", text: "Misal banyak tiket dewasa = x dan anak = y. Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan substitusi." },
      { label: "c.", text: "Berapa tiket dewasa dan anak yang dibeli?" },
    ],
  }),
  Q(11, "Soal Campuran — Berat", {
    badge: "AKM",
    type: "mixed",
    content: "1 kg apel dan 2 kg jeruk beratnya 2,5 kg. 3 kg apel dan 1 kg jeruk beratnya 4 kg.",
    parts: [
      { label: "a.", text: "Misal berat 1 kg apel = x dan 1 kg jeruk = y. Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan substitusi." },
      { label: "c.", text: "Berapa berat 2 kg apel dan 3 kg jeruk?" },
    ],
  }),
  Q(12, "Substitusi dari Persamaan Ke-2", {
    badge: "UN",
    type: "mixed",
    blockMath: "\\begin{cases} 4x + 3y = 23 \\\\ y = 5 - x \\end{cases}",
    parts: [
      { label: "a.", text: "Substitusikan langsung y = 5 − x ke persamaan pertama." },
      { label: "b.", text: "Selesaikan untuk x." },
      { label: "c.", text: "Tentukan y, lalu tulis HP." },
    ],
  }),
  Q(13, "Soal Perbandingan Usia", {
    badge: "UN",
    type: "mixed",
    content: "Lima tahun yang lalu, umur ibu dua kali umur putrinya. Sekarang, jumlah umur mereka adalah 55 tahun.",
    parts: [
      { label: "a.", text: "Misal umur ibu sekarang = x dan putri = y. Susun SPLDV." },
      { label: "b.", text: "Selesaikan dengan substitusi." },
    ],
  }),
  Q(14, "Soal Makanan — ANBK", {
    badge: "ANBK",
    type: "mixed",
    content: "Di kantin, 2 porsi nasi goreng dan 1 minuman = Rp 25.000. 1 porsi nasi goreng dan 3 minuman = Rp 23.000.",
    parts: [
      { label: "a.", text: "Tuliskan SPLDV." },
      { label: "b.", text: "Selesaikan dengan metode substitusi." },
      { label: "c.", text: "Berapa harga nasi goreng dan minuman masing-masing?" },
    ],
  }),
  Q(15, "Substitusi — Kasus y = c", {
    badge: "ANBK",
    type: "mixed",
    blockMath: "\\begin{cases} y = 5 \\\\ 3x + 2y = 26 \\end{cases}",
    parts: [
      { label: "a.", text: "Substitusikan y = 5 ke persamaan kedua." },
      { label: "b.", text: "Selesaikan untuk x." },
      { label: "c.", text: "Tulis HP." },
    ],
  }),
  Q(16, "Substitusi — Hasil Negatif", {
    badge: "TKA",
    type: "mixed",
    blockMath: "\\begin{cases} x - 3y = -8 \\\\ 2x + y = 1 \\end{cases}",
    parts: [
      { label: "a.", text: "Nyatakan x dari persamaan pertama." },
      { label: "b.", text: "Substitusikan ke persamaan kedua." },
      { label: "c.", text: "Tentukan x dan y (mungkin bernilai negatif)." },
    ],
  }),
  Q(17, "ANBK — Pernyataan Benar/Salah", {
    badge: "ANBK",
    type: "mixed",
    content: "Tentukan pernyataan BENAR (B) atau SALAH (S) tentang metode substitusi:",
    parts: [
      { label: "(1)", text: "Pada metode substitusi, salah satu variabel dinyatakan dalam variabel lainnya dari salah satu persamaan." },
      { label: "(2)", text: "Hasil substitusi selalu menghasilkan persamaan satu variabel." },
      { label: "(3)", text: "Metode substitusi hanya berlaku jika koefisien variabelnya adalah 1." },
      { label: "(4)", text: "Setelah mendapat satu variabel, variabel lainnya diperoleh dengan mensubstitusikan kembali." },
    ],
  }),
];

const MetodeSubstitusiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: accentDim, border: `1.5px solid ${borderColor}` }}>
            <Replace className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-center mb-1"
            style={{ color: accentColor, textShadow: `0 0 24px ${accentColor}88` }}>
            PENYELESAIAN SPLDV — METODE SUBSTITUSI
          </h1>
          <p className="text-white/40 text-xs font-body text-center">Kelas 8 · Tugas - Latihan Mandiri · 17 Soal</p>
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
                style={{ borderColor, background: "rgba(96,165,250,0.08)" }}>
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
                    style={{ background: "rgba(96,165,250,0.08)", border: `1px solid ${borderColor}` }}>
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
            ← Kembali ke Menu SPLDV
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetodeSubstitusiPage;
