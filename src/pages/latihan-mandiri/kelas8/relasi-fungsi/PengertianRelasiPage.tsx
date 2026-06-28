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
  Qn(1, "Domain, Kodomain, dan Range", {
    type: "mixed",
    diagram: (
      <div className="flex flex-col items-center my-2">
        <svg width="320" height="298" viewBox="0 0 320 298">
          <rect width="320" height="298" fill="white" rx="14" stroke="#e2e8f0" strokeWidth="1" />
          {/* Oval A */}
          <ellipse cx="70" cy="160" rx="50" ry="92" fill="#f472b622" stroke="#f472b6" strokeWidth="1.5" strokeOpacity="0.8" />
          {/* Oval B */}
          <ellipse cx="250" cy="160" rx="50" ry="110" fill="#60a5fa22" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.8" />
          {/* Labels */}
          <text x="70" y="56" fill="#f472b6" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
          <text x="250" y="40" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>
          {/* A elements: centers at y=88,124,160,196,232 */}
          {[1,2,3,4,5].map((v,i) => (
            <text key={v} x="70" y={92+i*36} fill="rgba(20,20,20,0.9)" fontSize="12" fontWeight="bold" textAnchor="middle">{v}</text>
          ))}
          {/* B elements: centers at y=70,106,142,178,214,250 */}
          {[1,4,9,16,25,36].map((v,i) => (
            <text key={v} x="250" y={74+i*36} fill="rgba(20,20,20,0.9)" fontSize="12" fontWeight="bold" textAnchor="middle">{v}</text>
          ))}
          {/* Arrows touching numbers: from right of A number to left of B number */}
          <defs>
            <marker id="arr-dk" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#34d399" opacity="0.9" />
            </marker>
          </defs>
          {/* 1→1: A[0] center y=88, B[0] center y=70 */}
          <line x1="84" y1="88" x2="234" y2="70" stroke="#34d399" strokeWidth="1.8" opacity="0.9" markerEnd="url(#arr-dk)" />
          {/* 2→4: A[1] y=124, B[1] y=106 */}
          <line x1="84" y1="124" x2="234" y2="106" stroke="#34d399" strokeWidth="1.8" opacity="0.9" markerEnd="url(#arr-dk)" />
          {/* 3→9: A[2] y=160, B[2] y=142 */}
          <line x1="84" y1="160" x2="234" y2="142" stroke="#34d399" strokeWidth="1.8" opacity="0.9" markerEnd="url(#arr-dk)" />
          {/* 4→16: A[3] y=196, B[3] y=178 */}
          <line x1="84" y1="196" x2="234" y2="178" stroke="#34d399" strokeWidth="1.8" opacity="0.9" markerEnd="url(#arr-dk)" />
          {/* 5→25: A[4] y=232, B[4] y=214 */}
          <line x1="84" y1="232" x2="234" y2="214" stroke="#34d399" strokeWidth="1.8" opacity="0.9" markerEnd="url(#arr-dk)" />
        </svg>
      </div>
    ),
    parts: [
      { label: "a.", text: "Tentukan domain, kodomain, dan range dari relasi di atas." },
      { label: "b.", text: "Anggota kodomain mana yang tidak menjadi range? Sebutkan." },
      { label: "c.", text: "Apa nama aturan relasi pada diagram tersebut?" },
    ],
  }),
  Qn(2, "Relasi Anak-anak dan Buah Kesukaan", {
    type: "mixed",
    content: "Diketahui data kesukaan buah tiga anak sebagai berikut:\n\u2022 Andi menyukai: Apel dan Mangga\n\u2022 Budi menyukai: Jeruk dan Pisang\n\u2022 Citra menyukai: Apel, Mangga, dan Anggur\n\nRelasi yang berlaku adalah 'menyukai' dari himpunan anak ke himpunan buah.",
    parts: [
      { label: "a.", text: "Buatlah diagram panah untuk relasi 'menyukai' di atas." },
      { label: "b.", text: "Nyatakan relasi tersebut dalam bentuk himpunan pasangan berurutan." },
      { label: "c.", text: "Gambarlah diagram Kartesius untuk relasi tersebut. (Sumbu mendatar = nama anak, sumbu tegak = nama buah)" },
    ],
  }),
  Qn(3, "Relasi 'Setengah dari'", {
    type: "mixed",
    content: "Diketahui himpunan A = {2, 4, 6, 8, 10} dan B = {1, 2, 3, 4, 5, 6, 7, 8}. Relasi yang menghubungkan A ke B adalah 'setengah dari'.",
    parts: [
      { label: "a.", text: "Gambarlah diagram panah untuk relasi ini." },
      { label: "b.", text: "Tuliskan pasangan berurutannya." },
      { label: "c.", text: "Gambarlah dalam diagram Kartesius." },
    ],
  }),
  Qn(4, "Relasi 'Faktor dari'", {
    type: "mixed",
    content: "Diketahui A = {2, 3, 4, 6} dan B = {6, 8, 12, 18, 24}. Relasi yang menghubungkan A ke B adalah 'faktor dari'.",
    parts: [
      { label: "a.", text: "Gambarlah diagram panah untuk relasi 'faktor dari' ini." },
      { label: "b.", text: "Tuliskan himpunan pasangan berurutannya." },
      { label: "c.", text: "Tentukan range relasi tersebut." },
    ],
  }),
  Qn(5, "Relasi 'Lebih dari'", {
    type: "mixed",
    content: "Diketahui P = {2, 4, 6} dan Q = {1, 3, 5, 7}. Relasi yang berlaku adalah 'lebih dari'.",
    parts: [
      { label: "a.", text: "Gambarlah diagram panah untuk relasi 'lebih dari' dari P ke Q." },
      { label: "b.", text: "Tuliskan himpunan pasangan berurutannya." },
      { label: "c.", text: "Tentukan range relasi tersebut." },
    ],
  }),
  Qn(6, "Relasi dari Diagram Kartesius – Tentukan Aturan", {
    type: "mixed",
    diagram: (
      <div className="flex flex-col items-center my-2">
        <svg width="280" height="250" viewBox="0 0 280 250">
          <rect width="280" height="250" fill="white" rx="14" stroke="#e2e8f0" strokeWidth="1" />
          {/* grid lines */}
          {[1,2,3,4,5].map(x => (
            <line key={`gx${x}`} x1={45+x*44} y1={15} x2={45+x*44} y2={215} stroke="#f0f0f0" strokeWidth="1" />
          ))}
          {[1,2,3,4,5,6,7,8,9,10].map(y => (
            <line key={`gy${y}`} x1={45} y1={215-y*20} x2={265} y2={215-y*20} stroke="#f0f0f0" strokeWidth="1" />
          ))}
          {/* axes */}
          <line x1="45" y1="215" x2="268" y2="215" stroke="#334155" strokeWidth="2" markerEnd="url(#axHead)" />
          <line x1="45" y1="215" x2="45" y2="12" stroke="#334155" strokeWidth="2" markerEnd="url(#axHead)" />
          <defs>
            <marker id="axHead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#334155" />
            </marker>
          </defs>
          {/* x-axis labels */}
          {[1,2,3,4,5].map(x => (
            <text key={`xl${x}`} x={45+x*44} y={230} fill="#64748b" fontSize="11" textAnchor="middle" fontWeight="bold">{x}</text>
          ))}
          {/* y-axis labels: every 1 unit */}
          {[1,2,3,4,5,6,7,8,9,10].map(y => (
            <text key={`yl${y}`} x={36} y={215-y*20+4} fill="#64748b" fontSize="9" textAnchor="middle" fontWeight="bold">{y}</text>
          ))}
          {/* axis name */}
          <text x="270" y="219" fill="#334155" fontSize="11" fontWeight="bold">x</text>
          <text x="48" y="10" fill="#334155" fontSize="11" fontWeight="bold">y</text>
          {/* data points: (1,3),(2,5),(3,7),(4,9) */}
          {[[1,3],[2,5],[3,7],[4,9]].map(([x,y], i) => (
            <circle key={i} cx={45+x*44} cy={215-y*20} r="6" fill="#fb923c" stroke="#ea580c" strokeWidth="1.5" opacity="0.9" />
          ))}
        </svg>
      </div>
    ),
    parts: [
      { label: "a.", text: "Tuliskan himpunan pasangan berurutannya." },
      { label: "b.", math: "\\text{Tentukan aturan relasinya: } y = \\ldots" },
      { label: "c.", text: "Jika A diperluas hingga {1, 2, 3, 4, 5}, apa nilai yang dipasangkan dengan 5?" },
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
            <span className="text-violet-400 text-xs font-bold">📋 6 {t('practice.suffixSoal')}</span>
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
