import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const TwoXIntercepts = () => (
  <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
    <line x1="20" y1="120" x2="280" y2="120" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="280,120 274,116 274,124" fill="#94a3b8"/>
    <line x1="150" y1="185" x2="150" y2="10" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="150,10 146,16 154,16" fill="#94a3b8"/>
    <text x="283" y="124" fill="#94a3b8" fontSize="10">x</text>
    <text x="154" y="14" fill="#94a3b8" fontSize="10">y</text>
    <text x="154" y="132" fill="#94a3b8" fontSize="9">O</text>
    <path d="M 80,40 Q 150,180 220,40" stroke="#f59e0b" fill="none" strokeWidth="2.5"/>
    <circle cx="80" cy="120" r="5" fill="#86efac"/>
    <circle cx="220" cy="120" r="5" fill="#86efac"/>
    <text x="70" y="112" fill="#86efac" fontSize="9">(x₁,0)</text>
    <text x="208" y="112" fill="#86efac" fontSize="9">(x₂,0)</text>
    <circle cx="150" cy="40" r="4" fill="#f472b6"/>
    <text x="158" y="38" fill="#f472b6" fontSize="9">(0,c)</text>
    <line x1="150" y1="10" x2="150" y2="185" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="4,3" strokeOpacity="0.4"/>
    <text x="50" y="18" fill="#fbbf24" fontSize="9">2 titik potong sumbu-x</text>
    <text x="50" y="30" fill="#94a3b8" fontSize="8">D = b²−4ac &gt; 0</text>
  </svg>
);

const OneXIntercept = () => (
  <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
    <line x1="20" y1="120" x2="280" y2="120" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="280,120 274,116 274,124" fill="#94a3b8"/>
    <line x1="150" y1="185" x2="150" y2="10" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="150,10 146,16 154,16" fill="#94a3b8"/>
    <text x="283" y="124" fill="#94a3b8" fontSize="10">x</text>
    <text x="154" y="14" fill="#94a3b8" fontSize="10">y</text>
    <path d="M 85,30 Q 150,120 215,30" stroke="#f97316" fill="none" strokeWidth="2.5"/>
    <circle cx="150" cy="120" r="5" fill="#86efac"/>
    <text x="158" y="118" fill="#86efac" fontSize="9">titik singgung (h,0)</text>
    <text x="50" y="18" fill="#fbbf24" fontSize="9">1 titik potong sumbu-x</text>
    <text x="50" y="30" fill="#94a3b8" fontSize="8">D = b²−4ac = 0</text>
  </svg>
);

const NoXIntercept = () => (
  <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
    <line x1="20" y1="150" x2="280" y2="150" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="280,150 274,146 274,154" fill="#94a3b8"/>
    <line x1="150" y1="185" x2="150" y2="10" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="150,10 146,16 154,16" fill="#94a3b8"/>
    <text x="283" y="154" fill="#94a3b8" fontSize="10">x</text>
    <text x="154" y="14" fill="#94a3b8" fontSize="10">y</text>
    <path d="M 90,70 Q 150,30 210,70" stroke="#a78bfa" fill="none" strokeWidth="2.5"/>
    <circle cx="150" cy="30" r="4" fill="#a78bfa"/>
    <text x="158" y="28" fill="#c4b5fd" fontSize="9">Puncak di atas sumbu-x</text>
    <text x="50" y="18" fill="#fbbf24" fontSize="9">Tidak memotong sumbu-x</text>
    <text x="50" y="30" fill="#94a3b8" fontSize="8">D = b²−4ac &lt; 0</text>
  </svg>
);

const DiscriminantTable = () => (
  <svg width="300" height="150" viewBox="0 0 300 150" className="mx-auto">
    <rect x="5" y="5" width="290" height="140" rx="8" fill="var(--card)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5"/>
    <text x="150" y="25" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">Diskriminan dan Titik Potong Sumbu-x</text>
    {['Kondisi D','D &gt; 0','D = 0','D &lt; 0'].map((v,i)=>(
      <text key={i} x={25+i*90} y={45} fill={i===0?"#fbbf24":i===1?"#86efac":i===2?"#f59e0b":"#f472b6"} fontSize="9" textAnchor="middle" fontWeight={i===0?"bold":"normal"}>{v}</text>
    ))}
    <line x1="7" y1="50" x2="293" y2="50" stroke="var(--border)" strokeWidth="1"/>
    {['Jenis Akar','2 akar real berbeda','1 akar real kembar','Tidak ada akar real'].map((v,i)=>(
      <text key={i} x={25+i*90} y={72} fill={i===0?"#fbbf24":i===1?"#86efac":i===2?"#f59e0b":"#f472b6"} fontSize="8" textAnchor="middle">{v}</text>
    ))}
    <line x1="7" y1="78" x2="293" y2="78" stroke="var(--border)" strokeWidth="1"/>
    {['Potong sb-x','2 titik','1 titik (singgung)','Tidak ada'].map((v,i)=>(
      <text key={i} x={25+i*90} y={100} fill={i===0?"#fbbf24":i===1?"#86efac":i===2?"#f59e0b":"#f472b6"} fontSize="8" textAnchor="middle">{v}</text>
    ))}
    <text x="150" y="130" fill="#64748b" fontSize="8" textAnchor="middle">D = b² − 4ac</text>
  </svg>
);

const YInterceptSVG = () => (
  <svg width="300" height="180" viewBox="0 0 300 180" className="mx-auto">
    <line x1="20" y1="110" x2="280" y2="110" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="280,110 274,106 274,114" fill="#94a3b8"/>
    <line x1="150" y1="170" x2="150" y2="10" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="150,10 146,16 154,16" fill="#94a3b8"/>
    <text x="283" y="114" fill="#94a3b8" fontSize="10">x</text>
    <text x="154" y="14" fill="#94a3b8" fontSize="10">y</text>
    <path d="M 80,30 Q 150,170 220,30" stroke="#f59e0b" fill="none" strokeWidth="2.5"/>
    <circle cx="150" cy="60" r="5" fill="#f472b6"/>
    <line x1="150" y1="60" x2="150" y2="110" stroke="#f472b6" strokeWidth="1" strokeDasharray="4,3"/>
    <text x="158" y="58" fill="#f472b6" fontSize="9">(0, c)</text>
    <text x="158" y="70" fill="#f472b6" fontSize="8">= titik potong sb-y</text>
    <text x="55" y="18" fill="#fbbf24" fontSize="9">Titik potong sumbu-y selalu di (0,c)</text>
    <text x="55" y="30" fill="#94a3b8" fontSize="8">Substitusi x = 0 → f(0) = c</text>
  </svg>
);

const ThreeParabolas = () => (
  <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
    <line x1="20" y1="130" x2="280" y2="130" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="280,130 274,126 274,134" fill="#94a3b8"/>
    <line x1="150" y1="190" x2="150" y2="10" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="150,10 146,16 154,16" fill="#94a3b8"/>
    <text x="283" y="134" fill="#94a3b8" fontSize="10">x</text>
    <text x="154" y="14" fill="#94a3b8" fontSize="10">y</text>
    <path d="M 75,40 Q 130,170 185,40" stroke="#86efac" fill="none" strokeWidth="2"/>
    <circle cx="75" cy="130" r="4" fill="#86efac"/>
    <circle cx="185" cy="130" r="4" fill="#86efac"/>
    <text x="45" y="128" fill="#86efac" fontSize="7">2 titik</text>
    <path d="M 110,40 Q 150,130 190,40" stroke="#f59e0b" fill="none" strokeWidth="2"/>
    <circle cx="150" cy="130" r="4" fill="#f59e0b"/>
    <text x="155" y="145" fill="#f59e0b" fontSize="7">1 titik</text>
    <path d="M 105,80 Q 150,50 195,80" stroke="#f472b6" fill="none" strokeWidth="2"/>
    <text x="80" y="88" fill="#f472b6" fontSize="7">0 titik (D&lt;0)</text>
    <text x="5" y="16" fill="#fbbf24" fontSize="9">3 kemungkinan titik potong sumbu-x</text>
  </svg>
);

const questions: Q[] = [
  Qn(1,"Titik Potong Sumbu-y – UN",{type:"mixed",diagram:<YInterceptSVG/>,parts:[
    {label:"a.",math:"\\text{Tentukan titik potong sumbu-y dari } f(x)=3x^2-5x+7"},
    {label:"b.",math:"\\text{Titik potong sumbu-y dari } g(x)=-x^2+4x-3 \\text{ adalah } (0,\\ldots)"},
    {label:"c.",text:"Mengapa untuk mencari titik potong sumbu-y kita substitusi x = 0?"},
  ]}),
  Qn(2,"Diskriminan dan Jenis Akar – ANBK",{type:"mixed",diagram:<DiscriminantTable/>,parts:[
    {label:"a.",math:"D = b^2 - 4ac. \\text{ Hitung D dari } f(x)=x^2-5x+6"},
    {label:"b.",math:"\\text{Berdasarkan D, berapa titik potong sumbu-x yang dimiliki } f(x)?"},
    {label:"c.",math:"\\text{Hitung D dari } g(x) = x^2 - 2x + 5 \\text{ dan klasifikasikan}"},
  ]}),
  Qn(3,"2 Titik Potong Sumbu-x – UN",{type:"mixed",diagram:<TwoXIntercepts/>,parts:[
    {label:"a.",math:"\\text{Tentukan titik potong sumbu-x dari } f(x)=x^2-5x+6"},
    {label:"b.",math:"\\text{Verifikasi: apakah D} > 0 \\text{ untuk soal (a)?}"},
    {label:"c.",math:"\\text{Titik potong sumbu-x } g(x) = x^2+x-12 \\text{ adalah}?"},
  ]}),
  Qn(4,"1 Titik Potong (Singgung) – TKA",{type:"mixed",diagram:<OneXIntercept/>,parts:[
    {label:"a.",math:"\\text{Tunjukkan bahwa } f(x)=x^2-4x+4 \\text{ hanya menyentuh sumbu-x di 1 titik}"},
    {label:"b.",math:"\\text{Hitung } D \\text{ dari } f(x)=x^2-4x+4"},
    {label:"c.",math:"\\text{Titik singgung tersebut adalah } (\\ldots, \\ldots)"},
  ]}),
  Qn(5,"Tidak Memotong Sumbu-x – ANBK",{type:"mixed",diagram:<NoXIntercept/>,parts:[
    {label:"a.",math:"\\text{Buktikan bahwa } f(x)=x^2+2x+5 \\text{ tidak memotong sumbu-x}"},
    {label:"b.",math:"D = \\ldots < 0 \\text{, maka grafik}\\ldots"},
    {label:"c.",text:"Jika D < 0 dan a > 0, di mana posisi parabola terhadap sumbu-x?"},
  ]}),
  Qn(6,"Menghitung Titik Potong Sumbu-x – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x)=2x^2-x-3=0 \\Rightarrow x=\\ldots"},
    {label:"b.",math:"g(x)=x^2-7x+12=0 \\Rightarrow x=\\ldots"},
    {label:"c.",math:"h(x)=3x^2-12x=0 \\Rightarrow x=\\ldots"},
  ]}),
  Qn(7,"Titik Potong Keduanya – TKA",{type:"mixed",diagram:<ThreeParabolas/>,parts:[
    {label:"a.",math:"f(x)=x^2-3x-10 \\Rightarrow \\text{titik potong sumbu-x dan sumbu-y}"},
    {label:"b.",math:"g(x)=-x^2+x+6 \\Rightarrow \\text{titik potong sumbu-x dan sumbu-y}"},
    {label:"c.",math:"h(x)=x^2+4x \\Rightarrow \\text{titik potong sumbu-x dan sumbu-y}"},
  ]}),
  Qn(8,"Nilai c dari Titik Potong – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Grafik memotong sumbu-y di } (0,8). \\text{ Jika } a=1, b=-5, \\text{ tentukan } c"},
    {label:"b.",math:"\\text{Grafik } f(x)=2x^2+bx+c \\text{ melalui } (0,-3). \\text{ Nilai } c=\\ldots"},
    {label:"c.",math:"\\text{Jika } f(0)=0, \\text{ apa yang bisa disimpulkan tentang nilai } c?"},
  ]}),
  Qn(9,"Diskriminan untuk Menentukan Sifat – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"D = (-6)^2 - 4(1)(9) = \\ldots \\Rightarrow \\text{jenis akar?}"},
    {label:"b.",math:"D = 3^2 - 4(1)(4) = \\ldots \\Rightarrow \\text{jenis akar?}"},
    {label:"c.",math:"D = (-4)^2 - 4(2)(2) = \\ldots \\Rightarrow \\text{jenis akar?}"},
  ]}),
  Qn(10,"Titik Potong Sumbu-x dengan Rumus Kuadrat – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x)=x^2-2x-8 \\Rightarrow x = \\frac{2 \\pm \\sqrt{4+32}}{2} = \\ldots"},
    {label:"b.",math:"g(x)=2x^2-5x+2 \\Rightarrow x = \\frac{5 \\pm \\sqrt{25-16}}{4} = \\ldots"},
    {label:"c.",math:"h(x)=x^2+6x+9 \\Rightarrow x = \\frac{-6 \\pm \\sqrt{36-36}}{2} = \\ldots"},
  ]}),
  Qn(11,"Soal UN – Menentukan D",{type:"mixed",content:"Tentukan nilai diskriminan dari fungsi-fungsi berikut dan klasifikasikan:",parts:[
    {label:"a.",math:"f(x) = x^2 - 10x + 25"},
    {label:"b.",math:"g(x) = 2x^2 - 3x + 4"},
    {label:"c.",math:"h(x) = -x^2 + 6x - 8"},
  ]}),
  Qn(12,"Grafik Melalui Titik Tertentu – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Fungsi } f(x)=x^2+bx-6 \\text{ melalui } (3,0). \\text{ Tentukan } b!"},
    {label:"b.",math:"\\text{Fungsi } g(x)=ax^2-3x+2 \\text{ melalui } (-1,0). \\text{ Tentukan } a!"},
    {label:"c.",math:"\\text{Fungsi } h(x)=2x^2-x+c \\text{ melalui } (0,5). \\text{ Tentukan } c!"},
  ]}),
  Qn(13,"Hubungan Akar dan Koefisien – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Akar-akar } f(x)=x^2-5x+6=0 \\text{ adalah } x_1 \\text{ dan } x_2. \\text{ Hitung } x_1+x_2"},
    {label:"b.",math:"x_1 \\cdot x_2 = \\frac{c}{a} = \\ldots"},
    {label:"c.",math:"\\text{Verifikasi: } (x-x_1)(x-x_2) = x^2-(x_1+x_2)x+x_1x_2"},
  ]}),
  Qn(14,"Titik Potong Dua Parabola – TKA",{type:"mixed",content:"Tentukan titik potong antara kedua parabola berikut:",parts:[
    {label:"a.",math:"y = x^2 \\text{ dan } y = 2x + 3"},
    {label:"b.",math:"y = x^2 - 1 \\text{ dan } y = -x^2 + 3"},
    {label:"c.",math:"y = x^2 - 4 \\text{ dan } y = x + 2"},
  ]}),
  Qn(15,"Fungsi Tanpa Titik Potong Sumbu-x – UN",{type:"mixed",content:"Buktikan bahwa grafik berikut tidak memotong sumbu-x:",parts:[
    {label:"a.",math:"f(x) = x^2 + x + 1"},
    {label:"b.",math:"g(x) = -x^2 - 3x - 5"},
    {label:"c.",math:"h(x) = 2x^2 - 2x + 3"},
  ]}),
  Qn(16,"Menentukan k agar D = 0 – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - kx + 9 = 0. \\text{ Nilai } k \\text{ agar } D = 0?"},
    {label:"b.",math:"g(x) = kx^2 - 4x + 1 = 0. \\text{ Nilai } k \\text{ agar } D = 0?"},
    {label:"c.",math:"h(x) = x^2 - 6x + k = 0. \\text{ Nilai } k \\text{ agar } D = 0?"},
  ]}),
  Qn(17,"Titik Potong Sumbu dengan Faktorisasi – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 9 = (x-3)(x+3) = 0 \\Rightarrow x = \\ldots"},
    {label:"b.",math:"g(x) = x^2 - x - 12 = (x-4)(x+3) = 0 \\Rightarrow x = \\ldots"},
    {label:"c.",math:"h(x) = 2x^2 + 5x - 3 = (2x-1)(x+3) = 0 \\Rightarrow x = \\ldots"},
  ]}),
  Qn(18,"Koordinat Titik Potong – UN",{type:"mixed",content:"Tentukan semua titik potong dengan sumbu-x dan sumbu-y:",parts:[
    {label:"a.",math:"f(x) = x^2 - 4x - 12"},
    {label:"b.",math:"g(x) = -x^2 + 2x + 8"},
    {label:"c.",math:"h(x) = 3x^2 - 3"},
  ]}),
  Qn(19,"Grafik di Atas / Bawah Sumbu-x – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 4. \\text{ Untuk } x \\in (-2,2), \\text{ apakah } f(x) > 0 \\text{ atau } < 0?"},
    {label:"b.",math:"g(x) = -(x-1)(x-5). \\text{ Untuk } x \\in (1,5), \\text{ apakah } g(x) > 0 \\text{ atau } < 0?"},
    {label:"c.",text:"Bagaimana menentukan kapan f(x) > 0 atau f(x) < 0 dari grafik?"},
  ]}),
  Qn(20,"Soal Pilihan: Nilai k agar D > 0 – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 + 4x + k. \\text{ Nilai } k \\text{ agar D} > 0?"},
    {label:"b.",math:"g(x) = x^2 - 2x + k. \\text{ Nilai } k \\text{ agar D} \\geq 0?"},
    {label:"c.",math:"h(x) = kx^2 - 4x + 1. \\text{ Nilai } k \\text{ agar tidak ada titik potong sb-x?}"},
  ]}),
  Qn(21,"Titik Potong Negatif / Positif – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 3x - 4. \\text{ Titik potong sb-x di sebelah mana dari O?}"},
    {label:"b.",math:"g(x) = x^2 + x - 6. \\text{ Satu titik potong sb-x positif dan satu negatif?}"},
    {label:"c.",math:"h(x) = x^2 + 5x + 6. \\text{ Kedua titik potong sb-x positif atau negatif?}"},
  ]}),
  Qn(22,"Titik Potong dari Tabel Nilai – ANBK",{type:"mixed",diagram:(
    <svg width="300" height="110" viewBox="0 0 300 110" className="mx-auto">
      <rect x="5" y="5" width="290" height="100" rx="8" fill="var(--card)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4"/>
      {['x','−3','−2','−1','0','1','2','3'].map((v,i)=>(
        <text key={i} x={22+i*38} y={28} fill={i===0?"#fbbf24":"#94a3b8"} fontSize="9" textAnchor="middle">{v}</text>
      ))}
      <line x1="7" y1="33" x2="293" y2="33" stroke="var(--border)" strokeWidth="1"/>
      {['f(x)','−4','0','2','2','0','−4','−10'].map((v,i)=>(
        <text key={i} x={22+i*38} y={55} fill={i===0?"#fbbf24":v==='0'?"#86efac":v.includes('−')?"#f472b6":"#e2e8f0"} fontSize="9" textAnchor="middle">{v}</text>
      ))}
      <line x1="7" y1="60" x2="293" y2="60" stroke="var(--border)" strokeWidth="1"/>
      <text x="150" y="80" fill="#94a3b8" fontSize="8" textAnchor="middle">Nilai f(x)=0 menunjukkan titik potong sumbu-x</text>
      <text x="150" y="95" fill="#64748b" fontSize="8" textAnchor="middle">Titik hijau = akar / titik potong sumbu-x</text>
    </svg>
  ),parts:[
    {label:"a.",text:"Dari tabel, tentukan koordinat titik potong sumbu-x!"},
    {label:"b.",text:"Tentukan titik potong sumbu-y!"},
    {label:"c.",text:"Apakah D > 0 berdasarkan tabel? Jelaskan!"},
  ]}),
  Qn(23,"Titik Potong dan Jarak – TKA",{type:"mixed",content:"Grafik f(x) = x² − 5x + 6 memotong sumbu-x di titik A dan B.",parts:[
    {label:"a.",text:"Tentukan koordinat titik A dan B."},
    {label:"b.",math:"\\text{Hitung jarak } |AB|"},
    {label:"c.",math:"\\text{Titik tengah } AB = (\\ldots, \\ldots)"},
  ]}),
  Qn(24,"Perubahan c Menggeser Grafik – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 4x + 3 \\Rightarrow \\text{titik potong sb-y} = (0,\\ldots)"},
    {label:"b.",math:"g(x) = x^2 - 4x + 0 \\Rightarrow \\text{titik potong sb-y} = (0,\\ldots)"},
    {label:"c.",text:"Bagaimana menggeser c agar grafik tepat menyentuh sumbu-x?"},
  ]}),
  Qn(25,"Fungsi dengan 3 Titik Diketahui – ANBK",{type:"mixed",content:"Grafik f(x) = ax² + bx + c melalui titik (0,1), (1,0), dan (−1,4).",parts:[
    {label:"a.",text:"Substitusi (0,1): tentukan c."},
    {label:"b.",text:"Substitusi (1,0) dan (−1,4): buat sistem persamaan dalam a dan b."},
    {label:"c.",text:"Selesaikan untuk mendapatkan a dan b, lalu tuliskan f(x)."},
  ]}),
  Qn(26,"Soal UN – Titik Potong Sumbu",{type:"mixed",content:"Lengkapi titik potong fungsi-fungsi berikut:",parts:[
    {label:"a.",math:"f(x) = x^2 - 16 \\Rightarrow \\text{sb-x: } (\\ldots,0),(\\ldots,0), \\text{ sb-y: }(0,\\ldots)"},
    {label:"b.",math:"g(x) = x^2 - 2x \\Rightarrow \\text{sb-x: } (\\ldots,0),(\\ldots,0), \\text{ sb-y: }(0,\\ldots)"},
    {label:"c.",math:"h(x) = -x^2 + 9 \\Rightarrow \\text{sb-x: } (\\ldots,0),(\\ldots,0), \\text{ sb-y: }(0,\\ldots)"},
  ]}),
  Qn(27,"HOTS – Nilai m agar Grafik Menyentuh Sumbu-x – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - mx + m \\text{. Nilai } m \\text{ agar grafik menyentuh sb-x (D=0)?}"},
    {label:"b.",math:"g(x) = x^2 + 2mx + m^2 - 1 \\text{. Nilai } m \\text{ agar D=0?}"},
    {label:"c.",math:"h(x) = mx^2 - 4x + 1 \\text{. Nilai } m \\text{ agar D > 0?}"},
  ]}),
  Qn(28,"Titik Potong dengan Sumbu-x Keduanya Positif – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Jika } x_1 + x_2 = \\frac{-b}{a} > 0 \\text{ dan } x_1 \\cdot x_2 = \\frac{c}{a} > 0, \\text{ apa artinya?}"},
    {label:"b.",math:"f(x) = x^2 - 5x + 6 \\Rightarrow x_1+x_2=\\ldots, x_1 x_2=\\ldots \\text{ (keduanya positif?)}"},
    {label:"c.",math:"g(x) = x^2 + 3x + 2 \\Rightarrow \\text{keduanya negatif?}"},
  ]}),
  Qn(29,"Hubungan Titik Potong dengan Diskriminan – ANBK",{type:"mixed",diagram:(
    <svg width="300" height="190" viewBox="0 0 300 190" className="mx-auto">
      <rect x="5" y="5" width="290" height="180" rx="8" fill="var(--card)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.3"/>
      <text x="150" y="22" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">D &gt; 0 : 2 potong sumbu-x</text>
      <path d="M 50,55 Q 100,95 150,55" stroke="#86efac" fill="none" strokeWidth="2"/>
      <circle cx="50" cy="75" r="3" fill="#86efac"/>
      <circle cx="150" cy="75" r="3" fill="#86efac"/>
      <line x1="30" y1="75" x2="170" y2="75" stroke="#475569" strokeWidth="1"/>
      <text x="150" y="82" fill="#86efac" fontSize="8" textAnchor="middle">↑ 2 titik hijau</text>
      <text x="150" y="98" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">D = 0 : 1 titik singgung</text>
      <path d="M 70,135 Q 130,105 190,135" stroke="#f59e0b" fill="none" strokeWidth="2"/>
      <circle cx="130" cy="115" r="3" fill="#f59e0b"/>
      <line x1="50" y1="115" x2="210" y2="115" stroke="#475569" strokeWidth="1"/>
      <text x="150" y="152" fill="#f472b6" fontSize="10" fontWeight="bold" textAnchor="middle">D &lt; 0 : tidak memotong</text>
      <path d="M 80,175 Q 150,155 220,175" stroke="#f472b6" fill="none" strokeWidth="2"/>
      <line x1="60" y1="185" x2="240" y2="185" stroke="#475569" strokeWidth="1"/>
    </svg>
  ),parts:[
    {label:"a.",math:"f(x) = x^2 - 4 \\Rightarrow D = \\ldots \\text{ (berapa titik potong sb-x?)}"},
    {label:"b.",math:"g(x) = x^2 - 2x + 1 \\Rightarrow D = \\ldots \\text{ (berapa titik potong sb-x?)}"},
    {label:"c.",math:"h(x) = x^2 + x + 1 \\Rightarrow D = \\ldots \\text{ (berapa titik potong sb-x?)}"},
  ]}),
  Qn(30,"Soal UN – Menentukan Grafik dari Ciri-ciri",{type:"mixed",content:"Tentukan persamaan fungsi kuadrat yang memenuhi syarat berikut:",parts:[
    {label:"a.",text:"Memotong sumbu-x di (2,0) dan (−3,0), dan memotong sumbu-y di (0,−6)."},
    {label:"b.",text:"Hanya menyentuh sumbu-x di (1,0) dan memotong sumbu-y di (0,4)."},
    {label:"c.",text:"Tidak memotong sumbu-x, vertex di (0,3), dan a = 1."},
  ]}),
  Qn(31,"Titik Potong dan Jarak ke Titik Puncak – TKA",{type:"mixed",content:"Grafik f(x) = x² − 6x + 5 memotong sumbu-x di A(1,0) dan B(5,0).",parts:[
    {label:"a.",text:"Tentukan koordinat titik tengah AB."},
    {label:"b.",text:"Apakah titik tengah AB sama dengan sumbu simetri? Jelaskan!"},
    {label:"c.",math:"\\text{Berapa jarak dari sumbu simetri ke setiap titik potong sumbu-x?}"},
  ]}),
  Qn(32,"Nilai Ekstrem Fungsi dan Titik Potong – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 4x + 3. \\text{ Titik potong sb-x dan nilai minimum?}"},
    {label:"b.",math:"\\text{Apakah titik minimum sama dengan titik potong sb-x? Kapan itu terjadi?}"},
    {label:"c.",math:"g(x) = -(x-2)^2 + 0. \\text{ Apa ini artinya?}"},
  ]}),
  Qn(33,"Nilai c Negatif dan Titik Potong – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 3x - 10. \\text{ Titik potong sb-y di } (0, \\ldots)"},
    {label:"b.",math:"\\text{Titik potong sb-x dari } f(x) = x^2-3x-10?"},
    {label:"c.",text:"Apakah tanda c menentukan posisi titik potong sumbu-y di atas atau bawah sumbu-x?"},
  ]}),
  Qn(34,"Soal Kontekstual – Melambung dan Mendarat – TKA",{type:"mixed",content:"Sebuah bola dilempar dan ketinggiannya h(t) = −5t² + 20t meter.",parts:[
    {label:"a.",math:"\\text{Saat } h(t) = 0, \\text{ kapan bola di tanah? } t = \\ldots"},
    {label:"b.",text:"Titik-titik itu mewakili apa dalam konteks masalah?"},
    {label:"c.",math:"\\text{Kapan bola mulai dilempar (t=0) dan berapa ketinggiannya?}"},
  ]}),
  Qn(35,"Menentukan a dari Dua Titik Potong Sb-x – ANBK",{type:"mixed",content:"Grafik f(x) = a(x − 2)(x + 4) melalui titik (0, −12).",parts:[
    {label:"a.",text:"Tentukan titik potong sumbu-x dari bentuk f(x) = a(x−2)(x+4)."},
    {label:"b.",math:"\\text{Substitusi } (0,-12): a(0-2)(0+4) = -12 \\Rightarrow a = \\ldots"},
    {label:"c.",math:"\\text{Tuliskan } f(x) \\text{ dalam bentuk umum}"},
  ]}),
  Qn(36,"Soal HOTS – Analisis Simetri Titik Potong – TKA",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Jika titik potong sb-x adalah } x_1=1 \\text{ dan } x_2=7, \\text{ sumbu simetrinya } x=\\ldots"},
    {label:"b.",math:"\\text{Jika sumbu simetri } x=3 \\text{ dan satu titik potong } x_1=-1, \\text{ titik lainnya } x_2=\\ldots"},
    {label:"c.",math:"f(x) = a(x-x_1)(x-x_2). \\text{ Jika } x_1=2, x_2=6, f(4)=-4 \\Rightarrow a=\\ldots"},
  ]}),
  Qn(37,"Grafik Parabola Terpotong Garis – UN",{type:"mixed",content:"Tentukan titik potong parabola dengan garis:",parts:[
    {label:"a.",math:"y = x^2 - 3x \\text{ dan } y = 4"},
    {label:"b.",math:"y = x^2 - 4 \\text{ dan } y = -3"},
    {label:"c.",math:"y = x^2 + 2x \\text{ dan } y = x + 6"},
  ]}),
  Qn(38,"Nilai Fungsi di Titik Tertentu – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x)=x^2-5x+4. \\text{ Titik potong sb-x lalu hitung } f(3)"},
    {label:"b.",math:"g(x)=-x^2+4x. \\text{ Titik potong sb-x lalu hitung } g(2)"},
    {label:"c.",math:"\\text{Hubungan antara } f(x_1), f(x_2) \\text{ dengan sb-x adalah } f(x_1)=f(x_2)=\\ldots"},
  ]}),
  Qn(39,"Syarat Grafik Selalu di Atas Sumbu-x – TKA",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Agar } f(x)=x^2+bx+9 > 0 \\text{ untuk semua } x, \\text{ nilai } b \\text{ yang memenuhi?}"},
    {label:"b.",math:"\\text{Agar } g(x)=x^2-kx+k+3 \\geq 0 \\text{ untuk semua } x, \\text{ nilai } k?"},
    {label:"c.",text:"Mengapa syaratnya adalah D ≤ 0 dan a > 0?"},
  ]}),
  Qn(40,"HOTS – Grafik Memotong Sumbu dan Area – UN/TKA",{type:"mixed",content:"Grafik f(x) = x² − 4x − 12 memotong sumbu-x di A dan B, dan memotong sumbu-y di C.",parts:[
    {label:"a.",math:"\\text{Tentukan koordinat A, B, dan C}"},
    {label:"b.",math:"\\text{Hitung luas segitiga } \\triangle OAC \\text{ (O adalah titik pusat)}"},
    {label:"c.",math:"\\text{Hitung jarak dari C ke garis } AB"},
  ]}),
];

const TitikPotongPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">✂️</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1" style={{textShadow:'0 0 20px rgba(52,211,153,0.7)'}}>
            TITIK POTONG TERHADAP SUMBU-SUMBU
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Fungsi Kuadrat · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 40 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-3">📐 Konsep Penting</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              {name:"Titik potong sb-y", math:"x=0 \\Rightarrow (0,c)"},
              {name:"Titik potong sb-x", math:"f(x)=0 \\Rightarrow ax^2+bx+c=0"},
              {name:"Diskriminan", math:"D = b^2-4ac"},
              {name:"D > 0", math:"\\text{2 titik potong sb-x}"},
            ].map(r=>(
              <div key={r.name} className={isDark ? "bg-white/5 rounded-lg px-3 py-2" : "bg-gray-50 rounded-lg px-3 py-2"}>
                <div className={isDark ? "text-white/40 text-[9px] uppercase mb-1" : "text-gray-500 text-[9px] uppercase mb-1"}>{r.name}</div>
                <div className="text-emerald-300 text-xs overflow-x-auto"><InlineMath math={r.math}/></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q,i)=>(
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{animationDelay:`${i*0.02}s`}}>
              <div className={isDark ? "absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" : "absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-white/80 to-teal-50/40 backdrop-blur"}/>
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl"/>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl"/>
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className={isDark ? "font-body text-sm text-white/90 leading-relaxed mb-3" : "font-body text-sm text-gray-800 leading-relaxed mb-3"}>{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent}/></div>}
                    {q.diagram && <div className={isDark ? "mb-3 flex justify-center bg-white/5 rounded-xl p-3" : "mb-3 flex justify-center bg-gray-50 rounded-xl p-3"}>{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p,pi)=>(
                          <div key={pi} className={isDark ? "flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5" : "flex items-start gap-2 rounded-lg px-3 py-2 bg-gray-50"}>
                            <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math}/></div>
                              : <p className={isDark ? "font-body text-sm text-white/80" : "font-body text-sm text-gray-700"}>{p.text}</p>}
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
          <button onClick={()=>{playPopSound();navigate("/latihan-mandiri/kelas-9/fungsi-kuadrat");}}
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Fungsi Kuadrat
          </button>
        </div>
      </div>
    </div>
  );
};
export default TitikPotongPage;
