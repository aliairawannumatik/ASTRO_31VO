import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Sigma } from "lucide-react";

type Question = {
  number: number;
  type: "essay" | "math" | "mixed";
  title?: string;
  content?: string;
  math?: string;
  parts?: { label: string; math?: string; text?: string }[];
};

const questions: Question[] = [
  {
    number: 1,
    type: "essay",
    title: "Melanjutkan Pola Bilangan",
    content: "Perhatikan barisan bilangan berikut:\n2, 5, 10, 17, 26, ...\nTentukan dua suku berikutnya dari barisan bilangan tersebut dan jelaskan aturan polanya!",
  },
  {
    number: 2,
    type: "mixed",
    title: "Suku yang Hilang",
    content: "Temukan nilai yang tepat untuk menggantikan tanda tanya (?) dalam pola berikut:",
    parts: [
      { label: "a.", math: "3,\\ 7,\\ 11,\\ ?,\\ 19,\\ 23" },
      { label: "b.", math: "2,\\ 4,\\ 8,\\ ?,\\ 32,\\ 64" },
      { label: "c.", math: "100,\\ 95,\\ 88,\\ 79,\\ ?,\\ 55" },
    ],
  },
  {
    number: 3,
    type: "essay",
    title: "Pola Gambar Susunan Batu Bata",
    content: "Sebuah tukang batu menyusun batu bata membentuk pola berikut:\nBaris ke-1: 3 batu bata\nBaris ke-2: 6 batu bata\nBaris ke-3: 9 batu bata\nBaris ke-4: 12 batu bata\n\na. Tentukan pola yang terbentuk.\nb. Berapa banyak batu bata pada baris ke-10?\nc. Berapa total batu bata jika ada 8 baris?",
  },
  {
    number: 4,
    type: "mixed",
    title: "Konfigurasi Objek - Pola Titik",
    content: "Perhatikan susunan titik berikut:",
    parts: [
      { label: "Susunan 1:", math: "\\bullet" },
      { label: "Susunan 2:", math: "\\bullet\\bullet\\bullet" },
      { label: "Susunan 3:", math: "\\bullet\\bullet\\bullet\\bullet\\bullet" },
    ],
  },
  {
    number: 4,
    type: "essay",
    title: "Konfigurasi Objek - Pola Titik",
    content: "Perhatikan susunan titik yang membentuk baris ganjil: 1, 3, 5, 7, ...\na. Tuliskan aturan/pola barisannya.\nb. Berapa banyak titik pada susunan ke-8?\nc. Susunan ke berapa yang memiliki 25 titik?",
  },
  {
    number: 5,
    type: "mixed",
    title: "Menentukan Suku ke-n",
    content: "Diketahui barisan bilangan: 4, 9, 16, 25, 36, ...",
    parts: [
      { label: "a.", text: "Jelaskan pola dari barisan bilangan di atas." },
      { label: "b.", text: "Tuliskan rumus suku ke-n dari barisan tersebut." },
      { label: "c.", text: "Tentukan nilai suku ke-12." },
    ],
  },
  {
    number: 6,
    type: "essay",
    title: "Barisan Bilangan Genap",
    content: "Barisan bilangan genap positif: 2, 4, 6, 8, 10, ...\n\na. Nyatakan suku ke-n barisan tersebut.\nb. Suku ke-25 barisan tersebut adalah ....\nc. Bilangan 84 merupakan suku ke berapa?",
  },
  {
    number: 7,
    type: "mixed",
    title: "Pola dari Tabel",
    content: "Perhatikan tabel konfigurasi berikut:",
    parts: [
      { label: "n =", math: "1 \\quad 2 \\quad 3 \\quad 4 \\quad 5" },
      { label: "U_n =", math: "5 \\quad 8 \\quad 11 \\quad 14 \\quad 17" },
    ],
  },
  {
    number: 7,
    type: "essay",
    title: "Pola dari Tabel",
    content: "Dari tabel di atas:\na. Tentukan aturan polanya.\nb. Tuliskan rumus suku ke-n.\nc. Hitung nilai suku ke-20.",
  },
  {
    number: 8,
    type: "essay",
    title: "Pola Bilangan Positif dan Negatif",
    content: "Perhatikan barisan berikut:\n-20, -15, -10, -5, 0, 5, 10, ...\n\na. Jelaskan pola barisannya.\nb. Tentukan suku ke-15.\nc. Suku ke berapa yang nilainya 40?",
  },
  {
    number: 9,
    type: "mixed",
    title: "Barisan Bertingkat",
    content: "Perhatikan barisan bilangan: 1, 3, 7, 13, 21, 31, ...",
    parts: [
      { label: "a.", text: "Hitung selisih antara suku-suku yang berurutan (beda tingkat 1)." },
      { label: "b.", text: "Hitung selisih dari barisan beda tingkat 1 (beda tingkat 2)." },
      { label: "c.", text: "Tentukan suku ke-8 dari barisan tersebut." },
    ],
  },
  {
    number: 10,
    type: "essay",
    title: "Soal Kontekstual - Pertumbuhan Tanaman",
    content: "Sebuah tanaman bambu tumbuh mengikuti pola berikut:\nMinggu ke-1: tinggi 10 cm\nMinggu ke-2: tinggi 13 cm\nMinggu ke-3: tinggi 16 cm\nMinggu ke-4: tinggi 19 cm\n\na. Identifikasi pola pertumbuhan bambu tersebut.\nb. Berapa tinggi bambu pada minggu ke-10?\nc. Pada minggu ke berapa bambu mencapai tinggi 43 cm?",
  },
  {
    number: 11,
    type: "essay",
    title: "Pola Bilangan Fibonacci",
    content: "Barisan Fibonacci: 1, 1, 2, 3, 5, 8, 13, 21, ...\n\na. Jelaskan aturan pembentukan barisan Fibonacci.\nb. Tuliskan 4 suku berikutnya.\nc. Berapa nilai suku ke-14 dari barisan Fibonacci?",
  },
  {
    number: 12,
    type: "mixed",
    title: "Soal ANBK - Menentukan Pola",
    content: "Perhatikan pernyataan berikut tentang barisan: 5, 15, 45, 135, ...",
    parts: [
      { label: "a.", text: "Setiap suku berikutnya diperoleh dengan mengalikan suku sebelumnya dengan 3." },
      { label: "b.", text: "Selisih antara dua suku berurutan selalu tetap." },
      { label: "c.", text: "Suku ke-6 dari barisan tersebut adalah 3.645." },
      { label: "d.", text: "Suku ke-5 dari barisan tersebut adalah 405." },
    ],
  },
  {
    number: 12,
    type: "essay",
    title: "Soal ANBK - Menentukan Pola",
    content: "Dari pernyataan a, b, c, d di atas:\nTentukan pernyataan mana yang BENAR dan mana yang SALAH. Jelaskan alasanmu!",
  },
];

const uniqueQuestions = questions.filter(
  (q, idx, arr) => arr.findIndex((r) => r.number === q.number && r.type === q.type) === idx
);

const PengertianPolaPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <Sigma className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1" style={{ textShadow: '0 0 20px rgba(34,211,238,0.7)' }}>
            PENGERTIAN POLA DAN BARISAN BILANGAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Pola Bilangan · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 12 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">Tingkat: UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {[
            {
              number: 1,
              title: "Melanjutkan Pola Bilangan",
              content: "Perhatikan barisan bilangan berikut:\n2, 5, 10, 17, 26, ...\nTentukan dua suku berikutnya dari barisan bilangan tersebut dan jelaskan aturan polanya!",
              type: "essay",
            },
            {
              number: 2,
              title: "Suku yang Hilang",
              content: "Temukan nilai yang tepat untuk menggantikan tanda tanya (?) dalam pola berikut:",
              type: "mixed",
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
              type: "essay",
            },
            {
              number: 4,
              title: "Konfigurasi Objek - Pola Titik",
              content: "Perhatikan susunan titik yang membentuk baris ganjil: 1, 3, 5, 7, ...\na. Tuliskan aturan/pola barisannya.\nb. Berapa banyak titik pada susunan ke-8?\nc. Susunan ke berapa yang memiliki 25 titik?",
              type: "essay",
            },
            {
              number: 5,
              title: "Menentukan Suku ke-n",
              content: "Diketahui barisan bilangan: 4, 9, 16, 25, 36, ...",
              type: "mixed",
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
              type: "essay",
            },
            {
              number: 7,
              title: "Pola dari Tabel",
              content: "Perhatikan tabel konfigurasi berikut:",
              type: "mixed",
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
              type: "essay",
            },
            {
              number: 9,
              title: "Barisan Bertingkat",
              content: "Barisan bilangan: 1, 3, 7, 13, 21, 31, ...\n\na. Hitung selisih antara suku-suku berurutan (beda tingkat 1).\nb. Hitung selisih dari barisan beda tingkat 1 (beda tingkat 2).\nc. Tentukan suku ke-8 dari barisan tersebut.",
              type: "essay",
            },
            {
              number: 10,
              title: "Soal Kontekstual - Pertumbuhan Tanaman",
              content: "Sebuah tanaman bambu tumbuh mengikuti pola:\nMinggu ke-1: 10 cm | Minggu ke-2: 13 cm | Minggu ke-3: 16 cm | Minggu ke-4: 19 cm\n\na. Identifikasi pola pertumbuhan bambu tersebut.\nb. Berapa tinggi bambu pada minggu ke-10?\nc. Pada minggu ke berapa bambu mencapai tinggi 43 cm?",
              type: "essay",
            },
            {
              number: 11,
              title: "Pola Barisan Fibonacci",
              content: "Barisan Fibonacci: 1, 1, 2, 3, 5, 8, 13, 21, ...\n\na. Jelaskan aturan pembentukan barisan Fibonacci.\nb. Tuliskan 4 suku berikutnya dari barisan tersebut.\nc. Berapa nilai suku ke-14 dari barisan Fibonacci?",
              type: "essay",
            },
            {
              number: 12,
              title: "Soal ANBK - Evaluasi Pernyataan",
              content: "Perhatikan barisan: 5, 15, 45, 135, ...\nTentukan pernyataan yang BENAR (B) atau SALAH (S) dan berikan alasannya:",
              type: "mixed",
              parts: [
                { label: "(1)", text: "Setiap suku berikutnya diperoleh dengan mengalikan suku sebelumnya dengan 3." },
                { label: "(2)", text: "Selisih antara dua suku berurutan selalu tetap." },
                { label: "(3)", text: "Suku ke-6 dari barisan tersebut adalah 3.645." },
                { label: "(4)", text: "Suku ke-5 dari barisan tersebut adalah 405." },
              ],
            },
          ].map((q, i) => (
            <div
              key={q.number}
              className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-2xl" />

              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center">
                      <span className="text-cyan-300 text-xs font-bold">{q.number}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {q.title && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded">
                          {q.title}
                        </span>
                      </div>
                    )}
                    {q.content && (
                      <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-2">{q.content}</p>
                    )}
                    {q.type === "mixed" && q.parts && (
                      <div className="flex flex-col gap-2 mt-2">
                        {q.parts.map((part, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-cyan-300 text-xs font-bold shrink-0 mt-0.5 min-w-[24px]">{part.label}</span>
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
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/pola-bilangan"); }}
            className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Pola Bilangan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianPolaPage;
