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

const questions: Q[] = [
  Qn(1, "Syarat AA – Dua Sudut Sama", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["D","E","F"]} sideLabels1={["","",""]} sideLabels2={["","",""]} color1="#a78bfa" color2="#c084fc" type="scalene"/>,
    content: "∠A = ∠D = 50°, ∠B = ∠E = 70°. Maka ∠C = ∠F = 60°.",
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan syarat AA (Sudut-Sudut) untuk kesebangunan segitiga?" },
      { label: "b.", text: "Apakah △ABC ~ △DEF? Jelaskan menggunakan syarat AA." },
      { label: "c.", math: "\\text{Jika AB = 6 cm, DE = 9 cm, BC = 8 cm, maka EF = ?}" },
    ],
  }),
  Qn(2, "Syarat SAS – Sisi-Sudut-Sisi", {
    type: "mixed",
    content: "△ABC dan △PQR. AB = 4 cm, AC = 6 cm, ∠A = 50°. PQ = 6 cm, PR = 9 cm, ∠P = 50°.",
    parts: [
      { label: "a.", math: "\\frac{AB}{PQ} = \\frac{4}{6} = \\frac{2}{3}, \\quad \\frac{AC}{PR} = \\frac{6}{9} = \\frac{2}{3}" },
      { label: "b.", text: "Apakah △ABC ~ △PQR dengan syarat SAS? Jelaskan." },
      { label: "c.", math: "\\text{Maka } \\frac{BC}{QR} = \\frac{2}{3} \\Rightarrow QR = \\ldots" },
    ],
  }),
  Qn(3, "Syarat SSS – Tiga Sisi Sebanding", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["P","Q","R"]} sideLabels1={["4","6","8"]} sideLabels2={["6","9","12"]} color1="#a78bfa" color2="#7c3aed" type="scalene"/>,
    parts: [
      { label: "a.", math: "\\frac{AB}{PQ} = \\frac{4}{6}, \\quad \\frac{BC}{QR} = \\frac{6}{9}, \\quad \\frac{AC}{PR} = \\frac{8}{12}" },
      { label: "b.", text: "Sederhanakan setiap pecahan. Apakah semua sama?" },
      { label: "c.", text: "Apakah △ABC ~ △PQR? Berapa faktor skalanya?" },
    ],
  }),
  Qn(4, "Segitiga dalam Segitiga", {
    type: "mixed",
    diagram: <ParallelLinesTriangle topLabel="DE" botLabel="BC" leftA="AD=3" leftB="DB=6" rightA="AE=4" rightB="EC=8" topSide="DE=5" botSide="BC=15" color1="#a78bfa" color2="#7c3aed"/>,
    content: "DE ∥ BC, sehingga △ADE ~ △ABC.",
    parts: [
      { label: "a.", text: "Mengapa DE ∥ BC menjamin △ADE ~ △ABC?" },
      { label: "b.", math: "\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC} = \\frac{3}{9} = \\frac{1}{3}" },
      { label: "c.", text: "Hitunglah AB dan AC." },
    ],
  }),
  Qn(5, "Teorema Thales – Proporsi", {
    type: "mixed",
    diagram: <ParallelLinesTriangle topLabel="PQ" botLabel="RS" leftA="AP=2" leftB="PR=4" rightA="AQ=3" rightB="QS=?" topSide="PQ=5" botSide="RS=15" color1="#a78bfa" color2="#c084fc"/>,
    parts: [
      { label: "a.", math: "\\frac{AP}{PR} = \\frac{AQ}{QS} \\Rightarrow \\frac{2}{4} = \\frac{3}{QS}" },
      { label: "b.", text: "Hitunglah QS." },
      { label: "c.", math: "\\frac{PQ}{RS} = \\frac{AP}{AR} = \\frac{2}{6} = \\ldots" },
    ],
  }),
  Qn(6, "Dua Segitiga dalam Satu Gambar", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="A" labelBotL="B" labelBotR="C" labelMid="D" sideA="AB" sideB="BD=4" sideC="DC=9" altLabel="AD" color1="#a78bfa" color2="#c084fc" color3="#7c3aed"/>,
    content: "AD ⊥ BC. Segitiga ABD dan CBA sebangun.",
    parts: [
      { label: "a.", text: "Sebutkan pasangan sudut yang sama antara △ABD dan △CBA." },
      { label: "b.", math: "\\frac{BD}{AB} = \\frac{AB}{BC} \\Rightarrow AB^2 = BD \\cdot BC" },
      { label: "c.", math: "AB = \\sqrt{4 \\times (4+9)} = \\ldots" },
    ],
  }),
  Qn(7, "Segitiga Siku-Siku Sebangun", {
    type: "mixed",
    content: "△ABC siku-siku di B dengan AB = 6, BC = 8. △PQR siku-siku di Q. Jika △ABC ~ △PQR dan PQ = 9.",
    parts: [
      { label: "a.", math: "AC = \\sqrt{6^2 + 8^2} = \\ldots" },
      { label: "b.", text: "Tentukan faktor skala dari △ABC ke △PQR." },
      { label: "c.", text: "Tentukan QR dan PR." },
    ],
  }),
  Qn(8, "Mencari Sudut yang Tidak Diketahui", {
    type: "mixed",
    content: "△KLM ~ △XYZ. ∠K = 40°, ∠L = 2x + 10°, ∠Y = 3x − 20°.",
    parts: [
      { label: "a.", math: "∠L = ∠Y \\Rightarrow 2x + 10 = 3x - 20" },
      { label: "b.", text: "Selesaikan untuk x." },
      { label: "c.", text: "Hitunglah besar ∠L, ∠Y, dan ∠M." },
    ],
  }),
  Qn(9, "Dua Segitiga Berpotongan", {
    type: "mixed",
    content: "Dua garis berpotongan di titik O. Titik A, O, C segaris dan B, O, D segaris. Sehingga △AOB ~ △COD.",
    parts: [
      { label: "a.", text: "Jelaskan mengapa ∠AOB = ∠COD (sudut bertolak belakang)." },
      { label: "b.", text: "Jika AB ∥ CD, jelaskan mengapa ∠OAB = ∠OCD (sudut dalam bersilang)." },
      { label: "c.", math: "\\frac{OA}{OC} = \\frac{OB}{OD} = \\frac{AB}{CD}" },
    ],
  }),
  Qn(10, "Segitiga Sebangun – Soal UN", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["P","Q","R"]} sideLabels1={["3","4","5"]} sideLabels2={["4,5","6","7,5"]} color1="#7c3aed" color2="#a78bfa" type="right"/>,
    parts: [
      { label: "a.", text: "Periksa apakah △ABC ~ △PQR dengan syarat SSS." },
      { label: "b.", text: "Tentukan faktor skala." },
      { label: "c.", math: "\\frac{\\text{Luas } △PQR}{\\text{Luas } △ABC} = k^2 = \\ldots" },
    ],
  }),
  Qn(11, "Membuktikan Kesebangunan – AA", {
    type: "mixed",
    content: "Dalam segitiga ABC, D pada AB dan E pada AC sehingga DE ∥ BC. ∠ADE = ∠ABC dan ∠AED = ∠ACB.",
    parts: [
      { label: "a.", text: "Mengapa ∠ADE = ∠ABC? (sudut sehadap dengan dua garis sejajar)" },
      { label: "b.", text: "Apakah △ADE ~ △ABC? Gunakan syarat AA." },
      { label: "c.", math: "\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC}" },
    ],
  }),
  Qn(12, "Segitiga Sebangun dalam Trapesium", {
    type: "mixed",
    content: "Trapesium ABCD dengan AB ∥ DC. Diagonal AC dan BD berpotongan di O.",
    parts: [
      { label: "a.", text: "Buktikan bahwa △AOB ~ △COD (gunakan sudut bertolak belakang dan sudut dalam bersilang)." },
      { label: "b.", math: "\\frac{OA}{OC} = \\frac{OB}{OD} = \\frac{AB}{DC}" },
      { label: "c.", text: "Jika AB = 12, DC = 8, OA = 6, hitunglah OC." },
    ],
  }),
  Qn(13, "Sudut-Sudut Sebangun – Soal Campuran", {
    type: "mixed",
    content: "△RST ~ △XYZ. ∠R = 70°, ∠S = 3x + 5°, ∠X = 70°, ∠Y = 5x − 15°.",
    parts: [
      { label: "a.", math: "3x + 5 = 5x - 15 \\Rightarrow x = \\ldots" },
      { label: "b.", text: "Tentukan besar ∠S dan ∠Z." },
      { label: "c.", math: "\\text{Jika RS = 8, XY = 12, ST = 6, maka YZ = ?}" },
    ],
  }),
  Qn(14, "Garis Tinggi dari Sudut Siku-Siku", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="C" labelBotL="A" labelBotR="B" labelMid="H" sideA="CA=?" sideB="AH=9" sideC="HB=16" altLabel="CH" color1="#a78bfa" color2="#c084fc" color3="#7c3aed"/>,
    content: "△CHB ~ △ACH ~ △ACB. ∠ACB = 90°, CH ⊥ AB.",
    parts: [
      { label: "a.", math: "CH^2 = AH \\cdot HB = 9 \\times 16 = \\ldots \\Rightarrow CH = \\ldots" },
      { label: "b.", math: "CA^2 = AH \\cdot AB = 9 \\times 25 = \\ldots \\Rightarrow CA = \\ldots" },
      { label: "c.", math: "CB^2 = HB \\cdot AB = 16 \\times 25 = \\ldots \\Rightarrow CB = \\ldots" },
    ],
  }),
  Qn(15, "Segitiga Sebangun – ANBK Style", {
    type: "mixed",
    content: "Perhatikan dua segitiga. △ABC dengan ∠B = 90°, ∠A = 30°. △PQR dengan ∠Q = 90°, ∠P = 30°. Apakah sebangun?",
    parts: [
      { label: "a.", text: "Berapakah ∠C dan ∠R? Apakah semua sudut yang bersesuaian sama?" },
      { label: "b.", text: "Apakah △ABC ~ △PQR? Syarat apa yang digunakan?" },
      { label: "c.", math: "\\text{Jika AB = 5 cm, BC = 5\\sqrt{3} cm, PQ = 8 cm, maka QR = ?}" },
    ],
  }),
  Qn(16, "Dua Segitiga yang Tumpang Tindih", {
    type: "mixed",
    content: "Segitiga besar XYZ dengan titik A pada XY dan B pada XZ sehingga AB ∥ YZ. XA = 4, AY = 8, XB = 5.",
    parts: [
      { label: "a.", math: "\\frac{XA}{XY} = \\frac{XA}{XA+AY} = \\frac{4}{12} = \\frac{1}{3}" },
      { label: "b.", text: "Hitunglah BZ menggunakan Teorema Thales." },
      { label: "c.", math: "\\frac{AB}{YZ} = \\frac{1}{3} \\Rightarrow \\text{jika YZ = 18, maka AB = ?}" },
    ],
  }),
  Qn(17, "Perbandingan Luas Dua Segitiga Sebangun", {
    type: "mixed",
    content: "△KLM ~ △PQR dengan faktor skala 3 : 5. Luas △KLM = 27 cm².",
    parts: [
      { label: "a.", math: "\\frac{L_{PQR}}{L_{KLM}} = \\left(\\frac{5}{3}\\right)^2 = \\frac{25}{9}" },
      { label: "b.", text: "Hitunglah luas △PQR." },
      { label: "c.", text: "Hitunglah selisih luas kedua segitiga itu." },
    ],
  }),
  Qn(18, "Segitiga dalam Segitiga – Soal TKA", {
    type: "mixed",
    diagram: <ParallelLinesTriangle topLabel="MN" botLabel="AB" leftA="CM=2" leftB="MA=3" rightA="CN=3" rightB="NB=?" topSide="MN=4" botSide="AB=?" color1="#a78bfa" color2="#7c3aed"/>,
    parts: [
      { label: "a.", math: "\\frac{CM}{MA} = \\frac{CN}{NB} \\Rightarrow \\frac{2}{3} = \\frac{3}{NB}" },
      { label: "b.", text: "Hitunglah NB." },
      { label: "c.", math: "\\frac{MN}{AB} = \\frac{CM}{CA} = \\frac{2}{5} \\Rightarrow AB = \\ldots" },
    ],
  }),
  Qn(19, "Sudut Bersesuaian – Aplikasi", {
    type: "mixed",
    content: "Dua segitiga bertemu di satu titik. △ABC dan △DEC di mana ∠ACB = ∠DCE (bertolak belakang), ∠A = ∠D = 45°.",
    parts: [
      { label: "a.", text: "Apakah △ABC ~ △DEC? Gunakan syarat AA." },
      { label: "b.", math: "\\frac{AB}{DE} = \\frac{BC}{EC} = \\frac{AC}{DC}" },
      { label: "c.", text: "Jika AB = 6, DE = 4, BC = 9, hitunglah EC." },
    ],
  }),
  Qn(20, "Membuktikan Segitiga Sebangun – SAS", {
    type: "mixed",
    content: "△MNO dan △PQO dengan O titik persekutuan. MO = 6, OP = 9, NO = 4, OQ = 6. ∠MON = ∠POQ.",
    parts: [
      { label: "a.", math: "\\frac{MO}{PO} = \\frac{6}{9} = \\frac{2}{3}, \\quad \\frac{NO}{QO} = \\frac{4}{6} = \\frac{2}{3}" },
      { label: "b.", text: "Apakah △MNO ~ △PQO dengan syarat SAS?" },
      { label: "c.", math: "\\frac{MN}{PQ} = \\frac{2}{3} \\Rightarrow \\text{jika MN = 5, maka PQ = ?}" },
    ],
  }),
  Qn(21, "Tinggi Segitiga dari Kesebangunan", {
    type: "mixed",
    content: "△ABC siku-siku di C. CD ⊥ AB. AB = 25, AD = 9.",
    parts: [
      { label: "a.", math: "DB = AB - AD = 25 - 9 = \\ldots" },
      { label: "b.", math: "CD^2 = AD \\cdot DB = 9 \\times 16 = \\ldots \\Rightarrow CD = \\ldots" },
      { label: "c.", math: "AC^2 = AD \\cdot AB = 9 \\times 25 = \\ldots \\Rightarrow AC = \\ldots" },
    ],
  }),
  Qn(22, "Membuktikan AA dari Konteks", {
    type: "mixed",
    content: "Diketahui garis p ∥ q. Garis transversal memotong p di A dan q di B. Garis lain memotong p di C dan q di D. Keempat titik membentuk dua segitiga yang sebangun.",
    parts: [
      { label: "a.", text: "Sebutkan pasangan sudut-sudut yang sama karena garis sejajar." },
      { label: "b.", text: "Tuliskan pernyataan kesebangunan kedua segitiga dengan notasi yang benar." },
      { label: "c.", text: "Tuliskan perbandingan sisi-sisi yang bersesuaian." },
    ],
  }),
  Qn(23, "Segitiga Sebangun – Mencari Panjang", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["R","S","T"]} vertices2={["X","Y","Z"]} sideLabels1={["7","?","11"]} sideLabels2={["10,5","9","?"]} color1="#a78bfa" color2="#c084fc" type="scalene"/>,
    parts: [
      { label: "a.", text: "Tentukan faktor skala dari △RST ke △XYZ menggunakan RS dan XY." },
      { label: "b.", text: "Hitunglah ST dan XZ." },
      { label: "c.", text: "Hitunglah keliling △XYZ jika keliling △RST = 28 cm." },
    ],
  }),
  Qn(24, "Kesebangunan Terbalik", {
    type: "mixed",
    content: "△ABC ~ △CBA artinya △ABC dicerminkan terhadap sumbu simetri AC, menghasilkan △CBA.",
    parts: [
      { label: "a.", text: "Apakah △ABC ~ △CBA selalu benar? Jenis segitiga apa yang memiliki simetri ini?" },
      { label: "b.", text: "Untuk segitiga sama kaki dengan AB = CB, apakah △ABC ~ △CBA?" },
      { label: "c.", text: "Apakah △ABC ≅ △CBA untuk segitiga sama kaki?" },
    ],
  }),
  Qn(25, "Segitiga Sebangun dari Soal UN 2019", {
    type: "mixed",
    content: "Diketahui △ABC dengan DE ∥ BC. AD = 4, DB = 6, DE = 5. Hitunglah BC.",
    parts: [
      { label: "a.", math: "\\frac{AD}{AB} = \\frac{DE}{BC} \\Rightarrow \\frac{4}{10} = \\frac{5}{BC}" },
      { label: "b.", text: "Hitunglah BC." },
      { label: "c.", text: "Hitunglah luas △ADE jika luas △ABC = 75 cm²." },
    ],
  }),
  Qn(26, "Segitiga Sebangun di Koordinat", {
    type: "mixed",
    content: "△OAB dengan O(0,0), A(4,0), B(0,3) dan △OCD dengan C(6,0), D(0,4,5).",
    parts: [
      { label: "a.", text: "Hitunglah OA, OB, OC, OD." },
      { label: "b.", math: "\\frac{OA}{OC} = \\frac{4}{6} = \\frac{2}{3}, \\quad \\frac{OB}{OD} = \\frac{3}{4,5} = \\frac{2}{3}" },
      { label: "c.", text: "Apakah △OAB ~ △OCD? Syarat apa yang digunakan?" },
    ],
  }),
  Qn(27, "Menentukan Panjang dari Dua Segitiga Sebangun", {
    type: "mixed",
    content: "Pada △PQR, titik S di PQ dan T di PR sehingga ST ∥ QR. PS = 3, SQ = 5, PT = 4.",
    parts: [
      { label: "a.", math: "\\frac{PS}{PQ} = \\frac{PT}{PR} \\Rightarrow \\frac{3}{8} = \\frac{4}{PR}" },
      { label: "b.", text: "Hitunglah PR dan TR." },
      { label: "c.", math: "\\frac{ST}{QR} = \\frac{PS}{PQ} = \\frac{3}{8} \\Rightarrow \\text{jika QR = 24, maka ST = ?}" },
    ],
  }),
  Qn(28, "Membedakan AA, SAS, SSS", {
    type: "mixed",
    content: "Untuk setiap pasang segitiga berikut, tentukan syarat kesebangunan yang digunakan (AA, SAS, atau SSS):",
    parts: [
      { label: "a.", text: "△ABC dengan ∠A = 60°, ∠B = 80°. △PQR dengan ∠P = 60°, ∠Q = 80°." },
      { label: "b.", text: "△DEF dengan DE = 4, EF = 6, ∠E = 50°. △XYZ dengan XY = 6, YZ = 9, ∠Y = 50°." },
      { label: "c.", text: "△GHI dengan GH = 3, HI = 4, GI = 5. △JKL dengan JK = 6, KL = 8, JL = 10." },
    ],
  }),
  Qn(29, "Segitiga Sebangun – Soal Kontekstual", {
    type: "mixed",
    content: "Sebuah tangga bersandar di dinding. Kaki tangga 2 m dari dinding. Tinggi dinding yang bisa dicapai tangga 5 m. Tongkat sepanjang 1 m ditaruh pada posisi yang sama, kakinya 0,4 m dari dinding.",
    parts: [
      { label: "a.", text: "Gambarlah situasi ini dalam dua segitiga yang sebangun." },
      { label: "b.", text: "Verifikasi kesebangunan menggunakan perbandingan sisi." },
      { label: "c.", text: "Berapa tinggi yang bisa dicapai tongkat?" },
    ],
  }),
  Qn(30, "Segitiga Sebangun dalam Lingkaran", {
    type: "mixed",
    content: "Dua tali busur AB dan CD berpotongan di P. △APD ~ △CPB.",
    parts: [
      { label: "a.", text: "Sebutkan dua sudut yang sama antara △APD dan △CPB (sudut bertolak belakang dan sudut keliling)." },
      { label: "b.", math: "\\frac{AP}{CP} = \\frac{DP}{BP} = \\frac{AD}{CB}" },
      { label: "c.", text: "Jika AP = 4, CP = 6, DP = 3, hitunglah BP." },
    ],
  }),
  Qn(31, "Mencari Sisi – Soal ANBK Level Tinggi", {
    type: "mixed",
    content: "△ABC ~ △ADE dengan D pada AB dan E pada AC. AD = 5, AB = 15, AE = 4.",
    parts: [
      { label: "a.", math: "\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{1}{3}" },
      { label: "b.", text: "Hitunglah AC." },
      { label: "c.", math: "\\frac{\\text{Luas } △ADE}{\\text{Luas } △ABC} = \\frac{1}{9} \\Rightarrow \\text{jika Luas }△ABC = 45, \\text{ Luas }△ADE = ?" },
    ],
  }),
  Qn(32, "Sudut dan Sisi Sebangun Kompleks", {
    type: "mixed",
    content: "△PQR dengan ∠P = 45°, PQ = 8, PR = 6. △STU dengan ∠S = 45°, ST = 12, SU = 9.",
    parts: [
      { label: "a.", math: "\\frac{PQ}{ST} = \\frac{8}{12} = \\frac{2}{3}, \\quad \\frac{PR}{SU} = \\frac{6}{9} = \\frac{2}{3}" },
      { label: "b.", text: "Apakah △PQR ~ △STU dengan syarat SAS?" },
      { label: "c.", text: "Jika QR = 10, hitunglah TU." },
    ],
  }),
  Qn(33, "Kesebangunan dengan Persamaan", {
    type: "mixed",
    content: "△ABC ~ △DEF. AB = 3x + 1, DE = 5x − 3, BC = 8, EF = 12.",
    parts: [
      { label: "a.", math: "\\frac{AB}{DE} = \\frac{BC}{EF} \\Rightarrow \\frac{3x+1}{5x-3} = \\frac{8}{12}" },
      { label: "b.", text: "Selesaikan untuk x." },
      { label: "c.", text: "Tentukan panjang AB dan DE." },
    ],
  }),
  Qn(34, "Segitiga Sebangun – Panjang Garis Tinggi", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="A" labelBotL="B" labelBotR="C" labelMid="D" sideA="AB=?" sideB="BD=5" sideC="DC=20" altLabel="AD=h" color1="#a78bfa" color2="#c084fc" color3="#7c3aed"/>,
    parts: [
      { label: "a.", math: "AD^2 = BD \\cdot DC = 5 \\times 20 = \\ldots \\Rightarrow AD = \\ldots" },
      { label: "b.", math: "AB^2 = BD \\cdot BC = 5 \\times 25 = \\ldots \\Rightarrow AB = \\ldots" },
      { label: "c.", math: "AC^2 = DC \\cdot BC = 20 \\times 25 = \\ldots \\Rightarrow AC = \\ldots" },
    ],
  }),
  Qn(35, "Garis Bagi Sudut dan Kesebangunan", {
    type: "mixed",
    content: "Dalam △ABC, AD adalah garis bagi ∠A dengan D pada BC. Teorema garis bagi menyatakan BD/DC = AB/AC.",
    parts: [
      { label: "a.", text: "Jika AB = 6, AC = 9, BC = 10, hitunglah BD dan DC menggunakan teorema garis bagi." },
      { label: "b.", text: "Apakah △ABD ~ △ACD? Jelaskan." },
      { label: "c.", math: "\\frac{\\text{Luas }△ABD}{\\text{Luas }△ACD} = \\frac{BD}{DC} = \\ldots" },
    ],
  }),
  Qn(36, "Dua Segitiga Sebangun – Soal TKA", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["P","Q","R"]} sideLabels1={["x","6","?"]} sideLabels2={["10","15","?"]} color1="#7c3aed" color2="#a78bfa" type="scalene"/>,
    content: "△ABC ~ △PQR. AB = x, BC = 6, PQ = 10, QR = 15.",
    parts: [
      { label: "a.", math: "\\frac{AB}{PQ} = \\frac{BC}{QR} \\Rightarrow \\frac{x}{10} = \\frac{6}{15}" },
      { label: "b.", text: "Hitunglah x = AB." },
      { label: "c.", math: "\\frac{\\text{Luas } △ABC}{\\text{Luas } △PQR} = \\left(\\frac{6}{15}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(37, "Kesebangunan Segitiga – Panjang Sisi Ketiga", {
    type: "mixed",
    content: "△MNO ~ △QRS. MN = 12, NO = 15, MO = 9. QR = 8.",
    parts: [
      { label: "a.", text: "Tentukan faktor skala dari △MNO ke △QRS." },
      { label: "b.", text: "Hitunglah RS dan QS." },
      { label: "c.", text: "Hitunglah keliling △QRS." },
    ],
  }),
  Qn(38, "Segitiga Sebangun – Soal Cerita Kontekstual", {
    type: "mixed",
    content: "Sebuah jembatan berbentuk segitiga siku-siku dengan sisi 30 m, 40 m, 50 m. Model miniaturnya memiliki sisi terpendek 6 cm.",
    parts: [
      { label: "a.", text: "Tentukan faktor skala model terhadap asli." },
      { label: "b.", text: "Tentukan dua sisi lainnya pada model." },
      { label: "c.", text: "Apakah model dan jembatan asli sebangun? Berikan alasan." },
    ],
  }),
  Qn(39, "Tiga Segitiga Sebangun dalam Satu Gambar", {
    type: "mixed",
    diagram: <TriangleAltitude labelTop="C" labelBotL="A" labelBotR="B" labelMid="H" sideA="AC=?" sideB="AH=16" sideC="HB=9" altLabel="CH=12" color1="#7c3aed" color2="#a78bfa" color3="#c084fc"/>,
    content: "CH ⊥ AB. △ACH ~ △CBH ~ △ACB.",
    parts: [
      { label: "a.", text: "Sebutkan pasangan sudut yang sama antara △ACH dan △CBH." },
      { label: "b.", math: "CH^2 = AH \\cdot HB = 16 \\times 9 = 144 \\Rightarrow CH = 12 \\checkmark" },
      { label: "c.", math: "AC = \\sqrt{AH \\cdot AB} = \\sqrt{16 \\times 25} = \\ldots" },
    ],
  }),
  Qn(40, "Soal HOTS – Kesebangunan Berganda", {
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
            <span className="text-violet-400 text-xs font-bold">📋 40 Soal</span>
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
