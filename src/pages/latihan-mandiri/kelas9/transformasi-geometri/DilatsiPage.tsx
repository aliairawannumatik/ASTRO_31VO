import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { Maximize2 } from "lucide-react";

const S = 200;
const sc = S / 12;
const ox = S / 2, oy = S / 2;
const px = (x: number) => ox + x * sc;
const py = (y: number) => oy - y * sc;

function GridSVG({ children, w = S, h = S }: { children?: React.ReactNode; w?: number; h?: number }) {
  const ticks = [-5,-4,-3,-2,-1,1,2,3,4,5];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${S} ${S}`} className="rounded-xl border border-rose-500/20 bg-slate-900/60">
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

function Dot({ x, y, color = "#f43f5e", r = 4, label = "" }: { x: number; y: number; color?: string; r?: number; label?: string }) {
  return (
    <g>
      <circle cx={px(x)} cy={py(y)} r={r} fill={color} opacity="0.9"/>
      {label && <text x={px(x)+6} y={py(y)-4} fill={color} fontSize="9" fontWeight="bold">{label}</text>}
    </g>
  );
}

function Poly({ pts, color = "#f43f5e", fill = "rgba(244,63,94,0.12)", label = "" }: { pts: [number,number][]; color?: string; fill?: string; label?: string }) {
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

function DilLine({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={px(x1)} y1={py(y1)} x2={px(x2)} y2={py(y2)} stroke="#facc15" strokeWidth="0.8" strokeDasharray="3,2"/>;
}

type Choice = { label: string; text: string };
type Q = {
  n: number;
  title: string;
  content: string;
  math?: string;
  diagram?: React.ReactNode;
  choices: Choice[];
  answer: "A" | "B" | "C" | "D";
};

const questions: Q[] = [
  /* ══════════ GRUP 1: DILATASI PUSAT O(0,0) ══════════ */
  {
    n: 1, title: "Dilatasi dengan k Negatif",
    content: "Titik A(1, 3) didilatasi dengan pusat O(0, 0) dan faktor skala k = −2. Bayangan A′ adalah ...",
    choices: [
      { label: "A", text: "(2, 6)" },
      { label: "B", text: "(−2, −6)" },
      { label: "C", text: "(−2, 6)" },
      { label: "D", text: "(2, −6)" },
    ],
    answer: "B",
  },
  {
    n: 2, title: "Dilatasi dengan k Pecahan",
    content: "Titik A(6, 4) didilatasi dengan pusat O(0, 0) dan faktor skala k = 1/2. Bayangan A′ adalah ...",
    choices: [
      { label: "A", text: "(3, 2)" },
      { label: "B", text: "(12, 8)" },
      { label: "C", text: "(−3, −2)" },
      { label: "D", text: "(6, 4)" },
    ],
    answer: "A",
  },
  {
    n: 3, title: "Mencari Koordinat Asal dari Bayangan",
    content: "S(x, y) didilatasi dengan pusat O(0, 0) dan k = 3 menghasilkan S′(−9, 12). Koordinat titik S adalah ...",
    choices: [
      { label: "A", text: "(−3, 4)" },
      { label: "B", text: "(3, −4)" },
      { label: "C", text: "(3, 4)" },
      { label: "D", text: "(−27, 36)" },
    ],
    answer: "A",
  },
  {
    n: 4, title: "Faktor Skala — Diagram Segitiga",
    diagram: (
      <GridSVG>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <Poly pts={[[1,0],[2,0],[2,2]]} color="#f43f5e" label="△ABC"/>
        <Poly pts={[[2,0],[4,0],[4,4]]} color="#22d3ee" fill="rgba(34,211,238,0.12)" label="△A'B'C'"/>
        <DilLine x1={0} y1={0} x2={4} y2={0}/>
        <DilLine x1={0} y1={0} x2={4} y2={4}/>
      </GridSVG>
    ),
    content: "Perhatikan diagram di bawah. Faktor skala dilatasi dari △ABC ke △A′B′C′ adalah ...",
    choices: [
      { label: "A", text: "2" },
      { label: "B", text: "3" },
      { label: "C", text: "4" },
      { label: "D", text: "6" },
    ],
    answer: "A",
  },
  {
    n: 5, title: "Mencari Faktor Skala dari Titik Awal dan Bayangan",
    content: "Titik P(3, −6) didilatasi terhadap pusat O(0, 0) menghasilkan bayangan P′(9, −18). Faktor skala dilatasi tersebut adalah ...",
    choices: [
      { label: "A", text: "2" },
      { label: "B", text: "3" },
      { label: "C", text: "−3" },
      { label: "D", text: "6" },
    ],
    answer: "B",
  },
  {
    n: 6, title: "Bayangan Titik Segitiga Setelah Dilatasi",
    content: "Segitiga ABC mempunyai koordinat A(0, 0), B(4, 0), dan C(0, 3). Segitiga tersebut didilatasi dengan pusat O(0, 0) dan faktor skala k = 3. Tentukan bayangan A′, B′, dan C′!",
    choices: [
      { label: "A", text: "A′(0, 0), B′(12, 0), C′(0, 9)" },
      { label: "B", text: "A′(0, 0), B′(7, 0), C′(0, 6)" },
      { label: "C", text: "A′(0, 0), B′(4, 0), C′(0, 3)" },
      { label: "D", text: "A′(3, 3), B′(12, 3), C′(3, 9)" },
    ],
    answer: "A",
  },
  {
    n: 7, title: "Luas Bayangan — Diagram Pembesaran",
    diagram: (
      <GridSVG>
        <Poly pts={[[1,0],[2,0],[2,2],[1,2]]} color="#f43f5e" label="P"/>
        <Poly pts={[[2,0],[4,0],[4,4],[2,4]]} color="#22d3ee" fill="rgba(34,211,238,0.12)" label="P'"/>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <DilLine x1={0} y1={0} x2={4} y2={0}/>
        <DilLine x1={0} y1={0} x2={4} y2={4}/>
        <DilLine x1={0} y1={0} x2={2} y2={4}/>
      </GridSVG>
    ),
    content: "Bangun P (merah) didilatasi terhadap pusat O menghasilkan P′ (biru). Luas P = 2 satuan luas. Berapa kali lebih besar luas P′ dibanding luas P?",
    choices: [
      { label: "A", text: "2 kali" },
      { label: "B", text: "4 kali" },
      { label: "C", text: "6 kali" },
      { label: "D", text: "8 kali" },
    ],
    answer: "B",
  },
  {
    n: 8, title: "Dilatasi dengan Koordinat Variabel",
    content: "Titik A(m, 2m) didilatasi terhadap O(0, 0) dengan k = 3 menghasilkan A′(9, 18). Nilai m adalah ...",
    choices: [
      { label: "A", text: "1" },
      { label: "B", text: "2" },
      { label: "C", text: "3" },
      { label: "D", text: "6" },
    ],
    answer: "C",
  },
  /* ══════════ GRUP 2: DILATASI PUSAT (a, b) ══════════ */
  {
    n: 9, title: "Dilatasi dengan Pusat Bergeser",
    content: "Titik A(5, 4) didilatasi dengan pusat P(1, 2) dan k = 3. Bayangan A′ adalah ...",
    choices: [
      { label: "A", text: "(13, 8)" },
      { label: "B", text: "(12, 6)" },
      { label: "C", text: "(16, 14)" },
      { label: "D", text: "(4, 2)" },
    ],
    answer: "A",
  },
  {
    n: 10, title: "Bayangan Titik — Diagram Pusat Bukan O",
    diagram: (
      <GridSVG w={280} h={280}>
        <Dot x={1} y={1} color="#facc15" r={3} label="P(1,1)"/>
        <Poly pts={[[2,1],[3,1],[2,2]]} color="#f43f5e" label="△"/>
        <Poly pts={[[3,1],[5,1],[3,3]]} color="#22d3ee" fill="rgba(34,211,238,0.12)" label="△'"/>
        <DilLine x1={1} y1={1} x2={5} y2={1}/>
        <DilLine x1={1} y1={1} x2={3} y2={3}/>
      </GridSVG>
    ),
    content: "Segitiga merah didilatasi terhadap pusat P(1, 1). Koordinat bayangan titik (2, 1) adalah ...",
    choices: [
      { label: "A", text: "(3, 1)" },
      { label: "B", text: "(4, 2)" },
      { label: "C", text: "(5, 3)" },
      { label: "D", text: "(2, 1)" },
    ],
    answer: "A",
  },
  /* ══════════ GRUP 3: MENCARI TITIK ASAL — PUSAT (a, b) ══════════ */
  {
    n: 11, title: "Mencari Titik Asal dari Bayangan — Pusat (1, −2), k = 3",
    content: "Bayangan titik A setelah didilatasi terhadap pusat P(1, −2) dengan faktor skala k = 3 adalah A′(7, 4). Koordinat titik A adalah ...",
    choices: [
      { label: "A", text: "(3, 0)" },
      { label: "B", text: "(4, 2)" },
      { label: "C", text: "(1, 0)" },
      { label: "D", text: "(3, 2)" },
    ],
    answer: "A",
  },
  /* ══════════ GRUP 4: DILATASI SEGITIGA — PUSAT (a, b) ══════════ */
  {
    n: 12, title: "Bayangan Segitiga — Pusat (−2, 3), k = 4",
    content: "Diketahui segitiga dengan titik A(−1, 2), B(0, 2), dan C(−1, 4) didilatasikan dengan faktor skala k = 4 dan pusat P(−2, 3). Tentukan bayangan A′, B′, dan C′!",
    choices: [
      { label: "A", text: "A′(2, −1), B′(6, −1), C′(2, 7)" },
      { label: "B", text: "A′(2, 5), B′(6, 5), C′(2, 13)" },
      { label: "C", text: "A′(−4, 8), B′(0, 8), C′(−4, 16)" },
      { label: "D", text: "A′(2, −1), B′(6, −1), C′(6, 7)" },
    ],
    answer: "A",
  },
  {
    n: 13, title: "Dilatasi Dilanjut Refleksi Sumbu-x",
    content: "Titik A(2, 3) didilatasi terhadap O dengan k = 2 menghasilkan A′. Kemudian A′ direfleksikan terhadap sumbu-x menghasilkan A″. Koordinat A″ adalah ...",
    choices: [
      { label: "A", text: "(4, 6)" },
      { label: "B", text: "(−4, 6)" },
      { label: "C", text: "(4, −6)" },
      { label: "D", text: "(2, −3)" },
    ],
    answer: "C",
  },
  {
    n: 14, title: "Dilatasi Dilanjut Translasi",
    content: "Titik A(2, 1) didilatasi terhadap O(0, 0) dengan k = 3 menghasilkan A′. Kemudian A′ ditranslasikan oleh T(−4, 2) menghasilkan A″. Koordinat A″ adalah ...",
    choices: [
      { label: "A", text: "(6, 3)" },
      { label: "B", text: "(2, 5)" },
      { label: "C", text: "(−2, 5)" },
      { label: "D", text: "(2, −5)" },
    ],
    answer: "B",
  },
  {
    n: 15, title: "Dilatasi Dilanjut Rotasi 90° Berlawanan Arah Jarum Jam",
    content: "Titik C(3, 2) didilatasi terhadap O dengan k = 2 menghasilkan C′(6, 4). C′ dirotasikan 90° berlawanan arah jarum jam terhadap pusat P(2, 0). Koordinat C″ adalah ...",
    choices: [
      { label: "A", text: "(4, −2)" },
      { label: "B", text: "(−2, 4)" },
      { label: "C", text: "(2, 4)" },
      { label: "D", text: "(−4, 2)" },
    ],
    answer: "B",
  },
  /* ══════════ GRUP 5: DILATASI KURVA LINEAR ══════════ */
  {
    n: 16, title: "Bayangan Kurva Linear — k = 2, Pusat O(0, 0)",
    content: "Garis y = x + 3 didilatasi terhadap pusat O(0, 0) dengan faktor skala k = 2. Persamaan bayangan garis tersebut adalah ...",
    choices: [
      { label: "A", text: "y = x + 6" },
      { label: "B", text: "y = x + 3" },
      { label: "C", text: "y = 2x + 6" },
      { label: "D", text: "y = x + 12" },
    ],
    answer: "A",
  },
  {
    n: 17, title: "Bayangan Kurva Linear — k = 4, Pusat (1, −2)",
    content: "Garis y = 2x + 1 didilatasi terhadap pusat P(1, −2) dengan faktor skala k = 4. Persamaan bayangan garis tersebut adalah ...",
    choices: [
      { label: "A", text: "y = 2x + 1" },
      { label: "B", text: "y = 2x − 16" },
      { label: "C", text: "y = 2x + 4" },
      { label: "D", text: "y = 2x + 16" },
    ],
    answer: "D",
  },
  {
    n: 18, title: "Bayangan Kurva Linear — k = −2, Pusat (−3, 4)",
    content: "Garis y = 2x + 5 didilatasi terhadap pusat P(−3, 4) dengan faktor skala k = −2. Persamaan bayangan garis tersebut adalah ...",
    choices: [
      { label: "A", text: "y = 2x − 20" },
      { label: "B", text: "y = −2x + 20" },
      { label: "C", text: "y = 2x + 20" },
      { label: "D", text: "y = 2x + 5" },
    ],
    answer: "C",
  },
  {
    n: 19, title: "Kurva Asal dari Bayangan — k = 3, Pusat O(0, 0)",
    content: "Bayangan suatu garis setelah didilatasi terhadap pusat O(0, 0) dengan k = 3 adalah y = 2x + 6. Persamaan garis asalnya adalah ...",
    choices: [
      { label: "A", text: "y = 2x + 18" },
      { label: "B", text: "y = 2x + 6" },
      { label: "C", text: "y = 6x + 6" },
      { label: "D", text: "y = 2x + 2" },
    ],
    answer: "D",
  },
  {
    n: 20, title: "Kurva Asal dari Bayangan — k = 3, Pusat (−5, 1)",
    content: "Bayangan suatu garis setelah didilatasi terhadap pusat P(−5, 1) dengan k = 3 adalah y = 2x − 13. Persamaan garis asalnya adalah ...",
    choices: [
      { label: "A", text: "y = 2x − 3" },
      { label: "B", text: "y = 2x + 3" },
      { label: "C", text: "y = 2x − 39" },
      { label: "D", text: "y = 2x − 13" },
    ],
    answer: "B",
  },
];

const groupHeaders: Record<number, string> = {
  1:  "📍 Dilatasi Pusat O(0, 0)",
  9:  "📍 Dilatasi Pusat (a, b)",
  11: "🔍 Mencari Titik Asal — Pusat (a, b)",
  12: "📐 Dilatasi Segitiga — Pusat (a, b)",
  13: "🔀 Dilatasi Komposisi",
  16: "📈 Dilatasi Kurva Linear",
};

const DilatsiPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <Maximize2 className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(244,63,94,0.7)' }}>
            DILATASI (PERKALIAN/PERUBAHAN UKURAN)
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Transformasi Geometri · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-3 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 20 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-2">📌 Rumus Kunci — Dilatasi</p>
          <div className="flex flex-col gap-2">
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <p className="text-rose-400 text-[10px] font-bold mb-1">Pusat O(0,0)</p>
              <BlockMath>{String.raw`P(x,y) \xrightarrow{k} P'(kx,\; ky)`}</BlockMath>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2">
              <p className="text-rose-400 text-[10px] font-bold mb-1">Pusat (a, b)</p>
              <BlockMath>{String.raw`x' = a + k(x-a),\quad y' = b + k(y-b)`}</BlockMath>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-white/5 rounded-lg px-2 py-1.5">
                <p className="text-rose-400 font-bold">k &gt; 1 → Pembesaran</p>
              </div>
              <div className="bg-white/5 rounded-lg px-2 py-1.5">
                <p className="text-rose-400 font-bold">0 &lt; k &lt; 1 → Penyusutan</p>
              </div>
              <div className="bg-white/5 rounded-lg px-2 py-1.5">
                <p className="text-rose-400 font-bold">k &lt; 0 → Balik + skala</p>
              </div>
              <div className="bg-white/5 rounded-lg px-2 py-1.5">
                <p className="text-rose-400 font-bold">Luas → k² × luas asal</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n}>
              {groupHeaders[q.n] && (
                <div className="flex items-center gap-3 mb-2 mt-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-rose-500/40 to-transparent"/>
                  <span className="text-rose-300 text-[11px] font-bold tracking-widest uppercase whitespace-nowrap">
                    {groupHeaders[q.n]}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-l from-rose-500/40 to-transparent"/>
                </div>
              )}
              <div className="relative rounded-2xl overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 0.02}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" />
                <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
                <div className="relative px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                      <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">
                        {q.title}
                      </span>
                      <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>
                      {q.math && (
                        <div className="mb-3 overflow-x-auto">
                          <BlockMath>{q.math}</BlockMath>
                        </div>
                      )}
                      {q.diagram && (
                        <div className="mb-3 flex justify-center">{q.diagram}</div>
                      )}
                      <div className="grid grid-cols-1 gap-2">
                        {q.choices.map(c => (
                          <div
                            key={c.label}
                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-body text-white/80"
                          >
                            <span className="font-bold text-xs shrink-0 w-5 text-rose-400">{c.label}.</span>
                            <span>{c.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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

export default DilatsiPage;
