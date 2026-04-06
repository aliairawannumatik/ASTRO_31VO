import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
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

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay"|"mixed"|"diagram" };
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1,"Dilatasi Titik terhadap Titik Asal",{type:"mixed",
    content:"Dilatasi dengan pusat O(0,0) dan faktor skala k memetakan (x,y) → (kx, ky). Tentukan bayangan titik-titik berikut dengan k = 3:",
    parts:[
      {label:"a.",math:"A(2, 1) \\to A'"},
      {label:"b.",math:"B(-3, 4) \\to B'"},
      {label:"c.",math:"C(0, -5) \\to C'"},
    ],
  }),
  Qn(2,"Dilatasi dengan Faktor Skala Pecahan",{type:"mixed",
    content:"Dilatasi dengan pusat O(0,0) dan faktor skala k = ½. Tentukan bayangan:",
    parts:[
      {label:"a.",math:"P(6, 4) \\to P'"},
      {label:"b.",math:"Q(-8, 2) \\to Q'"},
      {label:"c.",math:"R(3, -5) \\to R' \\; (\\text{pecahan})"},
    ],
  }),
  Qn(3,"Dilatasi — Diagram Pembesaran",{type:"diagram",
    diagram:(
      <GridSVG>
        <Poly pts={[[1,0],[2,0],[2,2],[1,2]]} color="#f43f5e" label="P"/>
        <Poly pts={[[2,0],[4,0],[4,4],[2,4]]} color="#22d3ee" fill="rgba(34,211,238,0.12)" label="P'"/>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <DilLine x1={0} y1={0} x2={4} y2={0}/>
        <DilLine x1={0} y1={0} x2={4} y2={4}/>
        <DilLine x1={0} y1={0} x2={2} y2={4}/>
      </GridSVG>
    ),
    content:"Bangun P didilatasi terhadap pusat O dengan faktor skala tertentu menghasilkan P′.",
    parts:[
      {label:"a.",text:"Tentukan koordinat sudut-sudut P dan P′ dari diagram."},
      {label:"b.",text:"Tentukan faktor skala dilatasi."},
      {label:"c.",text:"Bandingkan luas P dan luas P′. Berapa kali lebih besar?"},
    ],
  }),
  Qn(4,"Dilatasi dengan Pusat Bukan Titik Asal",{type:"mixed",
    content:"Dilatasi dengan pusat P(2, 1) dan faktor skala k = 2 memetakan titik A menggunakan rumus: A′ = P + k(A − P).",
    parts:[
      {label:"a.",math:"\\text{Tentukan bayangan A(4, 3): } A' = (2,1) + 2\\big((4,3)-(2,1)\\big)"},
      {label:"b.",math:"\\text{Tentukan bayangan B(1, -1): } B' = (2,1) + 2\\big((1,-1)-(2,1)\\big)"},
    ],
  }),
  Qn(5,"Mencari Faktor Skala",{type:"mixed",
    content:"Tentukan faktor skala dilatasi terhadap pusat O(0,0) untuk setiap pemetaan berikut:",
    parts:[
      {label:"a.",math:"A(3, 6) \\to A'(9, 18)"},
      {label:"b.",math:"B(8, 4) \\to B'(2, 1)"},
      {label:"c.",math:"C(-5, 10) \\to C'(2, -4)"},
    ],
  }),
  Qn(6,"Dilatasi — Diagram Segitiga",{type:"diagram",
    diagram:(
      <GridSVG>
        <Poly pts={[[0,0],[2,0],[0,3]]} color="#f43f5e" label="△ABC"/>
        <Poly pts={[[0,0],[4,0],[0,6]]} color="#a78bfa" fill="rgba(167,139,250,0.12)" label="△A'B'C'"/>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <DilLine x1={0} y1={0} x2={4} y2={0}/>
        <DilLine x1={0} y1={0} x2={0} y2={6}/>
        <DilLine x1={0} y1={0} x2={4} y2={0}/>
      </GridSVG>
    ),
    parts:[
      {label:"a.",text:"Tentukan koordinat A, B, C dan A′, B′, C′ dari diagram."},
      {label:"b.",text:"Tentukan faktor skala dilatasi."},
      {label:"c.",text:"Hitung perbandingan luas △ABC terhadap △A′B′C′."},
    ],
  }),
  Qn(7,"Dilatasi dengan k Negatif",{type:"mixed",
    content:"Dilatasi dengan pusat O(0,0) dan faktor skala k = −2 memetakan (x,y) → (−2x, −2y). Tentukan bayangan:",
    parts:[
      {label:"a.",math:"A(1, 3) \\to A'"},
      {label:"b.",math:"B(-2, 1) \\to B'"},
      {label:"c.",text:"Apa perbedaan antara dilatasi dengan k positif dan k negatif?"},
    ],
  }),
  Qn(8,"Rasio Luas Dilatasi",{type:"mixed",
    content:"Sebuah bangun didilatasi dengan faktor skala k terhadap suatu pusat.",
    parts:[
      {label:"a.",math:"\\text{Jika } k = 3, \\text{ berapa kali luas bayangan terhadap luas asal?}"},
      {label:"b.",math:"\\text{Jika } k = \\frac{1}{2}, \\text{ berapa kali luas bayangan terhadap luas asal?}"},
      {label:"c.",math:"\\text{Jika luas bayangan = 9 kali luas asal, tentukan nilai } |k|."},
    ],
  }),
  Qn(9,"Dilatasi — UN Style",{type:"mixed",
    content:"Segitiga PQR dengan P(2, 1), Q(6, 1), R(4, 5) didilatasi terhadap titik asal dengan faktor skala k = 2.",
    parts:[
      {label:"a.",text:"Tentukan koordinat P′, Q′, R′."},
      {label:"b.",text:"Hitung luas segitiga PQR dan P′Q′R′."},
      {label:"c.",text:"Berapa kali lebih besar luas bayangan dibanding luas asal?"},
    ],
  }),
  Qn(10,"Dilatasi — Diagram Penyusutan",{type:"diagram",
    diagram:(
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
    content:"Persegi besar didilatasi terhadap pusat O menghasilkan persegi kecil.",
    parts:[
      {label:"a.",text:"Tentukan koordinat sudut-sudut kedua persegi dari diagram."},
      {label:"b.",text:"Tentukan faktor skala dilatasi."},
      {label:"c.",text:"Hitung rasio keliling dan luas persegi asal terhadap bayangannya."},
    ],
  }),
  Qn(11,"Mencari Titik Asal dari Bayangan",{type:"mixed",
    content:"Bayangan titik A setelah dilatasi dengan pusat O(0,0) dan k = 3 adalah A′(12, −9). Tentukan titik asalnya A.",
    parts:[
      {label:"a.",math:"\\text{Gunakan: } A = \\frac{A'}{k} = \\frac{1}{3}(12, -9)"},
      {label:"b.",text:"Tentukan koordinat A."},
    ],
  }),
  Qn(12,"ANBK — Dilatasi Segitiga Siku-siku",{type:"mixed",
    content:"Segitiga siku-siku dengan siku-siku di O(0,0), dan titik lainnya B(4,0), C(0,3) didilatasi dengan k = 3 terhadap O.",
    parts:[
      {label:"a.",text:"Tentukan bayangan O′, B′, C′."},
      {label:"b.",text:"Hitung panjang sisi-sisi bayangan segitiga."},
      {label:"c.",math:"\\text{Hitung luas } \\triangle OBC \\text{ dan } \\triangle O'B'C'. \\text{ Berapa kali lebih besar?}"},
    ],
  }),
  Qn(13,"Dilatasi dengan Pusat Bergeser",{type:"mixed",
    content:"Titik A(5, 4) didilatasi dengan pusat P(1, 2) dan k = 3.",
    math:"A' = P + k(A-P) = (1,2) + 3\\big((5,4)-(1,2)\\big)",
    parts:[
      {label:"a.",text:"Hitung A − P."},
      {label:"b.",text:"Kalikan dengan k = 3."},
      {label:"c.",text:"Tambahkan P untuk mendapat A′."},
    ],
  }),
  Qn(14,"Dilatasi — Menemukan Pusat",{type:"mixed",
    content:"Titik A(2, 3) didilatasi menjadi A′(6, 9) dengan k = 3. Titik B(4, 1) didilatasi menjadi B′(12, 3) dengan k = 3.",
    parts:[
      {label:"a.",text:"Tentukan pusat dilatasi dengan menggunakan persamaan A′ = k·A + (1−k)·P."},
      {label:"b.",text:"Verifikasi menggunakan titik B."},
    ],
  }),
  Qn(15,"TKA — Dilatasi dan Perbandingan",{type:"mixed",
    content:"Foto berukuran 4 cm × 6 cm diperbesar dengan faktor skala k = 2,5.",
    parts:[
      {label:"a.",text:"Tentukan ukuran foto yang diperbesar."},
      {label:"b.",text:"Berapa kali lebih besar luas foto yang diperbesar?"},
      {label:"c.",text:"Jika harga cetak Rp 5.000/cm², berapa biaya cetak foto asli dan foto yang diperbesar?"},
    ],
  }),
  Qn(16,"Dilatasi — Diagram Segitiga dengan Pusat Bukan O",{type:"diagram",
    diagram:(
      <GridSVG>
        <Dot x={1} y={1} color="#facc15" r={3} label="P(1,1)"/>
        <Poly pts={[[2,1],[4,1],[2,3]]} color="#f43f5e" label="△"/>
        <Poly pts={[[3,1],[7,1],[3,5]]} color="#22d3ee" fill="rgba(34,211,238,0.12)" label="△'"/>
        <DilLine x1={1} y1={1} x2={7} y2={1}/>
        <DilLine x1={1} y1={1} x2={3} y2={5}/>
      </GridSVG>
    ),
    content:"Segitiga merah didilatasi terhadap pusat P(1,1) menghasilkan segitiga biru.",
    parts:[
      {label:"a.",text:"Tentukan faktor skala dilatasi dari diagram."},
      {label:"b.",text:"Verifikasi koordinat bayangan menggunakan rumus dilatasi pusat P."},
      {label:"c.",text:"Hitung perbandingan luas kedua segitiga."},
    ],
  }),
  Qn(17,"Dilatasi dengan k = 1",{type:"mixed",
    content:"Sebuah titik M(a, b) didilatasi dengan pusat O(0,0) dan faktor skala k = 1.",
    parts:[
      {label:"a.",text:"Tentukan bayangan M."},
      {label:"b.",text:"Apa yang terjadi pada bangun jika k = 1? Apa nama transformasi ini?"},
    ],
  }),
  Qn(18,"Dilatasi — Rasio Panjang Sisi",{type:"mixed",
    content:"Persegi panjang ABCD dengan panjang 5 cm dan lebar 3 cm didilatasi dengan k = 4.",
    parts:[
      {label:"a.",text:"Tentukan panjang dan lebar bayangan."},
      {label:"b.",text:"Hitung keliling persegi panjang asal dan bayangan."},
      {label:"c.",text:"Berapa kali lebih besar luas bayangan terhadap luas asal?"},
    ],
  }),
  Qn(19,"Dilatasi dan Kesebangungan",{type:"mixed",
    content:"Segitiga ABC dan A′B′C′ adalah hasil dilatasi satu sama lain.",
    parts:[
      {label:"a.",text:"Apakah segitiga ABC sebangun dengan A′B′C′? Jelaskan."},
      {label:"b.",text:"Apakah kedua segitiga kongruen? Jelaskan."},
      {label:"c.",math:"\\text{Jika } AB = 3 \\text{ cm dan } A'B' = 9 \\text{ cm, tentukan } k."},
    ],
  }),
  Qn(20,"UN — Dilatasi Titik",{type:"mixed",
    content:"Titik P(−3, 4) didilatasi terhadap titik asal dengan faktor skala k = −2. Bayangan P adalah ...",
    parts:[
      {label:"",text:"Pilihan: a. (6, −8)   b. (−6, 8)   c. (6, 8)   d. (−6, −8)"},
      {label:"Jawab:",text:"Gunakan rumus dilatasi terhadap O dengan k negatif."},
    ],
  }),
  Qn(21,"Dilatasi — Koordinat Negatif",{type:"mixed",
    content:"Titik-titik berikut didilatasi terhadap O(0,0) dengan k = −3. Tentukan bayangan dan kuadrannya:",
    parts:[
      {label:"a.",math:"A(2, 1) \\to A'"},
      {label:"b.",math:"B(-3, 2) \\to B'"},
      {label:"c.",math:"C(1, -4) \\to C'"},
    ],
  }),
  Qn(22,"ANBK — Dilatasi Dua Kali",{type:"mixed",
    content:"Titik A(1, 2) didilatasi dua kali berturut-turut terhadap titik asal:",
    parts:[
      {label:"",math:"\\text{Pertama dengan } k_1 = 2, \\text{ lalu dengan } k_2 = 3"},
      {label:"a.",text:"Tentukan posisi A setelah dilatasi pertama."},
      {label:"b.",text:"Tentukan posisi A setelah dilatasi kedua."},
      {label:"c.",math:"\\text{Apakah sama dengan dilatasi tunggal } k = k_1 \\times k_2 = 6?"},
    ],
  }),
  Qn(23,"Dilatasi — Diagram Perbandingan",{type:"diagram",
    diagram:(
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
    content:"Titik A dan B masing-masing didilatasi terhadap O menghasilkan A′ dan B′.",
    parts:[
      {label:"a.",text:"Tentukan faktor skala dari A ke A′."},
      {label:"b.",text:"Verifikasi dengan B dan B′."},
      {label:"c.",text:"Apakah O, A, A′ segaris? Apakah O, B, B′ segaris? Jelaskan."},
    ],
  }),
  Qn(24,"Dilatasi — Perbandingan Panjang Ruas",{type:"mixed",
    content:"Ruas garis AB dengan A(1, 2) dan B(3, 4) didilatasi terhadap O(0,0) dengan k = 3.",
    parts:[
      {label:"a.",text:"Tentukan A′ dan B′."},
      {label:"b.",text:"Hitung panjang AB dan A′B′."},
      {label:"c.",math:"\\text{Gunakan: } |AB| = \\sqrt{(3-1)^2+(4-2)^2}"},
    ],
  }),
  Qn(25,"TKA — Dilatasi Foto/Peta",{type:"mixed",
    content:"Pada peta berskala 1:500.000, jarak dua kota adalah 4 cm. Jika peta diperbesar dengan faktor skala k = 2:",
    parts:[
      {label:"a.",text:"Berapa jarak dua kota pada peta baru?"},
      {label:"b.",text:"Berapa skala peta baru?"},
      {label:"c.",text:"Berapa jarak sesungguhnya dua kota tersebut?"},
    ],
  }),
  Qn(26,"Dilatasi dan Peta",{type:"mixed",
    content:"Jarak antara kota A dan B pada peta adalah 6 cm dengan skala 1:200.000. Kita ingin memperbesar peta agar jarak AB menjadi 18 cm.",
    parts:[
      {label:"a.",text:"Tentukan faktor skala pembesaran peta."},
      {label:"b.",text:"Tentukan skala peta baru."},
      {label:"c.",text:"Berapa jarak sesungguhnya A dan B?"},
    ],
  }),
  Qn(27,"Dilatasi — Luas dan Keliling",{type:"mixed",
    content:"Segitiga dengan luas 12 cm² dan keliling 18 cm didilatasi dengan faktor skala k = 3.",
    parts:[
      {label:"a.",math:"\\text{Luas bayangan} = k^2 \\times \\text{luas asal} = ?"},
      {label:"b.",math:"\\text{Keliling bayangan} = k \\times \\text{keliling asal} = ?"},
      {label:"c.",text:"Apakah faktor pengali luas sama dengan faktor pengali keliling? Jelaskan."},
    ],
  }),
  Qn(28,"Dilatasi — UN 2021 Style",{type:"mixed",
    content:"Persegi dengan pusat O(0,0) memiliki koordinat sudut A(2,2), B(2,−2), C(−2,−2), D(−2,2). Persegi didilatasi dengan k = ½ terhadap O.",
    parts:[
      {label:"a.",text:"Tentukan koordinat A′, B′, C′, D′."},
      {label:"b.",text:"Hitung luas persegi asal dan bayangan."},
      {label:"c.",text:"Berapa perbandingan luas persegi bayangan terhadap luas persegi asal?"},
    ],
  }),
  Qn(29,"Dilatasi — Menemukan Faktor Skala dari Luas",{type:"mixed",
    content:"Bayangan suatu persegi panjang hasil dilatasi memiliki luas 144 cm². Luas persegi panjang asal adalah 16 cm².",
    parts:[
      {label:"a.",math:"\\text{Gunakan: Luas bayangan} = k^2 \\times \\text{luas asal}"},
      {label:"b.",text:"Tentukan nilai k² dan kemudian nilai k."},
      {label:"c.",text:"Apakah ada dua kemungkinan nilai k? Jelaskan."},
    ],
  }),
  Qn(30,"Dilatasi — ANBK Kontekstual",{type:"mixed",
    content:"Sebuah model miniatur gedung dibuat dengan skala 1:50. Tinggi gedung sesungguhnya adalah 75 m.",
    parts:[
      {label:"a.",text:"Tentukan tinggi miniatur gedung dalam cm."},
      {label:"b.",text:"Tentukan faktor skala jika miniatur diperbesar 3 kali."},
      {label:"c.",text:"Berapa tinggi hasil pembesaran miniatur (dalam cm)?"},
    ],
  }),
  Qn(31,"Dilatasi — Koordinat dengan Variabel",{type:"mixed",
    content:"Titik A(m, 2m) didilatasi terhadap O(0,0) dengan k = 3 menghasilkan A′(9, 18).",
    parts:[
      {label:"a.",text:"Tentukan nilai m."},
      {label:"b.",text:"Tentukan koordinat titik A."},
      {label:"c.",math:"\\text{Verifikasi: } 3 \\times A = A'?"},
    ],
  }),
  Qn(32,"Dilatasi — Diagram Segitiga Penyusutan",{type:"diagram",
    diagram:(
      <GridSVG>
        <Dot x={0} y={0} color="#facc15" r={3} label="O"/>
        <Poly pts={[[-4,0],[4,0],[0,4]]} color="#a78bfa" label="△besar"/>
        <Poly pts={[[-2,0],[2,0],[0,2]]} color="#f43f5e" fill="rgba(244,63,94,0.15)" label="△kecil"/>
        <DilLine x1={0} y1={0} x2={-4} y2={0}/>
        <DilLine x1={0} y1={0} x2={4} y2={0}/>
        <DilLine x1={0} y1={0} x2={0} y2={4}/>
      </GridSVG>
    ),
    content:"Segitiga besar didilatasi terhadap O menghasilkan segitiga kecil.",
    parts:[
      {label:"a.",text:"Tentukan koordinat semua sudut kedua segitiga dari diagram."},
      {label:"b.",text:"Tentukan faktor skala dilatasi (k < 1 = penyusutan)."},
      {label:"c.",text:"Hitung perbandingan luas segitiga kecil terhadap segitiga besar."},
    ],
  }),
  Qn(33,"Dilatasi Gabungan dengan Transformasi Lain",{type:"mixed",
    content:"Titik A(2, 3) didilatasi terhadap O dengan k = 2 menghasilkan A′. Kemudian A′ direfleksikan terhadap sumbu-x menghasilkan A″.",
    parts:[
      {label:"a.",text:"Tentukan A′."},
      {label:"b.",text:"Tentukan A″."},
      {label:"c.",text:"Apakah urutan transformasi mempengaruhi hasil akhir? Coba balik urutannya."},
    ],
  }),
  Qn(34,"TKA — Kesebangungan dan Dilatasi",{type:"mixed",
    content:"Dua bangun dikatakan sebangun (similar) jika salah satunya merupakan hasil dilatasi dari yang lain.",
    parts:[
      {label:"a.",text:"Segitiga ABC memiliki sisi 3 cm, 4 cm, 5 cm. Bayangan dilatasi memiliki sisi 9 cm, 12 cm, 15 cm. Tentukan k."},
      {label:"b.",text:"Apakah kedua segitiga kongruen? Apakah sebangun?"},
      {label:"c.",math:"\\text{Hitung perbandingan luas kedua segitiga.}"},
    ],
  }),
  Qn(35,"Dilatasi — UN 2017 Style",{type:"mixed",
    content:"Titik A(2, −3) didilatasi dengan pusat O(0,0) dan faktor skala k = −4. Bayangan A adalah ...",
    parts:[
      {label:"",text:"Pilihan: a. (−8, 12)   b. (8, −12)   c. (8, 12)   d. (−8, −12)"},
      {label:"Jawab:",math:"\\text{Gunakan: } A' = k \\cdot A = -4 \\cdot (2,-3)"},
    ],
  }),
  Qn(36,"Dilatasi — Titik pada Garis Tengah",{type:"mixed",
    content:"Titik P(a, b) berada tepat pada pusat dilatasi O(0,0).",
    parts:[
      {label:"a.",math:"\\text{Tentukan bayangan P dengan } k = 5."},
      {label:"b.",text:"Apa yang dapat disimpulkan tentang titik pusat dilatasi?"},
    ],
  }),
  Qn(37,"Dilatasi — Segi Enam Beraturan",{type:"mixed",
    content:"Segi enam beraturan memiliki panjang sisi 2 cm. Bangun tersebut didilatasi dengan k = 2,5.",
    parts:[
      {label:"a.",text:"Tentukan panjang sisi bayangan."},
      {label:"b.",text:"Tentukan perbandingan luas segi enam asal dengan bayangannya."},
      {label:"c.",text:"Apakah bentuk segi enam berubah setelah dilatasi?"},
    ],
  }),
  Qn(38,"Dilatasi — ANBK Tipe Analisis",{type:"mixed",
    content:"Seorang siswa berkata: 'Dilatasi dengan k = −1 sama dengan rotasi 180°.' Apakah pernyataan ini benar untuk dilatasi terhadap titik asal?",
    parts:[
      {label:"a.",math:"\\text{Uji dengan A(3,2). Dilatasi k=-1: } A' = ?"},
      {label:"b.",math:"\\text{Rotasi 180°: } A' = ?"},
      {label:"c.",text:"Bandingkan hasilnya. Apakah pernyataan siswa benar?"},
    ],
  }),
  Qn(39,"Dilatasi — Semua Faktor Skala",{type:"mixed",
    content:"Titik P(4, 2) didilatasi terhadap O(0,0). Tentukan bayangan untuk setiap faktor skala berikut:",
    parts:[
      {label:"a.",math:"k = 3"},
      {label:"b.",math:"k = \\frac{1}{2}"},
      {label:"c.",math:"k = -2"},
      {label:"d.",math:"k = -\\frac{1}{4}"},
    ],
  }),
  Qn(40,"Dilatasi — Soal UN Terapan",{type:"mixed",
    content:"Sebuah foto berukuran 10 cm × 15 cm ingin dicetak dalam ukuran poster. Panjang poster yang diinginkan adalah 60 cm.",
    parts:[
      {label:"a.",text:"Tentukan faktor skala pembesaran."},
      {label:"b.",text:"Tentukan lebar poster."},
      {label:"c.",text:"Jika harga cetak foto adalah Rp 3.000/cm² dan harga cetak poster adalah Rp 500/cm², manakah yang lebih mahal?"},
    ],
  }),
];

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
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 40 Soal</span>
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
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
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
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.math && <div className="mb-3 overflow-x-auto"><BlockMath>{q.math}</BlockMath></div>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-rose-400 text-xs font-bold shrink-0 mt-0.5">{p.label}</span>}
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
            Beberapa soal dilengkapi diagram bidang koordinat yang menunjukkan pembesaran dan penyusutan bangun terhadap pusat dilatasi. Soal-soal dipilih dari kisi-kisi UN, ANBK, dan TKA.
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

export default DilatsiPage;
