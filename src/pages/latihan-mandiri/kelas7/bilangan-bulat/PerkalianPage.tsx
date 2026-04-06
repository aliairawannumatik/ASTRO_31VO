import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const questions = [
  {
    number: 1,
    content: `Hitunglah perkalian bilangan berikut!`,
    subItems: [
      { label: "a.", math: "7 \\times (-9)" },
      { label: "b.", math: "-6 \\times (-11)" },
      { label: "c.", math: "-4 \\times 0 \\times (-25)" },
    ],
    type: "essay"
  },
  {
    number: 2,
    content: `Tentukan angka pengganti huruf-huruf berikut sehingga menjadi persamaan matematika yang benar!`,
    subItems: [
      { label: "a.", math: "p \\times (-7) = -63" },
      { label: "b.", math: "q \\times (-12) = 96" },
      { label: "c.", math: "20 \\times (-4) \\times r = 160" },
      { label: "d.", math: "-6 \\times 15 \\times s = 270" },
    ],
    type: "essay"
  },
  {
    number: 3,
    content: `Hitunglah hasil dari operasi bilangan campuran berikut!`,
    subItems: [
      { label: "a.", math: "-7 \\times (-25 + 14)" },
      { label: "b.", math: "[-15 - (-40)] \\times (-12)" },
      { label: "c.", math: "[18 \\times (-6)] + [-22 \\times (-5)]" },
    ],
    type: "essay"
  },
  {
    number: 4,
    content: `Suhu di dalam sebuah lemari pendingin daging adalah -6°C. Ketika terjadi pemadaman listrik, suhu di dalam lemari pendingin tersebut naik sebesar 2°C setiap 5 menit. Tentukan suhu akhir di dalam lemari pendingin tersebut jika listrik mati selama 30 menit!`,
    type: "essay"
  },
  {
    number: 5,
    content: `Dalam sebuah olimpiade matematika tingkat daerah yang terdiri dari 40 soal, peserta akan mendapat nilai 4 untuk setiap jawaban yang benar, nilai -2 untuk setiap jawaban yang salah, dan nilai -1 untuk soal yang dibiarkan kosong (tidak dijawab). Jika seorang peserta berhasil menjawab 31 soal dengan benar dan ada 3 soal yang tidak dijawab, berapakah total nilai akhir yang diperoleh peserta tersebut?`,
    type: "essay"
  },
];

const PerkalianPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PERKALIAN BILANGAN BULAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 7 - Bilangan Bulat - Latihan Mandiri</p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div
              key={q.number}
              className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4 animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div className="flex items-start gap-3">
                <span className="bg-accent/20 text-accent text-xs font-bold px-2 py-1 rounded shrink-0">
                  {q.number}
                </span>
                <div className="flex-1">
                  <p className="font-body text-sm text-white whitespace-pre-line mb-2">{q.content}</p>
                  {q.subItems && (
                    <div className="flex flex-col gap-1 ml-2">
                      {q.subItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-white/70 text-sm">{item.label}</span>
                          <InlineMath math={item.math} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/bilangan-bulat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Bilangan Bulat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerkalianPage;
