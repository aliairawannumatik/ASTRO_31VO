import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Percent } from "lucide-react";
import { TriangleAltitude, RightTriangleRatio, SimilarTriangles } from "./GeoFigure";

type Part = { label: string; math?: string; text?: string; diagram?: React.ReactNode };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string; options?: { label: string; text: string }[] };
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const SvgQ1 = () => (
  <svg width={220} height={148} viewBox="0 0 220 148" style={{display:'block'}}>
    <rect width="220" height="148" fill="rgba(2,8,23,0.85)" rx="12"/>
    <line x1="28" y1="125" x2="192" y2="125" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="125" x2="28" y2="18" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="18" x2="192" y2="125" stroke="#34d399" strokeWidth="1.8"/>
    <rect x="28" y="117" width="8" height="8" fill="none" stroke="#34d399" strokeWidth="1.2"/>
    <line x1="28" y1="125" x2="77" y2="50" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <polyline points="74,55 79,58 82,53" fill="none" stroke="#6ee7b7" strokeWidth="1.2"/>
    <text x="28" y="13" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>
    <text x="18" y="142" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
    <text x="200" y="140" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>
    <text x="88" y="48" fill="#6ee7b7" fontSize="11" fontWeight="bold" textAnchor="start">D</text>
  </svg>
);

const SvgQ2 = () => (
  <svg width={220} height={148} viewBox="0 0 220 148" style={{display:'block'}}>
    <rect width="220" height="148" fill="rgba(2,8,23,0.85)" rx="12"/>
    <line x1="28" y1="22" x2="165" y2="22" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="22" x2="28" y2="118" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="165" y1="22" x2="28" y2="118" stroke="#34d399" strokeWidth="1.8"/>
    <rect x="28" y="22" width="8" height="8" fill="none" stroke="#34d399" strokeWidth="1.2"/>
    <line x1="28" y1="22" x2="71" y2="83" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <polyline points="68,78 63,82 67,87" fill="none" stroke="#6ee7b7" strokeWidth="1.2"/>
    <text x="18" y="16" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
    <text x="175" y="16" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>
    <text x="18" y="133" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>
    <text x="78" y="80" fill="#6ee7b7" fontSize="11" fontWeight="bold" textAnchor="start">D</text>
    <text x="97" y="17" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">AB = 12 cm</text>
    <text x="106" y="72" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="middle">BC = 15 cm</text>
  </svg>
);

const SvgQ3 = () => (
  <svg width={220} height={148} viewBox="0 0 220 148" style={{display:'block'}}>
    <rect width="220" height="148" fill="rgba(2,8,23,0.85)" rx="12"/>
    <line x1="28" y1="125" x2="192" y2="125" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="125" x2="28" y2="18" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="18" x2="192" y2="125" stroke="#34d399" strokeWidth="1.8"/>
    <rect x="28" y="117" width="8" height="8" fill="none" stroke="#34d399" strokeWidth="1.2"/>
    <line x1="28" y1="125" x2="77" y2="50" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <polyline points="74,55 79,58 82,53" fill="none" stroke="#6ee7b7" strokeWidth="1.2"/>
    <text x="28" y="13" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>
    <text x="18" y="142" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
    <text x="200" y="140" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>
    <text x="88" y="48" fill="#6ee7b7" fontSize="11" fontWeight="bold" textAnchor="start">D</text>
    <text x="42" y="38" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="start">CD = 12 cm</text>
    <text x="142" y="98" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="start">DB = 3 cm</text>
  </svg>
);

const SvgQ4 = () => (
  <svg width={220} height={148} viewBox="0 0 220 148" style={{display:'block'}}>
    <rect width="220" height="148" fill="rgba(2,8,23,0.85)" rx="12"/>
    <line x1="28" y1="125" x2="192" y2="125" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="125" x2="28" y2="18" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="18" x2="192" y2="125" stroke="#34d399" strokeWidth="1.8"/>
    <rect x="28" y="117" width="8" height="8" fill="none" stroke="#34d399" strokeWidth="1.2"/>
    <line x1="28" y1="125" x2="77" y2="50" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <polyline points="74,55 79,58 82,53" fill="none" stroke="#6ee7b7" strokeWidth="1.2"/>
    <text x="28" y="13" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">C</text>
    <text x="18" y="142" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
    <text x="200" y="140" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>
    <text x="88" y="48" fill="#6ee7b7" fontSize="11" fontWeight="bold" textAnchor="start">D</text>
    <text x="43" y="37" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="start">5 cm</text>
    <text x="140" y="99" fill="rgba(255,255,255,0.7)" fontSize="10" textAnchor="start">4 cm</text>
  </svg>
);

const SvgQ5a = () => (
  <svg width={200} height={130} viewBox="0 0 200 130" style={{display:'block'}}>
    <rect width="200" height="130" fill="rgba(2,8,23,0.85)" rx="8"/>
    <line x1="15" y1="112" x2="175" y2="112" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="15" y1="112" x2="80" y2="15" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="80" y1="15" x2="175" y2="112" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="80" y1="15" x2="80" y2="112" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <rect x="72" y="104" width="8" height="8" fill="none" stroke="#6ee7b7" strokeWidth="1.2"/>
    <text x="80" y="10" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">C</text>
    <text x="8" y="125" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">A</text>
    <text x="183" y="125" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">B</text>
    <text x="80" y="125" fill="#6ee7b7" fontSize="10" fontWeight="bold" textAnchor="middle">D</text>
    <text x="54" y="63" fill="rgba(255,255,255,0.75)" fontSize="10" textAnchor="middle">18 cm</text>
    <text x="140" y="115" fill="rgba(255,255,255,0.75)" fontSize="10" textAnchor="middle">6 cm</text>
    <text x="40" y="115" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">p</text>
  </svg>
);

const SvgQ5b = () => (
  <svg width={200} height={130} viewBox="0 0 200 130" style={{display:'block'}}>
    <rect width="200" height="130" fill="rgba(2,8,23,0.85)" rx="8"/>
    <line x1="20" y1="112" x2="175" y2="112" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="20" y1="112" x2="85" y2="18" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="85" y1="18" x2="175" y2="112" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="85" y1="18" x2="85" y2="112" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3"/>
    <rect x="77" y="104" width="8" height="8" fill="none" stroke="#fbbf24" strokeWidth="1.2"/>
    <text x="85" y="13" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">G</text>
    <text x="12" y="125" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">E</text>
    <text x="183" y="125" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">F</text>
    <text x="85" y="125" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">H</text>
    <text x="52" y="115" fill="rgba(255,255,255,0.75)" fontSize="10" textAnchor="middle">4 cm</text>
    <text x="130" y="115" fill="rgba(255,255,255,0.75)" fontSize="10" textAnchor="middle">5 cm</text>
    <text x="62" y="68" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">p</text>
  </svg>
);

const SvgQ5c = () => (
  <svg width={200} height={110} viewBox="0 0 200 110" style={{display:'block'}}>
    <rect width="200" height="110" fill="rgba(2,8,23,0.85)" rx="8"/>
    <line x1="15" y1="95" x2="185" y2="95" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="15" y1="95" x2="48" y2="18" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="48" y1="18" x2="185" y2="95" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="48" y1="18" x2="48" y2="95" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3"/>
    <rect x="40" y="87" width="8" height="8" fill="none" stroke="#fbbf24" strokeWidth="1.2"/>
    <text x="48" y="13" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">L</text>
    <text x="8" y="106" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">K</text>
    <text x="192" y="106" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">M</text>
    <text x="48" y="107" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">N</text>
    <text x="30" y="98" fill="rgba(255,255,255,0.75)" fontSize="9" textAnchor="middle">4 cm</text>
    <text x="118" y="104" fill="rgba(255,255,255,0.75)" fontSize="9" textAnchor="middle">25 cm</text>
    <text x="60" y="60" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="start">p</text>
  </svg>
);

const SvgQ5d = () => (
  <svg width={200} height={130} viewBox="0 0 200 130" style={{display:'block'}}>
    <rect width="200" height="130" fill="rgba(2,8,23,0.85)" rx="8"/>
    <line x1="28" y1="112" x2="175" y2="112" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="112" x2="28" y2="18" stroke="#34d399" strokeWidth="1.8"/>
    <line x1="28" y1="18" x2="175" y2="112" stroke="#34d399" strokeWidth="1.8"/>
    <rect x="28" y="104" width="8" height="8" fill="none" stroke="#34d399" strokeWidth="1.2"/>
    {/* U on hypotenuse TS, RU ⊥ TS */}
    {/* T=(28,18), S=(175,112): dir=(147,94), |TS|²=147²+94²=21609+8836=30445 */}
    {/* TU: t = TR²/TS² * TS = 81/225 of TS, US = RS²/TS² * TS */}
    {/* Let TR=9, RS=12, TS=15. TU/TS = TR²/TS² ... */}
    {/* TU = TR²/TS = 81/15 = 5.4, so t_U = 5.4/15 = 0.36 */}
    {/* U = T + 0.36*(S-T) = (28+0.36*147, 18+0.36*94) = (81,52) */}
    {/* RU ⊥ TS: from R=(28,112) to U=(81,52) */}
    <line x1="28" y1="112" x2="81" y2="52" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="4,3"/>
    <polyline points="78,57 83,60 86,55" fill="none" stroke="#6ee7b7" strokeWidth="1.2"/>
    <text x="28" y="13" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">T</text>
    <text x="18" y="125" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">R</text>
    <text x="183" y="125" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">S</text>
    <text x="90" y="50" fill="#6ee7b7" fontSize="11" fontWeight="bold" textAnchor="start">U</text>
    <text x="18" y="68" fill="rgba(255,255,255,0.75)" fontSize="10" textAnchor="middle">9 cm</text>
    <text x="102" y="124" fill="rgba(255,255,255,0.75)" fontSize="10" textAnchor="middle">12 cm</text>
    <text x="142" y="82" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">p</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pernyataan yang Benar tentang Perbandingan Rusuk", {
    type: "pilgan",
    diagram: <SvgQ1 />,
    content: "Berdasarkan gambar berikut, segitiga ABC siku-siku di A dan AD ⊥ BC. Terdapat pernyataan sebagai berikut.",
    parts: [
      { label: "(i)", math: "AD^2 = BD \\times CD" },
      { label: "(ii)", math: "AB^2 = BD \\times BC" },
      { label: "(iii)", math: "AC^2 = CD \\times BD" },
      { label: "(iv)", math: "BC^2 = AB^2 + AC^2" },
    ],
    options: [
      { label: "A.", text: "(i), (ii), dan (iii)" },
      { label: "B.", text: "(i), (ii), dan (iv)" },
      { label: "C.", text: "(i), (iii), dan (iv)" },
      { label: "D.", text: "(ii), (iii), dan (iv)" },
    ],
  }),
  Qn(2, "Mencari Panjang AD", {
    type: "pilgan",
    diagram: <SvgQ2 />,
    content: "Pada gambar berikut, panjang AB = 12 cm dan BC = 15 cm. Panjang AD adalah …",
    options: [
      { label: "A.", text: "5,4 cm" },
      { label: "B.", text: "6 cm" },
      { label: "C.", text: "7,2 cm" },
      { label: "D.", text: "9,6 cm" },
    ],
  }),
  Qn(3, "Mencari AD, AB, dan AC", {
    type: "pilgan",
    diagram: <SvgQ3 />,
    content: "Pada gambar berikut, diketahui panjang BD = 3 cm dan CD = 12 cm. Panjang AD, AB, dan AC berturut-turut adalah …",
    options: [
      { label: "A.", text: "6 cm, 3√5 cm, dan 6√5 cm" },
      { label: "B.", text: "6 cm, 3√5 cm, dan 2√5 cm" },
      { label: "C.", text: "6 cm, 2√5 cm, dan 6√5 cm" },
      { label: "D.", text: "6 cm, 2√5 cm, dan 3√5 cm" },
    ],
  }),
  Qn(4, "Mencari Panjang AB", {
    type: "pilgan",
    diagram: <SvgQ4 />,
    content: "Pada gambar berikut, segitiga ABC siku-siku di A dan AD tegak lurus BC. Jika panjang BD = 4 cm dan CD = 5 cm, maka panjang AB adalah …",
    options: [
      { label: "A.", text: "√20 cm" },
      { label: "B.", text: "√28 cm" },
      { label: "C.", text: "√32 cm" },
      { label: "D.", text: "√36 cm" },
    ],
  }),
  Qn(5, "Hitunglah Nilai p", {
    type: "hitungP",
    content: "Hitunglah nilai p berdasarkan gambar di bawah ini.",
    parts: [
      {
        label: "a.",
        diagram: <SvgQ5a />,
        text: "Segitiga siku-siku di C. CD ⊥ AB, CD = 18 cm, DB = 6 cm. Cari p = AD.",
      },
      {
        label: "b.",
        diagram: <SvgQ5b />,
        text: "Segitiga siku-siku di G. GH ⊥ EF, EH = 4 cm, HF = 5 cm. Cari p = GH.",
      },
      {
        label: "c.",
        diagram: <SvgQ5c />,
        text: "Segitiga siku-siku di L. LN ⊥ KM, KN = 4 cm, NM = 25 cm. Cari p = LN.",
      },
      {
        label: "d.",
        diagram: <SvgQ5d />,
        text: "Segitiga TRS siku-siku di R. RU ⊥ TS, TR = 9 cm, RS = 12 cm. Cari p = US.",
      },
    ],
  }),
  Qn(1, "Garis Tinggi dari Sudut Siku-Siku", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="C" labelBotL="A" labelBotR="B" labelMid="H" sideA="AC" sideB="AH=9" sideC="HB=16" altLabel="CH" color1="#34d399" color2="#6ee7b7" color3="#059669"/>,
    content: "Segitiga siku-siku ACB dengan ∠C = 90°. CH ⊥ AB.",
    parts: [
      { label: "a.", math: "CH^2 = AH \\cdot HB = 9 \\times 16 = \\ldots \\Rightarrow CH = \\ldots" },
      { label: "b.", math: "AC^2 = AH \\cdot AB = 9 \\times 25 = \\ldots \\Rightarrow AC = \\ldots" },
      { label: "c.", math: "BC^2 = HB \\cdot AB = 16 \\times 25 = \\ldots \\Rightarrow BC = \\ldots" },
    ],
  }),
  Qn(2, "Rumus Mean Proportional", {
    type: "mixed",
    diagram: <RightTriangleRatio a="AB" b="BD=4" c="DC=9" h="AD" p="BD=4" q="DC=9" labelA="A" labelB="B" labelC="C" labelH="D" color1="#34d399" color2="#6ee7b7" color3="#059669"/>,
    content: "Segitiga siku-siku ABC dengan ∠A = 90°. AD ⊥ BC.",
    parts: [
      { label: "a.", math: "AD^2 = BD \\cdot DC \\Rightarrow AD^2 = 4 \\times 9 = \\ldots \\Rightarrow AD = \\ldots" },
      { label: "b.", math: "AB^2 = BD \\cdot BC = 4 \\times 13 = \\ldots" },
      { label: "c.", math: "AC^2 = DC \\cdot BC = 9 \\times 13 = \\ldots" },
    ],
  }),
  Qn(3, "Mencari Garis Tinggi", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="A" labelBotL="B" labelBotR="C" labelMid="D" sideA="AB=?" sideB="BD=6" sideC="DC=?" altLabel="AD=h" color1="#34d399" color2="#6ee7b7" color3="#059669"/>,
    content: "Segitiga siku-siku ABC dengan ∠A = 90°, AD ⊥ BC, BD = 6, AD = 8.",
    parts: [
      { label: "a.", math: "AD^2 = BD \\cdot DC \\Rightarrow 64 = 6 \\cdot DC \\Rightarrow DC = \\ldots" },
      { label: "b.", math: "AB = \\sqrt{BD \\cdot BC} = \\sqrt{6 \\times (6+DC)}" },
      { label: "c.", math: "AC = \\sqrt{DC \\cdot BC} = \\ldots" },
    ],
  }),
  Qn(4, "Proyeksi Sisi pada Hipotenusa", {
    type: "mixed",
    content: "Segitiga siku-siku PQR dengan ∠P = 90°. PD ⊥ QR. QD = 5, DR = 20.",
    parts: [
      { label: "a.", math: "QR = QD + DR = 5 + 20 = \\ldots" },
      { label: "b.", math: "PD = \\sqrt{QD \\cdot DR} = \\sqrt{5 \\times 20} = \\ldots" },
      { label: "c.", math: "PQ = \\sqrt{QD \\cdot QR}, \\quad PR = \\sqrt{DR \\cdot QR}" },
    ],
  }),
  Qn(5, "Segitiga Siku-Siku dengan Altitude", {
    type: "mixed",
    diagram: <RightTriangleRatio a="?" b="BD=3" c="DC=12" h="AD=h" p="BD=3" q="DC=12" labelA="A" labelB="B" labelC="C" labelH="D" color1="#34d399" color2="#6ee7b7" color3="#059669"/>,
    parts: [
      { label: "a.", math: "AD = \\sqrt{BD \\cdot DC} = \\sqrt{3 \\times 12} = \\ldots" },
      { label: "b.", math: "BC = BD + DC = \\ldots" },
      { label: "c.", math: "AB = \\sqrt{BD \\cdot BC} = \\sqrt{3 \\times 15} = \\ldots" },
    ],
  }),
  Qn(6, "Perbandingan Tiga Segitiga Sebangun", {
    type: "mixed",
    content: "Segitiga siku-siku KLM dengan ∠K = 90°, KN ⊥ LM. △KLN ~ △MLK ~ △MKN.",
    parts: [
      { label: "a.", text: "Jelaskan mengapa ketiga segitiga tersebut sebangun." },
      { label: "b.", math: "\\frac{KN}{LN} = \\frac{MN}{KN} \\Rightarrow KN^2 = LN \\cdot MN" },
      { label: "c.", math: "\\text{Jika LN = 4, MN = 16, hitung KN, KL, KM}" },
    ],
  }),
  Qn(7, "Mencari BD dari AD dan AB", {
    type: "mixed",
    content: "Segitiga siku-siku ABC, ∠B = 90°. BD ⊥ AC. AB = 10, BC = 24, AC = 26.",
    parts: [
      { label: "a.", math: "BD = \\frac{AB \\cdot BC}{AC} = \\frac{10 \\times 24}{26} = \\ldots" },
      { label: "b.", math: "AD = \\frac{AB^2}{AC} = \\frac{100}{26} = \\ldots" },
      { label: "c.", math: "DC = \\frac{BC^2}{AC} = \\frac{576}{26} = \\ldots" },
    ],
  }),
  Qn(8, "Proporsi Garis Tinggi – Soal UN", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="C" labelBotL="A" labelBotR="B" labelMid="D" sideA="AC=15" sideB="AD=9" sideC="DB=?" altLabel="CD=12" color1="#34d399" color2="#6ee7b7" color3="#059669"/>,
    content: "Segitiga ACB siku-siku di C. CD ⊥ AB. CD = 12, AD = 9.",
    parts: [
      { label: "a.", math: "CD^2 = AD \\cdot DB \\Rightarrow 144 = 9 \\cdot DB \\Rightarrow DB = \\ldots" },
      { label: "b.", math: "AB = AD + DB = 9 + \\ldots = \\ldots" },
      { label: "c.", math: "AC = \\sqrt{AD \\cdot AB} = \\sqrt{9 \\times \\ldots} = \\ldots" },
    ],
  }),
  Qn(9, "Mencari Sisi dari Proyeksi", {
    type: "mixed",
    content: "Segitiga XYZ siku-siku di X. XW ⊥ YZ. YW = 4, WZ = 9.",
    parts: [
      { label: "a.", math: "XW = \\sqrt{YW \\cdot WZ} = \\sqrt{4 \\times 9} = \\ldots" },
      { label: "b.", math: "XY = \\sqrt{YW \\cdot YZ} = \\sqrt{4 \\times 13} = \\ldots" },
      { label: "c.", math: "XZ = \\sqrt{WZ \\cdot YZ} = \\sqrt{9 \\times 13} = \\ldots" },
    ],
  }),
  Qn(10, "Perbandingan Rusuk Siku-Siku", {
    type: "mixed",
    content: "Segitiga siku-siku dengan sisi-sisi 5, 12, 13. Garis tinggi dari sudut siku-siku ke hipotenusa membagi hipotenusa menjadi dua segmen.",
    parts: [
      { label: "a.", math: "h = \\frac{ab}{c} = \\frac{5 \\times 12}{13} = \\ldots" },
      { label: "b.", math: "p = \\frac{a^2}{c} = \\frac{25}{13}, \\quad q = \\frac{b^2}{c} = \\frac{144}{13}" },
      { label: "c.", math: "\\text{Verifikasi: } p + q = \\frac{25}{13} + \\frac{144}{13} = \\ldots = c \\checkmark" },
    ],
  }),
  Qn(11, "Soal ANBK – Garis Tinggi Siku-Siku", {
    type: "mixed",
    diagram: <RightTriangleRatio a="?" b="BD=x" c="DC=9" h="AD=6" p="BD=x" q="DC=9" labelA="A" labelB="B" labelC="C" labelH="D" color1="#059669" color2="#34d399" color3="#6ee7b7"/>,
    parts: [
      { label: "a.", math: "AD^2 = BD \\cdot DC \\Rightarrow 36 = BD \\times 9 \\Rightarrow BD = \\ldots" },
      { label: "b.", math: "BC = BD + DC = \\ldots" },
      { label: "c.", math: "AB = \\sqrt{BD \\cdot BC} = \\ldots" },
    ],
  }),
  Qn(12, "Proyeksi Sisi pada Sisi Lain", {
    type: "mixed",
    content: "Dalam segitiga siku-siku PQR (∠R = 90°), RH ⊥ PQ. PH = 8, QH = 2.",
    parts: [
      { label: "a.", math: "RH = \\sqrt{PH \\cdot QH} = \\sqrt{8 \\times 2} = \\ldots" },
      { label: "b.", math: "PR = \\sqrt{PH \\cdot PQ} = \\sqrt{8 \\times 10} = \\ldots" },
      { label: "c.", math: "QR = \\sqrt{QH \\cdot PQ} = \\sqrt{2 \\times 10} = \\ldots" },
    ],
  }),
  Qn(13, "Rasio Garis Tinggi – Soal TKA", {
    type: "mixed",
    content: "Segitiga siku-siku ABC (∠B = 90°). BD ⊥ AC. Jika AD = 4 dan DC = 25.",
    parts: [
      { label: "a.", math: "BD = \\sqrt{AD \\cdot DC} = \\sqrt{4 \\times 25} = \\ldots" },
      { label: "b.", math: "AC = AD + DC = \\ldots" },
      { label: "c.", math: "\\text{Luas } △ABD = \\frac{1}{2} \\cdot AD \\cdot BD = \\ldots" },
    ],
  }),
  Qn(14, "Verifikasi Pythagoras dari Proyeksi", {
    type: "mixed",
    content: "Segitiga siku-siku KLM (∠L = 90°). LN ⊥ KM. KN = 5, NM = 20.",
    parts: [
      { label: "a.", math: "LN = \\sqrt{5 \\times 20} = \\ldots" },
      { label: "b.", math: "KL = \\sqrt{5 \\times 25} = \\ldots, \\quad LM = \\sqrt{20 \\times 25} = \\ldots" },
      { label: "c.", math: "\\text{Verifikasi Pythagoras: } KL^2 + LM^2 = \\ldots = KM^2?" },
    ],
  }),
  Qn(15, "Mencari Nilai x – Proyeksi", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="C" labelBotL="A" labelBotR="B" labelMid="D" sideA="AC" sideB="AD=x" sideC="DB=3x" altLabel="CD=12" color1="#34d399" color2="#6ee7b7" color3="#059669"/>,
    content: "Segitiga siku-siku ACB (∠C = 90°). CD ⊥ AB. CD = 12, AD = x, DB = 3x.",
    parts: [
      { label: "a.", math: "CD^2 = AD \\cdot DB \\Rightarrow 144 = x \\cdot 3x = 3x^2" },
      { label: "b.", text: "Selesaikan untuk x." },
      { label: "c.", text: "Tentukan panjang AB, AC, dan BC." },
    ],
  }),
  Qn(16, "Perbandingan Tiga Segitiga – Lanjutan", {
    type: "mixed",
    content: "Segitiga ABC siku-siku di A. AH ⊥ BC. BH = 4, HC = 9.",
    parts: [
      { label: "a.", math: "AH = \\sqrt{BH \\cdot HC} = \\sqrt{36} = \\ldots" },
      { label: "b.", math: "BA = \\sqrt{BH \\cdot BC} = \\sqrt{4 \\times 13} = \\ldots" },
      { label: "c.", math: "\\frac{\\text{Luas }△ABH}{\\text{Luas }△ABC} = \\frac{BH}{BC} = \\frac{4}{13}" },
    ],
  }),
  Qn(17, "Mencari Altitude dari Luas", {
    type: "mixed",
    content: "Segitiga siku-siku PQR (∠P = 90°) dengan PQ = 8, PR = 6, QR = 10. PH ⊥ QR.",
    parts: [
      { label: "a.", math: "\\text{Luas} = \\frac{1}{2} \\cdot PQ \\cdot PR = \\frac{1}{2} \\cdot 8 \\cdot 6 = \\ldots" },
      { label: "b.", math: "\\text{Luas} = \\frac{1}{2} \\cdot QR \\cdot PH \\Rightarrow PH = \\frac{2 \\times \\text{Luas}}{QR} = \\ldots" },
      { label: "c.", math: "QH = \\frac{PQ^2}{QR} = \\frac{64}{10} = \\ldots, \\quad HR = \\frac{PR^2}{QR} = \\frac{36}{10} = \\ldots" },
    ],
  }),
  Qn(18, "Soal UN – Mencari Garis Tinggi", {
    type: "mixed",
    diagram: <RightTriangleRatio a="AB=12" b="BD=?" c="DC=?" h="BC=5" p="BD" q="DC" labelA="A" labelB="B" labelC="C" labelH="D" color1="#34d399" color2="#6ee7b7" color3="#059669"/>,
    content: "Segitiga siku-siku ABC (∠B = 90°). BD ⊥ AC. AB = 12, BC = 5, AC = 13.",
    parts: [
      { label: "a.", math: "AD = \\frac{AB^2}{AC} = \\frac{144}{13} = \\ldots" },
      { label: "b.", math: "DC = \\frac{BC^2}{AC} = \\frac{25}{13} = \\ldots" },
      { label: "c.", math: "BD = \\frac{AB \\cdot BC}{AC} = \\frac{12 \\times 5}{13} = \\ldots" },
    ],
  }),
  Qn(19, "Perbandingan dalam Segitiga Siku-Siku", {
    type: "mixed",
    content: "Segitiga siku-siku MNO (∠O = 90°). OD ⊥ MN. MD = 6, DN = 24.",
    parts: [
      { label: "a.", math: "OD = \\sqrt{MD \\cdot DN} = \\sqrt{6 \\times 24} = \\ldots" },
      { label: "b.", math: "MN = MD + DN = \\ldots" },
      { label: "c.", math: "\\frac{MO}{MN} = \\frac{MD}{MO} \\Rightarrow MO = \\sqrt{MD \\cdot MN} = \\ldots" },
    ],
  }),
  Qn(20, "Perbandingan Sisi dan Altitude", {
    type: "mixed",
    content: "Segitiga siku-siku dengan hipotenusa c dan kaki a, b. Garis tinggi h dari sudut siku-siku.",
    parts: [
      { label: "a.", math: "h = \\frac{ab}{c}" },
      { label: "b.", math: "\\text{Proyeksi a: } p = \\frac{a^2}{c}" },
      { label: "c.", math: "\\text{Proyeksi b: } q = \\frac{b^2}{c}, \\text{ dan } p + q = c" },
    ],
  }),
  Qn(21, "Perbandingan Rusuk Segitiga 30-60-90", {
    type: "mixed",
    content: "Segitiga siku-siku dengan sudut 30°, 60°, 90°. Sisi terpendek = a.",
    parts: [
      { label: "a.", math: "\\text{Sisi pendek (depan 30°)} = a" },
      { label: "b.", math: "\\text{Hipotenusa} = 2a" },
      { label: "c.", math: "\\text{Sisi panjang (depan 60°)} = a\\sqrt{3}" },
    ],
  }),
  Qn(22, "Perbandingan Rusuk Segitiga 45-45-90", {
    type: "mixed",
    content: "Segitiga siku-siku sama kaki (45°-45°-90°). Sisi kaki = a.",
    parts: [
      { label: "a.", math: "\\text{Kaki} = a, \\quad \\text{Hipotenusa} = a\\sqrt{2}" },
      { label: "b.", math: "\\text{Jika hipotenusa} = 10, \\text{ kaki} = \\frac{10}{\\sqrt{2}} = 5\\sqrt{2}" },
      { label: "c.", math: "\\text{Luas} = \\frac{1}{2} \\cdot a \\cdot a = \\frac{a^2}{2}" },
    ],
  }),
  Qn(23, "Proyeksi pada Soal Kontekstual", {
    type: "mixed",
    content: "Sebuah tangga 10 m bersandar pada dinding. Kaki tangga 6 m dari dinding. H adalah titik di dinding langsung di atas kaki tangga.",
    parts: [
      { label: "a.", text: "Gambarlah segitiga siku-siku yang terbentuk." },
      { label: "b.", math: "\\text{Tinggi tangga di dinding} = \\sqrt{10^2 - 6^2} = \\ldots" },
      { label: "c.", text: "Jika dinding, lantai, dan tangga membentuk segitiga siku-siku, tentukan garis tinggi dari siku-siku ke hipotenusa." },
    ],
  }),
  Qn(24, "Altitude dan Segmen Hipotenusa – Soal ANBK", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="C" labelBotL="A" labelBotR="B" labelMid="D" sideA="AC=10" sideB="AD=4" sideC="DB=?" altLabel="CD=?" color1="#34d399" color2="#6ee7b7" color3="#059669"/>,
    content: "Segitiga siku-siku ACB (∠C = 90°). CD ⊥ AB. AC = 10, AD = 4.",
    parts: [
      { label: "a.", math: "AC^2 = AD \\cdot AB \\Rightarrow 100 = 4 \\cdot AB \\Rightarrow AB = \\ldots" },
      { label: "b.", math: "DB = AB - AD = \\ldots" },
      { label: "c.", math: "CD = \\sqrt{AD \\cdot DB} = \\ldots" },
    ],
  }),
  Qn(25, "Segitiga Sebangun – Mencari Hipotenusa", {
    type: "mixed",
    content: "Segitiga siku-siku RST (∠S = 90°). SU ⊥ RT. RU = 3, UT = 12.",
    parts: [
      { label: "a.", math: "SU = \\sqrt{RU \\cdot UT} = \\sqrt{3 \\times 12} = \\ldots" },
      { label: "b.", math: "RT = RU + UT = \\ldots" },
      { label: "c.", math: "RS = \\sqrt{RU \\cdot RT} = \\sqrt{3 \\times 15} = \\ldots" },
    ],
  }),
  Qn(26, "Altitude dari Sisi – Soal TKA", {
    type: "mixed",
    content: "Segitiga siku-siku ABC (∠A = 90°), AB = 9, AC = 12, BC = 15. AD ⊥ BC.",
    parts: [
      { label: "a.", math: "AD = \\frac{AB \\cdot AC}{BC} = \\frac{9 \\times 12}{15} = \\ldots" },
      { label: "b.", math: "BD = \\frac{AB^2}{BC} = \\frac{81}{15} = \\ldots" },
      { label: "c.", math: "DC = \\frac{AC^2}{BC} = \\frac{144}{15} = \\ldots" },
    ],
  }),
  Qn(27, "Perbandingan Garis dalam Segitiga – Tiga Segitiga", {
    type: "mixed",
    diagram: <RightTriangleRatio a="?" b="BD=?" c="DC=?" h="AD=12" p="BD=9" q="DC=?" labelA="A" labelB="B" labelC="C" labelH="D" color1="#059669" color2="#34d399" color3="#6ee7b7"/>,
    content: "Segitiga siku-siku BAC (∠A = 90°). AD ⊥ BC. BD = 9, AD = 12.",
    parts: [
      { label: "a.", math: "AD^2 = BD \\cdot DC \\Rightarrow 144 = 9 \\cdot DC \\Rightarrow DC = \\ldots" },
      { label: "b.", math: "BC = BD + DC = \\ldots" },
      { label: "c.", math: "AB = \\sqrt{BD \\cdot BC} = \\ldots" },
    ],
  }),
  Qn(28, "Soal Campuran – Altitude dan Pythagoras", {
    type: "mixed",
    content: "Diketahui segitiga siku-siku dengan salah satu kaki 8 dan hipotenusa 17.",
    parts: [
      { label: "a.", math: "\\text{Kaki lainnya} = \\sqrt{17^2 - 8^2} = \\sqrt{289 - 64} = \\ldots" },
      { label: "b.", math: "h = \\frac{8 \\times 15}{17} = \\ldots" },
      { label: "c.", math: "p = \\frac{64}{17}, \\quad q = \\frac{225}{17}, \\quad p + q = \\ldots" },
    ],
  }),
  Qn(29, "Mencari x dari Persamaan Proyeksi", {
    type: "mixed",
    content: "Segitiga siku-siku ABC (∠B = 90°). BD ⊥ AC. AD = x + 1, DC = 4x − 1, BD = 6.",
    parts: [
      { label: "a.", math: "BD^2 = AD \\cdot DC \\Rightarrow 36 = (x+1)(4x-1)" },
      { label: "b.", text: "Ekspansi dan selesaikan persamaan kuadrat untuk x." },
      { label: "c.", text: "Tentukan panjang AD dan DC." },
    ],
  }),
  Qn(30, "Segmen Sebangun – Soal UN Level Tinggi", {
    type: "mixed",
    content: "Segitiga siku-siku KLM (∠L = 90°). LN ⊥ KM. KN = 8, NM = 2.",
    parts: [
      { label: "a.", math: "LN = \\sqrt{KN \\cdot NM} = \\sqrt{8 \\times 2} = \\ldots" },
      { label: "b.", math: "KL = \\sqrt{KN \\cdot KM} = \\sqrt{8 \\times 10} = \\ldots" },
      { label: "c.", math: "\\frac{\\text{Luas }△KLN}{\\text{Luas }△KLM} = \\frac{KN}{KM} = \\frac{8}{10} = \\ldots" },
    ],
  }),
  Qn(31, "Perbandingan Sisi Siku-Siku dengan Sudut Istimewa", {
    type: "mixed",
    content: "Segitiga siku-siku dengan sudut 30°-60°-90°. Hipotenusa = 20.",
    parts: [
      { label: "a.", math: "\\text{Sisi pendek} = \\frac{1}{2} \\times 20 = \\ldots" },
      { label: "b.", math: "\\text{Sisi panjang} = \\frac{\\sqrt{3}}{2} \\times 20 = 10\\sqrt{3}" },
      { label: "c.", math: "\\text{Luas} = \\frac{1}{2} \\times 10 \\times 10\\sqrt{3} = \\ldots" },
    ],
  }),
  Qn(32, "Segitiga Siku-Siku dengan Altitude – Soal HOTS", {
    type: "mixed",
    content: "Segitiga siku-siku XYZ (∠Z = 90°). ZW ⊥ XY. XW = 4, WY = 9. Tentukan luas △XYZ.",
    parts: [
      { label: "a.", math: "ZW = \\sqrt{4 \\times 9} = 6, \\quad XY = 13" },
      { label: "b.", math: "XZ = \\sqrt{4 \\times 13} = 2\\sqrt{13}, \\quad ZY = \\sqrt{9 \\times 13} = 3\\sqrt{13}" },
      { label: "c.", math: "\\text{Luas} = \\frac{1}{2} \\times XY \\times ZW = \\frac{1}{2} \\times 13 \\times 6 = \\ldots" },
    ],
  }),
  Qn(33, "Rumus Umum – Garis Tinggi", {
    type: "mixed",
    content: "Segitiga siku-siku dengan kaki a dan b, hipotenusa c. Altitude dari sudut siku-siku = h.",
    parts: [
      { label: "a.", math: "h = \\frac{ab}{c}" },
      { label: "b.", math: "\\text{Segmen-segmen hipotenusa: } p = \\frac{a^2}{c}, \\quad q = \\frac{b^2}{c}" },
      { label: "c.", math: "\\text{Verifikasi: } h^2 = pq \\Rightarrow \\frac{a^2 b^2}{c^2} = \\frac{a^2}{c} \\cdot \\frac{b^2}{c} \\checkmark" },
    ],
  }),
  Qn(34, "Proyeksi pada Sisi – Soal TKA Lanjut", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="A" labelBotL="B" labelBotR="C" labelMid="D" sideA="AB=10" sideB="BD=?" sideC="DC=6" altLabel="AD" color1="#34d399" color2="#6ee7b7" color3="#059669"/>,
    content: "Segitiga siku-siku ABC (∠A = 90°). AD ⊥ BC. DC = 6, BC = 10.",
    parts: [
      { label: "a.", math: "BD = BC - DC = 10 - 6 = \\ldots" },
      { label: "b.", math: "AD = \\sqrt{BD \\cdot DC} = \\sqrt{4 \\times 6} = \\ldots" },
      { label: "c.", math: "AB = \\sqrt{BD \\cdot BC} = \\sqrt{4 \\times 10} = \\ldots" },
    ],
  }),
  Qn(35, "Mencari Nilai dari Persamaan", {
    type: "mixed",
    content: "Segitiga siku-siku ABC (∠C = 90°). CH ⊥ AB. AH = 2x dan HB = x + 3, CH = 6.",
    parts: [
      { label: "a.", math: "CH^2 = AH \\cdot HB \\Rightarrow 36 = 2x(x+3) = 2x^2 + 6x" },
      { label: "b.", text: "Selesaikan persamaan kuadrat untuk x." },
      { label: "c.", text: "Tentukan AH, HB, dan AB." },
    ],
  }),
  Qn(36, "Segitiga Siku-Siku Sebangun – Mencari Perbandingan", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["D","B","A"]} sideLabels1={["6","?","10"]} sideLabels2={["?","8","?"]} color1="#34d399" color2="#059669" type="right"/>,
    content: "△ABC ~ △DBA. AB = 6, BC = 8, AC = 10.",
    parts: [
      { label: "a.", math: "\\frac{AB}{DB} = \\frac{AC}{DA} = \\frac{BC}{BA}" },
      { label: "b.", math: "DB = \\frac{AB^2}{AC} = \\frac{36}{10} = \\ldots" },
      { label: "c.", math: "DA = \\frac{AB \\cdot BC}{AC} = \\frac{6 \\times 8}{10} = \\ldots" },
    ],
  }),
  Qn(37, "Perbandingan Rusuk dari Altitude Diketahui", {
    type: "mixed",
    content: "Segitiga siku-siku PQR (∠Q = 90°), QH ⊥ PR. QH = 6. PH : HR = 1 : 4.",
    parts: [
      { label: "a.", math: "QH^2 = PH \\cdot HR = PH \\cdot 4PH = 4PH^2 \\Rightarrow PH = \\ldots" },
      { label: "b.", text: "Hitunglah HR dan PR." },
      { label: "c.", text: "Hitunglah PQ dan QR." },
    ],
  }),
  Qn(38, "Perbandingan Luas Tiga Segitiga", {
    type: "mixed",
    content: "Segitiga ABC siku-siku di A. AH ⊥ BC. BH = 4, HC = 9. Tiga segitiga terbentuk: △ABH, △ACH, △ABC.",
    parts: [
      { label: "a.", math: "AH = \\sqrt{4 \\times 9} = 6, \\quad AB = \\sqrt{4 \\times 13} = 2\\sqrt{13}, \\quad AC = \\sqrt{9 \\times 13} = 3\\sqrt{13}" },
      { label: "b.", math: "L_{ABH} = \\frac{1}{2}(4)(6) = 12, \\quad L_{ACH} = \\frac{1}{2}(9)(6) = 27, \\quad L_{ABC} = 39" },
      { label: "c.", math: "\\frac{L_{ABH}}{L_{ABC}} = \\frac{4}{13}, \\quad \\frac{L_{ACH}}{L_{ABC}} = \\frac{9}{13}" },
    ],
  }),
  Qn(39, "Soal Aplikasi – Jarak di Peta", {
    type: "mixed",
    content: "Segitiga siku-siku terbentuk dari tiga kota. Kota A ke B = 6 km (utara-selatan), B ke C = 8 km (timur-barat). Jarak langsung A ke C = 10 km. Titik D adalah titik terpendek dari B ke garis AC.",
    parts: [
      { label: "a.", math: "BD = \\frac{AB \\times BC}{AC} = \\frac{6 \\times 8}{10} = \\ldots" },
      { label: "b.", math: "AD = \\frac{AB^2}{AC} = \\frac{36}{10} = \\ldots" },
      { label: "c.", math: "DC = \\frac{BC^2}{AC} = \\frac{64}{10} = \\ldots" },
    ],
  }),
  Qn(40, "Soal HOTS – Perbandingan Berganda", {
    type: "mixed",
    content: "Segitiga siku-siku ABC (∠B = 90°). BD ⊥ AC. DE ⊥ AB dengan E pada AB. Diketahui AD = 4, DC = 9.",
    parts: [
      { label: "a.", math: "BD = \\sqrt{AD \\cdot DC} = \\sqrt{36} = 6" },
      { label: "b.", math: "AB = \\sqrt{AD \\cdot AC} = \\sqrt{4 \\times 13} = 2\\sqrt{13}" },
      { label: "c.", math: "DE ⊥ AB, \\text{ dan } △BDE ~ △ABD. \\text{ Jika BD = 6, AB = }2\\sqrt{13}\\text{, maka } DE = \\frac{BD^2}{AB} = \\ldots" },
    ],
  }),
];

const RasioRusukPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <Percent className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            RASIO RUSUK SEGITIGA SIKU-SIKU DENGAN KESEBANGUNAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Kesebangunan & Kekongruenan · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 45 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-2">📌 Rumus Kunci – Garis Tinggi Siku-Siku</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Altitude", math: "h^2 = p \\cdot q" },
              { label: "Kaki-1", math: "a^2 = p \\cdot c" },
              { label: "Kaki-2", math: "b^2 = q \\cdot c" },
            ].map(r => (
              <div key={r.label} className="bg-white/5 rounded-lg px-2 py-2 text-center">
                <p className="text-emerald-300 text-[10px] font-bold mb-1">{r.label}</p>
                <div className="text-white/80 text-xs"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-300 text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center rounded-xl overflow-hidden">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex flex-col gap-1 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            <div className="flex items-start gap-2">
                              {p.label && <span className="text-emerald-400 text-xs font-bold shrink-0 mt-0.5">{p.label}</span>}
                              <div className="flex-1">
                                {p.text && <p className="font-body text-sm text-white/80 leading-relaxed">{p.text}</p>}
                                {p.math && <div className="text-white/80 text-sm mt-0.5"><InlineMath math={p.math} /></div>}
                              </div>
                            </div>
                            {p.diagram && <div className="mt-2 flex justify-center rounded-xl overflow-hidden">{p.diagram}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                    {q.options && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-amber-400 text-xs font-bold shrink-0">{opt.label}</span>
                            <span className="font-body text-sm text-white/80">{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {q.math && !q.parts && <div className="mt-2 bg-white/5 rounded-lg px-3 py-2"><BlockMath math={q.math} /></div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/kesebangunan-kekongruenan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Kesebangunan & Kekongruenan
          </button>
        </div>
      </div>
    </div>
  );
};

export default RasioRusukPage;
