import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { FlipHorizontal2 } from "lucide-react";

const S = 200;
const mn = -6, mx = 6;
const sc = S / (mx - mn);
const ox = S / 2, oy = S / 2;
const px = (x: number) => ox + x * sc;
const py = (y: number) => oy - y * sc;

function GridSVG({ children, size = S }: { children?: React.ReactNode; size?: number }) {
  const ticks = [-5,-4,-3,-2,-1,1,2,3,4,5];
  return (
    <svg width={size} height={size} className="rounded-xl border border-emerald-500/20 bg-slate-900/60">
      {ticks.map(t => (
        <g key={t}>
          <line x1={px(t)} y1={0} x2={px(t)} y2={S} stroke="#334155" strokeWidth="0.5"/>
          <line x1={0} y1={py(t)} x2={S} y2={py(t)} stroke="#334155" strokeWidth="0.5"/>
        </g>
      ))}
      <line x1={0} y1={oy} x2={S} y2={oy} stroke="#64748b" strokeWidth="1.2"/>
      <line x1={ox} y1={0} x2={ox} y2={S} stroke="#64748b" strokeWidth="1.2"/>
      <polygon points={`${S},${oy} ${S-6},${oy-3} ${S-6},${oy+3}`} fill="#64748b"/>
      <polygon points={`${ox},0 ${ox-3},6 ${ox+3},6`} fill="#64748b"/>
      {ticks.map(t => (
        <g key={t}>
          <text x={px(t)} y={oy+12} textAnchor="middle" fill="#64748b" fontSize="7">{t}</text>
          <text x={ox-8} y={py(t)+3} textAnchor="middle" fill="#64748b" fontSize="7">{t}</text>
        </g>
      ))}
      <text x={S-4} y={oy-5} fill="#94a3b8" fontSize="8">x</text>
      <text x={ox+5} y={8} fill="#94a3b8" fontSize="8">y</text>
      {children}
    </svg>
  );
}

function Dot({ x, y, color = "#34d399", r = 4, label = "" }: { x: number; y: number; color?: string; r?: number; label?: string }) {
  return (
    <g>
      <circle cx={px(x)} cy={py(y)} r={r} fill={color} opacity="0.9"/>
      {label && <text x={px(x)+6} y={py(y)-4} fill={color} fontSize="9" fontWeight="bold">{label}</text>}
    </g>
  );
}

function DashLine({ x1, y1, x2, y2, color = "#94a3b8" }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  return <line x1={px(x1)} y1={py(y1)} x2={px(x2)} y2={py(y2)} stroke={color} strokeWidth="1" strokeDasharray="3,3"/>;
}

function MirrorLine({ x, color = "#facc15", vertical = true }: { x?: number; color?: string; vertical?: boolean }) {
  if (vertical) return <line x1={px(x ?? 0)} y1={0} x2={px(x ?? 0)} y2={S} stroke={color} strokeWidth="2" strokeDasharray="6,2"/>;
  return <line x1={0} y1={py(x ?? 0)} x2={S} y2={py(x ?? 0)} stroke={color} strokeWidth="2" strokeDasharray="6,2"/>;
}

function DiagLine({ slope, color = "#facc15" }: { slope: 1|-1; color?: string }) {
  if (slope === 1) return <line x1={0} y1={S} x2={S} y2={0} stroke={color} strokeWidth="2" strokeDasharray="6,2"/>;
  return <line x1={0} y1={0} x2={S} y2={S} stroke={color} strokeWidth="2" strokeDasharray="6,2"/>;
}

function MirrorH({ y: my, label = "" }: { y: number; label?: string }) {
  return (
    <g>
      <line x1={4} y1={py(my)} x2={S-4} y2={py(my)} stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3"/>
      {label && <text x={S-6} y={py(my)-5} textAnchor="end" fill="#facc15" fontSize="8" fontWeight="bold">{label}</text>}
    </g>
  );
}

function MirrorV2({ x: mx, label = "" }: { x: number; label?: string }) {
  return (
    <g>
      <line x1={px(mx)} y1={4} x2={px(mx)} y2={S-4} stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3"/>
      {label && <text x={px(mx)+4} y={14} fill="#facc15" fontSize="8" fontWeight="bold">{label}</text>}
    </g>
  );
}

function ConnDash({ x1, y1, x2, y2 }: { x1:number; y1:number; x2:number; y2:number }) {
  return <line x1={px(x1)} y1={py(y1)} x2={px(x2)} y2={py(y2)} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2"/>;
}

function Poly({ pts, color = "#34d399", fill = "rgba(52,211,153,0.12)", label = "" }: { pts: [number,number][]; color?: string; fill?: string; label?: string }) {
  const d = pts.map(([x,y]) => `${px(x)},${py(y)}`).join(" ");
  const cx_ = pts.reduce((s,[x]) => s+x,0)/pts.length;
  const cy_ = pts.reduce((s,[,y]) => s+y,0)/pts.length;
  return (
    <g>
      <polygon points={d} fill={fill} stroke={color} strokeWidth="1.5"/>
      {label && <text x={px(cx_)} y={py(cy_)+4} textAnchor="middle" fill={color} fontSize="9" fontWeight="bold">{label}</text>}
    </g>
  );
}

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; opts?: [string,string,string,string]; diagram?: React.ReactNode; type: "pg"|"essay"|"mixed"|"diagram" };
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1,"Aturan Pencerminan — Sumbu X",{type:"pg",
    content:"Di antara pemetaan berikut, manakah yang merupakan aturan pencerminan terhadap sumbu X?",
    opts:[
      "(x, y) → (−x, y)",
      "(x, y) → (x, −y)",
      "(x, y) → (y, x)",
      "(x, y) → (−x, −y)",
    ],
  }),
  Qn(2,"Identifikasi Pencerminan — Sumbu Y",{type:"pg",
    content:"Perhatikan pemetaan-pemetaan berikut.\n(i) P(2, −5) → P′(−2, −5)\n(ii) Q(−3, 4) → Q′(−3, −4)\n(iii) R(1, 3) → R′(−1, 3)\n(iv) S(−4, −2) → S′(4, 2)\nYang merupakan contoh pencerminan terhadap sumbu Y adalah ...",
    opts:[
      "(i) dan (iii)",
      "(ii) dan (iv)",
      "(i) saja",
      "(ii) saja",
    ],
  }),
  Qn(3,"Bayangan Titik — Sumbu X",{type:"pg",
    content:"Koordinat bayangan titik P(5, −8) setelah dicerminkan terhadap sumbu X adalah ...",
    opts:["(5, 8)","(−5, 8)","(5, −8)","(−5, −8)"],
  }),
  Qn(4,"Bayangan Titik — Sumbu Y",{type:"pg",
    content:"Koordinat bayangan titik Q(−7, 3) setelah dicerminkan terhadap sumbu Y adalah ...",
    opts:["(7, 3)","(−7, −3)","(7, −3)","(−7, 3)"],
  }),
  Qn(5,"Mencari Koordinat Asal",{type:"pg",
    content:"Titik R(a, b) dicerminkan terhadap sumbu Y menghasilkan R′(4, −3). Nilai a + b adalah ...",
    opts:["−7","−1","1","7"],
  }),
  Qn(6,"Balik dari Bayangan",{type:"pg",
    content:"Suatu titik dicerminkan terhadap sumbu X menghasilkan bayangan (6, −9). Koordinat titik asalnya adalah ...",
    opts:["(6, 9)","(−6, 9)","(6, −9)","(−9, 6)"],
  }),
  Qn(7,"Pencerminan Berturut-turut — Dua Sumbu",{type:"pg",
    content:"Titik T(−2, 5) dicerminkan berturut-turut terhadap sumbu X kemudian sumbu Y. Koordinat bayangan akhir T adalah ...",
    opts:["(2, −5)","(−2, −5)","(2, 5)","(−2, 5)"],
  }),
  Qn(8,"Kuadran Bayangan",{type:"pg",
    content:"Titik A(x, y) berada di Kuadran II. Jika A dicerminkan berturut-turut terhadap sumbu X kemudian sumbu Y, maka bayangan akhir A″ berada di kuadran ...",
    opts:["Kuadran I","Kuadran II","Kuadran III","Kuadran IV"],
  }),
  Qn(11,"Diagram — Garis Cermin y = k",{type:"diagram",
    content:"Perhatikan diagram. Titik P(−3, 4) dicerminkan terhadap garis y = k menghasilkan P′(−3, −2). Nilai k adalah ...",
    opts:["−2","0","1","2"],
    diagram:(
      <GridSVG>
        <MirrorH y={1} label="y = k"/>
        <ConnDash x1={-3} y1={4} x2={-3} y2={-2}/>
        <Dot x={-3} y={4} color="#34d399" r={4} label="P(−3, 4)"/>
        <Dot x={-3} y={-2} color="#f472b6" r={4} label="P′(−3, −2)"/>
        <circle cx={px(-3)} cy={py(1)} r={3} fill="#facc15" opacity="0.85"/>
      </GridSVG>
    ),
  }),
  Qn(12,"Pencerminan terhadap y = b",{type:"pg",
    content:"Titik R(−3, 7) dicerminkan terhadap garis y = 2. Koordinat bayangan R adalah ...",
    opts:["(−3, −3)","(3, −3)","(−3, 3)","(7, −3)"],
  }),
  Qn(13,"Pencerminan terhadap x = a",{type:"pg",
    content:"Titik S(9, −4) dicerminkan terhadap garis x = 3. Koordinat bayangan S adalah ...",
    opts:["(9, −4)","(−3, 4)","(−3, −4)","(3, −4)"],
  }),
  Qn(14,"Dua Refleksi pada Garis Berbeda",{type:"pg",
    content:"Titik A(2, 5) dicerminkan terhadap garis x = 4, kemudian dicerminkan terhadap garis y = 1. Koordinat bayangan akhir A adalah ...",
    opts:["(6, −3)","(−2, −3)","(6, 3)","(−2, 3)"],
  }),
  Qn(15,"Tiga Refleksi Berturut-turut",{type:"pg",
    content:"Titik B(3, 4) dicerminkan terhadap sumbu X, kemudian hasilnya dicerminkan terhadap garis y = 3. Koordinat bayangan akhir B adalah ...",
    opts:["(3, 10)","(−3, 10)","(3, −10)","(−3, −10)"],
  }),
  Qn(16,"Diagram — Refleksi Segitiga",{type:"diagram",
    content:"Perhatikan diagram. Segitiga PQR dicerminkan terhadap sumbu Y. Koordinat bayangan Q′ adalah ...",
    opts:["(3, 3)","(−3, 3)","(3, −3)","(−3, −3)"],
    diagram:(
      <GridSVG>
        <MirrorLine x={0} vertical={true} color="#facc15"/>
        <Poly pts={[[1,1],[3,3],[1,4]]} color="#34d399" label="PQR"/>
        <Poly pts={[[-1,1],[-3,3],[-1,4]]} color="#f472b6" fill="rgba(244,114,182,0.13)" label="P′Q′R′"/>
        <ConnDash x1={3} y1={3} x2={-3} y2={3}/>
        <Dot x={3} y={3} color="#34d399" r={3} label="Q(3,3)"/>
        <Dot x={-3} y={3} color="#f472b6" r={3} label="Q′"/>
      </GridSVG>
    ),
  }),
  Qn(17,"Garis Cermin dari Pemetaan",{type:"pg",
    content:"Titik M(2, −5) dicerminkan menghasilkan M′(2, 9). Pencerminan tersebut dilakukan terhadap garis ...",
    opts:["x = 2","y = 2","y = x","y = −x"],
  }),
  Qn(18,"Mencari h + k",{type:"pg",
    content:"Titik P(4, −6) dicerminkan berturut-turut terhadap garis x = h kemudian garis y = k sehingga menghasilkan P″(−2, 2). Nilai h + k adalah ...",
    opts:["−1","1","3","−3"],
  }),
  Qn(19,"Pencerminan terhadap y = x",{type:"pg",
    content:"Koordinat bayangan titik R(−4, 7) setelah dicerminkan terhadap garis y = x adalah ...",
    opts:["(4, −7)","(7, −4)","(−7, 4)","(4, 7)"],
  }),
  Qn(20,"Puncak Parabola setelah Refleksi y = x",{type:"pg",
    content:"Grafik f(x) = (x + 3)² dicerminkan terhadap garis y = x. Bayangan titik puncak grafik f(x) berada di koordinat ...",
    opts:["(0, −3)","(−3, 0)","(3, 0)","(0, 3)"],
  }),
];

const RefleksiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <FlipHorizontal2 className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            REFLEKSI (PENCERMINAN)
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Transformasi Geometri · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 18 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-2">📌 Rumus Kunci — Refleksi</p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {[
              {label:"Sumbu-x", math:"(x,y)\\to(x,-y)"},
              {label:"Sumbu-y", math:"(x,y)\\to(-x,y)"},
              {label:"y = x", math:"(x,y)\\to(y,x)"},
              {label:"y = -x", math:"(x,y)\\to(-y,-x)"},
              {label:"x = a", math:"(x,y)\\to(2a-x,y)"},
              {label:"y = b", math:"(x,y)\\to(x,2b-y)"},
            ].map(r => (
              <div key={r.label} className="bg-white/5 rounded-lg px-2 py-1.5">
                <p className="text-emerald-400 font-bold mb-0.5">{r.label}</p>
                <InlineMath>{r.math}</InlineMath>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${q.type === "pg" || q.type === "diagram" ? "bg-gradient-to-b from-emerald-300 to-teal-400" : "bg-gradient-to-b from-emerald-400 to-teal-500"}`} />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-300 text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded">
                        {q.title}
                      </span>
                      {(q.type === "pg" || (q.type === "diagram" && q.opts)) && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                          Pilihan Ganda
                        </span>
                      )}
                    </div>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3 whitespace-pre-line">{q.content}</p>}
                    {q.math && <div className="mb-3 overflow-x-auto"><BlockMath>{q.math}</BlockMath></div>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.opts && (
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {(["A","B","C","D"] as const).map((lbl, oi) => (
                          <div key={lbl} className="flex items-center gap-2 bg-white/5 border border-emerald-500/15 rounded-lg px-3 py-2">
                            <span className="text-emerald-400 text-xs font-bold shrink-0 w-4">{lbl}.</span>
                            <span className="font-body text-xs text-white/85 leading-snug">{q.opts![oi]}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-emerald-400 text-xs font-bold shrink-0 mt-0.5">{p.label}</span>}
                            <div className="flex-1 min-w-0">
                              {p.math && <div className="overflow-x-auto"><InlineMath>{p.math}</InlineMath></div>}
                              {p.text && <span className="font-body text-sm text-white/80">{p.text}</span>}
                            </div>
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

        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">🖼️ Fitur Visual</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">
            Beberapa soal dilengkapi diagram bidang koordinat yang menunjukkan pencerminan titik dan bangun terhadap berbagai garis. Soal-soal dipilih dari kisi-kisi UN, ANBK, dan TKA.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/transformasi-geometri"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Transformasi Geometri
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefleksiPage;
