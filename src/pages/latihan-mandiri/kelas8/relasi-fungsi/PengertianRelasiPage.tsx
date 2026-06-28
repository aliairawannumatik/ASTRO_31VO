import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { GitMerge } from "lucide-react";
import ArrowDiagram from "./ArrowDiagram";

const accent = "violet";
const accentHex = "#a78bfa";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed" | "diagram-only";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Relasi Anak-anak dan Buah Kesukaan", {
    type: "mixed",
    content: "Diketahui data kesukaan buah tiga anak sebagai berikut:\n\u2022 Andi menyukai: Apel dan Mangga\n\u2022 Budi menyukai: Jeruk dan Pisang\n\u2022 Citra menyukai: Apel, Mangga, dan Anggur\n\nRelasi yang berlaku adalah 'menyukai' dari himpunan anak ke himpunan buah.",
    diagram: <ArrowDiagram setA={['Andi','Budi','Citra']} setB={['Apel','Mangga','Jeruk','Pisang','Anggur']} arrows={[[0,0],[0,1],[1,2],[1,3],[2,0],[2,1],[2,4]]} labelA="Anak" labelB="Buah" colorA="#10b981" colorB="#f97316" arrowColor="#a78bfa" size="md" />,
    parts: [
      { label: "a.", text: "Buatlah diagram panah untuk relasi 'menyukai' di atas (sudah ditampilkan)." },
      { label: "b.", text: "Nyatakan relasi tersebut dalam bentuk himpunan pasangan berurutan." },
      { label: "c.", text: "Gambarlah diagram Kartesius untuk relasi tersebut. (Sumbu mendatar = nama anak, sumbu tegak = nama buah)" },
    ],
  }),
  Qn(2, "Memahami Konsep Relasi", {
    type: "mixed",
    content: "Perhatikan himpunan A = {1, 2, 3, 4} dan B = {a, b, c, d}. Relasi 'dipetakan ke' dari A ke B dinyatakan dengan diagram panah berikut:",
    diagram: <ArrowDiagram setA={[1,2,3,4]} setB={['a','b','c','d']} arrows={[[0,0],[1,1],[2,2],[3,3]]} labelA="A" labelB="B" colorA="#a78bfa" colorB="#38bdf8" arrowColor="#f472b6" />,
    parts: [
      { label: "a.", text: "Tuliskan relasi tersebut sebagai himpunan pasangan berurutan." },
      { label: "b.", text: "Apa nama relasi ini? Apakah setiap anggota A dipasangkan tepat satu ke B?" },
      { label: "c.", text: "Tuliskan domain, kodomain, dan range dari relasi tersebut." },
    ],
  }),
  Qn(3, "Relasi Dari Pasangan Berurutan", {
    type: "mixed",
    content: "Diketahui relasi R dari A ke B dinyatakan sebagai himpunan pasangan berurutan:",
    parts: [
      { label: "", math: "R = \\{(1,2),\\ (2,4),\\ (3,6),\\ (4,8)\\}" },
      { label: "a.", text: "Gambarlah diagram panah untuk relasi R." },
      { label: "b.", text: "Nyatakan relasi R dengan aturan (nama relasi). Apa hubungan x dan y?" },
      { label: "c.", text: "Tentukan domain, kodomain, dan range jika B = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}." },
    ],
  }),
  Qn(4, "Membaca Diagram Panah", {
    type: "mixed",
    diagram: <ArrowDiagram setA={['Ali','Budi','Citra','Dina']} setB={['Merah','Kuning','Hijau','Biru']} arrows={[[0,0],[0,2],[1,1],[2,3],[3,1]]} labelA="Siswa" labelB="Warna Favorit" colorA="#34d399" colorB="#fb923c" arrowColor="#facc15" size="md" />,
    parts: [
      { label: "a.", text: "Tuliskan relasi di atas sebagai himpunan pasangan berurutan." },
      { label: "b.", text: "Siapa saja yang menyukai warna yang sama?" },
      { label: "c.", text: "Tuliskan domain dan range dari relasi tersebut." },
      { label: "d.", text: "Apakah relasi ini termasuk fungsi? Jelaskan alasanmu." },
    ],
  }),
  Qn(5, "Relasi 'Faktor dari'", {
    type: "mixed",
    content: "Diketahui A = {2, 3, 4, 6} dan B = {6, 8, 12, 18, 24}. Relasi yang menghubungkan A ke B adalah 'faktor dari'.",
    parts: [
      { label: "a.", text: "Gambarlah diagram panah untuk relasi 'faktor dari' ini." },
      { label: "b.", text: "Tuliskan himpunan pasangan berurutannya." },
      { label: "c.", text: "Tentukan range relasi tersebut." },
    ],
  }),
  Qn(6, "Domain, Kodomain, dan Range", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3,4,5]} setB={[1,4,9,16,25,36]} arrows={[[0,0],[1,1],[2,2],[3,3],[4,4]]} labelA="A" labelB="B" colorA="#f472b6" colorB="#60a5fa" arrowColor="#34d399" />,
    parts: [
      { label: "a.", text: "Tentukan domain, kodomain, dan range dari relasi di atas." },
      { label: "b.", text: "Anggota kodomain mana yang tidak menjadi range? Sebutkan." },
      { label: "c.", text: "Apa nama aturan relasi pada diagram tersebut?" },
    ],
  }),
  Qn(7, "Relasi 'Kuadrat dari'", {
    type: "mixed",
    content: "Diketahui A = {1, 2, 3, 4, 5} dan B = {1, 4, 9, 16, 25, 36}. Relasi yang berlaku adalah 'kuadrat dari'.",
    parts: [
      { label: "a.", math: "\\text{Lengkapi pasangan berurutan: } (1,1),\\ (2,\\_),\\ (3,\\_),\\ (4,\\_),\\ (5,\\_)" },
      { label: "b.", text: "Gambarlah diagram panah untuk relasi ini." },
      { label: "c.", text: "Nilai mana di himpunan B yang bukan merupakan range?" },
    ],
  }),
  Qn(8, "Menyatakan Relasi dalam Tiga Cara", {
    type: "mixed",
    content: "Relasi R = {(2,5), (3,7), (4,9), (5,11)} diberikan dalam bentuk pasangan berurutan.",
    parts: [
      { label: "a.", text: "Gambarlah diagram panah dari relasi tersebut." },
      { label: "b.", text: "Gambarlah diagram Kartesius dari relasi tersebut." },
      { label: "c.", math: "\\text{Tentukan aturan: } y = f(x) = \\ldots" },
      { label: "d.", text: "Tentukan domain dan range relasi R." },
    ],
  }),
  Qn(9, "Relasi pada Siswa dan Nilai", {
    type: "mixed",
    content: "Kelas 8A memiliki 4 siswa: Amir, Budi, Citra, Dini. Nilai matematika mereka: Amir→85, Budi→90, Citra→85, Dini→75.",
    parts: [
      { label: "a.", text: "Tuliskan relasi 'mendapat nilai' sebagai himpunan pasangan berurutan." },
      { label: "b.", text: "Gambarlah diagram panah untuk relasi tersebut." },
      { label: "c.", text: "Tentukan domain dan range relasi ini." },
    ],
  }),
  Qn(10, "Relasi 'Lebih dari'", {
    type: "mixed",
    content: "Diketahui P = {2, 4, 6} dan Q = {1, 3, 5, 7}. Relasi yang berlaku adalah 'lebih dari'.",
    parts: [
      { label: "a.", text: "Gambarlah diagram panah untuk relasi 'lebih dari' dari P ke Q." },
      { label: "b.", text: "Tuliskan himpunan pasangan berurutannya." },
      { label: "c.", text: "Tentukan range relasi tersebut." },
    ],
  }),
  Qn(11, "Relasi 'Setengah dari'", {
    type: "mixed",
    content: "Diketahui himpunan A = {2, 4, 6, 8, 10} dan B = {1, 2, 3, 4, 5, 6, 7, 8}. Relasi yang menghubungkan A ke B adalah 'setengah dari'.",
    parts: [
      { label: "a.", text: "Gambarlah diagram panah untuk relasi ini." },
      { label: "b.", text: "Tuliskan pasangan berurutannya." },
      { label: "c.", text: "Apakah semua anggota B menjadi range? Jelaskan." },
    ],
  }),
  Qn(12, "Relasi dari Diagram – Tentukan Aturan", {
    type: "mixed",
    diagram: <ArrowDiagram setA={[1,2,3,4]} setB={[3,5,7,9,11]} arrows={[[0,0],[1,1],[2,2],[3,3]]} labelA="A" labelB="B" colorA="#fb923c" colorB="#34d399" arrowColor="#f472b6" />,
    parts: [
      { label: "a.", text: "Tuliskan himpunan pasangan berurutannya." },
      { label: "b.", math: "\\text{Tentukan aturan relasinya: } y = \\ldots" },
      { label: "c.", text: "Jika A diperluas hingga {1, 2, 3, 4, 5}, apa nilai yang dipasangkan dengan 5?" },
    ],
  }),
  Qn(13, "Menemukan Anggota Himpunan dari Relasi", {
    type: "mixed",
    content: "Diketahui relasi R dari A ke B dengan aturan 'y = x² − 1'. Jika A = {0, 1, 2, 3, 4}, tentukan:",
    parts: [
      { label: "a.", math: "\\text{Nilai } y \\text{ untuk setiap } x \\in A" },
      { label: "b.", text: "Tuliskan himpunan pasangan berurutan relasi R." },
      { label: "c.", text: "Tentukan range relasi R." },
    ],
  }),
];

const PengertianRelasiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <GitMerge className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.7)' }}>
            PENGERTIAN RELASI DAN PENYAJIANNYA
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Relasi dan Fungsi · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 13 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-2">📌 Ingat — Tiga Cara Menyatakan Relasi</p>
          <div className="grid grid-cols-3 gap-2 text-xs font-body">
            {[
              { name: "Diagram Panah", emoji: "↗️" },
              { name: "Pasangan Berurutan", emoji: "{}  " },
              { name: "Diagram Kartesius", emoji: "📈" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-2 py-2 text-center">
                <div className="text-lg mb-1">{r.emoji}</div>
                <span className="text-white/60 text-[10px]">{r.name}</span>
              </div>
            ))}
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
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianRelasiPage;
