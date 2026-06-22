import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Zap } from "lucide-react";
import ArrowDiagram from "./ArrowDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Pengertian Fungsi", {
    type: "mixed",
    content: "Fungsi (pemetaan) adalah relasi khusus dari himpunan A ke himpunan B, di mana setiap anggota A dipasangkan tepat satu dengan anggota B.",
    parts: [
      { label: "a.", text: "Sebutkan 3 syarat agar suatu relasi menjadi fungsi." },
      { label: "b.", text: "Apa perbedaan antara relasi dan fungsi? Berikan masing-masing contoh." },
      { label: "c.", text: "Dapatkah dua anggota A dipasangkan ke anggota B yang sama? Jelaskan." },
    ],
  }),
  Qn(2, "Identifikasi Fungsi dari Diagram Panah", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3,4]} setB={['a','b','c','d','e']} arrows={[[0,0],[1,1],[2,2],[3,3]]} labelA="A" labelB="B" colorA="#34d399" colorB="#f472b6" arrowColor="#facc15" />,
    parts: [
      { label: "a.", text: "Apakah diagram panah di atas menyatakan fungsi? Jelaskan alasanmu." },
      { label: "b.", text: "Apakah ini fungsi surjektif (onto)? Mengapa?" },
      { label: "c.", text: "Tentukan domain, kodomain, dan range." },
    ],
  }),
  Qn(3, "Bukan Fungsi – Satu ke Banyak", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3]} setB={['p','q','r','s']} arrows={[[0,0],[0,1],[1,2],[2,3]]} labelA="A" labelB="B" colorA="#f87171" colorB="#60a5fa" arrowColor="#fb923c" />,
    parts: [
      { label: "a.", text: "Apakah diagram di atas merupakan fungsi? Berikan alasanmu." },
      { label: "b.", text: "Anggota A mana yang melanggar syarat fungsi?" },
      { label: "c.", text: "Ubah diagram agar menjadi fungsi (hapus minimal satu panah). Pilih mana yang dihapus." },
    ],
  }),
  Qn(4, "Bukan Fungsi – Ada yang Tidak Dipetakan", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3,4]} setB={['a','b','c']} arrows={[[0,0],[1,1],[2,2]]} labelA="A" labelB="B" colorA="#f87171" colorB="#a78bfa" arrowColor="#f472b6" />,
    parts: [
      { label: "a.", text: "Apakah diagram di atas merupakan fungsi? Jelaskan." },
      { label: "b.", text: "Anggota A mana yang tidak memiliki pasangan?" },
      { label: "c.", text: "Apa yang perlu diperbaiki agar relasi ini menjadi fungsi?" },
    ],
  }),
  Qn(5, "Ini Fungsi atau Bukan?", {
    type: "mixed",
    content: "Tentukan apakah setiap pasangan berurutan berikut menyatakan fungsi dari A ke B:",
    parts: [
      { label: "a.", math: "\\{(1,2),\\ (2,3),\\ (3,4),\\ (4,5)\\},\\ A=\\{1,2,3,4\\},\\ B=\\{1,2,3,4,5\\}" },
      { label: "b.", math: "\\{(1,2),\\ (1,3),\\ (2,4),\\ (3,5)\\},\\ A=\\{1,2,3\\},\\ B=\\{2,3,4,5\\}" },
      { label: "c.", math: "\\{(1,5),\\ (2,5),\\ (3,5)\\},\\ A=\\{1,2,3\\},\\ B=\\{4,5,6\\}" },
    ],
  }),
  Qn(6, "Fungsi Injektif (Satu-Satu)", {
    type: "mixed",
    content: "Fungsi f dari A ke B disebut injektif (satu-satu) jika setiap anggota B dipasangkan paling banyak satu anggota A.",
    diagram: <ArrowDiagram setA={[1,2,3]} setB={['x','y','z','w']} arrows={[[0,0],[1,1],[2,2]]} labelA="A" labelB="B" colorA="#34d399" colorB="#60a5fa" arrowColor="#f472b6" />,
    parts: [
      { label: "a.", text: "Apakah fungsi pada diagram di atas merupakan fungsi injektif? Jelaskan." },
      { label: "b.", text: "Apakah fungsi ini surjektif? Mengapa?" },
    ],
  }),
  Qn(7, "Membedakan Fungsi dan Bukan Fungsi", {
    type: "mixed",
    content: "Manakah dari berikut ini yang merupakan fungsi? Jelaskan untuk masing-masing.",
    parts: [
      { label: "i.", text: "Relasi 'ibu kandung dari' (dari himpunan anak ke himpunan ibu)." },
      { label: "ii.", text: "Relasi 'anak dari' (dari himpunan ibu ke himpunan anak)." },
      { label: "iii.", text: "Relasi 'nilai ujian' (dari himpunan siswa ke himpunan nilai)." },
    ],
  }),
  Qn(8, "Fungsi dalam Kehidupan Nyata – UN Style", {
    type: "mixed",
    content: "Setiap warga negara Indonesia memiliki satu Nomor Induk Kependudukan (NIK) yang unik.",
    parts: [
      { label: "a.", text: "Apakah relasi 'warga → NIK' merupakan fungsi? Jelaskan." },
      { label: "b.", text: "Apakah relasi 'NIK → warga' merupakan fungsi? Jelaskan." },
      { label: "c.", text: "Apakah relasi 'warga → NIK' merupakan korespondensi satu-satu?" },
    ],
  }),
];

const PengertianFungsiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <Zap className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            PENGERTIAN FUNGSI DAN PENYAJIANNYA
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Relasi dan Fungsi · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 8 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-2">📌 Syarat Fungsi</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              "Setiap anggota domain dipasangkan ke TEPAT SATU anggota kodomain",
              "Tidak boleh ada anggota domain yang tidak memiliki pasangan",
              "Boleh ada anggota kodomain yang tidak dipasangkan (bukan range)",
            ].map((s, i) => (
              <div key={i} className="bg-white/5 rounded-lg px-3 py-2 flex gap-2">
                <span className="text-emerald-400 font-bold shrink-0">{i+1}.</span>
                <span className="text-white/60">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianFungsiPage;
