import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const DiagramBatang = () => (
  <svg width="300" height="180" viewBox="0 0 300 180" className="mx-auto">
    <rect x="4" y="4" width="292" height="172" rx="10" fill="#0d9488" fillOpacity="0.1" stroke="#2dd4bf" strokeWidth="1.5" />
    <text x="150" y="18" fill="#2dd4bf" fontSize="10" textAnchor="middle" fontWeight="bold">Nilai Ulangan Kelas 9A</text>
    <line x1="40" y1="25" x2="40" y2="155" stroke="#2dd4bf" strokeWidth="1.5" />
    <line x1="40" y1="155" x2="285" y2="155" stroke="#2dd4bf" strokeWidth="1.5" />
    {[
      [60, 10, "60"],
      [100, 16, "70"],
      [140, 28, "80"],
      [180, 20, "90"],
      [220, 8, "100"],
    ].map(([x, f, label], i) => {
      const h = Number(f) * 4;
      return (
        <g key={i}>
          <rect x={Number(x)} y={155 - h} width="28" height={h}
            fill={["#0e7490","#0891b2","#06b6d4","#22d3ee","#67e8f9"][i]} fillOpacity="0.85" rx="3" />
          <text x={Number(x) + 14} y={152 - h} fill="#e0f2fe" fontSize="8" textAnchor="middle">{f}</text>
          <text x={Number(x) + 14} y="167" fill="#94a3b8" fontSize="8" textAnchor="middle">{label}</text>
        </g>
      );
    })}
    <text x="150" y="178" fill="#64748b" fontSize="7" textAnchor="middle">Nilai</text>
    {[0,2,4,6,8].map((v,i) => (
      <g key={i}>
        <line x1="37" y1={155 - i*16} x2="40" y2={155 - i*16} stroke="#2dd4bf" strokeWidth="0.8" />
        <text x="33" y={158 - i*16} fill="#94a3b8" fontSize="7" textAnchor="end">{i*2*2}</text>
      </g>
    ))}
  </svg>
);

const DiagramLingkaran = () => (
  <svg width="260" height="180" viewBox="0 0 260 180" className="mx-auto">
    <rect x="4" y="4" width="252" height="172" rx="10" fill="#0d9488" fillOpacity="0.1" stroke="#2dd4bf" strokeWidth="1.5" />
    <text x="130" y="18" fill="#2dd4bf" fontSize="10" textAnchor="middle" fontWeight="bold">Transportasi Siswa</text>
    <circle cx="100" cy="100" r="60" fill="none" stroke="#0e7490" strokeWidth="1" />
    {[
      { start: 0, end: 144, color: "#0e7490", label: "Motor 40%" },
      { start: 144, end: 252, color: "#0891b2", label: "Angkot 30%" },
      { start: 252, end: 324, color: "#06b6d4", label: "Sepeda 20%" },
      { start: 324, end: 360, color: "#22d3ee", label: "Jalan 10%" },
    ].map((seg, i) => {
      const startRad = (seg.start - 90) * Math.PI / 180;
      const endRad = (seg.end - 90) * Math.PI / 180;
      const x1 = 100 + 60 * Math.cos(startRad);
      const y1 = 100 + 60 * Math.sin(startRad);
      const x2 = 100 + 60 * Math.cos(endRad);
      const y2 = 100 + 60 * Math.sin(endRad);
      const large = (seg.end - seg.start) > 180 ? 1 : 0;
      return (
        <g key={i}>
          <path d={`M100,100 L${x1},${y1} A60,60 0 ${large},1 ${x2},${y2} Z`} fill={seg.color} fillOpacity="0.8" stroke="#0f172a" strokeWidth="1" />
          <rect x="175" y={20 + i * 22} width="10" height="10" fill={seg.color} rx="2" />
          <text x="190" y={30 + i * 22} fill="#e0f2fe" fontSize="8">{seg.label}</text>
        </g>
      );
    })}
  </svg>
);

const Histogram = () => (
  <svg width="300" height="180" viewBox="0 0 300 180" className="mx-auto">
    <rect x="4" y="4" width="292" height="172" rx="10" fill="#0d9488" fillOpacity="0.1" stroke="#2dd4bf" strokeWidth="1.5" />
    <text x="150" y="18" fill="#2dd4bf" fontSize="10" textAnchor="middle" fontWeight="bold">Histogram Berat Badan Siswa</text>
    <line x1="40" y1="25" x2="40" y2="155" stroke="#2dd4bf" strokeWidth="1.5" />
    <line x1="40" y1="155" x2="285" y2="155" stroke="#2dd4bf" strokeWidth="1.5" />
    {[
      [40, 5, "40-44"],
      [88, 9, "45-49"],
      [136, 14, "50-54"],
      [184, 10, "55-59"],
      [232, 4, "60-64"],
    ].map(([x, f, label], i) => {
      const h = Number(f) * 7;
      return (
        <g key={i}>
          <rect x={Number(x)} y={155 - h} width="44" height={h}
            fill={["#0e7490","#0891b2","#06b6d4","#22d3ee","#67e8f9"][i]} fillOpacity="0.85" />
          <text x={Number(x) + 22} y={150 - h} fill="#e0f2fe" fontSize="8" textAnchor="middle">{f}</text>
          <text x={Number(x) + 22} y="168" fill="#94a3b8" fontSize="7" textAnchor="middle">{String(label)}</text>
        </g>
      );
    })}
  </svg>
);

const OgiveDiagram = () => (
  <svg width="300" height="170" viewBox="0 0 300 170" className="mx-auto">
    <rect x="4" y="4" width="292" height="162" rx="10" fill="#0d9488" fillOpacity="0.1" stroke="#2dd4bf" strokeWidth="1.5" />
    <text x="150" y="18" fill="#2dd4bf" fontSize="10" textAnchor="middle" fontWeight="bold">Ogive (Poligon Frekuensi Kumulatif)</text>
    <line x1="40" y1="25" x2="40" y2="150" stroke="#2dd4bf" strokeWidth="1.5" />
    <line x1="40" y1="150" x2="280" y2="150" stroke="#2dd4bf" strokeWidth="1.5" />
    {[[50,150],[90,140],[130,120],[170,90],[210,55],[250,30],[280,25]].map(([x,y], i, arr) => {
      if (i === 0) return null;
      const [px, py] = arr[i-1];
      return <line key={i} x1={px} y1={py} x2={x} y2={y} stroke="#22d3ee" strokeWidth="2" />;
    })}
    {[[50,150],[90,140],[130,120],[170,90],[210,55],[250,30],[280,25]].map(([x,y], i) => (
      <circle key={i} cx={x} cy={y} r="3" fill="#22d3ee" />
    ))}
    {["59","69","79","89","99"].map((v, i) => (
      <text key={i} x={90 + i*40} y="162" fill="#94a3b8" fontSize="7" textAnchor="middle">≤{v}</text>
    ))}
  </svg>
);

const PoligonFrekuensi = () => (
  <svg width="300" height="170" viewBox="0 0 300 170" className="mx-auto">
    <rect x="4" y="4" width="292" height="162" rx="10" fill="#0d9488" fillOpacity="0.1" stroke="#2dd4bf" strokeWidth="1.5" />
    <text x="150" y="18" fill="#2dd4bf" fontSize="10" textAnchor="middle" fontWeight="bold">Poligon Frekuensi Nilai Matematika</text>
    <line x1="40" y1="25" x2="40" y2="150" stroke="#2dd4bf" strokeWidth="1.5" />
    <line x1="40" y1="150" x2="280" y2="150" stroke="#2dd4bf" strokeWidth="1.5" />
    {[[60,145],[85,130],[110,100],[135,80],[160,60],[185,75],[210,110],[235,130],[260,145]].map(([x,y], i, arr) => {
      if (i === 0) return null;
      const [px, py] = arr[i-1];
      return <line key={i} x1={px} y1={py} x2={x} y2={y} stroke="#06b6d4" strokeWidth="2" />;
    })}
    {[[60,145],[85,130],[110,100],[135,80],[160,60],[185,75],[210,110],[235,130],[260,145]].map(([x,y], i) => (
      <circle key={i} cx={x} cy={y} r="3" fill="#22d3ee" />
    ))}
  </svg>
);

const DiagramGarisPanen = () => {
  const pts: [number, number][] = [[65,125],[110,95],[155,125],[200,65],[245,47]];
  const years = ["2002","2003","2004","2005","2006"];
  const yVals = [10,20,30,40,50];
  return (
    <svg width="260" height="190" viewBox="0 0 260 190" className="mx-auto">
      <rect x="4" y="4" width="252" height="182" rx="10" fill="#0d9488" fillOpacity="0.1" stroke="#2dd4bf" strokeWidth="1.5" />
      <line x1="42" y1="20" x2="42" y2="155" stroke="white" strokeWidth="1.5" />
      <line x1="42" y1="155" x2="255" y2="155" stroke="white" strokeWidth="1.5" />
      <line x1="255" y1="155" x2="261" y2="155" stroke="white" strokeWidth="2" markerEnd="url(#arrowX)" />
      {yVals.map((v, i) => {
        const y = 155 - i * 27;
        return (
          <g key={v}>
            <line x1="39" y1={y} x2="42" y2={y} stroke="white" strokeWidth="1" />
            <text x="36" y={y + 4} fill="white" fontSize="8" textAnchor="end">{v}</text>
            <line x1="42" y1={y} x2="250" y2={y} stroke="white" strokeWidth="0.4" strokeDasharray="3,3" opacity="0.4" />
          </g>
        );
      })}
      {years.map((yr, i) => {
        const x = pts[i][0];
        return (
          <g key={yr}>
            <line x1={x} y1="155" x2={x} y2="158" stroke="white" strokeWidth="1" />
            <text x={x} y="172" fill="white" fontSize="7.5" textAnchor="middle" transform={`rotate(-45, ${x}, 172)`}>{yr}</text>
          </g>
        );
      })}
      {pts.map(([x,y], i, arr) => {
        if (i === 0) return null;
        const [px, py] = arr[i-1];
        return <line key={i} x1={px} y1={py} x2={x} y2={y} stroke="#22d3ee" strokeWidth="2" />;
      })}
      {pts.map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#22d3ee" stroke="white" strokeWidth="1" />
      ))}
      <text x="22" y="90" fill="white" fontSize="7" textAnchor="middle" transform="rotate(-90, 22, 90)">Hasil Panen Padi (ton)</text>
      <text x="255" y="150" fill="white" fontSize="7.5" textAnchor="start">Tahun</text>
    </svg>
  );
};

const TabelDistribusiIPA = () => {
  const rows = [["55","3"],["60","5"],["65","8"],["70","6"],["75","4"],["80","2"],["85","2"]];
  const rowH = 22, headerH = 28, padX = 20, col1W = 90, col2W = 90;
  const totalW = padX * 2 + col1W + col2W;
  const totalH = headerH + rows.length * rowH + 16;
  return (
    <svg width={totalW} height={totalH} viewBox={`0 0 ${totalW} ${totalH}`} className="mx-auto">
      <rect x="2" y="2" width={totalW - 4} height={totalH - 4} rx="8" fill="#0d9488" fillOpacity="0.1" stroke="#2dd4bf" strokeWidth="1.5" />
      <rect x="2" y="2" width={totalW - 4} height={headerH} rx="8" fill="#0d9488" fillOpacity="0.4" />
      <rect x="2" y="2" width={totalW - 4} height={headerH - 4} fill="#0d9488" fillOpacity="0.4" />
      <text x={padX + col1W / 2} y={headerH / 2 + 5} fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Nilai</text>
      <line x1={padX + col1W} y1="2" x2={padX + col1W} y2={totalH - 2} stroke="#2dd4bf" strokeWidth="1" />
      <text x={padX + col1W + col2W / 2} y={headerH / 2 + 5} fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Frekuensi</text>
      <line x1="2" y1={headerH} x2={totalW - 2} y2={headerH} stroke="#2dd4bf" strokeWidth="1" />
      {rows.map(([val, freq], i) => {
        const y = headerH + i * rowH;
        const isEven = i % 2 === 0;
        return (
          <g key={i}>
            {isEven && <rect x="3" y={y} width={totalW - 6} height={rowH} fill="white" fillOpacity="0.03" />}
            <line x1="2" y1={y + rowH} x2={totalW - 2} y2={y + rowH} stroke="#2dd4bf" strokeWidth="0.5" opacity="0.4" />
            <text x={padX + col1W / 2} y={y + rowH / 2 + 4} fill="white" fontSize="10" textAnchor="middle">{val}</text>
            <text x={padX + col1W + col2W / 2} y={y + rowH / 2 + 4} fill="white" fontSize="10" textAnchor="middle">{freq}</text>
          </g>
        );
      })}
    </svg>
  );
};

const DiagramBatangPeminjaman = () => {
  const bars = [
    { label: "VIII A", value: 80, color: "#0891b2" },
    { label: "VIII B", value: 95, color: "#06b6d4" },
    { label: "VIII C", value: 60, color: "#22d3ee" },
    { label: "VIII D", value: 75, color: "#67e8f9" },
  ];
  const x1 = 55, y1 = 20, y2 = 210;
  const chartH = y2 - y1;
  const scale = chartH / 100;
  const groupW = 62.5;
  const barW = 40;
  const margin = (groupW - barW) / 2;
  const gridVals = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  return (
    <svg width="320" height="250" viewBox="0 0 320 250" className="mx-auto">
      <rect x="2" y="2" width="316" height="246" rx="10" fill="#0d9488" fillOpacity="0.1" stroke="#2dd4bf" strokeWidth="1.5" />
      <text x="160" y="16" fill="#2dd4bf" fontSize="10" textAnchor="middle" fontWeight="bold">Data Peminjaman Buku</text>
      {gridVals.map(v => {
        const gy = y2 - v * scale;
        return (
          <g key={v}>
            <line x1={x1} y1={gy} x2={305} y2={gy} stroke="#2dd4bf" strokeWidth="0.4" strokeDasharray="3,3" opacity="0.4" />
            <line x1={x1 - 4} y1={gy} x2={x1} y2={gy} stroke="#2dd4bf" strokeWidth="1" />
            <text x={x1 - 6} y={gy + 3} fill="#94a3b8" fontSize="7" textAnchor="end">{v}</text>
          </g>
        );
      })}
      <line x1={x1} y1={y1} x2={x1} y2={y2} stroke="#2dd4bf" strokeWidth="1.5" />
      <line x1={x1} y1={y2} x2={305} y2={y2} stroke="#2dd4bf" strokeWidth="1.5" />
      {bars.map((b, i) => {
        const bx = x1 + i * groupW + margin;
        const bh = b.value * scale;
        const by = y2 - bh;
        const cx = bx + barW / 2;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={barW} height={bh} fill={b.color} fillOpacity="0.85" rx="3" />
            <text x={cx} y={y2 + 11} fill="#94a3b8" fontSize="7.5" textAnchor="middle">{b.label}</text>
          </g>
        );
      })}
      <text x="160" y="242" fill="#64748b" fontSize="8" textAnchor="middle">Kelas</text>
      <text x="10" y="115" fill="#64748b" fontSize="8" textAnchor="middle" transform="rotate(-90, 10, 115)">Banyak Siswa</text>
    </svg>
  );
};

const questions: Q[] = [
  Qn(1, "Nilai Tertinggi dan Terendah – Dasar", {
    type: "essay",
    content: "Hitunglah nilai tertinggi dan terendah dari setiap kelompok data berikut:\na. 3, 6, 5, 7, 7, 9, 6, 8, 10, 4, 12\nb. 6, 8, 5, 9, 3, 7, 4, 6, 8, 11, 9, 7, 5\nc. 45, 42, 36, 51, 47, 44, 50, 41, 38",
  }),
  Qn(2, "Diagram Batang Daun – UN", {
    type: "essay",
    content: "Perhatikan data nilai ujian 36 siswa berikut!\n72 58 84 67 91 75\n63 88 79 55 69 83\n74 96 61 77 85 66\n92 70 81 54 76 89\n73 60 87 95 68 78\n90 64 71 82 57 93",
    parts: [
      { label: "a.", text: "Buatlah diagram batang-daun dari data di atas!" },
      { label: "b.", text: "Tentukan nilai terbesar dan terkecil!" },
      { label: "c.", text: "Berapa banyak nilai yang lebih dari 80?" },
    ],
  }),
  Qn(3, "Membuat Tabel Distribusi Frekuensi – TKA", {
    type: "essay",
    content: "Data nilai ujian matematika sekelompok siswa adalah sebagai berikut:\n65 80 70 90 75 85 70 95 80 65\n75 85 70 80 60 70 90 75 80 65\n90 95 65 85 70 75 80 60 65 75",
    parts: [
      { label: "a.", text: "Buatlah tabel distribusi frekuensi dari data di atas!" },
      { label: "b.", text: "Buatlah diagram batang dari data di atas!" },
      { label: "c.", text: "Buatlah diagram garis dari data di atas!" },
      { label: "d.", text: "Buatlah diagram lingkaran dari data di atas dengan satuan persen!" },
      { label: "e.", text: "Buatlah diagram lingkaran dari data di atas dengan satuan derajat!" },
    ],
  }),
  Qn(4, "Membaca Tabel Distribusi Frekuensi – UN", {
    type: "mixed",
    diagram: <TabelDistribusiIPA />,
    content: "Hasil ulangan IPA siswa kelas 9 disajikan pada tabel distribusi frekuensi berikut.",
    parts: [
      { label: "a.", text: "Nilai berapakah yang paling banyak diperoleh siswa?" },
      { label: "b.", text: "Berapa banyak siswa yang memperoleh nilai lebih dari 65?" },
    ],
  }),
  Qn(5, "Data Peminjaman Buku – Diagram Batang", {
    type: "mixed",
    diagram: <DiagramBatangPeminjaman />,
    content: "Data peminjaman buku dari setiap kelas VIII adalah sebagai berikut.",
    parts: [
      { label: "a.", text: "Kelas mana yang meminjam buku paling banyak?" },
      { label: "b.", text: "Kelas mana yang meminjam buku paling sedikit?" },
      { label: "c.", text: "Tentukan selisih banyak siswa yang meminjam buku antara kelas VIII A dan VIII D!" },
    ],
  }),
  Qn(6, "Distribusi Frekuensi Data Kategori – ANBK", {
    type: "essay",
    content: "Data berikut merupakan catatan jumlah buku yang dimiliki siswa di suatu kelas.\n2 4 3 2 5 1 3\n3 1 2 4 2 5 4 1 2 4\n4 3 5 1 4 3 5 4 2 3\n1 3 1 4 3 2 2 1 4 2",
    parts: [
      { label: "a.", text: "Buatlah tabel distribusi frekuensinya!" },
      { label: "b.", text: "Berapa banyak siswa yang memiliki lebih dari 3 buku?" },
    ],
  }),
  Qn(7, "Diagram Batang – UN", {
    type: "mixed",
    diagram: <DiagramBatang />,
    content: "Perhatikan diagram batang nilai ulangan kelas 9A di atas.",
    parts: [
      { label: "a.", text: "Berapa banyak siswa yang mendapat nilai 80?" },
      { label: "b.", text: "Berapa total siswa dalam kelas tersebut?" },
      { label: "c.", text: "Berapa persen siswa yang mendapat nilai di atas 70?" },
    ],
  }),
  Qn(8, "Diagram Lingkaran – ANBK", {
    type: "mixed",
    diagram: <DiagramLingkaran />,
    content: "Diagram lingkaran menunjukkan moda transportasi 200 siswa ke sekolah.",
    parts: [
      { label: "a.", text: "Berapa siswa yang menggunakan motor?" },
      { label: "b.", text: "Berapa derajat sudut sektor untuk 'Angkot 30%'?" },
      { label: "c.", math: "\\text{Sudut sektor} = \\frac{\\%}{100} \\times 360^\\circ" },
    ],
  }),
  Qn(9, "Histogram – TKA", {
    type: "mixed",
    diagram: <Histogram />,
    content: "Perhatikan histogram berat badan siswa di atas.",
    parts: [
      { label: "a.", text: "Tentukan modus dari data tersebut (kelas dengan frekuensi terbesar)." },
      { label: "b.", text: "Berapa total siswa yang memiliki berat badan 50–59 kg?" },
      { label: "c.", text: "Buat tabel distribusi frekuensi dari histogram tersebut." },
    ],
  }),
  Qn(10, "Membuat Diagram Batang – TKA", {
    type: "mixed",
    content: "Data jumlah buku yang dibaca siswa per bulan: 1 buku (5 siswa), 2 buku (8 siswa), 3 buku (12 siswa), 4 buku (7 siswa), 5 buku (3 siswa).",
    parts: [
      { label: "a.", text: "Gambar diagram batang dari data tersebut (deskripsikan sumbu-sumbunya)." },
      { label: "b.", text: "Berapakah total siswa?" },
      { label: "c.", math: "\\text{Persen siswa membaca 3 buku} = \\frac{12}{35} \\times 100\\% = \\ldots" },
    ],
  }),
  Qn(11, "Membuat Diagram Lingkaran – ANBK", {
    type: "mixed",
    mathContent: "\\text{Besar sudut} = \\frac{f_i}{n} \\times 360^\\circ",
    content: "Hobi siswa kelas 9: Olahraga (12), Musik (8), Membaca (6), Menggambar (4). Total = 30 siswa.",
    parts: [
      { label: "a.", math: "\\text{Sudut 'Olahraga'} = \\frac{12}{30} \\times 360^\\circ = \\ldots ^\\circ" },
      { label: "b.", math: "\\text{Sudut 'Musik'} = \\frac{8}{30} \\times 360^\\circ = \\ldots ^\\circ" },
      { label: "c.", math: "\\text{Sudut 'Membaca'} = \\frac{6}{30} \\times 360^\\circ = \\ldots ^\\circ" },
    ],
  }),
  Qn(12, "Diagram Garis – Hasil Panen Padi", {
    type: "mixed",
    diagram: <DiagramGarisPanen />,
    content: "Perhatikan diagram garis hasil panen padi (ton) di atas.",
    parts: [
      { label: "a.", text: "Hasil panen pada tahun 2005 adalah … ton" },
      { label: "b.", text: "Pada tahun berapa hasil panen mencapai nilai tertinggi?" },
      { label: "c.", text: "Bagaimana tren hasil panen dari tahun 2002 hingga 2006?" },
    ],
  }),
  Qn(13, "Membaca Tabel Distribusi – ANBK", {
    type: "mixed",
    content: "Tabel distribusi frekuensi nilai matematika:\n50–59: f=3, 60–69: f=7, 70–79: f=15, 80–89: f=10, 90–99: f=5. Total n=40.",
    parts: [
      { label: "a.", text: "Berapa persen siswa yang nilai 70–89?" },
      { label: "b.", math: "\\frac{15+10}{40} \\times 100\\% = \\ldots \\%" },
      { label: "c.", text: "Kelas interval mana yang memiliki frekuensi terbesar (kelas modus)?" },
    ],
  }),
  Qn(14, "Sudut Diagram Lingkaran – ANBK", {
    type: "mixed",
    mathContent: "\\text{Besar sudut} = \\frac{f}{n} \\times 360^\\circ",
    content: "Dari 60 siswa: A (18), B (15), C (12), D (9), E (6). Hitung sudut tiap bagian:",
    parts: [
      { label: "a.", math: "A: \\frac{18}{60} \\times 360^\\circ = \\ldots ^\\circ" },
      { label: "b.", math: "B: \\frac{15}{60} \\times 360^\\circ = \\ldots ^\\circ" },
      { label: "c.", math: "C: \\frac{12}{60} \\times 360^\\circ = \\ldots ^\\circ" },
    ],
  }),
  Qn(15, "Mengubah Diagram ke Tabel – TKA", {
    type: "mixed",
    content: "Dari diagram lingkaran diketahui: Sepeda motor = 120°, Mobil = 90°, Angkot = 72°, Sepeda = 48°, Jalan kaki = 30°.",
    parts: [
      { label: "a.", math: "\\text{Jika total 360 siswa, persentase sepeda motor} = \\frac{120}{360} \\times 100\\% = \\ldots" },
      { label: "b.", text: "Berapa siswa yang menggunakan mobil?" },
      { label: "c.", text: "Buat tabel frekuensi dari data diagram lingkaran tersebut." },
    ],
  }),
  Qn(16, "Stem-and-Leaf Plot – ANBK", {
    type: "mixed",
    content: "Data nilai 20 siswa: 72, 85, 68, 91, 74, 83, 79, 66, 87, 93, 71, 88, 76, 62, 84, 95, 77, 89, 64, 90",
    parts: [
      { label: "a.", text: "Buat diagram stem-and-leaf (batang daun) dari data tersebut." },
      { label: "b.", text: "Berapa banyak siswa yang mendapat nilai 70-an?" },
      { label: "c.", text: "Apa keunggulan diagram stem-and-leaf dibanding tabel distribusi biasa?" },
    ],
  }),
  Qn(17, "Membandingkan Dua Kelompok Data – UN", {
    type: "mixed",
    content: "Nilai matematika kelas A dan B selama 5 ujian:\nKelas A: 70, 75, 80, 78, 82\nKelas B: 65, 72, 85, 90, 68",
    parts: [
      { label: "a.", text: "Buat diagram garis untuk kedua kelas dalam satu grafik." },
      { label: "b.", text: "Kelas mana yang memiliki nilai lebih stabil (konsisten)?" },
      { label: "c.", text: "Apa kesimpulan yang dapat diambil dari perbandingan dua kelas tersebut?" },
    ],
  }),
  Qn(18, "Penyajian Data Kategori – TKA", {
    type: "mixed",
    content: "Warna favorit 50 siswa: Merah (15), Biru (18), Hijau (10), Kuning (7).",
    parts: [
      { label: "a.", math: "\\text{Sudut 'Biru'} = \\frac{18}{50} \\times 360^\\circ = \\ldots ^\\circ" },
      { label: "b.", text: "Jenis diagram apa yang paling tepat untuk data ini: batang, lingkaran, atau garis?" },
      { label: "c.", math: "\\text{Persen 'Merah'} = \\frac{15}{50} \\times 100\\% = \\ldots \\%" },
    ],
  }),
  Qn(19, "Membaca Diagram Batang – ANBK", {
    type: "mixed",
    content: "Diagram batang menunjukkan produksi padi (ton) di 4 desa:\nDesa A=80, Desa B=120, Desa C=95, Desa D=105.",
    parts: [
      { label: "a.", text: "Desa mana yang produksi padinya tertinggi?" },
      { label: "b.", math: "\\text{Rata-rata produksi} = \\frac{80+120+95+105}{4} = \\ldots \\text{ ton}" },
      { label: "c.", text: "Berapa persen produksi Desa B dari total produksi?" },
    ],
  }),
  Qn(20, "Perbandingan Diagram – ANBK", {
    type: "mixed",
    content: "Kapan sebaiknya menggunakan jenis-jenis diagram berikut?",
    parts: [
      { label: "a.", text: "Diagram batang: digunakan untuk membandingkan apa?" },
      { label: "b.", text: "Diagram garis: digunakan untuk menampilkan apa?" },
      { label: "c.", text: "Diagram lingkaran: digunakan untuk menampilkan apa?" },
    ],
  }),
  Qn(21, "Mengubah Persentase ke Derajat – TKA", {
    type: "mixed",
    mathContent: "\\text{Sudut} = \\frac{\\%}{100} \\times 360^\\circ",
    content: "Pengeluaran keluarga: Makanan 40%, Pendidikan 25%, Transportasi 20%, Lainnya 15%.",
    parts: [
      { label: "a.", math: "\\text{Sudut Makanan} = \\frac{40}{100} \\times 360^\\circ = \\ldots ^\\circ" },
      { label: "b.", math: "\\text{Sudut Pendidikan} = \\frac{25}{100} \\times 360^\\circ = \\ldots ^\\circ" },
      { label: "c.", text: "Verifikasi bahwa jumlah semua sudut = 360°." },
    ],
  }),
  Qn(22, "Data dari Diagram Lingkaran – ANBK", {
    type: "mixed",
    content: "Dari diagram lingkaran diketahui sudut untuk masing-masing bagian: A=90°, B=120°, C=72°, D=78°.",
    parts: [
      { label: "a.", math: "\\text{Persentase A} = \\frac{90}{360} \\times 100\\% = \\ldots" },
      { label: "b.", math: "\\text{Persentase B} = \\frac{120}{360} \\times 100\\% = \\ldots" },
      { label: "c.", text: "Jika total responden 200 orang, berapa orang pada bagian C?" },
    ],
  }),
  Qn(23, "Tabel Data Dua Arah – UN", {
    type: "mixed",
    content: "Tabel silang jenis kelamin dan aktivitas olahraga:\n           | Olahraga | Tidak |\n Laki-laki |    18    |  12   |\n Perempuan |    10    |  20   |",
    parts: [
      { label: "a.", text: "Berapa total siswa laki-laki?" },
      { label: "b.", text: "Berapa persen perempuan yang berolahraga dari seluruh perempuan?" },
      { label: "c.", text: "Berapa persen semua siswa yang berolahraga?" },
    ],
  }),
  Qn(24, "Hubungan Data Nyata – TKA", {
    type: "mixed",
    content: "Peneliti mengumpulkan data penjualan es krim dan suhu udara harian selama 7 hari.",
    parts: [
      { label: "a.", text: "Jenis diagram apa yang tepat untuk melihat hubungan dua variabel tersebut?" },
      { label: "b.", text: "Jika suhu naik, bagaimana prediksimu tentang penjualan es krim?" },
      { label: "c.", text: "Apa nama diagram yang menampilkan pasangan data (x, y) sebagai titik-titik?" },
    ],
  }),
  Qn(25, "Soal UN – Membaca Diagram Lingkaran", {
    type: "mixed",
    content: "Dari 600 siswa, diagram lingkaran menunjukkan: IPA = 30%, IPS = 25%, Bahasa = 20%, Kejuruan = 15%, Lainnya = 10%.",
    parts: [
      { label: "a.", math: "\\text{Siswa IPA} = 30\\% \\times 600 = \\ldots \\text{ siswa}" },
      { label: "b.", math: "\\text{Siswa IPS} = 25\\% \\times 600 = \\ldots \\text{ siswa}" },
      { label: "c.", text: "Berapa sudut untuk sektor Bahasa dalam diagram lingkaran?" },
    ],
  }),
];

const PenyajianDataPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-teal-500/20 border-2 border-teal-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📈</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-teal-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(45,212,191,0.7)' }}>
            PENYAJIAN DATA
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 rounded-lg px-4 py-2">
            <span className="text-teal-400 text-xs font-bold">📋 25 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-teal-900/20 border border-teal-500/20 rounded-xl p-4">
          <p className="text-teal-300 text-xs font-bold mb-3">📌 Jenis-Jenis Diagram</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Diagram Batang", desc: "Perbandingan antar kategori" },
              { name: "Diagram Garis", desc: "Tren data dari waktu ke waktu" },
              { name: "Diagram Lingkaran", desc: "Proporsi dari keseluruhan" },
              { name: "Histogram", desc: "Data berkelompok (kontinu)" },
              { name: "Poligon Frekuensi", desc: "Hubungkan titik tengah" },
              { name: "Ogive", desc: "Frekuensi kumulatif" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-teal-400 text-[9px] uppercase font-bold mb-0.5">{r.name}</div>
                <div className="text-white/60 text-[9px]">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 via-slate-900/80 to-cyan-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-teal-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-400 to-cyan-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400/50 flex items-center justify-center shrink-0">
                    <span className="text-teal-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-teal-400 text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3 whitespace-pre-line">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-teal-900/20 border border-teal-500/20 rounded-lg px-4 py-3 flex justify-center overflow-x-auto"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3 overflow-x-auto">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-teal-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-teal-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};
export default PenyajianDataPage;
