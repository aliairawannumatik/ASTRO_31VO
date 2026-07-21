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

const Axes = ({ w = 300, h = 200, ox = 150, oy = 130, label = "" }) => (
  <g>
    <line x1={20} y1={oy} x2={w - 10} y2={oy} stroke="#94a3b8" strokeWidth="1.2" />
    <polygon points={`${w - 10},${oy} ${w - 16},${oy - 4} ${w - 16},${oy + 4}`} fill="#94a3b8" />
    <line x1={ox} y1={h - 10} x2={ox} y2={10} stroke="#94a3b8" strokeWidth="1.2" />
    <polygon points={`${ox},10 ${ox - 4},16 ${ox + 4},16`} fill="#94a3b8" />
    <text x={w - 8} y={oy + 12} fill="#94a3b8" fontSize="10">x</text>
    <text x={ox + 5} y={14} fill="#94a3b8" fontSize="10">y</text>
    <text x={ox + 4} y={oy + 12} fill="#94a3b8" fontSize="9">O</text>
    {label && <text x={10} y={20} fill="#fbbf24" fontSize="9">{label}</text>}
  </g>
);

const ParabolaUp = () => (
  <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
    <Axes ox={150} oy={130} />
    <path d="M 60,50 Q 150,180 240,50" stroke="#f59e0b" fill="none" strokeWidth="2.5" />
    <circle cx="150" cy="175" r="4" fill="#f59e0b" />
    <text x="158" y="185" fill="#fcd34d" fontSize="9">Titik Puncak (min)</text>
    <text x="58" y="44" fill="#fcd34d" fontSize="8">a &gt; 0</text>
    <text x="228" y="44" fill="#fcd34d" fontSize="8">a &gt; 0</text>
    <text x="10" y="18" fill="#f59e0b" fontSize="10" fontWeight="bold">a &gt; 0 → Terbuka ke Atas</text>
    {[-2,-1,1,2].map(x => <line key={x} x1={150+x*30} y1={128} x2={150+x*30} y2={132} stroke="#475569" strokeWidth="1"/>)}
    {[-2,-1,1,2].map(x => <text key={x} x={150+x*30-3} y={142} fill="#64748b" fontSize="8">{x}</text>)}
  </svg>
);

const ParabolaDown = () => (
  <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
    <Axes ox={150} oy={130} />
    <path d="M 60,170 Q 150,20 240,170" stroke="#f97316" fill="none" strokeWidth="2.5" />
    <circle cx="150" cy="25" r="4" fill="#f97316" />
    <text x="158" y="22" fill="#fdba74" fontSize="9">Titik Puncak (maks)</text>
    <text x="10" y="18" fill="#f97316" fontSize="10" fontWeight="bold">a &lt; 0 → Terbuka ke Bawah</text>
    {[-2,-1,1,2].map(x => <line key={x} x1={150+x*30} y1={128} x2={150+x*30} y2={132} stroke="#475569" strokeWidth="1"/>)}
    {[-2,-1,1,2].map(x => <text key={x} x={150+x*30-3} y={142} fill="#64748b" fontSize="8">{x}</text>)}
  </svg>
);

const ParabolaWidth = () => (
  <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
    <Axes ox={150} oy={150} />
    <path d="M 90,30 Q 150,180 210,30" stroke="#f59e0b" fill="none" strokeWidth="2" strokeDasharray="none"/>
    <path d="M 60,30 Q 150,200 240,30" stroke="#86efac" fill="none" strokeWidth="2"/>
    <path d="M 110,30 Q 150,160 190,30" stroke="#f472b6" fill="none" strokeWidth="2"/>
    <text x="10" y="16" fill="#fcd34d" fontSize="8">— a=1 (normal)</text>
    <text x="10" y="28" fill="#86efac" fontSize="8">— a=½ (lebar)</text>
    <text x="10" y="40" fill="#f472b6" fontSize="8">— a=2 (sempit)</text>
    <text x="155" y="14" fill="#94a3b8" fontSize="9" fontWeight="bold">|a| besar → sempit</text>
    <text x="155" y="26" fill="#94a3b8" fontSize="9">|a| kecil → lebar</text>
  </svg>
);

const FourGraphs = () => (
  <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
    {[0,1,2,3].map(i => {
      const cx = 50 + (i%2)*150, cy = 50 + Math.floor(i/2)*100;
      const up = i < 2;
      return (
        <g key={i}>
          <rect x={cx-45} y={cy-42} width="90" height="84" rx="5" fill="var(--card)" stroke="var(--border)" strokeWidth="1"/>
          <line x1={cx-40} y1={cy} x2={cx+40} y2={cy} stroke="#475569" strokeWidth="0.8"/>
          <line x1={cx} y1={cy-38} x2={cx} y2={cy+38} stroke="#475569" strokeWidth="0.8"/>
          {up
            ? <path d={`M ${cx-35},${cy-25} Q ${cx},${cy+35} ${cx+35},${cy-25}`} stroke="#f59e0b" fill="none" strokeWidth="2"/>
            : <path d={`M ${cx-35},${cy+25} Q ${cx},${cy-35} ${cx+35},${cy+25}`} stroke="#f97316" fill="none" strokeWidth="2"/>}
          <text x={cx} y={cy+46} fill="#94a3b8" fontSize="8" textAnchor="middle">{['a&gt;0,c&gt;0','a&gt;0,c&lt;0','a&lt;0,c&gt;0','a&lt;0,c&lt;0'][i]}</text>
        </g>
      );
    })}
    <text x="150" y="12" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">Kenali Karakteristik Grafik</text>
  </svg>
);

const TableFunctionValues = () => (
  <svg width="300" height="130" viewBox="0 0 300 130" className="mx-auto">
    <rect x="10" y="10" width="280" height="110" rx="8" fill="var(--card)" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.4"/>
    <text x="150" y="28" fill="#fcd34d" fontSize="10" fontWeight="bold" textAnchor="middle">f(x) = x² − 2x − 3</text>
    {['x','−2','−1','0','1','2','3','4'].map((v,i) => (
      <text key={i} x={22+i*37} y={50} fill={i===0?"#fbbf24":"#94a3b8"} fontSize="9" textAnchor="middle">{v}</text>
    ))}
    <line x1="12" y1="55" x2="288" y2="55" stroke="var(--border)" strokeWidth="1"/>
    {['f(x)','5','0','−3','−4','−3','0','5'].map((v,i) => (
      <text key={i} x={22+i*37} y={75} fill={i===0?"#fbbf24":v==='0'?"#86efac":v.includes('−')?"#f472b6":"#e2e8f0"} fontSize="9" textAnchor="middle">{v}</text>
    ))}
    <line x1="12" y1="80" x2="288" y2="80" stroke="var(--border)" strokeWidth="1"/>
    <text x="150" y="100" fill="#94a3b8" fontSize="8" textAnchor="middle">Nilai negatif → terbuka ke atas dengan c = −3</text>
    <text x="150" y="115" fill="#fbbf24" fontSize="8" textAnchor="middle">a = 1 &gt; 0, c = −3, b = −2</text>
  </svg>
);

const CharacterTable = () => (
  <svg width="300" height="150" viewBox="0 0 300 150" className="mx-auto">
    <rect x="5" y="5" width="290" height="140" rx="8" fill="var(--card)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4"/>
    {['Nilai a','Arah Buka','Titik Puncak','Domain','Range'].map((h,i) => (
      <text key={i} x={55+i*47} y={24} fill="#fbbf24" fontSize="8" textAnchor="middle" fontWeight="bold">{h}</text>
    ))}
    <line x1="7" y1="28" x2="293" y2="28" stroke="var(--border)" strokeWidth="1"/>
    {[
      ['a > 0','Ke atas','Minimum','ℝ','[y_min,∞)'],
      ['a < 0','Ke bawah','Maksimum','ℝ','(−∞,y_maks]'],
    ].map((row,ri) => (
      <g key={ri}>
        {row.map((cell,ci) => (
          <text key={ci} x={55+ci*47} y={50+ri*30} fill={ci===0?"#f59e0b":ci===2?"#86efac":"#94a3b8"} fontSize="8" textAnchor="middle">{cell}</text>
        ))}
      </g>
    ))}
    <text x="150" y="115" fill="#64748b" fontSize="8" textAnchor="middle">Domain fungsi kuadrat selalu ℝ (semua bilangan real)</text>
    <text x="150" y="130" fill="#64748b" fontSize="8" textAnchor="middle">Range bergantung pada nilai a dan titik puncak</text>
  </svg>
);

const ShiftSVG = () => (
  <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
    <Axes ox={150} oy={130} />
    <path d="M 90,30 Q 150,160 210,30" stroke="#a78bfa" fill="none" strokeWidth="2" />
    <path d="M 90,50 Q 150,180 210,50" stroke="#f59e0b" fill="none" strokeWidth="2" />
    <path d="M 90,10 Q 150,140 210,10" stroke="#86efac" fill="none" strokeWidth="2" />
    <text x="212" y="53" fill="#f59e0b" fontSize="8">c=0</text>
    <text x="212" y="33" fill="#86efac" fontSize="8">c&gt;0 (geser naik)</text>
    <text x="212" y="73" fill="#a78bfa" fontSize="8">c&lt;0 (geser turun)</text>
    <text x="150" y="18" fill="#94a3b8" fontSize="9" textAnchor="middle">Pengaruh nilai c terhadap posisi grafik</text>
  </svg>
);

const questions: Q[] = [
  Qn(1,"Identifikasi Fungsi Kuadrat – UN",{type:"mixed",diagram:<FourGraphs/>,content:"Dari keempat grafik di atas, tentukan:",parts:[
    {label:"a.",text:"Grafik mana yang memiliki a > 0 dan c > 0?"},
    {label:"b.",text:"Grafik mana yang memiliki a < 0?"},
    {label:"c.",text:"Jelaskan perbedaan grafik membuka ke atas dan ke bawah!"},
  ]}),
  Qn(2,"Bentuk Umum Fungsi Kuadrat – UN",{type:"mixed",diagram:<ParabolaUp/>,parts:[
    {label:"a.",math:"\\text{Nyatakan bentuk umum fungsi kuadrat } f(x) = ax^2 + bx + c, \\; a \\neq 0"},
    {label:"b.",math:"\\text{Tentukan } a, b, c \\text{ dari } f(x) = 3x^2 - 5x + 2"},
    {label:"c.",math:"\\text{Apakah } g(x) = 5x - 2 \\text{ merupakan fungsi kuadrat? Jelaskan!}"},
  ]}),
  Qn(3,"Arah Pembukaan Parabola – ANBK",{type:"mixed",diagram:<ParabolaDown/>,parts:[
    {label:"a.",math:"f(x) = -2x^2 + 4x - 1 \\Rightarrow \\text{ arah buka?}"},
    {label:"b.",math:"g(x) = \\frac{1}{3}x^2 - x + 5 \\Rightarrow \\text{ arah buka?}"},
    {label:"c.",text:"Jika parabola membuka ke bawah, apakah fungsinya memiliki nilai maksimum atau minimum?"},
  ]}),
  Qn(4,"Nilai a, b, c – TKA",{type:"mixed",diagram:<TableFunctionValues/>,parts:[
    {label:"a.",math:"f(x) = x^2 - 2x - 3 \\Rightarrow a=\\ldots, b=\\ldots, c=\\ldots"},
    {label:"b.",math:"\\text{Hitung } f(0), f(1), f(-1) \\text{ dari } f(x) = x^2-2x-3"},
    {label:"c.",math:"\\text{Untuk nilai } x \\text{ berapa } f(x) = 0?"},
  ]}),
  Qn(5,"Karakteristik Berdasarkan a – UN",{type:"mixed",diagram:<CharacterTable/>,parts:[
    {label:"a.",text:"Jika a > 0, apakah fungsi memiliki nilai minimum atau maksimum?"},
    {label:"b.",text:"Jika a < 0, bagaimana bentuk parabolanya?"},
    {label:"c.",math:"\\text{Tentukan karakteristik } f(x) = -4x^2 + 8x - 3"},
  ]}),
  Qn(6,"Lebar Parabola – ANBK",{type:"mixed",diagram:<ParabolaWidth/>,parts:[
    {label:"a.",text:"Dari gambar, parabola mana yang paling lebar? Mengapa?"},
    {label:"b.",math:"\\text{Bandingkan lebar } f(x)=\\frac{1}{4}x^2 \\text{ dan } g(x)=4x^2"},
    {label:"c.",text:"Apa hubungan antara nilai |a| dengan lebar/sempitnya parabola?"},
  ]}),
  Qn(7,"Pengaruh c pada Grafik – TKA",{type:"mixed",diagram:<ShiftSVG/>,parts:[
    {label:"a.",text:"Apa yang terjadi pada grafik jika nilai c diperbesar?"},
    {label:"b.",math:"\\text{Berapa nilai } f(0) \\text{ dari } f(x) = 3x^2 - 7x + 4?"},
    {label:"c.",math:"\\text{Jika grafik } y=x^2 \\text{ digeser ke atas 3 satuan, tuliskan persamaannya}"},
  ]}),
  Qn(8,"Menentukan a dari Grafik – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Grafik } f(x) = ax^2 \\text{ melalui titik } (2, 12). \\text{ Tentukan } a!"},
    {label:"b.",math:"\\text{Grafik } g(x) = ax^2 \\text{ melalui titik } (-3, -18). \\text{ Tentukan } a!"},
    {label:"c.",math:"\\text{Dari } a \\text{ yang diperoleh, apakah parabola terbuka ke atas atau bawah?}"},
  ]}),
  Qn(9,"Domain dan Range – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Tentukan domain dari } f(x) = 2x^2 - x + 3"},
    {label:"b.",math:"\\text{Jika titik puncak } f(x) = x^2 - 4x + 1 \\text{ adalah } (2,-3), \\text{ tentukan range-nya}"},
    {label:"c.",math:"\\text{Range dari } f(x) = -(x-1)^2 + 5 \\text{ adalah } \\ldots"},
  ]}),
  Qn(10,"Identifikasi Persamaan – TKA",{type:"mixed",content:"Tentukan mana yang merupakan fungsi kuadrat:",parts:[
    {label:"a.",math:"f(x) = x^2 - 4"},
    {label:"b.",math:"g(x) = \\frac{1}{x^2} + 3"},
    {label:"c.",math:"h(x) = (x+2)^2 - (x-1)^2"},
  ]}),
  Qn(11,"Mengubah ke Bentuk Umum – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = (x-3)^2 + 5"},
    {label:"b.",math:"g(x) = 2(x+1)(x-4)"},
    {label:"c.",math:"h(x) = 3x(x-2) - (x+1)^2"},
  ]}),
  Qn(12,"Nilai Fungsi – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = 2x^2 - 3x + 1, \\; f(2) = \\ldots"},
    {label:"b.",math:"g(x) = -x^2 + 4x - 4, \\; g(-1) = \\ldots"},
    {label:"c.",math:"h(x) = x^2 + 2x - 8, \\; h(3) = \\ldots"},
  ]}),
  Qn(13,"Koefisien dan Konstanta – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = -3x^2 + 7x - 2 \\Rightarrow a+b+c = \\ldots"},
    {label:"b.",math:"g(x) = (2x-1)(x+3) \\Rightarrow \\text{tentukan } a, b, c"},
    {label:"c.",math:"h(x) = 5 - 2x - x^2 \\Rightarrow \\text{tentukan } a, b, c"},
  ]}),
  Qn(14,"Nilai x yang Membuat f(x)=0 – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 9 = 0 \\Rightarrow x = \\ldots"},
    {label:"b.",math:"g(x) = x^2 - x - 6 = 0 \\Rightarrow x = \\ldots"},
    {label:"c.",math:"h(x) = 4x^2 - 1 = 0 \\Rightarrow x = \\ldots"},
  ]}),
  Qn(15,"Karakteristik Pembeda – UN",{type:"mixed",content:"Bandingkan f(x) = x² dan g(x) = −x²:",parts:[
    {label:"a.",text:"Apa persamaan dan perbedaan kedua fungsi?"},
    {label:"b.",math:"f(0) = \\ldots \\quad g(0) = \\ldots"},
    {label:"c.",text:"Manakah yang memiliki nilai minimum? Manakah yang memiliki nilai maksimum?"},
  ]}),
  Qn(16,"Range dengan Titik Puncak – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = (x-2)^2 - 7 \\Rightarrow \\text{range} = \\ldots"},
    {label:"b.",math:"g(x) = -(x+1)^2 + 9 \\Rightarrow \\text{range} = \\ldots"},
    {label:"c.",math:"h(x) = 3(x-4)^2 + 2 \\Rightarrow \\text{nilai minimum} = \\ldots"},
  ]}),
  Qn(17,"Fungsi Kuadrat Khusus – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 \\text{ (tidak punya b dan c, tentukan karakteristiknya)}"},
    {label:"b.",math:"g(x) = -5x^2 \\text{ (tentukan arah buka, nilai puncak)}"},
    {label:"c.",math:"h(x) = x^2 - 16 \\text{ (a=?, b=?, c=?)}"},
  ]}),
  Qn(18,"Tabel Nilai Fungsi – UN",{type:"mixed",content:"Lengkapi tabel nilai f(x) = x² − 4x + 3:",diagram:(
    <svg width="300" height="110" viewBox="0 0 300 110" className="mx-auto">
      <rect x="5" y="5" width="290" height="100" rx="8" fill="var(--card)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4"/>
      {['x','−1','0','1','2','3','4','5'].map((v,i)=>(
        <text key={i} x={22+i*37} y={30} fill={i===0?"#fbbf24":"#94a3b8"} fontSize="9" textAnchor="middle">{v}</text>
      ))}
      <line x1="7" y1="35" x2="293" y2="35" stroke="var(--border)" strokeWidth="1"/>
      {['f(x)','...','3','0','−1','0','3','...'].map((v,i)=>(
        <text key={i} x={22+i*37} y={60} fill={i===0?"#fbbf24":v==='...'?"#f472b6":v==='0'?"#86efac":"#e2e8f0"} fontSize="9" textAnchor="middle">{v}</text>
      ))}
      <line x1="7" y1="65" x2="293" y2="65" stroke="var(--border)" strokeWidth="1"/>
      <text x="150" y="85" fill="#64748b" fontSize="8" textAnchor="middle">Isi yang kosong (nilai merah) dengan benar!</text>
      <text x="150" y="100" fill="#fbbf24" fontSize="8" textAnchor="middle">f(x) = x² − 4x + 3</text>
    </svg>
  ),parts:[
    {label:"a.",math:"f(-1) = \\ldots \\quad f(5) = \\ldots"},
    {label:"b.",math:"\\text{Nilai } x \\text{ saat } f(x) = 0 \\text{ adalah } \\ldots"},
    {label:"c.",text:"Apa yang terjadi pada nilai f(x) saat x < 1 dan x > 3?"},
  ]}),
  Qn(19,"Sifat Simetri Fungsi Kuadrat – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Jika } f(1)=f(5), \\text{ tentukan sumbu simetri grafik } f"},
    {label:"b.",math:"f(x) = x^2 - 6x + 5, \\; f(1) = \\ldots \\; f(5) = \\ldots"},
    {label:"c.",text:"Mengapa fungsi kuadrat memiliki simetri terhadap suatu garis vertikal?"},
  ]}),
  Qn(20,"Analisis Tanda a – TKA",{type:"mixed",content:"Tanpa menghitung titik puncak, tentukan apakah setiap fungsi berikut memiliki nilai minimum atau maksimum:",parts:[
    {label:"a.",math:"f(x) = 7x^2 - 3x + 1"},
    {label:"b.",math:"g(x) = -\\frac{2}{3}x^2 + 4x"},
    {label:"c.",math:"h(x) = -(x+2)^2"},
  ]}),
  Qn(21,"Grafik Berpotongan Sumbu y – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Grafik } f(x) = 3x^2 - 7x + 4 \\text{ memotong sumbu-y di titik}?"},
    {label:"b.",math:"\\text{Grafik } g(x) = -x^2 + 5x - 6 \\text{ memotong sumbu-y di titik}?"},
    {label:"c.",math:"\\text{Grafik yang memotong sumbu-y di } (0,0) \\text{ berarti nilai } c = \\ldots"},
  ]}),
  Qn(22,"Bentuk Vertex ke Umum – ANBK",{type:"mixed",content:"Ubah bentuk vertex ke bentuk umum:",parts:[
    {label:"a.",math:"f(x) = 2(x-3)^2 + 5"},
    {label:"b.",math:"g(x) = -(x+2)^2 - 1"},
    {label:"c.",math:"h(x) = \\frac{1}{2}(x-4)^2 - 3"},
  ]}),
  Qn(23,"Ciri Grafik dari Persamaan – UN",{type:"mixed",content:"Tanpa menggambar, sebutkan ciri-ciri grafik:",parts:[
    {label:"a.",math:"f(x) = x^2 - 6x + 5 \\text{ (terbuka ke...?, titik puncak di...?)}"},
    {label:"b.",math:"g(x) = -2x^2 + 8x - 6 \\text{ (nilai maks/min?)}"},
    {label:"c.",math:"h(x) = 3(x-1)^2 - 4 \\text{ (memotong sumbu-y di...?)}"},
  ]}),
  Qn(24,"Fungsi Naik dan Turun – TKA",{type:"mixed",parts:[
    {label:"a.",text:"Untuk a > 0, fungsi kuadrat naik di sebelah kanan titik puncak dan turun di sebelah kirinya. Benar atau salah?"},
    {label:"b.",math:"f(x) = x^2 - 4x + 4, \\text{ untuk } x > 2 \\text{, fungsi naik atau turun?}"},
    {label:"c.",math:"g(x) = -(x+1)^2 + 9, \\text{ untuk } x < -1 \\text{, fungsi naik atau turun?}"},
  ]}),
  Qn(25,"Verifikasi Fungsi Kuadrat – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Apakah } f(x) = (x^2-4)/(x-2) \\text{ fungsi kuadrat? (} x\\neq 2\\text{)}"},
    {label:"b.",math:"\\text{Apakah } g(x) = x^2 - x^2 + 3x = 3x \\text{ fungsi kuadrat?}"},
    {label:"c.",math:"\\text{Apakah } h(x) = \\sqrt{x^2} = |x| \\text{ fungsi kuadrat?}"},
  ]}),
  Qn(26,"Koefisien Negatif – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = -x^2 + 4 \\Rightarrow a=\\ldots, b=\\ldots, c=\\ldots"},
    {label:"b.",math:"\\text{Titik puncak } f(x) = -x^2+4 \\text{ adalah } (\\ldots, \\ldots)"},
    {label:"c.",text:"Mengapa grafik f(x) = −x² + 4 terbuka ke bawah?"},
  ]}),
  Qn(27,"Fungsi dengan Akar Irasional – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 2\\sqrt{3}x + 3 \\Rightarrow a=\\ldots, b=\\ldots, c=\\ldots"},
    {label:"b.",math:"\\text{Hitung } f(\\sqrt{3}) = \\ldots"},
    {label:"c.",math:"\\text{Nilai } x \\text{ agar } f(x)=0 \\text{ adalah } x = \\ldots"},
  ]}),
  Qn(28,"Identifikasi Grafik dari Tabel – ANBK",{type:"mixed",diagram:(
    <svg width="300" height="130" viewBox="0 0 300 130" className="mx-auto">
      <rect x="5" y="5" width="290" height="120" rx="8" fill="var(--card)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4"/>
      <text x="150" y="24" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">Tabel Nilai Fungsi (tidak diketahui)</text>
      {['x','-2','-1','0','1','2','3'].map((v,i)=>(
        <text key={i} x={25+i*43} y={44} fill={i===0?"#fbbf24":"#94a3b8"} fontSize="9" textAnchor="middle">{v}</text>
      ))}
      <line x1="7" y1="48" x2="293" y2="48" stroke="var(--border)" strokeWidth="1"/>
      {['f(x)','9','4','1','0','1','4'].map((v,i)=>(
        <text key={i} x={25+i*43} y={68} fill={i===0?"#fbbf24":v==='0'?"#86efac":"#e2e8f0"} fontSize="9" textAnchor="middle">{v}</text>
      ))}
      <line x1="7" y1="72" x2="293" y2="72" stroke="var(--border)" strokeWidth="1"/>
      <text x="150" y="92" fill="#94a3b8" fontSize="8" textAnchor="middle">Perhatikan pola nilai f(x) pada tabel</text>
      <text x="150" y="108" fill="#64748b" fontSize="8" textAnchor="middle">Nilai minimum f(x) = 0 terjadi saat x = 1</text>
    </svg>
  ),parts:[
    {label:"a.",text:"Berdasarkan tabel, apakah parabola membuka ke atas atau ke bawah?"},
    {label:"b.",text:"Berapa nilai minimum f(x)?"},
    {label:"c.",math:"\\text{Tentukan rumus } f(x) \\text{ berdasarkan tabel!}"},
  ]}),
  Qn(29,"Perubahan Nilai c – TKA",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Jika } f(x) = x^2 - 6x + c \\text{ dan } f(0) = 4, \\text{ tentukan } c!"},
    {label:"b.",math:"\\text{Jika } g(x) = 2x^2 + bx + 3 \\text{ dan } g(0) = 3, \\text{ tentukan } b!"},
    {label:"c.",math:"\\text{Jika grafik } y = ax^2 \\text{ melalui } (2,8), \\text{ tentukan } a!"},
  ]}),
  Qn(30,"Fungsi Kuadrat dari Faktor Linear – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = (x-2)(x+5) \\Rightarrow a=\\ldots, b=\\ldots, c=\\ldots"},
    {label:"b.",math:"g(x) = 3(x-1)(x+1) \\Rightarrow \\text{ bentuk umum}"},
    {label:"c.",math:"h(x) = -2(x+3)(x-4) \\Rightarrow \\text{ bentuk umum}"},
  ]}),
  Qn(31,"Analisis Domain Terbatas – ANBK",{type:"mixed",content:"Diketahui f(x) = x² − 2x − 3 dengan domain {−2, −1, 0, 1, 2, 3, 4}.",parts:[
    {label:"a.",text:"Hitung semua nilai f(x) pada domain tersebut."},
    {label:"b.",text:"Tentukan range dari f pada domain yang diberikan."},
    {label:"c.",text:"Berapa nilai f(x) terkecil pada domain tersebut?"},
  ]}),
  Qn(32,"Fungsi Kuadrat Simetri Tertentu – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(-3) = f(5) \\Rightarrow \\text{ sumbu simetri di } x = \\ldots"},
    {label:"b.",math:"g(-1) = g(7) \\Rightarrow \\text{ sumbu simetri di } x = \\ldots"},
    {label:"c.",math:"\\text{Jika sumbu simetri } x=2, \\text{ dan } f(0)=f(k), \\text{ nilai } k = \\ldots"},
  ]}),
  Qn(33,"Analisis Koefisien – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Jika } f(x) = ax^2 + bx + c \\text{ dan } f(0) = 5, \\text{ maka } c = \\ldots"},
    {label:"b.",math:"\\text{Jika } f(1) = 0 \\text{ dan } f(-1) = 8, \\text{ dan } a = 2, \\text{ cari } b"},
    {label:"c.",math:"\\text{Jika } f(2) = f(-2) = 5 \\text{ dan } f(0) = 1, \\text{ cari } a \\text{ dan } c"},
  ]}),
  Qn(34,"Soal HOTS – Perbandingan Fungsi – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Fungsi } f(x) = 2x^2 \\text{ dan } g(x) = 2x. \\text{ Kapan } f(x) > g(x)?"},
    {label:"b.",math:"\\text{Untuk } x \\in [0,3], \\text{ tentukan nilai } f(x) = x^2 - 4x + 3 \\text{ terbesar}"},
    {label:"c.",text:"Apakah fungsi kuadrat selalu bernilai positif? Kapan bisa bernilai negatif?"},
  ]}),
  Qn(35,"Fungsi Kuadrat Tak Lengkap – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 9 \\; (b=0) \\Rightarrow \\text{ karakteristik grafik?}"},
    {label:"b.",math:"g(x) = x^2 - 4x \\; (c=0) \\Rightarrow f(0) = \\ldots \\text{ grafik melalui } (0,\\ldots)"},
    {label:"c.",math:"h(x) = 5x^2 \\; (b=c=0) \\Rightarrow \\text{ titik puncak di } (\\ldots,\\ldots)"},
  ]}),
  Qn(36,"Soal UN – Mengidentifikasi dari Grafik",{type:"mixed",diagram:(
    <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
      <Axes ox={150} oy={120} />
      <path d="M 90,30 Q 150,160 210,30" stroke="#f59e0b" fill="none" strokeWidth="2.5"/>
      <circle cx="150" cy="160" r="4" fill="#f59e0b"/>
      <text x="158" y="165" fill="#fcd34d" fontSize="9">Titik Puncak</text>
      <circle cx="100" cy="30" r="3" fill="#86efac"/>
      <circle cx="200" cy="30" r="3" fill="#86efac"/>
      <line x1="150" y1="10" x2="150" y2="175" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5"/>
      <text x="155" y="12" fill="#f59e0b" fontSize="8">x = h</text>
      <text x="105" y="28" fill="#86efac" fontSize="8">(x₁,y₁)</text>
      <text x="192" y="28" fill="#86efac" fontSize="8">(x₂,y₂)</text>
    </svg>
  ),parts:[
    {label:"a.",text:"Dari grafik, apakah nilai a positif atau negatif? Jelaskan!"},
    {label:"b.",text:"Berapa nilai c (titik potong sumbu y)?"},
    {label:"c.",text:"Di mana letak sumbu simetri berdasarkan grafik?"},
  ]}),
  Qn(37,"Fungsi Kuadrat Parametrik – TKA",{type:"mixed",content:"Diketahui f(x) = (k−1)x² + 3x − 2.",parts:[
    {label:"a.",text:"Agar f merupakan fungsi kuadrat, syarat apa yang harus dipenuhi k?"},
    {label:"b.",math:"\\text{Jika } k = 3, \\text{ tentukan } a, b, c \\text{ dan arah buka parabola}"},
    {label:"c.",math:"\\text{Jika } k = 1, \\text{ jenis fungsi apa yang dihasilkan?}"},
  ]}),
  Qn(38,"Fungsi Kuadrat Positif dan Negatif – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 + 2x + 5, \\text{ apakah } f(x) > 0 \\text{ untuk semua } x? \\text{ Mengapa?}"},
    {label:"b.",math:"g(x) = -x^2 - 1, \\text{ apakah } g(x) < 0 \\text{ untuk semua } x?"},
    {label:"c.",math:"h(x) = x^2 - 4x - 5 = 0, \\text{ nilai } x \\text{ yang membuat } h(x) < 0 \\text{ adalah } \\ldots"},
  ]}),
  Qn(39,"HOTS – Menganalisis Koefisien – UN/TKA",{type:"mixed",content:"Grafik f(x) = ax² + bx + c memiliki ciri: terbuka ke atas, memotong sumbu y di (0,5), dan sumbu simetrinya x = 2.",parts:[
    {label:"a.",text:"Tentukan tanda dari a dan nilai c."},
    {label:"b.",math:"\\text{Gunakan rumus sumbu simetri } x = -\\frac{b}{2a} = 2 \\text{ untuk menentukan hubungan } a \\text{ dan } b"},
    {label:"c.",math:"\\text{Jika } f(4) = 5, \\text{ tentukan nilai } a!"},
  ]}),
  Qn(40,"Soal HOTS – Merekonstruksi Fungsi – UN/TKA",{type:"mixed",content:"Diketahui grafik fungsi kuadrat memiliki sifat: a > 0, vertex di (3, −4), dan melalui titik (5, 0).",parts:[
    {label:"a.",math:"\\text{Gunakan bentuk vertex: } f(x) = a(x-3)^2 - 4"},
    {label:"b.",math:"\\text{Substitusi } (5,0) \\text{ untuk mencari } a"},
    {label:"c.",math:"\\text{Tulis } f(x) \\text{ dalam bentuk umum } ax^2 + bx + c"},
  ]}),
];

const BentukUmumKarakteristikPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📈</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-amber-300 text-center mb-1" style={{textShadow:'0 0 20px rgba(245,158,11,0.7)'}}>
            BENTUK UMUM DAN KARAKTERISTIK GRAFIK
          </h1>
          <p className={isDark ? "text-white/50 text-xs text-center font-body" : "text-gray-500 text-xs text-center font-body"}>Kelas 9 · Fungsi Kuadrat · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2">
            <span className="text-amber-400 text-xs font-bold">📋 40 {t('practice.suffixSoal')}</span>
            <span className={isDark ? "text-white/30 text-xs" : "text-gray-400 text-xs"}>·</span>
            <span className={isDark ? "text-white/50 text-xs" : "text-gray-500 text-xs"}>UN / ANBK / TKA</span>
          </div>
        </div>

        <div className={isDark ? "mb-5 bg-amber-900/20 border border-amber-500/20 rounded-xl p-4" : "mb-5 bg-amber-50 border border-amber-500/20 rounded-xl p-4"}>
          <p className="text-amber-300 text-xs font-bold mb-3">📐 Konsep Penting</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              {name:"Bentuk Umum", math:"f(x) = ax^2 + bx + c,\\; a\\neq 0"},
              {name:"a > 0", math:"\\text{Terbuka ke atas (minimum)}"},
              {name:"a < 0", math:"\\text{Terbuka ke bawah (maksimum)}"},
              {name:"c = f(0)", math:"\\text{Titik potong sumbu-}y"},
            ].map(r=>(
              <div key={r.name} className={isDark ? "bg-white/5 rounded-lg px-3 py-2" : "bg-gray-50 rounded-lg px-3 py-2"}>
                <div className={isDark ? "text-white/40 text-[9px] uppercase mb-1" : "text-gray-500 text-[9px] uppercase mb-1"}>{r.name}</div>
                <div className="text-amber-300 text-xs overflow-x-auto"><InlineMath math={r.math}/></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q,i)=>(
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{animationDelay:`${i*0.02}s`}}>
              <div className={isDark ? "absolute inset-0 bg-gradient-to-br from-amber-900/30 via-slate-900/80 to-orange-900/30 backdrop-blur" : "absolute inset-0 bg-gradient-to-br from-amber-50/60 via-white/80 to-orange-50/40 backdrop-blur"}/>
              <div className="absolute inset-0 border border-amber-500/20 rounded-2xl"/>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-500 rounded-l-2xl"/>
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                    <span className="text-amber-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className={isDark ? "font-body text-sm text-white/90 leading-relaxed mb-3" : "font-body text-sm text-gray-800 leading-relaxed mb-3"}>{q.content}</p>}
                    {q.mathContent && <div className={isDark ? "mb-3 bg-amber-900/20 border border-amber-500/20 rounded-lg px-4 py-3 flex justify-center" : "mb-3 bg-amber-50 border border-amber-500/20 rounded-lg px-4 py-3 flex justify-center"}><BlockMath math={q.mathContent}/></div>}
                    {q.diagram && <div className={isDark ? "mb-3 flex justify-center bg-white/5 rounded-xl p-3" : "mb-3 flex justify-center bg-gray-50 rounded-xl p-3"}>{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p,pi)=>(
                          <div key={pi} className={isDark ? "flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5" : "flex items-start gap-2 rounded-lg px-3 py-2 bg-gray-50"}>
                            <span className="text-amber-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-amber-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Fungsi Kuadrat
          </button>
        </div>
      </div>
    </div>
  );
};
export default BentukUmumKarakteristikPage;
