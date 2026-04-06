import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { CheckSquare } from "lucide-react";
import { CongruentTriangles, TwoShapesCongruent, SimilarTriangles } from "./GeoFigure";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string; };
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Syarat SSS – Sisi-Sisi-Sisi", {
    type: "mixed",
    diagram: <CongruentTriangles vertices1={["A","B","C"]} vertices2={["P","Q","R"]} sides1={["6 cm","8 cm","10 cm"]} sides2={["6 cm","8 cm","10 cm"]} color1="#f472b6" color2="#fb923c" shape="right" ticks={true}/>,
    parts: [
      { label: "a.", text: "Sebutkan tiga pasang sisi yang sama panjang." },
      { label: "b.", text: "Apakah △ABC ≅ △PQR dengan syarat SSS? Jelaskan." },
      { label: "c.", text: "Tentukan semua pasangan sudut yang sama besar." },
    ],
  }),
  Qn(2, "Syarat SAS – Sisi-Sudut-Sisi", {
    type: "mixed",
    content: "△ABC dan △DEF. AB = DE = 7 cm, BC = EF = 5 cm, ∠B = ∠E = 60°.",
    parts: [
      { label: "a.", text: "Sebutkan dua pasang sisi yang sama dan satu pasang sudut yang sama." },
      { label: "b.", text: "Apakah △ABC ≅ △DEF dengan syarat SAS? Jelaskan." },
      { label: "c.", text: "Apa yang dapat disimpulkan tentang AC dan DF?" },
    ],
  }),
  Qn(3, "Syarat ASA – Sudut-Sisi-Sudut", {
    type: "mixed",
    diagram: <CongruentTriangles vertices1={["X","Y","Z"]} vertices2={["L","M","N"]} sides1={["8 cm","",""]} sides2={["8 cm","",""]} color1="#f472b6" color2="#ec4899" shape="scalene" ticks={false}/>,
    content: "∠X = ∠L = 45°, XY = LM = 8 cm, ∠Y = ∠M = 60°.",
    parts: [
      { label: "a.", text: "Syarat apa yang digunakan? (Sudut-Sisi-Sudut)" },
      { label: "b.", text: "Apakah △XYZ ≅ △LMN? Jelaskan." },
      { label: "c.", text: "Tentukan ∠Z dan ∠N." },
    ],
  }),
  Qn(4, "Syarat AAS – Sudut-Sudut-Sisi", {
    type: "mixed",
    content: "△MNO dan △PQR. ∠M = ∠P = 50°, ∠N = ∠Q = 70°, NO = QR = 9 cm.",
    parts: [
      { label: "a.", text: "Tentukan ∠O dan ∠R." },
      { label: "b.", text: "Apakah △MNO ≅ △PQR dengan syarat AAS? Jelaskan." },
      { label: "c.", text: "Sisi mana yang saling bersesuaian selain NO dan QR?" },
    ],
  }),
  Qn(5, "Membedakan Syarat Kekongruenan", {
    type: "mixed",
    content: "Untuk setiap pasang segitiga, tentukan syarat kekongruenan yang digunakan (SSS, SAS, ASA, atau AAS):",
    parts: [
      { label: "a.", text: "△ABC dengan AB = 5, BC = 7, AC = 9. △DEF dengan DE = 5, EF = 7, DF = 9." },
      { label: "b.", text: "△GHI dengan GH = 6, ∠G = 40°, GI = 8. △JKL dengan JK = 6, ∠J = 40°, JL = 8." },
      { label: "c.", text: "△MNO dengan ∠M = 55°, ∠N = 75°, MN = 10. △PQR dengan ∠P = 55°, ∠Q = 75°, PQ = 10." },
    ],
  }),
  Qn(6, "Mengapa SSA Tidak Cukup", {
    type: "mixed",
    content: "Dua segitiga memiliki dua sisi sama dan satu sudut yang sama (bukan sudut apit). Apakah pasti kongruen?",
    parts: [
      { label: "a.", text: "Gambarlah contoh dua segitiga yang berbeda dengan dua sisi sama dan sudut sama (bukan sudut apit)." },
      { label: "b.", text: "Mengapa syarat SSA tidak cukup untuk membuktikan kekongruenan?" },
      { label: "c.", text: "Syarat apa yang harus ditambahkan agar SSA menjadi valid?" },
    ],
  }),
  Qn(7, "Kekongruenan Persegi Panjang", {
    type: "mixed",
    diagram: <TwoShapesCongruent shape="rect" color1="#f472b6" color2="#fb923c" sides1={["10 cm","6 cm"]} sides2={["10 cm","6 cm"]} label1="ABCD" label2="PQRS"/>,
    parts: [
      { label: "a.", text: "Apakah ABCD ≅ PQRS? Berikan alasannya." },
      { label: "b.", text: "Tuliskan pasangan titik sudut yang bersesuaian." },
      { label: "c.", text: "Apakah diagonal kedua persegi panjang sama panjang?" },
    ],
  }),
  Qn(8, "Kekongruenan Segitiga Sama Kaki", {
    type: "mixed",
    content: "Segitiga sama kaki ABC dengan AB = AC = 8 cm dan BC = 6 cm. Segitiga sama kaki DEF dengan DE = DF = 8 cm dan EF = 6 cm.",
    parts: [
      { label: "a.", text: "Apakah △ABC ≅ △DEF? Syarat apa yang digunakan?" },
      { label: "b.", text: "Tuliskan semua pasangan sisi yang sama panjang." },
      { label: "c.", text: "Apa yang dapat kita simpulkan tentang sudut-sudutnya?" },
    ],
  }),
  Qn(9, "Kekongruenan Segitiga Siku-Siku", {
    type: "mixed",
    content: "Dua segitiga siku-siku: △PQR (∠Q = 90°) dengan PQ = 5, QR = 12, PR = 13. △XYZ (∠Y = 90°) dengan XY = 5, YZ = 12, XZ = 13.",
    parts: [
      { label: "a.", text: "Apakah △PQR ≅ △XYZ? Syarat apa?" },
      { label: "b.", text: "Tuliskan pasangan titik sudut dan sisi yang bersesuaian." },
      { label: "c.", text: "Jika ada tambahan syarat HL (Hipotenusa-Kaki), jelaskan maknanya." },
    ],
  }),
  Qn(10, "Membuktikan Kekongruenan – Diagonal", {
    type: "mixed",
    content: "Persegi panjang ABCD memiliki diagonal AC dan BD yang berpotongan di O.",
    parts: [
      { label: "a.", text: "Buktikan bahwa △AOB ≅ △COD." },
      { label: "b.", text: "Syarat kekongruenan apa yang digunakan? (ASA: AO = CO, ∠AOB = ∠COD, BO = DO)" },
      { label: "c.", text: "Apa yang dapat disimpulkan tentang diagonal persegi panjang?" },
    ],
  }),
  Qn(11, "Kekongruenan Segitiga dalam Segiempat", {
    type: "mixed",
    content: "Jajargenjang ABCD. Diagonal AC membaginya menjadi △ABC dan △CDA.",
    parts: [
      { label: "a.", text: "Tuliskan pasangan sisi yang sama: AB = ?, BC = ?." },
      { label: "b.", text: "Sudut mana yang sama karena sisi-sisi sejajar?" },
      { label: "c.", text: "Buktikan △ABC ≅ △CDA menggunakan syarat SAS atau ASA." },
    ],
  }),
  Qn(12, "Syarat Kekongruenan – Soal UN", {
    type: "mixed",
    diagram: <CongruentTriangles vertices1={["A","B","C"]} vertices2={["D","E","F"]} sides1={["7","5",""]} sides2={["7","5",""]} color1="#f472b6" color2="#fb923c" shape="isosceles" ticks={true}/>,
    content: "∠B = ∠E = 55°. AB = DE = 7 cm. BC = EF = 5 cm.",
    parts: [
      { label: "a.", text: "Syarat kekongruenan apa yang terpenuhi?" },
      { label: "b.", text: "Apakah △ABC ≅ △DEF?" },
      { label: "c.", text: "Hitunglah ∠A dan ∠D jika ∠C = ∠F = 65°." },
    ],
  }),
  Qn(13, "Kekongruenan dan Refleksi", {
    type: "mixed",
    content: "Segitiga ABC dicerminkan terhadap garis l menghasilkan △A'B'C'.",
    parts: [
      { label: "a.", text: "Apakah △ABC ≅ △A'B'C'? Mengapa refleksi menghasilkan bangun kongruen?" },
      { label: "b.", text: "Apakah △ABC ~ △A'B'C'? Berapa faktor skalanya?" },
      { label: "c.", text: "Apakah orientasi (searah jarum jam) kedua segitiga sama?" },
    ],
  }),
  Qn(14, "Kekongruenan dan Rotasi", {
    type: "mixed",
    content: "Segitiga KLM dirotasi 120° terhadap pusat O menghasilkan △K'L'M'.",
    parts: [
      { label: "a.", text: "Apakah △KLM ≅ △K'L'M'?" },
      { label: "b.", text: "Apakah KO = K'O? Mengapa?" },
      { label: "c.", text: "Translasi, rotasi, dan refleksi semuanya menghasilkan bangun kongruen. Mengapa dilatasi tidak?" },
    ],
  }),
  Qn(15, "Segitiga Kongruen dalam Lingkaran", {
    type: "mixed",
    content: "Dua tali busur yang sama panjang: AB = CD. O adalah pusat lingkaran.",
    parts: [
      { label: "a.", text: "Buktikan △OAB ≅ △OCD." },
      { label: "b.", text: "Syarat apa yang digunakan? (OA = OC = OB = OD = r, AB = CD, maka SSS)" },
      { label: "c.", text: "Apa yang dapat disimpulkan tentang jarak tali busur ke pusat?" },
    ],
  }),
  Qn(16, "Mencari Sisi dari Kekongruenan", {
    type: "mixed",
    content: "△PQR ≅ △STU. PQ = 3x + 2, ST = 5x − 4.",
    parts: [
      { label: "a.", math: "PQ = ST \\Rightarrow 3x + 2 = 5x - 4" },
      { label: "b.", text: "Selesaikan untuk x." },
      { label: "c.", text: "Tentukan panjang PQ dan ST." },
    ],
  }),
  Qn(17, "Kekongruenan Segitiga – Dua Persamaan", {
    type: "mixed",
    content: "△ABC ≅ △PQR. AB = 2a + 3, PQ = a + 7, BC = 3b − 1, QR = 2b + 2.",
    parts: [
      { label: "a.", math: "2a + 3 = a + 7 \\Rightarrow a = \\ldots" },
      { label: "b.", math: "3b - 1 = 2b + 2 \\Rightarrow b = \\ldots" },
      { label: "c.", text: "Tentukan AB, PQ, BC, dan QR." },
    ],
  }),
  Qn(18, "Membuktikan Kekongruenan – Soal UN 2018", {
    type: "mixed",
    content: "Diketahui titik C adalah titik tengah AB dan titik tengah DE. Buktikan △ACD ≅ △BCE.",
    parts: [
      { label: "a.", text: "Tuliskan apa yang diketahui: AC = BC, DC = EC (C titik tengah)." },
      { label: "b.", text: "Sudut mana yang sama karena bertolak belakang di C?" },
      { label: "c.", text: "Syarat kekongruenan apa yang digunakan? (SAS)" },
    ],
  }),
  Qn(19, "Kekongruenan Belah Ketupat", {
    type: "mixed",
    content: "Belah ketupat ABCD. Diagonal AC dan BD berpotongan di O. Buktikan kekongruenan empat segitiga yang terbentuk.",
    parts: [
      { label: "a.", text: "Apa yang diketahui tentang diagonal belah ketupat? (saling membagi dua sama panjang dan tegak lurus)" },
      { label: "b.", text: "Buktikan △AOB ≅ △BOC menggunakan SSS." },
      { label: "c.", text: "Apakah keempat segitiga yang terbentuk semuanya kongruen?" },
    ],
  }),
  Qn(20, "Segitiga Kongruen – Soal Cerita", {
    type: "mixed",
    content: "Seorang tukang kayu memotong dua segitiga dari papan kayu. Segitiga pertama memiliki sisi 10 cm, 8 cm, dan 6 cm. Segitiga kedua memiliki sisi 10 cm, 8 cm, dan 6 cm.",
    parts: [
      { label: "a.", text: "Apakah kedua segitiga kongruen? Syarat apa?" },
      { label: "b.", text: "Apakah kedua segitiga pasti sebangun?" },
      { label: "c.", text: "Jika kedua segitiga disatukan, bangun apa yang terbentuk jika sisi 6 cm ditempelkan?" },
    ],
  }),
  Qn(21, "Kekongruenan Trapesium Sama Kaki", {
    type: "mixed",
    content: "Trapesium sama kaki ABCD (AB ∥ CD, AD = BC). Buktikan △ACD ≅ △BDC.",
    parts: [
      { label: "a.", text: "Tuliskan sisi-sisi yang sama: DC = DC (sama), AD = BC (sama kaki), AC = BD (diagonal sama kaki)." },
      { label: "b.", text: "Syarat kekongruenan apa yang digunakan? (SSS)" },
      { label: "c.", text: "Apa yang dapat disimpulkan dari kekongruenan tersebut?" },
    ],
  }),
  Qn(22, "Kekongruenan dan Sudut", {
    type: "mixed",
    content: "△RST ≅ △XYZ. ∠R = 40°, ∠S = 3a + 5°, ∠Y = 5a − 15°.",
    parts: [
      { label: "a.", math: "∠S = ∠Y \\Rightarrow 3a + 5 = 5a - 15 \\Rightarrow a = \\ldots" },
      { label: "b.", text: "Tentukan ∠S, ∠T, dan ∠Z." },
      { label: "c.", text: "Verifikasi bahwa jumlah sudut dalam segitiga = 180°." },
    ],
  }),
  Qn(23, "Kekongruenan dari Gambar – Soal ANBK", {
    type: "mixed",
    diagram: <CongruentTriangles vertices1={["A","B","C"]} vertices2={["D","E","F"]} sides1={["9","7","11"]} sides2={["9","7","11"]} color1="#f472b6" color2="#ec4899" shape="scalene" ticks={true}/>,
    parts: [
      { label: "a.", text: "Tuliskan syarat kekongruenan yang terpenuhi." },
      { label: "b.", text: "Tuliskan notasi kekongruenan dengan urutan titik sudut yang benar." },
      { label: "c.", text: "Sebutkan semua pasangan sisi dan sudut yang bersesuaian." },
    ],
  }),
  Qn(24, "Syarat Kekongruenan Segitiga – Mana yang Valid?", {
    type: "mixed",
    content: "Tentukan apakah setiap syarat berikut cukup untuk membuktikan kekongruenan segitiga:",
    parts: [
      { label: "a.", text: "SSS (Sisi-Sisi-Sisi): Tiga pasang sisi sama panjang." },
      { label: "b.", text: "SAS (Sisi-Sudut-Sisi): Dua sisi dan sudut yang diapit sama." },
      { label: "c.", text: "SSA (Sisi-Sisi-Sudut): Dua sisi dan sudut yang tidak diapit sama." },
    ],
  }),
  Qn(25, "Kekongruenan dan Transformasi", {
    type: "mixed",
    content: "Tentukan jenis transformasi yang menghasilkan bangun kongruen dari setiap kasus:",
    parts: [
      { label: "a.", text: "Segitiga dipindahkan sejauh 5 satuan ke kanan." },
      { label: "b.", text: "Segitiga dicerminkan terhadap sumbu x." },
      { label: "c.", text: "Segitiga dirotasi 90° terhadap titik O." },
    ],
  }),
  Qn(26, "Membuktikan △ Kongruen dalam Segitiga", {
    type: "mixed",
    content: "Dalam △ABC, M adalah titik tengah AC. BM adalah median. Titik D pada BM sehingga MD = MB.",
    parts: [
      { label: "a.", text: "Tuliskan yang diketahui: AM = MC, BM = MD, ∠AMB = ∠CMD (bertolak belakang)." },
      { label: "b.", text: "Apakah △AMB ≅ △CMD? Syarat apa?" },
      { label: "c.", text: "Apa yang dapat disimpulkan tentang AB dan CD?" },
    ],
  }),
  Qn(27, "Kekongruenan Persegi", {
    type: "mixed",
    content: "Dua persegi ABCD dan EFGH dengan sisi masing-masing 7 cm.",
    parts: [
      { label: "a.", text: "Apakah ABCD ≅ EFGH? Sebutkan syaratnya." },
      { label: "b.", text: "Apakah semua persegi dengan sisi sama pasti kongruen?" },
      { label: "c.", text: "Berikan contoh dua bangun yang luasnya sama tetapi tidak kongruen." },
    ],
  }),
  Qn(28, "Kekongruenan – Mencari Sudut", {
    type: "mixed",
    content: "△ABC ≅ △PQR. ∠A = (2x + 10)°, ∠P = (3x − 15)°.",
    parts: [
      { label: "a.", math: "2x + 10 = 3x - 15 \\Rightarrow x = \\ldots" },
      { label: "b.", text: "Tentukan ∠A dan ∠P." },
      { label: "c.", math: "\\text{Jika } ∠B = 65°, \\text{ maka } ∠C = ∠R = \\ldots" },
    ],
  }),
  Qn(29, "Kekongruenan Segitiga – Soal TKA", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["G","H","I"]} vertices2={["J","K","L"]} sideLabels1={["5","12","13"]} sideLabels2={["5","12","13"]} color1="#f472b6" color2="#fb923c" type="right"/>,
    parts: [
      { label: "a.", text: "Apakah △GHI ≅ △JKL? Syarat apa?" },
      { label: "b.", text: "Apakah △GHI ~ △JKL juga berlaku? Berapa rasionya?" },
      { label: "c.", text: "Apakah ini segitiga siku-siku? Periksa dengan Pythagoras." },
    ],
  }),
  Qn(30, "Kekongruenan dalam Soal Nyata", {
    type: "mixed",
    content: "Dua jendela berbentuk segitiga sama sisi dipasang pada dinding. Jendela A bersisi 60 cm dan jendela B bersisi 60 cm.",
    parts: [
      { label: "a.", text: "Apakah kedua jendela kongruen?" },
      { label: "b.", text: "Jika jendela A diputar 60°, apakah bentuknya masih sama dengan B?" },
      { label: "c.", text: "Berapa banyak posisi rotasi yang membuat △ sama sisi tampak sama?" },
    ],
  }),
  Qn(31, "Penerapan ASA – Soal UN", {
    type: "mixed",
    content: "Dalam △ABC dan △DEF, diketahui ∠A = ∠D = 70°, AB = DE = 8 cm, ∠B = ∠E = 50°.",
    parts: [
      { label: "a.", text: "Apakah △ABC ≅ △DEF dengan syarat ASA?" },
      { label: "b.", text: "Tentukan ∠C dan ∠F." },
      { label: "c.", text: "Apa kesimpulan tentang sisi AC, BC, DF, EF?" },
    ],
  }),
  Qn(32, "Kekongruenan dari Konstruksi", {
    type: "mixed",
    content: "Diketahui △ABC. Untuk menggambar △DEF yang kongruen, digunakan kompas dan penggaris.",
    parts: [
      { label: "a.", text: "Langkah-langkah apa yang dilakukan menggunakan syarat SSS?" },
      { label: "b.", text: "Mengapa hasil konstruksi dengan SSS pasti menghasilkan segitiga yang kongruen?" },
      { label: "c.", text: "Apakah ada lebih dari satu segitiga yang bisa dibuat dari tiga panjang sisi yang sama?" },
    ],
  }),
  Qn(33, "Kekongruenan Segitiga – Level HOTS", {
    type: "mixed",
    content: "Diketahui garis lurus PQ. Titik R di atas PQ. Titik S di bawah PQ. RS memotong PQ di T sehingga RT = ST.",
    parts: [
      { label: "a.", text: "Jika PT = TQ, buktikan △PTR ≅ △QTS." },
      { label: "b.", text: "Syarat kekongruenan apa yang digunakan? (SAS: PT = QT, RT = ST, ∠PTR = ∠QTS)" },
      { label: "c.", text: "Apa yang dapat disimpulkan tentang PR dan QS?" },
    ],
  }),
  Qn(34, "Kekongruenan dengan Persamaan", {
    type: "mixed",
    content: "△ABC ≅ △PQR. AB = (4x − 3) cm, PQ = (2x + 5) cm. BC = (3y + 1) cm, QR = (5y − 7) cm.",
    parts: [
      { label: "a.", math: "4x - 3 = 2x + 5 \\Rightarrow x = \\ldots" },
      { label: "b.", math: "3y + 1 = 5y - 7 \\Rightarrow y = \\ldots" },
      { label: "c.", text: "Tentukan AB, PQ, BC, dan QR." },
    ],
  }),
  Qn(35, "Kekongruenan Segiempat", {
    type: "mixed",
    content: "Jajargenjang ABCD dan persegi panjang EFGH. AB = EF = 10 cm, BC = FG = 6 cm.",
    parts: [
      { label: "a.", text: "Apakah ABCD ≅ EFGH? Periksa semua syarat." },
      { label: "b.", text: "Apa perbedaan sudut yang membuat keduanya tidak kongruen?" },
      { label: "c.", text: "Kapan jajargenjang dan persegi panjang bisa kongruen?" },
    ],
  }),
  Qn(36, "Mengidentifikasi Kekongruenan dari Soal ANBK", {
    type: "mixed",
    diagram: <TwoShapesCongruent shape="triangle" color1="#f472b6" color2="#fb923c" sides1={["7 cm","7 cm"]} sides2={["7 cm","7 cm"]} label1="△ABC" label2="△DEF"/>,
    content: "△ABC sama kaki dengan AB = AC = 7 cm, BC = 10 cm. △DEF sama kaki dengan DE = DF = 7 cm, EF = 10 cm.",
    parts: [
      { label: "a.", text: "Apakah △ABC ≅ △DEF? Syarat apa?" },
      { label: "b.", text: "Tentukan semua pasangan sisi dan sudut yang bersesuaian." },
      { label: "c.", text: "Hitunglah luas △ABC jika tinggi ke BC = 9,6 cm. Apakah luas △DEF sama?" },
    ],
  }),
  Qn(37, "Kekongruenan – Soal Kontekstual", {
    type: "mixed",
    content: "Dua buah bingkai foto berbentuk segitiga siku-siku sama kaki. Kedua kaki masing-masing berukuran 20 cm.",
    parts: [
      { label: "a.", text: "Apakah kedua bingkai kongruen? Syarat apa?" },
      { label: "b.", text: "Hitunglah hipotenusa masing-masing bingkai." },
      { label: "c.", text: "Hitunglah luas masing-masing bingkai." },
    ],
  }),
  Qn(38, "Syarat Kekongruenan dari Perspektif Berbeda", {
    type: "mixed",
    content: "△ABC dan △DEF kongruen. Namun, susunan titik sudutnya berbeda: △ABC ≅ △EFD.",
    parts: [
      { label: "a.", text: "Tuliskan pasangan sudut yang bersesuaian dari △ABC ≅ △EFD." },
      { label: "b.", text: "Tuliskan pasangan sisi yang bersesuaian." },
      { label: "c.", text: "Apakah △BAC ≅ △FED juga benar? Jelaskan." },
    ],
  }),
  Qn(39, "Kekongruenan Segitiga – Soal TKA Akhir", {
    type: "mixed",
    diagram: <CongruentTriangles vertices1={["P","Q","R"]} vertices2={["S","T","U"]} sides1={["10","8","6"]} sides2={["10","8","6"]} color1="#f472b6" color2="#fb923c" shape="right" ticks={true}/>,
    parts: [
      { label: "a.", text: "Tuliskan syarat yang membuat △PQR ≅ △STU." },
      { label: "b.", text: "Apakah ini segitiga siku-siku? Tentukan sisi miringnya." },
      { label: "c.", math: "\\text{Luas } △PQR = \\frac{1}{2} \\times 6 \\times 8 = \\ldots" },
    ],
  }),
  Qn(40, "Soal HOTS Akhir – Kekongruenan Berganda", {
    type: "mixed",
    content: "Persegi ABCD dibagi oleh kedua diagonalnya menjadi empat segitiga: △AOB, △BOC, △COD, △DOA (O = titik potong diagonal).",
    parts: [
      { label: "a.", text: "Buktikan △AOB ≅ △BOC menggunakan SSS (AO = CO, BO = BO, AB = BC)." },
      { label: "b.", text: "Apakah keempat segitiga semuanya kongruen? Mengapa?" },
      { label: "c.", text: "Apakah keempat segitiga juga saling sebangun? Berapa faktor skalanya?" },
    ],
  }),
];

const KekongruenBangunDatarPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <CheckSquare className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,113,133,0.7)' }}>
            KEKONGRUENAN PADA BANGUN DATAR
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Kesebangunan & Kekongruenan · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-2">📌 Empat Syarat Kekongruenan Segitiga</p>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {[
              { name: "SSS", desc: "Sisi-Sisi-Sisi" },
              { name: "SAS", desc: "Sisi-∠-Sisi" },
              { name: "ASA", desc: "∠-Sisi-∠" },
              { name: "AAS", desc: "∠-∠-Sisi" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-2 py-2 text-center">
                <p className="text-rose-300 font-bold text-sm mb-0.5">{r.name}</p>
                <p className="text-white/50 text-[9px]">{r.desc}</p>
              </div>
            ))}
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
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center rounded-xl overflow-hidden">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-rose-400 text-xs font-bold shrink-0 mt-0.5">{p.label}</span>}
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

export default KekongruenBangunDatarPage;
