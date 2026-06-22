import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Sigma, Star } from "lucide-react";

const pengertianQuestions = [
  {
    number: 1,
    title: "Melanjutkan Pola Bilangan",
    content: "Perhatikan barisan bilangan berikut:\n2, 5, 10, 17, 26, ...\nTentukan dua suku berikutnya dari barisan bilangan tersebut dan jelaskan aturan polanya!",
    type: "essay" as const,
  },
  {
    number: 2,
    title: "Suku yang Hilang",
    content: "Temukan nilai yang tepat untuk menggantikan tanda tanya (?) dalam pola berikut:",
    type: "mixed" as const,
    parts: [
      { label: "a.", math: "3,\\ 7,\\ 11,\\ ?,\\ 19,\\ 23" },
      { label: "b.", math: "2,\\ 4,\\ 8,\\ ?,\\ 32,\\ 64" },
      { label: "c.", math: "100,\\ 95,\\ 88,\\ 79,\\ ?,\\ 55" },
    ],
  },
  {
    number: 3,
    title: "Pola Gambar Susunan Batu Bata",
    content: "Seorang tukang batu menyusun batu bata membentuk pola:\nBaris ke-1: 3 batu bata | Baris ke-2: 6 | Baris ke-3: 9 | Baris ke-4: 12\n\na. Tentukan pola yang terbentuk.\nb. Berapa banyak batu bata pada baris ke-10?\nc. Berapa total batu bata jika ada 8 baris?",
    type: "essay" as const,
  },
  {
    number: 4,
    title: "Konfigurasi Objek - Pola Titik",
    content: "Perhatikan susunan titik yang membentuk baris ganjil: 1, 3, 5, 7, ...\na. Tuliskan aturan/pola barisannya.\nb. Berapa banyak titik pada susunan ke-8?\nc. Susunan ke berapa yang memiliki 25 titik?",
    type: "essay" as const,
  },
  {
    number: 5,
    title: "Menentukan Suku ke-n",
    content: "Diketahui barisan bilangan: 4, 9, 16, 25, 36, ...",
    type: "mixed" as const,
    parts: [
      { label: "a.", text: "Jelaskan pola dari barisan bilangan di atas." },
      { label: "b.", text: "Tuliskan rumus suku ke-n dari barisan tersebut." },
      { label: "c.", text: "Tentukan nilai suku ke-12." },
    ],
  },
  {
    number: 6,
    title: "Barisan Bilangan Genap",
    content: "Barisan bilangan genap positif: 2, 4, 6, 8, 10, ...\n\na. Nyatakan suku ke-n barisan tersebut.\nb. Suku ke-25 barisan tersebut adalah ....\nc. Bilangan 84 merupakan suku ke berapa?",
    type: "essay" as const,
  },
  {
    number: 7,
    title: "Pola dari Tabel",
    content: "Perhatikan tabel konfigurasi berikut:",
    type: "mixed" as const,
    parts: [
      { label: "n =", math: "1 \\quad 2 \\quad 3 \\quad 4 \\quad 5" },
      { label: "U_n =", math: "5 \\quad 8 \\quad 11 \\quad 14 \\quad 17" },
      { label: "", text: "a. Tentukan aturan polanya.\nb. Tuliskan rumus suku ke-n.\nc. Hitung nilai suku ke-20." },
    ],
  },
  {
    number: 8,
    title: "Pola Bilangan Positif dan Negatif",
    content: "Perhatikan barisan berikut:\n-20, -15, -10, -5, 0, 5, 10, ...\n\na. Jelaskan pola barisannya.\nb. Tentukan suku ke-15.\nc. Suku ke berapa yang nilainya 40?",
    type: "essay" as const,
  },
  {
    number: 9,
    title: "Barisan Bertingkat",
    content: "Barisan bilangan: 1, 3, 7, 13, 21, 31, ...\n\na. Hitung selisih antara suku-suku berurutan (beda tingkat 1).\nb. Hitung selisih dari barisan beda tingkat 1 (beda tingkat 2).\nc. Tentukan suku ke-8 dari barisan tersebut.",
    type: "essay" as const,
  },
  {
    number: 10,
    title: "Soal Kontekstual - Pertumbuhan Tanaman",
    content: "Sebuah tanaman bambu tumbuh mengikuti pola:\nMinggu ke-1: 10 cm | Minggu ke-2: 13 cm | Minggu ke-3: 16 cm | Minggu ke-4: 19 cm\n\na. Identifikasi pola pertumbuhan bambu tersebut.\nb. Berapa tinggi bambu pada minggu ke-10?\nc. Pada minggu ke berapa bambu mencapai tinggi 43 cm?",
    type: "essay" as const,
  },
  {
    number: 11,
    title: "Pola Barisan Fibonacci",
    content: "Barisan Fibonacci: 1, 1, 2, 3, 5, 8, 13, 21, ...\n\na. Jelaskan aturan pembentukan barisan Fibonacci.\nb. Tuliskan 4 suku berikutnya dari barisan tersebut.\nc. Berapa nilai suku ke-14 dari barisan Fibonacci?",
    type: "essay" as const,
  },
  {
    number: 12,
    title: "Soal ANBK - Evaluasi Pernyataan",
    content: "Perhatikan barisan: 5, 15, 45, 135, ...\nTentukan pernyataan yang BENAR (B) atau SALAH (S) dan berikan alasannya:",
    type: "mixed" as const,
    parts: [
      { label: "(1)", text: "Setiap suku berikutnya diperoleh dengan mengalikan suku sebelumnya dengan 3." },
      { label: "(2)", text: "Selisih antara dua suku berurutan selalu tetap." },
      { label: "(3)", text: "Suku ke-6 dari barisan tersebut adalah 3.645." },
      { label: "(4)", text: "Suku ke-5 dari barisan tersebut adalah 405." },
    ],
  },
];

const polaKhususQuestions = [
  {
    number: 1,
    title: "Bilangan Segitiga",
    content: "Bilangan segitiga dibentuk dari susunan titik berbentuk segitiga:",
    type: "mixed" as const,
    parts: [
      { label: "Pola:", math: "1,\\ 3,\\ 6,\\ 10,\\ 15,\\ ..." },
      { label: "a.", text: "Jelaskan cara membentuk bilangan segitiga." },
      { label: "b.", text: "Tuliskan rumus bilangan segitiga ke-n." },
      { label: "c.", text: "Tentukan bilangan segitiga ke-10." },
    ],
  },
  {
    number: 2,
    title: "Bilangan Persegi",
    content: "Perhatikan bilangan persegi berikut:",
    type: "mixed" as const,
    parts: [
      { label: "Pola:", math: "1,\\ 4,\\ 9,\\ 16,\\ 25,\\ ..." },
      { label: "a.", text: "Nyatakan rumus bilangan persegi ke-n." },
      { label: "b.", text: "Bilangan persegi ke-15 adalah ...." },
      { label: "c.", text: "Apakah 144 merupakan bilangan persegi? Jelaskan!" },
    ],
  },
  {
    number: 3,
    title: "Bilangan Persegi Panjang",
    content: "Bilangan persegi panjang dibentuk dari susunan titik berbentuk persegi panjang:",
    type: "mixed" as const,
    parts: [
      { label: "Pola:", math: "2,\\ 6,\\ 12,\\ 20,\\ 30,\\ ..." },
      { label: "a.", text: "Tentukan aturan pola bilangan persegi panjang." },
      { label: "b.", text: "Tuliskan rumus bilangan persegi panjang ke-n." },
      { label: "c.", text: "Hitung bilangan persegi panjang ke-8." },
    ],
  },
  {
    number: 4,
    title: "Segitiga Pascal - Pola Baris",
    content: "Perhatikan Segitiga Pascal berikut:\nBaris ke-0: 1\nBaris ke-1: 1  1\nBaris ke-2: 1  2  1\nBaris ke-3: 1  3  3  1\nBaris ke-4: 1  4  6  4  1\n\na. Tuliskan isi baris ke-5 dan ke-6 dari Segitiga Pascal.\nb. Berapa jumlah bilangan pada baris ke-7?\nc. Berapa banyak bilangan yang ada pada baris ke-n?",
    type: "essay" as const,
  },
  {
    number: 5,
    title: "Pola Jumlah Baris Segitiga Pascal",
    content: "Jumlah bilangan pada setiap baris Segitiga Pascal membentuk pola tersendiri:",
    type: "mixed" as const,
    parts: [
      { label: "Baris 0:", math: "1 \\Rightarrow \\text{jumlah} = 1" },
      { label: "Baris 1:", math: "1+1 = 2" },
      { label: "Baris 2:", math: "1+2+1 = 4" },
      { label: "Baris 3:", math: "1+3+3+1 = 8" },
      { label: "a.", text: "Tentukan pola jumlah bilangan setiap baris." },
      { label: "b.", text: "Berapa jumlah bilangan pada baris ke-10?" },
    ],
  },
  {
    number: 6,
    title: "Hubungan Bilangan Segitiga dan Persegi",
    content: "Perhatikan pola hubungan berikut:",
    type: "mixed" as const,
    parts: [
      { label: "", math: "1 + 3 = 4 = 2^2" },
      { label: "", math: "1 + 3 + 5 = 9 = 3^2" },
      { label: "", math: "1 + 3 + 5 + 7 = 16 = 4^2" },
      { label: "a.", text: "Tuliskan pola selanjutnya hingga penjumlahan bilangan ganjil ke-6." },
      { label: "b.", text: "Buktikan bahwa penjumlahan n bilangan ganjil pertama sama dengan n²." },
    ],
  },
  {
    number: 7,
    title: "Pola Bilangan Prima",
    content: "Perhatikan barisan bilangan prima: 2, 3, 5, 7, 11, 13, 17, 19, 23, ...\n\na. Tentukan 5 bilangan prima berikutnya setelah 23.\nb. Apakah 91 termasuk bilangan prima? Jelaskan dengan cara faktorisasi!\nc. Jelaskan mengapa 1 bukan termasuk bilangan prima.",
    type: "essay" as const,
  },
  {
    number: 8,
    title: "Pola Bilangan Kubik",
    content: "Bilangan kubik: 1, 8, 27, 64, 125, ...",
    type: "mixed" as const,
    parts: [
      { label: "a.", text: "Nyatakan rumus bilangan kubik ke-n." },
      { label: "b.", text: "Bilangan kubik ke-7 adalah ...." },
      { label: "c.", math: "\\text{Tentukan nilai } n \\text{ jika bilangan kubik ke-}n = 512" },
    ],
  },
  {
    number: 9,
    title: "Segitiga Pascal - Koefisien Binomial",
    content: "Dalam Segitiga Pascal, baris ke-n merupakan koefisien dari penjabaran (a + b)ⁿ.\n\na. Jabarkan (a + b)⁴ menggunakan Segitiga Pascal.\nb. Jabarkan (a + b)⁵ menggunakan Segitiga Pascal.\nc. Tentukan suku ke-3 dari penjabaran (x + y)⁶.",
    type: "essay" as const,
  },
  {
    number: 10,
    title: "Pola Bilangan Segitiga Bertingkat",
    content: "Jumlah n bilangan asli pertama membentuk bilangan segitiga.",
    type: "mixed" as const,
    parts: [
      { label: "Rumus:", math: "T_n = \\frac{n(n+1)}{2}" },
      { label: "a.", text: "Hitung T₁₀ (bilangan segitiga ke-10)." },
      { label: "b.", math: "\\text{Apakah } T_{20} = 210 \\text{ ? Verifikasi jawabanmu!}" },
      { label: "c.", text: "Bilangan segitiga ke berapa yang nilainya 120?" },
    ],
  },
  {
    number: 11,
    title: "Soal TKA - Pola Kombinasi",
    content: "Perhatikan barisan: 1, 2, 4, 7, 11, 16, 22, ...\n\na. Tentukan beda antara suku-suku berurutan.\nb. Identifikasi pola beda tersebut.\nc. Tentukan dua suku berikutnya.\nd. Tuliskan rumus umum suku ke-n.",
    type: "essay" as const,
  },
  {
    number: 12,
    title: "Pola Bilangan Ganjil dan Persegi",
    content: "Perhatikan hubungan antara bilangan ganjil dan bilangan persegi:",
    type: "mixed" as const,
    parts: [
      { label: "", math: "1 = 1^2" },
      { label: "", math: "1 + 3 = 2^2" },
      { label: "", math: "1 + 3 + 5 = 3^2" },
      { label: "", math: "1 + 3 + 5 + 7 = 4^2" },
      { label: "a.", text: "Lanjutkan pola tersebut untuk n = 5 dan n = 6." },
      { label: "b.", math: "\\text{Buktikan: } \\sum_{k=1}^{n}(2k-1) = n^2" },
    ],
  },
  {
    number: 13,
    title: "Soal ANBK - Pola Bilangan Khusus Terpadu",
    content: "Di bawah ini terdapat empat barisan bilangan. Pasangkan setiap barisan dengan jenis polanya yang tepat!",
    type: "mixed" as const,
    parts: [
      { label: "(1)", math: "1,\\ 4,\\ 9,\\ 16,\\ 25,\\ ..." },
      { label: "(2)", math: "1,\\ 3,\\ 6,\\ 10,\\ 15,\\ ..." },
      { label: "(3)", math: "2,\\ 6,\\ 12,\\ 20,\\ 30,\\ ..." },
      { label: "(4)", math: "1,\\ 8,\\ 27,\\ 64,\\ 125,\\ ..." },
      { label: "", text: "Pilihan: Bilangan Segitiga / Bilangan Persegi / Bilangan Persegi Panjang / Bilangan Kubik" },
    ],
  },
];

type QuestionItem = {
  number: number;
  title: string;
  content: string;
  type: "essay" | "mixed";
  parts?: { label: string; math?: string; text?: string }[];
};

const QuestionCard = ({
  q,
  i,
  accent,
}: {
  q: QuestionItem;
  i: number;
  accent: "cyan" | "purple";
}) => {
  const colors = {
    cyan: {
      bg: "from-cyan-900/30 via-slate-900/80 to-blue-900/30",
      border: "border-cyan-500/20",
      bar: "from-cyan-400 to-blue-500",
      circle: "bg-cyan-500/20 border-cyan-400/50",
      num: "text-cyan-300",
      badge: "text-cyan-400 bg-cyan-500/10",
      label: "text-cyan-300",
    },
    purple: {
      bg: "from-purple-900/30 via-slate-900/80 to-violet-900/30",
      border: "border-purple-500/20",
      bar: "from-purple-400 to-violet-500",
      circle: "bg-purple-500/20 border-purple-400/50",
      num: "text-purple-300",
      badge: "text-purple-400 bg-purple-500/10",
      label: "text-purple-300",
    },
  }[accent];

  return (
    <div
      className="relative rounded-2xl overflow-hidden animate-slide-up"
      style={{ animationDelay: `${i * 0.04}s` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} backdrop-blur`} />
      <div className={`absolute inset-0 border ${colors.border} rounded-2xl`} />
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${colors.bar} rounded-l-2xl`} />
      <div className="relative px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <div className={`w-8 h-8 rounded-full ${colors.circle} border flex items-center justify-center`}>
              <span className={`${colors.num} text-xs font-bold`}>{q.number}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            {q.title && (
              <span className={`${colors.badge} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block mb-2`}>
                {q.title}
              </span>
            )}
            {q.content && (
              <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-2">{q.content}</p>
            )}
            {q.type === "mixed" && q.parts && (
              <div className="flex flex-col gap-2 mt-2">
                {q.parts.map((part, pi) => (
                  <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                    <span className={`${colors.label} text-xs font-bold shrink-0 mt-0.5 min-w-[28px]`}>{part.label}</span>
                    {part.math ? (
                      <div className="text-white text-sm overflow-x-auto">
                        <InlineMath math={part.math} />
                      </div>
                    ) : (
                      <p className="font-body text-sm text-white/80 whitespace-pre-line">{part.text}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PengertianDanPolaKhususPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="flex gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center">
              <Sigma className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-400/60 flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h1 className="font-display text-lg md:text-xl font-bold text-white text-center mb-1 leading-tight px-2"
            style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
            PENGERTIAN POLA, BARISAN BILANGAN
            <br />
            <span className="text-purple-300">DAN POLA-POLA KHUSUS</span>
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-3">Kelas 8 · Pola Bilangan · Tugas - Latihan Mandiri</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 12 Soal</span>
            <span className="text-white/30 text-xs">+</span>
            <span className="text-purple-400 text-xs font-bold">13 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-6 bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Sigma className="w-4 h-4 text-cyan-400" />
            <p className="text-cyan-300 text-xs font-bold uppercase tracking-wider">Bagian 1 — Pengertian Pola dan Barisan Bilangan</p>
          </div>
          <p className="text-white/50 text-xs font-body">Pola, barisan bilangan, suku ke-n, barisan bertingkat, Fibonacci</p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {pengertianQuestions.map((q, i) => (
            <QuestionCard key={`p-${q.number}`} q={q} i={i} accent="cyan" />
          ))}
        </div>

        <div className="mb-6 bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-purple-400" />
            <p className="text-purple-300 text-xs font-bold uppercase tracking-wider">Bagian 2 — Pola-Pola Khusus</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Segitiga ke-n", math: "T_n = \\frac{n(n+1)}{2}" },
              { label: "Persegi ke-n", math: "P_n = n^2" },
              { label: "Persegi Panjang ke-n", math: "PP_n = n(n+1)" },
              { label: "Kubik ke-n", math: "K_n = n^3" },
            ].map((r, i) => (
              <div key={i} className="bg-white/5 rounded-lg px-3 py-2 text-center">
                <p className="text-white/40 text-[10px] mb-1">{r.label}</p>
                <div className="text-purple-200 text-sm">
                  <InlineMath math={r.math} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {polaKhususQuestions.map((q, i) => (
            <QuestionCard key={`k-${q.number}`} q={q} i={i} accent="purple" />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/pola-bilangan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Pola Bilangan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianDanPolaKhususPage;
