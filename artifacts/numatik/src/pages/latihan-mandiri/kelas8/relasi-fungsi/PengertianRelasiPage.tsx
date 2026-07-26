import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
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

const PengertianRelasiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const p = "practice.relasiDanFungsi.pengertianRelasi";

  const questions: Q[] = [
    Qn(1, t(`${p}.q1.title`), {
      type: "mixed",
      diagram: (
        <div className="flex flex-col items-center my-2">
          <svg width="320" height="298" viewBox="0 0 320 298">
            <rect width="320" height="298" style={{ fill: "var(--card)" }} rx="14" stroke="#e2e8f0" strokeWidth="1" />
            {/* Oval A */}
            <ellipse cx="70" cy="160" rx="50" ry="92" fill="#f472b622" stroke="#f472b6" strokeWidth="1.5" strokeOpacity="0.8" />
            {/* Oval B */}
            <ellipse cx="250" cy="160" rx="50" ry="110" fill="#60a5fa22" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.8" />
            {/* Labels */}
            <text x="70" y="56" fill="#f472b6" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
            <text x="250" y="40" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>
            {/* A elements: centers at y=88,124,160,196,232 */}
            {[1,2,3,4,5].map((v,i) => (
              <text key={v} x="70" y={92+i*36} style={{ fill: "var(--card-foreground)" }} fontSize="12" fontWeight="bold" textAnchor="middle">{v}</text>
            ))}
            {/* B elements: centers at y=70,106,142,178,214,250 */}
            {[1,4,9,16,25,36].map((v,i) => (
              <text key={v} x="250" y={74+i*36} style={{ fill: "var(--card-foreground)" }} fontSize="12" fontWeight="bold" textAnchor="middle">{v}</text>
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
        { label: "a.", text: t(`${p}.q1.a`) },
        { label: "b.", text: t(`${p}.q1.b`) },
        { label: "c.", text: t(`${p}.q1.c`) },
      ],
    }),
    Qn(2, t(`${p}.q2.title`), {
      type: "mixed",
      content: t(`${p}.q2.content`),
      parts: [
        { label: "a.", text: t(`${p}.q2.a`) },
        { label: "b.", text: t(`${p}.q2.b`) },
        { label: "c.", text: t(`${p}.q2.c`) },
      ],
    }),
    Qn(3, t(`${p}.q3.title`), {
      type: "mixed",
      content: t(`${p}.q3.content`),
      parts: [
        { label: "a.", text: t(`${p}.q3.a`) },
        { label: "b.", text: t(`${p}.q3.b`) },
        { label: "c.", text: t(`${p}.q3.c`) },
      ],
    }),
    Qn(4, t(`${p}.q4.title`), {
      type: "mixed",
      content: t(`${p}.q4.content`),
      parts: [
        { label: "a.", text: t(`${p}.q4.a`) },
        { label: "b.", text: t(`${p}.q4.b`) },
        { label: "c.", text: t(`${p}.q4.c`) },
      ],
    }),
    Qn(5, t(`${p}.q5.title`), {
      type: "mixed",
      content: t(`${p}.q5.content`),
      parts: [
        { label: "a.", text: t(`${p}.q5.a`) },
        { label: "b.", text: t(`${p}.q5.b`) },
        { label: "c.", text: t(`${p}.q5.c`) },
      ],
    }),
    Qn(6, t(`${p}.q6.title`), {
      type: "mixed",
      diagram: (
        <div className="flex flex-col items-center my-2">
          <svg width="280" height="250" viewBox="0 0 280 250">
            <rect width="280" height="250" style={{ fill: "var(--card)" }} rx="14" stroke="#e2e8f0" strokeWidth="1" />
            {/* grid lines */}
            {[1,2,3,4,5].map(x => (
              <line key={`gx${x}`} x1={45+x*44} y1={15} x2={45+x*44} y2={215} stroke="#f0f0f0" strokeWidth="1" />
            ))}
            {[1,2,3,4,5,6,7,8,9,10].map(y => (
              <line key={`gy${y}`} x1={45} y1={215-y*20} x2={265} y2={215-y*20} stroke="#f0f0f0" strokeWidth="1" />
            ))}
            {/* axes */}
            <line x1="45" y1="215" x2="268" y2="215" style={{ stroke: "var(--card-foreground)" }} strokeWidth="2" markerEnd="url(#axHead)" />
            <line x1="45" y1="215" x2="45" y2="12" style={{ stroke: "var(--card-foreground)" }} strokeWidth="2" markerEnd="url(#axHead)" />
            <defs>
              <marker id="axHead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" style={{ fill: "var(--card-foreground)" }} />
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
            <text x="270" y="219" style={{ fill: "var(--card-foreground)" }} fontSize="11" fontWeight="bold">x</text>
            <text x="48" y="10" style={{ fill: "var(--card-foreground)" }} fontSize="11" fontWeight="bold">y</text>
            {/* data points: (1,3),(2,5),(3,7),(4,9) */}
            {[[1,3],[2,5],[3,7],[4,9]].map(([x,y], i) => (
              <circle key={i} cx={45+x*44} cy={215-y*20} r="6" fill="#fb923c" stroke="#ea580c" strokeWidth="1.5" opacity="0.9" />
            ))}
          </svg>
        </div>
      ),
      parts: [
        { label: "a.", text: t(`${p}.q6.a`) },
        { label: "b.", text: t(`${p}.q6.b`) },
      ],
    }),
    Qn(7, t(`${p}.q7.title`), {
      type: "mixed",
      content: t(`${p}.q7.content`),
      parts: [
        { label: "", math: "R = \\{(1,5),\\ (2,10),\\ (3,15),\\ (4,20)\\}" },
        { label: "a.", text: t(`${p}.q7.a`) },
        { label: "b.", text: t(`${p}.q7.b`) },
      ],
    }),
    Qn(8, t(`${p}.q8.title`), {
      type: "mixed",
      content: t(`${p}.q8.content`),
      diagram: (
        <div className="flex flex-col items-center my-2">
          <svg width="320" height="370" viewBox="0 0 320 370">
            <rect width="320" height="370" style={{ fill: "var(--card)" }} rx="14" stroke="#e2e8f0" strokeWidth="1" />
            {/* Domain oval A */}
            <ellipse cx="75" cy="200" rx="50" ry="150" fill="#f472b622" stroke="#f472b6" strokeWidth="1.5" strokeOpacity="0.8" />
            {/* Kodomain oval B */}
            <ellipse cx="252" cy="200" rx="50" ry="132" fill="#60a5fa22" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.8" />
            {/* Labels */}
            <text x="75" y="35" fill="#f472b6" fontSize="13" fontWeight="bold" textAnchor="middle">A</text>
            <text x="252" y="54" fill="#60a5fa" fontSize="13" fontWeight="bold" textAnchor="middle">B</text>
            {/* Domain elements: y = 64 + i*34 */}
            {[1,2,3,4,5,6,7,8,9].map((v,i) => (
              <text key={v} x="75" y={64+i*34} style={{ fill: "var(--card-foreground)" }} fontSize="13" fontWeight="bold" textAnchor="middle">{v}</text>
            ))}
            {/* Kodomain elements: y = 80 + j*60 */}
            {[1,2,3,4,5].map((v,i) => (
              <text key={v} x="252" y={80+i*60} style={{ fill: "var(--card-foreground)" }} fontSize="13" fontWeight="bold" textAnchor="middle">{v}</text>
            ))}
            {/* Arrow marker */}
            <defs>
              <marker id="arr-kl8" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <polygon points="0 0, 7 3.5, 0 7" fill="#34d399" opacity="0.9" />
              </marker>
            </defs>
            {/* domain y[i] = 64+i*34 ; kodomain y[j] = 80+j*60 */}
            {/* (1→1): i=0 y=64, j=0 y=80 */}
            <line x1="90" y1="62" x2="235" y2="78" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (2→1): i=1 y=98, j=0 y=80 */}
            <line x1="90" y1="96" x2="235" y2="80" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (2→2): i=1 y=98, j=1 y=140 */}
            <line x1="90" y1="96" x2="235" y2="138" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (3→1): i=2 y=132, j=0 y=80 */}
            <line x1="90" y1="130" x2="235" y2="82" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (3→3): i=2 y=132, j=2 y=200 */}
            <line x1="90" y1="130" x2="235" y2="198" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (4→1): i=3 y=166, j=0 y=80 */}
            <line x1="90" y1="164" x2="235" y2="83" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (4→2): i=3 y=166, j=1 y=140 */}
            <line x1="90" y1="164" x2="235" y2="140" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (4→4): i=3 y=166, j=3 y=260 */}
            <line x1="90" y1="166" x2="235" y2="258" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (5→1): i=4 y=200, j=0 y=80 */}
            <line x1="90" y1="198" x2="235" y2="84" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (5→5): i=4 y=200, j=4 y=320 */}
            <line x1="90" y1="200" x2="235" y2="318" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (6→1): i=5 y=234, j=0 y=80 */}
            <line x1="90" y1="232" x2="235" y2="84" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (6→2): i=5 y=234, j=1 y=140 */}
            <line x1="90" y1="234" x2="235" y2="141" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (6→3): i=5 y=234, j=2 y=200 */}
            <line x1="90" y1="234" x2="235" y2="200" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (7→1): i=6 y=268, j=0 y=80 */}
            <line x1="90" y1="266" x2="235" y2="84" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (8→1): i=7 y=302, j=0 y=80 */}
            <line x1="90" y1="300" x2="235" y2="84" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (8→2): i=7 y=302, j=1 y=140 */}
            <line x1="90" y1="302" x2="235" y2="142" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (8→4): i=7 y=302, j=3 y=260 */}
            <line x1="90" y1="300" x2="235" y2="258" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (9→1): i=8 y=336, j=0 y=80 */}
            <line x1="90" y1="334" x2="235" y2="85" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
            {/* (9→3): i=8 y=336, j=2 y=200 */}
            <line x1="90" y1="336" x2="235" y2="201" stroke="#34d399" strokeWidth="1.5" opacity="0.85" markerEnd="url(#arr-kl8)" />
          </svg>
          <p className="text-muted-foreground/60 text-[10px] mt-1 font-body">{t(`${p}.q8.diagramCaption`)}</p>
        </div>
      ),
      parts: [
        { label: "a.", text: t(`${p}.q8.a`) },
        { label: "b.", text: t(`${p}.q8.b`) },
      ],
    }),
  ];

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
            {t(`${p}.h1`)}
          </h1>
          <p className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs text-center font-body`}>{t(`${p}.grade`)} · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 8 {t('practice.suffixSoal')}</span>
            <span className={`${isDark ? "text-white/30" : "text-gray-400"} text-xs`}>·</span>
            <span className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs`}>UN / ANBK / TKA</span>
          </div>
        </div>

        <div className={`mb-5 ${isDark ? "bg-violet-900/20" : "bg-violet-50"} border border-violet-500/20 rounded-xl p-4`}>
          <p className="text-violet-300 text-xs font-bold mb-2">{t(`${p}.tipTitle`)}</p>
          <div className="grid grid-cols-3 gap-2 text-xs font-body">
            {[
              { name: t(`${p}.tipArrow`), emoji: "↗️" },
              { name: t(`${p}.tipPairs`), emoji: "{}  " },
              { name: t(`${p}.tipCartesian`), emoji: "📈" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-2 py-2 text-center">
                <div className="text-lg mb-1">{r.emoji}</div>
                <span className={`${isDark ? "text-white/60" : "text-gray-600"} text-[10px]`}>{r.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? "from-violet-900/30 via-slate-900/80 to-purple-900/30" : "from-violet-50/60 via-white/80 to-purple-50/40"} backdrop-blur`} />
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
                    {q.content && <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"} whitespace-pre-line leading-relaxed mb-3`}>{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-violet-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
                            {p.math
                              ? <div className={`${isDark ? "text-white" : "text-gray-800"} text-sm overflow-x-auto`}><InlineMath math={p.math} /></div>
                              : <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"} whitespace-pre-line`}>{p.text}</p>
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
            {t('practice.backTo')} {t(`${p}.backToTopic`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianRelasiPage;
