import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import PembahasanCard from "@/components/PembahasanCard";
import { teoremaPythagorasDasarPembahasan } from "@/data/pembahasan/teoremaPythagorasDasar";
import { teoremaPythagorasOlimpiadePembahasan } from "@/data/pembahasan/teoremaPythagorasOlimpiade";
import bangunABCDESoal7Img from "@assets/image_1777204803383.png";
import layangKapalSoal18Img from "@assets/image_1777205277003.png";
import bangunABEFCDSoal20Img from "@assets/image_1777205316310.png";
import pentagonSoal21Img from "@assets/image_1777205396307.png";
import segitigaABCD30_45_Soal29Img from "@assets/image_1777205490135.png";
import persegiPanjangABCDSoalOlim1Img from "@assets/image_1777205526814.png";
import bangunABCDSoalOlim4Img from "@assets/image_1777205553203.png";
import bangunABCDSoalOlim5Img from "@assets/image_1777205569648.png";
import segitigaABCSoalOlim6Img from "@assets/image_1777205589664.png";
import trapesiumABCDSoalOlim10Img from "@assets/image_1777205607261.png";

// SVG: Segitiga siku-siku Pythagoras dengan sisi a (alas), b (tegak), c (miring)
const PythagorasSegitigaSVG = () => {
  const W = 220, H = 160;
  // Vertices: kanan-bawah (siku), kiri-bawah, kiri-atas
  const Bx = W - 30, By = H - 30;   // kanan-bawah
  const Ax = 40, Ay = H - 30;       // kiri-bawah
  const Cx = 40, Cy = 30;           // kiri-atas

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        {/* Segitiga siku-siku */}
        <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="none" stroke="#22d3ee" strokeWidth="2" />
        {/* Tanda siku-siku di kiri-bawah */}
        <rect x={Ax} y={Ay - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1" />
        {/* Label sisi */}
        <text x={(Ax + Bx) / 2} y={By + 16} fill="#fbbf24" fontSize="14" fontStyle="italic" fontWeight="bold" textAnchor="middle">a</text>
        <text x={Ax - 10} y={(Ay + Cy) / 2 + 4} fill="#fbbf24" fontSize="14" fontStyle="italic" fontWeight="bold" textAnchor="end">b</text>
        <text x={(Bx + Cx) / 2 + 8} y={(By + Cy) / 2 + 2} fill="#fbbf24" fontSize="14" fontStyle="italic" fontWeight="bold">c</text>
      </svg>
    </div>
  );
};

// SVG: Jarak antara 2 titik koordinat - Titik P(x1, y1) dan Q(x2, y2)
const JarakDuaTitikSVG = () => {
  const W = 280, H = 220;
  const ox = 50, oy = H - 30;
  const x1Pos = 110, x2Pos = 220;
  const y1Pos = oy - 60, y2Pos = oy - 130;

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        <defs>
          <marker id="arrowJarakP" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L6,4 L0,8 Z" fill="#fbbf24" />
          </marker>
        </defs>
        {/* Sumbu Y */}
        <line x1={ox} y1={oy + 4} x2={ox} y2={20} stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arrowJarakP)" />
        {/* Sumbu X */}
        <line x1={ox - 4} y1={oy} x2={W - 14} y2={oy} stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arrowJarakP)" />
        {/* Garis diagonal dari origin melewati P dan Q */}
        <line x1={ox} y1={oy} x2={x2Pos + 18} y2={y2Pos - 14} stroke="#e5e7eb" strokeWidth="1.2" />
        {/* Persegi panjang putus-putus untuk Q */}
        <line x1={ox} y1={y2Pos} x2={x2Pos} y2={y2Pos} stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="4 3" />
        <line x1={x2Pos} y1={y2Pos} x2={x2Pos} y2={oy} stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="4 3" />
        {/* Persegi panjang putus-putus untuk P */}
        <line x1={ox} y1={y1Pos} x2={x1Pos} y2={y1Pos} stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="4 3" />
        <line x1={x1Pos} y1={y1Pos} x2={x1Pos} y2={oy} stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="4 3" />
        {/* Titik P dan Q */}
        <circle cx={x1Pos} cy={y1Pos} r="3.5" fill="#fbbf24" />
        <circle cx={x2Pos} cy={y2Pos} r="3.5" fill="#fbbf24" />
        {/* Label P dan Q */}
        <text x={x1Pos + 6} y={y1Pos + 12} fill="#fbbf24" fontSize="12" fontWeight="bold">P</text>
        <text x={x2Pos + 6} y={y2Pos + 4} fill="#fbbf24" fontSize="12" fontWeight="bold">Q</text>
        {/* Label sumbu */}
        <text x={x1Pos} y={oy + 14} fill="#e5e7eb" fontSize="11" textAnchor="middle">x₁</text>
        <text x={x2Pos} y={oy + 14} fill="#e5e7eb" fontSize="11" textAnchor="middle">x₂</text>
        <text x={ox - 8} y={y1Pos + 4} fill="#e5e7eb" fontSize="11" textAnchor="end">y₁</text>
        <text x={ox - 8} y={y2Pos + 4} fill="#e5e7eb" fontSize="11" textAnchor="end">y₂</text>
      </svg>
    </div>
  );
};

// SVG: Segitiga siku-siku 30-60-90 dengan sisi 1, √3, 2
const Segitiga306090SVG = () => {
  const W = 280, H = 160;
  // Vertices: kiri-bawah (30°), kanan-bawah (siku 90°), kanan-atas (60°)
  const Ax = 30, Ay = H - 30;          // kiri-bawah
  const Bx = W - 40, By = H - 30;      // kanan-bawah (siku-siku)
  const Cx = W - 40, Cy = 30;          // kanan-atas

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        {/* Segitiga */}
        <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="none" stroke="#22d3ee" strokeWidth="2" />
        {/* Tanda siku-siku di kanan-bawah */}
        <rect x={Bx - 12} y={By - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1" />
        {/* Busur sudut 30° di kiri-bawah */}
        <path d={`M ${Ax + 28} ${Ay} A 28 28 0 0 0 ${Ax + 26} ${Ay - 9}`} fill="none" stroke="#fbbf24" strokeWidth="1.2" />
        {/* Busur sudut 60° di kanan-atas */}
        <path d={`M ${Cx} ${Cy + 22} A 22 22 0 0 0 ${Cx - 19} ${Cy + 11}`} fill="none" stroke="#fbbf24" strokeWidth="1.2" />
        {/* Label sudut */}
        <text x={Ax + 36} y={Ay - 4} fill="#fbbf24" fontSize="11" fontWeight="bold">30°</text>
        <text x={Cx - 30} y={Cy + 16} fill="#fbbf24" fontSize="11" fontWeight="bold">60°</text>
        {/* Label sisi: √3 (alas), 1 (vertikal), 2 (miring) */}
        <text x={(Ax + Bx) / 2} y={By + 18} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="middle">√3</text>
        <text x={Bx + 8} y={(By + Cy) / 2 + 4} fill="#e5e7eb" fontSize="14" fontWeight="bold">1</text>
        <text x={(Ax + Cx) / 2 - 6} y={(Ay + Cy) / 2 - 4} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="middle">2</text>
      </svg>
    </div>
  );
};

// SVG: Segitiga siku-siku sama kaki 45-45-90 dengan sisi 1, 1, √2
const Segitiga454590SVG = () => {
  const W = 220, H = 200;
  // Vertices: kiri-bawah (45°), kanan-bawah (siku 90°), kanan-atas (45°)
  const Ax = 30, Ay = H - 30;          // kiri-bawah
  const Bx = W - 40, By = H - 30;      // kanan-bawah (siku-siku)
  const Cx = W - 40, Cy = 30;          // kanan-atas

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        {/* Segitiga */}
        <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="none" stroke="#22d3ee" strokeWidth="2" />
        {/* Tanda siku-siku di kanan-bawah */}
        <rect x={Bx - 12} y={By - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1" />
        {/* Busur sudut 45° di kiri-bawah */}
        <path d={`M ${Ax + 24} ${Ay} A 24 24 0 0 0 ${Ax + 17} ${Ay - 17}`} fill="none" stroke="#fbbf24" strokeWidth="1.2" />
        {/* Busur sudut 45° di kanan-atas */}
        <path d={`M ${Cx} ${Cy + 24} A 24 24 0 0 0 ${Cx - 17} ${Cy + 17}`} fill="none" stroke="#fbbf24" strokeWidth="1.2" />
        {/* Label sudut */}
        <text x={Ax + 28} y={Ay - 4} fill="#fbbf24" fontSize="11" fontWeight="bold">45°</text>
        <text x={Cx - 32} y={Cy + 18} fill="#fbbf24" fontSize="11" fontWeight="bold">45°</text>
        {/* Label sisi: 1 (alas), 1 (vertikal), √2 (miring) */}
        <text x={(Ax + Bx) / 2} y={By + 18} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="middle">1</text>
        <text x={Bx + 8} y={(By + Cy) / 2 + 4} fill="#e5e7eb" fontSize="14" fontWeight="bold">1</text>
        <text x={(Ax + Cx) / 2 - 4} y={(Ay + Cy) / 2 - 4} fill="#e5e7eb" fontSize="14" fontWeight="bold" textAnchor="middle">√2</text>
      </svg>
    </div>
  );
};

// SVG: Segitiga siku-siku dengan sisi p (vertikal kiri), q (alas), r (sisi miring) - sudut siku di kiri-bawah
const SegitigaPQRSVG = () => {
  const W = 260, H = 170;
  const Ax = 30, Ay = H - 30;          // kiri-bawah (siku-siku)
  const Bx = W - 30, By = H - 30;      // kanan-bawah
  const Cx = 30, Cy = 25;              // kiri-atas

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        {/* Segitiga */}
        <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="none" stroke="#22d3ee" strokeWidth="2" />
        {/* Tanda siku-siku di kiri-bawah */}
        <rect x={Ax} y={Ay - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1" />
        {/* Label sisi: p (vertikal kiri), q (alas), r (miring) */}
        <text x={Ax - 10} y={(Ay + Cy) / 2 + 4} fill="#fbbf24" fontSize="14" fontStyle="italic" fontWeight="bold" textAnchor="end">p</text>
        <text x={(Ax + Bx) / 2} y={By + 18} fill="#fbbf24" fontSize="14" fontStyle="italic" fontWeight="bold" textAnchor="middle">q</text>
        <text x={(Bx + Cx) / 2 + 4} y={(By + Cy) / 2 - 4} fill="#fbbf24" fontSize="14" fontStyle="italic" fontWeight="bold">r</text>
      </svg>
    </div>
  );
};

// SVG: Segitiga siku-siku ABC untuk Soal No. 4 (kaki 18 dan 24, sisi miring AC)
const SegitigaABC182430SVG = () => {
  const W = 280, H = 200;
  const Ax = 30, Ay = H - 30;          // kiri-bawah
  const Bx = W - 30, By = H - 30;      // kanan-bawah (siku-siku)
  const Cx = W - 30, Cy = 25;          // kanan-atas

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        {/* Segitiga */}
        <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2" />
        {/* Tanda siku-siku di B (kanan-bawah) */}
        <rect x={Bx - 12} y={By - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
        {/* Titik sudut */}
        <circle cx={Ax} cy={Ay} r="3" fill="#22d3ee" />
        <circle cx={Bx} cy={By} r="3" fill="#22d3ee" />
        <circle cx={Cx} cy={Cy} r="3" fill="#22d3ee" />
        {/* Label titik sudut */}
        <text x={Ax - 10} y={Ay + 4} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">A</text>
        <text x={Bx + 8} y={By + 12} fill="#ffffff" fontSize="14" fontWeight="bold">B</text>
        <text x={Cx + 8} y={Cy + 4} fill="#ffffff" fontSize="14" fontWeight="bold">C</text>
        {/* Label sisi: AB = 24 cm (alas), BC = 18 cm (kanan), AC = ? (miring) */}
        <text x={(Ax + Bx) / 2} y={By + 18} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">24 cm</text>
        <text x={Bx - 8} y={(By + Cy) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">18 cm</text>
        <text x={(Ax + Cx) / 2 - 8} y={(Ay + Cy) / 2 - 4} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end" transform={`rotate(-36 ${(Ax + Cx) / 2 - 8} ${(Ay + Cy) / 2 - 4})`}>?</text>
      </svg>
    </div>
  );
};

// SVG: Segitiga siku-siku ABD untuk Soal No. 5 (kaki 7 dan 24, sisi miring AD)
const SegitigaABD72425SVG = () => {
  const W = 280, H = 200;
  const Ax = 30, Ay = H - 30;          // kiri-bawah
  const Bx = W - 30, By = H - 30;      // kanan-bawah (siku-siku)
  const Dx = W - 30, Dy = 50;          // kanan-atas

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        {/* Segitiga */}
        <polygon points={`${Ax},${Ay} ${Bx},${By} ${Dx},${Dy}`} fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2" />
        {/* Tanda siku-siku di B (kanan-bawah) */}
        <rect x={Bx - 12} y={By - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
        {/* Titik sudut */}
        <circle cx={Ax} cy={Ay} r="3" fill="#22d3ee" />
        <circle cx={Bx} cy={By} r="3" fill="#22d3ee" />
        <circle cx={Dx} cy={Dy} r="3" fill="#22d3ee" />
        {/* Label titik sudut */}
        <text x={Ax - 10} y={Ay + 4} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">A</text>
        <text x={Bx + 8} y={By + 12} fill="#ffffff" fontSize="14" fontWeight="bold">B</text>
        <text x={Dx + 8} y={Dy + 4} fill="#ffffff" fontSize="14" fontWeight="bold">D</text>
        {/* Label sisi: AB = 24 cm (alas), BD = 7 cm (kanan), AD = ? (miring) */}
        <text x={(Ax + Bx) / 2} y={By + 18} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">24 cm</text>
        <text x={Bx - 8} y={(By + Dy) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">7 cm</text>
        <text x={(Ax + Dx) / 2 - 6} y={(Ay + Dy) / 2 - 6} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end" transform={`rotate(-22 ${(Ax + Dx) / 2 - 6} ${(Ay + Dy) / 2 - 6})`}>?</text>
      </svg>
    </div>
  );
};

// SVG: Segitiga siku-siku CAB dengan titik D pada AB untuk Soal No. 6
// CA = 9 (vertikal kiri, siku-siku di A), CD = 15, CB = 41 → AD = 12, AB = 40, BD = 28
const SegitigaCABD9_15_41_SVG = () => {
  const W = 320, H = 200;
  const Ax = 30, Ay = H - 30;          // kiri-bawah (siku-siku)
  const Cx = 30, Cy = 30;              // kiri-atas
  const Bx = W - 20, By = H - 30;      // kanan-bawah
  // D pada AB, AD = 12 dari panjang AB = 40 → posisi D = Ax + (12/40)*(Bx-Ax)
  const Dx = Ax + (12 / 40) * (Bx - Ax);
  const Dy = Ay;

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        {/* Segitiga CAB */}
        <polygon points={`${Cx},${Cy} ${Ax},${Ay} ${Bx},${By}`} fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2" />
        {/* Garis CD */}
        <line x1={Cx} y1={Cy} x2={Dx} y2={Dy} stroke="#22d3ee" strokeWidth="1.6" />
        {/* Tanda siku-siku di A */}
        <rect x={Ax} y={Ay - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
        {/* Titik sudut */}
        <circle cx={Cx} cy={Cy} r="3" fill="#22d3ee" />
        <circle cx={Ax} cy={Ay} r="3" fill="#22d3ee" />
        <circle cx={Bx} cy={By} r="3" fill="#22d3ee" />
        <circle cx={Dx} cy={Dy} r="3" fill="#22d3ee" />
        {/* Label titik */}
        <text x={Cx - 8} y={Cy + 4} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">C</text>
        <text x={Ax - 6} y={Ay + 16} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">A</text>
        <text x={Bx + 6} y={By + 16} fill="#ffffff" fontSize="14" fontWeight="bold">B</text>
        <text x={Dx} y={Dy + 18} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">D</text>
        {/* Label sisi: CA = 9 (kiri), CB = 41 (miring atas), CD = 15 (di dalam) */}
        <text x={Cx - 6} y={(Cy + Ay) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">9</text>
        <text x={(Cx + Bx) / 2 + 8} y={(Cy + By) / 2 - 4} fill="#fbbf24" fontSize="13" fontWeight="bold">41</text>
        <text x={(Cx + Dx) / 2 + 10} y={(Cy + Dy) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold">15</text>
      </svg>
    </div>
  );
};

// SVG: Bangun ABCDE (pentagon) untuk Soal No. 7
// Sisi: AB = 20, BC = 9, CD = 17, DE = 15, EA = 13 → keliling = 74 cm
const BangunABCDESVG = () => {
  const W = 320, H = 240;
  const s = 8;                          // skala (px per cm)
  const offX = 60;                      // margin kiri
  const baseY = H - 30;                 // garis dasar AB

  const A = { x: offX, y: baseY };
  const B = { x: offX + 20 * s, y: baseY };
  const C = { x: B.x, y: baseY - 9 * s };
  const E = { x: A.x, y: baseY - 13 * s };
  // D dihitung dari sistem: |CD| = 17, |DE| = 15 → D ≈ (10.87, 23.35) dari A
  const D = { x: offX + 10.87 * s, y: baseY - 23.35 * s };

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        {/* Bangun ABCDE */}
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y} ${E.x},${E.y}`}
          fill="rgba(34,211,238,0.08)"
          stroke="#22d3ee"
          strokeWidth="2"
        />
        {/* Tanda siku-siku di A dan B */}
        <rect x={A.x} y={A.y - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
        <rect x={B.x - 12} y={B.y - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
        {/* Titik sudut */}
        {[A, B, C, D, E].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#22d3ee" />
        ))}
        {/* Label titik */}
        <text x={A.x - 8} y={A.y + 16} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">A</text>
        <text x={B.x + 8} y={B.y + 16} fill="#ffffff" fontSize="14" fontWeight="bold">B</text>
        <text x={C.x + 8} y={C.y + 4} fill="#ffffff" fontSize="14" fontWeight="bold">C</text>
        <text x={D.x} y={D.y - 8} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">D</text>
        <text x={E.x - 8} y={E.y + 4} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">E</text>
        {/* Label sisi */}
        <text x={(A.x + B.x) / 2} y={baseY + 18} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">20 cm</text>
        <text x={B.x + 8} y={(B.y + C.y) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold">9 cm</text>
        <text x={(C.x + D.x) / 2 + 6} y={(C.y + D.y) / 2 - 2} fill="#fbbf24" fontSize="13" fontWeight="bold">17 cm</text>
        <text x={(D.x + E.x) / 2 - 6} y={(D.y + E.y) / 2 - 2} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">15 cm</text>
        <text x={E.x - 8} y={(E.y + A.y) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">13 cm</text>
      </svg>
    </div>
  );
};

// Tabel informasi sisi-sisi segitiga untuk Soal No. 11
const TabelSegitiga11 = () => {
  const rows = [
    { tri: "△ABC", sisi: ["3", "10", "12"] },
    { tri: "△DEF", sisi: ["3", "4", "6"] },
    { tri: "△KLM", sisi: ["10", "24", "26"] },
    { tri: "△PQR", sisi: ["6", "8", "9"] },
  ];

  return (
    <div className="my-3 flex justify-center">
      <div className="w-full max-w-xs sm:max-w-sm overflow-hidden rounded-lg border border-cyan-400/40 bg-white/5">
        <table className="w-full text-sm text-white">
          <thead className="bg-cyan-500/20">
            <tr>
              <th className="px-3 py-2 text-left font-semibold border-b border-cyan-400/30">Segitiga</th>
              <th className="px-3 py-2 text-center font-semibold border-b border-cyan-400/30">Sisi 1</th>
              <th className="px-3 py-2 text-center font-semibold border-b border-cyan-400/30">Sisi 2</th>
              <th className="px-3 py-2 text-center font-semibold border-b border-cyan-400/30">Sisi 3</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.tri} className={i % 2 === 0 ? "bg-white/0" : "bg-white/5"}>
                <td className="px-3 py-2 font-semibold text-cyan-300 border-t border-cyan-400/20">{r.tri}</td>
                {r.sisi.map((s, j) => (
                  <td key={j} className="px-3 py-2 text-center text-yellow-300 border-t border-cyan-400/20">
                    {s}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// SVG: Segitiga siku-siku untuk Soal No. 15 — sisi (x-1), (x+1), hipotenusa (x+3)
const SegitigaXSVG = () => {
  const W = 280, H = 200;
  const Ax = 90, Ay = H - 30;          // kiri-bawah (siku-siku)
  const Bx = W - 30, By = H - 30;      // kanan-bawah
  const Cx = 90, Cy = 25;              // kiri-atas

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[180px] sm:max-w-[220px] rounded-lg border border-border/40 bg-white/5">
        {/* Segitiga */}
        <polygon points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`} fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2" />
        {/* Tanda siku-siku di kiri-bawah */}
        <rect x={Ax} y={Ay - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
        {/* Titik sudut */}
        <circle cx={Ax} cy={Ay} r="3" fill="#22d3ee" />
        <circle cx={Bx} cy={By} r="3" fill="#22d3ee" />
        <circle cx={Cx} cy={Cy} r="3" fill="#22d3ee" />
        {/* Label sisi: (x - 1) kiri, (x + 1) bawah, (x + 3) miring */}
        <text x={Ax - 8} y={(Ay + Cy) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">(x − 1) cm</text>
        <text x={(Ax + Bx) / 2} y={By + 18} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">(x + 1) cm</text>
        <text x={(Bx + Cx) / 2 + 6} y={(By + Cy) / 2 - 6} fill="#fbbf24" fontSize="13" fontWeight="bold">(x + 3) cm</text>
      </svg>
    </div>
  );
};

// SVG: Layang-layang dan kapal untuk Soal No. 18
// Segitiga siku-siku 45° - 90°, tinggi vertikal = 150 m, sisi miring (tali) = ?
const LayangKapalSVG = () => {
  const W = 320, H = 240;
  // Posisi kapal (kiri-bawah) dan ujung vertikal (kanan-bawah)
  const Kx = 50, Ky = H - 40;          // kapal
  const Bx = W - 50, By = H - 40;      // titik kaki vertikal (sudut 90°)
  const Tx = W - 50, Ty = 50;          // posisi layangan (atas)

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        {/* Permukaan air */}
        <line x1="10" y1={Ky + 6} x2={W - 10} y2={Ky + 6} stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3,3" opacity="0.6" />

        {/* Segitiga */}
        <polygon points={`${Kx},${Ky} ${Bx},${By} ${Tx},${Ty}`} fill="rgba(34,211,238,0.08)" stroke="#22d3ee" strokeWidth="2" />
        {/* Tanda siku-siku */}
        <rect x={Bx - 12} y={By - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />

        {/* Kapal (perahu sederhana) */}
        <g transform={`translate(${Kx - 30}, ${Ky - 18})`}>
          {/* lambung */}
          <path d="M 0 12 L 6 22 L 36 22 L 42 12 Z" fill="#7c3aed" stroke="#1e1b4b" strokeWidth="1" />
          {/* tiang */}
          <line x1="22" y1="12" x2="22" y2="-4" stroke="#fde68a" strokeWidth="1.5" />
          {/* layar */}
          <polygon points="22,0 38,12 22,12" fill="#fbbf24" />
          <polygon points="22,0 8,12 22,12" fill="#f59e0b" />
        </g>

        {/* Layangan */}
        <g transform={`translate(${Tx - 18}, ${Ty - 22})`}>
          <polygon points="18,0 36,18 18,40 0,18" fill="#f472b6" stroke="#831843" strokeWidth="1.2" />
          <line x1="18" y1="0" x2="18" y2="40" stroke="#831843" strokeWidth="0.8" />
          <line x1="0" y1="18" x2="36" y2="18" stroke="#831843" strokeWidth="0.8" />
          {/* ekor */}
          <path d="M 18 40 Q 22 46 16 50 Q 22 54 16 58" fill="none" stroke="#831843" strokeWidth="1" />
        </g>

        {/* Label sudut 45° di kapal */}
        <path d={`M ${Kx + 24} ${Ky} A 24 24 0 0 0 ${Kx + 17} ${Ky - 17}`} fill="none" stroke="#fbbf24" strokeWidth="1.2" />
        <text x={Kx + 28} y={Ky - 6} fill="#fbbf24" fontSize="12" fontWeight="bold">45°</text>

        {/* Label sudut 90° */}
        <text x={Bx - 28} y={By - 16} fill="#fbbf24" fontSize="11" fontWeight="bold">90°</text>

        {/* Label sisi */}
        <text x={(Kx + Bx) / 2} y={By + 18} fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">tanah</text>
        <text x={Bx + 8} y={(By + Ty) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold">150 m</text>
        <text x={(Kx + Tx) / 2 - 4} y={(Ky + Ty) / 2 - 6} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end" transform={`rotate(-32 ${(Kx + Tx) / 2 - 4} ${(Ky + Ty) / 2 - 6})`}>Tali</text>
      </svg>
    </div>
  );
};

// SVG: Bangun gabungan jajargenjang ABEF + belah ketupat BCDE untuk Soal No. 20
const BangunABEFCDSVG = () => {
  const W = 360, H = 250;

  // Koordinat titik (disesuaikan agar mirip gambar soal)
  const A = { x: 40, y: 140 };
  const B = { x: 190, y: 130 };
  const E = { x: 250, y: 60 };
  const F = { x: 100, y: 70 };
  const C = { x: 240, y: 210 };
  const D = { x: 300, y: 140 };

  // Helper untuk menggambar tick mark di tengah sisi (perpendicular ke sisi)
  const tickMarks = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    count: 1 | 2,
    keyPrefix: string
  ) => {
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len; // along
    const uy = dy / len;
    const nx = -uy;       // perpendicular
    const ny = ux;
    const tickLen = 6;
    const sep = 4;
    const offsets = count === 1 ? [0] : [-sep / 2, sep / 2];
    return offsets.map((off, i) => {
      const cx = mx + ux * off;
      const cy = my + uy * off;
      return (
        <line
          key={`${keyPrefix}-${i}`}
          x1={cx - nx * tickLen / 2}
          y1={cy - ny * tickLen / 2}
          x2={cx + nx * tickLen / 2}
          y2={cy + ny * tickLen / 2}
          stroke="#fbbf24"
          strokeWidth="1.6"
        />
      );
    });
  };

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        {/* Jajargenjang ABEF */}
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${E.x},${E.y} ${F.x},${F.y}`}
          fill="rgba(34,211,238,0.06)"
          stroke="#22d3ee"
          strokeWidth="2"
        />
        {/* Belah ketupat BCDE */}
        <polygon
          points={`${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y} ${E.x},${E.y}`}
          fill="rgba(244,114,182,0.06)"
          stroke="#22d3ee"
          strokeWidth="2"
        />

        {/* Tick marks: AB & FE = double, AF, BE, BC, CD, DE = single */}
        {tickMarks(A, B, 2, "AB")}
        {tickMarks(F, E, 2, "FE")}
        {tickMarks(A, F, 1, "AF")}
        {tickMarks(B, E, 1, "BE")}
        {tickMarks(B, C, 1, "BC")}
        {tickMarks(C, D, 1, "CD")}
        {tickMarks(D, E, 1, "DE")}

        {/* Titik sudut */}
        {[A, B, C, D, E, F].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#22d3ee" />
        ))}

        {/* Label titik */}
        <text x={A.x - 8} y={A.y + 5} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">A</text>
        <text x={B.x - 8} y={B.y + 16} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">B</text>
        <text x={C.x + 4} y={C.y + 18} fill="#ffffff" fontSize="14" fontWeight="bold">C</text>
        <text x={D.x + 8} y={D.y + 5} fill="#ffffff" fontSize="14" fontWeight="bold">D</text>
        <text x={E.x + 8} y={E.y + 4} fill="#ffffff" fontSize="14" fontWeight="bold">E</text>
        <text x={F.x - 4} y={F.y - 6} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">F</text>
      </svg>
    </div>
  );
};

// SVG: Bangun pentagon (trapesium + segitiga) untuk Soal No. 21
// Trapesium: alas 12, kaki 5 (sama), tinggi 3 (top = 4)
// Segitiga di atas dengan sisi miring 16 dan tanda siku-siku di pojok kanan-atas
const PentagonSoal21SVG = () => {
  const W = 320, H = 250;

  // Trapesium
  const V1 = { x: 50, y: 220 };  // bottom-left
  const V5 = { x: 250, y: 220 }; // bottom-right
  const V4 = { x: 210, y: 170 }; // top-right of trap
  const V2 = { x: 90, y: 170 };  // top-left of trap (X tick on V1-V2)
  // Puncak kanan-atas segitiga (siku-siku di sini)
  const V3 = { x: 270, y: 80 };

  // X-style tick (dua garis silang) di tengah ruas
  const xTick = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    key: string
  ) => {
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    const s = 5;
    return (
      <g key={key} stroke="#fbbf24" strokeWidth="1.6">
        <line x1={mx - s} y1={my - s} x2={mx + s} y2={my + s} />
        <line x1={mx - s} y1={my + s} x2={mx + s} y2={my - s} />
      </g>
    );
  };

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        {/* Outline pentagon: V1 → V5 → V4 → V3 → V2 → V1 */}
        <polygon
          points={`${V1.x},${V1.y} ${V5.x},${V5.y} ${V4.x},${V4.y} ${V3.x},${V3.y} ${V2.x},${V2.y}`}
          fill="rgba(34,211,238,0.08)"
          stroke="#22d3ee"
          strokeWidth="2"
        />

        {/* Garis pemisah trapesium dan segitiga (top trap horizontal) */}
        <line x1={V2.x} y1={V2.y} x2={V4.x} y2={V4.y} stroke="#22d3ee" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />

        {/* Garis vertikal "3 cm" di dalam trapesium */}
        <line x1={150} y1={V2.y} x2={150} y2={V1.y} stroke="#60a5fa" strokeWidth="1.6" />
        <text x={156} y={(V2.y + V1.y) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold">3 cm</text>

        {/* Tanda siku-siku di V3 (antara V3-V4 dan V3-V2). Square kecil rotasi mengikuti sudut */}
        {(() => {
          const v34 = { x: V4.x - V3.x, y: V4.y - V3.y };
          const v32 = { x: V2.x - V3.x, y: V2.y - V3.y };
          const n34 = Math.hypot(v34.x, v34.y);
          const n32 = Math.hypot(v32.x, v32.y);
          const u34 = { x: v34.x / n34, y: v34.y / n34 };
          const u32 = { x: v32.x / n32, y: v32.y / n32 };
          const sz = 10;
          const A = { x: V3.x + u34.x * sz, y: V3.y + u34.y * sz };
          const B = { x: V3.x + u32.x * sz, y: V3.y + u32.y * sz };
          const C = { x: V3.x + (u34.x + u32.x) * sz, y: V3.y + (u34.y + u32.y) * sz };
          return (
            <polyline
              points={`${A.x},${A.y} ${C.x},${C.y} ${B.x},${B.y}`}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="1.4"
            />
          );
        })()}

        {/* Tick X pada sisi miring trapesium (V1-V2 dan V5-V4) */}
        {xTick(V1, V2, "tickL")}
        {xTick(V5, V4, "tickR")}

        {/* Label sisi */}
        {/* 16 cm di tengah sisi V3-V2 */}
        <text x={(V3.x + V2.x) / 2 - 6} y={(V3.y + V2.y) / 2 - 8} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">16 cm</text>
        {/* 5 cm di sisi kanan trapesium */}
        <text x={V5.x + 6} y={(V5.y + V4.y) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold">5 cm</text>
        {/* 12 cm di bawah */}
        <text x={(V1.x + V5.x) / 2} y={V1.y + 18} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">12 cm</text>
      </svg>
    </div>
  );
};

// SVG: Layang-layang ABCD untuk Soal No. 23
// B di atas, D di bawah (diagonal vertikal panjang), A kiri, C kanan (diagonal horizontal pendek)
const LayangLayangABCDSVG = () => {
  const W = 240, H = 300;
  const cx = W / 2;
  const cy = H / 2 - 10; // titik perpotongan diagonal sedikit di atas tengah (BO < OD)

  const B = { x: cx, y: 30 };           // atas
  const D = { x: cx, y: H - 20 };       // bawah
  const A = { x: 30, y: cy };           // kiri
  const C = { x: W - 30, y: cy };       // kanan

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[200px] sm:max-w-[240px] rounded-lg border border-border/40 bg-white/5">
        {/* Diagonal vertikal BD (putus-putus) */}
        <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="5,4" />
        {/* Diagonal horizontal AC (putus-putus) */}
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="5,4" />

        {/* Kontur layang-layang ABCD */}
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`}
          fill="rgba(34,211,238,0.06)"
          stroke="#22d3ee"
          strokeWidth="2"
        />

        {/* Tanda silang kecil di titik potong diagonal */}
        <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="#94a3b8" strokeWidth="1" />
        <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke="#94a3b8" strokeWidth="1" />

        {/* Titik sudut */}
        {[A, B, C, D].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#22d3ee" />
        ))}

        {/* Label titik */}
        <text x={B.x} y={B.y - 8} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">B</text>
        <text x={D.x} y={D.y + 16} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">D</text>
        <text x={A.x - 8} y={A.y + 5} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">A</text>
        <text x={C.x + 8} y={C.y + 5} fill="#ffffff" fontSize="14" fontWeight="bold">C</text>
      </svg>
    </div>
  );
};

// SVG: Jajargenjang ABCD dengan tinggi DE untuk Soal No. 24
const JajargenjangABCDSVG = () => {
  const W = 320, H = 250;

  const A = { x: 30, y: 210 };
  const E = { x: 80, y: 210 };
  const B = { x: 230, y: 210 };
  const D = { x: 80, y: 90 };
  const C = { x: 280, y: 90 };

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        {/* Jajargenjang ABCD */}
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`}
          fill="rgba(34,211,238,0.06)"
          stroke="#22d3ee"
          strokeWidth="2"
        />

        {/* Garis tinggi DE (putus-putus) */}
        <line x1={D.x} y1={D.y} x2={E.x} y2={E.y} stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="5,4" />

        {/* Tanda siku-siku di E */}
        <rect x={E.x} y={E.y - 10} width="10" height="10" fill="none" stroke="#22d3ee" strokeWidth="1.2" />

        {/* Titik sudut */}
        {[A, B, C, D, E].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#22d3ee" />
        ))}

        {/* Label titik */}
        <text x={A.x - 6} y={A.y + 16} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">A</text>
        <text x={B.x + 6} y={B.y + 16} fill="#ffffff" fontSize="14" fontWeight="bold">B</text>
        <text x={C.x + 6} y={C.y - 4} fill="#ffffff" fontSize="14" fontWeight="bold">C</text>
        <text x={D.x - 6} y={D.y - 4} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">D</text>
        <text x={E.x} y={E.y + 16} fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">E</text>

        {/* Label sisi */}
        {/* 20 cm di atas DC */}
        <text x={(D.x + C.x) / 2} y={D.y - 8} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">20 cm</text>
        {/* 13 cm di sisi AD */}
        <text x={(A.x + D.x) / 2 - 8} y={(A.y + D.y) / 2} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">13 cm</text>
        {/* 15 cm di bawah EB */}
        <text x={(E.x + B.x) / 2} y={B.y + 22} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">15 cm</text>
      </svg>
    </div>
  );
};

// SVG: Segitiga siku-siku PQR untuk Soal No. 27 (siku di P, sudut 30° di Q)
const SegitigaPQR30SVG = () => {
  const W = 300, H = 200;

  const P = { x: 40, y: 170 };
  const Q = { x: 260, y: 170 };
  const R = { x: 40, y: 40 };

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        {/* Segitiga PQR */}
        <polygon
          points={`${P.x},${P.y} ${Q.x},${Q.y} ${R.x},${R.y}`}
          fill="rgba(34,211,238,0.08)"
          stroke="#22d3ee"
          strokeWidth="2"
        />

        {/* Tanda siku-siku di P */}
        <rect x={P.x} y={P.y - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />

        {/* Busur sudut 30° di Q */}
        <path d={`M ${Q.x - 28} ${Q.y} A 28 28 0 0 0 ${Q.x - 24.2} ${Q.y - 14}`} fill="none" stroke="#fbbf24" strokeWidth="1.4" />
        <text x={Q.x - 30} y={Q.y - 6} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">30°</text>

        {/* Titik sudut */}
        {[P, Q, R].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#22d3ee" />
        ))}

        {/* Label titik */}
        <text x={P.x - 6} y={P.y + 16} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">P</text>
        <text x={Q.x + 6} y={Q.y + 16} fill="#ffffff" fontSize="14" fontWeight="bold">Q</text>
        <text x={R.x - 6} y={R.y - 4} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">R</text>
      </svg>
    </div>
  );
};

// SVG: Helikopter mengamati 3 titik untuk Soal No. 28
const HelikopterOABCSVG = () => {
  const W = 380, H = 240;

  const O = { x: 40, y: 200 };
  const A = { x: 143, y: 200 };
  const B = { x: 219, y: 200 };
  const C = { x: 350, y: 200 };
  const H_pt = { x: 40, y: 40 }; // posisi helikopter di atas O

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm sm:max-w-md rounded-lg border border-border/40 bg-white/5">
        {/* Garis tanah O→C */}
        <line x1={O.x} y1={O.y} x2={C.x} y2={C.y} stroke="#22d3ee" strokeWidth="2" />
        {/* Garis vertikal H→O (ketinggian) */}
        <line x1={H_pt.x} y1={H_pt.y} x2={O.x} y2={O.y} stroke="#22d3ee" strokeWidth="2" />

        {/* Garis pandang dari helikopter ke A, B, C */}
        <line x1={H_pt.x} y1={H_pt.y} x2={A.x} y2={A.y} stroke="#22d3ee" strokeWidth="1.6" />
        <line x1={H_pt.x} y1={H_pt.y} x2={B.x} y2={B.y} stroke="#22d3ee" strokeWidth="1.6" />
        <line x1={H_pt.x} y1={H_pt.y} x2={C.x} y2={C.y} stroke="#22d3ee" strokeWidth="1.6" />

        {/* Tanda siku-siku di O */}
        <rect x={O.x} y={O.y - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />

        {/* Helikopter (siluet sederhana) */}
        <g transform={`translate(${H_pt.x - 22}, ${H_pt.y - 18})`}>
          {/* badan */}
          <ellipse cx="14" cy="14" rx="14" ry="8" fill="#7c3aed" stroke="#1e1b4b" strokeWidth="1" />
          {/* ekor */}
          <rect x="22" y="12" width="20" height="3" fill="#7c3aed" stroke="#1e1b4b" strokeWidth="0.8" />
          {/* baling-baling atas */}
          <line x1="-4" y1="4" x2="32" y2="4" stroke="#1e1b4b" strokeWidth="1.6" />
          <line x1="14" y1="4" x2="14" y2="6" stroke="#1e1b4b" strokeWidth="1" />
          {/* baling-baling ekor */}
          <line x1="42" y1="9" x2="42" y2="18" stroke="#1e1b4b" strokeWidth="1.2" />
          {/* skid */}
          <line x1="2" y1="22" x2="26" y2="22" stroke="#1e1b4b" strokeWidth="1" />
        </g>

        {/* Label sudut di A, B, C (di sebelah kanan masing-masing titik, sedikit di atas garis tanah) */}
        <text x={A.x + 4} y={A.y - 6} fill="#fbbf24" fontSize="12" fontWeight="bold">60°</text>
        <text x={B.x + 4} y={B.y - 6} fill="#fbbf24" fontSize="12" fontWeight="bold">45°</text>
        <text x={C.x - 6} y={C.y - 6} fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="end">30°</text>

        {/* Label "500 m" di samping garis tinggi */}
        <text x={H_pt.x - 6} y={(H_pt.y + O.y) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="end">500 m</text>

        {/* Titik & label O, A, B, C */}
        {[O, A, B, C].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#22d3ee" />
        ))}
        <text x={O.x - 6} y={O.y + 18} fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="end">O</text>
        <text x={A.x} y={A.y + 18} fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">A</text>
        <text x={B.x} y={B.y + 18} fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">B</text>
        <text x={C.x + 6} y={C.y + 18} fill="#ffffff" fontSize="13" fontWeight="bold">C</text>
      </svg>
    </div>
  );
};

// SVG: Segitiga ABC dengan titik D di AB untuk Soal No. 29
// Siku-siku di B, BC = 5 cm, ∠A = 30°, ∠CDB = 45°
const SegitigaABCD30_45_SVG = () => {
  const W = 350, H = 240;

  const A = { x: 30, y: 200 };
  const B = { x: 310, y: 200 };
  const C = { x: 310, y: 60 };
  const D = { x: 170, y: 200 };

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm sm:max-w-md rounded-lg border border-border/40 bg-white/5">
        {/* Segitiga ABC besar */}
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
          fill="rgba(34,211,238,0.06)"
          stroke="#22d3ee"
          strokeWidth="2"
        />
        {/* Garis bantu DC (di dalam segitiga, menghubungkan D ke C) */}
        <line x1={D.x} y1={D.y} x2={C.x} y2={C.y} stroke="#22d3ee" strokeWidth="1.6" />

        {/* Tanda siku-siku di B */}
        <rect x={B.x - 12} y={B.y - 12} width="12" height="12" fill="none" stroke="#22d3ee" strokeWidth="1.2" />

        {/* Busur sudut 30° di A */}
        <path d={`M ${A.x + 24} ${A.y} A 24 24 0 0 0 ${A.x + 20.78} ${A.y - 12}`} fill="none" stroke="#fbbf24" strokeWidth="1.4" />
        <text x={A.x + 26} y={A.y - 4} fill="#fbbf24" fontSize="12" fontWeight="bold">30°</text>

        {/* Busur sudut 45° di D (antara DA→DC) */}
        <path d={`M ${D.x - 22} ${D.y} A 22 22 0 0 0 ${D.x - 15.56} ${D.y - 15.56}`} fill="none" stroke="#fbbf24" strokeWidth="1.4" />
        <text x={D.x - 24} y={D.y - 6} fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="end">45°</text>

        {/* Label "5 cm" di samping BC */}
        <text x={B.x + 6} y={(B.y + C.y) / 2 + 4} fill="#fbbf24" fontSize="13" fontWeight="bold">5 cm</text>

        {/* Titik sudut */}
        {[A, B, C, D].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#22d3ee" />
        ))}

        {/* Label titik */}
        <text x={A.x - 6} y={A.y + 6} fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="end">A</text>
        <text x={B.x + 6} y={B.y + 18} fill="#ffffff" fontSize="14" fontWeight="bold">B</text>
        <text x={C.x + 6} y={C.y - 4} fill="#ffffff" fontSize="14" fontWeight="bold">C</text>
        <text x={D.x} y={D.y + 18} fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">D</text>
      </svg>
    </div>
  );
};

// Helper function to render text with LaTeX
const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.slice(1, -1);
      return <InlineMath key={index} math={latex} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const materiSection = {
  title: "MATERI - TEOREMA PYTHAGORAS",
  sections: [
    {
      heading: "A. Konsep Dasar Pythagoras",
      content: `1. Kuadrat bilangan
$a^2 = a \\times a$ atau $a^2 = (-a) \\times (-a)$

2. Akar dari bilangan pada konsep Teorema Pythagoras diambil yang hasilnya positif karena sisi pada segitiga adalah bilangan positif.
$x^2 = p^2$ maka $x = p$
$x^2 = p$ maka $x = \\sqrt{p}$
$\\sqrt{a^2p} = a\\sqrt{p}$

3. Jika a, b, c merupakan sisi segitiga dan c merupakan sisi yang paling panjang, maka untuk membuat suatu segitiga harus dipenuhi syarat:
$c < a + b$

4. Jika a, b, c merupakan sisi segitiga dan c paling panjang:
$c^2 > a^2 + b^2$ : segitiga tumpul di C
$c^2 = a^2 + b^2$ : segitiga siku-siku di C
$c^2 < a^2 + b^2$ : segitiga lancip di C`
    },
    {
      heading: "B. Teorema Pythagoras",
      content: `Diketahui segitiga siku-siku dengan sisi terpanjang c (sisi miring yang berhadapan dengan sudut siku-siku), sisi tegak a dan b, maka berlaku:

"Sisi terpanjang (sisi miring) kuadrat sama dengan jumlah kuadrat sisi-sisi lainnya."

$c^2 = a^2 + b^2$`
    },
    {
      heading: "C. Jarak Antara 2 Titik Koordinat",
      content: `$|PQ| = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$

$|PQ|$: jarak titik P dan Q`
    },
    {
      heading: "D. Sudut Khusus pada Segitiga Siku-siku",
      content: `1. Sudut $30°$ dan $60°$
Pada segitiga siku-siku dengan sudut $30°$, $60°$, dan $90°$:
- Sisi di depan sudut $30°$ = $\\frac{1}{2}$ sisi miring
- Sisi di depan sudut $60°$ = $\\frac{\\sqrt{3}}{2}$ sisi miring

2. Sudut $45°$
Pada segitiga siku-siku sama kaki dengan sudut $45°$, $45°$, dan $90°$:
- Kedua sisi tegak sama panjang
- Sisi miring = $\\sqrt{2}$ kali sisi tegak`
    },
    {
      heading: "E. Aplikasi pada Kehidupan",
      content: `Teorema Pythagoras diperlukan dalam menghitung keliling atau luas suatu bangun datar dan aplikasinya; panjang kerangka, luas permukaan, dan volume bangun ruang dan aplikasinya; serta digunakan juga dalam beberapa perhitungan dalam bidang fisika.`
    },
    {
      heading: "F. Tripel Pythagoras",
      content: `Tripel Pythagoras adalah 3 bilangan asli yang memenuhi teorema Pythagoras. Artinya, jika terdapat 3 bilangan asli maka kuadrat bilangan terbesar sama dengan jumlah kuadrat dua bilangan lainnya.

Berikut ini adalah 5 tipe tripel Pythagoras yang sering digunakan dalam perhitungan beserta kelipatannya:

Tipe 1: 3, 4, 5 | 6, 8, 10 | 9, 12, 15 | ... kelipatannya
Tipe 2: 5, 12, 13 | 10, 24, 26 | 15, 36, 39 | ... kelipatannya
Tipe 3: 7, 24, 25 | 14, 48, 50 | 21, 72, 75 | ... kelipatannya
Tipe 4: 8, 15, 17 | 16, 30, 34 | 24, 45, 51 | ... kelipatannya
Tipe 5: 9, 40, 41 | 18, 80, 82 | 27, 120, 123 | ... kelipatannya`
    }
  ]
};

const latihanDasar = [
  { no: 1, soal: "Diketahui ukuran segitiga:\ni. 1 cm, 1 cm, 1 cm\nii. 8 cm, 10 cm, 18 cm\niii. 12 cm, 21 cm, 8 cm\niv. 5 cm, 12 cm, 15 cm\nYang dapat membentuk suatu segitiga adalah ....", options: ["A. i dan iii", "B. iii dan iv", "C. i, iii dan iv", "D. i dan iv"] },
  { no: 2, soal: "Diketahui ukuran berikut:\ni. 2 cm, 2 cm, 2 cm\nii. 6 cm, 8 cm, 14 cm\niii. 7 cm, 15 cm, 25 cm\niv. 5 cm, 12 cm, 15 cm\nYang merupakan sisi pada segitiga adalah ..", options: ["A. i dan ii", "B. i dan iv", "C. ii dan iv", "D. iv saja"] },
  { no: 3, soal: "Perhatikan gambar! Dari pernyataan berikut yang benar adalah ....", options: ["A. $p = \\sqrt{r^2 + q^2}$", "B. $q = \\sqrt{r^2 - p^2}$", "C. $p = \\sqrt{q^2 - r^2}$", "D. $q = \\sqrt{r^2 + p^2}$"] },
  { no: 4, soal: "Panjang AC adalah..", options: ["A. 24 cm", "B. 28 cm", "C. 30 cm", "D. 32 cm"] },
  { no: 5, soal: "Perhatikan gambar! Panjang AD adalah....", options: ["A. 15 cm", "B. 17 cm", "C. 24 cm", "D. 25 cm"] },
  { no: 6, soal: "Perhatikan gambar berikut! Panjang BD adalah....", options: ["A. 12 cm", "B. 18 cm", "C. 18 cm", "D. 40 cm"] },
  { no: 7, soal: "Perhatikan gambar berikut! Keliling bangun ABCDE adalah....", options: ["A. 56 cm", "B. 74 cm", "C. 59 cm", "D. 86 cm"] },
  { no: 8, soal: "Perhatikan sisi-sisi segitiga di bawah\ni. 8, 15, dan 18\nii. 7, 24, dan 25\niii. 12, 15, dan 20\niv. 9, 12, dan 15\nYang merupakan tripel Pythagoras pada sisi-sisi segitiga diatas adalah...", options: ["A. i dan ii", "B. ii dan iii", "C. ii dan iv", "D. i dan iv"] },
  { no: 9, soal: "Besar kedua sudut segitiga $40°$ dan $70°$. Ditinjau dari panjang sisi dan besar sudutnya, jenis segitiga tersebut adalah....", options: ["A. segitiga lancip sama kaki", "B. segitiga siku-siku sama kaki", "C. segitiga tumpul sama kaki", "D. segitiga tumpul sembarang"] },
  { no: 10, soal: "Diketahui panjang sisi-sisi pada segitiga sebagai berikut:\n(1). 3 cm, 4 cm, 5 cm\n(2). 6 cm, 7 cm, 10 cm\n(3). 4 cm, 5 cm, 6 cm\n(4). 6 cm, 8 cm, 12 cm\nPanjang sisi-sisi diatas yang dapat membentuk segitiga tumpul adalah ...", options: ["A. (1) dan (2)", "B. (2) dan (3)", "C. (3) dan (4)", "D. (2) dan (4)"] },
  { no: 11, soal: "Perhatikan tabel berikut.\nPada tabel tersebut, segitiga yang merupakan segitiga siku-siku adalah .......", options: ["A. $\\triangle ABC$", "B. $\\triangle DEF$", "C. $\\triangle KLM$", "D. $\\triangle PQR$"] },
  { no: 12, soal: "Suatu segitiga mempunyai ukuran sisi-sisinya 8 cm, 15 cm, dan 20 cm. Segitiga tersebut merupakan jenis segitiga ....", options: ["A. lancip", "B. tumpul", "C. siku-siku", "D. sama kaki"] },
  { no: 13, soal: "Diketahui ukuran segitiga:\ni. 2 cm, 2 cm, 2 cm\nii. 6 cm, 8 cm, 14 cm\niii. 7 cm, 24 cm, 25 cm\niv. 5 cm, 12 cm, 15 cm\nYang merupakan segitiga tumpul adalah ..", options: ["A. i dan ii", "B. i dan iv", "C. ii dan iv", "D. iv saja"] },
  { no: 14, soal: "Diketahui sebuah segitiga memiliki sudut $45°$ dan $100°$, maka jika ditinjau dari sisinya dan sudut segitiga tersebut adalah......", options: ["A. Segitiga tumpul sama kaki", "B. Segitiga tumpul sebarang", "C. Segitiga lancip sama sisi", "D. Segitiga siku-siku sama kaki"] },
  { no: 15, soal: "Pernyataan yang benar untuk gambar di bawah adalah ...", options: ["A. $x = 6$ cm", "B. $x = 7$ cm", "C. luas segitiga $= 48$ cm$^2$", "D. keliling segitiga $= 21$ cm"] },
  { no: 16, soal: "Diketahui keliling belah ketupat 52 cm dan salah satu diagonalnya 24 cm. Luas belah ketupat ABCD adalah....", options: ["A. 312 cm$^2$", "B. 274 cm$^2$", "C. 240 cm$^2$", "D. 120 cm$^2$"] },
  { no: 17, soal: "Panjang diagonal dan lebar sebuah persegi panjang berturut-turut adalah 15 cm dan 9 cm. Panjang persegi panjang tersebut adalah ......", options: ["A. 8 cm", "B. 10 cm", "C. 12 cm", "D. 14 cm"] },
  { no: 18, soal: "Perhatikan gambar berikut.\nDari gambar diatas, berapa kira-kira panjang tali layar dari layang-layang agar layar tersebut menarik kapal pada sudut $45°$ dan berada pada ketinggian vertikal 150 m, seperti diperlihatkan pada gambar?", options: ["A. 175 m", "B. 212 m", "C. 285 m", "D. 300 m"] },
  { no: 19, soal: "Sebuah kapal berlayar dari pelabuhan Ambu menuju arah barat sejauh 100 mil ke pelabuhan Beta. Dari Beta ke arah selatan sejauh 50 mil menuju pelabuhan Cinta. Dari Cinta ke arah timur sejauh 170 mil ke pelabuhan Delta. Dari Delta ke arah utara sejauh 290 mil menuju pelabuhan Eco. Jarak terdekat dari pelabuhan Ambu ke pelabuhan Eco adalah...", options: ["A. 130 mil", "B. 170 mil", "C. 250 mil", "D. 260 mil"] },
  { no: 20, soal: "Perhatikan gambar.\nDiketahui AB = 15 cm, AF = 10 cm, BD = 12 cm. Luas bangun tersebut adalah ...", options: ["A. 140 cm$^2$", "B. 216 cm$^2$", "C. 250 cm$^2$", "D. 302 cm$^2$"] },
  { no: 21, soal: "Perhatikan gambar berikut.\nLuas daerah di atas adalah", options: ["A. 48 cm$^2$", "B. 98 cm$^2$", "C. 120 cm$^2$", "D. 144 cm$^2$"] },
  { no: 22, soal: "Kebun berbentuk belah ketupat dengan panjang masing-masing diagonalnya 12 m dan 16 m. Di sekeliling kebun akan ditanami pohon dengan jarak antar pohon 2 m.\nBanyaknya seluruh pohon adalah", options: ["A. 14 pohon", "B. 20 pohon", "C. 28 pohon", "D. 56 pohon"] },
  { no: 23, soal: "Perhatikan gambar layang-layang ABCD di bawah ini.\nJika panjang AC = 24 cm, panjang AB = 13 cm dan panjang AD = 20 cm. Hitunglah luas bangun layang-layang di atas!", options: [] },
  { no: 24, soal: "Perhatikan bangun datar jajargenjang ABCD di bawah ini.\nJika diketahui panjang AD = 13 cm, CD = 20 cm, dan BE = 15 cm. Hitunglah luas jajargenjang ABCD tersebut.", options: [] },
  { no: 25, soal: "Sebidang tanah berbentuk trapesium sama kaki, panjang sisi sejajarnya 24 m dan 14 m, dan jarak sisi sejajar 12 m. Jika sekeliling tanah tersebut dibuat pagar, panjang pagar seluruhnya adalah...", options: ["A. 50 m", "B. 51 m", "C. 62 m", "D. 64 m"] },
  { no: 26, soal: "Seseorang berada di atas gedung yang tingginya 12 m. Dia melihat dua buah benda A dan benda B di tanah dengan arah yang sama. Jika jarak pandang orang tersebut dengan benda A adalah 15 m dan dengan benda B adalah 20 m, maka jarak benda A dan benda B di tanah adalah...", options: ["A. 7 m", "B. 9 m", "C. 12 m", "D. 16 m"] },
  { no: 27, soal: "Pada gambar di bawah, jika panjang PR = 12 cm maka panjang QR dan PQ adalah ...", options: [] },
  { no: 28, soal: "Sebuah Helikopter terbang pada ketinggian 500 m di atas permukaan tanah. Helikopter tersebut melihat tiga titik di atas permukaan tanah, yaitu titik A, titik B, dan titik C.\nTentukanlah:\n1. jarak OA\n2. jarak AB\n3. jarak BC", options: [] },
  { no: 29, soal: "Perhatikan gambar berikut.\nTentukanlah panjang sisi AB, AC, dan CD", options: [] },
  { no: 30, soal: "Hitunglah jarak antara titik $A(3, -2)$ dan titik $B(-5, 4)$ pada bidang koordinat Kartesius.", options: ["A. 8", "B. 10", "C. $10\\sqrt{2}$", "D. $\\sqrt{52}$"] },
  { no: 31, soal: "Jarak antara titik $P(k, 5)$ dan titik $Q(1, 1)$ adalah 5 satuan. Berapakah nilai k yang mungkin?", options: ["A. $k = 5$", "B. $k = 3$", "C. $k = -2$", "D. $k = 6$"] },
  { no: 32, soal: "Tiga titik di bidang koordinat adalah $K(2, 5)$, $L(6, 1)$, dan $M(10, 5)$. Tentukan jenis segitiga $\\triangle KLM$ dilihat dari panjang sisi-sisinya.", options: ["A. Segitiga Sembarang", "B. Segitiga Sama Kaki", "C. Segitiga Siku-siku", "D. Segitiga Sama Sisi"] },
  { no: 33, soal: "Titik $R(x, 0)$ terletak pada sumbu-x dan berjarak sama dari titik $A(2, 3)$ dan titik $B(5, -2)$. Berapakah koordinat titik R?", options: ["A. $R(4, 0)$", "B. $R(2, 0)$", "C. $R(3, 0)$", "D. $R\\left(\\frac{8}{3}, 0\\right)$"] },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2003 Tingkat Kota\nPerhatikan gambar berikut. Panjang CP adalah ...", options: [] },
  { no: 2, soal: "OSN Matematika 2006 Tingkat Kota\nJika panjang diagonal suatu persegi adalah 4 cm, maka luas persegi itu (dalam cm$^2$) adalah", options: ["A. 2", "B. 4", "C. 6", "D. 8", "E. 16"] },
  { no: 3, soal: "OSN Matematika 2006 Tingkat Kota\nMisalkan a, b dan c adalah panjang sisi-sisi suatu segitiga dengan a, b dan c berupa bilangan asli berurutan yang rata-rata hitungnya 6. Jika ditarik garis tinggi terhadap sisi yang panjangnya b, maka panjang garis tinggi tersebut adalah ...", options: ["A. $\\sqrt{66}$", "B. $\\sqrt{46}$", "C. $\\sqrt{26}$", "D. $\\sqrt{42}$", "E. $\\sqrt{22}$"] },
  { no: 4, soal: "OSN Matematika 2006 Tingkat Kota\nPerhatikan gambar di bawah ini. Jika panjang AB = 2 cm, panjang CD = 3 cm dan panjang AC = 9 cm, maka panjang BC adalah ...", options: [] },
  { no: 5, soal: "OSN Matematika 2006 Tingkat Kota\nPerhatikan gambar di bawah ini. Jika panjang AB = 3 cm, panjang AD = 8 cm, panjang CD = 5 cm dan titik E terletak pada ruas garis BC, maka panjang minimal dari $AE + ED$ adalah ...", options: [] },
  { no: 6, soal: "OSN Matematika 2007 Tingkat Kota\nKota A terletak 50 km di sebelah utara kota B, dan kota C terletak 120 km di sebelah timur kota B dan kota D terletak di tengah antara kota A dan C. Jarak kota D dari kota A adalah ...", options: [] },
  { no: 7, soal: "OSN Matematika 2009 Tingkat Kota\nDiketahui koordinat segi empat ABCD adalah $A(0,0)$, $B(30,0)$, $C(0,40)$, $D(30,40)$. Titik E dan F masing-masing membagi sisi CD dan AC menjadi dua bagian sama panjang. Jika pada segitiga CEG dibuat lingkaran dalam, koordinat titik pusat lingkaran adalah", options: ["A. $(5, 35)$", "B. $(35, 5)$", "C. $(7\\frac{1}{2}, 10)$", "D. $(10, 7\\frac{1}{2})$"] },
  { no: 8, soal: "OSN Matematika 2010 Tingkat Kota\nSebuah perahu motor meninggalkan kapal induk ke arah utara menuju suatu target dengan kecepatan tetap 80 km/jam. Kapal induk bergerak ke arah timur dengan kecepatan tetap 40 km/jam. Apabila perahu motor tersebut hanya mempunyai bahan bakar yang cukup untuk berjalan 4 jam saja, tentukan jarak maksimum target yang dapat ditujunya agar ia dapat kembali ke kapal induk tanpa masalah ... km", options: [] },
  { no: 9, soal: "OSN Matematika 2012 Tingkat Kota\nJika segitiga ABC siku-siku di B, AB = 6, AC = 10 dan AD adalah garis bagi sudut BAC, maka panjang AD adalah ...", options: [] },
  { no: 10, soal: "OSN Matematika 2015 Tingkat Kota\nDiketahui ABCD adalah trapesium, AB sejajar CD, dan $AB + CD = BC$. Jika panjang AD = 12, maka nilai $AB \\times CD$ adalah ...", options: ["A. 46", "B. 42", "C. 38", "D. 36"] },
  { no: 11, soal: "OSN Matematika 2021 Tingkat Kota\nPerbandingan panjang kaki sudut siku-siku sebuah segitiga siku-siku adalah 2 : 3. Jika panjang sisi miring segitiga tersebut $5\\sqrt{13}$, maka luas segitiga siku-siku tersebut adalah ...", options: ["A. 12", "B. 27", "C. 48", "D. 75"] },
  { no: 12, soal: "OSN Matematika 2023 Tingkat Kota\nDiketahui segitiga ABC dengan panjang sisi AB = 20 cm. Titik P berada pada sisi AB sehingga AP = BP = CP. Luas daerah segitiga APC adalah 30 cm$^2$. Jika jarak titik P ke sisi BC adalah d cm, maka nilai terbesar dari $d^2$ yang mungkin adalah ...", options: [] },
];

const OlimpiadeTeoremaPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - TEOREMA PYTHAGORAS
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "Materi" },
            { key: "dasar" as const, label: "Latihan Dasar" },
            { key: "olimpiade" as const, label: "Latihan Olimpiade" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`font-display text-xs px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                activeTab === tab.key
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-white/70 border-border hover:border-accent/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Materi Tab */}
        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSection.sections.map((section, idx) => (
              <div
                key={idx}
                className="backdrop-blur border rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(30,41,59,0.75) 0%, rgba(15,23,42,0.85) 100%)",
                  borderColor: expandedSections.includes(idx) ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)",
                  boxShadow: expandedSections.includes(idx)
                    ? "0 0 24px rgba(251,191,36,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.35)" }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-display text-sm text-accent font-bold group-hover:text-yellow-300 transition-colors">
                      {section.heading}
                    </span>
                  </div>
                  {expandedSections.includes(idx)
                    ? <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 animate-slide-up">
                    <div className="font-body text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                      {idx === 1 && <PythagorasSegitigaSVG />}
                      {idx === 2 && <JarakDuaTitikSVG />}
                      {section.content.split('\n').map((line, i) => {
                        const trimmed = line.trim();
                        if (/^\d+\. [A-Z]/.test(trimmed)) {
                          return (
                            <div key={i}>
                              <div className="mt-4 mb-1 font-bold text-yellow-400 text-sm">{renderWithLatex(trimmed)}</div>
                              {idx === 3 && trimmed.startsWith('1.') && <Segitiga306090SVG />}
                              {idx === 3 && trimmed.startsWith('2.') && <Segitiga454590SVG />}
                            </div>
                          );
                        }
                        if (/^Rumus/.test(trimmed)) {
                          return <div key={i} className="mt-3 mb-1 font-semibold text-yellow-300 text-xs uppercase tracking-wide">{renderWithLatex(trimmed)}</div>;
                        }
                        const tipeMatch = trimmed.match(/^(Tipe \d+):\s*(.*)$/);
                        if (tipeMatch) {
                          return (
                            <div key={i} className="mt-3 mb-2">
                              <div className="font-bold text-yellow-400 text-sm">{tipeMatch[1]}</div>
                              <div className="mt-1 text-white/85 text-sm">{tipeMatch[2]}</div>
                            </div>
                          );
                        }
                        if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length > 2) {
                          return (
                            <div key={i} className="my-3 px-4 py-3 rounded-xl border-2 border-cyan-400/60 bg-cyan-950/40 text-center font-bold text-white text-base shadow-lg shadow-cyan-900/30">
                              <span className="block text-[10px] text-cyan-400 font-semibold uppercase tracking-widest mb-1">Rumus Penting</span>
                              {renderWithLatex(trimmed)}
                            </div>
                          );
                        }
                        if (trimmed === '') return <div key={i} className="h-2" />;
                        return <div key={i} className="mb-1">{renderWithLatex(line)}</div>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Dasar Tab */}
        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                {soal.no === 18 ? (
                  <>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      <span className="text-accent font-bold">{soal.no}.</span> {renderWithLatex(soal.soal.split('\n')[0])}
                    </div>
                    <div className="flex justify-center my-3">
                      <img
                        src={layangKapalSoal18Img}
                        alt="Layang-layang menarik kapal pada sudut 45° dan ketinggian 150 m"
                        className="max-w-xs w-full h-auto rounded-lg bg-white p-2"
                        data-testid="img-soal-pyth-dasar-18"
                      />
                    </div>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      {soal.soal.split('\n').slice(1).map((line, lineIdx) => (
                        <span key={lineIdx}>
                          {lineIdx > 0 && <br />}
                          {renderWithLatex(line)}
                        </span>
                      ))}
                    </div>
                  </>
                ) : soal.no === 20 ? (
                  <>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      <span className="text-accent font-bold">{soal.no}.</span> {renderWithLatex(soal.soal.split('\n')[0])}
                    </div>
                    <div className="flex justify-center my-3">
                      <img
                        src={bangunABEFCDSoal20Img}
                        alt="Bangun ABEFCD soal nomor 20"
                        className="max-w-xs w-full h-auto rounded-lg bg-white p-2"
                        data-testid="img-soal-pyth-dasar-20"
                      />
                    </div>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      {soal.soal.split('\n').slice(1).map((line, lineIdx) => (
                        <span key={lineIdx}>
                          {lineIdx > 0 && <br />}
                          {renderWithLatex(line)}
                        </span>
                      ))}
                    </div>
                  </>
                ) : soal.no === 21 ? (
                  <>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      <span className="text-accent font-bold">{soal.no}.</span> {renderWithLatex(soal.soal.split('\n')[0])}
                    </div>
                    <div className="flex justify-center my-3">
                      <img
                        src={pentagonSoal21Img}
                        alt="Pentagon dengan sisi 16 cm, 12 cm, 5 cm dan 3 cm soal nomor 21"
                        className="max-w-xs w-full h-auto rounded-lg bg-white p-2"
                        data-testid="img-soal-pyth-dasar-21"
                      />
                    </div>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      {soal.soal.split('\n').slice(1).map((line, lineIdx) => (
                        <span key={lineIdx}>
                          {lineIdx > 0 && <br />}
                          {renderWithLatex(line)}
                        </span>
                      ))}
                    </div>
                  </>
                ) : soal.no === 29 ? (
                  <>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      <span className="text-accent font-bold">{soal.no}.</span> {renderWithLatex(soal.soal.split('\n')[0])}
                    </div>
                    <div className="flex justify-center my-3">
                      <img
                        src={segitigaABCD30_45_Soal29Img}
                        alt="Segitiga ABCD dengan sudut 30°, 45° dan tinggi 5 cm soal nomor 29"
                        className="max-w-xs w-full h-auto rounded-lg bg-white p-2"
                        data-testid="img-soal-pyth-dasar-29"
                      />
                    </div>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      {soal.soal.split('\n').slice(1).map((line, lineIdx) => (
                        <span key={lineIdx}>
                          {lineIdx > 0 && <br />}
                          {renderWithLatex(line)}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                    <span className="text-accent font-bold">{soal.no}.</span> {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                )}
                {soal.no === 3 && <SegitigaPQRSVG />}
                {soal.no === 4 && <SegitigaABC182430SVG />}
                {soal.no === 5 && <SegitigaABD72425SVG />}
                {soal.no === 6 && <SegitigaCABD9_15_41_SVG />}
                {soal.no === 7 && (
                  <div className="flex justify-center my-3">
                    <img
                      src={bangunABCDESoal7Img}
                      alt="Bangun ABCDE soal nomor 7"
                      className="max-w-xs w-full h-auto rounded-lg bg-white p-2"
                      data-testid="img-soal-pyth-dasar-7"
                    />
                  </div>
                )}
                {soal.no === 11 && <TabelSegitiga11 />}
                {soal.no === 15 && <SegitigaXSVG />}
                {soal.no === 23 && <LayangLayangABCDSVG />}
                {soal.no === 24 && <JajargenjangABCDSVG />}
                {soal.no === 27 && <SegitigaPQR30SVG />}
                {soal.no === 28 && <HelikopterOABCSVG />}
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {teoremaPythagorasDasarPembahasan[soal.no] && (
                  <PembahasanCard pembahasanKey={`pyth-dasar-${soal.no}`} pembahasan={teoremaPythagorasDasarPembahasan[soal.no]} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Olimpiade Tab */}
        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                {soal.no === 1 ? (
                  <>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      <span className="text-accent font-bold">{soal.no}.</span>{" "}
                      <span className="text-yellow-400 font-semibold">OSN Matematika 2003 Tingkat Kota</span>
                      <br />
                      Perhatikan gambar berikut.
                    </div>
                    <div className="flex justify-center my-3">
                      <img
                        src={persegiPanjangABCDSoalOlim1Img}
                        alt="Persegi panjang ABCD dengan titik P di dalamnya soal olimpiade nomor 1"
                        className="max-w-xs w-full h-auto rounded-lg bg-white p-2"
                        data-testid="img-soal-pyth-olim-1"
                      />
                    </div>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      Panjang CP adalah ...
                    </div>
                  </>
                ) : soal.no === 4 ? (
                  <>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      <span className="text-accent font-bold">{soal.no}.</span>{" "}
                      <span className="text-yellow-400 font-semibold">OSN Matematika 2006 Tingkat Kota</span>
                      <br />
                      Perhatikan gambar di bawah ini.
                    </div>
                    <div className="flex justify-center my-3">
                      <img
                        src={bangunABCDSoalOlim4Img}
                        alt="Bangun ABCD dengan titik B, C, D, A soal olimpiade nomor 4"
                        className="max-w-xs w-full h-auto rounded-lg bg-white p-2"
                        data-testid="img-soal-pyth-olim-4"
                      />
                    </div>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      Jika panjang AB = 2 cm, panjang CD = 3 cm dan panjang AC = 9 cm, maka panjang BC adalah ...
                    </div>
                  </>
                ) : soal.no === 5 ? (
                  <>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      <span className="text-accent font-bold">{soal.no}.</span>{" "}
                      <span className="text-yellow-400 font-semibold">OSN Matematika 2006 Tingkat Kota</span>
                      <br />
                      Perhatikan gambar di bawah ini.
                    </div>
                    <div className="flex justify-center my-3">
                      <img
                        src={bangunABCDSoalOlim5Img}
                        alt="Bangun ABCD dengan titik A, B, C, D soal olimpiade nomor 5"
                        className="max-w-xs w-full h-auto rounded-lg bg-white p-2"
                        data-testid="img-soal-pyth-olim-5"
                      />
                    </div>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      {renderWithLatex("Jika panjang AB = 3 cm, panjang AD = 8 cm, panjang CD = 5 cm dan titik E terletak pada ruas garis BC, maka panjang minimal dari $AE + ED$ adalah ...")}
                    </div>
                  </>
                ) : (
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                    <span className="text-accent font-bold">{soal.no}.</span> {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                )}
                {soal.no === 6 && (
                  <div className="flex justify-center my-3">
                    <img
                      src={segitigaABCSoalOlim6Img}
                      alt="Segitiga ABC dengan sisi AB 50 km dan BC 120 km, titik D di tengah AC, soal olimpiade nomor 6"
                      className="max-w-xs w-full h-auto rounded-lg bg-white p-2"
                      data-testid="img-soal-pyth-olim-6"
                    />
                  </div>
                )}
                {soal.no === 10 && (
                  <div className="flex justify-center my-3">
                    <img
                      src={trapesiumABCDSoalOlim10Img}
                      alt="Trapesium ABCD dengan AB sejajar CD soal olimpiade nomor 10"
                      className="max-w-xs w-full h-auto rounded-lg bg-white p-2"
                      data-testid="img-soal-pyth-olim-10"
                    />
                  </div>
                )}
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {teoremaPythagorasOlimpiadePembahasan[soal.no] && (
                  <PembahasanCard pembahasanKey={`pyth-olim-${soal.no}`} pembahasan={teoremaPythagorasOlimpiadePembahasan[soal.no]} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadeTeoremaPage;
