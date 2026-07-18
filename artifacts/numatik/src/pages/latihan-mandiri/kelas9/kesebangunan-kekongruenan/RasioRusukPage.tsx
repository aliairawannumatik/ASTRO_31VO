import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  <svg width={270} height={185} viewBox="0 0 270 185" className="lm-kkg-svg" style={{display:'block'}}>
    <rect width="270" height="185" fill="#0b1733" rx="14"/>
    <polygon points="52,22 52,157 218,157" fill="rgba(34,211,238,0.08)"/>
    <line x1="52" y1="22" x2="52" y2="157" stroke="#22d3ee" strokeWidth="2.5"/>
    <line x1="52" y1="157" x2="218" y2="157" stroke="#22d3ee" strokeWidth="2.5"/>
    <line x1="52" y1="22" x2="218" y2="157" stroke="#22d3ee" strokeWidth="2.5"/>
    <rect x="52" y="148" width="9" height="9" fill="rgba(232,121,249,0.2)" stroke="#e879f9" strokeWidth="1.5"/>
    <line x1="52" y1="157" x2="115" y2="74" stroke="#e879f9" strokeWidth="2" strokeDasharray="6,4"/>
    <polyline points="120,78 116,84 111,80" fill="none" stroke="#e879f9" strokeWidth="1.5"/>
    <circle cx="38" cy="12" r="12" fill="#0b1733" stroke="#22d3ee" strokeWidth="2"/>
    <text x="38" y="17" fill="#22d3ee" fontSize="13" fontWeight="bold" textAnchor="middle">C</text>
    <circle cx="36" cy="170" r="12" fill="#0b1733" stroke="#22d3ee" strokeWidth="2"/>
    <text x="36" y="175" fill="#22d3ee" fontSize="13" fontWeight="bold" textAnchor="middle">A</text>
    <circle cx="232" cy="170" r="12" fill="#0b1733" stroke="#22d3ee" strokeWidth="2"/>
    <text x="232" y="175" fill="#22d3ee" fontSize="13" fontWeight="bold" textAnchor="middle">B</text>
    <circle cx="128" cy="61" r="12" fill="#0b1733" stroke="#e879f9" strokeWidth="2"/>
    <text x="128" y="66" fill="#e879f9" fontSize="13" fontWeight="bold" textAnchor="middle">D</text>
  </svg>
);

const SvgQ2 = () => (
  <svg width={270} height={185} viewBox="0 0 270 185" className="lm-kkg-svg" style={{display:'block'}}>
    <rect width="270" height="185" fill="#0b1733" rx="14"/>
    <polygon points="42,30 208,30 42,155" fill="rgba(34,211,238,0.08)"/>
    <line x1="42" y1="30" x2="208" y2="30" stroke="#22d3ee" strokeWidth="2.5"/>
    <line x1="42" y1="30" x2="42" y2="155" stroke="#22d3ee" strokeWidth="2.5"/>
    <line x1="208" y1="30" x2="42" y2="155" stroke="#22d3ee" strokeWidth="2.5"/>
    <rect x="42" y="30" width="9" height="9" fill="rgba(232,121,249,0.2)" stroke="#e879f9" strokeWidth="1.5"/>
    <line x1="42" y1="30" x2="102" y2="106" stroke="#e879f9" strokeWidth="2" strokeDasharray="6,4"/>
    <polyline points="97,99 103,94 108,100" fill="none" stroke="#e879f9" strokeWidth="1.5"/>
    <circle cx="28" cy="18" r="12" fill="#0b1733" stroke="#22d3ee" strokeWidth="2"/>
    <text x="28" y="23" fill="#22d3ee" fontSize="13" fontWeight="bold" textAnchor="middle">A</text>
    <circle cx="222" cy="18" r="12" fill="#0b1733" stroke="#22d3ee" strokeWidth="2"/>
    <text x="222" y="23" fill="#22d3ee" fontSize="13" fontWeight="bold" textAnchor="middle">B</text>
    <circle cx="28" cy="167" r="12" fill="#0b1733" stroke="#22d3ee" strokeWidth="2"/>
    <text x="28" y="172" fill="#22d3ee" fontSize="13" fontWeight="bold" textAnchor="middle">C</text>
    <circle cx="116" cy="119" r="12" fill="#0b1733" stroke="#e879f9" strokeWidth="2"/>
    <text x="116" y="124" fill="#e879f9" fontSize="13" fontWeight="bold" textAnchor="middle">D</text>
  </svg>
);

const SvgQ3 = () => (
  <svg width={270} height={185} viewBox="0 0 270 185" className="lm-kkg-svg" style={{display:'block'}}>
    <rect width="270" height="185" fill="#0b1733" rx="14"/>
    <polygon points="52,22 52,157 218,157" fill="rgba(34,211,238,0.08)"/>
    <line x1="52" y1="22" x2="52" y2="157" stroke="#22d3ee" strokeWidth="2.5"/>
    <line x1="52" y1="157" x2="218" y2="157" stroke="#22d3ee" strokeWidth="2.5"/>
    <line x1="52" y1="22" x2="218" y2="157" stroke="#22d3ee" strokeWidth="2.5"/>
    <rect x="52" y="148" width="9" height="9" fill="rgba(232,121,249,0.2)" stroke="#e879f9" strokeWidth="1.5"/>
    <line x1="52" y1="157" x2="115" y2="74" stroke="#e879f9" strokeWidth="2" strokeDasharray="6,4"/>
    <polyline points="120,78 116,84 111,80" fill="none" stroke="#e879f9" strokeWidth="1.5"/>
    <circle cx="38" cy="12" r="12" fill="#0b1733" stroke="#22d3ee" strokeWidth="2"/>
    <text x="38" y="17" fill="#22d3ee" fontSize="13" fontWeight="bold" textAnchor="middle">C</text>
    <circle cx="36" cy="170" r="12" fill="#0b1733" stroke="#22d3ee" strokeWidth="2"/>
    <text x="36" y="175" fill="#22d3ee" fontSize="13" fontWeight="bold" textAnchor="middle">A</text>
    <circle cx="232" cy="170" r="12" fill="#0b1733" stroke="#22d3ee" strokeWidth="2"/>
    <text x="232" y="175" fill="#22d3ee" fontSize="13" fontWeight="bold" textAnchor="middle">B</text>
    <circle cx="128" cy="61" r="12" fill="#0b1733" stroke="#e879f9" strokeWidth="2"/>
    <text x="128" y="66" fill="#e879f9" fontSize="13" fontWeight="bold" textAnchor="middle">D</text>
  </svg>
);

const SvgQ4 = () => (
  <svg width={270} height={185} viewBox="0 0 270 185" className="lm-kkg-svg" style={{display:'block'}}>
    <rect width="270" height="185" fill="#0b1733" rx="14"/>
    <polygon points="52,22 52,157 218,157" fill="rgba(34,211,238,0.08)"/>
    <line x1="52" y1="22" x2="52" y2="157" stroke="#22d3ee" strokeWidth="2.5"/>
    <line x1="52" y1="157" x2="218" y2="157" stroke="#22d3ee" strokeWidth="2.5"/>
    <line x1="52" y1="22" x2="218" y2="157" stroke="#22d3ee" strokeWidth="2.5"/>
    <rect x="52" y="148" width="9" height="9" fill="rgba(232,121,249,0.2)" stroke="#e879f9" strokeWidth="1.5"/>
    <line x1="52" y1="157" x2="115" y2="74" stroke="#e879f9" strokeWidth="2" strokeDasharray="6,4"/>
    <polyline points="120,78 116,84 111,80" fill="none" stroke="#e879f9" strokeWidth="1.5"/>
    <circle cx="38" cy="12" r="12" fill="#0b1733" stroke="#22d3ee" strokeWidth="2"/>
    <text x="38" y="17" fill="#22d3ee" fontSize="13" fontWeight="bold" textAnchor="middle">C</text>
    <circle cx="36" cy="170" r="12" fill="#0b1733" stroke="#22d3ee" strokeWidth="2"/>
    <text x="36" y="175" fill="#22d3ee" fontSize="13" fontWeight="bold" textAnchor="middle">A</text>
    <circle cx="232" cy="170" r="12" fill="#0b1733" stroke="#22d3ee" strokeWidth="2"/>
    <text x="232" y="175" fill="#22d3ee" fontSize="13" fontWeight="bold" textAnchor="middle">B</text>
    <circle cx="128" cy="61" r="12" fill="#0b1733" stroke="#e879f9" strokeWidth="2"/>
    <text x="128" y="66" fill="#e879f9" fontSize="13" fontWeight="bold" textAnchor="middle">D</text>
    <rect x="62" y="32" width="62" height="16" rx="6" fill="rgba(0,0,0,0.65)"/>
    <text x="93" y="44" fill="#fb923c" fontSize="10" fontWeight="bold" textAnchor="middle">5 cm</text>
    <rect x="142" y="105" width="62" height="16" rx="6" fill="rgba(0,0,0,0.65)"/>
    <text x="173" y="117" fill="#fb923c" fontSize="10" fontWeight="bold" textAnchor="middle">4 cm</text>

  </svg>
);

const SvgQ5a = () => (
  <svg width={255} height={185} viewBox="0 0 255 185" className="lm-kkg-svg" style={{display:'block'}}>
    <rect width="255" height="185" fill="#0b1733" rx="14"/>
    {/* Triangle: C at top-centre, A bottom-left, B bottom-right, right-angle at C */}
    <polygon points="127,18 22,150 215,150" fill="rgba(16,185,129,0.08)"/>
    <line x1="127" y1="18" x2="22" y2="150" stroke="#10b981" strokeWidth="2.5"/>
    <line x1="22" y1="150" x2="215" y2="150" stroke="#10b981" strokeWidth="2.5"/>
    <line x1="127" y1="18" x2="215" y2="150" stroke="#10b981" strokeWidth="2.5"/>
    {/* Altitude CD: perfectly vertical from C(127,18) to D(127,150) so CD ⊥ AB */}
    <line x1="127" y1="18" x2="127" y2="150" stroke="#f472b6" strokeWidth="2" strokeDasharray="6,4"/>
    {/* Right-angle mark at D: vertical CD meets horizontal AB */}
    <polyline points="135,150 135,142 127,142" fill="none" stroke="#f472b6" strokeWidth="1.5"/>
    {/* Right-angle mark at C: angle ACB = 90° */}
    <polyline points="123,23 127,29 131,24" fill="none" stroke="#10b981" strokeWidth="1.5"/>
    {/* Vertex labels */}
    <circle cx="127" cy="6" r="12" fill="#0b1733" stroke="#10b981" strokeWidth="2"/>
    <text x="127" y="11" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">C</text>
    <circle cx="8" cy="164" r="12" fill="#0b1733" stroke="#10b981" strokeWidth="2"/>
    <text x="8" y="169" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">A</text>
    <circle cx="228" cy="164" r="12" fill="#0b1733" stroke="#10b981" strokeWidth="2"/>
    <text x="228" y="169" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">B</text>
    <circle cx="127" cy="164" r="12" fill="#0b1733" stroke="#f472b6" strokeWidth="2"/>
    <text x="127" y="169" fill="#f472b6" fontSize="13" fontWeight="bold" textAnchor="middle">D</text>
    {/* CD = 18 cm label, to the right of the vertical altitude */}
    <rect x="132" y="72" width="34" height="16" rx="6" fill="rgba(0,0,0,0.65)"/>
    <text x="149" y="84" fill="#fde68a" fontSize="10" fontWeight="bold" textAnchor="middle">18 cm</text>
    {/* DB = 6 cm label, above the DB segment */}
    <rect x="153" y="130" width="34" height="16" rx="6" fill="rgba(0,0,0,0.65)"/>
    <text x="170" y="142" fill="#fde68a" fontSize="10" fontWeight="bold" textAnchor="middle">6 cm</text>
    {/* 'a' = AD label, above the AD segment */}
    <rect x="55" y="130" width="34" height="18" rx="7" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="72" y="143" fill="#fbbf24" fontSize="14" fontWeight="bold" textAnchor="middle">a</text>
  </svg>
);

const SvgQ5b = () => (
  <svg width={255} height={185} viewBox="0 0 255 185" className="lm-kkg-svg" style={{display:'block'}}>
    <rect width="255" height="185" fill="#0b1733" rx="14"/>
    <polygon points="100,18 20,150 215,150" fill="rgba(129,140,248,0.08)"/>
    <line x1="100" y1="18" x2="20" y2="150" stroke="#818cf8" strokeWidth="2.5"/>
    <line x1="20" y1="150" x2="215" y2="150" stroke="#818cf8" strokeWidth="2.5"/>
    <line x1="100" y1="18" x2="215" y2="150" stroke="#818cf8" strokeWidth="2.5"/>
    <line x1="100" y1="18" x2="107" y2="150" stroke="#f472b6" strokeWidth="2" strokeDasharray="6,4"/>
    <polyline points="98,150 98,141 107,141" fill="none" stroke="#f472b6" strokeWidth="1.5"/>
    <polyline points="96,24 101,29 105,23" fill="none" stroke="#f472b6" strokeWidth="1.5"/>
    <circle cx="100" cy="6" r="12" fill="#0b1733" stroke="#818cf8" strokeWidth="2"/>
    <text x="100" y="11" fill="#818cf8" fontSize="13" fontWeight="bold" textAnchor="middle">G</text>
    <circle cx="6" cy="164" r="12" fill="#0b1733" stroke="#818cf8" strokeWidth="2"/>
    <text x="6" y="169" fill="#818cf8" fontSize="13" fontWeight="bold" textAnchor="middle">E</text>
    <circle cx="228" cy="164" r="12" fill="#0b1733" stroke="#818cf8" strokeWidth="2"/>
    <text x="228" y="169" fill="#818cf8" fontSize="13" fontWeight="bold" textAnchor="middle">F</text>
    <circle cx="107" cy="164" r="12" fill="#0b1733" stroke="#f472b6" strokeWidth="2"/>
    <text x="107" y="169" fill="#f472b6" fontSize="13" fontWeight="bold" textAnchor="middle">H</text>
    <rect x="113" y="76" width="30" height="20" rx="7" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="128" y="91" fill="#fbbf24" fontSize="14" fontWeight="bold" textAnchor="middle">b</text>
  </svg>
);

const SvgQ5c = () => (
  <svg width={255} height={185} viewBox="0 0 255 185" className="lm-kkg-svg" style={{display:'block'}}>
    <rect width="255" height="185" fill="#0b1733" rx="14"/>
    <polygon points="55,18 20,150 215,150" fill="rgba(168,85,247,0.08)"/>
    <line x1="55" y1="18" x2="20" y2="150" stroke="#a855f7" strokeWidth="2.5"/>
    <line x1="20" y1="150" x2="215" y2="150" stroke="#a855f7" strokeWidth="2.5"/>
    <line x1="55" y1="18" x2="215" y2="150" stroke="#a855f7" strokeWidth="2.5"/>
    <line x1="55" y1="18" x2="59" y2="150" stroke="#f472b6" strokeWidth="2" strokeDasharray="6,4"/>
    <polyline points="50,150 50,141 59,141" fill="none" stroke="#f472b6" strokeWidth="1.5"/>
    <polyline points="53,25 59,30 61,23" fill="none" stroke="#f472b6" strokeWidth="1.5"/>
    <circle cx="55" cy="6" r="12" fill="#0b1733" stroke="#a855f7" strokeWidth="2"/>
    <text x="55" y="11" fill="#a855f7" fontSize="13" fontWeight="bold" textAnchor="middle">L</text>
    <circle cx="6" cy="164" r="12" fill="#0b1733" stroke="#a855f7" strokeWidth="2"/>
    <text x="6" y="169" fill="#a855f7" fontSize="13" fontWeight="bold" textAnchor="middle">K</text>
    <circle cx="228" cy="164" r="12" fill="#0b1733" stroke="#a855f7" strokeWidth="2"/>
    <text x="228" y="169" fill="#a855f7" fontSize="13" fontWeight="bold" textAnchor="middle">M</text>
    <circle cx="59" cy="164" r="12" fill="#0b1733" stroke="#f472b6" strokeWidth="2"/>
    <text x="59" y="169" fill="#f472b6" fontSize="13" fontWeight="bold" textAnchor="middle">N</text>
    <rect x="64" y="76" width="30" height="20" rx="7" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="79" y="91" fill="#fbbf24" fontSize="14" fontWeight="bold" textAnchor="middle">c</text>
  </svg>
);

const SvgQ5d = () => (
  <svg width={255} height={185} viewBox="0 0 255 185" className="lm-kkg-svg" style={{display:'block'}}>
    <rect width="255" height="185" fill="#0b1733" rx="14"/>
    <polygon points="52,22 52,158 210,158" fill="rgba(248,113,113,0.08)"/>
    <line x1="52" y1="22" x2="52" y2="158" stroke="#f87171" strokeWidth="2.5"/>
    <line x1="52" y1="158" x2="210" y2="158" stroke="#f87171" strokeWidth="2.5"/>
    <line x1="52" y1="22" x2="210" y2="158" stroke="#f87171" strokeWidth="2.5"/>
    <rect x="52" y="149" width="9" height="9" fill="rgba(248,113,113,0.2)" stroke="#f87171" strokeWidth="1.5"/>
    <line x1="52" y1="158" x2="109" y2="71" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6,4"/>
    <polyline points="114,76 110,81 105,77" fill="none" stroke="#22d3ee" strokeWidth="1.5"/>
    <circle cx="38" cy="10" r="12" fill="#0b1733" stroke="#f87171" strokeWidth="2"/>
    <text x="38" y="15" fill="#f87171" fontSize="13" fontWeight="bold" textAnchor="middle">T</text>
    <circle cx="36" cy="172" r="12" fill="#0b1733" stroke="#f87171" strokeWidth="2"/>
    <text x="36" y="177" fill="#f87171" fontSize="13" fontWeight="bold" textAnchor="middle">R</text>
    <circle cx="222" cy="172" r="12" fill="#0b1733" stroke="#f87171" strokeWidth="2"/>
    <text x="222" y="177" fill="#f87171" fontSize="13" fontWeight="bold" textAnchor="middle">S</text>
    <circle cx="122" cy="59" r="12" fill="#0b1733" stroke="#22d3ee" strokeWidth="2"/>
    <text x="122" y="64" fill="#22d3ee" fontSize="13" fontWeight="bold" textAnchor="middle">U</text>
    <rect x="157" y="98" width="30" height="20" rx="7" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="172" y="113" fill="#fbbf24" fontSize="14" fontWeight="bold" textAnchor="middle">d</text>
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
  Qn(2, "Garis Tinggi dari Sudut Siku-Siku", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="C" labelBotL="A" labelBotR="B" labelMid="H" sideA="AC" sideB="AH=9" sideC="HB=16" altLabel="CH" color1="#34d399" color2="#6ee7b7" color3="#059669" rightAngleAtTop/>,
    content: "Segitiga siku-siku ACB dengan ∠C = 90°. CH ⊥ AB.",
    parts: [
      { label: "a.", math: "CH^2 = AH \\cdot HB = 9 \\times 16 = \\ldots \\Rightarrow CH = \\ldots" },
      { label: "b.", math: "AC^2 = AH \\cdot AB = 9 \\times 25 = \\ldots \\Rightarrow AC = \\ldots" },
      { label: "c.", math: "BC^2 = HB \\cdot AB = 16 \\times 25 = \\ldots \\Rightarrow BC = \\ldots" },
    ],
  }),
  Qn(3, "Mencari Panjang AD", {
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
  Qn(4, "Mencari AD, AB, dan AC", {
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
  Qn(5, "Mencari Panjang AB", {
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
  Qn(6, "Mencari Nilai a = AD", {
    type: "pilgan",
    diagram: <SvgQ5a />,
    content: "Pada gambar berikut, segitiga siku-siku di C dengan CD ⊥ AB. Diketahui CD = 18 cm dan DB = 6 cm. Nilai a = AD adalah …",
    options: [
      { label: "A.", text: "48 cm" },
      { label: "B.", text: "54 cm" },
      { label: "C.", text: "60 cm" },
      { label: "D.", text: "72 cm" },
    ],
  }),
  Qn(7, "Mencari Nilai b = GH", {
    type: "pilgan",
    diagram: <SvgQ5b />,
    content: "Pada gambar berikut, segitiga siku-siku di G dengan GH ⊥ EF. Diketahui EH = 4 cm dan HF = 5 cm. Nilai b = GH adalah …",
    options: [
      { label: "A.", text: "2√5 cm" },
      { label: "B.", text: "3√5 cm" },
      { label: "C.", text: "4√5 cm" },
      { label: "D.", text: "5√5 cm" },
    ],
  }),
  Qn(8, "Mencari Nilai c = LN", {
    type: "pilgan",
    diagram: <SvgQ5c />,
    content: "Pada gambar berikut, segitiga siku-siku di L dengan LN ⊥ KM. Diketahui KN = 4 cm dan NM = 25 cm. Nilai c = LN adalah …",
    options: [
      { label: "A.", text: "8 cm" },
      { label: "B.", text: "9 cm" },
      { label: "C.", text: "10 cm" },
      { label: "D.", text: "12 cm" },
    ],
  }),
  Qn(9, "Mencari Nilai d = US", {
    type: "pilgan",
    diagram: <SvgQ5d />,
    content: "Pada gambar berikut, segitiga TRS siku-siku di R dengan RU ⊥ TS. Diketahui TR = 9 cm dan RS = 12 cm. Nilai d = US adalah …",
    options: [
      { label: "A.", text: "7,2 cm" },
      { label: "B.", text: "8,0 cm" },
      { label: "C.", text: "9,6 cm" },
      { label: "D.", text: "10,8 cm" },
    ],
  }),
];

const RasioRusukPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Kesebangunan & Kekongruenan · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 9 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4 lm-kkg-hint">
          <p className="text-emerald-300 text-xs font-bold mb-2">{t('practice.keyFormula')} – Garis Tinggi Siku-Siku</p>
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
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur lm-kkg-overlay" />
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
            {t('practice.backTo')} Kesebangunan & Kekongruenan
          </button>
        </div>
      </div>
    </div>
  );
};

export default RasioRusukPage;
