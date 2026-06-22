import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const FromRootsSVG = () => (
  <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
    <line x1="20" y1="130" x2="280" y2="130" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="280,130 274,126 274,134" fill="#94a3b8"/>
    <line x1="150" y1="185" x2="150" y2="10" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="150,10 146,16 154,16" fill="#94a3b8"/>
    <text x="283" y="134" fill="#94a3b8" fontSize="10">x</text>
    <text x="154" y="14" fill="#94a3b8" fontSize="10">y</text>
    <path d="M 80,40 Q 150,190 220,40" stroke="#f97316" fill="none" strokeWidth="2.5"/>
    <circle cx="80" cy="130" r="6" fill="#86efac"/>
    <circle cx="220" cy="130" r="6" fill="#86efac"/>
    <text x="60" y="122" fill="#86efac" fontSize="9">x₁</text>
    <text x="222" y="122" fill="#86efac" fontSize="9">x₂</text>
    <circle cx="150" cy="190" r="5" fill="#f97316"/>
    <text x="155" y="195" fill="#fcd34d" fontSize="8">Titik Puncak</text>
    <text x="8" y="22" fill="#fbbf24" fontSize="9" fontWeight="bold">Diketahui 2 akar:</text>
    <text x="8" y="35" fill="#94a3b8" fontSize="8">f(x)=a(x−x₁)(x−x₂)</text>
    <text x="8" y="48" fill="#94a3b8" fontSize="8">substitusi titik lain → cari a</text>
  </svg>
);

const FromVertexSVG = () => (
  <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
    <line x1="20" y1="130" x2="280" y2="130" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="280,130 274,126 274,134" fill="#94a3b8"/>
    <line x1="150" y1="185" x2="150" y2="10" stroke="#94a3b8" strokeWidth="1.2"/>
    <polygon points="150,10 146,16 154,16" fill="#94a3b8"/>
    <text x="283" y="134" fill="#94a3b8" fontSize="10">x</text>
    <text x="154" y="14" fill="#94a3b8" fontSize="10">y</text>
    <path d="M 85,30 Q 150,185 215,30" stroke="#a78bfa" fill="none" strokeWidth="2.5"/>
    <circle cx="150" cy="185" r="7" fill="#a78bfa"/>
    <text x="158" y="195" fill="#c4b5fd" fontSize="9">Titik Puncak (h, k)</text>
    <line x1="150" y1="10" x2="150" y2="185" stroke="#a78bfa" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
    <circle cx="185" cy="80" r="4" fill="#86efac"/>
    <text x="188" y="78" fill="#86efac" fontSize="8">Titik lain (x₀, y₀)</text>
    <text x="8" y="22" fill="#fbbf24" fontSize="9" fontWeight="bold">Diketahui titik puncak:</text>
    <text x="8" y="35" fill="#94a3b8" fontSize="8">f(x) = a(x−h)² + k</text>
    <text x="8" y="48" fill="#94a3b8" fontSize="8">substitusi titik lain → cari a</text>
  </svg>
);

const ThreeFormsTable = () => (
  <svg width="300" height="160" viewBox="0 0 300 160" className="mx-auto">
    <rect x="5" y="5" width="290" height="150" rx="8" fill="#1e293b" stroke="#f97316" strokeWidth="1" strokeOpacity="0.4"/>
    <text x="150" y="24" fill="#fdba74" fontSize="10" fontWeight="bold" textAnchor="middle">3 Cara Menyusun Fungsi Kuadrat</text>
    {['Informasi','Rumus Awal','Langkah'].map((h,i)=>(
      <text key={i} x={35+i*90} y={42} fill="#fbbf24" fontSize="9" textAnchor="middle" fontWeight="bold">{h}</text>
    ))}
    <line x1="7" y1="46" x2="293" y2="46" stroke="#334155" strokeWidth="1"/>
    {[
      ['2 akar x₁,x₂','f=a(x−x₁)(x−x₂)','substitusi titik lain'],
      ['Puncak (h,k)','f=a(x−h)²+k','substitusi titik lain'],
      ['3 titik','ax²+bx+c=y','sistem 3 persamaan'],
    ].map((row,ri)=>(
      row.map((c,ci)=>(
        <text key={ci} x={35+ci*90} y={62+ri*28} fill={ci===0?"#f97316":ci===1?"#a78bfa":"#94a3b8"} fontSize="8" textAnchor="middle">{c}</text>
      ))
    ))}
  </svg>
);

const questions: Q[] = [
  Qn(1,"Menyusun dari 2 Akar – UN",{type:"mixed",diagram:<FromRootsSVG/>,parts:[
    {label:"a.",math:"\\text{Akar-akar } x_1=2 \\text{ dan } x_2=5, a=1 \\Rightarrow f(x)=\\ldots"},
    {label:"b.",math:"\\text{Akar-akar } x_1=-3 \\text{ dan } x_2=4, a=2 \\Rightarrow f(x)=\\ldots"},
    {label:"c.",math:"\\text{Akar-akar } x_1=0 \\text{ dan } x_2=6, a=-1 \\Rightarrow f(x)=\\ldots"},
  ]}),
  Qn(2,"Menyusun dari Titik Puncak – ANBK",{type:"mixed",diagram:<FromVertexSVG/>,parts:[
    {label:"a.",text:"Titik puncak (3, −4), a = 1. Tuliskan f(x) dalam bentuk vertex dan bentuk umum!"},
    {label:"b.",text:"Titik puncak (−2, 5), a = −1. Tuliskan f(x) dalam bentuk vertex dan bentuk umum!"},
    {label:"c.",text:"Titik puncak (1, 3), a = 2. Tuliskan f(x) dalam bentuk vertex dan bentuk umum!"},
  ]}),
  Qn(3,"Menyusun dari 3 Titik – TKA",{type:"mixed",content:"Tentukan fungsi kuadrat yang melalui tiga titik berikut:",parts:[
    {label:"a.",text:"(0, 1), (1, 0), (2, 3)"},
    {label:"b.",text:"(−1, 0), (0, −3), (1, −4)"},
    {label:"c.",text:"(0, 2), (2, 0), (4, 2)"},
  ]}),
  Qn(4,"Menyusun dari Akar dan Satu Titik – UN",{type:"mixed",parts:[
    {label:"a.",text:"Akar-akar x = 1 dan x = 5, grafik melalui (3, −4). Tentukan f(x)!"},
    {label:"b.",text:"Akar-akar x = −2 dan x = 4, grafik melalui (0, 8). Tentukan f(x)!"},
    {label:"c.",text:"Akar-akar x = 0 dan x = 3, grafik melalui (1, −4). Tentukan f(x)!"},
  ]}),
  Qn(5,"Dari Titik Puncak dan Satu Titik – ANBK",{type:"mixed",diagram:(
    <svg width="300" height="190" viewBox="0 0 300 190" className="mx-auto">
      <line x1="20" y1="130" x2="280" y2="130" stroke="#94a3b8" strokeWidth="1.2"/>
      <polygon points="280,130 274,126 274,134" fill="#94a3b8"/>
      <line x1="150" y1="185" x2="150" y2="10" stroke="#94a3b8" strokeWidth="1.2"/>
      <polygon points="150,10 146,16 154,16" fill="#94a3b8"/>
      <text x="283" y="134" fill="#94a3b8" fontSize="10">x</text>
      <text x="154" y="14" fill="#94a3b8" fontSize="10">y</text>
      <path d="M 80,30 Q 175,185 270,30" stroke="#86efac" fill="none" strokeWidth="2.5"/>
      <circle cx="175" cy="185" r="6" fill="#f97316"/>
      <text x="178" y="196" fill="#fdba74" fontSize="8">Puncak (2,−5)</text>
      <circle cx="220" cy="90" r="5" fill="#86efac"/>
      <text x="222" y="88" fill="#86efac" fontSize="8">(4, 3) titik lain</text>
      <line x1="175" y1="10" x2="175" y2="185" stroke="#f97316" strokeWidth="1" strokeDasharray="5,3" strokeOpacity="0.5"/>
      <text x="8" y="22" fill="#fbbf24" fontSize="9">Diketahui:</text>
      <text x="8" y="36" fill="#94a3b8" fontSize="8">Puncak (2, −5)</text>
      <text x="8" y="50" fill="#94a3b8" fontSize="8">Melalui titik (4, 3)</text>
    </svg>
  ),parts:[
    {label:"a.",math:"\\text{Tulis bentuk vertex: } f(x)=a(x-2)^2-5"},
    {label:"b.",math:"\\text{Substitusi } (4,3): a(4-2)^2-5=3 \\Rightarrow a=\\ldots"},
    {label:"c.",math:"\\text{Tulis } f(x) \\text{ dalam bentuk umum}"},
  ]}),
  Qn(6,"Dari Titik Potong Sumbu dan Titik Puncak – TKA",{type:"mixed",parts:[
    {label:"a.",text:"Titik potong sumbu-x di (2, 0) dan (6, 0), dan melalui (4, −4). Tentukan f(x)!"},
    {label:"b.",text:"Titik potong sumbu-x di (−1, 0) dan (3, 0), dan nilai maksimum = 4. Tentukan f(x)!"},
    {label:"c.",text:"Titik potong sumbu-x di (0, 0) dan (4, 0), dan melalui (2, −8). Tentukan f(x)!"},
  ]}),
  Qn(7,"Fungsi dengan b = 0 – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Puncak di } (0, -9) \\text{ dan melalui } (3, 0). \\text{ Fungsi simetri terhadap sumbu-y!}"},
    {label:"b.",math:"\\text{Melalui } (0, 4) \\text{ dan } (2, 0) \\text{ dengan puncak di sb-y. Tentukan } f(x)!"},
    {label:"c.",math:"\\text{Jika } b=0, \\text{ bentuk } f(x) = ax^2 + c. \\text{ Buat contoh dan gambar!}"},
  ]}),
  Qn(8,"Dari Sumbu Simetri dan Dua Titik – ANBK",{type:"mixed",parts:[
    {label:"a.",text:"Sumbu simetri x = 3, melalui (1, 5) dan (5, 5). Tentukan a dan f(x)!"},
    {label:"b.",text:"Sumbu simetri x = −1, melalui (0, 3) dan (−2, 3). Tentukan f(x)!"},
    {label:"c.",text:"Sumbu simetri x = 2, melalui (0, 0). Tentukan semua kemungkinan f(x) jika a = 1!"},
  ]}),
  Qn(9,"Sistem Persamaan 3 Variabel – TKA",{type:"mixed",content:"Diketahui grafik f(x) = ax² + bx + c melalui (0, 5), (1, 2), (2, 1).",parts:[
    {label:"a.",math:"\\text{Substitusi (0,5): } c = \\ldots"},
    {label:"b.",math:"\\text{Substitusi (1,2): } a + b + c = 2 \\Rightarrow a + b = \\ldots"},
    {label:"c.",math:"\\text{Substitusi (2,1): } 4a + 2b + c = 1 \\Rightarrow 4a + 2b = \\ldots \\Rightarrow \\text{selesaikan!}"},
  ]}),
  Qn(10,"Fungsi dari Tipe Soal UN – UN",{type:"mixed",parts:[
    {label:"a.",text:"Grafik f memotong sumbu-x di (−2, 0) dan (4, 0), dan memotong sumbu-y di (0, −16). Tentukan f(x)!"},
    {label:"b.",text:"Grafik g memiliki nilai maksimum 9 pada x = 0, dan memotong sumbu-x di (±3, 0). Tentukan g(x)!"},
    {label:"c.",text:"Grafik h memiliki titik puncak (2, 1) dan melalui (0, 5). Tentukan h(x)!"},
  ]}),
  Qn(11,"Menyusun dari Cerita Kontekstual – ANBK",{type:"mixed",content:"Lintasan bola berbentuk parabola. Bola dilempar dari titik asal (0, 0), mencapai ketinggian maksimum 10 m pada jarak 5 m secara horizontal.",parts:[
    {label:"a.",math:"\\text{Titik puncak: } (5, 10). \\text{ Tulis bentuk vertex!}"},
    {label:"b.",math:"\\text{Grafik melalui } (0, 0): a(0-5)^2+10=0 \\Rightarrow a=\\ldots"},
    {label:"c.",math:"\\text{Tulis } h(x) \\text{ dan tentukan di mana bola mendarat}"},
  ]}),
  Qn(12,"Fungsi dengan Sumbu Simetri Diketahui – TKA",{type:"mixed",diagram:<ThreeFormsTable/>,parts:[
    {label:"a.",math:"\\text{Jika sumbu simetri } x=1 \\text{ dan melalui } (0,3),(2,3). \\text{ Tentukan } f(x)!"},
    {label:"b.",math:"\\text{Jika sumbu simetri } x=-2 \\text{ dan melalui } (-2,5),(0,1). \\text{ Tentukan } f(x)!"},
    {label:"c.",text:"Metode mana yang digunakan pada setiap soal di atas? Jelaskan!"},
  ]}),
  Qn(13,"Fungsi dari Dua Akar dan Nilai a – UN",{type:"mixed",parts:[
    {label:"a.",math:"x_1 = -1, x_2 = 3, a = 2 \\Rightarrow f(x) = 2(x+1)(x-3) = \\ldots"},
    {label:"b.",math:"x_1 = \\frac{1}{2}, x_2 = -2, a = 4 \\Rightarrow f(x) = \\ldots"},
    {label:"c.",math:"x_1 = x_2 = 4 \\text{ (akar kembar)}, a = 3 \\Rightarrow f(x) = \\ldots"},
  ]}),
  Qn(14,"Dari Nilai Fungsi di 3 Titik – ANBK",{type:"mixed",content:"f(0) = 3, f(1) = 0, f(3) = 0.",parts:[
    {label:"a.",text:"Dari f(1) = 0 dan f(3) = 0, tentukan akar-akar fungsi."},
    {label:"b.",math:"f(x) = a(x-1)(x-3). \\text{ Substitusi } f(0)=3 \\text{ untuk mencari } a"},
    {label:"c.",math:"\\text{Tulis } f(x) \\text{ dalam bentuk umum}"},
  ]}),
  Qn(15,"Fungsi Simetri dan Perkalian Akar – TKA",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Jika } x_1 + x_2 = 4 \\text{ dan } x_1 \\cdot x_2 = 3, a=1. \\text{ Tentukan } f(x)!"},
    {label:"b.",math:"\\text{Jika } x_1 + x_2 = -2 \\text{ dan } x_1 \\cdot x_2 = -8, a=1. \\text{ Tentukan } f(x)!"},
    {label:"c.",math:"\\text{Hubungan: } f(x) = a[x^2 - (x_1+x_2)x + x_1 x_2]. \\text{ Tunjukkan!}"},
  ]}),
  Qn(16,"Dari Nilai Puncak dan Akar Kembar – UN",{type:"mixed",parts:[
    {label:"a.",text:"Grafik hanya menyentuh sumbu-x di (3, 0) dan melalui (5, 8). Tentukan f(x)!"},
    {label:"b.",text:"Grafik hanya menyentuh sumbu-x di (−1, 0) dan nilai puncak = 0, melalui (1, 4). Tentukan f(x)!"},
    {label:"c.",math:"\\text{Akar kembar berarti } D = 0. \\text{ Tunjukkan bahwa D=0 untuk soal (a)!}"},
  ]}),
  Qn(17,"Menyusun f(x) dengan a = −1 – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"x_1 = 1, x_2 = 7, a=-1 \\Rightarrow f(x) = \\ldots"},
    {label:"b.",math:"\\text{Puncak } (4, 9), a = -1 \\Rightarrow f(x) = \\ldots"},
    {label:"c.",math:"\\text{Melalui } (0,7), (7,0), a=-1 \\Rightarrow \\text{tentukan } x_2!"},
  ]}),
  Qn(18,"Fungsi dari 2 Titik dan c – TKA",{type:"mixed",content:"Grafik f(x) = ax² + bx + c melalui (0, −6), (−1, 0), dan (3, 0).",parts:[
    {label:"a.",math:"\\text{Dari (0,−6): } c = \\ldots"},
    {label:"b.",math:"\\text{Akar di } x=-1 \\text{ dan } x=3 \\Rightarrow f(x) = a(x+1)(x-3)"},
    {label:"c.",math:"\\text{Substitusi } f(0)=-6 \\Rightarrow a=\\ldots. \\text{ Tulis } f(x)!"},
  ]}),
  Qn(19,"Soal UN – Fungsi dari Grafik",{type:"mixed",diagram:(
    <svg width="300" height="195" viewBox="0 0 300 195" className="mx-auto">
      <line x1="20" y1="120" x2="280" y2="120" stroke="#94a3b8" strokeWidth="1.2"/>
      <polygon points="280,120 274,116 274,124" fill="#94a3b8"/>
      <line x1="150" y1="185" x2="150" y2="10" stroke="#94a3b8" strokeWidth="1.2"/>
      <polygon points="150,10 146,16 154,16" fill="#94a3b8"/>
      <path d="M 75,30 Q 175,185 275,30" stroke="#f97316" fill="none" strokeWidth="2.5"/>
      <circle cx="75" cy="120" r="5" fill="#86efac"/>
      <circle cx="275" cy="120" r="5" fill="#86efac"/>
      <circle cx="175" cy="185" r="5" fill="#f97316"/>
      <circle cx="150" cy="50" r="4" fill="#f472b6"/>
      <text x="55" y="116" fill="#86efac" fontSize="8">(−2,0)</text>
      <text x="257" y="116" fill="#86efac" fontSize="8">(6,0)</text>
      <text x="178" y="195" fill="#fdba74" fontSize="8">Puncak</text>
      <text x="155" y="48" fill="#f472b6" fontSize="8">(0,c)</text>
      <text x="8" y="18" fill="#fbbf24" fontSize="9">Baca titik dari grafik!</text>
    </svg>
  ),parts:[
    {label:"a.",text:"Baca titik potong sumbu-x dari grafik."},
    {label:"b.",math:"\\text{Tentukan } f(x) = a(x+2)(x-6). \\text{ Substitusi } f(0) \\text{ untuk mencari } a!"},
    {label:"c.",math:"\\text{Tulis } f(x) \\text{ dalam bentuk umum dan hitung titik puncak}"},
  ]}),
  Qn(20,"Fungsi dari Sumbu Simetri dan c – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Sumbu simetri } x=3, c=5, a=1 \\Rightarrow b=-2a \\cdot 3=-6. \\text{ Jadi } f(x)=\\ldots"},
    {label:"b.",math:"\\text{Sumbu simetri } x=-1, c=-3, a=2 \\Rightarrow b=\\ldots. \\text{ Jadi } f(x)=\\ldots"},
    {label:"c.",math:"\\text{Sumbu simetri } x=0 \\Rightarrow b=0. \\text{ Jika } c=4, a=-1, f(x)=\\ldots"},
  ]}),
  Qn(21,"HOTS – Fungsi dari Sifat Khusus – ANBK",{type:"mixed",parts:[
    {label:"a.",text:"Nilai minimum f adalah 0, sumbu simetri x = 2, dan f(0) = 4. Tentukan f(x)!"},
    {label:"b.",text:"f(2) = f(6) dan f(0) = 3, f(4) = −5. Tentukan f(x)!"},
    {label:"c.",text:"f melalui (0, 0) dan (4, 0), dan nilai puncak = −4. Tentukan f(x)!"},
  ]}),
  Qn(22,"Menyusun dari Nilai Integral (HOTS) – TKA",{type:"mixed",parts:[
    {label:"a.",math:"\\text{f(1)+f(−1)=10 dan f(2)=7 dan } a=1. \\text{ Tentukan } f(x)!"},
    {label:"b.",math:"\\text{f(0)+f(4)=6, sumbu simetri } x=2, a=1. \\text{ Tentukan } f(x)!"},
    {label:"c.",math:"\\text{f(1)−f(−1)=4 dan } a=1, c=0. \\text{ Tentukan } b!"},
  ]}),
  Qn(23,"Fungsi Kuadrat Positif Definit – UN",{type:"mixed",content:"Fungsi f(x) = ax² + bx + c selalu positif berarti D < 0 dan a > 0.",parts:[
    {label:"a.",math:"f(x) = x^2 + bx + 9 \\text{ selalu positif. Syarat } b?"},
    {label:"b.",math:"f(x) = 2x^2 + bx + 2 \\text{ selalu positif. Syarat } b?"},
    {label:"c.",text:"Buat satu contoh fungsi kuadrat yang selalu positif untuk semua nilai x!"},
  ]}),
  Qn(24,"Menyusun dari Selisih dan Jumlah Akar – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"x_1 + x_2 = 7, x_1 - x_2 = 3 \\Rightarrow x_1=\\ldots, x_2=\\ldots. \\text{ Susun } f(x)!"},
    {label:"b.",math:"x_1 + x_2 = -2, x_1 x_2 = -8 \\Rightarrow \\text{susun } f(x) \\text{ dengan } a=1"},
    {label:"c.",math:"x_1 - x_2 = 2, x_1 x_2 = 3 \\Rightarrow x_1+x_2=\\ldots. \\text{ Susun } f(x)!"},
  ]}),
  Qn(25,"Fungsi dari Titik Potong dan Nilai Tertentu – TKA",{type:"mixed",parts:[
    {label:"a.",text:"Grafik memotong sumbu-x di (1, 0) dan (5, 0), dan f(2) = −6. Tentukan f(x)!"},
    {label:"b.",text:"Grafik memotong sumbu-x di (0, 0) dan (4, 0), dan f(1) = 3. Tentukan f(x)!"},
    {label:"c.",text:"Grafik memotong sumbu-x di (−3, 0) dan (3, 0), dan f(0) = −9. Tentukan f(x)!"},
  ]}),
  Qn(26,"Fungsi Kuadrat Setara – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Buktikan } f(x)=2(x-1)(x-5) \\text{ setara dengan } f(x)=2x^2-12x+10"},
    {label:"b.",math:"\\text{Buktikan } g(x)=3(x-2)^2-3 \\text{ setara dengan } g(x)=3x^2-12x+9"},
    {label:"c.",math:"\\text{Tulis } h(x)=-x^2+6x-5 \\text{ dalam 3 bentuk: umum, vertex, dan faktor}"},
  ]}),
  Qn(27,"Menyusun Fungsi Cerminan – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Jika } f(x)=x^2-4x+3, \\text{ tentukan } g(x) = f(-x)"},
    {label:"b.",math:"\\text{Tentukan } h(x) = -f(x) \\text{ jika } f(x)=x^2-4x+3"},
    {label:"c.",text:"Gambarkan ketiga fungsi f, g, dan h pada satu bidang koordinat!"},
  ]}),
  Qn(28,"Fungsi dari Data Konteks – TKA",{type:"mixed",content:"Keuntungan toko (ribu rupiah) dinyatakan sebagai fungsi kuadrat dari jumlah barang yang terjual (x). Diketahui: saat x = 0, keuntungan = −10; saat x = 5, keuntungan = 15; saat x = 10, keuntungan = 10.",parts:[
    {label:"a.",text:"Substitusi tiga titik untuk membuat sistem persamaan."},
    {label:"b.",text:"Selesaikan sistem persamaan untuk mencari a, b, c."},
    {label:"c.",text:"Tulis fungsi keuntungan K(x) dan tentukan jumlah optimal!"},
  ]}),
  Qn(29,"Fungsi Simetri terhadap Titik Tertentu – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Fungsi } f(x) = x^2 - 6x + 5. \\text{ Titik } (3, f(3)) \\text{ adalah pusat simetri?}"},
    {label:"b.",math:"\\text{Tentukan fungsi simetrisnya: } g(x) = 2f(3) - f(6-x)"},
    {label:"c.",text:"Apa artinya dua fungsi simetris secara geometris?"},
  ]}),
  Qn(30,"Menyusun dari Jarak Akar – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Dua akar berjarak 4, jumlah akar = 2, } a=1. \\text{ Tentukan } f(x)!"},
    {label:"b.",math:"\\text{Dua akar berjarak 6, keduanya positif, hasil kali akar = 8. Tentukan } f(x)!"},
    {label:"c.",math:"\\text{Dua akar berlawanan tanda, } |x_1|=|x_2|=3, a=-2. \\text{ Tentukan } f(x)!"},
  ]}),
  Qn(31,"Fungsi Kuadrat dari Persamaan Garis – TKA",{type:"mixed",content:"Sebuah garis y = mx + n menyinggung grafik f(x) = x² + bx + c di satu titik.",parts:[
    {label:"a.",math:"\\text{Garis } y=4 \\text{ menyinggung } f(x)=x^2-4x+c. \\text{ Cari } c!"},
    {label:"b.",math:"\\text{Garis } y=2x-1 \\text{ menyinggung } f(x)=x^2+bx+3. \\text{ Cari } b!"},
    {label:"c.",text:"Syarat agar garis y = mx + n menyinggung parabola adalah D = 0. Jelaskan!"},
  ]}),
  Qn(32,"Fungsi dari Dua Fungsi yang Berpotongan – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 \\text{ dan } g(x) = 4x. \\text{ Di titik mana keduanya berpotongan?}"},
    {label:"b.",math:"\\text{Fungsi } h(x) = f(x) - g(x). \\text{ Apakah } h \\text{ adalah fungsi kuadrat?}"},
    {label:"c.",math:"\\text{Selesaikan } x^2 - 4x = 0 \\Rightarrow x = \\ldots"},
  ]}),
  Qn(33,"HOTS – Fungsi dari Sifat Simetri – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(2) = f(8) \\text{ dan } f(0) = 5 \\text{ dan } f(5) = -4. \\text{ Tentukan } f(x)!"},
    {label:"b.",math:"f(-1) = f(3) \\text{ dan } f(0) = 0. \\text{ Tentukan } f(x) \\text{ dengan } a=1!"},
    {label:"c.",text:"Gunakan sifat simetri untuk menentukan sumbu simetri dari soal (a) dan (b)."},
  ]}),
  Qn(34,"Fungsi Kuadrat dan Aritmetika – TKA",{type:"mixed",content:"Diketahui f(n) = an² + bn + c adalah fungsi kuadrat dalam n. Nilai f(1) = 3, f(2) = 8, f(3) = 15.",parts:[
    {label:"a.",text:"Buat sistem persamaan dari ketiga nilai tersebut."},
    {label:"b.",text:"Selesaikan untuk mencari a, b, c."},
    {label:"c.",math:"\\text{Hitung } f(10) \\text{ menggunakan fungsi yang diperoleh}"},
  ]}),
  Qn(35,"Menyusun Fungsi dengan Pembatas – UN",{type:"mixed",parts:[
    {label:"a.",text:"Fungsi kuadrat dengan a = 1, akar terbesar = 5, dan hasil kali akar = 6. Tentukan f(x)!"},
    {label:"b.",text:"Fungsi kuadrat dengan a = −1, nilai puncak = 9, dan satu akar = 6. Tentukan f(x)!"},
    {label:"c.",text:"Fungsi kuadrat dengan a = 2 yang selalu di atas garis y = 3. Buat satu contoh!"},
  ]}),
  Qn(36,"Fungsi dari Perpotongan Dua Kurva – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = ax^2 + c \\text{ dan } g(x) = k \\text{ berpotongan di } (2,7) \\text{ dan } (-2,7). \\text{ Cari } a,c!"},
    {label:"b.",math:"h(x) = x^2 - 4 \\text{ dan garis } y = m \\text{ berpotongan di tepat 1 titik. Nilai } m?"},
    {label:"c.",text:"Apa syarat agar parabola dan garis horizontal y = k berpotongan di 2 titik?"},
  ]}),
  Qn(37,"Rekonstruksi Fungsi dari Grafik Cerminan – TKA",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Grafik } g(x) = f(x+3) \\text{ dimana } f(x)=x^2-4. \\text{ Tentukan } g(x)!"},
    {label:"b.",math:"\\text{Grafik } h(x) = f(x) + 5 \\text{ dimana } f(x)=x^2-4. \\text{ Tentukan } h(x)!"},
    {label:"c.",text:"Jelaskan perbedaan geseran horizontal dan vertikal dari grafik f(x)!"},
  ]}),
  Qn(38,"HOTS – Fungsi dari Persamaan Diferensial Sederhana – ANBK",{type:"mixed",content:"Diketahui f(x) = ax² + bx + c, f'(x) = 2ax + b (turunan pertama).",parts:[
    {label:"a.",math:"\\text{Jika } f'(2) = 0, \\text{ maka sumbu simetri di } x = \\ldots \\Rightarrow -b/(2a) = 2"},
    {label:"b.",math:"\\text{Jika } f'(0) = 4 \\text{ dan } f(0) = 1 \\text{ dan } a=1, \\text{ tentukan } f(x)"},
    {label:"c.",text:"Apa hubungan antara turunan fungsi kuadrat di titik puncak dengan nilai 0?"},
  ]}),
  Qn(39,"Fungsi dari 3 Kondisi – UN/TKA",{type:"mixed",parts:[
    {label:"a.",text:"Grafik memotong sumbu-y di (0, 8), memotong sumbu-x di x = 2 dan x = 4. Tentukan f(x)!"},
    {label:"b.",text:"Grafik memiliki titik puncak (1, −3), memotong sumbu-y di (0, −2). Tentukan f(x)!"},
    {label:"c.",text:"Grafik memiliki nilai minimum −1 di x = 0, dan f(2) = 3. Tentukan f(x)!"},
  ]}),
  Qn(40,"HOTS – Fungsi Kuadrat dari Nilai Rasio – UN/TKA",{type:"mixed",content:"Diketahui f(x) = ax² + bx + c. Rasio f(1) : f(2) : f(3) = 2 : 3 : 6 dan f(0) = 2.",parts:[
    {label:"a.",text:"Nyatakan f(1), f(2), f(3) dalam a, b, c."},
    {label:"b.",text:"Buat persamaan dari rasio yang diberikan."},
    {label:"c.",text:"Selesaikan sistem persamaan dan tulis f(x)!"},
  ]}),
];

const MenyusunFungsiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🔧</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1" style={{textShadow:'0 0 20px rgba(249,115,22,0.7)'}}>
            MENYUSUN FUNGSI KUADRAT
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Fungsi Kuadrat · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-3">📐 Metode Menyusun</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              {name:"Dari 2 Akar", math:"f(x)=a(x-x_1)(x-x_2)"},
              {name:"Dari Titik Puncak", math:"f(x)=a(x-h)^2+k"},
              {name:"Dari 3 Titik", math:"\\text{Sistem 3 persamaan: }a,b,c"},
              {name:"Hubungan Akar", math:"x_1+x_2=-\\frac{b}{a},\\; x_1x_2=\\frac{c}{a}"},
            ].map(r=>(
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-orange-300 text-xs overflow-x-auto"><InlineMath math={r.math}/></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q,i)=>(
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{animationDelay:`${i*0.02}s`}}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-red-900/30 backdrop-blur"/>
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl"/>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-red-500 rounded-l-2xl"/>
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center shrink-0">
                    <span className="text-orange-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-orange-900/20 border border-orange-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent}/></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p,pi)=>(
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-orange-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-orange-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Fungsi Kuadrat
          </button>
        </div>
      </div>
    </div>
  );
};
export default MenyusunFungsiPage;
