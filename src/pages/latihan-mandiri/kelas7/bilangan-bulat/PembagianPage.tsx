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
    content: `Tentukan hasil pembagian berikut:`,
    subItems: [
      { label: "a.", math: "-120 : 8 = ..." },
      { label: "b.", math: "144 : (-12) = ..." },
      { label: "c.", math: "-105 : (-7) = ..." },
      { label: "d.", math: "0 : (-25) = ..." },
      { label: "e.", text: "-85 : 0 = ... (Coba cek apakah ini bisa dihitung?)" },
    ],
    type: "essay"
  },
  {
    number: 2,
    content: `Hitunglah hasil operasi berikut:`,
    subItems: [
      { label: "a.", math: "[(-80) : 4] : (-5) = ..." },
      { label: "b.", math: "150 : [(-30) : 2] = ..." },
      { label: "c.", math: "[(-144) : (-12)] : 3 = ..." },
    ],
    type: "essay"
  },
  {
    number: 3,
    content: `Selesaikan perhitungan berikut:`,
    subItems: [
      { label: "a.", math: "[15 \\times (-4)] : [(-10) + 4] = ..." },
      { label: "b.", math: "[(-25) - 15] : [60 : (-12)] = ..." },
      { label: "c.", math: "[0 \\times (-99)] : [14 + (-16)] = ..." },
    ],
    type: "essay"
  },
  {
    number: 4,
    content: `Jika x = -36, y = 9, dan z = -3, hitunglah:`,
    subItems: [
      { label: "a.", math: "(x \\times y) : z = ..." },
      { label: "b.", math: "(x + y) : z = ..." },
      { label: "c.", math: "x : (y - z) = ..." },
    ],
    type: "essay"
  },
  {
    number: 5,
    content: `Sebuah sekolah akan karyawisata dengan total peserta 185 siswa dan 15 guru. Mereka menyewa beberapa minibus yang masing-masing berkapasitas 16 tempat duduk.
a. Berapa jumlah minimal minibus yang harus disewa agar semua peserta bisa duduk?
b. Jika semua bus sudah terisi peserta, berapa total kursi yang masih kosong?`,
    type: "essay"
  },
];

const PembagianPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          PEMBAGIAN BILANGAN BULAT
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
                          {item.math ? (
                            <InlineMath math={item.math} />
                          ) : (
                            <span className="text-white text-sm">{item.text}</span>
                          )}
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

export default PembagianPage;
