import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Shapes } from "lucide-react";
import { SimilarTriangles, SimilarRects, CongruentTriangles, TwoShapesCongruent } from "./GeoFigure";

const accent = "cyan";
const accentHex = "#22d3ee";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed" | "diagram-only";
};
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Pengertian Kesebangunan", {
    type: "mixed",
    content: "Dua bangun datar dikatakan sebangun jika memenuhi dua syarat. Perhatikan dua persegi panjang berikut:",
    diagram: <SimilarRects w1={60} h1={40} w2={90} h2={60} sides1={["6 cm","4 cm","",""]as any} sides2={["9 cm","6 cm","",""]as any} color1="#22d3ee" color2="#a78bfa"/>,
    parts: [
      { label: "a.", text: "Sebutkan dua syarat dua bangun datar dikatakan sebangun." },
      { label: "b.", text: "Apakah dua persegi panjang di atas sebangun? Periksa perbandingan sisi-sisinya." },
      { label: "c.", math: "\\text{Hitung: } \\frac{AB}{EF} = \\frac{BC}{FG} = \\ldots" },
    ],
  }),
  Qn(2, "Pengertian Kekongruenan", {
    type: "mixed",
    content: "Dua bangun datar dikatakan kongruen (≅) jika kedua syarat terpenuhi sekaligus.",
    diagram: <TwoShapesCongruent shape="rect" color1="#34d399" color2="#fb923c" sides1={["8 cm","5 cm"]} sides2={["8 cm","5 cm"]} label1="ABCD" label2="PQRS"/>,
    parts: [
      { label: "a.", text: "Apa perbedaan antara dua bangun yang sebangun dan dua bangun yang kongruen?" },
      { label: "b.", text: "Apakah dua bangun yang kongruen pasti sebangun? Jelaskan." },
      { label: "c.", text: "Apakah dua bangun yang sebangun pasti kongruen? Jelaskan dengan contoh." },
    ],
  }),
  Qn(3, "Syarat Kesebangunan – Sudut", {
    type: "mixed",
    content: "Perhatikan dua segitiga berikut. Sudut-sudut segitiga ABC: ∠A = 50°, ∠B = 70°, ∠C = 60°. Sudut-sudut segitiga DEF: ∠D = 50°, ∠E = 70°, ∠F = 60°.",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["D","E","F"]} sideLabels1={["","",""]} sideLabels2={["","",""]} color1="#22d3ee" color2="#f472b6"/>,
    parts: [
      { label: "a.", text: "Apakah syarat sudut kesebangunan terpenuhi? Jelaskan." },
      { label: "b.", text: "Pasangkan sudut-sudut yang sama besar dari kedua segitiga." },
      { label: "c.", math: "\\text{Jika } AB = 6 \\text{ cm dan } DE = 9 \\text{ cm, berapakah rasio kesebangunannya?}" },
    ],
  }),
  Qn(4, "Syarat Kesebangunan – Sisi", {
    type: "mixed",
    content: "Dua segitiga PQR dan STU memiliki panjang sisi: PQ = 4, QR = 6, PR = 8 dan ST = 6, TU = 9, SU = 12.",
    parts: [
      { label: "a.", text: "Periksa apakah perbandingan sisi-sisi yang bersesuaian sama." },
      { label: "b.", math: "\\frac{PQ}{ST} = \\frac{QR}{TU} = \\frac{PR}{SU} = \\ldots" },
      { label: "c.", text: "Apakah kedua segitiga itu sebangun? Berapa rasio perbandingannya?" },
    ],
  }),
  Qn(5, "Membedakan Sebangun dan Kongruen", {
    type: "mixed",
    content: "Perhatikan pernyataan-pernyataan berikut:",
    parts: [
      { label: "1.", text: "Dua lingkaran dengan jari-jari berbeda." },
      { label: "2.", text: "Dua persegi dengan sisi sama panjang." },
      { label: "3.", text: "Foto asli dan foto yang diperbesar 2 kali." },
      { label: "", text: "Dari ketiga contoh di atas:" },
      { label: "a.", text: "Mana yang sebangun tapi tidak kongruen?" },
      { label: "b.", text: "Mana yang sebangun sekaligus kongruen?" },
      { label: "c.", text: "Mana yang tidak sebangun dan tidak kongruen?" },
    ],
  }),
  Qn(6, "Faktor Skala / Rasio Kesebangunan", {
    type: "mixed",
    diagram: <SimilarRects w1={50} h1={35} w2={100} h2={70} sides1={["5 cm","3,5 cm","",""]as any} sides2={["10 cm","7 cm","",""]as any} color1="#38bdf8" color2="#34d399"/>,
    parts: [
      { label: "a.", text: "Tentukan faktor skala dari persegi panjang kecil ke persegi panjang besar." },
      { label: "b.", math: "k = \\frac{\\text{sisi besar}}{\\text{sisi kecil}} = \\ldots" },
      { label: "c.", text: "Apa yang terjadi pada luas bangun jika faktor skalanya k?" },
      { label: "d.", math: "\\frac{L_{besar}}{L_{kecil}} = k^2 = \\ldots" },
    ],
  }),
  Qn(7, "Gambar Peta dan Skala", {
    type: "mixed",
    content: "Sebuah taman berbentuk persegi panjang dengan panjang 120 m dan lebar 80 m digambar dalam peta berskala 1 : 400.",
    parts: [
      { label: "a.", text: "Berapa panjang gambar taman dalam peta (dalam cm)?" },
      { label: "b.", text: "Berapa lebar gambar taman dalam peta (dalam cm)?" },
      { label: "c.", text: "Apakah taman asli dan gambarnya sebangun? Jelaskan." },
    ],
  }),
  Qn(8, "Foto dan Bayangan", {
    type: "mixed",
    content: "Sebuah foto berukuran 4 cm × 6 cm akan diperbesar menjadi 10 cm × 15 cm.",
    parts: [
      { label: "a.", text: "Hitunglah rasio panjang foto asli terhadap foto diperbesar." },
      { label: "b.", text: "Hitunglah rasio lebar foto asli terhadap foto diperbesar." },
      { label: "c.", text: "Apakah kedua foto tersebut sebangun? Tunjukkan!" },
      { label: "d.", math: "\\text{Rasio luas} = \\left(\\frac{4}{10}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(9, "Sudut-Sudut Bersesuaian", {
    type: "mixed",
    content: "Dua segitiga ABC dan PQR diketahui sebangun dengan ∠A = ∠P, ∠B = ∠Q, ∠C = ∠R.",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["P","Q","R"]} sideLabels1={["c","a","b"]} sideLabels2={["r","p","q"]} color1="#22d3ee" color2="#fb923c" type="scalene"/>,
    parts: [
      { label: "a.", text: "Tuliskan pasangan sisi-sisi yang bersesuaian dari △ABC dan △PQR." },
      { label: "b.", math: "\\frac{AB}{PQ} = \\frac{BC}{QR} = \\frac{AC}{PR} = k" },
      { label: "c.", text: "Jika AB = 8, BC = 10, PQ = 4, tentukan QR." },
    ],
  }),
  Qn(10, "Bangun Tidak Sebangun", {
    type: "mixed",
    content: "Diketahui dua persegi panjang: ABCD dengan AB = 6 cm, BC = 4 cm; dan EFGH dengan EF = 9 cm, FG = 5 cm.",
    parts: [
      { label: "a.", math: "\\frac{AB}{EF} = \\frac{6}{9} = \\ldots, \\quad \\frac{BC}{FG} = \\frac{4}{5} = \\ldots" },
      { label: "b.", text: "Apakah kedua persegi panjang itu sebangun? Mengapa?" },
      { label: "c.", text: "Berapakah FG seharusnya agar ABCD dan EFGH sebangun?" },
    ],
  }),
  Qn(11, "Kesebangunan Persegi", {
    type: "mixed",
    content: "Dua buah persegi: persegi pertama bersisi 5 cm dan persegi kedua bersisi 8 cm.",
    parts: [
      { label: "a.", text: "Apakah semua persegi pasti sebangun? Jelaskan." },
      { label: "b.", text: "Berapa rasio perbandingan sisi kedua persegi tersebut?" },
      { label: "c.", text: "Berapa rasio perbandingan luas kedua persegi tersebut?" },
    ],
  }),
  Qn(12, "Kesebangunan Segitiga Sama Sisi", {
    type: "mixed",
    content: "Dua buah segitiga sama sisi: yang pertama bersisi 6 cm dan yang kedua bersisi 9 cm.",
    parts: [
      { label: "a.", text: "Apakah semua segitiga sama sisi pasti sebangun? Jelaskan." },
      { label: "b.", text: "Apakah semua segitiga sama kaki pasti sebangun? Jelaskan." },
      { label: "c.", text: "Berikan contoh dua segitiga yang pasti sebangun." },
    ],
  }),
  Qn(13, "Sifat Kesebangunan – Refleksif", {
    type: "mixed",
    content: "Sifat-sifat relasi kesebangunan:",
    parts: [
      { label: "a.", text: "Apakah setiap bangun sebangun dengan dirinya sendiri? (Refleksif)" },
      { label: "b.", text: "Jika bangun A sebangun dengan B, apakah B sebangun dengan A? (Simetris)" },
      { label: "c.", text: "Jika A sebangun B dan B sebangun C, apakah A sebangun C? (Transitif)" },
    ],
  }),
  Qn(14, "Menentukan Kekongruenan dari Gambar", {
    type: "mixed",
    diagram: <CongruentTriangles vertices1={["A","B","C"]} vertices2={["P","Q","R"]} sides1={["5 cm","4 cm","6 cm"]} sides2={["5 cm","4 cm","6 cm"]} color1="#34d399" color2="#fb923c" shape="scalene" ticks={true}/>,
    parts: [
      { label: "a.", text: "Apakah △ABC ≅ △PQR? Berikan alasannya." },
      { label: "b.", text: "Tuliskan semua pasangan sisi yang sama panjang." },
      { label: "c.", text: "Tuliskan semua pasangan sudut yang sama besar." },
    ],
  }),
  Qn(15, "Kesebangunan pada Foto Identitas", {
    type: "mixed",
    content: "Foto identitas standar berukuran 3×4 cm. Foto tersebut akan dicetak ulang dalam tiga ukuran: 4×6 cm, 6×9 cm, dan 9×12 cm.",
    parts: [
      { label: "a.", text: "Ukuran mana yang sebangun dengan foto asli (3×4 cm)? Periksa satu per satu." },
      { label: "b.", text: "Ukuran mana yang tidak sebangun dengan foto asli? Mengapa?" },
      { label: "c.", text: "Berapa rasio perbandingan antara foto 3×4 dengan foto 6×9?" },
    ],
  }),
  Qn(16, "Syarat Kesebangunan Trapesium", {
    type: "mixed",
    content: "Trapesium ABCD memiliki AB ∥ CD dengan AB = 12 cm, CD = 6 cm, AD = 5 cm, BC = 5 cm. Trapesium PQRS memiliki PQ ∥ SR dengan PQ = 8 cm, SR = 4 cm, PS = 10/3 cm, QR = 10/3 cm.",
    parts: [
      { label: "a.", text: "Periksa apakah semua sudut yang bersesuaian sama besar." },
      { label: "b.", text: "Periksa apakah semua sisi yang bersesuaian sebanding." },
      { label: "c.", text: "Apakah kedua trapesium sebangun? Tentukan rasionya." },
    ],
  }),
  Qn(17, "Faktor Skala dari Luas", {
    type: "mixed",
    content: "Dua bangun sebangun. Luas bangun pertama 36 cm² dan luas bangun kedua 81 cm².",
    parts: [
      { label: "a.", math: "\\frac{L_2}{L_1} = \\frac{81}{36} = k^2 \\Rightarrow k = \\ldots" },
      { label: "b.", text: "Jika keliling bangun pertama 24 cm, berapa keliling bangun kedua?" },
      { label: "c.", text: "Jika sebuah sisi bangun pertama 6 cm, berapa sisi yang bersesuaian pada bangun kedua?" },
    ],
  }),
  Qn(18, "Kekongruenan dari Refleksi", {
    type: "mixed",
    content: "Segitiga ABC dicerminkan terhadap sumbu-x menghasilkan segitiga A'B'C'.",
    parts: [
      { label: "a.", text: "Apakah △ABC ≅ △A'B'C'? Jelaskan mengapa pencerminan menghasilkan bangun yang kongruen." },
      { label: "b.", text: "Apakah orientasi (arah putar) segitiga berubah setelah dicerminkan?" },
      { label: "c.", text: "Sebutkan transformasi lain yang menghasilkan bangun kongruen." },
    ],
  }),
  Qn(19, "Kesebangunan dari Dilatasi", {
    type: "mixed",
    content: "Segitiga KLM didilatasi dengan pusat O dan faktor skala k = 3 menghasilkan segitiga K'L'M'.",
    parts: [
      { label: "a.", text: "Apakah △KLM ~ △K'L'M'? Jelaskan." },
      { label: "b.", text: "Jika KL = 4 cm, berapakah K'L'?" },
      { label: "c.", math: "\\text{Jika Luas } \\triangle KLM = 10 \\text{ cm}^2, \\text{ berapakah Luas } \\triangle K'L'M'?" },
    ],
  }),
  Qn(20, "Notasi Kesebangunan", {
    type: "mixed",
    content: "Jika △ABC ~ △DEF, maka penulisan urutan titik sudut sangat penting.",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["D","E","F"]} sideLabels1={["c","a","b"]} sideLabels2={["f","d","e"]} color1="#22d3ee" color2="#a78bfa"/>,
    parts: [
      { label: "a.", text: "Sudut mana yang bersesuaian dengan ∠A? ∠B? ∠C?" },
      { label: "b.", text: "Sisi mana yang bersesuaian dengan AB? BC? AC?" },
      { label: "c.", text: "Apakah △BAC ~ △EDF juga benar? Jelaskan." },
    ],
  }),
  Qn(21, "Kesebangunan Jajargenjang", {
    type: "mixed",
    content: "Dua jajargenjang ABCD dan EFGH. ABCD: AB = 10 cm, BC = 6 cm, ∠A = 70°. EFGH: EF = 15 cm, FG = 9 cm, ∠E = 70°.",
    parts: [
      { label: "a.", text: "Periksa apakah sudut-sudut yang bersesuaian sama besar." },
      { label: "b.", math: "\\frac{AB}{EF} = \\frac{10}{15}, \\quad \\frac{BC}{FG} = \\frac{6}{9}" },
      { label: "c.", text: "Apakah kedua jajargenjang sebangun? Berapa faktor skalanya?" },
    ],
  }),
  Qn(22, "Kekongruenan dan Luas", {
    type: "mixed",
    content: "Dua bangun yang kongruen selalu memiliki luas yang sama.",
    parts: [
      { label: "a.", text: "Apakah pernyataan tersebut benar? Jelaskan." },
      { label: "b.", text: "Sebutkan dua sifat yang selalu sama pada dua bangun yang kongruen." },
      { label: "c.", text: "Bolehkah dua bangun yang luasnya sama langsung disebut kongruen? Berikan contoh kontra." },
    ],
  }),
  Qn(23, "Menentukan Sudut yang Sama dari Perbandingan Sisi", {
    type: "mixed",
    content: "Diketahui △ABC ~ △PQR dengan AB = 6, BC = 8, AC = 10, PQ = 9, QR = 12, PR = 15.",
    parts: [
      { label: "a.", text: "Tentukan faktor skala dari △ABC ke △PQR." },
      { label: "b.", math: "\\text{Sudut mana dari } \\triangle PQR \\text{ yang sama dengan } \\angle A, \\angle B, \\angle C?" },
      { label: "c.", text: "Sudut manakah yang paling besar? Mengapa?" },
    ],
  }),
  Qn(24, "Perbandingan Keliling", {
    type: "mixed",
    content: "Dua segitiga sebangun dengan rasio sisi 2 : 5.",
    parts: [
      { label: "a.", text: "Berapa rasio keliling kedua segitiga itu?" },
      { label: "b.", text: "Berapa rasio luas kedua segitiga itu?" },
      { label: "c.", math: "\\text{Jika keliling segitiga kecil } = 30 \\text{ cm, keliling segitiga besar} = \\ldots" },
    ],
  }),
  Qn(25, "Bangun Sebangun dalam Kehidupan", {
    type: "mixed",
    content: "Sebuah papan nama berbentuk persegi panjang berukuran 40 cm × 25 cm. Miniaturnya berukuran 8 cm × 5 cm.",
    parts: [
      { label: "a.", text: "Apakah papan nama dan miniaturnya sebangun? Periksa." },
      { label: "b.", text: "Berapa faktor skala dari miniatur ke papan asli?" },
      { label: "c.", text: "Berapa rasio luas papan asli terhadap miniatur?" },
    ],
  }),
  Qn(26, "Simbol Kongruen dan Sebangun", {
    type: "mixed",
    content: "Dalam matematika, simbol ~ menyatakan sebangun dan ≅ menyatakan kongruen.",
    parts: [
      { label: "a.", text: "Jika △ABC ≅ △DEF, apakah △ABC ~ △DEF juga berlaku? Jelaskan." },
      { label: "b.", text: "Jika △ABC ~ △DEF, apakah △ABC ≅ △DEF berlaku? Jelaskan." },
      { label: "c.", text: "Kapan dua bangun bisa disebut kongruen sekaligus sebangun?" },
    ],
  }),
  Qn(27, "Kesebangunan Lingkaran", {
    type: "mixed",
    content: "Dua lingkaran dengan jari-jari r₁ = 5 cm dan r₂ = 8 cm.",
    parts: [
      { label: "a.", text: "Apakah semua lingkaran pasti sebangun? Jelaskan." },
      { label: "b.", text: "Berapa rasio sisi (jari-jari) kedua lingkaran itu?" },
      { label: "c.", text: "Berapa rasio luas kedua lingkaran itu?" },
    ],
  }),
  Qn(28, "Mencari Sisi dari Kesebangunan", {
    type: "mixed",
    content: "Dua bangun sebangun dengan faktor skala k = 3/2. Bangun pertama memiliki sisi 8 cm, 10 cm, dan 12 cm.",
    parts: [
      { label: "a.", text: "Tentukan sisi-sisi bangun kedua." },
      { label: "b.", text: "Jika keliling bangun pertama 30 cm, keliling bangun kedua berapa?" },
      { label: "c.", math: "\\text{Jika Luas bangun pertama } = 24 \\text{ cm}^2, \\text{ Luas bangun kedua} = \\ldots" },
    ],
  }),
  Qn(29, "Kekongruenan dari Rotasi", {
    type: "mixed",
    content: "Persegi panjang ABCD dirotasi 90° searah jarum jam terhadap titik O menghasilkan A'B'C'D'.",
    parts: [
      { label: "a.", text: "Apakah ABCD ≅ A'B'C'D'? Jelaskan." },
      { label: "b.", text: "Apakah posisi/orientasi kedua bangun itu berbeda?" },
      { label: "c.", text: "Apakah ukuran, bentuk, luas, dan keliling kedua bangun itu sama?" },
    ],
  }),
  Qn(30, "Kekongruenan dari Translasi", {
    type: "mixed",
    content: "Segitiga ABC ditranslasi sejauh vektor (5, –3) menghasilkan segitiga A'B'C'.",
    parts: [
      { label: "a.", text: "Apakah △ABC ≅ △A'B'C'? Mengapa?" },
      { label: "b.", text: "Apakah semua sisi dan sudut tetap sama setelah translasi?" },
      { label: "c.", text: "Sebutkan tiga transformasi yang selalu menghasilkan bangun kongruen." },
    ],
  }),
  Qn(31, "Identifikasi Pasangan Sebangun", {
    type: "mixed",
    content: "Tentukan pasangan bangun yang pasti sebangun:",
    parts: [
      { label: "A.", text: "Semua persegi" },
      { label: "B.", text: "Semua persegi panjang" },
      { label: "C.", text: "Semua lingkaran" },
      { label: "D.", text: "Semua segitiga sama sisi" },
      { label: "", text: "Dari pilihan A–D, mana yang pasti sebangun? Jelaskan alasan untuk setiap pilihan." },
    ],
  }),
  Qn(32, "Rasio Kesebangunan dari Keliling", {
    type: "mixed",
    content: "Dua segitiga sebangun. Keliling segitiga pertama 45 cm dan keliling segitiga kedua 30 cm.",
    parts: [
      { label: "a.", text: "Tentukan rasio perbandingan sisi (faktor skala)." },
      { label: "b.", text: "Jika salah satu sisi segitiga pertama 15 cm, berapa sisi yang bersesuaian pada segitiga kedua?" },
      { label: "c.", math: "\\text{Rasio luas} = \\left(\\frac{45}{30}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(33, "Membandingkan Segitiga", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["D","E","F"]} sideLabels1={["6","8","10"]} sideLabels2={["9","12","15"]} color1="#38bdf8" color2="#34d399" type="right"/>,
    parts: [
      { label: "a.", text: "Periksa apakah perbandingan sisi-sisi yang bersesuaian sama." },
      { label: "b.", text: "Apakah kedua segitiga sebangun? Berapa faktor skalanya?" },
      { label: "c.", text: "Apakah kedua segitiga itu merupakan segitiga siku-siku? Periksa dengan Teorema Pythagoras." },
    ],
  }),
  Qn(34, "Bangun Sebangun – Contoh UN", {
    type: "mixed",
    content: "Pada ujian nasional, soal kesebangunan sering berbentuk: 'Dua segitiga sebangun dengan perbandingan sisi 2:3. Jika luas segitiga kecil 20 cm², berapakah luas segitiga besar?'",
    parts: [
      { label: "a.", math: "\\frac{L_{besar}}{L_{kecil}} = \\left(\\frac{3}{2}\\right)^2 = \\ldots" },
      { label: "b.", text: "Hitunglah luas segitiga besar." },
      { label: "c.", text: "Hitunglah selisih luas kedua segitiga." },
    ],
  }),
  Qn(35, "Membedakan dengan Kekongruenan – Soal ANBK", {
    type: "mixed",
    content: "Perhatikan gambar dua segitiga. △ABC memiliki sudut 40°, 60°, 80° dan sisi 5 cm, 7 cm, 9 cm. △PQR memiliki sudut 40°, 60°, 80° dan sisi 10 cm, 14 cm, 18 cm.",
    parts: [
      { label: "a.", text: "Apakah △ABC ~ △PQR? Jelaskan." },
      { label: "b.", text: "Apakah △ABC ≅ △PQR? Jelaskan." },
      { label: "c.", text: "Berapakah rasio keliling △ABC terhadap △PQR?" },
    ],
  }),
  Qn(36, "Menemukan Bangun Kongruen", {
    type: "mixed",
    diagram: <TwoShapesCongruent shape="triangle" color1="#22d3ee" color2="#f472b6" sides1={["6 cm","8 cm"]} sides2={["6 cm","8 cm"]} label1="△ABC" label2="△DEF"/>,
    parts: [
      { label: "a.", text: "Sebutkan pasangan sisi yang sama panjang." },
      { label: "b.", text: "Sebutkan pasangan sudut yang sama besar." },
      { label: "c.", text: "Gunakan syarat SSS (Sisi-Sisi-Sisi) untuk membuktikan kekongruenan." },
    ],
  }),
  Qn(37, "Penerapan Skala pada Denah", {
    type: "mixed",
    content: "Denah rumah berskala 1 : 200 menunjukkan sebuah ruangan berbentuk persegi panjang berukuran 3 cm × 4 cm pada denah.",
    parts: [
      { label: "a.", text: "Berapa ukuran ruangan sesungguhnya dalam meter?" },
      { label: "b.", text: "Apakah denah dan ruangan asli sebangun? Jelaskan." },
      { label: "c.", text: "Berapa rasio luas denah terhadap luas ruangan asli?" },
    ],
  }),
  Qn(38, "Soal Tipe TKA – Kesebangunan", {
    type: "mixed",
    content: "Dua bangun datar sebangun. Salah satu dimensi bangun pertama adalah 12 cm dan dimensi yang bersesuaian pada bangun kedua adalah 8 cm.",
    parts: [
      { label: "a.", text: "Tentukan faktor skala dari bangun kedua ke bangun pertama." },
      { label: "b.", math: "\\text{Jika keliling bangun kedua} = 48 \\text{ cm, keliling bangun pertama} = \\ldots" },
      { label: "c.", math: "\\text{Jika luas bangun pertama} = 108 \\text{ cm}^2, \\text{ luas bangun kedua} = \\ldots" },
    ],
  }),
  Qn(39, "Kekongruenan dan Sudut", {
    type: "mixed",
    content: "Dua segitiga dikatakan kongruen jika memenuhi salah satu dari syarat: SSS, SAS, ASA, AAS.",
    parts: [
      { label: "a.", text: "Apa kepanjangan dari SSS, SAS, ASA, dan AAS dalam konteks kekongruenan segitiga?" },
      { label: "b.", text: "Berikan ilustrasi atau gambar untuk syarat SAS (Sisi-Sudut-Sisi)." },
      { label: "c.", text: "Mengapa syarat SSA (Sisi-Sisi-Sudut) tidak cukup untuk membuktikan kekongruenan?" },
    ],
  }),
  Qn(40, "Soal Campuran – UN Tipe HOTS", {
    type: "mixed",
    content: "Dua trapesium sebangun ABCD dan EFGH. AB ∥ CD, EF ∥ GH. AB = 16 cm, CD = 10 cm, tinggi ABCD = 8 cm. Faktor skala dari EFGH ke ABCD adalah 3/2.",
    parts: [
      { label: "a.", text: "Tentukan AB, CD, dan tinggi trapesium EFGH." },
      { label: "b.", math: "L_{ABCD} = \\frac{1}{2}(AB + CD) \\times t = \\ldots" },
      { label: "c.", math: "L_{EFGH} = \\ldots \\quad (\\text{gunakan rasio luas})" },
    ],
  }),
];

const DefinisiKesebangunanPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <Shapes className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(34,211,238,0.7)' }}>
            DEFINISI KESEBANGUNAN DAN KEKONGRUENAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Kesebangunan & Kekongruenan · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-cyan-300 text-xs font-bold mb-2">📌 Ingat — Syarat Dua Bangun Sebangun</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { name: "Sudut Sama", emoji: "📐", desc: "Sudut-sudut yang bersesuaian sama besar" },
              { name: "Sisi Sebanding", emoji: "📏", desc: "Sisi-sisi yang bersesuaian sebanding" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-lg mb-1">{r.emoji}</div>
                <p className="text-cyan-300 text-[10px] font-bold">{r.name}</p>
                <p className="text-white/50 text-[9px]">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                    <span className="text-cyan-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center rounded-xl overflow-hidden">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-cyan-400 text-xs font-bold shrink-0 mt-0.5">{p.label}</span>}
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

export default DefinisiKesebangunanPage;
