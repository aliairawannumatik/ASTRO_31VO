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
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay"|"mixed"|"diagram" };
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1,"Refleksi terhadap Sumbu-x",{type:"mixed",
    content:"Tentukan bayangan titik-titik berikut setelah direfleksikan terhadap sumbu-x:",
    parts:[
      {label:"a.",math:"A(3, 5) \\to A'"},
      {label:"b.",math:"B(-2, -4) \\to B'"},
      {label:"c.",math:"C(0, 6) \\to C'"},
    ],
  }),
  Qn(2,"Refleksi terhadap Sumbu-y",{type:"mixed",
    content:"Tentukan bayangan titik-titik berikut setelah direfleksikan terhadap sumbu-y:",
    parts:[
      {label:"a.",math:"P(4, -3) \\to P'"},
      {label:"b.",math:"Q(-1, 7) \\to Q'"},
      {label:"c.",math:"R(5, 0) \\to R'"},
    ],
  }),
  Qn(3,"Refleksi terhadap y = x — Diagram",{type:"diagram",
    diagram:(
      <GridSVG>
        <DiagLine slope={-1} color="#facc15"/>
        <Dot x={2} y={5} color="#34d399" r={4} label="A(2,5)"/>
        <Dot x={5} y={2} color="#f472b6" r={4} label="A'(5,2)"/>
        <DashLine x1={2} y1={5} x2={5} y2={2} color="#94a3b8"/>
        <Dot x={-3} y={1} color="#34d399" r={4} label="B(-3,1)"/>
        <Dot x={1} y={-3} color="#f472b6" r={4} label="B'(1,-3)"/>
        <DashLine x1={-3} y1={1} x2={1} y2={-3} color="#94a3b8"/>
      </GridSVG>
    ),
    content:"Garis kuning adalah cermin y = x. A dan B adalah titik asal, A′ dan B′ adalah bayangannya.",
    parts:[
      {label:"a.",text:"Verifikasi koordinat A′ dan B′ dari diagram menggunakan rumus refleksi y = x."},
      {label:"b.",math:"\\text{Tentukan bayangan titik C(0, 4) terhadap garis } y = x."},
      {label:"c.",text:"Apa pola yang berlaku saat refleksi terhadap y = x?"},
    ],
  }),
  Qn(4,"Refleksi terhadap y = −x",{type:"mixed",
    content:"Tentukan bayangan titik-titik berikut setelah direfleksikan terhadap garis y = −x:",
    parts:[
      {label:"a.",math:"A(3, 2) \\to A'"},
      {label:"b.",math:"B(-4, 1) \\to B'"},
      {label:"c.",math:"C(5, -3) \\to C'"},
    ],
  }),
  Qn(5,"Menemukan Sumbu Pencerminan",{type:"mixed",
    content:"Titik P(2, 3) dicerminkan menghasilkan P′. Tentukan sumbu/garis pencerminan yang digunakan:",
    parts:[
      {label:"a.",math:"P(2,3) \\to P'(-2,3)"},
      {label:"b.",math:"P(2,3) \\to P'(2,-3)"},
      {label:"c.",math:"P(2,3) \\to P'(3,2)"},
    ],
  }),
  Qn(6,"Refleksi Segitiga terhadap Sumbu-x — Diagram",{type:"diagram",
    diagram:(
      <GridSVG>
        <MirrorLine x={0} vertical={false} color="#facc15"/>
        <Poly pts={[[-3,2],[1,2],[-1,5]]} color="#34d399" label="△ABC"/>
        <Poly pts={[[-3,-2],[1,-2],[-1,-5]]} color="#f472b6" fill="rgba(244,114,182,0.12)" label="△A'B'C'"/>
        <DashLine x1={-3} y1={2} x2={-3} y2={-2} color="#94a3b8"/>
        <DashLine x1={1} y1={2} x2={1} y2={-2} color="#94a3b8"/>
        <DashLine x1={-1} y1={5} x2={-1} y2={-5} color="#94a3b8"/>
      </GridSVG>
    ),
    parts:[
      {label:"a.",text:"Tentukan koordinat A, B, C dari diagram."},
      {label:"b.",text:"Tentukan koordinat A′, B′, C′ dari diagram."},
      {label:"c.",text:"Apakah △ABC ≅ △A′B′C′? Jelaskan dengan membandingkan panjang sisi-sisinya."},
    ],
  }),
  Qn(7,"Refleksi terhadap Garis x = a",{type:"mixed",
    content:"Tentukan bayangan titik-titik berikut setelah direfleksikan terhadap garis x = 3:",
    parts:[
      {label:"a.",math:"A(1, 4) \\to A' \\quad \\text{(gunakan rumus: } x' = 2a-x, y'=y\\text{)}"},
      {label:"b.",math:"B(5, -2) \\to B'"},
      {label:"c.",math:"C(3, 7) \\to C' \\quad \\text{(titik tepat di garis cermin)}"},
    ],
  }),
  Qn(8,"Refleksi terhadap Garis y = b",{type:"mixed",
    content:"Tentukan bayangan titik-titik berikut setelah direfleksikan terhadap garis y = −2:",
    parts:[
      {label:"a.",math:"P(4, 1) \\to P' \\quad \\text{(gunakan rumus: } x'=x, y'=2b-y\\text{)}"},
      {label:"b.",math:"Q(-3, -5) \\to Q'"},
      {label:"c.",math:"R(0, -2) \\to R'"},
    ],
  }),
  Qn(9,"Refleksi Ganda",{type:"mixed",
    content:"Titik A(4, 1) direfleksikan terhadap sumbu-x menghasilkan A′. Kemudian A′ direfleksikan terhadap sumbu-y menghasilkan A″.",
    parts:[
      {label:"a.",text:"Tentukan koordinat A′."},
      {label:"b.",text:"Tentukan koordinat A″."},
      {label:"c.",math:"\\text{Refleksi ganda terhadap sumbu-x lalu sumbu-y sama dengan transformasi apa?}"},
    ],
  }),
  Qn(10,"Refleksi pada Kuadran — Diagram",{type:"diagram",
    diagram:(
      <GridSVG>
        <MirrorLine x={0} vertical={true} color="#facc15"/>
        <Dot x={3} y={4} color="#34d399" r={4} label="P(3,4)"/>
        <Dot x={-3} y={4} color="#f472b6" r={4} label="P'(-3,4)"/>
        <DashLine x1={3} y1={4} x2={-3} y2={4} color="#94a3b8"/>
        <Dot x={2} y={-3} color="#22d3ee" r={4} label="Q(2,-3)"/>
        <Dot x={-2} y={-3} color="#fb923c" r={4} label="Q'(-2,-3)"/>
        <DashLine x1={2} y1={-3} x2={-2} y2={-3} color="#94a3b8"/>
      </GridSVG>
    ),
    content:"Diagram menunjukkan refleksi titik P dan Q terhadap sumbu-y.",
    parts:[
      {label:"a.",text:"Verifikasi koordinat P′ dan Q′ menggunakan rumus refleksi sumbu-y."},
      {label:"b.",math:"\\text{Tentukan bayangan R(0, 5) terhadap sumbu-y.}"},
      {label:"c.",text:"Di kuadran mana saja letak P, P′, Q, Q′?"},
    ],
  }),
  Qn(11,"Titik Asal dari Bayangan Refleksi",{type:"mixed",
    content:"Bayangan suatu titik setelah refleksi terhadap sumbu-x adalah Q′(−3, 5). Tentukan titik asalnya Q.",
    parts:[
      {label:"a.",text:"Gunakan sifat invers refleksi terhadap sumbu-x."},
      {label:"b.",math:"\\text{Tentukan juga bayangan Q terhadap garis } y = x."},
    ],
  }),
  Qn(12,"UN — Refleksi Titik",{type:"mixed",
    content:"Bayangan titik P(−2, 5) yang dicerminkan terhadap garis y = x adalah ...",
    parts:[
      {label:"",text:"Pilihan: a. (5, −2)   b. (2, 5)   c. (−5, 2)   d. (2, −5)"},
      {label:"Jawab:",text:"Tentukan dan jelaskan langkah penyelesaiannya."},
    ],
  }),
  Qn(13,"Refleksi Persegi terhadap Sumbu-x",{type:"mixed",
    content:"Persegi ABCD dengan A(1,2), B(4,2), C(4,5), D(1,5) direfleksikan terhadap sumbu-x.",
    parts:[
      {label:"a.",text:"Tentukan koordinat bayangan A′, B′, C′, D′."},
      {label:"b.",text:"Di kuadran manakah persegi bayangan A′B′C′D′ berada?"},
      {label:"c.",text:"Apakah persegi ABCD ≅ A′B′C′D′? Jelaskan."},
    ],
  }),
  Qn(14,"Refleksi Titik pada Sumbu",{type:"mixed",
    content:"Titik-titik berikut berada tepat pada sumbu koordinat. Tentukan bayangannya terhadap garis y = x:",
    parts:[
      {label:"a.",math:"A(5, 0) \\to A'"},
      {label:"b.",math:"B(0, -3) \\to B'"},
      {label:"c.",math:"C(0, 0) \\to C'"},
    ],
  }),
  Qn(15,"ANBK — Refleksi dan Koordinat",{type:"mixed",
    content:"Diketahui titik K(a, b) dan bayangannya K′(3, −5) setelah refleksi terhadap sumbu-y.",
    parts:[
      {label:"a.",text:"Tentukan nilai a dan b."},
      {label:"b.",math:"\\text{Tentukan bayangan K terhadap garis } y = x."},
    ],
  }),
  Qn(16,"Refleksi Segitiga — y = −x — Diagram",{type:"diagram",
    diagram:(
      <GridSVG>
        <DiagLine slope={1} color="#facc15"/>
        <Poly pts={[[1,2],[4,2],[2,5]]} color="#a78bfa" label="△PQR"/>
        <Poly pts={[[-2,-1],[-2,-4],[-5,-2]]} color="#fb923c" fill="rgba(251,146,60,0.12)" label="△P'Q'R'"/>
        <DashLine x1={1} y1={2} x2={-2} y2={-1} color="#94a3b8"/>
        <DashLine x1={4} y1={2} x2={-2} y2={-4} color="#94a3b8"/>
      </GridSVG>
    ),
    content:"Garis kuning adalah cermin y = −x.",
    parts:[
      {label:"a.",text:"Verifikasi koordinat P′ menggunakan rumus: refleksi terhadap y = −x memetakan (x,y) → (−y,−x)."},
      {label:"b.",text:"Tentukan koordinat R(2,5) setelah refleksi terhadap y = −x."},
      {label:"c.",text:"Apakah orientasi segitiga berubah setelah refleksi? Jelaskan."},
    ],
  }),
  Qn(17,"Refleksi Titik — Garis x = −2",{type:"mixed",
    content:"Tentukan bayangan titik-titik berikut setelah direfleksikan terhadap garis x = −2:",
    parts:[
      {label:"a.",math:"A(3, 5) \\to A'"},
      {label:"b.",math:"B(-4, -1) \\to B'"},
      {label:"c.",math:"C(-2, 3) \\to C'"},
    ],
  }),
  Qn(18,"Refleksi Garis terhadap Sumbu-y",{type:"mixed",
    content:"Garis y = 3x − 2 direfleksikan terhadap sumbu-y.",
    parts:[
      {label:"a.",text:"Substitusi x → −x untuk mendapatkan persamaan bayangan garis."},
      {label:"b.",text:"Tentukan persamaan garis bayangan."},
      {label:"c.",text:"Apakah gradien garis berubah setelah refleksi terhadap sumbu-y?"},
    ],
  }),
  Qn(19,"Refleksi Berulang",{type:"mixed",
    content:"Titik M(2, −3) direfleksikan berulang terhadap sumbu-x sebanyak 100 kali.",
    parts:[
      {label:"a.",text:"Tentukan bayangan M setelah 1 kali refleksi."},
      {label:"b.",text:"Tentukan bayangan M setelah 2 kali refleksi."},
      {label:"c.",text:"Tentukan bayangan M setelah 100 kali refleksi (genap/ganjil?)."},
    ],
  }),
  Qn(20,"Refleksi — Titik pada Garis Cermin",{type:"mixed",
    content:"Suatu titik tepat berada pada garis cermin. Apa yang terjadi setelah refleksi?",
    parts:[
      {label:"a.",math:"\\text{Jika P(4, 4) direfleksikan terhadap } y = x, \\text{ tentukan P'.}"},
      {label:"b.",math:"\\text{Jika Q(3, -3) direfleksikan terhadap } y = -x, \\text{ tentukan Q'.}"},
      {label:"c.",text:"Apa kesimpulan umum untuk titik yang berada tepat pada garis cermin?"},
    ],
  }),
  Qn(21,"TKA — Identifikasi Refleksi",{type:"mixed",
    content:"Titik A(−3, 4) dan bayangannya A′(4, −3). Tentukan garis pencerminan yang digunakan.",
    parts:[
      {label:"a.",text:"Periksa apakah ini refleksi terhadap y = x atau y = −x."},
      {label:"b.",text:"Jelaskan cara membedakan kedua jenis refleksi tersebut."},
    ],
  }),
  Qn(22,"Refleksi Lingkaran",{type:"mixed",
    content:"Lingkaran dengan pusat P(3, −2) dan jari-jari 5 satuan direfleksikan terhadap sumbu-x.",
    parts:[
      {label:"a.",text:"Tentukan pusat lingkaran bayangan."},
      {label:"b.",text:"Apakah jari-jari berubah setelah refleksi?"},
      {label:"c.",math:"\\text{Tulis persamaan lingkaran bayangan dalam bentuk } (x-a)^2+(y-b)^2=r^2."},
    ],
  }),
  Qn(23,"Refleksi — Diagram Persegi Panjang",{type:"diagram",
    diagram:(
      <GridSVG>
        <MirrorLine x={0} vertical={false} color="#facc15"/>
        <Poly pts={[[1,1],[4,1],[4,3],[1,3]]} color="#34d399" label="ABCD"/>
        <Poly pts={[[1,-1],[4,-1],[4,-3],[1,-3]]} color="#f472b6" fill="rgba(244,114,182,0.12)" label="A'B'C'D'"/>
        <DashLine x1={1} y1={1} x2={1} y2={-1} color="#94a3b8"/>
        <DashLine x1={4} y1={3} x2={4} y2={-3} color="#94a3b8"/>
        <Dot x={1} y={1} color="#34d399" r={3} label="A(1,1)"/>
        <Dot x={4} y={3} color="#34d399" r={3} label="C(4,3)"/>
      </GridSVG>
    ),
    parts:[
      {label:"a.",text:"Tentukan koordinat semua sudut ABCD dan A′B′C′D′ dari diagram."},
      {label:"b.",text:"Apakah persegi panjang ABCD dan A′B′C′D′ kongruen? Hitunglah panjang dan lebarnya."},
      {label:"c.",text:"Di mana posisi persegi panjang bayangan relatif terhadap sumbu-x?"},
    ],
  }),
  Qn(24,"Refleksi — Mencari Parameter",{type:"mixed",
    content:"Titik P(m, 3) direfleksikan terhadap sumbu-y menghasilkan P′(5, n). Tentukan nilai m dan n.",
    parts:[
      {label:"a.",text:"Gunakan rumus refleksi terhadap sumbu-y."},
      {label:"b.",text:"Tentukan nilai m dan n."},
    ],
  }),
  Qn(25,"ANBK — Refleksi Ganda terhadap Dua Sumbu",{type:"mixed",
    content:"Titik K(3, −2) direfleksikan terhadap sumbu-x menghasilkan K′, lalu K′ direfleksikan terhadap sumbu-y menghasilkan K″.",
    parts:[
      {label:"a.",text:"Tentukan K′ dan K″."},
      {label:"b.",text:"Transformasi tunggal apa yang setara dengan dua refleksi berturut-turut ini?"},
      {label:"c.",math:"\\text{Jika K'' = (-3, 2), apakah benar? Verifikasi!}"},
    ],
  }),
  Qn(26,"Refleksi Titik Simetris",{type:"mixed",
    content:"Titik A(a, b) dan titik B adalah refleksi A terhadap sumbu-x. Titik C adalah refleksi A terhadap sumbu-y.",
    parts:[
      {label:"a.",text:"Nyatakan koordinat B dan C dalam a dan b."},
      {label:"b.",math:"\\text{Tentukan titik tengah AC dan titik tengah AB.}"},
      {label:"c.",text:"Apakah titik tengah AC selalu berada di sumbu-y? Jelaskan."},
    ],
  }),
  Qn(27,"Refleksi Garis terhadap y = x",{type:"mixed",
    content:"Garis y = 2x + 3 direfleksikan terhadap garis y = x.",
    parts:[
      {label:"a.",text:"Tukar x dan y pada persamaan garis untuk mendapatkan persamaan bayangan."},
      {label:"b.",text:"Tulis persamaan bayangan dalam bentuk y = mx + c."},
      {label:"c.",text:"Apa hubungan gradien garis asal dan bayangan saat refleksi terhadap y = x?"},
    ],
  }),
  Qn(28,"Refleksi Segitiga — UN Style",{type:"mixed",
    content:"Segitiga dengan titik-titik P(2, 1), Q(6, 1), R(4, 5) direfleksikan terhadap garis y = x.",
    parts:[
      {label:"a.",text:"Tentukan koordinat P′, Q′, R′."},
      {label:"b.",text:"Hitung panjang sisi PQ dan P′Q′. Apakah sama?"},
      {label:"c.",text:"Hitung luas segitiga PQR dan P′Q′R′."},
    ],
  }),
  Qn(29,"Refleksi — Garis x = 4",{type:"mixed",
    content:"Tentukan bayangan titik-titik berikut setelah refleksi terhadap garis x = 4:",
    parts:[
      {label:"a.",math:"A(1, 3) \\to A'"},
      {label:"b.",math:"B(7, -2) \\to B'"},
      {label:"c.",math:"C(4, 5) \\to C'"},
    ],
  }),
  Qn(30,"Refleksi — Garis y = −3",{type:"mixed",
    content:"Titik-titik K, L, M direfleksikan terhadap garis y = −3. Tentukan koordinat bayangannya:",
    parts:[
      {label:"a.",math:"K(2, 1) \\to K'"},
      {label:"b.",math:"L(-3, -5) \\to L'"},
      {label:"c.",math:"M(0, -3) \\to M'"},
    ],
  }),
  Qn(31,"Refleksi Jajargenjang",{type:"mixed",
    content:"Jajargenjang ABCD dengan A(−3,1), B(1,1), C(2,3), D(−2,3) direfleksikan terhadap sumbu-y.",
    parts:[
      {label:"a.",text:"Tentukan koordinat bayangan A′B′C′D′."},
      {label:"b.",text:"Apakah bayangan jajargenjang ini tetap berbentuk jajargenjang?"},
      {label:"c.",text:"Bandingkan luas jajargenjang asal dan bayangannya."},
    ],
  }),
  Qn(32,"Refleksi — Titik pada Sumbu",{type:"mixed",
    content:"Titik P berada pada sumbu-x dengan koordinat P(k, 0).",
    parts:[
      {label:"a.",text:"Tentukan bayangan P terhadap sumbu-x."},
      {label:"b.",text:"Tentukan bayangan P terhadap sumbu-y."},
      {label:"c.",math:"\\text{Tentukan bayangan P terhadap garis } y = x."},
    ],
  }),
  Qn(33,"TKA — Matriks Refleksi",{type:"mixed",
    content:"Matriks transformasi untuk refleksi terhadap sumbu-x adalah:",
    math:"M_x = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}",
    parts:[
      {label:"a.",math:"\\text{Tentukan bayangan A(3,-2) menggunakan matriks: } M_x \\begin{pmatrix}3\\\\-2\\end{pmatrix}"},
      {label:"b.",math:"\\text{Tulis matriks refleksi terhadap sumbu-y: } M_y = \\begin{pmatrix}?&?\\\\?&?\\end{pmatrix}"},
    ],
  }),
  Qn(34,"Refleksi — Soal Kontekstual",{type:"mixed",
    content:"Sebuah cermin vertikal diletakkan pada garis x = 5. Sebuah bola berada di posisi A(2, 3).",
    parts:[
      {label:"a.",text:"Tentukan posisi bayangan bola di cermin."},
      {label:"b.",text:"Berapa jarak bola dari cermin?"},
      {label:"c.",text:"Berapa jarak antara bola asli dan bayangannya?"},
    ],
  }),
  Qn(35,"Refleksi — Koordinat Pecahan",{type:"mixed",
    content:"Titik A(3/2, −5/2) direfleksikan terhadap garis y = x.",
    parts:[
      {label:"a.",text:"Tentukan koordinat bayangan A′."},
      {label:"b.",text:"Apakah A berada di atas atau di bawah garis y = x? Jelaskan."},
    ],
  }),
  Qn(36,"Refleksi dan Titik Tengah",{type:"mixed",
    content:"Titik A(4, 6) dicerminkan terhadap suatu garis dan menghasilkan A′(−2, 6). Tentukan garis cerminnya.",
    parts:[
      {label:"a.",text:"Hitung titik tengah AA′."},
      {label:"b.",text:"Tentukan persamaan garis cermin (garis tersebut tegak lurus AA′ dan melalui titik tengahnya)."},
    ],
  }),
  Qn(37,"Refleksi Segitiga — Luas Tetap",{type:"diagram",
    diagram:(
      <GridSVG>
        <MirrorLine x={0} vertical={true} color="#facc15"/>
        <Poly pts={[[1,1],[4,1],[1,4]]} color="#22d3ee" label="△KLM"/>
        <Poly pts={[[-1,1],[-4,1],[-1,4]]} color="#f472b6" fill="rgba(244,114,182,0.12)" label="△K'L'M'"/>
        <DashLine x1={1} y1={1} x2={-1} y2={1} color="#94a3b8"/>
        <DashLine x1={4} y1={1} x2={-4} y2={1} color="#94a3b8"/>
        <DashLine x1={1} y1={4} x2={-1} y2={4} color="#94a3b8"/>
      </GridSVG>
    ),
    parts:[
      {label:"a.",text:"Tentukan koordinat K, L, M, K′, L′, M′ dari diagram."},
      {label:"b.",text:"Hitung luas △KLM dan △K′L′M′. Bandingkan."},
      {label:"c.",text:"Apakah refleksi termasuk isometri? Jelaskan alasanmu."},
    ],
  }),
  Qn(38,"Refleksi — ANBK Tipe Analisis",{type:"mixed",
    content:"Seorang siswa mengklaim: 'Refleksi titik A(2, 3) terhadap sumbu-x menghasilkan A′(2, 3).' Apakah pernyataan ini benar?",
    parts:[
      {label:"a.",text:"Periksa jawaban siswa tersebut dengan menggunakan rumus refleksi sumbu-x."},
      {label:"b.",text:"Jika salah, tentukan jawaban yang benar dan jelaskan kesalahan siswa."},
    ],
  }),
  Qn(39,"Refleksi Penuh — 4 Garis",{type:"mixed",
    content:"Tentukan bayangan titik P(3, 5) setelah dicerminkan terhadap masing-masing garis berikut:",
    parts:[
      {label:"a.",math:"\\text{Sumbu-}x \\to P_1"},
      {label:"b.",math:"\\text{Sumbu-}y \\to P_2"},
      {label:"c.",math:"y = x \\to P_3"},
      {label:"d.",math:"y = -x \\to P_4"},
    ],
  }),
  Qn(40,"Refleksi — Soal UN Terapan",{type:"mixed",
    content:"Pada sebuah pertandingan bola, pemain berada di titik P(4, 2). Ia ingin memantulkan bola ke dinding (sumbu-y) dan mengarahkannya ke gawang di G(−6, 2).",
    parts:[
      {label:"a.",text:"Tentukan bayangan gawang G terhadap sumbu-y untuk mencari titik pantulan."},
      {label:"b.",text:"Tentukan koordinat titik pantulan bola di dinding (sumbu-y)."},
      {label:"c.",text:"Hitung total jarak yang ditempuh bola: dari P ke dinding, lalu ke G."},
    ],
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
            <span className="text-emerald-400 text-xs font-bold">📋 40 Soal</span>
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
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
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
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.math && <div className="mb-3 overflow-x-auto"><BlockMath>{q.math}</BlockMath></div>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
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
