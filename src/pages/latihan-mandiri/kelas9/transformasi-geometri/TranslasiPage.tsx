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
  Qn(3,"Hasil Translasi Titik",{type:"pg",
    content:"Titik K(5, \u22121) ditranslasikan oleh vektor berikut. Koordinat K\u2019 adalah ...",
    math:"T = \\begin{pmatrix}-4\\\\3\\end{pmatrix}",
    opts:["(9, 2)","(1, \u22124)","(9, \u22124)","(1, 2)"],
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
  Qn(13,"Menemukan Vektor Translasi",{type:"pg",
    content:"Titik P(\u22122, 5) dipetakan ke P\u2019(4, 1) oleh sebuah translasi. Vektor translasi yang digunakan adalah ...",
    opts:["(6, \u22124)","(\u22126, 4)","(2, 6)","(6, 4)"],
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
  Qn(15,"Titik Asal dari Bayangan",{type:"pg",
    content:"Bayangan P\u2019(7, \u22123) diperoleh dari translasi T = (\u22124, 6). Koordinat titik asal P adalah ...",
    opts:["(3, 3)","(11, \u22129)","(3, \u22129)","(11, 3)"],
  }),
  Qn(16,"Translasi Segitiga — Diagram",{type:"diagram",
    content:"Perhatikan diagram. \u25b3ABC dipetakan ke \u25b3A\u2019B\u2019C\u2019 oleh translasi T. Titik A(\u22124, 1) \u2192 A\u2019(\u22121, \u22122). Vektor T adalah ...",
    opts:["(3, \u22123)","(\u22123, 3)","(3, 3)","(\u22123, \u22123)"],
    diagram:(
      <GridSVG>
        <Poly pts={[[-4,1],[-2,1],[-3,3]]} color="#34d399" label="\u25b3ABC"/>
        <Poly pts={[[-1,-2],[1,-2],[0,0]]} color="#fb923c" fill="rgba(251,146,60,0.12)" label="\u25b3A'B'C'"/>
        <Arrow x1={-4} y1={1} x2={-1} y2={-2} color="#facc15"/>
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
  Qn(19,"Translasi Titik Negatif",{type:"pg",
    content:"Titik A(5, \u22121) ditranslasikan oleh T = (\u22123, 2). Koordinat bayangan A\u2019 adalah ...",
    opts:["(2, 1)","(8, \u22123)","(2, \u22123)","(8, 1)"],
  }),
  Qn(20,"Soal Cerita Translasi",{type:"pg",
    content:"Robot bergerak dari P(2, 3) sejauh 5 satuan ke kanan dan 3 satuan ke bawah. Posisi akhir robot adalah ...",
    opts:["(7, 6)","(\u22123, 0)","(7, 0)","(\u22123, 6)"],
  }),
  Qn(21,"Translasi Persegi — Diagram",{type:"diagram",
    content:"Persegi P ditranslasikan oleh T = (4, \u22123). Bayangan titik sudut P(\u22125, 2) adalah ...",
    opts:["(\u22129, 5)","(\u22121, \u22121)","(\u22121, 5)","(\u22129, \u22121)"],
    diagram:(
      <GridSVG>
        <Poly pts={[[-5,2],[-3,2],[-3,4],[-5,4]]} color="#a78bfa" label="P"/>
        <Dot x={-5} y={2} color="#a78bfa" r={3} label="(-5,2)"/>
        <Dot x={-3} y={4} color="#a78bfa" r={3} label="(-3,4)"/>
        <Poly pts={[[-1,-1],[1,-1],[1,1],[-1,1]]} color="#f472b6" fill="rgba(244,114,182,0.12)" label="P'"/>
        <Arrow x1={-5} y1={2} x2={-1} y2={-1} color="#facc15"/>
      </GridSVG>
    ),
  }),
  Qn(22,"Translasi dan Invers",{type:"pg",
    content:"Translasi T memetakan titik A(2, \u22123) ke A\u2019(\u22121, 5). Vektor translasi T adalah ...",
    opts:["(\u22123, 8)","(3, \u22128)","(\u22123, \u22128)","(3, 8)"],
  }),
  Qn(23,"ANBK — Translasi Koordinat",{type:"pg",
    content:"Translasi T memetakan R(4, \u22122) ke R\u2019(1, 3). Dengan T yang sama, bayangan S(\u22123, 7) adalah ...",
    opts:["(\u22126, 12)","(0, 2)","(0, 12)","(\u22126, 2)"],
  }),
  Qn(24,"Translasi Empat Penjuru",{type:"pg",
    content:"Titik M ditranslasikan berturut-turut oleh T\u2081 = (2, 0), T\u2082 = (0, \u22123), T\u2083 = (\u22122, 0), T\u2084 = (0, 3). Posisi M setelah keempat translasi adalah ...",
    opts:["Bergeser 2 satuan ke kanan","Bergeser 3 satuan ke atas","Kembali ke posisi semula","Bergeser 8 satuan dari asal"],
  }),
  Qn(25,"Translasi Trapesium",{type:"pg",
    content:"Titik A(1, 0) pada trapesium ABCD ditranslasikan oleh T = (\u22123, 4). Koordinat A\u2019 adalah ...",
    opts:["(\u22122, 4)","(4, \u22124)","(\u22124, 2)","(4, 4)"],
  }),
  Qn(26,"Translasi Titik pada Sumbu",{type:"pg",
    content:"Titik P(0, 5) ditranslasikan oleh T = (4, \u22123). Koordinat bayangan P\u2019 adalah ...",
    opts:["(4, 2)","(4, 8)","(\u22124, 8)","(\u22124, 2)"],
  }),
  Qn(27,"TKA — Koordinat Asal",{type:"pg",
    content:"Bayangan A\u2019(3, 1) diperoleh setelah translasi T = (2, \u22125). Koordinat titik asal A adalah ...",
    opts:["(5, \u22124)","(1, 6)","(1, \u22124)","(5, 6)"],
  }),
  Qn(28,"Translasi Lingkaran",{type:"pg",
    content:"Lingkaran berpusat P(2, 3) ditranslasikan oleh T = (\u22125, 2). Pusat lingkaran bayangan adalah ...",
    opts:["(7, 1)","(\u22123, 5)","(\u22127, 5)","(3, 1)"],
  }),
  Qn(29,"Pergeseran pada Denah",{type:"pg",
    content:"Kamar tidur di titik A(5, 8) dipindahkan 3 satuan ke kiri dan 2 satuan ke atas. Koordinat baru kamar tidur adalah ...",
    opts:["(8, 6)","(2, 10)","(8, 10)","(2, 6)"],
  }),
  Qn(30,"Segitiga Siku-siku",{type:"pg",
    content:"Segitiga siku-siku dengan K(0, 0), L(4, 0), M(0, 3) ditranslasikan oleh T = (2, 1). Koordinat bayangan K\u2019 adalah ...",
    opts:["(2, \u22121)","(\u22122, 1)","(\u22122, \u22121)","(2, 1)"],
  }),
  Qn(31,"UN — Translasi Sederhana",{type:"pg",
    content:"Titik P(\u22123, 4) ditranslasikan oleh T = (5, \u22126). Bayangan P adalah ...",
    opts:["(2, \u22122)","(\u22128, 10)","(2, \u221210)","(\u22122, 10)"],
  }),
  Qn(32,"Translasi dengan Huruf",{type:"pg",
    content:"Titik A(a, b) ditranslasikan oleh T = (\u22121, 4) menghasilkan A\u2019(2, \u22123). Nilai a adalah ...",
    opts:["1","3","\u22123","\u22121"],
  }),
  Qn(33,"Translasi Berlawanan",{type:"pg",
    content:"Titik A(5, 1) ditranslasikan oleh T\u2081 = (3, \u22122), lalu oleh T\u2082 = (\u22123, 2). Posisi akhir A adalah ...",
    opts:["(8, \u22121)","(2, 3)","(5, 1)","(11, \u22123)"],
  }),
  Qn(34,"Translasi — Diagram Titik",{type:"diagram",
    content:"Diagram menunjukkan A(\u22123, 2) \u2192 A\u2019(1, \u22121) oleh translasi T. Koordinat B\u2019 jika B(2, 3) ditranslasikan oleh T yang sama adalah ...",
    opts:["(6, 0)","(\u22122, 7)","(6, 7)","(\u22122, 0)"],
    diagram:(
      <GridSVG>
        <Dot x={-3} y={2} color="#22d3ee" r={4} label="A(-3,2)"/>
        <Dot x={1} y={-1} color="#f472b6" r={4} label="A'(1,-1)"/>
        <Arrow x1={-3} y1={2} x2={1} y2={-1} color="#facc15"/>
        <Dot x={2} y={3} color="#34d399" r={4} label="B(2,3)"/>
      </GridSVG>
    ),
  }),
  Qn(35,"Translasi Parabola",{type:"pg",
    content:"Parabola y = x\u00b2 ditranslasikan oleh T = (2, \u22123). Persamaan bayangan parabola adalah ...",
    opts:["y = x\u00b2 \u2212 4x + 7","y = x\u00b2 \u2212 4x + 1","y = x\u00b2 + 4x + 7","y = x\u00b2 + 4x + 1"],
  }),
  Qn(36,"Translasi Jarak Tempuh",{type:"pg",
    content:"Kapal dari A(10, 5) bergerak 8 km ke timur dan 6 km ke selatan. Koordinat pelabuhan B adalah ...",
    opts:["(18, 11)","(2, \u22121)","(18, \u22121)","(2, 11)"],
  }),
  Qn(37,"Translasi Garis Horizontal",{type:"pg",
    content:"Garis y = 3 ditranslasikan oleh T = (4, \u22125). Persamaan bayangan garis adalah ...",
    opts:["y = 8","y = \u22122","y = 7","y = 3"],
  }),
  Qn(38,"ANBK — Translasi Majemuk",{type:"pg",
    content:"Titik K(1, \u22122) ditranslasikan berturut-turut oleh T\u2081 = (2, 3), T\u2082 = (\u22121, 2), T\u2083 = (3, \u22124). Posisi akhir K adalah ...",
    opts:["(5, \u22121)","(1, 2)","(3, 2)","(5, 1)"],
  }),
  Qn(39,"UN 2019 — Translasi Segitiga",{type:"pg",
    content:"Segitiga dengan A(2, 1), B(5, 1), C(4, 4) ditranslasikan oleh T = (\u22123, \u22122). Koordinat A\u2019 adalah ...",
    opts:["(5, 3)","(\u22121, \u22121)","(\u22121, 3)","(5, \u22121)"],
  }),
  Qn(40,"Titik pada Kuadran IV",{type:"pg",
    content:"Titik P(3, \u22122) ditranslasikan oleh T = (\u22124, 7). Bayangan P\u2019 berada di kuadran ...",
    opts:["Kuadran I","Kuadran II","Kuadran III","Kuadran IV"],
  }),
  Qn(41,"Translasi Pecahan",{type:"pg",
    content:"Titik A(\u00bd, \u2212\u00be) ditranslasikan oleh T = (3/2, 5/4). Koordinat A\u2019 adalah ...",
    opts:["(2, \u00bd)","(1, \u22122)","(2, \u22122)","(1, \u00bd)"],
  }),
  Qn(42,"Sifat Translasi",{type:"pg",
    content:"Titik A(x, y) ditranslasikan oleh T = (a, b) ke A\u2019. Pernyataan yang BENAR adalah ...",
    opts:["Translasi mengubah ukuran bangun","Translasi mengubah orientasi bangun","Jarak |AA\u2019| = \u221a(a\u00b2 + b\u00b2) konstan untuk semua titik","Bayangan tidak kongruen dengan bangun asal"],
  }),
  Qn(43,"Translasi dengan Parameter",{type:"pg",
    content:"Titik P(m, 2m) ditranslasikan oleh T = (3, \u2212m) menghasilkan P\u2019(7, 4). Koordinat titik P adalah ...",
    opts:["(3, 8)","(4, 8)","(4, 4)","(3, 4)"],
  }),
  Qn(44,"Aplikasi — Kuda Catur",{type:"pg",
    content:"Kuda catur di C(3, 2) melakukan 3 gerakan identik dengan T = (2, 1). Posisi akhir kuda adalah ...",
    opts:["(6, 3)","(9, 5)","(5, 4)","(7, 3)"],
  }),
  Qn(45,"Translasi Jajargenjang",{type:"pg",
    content:"Jajargenjang PQRS dengan Q(2, 1) ditranslasikan oleh T = (4, \u22123). Koordinat Q\u2019 adalah ...",
    opts:["(6, \u22122)","(7, 1)","(\u22122, \u22122)","(6, 1)"],
  }),
  Qn(46,"TKA — Translasi Terbalik",{type:"pg",
    content:"Translasi T memetakan A(1, 3) \u2192 A\u2019(4, 1). Titik C yang dipetakan ke C\u2019(0, 0) oleh T yang sama adalah ...",
    opts:["(3, \u22122)","(\u22123, 2)","(3, 2)","(\u22123, \u22122)"],
  }),
  Qn(47,"Translasi Berkebalikan",{type:"pg",
    content:"Titik A(3, 2) ditranslasikan oleh T\u2081 = (4, \u22121). Koordinat A\u2019 adalah ...",
    opts:["(\u22121, 3)","(7, 3)","(7, 1)","(\u22121, 1)"],
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
  Qn(49,"Translasi Gabungan",{type:"pg",
    content:"Titik X(2, 3) ditranslasikan berturut-turut oleh T\u2081 = (1, \u22122) lalu T\u2082 = (\u22123, 4). Koordinat akhir X\u2033 adalah ...",
    opts:["(0, 5)","(6, 5)","(0, \u22123)","(6, 1)"],
  }),
  Qn(50,"ANBK — Pelari Persegi",{type:"pg",
    content:"Pelari mulai dari A(0, 0) menyelesaikan 3 putaran penuh lintasan persegi (kanan 10 m, atas 10 m, kiri 10 m, bawah 10 m). Posisi akhir pelari adalah ...",
    opts:["(30, 0)","(0, 30)","(10, 10)","(0, 0)"],
  }),
  Qn(51,"UN — Translasi Terapan",{type:"pg",
    content:"Kapal dari O(0, 0) berlayar ke posisi (40, 30) km, lalu bergeser (\u221220, 50) km. Jarak kapal dari O setelah kedua perjalanan adalah ...",
    opts:["20\u221a17 km","40\u221a5 km","50 km","80 km"],
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
            <span className="text-cyan-400 text-xs font-bold">📋 51 Soal</span>
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
