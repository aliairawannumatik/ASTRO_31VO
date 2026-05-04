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

const DiagramLingkaran = () => {
  const cx = 110, cy = 108, r = 75, lr = 45;
  const segs = [
    { start: 0,   end: 144, color: "#0e7490", line1: "Motor",  line2: "40%" },
    { start: 144, end: 252, color: "#b45309", line1: "Angkot", line2: "30%" },
    { start: 252, end: 324, color: "#7c3aed", line1: "Sepeda", line2: "20%" },
    { start: 324, end: 360, color: "#be185d", line1: "Jalan",  line2: "10%" },
  ];
  return (
    <svg width="220" height="205" viewBox="0 0 220 205" className="mx-auto">
      <rect x="2" y="2" width="216" height="201" rx="10" fill="#0d9488" fillOpacity="0.1" stroke="#2dd4bf" strokeWidth="1.5" />
      <text x="110" y="16" fill="#2dd4bf" fontSize="10" textAnchor="middle" fontWeight="bold">Transportasi Siswa</text>
      {segs.map((seg, i) => {
        const startRad = (seg.start - 90) * Math.PI / 180;
        const endRad   = (seg.end   - 90) * Math.PI / 180;
        const x1 = cx + r * Math.cos(startRad);
        const y1 = cy + r * Math.sin(startRad);
        const x2 = cx + r * Math.cos(endRad);
        const y2 = cy + r * Math.sin(endRad);
        const large = (seg.end - seg.start) > 180 ? 1 : 0;
        const midRad = ((seg.start + seg.end) / 2 - 90) * Math.PI / 180;
        const lx = cx + lr * Math.cos(midRad);
        const ly = cy + lr * Math.sin(midRad);
        return (
          <g key={i}>
            <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
              fill={seg.color} fillOpacity="0.85" stroke="#0f172a" strokeWidth="1" />
            <text x={lx} y={ly - 3} fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">{seg.line1}</text>
            <text x={lx} y={ly + 8} fill="white" fontSize="8" textAnchor="middle">{seg.line2}</text>
          </g>
        );
      })}
    </svg>
  );
};

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
  const pts: [number, number][] = [[65,125],[110,95],[155,125],[200,74],[245,47]];
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

const DiagramLingkaranPersen = () => {
  const cx = 110, cy = 108, r = 75, lr = 46;
  const segs = [
    { start: 0,   end: 144, color: "#0e7490", line1: "Olahraga", line2: "40%" },
    { start: 144, end: 252, color: "#b45309", line1: "Sains",    line2: "30%" },
    { start: 252, end: 324, color: "#7c3aed", line1: "Seni",     line2: "20%" },
    { start: 324, end: 360, color: "#be185d", line1: "Bahasa",   line2: "10%" },
  ];
  return (
    <svg width="220" height="205" viewBox="0 0 220 205" className="mx-auto">
      <rect x="2" y="2" width="216" height="201" rx="10" fill="#0d9488" fillOpacity="0.1" stroke="#2dd4bf" strokeWidth="1.5" />
      <text x="110" y="16" fill="#2dd4bf" fontSize="10" textAnchor="middle" fontWeight="bold">Ekskul Favorit Siswa</text>
      {segs.map((seg, i) => {
        const startRad = (seg.start - 90) * Math.PI / 180;
        const endRad   = (seg.end   - 90) * Math.PI / 180;
        const x1 = cx + r * Math.cos(startRad);
        const y1 = cy + r * Math.sin(startRad);
        const x2 = cx + r * Math.cos(endRad);
        const y2 = cy + r * Math.sin(endRad);
        const large = (seg.end - seg.start) > 180 ? 1 : 0;
        const midRad = ((seg.start + seg.end) / 2 - 90) * Math.PI / 180;
        const lx = cx + lr * Math.cos(midRad);
        const ly = cy + lr * Math.sin(midRad);
        return (
          <g key={i}>
            <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
              fill={seg.color} fillOpacity="0.85" stroke="#0f172a" strokeWidth="1" />
            <text x={lx} y={ly - 3} fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">{seg.line1}</text>
            <text x={lx} y={ly + 8} fill="white" fontSize="8" textAnchor="middle">{seg.line2}</text>
          </g>
        );
      })}
    </svg>
  );
};

const DiagramLingkaranDerajat = () => {
  const cx = 110, cy = 108, r = 75, lr = 45;
  const segs = [
    { start: 0,   end: 144, color: "#0e7490", line1: "Olahraga", line2: "144°" },
    { start: 144, end: 234, color: "#b45309", line1: "Musik",    line2: "90°"  },
    { start: 234, end: 306, color: "#7c3aed", line1: "Membaca",  line2: "72°"  },
    { start: 306, end: 360, color: "#be185d", line1: "Memasak",  line2: "54°"  },
  ];
  return (
    <svg width="220" height="205" viewBox="0 0 220 205" className="mx-auto">
      <rect x="2" y="2" width="216" height="201" rx="10" fill="#0d9488" fillOpacity="0.1" stroke="#2dd4bf" strokeWidth="1.5" />
      <text x="110" y="16" fill="#2dd4bf" fontSize="10" textAnchor="middle" fontWeight="bold">Hobi Favorit Siswa</text>
      {segs.map((seg, i) => {
        const startRad = (seg.start - 90) * Math.PI / 180;
        const endRad   = (seg.end   - 90) * Math.PI / 180;
        const x1 = cx + r * Math.cos(startRad);
        const y1 = cy + r * Math.sin(startRad);
        const x2 = cx + r * Math.cos(endRad);
        const y2 = cy + r * Math.sin(endRad);
        const large = (seg.end - seg.start) > 180 ? 1 : 0;
        const midRad = ((seg.start + seg.end) / 2 - 90) * Math.PI / 180;
        const lx = cx + lr * Math.cos(midRad);
        const ly = cy + lr * Math.sin(midRad);
        return (
          <g key={i}>
            <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
              fill={seg.color} fillOpacity="0.85" stroke="#0f172a" strokeWidth="1" />
            <text x={lx} y={ly - 3} fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">{seg.line1}</text>
            <text x={lx} y={ly + 8} fill="white" fontSize="8" textAnchor="middle">{seg.line2}</text>
          </g>
        );
      })}
    </svg>
  );
};

const DiagramBatangDaun = () => {
  const stems = [
    { stem: "5", leaves: ["4", "7", "8", "9"] },
    { stem: "6", leaves: ["2", "5", "6", "8"] },
    { stem: "7", leaves: ["0", "3", "5", "7", "9"] },
    { stem: "8", leaves: ["1", "4", "6", "8"] },
    { stem: "9", leaves: ["0", "2", "5"] },
  ];
  const rowH = 24, startY = 58, divX = 58;
  return (
    <svg width="280" height="195" viewBox="0 0 280 195" className="mx-auto">
      <rect x="2" y="2" width="276" height="191" rx="10" fill="#0d9488" fillOpacity="0.1" stroke="#2dd4bf" strokeWidth="1.5" />
      <text x="140" y="16" fill="#2dd4bf" fontSize="10" textAnchor="middle" fontWeight="bold">Nilai Ulangan 20 Siswa</text>
      <rect x="10" y="22" width="260" height="22" rx="4" fill="#0d9488" fillOpacity="0.35" />
      <text x={divX / 2 + 10} y="37" fill="#e0f2fe" fontSize="9" textAnchor="middle" fontWeight="bold">Batang</text>
      <text x={divX + 20} y="37" fill="#e0f2fe" fontSize="9" textAnchor="start" fontWeight="bold">Daun</text>
      <line x1={divX} y1="22" x2={divX} y2={startY + stems.length * rowH - 2} stroke="#2dd4bf" strokeWidth="1" />
      {stems.map((row, i) => {
        const y = startY + i * rowH;
        return (
          <g key={i}>
            <rect x="10" y={y - rowH + 4} width="260" height={rowH} fill={i % 2 === 0 ? "#ffffff08" : "transparent"} />
            <text x={divX - 10} y={y} fill="#22d3ee" fontSize="11" textAnchor="middle" fontWeight="bold">{row.stem}</text>
            {row.leaves.map((leaf, j) => (
              <text key={j} x={divX + 14 + j * 20} y={y} fill="#e0f2fe" fontSize="11">{leaf}</text>
            ))}
          </g>
        );
      })}
      <text x="140" y={startY + stems.length * rowH + 12} fill="#64748b" fontSize="8" textAnchor="middle">Ket: 5 | 4 artinya nilai 54</text>
    </svg>
  );
};

const questions: Q[] = [
  Qn(1, "Nilai Tertinggi dan Terendah – Dasar", {
    type: "essay",
    content: "Hitunglah nilai tertinggi dan terendah dari setiap kelompok data berikut:\na. 3, 6, 5, 7, 7, 9, 6, 8, 10, 4, 12\nb. 6, 8, 5, 9, 3, 7, 4, 6, 8, 11, 9, 7, 5\nc. 45, 42, 36, 51, 47, 44, 50, 41, 38",
  }),
  Qn(2, "Membuat Tabel Distribusi Frekuensi – TKA", {
    type: "essay",
    content: "Data nilai ujian matematika sekelompok siswa adalah sebagai berikut:\n65 80 70 90 75 85 70 95 80 65\n75 85 70 80 60 70 90 75 80 65\n90 95 65 85 70 75 80 60 65 75",
    parts: [
      { label: "a.", text: "Buatlah tabel distribusi frekuensi dari data di atas!" },
      { label: "b.", text: "Buatlah diagram batang dari data di atas!" },
      { label: "c.", text: "Buatlah diagram garis dari data di atas!" },
      { label: "d.", text: "Buatlah diagram lingkaran dari data di atas!" },
      { label: "e.", text: "Buatlah diagram batang-daun dari data di atas!" },
    ],
  }),
  Qn(3, "Membaca Tabel Distribusi Frekuensi – UN", {
    type: "mixed",
    diagram: <TabelDistribusiIPA />,
    content: "Hasil ulangan IPA siswa kelas 9 disajikan pada tabel distribusi frekuensi berikut.",
    parts: [
      { label: "a.", text: "Nilai berapakah yang paling banyak diperoleh siswa?" },
      { label: "b.", text: "Berapa banyak siswa yang memperoleh nilai lebih dari 65?" },
    ],
  }),
  Qn(4, "Data Peminjaman Buku – Diagram Batang", {
    type: "mixed",
    diagram: <DiagramBatangPeminjaman />,
    content: "Data peminjaman buku dari setiap kelas VIII adalah sebagai berikut.",
    parts: [
      { label: "a.", text: "Kelas mana yang meminjam buku paling banyak?" },
      { label: "b.", text: "Kelas mana yang meminjam buku paling sedikit?" },
      { label: "c.", text: "Tentukan selisih banyak siswa yang meminjam buku antara kelas VIII A dan VIII D!" },
    ],
  }),
  Qn(5, "Diagram Garis – Hasil Panen Padi", {
    type: "mixed",
    diagram: <DiagramGarisPanen />,
    content: "Perhatikan diagram garis hasil panen padi (ton) di atas.",
    parts: [
      { label: "a.", text: "Hasil panen pada tahun 2005 adalah … ton" },
      { label: "b.", text: "Pada tahun berapa hasil panen mencapai nilai tertinggi?" },
      { label: "c.", text: "Bagaimana tren hasil panen dari tahun 2002 hingga 2006?" },
    ],
  }),
  Qn(6, "Diagram Batang – UN", {
    type: "mixed",
    diagram: <DiagramBatang />,
    content: "Perhatikan diagram batang nilai ulangan kelas 9A di atas.",
    parts: [
      { label: "a.", text: "Berapa banyak siswa yang mendapat nilai 80?" },
      { label: "b.", text: "Berapa total siswa dalam kelas tersebut?" },
      { label: "c.", text: "Berapa persen siswa yang mendapat nilai di atas 70?" },
    ],
  }),
  Qn(7, "Diagram Lingkaran – ANBK", {
    type: "mixed",
    diagram: <DiagramLingkaran />,
    content: "Diagram lingkaran menunjukkan moda transportasi 200 siswa ke sekolah.",
    parts: [
      { label: "a.", text: "Berapa siswa yang menggunakan motor?" },
      { label: "b.", text: "Berapa derajat sudut sektor untuk 'Angkot 30%'?" },
    ],
  }),
  Qn(8, "Diagram Lingkaran – Persen (Unsur Diketahui)", {
    type: "mixed",
    diagram: <DiagramLingkaranPersen />,
    content: "Diagram lingkaran menunjukkan ekskul favorit sejumlah siswa. Diketahui 24 siswa memilih Seni.",
    parts: [
      { label: "a.", text: "Berapa jumlah seluruh siswa?" },
      { label: "b.", text: "Berapa banyak siswa yang memilih Olahraga?" },
      { label: "c.", text: "Berapa selisih banyak siswa yang memilih Sains dan Bahasa?" },
    ],
  }),
  Qn(9, "Membaca Diagram Batang Daun – UN", {
    type: "mixed",
    diagram: <DiagramBatangDaun />,
    content: "Perhatikan diagram batang daun nilai ulangan 20 siswa berikut.",
    parts: [
      { label: "a.", text: "Berapa banyak siswa yang mendapat nilai 70-an?" },
      { label: "b.", text: "Tentukan nilai tertinggi dan nilai terendah dari data tersebut!" },
      { label: "c.", text: "Berapa banyak siswa yang mendapat nilai di atas 80?" },
    ],
  }),
  Qn(10, "Diagram Lingkaran – Derajat (Unsur Diketahui)", {
    type: "mixed",
    diagram: <DiagramLingkaranDerajat />,
    content: "Diagram lingkaran menunjukkan hobi favorit sejumlah siswa. Besar sudut setiap sektor ditunjukkan dalam derajat. Diketahui 36 siswa menyukai Membaca.",
    parts: [
      { label: "a.", text: "Berapa jumlah seluruh siswa?" },
      { label: "b.", text: "Berapa banyak siswa yang menyukai Olahraga?" },
      { label: "c.", text: "Berapa persen siswa yang menyukai Musik?" },
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
            <span className="text-teal-400 text-xs font-bold">📋 10 Soal</span>
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
              { name: "Tabel Frekuensi", desc: "Menyajikan data dalam bentuk tabel" },
              { name: "Diagram Batang Daun", desc: "Menampilkan data asli secara terurut" },
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
