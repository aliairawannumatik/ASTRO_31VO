import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { useTheme } from "@/contexts/ThemeContext";

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
    <text x="12" y="175" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">A</text>
    <text x="153" y="175" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">B</text>
    <text x="181" y="154" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">C</text>
    <text x="38" y="154" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" opacity="0.6">D</text>
    <text x="10" y="98" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">E</text>
    <text x="153" y="98" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">F</text>
    <text x="181" y="78" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">G</text>
    <text x="38" y="78" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" opacity="0.6">H</text>

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
    <text x="12" y="170" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">A</text>
    <text x="103" y="170" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">B</text>
    <text x="131" y="149" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">C</text>
    <text x="39" y="149" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" opacity="0.6">D</text>
    <text x="10" y="88" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">E</text>
    <text x="103" y="88" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">F</text>
    <text x="131" y="68" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">G</text>
    <text x="39" y="68" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" opacity="0.6">H</text>

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
    <text x="3" y="180" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">A</text>
    <text x="103" y="180" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">B</text>
    <text x="125" y="163" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">C</text>
    <text x="24" y="163" fill="var(--icon-color)" fontSize="9" fontFamily="monospace" opacity="0.6">D</text>
    <text x="3" y="116" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">E</text>
    <text x="87" y="115" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">F</text>
    <text x="125" y="100" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">G</text>
    <text x="24" y="100" fill="var(--icon-color)" fontSize="9" fontFamily="monospace" opacity="0.6">H</text>

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
    <text x="7" y="170" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">A</text>
    <text x="158" y="170" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">B</text>
    <text x="186" y="149" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">C</text>
    <text x="34" y="149" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" opacity="0.6">D</text>
    <text x="5" y="93" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">E</text>
    <text x="158" y="93" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">F</text>
    <text x="186" y="73" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">G</text>
    <text x="34" y="73" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" opacity="0.6">H</text>

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
    <text x="2" y="170" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">A</text>
    <text x="148" y="170" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">B</text>
    <text x="175" y="150" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">C</text>
    <text x="28" y="150" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" opacity="0.6">D</text>
    <text x="1" y="103" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">E</text>
    <text x="148" y="103" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">F</text>
    <text x="175" y="84" fill="var(--icon-color)" fontSize="10" fontFamily="monospace">G</text>
    <text x="28" y="84" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" opacity="0.6">H</text>

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

/* ── AkuariumSVG: Balok transparan (akuarium) + limas kecil di dalam ── */
const AkuariumSVG = () => (
  <svg width="260" height="200" viewBox="0 0 260 200" className="mx-auto">
    {/* Akuarium (balok besar, sangat transparan) */}
    <line x1="15" y1="152" x2="37" y2="137" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.4"/>
    <line x1="37" y1="137" x2="207" y2="137" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.4"/>
    <line x1="37" y1="137" x2="37" y2="72" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.4"/>
    <polygon points="15,152 185,152 185,85 15,85" fill="#6366f1" fillOpacity="0.07" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="185,152 207,137 207,70 185,85" fill="#6366f1" fillOpacity="0.04" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="15,85 185,85 207,70 37,70" fill="#6366f1" fillOpacity="0.09" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Alas akuarium */}
    <polygon points="15,152 185,152 207,137 37,137" fill="#6366f1" fillOpacity="0.12" stroke="#818cf8" strokeWidth="1"/>
    <text x="100" y="125" fill="#818cf8" fontSize="9" textAnchor="middle" fillOpacity="0.7">Akuarium 60×30×40 cm</text>
    {/* Limas kecil dekorasi di dalam (merah) */}
    <line x1="38" y1="145" x2="55" y2="135" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,2" strokeOpacity="0.7"/>
    <line x1="55" y1="135" x2="88" y2="135" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,2" strokeOpacity="0.7"/>
    <line x1="55" y1="135" x2="55" y2="112" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,2" strokeOpacity="0.6"/>
    <polygon points="38,145 72,145 88,135 55,135" fill="#f43f5e" fillOpacity="0.22" stroke="#f43f5e" strokeWidth="1.2"/>
    <polygon points="38,145 72,145 55,112" fill="#f43f5e" fillOpacity="0.35" stroke="#f43f5e" strokeWidth="1.5"/>
    <polygon points="72,145 88,135 55,112" fill="#f43f5e" fillOpacity="0.20" stroke="#f43f5e" strokeWidth="1.2"/>
    <circle cx="55" cy="112" r="2.5" fill="#fb7185"/>
    <text x="49" y="105" fill="#fb7185" fontSize="9" fontFamily="monospace">T</text>
    <text x="55" y="163" fill="#fb7185" fontSize="8" textAnchor="middle">dekorasi limas 10×10×8</text>
    <text x="130" y="192" fill="#818cf8" fontSize="8" textAnchor="middle">Balok – Volume Dekorasi Dalam</text>
  </svg>
);

/* ── LimasTerbalikSVG: Balok di atas + Limas terbalik di bawah ── */
const LimasTerbalikSVG = () => (
  <svg width="260" height="215" viewBox="0 0 260 215" className="mx-auto">
    {/* BALOK (biru, bagian atas) */}
    <line x1="35" y1="118" x2="60" y2="101" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="60" y1="101" x2="185" y2="101" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="60" y1="101" x2="60" y2="48" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <polygon points="35,118 158,118 158,62 35,62" fill="#6366f1" fillOpacity="0.30" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="158,118 183,101 183,48 158,62" fill="#6366f1" fillOpacity="0.18" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="35,62 158,62 183,48 60,48" fill="#6366f1" fillOpacity="0.38" stroke="#818cf8" strokeWidth="1.5"/>
    {([[35,118],[158,118],[183,101],[60,101],[35,62],[158,62],[183,48],[60,48]] as [number,number][]).map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2" fill="#818cf8"/>
    ))}
    <text x="23" y="122" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">A</text>
    <text x="161" y="122" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">B</text>
    <text x="186" y="105" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">C</text>
    <text x="23" y="60" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">E</text>
    <text x="161" y="60" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">F</text>
    <text x="186" y="46" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">G</text>
    <text x="8" y="92" fill="#818cf8" fontSize="9" textAnchor="middle">t₁</text>
    {/* LIMAS TERBALIK (merah, apex ke bawah) */}
    {/* Base = bottom of balok: A(35,118) B(158,118) C(183,101) D(60,101) */}
    <line x1="97" y1="185" x2="60" y2="101" stroke="#f43f5e" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.6"/>
    <line x1="97" y1="185" x2="183" y2="101" stroke="#f43f5e" strokeWidth="1.5"/>
    <polygon points="35,118 158,118 97,185" fill="#f43f5e" fillOpacity="0.28" stroke="#f43f5e" strokeWidth="1.8"/>
    <polygon points="158,118 183,101 97,185" fill="#f43f5e" fillOpacity="0.18" stroke="#f43f5e" strokeWidth="1.5"/>
    <polygon points="183,101 60,101 97,185" fill="#f43f5e" fillOpacity="0.12" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,3"/>
    <circle cx="97" cy="185" r="3.5" fill="#fb7185"/>
    <text x="91" y="198" fill="#fb7185" fontSize="10" fontFamily="monospace" fontWeight="bold">T</text>
    <text x="215" y="152" fill="#fb7185" fontSize="9" textAnchor="middle">t₂</text>
    <line x1="97" y1="118" x2="97" y2="185" stroke="#fb7185" strokeWidth="0.8" strokeDasharray="3,2" strokeOpacity="0.5"/>
    <text x="130" y="210" fill="#818cf8" fontSize="8" textAnchor="middle">Balok + Limas Terbalik</text>
  </svg>
);

/* ── LimasTerpancungSVG: Limas terpancung / Frustum ──
   Alas besar di bawah, alas kecil di atas, sisi-sisi trapesium
*/
const LimasTerpancungSVG = () => (
  <svg width="260" height="215" viewBox="0 0 260 215" className="mx-auto">
    {/* Rusuk tersembunyi (kiri & belakang) */}
    <line x1="22" y1="178" x2="57" y2="100" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.45"/>
    <line x1="45" y1="160" x2="77" y2="85" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.45"/>
    <line x1="45" y1="160" x2="178" y2="160" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.45"/>
    <line x1="77" y1="85" x2="162" y2="85" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.45"/>
    {/* Sisi depan (trapesium, biru) */}
    <polygon points="22,178 155,178 142,100 57,100" fill="#6366f1" fillOpacity="0.32" stroke="#818cf8" strokeWidth="1.8"/>
    {/* Sisi kanan (trapesium, lebih gelap) */}
    <polygon points="155,178 178,160 162,85 142,100" fill="#6366f1" fillOpacity="0.18" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Alas atas (parallelogram kecil) */}
    <polygon points="57,100 142,100 162,85 77,85" fill="#6366f1" fillOpacity="0.42" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Titik-titik alas bawah & alas atas */}
    {([[22,178],[155,178],[178,160],[45,160]] as [number,number][]).map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#818cf8"/>
    ))}
    {([[57,100],[142,100],[162,85],[77,85]] as [number,number][]).map(([x,y],i) => (
      <circle key={`t${i}`} cx={x} cy={y} r="2.5" fill="#a5b4fc"/>
    ))}
    {/* Label titik */}
    <text x="9" y="183" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">A</text>
    <text x="158" y="183" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">B</text>
    <text x="181" y="164" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">C</text>
    <text x="32" y="163" fill="var(--icon-color)" fontSize="9" fontFamily="monospace" opacity="0.6">D</text>
    <text x="44" y="98" fill="#a5b4fc" fontSize="9" fontFamily="monospace">A'</text>
    <text x="144" y="98" fill="#a5b4fc" fontSize="9" fontFamily="monospace">B'</text>
    <text x="165" y="83" fill="#a5b4fc" fontSize="9" fontFamily="monospace">C'</text>
    <text x="64" y="83" fill="#a5b4fc" fontSize="9" fontFamily="monospace" opacity="0.7">D'</text>
    {/* Label dimensi */}
    <text x="88" y="195" fill="#818cf8" fontSize="10" textAnchor="middle">a₁ (alas besar)</text>
    <text x="110" y="74" fill="#a5b4fc" fontSize="9" textAnchor="middle">a₂ (alas kecil)</text>
    <text x="2" y="142" fill="#818cf8" fontSize="9" textAnchor="middle">t</text>
    <line x1="10" y1="178" x2="10" y2="100" stroke="#818cf8" strokeWidth="0.8" strokeDasharray="3,2" strokeOpacity="0.5"/>
    <text x="130" y="208" fill="#818cf8" fontSize="8" textAnchor="middle">Limas Terpancung (Frustum)</text>
  </svg>
);

/* ── KubusBerlobangSVG: Kubus dilubangi limas dari atas ── */
const KubusBerlobangSVG = () => (
  <svg width="260" height="215" viewBox="0 0 260 215" className="mx-auto">
    {/* KUBUS (biru) */}
    <line x1="25" y1="162" x2="50" y2="144" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="50" y1="144" x2="150" y2="144" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="50" y1="144" x2="50" y2="64" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <polygon points="25,162 125,162 125,82 25,82" fill="#6366f1" fillOpacity="0.28" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="125,162 150,144 150,64 125,82" fill="#6366f1" fillOpacity="0.15" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="25,82 125,82 150,64 50,64" fill="#6366f1" fillOpacity="0.35" stroke="#818cf8" strokeWidth="1.5"/>
    {([[25,162],[125,162],[150,144],[50,144],[25,82],[125,82],[150,64],[50,64]] as [number,number][]).map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2" fill="#818cf8"/>
    ))}
    <text x="12" y="167" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">A</text>
    <text x="128" y="167" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">B</text>
    <text x="153" y="148" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">C</text>
    <text x="12" y="80" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">E</text>
    <text x="128" y="80" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">F</text>
    <text x="153" y="62" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">G</text>
    {/* LUBANG LIMAS (merah, masuk dari alas atas) */}
    {/* Opening pada sisi atas: persegi kecil di tengah sisi atas */}
    {/* Top face center ≈ (87,73). Opening corners (30% of top face size) */}
    <polygon points="65,79 110,79 125,68 80,68" fill="#1e1b4b" fillOpacity="0.7" stroke="#f43f5e" strokeWidth="1.5"/>
    {/* Garis dari sudut opening ke apex T di dalam kubus */}
    <line x1="65" y1="79" x2="88" y2="125" stroke="#f43f5e" strokeWidth="1.3"/>
    <line x1="110" y1="79" x2="88" y2="125" stroke="#f43f5e" strokeWidth="1.3"/>
    <line x1="125" y1="68" x2="88" y2="125" stroke="#f43f5e" strokeWidth="1.3"/>
    <line x1="80" y1="68" x2="88" y2="125" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.7"/>
    <circle cx="88" cy="125" r="3" fill="#fb7185"/>
    <text x="82" y="137" fill="#fb7185" fontSize="9" fontFamily="monospace">T</text>
    <text x="93" y="60" fill="#f43f5e" fontSize="8" textAnchor="middle">lubang limas</text>
    <text x="160" y="130" fill="#818cf8" fontSize="9" textAnchor="start">s = 12</text>
    <text x="130" y="208" fill="#818cf8" fontSize="8" textAnchor="middle">Kubus – Volume Lubang Limas</text>
  </svg>
);

/* ── TigaBalokSVG: 3 Balok Bertumpuk (Menara) ── */
const TigaBalokSVG = () => (
  <svg width="260" height="215" viewBox="0 0 260 215" className="mx-auto">
    {/* BALOK 1 (bawah, biru, terbesar) */}
    <line x1="20" y1="175" x2="42" y2="159" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    <line x1="42" y1="159" x2="132" y2="159" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    <line x1="42" y1="159" x2="42" y2="113" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    <polygon points="20,175 110,175 110,129 20,129" fill="#6366f1" fillOpacity="0.32" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="110,175 132,159 132,113 110,129" fill="#6366f1" fillOpacity="0.18" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="20,129 110,129 132,113 42,113" fill="#6366f1" fillOpacity="0.38" stroke="#818cf8" strokeWidth="1.5"/>
    <text x="6" y="174" fill="var(--icon-color)" fontSize="8" fontFamily="monospace">Balok 1</text>
    <text x="140" y="147" fill="#818cf8" fontSize="8">9×9×6</text>
    {/* BALOK 2 (tengah, violet) */}
    <line x1="33" y1="129" x2="49" y2="117" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <line x1="49" y1="117" x2="114" y2="117" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <line x1="49" y1="117" x2="49" y2="86" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <polygon points="33,129 98,129 98,93 33,93" fill="#7c3aed" fillOpacity="0.32" stroke="#a78bfa" strokeWidth="1.5"/>
    <polygon points="98,129 114,117 114,86 98,93" fill="#7c3aed" fillOpacity="0.18" stroke="#a78bfa" strokeWidth="1.5"/>
    <polygon points="33,93 98,93 114,86 49,86" fill="#7c3aed" fillOpacity="0.38" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="140" y="110" fill="#a78bfa" fontSize="8">6×6×5</text>
    {/* BALOK 3 (atas, pink) */}
    <line x1="46" y1="93" x2="56" y2="85" stroke="#f9a8d4" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <line x1="56" y1="85" x2="96" y2="85" stroke="#f9a8d4" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <line x1="56" y1="85" x2="56" y2="62" stroke="#f9a8d4" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <polygon points="46,93 86,93 86,65 46,65" fill="#be185d" fillOpacity="0.30" stroke="#f9a8d4" strokeWidth="1.5"/>
    <polygon points="86,93 96,85 96,62 86,65" fill="#be185d" fillOpacity="0.18" stroke="#f9a8d4" strokeWidth="1.5"/>
    <polygon points="46,65 86,65 96,62 56,62" fill="#be185d" fillOpacity="0.38" stroke="#f9a8d4" strokeWidth="1.5"/>
    <text x="140" y="78" fill="#f9a8d4" fontSize="8">3×3×4</text>
    <text x="130" y="208" fill="#818cf8" fontSize="8" textAnchor="middle">3 Balok Bertumpuk (Menara)</text>
  </svg>
);

/* ── TigaLimasSVG: Piramida Bertingkat (3 Limas Tersusun) ── */
const TigaLimasSVG = () => (
  <svg width="260" height="215" viewBox="0 0 260 215" className="mx-auto">
    {/* LIMAS 1 (terbesar, biru) — alas 12×12 */}
    {/* Rusuk tersembunyi */}
    <line x1="100" y1="140" x2="45" y2="160" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    <line x1="100" y1="140" x2="168" y2="160" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    {/* Base alas 1 */}
    <line x1="22" y1="178" x2="45" y2="160" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    <line x1="168" y1="178" x2="168" y2="160" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    <line x1="45" y1="160" x2="168" y2="160" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    {/* Visible faces limas 1 */}
    <polygon points="22,178 168,178 100,140" fill="#6366f1" fillOpacity="0.30" stroke="#818cf8" strokeWidth="1.8"/>
    <polygon points="168,178 191,160 100,140" fill="#6366f1" fillOpacity="0.18" stroke="#818cf8" strokeWidth="1.5"/>
    <text x="100" y="174" fill="#818cf8" fontSize="8" textAnchor="middle">12×12</text>

    {/* LIMAS 2 (medium, violet) — alas 8×8, apex T1=(100,140) jadi alas limas 2 */}
    <line x1="100" y1="103" x2="67" y2="118" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <line x1="100" y1="103" x2="138" y2="118" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <line x1="67" y1="118" x2="138" y2="118" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <polygon points="68,130 132,130 100,103" fill="#7c3aed" fillOpacity="0.30" stroke="#a78bfa" strokeWidth="1.8"/>
    <polygon points="132,130 152,118 100,103" fill="#7c3aed" fillOpacity="0.18" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="100" y="128" fill="#a78bfa" fontSize="8" textAnchor="middle">8×8</text>

    {/* LIMAS 3 (terkecil, pink) — alas 4×4 */}
    <line x1="100" y1="73" x2="82" y2="82" stroke="#f9a8d4" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <line x1="100" y1="73" x2="118" y2="82" stroke="#f9a8d4" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <polygon points="80,92 120,92 100,73" fill="#be185d" fillOpacity="0.30" stroke="#f9a8d4" strokeWidth="1.8"/>
    <polygon points="120,92 132,85 100,73" fill="#be185d" fillOpacity="0.18" stroke="#f9a8d4" strokeWidth="1.5"/>
    <circle cx="100" cy="73" r="3" fill="#f9a8d4"/>
    <text x="106" y="70" fill="#f9a8d4" fontSize="9" fontFamily="monospace">T₃</text>
    <text x="106" y="102" fill="#f9a8d4" fontSize="8">4×4</text>
    <text x="130" y="208" fill="#818cf8" fontSize="8" textAnchor="middle">Piramida Bertingkat (3 Limas)</text>
  </svg>
);

/* ── PrismaLimasSegitSVG: Prisma Segitiga + Limas Segitiga di ujungnya ── */
const PrismaLimasSegitSVG = () => (
  <svg width="260" height="190" viewBox="0 0 260 190" className="mx-auto">
    {/* PRISMA SEGITIGA (horizontal, biru) — berbaring ke kanan */}
    {/* Muka kiri (segitiga depan): L1(20,115) L2(20,158) L3(58,137) */}
    {/* Muka kanan (segitiga belakang): R1(150,115) R2(150,158) R3(188,137) */}
    {/* Rusuk tersembunyi */}
    <line x1="20" y1="115" x2="150" y2="115" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    {/* Sisi bawah (persegi panjang) */}
    <polygon points="20,158 150,158 188,137 58,137" fill="#6366f1" fillOpacity="0.20" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Sisi atas-kanan (persegi panjang) */}
    <polygon points="20,115 150,115 188,137 58,137" fill="#6366f1" fillOpacity="0.28" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Muka kiri (segitiga) */}
    <polygon points="20,115 20,158 58,137" fill="#6366f1" fillOpacity="0.42" stroke="#818cf8" strokeWidth="1.8"/>
    {/* Titik muka kiri */}
    {([[20,115],[20,158],[58,137]] as [number,number][]).map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#818cf8"/>
    ))}
    <text x="7" y="113" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">A</text>
    <text x="7" y="163" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">B</text>
    <text x="62" y="140" fill="var(--icon-color)" fontSize="9" fontFamily="monospace">C</text>
    {/* Titik muka kanan */}
    {([[150,115],[150,158],[188,137]] as [number,number][]).map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#818cf8"/>
    ))}
    <text x="8" y="137" fill="#818cf8" fontSize="8" textAnchor="start">3 cm</text>
    <text x="85" y="175" fill="#818cf8" fontSize="9" textAnchor="middle">panjang 10 cm</text>
    {/* LIMAS SEGITIGA di ujung kanan (merah) */}
    {/* Base = muka kanan: R1(150,115) R2(150,158) R3(188,137) */}
    {/* Apex T di sebelah kanan */}
    <line x1="228" y1="137" x2="150" y2="115" stroke="#f43f5e" strokeWidth="1.5"/>
    <line x1="228" y1="137" x2="150" y2="158" stroke="#f43f5e" strokeWidth="1.5"/>
    <line x1="228" y1="137" x2="188" y2="137" stroke="#f43f5e" strokeWidth="1.5"/>
    <polygon points="150,115 150,158 228,137" fill="#f43f5e" fillOpacity="0.30" stroke="#f43f5e" strokeWidth="1.8"/>
    <polygon points="150,115 188,137 228,137" fill="#f43f5e" fillOpacity="0.18" stroke="#f43f5e" strokeWidth="1.5"/>
    <polygon points="150,158 188,137 228,137" fill="#f43f5e" fillOpacity="0.22" stroke="#f43f5e" strokeWidth="1.5"/>
    <circle cx="228" cy="137" r="3" fill="#fb7185"/>
    <text x="232" y="140" fill="#fb7185" fontSize="9" fontFamily="monospace">T</text>
    <text x="200" y="155" fill="#fb7185" fontSize="8">tinggi 3</text>
    <text x="130" y="183" fill="#818cf8" fontSize="8" textAnchor="middle">Prisma Segitiga + Limas Segitiga</text>
  </svg>
);

/* ── TigaBalokLimasSVG: 2 Balok + Limas (Menara Kontrol) ── */
const TigaBalokLimasSVG = () => (
  <svg width="260" height="215" viewBox="0 0 260 215" className="mx-auto">
    {/* BALOK 1 (bawah, biru, besar) */}
    <line x1="22" y1="182" x2="44" y2="166" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    <line x1="44" y1="166" x2="134" y2="166" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    <line x1="44" y1="166" x2="44" y2="118" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    <polygon points="22,182 112,182 112,134 22,134" fill="#6366f1" fillOpacity="0.32" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="112,182 134,166 134,118 112,134" fill="#6366f1" fillOpacity="0.18" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="22,134 112,134 134,118 44,118" fill="#6366f1" fillOpacity="0.38" stroke="#818cf8" strokeWidth="1.5"/>
    <text x="145" y="153" fill="#818cf8" fontSize="8">8×8×20</text>
    {/* BALOK 2 (tengah, violet, lebih kecil) */}
    <line x1="35" y1="134" x2="51" y2="122" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <line x1="51" y1="122" x2="115" y2="122" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <line x1="51" y1="122" x2="51" y2="92" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <polygon points="35,134 99,134 99,102 35,102" fill="#7c3aed" fillOpacity="0.32" stroke="#a78bfa" strokeWidth="1.5"/>
    <polygon points="99,134 115,122 115,92 99,102" fill="#7c3aed" fillOpacity="0.18" stroke="#a78bfa" strokeWidth="1.5"/>
    <polygon points="35,102 99,102 115,92 51,92" fill="#7c3aed" fillOpacity="0.38" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="145" y="115" fill="#a78bfa" fontSize="8">6×6×10</text>
    {/* LIMAS (atas, merah) */}
    {/* Alas limas = atap balok 2: (35,102)(99,102)(115,92)(51,92) */}
    <line x1="67" y1="58" x2="51" y2="92" stroke="#f43f5e" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.6"/>
    <line x1="67" y1="58" x2="115" y2="92" stroke="#f43f5e" strokeWidth="1.5"/>
    <polygon points="35,102 99,102 67,58" fill="#f43f5e" fillOpacity="0.30" stroke="#f43f5e" strokeWidth="1.8"/>
    <polygon points="99,102 115,92 67,58" fill="#f43f5e" fillOpacity="0.20" stroke="#f43f5e" strokeWidth="1.5"/>
    <polygon points="115,92 51,92 67,58" fill="#f43f5e" fillOpacity="0.13" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,3"/>
    <circle cx="67" cy="58" r="3.5" fill="#fb7185"/>
    <text x="61" y="50" fill="#fb7185" fontSize="10" fontFamily="monospace" fontWeight="bold">T</text>
    <text x="145" y="78" fill="#fb7185" fontSize="8">limas 6×6×4</text>
    <text x="130" y="208" fill="#818cf8" fontSize="8" textAnchor="middle">2 Balok + Limas (Menara)</text>
  </svg>
);

/* ── KubusPotongSVG: Kubus dipotong 4 limas di sudut atas ── */
const KubusPotongSVG = () => (
  <svg width="260" height="215" viewBox="0 0 260 215" className="mx-auto">
    {/* KUBUS dasar (biru) */}
    <line x1="20" y1="163" x2="45" y2="145" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="45" y1="145" x2="148" y2="145" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <line x1="45" y1="145" x2="45" y2="63" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.55"/>
    <polygon points="20,163 123,163 123,81 20,81" fill="#6366f1" fillOpacity="0.28" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="123,163 148,145 148,63 123,81" fill="#6366f1" fillOpacity="0.15" stroke="#818cf8" strokeWidth="1.5"/>
    {/* Sisi atas dengan 4 segitiga potongan di sudut */}
    {/* Sisi atas tanpa sudut yang dipotong — gambar polygon kompleks */}
    {/* Tengah sisi atas (tanpa 4 sudut): */}
    <polygon points="20,81 123,81 148,63 45,63" fill="#6366f1" fillOpacity="0.32" stroke="#818cf8" strokeWidth="1.5"/>
    {/* 4 potongan limas di sudut atas (merah, menunjukkan bagian yang dipotong) */}
    {/* Sudut depan-kiri E(20,81) */}
    <polygon points="20,81 45,81 20,106" fill="#f43f5e" fillOpacity="0.55" stroke="#fb7185" strokeWidth="1.5"/>
    <text x="14" y="90" fill="#fb7185" fontSize="8">↗</text>
    {/* Sudut depan-kanan F(123,81) */}
    <polygon points="123,81 98,81 123,106" fill="#f43f5e" fillOpacity="0.55" stroke="#fb7185" strokeWidth="1.5"/>
    {/* Sudut belakang-kanan G(148,63) */}
    <polygon points="148,63 148,85 123,81" fill="#f43f5e" fillOpacity="0.45" stroke="#fb7185" strokeWidth="1.3"/>
    {/* Sudut belakang-kiri H(45,63) */}
    <polygon points="45,63 70,63 45,85" fill="#f43f5e" fillOpacity="0.45" stroke="#fb7185" strokeWidth="1.3"/>
    {/* Label */}
    <text x="20" y="178" fill="var(--icon-color)" fontSize="9">s = 10 cm</text>
    <text x="160" y="125" fill="#fb7185" fontSize="8">4 potongan</text>
    <text x="160" y="135" fill="#fb7185" fontSize="8">limas</text>
    <text x="130" y="208" fill="#818cf8" fontSize="8" textAnchor="middle">Kubus – 4 Limas (Dipotong di Sudut)</text>
  </svg>
);

/* ── BalokTonjolSVG: Balok + 6 tonjolan kubus kecil di atas ── */
const BalokTonjolSVG = () => (
  <svg width="260" height="200" viewBox="0 0 260 200" className="mx-auto">
    {/* BALOK UTAMA (biru, pipih = cokelat batangan) */}
    <line x1="15" y1="150" x2="37" y2="135" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    <line x1="37" y1="135" x2="222" y2="135" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    <line x1="37" y1="135" x2="37" y2="112" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    <polygon points="15,150 200,150 200,128 15,128" fill="#6366f1" fillOpacity="0.32" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="200,150 222,135 222,112 200,128" fill="#6366f1" fillOpacity="0.18" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="15,128 200,128 222,112 37,112" fill="#6366f1" fillOpacity="0.40" stroke="#818cf8" strokeWidth="1.5"/>
    <text x="107" y="143" fill="#818cf8" fontSize="8" textAnchor="middle">12×4×2 cm</text>
    {/* 6 TONJOLAN KUBUS KECIL (merah, di atas permukaan) */}
    {/* Diposisikan di atas sisi atas (top face), sepanjang sumbu x */}
    {([0,1,2,3,4,5] as number[]).map(i => {
      const bx = 25 + i * 30;
      const by = 128;
      return (
        <g key={i}>
          <polygon points={`${bx},${by} ${bx+18},${by} ${bx+18},${by-14} ${bx},${by-14}`} fill="#f43f5e" fillOpacity="0.40" stroke="#fb7185" strokeWidth="1.2"/>
          <polygon points={`${bx+18},${by} ${bx+22},${by-3} ${bx+22},${by-17} ${bx+18},${by-14}`} fill="#f43f5e" fillOpacity="0.22" stroke="#fb7185" strokeWidth="1.2"/>
          <polygon points={`${bx},${by-14} ${bx+18},${by-14} ${bx+22},${by-17} ${bx+4},${by-17}`} fill="#f43f5e" fillOpacity="0.50" stroke="#fb7185" strokeWidth="1.2"/>
        </g>
      );
    })}
    <text x="107" y="103" fill="#fb7185" fontSize="8" textAnchor="middle">6 tonjolan s=1cm</text>
    <text x="130" y="192" fill="#818cf8" fontSize="8" textAnchor="middle">Balok + 6 Tonjolan Kubus Kecil</text>
  </svg>
);

/* ── BipyramidSVG: 2 Limas Bertolak Belakang (Berlian / Bipyramid) ── */
const BipyramidSVG = () => (
  <svg width="260" height="215" viewBox="0 0 260 215" className="mx-auto">
    {/* Alas persegi (common base) di tengah */}
    {/* A(50,108) B(155,108) C(178,90) D(73,90) */}
    {/* LIMAS ATAS (biru, apex ke atas) */}
    <line x1="114" y1="38" x2="73" y2="90" stroke="#818cf8" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.6"/>
    <polygon points="73,90 50,108 114,38" fill="#6366f1" fillOpacity="0.15" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3"/>
    <polygon points="73,90 178,90 114,38" fill="#6366f1" fillOpacity="0.18" stroke="#818cf8" strokeWidth="1.3"/>
    <polygon points="50,108 155,108 114,38" fill="#6366f1" fillOpacity="0.32" stroke="#818cf8" strokeWidth="1.8"/>
    <polygon points="155,108 178,90 114,38" fill="#6366f1" fillOpacity="0.22" stroke="#818cf8" strokeWidth="1.5"/>
    <circle cx="114" cy="38" r="3.5" fill="#818cf8"/>
    <text x="108" y="30" fill="var(--icon-color)" fontSize="10" fontFamily="monospace" fontWeight="bold">T₁</text>
    {/* Alas bersama (diperlihatkan sebagai garis) */}
    {([[50,108],[155,108],[178,90],[73,90]] as [number,number][]).map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#a5b4fc"/>
    ))}
    <text x="38" y="112" fill="#a5b4fc" fontSize="9" fontFamily="monospace">A</text>
    <text x="158" y="112" fill="#a5b4fc" fontSize="9" fontFamily="monospace">B</text>
    <text x="181" y="94" fill="#a5b4fc" fontSize="9" fontFamily="monospace">C</text>
    <text x="60" y="88" fill="#a5b4fc" fontSize="9" fontFamily="monospace" opacity="0.7">D</text>
    {/* LIMAS BAWAH (merah, apex ke bawah) */}
    <line x1="114" y1="178" x2="73" y2="90" stroke="#f43f5e" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.6"/>
    <polygon points="73,90 50,108 114,178" fill="#f43f5e" fillOpacity="0.12" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,3"/>
    <polygon points="73,90 178,90 114,178" fill="#f43f5e" fillOpacity="0.15" stroke="#f43f5e" strokeWidth="1.2"/>
    <polygon points="50,108 155,108 114,178" fill="#f43f5e" fillOpacity="0.30" stroke="#f43f5e" strokeWidth="1.8"/>
    <polygon points="155,108 178,90 114,178" fill="#f43f5e" fillOpacity="0.20" stroke="#f43f5e" strokeWidth="1.5"/>
    <circle cx="114" cy="178" r="3.5" fill="#fb7185"/>
    <text x="108" y="196" fill="#fb7185" fontSize="10" fontFamily="monospace" fontWeight="bold">T₂</text>
    {/* Label dimensi */}
    <text x="103" y="112" fill="#a5b4fc" fontSize="8" textAnchor="middle">8×8 cm</text>
    <text x="200" y="73" fill="#818cf8" fontSize="8">t=5cm</text>
    <text x="200" y="128" fill="#fb7185" fontSize="8">t=5cm</text>
    <text x="130" y="208" fill="#818cf8" fontSize="8" textAnchor="middle">2 Limas Bertolak Belakang (Bipyramid)</text>
  </svg>
);

/* ── TigaBangunSVG: Kubus + Balok + Limas tersusun ── */
const TigaBangunSVG = () => (
  <svg width="260" height="215" viewBox="0 0 260 215" className="mx-auto">
    {/* KUBUS (kiri, biru, s=45) */}
    <line x1="15" y1="168" x2="33" y2="155" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <line x1="33" y1="155" x2="78" y2="155" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <line x1="33" y1="155" x2="33" y2="110" stroke="#818cf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <polygon points="15,168 60,168 60,123 15,123" fill="#6366f1" fillOpacity="0.32" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="60,168 78,155 78,110 60,123" fill="#6366f1" fillOpacity="0.18" stroke="#818cf8" strokeWidth="1.5"/>
    <polygon points="15,123 60,123 78,110 33,110" fill="#6366f1" fillOpacity="0.40" stroke="#818cf8" strokeWidth="1.5"/>
    <text x="37" y="185" fill="#818cf8" fontSize="8" textAnchor="middle">s=6</text>

    {/* BALOK (tengah, violet) — disambung di kanan kubus */}
    <line x1="60" y1="168" x2="78" y2="155" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.4"/>
    <line x1="78" y1="155" x2="152" y2="155" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
    <line x1="78" y1="155" x2="78" y2="122" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.4"/>
    <polygon points="60,168 150,168 150,135 60,135" fill="#7c3aed" fillOpacity="0.30" stroke="#a78bfa" strokeWidth="1.5"/>
    <polygon points="150,168 168,155 168,122 150,135" fill="#7c3aed" fillOpacity="0.18" stroke="#a78bfa" strokeWidth="1.5"/>
    <polygon points="60,135 150,135 168,122 78,122" fill="#7c3aed" fillOpacity="0.38" stroke="#a78bfa" strokeWidth="1.5"/>
    <text x="105" y="185" fill="#a78bfa" fontSize="8" textAnchor="middle">9×6×4</text>

    {/* LIMAS (atas balok, merah) */}
    {/* Alas limas = atap balok: (60,135)(150,135)(168,122)(78,122) */}
    <line x1="114" y1="90" x2="78" y2="122" stroke="#f43f5e" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.6"/>
    <line x1="114" y1="90" x2="168" y2="122" stroke="#f43f5e" strokeWidth="1.5"/>
    <polygon points="60,135 150,135 114,90" fill="#f43f5e" fillOpacity="0.30" stroke="#f43f5e" strokeWidth="1.8"/>
    <polygon points="150,135 168,122 114,90" fill="#f43f5e" fillOpacity="0.20" stroke="#f43f5e" strokeWidth="1.5"/>
    <polygon points="168,122 78,122 114,90" fill="#f43f5e" fillOpacity="0.12" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,3"/>
    <circle cx="114" cy="90" r="3.5" fill="#fb7185"/>
    <text x="108" y="82" fill="#fb7185" fontSize="10" fontFamily="monospace" fontWeight="bold">T</text>
    <text x="180" y="108" fill="#fb7185" fontSize="8">t=3</text>
    <text x="130" y="208" fill="#818cf8" fontSize="8" textAnchor="middle">Kubus + Balok + Limas (Gabungan 3)</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Konsep Bangun Ruang Gabungan", {
    type: "mixed",
    content: "Bangun ruang gabungan adalah bangun ruang yang terdiri dari dua atau lebih bangun ruang yang digabungkan.",
    diagram: <BalokLimasSVG p="p" l="l" tb="t₁" tl="t₂" />,
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
  Qn(5, "Soal UN – Rumah dengan Atap Prisma", {
    type: "mixed",
    content: "Rumah boneka berbentuk balok (12×8×10 cm) dengan atap prisma segitiga sama kaki (alas 12 cm, tinggi atap 6 cm).",
    diagram: <PrismaBalokSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume balok} = 12 \\times 8 \\times 10 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Luas alas segitiga atap} = \\frac{1}{2} \\times 12 \\times 6 = \\ldots" },
      { label: "c.", math: "\\text{Volume prisma atap} = L_{\\triangle} \\times \\text{panjang}(8 \\text{ cm})" },
    ],
  }),
  Qn(6, "Soal UN – Luas Permukaan Rumah Miniatur", {
    type: "mixed",
    content: "Rumah miniatur terdiri dari balok (10×8×6 cm) dan prisma segitiga di atas (tinggi segitiga 4 cm, panjang 8 cm). Hitung luas permukaan yang terlihat.",
    diagram: <PrismaBalokSVG />,
    parts: [
      { label: "a.", text: "Sebutkan bidang-bidang yang terlihat dari luar (alas balok, 4 sisi balok, 2 segitiga atap, 2 sisi miring atap)." },
      { label: "b.", math: "\\text{Luas sisi miring atap: apotema} = \\sqrt{4^2 + 5^2} = \\ldots" },
      { label: "c.", text: "Jumlahkan semua luas bidang yang terlihat." },
    ],
  }),
  Qn(7, "Soal ANBK – Kandang Hewan Berbentuk Gabungan", {
    type: "mixed",
    content: "Kandang berbentuk balok (60×40×30 cm) dengan atap prisma segitiga (tinggi 20 cm). Berapa volume kandang tersebut?",
    diagram: <PrismaBalokSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume balok} = 60 \\times 40 \\times 30 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume prisma atap} = \\frac{1}{2} \\times 40 \\times 20 \\times 60 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Volume total kandang}" },
    ],
  }),
  Qn(8, "Mencari Volume Gabungan dari Informasi Parsial", {
    type: "mixed",
    content: "Bangun gabungan terdiri dari balok dan limas. Volume balok = 480 cm³, volume limas = 1/3 dari volume balok.",
    diagram: <BalokLimasSVG p="p" l="l" tb="t₁" tl="t₂" />,
    parts: [
      { label: "a.", math: "\\text{Volume limas} = \\frac{1}{3} \\times 480 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume total} = 480 + V_{limas}" },
      { label: "c.", text: "Jika tinggi balok 8 cm dan alas persegi, tentukan panjang sisi alas." },
    ],
  }),
  Qn(9, "Soal TKA – Pondasi Tiang Berbentuk Gabungan", {
    type: "mixed",
    content: "Pondasi tiang berbentuk balok (30×30×20 cm) di bawah dan limas terbalik (alas 30×30 cm, tinggi 15 cm) di bawahnya (ditanam ke tanah).",
    diagram: <LimasTerbalikSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume balok} = 30 \\times 30 \\times 20 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume limas terbalik} = \\frac{1}{3} \\times 900 \\times 15 = \\ldots \\text{ cm}^3" },
      { label: "c.", text: "Hitung total volume beton yang dibutuhkan per pondasi." },
    ],
  }),
  Qn(10, "Soal UN – Bak Air Berbentuk Prisma + Balok", {
    type: "mixed",
    content: "Sebuah bak air terdiri dari bagian bawah balok (50×40×30 cm) dan bagian atas berbentuk prisma segitiga (alas segitiga 40 cm, tinggi 20 cm, panjang 50 cm).",
    diagram: <PrismaBalokSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume bagian balok} = 50 \\times 40 \\times 30 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume bagian prisma} = \\frac{1}{2} \\times 40 \\times 20 \\times 50 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Kapasitas total bak (dalam liter)}, 1L = 1000 \\text{ cm}^3" },
    ],
  }),
  Qn(11, "Soal ANBK – Pengecatan Rumah Miniatur", {
    type: "mixed",
    content: "Rumah miniatur: badan kubus (s = 10 cm) dan atap prisma segitiga (alas 10 cm, tinggi 6 cm). Seluruh permukaan luar (kecuali alas) akan dicat.",
    diagram: <KubusPrismaSVG />,
    parts: [
      { label: "a.", text: "Hitung luas 4 sisi kubus + 2 segitiga atap + 2 sisi miring atap." },
      { label: "b.", math: "\\text{Sisi miring atap: apotema} = \\sqrt{6^2 + 5^2} = \\ldots \\text{ cm}" },
      { label: "c.", math: "\\text{Jika cat Rp 5000/cm}^2\\text{, berapa biaya total?}" },
    ],
  }),
  Qn(12, "Soal UN Variasi – Limas Terpancung (Frustum)", {
    type: "mixed",
    content: "Limas terpancung dibentuk dari limas besar (alas 12×12 cm, tinggi 9 cm) dikurangi limas kecil (alas 4×4 cm, tinggi 3 cm).",
    diagram: <LimasTerpancungSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume limas besar} = \\frac{1}{3} \\times 144 \\times 9 = \\ldots" },
      { label: "b.", math: "\\text{Volume limas kecil} = \\frac{1}{3} \\times 16 \\times 3 = \\ldots" },
      { label: "c.", math: "\\text{Volume frustum} = V_{besar} - V_{kecil}" },
    ],
  }),
  Qn(13, "Soal ANBK – Menghitung Selisih Volume", {
    type: "mixed",
    content: "Sebuah kubus berrusuk 12 cm dilubangi dengan limas segiempat (alas 6×6 cm, tinggi 10 cm) yang masuk dari atas.",
    diagram: <KubusBerlobangSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume kubus} = 12^3 = \\ldots" },
      { label: "b.", math: "\\text{Volume limas lubang} = \\frac{1}{3} \\times 36 \\times 10 = \\ldots" },
      { label: "c.", math: "\\text{Volume sisa} = V_{kubus} - V_{limas}" },
    ],
  }),
  Qn(14, "Soal TKA – Kotak Perhiasan Berbentuk Gabungan", {
    type: "mixed",
    content: "Kotak perhiasan berbentuk balok (15×10×8 cm) dengan tutup berbentuk prisma segitiga (tinggi 5 cm, panjang 10 cm).",
    diagram: <PrismaBalokSVG />,
    parts: [
      { label: "a.", text: "Hitung volume total kotak (balok + prisma tutup)." },
      { label: "b.", math: "\\text{Luas alas segitiga tutup} = \\frac{1}{2} \\times 15 \\times 5 = \\ldots \\text{ cm}^2" },
      { label: "c.", text: "Hitung luas permukaan total kotak perhiasan (alas balok, 4 sisi balok, 2 segitiga tutup, 2 sisi miring tutup, tanpa sambungan)." },
    ],
  }),
  Qn(15, "Soal UN – Bangunan Bertingkat (3 Balok)", {
    type: "mixed",
    content: "Menara mainan terdiri dari 3 balok yang bertumpuk:\n• Balok 1 (bawah): 9×9×6 cm\n• Balok 2 (tengah): 6×6×5 cm\n• Balok 3 (atas): 3×3×4 cm",
    diagram: <TigaBalokSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume total} = V_1 + V_2 + V_3" },
      { label: "b.", math: "V_1 = 9 \\times 9 \\times 6, \\quad V_2 = 6 \\times 6 \\times 5, \\quad V_3 = 3 \\times 3 \\times 4" },
      { label: "c.", text: "Hitung luas permukaan yang terekspos ke luar (termasuk bagian atas setiap balok yang tidak tertutup balok di atasnya)." },
    ],
  }),
  Qn(16, "Soal ANBK – Candi Berbentuk Gabungan", {
    type: "mixed",
    content: "Replika candi terdiri dari balok bawah (20×20×15 cm) dan limas segiempat di atas (alas 20×20 cm, tinggi 12 cm).",
    diagram: <BalokLimasSVG p="20" l="20" tb="15" tl="12" />,
    parts: [
      { label: "a.", text: "Hitung volume seluruh replika." },
      { label: "b.", math: "\\text{Hitung apotema limas: } l = \\sqrt{12^2 + 10^2} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Hitung luas permukaan replika (kecuali alas) yang perlu dicat." },
    ],
  }),
  Qn(17, "Soal UN – Cetakan Es Lilin Berbentuk Prisma + Limas", {
    type: "mixed",
    content: "Cetakan es berbentuk prisma segitiga (panjang 10 cm, alas segitiga 3×4 cm) dengan limas segitiga di ujungnya (tinggi 3 cm).",
    diagram: <PrismaLimasSegitSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume prisma} = \\frac{1}{2} \\times 3 \\times 4 \\times 10 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume limas ujung} = \\frac{1}{3} \\times 6 \\times 3 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "\\text{Volume total es lilin}" },
    ],
  }),
  Qn(18, "Soal ANBK – Menara Kontrol Berbentuk 3 Bagian", {
    type: "mixed",
    content: "Menara kontrol: Balok bawah (8×8×20 m) + Balok tengah (6×6×10 m) + Limas atas (alas 6×6 m, tinggi 4 m).",
    diagram: <TigaBalokLimasSVG />,
    parts: [
      { label: "a.", math: "V_{total} = V_{B1} + V_{B2} + V_{Limas}" },
      { label: "b.", math: "V_{B1} = 8^2 \\times 20, \\quad V_{B2} = 6^2 \\times 10, \\quad V_L = \\frac{1}{3} \\times 36 \\times 4" },
      { label: "c.", text: "Hitung total volume menara." },
    ],
  }),
  Qn(19, "Soal Olimpiade – Volume Benda Simetris", {
    type: "mixed",
    content: "Benda simetris terdiri dari 2 limas segiempat yang saling bertolak belakang (ujung bertemu) dengan alas 8×8 cm dan masing-masing tinggi 5 cm.",
    diagram: <BipyramidSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume 1 limas} = \\frac{1}{3} \\times 64 \\times 5 = \\ldots" },
      { label: "b.", math: "\\text{Volume total} = 2 \\times V_{limas}" },
      { label: "c.", math: "\\text{Berapa luas permukaan total benda tersebut? (8 sisi segitiga)}" },
    ],
  }),
  Qn(20, "Soal ANBK – Penalaran Volume Gabungan Tidak Beraturan", {
    type: "mixed",
    content: "Bangun gabungan: kubus (s = 6 cm) + balok (9×6×4 cm) disambung di sisi kanannya + limas (alas 6×4 cm, tinggi 3 cm) di atas balok.",
    diagram: <TigaBangunSVG />,
    parts: [
      { label: "a.", math: "V_{kubus} = 6^3 = \\ldots" },
      { label: "b.", math: "V_{balok} = 9 \\times 6 \\times 4 = \\ldots \\quad V_{limas} = \\frac{1}{3} \\times 24 \\times 3 = \\ldots" },
      { label: "c.", math: "\\text{Volume total gabungan}" },
    ],
  }),
];

const GabunganPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
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
          <p className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs text-center font-body`}>Kelas 8 · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-4 py-2">
            <span className="text-indigo-400 text-xs font-bold">📋 21 {t('practice.suffixSoal')}</span>
            <span className={`${isDark ? "text-white/30" : "text-gray-400"} text-xs`}>·</span>
            <span className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs`}>UN / ANBK / TKA</span>
          </div>
        </div>

        <div className={`mb-5 ${isDark ? "bg-indigo-900/20" : "bg-indigo-50"} border border-indigo-500/20 rounded-xl p-4`}>
          <p className="text-indigo-300 text-xs font-bold mb-3">📐 Prinsip Bangun Gabungan</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { name: "Volume Gabungan", math: "V = V_1 + V_2 + \\cdots + V_n" },
              { name: "Volume Kurang", math: "V = V_{besar} - V_{kecil}" },
              { name: "Luas Permukaan", math: "L = L_{terlihat,1} + L_{terlihat,2}" },
              { name: "Catatan Penting", math: "\\text{Bidang sambungan} \\Rightarrow \\text{tidak dihitung}" },
            ].map(r => (
              <div key={r.name} className={`${isDark ? "bg-white/5" : "bg-gray-50"} rounded-lg px-3 py-2`}>
                <div className={`${isDark ? "text-white/40" : "text-gray-500"} text-[9px] uppercase mb-1`}>{r.name}</div>
                <div className="text-indigo-300 overflow-x-auto text-xs"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
          <div className={`mt-2 ${isDark ? "bg-white/5" : "bg-gray-50"} rounded-lg px-3 py-2`}>
            <div className={`${isDark ? "text-white/40" : "text-gray-500"} text-[9px] uppercase mb-1`}>Contoh Bentuk Gabungan</div>
            <p className={`${isDark ? "text-white/70" : "text-gray-600"} text-xs`}>Balok+Limas · Kubus+Prisma · Dua Balok (L-shape) · Limas Terpancung · Benda Berlubang</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? "from-indigo-900/30 via-slate-900/80 to-blue-900/30" : "from-indigo-50/60 via-white/80 to-blue-50/40"} backdrop-blur`} />
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
                    {q.content && <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"} leading-relaxed mb-3 whitespace-pre-line`}>{q.content}</p>}
                    {q.mathContent && (
                      <div className={`mb-3 ${isDark ? "bg-indigo-900/20" : "bg-indigo-50"} border border-indigo-500/20 rounded-lg px-4 py-3 flex justify-center`}>
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className={`mb-3 flex justify-center ${isDark ? "bg-white/5" : "bg-gray-50"} rounded-xl p-3`}>{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? (isDark ? 'bg-white/5' : 'bg-gray-50') : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-indigo-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
                            {p.math
                              ? <div className={`${isDark ? "text-white" : "text-gray-900"} text-sm overflow-x-auto`}><InlineMath math={p.math} /></div>
                              : <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{p.text}</p>
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
            {t('practice.backTo')} Bangun Ruang Sisi Datar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GabunganPage;
