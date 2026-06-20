import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { RotateCcw } from "lucide-react";

const S = 200;
const sc = S / 12;
const ox = S / 2, oy = S / 2;
const px = (x: number) => ox + x * sc;
const py = (y: number) => oy - y * sc;

function GridSVG({ children }: { children?: React.ReactNode }) {
  const ticks = [-5,-4,-3,-2,-1,1,2,3,4,5];
  return (
    <svg width={S} height={S} className="rounded-xl border border-orange-500/20 bg-slate-900/60">
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

function Dot({ x, y, color = "#fb923c", r = 4, label = "" }: { x: number; y: number; color?: string; r?: number; label?: string }) {
  return (
    <g>
      <circle cx={px(x)} cy={py(y)} r={r} fill={color} opacity="0.9"/>
      {label && <text x={px(x)+6} y={py(y)-4} fill={color} fontSize="9" fontWeight="bold">{label}</text>}
    </g>
  );
}

function Poly({ pts, color = "#fb923c", fill = "rgba(251,146,60,0.12)", label = "" }: { pts: [number,number][]; color?: string; fill?: string; label?: string }) {
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

function ArcArrow({ cx: acx, cy: acy, r, startAngle, endAngle, color = "#facc15" }: { cx: number; cy: number; r: number; startAngle: number; endAngle: number; color?: string }) {
  const sa = (startAngle * Math.PI) / 180;
  const ea = (endAngle * Math.PI) / 180;
  const x1 = px(acx) + r * Math.cos(sa);
  const y1 = py(acy) - r * Math.sin(sa);
  const x2 = px(acx) + r * Math.cos(ea);
  const y2 = py(acy) - r * Math.sin(ea);
  const large = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  const sweep = endAngle > startAngle ? 0 : 1;
  return (
    <g>
      <path d={`M${x1},${y1} A${r},${r},0,${large},${sweep},${x2},${y2}`} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4,2"/>
      <circle cx={x2} cy={y2} r={3} fill={color}/>
    </g>
  );
}

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; opts?: [string,string,string,string]; diagram?: React.ReactNode; type: "essay"|"mixed"|"diagram"|"pg" };
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

/* ─── SVG helper: diagram kuadran ─── */
function QuadrantSVG({ children }: { children?: React.ReactNode }) {
  const W = 220, H = 220, ox = W/2, oy = H/2, unit = 40;
  return (
    <svg width={W} height={H} className="rounded-xl border border-orange-500/20 bg-slate-900/60 mx-auto">
      {[-2,-1,1,2].map(t => (
        <g key={t}>
          <line x1={ox+t*unit} y1={0} x2={ox+t*unit} y2={H} stroke="#1e293b" strokeWidth="0.7"/>
          <line x1={0} y1={oy-t*unit} x2={W} y2={oy-t*unit} stroke="#1e293b" strokeWidth="0.7"/>
        </g>
      ))}
      <line x1={0} y1={oy} x2={W} y2={oy} stroke="#475569" strokeWidth="1.4"/>
      <line x1={ox} y1={0} x2={ox} y2={H} stroke="#475569" strokeWidth="1.4"/>
      <polygon points={`${W},${oy} ${W-6},${oy-3} ${W-6},${oy+3}`} fill="#475569"/>
      <polygon points={`${ox},0 ${ox-3},6 ${ox+3},6`} fill="#475569"/>
      <text x={W-7} y={oy-5} fill="#94a3b8" fontSize="9">x</text>
      <text x={ox+4} y={9} fill="#94a3b8" fontSize="9">y</text>
      <text x={ox+6} y={oy-6} fill="#64748b" fontSize="8">O</text>
      <text x={ox-1*unit/2-8} y={oy-1*unit/2} fill="#64748b" fontSize="10" fontWeight="bold">II</text>
      <text x={ox+1*unit/2+2} y={oy-1*unit/2} fill="#64748b" fontSize="10" fontWeight="bold">I</text>
      <text x={ox-1*unit/2-10} y={oy+1*unit/2+8} fill="#64748b" fontSize="10" fontWeight="bold">III</text>
      <text x={ox+1*unit/2+2} y={oy+1*unit/2+8} fill="#64748b" fontSize="10" fontWeight="bold">IV</text>
      {children}
    </svg>
  );
}

/* koordinat ke pixel dalam QuadrantSVG */
const qx = (v: number, ox=110) => ox + v*40;
const qy = (v: number, oy=110) => oy - v*40;

const questions: Q[] = [
  /* ══════════ GRUP 1: ROTASI 90° SEARAH JARUM JAM (CW) dari O ══════════ */
  Qn(1,"Rotasi 90° CW — Bayangan Titik",{type:"pg",
    content:"Titik Q(−3, 2) dirotasi 90° searah jarum jam terhadap titik asal. Koordinat bayangan Q adalah ...",
    opts:["Q′(2, 3)","Q′(−2, −3)","Q′(3, 2)","Q′(−3, −2)"],
  }),
  Qn(2,"Diagram — Persegi Panjang Rotasi 90° CW",{type:"pg",
    diagram:(
      <GridSVG>
        <Poly pts={[[1,1],[4,1],[4,3],[1,3]]} color="#fb923c" label="ABCD"/>
        <Poly pts={[[1,-1],[1,-4],[3,-4],[3,-1]]} color="#34d399" fill="rgba(52,211,153,0.12)" label="A'B'C'D'"/>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <ArcArrow cx={0} cy={0} r={25} startAngle={100} endAngle={-10} color="#facc15"/>
      </GridSVG>
    ),
    content:"Perhatikan diagram. Titik B(4, 1) dari persegi panjang ABCD dirotasi 90° CW terhadap titik asal. Koordinat bayangan B′ adalah ...",
    opts:["B′(−4, 1)","B′(1, −4)","B′(4, −1)","B′(−1, 4)"],
  }),
  Qn(3,"Diagram — Segitiga Rotasi ke Kuadran IV",{type:"pg",
    diagram:(
      <GridSVG>
        <Poly pts={[[2,0],[5,0],[5,3]]} color="#fb923c" label="△ABC"/>
        <Poly pts={[[0,-2],[0,-5],[3,-5]]} color="#a78bfa" fill="rgba(167,139,250,0.12)" label="△A'B'C'"/>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <ArcArrow cx={0} cy={0} r={18} startAngle={0} endAngle={-90} color="#facc15"/>
      </GridSVG>
    ),
    content:"Perhatikan diagram. Segitiga berputar dari kuadran I ke kuadran IV. Jenis rotasi yang terjadi adalah ...",
    opts:["90° CCW","90° CW","180°","270° CCW"],
  }),
  /* ══════════ GRUP 2: ROTASI 90° BERLAWANAN JARUM JAM (CCW) dari O ══════════ */
  Qn(4,"Pemetaan Dasar Rotasi 90° CCW",{type:"mixed",
    content:"Rotasi 90° berlawanan arah jarum jam terhadap titik pusat O(0,0) memetakan titik (x, y) menjadi ...",
    parts:[
      {label:"A.",text:"(x, y) → (y, x)"},
      {label:"B.",text:"(x, y) → (−x, −y)"},
      {label:"C.",text:"(x, y) → (y, −x)"},
      {label:"D.",text:"(x, y) → (−y, x)"},
      {label:"Petunjuk:",text:"Verifikasi pilihan D dengan titik uji P(3, 0): rotasi 90° CCW seharusnya menghasilkan P′(0, 3). Gunakan rumus yang benar."},
    ],
  }),
  Qn(5,"Bayangan Titik — Rotasi 90° CCW dari O",{type:"mixed",
    content:"Hasil rotasi titik A(6, 3) sejauh 90° berlawanan arah jarum jam dengan pusat titik asal O adalah ...",
    parts:[
      {label:"A.",text:"A′(6, −3)"},
      {label:"B.",text:"A′(−6, 3)"},
      {label:"C.",text:"A′(−3, 6)"},
      {label:"D.",text:"A′(3, −6)"},
      {label:"Tunjukkan:",math:"A(6,3) \\overset{90°\\text{ CCW}}{\\longrightarrow} A'(?,\\,?)"},
    ],
  }),
  Qn(6,"Diagram — Kuadran Bayangan setelah Rotasi [O, 90°]",{type:"pg",
    diagram:(
      <QuadrantSVG>
        <rect x={qx(-2.5)} y={qy(-1)} width={40} height={27}
          fill="rgba(251,146,60,0.15)" stroke="#fb923c" strokeWidth="1.5"/>
        <text x={qx(-2)+2} y={qy(-1.5)+4} fill="#fb923c" fontSize="9" fontWeight="bold">A</text>
        <path d={`M${qx(-1.8)},${qy(-0.3)} A${2*40},${2*40},0,0,1,${qx(0.3)},${qy(1.8)}`}
          fill="none" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,3"/>
        <polygon points={`${qx(0.3)},${qy(1.8)} ${qx(0.1)},${qy(1.5)} ${qx(0.5)},${qy(1.6)}`} fill="#facc15"/>
      </QuadrantSVG>
    ),
    content:"Bangun A terletak di kuadran III. Bangun diputar sebesar [O, 90°] berlawanan arah jarum jam. Hasil rotasi bangun A terletak di kuadran ...",
    opts:["Kuadran I","Kuadran II","Kuadran III","Kuadran IV"],
  }),
  Qn(7,"Menemukan Sudut Rotasi",{type:"pg",
    content:"Titik P(3, 0) dirotasi terhadap titik asal menghasilkan P′(0, 3). Sudut rotasi yang digunakan adalah ...",
    opts:["90° CW","90° CCW","180°","270° CCW"],
  }),
  Qn(8,"Mencari Titik Asal dari Bayangan 90° CCW",{type:"pg",
    content:"Bayangan suatu titik setelah rotasi 90° CCW terhadap titik asal adalah P′(−3, 5). Koordinat titik asal P adalah ...",
    opts:["P(5, −3)","P(5, 3)","P(3, 5)","P(−5, 3)"],
  }),
  Qn(9,"Rotasi 90° CCW — Mencari Parameter",{type:"pg",
    content:"Titik P(a, b) dirotasi 90° CCW terhadap titik asal menghasilkan P′(−4, 3). Nilai a + b adalah ...",
    opts:["1","5","7","−1"],
  }),
  Qn(10,"Mencari Nilai a + b dari Bayangan Rotasi",{type:"pg",
    content:"Bayangan titik M(a, b) setelah dirotasi oleh R[O(0, 0), θ = 90°] berlawanan arah jarum jam adalah M′(−3, 5). Nilai (a + b) adalah ...",
    opts:["3","5","8","−8"],
  }),
  /* ══════════ GRUP 3: ROTASI 180° dari O ══════════ */
  Qn(11,"Bayangan Titik — Rotasi 180° dari O",{type:"mixed",
    content:"Titik A(3, 7) dengan R[O, 180°] menghasilkan koordinat A′ = ...",
    parts:[
      {label:"A.",text:"A′(−3, 7)"},
      {label:"B.",text:"A′(3, −7)"},
      {label:"C.",text:"A′(−3, −7)"},
      {label:"D.",text:"A′(7, 3)"},
      {label:"Buktikan:",math:"A(3,7) \\overset{180°}{\\longrightarrow} A'(-3,-7)"},
    ],
  }),
  Qn(12,"Menentukan Nilai α pada Rotasi",{type:"mixed",
    content:"Diketahui P(−4, 9) dirotasi sebesar α° dengan pusat O menghasilkan P′(4, −9). Nilai α yang mungkin adalah ...",
    parts:[
      {label:"A.",text:"−90°"},
      {label:"B.",text:"90°"},
      {label:"C.",text:"180°"},
      {label:"D.",text:"270°"},
      {label:"Analisis:",text:"Perhatikan pola: koordinat x berubah tanda, koordinat y berubah tanda → pemetaan (x,y) → (−x,−y) sesuai dengan rotasi berapa derajat?"},
    ],
  }),
  Qn(13,"Bangun Segitiga OAB Dirotasi [O, 180°]",{type:"mixed",
    content:"Bangun segitiga OAB dengan O(0,0), A(8, 0), B(8, 6) dirotasikan oleh [O, 180°]. Pernyataan yang benar adalah ...",
    parts:[
      {label:"A.",text:"Bayangan A′ berada di kuadran II."},
      {label:"B.",text:"Bayangan B′(−8, −6) berada di kuadran III."},
      {label:"C.",text:"Bayangan B′ berada di kuadran I."},
      {label:"D.",text:"Titik O tidak bergerak, tetapi A′ dan B′ berada di kuadran IV."},
      {label:"Verifikasi:",math:"A(8,0)\\to A'(-8,0);\\quad B(8,6)\\to B'(-8,-6)\\text{ (Kuadran III)}"},
    ],
  }),
  Qn(14,"Mencari Titik Asal dari Bayangan 180°",{type:"pg",
    content:"Bayangan suatu titik setelah rotasi 180° terhadap titik asal adalah K′(4, −3). Koordinat titik asal K adalah ...",
    opts:["K(−4, 3)","K(4, 3)","K(−4, −3)","K(3, −4)"],
  }),
  Qn(15,"Rotasi 180° dilanjutkan Translasi",{type:"pg",
    content:"Titik A(2, 3) dirotasi 180° terhadap titik asal, lalu ditranslasikan oleh T = (1, −2). Koordinat bayangan akhir A adalah ...",
    opts:["A″(−1, −5)","A″(1, −5)","A″(−1, 5)","A″(3, −5)"],
  }),
  /* ══════════ GRUP 4: ROTASI 270° BERLAWANAN JARUM JAM (CCW) dari O ══════════ */
  Qn(16,"Rotasi 270° CCW — Bayangan Titik",{type:"pg",
    content:"Titik K(2, 3) dirotasi 270° berlawanan arah jarum jam terhadap titik asal. Koordinat bayangan K adalah ...",
    opts:["K′(−3, 2)","K′(3, −2)","K′(−2, −3)","K′(2, 3)"],
  }),
  Qn(17,"Rotasi 270° CCW — Sudut Istimewa",{type:"pg",
    content:"Titik P(4, 0) dirotasi 270° CCW terhadap titik asal. Koordinat bayangan P adalah ...",
    opts:["P′(0, 4)","P′(0, −4)","P′(−4, 0)","P′(4, 0)"],
  }),
  /* ══════════ GRUP 5: ROTASI 90° terhadap PUSAT (a, b) ══════════ */
  Qn(18,"Rotasi 90° CCW terhadap Pusat P",{type:"pg",
    content:"Titik A(5, 3) dirotasi 90° CCW terhadap pusat P(2, 1). Koordinat bayangan A adalah ...",
    opts:["A′(0, 2)","A′(0, 4)","A′(2, 4)","A′(−2, 4)"],
  }),
  Qn(19,"Rotasi 90° CCW dari Pusat Bukan Asal",{type:"pg",
    content:"Titik P(4, 2) dirotasi 90° CCW terhadap pusat R(1, 1). Koordinat bayangan P adalah ...",
    opts:["P′(0, 2)","P′(0, 4)","P′(2, 4)","P′(4, 0)"],
  }),
  Qn(20,"Menentukan Pusat Rotasi",{type:"pg",
    content:"Titik P(2, 1) dipetakan ke P′(−1, 2) oleh rotasi 90° CCW. Pusat rotasi tersebut adalah ...",
    opts:["(1, 1)","(0, 0)","(1, 0)","(0, 1)"],
  }),
  Qn(21,"Rotasi 90° CCW terhadap Pusat P",{type:"pg",
    content:"Titik C(6, 1) dirotasi oleh R[P(2, −1), θ = 90°] berlawanan arah jarum jam. Koordinat bayangan C adalah ...",
    opts:["C′(2, 3)","C′(0, 3)","C′(0, −3)","C′(−2, 3)"],
  }),
  Qn(22,"Rotasi −90° terhadap Pusat Bukan Asal",{type:"pg",
    content:"Bayangan titik B(4, −1) setelah dirotasi oleh R[P(−2, 3), θ = −90°] adalah ...",
    opts:["B′(−6, −3)","B′(6, 3)","B′(3, −6)","B′(−3, 6)"],
  }),
  /* ══════════ GRUP 6: ROTASI 180° terhadap PUSAT (a, b) ══════════ */
  Qn(23,"Translasi dilanjutkan Rotasi 180°",{type:"pg",
    content:"Titik Q(3, −1) ditranslasikan oleh T = (−2, 3), kemudian dilanjutkan rotasi R[(1, −2), θ = 180°]. Koordinat bayangan akhir Q adalah ...",
    opts:["(1, −6)","(−1, 6)","(6, 1)","(−6, −1)"],
  }),
  /* ══════════ GRUP 7: KURVA, GARIS, DAN LAINNYA ══════════ */
  Qn(24,"Kurva y = x² + 1 Dirotasi [O, 180°] — Pernyataan yang SALAH",{type:"mixed",
    content:"Kurva y = x² + 1 dirotasi oleh [O, 180°]. Pernyataan berikut benar, kecuali ...",
    parts:[
      {label:"A.",text:"Kurva bayangan terbuka ke bawah."},
      {label:"B.",text:"Titik puncak bayangan berada di bawah sumbu X."},
      {label:"C.",text:"Titik potong kurva bayangan dengan sumbu Y adalah (0, −1)."},
      {label:"D.",text:"Sumbu simetri kurva bayangan adalah y = 0."},
      {label:"Petunjuk:",math:"R[O,180°]: (x,y)\\to(-x,-y).\\quad y=x^2+1\\to -y=(-x)^2+1 \\Rightarrow y=-(x^2+1)"},
    ],
  }),
  Qn(25,"Bayangan Garis y = 2x oleh Rotasi [O, 90° CCW]",{type:"mixed",
    content:"Garis y = 2x dirotasikan oleh [O, 90°] berlawanan arah jarum jam. Bayangannya adalah ...",
    parts:[
      {label:"A.",text:"y = −2x"},
      {label:"B.",text:"y = x"},
      {label:"C.",text:"x + 2y = 0"},
      {label:"D.",text:"2x + y = 0"},
      {label:"Langkah:",math:"\\text{Titik }(t,2t)\\overset{90°\\text{ CCW}}{\\longrightarrow}(-2t,t).\\;x=-2t,\\,y=t \\Rightarrow x=-2y \\Rightarrow x+2y=0"},
    ],
  }),
  Qn(26,"Rotasi CCW dilanjutkan Refleksi",{type:"pg",
    content:"Titik L(2, −4) dirotasi oleh R[(0, 0), θ = 90°] berlawanan arah jarum jam, kemudian bayangannya direfleksikan terhadap garis y = 3. Koordinat bayangan akhir L adalah ...",
    opts:["(4, 4)","(−4, 4)","(4, −4)","(−4, −4)"],
  }),
];

const RotasiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <RotateCcw className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,146,60,0.7)' }}>
            ROTASI (PERPUTARAN)
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Transformasi Geometri · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 26 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-2">📌 Rumus Kunci — Rotasi terhadap Titik Asal O(0,0)</p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {[
              {label:"90° CCW", math:"(x,y)\\to(-y,x)"},
              {label:"90° CW", math:"(x,y)\\to(y,-x)"},
              {label:"180°", math:"(x,y)\\to(-x,-y)"},
              {label:"270° CCW", math:"(x,y)\\to(y,-x)"},
            ].map(r => (
              <div key={r.label} className="bg-white/5 rounded-lg px-2 py-1.5">
                <p className="text-orange-400 font-bold mb-0.5">{r.label}</p>
                <InlineMath>{r.math}</InlineMath>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-amber-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center shrink-0">
                    <span className="text-orange-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.math && <div className="mb-3 overflow-x-auto"><BlockMath>{q.math}</BlockMath></div>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.opts && (
                      <div className="grid grid-cols-2 gap-2 mt-1 mb-1">
                        {(["A","B","C","D"] as const).map((lbl, oi) => (
                          <div key={lbl} className="flex items-center gap-2 bg-white/5 border border-orange-500/15 rounded-lg px-3 py-2">
                            <span className="text-orange-400 text-xs font-bold shrink-0 w-4">{lbl}.</span>
                            <span className="font-body text-xs text-white/85 leading-snug">{q.opts![oi]}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-orange-400 text-xs font-bold shrink-0 mt-0.5">{p.label}</span>}
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
            Beberapa soal dilengkapi diagram bidang koordinat yang menunjukkan perputaran titik dan bangun dengan indikator arah rotasi. Soal-soal dipilih dari kisi-kisi UN, ANBK, dan TKA.
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

export default RotasiPage;
