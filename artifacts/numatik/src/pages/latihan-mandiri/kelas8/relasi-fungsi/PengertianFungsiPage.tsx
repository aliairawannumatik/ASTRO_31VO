import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
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

/* ── helper: y-position for element index in small arrow-diagrams ── */
const dy = (i: number) => 24 + i * 27; // indices 0-4 → y = 24,51,78,105,132

/* ── small arrow-diagram SVG factory ── */
const SmallArrow = ({
  id, domainLabels, codomainLabels, arrows
}: {
  id: string;
  domainLabels: string[];
  codomainLabels: string[];
  arrows: [number, number][];
}) => {
  const { isDark } = useTheme();
  const svgBg = isDark ? "#1e293b" : "white";
  const lbl = isDark ? "#e2e8f0" : "#1e293b";
  return (
    <svg width="172" height="158" viewBox="0 0 172 158">
      <rect width="172" height="158" fill={svgBg} rx="8" />
      <ellipse cx="43" cy="78" rx="30" ry="63" fill="#f472b622" stroke="#f472b6" strokeWidth="1.3" />
      <ellipse cx="129" cy="78" rx="30" ry="63" fill="#60a5fa22" stroke="#60a5fa" strokeWidth="1.3" />
      <text x="43" y="10" fill="#f472b6" fontSize="10" fontWeight="bold" textAnchor="middle">A</text>
      <text x="129" y="10" fill="#60a5fa" fontSize="10" fontWeight="bold" textAnchor="middle">B</text>
      {domainLabels.map((v, i) => (
        <text key={v} x="43" y={dy(i)} fill={lbl} fontSize="12" fontWeight="bold" textAnchor="middle">{v}</text>
      ))}
      {codomainLabels.map((v, i) => (
        <text key={v} x="129" y={dy(i)} fill={lbl} fontSize="12" fontWeight="bold" textAnchor="middle">{v}</text>
      ))}
      <defs>
        <marker id={id} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0 0, 6 3, 0 6" fill="#34d399" />
        </marker>
      </defs>
      {arrows.map(([s, t], k) => (
        <line key={k} x1="50" y1={dy(s) - 4} x2="122" y2={dy(t) - 4}
          stroke="#34d399" strokeWidth="1.5" markerEnd={`url(#${id})`} />
      ))}
    </svg>
  );
};

const domABCDE = ['a','b','c','d','e'];
const cod12345 = ['1','2','3','4','5'];

/* ── Q4 diagrams ── */
const diagramsQ4: { label: string; arrows: [number,number][] }[] = [
  { label: 'a.', arrows: [[0,0],[1,1],[2,2],[3,3]] },           // e not mapped → NOT fn
  { label: 'b.', arrows: [[0,0],[1,0],[2,1],[3,2],[4,3]] },     // many-to-one → FUNCTION
  { label: 'c.', arrows: [[0,0],[1,1],[1,2],[2,3],[3,4],[4,0]] },// b→two → NOT fn
  { label: 'd.', arrows: [[0,1],[1,2],[2,3],[3,4],[4,0]] },      // bijective → FUNCTION
  { label: 'e.', arrows: [[0,0],[1,1],[2,1],[3,2],[4,2]] },      // many-to-one → FUNCTION
  { label: 'f.', arrows: [[0,0],[1,1],[2,2],[2,3],[3,4],[4,4]] },// c→two → NOT fn
];

/* ── Q6 mini coordinate SVGs ── */
const CoordGraph = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { isDark } = useTheme();
  const svgBg = isDark ? "#1e293b" : "white";
  const axis = isDark ? "#94a3b8" : "#334155";
  return (
    <svg width="148" height="142" viewBox="0 0 148 142">
      <rect width="148" height="142" fill={svgBg} rx="8" />
      {/* grid + tick labels in one pass */}
      {[1,2,3,4,5].map(n => (
        <g key={`g${n}`}>
          <line x1={22+n*20} y1="8" x2={22+n*20} y2="118" stroke="#f0f0f0" strokeWidth="0.8" />
          <line x1="22" y1={118-n*20} x2="128" y2={118-n*20} stroke="#f0f0f0" strokeWidth="0.8" />
          <text x={22+n*20} y="128" fill="#94a3b8" fontSize="8" textAnchor="middle">{n}</text>
          <text x="17" y={118-n*20+3} fill="#94a3b8" fontSize="8" textAnchor="middle">{n}</text>
        </g>
      ))}
      {/* axes */}
      <defs>
        <marker id={id} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <polygon points="0 0, 5 2.5, 0 5" fill={axis} />
        </marker>
      </defs>
      <line x1="22" y1="118" x2="131" y2="118" stroke={axis} strokeWidth="1.5" markerEnd={`url(#${id})`} />
      <line x1="22" y1="118" x2="22" y2="5" stroke={axis} strokeWidth="1.5" markerEnd={`url(#${id})`} />
      <text x="133" y="121" fill={axis} fontSize="9" fontWeight="bold">x</text>
      <text x="24" y="6" fill={axis} fontSize="9" fontWeight="bold">y</text>
      {children}
    </svg>
  );
};

const PengertianFungsiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const p = "practice.relasiDanFungsi.pengertianFungsi";

  const questions: Q[] = [
    /* ── Q1 ── */
    Qn(1, t(`${p}.q1.title`), {
      type: "mixed",
      diagram: <ArrowDiagram setA={[1,2,3,4]} setB={['a','b','c','d','e']} arrows={[[0,0],[1,1],[2,2],[3,3]]} labelA="A" labelB="B" colorA="#34d399" colorB="#f472b6" arrowColor="#facc15" />,
      parts: [
        { label: "a.", text: t(`${p}.q1.a`) },
        { label: "b.", text: t(`${p}.q1.b`) },
        { label: "c.", text: t(`${p}.q1.c`) },
      ],
    }),
    /* ── Q2 ── */
    Qn(2, t(`${p}.q2.title`), {
      type: "mixed",
      diagram: <ArrowDiagram setA={[1,2,3]} setB={['p','q','r','s']} arrows={[[0,0],[0,1],[1,2],[2,3]]} labelA="A" labelB="B" colorA="#f87171" colorB="#60a5fa" arrowColor="#fb923c" />,
      parts: [
        { label: "a.", text: t(`${p}.q2.a`) },
        { label: "b.", text: t(`${p}.q2.b`) },
        { label: "c.", text: t(`${p}.q2.c`) },
      ],
    }),
    /* ── Q3 ── */
    Qn(3, t(`${p}.q3.title`), {
      type: "mixed",
      diagram: <ArrowDiagram setA={[1,2,3,4]} setB={['a','b','c']} arrows={[[0,0],[1,1],[2,2]]} labelA="A" labelB="B" colorA="#f87171" colorB="#a78bfa" arrowColor="#f472b6" />,
      parts: [
        { label: "a.", text: t(`${p}.q3.a`) },
        { label: "b.", text: t(`${p}.q3.b`) },
        { label: "c.", text: t(`${p}.q3.c`) },
      ],
    }),
    /* ── Q4 ── */
    Qn(4, t(`${p}.q4.title`), {
      type: "mixed",
      content: t(`${p}.q4.content`),
      diagram: (
        <div className="grid grid-cols-2 gap-3 w-full">
          {diagramsQ4.map(({ label, arrows }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-xs font-bold text-muted-foreground mb-1">{label}</span>
              <SmallArrow id={`f1${label.replace('.','')}`} domainLabels={domABCDE} codomainLabels={cod12345} arrows={arrows} />
            </div>
          ))}
        </div>
      ),
      parts: [
        { label: "a.", text: t(`${p}.q4.a`) },
        { label: "b.", text: t(`${p}.q4.b`) },
      ],
    }),
    /* ── Q5 ── */
    Qn(5, t(`${p}.q5.title`), {
      type: "mixed",
      content: t(`${p}.q5.content`),
      parts: [
        { label: "a.", text: t(`${p}.q5.a`) },
        { label: "b.", text: t(`${p}.q5.b`) },
        { label: "c.", text: t(`${p}.q5.c`) },
        { label: "d.", text: t(`${p}.q5.d`) },
        { label: "e.", text: t(`${p}.q5.e`) },
      ],
    }),
    /* ── Q6 ── */
    Qn(6, t(`${p}.q6.title`), {
      type: "mixed",
      content: t(`${p}.q6.content`),
      diagram: (
        <div className="grid grid-cols-2 gap-3 w-full">
          {/* a. Garis lurus menurun → FUNGSI */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-muted-foreground mb-1">a.</span>
            <CoordGraph id="gax">
              {/* y = -0.7x + 4.2 : (0,4.2)→(5,0.7) */}
              <line x1="22" y1={118-4.2*20} x2="122" y2={118-0.7*20} stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            </CoordGraph>
          </div>
          {/* b. Parabola miring ke kanan (x=y²/5) → BUKAN FUNGSI */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-muted-foreground mb-1">b.</span>
            <CoordGraph id="gbx">
              {/* C-shape: x=(y-2.5)²/3.5+0.3, y=0..5 */}
              <polyline points="67,118 54,105 44,95 37,85 32,75 31,65 32,55 37,45 44,35 54,25 67,15"
                fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </CoordGraph>
          </div>
          {/* c. Parabola terbuka ke atas → FUNGSI */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-muted-foreground mb-1">c.</span>
            <CoordGraph id="gcx">
              {/* y=x²/5: (0,0),(1,0.2),(2,0.8),(3,1.8),(4,3.2),(5,5) */}
              <polyline points="22,118 42,114 62,102 82,82 102,54 122,18"
                fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </CoordGraph>
          </div>
          {/* d. Lingkaran → BUKAN FUNGSI */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-muted-foreground mb-1">d.</span>
            <CoordGraph id="gdx">
              {/* circle center (2.5,2.5) r=2 → SVG (72,68) r=40 */}
              <circle cx="72" cy="68" r="40" fill="none" stroke="#3b82f6" strokeWidth="2" />
            </CoordGraph>
          </div>
          {/* e. Kurva S (kubik) → FUNGSI */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-muted-foreground mb-1">e.</span>
            <CoordGraph id="gex">
              {/* S-curve cubic y=(x-2.5)³/3.5+2.5 */}
              <polyline points="34,118 44,90 55,73 65,67 72,65 82,64 95,59 105,46 116,20"
                fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </CoordGraph>
          </div>
          {/* f. Parabola terbuka ke bawah → FUNGSI */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-muted-foreground mb-1">f.</span>
            <CoordGraph id="gfx">
              {/* arc: y=-(x-2.5)²/5+4.5 */}
              <polyline points="22,52 42,35 62,28 72,25 82,28 102,35 122,52"
                fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </CoordGraph>
          </div>
        </div>
      ),
      parts: [
        { label: "a.", text: t(`${p}.q6.a`) },
        { label: "b.", text: t(`${p}.q6.b`) },
      ],
    }),
    /* ── Q7 ── */
    Qn(7, t(`${p}.q7.title`), {
      type: "mixed",
      content: t(`${p}.q7.content`),
      parts: [
        { label: "a.", text: t(`${p}.q7.a`) },
        { label: "b.", text: t(`${p}.q7.b`) },
        { label: "c.", text: t(`${p}.q7.c`) },
        { label: "d.", text: t(`${p}.q7.d`) },
      ],
    }),
  ];

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
            {t(`${p}.h1`)}
          </h1>
          <p className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs text-center font-body`}>{t(`${p}.grade`)} · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 7 {t('practice.suffixSoal')}</span>
            <span className={`${isDark ? "text-white/30" : "text-gray-400"} text-xs`}>·</span>
            <span className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs`}>UN / ANBK / TKA</span>
          </div>
        </div>

        <div className={`mb-5 ${isDark ? "bg-emerald-900/20" : "bg-emerald-50"} border border-emerald-500/20 rounded-xl p-4`}>
          <p className="text-emerald-300 text-xs font-bold mb-2">{t(`${p}.tipTitle`)}</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[t(`${p}.tip1`), t(`${p}.tip2`), t(`${p}.tip3`)].map((s, i) => (
              <div key={i} className="bg-white/5 rounded-lg px-3 py-2 flex gap-2">
                <span className="text-emerald-400 font-bold shrink-0">{i+1}.</span>
                <span className={isDark ? "text-white/60" : "text-gray-600"}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? "from-emerald-900/30 via-slate-900/80 to-teal-900/30" : "from-emerald-50/60 via-white/80 to-teal-50/40"} backdrop-blur`} />
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
                    {q.content && <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"} whitespace-pre-line leading-relaxed mb-3`}>{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
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
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} {t(`${p}.backToTopic`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PengertianFungsiPage;
