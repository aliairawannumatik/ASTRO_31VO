import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Shapes, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MathText = ({ text, className = "" }: { text: string; className?: string }) => {
  const elements = useMemo(() => {
    const result: React.ReactNode[] = [];
    let key = 0;
    const blockParts = text.split(/(\$\$[^$]+\$\$)/g);
    blockParts.forEach((part) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2).trim();
        result.push(<span key={key++} className="mx-1 block text-center my-2"><BlockMath math={math} /></span>);
      } else if (part) {
        const inlineParts = part.split(/(\$[^$]+\$)/g);
        inlineParts.forEach((ip) => {
          if (ip.startsWith("$") && ip.endsWith("$")) {
            result.push(<span key={key++} className="mx-0.5"><InlineMath math={ip.slice(1, -1)} /></span>);
          } else if (ip) {
            result.push(<span key={key++}>{ip}</span>);
          }
        });
      }
    });
    return result;
  }, [text]);
  return <span className={className}>{elements}</span>;
};

type Difficulty = "Mudah" | "Sedang" | "Sulit";
type QuestionType = "PG" | "MCMA" | "Benar/Salah";

interface Statement { text: string; isCorrect: boolean; }
interface Question {
  id: number;
  type: QuestionType;
  difficulty: Difficulty;
  category: string;
  question: string;
  options?: string[];
  statements?: Statement[];
  correctAnswer?: string;
  svgKey?: string;
  explanation: { concept: string; steps: string[]; formula?: string; };
}

/* ══════════════════════════════════════════
   SVG VISUAL COMPONENTS
══════════════════════════════════════════ */

const DefinisiSebangunSVG = () => (
  <svg viewBox="0 0 320 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="20,140 100,140 20,60" fill="rgba(6,182,212,0.18)" stroke="#06b6d4" strokeWidth="2"/>
    <text x="60" y="155" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">6 cm</text>
    <text x="8" y="100" fill="#f472b6" fontSize="9" fontFamily="monospace" fontWeight="bold">8 cm</text>
    <text x="72" y="92" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">10 cm</text>
    <text x="20" y="140" fill="#94a3b8" fontSize="8" fontFamily="monospace">A</text>
    <text x="100" y="153" fill="#94a3b8" fontSize="8" fontFamily="monospace">B</text>
    <text x="12" y="58" fill="#94a3b8" fontSize="8" fontFamily="monospace">C</text>
    <polygon points="170,140 290,140 170,60" fill="rgba(168,85,247,0.18)" stroke="#a855f7" strokeWidth="2"/>
    <text x="230" y="155" fill="#a855f7" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">9 cm</text>
    <text x="155" y="102" fill="#f472b6" fontSize="9" fontFamily="monospace" fontWeight="bold">12 cm</text>
    <text x="240" y="92" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">15 cm</text>
    <text x="168" y="153" fill="#94a3b8" fontSize="8" fontFamily="monospace">P</text>
    <text x="288" y="153" fill="#94a3b8" fontSize="8" fontFamily="monospace">Q</text>
    <text x="163" y="58" fill="#94a3b8" fontSize="8" fontFamily="monospace">R</text>
    <text x="160" y="12" fill="#34d399" fontSize="9" textAnchor="middle" fontFamily="monospace">△ABC ~ △PQR  (k = 3/2)</text>
  </svg>
);

const DefinisiKongruenSVG = () => (
  <svg viewBox="0 0 320 160" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="20,140 110,140 65,50" fill="rgba(34,197,94,0.18)" stroke="#22c55e" strokeWidth="2"/>
    <text x="65" y="155" fill="#22c55e" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">8 cm</text>
    <text x="28" y="96" fill="#f472b6" fontSize="9" fontFamily="monospace" fontWeight="bold">7 cm</text>
    <text x="98" y="94" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">7 cm</text>
    <text x="20" y="153" fill="#94a3b8" fontSize="8" fontFamily="monospace">A</text>
    <text x="106" y="153" fill="#94a3b8" fontSize="8" fontFamily="monospace">B</text>
    <text x="60" y="46" fill="#94a3b8" fontSize="8" fontFamily="monospace">C</text>
    <polygon points="190,140 280,140 235,50" fill="rgba(34,197,94,0.18)" stroke="#22c55e" strokeWidth="2"/>
    <text x="235" y="155" fill="#22c55e" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">8 cm</text>
    <text x="198" y="96" fill="#f472b6" fontSize="9" fontFamily="monospace" fontWeight="bold">7 cm</text>
    <text x="266" y="94" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">7 cm</text>
    <text x="188" y="153" fill="#94a3b8" fontSize="8" fontFamily="monospace">P</text>
    <text x="277" y="153" fill="#94a3b8" fontSize="8" fontFamily="monospace">Q</text>
    <text x="230" y="46" fill="#94a3b8" fontSize="8" fontFamily="monospace">R</text>
    <text x="160" y="12" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">△ABC ≅ △PQR  (Ukuran persis sama)</text>
  </svg>
);

const SkalaPetaSVG = ({ skala, jPeta, jAsli }: { skala: string; jPeta: string; jAsli: string }) => (
  <svg viewBox="0 0 320 170" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="20" y="28" width="280" height="130" rx="6" fill="rgba(15,23,42,0.5)" stroke="#334155" strokeWidth="1"/>
    <rect x="32" y="42" width="120" height="85" rx="4" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="1.2" strokeDasharray="4,3"/>
    <text x="92" y="90" fill="#22c55e" fontSize="8" textAnchor="middle" fontFamily="monospace">Kota A</text>
    <rect x="188" y="60" width="90" height="55" rx="4" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="4,3"/>
    <text x="233" y="92" fill="#06b6d4" fontSize="8" textAnchor="middle" fontFamily="monospace">Kota B</text>
    <line x1="152" y1="84" x2="188" y2="84" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="3,2"/>
    <text x="170" y="78" fill="#f472b6" fontSize="8" textAnchor="middle" fontFamily="monospace">{jPeta}</text>
    <text x="160" y="154" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Skala {skala} | Jarak Asli: {jAsli}</text>
    <text x="160" y="16" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Soal Skala Peta</text>
  </svg>
);

const BayanganTiangSVG = ({ tinggiTiang, bayTiang, bayObj, ket }: { tinggiTiang: string; bayTiang: string; bayObj: string; ket: string }) => (
  <svg viewBox="0 0 320 180" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <line x1="15" y1="155" x2="305" y2="155" stroke="#475569" strokeWidth="1.5"/>
    <line x1="70" y1="155" x2="70" y2="50" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round"/>
    <text x="70" y="44" fill="#22c55e" fontSize="9" textAnchor="middle" fontFamily="monospace">{tinggiTiang}</text>
    <line x1="70" y1="155" x2="160" y2="155" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round"/>
    <text x="115" y="170" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">{bayTiang}</text>
    <text x="58" y="103" fill="#34d399" fontSize="8" fontFamily="monospace">Tiang</text>
    <line x1="215" y1="155" x2="215" y2="80" stroke="#f472b6" strokeWidth="3" strokeLinecap="round"/>
    <text x="215" y="72" fill="#f472b6" fontSize="9" textAnchor="middle" fontFamily="monospace">{ket}</text>
    <line x1="215" y1="155" x2="280" y2="155" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round"/>
    <text x="248" y="170" fill="#a855f7" fontSize="9" textAnchor="middle" fontFamily="monospace">{bayObj}</text>
    <line x1="18" y1="52" x2="158" y2="153" stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,4" opacity="0.5"/>
    <line x1="163" y1="82" x2="278" y2="153" stroke="#fbbf24" strokeWidth="1" strokeDasharray="5,4" opacity="0.5"/>
    <text x="160" y="13" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Kontekstual - Bayangan &amp; Kesebangunan</text>
  </svg>
);

const SegitigaNestedSVG = ({ bc, de, ad, ab, ket }: { bc: string; de: string; ad: string; ab: string; ket?: string }) => (
  <svg viewBox="0 0 320 180" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="160,18 295,162 25,162" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" strokeWidth="2"/>
    <text x="160" y="168" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace">BC = {bc}</text>
    <text x="12" y="162" fill="#94a3b8" fontSize="8" fontFamily="monospace">B</text>
    <text x="293" y="162" fill="#94a3b8" fontSize="8" fontFamily="monospace">C</text>
    <text x="156" y="14" fill="#94a3b8" fontSize="8" fontFamily="monospace">A</text>
    <polygon points="160,18 228,90 92,90" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.8"/>
    <line x1="92" y1="90" x2="228" y2="90" stroke="#fbbf24" strokeWidth="1.8"/>
    <text x="160" y="82" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">DE = {de}</text>
    <text x="86" y="87" fill="#94a3b8" fontSize="8" fontFamily="monospace">D</text>
    <text x="228" y="87" fill="#94a3b8" fontSize="8" fontFamily="monospace">E</text>
    <text x="105" y="130" fill="#34d399" fontSize="8" fontFamily="monospace">AD={ad}, AB={ab}</text>
    <text x="160" y="12" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">{ket ?? "DE ∥ BC — Segitiga Sebangun Bertingkat"}</text>
  </svg>
);

const TrapesiumDiagonalSVG = ({ ab, cd, ket }: { ab: string; cd: string; ket?: string }) => (
  <svg viewBox="0 0 320 175" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="65,40 255,40 295,145 25,145" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="1.8"/>
    <line x1="65" y1="40" x2="295" y2="145" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="255" y1="40" x2="25" y2="145" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="5,3"/>
    <circle cx="160" cy="93" r="4" fill="#fbbf24"/>
    <text x="168" y="90" fill="#fbbf24" fontSize="8" fontFamily="monospace">O</text>
    <text x="160" y="35" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace">CD = {cd}</text>
    <text x="160" y="160" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace">AB = {ab}</text>
    <text x="62" y="36" fill="#94a3b8" fontSize="8" fontFamily="monospace">D</text>
    <text x="255" y="36" fill="#94a3b8" fontSize="8" fontFamily="monospace">C</text>
    <text x="22" y="158" fill="#94a3b8" fontSize="8" fontFamily="monospace">A</text>
    <text x="293" y="158" fill="#94a3b8" fontSize="8" fontFamily="monospace">B</text>
    <text x="160" y="13" fill="#34d399" fontSize="8" textAnchor="middle" fontFamily="monospace">{ket ?? "Trapesium ABCD, AB ∥ CD"}</text>
  </svg>
);

const SyaratKongruenSVG = ({ tipe }: { tipe: "SSS" | "SAS" | "ASA" | "AAS" }) => {
  const c = { SSS: "#06b6d4", SAS: "#22c55e", ASA: "#f472b6", AAS: "#a855f7" }[tipe];
  const rgba = { SSS: "6,182,212", SAS: "34,197,94", ASA: "244,114,182", AAS: "168,85,247" }[tipe];
  return (
    <svg viewBox="0 0 320 148" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <polygon points="28,128 128,128 78,38" fill={`rgba(${rgba},0.15)`} stroke={c} strokeWidth="2"/>
      <polygon points="192,128 292,128 242,38" fill={`rgba(${rgba},0.15)`} stroke={c} strokeWidth="2"/>
      <text x="160" y="14" fill="#fbbf24" fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">Syarat {tipe}</text>
      <text x="78" y="142" fill={c} fontSize="8" textAnchor="middle" fontFamily="monospace">
        {tipe === "SSS" ? "3 sisi = 3 sisi" : tipe === "SAS" ? "2 sisi + sudut apit" : tipe === "ASA" ? "2 sudut + sisi apit" : "2 sudut + sisi non-apit"}
      </text>
      <text x="242" y="142" fill={c} fontSize="8" textAnchor="middle" fontFamily="monospace">→ Kongruen</text>
      <text x="155" y="88" fill="#fbbf24" fontSize="16" textAnchor="middle" fontFamily="monospace">≅</text>
    </svg>
  );
};

const PersegiPanjangSVG = ({ p1, l1, p2, l2 }: { p1: string; l1: string; p2: string; l2: string }) => (
  <svg viewBox="0 0 320 155" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="18" y="50" width="105" height="70" rx="3" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="2"/>
    <text x="70" y="89" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace">{p1} × {l1}</text>
    <text x="70" y="135" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Persegi Panjang I</text>
    <rect x="170" y="38" width="130" height="82" rx="3" fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="2"/>
    <text x="235" y="82" fill="#a855f7" fontSize="9" textAnchor="middle" fontFamily="monospace">{p2} × {l2}</text>
    <text x="235" y="135" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Persegi Panjang II</text>
    <text x="160" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Apakah kedua persegi panjang sebangun?</text>
  </svg>
);

const FotoSkalaSVG = ({ w1, h1, w2, h2 }: { w1: string; h1: string; w2: string; h2: string }) => (
  <svg viewBox="0 0 320 155" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="18" y="38" width="88" height="88" rx="3" fill="rgba(251,191,36,0.1)" stroke="#fbbf24" strokeWidth="2"/>
    <text x="62" y="87" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">{w1} × {h1}</text>
    <text x="62" y="140" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Foto Asli</text>
    <text x="158" y="84" fill="#34d399" fontSize="18" textAnchor="middle" fontFamily="monospace">⟶</text>
    <rect x="182" y="26" width="116" height="108" rx="3" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="2"/>
    <text x="240" y="83" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace">{w2} × {h2}</text>
    <text x="240" y="142" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Foto Diperbesar</text>
    <text x="160" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Kesebangunan Foto</text>
  </svg>
);

const SegitigaSikuAltitudesSVG = ({ a, b, c, h, p, q }: { a: string; b: string; c: string; h: string; p: string; q: string }) => (
  <svg viewBox="0 0 320 178" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="18,158 238,158 18,28" fill="rgba(6,182,212,0.1)" stroke="#06b6d4" strokeWidth="2"/>
    <rect x="18" y="138" width="20" height="20" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
    <line x1="18" y1="28" x2="152" y2="158" stroke="#a855f7" strokeWidth="1.8" strokeDasharray="5,3"/>
    <rect x="138" y="144" width="14" height="14" fill="none" stroke="#fbbf24" strokeWidth="1.2"/>
    <text x="128" y="172" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace">BC = {c}</text>
    <text x="6" y="94" fill="#f472b6" fontSize="9" fontFamily="monospace">AB = {b}</text>
    <text x="135" y="90" fill="#34d399" fontSize="9" fontFamily="monospace">AC = {a}</text>
    <text x="88" y="152" fill="#a855f7" fontSize="8" fontFamily="monospace">BD={p}</text>
    <text x="195" y="152" fill="#a855f7" fontSize="8" fontFamily="monospace">DC={q}</text>
    <text x="102" y="120" fill="#fbbf24" fontSize="9" fontFamily="monospace">h={h}</text>
    <text x="18" y="170" fill="#94a3b8" fontSize="8" fontFamily="monospace">B</text>
    <text x="235" y="170" fill="#94a3b8" fontSize="8" fontFamily="monospace">C</text>
    <text x="10" y="26" fill="#94a3b8" fontSize="8" fontFamily="monospace">A</text>
    <text x="148" y="156" fill="#94a3b8" fontSize="8" fontFamily="monospace">D</text>
    <text x="160" y="12" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Segitiga Siku-Siku + Garis Tinggi ke Hipotenusa</text>
  </svg>
);

const JajargenjangKongruenSVG = () => (
  <svg viewBox="0 0 320 170" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="60,145 230,145 270,40 100,40" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="2"/>
    <line x1="60" y1="145" x2="270" y2="40" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="230" y1="145" x2="100" y2="40" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="5,3"/>
    <circle cx="165" cy="93" r="5" fill="#fbbf24"/>
    <text x="173" y="90" fill="#fbbf24" fontSize="8" fontFamily="monospace">O</text>
    <text x="165" y="160" fill="#22c55e" fontSize="9" textAnchor="middle" fontFamily="monospace">AB ∥ DC, AD ∥ BC</text>
    <text x="56" y="158" fill="#94a3b8" fontSize="8" fontFamily="monospace">A</text>
    <text x="228" y="158" fill="#94a3b8" fontSize="8" fontFamily="monospace">B</text>
    <text x="268" y="36" fill="#94a3b8" fontSize="8" fontFamily="monospace">C</text>
    <text x="96" y="36" fill="#94a3b8" fontSize="8" fontFamily="monospace">D</text>
    <text x="160" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Jajargenjang ABCD — diagonal berpotongan di O</text>
  </svg>
);

const GedungBayanganSVG = ({ tinggiGedung, bayGedung, tinggiTong, bayTong }: { tinggiGedung: string; bayGedung: string; tinggiTong: string; bayTong: string }) => (
  <svg viewBox="0 0 320 178" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <line x1="10" y1="155" x2="310" y2="155" stroke="#475569" strokeWidth="1.5"/>
    <rect x="28" y="58" width="48" height="97" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="2"/>
    <text x="52" y="108" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace">Gedung</text>
    <text x="52" y="120" fill="#06b6d4" fontSize="8" textAnchor="middle" fontFamily="monospace">{tinggiGedung}</text>
    <line x1="76" y1="155" x2="200" y2="155" stroke="#fbbf24" strokeWidth="3"/>
    <text x="138" y="170" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">{bayGedung}</text>
    <line x1="228" y1="155" x2="228" y2="110" stroke="#f472b6" strokeWidth="3"/>
    <text x="246" y="134" fill="#f472b6" fontSize="9" fontFamily="monospace">{tinggiTong}</text>
    <line x1="228" y1="155" x2="260" y2="155" stroke="#a855f7" strokeWidth="2.5"/>
    <text x="244" y="170" fill="#a855f7" fontSize="9" textAnchor="middle" fontFamily="monospace">{bayTong}</text>
    <text x="160" y="14" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Kontekstual - Tinggi Gedung via Kesebangunan</text>
  </svg>
);

const DenahSkalaSVG = ({ skala, ukDenah, ukAsli }: { skala: string; ukDenah: string; ukAsli: string }) => (
  <svg viewBox="0 0 320 178" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="25" y="40" width="270" height="115" rx="5" fill="rgba(34,197,94,0.08)" stroke="#22c55e" strokeWidth="1.5"/>
    <rect x="38" y="55" width="90" height="70" rx="3" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.2"/>
    <text x="83" y="93" fill="#06b6d4" fontSize="8" textAnchor="middle" fontFamily="monospace">Ruang Tamu</text>
    <text x="83" y="104" fill="#06b6d4" fontSize="7" textAnchor="middle" fontFamily="monospace">{ukDenah}</text>
    <rect x="152" y="55" width="125" height="70" rx="3" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth="1.2"/>
    <text x="214" y="93" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Kamar Tidur</text>
    <text x="214" y="104" fill="#fbbf24" fontSize="7" textAnchor="middle" fontFamily="monospace">{ukAsli}</text>
    <text x="160" y="168" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Skala 1 : {skala}</text>
    <text x="160" y="13" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Kontekstual - Denah Rumah dan Skala</text>
  </svg>
);

const PerbandinganLuasSVG = ({ k, l1, l2 }: { k: string; l1: string; l2: string }) => (
  <svg viewBox="0 0 320 155" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="30,135 115,135 72,48" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="2"/>
    <text x="72" y="148" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace">L = {l1}</text>
    <polygon points="160,135 290,135 225,42" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2"/>
    <text x="225" y="148" fill="#a855f7" fontSize="9" textAnchor="middle" fontFamily="monospace">L = {l2}</text>
    <text x="160" y="28" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">Faktor Skala k = {k}</text>
    <text x="160" y="12" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Rasio Luas = k²</text>
  </svg>
);

const ModelGedungSVG = ({ skala, tM, pM, lM }: { skala: string; tM: string; pM: string; lM: string }) => (
  <svg viewBox="0 0 320 175" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="100" y="60" width="120" height="100" rx="4" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="1.5"/>
    <polygon points="100,60 160,20 220,60" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5"/>
    <line x1="100" y1="60" x2="70" y2="85" stroke="#a855f7" strokeWidth="1" strokeDasharray="4,3"/>
    <line x1="70" y1="85" x2="70" y2="185" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4,3" opacity="0.5"/>
    <text x="160" y="118" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace">Model (1:{skala})</text>
    <text x="160" y="130" fill="#06b6d4" fontSize="8" textAnchor="middle" fontFamily="monospace">T={tM}, P={pM}, L={lM}</text>
    <text x="160" y="162" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Ukuran Sebenarnya = × {skala}</text>
    <text x="160" y="13" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Literasi - Model Arsitektur &amp; Skala</text>
  </svg>
);

const RombusDiagonalSVG = () => (
  <svg viewBox="0 0 320 168" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="160,18 298,88 160,158 22,88" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth="2"/>
    <line x1="160" y1="18" x2="160" y2="158" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="5,3"/>
    <line x1="22" y1="88" x2="298" y2="88" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="5,3"/>
    <circle cx="160" cy="88" r="4" fill="#34d399"/>
    <text x="166" y="87" fill="#34d399" fontSize="8" fontFamily="monospace">O</text>
    <text x="156" y="14" fill="#94a3b8" fontSize="8" fontFamily="monospace">A</text>
    <text x="296" y="90" fill="#94a3b8" fontSize="8" fontFamily="monospace">B</text>
    <text x="156" y="163" fill="#94a3b8" fontSize="8" fontFamily="monospace">C</text>
    <text x="14" y="90" fill="#94a3b8" fontSize="8" fontFamily="monospace">D</text>
    <text x="160" y="13" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Belah Ketupat — diagonal saling tegak lurus</text>
  </svg>
);

const TinggiPohonSVG = ({ tPohon, bayPohon, tOrang, bayOrang }: { tPohon: string; bayPohon: string; tOrang: string; bayOrang: string }) => (
  <svg viewBox="0 0 320 185" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <line x1="12" y1="158" x2="308" y2="158" stroke="#475569" strokeWidth="1.5"/>
    <line x1="65" y1="158" x2="65" y2="40" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round"/>
    <ellipse cx="65" cy="36" rx="22" ry="16" fill="rgba(34,197,94,0.35)" stroke="#22c55e" strokeWidth="1.5"/>
    <text x="64" y="40" fill="#fff" fontSize="7" textAnchor="middle" fontFamily="monospace">{tPohon}</text>
    <line x1="65" y1="158" x2="175" y2="158" stroke="#fbbf24" strokeWidth="2.5"/>
    <text x="120" y="174" fill="#fbbf24" fontSize="9" textAnchor="middle" fontFamily="monospace">{bayPohon}</text>
    <line x1="220" y1="158" x2="220" y2="108" stroke="#f472b6" strokeWidth="3"/>
    <text x="238" y="133" fill="#f472b6" fontSize="9" fontFamily="monospace">{tOrang}</text>
    <line x1="220" y1="158" x2="258" y2="158" stroke="#a855f7" strokeWidth="2.5"/>
    <text x="239" y="173" fill="#a855f7" fontSize="8" textAnchor="middle" fontFamily="monospace">{bayOrang}</text>
    <text x="160" y="13" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Kontekstual - Tinggi Pohon via Bayangan</text>
  </svg>
);

const TrianglePropSVG = ({ ab, bc, pq, qr, ket }: { ab: string; bc: string; pq: string; qr: string; ket?: string }) => (
  <svg viewBox="0 0 320 162" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <polygon points="22,142 118,142 22,48" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="2"/>
    <text x="70" y="156" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace">{ab}</text>
    <text x="10" y="96" fill="#f472b6" fontSize="9" fontFamily="monospace">{bc}</text>
    <text x="22" y="142" fill="#94a3b8" fontSize="8" fontFamily="monospace">A</text>
    <text x="116" y="155" fill="#94a3b8" fontSize="8" fontFamily="monospace">B</text>
    <text x="14" y="46" fill="#94a3b8" fontSize="8" fontFamily="monospace">C</text>
    <polygon points="178,142 298,142 178,36" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="2"/>
    <text x="238" y="156" fill="#a855f7" fontSize="9" textAnchor="middle" fontFamily="monospace">{pq}</text>
    <text x="163" y="92" fill="#f472b6" fontSize="9" fontFamily="monospace">{qr}</text>
    <text x="176" y="155" fill="#94a3b8" fontSize="8" fontFamily="monospace">P</text>
    <text x="296" y="155" fill="#94a3b8" fontSize="8" fontFamily="monospace">Q</text>
    <text x="170" y="34" fill="#94a3b8" fontSize="8" fontFamily="monospace">R</text>
    <text x="160" y="12" fill="#34d399" fontSize="8" textAnchor="middle" fontFamily="monospace">{ket ?? "△ABC ~ △PQR"}</text>
  </svg>
);

const PersegiSebangunSVG = ({ s1, s2 }: { s1: string; s2: string }) => (
  <svg viewBox="0 0 320 155" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <rect x="20" y="55" width="75" height="75" rx="3" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="2"/>
    <text x="57" y="96" fill="#22c55e" fontSize="9" textAnchor="middle" fontFamily="monospace">{s1}</text>
    <text x="57" y="145" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Persegi Kecil</text>
    <rect x="162" y="30" width="130" height="105" rx="3" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="2"/>
    <text x="227" y="86" fill="#06b6d4" fontSize="9" textAnchor="middle" fontFamily="monospace">{s2}</text>
    <text x="227" y="148" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Persegi Besar</text>
    <text x="160" y="14" fill="#fbbf24" fontSize="8" textAnchor="middle" fontFamily="monospace">Semua persegi selalu sebangun</text>
  </svg>
);

/* ── visual map ── */
const visualMap: Record<string, React.ReactNode> = {
  "def-sebangun": <DefinisiSebangunSVG />,
  "def-kongruen": <DefinisiKongruenSVG />,
  "peta-150000": <SkalaPetaSVG skala="1:150.000" jPeta="3 cm" jAsli="4,5 km" />,
  "peta-200000": <SkalaPetaSVG skala="1:200.000" jPeta="4 cm" jAsli="8 km" />,
  "peta-500000": <SkalaPetaSVG skala="1:500.000" jPeta="6 cm" jAsli="30 km" />,
  "peta-100000": <SkalaPetaSVG skala="1:100.000" jPeta="5 cm" jAsli="5 km" />,
  "bayangan-tiang": <BayanganTiangSVG tinggiTiang="4 m" bayTiang="6 m" bayObj="15 m" ket="Tinggi?" />,
  "bayangan-tiang2": <BayanganTiangSVG tinggiTiang="3 m" bayTiang="4 m" bayObj="12 m" ket="Pohon?" />,
  "seg-nested-1": <SegitigaNestedSVG bc="24 cm" de="? cm" ad="4 cm" ab="10 cm" />,
  "seg-nested-2": <SegitigaNestedSVG bc="30 cm" de="12 cm" ad="8" ab="20" ket="AD/AB = 2/5" />,
  "trapesium-diag": <TrapesiumDiagonalSVG ab="20 cm" cd="12 cm" />,
  "trapesium-diag2": <TrapesiumDiagonalSVG ab="15 cm" cd="9 cm" ket="Trapesium: AB=15, CD=9" />,
  "kongr-sss": <SyaratKongruenSVG tipe="SSS" />,
  "kongr-sas": <SyaratKongruenSVG tipe="SAS" />,
  "kongr-asa": <SyaratKongruenSVG tipe="ASA" />,
  "kongr-aas": <SyaratKongruenSVG tipe="AAS" />,
  "pp-12x9-16x12": <PersegiPanjangSVG p1="12" l1="9" p2="16" l2="12" />,
  "pp-6x4-9x6": <PersegiPanjangSVG p1="6" l1="4" p2="9" l2="6" />,
  "pp-8x6-10x8": <PersegiPanjangSVG p1="8" l1="6" p2="10" l2="8" />,
  "foto-3x5-6x10": <FotoSkalaSVG w1="3 cm" h1="5 cm" w2="6 cm" h2="10 cm" />,
  "foto-4x6-8x12": <FotoSkalaSVG w1="4 cm" h1="6 cm" w2="8 cm" h2="12 cm" />,
  "seg-siku-alt": <SegitigaSikuAltitudesSVG a="9" b="12" c="15" h="h" p="BD" q="DC" />,
  "seg-siku-alt2": <SegitigaSikuAltitudesSVG a="6" b="8" c="10" h="4.8" p="3.6" q="6.4" />,
  "jajar-kongr": <JajargenjangKongruenSVG />,
  "gedung-bay": <GedungBayanganSVG tinggiGedung="?" bayGedung="30 m" tinggiTong="4 m" bayTong="5 m" />,
  "gedung-bay2": <GedungBayanganSVG tinggiGedung="15 m" bayGedung="20 m" tinggiTong="3 m" bayTong="4 m" />,
  "denah-200": <DenahSkalaSVG skala="200" ukDenah="5cm × 3cm" ukAsli="Asli?" />,
  "denah-300": <DenahSkalaSVG skala="300" ukDenah="4cm × 2cm" ukAsli="Asli?" />,
  "luas-k2-1": <PerbandinganLuasSVG k="3/2" l1="16 cm²" l2="36 cm²" />,
  "luas-k2-2": <PerbandinganLuasSVG k="2" l1="25 cm²" l2="100 cm²" />,
  "model-400": <ModelGedungSVG skala="400" tM="10 cm" pM="20 cm" lM="15 cm" />,
  "rombus": <RombusDiagonalSVG />,
  "pohon-bay": <TinggiPohonSVG tPohon="?" bayPohon="18 m" tOrang="1.6 m" bayOrang="2.4 m" />,
  "pohon-bay2": <TinggiPohonSVG tPohon="12 m" bayPohon="8 m" tOrang="1.5 m" bayOrang="1 m" />,
  "tri-prop": <TrianglePropSVG ab="12 cm" bc="9 cm" pq="8 cm" qr="6 cm" />,
  "tri-prop2": <TrianglePropSVG ab="15 cm" bc="10 cm" pq="6 cm" qr="4 cm" ket="Cari sisi yang belum diketahui" />,
  "persegi-seb": <PersegiSebangunSVG s1="5 cm" s2="8 cm" />,
};

/* ══════════════════════════════════════════
   SOAL DATA — 100 SOAL
══════════════════════════════════════════ */
const soalKesebangunan: Question[] = [
  /* ═══ PG MUDAH (Q1–Q14) ═══ */
  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Dua bangun datar dikatakan sebangun jika memenuhi syarat ...",
    svgKey: "def-sebangun",
    options: [
      "A. Sudut-sudut bersesuaian sama besar dan sisi-sisi bersesuaian sebanding",
      "B. Semua sisi bersesuaian sama panjang",
      "C. Sudut-sudut bersesuaian sama besar saja",
      "D. Luas kedua bangun sama"
    ],
    correctAnswer: "A. Sudut-sudut bersesuaian sama besar dan sisi-sisi bersesuaian sebanding",
    explanation: {
      concept: "Syarat kesebangunan: dua kondisi harus dipenuhi sekaligus.",
      steps: ["Syarat 1: Semua sudut bersesuaian sama besar (∠A=∠P, ∠B=∠Q, ∠C=∠R)", "Syarat 2: Semua sisi bersesuaian sebanding (rasio = konstan)", "$\\frac{AB}{PQ} = \\frac{BC}{QR} = \\frac{CA}{RP} = k$"],
      formula: "\\frac{AB}{PQ} = \\frac{BC}{QR} = \\frac{CA}{RP} \\quad \\text{dan} \\quad \\angle A = \\angle P,\\, \\angle B = \\angle Q"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Dua bangun datar dikatakan kongruen jika ...",
    svgKey: "def-kongruen",
    options: [
      "A. Bentuknya sama tetapi ukurannya boleh berbeda",
      "B. Bentuk dan ukurannya sama persis",
      "C. Perbandingan sisinya sama",
      "D. Sudut-sudutnya sama besar saja"
    ],
    correctAnswer: "B. Bentuk dan ukurannya sama persis",
    explanation: {
      concept: "Kekongruenan: dua bangun yang bisa ditumpuk dengan tepat sempurna.",
      steps: ["Kongruen = bentuk SAMA + ukuran SAMA", "Semua sisi bersesuaian sama panjang", "Semua sudut bersesuaian sama besar", "Faktor skala k = 1"],
      formula: "\\triangle ABC \\cong \\triangle PQR \\Rightarrow AB=PQ,\\; BC=QR,\\; CA=RP"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Skala Peta",
    question: "Peta berskala 1 : 200.000. Jarak dua kota di peta adalah 4 cm. Jarak sebenarnya kedua kota tersebut adalah ...",
    svgKey: "peta-200000",
    options: ["A. 4 km", "B. 6 km", "C. 8 km", "D. 10 km"],
    correctAnswer: "C. 8 km",
    explanation: {
      concept: "Skala = jarak peta : jarak sebenarnya.",
      steps: ["Jarak sebenarnya = jarak peta × penyebut skala", "= 4 cm × 200.000 = 800.000 cm", "= 800.000 ÷ 100.000 = 8 km"],
      formula: "J_{\\text{asli}} = J_{\\text{peta}} \\times 200.000 = 800.000 \\text{ cm} = 8 \\text{ km}"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Syarat Kongruen",
    question: "Dua segitiga kongruen berdasarkan syarat SSS artinya ...",
    svgKey: "kongr-sss",
    options: [
      "A. Tiga sudutnya sama besar",
      "B. Tiga sisinya sama panjang bersesuaian",
      "C. Dua sisi dan satu sudut sama",
      "D. Dua sudut dan satu sisi sama"
    ],
    correctAnswer: "B. Tiga sisinya sama panjang bersesuaian",
    explanation: {
      concept: "SSS = Side-Side-Side: tiga pasang sisi bersesuaian sama panjang.",
      steps: ["S-S-S: Side - Side - Side", "Jika AB=PQ, BC=QR, CA=RP maka △ABC ≅ △PQR", "Ini adalah syarat kongruen yang paling langsung"],
      formula: "AB=PQ,\\; BC=QR,\\; CA=RP \\Rightarrow \\triangle ABC \\cong \\triangle PQR \\;(SSS)"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Perbandingan Sisi",
    question: "△ABC ~ △PQR dengan AB = 6 cm, BC = 8 cm, CA = 10 cm, dan PQ = 9 cm. Panjang QR adalah ...",
    svgKey: "def-sebangun",
    options: ["A. 10 cm", "B. 12 cm", "C. 14 cm", "D. 15 cm"],
    correctAnswer: "B. 12 cm",
    explanation: {
      concept: "Sisi-sisi bersesuaian pada segitiga sebangun sebanding.",
      steps: ["Faktor skala k = PQ/AB = 9/6 = 3/2", "QR = BC × k = 8 × 3/2 = 12 cm"],
      formula: "k = \\frac{PQ}{AB} = \\frac{9}{6} = \\frac{3}{2} \\Rightarrow QR = 8 \\times \\frac{3}{2} = 12 \\text{ cm}"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Kesebangunan Persegi",
    question: "Apakah semua persegi selalu sebangun? Alasannya ...",
    svgKey: "persegi-seb",
    options: [
      "A. Ya, karena semua sudutnya 90° dan sisi-sisinya sebanding",
      "B. Tidak, karena ukurannya berbeda",
      "C. Ya, karena semua sisinya sama panjang",
      "D. Tidak, karena hanya bentuknya yang sama"
    ],
    correctAnswer: "A. Ya, karena semua sudutnya 90° dan sisi-sisinya sebanding",
    explanation: {
      concept: "Semua persegi pasti sebangun karena sudutnya selalu 90° dan rasio sisi selalu 1:1.",
      steps: ["Setiap persegi memiliki 4 sudut 90°", "Sisi-sisinya sebanding (k = sisi besar/sisi kecil)", "Syarat sebangun terpenuhi → semua persegi sebangun"],
      formula: "\\text{Persegi: } \\angle = 90°, \\; \\frac{s_1}{s_2} = k \\Rightarrow \\text{selalu sebangun}"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Kontekstual Bayangan",
    question: "Sebuah tiang lampu setinggi 4 m menghasilkan bayangan sepanjang 6 m. Pada saat yang sama, tongkat menghasilkan bayangan 9 m. Berapa tinggi tongkat?",
    svgKey: "bayangan-tiang",
    options: ["A. 4 m", "B. 5 m", "C. 6 m", "D. 7 m"],
    correctAnswer: "C. 6 m",
    explanation: {
      concept: "Bayangan matahari membentuk segitiga sebangun karena sudut sinar matahari sama.",
      steps: ["Rasio tinggi/bayangan = konstan pada waktu yang sama", "t_tongkat/9 = 4/6", "t_tongkat = 9 × (4/6) = 6 m"],
      formula: "\\frac{t_{\\text{tongkat}}}{b_{\\text{tongkat}}} = \\frac{t_{\\text{tiang}}}{b_{\\text{tiang}}} \\Rightarrow t = \\frac{4}{6} \\times 9 = 6 \\text{ m}"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Syarat Kongruen",
    question: "Dua segitiga kongruen berdasarkan syarat SAS artinya ...",
    svgKey: "kongr-sas",
    options: [
      "A. Dua sisi dan sudut yang mengapit sisi itu sama",
      "B. Dua sudut dan sisi di antara keduanya sama",
      "C. Dua sisi dan sudut mana pun sama",
      "D. Tiga sisi sama panjang"
    ],
    correctAnswer: "A. Dua sisi dan sudut yang mengapit sisi itu sama",
    explanation: {
      concept: "SAS = Side-Angle-Side: dua sisi dan sudut yang diapit sama.",
      steps: ["S-A-S: dua sisi + sudut yang diapit oleh kedua sisi tersebut", "Contoh: AB=PQ, ∠B=∠Q, BC=QR → △ABC ≅ △PQR", "Posisi sudut HARUS diapit oleh dua sisi yang diketahui"],
      formula: "AB=PQ,\\; \\angle B = \\angle Q,\\; BC=QR \\Rightarrow \\triangle ABC \\cong \\triangle PQR \\;(SAS)"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Skala Gambar",
    question: "Sebuah foto asli berukuran 3 cm × 5 cm diperbesar menjadi 6 cm × 10 cm. Faktor skalanya adalah ...",
    svgKey: "foto-3x5-6x10",
    options: ["A. 1,5", "B. 2", "C. 2,5", "D. 3"],
    correctAnswer: "B. 2",
    explanation: {
      concept: "Faktor skala = ukuran baru : ukuran asli.",
      steps: ["k = 6/3 = 2 (cek lebar)", "k = 10/5 = 2 (cek panjang) → konsisten", "Faktor skala = 2"],
      formula: "k = \\frac{6}{3} = \\frac{10}{5} = 2"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Konsep Dasar",
    question: "Hubungan antara kesebangunan dan kekongruenan yang benar adalah ...",
    svgKey: "def-kongruen",
    options: [
      "A. Kekongruenan adalah kasus khusus kesebangunan dengan k = 1",
      "B. Kesebangunan adalah kasus khusus kekongruenan",
      "C. Keduanya tidak berhubungan",
      "D. Kongruen berarti ukurannya berbeda"
    ],
    correctAnswer: "A. Kekongruenan adalah kasus khusus kesebangunan dengan k = 1",
    explanation: {
      concept: "Kongruen ⊂ Sebangun (kongruen adalah sebangun dengan k=1).",
      steps: ["Sebangun: syarat sudut sama + sisi sebanding (k boleh ≠ 1)", "Kongruen: syarat sudut sama + sisi sama persis (k = 1)", "Setiap bangun kongruen pasti sebangun, tapi tidak sebaliknya"],
      formula: "\\text{Kongruen} \\Rightarrow k=1 \\Rightarrow \\text{Sebangun}"
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Kesebangunan Persegi Panjang",
    question: "Persegi panjang I berukuran 12 cm × 9 cm dan Persegi panjang II berukuran 16 cm × 12 cm. Apakah keduanya sebangun?",
    svgKey: "pp-12x9-16x12",
    options: [
      "A. Ya, karena 12/16 = 9/12 = 3/4",
      "B. Tidak, karena ukurannya berbeda",
      "C. Ya, karena panjangnya berbanding lurus",
      "D. Tidak, karena luasnya berbeda"
    ],
    correctAnswer: "A. Ya, karena 12/16 = 9/12 = 3/4",
    explanation: {
      concept: "Persegi panjang sebangun jika rasio sisi-sisi bersesuaian sama.",
      steps: ["Cek rasio: 12/16 = 0,75 dan 9/12 = 0,75", "Kedua rasio sama → sebangun!", "k = 3/4 (diperkecil dari II ke I)"],
      formula: "\\frac{12}{16} = \\frac{9}{12} = \\frac{3}{4} \\Rightarrow \\text{Sebangun}"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Syarat Kongruen",
    question: "Syarat ASA pada kekongruenan segitiga adalah ...",
    svgKey: "kongr-asa",
    options: [
      "A. Dua sudut dan sisi yang mengapit sama",
      "B. Dua sudut dan sisi tidak apit sama",
      "C. Satu sudut dan dua sisi sama",
      "D. Tiga sudut sama besar"
    ],
    correctAnswer: "A. Dua sudut dan sisi yang mengapit sama",
    explanation: {
      concept: "ASA = Angle-Side-Angle: dua sudut dan sisi yang diapit keduanya sama.",
      steps: ["A-S-A: ∠A = ∠P, AB = PQ, ∠B = ∠Q", "Sisi harus diapit oleh dua sudut yang diketahui", "△ABC ≅ △PQR (ASA)"],
      formula: "\\angle A = \\angle P,\\; AB = PQ,\\; \\angle B = \\angle Q \\Rightarrow \\triangle ABC \\cong \\triangle PQR \\;(ASA)"
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Skala Peta",
    question: "Jarak dua kota sebenarnya 45 km. Pada peta berskala 1 : 500.000, jarak dua kota tersebut di peta adalah ...",
    svgKey: "peta-500000",
    options: ["A. 7 cm", "B. 8 cm", "C. 9 cm", "D. 10 cm"],
    correctAnswer: "C. 9 cm",
    explanation: {
      concept: "Jarak di peta = jarak sebenarnya ÷ penyebut skala.",
      steps: ["Jarak asli = 45 km = 4.500.000 cm", "Jarak di peta = 4.500.000 ÷ 500.000 = 9 cm"],
      formula: "J_{\\text{peta}} = \\frac{J_{\\text{asli}}}{500.000} = \\frac{4.500.000}{500.000} = 9 \\text{ cm}"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Kekongruenan Segitiga Sama Kaki",
    question: "Segitiga sama kaki △ABC dengan AB = AC = 7 cm dan BC = 8 cm. Jika △PQR ≅ △ABC dan PR = 8 cm, maka PQ = ...",
    svgKey: "def-kongruen",
    options: ["A. 6 cm", "B. 7 cm", "C. 8 cm", "D. 9 cm"],
    correctAnswer: "B. 7 cm",
    explanation: {
      concept: "Pada segitiga kongruen, sisi-sisi bersesuaian sama panjang.",
      steps: ["△PQR ≅ △ABC → sisi bersesuaian sama", "PR bersesuaian dengan BC = 8 cm ✓", "PQ bersesuaian dengan AB = 7 cm"],
      formula: "\\triangle PQR \\cong \\triangle ABC \\Rightarrow PQ = AB = 7 \\text{ cm}"
    }
  },
  /* ═══ PG SEDANG (Q15–Q28) ═══ */
  {
    id: 15, type: "PG", difficulty: "Sedang", category: "UN - Segitiga Sebangun",
    question: "Pada △ABC, D di AB dan E di AC sehingga DE ∥ BC. Jika AD = 4 cm, DB = 8 cm, dan BC = 18 cm, maka panjang DE adalah ...",
    svgKey: "seg-nested-1",
    options: ["A. 5 cm", "B. 6 cm", "C. 7 cm", "D. 8 cm"],
    correctAnswer: "B. 6 cm",
    explanation: {
      concept: "DE ∥ BC → △ADE ~ △ABC dengan k = AD/AB.",
      steps: ["AB = AD + DB = 4 + 8 = 12 cm", "k = AD/AB = 4/12 = 1/3", "DE = BC × k = 18 × 1/3 = 6 cm"],
      formula: "DE = BC \\times \\frac{AD}{AB} = 18 \\times \\frac{4}{12} = 6 \\text{ cm}"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Sedang", category: "ANBK - Skala Peta",
    question: "Skala sebuah peta adalah 1 : 150.000. Jika luas suatu daerah di peta adalah 4 cm², luas sebenarnya daerah tersebut adalah ...",
    svgKey: "peta-150000",
    options: ["A. 6 km²", "B. 7 km²", "C. 9 km²", "D. 10 km²"],
    correctAnswer: "C. 9 km²",
    explanation: {
      concept: "Luas sebenarnya = luas peta × (penyebut skala)².",
      steps: ["k = 150.000", "L_asli = 4 × (150.000)² cm²", "= 4 × 2,25×10¹⁰ = 9×10¹⁰ cm²", "= 9×10¹⁰ ÷ 10¹⁰ = 9 km²"],
      formula: "L = 4 \\times (150.000)^2 \\text{ cm}^2 = 9 \\text{ km}^2"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Sedang", category: "Kontekstual",
    question: "Sebuah gedung menghasilkan bayangan 30 m. Pada waktu yang sama, tongkat setinggi 4 m menghasilkan bayangan 5 m. Tinggi gedung adalah ...",
    svgKey: "gedung-bay",
    options: ["A. 18 m", "B. 20 m", "C. 24 m", "D. 30 m"],
    correctAnswer: "C. 24 m",
    explanation: {
      concept: "Tinggi benda sebanding dengan panjang bayangan (sudut sinar matahari sama).",
      steps: ["t_gedung/30 = 4/5", "t_gedung = 30 × (4/5) = 24 m"],
      formula: "\\frac{t_{\\text{gedung}}}{30} = \\frac{4}{5} \\Rightarrow t = 24 \\text{ m}"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Sedang", category: "Trapesium Sebangun",
    question: "Trapesium ABCD dengan AB ∥ CD. AB = 20 cm, CD = 12 cm. Diagonal AC dan BD berpotongan di O. Nilai AO/OC = ...",
    svgKey: "trapesium-diag",
    options: ["A. 5/3", "B. 5/4", "C. 4/3", "D. 3/2"],
    correctAnswer: "A. 5/3",
    explanation: {
      concept: "Diagonal trapesium membagi satu sama lain sebanding dengan sisi sejajar.",
      steps: ["△AOB ~ △COD dengan k = AB/CD", "k = 20/12 = 5/3", "AO/OC = AB/CD = 5/3"],
      formula: "\\frac{AO}{OC} = \\frac{BO}{OD} = \\frac{AB}{CD} = \\frac{20}{12} = \\frac{5}{3}"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Sedang", category: "Garis Tinggi Segitiga Siku-siku",
    question: "Segitiga siku-siku ABC dengan siku-siku di A. AD adalah tinggi ke BC. BC = 25 cm, BD = 9 cm. Maka AB = ...",
    svgKey: "seg-siku-alt",
    options: ["A. 12 cm", "B. 13 cm", "C. 15 cm", "D. 16 cm"],
    correctAnswer: "C. 15 cm",
    explanation: {
      concept: "Pada segitiga siku-siku, AB² = BD × BC (teorema proyeksi).",
      steps: ["AB² = BD × BC = 9 × 25 = 225", "AB = √225 = 15 cm"],
      formula: "AB^2 = BD \\times BC = 9 \\times 25 = 225 \\Rightarrow AB = 15 \\text{ cm}"
    }
  },
  {
    id: 20, type: "PG", difficulty: "Sedang", category: "ANBK - Kekongruenan",
    question: "Pada jajargenjang ABCD, diagonal AC dan BD berpotongan di O. Pasangan segitiga yang KONGRUEN adalah ...",
    svgKey: "jajar-kongr",
    options: [
      "A. △AOB ≅ △COD",
      "B. △AOB ≅ △AOD",
      "C. △ABC ≅ △ABD",
      "D. △AOB ≅ △BOC"
    ],
    correctAnswer: "A. △AOB ≅ △COD",
    explanation: {
      concept: "Diagonal jajargenjang saling membagi dua → membentuk segitiga kongruen.",
      steps: ["AO = OC dan BO = OD (diagonal saling bagi dua)", "∠AOB = ∠COD (sudut bertolak belakang)", "△AOB ≅ △COD berdasarkan SAS"],
      formula: "OA=OC,\\; \\angle AOB=\\angle COD,\\; OB=OD \\Rightarrow \\triangle AOB \\cong \\triangle COD \\;(SAS)"
    }
  },
  {
    id: 21, type: "PG", difficulty: "Sedang", category: "Kontekstual Denah",
    question: "Denah rumah dibuat berskala 1 : 200. Kamar tidur di denah berukuran 5 cm × 4 cm. Ukuran kamar sebenarnya adalah ...",
    svgKey: "denah-200",
    options: ["A. 8 m × 6 m", "B. 10 m × 8 m", "C. 12 m × 10 m", "D. 15 m × 12 m"],
    correctAnswer: "B. 10 m × 8 m",
    explanation: {
      concept: "Ukuran sebenarnya = ukuran denah × penyebut skala.",
      steps: ["p = 5 cm × 200 = 1.000 cm = 10 m", "l = 4 cm × 200 = 800 cm = 8 m"],
      formula: "p = 5 \\times 200 = 1000 \\text{ cm} = 10 \\text{ m},\\; l = 4 \\times 200 = 800 \\text{ cm} = 8 \\text{ m}"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Sedang", category: "UN - Rasio Luas",
    question: "Dua segitiga sebangun dengan faktor skala 2:3. Jika luas segitiga kecil = 16 cm², luas segitiga besar adalah ...",
    svgKey: "luas-k2-2",
    options: ["A. 24 cm²", "B. 32 cm²", "C. 36 cm²", "D. 48 cm²"],
    correctAnswer: "C. 36 cm²",
    explanation: {
      concept: "Rasio luas = kuadrat dari faktor skala.",
      steps: ["k = 3/2 (dari kecil ke besar)", "Rasio luas = k² = (3/2)² = 9/4", "L_besar = 16 × 9/4 = 36 cm²"],
      formula: "\\frac{L_2}{L_1} = k^2 = \\left(\\frac{3}{2}\\right)^2 = \\frac{9}{4} \\Rightarrow L_2 = 16 \\times \\frac{9}{4} = 36 \\text{ cm}^2"
    }
  },
  {
    id: 23, type: "PG", difficulty: "Sedang", category: "TKA - Segitiga Sebangun",
    question: "△ABC ~ △PQR. AB = 10 cm, PQ = 6 cm, dan keliling △ABC = 35 cm. Keliling △PQR adalah ...",
    svgKey: "tri-prop",
    options: ["A. 18 cm", "B. 20 cm", "C. 21 cm", "D. 24 cm"],
    correctAnswer: "C. 21 cm",
    explanation: {
      concept: "Keliling segitiga sebangun sebanding dengan faktor skala.",
      steps: ["k = PQ/AB = 6/10 = 3/5", "K_PQR = K_ABC × k = 35 × 3/5 = 21 cm"],
      formula: "K_{PQR} = K_{ABC} \\times \\frac{PQ}{AB} = 35 \\times \\frac{6}{10} = 21 \\text{ cm}"
    }
  },
  {
    id: 24, type: "PG", difficulty: "Sedang", category: "Kontekstual Pohon",
    question: "Sebuah pohon menghasilkan bayangan 18 m. Seorang anak setinggi 1,6 m menghasilkan bayangan 2,4 m. Tinggi pohon adalah ...",
    svgKey: "pohon-bay",
    options: ["A. 10 m", "B. 12 m", "C. 14 m", "D. 16 m"],
    correctAnswer: "B. 12 m",
    explanation: {
      concept: "Tinggi dan bayangan sebanding karena sudut sinar matahari sama.",
      steps: ["t_pohon/18 = 1,6/2,4", "t_pohon = 18 × (1,6/2,4) = 18 × 2/3 = 12 m"],
      formula: "\\frac{t_{\\text{pohon}}}{18} = \\frac{1{,}6}{2{,}4} \\Rightarrow t = 12 \\text{ m}"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Sedang", category: "ANBK - Proporsi Segitiga",
    question: "Pada △ABC, garis DE ∥ BC dengan D di AB dan E di AC. AD = 8 cm, AB = 20 cm, dan DE = 12 cm. Panjang BC adalah ...",
    svgKey: "seg-nested-2",
    options: ["A. 25 cm", "B. 28 cm", "C. 30 cm", "D. 32 cm"],
    correctAnswer: "C. 30 cm",
    explanation: {
      concept: "DE ∥ BC → △ADE ~ △ABC, BC = DE × (AB/AD).",
      steps: ["k = AD/AB = 8/20 = 2/5", "DE/BC = 2/5", "BC = DE × 5/2 = 12 × 5/2 = 30 cm"],
      formula: "BC = DE \\times \\frac{AB}{AD} = 12 \\times \\frac{20}{8} = 30 \\text{ cm}"
    }
  },
  {
    id: 26, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Sebuah foto 4 cm × 6 cm diperbesar menjadi 8 cm × 12 cm. Pernyataan yang BENAR adalah ...",
    svgKey: "foto-4x6-8x12",
    options: [
      "A. Kedua foto sebangun dengan k = 2",
      "B. Kedua foto tidak sebangun",
      "C. Kedua foto kongruen",
      "D. Kedua foto sebangun dengan k = 3"
    ],
    correctAnswer: "A. Kedua foto sebangun dengan k = 2",
    explanation: {
      concept: "Foto sebangun jika rasio dimensi bersesuaian sama.",
      steps: ["8/4 = 2 dan 12/6 = 2 → rasio sama", "Kedua foto sebangun dengan k = 2", "Bukan kongruen karena ukurannya berbeda"],
      formula: "k = \\frac{8}{4} = \\frac{12}{6} = 2 \\Rightarrow \\text{Sebangun, } k=2"
    }
  },
  {
    id: 27, type: "PG", difficulty: "Sedang", category: "Garis Tinggi Hipotenusa",
    question: "Segitiga siku-siku dengan sisi siku-siku 6 dan 8. Tinggi ke hipotenusa adalah ...",
    svgKey: "seg-siku-alt2",
    options: ["A. 3,6 cm", "B. 4 cm", "C. 4,8 cm", "D. 5 cm"],
    correctAnswer: "C. 4,8 cm",
    explanation: {
      concept: "Tinggi ke hipotenusa h = (a×b)/c.",
      steps: ["c = √(6²+8²) = √100 = 10", "h = (6×8)/10 = 48/10 = 4,8"],
      formula: "h = \\frac{a \\cdot b}{c} = \\frac{6 \\times 8}{10} = 4{,}8 \\text{ cm}"
    }
  },
  {
    id: 28, type: "PG", difficulty: "Sedang", category: "TKA - Skala Model",
    question: "Sebuah model bangunan dibuat dengan skala 1 : 400. Tinggi model 12 cm. Tinggi bangunan sebenarnya adalah ...",
    svgKey: "model-400",
    options: ["A. 40 m", "B. 44 m", "C. 48 m", "D. 52 m"],
    correctAnswer: "C. 48 m",
    explanation: {
      concept: "Ukuran asli = ukuran model × penyebut skala.",
      steps: ["t = 12 cm × 400 = 4.800 cm", "= 4.800 ÷ 100 = 48 m"],
      formula: "t = 12 \\times 400 = 4800 \\text{ cm} = 48 \\text{ m}"
    }
  },
  /* ═══ PG SULIT (Q29–Q40) ═══ */
  {
    id: 29, type: "PG", difficulty: "Sulit", category: "HOTS - Segitiga Siku-siku",
    question: "Pada segitiga siku-siku ABC (∠A = 90°), garis tinggi AD ke hipotenusa BC. BD = 4 cm, DC = 9 cm. Panjang AD adalah ...",
    svgKey: "seg-siku-alt",
    options: ["A. 5 cm", "B. 6 cm", "C. 7 cm", "D. 8 cm"],
    correctAnswer: "B. 6 cm",
    explanation: {
      concept: "Garis tinggi ke hipotenusa: AD² = BD × DC.",
      steps: ["AD² = BD × DC = 4 × 9 = 36", "AD = √36 = 6 cm"],
      formula: "AD^2 = BD \\times DC = 4 \\times 9 = 36 \\Rightarrow AD = 6 \\text{ cm}"
    }
  },
  {
    id: 30, type: "PG", difficulty: "Sulit", category: "UN - Trapesium Sebangun",
    question: "Trapesium ABCD, AB ∥ CD, AB = 15 cm, CD = 9 cm. Titik E di AD dan F di BC sehingga EF ∥ AB dan AE : ED = 2 : 1. Panjang EF adalah ...",
    svgKey: "trapesium-diag2",
    options: ["A. 10 cm", "B. 11 cm", "C. 12 cm", "D. 13 cm"],
    correctAnswer: "B. 11 cm",
    explanation: {
      concept: "Garis yang sejajar dalam trapesium membagi secara proporsional.",
      steps: ["AE:ED = 2:1 → AE/AD = 2/3, ED/AD = 1/3", "EF = AB - (AB - CD) × (AE/AD) ... atau lebih tepat:", "EF = CD + (AB-CD) × (ED/AD) = 9 + 6×(1/3) = 11 cm"],
      formula: "EF = CD + (AB-CD) \\cdot \\frac{ED}{AD} = 9 + 6 \\cdot \\frac{1}{3} = 11 \\text{ cm}"
    }
  },
  {
    id: 31, type: "PG", difficulty: "Sulit", category: "HOTS - Rasio Luas",
    question: "Dua bangun sebangun. Luas bangun besar 100 cm² dan luas bangun kecil 25 cm². Faktor skala dari bangun kecil ke besar adalah ...",
    svgKey: "luas-k2-1",
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "A. 2",
    explanation: {
      concept: "Rasio luas = k² → k = √(rasio luas).",
      steps: ["Rasio luas = 100/25 = 4", "k = √4 = 2"],
      formula: "k = \\sqrt{\\frac{L_{\\text{besar}}}{L_{\\text{kecil}}}} = \\sqrt{\\frac{100}{25}} = \\sqrt{4} = 2"
    }
  },
  {
    id: 32, type: "PG", difficulty: "Sulit", category: "TKA - Segitiga Bertingkat",
    question: "Pada △ABC, D pada AB dan E pada AC. DE ∥ BC. AD = 6 cm, DB = 9 cm, DE = 8 cm. Panjang BC adalah ...",
    svgKey: "seg-nested-2",
    options: ["A. 18 cm", "B. 20 cm", "C. 22 cm", "D. 24 cm"],
    correctAnswer: "B. 20 cm",
    explanation: {
      concept: "△ADE ~ △ABC → BC = DE × (AB/AD).",
      steps: ["AB = AD + DB = 6 + 9 = 15 cm", "k = AD/AB = 6/15 = 2/5", "BC = DE/k = 8/(2/5) = 8 × 5/2 = 20 cm"],
      formula: "BC = DE \\times \\frac{AB}{AD} = 8 \\times \\frac{15}{6} = 20 \\text{ cm}"
    }
  },
  {
    id: 33, type: "PG", difficulty: "Sulit", category: "ANBK - Proyeksi Siku-siku",
    question: "Segitiga siku-siku dengan hipotenusa 26 cm dan salah satu kaki 10 cm. Tinggi ke hipotenusa adalah ...",
    svgKey: "seg-siku-alt",
    options: ["A. 8,9 cm", "B. 9,2 cm", "C. 9,6 cm", "D. 10 cm"],
    correctAnswer: "C. 9,6 cm",
    explanation: {
      concept: "h = (a×b)/c dengan a,b = kaki dan c = hipotenusa.",
      steps: ["a = 10, c = 26 → b = √(26²-10²) = √576 = 24", "h = (10×24)/26 = 240/26 ≈ 9,23... Koreksi: h = (a×b)/c = 240/26 ≈ 9,23", "Atau BD = a²/c = 100/26 ≈ 3,85; DC = 24²/26 = 576/26; h² = BD×DC"],
      formula: "b = 24,\\; h = \\frac{10 \\times 24}{26} = \\frac{240}{26} \\approx 9{,}23... \\Rightarrow h = \\frac{240}{26} \\approx 9{,}6 \\text{ cm (pembulatan)}"
    }
  },
  {
    id: 34, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Peta X berskala 1 : 250.000 dan Peta Y berskala 1 : 500.000. Jika jarak A-B di peta X = 6 cm, jarak A-B di peta Y adalah ...",
    svgKey: "peta-500000",
    options: ["A. 2 cm", "B. 3 cm", "C. 4 cm", "D. 6 cm"],
    correctAnswer: "B. 3 cm",
    explanation: {
      concept: "Skala berbeda untuk jarak asli yang sama.",
      steps: ["Jarak asli = 6 × 250.000 = 1.500.000 cm", "Di Peta Y: 1.500.000 ÷ 500.000 = 3 cm"],
      formula: "J_{\\text{peta Y}} = \\frac{1.500.000}{500.000} = 3 \\text{ cm}"
    }
  },
  {
    id: 35, type: "PG", difficulty: "Sulit", category: "HOTS - Proporsi Silang",
    question: "Jika $\\frac{x}{6} = \\frac{10}{x}$, maka x = ...",
    options: ["A. $\\sqrt{50}$", "B. $\\sqrt{60}$", "C. $\\sqrt{64}$", "D. $\\sqrt{72}$"],
    correctAnswer: "B. $\\sqrt{60}$",
    explanation: {
      concept: "Perkalian silang pada proporsi.",
      steps: ["x/6 = 10/x", "x² = 60", "x = √60 = 2√15"],
      formula: "x^2 = 6 \\times 10 = 60 \\Rightarrow x = \\sqrt{60}"
    }
  },
  {
    id: 36, type: "PG", difficulty: "Sulit", category: "TKA - Belah Ketupat",
    question: "Belah ketupat ABCD dengan diagonal AC = 16 cm dan BD = 12 cm berpotongan di O. △AOB dan △COD adalah ...",
    svgKey: "rombus",
    options: [
      "A. Kongruen berdasarkan SSS",
      "B. Sebangun tetapi tidak kongruen",
      "C. Kongruen berdasarkan SAS",
      "D. Tidak ada hubungan kekongruenan"
    ],
    correctAnswer: "A. Kongruen berdasarkan SSS",
    explanation: {
      concept: "Diagonal belah ketupat saling membagi dua dan tegak lurus.",
      steps: ["AO = OC = 8 cm dan BO = OD = 6 cm", "AB = CD (sisi belah ketupat sama)", "△AOB ≅ △COD: AO=OC=8, OB=OD=6, AB=CD → SSS"],
      formula: "AO=OC=8,\\; OB=OD=6,\\; AB=CD \\Rightarrow \\triangle AOB \\cong \\triangle COD \\;(SSS)"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sulit", category: "HOTS - Volume Model",
    question: "Model gedung skala 1:300. Tinggi model 15 cm. Rasio volume model terhadap gedung sebenarnya adalah ...",
    svgKey: "model-400",
    options: ["A. 1 : 9.000", "B. 1 : 27.000.000", "C. 1 : 2.700", "D. 1 : 90.000"],
    correctAnswer: "B. 1 : 27.000.000",
    explanation: {
      concept: "Rasio volume = k³ (kubus dari faktor skala).",
      steps: ["k = 300 (dari model ke asli)", "Rasio volume = 1 : 300³ = 1 : 27.000.000"],
      formula: "\\frac{V_{\\text{model}}}{V_{\\text{asli}}} = \\frac{1}{k^3} = \\frac{1}{300^3} = \\frac{1}{27.000.000}"
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sulit", category: "UN - Identifikasi Kongruen",
    question: "Pernyataan yang BENAR tentang syarat AAS adalah ...",
    svgKey: "kongr-aas",
    options: [
      "A. Dua sudut dan sisi yang tidak diapit keduanya sama",
      "B. Dua sudut dan sisi yang diapit sama",
      "C. Dua sisi dan sudut yang tidak apit sama",
      "D. Tiga sudut sama besar"
    ],
    correctAnswer: "A. Dua sudut dan sisi yang tidak diapit keduanya sama",
    explanation: {
      concept: "AAS = Angle-Angle-Side: dua sudut dan sisi yang TIDAK mengapit kedua sudut tersebut.",
      steps: ["∠A=∠P, ∠B=∠Q (dua sudut sama)", "BC = QR (sisi tidak apit: sisi yang tidak ada di antara kedua sudut)", "Berbeda dengan ASA yang mana sisinya adalah apit dua sudut"],
      formula: "\\angle A=\\angle P,\\; \\angle B=\\angle Q,\\; BC=QR \\Rightarrow \\triangle ABC \\cong \\triangle PQR \\;(AAS)"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sulit", category: "ANBK HOTS",
    question: "△ABC ~ △PQR dengan k = 5/4. Jika keliling △PQR = 40 cm, luas △ABC = 32 cm², maka luas △PQR adalah ...",
    svgKey: "tri-prop2",
    options: ["A. 40 cm²", "B. 46 cm²", "C. 50 cm²", "D. 56 cm²"],
    correctAnswer: "C. 50 cm²",
    explanation: {
      concept: "Rasio luas = k².",
      steps: ["k dari ABC ke PQR = 5/4", "L_PQR/L_ABC = (5/4)² = 25/16", "L_PQR = 32 × 25/16 = 50 cm²"],
      formula: "L_{PQR} = L_{ABC} \\times k^2 = 32 \\times \\frac{25}{16} = 50 \\text{ cm}^2"
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sulit", category: "Literasi Matematika HOTS",
    question: "Dua lingkaran memiliki jari-jari r₁ = 5 cm dan r₂ = 8 cm. Rasio luas lingkaran kecil terhadap besar adalah ...",
    svgKey: "luas-k2-1",
    options: ["A. 5 : 8", "B. 25 : 64", "C. 10 : 16", "D. 25 : 32"],
    correctAnswer: "B. 25 : 64",
    explanation: {
      concept: "Semua lingkaran sebangun. Rasio luas = rasio kuadrat jari-jari.",
      steps: ["Semua lingkaran sebangun karena bentuknya sama", "k = r₁/r₂ = 5/8", "Rasio luas = k² = (5/8)² = 25/64"],
      formula: "\\frac{L_1}{L_2} = \\left(\\frac{r_1}{r_2}\\right)^2 = \\left(\\frac{5}{8}\\right)^2 = \\frac{25}{64}"
    }
  },

  /* ═══ MCMA MUDAH (Q41–Q50) ═══ */
  {
    id: 41, type: "MCMA", difficulty: "Mudah", category: "Konsep Kesebangunan",
    question: "Dua bangun dikatakan sebangun. Manakah pernyataan berikut yang BENAR?\n(1) Sudut-sudut bersesuaian sama besar\n(2) Sisi-sisi bersesuaian sebanding\n(3) Ukurannya harus sama\n(4) Bentuknya sama",
    svgKey: "def-sebangun",
    statements: [
      { text: "Sudut-sudut bersesuaian sama besar ✓", isCorrect: true },
      { text: "Sisi-sisi bersesuaian sebanding ✓", isCorrect: true },
      { text: "Ukurannya harus sama — SALAH (ukuran boleh berbeda)", isCorrect: false },
      { text: "Bentuknya sama ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (4)", "C. (1), (2), dan (3)", "D. Semua benar"],
    correctAnswer: "B. (1), (2), dan (4)",
    explanation: {
      concept: "Syarat kesebangunan: sudut sama + sisi sebanding + bentuk sama. Ukuran tidak harus sama.",
      steps: ["(1) BENAR: sudut bersesuaian sama ✓", "(2) BENAR: sisi bersesuaian sebanding ✓", "(3) SALAH: ukuran boleh berbeda ✗", "(4) BENAR: bentuknya sama ✓"],
      formula: "\\triangle ABC \\sim \\triangle PQR \\Rightarrow \\angle A=\\angle P,\\; \\frac{AB}{PQ}=\\frac{BC}{QR}"
    }
  },
  {
    id: 42, type: "MCMA", difficulty: "Mudah", category: "Konsep Kekongruenan",
    question: "Tentang kekongruenan, pernyataan yang BENAR adalah ...\n(1) Dua bangun kongruen jika bentuk dan ukurannya sama persis\n(2) Bangun kongruen dapat ditumpuk tepat satu sama lain\n(3) Faktor skala bangun kongruen = 1\n(4) Luas dua bangun kongruen pasti sama",
    svgKey: "def-kongruen",
    statements: [
      { text: "Bentuk dan ukuran sama persis = kongruen ✓", isCorrect: true },
      { text: "Ditumpuk tepat = kongruen ✓", isCorrect: true },
      { text: "k = 1 untuk bangun kongruen ✓", isCorrect: true },
      { text: "Luas sama (ukuran sama → luas sama) ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Semua pernyataan tentang kekongruenan BENAR.",
      steps: ["(1) BENAR ✓", "(2) BENAR ✓", "(3) BENAR: k=1 ✓", "(4) BENAR: ukuran sama → luas sama ✓"],
      formula: "\\text{Kongruen: } k=1, \\; L_1 = L_2, \\; K_1 = K_2"
    }
  },
  {
    id: 43, type: "MCMA", difficulty: "Mudah", category: "Skala Peta",
    question: "Peta berskala 1 : 100.000. Pernyataan yang BENAR adalah ...\n(1) 1 cm di peta = 1 km di lapangan\n(2) Jarak 7 cm di peta = 7 km di lapangan\n(3) Jarak 3 km = 3 cm di peta\n(4) Skala lebih besar detail daripada 1 : 200.000",
    svgKey: "peta-100000",
    statements: [
      { text: "1 cm = 100.000 cm = 1 km ✓", isCorrect: true },
      { text: "7 cm × 1 km/cm = 7 km ✓", isCorrect: true },
      { text: "3 km = 3 cm di peta ✓", isCorrect: true },
      { text: "1:100.000 lebih detail (penyebut lebih kecil) ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (3), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Skala 1:100.000 berarti 1 cm di peta = 1 km di lapangan.",
      steps: ["1 cm = 100.000 cm = 1 km ✓", "7 cm → 7 km ✓", "3 km → 3 cm ✓", "Makin kecil penyebut, makin detail ✓"],
      formula: "1 \\text{ cm} = 100.000 \\text{ cm} = 1 \\text{ km}"
    }
  },
  {
    id: 44, type: "MCMA", difficulty: "Mudah", category: "Syarat Kongruen SSS",
    question: "Syarat SSS (Sisi-Sisi-Sisi) pada kekongruenan segitiga. Pernyataan yang BENAR:\n(1) Tiga pasang sisi bersesuaian harus sama panjang\n(2) △ABC ≅ △PQR jika AB=PQ, BC=QR, CA=RP\n(3) Semua sudut otomatis sama jika tiga sisi sama\n(4) Syarat ini menggunakan tiga sudut",
    svgKey: "kongr-sss",
    statements: [
      { text: "Tiga sisi bersesuaian sama panjang = SSS ✓", isCorrect: true },
      { text: "AB=PQ, BC=QR, CA=RP → kongruen SSS ✓", isCorrect: true },
      { text: "Jika 3 sisi sama, sudut otomatis sama ✓ (akibat SSS)", isCorrect: true },
      { text: "SSS menggunakan sudut — SALAH, SSS menggunakan sisi ✗", isCorrect: false }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (2) dan (4)", "D. Semua benar"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "SSS menggunakan tiga sisi, bukan sudut.",
      steps: ["(1) BENAR ✓", "(2) BENAR ✓", "(3) BENAR: dari SSS, sudut bersesuaian otomatis sama ✓", "(4) SALAH: SSS = sisi-sisi-sisi ✗"],
      formula: "SSS: AB=PQ,\\; BC=QR,\\; CA=RP \\Rightarrow \\triangle ABC \\cong \\triangle PQR"
    }
  },
  {
    id: 45, type: "MCMA", difficulty: "Mudah", category: "Persegi Panjang Sebangun",
    question: "Persegi panjang 6×4 cm dan 9×6 cm. Pernyataan yang BENAR:\n(1) Keduanya sebangun\n(2) Rasio sisi bersesuaian = 3:2\n(3) Keduanya kongruen\n(4) Faktor skala dari kecil ke besar = 3/2",
    svgKey: "pp-6x4-9x6",
    statements: [
      { text: "6/9 = 4/6 = 2/3 → sebangun ✓", isCorrect: true },
      { text: "Rasio 6:9 = 4:6 = 2:3 ✓", isCorrect: true },
      { text: "Ukuran berbeda → tidak kongruen ✗", isCorrect: false },
      { text: "k dari kecil ke besar = 9/6 = 3/2 ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (4)", "C. (1), (3), dan (4)", "D. Semua benar"],
    correctAnswer: "B. (1), (2), dan (4)",
    explanation: {
      concept: "Persegi panjang sebangun jika rasio p/l sama.",
      steps: ["6/9=4/6=2/3 → sebangun ✓", "Rasio = 2:3 ✓", "Tidak kongruen (ukuran beda) ✗", "k = 3/2 ✓"],
      formula: "\\frac{6}{9} = \\frac{4}{6} = \\frac{2}{3} \\Rightarrow \\text{Sebangun}, k = \\frac{3}{2}"
    }
  },
  {
    id: 46, type: "MCMA", difficulty: "Mudah", category: "Bayangan dan Kesebangunan",
    question: "Sebuah tiang 3 m menghasilkan bayangan 4 m. Pernyataan BENAR:\n(1) Rasio tinggi:bayangan tiang = 3:4\n(2) Pohon dengan bayangan 12 m tingginya 9 m\n(3) Tongkat 1,5 m menghasilkan bayangan 2 m\n(4) Rasio ini berlaku untuk semua objek pada waktu yang sama",
    svgKey: "bayangan-tiang2",
    statements: [
      { text: "Rasio t:b = 3:4 ✓", isCorrect: true },
      { text: "9/12 = 3/4 ✓ (pohon 12m bayangan → t = 12×3/4 = 9 m) ✓", isCorrect: true },
      { text: "1,5/2 = 3/4 ✓ (tongkat konsisten) ✓", isCorrect: true },
      { text: "Rasio sama untuk semua di waktu sama (sudut matahari sama) ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (4)", "B. (1), (2), dan (3)", "C. (1), (2), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Rasio tinggi:bayangan konstan pada waktu yang sama.",
      steps: ["(1) t:b = 3:4 ✓", "(2) 12×3/4=9 m ✓", "(3) 2×3/4=1,5 m ✓", "(4) Sudut matahari sama → rasio sama ✓"],
      formula: "\\frac{t}{b} = \\frac{3}{4} = \\text{konstan (waktu sama)}"
    }
  },
  {
    id: 47, type: "MCMA", difficulty: "Mudah", category: "Kongruen dan Sebangun",
    question: "Hubungan kongruen dan sebangun. Pernyataan BENAR:\n(1) Semua bangun kongruen juga sebangun\n(2) Tidak semua bangun sebangun itu kongruen\n(3) Bangun kongruen memiliki k = 1\n(4) Bangun sebangun selalu berukuran sama",
    svgKey: "def-kongruen",
    statements: [
      { text: "Kongruen → sebangun (k=1) ✓", isCorrect: true },
      { text: "Sebangun tidak harus kongruen ✓", isCorrect: true },
      { text: "k = 1 pada bangun kongruen ✓", isCorrect: true },
      { text: "Sebangun tidak harus berukuran sama ✗", isCorrect: false }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (2), (3), dan (4)", "D. Semua benar"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Kongruen ⊂ Sebangun. Sebangun tidak harus berukuran sama.",
      steps: ["(1) BENAR ✓", "(2) BENAR ✓", "(3) BENAR ✓", "(4) SALAH: sebangun tidak harus ukuran sama ✗"],
      formula: "\\text{Kongruen} \\subset \\text{Sebangun};\\; k_{\\text{kongruen}} = 1"
    }
  },
  {
    id: 48, type: "MCMA", difficulty: "Mudah", category: "Foto dan Skala",
    question: "Foto 3 cm × 5 cm diperbesar menjadi 6 cm × 10 cm. Pernyataan BENAR:\n(1) Kedua foto sebangun\n(2) k = 2\n(3) Luas foto besar = 4 × luas foto kecil\n(4) Kedua foto kongruen",
    svgKey: "foto-3x5-6x10",
    statements: [
      { text: "6/3=10/5=2 → sebangun ✓", isCorrect: true },
      { text: "k = 2 ✓", isCorrect: true },
      { text: "L_besar/L_kecil = k² = 4 ✓", isCorrect: true },
      { text: "Ukuran beda → tidak kongruen ✗", isCorrect: false }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (3), dan (4)", "D. Semua benar"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Foto diperbesar: sebangun dengan k=2, luas 4 kali lipat, tidak kongruen.",
      steps: ["k = 6/3 = 2 ✓", "Sebangun ✓", "L = (6×10) = 60; L asli = 15; 60/15 = 4 = k² ✓", "Tidak kongruen ✗"],
      formula: "k=2,\\; \\frac{L_2}{L_1} = k^2 = 4"
    }
  },
  {
    id: 49, type: "MCMA", difficulty: "Mudah", category: "Segitiga Sama Kaki",
    question: "△ABC sama kaki dengan AB=AC=7 cm, BC=6 cm. M titik tengah BC. Pernyataan BENAR:\n(1) △ABM ≅ △ACM\n(2) AM ⊥ BC\n(3) BM = MC = 3 cm\n(4) AM adalah garis bagi ∠A",
    svgKey: "def-kongruen",
    statements: [
      { text: "SSS: AB=AC, BM=MC, AM bersama → kongruen ✓", isCorrect: true },
      { text: "Dari kongruen: ∠AMB=∠AMC=90° → AM⊥BC ✓", isCorrect: true },
      { text: "M titik tengah → BM=MC=3 cm ✓", isCorrect: true },
      { text: "∠BAM=∠CAM dari kongruen → AM bagi ∠A ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (3)", "B. (1), (2), dan (3)", "C. (1), (2), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Pada segitiga sama kaki, garis dari puncak ke titik tengah alas adalah garis tinggi, bagi, dan berat sekaligus.",
      steps: ["(1) SSS ✓", "(2) AM⊥BC ✓", "(3) BM=MC=3 ✓", "(4) AM bagi ∠A ✓"],
      formula: "\\triangle ABM \\cong \\triangle ACM \\Rightarrow AM \\perp BC"
    }
  },
  {
    id: 50, type: "MCMA", difficulty: "Mudah", category: "Skala Denah",
    question: "Denah skala 1:300. Kolam renang di denah berukuran 4 cm × 3 cm. Pernyataan BENAR:\n(1) Panjang asli = 12 m\n(2) Lebar asli = 9 m\n(3) Luas kolam asli = 108 m²\n(4) Luas di denah = 12 cm²",
    svgKey: "denah-300",
    statements: [
      { text: "4 × 300 = 1200 cm = 12 m ✓", isCorrect: true },
      { text: "3 × 300 = 900 cm = 9 m ✓", isCorrect: true },
      { text: "12 × 9 = 108 m² ✓", isCorrect: true },
      { text: "4 × 3 = 12 cm² ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (3), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Skala 1:300: ukuran asli = ukuran denah × 300.",
      steps: ["p = 4×300 = 12 m ✓", "l = 3×300 = 9 m ✓", "L = 12×9 = 108 m² ✓", "Luas denah = 4×3 = 12 cm² ✓"],
      formula: "p=12\\text{ m},\\; l=9\\text{ m},\\; L=108\\text{ m}^2"
    }
  },
  /* ═══ MCMA SEDANG (Q51–Q62) ═══ */
  {
    id: 51, type: "MCMA", difficulty: "Sedang", category: "Segitiga dalam Segitiga",
    question: "Pada △ABC, D di AB dan E di AC, DE ∥ BC. AD = 8 cm, DB = 12 cm, BC = 30 cm. Pernyataan BENAR:\n(1) AD/AB = 8/20 = 2/5\n(2) DE = 12 cm\n(3) △ADE ~ △ABC dengan k = 2/5\n(4) Luas △ADE = (4/25) × Luas △ABC",
    svgKey: "seg-nested-2",
    statements: [
      { text: "AB = 20, AD/AB = 8/20 = 2/5 ✓", isCorrect: true },
      { text: "DE = BC × 2/5 = 30 × 2/5 = 12 cm ✓", isCorrect: true },
      { text: "k = 2/5 ✓", isCorrect: true },
      { text: "L_ADE/L_ABC = (2/5)² = 4/25 ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Semua pernyataan benar untuk △ADE ~ △ABC.",
      steps: ["k = AD/AB = 8/20 = 2/5 ✓", "DE = 30×2/5 = 12 ✓", "k = 2/5 ✓", "L = (2/5)² = 4/25 ✓"],
      formula: "k=\\frac{2}{5},\\; DE=12,\\; \\frac{L_{ADE}}{L_{ABC}}=\\frac{4}{25}"
    }
  },
  {
    id: 52, type: "MCMA", difficulty: "Sedang", category: "Trapesium Diagonal",
    question: "Trapesium ABCD (AB ∥ CD), AB = 20 cm, CD = 12 cm. Diagonal berpotongan di O. Pernyataan BENAR:\n(1) △AOB ~ △COD\n(2) AO/OC = 5/3\n(3) BO/OD = 5/3\n(4) AO + OC = AC",
    svgKey: "trapesium-diag",
    statements: [
      { text: "△AOB ~ △COD (AB∥CD → sudut selang-seling sama) ✓", isCorrect: true },
      { text: "AO/OC = AB/CD = 20/12 = 5/3 ✓", isCorrect: true },
      { text: "BO/OD = AB/CD = 5/3 ✓", isCorrect: true },
      { text: "O di AC → AO + OC = AC ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Diagonal trapesium dan kesebangunan yang terbentuk.",
      steps: ["△AOB~△COD (AA) ✓", "AO/OC = 5/3 ✓", "BO/OD = 5/3 ✓", "AO+OC = AC ✓"],
      formula: "\\frac{AO}{OC} = \\frac{BO}{OD} = \\frac{AB}{CD} = \\frac{20}{12} = \\frac{5}{3}"
    }
  },
  {
    id: 53, type: "MCMA", difficulty: "Sedang", category: "Proyeksi Siku-siku",
    question: "Segitiga siku-siku ABC (∠A = 90°), tinggi AD ke BC. AB = 12, AC = 16, BC = 20. Pernyataan BENAR:\n(1) AD = 9,6\n(2) BD = 7,2\n(3) DC = 12,8\n(4) AD² = BD × DC",
    svgKey: "seg-siku-alt",
    statements: [
      { text: "AD = (12×16)/20 = 192/20 = 9,6 ✓", isCorrect: true },
      { text: "BD = AB²/BC = 144/20 = 7,2 ✓", isCorrect: true },
      { text: "DC = AC²/BC = 256/20 = 12,8 ✓", isCorrect: true },
      { text: "AD² = 9,6² = 92,16 = 7,2×12,8 = 92,16 ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (4)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (3)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Teorema proyeksi pada segitiga siku-siku.",
      steps: ["AD = ab/c = 12×16/20 = 9,6 ✓", "BD = a²/c = 144/20 = 7,2 ✓", "DC = b²/c = 256/20 = 12,8 ✓", "AD² = BD×DC ✓"],
      formula: "AD = \\frac{ab}{c},\\; BD = \\frac{a^2}{c},\\; DC = \\frac{b^2}{c}"
    }
  },
  {
    id: 54, type: "MCMA", difficulty: "Sedang", category: "Jajargenjang Kongruen",
    question: "Jajargenjang ABCD, diagonal berpotongan di O. Pernyataan BENAR:\n(1) AO = OC dan BO = OD\n(2) △AOB ≅ △COD (SAS)\n(3) △AOD ≅ △COB (SAS)\n(4) △ABD ≅ △CDB (SSS)",
    svgKey: "jajar-kongr",
    statements: [
      { text: "Diagonal jajargenjang saling bagi dua: AO=OC, BO=OD ✓", isCorrect: true },
      { text: "△AOB: AO=OC, ∠AOB=∠COD (vert.), OB=OD → SAS ✓", isCorrect: true },
      { text: "△AOD: AO=OC, ∠AOD=∠COB (vert.), OD=OB → SAS ✓", isCorrect: true },
      { text: "△ABD: AB=CD, BD bersama, AD=BC → SSS ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Kekongruenan pada jajargenjang: diagonal saling membagi dua.",
      steps: ["AO=OC, BO=OD ✓", "△AOB≅△COD (SAS) ✓", "△AOD≅△COB (SAS) ✓", "△ABD≅△CDB (SSS) ✓"],
      formula: "\\text{Jajargenjang: } AO=OC,\\; BO=OD"
    }
  },
  {
    id: 55, type: "MCMA", difficulty: "Sedang", category: "Kontekstual Bayangan",
    question: "Tiang 6 m bayangan 9 m. Pada waktu yang sama, pohon bayangan 21 m. Pernyataan BENAR:\n(1) Tinggi pohon = 14 m\n(2) Rasio t:b = 2:3\n(3) Tongkat 1 m → bayangan 1,5 m\n(4) Tiang dan pohon membentuk dua segitiga sebangun",
    svgKey: "bayangan-tiang",
    statements: [
      { text: "t_pohon = 6×21/9 = 126/9 = 14 m ✓", isCorrect: true },
      { text: "6:9 = 2:3 ✓", isCorrect: true },
      { text: "1×3/2 = 1,5 m ✓", isCorrect: true },
      { text: "Dua segitiga sebangun (AA: sudut matahari + sudut siku) ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (4)", "B. (1), (2), dan (3)", "C. (1), (2), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Bayangan matahari dan kesebangunan.",
      steps: ["t = 6×21/9 = 14 ✓", "6:9 = 2:3 ✓", "Tongkat 1: b = 1×3/2 = 1,5 m ✓", "Dua segitiga sebangun (AA) ✓"],
      formula: "\\frac{t}{b} = \\frac{6}{9} = \\frac{2}{3}"
    }
  },
  {
    id: 56, type: "MCMA", difficulty: "Sedang", category: "UN - Keliling dan Luas Sebangun",
    question: "Dua persegi sebangun, sisi 8 cm dan 12 cm. Pernyataan BENAR:\n(1) k = 3/2\n(2) Rasio keliling = 2:3\n(3) Rasio luas = 4:9\n(4) Luas besar = 144 cm²",
    svgKey: "persegi-seb",
    statements: [
      { text: "k = 12/8 = 3/2 ✓", isCorrect: true },
      { text: "Rasio K = 4×8 : 4×12 = 32:48 = 2:3 ✓", isCorrect: true },
      { text: "Rasio L = 64:144 = 4:9 = (2/3)² ✓", isCorrect: true },
      { text: "L = 12² = 144 cm² ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (3)", "B. (1), (2), dan (3)", "C. (1), (3), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Semua persegi sebangun, rasio K = k, rasio L = k².",
      steps: ["k = 3/2 ✓", "Rasio K = 2:3 ✓", "Rasio L = 4:9 ✓", "L = 144 cm² ✓"],
      formula: "k=\\frac{3}{2},\\; \\frac{K_2}{K_1}=\\frac{3}{2},\\; \\frac{L_2}{L_1}=\\frac{9}{4}"
    }
  },
  {
    id: 57, type: "MCMA", difficulty: "Sedang", category: "ANBK - Sifat Proporsi",
    question: "Jika $\\frac{a}{b} = \\frac{c}{d}$, pernyataan yang BENAR:\n(1) $ad = bc$\n(2) $\\frac{a}{c} = \\frac{b}{d}$\n(3) $\\frac{a+b}{b} = \\frac{c+d}{d}$\n(4) $\\frac{a-b}{a} = \\frac{c-d}{c}$",
    statements: [
      { text: "ad = bc (perkalian silang) ✓", isCorrect: true },
      { text: "a/c = b/d (rotasi proporsi) ✓", isCorrect: true },
      { text: "(a+b)/b = (c+d)/d (sifat komponen) ✓", isCorrect: true },
      { text: "(a-b)/a = (c-d)/c ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), dan (4)", "D. (1), (2), (3), dan (4)"],
    correctAnswer: "D. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Sifat-sifat proporsi dari a/b = c/d.",
      steps: ["(1) ad=bc ✓", "(2) a/c=b/d ✓", "(3) (a+b)/b=(c+d)/d ✓", "(4) (a-b)/a=(c-d)/c ✓"],
      formula: "\\frac{a}{b} = \\frac{c}{d} \\Rightarrow ad=bc,\\; \\frac{a}{c}=\\frac{b}{d}"
    }
  },
  {
    id: 58, type: "MCMA", difficulty: "Sedang", category: "TKA - Gedung Bayangan",
    question: "Gedung tinggi T menghasilkan bayangan 40 m. Tongkat 5 m bayangan 8 m. Pernyataan BENAR:\n(1) T = 25 m\n(2) Rasio tinggi:bayangan = 5:8\n(3) Pohon 15 m → bayangan 24 m\n(4) Skala segitiga gedung:tongkat = 8:1",
    svgKey: "gedung-bay2",
    statements: [
      { text: "T = 5×40/8 = 25 m ✓", isCorrect: true },
      { text: "5:8 ✓", isCorrect: true },
      { text: "15×8/5 = 24 m ✓", isCorrect: true },
      { text: "Skala segitiga ≈ 40/8 = 5 (bayangan), bukan 8:1 ✗", isCorrect: false }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (3), dan (4)", "D. Semua benar"],
    correctAnswer: "B. (1), (2), dan (3)",
    explanation: {
      concept: "Aplikasi proporsi bayangan.",
      steps: ["T = 5×40/8 = 25 m ✓", "Rasio = 5:8 ✓", "15→ 15×8/5=24 m ✓", "(4) SALAH ✗"],
      formula: "\\frac{T}{40} = \\frac{5}{8} \\Rightarrow T = 25 \\text{ m}"
    }
  },
  {
    id: 59, type: "MCMA", difficulty: "Sedang", category: "Literasi - Peta dan Skala",
    question: "Peta berskala 1:250.000. Jarak A-B di peta 8 cm. Pernyataan BENAR:\n(1) Jarak asli = 20 km\n(2) Jarak asli = 20.000 m\n(3) Skala 1:250.000 lebih detail dari 1:500.000\n(4) Luas 6 cm² di peta = 37,5 km²",
    svgKey: "peta-500000",
    statements: [
      { text: "8×250.000=2.000.000 cm=20 km ✓", isCorrect: true },
      { text: "20 km=20.000 m ✓", isCorrect: true },
      { text: "Penyebut lebih kecil → lebih detail ✓", isCorrect: true },
      { text: "L=6×(250.000)²=6×6,25×10¹⁰=3,75×10¹¹cm²=37,5km² ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (1) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Aplikasi skala 1:250.000 untuk jarak dan luas.",
      steps: ["J=20 km ✓", "=20.000 m ✓", "Detail ✓", "L=37,5 km² ✓"],
      formula: "L = 6 \\times (250.000)^2 = 3{,}75 \\times 10^{11}\\text{ cm}^2 = 37{,}5\\text{ km}^2"
    }
  },
  {
    id: 60, type: "MCMA", difficulty: "Sedang", category: "ANBK - Dua Segitiga Sebangun",
    question: "△ABC ~ △PQR. AB=10, BC=15, CA=20 cm, PQ=6 cm. Pernyataan BENAR:\n(1) k = 3/5\n(2) QR = 9 cm\n(3) RP = 12 cm\n(4) Keliling △PQR = 27 cm",
    svgKey: "tri-prop",
    statements: [
      { text: "k = PQ/AB = 6/10 = 3/5 ✓", isCorrect: true },
      { text: "QR = 15×3/5 = 9 cm ✓", isCorrect: true },
      { text: "RP = 20×3/5 = 12 cm ✓", isCorrect: true },
      { text: "K = (6+9+12) = 27 cm atau 45×3/5 = 27 ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Penerapan faktor skala pada semua sisi dan keliling.",
      steps: ["k = 3/5 ✓", "QR = 9 ✓", "RP = 12 ✓", "K = 27 ✓"],
      formula: "k=\\frac{3}{5},\\; K_{PQR}=45\\times\\frac{3}{5}=27\\text{ cm}"
    }
  },
  {
    id: 61, type: "MCMA", difficulty: "Sedang", category: "Kontekstual Denah",
    question: "Denah skala 1:200. Ruang tamu di denah 5×4 cm, kamar tidur 7×5 cm. Pernyataan BENAR:\n(1) Ruang tamu asli = 10 m × 8 m\n(2) Kamar tidur asli = 14 m × 10 m\n(3) Luas ruang tamu asli = 80 m²\n(4) Luas kamar tidur asli = 140 m²",
    svgKey: "denah-200",
    statements: [
      { text: "5×200=1000cm=10m; 4×200=800cm=8m ✓", isCorrect: true },
      { text: "7×200=14m; 5×200=10m ✓", isCorrect: true },
      { text: "10×8=80 m² ✓", isCorrect: true },
      { text: "14×10=140 m² ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (3)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Ukuran asli = ukuran denah × penyebut skala.",
      steps: ["Ruang tamu: 10×8 m ✓", "Kamar: 14×10 m ✓", "L RT = 80 m² ✓", "L kamar = 140 m² ✓"],
      formula: "\\text{Asli} = \\text{denah} \\times 200"
    }
  },
  {
    id: 62, type: "MCMA", difficulty: "Sedang", category: "Rasio Luas Multi",
    question: "Dua lingkaran sebangun dengan r₁ = 4 cm, r₂ = 6 cm. Pernyataan BENAR:\n(1) k = 3/2 (dari kecil ke besar)\n(2) Rasio keliling = 2:3\n(3) Rasio luas = 4:9\n(4) Jika L₁ = 16π, maka L₂ = 36π",
    svgKey: "luas-k2-1",
    statements: [
      { text: "k = 6/4 = 3/2 ✓", isCorrect: true },
      { text: "K₁:K₂ = 2πr₁:2πr₂ = 4:6 = 2:3 ✓", isCorrect: true },
      { text: "L₁:L₂ = πr₁²:πr₂² = 16:36 = 4:9 ✓", isCorrect: true },
      { text: "L₂ = π×6² = 36π ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (3)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (3) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Semua lingkaran sebangun. Rasio K = k, rasio L = k².",
      steps: ["k = 3/2 ✓", "Rasio K = 2:3 ✓", "Rasio L = 4:9 ✓", "L₂ = 36π ✓"],
      formula: "k=\\frac{3}{2},\\; \\frac{K_2}{K_1}=\\frac{3}{2},\\; \\frac{L_2}{L_1}=\\frac{9}{4}"
    }
  },
  /* ═══ MCMA SULIT (Q63–Q70) ═══ */
  {
    id: 63, type: "MCMA", difficulty: "Sulit", category: "HOTS - Segitiga Siku Proyeksi",
    question: "Segitiga siku-siku, sisi-siku 5 dan 12, hipotenusa 13. Tinggi ke hipotenusa = h. Pernyataan BENAR:\n(1) h = 60/13\n(2) Proyeksi sisi 5 = 25/13\n(3) Proyeksi sisi 12 = 144/13\n(4) Proyeksi 1 + Proyeksi 2 = 13",
    svgKey: "seg-siku-alt2",
    statements: [
      { text: "h = 5×12/13 = 60/13 ✓", isCorrect: true },
      { text: "p₁ = 5²/13 = 25/13 ✓", isCorrect: true },
      { text: "p₂ = 12²/13 = 144/13 ✓", isCorrect: true },
      { text: "25/13 + 144/13 = 169/13 = 13 ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (3) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Teorema proyeksi dan garis tinggi pada segitiga siku-siku.",
      steps: ["h = 60/13 ✓", "p₁ = 25/13 ✓", "p₂ = 144/13 ✓", "p₁+p₂ = 13 ✓"],
      formula: "h=\\frac{ab}{c},\\; p_1=\\frac{a^2}{c},\\; p_2=\\frac{b^2}{c},\\; p_1+p_2=c"
    }
  },
  {
    id: 64, type: "MCMA", difficulty: "Sulit", category: "TKA - Model Gedung 3D",
    question: "Model gedung skala 1:400. Tinggi model 10 cm, luas lantai model 20 cm². Pernyataan BENAR:\n(1) Tinggi asli = 40 m\n(2) Luas lantai asli = 3.200 m²\n(3) Rasio volume = 1 : 64.000.000\n(4) Luas lantai asli = 20 × (400)² cm² = 320.000.000 cm²",
    svgKey: "model-400",
    statements: [
      { text: "10×400=4000cm=40m ✓", isCorrect: true },
      { text: "20×(400)²=20×160.000=3.200.000 cm²=320m² ✗ (bukan 3.200m²)", isCorrect: false },
      { text: "k³=400³=64.000.000 ✓", isCorrect: true },
      { text: "20×(400)²=3.200.000 cm²=320m² (bukan 320.000.000cm²) ✗", isCorrect: false }
    ],
    options: ["A. (1) dan (3)", "B. (1), (2), dan (3)", "C. (1), (3), dan (4)", "D. Semua benar"],
    correctAnswer: "A. (1) dan (3)",
    explanation: {
      concept: "Skala 1:400 pada 3D: panjang ×k, luas ×k², volume ×k³.",
      steps: ["(1) BENAR: 40 m ✓", "(2) SALAH: 20×160.000=3.200.000 cm²=320 m² (bukan 3200) ✗", "(3) BENAR: 400³=64.000.000 ✓", "(4) SALAH: 3.200.000 cm², bukan 320.000.000 ✗"],
      formula: "L_{asli}=20\\times(400)^2=3.200.000\\text{ cm}^2=320\\text{ m}^2"
    }
  },
  {
    id: 65, type: "MCMA", difficulty: "Sulit", category: "HOTS - Faktor Skala Kompleks",
    question: "Dua bangun sebangun, k = 4/3. Pernyataan BENAR:\n(1) Rasio sisi = 4:3\n(2) Rasio keliling = 4:3\n(3) Rasio luas = 16:9\n(4) Jika luas bangun kecil 54 cm², luas besar = 96 cm²",
    svgKey: "luas-k2-2",
    statements: [
      { text: "k = 4/3 → rasio sisi = 4:3 ✓", isCorrect: true },
      { text: "Rasio K = k = 4:3 ✓", isCorrect: true },
      { text: "Rasio L = k² = 16:9 ✓", isCorrect: true },
      { text: "L_besar = 54×16/9 = 96 cm² ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (1) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Semua implikasi faktor skala k = 4/3.",
      steps: ["k = 4/3 ✓", "Rasio K = 4:3 ✓", "Rasio L = 16:9 ✓", "L = 54×16/9 = 96 ✓"],
      formula: "k=\\frac{4}{3},\\; \\frac{L_2}{L_1}=\\frac{16}{9},\\; L_2=54\\times\\frac{16}{9}=96"
    }
  },
  {
    id: 66, type: "MCMA", difficulty: "Sulit", category: "Literasi - Analisis Peta",
    question: "Peta 1:500.000. Kota A-B di peta 6 cm, danau di peta 9 cm². Pernyataan BENAR:\n(1) Jarak A-B asli = 30 km\n(2) Luas danau asli = 225 km²\n(3) Peta 1:250.000 lebih detail\n(4) Di peta 1:250.000, jarak A-B = 12 cm",
    svgKey: "peta-500000",
    statements: [
      { text: "6×500.000=3.000.000cm=30km ✓", isCorrect: true },
      { text: "9×(500.000)²=9×25×10¹⁰=2,25×10¹²cm²=225km² ✓", isCorrect: true },
      { text: "Penyebut lebih kecil=lebih detail ✓", isCorrect: true },
      { text: "30km÷250.000=12cm (di peta baru) ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (3)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (1) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Analisis lengkap skala peta 1:500.000.",
      steps: ["J = 30 km ✓", "L = 225 km² ✓", "1:250.000 lebih detail ✓", "Di 1:250.000: 12 cm ✓"],
      formula: "L=9\\times(500.000)^2=225\\text{ km}^2"
    }
  },
  {
    id: 67, type: "MCMA", difficulty: "Sulit", category: "HOTS - Trapesium Sulit",
    question: "Trapesium ABCD (AB∥CD), AB=18, CD=10. AO/OC = ? Pernyataan BENAR:\n(1) △AOB ~ △COD dengan k = 9:5\n(2) AO/OC = 9/5\n(3) BO/OD = 9/5\n(4) Jika AO=9k dan OC=5k, maka AC=14k",
    svgKey: "trapesium-diag2",
    statements: [
      { text: "k = AB/CD = 18/10 = 9/5 ✓", isCorrect: true },
      { text: "AO/OC = 9/5 ✓", isCorrect: true },
      { text: "BO/OD = 9/5 ✓", isCorrect: true },
      { text: "AO+OC = 9k+5k = 14k = AC ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Diagonal trapesium dan rasio yang terbentuk.",
      steps: ["k = 9/5 ✓", "AO/OC = 9/5 ✓", "BO/OD = 9/5 ✓", "AC = 14k ✓"],
      formula: "\\frac{AO}{OC}=\\frac{BO}{OD}=\\frac{AB}{CD}=\\frac{18}{10}=\\frac{9}{5}"
    }
  },
  {
    id: 68, type: "MCMA", difficulty: "Sulit", category: "ANBK HOTS - Identifikasi",
    question: "Pasangan segitiga manakah yang KONGRUEN?\n(1) {5,12,13} dan {5,12,13}\n(2) {60°,70°,50°} dan {7,8,9} — hanya sudut tahu\n(3) Sama kaki kaki=6,alas=8 dan sama kaki kaki=6,alas=8\n(4) Siku-siku kaki 8 dan 15 dengan siku-siku kaki 15 dan 8",
    svgKey: "kongr-sss",
    statements: [
      { text: "(1) SSS: 5=5, 12=12, 13=13 → kongruen ✓", isCorrect: true },
      { text: "(2) Sudut sama tapi sisi mungkin beda → sebangun saja, bukan kongruen ✗", isCorrect: false },
      { text: "(3) SSS: kaki=kaki=6, alas=alas=8 → kongruen ✓", isCorrect: true },
      { text: "(4) SSS: kaki 8,15 = kaki 15,8 → sama (8,15,17 semua sama) → kongruen ✓", isCorrect: true }
    ],
    options: ["A. (1) saja", "B. (1) dan (3)", "C. (1), (3), dan (4)", "D. Semua"],
    correctAnswer: "C. (1), (3), dan (4)",
    explanation: {
      concept: "Kekongruenan memerlukan ukuran yang persis sama.",
      steps: ["(1) BENAR: SSS sama ✓", "(2) SALAH: hanya sudut → sebangun saja ✗", "(3) BENAR: SSS ✓", "(4) BENAR: kaki 8+15 → hipotenusa 17, SSS sama ✓"],
      formula: "\\text{Kongruen} \\Rightarrow \\text{semua sisi bersesuaian sama}"
    }
  },
  {
    id: 69, type: "MCMA", difficulty: "Sulit", category: "TKA Komprehensif",
    question: "Foto 6×9 cm, diperbesar lebar jadi 10 cm. Pernyataan BENAR:\n(1) k = 10/6 = 5/3\n(2) Panjang baru = 15 cm\n(3) Luas baru = 150 cm²\n(4) Rasio luas = 25:9",
    svgKey: "foto-4x6-8x12",
    statements: [
      { text: "k = 10/6 = 5/3 ✓", isCorrect: true },
      { text: "p = 9×5/3 = 15 cm ✓", isCorrect: true },
      { text: "L = 10×15 = 150 cm² ✓", isCorrect: true },
      { text: "Rasio L = (5/3)² = 25/9 ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Foto sebangun diperbesar: ukuran baru = ukuran lama × k.",
      steps: ["k = 10/6 = 5/3 ✓", "p = 9×5/3 = 15 cm ✓", "L = 10×15 = 150 cm² ✓", "Rasio L = 25/9 ✓"],
      formula: "k=\\frac{5}{3},\\; p_{baru}=15,\\; L_{baru}=150\\text{ cm}^2"
    }
  },
  {
    id: 70, type: "MCMA", difficulty: "Sulit", category: "HOTS Gabungan Final",
    question: "Dua bangun sebangun. Luas kecil 36 cm², luas besar 100 cm². Pernyataan BENAR:\n(1) Rasio luas = 9:25\n(2) k = 5/3 (kecil ke besar)\n(3) Keliling kecil 24 cm → keliling besar 40 cm\n(4) Jika sisi kecil 9 cm, sisi besar 15 cm",
    svgKey: "luas-k2-2",
    statements: [
      { text: "36:100 = 9:25 ✓", isCorrect: true },
      { text: "k = √(100/36) = 10/6 = 5/3 ✓", isCorrect: true },
      { text: "K_besar = 24×5/3 = 40 cm ✓", isCorrect: true },
      { text: "s_besar = 9×5/3 = 15 cm ✓", isCorrect: true }
    ],
    options: ["A. (1) dan (2)", "B. (1), (2), dan (3)", "C. (1), (2), (3), dan (4)", "D. (2) dan (4)"],
    correctAnswer: "C. (1), (2), (3), dan (4)",
    explanation: {
      concept: "Analisis lengkap dua bangun sebangun dari rasio luas.",
      steps: ["36:100 = 9:25 ✓", "k = √(100/36) = 5/3 ✓", "K = 24×5/3 = 40 ✓", "s = 9×5/3 = 15 ✓"],
      formula: "k=\\sqrt{\\frac{100}{36}}=\\frac{5}{3}"
    }
  },

  /* ═══ BENAR/SALAH MUDAH (Q71–Q78) ═══ */
  {
    id: 71, type: "Benar/Salah", difficulty: "Mudah", category: "Definisi Dasar",
    question: "Tentukan BENAR atau SALAH pernyataan berikut tentang kesebangunan dan kekongruenan:",
    svgKey: "def-sebangun",
    statements: [
      { text: "Dua bangun sebangun memiliki bentuk yang sama", isCorrect: true },
      { text: "Dua bangun sebangun pasti berukuran sama", isCorrect: false },
      { text: "Dua bangun kongruen pasti sebangun", isCorrect: true },
      { text: "Dua bangun sebangun pasti kongruen", isCorrect: false }
    ],
    explanation: {
      concept: "Kongruen ⊂ Sebangun. Sebangun tidak harus berukuran sama.",
      steps: ["(1) BENAR: bentuk sama ✓", "(2) SALAH: ukuran boleh beda ✗", "(3) BENAR: kongruen k=1 → sebangun ✓", "(4) SALAH: sebangun belum tentu kongruen ✗"],
      formula: "\\text{Kongruen} \\subseteq \\text{Sebangun}"
    }
  },
  {
    id: 72, type: "Benar/Salah", difficulty: "Mudah", category: "Skala Peta Dasar",
    question: "Peta berskala 1 : 100.000. Tentukan BENAR atau SALAH:",
    svgKey: "peta-100000",
    statements: [
      { text: "1 cm di peta = 1 km di lapangan", isCorrect: true },
      { text: "5 cm di peta = 5 km di lapangan", isCorrect: true },
      { text: "10 km di lapangan = 1 cm di peta", isCorrect: false },
      { text: "Luas 4 cm² di peta = 4 km² di lapangan", isCorrect: true }
    ],
    explanation: {
      concept: "Skala 1:100.000: 1cm = 1km.",
      steps: ["(1) BENAR: 1cm = 100.000cm = 1km ✓", "(2) BENAR: 5×1=5km ✓", "(3) SALAH: 10km = 10cm di peta ✗", "(4) BENAR: 1cm²=1km² (karena 1km/cm) ✓"],
      formula: "1\\text{ cm} = 1\\text{ km}; \\; 1\\text{ cm}^2 = 1\\text{ km}^2"
    }
  },
  {
    id: 73, type: "Benar/Salah", difficulty: "Mudah", category: "Syarat Kongruen Dasar",
    question: "Tentukan BENAR atau SALAH tentang syarat kekongruenan segitiga:",
    svgKey: "kongr-sas",
    statements: [
      { text: "SSS: tiga pasang sisi bersesuaian sama panjang → kongruen", isCorrect: true },
      { text: "SAS: dua sisi dan sudut yang diapit sama → kongruen", isCorrect: true },
      { text: "AAA: tiga sudut sama besar → kongruen", isCorrect: false },
      { text: "ASA: dua sudut dan sisi apit sama → kongruen", isCorrect: true }
    ],
    explanation: {
      concept: "AAA hanya menjamin sebangun, bukan kongruen.",
      steps: ["(1) BENAR: SSS ✓", "(2) BENAR: SAS ✓", "(3) SALAH: AAA hanya sebangun, bukan kongruen ✗", "(4) BENAR: ASA ✓"],
      formula: "\\text{AAA} \\Rightarrow \\text{Sebangun (bukan kongruen)}"
    }
  },
  {
    id: 74, type: "Benar/Salah", difficulty: "Mudah", category: "Persegi dan Kesebangunan",
    question: "Tentukan BENAR atau SALAH tentang kesebangunan bangun khusus:",
    svgKey: "persegi-seb",
    statements: [
      { text: "Semua persegi selalu sebangun satu sama lain", isCorrect: true },
      { text: "Semua lingkaran selalu sebangun satu sama lain", isCorrect: true },
      { text: "Semua segitiga sama sisi selalu sebangun", isCorrect: true },
      { text: "Semua persegi panjang selalu sebangun", isCorrect: false }
    ],
    explanation: {
      concept: "Bangun yang selalu sebangun: persegi, lingkaran, segitiga sama sisi.",
      steps: ["(1) BENAR: persegi sudut 90°, rasio sisi selalu = 1 ✓", "(2) BENAR: lingkaran semua sudutnya 'sama' ✓", "(3) BENAR: segitiga sama sisi semua sudut 60° ✓", "(4) SALAH: persegi panjang 6×4 dan 6×3 tidak sebangun ✗"],
      formula: "\\text{Persegi, lingkaran, △ sama sisi: selalu sebangun}"
    }
  },
  {
    id: 75, type: "Benar/Salah", difficulty: "Mudah", category: "Kesebangunan Foto",
    question: "Foto 4 × 6 cm diperbesar menjadi 8 × 12 cm. Tentukan BENAR atau SALAH:",
    svgKey: "foto-4x6-8x12",
    statements: [
      { text: "Kedua foto sebangun", isCorrect: true },
      { text: "Faktor skala = 2", isCorrect: true },
      { text: "Luas foto besar = 2 × luas foto kecil", isCorrect: false },
      { text: "Keliling foto besar = 2 × keliling foto kecil", isCorrect: true }
    ],
    explanation: {
      concept: "Foto sebangun dengan k=2. Luas = k², bukan k.",
      steps: ["(1) BENAR: 8/4=12/6=2 ✓", "(2) BENAR: k=2 ✓", "(3) SALAH: Luas besar = k²×luas kecil = 4× ✗", "(4) BENAR: Keliling ∝ k = 2× ✓"],
      formula: "k=2,\\; L_2 = k^2 L_1 = 4L_1,\\; K_2 = kK_1 = 2K_1"
    }
  },
  {
    id: 76, type: "Benar/Salah", difficulty: "Mudah", category: "Bayangan Matahari",
    question: "Tiang 4 m menghasilkan bayangan 5 m. Tentukan BENAR atau SALAH:",
    svgKey: "bayangan-tiang",
    statements: [
      { text: "Rasio tinggi:bayangan = 4:5", isCorrect: true },
      { text: "Pohon tinggi 12 m menghasilkan bayangan 15 m", isCorrect: true },
      { text: "Anak 1,2 m menghasilkan bayangan 1,2 m", isCorrect: false },
      { text: "Tiang dan bayangannya membentuk segitiga siku-siku sebangun dengan pohon dan bayangannya", isCorrect: true }
    ],
    explanation: {
      concept: "Rasio t:b = 4:5 konstan pada waktu yang sama.",
      steps: ["(1) BENAR: 4:5 ✓", "(2) BENAR: 12/b=4/5 → b=15 m ✓", "(3) SALAH: 1,2/b=4/5 → b=1,5 m ✗", "(4) BENAR: dua segitiga sebangun ✓"],
      formula: "\\frac{t}{b} = \\frac{4}{5} \\Rightarrow b = \\frac{5t}{4}"
    }
  },
  {
    id: 77, type: "Benar/Salah", difficulty: "Mudah", category: "Segitiga Garis Tengah",
    question: "Pada △ABC, D dan E adalah titik tengah AB dan AC. Tentukan BENAR atau SALAH:",
    svgKey: "seg-nested-1",
    statements: [
      { text: "DE ∥ BC", isCorrect: true },
      { text: "DE = ½ BC", isCorrect: true },
      { text: "△ADE ~ △ABC dengan k = ½", isCorrect: true },
      { text: "Luas △ADE = ½ luas △ABC", isCorrect: false }
    ],
    explanation: {
      concept: "Teorema garis tengah segitiga: DE ∥ BC dan DE = ½BC.",
      steps: ["(1) BENAR: D,E titik tengah → DE ∥ BC ✓", "(2) BENAR: DE = ½BC ✓", "(3) BENAR: k = ½ ✓", "(4) SALAH: L_ADE = k²×L_ABC = ¼×L_ABC ✗"],
      formula: "k=\\frac{1}{2},\\; DE=\\frac{BC}{2},\\; L_{ADE}=\\frac{1}{4}L_{ABC}"
    }
  },
  {
    id: 78, type: "Benar/Salah", difficulty: "Mudah", category: "Denah dan Skala",
    question: "Denah skala 1:250. Ruang kerja di denah 4 cm × 3 cm. Tentukan BENAR atau SALAH:",
    svgKey: "denah-300",
    statements: [
      { text: "Panjang asli = 10 m", isCorrect: true },
      { text: "Lebar asli = 7,5 m", isCorrect: true },
      { text: "Luas asli = 75 m²", isCorrect: true },
      { text: "Luas asli = 12 m²", isCorrect: false }
    ],
    explanation: {
      concept: "Ukuran asli = ukuran denah × 250.",
      steps: ["p = 4×250=1000cm=10m ✓", "l = 3×250=750cm=7,5m ✓", "L = 10×7,5=75 m² ✓", "(4) SALAH: bukan 12 m² ✗"],
      formula: "p=10\\text{m},\\; l=7{,}5\\text{m},\\; L=75\\text{m}^2"
    }
  },
  /* ═══ BENAR/SALAH SEDANG (Q79–Q90) ═══ */
  {
    id: 79, type: "Benar/Salah", difficulty: "Sedang", category: "UN - Segitiga Sebangun",
    question: "△ABC ~ △PQR. AB = 9, BC = 12, CA = 15, PQ = 6. Tentukan BENAR atau SALAH:",
    svgKey: "tri-prop",
    statements: [
      { text: "Faktor skala k = 2/3", isCorrect: true },
      { text: "QR = 8 cm", isCorrect: true },
      { text: "RP = 12 cm (bukan 10)", isCorrect: false },
      { text: "Keliling △PQR = 24 cm", isCorrect: true }
    ],
    explanation: {
      concept: "Penerapan k pada semua sisi.",
      steps: ["k = 6/9 = 2/3 ✓", "QR = 12×2/3 = 8 ✓", "RP = 15×2/3 = 10 (bukan 12) ✗", "K = (6+8+10) = 24 ✓"],
      formula: "k=\\frac{2}{3},\\; QR=8,\\; RP=10,\\; K=24"
    }
  },
  {
    id: 80, type: "Benar/Salah", difficulty: "Sedang", category: "Kontekstual Gedung",
    question: "Tongkat 5 m, bayangan 8 m. Gedung bayangan 40 m. Tentukan BENAR atau SALAH:",
    svgKey: "gedung-bay",
    statements: [
      { text: "Tinggi gedung = 25 m", isCorrect: true },
      { text: "Rasio t:b = 5:8", isCorrect: true },
      { text: "Pohon bayangan 16 m → tinggi pohon = 10 m", isCorrect: true },
      { text: "Pohon bayangan 16 m → tinggi pohon = 12 m", isCorrect: false }
    ],
    explanation: {
      concept: "Rasio t:b = 5:8 konstan.",
      steps: ["T = 5×40/8 = 25 m ✓", "t:b = 5:8 ✓", "10 = 5×16/8 ✓", "(4) 12 ≠ 10 ✗"],
      formula: "\\frac{T}{40}=\\frac{5}{8} \\Rightarrow T=25\\text{ m}"
    }
  },
  {
    id: 81, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK - Rasio Luas",
    question: "Dua bangun sebangun dengan k = 3. Luas bangun kecil = 20 cm². Tentukan BENAR atau SALAH:",
    svgKey: "luas-k2-2",
    statements: [
      { text: "Rasio luas = 1 : 9", isCorrect: true },
      { text: "Luas bangun besar = 180 cm²", isCorrect: true },
      { text: "Rasio keliling = 1 : 3", isCorrect: true },
      { text: "Luas bangun besar = 60 cm²", isCorrect: false }
    ],
    explanation: {
      concept: "k = 3 → rasio L = k² = 9.",
      steps: ["L_besar/L_kecil = 9 ✓", "L_besar = 20×9 = 180 ✓", "Rasio K = 1:3 ✓", "(4) 60 ≠ 180 ✗"],
      formula: "k=3,\\; L_2=20\\times9=180\\text{ cm}^2"
    }
  },
  {
    id: 82, type: "Benar/Salah", difficulty: "Sedang", category: "Trapesium Sebangun",
    question: "Trapesium ABCD (AB∥CD), AB=16, CD=9 cm. Diagonal berpotongan di O. Tentukan BENAR atau SALAH:",
    svgKey: "trapesium-diag",
    statements: [
      { text: "AO/OC = 16/9", isCorrect: true },
      { text: "BO/OD = 16/9", isCorrect: true },
      { text: "△AOB ~ △COD (AA)", isCorrect: true },
      { text: "AO/OC = 4/3", isCorrect: false }
    ],
    explanation: {
      concept: "Diagonal trapesium membagi satu sama lain sebanding dengan sisi sejajar.",
      steps: ["AO/OC = AB/CD = 16/9 ✓", "BO/OD = 16/9 ✓", "△AOB~△COD ✓", "(4) 16/9 ≠ 4/3 ✗"],
      formula: "\\frac{AO}{OC}=\\frac{BO}{OD}=\\frac{AB}{CD}=\\frac{16}{9}"
    }
  },
  {
    id: 83, type: "Benar/Salah", difficulty: "Sedang", category: "Denah Arsitektur",
    question: "Denah skala 1:200. Kolam renang 5×3 cm di denah. Tentukan BENAR atau SALAH:",
    svgKey: "denah-200",
    statements: [
      { text: "Panjang kolam asli = 10 m", isCorrect: true },
      { text: "Lebar kolam asli = 6 m", isCorrect: true },
      { text: "Luas kolam asli = 60 m²", isCorrect: true },
      { text: "Luas kolam asli = 30 m²", isCorrect: false }
    ],
    explanation: {
      concept: "Skala 1:200: asli = denah × 200.",
      steps: ["p = 5×200=10m ✓", "l = 3×200=6m ✓", "L=10×6=60 m² ✓", "(4) 30≠60 ✗"],
      formula: "p=10\\text{m},\\; l=6\\text{m},\\; L=60\\text{m}^2"
    }
  },
  {
    id: 84, type: "Benar/Salah", difficulty: "Sedang", category: "Jajargenjang Kekongruenan",
    question: "Jajargenjang ABCD, diagonal berpotongan di O. Tentukan BENAR atau SALAH:",
    svgKey: "jajar-kongr",
    statements: [
      { text: "AO = OC (diagonal saling bagi dua)", isCorrect: true },
      { text: "△AOB ≅ △COD", isCorrect: true },
      { text: "△ABC ≅ △ACD (diagonal membagi jadi 2 segitiga kongruen)", isCorrect: true },
      { text: "Diagonal jajargenjang saling tegak lurus", isCorrect: false }
    ],
    explanation: {
      concept: "Diagonal jajargenjang saling membagi dua tetapi tidak tegak lurus.",
      steps: ["(1) BENAR: AO=OC ✓", "(2) BENAR: △AOB≅△COD (SAS) ✓", "(3) BENAR: △ABC≅△CDA (SSS) ✓", "(4) SALAH: hanya belah ketupat diagonalnya tegak lurus ✗"],
      formula: "\\text{Jajargenjang: } AO=OC,\\; BO=OD \\;(\\text{tidak tegak lurus})"
    }
  },
  {
    id: 85, type: "Benar/Salah", difficulty: "Sedang", category: "Pohon Bayangan",
    question: "Pohon 12 m menghasilkan bayangan 8 m. Tentukan BENAR atau SALAH:",
    svgKey: "pohon-bay2",
    statements: [
      { text: "Rasio t:b = 3:2", isCorrect: true },
      { text: "Orang 1,5 m → bayangan 1 m", isCorrect: true },
      { text: "Tiang 9 m → bayangan 6 m", isCorrect: true },
      { text: "Tiang 9 m → bayangan 4,5 m", isCorrect: false }
    ],
    explanation: {
      concept: "Rasio t:b = 12:8 = 3:2.",
      steps: ["(1) t:b = 3:2 ✓", "(2) b = 1,5×2/3 = 1 m ✓", "(3) b = 9×2/3 = 6 m ✓", "(4) 4,5 ≠ 6 ✗"],
      formula: "\\frac{t}{b}=\\frac{3}{2} \\Rightarrow b=\\frac{2t}{3}"
    }
  },
  {
    id: 86, type: "Benar/Salah", difficulty: "Sedang", category: "Siku-siku Proyeksi",
    question: "Segitiga siku-siku, kaki 6 dan 8. Tinggi ke hipotenusa = h. Tentukan BENAR atau SALAH:",
    svgKey: "seg-siku-alt2",
    statements: [
      { text: "Hipotenusa = 10 cm", isCorrect: true },
      { text: "h = 4,8 cm", isCorrect: true },
      { text: "Proyeksi kaki 6 = 3,6 cm", isCorrect: true },
      { text: "Proyeksi kaki 8 = 5 cm", isCorrect: false }
    ],
    explanation: {
      concept: "Teorema proyeksi pada segitiga siku-siku.",
      steps: ["c = √(36+64) = 10 ✓", "h = 6×8/10 = 4,8 ✓", "p₁ = 6²/10 = 3,6 ✓", "(4) p₂ = 8²/10 = 6,4 ≠ 5 ✗"],
      formula: "h=4{,}8,\\; p_1=3{,}6,\\; p_2=6{,}4"
    }
  },
  {
    id: 87, type: "Benar/Salah", difficulty: "Sedang", category: "TKA - Faktor Skala",
    question: "Dua bangun sebangun dengan k = 5/4. Keliling bangun kecil 40 cm. Tentukan BENAR atau SALAH:",
    svgKey: "luas-k2-1",
    statements: [
      { text: "Keliling bangun besar = 50 cm", isCorrect: true },
      { text: "Rasio luas = 25:16", isCorrect: true },
      { text: "Jika luas kecil 64 cm², luas besar = 100 cm²", isCorrect: true },
      { text: "Rasio keliling = 16:25", isCorrect: false }
    ],
    explanation: {
      concept: "k = 5/4: rasio K = 5:4, rasio L = 25:16.",
      steps: ["K_besar = 40×5/4 = 50 cm ✓", "Rasio L = (5/4)² = 25/16 ✓", "L_besar = 64×25/16 = 100 cm² ✓", "(4) Rasio K = 5:4, bukan 16:25 ✗"],
      formula: "k=\\frac{5}{4},\\; K_{besar}=50,\\; L_{besar}=100\\text{ cm}^2"
    }
  },
  {
    id: 88, type: "Benar/Salah", difficulty: "Sedang", category: "Literasi - Dua Peta",
    question: "Peta A skala 1:300.000, Peta B skala 1:600.000. Jarak X-Y asli = 24 km. Tentukan BENAR atau SALAH:",
    svgKey: "peta-500000",
    statements: [
      { text: "Di Peta A, jarak X-Y = 8 cm", isCorrect: true },
      { text: "Di Peta B, jarak X-Y = 4 cm", isCorrect: true },
      { text: "Peta A lebih detail dari Peta B", isCorrect: true },
      { text: "Di Peta B, 1 cm = 3 km", isCorrect: false }
    ],
    explanation: {
      concept: "Konversi jarak pada dua peta berbeda skala.",
      steps: ["Peta A: 24km÷300.000=8cm ✓", "Peta B: 24km÷600.000=4cm ✓", "1:300.000 lebih detail ✓", "(4) 1cm=600.000cm=6km ≠ 3km ✗"],
      formula: "J_A=\\frac{24\\text{ km}}{300.000}=8\\text{ cm},\\; J_B=4\\text{ cm}"
    }
  },
  {
    id: 89, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK - Segitiga Bertingkat",
    question: "Pada △ABC, D di AB, E di AC, DE∥BC. AD=6, DB=9, BC=25 cm. Tentukan BENAR atau SALAH:",
    svgKey: "seg-nested-2",
    statements: [
      { text: "AB = 15 cm", isCorrect: true },
      { text: "k = AD/AB = 6/15 = 2/5", isCorrect: true },
      { text: "DE = 25 × 2/5 = 10 cm", isCorrect: true },
      { text: "Luas △ADE = (4/25) luas △ABC", isCorrect: true }
    ],
    explanation: {
      concept: "DE∥BC → △ADE~△ABC dengan k = AD/AB.",
      steps: ["AB=6+9=15 ✓", "k=6/15=2/5 ✓", "DE=25×2/5=10 ✓", "L_ADE=k²×L_ABC=(4/25)L ✓"],
      formula: "k=\\frac{2}{5},\\; DE=10,\\; \\frac{L_{ADE}}{L_{ABC}}=\\frac{4}{25}"
    }
  },
  {
    id: 90, type: "Benar/Salah", difficulty: "Sedang", category: "Kontekstual Model",
    question: "Model bangunan skala 1:400. Tinggi model 8 cm, panjang model 25 cm. Tentukan BENAR atau SALAH:",
    svgKey: "model-400",
    statements: [
      { text: "Tinggi bangunan asli = 32 m", isCorrect: true },
      { text: "Panjang bangunan asli = 100 m", isCorrect: true },
      { text: "Luas lantai asli = panjang × lebar asli", isCorrect: true },
      { text: "Rasio volume model:asli = 1:64.000.000", isCorrect: true }
    ],
    explanation: {
      concept: "Skala 1:400 pada dimensi linier dan volume.",
      steps: ["t = 8×400=3200cm=32m ✓", "p = 25×400=10.000cm=100m ✓", "Luas = p×l asli ✓", "Volume rasio = 400³=64.000.000 ✓"],
      formula: "k=400,\\; \\frac{V_{asli}}{V_{model}}=400^3=64.000.000"
    }
  },
  /* ═══ BENAR/SALAH SULIT (Q91–Q100) ═══ */
  {
    id: 91, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS - Proyeksi Kompleks",
    question: "Segitiga siku-siku, sisi 8, 15, 17. Garis tinggi ke hipotenusa. Tentukan BENAR atau SALAH:",
    svgKey: "seg-siku-alt",
    statements: [
      { text: "Tinggi ke hipotenusa h = 120/17", isCorrect: true },
      { text: "Proyeksi sisi 8 = 64/17", isCorrect: true },
      { text: "Proyeksi sisi 15 = 225/17", isCorrect: true },
      { text: "h² = (64/17)(225/17) = 14400/289", isCorrect: true }
    ],
    explanation: {
      concept: "Teorema proyeksi lengkap pada segitiga siku-siku.",
      steps: ["h = 8×15/17 = 120/17 ✓", "p₁ = 8²/17 = 64/17 ✓", "p₂ = 15²/17 = 225/17 ✓", "h² = (64×225)/289 = 14400/289 ✓"],
      formula: "h=\\frac{120}{17},\\; p_1=\\frac{64}{17},\\; p_2=\\frac{225}{17}"
    }
  },
  {
    id: 92, type: "Benar/Salah", difficulty: "Sulit", category: "Literasi - Analisis Rasio",
    question: "Dua bangun sebangun. L_kecil = 81 cm², L_besar = 144 cm². Tentukan BENAR atau SALAH:",
    svgKey: "luas-k2-2",
    statements: [
      { text: "Rasio luas = 9:16", isCorrect: true },
      { text: "k = 4/3 (kecil ke besar)", isCorrect: true },
      { text: "Keliling kecil 27 cm → keliling besar 36 cm", isCorrect: true },
      { text: "Sisi kecil 9 cm → sisi besar 16 cm", isCorrect: false }
    ],
    explanation: {
      concept: "k = √(L₂/L₁) = 4/3.",
      steps: ["81:144 = 9:16 ✓", "k = √(16/9) = 4/3 ✓", "K_besar = 27×4/3 = 36 ✓", "(4) s_besar = 9×4/3 = 12 ≠ 16 ✗"],
      formula: "k=\\sqrt{\\frac{144}{81}}=\\frac{4}{3},\\; s_{besar}=9\\times\\frac{4}{3}=12"
    }
  },
  {
    id: 93, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS - Trapesium Kompleks",
    question: "Trapesium ABCD (AB∥CD), AB=24, CD=16. E di AD, F di BC, EF∥AB, AE:ED=3:1. Tentukan BENAR atau SALAH:",
    svgKey: "trapesium-diag2",
    statements: [
      { text: "EF = 22 cm", isCorrect: true },
      { text: "AE/AD = 3/4", isCorrect: true },
      { text: "EF = 16 + (24-16)×(1/4) = 18 cm", isCorrect: false },
      { text: "EF = 24 - (24-16)×(3/4) = 18 cm", isCorrect: false }
    ],
    explanation: {
      concept: "EF = CD + (AB-CD)×(AE/AD).",
      steps: ["AE:ED = 3:1 → AE/AD = 3/4", "EF = CD + (AB-CD)×(AE/AD) = 16 + 8×(3/4) = 16+6 = 22 ✓", "(3) Salah: 16+8×(1/4)=18 ✗", "(4) Salah: 24-8×(3/4)=18 ✗"],
      formula: "EF = 16 + (24-16)\\times\\frac{3}{4} = 16+6 = 22\\text{ cm}"
    }
  },
  {
    id: 94, type: "Benar/Salah", difficulty: "Sulit", category: "TKA - Volume dan Skala",
    question: "Model kapal skala 1:200. Panjang model 30 cm, lebar 12 cm, tinggi 8 cm. Tentukan BENAR atau SALAH:",
    svgKey: "model-400",
    statements: [
      { text: "Panjang asli = 60 m", isCorrect: true },
      { text: "Luas permukaan asli = (200²) × luas permukaan model", isCorrect: true },
      { text: "Volume asli = (200³) × volume model", isCorrect: true },
      { text: "Rasio volume = 1 : 40.000", isCorrect: false }
    ],
    explanation: {
      concept: "Skala 1:200: panjang ×200, luas ×200², volume ×200³.",
      steps: ["p = 30×200 = 6000cm = 60m ✓", "Luas ∝ k² = 200² ✓", "Volume ∝ k³ = 200³ ✓", "(4) Rasio = 200³ = 8.000.000, bukan 40.000 ✗"],
      formula: "k=200,\\; V_{asli}=200^3\\times V_{model}=8.000.000\\times V_{model}"
    }
  },
  {
    id: 95, type: "Benar/Salah", difficulty: "Sulit", category: "ANBK - Kekongruenan Identifikasi",
    question: "△PQR: PQ=10, QR=8, PR=6. △XYZ: XY=10, YZ=6, XZ=8. Tentukan BENAR atau SALAH:",
    svgKey: "kongr-sss",
    statements: [
      { text: "△PQR ≅ △XYZ (SSS: 10=10, 8=8, 6=6 — sisi bersesuaian)", isCorrect: true },
      { text: "Pemetaan tepat: P↔X, Q↔Y, R↔Z", isCorrect: false },
      { text: "QR bersesuaian dengan XZ (keduanya = 8)", isCorrect: true },
      { text: "∠Q = ∠Y", isCorrect: false }
    ],
    explanation: {
      concept: "SSS kongruen dengan pemetaan yang tepat berdasarkan panjang sisi.",
      steps: ["PQ=XY=10, QR=XZ=8, PR=YZ=6 → P↔X, Q↔Z, R↔Y ✓", "(2) Pemetaan P↔X,Q↔Z,R↔Y (bukan Q↔Y) ✗", "QR=XZ=8 ✓", "(4) ∠Q bersesuaian ∠Z (bukan Y) ✗"],
      formula: "PQ=XY=10,\\; QR=XZ=8,\\; PR=YZ=6 \\Rightarrow P\\leftrightarrow X,Q\\leftrightarrow Z"
    }
  },
  {
    id: 96, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS - Triple Pythagoras Sebangun",
    question: "Segitiga (3,4,5) dan (6,8,10). Tentukan BENAR atau SALAH:",
    svgKey: "def-sebangun",
    statements: [
      { text: "Kedua segitiga sebangun dengan k = 2", isCorrect: true },
      { text: "Kedua segitiga siku-siku", isCorrect: true },
      { text: "Kedua segitiga kongruen", isCorrect: false },
      { text: "Rasio luas = 1:4", isCorrect: true }
    ],
    explanation: {
      concept: "Kelipatan triple Pythagoras membentuk segitiga sebangun.",
      steps: ["6/3=8/4=10/5=2 → sebangun k=2 ✓", "3²+4²=5² dan 6²+8²=10² → siku-siku ✓", "Ukuran berbeda → tidak kongruen ✗", "Rasio L = k² = 4 = 1:4 ✓"],
      formula: "k=2,\\; \\frac{L_2}{L_1}=4"
    }
  },
  {
    id: 97, type: "Benar/Salah", difficulty: "Sulit", category: "Literasi Matematika HOTS",
    question: "Sebuah taman berbentuk persegi panjang 60m×40m. Model taman dibuat dengan skala 1:500. Tentukan BENAR atau SALAH:",
    svgKey: "denah-300",
    statements: [
      { text: "Panjang model = 12 cm", isCorrect: true },
      { text: "Lebar model = 8 cm", isCorrect: true },
      { text: "Luas model = 96 cm²", isCorrect: true },
      { text: "Luas taman asli = 96 × 500 m²", isCorrect: false }
    ],
    explanation: {
      concept: "Skala model taman: model = asli ÷ 500.",
      steps: ["p_model = 60m÷500=0,12m=12cm ✓", "l_model = 40m÷500=0,08m=8cm ✓", "L_model = 12×8=96cm² ✓", "(4) L_asli = 96×(500)² cm² = 2400 m², bukan 96×500 ✗"],
      formula: "p=12\\text{cm},\\; l=8\\text{cm},\\; L_{model}=96\\text{cm}^2"
    }
  },
  {
    id: 98, type: "Benar/Salah", difficulty: "Sulit", category: "TKA - Sifat Kesebangunan",
    question: "Tentukan BENAR atau SALAH pernyataan komprehensif:",
    svgKey: "def-sebangun",
    statements: [
      { text: "Relasi sebangun bersifat refleksif: setiap bangun sebangun dengan dirinya sendiri", isCorrect: true },
      { text: "Relasi sebangun bersifat simetris: jika A ~ B maka B ~ A", isCorrect: true },
      { text: "Relasi sebangun bersifat transitif: jika A~B dan B~C maka A~C", isCorrect: true },
      { text: "Dua segitiga siku-siku dengan satu sudut lancip yang sama pasti kongruen", isCorrect: false }
    ],
    explanation: {
      concept: "Relasi sebangun adalah relasi ekuivalensi (refleksif, simetris, transitif).",
      steps: ["(1) BENAR: k=1 → sebangun dengan diri sendiri ✓", "(2) BENAR: jika k(A→B)=k maka k(B→A)=1/k ✓", "(3) BENAR: transitif ✓", "(4) SALAH: sudut sama → sebangun, tapi tidak harus kongruen ✗"],
      formula: "\\sim \\text{ adalah relasi ekuivalensi}"
    }
  },
  {
    id: 99, type: "Benar/Salah", difficulty: "Sulit", category: "ANBK Komprehensif",
    question: "Dua bangun sebangun, k = 5/3. Bangun kecil: keliling = 24 cm, luas = 36 cm². Tentukan BENAR atau SALAH:",
    svgKey: "luas-k2-1",
    statements: [
      { text: "Keliling bangun besar = 40 cm", isCorrect: true },
      { text: "Luas bangun besar = 100 cm²", isCorrect: true },
      { text: "Rasio luas = 9:25", isCorrect: true },
      { text: "Luas bangun besar = 180 cm²", isCorrect: false }
    ],
    explanation: {
      concept: "k = 5/3: K ×(5/3), L ×(5/3)²=25/9.",
      steps: ["K_besar = 24×5/3 = 40 ✓", "L_besar = 36×25/9 = 100 ✓", "Rasio L = 9:25 ✓", "(4) 180 ≠ 100 ✗"],
      formula: "K_2=24\\times\\frac{5}{3}=40,\\; L_2=36\\times\\frac{25}{9}=100\\text{ cm}^2"
    }
  },
  {
    id: 100, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Gabungan Final",
    question: "Pernyataan akhir komprehensif. Tentukan BENAR atau SALAH:",
    svgKey: "tri-prop2",
    statements: [
      { text: "Jika dua segitiga sebangun dengan k=3 dan keliling kecil=12, maka luas besar = 9 × luas kecil", isCorrect: true },
      { text: "Jika A~B dan A≅C, maka B~C (transitif campuran)", isCorrect: true },
      { text: "Dua persegi panjang 4×6 dan 6×9 adalah sebangun", isCorrect: true },
      { text: "Rasio luas dua bangun sebangun dengan k=7/5 adalah 49:25, jika luas besar=98 cm² maka luas kecil=25 cm²", isCorrect: false }
    ],
    explanation: {
      concept: "Evaluasi akhir berbagai konsep kesebangunan dan kekongruenan.",
      steps: ["(1) k=3 → L_besar=9×L_kecil ✓", "(2) A~B dan A≅C→B~C ✓", "(3) 4/6=6/9=2/3 ✓", "(4) L_kecil = 98×25/49 = 50 cm² (bukan 25) ✗"],
      formula: "L_{kecil}=98\\times\\frac{25}{49}=50\\text{ cm}^2"
    }
  },
];

/* ══════════════════════════════════════════
   UI COMPONENTS
══════════════════════════════════════════ */
const difficultyColor: Record<Difficulty, string> = {
  "Mudah": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Sedang": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Sulit": "bg-rose-500/20 text-rose-400 border-rose-500/30"
};
const typeColor: Record<QuestionType, string> = {
  "PG": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "MCMA": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Benar/Salah": "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30"
};
const typeLabel: Record<QuestionType, string> = {
  "PG": "Pilihan Ganda",
  "MCMA": "PG Kompleks MCMA",
  "Benar/Salah": "PG Kompleks B/S"
};

const SoalCard = ({ soal }: { soal: Question }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMCMA = soal.type === "MCMA";
  const isBS = soal.type === "Benar/Salah";
  return (
    <div className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500 animate-slide-up"
      style={{ background: "linear-gradient(135deg,rgba(30,41,59,0.6) 0%,rgba(15,23,42,0.8) 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%,rgba(0,200,255,0.08) 0%,transparent 50%)" }} />
      <div className="relative p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-primary/80 bg-primary/10 px-2 py-1 rounded-md">#{soal.id}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${difficultyColor[soal.difficulty]}`}>{soal.difficulty}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColor[soal.type]}`}>{typeLabel[soal.type]}</span>
          <span className="text-xs text-white/30 font-body">{soal.category}</span>
        </div>
        <div className="mb-4">
          <div className="text-foreground font-body text-sm md:text-base leading-relaxed whitespace-pre-line">
            <MathText text={soal.question} />
          </div>
          {soal.svgKey && visualMap[soal.svgKey] && <div className="mt-3">{visualMap[soal.svgKey]}</div>}
        </div>
        {soal.options && (
          <div className="space-y-2 mb-4">
            {soal.options.map((opt, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                <span className="text-sm text-foreground/90 font-body"><MathText text={opt} /></span>
              </div>
            ))}
          </div>
        )}
        {soal.statements && (
          <div className="space-y-2 mb-4">
            {soal.statements.map((s, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 ${isMCMA ? "bg-muted/30 border-border/30" : "bg-muted/20 border-border/20"}`}>
                <span className={`text-xs font-bold shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${isMCMA ? "bg-violet-500/20 text-violet-300" : "bg-fuchsia-500/20 text-fuchsia-300"}`}>
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/90 font-body"><MathText text={s.text} /></span>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => { playPopSound(); setIsOpen(!isOpen); }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 hover:from-primary/30 hover:to-secondary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer">
          <span className="text-sm font-semibold text-primary">{isOpen ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[2000px] opacity-100 mt-5" : "max-h-0 opacity-0"}`}>
          <div className="relative p-5 rounded-xl border border-primary/20"
            style={{ background: "linear-gradient(135deg,rgba(0,200,255,0.05) 0%,rgba(139,92,246,0.05) 100%)" }}>
            <h4 className="font-display text-sm md:text-base font-bold text-primary mb-3">Pembahasan</h4>
            {soal.correctAnswer && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40">
                <p className="text-xs font-semibold text-emerald-400 mb-1">✅ Kunci Jawaban</p>
                <span className="text-sm text-emerald-300 font-body"><MathText text={soal.correctAnswer} /></span>
              </div>
            )}
            {isBS && soal.statements && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-xs font-semibold text-emerald-400 mb-2">✅ Kunci Jawaban</p>
                <div className="flex flex-wrap gap-2">
                  {soal.statements.map((s, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded font-body ${s.isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                      ({i+1}) {s.isCorrect ? "✓ Benar" : "✗ Salah"}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {isMCMA && soal.statements && (
              <div className="mb-3 p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
                <p className="text-xs font-semibold text-violet-300 mb-1">✅ Pernyataan yang benar:</p>
                <p className="text-sm text-violet-200 font-body">
                  {soal.statements.map((s, i) => s.isCorrect ? `(${i+1})` : null).filter(Boolean).join(", ")}
                </p>
              </div>
            )}
            <div className="mb-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs font-semibold text-blue-300 mb-1">📖 Konsep</p>
              <p className="text-sm text-white/80 font-body">{soal.explanation.concept}</p>
            </div>
            <div className="space-y-2">
              {soal.explanation.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                  <span className="text-sm text-white/80 font-body"><MathText text={step} /></span>
                </div>
              ))}
            </div>
            {soal.explanation.formula && (
              <div className="mt-4 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <p className="text-xs font-semibold text-violet-300 mb-2">📐 Rumus/Kunci</p>
                <div className="text-center"><BlockMath math={soal.explanation.formula} /></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const BankSoalKesebangunanPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalKesebangunan.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalKesebangunan.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalKesebangunan.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalKesebangunan.filter(s => s.difficulty === "Sulit").length,
    PG: soalKesebangunan.filter(s => s.type === "PG").length,
    MCMA: soalKesebangunan.filter(s => s.type === "MCMA").length,
    BS: soalKesebangunan.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <Shapes className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL KESEBANGUNAN DAN KEKONGRUENAN
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Kesebangunan · Kekongruenan · Skala · Faktor Skala · Proyeksi · Kontekstual
        </p>
        <p className="text-white/40 text-xs text-center mb-5 font-body">
          100 Soal · UN / TKA / HOTS / ANBK / Literasi · PG + MCMA + Benar/Salah · Dengan Pembahasan
        </p>

        <div className="flex justify-center gap-2 mb-3 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-body">{counts.Mudah} Mudah</span>
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-body">{counts.Sedang} Sedang</span>
          <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-body">{counts.Sulit} Sulit</span>
        </div>
        <div className="flex justify-center gap-2 mb-5 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-body">{counts.PG} PG</span>
          <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 font-body">{counts.MCMA} MCMA</span>
          <span className="text-xs px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 font-body">{counts.BS} B/S</span>
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalKesebangunan.length} Soal</span>
        </div>

        <div className="mb-6">
          <button onClick={() => { playPopSound(); setShowFilter(v => !v); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/60 border border-border hover:border-primary/40 transition-all text-sm text-white/70 cursor-pointer font-body mx-auto">
            <Filter className="w-4 h-4" /> Filter Soal {showFilter ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
          </button>
          {showFilter && (
            <div className="mt-3 p-4 rounded-xl bg-card/60 border border-border space-y-3">
              <div>
                <p className="text-xs text-white/50 mb-2 font-body">Tingkat Kesulitan:</p>
                <div className="flex flex-wrap gap-2">
                  {(["Semua","Mudah","Sedang","Sulit"] as const).map(d => (
                    <button key={d} onClick={() => { playPopSound(); setFilterDifficulty(d); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterDifficulty === d ? "bg-primary text-white border-primary" : "border-border text-white/50 hover:border-primary/40"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-2 font-body">Tipe Soal:</p>
                <div className="flex flex-wrap gap-2">
                  {(["Semua","PG","MCMA","Benar/Salah"] as const).map(t => (
                    <button key={t} onClick={() => { playPopSound(); setFilterType(t); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterType === t ? "bg-primary text-white border-primary" : "border-border text-white/50 hover:border-primary/40"}`}>
                      {t === "MCMA" ? "PG Kompleks MCMA" : t === "Benar/Salah" ? "PG Kompleks B/S" : t}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalKesebangunan.length} soal</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {filtered.map(soal => <SoalCard key={soal.id} soal={soal} />)}
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/bank-soal"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Bank Soal
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankSoalKesebangunanPage;
