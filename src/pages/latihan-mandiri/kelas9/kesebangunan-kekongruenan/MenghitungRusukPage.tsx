import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Ruler } from "lucide-react";
import { SimilarTriangles, SimilarRects, ParallelLinesTriangle, ScaleFigure } from "./GeoFigure";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string; };
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Persegi Panjang Sebangun – Cari Panjang", {
    type: "mixed",
    diagram: <SimilarRects w1={60} h1={40} w2={90} h2={60} sides1={["8 cm","5 cm","",""]} sides2={["12 cm","? cm","",""]} color1="#f97316" color2="#fbbf24"/>,
    parts: [
      { label: "a.", math: "\\frac{AB}{EF} = \\frac{BC}{FG} \\Rightarrow \\frac{8}{12} = \\frac{5}{FG}" },
      { label: "b.", text: "Hitunglah panjang FG." },
      { label: "c.", text: "Berapa faktor skala dari ABCD ke EFGH?" },
    ],
  }),
  Qn(2, "Trapesium Sebangun", {
    type: "mixed",
    content: "Trapesium ABCD sebangun dengan trapesium EFGH. AB = 10 cm, DC = 6 cm, AD = 5 cm. EF = 15 cm.",
    parts: [
      { label: "a.", text: "Tentukan faktor skala dari ABCD ke EFGH." },
      { label: "b.", text: "Hitunglah GH dan EH." },
      { label: "c.", math: "\\frac{AB}{EF} = \\frac{DC}{HG} = \\frac{AD}{EH} = k" },
    ],
  }),
  Qn(3, "Segitiga Sebangun – Mencari Sisi", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["P","Q","R"]} sideLabels1={["6","8","?"]} sideLabels2={["9","12","15"]} color1="#f97316" color2="#fb923c" type="right"/>,
    parts: [
      { label: "a.", math: "\\frac{AB}{PQ} = \\frac{6}{9} = \\frac{2}{3}" },
      { label: "b.", text: "Tentukan panjang AC." },
      { label: "c.", text: "Berapa keliling △ABC jika keliling △PQR = 36 cm?" },
    ],
  }),
  Qn(4, "Bangun Sebangun – Foto dan Bingkai", {
    type: "mixed",
    content: "Sebuah foto berukuran 6 cm × 9 cm akan dipasang pada bingkai yang sebangun dengan foto. Lebar bingkai 15 cm.",
    parts: [
      { label: "a.", text: "Tentukan panjang bingkai." },
      { label: "b.", text: "Berapa faktor skala dari foto ke bingkai?" },
      { label: "c.", text: "Berapa luas bingkai?" },
    ],
  }),
  Qn(5, "Garis Sejajar dalam Segitiga (Thales)", {
    type: "mixed",
    diagram: <ParallelLinesTriangle topLabel="DE" botLabel="BC" leftA="AD=3" leftB="DB=6" rightA="AE=4" rightB="EC=?" topSide="DE" botSide="BC" color1="#f97316" color2="#fbbf24"/>,
    parts: [
      { label: "a.", math: "\\frac{AD}{DB} = \\frac{AE}{EC} \\Rightarrow \\frac{3}{6} = \\frac{4}{EC}" },
      { label: "b.", text: "Hitunglah EC." },
      { label: "c.", text: "Hitunglah BC jika DE = 5 cm menggunakan rasio kesebangunan." },
    ],
  }),
  Qn(6, "Persegi Panjang – Mencari Lebar", {
    type: "mixed",
    content: "Dua persegi panjang ABCD dan PQRS sebangun. AB = 15 cm, BC = 10 cm, PQ = 9 cm.",
    parts: [
      { label: "a.", text: "Tentukan faktor skala dari PQRS ke ABCD." },
      { label: "b.", text: "Hitunglah QR." },
      { label: "c.", math: "\\frac{L_{PQRS}}{L_{ABCD}} = \\left(\\frac{9}{15}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(7, "Soal Kontekstual – Bayangan Pohon", {
    type: "mixed",
    content: "Sebuah tiang listrik setinggi 6 m menghasilkan bayangan 4 m di tanah. Pada saat yang sama, pohon di sampingnya menghasilkan bayangan 10 m.",
    parts: [
      { label: "a.", math: "\\frac{\\text{tinggi tiang}}{\\text{bayangan tiang}} = \\frac{\\text{tinggi pohon}}{\\text{bayangan pohon}}" },
      { label: "b.", text: "Hitunglah tinggi pohon." },
      { label: "c.", text: "Mengapa bayangan dan benda membentuk segitiga yang sebangun?" },
    ],
  }),
  Qn(8, "Mencari Sisi dari Skala", {
    type: "mixed",
    diagram: <ScaleFigure scale="2/3" label="ABCD ~ PQRS" origSides={["12 cm","9 cm"]} newSides={["?","?"]} color="#f97316"/>,
    parts: [
      { label: "a.", text: "Jika skala dari ABCD ke PQRS adalah 2:3, tentukan sisi-sisi PQRS." },
      { label: "b.", math: "PQ = \\frac{3}{2} \\times 12 = \\ldots, \\quad QR = \\frac{3}{2} \\times 9 = \\ldots" },
      { label: "c.", text: "Tentukan luas PQRS." },
    ],
  }),
  Qn(9, "Segitiga Sebangun – Dua Garis Sejajar", {
    type: "mixed",
    diagram: <ParallelLinesTriangle topLabel="DE" botLabel="BC" leftA="AD=4" leftB="DB=8" rightA="AE=?" rightB="EC=10" topSide="DE=6" botSide="BC=18" color1="#f97316" color2="#fb923c"/>,
    parts: [
      { label: "a.", math: "\\frac{AD}{DB} = \\frac{AE}{EC} \\Rightarrow \\frac{4}{8} = \\frac{AE}{10}" },
      { label: "b.", text: "Hitunglah AE." },
      { label: "c.", text: "Buktikan bahwa DE ∥ BC menggunakan Teorema Thales." },
    ],
  }),
  Qn(10, "Perbandingan Sisi Segitiga dan Segiempat", {
    type: "mixed",
    content: "Jajargenjang ABCD sebangun dengan jajargenjang EFGH. AB = 12 cm, BC = 8 cm, ∠A = 60°. EF = 18 cm.",
    parts: [
      { label: "a.", text: "Hitunglah FG." },
      { label: "b.", text: "Berapakah ∠E?" },
      { label: "c.", math: "\\text{Luas EFGH} = \\frac{L_{EFGH}}{L_{ABCD}} \\times L_{ABCD}" },
    ],
  }),
  Qn(11, "Segitiga Sebangun dalam Soal Cerita", {
    type: "mixed",
    content: "Dua gedung berdiri di sisi jalan. Gedung A setinggi 20 m memiliki bayangan 8 m. Gedung B memiliki bayangan 12 m di waktu yang sama.",
    parts: [
      { label: "a.", text: "Buatlah perbandingan tinggi badan terhadap bayangan untuk gedung A." },
      { label: "b.", text: "Hitunglah tinggi gedung B." },
      { label: "c.", math: "\\frac{20}{8} = \\frac{h_B}{12} \\Rightarrow h_B = \\ldots" },
    ],
  }),
  Qn(12, "Menghitung Sisi Sebangun dengan Persamaan", {
    type: "mixed",
    content: "△ABC ~ △DEF. AB = (x+2) cm, DE = 12 cm, BC = 6 cm, EF = 9 cm.",
    parts: [
      { label: "a.", math: "\\frac{AB}{DE} = \\frac{BC}{EF} \\Rightarrow \\frac{x+2}{12} = \\frac{6}{9}" },
      { label: "b.", text: "Selesaikan persamaan untuk mencari x." },
      { label: "c.", text: "Hitunglah panjang AB." },
    ],
  }),
  Qn(13, "Faktor Skala dari Luas", {
    type: "mixed",
    content: "Dua segitiga sebangun. Luas segitiga pertama 50 cm² dan luas segitiga kedua 200 cm².",
    parts: [
      { label: "a.", math: "k^2 = \\frac{200}{50} = 4 \\Rightarrow k = \\ldots" },
      { label: "b.", text: "Jika alas segitiga pertama 10 cm, berapa alas segitiga kedua?" },
      { label: "c.", text: "Jika keliling segitiga pertama 24 cm, berapa keliling segitiga kedua?" },
    ],
  }),
  Qn(14, "Garis Sejajar Membagi Sisi Sebanding", {
    type: "mixed",
    diagram: <ParallelLinesTriangle topLabel="MN" botLabel="PQ" leftA="AM=5" leftB="MP=10" rightA="AN=4" rightB="NQ=?" topSide="MN" botSide="PQ" color1="#f97316" color2="#fb923c"/>,
    parts: [
      { label: "a.", math: "\\frac{AM}{MP} = \\frac{AN}{NQ}" },
      { label: "b.", text: "Hitunglah NQ." },
      { label: "c.", math: "\\frac{MN}{PQ} = \\frac{AM}{AP} = \\frac{5}{15} = \\ldots" },
    ],
  }),
  Qn(15, "Perbandingan pada Foto dan Benda", {
    type: "mixed",
    content: "Sebuah mobil sepanjang 4 m difoto. Dalam foto, panjang mobil 8 cm. Lebar mobil 1,6 m.",
    parts: [
      { label: "a.", text: "Tentukan skala foto." },
      { label: "b.", text: "Berapa lebar mobil dalam foto (dalam cm)?" },
      { label: "c.", text: "Apakah foto dan mobil asli sebangun? Buktikan." },
    ],
  }),
  Qn(16, "Menghitung Panjang dengan Perbandingan", {
    type: "mixed",
    content: "Dua segitiga ABC dan PQR sebangun. AB = 7 cm, BC = 14 cm, CA = 21 cm. PQ = 5 cm.",
    parts: [
      { label: "a.", text: "Tentukan faktor skala dari △ABC ke △PQR." },
      { label: "b.", text: "Hitunglah QR dan RP." },
      { label: "c.", text: "Hitunglah keliling △PQR." },
    ],
  }),
  Qn(17, "Trapesium Sebangun – Mencari Sisi", {
    type: "mixed",
    content: "Trapesium KLMN ~ Trapesium ABCD. KL = 12, LM = 9, MN = 6, KN = 8. AB = 8.",
    parts: [
      { label: "a.", math: "k = \\frac{AB}{KL} = \\frac{8}{12} = \\ldots" },
      { label: "b.", text: "Tentukan BC, CD, dan DA." },
      { label: "c.", text: "Tentukan keliling trapesium ABCD." },
    ],
  }),
  Qn(18, "Segitiga dengan Garis Sejajar – Soal UN", {
    type: "mixed",
    diagram: <ParallelLinesTriangle topLabel="PQ" botLabel="RS" leftA="AP=6" leftB="PR=?" rightA="AQ=8" rightB="QS=12" topSide="PQ=9" botSide="RS=?" color1="#fbbf24" color2="#f97316"/>,
    parts: [
      { label: "a.", math: "\\frac{AP}{PR} = \\frac{AQ}{QS} \\Rightarrow \\frac{6}{PR} = \\frac{8}{12}" },
      { label: "b.", text: "Hitunglah PR." },
      { label: "c.", math: "\\frac{PQ}{RS} = \\frac{AP}{AR} = \\frac{6}{PR+6} \\Rightarrow RS = \\ldots" },
    ],
  }),
  Qn(19, "Perbandingan Sisi Sebangun – Dua Variabel", {
    type: "mixed",
    content: "△ABC ~ △PQR. AB = 2x cm, PQ = 3x − 1 cm, BC = 8 cm, QR = 12 cm.",
    parts: [
      { label: "a.", math: "\\frac{AB}{PQ} = \\frac{BC}{QR} \\Rightarrow \\frac{2x}{3x-1} = \\frac{8}{12}" },
      { label: "b.", text: "Selesaikan untuk x." },
      { label: "c.", text: "Tentukan AB dan PQ." },
    ],
  }),
  Qn(20, "Menghitung Ketinggian Bangunan", {
    type: "mixed",
    content: "Seseorang setinggi 1,7 m berdiri pada jarak 4 m dari sebuah lampu jalan. Panjang bayangannya 2 m. Lampu jalan berada pada ketinggian h meter.",
    parts: [
      { label: "a.", text: "Gambarlah segitiga sebangun yang terbentuk." },
      { label: "b.", math: "\\frac{h}{\\text{jarak lampu ke ujung bayangan}} = \\frac{1,7}{2}" },
      { label: "c.", text: "Hitunglah h." },
    ],
  }),
  Qn(21, "Bangun Sebangun – Mencari Keliling", {
    type: "mixed",
    content: "Dua segilima beraturan sebangun dengan rasio sisi 3 : 5.",
    parts: [
      { label: "a.", text: "Berapa rasio keliling kedua segilima?" },
      { label: "b.", text: "Jika keliling segilima besar 35 cm, berapa keliling segilima kecil?" },
      { label: "c.", text: "Berapa rasio luas kedua segilima?" },
    ],
  }),
  Qn(22, "Persegi Panjang Sebangun – Soal ANBK", {
    type: "mixed",
    content: "Persegi panjang ABCD sebangun dengan EFGH. AB = 18 cm, BC = 12 cm. Luas EFGH = 48 cm².",
    parts: [
      { label: "a.", text: "Hitunglah luas ABCD." },
      { label: "b.", math: "\\frac{L_{ABCD}}{L_{EFGH}} = k^2 \\Rightarrow k = \\ldots" },
      { label: "c.", text: "Hitunglah panjang dan lebar EFGH." },
    ],
  }),
  Qn(23, "Mencari x dan y pada Bangun Sebangun", {
    type: "mixed",
    content: "Dua segitiga sebangun. Segitiga pertama memiliki sisi 4, 6, dan x. Segitiga kedua memiliki sisi 6, 9, dan y. Rasio kesebangunan 2:3.",
    parts: [
      { label: "a.", math: "x = \\frac{3}{2} \\times 4 = \\ldots, \\quad \\text{cek: } \\frac{x}{y} = \\frac{2}{3}" },
      { label: "b.", text: "Tentukan nilai x dan y." },
      { label: "c.", text: "Verifikasi bahwa rasio ketiga pasang sisi sama." },
    ],
  }),
  Qn(24, "Garis Tengah Segitiga", {
    type: "mixed",
    content: "Pada segitiga ABC, M adalah titik tengah AB dan N adalah titik tengah AC. Sehingga MN ∥ BC dan MN = ½BC.",
    parts: [
      { label: "a.", text: "Tuliskan perbandingan △AMN dan △ABC." },
      { label: "b.", math: "\\frac{MN}{BC} = \\frac{AM}{AB} = \\frac{AN}{AC} = \\ldots" },
      { label: "c.", text: "Jika BC = 14 cm, berapakah MN?" },
    ],
  }),
  Qn(25, "Soal Bertingkat – Sebangun", {
    type: "mixed",
    content: "Diketahui △ABC ~ △ADE dengan D pada AB dan E pada AC. AD = 4 cm, AB = 10 cm, DE = 6 cm.",
    parts: [
      { label: "a.", math: "\\frac{AD}{AB} = \\frac{DE}{BC} \\Rightarrow \\frac{4}{10} = \\frac{6}{BC}" },
      { label: "b.", text: "Hitunglah BC." },
      { label: "c.", text: "Hitunglah AE jika AC = 12,5 cm." },
    ],
  }),
  Qn(26, "Denah dan Skala", {
    type: "mixed",
    content: "Sebuah kolam renang berbentuk persegi panjang 25 m × 10 m digambar pada kertas dengan skala 1 : 500.",
    parts: [
      { label: "a.", text: "Berapa panjang gambar kolam dalam cm?" },
      { label: "b.", text: "Berapa lebar gambar kolam dalam cm?" },
      { label: "c.", text: "Berapa rasio luas gambar terhadap luas kolam sesungguhnya?" },
    ],
  }),
  Qn(27, "Persamaan Rasio – Mencari Sisi", {
    type: "mixed",
    content: "Dua persegi panjang sebangun. Persegi panjang I: panjang = p cm, lebar = (p − 3) cm. Persegi panjang II: panjang = 12 cm, lebar = 8 cm.",
    parts: [
      { label: "a.", math: "\\frac{p}{12} = \\frac{p-3}{8}" },
      { label: "b.", text: "Selesaikan untuk p." },
      { label: "c.", text: "Tentukan dimensi persegi panjang I." },
    ],
  }),
  Qn(28, "Garis Sejajar Membagi Sisi – Soal TKA", {
    type: "mixed",
    diagram: <ParallelLinesTriangle topLabel="EF" botLabel="BC" leftA="AE=6" leftB="EB=9" rightA="AF=?" rightB="FC=12" topSide="EF" botSide="BC" color1="#fbbf24" color2="#f97316"/>,
    parts: [
      { label: "a.", math: "\\frac{AE}{EB} = \\frac{AF}{FC} \\Rightarrow \\frac{6}{9} = \\frac{AF}{12}" },
      { label: "b.", text: "Hitunglah AF." },
      { label: "c.", math: "\\frac{EF}{BC} = \\frac{AE}{AB} = \\frac{6}{6+9} = \\ldots" },
    ],
  }),
  Qn(29, "Keliling dan Luas Bangun Sebangun", {
    type: "mixed",
    content: "Dua segitiga sebangun dengan rasio keliling 4 : 7.",
    parts: [
      { label: "a.", text: "Berapa rasio sisi kedua segitiga itu?" },
      { label: "b.", text: "Berapa rasio luas kedua segitiga itu?" },
      { label: "c.", math: "\\text{Jika luas segitiga kecil } = 32 \\text{ cm}^2, \\text{ luas segitiga besar} = \\ldots" },
    ],
  }),
  Qn(30, "Mencari Sisi Miring", {
    type: "mixed",
    content: "Segitiga siku-siku ABC sebangun dengan segitiga siku-siku PQR. ∠B = ∠Q = 90°. AB = 6 cm, BC = 8 cm, PQ = 9 cm.",
    parts: [
      { label: "a.", math: "AC = \\sqrt{6^2 + 8^2} = \\ldots" },
      { label: "b.", text: "Tentukan faktor skala dari △ABC ke △PQR." },
      { label: "c.", text: "Tentukan QR dan PR." },
    ],
  }),
  Qn(31, "Penggunaan Skala pada Peta", {
    type: "mixed",
    content: "Dua kota A dan B berjarak 4,5 cm pada peta berskala 1 : 3.000.000.",
    parts: [
      { label: "a.", text: "Berapa jarak sesungguhnya antara kota A dan B (dalam km)?" },
      { label: "b.", text: "Jika jarak kota C ke D sesungguhnya 180 km, berapa jaraknya pada peta?" },
      { label: "c.", text: "Apakah peta dan wilayah sesungguhnya sebangun? Jelaskan." },
    ],
  }),
  Qn(32, "Soal Sebangun – Mencari Nilai x", {
    type: "mixed",
    content: "Perhatikan gambar segitiga ABC dengan D pada BC. AD ∥ ... Diketahui AB = 2x, AC = 3x, BD = 4, DC = 6.",
    parts: [
      { label: "a.", math: "\\frac{BD}{DC} = \\frac{AB}{AC} \\Rightarrow \\frac{4}{6} = \\frac{2x}{3x}" },
      { label: "b.", text: "Apakah persamaan ini selalu benar? Apa yang dapat kita simpulkan?" },
      { label: "c.", text: "Apakah AD merupakan garis bagi sudut A? Jelaskan." },
    ],
  }),
  Qn(33, "Dua Layang-Layang Sebangun", {
    type: "mixed",
    content: "Layang-layang ABCD sebangun dengan PQRS. AB = 5 cm, BC = 8 cm, PQ = 7,5 cm.",
    parts: [
      { label: "a.", text: "Tentukan faktor skala." },
      { label: "b.", text: "Tentukan QR." },
      { label: "c.", text: "Jika diagonal ABCD adalah 6 cm dan 10 cm, berapa diagonal PQRS?" },
    ],
  }),
  Qn(34, "Garis Tengah Trapesium", {
    type: "mixed",
    content: "Trapesium ABCD dengan AB ∥ CD. Panjang AB = 18 cm, CD = 10 cm. Garis tengah EF menghubungkan titik tengah AD dan BC.",
    parts: [
      { label: "a.", math: "EF = \\frac{AB + CD}{2} = \\ldots" },
      { label: "b.", text: "Apakah △AEF ~ △ABD? Jelaskan." },
      { label: "c.", text: "Berapa rasio EF terhadap AB?" },
    ],
  }),
  Qn(35, "Tinggi Bayangan Tiang Bendera", {
    type: "mixed",
    content: "Tiang bendera berdiri tegak. Pada siang hari, bayangan tiang 8 m dan pada waktu yang sama bayangan sebatang pensil 15 cm panjangnya adalah 6 cm.",
    parts: [
      { label: "a.", text: "Gambarlah segitiga sebangun yang terbentuk." },
      { label: "b.", math: "\\frac{t_{tiang}}{8} = \\frac{15}{6} \\Rightarrow t_{tiang} = \\ldots" },
      { label: "c.", text: "Hitunglah tinggi tiang bendera." },
    ],
  }),
  Qn(36, "Soal HOTS – Segitiga Bercabang", {
    type: "mixed",
    content: "Segitiga ABC dengan D pada AB dan E pada BC sehingga DE ∥ AC. Diketahui BD = 4, DA = 6, BE = 5.",
    parts: [
      { label: "a.", math: "\\frac{BD}{DA} = \\frac{BE}{EC} \\Rightarrow \\frac{4}{6} = \\frac{5}{EC}" },
      { label: "b.", text: "Hitunglah EC dan BC." },
      { label: "c.", math: "\\frac{DE}{AC} = \\frac{BD}{BA} = \\frac{4}{10} = \\ldots" },
    ],
  }),
  Qn(37, "Perbandingan Panjang Sisi Segitiga", {
    type: "mixed",
    content: "△PQR ~ △STU. Keliling △PQR = 30 cm. PQ = 6, QR = 10, PR = 14. ST = 9.",
    parts: [
      { label: "a.", text: "Tentukan faktor skala dari △PQR ke △STU." },
      { label: "b.", text: "Tentukan TU dan SU." },
      { label: "c.", text: "Tentukan keliling △STU." },
    ],
  }),
  Qn(38, "Penerapan Sebangun – Jembatan", {
    type: "mixed",
    content: "Seorang insinyur memodelkan jembatan dalam skala 1 : 1.500. Model jembatan memiliki panjang 40 cm dan lebar 6 cm.",
    parts: [
      { label: "a.", text: "Berapa panjang dan lebar jembatan sesungguhnya dalam meter?" },
      { label: "b.", text: "Apakah model dan jembatan sesungguhnya sebangun?" },
      { label: "c.", math: "\\frac{\\text{Luas model}}{\\text{Luas asli}} = \\left(\\frac{1}{1500}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(39, "Mencari Sisi – Soal ANBK Tipe C", {
    type: "mixed",
    content: "ABCD ~ EFGH dengan rasio 4 : 6. AB = 4x − 2, EF = 3x + 3.",
    parts: [
      { label: "a.", math: "\\frac{AB}{EF} = \\frac{4}{6} \\Rightarrow \\frac{4x-2}{3x+3} = \\frac{2}{3}" },
      { label: "b.", text: "Selesaikan untuk x." },
      { label: "c.", text: "Tentukan AB dan EF." },
    ],
  }),
  Qn(40, "Soal Campuran HOTS – Luas Sebangun", {
    type: "mixed",
    content: "Dua jajargenjang sebangun. Jajargenjang pertama memiliki alas 15 cm, tinggi 8 cm. Faktor skala ke jajargenjang kedua adalah 2:3.",
    parts: [
      { label: "a.", text: "Tentukan alas dan tinggi jajargenjang kedua." },
      { label: "b.", text: "Hitung luas masing-masing jajargenjang." },
      { label: "c.", math: "\\frac{L_2}{L_1} = k^2 = \\left(\\frac{3}{2}\\right)^2 = \\ldots" },
    ],
  }),
];

const MenghitungRusukPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <Ruler className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,146,60,0.7)' }}>
            MENGHITUNG PANJANG RUSUK BANGUN DATAR YANG SEBANGUN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Kesebangunan & Kekongruenan · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-2">📌 Rumus Kunci</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Perbandingan Sisi", math: "\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = k" },
              { label: "Rasio Luas", math: "\\frac{L_1}{L_2} = k^2" },
            ].map(r => (
              <div key={r.label} className="bg-white/5 rounded-lg px-3 py-2">
                <p className="text-orange-300 text-[10px] font-bold mb-1">{r.label}</p>
                <div className="text-white/80 text-xs"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-amber-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center shrink-0">
                    <span className="text-orange-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center rounded-xl overflow-hidden">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-orange-400 text-xs font-bold shrink-0 mt-0.5">{p.label}</span>}
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

export default MenghitungRusukPage;
