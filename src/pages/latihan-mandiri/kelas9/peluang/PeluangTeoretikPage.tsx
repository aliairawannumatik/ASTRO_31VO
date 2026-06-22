import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Calculator } from "lucide-react";

const FreqTable = ({ headers, rows, caption }: { headers: string[]; rows: (string | number)[][]; caption?: string }) => (
  <div className="overflow-x-auto rounded-xl border border-violet-500/30 my-2">
    {caption && <div className="text-[10px] text-violet-300/70 font-bold text-center pt-2 px-2">{caption}</div>}
    <table className="min-w-full text-xs font-body">
      <thead>
        <tr className="bg-violet-900/40">
          {headers.map((h, i) => (
            <th key={i} className="px-3 py-2 text-violet-200 font-bold text-center border-b border-violet-500/30">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? "bg-white/3" : "bg-violet-900/10"}>
            {row.map((cell, ci) => (
              <td key={ci} className="px-3 py-2 text-center text-white/80 border-b border-white/5">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DiceGrid = ({ highlight }: { highlight?: (i: number, j: number) => boolean }) => (
  <div className="overflow-x-auto rounded-xl border border-violet-500/30 my-2">
    <table className="text-[10px] font-body">
      <thead>
        <tr className="bg-violet-900/50">
          <th className="px-2 py-1 text-violet-300 border border-violet-500/20 w-10">🎲₁\🎲₂</th>
          {[1,2,3,4,5,6].map(n => (
            <th key={n} className="px-2 py-1 text-violet-300 border border-violet-500/20 w-10">{n}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[1,2,3,4,5,6].map(i => (
          <tr key={i}>
            <td className="px-2 py-1 text-violet-300 font-bold bg-violet-900/40 border border-violet-500/20 text-center">{i}</td>
            {[1,2,3,4,5,6].map(j => (
              <td key={j} className={`px-1 py-1 border border-violet-500/10 text-center transition-colors ${highlight && highlight(i,j) ? "bg-violet-400/30 text-violet-200 font-bold" : "text-white/60"}`}>
                ({i},{j})
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CardDeck = ({ highlight }: { highlight: (suit: string, val: string) => boolean }) => {
  const suits = ["♠","♥","♦","♣"];
  const vals = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  return (
    <div className="overflow-x-auto rounded-xl border border-violet-500/30 my-2">
      <table className="text-[9px] font-body">
        <thead>
          <tr className="bg-violet-900/50">
            <th className="px-1 py-1 text-violet-300 border border-violet-500/20">Suit↓ Val→</th>
            {vals.map(v => <th key={v} className="px-1 py-1 text-violet-300 border border-violet-500/20">{v}</th>)}
          </tr>
        </thead>
        <tbody>
          {suits.map(s => (
            <tr key={s}>
              <td className={`px-1 py-1 font-bold border border-violet-500/20 text-center ${s==="♥"||s==="♦" ? "text-red-400" : "text-white/80"}`}>{s}</td>
              {vals.map(v => (
                <td key={v} className={`px-1 py-1 border border-violet-500/10 text-center ${highlight(s,v) ? "bg-violet-400/30 text-violet-200 font-bold" : "text-white/40"}`}>
                  {s}{v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Peluang – Dadu Angka Prima", {
    type: "mixed",
    content: "Sebuah dadu dilempar sekali. Tentukan peluang muncul angka prima.",
    parts: [
      { label: "a.", text: "Sebutkan angka-angka prima yang ada pada dadu." },
      { label: "b.", math: "n(A) = \\ldots, \\quad n(S) = 6" },
      { label: "c.", math: "P(\\text{prima}) = \\frac{n(A)}{n(S)} = \\ldots" },
    ],
  }),
  Qn(2, "Peluang – Koin Tunggal", {
    type: "mixed",
    content: "Sebuah koin dilempar sekali. Hitunglah:",
    parts: [
      { label: "a.", math: "P(\\text{Angka}) = \\ldots" },
      { label: "b.", math: "P(\\text{Gambar}) = \\ldots" },
      { label: "c.", math: "P(\\text{Angka}) + P(\\text{Gambar}) = \\ldots \\text{ (harus = 1)}" },
    ],
  }),
  Qn(3, "Peluang – Dua Koin", {
    type: "mixed",
    content: "Dua koin dilempar bersamaan. Ruang sampel: {AA, AG, GA, GG}.",
    parts: [
      { label: "a.", math: "P(\\text{keduanya Angka}) = \\frac{\\ldots}{4} = \\ldots" },
      { label: "b.", math: "P(\\text{tepat 1 Angka}) = \\frac{\\ldots}{4} = \\ldots" },
      { label: "c.", math: "P(\\text{paling sedikit 1 Gambar}) = \\frac{\\ldots}{4} = \\ldots" },
    ],
  }),
  Qn(4, "Peluang – Dua Dadu, Jumlah 7", {
    type: "mixed",
    diagram: <DiceGrid highlight={(i,j) => i+j===7} />,
    content: "Dua dadu dilempar bersamaan.",
    parts: [
      { label: "a.", text: "Sebutkan semua titik sampel dengan jumlah = 7 (diarsir)." },
      { label: "b.", math: "P(\\text{jumlah} = 7) = \\frac{\\ldots}{36} = \\ldots" },
      { label: "c.", math: "P(\\text{jumlah} \\neq 7) = 1 - \\frac{6}{36} = \\ldots" },
    ],
  }),
  Qn(5, "Peluang Kartu – As dari Remi", {
    type: "mixed",
    diagram: <CardDeck highlight={(s,v) => v==="A"} />,
    content: "Satu kartu diambil dari 52 kartu remi. Kartu As ditandai.",
    parts: [
      { label: "a.", math: "n(\\text{As}) = \\ldots, \\quad n(S) = 52" },
      { label: "b.", math: "P(\\text{As}) = \\frac{4}{52} = \\frac{1}{\\ldots}" },
      { label: "c.", math: "P(\\text{bukan As}) = 1 - \\frac{1}{13} = \\ldots" },
    ],
  }),
  Qn(6, "Peluang Kartu – Kartu Merah", {
    type: "mixed",
    diagram: <CardDeck highlight={(s,v) => s==="♥"||s==="♦"} />,
    content: "Satu kartu diambil dari 52 kartu remi. Kartu merah (♥ dan ♦) ditandai.",
    parts: [
      { label: "a.", math: "n(\\text{merah}) = \\ldots" },
      { label: "b.", math: "P(\\text{merah}) = \\frac{\\ldots}{52} = \\frac{1}{\\ldots}" },
      { label: "c.", math: "P(\\text{hitam}) = \\frac{\\ldots}{52} = \\frac{1}{\\ldots}" },
    ],
  }),
  Qn(7, "Peluang – Bola dalam Kantong", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Isi kantong"
        headers={["Warna","Merah","Biru","Kuning","Total"]}
        rows={[["Banyak",6,4,2,12]]}
      />
    ),
    content: "Sebuah kantong berisi bola seperti pada tabel. Satu bola diambil acak.",
    parts: [
      { label: "a.", math: "P(\\text{Merah}) = \\frac{6}{12} = \\ldots" },
      { label: "b.", math: "P(\\text{Biru}) = \\frac{4}{12} = \\ldots" },
      { label: "c.", math: "P(\\text{bukan Kuning}) = \\frac{6+4}{12} = \\ldots" },
    ],
  }),
  Qn(8, "Peluang – Kartu Bernomor 1–20", {
    type: "mixed",
    content: "Kartu bernomor 1–20 disimpan dalam kotak. Satu kartu diambil acak.",
    parts: [
      { label: "a.", math: "P(\\text{prima}) = \\frac{\\ldots}{20}" },
      { label: "b.", math: "P(\\text{kelipatan 4}) = \\frac{\\ldots}{20}" },
      { label: "c.", math: "P(\\text{bilangan kuadrat}) = \\frac{\\ldots}{20}" },
    ],
  }),
  Qn(9, "Peluang Dua Dadu – Jumlah Genap", {
    type: "mixed",
    diagram: <DiceGrid highlight={(i,j) => (i+j)%2===0} />,
    parts: [
      { label: "a.", text: "Sebutkan semua titik sampel dengan jumlah genap." },
      { label: "b.", math: "n(\\text{jumlah genap}) = \\ldots" },
      { label: "c.", math: "P(\\text{jumlah genap}) = \\frac{\\ldots}{36} = \\ldots" },
    ],
  }),
  Qn(10, "Peluang – Spinner", {
    type: "mixed",
    content: "Sebuah spinner dibagi menjadi 8 sektor sama besar bernomor 1 sampai 8. Spinner diputar sekali.",
    parts: [
      { label: "a.", math: "P(\\text{angka prima}) = \\frac{\\ldots}{8}" },
      { label: "b.", math: "P(\\text{angka genap}) = \\frac{\\ldots}{8}" },
      { label: "c.", math: "P(\\text{angka} > 5) = \\frac{\\ldots}{8}" },
    ],
  }),
  Qn(11, "Peluang – Kelereng Campuran", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Isi kotak kelereng"
        headers={["Warna","Merah","Putih","Hijau","Hitam","Total"]}
        rows={[["Banyak",5,3,7,5,20]]}
      />
    ),
    parts: [
      { label: "a.", math: "P(\\text{Hijau}) = \\frac{7}{20} = \\ldots" },
      { label: "b.", math: "P(\\text{Merah atau Hitam}) = \\frac{5+5}{20} = \\ldots" },
      { label: "c.", math: "P(\\text{bukan Putih}) = \\frac{20-3}{20} = \\ldots" },
    ],
  }),
  Qn(12, "Soal UN – Peluang Bola", {
    type: "mixed",
    content: "Dalam sebuah kantong terdapat 5 bola merah, 3 bola putih, dan 2 bola kuning. Satu bola diambil secara acak.",
    parts: [
      { label: "a.", math: "P(\\text{Putih}) = \\frac{3}{10} = \\ldots" },
      { label: "b.", math: "P(\\text{Merah atau Putih}) = \\frac{5+3}{10} = \\ldots" },
      { label: "c.", math: "P(\\text{bukan Merah}) = 1 - \\frac{5}{10} = \\ldots" },
    ],
  }),
  Qn(13, "Peluang – Dua Dadu, Hasil Kali 12", {
    type: "mixed",
    diagram: <DiceGrid highlight={(i,j) => i*j===12} />,
    parts: [
      { label: "a.", text: "Sebutkan titik sampel dengan hasil kali = 12." },
      { label: "b.", math: "P(\\text{hasil kali} = 12) = \\frac{\\ldots}{36}" },
      { label: "c.", text: "Lebih besar mana: P(hasil kali = 6) atau P(hasil kali = 12)?" },
    ],
  }),
  Qn(14, "Peluang – Kartu As Merah", {
    type: "mixed",
    diagram: <CardDeck highlight={(s,v) => v==="A" && (s==="♥"||s==="♦")} />,
    parts: [
      { label: "a.", math: "n(\\text{As Merah}) = \\ldots" },
      { label: "b.", math: "P(\\text{As Merah}) = \\frac{2}{52} = \\frac{1}{\\ldots}" },
      { label: "c.", text: "Berapa peluang terambil kartu As hitam?" },
    ],
  }),
  Qn(15, "Peluang – Soal Cerita (Undi Nama)", {
    type: "mixed",
    content: "Kelas 9A terdiri dari 15 perempuan dan 10 laki-laki. Satu siswa dipilih sebagai pembawa bendera.",
    parts: [
      { label: "a.", math: "P(\\text{perempuan}) = \\frac{15}{25} = \\ldots" },
      { label: "b.", math: "P(\\text{laki-laki}) = \\frac{10}{25} = \\ldots" },
      { label: "c.", text: "Apakah peluang terpilihnya perempuan lebih besar? Berapa kali lebih besar?" },
    ],
  }),
  Qn(16, "Soal TKA – Peluang dari Proporsi", {
    type: "mixed",
    diagram: (
      <FreqTable
        caption="Data siswa berdasarkan hobi"
        headers={["Hobi","Membaca","Olahraga","Musik","Gaming","Total"]}
        rows={[["Siswa",12,15,8,5,40]]}
      />
    ),
    parts: [
      { label: "a.", math: "P(\\text{Olahraga}) = \\frac{15}{40} = \\ldots" },
      { label: "b.", math: "P(\\text{Membaca atau Musik}) = \\frac{12+8}{40} = \\ldots" },
      { label: "c.", text: "Hobi mana yang paling mungkin dimiliki siswa terpilih?" },
    ],
  }),
  Qn(17, "Soal UN – Peluang Berapa Bola", {
    type: "mixed",
    content: "Sebuah kantong berisi bola merah dan biru. Peluang terambil bola merah adalah 3/7. Jika ada 21 bola, berapa bola merah dan berapa bola biru?",
    parts: [
      { label: "a.", math: "n(\\text{Merah}) = \\frac{3}{7} \\times 21 = \\ldots" },
      { label: "b.", math: "n(\\text{Biru}) = 21 - \\ldots = \\ldots" },
      { label: "c.", math: "P(\\text{Biru}) = \\frac{\\ldots}{21} = \\ldots" },
    ],
  }),
  Qn(18, "Soal TKA – Peluang Dua Kejadian", {
    type: "mixed",
    content: "Dalam satu set kartu remi 52 lembar, satu kartu diambil acak. Tentukan:",
    parts: [
      { label: "a.", math: "P(\\text{kartu bernilai 10}) = \\frac{4}{52} \\quad \\text{(ada 4 kartu '10')}" },
      { label: "b.", math: "P(\\text{kartu 10 atau As}) = \\frac{4+4}{52} = \\frac{8}{52} = \\frac{2}{13}" },
      { label: "c.", math: "P(\\text{kartu bernilai} \\leq 3) = \\frac{\\ldots}{52} \\quad \\text{(A,2,3 masing-masing 4)}" },
    ],
  }),
  Qn(19, "Soal UN Level Tinggi – Peluang Kondisional Sederhana", {
    type: "mixed",
    content: "Kantong A berisi 3 merah dan 2 biru. Kantong B berisi 4 merah dan 1 biru. Satu kantong dipilih acak, lalu satu bola diambil.",
    parts: [
      { label: "a.", math: "P(\\text{Merah} | \\text{Kantong A}) = \\frac{3}{5}" },
      { label: "b.", math: "P(\\text{Merah} | \\text{Kantong B}) = \\frac{4}{5}" },
      { label: "c.", text: "Kantong mana yang lebih mungkin menghasilkan bola merah?" },
    ],
  }),
  Qn(20, "Soal TKA – Peluang Menggunakan Perbandingan", {
    type: "mixed",
    content: "Perbandingan banyak bola merah : biru : hijau dalam kotak adalah 2 : 3 : 5. Satu bola diambil.",
    parts: [
      { label: "a.", math: "P(\\text{Merah}) = \\frac{2}{2+3+5} = \\frac{2}{10} = \\frac{1}{5}" },
      { label: "b.", math: "P(\\text{Biru}) = \\frac{3}{10}" },
      { label: "c.", math: "P(\\text{Hijau}) = \\frac{5}{10} = \\frac{1}{2}" },
    ],
  }),
  Qn(21, "Soal UN – Koin, Dadu, Kartu", {
    type: "mixed",
    content: "Sebuah koin dilempar, sebuah dadu dilempar, dan satu kartu diambil dari 4 kartu (1,2,3,4).",
    parts: [
      { label: "a.", math: "n(S) = 2 \\times 6 \\times 4 = \\ldots" },
      { label: "b.", text: "Berapa peluang mendapat: koin Angka, dadu genap, dan kartu bernomor 3?" },
      { label: "c.", math: "P = \\frac{1}{2} \\times \\frac{3}{6} \\times \\frac{1}{4} = \\ldots \\text{ (kejadian bebas)}" },
    ],
  }),
  Qn(22, "Soal UN Level Tinggi – Mencari Jumlah Bola", {
    type: "mixed",
    content: "Kantong berisi bola merah (m) dan biru. Jika 1 bola merah ditambahkan, peluang merah menjadi 1/2. Semula ada 10 bola.",
    parts: [
      { label: "a.", math: "\\text{Misal awal ada } m \\text{ bola merah dan } (10-m) \\text{ biru}" },
      { label: "b.", math: "\\frac{m+1}{11} = \\frac{1}{2} \\Rightarrow 2(m+1) = 11 \\Rightarrow m = \\ldots" },
      { label: "c.", math: "P_{awal}(\\text{merah}) = \\frac{m}{10} = \\frac{\\ldots}{10}" },
    ],
  }),
];

const PeluangTeoretikPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <Calculator className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: "0 0 20px rgba(167,139,250,0.7)" }}>
            PELUANG TEORETIK
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Peluang · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 22 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-2">📌 Rumus Utama</p>
          <div className="flex flex-col gap-2">
            <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
              <BlockMath math="P(A) = \frac{n(A)}{n(S)}, \quad 0 \leq P(A) \leq 1" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-body">
              {[
                { label: "Kejadian Pasti", val: "P(S) = 1" },
                { label: "Kejadian Mustahil", val: "P(∅) = 0" },
              ].map(r => (
                <div key={r.label} className="bg-white/5 rounded-lg px-2 py-2 text-center">
                  <div className="text-violet-300 text-[10px] font-bold">{r.label}</div>
                  <div className="text-white/60 text-xs">{r.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-900/80 to-purple-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-violet-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-400 to-purple-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/50 flex items-center justify-center shrink-0">
                    <span className="text-violet-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.math && <div className="mb-3 text-white overflow-x-auto"><BlockMath math={q.math} /></div>}
                    {q.diagram && <div className="mb-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? "bg-white/5" : "bg-transparent px-0"}`}>
                            {p.label && <span className="text-violet-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/peluang"); }}
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Peluang
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeluangTeoretikPage;
