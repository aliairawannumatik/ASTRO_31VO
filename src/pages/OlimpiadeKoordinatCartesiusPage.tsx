import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import PembahasanCard from "@/components/PembahasanCard";
import { koordinatKartesiusDasarPembahasan } from "@/data/pembahasan/koordinatKartesiusDasar";
import { koordinatKartesiusOlimpiadePembahasan } from "@/data/pembahasan/koordinatKartesiusOlimpiade";

// SVG: Diagram Kartesius dengan 4 kuadran (K1, K2, K3, K4)
const KoordinatKartesiusSVG = () => {
  const unit = 28;
  const xMin = -3, xMax = 4;
  const yMin = -3, yMax = 4;
  const padX = 36, padY = 24;
  const width = (xMax - xMin) * unit + padX * 2;
  const height = (yMax - yMin) * unit + padY * 2;
  const ox = padX + (-xMin) * unit;
  const oy = padY + yMax * unit;
  const xPx = (x: number) => padX + (x - xMin) * unit;
  const yPx = (y: number) => padY + (yMax - y) * unit;

  const vlines = [];
  for (let x = xMin; x <= xMax; x++) {
    vlines.push(
      <line key={`v${x}`} x1={xPx(x)} y1={padY} x2={xPx(x)} y2={padY + (yMax - yMin) * unit} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    );
  }
  const hlines = [];
  for (let y = yMin; y <= yMax; y++) {
    hlines.push(
      <line key={`h${y}`} x1={padX} y1={yPx(y)} x2={padX + (xMax - xMin) * unit} y2={yPx(y)} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    );
  }

  const xLabels = [];
  for (let x = xMin; x <= xMax; x++) {
    if (x === 0) continue;
    xLabels.push(
      <text key={`xl${x}`} x={xPx(x)} y={oy + 14} fill="#e5e7eb" fontSize="10" textAnchor="middle">{x}</text>
    );
  }
  const yLabels = [];
  for (let y = yMin; y <= yMax; y++) {
    if (y === 0) continue;
    yLabels.push(
      <text key={`yl${y}`} x={ox - 8} y={yPx(y) + 3} fill="#e5e7eb" fontSize="10" textAnchor="end">{y}</text>
    );
  }

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        {vlines}
        {hlines}
        {/* Sumbu X */}
        <line x1={padX - 8} y1={oy} x2={padX + (xMax - xMin) * unit + 12} y2={oy} stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arrowX)" />
        {/* Sumbu Y */}
        <line x1={ox} y1={padY + (yMax - yMin) * unit + 8} x2={ox} y2={padY - 12} stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arrowY)" />
        <defs>
          <marker id="arrowX" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L6,4 L0,8 Z" fill="#fbbf24" />
          </marker>
          <marker id="arrowY" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L6,4 L0,8 Z" fill="#fbbf24" />
          </marker>
        </defs>
        {xLabels}
        {yLabels}
        <text x={ox - 8} y={oy + 14} fill="#e5e7eb" fontSize="10" textAnchor="end">0</text>
        {/* Sumbu labels */}
        <text x={padX + (xMax - xMin) * unit + 16} y={oy + 4} fill="#fbbf24" fontSize="11" fontStyle="italic">x</text>
        <text x={ox + 6} y={padY - 6} fill="#fbbf24" fontSize="11" fontStyle="italic">y</text>
        {/* Quadrant labels */}
        <text x={xPx(-2.5)} y={yPx(3.5)} fill="#22d3ee" fontSize="11" fontWeight="bold" textAnchor="middle">K2</text>
        <text x={xPx(3.5)} y={yPx(3.5)} fill="#22d3ee" fontSize="11" fontWeight="bold" textAnchor="middle">K1</text>
        <text x={xPx(-2.5)} y={yPx(-2.5)} fill="#22d3ee" fontSize="11" fontWeight="bold" textAnchor="middle">K3</text>
        <text x={xPx(3.5)} y={yPx(-2.5)} fill="#22d3ee" fontSize="11" fontWeight="bold" textAnchor="middle">K4</text>
      </svg>
    </div>
  );
};

// SVG: Kuadran I-IV dengan titik-titik (x, y), (-x, y), (-x, -y), (x, -y)
const KuadranAbsisOrdinatSVG = () => {
  const W = 320, H = 280;
  const cx = W / 2, cy = H / 2;
  const dx = 70, dy = 50;

  return (
    <div className="my-3 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs sm:max-w-sm rounded-lg border border-border/40 bg-white/5">
        <defs>
          <marker id="arrowKuadran" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L6,4 L0,8 Z" fill="#fbbf24" />
          </marker>
        </defs>
        {/* Sumbu Y */}
        <line x1={cx} y1={H - 10} x2={cx} y2={14} stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arrowKuadran)" />
        {/* Sumbu X */}
        <line x1={10} y1={cy} x2={W - 14} y2={cy} stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arrowKuadran)" />
        {/* Persegi panjang penghubung 4 titik */}
        <rect x={cx - dx} y={cy - dy} width={dx * 2} height={dy * 2} fill="none" stroke="#22d3ee" strokeWidth="1.5" />
        {/* Titik-titik sudut */}
        <circle cx={cx + dx} cy={cy - dy} r="3" fill="#22d3ee" />
        <circle cx={cx - dx} cy={cy - dy} r="3" fill="#22d3ee" />
        <circle cx={cx - dx} cy={cy + dy} r="3" fill="#22d3ee" />
        <circle cx={cx + dx} cy={cy + dy} r="3" fill="#22d3ee" />
        {/* Label sumbu */}
        <text x={cx + 8} y={18} fill="#fbbf24" fontSize="12" fontWeight="bold">Y</text>
        <text x={W - 16} y={cy - 6} fill="#fbbf24" fontSize="12" fontWeight="bold">X</text>
        {/* Label kuadran */}
        <text x={20} y={28} fill="#e5e7eb" fontSize="11" fontWeight="bold">Kuadran II</text>
        <text x={W - 20} y={28} fill="#e5e7eb" fontSize="11" fontWeight="bold" textAnchor="end">Kuadran I</text>
        <text x={20} y={H - 10} fill="#e5e7eb" fontSize="11" fontWeight="bold">Kuadran III</text>
        <text x={W - 20} y={H - 10} fill="#e5e7eb" fontSize="11" fontWeight="bold" textAnchor="end">Kuadran IV</text>
        {/* Label koordinat titik */}
        <text x={cx - dx - 6} y={cy - dy - 6} fill="#22d3ee" fontSize="11" textAnchor="end">(-x, y)</text>
        <text x={cx + dx + 6} y={cy - dy - 6} fill="#22d3ee" fontSize="11">(x, y)</text>
        <text x={cx - dx - 6} y={cy + dy + 14} fill="#22d3ee" fontSize="11" textAnchor="end">(-x, -y)</text>
        <text x={cx + dx + 6} y={cy + dy + 14} fill="#22d3ee" fontSize="11">(x, -y)</text>
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
  title: "MATERI - KOORDINAT KARTESIUS",
  sections: [
    {
      heading: "A. Sistem Koordinat Kartesius",
      content: `Sistem koordinat kartesius adalah sebuah sistem yang dapat memposisikan suatu benda dengan acuan sumbu-x dan sumbu-y.

Sumbu X dan Sumbu Y pada Diagram Kartesius:
Dua sumbu yang saling tegak lurus antar satu dengan yang lain. Kedua sumbu tersebut terletak dalam satu bidang (bidang xy). Sumbu horizontal (mendatar) diberi nama x, dan sumbu vertikal (tegak) diberi nama y. Titik potong sumbu X dan Y disebut titik asal. Titik ini dinyatakan sebagai titik nol. Pada sumbu X dan Y terletak titik yang berjarak sama.

Pada sumbu x dari titik nol ke kanan dan seterusnya merupakan bilangan positif, sedangkan dari titik nol ke kiri dan seterusnya merupakan bilangan negatif. Pada sumbu Y, dari titik nol ke atas merupakan bilangan positif, dan dari titik nol ke bawah merupakan bilangan negatif.

Untuk koordinat x disebut (absis) dan koordinat y disebut (ordinat).`
    },
    {
      heading: "B. Unsur-unsur pada Diagram Kartesius",
      content: `1. Pada diagram kartesius sumbu x disebut sumbu absis dan sumbu y disebut sumbu ordinat

2. Posisi titik pada koordinat Kartesius ditulis dalam pasangan berurut $(x, y)$. Bilangan x menyatakan jarak titik itu dari sumbu-Y dan bilangan y menyatakan jarak titik itu dari sumbu-X.

3. Sumbu-X dan sumbu-Y membagi bidang koordinat Kartesius menjadi 4 kuadran, yaitu:
   - Kuadran I: koordinat-x positif dan koordinat-y positif
   - Kuadran II: koordinat-x negatif dan koordinat-y positif
   - Kuadran III: koordinat-x negatif dan koordinat-y negatif
   - Kuadran IV: koordinat-x positif dan koordinat-y negatif`
    },
    {
      heading: "C. Jarak Antara 2 Titik Koordinat",
      content: `Jarak antara 2 titik koordinat dari titik $P(x_1, y_1)$ ke $Q(x_2, y_2)$:

$|PQ| = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$

$|PQ|$: Jarak titik P dan Q`
    },
    {
      heading: "D. Posisi Relatif Terhadap Sembarang Titik Acuan",
      content: `Posisi relatif setiap titik $T(x_2, y_2)$ terhadap sembarang titik acuan $D(x_1, y_1)$ adalah:

$T_D(x_2 - x_1, y_2 - y_1)$`
    },
    {
      heading: "E. Jarak Titik ke Garis",
      content: `Jarak titik A ke garis $ax + by + c = 0$ sama dengan jarak titik A ke titik D.

Rumus jarak $A(x_1, y_1)$ ke garis $ax + by + c = 0$ yaitu:

$jarak = \\frac{|ax_1 + by_1 + c|}{\\sqrt{a^2 + b^2}}$`
    },
    {
      heading: "F. Rumus Titik Tengah Segmen",
      content: `Rumus titik tengah antara titik $A(x_1, y_1)$ dan $C(x_2, y_2)$ adalah:

$B\\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$`
    }
  ]
};

const latihanDasar = [
  { no: 1, soal: "Perhatikan titik-titik pada koordinat kartesius berikut.\nTitik yang berkoordinat (1, 3) adalah.....", options: ["A. titik A", "B. titik B", "C. titik C", "D. titik D"] },
  { no: 2, soal: "Perhatikan gambar berikut. Koordinat titik Q adalah....", options: ["A. $(3, 1)$", "B. $(3, -1)$", "C. $(1, 3)$", "D. $(-1, 3)$"] },
  { no: 3, soal: "Perhatikan gambar di samping!\nKoordinat-koordinat di bawah ini yang sesuai dengan gambar adalah....", options: ["A. $A(-2, -4)$", "B. $B(5, 4)$", "C. $C(-2, 6)$", "D. $D(1, -4)$"] },
  { no: 4, soal: "Pada persegi EFGH dibawah ini, tentukan koordinat titik E dan G?", options: ["A. $E(0,0)$ dan $G(a,0)$", "B. $E(0,-1)$ dan $G(a,a)$", "C. $E(0,0)$ dan $G(a,a)$", "D. $E(0,-1)$ dan $G(a,0)$"] },
  { no: 5, soal: "Titik $P(-5, 7)$ terletak di kuadran...", options: ["A. II", "B. IV", "C. I", "D. III"] },
  { no: 6, soal: "Perhatikan gambar di samping!\nKoordinat titik C dan D berturut-turut $C(4, -3)$ dan $D(4, 1)$, bangun ABCD disebut...", options: ["A. jajargenjang", "B. layang-layang", "C. persegi", "D. persegi panjang"] },
  { no: 7, soal: "Bangun yang terbentuk dari titik $M(0,3)$, $N(0,-3)$ dan $O(7,0)$ adalah bangun ....", options: ["A. Segitiga sama sisi", "B. Segitiga sembarang", "C. Segitiga sama kaki", "D. Segitiga siku-siku"] },
  { no: 8, soal: "Diketahui titik $A(3,1)$, $B(3, 5)$, $C(-2, 5)$. Jika ketiga titik tersebut dihubungkan akan membentuk", options: ["A. segitiga sama sisi", "B. segitiga sama kaki", "C. segitiga siku-siku", "D. segitiga sembarang"] },
  { no: 9, soal: "Diketahui dalam koordinat Kartesius terdapat titik P, Q, dan R. Titik $P(4, 6)$ dan titik $Q(7, 1)$. Jika titik P, Q, dan R dihubungkan akan membentuk segitiga siku-siku, maka koordinat titik R adalah ....", options: ["A. $(6, 5)$", "B. $(4, 5)$", "C. $(6, 1)$", "D. $(4, 1)$"] },
  { no: 10, soal: "Diketahui segiempat ABCD dengan koordinat titik $A(-2, 5)$, $B(-2, 1)$, $C(4, 1)$, dan $D(4,5)$. Segiempat ABCD berbentuk....", options: ["A. persegi", "B. persegi panjang", "C. jajargenjang", "D. trapesium"] },
  { no: 11, soal: "Diketahui koordinat titik $A(-3, 5)$; $B(-5, 1)$; $C(-3, -3)$; dan $D(-1, 1)$. Jika keempat titik tersebut dihubungkan, ABCD membentuk bangun...", options: ["A. trapesium", "B. layang-layang", "C. jajargenjang", "D. belahketupat"] },
  { no: 12, soal: "Diketahui koordinat titik $A(-3, 5)$; $B(-5, 1)$; $C(-3, -3)$; dan $D(-1,1)$. Jika keempat titik tersebut dihubungkan, ABCD membentuk bangun ...", options: ["A. Trapesium", "B. Layang-Layang", "C. Jajargenjang", "D. Belahketupat"] },
  { no: 13, soal: "Jarak titik $(-3, 5)$ terhadap sumbu-x adalah ...", options: ["A. 3 satuan", "B. 4 satuan", "C. 5 satuan", "D. 8 satuan"] },
  { no: 14, soal: "Jarak titik $(-4, -5)$ terhadap sumbu-y adalah ...", options: ["A. 4 satuan", "B. 5 satuan", "C. 8 satuan", "D. 9 satuan"] },
  { no: 15, soal: "Jarak antara titik $P(3, 5)$ dan garis $x = -2$ adalah...", options: ["A. 7", "B. 3", "C. 1", "D. 5"] },
  { no: 16, soal: "Jarak antara titik $A(2, 3)$ dan $B(10, -3)$ adalah...", options: ["A. 12", "B. 14", "C. 10", "D. 8"] },
  { no: 17, soal: "Koordinat titik R berada di tengah-tengah garis PQ. Jika titik $P(-2, 5)$ dan $Q(4, -11)$, koordinat titik R adalah ...", options: ["A. $(2, -6)$", "B. $(1, -6)$", "C. $(1, -3)$", "D. $(3, 1)$"] },
  { no: 18, soal: "Titik tengah dari segmen garis yang menghubungkan titik $A(2, 8)$ dan $B(10, 4)$ adalah...", options: ["A. $(4, 2)$", "B. $(6, 6)$", "C. $(12, 12)$", "D. $(8, 4)$"] },
  { no: 19, soal: "Titik $M(5, -2)$ adalah titik tengah dari segmen garis PQ. Jika koordinat titik P adalah $(8, 3)$, maka koordinat titik Q adalah...", options: ["A. $(3, -5)$", "B. $(2, -7)$", "C. $(6.5, 0.5)$", "D. $(11, -1)$"] },
  { no: 20, soal: "Titik $M(4, -1)$ adalah titik tengah dari ruas garis AB. Jika koordinat titik A adalah $(1, 5)$, maka koordinat titik B adalah...", options: ["A. $(2.5, 2)$", "B. $(5, 4)$", "C. $(7, -7)$", "D. $(3, -6)$"] },
  { no: 21, soal: "Titik M adalah titik tengah dari $A(1, 1)$ dan $B(3, 5)$. Jarak dari titik M ke garis $x = 7$ adalah...", options: ["A. 3", "B. 4", "C. 5", "D. 2"] },
  { no: 22, soal: "Luas segitiga yang titik-titik sudutnya adalah $P(0, 0)$, $Q(6, 4)$, dan $R(8, 2)$ adalah...", options: ["A. 12", "B. 10", "C. 14", "D. 20"] },
  { no: 23, soal: "Titik $P(x, 5)$ berjarak 10 satuan dari titik $Q(-4, -1)$. Salah satu nilai x yang mungkin adalah...", options: ["A. 2", "B. 12", "C. 6", "D. 4"] },
  { no: 24, soal: "Jarak tegak lurus dari titik $P(2, 5)$ ke garis $3x + 4y - 6 = 0$ adalah ...", options: ["A. 5", "B. 4", "C. 20", "D. 26"] },
  { no: 25, soal: "Jarak titik $(3, -5)$ terhadap titik acuan $(0, 1)$ adalah ...", options: ["A. Tiga langkah ke kanan dan enam langkah ke atas", "B. Tiga langkah ke kanan dan enam langkah ke bawah", "C. Tiga langkah ke kiri dan enam langkah ke atas", "D. Enam langkah ke kanan dan tiga langkah ke atas"] },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2006 Tingkat Kota\nSuatu garis lurus memotong sumbu x di titik $A(a, 0)$ dan memotong sumbu y di titik $B(0, b)$ dengan a dan b adalah bilangan bulat. Jika perpotongan sumbu x dan sumbu y adalah titik O dan luas segitiga AOB adalah 12 satuan luas, maka banyaknya pasangan bilangan bulat a dan b yang mungkin adalah", options: ["A. 4 pasang", "B. 8 pasang", "C. 16 pasang", "D. 32 pasang", "E. 48 pasang"] },
  { no: 2, soal: "OSN Matematika 2009 Tingkat Kota\nTitik-titik $(1, -1)$, $(3, -4)$, $(m, n)$ dan $(11, -1)$ adalah titik-titik sudut suatu jajar genjang, m dan n bilangan bulat. Panjang diagonal terpendeknya adalah ...", options: ["A. 10", "B. $\\sqrt{89}$", "C. $\\sqrt{29}$", "D. 5"] },
];

const OlimpiadeKoordinatCartesiusPage = () => {
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
          OLIMPIADE - KOORDINAT KARTESIUS
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
                      {section.content.split('\n').map((line, i) => {
                        const trimmed = line.trim();
                        const renderedLine = (() => {
                          if (/^\d+\. [A-Z]/.test(trimmed)) {
                            return <div key={i} className="mt-4 mb-1 font-bold text-yellow-400 text-sm">{trimmed}</div>;
                          }
                          if (/^Rumus/.test(trimmed)) {
                            return <div key={i} className="mt-3 mb-1 font-semibold text-yellow-300 text-xs uppercase tracking-wide">{renderWithLatex(trimmed)}</div>;
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
                        })();
                        if (idx === 0 && i === 0) {
                          return (
                            <div key={`wrap-${i}`}>
                              {renderedLine}
                              <KoordinatKartesiusSVG />
                            </div>
                          );
                        }
                        if (idx === 0 && trimmed.includes('(absis) dan koordinat y disebut (ordinat)')) {
                          return (
                            <div key={`wrap-abs-${i}`}>
                              {renderedLine}
                              <KuadranAbsisOrdinatSVG />
                            </div>
                          );
                        }
                        return renderedLine;
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
                <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span> {soal.soal.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {lineIdx > 0 && <br />}
                      {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                    </span>
                  ))}
                </div>
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {koordinatKartesiusDasarPembahasan[soal.no] && (
                  <PembahasanCard
                    pembahasanKey={`kk-dasar-${soal.no}`}
                    pembahasan={koordinatKartesiusDasarPembahasan[soal.no]}
                  />
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
                <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span> {soal.soal.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {lineIdx > 0 && <br />}
                      {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                    </span>
                  ))}
                </div>
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {koordinatKartesiusOlimpiadePembahasan[soal.no] && (
                  <PembahasanCard
                    pembahasanKey={`kk-olimpiade-${soal.no}`}
                    pembahasan={koordinatKartesiusOlimpiadePembahasan[soal.no]}
                  />
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

export default OlimpiadeKoordinatCartesiusPage;
