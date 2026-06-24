import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const BallTrajectory = () => (
  <svg width="300" height="175" viewBox="0 0 300 175" className="mx-auto">
    <line x1="20" y1="150" x2="280" y2="150" stroke="#94a3b8" strokeWidth="1.5"/>
    <polygon points="280,150 274,146 274,154" fill="#94a3b8"/>
    <line x1="30" y1="165" x2="30" y2="15" stroke="#94a3b8" strokeWidth="1.5"/>
    <polygon points="30,15 26,21 34,21" fill="#94a3b8"/>
    <text x="283" y="154" fill="#94a3b8" fontSize="9">x(m)</text>
    <text x="32" y="14" fill="#94a3b8" fontSize="9">h(m)</text>
    <path d="M 30,145 Q 155,20 280,145" stroke="#f59e0b" fill="none" strokeWidth="2.5"/>
    <circle cx="30" cy="145" r="5" fill="#86efac"/>
    <circle cx="280" cy="145" r="5" fill="#86efac"/>
    <circle cx="155" cy="20" r="6" fill="#f59e0b"/>
    <line x1="155" y1="20" x2="155" y2="150" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="5,3" strokeOpacity="0.7"/>
    <text x="130" y="16" fill="#fcd34d" fontSize="8">h_maks</text>
    <text x="155" y="162" fill="#fcd34d" fontSize="8">x_puncak</text>
    <text x="10" y="16" fill="#fbbf24" fontSize="9">Lintasan Bola</text>
    <text x="10" y="28" fill="#94a3b8" fontSize="8">h(x) = −ax² + bx + c</text>
  </svg>
);

const RectangleFence = () => (
  <svg width="300" height="165" viewBox="0 0 300 165" className="mx-auto">
    <rect x="40" y="25" width="220" height="120" rx="5" fill="none" stroke="#f59e0b" strokeWidth="2.5"/>
    <text x="150" y="18" fill="#fcd34d" fontSize="9" textAnchor="middle" fontWeight="bold">Panjang = p</text>
    <text x="18" y="92" fill="#86efac" fontSize="9" textAnchor="middle">l</text>
    <text x="282" y="92" fill="#86efac" fontSize="9" textAnchor="middle">l</text>
    <text x="150" y="158" fill="#94a3b8" fontSize="8" textAnchor="middle">Tembok (tidak perlu pagar)</text>
    <rect x="40" y="142" width="220" height="5" rx="2" fill="#334155"/>
    <text x="150" y="90" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">Luas = p × l</text>
    <text x="150" y="108" fill="#94a3b8" fontSize="9" textAnchor="middle">p + 2l = K (total pagar)</text>
    <text x="8" y="18" fill="#fbbf24" fontSize="9">Pagar & Tembok</text>
  </svg>
);

const SalesFunctionSVG = () => (
  <svg width="300" height="155" viewBox="0 0 300 155" className="mx-auto">
    <rect x="5" y="5" width="290" height="145" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4"/>
    <text x="150" y="24" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">Model Keuntungan Penjualan</text>
    <text x="150" y="44" fill="#94a3b8" fontSize="9" textAnchor="middle">Harga (p), Permintaan (q), Pendapatan (R)</text>
    <rect x="20" y="52" width="120" height="40" rx="5" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="1"/>
    <text x="80" y="68" fill="#38bdf8" fontSize="8" textAnchor="middle">q = a − bp</text>
    <text x="80" y="82" fill="#94a3b8" fontSize="7" textAnchor="middle">(permintaan turun jika harga naik)</text>
    <rect x="160" y="52" width="120" height="40" rx="5" fill="#1e3a5f" stroke="#86efac" strokeWidth="1"/>
    <text x="220" y="68" fill="#86efac" fontSize="8" textAnchor="middle">R = p × q = p(a−bp)</text>
    <text x="220" y="82" fill="#94a3b8" fontSize="7" textAnchor="middle">(pendapatan adalah kuadrat)</text>
    <line x1="10" y1="102" x2="290" y2="102" stroke="#334155" strokeWidth="1"/>
    <text x="150" y="118" fill="#f59e0b" fontSize="9" textAnchor="middle">R maks ketika p = a/(2b)</text>
    <text x="150" y="135" fill="#94a3b8" fontSize="8" textAnchor="middle">Ini adalah titik puncak fungsi kuadrat R(p)</text>
  </svg>
);

const PhysicsProjectile = () => (
  <svg width="300" height="175" viewBox="0 0 300 175" className="mx-auto">
    <line x1="20" y1="145" x2="280" y2="145" stroke="#94a3b8" strokeWidth="1.5"/>
    <polygon points="280,145 274,141 274,149" fill="#94a3b8"/>
    <line x1="25" y1="160" x2="25" y2="10" stroke="#94a3b8" strokeWidth="1.5"/>
    <polygon points="25,10 21,16 29,16" fill="#94a3b8"/>
    <text x="283" y="149" fill="#94a3b8" fontSize="9">t (s)</text>
    <text x="28" y="13" fill="#94a3b8" fontSize="9">h (m)</text>
    <path d="M 25,90 Q 152,15 280,145" stroke="#f97316" fill="none" strokeWidth="2.5"/>
    <circle cx="25" cy="90" r="5" fill="#86efac"/>
    <circle cx="280" cy="145" r="5" fill="#86efac"/>
    <circle cx="152" cy="15" r="5" fill="#f97316"/>
    <line x1="152" y1="15" x2="152" y2="145" stroke="#f97316" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.6"/>
    <text x="20" y="86" fill="#86efac" fontSize="8">h₀</text>
    <text x="155" y="12" fill="#fdba74" fontSize="8">h_maks</text>
    <text x="8" y="16" fill="#fbbf24" fontSize="9">Gerak Vertikal:</text>
    <text x="8" y="28" fill="#94a3b8" fontSize="8">h(t) = h₀ + v₀t − ½gt²</text>
    <text x="8" y="40" fill="#94a3b8" fontSize="8">g ≈ 10 m/s²</text>
  </svg>
);

const WaterBridgeSVG = () => (
  <svg width="300" height="155" viewBox="0 0 300 155" className="mx-auto">
    <path d="M 30,130 Q 150,20 270,130" stroke="#38bdf8" fill="none" strokeWidth="2.5"/>
    <line x1="30" y1="130" x2="270" y2="130" stroke="#94a3b8" strokeWidth="2"/>
    <line x1="30" y1="130" x2="30" y2="145" stroke="#94a3b8" strokeWidth="2"/>
    <line x1="270" y1="130" x2="270" y2="145" stroke="#94a3b8" strokeWidth="2"/>
    <line x1="150" y1="20" x2="150" y2="130" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5,3" strokeOpacity="0.7"/>
    <text x="155" y="18" fill="#7dd3fc" fontSize="8">Tinggi = h</text>
    <text x="150" y="148" fill="#94a3b8" fontSize="9" textAnchor="middle">Jangkauan = L</text>
    <text x="5" y="18" fill="#fbbf24" fontSize="9">Busur Parabola</text>
    <text x="5" y="30" fill="#94a3b8" fontSize="8">Jembatan/Terowongan</text>
    <circle cx="150" cy="20" r="4" fill="#38bdf8"/>
    <circle cx="30" cy="130" r="4" fill="#86efac"/>
    <circle cx="270" cy="130" r="4" fill="#86efac"/>
  </svg>
);

const questions: Q[] = [
  Qn(1,"Lintasan Bola Dilempar – UN",{type:"mixed",diagram:<BallTrajectory/>,content:"Bola dilempar dan lintasannya: h(x) = −0.1x² + 2x meter, x = jarak horizontal.",parts:[
    {label:"a.",math:"\\text{Ketinggian maks saat } x = -\\frac{2}{2(-0.1)} = \\ldots \\text{ m horizontal}"},
    {label:"b.",math:"h_{maks} = \\ldots \\text{ meter}"},
    {label:"c.",math:"\\text{Jarak jatuh (h=0): } -0.1x^2+2x=0 \\Rightarrow x = \\ldots \\text{ m}"},
  ]}),
  Qn(2,"Pagar dan Luas Maksimum – ANBK",{type:"mixed",diagram:<RectangleFence/>,content:"Pagar 60 m digunakan untuk 3 sisi persegi panjang, satu sisi adalah tembok.",parts:[
    {label:"a.",math:"p + 2l = 60 \\Rightarrow p = 60 - 2l. \\text{ Tulis } L(l) = l \\cdot p"},
    {label:"b.",math:"L(l) = l(60-2l) = 60l - 2l^2. \\text{ Luas maks saat } l = \\ldots"},
    {label:"c.",math:"L_{maks} = \\ldots \\text{ m}^2, p = \\ldots \\text{ m}"},
  ]}),
  Qn(3,"Gerak Vertikal – TKA",{type:"mixed",diagram:<PhysicsProjectile/>,content:"Benda dilempar ke atas dari ketinggian 5 m dengan kecepatan awal 20 m/s. h(t) = −5t² + 20t + 5.",parts:[
    {label:"a.",math:"\\text{Tinggi maks saat } t = \\frac{20}{10} = \\ldots \\text{ s}"},
    {label:"b.",math:"h_{maks} = -5(2)^2 + 20(2) + 5 = \\ldots \\text{ m}"},
    {label:"c.",math:"\\text{Kapan benda kembali ke tanah } (h = 0)?"},
  ]}),
  Qn(4,"Model Keuntungan Toko – UN",{type:"mixed",diagram:<SalesFunctionSVG/>,content:"Keuntungan toko: K(x) = −2x² + 40x − 100 ribu rupiah, x = harga satuan (ribu).",parts:[
    {label:"a.",math:"\\text{Harga optimal: } x = -\\frac{40}{2(-2)} = \\ldots \\text{ ribu rupiah}"},
    {label:"b.",math:"K_{maks} = K(10) = \\ldots \\text{ ribu rupiah}"},
    {label:"c.",math:"\\text{Rentang harga yang menguntungkan (K ≥ 0): } x \\in [\\ldots, \\ldots]"},
  ]}),
  Qn(5,"Jembatan Parabola – ANBK",{type:"mixed",diagram:<WaterBridgeSVG/>,content:"Sebuah jembatan berbentuk parabola. Persamaannya h(x) = −0.04x² + 4 meter, dengan x = jarak dari pusat.",parts:[
    {label:"a.",math:"\\text{Tinggi maksimum jembatan: } h(0) = \\ldots \\text{ m}"},
    {label:"b.",math:"\\text{Lebar jembatan di permukaan (h=0): } x = \\ldots \\text{ m, total lebar} = \\ldots"},
    {label:"c.",math:"\\text{Tinggi jembatan pada } x = 5 \\text{ m dari pusat: } h(5) = \\ldots \\text{ m}"},
  ]}),
  Qn(6,"Populasi Hewan – TKA",{type:"mixed",content:"Populasi hewan: P(t) = −3t² + 30t + 100 ekor, t = tahun (1 ≤ t ≤ 8).",parts:[
    {label:"a.",math:"\\text{Populasi maks saat } t = \\frac{30}{6} = \\ldots \\text{ tahun}"},
    {label:"b.",math:"P_{maks} = -3(5)^2 + 30(5) + 100 = \\ldots \\text{ ekor}"},
    {label:"c.",math:"\\text{Populasi saat } t=1 \\text{ dan } t=8?"},
  ]}),
  Qn(7,"Produksi dan Biaya – UN",{type:"mixed",diagram:(
    <svg width="300" height="130" viewBox="0 0 300 130" className="mx-auto">
      <rect x="5" y="5" width="290" height="120" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4"/>
      <text x="150" y="24" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">Biaya Produksi vs Jumlah Unit</text>
      {['x (unit)','0','2','4','6','8','10'].map((v,i)=>(
        <text key={i} x={25+i*45} y={44} fill={i===0?"#fbbf24":"#94a3b8"} fontSize="9" textAnchor="middle">{v}</text>
      ))}
      <line x1="7" y1="49" x2="293" y2="49" stroke="#334155" strokeWidth="1"/>
      {['C(juta)','50','26','10','2','2','10'].map((v,i)=>(
        <text key={i} x={25+i*45} y={70} fill={i===0?"#fbbf24":v==='2'?"#86efac":"#e2e8f0"} fontSize="9" textAnchor="middle">{v}</text>
      ))}
      <line x1="7" y1="75" x2="293" y2="75" stroke="#334155" strokeWidth="1"/>
      <text x="150" y="95" fill="#86efac" fontSize="8" textAnchor="middle">Biaya minimum = 2 juta saat x = 6 atau x = 8</text>
      <text x="150" y="113" fill="#94a3b8" fontSize="8" textAnchor="middle">C(x) = x² − 14x + 50 juta rupiah</text>
    </svg>
  ),content:"Biaya produksi: C(x) = x² − 14x + 50 juta rupiah, x = unit produksi.",parts:[
    {label:"a.",math:"\\text{Biaya min saat } x = \\frac{14}{2} = \\ldots \\text{ unit}"},
    {label:"b.",math:"C_{min} = (7)^2 - 14(7) + 50 = \\ldots \\text{ juta}"},
    {label:"c.",text:"Apa artinya biaya minimum dalam konteks produksi?"},
  ]}),
  Qn(8,"Perjalanan dan Waktu – ANBK",{type:"mixed",content:"Posisi mobil (km dari kota A): s(t) = −t² + 6t kilometer, t dalam jam (0 ≤ t ≤ 6).",parts:[
    {label:"a.",math:"\\text{Posisi terjauh dari A saat } t = \\ldots \\text{ jam}"},
    {label:"b.",math:"s_{maks} = \\ldots \\text{ km}"},
    {label:"c.",math:"\\text{Kapan mobil kembali ke A} (s=0)? \\; t = \\ldots \\text{ jam}"},
  ]}),
  Qn(9,"Sawah dan Irigasi – TKA",{type:"mixed",diagram:(
    <svg width="300" height="160" viewBox="0 0 300 160" className="mx-auto">
      <rect x="30" y="20" width="240" height="110" rx="5" fill="none" stroke="#86efac" strokeWidth="2"/>
      <line x1="30" y1="75" x2="270" y2="75" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5,3"/>
      <text x="150" y="50" fill="#86efac" fontSize="9" textAnchor="middle">Sawah bagian 1</text>
      <text x="150" y="100" fill="#86efac" fontSize="9" textAnchor="middle">Sawah bagian 2</text>
      <text x="150" y="72" fill="#38bdf8" fontSize="8" textAnchor="middle">Saluran irigasi</text>
      <text x="150" y="16" fill="#fbbf24" fontSize="9" textAnchor="middle">Total pagar (3 sisi): 2l + p = 90 m</text>
      <text x="18" y="80" fill="#fcd34d" fontSize="8" textAnchor="middle">l</text>
      <text x="280" y="80" fill="#fcd34d" fontSize="8" textAnchor="middle">l</text>
      <text x="150" y="148" fill="#94a3b8" fontSize="8" textAnchor="middle">Tembok di sisi bawah</text>
    </svg>
  ),content:"Sawah berbentuk persegi panjang. Total pagar (3 sisi) = 90 m. Lebar = l, panjang = p.",parts:[
    {label:"a.",math:"2l + p = 90 \\Rightarrow p = 90 - 2l. \\text{ Luas } L = lp = l(90-2l)"},
    {label:"b.",math:"L(l) = 90l - 2l^2. \\text{ Luas maks saat } l = \\ldots \\text{ m}"},
    {label:"c.",math:"L_{maks} = \\ldots \\text{ m}^2, \\text{ dimensi sawah: } \\ldots \\times \\ldots"},
  ]}),
  Qn(10,"Lemparan Batu – UN",{type:"mixed",diagram:<BallTrajectory/>,content:"Batu dilempar dari tepian sungai. Ketinggian: h(t) = −5t² + 15t + 20 meter.",parts:[
    {label:"a.",math:"\\text{Ketinggian maks saat } t = \\frac{15}{10} = \\ldots \\text{ s}"},
    {label:"b.",math:"h_{maks} = \\ldots \\text{ m}"},
    {label:"c.",math:"\\text{Kapan batu menyentuh air (h=0)?}"},
  ]}),
  Qn(11,"Kandang Ternak – ANBK",{type:"mixed",diagram:(
    <svg width="300" height="155" viewBox="0 0 300 155" className="mx-auto">
      <rect x="20" y="20" width="260" height="115" rx="5" fill="none" stroke="#f59e0b" strokeWidth="2"/>
      {[1,2].map(i=><line key={i} x1={20+i*86} y1={20} x2={20+i*86} y2={135} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>)}
      {['A','B','C'].map((l,i)=>(
        <text key={l} x={63+i*86} y={85} fill="#fcd34d" fontSize="12" textAnchor="middle" fontWeight="bold">{l}</text>
      ))}
      <text x="150" y="14" fill="#fbbf24" fontSize="9" textAnchor="middle">3 Kandang Sejajar</text>
      <text x="150" y="150" fill="#94a3b8" fontSize="8" textAnchor="middle">Total pagar: 4l + 3p = 120 m</text>
    </svg>
  ),content:"3 kandang sejajar dibuat dengan total pagar 120 m. Lebar tiap = l, panjang = p.",parts:[
    {label:"a.",math:"4l + 3p = 120 \\Rightarrow p = \\frac{120-4l}{3}. \\text{ Luas total } L = 3pl"},
    {label:"b.",math:"L(l) = l(120-4l) = 120l - 4l^2. \\text{ Luas maks saat } l = \\ldots"},
    {label:"c.",math:"L_{maks} = \\ldots \\text{ m}^2, p = \\ldots \\text{ m}"},
  ]}),
  Qn(12,"Soal Kelereng dan Jarak – TKA",{type:"mixed",content:"Kelereng ditembakkan secara horizontal dari meja setinggi 5 m. Posisi horizontal x dan vertikal h memenuhi h = 5 − 0.05x².",parts:[
    {label:"a.",math:"\\text{Kapan kelereng menyentuh tanah (h=0)?}"},
    {label:"b.",math:"x_{jatuh} = \\sqrt{\\frac{5}{0.05}} = \\ldots \\text{ m}"},
    {label:"c.",math:"\\text{Ketinggian saat } x = 5 \\text{ m dari meja: } h(5) = \\ldots"},
  ]}),
  Qn(13,"Tanaman dan Panen – UN",{type:"mixed",content:"Hasil panen (kg): H(n) = −n² + 20n + 50, n = banyak tanaman per meter persegi.",parts:[
    {label:"a.",math:"\\text{Jumlah tanaman optimal: } n = \\frac{20}{2} = \\ldots"},
    {label:"b.",math:"H_{maks} = -(10)^2 + 20(10) + 50 = \\ldots \\text{ kg}"},
    {label:"c.",text:"Jelaskan mengapa terlalu banyak tanaman justru mengurangi hasil panen!"},
  ]}),
  Qn(14,"Harga Tiket dan Penonton – ANBK",{type:"mixed",diagram:<SalesFunctionSVG/>,content:"Banyak penonton: N(h) = −50h + 2000, h = harga tiket (ribu). Pendapatan: R = h × N.",parts:[
    {label:"a.",math:"R(h) = h(-50h+2000) = -50h^2 + 2000h. \\text{ Harga optimal?}"},
    {label:"b.",math:"h_{opt} = \\frac{2000}{100} = \\ldots \\text{ ribu rupiah}"},
    {label:"c.",math:"R_{maks} = \\ldots \\text{ ribu rupiah}"},
  ]}),
  Qn(15,"Pembangunan Jembatan – TKA",{type:"mixed",diagram:<WaterBridgeSVG/>,content:"Jembatan berbentuk parabola dengan persamaan y = −x² + 100 (satuan: dm). Sungai di bawahnya.",parts:[
    {label:"a.",math:"\\text{Tinggi jembatan di tengah (x=0): } y(0) = \\ldots \\text{ dm}"},
    {label:"b.",math:"\\text{Lebar sungai (y=0): } x = \\pm \\ldots \\text{ dm, lebar total} = \\ldots \\text{ dm}"},
    {label:"c.",math:"\\text{Kapal dengan tinggi 60 dm: apakah bisa lewat? (y(x)=60 → x=?)}"},
  ]}),
  Qn(16,"Mencari Waktu Optimal – UN",{type:"mixed",content:"Jarak tempuh: d(t) = −2t² + 20t km, t dalam jam (0 ≤ t ≤ 8).",parts:[
    {label:"a.",math:"\\text{Jarak maksimum saat } t = \\ldots \\text{ jam}"},
    {label:"b.",math:"d_{maks} = \\ldots \\text{ km}"},
    {label:"c.",math:"\\text{Kapan kembali ke titik awal } (d=0)?"},
  ]}),
  Qn(17,"Soal Fisika: Proyektil – ANBK",{type:"mixed",diagram:<PhysicsProjectile/>,content:"Peluru ditembakkan dengan kecepatan awal v₀ = 40 m/s dari tanah. h(t) = −5t² + 40t.",parts:[
    {label:"a.",math:"\\text{Waktu mencapai puncak: } t = \\frac{40}{10} = \\ldots \\text{ s}"},
    {label:"b.",math:"h_{maks} = -5(4)^2 + 40(4) = \\ldots \\text{ m}"},
    {label:"c.",math:"\\text{Waktu total di udara: } -5t^2+40t=0 \\Rightarrow t=\\ldots \\text{ s}"},
  ]}),
  Qn(18,"Kebun Berbentuk L – TKA",{type:"mixed",content:"Kebun berbentuk L dengan dimensi x dan y. Luas = 3xy − x² = x(3y − x). Keliling = 4x + 2y = 24.",parts:[
    {label:"a.",math:"2y = 24 - 4x \\Rightarrow y = 12 - 2x. \\text{ Tulis Luas sebagai fungsi } x!"},
    {label:"b.",math:"L(x) = x(3(12-2x)-x) = x(36-7x) = 36x - 7x^2. \\text{ Maks saat } x=\\ldots"},
    {label:"c.",math:"L_{maks} = \\ldots"},
  ]}),
  Qn(19,"Penghematan Bahan Bakar – UN",{type:"mixed",content:"Konsumsi bahan bakar: f(v) = 0.01v² − 0.8v + 20 liter/100 km, v = kecepatan (km/jam).",parts:[
    {label:"a.",math:"\\text{Kecepatan optimal (konsumsi min): } v = \\frac{0.8}{0.02} = \\ldots \\text{ km/jam}"},
    {label:"b.",math:"f_{min} = 0.01(40)^2 - 0.8(40) + 20 = \\ldots \\text{ liter/100 km}"},
    {label:"c.",text:"Interpretasikan: apa artinya kecepatan optimal dalam konteks penghematan BBM?"},
  ]}),
  Qn(20,"Parabolik Antena – ANBK",{type:"mixed",diagram:<WaterBridgeSVG/>,content:"Antena parabola: y = x²/8 (dalam meter). Fokus berada di (0, 2).",parts:[
    {label:"a.",math:"\\text{Titik terendah antena (vertex): } (\\ldots, \\ldots)"},
    {label:"b.",math:"\\text{Lebar antena pada ketinggian } y=8: x^2/8=8 \\Rightarrow x=\\ldots"},
    {label:"c.",text:"Mengapa bentuk parabola digunakan untuk antena dan cermin?"},
  ]}),
  Qn(21,"Pertumbuhan Tanaman – TKA",{type:"mixed",content:"Tinggi tanaman setelah t minggu: T(t) = −0.5t² + 5t + 2 cm.",parts:[
    {label:"a.",math:"\\text{Tinggi maks saat } t = \\frac{5}{1} = \\ldots \\text{ minggu}"},
    {label:"b.",math:"T_{maks} = -0.5(5)^2 + 5(5) + 2 = \\ldots \\text{ cm}"},
    {label:"c.",math:"\\text{Tinggi awal tanaman (t=0): } T(0) = \\ldots \\text{ cm}"},
  ]}),
  Qn(22,"Kolam Renang Optimal – UN",{type:"mixed",diagram:(
    <svg width="300" height="155" viewBox="0 0 300 155" className="mx-auto">
      <rect x="20" y="15" width="260" height="125" rx="6" fill="none" stroke="#94a3b8" strokeWidth="2"/>
      <rect x="40" y="35" width="220" height="85" rx="4" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="2"/>
      <text x="150" y="82" fill="#38bdf8" fontSize="9" textAnchor="middle">Kolam (panjang × lebar)</text>
      <text x="150" y="130" fill="#94a3b8" fontSize="8" textAnchor="middle">Tepi jalan = 10 m di kiri-kanan, 10 m atas-bawah