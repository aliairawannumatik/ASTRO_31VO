import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

function ConeSVG({ r, h, s, color = "#fb923c", extraLabel = "", showHeight = true }: {
  r?: string; h?: string; s?: string; color?: string; extraLabel?: string; showHeight?: boolean;
}) {
  return (
    <svg viewBox="0 0 220 200" width="220" height="200" className="mx-auto">
      <defs>
        <linearGradient id={`cone-fill-${r}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="160" rx="65" ry="20" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.8" />
      <line x1="45" y1="160" x2="110" y2="28" stroke={color} strokeWidth="1.8" />
      <line x1="175" y1="160" x2="110" y2="28" stroke={color} strokeWidth="1.8" />
      <polygon points="45,160 175,160 110,28" fill={`url(#cone-fill-${r})`} />
      {showHeight && (
        <>
          <line x1="110" y1="28" x2="110" y2="160" stroke={color} strokeWidth="1" strokeDasharray="5,3" />
          <line x1="107" y1="28" x2="113" y2="28" stroke={color} strokeWidth="1.2" />
        </>
      )}
      {r && (
        <>
          <line x1="110" y1="160" x2="175" y2="160" stroke={color} strokeWidth="1.2" strokeDasharray="4,2" />
          <text x="142" y="152" fill={color} fontSize="12" textAnchor="middle" fontFamily="monospace">r = {r}</text>
        </>
      )}
      {h && showHeight && (
        <>
          <line x1="95" y1="28" x2="95" y2="160" stroke={color} strokeWidth="1" strokeDasharray="4,2" />
          <line x1="91" y1="28" x2="99" y2="28" stroke={color} strokeWidth="1" />
          <line x1="91" y1="160" x2="99" y2="160" stroke={color} strokeWidth="1" />
          <text x="80" y="100" fill={color} fontSize="12" textAnchor="middle" fontFamily="monospace">t = {h}</text>
        </>
      )}
      {s && (
        <>
          <text x="158" y="95" fill={color} fontSize="12" textAnchor="middle" fontFamily="monospace">s = {s}</text>
        </>
      )}
      {extraLabel && (
        <text x="110" y="192" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">{extraLabel}</text>
      )}
    </svg>
  );
}

function ConeNetSVG({ r, color = "#fb923c" }: { r?: string; color?: string }) {
  return (
    <svg viewBox="0 0 280 180" width="280" height="180" className="mx-auto">
      <path d="M 140 20 L 30 160 A 120 120 0 0 0 250 160 Z" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.8" />
      <text x="140" y="110" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Selimut (sektor)</text>
      <text x="140" y="130" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">jari-jari = s (garis pelukis)</text>
      <ellipse cx="140" cy="165" rx="45" ry="14" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.8" />
      <text x="140" y="169" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace">Alas (r)</text>
    </svg>
  );
}

const questions: Q[] = [
  Qn(1, "Garis Pelukis Kerucut", {
    content: "Sebuah kerucut memiliki jari-jari alas 6 cm dan tinggi 8 cm. Tentukan panjang garis pelukis (s)!",
    diagram: <ConeSVG r="6 cm" h="8 cm" />,
    parts: [
      { label: "a.", math: "s = \\sqrt{r^2 + t^2} = \\sqrt{6^2 + 8^2} = \\sqrt{\\ldots + \\ldots} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(2, "Luas Selimut Kerucut", {
    content: "Sebuah kerucut memiliki jari-jari 7 cm dan garis pelukis 25 cm. Hitunglah luas selimut kerucut! (π = 22/7)",
    diagram: <ConeSVG r="7 cm" s="25 cm" />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = \\pi r s = \\frac{22}{7} \\times 7 \\times 25 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(3, "Luas Permukaan Total Kerucut", {
    content: "Sebuah kerucut memiliki jari-jari 5 cm dan tinggi 12 cm. Hitunglah luas permukaan kerucut! (π = 3,14)",
    diagram: <ConeSVG r="5 cm" h="12 cm" />,
    parts: [
      { label: "a.", math: "s = \\sqrt{5^2 + 12^2} = \\sqrt{169} = \\ldots \\text{ cm}" },
      { label: "b.", math: "L = \\pi r (r + s) = 3{,}14 \\times 5 \\times (5 + 13) = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(4, "Volume Kerucut", {
    content: "Sebuah kerucut memiliki jari-jari 7 cm dan tinggi 15 cm. Hitunglah volume kerucut! (π = 22/7)",
    diagram: <ConeSVG r="7 cm" h="15 cm" />,
    parts: [
      { label: "a.", math: "V = \\frac{1}{3}\\pi r^2 t = \\frac{1}{3} \\times \\frac{22}{7} \\times 7^2 \\times 15 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(5, "Volume Kerucut – Diameter Diketahui", {
    content: "Sebuah kerucut berdiameter 21 cm dan tinggi 20 cm. Hitunglah volumenya! (π = 22/7)",
    diagram: <ConeSVG r="10,5 cm" h="20 cm" />,
    parts: [
      { label: "a.", math: "r = \\frac{21}{2} = 10{,}5 \\text{ cm}" },
      { label: "b.", math: "V = \\frac{1}{3} \\times \\frac{22}{7} \\times 10{,}5^2 \\times 20 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(6, "Mencari Tinggi dari Volume", {
    content: "Volume sebuah kerucut adalah 1.232 cm³. Jika jari-jarinya 7 cm, tentukan tinggi kerucut! (π = 22/7)",
    diagram: <ConeSVG r="7 cm" h="?" />,
    parts: [
      { label: "a.", math: "V = \\frac{1}{3}\\pi r^2 t \\Rightarrow 1232 = \\frac{1}{3} \\times \\frac{22}{7} \\times 49 \\times t" },
      { label: "b.", math: "t = \\frac{1232 \\times 3 \\times 7}{22 \\times 49} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(7, "Mencari Jari-Jari dari Volume", {
    content: "Volume sebuah kerucut adalah 2.512 cm³ dan tingginya 24 cm. Tentukan jari-jari alas kerucut! (π = 3,14)",
    diagram: <ConeSVG r="?" h="24 cm" />,
    parts: [
      { label: "a.", math: "\\frac{1}{3}\\pi r^2 \\times 24 = 2512 \\Rightarrow 8\\pi r^2 = 2512" },
      { label: "b.", math: "r^2 = \\frac{2512}{8 \\times 3{,}14} = \\ldots \\Rightarrow r = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(8, "Mencari Garis Pelukis dari Luas Selimut", {
    content: "Luas selimut sebuah kerucut adalah 550 cm². Jika jari-jarinya 7 cm, tentukan garis pelukisnya! (π = 22/7)",
    diagram: <ConeSVG r="7 cm" s="?" />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = \\pi r s \\Rightarrow 550 = \\frac{22}{7} \\times 7 \\times s" },
      { label: "b.", math: "s = \\frac{550}{22} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(9, "Jaring-Jaring Kerucut", {
    content: "Perhatikan jaring-jaring kerucut berikut! Kerucut memiliki r = 5 cm dan garis pelukis s = 13 cm.",
    diagram: <ConeNetSVG r="5" />,
    parts: [
      { label: "a.", text: "Sebutkan dua bagian jaring-jaring kerucut!" },
      { label: "b.", math: "L_{\\text{selimut}} = \\pi r s = \\frac{22}{7} \\times 5 \\times 13 = \\ldots \\text{ cm}^2" },
      { label: "c.", math: "L_{\\text{alas}} = \\pi r^2 = \\frac{22}{7} \\times 25 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(10, "Soal Cerita – Topi Kerucut", {
    content: "Sebuah topi berbentuk kerucut dengan r = 14 cm dan garis pelukis 25 cm. Berapa cm² kain yang dibutuhkan untuk membuat satu topi? (π = 22/7)",
    diagram: <ConeSVG r="14 cm" s="25 cm" color="#f472b6" extraLabel="Topi" />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = \\pi r s = \\frac{22}{7} \\times 14 \\times 25 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(11, "Soal Cerita – Corong Kerucut", {
    content: "Sebuah corong berbentuk kerucut tanpa alas memiliki r = 10 cm dan s = 26 cm. Berapa luas selimutnya? (π = 3,14)",
    diagram: <ConeSVG r="10 cm" s="26 cm" showHeight={false} />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = \\pi r s = 3{,}14 \\times 10 \\times 26 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(12, "Volume Kerucut Setengah", {
    content: "Sebuah cornet es krim berbentuk kerucut dengan r = 3,5 cm dan t = 12 cm. Berapa cm³ es krim yang dapat dimuat? (π = 22/7)",
    diagram: <ConeSVG r="3,5 cm" h="12 cm" color="#f472b6" extraLabel="Es Krim" />,
    parts: [
      { label: "a.", math: "V = \\frac{1}{3}\\pi r^2 t = \\frac{1}{3} \\times \\frac{22}{7} \\times (3{,}5)^2 \\times 12 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(13, "Luas Permukaan – Cari Tinggi", {
    content: "Luas permukaan total sebuah kerucut adalah 75π cm². Jika jari-jarinya 5 cm, tentukan garis pelukisnya!",
    diagram: <ConeSVG r="5 cm" s="?" />,
    parts: [
      { label: "a.", math: "L = \\pi r(r + s) = 75\\pi \\Rightarrow 5(5 + s) = 75" },
      { label: "b.", math: "5 + s = 15 \\Rightarrow s = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(14, "Mencari Tinggi dari Garis Pelukis", {
    content: "Sebuah kerucut memiliki jari-jari 9 cm dan garis pelukis 15 cm. Tentukan tinggi kerucut tersebut!",
    diagram: <ConeSVG r="9 cm" s="15 cm" />,
    parts: [
      { label: "a.", math: "s^2 = r^2 + t^2 \\Rightarrow 15^2 = 9^2 + t^2" },
      { label: "b.", math: "t^2 = 225 - 81 = 144 \\Rightarrow t = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(15, "UN Style – Volume Kerucut", {
    content: "Sebuah kerucut memiliki garis pelukis 10 cm dan jari-jari 6 cm. Hitunglah volume kerucut! (π = 3,14)",
    diagram: <ConeSVG r="6 cm" s="10 cm" />,
    parts: [
      { label: "a.", math: "t = \\sqrt{s^2 - r^2} = \\sqrt{100 - 36} = \\sqrt{64} = \\ldots \\text{ cm}" },
      { label: "b.", math: "V = \\frac{1}{3} \\times 3{,}14 \\times 36 \\times t = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(16, "Perbandingan Volume Dua Kerucut", {
    content: "Kerucut A: r = 6, t = 4. Kerucut B: r = 3, t = 8. Hitunglah perbandingan volume A dan B!",
    parts: [
      { label: "a.", math: "V_A = \\frac{1}{3}\\pi \\times 36 \\times 4 = 48\\pi" },
      { label: "b.", math: "V_B = \\frac{1}{3}\\pi \\times 9 \\times 8 = 24\\pi" },
      { label: "c.", math: "\\frac{V_A}{V_B} = \\frac{48\\pi}{24\\pi} = \\ldots" },
    ],
  }),
  Qn(17, "Soal Cerita – Gunung Pasir", {
    content: "Sebuah tumpukan pasir berbentuk kerucut dengan r = 3 m dan t = 4 m. Berapa m³ volume pasir tersebut? (π = 3,14)",
    diagram: <ConeSVG r="3 m" h="4 m" color="#fbbf24" extraLabel="Tumpukan Pasir" />,
    parts: [
      { label: "a.", math: "V = \\frac{1}{3} \\times 3{,}14 \\times 3^2 \\times 4 = \\ldots \\text{ m}^3" },
    ],
  }),
  Qn(18, "Biaya Cat Selimut Kerucut", {
    content: "Sebuah kerucut dengan r = 7 cm dan s = 20 cm akan dicat. Jika biaya Rp2.000 per cm², berapakah total biaya? (π = 22/7)",
    diagram: <ConeSVG r="7 cm" s="20 cm" color="#a78bfa" />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = \\frac{22}{7} \\times 7 \\times 20 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "\\text{Biaya} = \\ldots \\times 2000 = \\text{Rp}\\ldots" },
    ],
  }),
  Qn(19, "ANBK – Kerucut dan Kubus", {
    content: "Sebuah kerucut dengan r = 7 cm dan t = 12 cm dimasukkan ke dalam kubus bersisi 14 cm. Berapa volume yang tersisa? (π = 22/7)",
    diagram: <ConeSVG r="7 cm" h="12 cm" />,
    parts: [
      { label: "a.", math: "V_{\\text{kubus}} = 14^3 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times \\frac{22}{7} \\times 49 \\times 12 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{sisa}} = V_{\\text{kubus}} - V_{\\text{kerucut}} = \\ldots" },
    ],
  }),
  Qn(20, "Soal UN – Luas Permukaan", {
    content: "Sebuah kerucut memiliki r = 10,5 cm dan s = 17,5 cm. Hitunglah luas permukaan kerucut! (π = 22/7)",
    diagram: <ConeSVG r="10,5 cm" s="17,5 cm" />,
    parts: [
      { label: "a.", math: "L = \\pi r(r + s) = \\frac{22}{7} \\times 10{,}5 \\times (10{,}5 + 17{,}5) = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(21, "Volume – Soal Terbalik dari UN", {
    content: "Volume sebuah kerucut adalah 314 cm³ dan tingginya 6 cm. Berapakah jari-jari alasnya? (π = 3,14)",
    diagram: <ConeSVG r="?" h="6 cm" />,
    parts: [
      { label: "a.", math: "\\frac{1}{3} \\times 3{,}14 \\times r^2 \\times 6 = 314" },
      { label: "b.", math: "r^2 = \\frac{314}{3{,}14 \\times 2} = \\ldots \\Rightarrow r = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(22, "Soal Cerita – Permen Kerucut", {
    content: "Sebuah permen berbentuk kerucut memiliki diameter 4 cm dan tinggi 9 cm. Berapa cm³ coklat yang dibutuhkan untuk mengisi 10 permen? (π = 3,14)",
    diagram: <ConeSVG r="2 cm" h="9 cm" color="#f472b6" extraLabel="× 10 permen" />,
    parts: [
      { label: "a.", math: "V_1 = \\frac{1}{3} \\times 3{,}14 \\times 4 \\times 9 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{10} = 10 \\times V_1 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(23, "TKA – Perbandingan Luas Selimut", {
    content: "Dua kerucut mempunyai tinggi yang sama. Perbandingan jari-jarinya adalah 3 : 5. Berapakah perbandingan luas selimut keduanya?",
    parts: [
      { label: "a.", math: "\\frac{s_1}{s_2} = \\frac{\\sqrt{r_1^2 + t^2}}{\\sqrt{r_2^2 + t^2}}" },
      { label: "b.", text: "Misalkan t = 4, r₁ = 3, r₂ = 5. Hitung s₁ dan s₂." },
      { label: "c.", math: "\\frac{L_1}{L_2} = \\frac{\\pi r_1 s_1}{\\pi r_2 s_2} = \\ldots" },
    ],
  }),
  Qn(24, "Soal UN – Volume Kerucut dari Tabung", {
    content: "Volume kerucut sama dengan sepertiga volume tabung yang memiliki ukuran yang sama. Jika tabung memiliki r = 14 cm dan t = 9 cm, hitunglah volume kerucut! (π = 22/7)",
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = \\pi r^2 t = \\frac{22}{7} \\times 196 \\times 9 = \\ldots" },
      { label: "b.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times V_{\\text{tabung}} = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(25, "Mencari Diameter dari Luas Selimut", {
    content: "Luas selimut sebuah kerucut adalah 880 cm². Jika garis pelukisnya 20 cm, tentukan diameter alas kerucut! (π = 22/7)",
    diagram: <ConeSVG r="?" s="20 cm" />,
    parts: [
      { label: "a.", math: "\\pi r s = 880 \\Rightarrow \\frac{22}{7} \\times r \\times 20 = 880" },
      { label: "b.", math: "r = \\frac{880 \\times 7}{22 \\times 20} = \\ldots \\text{ cm}" },
      { label: "c.", math: "d = 2r = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(26, "Soal Cerita – Ember Kerucut", {
    content: "Sebuah ember berbentuk kerucut (bagian atas terbuka) dengan r = 21 cm dan s = 35 cm. Berapa liter air yang dapat ditampung jika t = 28 cm? (π = 22/7)",
    diagram: <ConeSVG r="21 cm" h="28 cm" s="35 cm" color="#38bdf8" extraLabel="Ember" />,
    parts: [
      { label: "a.", math: "V = \\frac{1}{3} \\times \\frac{22}{7} \\times 21^2 \\times 28 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V \\text{ (liter)} = \\frac{V}{1000} = \\ldots \\text{ liter}" },
    ],
  }),
  Qn(27, "ANBK – Soal Logam Kerucut", {
    content: "Sebuah kerucut dengan r = 5 cm dan s = 13 cm akan dibuat dari lembaran seng. Jika harga seng Rp1.500 per cm², berapa biaya membuat 5 kerucut tanpa alas? (π = 3,14)",
    diagram: <ConeSVG r="5 cm" s="13 cm" />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = 3{,}14 \\times 5 \\times 13 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "\\text{Biaya total} = 5 \\times L \\times 1500 = \\text{Rp}\\ldots" },
    ],
  }),
  Qn(28, "UN – Hubungan r, t, dan s", {
    content: "Sebuah kerucut memiliki garis pelukis 26 cm dan tinggi 24 cm. Tentukan: (a) jari-jari, (b) luas selimut, (c) volume kerucut! (π = 3,14)",
    diagram: <ConeSVG r="?" h="24 cm" s="26 cm" />,
    parts: [
      { label: "a.", math: "r = \\sqrt{s^2 - t^2} = \\sqrt{676 - 576} = \\sqrt{100} = \\ldots \\text{ cm}" },
      { label: "b.", math: "L_{\\text{selimut}} = 3{,}14 \\times r \\times 26 = \\ldots \\text{ cm}^2" },
      { label: "c.", math: "V = \\frac{1}{3} \\times 3{,}14 \\times r^2 \\times 24 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(29, "TKA – Volume Kerucut dari Luas Alas", {
    content: "Luas alas sebuah kerucut adalah 154 cm² dan tingginya 18 cm. Tentukan volumenya! (π = 22/7)",
    parts: [
      { label: "a.", text: "Volume kerucut = ⅓ × Luas alas × tinggi" },
      { label: "b.", math: "V = \\frac{1}{3} \\times 154 \\times 18 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(30, "Soal Cerita – Kerucut Pasir Jam", {
    content: "Pasir dalam jam pasir jatuh membentuk kerucut dengan jari-jari 3 cm. Setelah 5 menit, tinggi pasir 4 cm. Berapa cm³ pasir yang terkumpul? (π = 3,14)",
    diagram: <ConeSVG r="3 cm" h="4 cm" color="#fbbf24" extraLabel="Pasir" />,
    parts: [
      { label: "a.", math: "V = \\frac{1}{3} \\times 3{,}14 \\times 9 \\times 4 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(31, "UN – Gabungan Luas Alas dan Selimut", {
    content: "Sebuah kerucut memiliki r = 7 cm dan s = 25 cm. Berapa cm² luas seluruh permukaan kerucut? (π = 22/7)",
    diagram: <ConeSVG r="7 cm" s="25 cm" />,
    parts: [
      { label: "a.", math: "L_{\\text{alas}} = \\pi r^2 = \\frac{22}{7} \\times 49 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "L_{\\text{selimut}} = \\pi r s = \\frac{22}{7} \\times 7 \\times 25 = \\ldots \\text{ cm}^2" },
      { label: "c.", math: "L_{\\text{total}} = \\ldots + \\ldots = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(32, "Kerucut dan Tabung Sama Ukuran", {
    content: "Sebuah kerucut dan tabung memiliki jari-jari dan tinggi yang sama yaitu r = 6 cm dan t = 14 cm. Hitunglah perbandingan volume kerucut dan tabung! (π sama)",
    parts: [
      { label: "a.", math: "V_{\\text{kerucut}} = \\frac{1}{3}\\pi r^2 t = \\frac{1}{3}\\pi \\times 36 \\times 14" },
      { label: "b.", math: "V_{\\text{tabung}} = \\pi r^2 t = \\pi \\times 36 \\times 14" },
      { label: "c.", math: "\\frac{V_{\\text{kerucut}}}{V_{\\text{tabung}}} = \\ldots" },
    ],
  }),
  Qn(33, "ANBK – Kerucut Berlubang", {
    content: "Sebuah kerucut besar dengan r = 10 cm, t = 15 cm, memiliki lubang kerucut kecil di dalamnya dengan r = 5 cm, t = 15 cm. Berapa volume yang tersisa?",
    parts: [
      { label: "a.", math: "V_{\\text{besar}} = \\frac{1}{3}\\pi \\times 100 \\times 15 = 500\\pi \\text{ cm}^3" },
      { label: "b.", math: "V_{\\text{kecil}} = \\frac{1}{3}\\pi \\times 25 \\times 15 = 125\\pi \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{sisa}} = 500\\pi - 125\\pi = \\ldots\\pi \\approx \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(34, "Soal Terapan – Topi Ulang Tahun", {
    content: "Seorang anak membuat 10 topi ulang tahun berbentuk kerucut dari karton. Setiap topi: r = 7 cm, s = 25 cm. Berapa m² karton yang dibutuhkan? (π = 22/7)",
    diagram: <ConeSVG r="7 cm" s="25 cm" color="#f472b6" extraLabel="× 10 topi" />,
    parts: [
      { label: "a.", math: "L_1 = \\pi r s = \\frac{22}{7} \\times 7 \\times 25 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "L_{10} = 10 \\times L_1 = \\ldots \\text{ cm}^2 = \\ldots \\text{ m}^2" },
    ],
  }),
  Qn(35, "UN – Volume Kerucut dalam Liter", {
    content: "Sebuah wadah berbentuk kerucut dengan diameter 42 cm dan tinggi 60 cm. Berapa liter cairan yang dapat ditampung? (π = 22/7, 1 liter = 1.000 cm³)",
    diagram: <ConeSVG r="21 cm" h="60 cm" color="#38bdf8" extraLabel="Wadah" />,
    parts: [
      { label: "a.", math: "V = \\frac{1}{3} \\times \\frac{22}{7} \\times 21^2 \\times 60 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V \\text{ (liter)} = \\frac{V}{1000} = \\ldots \\text{ liter}" },
    ],
  }),
  Qn(36, "Luas Permukaan dari Garis Pelukis", {
    content: "Sebuah kerucut memiliki garis pelukis 17 cm dan jari-jari 8 cm. Hitunglah luas permukaan total kerucut! (π = 3,14)",
    diagram: <ConeSVG r="8 cm" s="17 cm" />,
    parts: [
      { label: "a.", math: "L = \\pi r(r + s) = 3{,}14 \\times 8 \\times (8 + 17) = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(37, "TKA – Kerucut Terpancung Konteks", {
    content: "Sebuah gelas berbentuk kerucut terpancung bagian atasnya memiliki r₁ = 5 cm (atas), r₂ = 3 cm (bawah), dan tinggi 8 cm. Volume total kerucut utuh (r = 5, t = hitung dulu)?",
    parts: [
      { label: "a.", text: "Gunakan konsep kesamaan segitiga untuk mencari tinggi kerucut penuh." },
      { label: "b.", math: "\\frac{r_2}{r_1} = \\frac{t_2}{t_1} \\Rightarrow \\frac{3}{5} = \\frac{t_2}{t_1}" },
      { label: "c.", text: "Hitung volume kerucut besar dikurang kerucut kecil." },
    ],
  }),
  Qn(38, "UN Terpadu – r, t, s, Luas, Volume", {
    content: "Kerucut memiliki r = 9 cm dan t = 12 cm. Hitunglah: (a) garis pelukis, (b) luas permukaan, (c) volume! (π = 3,14)",
    diagram: <ConeSVG r="9 cm" h="12 cm" />,
    parts: [
      { label: "a.", math: "s = \\sqrt{81 + 144} = \\sqrt{225} = \\ldots \\text{ cm}" },
      { label: "b.", math: "L = 3{,}14 \\times 9 \\times (9 + s) = \\ldots \\text{ cm}^2" },
      { label: "c.", math: "V = \\frac{1}{3} \\times 3{,}14 \\times 81 \\times 12 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(39, "ANBK – Soal Kontekstual", {
    content: "Sebuah pabrik minuman menggunakan tutup berbentuk kerucut untuk botol dengan r = 2 cm dan s = 5 cm. Jika membuat 1.000 tutup, berapa total luas seng (selimut saja) yang diperlukan? (π = 3,14)",
    diagram: <ConeSVG r="2 cm" s="5 cm" color="#6b7280" showHeight={false} />,
    parts: [
      { label: "a.", math: "L_1 = \\pi r s = 3{,}14 \\times 2 \\times 5 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "L_{1000} = 1000 \\times L_1 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(40, "UN Terpadu – Soal Cerita Lengkap", {
    content: "Sebuah gudang penyimpanan gandum memiliki atap berbentuk kerucut dengan r = 3,5 m dan tinggi 4,8 m. Bagian bawah gudang berbentuk tabung r = 3,5 m dan t = 6 m. Berapa m³ total volume gudang? (π = 22/7)",
    diagram: <ConeSVG r="3,5 m" h="4,8 m" color="#fbbf24" extraLabel="Atap Gudang" />,
    parts: [
      { label: "a.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times \\frac{22}{7} \\times (3{,}5)^2 \\times 4{,}8 = \\ldots \\text{ m}^3" },
      { label: "b.", math: "V_{\\text{tabung}} = \\frac{22}{7} \\times (3{,}5)^2 \\times 6 = \\ldots \\text{ m}^3" },
      { label: "c.", math: "V_{\\text{total}} = \\ldots + \\ldots = \\ldots \\text{ m}^3" },
    ],
  }),

  /* ── SOAL BARU 41–61 ── */
  Qn(41, "Unsur Kerucut – Sisi, Rusuk, Titik Sudut", {
    content: "Lengkapi tabel unsur-unsur bangun ruang kerucut berikut!",
    parts: [
      { label: "a.", text: "Jumlah sisi (permukaan) kerucut = … buah (alas lingkaran + selimut lengkung)" },
      { label: "b.", text: "Jumlah rusuk kerucut = … buah (hanya 1 rusuk berupa lingkaran alas)" },
      { label: "c.", text: "Jumlah titik sudut kerucut = … buah (hanya titik puncak)" },
      { label: "d.", text: "Bandingkan dengan tabung: sisi = 3, rusuk = 2, titik sudut = 0. Apa perbedaannya?" },
    ],
  }),
  Qn(42, "Bentuk Selimut Kerucut", {
    content: "Jika selimut kerucut dibuka/diratakan, akan membentuk bangun apa? Jelaskan unsur-unsurnya!",
    parts: [
      { label: "a.", text: "Selimut kerucut jika diratakan berbentuk … (juring lingkaran / sektor lingkaran)" },
      { label: "b.", text: "Jari-jari juring tersebut sama dengan … kerucut (garis pelukis / s)" },
      { label: "c.", math: "\\text{Panjang busur juring} = \\text{keliling lingkaran alas} = 2\\pi r" },
      { label: "d.", text: "Alas kerucut berbentuk lingkaran dengan jari-jari = … (r)" },
    ],
  }),
  Qn(43, "Hubungan r, t, dan s — Teorema Pythagoras", {
    content: "Perhatikan kerucut di bawah ini. Jelaskan hubungan antara jari-jari (r), tinggi (t), dan garis pelukis (s) menggunakan Teorema Pythagoras!",
    diagram: <ConeSVG r="r" h="t" s="s" />,
    parts: [
      { label: "a.", math: "s^2 = r^2 + t^2 \\Rightarrow s = \\sqrt{r^2 + t^2}" },
      { label: "b.", math: "r^2 = s^2 - t^2 \\Rightarrow r = \\sqrt{s^2 - t^2}" },
      { label: "c.", math: "t^2 = s^2 - r^2 \\Rightarrow t = \\sqrt{s^2 - r^2}" },
      { label: "d.", text: "Ketiga unsur r, t, s membentuk segitiga siku-siku dengan s sebagai sisi …" },
    ],
  }),
  Qn(44, "Mencari s dari r dan t – Angka Baru", {
    content: "Sebuah kerucut memiliki jari-jari alas 5 cm dan tinggi 12 cm. Tentukan panjang garis pelukisnya!",
    diagram: <ConeSVG r="5 cm" h="12 cm" />,
    parts: [
      { label: "a.", math: "s = \\sqrt{r^2 + t^2} = \\sqrt{5^2 + 12^2} = \\sqrt{\\ldots + \\ldots}" },
      { label: "b.", math: "s = \\sqrt{\\ldots} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(45, "Mencari r dari s dan t", {
    content: "Sebuah kerucut memiliki garis pelukis 17 cm dan tinggi 15 cm. Tentukan jari-jari alasnya!",
    diagram: <ConeSVG r="?" h="15 cm" s="17 cm" />,
    parts: [
      { label: "a.", math: "r = \\sqrt{s^2 - t^2} = \\sqrt{17^2 - 15^2} = \\sqrt{\\ldots - \\ldots}" },
      { label: "b.", math: "r = \\sqrt{\\ldots} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(46, "Mencari t dari s dan r", {
    content: "Sebuah kerucut memiliki garis pelukis 25 cm dan jari-jari 7 cm. Tentukan tinggi kerucut!",
    diagram: <ConeSVG r="7 cm" h="?" s="25 cm" />,
    parts: [
      { label: "a.", math: "t = \\sqrt{s^2 - r^2} = \\sqrt{25^2 - 7^2} = \\sqrt{\\ldots - \\ldots}" },
      { label: "b.", math: "t = \\sqrt{\\ldots} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(47, "Luas Selimut – Diketahui r dan t", {
    content: "Sebuah kerucut memiliki jari-jari 6 cm dan tinggi 8 cm. Hitunglah luas selimut kerucut! (π = 3,14)",
    diagram: <ConeSVG r="6 cm" h="8 cm" />,
    parts: [
      { label: "a.", math: "s = \\sqrt{6^2 + 8^2} = \\sqrt{100} = \\ldots \\text{ cm}" },
      { label: "b.", math: "L_{\\text{selimut}} = \\pi r s = 3{,}14 \\times 6 \\times s = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(48, "Luas Permukaan – r dan t Diketahui", {
    content: "Sebuah kerucut memiliki jari-jari 14 cm dan tinggi 48 cm. Hitunglah luas permukaan total kerucut! (π = 22/7)",
    diagram: <ConeSVG r="14 cm" h="48 cm" />,
    parts: [
      { label: "a.", math: "s = \\sqrt{14^2 + 48^2} = \\sqrt{196 + 2304} = \\sqrt{2500} = \\ldots \\text{ cm}" },
      { label: "b.", math: "L = \\pi r(r + s) = \\frac{22}{7} \\times 14 \\times (14 + 50) = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(49, "Mencari Tinggi dari Luas Selimut dan Jari-Jari", {
    content: "Luas selimut sebuah kerucut adalah 188,4 cm². Jika jari-jarinya 6 cm, tentukan tinggi kerucut tersebut! (π = 3,14)",
    diagram: <ConeSVG r="6 cm" s="?" h="?" />,
    parts: [
      { label: "a.", math: "\\pi r s = 188{,}4 \\Rightarrow 3{,}14 \\times 6 \\times s = 188{,}4" },
      { label: "b.", math: "s = \\frac{188{,}4}{18{,}84} = \\ldots \\text{ cm}" },
      { label: "c.", math: "t = \\sqrt{s^2 - r^2} = \\sqrt{\\ldots^2 - 6^2} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(50, "Mencari r dari Luas Permukaan Total", {
    content: "Luas permukaan total sebuah kerucut adalah 251,2 cm². Jika garis pelukisnya 10 cm, tentukan jari-jari alas kerucut! (π = 3,14)",
    parts: [
      { label: "a.", math: "L = \\pi r(r + s) \\Rightarrow 251{,}2 = 3{,}14 \\times r \\times (r + 10)" },
      { label: "b.", math: "r(r + 10) = \\frac{251{,}2}{3{,}14} = \\ldots" },
      { label: "c.", text: "Selesaikan persamaan kuadrat atau coba nilai r = … cm" },
    ],
  }),
  Qn(51, "Volume Kerucut – Angka Baru", {
    content: "Sebuah kerucut memiliki diameter 28 cm dan tinggi 36 cm. Hitunglah volume kerucut! (π = 22/7)",
    diagram: <ConeSVG r="14 cm" h="36 cm" />,
    parts: [
      { label: "a.", math: "r = \\frac{28}{2} = \\ldots \\text{ cm}" },
      { label: "b.", math: "V = \\frac{1}{3} \\times \\frac{22}{7} \\times 14^2 \\times 36 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(52, "Mencari r dari Volume dan Tinggi", {
    content: "Volume sebuah kerucut adalah 1.884 cm³ dan tingginya 15 cm. Tentukan jari-jari alasnya! (π = 3,14)",
    diagram: <ConeSVG r="?" h="15 cm" />,
    parts: [
      { label: "a.", math: "\\frac{1}{3} \\pi r^2 t = 1884 \\Rightarrow \\frac{1}{3} \\times 3{,}14 \\times r^2 \\times 15 = 1884" },
      { label: "b.", math: "r^2 = \\frac{1884}{\\frac{1}{3} \\times 3{,}14 \\times 15} = \\ldots" },
      { label: "c.", math: "r = \\sqrt{\\ldots} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(53, "Perbandingan Luas Selimut Dua Kerucut", {
    content: "Kerucut P memiliki r = 6 cm dan s = 10 cm. Kerucut Q memiliki r = 9 cm dan s = 15 cm. Tentukan perbandingan luas selimut P dan Q!",
    parts: [
      { label: "a.", math: "L_P = \\pi \\times 6 \\times 10 = 60\\pi \\text{ cm}^2" },
      { label: "b.", math: "L_Q = \\pi \\times 9 \\times 15 = 135\\pi \\text{ cm}^2" },
      { label: "c.", math: "L_P : L_Q = 60\\pi : 135\\pi = \\ldots : \\ldots" },
    ],
  }),
  Qn(54, "Juring → Kerucut: Mencari Jari-Jari Kerucut", {
    content: "Sebuah juring lingkaran memiliki jari-jari 15 cm dan sudut pusat 120°. Juring ini dilipat menjadi selimut kerucut. Tentukan jari-jari alas kerucut yang terbentuk!",
    parts: [
      { label: "a.", math: "\\text{Panjang busur} = \\frac{120}{360} \\times 2\\pi \\times 15 = \\frac{1}{3} \\times 30\\pi = 10\\pi \\text{ cm}" },
      { label: "b.", text: "Panjang busur = keliling alas kerucut = 2πr" },
      { label: "c.", math: "2\\pi r = 10\\pi \\Rightarrow r = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(55, "Juring → Kerucut: Mencari Tinggi Kerucut", {
    content: "Dari soal no. 54, setelah juring dibentuk menjadi kerucut (r = 5 cm, s = 15 cm), tentukan tinggi kerucut yang terbentuk!",
    parts: [
      { label: "a.", math: "t = \\sqrt{s^2 - r^2} = \\sqrt{15^2 - 5^2} = \\sqrt{225 - 25}" },
      { label: "b.", math: "t = \\sqrt{200} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(56, "Aplikasi – Kubah Masjid Berbentuk Kerucut", {
    content: "Atap sebuah menara masjid berbentuk kerucut dengan r = 3,5 m dan garis pelukis 6,5 m. Seluruh permukaan selimut akan dicat dengan biaya Rp 80.000 per m². Berapa total biaya pengecatan? (π = 22/7)",
    diagram: <ConeSVG r="3,5 m" s="6,5 m" color="#a78bfa" extraLabel="Kubah Masjid" />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = \\pi r s = \\frac{22}{7} \\times 3{,}5 \\times 6{,}5 = \\ldots \\text{ m}^2" },
      { label: "b.", math: "\\text{Biaya} = L \\times 80.000 = \\text{Rp}\\ldots" },
    ],
  }),
  Qn(57, "Aplikasi – Tangki Air Kerucut", {
    content: "Sebuah tangki air berbentuk kerucut terbalik (puncak di bawah) dengan r = 21 cm dan tinggi 40 cm. Air diisi hingga setengah tinggi tangki. Berapa cm³ volume air yang ada? (π = 22/7)",
    diagram: <ConeSVG r="21 cm" h="40 cm" color="#38bdf8" extraLabel="Tangki Terbalik" />,
    parts: [
      { label: "a.", text: "Jika air setengah tinggi, maka tinggi air = 20 cm dan r air ∝ tinggi (kesamaan segitiga)" },
      { label: "b.", math: "r_{\\text{air}} = \\frac{20}{40} \\times 21 = \\ldots \\text{ cm}" },
      { label: "c.", math: "V_{\\text{air}} = \\frac{1}{3} \\times \\frac{22}{7} \\times r_{\\text{air}}^2 \\times 20 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(58, "Aplikasi – Kap Lampu (Kerucut Terpancung)", {
    content: "Sebuah kap lampu berbentuk kerucut terpancung memiliki jari-jari atas 4 cm, jari-jari bawah 12 cm, dan tinggi 9 cm. Jika kap dibuat dari kerucut besar dikurangi kerucut kecil, hitung volume kerucut kecil yang dipotong! (π = 3,14)",
    parts: [
      { label: "a.", text: "Kesamaan segitiga: r₁/r₂ = t₁/t₂ → 4/12 = t₁/(t₁ + 9)" },
      { label: "b.", math: "4(t_1 + 9) = 12t_1 \\Rightarrow 4t_1 + 36 = 12t_1 \\Rightarrow t_1 = \\ldots \\text{ cm}" },
      { label: "c.", math: "V_{\\text{kecil}} = \\frac{1}{3} \\times 3{,}14 \\times 4^2 \\times t_1 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(59, "TKA – Perbandingan r:s Diketahui", {
    content: "Sebuah kerucut memiliki perbandingan jari-jari dan garis pelukis r : s = 3 : 5. Jika luas selimutnya 1.200π cm², tentukan jari-jari dan garis pelukis kerucut!",
    parts: [
      { label: "a.", text: "Misalkan r = 3k dan s = 5k untuk suatu bilangan k" },
      { label: "b.", math: "\\pi r s = 1200\\pi \\Rightarrow \\pi \\times 3k \\times 5k = 1200\\pi" },
      { label: "c.", math: "15k^2 = 1200 \\Rightarrow k^2 = \\ldots \\Rightarrow k = \\ldots" },
      { label: "d.", math: "r = 3k = \\ldots \\text{ cm}, \\quad s = 5k = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(60, "HOTS – Volume Kerucut dengan Perbandingan r:s = 7:25", {
    content: "Sebuah kerucut memiliki perbandingan r : s = 7 : 25. Jika luas selimut kerucut adalah 550 cm², tentukan: (a) r dan s, (b) tinggi kerucut, (c) volume kerucut! (π = 22/7)",
    parts: [
      { label: "a.", math: "r = 7k,\\ s = 25k \\Rightarrow \\frac{22}{7} \\times 7k \\times 25k = 550 \\Rightarrow 22 \\times 25k^2 = 550" },
      { label: "b.", math: "550k^2 = 550 \\Rightarrow k = 1 \\Rightarrow r = 7\\ \\text{cm},\\ s = 25\\ \\text{cm}" },
      { label: "c.", math: "t = \\sqrt{25^2 - 7^2} = \\sqrt{576} = \\ldots \\text{ cm}" },
      { label: "d.", math: "V = \\frac{1}{3} \\times \\frac{22}{7} \\times 49 \\times t = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(61, "UN Terpadu – Kerucut + Belahan Bola", {
    content: "Sebuah mainan berbentuk belahan bola di bawah dan kerucut di atas. Jari-jari keduanya sama = 7 cm dan tinggi kerucut = 24 cm. Hitunglah: (a) luas permukaan total mainan, (b) volume total mainan! (π = 22/7)",
    diagram: <ConeSVG r="7 cm" h="24 cm" color="#f472b6" extraLabel="Mainan Anak" />,
    parts: [
      { label: "a.", math: "s = \\sqrt{7^2 + 24^2} = \\sqrt{625} = 25\\ \\text{cm}" },
      { label: "b.", math: "L_{\\text{selimut kerucut}} = \\frac{22}{7} \\times 7 \\times 25 = \\ldots \\text{ cm}^2" },
      { label: "c.", math: "L_{\\text{belahan bola}} = 2\\pi r^2 = 2 \\times \\frac{22}{7} \\times 49 = \\ldots \\text{ cm}^2" },
      { label: "d.", math: "L_{\\text{total}} = L_{\\text{selimut}} + L_{\\text{belahan bola}} = \\ldots \\text{ cm}^2" },
      { label: "e.", math: "V_{\\text{kerucut}} = \\frac{1}{3} \\times \\frac{22}{7} \\times 49 \\times 24 = \\ldots \\text{ cm}^3" },
      { label: "f.", math: "V_{\\text{belahan bola}} = \\frac{2}{3} \\times \\frac{22}{7} \\times 343 = \\ldots \\text{ cm}^3" },
      { label: "g.", math: "V_{\\text{total}} = V_{\\text{kerucut}} + V_{\\text{belahan bola}} = \\ldots \\text{ cm}^3" },
    ],
  }),
];

const KerucutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <span className="text-3xl">🔺</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 24px rgba(251,146,60,0.7)' }}>
            KERUCUT
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bangun Ruang Sisi Lengkung · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 61 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-2">📌 Rumus Penting — Kerucut</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              { label: "Garis Pelukis", formula: "s = \\sqrt{r^2 + t^2}" },
              { label: "Luas Selimut", formula: "L_s = \\pi r s" },
              { label: "Luas Permukaan Total", formula: "L = \\pi r(r + s)" },
              { label: "Volume", formula: "V = \\tfrac{1}{3}\\pi r^2 t" },
            ].map(f => (
              <div key={f.label} className="bg-white/5 rounded-lg px-3 py-2 flex gap-3 items-center">
                <span className="text-orange-400 font-bold shrink-0 w-36">{f.label}</span>
                <span className="text-white/80"><InlineMath math={f.formula} /></span>
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
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.math && <div className="mb-3 text-white/90 text-sm"><BlockMath math={q.math} /></div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-orange-400 text-xs font-bold shrink-0 mt-0.5 w-5">{p.label}</span>}
                            <div className="flex-1 min-w-0">
                              {p.text && <span className="font-body text-sm text-white/80">{p.text}</span>}
                              {p.math && <span className="text-white/90 text-sm"><InlineMath math={p.math} /></span>}
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

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/bangun-ruang-sisi-lengkung"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Bangun Ruang Sisi Lengkung
          </button>
        </div>
      </div>
    </div>
  );
};

export default KerucutPage;
