import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const AxisSymmetrySVG = () => (
  <svg width="300" height="210" viewBox="0 0 300 210" className="mx-auto">
    <line x1="20" y1="140" x2="280" y2="140" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="280,140 274,136 274,144" fill="#94a3b8"/>
    <line x1="150" y1="200" x2="150" y2="10" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="150,10 146,16 154,16" fill="#94a3b8"/>
    <text x="283" y="144" fill="#94a3b8" fontSize="10">x</text>
    <text x="154" y="14" fill="#94a3b8" fontSize="10">y</text>
    <path d="M 70,50 Q 150,190 230,50" stroke="#f59e0b" fill="none" strokeWidth="2.5"/>
    <circle cx="150" cy="185" r="5" fill="#f59e0b"/>
    <line x1="150" y1="10" x2="150" y2="200" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,4"/>
    <text x="155" y="18" fill="#fbbf24" fontSize="9" fontWeight="bold">x = h (Sumbu Simetri)</text>
    <text x="158" y="195" fill="#fcd34d" fontSize="9">Titik Puncak (h, k)</text>
    <circle cx="85" cy="80" r="3" fill="#86efac"/>
    <circle cx="215" cy="80" r="3" fill="#86efac"/>
    <line x1="85" y1="80" x2="215" y2="80" stroke="#86efac" strokeWidth="1" strokeDasharray="3,2"/>
    <text x="88" y="76" fill="#86efac" fontSize="8">Simetri terhadap x = h</text>
    <text x="10" y="18" fill="#a78bfa" fontSize="9">h = −b/(2a)</text>
    <text x="10" y="30" fill="#a78bfa" fontSize="9">k = f(h) = c − b²/(4a)</text>
  </svg>
);

const VertexFormSVG = () => (
  <svg width="300" height="180" viewBox="0 0 300 180" className="mx-auto">
    <rect x="5" y="5" width="290" height="170" rx="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4"/>
    <text x="150" y="26" fill="#fcd34d" fontSize="11" fontWeight="bold" textAnchor="middle">Bentuk Vertex: f(x) = a(x−h)² + k</text>
    <line x1="10" y1="32" x2="290" y2="32" stroke="#334155" strokeWidth="1"/>
    <text x="150" y="52" fill="#94a3b8" fontSize="9" textAnchor="middle">Hubungan dengan Bentuk Umum:</text>
    <text x="60" y="72" fill="#f59e0b" fontSize="10" textAnchor="middle">h = −b/(2a)</text>
    <text x="220" y="72" fill="#86efac" fontSize="10" textAnchor="middle">k = 4ac−b² / 4a</text>
    <line x1="10" y1="80" x2="290" y2="80" stroke="#334155" strokeWidth="1"/>
    <text x="150" y="100" fill="#94a3b8" fontSize="9" textAnchor="middle">Contoh: f(x) = 2x² − 8x + 5</text>
    <text x="80" y="120" fill="#f59e0b" fontSize="9" textAnchor="middle">h = −(−8)/(2·2) = 2</text>
    <text x="220" y="120" fill="#86efac" fontSize="9" textAnchor="middle">k = f(2) = 8−16+5 = −3</text>
    <text x="150" y="145" fill="#fcd34d" fontSize="10" textAnchor="middle">Titik Puncak: (2, −3)</text>
    <text x="150" y="162" fill="#a78bfa" fontSize="9" textAnchor="middle">Sumbu Simetri: x = 2</text>
  </svg>
);

const CompletingSquareSVG = () => (
  <svg width="300" height="190" viewBox="0 0 300 190" className="mx-auto">
    <rect x="5" y="5" width="290" height="180" rx="10" fill="#1e293b" stroke="#a78bfa" strokeWidth="1" strokeOpacity="0.5"/>
    <text x="150" y="25" fill="#c4b5fd" fontSize="10" fontWeight="bold" textAnchor="middle">Melengkapi Kuadrat Sempurna</text>
    <text x="150" y="46" fill="#94a3b8" fontSize="9" textAnchor="middle">f(x) = x² − 6x + 5</text>
    <text x="150" y="66" fill="#94a3b8" fontSize="9" textAnchor="middle">= (x² − 6x + 9) − 9 + 5</text>
    <text x="150" y="86" fill="#f59e0b" fontSize="9" textAnchor="middle">= (x − 3)² − 4</text>
    <line x1="10" y1="93" x2="290" y2="93" stroke="#334155" strokeWidth="1"/>
    <text x="150" y="112" fill="#86efac" fontSize="9" textAnchor="middle">Titik Puncak: (3, −4)</text>
    <text x="150" y="130" fill="#fcd34d" fontSize="9" textAnchor="middle">Sumbu Simetri: x = 3</text>
    <text x="150" y="148" fill="#a78bfa" fontSize="9" textAnchor="middle">Nilai minimum: k = −4</text>
    <rect x="30" y="155" width="240" height="25" rx="5" fill="#a78bfa" fillOpacity="0.15" stroke="#a78bfa" strokeWidth="1" strokeOpacity="0.3"/>
    <text x="150" y="172" fill="#c4b5fd" fontSize="9" textAnchor="middle">Tambahkan (b/2)² = (−6/2)² = 9 lalu kurangkan lagi</text>
  </svg>
);

const SymmetryPropertySVG = () => (
  <svg width="300" height="180" viewBox="0 0 300 180" className="mx-auto">
    <line x1="20" y1="120" x2="280" y2="120" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="280,120 274,116 274,124" fill="#94a3b8"/>
    <line x1="150" y1="170" x2="150" y2="15" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="150,15 146,21 154,21" fill="#94a3b8"/>
    <path d="M 60,35 Q 150,165 240,35" stroke="#f59e0b" fill="none" strokeWidth="2.5"/>
    <circle cx="150" cy="165" r="4" fill="#f59e0b"/>
    <line x1="150" y1="15" x2="150" y2="175" stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.6"/>
    <circle cx="90" cy="70" r="4" fill="#86efac"/>
    <circle cx="210" cy="70" r="4" fill="#86efac"/>
    <line x1="90" y1="70" x2="210" y2="70" stroke="#86efac" strokeWidth="1" strokeDasharray="3,2"/>
    <text x="55" y="66" fill="#86efac" fontSize="8">f(h−d)</text>
    <text x="212" y="66" fill="#86efac" fontSize="8">f(h+d)</text>
    <text x="152" y="175" fill="#fcd34d" fontSize="8">f(h−d) = f(h+d)</text>
    <text x="5" y="18" fill="#94a3b8" fontSize="8">Sifat Simetri:</text>
    <text x="5" y="30" fill="#94a3b8" fontSize="8">f(h−d) = f(h+d)</text>
  </svg>
);

const questions: Q[] = [
  Qn(1,"Rumus Sumbu Simetri – UN",{type:"mixed",diagram:<AxisSymmetrySVG/>,parts:[
    {label:"a.",math:"\\text{Tentukan sumbu simetri } f(x) = x^2 - 6x + 5 \\text{ (rumus: } x = -\\frac{b}{2a}\\text{)}"},
    {label:"b.",math:"\\text{Tentukan sumbu simetri } g(x) = 2x^2 - 8x + 3"},
    {label:"c.",math:"\\text{Tentukan sumbu simetri } h(x) = -3x^2 + 12x - 1"},
  ]}),
  Qn(2,"Titik Puncak – ANBK",{type:"mixed",diagram:<VertexFormSVG/>,parts:[
    {label:"a.",math:"f(x) = x^2 - 6x + 5 \\Rightarrow \\text{titik puncak } (h, k) = (\\ldots, \\ldots)"},
    {label:"b.",math:"g(x) = -x^2 + 4x + 1 \\Rightarrow \\text{titik puncak } = (\\ldots, \\ldots)"},
    {label:"c.",math:"h(x) = 2x^2 + 4x - 3 \\Rightarrow \\text{titik puncak } = (\\ldots, \\ldots)"},
  ]}),
  Qn(3,"Melengkapi Kuadrat Sempurna – TKA",{type:"mixed",diagram:<CompletingSquareSVG/>,parts:[
    {label:"a.",math:"f(x) = x^2 - 4x + 7 \\Rightarrow f(x) = (x-\\ldots)^2 + \\ldots"},
    {label:"b.",math:"g(x) = x^2 + 6x + 2 \\Rightarrow g(x) = (x+\\ldots)^2 - \\ldots"},
    {label:"c.",math:"h(x) = 2x^2 - 12x + 5 \\Rightarrow h(x) = 2(x-\\ldots)^2 + \\ldots"},
  ]}),
  Qn(4,"Sifat Simetri – UN",{type:"mixed",diagram:<SymmetryPropertySVG/>,parts:[
    {label:"a.",math:"f(x) = x^2 - 6x + 5. \\text{ Jika } f(1) = f(k), \\text{ tentukan } k!"},
    {label:"b.",math:"g(x) = x^2 - 4x + 3. \\text{ Jika } g(0) = g(m), \\text{ tentukan } m!"},
    {label:"c.",text:"Mengapa nilai fungsi pada dua titik yang simetris terhadap sumbu simetri selalu sama?"},
  ]}),
  Qn(5,"Nilai Titik Puncak – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 8x + 15 \\Rightarrow \\text{nilai minimum} = \\ldots"},
    {label:"b.",math:"g(x) = -x^2 + 6x - 5 \\Rightarrow \\text{nilai maksimum} = \\ldots"},
    {label:"c.",math:"h(x) = 3x^2 - 6x + 5 \\Rightarrow \\text{nilai minimum} = \\ldots"},
  ]}),
  Qn(6,"Koordinat Titik Puncak – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = -2x^2 + 8x - 3 \\Rightarrow (h, k) = (\\ldots, \\ldots)"},
    {label:"b.",math:"g(x) = \\frac{1}{2}x^2 - 3x + 4 \\Rightarrow (h, k) = (\\ldots, \\ldots)"},
    {label:"c.",math:"h(x) = -x^2 - 4x + 7 \\Rightarrow (h, k) = (\\ldots, \\ldots)"},
  ]}),
  Qn(7,"Sumbu Simetri dari Dua Titik – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Grafik melalui } (-1, 3) \\text{ dan } (5, 3). \\text{ Sumbu simetrinya } x = \\ldots"},
    {label:"b.",math:"\\text{Grafik melalui } (2, 5) \\text{ dan } (8, 5). \\text{ Sumbu simetrinya } x = \\ldots"},
    {label:"c.",math:"\\text{f(a) = f(b) → sumbu simetri di } x = \\frac{a+b}{2}. \\text{ Mengapa?}"},
  ]}),
  Qn(8,"Bentuk Vertex ke Umum – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = (x-3)^2 - 4 \\Rightarrow \\text{bentuk umum}"},
    {label:"b.",math:"g(x) = 2(x+1)^2 - 7 \\Rightarrow \\text{bentuk umum}"},
    {label:"c.",math:"h(x) = -(x-2)^2 + 9 \\Rightarrow \\text{bentuk umum}"},
  ]}),
  Qn(9,"Bentuk Umum ke Vertex – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 10x + 21 \\Rightarrow f(x) = (x-\\ldots)^2 + \\ldots"},
    {label:"b.",math:"g(x) = -x^2 + 8x - 10 \\Rightarrow g(x) = -(x-\\ldots)^2 + \\ldots"},
    {label:"c.",math:"h(x) = 4x^2 + 8x + 1 \\Rightarrow h(x) = 4(x+\\ldots)^2 + \\ldots"},
  ]}),
  Qn(10,"Nilai Minimum / Maksimum dari Bentuk Vertex – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = (x-5)^2 - 3 \\Rightarrow \\text{nilai minimum} = \\ldots \\text{ saat } x = \\ldots"},
    {label:"b.",math:"g(x) = -(x+2)^2 + 7 \\Rightarrow \\text{nilai maksimum} = \\ldots \\text{ saat } x = \\ldots"},
    {label:"c.",math:"h(x) = 3(x-1)^2 + 2 \\Rightarrow \\text{nilai minimum} = \\ldots \\text{ saat } x = \\ldots"},
  ]}),
  Qn(11,"Sumbu Simetri Berdasarkan Koefisien – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = 5x^2 - 20x + 3 \\Rightarrow x_{simetri} = -\\frac{-20}{2 \\cdot 5} = \\ldots"},
    {label:"b.",math:"g(x) = -4x^2 + 12x - 5 \\Rightarrow x_{simetri} = \\ldots"},
    {label:"c.",math:"h(x) = \\frac{1}{3}x^2 - 2x + 7 \\Rightarrow x_{simetri} = \\ldots"},
  ]}),
  Qn(12,"Grafik Simetri terhadap x = 3 – TKA",{type:"mixed",content:"Diketahui f(x) = x² − 6x + k dengan sumbu simetri x = 3.",parts:[
    {label:"a.",math:"\\text{Verifikasi sumbu simetri: } x = -\\frac{-6}{2\\cdot 1} = \\ldots"},
    {label:"b.",math:"\\text{Hitung titik puncak (3, f(3))}"},
    {label:"c.",math:"\\text{Jika } f(0) = 11, \\text{ tentukan } k!"},
  ]}),
  Qn(13,"Menentukan Fungsi dari Titik Puncak – UN",{type:"mixed",content:"Tentukan fungsi kuadrat dengan:",parts:[
    {label:"a.",text:"Titik puncak (2, −3) dan a = 1."},
    {label:"b.",text:"Titik puncak (−1, 4) dan a = −2."},
    {label:"c.",text:"Titik puncak (3, 0) dan melalui titik (5, 4)."},
  ]}),
  Qn(14,"Verifikasi Sifat Simetri – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 4x + 3. \\text{ Hitung } f(0) \\text{ dan } f(4) \\text{, apakah sama?}"},
    {label:"b.",math:"g(x) = x^2 - 4x + 3. \\text{ Hitung } f(1) \\text{ dan } f(3) \\text{, apakah sama?}"},
    {label:"c.",text:"Apa artinya jika f(a) = f(b) dalam konteks sumbu simetri?"},
  ]}),
  Qn(15,"Rangkuman Titik Puncak – TKA",{type:"mixed",diagram:(
    <svg width="300" height="150" viewBox="0 0 300 150" className="mx-auto">
      <rect x="5" y="5" width="290" height="140" rx="8" fill="#1e293b" stroke="#a78bfa" strokeWidth="1" strokeOpacity="0.4"/>
      <text x="150" y="24" fill="#c4b5fd" fontSize="10" fontWeight="bold" textAnchor="middle">Metode Mencari Titik Puncak</text>
      {['Metode','Sumbu Simetri','Titik Puncak'].map((h,i)=>(
        <text key={i} x={30+i*110} y={42} fill="#fbbf24" fontSize="9" textAnchor="middle" fontWeight="bold">{h}</text>
      ))}
      <line x1="7" y1="46" x2="293" y2="46" stroke="#334155" strokeWidth="1"/>
      {[['Rumus','x = −b/2a','k = f(h)'],['Kuadrat','(nilai h)','sempurna'],['Vertex','langsung','dari a(x−h)²+k']].map((r,ri)=>(
        r.map((c,ci)=>(
          <text key={ci} x={30+ci*110} y={64+ri*24} fill={ci===0?"#a78bfa":"#94a3b8"} fontSize="8" textAnchor="middle">{c}</text>
        ))
      ))}
    </svg>
  ),parts:[
    {label:"a.",math:"\\text{Gunakan metode rumus: } f(x) = 3x^2-18x+7"},
    {label:"b.",math:"\\text{Gunakan metode melengkapi kuadrat: } f(x) = x^2-4x+1"},
    {label:"c.",text:"Metode mana yang lebih efisien? Jelaskan!"},
  ]}),
  Qn(16,"Titik Puncak Maksimum – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = -x^2 + 6x - 5. \\text{ Titik puncak maksimum} = (\\ldots, \\ldots)"},
    {label:"b.",math:"g(x) = -(x-3)^2 + 11. \\text{ Nilai maksimum} = \\ldots"},
    {label:"c.",math:"h(x) = -2x^2 + 12x - 7. \\text{ Nilai dan posisi titik puncak}?"},
  ]}),
  Qn(17,"Persamaan Sumbu Simetri dari Grafik – ANBK",{type:"mixed",diagram:(
    <svg width="300" height="190" viewBox="0 0 300 190" className="mx-auto">
      <line x1="20" y1="130" x2="280" y2="130" stroke="#94a3b8" strokeWidth="1.2"/>
      <polygon points="280,130 274,126 274,134" fill="#94a3b8"/>
      <line x1="150" y1="185" x2="150" y2="10" stroke="#94a3b8" strokeWidth="1.2"/>
      <polygon points="150,10 146,16 154,16" fill="#94a3b8"/>
      <text x="283" y="134" fill="#94a3b8" fontSize="10">x</text>
      <text x="154" y="14" fill="#94a3b8" fontSize="10">y</text>
      <path d="M 60,30 Q 170,180 280,30" stroke="#f59e0b" fill="none" strokeWidth="2.5"/>
      <circle cx="170" cy="172" r="5" fill="#f59e0b"/>
      <line x1="170" y1="10" x2="170" y2="185" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3"/>
      <text x="172" y="22" fill="#fcd34d" fontSize="9">x = 2</text>
      <text x="8" y="130" fill="#94a3b8" fontSize="8">−3</text>
      <text x="60" y="128" fill="#94a3b8" fontSize="8">|</text>
      <text x="275" y="128" fill="#94a3b8" fontSize="8">7</text>
      <text x="7" y="28" fill="#fbbf24" fontSize="9">Sumbu simetri di x = 2</text>
      <text x="7" y="40" fill="#94a3b8" fontSize="8">Titik potong sb-x: (−3,0) dan (7,0)</text>
    </svg>
  ),parts:[
    {label:"a.",text:"Dari grafik, tentukan persamaan sumbu simetrinya."},
    {label:"b.",math:"\\text{Verifikasi: sumbu simetri = }\\frac{x_1+x_2}{2} = \\frac{-3+7}{2} = \\ldots"},
    {label:"c.",math:"\\text{Tentukan koordinat titik puncak berdasarkan grafik!}"},
  ]}),
  Qn(18,"Nilai Fungsi di Titik Puncak – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 4x - 5. \\text{ Nilai minimum } f = \\ldots"},
    {label:"b.",math:"g(x) = -3x^2 + 6x + 1. \\text{ Nilai maksimum } g = \\ldots"},
    {label:"c.",math:"h(x) = 2x^2 + 4x - 6. \\text{ Nilai minimum } h = \\ldots"},
  ]}),
  Qn(19,"Soal UN – Koordinat Puncak dari Persamaan",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 2x - 8 \\Rightarrow \\text{puncak } (\\ldots, \\ldots)"},
    {label:"b.",math:"g(x) = -x^2 + 4x + 5 \\Rightarrow \\text{puncak } (\\ldots, \\ldots)"},
    {label:"c.",math:"h(x) = 3x^2 - 12x + 7 \\Rightarrow \\text{puncak } (\\ldots, \\ldots)"},
  ]}),
  Qn(20,"Soal ANBK – Puncak dan Range",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 6x + 5 \\Rightarrow \\text{puncak dan range}"},
    {label:"b.",math:"g(x) = -(x+1)^2 + 4 \\Rightarrow \\text{puncak dan range}"},
    {label:"c.",math:"h(x) = 2(x-3)^2 - 8 \\Rightarrow \\text{puncak dan range}"},
  ]}),
  Qn(21,"Sumbu Simetri dan Perubahan b – UN",{type:"mixed",content:"Perhatikan fungsi f(x) = x² + bx + 5:",parts:[
    {label:"a.",math:"\\text{Jika } b = 4, \\text{ sumbu simetrinya } x = \\ldots"},
    {label:"b.",math:"\\text{Jika } b = -6, \\text{ sumbu simetrinya } x = \\ldots"},
    {label:"c.",math:"\\text{Nilai } b \\text{ agar sumbu simetri di } x = 3?"},
  ]}),
  Qn(22,"HOTS – Titik Puncak pada Sumbu-x – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 6x + 9. \\text{ Titik puncak ada di sumbu-x? Tunjukkan!}"},
    {label:"b.",math:"g(x) = -x^2 + 8x - 16. \\text{ Titik puncak ada di sumbu-x?}"},
    {label:"c.",math:"\\text{Syarat agar titik puncak tepat di sumbu-x: } k = 0 \\Leftrightarrow D = \\ldots"},
  ]}),
  Qn(23,"Grafik Simetri dengan Titik Tetap – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 6x + c. \\text{ Titik (6, f(6)) simetri dengan titik}\\ldots"},
    {label:"b.",math:"g(x) = x^2 - 4x + 1. \\text{ Jika } g(p) = g(q) \\text{ dan } p + q = 4, \\text{ benar?}"},
    {label:"c.",text:"Jika sumbu simetri x = h, dan f(h + 3) = 10, maka f(h − 3) = ?"},
  ]}),
  Qn(24,"Sumbu Simetri di Sumbu-y – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = 3x^2 - 12 \\Rightarrow \\text{sumbu simetri dan titik puncak}"},
    {label:"b.",math:"g(x) = -x^2 + 4 \\Rightarrow \\text{sumbu simetri dan nilai maksimum}"},
    {label:"c.",text:"Fungsi dengan b = 0 selalu memiliki sumbu simetri di x = 0. Benar atau salah?"},
  ]}),
  Qn(25,"Koordinat Puncak dan Jenis Ekstrem – UN",{type:"mixed",diagram:(
    <svg width="300" height="120" viewBox="0 0 300 120" className="mx-auto">
      <rect x="5" y="5" width="290" height="110" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.3"/>
      <text x="150" y="24" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">Jenis Nilai Ekstrem</text>
      {['Kondisi','a &gt; 0','a &lt; 0'].map((h,i)=>(
        <text key={i} x={50+i*100} y={42} fill={i===0?"#fbbf24":i===1?"#86efac":"#f472b6"} fontSize="9" textAnchor="middle" fontWeight="bold">{h}</text>
      ))}
      <line x1="7" y1="47" x2="293" y2="47" stroke="#334155" strokeWidth="1"/>
      {[['Jenis Puncak','Minimum','Maksimum'],['Nilai Ekstrem','f(h) = nilai min','f(h) = nilai maks'],['Bentuk Grafik','Cekung ke atas ∪','Cekung ke bawah ∩']].map((row,ri)=>(
        row.map((c,ci)=>(
          <text key={ci} x={50+ci*100} y={62+ri*18} fill={ci===0?"#fbbf24":ci===1?"#86efac":"#f472b6"} fontSize="8" textAnchor="middle">{c}</text>
        ))
      ))}
    </svg>
  ),parts:[
    {label:"a.",math:"f(x) = 2x^2 - 12x + 20 \\Rightarrow \\text{puncak} = (\\ldots, \\ldots), \\text{jenis}?"},
    {label:"b.",math:"g(x) = -3x^2 + 6x + 1 \\Rightarrow \\text{puncak} = (\\ldots, \\ldots), \\text{jenis}?"},
    {label:"c.",math:"h(x) = (x-2)^2 - 5 \\Rightarrow \\text{puncak} = (\\ldots, \\ldots), \\text{jenis}?"},
  ]}),
  Qn(26,"Menentukan Fungsi dari Puncak dan Satu Titik – ANBK",{type:"mixed",parts:[
    {label:"a.",text:"Titik puncak (2, 3) dan melalui (4, 7). Tentukan f(x)!"},
    {label:"b.",text:"Titik puncak (−1, −2) dan melalui (1, 6). Tentukan f(x)!"},
    {label:"c.",text:"Titik puncak (3, 5) dan a = −1. Tentukan f(x) dalam bentuk umum!"},
  ]}),
  Qn(27,"Posisi Titik Puncak – TKA",{type:"mixed",content:"Tentukan posisi titik puncak dari setiap grafik berikut (di atas/bawah/pada sumbu-x):",parts:[
    {label:"a.",math:"f(x) = x^2 - 4x + 4 \\Rightarrow k = \\ldots"},
    {label:"b.",math:"g(x) = x^2 - 4x + 3 \\Rightarrow k = \\ldots"},
    {label:"c.",math:"h(x) = x^2 - 4x + 5 \\Rightarrow k = \\ldots"},
  ]}),
  Qn(28,"HOTS – Sumbu Simetri Bergeser – UN",{type:"mixed",content:"Grafik f(x) = x² − 2px + q memiliki sumbu simetri x = 3.",parts:[
    {label:"a.",math:"\\text{Dari } x = -\\frac{-2p}{2} = p = 3, \\text{ tentukan nilai } p!"},
    {label:"b.",math:"\\text{Jika } f(1) = 5, \\text{ tentukan } q!"},
    {label:"c.",math:"\\text{Tulis persamaan lengkap } f(x) \\text{ dan hitung titik puncaknya}"},
  ]}),
  Qn(29,"Titik Puncak dari Bentuk Faktor – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = (x-2)(x-8) \\Rightarrow \\text{sumbu simetri } x = \\frac{2+8}{2} = \\ldots"},
    {label:"b.",math:"g(x) = -(x+1)(x-5) \\Rightarrow \\text{sumbu simetri dan puncak}"},
    {label:"c.",math:"h(x) = 2(x-1)(x-7) \\Rightarrow \\text{titik puncak}(\\ldots, \\ldots)"},
  ]}),
  Qn(30,"Memaksimalkan dan Meminimalkan dari Puncak – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Nilai min dari } f(x)=x^2-2x+4 \\text{ adalah } \\ldots \\text{ saat } x=\\ldots"},
    {label:"b.",math:"\\text{Nilai maks dari } g(x)=-2x^2+8x+1 \\text{ adalah } \\ldots \\text{ saat } x=\\ldots"},
    {label:"c.",math:"\\text{Nilai min dari } h(x)=3(x+2)^2-5 \\text{ adalah } \\ldots \\text{ saat } x=\\ldots"},
  ]}),
  Qn(31,"Sumbu Simetri dan Titik Potong – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 10x + 21. \\text{ Titik potong sb-x dan sumbu simetri}?"},
    {label:"b.",math:"\\text{Apakah sumbu simetri berada di tengah dua akar? Verifikasi!}"},
    {label:"c.",math:"x_{simetri} = \\frac{x_1 + x_2}{2} \\text{. Tunjukkan bahwa ini sama dengan } -\\frac{b}{2a}"},
  ]}),
  Qn(32,"Soal HOTS – Menganalisis Dua Fungsi – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 6x + 5 \\text{ dan } g(x) = -x^2 + 6x - 5. \\text{ Apakah titik puncak keduanya sama?}"},
    {label:"b.",math:"\\text{Apa hubungan geometris antara grafik } f \\text{ dan } g?"},
    {label:"c.",math:"\\text{Tentukan titik potong antara } f(x) \\text{ dan } g(x)!"},
  ]}),
  Qn(33,"Nilai k pada Puncak – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - bx + 9. \\text{ Jika puncak di } x=3, \\text{ nilai } b=\\ldots"},
    {label:"b.",math:"g(x) = ax^2 - 8x + 3. \\text{ Jika puncak di } x=2, \\text{ nilai } a=\\ldots"},
    {label:"c.",math:"h(x) = 3x^2 + bx + 1. \\text{ Jika puncak di } x=-1, \\text{ nilai } b=\\ldots"},
  ]}),
  Qn(34,"Soal UN – Vertex pada Kuadran Tertentu",{type:"mixed",content:"Tentukan di kuadran berapa titik puncak berada:",parts:[
    {label:"a.",math:"f(x) = x^2 - 4x + 1 \\Rightarrow (h, k) = (2, -3) \\text{ → Kuadran}\\ldots"},
    {label:"b.",math:"g(x) = -(x+2)^2 + 5 \\Rightarrow (h, k) = (-2, 5) \\text{ → Kuadran}\\ldots"},
    {label:"c.",math:"h(x) = (x+3)^2 - 1 \\Rightarrow (h, k) = (-3, -1) \\text{ → Kuadran}\\ldots"},
  ]}),
  Qn(35,"Perbandingan Puncak Dua Fungsi – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 2x \\text{ dan } g(x) = x^2 + 4x. \\text{ Bandingkan nilai minimum!}"},
    {label:"b.",math:"\\text{Fungsi mana yang puncaknya lebih tinggi?}"},
    {label:"c.",math:"\\text{Apakah kedua grafik pernah berpotongan?}"},
  ]}),
  Qn(36,"HOTS – Puncak Berada di Sumbu-y – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = 3x^2 - c. \\text{ Titik puncak di } (0, -c). \\text{ Jika } f \\text{ puncak di } (0,-7), \\text{ nilai } c?"},
    {label:"b.",math:"g(x) = ax^2 + 5. \\text{ Puncak selalu di} (0,5). \\text{ Jika } g(2) = 21, \\text{ nilai } a?"},
    {label:"c.",math:"h(x) = 2x^2 + bx + 3. \\text{ Untuk } b=0, \\text{ puncak di}(\\ldots,\\ldots)"},
  ]}),
  Qn(37,"Menggunakan Titik Puncak untuk Nilai Fungsi – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 6x + 5 \\text{ puncak di } (3,-4). \\text{ Berapa } f(6)?"},
    {label:"b.",math:"g(x) = -x^2 + 4x + 3 \\text{ puncak di } (2,7). \\text{ Berapa } g(5)?"},
    {label:"c.",text:"Gunakan sifat simetri untuk menjawab tanpa menghitung langsung."},
  ]}),
  Qn(38,"Menentukan Titik Puncak dari Informasi Soal – UN/TKA",{type:"mixed",content:"Grafik f(x) = x² + bx + c memiliki ciri: sumbu simetri x = 4 dan melalui (6, 3).",parts:[
    {label:"a.",math:"\\text{Dari sumbu simetri, tentukan } b: x = -\\frac{b}{2} = 4 \\Rightarrow b = \\ldots"},
    {label:"b.",math:"\\text{Substitusi titik } (6,3) \\text{ untuk mencari } c"},
    {label:"c.",math:"\\text{Tentukan koordinat titik puncak}"},
  ]}),
  Qn(39,"Soal UN – Puncak dan Diskriminan",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 6x + c. \\text{ Nilai } c \\text{ agar puncak di atas sumbu-x } (k>0)?"},
    {label:"b.",math:"g(x) = x^2 - 6x + c. \\text{ Nilai } c \\text{ agar puncak tepat di sumbu-x } (k=0)?"},
    {label:"c.",math:"h(x) = x^2 - 6x + c. \\text{ Nilai } c \\text{ agar puncak di bawah sumbu-x } (k<0)?"},
  ]}),
  Qn(40,"HOTS – Rekonstruksi Fungsi dari Puncak dan Titik – UN/TKA",{type:"mixed",content:"Diketahui: titik puncak (−2, 6), titik potong sumbu-x ada 2 buah, dan a < 0.",parts:[
    {label:"a.",math:"\\text{Tulis dalam bentuk vertex: } f(x) = a(x+2)^2 + 6, \\; a < 0"},
    {label:"b.",math:"\\text{Syarat agar ada 2 titik potong sb-x: } k > 0 \\text{ (terpenuhi)}. \\text{ Jika } f(0) = 2, \\text{ cari } a"},
    {label:"c.",math:"\\text{Tulis } f(x) \\text{ dalam bentuk umum}"},
  ]}),
];

const SumbuSimetriPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-violet-500/20 border-2 border-violet-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🎯</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1" style={{textShadow:'0 0 20px rgba(167,139,250,0.7)'}}>
            SUMBU SIMETRI DAN TITIK PUNCAK (OPTIMUM)
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Fungsi Kuadrat · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-lg px-4 py-2">
            <span className="text-violet-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-3">📐 Konsep Penting</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              {name:"Sumbu Simetri", math:"x = -\\frac{b}{2a}"},
              {name:"Titik Puncak", math:"(h, k) = \\left(-\\frac{b}{2a},\\; f(-\\frac{b}{2a})\\right)"},
              {name:"Bentuk Vertex", math:"f(x) = a(x-h)^2 + k"},
              {name:"Nilai Puncak", math:"k = c - \\frac{b^2}{4a}"},
            ].map(r=>(
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-violet-300 text-xs overflow-x-auto"><InlineMath math={r.math}/></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q,i)=>(
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{animationDelay:`${i*0.02}s`}}>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-slate-900/80 to-purple-900/30 backdrop-blur"/>
              <div className="absolute inset-0 border border-violet-500/20 rounded-2xl"/>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-400 to-purple-500 rounded-l-2xl"/>
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/50 flex items-center justify-center shrink-0">
                    <span className="text-violet-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-violet-400 text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-violet-900/20 border border-violet-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent}/></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p,pi)=>(
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-violet-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math}/></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>}
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
            className="text-sm text-muted-foreground hover:text-violet-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Fungsi Kuadrat
          </button>
        </div>
      </div>
    </div>
  );
};
export default SumbuSimetriPage;
