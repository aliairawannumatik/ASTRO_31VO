import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Zap } from "lucide-react";

const PolaGeometriPage = () => {
  const navigate = useNavigate();

  const questions = [
    {
      number: 1,
      title: "Menentukan Rasio Barisan Geometri",
      content: "Diketahui barisan geometri: 2, 6, 18, 54, ...",
      type: "mixed",
      parts: [
        { label: "a.", text: "Tentukan suku pertama (a) dan rasio (r) barisan tersebut." },
        { label: "b.", math: "\\text{Tuliskan rumus } U_n \\text{ dari barisan tersebut.}" },
        { label: "c.", math: "\\text{Hitung nilai } U_8." },
      ],
    },
    {
      number: 2,
      title: "Menentukan Rasio dari Dua Suku",
      content: "Dalam suatu barisan geometri diketahui:",
      type: "mixed",
      parts: [
        { label: "Info:", math: "U_2 = 6 \\quad \\text{dan} \\quad U_5 = 162" },
        { label: "a.", text: "Tentukan rasio (r) barisan tersebut." },
        { label: "b.", text: "Tentukan suku pertama (a)." },
        { label: "c.", math: "\\text{Tentukan nilai } U_7." },
      ],
    },
    {
      number: 3,
      title: "Barisan Geometri Menurun",
      content: "Diketahui barisan geometri: 192, 96, 48, 24, ...",
      type: "mixed",
      parts: [
        { label: "a.", math: "\\text{Tentukan rasio } r." },
        { label: "b.", math: "\\text{Hitung } U_8." },
        { label: "c.", text: "Suku ke berapa yang bernilai 3/4?" },
      ],
    },
    {
      number: 4,
      title: "Jumlah n Suku Pertama Deret Geometri",
      content: "Rumus jumlah n suku pertama deret geometri:",
      type: "mixed",
      parts: [
        { label: "r > 1:", math: "S_n = \\frac{a(r^n - 1)}{r - 1}" },
        { label: "r < 1:", math: "S_n = \\frac{a(1 - r^n)}{1 - r}" },
        { label: "Soal:", text: "Hitung jumlah 6 suku pertama dari barisan: 1, 3, 9, 27, ..." },
      ],
    },
    {
      number: 5,
      title: "Soal UN - Barisan Geometri",
      content: "Suku pertama barisan geometri adalah 3 dan suku ke-5 adalah 48.",
      type: "mixed",
      parts: [
        { label: "a.", text: "Tentukan rasio barisan tersebut." },
        { label: "b.", math: "\\text{Hitung } U_{10}." },
        { label: "c.", math: "\\text{Hitung } S_8." },
      ],
    },
    {
      number: 6,
      title: "Aplikasi Geometri - Pertumbuhan Bakteri",
      content: "Sebuah koloni bakteri berkembang biak dengan cara membelah diri menjadi 2 setiap 30 menit. Jumlah awal bakteri adalah 1.\n\na. Tuliskan barisan jumlah bakteri dari menit ke-0 hingga menit ke-150.\nb. Berapa jumlah bakteri setelah 5 jam?\nc. Tuliskan rumus jumlah bakteri setelah t menit.",
      type: "essay",
    },
    {
      number: 7,
      title: "Soal TKA - Barisan Geometri Desimal",
      content: "Diketahui barisan geometri:",
      type: "mixed",
      parts: [
        { label: "Barisan:", math: "0{,}5 \\quad 1{,}5 \\quad 4{,}5 \\quad 13{,}5 \\quad ..." },
        { label: "a.", math: "\\text{Tentukan } U_6." },
        { label: "b.", math: "\\text{Hitung } S_5." },
        { label: "c.", text: "Tuliskan rumus Un dari barisan tersebut." },
      ],
    },
    {
      number: 8,
      title: "Menyisipkan Bilangan dalam Barisan Geometri",
      content: "Di antara bilangan 2 dan 162, disisipkan 3 buah bilangan sehingga terbentuk barisan geometri.\n\na. Tentukan rasio barisan yang terbentuk.\nb. Tuliskan barisan lengkapnya.\nc. Hitung jumlah semua bilangan dalam barisan tersebut.",
      type: "essay",
    },
    {
      number: 9,
      title: "Deret Geometri Tak Hingga",
      content: "Deret geometri tak hingga memiliki jumlah jika |r| < 1, dengan rumus:",
      type: "mixed",
      parts: [
        { label: "Rumus:", math: "S_\\infty = \\frac{a}{1 - r}" },
        { label: "Soal 1:", math: "\\text{Hitung jumlah: } 8 + 4 + 2 + 1 + \\frac{1}{2} + \\cdots" },
        { label: "Soal 2:", math: "\\text{Hitung jumlah: } 27 + 9 + 3 + 1 + \\cdots" },
      ],
    },
    {
      number: 10,
      title: "Soal ANBK - Aplikasi Pertumbuhan Investasi",
      content: "Seseorang menginvestasikan uang sebesar Rp1.000.000. Investasi tersebut bertumbuh 20% setiap tahun.\n\na. Tuliskan nilai investasi dari tahun ke-1 hingga tahun ke-5 sebagai barisan geometri.\nb. Berapa nilai investasi pada tahun ke-8?\nc. Pada tahun ke berapa nilai investasi melebihi Rp5.000.000?",
      type: "essay",
    },
    {
      number: 11,
      title: "Soal UN - Gabungan Aritmetika dan Geometri",
      content: "Suku ke-3 dan suku ke-6 suatu barisan geometri masing-masing adalah 24 dan 192.",
      type: "mixed",
      parts: [
        { label: "a.", text: "Tentukan rasio dan suku pertama barisan tersebut." },
        { label: "b.", math: "\\text{Tentukan } U_9." },
        { label: "c.", math: "\\text{Hitung } S_7." },
      ],
    },
    {
      number: 12,
      title: "Soal ANBK - Identifikasi Jenis Barisan",
      content: "Tentukan apakah setiap barisan berikut merupakan barisan ARITMETIKA, GEOMETRI, atau BUKAN KEDUANYA. Berikan alasan dan tentukan rumus Un-nya jika ada!",
      type: "mixed",
      parts: [
        { label: "(1)", math: "1,\\ 4,\\ 9,\\ 16,\\ 25,\\ ..." },
        { label: "(2)", math: "5,\\ 10,\\ 20,\\ 40,\\ 80,\\ ..." },
        { label: "(3)", math: "3,\\ 7,\\ 11,\\ 15,\\ 19,\\ ..." },
        { label: "(4)", math: "100,\\ 10,\\ 1,\\ 0{,}1,\\ ..." },
        { label: "(5)", math: "2,\\ 3,\\ 5,\\ 7,\\ 11,\\ ..." },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <Zap className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1" style={{ textShadow: '0 0 20px rgba(251,146,60,0.7)' }}>
            POLA GEOMETRI
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Pola Bilangan · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 12 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">Tingkat: UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-3">📌 Rumus Barisan Geometri</p>
          <div className="flex flex-col gap-3">
            {[
              { label: "Suku ke-n", math: "U_n = a \\cdot r^{n-1}" },
              { label: "Jumlah n suku (r > 1)", math: "S_n = \\frac{a(r^n - 1)}{r - 1}" },
              { label: "Jumlah n suku (r < 1)", math: "S_n = \\frac{a(1 - r^n)}{1 - r}" },
              { label: "Deret tak hingga (|r| < 1)", math: "S_\\infty = \\frac{a}{1 - r}" },
            ].map((r, i) => (
              <div key={i} className="bg-white/5 rounded-lg px-4 py-2">
                <p className="text-white/40 text-[10px] mb-1">{r.label}</p>
                <div className="text-orange-200">
                  <BlockMath math={r.math} />
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
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-amber-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500 rounded-l-2xl" />

              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center">
                      <span className="text-orange-300 text-xs font-bold">{q.number}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {q.title && (
                      <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">
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
                            <span className="text-orange-300 text-xs font-bold shrink-0 mt-0.5 min-w-[40px]">{part.label}</span>
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
            className="text-sm text-muted-foreground hover:text-orange-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Pola Bilangan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolaGeometriPage;
