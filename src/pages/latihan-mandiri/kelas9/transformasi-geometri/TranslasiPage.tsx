import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { MoveRight } from "lucide-react";

const accent = "cyan";

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

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed" | "diagram";
};
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1,"Translasi Titik Dasar",{type:"mixed",
    content:"Titik A(3, 4) ditranslasikan oleh vektor translasi berikut:",
    parts:[
      {label:"a.",math:"T = \\begin{pmatrix}2\\\\-3\\end{pmatrix}"},
      {label:"",text:"Tentukan koordinat bayangan titik A."},
      {label:"b.",text:"Jika A' adalah bayangan A, tentukan jarak AA'."},
    ],
  }),
  Qn(2,"Menemukan Vektor Translasi",{type:"mixed",
    content:"Titik P(−2, 5) dipetakan ke P′(4, 1) oleh sebuah translasi.",
    parts:[
      {label:"a.",text:"Tentukan vektor translasi yang digunakan."},
      {label:"b.",math:"\\text{Jika titik Q(3, −2) ditranslasi oleh vektor yang sama, tentukan Q'.}"},
    ],
  }),
  Qn(3,"Translasi Titik — Diagram",{type:"diagram",
    diagram:(
      <GridSVG>
        <Poly pts={[[1,1],[3,1],[3,3],[1,3]]} color="#22d3ee" label="A"/>
        <Poly pts={[[3,3],[5,3],[5,5],[3,5]]} color="#f472b6" fill="rgba(244,114,182,0.12)" label="A'"/>
        <Arrow x1={1} y1={1} x2={3} y2={3} color="#facc15"/>
        <Dot x={1} y={1} color="#22d3ee" label="(1,1)"/>
        <Dot x={3} y={3} color="#f472b6" label="(3,3)"/>
      </GridSVG>
    ),
    parts:[
      {label:"a.",text:"Tentukan vektor translasi yang memetakan bangun A ke A'."},
      {label:"b.",text:"Tentukan koordinat semua sudut bayangan A'."},
      {label:"c.",text:"Apakah bangun A dan A' kongruen? Jelaskan."},
    ],
  }),
  Qn(4,"Titik Asal dari Bayangan",{type:"mixed",
    content:"Bayangan sebuah titik setelah translasi adalah P′(7, −3). Vektor translasi yang digunakan adalah:",
    math:"T = \\begin{pmatrix}-4\\\\6\\end{pmatrix}",
    parts:[
      {label:"a.",text:"Tentukan koordinat titik asal P."},
      {label:"b.",text:"Tentukan jarak dari P ke P′."},
    ],
  }),
  Qn(5,"Translasi Segitiga — Diagram",{type:"diagram",
    diagram:(
      <GridSVG>
        <Poly pts={[[-4,1],[-2,1],[-3,3]]} color="#34d399" label="△ABC"/>
        <Poly pts={[[-1,-2],[1,-2],[0,0]]} color="#fb923c" fill="rgba(251,146,60,0.12)" label="△A'B'C'"/>
        <Arrow x1={-4} y1={1} x2={-1} y2={-2} color="#facc15"/>
      </GridSVG>
    ),
    parts:[
      {label:"a.",text:"Tentukan vektor translasi yang memindahkan △ABC ke △A'B'C'."},
      {label:"b.",text:"Tuliskan koordinat A, B, C jika diketahui koordinat A'(−1,−2), B'(1,−2), C'(0,0)."},
      {label:"c.",text:"Apakah luas △ABC sama dengan luas △A'B'C'? Hitunglah."},
    ],
  }),
  Qn(6,"Translasi Berturut-turut",{type:"mixed",
    content:"Titik Q(1, 2) ditranslasikan berturut-turut oleh dua vektor:",
    parts:[
      {label:"",math:"T_1 = \\begin{pmatrix}3\\\\-1\\end{pmatrix} \\text{ kemudian } T_2 = \\begin{pmatrix}-2\\\\4\\end{pmatrix}"},
      {label:"a.",text:"Tentukan bayangan titik Q setelah translasi T₁."},
      {label:"b.",text:"Tentukan bayangan titik Q setelah translasi T₂."},
      {label:"c.",math:"\\text{Tunjukkan bahwa hasilnya sama dengan translasi } T_1 + T_2."},
    ],
  }),
  Qn(7,"Translasi Garis — UN Style",{type:"mixed",
    content:"Garis y = 2x + 1 ditranslasikan oleh vektor T = (3, −2).",
    parts:[
      {label:"a.",text:"Tentukan persamaan bayangan garis tersebut."},
      {label:"b.",text:"Apakah gradien garis berubah setelah translasi? Jelaskan."},
    ],
  }),
  Qn(8,"Translasi Titik Negatif",{type:"mixed",
    content:"Titik-titik berikut ditranslasikan oleh T = (−3, 2):",
    parts:[
      {label:"a.",math:"A(5, -1) \\to A'"},
      {label:"b.",math:"B(-2, -4) \\to B'"},
      {label:"c.",math:"C(0, 6) \\to C'"},
    ],
  }),
  Qn(9,"Soal Cerita Translasi",{type:"mixed",
    content:"Sebuah robot bergerak dari titik P(2, 3) ke titik Q. Diketahui robot bergerak 5 satuan ke kanan dan 3 satuan ke bawah.",
    parts:[
      {label:"a.",text:"Nyatakan pergerakan robot sebagai vektor translasi."},
      {label:"b.",text:"Tentukan koordinat titik Q."},
      {label:"c.",text:"Jika dari Q robot bergerak 2 satuan ke kiri dan 4 satuan ke atas, tentukan posisi akhirnya."},
    ],
  }),
  Qn(10,"Translasi Persegi — Diagram",{type:"diagram",
    diagram:(
      <GridSVG>
        <Poly pts={[[-5,2],[-3,2],[-3,4],[-5,4]]} color="#a78bfa" label="P"/>
        <Dot x={-5} y={2} color="#a78bfa" r={3} label="(-5,2)"/>
        <Dot x={-3} y={4} color="#a78bfa" r={3} label="(-3,4)"/>
        <Poly pts={[[-1,-1],[1,-1],[1,1],[-1,1]]} color="#f472b6" fill="rgba(244,114,182,0.12)" label="P'"/>
        <Arrow x1={-5} y1={2} x2={-1} y2={-1} color="#facc15"/>
      </GridSVG>
    ),
    parts:[
      {label:"a.",text:"Tentukan vektor translasi dari P ke P'."},
      {label:"b.",text:"Tentukan koordinat semua sudut persegi P'."},
      {label:"c.",text:"Hitung keliling dan luas persegi P dan P'. Bandingkan."},
    ],
  }),
  Qn(11,"Translasi dan Invers",{type:"mixed",
    content:"Diketahui translasi T memetakan A(2, −3) ke A′(−1, 5).",
    parts:[
      {label:"a.",text:"Tentukan vektor T."},
      {label:"b.",text:"Tentukan invers translasi T⁻¹."},
      {label:"c.",math:"\\text{Gunakan T}^{-1}\\text{ untuk mengembalikan A' ke posisi semula.}"},
    ],
  }),
  Qn(12,"ANBK — Translasi Koordinat",{type:"mixed",
    content:"Titik R(a, b) ditranslasikan oleh T = (p, q) menghasilkan R′(a+p, b+q). Diketahui R(4, −2) dan R′(1, 3).",
    parts:[
      {label:"a.",text:"Tentukan nilai p dan q."},
      {label:"b.",math:"\\text{Jika titik S}(-3, 7)\\text{ ditranslasikan oleh T yang sama, tentukan S'.}"},
    ],
  }),
  Qn(13,"Translasi Empat Penjuru",{type:"mixed",
    content:"Sebuah titik M ditranslasikan empat kali masing-masing oleh:",
    parts:[
      {label:"",math:"T_1=\\binom{2}{0},\\; T_2=\\binom{0}{-3},\\; T_3=\\binom{-2}{0},\\; T_4=\\binom{0}{3}"},
      {label:"a.",text:"Hitung posisi titik M setelah keempat translasi."},
      {label:"b.",text:"Di manakah titik M kembali? Apa yang dapat disimpulkan?"},
    ],
  }),
  Qn(14,"Translasi Trapesium",{type:"mixed",
    content:"Trapesium ABCD dengan A(1,0), B(4,0), C(3,2), D(2,2) ditranslasikan oleh T=(−3, 4).",
    parts:[
      {label:"a.",text:"Tentukan koordinat bayangan A′, B′, C′, D′."},
      {label:"b.",text:"Gambarkan sketsa trapesium ABCD dan bayangannya A′B′C′D′."},
      {label:"c.",text:"Apakah trapesium ABCD dan A′B′C′D′ kongruen?"},
    ],
  }),
  Qn(15,"Translasi Titik pada Sumbu",{type:"mixed",
    content:"Titik-titik berikut berada pada sumbu koordinat. Tentukan bayangannya setelah ditranslasikan oleh T = (4, −3):",
    parts:[
      {label:"a.",math:"P(0, 5) \\to P'"},
      {label:"b.",math:"Q(-3, 0) \\to Q'"},
      {label:"c.",math:"O(0, 0) \\to O'"},
    ],
  }),
  Qn(16,"TKA — Mencari Koordinat Asal",{type:"mixed",
    content:"Bayangan titik-titik berikut setelah translasi T = (2, −5) adalah:",
    parts:[
      {label:"a.",math:"A'(3, 1) \\to A = ?"},
      {label:"b.",math:"B'(-1, -3) \\to B = ?"},
      {label:"c.",math:"C'(0, 0) \\to C = ?"},
    ],
  }),
  Qn(17,"Translasi Lingkaran",{type:"mixed",
    content:"Lingkaran dengan pusat P(2, 3) dan jari-jari 4 satuan ditranslasikan oleh T = (−5, 2).",
    parts:[
      {label:"a.",text:"Tentukan pusat lingkaran bayangan."},
      {label:"b.",text:"Apakah jari-jari lingkaran berubah setelah translasi?"},
      {label:"c.",math:"\\text{Tulis persamaan lingkaran bayangan dalam bentuk } (x-a)^2+(y-b)^2=r^2."},
    ],
  }),
  Qn(18,"Pergeseran pada Denah",{type:"mixed",
    content:"Pada denah rumah, kamar tidur terletak di titik A(5, 8). Diputuskan untuk memindahkan posisinya 3 satuan ke barat (kiri) dan 2 satuan ke utara (atas).",
    parts:[
      {label:"a.",text:"Tentukan koordinat baru kamar tidur."},
      {label:"b.",text:"Nyatakan pergeseran tersebut sebagai vektor translasi."},
    ],
  }),
  Qn(19,"Translasi Segitiga Siku-siku",{type:"mixed",
    content:"Segitiga siku-siku dengan titik-titik K(0,0), L(4,0), M(0,3) ditranslasikan oleh T = (2, 1).",
    parts:[
      {label:"a.",text:"Tentukan koordinat bayangan K′, L′, M′."},
      {label:"b.",text:"Hitung panjang sisi-sisi bayangan dan bandingkan dengan segitiga asal."},
      {label:"c.",math:"\\text{Hitung luas } \\triangle KLM \\text{ dan } \\triangle K'L'M'."},
    ],
  }),
  Qn(20,"UN — Translasi Sederhana",{type:"mixed",
    content:"Titik P(−3, 4) ditranslasikan oleh vektor T = (5, −6). Bayangan P adalah ...",
    parts:[
      {label:"",text:"Pilihan: a. (2, −2)   b. (−8, 10)   c. (2, −10)   d. (−2, 10)"},
      {label:"Jawab:",text:"Tentukan dan jelaskan langkah penyelesaiannya."},
    ],
  }),
  Qn(21,"Translasi dengan Huruf",{type:"mixed",
    content:"Titik A(a, b) ditranslasikan oleh T = (p, q) menghasilkan A′(2, −3). Diketahui p = −1 dan q = 4.",
    parts:[
      {label:"a.",text:"Tentukan nilai a dan b (koordinat titik A semula)."},
      {label:"b.",math:"\\text{Jika kemudian A' ditranslasi lagi oleh T' = } \\binom{3}{-1}, \\text{ tentukan A''.}"},
    ],
  }),
  Qn(22,"Translasi Berlawanan",{type:"mixed",
    content:"Diketahui translasi T₁ = (3, −2) dan T₂ adalah translasi berlawanan dari T₁.",
    parts:[
      {label:"a.",text:"Nyatakan T₂ sebagai vektor."},
      {label:"b.",math:"\\text{Jika titik A(5, 1) ditranslasi oleh T}_1 \\text{ lalu T}_2, \\text{ tentukan posisi akhirnya.}"},
      {label:"c.",text:"Apa nama untuk pasangan translasi seperti T₁ dan T₂?"},
    ],
  }),
  Qn(23,"Translasi — Diagram Titik",{type:"diagram",
    diagram:(
      <GridSVG>
        <Dot x={-3} y={2} color="#22d3ee" r={4} label="A(-3,2)"/>
        <Dot x={1} y={-1} color="#f472b6" r={4} label="A'(1,-1)"/>
        <Arrow x1={-3} y1={2} x2={1} y2={-1} color="#facc15"/>
        <Dot x={2} y={3} color="#34d399" r={4} label="B(2,3)"/>
        <Dot x={6} y={0} color="#fb923c" r={4} label="B'(?,?)"/>
        <Arrow x1={2} y1={3} x2={5.5} y2={0.5} color="#facc15"/>
      </GridSVG>
    ),
    content:"Diagram menunjukkan A dipetakan ke A′ oleh suatu translasi.",
    parts:[
      {label:"a.",text:"Tentukan vektor translasi dari diagram."},
      {label:"b.",text:"Tentukan koordinat B′ jika B(2, 3) ditranslasikan oleh vektor yang sama."},
    ],
  }),
  Qn(24,"Translasi Persamaan Parabola",{type:"mixed",
    content:"Parabola y = x² ditranslasikan oleh T = (2, −3).",
    parts:[
      {label:"a.",text:"Tentukan persamaan parabola bayangan."},
      {label:"b.",text:"Tentukan titik puncak parabola bayangan."},
      {label:"c.",math:"\\text{Nyatakan persamaan dalam bentuk } y = (x-h)^2 + k."},
    ],
  }),
  Qn(25,"Translasi Jarak Tempuh",{type:"mixed",
    content:"Sebuah kapal berlayar dari pelabuhan A(10, 5) ke pelabuhan B. Kapal menempuh perjalanan 8 km ke timur dan 6 km ke selatan.",
    parts:[
      {label:"a.",text:"Nyatakan pergerakan sebagai vektor translasi."},
      {label:"b.",text:"Tentukan koordinat pelabuhan B."},
      {label:"c.",text:"Hitung jarak langsung dari A ke B menggunakan teorema Pythagoras."},
    ],
  }),
  Qn(26,"Translasi Garis Horizontal",{type:"mixed",
    content:"Garis y = 3 ditranslasikan oleh T = (4, −5).",
    parts:[
      {label:"a.",text:"Tentukan persamaan bayangan garis tersebut."},
      {label:"b.",text:"Garis y = 3 sejajar sumbu apa? Apakah sifat ini berubah setelah translasi?"},
    ],
  }),
  Qn(27,"ANBK — Translasi Majemuk",{type:"mixed",
    content:"Titik K(1, −2) ditranslasikan tiga kali berturut-turut:",
    parts:[
      {label:"",math:"T_1=\\binom{2}{3},\\quad T_2=\\binom{-1}{2},\\quad T_3=\\binom{3}{-4}"},
      {label:"a.",text:"Tentukan posisi akhir titik K."},
      {label:"b.",text:"Tentukan vektor translasi tunggal yang menghasilkan hasil yang sama."},
    ],
  }),
  Qn(28,"Translasi — UN 2019 Style",{type:"mixed",
    content:"Diketahui segitiga dengan titik-titik A(2, 1), B(5, 1), C(4, 4). Segitiga tersebut ditranslasikan oleh T = (−3, −2).",
    parts:[
      {label:"a.",text:"Tentukan koordinat A′, B′, C′."},
      {label:"b.",text:"Tentukan panjang sisi A′B′."},
      {label:"c.",text:"Apakah segitiga ABC dan A′B′C′ kongruen? Berikan alasan."},
    ],
  }),
  Qn(29,"Translasi Titik pada Kuadran IV",{type:"mixed",
    content:"Titik-titik berikut berada di kuadran IV. Setelah ditranslasikan oleh T = (−4, 7), tentukan kuadran bayangan masing-masing titik:",
    parts:[
      {label:"a.",math:"P(3, -2)"},
      {label:"b.",math:"Q(5, -1)"},
      {label:"c.",math:"R(1, -6)"},
    ],
  }),
  Qn(30,"Translasi Koordinat Pecahan",{type:"mixed",
    content:"Titik A(½, −¾) ditranslasikan oleh T = (3/2, 5/4).",
    parts:[
      {label:"a.",text:"Tentukan koordinat bayangan A′."},
      {label:"b.",math:"\\text{Sederhanakan koordinat A' dalam bentuk pecahan biasa.}"},
    ],
  }),
  Qn(31,"Translasi — Pembuktian Kongruensi",{type:"mixed",
    content:"Buktikan bahwa translasi selalu menghasilkan bayangan yang kongruen dengan bangun asal.",
    parts:[
      {label:"a.",text:"Misalkan titik A(x, y) ditranslasikan oleh T = (a, b) menghasilkan A′(x+a, y+b)."},
      {label:"b.",math:"\\text{Tunjukkan bahwa jarak } |AA'| = \\sqrt{a^2 + b^2} \\text{ konstan untuk semua titik.}"},
      {label:"c.",text:"Simpulkan mengapa translasi disebut isometri (pergeseran yang mempertahankan jarak)."},
    ],
  }),
  Qn(32,"Translasi dengan Parameter",{type:"mixed",
    content:"Titik P(m, 2m) ditranslasikan oleh T = (3, −m) menghasilkan P′(7, 4).",
    parts:[
      {label:"a.",text:"Bentuk sistem persamaan dari informasi ini."},
      {label:"b.",text:"Tentukan nilai m."},
      {label:"c.",text:"Tentukan koordinat titik P."},
    ],
  }),
  Qn(33,"Aplikasi Translasi — Permainan Catur",{type:"mixed",
    content:"Pada papan catur, kuda berada di posisi C(3, 2). Kuda bergerak 2 kotak ke kanan dan 1 kotak ke atas (gerakan L).",
    parts:[
      {label:"a.",text:"Nyatakan gerakan kuda sebagai vektor translasi."},
      {label:"b.",text:"Tentukan posisi kuda setelah satu gerakan."},
      {label:"c.",text:"Jika kuda melakukan 3 gerakan identik, tentukan posisi akhirnya."},
    ],
  }),
  Qn(34,"Translasi Segi Empat — Koordinat Lengkap",{type:"mixed",
    content:"Jajargenjang PQRS dengan P(−2, 1), Q(2, 1), R(3, 4), S(−1, 4) ditranslasikan oleh T = (4, −3).",
    parts:[
      {label:"a.",text:"Tentukan koordinat bayangan P′Q′R′S′."},
      {label:"b.",text:"Apakah bayangan jajargenjang tersebut tetap berbentuk jajargenjang?"},
      {label:"c.",text:"Hitung panjang diagonal PR dan P′R′."},
    ],
  }),
  Qn(35,"Translasi — TKA 2022 Style",{type:"mixed",
    content:"Diketahui translasi T memetakan titik-titik seperti berikut:",
    parts:[
      {label:"",math:"A(1,3) \\to A'(4,1) \\qquad B(-2,5) \\to B'(1,3)"},
      {label:"a.",text:"Apakah kedua pemetaan menggunakan vektor translasi yang sama? Periksa!"},
      {label:"b.",math:"\\text{Jika C}(x, y)\\text{ ditranslasi oleh T yang sama menghasilkan C'(0, 0), tentukan C.}"},
    ],
  }),
  Qn(36,"Translasi Berkebalikan Arah",{type:"mixed",
    content:"Dua titik A dan B masing-masing ditranslasikan oleh vektor yang saling berlawanan arah:",
    parts:[
      {label:"",math:"A(3,2) \\text{ oleh } T_1=\\binom{4}{-1}, \\quad B(−1,5) \\text{ oleh } T_2=\\binom{-4}{1}"},
      {label:"a.",text:"Tentukan A′ dan B′."},
      {label:"b.",math:"\\text{Tunjukkan bahwa vektor } \\overrightarrow{A'B'} = \\overrightarrow{AB}."},
    ],
  }),
  Qn(37,"Translasi Segitiga — Luas Tetap",{type:"diagram",
    diagram:(
      <GridSVG>
        <Poly pts={[[0,0],[4,0],[2,3]]} color="#22d3ee" label="△PQR"/>
        <Poly pts={[[-3,-2],[1,-2],[-1,1]]} color="#f472b6" fill="rgba(244,114,182,0.12)" label="△P'Q'R'"/>
        <Arrow x1={0} y1={0} x2={-3} y2={-2} color="#facc15"/>
        <Dot x={0} y={0} color="#22d3ee" r={3} label="P(0,0)"/>
        <Dot x={4} y={0} color="#22d3ee" r={3} label="Q(4,0)"/>
        <Dot x={2} y={3} color="#22d3ee" r={3} label="R(2,3)"/>
      </GridSVG>
    ),
    parts:[
      {label:"a.",text:"Tentukan vektor translasi dari △PQR ke △P′Q′R′."},
      {label:"b.",text:"Hitung luas △PQR."},
      {label:"c.",text:"Tanpa menghitung, tentukan luas △P′Q′R′. Jelaskan alasanmu."},
    ],
  }),
  Qn(38,"Translasi Gabungan",{type:"mixed",
    content:"Titik X(a, b) ditranslasikan berturut-turut oleh:",
    parts:[
      {label:"",math:"T_1 = \\binom{p}{q} \\text{ menghasilkan X'}, \\quad \\text{lalu } T_2 = \\binom{r}{s} \\text{ menghasilkan X''}"},
      {label:"a.",math:"\\text{Tunjukkan bahwa X'' = } (a+p+r,\\; b+q+s)."},
      {label:"b.",math:"\\text{Jika X(2,3), T}_1=\\binom{1}{-2},\\text{ T}_2=\\binom{-3}{4},\\text{ tentukan X''.}"},
    ],
  }),
  Qn(39,"Translasi — ANBK Tipe Analisis",{type:"mixed",
    content:"Seorang pelari berlari dalam lintasan berbentuk persegi. Ia mulai dari A(0,0) dan setiap putaran memindahkannya sejauh 10 m ke kanan lalu 10 m ke atas, 10 m ke kiri, dan kembali ke bawah.",
    parts:[
      {label:"a.",text:"Nyatakan setiap segmen sebagai vektor translasi."},
      {label:"b.",text:"Tentukan posisi pelari setelah menyelesaikan satu putaran penuh."},
      {label:"c.",text:"Setelah 3 putaran penuh, di mana posisi pelari?"},
    ],
  }),
  Qn(40,"Translasi — Soal UN Terapan",{type:"mixed",
    content:"Kapal nelayan berlayar dari dermaga O(0,0). Hari pertama berlayar ke T₁ = (40, 30) km. Hari kedua berlayar dari posisi tersebut dengan perpindahan (−20, 50) km.",
    parts:[
      {label:"a.",text:"Tentukan posisi kapal setelah hari pertama."},
      {label:"b.",text:"Tentukan posisi kapal setelah hari kedua."},
      {label:"c.",text:"Hitung jarak kapal dari dermaga O setelah hari kedua."},
    ],
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
            <span className="text-cyan-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
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
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                    <span className="text-cyan-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.math && <div className="mb-3 overflow-x-auto"><BlockMath>{q.math}</BlockMath></div>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-cyan-400 text-xs font-bold shrink-0 mt-0.5">{p.label}</span>}
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
