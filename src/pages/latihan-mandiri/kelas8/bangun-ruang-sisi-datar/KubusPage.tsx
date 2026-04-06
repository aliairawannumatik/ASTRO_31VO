import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Box } from "lucide-react";

const color = "sky";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; mathContent?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const CubeSVG = ({ s = "s", label = true, color: c = "#38bdf8" }: { s?: string; label?: boolean; color?: string }) => (
  <svg width="160" height="130" viewBox="0 0 160 130" className="mx-auto">
    <defs>
      <linearGradient id="cubeFront" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={c} stopOpacity="0.35" />
        <stop offset="100%" stopColor={c} stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={c} stopOpacity="0.55" />
        <stop offset="100%" stopColor={c} stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={c} stopOpacity="0.2" />
        <stop offset="100%" stopColor={c} stopOpacity="0.08" />
      </linearGradient>
    </defs>
    {/* Front face */}
    <polygon points="30,95 110,95 110,35 30,35" fill="url(#cubeFront)" stroke={c} strokeWidth="1.8" />
    {/* Top face */}
    <polygon points="30,35 110,35 145,10 65,10" fill="url(#cubeTop)" stroke={c} strokeWidth="1.8" />
    {/* Right face */}
    <polygon points="110,35 145,10 145,70 110,95" fill="url(#cubeRight)" stroke={c} strokeWidth="1.8" />
    {/* Hidden edges (dashed) */}
    <line x1="30" y1="95" x2="65" y2="70" stroke={c} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="65" y1="70" x2="145" y2="70" stroke={c} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="65" y1="70" x2="65" y2="10" stroke={c} strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    {/* Vertices */}
    {[[30,95],[110,95],[110,35],[30,35],[65,10],[145,10],[145,70],[65,70]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill={c} fillOpacity="0.9" />
    ))}
    {/* Labels */}
    {label && <>
      <text x="20" y="100" fill="white" fontSize="11" fontFamily="monospace">A</text>
      <text x="112" y="100" fill="white" fontSize="11" fontFamily="monospace">B</text>
      <text x="112" y="33" fill="white" fontSize="11" fontFamily="monospace">C</text>
      <text x="20" y="33" fill="white" fontSize="11" fontFamily="monospace">D</text>
      <text x="58" y="8" fill="white" fontSize="11" fontFamily="monospace">E</text>
      <text x="148" y="8" fill="white" fontSize="11" fontFamily="monospace">F</text>
      <text x="148" y="72" fill="white" fontSize="11" fontFamily="monospace">G</text>
      <text x="58" y="72" fill="white" fontSize="11" fontFamily="monospace">H</text>
      <text x="66" y="70" fill={c} fontSize="10" fontFamily="monospace">{s}</text>
    </>}
  </svg>
);

const CubeNetSVG = () => (
  <svg width="200" height="160" viewBox="0 0 200 160" className="mx-auto">
    {[
      [60,0,60,55,"sky"],
      [0,55,60,55,"cyan"],
      [60,55,60,55,"sky"],
      [120,55,60,55,"blue"],
      [180,55,60,55,"indigo"],
      [60,110,60,55,"teal"],
    ].map(([x,y,w,h,c],i) => (
      <rect key={i} x={x as number} y={y as number} width={w as number} height={h as number}
        fill={`#0ea5e9`} fillOpacity={0.15 + i*0.05} stroke="#38bdf8" strokeWidth="1.5"
        rx="2" />
    ))}
    <text x="85" y="28" fill="#7dd3fc" fontSize="10" textAnchor="middle">Atas</text>
    <text x="30" y="85" fill="#7dd3fc" fontSize="10" textAnchor="middle">Kiri</text>
    <text x="90" y="85" fill="#7dd3fc" fontSize="10" textAnchor="middle">Depan</text>
    <text x="150" y="85" fill="#7dd3fc" fontSize="10" textAnchor="middle">Kanan</text>
    <text x="210" y="85" fill="#7dd3fc" fontSize="9" textAnchor="middle">Belakang</text>
    <text x="90" y="140" fill="#7dd3fc" fontSize="10" textAnchor="middle">Bawah</text>
  </svg>
);

const DiagonalCubeSVG = () => (
  <svg width="160" height="130" viewBox="0 0 160 130" className="mx-auto">
    <polygon points="30,95 110,95 110,35 30,35" fill="#0ea5e9" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.5" />
    <polygon points="30,35 110,35 145,10 65,10" fill="#0ea5e9" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1.5" />
    <polygon points="110,35 145,10 145,70 110,95" fill="#0ea5e9" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="1.5" />
    <line x1="30" y1="95" x2="65" y2="70" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="65" y1="70" x2="145" y2="70" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    <line x1="65" y1="70" x2="65" y2="10" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" strokeOpacity="0.5" />
    {/* Diagonal ruang */}
    <line x1="30" y1="95" x2="145" y2="10" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,3" />
    <line x1="110" y1="95" x2="65" y2="10" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="5,3" />
    {/* Diagonal sisi depan */}
    <line x1="30" y1="95" x2="110" y2="35" stroke="#34d399" strokeWidth="1.5" />
    <text x="75" y="125" fill="#f59e0b" fontSize="9" textAnchor="middle">diagonal ruang</text>
    <text x="70" y="60" fill="#34d399" fontSize="9" textAnchor="middle">diagonal sisi</text>
    {[[30,95],[110,95],[110,35],[30,35],[65,10],[145,10],[145,70],[65,70]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="#38bdf8" />
    ))}
  </svg>
);

const questions: Q[] = [
  Qn(1, "Unsur-Unsur Kubus", {
    type: "mixed",
    content: "Perhatikan kubus ABCD.EFGH berikut:",
    diagram: <CubeSVG />,
    parts: [
      { label: "a.", text: "Sebutkan semua rusuk kubus ABCD.EFGH!" },
      { label: "b.", text: "Ada berapa banyak titik sudut pada kubus? Sebutkan semuanya." },
      { label: "c.", text: "Ada berapa banyak sisi (bidang) pada kubus? Sebutkan semuanya." },
    ],
  }),
  Qn(2, "Diagonal Sisi dan Diagonal Ruang Kubus", {
    type: "mixed",
    content: "Perhatikan kubus ABCD.EFGH dengan panjang rusuk s.",
    diagram: <DiagonalCubeSVG />,
    parts: [
      { label: "a.", math: "\\text{Tentukan panjang diagonal sisi kubus jika } s = 6 \\text{ cm}" },
      { label: "b.", math: "\\text{Tentukan panjang diagonal ruang kubus jika } s = 6 \\text{ cm}" },
      { label: "c.", text: "Ada berapa banyak diagonal ruang pada sebuah kubus?" },
    ],
  }),
  Qn(3, "Bidang Diagonal Kubus", {
    type: "mixed",
    content: "Kubus ABCD.EFGH memiliki bidang diagonal.",
    diagram: <CubeSVG />,
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan bidang diagonal kubus?" },
      { label: "b.", text: "Ada berapa banyak bidang diagonal pada sebuah kubus? Sebutkan salah satunya." },
      { label: "c.", math: "\\text{Jika rusuk kubus } s = 8 \\text{ cm, hitung luas bidang diagonal ABGH.}" },
    ],
  }),
  Qn(4, "Luas Permukaan Kubus – Dasar", {
    type: "mixed",
    content: "Rumus luas permukaan kubus dengan panjang rusuk s adalah:",
    mathContent: "L = 6s^2",
    parts: [
      { label: "a.", math: "\\text{Hitung luas permukaan kubus dengan } s = 5 \\text{ cm}" },
      { label: "b.", math: "\\text{Hitung luas permukaan kubus dengan } s = 10 \\text{ cm}" },
      { label: "c.", math: "\\text{Hitung luas permukaan kubus dengan } s = \\frac{1}{2} \\text{ m}" },
    ],
  }),
  Qn(5, "Mencari Rusuk dari Luas Permukaan", {
    type: "mixed",
    content: "Luas permukaan sebuah kubus diketahui. Tentukan panjang rusuknya!",
    parts: [
      { label: "a.", math: "L = 216 \\text{ cm}^2 \\Rightarrow s = \\ldots" },
      { label: "b.", math: "L = 384 \\text{ cm}^2 \\Rightarrow s = \\ldots" },
      { label: "c.", math: "L = 600 \\text{ cm}^2 \\Rightarrow s = \\ldots" },
    ],
  }),
  Qn(6, "Volume Kubus – Dasar", {
    type: "mixed",
    content: "Rumus volume kubus dengan panjang rusuk s adalah:",
    mathContent: "V = s^3",
    parts: [
      { label: "a.", math: "V = \\ldots \\text{ jika } s = 4 \\text{ cm}" },
      { label: "b.", math: "V = \\ldots \\text{ jika } s = 7 \\text{ cm}" },
      { label: "c.", math: "V = \\ldots \\text{ jika } s = 1{,}5 \\text{ m}" },
    ],
  }),
  Qn(7, "Mencari Rusuk dari Volume", {
    type: "mixed",
    content: "Volume sebuah kubus diketahui. Tentukan panjang rusuknya!",
    parts: [
      { label: "a.", math: "V = 125 \\text{ cm}^3 \\Rightarrow s = \\ldots" },
      { label: "b.", math: "V = 512 \\text{ cm}^3 \\Rightarrow s = \\ldots" },
      { label: "c.", math: "V = 1000 \\text{ cm}^3 \\Rightarrow s = \\ldots" },
    ],
  }),
  Qn(8, "Jaring-Jaring Kubus", {
    type: "mixed",
    content: "Perhatikan jaring-jaring kubus berikut:",
    diagram: <CubeNetSVG />,
    parts: [
      { label: "a.", text: "Ada berapa persegi yang membentuk jaring-jaring kubus?" },
      { label: "b.", text: "Apakah semua susunan 6 persegi merupakan jaring-jaring kubus? Jelaskan!" },
      { label: "c.", text: "Ada berapa kemungkinan bentuk jaring-jaring kubus yang berbeda?" },
    ],
  }),
  Qn(9, "Luas Permukaan – UN Style", {
    type: "mixed",
    content: "Sebuah kubus memiliki luas permukaan 294 cm².",
    parts: [
      { label: "a.", text: "Tentukan panjang rusuk kubus tersebut." },
      { label: "b.", text: "Tentukan volume kubus tersebut." },
      { label: "c.", text: "Tentukan panjang diagonal ruang kubus tersebut." },
    ],
  }),
  Qn(10, "Perbandingan Volume Dua Kubus – UN Style", {
    type: "mixed",
    content: "Kubus A memiliki rusuk 4 cm dan Kubus B memiliki rusuk 8 cm.",
    parts: [
      { label: "a.", text: "Tentukan volume Kubus A dan Kubus B." },
      { label: "b.", math: "\\text{Berapa kali volume Kubus B dibanding Kubus A? Nyatakan sebagai rasio.}" },
      { label: "c.", text: "Jika rusuk dilipatduakan, berapa kali lipat volumenya?" },
    ],
  }),
  Qn(11, "Diagonal Sisi Kubus – UN Style", {
    type: "mixed",
    content: "Kubus ABCD.EFGH memiliki panjang rusuk 9 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung panjang diagonal sisi AC}" },
      { label: "b.", math: "\\text{Hitung panjang diagonal ruang AG}" },
      { label: "c.", math: "\\text{Tentukan perbandingan diagonal sisi : diagonal ruang}" },
    ],
  }),
  Qn(12, "Pengecatan Kubus", {
    type: "mixed",
    content: "Sebuah kubus dengan rusuk 12 cm akan dicat seluruh permukaannya. Biaya pengecatan Rp2.500 per cm².",
    parts: [
      { label: "a.", text: "Hitung luas permukaan kubus tersebut." },
      { label: "b.", text: "Hitung total biaya pengecatan." },
      { label: "c.", text: "Jika hanya 4 sisi yang dicat (tanpa alas dan tutup), berapa biayanya?" },
    ],
  }),
  Qn(13, "Kubus dari Kawat – Kontekstual", {
    type: "mixed",
    content: "Sebuah kerangka kubus dibuat dari kawat dengan panjang rusuk 15 cm.",
    parts: [
      { label: "a.", text: "Ada berapa rusuk pada sebuah kubus?" },
      { label: "b.", text: "Berapa panjang kawat yang dibutuhkan untuk membuat kerangka tersebut?" },
      { label: "c.", text: "Jika kawat dijual per meter seharga Rp3.000, berapa biaya yang diperlukan?" },
    ],
  }),
  Qn(14, "Volume Kubus – Soal Cerita ANBK", {
    type: "mixed",
    content: "Sebuah bak mandi berbentuk kubus dengan panjang rusuk 80 cm diisi air hingga penuh.",
    parts: [
      { label: "a.", math: "\\text{Hitung volume bak dalam cm}^3" },
      { label: "b.", math: "\\text{Nyatakan volume dalam liter } (1 \\text{ liter} = 1000 \\text{ cm}^3)" },
      { label: "c.", text: "Jika air mengalir dengan kecepatan 8 liter/menit, berapa menit waktu yang dibutuhkan?" },
    ],
  }),
  Qn(15, "Rusuk Kubus dari Diagonal Ruang – UN", {
    type: "mixed",
    content: "Panjang diagonal ruang sebuah kubus adalah 6√3 cm.",
    parts: [
      { label: "a.", math: "\\text{Gunakan rumus diagonal ruang } d = s\\sqrt{3} \\text{ untuk mencari } s" },
      { label: "b.", text: "Tentukan luas permukaan kubus tersebut." },
      { label: "c.", text: "Tentukan volume kubus tersebut." },
    ],
  }),
  Qn(16, "Memotong Kubus – Soal ANBK", {
    type: "mixed",
    content: "Sebuah kubus besar dengan rusuk 12 cm dipotong-potong menjadi kubus-kubus kecil dengan rusuk 3 cm.",
    parts: [
      { label: "a.", text: "Berapa banyak kubus kecil yang dihasilkan?" },
      { label: "b.", text: "Hitung total luas permukaan seluruh kubus kecil." },
      { label: "c.", text: "Berapa kali total luas permukaan kubus kecil dibanding luas permukaan kubus besar?" },
    ],
  }),
  Qn(17, "Menentukan Jumlah Diagonal Sisi", {
    type: "mixed",
    diagram: <CubeSVG />,
    parts: [
      { label: "a.", text: "Sebuah kubus memiliki berapa sisi (bidang)? Sebutkan semuanya." },
      { label: "b.", text: "Berapa banyak diagonal pada setiap sisi persegi?" },
      { label: "c.", text: "Berapa total diagonal sisi yang dimiliki sebuah kubus?" },
    ],
  }),
  Qn(18, "Luas Permukaan – Soal UN Variasi", {
    type: "mixed",
    content: "Perhatikan kubus dengan rusuk 6 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas satu sisi kubus}" },
      { label: "b.", math: "\\text{Hitung total luas 6 sisi kubus (luas permukaan)}" },
      { label: "c.", math: "\\text{Jika rusuk bertambah 2 cm menjadi 8 cm, berapa pertambahan luas permukaannya?}" },
    ],
  }),
  Qn(19, "Isi Kubus dengan Kubus Kecil – TKA", {
    type: "mixed",
    content: "Sebuah kotak berbentuk kubus dengan rusuk 24 cm akan diisi dengan dadu-dadu kecil berbentuk kubus dengan rusuk 2 cm.",
    parts: [
      { label: "a.", text: "Berapa banyak dadu yang bisa dimasukkan ke dalam kotak tersebut?" },
      { label: "b.", math: "\\text{Verifikasi dengan perbandingan volume: } \\frac{V_{kotak}}{V_{dadu}} = \\ldots" },
      { label: "c.", text: "Jika dadu berukuran 3 cm, berapa dadu yang muat?" },
    ],
  }),
  Qn(20, "Diagonal Ruang – Soal UN Pilihan Ganda Style", {
    type: "mixed",
    content: "Diketahui kubus ABCD.EFGH dengan panjang rusuk 5 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitunglah panjang } AG" },
      { label: "b.", math: "\\text{Hitunglah panjang } BH" },
      { label: "c.", math: "\\text{Apakah } AG = BH? \\text{ Jelaskan mengapa.}" },
    ],
  }),
  Qn(21, "Perbandingan Rusuk dan Luas Permukaan", {
    type: "mixed",
    content: "Rusuk kubus P adalah 4 cm dan rusuk kubus Q adalah 6 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas permukaan kubus P dan Q}" },
      { label: "b.", math: "\\text{Tentukan perbandingan luas permukaan P : Q}" },
      { label: "c.", math: "\\text{Apa hubungan perbandingan rusuk dengan perbandingan luas permukaan?}" },
    ],
  }),
  Qn(22, "Perbandingan Rusuk dan Volume", {
    type: "mixed",
    content: "Rusuk kubus A adalah 3 cm dan rusuk kubus B adalah 6 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung volume kubus A dan B}" },
      { label: "b.", math: "\\text{Tentukan perbandingan volume A : B}" },
      { label: "c.", math: "\\text{Jika perbandingan rusuk 1:2, maka perbandingan volume adalah \\ldots : \\ldots}" },
    ],
  }),
  Qn(23, "Luas Permukaan – Soal Cerita UN", {
    type: "mixed",
    content: "Sebuah dus berbentuk kubus terbuat dari karton. Panjang rusuknya 30 cm. Sebuah pabrik membuat 500 dus seperti itu.",
    parts: [
      { label: "a.", text: "Hitung luas permukaan satu dus." },
      { label: "b.", text: "Hitung total luas karton yang dibutuhkan untuk 500 dus." },
      { label: "c.", math: "\\text{Nyatakan total luas dalam m}^2 \\text{ } (1 \\text{ m}^2 = 10.000 \\text{ cm}^2)" },
    ],
  }),
  Qn(24, "Menentukan Rusuk dari Informasi Volume – ANBK", {
    type: "mixed",
    content: "Volume sebuah aquarium berbentuk kubus adalah 27.000 cm³.",
    parts: [
      { label: "a.", math: "\\text{Tentukan panjang rusuk aquarium: } s = \\sqrt[3]{27000} = \\ldots" },
      { label: "b.", text: "Hitung luas permukaan aquarium (6 sisi)." },
      { label: "c.", text: "Jika aquarium diisi air hingga ¾ penuh, berapa volume air di dalamnya?" },
    ],
  }),
  Qn(25, "Diagonal Sisi – Soal Olimpiade Style", {
    type: "mixed",
    content: "Kubus ABCD.EFGH memiliki panjang rusuk 10 cm.",
    diagram: <DiagonalCubeSVG />,
    parts: [
      { label: "a.", math: "\\text{Hitung diagonal sisi pada bidang ABCD}" },
      { label: "b.", math: "\\text{Hitung diagonal sisi pada bidang ABFE}" },
      { label: "c.", math: "\\text{Apakah panjang semua diagonal sisi pada kubus sama? Buktikan!}" },
    ],
  }),
  Qn(26, "Volume Kubus – Soal Cerita ANBK", {
    type: "mixed",
    content: "Sebuah tong sampah berbentuk kubus dengan volume 8.000 cm³.",
    parts: [
      { label: "a.", text: "Tentukan panjang rusuk tong sampah tersebut." },
      { label: "b.", text: "Hitung luas permukaan tong sampah." },
      { label: "c.", text: "Berapa liter kapasitas tong sampah tersebut?" },
    ],
  }),
  Qn(27, "Jaring-Jaring Kubus – Menentukan Tutup", {
    type: "mixed",
    content: "Diketahui jaring-jaring kubus seperti gambar berikut (salib dengan satu kotak di setiap sisi).",
    diagram: <CubeNetSVG />,
    parts: [
      { label: "a.", text: "Pada jaring-jaring di atas, persegi mana yang menjadi alas kubus?" },
      { label: "b.", text: "Persegi mana yang akan bertemu setelah dilipat?" },
      { label: "c.", text: "Apakah ada lebih dari satu cara memilih alas pada jaring-jaring ini? Jelaskan." },
    ],
  }),
  Qn(28, "Soal Pemahaman – Bedakan Rusuk, Diagonal, Bidang", {
    type: "mixed",
    diagram: <CubeSVG />,
    parts: [
      { label: "a.", text: "Apakah AB termasuk rusuk, diagonal sisi, atau diagonal ruang? Jelaskan." },
      { label: "b.", text: "Apakah AC termasuk rusuk, diagonal sisi, atau diagonal ruang? Jelaskan." },
      { label: "c.", text: "Apakah AG termasuk rusuk, diagonal sisi, atau diagonal ruang? Jelaskan." },
    ],
  }),
  Qn(29, "Menghitung Volume – Soal UN Variasi", {
    type: "mixed",
    content: "Sebuah benda berbentuk kubus. Luas satu sisinya adalah 49 cm².",
    parts: [
      { label: "a.", math: "\\text{Dari luas sisi, tentukan panjang rusuk: } s^2 = 49 \\Rightarrow s = \\ldots" },
      { label: "b.", text: "Hitung volume kubus tersebut." },
      { label: "c.", text: "Hitung luas permukaan kubus tersebut." },
    ],
  }),
  Qn(30, "Soal ANBK – Volume Air dalam Kubus", {
    type: "mixed",
    content: "Sebuah kolam renang anak berbentuk kubus dengan panjang rusuk 1,5 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung volume kolam dalam m}^3" },
      { label: "b.", math: "\\text{Konversikan ke liter } (1 \\text{ m}^3 = 1000 \\text{ liter})" },
      { label: "c.", text: "Jika kolam hanya diisi hingga 2/3 kapasitasnya, berapa liter air yang digunakan?" },
    ],
  }),
  Qn(31, "Kubus dan Persegi Panjang – Soal Gabungan", {
    type: "mixed",
    content: "Sebuah kubus memiliki luas permukaan 486 cm². Sebuah persegi panjang memiliki panjang sama dengan rusuk kubus dan lebar 5 cm.",
    parts: [
      { label: "a.", math: "\\text{Dari luas permukaan, tentukan rusuk kubus: } 6s^2 = 486 \\Rightarrow s = \\ldots" },
      { label: "b.", text: "Hitung luas persegi panjang tersebut." },
      { label: "c.", text: "Hitung keliling persegi panjang tersebut." },
    ],
  }),
  Qn(32, "Soal Cerita – Kubus Bertingkat", {
    type: "mixed",
    content: "Sebuah menara mainan tersusun dari 3 kubus yang ditumpuk. Kubus bawah berrusuk 6 cm, kubus tengah berrusuk 4 cm, dan kubus atas berrusuk 2 cm.",
    parts: [
      { label: "a.", text: "Hitung total volume ketiga kubus." },
      { label: "b.", text: "Hitung total tinggi menara." },
      { label: "c.", text: "Kubus mana yang memiliki luas permukaan paling besar? Hitung luas permukaannya." },
    ],
  }),
  Qn(33, "Soal UN – Diagonal Ruang dan Bidang Diagonal", {
    type: "mixed",
    content: "Kubus PQRS.TUVW memiliki panjang rusuk 12 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung panjang diagonal ruang PV}" },
      { label: "b.", math: "\\text{Hitung luas bidang diagonal PQVU}" },
      { label: "c.", math: "\\text{Berbentuk apakah bidang diagonal PQVU?}" },
    ],
  }),
  Qn(34, "Menentukan Rusuk dari Diagonal Sisi – ANBK", {
    type: "mixed",
    content: "Panjang diagonal sisi sebuah kubus adalah 10√2 cm.",
    parts: [
      { label: "a.", math: "\\text{Gunakan } d_s = s\\sqrt{2} \\text{ untuk mencari rusuk } s" },
      { label: "b.", text: "Hitung volume kubus tersebut." },
      { label: "c.", text: "Hitung luas permukaan kubus tersebut." },
    ],
  }),
  Qn(35, "Soal Kontekstual – Kubus dan Cat", {
    type: "mixed",
    content: "Pak Budi memiliki kubus kayu dengan rusuk 20 cm. Ia ingin mengecat semua permukaannya kecuali alas. Setiap 400 cm² membutuhkan satu kaleng cat kecil seharga Rp5.000.",
    parts: [
      { label: "a.", text: "Hitung luas permukaan yang akan dicat (5 sisi)." },
      { label: "b.", text: "Berapa kaleng cat yang dibutuhkan?" },
      { label: "c.", text: "Berapa total biaya pengecatan?" },
    ],
  }),
  Qn(36, "Soal TKA – Volume Kubus dan Satuan", {
    type: "mixed",
    content: "Sebuah peti berbentuk kubus dengan rusuk 50 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung volume dalam cm}^3" },
      { label: "b.", math: "\\text{Konversikan ke dm}^3 \\text{ } (1 \\text{ dm} = 10 \\text{ cm})" },
      { label: "c.", math: "\\text{Konversikan ke m}^3 \\text{ } (1 \\text{ m} = 100 \\text{ cm})" },
    ],
  }),
  Qn(37, "Luas Permukaan – Aplikasi Kehidupan", {
    type: "mixed",
    content: "Sebuah lemari es berbentuk kubus (bagian dalam) dengan rusuk 60 cm. Semua dinding bagian dalamnya dilapisi styrofoam setebal 2 cm.",
    parts: [
      { label: "a.", text: "Hitung luas permukaan bagian dalam lemari es (sebelum dilapisi)." },
      { label: "b.", text: "Berapa luas styrofoam yang dibutuhkan?" },
      { label: "c.", text: "Setelah dilapisi, berapa panjang rusuk bagian dalam yang bisa digunakan?" },
    ],
  }),
  Qn(38, "Soal UN – Mengubah Dimensi Kubus", {
    type: "mixed",
    content: "Panjang rusuk sebuah kubus diperbesar 3 kali lipat.",
    parts: [
      { label: "a.", math: "\\text{Berapa kali lipat luas permukaannya bertambah?}" },
      { label: "b.", math: "\\text{Berapa kali lipat volumenya bertambah?}" },
      { label: "c.", math: "\\text{Jika rusuk awal 4 cm, tentukan luas permukaan dan volume kubus baru.}" },
    ],
  }),
  Qn(39, "Jaring-Jaring Kubus – Analisis", {
    type: "mixed",
    content: "Ada 11 kemungkinan jaring-jaring kubus yang berbeda.",
    diagram: <CubeNetSVG />,
    parts: [
      { label: "a.", text: "Bagaimana cara menentukan apakah suatu susunan 6 persegi merupakan jaring-jaring kubus?" },
      { label: "b.", text: "Jika susunan 6 persegi membentuk suatu jaring-jaring, apakah ada persegi yang bertumpuk? Jelaskan." },
      { label: "c.", text: "Gambarlah satu bentuk jaring-jaring kubus yang berbeda dari jaring-jaring bentuk salib." },
    ],
  }),
  Qn(40, "Soal UN/ANBK – Gabungan Konsep Kubus", {
    type: "mixed",
    content: "Sebuah kubus dengan panjang rusuk 6 cm.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas permukaan kubus}" },
      { label: "b.", math: "\\text{Hitung volume kubus}" },
      { label: "c.", math: "\\text{Hitung panjang diagonal ruang kubus}" },
      { label: "d.", math: "\\text{Hitung luas bidang diagonal kubus}" },
    ],
  }),
];

const KubusPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🧊</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-sky-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(56,189,248,0.7)' }}>
            KUBUS
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Bangun Ruang Sisi Datar · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 rounded-lg px-4 py-2">
            <span className="text-sky-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-sky-900/20 border border-sky-500/20 rounded-xl p-4">
          <p className="text-sky-300 text-xs font-bold mb-3">📐 Rumus-Rumus Penting Kubus</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { name: "Luas Permukaan", math: "L = 6s^2" },
              { name: "Volume", math: "V = s^3" },
              { name: "Diagonal Sisi", math: "d_s = s\\sqrt{2}" },
              { name: "Diagonal Ruang", math: "d_r = s\\sqrt{3}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-sky-300"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
          <div className="mt-2 bg-white/5 rounded-lg px-3 py-2">
            <div className="text-white/40 text-[9px] uppercase mb-1">Jumlah Unsur</div>
            <p className="text-white/70 text-xs">8 titik sudut · 12 rusuk · 6 sisi · 12 diagonal sisi · 4 diagonal ruang · 6 bidang diagonal</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-slate-900/80 to-cyan-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-sky-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-cyan-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0">
                    <span className="text-sky-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sky-400 text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && (
                      <div className="mb-3 bg-sky-900/20 border border-sky-500/20 rounded-lg px-4 py-3 flex justify-center">
                        <BlockMath math={q.mathContent} />
                      </div>
                    )}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-sky-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>}
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/bangun-ruang-sisi-datar"); }}
            className="text-sm text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Bangun Ruang Sisi Datar
          </button>
        </div>
      </div>
    </div>
  );
};

export default KubusPage;
