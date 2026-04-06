import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const JangkauanDiagram = () => (
  <svg width="310" height="110" viewBox="0 0 310 110" className="mx-auto">
    <rect x="4" y="4" width="302" height="102" rx="10" fill="#7c2d12" fillOpacity="0.25" stroke="#fb923c" strokeWidth="1.5" />
    <text x="155" y="20" fill="#fb923c" fontSize="10" textAnchor="middle" fontWeight="bold">Jangkauan (Range) dan IQR</text>
    <line x1="30" y1="55" x2="280" y2="55" stroke="#fb923c" strokeWidth="1.5" />
    {[[30,"Min\n=40"],[100,"Q₁\n=55"],[155,"Q₂\n=70"],[210,"Q₃\n=80"],[280,"Max\n=95"]].map(([x,label],i) => (
      <g key={i}>
        <circle cx={Number(x)} cy={55} r={i===0||i===4?4:5}
          fill={["#7c2d12","#c2410c","#ea580c","#c2410c","#7c2d12"][i]}
          stroke={["#fb923c","#fb923c","#fdba74","#fb923c","#fb923c"][i]} strokeWidth="1.5"/>
        <text x={Number(x)} y={73} fill="#fed7aa" fontSize="7" textAnchor="middle">{String(label).split("\n")[0]}</text>
        <text x={Number(x)} y={83} fill="#fb923c" fontSize="8" textAnchor="middle">{String(label).split("\n")[1]}</text>
      </g>
    ))}
    <line x1="30" y1="40" x2="280" y2="40" stroke="#fdba74" strokeWidth="1" strokeDasharray="4,3" />
    <text x="155" y="37" fill="#fdba74" fontSize="8" textAnchor="middle">Jangkauan = Max − Min = 95 − 40 = 55</text>
    <rect x="97" y="43" width="116" height="24" fill="#ea580c" fillOpacity="0.2" stroke="#fb923c" strokeWidth="1" rx="3"/>
    <text x="155" y="58" fill="#fed7aa" fontSize="7" textAnchor="middle">IQR = Q₃ − Q₁ = 80 − 55 = 25</text>
    <text x="155" y="100" fill="#7c2d12" fontSize="8" textAnchor="middle" fill="#fdba74">SQ = IQR/2 = 12,5</text>
  </svg>
);

const VariansSimpanganDiagram = () => (
  <svg width="310" height="145" viewBox="0 0 310 145" className="mx-auto">
    <rect x="4" y="4" width="302" height="137" rx="10" fill="#7c2d12" fillOpacity="0.2" stroke="#fb923c" strokeWidth="1.5" />
    <text x="155" y="18" fill="#fb923c" fontSize="10" textAnchor="middle" fontWeight="bold">Varians dan Simpangan Baku</text>
    <rect x="15" y="24" width="133" height="50" rx="6" fill="#7c2d12" fillOpacity="0.4" />
    <text x="81" y="37" fill="#fed7aa" fontSize="8" textAnchor="middle" fontWeight="bold">Varians (s²)</text>
    <text x="81" y="52" fill="#fb923c" fontSize="9" textAnchor="middle">s² = Σ(xᵢ − x̄)² / n</text>
    <text x="81" y="68" fill="#94a3b8" fontSize="7" textAnchor="middle">atau dengan frekuensi:</text>
    <rect x="158" y="24" width="140" height="50" rx="6" fill="#7c2d12" fillOpacity="0.4" />
    <text x="228" y="37" fill="#fed7aa" fontSize="8" textAnchor="middle" fontWeight="bold">Simpangan Baku (s)</text>
    <text x="228" y="52" fill="#fb923c" fontSize="9" textAnchor="middle">s = √(varians)</text>
    <text x="228" y="68" fill="#94a3b8" fontSize="7" textAnchor="middle">s = √(Σ(xᵢ−x̄)²/n)</text>
    <rect x="15" y="80" width="283" height="30" rx="6" fill="#431407" fillOpacity="0.6" />
    <text x="155" y="93" fill="#fed7aa" fontSize="8" textAnchor="middle" fontWeight="bold">Simpangan rata-rata (SR)</text>
    <text x="155" y="107" fill="#fb923c" fontSize="9" textAnchor="middle">SR = Σ|xᵢ − x̄| / n</text>
    <rect x="15" y="116" width="283" height="22" rx="6" fill="#431407" fillOpacity="0.4" />
    <text x="155" y="131" fill="#94a3b8" fontSize="8" textAnchor="middle">Semakin kecil s → data semakin seragam (tidak bervariasi)</text>
  </svg>
);

const TableSimpangan = () => (
  <svg width="310" height="180" viewBox="0 0 310 180" className="mx-auto">
    <rect x="4" y="4" width="302" height="172" rx="10" fill="#7c2d12" fillOpacity="0.2" stroke="#fb923c" strokeWidth="1.5" />
    <text x="155" y="18" fill="#fb923c" fontSize="10" textAnchor="middle" fontWeight="bold">Tabel Menghitung Varians</text>
    <rect x="10" y="24" width="282" height="18" rx="3" fill="#c2410c" fillOpacity="0.35" />
    <text x="45" y="36" fill="#fed7aa" fontSize="8" textAnchor="middle" fontWeight="bold">xᵢ</text>
    <text x="100" y="36" fill="#fed7aa" fontSize="8" textAnchor="middle" fontWeight="bold">xᵢ − x̄</text>
    <text x="170" y="36" fill="#fed7aa" fontSize="8" textAnchor="middle" fontWeight="bold">(xᵢ − x̄)²</text>
    <text x="255" y="36" fill="#fed7aa" fontSize="8" textAnchor="middle" fontWeight="bold">|xᵢ − x̄|</text>
    {[
      ["4","-3","9","3"],
      ["5","-2","4","2"],
      ["7","0","0","0"],
      ["8","1","1","1"],
      ["11","4","16","4"],
    ].map(([xi,dev,dev2,absdev], i) => (
      <g key={i}>
        <rect x="10" y={43+i*22} width="282" height="21" fill={i%2===0?"#7c2d12":"transparent"} fillOpacity="0.25"/>
        <text x="45" y={57+i*22} fill="#fed7aa" fontSize="9" textAnchor="middle">{xi}</text>
        <text x="100" y={57+i*22} fill={Number(dev)<0?"#fca5a5":"#86efac"} fontSize="9" textAnchor="middle">{dev}</text>
        <text x="170" y={57+i*22} fill="#fdba74" fontSize="9" textAnchor="middle">{dev2}</text>
        <text x="255" y={57+i*22} fill="#fed7aa" fontSize="9" textAnchor="middle">{absdev}</text>
      </g>
    ))}
    <rect x="10" y="153" width="282" height="18" rx="3" fill="#c2410c" fillOpacity="0.25"/>
    <text x="45" y="165" fill="#fb923c" fontSize="8" textAnchor="middle" fontWeight="bold">Σ=35</text>
    <text x="100" y="165" fill="#94a3b8" fontSize="8" textAnchor="middle">Σ=0</text>
    <text x="170" y="165" fill="#fb923c" fontSize="8" textAnchor="middle" fontWeight="bold">Σ=30</text>
    <text x="255" y="165" fill="#fb923c" fontSize="8" textAnchor="middle" fontWeight="bold">Σ=10</text>
    <text x="155" y="178" fill="#94a3b8" fontSize="7" textAnchor="middle">x̄ = 35/5 = 7, s² = 30/5 = 6, s = √6 ≈ 2,45, SR = 10/5 = 2</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pengertian Ukuran Penyebaran – UN", {
    type: "mixed",
    diagram: <JangkauanDiagram />,
    content: "Ukuran penyebaran menggambarkan seberapa jauh data menyebar dari pusat data.",
    parts: [
      { label: "a.", text: "Sebutkan tiga ukuran penyebaran data yang kamu ketahui." },
      { label: "b.", text: "Mengapa ukuran penyebaran penting selain ukuran pemusatan?" },
      { label: "c.", text: "Jika dua kelompok data memiliki rata-rata sama, apa yang membedakan keduanya?" },
    ],
  }),
  Qn(2, "Jangkauan (Range) – ANBK", {
    type: "mixed",
    mathContent: "J = x_{\\max} - x_{\\min}",
    content: "Hitung jangkauan dari data berikut:",
    parts: [
      { label: "a.", math: "\\text{Data: } 5, 12, 8, 20, 15, 3 \\Rightarrow J = 20-3 = \\ldots" },
      { label: "b.", math: "\\text{Data: } 65, 72, 58, 80, 90, 45 \\Rightarrow J = \\ldots" },
      { label: "c.", text: "Apa kelemahan menggunakan jangkauan sebagai ukuran penyebaran?" },
    ],
  }),
  Qn(3, "Jangkauan Interkuartil (IQR) – UN", {
    type: "mixed",
    mathContent: "\\text{IQR} = Q_3 - Q_1",
    content: "Hitung IQR dari data berikut:",
    parts: [
      { label: "a.", math: "Q_1=45, Q_3=75 \\Rightarrow \\text{IQR} = 75-45 = \\ldots" },
      { label: "b.", math: "Q_1=62{,}5, Q_3=87{,}5 \\Rightarrow \\text{IQR} = \\ldots" },
      { label: "c.", text: "Mengapa IQR lebih tahan terhadap data pencilan dibandingkan jangkauan?" },
    ],
  }),
  Qn(4, "Simpangan Kuartil (SQ) – TKA", {
    type: "mixed",
    mathContent: "SQ = \\frac{Q_3 - Q_1}{2} = \\frac{\\text{IQR}}{2}",
    content: "Hitung simpangan kuartil dari data berikut:",
    parts: [
      { label: "a.", math: "Q_1=50, Q_3=80 \\Rightarrow SQ = \\frac{80-50}{2} = \\ldots" },
      { label: "b.", math: "Q_1=63, Q_3=89 \\Rightarrow SQ = \\ldots" },
      { label: "c.", text: "Apa yang dimaksud dengan simpangan kuartil? Apa kegunaannya?" },
    ],
  }),
  Qn(5, "Menghitung IQR dari Data Terurut – ANBK", {
    type: "mixed",
    content: "Data nilai 10 siswa (sudah urut): 55, 60, 65, 70, 72, 75, 80, 82, 88, 95.",
    parts: [
      { label: "a.", math: "Q_1 = x_{2{,}75} = 60+0{,}75(5) = 63{,}75" },
      { label: "b.", math: "Q_3 = x_{8{,}25} = 82+0{,}25(6) = 83{,}5" },
      { label: "c.", math: "\\text{IQR} = 83{,}5 - 63{,}75 = \\ldots, \\quad SQ = \\frac{\\text{IQR}}{2} = \\ldots" },
    ],
  }),
  Qn(6, "Simpangan Rata-Rata – UN", {
    type: "mixed",
    diagram: <TableSimpangan />,
    mathContent: "SR = \\frac{\\sum |x_i - \\bar{x}|}{n}",
    content: "Data: 4, 5, 7, 8, 11. Rata-rata = 7.",
    parts: [
      { label: "a.", math: "|4-7|=3, |5-7|=2, |7-7|=0, |8-7|=1, |11-7|=4" },
      { label: "b.", math: "\\sum |x_i - \\bar{x}| = 3+2+0+1+4 = \\ldots" },
      { label: "c.", math: "SR = \\frac{10}{5} = \\ldots" },
    ],
  }),
  Qn(7, "Varians Data Tunggal – TKA", {
    type: "mixed",
    mathContent: "s^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n}",
    content: "Data: 4, 5, 7, 8, 11. Rata-rata = 7.",
    parts: [
      { label: "a.", math: "(4-7)^2+(5-7)^2+(7-7)^2+(8-7)^2+(11-7)^2 = 9+4+0+1+16 = \\ldots" },
      { label: "b.", math: "s^2 = \\frac{30}{5} = \\ldots" },
      { label: "c.", math: "s = \\sqrt{s^2} = \\sqrt{6} \\approx \\ldots" },
    ],
  }),
  Qn(8, "Simpangan Baku – ANBK", {
    type: "mixed",
    mathContent: "s = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{n}}",
    content: "Data nilai: 6, 7, 8, 9, 10.",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{6+7+8+9+10}{5} = 8" },
      { label: "b.", math: "\\sum(x_i-\\bar{x})^2 = 4+1+0+1+4 = 10 \\Rightarrow s^2 = \\frac{10}{5} = 2" },
      { label: "c.", math: "s = \\sqrt{2} \\approx \\ldots" },
    ],
  }),
  Qn(9, "Jangkauan Data Berkelompok – UN", {
    type: "mixed",
    content: "Tabel distribusi: kelas pertama 40–49 (f=3) dan kelas terakhir 80–89 (f=4).",
    parts: [
      { label: "a.", text: "Nilai terkecil perkiraan = batas bawah kelas pertama = 40." },
      { label: "b.", text: "Nilai terbesar perkiraan = batas atas kelas terakhir = 89." },
      { label: "c.", math: "J \\approx 89 - 40 = \\ldots" },
    ],
  }),
  Qn(10, "IQR dari Tabel Distribusi – TKA", {
    type: "mixed",
    content: "Data: 50–59 (f=4), 60–69 (f=8), 70–79 (f=14), 80–89 (f=10), 90–99 (f=4). n=40.",
    parts: [
      { label: "a.", math: "Q_1 = 59{,}5+10\\cdot\\frac{10-4}{8} = 59{,}5+7{,}5 = 67 \\text{ (dihitung sebelumnya)}" },
      { label: "b.", math: "Q_3 = 79{,}5+10\\cdot\\frac{30-26}{10} = 79{,}5+4 = 83{,}5" },
      { label: "c.", math: "\\text{IQR} = 83{,}5-67 = \\ldots, \\quad SQ = \\frac{\\text{IQR}}{2} = \\ldots" },
    ],
  }),
  Qn(11, "Varians dan Simpangan Baku Berbobot – UN", {
    type: "mixed",
    mathContent: "s^2 = \\frac{\\sum f_i(x_i - \\bar{x})^2}{\\sum f_i}",
    content: "Nilai (frekuensi): 6 (2), 7 (5), 8 (8), 9 (4), 10 (1). x̄ = 7,75.",
    parts: [
      { label: "a.", math: "\\sum f_i(x_i-\\bar{x})^2 = 2(1{,}75)^2+5(0{,}75)^2+8(0{,}25)^2+4(1{,}25)^2+1(2{,}25)^2" },
      { label: "b.", math: "= 2(3{,}0625)+5(0{,}5625)+8(0{,}0625)+4(1{,}5625)+1(5{,}0625) = \\ldots" },
      { label: "c.", math: "s^2 = \\frac{\\ldots}{20} = \\ldots, \\quad s = \\ldots" },
    ],
  }),
  Qn(12, "Perbandingan Penyebaran Dua Data – ANBK", {
    type: "mixed",
    content: "Kelas A: nilai 70, 72, 74, 76, 78 (rata-rata=74)\nKelas B: nilai 60, 68, 74, 80, 88 (rata-rata=74)",
    parts: [
      { label: "a.", text: "Hitung jangkauan masing-masing kelas." },
      { label: "b.", text: "Hitung simpangan baku masing-masing kelas." },
      { label: "c.", text: "Kelas mana yang datanya lebih seragam? Jelaskan." },
    ],
  }),
  Qn(13, "Soal Cerita Jangkauan – UN", {
    type: "mixed",
    content: "Suhu udara selama 7 hari: 28, 30, 27, 32, 29, 31, 26 °C.",
    parts: [
      { label: "a.", math: "J = T_{\\max} - T_{\\min} = 32-26 = \\ldots ^\\circ C" },
      { label: "b.", math: "\\bar{T} = \\frac{28+30+27+32+29+31+26}{7} = \\ldots ^\\circ C" },
      { label: "c.", text: "Apa arti jangkauan dalam konteks suhu udara ini?" },
    ],
  }),
  Qn(14, "Koefisien Variasi – TKA", {
    type: "mixed",
    mathContent: "KV = \\frac{s}{\\bar{x}} \\times 100\\%",
    content: "Dua kelompok data: A (x̄=50, s=5) dan B (x̄=100, s=8).",
    parts: [
      { label: "a.", math: "KV_A = \\frac{5}{50} \\times 100\\% = \\ldots \\%" },
      { label: "b.", math: "KV_B = \\frac{8}{100} \\times 100\\% = \\ldots \\%" },
      { label: "c.", text: "Kelompok mana yang lebih homogen? Jelaskan." },
    ],
  }),
  Qn(15, "Jangkauan Interkuartil dari Data – ANBK", {
    type: "mixed",
    content: "Data (sudah urut): 10, 15, 20, 25, 30, 35, 40, 45, 50.",
    parts: [
      { label: "a.", math: "Q_1 = x_{\\frac{10}{4}} = x_{2{,}5} = \\frac{15+20}{2} = \\ldots" },
      { label: "b.", math: "Q_3 = x_{7{,}5} = \\frac{40+45}{2} = \\ldots" },
      { label: "c.", math: "\\text{IQR} = 42{,}5 - 17{,}5 = \\ldots, \\quad SQ = \\frac{\\text{IQR}}{2} = \\ldots" },
    ],
  }),
  Qn(16, "Simpangan Rata-Rata Berbobot – UN", {
    type: "mixed",
    mathContent: "SR = \\frac{\\sum f_i |x_i - \\bar{x}|}{\\sum f_i}",
    content: "Nilai (frekuensi): 5 (3), 7 (5), 9 (2). Hitung simpangan rata-rata.",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{3(5)+5(7)+2(9)}{10} = \\frac{15+35+18}{10} = \\frac{68}{10} = 6{,}8" },
      { label: "b.", math: "\\sum f_i|x_i-\\bar{x}| = 3|5-6{,}8|+5|7-6{,}8|+2|9-6{,}8| = 3(1{,}8)+5(0{,}2)+2(2{,}2) = \\ldots" },
      { label: "c.", math: "SR = \\frac{\\ldots}{10} = \\ldots" },
    ],
  }),
  Qn(17, "Deteksi Pencilan dari IQR – TKA", {
    type: "mixed",
    content: "Data: 20, 22, 24, 26, 28, 30, 32, 34, 36, 80. Q₁=23, Q₃=33.",
    parts: [
      { label: "a.", math: "\\text{IQR} = 33-23 = 10" },
      { label: "b.", math: "\\text{Batas bawah} = 23-1{,}5(10) = 8, \\quad \\text{Batas atas} = 33+1{,}5(10) = 48" },
      { label: "c.", text: "Apakah nilai 80 merupakan pencilan? Jelaskan." },
    ],
  }),
  Qn(18, "Varians dengan Rumus Alternatif – ANBK", {
    type: "mixed",
    mathContent: "s^2 = \\frac{\\sum x_i^2}{n} - \\bar{x}^2",
    content: "Data: 3, 4, 5, 6, 7.",
    parts: [
      { label: "a.", math: "\\bar{x} = 5, \\quad \\sum x_i^2 = 9+16+25+36+49 = 135" },
      { label: "b.", math: "s^2 = \\frac{135}{5} - 5^2 = 27 - 25 = \\ldots" },
      { label: "c.", math: "s = \\sqrt{2} \\approx \\ldots" },
    ],
  }),
  Qn(19, "Simpangan Baku Data Berbobot – UN", {
    type: "mixed",
    content: "Nilai (frekuensi): 60 (4), 70 (8), 80 (12), 90 (6). x̄ = 77.",
    parts: [
      { label: "a.", math: "\\sum f_i(x_i-\\bar{x})^2 = 4(17)^2+8(7)^2+12(3)^2+6(13)^2 = \\ldots" },
      { label: "b.", math: "= 4(289)+8(49)+12(9)+6(169) = 1156+392+108+1014 = \\ldots" },
      { label: "c.", math: "s^2 = \\frac{2670}{30} = 89, \\quad s = \\sqrt{89} \\approx \\ldots" },
    ],
  }),
  Qn(20, "Membandingkan Tiga Ukuran Penyebaran – TKA", {
    type: "mixed",
    content: "Data A: 4, 6, 8, 10, 12. Data B: 2, 4, 8, 12, 14.",
    parts: [
      { label: "a.", text: "Hitung jangkauan kedua data." },
      { label: "b.", text: "Hitung IQR kedua data." },
      { label: "c.", text: "Data mana yang lebih bervariasi? Jelaskan dengan menggunakan jangkauan dan IQR." },
    ],
  }),
  Qn(21, "Ukuran Penyebaran dalam Kehidupan – ANBK", {
    type: "mixed",
    content: "Investasi A: rata-rata keuntungan 10% per tahun, simpangan baku 2%.\nInvestasi B: rata-rata keuntungan 12% per tahun, simpangan baku 5%.",
    parts: [
      { label: "a.", text: "Investasi mana yang lebih stabil?" },
      { label: "b.", math: "KV_A = \\frac{2}{10}\\times100\\% = 20\\%, \\quad KV_B = \\frac{5}{12}\\times100\\% = \\ldots \\%" },
      { label: "c.", text: "Jika kamu menghindari risiko, investasi mana yang kamu pilih? Jelaskan." },
    ],
  }),
  Qn(22, "Simpangan Kuartil dari Tabel – UN", {
    type: "mixed",
    content: "Tabel: 30–39 (f=4), 40–49 (f=10), 50–59 (f=16), 60–69 (f=12), 70–79 (f=8). n=50.",
    parts: [
      { label: "a.", math: "Q_1: \\frac{n}{4}=12{,}5 \\Rightarrow \\text{kelas 40–49} \\Rightarrow Q_1 = 39{,}5+10\\cdot\\frac{12{,}5-4}{10} = \\ldots" },
      { label: "b.", math: "Q_3: \\frac{3n}{4}=37{,}5 \\Rightarrow \\text{kelas 60–69} \\Rightarrow Q_3 = 59{,}5+10\\cdot\\frac{37{,}5-30}{12} = \\ldots" },
      { label: "c.", math: "SQ = \\frac{Q_3-Q_1}{2} = \\ldots" },
    ],
  }),
  Qn(23, "Hubungan Varians dan Simpangan Baku – TKA", {
    type: "mixed",
    content: "Jika varians suatu data adalah 25:",
    parts: [
      { label: "a.", math: "s = \\sqrt{25} = \\ldots" },
      { label: "b.", text: "Jika semua nilai data ditambah 10, apakah varians berubah? Mengapa?" },
      { label: "c.", text: "Jika semua nilai data dikali 2, bagaimana perubahan varians?" },
    ],
  }),
  Qn(24, "Soal Cerita Simpangan Baku – ANBK", {
    type: "mixed",
    content: "Produksi harian pabrik selama 5 hari (unit): 100, 105, 98, 103, 104.",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{100+105+98+103+104}{5} = \\frac{510}{5} = \\ldots" },
      { label: "b.", math: "\\sum(x_i-\\bar{x})^2 = (-2)^2+3^2+(-4)^2+1^2+2^2 = 4+9+16+1+4 = \\ldots" },
      { label: "c.", math: "s = \\sqrt{\\frac{34}{5}} = \\sqrt{6{,}8} \\approx \\ldots" },
    ],
  }),
  Qn(25, "Sifat Simpangan Baku – UN", {
    type: "mixed",
    content: "Data: 5, 5, 5, 5, 5 (semua nilai sama).",
    parts: [
      { label: "a.", math: "\\bar{x} = 5, \\quad \\sum(x_i-\\bar{x})^2 = 0 \\Rightarrow s = \\ldots" },
      { label: "b.", text: "Apa arti simpangan baku = 0?" },
      { label: "c.", text: "Data seperti apa yang memiliki simpangan baku yang sangat besar?" },
    ],
  }),
  Qn(26, "IQR dan Penyebaran Distribusi – TKA", {
    type: "mixed",
    content: "Dua distribusi: A memiliki IQR=10, B memiliki IQR=30. Keduanya memiliki median yang sama.",
    parts: [
      { label: "a.", text: "Distribusi mana yang lebih 'terkonsentrasi' di sekitar median?" },
      { label: "b.", text: "Distribusi mana yang lebih bervariasi?" },
      { label: "c.", math: "SQ_A = \\frac{10}{2} = 5, \\quad SQ_B = \\frac{30}{2} = \\ldots" },
    ],
  }),
  Qn(27, "Varians Data Berkelompok – ANBK", {
    type: "mixed",
    mathContent: "s^2 = \\frac{\\sum f_i x_i^2}{n} - \\bar{x}^2",
    content: "Data: 60 (f=3,x²=3600), 70 (f=5,x²=4900), 80 (f=8,x²=6400), 90 (f=4,x²=8100).",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{3(60)+5(70)+8(80)+4(90)}{20} = \\frac{1560}{20} = 78" },
      { label: "b.", math: "\\frac{\\sum f_i x_i^2}{n} = \\frac{3(3600)+5(4900)+8(6400)+4(8100)}{20} = \\frac{124500}{20} = \\ldots" },
      { label: "c.", math: "s^2 = 6225 - 78^2 = 6225 - 6084 = \\ldots, \\quad s = \\sqrt{141} \\approx \\ldots" },
    ],
  }),
  Qn(28, "Soal UN – Lengkap Semua Ukuran Penyebaran", {
    type: "mixed",
    content: "Data: 10, 14, 16, 18, 20, 22, 24, 26, 30.",
    parts: [
      { label: "a.", math: "J = 30-10 = \\ldots" },
      { label: "b.", math: "Q_1=15, Q_3=25 \\Rightarrow \\text{IQR}=10, SQ=5" },
      { label: "c.", math: "\\bar{x}=20, \\sum(x_i-20)^2=200 \\Rightarrow s^2=\\frac{200}{9}\\approx 22{,}2, s\\approx \\ldots" },
    ],
  }),
  Qn(29, "Soal ANBK – Memilih Ukuran Penyebaran", {
    type: "mixed",
    content: "Tentukan ukuran penyebaran yang paling tepat untuk situasi berikut:",
    parts: [
      { label: "a.", text: "Data gaji karyawan dengan satu manajer bergaji sangat tinggi → gunakan apa?" },
      { label: "b.", text: "Data nilai ujian yang terdistribusi normal → gunakan apa?" },
      { label: "c.", text: "Membandingkan variabilitas dua data yang berbeda skala → gunakan apa?" },
    ],
  }),
  Qn(30, "Soal TKA – Efek Penambahan Konstanta", {
    type: "mixed",
    content: "Diketahui data dengan rata-rata 70 dan simpangan baku 8. Setiap nilai ditambah 10.",
    parts: [
      { label: "a.", math: "\\bar{x}_{\\text{baru}} = 70+10 = \\ldots" },
      { label: "b.", math: "s_{\\text{baru}} = \\ldots \\text{ (tidak berubah, karena penyebaran relatif tidak berubah)}" },
      { label: "c.", text: "Jelaskan mengapa simpangan baku tidak berubah ketika semua data ditambah konstanta." },
    ],
  }),
  Qn(31, "Soal UN – Efek Perkalian Konstanta", {
    type: "mixed",
    content: "Diketahui data dengan rata-rata 50 dan simpangan baku 6. Setiap nilai dikali 3.",
    parts: [
      { label: "a.", math: "\\bar{x}_{\\text{baru}} = 3 \\times 50 = \\ldots" },
      { label: "b.", math: "s_{\\text{baru}} = 3 \\times 6 = \\ldots" },
      { label: "c.", math: "s^2_{\\text{baru}} = 3^2 \\times s^2 = 9 \\times 36 = \\ldots" },
    ],
  }),
  Qn(32, "Soal ANBK – Semua Ukuran Penyebaran", {
    type: "mixed",
    content: "Data nilai 8 siswa: 60, 65, 70, 72, 75, 80, 85, 93.",
    parts: [
      { label: "a.", math: "J = 93-60 = \\ldots" },
      { label: "b.", math: "Q_1 = \\frac{65+70}{2} = 67{,}5, \\; Q_3 = \\frac{80+85}{2} = 82{,}5 \\Rightarrow \\text{IQR} = \\ldots" },
      { label: "c.", math: "SQ = \\frac{\\text{IQR}}{2} = \\ldots" },
    ],
  }),
  Qn(33, "Soal TKA – Simpangan Rata-Rata Lengkap", {
    type: "mixed",
    content: "Data: 2, 4, 6, 8, 10.",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{2+4+6+8+10}{5} = 6" },
      { label: "b.", math: "|2-6|+|4-6|+|6-6|+|8-6|+|10-6| = 4+2+0+2+4 = \\ldots" },
      { label: "c.", math: "SR = \\frac{12}{5} = \\ldots" },
    ],
  }),
  Qn(34, "Soal UN – Penyebaran dan Prestasi", {
    type: "mixed",
    content: "Nilai ujian Kelas A: rata-rata 80, simpangan baku 3.\nNilai ujian Kelas B: rata-rata 80, simpangan baku 10.",
    parts: [
      { label: "a.", text: "Kelas mana yang nilainya lebih seragam?" },
      { label: "b.", text: "Di kelas mana lebih mungkin ada siswa dengan nilai sangat tinggi atau sangat rendah?" },
      { label: "c.", text: "Kesimpulan apa yang dapat kamu buat tentang kualitas pembelajaran di dua kelas tersebut?" },
    ],
  }),
  Qn(35, "Soal ANBK – Jangkauan dari Histogram", {
    type: "mixed",
    content: "Dari histogram: kelas terendah 30–39 (f=2) dan kelas tertinggi 80–89 (f=3).",
    parts: [
      { label: "a.", math: "J_{\\text{estimasi}} = \\text{batas atas kelas terakhir} - \\text{batas bawah kelas pertama}" },
      { label: "b.", math: "J = 89 - 30 = \\ldots" },
      { label: "c.", text: "Mengapa jangkauan dari data berkelompok hanya merupakan estimasi?" },
    ],
  }),
  Qn(36, "Soal TKA – SQ dari Tabel Distribusi", {
    type: "mixed",
    content: "Data nilai: 50–59 (f=5), 60–69 (f=10), 70–79 (f=20), 80–89 (f=10), 90–99 (f=5). n=50.",
    parts: [
      { label: "a.", math: "Q_1: \\frac{50}{4}=12{,}5 \\Rightarrow \\text{kelas 60–69} \\Rightarrow Q_1 = 59{,}5+10\\cdot\\frac{12{,}5-5}{10} = \\ldots" },
      { label: "b.", math: "Q_3: \\frac{150}{4}=37{,}5 \\Rightarrow \\text{kelas 80–89} \\Rightarrow Q_3 = 79{,}5+10\\cdot\\frac{37{,}5-35}{10} = \\ldots" },
      { label: "c.", math: "SQ = \\frac{Q_3-Q_1}{2} = \\ldots" },
    ],
  }),
  Qn(37, "Soal UN – Interpretasi Penyebaran", {
    type: "mixed",
    diagram: <VariansSimpanganDiagram />,
    content: "Jelaskan perbedaan antara ketiga ukuran penyebaran ini:",
    parts: [
      { label: "a.", text: "Jangkauan: mudah dihitung tapi tidak mempertimbangkan semua data." },
      { label: "b.", text: "IQR/Simpangan Kuartil: lebih tahan terhadap pencilan karena hanya memakai 50% data tengah." },
      { label: "c.", text: "Simpangan Baku: mempertimbangkan semua data, paling informatif untuk distribusi normal." },
    ],
  }),
  Qn(38, "Soal ANBK – Rangkuman Ukuran Penyebaran", {
    type: "mixed",
    content: "Data nilai 6 siswa: 70, 75, 80, 85, 90, 100.",
    parts: [
      { label: "a.", math: "J = 100-70 = \\ldots" },
      { label: "b.", math: "Q_1=\\frac{75+80}{2}=77{,}5, Q_3=\\frac{90+100}{2}=95 \\Rightarrow \\text{IQR}=\\ldots, SQ=\\ldots" },
      { label: "c.", math: "\\bar{x}=\\frac{500}{6}\\approx83{,}3 \\Rightarrow s^2=\\frac{(70-83{,}3)^2+...}{6}=\\ldots" },
    ],
  }),
  Qn(39, "Soal TKA – Analisis Distribusi", {
    type: "mixed",
    content: "Data A: min=10, Q₁=30, Q₂=50, Q₃=70, max=90\nData B: min=20, Q₁=45, Q₂=50, Q₃=55, max=80",
    parts: [
      { label: "a.", math: "\\text{IQR}_A = 70-30=40, \\quad \\text{IQR}_B = 55-45=10" },
      { label: "b.", math: "J_A = 90-10=80, \\quad J_B = 80-20=60" },
      { label: "c.", text: "Dari hasil perhitungan IQR dan Jangkauan, data mana yang lebih homogen? Jelaskan." },
    ],
  }),
  Qn(40, "Soal UN/ANBK/TKA – Gabungan Ukuran Penyebaran", {
    type: "mixed",
    content: "Data nilai ujian 30 siswa:\n50–59: f=3, 60–69: f=5, 70–79: f=12, 80–89: f=7, 90–99: f=3",
    parts: [
      { label: "a.", math: "J_{\\text{estimasi}} = 99-50 = \\ldots" },
      { label: "b.", math: "Q_1: \\frac{30}{4}=7{,}5, \\text{kelas 60–69}, Q_1=59{,}5+10\\cdot\\frac{7{,}5-3}{5}=59{,}5+9=\\ldots" },
      { label: "c.", math: "Q_3: \\frac{90}{4}=22{,}5, \\text{kelas 80–89}, Q_3=79{,}5+10\\cdot\\frac{22{,}5-20}{7}=79{,}5+3{,}57=\\ldots" },
      { label: "d.", math: "\\text{IQR}=Q_3-Q_1=\\ldots, \\quad SQ=\\frac{\\text{IQR}}{2}=\\ldots" },
    ],
  }),
];

const PenyebaranDataPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📡</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,146,60,0.7)' }}>
            UKURAN PENYEBARAN DATA
          </h1>
          <p className="text-orange-200/70 text-sm text-center font-body mb-1">Jangkauan, IQR, dan Simpangan Kuartil</p>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-3">📌 Rumus Kunci</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { name: "Jangkauan", math: "J = x_{\\max} - x_{\\min}" },
              { name: "IQR", math: "\\text{IQR} = Q_3 - Q_1" },
              { name: "Simpangan Kuartil", math: "SQ = \\frac{Q_3-Q_1}{2}" },
              { name: "Simpangan Rata-Rata", math: "SR = \\frac{\\sum|x_i-\\bar{x}|}{n}" },
              { name: "Varians", math: "s^2 = \\frac{\\sum(x_i-\\bar{x})^2}{n}" },
              { name: "Simpangan Baku", math: "s = \\sqrt{s^2}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-3">
                <div className="text-orange-400 text-[9px] uppercase font-bold min-w-[130px]">{r.name}</div>
                <div className="text-orange-200 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-red-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-red-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center shrink-0">
                    <span className="text-orange-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3 whitespace-pre-line">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-orange-900/20 border border-orange-500/20 rounded-lg px-4 py-3 flex justify-center overflow-x-auto"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3 overflow-x-auto">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-orange-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-orange-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};
export default PenyebaranDataPage;
