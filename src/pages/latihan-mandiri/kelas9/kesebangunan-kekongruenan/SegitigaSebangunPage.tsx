import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Triangle } from "lucide-react";
import { SimilarTriangles, ParallelLinesTriangle, TriangleAltitude } from "./GeoFigure";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string; };
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const Q1TriSTSVG = () => (
  <svg viewBox="0 0 320 140" width="310" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="160,15 20,115 300,115" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="104" y1="55" x2="216" y2="55" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="155" y="11" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">R</text>
    <text x="6" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">P</text>
    <text x="302" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">Q</text>
    <text x="88" y="53" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">S</text>
    <text x="219" y="53" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">T</text>
    <text x="78" y="32" fill="#c084fc" fontSize="10" fontWeight="bold">RS = 4 cm</text>
    <text x="10" y="82" fill="#c084fc" fontSize="10" fontWeight="bold">SP = 6 cm</text>
    <text x="143" y="131" fill="#fbbf24" fontSize="10" fontWeight="bold">PQ = 20 cm</text>
    <text x="136" y="49" fill="#fb923c" fontSize="11" fontWeight="bold">ST = ?</text>
  </svg>
);

const Q2TriDESVG = () => (
  <svg viewBox="0 0 320 140" width="310" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="160,15 20,120 300,120" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="113" y1="50" x2="207" y2="50" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="155" y="11" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">A</text>
    <text x="6" y="127" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">B</text>
    <text x="302" y="127" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">C</text>
    <text x="96" y="48" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">D</text>
    <text x="210" y="48" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">E</text>
    <text x="102" y="28" fill="#c084fc" fontSize="10" fontWeight="bold">AD = 5 cm</text>
    <text x="10" y="80" fill="#c084fc" fontSize="10" fontWeight="bold">DB = 10 cm</text>
    <text x="136" y="44" fill="#fbbf24" fontSize="10" fontWeight="bold">DE = 7 cm</text>
    <text x="143" y="134" fill="#fb923c" fontSize="11" fontWeight="bold">BC = ?</text>
  </svg>
);

const Q3CrossLinesSVG = () => (
  <svg viewBox="0 0 270 160" width="265" height="155" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="136,21 215,10 170,55" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="1.2"/>
    <polygon points="221,106 170,55 102,123" fill="rgba(124,58,237,0.12)" stroke="#7c3aed" strokeWidth="1.2"/>
    <line x1="136" y1="21" x2="221" y2="106" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="215" y1="10" x2="102" y2="123" stroke="#7c3aed" strokeWidth="1.5"/>
    <line x1="136" y1="21" x2="215" y2="10" stroke="#c084fc" strokeWidth="1.3"/>
    <line x1="221" y1="106" x2="102" y2="123" stroke="#c084fc" strokeWidth="1.3"/>
    <text x="122" y="18" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">A</text>
    <text x="218" y="8" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">B</text>
    <text x="173" y="68" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">O</text>
    <text x="225" y="112" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">C</text>
    <text x="88" y="128" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">D</text>
    <text x="98" y="38" fill="#c084fc" fontSize="10" fontWeight="bold">OA = 6 cm</text>
    <text x="198" y="28" fill="#fbbf24" fontSize="10" fontWeight="bold">OB = x</text>
    <text x="215" y="86" fill="#c084fc" fontSize="10" fontWeight="bold">OC = 9 cm</text>
    <text x="58" y="98" fill="#c084fc" fontSize="10" fontWeight="bold">OD = 12 cm</text>
  </svg>
);

const Q4TriRTSVG = () => (
  <svg viewBox="0 0 320 140" width="310" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="160,15 20,120 300,120" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="113" y1="50" x2="207" y2="50" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="155" y="11" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">P</text>
    <text x="6" y="127" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">Q</text>
    <text x="302" y="127" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">S</text>
    <text x="96" y="48" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">R</text>
    <text x="210" y="48" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">T</text>
    <text x="103" y="28" fill="#c084fc" fontSize="10" fontWeight="bold">PR = 5 cm</text>
    <text x="10" y="80" fill="#c084fc" fontSize="10" fontWeight="bold">RQ = 10 cm</text>
    <text x="136" y="44" fill="#fb923c" fontSize="10" fontWeight="bold">RT = ?</text>
    <text x="140" y="134" fill="#fbbf24" fontSize="10" fontWeight="bold">QS = 21 cm</text>
  </svg>
);

const Q6TriDE2SVG = () => (
  <svg viewBox="0 0 320 140" width="310" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="160,15 20,115 300,115" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="104" y1="57" x2="216" y2="57" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="155" y="11" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">A</text>
    <text x="6" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">B</text>
    <text x="302" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">C</text>
    <text x="87" y="55" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">D</text>
    <text x="219" y="55" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">E</text>
    <text x="85" y="33" fill="#c084fc" fontSize="10" fontWeight="bold">AD = 16 cm</text>
    <text x="10" y="85" fill="#c084fc" fontSize="10" fontWeight="bold">DB = 24 cm</text>
    <text x="133" y="51" fill="#fbbf24" fontSize="10" fontWeight="bold">DE = 18 cm</text>
    <text x="143" y="130" fill="#fb923c" fontSize="11" fontWeight="bold">BC = ?</text>
  </svg>
);

const Q7MedianESVG = () => (
  <svg viewBox="0 0 270 185" width="265" height="180" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="50,90 230,90 95,20" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="95" y1="20" x2="140" y2="90" stroke="#c084fc" strokeWidth="1.5"/>
    <line x1="140" y1="90" x2="185" y2="160" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="230" y1="90" x2="185" y2="160" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="112" y1="59" x2="118" y2="51" stroke="#fbbf24" strokeWidth="1.5"/>
    <line x1="157" y1="129" x2="163" y2="121" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="36" y="94" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">A</text>
    <text x="232" y="94" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">B</text>
    <text x="86" y="15" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">C</text>
    <text x="132" y="106" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">D</text>
    <text x="182" y="173" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">E</text>
    <text x="22" y="56" fill="#c084fc" fontSize="10" fontWeight="bold">AC = 10 cm</text>
    <text x="88" y="107" fill="#fbbf24" fontSize="9" fontWeight="bold">AD=DB=8cm</text>
    <text x="192" y="128" fill="#fb923c" fontSize="10" fontWeight="bold">BE = ?</text>
    <text x="108" y="43" fill="#fbbf24" fontSize="9">CD=DE</text>
  </svg>
);

const Q10TrapSVG = () => (
  <svg viewBox="0 0 265 140" width="258" height="135" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="60,20 200,20 240,120 20,120" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <line x1="36" y1="80" x2="224" y2="80" stroke="#c084fc" strokeWidth="1.8"/>
    <text x="48" y="16" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">P</text>
    <text x="202" y="16" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">Q</text>
    <text x="242" y="125" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">S</text>
    <text x="5" y="125" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">R</text>
    <text x="22" y="78" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">E</text>
    <text x="228" y="78" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">F</text>
    <text x="105" y="14" fill="#fbbf24" fontSize="10" fontWeight="bold">PQ = 8 cm</text>
    <text x="105" y="135" fill="#fbbf24" fontSize="10" fontWeight="bold">RS = 18 cm</text>
    <text x="108" y="74" fill="#fb923c" fontSize="11" fontWeight="bold">EF = ?</text>
    <text x="220" y="48" fill="#c084fc" fontSize="10" fontWeight="bold">QF=3cm</text>
    <text x="230" y="102" fill="#c084fc" fontSize="10" fontWeight="bold">FS=2cm</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Segitiga Sebangun – Cari ST – UN", {
    type: "mixed",
    content: "Dengan memperhatikan gambar di bawah, panjang ST adalah ....",
    diagram: <Q1TriSTSVG />,
    parts: [
      { label: "A.", text: "6 cm" },
      { label: "B.", text: "7 cm" },
      { label: "C.", text: "8 cm" },
      { label: "D.", text: "10 cm" },
    ],
  }),
  Qn(2, "Garis Sejajar – Cari BC – UN", {
    type: "mixed",
    content: "Perhatikan gambar berikut! Panjang BC adalah ....",
    diagram: <Q2TriDESVG />,
    parts: [
      { label: "A.", text: "14 cm" },
      { label: "B.", text: "18 cm" },
      { label: "C.", text: "21 cm" },
      { label: "D.", text: "28 cm" },
    ],
  }),
  Qn(3, "Dua Segitiga Berpotongan – Nilai x – UN", {
    type: "mixed",
    content: "Pada gambar di bawah ini, AB // CD. Nilai OB adalah ....",
    diagram: <Q3CrossLinesSVG />,
    parts: [
      { label: "A.", text: "6 cm" },
      { label: "B.", text: "7 cm" },
      { label: "C.", text: "8 cm" },
      { label: "D.", text: "10 cm" },
    ],
  }),
  Qn(4, "Garis Sejajar dalam Segitiga – Cari RT – UN", {
    type: "mixed",
    content: "Jika panjang PQ = 15 cm, PR = 5 cm, dan QS = 21 cm, maka RT = ....",
    diagram: <Q4TriRTSVG />,
    parts: [
      { label: "A.", text: "5 cm" },
      { label: "B.", text: "6 cm" },
      { label: "C.", text: "7 cm" },
      { label: "D.", text: "9 cm" },
    ],
  }),
  Qn(5, "Garis Tinggi Segitiga Siku-Siku – Cari BD – UN", {
    type: "mixed",
    content: "Pada gambar, CD ⊥ AB. Diketahui CD = 12 cm dan AD = 9 cm. Panjang BD adalah ....",
    diagram: <TriangleAltitude labelTop="C" labelBotL="A" labelBotR="B" labelMid="D" sideA="AC" sideB="AD = 9 cm" sideC="BD = ?" altLabel="CD = 12 cm" color1="#a78bfa" color2="#c084fc" color3="#7c3aed"/>,
    parts: [
      { label: "A.", text: "9 cm" },
      { label: "B.", text: "12 cm" },
      { label: "C.", text: "16 cm" },
      { label: "D.", text: "20 cm" },
    ],
  }),
  Qn(6, "Garis Sejajar – Cari BC – ANBK", {
    type: "mixed",
    content: "Perhatikan gambar berikut! DE // BC. Panjang BC adalah ....",
    diagram: <Q6TriDE2SVG />,
    parts: [
      { label: "A.", text: "27 cm" },
      { label: "B.", text: "36 cm" },
      { label: "C.", text: "45 cm" },
      { label: "D.", text: "54 cm" },
    ],
  }),
  Qn(7, "Median Diperpanjang – Cari BE – ANBK", {
    type: "mixed",
    content: "Garis tengah (median) CD dari △ABC, dengan D titik tengah AB, diperpanjang hingga DE = CD. Jika AC = 10 cm dan AD = DB = 8 cm, maka panjang BE adalah ....",
    diagram: <Q7MedianESVG />,
    parts: [
      { label: "A.", text: "8 cm" },
      { label: "B.", text: "9 cm" },
      { label: "C.", text: "10 cm" },
      { label: "D.", text: "12 cm" },
    ],
  }),
  Qn(8, "Segitiga Sama Kaki – Perbandingan Sisi – ANBK", {
    type: "mixed",
    content: "Diketahui △PQR adalah segitiga sama kaki dengan PQ = PR. Titik M pada PQ dan titik N pada PR sedemikian sehingga MN // QR. Jika PQ : PM = 4 : 3, maka PR : PN adalah ....",
    parts: [
      { label: "A.", math: "4 : 3" },
      { label: "B.", math: "3 : 4" },
      { label: "C.", math: "3 : 2" },
      { label: "D.", math: "2 : 3" },
    ],
  }),
  Qn(9, "Garis Sejajar – Perbandingan AQ : QC – TKA", {
    type: "mixed",
    content: "Diketahui △ABC. Titik P pada AB dan titik Q pada AC sedemikian sehingga PQ // BC. Jika panjang AP = 6 cm dan AB = 10 cm, maka AQ : QC adalah ....",
    parts: [
      { label: "A.", math: "2 : 3" },
      { label: "B.", math: "3 : 2" },
      { label: "C.", math: "3 : 5" },
      { label: "D.", math: "5 : 3" },
    ],
  }),
  Qn(10, "Trapesium – Cari EF – TKA", {
    type: "mixed",
    content: "Jika panjang PQ = 8 cm, RS = 18 cm, QF = 3 cm, dan FS = 2 cm, maka panjang EF adalah ....",
    diagram: <Q10TrapSVG />,
    parts: [
      { label: "A.", text: "10 cm" },
      { label: "B.", text: "11 cm" },
      { label: "C.", text: "12 cm" },
      { label: "D.", text: "14 cm" },
    ],
  }),
  Qn(11, "Syarat AA – Dua Sudut Sama", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["D","E","F"]} sideLabels1={["","",""]} sideLabels2={["","",""]} color1="#a78bfa" color2="#c084fc" type="scalene"/>,
    content: "∠A = ∠D = 50°, ∠B = ∠E = 70°. Maka ∠C = ∠F = 60°.",
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan syarat AA (Sudut-Sudut) untuk kesebangunan segitiga?" },
      { label: "b.", text: "Apakah △ABC ~ △DEF? Jelaskan menggunakan syarat AA." },
      { label: "c.", math: "\\text{Jika AB = 6 cm, DE = 9 cm, BC = 8 cm, maka EF = ?}" },
    ],
  }),
  Qn(12, "Syarat SAS – Sisi-Sudut-Sisi", {
    type: "mixed",
    content: "△ABC dan △PQR. AB = 4 cm, AC = 6 cm, ∠A = 50°. PQ = 6 cm, PR = 9 cm, ∠P = 50°.",
    parts: [
      { label: "a.", math: "\\frac{AB}{PQ} = \\frac{4}{6} = \\frac{2}{3}, \\quad \\frac{AC}{PR} = \\frac{6}{9} = \\frac{2}{3}" },
      { label: "b.", text: "Apakah △ABC ~ △PQR dengan syarat SAS? Jelaskan." },
      { label: "c.", math: "\\text{Maka } \\frac{BC}{QR} = \\frac{2}{3} \\Rightarrow QR = \\ldots" },
    ],
  }),
  Qn(13, "Syarat SSS – Tiga Sisi Sebanding", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["P","Q","R"]} sideLabels1={["4","6","8"]} sideLabels2={["6","9","12"]} color1="#a78bfa" color2="#7c3aed" type="scalene"/>,
    parts: [
      { label: "a.", math: "\\frac{AB}{PQ} = \\frac{4}{6}, \\quad \\frac{BC}{QR} = \\frac{6}{9}, \\quad \\frac{AC}{PR} = \\frac{8}{12}" },
      { label: "b.", text: "Sederhanakan setiap pecahan. Apakah semua sama?" },
      { label: "c.", text: "Apakah △ABC ~ △PQR? Berapa faktor skalanya?" },
    ],
  }),
  Qn(14, "Segitiga dalam Segitiga", {
    type: "mixed",
    diagram: <ParallelLinesTriangle topLabel="DE" botLabel="BC" leftA="AD=3" leftB="DB=6" rightA="AE=4" rightB="EC=8" topSide="DE=5" botSide="BC=15" color1="#a78bfa" color2="#7c3aed"/>,
    content: "DE ∥ BC, sehingga △ADE ~ △ABC.",
    parts: [
      { label: "a.", text: "Mengapa DE ∥ BC menjamin △ADE ~ △ABC?" },
      { label: "b.", math: "\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC} = \\frac{3}{9} = \\frac{1}{3}" },
      { label: "c.", text: "Hitunglah AB dan AC." },
    ],
  }),
  Qn(15, "Teorema Thales – Proporsi", {
    type: "mixed",
    diagram: <ParallelLinesTriangle topLabel="PQ" botLabel="RS" leftA="AP=2" leftB="PR=4" rightA="AQ=3" rightB="QS=?" topSide="PQ=5" botSide="RS=15" color1="#a78bfa" color2="#c084fc"/>,
    parts: [
      { label: "a.", math: "\\frac{AP}{PR} = \\frac{AQ}{QS} \\Rightarrow \\frac{2}{4} = \\frac{3}{QS}" },
      { label: "b.", text: "Hitunglah QS." },
      { label: "c.", math: "\\frac{PQ}{RS} = \\frac{AP}{AR} = \\frac{2}{6} = \\ldots" },
    ],
  }),
  Qn(16, "Dua Segitiga dalam Satu Gambar", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="A" labelBotL="B" labelBotR="C" labelMid="D" sideA="AB" sideB="BD=4" sideC="DC=9" altLabel="AD" color1="#a78bfa" color2="#c084fc" color3="#7c3aed"/>,
    content: "AD ⊥ BC. Segitiga ABD dan CBA sebangun.",
    parts: [
      { label: "a.", text: "Sebutkan pasangan sudut yang sama antara △ABD dan △CBA." },
      { label: "b.", math: "\\frac{BD}{AB} = \\frac{AB}{BC} \\Rightarrow AB^2 = BD \\cdot BC" },
      { label: "c.", math: "AB = \\sqrt{4 \\times (4+9)} = \\ldots" },
    ],
  }),
  Qn(17, "Segitiga Siku-Siku Sebangun", {
    type: "mixed",
    content: "△ABC siku-siku di B dengan AB = 6, BC = 8. △PQR siku-siku di Q. Jika △ABC ~ △PQR dan PQ = 9.",
    parts: [
      { label: "a.", math: "AC = \\sqrt{6^2 + 8^2} = \\ldots" },
      { label: "b.", text: "Tentukan faktor skala dari △ABC ke △PQR." },
      { label: "c.", text: "Tentukan QR dan PR." },
    ],
  }),
  Qn(18, "Mencari Sudut yang Tidak Diketahui", {
    type: "mixed",
    content: "△KLM ~ △XYZ. ∠K = 40°, ∠L = 2x + 10°, ∠Y = 3x − 20°.",
    parts: [
      { label: "a.", math: "∠L = ∠Y \\Rightarrow 2x + 10 = 3x - 20" },
      { label: "b.", text: "Selesaikan untuk x." },
      { label: "c.", text: "Hitunglah besar ∠L, ∠Y, dan ∠M." },
    ],
  }),
  Qn(19, "Dua Segitiga Berpotongan", {
    type: "mixed",
    content: "Dua garis berpotongan di titik O. Titik A, O, C segaris dan B, O, D segaris. Sehingga △AOB ~ △COD.",
    parts: [
      { label: "a.", text: "Jelaskan mengapa ∠AOB = ∠COD (sudut bertolak belakang)." },
      { label: "b.", text: "Jika AB ∥ CD, jelaskan mengapa ∠OAB = ∠OCD (sudut dalam bersilang)." },
      { label: "c.", math: "\\frac{OA}{OC} = \\frac{OB}{OD} = \\frac{AB}{CD}" },
    ],
  }),
  Qn(20, "Segitiga Sebangun – Soal UN", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["P","Q","R"]} sideLabels1={["3","4","5"]} sideLabels2={["4,5","6","7,5"]} color1="#7c3aed" color2="#a78bfa" type="right"/>,
    parts: [
      { label: "a.", text: "Periksa apakah △ABC ~ △PQR dengan syarat SSS." },
      { label: "b.", text: "Tentukan faktor skala." },
      { label: "c.", math: "\\frac{\\text{Luas } △PQR}{\\text{Luas } △ABC} = k^2 = \\ldots" },
    ],
  }),
  Qn(21, "Membuktikan Kesebangunan – AA", {
    type: "mixed",
    content: "Dalam segitiga ABC, D pada AB dan E pada AC sehingga DE ∥ BC. ∠ADE = ∠ABC dan ∠AED = ∠ACB.",
    parts: [
      { label: "a.", text: "Mengapa ∠ADE = ∠ABC? (sudut sehadap dengan dua garis sejajar)" },
      { label: "b.", text: "Apakah △ADE ~ △ABC? Gunakan syarat AA." },
      { label: "c.", math: "\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC}" },
    ],
  }),
  Qn(22, "Segitiga Sebangun dalam Trapesium", {
    type: "mixed",
    content: "Trapesium ABCD dengan AB ∥ DC. Diagonal AC dan BD berpotongan di O.",
    parts: [
      { label: "a.", text: "Buktikan bahwa △AOB ~ △COD (gunakan sudut bertolak belakang dan sudut dalam bersilang)." },
      { label: "b.", math: "\\frac{OA}{OC} = \\frac{OB}{OD} = \\frac{AB}{DC}" },
      { label: "c.", text: "Jika AB = 12, DC = 8, OA = 6, hitunglah OC." },
    ],
  }),
  Qn(23, "Sudut-Sudut Sebangun – Soal Campuran", {
    type: "mixed",
    content: "△RST ~ △XYZ. ∠R = 70°, ∠S = 3x + 5°, ∠X = 70°, ∠Y = 5x − 15°.",
    parts: [
      { label: "a.", math: "3x + 5 = 5x - 15 \\Rightarrow x = \\ldots" },
      { label: "b.", text: "Tentukan besar ∠S dan ∠Z." },
      { label: "c.", math: "\\text{Jika RS = 8, XY = 12, ST = 6, maka YZ = ?}" },
    ],
  }),
  Qn(24, "Garis Tinggi dari Sudut Siku-Siku", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="C" labelBotL="A" labelBotR="B" labelMid="H" sideA="CA=?" sideB="AH=9" sideC="HB=16" altLabel="CH" color1="#a78bfa" color2="#c084fc" color3="#7c3aed"/>,
    content: "△CHB ~ △ACH ~ △ACB. ∠ACB = 90°, CH ⊥ AB.",
    parts: [
      { label: "a.", math: "CH^2 = AH \\cdot HB = 9 \\times 16 = \\ldots \\Rightarrow CH = \\ldots" },
      { label: "b.", math: "CA^2 = AH \\cdot AB = 9 \\times 25 = \\ldots \\Rightarrow CA = \\ldots" },
      { label: "c.", math: "CB^2 = HB \\cdot AB = 16 \\times 25 = \\ldots \\Rightarrow CB = \\ldots" },
    ],
  }),
  Qn(25, "Segitiga Sebangun – ANBK Style", {
    type: "mixed",
    content: "Perhatikan dua segitiga. △ABC dengan ∠B = 90°, ∠A = 30°. △PQR dengan ∠Q = 90°, ∠P = 30°. Apakah sebangun?",
    parts: [
      { label: "a.", text: "Berapakah ∠C dan ∠R? Apakah semua sudut yang bersesuaian sama?" },
      { label: "b.", text: "Apakah △ABC ~ △PQR? Syarat apa yang digunakan?" },
      { label: "c.", math: "\\text{Jika AB = 5 cm, BC = 5\\sqrt{3} cm, PQ = 8 cm, maka QR = ?}" },
    ],
  }),
  Qn(26, "Dua Segitiga yang Tumpang Tindih", {
    type: "mixed",
    content: "Segitiga besar XYZ dengan titik A pada XY dan B pada XZ sehingga AB ∥ YZ. XA = 4, AY = 8, XB = 5.",
    parts: [
      { label: "a.", math: "\\frac{XA}{XY} = \\frac{XA}{XA+AY} = \\frac{4}{12} = \\frac{1}{3}" },
      { label: "b.", text: "Hitunglah BZ menggunakan Teorema Thales." },
      { label: "c.", math: "\\frac{AB}{YZ} = \\frac{1}{3} \\Rightarrow \\text{jika YZ = 18, maka AB = ?}" },
    ],
  }),
  Qn(27, "Perbandingan Luas Dua Segitiga Sebangun", {
    type: "mixed",
    content: "△KLM ~ △PQR dengan faktor skala 3 : 5. Luas △KLM = 27 cm².",
    parts: [
      { label: "a.", math: "\\frac{L_{PQR}}{L_{KLM}} = \\left(\\frac{5}{3}\\right)^2 = \\frac{25}{9}" },
      { label: "b.", text: "Hitunglah luas △PQR." },
      { label: "c.", text: "Hitunglah selisih luas kedua segitiga itu." },
    ],
  }),
  Qn(28, "Segitiga dalam Segitiga – Soal TKA", {
    type: "mixed",
    diagram: <ParallelLinesTriangle topLabel="MN" botLabel="AB" leftA="CM=2" leftB="MA=3" rightA="CN=3" rightB="NB=?" topSide="MN=4" botSide="AB=?" color1="#a78bfa" color2="#7c3aed"/>,
    parts: [
      { label: "a.", math: "\\frac{CM}{MA} = \\frac{CN}{NB} \\Rightarrow \\frac{2}{3} = \\frac{3}{NB}" },
      { label: "b.", text: "Hitunglah NB." },
      { label: "c.", math: "\\frac{MN}{AB} = \\frac{CM}{CA} = \\frac{2}{5} \\Rightarrow AB = \\ldots" },
    ],
  }),
  Qn(29, "Sudut Bersesuaian – Aplikasi", {
    type: "mixed",
    content: "Dua segitiga bertemu di satu titik. △ABC dan △DEC di mana ∠ACB = ∠DCE (bertolak belakang), ∠A = ∠D = 45°.",
    parts: [
      { label: "a.", text: "Apakah △ABC ~ △DEC? Gunakan syarat AA." },
      { label: "b.", math: "\\frac{AB}{DE} = \\frac{BC}{EC} = \\frac{AC}{DC}" },
      { label: "c.", text: "Jika AB = 6, DE = 4, BC = 9, hitunglah EC." },
    ],
  }),
  Qn(30, "Membuktikan Segitiga Sebangun – SAS", {
    type: "mixed",
    content: "△MNO dan △PQO dengan O titik persekutuan. MO = 6, OP = 9, NO = 4, OQ = 6. ∠MON = ∠POQ.",
    parts: [
      { label: "a.", math: "\\frac{MO}{PO} = \\frac{6}{9} = \\frac{2}{3}, \\quad \\frac{NO}{QO} = \\frac{4}{6} = \\frac{2}{3}" },
      { label: "b.", text: "Apakah △MNO ~ △PQO dengan syarat SAS?" },
      { label: "c.", math: "\\frac{MN}{PQ} = \\frac{2}{3} \\Rightarrow \\text{jika MN = 5, maka PQ = ?}" },
    ],
  }),
  Qn(31, "Tinggi Segitiga dari Kesebangunan", {
    type: "mixed",
    content: "△ABC siku-siku di C. CD ⊥ AB. AB = 25, AD = 9.",
    parts: [
      { label: "a.", math: "DB = AB - AD = 25 - 9 = \\ldots" },
      { label: "b.", math: "CD^2 = AD \\cdot DB = 9 \\times 16 = \\ldots \\Rightarrow CD = \\ldots" },
      { label: "c.", math: "AC^2 = AD \\cdot AB = 9 \\times 25 = \\ldots \\Rightarrow AC = \\ldots" },
    ],
  }),
  Qn(32, "Membuktikan AA dari Konteks", {
    type: "mixed",
    content: "Diketahui garis p ∥ q. Garis transversal memotong p di A dan q di B. Garis lain memotong p di C dan q di D. Keempat titik membentuk dua segitiga yang sebangun.",
    parts: [
      { label: "a.", text: "Sebutkan pasangan sudut-sudut yang sama karena garis sejajar." },
      { label: "b.", text: "Tuliskan pernyataan kesebangunan kedua segitiga dengan notasi yang benar." },
      { label: "c.", text: "Tuliskan perbandingan sisi-sisi yang bersesuaian." },
    ],
  }),
  Qn(33, "Segitiga Sebangun – Mencari Panjang", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["R","S","T"]} vertices2={["X","Y","Z"]} sideLabels1={["7","?","11"]} sideLabels2={["10,5","9","?"]} color1="#a78bfa" color2="#c084fc" type="scalene"/>,
    parts: [
      { label: "a.", text: "Tentukan faktor skala dari △RST ke △XYZ menggunakan RS dan XY." },
      { label: "b.", text: "Hitunglah ST dan XZ." },
      { label: "c.", text: "Hitunglah keliling △XYZ jika keliling △RST = 28 cm." },
    ],
  }),
  Qn(34, "Kesebangunan Terbalik", {
    type: "mixed",
    content: "△ABC ~ △CBA artinya △ABC dicerminkan terhadap sumbu simetri AC, menghasilkan △CBA.",
    parts: [
      { label: "a.", text: "Apakah △ABC ~ △CBA selalu benar? Jenis segitiga apa yang memiliki simetri ini?" },
      { label: "b.", text: "Untuk segitiga sama kaki dengan AB = CB, apakah △ABC ~ △CBA?" },
      { label: "c.", text: "Apakah △ABC ≅ △CBA untuk segitiga sama kaki?" },
    ],
  }),
  Qn(35, "Segitiga Sebangun dari Soal UN 2019", {
    type: "mixed",
    content: "Diketahui △ABC dengan DE ∥ BC. AD = 4, DB = 6, DE = 5. Hitunglah BC.",
    parts: [
      { label: "a.", math: "\\frac{AD}{AB} = \\frac{DE}{BC} \\Rightarrow \\frac{4}{10} = \\frac{5}{BC}" },
      { label: "b.", text: "Hitunglah BC." },
      { label: "c.", text: "Hitunglah luas △ADE jika luas △ABC = 75 cm²." },
    ],
  }),
  Qn(36, "Segitiga Sebangun di Koordinat", {
    type: "mixed",
    content: "△OAB dengan O(0,0), A(4,0), B(0,3) dan △OCD dengan C(6,0), D(0,4,5).",
    parts: [
      { label: "a.", text: "Hitunglah OA, OB, OC, OD." },
      { label: "b.", math: "\\frac{OA}{OC} = \\frac{4}{6} = \\frac{2}{3}, \\quad \\frac{OB}{OD} = \\frac{3}{4,5} = \\frac{2}{3}" },
      { label: "c.", text: "Apakah △OAB ~ △OCD? Syarat apa yang digunakan?" },
    ],
  }),
  Qn(37, "Menentukan Panjang dari Dua Segitiga Sebangun", {
    type: "mixed",
    content: "Pada △PQR, titik S di PQ dan T di PR sehingga ST ∥ QR. PS = 3, SQ = 5, PT = 4.",
    parts: [
      { label: "a.", math: "\\frac{PS}{PQ} = \\frac{PT}{PR} \\Rightarrow \\frac{3}{8} = \\frac{4}{PR}" },
      { label: "b.", text: "Hitunglah PR dan TR." },
      { label: "c.", math: "\\frac{ST}{QR} = \\frac{PS}{PQ} = \\frac{3}{8} \\Rightarrow \\text{jika QR = 24, maka ST = ?}" },
    ],
  }),
  Qn(38, "Membedakan AA, SAS, SSS", {
    type: "mixed",
    content: "Untuk setiap pasang segitiga berikut, tentukan syarat kesebangunan yang digunakan (AA, SAS, atau SSS):",
    parts: [
      { label: "a.", text: "△ABC dengan ∠A = 60°, ∠B = 80°. △PQR dengan ∠P = 60°, ∠Q = 80°." },
      { label: "b.", text: "△DEF dengan DE = 4, EF = 6, ∠E = 50°. △XYZ dengan XY = 6, YZ = 9, ∠Y = 50°." },
      { label: "c.", text: "△GHI dengan GH = 3, HI = 4, GI = 5. △JKL dengan JK = 6, KL = 8, JL = 10." },
    ],
  }),
  Qn(39, "Segitiga Sebangun – Soal Kontekstual", {
    type: "mixed",
    content: "Sebuah tangga bersandar di dinding. Kaki tangga 2 m dari dinding. Tinggi dinding yang bisa dicapai tangga 5 m. Tongkat sepanjang 1 m ditaruh pada posisi yang sama, kakinya 0,4 m dari dinding.",
    parts: [
      { label: "a.", text: "Gambarlah situasi ini dalam dua segitiga yang sebangun." },
      { label: "b.", text: "Verifikasi kesebangunan menggunakan perbandingan sisi." },
      { label: "c.", text: "Berapa tinggi yang bisa dicapai tongkat?" },
    ],
  }),
  Qn(40, "Segitiga Sebangun dalam Lingkaran", {
    type: "mixed",
    content: "Dua tali busur AB dan CD berpotongan di P. △APD ~ △CPB.",
    parts: [
      { label: "a.", text: "Sebutkan dua sudut yang sama antara △APD dan △CPB (sudut bertolak belakang dan sudut keliling)." },
      { label: "b.", math: "\\frac{AP}{CP} = \\frac{DP}{BP} = \\frac{AD}{CB}" },
      { label: "c.", text: "Jika AP = 4, CP = 6, DP = 3, hitunglah BP." },
    ],
  }),
  Qn(41, "Mencari Sisi – Soal ANBK Level Tinggi", {
    type: "mixed",
    content: "△ABC ~ △ADE dengan D pada AB dan E pada AC. AD = 5, AB = 15, AE = 4.",
    parts: [
      { label: "a.", math: "\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{1}{3}" },
      { label: "b.", text: "Hitunglah AC." },
      { label: "c.", math: "\\frac{\\text{Luas } △ADE}{\\text{Luas } △ABC} = \\frac{1}{9} \\Rightarrow \\text{jika Luas }△ABC = 45, \\text{ Luas }△ADE = ?" },
    ],
  }),
  Qn(42, "Sudut dan Sisi Sebangun Kompleks", {
    type: "mixed",
    content: "△PQR dengan ∠P = 45°, PQ = 8, PR = 6. △STU dengan ∠S = 45°, ST = 12, SU = 9.",
    parts: [
      { label: "a.", math: "\\frac{PQ}{ST} = \\frac{8}{12} = \\frac{2}{3}, \\quad \\frac{PR}{SU} = \\frac{6}{9} = \\frac{2}{3}" },
      { label: "b.", text: "Apakah △PQR ~ △STU dengan syarat SAS?" },
      { label: "c.", text: "Jika QR = 10, hitunglah TU." },
    ],
  }),
  Qn(43, "Kesebangunan dengan Persamaan", {
    type: "mixed",
    content: "△ABC ~ △DEF. AB = 3x + 1, DE = 5x − 3, BC = 8, EF = 12.",
    parts: [
      { label: "a.", math: "\\frac{AB}{DE} = \\frac{BC}{EF} \\Rightarrow \\frac{3x+1}{5x-3} = \\frac{8}{12}" },
      { label: "b.", text: "Selesaikan untuk x." },
      { label: "c.", text: "Tentukan panjang AB dan DE." },
    ],
  }),
  Qn(44, "Segitiga Sebangun – Panjang Garis Tinggi", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="A" labelBotL="B" labelBotR="C" labelMid="D" sideA="AB=?" sideB="BD=5" sideC="DC=20" altLabel="AD=h" color1="#a78bfa" color2="#c084fc" color3="#7c3aed"/>,
    parts: [
      { label: "a.", math: "AD^2 = BD \\cdot DC = 5 \\times 20 = \\ldots \\Rightarrow AD = \\ldots" },
      { label: "b.", math: "AB^2 = BD \\cdot BC = 5 \\times 25 = \\ldots \\Rightarrow AB = \\ldots" },
      { label: "c.", math: "AC^2 = DC \\cdot BC = 20 \\times 25 = \\ldots \\Rightarrow AC = \\ldots" },
    ],
  }),
  Qn(45, "Garis Bagi Sudut dan Kesebangunan", {
    type: "mixed",
    content: "Dalam △ABC, AD adalah garis bagi ∠A dengan D pada BC. Teorema garis bagi menyatakan BD/DC = AB/AC.",
    parts: [
      { label: "a.", text: "Jika AB = 6, AC = 9, BC = 10, hitunglah BD dan DC menggunakan teorema garis bagi." },
      { label: "b.", text: "Apakah △ABD ~ △ACD? Jelaskan." },
      { label: "c.", math: "\\frac{\\text{Luas }△ABD}{\\text{Luas }△ACD} = \\frac{BD}{DC} = \\ldots" },
    ],
  }),
  Qn(46, "Dua Segitiga Sebangun – Soal TKA", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["P","Q","R"]} sideLabels1={["x","6","?"]} sideLabels2={["10","15","?"]} color1="#7c3aed" color2="#a78bfa" type="scalene"/>,
    content: "△ABC ~ △PQR. AB = x, BC = 6, PQ = 10, QR = 15.",
    parts: [
      { label: "a.", math: "\\frac{AB}{PQ} = \\frac{BC}{QR} \\Rightarrow \\frac{x}{10} = \\frac{6}{15}" },
      { label: "b.", text: "Hitunglah x = AB." },
      { label: "c.", math: "\\frac{\\text{Luas } △ABC}{\\text{Luas } △PQR} = \\left(\\frac{6}{15}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(47, "Kesebangunan Segitiga – Panjang Sisi Ketiga", {
    type: "mixed",
    content: "△MNO ~ △QRS. MN = 12, NO = 15, MO = 9. QR = 8.",
    parts: [
      { label: "a.", text: "Tentukan faktor skala dari △MNO ke △QRS." },
      { label: "b.", text: "Hitunglah RS dan QS." },
      { label: "c.", text: "Hitunglah keliling △QRS." },
    ],
  }),
  Qn(48, "Segitiga Sebangun – Soal Cerita Kontekstual", {
    type: "mixed",
    content: "Sebuah jembatan berbentuk segitiga siku-siku dengan sisi 30 m, 40 m, 50 m. Model miniaturnya memiliki sisi terpendek 6 cm.",
    parts: [
      { label: "a.", text: "Tentukan faktor skala model terhadap asli." },
      { label: "b.", text: "Tentukan dua sisi lainnya pada model." },
      { label: "c.", text: "Apakah model dan jembatan asli sebangun? Berikan alasan." },
    ],
  }),
  Qn(49, "Tiga Segitiga Sebangun dalam Satu Gambar", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="C" labelBotL="A" labelBotR="B" labelMid="H" sideA="AC=?" sideB="AH=16" sideC="HB=9" altLabel="CH=12" color1="#7c3aed" color2="#a78bfa" color3="#c084fc"/>,
    content: "CH ⊥ AB. △ACH ~ △CBH ~ △ACB.",
    parts: [
      { label: "a.", text: "Sebutkan pasangan sudut yang sama antara △ACH dan △CBH." },
      { label: "b.", math: "CH^2 = AH \\cdot HB = 16 \\times 9 = 144 \\Rightarrow CH = 12 \\checkmark" },
      { label: "c.", math: "AC = \\sqrt{AH \\cdot AB} = \\sqrt{16 \\times 25} = \\ldots" },
    ],
  }),
  Qn(50, "Soal HOTS – Kesebangunan Berganda", {
    type: "mixed",
    content: "Segitiga ABC dengan D dan E masing-masing titik tengah AB dan BC. △ADE ~ △ABE ~ △ABС.",
    parts: [
      { label: "a.", text: "Tentukan faktor skala dari △ADE ke △ABC." },
      { label: "b.", math: "\\frac{\\text{Luas }△ADE}{\\text{Luas }△ABC} = \\left(\\frac{1}{2}\\right)^2 = \\frac{1}{4}" },
      { label: "c.", text: "Jika luas △ABC = 60 cm², berapa luas △ADE dan berapa luas daerah yang bukan △ADE?" },
    ],
  }),
];

const SegitigaSebangunPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <Triangle className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(167,139,250,0.7)' }}>
            SEGITIGA-SEGITIGA YANG SEBANGUN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Kesebangunan & Kekongruenan · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 50 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-2">📌 Tiga Syarat Kesebangunan Segitiga</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { name: "AA", desc: "Dua pasang sudut sama besar" },
              { name: "SAS", desc: "Dua sisi sebanding & sudut apitnya sama" },
              { name: "SSS", desc: "Tiga pasang sisi sebanding" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-2 py-2 text-center">
                <p className="text-violet-300 font-bold text-sm mb-1">{r.name}</p>
                <p className="text-white/50 text-[9px]">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-900/80 to-purple-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-violet-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-400 to-purple-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/50 flex items-center justify-center shrink-0">
                    <span className="text-violet-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center rounded-xl overflow-hidden">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-violet-400 text-xs font-bold shrink-0 mt-0.5">{p.label}</span>}
                            <div className="flex-1">
                              {p.text && <p className="font-body text-sm text-white/80 leading-relaxed">{p.text}</p>}
                              {p.math && <div className="text-white/80 text-sm mt-0.5"><InlineMath math={p.math} /></div>}
                            </div>
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

export default SegitigaSebangunPage;
