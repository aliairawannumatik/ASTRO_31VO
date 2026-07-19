import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const ac = "#f97316";
const ac2 = "#fb923c";

const BoxSVG = ({ p = "p", l = "l", t = "t" }: { p?: string; l?: string; t?: string }) => (
  <svg width="200" height="150" viewBox="0 0 200 150" className="mx-auto">
    <defs>
      <linearGradient id="boxFront" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={ac} stopOpacity="0.35" />
        <stop offset="100%" stopColor={ac} stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="boxTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={ac} stopOpacity="0.55" />
        <stop offset="100%" stopColor={ac} stopOpacity="0.28" />
      </linearGradient>
      <linearGradient id="boxRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={ac} stopOpacity="0.2" />
        <stop offset="100%" stopColor={ac} stopOpacity="0.08" />
      </linearGradient>
    </defs>
    <polygon points="20,120 130,120 130,50 20,50" fill="url(#boxFront)" stroke={ac} strokeWidth="1.8" />
    <polygon points="20,50 130,50 170,20 60,20" fill="url(#boxTop)" stroke={ac} strokeWidth="1.8" />
    <polygon points="130,50 170,20 170,90 130,120" fill="url(#boxRight)" stroke={ac} strokeWidth="1.8" />
    <line x1="20" y1="120" x2="60" y2="90" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="60" y1="90" x2="170" y2="90" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="60" y1="90" x2="60" y2="20" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <text x="68" y="140" fill={ac2} fontSize="11" textAnchor="middle" fontFamily="monospace">{p}</text>
    <text x="158" y="108" fill={ac2} fontSize="11" textAnchor="middle" fontFamily="monospace">{l}</text>
    <text x="133" y="85" fill={ac2} fontSize="11" textAnchor="start" fontFamily="monospace">{t}</text>
    {[[20,120],[130,120],[130,50],[20,50],[60,20],[170,20],[170,90],[60,90]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill={ac} fillOpacity="0.9" />
    ))}
  </svg>
);

const RoomSVG = () => (
  <svg width="200" height="155" viewBox="0 0 200 155" className="mx-auto">
    <defs>
      <linearGradient id="roomFloor" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <polygon points="10,130 130,130 130,40 10,40" fill="#f97316" fillOpacity="0.15" stroke={ac} strokeWidth="1.8" />
    <polygon points="10,40 130,40 170,10 50,10" fill="#f97316" fillOpacity="0.3" stroke={ac} strokeWidth="1.8" />
    <polygon points="130,40 170,10 170,100 130,130" fill="#f97316" fillOpacity="0.1" stroke={ac} strokeWidth="1.8" />
    <line x1="10" y1="130" x2="50" y2="100" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="50" y1="100" x2="170" y2="100" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="50" y1="100" x2="50" y2="10" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <text x="68" y="148" fill="#fb923c" fontSize="10" textAnchor="middle">panjang (p)</text>
    <text x="162" y="120" fill="#fb923c" fontSize="10" textAnchor="start">lebar (l)</text>
    <text x="133" y="80" fill="#fb923c" fontSize="10" textAnchor="start">tinggi (t)</text>
    {[[10,130],[130,130],[130,40],[10,40],[50,10],[170,10],[170,100],[50,100]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill={ac} fillOpacity="0.9" />
    ))}
  </svg>
);

const AquariumSVG = () => (
  <svg width="200" height="155" viewBox="0 0 200 155" className="mx-auto">
    <polygon points="15,130 145,130 145,45 15,45" fill="#0ea5e9" fillOpacity="0.12" stroke="#38bdf8" strokeWidth="1.8" />
    <polygon points="15,45 145,45 185,15 55,15" fill="#0ea5e9" fillOpacity="0.28" stroke="#38bdf8" strokeWidth="1.8" />
    <polygon points="145,45 185,15 185,100 145,130" fill="#0ea5e9" fillOpacity="0.08" stroke="#38bdf8" strokeWidth="1.8" />
    <line x1="15" y1="130" x2="55" y2="100" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="55" y1="100" x2="185" y2="100" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="55" y1="100" x2="55" y2="15" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <polygon points="15,100 145,100 185,70 55,70" fill="#0ea5e9" fillOpacity="0.18" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5,3" />
    <text x="78" y="148" fill="#7dd3fc" fontSize="10" textAnchor="middle">60 cm</text>
    <text x="178" y="118" fill="#7dd3fc" fontSize="10" textAnchor="start">30 cm</text>
    <text x="148" y="78" fill="#7dd3fc" fontSize="10" textAnchor="start">40 cm</text>
    <text x="95" y="92" fill="#38bdf8" fontSize="9" textAnchor="middle">level air (¾)</text>
    {[[15,130],[145,130],[145,45],[15,45],[55,15],[185,15],[185,100],[55,100]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#38bdf8" fillOpacity="0.9" />
    ))}
    <text x="100" y="50" fill="#7dd3fc" fontSize="22" textAnchor="middle">🐟</text>
  </svg>
);

const TentSVG = () => (
  <svg width="200" height="155" viewBox="0 0 200 155" className="mx-auto">
    <defs>
      <linearGradient id="tentRoof" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    <polygon points="100,15 20,120 180,120" fill="url(#tentRoof)" stroke="#34d399" strokeWidth="2" />
    <polygon points="100,15 20,120 20,140 100,35" fill="#34d399" fillOpacity="0.15" stroke="#34d399" strokeWidth="1.5" />
    <polygon points="100,15 180,120 180,140 100,35" fill="#10b981" fillOpacity="0.1" stroke="#34d399" strokeWidth="1.5" />
    <line x1="20" y1="140" x2="180" y2="140" stroke="#34d399" strokeWidth="2" />
    <line x1="100" y1="35" x2="100" y2="120" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" />
    <text x="100" y="150" fill="#6ee7b7" fontSize="10" textAnchor="middle">alas = 8 m</text>
    <text x="55" y="75" fill="#6ee7b7" fontSize="10" textAnchor="middle">sisi miring</text>
    <line x1="96" y1="60" x2="96" y2="120" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2" />
    <text x="82" y="95" fill="#fbbf24" fontSize="9" textAnchor="middle">t = 3 m</text>
    {[[100,15],[20,120],[180,120],[20,140],[180,140]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="2.5" fill="#34d399" />
    ))}
  </svg>
);

const RoofSVG = () => (
  <svg width="210" height="165" viewBox="0 0 210 165" className="mx-auto">
    <polygon points="25,140 165,140 165,80 25,80" fill="#a78bfa" fillOpacity="0.18" stroke="#a78bfa" strokeWidth="1.8" />
    <polygon points="25,80 165,80 200,55 60,55" fill="#a78bfa" fillOpacity="0.3" stroke="#a78bfa" strokeWidth="1.8" />
    <polygon points="165,80 200,55 200,115 165,140" fill="#a78bfa" fillOpacity="0.1" stroke="#a78bfa" strokeWidth="1.8" />
    <polygon points="105,30 25,80 165,80" fill="#8b5cf6" fillOpacity="0.55" stroke="#a78bfa" strokeWidth="2" />
    <polygon points="105,30 60,55 200,55 165,80 105,30" fill="#7c3aed" fillOpacity="0.35" stroke="#a78bfa" strokeWidth="2" />
    <line x1="25" y1="140" x2="60" y2="115" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="60" y1="115" x2="200" y2="115" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="60" y1="115" x2="60" y2="55" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <text x="93" y="158" fill="#c4b5fd" fontSize="10" textAnchor="middle">panjang</text>
    <text x="185" y="132" fill="#c4b5fd" fontSize="10" textAnchor="start">lebar</text>
    <text x="107" y="45" fill="#fbbf24" fontSize="10" textAnchor="middle">atap limas</text>
  </svg>
);

const PoolSVG = () => (
  <svg width="210" height="155" viewBox="0 0 210 155" className="mx-auto">
    <defs>
      <linearGradient id="poolWater" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#0369a1" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    <polygon points="10,130 160,130 160,55 10,55" fill="#0ea5e9" fillOpacity="0.1" stroke="#38bdf8" strokeWidth="2" />
    <polygon points="10,55 160,55 195,25 45,25" fill="#0ea5e9" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2" />
    <polygon points="160,55 195,25 195,100 160,130" fill="#0ea5e9" fillOpacity="0.08" stroke="#38bdf8" strokeWidth="2" />
    <polygon points="10,100 160,100 195,70 45,70" fill="url(#poolWater)" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5,3" />
    <line x1="10" y1="130" x2="45" y2="100" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="45" y1="100" x2="195" y2="100" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="45" y1="100" x2="45" y2="25" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <text x="82" y="148" fill="#7dd3fc" fontSize="11" textAnchor="middle">25 m</text>
    <text x="188" y="118" fill="#7dd3fc" fontSize="11">12 m</text>
    <text x="163" y="84" fill="#7dd3fc" fontSize="11">2 m</text>
    <text x="100" y="92" fill="#38bdf8" fontSize="9" textAnchor="middle">permukaan air</text>
  </svg>
);

const WarehouseSVG = () => (
  <svg width="210" height="155" viewBox="0 0 210 155" className="mx-auto">
    <polygon points="15,130 155,130 155,55 15,55" fill="#f97316" fillOpacity="0.12" stroke={ac} strokeWidth="2" />
    <polygon points="15,55 155,55 190,25 50,25" fill="#f97316" fillOpacity="0.28" stroke={ac} strokeWidth="2" />
    <polygon points="155,55 190,25 190,100 155,130" fill="#f97316" fillOpacity="0.1" stroke={ac} strokeWidth="2" />
    <line x1="15" y1="130" x2="50" y2="100" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="50" y1="100" x2="190" y2="100" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="50" y1="100" x2="50" y2="25" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <rect x="55" y="85" width="55" height="45" fill="#f97316" fillOpacity="0.25" stroke={ac} strokeWidth="1.5" />
    <text x="82" y="113" fill={ac2} fontSize="9" textAnchor="middle">pintu</text>
    <text x="80" y="148" fill={ac2} fontSize="11" textAnchor="middle">20 m</text>
    <text x="182" y="118" fill={ac2} fontSize="11">12 m</text>
    <text x="158" y="82" fill={ac2} fontSize="11">8 m</text>
  </svg>
);

const PrismTriSVG = () => (
  <svg width="200" height="155" viewBox="0 0 200 155" className="mx-auto">
    <defs>
      <linearGradient id="prismFront" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    <polygon points="30,130 130,130 80,55" fill="url(#prismFront)" stroke="#34d399" strokeWidth="2" />
    <polygon points="30,130 80,55 130,55 180,130" fill="#10b981" fillOpacity="0.12" stroke="#34d399" strokeWidth="2" />
    <polygon points="130,130 80,55 130,55 180,130" fill="#34d399" fillOpacity="0.1" stroke="#34d399" strokeWidth="2" />
    <line x1="30" y1="130" x2="180" y2="130" stroke="#34d399" strokeWidth="2" />
    <line x1="80" y1="55" x2="130" y2="55" stroke="#34d399" strokeWidth="2" />
    <line x1="80" y1="55" x2="80" y2="130" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6" />
    <text x="78" y="150" fill="#6ee7b7" fontSize="10" textAnchor="middle" fontFamily="monospace">alas</text>
    <text x="45" y="97" fill="#6ee7b7" fontSize="10" textAnchor="middle" fontFamily="monospace">tinggi △</text>
    <text x="105" y="45" fill="#6ee7b7" fontSize="10" textAnchor="middle" fontFamily="monospace">panjang prisma</text>
    {[[30,130],[130,130],[80,55],[180,130],[130,55]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="2.5" fill="#34d399" />
    ))}
  </svg>
);

const PyramidSVG = () => (
  <svg width="200" height="165" viewBox="0 0 200 165" className="mx-auto">
    <defs>
      <linearGradient id="pyrFront" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id="pyrRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <polygon points="100,20 20,140 180,140" fill="url(#pyrFront)" stroke="#f59e0b" strokeWidth="2" />
    <polygon points="100,20 180,140 180,140 130,100" fill="url(#pyrRight)" stroke="#f59e0b" strokeWidth="1.5" />
    <line x1="20" y1="140" x2="80" y2="110" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="80" y1="110" x2="180" y2="110" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="80" y1="110" x2="100" y2="20" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="100" y1="20" x2="100" y2="140" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" />
    <text x="100" y="158" fill="#fcd34d" fontSize="10" textAnchor="middle">alas = s</text>
    <text x="113" y="82" fill="#fbbf24" fontSize="10">t</text>
    {[[100,20],[20,140],[180,140],[80,110],[180,110]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="2.5" fill="#f59e0b" />
    ))}
  </svg>
);

const BrickWallSVG = () => (
  <svg width="200" height="140" viewBox="0 0 200 140" className="mx-auto">
    {[0,1,2,3].map(row => (
      [0,1,2,3,4].map(col => {
        const x = (row % 2 === 0 ? col * 38 : col * 38 - 19) + 5;
        const y = row * 28 + 10;
        return x >= 0 && x + 35 <= 200 ? (
          <rect key={`${row}-${col}`} x={x} y={y} width="35" height="22"
            fill="#f97316" fillOpacity={0.15 + row * 0.06}
            stroke={ac} strokeWidth="1.2" rx="2" />
        ) : null;
      })
    ))}
    <text x="100" y="132" fill={ac2} fontSize="10" textAnchor="middle">dinding bata (p × l)</text>
    <line x1="8" y1="10" x2="8" y2="122" stroke="#fbbf24" strokeWidth="1.5" />
    <line x1="4" y1="10" x2="12" y2="10" stroke="#fbbf24" strokeWidth="1.5" />
    <line x1="4" y1="122" x2="12" y2="122" stroke="#fbbf24" strokeWidth="1.5" />
    <text x="2" y="70" fill="#fbbf24" fontSize="9" textAnchor="middle" transform="rotate(-90,2,70)">tinggi</text>
  </svg>
);

const CombinedShapeSVG = () => (
  <svg width="200" height="175" viewBox="0 0 200 175" className="mx-auto">
    <polygon points="100,15 25,75 175,75" fill="#a78bfa" fillOpacity="0.5" stroke="#a78bfa" strokeWidth="2" />
    <polygon points="25,75 175,75 175,155 25,155" fill="#f97316" fillOpacity="0.2" stroke={ac} strokeWidth="2" />
    <line x1="25" y1="75" x2="175" y2="75" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="100" y="120" fill={ac2} fontSize="11" textAnchor="middle" fontFamily="monospace">BALOK/KUBUS</text>
    <text x="100" y="48" fill="#c4b5fd" fontSize="11" textAnchor="middle" fontFamily="monospace">ATAP LIMAS</text>
    <line x1="25" y1="155" x2="175" y2="155" stroke={ac} strokeWidth="2" />
    {[[25,75],[175,75],[100,15],[25,155],[175,155]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="2.5" fill="#a78bfa" />
    ))}
  </svg>
);

const GudangSVG = () => (
  <svg width="210" height="165" viewBox="0 0 210 165" className="mx-auto">
    <polygon points="20,145 170,145 170,75 20,75" fill="#f97316" fillOpacity="0.12" stroke={ac} strokeWidth="2" />
    <polygon points="20,75 170,75 200,50 50,50" fill="#f97316" fillOpacity="0.25" stroke={ac} strokeWidth="2" />
    <polygon points="170,75 200,50 200,120 170,145" fill="#f97316" fillOpacity="0.08" stroke={ac} strokeWidth="2" />
    <line x1="20" y1="145" x2="50" y2="120" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="50" y1="120" x2="200" y2="120" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="50" y1="120" x2="50" y2="50" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <polygon points="95,30 20,75 170,75" fill="#f59e0b" fillOpacity="0.4" stroke="#f59e0b" strokeWidth="2" />
    <polygon points="95,30 50,50 200,50 170,75" fill="#d97706" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="2" />
    <text x="92" y="160" fill={ac2} fontSize="10" textAnchor="middle">panjang</text>
    <text x="37" y="43" fill="#fcd34d" fontSize="10" textAnchor="middle">atap limas</text>
  </svg>
);

const CardboardSVG = () => (
  <svg width="200" height="155" viewBox="0 0 200 155" className="mx-auto">
    <polygon points="15,130 135,130 135,50 15,50" fill="#f97316" fillOpacity="0.15" stroke={ac} strokeWidth="2" />
    <polygon points="15,50 135,50 175,20 55,20" fill="#f97316" fillOpacity="0.3" stroke={ac} strokeWidth="2" />
    <polygon points="135,50 175,20 175,100 135,130" fill="#f97316" fillOpacity="0.1" stroke={ac} strokeWidth="2" />
    <line x1="15" y1="130" x2="55" y2="100" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="55" y1="100" x2="175" y2="100" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="55" y1="100" x2="55" y2="20" stroke={ac} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <text x="74" y="148" fill={ac2} fontSize="11" textAnchor="middle">40 cm</text>
    <text x="168" y="118" fill={ac2} fontSize="11">25 cm</text>
    <text x="138" y="78" fill={ac2} fontSize="11">30 cm</text>
    <text x="75" y="93" fill="#fcd34d" fontSize="18" textAnchor="middle">📦</text>
    {[[15,130],[135,130],[135,50],[15,50],[55,20],[175,20],[175,100],[55,100]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="2.5" fill={ac} fillOpacity="0.9" />
    ))}
  </svg>
);

const questions: Q[] = [
  Qn(1, "Kotak Kardus – Luas Permukaan (UN)", {
    type: "mixed",
    content: "Sebuah kotak kardus berbentuk balok dengan panjang 40 cm, lebar 25 cm, dan tinggi 30 cm.",
    diagram: <CardboardSVG />,
    parts: [
      { label: "a.", math: "\\text{Hitung luas permukaan kardus: } L = 2(pl + pt + lt)" },
      { label: "b.", text: "Sebuah pabrik membuat 200 kotak seperti itu. Berapa m² karton yang dibutuhkan?" },
      { label: "c.", text: "Jika harga karton Rp8.000 per m², berapa total biaya bahan?" },
    ],
  }),
  Qn(2, "Kolam Renang Sekolah – Volume (UN/ANBK)", {
    type: "mixed",
    content: "Kolam renang sekolah berbentuk balok dengan panjang 25 m, lebar 12 m, dan kedalaman 2 m.",
    diagram: <PoolSVG />,
    parts: [
      { label: "a.", math: "\\text{Hitung volume kolam: } V = p \\times l \\times t" },
      { label: "b.", math: "\\text{Konversikan ke liter } (1 \\text{ m}^3 = 1000 \\text{ liter})" },
      { label: "c.", text: "Air diisi dengan pompa berkecepatan 300 liter/menit. Berapa jam waktu yang diperlukan?" },
    ],
  }),
  Qn(3, "Aquarium Ikan – Soal Gabungan (TKA)", {
    type: "mixed",
    content: "Sebuah aquarium berbentuk balok dengan panjang 60 cm, lebar 30 cm, dan tinggi 40 cm.",
    diagram: <AquariumSVG />,
    parts: [
      { label: "a.", text: "Hitung volume aquarium dalam cm³." },
      { label: "b.", math: "\\text{Aquarium diisi air hingga } \\tfrac{3}{4} \\text{ penuh. Berapa liter air?}" },
      { label: "c.", text: "Hitung luas kaca yang dibutuhkan (5 sisi: tanpa tutup atas)." },
    ],
  }),
  Qn(4, "Bak Mandi Kubus – Pengisian Air (UN)", {
    type: "mixed",
    content: "Sebuah bak mandi berbentuk kubus dengan panjang rusuk 80 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung volume bak mandi dalam cm}^3" },
      { label: "b.", math: "\\text{Nyatakan dalam liter } (1 \\text{ liter} = 1000 \\text{ cm}^3)" },
      { label: "c.", text: "Air mengalir 4 liter per menit. Berapa menit untuk mengisi bak hingga penuh?" },
    ],
  }),
  Qn(5, "Pengecatan Dinding Kamar – Kontekstual (ANBK)", {
    type: "mixed",
    content: "Sebuah kamar berbentuk balok dengan panjang 5 m, lebar 4 m, dan tinggi 3 m. Semua dinding dan langit-langit akan dicat.",
    diagram: <RoomSVG />,
    parts: [
      { label: "a.", text: "Hitung luas dinding yang akan dicat (4 dinding + langit-langit)." },
      { label: "b.", text: "Setiap kaleng cat mampu menutup 8 m². Berapa kaleng cat yang dibutuhkan?" },
      { label: "c.", text: "Harga satu kaleng Rp45.000. Berapa total biaya pengecatan?" },
    ],
  }),
  Qn(6, "Gudang Berbentuk Balok – Biaya Material (UN)", {
    type: "mixed",
    content: "Sebuah gudang berbentuk balok dengan panjang 20 m, lebar 12 m, dan tinggi 8 m.",
    diagram: <WarehouseSVG />,
    parts: [
      { label: "a.", text: "Hitung volume gudang tersebut." },
      { label: "b.", text: "Seluruh dinding luar (4 sisi tegak) akan dilapisi cat anti karat. Hitung luasnya." },
      { label: "c.", text: "Biaya pelapisan Rp25.000 per m². Berapa total biayanya?" },
    ],
  }),
  Qn(7, "Kubus Es Batu – Soal ANBK", {
    type: "mixed",
    content: "Sebuah cetakan es batu berbentuk kubus dengan panjang rusuk 3 cm. Satu nampan berisi 20 cetakan es batu.",
    parts: [
      { label: "a.", text: "Hitung volume satu es batu dalam cm³." },
      { label: "b.", text: "Berapa cm³ total air yang diperlukan untuk mengisi satu nampan?" },
      { label: "c.", math: "\\text{Nyatakan dalam mL } (1 \\text{ cm}^3 = 1 \\text{ mL})" },
    ],
  }),
  Qn(8, "Dus Produk – Kemasan (TKA/UN)", {
    type: "mixed",
    content: "Sebuah perusahaan mengemas sabun dalam dus berbentuk balok berukuran 8 cm × 5 cm × 4 cm.",
    diagram: <BoxSVG p="8 cm" l="5 cm" t="4 cm" />,
    parts: [
      { label: "a.", text: "Hitung luas permukaan satu dus sabun." },
      { label: "b.", text: "Hitung volume satu dus sabun." },
      { label: "c.", text: "Dalam sebuah karton besar berukuran 40 cm × 25 cm × 20 cm, berapa dus sabun yang bisa masuk?" },
    ],
  }),
  Qn(9, "Tenda Pramuka – Prisma Segitiga (UN)", {
    type: "mixed",
    content: "Sebuah tenda berbentuk prisma segitiga. Alas segitiga 3 m, tinggi segitiga 2 m, dan panjang tenda 4 m.",
    diagram: <TentSVG />,
    parts: [
      { label: "a.", math: "\\text{Luas alas segitiga} = \\frac{1}{2} \\times 3 \\times 2 = \\ldots \\text{ m}^2" },
      { label: "b.", math: "\\text{Volume tenda} = L_{\\triangle} \\times \\text{panjang} = \\ldots \\text{ m}^3" },
      { label: "c.", text: "Kanvas penutup tenda menutupi 2 sisi segitiga dan 2 sisi persegi panjang (tanpa alas). Hitung luas kanvas jika sisi miring segitiga = 2,5 m." },
    ],
  }),
  Qn(10, "Atap Rumah Prisma – Genteng (ANBK)", {
    type: "mixed",
    content: "Atap rumah berbentuk prisma segitiga dengan alas 8 m, tinggi segitiga 3 m, dan panjang rumah 12 m.",
    parts: [
      { label: "a.", text: "Hitung luas alas segitiga atap." },
      { label: "b.", text: "Volume ruang di dalam atap adalah?" },
      { label: "c.", text: "Luas kedua bidang miring atap jika sisi miring = 5 m. Satu genteng menutup 400 cm². Berapa jumlah genteng yang dibutuhkan?" },
    ],
  }),
  Qn(11, "Kolam Ikan Berbentuk Prisma – UN", {
    type: "mixed",
    content: "Sebuah kolam ikan berbentuk prisma segitiga dengan penampang segitiga siku-siku. Sisi-sisi siku-sikunya 3 m dan 4 m, panjang kolam 10 m.",
    diagram: <PrismTriSVG />,
    parts: [
      { label: "a.", math: "\\text{Hitung luas alas: } L = \\frac{1}{2} \\times 3 \\times 4" },
      { label: "b.", text: "Hitung volume kolam dalam m³, lalu konversikan ke liter." },
      { label: "c.", text: "Kolam diisi ikan dengan kepadatan 5 ikan/m³. Berapa ikan yang bisa dipelihara?" },
    ],
  }),
  Qn(12, "Tenda Kemah – Kain Penutup (TKA)", {
    type: "mixed",
    content: "Tenda kemah berbentuk prisma segitiga sama kaki. Alas = 4 m, tinggi segitiga = 3 m, panjang tenda = 6 m. Sisi miring segitiga = 2,5 m.",
    parts: [
      { label: "a.", text: "Hitung volume ruang tenda." },
      { label: "b.", text: "Hitung luas kain yang dibutuhkan untuk menutup 2 sisi segitiga dan 2 sisi persegi panjang." },
      { label: "c.", text: "Harga kain Rp50.000/m². Berapa biaya kain tenda?" },
    ],
  }),
  Qn(13, "Atap Rumah Bentuk Limas – ANBK", {
    type: "mixed",
    content: "Atap rumah berbentuk limas segi empat dengan alas berbentuk persegi berukuran 8 m × 8 m dan tinggi atap 3 m.",
    diagram: <RoofSVG />,
    parts: [
      { label: "a.", text: "Hitung luas alas atap." },
      { label: "b.", math: "\\text{Apotema: } a = \\sqrt{4^2 + 3^2} = \\ldots \\text{ m}" },
      { label: "c.", text: "Hitung luas seluruh bidang miring atap (4 segitiga). Berapa jumlah genteng jika satu genteng = 0,04 m²?" },
    ],
  }),
  Qn(14, "Monumen Berbentuk Limas – Soal UN", {
    type: "mixed",
    content: "Sebuah monumen berbentuk limas dengan alas persegi 6 m × 6 m dan tinggi 8 m.",
    diagram: <PyramidSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume limas: } V = \\frac{1}{3} \\times s^2 \\times t" },
      { label: "b.", math: "\\text{Apotema: } a = \\sqrt{3^2 + 8^2} = \\ldots" },
      { label: "c.", text: "Luas selimut monumen (4 sisi segitiga). Biaya pengecatan Rp200.000/m²." },
    ],
  }),
  Qn(15, "Limas Pasir di Tambang – Volume (TKA)", {
    type: "mixed",
    content: "Tumpukan pasir berbentuk limas segi empat dengan alas 4 m × 4 m dan tinggi 3 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung volume pasir: } V = \\frac{1}{3} \\times 4^2 \\times 3" },
      { label: "b.", math: "\\text{Konversikan ke liter } (1 \\text{ m}^3 = 1000 \\text{ L})" },
      { label: "c.", text: "Truk mengangkut 2 m³ pasir per perjalanan. Berapa perjalanan untuk mengangkut semua pasir?" },
    ],
  }),
  Qn(16, "Piramida Dekorasi – Luas Permukaan (ANBK)", {
    type: "mixed",
    content: "Hiasan berbentuk limas segi empat dengan alas 10 cm × 10 cm dan tinggi 12 cm. Seluruh permukaannya dilapisi kertas emas.",
    parts: [
      { label: "a.", math: "\\text{Apotema miring: } a = \\sqrt{5^2 + 12^2} = 13 \\text{ cm}" },
      { label: "b.", text: "Hitung luas permukaan (alas + 4 sisi segitiga)." },
      { label: "c.", text: "Harga kertas emas Rp3.500/cm². Berapa biaya seluruh lapisan?" },
    ],
  }),
  Qn(17, "Ember Berbentuk Balok – ANBK", {
    type: "mixed",
    content: "Ember berbentuk balok dengan ukuran 30 cm × 25 cm × 20 cm digunakan untuk mengangkut air.",
    parts: [
      { label: "a.", text: "Berapa liter kapasitas ember?" },
      { label: "b.", text: "Dalam satu hari, ember dikosongkan 40 kali. Berapa liter air total yang diangkut?" },
      { label: "c.", text: "Jika diisi hanya 80% penuh tiap kali, berapa liter total dalam sehari?" },
    ],
  }),
  Qn(18, "Lemari Pakaian – Luas Permukaan (UN)", {
    type: "mixed",
    content: "Sebuah lemari pakaian berbentuk balok berukuran 120 cm × 60 cm × 200 cm.",
    diagram: <BoxSVG p="120 cm" l="60 cm" t="200 cm" />,
    parts: [
      { label: "a.", text: "Hitung volume lemari." },
      { label: "b.", text: "Seluruh permukaan luar lemari dilapisi HPL. Hitung luas total permukaannya." },
      { label: "c.", text: "HPL dijual Rp120.000 per m². Berapa biaya melapisi seluruh lemari?" },
    ],
  }),
  Qn(19, "Bata Merah – Soal ANBK", {
    type: "mixed",
    content: "Sebuah bata merah berbentuk balok berukuran 20 cm × 10 cm × 5 cm.",
    diagram: <BrickWallSVG />,
    parts: [
      { label: "a.", text: "Hitung volume satu bata merah." },
      { label: "b.", text: "Sebuah dinding berukuran 3 m × 4 m dengan ketebalan 10 cm. Berapa volume dinding?" },
      { label: "c.", text: "Berapa banyak bata yang dibutuhkan untuk membangun dinding tersebut?" },
    ],
  }),
  Qn(20, "Kotak Kado – Pita Pengikat (TKA)", {
    type: "mixed",
    content: "Kotak kado berbentuk kubus dengan panjang rusuk 25 cm. Kado diikat dengan pita yang melingkari panjang dan lebar, ditambah simpul 20 cm.",
    parts: [
      { label: "a.", text: "Hitung volume kotak kado." },
      { label: "b.", text: "Pita melingkari dua keliling (atas-bawah + kanan-kiri). Berapa panjang pita total termasuk simpul?" },
      { label: "c.", math: "\\text{Hitung luas permukaan kotak untuk membungkus kertasnya.}" },
    ],
  }),
  Qn(21, "Bak Sampah – Volume dan Tutup (UN)", {
    type: "mixed",
    content: "Tong sampah berbentuk balok dengan ukuran 40 cm × 40 cm × 60 cm. Tong tidak memiliki tutup.",
    parts: [
      { label: "a.", text: "Hitung volume tong sampah." },
      { label: "b.", text: "Berapa liter kapasitasnya?" },
      { label: "c.", text: "Hitung luas permukaan yang perlu dicat (5 sisi: tanpa tutup)." },
    ],
  }),
  Qn(22, "Isi Pasir dalam Truk – Balok (ANBK)", {
    type: "mixed",
    content: "Bak truk berbentuk balok berukuran 4 m × 2 m × 1,5 m diisi penuh dengan pasir.",
    parts: [
      { label: "a.", text: "Hitung volume pasir dalam m³." },
      { label: "b.", math: "\\text{Massa pasir jika kerapatan } 1{,}5 \\text{ ton/m}^3" },
      { label: "c.", text: "Pasir dituang ke 5 lokasi sama banyak. Berapa m³ tiap lokasi?" },
    ],
  }),
  Qn(23, "Pengecatan Atap Limas – TKA", {
    type: "mixed",
    content: "Atap mushola berbentuk limas segi empat. Alas 6 m × 6 m dan tinggi 4 m. Apotema = 5 m.",
    diagram: <RoofSVG />,
    parts: [
      { label: "a.", text: "Hitung luas setiap bidang miring (segi tiga)." },
      { label: "b.", text: "Hitung luas total 4 bidang miring yang harus dicat." },
      { label: "c.", text: "Cat dijual per kaleng cukup untuk 10 m². Berapa kaleng dibutuhkan? Harga satu kaleng Rp85.000." },
    ],
  }),
  Qn(24, "Kolam Renang Mini – Gabungan (UN)", {
    type: "mixed",
    content: "Kolam renang mini berbentuk balok. Panjang 6 m, lebar 3 m, kedalaman 1,2 m.",
    parts: [
      { label: "a.", text: "Hitung volume air saat kolam penuh." },
      { label: "b.", text: "Keramik dipasang di dasar dan 4 dinding dalam. Hitung luas keramik." },
      { label: "c.", text: "Harga keramik Rp75.000/m². Berapa total biaya keramik?" },
    ],
  }),
  Qn(25, "Tumpukan Kotak – Soal ANBK", {
    type: "mixed",
    content: "Kotak berbentuk kubus dengan rusuk 20 cm disusun dalam gudang berukuran 4 m × 3 m × 2 m.",
    parts: [
      { label: "a.", text: "Berapa banyak kotak yang bisa disusun secara memanjang, melebar, dan menumpuk?" },
      { label: "b.", text: "Berapa total kotak yang bisa ditampung gudang?" },
      { label: "c.", math: "\\text{Verifikasi: } \\frac{V_{\\text{gudang}}}{V_{\\text{kotak}}} = \\ldots" },
    ],
  }),
  Qn(26, "Bangunan Gabungan: Balok + Limas – UN", {
    type: "mixed",
    content: "Sebuah model bangunan terdiri dari balok di bawah (panjang 8 m, lebar 8 m, tinggi 5 m) dan limas di atas (alas sama, tinggi 4 m).",
    diagram: <CombinedShapeSVG />,
    parts: [
      { label: "a.", text: "Hitung volume balok." },
      { label: "b.", math: "\\text{Hitung volume limas: } V = \\frac{1}{3} \\times 8^2 \\times 4" },
      { label: "c.", text: "Berapa total volume seluruh bangunan?" },
    ],
  }),
  Qn(27, "Gedung Bertingkat – Soal TKA", {
    type: "mixed",
    content: "Gedung berbentuk balok berukuran 30 m × 20 m × 40 m (tinggi). Ada 10 lantai dengan tinggi tiap lantai sama.",
    parts: [
      { label: "a.", text: "Hitung volume total gedung." },
      { label: "b.", text: "Tinggi setiap lantai adalah?" },
      { label: "c.", text: "Luas lantai setiap tingkat. Jika harga sewa Rp500.000/m²/bulan, berapa pendapatan per bulan dari satu lantai?" },
    ],
  }),
  Qn(28, "Ikan dalam Akuarium – Soal ANBK", {
    type: "mixed",
    content: "Akuarium balok: panjang 80 cm, lebar 40 cm, tinggi 50 cm. Diisi air hingga 4 cm dari tepi atas.",
    parts: [
      { label: "a.", text: "Berapa cm tinggi air dalam akuarium?" },
      { label: "b.", text: "Hitung volume air dalam akuarium." },
      { label: "c.", math: "\\text{Konversikan ke liter dan mL } (1 \\text{ L} = 1000 \\text{ mL})" },
    ],
  }),
  Qn(29, "Tandon Air Kubus – UN Style", {
    type: "mixed",
    content: "Tandon air berbentuk kubus dengan volume 1.331 liter.",
    parts: [
      { label: "a.", math: "\\text{Cari rusuk: } s = \\sqrt[3]{1.331.000} = \\ldots \\text{ cm}" },
      { label: "b.", text: "Hitung luas permukaan tandon (6 sisi)." },
      { label: "c.", text: "Air mengalir keluar 5,5 liter per menit. Berapa menit hingga tandon kosong?" },
    ],
  }),
  Qn(30, "Kemasan Cokelat – Prisma Segitiga (TKA)", {
    type: "mixed",
    content: "Cokelat dikemas dalam kotak berbentuk prisma segitiga sama sisi. Sisi segitiga = 5 cm, tinggi = 15 cm.",
    diagram: <PrismTriSVG />,
    parts: [
      { label: "a.", math: "\\text{Luas segitiga sama sisi: } L = \\frac{\\sqrt{3}}{4} s^2 = \\frac{\\sqrt{3}}{4}(25) \\approx 10{,}825 \\text{ cm}^2" },
      { label: "b.", text: "Hitung volume kotak cokelat." },
      { label: "c.", text: "Hitung luas permukaan kotak untuk menentukan kebutuhan kertas pembungkus." },
    ],
  }),
  Qn(31, "Bak Penampung Hujan – ANBK", {
    type: "mixed",
    content: "Bak penampung air hujan berbentuk balok tanpa tutup. Ukuran: 150 cm × 100 cm × 80 cm.",
    parts: [
      { label: "a.", text: "Berapa liter kapasitas bak ini?" },
      { label: "b.", text: "Hitung luas permukaan yang butuh bahan (alas + 4 dinding)." },
      { label: "c.", text: "Bak diisi hujan dengan debit 200 liter/jam. Berapa jam hingga penuh?" },
    ],
  }),
  Qn(32, "Peti Kayu – Soal Gabungan (UN)", {
    type: "mixed",
    content: "Peti kayu berbentuk balok berukuran 1 m × 0,8 m × 0,6 m. Ketebalan kayu diabaikan.",
    parts: [
      { label: "a.", text: "Hitung volume isi peti." },
      { label: "b.", text: "Hitung luas permukaan peti (6 sisi)." },
      { label: "c.", text: "Peti diisi beras 5 kg/liter. Berapa kg beras yang muat?" },
    ],
  }),
  Qn(33, "Menara Lilin Berbentuk Prisma – TKA", {
    type: "mixed",
    content: "Lilin berbentuk prisma segi empat (balok) dengan panjang 5 cm, lebar 5 cm, dan tinggi 20 cm. Lilin terbakar 0,2 cm/menit.",
    parts: [
      { label: "a.", text: "Berapa menit lilin habis terbakar?" },
      { label: "b.", text: "Setelah 30 menit, berapa volume lilin yang tersisa?" },
      { label: "c.", math: "\\text{Volume tersisa} = 5 \\times 5 \\times (20 - 0{,}2 \\times 30) = \\ldots" },
    ],
  }),
  Qn(34, "Bangunan Rumah – Gabungan Balok+Limas (UN)", {
    type: "mixed",
    content: "Sebuah rumah terdiri dari ruangan berbentuk balok (8 m × 6 m × 4 m) dan atap berbentuk limas (alas 8 m × 6 m, tinggi 3 m).",
    diagram: <GudangSVG />,
    parts: [
      { label: "a.", text: "Hitung volume ruangan (balok)." },
      { label: "b.", math: "\\text{Hitung volume ruang atap (limas): } V = \\frac{1}{3} \\times 8 \\times 6 \\times 3" },
      { label: "c.", text: "Berapa total volume seluruh bangunan?" },
    ],
  }),
  Qn(35, "Kolam Ikan Limas Terbalik – ANBK", {
    type: "mixed",
    content: "Kolam ikan berbentuk limas terbalik (piramida terbalik) dengan alas persegi 4 m × 4 m dan kedalaman 2 m.",
    parts: [
      { label: "a.", math: "\\text{Volume kolam: } V = \\frac{1}{3} \\times 4^2 \\times 2" },
      { label: "b.", math: "\\text{Konversikan ke liter: } V = \\ldots \\text{ liter}" },
      { label: "c.", text: "Air diisi menggunakan pompa dengan debit 25 liter/menit. Berapa menit hingga penuh?" },
    ],
  }),
  Qn(36, "Soal UN – Biaya Lantai Keramik", {
    type: "mixed",
    content: "Lantai ruangan berukuran 6 m × 5 m akan dipasang keramik ukuran 30 cm × 30 cm. Harga keramik Rp12.000/buah.",
    parts: [
      { label: "a.", text: "Berapa banyak keramik yang dibutuhkan?" },
      { label: "b.", text: "Berapa biaya keramik seluruhnya?" },
      { label: "c.", text: "Ditambah biaya pasang Rp40.000/m². Berapa total biaya pemasangan?" },
    ],
  }),
  Qn(37, "Soal ANBK – Volume Gabungan", {
    type: "mixed",
    content: "Sebuah mainan terdiri dari kubus di bawah (rusuk 6 cm) dan limas di atas (alas sama, tinggi 4 cm).",
    diagram: <CombinedShapeSVG />,
    parts: [
      { label: "a.", math: "\\text{Volume kubus} = s^3 = 6^3 = \\ldots \\text{ cm}^3" },
      { label: "b.", math: "\\text{Volume limas} = \\frac{1}{3} \\times 6^2 \\times 4 = \\ldots \\text{ cm}^3" },
      { label: "c.", text: "Total volume mainan adalah?" },
    ],
  }),
  Qn(38, "Soal TKA – Tangki Minyak Balok", {
    type: "mixed",
    content: "Tangki minyak berbentuk balok berukuran 5 m × 3 m × 2 m. Minyak senilai Rp15.000 per liter.",
    parts: [
      { label: "a.", text: "Hitung volume tangki dalam m³." },
      { label: "b.", math: "\\text{Konversikan ke liter } (1 \\text{ m}^3 = 1000 \\text{ L})" },
      { label: "c.", text: "Berapa nilai total minyak jika tangki penuh?" },
    ],
  }),
  Qn(39, "Soal UN – Keramik Kolam Renang", {
    type: "mixed",
    content: "Kolam renang berbentuk balok: panjang 20 m, lebar 8 m, kedalaman 1,5 m. Seluruh bagian dalam dilapisi keramik.",
    diagram: <PoolSVG />,
    parts: [
      { label: "a.", text: "Hitung luas dasar kolam." },
      { label: "b.", text: "Hitung luas 4 dinding dalam kolam." },
      { label: "c.", text: "Total luas keramik. Biaya keramik Rp120.000/m². Hitung total biaya." },
    ],
  }),
  Qn(40, "Soal UN/ANBK – Penalaran Gabungan", {
    type: "mixed",
    content: "Pak Hasan memiliki gudang balok (10 m × 8 m × 6 m). Ia ingin menyimpan kotak kubus berrusuk 50 cm.",
    parts: [
      { label: "a.", text: "Berapa banyak kotak yang bisa disimpan dalam gudang?" },
      { label: "b.", text: "Hitung luas total permukaan luar gudang (tidak termasuk alas/lantai)." },
      { label: "c.", text: "Atap gudang berbentuk limas dengan tinggi 3 m. Hitung volume ruang atap." },
      { label: "d.", math: "\\text{Total volume = volume gudang + volume atap = \\ldots}" },
    ],
  }),
];

const MasalahKontekstualPage = () => {
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
            <span className="text-2xl">🏗️</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(249,115,22,0.7)' }}>
            MASALAH KONTEKSTUAL
          </h1>
          <p className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs text-center font-body`}>Kelas 8 · Bangun Ruang Sisi Datar · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 40 {t('practice.suffixSoal')}</span>
            <span className={`${isDark ? "text-white/30" : "text-gray-400"} text-xs`}>·</span>
            <span className={`${isDark ? "text-white/50" : "text-gray-500"} text-xs`}>UN / ANBK / TKA</span>
          </div>
        </div>

        <div className={`mb-5 ${isDark ? "bg-orange-900/20" : "bg-orange-50"} border border-orange-500/20 rounded-xl p-4`}>
          <p className="text-orange-300 text-xs font-bold mb-3">📐 Rumus-Rumus Penting</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { name: "Luas Permukaan Balok", math: "L = 2(pl + pt + lt)" },
              { name: "Volume Balok", math: "V = p \\times l \\times t" },
              { name: "Luas Permukaan Kubus", math: "L = 6s^2" },
              { name: "Volume Kubus", math: "V = s^3" },
              { name: "Volume Prisma", math: "V = L_{\\text{alas}} \\times t" },
              { name: "Volume Limas", math: "V = \\frac{1}{3} \\times L_{\\text{alas}} \\times t" },
            ].map(r => (
              <div key={r.name} className={`${isDark ? "bg-white/5" : "bg-gray-50"} rounded-lg px-3 py-2`}>
                <div className={`${isDark ? "text-white/40" : "text-gray-500"} text-[9px] uppercase mb-1`}>{r.name}</div>
                <div className="text-orange-300 text-xs"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? "from-orange-900/30 via-slate-900/80 to-amber-900/30" : "from-orange-50/60 via-white/80 to-amber-50/40"} backdrop-blur`} />
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
                    {q.content && <p className={`font-body text-sm ${isDark ? "text-white/90" : "text-gray-800"} leading-relaxed mb-3`}>{q.content}</p>}
                    {q.mathContent && (
                      <div className={`mb-3 ${isDark ? "bg-orange-900/20" : "bg-orange-50"} border border-orange-500/20 rounded-lg px-4 py-3 flex justify-center`}>
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className={`mb-3 flex justify-center ${isDark ? "bg-white/5" : "bg-gray-50"} rounded-xl p-3`}>{q.diagram}</div>}
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
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar"); }}
            className="text-sm text-muted-foreground hover:text-orange-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Bangun Ruang Sisi Datar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasalahKontekstualPage;
