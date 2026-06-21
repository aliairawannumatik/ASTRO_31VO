import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

// ── Diagram: Pengantar Statistika ──────────────────────────────────────────

const TableJenisData = () => (
  <svg width="320" height="150" viewBox="0 0 320 150" className="mx-auto">
    <rect x="4" y="4" width="312" height="142" rx="10" fill="#0e7490" fillOpacity="0.12" stroke="#22d3ee" strokeWidth="1.5" />
    <rect x="10" y="10" width="300" height="26" rx="6" fill="#22d3ee" fillOpacity="0.25" />
    <text x="60" y="27" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Jenis Data</text>
    <text x="190" y="27" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Contoh</text>
    <text x="275" y="27" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Skala</text>
    <line x1="10" y1="36" x2="310" y2="36" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.4" />
    {[
      ["Data Kualitatif", "Warna, Nama", "Nominal"],
      ["Data Ordinal", "Peringkat, Nilai Huruf", "Ordinal"],
      ["Data Diskrit", "Jumlah Siswa", "Rasio"],
      ["Data Kontinu", "Tinggi, Berat Badan", "Interval"],
    ].map(([jenis, contoh, skala], i) => (
      <g key={i}>
        <rect x="10" y={38 + i * 26} width="300" height="25" fill={i % 2 === 0 ? "#0e7490" : "transparent"} fillOpacity="0.1" />
        <text x="60" y={53 + i * 26} fill="#a5f3fc" fontSize="9" textAnchor="middle">{jenis}</text>
        <text x="190" y={53 + i * 26} fill="#e0f2fe" fontSize="9" textAnchor="middle">{contoh}</text>
        <text x="275" y={53 + i * 26} fill="#7dd3fc" fontSize="9" textAnchor="middle">{skala}</text>
      </g>
    ))}
  </svg>
);

const TeknikSamplingDiagram = () => (
  <svg width="320" height="160" viewBox="0 0 320 160" className="mx-auto">
    <rect x="4" y="4" width="312" height="152" rx="10" fill="#0e7490" fillOpacity="0.12" stroke="#22d3ee" strokeWidth="1.5" />
    <text x="160" y="22" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Teknik Pengambilan Sampel</text>
    <rect x="120" y="28" width="80" height="22" rx="4" fill="#0891b2" fillOpacity="0.4" stroke="#22d3ee" strokeWidth="1" />
    <text x="160" y="43" fill="#e0f2fe" fontSize="9" textAnchor="middle">Populasi</text>
    <line x1="80" y1="56" x2="160" y2="50" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.5" />
    <line x1="160" y1="50" x2="240" y2="56" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.5" />
    <line x1="160" y1="50" x2="160" y2="62" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.5" />
    {[
      [20, 62, "Acak\nSederhana"],
      [120, 62, "Sistematis"],
      [220, 62, "Stratifikasi"],
    ].map(([x, y, label], i) => (
      <g key={i}>
        <rect x={Number(x) - 35} y={Number(y)} width="70" height="24" rx="4" fill="#164e63" stroke="#0891b2" strokeWidth="0.8" />
        <text x={Number(x)} y={Number(y) + 10} fill="#a5f3fc" fontSize="8" textAnchor="middle">{String(label).split("\n")[0]}</text>
        <text x={Number(x)} y={Number(y) + 20} fill="#a5f3fc" fontSize="8" textAnchor="middle">{String(label).split("\n")[1] || ""}</text>
      </g>
    ))}
    <text x="160" y="105" fill="#94a3b8" fontSize="8" textAnchor="middle">Purposive · Cluster · Quota Sampling</text>
    <rect x="30" y="115" width="260" height="34" rx="6" fill="#164e63" stroke="#0891b2" strokeWidth="0.8" />
    <text x="160" y="127" fill="#7dd3fc" fontSize="8" textAnchor="middle" fontWeight="bold">Rumus Slovin:</text>
    <text x="160" y="143" fill="#e0f2fe" fontSize="10" textAnchor="middle">n = N / (1 + N·e²)</text>
  </svg>
);

const TablePopulasiSampel = () => (
  <svg width="300" height="130" viewBox="0 0 300 130" className="mx-auto">
    <rect x="4" y="4" width="292" height="122" rx="10" fill="#0e7490" fillOpacity="0.12" stroke="#22d3ee" strokeWidth="1.5" />
    <text x="150" y="20" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Populasi vs Sampel</text>
    <rect x="10" y="25" width="136" height="18" rx="4" fill="#0891b2" fillOpacity="0.3" />
    <rect x="154" y="25" width="136" height="18" rx="4" fill="#0891b2" fillOpacity="0.3" />
    <text x="78" y="38" fill="#22d3ee" fontSize="9" textAnchor="middle" fontWeight="bold">Populasi</text>
    <text x="222" y="38" fill="#22d3ee" fontSize="9" textAnchor="middle" fontWeight="bold">Sampel</text>
    {[
      ["Seluruh objek", "Sebagian objek"],
      ["Parameter (μ, σ)", "Statistik (x̄, s)"],
      ["Sensus (lengkap)", "Survei (efisien)"],
      ["Lebih akurat", "Lebih hemat"],
    ].map(([pop, samp], i) => (
      <g key={i}>
        <text x="78" y={54 + i * 18} fill="#a5f3fc" fontSize="8" textAnchor="middle">{pop}</text>
        <line x1="148" y1={45 + i * 18} x2="148" y2={61 + i * 18} stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.4" />
        <text x="222" y={54 + i * 18} fill="#e0f2fe" fontSize="8" textAnchor="middle">{samp}</text>
      </g>
    ))}
  </svg>
);

// ── Diagram: Penyajian Data ────────────────────────────────────────────────

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
            <text x={lx} y={ly - 3} fill="var(--icon-color)" fontSize="8" textAnchor="middle" fontWeight="bold">{seg.line1}</text>
            <text x={lx} y={ly + 8} fill="var(--icon-color)" fontSize="8" textAnchor="middle">{seg.line2}</text>
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
      <line x1="42" y1="20" x2="42" y2="155" stroke="#2dd4bf" strokeWidth="1.5" />
      <line x1="42" y1="155" x2="255" y2="155" stroke="#2dd4bf" strokeWidth="1.5" />
      {yVals.map((v, i) => {
        const y = 155 - i * 27;
        return (
          <g key={v}>
            <line x1="39" y1={y} x2="42" y2={y} stroke="#2dd4bf" strokeWidth="1" />
            <text x="36" y={y + 4} fill="#94a3b8" fontSize="8" textAnchor="end">{v}</text>
            <line x1="42" y1={y} x2="250" y2={y} stroke="#2dd4bf" strokeWidth="0.4" strokeDasharray="3,3" opacity="0.4" />
          </g>
        );
      })}
      {years.map((yr, i) => {
        const x = pts[i][0];
        return (
          <g key={yr}>
            <line x1={x} y1="155" x2={x} y2="158" stroke="#2dd4bf" strokeWidth="1" />
            <text x={x} y="172" fill="#94a3b8" fontSize="7.5" textAnchor="middle" transform={`rotate(-45, ${x}, 172)`}>{yr}</text>
          </g>
        );
      })}
      {pts.map(([x,y], i, arr) => {
        if (i === 0) return null;
        const [px, py] = arr[i-1];
        return <line key={i} x1={px} y1={py} x2={x} y2={y} stroke="#22d3ee" strokeWidth="2" />;
      })}
      {pts.map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#22d3ee" stroke="#0f172a" strokeWidth="1" />
      ))}
      <text x="22" y="90" fill="#94a3b8" fontSize="7" textAnchor="middle" transform="rotate(-90, 22, 90)">Hasil Panen Padi (ton)</text>
      <text x="255" y="150" fill="#94a3b8" fontSize="7.5" textAnchor="start">Tahun</text>
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
      <text x={padX + col1W / 2} y={headerH / 2 + 5} fill="#e0f2fe" fontSize="10" textAnchor="middle" fontWeight="bold">Nilai</text>
      <line x1={padX + col1W} y1="2" x2={padX + col1W} y2={totalH - 2} stroke="#2dd4bf" strokeWidth="1" />
      <text x={padX + col1W + col2W / 2} y={headerH / 2 + 5} fill="#e0f2fe" fontSize="10" textAnchor="middle" fontWeight="bold">Frekuensi</text>
      <line x1="2" y1={headerH} x2={totalW - 2} y2={headerH} stroke="#2dd4bf" strokeWidth="1" />
      {rows.map(([val, freq], i) => {
        const y = headerH + i * rowH;
        const isEven = i % 2 === 0;
        return (
          <g key={i}>
            {isEven && <rect x="3" y={y} width={totalW - 6} height={rowH} fill="#ffffff" fillOpacity="0.03" />}
            <line x1="2" y1={y + rowH} x2={totalW - 2} y2={y + rowH} stroke="#2dd4bf" strokeWidth="0.5" opacity="0.4" />
            <text x={padX + col1W / 2} y={y + rowH / 2 + 4} fill="#e0f2fe" fontSize="10" textAnchor="middle">{val}</text>
            <text x={padX + col1W + col2W / 2} y={y + rowH / 2 + 4} fill="#e0f2fe" fontSize="10" textAnchor="middle">{freq}</text>
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
            <text x={lx} y={ly - 3} fill="#ffffff" fontSize="8" textAnchor="middle" fontWeight="bold">{seg.line1}</text>
            <text x={lx} y={ly + 8} fill="#ffffff" fontSize="8" textAnchor="middle">{seg.line2}</text>
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
            <text x={lx} y={ly - 3} fill="#ffffff" fontSize="8" textAnchor="middle" fontWeight="bold">{seg.line1}</text>
            <text x={lx} y={ly + 8} fill="#ffffff" fontSize="8" textAnchor="middle">{seg.line2}</text>
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

// ── Soal Bagian 1: Pengantar Statistika & Pengumpulan Data (1–5) ───────────

const questionsA: Q[] = [
  Qn(1, "Pengertian Statistika – UN", {
    type: "mixed",
    content: "Statistika adalah ilmu yang mempelajari cara mengumpulkan, menyajikan, menganalisis, dan menarik kesimpulan dari data.",
    parts: [
      { label: "a.", text: "Jelaskan perbedaan antara statistika deskriptif dan statistika inferensial." },
      { label: "b.", text: "Berikan masing-masing satu contoh penggunaan statistika dalam kehidupan nyata." },
      { label: "c.", text: "Mengapa statistika penting dalam pengambilan keputusan?" },
    ],
  }),
  Qn(2, "Populasi dan Sampel – ANBK", {
    type: "mixed",
    diagram: <TablePopulasiSampel />,
    content: "Di sebuah sekolah terdapat 800 siswa. Peneliti ingin mengetahui rata-rata tinggi badan siswa.",
    parts: [
      { label: "a.", text: "Tentukan populasi dari penelitian tersebut." },
      { label: "b.", text: "Jika diambil sampel 80 siswa, berapa persen sampel dari populasi?" },
      { label: "c.", math: "\\text{Dengan rumus Slovin } n = \\frac{N}{1+Ne^2}, \\text{ jika } e=10\\%, \\text{ tentukan } n" },
    ],
  }),
  Qn(3, "Penyajian Data dan Kesimpulan – UN", {
    type: "mixed",
    content: "Dari 25 siswa yang disurvei mengenai hobi: Membaca (8), Olahraga (7), Bermain Game (6), Menggambar (4).",
    parts: [
      { label: "a.", math: "\\text{Persentase hobi membaca} = \\frac{8}{25} \\times 100\\% = \\ldots" },
      { label: "b.", text: "Hobi apa yang paling sedikit diminati?" },
      { label: "c.", text: "Sajikan data ini dalam bentuk tabel frekuensi lengkap dengan frekuensi relatif." },
    ],
  }),
  Qn(4, "Jenis-Jenis Data – UN", {
    type: "mixed",
    diagram: <TableJenisData />,
    content: "Perhatikan tabel jenis data di atas, kemudian jawab pertanyaan berikut:",
    parts: [
      { label: "a.", text: "Sebutkan perbedaan antara data kualitatif dan data kuantitatif. Berikan masing-masing dua contoh." },
      { label: "b.", text: "Apakah 'jumlah siswa dalam kelas' termasuk data diskrit atau kontinu? Jelaskan." },
      { label: "c.", text: "Apakah 'berat badan siswa' termasuk data diskrit atau kontinu? Jelaskan." },
    ],
  }),
  Qn(5, "Data Primer dan Sekunder", {
    type: "mixed",
    content: "Tentukan apakah data berikut termasuk data primer atau data sekunder, kemudian jelaskan alasannya:",
    parts: [
      { label: "a.", text: "Hasil kuesioner yang disebarkan langsung oleh peneliti kepada responden." },
      { label: "b.", text: "Data jumlah penduduk dari Badan Pusat Statistik (BPS)." },
      { label: "c.", text: "Hasil wawancara langsung antara peneliti dan narasumber." },
    ],
  }),
];

// ── Soal Bagian 2: Penyajian Data (6–15) ──────────────────────────────────

const questionsB: Q[] = [
  Qn(6, "Nilai Tertinggi dan Terendah – Dasar", {
    type: "essay",
    content: "Hitunglah nilai tertinggi dan terendah dari setiap kelompok data berikut:\na. 3, 6, 5, 7, 7, 9, 6, 8, 10, 4, 12\nb. 6, 8, 5, 9, 3, 7, 4, 6, 8, 11, 9, 7, 5\nc. 45, 42, 36, 51, 47, 44, 50, 41, 38",
  }),
  Qn(7, "Membuat Tabel Distribusi Frekuensi – TKA", {
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
  Qn(8, "Membaca Tabel Distribusi Frekuensi – UN", {
    type: "mixed",
    diagram: <TabelDistribusiIPA />,
    content: "Hasil ulangan IPA siswa kelas 9 disajikan pada tabel distribusi frekuensi berikut.",
    parts: [
      { label: "a.", text: "Nilai berapakah yang paling banyak diperoleh siswa?" },
      { label: "b.", text: "Berapa banyak siswa yang memperoleh nilai lebih dari 65?" },
    ],
  }),
  Qn(9, "Data Peminjaman Buku – Diagram Batang", {
    type: "mixed",
    diagram: <DiagramBatangPeminjaman />,
    content: "Data peminjaman buku dari setiap kelas VIII adalah sebagai berikut.",
    parts: [
      { label: "a.", text: "Kelas mana yang meminjam buku paling banyak?" },
      { label: "b.", text: "Kelas mana yang meminjam buku paling sedikit?" },
      { label: "c.", text: "Tentukan selisih banyak siswa yang meminjam buku antara kelas VIII A dan VIII D!" },
    ],
  }),
  Qn(10, "Diagram Garis – Hasil Panen Padi", {
    type: "mixed",
    diagram: <DiagramGarisPanen />,
    content: "Perhatikan diagram garis hasil panen padi (ton) di atas.",
    parts: [
      { label: "a.", text: "Hasil panen pada tahun 2005 adalah … ton" },
      { label: "b.", text: "Pada tahun berapa hasil panen mencapai nilai tertinggi?" },
      { label: "c.", text: "Bagaimana tren hasil panen dari tahun 2002 hingga 2006?" },
    ],
  }),
  Qn(11, "Diagram Batang – UN", {
    type: "mixed",
    diagram: <DiagramBatang />,
    content: "Perhatikan diagram batang nilai ulangan kelas 9A di atas.",
    parts: [
      { label: "a.", text: "Berapa banyak siswa yang mendapat nilai 80?" },
      { label: "b.", text: "Berapa total siswa dalam kelas tersebut?" },
      { label: "c.", text: "Berapa persen siswa yang mendapat nilai di atas 70?" },
    ],
  }),
  Qn(12, "Diagram Lingkaran – ANBK", {
    type: "mixed",
    diagram: <DiagramLingkaran />,
    content: "Diagram lingkaran menunjukkan moda transportasi 200 siswa ke sekolah.",
    parts: [
      { label: "a.", text: "Berapa siswa yang menggunakan motor?" },
      { label: "b.", text: "Berapa siswa yang menggunakan angkot?" },
    ],
  }),
  Qn(13, "Diagram Lingkaran – Persen (Unsur Diketahui)", {
    type: "mixed",
    diagram: <DiagramLingkaranPersen />,
    content: "Diagram lingkaran menunjukkan ekskul favorit sejumlah siswa. Diketahui 24 siswa memilih Seni.",
    parts: [
      { label: "a.", text: "Berapa jumlah seluruh siswa?" },
      { label: "b.", text: "Berapa banyak siswa yang memilih Olahraga?" },
      { label: "c.", text: "Berapa selisih banyak siswa yang memilih Sains dan Bahasa?" },
    ],
  }),
  Qn(14, "Diagram Lingkaran – Derajat (Unsur Diketahui)", {
    type: "mixed",
    diagram: <DiagramLingkaranDerajat />,
    content: "Diagram lingkaran menunjukkan hobi favorit sejumlah siswa. Besar sudut setiap sektor ditunjukkan dalam derajat. Diketahui 36 siswa menyukai Membaca.",
    parts: [
      { label: "a.", text: "Berapa jumlah seluruh siswa?" },
      { label: "b.", text: "Berapa banyak siswa yang menyukai Olahraga?" },
      { label: "c.", text: "Berapa persen siswa yang menyukai Musik?" },
    ],
  }),
  Qn(15, "Membaca Diagram Batang Daun – UN", {
    type: "mixed",
    diagram: <DiagramBatangDaun />,
    content: "Perhatikan diagram batang daun nilai ulangan 20 siswa berikut.",
    parts: [
      { label: "a.", text: "Berapa banyak siswa yang mendapat nilai 70-an?" },
      { label: "b.", text: "Tentukan nilai tertinggi dan nilai terendah dari data tersebut!" },
      { label: "c.", text: "Berapa banyak siswa yang mendapat nilai di atas 80?" },
    ],
  }),
];

const allQuestions = [...questionsA, ...questionsB];

const PengantarStatistikaPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📊</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(34,211,238,0.7)' }}>
            PENGANTAR STATISTIKA & PENYAJIAN DATA
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 15 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-cyan-300 text-xs font-bold mb-3">📌 Konsep Kunci</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Populasi", desc: "Seluruh objek penelitian" },
              { name: "Sampel", desc: "Sebagian dari populasi" },
              { name: "Data Primer", desc: "Dikumpulkan langsung" },
              { name: "Data Sekunder", desc: "Dari sumber lain" },
              { name: "Diagram Batang", desc: "Perbandingan antar kategori" },
              { name: "Diagram Lingkaran", desc: "Proporsi dari keseluruhan" },
              { name: "Diagram Garis", desc: "Tren data dari waktu ke waktu" },
              { name: "Batang Daun", desc: "Menampilkan data asli terurut" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-cyan-400 text-[9px] uppercase font-bold mb-0.5">{r.name}</div>
                <div className="text-white/60 text-[9px]">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bagian 1 ── */}
        <div className="mb-3 flex items-center gap-3">
          <div className="flex-1 h-px bg-cyan-500/20" />
          <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest px-2">
            Bagian 1 · Pengantar & Pengumpulan Data
          </span>
          <div className="flex-1 h-px bg-cyan-500/20" />
        </div>

        <div className="flex flex-col gap-4 animate-slide-up mb-6">
          {questionsA.map((q, i) => (
            <QuestionCard key={q.n} q={q} i={i} accent="cyan" />
          ))}
        </div>

        {/* ── Bagian 2 ── */}
        <div className="mb-3 flex items-center gap-3">
          <div className="flex-1 h-px bg-teal-500/20" />
          <span className="text-teal-400 text-[10px] font-bold uppercase tracking-widest px-2">
            Bagian 2 · Penyajian Data
          </span>
          <div className="flex-1 h-px bg-teal-500/20" />
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questionsB.map((q, i) => (
            <QuestionCard key={q.n} q={q} i={i} accent="teal" />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};

type AccentColor = "cyan" | "teal";
const accentMap: Record<AccentColor, { bg: string; border: string; grad: string; num: string; badge: string; part: string }> = {
  cyan: {
    bg:     "from-cyan-900/30 via-slate-900/80 to-teal-900/30",
    border: "border-cyan-500/20",
    grad:   "from-cyan-400 to-teal-500",
    num:    "bg-cyan-500/20 border-cyan-400/50 text-cyan-300",
    badge:  "text-cyan-400 bg-cyan-500/10",
    part:   "text-cyan-300",
  },
  teal: {
    bg:     "from-teal-900/30 via-slate-900/80 to-cyan-900/30",
    border: "border-teal-500/20",
    grad:   "from-teal-400 to-cyan-500",
    num:    "bg-teal-500/20 border-teal-400/50 text-teal-300",
    badge:  "text-teal-400 bg-teal-500/10",
    part:   "text-teal-300",
  },
};

const QuestionCard = ({ q, i, accent }: { q: Q; i: number; accent: AccentColor }) => {
  const a = accentMap[accent];
  return (
    <div className={`relative rounded-2xl overflow-hidden animate-slide-up`} style={{ animationDelay: `${i * 0.02}s` }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${a.bg} backdrop-blur`} />
      <div className={`absolute inset-0 border ${a.border} rounded-2xl`} />
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${a.grad} rounded-l-2xl`} />
      <div className="relative px-5 py-4">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full ${a.num} border flex items-center justify-center shrink-0`}>
            <span className="text-xs font-bold">{q.n}</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className={`${a.badge} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block mb-2`}>{q.title}</span>
            {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3 whitespace-pre-line">{q.content}</p>}
            {q.mathContent && <div className={`mb-3 bg-cyan-900/20 border ${a.border} rounded-lg px-4 py-3 flex justify-center overflow-x-auto`}><BlockMath math={q.mathContent} /></div>}
            {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3 overflow-x-auto">{q.diagram}</div>}
            {q.parts && (
              <div className="flex flex-col gap-2">
                {q.parts.map((p, pi) => (
                  <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                    <span className={`${a.part} text-xs font-bold shrink-0 mt-0.5 min-w-[28px]`}>{p.label}</span>
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
  );
};

export default PengantarStatistikaPage;
