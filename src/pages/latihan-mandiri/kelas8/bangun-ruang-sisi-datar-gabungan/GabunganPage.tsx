import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

/* ── SVG: Balok + Limas di atasnya ──
   Oblique projection: depth vector (+28, -20)
   Balok vertices (bottom→top, front→back):
     A(25,170) B(150,170) C(178,150) D(53,150)  ← alas
     E(25,100) F(150,100) G(178,80)  H(53,80)   ← atas (= alas limas)
   Limas apex T(102,35)
*/
const BalokLimasSVG = ({
  p = "p", l = "l", tb = "t₁", tl = "t₂"
}: { p?: string; l?: string; tb?: string; tl?: string }) => (
  <svg width="260" height="215" viewBox="0 0 260 215" className="mx-auto">
    {/* ── BALOK (biru) ── */}
    {/* Rusuk tersembunyi (putus-putus) */}
    <line x1="25" y1="170" x2="53" y2="150" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="53" y1="150" x2="178" y2="150" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="53" y1="150" x2="53" y2="80" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    {/* Sisi depan */}
    <polygon points="25,170 150,170 150,100 25,100" fill="#6366f1" fillOpacity="0.30" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Sisi kanan */}
    <polygon points="150,170 178,150 178,80 150,100" fill="#6366f1" fillOpacity="0.18" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Sisi atas (alas limas) */}
    <polygon points="25,100 150,100 178,80 53,80" fill="#6366f1" fillOpacity="0.38" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Titik-titik balok */}
    {([[25,170],[150,170],[178,150],[53,150],[25,100],[150,100],[178,80],[53,80]] as [number,number][]).map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#818cf8"/>
    ))}
    {/* Label titik balok */}
    <text x="12" y="175" fill="white" fontSize="10" fontFamily="monospace">A</text>
    <text x="153" y="175" fill="white" fontSize="10" fontFamily="monospace">B</text>
    <text x="181" y="154" fill="white" fontSize="10" fontFamily="monospace">C</text>
    <text x="38" y="154" fill="white" fontSize="10" fontFamily="monospace" opacity="0.6">D</text>
    <text x="10" y="98" fill="white" fontSize="10" fontFamily="monospace">E</text>
    <text x="153" y="98" fill="white" fontSize="10" fontFamily="monospace">F</text>
    <text x="181" y="78" fill="white" fontSize="10" fontFamily="monospace">G</text>
    <text x="38" y="78" fill="white" fontSize="10" fontFamily="monospace" opacity="0.6">H</text>

    {/* ── LIMAS (merah) ── */}
    {/* Rusuk ke H tersembunyi */}
    <line x1="102" y1="35" x2="53" y2="80" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="5,3" strokeOpacity="0.65"/>
    {/* Sisi kiri (tersembunyi sebagian) */}
    <polygon points="53,80 25,100 102,35" fill="#f43f5e" fillOpacity="0.12" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,3"/>
    {/* Sisi belakang */}
    <polygon points="53,80 178,80 102,35" fill="#f43f5e" fillOpacity="0.15" stroke="#f43f5e" strokeWidth="1.3"/>
    {/* Sisi kanan */}
    <polygon points="150,100 178,80 102,35" fill="#f43f5e" fillOpacity="0.22" stroke="#f43f5e" strokeWidth="1.5"/>
    {/* Sisi depan */}
    <polygon points="25,100 150,100 102,35" fill="#f43f5e" fillOpacity="0.30" stroke="#f43f5e" strokeWidth="1.8"/>
    {/* Titik puncak T */}
    <circle cx="102" cy="35" r="3.5" fill="#fb7185"/>
    <text x="96" y="26" fill="#fb7185" fontSize="11" fontFamily="monospace" fontWeight="bold">T</text>

    {/* ── Label dimensi ── */}
    <text x="87" y="192" fill="#818cf8" fontSize="10" textAnchor="middle">{p}</text>
    <line x1="25" y1="186" x2="150" y2="186" stroke="#818cf8" strokeWidth="0.8" strokeOpacity="0.5"/>
    <text x="205" y="120" fill="#818cf8" fontSize="10" textAnchor="middle">{l}</text>
    <line x1="195" y1="150" x2="195" y2="80" stroke="#818cf8" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="3,2"/>
    <text x="8" y="138" fill="#818cf8" fontSize="10" textAnchor="middle">{tb}</text>
    <text x="230" y="62" fill="#fb7185" fontSize="10" textAnchor="middle">{tl}</text>
    <line x1="102" y1="35" x2="102" y2="90" stroke="#fb7185" strokeWidth="0.8" strokeOpacity="0.45" strokeDasharray="3,2"/>

    <text x="130" y="208" fill="#818cf8" fontSize="8" textAnchor="middle">Balok + Limas Segiempat</text>
  </svg>
);

/* ── SVG: Kubus + Prisma Segitiga (Rumah) ──
   Kubus: sisi s=75, depth (+28,-20)
     A(25,165) B(100,165) C(128,145) D(53,145)  ← alas
     E(25,90)  F(100,90)  G(128,70)  H(53,70)   ← atas
   Prisma atap (amber):
     Puncak depan P(62,42), puncak belakang Q(90,22)
     Rusuk bubungan: P→Q
*/
const KubusPrismaSVG = () => (
  <svg width="240" height="215" viewBox="0 0 240 215" className="mx-auto">
    {/* ── KUBUS (biru) ── */}
    {/* Rusuk tersembunyi */}
    <line x1="25" y1="165" x2="53" y2="145" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="53" y1="145" x2="128" y2="145" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="53" y1="145" x2="53" y2="70" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    {/* Sisi depan */}
    <polygon points="25,165 100,165 100,90 25,90" fill="#6366f1" fillOpacity="0.30" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Sisi kanan */}
    <polygon points="100,165 128,145 128,70 100,90" fill="#6366f1" fillOpacity="0.18" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Sisi atas */}
    <polygon points="25,90 100,90 128,70 53,70" fill="#6366f1" fillOpacity="0.38" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Titik-titik kubus */}
    {([[25,165],[100,165],[128,145],[53,145],[25,90],[100,90],[128,70],[53,70]] as [number,number][]).map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#818cf8"/>
    ))}
    {/* Label titik kubus (atas = alas prisma) */}
    <text x="12" y="170" fill="white" fontSize="10" fontFamily="monospace">A</text>
    <text x="103" y="170" fill="white" fontSize="10" fontFamily="monospace">B</text>
    <text x="131" y="149" fill="white" fontSize="10" fontFamily="monospace">C</text>
    <text x="39" y="149" fill="white" fontSize="10" fontFamily="monospace" opacity="0.6">D</text>
    <text x="10" y="88" fill="white" fontSize="10" fontFamily="monospace">E</text>
    <text x="103" y="88" fill="white" fontSize="10" fontFamily="monospace">F</text>
    <text x="131" y="68" fill="white" fontSize="10" fontFamily="monospace">G</text>
    <text x="39" y="68" fill="white" fontSize="10" fontFamily="monospace" opacity="0.6">H</text>

    {/* ── PRISMA SEGITIGA ATAP (kuning-amber) ── */}
    {/* P depan=(62,42), Q belakang=(90,22) */}
    {/* Sisi segitiga belakang (tersembunyi) */}
    <polygon points="53,70 128,70 90,22" fill="#f59e0b" fillOpacity="0.12" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
    {/* Lereng kiri */}
    <polygon points="25,90 53,70 90,22 62,42" fill="#f59e0b" fillOpacity="0.20" stroke="#f59e0b" strokeWidth="1.3"/>
    {/* Lereng kanan */}
    <polygon points="100,90 128,70 90,22 62,42" fill="#f59e0b" fillOpacity="0.28" stroke="#f59e0b" strokeWidth="1.5"/>
    {/* Sisi segitiga depan */}
    <polygon points="25,90 100,90 62,42" fill="#f59e0b" fillOpacity="0.38" stroke="#f59e0b" strokeWidth="1.8"/>
    {/* Rusuk bubungan P→Q */}
    <line x1="62" y1="42" x2="90" y2="22" stroke="#fcd34d" strokeWidth="2"/>
    {/* Titik puncak */}
    <circle cx="62" cy="42" r="3" fill="#fcd34d"/>
    <circle cx="90" cy="22" r="3" fill="#fcd34d"/>
    <text x="50" y="40" fill="#fcd34d" fontSize="10" fontFamily="monospace" fontWeight="bold">P</text>
    <text x="93" y="20" fill="#fcd34d" fontSize="10" fontFamily="monospace" fontWeight="bold">Q</text>

    {/* ── Label dimensi ── */}
    <text x="62" y="188" fill="#818cf8" fontSize="10" textAnchor="middle">s</text>
    <line x1="25" y1="182" x2="100" y2="182" stroke="#818cf8" strokeWidth="0.8" strokeOpacity="0.5"/>
    <text x="155" y="120" fill="#818cf8" fontSize="10" textAnchor="middle">s</text>
    <text x="120" y="208" fill="#818cf8" fontSize="8" textAnchor="middle">Kubus + Prisma Segitiga (Rumah)</text>
  </svg>
);

/* ── SVG: Dua Balok Gabungan (Anak Tangga / L-shape) ──
   Balok 1 (biru, bawah-kiri):  A–H, depth (+22,-16)
     A(15,175) B(100,175) C(122,159) D(37,159)  ← alas
     E(15,118) F(100,118) G(122,102) H(37,102)  ← atas
   Balok 2 (merah, atas-kanan): I–P, depth (+22,-16)
     I=F(100,118) J(185,118) K(207,102) L=G(122,102)  ← alas
     M(100,63)  N(185,63)  O(207,47)  P(122,47)       ← atas
*/
const DuaBalokSVG = () => (
  <svg width="260" height="215" viewBox="0 0 260 215" className="mx-auto">
    {/* ── BALOK 1 (biru) ── */}
    <line x1="15" y1="175" x2="37" y2="159" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="37" y1="159" x2="122" y2="159" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="37" y1="159" x2="37" y2="102" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <polygon points="15,175 100,175 100,118 15,118" fill="#6366f1" fillOpacity="0.35" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="100,175 122,159 122,102 100,118" fill="#6366f1" fillOpacity="0.20" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="15,118 100,118 122,102 37,102" fill="#6366f1" fillOpacity="0.38" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Titik balok 1 */}
    {([[15,175],[100,175],[122,159],[37,159],[15,118],[100,118],[122,102],[37,102]] as [number,number][]).map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#818cf8"/>
    ))}
    <text x="3" y="180" fill="white" fontSize="9" fontFamily="monospace">A</text>
    <text x="103" y="180" fill="white" fontSize="9" fontFamily="monospace">B</text>
    <text x="125" y="163" fill="white" fontSize="9" fontFamily="monospace">C</text>
    <text x="24" y="163" fill="white" fontSize="9" fontFamily="monospace" opacity="0.6">D</text>
    <text x="3" y="116" fill="white" fontSize="9" fontFamily="monospace">E</text>
    <text x="87" y="115" fill="white" fontSize="9" fontFamily="monospace">F</text>
    <text x="125" y="100" fill="white" fontSize="9" fontFamily="monospace">G</text>
    <text x="24" y="100" fill="white" fontSize="9" fontFamily="monospace" opacity="0.6">H</text>

    {/* ── BALOK 2 (merah muda, duduk di atas-kanan) ── */}
    {/* Rusuk tersembunyi balok 2 */}
    <line x1="100" y1="118" x2="122" y2="102" stroke="#fb7185" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="122" y1="102" x2="207" y2="102" stroke="#fb7185" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="122" y1="102" x2="122" y2="47" stroke="#fb7185" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    {/* Sisi depan */}
    <polygon points="100,118 185,118 185,63 100,63" fill="#f43f5e" fillOpacity="0.32" stroke="#fb7185" strokeWidth="1.5"/>
    {/* Sisi kanan */}
    <polygon points="185,118 207,102 207,47 185,63" fill="#f43f5e" fillOpacity="0.18" stroke="#fb7185" strokeWidth="1.5"/>
    {/* Sisi atas */}
    <polygon points="100,63 185,63 207,47 122,47" fill="#f43f5e" fillOpacity="0.38" stroke="#fb7185" strokeWidth="1.5"/>
    {/* Titik balok 2 */}
    {([[185,118],[207,102],[100,63],[185,63],[207,47],[122,47]] as [number,number][]).map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#fb7185"/>
    ))}
    <text x="188" y="123" fill="#ffb3c1" fontSize="9" fontFamily="monospace">J</text>
    <text x="210" y="106" fill="#ffb3c1" fontSize="9" fontFamily="monospace">K</text>
    <text x="87" y="61" fill="#ffb3c1" fontSize="9" fontFamily="monospace">M</text>
    <text x="188" y="61" fill="#ffb3c1" fontSize="9" fontFamily="monospace">N</text>
    <text x="210" y="45" fill="#ffb3c1" fontSize="9" fontFamily="monospace">O</text>
    <text x="110" y="45" fill="#ffb3c1" fontSize="9" fontFamily="monospace">P</text>

    {/* Label dimensi Balok 1 */}
    <text x="57" y="195" fill="#818cf8" fontSize="9" textAnchor="middle">p₁</text>
    <line x1="15" y1="190" x2="100" y2="190" stroke="#818cf8" strokeWidth="0.8" strokeOpacity="0.5"/>
    <text x="3" y="150" fill="#818cf8" fontSize="9" textAnchor="middle">t₁</text>
    {/* Label dimensi Balok 2 */}
    <text x="142" y="138" fill="#fb7185" fontSize="9" textAnchor="middle">p₂</text>
    <line x1="100" y1="133" x2="185" y2="133" stroke="#fb7185" strokeWidth="0.8" strokeOpacity="0.5"/>
    <text x="237" y="85" fill="#fb7185" fontSize="9" textAnchor="middle">t₂</text>

    <text x="130" y="208" fill="#818cf8" fontSize="8" textAnchor="middle">Gabungan 2 Balok (Undakan)</text>
  </svg>
);

/* ── SVG: Balok + Limas (untuk soal luas permukaan) ──
   Balok: (20,165)–(155,165)–(183,145)–(48,145) alas
          (20,95)–(155,95)–(183,75)–(48,75)  atas
   Limas: apex T(101,30) di atas titik tengah alas limas
*/
const BalokLubanglSVG = () => (
  <svg width="260" height="215" viewBox="0 0 260 215" className="mx-auto">
    {/* ── BALOK (biru) ── */}
    <line x1="20" y1="165" x2="48" y2="145" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="48" y1="145" x2="183" y2="145" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="48" y1="145" x2="48" y2="75" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <polygon points="20,165 155,165 155,95 20,95" fill="#6366f1" fillOpacity="0.30" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="155,165 183,145 183,75 155,95" fill="#6366f1" fillOpacity="0.18" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="20,95 155,95 183,75 48,75" fill="#6366f1" fillOpacity="0.38" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Titik-titik balok */}
    {([[20,165],[155,165],[183,145],[48,145],[20,95],[155,95],[183,75],[48,75]] as [number,number][]).map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#818cf8"/>
    ))}
    <text x="7" y="170" fill="white" fontSize="10" fontFamily="monospace">A</text>
    <text x="158" y="170" fill="white" fontSize="10" fontFamily="monospace">B</text>
    <text x="186" y="149" fill="white" fontSize="10" fontFamily="monospace">C</text>
    <text x="34" y="149" fill="white" fontSize="10" fontFamily="monospace" opacity="0.6">D</text>
    <text x="5" y="93" fill="white" fontSize="10" fontFamily="monospace">E</text>
    <text x="158" y="93" fill="white" fontSize="10" fontFamily="monospace">F</text>
    <text x="186" y="73" fill="white" fontSize="10" fontFamily="monospace">G</text>
    <text x="34" y="73" fill="white" fontSize="10" fontFamily="monospace" opacity="0.6">H</text>

    {/* ── LIMAS (merah) ── */}
    <line x1="101" y1="30" x2="48" y2="75" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="5,3" strokeOpacity="0.65"/>
    <polygon points="48,75 20,95 101,30" fill="#f43f5e" fillOpacity="0.12" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,3"/>
    <polygon points="48,75 183,75 101,30" fill="#f43f5e" fillOpacity="0.15" stroke="#f43f5e" strokeWidth="1.3"/>
    <polygon points="155,95 183,75 101,30" fill="#f43f5e" fillOpacity="0.22" stroke="#f43f5e" strokeWidth="1.5"/>
    <polygon points="20,95 155,95 101,30" fill="#f43f5e" fillOpacity="0.30" stroke="#f43f5e" strokeWidth="1.8"/>
    <circle cx="101" cy="30" r="3.5" fill="#fb7185"/>
    <text x="95" y="21" fill="#fb7185" fontSize="11" fontFamily="monospace" fontWeight="bold">T</text>

    {/* Label dimensi */}
    <text x="87" y="185" fill="#818cf8" fontSize="10" textAnchor="middle">p</text>
    <line x1="20" y1="180" x2="155" y2="180" stroke="#818cf8" strokeWidth="0.8" strokeOpacity="0.5"/>
    <text x="210" y="120" fill="#818cf8" fontSize="10" textAnchor="middle">l</text>
    <text x="5" y="132" fill="#818cf8" fontSize="10" textAnchor="middle">t₁</text>
    <text x="235" y="55" fill="#fb7185" fontSize="10" textAnchor="middle">t₂</text>
    <line x1="101" y1="30" x2="101" y2="85" stroke="#fb7185" strokeWidth="0.8" strokeOpacity="0.45" strokeDasharray="3,2"/>

    <text x="130" y="208" fill="#818cf8" fontSize="8" textAnchor="middle">Balok + Limas Segiempat</text>
  </svg>
);

/* ── SVG: Balok + Prisma Segitiga Atap ──
   Balok: (15,165)–(145,165)–(172,146)–(42,146) alas
          (15,105)–(145,105)–(172,86)–(42,86)  atas
   Prisma atap: P depan=(80,50), Q belakang=(107,31)
   Rusuk bubungan: P(80,50)→Q(107,31)
*/
const PrismaBalokSVG = () => (
  <svg width="260" height="215" viewBox="0 0 260 215" className="mx-auto">
    {/* ── BALOK (biru) ── */}
    <line x1="15" y1="165" x2="42" y2="146" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="42" y1="146" x2="172" y2="146" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="42" y1="146" x2="42" y2="86" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <polygon points="15,165 145,165 145,105 15,105" fill="#6366f1" fillOpacity="0.30" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="145,165 172,146 172,86 145,105" fill="#6366f1" fillOpacity="0.18" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="15,105 145,105 172,86 42,86" fill="#6366f1" fillOpacity="0.38" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Titik-titik balok */}
    {([[15,165],[145,165],[172,146],[42,146],[15,105],[145,105],[172,86],[42,86]] as [number,number][]).map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#818cf8"/>
    ))}
    <text x="2" y="170" fill="white" fontSize="10" fontFamily="monospace">A</text>
    <text x="148" y="170" fill="white" fontSize="10" fontFamily="monospace">B</text>
    <text x="175" y="150" fill="white" fontSize="10" fontFamily="monospace">C</text>
    <text x="28" y="150" fill="white" fontSize="10" fontFamily="monospace" opacity="0.6">D</text>
    <text x="1" y="103" fill="white" fontSize="10" fontFamily="monospace">E</text>
    <text x="148" y="103" fill="white" fontSize="10" fontFamily="monospace">F</text>
    <text x="175" y="84" fill="white" fontSize="10" fontFamily="monospace">G</text>
    <text x="28" y="84" fill="white" fontSize="10" fontFamily="monospace" opacity="0.6">H</text>

    {/* ── PRISMA SEGITIGA ATAP (amber) ── */}
    {/* P depan=(80,50), Q belakang=(107,31) */}
    {/* Sisi segitiga belakang (tersembunyi) */}
    <polygon points="42,86 172,86 107,31" fill="#f59e0b" fillOpacity="0.12" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3"/>
    {/* Lereng kiri */}
    <polygon points="15,105 42,86 107,31 80,50" fill="#f59e0b" fillOpacity="0.20" stroke="#f59e0b" strokeWidth="1.3"/>
    {/* Lereng kanan */}
    <polygon points="145,105 172,86 107,31 80,50" fill="#f59e0b" fillOpacity="0.28" stroke="#f59e0b" strokeWidth="1.5"/>
    {/* Sisi segitiga depan */}
    <polygon points="15,105 145,105 80,50" fill="#f59e0b" fillOpacity="0.38" stroke="#f59e0b" strokeWidth="1.8"/>
    {/* Rusuk bubungan */}
    <line x1="80" y1="50" x2="107" y2="31" stroke="#fcd34d" strokeWidth="2"/>
    {/* Titik puncak */}
    <circle cx="80" cy="50" r="3" fill="#fcd34d"/>
    <circle cx="107" cy="31" r="3" fill="#fcd34d"/>
    <text x="66" y="48" fill="#fcd34d" fontSize="10" fontFamily="monospace" fontWeight="bold">P</text>
    <text x="110" y="29" fill="#fcd34d" fontSize="10" fontFamily="monospace" fontWeight="bold">Q</text>

    {/* Label dimensi */}
    <text x="80" y="186" fill="#818cf8" fontSize="10" textAnchor="middle">p</text>
    <line x1="15" y1="181" x2="145" y2="181" stroke="#818cf8" strokeWidth="0.8" strokeOpacity="0.5"/>
    <text x="200" y="135" fill="#818cf8" fontSize="10" textAnchor="middle">l</text>
    <text x="0" y="135" fill="#818cf8" fontSize="10" textAnchor="middle">t₁</text>
    <text x="140" y="80" fill="#f59e0b" fontSize="10" textAnchor="middle">t₂</text>

    <text x="130" y="208" fill="#818cf8" fontSize="8" textAnchor="middle">Balok + Prisma Segitiga</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Konsep Bangun Ruang Gabungan", {
    type: "mixed",
    content: "Bangun ruang gabungan adalah bangun ruang yang terdiri dari dua atau lebih bangun ruang yang digabungkan.",
    parts: [
      { label: "a.", text: "Apa rumus volume bangun ruang gabungan?" },
      { label: "b.", math: "V_{gabungan} = V_1 + V_2 + \\ldots + V_n" },
      { label: "c.", text: "Bagaimana cara menghitung luas permukaan bangun gabungan? Apakah sama dengan menjumlahkan semua luas permukaan bagiannya?" },
    ],
  }),
  Qn(2, "Volume Balok + Limas di Atas", {
    type: "mixed",
    content: "Perhatikan bangun ruang gabungan berikut: balok di bawah dan limas segiempat di atasnya dengan alas yang sama.",
    diagram: <BalokLimasSVG p="10" l="8" tb="6" tl="4" />,
    parts: [
      { label: "a.", math: "\\text{Volume balok: } V_B = 10 \\times 8 \\times 6 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume limas: } V_L = \\frac{1}{3} \\times 10 \\times 8 \\times 4 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Volume total} = V_B + V_L" },
    ],
  }),
  Qn(3, "Luas Permukaan Balok + Limas di Atas", {
    type: "mixed",
    content: "Bangun gabungan balok (10×8×6 cm) dan limas segiempat (alas sama, tinggi 4 cm, apotema 5 cm) di atas balok.",
    diagram: <BalokLubanglSVG />,
    parts: [
      { label: "a.", text: "Identifikasi bidang mana yang tidak dihitung (bidang alas limas = atap balok)." },
      { label: "b.", math: "\\text{Luas permukaan balok (tanpa tutup atas): } 2(pl + pt + lt) - pl" },
      { label: "c.", math: "\\text{Tambah luas selimut limas: } 4 \\times \\frac{1}{2} \\times 10 \\times 5 = \\ldots" },
    ],
  }),
  Qn(4, "Volume Kubus + Prisma Segitiga di Atas (Rumah)", {
    type: "mixed",
    content: "Sebuah miniatur rumah berbentuk kubus (s = 6 cm) dengan atap prisma segitiga sama kaki (alas 6 cm, tinggi segitiga 4 cm, panjang atap 6 cm).",
    diagram: <KubusPrismaSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume kubus: } V = 6^3 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume prisma atap: } V = \\frac{1}{2} \\times 6 \\times 4 \\times 6 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Volume total miniatur rumah}" },
    ],
  }),
  Qn(5, "Volume Dua Balok Gabungan (Tangga/Undakan)", {
    type: "mixed",
    content: "Bangun berbentuk undakan terdiri dari dua balok: Balok 1 (bawah): 10×6×4 cm. Balok 2 (atas): 6×6×3 cm.",
    diagram: <DuaBalokSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume Balok 1: } V_1 = 10 \\times 6 \\times 4 = \\ldots" },
      { label: "b.", math: "\\text{Volume Balok 2: } V_2 = 6 \\times 6 \\times 3 = \\ldots" },
      { label: "c.", math: "\\text{Volume total} = V_1 + V_2" },
    ],
  }),
  Qn(6, "Soal UN – Rumah dengan Atap Prisma", {
    type: "mixed",
    content: "Rumah boneka berbentuk balok (12×8×10 cm) dengan atap prisma segitiga sama kaki (alas 12 cm, tinggi atap 6 cm).",
    diagram: <PrismaBalokSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume balok} = 12 \\times 8 \\times 10 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Luas alas segitiga atap} = \\frac{1}{2} \\times 12 \\times 6 = \\ldots" },
      { label: "c.", math: "\\text{Volume prisma atap} = L_{\\triangle} \\times \\text{panjang}(8 \\text{ cm})" },
    ],
  }),
  Qn(7, "Soal ANBK – Volume Tugu Berbentuk Balok + Limas", {
    type: "mixed",
    content: "Sebuah tugu kota berbentuk balok (5×5×8 m) dengan limas segiempat beraturan di atasnya (alas 5×5 m, tinggi 3 m).",
    diagram: <BalokLimasSVG p="5m" l="5m" tb="8m" tl="3m" />,
    parts: [
      { label: "a.", math: "\\text{Volume balok} = 5 \\times 5 \\times 8 = \\ldots \\text{ m}^3" },
      { label: "b.", math: "\\text{Volume limas} = \\frac{1}{3} \\times 25 \\times 3 = \\ldots \\text{ m}^3" },
      { label: "c.", math: "\\text{Volume total tugu}" },
    ],
  }),
  Qn(8, "Soal TKA – Souvenir Berbentuk Kubus + Limas", {
    type: "mixed",
    content: "Souvenir berbentuk kubus (s = 4 cm) dengan limas di atas (tinggi 3 cm). Volume souvenir tersebut adalah...",
    parts: [
      { label: "a.", math: "\\text{Volume kubus} = 4^3 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume limas} = \\frac{1}{3} \\times 16 \\times 3 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Volume souvenir} = V_{kubus} + V_{limas}" },
    ],
  }),
  Qn(9, "Soal UN – Luas Permukaan Rumah Miniatur", {
    type: "mixed",
    content: "Rumah miniatur terdiri dari balok (10×8×6 cm) dan prisma segitiga di atas (tinggi segitiga 4 cm, panjang 8 cm). Hitung luas permukaan yang terlihat.",
    diagram: <PrismaBalokSVG />,
    parts: [
      { label: "a.", text: "Sebutkan bidang-bidang yang terlihat dari luar (alas balok, 4 sisi balok, 2 segitiga atap, 2 sisi miring atap)." },
      { label: "b.", math: "\\text{Luas sisi miring atap: apotema} = \\sqrt{4^2 + 5^2} = \\ldots" },
      { label: "c.", text: "Jumlahkan semua luas bidang yang terlihat." },
    ],
  }),
  Qn(10, "Soal ANBK – Kandang Hewan Berbentuk Gabungan", {
    type: "mixed",
    content: "Kandang berbentuk balok (60×40×30 cm) dengan atap prisma segitiga (tinggi 20 cm). Berapa volume kandang tersebut?",
    parts: [
      { label: "a.", math: "\\text{Volume balok} = 60 \\times 40 \\times 30 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume prisma atap} = \\frac{1}{2} \\times 40 \\times 20 \\times 60 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Volume total kandang}" },
    ],
  }),
  Qn(11, "Mencari Volume Gabungan dari Informasi Parsial", {
    type: "mixed",
    content: "Bangun gabungan terdiri dari balok dan limas. Volume balok = 480 cm³, volume limas = 1/3 dari volume balok.",
    parts: [
      { label: "a.", math: "\\text{Volume limas} = \\frac{1}{3} \\times 480 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume total} = 480 + V_{limas}" },
      { label: "c.", text: "Jika tinggi balok 8 cm dan alas persegi, tentukan panjang sisi alas." },
    ],
  }),
  Qn(12, "Soal UN – Volume Bangunan L-Shape (Dua Balok)", {
    type: "mixed",
    content: "Sebuah gedung berbentuk dua balok yang disambung: Balok A (20×15×10 m) dan Balok B (10×10×6 m) ditempatkan di atas sudut Balok A.",
    diagram: <DuaBalokSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume Balok A} = 20 \\times 15 \\times 10 = \\ldots \\text{ m}^3" },
      { label: "b.", math: "\\text{Volume Balok B} = 10 \\times 10 \\times 6 = \\ldots \\text{ m}^3" },
      { label: "c.", math: "\\text{Volume total gedung}" },
    ],
  }),
  Qn(13, "Soal Kontekstual – Akuarium Berlapis", {
    type: "mixed",
    content: "Sebuah akuarium berbentuk balok (60×30×40 cm) memiliki bagian dekorasi berbentuk limas segiempat kecil (alas 10×10 cm, tinggi 8 cm) di dalam yang tidak diisi air.",
    parts: [
      { label: "a.", math: "\\text{Volume total akuarium} = 60 \\times 30 \\times 40 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume dekorasi limas} = \\frac{1}{3} \\times 100 \\times 8 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Volume air yang bisa diisi} = V_{akuarium} - V_{dekorasi}" },
    ],
  }),
  Qn(14, "Soal TKA – Pondasi Tiang Berbentuk Gabungan", {
    type: "mixed",
    content: "Pondasi tiang berbentuk balok (30×30×20 cm) di bawah dan limas terbalik (alas 30×30 cm, tinggi 15 cm) di bawahnya (ditanam ke tanah).",
    parts: [
      { label: "a.", math: "\\text{Volume balok} = 30 \\times 30 \\times 20 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume limas terbalik} = \\frac{1}{3} \\times 900 \\times 15 = \\ldots \\text{ cm}^3" },
      { label: "c.", text: "Hitung total volume beton yang dibutuhkan per pondasi." },
    ],
  }),
  Qn(15, "Soal UN – Bak Air Berbentuk Prisma + Balok", {
    type: "mixed",
    content: "Sebuah bak air terdiri dari bagian bawah balok (50×40×30 cm) dan bagian atas berbentuk prisma segitiga (alas segitiga 40 cm, tinggi 20 cm, panjang 50 cm).",
    parts: [
      { label: "a.", math: "\\text{Volume bagian balok} = 50 \\times 40 \\times 30 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume bagian prisma} = \\frac{1}{2} \\times 40 \\times 20 \\times 50 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Kapasitas total bak (dalam liter)}, 1L = 1000 \\text{ cm}^3" },
    ],
  }),
  Qn(16, "Soal ANBK – Pengecatan Rumah Miniatur", {
    type: "mixed",
    content: "Rumah miniatur: badan kubus (s = 10 cm) dan atap prisma segitiga (alas 10 cm, tinggi 6 cm). Seluruh permukaan luar (kecuali alas) akan dicat.",
    diagram: <KubusPrismaSVG />,
    parts: [
      { label: "a.", text: "Hitung luas 4 sisi kubus + 2 segitiga atap + 2 sisi miring atap." },
      { label: "b.", math: "\\text{Sisi miring atap: apotema} = \\sqrt{6^2 + 5^2} = \\ldots \\text{ cm}" },
      { label: "c.", math: "\\text{Jika cat Rp 5000/cm}^2\\text{, berapa biaya total?}" },
    ],
  }),
  Qn(17, "Soal UN Variasi – Limas Terpancung (Frustum)", {
    type: "mixed",
    content: "Limas terpancung dibentuk dari limas besar (alas 12×12 cm, tinggi 9 cm) dikurangi limas kecil (alas 4×4 cm, tinggi 3 cm).",
    parts: [
      { label: "a.", math: "\\text{Volume limas besar} = \\frac{1}{3} \\times 144 \\times 9 = \\ldots" },
      { label: "b.", math: "\\text{Volume limas kecil} = \\frac{1}{3} \\times 16 \\times 3 = \\ldots" },
      { label: "c.", math: "\\text{Volume frustum} = V_{besar} - V_{kecil}" },
    ],
  }),
  Qn(18, "Soal ANBK – Menghitung Selisih Volume", {
    type: "mixed",
    content: "Sebuah kubus berrusuk 12 cm dilubangi dengan limas segiempat (alas 6×6 cm, tinggi 10 cm) yang masuk dari atas.",
    parts: [
      { label: "a.", math: "\\text{Volume kubus} = 12^3 = \\ldots" },
      { label: "b.", math: "\\text{Volume limas lubang} = \\frac{1}{3} \\times 36 \\times 10 = \\ldots" },
      { label: "c.", math: "\\text{Volume sisa} = V_{kubus} - V_{limas}" },
    ],
  }),
  Qn(19, "Soal TKA – Kotak Perhiasan Berbentuk Gabungan", {
    type: "mixed",
    content: "Kotak perhiasan berbentuk balok (15×10×8 cm) dengan tutup berbentuk prisma segitiga (tinggi 5 cm, panjang 10 cm).",
    parts: [
      { label: "a.", text: "Hitung volume total kotak (balok + prisma tutup)." },
      { label: "b.", math: "\\text{Luas alas segitiga tutup} = \\frac{1}{2} \\times 15 \\times 5 = \\ldots \\text{ cm}^2" },
      { label: "c.", text: "Hitung luas permukaan total kotak perhiasan (alas balok, 4 sisi balok, 2 segitiga tutup, 2 sisi miring tutup, tanpa sambungan)." },
    ],
  }),
  Qn(20, "Soal UN – Bangunan Bertingkat (3 Balok)", {
    type: "mixed",
    content: "Menara mainan terdiri dari 3 balok yang bertumpuk:\n• Balok 1 (bawah): 9×9×6 cm\n• Balok 2 (tengah): 6×6×5 cm\n• Balok 3 (atas): 3×3×4 cm",
    parts: [
      { label: "a.", math: "\\text{Volume total} = V_1 + V_2 + V_3" },
      { label: "b.", math: "V_1 = 9 \\times 9 \\times 6, \\quad V_2 = 6 \\times 6 \\times 5, \\quad V_3 = 3 \\times 3 \\times 4" },
      { label: "c.", text: "Hitung luas permukaan yang terekspos ke luar (termasuk bagian atas setiap balok yang tidak tertutup balok di atasnya)." },
    ],
  }),
  Qn(21, "Soal ANBK – Candi Berbentuk Gabungan", {
    type: "mixed",
    content: "Replika candi terdiri dari balok bawah (20×20×15 cm) dan limas segiempat di atas (alas 20×20 cm, tinggi 12 cm).",
    diagram: <BalokLimasSVG p="20" l="20" tb="15" tl="12" />,
    parts: [
      { label: "a.", text: "Hitung volume seluruh replika." },
      { label: "b.", math: "\\text{Hitung apotema limas: } l = \\sqrt{12^2 + 10^2} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Hitung luas permukaan replika (kecuali alas) yang perlu dicat." },
    ],
  }),
  Qn(22, "Soal UN – Mencari Dimensi dari Volume Gabungan", {
    type: "mixed",
    content: "Bangun gabungan balok + limas memiliki volume total 640 cm³. Balok berukuran 8×8×8 cm. Alas limas sama dengan alas balok.",
    parts: [
      { label: "a.", math: "\\text{Volume balok} = 8^3 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume limas} = 640 - 512 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\frac{1}{3} \\times 64 \\times t = 128 \\Rightarrow t = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(23, "Soal TKA – Lapisan Cokelat pada Souvenir", {
    type: "mixed",
    content: "Souvenir berbentuk kubus (s = 5 cm) + limas (tinggi 4 cm) akan dilapisi cokelat setebal 2 mm (diabaikan dalam perhitungan). Berapa volume souvenir?",
    parts: [
      { label: "a.", math: "\\text{Volume kubus} = 5^3 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume limas} = \\frac{1}{3} \\times 25 \\times 4 = \\ldots \\text{ cm}^3" },
      { label: "c.", text: "Hitung volume total dan apotema limas." },
    ],
  }),
  Qn(24, "Soal Olimpiade – Volume Piramida Bertingkat", {
    type: "mixed",
    content: "Piramida bertingkat: limas besar (alas 12×12 cm, tinggi 4 cm) di bawah + limas kecil (alas 8×8 cm, tinggi 3 cm) + limas terkecil (alas 4×4 cm, tinggi 2 cm) di atas.",
    parts: [
      { label: "a.", math: "V_1 = \\frac{1}{3} \\times 144 \\times 4 = \\ldots" },
      { label: "b.", math: "V_2 = \\frac{1}{3} \\times 64 \\times 3 = \\ldots \\quad V_3 = \\frac{1}{3} \\times 16 \\times 2 = \\ldots" },
      { label: "c.", math: "\\text{Volume total} = V_1 + V_2 + V_3" },
    ],
  }),
  Qn(25, "Soal ANBK – Menghitung Biaya Bahan Bangunan", {
    type: "mixed",
    content: "Sebuah kolam ikan berbentuk dua balok yang disambung: Kolam utama (200×100×60 cm) dan cerukan kecil (50×50×40 cm) di salah satu sudut.",
    parts: [
      { label: "a.", math: "\\text{Volume total kolam} = V_{utama} + V_{cerukan}" },
      { label: "b.", math: "\\text{Konversikan ke liter}" },
      { label: "c.", text: "Berapa lama mengisi kolam jika debit air 10 liter/menit?" },
    ],
  }),
  Qn(26, "Soal UN – Luas Permukaan Gabungan Balok + Limas", {
    type: "mixed",
    content: "Sebuah bangun gabungan: balok (6×6×4 cm) dengan limas segiempat beraturan di atasnya (tinggi 3 cm, apotema 4,24 cm).",
    diagram: <BalokLubanglSVG />,
    parts: [
      { label: "a.", math: "\\text{Luas permukaan balok (tanpa tutup atas)} = 2(6 \\times 4) \\times 2 + 6 \\times 6 = \\ldots" },
      { label: "b.", math: "\\text{Luas 4 sisi tegak limas} = 4 \\times \\frac{1}{2} \\times 6 \\times 4{,}24 = \\ldots" },
      { label: "c.", math: "\\text{Luas permukaan total}" },
    ],
  }),
  Qn(27, "Soal TKA – Bentuk Pemotong Kue (Cookie Cutter)", {
    type: "mixed",
    content: "Cetakan kue: prisma segitiga (alas segitiga siku-siku 3-4-5 cm, tinggi 2 cm) + balok di bawah (10×8×2 cm). Hitung volume cetakan.",
    diagram: <PrismaBalokSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume balok} = 10 \\times 8 \\times 2 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume prisma} = \\frac{1}{2} \\times 3 \\times 4 \\times 2 = \\ldots \\text{ cm}^3" },
      { label: "c.", text: "Hitung total volume bahan yang digunakan untuk membuat cetakan tersebut." },
    ],
  }),
  Qn(28, "Soal Olimpiade – Perbandingan Volume Komponen", {
    type: "mixed",
    content: "Balok (12×9×8 cm) ditempatkan limas segiempat (alas 12×9 cm, tinggi 6 cm) di atasnya.",
    diagram: <BalokLimasSVG p="12" l="9" tb="8" tl="6" />,
    parts: [
      { label: "a.", math: "V_{balok} = 12 \\times 9 \\times 8 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{limas} = \\frac{1}{3} \\times 12 \\times 9 \\times 6 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Nyatakan perbandingan } V_{limas} : V_{balok}" },
    ],
  }),
  Qn(29, "Soal ANBK – Taman Berbentuk Gabungan", {
    type: "mixed",
    content: "Taman berbentuk dua balok yang disusun seperti huruf L dengan ukuran: Balok A (8×6 m), Balok B (4×4 m). Tinggi tanah diisi 0,5 m. Hitung volume tanah yang dibutuhkan.",
    diagram: <DuaBalokSVG />,
    parts: [
      { label: "a.", math: "\\text{Luas alas taman} = (8 \\times 6) + (4 \\times 4) = \\ldots \\text{ m}^2" },
      { label: "b.", math: "\\text{Volume tanah} = \\text{Luas alas} \\times 0{,}5 \\text{ m}" },
      { label: "c.", math: "\\text{Konversikan ke m}^3 \\text{ dan hitung biaya jika tanah Rp 50.000/m}^3" },
    ],
  }),
  Qn(30, "Soal UN – Cetakan Es Lilin Berbentuk Prisma + Limas", {
    type: "mixed",
    content: "Cetakan es berbentuk prisma segitiga (panjang 10 cm, alas segitiga 3×4 cm) dengan limas segitiga di ujungnya (tinggi 3 cm).",
    parts: [
      { label: "a.", math: "\\text{Volume prisma} = \\frac{1}{2} \\times 3 \\times 4 \\times 10 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume limas ujung} = \\frac{1}{3} \\times 6 \\times 3 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Volume total es lilin}" },
    ],
  }),
  Qn(31, "Soal TKA – Bak Compost Berbentuk Gabungan", {
    type: "mixed",
    content: "Bak kompos berbentuk balok dengan alas limas terbalik yang menyambung. Bagian balok: 80×60×40 cm. Bagian limas terbalik: alas 80×60 cm, tinggi 20 cm.",
    parts: [
      { label: "a.", math: "\\text{Volume balok} = 80 \\times 60 \\times 40 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume limas terbalik} = \\frac{1}{3} \\times 4800 \\times 20 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Kapasitas total bak (dalam liter)}" },
    ],
  }),
  Qn(32, "Soal ANBK – Menara Kontrol Berbentuk 3 Bagian", {
    type: "mixed",
    content: "Menara kontrol: Balok bawah (8×8×20 m) + Balok tengah (6×6×10 m) + Limas atas (alas 6×6 m, tinggi 4 m).",
    parts: [
      { label: "a.", math: "V_{total} = V_{B1} + V_{B2} + V_{Limas}" },
      { label: "b.", math: "V_{B1} = 8^2 \\times 20, \\quad V_{B2} = 6^2 \\times 10, \\quad V_L = \\frac{1}{3} \\times 36 \\times 4" },
      { label: "c.", text: "Hitung total volume menara." },
    ],
  }),
  Qn(33, "Soal UN – Souvenir Piala Berbentuk Balok + Prisma", {
    type: "mixed",
    content: "Piala terbuat dari alas balok (8×5×3 cm) dan badan prisma segitiga (alas segitiga 8×5 cm, tinggi 15 cm).",
    diagram: <PrismaBalokSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume alas balok} = 8 \\times 5 \\times 3 = \\ldots" },
      { label: "b.", math: "\\text{Volume badan prisma} = \\frac{1}{2} \\times 8 \\times 5 \\times 15 = \\ldots" },
      { label: "c.", text: "Hitung total volume piala." },
    ],
  }),
  Qn(34, "Soal Olimpiade – Kubus dengan Limas yang Dikurangi", {
    type: "mixed",
    content: "Dari sebuah kubus berrusuk 10 cm, dipotong 4 buah limas segiempat (alas 5×5 cm, tinggi 5 cm) dari keempat sudut atasnya.",
    parts: [
      { label: "a.", math: "\\text{Volume kubus awal} = 10^3 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume 4 limas} = 4 \\times \\frac{1}{3} \\times 25 \\times 5 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Volume benda setelah dipotong} = V_{kubus} - 4V_{limas}" },
    ],
  }),
  Qn(35, "Soal ANBK – Produksi Cokelat per Cetakan", {
    type: "mixed",
    content: "Cokelat batangan: balok (12×4×2 cm) dengan 6 tonjolan berbentuk kubus kecil (s = 1 cm) di atas permukaannya.",
    parts: [
      { label: "a.", math: "\\text{Volume balok} = 12 \\times 4 \\times 2 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume 6 tonjolan} = 6 \\times 1^3 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Volume total 1 batang cokelat}" },
    ],
  }),
  Qn(36, "Soal TKA – Bangunan Bertingkat L-Shape", {
    type: "mixed",
    content: "Gedung berbentuk L: Gedung A (20×15×12 m) disambung Gedung B (10×12×8 m) di sisi kanannya.",
    diagram: <DuaBalokSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume total} = V_A + V_B" },
      { label: "b.", math: "V_A = 20 \\times 15 \\times 12, \\quad V_B = 10 \\times 12 \\times 8" },
      { label: "c.", text: "Hitung luas lantai total gedung (proyeksi dari atas / luas alas)." },
    ],
  }),
  Qn(37, "Soal UN – Mencari Tinggi Gabungan dari Volume Total", {
    type: "mixed",
    content: "Bangun gabungan balok (10×10×t₁ cm) dan limas (alas 10×10 cm, tinggi t₂ cm) memiliki volume total 1200 cm³. Diketahui t₁ = 2t₂.",
    parts: [
      { label: "a.", math: "\\text{Volume balok} = 100 t_1 = 100(2t_2) = 200t_2" },
      { label: "b.", math: "\\text{Volume limas} = \\frac{1}{3} \\times 100 \\times t_2 = \\frac{100t_2}{3}" },
      { label: "c.", math: "200t_2 + \\frac{100t_2}{3} = 1200 \\Rightarrow t_2 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(38, "Soal Olimpiade – Volume Benda Simetris", {
    type: "mixed",
    content: "Benda simetris terdiri dari 2 limas segiempat yang saling bertolak belakang (ujung bertemu) dengan alas 8×8 cm dan masing-masing tinggi 5 cm.",
    parts: [
      { label: "a.", math: "\\text{Volume 1 limas} = \\frac{1}{3} \\times 64 \\times 5 = \\ldots" },
      { label: "b.", math: "\\text{Volume total} = 2 \\times V_{limas}" },
      { label: "c.", math: "\\text{Berapa luas permukaan total benda tersebut? (8 sisi segitiga)}" },
    ],
  }),
  Qn(39, "Soal ANBK – Penalaran Volume Gabungan Tidak Beraturan", {
    type: "mixed",
    content: "Bangun gabungan: kubus (s = 6 cm) + balok (9×6×4 cm) disambung di sisi kanannya + limas (alas 6×4 cm, tinggi 3 cm) di atas balok.",
    parts: [
      { label: "a.", math: "V_{kubus} = 6^3 = \\ldots" },
      { label: "b.", math: "V_{balok} = 9 \\times 6 \\times 4 = \\ldots \\quad V_{limas} = \\frac{1}{3} \\times 24 \\times 3 = \\ldots" },
      { label: "c.", math: "\\text{Volume total gabungan}" },
    ],
  }),
  Qn(40, "Soal UN/ANBK Gabungan – Semua Konsep", {
    type: "mixed",
    content: "Bangunan berbentuk: balok (8×6×5 m) dengan limas segiempat beraturan di atasnya (alas 8×6 m, tinggi 4 m).",
    diagram: <BalokLimasSVG p="8m" l="6m" tb="5m" tl="4m" />,
    parts: [
      { label: "a.", math: "\\text{Hitung volume balok dan volume limas}" },
      { label: "b.", math: "\\text{Hitung volume total bangunan}" },
      { label: "c.", math: "\\text{Apotema limas: } l = \\sqrt{4^2 + 3^2} = \\ldots \\text{ m}" },
      { label: "d.", math: "\\text{Hitung luas permukaan bangunan (tanpa alas, tanpa sambungan balok-limas)}" },
    ],
  }),
];

const GabunganPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-indigo-500/20 border-2 border-indigo-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🏗️</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-indigo-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(129,140,248,0.7)' }}>
            BANGUN RUANG SISI DATAR GABUNGAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-4 py-2">
            <span className="text-indigo-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4">
          <p className="text-indigo-300 text-xs font-bold mb-3">📐 Prinsip Bangun Gabungan</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { name: "Volume Gabungan", math: "V = V_1 + V_2 + \\cdots + V_n" },
              { name: "Volume Kurang", math: "V = V_{besar} - V_{kecil}" },
              { name: "Luas Permukaan", math: "L = L_{terlihat,1} + L_{terlihat,2}" },
              { name: "Catatan Penting", math: "\\text{Bidang sambungan} \\Rightarrow \\text{tidak dihitung}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-indigo-300 overflow-x-auto text-xs"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
          <div className="mt-2 bg-white/5 rounded-lg px-3 py-2">
            <div className="text-white/40 text-[9px] uppercase mb-1">Contoh Bentuk Gabungan</div>
            <p className="text-white/70 text-xs">Balok+Limas · Kubus+Prisma · Dua Balok (L-shape) · Limas Terpancung · Benda Berlubang</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-indigo-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-blue-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center shrink-0">
                    <span className="text-indigo-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3 whitespace-pre-line">{q.content}</p>}
                    {q.mathContent && (
                      <div className="mb-3 bg-indigo-900/20 border border-indigo-500/20 rounded-lg px-4 py-3 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-indigo-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>
                            }
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

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar"); }}
            className="text-sm text-muted-foreground hover:text-indigo-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Bangun Ruang Sisi Datar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GabunganPage;
