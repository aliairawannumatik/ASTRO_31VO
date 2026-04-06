import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const questions = [
  { number: 1, math: "25 + 48 : (-8) = ...", type: "math" },
  { number: 2, math: "64 - 26 \\times (-4) = ...", type: "math" },
  { number: 3, math: "-35 - 9 \\times (-6) = ...", type: "math" },
  { number: 4, math: "12 + 120 : 10 \\times (-5) = ...", type: "math" },
  { number: 5, math: "21 - 24 \\times (-6) : 12 = ...", type: "math" },
  { number: 6, math: "45 + 144 : 16 \\times (-7) = ...", type: "math" },
  { number: 7, math: "80 : 5 + 9 \\times (-11) = ...", type: "math" },
  { number: 8, math: "14 + 90 : (-18) - 8 \\times 6 = ...", type: "math" },
  { number: 9, math: "30 - 7 \\times 9 + 156 : (-12) = ...", type: "math" },
  { number: 10, math: "126 : 9 \\times (-13) - 6 \\times 17 = ...", type: "math" },
  { number: 11, math: "-25 \\times (8 + (-9)) + (2 - 7) = ...", type: "math" },
  { number: 12, math: "(-20) + 8 \\times 5 - 18 : (-3) = ...", type: "math" },
  {
    number: 13,
    content: `Dalam kompetensi Bahasa Inggris yang terdiri dari 50 soal, peserta akan mendapatkan skor 4 untuk setiap jawaban benar, skor -2 untuk setiap jawaban salah, dan skor -1 untuk soal yang tidak dijawab. Jika Budi menjawab 44 soal dan yang benar 36 soal, maka skor yang diperoleh Budi adalah ...`,
    type: "essay"
  },
  {
    number: 14,
    content: `Dalam suatu pertandingan setiap kemenangan mendapat nilai 3, seri bernilai 1 dan kalah bernilai -2. Jika tim SMPN 28 BDG bermain sebanyak 20 kali dengan meraih 10 kemenangan dan 4 seri, maka nilai yang diperoleh SMPN 28 BDG adalah ...`,
    type: "essay"
  },
  {
    number: 15,
    content: `Bus Trans Jakarta berisi penumpang berangkat dari terminal ke pasar, di halte pertama turun 4 orang, di halte kedua naik 2 orang sampai di pasar ternyata ada 15 orang. berapa banyak penumpang yang naik pada terminal?`,
    type: "essay"
  },
  {
    number: 16,
    content: `Perhatikan suhu udara di beberapa negara berikut!
Wina -7°C
Soul -1°C
Baghdad 39°C
Surabaya 33°C
Selisih suhu udara yang benar di bawah ini adalah.....
- Selisih suhu udara Wina dan Soul -6°C
- Selisih suhu udara Baghdad dan Wina 30°C
- Selisih suhu udara Surabaya dan Soul adalah 34°C
- Selisih udara Surabaya dan Wina adalah 39°C`,
    type: "essay"
  },
  {
    number: 17,
    content: `Pa Bangun menjual gorengan dengan harga Rp. 5000 per 4 gorengan. Bagus membeli 32 gorengan. Jika Ia membayar dengan uang lima puluh ribu, uang kembali yang diterima Bagus adalah sebesar........`,
    type: "essay"
  },
  {
    number: 18,
    content: `Suhu di kota Moskow 11°C. Pada saat turun salju, suhunya turun 4°C setiap 15 menit. Suhu di kota tersebut setelah turun salju 1 jam adalah ..`,
    type: "essay"
  },
  {
    number: 19,
    content: `Operasi "*" berarti kalikan bilangan pertama dengan dua kali bilangan ke dua, kemudian tambahkan hasilnya dengan bilangan ke dua. Hasil dari 5 * 3 adalah .......`,
    type: "essay"
  },
  {
    number: 20,
    content: `Operasi " # " artinya kalikan bilangan pertama dengan bilangan kedua, kemudian kurangkan hasilnya dengan dua kali bilangan kedua. Hasil dari 5 # - 4 adalah......`,
    type: "essay"
  },
];

const OperasiCampuranPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OPERASI HITUNG CAMPURAN BILANGAN BULAT
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
                  {q.type === "math" ? (
                    <div className="text-white">
                      <InlineMath math={q.math!} />
                    </div>
                  ) : (
                    <p className="font-body text-sm text-white whitespace-pre-line">{q.content}</p>
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

export default OperasiCampuranPage;
