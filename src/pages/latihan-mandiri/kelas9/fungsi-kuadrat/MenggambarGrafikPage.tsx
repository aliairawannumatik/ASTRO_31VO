import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const GridSVG = ({ points = [] as [number, number][], color = "#f59e0b", label = "", up = true }: { points?: [number, number][], color?: string, label?: string, up?: boolean }) => {
  const ox = 150, oy = 120, s = 25;
  const toSvg = (x: number, y: number) => [ox + x * s, oy - y * s];
  const [vx, vy] = points.length > 0 ? [points[Math.floor(points.length/2)][0], Math.min(...points.map(p=>p[1]))] : [0, 0];
  const cp = toSvg(vx, vy);
  const leftP = toSvg(-3, up ? vy + 9 : vy - 9);
  const rightP = toSvg(3, up ? vy + 9 : vy - 9);
  return (
    <svg width="300" height="220" viewBox="0 0 300 220" className="mx-auto">
      {[-4,-3,-2,-1,1,2,3,4].map(x => (
        <line key={x} x1={ox+x*s} y1={20} x2={ox+x*s} y2={200} stroke="#1e293b" strokeWidth="1"/>
      ))}
      {[-3,-2,-1,1,2,3,4].map(y => (
        <line key={y} x1={20} y1={oy-y*s} x2={280} y2={oy-y*s} stroke="#1e293b" strokeWidth="1"/>
      ))}
      <line x1="20" y1={oy} x2="280" y2={oy} stroke="#334155" strokeWidth="1.5"/>
      <polygon points={`280,${oy} 274,${oy-4} 274,${oy+4}`} fill="#334155"/>
      <line x1={ox} y1="200" x2={ox} y2="15" stroke="#334155" strokeWidth="1.5"/>
      <polygon points={`${ox},15 ${ox-4},21 ${ox+4},21`} fill="#334155"/>
      <text x="283" y={oy+4} fill="#64748b" fontSize="9">x</text>
      <text x={ox+4} y="18" fill="#64748b" fontSize="9">y</text>
      <text x={ox+4} y={oy+12} fill="#64748b" fontSize="8">O</text>
      {[-3,-2,-1,1,2,3].map(x => <text key={x} x={ox+x*s-3} y={oy+14} fill="#475569" fontSize="8">{x}</text>)}
      {[-2,-1,1,2,3,4].map(y => <text key={y} x={ox-18} y={oy-y*s+4} fill="#475569" fontSize="8">{y}</text>)}
      {up
        ? <path d={`M ${leftP[0]},${leftP[1]} Q ${cp[0]},${cp[1]} ${rightP[0]},${rightP[1]}`} stroke={color} fill="none" strokeWidth="2.5"/>
        : <path d={`M ${leftP[0]},${leftP[1]} Q ${cp[0]},${cp[1]} ${rightP[0]},${rightP[1]}`} stroke={color} fill="none" strokeWidth="2.5"/>}
      {points.map(([x, y], i) => {
        const [sx, sy] = toSvg(x, y);
        return <circle key={i} cx={sx} cy={sy} r="4" fill={color} opacity="0.8"/>;
      })}
      {label && <text x="10" y="18" fill={color} fontSize="9" fontWeight="bold">{label}</text>}
    </svg>
  );
};

const StepsTable = () => (
  <svg width="300" height="185" viewBox="0 0 300 185" className="mx-auto">
    <rect x="5" y="5" width="290" height="175" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4"/>
    <text x="150" y="24" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">Langkah Menggambar f(x) = x² − 4x + 3</text>
    {['Langkah','Keterangan','Hasil'].map((h,i)=>(
      <text key={i} x={30+i*95} y={42} fill="#fbbf24" fontSize="9" textAnchor="middle" fontWeight="bold">{h}</text>
    ))}
    <line x1="7" y1="46" x2="293" y2="46" stroke="#334155" strokeWidth="1"/>
    {[
      ['1. a','Cek a > 0 atau < 0','a=1 > 0 → buka atas'],
      ['2. Sb-y','Substitusi x=0','f(0) = 3 → (0,3)'],
      ['3. Sb-x','f(x) = 0','x=1 dan x=3'],
      ['4. Puncak','x = −b/2a','(2, −1)'],
      ['5. Tabel','Hitung beberapa titik','Lihat tabel'],
    ].map((row,ri)=>(
      row.map((c,ci)=>(
        <text key={ci} x={30+ci*95} y={62+ri*22} fill={ci===0?"#f59e0b":"#94a3b8"} fontSize="7.5" textAnchor="middle">{c}</text>
      ))
    ))}
  </svg>
);

const ValueTable = (props: {func?: string, xs?: number[], ys?: (number|string)[], color?: string}) => {
  const { func = "f(x)", xs = [-2,-1,0,1,2,3,4], ys = ['...','...','3','0','...','0','3'], color="#f59e0b" } = props;
  return (
    <svg width="300" height="110" viewBox="0 0 300 110" className="mx-auto">
      <rect x="5" y="5" width="290" height="100" rx="8" fill="#1e293b" stroke={color} strokeWidth="1" strokeOpacity="0.4"/>
      <text x="150" y="24" fill={color} fontSize="10" fontWeight="bold" textAnchor="middle">{func}</text>
      {['x',...xs.map(String)].map((v,i)=>(
        <text key={i} x={22+i*37} y={42} fill={i===0?"#fbbf24":"#94a3b8"} fontSize="9" textAnchor="middle">{v}</text>
      ))}
      <line x1="7" y1="47" x2="293" y2="47" stroke="#334155" strokeWidth="1"/>
      {['f(x)',...ys.map(String)].map((v,i)=>(
        <text key={i} x={22+i*37} y={68} fill={i===0?"#fbbf24":v==='...'?"#f472b6":v==='0'?"#86efac":v.toString().includes('-')?"#f472b6":"#e2e8f0"} fontSize="9" textAnchor="middle">{v}</text>
      ))}
      <line x1="7" y1="73" x2="293" y2="73" stroke="#334155" strokeWidth="1"/>
      <text x="150" y="92" fill="#64748b" fontSize="8" textAnchor="middle">Titik hijau (0) = titik potong sumbu-x · Titik merah = nilai negatif</text>
    </svg>
  );
};

const questions: Q[] = [
  Qn(1,"Langkah Menggambar Grafik – UN",{type:"mixed",diagram:<StepsTable/>,content:"Ikuti langkah berikut untuk menggambar f(x) = x² − 4x + 3:",parts:[
    {label:"a.",text:"Tentukan titik potong sumbu-x dan sumbu-y."},
    {label:"b.",text:"Tentukan titik puncak (sumbu simetri dan nilai puncak)."},
    {label:"c.",text:"Buat tabel nilai dan sketsakan grafiknya!"},
  ]}),
  Qn(2,"Tabel Nilai Fungsi – ANBK",{type:"mixed",diagram:<ValueTable func="f(x) = x² − 4x + 3" xs={[-1,0,1,2,3,4,5]} ys={[8,3,0,-1,0,3,8]}/>,parts:[
    {label:"a.",text:"Dari tabel, tentukan titik potong sumbu-x."},
    {label:"b.",text:"Tentukan nilai minimum dari tabel."},
    {label:"c.",text:"Di nilai x berapa fungsi naik dan di mana turun?"},
  ]}),
  Qn(3,"Menggambar Parabola Membuka ke Atas – TKA",{type:"mixed",diagram:<GridSVG points={[[-1,5],[0,3],[1,3],[2,1],[3,3],[4,5]]} color="#f59e0b" label="f(x)=x²−4x+3" up={true}/>,parts:[
    {label:"a.",math:"f(x) = x^2 - 4x + 3 \\Rightarrow \\text{titik puncak } (\\ldots, \\ldots)"},
    {label:"b.",text:"Apakah grafik yang digambar sudah benar? Periksa titik-titik!"},
    {label:"c.",math:"f(0) = \\ldots \\quad f(2) = \\ldots \\quad f(4) = \\ldots"},
  ]}),
  Qn(4,"Grafik Parabola ke Bawah – UN",{type:"mixed",diagram:<GridSVG points={[[-1,-4],[0,0],[1,2],[2,2],[3,0],[4,-4]]} color="#f97316" label="g(x)=−x²+4x" up={false}/>,parts:[
    {label:"a.",math:"g(x) = -x^2 + 4x. \\text{ Buat tabel nilai untuk } x = -1, 0, 1, 2, 3, 4, 5"},
    {label:"b.",math:"\\text{Titik puncak } g = (\\ldots, \\ldots)"},
    {label:"c.",text:"Gambar sketsa grafik g(x) dan tandai titik puncak!"},
  ]}),
  Qn(5,"Menentukan Titik-titik Kunci – ANBK",{type:"mixed",content:"Tentukan semua titik kunci untuk menggambar f(x) = x² + 2x − 3:",parts:[
    {label:"a.",math:"\\text{Titik potong sumbu-y: } f(0) = \\ldots"},
    {label:"b.",math:"\\text{Titik potong sumbu-x: } f(x)=0 \\Rightarrow x = \\ldots"},
    {label:"c.",math:"\\text{Titik puncak: } \\left(-\\frac{b}{2a}, f\\left(-\\frac{b}{2a}\\right)\\right) = (\\ldots, \\ldots)"},
  ]}),
  Qn(6,"Tabel dan Grafik Lengkap – TKA",{type:"mixed",diagram:<ValueTable func="f(x) = 2x² − 4x − 6" xs={[-2,-1,0,1,2,3,4]} ys={[10,0,-6,-8,-6,0,10]}/>,parts:[
    {label:"a.",text:"Dari tabel, tentukan titik potong sumbu-x dan sumbu-y."},
    {label:"b.",text:"Tentukan titik puncak dari tabel tersebut."},
    {label:"c.",math:"\\text{Verifikasi: } h = -\\frac{-4}{2 \\cdot 2} = \\ldots, \\; k = f(1) = \\ldots"},
  ]}),
  Qn(7,"Grafik Bergeser Vertikal – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 \\text{ digeser ke atas 3: grafik baru } g(x) = \\ldots"},
    {label:"b.",math:"f(x) = x^2 \\text{ digeser ke bawah 5: grafik baru } h(x) = \\ldots"},
    {label:"c.",text:"Bagaimana cara menggambar grafik yang bergeser secara vertikal?"},
  ]}),
  Qn(8,"Grafik Bergeser Horizontal – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 \\text{ digeser ke kanan 2: grafik baru } g(x) = \\ldots"},
    {label:"b.",math:"f(x) = x^2 \\text{ digeser ke kiri 3: grafik baru } h(x) = \\ldots"},
    {label:"c.",text:"Apa bedanya grafik f(x) = (x−2)² dan g(x) = x² − 2?"},
  ]}),
  Qn(9,"Identifikasi Grafik dari Ciri – TKA",{type:"mixed",diagram:(
    <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
      {[0,1,2,3].map(i => {
        const cx = 65 + (i%2)*160, cy = 50 + Math.floor(i/2)*100;
        const ups = [true,false,true,false][i];
        const colors = ["#f59e0b","#f97316","#86efac","#a78bfa"];
        const labels = ["a>0, c>0","a<0, c>0","a>0, c<0","a<0, c<0"];
        return (
          <g key={i}>
            <rect x={cx-55} y={cy-44} width="110" height="88" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
            <line x1={cx-48} y1={cy} x2={cx+48} y2={cy} stroke="#475569" strokeWidth="0.8"/>
            <line x1={cx} y1={cy-40} x2={cx} y2={cy+40} stroke="#475569" strokeWidth="0.8"/>
            {ups
              ? <path d={`M ${cx-40},${cy-20} Q ${cx},${cy+38} ${cx+40},${cy-20}`} stroke={colors[i]} fill="none" strokeWidth="2"/>
              : <path d={`M ${cx-40},${cy+20} Q ${cx},${cy-38} ${cx+40},${cy+20}`} stroke={colors[i]} fill="none" strokeWidth="2"/>}
            <circle cx={cx} cy={ups?cy+38:cy-38} r="3" fill={colors[i]}/>
            {[i<2?5:-5].map(dy => <circle key={dy} cx={cx} cy={cy+dy} r="3" fill={colors[i]}/>)}
            <text x={cx} y={cy+52} fill={colors[i]} fontSize="7.5" textAnchor="middle">{labels[i]}</text>
          </g>
        );
      })}
      <text x="150" y="16" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">4 Tipe Grafik Fungsi Kuadrat</text>
    </svg>
  ),parts:[
    {label:"a.",text:"Dari gambar, identifikasi setiap grafik berdasarkan a dan c-nya!"},
    {label:"b.",text:"Grafik mana yang memiliki nilai maksimum? Mana yang minimum?"},
    {label:"c.",text:"Hubungkan tanda c dengan posisi titik potong sumbu-y!"},
  ]}),
  Qn(10,"Tabel Nilai dan Pola – UN",{type:"mixed",diagram:<ValueTable func="f(x) = x² − 2x − 3" xs={[-2,-1,0,1,2,3,4]} ys={[5,0,-3,-4,-3,0,5]}/>,parts:[
    {label:"a.",text:"Jelaskan pola nilai f(x) pada tabel (naik, turun, simetri)."},
    {label:"b.",text:"Titik puncak ada di mana berdasarkan tabel?"},
    {label:"c.",math:"\\text{Verifikasi titik puncak dengan rumus } x = -\\frac{b}{2a}"},
  ]}),
  Qn(11,"Menggambar f(x) = −x² + 6x − 5 – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Buat tabel nilai untuk } x \\in \\{0, 1, 2, 3, 4, 5, 6\\}"},
    {label:"b.",text:"Tentukan titik puncak dan titik potong sumbu-x."},
    {label:"c.",text:"Sketsa grafiknya dan tandai semua titik kunci!"},
  ]}),
  Qn(12,"Perbandingan Dua Grafik – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 \\text{ dan } g(x) = 2x^2. \\text{ Mana yang lebih sempit?}"},
    {label:"b.",math:"f(x) = x^2 \\text{ dan } g(x) = \\frac{1}{2}x^2. \\text{ Mana yang lebih lebar?}"},
    {label:"c.",text:"Buat tabel nilai kedua fungsi untuk x = −2, −1, 0, 1, 2 dan bandingkan!"},
  ]}),
  Qn(13,"Menggambar dengan Titik Kritis – UN",{type:"mixed",content:"Tentukan titik kunci lalu gambar f(x) = 3x² − 6x − 9:",parts:[
    {label:"a.",math:"\\text{Titik potong sb-y: } f(0) = \\ldots"},
    {label:"b.",math:"\\text{Titik potong sb-x: } f(x) = 0 \\Rightarrow x = \\ldots"},
    {label:"c.",math:"\\text{Titik puncak: } (\\ldots, \\ldots)"},
  ]}),
  Qn(14,"Tabel dan Grafik Parabola Terbalik – ANBK",{type:"mixed",diagram:<ValueTable func="g(x) = −x² + 4x" xs={[-1,0,1,2,3,4,5]} ys={[-5,0,3,4,3,0,-5]} color="#f97316"/>,parts:[
    {label:"a.",text:"Dari tabel, tentukan semua titik kunci grafik g(x)."},
    {label:"b.",text:"Gambar sketsa grafik g(x). Apakah terbuka ke atas atau ke bawah?"},
    {label:"c.",text:"Di mana letak sumbu simetri grafik berdasarkan tabel?"},
  ]}),
  Qn(15,"Domain Terbatas pada Grafik – TKA",{type:"mixed",content:"Gambarlah f(x) = x² − 4 dengan domain [−3, 3].",parts:[
    {label:"a.",math:"\\text{Buat tabel nilai: } x \\in \\{-3,-2,-1,0,1,2,3\\}"},
    {label:"b.",text:"Tentukan nilai minimum dan maksimum f pada domain tersebut."},
    {label:"c.",text:"Bagaimana grafiknya berbeda dengan domain ℝ penuh?"},
  ]}),
  Qn(16,"Grafik dan Transformasi – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Jika grafik } y=x^2 \\text{ dicerminkan terhadap sb-x, persamaannya}?"},
    {label:"b.",math:"\\text{Jika grafik } y=x^2 \\text{ diperlebar 3 kali (vertikal), persamaannya}?"},
    {label:"c.",math:"\\text{Apa perbedaan grafik } y=x^2+3 \\text{ dan } y=(x+3)^2?"},
  ]}),
  Qn(17,"Menentukan Persamaan dari Grafik – ANBK",{type:"mixed",diagram:(
    <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
      <line x1="20" y1="130" x2="280" y2="130" stroke="#475569" strokeWidth="1.2"/>
      <polygon points="280,130 274,126 274,134" fill="#475569"/>
      <line x1="150" y1="190" x2="150" y2="15" stroke="#475569" strokeWidth="1.2"/>
      <polygon points="150,15 146,21 154,21" fill="#475569"/>
      <text x="283" y="134" fill="#64748b" fontSize="9">x</text>
      <text x="154" y="18" fill="#64748b" fontSize="9">y</text>
      <path d="M 90,30 Q 150,170 210,30" stroke="#f59e0b" fill="none" strokeWidth="2.5"/>
      <circle cx="90" cy="130" r="5" fill="#86efac"/>
      <circle cx="210" cy="130" r="5" fill="#86efac"/>
      <circle cx="150" cy="170" r="5" fill="#f59e0b"/>
      <circle cx="150" cy="30" r="4" fill="#f472b6"/>
      <text x="70" y="126" fill="#86efac" fontSize="9">(−2, 0)</text>
      <text x="212" y="126" fill="#86efac" fontSize="9">(4, 0)</text>
      <text x="155" y="175" fill="#fcd34d" fontSize="9">Puncak</text>
      <text x="155" y="28" fill="#f472b6" fontSize="9">(0, c)</text>
      <text x="8" y="18" fill="#fbbf24" fontSize="9">Baca dari grafik!</text>
    </svg>
  ),parts:[
    {label:"a.",text:"Dari grafik, tentukan titik potong sumbu-x."},
    {label:"b.",text:"Gunakan bentuk f(x) = a(x−x₁)(x−x₂) dan substitusi titik (0,c) untuk mencari a."},
    {label:"c.",text:"Tuliskan persamaan fungsi kuadrat dalam bentuk umum!"},
  ]}),
  Qn(18,"Grafik Fungsi Khusus – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2. \\text{ Buat tabel dan gambar grafik untuk } x \\in \\{-3,-2,-1,0,1,2,3\\}"},
    {label:"b.",math:"g(x) = (x-2)^2. \\text{ Bandingkan dengan } f(x) = x^2"},
    {label:"c.",math:"h(x) = x^2 + 2. \\text{ Bandingkan dengan } f(x) = x^2"},
  ]}),
  Qn(19,"Menggambar dari Bentuk Faktor – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = (x+1)(x-3). \\text{ Titik potong sb-x, sb-y, dan puncak?}"},
    {label:"b.",math:"g(x) = -(x-2)(x-6). \\text{ Titik potong sb-x, sb-y, dan puncak?}"},
    {label:"c.",text:"Sketsa kedua grafik pada satu bidang koordinat!"},
  ]}),
  Qn(20,"Grafik pada Domain Tertentu – ANBK",{type:"mixed",content:"f(x) = x² − 4x dengan domain [0, 5].",parts:[
    {label:"a.",math:"\\text{Buat tabel nilai untuk } x \\in \\{0, 1, 2, 3, 4, 5\\}"},
    {label:"b.",text:"Gambar grafik f(x) pada domain tersebut."},
    {label:"c.",text:"Tentukan nilai minimum dan maksimum f(x) pada domain tersebut."},
  ]}),
  Qn(21,"Grafik Berdasarkan Tanda a dan c – TKA",{type:"mixed",diagram:(
    <svg width="300" height="140" viewBox="0 0 300 140" className="mx-auto">
      <rect x="5" y="5" width="290" height="130" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4"/>
      <text x="150" y="24" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">Prediksi Grafik dari Tanda a dan c</text>
      {['a','c','Arah Buka','Posisi sb-y'].map((h,i)=>(
        <text key={i} x={25+i*70} y={42} fill="#fbbf24" fontSize="8.5" textAnchor="middle" fontWeight="bold">{h}</text>
      ))}
      <line x1="7" y1="46" x2="293" y2="46" stroke="#334155" strokeWidth="1"/>
      {[['+','+','Ke atas','Di atas sb-x'],['+','−','Ke atas','Di bawah sb-x'],['−','+','Ke bawah','Di atas sb-x'],['−','−','Ke bawah','Di bawah sb-x']].map((row,ri)=>(
        row.map((c,ci)=>(
          <text key={ci} x={25+ci*70} y={62+ri*18} fill={ci<2?"#86efac":ci===2?"#f59e0b":"#a78bfa"} fontSize="8" textAnchor="middle">{c}</text>
        ))
      ))}
    </svg>
  ),parts:[
    {label:"a.",math:"f(x) = 2x^2 - 3x + 5 \\Rightarrow \\text{prediksi grafik (arah buka, posisi sb-y)}"},
    {label:"b.",math:"g(x) = -x^2 + 4x - 1 \\Rightarrow \\text{prediksi grafik}"},
    {label:"c.",math:"h(x) = x^2 - x - 2 \\Rightarrow \\text{prediksi grafik}"},
  ]}),
  Qn(22,"Menggambar Grafik dengan 5 Titik Kunci – UN",{type:"mixed",content:"Gunakan 5 titik kunci untuk menggambar f(x) = x² − 6x + 5:",parts:[
    {label:"a.",text:"Titik 1 & 2: titik potong sumbu-x"},
    {label:"b.",text:"Titik 3: titik potong sumbu-y"},
    {label:"c.",text:"Titik 4 & 5: titik puncak dan satu titik simetrisnya"},
  ]}),
  Qn(23,"Grafik Parabola Sempit dan Lebar – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Gambar } f(x)=x^2, g(x)=3x^2, h(x)=\\frac{1}{3}x^2 \\text{ dalam satu bidang}"},
    {label:"b.",text:"Mana yang paling sempit dan mana yang paling lebar?"},
    {label:"c.",text:"Bagaimana nilai |a| memengaruhi lebar/sempitnya parabola?"},
  ]}),
  Qn(24,"Grafik dari Bentuk Vertex – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = (x-2)^2 - 1 \\Rightarrow \\text{gambar grafik (puncak, arah buka)}"},
    {label:"b.",math:"g(x) = -(x+1)^2 + 4 \\Rightarrow \\text{gambar grafik}"},
    {label:"c.",text:"Apa keuntungan menggunakan bentuk vertex dalam menggambar grafik?"},
  ]}),
  Qn(25,"Soal UN – Pasangkan Grafik dengan Persamaan",{type:"mixed",diagram:(
    <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
      <text x="150" y="18" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">Pasangkan grafik (I-IV) dengan persamaan</text>
      {[{cx:70,cy:70,up:true,c:"#f59e0b",l:"I"},{cx:220,cy:70,up:false,c:"#86efac",l:"II"},{cx:70,cy:155,up:true,c:"#f472b6",l:"III"},{cx:220,cy:155,up:false,c:"#a78bfa",l:"IV"}].map(g=>(
        <g key={g.l}>
          <rect x={g.cx-48} y={g.cy-42} width="96" height="84" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
          <line x1={g.cx-42} y1={g.cy} x2={g.cx+42} y2={g.cy} stroke="#475569" strokeWidth="0.8"/>
          <line x1={g.cx} y1={g.cy-38} x2={g.cx} y2={g.cy+38} stroke="#475569" strokeWidth="0.8"/>
          {g.up
            ? <path d={`M ${g.cx-35},${g.cy-20} Q ${g.cx},${g.cy+38} ${g.cx+35},${g.cy-20}`} stroke={g.c} fill="none" strokeWidth="2"/>
            : <path d={`M ${g.cx-35},${g.cy+20} Q ${g.cx},${g.cy-38} ${g.cx+35},${g.cy+20}`} stroke={g.c} fill="none" strokeWidth="2"/>}
          <text x={g.cx} y={g.cy-34} fill={g.c} fontSize="9" textAnchor="middle" fontWeight="bold">{g.l}</text>
        </g>
      ))}
    </svg>
  ),parts:[
    {label:"a.",math:"y = x^2 - 4 \\Rightarrow \\text{Grafik} \\ldots"},
    {label:"b.",math:"y = -x^2 + 4 \\Rightarrow \\text{Grafik} \\ldots"},
    {label:"c.",text:"Jelaskan cara memilih grafik dari persamaan!"},
  ]}),
  Qn(26,"Menggambar f(x) = 2x² − 8x + 6 – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Titik kunci: sb-y } = (0, \\ldots), \\text{ sb-x } = \\ldots, \\text{ puncak } = (\\ldots, \\ldots)"},
    {label:"b.",math:"\\text{Buat tabel nilai untuk } x \\in \\{-1, 0, 1, 2, 3, 4, 5\\}"},
    {label:"c.",text:"Gambar sketsa grafik berdasarkan data tersebut!"},
  ]}),
  Qn(27,"Tabel Nilai dan Persamaan – TKA",{type:"mixed",diagram:<ValueTable func="Fungsi tak diketahui" xs={[-3,-2,-1,0,1,2,3]} ys={[13,5,-1,-5,-7,-7,-5]} color="#a78bfa"/>,parts:[
    {label:"a.",text:"Dari tabel, apakah parabola membuka ke atas atau ke bawah?"},
    {label:"b.",text:"Estimasi letak titik puncak dari tabel."},
    {label:"c.",text:"Perkirakan persamaan fungsi tersebut."},
  ]}),
  Qn(28,"Grafik dan Skala – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 \\text{ dan } g(x) = (2x)^2 = 4x^2. \\text{ Mana lebih sempit?}"},
    {label:"b.",math:"h(x) = (x/2)^2 = x^2/4. \\text{ Bandingkan dengan } f(x) = x^2"},
    {label:"c.",text:"Bagaimana perubahan koefisien a memengaruhi skala grafik?"},
  ]}),
  Qn(29,"Menggambar dari Data Titik – ANBK",{type:"mixed",content:"Grafik fungsi kuadrat melalui titik (0,4), (2,0), dan (4,4).",parts:[
    {label:"a.",text:"Tentukan sumbu simetri dari titik (2,0) dan simetrinya."},
    {label:"b.",text:"Tentukan titik puncak berdasarkan informasi yang diberikan."},
    {label:"c.",text:"Tuliskan persamaan fungsinya!"},
  ]}),
  Qn(30,"Grafik Fungsi Negatif – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = -x^2 + 4. \\text{ Tentukan titik kunci dan gambar grafik}"},
    {label:"b.",math:"g(x) = -(x-3)^2 + 9. \\text{ Tentukan titik kunci dan gambar grafik}"},
    {label:"c.",text:"Apa perbedaan visual antara parabola dengan a > 0 dan a < 0?"},
  ]}),
  Qn(31,"Soal UN – Titik-titik pada Grafik",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Apakah titik } (3, 4) \\text{ ada di grafik } f(x) = x^2 - 5?"},
    {label:"b.",math:"\\text{Apakah titik } (-2, 1) \\text{ ada di grafik } g(x) = x^2 - 3?"},
    {label:"c.",math:"\\text{Cari titik pada grafik } h(x) = x^2 + 2 \\text{ dengan } y = 11"},
  ]}),
  Qn(32,"Menggambar Dua Grafik Berpotongan – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 \\text{ dan } g(x) = 4x - 4. \\text{ Titik potong kedua grafik?}"},
    {label:"b.",text:"Gambar kedua grafik pada satu bidang koordinat!"},
    {label:"c.",text:"Di mana grafik f dan g saling berpotongan? Tandai di gambar!"},
  ]}),
  Qn(33,"Grafik dari Bentuk Umum ke Vertex – TKA",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 4x + 7 = (x-2)^2 + 3. \\text{ Gambar grafik!}"},
    {label:"b.",math:"g(x) = -x^2 - 2x + 3 = -(x+1)^2 + 4. \\text{ Gambar grafik!}"},
    {label:"c.",text:"Metode mana yang lebih mudah untuk menggambar: bentuk umum atau vertex?"},
  ]}),
  Qn(34,"Soal HOTS – Grafik Cerminan – UN",{type:"mixed",parts:[
    {label:"a.",math:"\\text{Grafik } g(x) = -f(x) \\text{ di mana } f(x) = x^2 - 4. \\text{ Jelaskan hubungannya!}"},
    {label:"b.",math:"\\text{Grafik } h(x) = f(-x) \\text{ di mana } f(x) = x^2 - 2x. \\text{ Tulis persamaan } h!"},
    {label:"c.",text:"Apa perbedaan grafik f(x) dan −f(x)?"},
  ]}),
  Qn(35,"Menggambar Fungsi dengan Akar Irasional – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 3. \\text{ Titik potong sb-x di } x = \\pm\\sqrt{3} \\approx \\pm 1.73"},
    {label:"b.",math:"\\text{Buat tabel nilai dan gambar grafik } f(x) = x^2 - 3"},
    {label:"c.",text:"Bagaimana cara menandai titik akar irasional pada grafik?"},
  ]}),
  Qn(36,"Menentukan Persamaan dari Tabel – TKA",{type:"mixed",diagram:<ValueTable func="Fungsi f (carilah!)" xs={[-2,-1,0,1,2,3,4]} ys={[9,4,1,0,1,4,9]}/>,parts:[
    {label:"a.",text:"Dari tabel, tentukan persamaan fungsinya."},
    {label:"b.",text:"Tentukan titik puncak berdasarkan tabel."},
    {label:"c.",text:"Gambar sketsa grafik berdasarkan tabel!"},
  ]}),
  Qn(37,"Grafik dengan Parameter – UN",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 2kx + k^2 = (x-k)^2. \\text{ Titik puncak untuk } k=2?"},
    {label:"b.",math:"g(x) = ax^2 + 4. \\text{ Untuk } a=1,2,3, \\text{ gambar 3 grafik berbeda}"},
    {label:"c.",text:"Bagaimana nilai k memengaruhi posisi titik puncak?"},
  ]}),
  Qn(38,"Menggambar Grafik Piecewise Kuadrat – ANBK",{type:"mixed",parts:[
    {label:"a.",math:"f(x) = x^2 - 4 \\text{ untuk } x \\geq 0. \\text{ Gambar bagian grafik ini!}"},
    {label:"b.",math:"g(x) = -(x+2)^2 + 9 \\text{ untuk } x \\leq 0. \\text{ Gambar bagian grafik ini!}"},
    {label:"c.",text:"Di titik mana kedua grafik bertemu? Apakah fungsinya kontinu?"},
  ]}),
  Qn(39,"Analisis Grafik Berdasarkan Tabel – TKA",{type:"mixed",diagram:<ValueTable func="f(x) tidak diketahui" xs={[-1,0,1,2,3,4,5]} ys={[-5,-3,-3,-5,-9,-15,-23]} color="#86efac"/>,parts:[
    {label:"a.",text:"Dari tabel, apakah fungsi naik atau turun secara keseluruhan?"},
    {label:"b.",text:"Apakah ini fungsi kuadrat dengan a > 0 atau a < 0? Jelaskan!"},
    {label:"c.",text:"Estimasi persamaan fungsinya dari pola tabel."},
  ]}),
  Qn(40,"HOTS – Rekonstruksi Grafik dari Informasi – UN/TKA",{type:"mixed",content:"Grafik fungsi kuadrat f memiliki: sumbu simetri x = 2, nilai maksimum = 4, dan melalui titik (4, 0).",parts:[
    {label:"a.",math:"\\text{Tulis bentuk vertex: } f(x) = a(x-2)^2 + 4, \\; a < 0"},
    {label:"b.",math:"\\text{Substitusi } (4, 0) \\text{ untuk mencari } a"},
    {label:"c.",math:"\\text{Gambar grafik } f(x), \\text{ tandai semua titik kunci!}"},
  ]}),
];

const MenggambarGrafikPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📊</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-sky-300 text-center mb-1" style={{textShadow:'0 0 20px rgba(56,189,248,0.7)'}}>
            MENGGAMBAR GRAFIK FUNGSI KUADRAT
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Fungsi Kuadrat · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 rounded-lg px-4 py-2">
            <span className="text-sky-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-sky-900/20 border border-sky-500/20 rounded-xl p-4">
          <p className="text-sky-300 text-xs font-bold mb-3">📐 Langkah Menggambar</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              {name:"① Cek a",math:"a>0 \\text{ (atas)}, a<0 \\text{ (bawah)}"},
              {name:"② Titik sb-y",math:"x=0 \\Rightarrow (0,c)"},
              {name:"③ Titik sb-x",math:"f(x)=0 \\Rightarrow ax^2+bx+c=0"},
              {name:"④ Titik Puncak",math:"\\left(-\\frac{b}{2a},\\; f\\!\\left(-\\frac{b}{2a}\\right)\\right)"},
            ].map(r=>(
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-sky-300 text-xs overflow-x-auto"><InlineMath math={r.math}/></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q,i)=>(
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{animationDelay:`${i*0.02}s`}}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur"/>
              <div className="absolute inset-0 border border-sky-500/20 rounded-2xl"/>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-blue-500 rounded-l-2xl"/>
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0">
                    <span className="text-sky-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sky-400 text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-sky-900/20 border border-sky-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent}/></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p,pi)=>(
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-sky-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Fungsi Kuadrat
          </button>
        </div>
      </div>
    </div>
  );
};
export default MenggambarGrafikPage;
