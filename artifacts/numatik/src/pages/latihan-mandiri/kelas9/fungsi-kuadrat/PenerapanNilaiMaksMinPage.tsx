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

const MaxMinSVG = () => (
  <svg width="300" height="210" viewBox="0 0 300 210" className="mx-auto">
    <text x="150" y="16" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">Nilai Maksimum dan Minimum</text>
    <g>
      <rect x="10" y="22" width="130" height="90" rx="8" fill="var(--card)" stroke="#86efac" strokeWidth="1" strokeOpacity="0.5"/>
      <text x="75" y="38" fill="#86efac" fontSize="9" textAnchor="middle" fontWeight="bold">a &gt; 0 → MINIMUM</text>
      <path d="M 25,80 Q 75,105 125,80" stroke="#86efac" fill="none" strokeWidth="2"/>
      <circle cx="75" cy="103" r="4" fill="#86efac"/>
      <line x1="25" y1="85" x2="125" y2="85" stroke="var(--border)" strokeWidth="1"/>
      <text x="75" y="115" fill="#86efac" fontSize="8" textAnchor="middle">Nilai Min = k</text>
    </g>
    <g>
      <rect x="160" y="22" width="130" height="90" rx="8" fill="var(--card)" stroke="#f472b6" strokeWidth="1" strokeOpacity="0.5"/>
      <text x="225" y="38" fill="#f472b6" fontSize="9" textAnchor="middle" fontWeight="bold">a &lt; 0 → MAKSIMUM</text>
      <path d="M 175,90 Q 225,55 275,90" stroke="#f472b6" fill="none" strokeWidth="2"/>
      <circle cx="225" cy="57" r="4" fill="#f472b6"/>
      <line x1="175" y1="85" x2="275" y2="85" stroke="var(--border)" strokeWidth="1"/>
      <text x="225" y="115" fill="#f472b6" fontSize="8" textAnchor="middle">Nilai Maks = k</text>
    </g>
    <rect x="5" y="125" width="290" height="80" rx="8" fill="var(--card)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.3"/>
    <text x="150" y="143" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">Rumus Nilai Ekstrem</text>
    <text x="90" y="162" fill="#94a3b8" fontSize="8" textAnchor="middle">Sumbu simetri:</text>
    <text x="210" y="162" fill="#f59e0b" fontSize="8" textAnchor="middle">x = −b/(2a)</text>
    <text x="90" y="178" fill="#94a3b8" fontSize="8" textAnchor="middle">Nilai ekstrem:</text>
    <text x="210" y="178" fill="#f59e0b" fontSize="8" textAnchor="middle">k = f(−b/2a)</text>
    <text x="90" y="194" fill="#94a3b8" fontSize="8" textAnchor="middle">Alternatif:</text>
    <text x="210" y="194" fill="#f59e0b" fontSize="8" textAnchor="middle">k = c − b²/(4a)</text>
  </svg>
);

const RectOptimSVG = () => (
  <svg width="300" height="180" viewBox="0 0 300 180" className="mx-auto">
    <rect x="40" y="30" width="180" height="120" rx="4" fill="none" stroke="#f59e0b" strokeWidth="2.5"/>
    <text x="130" y="22" fill="#fcd34d" fontSize="9" textAnchor="middle" fontWeight="bold">Panjang = (k − x)</text>
    <text x="40" y="95" fill="#fcd34d" fontSize="9" textAnchor="middle" style={{writingMode:"vertical-lr"}} transform="rotate(0)">Lebar</text>
    <text x="18" y="95" fill="#86efac" fontSize="9" textAnchor="middle">x</text>
    <line x1="35" y1="30" x2="35" y2="150" stroke="#86efac" strokeWidth="2" markerEnd="url(#arrow)"/>
    <text x="130" y="100" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">Luas = x(k−x)</text>
    <text x="130" y="120" fill="#94a3b8" fontSize="9" textAnchor="middle">= kx − x²</text>
    <text x="130" y="140" fill="#86efac" fontSize="9" textAnchor="middle">Maks saat x = k/2</text>
    <text x="5" y="16" fill="#fbbf24" fontSize="9">Optimasi Persegi Panjang</text>
    <text x="5" y="170" fill="#94a3b8" fontSize="8">Keliling = 2(x + panjang) = konstanta</text>
  </svg>
);

const TrajectoryArc = () => (
  <svg width="300" height="180" viewBox="0 0 300 180" className="mx-auto">
    <line x1="20" y1="150" x2="280" y2="150" stroke="#94a3b8" strokeWidth="1.5"/>
    <polygon points="280,150 274,146 274,154" fill="#94a3b8"/>
    <line x1="30" y1="165" x2="30" y2="15" stroke="#94a3b8" strokeWidth="1.5"/>
    <polygon points="30,15 26,21 34,21" fill="#94a3b8"/>
    <text x="283" y="154" fill="#94a3b8" fontSize="9">t</text>
    <text x="34" y="18" fill="#94a3b8" fontSize="9">h</text>
    <path d="M 30,145 Q 155,15 280,145" stroke="#f59e0b" fill="none" strokeWidth="2.5"/>
    <circle cx="155" cy="15" r="5" fill="#f59e0b"/>
    <line x1="155" y1="15" x2="155" y2="150" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.6"/>
    <text x="158" y="22" fill="#fcd34d" fontSize="9">h_maks</text>
    <text x="158" y="158" fill="#fcd34d" fontSize="8">t_puncak</text>
    <circle cx="30" cy="145" r="4" fill="#86efac"/>
    <circle cx="280" cy="145" r="4" fill="#86efac"/>
    <text x="12" y="143" fill="#86efac" fontSize="8">0</text>
    <text x="265" y="143" fill="#86efac" fontSize="8">T</text>
    <text x="5" y="16" fill="#fbbf24" fontSize="9">Lintasan Gerak Parabola</text>
    <text x="5" y="28" fill="#94a3b8" fontSize="8">h(t) = −at² + vt + h₀</text>
  </svg>
);

const ProfitTableSVG = () => (
  <svg width="300" height="155" viewBox="0 0 300 155" className="mx-auto">
    <rect x="5" y="5" width="290" height="145" rx="8" fill="var(--card)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4"/>
    <text x="150" y="24" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">Tabel Keuntungan P(x) = −x² + 10x − 16</text>
    {['x (unit)','1','2','3','4','5','6','7'].map((v,i)=>(
      <text key={i} x={22+i*37} y={44} fill={i===0?"#fbbf24":"#94a3b8"} fontSize="8.5" textAnchor="middle">{v}</text>
    ))}
    <line x1="7" y1="49" x2="293" y2="49" stroke="var(--border)" strokeWidth="1"/>
    {['P(x)','−7','0','5','8','9','8','5'].map((v,i)=>(
      <text key={i} x={22+i*37} y={70} fill={i===0?"#fbbf24":v==='0'?"#86efac":v.startsWith('−')?"#f472b6":v==='9'?"#fcd34d":"#e2e8f0"} fontSize="8.5" textAnchor="middle">{v}</text>
    ))}
    <line x1="7" y1="75" x2="293" y2="75" stroke="var(--border)" strokeWidth="1"/>
    <text x="150" y="95" fill="#86efac" fontSize="8" textAnchor="middle">Nilai max P = 9 saat x = 5</text>
    <text x="150" y="112" fill="#94a3b8" fontSize="8" textAnchor="middle">P(x) = −x² + 10x − 16</text>
    <text x="150" y="128" fill="#94a3b8" fontSize="8" textAnchor="middle">a = −1 &lt; 0 → ada nilai maksimum</text>
    <text x="150" y="144" fill="#fbbf24" fontSize="8" textAnchor="middle">x_puncak = −b/(2a) = 10/2 = 5 ✓</text>
  </svg>
);

const questions: Q[] = [
  Qn(1,"Nilai Minimum dari Rumus – UN",{type:"mixed",diagram:<MaxMinSVG/>,parts:[
    {label:"a.",math:"f(x) = x^2 - 6x + 5 \\Rightarrow \\text{nilai minimum} = \\ldots \\text{ saat } x = \\ldots"},
    {label:"b.",math:"g(x) = 2x^2 - 8x + 3 \\Rightarrow \\text{nilai minimum} = \\ldots \\text{ saat } x = \\ldots"},
    {label:"c.",math:"h(x) = 3x^2 - 12x + 7 \\Rightarrow \\text{nilai minimum} = \\ldots \\text{ saat } x = \\ldots"},
  ]}),
  Qn(2,"Nilai Maksimum dari Rumus – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = -x^2 + 6x - 5 \\Rightarrow \\text{nilai maksimum} = \\ldots \\text{ saat } x = \\ldots"},
    {label:"b.",math:"g(x) = -2x^2 + 8x + 1 \\Rightarrow \\text{nilai maksimum} = \\ldots \\text{ saat } x = \\ldots"},
    {label:"c.",math:"h(x) = -(x-3)^2 + 7 \\Rightarrow \\text{nilai maksimum} = \\ldots \\text{ saat } x = \\ldots"},
  ]}),
  Qn(3,"Optimasi Persegi Panjang – UN",{type:"mixed",diagram:<RectOptimSVG/>,content:"Keliling sebuah persegi panjang = 40 cm. Panjang = p, lebar = l, p + l = 20.",parts:[
    {label:"a.",math:"\\text{Luas } L = p \\cdot l = p(20-p). \\text{ Tulis } L \\text{ sebagai fungsi } p!"},
    {label:"b.",math:"\\text{Tentukan nilai } p \\text{ agar luas } L \\text{ maksimum}"},
    {label:"c.",math:"\\text{Hitung luas maksimum } L_{maks} = \\ldots \\text{ cm}^2"},
  ]}),
  Qn(4,"Lintasan Bola – ANBK",{type:"mixed",diagram:<TrajectoryArc/>,content:"Ketinggian bola (meter): h(t) = −5t² + 20t meter, t dalam detik.",parts:[
    {label:"a.",math:"\\text{Ketinggian maksimum saat } t = \\ldots \\text{ detik}"},
    {label:"b.",math:"h_{maks} = h\\left(\\frac{20}{10}\\right) = \\ldots \\text{ meter}"},
    {label:"c.",math:"\\text{Kapan bola kembali ke tanah } (h=0)? \\; t = \\ldots"},
  ]}),
  Qn(5,"Keuntungan Maksimum – TKA",{type:"mixed",diagram:<ProfitTableSVG/>,parts:[
    {label:"a.",text:"Dari tabel, berapa unit yang harus dijual agar keuntungan maksimum?"},
    {label:"b.",math:"P(x) = -x^2 + 10x - 16. \\text{ Verifikasi dengan rumus: } x = -\\frac{10}{2(-1)} = \\ldots"},
    {label:"c.",math:"P_{maks} = P(5) = -(25) + 50 - 16 = \\ldots"},
  ]}),
  Qn(6,"Luas Tanah Optimal – UN",{type:"mixed",content:"Seorang petani memiliki pagar sepanjang 60 m untuk membagi lahan berbentuk persegi panjang menjadi 2 bagian dengan panjang p dan lebar l.",diagram:(
    <svg width="300" height="150" viewBox="0 0 300 150" className="mx-auto">
      <rect x="50" y="30" width="200" height="100" rx="4" fill="none" stroke="#f59e0b" strokeWidth="2"/>
      <line x1="150" y1="30" x2="150" y2="130" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,3"/>
      <text x="150" y="20" fill="#fcd34d" fontSize="9" textAnchor="middle">p meter</text>
      <text x="35" y="85" fill="#86efac" fontSize="9" textAnchor="middle">l</text>
      <text x="265" y="85" fill="#86efac" fontSize="9" textAnchor="middle">l</text>
      <text x="150" y="145" fill="#94a3b8" fontSize="8" textAnchor="middle">3l + 2p = 60 meter (total pagar)</text>
      <text x="150" y="80" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">Luas = p × l</text>
    </svg>
  ),parts:[
    {label:"a.",math:"\\text{Dari } 3l + 2p = 60: p = \\frac{60-3l}{2} = 30 - \\frac{3l}{2}"},
    {label:"b.",math:"L = p \\cdot l = l\\left(30 - \\frac{3l}{2}\\right) = 30l - \\frac{3l^2}{2}. \\text{ Nilai maks?}"},
    {label:"c.",math:"l_{opt} = \\frac{30}{3} = 10 \\text{ m}, p_{opt} = \\ldots, L_{maks} = \\ldots \\text{ m}^2"},
  ]}),
  Qn(7,"Jumlah Dua Bilangan – ANBK",{type:"mixed",content:"Dua bilangan x dan y dengan x + y = 20.",parts:[
    {label:"a.",math:"\\text{Nyatakan } y = 20 - x. \\text{ Tulis } P = xy \\text{ sebagai fungsi } x!"},
    {label:"b.",math:"\\text{Tentukan nilai } x \\text{ agar } P \\text{ maksimum}"},
    {label:"c.",math:"P_{maks} = \\ldots \\text{ (nilai hasil kali maksimum)}"},
  ]}),
  Qn(8,"Jumlah dan Kuadrat – TKA",{type:"mixed",content:"Dua bilangan positif x dan y dengan x + y = 12.",parts:[
    {label:"a.",math:"\\text{Minimalkan } S = x^2 + y^2 \\text{. Tulis } S \\text{ sebagai fungsi } x!"},
    {label:"b.",math:"S(x) = x^2 + (12-x)^2 = 2x^2 - 24x + 144. \\text{ Nilai min } S?"},
    {label:"c.",math:"\\text{Kapan } S \\text{ minimum? } x = y = \\ldots"},
  ]}),
  Qn(9,"Proyektil Vertikal – UN",{type:"mixed",diagram:<TrajectoryArc/>,content:"Benda dilempar ke atas dengan kecepatan awal v₀ = 30 m/s dari ketinggian h₀ = 5 m. h(t) = −5t² + 30t + 5.",parts:[
    {label:"a.",math:"\\text{Ketinggian maksimum saat } t = -\\frac{30}{2(-5)} = \\ldots \\text{ detik}"},
    {label:"b.",math:"h_{maks} = -5(3)^2 + 30(3) + 5 = \\ldots \\text{ meter}"},
    {label:"c.",math:"\\text{Kapan benda menyentuh tanah } (h=0)?"},
  ]}),
  Qn(10,"Harga dan Pendapatan – ANBK",{type:"mixed",content:"Sebuah toko menjual produk. Jika harga = p (ribu), banyak terjual = 100 − 2p. Pendapatan R = p × (100 − 2p).",parts:[
    {label:"a.",math:"R(p) = p(100-2p) = 100p - 2p^2. \\text{ Tulis ini sebagai fungsi kuadrat!}"},
    {label:"b.",math:"\\text{Tentukan harga } p \\text{ agar pendapatan } R \\text{ maksimum}"},
    {label:"c.",math:"R_{maks} = \\ldots \\text{ ribu rupiah}"},
  ]}),
  Qn(11,"Biaya Minimum – TKA",{type:"mixed",content:"Biaya produksi (juta rupiah): C(x) = 2x² − 12x + 20 dengan x = jumlah unit (ratus).",parts:[
    {label:"a.",math:"\\text{Biaya minimum saat } x = -\\frac{-12}{2 \\cdot 2} = \\ldots \\text{ ratus unit}"},
    {label:"b.",math:"C_{min} = C(3) = 2(9) - 12(3) + 20 = \\ldots \\text{ juta rupiah}"},
    {label:"c.",text:"Apa artinya nilai minimum dalam konteks biaya produksi?"},
  ]}),
  Qn(12,"Luas Kolam Optimal – UN",{type:"mixed",diagram:(
    <svg width="300" height="160" viewBox="0 0 300 160" className="mx-auto">
      <rect x="40" y="25" width="220" height="110" rx="4" fill="none" stroke="#38bdf8" strokeWidth="2"/>
      <rect x="60" y="45" width="180" height="70" rx="4" fill="var(--card)" stroke="#38bdf8" strokeWidth="1.5"/>
      <text x="150" y="85" fill="#38bdf8" fontSize="9" textAnchor="middle">Air/Kolam</text>
      <text x="150" y="20" fill="#fcd34d" fontSize="9" textAnchor="middle">Lebar total = x + 2×tepi</text>
      <text x="150" y="150" fill="#94a3b8" fontSize="8" textAnchor="middle">Area total tertentu, maksimalkan kolam</text>
      <text x="8" y="25" fill="#fbbf24" fontSize="9">Optimasi</text>
      <text x="8" y="38" fill="#fbbf24" fontSize="9">Luas Kolam</text>
    </svg>
  ),content:"Sebuah kolam persegi panjang memiliki lebar (6 − 2x) m dan panjang (10 − 2x) m dengan x = lebar tepi jalan.",parts:[
    {label:"a.",math:"\\text{Luas kolam: } L(x) = (6-2x)(10-2x). \\text{ Ekspansikan!}"},
    {label:"b.",math:"L(x) = 4x^2 - 32x + 60. \\text{ Nilai min/maks dan syarat } 0 < x < 3?"},
    {label:"c.",text:"Berapa nilai x agar luas kolam paling kecil? Apakah ini masuk akal?"},
  ]}),
  Qn(13,"Fungsi Upah – ANBK",{type:"mixed",content:"Seorang pekerja menerima upah sebesar U(t) = −t² + 8t + 5 ribu rupiah, dengan t = jam kerja.",parts:[
    {label:"a.",math:"\\text{Upah maksimum saat } t = \\ldots \\text{ jam}"},
    {label:"b.",math:"U_{maks} = \\ldots \\text{ ribu rupiah}"},
    {label:"c.",text:"Apakah masuk akal jika pekerja bekerja lebih dari waktu optimal, upahnya turun?"},
  ]}),
  Qn(14,"Soal UN – Nilai Minimum di Domain Tertentu",{type:"mixed",content:"f(x) = x² − 4x + 7, domain [0, 5].",parts:[
    {label:"a.",math:"\\text{Titik puncak: } (\\ldots, \\ldots). \\text{ Apakah masuk dalam domain?}"},
    {label:"b.",math:"\\text{Nilai min } f \\text{ pada } [0,5] = f(2) = \\ldots"},
    {label:"c.",math:"\\text{Nilai maks } f \\text{ pada } [0,5] = \\max\\{f(0), f(5)\\} = \\ldots"},
  ]}),
  Qn(15,"Nilai Maks pada Domain Tertutup – TKA",{type:"mixed",parts:[
    {label:"a.",math:"g(x) = -x^2 + 4x, \\; x \\in [0, 5]. \\text{ Nilai maks } g = \\ldots \\text{ saat } x = \\ldots"},
    {label:"b.",math:"h(x) = x^2 - 4x, \\; x \\in [1, 3]. \\text{ Nilai min dan maks } h?"},
    {label:"c.",math:"f(x) = x^2 - 6x + 5, \\; x \\in [0, 4]. \\text{ Nilai min dan maks}?"},
  ]}),
  Qn(16,"Perbandingan Dua Cara Optimasi – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2-6x+5. \\text{ Cari maks/min dengan rumus } x=-b/(2a)"},
    {label:"b.",math:"f(x) = x^2-6x+5 = (x-3)^2 - 4. \\text{ Cari maks/min dari bentuk vertex!}"},
    {label:"c.",text:"Metode mana yang lebih cepat? Jelaskan!"},
  ]}),
  Qn(17,"Lintasan Bola Basket – ANBK",{type:"mixed",diagram:(
    <svg width="300" height="160" viewBox="0 0 300 160" className="mx-auto">
      <line x1="20" y1="140" x2="280" y2="140" stroke="#94a3b8" strokeWidth="1.5"/>
      <circle cx="40" cy="140" r="6" fill="#f59e0b"/>
      <path d="M 40,135 Q 160,20 270,100" stroke="#f59e0b" fill="none" strokeWidth="2.5" strokeDasharray="6,3"/>
      <circle cx="160" cy="20" r="5" fill="#f472b6"/>
      <line x1="160" y1="20" x2="160" y2="140" stroke="#f472b6" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.7"/>
      <rect x="255" y="95" width="15" height="50" rx="2" fill="none" stroke="#86efac" strokeWidth="1.5"/>
      <line x1="255" y1="100" x2="270" y2="100" stroke="#86efac" strokeWidth="1.5"/>
      <text x="158" y="14" fill="#f472b6" fontSize="8">h_maks</text>
      <text x="155" y="152" fill="#f472b6" fontSize="7">x_puncak</text>
      <text x="10" y="18" fill="#fbbf24" fontSize="9">Lintasan Bola Basket</text>
    </svg>
  ),content:"Lintasan bola: h(x) = −0.04x² + 1.6x + 2 meter, x = jarak horizontal.",parts:[
    {label:"a.",math:"\\text{Tinggi maks saat } x = -\\frac{1.6}{2(-0.04)} = \\ldots \\text{ meter horizontal}"},
    {label:"b.",math:"h_{maks} = \\ldots \\text{ meter}"},
    {label:"c.",math:"\\text{Tinggi saat } x=0 \\text{ (awal dilempar): } h(0) = \\ldots \\text{ meter}"},
  ]}),
  Qn(18,"Optimasi Perimeter – TKA",{type:"mixed",content:"Persegi panjang dengan luas 36 cm². Minimalkan keliling K.",parts:[
    {label:"a.",math:"\\text{Jika lebar = } x, \\text{ panjang } = 36/x. \\text{ Keliling } K = 2(x + 36/x)"},
    {label:"b.",math:"\\text{Tunjukkan bahwa K minimum ketika } x = \\sqrt{36} = 6 \\text{ cm}"},
    {label:"c.",text:"Bentuk apa yang memberikan keliling minimum untuk luas tertentu?"},
  ]}),
  Qn(19,"Nilai Ekstrem di Kuadrat – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 + (x-10)^2. \\text{ Nilai minimum } f = \\ldots \\text{ saat } x = \\ldots"},
    {label:"b.",math:"g(x) = x^2 + (12-x)^2. \\text{ Nilai minimum } g = \\ldots"},
    {label:"c.",math:"h(x) = (x-1)^2 + (x-5)^2. \\text{ Nilai minimum } h = \\ldots"},
  ]}),
  Qn(20,"Soal Kecepatan dan Waktu – ANBK",{type:"mixed",content:"Posisi benda: s(t) = −3t² + 12t + 5 meter, t dalam detik.",parts:[
    {label:"a.",math:"\\text{Posisi maksimum benda: } t = \\ldots, s_{maks} = \\ldots"},
    {label:"b.",math:"\\text{Kecepatan = turunan: } v = s'(t) = -6t + 12 = 0 \\Rightarrow t = \\ldots"},
    {label:"c.",math:"\\text{Berapa posisi benda saat } t = 0 \\text{ dan } t = 4?"},
  ]}),
  Qn(21,"Soal Suhu Optimal – TKA",{type:"mixed",content:"Banyak bakteri pada suhu T°C: f(T) = −2T² + 20T + 50. T dalam rentang [0, 15]°C.",parts:[
    {label:"a.",math:"\\text{Suhu optimal (banyak bakteri maks): } T = -\\frac{20}{2(-2)} = \\ldots °C"},
    {label:"b.",math:"f(T_{opt}) = \\ldots \\text{ bakteri}"},
    {label:"c.",math:"\\text{Berapa banyak bakteri pada } T=0 \\text{ dan } T=15?"},
  ]}),
  Qn(22,"Nilai Min dari Sum of Squares – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Min } f(x) = (x-3)^2 + (x-7)^2. \\text{ Ekspansi dan cari min!}"},
    {label:"b.",math:"f(x) = 2x^2 - 20x + 58 = 2(x-5)^2 + 8. \\text{ Min} = \\ldots \\text{ saat } x = \\ldots"},
    {label:"c.",math:"\\text{Nilai } x \\text{ yang meminimalkan jarak ke dua titik adalah rata-ratanya!}"},
  ]}),
  Qn(23,"Keuntungan dan Biaya – ANBK",{type:"mixed",diagram:<ProfitTableSVG/>,content:"Keuntungan: P(x) = −2x² + 24x − 40 ribu rupiah, x = jumlah barang.",parts:[
    {label:"a.",math:"\\text{Jumlah barang optimal: } x = -\\frac{24}{2(-2)} = \\ldots \\text{ barang}"},
    {label:"b.",math:"P_{maks} = -2(6)^2 + 24(6) - 40 = \\ldots \\text{ ribu rupiah}"},
    {label:"c.",math:"\\text{Keuntungan = 0 saat x = ? } (P(x)=0)"},
  ]}),
  Qn(24,"Nilai Ekstrem dengan Parameter – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 2kx + 3k. \\text{ Nilai minimum } f \\text{ adalah } 3k - k^2. \\text{ Tunjukkan!}"},
    {label:"b.",math:"\\text{Agar } f_{min} \\geq 0: 3k - k^2 \\geq 0 \\Rightarrow k(3-k) \\geq 0 \\Rightarrow \\ldots \\leq k \\leq \\ldots"},
    {label:"c.",math:"\\text{Nilai minimum dari } f_{min} = 3k - k^2 \\text{ sebagai fungsi } k?"},
  ]}),
  Qn(25,"Soal UN – Meminimalkan Jarak – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Titik pada } y=x^2 \\text{ paling dekat ke } (3,0). \\text{ Jarak kuadrat: } D=(x-3)^2+x^4"},
    {label:"b.",text:"Untuk aproksimasi, cari x yang meminimalkan D² = (x−3)² + x⁴ ≈ (x−3)² untuk x kecil."},
    {label:"c.",math:"\\text{Secara umum, titik } (x, x^2) \\text{ berjarak minimum ke garis } y=0 \\text{ saat } x = 0"},
  ]}),
  Qn(26,"Investasi Optimal – ANBK",{type:"mixed",content:"Return investasi: R(x) = −x² + 14x − 24 juta, x = modal (miliar).",parts:[
    {label:"a.",math:"\\text{Modal optimal: } x = \\ldots"},
    {label:"b.",math:"R_{maks} = \\ldots \\text{ juta}"},
    {label:"c.",math:"\\text{Modal minimum agar tidak rugi } (R\\geq 0): x \\in [\\ldots, \\ldots]"},
  ]}),
  Qn(27,"Analisis Nilai Ekstrem Multi-Fungsi – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = (x-2)^2 + 3. \\text{ Min} = \\ldots; g(x) = -(x-2)^2 + 3. \\text{ Maks} = \\ldots"},
    {label:"b.",math:"\\text{Hitung } f(x) + g(x) \\text{ dan } f(x) - g(x)"},
    {label:"c.",math:"\\text{Kapan } f(x) = g(x)?"},
  ]}),
  Qn(28,"Luas Segitiga Optimal – UN",{type:"mixed",diagram:(
    <svg width="300" height="160" viewBox="0 0 300 160" className="mx-auto">
      <line x1="20" y1="130" x2="280" y2="130" stroke="#94a3b8" strokeWidth="1.2"/>
      <polygon points="280,130 274,126 274,134" fill="#94a3b8"/>
      <line x1="150" y1="145" x2="150" y2="15" stroke="#94a3b8" strokeWidth="1.2"/>
      <polygon points="150,15 146,21 154,21" fill="#94a3b8"/>
      <path d="M 60,50 Q 150,180 240,50" stroke="#f59e0b" fill="none" strokeWidth="2" strokeDasharray="4,3"/>
      <circle cx="90" cy="130" r="4" fill="#86efac"/>
      <circle cx="210" cy="130" r="4" fill="#86efac"/>
      <circle cx="150" cy="60" r="4" fill="#f472b6"/>
      <line x1="90" y1="130" x2="150" y2="60" stroke="#86efac" strokeWidth="1.5"/>
      <line x1="210" y1="130" x2="150" y2="60" stroke="#86efac" strokeWidth="1.5"/>
      <line x1="90" y1="130" x2="210" y2="130" stroke="#86efac" strokeWidth="1.5"/>
      <text x="150" y="148" fill="#94a3b8" fontSize="8" textAnchor="middle">A (x₁,0) · B (x₂,0) · C di parabola</text>
    </svg>
  ),content:"Segitiga dibentuk oleh dua titik A, B pada sumbu-x dan titik C pada parabola y = −x² + 4.",parts:[
    {label:"a.",math:"\\text{Alas } AB = x_2 - x_1 = 2a, \\text{ tinggi } = f(0) = 4 \\text{ jika } A(-a,0), B(a,0)"},
    {label:"b.",math:"L_{segitiga} = \\frac{1}{2} \\times 2a \\times 4 = 4a. \\text{ Ini tidak ada maks, jadi ambil C di atas!}"},
    {label:"c.",text:"Bagaimana memaksimalkan luas segitiga dengan alas di sumbu-x dan C pada parabola?"},
  ]}),
  Qn(29,"Optimasi Sudut Tembak – ANBK",{type:"mixed",content:"Jangkauan peluru: R(θ) = v²sin(2θ)/g. Untuk v = 10, g = 10: R(θ) = 10sin(2θ).",parts:[
    {label:"a.",text:"Sudut θ berapa agar jangkauan R maksimum?"},
    {label:"b.",math:"R_{maks} = 10 \\sin(90°) = \\ldots \\text{ meter}"},
    {label:"c.",text:"Jika ini dimodel sebagai fungsi kuadrat dalam sin(θ), bagaimana bentuknya?"},
  ]}),
  Qn(30,"Nilai Min Bentuk Kuadrat – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x,y) = x^2 + y^2, \\; x+y=10. \\text{ Min } f \\text{ saat } x=y=5. \\text{ Verifikasi!}"},
    {label:"b.",math:"g(x) = x^2 + (10-x)^2. \\text{ Ekspansi dan cari min!}"},
    {label:"c.",math:"g_{min} = \\ldots \\text{ saat } x = \\ldots"},
  ]}),
  Qn(31,"Soal UN – Penghasilan Optimal",{type:"mixed",content:"Penghasilan H(n) = −10n² + 500n − 1000 ribu rupiah, n = jumlah pegawai.",parts:[
    {label:"a.",math:"\\text{Jumlah pegawai optimal: } n = \\frac{500}{20} = \\ldots \\text{ orang}"},
    {label:"b.",math:"H_{maks} = H(25) = \\ldots \\text{ ribu rupiah}"},
    {label:"c.",math:"\\text{Berapa pegawai agar tidak rugi } (H \\geq 0)?"},
  ]}),
  Qn(32,"Nilai f(x) pada Batas Domain – ANBK",{type:"mixed",content:"f(x) = 2x² − 8x + 3, domain [1, 5].",parts:[
    {label:"a.",math:"\\text{Titik puncak: } x = 2, f(2) = \\ldots \\text{ (nilai minimum)}"},
    {label:"b.",math:"f(1) = \\ldots \\quad f(5) = \\ldots \\text{ (nilai di batas domain)}"},
    {label:"c.",text:"Manakah nilai minimum dan maksimum f pada domain [1, 5]?"},
  ]}),
  Qn(33,"Soal HOTS – Integral dan Nilai Maks – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = ax^2 + bx + c \\text{ maks di } x=3. \\text{ Jika } f(1)+f(5)=20, \\text{ cari } f(3)!"},
    {label:"b.",math:"\\text{Gunakan sifat simetri: } f(3-d)=f(3+d). \\text{ Maka } f(1)=f(5)=\\ldots"},
    {label:"c.",math:"\\text{Jika } f_{maks} = 12, \\text{ apakah konsisten dengan } f(1)+f(5)=20?"},
  ]}),
  Qn(34,"Fungsi Biaya Kuadrat – UN",{type:"mixed",content:"Biaya produksi per unit: C(x) = x² − 10x + 30 ribu rupiah, x = jumlah produksi.",parts:[
    {label:"a.",math:"\\text{Biaya per unit minimum: } x = \\ldots, C_{min} = \\ldots"},
    {label:"b.",text:"Interpretasikan artinya dalam konteks produksi!"},
    {label:"c.",math:"\\text{Berapa biaya per unit jika produksi } x = 0 \\text{ dan } x = 10?"},
  ]}),
  Qn(35,"Soal UN – Nilai Ekstrem Fungsi Pecahan",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = \\frac{x}{x^2+4}. \\text{ Dengan bantuan AM-GM: } x^2+4 \\geq 2\\sqrt{4}x = 4x"},
    {label:"b.",math:"\\text{Maka } f(x) \\leq \\frac{x}{4x} = \\frac{1}{4}. \\text{ Nilai max } f = \\frac{1}{4} \\text{ saat } x=\\ldots"},
    {label:"c.",text:"Verifikasi: jika x = 2, f(2) = 2/(4+4) = 1/4. Benar?"},
  ]}),
  Qn(36,"Analisis Penjualan – ANBK",{type:"mixed",diagram:(
    <svg width="300" height="130" viewBox="0 0 300 130" className="mx-auto">
      <rect x="5" y="5" width="290" height="120" rx="8" fill="var(--card)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4"/>
      <text x="150" y="24" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">Penjualan vs Keuntungan</text>
      {['Unit (x)','10','20','30','40','50','60'].map((v,i)=>(
        <text key={i} x={25+i*45} y={44} fill={i===0?"#fbbf24":"#94a3b8"} fontSize="8.5" textAnchor="middle">{v}</text>
      ))}
      <line x1="7" y1="49" x2="293" y2="49" stroke="var(--border)" strokeWidth="1"/>
      {['K(ribu)','−50','0','30','40','30','0'].map((v,i)=>(
        <text key={i} x={25+i*45} y={70} fill={i===0?"#fbbf24":v==='0'?"#86efac":v==='40'?"#fcd34d":v.startsWith('−')?"#f472b6":"#e2e8f0"} fontSize="8.5" textAnchor="middle">{v}</text>
      ))}
      <line x1="7" y1="75" x2="293" y2="75" stroke="var(--border)" strokeWidth="1"/>
      <text x="150" y="95" fill="#86efac" fontSize="8" textAnchor="middle">Impas saat x = 20 dan x = 60</text>
      <text x="150" y="113" fill="#fcd34d" fontSize="8" textAnchor="middle">Keuntungan maks = 40 ribu saat x = 40 unit</text>
    </svg>
  ),parts:[
    {label:"a.",text:"Dari tabel, tentukan rentang produksi yang menguntungkan."},
    {label:"b.",text:"Tentukan jumlah produksi optimal berdasarkan tabel."},
    {label:"c.",math:"\\text{Cari persamaan } K(x) \\text{ berdasarkan data tabel}"},
  ]}),
  Qn(37,"Soal UN – Fungsi Kuadrat dalam Waktu",{type:"mixed",content:"Suhu ruangan: T(t) = −t² + 6t + 16°C, t = jam setelah tengah malam.",parts:[
    {label:"a.",math:"\\text{Suhu maksimum saat } t = \\ldots \\text{ jam} = \\ldots °C"},
    {label:"b.",math:"\\text{Suhu saat tengah malam (t=0): } T(0) = \\ldots °C"},
    {label:"c.",math:"\\text{Pada pukul berapa suhu kembali ke 16°C?}"},
  ]}),
  Qn(38,"HOTS – Nilai Maks Fungsi Komposit – TKA",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Jika } f(x) = -x^2 + 4, \\text{ max nilai } f = 4 \\text{ saat } x = 0. \\text{ Tunjukkan!}"},
    {label:"b.",math:"\\text{Max nilai } [f(x)]^2 = (-x^2+4)^2 \\text{ pada } x \\in [-2,2] = \\ldots"},
    {label:"c.",math:"\\text{Max nilai } f(x^2) = -(x^2)^2+4 = -x^4+4 \\text{ saat } x=0 = \\ldots"},
  ]}),
  Qn(39,"Soal Kaya Gambar – Perkebunan – ANBK",{type:"mixed",diagram:(
    <svg width="300" height="150" viewBox="0 0 300 150" className="mx-auto">
      <rect x="30" y="20" width="240" height="110" rx="4" fill="none" stroke="#86efac" strokeWidth="2"/>
      {[1,2,3].map(i=><line key={i} x1={30+i*60} y1={20} x2={30+i*60} y2={130} stroke="#86efac" strokeWidth="1" strokeDasharray="4,3"/>)}
      <text x="150" y="80" fill="#86efac" fontSize="10" textAnchor="middle" fontWeight="bold">Kebun (4 petak)</text>
      <text x="150" y="100" fill="#94a3b8" fontSize="8" textAnchor="middle">Lebar tiap petak = x m</text>
      <text x="150" y="118" fill="#94a3b8" fontSize="8" textAnchor="middle">Panjang = y m</text>
      <text x="150" y="14" fill="#fbbf24" fontSize="9" textAnchor="middle">5x + 2y = 100 m (total pagar)</text>
    </svg>
  ),content:"Total pagar = 5x + 2y = 100 m. Luas total L = 4xy.",parts:[
    {label:"a.",math:"y = \\frac{100-5x}{2}. \\text{ Tulis } L(x) = 4x \\cdot \\frac{100-5x}{2}"},
    {label:"b.",math:"L(x) = 200x - 10x^2. \\text{ Nilai } x \\text{ agar } L \\text{ maks?}"},
    {label:"c.",math:"L_{maks} = \\ldots \\text{ m}^2, \\text{ dimensi: } x = \\ldots \\text{ m}, y = \\ldots \\text{ m}"},
  ]}),
  Qn(40,"HOTS – Optimasi Multi-Kondisi – UN/TKA",{type:"mixed",content:"Dua buah persegi dengan sisi x dan y. Jumlah keliling = 40 cm.",parts:[
    {label:"a.",math:"4x + 4y = 40 \\Rightarrow x + y = 10. \\text{ Nyatakan } y = 10 - x"},
    {label:"b.",math:"\\text{Total luas: } L = x^2 + y^2 = x^2 + (10-x)^2. \\text{ Nilai min } L?"},
    {label:"c.",math:"\\text{Total luas: } M = x^2 \\times y^2. \\text{ Nilai maks } M = (xy)^2 = ?\\text{ Gunakan AM-GM!}"},
  ]}),
];

const PenerapanNilaiMaksMinPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🚀</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1" style={{textShadow:'0 0 20px rgba(251,113,133,0.7)'}}>
            PENERAPAN FUNGSI KUADRAT (NILAI MAKS/MIN)
          </h1>
          <p className={isDark ? "text-white/50 text-xs text-center font-body" : "text-gray-500 text-xs text-center font-body"}>Kelas 9 · Fungsi Kuadrat · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 40 {t('practice.suffixSoal')}</span>
            <span className={isDark ? "text-white/30 text-xs" : "text-gray-400 text-xs"}>·</span>
            <span className={isDark ? "text-white/50 text-xs" : "text-gray-500 text-xs"}>UN / ANBK / TKA</span>
          </div>
        </div>

        <div className={isDark ? "mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4" : "mb-5 bg-rose-50 border border-rose-500/20 rounded-xl p-4"}>
          <p className="text-rose-300 text-xs font-bold mb-3">📐 Langkah Penerapan</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              {name:"① Buat fungsi", math:"\\text{Modelkan situasi ke } f(x)"},
              {name:"② Tentukan domain", math:"x \\in [a, b] \\text{ sesuai konteks}"},
              {name:"③ Cari puncak", math:"x_{opt} = -\\frac{b}{2a}"},
              {name:"④ Nilai ekstrem", math:"f(x_{opt}) = c - \\frac{b^2}{4a}"},
            ].map(r=>(
              <div key={r.name} className={isDark ? "bg-white/5 rounded-lg px-3 py-2" : "bg-gray-50 rounded-lg px-3 py-2"}>
                <div className={isDark ? "text-white/40 text-[9px] uppercase mb-1" : "text-gray-500 text-[9px] uppercase mb-1"}>{r.name}</div>
                <div className="text-rose-300 text-xs overflow-x-auto"><InlineMath math={r.math}/></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q,i)=>(
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{animationDelay:`${i*0.02}s`}}>
              <div className={isDark ? "absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" : "absolute inset-0 bg-gradient-to-br from-rose-50/60 via-white/80 to-pink-50/40 backdrop-blur"}/>
              <div className="absolute inset-0 border border-rose-500/20 rounded-2xl"/>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl"/>
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                    <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className={isDark ? "font-body text-sm text-white/90 leading-relaxed mb-3" : "font-body text-sm text-gray-800 leading-relaxed mb-3"}>{q.content}</p>}
                    {q.mathContent && <div className={isDark ? "mb-3 bg-rose-900/20 border border-rose-500/20 rounded-lg px-4 py-3 flex justify-center" : "mb-3 bg-rose-50 border border-rose-500/20 rounded-lg px-4 py-3 flex justify-center"}><BlockMath math={q.mathContent}/></div>}
                    {q.diagram && <div className={isDark ? "mb-3 flex justify-center bg-white/5 rounded-xl p-3" : "mb-3 flex justify-center bg-gray-50 rounded-xl p-3"}>{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p,pi)=>(
                          <div key={pi} className={isDark ? "flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5" : "flex items-start gap-2 rounded-lg px-3 py-2 bg-gray-50"}>
                            <span className="text-rose-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math ? <div className={isDark ? "text-white text-sm overflow-x-auto" : "text-foreground text-sm overflow-x-auto"}><InlineMath math={p.math}/></div>
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
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Fungsi Kuadrat
          </button>
        </div>
      </div>
    </div>
  );
};
export default PenerapanNilaiMaksMinPage;
