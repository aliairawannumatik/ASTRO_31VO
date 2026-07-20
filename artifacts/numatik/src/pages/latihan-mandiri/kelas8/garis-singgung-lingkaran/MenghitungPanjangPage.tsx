import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Ruler } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const SvgSatu = () => (
  <svg width="240" height="180" viewBox="0 0 240 180">
    <circle cx="90" cy="122" r="65" fill="none" stroke="#a78bfa" strokeWidth="2"/>
    <circle cx="90" cy="122" r="3" fill="var(--icon-color)"/>
    <circle cx="124" cy="70" r="3" fill="#fb923c"/>
    <circle cx="225" cy="122" r="3" fill="#fb923c"/>
    <line x1="225" y1="122" x2="124" y2="70" stroke="#fb923c" strokeWidth="1.8"/>
    <line x1="90" y1="122" x2="124" y2="70" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="90" y1="122" x2="225" y2="122" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,3" opacity="0.35"/>
    <path d="M131,80 L127,87 L120,83" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.3"/>
    <text x="77" y="142" fill="var(--icon-color)" fontSize="13" fontWeight="bold">O</text>
    <text x="114" y="60" fill="#fb923c" fontSize="13" fontWeight="bold">A</text>
    <text x="228" y="120" fill="#fb923c" fontSize="13" fontWeight="bold">P</text>
    <text x="93" y="90" fill="#c4b5fd" fontSize="10">OA = 15 cm</text>
    <text x="148" y="115" fill="#e2e8f0" fontSize="10">OP = 39 cm</text>
  </svg>
);

const SvgDua = () => (
  <svg width="240" height="180" viewBox="0 0 240 180">
    <circle cx="163" cy="112" r="60" fill="none" stroke="#34d399" strokeWidth="2"/>
    <circle cx="163" cy="112" r="3" fill="var(--icon-color)"/>
    <circle cx="130" cy="60" r="3" fill="#fb923c"/>
    <circle cx="25" cy="112" r="3" fill="#fbbf24"/>
    <line x1="25" y1="112" x2="130" y2="60" stroke="#fb923c" strokeWidth="1.8"/>
    <line x1="163" y1="112" x2="130" y2="60" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="25" y1="112" x2="163" y2="112" stroke="#34d399" strokeWidth="1" strokeDasharray="3,3" opacity="0.35"/>
    <path d="M124,68 L118,64 L121,57" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.3"/>
    <text x="149" y="132" fill="var(--icon-color)" fontSize="13" fontWeight="bold">O</text>
    <text x="130" y="52" fill="#fb923c" fontSize="13" fontWeight="bold">A</text>
    <text x="11" y="110" fill="#fbbf24" fontSize="13" fontWeight="bold">K</text>
    <text x="130" y="92" fill="#34d399" fontSize="10">OA = 30 cm</text>
    <text x="44" y="78" fill="#e2e8f0" fontSize="10">KA = 40 cm</text>
    <text x="70" y="124" fill="#e2e8f0" fontSize="10">KO = ?</text>
  </svg>
);

const SvgTiga = () => (
  <svg width="245" height="195" viewBox="0 0 245 195">
    <circle cx="133" cy="78" r="65" fill="none" stroke="#7c3aed" strokeWidth="2"/>
    <polygon points="46,143 133,143 133,78 70,78" fill="rgba(124,58,237,0.1)" stroke="#a78bfa" strokeWidth="1.5"/>
    <circle cx="46" cy="143" r="3" fill="#fb923c"/>
    <circle cx="133" cy="143" r="3" fill="#fb923c"/>
    <circle cx="133" cy="78" r="3" fill="var(--icon-color)"/>
    <circle cx="70" cy="78" r="3" fill="#fb923c"/>
    <path d="M125,143 L125,135 L133,135" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.3"/>
    <line x1="46" y1="143" x2="133" y2="78" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4,3" opacity="0.7"/>
    <text x="30" y="158" fill="#fb923c" fontSize="13" fontWeight="bold">E</text>
    <text x="136" y="160" fill="#fb923c" fontSize="13" fontWeight="bold">C</text>
    <text x="136" y="74" fill="var(--icon-color)" fontSize="13" fontWeight="bold">O</text>
    <text x="54" y="72" fill="#fb923c" fontSize="13" fontWeight="bold">D</text>
    <text x="72" y="158" fill="#e2e8f0" fontSize="10">EC = 16 cm</text>
    <text x="75" y="71" fill="#e2e8f0" fontSize="10">OD = 12 cm</text>
    <text x="138" y="114" fill="#c4b5fd" fontSize="10">OC=12</text>
    <text x="18" y="106" fill="#a78bfa" fontSize="12" fontStyle="italic">//</text>
    <text x="99" y="66" fill="#a78bfa" fontSize="12" fontStyle="italic">//</text>
  </svg>
);

const SvgEmpat = () => (
  <svg width="240" height="200" viewBox="0 0 240 200">
    <circle cx="178" cy="100" r="58" fill="none" stroke="#f472b6" strokeWidth="2"/>
    <circle cx="178" cy="100" r="3" fill="var(--icon-color)"/>
    <circle cx="153" cy="44" r="3" fill="#fb923c"/>
    <circle cx="153" cy="156" r="3" fill="#fb923c"/>
    <circle cx="28" cy="100" r="3" fill="#fbbf24"/>
    <line x1="28" y1="100" x2="153" y2="44" stroke="#fb923c" strokeWidth="1.8"/>
    <line x1="28" y1="100" x2="153" y2="156" stroke="#fb923c" strokeWidth="1.8"/>
    <line x1="178" y1="100" x2="153" y2="44" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="178" y1="100" x2="153" y2="156" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="28" y1="100" x2="178" y2="100" stroke="#f472b6" strokeWidth="1" strokeDasharray="3,3" opacity="0.35"/>
    <path d="M147,52 L141,47 L147,41" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.3"/>
    <path d="M147,148 L141,153 L147,159" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.3"/>
    <text x="14" y="98" fill="#fbbf24" fontSize="13" fontWeight="bold">A</text>
    <text x="182" y="118" fill="var(--icon-color)" fontSize="13" fontWeight="bold">O</text>
    <text x="156" y="38" fill="#fb923c" fontSize="13" fontWeight="bold">B</text>
    <text x="156" y="172" fill="#fb923c" fontSize="13" fontWeight="bold">C</text>
    <text x="148" y="86" fill="#f9a8d4" fontSize="10">OB=24</text>
    <text x="52" y="94" fill="#e2e8f0" fontSize="10">AO = 40 cm</text>
  </svg>
);

const SvgLima = () => (
  <svg width="240" height="200" viewBox="0 0 240 200">
    <circle cx="162" cy="100" r="52" fill="none" stroke="#0ea5e9" strokeWidth="2"/>
    <circle cx="162" cy="100" r="3" fill="var(--icon-color)"/>
    <circle cx="139" cy="54" r="3" fill="#fb923c"/>
    <circle cx="139" cy="146" r="3" fill="#fb923c"/>
    <circle cx="44" cy="100" r="3" fill="#fbbf24"/>
    <line x1="44" y1="100" x2="139" y2="54" stroke="#fb923c" strokeWidth="1.8"/>
    <line x1="44" y1="100" x2="139" y2="146" stroke="#fb923c" strokeWidth="1.8"/>
    <line x1="162" y1="100" x2="139" y2="54" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="162" y1="100" x2="139" y2="146" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="44" y1="100" x2="162" y2="100" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3,3" opacity="0.4"/>
    <line x1="139" y1="54" x2="139" y2="146" stroke="#7dd3fc" strokeWidth="1.5" strokeDasharray="5,3"/>
    <path d="M134,62 L129,57 L134,52" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.3"/>
    <path d="M134,138 L129,143 L134,148" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.3"/>
    <text x="30" y="98" fill="#fbbf24" fontSize="13" fontWeight="bold">P</text>
    <text x="166" y="118" fill="var(--icon-color)" fontSize="13" fontWeight="bold">O</text>
    <text x="143" y="48" fill="#fb923c" fontSize="13" fontWeight="bold">Q</text>
    <text x="143" y="160" fill="#fb923c" fontSize="13" fontWeight="bold">R</text>
    <text x="143" y="104" fill="#7dd3fc" fontSize="10">QR</text>
    <text x="56" y="96" fill="#e2e8f0" fontSize="10">OP = 25 cm</text>
    <text x="147" y="80" fill="#38bdf8" fontSize="10">OQ=15</text>
  </svg>
);

const SvgEnam = () => (
  <svg width="250" height="200" viewBox="0 0 250 200">
    <circle cx="112" cy="100" r="64" fill="none" stroke="#34d399" strokeWidth="2"/>
    <circle cx="112" cy="100" r="3" fill="var(--icon-color)"/>
    <circle cx="140" cy="44" r="3" fill="#fb923c"/>
    <circle cx="140" cy="156" r="3" fill="#fb923c"/>
    <circle cx="228" cy="100" r="3" fill="#fbbf24"/>
    <line x1="228" y1="100" x2="140" y2="44" stroke="#fb923c" strokeWidth="1.8"/>
    <line x1="228" y1="100" x2="140" y2="156" stroke="#fb923c" strokeWidth="1.8"/>
    <line x1="112" y1="100" x2="140" y2="44" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="112" y1="100" x2="140" y2="156" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="228" y1="100" x2="112" y2="100" stroke="#34d399" strokeWidth="1" strokeDasharray="3,3" opacity="0.35"/>
    <line x1="140" y1="44" x2="140" y2="156" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="5,3"/>
    <path d="M134,52 L128,47 L134,41" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.3"/>
    <path d="M134,148 L128,153 L134,159" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.3"/>
    <text x="232" y="98" fill="#fbbf24" fontSize="13" fontWeight="bold">K</text>
    <text x="96" y="120" fill="var(--icon-color)" fontSize="13" fontWeight="bold">O</text>
    <text x="144" y="38" fill="#fb923c" fontSize="13" fontWeight="bold">L</text>
    <text x="144" y="170" fill="#fb923c" fontSize="13" fontWeight="bold">M</text>
    <text x="144" y="104" fill="#a78bfa" fontSize="10">LM</text>
    <text x="158" y="68" fill="#e2e8f0" fontSize="10">KL=40 cm</text>
    <text x="155" y="118" fill="#e2e8f0" fontSize="10">OK=50 cm</text>
    <text x="112" y="80" fill="#34d399" fontSize="10">OL=r</text>
  </svg>
);

const SvgTujuh = () => {
  const r1 = 20, r2 = 60;
  const cx1 = 44, cy = 105;
  const cx2 = 200, d_svg = cx2 - cx1;
  const dr = r2 - r1;
  const sinA = dr / d_svg;
  const cosA = Math.sqrt(1 - sinA * sinA);
  const ax = Math.round(cx1 + r1 * sinA);
  const ay = Math.round(cy - r1 * cosA);
  const bx = Math.round(cx2 + r2 * sinA);
  const by = Math.round(cy - r2 * cosA);
  return (
    <svg width="250" height="200" viewBox="0 0 250 200">
      <circle cx={cx1} cy={cy} r={r1} fill="none" stroke="#fbbf24" strokeWidth="2"/>
      <circle cx={cx1} cy={cy} r="3" fill="var(--icon-color)"/>
      <circle cx={cx2} cy={cy} r={r2} fill="none" stroke="#f97316" strokeWidth="2"/>
      <circle cx={cx2} cy={cy} r="3" fill="var(--icon-color)"/>
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#34d399" strokeWidth="2"/>
      <line x1={ax} y1={2 * cy - ay} x2={bx} y2={2 * cy - by} stroke="#34d399" strokeWidth="2"/>
      <circle cx={ax} cy={ay} r="3" fill="#fb923c"/>
      <circle cx={bx} cy={by} r="3" fill="#fb923c"/>
      <circle cx={ax} cy={2 * cy - ay} r="3" fill="#fb923c"/>
      <circle cx={bx} cy={2 * cy - by} r="3" fill="#fb923c"/>
      <line x1={cx1} y1={cy} x2={cx2} y2={cy} stroke="var(--icon-stroke)" strokeWidth="1" strokeDasharray="4,3" opacity="0.35"/>
      <text x={ax - 2} y={ay - 7} fill="#fb923c" fontSize="12" fontWeight="bold">A</text>
      <text x={bx + 4} y={by - 7} fill="#fb923c" fontSize="12" fontWeight="bold">B</text>
      <text x={cx1 - 6} y={cy + 18} fill="#fbbf24" fontSize="10">r₁=7 cm</text>
      <text x={cx2 - 14} y={cy + 26} fill="#f97316" fontSize="10">r₂=21 cm</text>
      <text x="103" y={cy + 12} fill="#e2e8f0" fontSize="10">d = 50 cm</text>
    </svg>
  );
};

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  difficulty?: "Mudah" | "Sedang" | "Sulit";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Menghitung Panjang Garis Singgung", {
    difficulty: "Mudah",
    diagram: <SvgSatu />,
    content: "Perhatikan gambar! AP adalah garis singgung lingkaran berpusat O. Panjang jari-jari OA = 15 cm dan jarak OP = 39 cm. Hitunglah panjang garis singgung AP!",
    parts: [
      { label: "a.", math: "AP^2 = OP^2 - OA^2 = 39^2 - 15^2 = \\ldots" },
      { label: "b.", math: "AP = \\sqrt{\\ldots} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Hitunglah luas segitiga OAP!" },
    ],
  }),
  Qn(2, "Mencari Jarak Titik ke Pusat Lingkaran", {
    difficulty: "Mudah",
    diagram: <SvgDua />,
    content: "Pada gambar di atas, KA adalah garis singgung lingkaran berpusat O dengan A sebagai titik singgung. Panjang KA = 40 cm dan jari-jari OA = 30 cm. Hitunglah panjang KO!",
    parts: [
      { label: "a.", math: "KO^2 = KA^2 + OA^2 = 40^2 + 30^2 = \\ldots" },
      { label: "b.", math: "KO = \\sqrt{\\ldots} = \\ldots \\text{ cm}" },
      { label: "c.", text: "Hitunglah luas segitiga KOA!" },
    ],
  }),
  Qn(3, "Luas Trapesium dari Garis Singgung", {
    difficulty: "Sedang",
    diagram: <SvgTiga />,
    content: "Pada gambar, EF adalah garis singgung lingkaran berpusat O di titik C, dan EF // OD. Panjang EC = 16 cm dan OD = OC = 12 cm. Hitunglah luas trapesium ECOD!",
    parts: [
      { label: "a.", text: "Sebutkan panjang kedua sisi sejajar trapesium ECOD dan tingginya!" },
      { label: "b.", math: "EO = \\sqrt{EC^2 + OC^2} = \\sqrt{16^2 + 12^2} = \\ldots \\text{ cm}" },
      { label: "c.", math: "\\text{Luas} = \\tfrac{1}{2}(EC + OD) \\times OC = \\tfrac{1}{2}(16 + 12) \\times 12 = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(4, "Dua Garis Singgung dari Titik Luar", {
    difficulty: "Sedang",
    diagram: <SvgEmpat />,
    content: "Pada gambar di atas, AB dan AC adalah garis singgung lingkaran berpusat O. Jari-jari OB = OC = 24 cm dan panjang AO = 40 cm. Hitunglah:",
    parts: [
      { label: "a.", math: "AB = \\sqrt{AO^2 - OB^2} = \\sqrt{40^2 - 24^2} = \\ldots \\text{ cm}" },
      { label: "b.", math: "\\text{Luas } \\triangle ABO = \\tfrac{1}{2} \\times OB \\times AB = \\ldots \\text{ cm}^2" },
      { label: "c.", math: "\\text{Luas layang-layang } ABOC = 2 \\times \\text{Luas } \\triangle ABO = \\ldots \\text{ cm}^2" },
      { label: "d.", math: "\\text{Tali busur } BC = 2 \\times OB \\times \\sin(\\angle BOA) = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(5, "Panjang Garis Singgung pada Layang-layang", {
    difficulty: "Sedang",
    diagram: <SvgLima />,
    content: "Pada gambar, PQ dan PR adalah garis singgung lingkaran berpusat O. Jari-jari OQ = OR = 15 cm dan panjang OP = 25 cm. Hitunglah:",
    parts: [
      { label: "a.", math: "PQ = \\sqrt{OP^2 - OQ^2} = \\sqrt{25^2 - 15^2} = \\ldots \\text{ cm}" },
      { label: "b.", math: "QR = \\frac{2 \\times OQ \\times PQ}{OP} = \\frac{2 \\times 15 \\times \\ldots}{25} = \\ldots \\text{ cm}" },
      { label: "c.", math: "\\text{Luas layang-layang } OQPR = \\tfrac{1}{2} \\times OP \\times QR = \\ldots \\text{ cm}^2" },
    ],
  }),
  Qn(6, "Jari-jari, Layang-layang, dan Tali Busur", {
    difficulty: "Sedang",
    diagram: <SvgEnam />,
    content: "Pada lingkaran berpusat O, titik K berada di luar lingkaran dengan KL dan KM sebagai garis singgung. Panjang OK = 50 cm dan KL = 40 cm. Hitunglah:",
    parts: [
      { label: "a.", math: "r = OL = \\sqrt{OK^2 - KL^2} = \\sqrt{50^2 - 40^2} = \\ldots \\text{ cm}" },
      { label: "b.", math: "\\text{Luas layang-layang } LOMK = 2 \\times \\tfrac{1}{2} \\times OL \\times KL = \\ldots \\text{ cm}^2" },
      { label: "c.", math: "\\text{Tali busur } LM = \\frac{2 \\times OL \\times KL}{OK} = \\frac{2 \\times \\ldots \\times 40}{50} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(7, "Garis Singgung pada Sistem Roda-Sabuk", {
    difficulty: "Sulit",
    diagram: <SvgTujuh />,
    content: "Dua roda pada sebuah mesin berbentuk lingkaran dengan jari-jari masing-masing 7 cm (roda kecil) dan 21 cm (roda besar). Jarak antara kedua poros = 50 cm. Sebuah sabuk melilit kedua roda pada titik singgung A dan B. Hitunglah:",
    parts: [
      { label: "a.", math: "AB = \\sqrt{d^2 - (r_2 - r_1)^2} = \\sqrt{50^2 - (21-7)^2} = \\sqrt{2500 - 196} = \\ldots \\text{ cm}" },
      { label: "b.", math: "\\text{Keliling roda kecil} = 2 \\times \\frac{22}{7} \\times 7 = \\ldots \\text{ cm}" },
      { label: "c.", math: "\\text{Keliling roda besar} = 2 \\times \\frac{22}{7} \\times 21 = \\ldots \\text{ cm}" },
    ],
  }),
];

const diffColor: Record<string, string> = {
  Mudah: "bg-amber-500/20 text-amber-300 border-amber-400/40",
  Sedang: "bg-orange-500/20 text-orange-300 border-orange-400/40",
  Sulit: "bg-rose-500/20 text-rose-300 border-rose-400/40",
};

const MenghitungPanjangPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
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
            MENGHITUNG PANJANG GARIS SINGGUNG
          </h1>
          <p className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs text-center font-body`}>Kelas 8 · Garis Singgung Lingkaran · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 7 {t('practice.suffixSoal')}</span>
            <span className={`${isDark ? "text-white/30" : "text-gray-400"} text-xs`}>·</span>
            <span className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs`}>UN / ANBK / TKA</span>
          </div>
        </div>

        <div className={`mb-5 ${isDark ? "bg-orange-900/20" : "bg-orange-50"} border border-orange-500/20 rounded-xl p-4`}>
          <p className="text-orange-300 text-xs font-bold mb-2">📌 Rumus Panjang Garis Singgung dari Titik Luar</p>
          <div className={`${isDark ? "bg-white/5" : "bg-gray-50"} rounded-lg px-3 py-3 mb-2 flex justify-center`}>
            <BlockMath math="PT = \sqrt{OP^2 - r^2}" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { l: "PT", v: "Panjang garis singgung" },
              { l: "OP", v: "Jarak titik P ke pusat" },
              { l: "r", v: "Jari-jari lingkaran" },
            ].map(x => (
              <div key={x.l} className={`${isDark ? "bg-white/5" : "bg-gray-50"} rounded-lg px-2 py-2 text-center`}>
                <span className="text-orange-400 font-bold block">{x.l}</span>
                <span className={`${isDark ? "text-white/50" : "text-gray-500"} text-[10px]`}>{x.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.04}s` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? "from-orange-900/30 via-slate-900/80 to-amber-900/30" : "from-orange-50/60 via-white/80 to-amber-50/40"} backdrop-blur`} />
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center shrink-0">
                    <span className="text-orange-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded">
                        {q.title}
                      </span>
                      {q.difficulty && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor[q.difficulty]}`}>
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                    {q.content && <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"} leading-relaxed mb-3`}>{q.content}</p>}
                    {q.diagram && <div className={`mb-3 flex justify-center ${isDark ? "bg-white/5" : "bg-gray-50"} rounded-xl p-2`}>{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                            <span className="text-orange-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math
                              ? <div className={`${isDark ? "text-white" : "text-gray-900"} text-sm overflow-x-auto`}><InlineMath math={p.math} /></div>
                              : <p className={`font-body text-sm ${isDark ? "text-white/80" : "text-gray-700"}`}>{p.text}</p>
                            }
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/garis-singgung-lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-orange-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Garis Singgung Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenghitungPanjangPage;
