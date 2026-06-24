import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Star } from "lucide-react";

const PolaKhususPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const questions = [
    {
      number: 1,
      title: "Bilangan Segitiga",
      content: "Bilangan segitiga dibentuk dari susunan titik berbentuk segitiga:",
      type: "mixed",
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
      type: "mixed",
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
      type: "mixed",
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
      type: "essay",
    },
    {
      number: 5,
      title: "Pola Jumlah Baris Segitiga Pascal",
      content: "Jumlah bilangan pada setiap baris Segitiga Pascal membentuk pola tersendiri:",
      type: "mixed",
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
      type: "mixed",
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
      type: "essay",
    },
    {
      number: 8,
      title: "Pola Bilangan Kubik",
      content: "Bilangan kubik: 1, 8, 27, 64, 125, ...",
      type: "mixed",
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
      type: "essay",
    },
    {
      number: 10,
      title: "Pola Bilangan Segitiga Bertingkat",
      content: "Jumlah n bilangan asli pertama membentuk bilangan segitiga.",
      type: "mixed",
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
      type: "essay",
    },
    {
      number: 12,
      title: "Pola Bilangan Ganjil dan Persegi",
      content: "Perhatikan hubungan antara bilangan ganjil dan bilangan persegi:",
      type: "mixed",
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
      type: "mixed",
      parts: [
        { label: "(1)", math: "1,\\ 4,\\ 9,\\ 16,\\ 25,\\ ..." },
        { label: "(2)", math: "1,\\ 3,\\ 6,\\ 10,\\ 15,\\ ..." },
        { label: "(3)", math: "2,\\ 6,\\ 12,\\ 20,\\ 30,\\ ..." },
        { label: "(4)", math: "1,\\ 8,\\ 27,\\ 64,\\ 125,\\ ..." },
        { label: "", text: "Pilihan: Bilangan Segitiga / Bilangan Persegi / Bilangan Persegi Panjang / Bilangan Kubik" },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-purple-500/20 border-2 border-purple-400/60 flex items-center justify-center mb-3">
            <Star className="w-7 h-7 text-purple-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-purple-300 text-center mb-1" style={{ textShadow: '0 0 20px rgba(168,85,247,0.7)' }}>
            POLA-POLA KHUSUS
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Pola Bilangan · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-2">
            <span className="text-purple-400 text-xs font-bold">📋 13 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">Tingkat: UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
          <p className="text-purple-300 text-xs font-bold mb-2">📌 Rumus Referensi Cepat</p>
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

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div
              key={q.number}
              className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-slate-900/80 to-violet-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-purple-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-violet-500 rounded-l-2xl" />

              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center">
                      <span className="text-purple-300 text-xs font-bold">{q.number}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {q.title && (
                      <span className="text-purple-400 text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded inline-block mb-2">
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
                            <span className="text-purple-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{part.label}</span>
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
            className="text-sm text-muted-foreground hover:text-purple-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Pola Bilangan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolaKhususPage;
