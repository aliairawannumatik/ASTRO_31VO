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

function SphereSVG({ r, color = "#818cf8", extraLabel = "", half = false }: {
  r?: string; color?: string; extraLabel?: string; half?: boolean;
}) {
  return (
    <svg viewBox="0 0 220 200" width="220" height="200" className="mx-auto">
      <defs>
        <radialGradient id={`sphere-grad-${r}`} cx="38%" cy="35%" r="55%">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="60%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </radialGradient>
      </defs>
      {half ? (
        <>
          <path d="M 40 100 A 70 70 0 0 1 180 100 Z" fill={`url(#sphere-grad-${r})`} stroke={color} strokeWidth="2" />
          <ellipse cx="110" cy="100" rx="70" ry="22" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.8" />
          <text x="110" y="170" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">Setengah Bola</text>
        </>
      ) : (
        <circle cx="110" cy="100" r="72" fill={`url(#sphere-grad-${r})`} stroke={color} strokeWidth="2" />
      )}
      {!half && (
        <>
          <ellipse cx="110" cy="100" rx="72" ry="22" fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="6,4" />
          <ellipse cx="110" cy="100" rx="22" ry="72" fill="none" stroke={color} strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
        </>
      )}
      {r && (
        <>
          <line x1="110" y1="100" x2="170" y2="72" stroke={color} strokeWidth="1.5" />
          <circle cx="110" cy="100" r="3" fill={color} />
          <text x="155" y="65" fill={color} fontSize="13" textAnchor="middle" fontFamily="monospace">r = {r}</text>
        </>
      )}
      {extraLabel && (
        <text x="110" y="190" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">{extraLabel}</text>
      )}
    </svg>
  );
}

function HalfSphereSVG({ r, color = "#818cf8" }: { r?: string; color?: string }) {
  return (
    <svg viewBox="0 0 220 170" width="220" height="170" className="mx-auto">
      <defs>
        <radialGradient id={`hemi-grad-${r}`} cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.08" />
        </radialGradient>
      </defs>
      <path d="M 35 100 A 75 75 0 0 1 185 100 Z" fill={`url(#hemi-grad-${r})`} stroke={color} strokeWidth="2" />
      <ellipse cx="110" cy="100" rx="75" ry="22" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.8" />
      <line x1="110" y1="100" x2="155" y2="72" stroke={color} strokeWidth="1.5" />
      <circle cx="110" cy="100" r="3" fill={color} />
      {r && <text x="148" y="68" fill={color} fontSize="13" textAnchor="middle" fontFamily="monospace">r = {r}</text>}
      <text x="110" y="152" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">Setengah Bola</text>
    </svg>
  );
}

const questions: Q[] = [
  Qn(1, "Luas Permukaan Bola", {
    content: "Sebuah bola memiliki jari-jari 7 cm. Hitunglah luas permukaan bola tersebut! (π = 22/7)",
    diagram: <SphereSVG r="7 cm" />,
    parts: [
      { label: "a.", math: "L = 4\\pi r^2 = 4 \\times \\frac{22}{7} \\times 7^2 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(2, "Volume Bola", {
    content: "Sebuah bola memiliki jari-jari 6 cm. Hitunglah volume bola tersebut! (π = 3,14)",
    diagram: <SphereSVG r="6 cm" />,
    parts: [
      { label: "a.", math: "V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3} \\times 3{,}14 \\times 6^3 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(3, "Luas Permukaan – Diameter Diketahui", {
    content: "Sebuah bola berdiameter 14 cm. Hitunglah luas permukaannya! (π = 22/7)",
    diagram: <SphereSVG r="7 cm" color="#60a5fa" />,
    parts: [
      { label: "a.", math: "r = \\frac{d}{2} = \\frac{14}{2} = 7 \\text{ cm}" },
      { label: "b.", math: "L = 4 \\times \\frac{22}{7} \\times 7^2 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(4, "Volume Bola – Diameter Diketahui", {
    content: "Sebuah bola berdiameter 21 cm. Hitunglah volume bola tersebut! (π = 22/7)",
    diagram: <SphereSVG r="10,5 cm" />,
    parts: [
      { label: "a.", math: "r = 10{,}5 \\text{ cm}" },
      { label: "b.", math: "V = \\frac{4}{3} \\times \\frac{22}{7} \\times (10{,}5)^3 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(5, "Mencari Jari-Jari dari Luas Permukaan", {
    content: "Luas permukaan sebuah bola adalah 616 cm². Tentukan jari-jari bola tersebut! (π = 22/7)",
    diagram: <SphereSVG r="?" />,
    parts: [
      { label: "a.", math: "4\\pi r^2 = 616 \\Rightarrow r^2 = \\frac{616}{4 \\times \\frac{22}{7}} = \\ldots" },
      { label: "b.", math: "r = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(6, "Mencari Jari-Jari dari Volume", {
    content: "Volume sebuah bola adalah 4.186,67 cm³. Tentukan jari-jari bola tersebut! (π = 3,14)",
    diagram: <SphereSVG r="?" />,
    parts: [
      { label: "a.", math: "\\frac{4}{3} \\times 3{,}14 \\times r^3 = 4186{,}67" },
      { label: "b.", math: "r^3 = \\frac{4186{,}67 \\times 3}{4 \\times 3{,}14} \\approx 1000 \\Rightarrow r = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(7, "Luas Permukaan Setengah Bola Padat", {
    content: "Sebuah mangkuk berbentuk setengah bola padat dengan r = 7 cm. Hitunglah luas permukaan totalnya (selimut + alas)! (π = 22/7)",
    diagram: <HalfSphereSVG r="7 cm" />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut}} = 2\\pi r^2 = 2 \\times \\frac{22}{7} \\times 49 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "L_{\\text{alas}} = \\pi r^2 = \\frac{22}{7} \\times 49 = \\ldots \\text{ cm}^2" },
      { label: "c.", math: "L_{\\text{total}} = \\ldots + \\ldots = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(8, "Volume Setengah Bola", {
    content: "Sebuah mangkuk berbentuk setengah bola memiliki jari-jari 10 cm. Berapa volume mangkuk tersebut? (π = 3,14)",
    diagram: <HalfSphereSVG r="10 cm" />,
    parts: [
      { label: "a.", math: "V = \\frac{1}{2} \\times \\frac{4}{3}\\pi r^3 = \\frac{2}{3}\\pi r^3" },
      { label: "b.", math: "V = \\frac{2}{3} \\times 3{,}14 \\times 1000 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(9, "Soal Cerita – Bola Sepak", {
    content: "Sebuah bola sepak memiliki diameter 22 cm. Berapa cm² luas kulit bola tersebut? (π = 22/7)",
    diagram: <SphereSVG r="11 cm" color="#22c55e" extraLabel="Bola Sepak" />,
    parts: [
      { label: "a.", math: "r = 11 \\text{ cm}" },
      { label: "b.", math: "L = 4 \\times \\frac{22}{7} \\times 11^2 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(10, "Soal Cerita – Bola Plastik", {
    content: "Sebuah bola plastik berjari-jari 3,5 cm dijual dengan harga Rp500 per cm² bahan. Berapa harga satu bola? (π = 22/7)",
    diagram: <SphereSVG r="3,5 cm" color="#f472b6" extraLabel="Bola Plastik" />,
    parts: [
      { label: "a.", math: "L = 4 \\times \\frac{22}{7} \\times (3{,}5)^2 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "\\text{Harga} = L \\times 500 = \\text{Rp}\\ldots" },
    ],
  }),
  Qn(11, "UN Style – Bola dalam Kubus", {
    content: "Sebuah bola dimasukkan ke dalam kubus bersisi 14 cm dengan tepat (bola menyentuh semua sisi). Berapa volume sisa di dalam kubus? (π = 22/7)",
    diagram: <SphereSVG r="7 cm" />,
    parts: [
      { label: "a.", math: "V_{\\text{kubus}} = 14^3 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\text{bola}} = \\frac{4}{3} \\times \\frac{22}{7} \\times 7^3 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{sisa}} = \\ldots - \\ldots = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(12, "Luas Permukaan dari Volume", {
    content: "Volume sebuah bola adalah 288π cm³. Tentukan luas permukaan bola tersebut!",
    diagram: <SphereSVG r="?" />,
    parts: [
      { label: "a.", math: "\\frac{4}{3}\\pi r^3 = 288\\pi \\Rightarrow r^3 = 216 \\Rightarrow r = \\ldots \\text{ cm}" },
      { label: "b.", math: "L = 4\\pi r^2 = 4\\pi \\times \\ldots^2 = \\ldots\\pi \\text{ cm}^2" },
    ],
  }),
  Qn(13, "Soal Cerita – Balon Udara", {
    content: "Sebuah balon udara berbentuk bola berdiameter 10 m. Berapa m³ gas yang diisi ke dalam balon? (π = 3,14)",
    diagram: <SphereSVG r="5 m" color="#fbbf24" extraLabel="Balon Udara" />,
    parts: [
      { label: "a.", math: "V = \\frac{4}{3} \\times 3{,}14 \\times 5^3 = \\ldots \\text{ m}^3" },
    ],
  }),
  Qn(14, "Perbandingan Volume Dua Bola", {
    content: "Bola A berjari-jari 3 cm dan Bola B berjari-jari 6 cm. Hitunglah perbandingan volume A : B!",
    parts: [
      { label: "a.", math: "\\frac{V_A}{V_B} = \\frac{\\frac{4}{3}\\pi \\times 27}{\\frac{4}{3}\\pi \\times 216} = \\frac{27}{216} = \\ldots" },
    ],
  }),
  Qn(15, "Perbandingan Luas Permukaan Dua Bola", {
    content: "Dua bola memiliki jari-jari yang berbeda dengan perbandingan 2 : 5. Tentukan perbandingan luas permukaan keduanya!",
    parts: [
      { label: "a.", math: "\\frac{L_1}{L_2} = \\frac{4\\pi r_1^2}{4\\pi r_2^2} = \\left(\\frac{r_1}{r_2}\\right)^2 = \\left(\\frac{2}{5}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(16, "ANBK – Bola Besar vs Bola Kecil", {
    content: "Sebuah bola besar dengan r = 12 cm dipotong menjadi bola-bola kecil berjari-jari 3 cm. Berapa bola kecil yang dihasilkan?",
    parts: [
      { label: "a.", math: "V_{\\text{besar}} = \\frac{4}{3}\\pi \\times 12^3 = \\frac{4}{3}\\pi \\times 1728" },
      { label: "b.", math: "V_{\\text{kecil}} = \\frac{4}{3}\\pi \\times 3^3 = \\frac{4}{3}\\pi \\times 27" },
      { label: "c.", math: "n = \\frac{V_{\\text{besar}}}{V_{\\text{kecil}}} = \\frac{1728}{27} = \\ldots \\text{ bola}" },
    ],
  }),
  Qn(17, "Luas Permukaan Setengah Bola (Selimut Saja)", {
    content: "Sebuah bola bekel berjari-jari 3 cm dipotong menjadi dua. Hitunglah luas permukaan lengkungan (selimut) saja! (π = 3,14)",
    diagram: <HalfSphereSVG r="3 cm" />,
    parts: [
      { label: "a.", math: "L_{\\text{selimut setengah bola}} = 2\\pi r^2 = 2 \\times 3{,}14 \\times 9 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(18, "UN Style – Volume dan Luas", {
    content: "Sebuah bola memiliki luas permukaan 1.386 cm². Hitunglah: (a) jari-jari, (b) volume bola! (π = 22/7)",
    diagram: <SphereSVG r="?" />,
    parts: [
      { label: "a.", math: "4\\pi r^2 = 1386 \\Rightarrow r^2 = \\frac{1386}{4 \\times \\frac{22}{7}} = \\frac{1386 \\times 7}{88} = \\ldots \\Rightarrow r = \\ldots \\text{ cm}" },
      { label: "b.", math: "V = \\frac{4}{3} \\times \\frac{22}{7} \\times r^3 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(19, "Soal Cerita – Bola Logam", {
    content: "Sebuah bola logam berjari-jari 6 cm dimasukkan ke dalam ember berisi air. Berapa cm³ air yang tumpah? (π = 3,14)",
    diagram: <SphereSVG r="6 cm" color="#38bdf8" extraLabel="Bola Logam" />,
    parts: [
      { label: "a.", math: "V = \\frac{4}{3} \\times 3{,}14 \\times 6^3 = \\ldots \\text{ cm}^3" },
      { label: "b.", text: "Volume air yang tumpah = volume bola = ...cm³" },
    ],
  }),
  Qn(20, "TKA – Bola Terbuat dari Lempung", {
    content: "Seorang anak membuat bola dari lempung berjari-jari 5 cm. Berapa gram berat lempung jika massa jenis lempung 2 g/cm³? (π = 3,14)",
    diagram: <SphereSVG r="5 cm" color="#a78bfa" extraLabel="Bola Lempung" />,
    parts: [
      { label: "a.", math: "V = \\frac{4}{3} \\times 3{,}14 \\times 125 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "m = \\rho \\times V = 2 \\times \\ldots = \\ldots \\text{ gram}" },
    ],
  }),
  Qn(21, "ANBK – Bola dalam Tabung", {
    content: "Sebuah bola dengan r = 7 cm dimasukkan ke dalam tabung dengan r = 7 cm dan t = 14 cm. Berapa volume ruang kosong dalam tabung? (π = 22/7)",
    diagram: <SphereSVG r="7 cm" />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = \\frac{22}{7} \\times 49 \\times 14 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{\\text{bola}} = \\frac{4}{3} \\times \\frac{22}{7} \\times 343 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{sisa}} = \\ldots - \\ldots = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(22, "Soal UN – Keliling Lingkaran Besar", {
    content: "Sebuah bola berjari-jari 21 cm. Berapa keliling lingkaran terbesar (penampang melintang) pada bola tersebut? (π = 22/7)",
    diagram: <SphereSVG r="21 cm" />,
    parts: [
      { label: "a.", math: "K = 2\\pi r = 2 \\times \\frac{22}{7} \\times 21 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(23, "Soal Cerita – Planet Buatan", {
    content: "Sebuah model planet berbentuk bola dengan diameter 1,4 m dicat seluruhnya. Jika 1 kg cat dapat menutup 50 m², berapa kg cat yang dibutuhkan? (π = 22/7)",
    diagram: <SphereSVG r="0,7 m" color="#a78bfa" extraLabel="Model Planet" />,
    parts: [
      { label: "a.", math: "L = 4 \\times \\frac{22}{7} \\times (0{,}7)^2 = \\ldots \\text{ m}^2" },
      { label: "b.", math: "\\text{Cat} = \\frac{L}{50} = \\ldots \\text{ kg}" },
    ],
  }),
  Qn(24, "Volume – Soal Perbandingan", {
    content: "Perbandingan jari-jari dua bola adalah 3 : 4. Jika volume bola kecil 972π cm³, hitunglah volume bola besar!",
    parts: [
      { label: "a.", math: "\\frac{V_1}{V_2} = \\left(\\frac{r_1}{r_2}\\right)^3 = \\left(\\frac{3}{4}\\right)^3 = \\frac{27}{64}" },
      { label: "b.", math: "V_2 = \\frac{64}{27} \\times 972\\pi = \\ldots\\pi \\text{ cm}^3" },
    ],
  }),
  Qn(25, "Luas Permukaan – Soal Terapan", {
    content: "Sebuah bola pingpong berdiameter 4 cm akan dibungkus dengan kertas tipis. Jika harga kertas Rp100 per cm², berapa biaya untuk membungkus 6 bola? (π = 3,14)",
    diagram: <SphereSVG r="2 cm" color="#fbbf24" extraLabel="× 6 bola" />,
    parts: [
      { label: "a.", math: "L_1 = 4 \\times 3{,}14 \\times 2^2 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "\\text{Biaya} = 6 \\times L_1 \\times 100 = \\text{Rp}\\ldots" },
    ],
  }),
  Qn(26, "TKA – Bola dari Kawat Tipis", {
    content: "Bola dengan jari-jari 10 cm diukur kelilingnya (lingkaran terbesar). Berapa cm keliling tersebut? (π = 3,14)",
    diagram: <SphereSVG r="10 cm" />,
    parts: [
      { label: "a.", math: "K = 2\\pi r = 2 \\times 3{,}14 \\times 10 = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(27, "ANBK – Bola Dilebur", {
    content: "Tiga buah bola masing-masing berjari-jari 2 cm, 3 cm, dan 4 cm dilebur menjadi satu bola baru. Tentukan jari-jari bola baru tersebut!",
    parts: [
      { label: "a.", math: "V_1 + V_2 + V_3 = \\frac{4}{3}\\pi(8 + 27 + 64) = \\frac{4}{3}\\pi \\times 99" },
      { label: "b.", math: "\\frac{4}{3}\\pi R^3 = \\frac{4}{3}\\pi \\times 99 \\Rightarrow R^3 = 99 \\Rightarrow R \\approx \\ldots \\text{ cm}" },
    ],
  }),
  Qn(28, "Soal UN – Diameter dari Luas Permukaan", {
    content: "Luas permukaan sebuah bola adalah 2.464 cm². Tentukan diameter bola tersebut! (π = 22/7)",
    diagram: <SphereSVG r="?" />,
    parts: [
      { label: "a.", math: "4\\pi r^2 = 2464 \\Rightarrow r^2 = \\frac{2464 \\times 7}{4 \\times 22} = \\ldots \\Rightarrow r = \\ldots" },
      { label: "b.", math: "d = 2r = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(29, "Soal Cerita – Kolam Berbentuk Setengah Bola", {
    content: "Sebuah kolam mandi anak berbentuk setengah bola berjari-jari 70 cm. Berapa liter air yang dibutuhkan untuk mengisi hingga penuh? (π = 22/7, 1 liter = 1.000 cm³)",
    diagram: <HalfSphereSVG r="70 cm" />,
    parts: [
      { label: "a.", math: "V = \\frac{2}{3}\\pi r^3 = \\frac{2}{3} \\times \\frac{22}{7} \\times 70^3 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V \\text{ (liter)} = \\frac{V}{1000} = \\ldots \\text{ liter}" },
    ],
  }),
  Qn(30, "Volume Bola – Satuan dm", {
    content: "Sebuah tangki berbentuk bola berdiameter 1,4 m. Berapa dm³ (liter) kapasitas tangki tersebut? (π = 22/7, 1 m = 10 dm)",
    diagram: <SphereSVG r="0,7 m" color="#38bdf8" extraLabel="Tangki Bola" />,
    parts: [
      { label: "a.", math: "r = 0{,}7 \\text{ m} = 7 \\text{ dm}" },
      { label: "b.", math: "V = \\frac{4}{3} \\times \\frac{22}{7} \\times 343 = \\ldots \\text{ dm}^3 = \\ldots \\text{ liter}" },
    ],
  }),
  Qn(31, "Soal UN – Luas Lingkaran Besar Bola", {
    content: "Sebuah semangka berbentuk bola dengan r = 14 cm dipotong tepat di tengah. Berapa cm² luas penampangnya? (π = 22/7)",
    diagram: <SphereSVG r="14 cm" color="#22c55e" extraLabel="Semangka" />,
    parts: [
      { label: "a.", math: "L_{\\text{penampang}} = \\pi r^2 = \\frac{22}{7} \\times 14^2 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(32, "ANBK – Tiga Bola dalam Tabung", {
    content: "Tiga bola berjari-jari 7 cm disusun dalam tabung dengan r = 7 cm dan t = 42 cm. Berapa volume ruang kosong? (π = 22/7)",
    diagram: <SphereSVG r="7 cm" />,
    parts: [
      { label: "a.", math: "V_{\\text{tabung}} = \\frac{22}{7} \\times 49 \\times 42 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "V_{3\\text{ bola}} = 3 \\times \\frac{4}{3} \\times \\frac{22}{7} \\times 343 = \\ldots \\text{ cm}^3" },
      { label: "c.", math: "V_{\\text{sisa}} = \\ldots - \\ldots = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(33, "Soal Cerita – Produksi Bola Plastik", {
    content: "Sebuah pabrik memproduksi bola plastik berjari-jari 5 cm. Material plastik untuk seluruh permukaan satu bola memiliki berat 0,1 gram per cm². Berapa gram berat satu bola? (π = 3,14)",
    diagram: <SphereSVG r="5 cm" color="#a78bfa" extraLabel="Bola Plastik" />,
    parts: [
      { label: "a.", math: "L = 4 \\times 3{,}14 \\times 25 = \\ldots \\text{ cm}^2" },
      { label: "b.", math: "m = 0{,}1 \\times L = \\ldots \\text{ gram}" },
    ],
  }),
  Qn(34, "TKA – Volume dari Keliling", {
    content: "Keliling lingkaran besar sebuah bola adalah 44 cm. Tentukan volume bola tersebut! (π = 22/7)",
    diagram: <SphereSVG r="?" />,
    parts: [
      { label: "a.", math: "2\\pi r = 44 \\Rightarrow r = \\frac{44}{2 \\times \\frac{22}{7}} = \\ldots \\text{ cm}" },
      { label: "b.", math: "V = \\frac{4}{3} \\times \\frac{22}{7} \\times r^3 = \\ldots \\text{ cm}^3" },
    ],
  }),
  Qn(35, "Soal UN – Bola dan Rasio", {
    content: "Jika jari-jari bola diperbesar 3 kali, berapa kali volume bola menjadi lebih besar?",
    parts: [
      { label: "a.", math: "V_1 = \\frac{4}{3}\\pi r^3" },
      { label: "b.", math: "V_2 = \\frac{4}{3}\\pi (3r)^3 = \\frac{4}{3}\\pi \\times 27r^3 = 27 V_1" },
      { label: "c.", text: "Jadi volume menjadi ... kali lebih besar" },
    ],
  }),
  Qn(36, "ANBK – Luas Permukaan Diperbesar", {
    content: "Jika jari-jari bola diperbesar 2 kali, berapa kali luas permukaannya bertambah?",
    parts: [
      { label: "a.", math: "L_1 = 4\\pi r^2" },
      { label: "b.", math: "L_2 = 4\\pi (2r)^2 = 4\\pi \\times 4r^2 = 4L_1" },
      { label: "c.", text: "Luas permukaan menjadi ... kali semula" },
    ],
  }),
  Qn(37, "Soal Cerita – Bumi dan Bulan", {
    content: "Jari-jari Bumi ≈ 6.400 km dan jari-jari Bulan ≈ 1.600 km. Berapa kali volume Bumi dibanding volume Bulan?",
    parts: [
      { label: "a.", math: "\\frac{V_{\\text{Bumi}}}{V_{\\text{Bulan}}} = \\left(\\frac{r_{\\text{Bumi}}}{r_{\\text{Bulan}}}\\right)^3 = \\left(\\frac{6400}{1600}\\right)^3 = 4^3 = \\ldots" },
    ],
  }),
  Qn(38, "UN Terpadu – Bola dan Luas Permukaan", {
    content: "Sebuah bola memiliki volume 4.500π cm³. Hitunglah luas permukaan bola tersebut! (π sama)",
    diagram: <SphereSVG r="?" />,
    parts: [
      { label: "a.", math: "\\frac{4}{3}\\pi r^3 = 4500\\pi \\Rightarrow r^3 = 3375 \\Rightarrow r = \\ldots \\text{ cm}" },
      { label: "b.", math: "L = 4\\pi r^2 = 4\\pi \\times (\\ldots)^2 = \\ldots\\pi \\text{ cm}^2" },
    ],
  }),
  Qn(39, "Soal Terapan – Tangki Bahan Bakar", {
    content: "Sebuah tangki bahan bakar berbentuk bola berjari-jari 1,05 m. Berapa liter kapasitas tangki? (π = 22/7, 1 m³ = 1.000 liter)",
    diagram: <SphereSVG r="1,05 m" color="#fbbf24" extraLabel="Tangki BBM" />,
    parts: [
      { label: "a.", math: "V = \\frac{4}{3} \\times \\frac{22}{7} \\times (1{,}05)^3 = \\ldots \\text{ m}^3" },
      { label: "b.", math: "V \\text{ (liter)} = \\ldots \\times 1000 = \\ldots \\text{ liter}" },
    ],
  }),
  Qn(40, "UN Terpadu – Soal Lengkap Bola", {
    content: "Sebuah bola tenis meja memiliki keliling lingkaran besar 31,4 cm. Hitunglah: (a) jari-jari, (b) luas permukaan, (c) volume! (π = 3,14)",
    diagram: <SphereSVG r="?" />,
    parts: [
      { label: "a.", math: "2\\pi r = 31{,}4 \\Rightarrow r = \\frac{31{,}4}{2 \\times 3{,}14} = \\ldots \\text{ cm}" },
      { label: "b.", math: "L = 4 \\times 3{,}14 \\times r^2 = \\ldots \\text{ cm}^2" },
      { label: "c.", math: "V = \\frac{4}{3} \\times 3{,}14 \\times r^3 = \\ldots \\text{ cm}^3" },
    ],
  }),
];

const BolaPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-indigo-500/20 border-2 border-indigo-400/60 flex items-center justify-center mb-3">
            <span className="text-3xl">🔮</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-indigo-300 text-center mb-1"
            style={{ textShadow: '0 0 24px rgba(129,140,248,0.7)' }}>
            BOLA
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bangun Ruang Sisi Lengkung · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-4 py-2">
            <span className="text-indigo-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4">
          <p className="text-indigo-300 text-xs font-bold mb-2">📌 Rumus Penting — Bola</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              { label: "Luas Permukaan", formula: "L = 4\\pi r^2" },
              { label: "Volume", formula: "V = \\tfrac{4}{3}\\pi r^3" },
              { label: "Luas ½ Bola (selimut+alas)", formula: "L = 2\\pi r^2 + \\pi r^2 = 3\\pi r^2" },
              { label: "Volume ½ Bola", formula: "V = \\tfrac{2}{3}\\pi r^3" },
            ].map(f => (
              <div key={f.label} className="bg-white/5 rounded-lg px-3 py-2 flex gap-3 items-center">
                <span className="text-indigo-400 font-bold shrink-0 w-36">{f.label}</span>
                <span className="text-white/80"><InlineMath math={f.formula} /></span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900/80 to-violet-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-indigo-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-violet-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center shrink-0">
                    <span className="text-indigo-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.math && <div className="mb-3 text-white/90 text-sm"><BlockMath math={q.math} /></div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-indigo-400 text-xs font-bold shrink-0 mt-0.5 w-5">{p.label}</span>}
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

export default BolaPage;
