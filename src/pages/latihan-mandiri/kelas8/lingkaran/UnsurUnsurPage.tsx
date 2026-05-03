import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Circle } from "lucide-react";
import CircleDiagram, { CircleDiagramProps } from "./CircleDiagram";

type Part = { label: string; math?: string; text?: string };
type Diff = "Mudah" | "Sedang" | "Sulit" | "HOTS";
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: CircleDiagramProps;
  imageSrc?: string;
  diff?: Diff;
  type: "essay" | "mixed" | "diagram-only";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const diffColor: Record<Diff, string> = {
  Mudah: "text-green-400 bg-green-500/10 border-green-500/30",
  Sedang: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  Sulit: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  HOTS: "text-red-400 bg-red-500/10 border-red-500/30",
};

const SOAL_IMG = "/soal-lingkaran-unsur.png";

const questions: Q[] = [
  Q(1, "Unsur-Unsur Lingkaran", {
    type: "mixed", diff: "Mudah",
    imageSrc: SOAL_IMG,
    parts: [
      { label: "a.", text: "Tentukanlah garis mana saja yang merupakan jari-jari?" },
      { label: "b.", text: "Tentukanlah garis mana saja yang merupakan diameter?" },
      { label: "c.", text: "Tentukanlah garis mana saja yang merupakan tali busur?" },
      { label: "d.", text: "Garis manakah yang merupakan busur terpanjang?" },
      { label: "e.", text: "Daerah I merupakan …" },
      { label: "f.", text: "Daerah II merupakan …" },
      { label: "g.", text: "Manakah yang merupakan juring terbesar?" },
      { label: "h.", text: "Garis OE adalah …" },
      { label: "i.", text: "Tali busur terpanjang ditunjukkan oleh …" },
      { label: "j.", text: "Sebutkan salah satu sudut pusat!" },
      { label: "k.", text: "Sebutkan salah satu sudut keliling!" },
    ],
  }),

  Q(2, "Menghitung Jari-Jari dari Diameter", {
    type: "mixed", diff: "Mudah",
    content: "Diketahui sebuah lingkaran dengan diameter-diameter berikut. Tentukan jari-jarinya!",
    parts: [
      { label: "a.", math: "d = 14 \\text{ cm}" },
      { label: "b.", math: "d = 21 \\text{ cm}" },
      { label: "c.", math: "d = 50 \\text{ cm}" },
      { label: "d.", math: "d = 3{,}5 \\text{ cm}" },
    ],
  }),

  Q(3, "Menghitung Diameter dari Jari-Jari", {
    type: "mixed", diff: "Mudah",
    content: "Diketahui sebuah lingkaran dengan jari-jari berikut. Tentukan diameternya!",
    parts: [
      { label: "a.", math: "r = 7 \\text{ cm}" },
      { label: "b.", math: "r = 15 \\text{ cm}" },
      { label: "c.", math: "r = 28 \\text{ cm}" },
      { label: "d.", math: "r = 4{,}5 \\text{ cm}" },
    ],
  }),

  Q(4, "Unsur Lingkaran — Benar atau Salah", {
    type: "mixed", diff: "Sedang",
    content: "Tentukan pernyataan berikut BENAR (B) atau SALAH (S)!",
    parts: [
      { label: "a.", text: "Panjang jari-jari lingkaran sama dengan setengah panjang diameter lingkaran itu." },
      { label: "b.", text: "Setiap garis tengah lingkaran (diameter) adalah tali busur." },
      { label: "c.", text: "Setiap tali busur merupakan garis tengah lingkaran." },
      { label: "d.", text: "Panjang tali busur yang tidak melalui pusat lebih panjang dari diameter." },
      { label: "e.", text: "Diameter adalah tali busur terpanjang dalam suatu lingkaran." },
      { label: "f.", text: "Apotema lebih panjang dari jari-jari." },
      { label: "g.", text: "Juring dibatasi oleh dua jari-jari dan satu busur." },
      { label: "h.", text: "Tembereng dibatasi oleh dua jari-jari dan satu busur." },
      { label: "i.", text: "Semua tali busur dalam satu lingkaran memiliki panjang yang sama." },
    ],
  }),
  Q(5, "Keliling dan Luas Lingkaran", {
    type: "mixed", diff: "Sedang",
    content: "Diketahui sebuah lingkaran dengan diameter berikut. Tentukan keliling dan luas lingkaran tersebut! (gunakan π = 22/7)",
    parts: [
      { label: "a.", math: "d = 14 \\text{ cm}" },
      { label: "b.", math: "d = 10 \\text{ cm}" },
      { label: "c.", math: "d = 28 \\text{ cm}" },
      { label: "d.", math: "d = 35 \\text{ cm}" },
    ],
  }),
];

const UnsurUnsurLingkaranPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(34,211,238,0.7)' }}>
            UNSUR-UNSUR LINGKARAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Lingkaran · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 5 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-cyan-300 text-xs font-bold mb-2">📌 Unsur-Unsur Lingkaran</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { n: "Jari-jari (r)", d: "Pusat ke titik di lingkaran", c: "text-cyan-400" },
              { n: "Diameter (d)", d: "d = 2r, tali busur terpanjang", c: "text-blue-400" },
              { n: "Busur", d: "Bagian garis lengkung lingkaran", c: "text-yellow-400" },
              { n: "Tali Busur", d: "Garis lurus hubungkan 2 titik", c: "text-pink-400" },
              { n: "Apotema", d: "Jarak pusat ke tali busur", c: "text-violet-400" },
              { n: "Juring", d: "Daerah 2 jari-jari + busur", c: "text-orange-400" },
              { n: "Tembereng", d: "Daerah tali busur + busur", c: "text-green-400" },
              { n: "Sudut Pusat", d: "Sudut dengan vertex di pusat", c: "text-red-400" },
            ].map(r => (
              <div key={r.n} className="bg-white/5 rounded-lg px-3 py-2">
                <span className={`font-bold ${r.c}`}>{r.n}: </span>
                <span className="text-white/60">{r.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                    <span className="text-cyan-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded">
                        {q.title}
                      </span>
                      {q.diff && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${diffColor[q.diff]}`}>
                          {q.diff}
                        </span>
                      )}
                    </div>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.imageSrc && (
                      <div className="mb-3 flex justify-center rounded-xl overflow-hidden bg-white/95 p-3">
                        <img src={q.imageSrc} alt="Gambar soal" className="max-w-[220px] w-full object-contain" />
                      </div>
                    )}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CircleDiagram {...q.diagram} />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-cyan-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{p.text}</p>
                            }
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsurUnsurLingkaranPage;
