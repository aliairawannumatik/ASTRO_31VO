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

function GridSVG({ children }: { children?: React.ReactNode }) {
  const ticks = [-5,-4,-3,-2,-1,1,2,3,4,5];
  return (
    <svg width={S} height={S} className="rounded-xl border border-rose-500/20 bg-slate-900/60">
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
    n: 2, title: "Perbandingan Luas Setelah Dilatasi",
    content: "Segitiga PQR dengan P(2, 1), Q(6, 1), R(4, 5) didilatasi terhadap O dengan k = 2. Berapa kali lebih besar luas △P′Q′R′ dibanding luas △PQR?",
    choices: [
      { label: "A", text: "2 kali" },
      { label: "B", text: "4 kali" },
      { label: "C", text: "6 kali" },
      { label: "D", text: "8 kali" },
    ],
    answer: "B",
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
    content: "Perhatikan diagram di atas. Faktor skala dilatasi dari △ABC ke △A′B′C′ adalah ...",
    choices: [
      { label: "A", text: "2" },
      { label: "B", text: "3" },
      { label: "C", text: "4" },
      { label: "D", text: "6" },
    ],
    answer: "A",
  },
  {
    n: 5, title: "Faktor Skala — Diagram Segi Empat",
    diagram: (
      <GridSVG>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <Poly pts={[[1,0],[1,1],[0,1],[0,0]]} color="#f43f5e" label="KLMN"/>
        <Poly pts={[[3,0],[3,3],[0,3],[0,0]]} color="#a78bfa" fill="rgba(167,139,250,0.1)" label="K'L'M'N'"/>
        <DilLine x1={0} y1={0} x2={3} y2={0}/>
        <DilLine x1={0} y1={0} x2={3} y2={3}/>
        <DilLine x1={0} y1={0} x2={0} y2={3}/>
      </GridSVG>
    ),
    content: "Perhatikan diagram di atas. Faktor skala dilatasi segi empat KLMN ke segi empat K′L′M′N′ adalah ...",
    choices: [
      { label: "A", text: "9" },
      { label: "B", text: "6" },
      { label: "C", text: "3" },
      { label: "D", text: "2" },
    ],
    answer: "C",
  },
  {
    n: 6, title: "Luas Bayangan Segitiga Setelah Dilatasi",
    content: "Segitiga ABC mempunyai koordinat A(0, 0), B(4, 0), dan C(0, 3). Jika △A′B′C′ adalah bayangan △ABC hasil dilatasi D[O, 3], luas △A′B′C′ adalah ...",
    choices: [
      { label: "A", text: "6 satuan luas" },
      { label: "B", text: "18 satuan luas" },
      { label: "C", text: "36 satuan luas" },
      { label: "D", text: "54 satuan luas" },
    ],
    answer: "D",
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
    n: 8, title: "Koordinat Bayangan — Diagram Segitiga",
    diagram: (
      <GridSVG>
        <Poly pts={[[0,0],[2,0],[0,3]]} color="#f43f5e" label="△ABC"/>
        <Poly pts={[[0,0],[4,0],[0,6]]} color="#a78bfa" fill="rgba(167,139,250,0.12)" label="△A'B'C'"/>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <DilLine x1={0} y1={0} x2={4} y2={0}/>
        <DilLine x1={0} y1={0} x2={0} y2={6}/>
      </GridSVG>
    ),
    content: "Berdasarkan diagram, koordinat C′ (bayangan C(0, 3)) setelah dilatasi terhadap O adalah ...",
    choices: [
      { label: "A", text: "(0, 6)" },
      { label: "B", text: "(0, 3)" },
      { label: "C", text: "(4, 6)" },
      { label: "D", text: "(2, 6)" },
    ],
    answer: "A",
  },
  {
    n: 9, title: "Faktor Skala — Diagram Penyusutan",
    diagram: (
      <GridSVG>
        <Poly pts={[[-4,-4],[4,-4],[4,4],[-4,4]]} color="#f43f5e" label="Asal"/>
        <Poly pts={[[-2,-2],[2,-2],[2,2],[-2,2]]} color="#34d399" fill="rgba(52,211,153,0.12)" label="Bayangan"/>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <DilLine x1={0} y1={0} x2={4} y2={4}/>
        <DilLine x1={0} y1={0} x2={-4} y2={4}/>
        <DilLine x1={0} y1={0} x2={4} y2={-4}/>
        <DilLine x1={0} y1={0} x2={-4} y2={-4}/>
      </GridSVG>
    ),
    content: "Persegi besar (merah) didilatasi terhadap O menghasilkan persegi kecil (hijau). Faktor skala dilatasi tersebut adalah ...",
    choices: [
      { label: "A", text: "2" },
      { label: "B", text: "1/3" },
      { label: "C", text: "1/2" },
      { label: "D", text: "1/4" },
    ],
    answer: "C",
  },
  {
    n: 10, title: "Mencari Titik Asal dari Bayangan",
    content: "Bayangan titik A setelah dilatasi dengan pusat O(0, 0) dan k = 3 adalah A′(12, −9). Koordinat titik A adalah ...",
    choices: [
      { label: "A", text: "(4, −3)" },
      { label: "B", text: "(36, −27)" },
      { label: "C", text: "(4, 3)" },
      { label: "D", text: "(−4, 3)" },
    ],
    answer: "A",
  },
  {
    n: 11, title: "Sifat Titik Pusat dan Bayangan — Diagram",
    diagram: (
      <GridSVG>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <Dot x={1} y={2} color="#f43f5e" r={4} label="A(1,2)"/>
        <Dot x={3} y={6} color="#a78bfa" r={4} label="A'(3,6)"/>
        <DilLine x1={0} y1={0} x2={3} y2={6}/>
        <Dot x={2} y={1} color="#f43f5e" r={4} label="B(2,1)"/>
        <Dot x={6} y={3} color="#a78bfa" r={4} label="B'(6,3)"/>
        <DilLine x1={0} y1={0} x2={6} y2={3}/>
      </GridSVG>
    ),
    content: "Berdasarkan diagram, faktor skala dilatasi dari A ke A′ dan dari B ke B′ adalah ...",
    choices: [
      { label: "A", text: "2" },
      { label: "B", text: "3" },
      { label: "C", text: "4" },
      { label: "D", text: "6" },
    ],
    answer: "B",
  },
  {
    n: 12, title: "Perbandingan Panjang Ruas Setelah Dilatasi",
    content: "Ruas garis AB dengan A(1, 2) dan B(3, 4) didilatasi terhadap O(0, 0) dengan k = 3. Perbandingan panjang A′B′ terhadap AB adalah ...",
    choices: [
      { label: "A", text: "2 : 1" },
      { label: "B", text: "3 : 1" },
      { label: "C", text: "6 : 1" },
      { label: "D", text: "9 : 1" },
    ],
    answer: "B",
  },
  {
    n: 13, title: "Dilatasi dengan Koordinat Variabel",
    content: "Titik A(m, 2m) didilatasi terhadap O(0, 0) dengan k = 3 menghasilkan A′(9, 18). Nilai m adalah ...",
    choices: [
      { label: "A", text: "1" },
      { label: "B", text: "2" },
      { label: "C", text: "3" },
      { label: "D", text: "6" },
    ],
    answer: "C",
  },
  {
    n: 14, title: "ANBK — Dilatasi k = −1 dan Rotasi 180°",
    content: "Titik A(3, 2) didilatasi terhadap O dengan k = −1. Bayangan A′ adalah ...",
    choices: [
      { label: "A", text: "(3, −2)" },
      { label: "B", text: "(−3, 2)" },
      { label: "C", text: "(−3, −2)" },
      { label: "D", text: "(−6, −4)" },
    ],
    answer: "C",
  },
  /* ══════════ GRUP 2: DILATASI PUSAT (a, b) ══════════ */
  {
    n: 15, title: "Dilatasi dengan Pusat Bergeser",
    content: "Titik A(5, 4) didilatasi dengan pusat P(1, 2) dan k = 3. Bayangan A′ adalah ...",
    math: "A' = P + k(A-P)",
    choices: [
      { label: "A", text: "(13, 8)" },
      { label: "B", text: "(12, 6)" },
      { label: "C", text: "(16, 14)" },
      { label: "D", text: "(4, 2)" },
    ],
    answer: "A",
  },
  {
    n: 16, title: "Bayangan Titik — Diagram Pusat Bukan O",
    diagram: (
      <GridSVG>
        <Dot x={1} y={1} color="#facc15" r={3} label="P(1,1)"/>
        <Poly pts={[[2,1],[4,1],[2,3]]} color="#f43f5e" label="△"/>
        <Poly pts={[[3,1],[7,1],[3,5]]} color="#22d3ee" fill="rgba(34,211,238,0.12)" label="△'"/>
        <DilLine x1={1} y1={1} x2={7} y2={1}/>
        <DilLine x1={1} y1={1} x2={3} y2={5}/>
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
  /* ══════════ GRUP 3: DILATASI KOMPOSISI ══════════ */
  {
    n: 17, title: "ANBK — Dilatasi Dua Kali Berurutan",
    content: "Titik A(1, 2) didilatasi terhadap O dengan k₁ = 2, lalu hasilnya didilatasi lagi dengan k₂ = 3. Koordinat akhir A adalah ...",
    choices: [
      { label: "A", text: "(2, 4)" },
      { label: "B", text: "(3, 6)" },
      { label: "C", text: "(6, 12)" },
      { label: "D", text: "(12, 24)" },
    ],
    answer: "C",
  },
  {
    n: 18, title: "Dilatasi Dilanjut Refleksi Sumbu-x",
    content: "Titik A(2, 3) didilatasi terhadap O dengan k = 2 menghasilkan A′. Kemudian A′ direfleksikan terhadap sumbu-x menghasilkan A″. Koordinat A″ adalah ...",
    choices: [
      { label: "A", text: "(4, 6)" },
      { label: "B", text: "(−4, 6)" },
      { label: "C", text: "(4, −6)" },
      { label: "D", text: "(2, −3)" },
    ],
    answer: "C",
  },
  /* ══════════ GRUP 4: DILATASI KURVA LINEAR ══════════ */
  {
    n: 19, title: "Bayangan Garis Lurus — Pusat O(0, 0)",
    content: "Garis y = 3x − 4 didilatasi terhadap pusat O(0, 0) dengan faktor skala k = 2. Persamaan bayangan garis tersebut adalah ...",
    choices: [
      { label: "A", text: "y = 3x − 2" },
      { label: "B", text: "y = 6x − 4" },
      { label: "C", text: "y = 3x − 8" },
      { label: "D", text: "y = 6x − 8" },
    ],
    answer: "C",
  },
  {
    n: 20, title: "Garis Asal dari Bayangan — Pusat O(0, 0)",
    content: "Bayangan suatu garis setelah dilatasi D[O, 2] adalah y = 2x + 10. Persamaan garis asalnya adalah ...",
    choices: [
      { label: "A", text: "y = 2x + 20" },
      { label: "B", text: "y = 2x + 5" },
      { label: "C", text: "y = x + 5" },
      { label: "D", text: "y = 4x + 10" },
    ],
    answer: "B",
  },
  /* ══════════ GRUP 5: DILATASI PUSAT (a,b) LANJUTAN ══════════ */
  {
    n: 21, title: "Dilatasi Pusat P(1, 2) dengan k = 3",
    content: "Titik A(4, 6) didilatasi terhadap pusat P(1, 2) dengan faktor skala k = 3. Bayangan A′ adalah ...",
    math: "A' = P + k(A - P)",
    choices: [
      { label: "A", text: "(10, 14)" },
      { label: "B", text: "(13, 20)" },
      { label: "C", text: "(7, 8)" },
      { label: "D", text: "(12, 18)" },
    ],
    answer: "A",
  },
  {
    n: 22, title: "Dilatasi Pusat Q(2, −1) dengan k = −2",
    content: "Titik B(−1, 3) didilatasi terhadap pusat Q(2, −1) dengan faktor skala k = −2. Bayangan B′ adalah ...",
    math: "B' = Q + k(B - Q)",
    choices: [
      { label: "A", text: "(−4, −7)" },
      { label: "B", text: "(5, −9)" },
      { label: "C", text: "(8, −9)" },
      { label: "D", text: "(8, 5)" },
    ],
    answer: "C",
  },
];

const groupHeaders: Record<number, string> = {
  1:  "📍 Dilatasi Pusat O(0, 0)",
  15: "📍 Dilatasi Pusat (a, b)",
  17: "🔀 Dilatasi Komposisi",
  19: "📈 Dilatasi Kurva Linear — Pusat O(0, 0)",
  21: "📍 Dilatasi Pusat (a, b) — Lanjutan",
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
            <span className="text-rose-400 text-xs font-bold">📋 22 Soal</span>
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
              <p className="text-rose-400 text-[10px] font-bold mb-1">Pusat Q(a,b)</p>
              <BlockMath>{String.raw`P' = Q + k(P-Q)`}</BlockMath>
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
