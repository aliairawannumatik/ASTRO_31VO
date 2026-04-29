import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp, BookOpen, Dumbbell, Star, Lightbulb } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { pembahasanDasar } from "@/data/statistikaPembahasanDasar";
import { pembahasanOlimpiade } from "@/data/statistikaPembahasanOlimpiade";
import statistikaSoal13Img from "@assets/image_1777276565289.png";
import statistikaOlimpiadeSoal15Img from "@assets/image_1777276641804.png";
import statistikaOlimpiadeSoal18ImgA from "@assets/image_1777276668610.png";
import statistikaOlimpiadeSoal18ImgB from "@assets/image_1777276672599.png";
import statistikaOlimpiadeSoal21Img from "@assets/21_1777276795043.png";
import statistikaOlimpiadeSoal24Img from "@assets/24_1777276795043.png";
import statistikaOlimpiadeSoal25Img from "@assets/25_1777276795044.png";
import statistikaOlimpiadeSoal29Img from "@assets/29_1777276795044.png";
import statistikaOlimpiadeSoal34Img from "@assets/34_1777276795044.png";

const dasarImages: Record<number, string> = {
  13: statistikaSoal13Img,
};

const olimpiadeImages: Record<number, string[]> = {
  15: [statistikaOlimpiadeSoal15Img],
  18: [statistikaOlimpiadeSoal18ImgA, statistikaOlimpiadeSoal18ImgB],
  21: [statistikaOlimpiadeSoal21Img],
  24: [statistikaOlimpiadeSoal24Img],
  25: [statistikaOlimpiadeSoal25Img],
  29: [statistikaOlimpiadeSoal29Img],
  34: [statistikaOlimpiadeSoal34Img],
};

const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.slice(1, -1);
      return <InlineMath key={index} math={latex} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const renderLines = (text: string) =>
  text.split('\n').map((line, i) => (
    <div key={i} className="mb-1">{renderWithLatex(line)}</div>
  ));

const FrequencyTable = ({
  title,
  headers,
  rows,
  showTotal = true,
}: {
  title: string;
  headers: [string, string];
  rows: { label: string | number; value: string | number }[];
  showTotal?: boolean;
}) => {
  const total = showTotal ? rows.reduce((s, r) => s + (typeof r.value === 'number' ? r.value : 0), 0) : 0;
  return (
    <div className="my-3 rounded-xl border border-cyan-400/30 bg-white/5 overflow-hidden">
      <div className="px-3 py-2 bg-cyan-500/15 border-b border-cyan-400/20 text-center">
        <span className="font-display text-xs text-cyan-200 font-bold">{title}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-body text-white/85">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-3 py-2 text-center font-display text-cyan-300 font-semibold">{headers[0]}</th>
              <th className="px-3 py-2 text-center font-display text-cyan-300 font-semibold">{headers[1]}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-white/5 last:border-b-0">
                <td className="px-3 py-1.5 text-center">{r.label}</td>
                <td className="px-3 py-1.5 text-center">{r.value}</td>
              </tr>
            ))}
            {total > 0 && (
              <tr className="bg-cyan-500/10 border-t border-cyan-400/20">
                <td className="px-3 py-1.5 text-center font-display font-bold text-cyan-200">Jumlah</td>
                <td className="px-3 py-1.5 text-center font-display font-bold text-cyan-200">{total}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const HorizontalFrequencyTable = ({
  title,
  rowLabels,
  data,
}: {
  title?: string;
  rowLabels: [string, string];
  data: { col: string | number; freq: string | number }[];
}) => {
  return (
    <div className="my-3 rounded-xl border border-cyan-400/30 bg-white/5 overflow-hidden">
      {title && (
        <div className="px-3 py-2 bg-cyan-500/15 border-b border-cyan-400/20 text-center">
          <span className="font-display text-xs text-cyan-200 font-bold">{title}</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-body text-white/85 border-collapse">
          <tbody>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-3 py-2 text-center font-display text-cyan-300 font-semibold border-r border-white/10 whitespace-nowrap">{rowLabels[0]}</th>
              {data.map((d, i) => (
                <td key={i} className="px-3 py-2 text-center font-semibold border-r border-white/10 last:border-r-0">{d.col}</td>
              ))}
            </tr>
            <tr>
              <th className="px-3 py-2 text-center font-display text-cyan-300 font-semibold border-r border-white/10 whitespace-nowrap">{rowLabels[1]}</th>
              {data.map((d, i) => (
                <td key={i} className="px-3 py-2 text-center border-r border-white/10 last:border-r-0">{d.freq}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const BarChart = ({
  title,
  data,
  xLabel,
  yLabel,
}: {
  title: string;
  data: { label: string | number; value: number }[];
  xLabel?: string;
  yLabel?: string;
}) => {
  const W = 320;
  const H = 220;
  const padL = 36;
  const padR = 14;
  const padT = 16;
  const padB = 36;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxV = Math.max(...data.map(d => d.value));
  const yMax = Math.ceil(maxV / 2) * 2 + 2;
  const barW = chartW / data.length * 0.6;
  const gap = chartW / data.length;

  const yTicks = Array.from({ length: yMax + 1 }, (_, i) => i).filter(v => v % Math.max(1, Math.ceil(yMax / 6)) === 0);

  return (
    <div className="my-3 rounded-xl border border-cyan-400/30 bg-white/5 p-3">
      <p className="text-xs text-center text-cyan-200 font-display font-bold mb-2">{title}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm mx-auto block">
        {/* Y axis */}
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#94a3b8" strokeWidth="1" />
        {/* X axis */}
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#94a3b8" strokeWidth="1" />

        {/* Y ticks + gridlines */}
        {yTicks.map(t => {
          const y = H - padB - (t / yMax) * chartH;
          return (
            <g key={t}>
              <line x1={padL - 3} y1={y} x2={padL} y2={y} stroke="#94a3b8" strokeWidth="1" />
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#475569" strokeWidth="0.4" strokeDasharray="2 3" />
              <text x={padL - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#cbd5e1">{t}</text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = padL + gap * i + (gap - barW) / 2;
          const h = (d.value / yMax) * chartH;
          const y = H - padB - h;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h} fill="#22d3ee" opacity="0.85" rx="2" />
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="10" fill="#fbbf24" fontWeight="bold">{d.value}</text>
              <text x={x + barW / 2} y={H - padB + 14} textAnchor="middle" fontSize="10" fill="#e2e8f0">{d.label}</text>
            </g>
          );
        })}

        {/* Axis labels */}
        {xLabel && <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="#94a3b8">{xLabel}</text>}
        {yLabel && (
          <text x={10} y={H / 2} textAnchor="middle" fontSize="10" fill="#94a3b8" transform={`rotate(-90 10 ${H / 2})`}>{yLabel}</text>
        )}
      </svg>
    </div>
  );
};

const PIE_COLORS = ['#22d3ee', '#f59e0b', '#a78bfa', '#34d399', '#f472b6', '#60a5fa', '#fbbf24'];

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const PieChart = ({
  title,
  data,
}: {
  title: string;
  data: { label: string; value: number; sub?: string }[];
}) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 100;
  const cy = 100;
  const r = 80;
  let startAngle = 0;

  return (
    <div className="my-3 rounded-xl border border-cyan-400/30 bg-white/5 p-3">
      <p className="text-xs text-center text-cyan-200 font-display font-bold mb-2">{title}</p>
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <svg viewBox="0 0 200 200" className="w-44 h-44">
          {data.map((d, i) => {
            const angle = (d.value / total) * 360;
            const endAngle = startAngle + angle;
            const start = polar(cx, cy, r, startAngle);
            const end = polar(cx, cy, r, endAngle);
            const largeArc = angle > 180 ? 1 : 0;
            const path = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
            const labelAngle = startAngle + angle / 2;
            const labelPos = polar(cx, cy, r * 0.6, labelAngle);
            const result = (
              <g key={i}>
                <path d={path} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#0f172a" strokeWidth="1" opacity="0.9" />
                {angle >= 18 && (
                  <text x={labelPos.x} y={labelPos.y + 3} textAnchor="middle" fontSize="10" fill="#0f172a" fontWeight="bold">
                    {d.sub ?? `${d.value}`}
                  </text>
                )}
              </g>
            );
            startAngle = endAngle;
            return result;
          })}
        </svg>
        <ul className="text-xs font-body text-white/85 space-y-1">
          {data.map((d, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
              <span>{d.label}{d.sub ? ` (${d.sub})` : ''}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const LineChart = ({
  title,
  data,
  xLabel,
  yLabel,
  yFormatter,
}: {
  title: string;
  data: { label: string | number; value: number }[];
  xLabel?: string;
  yLabel?: string;
  yFormatter?: (v: number) => string;
}) => {
  const W = 340;
  const H = 220;
  const padL = 56;
  const padR = 14;
  const padT = 16;
  const padB = 36;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxV = Math.max(...data.map(d => d.value));
  const minV = Math.min(...data.map(d => d.value));
  const range = maxV - minV || 1;
  const yMin = Math.floor((minV - range * 0.15) / 1000000) * 1000000;
  const yMax = Math.ceil((maxV + range * 0.15) / 1000000) * 1000000;
  const yRange = yMax - yMin || 1;

  const xStep = data.length > 1 ? chartW / (data.length - 1) : 0;
  const points = data.map((d, i) => ({
    x: padL + i * xStep,
    y: padT + chartH - ((d.value - yMin) / yRange) * chartH,
    ...d,
  }));

  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => yMin + (i * yRange) / yTickCount);

  return (
    <div className="my-3 rounded-xl border border-cyan-400/30 bg-white/5 p-3">
      <p className="text-xs text-center text-cyan-200 font-display font-bold mb-2">{title}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm mx-auto block">
        {/* Axes */}
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#94a3b8" strokeWidth="1" />
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#94a3b8" strokeWidth="1" />

        {/* Y ticks */}
        {yTicks.map((t, i) => {
          const y = H - padB - ((t - yMin) / yRange) * chartH;
          return (
            <g key={i}>
              <line x1={padL - 3} y1={y} x2={padL} y2={y} stroke="#94a3b8" strokeWidth="1" />
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#475569" strokeWidth="0.4" strokeDasharray="2 3" />
              <text x={padL - 5} y={y + 3} textAnchor="end" fontSize="9" fill="#cbd5e1">
                {yFormatter ? yFormatter(t) : t}
              </text>
            </g>
          );
        })}

        {/* Line */}
        <polyline
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
        />

        {/* Points + labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#fbbf24" stroke="#0f172a" strokeWidth="1" />
            <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">
              {yFormatter ? yFormatter(p.value) : p.value}
            </text>
            <text x={p.x} y={H - padB + 14} textAnchor="middle" fontSize="10" fill="#e2e8f0">{p.label}</text>
          </g>
        ))}

        {/* Axis labels */}
        {xLabel && <text x={(padL + W - padR) / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="#94a3b8">{xLabel}</text>}
        {yLabel && (
          <text x={14} y={H / 2} textAnchor="middle" fontSize="9" fill="#94a3b8" transform={`rotate(-90 14 ${H / 2})`}>{yLabel}</text>
        )}
      </svg>
    </div>
  );
};

const formatRupiahShort = (v: number) => {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} M`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} jt`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)} rb`;
  return `${v}`;
};

const renderDasarVisual = (no: number): React.ReactNode => {
  switch (no) {
    case 3:
      return (
        <FrequencyTable
          title="Tabel Frekuensi Nilai Matematika Siswa"
          headers={["Nilai", "Banyak Siswa"]}
          showTotal={false}
          rows={[
            { label: 4, value: 2 },
            { label: 5, value: 4 },
            { label: 6, value: 5 },
            { label: 7, value: 5 },
            { label: 8, value: 9 },
            { label: 9, value: 3 },
            { label: 10, value: 4 },
          ]}
        />
      );
    case 4:
      return (
        <HorizontalFrequencyTable
          title="Tabel Frekuensi Nilai Siswa"
          rowLabels={["Nilai", "Frekuensi"]}
          data={[
            { col: 3, freq: 2 },
            { col: 4, freq: 5 },
            { col: 5, freq: 5 },
            { col: 6, freq: 3 },
            { col: 7, freq: 4 },
            { col: 8, freq: 4 },
            { col: 9, freq: 4 },
            { col: 10, freq: 3 },
          ]}
        />
      );
    case 5:
      return (
        <BarChart
          title="Diagram Batang Nilai Ulangan Matematika 20 Siswa"
          xLabel="Nilai"
          yLabel="Banyak Siswa"
          data={[
            { label: 6, value: 2 },
            { label: 7, value: 4 },
            { label: 8, value: 6 },
            { label: 9, value: 5 },
            { label: 10, value: 3 },
          ]}
        />
      );
    case 9:
      return (
        <PieChart
          title="Diagram Lingkaran Kegemaran Mata Pelajaran"
          data={[
            { label: 'Matematika', value: 30, sub: '30°' },
            { label: 'IPA', value: 54, sub: '54°' },
            { label: 'IPS', value: 48, sub: '48°' },
            { label: 'Bahasa', value: 72, sub: '72°' },
            { label: 'Penjas', value: 156, sub: 'X°' },
          ]}
        />
      );
    case 10:
      return (
        <PieChart
          title="Diagram Lingkaran Koleksi Buku Perpustakaan"
          data={[
            { label: 'Kesenian', value: 20, sub: '20%' },
            { label: 'Kesehatan', value: 18, sub: '18%' },
            { label: 'Pertanian', value: 25, sub: '25%' },
            { label: 'Teknologi', value: 22, sub: '22%' },
            { label: 'Lainnya', value: 15, sub: '15%' },
          ]}
        />
      );
    case 11:
      return (
        <LineChart
          title="Diagram Garis Penyusutan Harga Mobil (5 Tahun)"
          xLabel="Tahun"
          yLabel="Harga (Rupiah)"
          yFormatter={formatRupiahShort}
          data={[
            { label: 2015, value: 110_000_000 },
            { label: 2016, value: 102_500_000 },
            { label: 2017, value: 95_000_000 },
            { label: 2018, value: 87_500_000 },
            { label: 2019, value: 80_000_000 },
          ]}
        />
      );
    case 12:
      return (
        <FrequencyTable
          title="Tabel Perolehan Nilai Siswa"
          headers={["Nilai", "Frekuensi"]}
          showTotal={false}
          rows={[
            { label: 3, value: 2 },
            { label: 4, value: 3 },
            { label: 5, value: 4 },
            { label: 6, value: 5 },
            { label: 7, value: 3 },
            { label: 8, value: 2 },
            { label: 9, value: 1 },
          ]}
        />
      );
    default:
      return null;
  }
};

const renderOlimpiadeVisual = (no: number): React.ReactNode => {
  switch (no) {
    case 3:
      return (
        <FrequencyTable
          title="Daftar Umur Anggota Keluarga"
          headers={["Anggota Keluarga", "Umur (tahun)"]}
          showTotal={false}
          rows={[
            { label: "Ayah", value: 40 },
            { label: "Ibu", value: 38 },
            { label: "Anak 1", value: 15 },
            { label: "Anak 2", value: 13 },
            { label: "Anak 3", value: 9 },
          ]}
        />
      );
    default:
      return null;
  }
};

const FormulaBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="my-3 rounded-xl overflow-hidden border border-cyan-400/30 shadow-[0_0_18px_rgba(6,182,212,0.15)]">
    <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/25 to-purple-500/15 px-4 py-2 border-b border-cyan-400/20">
      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
      <span className="font-display text-[11px] font-bold tracking-widest uppercase text-yellow-300">{title}</span>
    </div>
    <div className="bg-[#0a1628]/70 backdrop-blur px-4 py-3 text-sm space-y-1.5">
      {children}
    </div>
  </div>
);

const TabelFrekuensiNilai = () => (
  <div className="overflow-x-auto my-3">
    <table className="w-full text-xs font-body border-collapse">
      <thead>
        <tr className="bg-accent/20">
          <th className="border border-border/50 px-3 py-2 text-accent text-center">Nilai Ulangan</th>
          <th className="border border-border/50 px-3 py-2 text-accent text-center">Frekuensi (Jumlah Siswa)</th>
        </tr>
      </thead>
      <tbody>
        {[{v:'6',f:'3'},{v:'7',f:'8'},{v:'8',f:'5'},{v:'9',f:'4'}].map((row,i)=>(
          <tr key={i} className={i%2===0?'bg-muted/10':'bg-muted/20'}>
            <td className="border border-border/50 px-3 py-2 text-white/80 text-center">{row.v}</td>
            <td className="border border-border/50 px-3 py-2 text-white/80 text-center">{row.f}</td>
          </tr>
        ))}
        <tr className="bg-accent/10 font-bold">
          <td className="border border-border/50 px-3 py-2 text-accent text-center">Jumlah</td>
          <td className="border border-border/50 px-3 py-2 text-accent text-center">20</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const DiagramBatang = () => {
  const data = [{v:'6',f:3},{v:'7',f:8},{v:'8',f:5},{v:'9',f:4}];
  const maxF = 9;
  const w = 280, h = 160, ml = 40, mb = 35, mt = 10, mr = 10;
  const cw = w - ml - mr, ch = h - mb - mt;
  const bw = cw / data.length;
  return (
    <div className="flex flex-col items-center my-3">
      <div className="text-xs text-white/60 font-body mb-1">Diagram Batang – Nilai Ulangan Matematika</div>
      <svg width={w} height={h} style={{background:'transparent'}}>
        {/* Y axis lines */}
        {[0,2,4,6,8].map(v=>{
          const y = mt + ch - (v/maxF)*ch;
          return <g key={v}>
            <line x1={ml} y1={y} x2={ml+cw} y2={y} stroke="#ffffff20" strokeWidth="1"/>
            <text x={ml-4} y={y+4} fontSize="9" fill="#ffffff80" textAnchor="end">{v}</text>
          </g>;
        })}
        {/* Bars */}
        {data.map((d,i)=>{
          const bh = (d.f/maxF)*ch;
          const x = ml + i*bw + bw*0.15;
          const y = mt + ch - bh;
          return <g key={i}>
            <rect x={x} y={y} width={bw*0.7} height={bh} fill="#06b6d4" rx="2" opacity="0.85"/>
            <text x={x+bw*0.35} y={y-3} fontSize="9" fill="#06b6d4" textAnchor="middle">{d.f}</text>
            <text x={ml+i*bw+bw/2} y={h-mb+14} fontSize="9" fill="#ffffff80" textAnchor="middle">{d.v}</text>
          </g>;
        })}
        {/* Axes */}
        <line x1={ml} y1={mt} x2={ml} y2={mt+ch} stroke="#ffffff60" strokeWidth="1.5"/>
        <line x1={ml} y1={mt+ch} x2={ml+cw} y2={mt+ch} stroke="#ffffff60" strokeWidth="1.5"/>
        {/* Labels */}
        <text x={ml+cw/2} y={h-1} fontSize="9" fill="#ffffff60" textAnchor="middle">Nilai Ulangan</text>
        <text x={10} y={mt+ch/2} fontSize="9" fill="#ffffff60" textAnchor="middle" transform={`rotate(-90,10,${mt+ch/2})`}>Frekuensi</text>
      </svg>
    </div>
  );
};

const DiagramGaris = () => {
  const data = [{v:'6',f:3},{v:'7',f:8},{v:'8',f:5},{v:'9',f:4}];
  const maxF = 9;
  const w = 280, h = 160, ml = 40, mb = 35, mt = 10, mr = 10;
  const cw = w - ml - mr, ch = h - mb - mt;
  const bw = cw / data.length;
  const pts = data.map((d,i)=>({
    x: ml + i*bw + bw/2,
    y: mt + ch - (d.f/maxF)*ch
  }));
  const polyline = pts.map(p=>`${p.x},${p.y}`).join(' ');
  return (
    <div className="flex flex-col items-center my-3">
      <div className="text-xs text-white/60 font-body mb-1">Diagram Garis – Nilai Ulangan Matematika</div>
      <svg width={w} height={h}>
        {[0,2,4,6,8].map(v=>{
          const y = mt + ch - (v/maxF)*ch;
          return <g key={v}>
            <line x1={ml} y1={y} x2={ml+cw} y2={y} stroke="#ffffff20" strokeWidth="1"/>
            <text x={ml-4} y={y+4} fontSize="9" fill="#ffffff80" textAnchor="end">{v}</text>
          </g>;
        })}
        {data.map((d,i)=>(
          <text key={i} x={ml+i*bw+bw/2} y={h-mb+14} fontSize="9" fill="#ffffff80" textAnchor="middle">{d.v}</text>
        ))}
        <polyline points={polyline} fill="none" stroke="#a855f7" strokeWidth="2" strokeLinejoin="round"/>
        {pts.map((p,i)=>(
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#a855f7"/>
            <text x={p.x} y={p.y-6} fontSize="9" fill="#a855f7" textAnchor="middle">{data[i].f}</text>
          </g>
        ))}
        <line x1={ml} y1={mt} x2={ml} y2={mt+ch} stroke="#ffffff60" strokeWidth="1.5"/>
        <line x1={ml} y1={mt+ch} x2={ml+cw} y2={mt+ch} stroke="#ffffff60" strokeWidth="1.5"/>
        <text x={ml+cw/2} y={h-1} fontSize="9" fill="#ffffff60" textAnchor="middle">Nilai Ulangan</text>
        <text x={10} y={mt+ch/2} fontSize="9" fill="#ffffff60" textAnchor="middle" transform={`rotate(-90,10,${mt+ch/2})`}>Frekuensi</text>
      </svg>
    </div>
  );
};

const DiagramLingkaran = () => {
  const cx = 100, cy = 100, r = 80;
  const sectors = [
    { label: 'Nilai 6', f: 3, total: 20, color: '#06b6d4' },
    { label: 'Nilai 7', f: 8, total: 20, color: '#a855f7' },
    { label: 'Nilai 8', f: 5, total: 20, color: '#f59e0b' },
    { label: 'Nilai 9', f: 4, total: 20, color: '#10b981' },
  ];
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  let startAngle = -90;
  const paths = sectors.map(s => {
    const angle = (s.f / s.total) * 360;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const largeArc = angle > 180 ? 1 : 0;
    const midAngle = startAngle + angle / 2;
    const lx = cx + (r * 0.65) * Math.cos(toRad(midAngle));
    const ly = cy + (r * 0.65) * Math.sin(toRad(midAngle));
    const pct = Math.round((s.f / s.total) * 100);
    const path = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
    startAngle = endAngle;
    return { ...s, path, lx, ly, pct, angle: Math.round(angle) };
  });
  return (
    <div className="flex flex-col items-center my-3 gap-3">
      <div className="text-xs text-white/60 font-body mb-1">Diagram Lingkaran – Nilai Ulangan Matematika</div>
      <div className="flex flex-wrap gap-6 justify-center">
        <div>
          <div className="text-xs text-white/50 text-center mb-1">Dalam Derajat</div>
          <svg width={200} height={200}>
            {paths.map((s,i)=>(
              <g key={i}>
                <path d={s.path} fill={s.color} opacity="0.9" stroke="#0f172a" strokeWidth="1.5"/>
                <text x={s.lx} y={s.ly} fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">{s.angle}°</text>
              </g>
            ))}
          </svg>
        </div>
        <div>
          <div className="text-xs text-white/50 text-center mb-1">Dalam Persen</div>
          <svg width={200} height={200}>
            {paths.map((s,i)=>(
              <g key={i}>
                <path d={s.path} fill={s.color} opacity="0.9" stroke="#0f172a" strokeWidth="1.5"/>
                <text x={s.lx} y={s.ly} fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">{s.pct}%</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {paths.map((s,i)=>(
          <div key={i} className="flex items-center gap-1 text-xs font-body text-white/70">
            <div className="w-3 h-3 rounded-sm" style={{background:s.color}}/>
            {s.label} ({s.f}/20 = {s.angle}° = {s.pct}%)
          </div>
        ))}
      </div>
    </div>
  );
};

const TabelFrekuensiMean = () => (
  <div className="overflow-x-auto my-3">
    <table className="w-full text-xs font-body border-collapse">
      <thead>
        <tr className="bg-accent/20">
          <th className="border border-border/50 px-3 py-2 text-accent text-center">Nilai Ulangan (x)</th>
          <th className="border border-border/50 px-3 py-2 text-accent text-center">Frekuensi (f)</th>
          <th className="border border-border/50 px-3 py-2 text-accent text-center">f × x</th>
        </tr>
      </thead>
      <tbody>
        {[{x:6,f:3},{x:7,f:8},{x:8,f:5},{x:9,f:4}].map((row,i)=>(
          <tr key={i} className={i%2===0?'bg-muted/10':'bg-muted/20'}>
            <td className="border border-border/50 px-3 py-2 text-white/80 text-center">{row.x}</td>
            <td className="border border-border/50 px-3 py-2 text-white/80 text-center">{row.f}</td>
            <td className="border border-border/50 px-3 py-2 text-white/80 text-center">{row.f*row.x}</td>
          </tr>
        ))}
        <tr className="bg-accent/10 font-bold">
          <td className="border border-border/50 px-3 py-2 text-accent text-center">Jumlah</td>
          <td className="border border-border/50 px-3 py-2 text-accent text-center"><InlineMath math="\sum f = 20" /></td>
          <td className="border border-border/50 px-3 py-2 text-accent text-center"><InlineMath math="\sum fx = 150" /></td>
        </tr>
      </tbody>
    </table>
  </div>
);

const TabelMedianGanjil = () => (
  <div className="overflow-x-auto my-3">
    <table className="w-full text-xs font-body border-collapse">
      <thead>
        <tr className="bg-accent/20">
          <th className="border border-border/50 px-3 py-2 text-accent text-center">Nilai (x)</th>
          <th className="border border-border/50 px-3 py-2 text-accent text-center">Frekuensi (f)</th>
          <th className="border border-border/50 px-3 py-2 text-accent text-center">Frekuensi Kumulatif</th>
        </tr>
      </thead>
      <tbody>
        {[{x:5,f:3,fk:3},{x:6,f:5,fk:8},{x:7,f:7,fk:15},{x:8,f:6,fk:21},{x:9,f:4,fk:25}].map((row,i)=>(
          <tr key={i} className={row.x===7?'bg-accent/15':i%2===0?'bg-muted/10':'bg-muted/20'}>
            <td className="border border-border/50 px-3 py-2 text-white/80 text-center">{row.x}</td>
            <td className="border border-border/50 px-3 py-2 text-white/80 text-center">{row.f}</td>
            <td className="border border-border/50 px-3 py-2 text-white/80 text-center">{row.fk}</td>
          </tr>
        ))}
        <tr className="bg-accent/10 font-bold">
          <td className="border border-border/50 px-3 py-2 text-accent text-center">Jumlah</td>
          <td className="border border-border/50 px-3 py-2 text-accent text-center">25</td>
          <td className="border border-border/50 px-3 py-2 text-accent text-center">–</td>
        </tr>
      </tbody>
    </table>
    <div className="text-xs text-white/60 mt-1">← Data ke-13 berada pada nilai <span className="text-accent font-bold">7</span></div>
  </div>
);

const TabelMedianGenap = () => (
  <div className="overflow-x-auto my-3">
    <table className="w-full text-xs font-body border-collapse">
      <thead>
        <tr className="bg-accent/20">
          <th className="border border-border/50 px-3 py-2 text-accent text-center">Nilai (x)</th>
          <th className="border border-border/50 px-3 py-2 text-accent text-center">Frekuensi (f)</th>
          <th className="border border-border/50 px-3 py-2 text-accent text-center">Frekuensi Kumulatif</th>
        </tr>
      </thead>
      <tbody>
        {[{x:60,f:3,fk:3},{x:65,f:5,fk:8},{x:67,f:2,fk:10},{x:68,f:2,fk:12},{x:70,f:4,fk:16},{x:75,f:4,fk:20}].map((row,i)=>(
          <tr key={i} className={(row.x===67||row.x===68)?'bg-accent/15':i%2===0?'bg-muted/10':'bg-muted/20'}>
            <td className="border border-border/50 px-3 py-2 text-white/80 text-center">{row.x}</td>
            <td className="border border-border/50 px-3 py-2 text-white/80 text-center">{row.f}</td>
            <td className="border border-border/50 px-3 py-2 text-white/80 text-center">{row.fk}</td>
          </tr>
        ))}
        <tr className="bg-accent/10 font-bold">
          <td className="border border-border/50 px-3 py-2 text-accent text-center">Jumlah</td>
          <td className="border border-border/50 px-3 py-2 text-accent text-center">20</td>
          <td className="border border-border/50 px-3 py-2 text-accent text-center">–</td>
        </tr>
      </tbody>
    </table>
    <div className="text-xs text-white/60 mt-1">← Data ke-10 = 67, data ke-11 = 68. {renderWithLatex('$Me = \\dfrac{67+68}{2}$')} = <span className="text-accent font-bold">67,5</span></div>
  </div>
);

const TabelModus = () => (
  <div className="overflow-x-auto my-3">
    <table className="w-full text-xs font-body border-collapse">
      <thead>
        <tr className="bg-accent/20">
          <th className="border border-border/50 px-3 py-2 text-accent text-center">Nilai (x)</th>
          <th className="border border-border/50 px-3 py-2 text-accent text-center">Frekuensi (f)</th>
        </tr>
      </thead>
      <tbody>
        {[{x:5,f:3},{x:6,f:5},{x:7,f:7},{x:8,f:6},{x:9,f:4}].map((row,i)=>(
          <tr key={i} className={row.x===7?'bg-accent/15':i%2===0?'bg-muted/10':'bg-muted/20'}>
            <td className="border border-border/50 px-3 py-2 text-white/80 text-center">{row.x}</td>
            <td className="border border-border/50 px-3 py-2 text-white/80 text-center">{row.f}</td>
          </tr>
        ))}
        <tr className="bg-accent/10 font-bold">
          <td className="border border-border/50 px-3 py-2 text-accent text-center">Jumlah</td>
          <td className="border border-border/50 px-3 py-2 text-accent text-center">25</td>
        </tr>
      </tbody>
    </table>
    <div className="text-xs text-white/60 mt-1">← Nilai 7 memiliki frekuensi tertinggi (7 orang). <span className="text-accent font-bold">Modus = 7</span></div>
  </div>
);

const DiagramKuartil = () => (
  <div className="my-3 font-body text-xs text-white/80">
    <div className="bg-muted/20 rounded-lg px-4 py-3 space-y-1">
      <div className="text-white/50 mb-2">Data: 10, 20, 20, 25, <span className="text-yellow-400 font-bold">30</span>, 40, 45, 50, 80</div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="bg-cyan-500/20 border border-cyan-500/40 rounded px-2 py-1">Q₁ = 20</div>
        <div className="bg-accent/20 border border-accent/40 rounded px-2 py-1">Q₂ = 30</div>
        <div className="bg-purple-500/20 border border-purple-500/40 rounded px-2 py-1">Q₃ = 45</div>
      </div>
    </div>
  </div>
);

const materiSections = [
  {
    heading: "A. Pengertian Data dan Statistika",
    content: `Data: Kumpulan informasi atau fakta dalam bentuk angka atau kategori. Contoh: nilai siswa, tinggi badan, jenis kelamin, hobi.

Data Kualitatif: Data yang tidak berbentuk angka dan tidak dapat diukur, tetapi dapat dikategorikan. Contoh: warna favorit, jenis pekerjaan.

Data Kuantitatif: Data yang berbentuk angka dan dapat diukur atau dihitung. Contoh: tinggi badan, berat badan, jumlah siswa.

Statistika: Ilmu yang berkaitan dengan pengumpulan, pengolahan, penyajian, analisis, dan penarikan kesimpulan dari data.`
  },
  {
    heading: "B. Populasi dan Sampel",
    content: `Populasi: Keseluruhan objek atau individu yang menjadi perhatian dalam suatu penelitian. Contoh: Seluruh siswa SMP di kota Bandung.

Sampel: Sebagian dari populasi yang diambil untuk diteliti. Sampel harus representatif (mewakili) populasi agar kesimpulan yang ditarik akurat. Contoh: 100 siswa SMP yang dipilih secara acak dari kota Bandung.`
  },
  {
    heading: "C. Cara Mengumpulkan Data",
    content: `Beberapa cara umum untuk mengumpulkan data:

1. Wawancara: Mengumpulkan data dengan bertanya langsung kepada sumber data.

2. Kuesioner (Angket): Mengumpulkan data dengan daftar pertanyaan tertulis yang diisi oleh responden.

3. Observasi (Pengamatan): Mengumpulkan data dengan mengamati langsung peristiwa atau objek yang diteliti.

4. Studi Literatur/Dokumentasi: Mengumpulkan data dari dokumen, buku, laporan, atau sumber-sumber yang sudah ada.`
  },
  {
    heading: "D. Penyajian Data",
    renderContent: () => (
      <div className="font-body text-sm text-white/80 leading-relaxed space-y-4">
        <p>Data yang sudah dikumpulkan perlu disajikan agar lebih mudah dibaca dan dipahami.</p>

        <div>
          <div className="text-accent font-bold mb-1">1. Tabel Distribusi Frekuensi</div>
          <p className="mb-2">Tabel distribusi frekuensi adalah tabel yang menunjukkan sebaran frekuensi (jumlah kemunculan) dari setiap kategori atau nilai data.</p>
          <p className="text-white/60 text-xs mb-1">Contoh: Data nilai ulangan Matematika 20 siswa: 7, 8, 6, 7, 9, 8, 7, 7, 6, 9, 8, 7, 7, 8, 9, 6, 7, 8, 7, 9</p>
          <TabelFrekuensiNilai />
        </div>

        <div>
          <div className="text-accent font-bold mb-1">2. Diagram Batang</div>
          <p className="mb-2">Digunakan untuk membandingkan data antar kategori atau menunjukkan perubahan data dari waktu ke waktu. Tinggi atau panjang batang menunjukkan frekuensi atau jumlah data.</p>
          <DiagramBatang />
        </div>

        <div>
          <div className="text-accent font-bold mb-1">3. Diagram Garis</div>
          <p className="mb-2">Sering digunakan untuk menunjukkan perubahan data sepanjang waktu atau serangkaian nilai yang berurutan. Titik-titik data dihubungkan oleh garis.</p>
          <DiagramGaris />
        </div>

        <div>
          <div className="text-accent font-bold mb-1">4. Diagram Lingkaran (Pie Chart)</div>
          <p className="mb-2">Digunakan untuk menunjukkan proporsi atau bagian dari keseluruhan. Setiap sektor lingkaran mewakili persentase dari total data.</p>
          <FormulaBox title="Rumus Penting — Diagram Lingkaran">
            <div className="text-white/60 text-xs">Besar Sudut Sektor:</div>
            <div className="text-white">{renderWithLatex('$\\dfrac{\\text{Frekuensi Kategori}}{\\text{Total Frekuensi}} \\times 360°$')}</div>
            <div className="text-white/60 text-xs mt-1">Persentase Sektor:</div>
            <div className="text-white">{renderWithLatex('$\\dfrac{\\text{Frekuensi Kategori}}{\\text{Total Frekuensi}} \\times 100\\%$')}</div>
          </FormulaBox>
          <div className="text-xs text-white/60 mb-2 space-y-1">
            <div>Nilai 6: Sudut = {renderWithLatex('$\\dfrac{3}{20} \\times 360°$')} = <b className="text-white">54°</b>, Persentase = <b className="text-white">15%</b></div>
            <div>Nilai 7: Sudut = {renderWithLatex('$\\dfrac{8}{20} \\times 360°$')} = <b className="text-white">144°</b>, Persentase = <b className="text-white">40%</b></div>
            <div>Nilai 8: Sudut = {renderWithLatex('$\\dfrac{5}{20} \\times 360°$')} = <b className="text-white">90°</b>, Persentase = <b className="text-white">25%</b></div>
            <div>Nilai 9: Sudut = {renderWithLatex('$\\dfrac{4}{20} \\times 360°$')} = <b className="text-white">72°</b>, Persentase = <b className="text-white">20%</b></div>
          </div>
          <DiagramLingkaran />
        </div>
      </div>
    )
  },
  {
    heading: "E. Mean (Rata-rata)",
    renderContent: () => (
      <div className="font-body text-sm text-white/80 leading-relaxed space-y-3">
        <p>Mean atau rata-rata adalah jumlah semua nilai data dibagi dengan banyaknya data.</p>
        <FormulaBox title="Rumus Penting — Mean (Rata-rata)">
          <div className="text-white/60 text-xs">Data Tunggal:</div>
          <div className="text-white">{renderWithLatex('$\\bar{x} = \\dfrac{x_1 + x_2 + \\cdots + x_n}{n}$')}</div>
          <div className="text-white/60 text-xs mt-2">Data dengan Frekuensi:</div>
          <div className="text-white">{renderWithLatex('$\\bar{x} = \\dfrac{\\sum f_i \\cdot x_i}{\\sum f_i}$')}</div>
        </FormulaBox>

        <div>
          <div className="text-accent font-bold text-xs mb-1">Contoh 1 (Data Tunggal):</div>
          <p className="text-xs">Nilai ulangan Matematika Ani adalah 7, 8, 6, 9, 7. Berapa rata-rata nilai Ani?</p>
          <div className="bg-muted/20 rounded px-3 py-2 text-xs mt-1">
            {renderLines('$\\bar{x} = \\frac{7 + 8 + 6 + 9 + 7}{5} = \\frac{37}{5} = 7{,}4$')}
          </div>
        </div>

        <div>
          <div className="text-accent font-bold text-xs mb-1">Contoh 2 (Data dalam Tabel Frekuensi):</div>
          <p className="text-xs mb-1">Menggunakan data nilai ulangan 20 siswa dari tabel:</p>
          <TabelFrekuensiMean />
          <div className="bg-muted/20 rounded px-3 py-2 text-xs mt-1">
            {renderLines('$\\bar{x} = \\frac{\\sum f \\cdot x}{\\sum f} = \\frac{(3 \\times 6)+(8 \\times 7)+(5 \\times 8)+(4 \\times 9)}{20} = \\frac{18+56+40+36}{20} = \\frac{150}{20} = 7{,}5$')}
          </div>
        </div>
      </div>
    )
  },
  {
    heading: "F. Rata-rata Gabungan",
    renderContent: () => (
      <div className="font-body text-sm text-white/80 leading-relaxed space-y-3">
        <p>Rata-rata gabungan adalah rata-rata yang dihitung dari gabungan beberapa kelompok data, di mana setiap kelompok memiliki rata-rata dan jumlah anggota (bobot) yang berbeda.</p>
        <FormulaBox title="Rumus Penting — Rata-rata Gabungan">
          <div className="text-white">{renderWithLatex('$\\bar{x}_{gab} = \\dfrac{n_1 \\cdot \\bar{x}_1 + n_2 \\cdot \\bar{x}_2 + \\cdots + n_k \\cdot \\bar{x}_k}{n_1 + n_2 + \\cdots + n_k}$')}</div>
          <div className="text-white/60 text-xs mt-1">Dengan notasi sigma:</div>
          <div className="text-white">{renderWithLatex('$\\bar{x}_{gab} = \\dfrac{\\sum_{i=1}^{k} n_i \\cdot \\bar{x}_i}{\\sum_{i=1}^{k} n_i}$')}</div>
        </FormulaBox>

        <div>
          <div className="text-accent font-bold text-xs mb-1">Contoh 1:</div>
          <p className="text-xs">Rata-rata tinggi badan 15 siswa laki-laki adalah 160 cm, sedangkan rata-rata tinggi badan 10 siswa perempuan adalah 150 cm. Berapakah rata-rata tinggi badan seluruh siswa?</p>
          <div className="bg-muted/20 rounded px-3 py-2 text-xs mt-1">
            {renderLines('$\\bar{x}_{gab} = \\frac{(15 \\times 160) + (10 \\times 150)}{15 + 10} = \\frac{2400 + 1500}{25} = \\frac{3900}{25} = 156$ cm')}
          </div>
        </div>

        <div>
          <div className="text-accent font-bold text-xs mb-1">Contoh 2:</div>
          <p className="text-xs">Tinggi rata-rata 10 orang pemain basket adalah 172 cm. Setelah 2 orang keluar, tinggi rata-ratanya menjadi 173 cm. Tentukan rata-rata tinggi 2 orang yang keluar itu.</p>
          <div className="bg-muted/20 rounded px-3 py-2 text-xs mt-1">
            {renderLines('Total tinggi 10 orang $= 10 \\times 172 = 1720$ cm')}
            {renderLines('Total tinggi 8 orang $= 8 \\times 173 = 1384$ cm')}
            {renderLines('Jumlah tinggi 2 orang yang keluar $= 1720 - 1384 = 336$ cm')}
            {renderLines('Rata-rata 2 orang $= 336 \\div 2 = 168$ cm')}
          </div>
        </div>

        <div>
          <div className="text-accent font-bold text-xs mb-1">Contoh 3:</div>
          <p className="text-xs">Rata-rata nilai ulangan matematika di suatu kelas adalah 7,5. Jika rata-rata nilai siswa laki-laki adalah 7,2 dan rata-rata nilai siswa perempuan adalah 7,8, maka berapakah perbandingan jumlah siswa laki-laki dan perempuan pada kelas tersebut?</p>
          <div className="bg-muted/20 rounded px-3 py-2 text-xs mt-1 space-y-1">
            <div className="text-white/60">Diketahui:</div>
            <div>Rata-rata gabungan kelas {renderWithLatex('$(\\bar{x}_{gab})$')} = 7,5</div>
            <div>Siswa Laki-laki: {renderWithLatex('$\\bar{x}_L = 7{,}3$')}</div>
            <div>Siswa Perempuan: {renderWithLatex('$\\bar{x}_P = 7{,}8$')}</div>
            <div className="text-white/60 mt-1">Penyelesaian:</div>
            {renderLines('$\\bar{x}_{gab} = \\frac{n_L \\cdot \\bar{x}_L + n_P \\cdot \\bar{x}_P}{n_L + n_P}$')}
            {renderLines('$7{,}5 = \\frac{7{,}3 \\cdot n_L + 7{,}8 \\cdot n_P}{n_L + n_P}$')}
            {renderLines('$7{,}5 n_L + 7{,}5 n_P = 7{,}3 n_L + 7{,}8 n_P$')}
            {renderLines('$0{,}2 n_L = 0{,}3 n_P$')}
            {renderLines('$\\frac{n_L}{n_P} = \\frac{0{,}3}{0{,}2} = \\frac{3}{2}$')}
            <div className="text-accent font-bold mt-1">Jadi, perbandingan jumlah siswa laki-laki dan perempuan di kelas tersebut adalah 3 : 2.</div>
          </div>
        </div>
      </div>
    )
  },
  {
    heading: "G. Median (Nilai Tengah)",
    renderContent: () => (
      <div className="font-body text-sm text-white/80 leading-relaxed space-y-3">
        <p>Median adalah nilai tengah dari kumpulan data yang telah diurutkan dari yang terkecil hingga terbesar (atau sebaliknya).</p>
        <FormulaBox title="Rumus Penting — Median">
          <div className="text-white/70 text-xs mb-1">Urutkan data terlebih dahulu, lalu:</div>
          <div className="text-white">n ganjil → Median = data ke {renderWithLatex('$\\dfrac{n+1}{2}$')}</div>
          <div className="text-white">n genap → Median = rata-rata data ke {renderWithLatex('$\\dfrac{n}{2}$')} dan {renderWithLatex('$\\dfrac{n}{2}+1$')}</div>
        </FormulaBox>

        <div>
          <div className="text-accent font-bold text-xs mb-1">Contoh 1 (Data Ganjil):</div>
          <p className="text-xs">Nilai ulangan Ani: 7, 8, 6, 9, 7</p>
          <div className="bg-muted/20 rounded px-3 py-2 text-xs mt-1 space-y-0.5">
            <div>Urutkan: 6, 7, 7, 8, 9</div>
            <div>n = 5 (ganjil). Letak median = {renderWithLatex('$\\frac{5+1}{2} = 3$')}</div>
            <div>Nilai ke-3 = <span className="text-accent font-bold">7</span>. Jadi Median = 7.</div>
          </div>
        </div>

        <div>
          <div className="text-accent font-bold text-xs mb-1">Contoh 2 (Data Genap):</div>
          <p className="text-xs">Nilai ulangan Beni: 8, 6, 7, 9, 5, 8</p>
          <div className="bg-muted/20 rounded px-3 py-2 text-xs mt-1 space-y-0.5">
            <div>Urutkan: 5, 6, 7, 8, 8, 9</div>
            <div>n = 6 (genap). Letak: data ke-3 dan ke-4</div>
            <div>{renderWithLatex('$Me = \\frac{7+8}{2} = \\frac{15}{2} = 7{,}5$')}</div>
          </div>
        </div>

        <div>
          <div className="text-accent font-bold text-xs mb-1">Contoh 3 (Data Frekuensi – n Ganjil = 25):</div>
          <TabelMedianGanjil />
          <div className="bg-muted/20 rounded px-3 py-2 text-xs space-y-0.5">
            <div>Jumlah data = 25 (ganjil). Median = data ke {renderWithLatex('$\\frac{25+1}{2} = 13$')}</div>
            <div>Data ke-13 berada di kumulatif frekuensi nilai 7 (fk = 15, setelah fk = 8)</div>
            <div className="text-accent font-bold">Median = 7</div>
          </div>
        </div>

        <div>
          <div className="text-accent font-bold text-xs mb-1">Contoh 4 (Data Frekuensi – n Genap = 20):</div>
          <TabelMedianGenap />
          <div className="bg-muted/20 rounded px-3 py-2 text-xs space-y-0.5">
            <div>Jumlah data = 20 (genap). Median = rata-rata data ke-10 dan ke-11</div>
            <div>Data ke-10 = 67, data ke-11 = 68</div>
            <div>{renderWithLatex('$Me = \\frac{67+68}{2} = \\frac{135}{2} = 67{,}5$')}</div>
          </div>
        </div>
      </div>
    )
  },
  {
    heading: "H. Modus (Nilai Paling Sering Muncul)",
    renderContent: () => (
      <div className="font-body text-sm text-white/80 leading-relaxed space-y-3">
        <p>Modus adalah nilai atau kategori data yang paling sering muncul (memiliki frekuensi tertinggi). Sebuah data bisa memiliki satu modus atau lebih dari satu modus.</p>

        <div className="bg-muted/20 rounded px-3 py-2 text-xs space-y-1">
          <div><span className="text-accent font-bold">Contoh 1:</span> Nilai ulangan Ani: 6, 7, 7, 8, 9</div>
          <div>Nilai 7 muncul 2 kali, nilai lainnya 1 kali. <span className="text-accent font-bold">Modus = 7.</span></div>
          <div className="mt-1"><span className="text-accent font-bold">Contoh 2:</span> Ukuran sepatu: 38, 39, 40, 38, 41, 39, 40, 38</div>
          <div>38 → 3 kali, 39 → 2 kali, 40 → 2 kali, 41 → 1 kali. <span className="text-accent font-bold">Modus = 38.</span></div>
          <div className="mt-1"><span className="text-accent font-bold">Contoh 3:</span> Jenis kelamin: L, P, L, P, L, P</div>
          <div>L → 3 kali, P → 3 kali. <span className="text-accent font-bold">Modus = L dan P (bimodal).</span></div>
        </div>

        <div>
          <div className="text-accent font-bold text-xs mb-1">Contoh (Data Tabel Frekuensi):</div>
          <p className="text-xs mb-1">Tentukan modus dari data berikut:</p>
          <TabelModus />
        </div>
      </div>
    )
  },
  {
    heading: "I. Kuartil dan Ukuran Penyebaran Data",
    renderContent: () => (
      <div className="font-body text-sm text-white/80 leading-relaxed space-y-3">
        <p>Kuartil adalah ukuran yang membagi data menjadi empat kelompok yang sama banyak setelah diurutkan. Dilambangkan dengan Q.</p>
        <FormulaBox title="Rumus Penting — Kuartil">
          <div className="text-white">{renderWithLatex('$Q_1$')} <span className="text-white/70">= Kuartil bawah (25% data terkecil)</span></div>
          <div className="text-white">{renderWithLatex('$Q_2$')} <span className="text-white/70">= Kuartil tengah = Median</span></div>
          <div className="text-white">{renderWithLatex('$Q_3$')} <span className="text-white/70">= Kuartil atas (75% data terkecil)</span></div>
        </FormulaBox>

        <div>
          <div className="text-accent font-bold text-xs mb-1">Contoh 1 (n = 9 data ganjil):</div>
          <p className="text-xs">Data: 50, 40, 20, 10, 25, 20, 80, 30, 45. Tentukan Q₁, Q₂, Q₃.</p>
          <div className="bg-muted/20 rounded px-3 py-2 text-xs mt-1 space-y-1">
            <div>Diurutkan: 10, 20, 20, 25, 30, 40, 45, 50, 80</div>
            <DiagramKuartil />
            <div>Q₂ = data ke-5 = <span className="text-accent font-bold">30</span></div>
            <div>Q₁ = median dari 10, 20, 20, 25 → {renderWithLatex('$\\frac{20+20}{2} = 20$')} → {renderWithLatex('$Q_1 = 20$')}</div>
            <div>Q₃ = median dari 40, 45, 50, 80 → {renderWithLatex('$\\frac{45+50}{2} = 47{,}5$')} → {renderWithLatex('$Q_3 = 47{,}5$')}</div>
          </div>
        </div>

        <div>
          <div className="text-accent font-bold text-xs mb-1">Contoh 2 (n = 10 data genap):</div>
          <p className="text-xs">Data berat badan: 45, 56, 60, 68, 72, 78, 80, 54, 53, 52</p>
          <div className="bg-muted/20 rounded px-3 py-2 text-xs mt-1 space-y-1">
            <div>Diurutkan: 45, 52, 53, 54, 56, 60, 68, 72, 78, 80</div>
            <div>Q₂ = {renderWithLatex('$\\frac{56+60}{2} = 58$')}</div>
            <div>Q₁ = median dari 45, 52, <span className="text-cyan-400 font-bold">53</span>, 54, 56 = <span className="text-accent font-bold">53</span></div>
            <div>Q₃ = median dari 60, 68, <span className="text-cyan-400 font-bold">72</span>, 78, 80 = <span className="text-accent font-bold">72</span></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-accent font-bold text-xs">Ukuran Penyebaran Data:</div>
          <FormulaBox title="Rumus Penting — Ukuran Penyebaran Data">
            <div className="space-y-2">
              <div>
                <div className="text-yellow-300 font-bold text-xs">A. Jangkauan (Range)</div>
                <div className="text-white">{renderWithLatex('$R = X_{maks} - X_{min}$')}</div>
              </div>
              <div>
                <div className="text-yellow-300 font-bold text-xs">B. Jangkauan Interkuartil (QR)</div>
                <div className="text-white">{renderWithLatex('$Q_R = Q_3 - Q_1$')}</div>
              </div>
              <div>
                <div className="text-yellow-300 font-bold text-xs">C. Simpangan Kuartil (QD)</div>
                <div className="text-white">{renderWithLatex('$Q_D = \\dfrac{1}{2}(Q_3 - Q_1)$')}</div>
              </div>
            </div>
          </FormulaBox>
          <div className="bg-muted/20 rounded px-3 py-2 text-xs space-y-1">
            <div className="text-white/60">Contoh: Data: 20, 35, 50, 45, 30, 30, 25, 40, 45, 30, 35</div>
            <div>Diurutkan: 20, 25, 30, 30, <span className="text-yellow-400">30</span>, 35, 35, <span className="text-purple-400">40</span>, 45, 45, 50</div>
            <div>Q₁ = 30, Q₂ = 35, Q₃ = 45</div>
            <div>{renderWithLatex('$Q_R = Q_3 - Q_1 = 45 - 30 = 15$')}</div>
            <div>{renderWithLatex('$Q_D = \\frac{1}{2} \\times 15 = 7{,}5$')}</div>
          </div>
        </div>
      </div>
    )
  },
];

const latihanDasar = [
  { no: 1, soal: "Diketahui data berikut: 85, 90, 70, 80, 70, 65, 80, 85, 70, 80, 95, 70. Modus dan median data tersebut berturut-turut adalah ...", options: ["A. 65 dan 80", "B. 70 dan 80", "C. 75 dan 70", "D. 80 dan 75"] },
  { no: 2, soal: "Median dan mean dari data: 5, 5, 7, 3, 2, 5, 6, 9, 7, 10, 7, 7 berturut-turut adalah ...", options: ["A. 5,5 dan 6,1", "B. 5,5 dan 7,0", "C. 6,5 dan 6,1", "D. 6,5 dan 7,0"] },
  { no: 3, soal: "Nilai matematika siswa disajikan dalam tabel berikut:\nNilai: 4, 5, 6, 7, 8, 9, 10\nBanyak siswa: 2, 4, 5, 5, 9, 3, 4\nMedian dari data di atas adalah ...", options: ["A. 6,5", "B. 7,0", "C. 7,5", "D. 8,0"] },
  { no: 4, soal: "Perhatikan tabel berikut!\nNilai: 3, 4, 5, 6, 7, 8, 9, 10\nFrekuensi: 2, 5, 5, 3, 4, 4, 4, 3\nPernyataan yang benar dari tabel di atas adalah ...", options: ["A. Modus dari data 5", "B. Median data 6,5", "C. Rata-rata data 6,6", "D. Jangkauan data 6"] },
  { no: 5, soal: "Diagram batang menunjukan nilai ulangan matematika diperoleh dari 20 anak pada suatu kelas. Tinggi batang untuk nilai 6 = 2, nilai 7 = 4, nilai 8 = 6, nilai 9 = 5, nilai 10 = 3. Rataan (Mean) dari data tersebut adalah ...", options: ["A. 7", "B. 7,5", "C. 8", "D. 8,5"] },
  { no: 6, soal: "Dalam sebuah kelas, nilai rata-rata siswa putra adalah 7,2, sedangkan rata-rata kelompok putri adalah 8,1. Jika nilai rata-rata kelas adalah 7,5, maka perbandingan banyak putra dan siswa putri adalah ...", options: ["A. 2 : 1", "B. 1 : 2", "C. 1 : 3", "D. 2 : 3"] },
  { no: 7, soal: "Nilai rata-rata ulangan matematika siswa perempuan 75 dan siswa laki-laki adalah 66 dan rata-rata nilai keseluruhan siswa kelas tersebut adalah 72. Jika dalam kelas tersebut terdapat 36 siswa, banyak siswa laki-laki adalah ...", options: ["A. 12 orang", "B. 16 orang", "C. 18 orang", "D. 24 orang"] },
  { no: 8, soal: "Rata-rata nilai remedial 20 siswa adalah 7, rata-rata nilai siswa laki-laki adalah 6 dan rata-rata nilai siswa perempuan adalah 8,5. Selisih banyak siswa laki-laki dan perempuan adalah ...", options: ["A. 8", "B. 6", "C. 4", "D. 3"] },
  { no: 9, soal: "Diagram lingkaran menunjukan tentang kegemaran siswa terhadap mata pelajaran. Persentase: Matematika 30°, IPA 54°, IPS 48°, Bahasa 72°, Penjas X°. Jika jumlah siswa seluruhnya 240 orang, jumlah siswa yang gemar penjas adalah ...", options: ["A. 76 orang", "B. 90 orang", "C. 104 orang", "D. 156 orang"] },
  { no: 10, soal: "Data koleksi jenis buku di sebuah perpustakaan tersaji dalam diagram lingkaran. Persentase: Kesenian 20%, Kesehatan 18%, Pertanian 25%, Teknologi 22%, Lainnya 15%. Jika banyak buku kesenian 200 eksemplar, banyak buku kesehatan .... eksemplar", options: ["A. 180", "B. 200", "C. 210", "D. 220"] },
  { no: 11, soal: "Diagram garis menunjukan penyusutan harga mobil setelah dipakai dalam kurun waktu 5 tahun. Harga 2015: Rp 110.000.000, harga 2016: Rp 102.500.000. Besarnya penyusutan antara tahun 2015 dan 2016 adalah ...", options: ["A. Rp 2.500.000,00", "B. Rp 5.000.000,00", "C. Rp 5.500.000,00", "D. Rp 7.500.000,00"] },
  { no: 12, soal: "Perhatikan tabel perolehan nilai berikut.\nNilai: 3, 4, 5, 6, 7, 8, 9\nFrekuensi: 2, 3, 4, 5, 3, 2, 1\nBanyaknya siswa yang memperoleh nilai lebih dari nilai rata-rata adalah ...", options: ["A. 6 orang", "B. 9 orang", "C. 11 orang", "D. 15 orang"] },
  { no: 13, soal: "Suatu hari Ani menemukan sobekan kertas koran yang memuat data pengunjung perpustakaan berupa gambar diagram batang. Rata-rata pengunjung 41 orang selama lima hari. Data tersedia: Senin = 30, Selasa = 45, Rabu = ?, Kamis = 50, Jumat = 25. Tolong bantu Ani mencari banyak pengunjung pada hari Rabu ...", options: ["A. 55 orang", "B. 60 orang", "C. 65 orang", "D. 70 orang"] },
  { no: 14, soal: "Ada 25 murid perempuan dalam sebuah kelas. Rata-rata tinggi mereka adalah 130 cm. Pernyataan yang benar adalah ...", options: ["A. Jika ada seorang murid perempuan dengan tinggi 132 cm, maka pasti ada seorang murid perempuan dengan tinggi 128 cm.", "B. Jika 23 orang dari murid perempuan tersebut tingginya masing-masing 130 cm dan satu orang tingginya 133 cm, maka satu lagi tingginya 127 cm.", "C. Jika anda mengurutkan semua perempuan tersebut dari yang terpendek sampai yang tertinggi, maka yang di tengah pasti mempunyai tinggi 130 cm.", "D. Setengah dari perempuan di kelas pasti di bawah 130 cm dan setengahnya lagi pasti di atas 130 cm."] },
  { no: 15, soal: "Disajikan data sebagai berikut: 4, 7, 4, 6, 10, 5, 6, 3, 8, 5, 8, 9. Kuartil atas ($Q_3$) dari data tersebut adalah ...", options: ["A. 6", "B. 7", "C. 7,5", "D. 8"] },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2004 Tingkat Kota\nRata-rata sembilan bilangan adalah 6. Satu diantara kesembilan bilangan dibuang. Rata-rata delapan bilangan yang tinggal adalah $6\\frac{1}{2}$. Bilangan yang dibuang adalah ...", options: [] },
  { no: 2, soal: "OSN Matematika 2005 Tingkat Kota\nSekumpulan data dari 5 bilangan asli memiliki rata-rata hitung 8 dan rentang (selisih terbesar dan terkecil) 12. Bilangan asli terkecil yang tidak mungkin menjadi anggota dari kumpulan tersebut adalah ...", options: ["A. 1", "B. 20", "C. 18", "D. 6", "E. 15"] },
  { no: 3, soal: "OSN Matematika 2008 Tingkat Kota\nLima orang dalam satu keluarga dicatat nama dan umurnya:\nAyah = 40 thn, Ibu = 38 thn, Anak 1 = 15 thn, Anak 2 = 13 thn, Anak 3 = 9 thn.\nRata-rata umur keluarga tersebut lima tahun yang lalu adalah ...", options: [] },
  { no: 4, soal: "OSN Matematika 2008 Tingkat Kota\nRata-rata dari 15 bilangan asli berbeda adalah 12, maka bilangan asli terbesar yang mungkin adalah ...", options: ["A. 45", "B. 75", "C. 89", "D. 105", "E. 166"] },
  { no: 5, soal: "OSN Matematika 2009 Tingkat Kota\nJika nilai ulangan siswa kelas VIII terdiri dari bilangan genap berurutan dengan nilai terendah 2 dan tertinggi 98, jangkauan interkuartil dari data tersebut adalah ...", options: [] },
  { no: 6, soal: "OSN Matematika 2009 Tingkat Kota\nRata-rata dari empat bilangan berurutan adalah $2m - 1$, maka nilai dari empat kali bilangan terkecil adalah ...", options: ["A. $8m + 8$", "B. $8m + 3$", "C. $8m - 7$", "D. $8m - 10$"] },
  { no: 7, soal: "OSN Matematika 2009 Tingkat Kota\nRata-rata 15 bilangan adalah 0. Bila bilangan v, w, x, y dan z ditambahkan, maka rata-ratanya bertambah 5. Rata-rata bilangan yang ditambahkan adalah ...", options: [] },
  { no: 8, soal: "OSN Matematika 2011 Tingkat Kota\nRataan usia kelompok guru dan profesor adalah 40 tahun. Jika rataan kelompok guru adalah 35 tahun sedangkan rataan kelompok profesor adalah 50 tahun, perbandingan banyaknya guru dengan profesor adalah ...", options: ["A. 2 : 1", "B. 1 : 2", "C. 3 : 2", "D. 2 : 3", "E. 3 : 4"] },
  { no: 9, soal: "OSN Matematika 2012 Tingkat Kota\nJika rata-rata 1000 bilangan ganjil positif berurutan adalah 2012, maka bilangan terkecil dari bilangan-bilangan tersebut adalah ...", options: [] },
  { no: 10, soal: "OSN Matematika 2013 Tingkat Kota\nDiketahui sekelompok data memiliki sifat-sifat berikut:\ni. Terdiri dari 5 data bilangan positif dengan rataan = 7\nii. Median = modus = 9\nJika jangkauan didefinisikan sebagai selisih data terbesar dengan data terkecil, maka jangkauan terbesar yang mungkin adalah ...", options: ["A. 11", "B. 12", "C. 13", "D. 14", "E. 15"] },
  { no: 11, soal: "OSN Matematika 2013 Tingkat Kota\nNilai rata-rata kelas A adalah 73, sedangkan nilai rata-rata kelas B adalah 88. Jika jumlah siswa kedua kelas tersebut adalah 75 dan nilai rata-rata kedua kelas adalah 80, maka banyak siswa kelas A adalah ... orang", options: ["A. 35", "B. 38", "C. 40", "D. 42", "E. 45"] },
  { no: 12, soal: "OSN Matematika 2013 Tingkat Kota\nJika rata-rata 51 bilangan bulat berurutan adalah 10, maka bilangan terkecil dari semua bilangan tersebut adalah ...", options: ["A. 5", "B. 0", "C. -5", "D. -13", "E. -15"] },
  { no: 13, soal: "OSN Matematika 2014 Tingkat Kota\nDiketahui empat bilangan a, b, c dan d. Jika rata-rata a dan b adalah 50 dan rata-rata b dan c adalah 75, serta rata-rata c dan d adalah 70, maka rata-rata a dan d adalah ...", options: ["A. 35", "B. 45", "C. 50", "D. 55"] },
  { no: 14, soal: "OSN Matematika 2014 Tingkat Kota\nRata-rata nilai 28 siswa adalah 80. Setelah ditambah nilai siswa A dan B, rata-ratanya menjadi 78. Jika nilai A tiga kali nilai B, maka selisih antara nilai A dan B adalah ...", options: ["A. 15", "B. 25", "C. 50", "D. 75"] },
  { no: 15, soal: "OSN Matematika 2014 Tingkat Kota\nPerhatikan dua diagram batang A dan B. Pernyataan berikut yang salah adalah ...", options: ["A. Modus pada gambar A < modus pada gambar B", "B. Median pada gambar A < median pada gambar B", "C. Quartil 1 pada gambar A < Quartil 1 pada gambar B", "D. Rata-rata pada gambar A = rata-rata pada gambar B"] },
  { no: 16, soal: "OSN Matematika 2015 Tingkat Kota\nNilai ujian lima orang siswa yakni Adi, Budi, Cici, Didi dan Eki adalah bilangan bulat dan mempunyai rata-rata yang sama dengan mediannya. Diketahui nilai tertinggi adalah 10 dan terendah adalah 4. Jika yang memperoleh nilai tertinggi adalah Adi dan yang terendah adalah Eki, maka susunan nilai yang mungkin ada sebanyak ...", options: ["A. 3", "B. 4", "C. 13", "D. 16"] },
  { no: 17, soal: "OSN Matematika 2016 Tingkat Kota\nSuatu survey dilakukan pada siswa kelas VII untuk mengetahui siswa yang berminat mengikuti kegiatan Paskibra. Hasil survei adalah sebagai berikut:\n– 25% dari total siswa kelas VII berminat mengikuti kegiatan tersebut.\n– 90% dari total peminat kegiatan Paskibra adalah siswa putri.\nRasio total siswa putri dari total siswa putra kelas VII di sekolah tersebut adalah ...", options: ["A. 9 : 1", "B. 9 : 2", "C. 9 : 3", "D. 9 : 4"] },
  { no: 18, soal: "OSN Matematika 2016 Tingkat Kota\nSuatu perusahaan menjual dua jenis produk A dan B. Rasio penjualan A : B tiap tahun adalah 3:2 (2012), 2:3 (2013), 1:4 (2014), 5:6 (2015). Banyak penjualan produk A: 2012 = 600, 2013 = 800, 2014 = 400, 2015 = 1000.\nRata-rata banyak penjualan produk B dalam 4 tahun yang sama adalah ...", options: ["A. 1000", "B. 1340", "C. 1350", "D. 1500"] },
  { no: 19, soal: "OSN Matematika 2016 Tingkat Kota\nTerdapat lima bilangan bulat positif dengan rata-rata 40 dan jangkauan 10. Nilai maksimum yang mungkin untuk bilangan terbesar dari lima bilangan tersebut adalah ...", options: ["A. 50", "B. 49", "C. 48", "D. 45"] },
  { no: 20, soal: "OSN Matematika 2016 Tingkat Kota\nDi kelas VIII terdapat 11 siswa. Pada saat ulangan matematika, ada satu orang siswa yang sakit sehingga harus mengikuti ulangan susulan. Nilai 10 siswa yang mengikuti ulangan pada waktunya adalah 20, 10, 40, 80, 50, 60, 40, 70, 90 dan 30. Jika nilai siswa yang mengikuti ulangan susulan diperhitungkan, maka rata-rata nilai yang diperoleh sama dengan median. Nilai terbesar yang mungkin diperoleh siswa yang mengikuti ujian susulan adalah ...", options: [] },
  { no: 21, soal: "OSN Matematika 2017 Tingkat Kota\nGrafik berikut mengilustrasikan lomba lari 100 m yang diikuti oleh tiga orang siswa A, B dan C. Berdasarkan grafik tersebut, pernyataan yang benar adalah ...", options: ["A. Pelari C selalu berlari paling depan", "B. Pelari B disusul oleh C sebelum garis finis", "C. Pelari A paling cepat berlari sampai ke garis finis", "D. Pelari B memenangi lomba karena berlari dengan kecepatan konstan"] },
  { no: 22, soal: "OSN Matematika 2017 Tingkat Kota\nData 4 pengamatan berupa bilangan positif yang sudah diurutkan dilambangkan dengan $x_1$, $x_2$, $x_3$ dan $x_4$. Jika jangkauan data tersebut adalah 16, $x_1 = \\frac{1}{6}$ median, $x_2 = \\frac{1}{2}$ median dan $x_3 = x_4$, maka rata-rata data tersebut adalah ...", options: ["A. 10", "B. 11", "C. 12", "D. 13"] },
  { no: 23, soal: "OSN Matematika 2018 Tingkat Kota\nRata-rata usia sepasang suami istri pada saat mereka menikah adalah 25 tahun. Rata-rata usia pada saat anak pertama lahir adalah 18 tahun. Rata-rata usia keluarga pada saat anak kedua lahir adalah 15 tahun. Rata-rata usia keluarga pada saat anak ketiga dan anak keempat lahir (kembar) adalah 12 tahun. Jika saat ini rata-rata usia enam orang adalah 16 tahun, maka usia anak pertama adalah ...", options: ["A. 7", "B. 8", "C. 9", "D. 10"] },
  { no: 24, soal: "OSN Matematika 2018 Tingkat Kota\nPerhatikan grafik yang menampilkan profit PT ABC dari sisi jenis kelamin, usia dan rata-rata penjualan per minggu yang dihasilkan oleh stafnya. Diketahui semua staf di bawah 35 tahun adalah pria dan semua staf 45 tahun ke atas adalah wanita. Dua pertiga dari staf berusia 35–45 tahun adalah pria.\nData: staf <35 thn = 18 orang, avg = Rp 5 jt/minggu; staf 35–45 thn = 12 orang, avg = Rp 8 jt/minggu; staf >45 thn = 10 orang, avg = Rp 6 jt/minggu.\nPembulatan persentase penjualan oleh staf pria PT ABC terhadap keseluruhan hasil penjualan adalah ...", options: ["A. 81%", "B. 76%", "C. 71%", "D. 66%"] },
  { no: 25, soal: "OSN Matematika 2018 Tingkat Kota\nDiketahui tabel distribusi nilai siswa kelas A dan kelas B.\nKelas A: nilai 6 (5 siswa), 7 (10 siswa), 8 (8 siswa), 9 (7 siswa).\nKelas B: nilai 6 (7 siswa), 7 (8 siswa), 8 (10 siswa), 9 (5 siswa).\nPernyataan berikut yang benar adalah ...", options: ["A. Median nilai ulangan sama untuk kelas A dan kelas B", "B. Mean nilai ulangan sama untuk kelas A dan kelas B", "C. Modus nilai ulangan sama untuk kelas A dan kelas B", "D. Jawaban A, B dan C salah"] },
  { no: 26, soal: "OSN Matematika 2018 Tingkat Kota\nPada suatu data terdapat 25 bilangan bulat positif. Bilangan terbesar pada data tersebut adalah 55. Median dari data tersebut adalah 30. Rata-rata terbesar yang mungkin dari data tersebut adalah ...", options: ["A. 40", "B. 42", "C. 45", "D. 50"] },
  { no: 27, soal: "OSN Matematika 2019 Tingkat Kota\nMisalkan terdapat n nilai ulangan mempunyai rata-rata 75. Jika ada tambahan sebanyak m nilai ulangan masing-masing 100, maka rata-ratanya sekarang menjadi lebih dari 80. Nilai $\\frac{m}{n}$ yang mungkin adalah ...", options: ["A. $\\frac{1}{4}$", "B. $\\frac{1}{5}$", "C. $\\frac{1}{6}$", "D. $\\frac{1}{7}$"] },
  { no: 28, soal: "OSN Matematika 2019 Tingkat Kota\nDiketahui lima buah bilangan positif yang sudah terurut yaitu $n + 1$, $n + 2$, $2m - 4$, $2m - 2$, $m + 4$. Rata-rata bilangan tersebut sama dengan jangkauan dan sama pula dengan mediannya. Nilai $m + n$ adalah ...", options: ["A. 5", "B. 7", "C. 10", "D. 12"] },
  { no: 29, soal: "OSN Matematika 2019 Tingkat Kota\nDiagram batang menyatakan nilai-nilai ulangan dari kelompok siswa laki-laki dan siswa perempuan.\nLaki-laki: nilai 6 = 2, nilai 7 = 4, nilai 8 = 6, nilai 9 = 8, nilai 10 = 5.\nPerempuan: nilai 6 = 4, nilai 7 = 6, nilai 8 = 8, nilai 9 = 4, nilai 10 = 3.\nJika $M_1$ adalah median untuk nilai kelompok laki-laki, $M_2$ adalah median untuk nilai ulangan kelompok perempuan dan $M$ adalah median nilai ulangan keseluruhan siswa, maka nilai $M_1 + M_2 + M$ adalah ...", options: ["A. 150", "B. 200", "C. 220", "D. 240"] },
  { no: 30, soal: "OSN Matematika 2020 Tingkat Kota\nSebuah dadu berisi enam dilempar sebanyak n kali, n > 0. Jika rata-rata dadu yang keluar adalah $\\frac{1}{4}n$, maka median dari seluruh nilai n yang mungkin adalah ...", options: ["A. 11", "B. 12", "C. 13", "D. 14"] },
  { no: 31, soal: "OSN Matematika 2020 Tingkat Kota\nA adalah himpunan semua bilangan tiga digit yang tidak memuat 0 dan semua digitnya berbeda. Jika x, y, z berturut-turut adalah rata-rata, median dan jangkauan dari semua anggota A, maka nilai dari $x - y + z$ adalah ...", options: ["A. 445", "B. 504", "C. 555", "D. 864"] },
  { no: 32, soal: "OSN Matematika 2020 Tingkat Kota\nSuatu kelas terdiri dari 35 siswa. Pada saat ulangan matematika terdapat 2 orang siswa berhalangan, misalnya siswa A dan B. Nilai ulangan pada awalnya dicatat hanya dari 33 siswa dan memiliki rata-rata 80. Setelah ditambah nilai susulan dua siswa yang berhalangan tersebut, nilai rata-rata kelas menjadi 78. Jika nilai A dua kali lipat lebih tinggi dibanding nilai B, maka selisih nilai A dan B adalah ...", options: ["A. 15", "B. 20", "C. 30", "D. 55"] },
  { no: 33, soal: "OSN Matematika 2021 Tingkat Kota\nLima data bilangan asli tidak lebih dari sepuluh mempunyai modus 5 dan rata-rata 6. Jika terhadap lima data tersebut ditambah satu data bilangan asli yang tidak lebih dari 10, maka salah satu median yang mungkin dari enam data adalah ...", options: ["A. 4", "B. 4,5", "C. 5", "D. 6,5"] },
  { no: 34, soal: "OSN Matematika 2022 Tingkat Kota\nNilai ulangan matematika siswa kelas VII di SMP Harapan disajikan dalam grafik. Grafik tersebut memberikan frekuensi nilai kelompok siswa laki-laki (L) dan siswa perempuan (P) secara terpisah. Misalkan $R_L$ dan $M_L$ menyatakan rata-rata dan median nilai kelompok siswa laki-laki serta $R_P$ dan $M_P$ menyatakan rata-rata dan median nilai kelompok siswa perempuan. Di antara pernyataan berikut, pernyataan yang benar adalah ...", options: ["A. $M_P = M_L$", "B. $M_P < M_L$", "C. $R_P > R_L$", "D. $R_P = R_L$"] },
  { no: 35, soal: "OSN Matematika 2024 Tingkat Kota\nSekelompok bilangan berbeda terdiri dari 6 bilangan genap dan 4 bilangan ganjil. Dari kelompok bilangan tersebut diperoleh informasi berikut:\n– Jangkauan data = 24\n– Jangkauan antar kuartil = 14\n– Bilangan ke-3, 5, 6 dan 8 adalah bilangan ganjil.\n– Median = 2024\n– Rata-rata bilangan ganjil adalah 2022\nRata-rata terbesar yang mungkin dimiliki oleh kelompok bilangan tersebut adalah ...", options: ["A. 2022", "B. 2022,4", "C. 2024", "D. 2024,4"] },
  { no: 36, soal: "OSN Matematika 2024 Tingkat Kota\nEmpat bilangan asli kurang dari sepuluh memiliki rata-rata, median dan modus tunggal yang membentuk tiga bilangan asli berurutan. Jika A adalah jumlah terkecil yang mungkin dari empat bilangan tersebut dan B adalah jumlah terbesar yang mungkin dari empat bilangan tersebut, maka nilai dari $A + B$ adalah ...", options: ["A. 36", "B. 40", "C. 42", "D. 44"] },
  { no: 37, soal: "OSN Matematika 2025 Tingkat Kota\nSuatu data terdiri dari 35 bilangan bulat positif. Bilangan terbesar adalah 29 dan mediannya adalah 22. Misalkan rata-rata terkecil yang mungkin dari data tersebut adalah x dan rata-rata terbesar yang mungkin dari data tersebut adalah y. Nilai $x + y = ...$", options: ["A. 40,4", "B. 37,4", "C. 36,4", "D. 25,4"] },
];

const OlimpiadeStatistikaPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSections.length }, (_, i) => i));
  const [openPembahasan, setOpenPembahasan] = useState<Set<string>>(new Set());

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const togglePembahasan = (key: string) => {
    playPopSound();
    setOpenPembahasan(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* Hero Header */}
        <div className="relative mb-8 rounded-2xl overflow-hidden border border-cyan-400/20 shadow-[0_0_40px_rgba(6,182,212,0.12)]">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-purple-900/30 to-[#0a1628]/80" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/8 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col items-center py-8 px-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/20 border border-cyan-400/30 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Trophy className="w-7 h-7 text-cyan-300" />
            </div>
            <div className="text-xs font-display tracking-widest text-cyan-400/70 uppercase mb-1">Olimpiade Matematika</div>
            <h1 className="font-display text-2xl md:text-3xl font-black text-white text-center drop-shadow-[0_0_20px_rgba(6,182,212,0.5)] mb-1">
              STATISTIKA
            </h1>
            <p className="text-white/40 text-xs font-body">Irawan Sutiawan, M.Pd</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "Materi", icon: BookOpen },
            { key: "dasar" as const, label: "Latihan Dasar", icon: Dumbbell },
            { key: "olimpiade" as const, label: "Latihan Olimpiade", icon: Trophy },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => { playPopSound(); setActiveTab(tab.key); }}
                className={`font-display text-xs px-4 py-2 rounded-xl border cursor-pointer transition-all flex items-center gap-1.5 ${
                  active
                    ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.35)]"
                    : "bg-card/60 text-white/60 border-border hover:border-cyan-400/40 hover:text-white/80"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "materi" && (
          <div className="space-y-2.5 animate-slide-up">
            {materiSections.map((section, idx) => {
              const isOpen = expandedSections.includes(idx);
              return (
                <div
                  key={idx}
                  className={`rounded-xl overflow-hidden border transition-all ${
                    isOpen
                      ? "border-cyan-400/30 shadow-[0_0_16px_rgba(6,182,212,0.1)]"
                      : "border-border/60 hover:border-cyan-400/20"
                  }`}
                >
                  <button
                    onClick={() => toggleSection(idx)}
                    className={`w-full flex items-center justify-between px-5 py-3.5 cursor-pointer text-left transition-all ${
                      isOpen
                        ? "bg-gradient-to-r from-cyan-900/40 to-purple-900/20"
                        : "bg-card/70 hover:bg-card/90"
                    }`}
                  >
                    <span className={`font-display text-sm font-bold transition-colors ${isOpen ? "text-cyan-300" : "text-white/80"}`}>
                      {section.heading}
                    </span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isOpen ? "bg-cyan-500/20 border border-cyan-400/40" : "bg-white/5 border border-white/10"
                    }`}>
                      {isOpen
                        ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                        : <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                      }
                    </div>
                  </button>
                  {isOpen && (
                    <div className="bg-[#0b1628]/80 backdrop-blur px-5 pb-5 pt-3 border-t border-cyan-400/10">
                      {'renderContent' in section && section.renderContent ? (
                        section.renderContent()
                      ) : (
                        <div className="font-body text-sm text-white/80 leading-relaxed">
                          {'content' in section && section.content
                            ? section.content.split('\n').map((line, i) => (
                                <div key={i} className="mb-1">{renderWithLatex(line)}</div>
                              ))
                            : null}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "dasar" && (
          <div className="space-y-3 animate-slide-up">
            {latihanDasar.map((soal) => {
              const key = `d-${soal.no}`;
              const open = openPembahasan.has(key);
              const pembahasan = pembahasanDasar[soal.no];
              const visual = renderDasarVisual(soal.no);
              return (
                <div key={soal.no} className="bg-card/70 backdrop-blur border border-border/60 rounded-xl px-5 py-4 hover:border-cyan-400/20 transition-colors">
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-display font-bold text-xs mr-2">{soal.no}</span>
                    {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                  {dasarImages[soal.no] && (
                    <div className="flex justify-center mb-3">
                      <img
                        src={dasarImages[soal.no]}
                        alt={`Gambar soal ${soal.no}`}
                        className="max-w-[320px] w-full rounded-lg border border-white/10 bg-white/90 p-2"
                      />
                    </div>
                  )}
                  {visual}
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/70 bg-white/5 border border-white/8 rounded-lg px-3 py-2 hover:bg-white/8 transition-colors">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}
                  {pembahasan && (
                    <div className="pt-3">
                      <button
                        onClick={() => togglePembahasan(key)}
                        className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 border border-yellow-500/30 transition-colors"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        {open ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
                        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      {open && (
                        <div className="mt-2 bg-yellow-500/5 border-l-4 border-yellow-400 rounded-r-lg px-3 py-2 space-y-1">
                          {pembahasan}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "olimpiade" && (
          <div className="space-y-3 animate-slide-up">
            {latihanOlimpiade.map((soal) => {
              const key = `o-${soal.no}`;
              const open = openPembahasan.has(key);
              const pembahasan = pembahasanOlimpiade[soal.no];
              const visual = renderOlimpiadeVisual(soal.no);
              return (
                <div key={soal.no} className="bg-card/70 backdrop-blur border border-border/60 rounded-xl px-5 py-4 hover:border-yellow-400/20 transition-colors">
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 font-display font-bold text-xs mr-2">{soal.no}</span>
                    {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {lineIdx === 0 && line.startsWith('OSN') ? (
                          <span className="inline-block bg-yellow-500/10 border border-yellow-400/20 rounded px-2 py-0.5 text-yellow-300 font-semibold text-xs mb-1">{line}</span>
                        ) : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                  {olimpiadeImages[soal.no] && (
                    <div className="flex flex-col items-center gap-3 mb-3">
                      {olimpiadeImages[soal.no].map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`Gambar soal olimpiade ${soal.no}${olimpiadeImages[soal.no].length > 1 ? ` (${i + 1})` : ''}`}
                          className="max-w-[420px] w-full rounded-lg border border-white/10 bg-white/90 p-2"
                        />
                      ))}
                    </div>
                  )}
                  {visual}
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/70 bg-white/5 border border-white/8 rounded-lg px-3 py-2 hover:bg-white/8 transition-colors">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}
                  {pembahasan && (
                    <div className="pt-3">
                      <button
                        onClick={() => togglePembahasan(key)}
                        className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 border border-yellow-500/30 transition-colors"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        {open ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
                        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      {open && (
                        <div className="mt-2 bg-yellow-500/5 border-l-4 border-yellow-400 rounded-r-lg px-3 py-2 space-y-1">
                          {pembahasan}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-white/40 hover:text-cyan-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadeStatistikaPage;
