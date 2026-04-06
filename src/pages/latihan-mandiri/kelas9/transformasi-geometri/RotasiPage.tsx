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
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay"|"mixed"|"diagram" };
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1,"Rotasi 90° Berlawanan Jarum Jam (CCW)",{type:"mixed",
    content:"Rotasi 90° CCW terhadap titik asal memetakan (x, y) → (−y, x). Tentukan bayangan titik-titik berikut:",
    parts:[
      {label:"a.",math:"A(3, 2) \\to A'"},
      {label:"b.",math:"B(-1, 4) \\to B'"},
      {label:"c.",math:"C(5, -3) \\to C'"},
    ],
  }),
  Qn(2,"Rotasi 90° Searah Jarum Jam (CW)",{type:"mixed",
    content:"Rotasi 90° CW terhadap titik asal memetakan (x, y) → (y, −x). Tentukan bayangan:",
    parts:[
      {label:"a.",math:"P(4, 1) \\to P'"},
      {label:"b.",math:"Q(-3, 2) \\to Q'"},
      {label:"c.",math:"R(0, -5) \\to R'"},
    ],
  }),
  Qn(3,"Rotasi 180° terhadap Titik Asal",{type:"mixed",
    content:"Rotasi 180° terhadap titik asal memetakan (x, y) → (−x, −y). Tentukan bayangan:",
    parts:[
      {label:"a.",math:"A(3, 4) \\to A'"},
      {label:"b.",math:"B(-2, -5) \\to B'"},
      {label:"c.",math:"C(6, -1) \\to C'"},
    ],
  }),
  Qn(4,"Rotasi 270° CCW (= 90° CW)",{type:"mixed",
    content:"Rotasi 270° CCW terhadap titik asal memetakan (x, y) → (y, −x). Tentukan bayangan:",
    parts:[
      {label:"a.",math:"K(2, 3) \\to K'"},
      {label:"b.",math:"L(-4, 1) \\to L'"},
      {label:"c.",math:"M(3, -3) \\to M'"},
    ],
  }),
  Qn(5,"Rotasi — Diagram Segitiga 90° CCW",{type:"diagram",
    diagram:(
      <GridSVG>
        <Poly pts={[[1,1],[4,1],[1,4]]} color="#fb923c" label="△ABC"/>
        <Poly pts={[[-1,1],[-1,4],[-4,1]]} color="#22d3ee" fill="rgba(34,211,238,0.12)" label="△A'B'C'"/>
        <ArcArrow cx={0} cy={0} r={22} startAngle={45} endAngle={135} color="#facc15"/>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
      </GridSVG>
    ),
    content:"Segitiga ABC dirotasi 90° CCW terhadap titik asal O.",
    parts:[
      {label:"a.",text:"Tentukan koordinat A, B, C dari diagram."},
      {label:"b.",text:"Verifikasi koordinat A′, B′, C′ menggunakan rumus rotasi 90° CCW."},
      {label:"c.",text:"Apakah luas segitiga berubah setelah rotasi?"},
    ],
  }),
  Qn(6,"Menemukan Sudut Rotasi",{type:"mixed",
    content:"Titik P(3, 0) dirotasi terhadap titik asal menghasilkan bayangan P′.",
    parts:[
      {label:"a.",math:"\\text{Jika } P'(0, 3), \\text{ berapa derajat sudut rotasinya?}"},
      {label:"b.",math:"\\text{Jika } P'(-3, 0), \\text{ berapa derajat sudut rotasinya?}"},
      {label:"c.",math:"\\text{Jika } P'(0, -3), \\text{ berapa derajat sudut rotasinya (CCW)?}"},
    ],
  }),
  Qn(7,"Rotasi terhadap Titik Bukan Asal",{type:"mixed",
    content:"Titik A(5, 3) dirotasi 90° CCW terhadap titik pusat P(2, 1). Langkah: translasi ke O, rotasi, balik translasi.",
    parts:[
      {label:"a.",math:"\\text{Translasi: } A - P = (5-2, 3-1) = (3, 2)"},
      {label:"b.",math:"\\text{Rotasi 90° CCW: } (3, 2) \\to (-2, 3)"},
      {label:"c.",math:"\\text{Balik translasi: } (-2, 3) + P = (-2+2, 3+1) = (0, 4) = A'"},
    ],
  }),
  Qn(8,"Rotasi 180° — UN Style",{type:"mixed",
    content:"Segitiga PQR dengan P(1,2), Q(4,2), R(3,5) dirotasi 180° terhadap titik asal.",
    parts:[
      {label:"a.",text:"Tentukan koordinat P′, Q′, R′."},
      {label:"b.",text:"Di kuadran manakah segitiga bayangan berada?"},
      {label:"c.",text:"Apakah bentuk dan ukuran segitiga berubah?"},
    ],
  }),
  Qn(9,"Rotasi dan Kuadran",{type:"mixed",
    content:"Titik A(3, 4) berada di Kuadran I. Setelah dirotasi terhadap titik asal, tentukan kuadran bayangan untuk masing-masing rotasi:",
    parts:[
      {label:"a.",text:"Rotasi 90° CCW"},
      {label:"b.",text:"Rotasi 180°"},
      {label:"c.",text:"Rotasi 270° CCW"},
      {label:"d.",text:"Rotasi 360°"},
    ],
  }),
  Qn(10,"Rotasi — Diagram 180°",{type:"diagram",
    diagram:(
      <GridSVG>
        <Poly pts={[[1,1],[3,1],[2,4]]} color="#fb923c" label="△"/>
        <Poly pts={[[-1,-1],[-3,-1],[-2,-4]]} color="#a78bfa" fill="rgba(167,139,250,0.12)" label="△'"/>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <ArcArrow cx={0} cy={0} r={20} startAngle={60} endAngle={240} color="#facc15"/>
      </GridSVG>
    ),
    content:"Segitiga dirotasi 180° terhadap titik asal O.",
    parts:[
      {label:"a.",text:"Tentukan koordinat semua sudut segitiga asal dan bayangan."},
      {label:"b.",text:"Verifikasi menggunakan rumus rotasi 180°."},
      {label:"c.",text:"Apa yang terjadi pada orientasi (arah) segitiga setelah rotasi 180°?"},
    ],
  }),
  Qn(11,"Rotasi Berturut-turut",{type:"mixed",
    content:"Titik A(2, 1) dirotasi berturut-turut:",
    parts:[
      {label:"",text:"Rotasi 90° CCW, lalu 90° CCW lagi."},
      {label:"a.",text:"Tentukan posisi A setelah rotasi pertama."},
      {label:"b.",text:"Tentukan posisi A setelah rotasi kedua."},
      {label:"c.",math:"\\text{Dua rotasi 90° CCW = satu rotasi } \\ldots\\text{°}"},
    ],
  }),
  Qn(12,"Rotasi — Menemukan Titik Asal",{type:"mixed",
    content:"Bayangan suatu titik setelah rotasi 90° CCW terhadap titik asal adalah P′(−3, 5). Tentukan titik asalnya P.",
    parts:[
      {label:"a.",math:"\\text{Gunakan invers: jika } (x,y) \\to (-y,x), \\text{ maka } (-y,x) \\to (x,y)"},
      {label:"b.",text:"Tentukan koordinat P."},
    ],
  }),
  Qn(13,"ANBK — Rotasi Persegi",{type:"mixed",
    content:"Persegi ABCD dengan A(1,1), B(3,1), C(3,3), D(1,3) dirotasi 90° CW terhadap titik asal.",
    parts:[
      {label:"a.",text:"Tentukan koordinat bayangan A′, B′, C′, D′."},
      {label:"b.",text:"Gambarkan sketsa persegi asal dan bayangannya."},
      {label:"c.",text:"Apakah persegi ABCD ≅ A′B′C′D′?"},
    ],
  }),
  Qn(14,"Rotasi 90° — Sumbu Bergeser",{type:"mixed",
    content:"Titik P(4, 2) dirotasi 90° CCW terhadap pusat R(1, 1).",
    parts:[
      {label:"a.",text:"Langkah 1: Hitung vektor dari R ke P: P − R = (4−1, 2−1) = (3, 1)."},
      {label:"b.",text:"Langkah 2: Rotasi vektor 90° CCW: (3, 1) → (−1, 3)."},
      {label:"c.",text:"Langkah 3: Tambahkan kembali R: (−1+1, 3+1) = P′(0, 4)."},
    ],
  }),
  Qn(15,"Rotasi — UN 2018 Style",{type:"mixed",
    content:"Diketahui titik A(−2, 3) dirotasikan 90° berlawanan arah jarum jam terhadap titik asal. Bayangan A adalah ...",
    parts:[
      {label:"",text:"Pilihan: a. (3, 2)   b. (−3, −2)   c. (−3, 2)   d. (3, −2)"},
      {label:"Jawab:",text:"Tentukan dan jelaskan langkah penyelesaiannya."},
    ],
  }),
  Qn(16,"Rotasi — Diagram Persegi Panjang 90° CW",{type:"diagram",
    diagram:(
      <GridSVG>
        <Poly pts={[[1,1],[4,1],[4,3],[1,3]]} color="#fb923c" label="ABCD"/>
        <Poly pts={[[1,-1],[1,-4],[3,-4],[3,-1]]} color="#34d399" fill="rgba(52,211,153,0.12)" label="A'B'C'D'"/>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <ArcArrow cx={0} cy={0} r={25} startAngle={100} endAngle={-10} color="#facc15"/>
      </GridSVG>
    ),
    content:"Persegi panjang ABCD dirotasi 90° CW terhadap titik asal.",
    parts:[
      {label:"a.",text:"Tentukan koordinat semua sudut ABCD dari diagram."},
      {label:"b.",text:"Verifikasi koordinat A′B′C′D′ menggunakan rumus rotasi 90° CW."},
      {label:"c.",text:"Apakah panjang dan lebar persegi panjang berubah setelah rotasi?"},
    ],
  }),
  Qn(17,"TKA — Rotasi 270°",{type:"mixed",
    content:"Titik Q(−2, 5) dirotasi 270° CCW terhadap titik asal. Rotasi 270° CCW = 90° CW, memetakan (x,y) → (y, −x).",
    parts:[
      {label:"a.",text:"Tentukan bayangan Q."},
      {label:"b.",math:"\\text{Tentukan juga bayangan Q jika dirotasi 90° CCW: } Q \\to Q_1"},
      {label:"c.",text:"Apakah Q dan Q₁ berbeda? Jelaskan mengapa."},
    ],
  }),
  Qn(18,"Rotasi 360°",{type:"mixed",
    content:"Titik M(a, b) dirotasi 360° terhadap sembarang pusat rotasi.",
    parts:[
      {label:"a.",text:"Apa yang terjadi pada posisi M setelah rotasi 360°?"},
      {label:"b.",math:"\\text{Nyatakan rotasi 360° secara matematis: } (a,b) \\to ?"},
      {label:"c.",text:"Apakah rotasi 360° sama dengan transformasi identitas? Jelaskan."},
    ],
  }),
  Qn(19,"Rotasi — Soal Cerita Jam",{type:"mixed",
    content:"Jarum jam panjang pada jam 12.00 menunjuk ke atas (arah positif sumbu-y). Setiap 15 menit, jarum berputar 90° searah jarum jam.",
    parts:[
      {label:"a.",text:"Setelah 15 menit (12.15), ke arah mana jarum menunjuk?"},
      {label:"b.",text:"Setelah 30 menit (12.30), ke arah mana jarum menunjuk?"},
      {label:"c.",text:"Setelah 45 menit (12.45), ke arah mana jarum menunjuk?"},
    ],
  }),
  Qn(20,"Rotasi — Titik Asal dari Bayangan",{type:"mixed",
    content:"Bayangan suatu titik setelah rotasi 180° terhadap titik asal adalah K′(4, −3). Tentukan:",
    parts:[
      {label:"a.",text:"Koordinat titik asal K."},
      {label:"b.",math:"\\text{Bayangan K jika dirotasi 90° CCW terhadap titik asal.}"},
    ],
  }),
  Qn(21,"Rotasi — Segitiga dengan Koordinat Negatif",{type:"mixed",
    content:"Segitiga dengan A(−3, −1), B(−1, −1), C(−2, −4) dirotasi 90° CCW terhadap titik asal.",
    parts:[
      {label:"a.",text:"Tentukan koordinat A′, B′, C′."},
      {label:"b.",text:"Di kuadran mana segitiga bayangan berada?"},
      {label:"c.",text:"Hitung luas segitiga ABC dan A′B′C′."},
    ],
  }),
  Qn(22,"ANBK — Rotasi Berurutan",{type:"mixed",
    content:"Titik P(1, 0) dirotasi berturut-turut empat kali dengan sudut 90° CCW terhadap titik asal.",
    parts:[
      {label:"a.",text:"Tentukan posisi P setelah setiap rotasi (4 bayangan)."},
      {label:"b.",text:"Di mana P berada setelah 4 rotasi?"},
      {label:"c.",text:"Apa bentuk lintasan yang dilalui P?"},
    ],
  }),
  Qn(23,"Rotasi — Diagram Titik-titik",{type:"diagram",
    diagram:(
      <GridSVG>
        <Dot x={4} y={0} color="#fb923c" r={4} label="A(4,0)"/>
        <Dot x={0} y={4} color="#22d3ee" r={4} label="A'(0,4)"/>
        <Dot x={0} y={3} color="#fb923c" r={4} label="B(0,3)"/>
        <Dot x={-3} y={0} color="#22d3ee" r={4} label="B'(-3,0)"/>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <ArcArrow cx={0} cy={0} r={27} startAngle={0} endAngle={90} color="#facc15"/>
      </GridSVG>
    ),
    content:"Diagram menunjukkan rotasi titik A dan B terhadap pusat O.",
    parts:[
      {label:"a.",text:"Berapa derajat sudut rotasi dan arah putarannya?"},
      {label:"b.",text:"Verifikasi koordinat A′ dan B′ dengan rumus rotasi yang sesuai."},
      {label:"c.",math:"\\text{Tentukan bayangan C(3,4) dengan rotasi yang sama.}"},
    ],
  }),
  Qn(24,"Rotasi — Matriks",{type:"mixed",
    content:"Matriks rotasi 90° CCW adalah:",
    math:"R_{90} = \\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}",
    parts:[
      {label:"a.",math:"\\text{Hitung: } R_{90} \\begin{pmatrix}3\\\\-2\\end{pmatrix}"},
      {label:"b.",math:"\\text{Hitung: } R_{90} \\begin{pmatrix}-1\\\\4\\end{pmatrix}"},
      {label:"c.",math:"\\text{Tulis matriks rotasi 180°: } R_{180} = \\begin{pmatrix}?&?\\\\?&?\\end{pmatrix}"},
    ],
  }),
  Qn(25,"Rotasi — Jarak ke Pusat Tetap",{type:"mixed",
    content:"Buktikan bahwa rotasi tidak mengubah jarak titik dari pusat rotasi.",
    parts:[
      {label:"a.",math:"\\text{Titik A(3,4) dirotasi 90° CCW menjadi A'(-4,3). Hitung |OA| dan |OA'|.}"},
      {label:"b.",math:"\\text{Gunakan: } |OA| = \\sqrt{x^2+y^2}"},
      {label:"c.",text:"Apa kesimpulan yang dapat kamu ambil?"},
    ],
  }),
  Qn(26,"Rotasi — Soal Kontekstual Kipas",{type:"mixed",
    content:"Baling-baling kipas angin memiliki tiga bilah yang masing-masing diputar 120° dari bilah sebelumnya. Bilah pertama mengarah ke titik A(3, 0).",
    parts:[
      {label:"a.",text:"Tentukan arah bilah kedua setelah rotasi 120° CCW terhadap pusat."},
      {label:"b.",text:"Tentukan arah bilah ketiga setelah rotasi 240° CCW terhadap pusat."},
      {label:"c.",text:"Setelah rotasi 360°, di mana bilah pertama berada?"},
    ],
  }),
  Qn(27,"Rotasi 90° CW — Segitiga Siku-siku",{type:"mixed",
    content:"Segitiga siku-siku dengan K(0,0), L(3,0), M(0,4) dirotasi 90° CW terhadap titik asal.",
    parts:[
      {label:"a.",text:"Tentukan koordinat K′, L′, M′."},
      {label:"b.",text:"Tentukan sisi-sisi segitiga bayangan dan bandingkan dengan segitiga asal."},
      {label:"c.",text:"Di kuadran mana segitiga bayangan berada?"},
    ],
  }),
  Qn(28,"TKA — Rotasi dan Translasi Gabungan",{type:"mixed",
    content:"Titik A(2, 3) dirotasi 180° terhadap titik asal menghasilkan A′. Kemudian A′ ditranslasikan oleh T = (1, −2) menghasilkan A″.",
    parts:[
      {label:"a.",text:"Tentukan koordinat A′."},
      {label:"b.",text:"Tentukan koordinat A″."},
    ],
  }),
  Qn(29,"Rotasi — Menentukan Pusat Rotasi",{type:"mixed",
    content:"Titik P(2, 1) dipetakan ke P′(−1, 2) oleh suatu rotasi 90° CCW. Tentukan pusat rotasi.",
    parts:[
      {label:"a.",text:"Misal pusat rotasi adalah (a, b). Gunakan rumus rotasi 90° CCW terhadap (a, b)."},
      {label:"b.",text:"Bentuk sistem persamaan dan selesaikan untuk a dan b."},
      {label:"c.",text:"Tentukan pusat rotasi."},
    ],
  }),
  Qn(30,"Rotasi — UN 2020 Style",{type:"mixed",
    content:"Titik A(3, −4) dirotasikan 270° berlawanan jarum jam terhadap titik asal menghasilkan ...",
    parts:[
      {label:"",text:"Pilihan: a. (4, 3)   b. (−4, −3)   c. (4, −3)   d. (−4, 3)"},
      {label:"Jawab:",text:"Gunakan: 270° CCW = 90° CW, yaitu (x,y) → (y, −x)."},
    ],
  }),
  Qn(31,"Rotasi — Diagram Segitiga Berbeda Warna",{type:"diagram",
    diagram:(
      <GridSVG>
        <Poly pts={[[2,0],[5,0],[5,3]]} color="#fb923c" label="△ABC"/>
        <Poly pts={[[0,-2],[0,-5],[3,-5]]} color="#a78bfa" fill="rgba(167,139,250,0.12)" label="△A'B'C'"/>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <ArcArrow cx={0} cy={0} r={18} startAngle={0} endAngle={-90} color="#facc15"/>
      </GridSVG>
    ),
    parts:[
      {label:"a.",text:"Berapa derajat rotasi dan arahnya?"},
      {label:"b.",text:"Tentukan koordinat A, B, C dan A′, B′, C′."},
      {label:"c.",text:"Verifikasi transformasi menggunakan rumus yang sesuai."},
    ],
  }),
  Qn(32,"Rotasi — Sifat Isometri",{type:"mixed",
    content:"Segitiga ABC dengan A(1,0), B(4,0), C(1,3) dirotasi 90° CCW terhadap titik asal.",
    parts:[
      {label:"a.",text:"Tentukan A′, B′, C′."},
      {label:"b.",math:"\\text{Hitung panjang AB dan A'B'. Apakah sama?}"},
      {label:"c.",text:"Apakah rotasi termasuk isometri? Jelaskan."},
    ],
  }),
  Qn(33,"Rotasi — Koordinat dengan Parameter",{type:"mixed",
    content:"Titik P(a, b) dirotasi 90° CCW terhadap titik asal menghasilkan P′(−4, 3).",
    parts:[
      {label:"a.",text:"Tentukan nilai a dan b."},
      {label:"b.",math:"\\text{Jika P kemudian dirotasi 180°, tentukan P''.}"},
    ],
  }),
  Qn(34,"Rotasi — Bangun Simetri Putar",{type:"mixed",
    content:"Persegi memiliki simetri putar. Tentukan sudut rotasi yang menghasilkan bayangan yang tepat sama dengan bangun asalnya.",
    parts:[
      {label:"a.",text:"Tuliskan semua sudut rotasi (kurang dari 360°) yang memenuhi syarat tersebut untuk persegi."},
      {label:"b.",text:"Apakah segitiga sama sisi juga memiliki simetri putar? Jelaskan."},
    ],
  }),
  Qn(35,"Rotasi — Koordinat Pecahan",{type:"mixed",
    content:"Titik A(√3, 1) dirotasi 30° CCW terhadap titik asal.",
    parts:[
      {label:"a.",math:"\\text{Gunakan rumus: } x' = x\\cos\\theta - y\\sin\\theta, \\quad y' = x\\sin\\theta + y\\cos\\theta"},
      {label:"b.",math:"\\cos 30° = \\frac{\\sqrt{3}}{2}, \\quad \\sin 30° = \\frac{1}{2}"},
      {label:"c.",math:"\\text{Hitung koordinat A'.}"},
    ],
  }),
  Qn(36,"Rotasi — ANBK Tipe Analisis",{type:"mixed",
    content:"Seorang siswa mengklaim bahwa rotasi 90° CCW dan rotasi 270° CW menghasilkan bayangan yang sama. Apakah benar?",
    parts:[
      {label:"a.",math:"\\text{Uji dengan titik P(3, 2). Hitung bayangan dengan 90° CCW dan 270° CW.}"},
      {label:"b.",text:"Bandingkan hasil keduanya dan berikan kesimpulan."},
    ],
  }),
  Qn(37,"Rotasi — Titik dan Bayangannya",{type:"diagram",
    diagram:(
      <GridSVG>
        <Dot x={3} y={1} color="#fb923c" r={4} label="P(3,1)"/>
        <Dot x={-1} y={3} color="#22d3ee" r={4} label="P'(-1,3)"/>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <ArcArrow cx={0} cy={0} r={22} startAngle={18} endAngle={108} color="#facc15"/>
        <Dot x={2} y={4} color="#f472b6" r={4} label="Q(2,4)"/>
        <Dot x={-4} y={2} color="#34d399" r={4} label="Q'(-4,2)"/>
        <ArcArrow cx={0} cy={0} r={30} startAngle={63} endAngle={153} color="#facc15"/>
      </GridSVG>
    ),
    content:"Diagram menunjukkan rotasi P→P′ dan Q→Q′ terhadap pusat O.",
    parts:[
      {label:"a.",text:"Tentukan sudut dan arah rotasi berdasarkan koordinat P dan P′."},
      {label:"b.",text:"Verifikasi dengan koordinat Q dan Q′."},
    ],
  }),
  Qn(38,"Rotasi — Aplikasi Roda",{type:"mixed",
    content:"Sebuah titik pada tepi roda sepeda berada di posisi A(0, 30) cm dari pusat roda. Roda berputar 90° CW (searah pergerakan maju).",
    parts:[
      {label:"a.",text:"Tentukan posisi titik A setelah roda berputar 90° CW."},
      {label:"b.",text:"Setelah satu putaran penuh (360°), di mana posisi A?"},
    ],
  }),
  Qn(39,"Rotasi — Semua Sudut Istimewa",{type:"mixed",
    content:"Titik P(4, 0) dirotasi terhadap titik asal. Tentukan bayangannya untuk setiap sudut rotasi CCW berikut:",
    parts:[
      {label:"a.",math:"\\theta = 90°"},
      {label:"b.",math:"\\theta = 180°"},
      {label:"c.",math:"\\theta = 270°"},
      {label:"d.",math:"\\theta = 360°"},
    ],
  }),
  Qn(40,"Rotasi — Soal UN Terapan",{type:"mixed",
    content:"Sebuah baling-baling helikopter berputar searah jarum jam. Ujung baling-baling A berada di koordinat A(0, 5) pada suatu saat. Setelah 0,5 detik, baling-baling berputar 90°.",
    parts:[
      {label:"a.",text:"Tentukan koordinat A setelah 0,5 detik."},
      {label:"b.",text:"Tentukan koordinat A setelah 1 detik (rotasi total 180°)."},
      {label:"c.",text:"Tentukan koordinat A setelah 2 detik (rotasi total 360°)."},
    ],
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
            <span className="text-orange-400 text-xs font-bold">📋 40 Soal</span>
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
