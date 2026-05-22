import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { MoveRight } from "lucide-react";

const S = 200;
const mn = -6, mx = 6;
const sc = S / (mx - mn);
const ox = S / 2, oy = S / 2;
const px = (x: number) => ox + x * sc;
const py = (y: number) => oy - y * sc;

function GridSVG({ children, size = S }: { children?: React.ReactNode; size?: number }) {
  const ticks = [-5,-4,-3,-2,-1,1,2,3,4,5];
  return (
    <svg width={size} height={size} className="rounded-xl border border-cyan-500/20 bg-slate-900/60">
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

function Dot({ x, y, color = "#22d3ee", r = 4, label = "" }: { x: number; y: number; color?: string; r?: number; label?: string }) {
  return (
    <g>
      <circle cx={px(x)} cy={py(y)} r={r} fill={color} opacity="0.9"/>
      {label && <text x={px(x)+6} y={py(y)-4} fill={color} fontSize="9" fontWeight="bold">{label}</text>}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color = "#f472b6" }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const dx = px(x2) - px(x1), dy = py(y2) - py(y1);
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ex = px(x2) - ux * 4, ey = py(y2) - uy * 4;
  return (
    <g>
      <line x1={px(x1)} y1={py(y1)} x2={ex} y2={ey} stroke={color} strokeWidth="1.5" strokeDasharray="3,2"/>
      <polygon points={`${px(x2)},${py(y2)} ${ex - uy*3},${ey + ux*3} ${ex + uy*3},${ey - ux*3}`} fill={color}/>
    </g>
  );
}

function Poly({ pts, color = "#22d3ee", fill = "rgba(34,211,238,0.12)", label = "" }: { pts: [number,number][]; color?: string; fill?: string; label?: string }) {
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

type Q = {
  n: number; title: string;
  content?: string; math?: string;
  diagram?: React.ReactNode;
  opts: [string, string, string, string];
  type: "pg" | "diagram";
};
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1,"Translasi Titik — Dasar",{type:"pg",
    content:"Titik P(2, 6) digeser oleh vektor translasi berikut. Koordinat bayangan P adalah ...",
    math:"T = \\begin{pmatrix}5\\\\-3\\end{pmatrix}",
    opts:["(7, 3)","(7, 9)","(\u22123, 9)","(\u22123, 3)"],
  }),
  Qn(2,"Bayangan Titik — Translasi",{type:"pg",
    content:"Titik A(\u22124, 3) ditranslasikan oleh T = (6, 2). Koordinat bayangan A adalah ...",
    opts:["(2, 1)","(2, 5)","(\u221210, 5)","(10, 1)"],
  }),
  Qn(4,"Komponen Vektor Translasi",{type:"pg",
    content:"Titik A(4, 7) dipetakan ke A\u2019(\u22123, 2) oleh translasi T. Komponen vektor T adalah ...",
    opts:["(7, 5)","(\u22127, 5)","(\u22127, \u22125)","(7, \u22125)"],
  }),
  Qn(5,"Mencari Vektor Translasi",{type:"pg",
    content:"Sebuah translasi memetakan titik P(\u22125, 8) ke P\u2019(\u22121, 5). Vektor translasi yang digunakan adalah ...",
    opts:["(\u22124, 3)","(4, \u22123)","(4, 3)","(\u22124, \u22123)"],
  }),
  Qn(6,"Nilai a dan b pada Translasi",{type:"pg",
    content:"Translasi T = (3, \u22124) memetakan titik (a, 7) ke titik (5, b). Nilai a dan b berturut-turut adalah ...",
    opts:["3 dan 2","2 dan 3","8 dan 3","2 dan 11"],
  }),
  Qn(7,"Koordinat Titik Asal",{type:"pg",
    content:"Titik Q(a, b) ditranslasikan oleh T = (\u22125, 4) menghasilkan Q\u2019(1, \u22123). Koordinat Q adalah ...",
    opts:["(6, \u22127)","(\u22124, 1)","(6, 1)","(\u22124, \u22127)"],
  }),
  Qn(8,"Titik Asal dari Bayangan",{type:"pg",
    content:"Bayangan titik M setelah ditranslasikan oleh T = (4, 6) adalah M\u2019(11, \u22129). Koordinat titik M adalah ...",
    opts:["(15, \u22123)","(7, \u22123)","(7, \u221215)","(15, \u221215)"],
  }),
  Qn(9,"Translasi Berturut-turut",{type:"pg",
    content:"Titik B(1, 4) ditranslasikan berturut-turut oleh T\u2081 = (\u22123, 2) kemudian T\u2082 = (4, \u22125). Koordinat bayangan terakhir B adalah ...",
    opts:["(6, \u22123)","(\u22122, 1)","(2, 1)","(2, \u22123)"],
  }),
  Qn(10,"Mencari Nilai x + y",{type:"pg",
    content:"Titik C(x, y) ditranslasikan oleh T = (4, \u22123) menghasilkan C\u2019(7, 2). Nilai x + y adalah ...",
    opts:["2","\u22122","6","8"],
  }),
  Qn(11,"Bayangan Titik Lain",{type:"pg",
    content:"Translasi T memetakan P(3, \u22122) ke P\u2019(7, 4). Bayangan titik Q(\u22121, 5) oleh T yang sama adalah ...",
    opts:["(\u22125, \u22121)","(3, \u22121)","(\u22125, 11)","(3, 11)"],
  }),
  Qn(12,"Translasi Titik Dasar",{type:"pg",
    content:"Titik A(3, 4) ditranslasikan oleh T = (2, \u22123). Koordinat bayangan A adalah ...",
    opts:["(1, 7)","(5, 7)","(5, 1)","(1, 1)"],
  }),
  Qn(14,"Translasi Bangun — Diagram",{type:"diagram",
    content:"Perhatikan diagram. Bangun A dipetakan ke A\u2019 oleh translasi T. Vektor T adalah ...",
    opts:["(2, 2)","(\u22122, \u22122)","(4, 0)","(0, 4)"],
    diagram:(
      <GridSVG>
        <Poly pts={[[1,1],[3,1],[3,3],[1,3]]} color="#22d3ee" label="A"/>
        <Poly pts={[[3,3],[5,3],[5,5],[3,5]]} color="#f472b6" fill="rgba(244,114,182,0.12)" label="A'"/>
        <Arrow x1={1} y1={1} x2={3} y2={3} color="#facc15"/>
        <Dot x={1} y={1} color="#22d3ee" label="(1,1)"/>
        <Dot x={3} y={3} color="#f472b6" label="(3,3)"/>
      </GridSVG>
    ),
  }),
  Qn(17,"Translasi Berturut-turut",{type:"pg",
    content:"Titik Q(1, 2) ditranslasikan berturut-turut oleh T\u2081 = (3, \u22121) kemudian T\u2082 = (\u22122, 4). Koordinat bayangan Q adalah ...",
    opts:["(4, 1)","(2, 5)","(5, 1)","(2, 7)"],
  }),
  Qn(18,"Translasi Garis",{type:"pg",
    content:"Garis y = 2x + 1 ditranslasikan oleh T = (3, \u22122). Persamaan bayangan garis adalah ...",
    opts:["y = 2x \u2212 3","y = 2x + 3","y = 2x \u2212 7","y = 2x + 7"],
  }),
  Qn(29,"Pergeseran pada Denah",{type:"pg",
    content:"Kamar tidur di titik A(5, 8) dipindahkan 3 satuan ke kiri dan 2 satuan ke atas. Koordinat baru kamar tidur adalah ...",
    opts:["(8, 6)","(2, 10)","(8, 10)","(2, 6)"],
  }),
  Qn(43,"Translasi dengan Parameter",{type:"pg",
    content:"Titik P(m, 2m) ditranslasikan oleh T = (3, \u2212m) menghasilkan P\u2019(7, 4). Koordinat titik P adalah ...",
    opts:["(3, 8)","(4, 8)","(4, 4)","(3, 4)"],
  }),
  Qn(48,"Translasi Segitiga — Luas",{type:"diagram",
    content:"\u25b3PQR dengan P(0,0), Q(4,0), R(2,3) ditranslasikan oleh T = (\u22123, \u22122). Luas \u25b3P\u2019Q\u2019R\u2019 adalah ...",
    opts:["3 satuan\u00b2","6 satuan\u00b2","9 satuan\u00b2","12 satuan\u00b2"],
    diagram:(
      <GridSVG>
        <Poly pts={[[0,0],[4,0],[2,3]]} color="#22d3ee" label="\u25b3PQR"/>
        <Poly pts={[[-3,-2],[1,-2],[-1,1]]} color="#f472b6" fill="rgba(244,114,182,0.12)" label="\u25b3P'Q'R'"/>
        <Arrow x1={0} y1={0} x2={-3} y2={-2} color="#facc15"/>
        <Dot x={0} y={0} color="#22d3ee" r={3} label="P(0,0)"/>
        <Dot x={4} y={0} color="#22d3ee" r={3} label="Q(4,0)"/>
        <Dot x={2} y={3} color="#22d3ee" r={3} label="R(2,3)"/>
      </GridSVG>
    ),
  }),
  Qn(20,"Soal Cerita Translasi",{type:"pg",
    content:"Robot bergerak dari P(2, 3) sejauh 5 satuan ke kanan dan 3 satuan ke bawah. Posisi akhir robot adalah ...",
    opts:["(7, 6)","(\u22123, 0)","(7, 0)","(\u22123, 6)"],
  }),
  Qn(37,"Translasi Garis Horizontal",{type:"pg",
    content:"Garis y = 3 ditranslasikan oleh T = (4, \u22125). Persamaan bayangan garis adalah ...",
    opts:["y = 8","y = \u22122","y = 7","y = 3"],
  }),
  Qn(35,"Translasi Parabola",{type:"pg",
    content:"Parabola y = x\u00b2 ditranslasikan oleh T = (2, \u22123). Persamaan bayangan parabola adalah ...",
    opts:["y = x\u00b2 \u2212 4x + 7","y = x\u00b2 \u2212 4x + 1","y = x\u00b2 + 4x + 7","y = x\u00b2 + 4x + 1"],
  }),
];

const TranslasiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <MoveRight className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(34,211,238,0.7)' }}>
            TRANSLASI (PERGESERAN)
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Transformasi Geometri · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 20 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">Pilihan Ganda · UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-cyan-300 text-xs font-bold mb-2">📌 Rumus Kunci — Translasi</p>
          <div className="flex flex-col gap-2">
            <BlockMath>{String.raw`\text{Jika } T = \begin{pmatrix}a\\b\end{pmatrix}, \text{ maka } P(x,y) \to P'(x+a,\; y+b)`}</BlockMath>
            <p className="text-white/50 text-[10px] font-body">Translasi tidak mengubah bentuk, ukuran, atau orientasi bangun.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                    <span className="text-cyan-300 text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-2">{q.content}</p>}
                    {q.math && <div className="mb-3 overflow-x-auto"><BlockMath>{q.math}</BlockMath></div>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {(["A","B","C","D"] as const).map((lbl, oi) => (
                        <div key={lbl} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                          <span className="text-cyan-400 text-xs font-bold shrink-0 w-4">{lbl}.</span>
                          <span className="font-body text-xs text-white/80 leading-snug">{q.opts[oi]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">🖼️ Fitur Visual</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">
            Beberapa soal dilengkapi dengan diagram bidang koordinat yang menunjukkan pergeseran titik dan bangun. Soal-soal dipilih dari kisi-kisi UN, ANBK, dan TKA untuk mempersiapkan siswa menghadapi ujian resmi.
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

export default TranslasiPage;
