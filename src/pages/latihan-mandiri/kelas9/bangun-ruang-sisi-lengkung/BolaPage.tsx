import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type OptionKey = "A" | "B" | "C" | "D";
type Cat = "unsur" | "lp" | "vol" | "app";
type QMC = {
  n: number; title: string; cat: Cat;
  content: string;
  diagram?: React.ReactNode;
  options: { key: OptionKey; text: string }[];
  answer: OptionKey;
};

const CAT_LABELS: Record<Cat, { icon: string; label: string; color: string }> = {
  unsur: { icon: "🔵", label: "Unsur Bola",           color: "text-sky-400 border-sky-500/30 bg-sky-500/10" },
  lp:    { icon: "📐", label: "Luas Permukaan",        color: "text-violet-400 border-violet-500/30 bg-violet-500/10" },
  vol:   { icon: "📦", label: "Volume",                color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
  app:   { icon: "🌍", label: "Aplikasi di Kehidupan", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
};

function SphereSVG({ r, color = "#818cf8", extraLabel = "" }: {
  r?: string; color?: string; extraLabel?: string;
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
      <circle cx="110" cy="100" r="72" fill={`url(#sphere-grad-${r})`} stroke={color} strokeWidth="2" />
      <ellipse cx="110" cy="100" rx="72" ry="22" fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="6,4" />
      <ellipse cx="110" cy="100" rx="22" ry="72" fill="none" stroke={color} strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
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

function BolaDalamTabungSVG({ color = "#818cf8" }: { color?: string }) {
  return (
    <svg viewBox="0 0 260 230" width="260" height="230" className="mx-auto">
      <defs>
        <radialGradient id="bdt-sphere" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0.10" />
        </radialGradient>
      </defs>
      <rect x="60" y="25" width="140" height="160" fill={color} fillOpacity="0.04" stroke={color} strokeWidth="1.5" />
      <ellipse cx="130" cy="25" rx="70" ry="18" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.5" />
      <ellipse cx="130" cy="185" rx="70" ry="18" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.5" />
      <circle cx="130" cy="105" r="70" fill="url(#bdt-sphere)" stroke={color} strokeWidth="2" />
      <ellipse cx="130" cy="105" rx="70" ry="20" fill="none" stroke={color} strokeWidth="1" strokeDasharray="5,3" />
      <line x1="130" y1="105" x2="200" y2="105" stroke={color} strokeWidth="1.2" strokeDasharray="4,2" />
      <circle cx="130" cy="105" r="3" fill={color} />
      <text x="168" y="98" fill={color} fontSize="11" textAnchor="middle" fontFamily="monospace">r</text>
      <text x="130" y="215" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">Bola menyinggung semua sisi tabung</text>
    </svg>
  );
}

function TabungSetengahBolaSVG({ color = "#818cf8" }: { color?: string }) {
  return (
    <svg viewBox="0 0 260 250" width="260" height="250" className="mx-auto">
      <defs>
        <radialGradient id="tsb-sphere" cx="35%" cy="25%" r="65%">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0.08" />
        </radialGradient>
      </defs>
      <rect x="60" y="130" width="140" height="90" fill={color} fillOpacity="0.05" stroke={color} strokeWidth="1.5" />
      <ellipse cx="130" cy="220" rx="70" ry="18" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.5" />
      <ellipse cx="130" cy="130" rx="70" ry="18" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.2" strokeDasharray="5,3" />
      <path d="M 60 130 A 70 70 0 0 1 200 130 Z" fill="url(#tsb-sphere)" stroke={color} strokeWidth="2" />
      <line x1="130" y1="130" x2="200" y2="130" stroke={color} strokeWidth="1.2" strokeDasharray="4,2" />
      <circle cx="130" cy="130" r="3" fill={color} />
      <text x="212" y="134" fill={color} fontSize="11" textAnchor="start" fontFamily="monospace">r = 7</text>
      <line x1="205" y1="135" x2="205" y2="218" stroke={color} strokeWidth="1" strokeDasharray="3,2" />
      <text x="212" y="182" fill={color} fontSize="11" textAnchor="start" fontFamily="monospace">t = 10</text>
      <text x="130" y="243" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fillOpacity="0.7">Tabung + Setengah Bola</text>
    </svg>
  );
}

function PerbandinganBangunSVG({ color = "#818cf8" }: { color?: string }) {
  return (
    <svg viewBox="0 0 340 210" width="340" height="210" className="mx-auto">
      <defs>
        <radialGradient id="pbg-sphere" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0.08" />
        </radialGradient>
        <linearGradient id="pbg-cone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect x="8" y="38" width="82" height="120" fill={color} fillOpacity="0.05" stroke={color} strokeWidth="1.4" />
      <ellipse cx="49" cy="38" rx="41" ry="12" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.4" />
      <ellipse cx="49" cy="158" rx="41" ry="12" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.4" />
      <text x="49" y="180" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace">Tabung</text>
      <text x="49" y="191" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fillOpacity="0.6">V = 3</text>
      <circle cx="170" cy="98" r="60" fill="url(#pbg-sphere)" stroke={color} strokeWidth="2" />
      <ellipse cx="170" cy="98" rx="60" ry="17" fill="none" stroke={color} strokeWidth="1" strokeDasharray="4,3" />
      <text x="170" y="180" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace">Bola</text>
      <text x="170" y="191" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fillOpacity="0.6">V = 2</text>
      <ellipse cx="290" cy="158" rx="41" ry="12" fill={color} fillOpacity="0.10" stroke={color} strokeWidth="1.4" />
      <line x1="249" y1="158" x2="290" y2="38" stroke={color} strokeWidth="1.5" />
      <line x1="331" y1="158" x2="290" y2="38" stroke={color} strokeWidth="1.5" />
      <polygon points="249,158 331,158 290,38" fill="url(#pbg-cone)" />
      <text x="290" y="180" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace">Kerucut</text>
      <text x="290" y="191" fill={color} fontSize="9" textAnchor="middle" fontFamily="monospace" fillOpacity="0.6">V = 1</text>
    </svg>
  );
}

const mcQuestions: QMC[] = [
  /* ── UNSUR ── */
  {
    n: 1, title: "Titik Sudut Bola", cat: "unsur",
    content: "Banyaknya titik sudut yang dimiliki oleh bangun bola adalah ...",
    options: [
      { key: "A", text: "tidak ada" },
      { key: "B", text: "1 buah" },
      { key: "C", text: "2 buah" },
      { key: "D", text: "banyak sekali" },
    ],
    answer: "A",
  },
  /* ── LUAS PERMUKAAN ── */
  {
    n: 2, title: "Rumus Luas Permukaan Bola", cat: "lp",
    content: "Rumus yang tepat untuk menghitung luas permukaan bola berjari-jari r adalah ...",
    options: [
      { key: "A", text: "L = 2πr²" },
      { key: "B", text: "L = 3πr²" },
      { key: "C", text: "L = 4πr²" },
      { key: "D", text: "L = ⁴⁄₃πr³" },
    ],
    answer: "C",
  },
  {
    n: 3, title: "Luas Permukaan Bola – r = 14 cm", cat: "lp",
    content: "Sebuah bola memiliki jari-jari 14 cm. Luas permukaan bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="14 cm" />,
    options: [
      { key: "A", text: "1.848 cm²" },
      { key: "B", text: "2.156 cm²" },
      { key: "C", text: "2.464 cm²" },
      { key: "D", text: "3.080 cm²" },
    ],
    answer: "C",
  },
  {
    n: 4, title: "Mencari Jari-Jari dari Luas Permukaan", cat: "lp",
    content: "Luas permukaan sebuah bola adalah 154 cm². Panjang jari-jari bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="?" />,
    options: [
      { key: "A", text: "3 cm" },
      { key: "B", text: "3,5 cm" },
      { key: "C", text: "5 cm" },
      { key: "D", text: "7 cm" },
    ],
    answer: "B",
  },
  {
    n: 5, title: "Perbandingan Luas Permukaan Dua Bola", cat: "lp",
    content: "Dua buah bola memiliki jari-jari masing-masing 5 cm dan 10 cm. Perbandingan luas permukaan bola pertama terhadap bola kedua adalah ...",
    options: [
      { key: "A", text: "1 : 4" },
      { key: "B", text: "1 : 2" },
      { key: "C", text: "4 : 1" },
      { key: "D", text: "2 : 1" },
    ],
    answer: "A",
  },
  {
    n: 6, title: "Perbandingan Luas Permukaan dan Volume", cat: "lp",
    content: "Sebuah bola berjari-jari r cm. Perbandingan antara luas permukaan bola dengan volumenya adalah ...",
    options: [
      { key: "A", text: "3 : r" },
      { key: "B", text: "r : 3" },
      { key: "C", text: "r : 4" },
      { key: "D", text: "4 : r" },
    ],
    answer: "A",
  },
  {
    n: 7, title: "Perbandingan Luas Permukaan – Diameter Berbeda", cat: "lp",
    content: "Dua buah bola memiliki diameter masing-masing 6 cm dan 8 cm. Perbandingan luas permukaan kedua bola adalah ...",
    options: [
      { key: "A", text: "3 : 4" },
      { key: "B", text: "4 : 9" },
      { key: "C", text: "9 : 16" },
      { key: "D", text: "16 : 27" },
    ],
    answer: "C",
  },
  {
    n: 8, title: "Luas Permukaan dari Volume Bola", cat: "lp",
    content: "Volume sebuah bola adalah 36π cm³. Luas permukaan bola tersebut adalah ...",
    options: [
      { key: "A", text: "18π cm²" },
      { key: "B", text: "27π cm²" },
      { key: "C", text: "36π cm²" },
      { key: "D", text: "54π cm²" },
    ],
    answer: "C",
  },
  {
    n: 9, title: "Luas Permukaan dari Volume (Besar)", cat: "lp",
    content: "Volume sebuah bola adalah 972π cm³. Luas permukaan bola tersebut adalah ...",
    options: [
      { key: "A", text: "81π cm²" },
      { key: "B", text: "108π cm²" },
      { key: "C", text: "162π cm²" },
      { key: "D", text: "324π cm²" },
    ],
    answer: "D",
  },
  /* ── VOLUME ── */
  {
    n: 10, title: "Volume Bola – Diameter 21 cm", cat: "vol",
    content: "Sebuah bola memiliki diameter 21 cm. Volume bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="10,5 cm" />,
    options: [
      { key: "A", text: "1.386 cm³" },
      { key: "B", text: "2.910 cm³" },
      { key: "C", text: "4.851 cm³" },
      { key: "D", text: "9.702 cm³" },
    ],
    answer: "C",
  },
  {
    n: 11, title: "Perbandingan Volume Dua Bola", cat: "vol",
    content: "Dua buah bola memiliki jari-jari masing-masing 3 cm dan 6 cm. Perbandingan volume bola pertama terhadap bola kedua adalah ...",
    options: [
      { key: "A", text: "1 : 4" },
      { key: "B", text: "1 : 6" },
      { key: "C", text: "1 : 8" },
      { key: "D", text: "2 : 3" },
    ],
    answer: "C",
  },
  {
    n: 12, title: "Perbandingan Volume Tabung, Bola, Kerucut", cat: "vol",
    content: "Sebuah tabung, bola, dan kerucut memiliki jari-jari dan tinggi yang sama (tinggi = 2r). Perbandingan volume tabung : bola : kerucut adalah ...",
    diagram: <PerbandinganBangunSVG />,
    options: [
      { key: "A", text: "1 : 2 : 3" },
      { key: "B", text: "2 : 1 : 3" },
      { key: "C", text: "3 : 2 : 1" },
      { key: "D", text: "3 : 1 : 2" },
    ],
    answer: "C",
  },
  {
    n: 13, title: "Perubahan Volume saat Jari-Jari Diperbesar", cat: "vol",
    content: "Jari-jari sebuah bola diperbesar menjadi 3/2 kali jari-jari semula. Perbandingan volume bola sebelum dan sesudah diperbesar adalah ...",
    options: [
      { key: "A", text: "4 : 9" },
      { key: "B", text: "8 : 9" },
      { key: "C", text: "8 : 27" },
      { key: "D", text: "27 : 8" },
    ],
    answer: "C",
  },
  /* ── APLIKASI ── */
  {
    n: 14, title: "Bola dalam Tabung", cat: "app",
    content: "Sebuah bola menyinggung semua sisi bagian dalam sebuah tabung (diameter dan tinggi tabung sama dengan diameter bola). Perbandingan volume bola terhadap volume tabung adalah ...",
    diagram: <BolaDalamTabungSVG />,
    options: [
      { key: "A", text: "1 : 2" },
      { key: "B", text: "2 : 3" },
      { key: "C", text: "3 : 4" },
      { key: "D", text: "3 : 2" },
    ],
    answer: "B",
  },
  {
    n: 15, title: "Volume Gabungan Tabung dan Setengah Bola", cat: "app",
    content: "Sebuah bangun gabungan terdiri dari tabung dengan jari-jari 7 cm dan tinggi 10 cm, serta setengah bola di atasnya dengan jari-jari yang sama. Volume bangun tersebut adalah ... (π = 22/7)",
    diagram: <TabungSetengahBolaSVG />,
    options: [
      { key: "A", text: "2.108,7 cm³" },
      { key: "B", text: "2.258,7 cm³" },
      { key: "C", text: "2.558,7 cm³" },
      { key: "D", text: "2.977,3 cm³" },
    ],
    answer: "B",
  },
  {
    n: 16, title: "Bola Besi dalam Tabung Berisi Air", cat: "app",
    content: "Sebuah tabung berisi air memiliki jari-jari alas 18 cm dengan permukaan air setinggi 10 cm. Ke dalam tabung dimasukkan bola besi berjari-jari 9 cm sehingga permukaan air naik setinggi t cm. Nilai t adalah ... (π sama)",
    options: [
      { key: "A", text: "2" },
      { key: "B", text: "3" },
      { key: "C", text: "4" },
      { key: "D", text: "5" },
    ],
    answer: "B",
  },
  /* ── LUAS PERMUKAAN (lanjutan) ── */
  {
    n: 17, title: "Luas Permukaan Bola – r = 7 cm", cat: "lp",
    content: "Sebuah bola memiliki jari-jari 7 cm. Luas permukaan bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="7 cm" />,
    options: [
      { key: "A", text: "154 cm²" },
      { key: "B", text: "308 cm²" },
      { key: "C", text: "462 cm²" },
      { key: "D", text: "616 cm²" },
    ],
    answer: "D",
  },
  {
    n: 18, title: "Luas Permukaan – Diameter 14 cm", cat: "lp",
    content: "Sebuah bola berdiameter 14 cm. Luas permukaan bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="7 cm" color="#60a5fa" />,
    options: [
      { key: "A", text: "154 cm²" },
      { key: "B", text: "308 cm²" },
      { key: "C", text: "616 cm²" },
      { key: "D", text: "1.232 cm²" },
    ],
    answer: "C",
  },
  {
    n: 19, title: "Jari-Jari dari Luas Permukaan 616 cm²", cat: "lp",
    content: "Luas permukaan sebuah bola adalah 616 cm². Panjang jari-jari bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="?" />,
    options: [
      { key: "A", text: "5 cm" },
      { key: "B", text: "6 cm" },
      { key: "C", text: "7 cm" },
      { key: "D", text: "14 cm" },
    ],
    answer: "C",
  },
  {
    n: 20, title: "Luas Permukaan Setengah Bola Padat – r = 7 cm", cat: "lp",
    content: "Sebuah mangkuk berbentuk setengah bola padat dengan r = 7 cm. Luas permukaan total (selimut + alas) mangkuk tersebut adalah ... (π = 22/7)",
    diagram: <HalfSphereSVG r="7 cm" />,
    options: [
      { key: "A", text: "154 cm²" },
      { key: "B", text: "308 cm²" },
      { key: "C", text: "462 cm²" },
      { key: "D", text: "616 cm²" },
    ],
    answer: "C",
  },
  {
    n: 21, title: "Luas Selimut Setengah Bola – r = 3 cm", cat: "lp",
    content: "Sebuah bola bekel berjari-jari 3 cm dipotong menjadi dua. Luas permukaan lengkungan (selimut saja) adalah ... (π = 3,14)",
    diagram: <HalfSphereSVG r="3 cm" />,
    options: [
      { key: "A", text: "28,26 cm²" },
      { key: "B", text: "56,52 cm²" },
      { key: "C", text: "84,78 cm²" },
      { key: "D", text: "113,04 cm²" },
    ],
    answer: "B",
  },
  {
    n: 22, title: "Perbandingan Luas Permukaan – r₁ : r₂ = 2 : 5", cat: "lp",
    content: "Dua bola memiliki jari-jari dengan perbandingan 2 : 5. Perbandingan luas permukaan bola pertama terhadap bola kedua adalah ...",
    options: [
      { key: "A", text: "2 : 5" },
      { key: "B", text: "2 : 25" },
      { key: "C", text: "4 : 25" },
      { key: "D", text: "8 : 125" },
    ],
    answer: "C",
  },
  {
    n: 23, title: "Luas Permukaan dari Volume 288π cm³", cat: "lp",
    content: "Volume sebuah bola adalah 288π cm³. Luas permukaan bola tersebut adalah ...",
    diagram: <SphereSVG r="?" />,
    options: [
      { key: "A", text: "36π cm²" },
      { key: "B", text: "72π cm²" },
      { key: "C", text: "108π cm²" },
      { key: "D", text: "144π cm²" },
    ],
    answer: "D",
  },
  {
    n: 24, title: "Diameter dari Luas Permukaan 2.464 cm²", cat: "lp",
    content: "Luas permukaan sebuah bola adalah 2.464 cm². Diameter bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="?" />,
    options: [
      { key: "A", text: "14 cm" },
      { key: "B", text: "21 cm" },
      { key: "C", text: "28 cm" },
      { key: "D", text: "56 cm" },
    ],
    answer: "C",
  },
  {
    n: 25, title: "Luas Penampang Semangka – r = 14 cm", cat: "lp",
    content: "Sebuah semangka berbentuk bola dengan r = 14 cm dipotong tepat di tengah. Luas penampang yang terbentuk adalah ... (π = 22/7)",
    diagram: <SphereSVG r="14 cm" color="#22c55e" extraLabel="Semangka" />,
    options: [
      { key: "A", text: "308 cm²" },
      { key: "B", text: "462 cm²" },
      { key: "C", text: "616 cm²" },
      { key: "D", text: "1.232 cm²" },
    ],
    answer: "C",
  },
  {
    n: 26, title: "Keliling Lingkaran Besar – r = 21 cm", cat: "lp",
    content: "Sebuah bola berjari-jari 21 cm. Keliling lingkaran terbesar (penampang melintang) pada bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="21 cm" />,
    options: [
      { key: "A", text: "66 cm" },
      { key: "B", text: "88 cm" },
      { key: "C", text: "110 cm" },
      { key: "D", text: "132 cm" },
    ],
    answer: "D",
  },
  {
    n: 27, title: "Keliling Lingkaran Besar – r = 10 cm", cat: "lp",
    content: "Sebuah bola berjari-jari 10 cm. Keliling lingkaran terbesarnya adalah ... (π = 3,14)",
    diagram: <SphereSVG r="10 cm" />,
    options: [
      { key: "A", text: "31,4 cm" },
      { key: "B", text: "62,8 cm" },
      { key: "C", text: "94,2 cm" },
      { key: "D", text: "125,6 cm" },
    ],
    answer: "B",
  },
  {
    n: 28, title: "Luas Permukaan saat Jari-Jari Diperbesar 2 Kali", cat: "lp",
    content: "Jika jari-jari sebuah bola diperbesar 2 kali, luas permukaannya menjadi ... kali semula.",
    options: [
      { key: "A", text: "2 kali" },
      { key: "B", text: "3 kali" },
      { key: "C", text: "4 kali" },
      { key: "D", text: "8 kali" },
    ],
    answer: "C",
  },
  {
    n: 29, title: "Luas Permukaan dari Volume 4.500π cm³", cat: "lp",
    content: "Sebuah bola memiliki volume 4.500π cm³. Luas permukaan bola tersebut adalah ...",
    diagram: <SphereSVG r="?" />,
    options: [
      { key: "A", text: "225π cm²" },
      { key: "B", text: "450π cm²" },
      { key: "C", text: "675π cm²" },
      { key: "D", text: "900π cm²" },
    ],
    answer: "D",
  },
  /* ── VOLUME (lanjutan) ── */
  {
    n: 30, title: "Volume Bola – r = 6 cm", cat: "vol",
    content: "Sebuah bola memiliki jari-jari 6 cm. Volume bola tersebut adalah ... (π = 3,14)",
    diagram: <SphereSVG r="6 cm" />,
    options: [
      { key: "A", text: "452,16 cm³" },
      { key: "B", text: "678,24 cm³" },
      { key: "C", text: "904,32 cm³" },
      { key: "D", text: "1.130,4 cm³" },
    ],
    answer: "C",
  },
  {
    n: 31, title: "Volume Bola – Diameter 21 cm", cat: "vol",
    content: "Sebuah bola berdiameter 21 cm. Volume bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="10,5 cm" />,
    options: [
      { key: "A", text: "2.425,5 cm³" },
      { key: "B", text: "3.637,5 cm³" },
      { key: "C", text: "4.851 cm³" },
      { key: "D", text: "6.468 cm³" },
    ],
    answer: "C",
  },
  {
    n: 32, title: "Jari-Jari dari Volume 4.186,67 cm³", cat: "vol",
    content: "Volume sebuah bola adalah 4.186,67 cm³. Jari-jari bola tersebut adalah ... (π = 3,14)",
    diagram: <SphereSVG r="?" />,
    options: [
      { key: "A", text: "5 cm" },
      { key: "B", text: "8 cm" },
      { key: "C", text: "10 cm" },
      { key: "D", text: "12 cm" },
    ],
    answer: "C",
  },
  {
    n: 33, title: "Volume Setengah Bola – r = 10 cm", cat: "vol",
    content: "Sebuah mangkuk berbentuk setengah bola memiliki jari-jari 10 cm. Volume mangkuk tersebut adalah ... (π = 3,14)",
    diagram: <HalfSphereSVG r="10 cm" />,
    options: [
      { key: "A", text: "1.046,67 cm³" },
      { key: "B", text: "1.570 cm³" },
      { key: "C", text: "2.093,33 cm³" },
      { key: "D", text: "4.186,67 cm³" },
    ],
    answer: "C",
  },
  {
    n: 34, title: "Perbandingan Volume Dua Bola – r = 3 dan 6 cm", cat: "vol",
    content: "Bola A berjari-jari 3 cm dan Bola B berjari-jari 6 cm. Perbandingan volume A : B adalah ...",
    options: [
      { key: "A", text: "1 : 4" },
      { key: "B", text: "1 : 6" },
      { key: "C", text: "1 : 8" },
      { key: "D", text: "1 : 12" },
    ],
    answer: "C",
  },
  {
    n: 35, title: "Volume Bola Besar – Perbandingan r₁ : r₂ = 3 : 4", cat: "vol",
    content: "Perbandingan jari-jari dua bola adalah 3 : 4. Jika volume bola kecil 972π cm³, volume bola besar adalah ...",
    options: [
      { key: "A", text: "1.296π cm³" },
      { key: "B", text: "1.728π cm³" },
      { key: "C", text: "2.048π cm³" },
      { key: "D", text: "2.304π cm³" },
    ],
    answer: "D",
  },
  {
    n: 36, title: "Volume Tangki Bola – d = 1,4 m", cat: "vol",
    content: "Sebuah tangki berbentuk bola berdiameter 1,4 m. Kapasitas tangki tersebut dalam dm³ adalah ... (π = 22/7, 1 m = 10 dm)",
    diagram: <SphereSVG r="0,7 m" color="#38bdf8" extraLabel="Tangki Bola" />,
    options: [
      { key: "A", text: "718,67 dm³" },
      { key: "B", text: "1.078 dm³" },
      { key: "C", text: "1.437,33 dm³" },
      { key: "D", text: "2.156 dm³" },
    ],
    answer: "C",
  },
  {
    n: 37, title: "Volume dari Keliling Lingkaran Besar 44 cm", cat: "vol",
    content: "Keliling lingkaran besar sebuah bola adalah 44 cm. Volume bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="?" />,
    options: [
      { key: "A", text: "718,67 cm³" },
      { key: "B", text: "1.078 cm³" },
      { key: "C", text: "1.437,33 cm³" },
      { key: "D", text: "2.156 cm³" },
    ],
    answer: "C",
  },
  {
    n: 38, title: "Volume saat Jari-Jari Diperbesar 3 Kali", cat: "vol",
    content: "Jika jari-jari sebuah bola diperbesar 3 kali, volume bola menjadi ... kali semula.",
    options: [
      { key: "A", text: "3 kali" },
      { key: "B", text: "9 kali" },
      { key: "C", text: "27 kali" },
      { key: "D", text: "81 kali" },
    ],
    answer: "C",
  },
  {
    n: 39, title: "Volume dari Luas Permukaan 1.386 cm²", cat: "vol",
    content: "Sebuah bola memiliki luas permukaan 1.386 cm². Volume bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="?" />,
    options: [
      { key: "A", text: "1.212,75 cm³" },
      { key: "B", text: "2.425,5 cm³" },
      { key: "C", text: "3.637,5 cm³" },
      { key: "D", text: "4.851 cm³" },
    ],
    answer: "D",
  },
  {
    n: 40, title: "Volume Bola Tenis Meja – Keliling 31,4 cm", cat: "vol",
    content: "Sebuah bola tenis meja memiliki keliling lingkaran besar 31,4 cm. Volume bola tersebut adalah ... (π = 3,14)",
    diagram: <SphereSVG r="?" />,
    options: [
      { key: "A", text: "261,67 cm³" },
      { key: "B", text: "392,5 cm³" },
      { key: "C", text: "523,33 cm³" },
      { key: "D", text: "785 cm³" },
    ],
    answer: "C",
  },
  /* ── APLIKASI (lanjutan) ── */
  {
    n: 41, title: "Luas Kulit Bola Sepak – d = 22 cm", cat: "app",
    content: "Sebuah bola sepak memiliki diameter 22 cm. Luas permukaan kulit bola tersebut adalah ... (π = 22/7)",
    diagram: <SphereSVG r="11 cm" color="#22c55e" extraLabel="Bola Sepak" />,
    options: [
      { key: "A", text: "760 cm²" },
      { key: "B", text: "1.140 cm²" },
      { key: "C", text: "1.521 cm²" },
      { key: "D", text: "2.282 cm²" },
    ],
    answer: "C",
  },
  {
    n: 42, title: "Harga Bola Plastik – r = 3,5 cm", cat: "app",
    content: "Sebuah bola plastik berjari-jari 3,5 cm dijual dengan harga Rp500 per cm² bahan. Harga satu bola adalah ... (π = 22/7)",
    diagram: <SphereSVG r="3,5 cm" color="#f472b6" extraLabel="Bola Plastik" />,
    options: [
      { key: "A", text: "Rp38.500" },
      { key: "B", text: "Rp57.750" },
      { key: "C", text: "Rp77.000" },
      { key: "D", text: "Rp115.500" },
    ],
    answer: "C",
  },
  {
    n: 43, title: "Volume Sisa Bola dalam Kubus – s = 14 cm", cat: "app",
    content: "Sebuah bola dimasukkan ke dalam kubus bersisi 14 cm (bola menyentuh semua sisi). Volume sisa di dalam kubus adalah ... (π = 22/7)",
    diagram: <SphereSVG r="7 cm" />,
    options: [
      { key: "A", text: "869,33 cm³" },
      { key: "B", text: "1.088 cm³" },
      { key: "C", text: "1.306,67 cm³" },
      { key: "D", text: "1.525,33 cm³" },
    ],
    answer: "C",
  },
  {
    n: 44, title: "Volume Balon Udara – d = 10 m", cat: "app",
    content: "Sebuah balon udara berbentuk bola berdiameter 10 m. Volume gas yang diisi ke dalam balon adalah ... (π = 3,14)",
    diagram: <SphereSVG r="5 m" color="#fbbf24" extraLabel="Balon Udara" />,
    options: [
      { key: "A", text: "261,67 m³" },
      { key: "B", text: "392,5 m³" },
      { key: "C", text: "523,33 m³" },
      { key: "D", text: "785 m³" },
    ],
    answer: "C",
  },
  {
    n: 45, title: "Banyak Bola Kecil dari Bola Besar", cat: "app",
    content: "Sebuah bola besar dengan r = 12 cm dipotong-potong menjadi bola-bola kecil berjari-jari 3 cm. Banyak bola kecil yang dihasilkan adalah ...",
    options: [
      { key: "A", text: "16 bola" },
      { key: "B", text: "32 bola" },
      { key: "C", text: "48 bola" },
      { key: "D", text: "64 bola" },
    ],
    answer: "D",
  },
  {
    n: 46, title: "Volume Air yang Tumpah – Bola Logam r = 6 cm", cat: "app",
    content: "Sebuah bola logam berjari-jari 6 cm dimasukkan ke dalam ember berisi air. Volume air yang tumpah adalah ... (π = 3,14)",
    diagram: <SphereSVG r="6 cm" color="#38bdf8" extraLabel="Bola Logam" />,
    options: [
      { key: "A", text: "452,16 cm³" },
      { key: "B", text: "678,24 cm³" },
      { key: "C", text: "904,32 cm³" },
      { key: "D", text: "1.356,48 cm³" },
    ],
    answer: "C",
  },
  {
    n: 47, title: "Berat Bola Lempung – r = 5 cm", cat: "app",
    content: "Seorang anak membuat bola dari lempung berjari-jari 5 cm. Jika massa jenis lempung 2 g/cm³, berat bola tersebut adalah ... (π = 3,14)",
    diagram: <SphereSVG r="5 cm" color="#a78bfa" extraLabel="Bola Lempung" />,
    options: [
      { key: "A", text: "523,33 gram" },
      { key: "B", text: "785 gram" },
      { key: "C", text: "1.046,67 gram" },
      { key: "D", text: "1.570 gram" },
    ],
    answer: "C",
  },
  {
    n: 48, title: "Volume Ruang Kosong Bola dalam Tabung", cat: "app",
    content: "Sebuah bola dengan r = 7 cm dimasukkan ke dalam tabung dengan r = 7 cm dan t = 14 cm. Volume ruang kosong dalam tabung adalah ... (π = 22/7)",
    diagram: <SphereSVG r="7 cm" />,
    options: [
      { key: "A", text: "359,33 cm³" },
      { key: "B", text: "539 cm³" },
      { key: "C", text: "718,67 cm³" },
      { key: "D", text: "1.078 cm³" },
    ],
    answer: "C",
  },
  {
    n: 49, title: "Kebutuhan Cat Model Planet – d = 1,4 m", cat: "app",
    content: "Sebuah model planet berbentuk bola dengan diameter 1,4 m dicat seluruhnya. Jika 1 kg cat dapat menutup 50 m², cat yang dibutuhkan adalah ... (π = 22/7)",
    diagram: <SphereSVG r="0,7 m" color="#a78bfa" extraLabel="Model Planet" />,
    options: [
      { key: "A", text: "0,062 kg" },
      { key: "B", text: "0,093 kg" },
      { key: "C", text: "0,123 kg" },
      { key: "D", text: "0,185 kg" },
    ],
    answer: "C",
  },
  {
    n: 50, title: "Biaya Bungkus 6 Bola Pingpong – d = 4 cm", cat: "app",
    content: "Sebuah bola pingpong berdiameter 4 cm akan dibungkus kertas tipis seharga Rp100 per cm². Biaya untuk membungkus 6 bola adalah ... (π = 3,14)",
    diagram: <SphereSVG r="2 cm" color="#fbbf24" extraLabel="× 6 bola" />,
    options: [
      { key: "A", text: "Rp20.096" },
      { key: "B", text: "Rp25.120" },
      { key: "C", text: "Rp30.144" },
      { key: "D", text: "Rp40.192" },
    ],
    answer: "C",
  },
  {
    n: 51, title: "Jari-Jari Bola Baru dari Tiga Bola Dilebur", cat: "app",
    content: "Tiga buah bola masing-masing berjari-jari 2 cm, 3 cm, dan 4 cm dilebur menjadi satu bola baru. Jari-jari bola baru tersebut adalah ...",
    options: [
      { key: "A", text: "3 cm" },
      { key: "B", text: "4 cm" },
      { key: "C", text: "∛99 cm ≈ 4,63 cm" },
      { key: "D", text: "5 cm" },
    ],
    answer: "C",
  },
  {
    n: 52, title: "Volume Kolam Setengah Bola – r = 70 cm", cat: "app",
    content: "Sebuah kolam mandi anak berbentuk setengah bola berjari-jari 70 cm. Volume air untuk mengisi penuh kolam tersebut adalah ... (π = 22/7, 1 liter = 1.000 cm³)",
    diagram: <HalfSphereSVG r="70 cm" />,
    options: [
      { key: "A", text: "359,33 liter" },
      { key: "B", text: "539 liter" },
      { key: "C", text: "718,67 liter" },
      { key: "D", text: "1.078 liter" },
    ],
    answer: "C",
  },
  {
    n: 53, title: "Volume Sisa Tiga Bola dalam Tabung", cat: "app",
    content: "Tiga bola berjari-jari 7 cm disusun dalam tabung dengan r = 7 cm dan t = 42 cm. Volume ruang kosong dalam tabung adalah ... (π = 22/7)",
    diagram: <SphereSVG r="7 cm" />,
    options: [
      { key: "A", text: "1.078 cm³" },
      { key: "B", text: "1.617 cm³" },
      { key: "C", text: "2.156 cm³" },
      { key: "D", text: "2.695 cm³" },
    ],
    answer: "C",
  },
  {
    n: 54, title: "Berat Bola Plastik – r = 5 cm", cat: "app",
    content: "Sebuah pabrik memproduksi bola plastik berjari-jari 5 cm. Material plastik memiliki berat 0,1 gram per cm². Berat satu bola adalah ... (π = 3,14)",
    diagram: <SphereSVG r="5 cm" color="#a78bfa" extraLabel="Bola Plastik" />,
    options: [
      { key: "A", text: "15,7 gram" },
      { key: "B", text: "23,55 gram" },
      { key: "C", text: "31,4 gram" },
      { key: "D", text: "62,8 gram" },
    ],
    answer: "C",
  },
  {
    n: 55, title: "Perbandingan Volume Bumi dan Bulan", cat: "app",
    content: "Jari-jari Bumi ≈ 6.400 km dan jari-jari Bulan ≈ 1.600 km. Volume Bumi adalah ... kali volume Bulan.",
    options: [
      { key: "A", text: "4 kali" },
      { key: "B", text: "16 kali" },
      { key: "C", text: "32 kali" },
      { key: "D", text: "64 kali" },
    ],
    answer: "D",
  },
  {
    n: 56, title: "Volume Tangki BBM – r = 1,05 m", cat: "app",
    content: "Sebuah tangki bahan bakar berbentuk bola berjari-jari 1,05 m. Kapasitas tangki tersebut dalam liter adalah ... (π = 22/7, 1 m³ = 1.000 liter)",
    diagram: <SphereSVG r="1,05 m" color="#fbbf24" extraLabel="Tangki BBM" />,
    options: [
      { key: "A", text: "2.425,5 liter" },
      { key: "B", text: "3.637,5 liter" },
      { key: "C", text: "4.851 liter" },
      { key: "D", text: "6.468 liter" },
    ],
    answer: "C",
  },
];

function CatDivider({ cat }: { cat: Cat }) {
  const { icon, label, color } = CAT_LABELS[cat];
  return (
    <div className="flex items-center gap-2 mt-2 mb-1">
      <div className="h-px flex-1 bg-white/8" />
      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${color}`}>
        {icon} {label}
      </span>
      <div className="h-px flex-1 bg-white/8" />
    </div>
  );
}

const optionStyle = (key: OptionKey, selected: OptionKey | undefined, answer: OptionKey, revealed: boolean) => {
  if (!revealed) {
    return selected === key
      ? "bg-indigo-500/30 border-indigo-400 text-white"
      : "bg-white/5 border-white/10 text-white/80 hover:border-indigo-400/50 hover:bg-indigo-500/10";
  }
  if (key === answer) return "bg-emerald-500/25 border-emerald-400 text-emerald-200";
  if (selected === key && key !== answer) return "bg-rose-500/25 border-rose-400 text-rose-200 line-through";
  return "bg-white/3 border-white/8 text-white/40";
};

const BolaPage = () => {
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

  const mcScore = mcQuestions.filter(q => revealed[q.n] && selected[q.n] === q.answer).length;
  const mcDone  = mcQuestions.filter(q => revealed[q.n]).length;

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
          <div className="mt-3 flex items-center gap-3 flex-wrap justify-center">
            <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-4 py-2">
              <span className="text-indigo-400 text-xs font-bold">📋 56 Soal</span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
            </div>
            {mcDone > 0 && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
                <span className="text-emerald-400 text-xs font-bold">✅ {mcScore}/{mcDone} jawaban benar</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-5 bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4">
          <p className="text-indigo-300 text-xs font-bold mb-2">📌 Rumus Penting — Bola</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              { label: "Luas Permukaan",         formula: "L = 4\\pi r^2" },
              { label: "Volume",                  formula: "V = \\tfrac{4}{3}\\pi r^3" },
              { label: "Luas ½ Bola (selimut+alas)", formula: "L = 2\\pi r^2 + \\pi r^2 = 3\\pi r^2" },
              { label: "Volume ½ Bola",           formula: "V = \\tfrac{2}{3}\\pi r^3" },
            ].map(f => (
              <div key={f.label} className="bg-white/5 rounded-lg px-3 py-2 flex gap-3 items-center">
                <span className="text-indigo-400 font-bold shrink-0 w-36">{f.label}</span>
                <span className="text-white/80"><InlineMath math={f.formula} /></span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-indigo-500/20" />
          <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-2">Soal 1–56 · Pilihan Ganda</span>
          <div className="h-px flex-1 bg-indigo-500/20" />
        </div>

        <div className="flex flex-col gap-3 animate-slide-up">
          {mcQuestions.map((q, i) => {
            const isRevealed = !!revealed[q.n];
            const sel = selected[q.n];
            const isCorrect = isRevealed && sel === q.answer;
            const isWrong   = isRevealed && sel && sel !== q.answer;
            const prevCat   = i > 0 ? mcQuestions[i - 1].cat : null;
            const showDivider = q.cat !== prevCat;
            return (
              <div key={q.n}>
                {showDivider && <CatDivider cat={q.cat} />}
                <div className="relative rounded-2xl overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${i * 0.015}s` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900/80 to-violet-900/30 backdrop-blur" />
                  <div className={`absolute inset-0 rounded-2xl transition-colors duration-300 ${isCorrect ? "border border-emerald-500/40" : isWrong ? "border border-rose-500/40" : "border border-indigo-500/20"}`} />
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-violet-500 rounded-l-2xl" />
                  <div className="relative px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isCorrect ? "bg-emerald-500/20 border-emerald-400/50" : isWrong ? "bg-rose-500/20 border-rose-400/50" : "bg-indigo-500/20 border-indigo-400/50"}`}>
                        <span className={`text-xs font-bold ${isCorrect ? "text-emerald-300" : isWrong ? "text-rose-300" : "text-indigo-300"}`}>{q.n}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded inline-block mb-2">
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
                                isRevealed && opt.key === q.answer          ? "border-emerald-400 text-emerald-300 bg-emerald-500/20"
                                : isRevealed && sel === opt.key && opt.key !== q.answer ? "border-rose-400 text-rose-300 bg-rose-500/20"
                                : sel === opt.key                           ? "border-indigo-400 text-indigo-300 bg-indigo-500/20"
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
                            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition-all cursor-pointer font-body">
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
              </div>
            );
          })}
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
