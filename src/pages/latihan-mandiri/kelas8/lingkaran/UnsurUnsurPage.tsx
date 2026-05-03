import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Circle, ChevronDown, ChevronUp } from "lucide-react";
import CircleDiagram, { CircleDiagramProps } from "./CircleDiagram";

type Part = { label: string; math?: string; text?: string };
type Ans = { label: string; math?: string; text?: string };
type Diff = "Mudah" | "Sedang" | "Sulit" | "HOTS";
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: CircleDiagramProps;
  imageSrc?: string;
  answers?: Ans[];
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
  Q(1, "Jari-Jari Lingkaran", {
    type: "mixed", diff: "Mudah",
    imageSrc: SOAL_IMG,
    parts: [
      { label: "1.", text: "Tentukanlah garis mana saja yang merupakan jari-jari?" },
    ],
    answers: [
      { label: "Jawab:", text: "Jari-jari lingkaran adalah OA, OB, OC, dan OD (garis dari pusat O ke titik di lingkaran)." },
    ],
  }),

  Q(2, "Diameter Lingkaran", {
    type: "mixed", diff: "Mudah",
    parts: [
      { label: "2.", text: "Tentukanlah garis mana saja yang merupakan diameter?" },
    ],
    answers: [
      { label: "Jawab:", text: "Diameter lingkaran adalah AB, karena garis AB melewati pusat O dan menghubungkan dua titik yang berhadapan (A dan B)." },
    ],
  }),

  Q(3, "Tali Busur", {
    type: "mixed", diff: "Mudah",
    parts: [
      { label: "3.", text: "Tentukanlah garis mana saja yang merupakan tali busur?" },
    ],
    answers: [
      { label: "Jawab:", text: "Tali busur adalah AD dan CB. Keduanya menghubungkan dua titik pada lingkaran tetapi tidak melalui pusat O. (AB juga tali busur, namun sekaligus merupakan diameter.)" },
    ],
  }),

  Q(4, "Busur Terpanjang", {
    type: "mixed", diff: "Mudah",
    parts: [
      { label: "4.", text: "Garis manakah yang merupakan busur terpanjang?" },
    ],
    answers: [
      { label: "Jawab:", text: "Busur terpanjang adalah busur CAD, yaitu busur yang membentang dari titik C melalui A hingga D (sisi kiri lingkaran), karena busur ini memiliki panjang busur terbesar di antara busur-busur yang ada pada gambar." },
    ],
  }),

  Q(5, "Daerah I", {
    type: "mixed", diff: "Mudah",
    parts: [
      { label: "5.", text: "Daerah I merupakan …" },
    ],
    answers: [
      { label: "Jawab:", text: "Daerah I merupakan TEMBERENG, yaitu daerah yang dibatasi oleh tali busur CB dan busur minor CB." },
    ],
  }),

  Q(6, "Daerah II", {
    type: "mixed", diff: "Mudah",
    parts: [
      { label: "6.", text: "Daerah II merupakan …" },
    ],
    answers: [
      { label: "Jawab:", text: "Daerah II merupakan JURING (sektor), yaitu daerah yang dibatasi oleh dua jari-jari OB dan OD serta busur BD." },
    ],
  }),

  Q(7, "Juring Terbesar", {
    type: "mixed", diff: "Sedang",
    parts: [
      { label: "7.", text: "Manakah yang merupakan juring terbesar?" },
    ],
    answers: [
      { label: "Jawab:", text: "Juring terbesar adalah daerah kuning-hijau yang luas (bukan daerah I maupun II), yaitu juring yang dibatasi oleh OA, OC, dan busur CA yang lebih panjang. Juring ini memiliki sudut pusat terbesar sehingga luasnya paling besar." },
    ],
  }),

  Q(8, "Garis OE", {
    type: "mixed", diff: "Mudah",
    parts: [
      { label: "8.", text: "Garis OE adalah …" },
    ],
    answers: [
      { label: "Jawab:", text: "Garis OE adalah APOTEMA, yaitu garis yang ditarik dari pusat O tegak lurus ke tali busur AD. OE ⊥ AD dan E merupakan titik kaki tegak lurus tersebut." },
    ],
  }),

  Q(9, "Tali Busur Terpanjang", {
    type: "mixed", diff: "Mudah",
    parts: [
      { label: "9.", text: "Tali busur terpanjang ditunjukkan oleh …" },
    ],
    answers: [
      { label: "Jawab:", text: "Tali busur terpanjang adalah AB, karena AB merupakan diameter yang melewati pusat O. Diameter selalu menjadi tali busur terpanjang dalam suatu lingkaran." },
    ],
  }),

  Q(10, "Sudut Pusat", {
    type: "mixed", diff: "Mudah",
    parts: [
      { label: "10.", text: "Sebutkan salah satu sudut pusat!" },
    ],
    answers: [
      { label: "Jawab:", text: "Contoh sudut pusat: ∠AOB, ∠BOD, ∠COB, ∠AOC, ∠COD, atau ∠AOD. Sudut pusat adalah sudut yang titik sudutnya berada di pusat lingkaran (O) dan kedua kakinya merupakan jari-jari." },
    ],
  }),

  Q(11, "Sudut Keliling", {
    type: "mixed", diff: "Sedang",
    parts: [
      { label: "11.", text: "Sebutkan salah satu sudut keliling!" },
    ],
    answers: [
      { label: "Jawab:", text: "Contoh sudut keliling: ∠CAD (titik sudut di A), ∠CBD (titik sudut di C), atau ∠ACB (titik sudut di A). Sudut keliling adalah sudut yang titik sudutnya terletak pada lingkaran dan kedua kakinya adalah tali busur." },
    ],
  }),

  Q(12, "Sudut Pusat Lingkaran", {
    type: "mixed", diff: "Sedang",
    diagram: {
      size: 250, r: 0.62,
      pts: [
        { angle: 70, label: "A", color: "#f472b6" },
        { angle: 160, label: "B", color: "#f472b6" },
      ],
      radii: [
        { angle: 70, color: "#f472b6" },
        { angle: 160, color: "#f472b6" },
      ],
      angleArcs: [{ vertex: [125, 125], from: 70, to: 160, color: "#f472b6", label: "∠AOB", arcR: 28 }],
    },
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan sudut pusat?" },
      { label: "b.", text: "Titik sudut dari sudut pusat ∠AOB berada di mana?" },
      { label: "c.", math: "\\text{Jika } \\angle AOB = 70°, \\text{ tentukan besar busur AB (dalam derajat).}" },
    ],
    answers: [
      { label: "a.", text: "Sudut pusat adalah sudut yang titik sudutnya berada di pusat lingkaran dan kaki-kakinya adalah jari-jari lingkaran." },
      { label: "b.", text: "Titik sudut ∠AOB berada di pusat lingkaran (titik O)." },
      { label: "c.", math: "\\text{Besar busur AB} = \\angle AOB = 70°" },
    ],
  }),

  Q(13, "Menghitung Jari-Jari dari Diameter", {
    type: "mixed", diff: "Mudah",
    content: "Diketahui sebuah lingkaran dengan diameter-diameter berikut. Tentukan jari-jarinya!",
    parts: [
      { label: "a.", math: "d = 14 \\text{ cm}" },
      { label: "b.", math: "d = 21 \\text{ cm}" },
      { label: "c.", math: "d = 50 \\text{ cm}" },
      { label: "d.", math: "d = 3{,}5 \\text{ cm}" },
    ],
    answers: [
      { label: "a.", math: "r = 14 \\div 2 = 7 \\text{ cm}" },
      { label: "b.", math: "r = 21 \\div 2 = 10{,}5 \\text{ cm}" },
      { label: "c.", math: "r = 50 \\div 2 = 25 \\text{ cm}" },
      { label: "d.", math: "r = 3{,}5 \\div 2 = 1{,}75 \\text{ cm}" },
    ],
  }),

  Q(14, "Unsur Lingkaran — Benar atau Salah", {
    type: "mixed", diff: "Sedang",
    content: "Tentukan pernyataan berikut BENAR (B) atau SALAH (S)!",
    parts: [
      { label: "(1)", text: "Diameter adalah tali busur terpanjang dalam suatu lingkaran." },
      { label: "(2)", text: "Apotema lebih panjang dari jari-jari." },
      { label: "(3)", text: "Juring dibatasi oleh dua jari-jari dan satu busur." },
      { label: "(4)", text: "Tembereng dibatasi oleh dua jari-jari dan satu busur." },
      { label: "(5)", text: "Semua tali busur dalam satu lingkaran memiliki panjang yang sama." },
    ],
    answers: [
      { label: "(1)", text: "BENAR — Diameter melewati pusat sehingga merupakan tali busur terpanjang." },
      { label: "(2)", text: "SALAH — Apotema LEBIH PENDEK dari jari-jari (apotema = kaki, jari-jari = hipotenusa)." },
      { label: "(3)", text: "BENAR — Juring dibatasi 2 jari-jari + 1 busur." },
      { label: "(4)", text: "SALAH — Tembereng dibatasi 1 tali busur + 1 busur (bukan 2 jari-jari)." },
      { label: "(5)", text: "SALAH — Panjang tali busur bergantung pada jaraknya ke pusat." },
    ],
  }),
];

const UnsurUnsurLingkaranPage = () => {
  const navigate = useNavigate();
  const [openAnswers, setOpenAnswers] = useState<Set<number>>(new Set());
  const toggleAnswer = (n: number) => {
    setOpenAnswers(prev => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n); else next.add(n);
      return next;
    });
  };

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
            <span className="text-cyan-400 text-xs font-bold">📋 14 Soal</span>
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

        <div className="mb-4 rounded-2xl overflow-hidden border border-cyan-500/25">
          <div className="bg-cyan-900/30 px-4 py-3 border-b border-cyan-500/20">
            <p className="text-cyan-300 text-xs font-bold">📌 Untuk soal nomor 1 – 11, perhatikan gambar berikut.</p>
          </div>
          <div className="flex justify-center bg-white/95 p-4">
            <img
              src={SOAL_IMG}
              alt="Gambar lingkaran dengan unsur-unsurnya"
              className="max-w-xs w-full object-contain"
            />
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
                    {q.answers && (
                      <div className="mt-3">
                        <button
                          onClick={() => { playPopSound(); toggleAnswer(q.n); }}
                          className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg px-3 py-1.5 transition-all"
                        >
                          {openAnswers.has(q.n) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {openAnswers.has(q.n) ? "Sembunyikan Kunci Jawaban" : "💡 Lihat Kunci Jawaban"}
                        </button>
                        {openAnswers.has(q.n) && (
                          <div className="mt-2 bg-emerald-900/20 border border-emerald-500/25 rounded-xl p-3">
                            <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2">✅ Kunci Jawaban</p>
                            <div className="flex flex-col gap-1.5">
                              {q.answers.map((a, ai) => (
                                <div key={ai} className="flex items-start gap-2">
                                  <span className="text-emerald-300 text-xs font-bold shrink-0 min-w-[28px] mt-0.5">{a.label}</span>
                                  {a.math
                                    ? <div className="text-white/90 text-sm overflow-x-auto"><InlineMath math={a.math} /></div>
                                    : <p className="font-body text-sm text-white/80 leading-relaxed">{a.text}</p>
                                  }
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
