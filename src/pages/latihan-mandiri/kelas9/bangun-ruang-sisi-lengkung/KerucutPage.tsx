import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type OptionKey = "A" | "B" | "C" | "D";
type Option = { key: OptionKey; text: string };
type Q = {
  n: number;
  title: string;
  content: string;
  diagram?: React.ReactNode;
  options: Option[];
  answer: OptionKey;
};

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
        <text x="158" y="95" fill={color} fontSize="12" textAnchor="middle" fontFamily="monospace">s = {s}</text>
      )}
      {extraLabel && (
        <text x="110" y="192" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">{extraLabel}</text>
      )}
    </svg>
  );
}

function ConeNetSVG({ color = "#fb923c" }: { color?: string }) {
  return (
    <svg viewBox="0 -25 280 245" width="280" height="245" className="mx-auto">
      <path d="M 140 20 L 30 160 A 120 120 0 0 0 250 160 Z" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.8" />
      <text x="140" y="110" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">Selimut (sektor/juring)</text>
      <text x="140" y="128" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">jari-jari = s (garis pelukis)</text>
      <ellipse cx="140" cy="185" rx="45" ry="14" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.8" />
      <text x="140" y="189" fill={color} fontSize="10" textAnchor="middle" fontFamily="monospace">Alas (r)</text>
    </svg>
  );
}

const questions: Q[] = [
  {
    n: 1, title: "Garis Pelukis Kerucut",
    content: "Sebuah kerucut memiliki jari-jari alas 6 cm dan tinggi 8 cm. Panjang garis pelukis (s) kerucut tersebut adalah ...",
    diagram: <ConeSVG r="6 cm" h="8 cm" />,
    options: [
      { key: "A", text: "8 cm" },
      { key: "B", text: "9 cm" },
      { key: "C", text: "10 cm" },
      { key: "D", text: "14 cm" },
    ],
    answer: "C",
  },
  {
    n: 2, title: "Luas Selimut Kerucut",
    content: "Sebuah kerucut memiliki jari-jari 7 cm dan garis pelukis 25 cm. Luas selimut kerucut tersebut adalah ... (π = 22/7)",
    diagram: <ConeSVG r="7 cm" s="25 cm" />,
    options: [
      { key: "A", text: "440 cm²" },
      { key: "B", text: "550 cm²" },
      { key: "C", text: "616 cm²" },
      { key: "D", text: "770 cm²" },
    ],
    answer: "B",
  },
  {
    n: 3, title: "Luas Permukaan Total Kerucut",
    content: "Sebuah kerucut memiliki jari-jari 5 cm dan tinggi 12 cm. Luas permukaan total kerucut tersebut adalah ... (π = 3,14)",
    diagram: <ConeSVG r="5 cm" h="12 cm" />,
    options: [
      { key: "A", text: "251,2 cm²" },
      { key: "B", text: "282,6 cm²" },
      { key: "C", text: "314 cm²" },
      { key: "D", text: "376,8 cm²" },
    ],
    answer: "B",
  },
  {
    n: 4, title: "Volume Kerucut",
    content: "Sebuah kerucut memiliki jari-jari 7 cm dan tinggi 15 cm. Volume kerucut tersebut adalah ... (π = 22/7)",
    diagram: <ConeSVG r="7 cm" h="15 cm" />,
    options: [
      { key: "A", text: "462 cm³" },
      { key: "B", text: "616 cm³" },
      { key: "C", text: "770 cm³" },
      { key: "D", text: "1.155 cm³" },
    ],
    answer: "C",
  },
  {
    n: 5, title: "Volume Kerucut – Diameter Diketahui",
    content: "Sebuah kerucut berdiameter 21 cm dan tinggi 20 cm. Volume kerucut tersebut adalah ... (π = 22/7)",
    diagram: <ConeSVG r="10,5 cm" h="20 cm" />,
    options: [
      { key: "A", text: "2.310 cm³" },
      { key: "B", text: "3.465 cm³" },
      { key: "C", text: "4.620 cm³" },
      { key: "D", text: "6.930 cm³" },
    ],
    answer: "A",
  },
  {
    n: 6, title: "Mencari Tinggi dari Volume",
    content: "Volume sebuah kerucut adalah 1.232 cm³. Jika jari-jarinya 7 cm, tinggi kerucut tersebut adalah ... (π = 22/7)",
    diagram: <ConeSVG r="7 cm" h="?" />,
    options: [
      { key: "A", text: "12 cm" },
      { key: "B", text: "18 cm" },
      { key: "C", text: "20 cm" },
      { key: "D", text: "24 cm" },
    ],
    answer: "D",
  },
  {
    n: 7, title: "Mencari Jari-Jari dari Volume",
    content: "Volume sebuah kerucut adalah 2.512 cm³ dan tingginya 24 cm. Jari-jari alas kerucut tersebut adalah ... (π = 3,14)",
    diagram: <ConeSVG r="?" h="24 cm" />,
    options: [
      { key: "A", text: "7 cm" },
      { key: "B", text: "10 cm" },
      { key: "C", text: "12 cm" },
      { key: "D", text: "14 cm" },
    ],
    answer: "B",
  },
  {
    n: 8, title: "Mencari Garis Pelukis dari Luas Selimut",
    content: "Luas selimut sebuah kerucut adalah 550 cm². Jika jari-jarinya 7 cm, garis pelukis kerucut tersebut adalah ... (π = 22/7)",
    diagram: <ConeSVG r="7 cm" s="?" />,
    options: [
      { key: "A", text: "20 cm" },
      { key: "B", text: "22 cm" },
      { key: "C", text: "25 cm" },
      { key: "D", text: "28 cm" },
    ],
    answer: "C",
  },
  {
    n: 9, title: "Luas Selimut dari Jaring-Jaring",
    content: "Sebuah kerucut memiliki r = 7 cm dan garis pelukis s = 13 cm. Luas selimut kerucut tersebut adalah ... (π = 22/7)",
    diagram: <ConeNetSVG />,
    options: [
      { key: "A", text: "242 cm²" },
      { key: "B", text: "264 cm²" },
      { key: "C", text: "286 cm²" },
      { key: "D", text: "308 cm²" },
    ],
    answer: "C",
  },
  {
    n: 10, title: "Soal Cerita – Topi Kerucut",
    content: "Sebuah topi berbentuk kerucut dengan r = 14 cm dan garis pelukis 25 cm. Luas kain yang dibutuhkan untuk membuat satu topi adalah ... (π = 22/7)",
    diagram: <ConeSVG r="14 cm" s="25 cm" color="#f472b6" extraLabel="Topi" />,
    options: [
      { key: "A", text: "880 cm²" },
      { key: "B", text: "990 cm²" },
      { key: "C", text: "1.100 cm²" },
      { key: "D", text: "1.210 cm²" },
    ],
    answer: "C",
  },
  {
    n: 11, title: "Soal Cerita – Corong Kerucut",
    content: "Sebuah corong berbentuk kerucut tanpa alas memiliki r = 10 cm dan s = 26 cm. Luas selimut corong tersebut adalah ... (π = 3,14)",
    diagram: <ConeSVG r="10 cm" s="26 cm" showHeight={false} />,
    options: [
      { key: "A", text: "753,6 cm²" },
      { key: "B", text: "816,4 cm²" },
      { key: "C", text: "879,2 cm²" },
      { key: "D", text: "942 cm²" },
    ],
    answer: "B",
  },
  {
    n: 12, title: "Volume Kerucut – Cornet Es Krim",
    content: "Sebuah cornet es krim berbentuk kerucut dengan r = 3,5 cm dan t = 12 cm. Volume es krim yang dapat dimuat adalah ... (π = 22/7)",
    diagram: <ConeSVG r="3,5 cm" h="12 cm" color="#f472b6" extraLabel="Es Krim" />,
    options: [
      { key: "A", text: "77 cm³" },
      { key: "B", text: "154 cm³" },
      { key: "C", text: "231 cm³" },
      { key: "D", text: "308 cm³" },
    ],
    answer: "B",
  },
  {
    n: 16, title: "Perbandingan Volume Dua Kerucut",
    content: "Kerucut A memiliki r = 6 cm dan t = 4 cm. Kerucut B memiliki r = 3 cm dan t = 8 cm. Perbandingan volume A : B adalah ...",
    options: [
      { key: "A", text: "1 : 1" },
      { key: "B", text: "3 : 2" },
      { key: "C", text: "2 : 1" },
      { key: "D", text: "4 : 1" },
    ],
    answer: "C",
  },
  {
    n: 18, title: "Biaya Pengecatan Selimut Kerucut",
    content: "Sebuah kerucut dengan r = 7 cm dan s = 20 cm akan dicat. Jika biaya pengecatan Rp2.000 per cm², total biaya pengecatan adalah ... (π = 22/7)",
    diagram: <ConeSVG r="7 cm" s="20 cm" color="#a78bfa" />,
    options: [
      { key: "A", text: "Rp 660.000" },
      { key: "B", text: "Rp 770.000" },
      { key: "C", text: "Rp 880.000" },
      { key: "D", text: "Rp 1.100.000" },
    ],
    answer: "C",
  },
  {
    n: 19, title: "ANBK – Kerucut dalam Kubus",
    content: "Sebuah kerucut dengan r = 7 cm dan t = 12 cm dimasukkan ke dalam kubus bersisi 14 cm. Volume ruang yang tersisa di dalam kubus adalah ... (π = 22/7)",
    diagram: <ConeSVG r="7 cm" h="12 cm" />,
    options: [
      { key: "A", text: "1.848 cm³" },
      { key: "B", text: "2.128 cm³" },
      { key: "C", text: "2.744 cm³" },
      { key: "D", text: "3.360 cm³" },
    ],
    answer: "B",
  },
  {
    n: 23, title: "TKA – Perbandingan Luas Selimut",
    content: "Dua kerucut mempunyai garis pelukis yang sama. Perbandingan jari-jari kerucut pertama dan kedua adalah 3 : 5. Perbandingan luas selimut kedua kerucut adalah ...",
    options: [
      { key: "A", text: "9 : 25" },
      { key: "B", text: "3 : 5" },
      { key: "C", text: "1 : 2" },
      { key: "D", text: "3 : 10" },
    ],
    answer: "B",
  },
  {
    n: 24, title: "Volume Kerucut dari Tabung",
    content: "Volume kerucut sama dengan sepertiga volume tabung dengan ukuran yang sama. Jika tabung memiliki r = 14 cm dan t = 9 cm, volume kerucut tersebut adalah ... (π = 22/7)",
    options: [
      { key: "A", text: "1.386 cm³" },
      { key: "B", text: "1.848 cm³" },
      { key: "C", text: "2.772 cm³" },
      { key: "D", text: "5.544 cm³" },
    ],
    answer: "B",
  },
  {
    n: 27, title: "ANBK – Biaya Membuat Kerucut",
    content: "Sebuah kerucut dengan r = 5 cm dan s = 13 cm akan dibuat dari lembaran seng. Jika harga seng Rp1.500 per cm², biaya membuat 5 kerucut tanpa alas adalah ... (π = 3,14)",
    diagram: <ConeSVG r="5 cm" s="13 cm" />,
    options: [
      { key: "A", text: "Rp 1.020.500" },
      { key: "B", text: "Rp 1.530.750" },
      { key: "C", text: "Rp 2.041.000" },
      { key: "D", text: "Rp 3.061.500" },
    ],
    answer: "B",
  },
  {
    n: 29, title: "TKA – Volume dari Luas Alas",
    content: "Luas alas sebuah kerucut adalah 154 cm² dan tingginya 18 cm. Volume kerucut tersebut adalah ...",
    options: [
      { key: "A", text: "616 cm³" },
      { key: "B", text: "924 cm³" },
      { key: "C", text: "1.386 cm³" },
      { key: "D", text: "2.772 cm³" },
    ],
    answer: "B",
  },
  {
    n: 32, title: "Perbandingan Volume Kerucut dan Tabung",
    content: "Sebuah kerucut dan tabung memiliki jari-jari dan tinggi yang sama. Perbandingan volume kerucut terhadap volume tabung adalah ...",
    options: [
      { key: "A", text: "1 : 2" },
      { key: "B", text: "1 : 3" },
      { key: "C", text: "2 : 3" },
      { key: "D", text: "3 : 1" },
    ],
    answer: "B",
  },
  {
    n: 34, title: "Soal Terapan – Karton Topi Ulang Tahun",
    content: "Seorang anak membuat 10 topi ulang tahun berbentuk kerucut dari karton, setiap topi r = 7 cm dan s = 25 cm. Total karton yang dibutuhkan dalam m² adalah ... (π = 22/7)",
    diagram: <ConeSVG r="7 cm" s="25 cm" color="#f472b6" extraLabel="× 10 topi" />,
    options: [
      { key: "A", text: "0,35 m²" },
      { key: "B", text: "0,55 m²" },
      { key: "C", text: "0,75 m²" },
      { key: "D", text: "1,10 m²" },
    ],
    answer: "B",
  },
  {
    n: 50, title: "Mencari Jari-Jari dari Luas Permukaan",
    content: "Luas permukaan total sebuah kerucut adalah 282,6 cm². Jika garis pelukisnya 13 cm, jari-jari alas kerucut tersebut adalah ... (π = 3,14)",
    options: [
      { key: "A", text: "3 cm" },
      { key: "B", text: "5 cm" },
      { key: "C", text: "7 cm" },
      { key: "D", text: "9 cm" },
    ],
    answer: "B",
  },
  {
    n: 53, title: "Perbandingan Luas Selimut Dua Kerucut",
    content: "Kerucut P memiliki r = 6 cm dan s = 10 cm. Kerucut Q memiliki r = 9 cm dan s = 15 cm. Perbandingan luas selimut P : Q adalah ...",
    options: [
      { key: "A", text: "2 : 3" },
      { key: "B", text: "4 : 9" },
      { key: "C", text: "1 : 2" },
      { key: "D", text: "6 : 15" },
    ],
    answer: "B",
  },
  {
    n: 54, title: "Juring → Kerucut: Jari-Jari Alas",
    content: "Sebuah juring lingkaran berjari-jari 15 cm dengan sudut pusat 120° dilipat menjadi selimut kerucut. Jari-jari alas kerucut yang terbentuk adalah ...",
    options: [
      { key: "A", text: "3 cm" },
      { key: "B", text: "4 cm" },
      { key: "C", text: "5 cm" },
      { key: "D", text: "6 cm" },
    ],
    answer: "C",
  },
  {
    n: 56, title: "Aplikasi – Kubah Masjid",
    content: "Atap menara masjid berbentuk kerucut dengan r = 3,5 m dan s = 6,5 m. Seluruh selimut dicat dengan biaya Rp80.000 per m². Total biaya pengecatan adalah ... (π = 22/7)",
    diagram: <ConeSVG r="3,5 m" s="6,5 m" color="#a78bfa" extraLabel="Kubah Masjid" />,
    options: [
      { key: "A", text: "Rp 4.800.000" },
      { key: "B", text: "Rp 5.200.000" },
      { key: "C", text: "Rp 5.720.000" },
      { key: "D", text: "Rp 6.160.000" },
    ],
    answer: "C",
  },
  {
    n: 58, title: "Aplikasi – Kap Lampu (Kerucut Terpancung)",
    content: "Kap lampu berbentuk kerucut terpancung dengan r₁ = 4 cm (atas), r₂ = 12 cm (bawah), tinggi 9 cm. Volume kerucut kecil yang dipotong adalah ... (π = 3,14)",
    options: [
      { key: "A", text: "50,24 cm³" },
      { key: "B", text: "75,36 cm³" },
      { key: "C", text: "100,48 cm³" },
      { key: "D", text: "150,72 cm³" },
    ],
    answer: "B",
  },
  {
    n: 59, title: "TKA – Perbandingan r : s = 3 : 5",
    content: "Sebuah kerucut memiliki perbandingan r : s = 3 : 5. Jika luas selimutnya 135π cm², nilai r dan s adalah ...",
    options: [
      { key: "A", text: "r = 6 cm, s = 10 cm" },
      { key: "B", text: "r = 9 cm, s = 15 cm" },
      { key: "C", text: "r = 12 cm, s = 20 cm" },
      { key: "D", text: "r = 3 cm, s = 5 cm" },
    ],
    answer: "B",
  },
  {
    n: 60, title: "HOTS – r : s = 7 : 25, Volume",
    content: "Sebuah kerucut memiliki perbandingan r : s = 7 : 25. Jika luas selimutnya 550 cm², volume kerucut tersebut adalah ... (π = 22/7)",
    options: [
      { key: "A", text: "616 cm³" },
      { key: "B", text: "924 cm³" },
      { key: "C", text: "1.232 cm³" },
      { key: "D", text: "1.848 cm³" },
    ],
    answer: "C",
  },
];

const optionStyle = (key: OptionKey, selected: OptionKey | undefined, answer: OptionKey, revealed: boolean) => {
  if (!revealed) {
    return selected === key
      ? "bg-orange-500/30 border-orange-400 text-white"
      : "bg-white/5 border-white/10 text-white/80 hover:border-orange-400/50 hover:bg-orange-500/10";
  }
  if (key === answer) return "bg-emerald-500/25 border-emerald-400 text-emerald-200";
  if (selected === key && key !== answer) return "bg-rose-500/25 border-rose-400 text-rose-200 line-through";
  return "bg-white/3 border-white/8 text-white/40";
};

const KerucutPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Record<number, OptionKey>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleSelect = (n: number, key: OptionKey) => {
    if (revealed[n]) return;
    playPopSound();
    setSelected(prev => ({ ...prev, [n]: key }));
  };

  const handleReveal = (n: number) => {
    playPopSound();
    setRevealed(prev => ({ ...prev, [n]: true }));
  };

  const score = questions.filter(q => revealed[q.n] && selected[q.n] === q.answer).length;
  const done = questions.filter(q => revealed[q.n]).length;

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
          <div className="mt-3 flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
              <span className="text-orange-400 text-xs font-bold">📋 28 Soal Pilihan Ganda</span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
            </div>
            {done > 0 && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
                <span className="text-emerald-400 text-xs font-bold">✅ {score}/{done} benar</span>
              </div>
            )}
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
          {questions.map((q, i) => {
            const isRevealed = !!revealed[q.n];
            const sel = selected[q.n];
            const isCorrect = isRevealed && sel === q.answer;
            const isWrong = isRevealed && sel && sel !== q.answer;
            return (
              <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 0.015}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-amber-900/30 backdrop-blur" />
                <div className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${isCorrect ? "border border-emerald-500/40" : isWrong ? "border border-rose-500/40" : "border border-orange-500/20"}`} />
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500 rounded-l-2xl" />
                <div className="relative px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isCorrect ? "bg-emerald-500/20 border-emerald-400/50" : isWrong ? "bg-rose-500/20 border-rose-400/50" : "bg-orange-500/20 border-orange-400/50"}`}>
                      <span className={`text-xs font-bold ${isCorrect ? "text-emerald-300" : isWrong ? "text-rose-300" : "text-orange-300"}`}>{q.n}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">
                        {q.title}
                      </span>
                      <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>
                      {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}

                      <div className="grid grid-cols-1 gap-2 mb-3">
                        {q.options.map(opt => (
                          <button key={opt.key}
                            onClick={() => handleSelect(q.n, opt.key)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left text-sm font-body transition-all cursor-pointer ${optionStyle(opt.key, sel, q.answer, isRevealed)}`}>
                            <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                              isRevealed && opt.key === q.answer ? "border-emerald-400 text-emerald-300 bg-emerald-500/20"
                              : isRevealed && sel === opt.key && opt.key !== q.answer ? "border-rose-400 text-rose-300 bg-rose-500/20"
                              : sel === opt.key ? "border-orange-400 text-orange-300 bg-orange-500/20"
                              : "border-white/20 text-white/50"
                            }`}>{opt.key}</span>
                            <span>{opt.text}</span>
                            {isRevealed && opt.key === q.answer && <span className="ml-auto text-emerald-400 text-xs font-bold">✓</span>}
                            {isRevealed && sel === opt.key && opt.key !== q.answer && <span className="ml-auto text-rose-400 text-xs font-bold">✗</span>}
                          </button>
                        ))}
                      </div>

                      {!isRevealed ? (
                        <button onClick={() => handleReveal(q.n)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 hover:bg-orange-500/25 transition-all cursor-pointer font-body">
                          Lihat Jawaban
                        </button>
                      ) : (
                        <div className={`text-xs px-3 py-1.5 rounded-lg font-body inline-block ${isCorrect ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300" : "bg-rose-500/15 border border-rose-500/30 text-rose-300"}`}>
                          {isCorrect ? "✅ Jawaban kamu benar!" : `❌ Jawaban benar: ${q.answer}`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate(-1); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default KerucutPage;
