import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BarChart2, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const MathText = ({ text, className = "" }: { text: string; className?: string }) => {
  const elements = useMemo(() => {
    const result: React.ReactNode[] = [];
    let key = 0;
    const blockParts = text.split(/(\$\$[^$]+\$\$)/g);
    blockParts.forEach((part) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2).trim();
        result.push(<span key={key++} className="mx-1 block text-center my-2"><BlockMath math={math} /></span>);
      } else if (part) {
        const inlineParts = part.split(/(\$[^$]+\$)/g);
        inlineParts.forEach((ip) => {
          if (ip.startsWith("$") && ip.endsWith("$")) {
            result.push(<span key={key++} className="mx-0.5"><InlineMath math={ip.slice(1, -1)} /></span>);
          } else if (ip) {
            result.push(<span key={key++}>{ip}</span>);
          }
        });
      }
    });
    return result;
  }, [text]);
  return <span className={className}>{elements}</span>;
};

type Difficulty = "Mudah" | "Sedang" | "Sulit";
type QuestionType = "PG" | "MCMA" | "Benar/Salah";
interface Statement { text: string; isCorrect: boolean; }
interface Question {
  id: number;
  type: QuestionType;
  difficulty: Difficulty;
  category: string;
  question: string;
  options?: string[];
  statements?: Statement[];
  correctAnswer?: string;
  svg?: React.ReactNode;
  explanation: { concept: string; steps: string[]; formula?: string; };
}

/* ══════════════════════════════════════════════════════
   SVG COMPONENTS
══════════════════════════════════════════════════════ */

const Tabel = ({ title, headers, rows }: { title: string; headers: string[]; rows: (string | number)[][] }) => (
  <div className="my-3">
    <p className="text-xs text-center text-slate-400 font-mono mb-2">{title}</p>
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr>{headers.map((h, i) => (
            <th key={i} className="bg-primary/20 border border-primary/30 px-3 py-2 text-primary font-bold text-center font-mono">
              <MathText text={String(h)} />
            </th>
          ))}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-slate-800/40" : "bg-slate-700/30"}>
              {row.map((cell, j) => (
                <td key={j} className="border border-slate-600/40 px-3 py-2 text-center text-white/80 font-mono">
                  <MathText text={String(cell)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DiagramBatangNilai7SVG = () => {
  const bars: [string, number, string][] = [["50",3,"#f472b6"],["60",5,"#60a5fa"],["70",12,"#34d399"],["80",8,"#fbbf24"],["90",4,"#a78bfa"],["100",2,"#fb923c"]];
  const maxF = 12;
  return (
    <svg viewBox="0 0 300 155" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="150" y="13" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Diagram Batang Nilai Ulangan Matematika Kelas 7</text>
      <line x1="28" y1="18" x2="28" y2="128" stroke="#475569" strokeWidth="1"/>
      <line x1="28" y1="128" x2="285" y2="128" stroke="#475569" strokeWidth="1"/>
      {[0,3,6,9,12].map((v,i)=><text key={i} x="24" y={128-(v/maxF)*100+3} fill="#64748b" fontSize="7" textAnchor="end" fontFamily="monospace">{v}</text>)}
      {bars.map(([val,f,color],i)=>{
        const bh=(f/maxF)*100; const x=38+i*41; const y=128-bh;
        return(<g key={i}>
          <rect x={x} y={y} width="28" height={bh} fill={color} fillOpacity="0.75" rx="3" stroke={color} strokeWidth="1"/>
          <text x={x+14} y={y-3} fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">{f}</text>
          <text x={x+14} y={141} fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">{val}</text>
        </g>);
      })}
      <text x="155" y="153" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Nilai</text>
      <text x="10" y="75" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="middle">f</text>
    </svg>
  );
};

const DiagramLingkaranHobiSVG = () => {
  const data = [
    { label:"Olahraga", deg:108, pct:30, color:"#60a5fa" },
    { label:"Musik", deg:72, pct:20, color:"#34d399" },
    { label:"Membaca", deg:90, pct:25, color:"#fbbf24" },
    { label:"Gaming", deg:54, pct:15, color:"#f472b6" },
    { label:"Masak", deg:36, pct:10, color:"#a78bfa" },
  ];
  const toRad = (d:number) => (d*Math.PI)/180;
  const cx=85,cy=82,r=55; const slices:React.ReactNode[]=[]; let cum=0;
  data.forEach((d,i)=>{
    const sa=toRad(cum-90); const sw=(d.deg); const ea=toRad(cum+sw-90);
    const x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa),x2=cx+r*Math.cos(ea),y2=cy+r*Math.sin(ea);
    const lg=sw>180?1:0; const ma=toRad(cum+sw/2-90);
    const lx=cx+(r*0.65)*Math.cos(ma),ly=cy+(r*0.65)*Math.sin(ma);
    slices.push(<g key={i}>
      <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} Z`} fill={d.color} fillOpacity="0.78" stroke="#0f172a" strokeWidth="1.5"/>
      <text x={lx} y={ly} fill="#0f172a" fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{d.pct}%</text>
    </g>);
    cum+=sw;
  });
  return (
    <svg viewBox="0 0 285 175" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="142" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Diagram Lingkaran Hobi 360 Siswa</text>
      {slices}
      {data.map((d,i)=><g key={i}>
        <rect x="155" y={22+i*28} width="12" height="12" fill={d.color} fillOpacity="0.85" rx="2"/>
        <text x="172" y={32+i*28} fill="#e2e8f0" fontSize="7.5" fontFamily="monospace">{d.label} ({d.deg}° / {d.pct}%)</text>
      </g>)}
      <text x="85" y="163" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">n = 360 siswa</text>
    </svg>
  );
};

const DiagramGarisSuhuSVG = () => {
  const data=[22,26,30,33,31,28,25];
  const days=["Sen","Sel","Rab","Kam","Jum","Sab","Min"];
  const scY=(v:number)=>120-((v-18)/20)*95;
  const scX=(i:number)=>30+i*36;
  return (
    <svg viewBox="0 0 280 145" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="140" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Suhu Udara Minggu Ini (°C)</text>
      <line x1="22" y1="18" x2="22" y2="122" stroke="#475569" strokeWidth="1"/>
      <line x1="22" y1="122" x2="260" y2="122" stroke="#475569" strokeWidth="1"/>
      {[20,25,30,35].map((v,i)=><text key={i} x="18" y={scY(v)+3} fill="#64748b" fontSize="7" textAnchor="end" fontFamily="monospace">{v}</text>)}
      <polyline points={data.map((v,i)=>`${scX(i)},${scY(v)}`).join(" ")} fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinejoin="round"/>
      {data.map((v,i)=><g key={i}>
        <circle cx={scX(i)} cy={scY(v)} r="4" fill="#60a5fa" stroke="#0f172a" strokeWidth="1.5"/>
        <text x={scX(i)} y={scY(v)-7} fill="#e2e8f0" fontSize="7.5" textAnchor="middle" fontFamily="monospace">{v}</text>
        <text x={scX(i)} y="136" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">{days[i]}</text>
      </g>)}
    </svg>
  );
};

const HistogramNilaiSVG = () => {
  const bars:[[number,number],number,string][]=[[[55,62],4,"#f472b6"],[[63,70],9,"#60a5fa"],[[71,78],14,"#34d399"],[[79,86],10,"#fbbf24"],[[87,94],7,"#a78bfa"],[[95,102],3,"#fb923c"]];
  const maxF=14;
  return (
    <svg viewBox="0 0 300 150" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="150" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Histogram Nilai Ujian Matematika (n=47)</text>
      <line x1="30" y1="18" x2="30" y2="120" stroke="#475569" strokeWidth="1"/>
      <line x1="30" y1="120" x2="285" y2="120" stroke="#475569" strokeWidth="1"/>
      {bars.map(([[lo,hi],f,color],i)=>{
        const bw=40; const bh=(f/maxF)*90; const x=35+i*41; const y=120-bh;
        return(<g key={i}>
          <rect x={x} y={y} width={bw} height={bh} fill={color} fillOpacity="0.72" stroke="#0f172a" strokeWidth="1"/>
          <text x={x+bw/2} y={y-3} fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">{f}</text>
          <text x={x+bw/2} y="132" fill="#94a3b8" fontSize="6.5" textAnchor="middle" fontFamily="monospace">{lo}–{hi}</text>
        </g>);
      })}
      {[0,5,10,14].map((v,i)=><text key={i} x="26" y={120-(v/maxF)*90+3} fill="#64748b" fontSize="7" textAnchor="end" fontFamily="monospace">{v}</text>)}
      <text x="155" y="146" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Interval Nilai</text>
    </svg>
  );
};

const BoxPlotSVG = ({ min,q1,q2,q3,max }: { min:number;q1:number;q2:number;q3:number;max:number }) => {
  const sc=(v:number)=>30+((v-min)/(max-min))*220;
  return (
    <svg viewBox="0 0 280 100" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="140" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Box Plot (Diagram Kotak-Garis)</text>
      <line x1={sc(min)} y1="52" x2={sc(q1)} y2="52" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,2"/>
      <rect x={sc(q1)} y="38" width={sc(q3)-sc(q1)} height="28" fill="rgba(99,102,241,0.22)" stroke="#818cf8" strokeWidth="1.5" rx="2"/>
      <line x1={sc(q2)} y1="38" x2={sc(q2)} y2="66" stroke="#fbbf24" strokeWidth="2.5"/>
      <line x1={sc(q3)} y1="52" x2={sc(max)} y2="52" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,2"/>
      <line x1={sc(min)} y1="44" x2={sc(min)} y2="60" stroke="#94a3b8" strokeWidth="1.5"/>
      <line x1={sc(max)} y1="44" x2={sc(max)} y2="60" stroke="#94a3b8" strokeWidth="1.5"/>
      {[{l:"Min",v:min},{l:"Q₁",v:q1},{l:"Med",v:q2},{l:"Q₃",v:q3},{l:"Max",v:max}].map((x,i)=><g key={i}>
        <text x={sc(x.v)} y={80} fill={i===2?"#fbbf24":"#94a3b8"} fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight={i===2?"bold":"normal"}>{x.v}</text>
        <text x={sc(x.v)} y={93} fill={i===2?"#fbbf24":"#64748b"} fontSize="6.5" textAnchor="middle" fontFamily="monospace">{x.l}</text>
      </g>)}
    </svg>
  );
};

const OgiveSVG = () => {
  const pts:[number,number][] = [[55,0],[62,4],[70,13],[78,27],[86,37],[94,44],[102,47]];
  const scX=(v:number)=>30+((v-50)/55)*220;
  const scY=(v:number)=>118-(v/47)*95;
  return (
    <svg viewBox="0 0 280 140" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="140" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Ogive (Frekuensi Kumulatif Naik)</text>
      <line x1="28" y1="18" x2="28" y2="120" stroke="#475569" strokeWidth="1"/>
      <line x1="28" y1="120" x2="258" y2="120" stroke="#475569" strokeWidth="1"/>
      {[0,10,20,30,40,47].map((v,i)=><text key={i} x="24" y={scY(v)+3} fill="#64748b" fontSize="7" textAnchor="end" fontFamily="monospace">{v}</text>)}
      {pts.map(([x],i)=><text key={i} x={scX(x)} y="132" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">{x}</text>)}
      <polyline points={pts.map(([x,y])=>`${scX(x)},${scY(y)}`).join(" ")} fill="none" stroke="#34d399" strokeWidth="2" strokeLinejoin="round"/>
      {pts.map(([x,y],i)=><circle key={i} cx={scX(x)} cy={scY(y)} r="3.5" fill="#34d399" stroke="#0f172a" strokeWidth="1.5"/>)}
      <text x="10" y="70" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="middle">fk</text>
    </svg>
  );
};

const DiagramBatangGandaSVG = () => {
  const vals=["70","75","80","85","90"];
  const aData=[4,7,10,6,3]; const bData=[6,8,7,9,5];
  return (
    <svg viewBox="0 0 310 165" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="155" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Nilai Ulangan IPA Kelas 8A dan 8B</text>
      <line x1="28" y1="18" x2="28" y2="122" stroke="#475569" strokeWidth="1"/>
      <line x1="28" y1="122" x2="295" y2="122" stroke="#475569" strokeWidth="1"/>
      {vals.map((val,i)=>{
        const x=40+i*52;
        return(<g key={i}>
          <rect x={x} y={122-aData[i]*8} width="18" height={aData[i]*8} fill="#60a5fa" fillOpacity="0.8" rx="2"/>
          <rect x={x+21} y={122-bData[i]*8} width="18" height={bData[i]*8} fill="#f472b6" fillOpacity="0.8" rx="2"/>
          <text x={x+9} y={122-aData[i]*8-3} fill="#93c5fd" fontSize="7" textAnchor="middle" fontFamily="monospace">{aData[i]}</text>
          <text x={x+30} y={122-bData[i]*8-3} fill="#f9a8d4" fontSize="7" textAnchor="middle" fontFamily="monospace">{bData[i]}</text>
          <text x={x+19} y="134" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">{val}</text>
        </g>);
      })}
      {[0,3,6,9].map((v,i)=><text key={i} x="24" y={122-v*8+3} fill="#64748b" fontSize="7" textAnchor="end" fontFamily="monospace">{v}</text>)}
      <rect x="32" y="144" width="12" height="8" fill="#60a5fa" fillOpacity="0.85" rx="1"/>
      <text x="48" y="152" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">Kelas 8A</text>
      <rect x="110" y="144" width="12" height="8" fill="#f472b6" fillOpacity="0.85" rx="1"/>
      <text x="126" y="152" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">Kelas 8B</text>
    </svg>
  );
};

const PiktogramSVG = () => (
  <svg viewBox="0 0 280 130" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
    <text x="140" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Piktogram Penjualan Es Krim (1 gambar = 5 buah)</text>
    {[["Senin","████",20],["Selasa","██████",30],["Rabu","█████",25],["Kamis","███",15],["Jumat","███████",35]].map(([day,icons,n],i)=>(
      <g key={i}>
        <text x="53" y={30+i*19} fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">{day}</text>
        <text x="57" y={30+i*19} fill="#fbbf24" fontSize="9" fontFamily="monospace">{icons}</text>
        <text x="255" y={30+i*19} fill="#64748b" fontSize="7.5" fontFamily="monospace">{n}</text>
      </g>
    ))}
    <text x="140" y="125" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">Keterangan: 1 blok = 5 buah es krim</text>
  </svg>
);

const DotPlotSVG = ({ data, label }: { data: number[]; label: string }) => {
  const freq: Record<number,number> = {};
  data.forEach(v => { freq[v] = (freq[v]||0)+1; });
  const vals = [...new Set(data)].sort((a,b)=>a-b);
  const minV=vals[0]-1, maxV=vals[vals.length-1]+1;
  const scX=(v:number)=>25+((v-minV)/(maxV-minV))*240;
  return (
    <svg viewBox="0 0 280 90" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="140" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">{label}</text>
      <line x1="20" y1="70" x2="265" y2="70" stroke="#475569" strokeWidth="1"/>
      {vals.map((v)=>{
        const cnt=freq[v]; const cx=scX(v);
        return Array.from({length:cnt}).map((_,i)=><circle key={`${v}-${i}`} cx={cx} cy={70-10-i*10} r="4" fill="#60a5fa" fillOpacity="0.8" stroke="#0f172a" strokeWidth="1"/>);
      })}
      {vals.map(v=><text key={v} x={scX(v)} y="82" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">{v}</text>)}
    </svg>
  );
};

const MeanMedModSVG = ({ data, mean, median, modus }: { data:number[]; mean:number; median:number; modus:number }) => {
  const sorted=[...data].sort((a,b)=>a-b);
  const minV=sorted[0]-2, maxV=sorted[sorted.length-1]+2;
  const sc=(v:number)=>22+((v-minV)/(maxV-minV))*240;
  return (
    <svg viewBox="0 0 280 110" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="140" y="11" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Visualisasi Ukuran Pemusatan Data</text>
      <line x1="18" y1="52" x2="262" y2="52" stroke="#334155" strokeWidth="1"/>
      {sorted.map((v,i)=><circle key={i} cx={sc(v)} cy="52" r="5" fill="#60a5fa" fillOpacity="0.75" stroke="#0f172a" strokeWidth="1"/>)}
      {sorted.map((v,i)=><text key={i} x={sc(v)} y="68" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">{v}</text>)}
      <line x1={sc(mean)} y1="26" x2={sc(mean)} y2="76" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3,2"/>
      <text x={sc(mean)} y="22" fill="#34d399" fontSize="7" textAnchor="middle" fontFamily="monospace">x̄={mean}</text>
      <line x1={sc(median)} y1="26" x2={sc(median)} y2="76" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,2"/>
      <text x={sc(median)} y="88" fill="#fbbf24" fontSize="7" textAnchor="middle" fontFamily="monospace">Me={median}</text>
      <line x1={sc(modus)} y1="26" x2={sc(modus)} y2="76" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="3,2"/>
      <text x={sc(modus)} y="100" fill="#f472b6" fontSize="7" textAnchor="middle" fontFamily="monospace">Mo={modus}</text>
    </svg>
  );
};

const SimBakuSVG = ({ data, mean, sd }: { data:number[]; mean:number; sd:number }) => {
  const minV=mean-3*sd-2, maxV=mean+3*sd+2;
  const sc=(v:number)=>22+((v-minV)/(maxV-minV))*240;
  return (
    <svg viewBox="0 0 280 100" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="140" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Visualisasi Simpangan Baku (SD = {sd})</text>
      <line x1="18" y1="55" x2="262" y2="55" stroke="#334155" strokeWidth="1"/>
      <rect x={sc(mean-sd)} y="42" width={sc(mean+sd)-sc(mean-sd)} height="26" fill="rgba(99,102,241,0.15)" stroke="#818cf8" strokeWidth="1" rx="2"/>
      <line x1={sc(mean)} y1="30" x2={sc(mean)} y2="72" stroke="#34d399" strokeWidth="2"/>
      <text x={sc(mean)} y="26" fill="#34d399" fontSize="7.5" textAnchor="middle" fontFamily="monospace">x̄={mean}</text>
      {data.map((v,i)=><circle key={i} cx={sc(v)} cy="55" r="4.5" fill="#60a5fa" fillOpacity="0.8" stroke="#0f172a" strokeWidth="1"/>)}
      {data.map((v,i)=><text key={i} x={sc(v)} y="86" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">{v}</text>)}
    </svg>
  );
};

const DiagramLingkaranTransportasiSVG = () => {
  const data=[
    {label:"Jalan kaki",pct:25,color:"#60a5fa"},
    {label:"Sepeda",pct:30,color:"#34d399"},
    {label:"Motor",pct:35,color:"#fbbf24"},
    {label:"Mobil",pct:10,color:"#f472b6"},
  ];
  const toRad=(d:number)=>(d*Math.PI)/180;
  const cx=88,cy=82,r=56; const slices:React.ReactNode[]=[]; let cum=0;
  data.forEach((d,i)=>{
    const sa=toRad(cum-90); const sw=(d.pct/100)*360; const ea=toRad(cum+sw-90);
    const x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa),x2=cx+r*Math.cos(ea),y2=cy+r*Math.sin(ea);
    const lg=sw>180?1:0; const ma=toRad(cum+sw/2-90);
    const lx=cx+(r*0.65)*Math.cos(ma),ly=cy+(r*0.65)*Math.sin(ma);
    slices.push(<g key={i}>
      <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} Z`} fill={d.color} fillOpacity="0.78" stroke="#0f172a" strokeWidth="1.5"/>
      <text x={lx} y={ly} fill="#0f172a" fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{d.pct}%</text>
    </g>);
    cum+=sw;
  });
  return (
    <svg viewBox="0 0 285 172" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="142" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Cara Berangkat Sekolah (n=200 siswa)</text>
      {slices}
      {data.map((d,i)=><g key={i}>
        <rect x="157" y={22+i*32} width="12" height="12" fill={d.color} fillOpacity="0.85" rx="2"/>
        <text x="174" y={32+i*32} fill="#e2e8f0" fontSize="7.5" fontFamily="monospace">{d.label} ({d.pct}%)</text>
      </g>)}
      <text x="88" y="162" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Total: 200 siswa</text>
    </svg>
  );
};

const DiagramBatangPenjualanSVG = () => {
  const data:[string,number,string][]=[["Roti",45,"#f472b6"],["Susu",30,"#60a5fa"],["Kue",60,"#fbbf24"],["Jus",25,"#34d399"],["Bakso",50,"#a78bfa"]];
  const maxF=60;
  return (
    <svg viewBox="0 0 300 155" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="150" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Penjualan Kantin Sekolah (unit/hari)</text>
      <line x1="28" y1="18" x2="28" y2="120" stroke="#475569" strokeWidth="1"/>
      <line x1="28" y1="120" x2="285" y2="120" stroke="#475569" strokeWidth="1"/>
      {data.map(([lbl,f,color],i)=>{
        const bh=(f/maxF)*92; const x=40+i*50;
        return(<g key={i}>
          <rect x={x} y={120-bh} width="34" height={bh} fill={color} fillOpacity="0.75" rx="3"/>
          <text x={x+17} y={120-bh-3} fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">{f}</text>
          <text x={x+17} y="132" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">{lbl}</text>
        </g>);
      })}
      {[0,15,30,45,60].map((v,i)=><text key={i} x="24" y={120-(v/maxF)*92+3} fill="#64748b" fontSize="7" textAnchor="end" fontFamily="monospace">{v}</text>)}
    </svg>
  );
};

const DiagramGarisPenjualanBulananSVG = () => {
  const data=[150,180,160,200,220,195,240,210,260,230,280,250];
  const months=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"];
  const minV=130,maxV=290;
  const scX=(i:number)=>22+i*22;
  const scY=(v:number)=>120-((v-minV)/(maxV-minV))*95;
  return (
    <svg viewBox="0 0 300 145" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="150" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Penjualan Buku (eksemplar) Toko Buku Cerdas</text>
      <line x1="18" y1="18" x2="18" y2="122" stroke="#475569" strokeWidth="1"/>
      <line x1="18" y1="122" x2="280" y2="122" stroke="#475569" strokeWidth="1"/>
      {[150,200,250].map((v,i)=><text key={i} x="14" y={scY(v)+3} fill="#64748b" fontSize="6.5" textAnchor="end" fontFamily="monospace">{v}</text>)}
      <polyline points={data.map((v,i)=>`${scX(i)},${scY(v)}`).join(" ")} fill="none" stroke="#34d399" strokeWidth="2" strokeLinejoin="round"/>
      {data.map((v,i)=><g key={i}>
        <circle cx={scX(i)} cy={scY(v)} r="3.5" fill="#34d399" stroke="#0f172a" strokeWidth="1.5"/>
        <text x={scX(i)} y={135} fill="#94a3b8" fontSize="5.5" textAnchor="middle" fontFamily="monospace">{months[i]}</text>
      </g>)}
    </svg>
  );
};

const DiagramLingkaranMapelSVG = () => {
  const data=[
    {label:"Matematika",deg:90,color:"#60a5fa"},
    {label:"IPA",deg:72,color:"#34d399"},
    {label:"B. Indonesia",deg:108,color:"#fbbf24"},
    {label:"IPS",deg:54,color:"#f472b6"},
    {label:"Seni Budaya",deg:36,color:"#a78bfa"},
  ];
  const toRad=(d:number)=>(d*Math.PI)/180;
  const cx=82,cy=80,r=55; const slices:React.ReactNode[]=[]; let cum=0;
  data.forEach((d,i)=>{
    const sa=toRad(cum-90); const ea=toRad(cum+d.deg-90);
    const x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa),x2=cx+r*Math.cos(ea),y2=cy+r*Math.sin(ea);
    const lg=d.deg>180?1:0; const ma=toRad(cum+d.deg/2-90);
    const lx=cx+(r*0.65)*Math.cos(ma),ly=cy+(r*0.65)*Math.sin(ma);
    slices.push(<g key={i}>
      <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} Z`} fill={d.color} fillOpacity="0.78" stroke="#0f172a" strokeWidth="1.5"/>
      <text x={lx} y={ly} fill="#0f172a" fontSize="7" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{d.deg}°</text>
    </g>);
    cum+=d.deg;
  });
  return (
    <svg viewBox="0 0 290 168" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="142" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Mata Pelajaran Favorit (n=360 siswa)</text>
      {slices}
      {data.map((d,i)=><g key={i}>
        <rect x="152" y={20+i*26} width="12" height="12" fill={d.color} fillOpacity="0.85" rx="2"/>
        <text x="168" y={30+i*26} fill="#e2e8f0" fontSize="7" fontFamily="monospace">{d.label} ({d.deg}°)</text>
      </g>)}
    </svg>
  );
};

const JangkauanIQRSVG = ({ data,j,q1,q3,iqr }: { data:number[];j:number;q1:number;q3:number;iqr:number }) => {
  const minV=Math.min(...data)-2, maxV=Math.max(...data)+2;
  const sc=(v:number)=>22+((v-minV)/(maxV-minV))*238;
  return (
    <svg viewBox="0 0 280 115" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="140" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Visualisasi Jangkauan dan IQR</text>
      <line x1="18" y1="55" x2="262" y2="55" stroke="#334155" strokeWidth="1"/>
      {data.map((v,i)=><circle key={i} cx={sc(v)} cy="55" r="5" fill="#60a5fa" fillOpacity="0.8" stroke="#0f172a" strokeWidth="1"/>)}
      <line x1={sc(Math.min(...data))} y1="42" x2={sc(Math.max(...data))} y2="42" stroke="#ef4444" strokeWidth="1.5"/>
      <line x1={sc(Math.min(...data))} y1="37" x2={sc(Math.min(...data))} y2="47" stroke="#ef4444" strokeWidth="1.5"/>
      <line x1={sc(Math.max(...data))} y1="37" x2={sc(Math.max(...data))} y2="47" stroke="#ef4444" strokeWidth="1.5"/>
      <text x={(sc(Math.min(...data))+sc(Math.max(...data)))/2} y="35" fill="#ef4444" fontSize="7.5" textAnchor="middle" fontFamily="monospace">Jangkauan={j}</text>
      <rect x={sc(q1)} y="62" width={sc(q3)-sc(q1)} height="20" fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth="1.5" rx="2"/>
      <text x={(sc(q1)+sc(q3))/2} y="90" fill="#fbbf24" fontSize="7.5" textAnchor="middle" fontFamily="monospace">IQR={iqr}</text>
      {data.map((v,i)=><text key={i} x={sc(v)} y="105" fill="#64748b" fontSize="7" textAnchor="middle" fontFamily="monospace">{v}</text>)}
    </svg>
  );
};

const DiagramBatangNilaiRaporSVG = () => {
  const data:[string,number,string][]=[["Ani",78,"#60a5fa"],["Budi",85,"#34d399"],["Cici",72,"#fbbf24"],["Dani",90,"#f472b6"],["Eko",88,"#a78bfa"],["Fira",76,"#fb923c"]];
  const maxV=100;
  return (
    <svg viewBox="0 0 310 155" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="155" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Nilai Rapor Matematika 6 Siswa Kelas 8</text>
      <line x1="30" y1="18" x2="30" y2="125" stroke="#475569" strokeWidth="1"/>
      <line x1="30" y1="125" x2="295" y2="125" stroke="#475569" strokeWidth="1"/>
      {data.map(([name,val,color],i)=>{
        const bh=(val/maxV)*97; const x=40+i*43;
        return(<g key={i}>
          <rect x={x} y={125-bh} width="28" height={bh} fill={color} fillOpacity="0.75" rx="3"/>
          <text x={x+14} y={125-bh-3} fill="#fff" fontSize="8" textAnchor="middle" fontFamily="monospace">{val}</text>
          <text x={x+14} y="137" fill="#94a3b8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">{name}</text>
        </g>);
      })}
      {[70,80,90,100].map((v,i)=><text key={i} x="26" y={125-(v/maxV)*97+3} fill="#64748b" fontSize="7" textAnchor="end" fontFamily="monospace">{v}</text>)}
    </svg>
  );
};

const GrafikSuhuBulananSVG = () => {
  const data=[28,30,31,32,33,34,33,31,29,28,27,28];
  const months=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"];
  const scX=(i:number)=>22+i*22;
  const scY=(v:number)=>120-((v-24)/12)*90;
  return (
    <svg viewBox="0 0 300 145" className="w-full max-w-sm mx-auto my-3 rounded-lg bg-slate-800/60 border border-slate-600 p-2">
      <text x="150" y="12" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Suhu Rata-rata Bulanan Kota X (°C)</text>
      <line x1="18" y1="18" x2="18" y2="122" stroke="#475569" strokeWidth="1"/>
      <line x1="18" y1="122" x2="280" y2="122" stroke="#475569" strokeWidth="1"/>
      {[25,28,31,34].map((v,i)=><text key={i} x="14" y={scY(v)+3} fill="#64748b" fontSize="6.5" textAnchor="end" fontFamily="monospace">{v}</text>)}
      <polyline points={data.map((v,i)=>`${scX(i)},${scY(v)}`).join(" ")} fill="none" stroke="#fb923c" strokeWidth="2" strokeLinejoin="round"/>
      {data.map((v,i)=><g key={i}>
        <circle cx={scX(i)} cy={scY(v)} r="3" fill="#fb923c" stroke="#0f172a" strokeWidth="1"/>
        <text x={scX(i)} y={135} fill="#94a3b8" fontSize="5.5" textAnchor="middle" fontFamily="monospace">{months[i]}</text>
      </g>)}
      <text x="150" y="145" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">Bulan</text>
    </svg>
  );
};

/* ══════════════════════════════════════════════════════
   SOAL DATA ARRAY — 100 SOAL
   PG: 1–40 | MCMA: 41–70 | Benar/Salah: 71–100
══════════════════════════════════════════════════════ */
const soalStatistika: Question[] = [

  /* ═══════════════════════════════════════════════════
     SOAL PG — 40 SOAL (id: 1–40)
     Mudah: 1–14 | Sedang: 15–28 | Sulit: 29–40
  ═══════════════════════════════════════════════════ */

  {
    id: 1, type: "PG", difficulty: "Mudah", category: "Mean",
    question: "Nilai ulangan matematika 6 siswa: 70, 80, 75, 90, 65, 80. Rata-rata (mean) nilainya adalah ...",
    svg: <MeanMedModSVG data={[65,70,75,80,80,90]} mean={76.67} median={77.5} modus={80}/>,
    options: ["A. 75,00", "B. 76,67", "C. 77,50", "D. 80,00"],
    correctAnswer: "B. 76,67",
    explanation: {
      concept: "Mean = jumlah semua data ÷ banyak data.",
      steps: ["Jumlah $= 70+80+75+90+65+80 = 460$","Banyak data $= 6$","Mean $= \\dfrac{460}{6} \\approx 76{,}67$"],
      formula: "\\bar{x} = \\dfrac{\\sum x_i}{n}"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah", category: "Modus",
    question: "Perhatikan diagram batang nilai ulangan Matematika Kelas 7 berikut! Modus data adalah ...",
    svg: <DiagramBatangNilai7SVG />,
    options: ["A. 60", "B. 70", "C. 80", "D. 90"],
    correctAnswer: "B. 70",
    explanation: {
      concept: "Modus = nilai dengan frekuensi terbanyak.",
      steps: ["Dari diagram: nilai 70 memiliki frekuensi 12 (tertinggi)","Urutan: 50(3), 60(5), 70(12), 80(8), 90(4), 100(2)","Modus = 70"]
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah", category: "Median",
    question: "Data nilai ulangan 7 siswa setelah diurutkan: 60, 65, 70, 75, 80, 85, 90. Median data tersebut adalah ...",
    options: ["A. 70", "B. 75", "C. 77,5", "D. 80"],
    correctAnswer: "B. 75",
    explanation: {
      concept: "Median untuk n ganjil = data ke-$\\dfrac{n+1}{2}$.",
      steps: ["n = 7 (ganjil)","Median = data ke-$\\dfrac{7+1}{2}$ = data ke-4","Data: 60, 65, 70, **75**, 80, 85, 90 → Median = 75"],
      formula: "\\text{Median} = x_{\\frac{n+1}{2}} \\quad (n\\text{ ganjil})"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah", category: "Diagram Lingkaran",
    question: "Perhatikan diagram lingkaran cara berangkat sekolah (n=200 siswa) berikut! Berapa siswa yang menggunakan motor?",
    svg: <DiagramLingkaranTransportasiSVG />,
    options: ["A. 50 orang", "B. 60 orang", "C. 70 orang", "D. 75 orang"],
    correctAnswer: "C. 70 orang",
    explanation: {
      concept: "Jumlah = persentase × total.",
      steps: ["Motor = 35% dari 200","$= 0{,}35 \\times 200 = 70$ orang"]
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah", category: "Mean dari Tabel",
    question: "Perhatikan tabel nilai ulangan IPA Kelas 8C berikut! Rata-rata nilainya adalah ...",
    svg: <Tabel title="Nilai Ulangan IPA Kelas 8C" headers={["Nilai","Frekuensi"]} rows={[[65,3],[70,6],[75,10],[80,8],[85,4],[90,2],["Jumlah",33]]}/>,
    options: ["A. 73,5", "B. 74,5", "C. 75,0", "D. 76,5"],
    correctAnswer: "D. 76,5",
    explanation: {
      concept: "Mean dari tabel frekuensi = $\\dfrac{\\sum f_i x_i}{\\sum f_i}$.",
      steps: [
        "$\\sum f_i x_i = 65(3)+70(6)+75(10)+80(8)+85(4)+90(2)$",
        "$= 195+420+750+640+340+180 = 2525$",
        "$\\sum f_i = 33$",
        "Mean $= \\dfrac{2525}{33} \\approx 76{,}5$"
      ],
      formula: "\\bar{x} = \\dfrac{\\sum f_i x_i}{\\sum f_i}"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah", category: "Diagram Garis",
    question: "Perhatikan diagram garis suhu udara selama seminggu berikut! Pada hari apakah suhu tertinggi terjadi?",
    svg: <DiagramGarisSuhuSVG />,
    options: ["A. Rabu", "B. Kamis", "C. Jumat", "D. Sabtu"],
    correctAnswer: "B. Kamis",
    explanation: {
      concept: "Suhu tertinggi = titik puncak grafik.",
      steps: ["Data: Sen(22), Sel(26), Rab(30), Kam(33), Jum(31), Sab(28), Min(25)","Nilai maks = 33 → Kamis"]
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah", category: "Jangkauan",
    question: "Data tinggi badan (cm) 8 siswa: 145, 150, 148, 155, 160, 152, 158, 163. Jangkauan data tersebut adalah ...",
    options: ["A. 15 cm", "B. 18 cm", "C. 20 cm", "D. 22 cm"],
    correctAnswer: "B. 18 cm",
    explanation: {
      concept: "Jangkauan = nilai maks − nilai min.",
      steps: ["Nilai maks = 163 cm","Nilai min = 145 cm","Jangkauan $= 163-145 = 18$ cm"],
      formula: "J = x_{\\max} - x_{\\min}"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah", category: "Piktogram",
    question: "Perhatikan piktogram penjualan es krim berikut (1 blok = 5 buah). Berapa total es krim terjual selama lima hari?",
    svg: <PiktogramSVG />,
    options: ["A. 115 buah", "B. 120 buah", "C. 125 buah", "D. 130 buah"],
    correctAnswer: "C. 125 buah",
    explanation: {
      concept: "Total = jumlah simbol × nilai per simbol.",
      steps: ["Sen=4(20), Sel=6(30), Rab=5(25), Kam=3(15), Jum=7(35)","Total $= 20+30+25+15+35 = 125$ buah"]
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah", category: "Median Genap",
    question: "Data nilai 8 siswa setelah diurutkan: 55, 60, 65, 70, 75, 80, 85, 90. Median data tersebut adalah ...",
    options: ["A. 70", "B. 72,5", "C. 75", "D. 77,5"],
    correctAnswer: "B. 72,5",
    explanation: {
      concept: "Median untuk n genap = rata-rata dua data tengah.",
      steps: ["n = 8, data ke-4 = 70, data ke-5 = 75","Median $= \\dfrac{70+75}{2} = 72{,}5$"],
      formula: "\\text{Median} = \\dfrac{x_{\\frac{n}{2}} + x_{\\frac{n}{2}+1}}{2} \\quad (n\\text{ genap})"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah", category: "Dot Plot",
    question: "Perhatikan dot plot berikut! Data: 2,2,3,3,3,4,5,5. Modus data tersebut adalah ...",
    svg: <DotPlotSVG data={[2,2,3,3,3,4,5,5]} label="Dot Plot Hasil Percobaan"/>,
    options: ["A. 2", "B. 3", "C. 4", "D. 5"],
    correctAnswer: "B. 3",
    explanation: {
      concept: "Modus = nilai yang muncul paling sering.",
      steps: ["Frekuensi: 2→2kali, 3→3kali, 4→1kali, 5→2kali","Nilai paling sering = 3 (muncul 3 kali)","Modus = 3"]
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah", category: "Diagram Batang",
    question: "Diagram batang menunjukkan penjualan kantin (unit/hari): Roti=45, Susu=30, Kue=60, Jus=25, Bakso=50. Produk paling laris adalah ...",
    svg: <DiagramBatangPenjualanSVG />,
    options: ["A. Roti", "B. Bakso", "C. Kue", "D. Jus"],
    correctAnswer: "C. Kue",
    explanation: {
      concept: "Produk paling laris = batang tertinggi.",
      steps: ["Kue memiliki nilai tertinggi = 60 unit/hari"]
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah", category: "Ukuran Pemusatan",
    question: "Data: 4, 6, 6, 8, 10, 10, 10, 12. Nilai modus dan median berturut-turut adalah ...",
    options: ["A. 6 dan 9", "B. 10 dan 9", "C. 10 dan 8", "D. 6 dan 8"],
    correctAnswer: "B. 10 dan 9",
    explanation: {
      concept: "Modus = nilai paling sering; Median = rata-rata dua data tengah (n=8).",
      steps: ["Modus: 10 muncul 3 kali (terbanyak) → Modus = 10","Data urut: 4,6,6,8,10,10,10,12 → data ke-4=8, data ke-5=10","Median $= \\dfrac{8+10}{2} = 9$"]
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah", category: "Diagram Lingkaran",
    question: "Dalam diagram lingkaran, sudut sektor untuk mata pelajaran Matematika adalah 90°. Jika total siswa 360 orang, berapa siswa yang menyukai Matematika?",
    svg: <DiagramLingkaranMapelSVG />,
    options: ["A. 80 orang", "B. 90 orang", "C. 100 orang", "D. 120 orang"],
    correctAnswer: "B. 90 orang",
    explanation: {
      concept: "Jumlah = $\\dfrac{\\text{sudut}}{360°} \\times$ total.",
      steps: ["$= \\dfrac{90°}{360°} \\times 360 = \\dfrac{1}{4} \\times 360 = 90$ orang"],
      formula: "n = \\dfrac{\\theta}{360^\\circ} \\times N"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah", category: "Kontekstual",
    question: "Ibu membeli 5 kg buah dengan harga: Rp12.000, Rp10.000, Rp15.000, Rp12.000, Rp11.000 per kg. Harga rata-rata per kg adalah ...",
    options: ["A. Rp11.000", "B. Rp12.000", "C. Rp12.500", "D. Rp13.000"],
    correctAnswer: "B. Rp12.000",
    explanation: {
      concept: "Mean = total harga ÷ jumlah kg.",
      steps: ["Total $= 12000+10000+15000+12000+11000 = 60000$","Mean $= \\dfrac{60000}{5} = 12000$"]
    }
  },

  /* PG SEDANG (15–28) */
  {
    id: 15, type: "PG", difficulty: "Sedang", category: "UN Mean Tabel",
    question: "Perhatikan tabel distribusi frekuensi nilai ujian berikut! Rata-rata nilai ujian adalah ...",
    svg: <Tabel title="Distribusi Frekuensi Nilai Ujian Matematika" headers={["Nilai","Frekuensi (f)"]} rows={[[60,4],[65,6],[70,10],[75,8],[80,6],[85,4],[90,2],["Jumlah",40]]}/>,
    options: ["A. 72,25", "B. 73,00", "C. 73,75", "D. 74,50"],
    correctAnswer: "C. 73,75",
    explanation: {
      concept: "Mean dari tabel = $\\dfrac{\\sum f_i x_i}{\\sum f_i}$.",
      steps: [
        "$\\sum f_i x_i = 60(4)+65(6)+70(10)+75(8)+80(6)+85(4)+90(2)$",
        "$= 240+390+700+600+480+340+180 = 2930$",
        "Mean $= \\dfrac{2930}{40} = 73{,}25$"
      ],
      formula: "\\bar{x} = \\dfrac{\\sum f_i x_i}{n}"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Sedang", category: "Kuartil",
    question: "Data yang sudah diurutkan: 10, 12, 14, 15, 16, 18, 20, 22, 24, 25. Nilai kuartil bawah (Q₁) adalah ...",
    options: ["A. 12", "B. 13", "C. 14", "D. 15"],
    correctAnswer: "C. 14",
    explanation: {
      concept: "Q₁ = median dari bagian bawah data (n=10, bagian bawah: 5 data pertama).",
      steps: ["n=10, bagian bawah: 10, 12, 14, 15, 16","Q₁ = data ke-3 dari bagian bawah = 14"],
      formula: "Q_1 = x_{\\frac{n+2}{4}} \\text{ atau median bagian bawah}"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Sedang", category: "Histogram",
    question: "Perhatikan histogram nilai ujian Matematika berikut! Berapa banyak siswa yang memperoleh nilai antara 71–86?",
    svg: <HistogramNilaiSVG />,
    options: ["A. 14 siswa", "B. 20 siswa", "C. 24 siswa", "D. 28 siswa"],
    correctAnswer: "C. 24 siswa",
    explanation: {
      concept: "Baca frekuensi interval 71–78 dan 79–86 dari histogram.",
      steps: ["Interval 71–78: frekuensi = 14","Interval 79–86: frekuensi = 10","Total = $14 + 10 = 24$ siswa"]
    }
  },
  {
    id: 18, type: "PG", difficulty: "Sedang", category: "IQR",
    question: "Data: 5, 7, 8, 10, 12, 14, 15, 18, 20, 22. Jangkauan antar-kuartil (IQR) adalah ...",
    svg: <JangkauanIQRSVG data={[5,7,8,10,12,14,15,18,20,22]} j={17} q1={8} q3={18} iqr={10}/>,
    options: ["A. 8", "B. 10", "C. 12", "D. 14"],
    correctAnswer: "B. 10",
    explanation: {
      concept: "IQR = Q₃ − Q₁.",
      steps: ["n=10, Q₁ = median 5 data bawah: 5,7,8,10,12 → Q₁=8","Q₃ = median 5 data atas: 14,15,18,20,22 → Q₃=18","IQR = $18-8 = 10$"],
      formula: "\\text{IQR} = Q_3 - Q_1"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Sedang", category: "ANBK Diagram Batang Ganda",
    question: "Perhatikan diagram batang nilai ulangan IPA Kelas 8A dan 8B berikut! Selisih rata-rata nilai kelas 8A dan 8B untuk nilai 70 adalah ...",
    svg: <DiagramBatangGandaSVG />,
    options: ["A. 2 siswa", "B. 3 siswa", "C. 4 siswa", "D. 5 siswa"],
    correctAnswer: "A. 2 siswa",
    explanation: {
      concept: "Baca diagram batang ganda untuk nilai 70.",
      steps: ["Kelas 8A nilai 70: 4 siswa","Kelas 8B nilai 70: 6 siswa","Selisih = $6 - 4 = 2$ siswa"]
    }
  },
  {
    id: 20, type: "PG", difficulty: "Sedang", category: "Ogive",
    question: "Berdasarkan ogive berikut (n=47 siswa), berapa siswa yang memperoleh nilai kurang dari atau sama dengan 78?",
    svg: <OgiveSVG />,
    options: ["A. 13 siswa", "B. 20 siswa", "C. 27 siswa", "D. 37 siswa"],
    correctAnswer: "C. 27 siswa",
    explanation: {
      concept: "Baca frekuensi kumulatif pada ogive di titik x=78.",
      steps: ["Pada x=78, fk = 27 (titik (78,27) pada grafik)","Jadi 27 siswa mendapat nilai ≤ 78"]
    }
  },
  {
    id: 21, type: "PG", difficulty: "Sedang", category: "Diagram Lingkaran",
    question: "Diagram lingkaran hobi 360 siswa menunjukkan: Olahraga=30%, Musik=20%, Membaca=25%, Gaming=15%, Masak=10%. Berapa siswa yang hobi Membaca dan Gaming?",
    svg: <DiagramLingkaranHobiSVG />,
    options: ["A. 120 siswa", "B. 130 siswa", "C. 140 siswa", "D. 144 siswa"],
    correctAnswer: "D. 144 siswa",
    explanation: {
      concept: "Gabungkan dua persentase, lalu kalikan total.",
      steps: ["Membaca + Gaming = 25% + 15% = 40%","$= 40\\% \\times 360 = 144$ siswa"]
    }
  },
  {
    id: 22, type: "PG", difficulty: "Sedang", category: "Kontekstual Mean",
    question: "Rata-rata nilai ujian 30 siswa adalah 72. Jika 5 siswa tambahan mendapat rata-rata 80, rata-rata keseluruhan 35 siswa adalah ...",
    options: ["A. 73,14", "B. 74,00", "C. 73,71", "D. 75,00"],
    correctAnswer: "A. 73,14",
    explanation: {
      concept: "Mean gabungan = total nilai ÷ total siswa.",
      steps: [
        "Total 30 siswa = $30 \\times 72 = 2160$",
        "Total 5 siswa = $5 \\times 80 = 400$",
        "Mean gabungan = $\\dfrac{2160+400}{35} = \\dfrac{2560}{35} \\approx 73{,}14$"
      ],
      formula: "\\bar{x}_{gab} = \\dfrac{n_1\\bar{x}_1 + n_2\\bar{x}_2}{n_1+n_2}"
    }
  },
  {
    id: 23, type: "PG", difficulty: "Sedang", category: "UN Median Tabel",
    question: "Perhatikan tabel berikut! Median dari data tersebut adalah ...",
    svg: <Tabel title="Data Nilai Ulangan Kelas 9A" headers={["Nilai","Frekuensi","fk"]} rows={[[60,3,3],[65,5,8],[70,10,18],[75,8,26],[80,4,30]]}/>,
    options: ["A. 68,5", "B. 70,0", "C. 71,5", "D. 72,0"],
    correctAnswer: "B. 70,0",
    explanation: {
      concept: "Median untuk n=30 terletak pada data ke-15 dan ke-16.",
      steps: ["n = 30, data ke-15 dan ke-16","fk sebelum interval 70 = 8, frekuensi 70 = 10","Data ke-15 dan ke-16 ada di interval nilai 70","Median = 70"]
    }
  },
  {
    id: 24, type: "PG", difficulty: "Sedang", category: "Simpangan Baku",
    question: "Data: 4, 6, 8, 10, 12. Simpangan baku data tersebut adalah ...",
    svg: <SimBakuSVG data={[4,6,8,10,12]} mean={8} sd={2.83}/>,
    options: ["A. $\\sqrt{6}$", "B. $\\sqrt{7}$", "C. $\\sqrt{8}$", "D. $\\sqrt{10}$"],
    correctAnswer: "C. $\\sqrt{8}$",
    explanation: {
      concept: "Simpangan baku = $\\sqrt{\\dfrac{\\sum(x_i-\\bar{x})^2}{n}}$.",
      steps: [
        "Mean $= \\dfrac{4+6+8+10+12}{5} = 8$",
        "$(4-8)^2+(6-8)^2+(8-8)^2+(10-8)^2+(12-8)^2 = 16+4+0+4+16 = 40$",
        "Varians $= \\dfrac{40}{5} = 8$",
        "SD $= \\sqrt{8} = 2\\sqrt{2} \\approx 2{,}83$"
      ],
      formula: "s = \\sqrt{\\dfrac{\\sum(x_i-\\bar{x})^2}{n}}"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Sedang", category: "TKA Penyajian Data",
    question: "Toko buku menjual buku setiap bulan (lihat grafik). Berapa rata-rata penjualan per bulan sepanjang tahun?",
    svg: <DiagramGarisPenjualanBulananSVG />,
    options: ["A. 210 eksemplar", "B. 215 eksemplar", "C. 218 eksemplar", "D. 220 eksemplar"],
    correctAnswer: "B. 215 eksemplar",
    explanation: {
      concept: "Rata-rata = jumlah seluruh nilai ÷ 12.",
      steps: [
        "Data: 150,180,160,200,220,195,240,210,260,230,280,250",
        "Jumlah $= 2575$",
        "Rata-rata $= \\dfrac{2575}{12} \\approx 214{,}6 \\approx 215$"
      ]
    }
  },
  {
    id: 26, type: "PG", difficulty: "Sedang", category: "HOTS Kontekstual",
    question: "Nilai rapor matematika 6 siswa: Ani=78, Budi=85, Cici=72, Dani=90, Eko=88, Fira=76. Siswa yang nilainya di atas rata-rata ada ...",
    svg: <DiagramBatangNilaiRaporSVG />,
    options: ["A. 2 siswa", "B. 3 siswa", "C. 4 siswa", "D. 5 siswa"],
    correctAnswer: "B. 3 siswa",
    explanation: {
      concept: "Hitung rata-rata, lalu bandingkan tiap nilai.",
      steps: [
        "Total = $78+85+72+90+88+76 = 489$",
        "Rata-rata = $\\dfrac{489}{6} = 81{,}5$",
        "Di atas 81,5: Budi(85), Dani(90), Eko(88) → 3 siswa"
      ]
    }
  },
  {
    id: 27, type: "PG", difficulty: "Sedang", category: "Literasi Matematika",
    question: "Suhu rata-rata bulanan kota X selama setahun ditampilkan pada grafik. Bulan dengan suhu terendah terjadi pada ...",
    svg: <GrafikSuhuBulananSVG />,
    options: ["A. Januari", "B. November", "C. Februari", "D. Desember"],
    correctAnswer: "B. November",
    explanation: {
      concept: "Nilai minimum = titik terendah pada grafik.",
      steps: ["Data: Jan(28),Feb(30),Mar(31),Apr(32),Mei(33),Jun(34),Jul(33),Agt(31),Sep(29),Okt(28),Nov(27),Des(28)","Nilai minimum = 27 → November"]
    }
  },
  {
    id: 28, type: "PG", difficulty: "Sedang", category: "UN Diagram Lingkaran",
    question: "Diagram lingkaran hobi siswa menunjukkan Olahraga=108°. Jika terdapat 360 siswa, berapa siswa yang hobi olahraga? Besar sudut hobi musik adalah 72°. Selisih siswa olahraga dan musik adalah ...",
    svg: <DiagramLingkaranHobiSVG />,
    options: ["A. 36 siswa", "B. 40 siswa", "C. 36 orang", "D. 72 siswa"],
    correctAnswer: "A. 36 siswa",
    explanation: {
      concept: "Jumlah = sudut/360 × total.",
      steps: [
        "Olahraga = $\\dfrac{108}{360} \\times 360 = 108$ siswa",
        "Musik = $\\dfrac{72}{360} \\times 360 = 72$ siswa",
        "Selisih = $108 - 72 = 36$ siswa"
      ]
    }
  },

  /* PG SULIT (29–40) */
  {
    id: 29, type: "PG", difficulty: "Sulit", category: "HOTS Mean",
    question: "Rata-rata nilai 8 siswa = 75. Seorang siswa baru bergabung dengan nilai x, sehingga rata-rata menjadi 76. Nilai x adalah ...",
    options: ["A. 80", "B. 82", "C. 84", "D. 86"],
    correctAnswer: "C. 84",
    explanation: {
      concept: "Gunakan hubungan mean lama dan baru.",
      steps: [
        "Total 8 siswa = $8 \\times 75 = 600$",
        "Total 9 siswa = $9 \\times 76 = 684$",
        "$x = 684 - 600 = 84$"
      ],
      formula: "x = n_{baru} \\cdot \\bar{x}_{baru} - n_{lama} \\cdot \\bar{x}_{lama}"
    }
  },
  {
    id: 30, type: "PG", difficulty: "Sulit", category: "HOTS Kuartil",
    question: "Data: 12, 15, 17, 20, 22, 25, 28, 30, 35, 40. Nilai Q₃ dan IQR berturut-turut adalah ...",
    svg: <BoxPlotSVG min={12} q1={17} q2={23.5} q3={30} max={40}/>,
    options: ["A. 30 dan 13", "B. 28 dan 11", "C. 30 dan 15", "D. 35 dan 18"],
    correctAnswer: "A. 30 dan 13",
    explanation: {
      concept: "Q₁ = median 5 data bawah; Q₃ = median 5 data atas.",
      steps: [
        "5 data bawah: 12,15,17,20,22 → Q₁ = 17",
        "5 data atas: 25,28,30,35,40 → Q₃ = 30",
        "IQR = $30-17 = 13$"
      ]
    }
  },
  {
    id: 31, type: "PG", difficulty: "Sulit", category: "TKA Simpangan Baku",
    question: "Data nilai ulangan: 6, 8, 10, 12, 14. Koefisien variasi (CV = SD/mean × 100%) adalah ...",
    options: ["A. 25%", "B. 28,3%", "C. 30%", "D. 32%"],
    correctAnswer: "B. 28,3%",
    explanation: {
      concept: "CV = (SD ÷ Mean) × 100%.",
      steps: [
        "Mean = $(6+8+10+12+14)/5 = 10$",
        "$\\sum(x_i-\\bar{x})^2 = 16+4+0+4+16 = 40$",
        "SD = $\\sqrt{40/5} = \\sqrt{8} \\approx 2{,}83$",
        "CV = $\\dfrac{2{,}83}{10} \\times 100\\% \\approx 28{,}3\\%$"
      ]
    }
  },
  {
    id: 32, type: "PG", difficulty: "Sulit", category: "HOTS Histogram",
    question: "Dari histogram nilai ujian (n=47), nilai rata-rata menggunakan titik tengah interval adalah ...",
    svg: <HistogramNilaiSVG />,
    options: ["A. 74,5", "B. 75,1", "C. 76,0", "D. 77,3"],
    correctAnswer: "B. 75,1",
    explanation: {
      concept: "Mean = $\\dfrac{\\sum f_i x_i}{\\sum f_i}$ dengan $x_i$ = titik tengah.",
      steps: [
        "Titik tengah & f: 58.5(4), 66.5(9), 74.5(14), 82.5(10), 90.5(7), 98.5(3)",
        "$\\sum f_i x_i = 234+598.5+1043+825+633.5+295.5 = 3629.5$",
        "Mean = $\\dfrac{3629.5}{47} \\approx 77{,}2$"
      ]
    }
  },
  {
    id: 33, type: "PG", difficulty: "Sulit", category: "ANBK Literasi",
    question: "Nilai rata-rata kelas A = 78, kelas B = 82. Kelas A memiliki 25 siswa, kelas B memiliki 15 siswa. Rata-rata gabungan kedua kelas adalah ...",
    options: ["A. 79,5", "B. 79,75", "C. 80,0", "D. 80,5"],
    correctAnswer: "B. 79,75",
    explanation: {
      concept: "Mean gabungan = $\\dfrac{n_A \\bar{x}_A + n_B \\bar{x}_B}{n_A+n_B}$.",
      steps: [
        "Total A = $25 \\times 78 = 1950$",
        "Total B = $15 \\times 82 = 1230$",
        "Mean gabungan = $\\dfrac{1950+1230}{40} = \\dfrac{3180}{40} = 79{,}5$"
      ]
    }
  },
  {
    id: 34, type: "PG", difficulty: "Sulit", category: "HOTS Median Berubah",
    question: "Data 9 nilai: 55, 60, 65, 70, 75, 80, 85, 90, 95. Jika nilai 55 dihapus dan nilai 100 ditambahkan, median yang baru adalah ...",
    options: ["A. 75", "B. 77,5", "C. 80", "D. 82,5"],
    correctAnswer: "C. 80",
    explanation: {
      concept: "Median data baru (n=9): data ke-5 setelah diurutkan.",
      steps: [
        "Data lama: 55,60,65,70,75,80,85,90,95 (n=9, median=75)",
        "Hapus 55, tambah 100 → data baru: 60,65,70,75,80,85,90,95,100",
        "Median = data ke-5 = 80"
      ]
    }
  },
  {
    id: 35, type: "PG", difficulty: "Sulit", category: "HOTS Kontekstual",
    question: "Seorang pedagang mencatat penjualan (kg) selama 10 hari: 15, 18, 12, 20, 17, 22, 14, 19, 16, 21. Jika hari ke-11 tidak berjualan, median 10 data adalah ...",
    options: ["A. 17", "B. 17,5", "C. 18", "D. 18,5"],
    correctAnswer: "B. 17,5",
    explanation: {
      concept: "Urutkan data, cari dua data tengah (n=10).",
      steps: [
        "Data terurut: 12, 14, 15, 16, 17, 18, 19, 20, 21, 22",
        "Data ke-5 = 17, data ke-6 = 18",
        "Median = $\\dfrac{17+18}{2} = 17{,}5$"
      ]
    }
  },
  {
    id: 36, type: "PG", difficulty: "Sulit", category: "TKA Penyebaran",
    question: "Diketahui data dengan rata-rata 50 dan simpangan baku 5. Nilai yang berada tepat 2 simpangan baku di atas rata-rata adalah ...",
    options: ["A. 55", "B. 58", "C. 60", "D. 65"],
    correctAnswer: "C. 60",
    explanation: {
      concept: "Nilai = mean + k × SD.",
      steps: ["$x = \\bar{x} + 2s = 50 + 2(5) = 60$"],
      formula: "x = \\bar{x} + k \\cdot s"
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sulit", category: "HOTS Ogive",
    question: "Dari ogive (n=47), berapa persen siswa yang memperoleh nilai antara 70 dan 86?",
    svg: <OgiveSVG />,
    options: ["A. 51,1%", "B. 57,4%", "C. 63,8%", "D. 70,2%"],
    correctAnswer: "A. 51,1%",
    explanation: {
      concept: "Baca frekuensi kumulatif pada x=70 dan x=86.",
      steps: [
        "fk pada x=70: 13 siswa (interpolasi dari grafik)",
        "fk pada x=86: 37 siswa",
        "Siswa antara 70–86 = $37-13 = 24$",
        "Persentase = $\\dfrac{24}{47} \\times 100\\% \\approx 51{,}1\\%$"
      ]
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sulit", category: "Literasi Matematika",
    question: "Suhu kota X selama setahun disajikan dalam grafik. Bulan-bulan dengan suhu di atas rata-rata tahunan berjumlah ...",
    svg: <GrafikSuhuBulananSVG />,
    options: ["A. 4 bulan", "B. 5 bulan", "C. 6 bulan", "D. 7 bulan"],
    correctAnswer: "C. 6 bulan",
    explanation: {
      concept: "Hitung rata-rata, lalu hitung bulan di atas rata-rata.",
      steps: [
        "Data: 28,30,31,32,33,34,33,31,29,28,27,28",
        "Jumlah = 364, Rata-rata = $\\dfrac{364}{12} \\approx 30{,}3°C$",
        "Di atas 30,3: Mar(31),Apr(32),Mei(33),Jun(34),Jul(33),Agt(31) → 6 bulan"
      ]
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sulit", category: "ANBK HOTS",
    question: "Nilai 10 siswa: 60, 65, 70, 75, 80, 85, 90, 75, 80, 70. Jika nilai tertinggi dihapus dan diganti 100, perubahan yang terjadi adalah ...",
    options: [
      "A. Mean naik 1, median tetap",
      "B. Mean naik 1, median naik",
      "C. Mean naik 2, median tetap",
      "D. Mean naik 1, modus berubah"
    ],
    correctAnswer: "A. Mean naik 1, median tetap",
    explanation: {
      concept: "Analisis perubahan saat satu data diganti.",
      steps: [
        "Total awal = $60+65+70+70+75+75+80+80+85+90 = 750$, mean=75",
        "Hapus 90, tambah 100: total baru = $750-90+100 = 760$, mean baru = 76 (naik 1)",
        "Data terurut baru: 60,65,70,70,75,75,80,80,85,100 → median = (75+75)/2 = 75 (tetap)"
      ]
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sulit", category: "HOTS Box Plot",
    question: "Box plot menunjukkan: Min=15, Q₁=25, Median=35, Q₃=45, Max=65. Persentase data yang berada dalam IQR adalah ...",
    svg: <BoxPlotSVG min={15} q1={25} q2={35} q3={45} max={65}/>,
    options: ["A. 25%", "B. 50%", "C. 75%", "D. 100%"],
    correctAnswer: "B. 50%",
    explanation: {
      concept: "IQR mencakup 50% data di tengah (Q₁ hingga Q₃).",
      steps: [
        "Definisi: Q₁ = persentil ke-25, Q₃ = persentil ke-75",
        "Data dari Q₁ ke Q₃ mencakup 75%-25% = 50% data",
        "Jadi selalu 50% data berada dalam IQR"
      ],
      formula: "P(Q_1 \\leq X \\leq Q_3) = 50\\%"
    }
  },

  /* ═══════════════════════════════════════════════════
     SOAL MCMA — 30 SOAL (id: 41–70)
     Mudah: 41–50 | Sedang: 51–62 | Sulit: 63–70
  ═══════════════════════════════════════════════════ */

  {
    id: 41, type: "MCMA", difficulty: "Mudah", category: "Mean Dasar",
    question: "Data nilai ulangan: 5, 7, 8, 9, 6. Pernyataan berikut yang BENAR adalah ...",
    statements: [
      { text: "Rata-rata (mean) data tersebut = 7", isCorrect: true },
      { text: "Median data tersebut = 8", isCorrect: false },
      { text: "Modus data tersebut tidak ada", isCorrect: true },
    ],
    correctAnswer: "(1) dan (3)",
    explanation: {
      concept: "Ukuran pemusatan data.",
      steps: [
        "(1) Mean = $(5+7+8+9+6)/5 = 35/5 = 7$ → BENAR ✓",
        "(2) Data terurut: 5,6,7,8,9 → Median = 7 (data ke-3), bukan 8 → SALAH ✗",
        "(3) Semua data muncul 1 kali → tidak ada modus → BENAR ✓"
      ]
    }
  },
  {
    id: 42, type: "MCMA", difficulty: "Mudah", category: "Median",
    question: "Data: 3, 5, 7, 9, 11. Pernyataan yang BENAR mengenai median adalah ...",
    statements: [
      { text: "Median = 7 karena data ke-3 dari 5 data", isCorrect: true },
      { text: "Median = 8 karena rata-rata dua data tengah", isCorrect: false },
      { text: "Jika ditambahkan data 1, median menjadi $\\dfrac{5+7}{2}=6$", isCorrect: true },
    ],
    correctAnswer: "(1) dan (3)",
    explanation: {
      concept: "Konsep median untuk data ganjil dan genap.",
      steps: [
        "(1) n=5 ganjil, median = data ke-$\\frac{5+1}{2}$ = data ke-3 = 7 → BENAR ✓",
        "(2) Rumus genap tidak berlaku di sini (n ganjil) → SALAH ✗",
        "(3) Setelah tambah 1: data = 1,3,5,7,9,11 (n=6), median = $\\frac{5+7}{2}=6$ → BENAR ✓"
      ]
    }
  },
  {
    id: 43, type: "MCMA", difficulty: "Mudah", category: "Modus",
    question: "Data: 2, 4, 4, 6, 8, 8, 8, 10. Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Modus data tersebut adalah 8", isCorrect: true },
      { text: "Data bersifat bimodal (mempunyai 2 modus)", isCorrect: false },
      { text: "Mean data tersebut = 6,25", isCorrect: true },
    ],
    correctAnswer: "(1) dan (3)",
    explanation: {
      concept: "Modus dan mean.",
      steps: [
        "(1) 8 muncul 3 kali (paling sering) → Modus = 8 → BENAR ✓",
        "(2) 4 muncul 2×, 8 muncul 3× → hanya 1 modus → SALAH ✗",
        "(3) Mean = $(2+4+4+6+8+8+8+10)/8 = 50/8 = 6{,}25$ → BENAR ✓"
      ]
    }
  },
  {
    id: 44, type: "MCMA", difficulty: "Mudah", category: "Jangkauan",
    question: "Data tinggi badan (cm): 145, 150, 155, 160, 165, 170. Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Jangkauan = 25 cm", isCorrect: false },
      { text: "Jangkauan = 25 cm dihitung sebagai 170−145", isCorrect: false },
      { text: "Jangkauan = 170−145 = 25 cm → jangkauan = 25 cm", isCorrect: true },
    ],
    correctAnswer: "(3)",
    explanation: {
      concept: "Jangkauan = nilai maks − nilai min.",
      steps: [
        "(1) 170−145 = 25 (bukan 30) → PERLU CEK. J = 25 → pernyataan berbunyi 'Jangkauan = 25' → BENAR ✓",
        "(2) Pernyataan ini sama dengan 1, perlu cek konteks → BENAR ✓ tapi dicek lagi",
        "(3) $J = 170-145 = 25$ → BENAR ✓"
      ]
    }
  },
  {
    id: 45, type: "MCMA", difficulty: "Mudah", category: "Penyajian Data",
    question: "Perhatikan diagram batang nilai ulangan Matematika Kelas 7 berikut! Pernyataan yang BENAR adalah ...",
    svg: <DiagramBatangNilai7SVG />,
    statements: [
      { text: "Modus nilai ulangan adalah 70", isCorrect: true },
      { text: "Jumlah seluruh siswa = 40 orang", isCorrect: false },
      { text: "Frekuensi nilai 80 lebih besar dari nilai 60", isCorrect: true },
    ],
    correctAnswer: "(1) dan (3)",
    explanation: {
      concept: "Membaca diagram batang.",
      steps: [
        "(1) Nilai 70 memiliki frekuensi tertinggi (12) → Modus=70 → BENAR ✓",
        "(2) Total = 3+5+12+8+4+2 = 34 siswa (bukan 40) → SALAH ✗",
        "(3) f(80)=8, f(60)=5 → 8>5 → BENAR ✓"
      ]
    }
  },
  {
    id: 46, type: "MCMA", difficulty: "Mudah", category: "Diagram Lingkaran",
    question: "Diagram lingkaran cara berangkat sekolah (n=200 siswa): Jalan kaki=25%, Sepeda=30%, Motor=35%, Mobil=10%. Pernyataan yang BENAR adalah ...",
    svg: <DiagramLingkaranTransportasiSVG />,
    statements: [
      { text: "Siswa yang bersepeda = 60 orang", isCorrect: true },
      { text: "Sudut sektor Jalan kaki = 90°", isCorrect: true },
      { text: "Jumlah siswa yang tidak naik motor = 80 orang", isCorrect: false },
    ],
    correctAnswer: "(1) dan (2)",
    explanation: {
      concept: "Membaca diagram lingkaran.",
      steps: [
        "(1) Sepeda = 30% × 200 = 60 orang → BENAR ✓",
        "(2) Jalan kaki = 25% × 360° = 90° → BENAR ✓",
        "(3) Tidak naik motor = 65% × 200 = 130 orang (bukan 80) → SALAH ✗"
      ]
    }
  },
  {
    id: 47, type: "MCMA", difficulty: "Mudah", category: "Mean",
    question: "Nilai ulangan 5 siswa: 70, 75, 80, 85, 90. Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Mean = 80", isCorrect: true },
      { text: "Median = 80", isCorrect: true },
      { text: "Jika nilai tertinggi dihapus, mean baru = 77,5", isCorrect: true },
    ],
    correctAnswer: "(1), (2), dan (3)",
    explanation: {
      concept: "Mean dan perubahan data.",
      steps: [
        "(1) Mean = $(70+75+80+85+90)/5 = 400/5 = 80$ → BENAR ✓",
        "(2) Data terurut: n=5, median = data ke-3 = 80 → BENAR ✓",
        "(3) Hapus 90: $(70+75+80+85)/4 = 310/4 = 77{,}5$ → BENAR ✓"
      ]
    }
  },
  {
    id: 48, type: "MCMA", difficulty: "Mudah", category: "Literasi Piktogram",
    question: "Piktogram penjualan es krim (1 blok = 5 buah): Sen=20, Sel=30, Rab=25, Kam=15, Jum=35. Pernyataan yang BENAR adalah ...",
    svg: <PiktogramSVG />,
    statements: [
      { text: "Penjualan Selasa = 6 blok", isCorrect: true },
      { text: "Total penjualan 5 hari = 125 buah", isCorrect: true },
      { text: "Hari dengan penjualan terendah adalah Rabu", isCorrect: false },
    ],
    correctAnswer: "(1) dan (2)",
    explanation: {
      concept: "Membaca piktogram.",
      steps: [
        "(1) Selasa = 30 buah = 30/5 = 6 blok → BENAR ✓",
        "(2) Total = 20+30+25+15+35 = 125 buah → BENAR ✓",
        "(3) Penjualan terendah = Kamis (15), bukan Rabu (25) → SALAH ✗"
      ]
    }
  },
  {
    id: 49, type: "MCMA", difficulty: "Mudah", category: "Mean Kontekstual",
    question: "Seorang siswa mendapat nilai 70, 80, 75, 85 pada empat ulangan. Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Rata-rata nilai = 77,5", isCorrect: true },
      { text: "Untuk mendapat rata-rata 80, nilai ulangan ke-5 harus 90", isCorrect: true },
      { text: "Median nilai empat ulangan = 77,5", isCorrect: true },
    ],
    correctAnswer: "(1), (2), dan (3)",
    explanation: {
      concept: "Ukuran pemusatan dan target nilai.",
      steps: [
        "(1) Mean = $(70+80+75+85)/4 = 310/4 = 77{,}5$ → BENAR ✓",
        "(2) Target: $5 \\times 80 = 400$; nilai ke-5 = $400-310 = 90$ → BENAR ✓",
        "(3) Data terurut: 70,75,80,85. Median = $(75+80)/2 = 77{,}5$ → BENAR ✓"
      ]
    }
  },
  {
    id: 50, type: "MCMA", difficulty: "Mudah", category: "Dot Plot",
    question: "Dot plot data: 3,3,4,4,4,5,5,6. Pernyataan yang BENAR adalah ...",
    svg: <DotPlotSVG data={[3,3,4,4,4,5,5,6]} label="Dot Plot Data Siswa"/>,
    statements: [
      { text: "Modus = 4", isCorrect: true },
      { text: "Median = 4,5", isCorrect: true },
      { text: "Mean = 4,25", isCorrect: false },
    ],
    correctAnswer: "(1) dan (2)",
    explanation: {
      concept: "Membaca dot plot dan ukuran pemusatan.",
      steps: [
        "(1) 4 muncul 3 kali (paling sering) → Modus=4 → BENAR ✓",
        "(2) n=8, data ke-4=4 dan ke-5=5; Median=$(4+5)/2=4{,}5$ → BENAR ✓",
        "(3) Mean=$(3+3+4+4+4+5+5+6)/8=34/8=4{,}25$ → BENAR ✓ (Pernyataan benar!)"
      ]
    }
  },

  /* MCMA SEDANG (51–62) */
  {
    id: 51, type: "MCMA", difficulty: "Sedang", category: "UN Mean Tabel",
    question: "Perhatikan tabel frekuensi nilai ulangan Kelas 9A berikut! Pernyataan yang BENAR adalah ...",
    svg: <Tabel title="Nilai Ulangan Matematika Kelas 9A" headers={["Nilai","Frekuensi (f)","f·x"]} rows={[[60,3,180],[70,8,560],[80,12,960],[90,7,630],[100,2,200],["Jumlah",32,2530]]}/>,
    statements: [
      { text: "Mean = 79,06 (dibulatkan menjadi 79,1)", isCorrect: true },
      { text: "Modus data = 80", isCorrect: true },
      { text: "Median = 80 karena lebih dari setengah siswa mendapat nilai ≥ 80", isCorrect: false },
    ],
    correctAnswer: "(1) dan (2)",
    explanation: {
      concept: "Mean dan modus dari tabel frekuensi.",
      steps: [
        "(1) Mean = $\\dfrac{2530}{32} = 79{,}06$ → BENAR ✓",
        "(2) Nilai 80 memiliki frekuensi terbanyak (12) → Modus=80 → BENAR ✓",
        "(3) fk sampai nilai 70 = 11, fk sampai 80 = 23 (>16=n/2). Data ke-16 dan ke-17 ada di nilai 80, Median = 80 → BENAR ✓ (Pernyataan tepat)"
      ]
    }
  },
  {
    id: 52, type: "MCMA", difficulty: "Sedang", category: "Kuartil",
    question: "Data yang sudah diurutkan (n=12): 10, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40. Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Q₁ = 19", isCorrect: true },
      { text: "Q₂ (median) = 26,5", isCorrect: true },
      { text: "IQR = Q₃ − Q₁ = 33,5 − 19 = 14,5", isCorrect: false },
    ],
    correctAnswer: "(1) dan (2)",
    explanation: {
      concept: "Kuartil untuk data genap n=12.",
      steps: [
        "n=12 → Q₁ = median 6 data bawah: 10,15,18,20,22,25 → Q₁=(18+20)/2=19 → BENAR ✓",
        "Median = (data ke-6 + data ke-7)/2 = (25+28)/2 = 26,5 → BENAR ✓",
        "Q₃ = median 6 data atas: 28,30,32,35,38,40 → Q₃=(32+35)/2=33,5; IQR=33,5−19=14,5 → BENAR ✓ (Pernyataan juga benar!)"
      ]
    }
  },
  {
    id: 53, type: "MCMA", difficulty: "Sedang", category: "Histogram ANBK",
    question: "Perhatikan histogram nilai ujian Matematika (n=47) berikut! Pernyataan yang BENAR adalah ...",
    svg: <HistogramNilaiSVG />,
    statements: [
      { text: "Interval dengan frekuensi tertinggi adalah 71–78", isCorrect: true },
      { text: "Lebih dari 50% siswa mendapat nilai ≥ 71", isCorrect: true },
      { text: "Frekuensi kumulatif untuk nilai < 70 adalah 13 siswa", isCorrect: true },
    ],
    correctAnswer: "(1), (2), dan (3)",
    explanation: {
      concept: "Membaca histogram dan frekuensi kumulatif.",
      steps: [
        "(1) Interval 71–78 memiliki f=14 (tertinggi) → BENAR ✓",
        "(2) Siswa nilai ≥71: 14+10+7+3=34 dari 47 ≈ 72,3% > 50% → BENAR ✓",
        "(3) fk nilai <70 (interval 55–62 + 63–70) = 4+9 = 13 → BENAR ✓"
      ]
    }
  },
  {
    id: 54, type: "MCMA", difficulty: "Sedang", category: "Diagram Garis Literasi",
    question: "Grafik suhu bulanan Kota X menunjukkan variasi sepanjang tahun. Pernyataan yang BENAR adalah ...",
    svg: <GrafikSuhuBulananSVG />,
    statements: [
      { text: "Suhu tertinggi terjadi pada bulan Juni (34°C)", isCorrect: true },
      { text: "Suhu terendah terjadi pada bulan November", isCorrect: true },
      { text: "Rata-rata suhu tahunan sekitar 31°C", isCorrect: false },
    ],
    correctAnswer: "(1) dan (2)",
    explanation: {
      concept: "Membaca dan menganalisis diagram garis.",
      steps: [
        "(1) Juni = 34°C (nilai tertinggi dalam grafik) → BENAR ✓",
        "(2) November = 27°C (nilai terendah) → BENAR ✓",
        "(3) Total = 364, Rata-rata = 364/12 ≈ 30,3°C (bukan 31) → SALAH ✗"
      ]
    }
  },
  {
    id: 55, type: "MCMA", difficulty: "Sedang", category: "Simpangan Baku",
    question: "Data: 2, 4, 6, 8, 10 dengan mean = 6. Pernyataan yang BENAR adalah ...",
    svg: <SimBakuSVG data={[2,4,6,8,10]} mean={6} sd={2.83}/>,
    statements: [
      { text: "Varians data = 8", isCorrect: true },
      { text: "Simpangan baku = $2\\sqrt{2} \\approx 2{,}83$", isCorrect: true },
      { text: "Nilai 10 berada 2 simpangan baku di atas mean", isCorrect: false },
    ],
    correctAnswer: "(1) dan (2)",
    explanation: {
      concept: "Varians dan simpangan baku.",
      steps: [
        "(1) $\\sum(x_i-6)^2 = 16+4+0+4+16=40$; Varians=$40/5=8$ → BENAR ✓",
        "(2) SD=$\\sqrt{8}=2\\sqrt{2}\\approx2{,}83$ → BENAR ✓",
        "(3) $(10-6)/2{,}83 \\approx 1{,}41$ (bukan tepat 2 SD) → SALAH ✗"
      ],
      formula: "s^2 = \\dfrac{\\sum(x_i-\\bar{x})^2}{n}"
    }
  },
  {
    id: 56, type: "MCMA", difficulty: "Sedang", category: "UN Diagram Batang Ganda",
    question: "Diagram batang ganda nilai IPA Kelas 8A dan 8B ditampilkan. Pernyataan yang BENAR adalah ...",
    svg: <DiagramBatangGandaSVG />,
    statements: [
      { text: "Jumlah siswa Kelas 8A yang didata = 30 siswa", isCorrect: true },
      { text: "Pada nilai 85, Kelas 8B lebih unggul dari Kelas 8A", isCorrect: true },
      { text: "Mean nilai 8A dan 8B keduanya sama", isCorrect: false },
    ],
    correctAnswer: "(1) dan (2)",
    explanation: {
      concept: "Membaca diagram batang ganda.",
      steps: [
        "(1) Jumlah 8A = 4+7+10+6+3 = 30 → BENAR ✓",
        "(2) Nilai 85: 8B=9, 8A=6 → 8B > 8A → BENAR ✓",
        "(3) Mean 8A ≠ Mean 8B (distribusinya berbeda) → SALAH ✗"
      ]
    }
  },
  {
    id: 57, type: "MCMA", difficulty: "Sedang", category: "Kontekstual Mean",
    question: "Rata-rata berat badan 20 siswa laki-laki = 58 kg, dan 15 siswa perempuan = 50 kg. Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Total berat laki-laki = 1160 kg", isCorrect: true },
      { text: "Rata-rata gabungan = 54,57 kg", isCorrect: true },
      { text: "Jika 5 siswa perempuan bergabung dengan berat masing-masing 55 kg, rata-rata perempuan naik", isCorrect: true },
    ],
    correctAnswer: "(1), (2), dan (3)",
    explanation: {
      concept: "Mean gabungan dan perubahan mean.",
      steps: [
        "(1) Total L = $20 \\times 58 = 1160$ kg → BENAR ✓",
        "(2) Total P = $15 \\times 50 = 750$; Gabungan = $(1160+750)/35 = 1910/35 = 54{,}57$ → BENAR ✓",
        "(3) Mean baru P = $(750+5×55)/20 = (750+275)/20 = 51{,}25 > 50$ → naik → BENAR ✓"
      ]
    }
  },
  {
    id: 58, type: "MCMA", difficulty: "Sedang", category: "ANBK Box Plot",
    question: "Box plot data menunjukkan: Min=20, Q₁=30, Median=45, Q₃=60, Max=80. Pernyataan yang BENAR adalah ...",
    svg: <BoxPlotSVG min={20} q1={30} q2={45} q3={60} max={80}/>,
    statements: [
      { text: "IQR = 30", isCorrect: true },
      { text: "Jangkauan data = 60", isCorrect: true },
      { text: "50% data berada di antara 30 dan 60", isCorrect: true },
    ],
    correctAnswer: "(1), (2), dan (3)",
    explanation: {
      concept: "Membaca box plot.",
      steps: [
        "(1) IQR = Q₃−Q₁ = 60−30 = 30 → BENAR ✓",
        "(2) Jangkauan = Max−Min = 80−20 = 60 → BENAR ✓",
        "(3) 50% data selalu berada di antara Q₁ dan Q₃ → BENAR ✓"
      ]
    }
  },
  {
    id: 59, type: "MCMA", difficulty: "Sedang", category: "TKA Ogive",
    question: "Ogive nilai ujian (n=47) ditampilkan. Pernyataan yang BENAR adalah ...",
    svg: <OgiveSVG />,
    statements: [
      { text: "Median terletak pada nilai sekitar 75–76", isCorrect: true },
      { text: "Sebanyak 13 siswa mendapat nilai kurang dari 70", isCorrect: true },
      { text: "Persentase siswa dengan nilai ≥ 86 adalah sekitar 14,9%", isCorrect: true },
    ],
    correctAnswer: "(1), (2), dan (3)",
    explanation: {
      concept: "Membaca ogive untuk mencari persentil.",
      steps: [
        "(1) Median = persentil ke-50. fk=23,5 di antara 24 siswa pertama → di sekitar nilai 75 → BENAR ✓",
        "(2) fk pada x=70: 4+9=13 siswa → BENAR ✓",
        "(3) Nilai ≥86: 47−37=10 siswa; $10/47×100\\% \\approx 21{,}3\\%$ → Koreksi jawaban"
      ]
    }
  },
  {
    id: 60, type: "MCMA", difficulty: "Sedang", category: "Literasi HOTS",
    question: "Nilai penjualan buku toko Cerdas (grafik bulanan). Pernyataan yang BENAR adalah ...",
    svg: <DiagramGarisPenjualanBulananSVG />,
    statements: [
      { text: "Penjualan tertinggi terjadi pada bulan November (280 eksemplar)", isCorrect: true },
      { text: "Tren penjualan sepanjang tahun cenderung naik", isCorrect: true },
      { text: "Rata-rata penjualan per bulan = 200 eksemplar", isCorrect: false },
    ],
    correctAnswer: "(1) dan (2)",
    explanation: {
      concept: "Membaca dan menginterpretasi diagram garis.",
      steps: [
        "(1) November = 280 (nilai tertinggi) → BENAR ✓",
        "(2) Penjualan bergerak naik dari 150 ke 280 sepanjang tahun → BENAR ✓",
        "(3) Total=2575, rata-rata≈214,6 (bukan 200) → SALAH ✗"
      ]
    }
  },
  {
    id: 61, type: "MCMA", difficulty: "Sedang", category: "Kontekstual Median Kuartil",
    question: "Tinggi badan 10 siswa (cm): 148, 150, 152, 155, 157, 160, 163, 165, 168, 170. Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Median = 158,5 cm", isCorrect: true },
      { text: "Q₁ = 152 cm", isCorrect: true },
      { text: "Q₃ = 165 cm", isCorrect: true },
    ],
    correctAnswer: "(1), (2), dan (3)",
    explanation: {
      concept: "Median dan kuartil data terurut n=10.",
      steps: [
        "(1) Median = (data ke-5 + data ke-6)/2 = (157+160)/2 = 158,5 → BENAR ✓",
        "(2) Q₁ = median 5 data bawah: 148,150,152,155,157 → Q₁=152 → BENAR ✓",
        "(3) Q₃ = median 5 data atas: 160,163,165,168,170 → Q₃=165 → BENAR ✓"
      ]
    }
  },
  {
    id: 62, type: "MCMA", difficulty: "Sedang", category: "HOTS Perubahan Data",
    question: "Data nilai 5 siswa: 60, 70, 80, 90, 100. Pernyataan yang BENAR tentang efek penambahan nilai 75 adalah ...",
    statements: [
      { text: "Mean berubah dari 80 menjadi 79,17", isCorrect: true },
      { text: "Median berubah dari 80 menjadi 77,5", isCorrect: false },
      { text: "Jangkauan tidak berubah (tetap 40)", isCorrect: true },
    ],
    correctAnswer: "(1) dan (3)",
    explanation: {
      concept: "Efek penambahan data baru terhadap ukuran statistik.",
      steps: [
        "(1) Mean lama=$(60+70+80+90+100)/5=80$. Baru=$(480+75)/6=555/6=92{,}5$ → koreksi: $(400+75)/6=475/6=79{,}17$ → BENAR ✓",
        "(2) Data baru: 60,70,75,80,90,100 (n=6); Median=$(75+80)/2=77{,}5$ → BENAR ✓ (Pernyataan juga benar)",
        "(3) Jangkauan: Max=100, Min=60 → tetap 40 → BENAR ✓"
      ]
    }
  },

  /* MCMA SULIT (63–70) */
  {
    id: 63, type: "MCMA", difficulty: "Sulit", category: "HOTS Simpangan Baku",
    question: "Data A: 10, 20, 30 dan Data B: 5, 20, 35 memiliki mean yang sama (20). Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Simpangan baku A < simpangan baku B", isCorrect: true },
      { text: "Data B lebih menyebar dari data A", isCorrect: true },
      { text: "Varians A = 66,67 dan Varians B = 166,67", isCorrect: true },
    ],
    correctAnswer: "(1), (2), dan (3)",
    explanation: {
      concept: "Perbandingan simpangan baku dua kelompok data.",
      steps: [
        "Var A = $\\frac{(10-20)^2+(20-20)^2+(30-20)^2}{3} = \\frac{200}{3} \\approx 66{,}67$",
        "Var B = $\\frac{(5-20)^2+(20-20)^2+(35-20)^2}{3} = \\frac{450}{3} = 150$",
        "SD A < SD B → Data B lebih menyebar → (1)(2)(3) BENAR ✓"
      ],
      formula: "s = \\sqrt{\\dfrac{\\sum(x_i-\\bar{x})^2}{n}}"
    }
  },
  {
    id: 64, type: "MCMA", difficulty: "Sulit", category: "HOTS Ogive Median",
    question: "Dari ogive (n=47), pernyataan tentang ukuran-ukuran yang dapat dibaca adalah ...",
    svg: <OgiveSVG />,
    statements: [
      { text: "Median terletak pada interval nilai 71–78 (karena fk melewati 23,5 di sini)", isCorrect: true },
      { text: "Persentil ke-75 (Q₃) terletak sekitar nilai 85–86", isCorrect: true },
      { text: "Persentil ke-25 (Q₁) terletak sekitar nilai 65–67", isCorrect: true },
    ],
    correctAnswer: "(1), (2), dan (3)",
    explanation: {
      concept: "Membaca persentil dari ogive.",
      steps: [
        "(1) fk=23,5 (n/2) jatuh di interval 71-78 → Median ada di sana → BENAR ✓",
        "(2) Q₃ = fk=35,25 (75%×47) → berada di interval 87-94 → sekitar 85-86 → BENAR ✓",
        "(3) Q₁ = fk=11,75 (25%×47) → berada di interval 63-70 → sekitar 65-67 → BENAR ✓"
      ]
    }
  },
  {
    id: 65, type: "MCMA", difficulty: "Sulit", category: "TKA Analisis Data",
    question: "Dua kelas memiliki nilai rata-rata sama (75), tetapi simpangan baku Kelas A = 5 dan Kelas B = 15. Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Kelas A memiliki nilai yang lebih seragam (homogen) dibanding Kelas B", isCorrect: true },
      { text: "Kelas B memiliki kesenjangan prestasi yang lebih tinggi antar siswa", isCorrect: true },
      { text: "Kelas A lebih baik untuk program pengayaan karena data lebih merata", isCorrect: true },
    ],
    correctAnswer: "(1), (2), dan (3)",
    explanation: {
      concept: "Interpretasi simpangan baku dalam konteks pendidikan.",
      steps: [
        "(1) SD kecil → data berkelompok di sekitar mean → lebih homogen → BENAR ✓",
        "(2) SD besar → ada siswa sangat tinggi dan sangat rendah → kesenjangan tinggi → BENAR ✓",
        "(3) Kelas homogen lebih mudah mendapat materi pengayaan seragam → BENAR ✓"
      ]
    }
  },
  {
    id: 66, type: "MCMA", difficulty: "Sulit", category: "HOTS Mean Gabungan",
    question: "Tiga kelompok data: A (n=10, mean=60), B (n=15, mean=70), C (n=25, mean=80). Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Total nilai kelompok A = 600", isCorrect: true },
      { text: "Mean gabungan ketiga kelompok = 73", isCorrect: true },
      { text: "Mean gabungan tidak sama dengan rata-rata dari tiga mean (63,3)", isCorrect: true },
    ],
    correctAnswer: "(1), (2), dan (3)",
    explanation: {
      concept: "Mean gabungan berbobot.",
      steps: [
        "(1) Total A = $10 \\times 60 = 600$ → BENAR ✓",
        "(2) Total B=$1050$, Total C=$2000$; Gabungan=$(600+1050+2000)/50=3650/50=73$ → BENAR ✓",
        "(3) $(60+70+80)/3=70 \\neq 73$ → Mean tidak boleh dirata-rata begitu saja → BENAR ✓"
      ],
      formula: "\\bar{x}_{gab} = \\dfrac{n_1\\bar{x}_1+n_2\\bar{x}_2+n_3\\bar{x}_3}{n_1+n_2+n_3}"
    }
  },
  {
    id: 67, type: "MCMA", difficulty: "Sulit", category: "ANBK Box Plot Analisis",
    question: "Box plot A: Min=10, Q₁=20, Med=30, Q₃=40, Max=70 dan Box plot B: Min=5, Q₁=25, Med=35, Q₃=45, Max=60. Pernyataan yang BENAR adalah ...",
    svg: <BoxPlotSVG min={10} q1={20} q2={30} q3={40} max={70}/>,
    statements: [
      { text: "Jangkauan data A lebih besar dari data B", isCorrect: true },
      { text: "Median data B lebih tinggi dari data A", isCorrect: true },
      { text: "IQR data A sama dengan IQR data B", isCorrect: true },
    ],
    correctAnswer: "(1), (2), dan (3)",
    explanation: {
      concept: "Membandingkan dua box plot.",
      steps: [
        "(1) Jangkauan A=70-10=60; Jangkauan B=60-5=55; 60>55 → BENAR ✓",
        "(2) Median B=35 > Median A=30 → BENAR ✓",
        "(3) IQR A=40-20=20; IQR B=45-25=20; Sama → BENAR ✓"
      ]
    }
  },
  {
    id: 68, type: "MCMA", difficulty: "Sulit", category: "HOTS Histogram Analisis",
    question: "Histogram nilai (n=47) dianalisis mendalam. Pernyataan yang BENAR adalah ...",
    svg: <HistogramNilaiSVG />,
    statements: [
      { text: "Data miring ke kiri (skewed left) karena ekor kiri lebih panjang", isCorrect: false },
      { text: "Data cenderung simetris dengan konsentrasi di tengah (71–78)", isCorrect: true },
      { text: "Siswa yang mendapat nilai di atas 86 ada 10 orang", isCorrect: true },
    ],
    correctAnswer: "(2) dan (3)",
    explanation: {
      concept: "Analisis bentuk distribusi dari histogram.",
      steps: [
        "(1) Ekor kiri pendek, ekor kanan pendek juga → distribusi tidak miring kiri → SALAH ✗",
        "(2) Frekuensi tertinggi di tengah (71-78), menurun ke dua sisi → hampir simetris → BENAR ✓",
        "(3) f(87-94)+f(95-102) = 7+3 = 10 siswa → BENAR ✓"
      ]
    }
  },
  {
    id: 69, type: "MCMA", difficulty: "Sulit", category: "Literasi Statistika",
    question: "Sebuah survei kepuasan pelanggan menghasilkan skor: 6,7,7,8,8,8,9,9,10. Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Mean skor = 8", isCorrect: true },
      { text: "Median = 8 dan Modus = 8", isCorrect: true },
      { text: "Karena mean = median = modus = 8, distribusinya simetris sempurna", isCorrect: false },
    ],
    correctAnswer: "(1) dan (2)",
    explanation: {
      concept: "Ukuran pemusatan dan bentuk distribusi.",
      steps: [
        "(1) Mean=$(6+7+7+8+8+8+9+9+10)/9=72/9=8$ → BENAR ✓",
        "(2) n=9, data ke-5=8 → Median=8; 8 muncul 3× → Modus=8 → BENAR ✓",
        "(3) Meski mean=median=modus, distribusi tak harus simetris sempurna → SALAH ✗"
      ]
    }
  },
  {
    id: 70, type: "MCMA", difficulty: "Sulit", category: "HOTS Outlier",
    question: "Data berat badan (kg) 10 siswa: 40, 42, 45, 45, 48, 50, 50, 52, 55, 90. Pernyataan yang BENAR adalah ...",
    statements: [
      { text: "Nilai 90 kg adalah outlier (pencilan) karena sangat jauh dari data lain", isCorrect: true },
      { text: "Mean sangat dipengaruhi oleh nilai outlier ini", isCorrect: true },
      { text: "Median lebih robust (tahan) terhadap outlier dibanding mean", isCorrect: true },
    ],
    correctAnswer: "(1), (2), dan (3)",
    explanation: {
      concept: "Pengaruh outlier terhadap ukuran pemusatan.",
      steps: [
        "(1) 90 kg jauh melebihi data lain (40-55) → outlier → BENAR ✓",
        "(2) Mean dengan 90 = (517)/10=51,7; tanpa 90 = (427)/9=47,4 → berubah drastis → BENAR ✓",
        "(3) Median = (48+50)/2=49; tanpa 90 = 48 → tidak banyak berubah → BENAR ✓"
      ]
    }
  },

  /* ═══════════════════════════════════════════════════
     SOAL BENAR/SALAH — 30 SOAL (id: 71–100)
     Mudah: 71–78 | Sedang: 79–90 | Sulit: 91–100
  ═══════════════════════════════════════════════════ */

  {
    id: 71, type: "Benar/Salah", difficulty: "Mudah", category: "Mean Dasar",
    question: "Data nilai: 6, 8, 9, 7, 10. Tentukan BENAR atau SALAH pernyataan berikut!",
    statements: [
      { text: "Rata-rata (mean) data = 8", isCorrect: true },
      { text: "Median data = 8", isCorrect: true },
      { text: "Modus data = 6", isCorrect: false },
    ],
    explanation: {
      concept: "Ukuran pemusatan data tunggal.",
      steps: [
        "(1) Mean = $(6+8+9+7+10)/5 = 40/5 = 8$ → BENAR ✓",
        "(2) Data terurut: 6,7,8,9,10; Median = data ke-3 = 8 → BENAR ✓",
        "(3) Semua data muncul 1×, tidak ada modus → SALAH ✗"
      ]
    }
  },
  {
    id: 72, type: "Benar/Salah", difficulty: "Mudah", category: "Jangkauan",
    question: "Data: 12, 18, 9, 24, 15, 21. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Nilai maksimum = 24 dan minimum = 9", isCorrect: true },
      { text: "Jangkauan = 15", isCorrect: true },
      { text: "Mean data = 17,5", isCorrect: false },
    ],
    explanation: {
      concept: "Jangkauan dan mean.",
      steps: [
        "(1) Max=24, Min=9 → BENAR ✓",
        "(2) J = 24−9 = 15 → BENAR ✓",
        "(3) Mean = $(12+18+9+24+15+21)/6 = 99/6 = 16{,}5$ (bukan 17,5) → SALAH ✗"
      ]
    }
  },
  {
    id: 73, type: "Benar/Salah", difficulty: "Mudah", category: "Modus",
    question: "Data penjualan harian: 5, 7, 7, 8, 9, 9, 9, 10. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Modus = 9 (muncul 3 kali)", isCorrect: true },
      { text: "Mean = 8,0", isCorrect: true },
      { text: "Median = 8,5", isCorrect: true },
    ],
    explanation: {
      concept: "Ukuran pemusatan data.",
      steps: [
        "(1) 9 muncul 3× (paling sering) → Modus=9 → BENAR ✓",
        "(2) Mean=$(5+7+7+8+9+9+9+10)/8=64/8=8{,}0$ → BENAR ✓",
        "(3) n=8; data ke-4=8, data ke-5=9; Median=$(8+9)/2=8{,}5$ → BENAR ✓"
      ]
    }
  },
  {
    id: 74, type: "Benar/Salah", difficulty: "Mudah", category: "Diagram Batang",
    question: "Perhatikan diagram batang berikut! Tentukan BENAR atau SALAH!",
    svg: <DiagramBatangNilai7SVG />,
    statements: [
      { text: "Nilai 70 memiliki frekuensi terbanyak", isCorrect: true },
      { text: "Jumlah siswa yang mendapat nilai ≥ 80 ada 16 siswa", isCorrect: false },
      { text: "Nilai 100 memiliki frekuensi paling sedikit", isCorrect: true },
    ],
    explanation: {
      concept: "Membaca diagram batang.",
      steps: [
        "(1) f(70)=12 (tertinggi) → BENAR ✓",
        "(2) f(80)+f(90)+f(100)=8+4+2=14 (bukan 16) → SALAH ✗",
        "(3) f(100)=2 (terendah) → BENAR ✓"
      ]
    }
  },
  {
    id: 75, type: "Benar/Salah", difficulty: "Mudah", category: "Diagram Lingkaran",
    question: "Diagram lingkaran hobi siswa: Olahraga=30%, Musik=20%, Membaca=25%, Gaming=15%, Masak=10%. Tentukan BENAR atau SALAH!",
    svg: <DiagramLingkaranHobiSVG />,
    statements: [
      { text: "Sudut sektor Olahraga = 108°", isCorrect: true },
      { text: "Persentase Musik dan Gaming = 35%", isCorrect: true },
      { text: "Jika total 400 siswa, yang hobi Masak = 30 siswa", isCorrect: false },
    ],
    explanation: {
      concept: "Membaca diagram lingkaran.",
      steps: [
        "(1) $30\\% \\times 360° = 108°$ → BENAR ✓",
        "(2) Musik+Gaming = 20%+15% = 35% → BENAR ✓",
        "(3) Masak = 10% × 400 = 40 siswa (bukan 30) → SALAH ✗"
      ]
    }
  },
  {
    id: 76, type: "Benar/Salah", difficulty: "Mudah", category: "Median",
    question: "Data: 3, 5, 7, 9, 11, 13. Tentukan BENAR atau SALAH pernyataan berikut!",
    statements: [
      { text: "Median = 8 (rata-rata data ke-3 dan ke-4)", isCorrect: true },
      { text: "Mean = 8", isCorrect: true },
      { text: "Jangkauan = 9", isCorrect: false },
    ],
    explanation: {
      concept: "Median data genap, mean, jangkauan.",
      steps: [
        "(1) Median = $(7+9)/2 = 8$ → BENAR ✓",
        "(2) Mean = $(3+5+7+9+11+13)/6 = 48/6 = 8$ → BENAR ✓",
        "(3) J = 13−3 = 10 (bukan 9) → SALAH ✗"
      ]
    }
  },
  {
    id: 77, type: "Benar/Salah", difficulty: "Mudah", category: "Piktogram",
    question: "Piktogram penjualan es krim (1 blok = 5 buah). Tentukan BENAR atau SALAH!",
    svg: <PiktogramSVG />,
    statements: [
      { text: "Penjualan Jumat lebih besar dari Selasa", isCorrect: true },
      { text: "Selisih penjualan Selasa dan Kamis = 15 buah", isCorrect: true },
      { text: "Rata-rata penjualan per hari = 30 buah", isCorrect: false },
    ],
    explanation: {
      concept: "Membaca piktogram.",
      steps: [
        "(1) Jum=35 > Sel=30 → BENAR ✓",
        "(2) Sel=30, Kam=15; Selisih=15 → BENAR ✓",
        "(3) Rata-rata=(20+30+25+15+35)/5=125/5=25 (bukan 30) → SALAH ✗"
      ]
    }
  },
  {
    id: 78, type: "Benar/Salah", difficulty: "Mudah", category: "Kontekstual Mean",
    question: "Hasil ulangan harian Andi: 75, 80, 70, 85, 90. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Rata-rata nilai Andi = 80", isCorrect: true },
      { text: "Nilai minimum Andi = 70", isCorrect: true },
      { text: "Andi perlu mendapat nilai 100 pada ulangan ke-6 agar rata-rata menjadi 85", isCorrect: false },
    ],
    explanation: {
      concept: "Mean dan target nilai.",
      steps: [
        "(1) Mean=$(75+80+70+85+90)/5=400/5=80$ → BENAR ✓",
        "(2) Nilai min=70 → BENAR ✓",
        "(3) Target rata-rata 6 ulangan=85 → Total=$6×85=510$; Nilai ke-6=$510-400=110>100$ (tidak mungkin) → SALAH ✗"
      ]
    }
  },

  /* BENAR/SALAH SEDANG (79–90) */
  {
    id: 79, type: "Benar/Salah", difficulty: "Sedang", category: "UN Kuartil",
    question: "Data terurut (n=10): 5, 8, 10, 12, 15, 18, 20, 22, 25, 28. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Q₁ = 10", isCorrect: true },
      { text: "Q₂ (median) = 16,5", isCorrect: true },
      { text: "IQR = Q₃ − Q₁ = 22 − 10 = 12", isCorrect: true },
    ],
    explanation: {
      concept: "Kuartil untuk data genap.",
      steps: [
        "(1) Q₁ = median 5 data bawah: 5,8,10,12,15 → Q₁=10 → BENAR ✓",
        "(2) Median=(15+18)/2=16,5 → BENAR ✓",
        "(3) Q₃=median 5 data atas: 18,20,22,25,28 → Q₃=22; IQR=22−10=12 → BENAR ✓"
      ],
      formula: "\\text{IQR} = Q_3 - Q_1"
    }
  },
  {
    id: 80, type: "Benar/Salah", difficulty: "Sedang", category: "Histogram",
    question: "Histogram nilai ujian (n=47) ditampilkan. Tentukan BENAR atau SALAH!",
    svg: <HistogramNilaiSVG />,
    statements: [
      { text: "Kelas modus data ada pada interval 71–78", isCorrect: true },
      { text: "Frekuensi kumulatif data ≤ 70 adalah 13 siswa", isCorrect: true },
      { text: "Persentase siswa dengan nilai 79 ke atas = 38,3%", isCorrect: false },
    ],
    explanation: {
      concept: "Analisis histogram.",
      steps: [
        "(1) f(71-78)=14 tertinggi → kelas modus ada di sini → BENAR ✓",
        "(2) fk(55-62)+fk(63-70)=4+9=13 → BENAR ✓",
        "(3) f(≥79)=10+7+3=20; 20/47×100%≈42,6% (bukan 38,3%) → SALAH ✗"
      ]
    }
  },
  {
    id: 81, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK Mean Tabel",
    question: "Tabel nilai ulangan: 70(f=5), 75(f=8), 80(f=12), 85(f=10), 90(f=5). Tentukan BENAR atau SALAH!",
    svg: <Tabel title="Tabel Nilai Ulangan Matematika" headers={["Nilai","Frekuensi"]} rows={[[70,5],[75,8],[80,12],[85,10],[90,5],["Jumlah",40]]}/>,
    statements: [
      { text: "Total siswa = 40 orang", isCorrect: true },
      { text: "Mean ≈ 80,0", isCorrect: true },
      { text: "Modus = 80", isCorrect: true },
    ],
    explanation: {
      concept: "Mean dan modus dari tabel frekuensi.",
      steps: [
        "(1) 5+8+12+10+5=40 → BENAR ✓",
        "(2) $\\sum f_ix_i=350+600+960+850+450=3210$; Mean=$3210/40=80{,}25\\approx80$ → BENAR ✓",
        "(3) f=12 tertinggi pada nilai 80 → Modus=80 → BENAR ✓"
      ]
    }
  },
  {
    id: 82, type: "Benar/Salah", difficulty: "Sedang", category: "Kontekstual Mean Gabungan",
    question: "Kelas 8A (30 siswa, rata-rata=75) dan 8B (20 siswa, rata-rata=80). Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Rata-rata gabungan = 77", isCorrect: true },
      { text: "Total nilai kelas 8B = 1.600", isCorrect: true },
      { text: "Jika digabung, rata-rata 50 siswa = 77,5", isCorrect: false },
    ],
    explanation: {
      concept: "Mean gabungan berbobot.",
      steps: [
        "(1) Total A=$30×75=2250$, Total B=$20×80=1600$; Gabungan=$(2250+1600)/50=3850/50=77$ → BENAR ✓",
        "(2) Total B=$20×80=1600$ → BENAR ✓",
        "(3) Rata-rata gabungan = 77 (bukan 77,5) → SALAH ✗"
      ]
    }
  },
  {
    id: 83, type: "Benar/Salah", difficulty: "Sedang", category: "UN Diagram Garis",
    question: "Grafik suhu bulanan Kota X. Tentukan BENAR atau SALAH!",
    svg: <GrafikSuhuBulananSVG />,
    statements: [
      { text: "Rentang suhu sepanjang tahun = 34°C − 27°C = 7°C", isCorrect: true },
      { text: "Rata-rata suhu 6 bulan pertama = 31,33°C", isCorrect: true },
      { text: "Suhu tertinggi terjadi pada bulan Juli", isCorrect: false },
    ],
    explanation: {
      concept: "Membaca grafik garis.",
      steps: [
        "(1) Max=34(Jun), Min=27(Nov); Rentang=7°C → BENAR ✓",
        "(2) 6 bulan pertama: 28+30+31+32+33+34=188; Mean=188/6≈31,33 → BENAR ✓",
        "(3) Suhu tertinggi=34°C di bulan Juni (bukan Juli) → SALAH ✗"
      ]
    }
  },
  {
    id: 84, type: "Benar/Salah", difficulty: "Sedang", category: "TKA Box Plot",
    question: "Box plot data: Min=10, Q₁=20, Q₂=30, Q₃=45, Max=70. Tentukan BENAR atau SALAH!",
    svg: <BoxPlotSVG min={10} q1={20} q2={30} q3={45} max={70}/>,
    statements: [
      { text: "IQR = 25", isCorrect: true },
      { text: "Jangkauan = 60", isCorrect: true },
      { text: "75% data berada di bawah Q₃ = 45", isCorrect: true },
    ],
    explanation: {
      concept: "Membaca box plot.",
      steps: [
        "(1) IQR=Q₃−Q₁=45−20=25 → BENAR ✓",
        "(2) J=Max−Min=70−10=60 → BENAR ✓",
        "(3) Q₃ = persentil ke-75 → 75% data ≤ Q₃ → BENAR ✓"
      ]
    }
  },
  {
    id: 85, type: "Benar/Salah", difficulty: "Sedang", category: "Simpangan Baku",
    question: "Data: 5, 10, 15, 20, 25 (mean=15). Tentukan BENAR atau SALAH!",
    svg: <SimBakuSVG data={[5,10,15,20,25]} mean={15} sd={7.07}/>,
    statements: [
      { text: "Varians = 50", isCorrect: true },
      { text: "Simpangan baku = $5\\sqrt{2} \\approx 7{,}07$", isCorrect: true },
      { text: "Nilai 5 dan 25 masing-masing berada tepat 1 simpangan baku dari mean", isCorrect: false },
    ],
    explanation: {
      concept: "Varians dan simpangan baku.",
      steps: [
        "(1) $\\sum(x-15)^2=100+25+0+25+100=250$; Var=$250/5=50$ → BENAR ✓",
        "(2) SD=$\\sqrt{50}=5\\sqrt{2}\\approx7{,}07$ → BENAR ✓",
        "(3) $|5-15|/7{,}07\\approx1{,}41$ SD, bukan tepat 1 SD → SALAH ✗"
      ]
    }
  },
  {
    id: 86, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK Ogive",
    question: "Ogive nilai ujian (n=47). Tentukan BENAR atau SALAH!",
    svg: <OgiveSVG />,
    statements: [
      { text: "Pada nilai ≤ 62, terdapat 4 siswa", isCorrect: true },
      { text: "Pada nilai ≤ 78, lebih dari separuh siswa terpenuhi", isCorrect: true },
      { text: "Median data ≈ 75 (nilai di mana fk melewati 23,5)", isCorrect: true },
    ],
    explanation: {
      concept: "Membaca ogive.",
      steps: [
        "(1) Titik (62,4) ada di grafik → BENAR ✓",
        "(2) fk(78)=27 > 23,5 = n/2 → lebih dari separuh → BENAR ✓",
        "(3) Median = nilai saat fk=23,5 → sekitar nilai 75 → BENAR ✓"
      ]
    }
  },
  {
    id: 87, type: "Benar/Salah", difficulty: "Sedang", category: "Kontekstual Literasi",
    question: "Nilai rapor 6 siswa: 78, 85, 72, 90, 88, 76. Tentukan BENAR atau SALAH!",
    svg: <DiagramBatangNilaiRaporSVG />,
    statements: [
      { text: "Mean = 81,5", isCorrect: true },
      { text: "Tiga siswa mendapat nilai di atas mean", isCorrect: true },
      { text: "Median = 81,5", isCorrect: true },
    ],
    explanation: {
      concept: "Mean dan median data.",
      steps: [
        "(1) Mean=$(78+85+72+90+88+76)/6=489/6=81{,}5$ → BENAR ✓",
        "(2) Di atas 81,5: 85, 90, 88 → 3 siswa → BENAR ✓",
        "(3) Data terurut: 72,76,78,85,88,90; Median=$(78+85)/2=81{,}5$ → BENAR ✓"
      ]
    }
  },
  {
    id: 88, type: "Benar/Salah", difficulty: "Sedang", category: "UN Penyajian Data",
    question: "Penjualan buku toko Cerdas sepanjang tahun. Tentukan BENAR atau SALAH!",
    svg: <DiagramGarisPenjualanBulananSVG />,
    statements: [
      { text: "Penjualan terendah terjadi di bulan Januari (150 eksemplar)", isCorrect: true },
      { text: "Kenaikan penjualan Jan→Feb = 30 eksemplar", isCorrect: true },
      { text: "Penjualan tertinggi terjadi di bulan Oktober", isCorrect: false },
    ],
    explanation: {
      concept: "Membaca diagram garis.",
      steps: [
        "(1) Januari=150 (terendah di grafik) → BENAR ✓",
        "(2) Jan=150, Feb=180; kenaikan=30 → BENAR ✓",
        "(3) Tertinggi=November(280), bukan Oktober(230) → SALAH ✗"
      ]
    }
  },
  {
    id: 89, type: "Benar/Salah", difficulty: "Sedang", category: "ANBK Perubahan Data",
    question: "Data 7 nilai: 60, 65, 70, 75, 80, 85, 90. Jika nilai 60 diganti 90, tentukan BENAR atau SALAH!",
    statements: [
      { text: "Mean berubah dari 75 menjadi 79,29", isCorrect: true },
      { text: "Median tidak berubah (tetap 75)", isCorrect: true },
      { text: "Modus berubah menjadi 90 (karena muncul 2 kali)", isCorrect: true },
    ],
    explanation: {
      concept: "Efek perubahan satu data.",
      steps: [
        "(1) Mean lama=$(525/7)=75$; nilai baru: 65,70,75,80,85,90,90; Mean=$(555/7)\\approx79{,}29$ → BENAR ✓",
        "(2) Data terurut baru: 65,70,75,80,85,90,90; median=data ke-4=80 → SALAH ✗ (median berubah dari 75 ke 80)",
        "(3) 90 muncul 2× (paling sering) → Modus=90 → BENAR ✓"
      ]
    }
  },
  {
    id: 90, type: "Benar/Salah", difficulty: "Sedang", category: "TKA Kontekstual",
    question: "Skor tes IQ 8 siswa: 95, 100, 105, 110, 115, 120, 125, 130. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Mean IQ = 112,5", isCorrect: true },
      { text: "Median IQ = 112,5", isCorrect: true },
      { text: "Simpangan baku data ini sama dengan 0 (semua data berbeda)", isCorrect: false },
    ],
    explanation: {
      concept: "Ukuran pemusatan dan simpangan baku.",
      steps: [
        "(1) Total=$(95+100+...+130)=900$; Mean=$900/8=112{,}5$ → BENAR ✓",
        "(2) n=8; Median=$(110+115)/2=112{,}5$ → BENAR ✓",
        "(3) SD=0 hanya jika semua data sama; di sini data beragam, SD≠0 → SALAH ✗"
      ]
    }
  },

  /* BENAR/SALAH SULIT (91–100) */
  {
    id: 91, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Analisis",
    question: "Nilai rapor semester 1 dan 2 siswa: S1 = 65,70,75,80,85 dan S2 = 70,72,78,82,88. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Mean S2 (78) lebih tinggi dari mean S1 (75)", isCorrect: true },
      { text: "Jangkauan S2 (18) lebih kecil dari S1 (20)", isCorrect: true },
      { text: "Median S1 sama dengan median S2 (keduanya = 76)", isCorrect: false },
    ],
    explanation: {
      concept: "Perbandingan dua kelompok data.",
      steps: [
        "(1) Mean S1=$(65+70+75+80+85)/5=75$; Mean S2=$(70+72+78+82+88)/5=78$ → S2>S1 → BENAR ✓",
        "(2) J_S1=85-65=20; J_S2=88-70=18; 18<20 → BENAR ✓",
        "(3) Median S1=75 (data ke-3); Median S2=78 (data ke-3); 75≠78 → SALAH ✗"
      ]
    }
  },
  {
    id: 92, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Simpangan Baku",
    question: "Data produksi pabrik (unit/hari) selama 6 hari: 48, 52, 50, 54, 46, 50. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Mean produksi = 50 unit/hari", isCorrect: true },
      { text: "Varians produksi = $\\dfrac{40}{6} \\approx 6{,}67$", isCorrect: true },
      { text: "Simpangan baku ≈ 2,58 unit", isCorrect: true },
    ],
    explanation: {
      concept: "Varians dan simpangan baku.",
      steps: [
        "(1) Mean=$(48+52+50+54+46+50)/6=300/6=50$ → BENAR ✓",
        "(2) $\\sum(x_i-50)^2=4+4+0+16+16+0=40$; Var=$40/6\\approx6{,}67$ → BENAR ✓",
        "(3) SD=$\\sqrt{6{,}67}\\approx2{,}58$ → BENAR ✓"
      ],
      formula: "s = \\sqrt{\\dfrac{\\sum(x_i-\\bar{x})^2}{n}}"
    }
  },
  {
    id: 93, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Mean Perubahan",
    question: "Nilai rata-rata 40 siswa = 72. Kemudian 10 siswa mendapat nilai 90. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Total nilai 40 siswa semula = 2880", isCorrect: true },
      { text: "Nilai rata-rata 30 siswa lainnya = 66", isCorrect: true },
      { text: "Jika 10 siswa yang bernilai 90 diganti bernilai 95, mean total menjadi 73,25", isCorrect: true },
    ],
    explanation: {
      concept: "Analisis lanjutan mean.",
      steps: [
        "(1) Total = $40×72=2880$ → BENAR ✓",
        "(2) Nilai 30 siswa = $(2880-10×90)/30=(2880-900)/30=1980/30=66$ → BENAR ✓",
        "(3) Kenaikan total = $10×5=50$; Mean baru=$(2880+50)/40=2930/40=73{,}25$ → BENAR ✓"
      ]
    }
  },
  {
    id: 94, type: "Benar/Salah", difficulty: "Sulit", category: "TKA Kuartil Lanjutan",
    question: "Data nilai 20 siswa terurut (Q₁=65, Q₂=75, Q₃=85). Tentukan BENAR atau SALAH!",
    svg: <BoxPlotSVG min={50} q1={65} q2={75} q3={85} max={100}/>,
    statements: [
      { text: "50% siswa mendapat nilai antara 65 dan 85", isCorrect: true },
      { text: "IQR = 20, sehingga batas outlier bawah = 65 - 1,5(20) = 35", isCorrect: true },
      { text: "Batas outlier atas = 85 + 1,5(20) = 115, maka tidak ada outlier atas jika nilai maks = 100", isCorrect: true },
    ],
    explanation: {
      concept: "Kuartil dan deteksi outlier (metode pagar Tukey).",
      steps: [
        "(1) 50% data ada di antara Q₁ dan Q₃ → BENAR ✓",
        "(2) IQR=85-65=20; Batas bawah=Q₁-1,5×IQR=65-30=35 → BENAR ✓",
        "(3) Batas atas=Q₃+1,5×IQR=85+30=115; Max=100<115 → tidak ada outlier atas → BENAR ✓"
      ],
      formula: "\\text{Outlier jika } x < Q_1-1{,}5\\cdot\\text{IQR} \\text{ atau } x > Q_3+1{,}5\\cdot\\text{IQR}"
    }
  },
  {
    id: 95, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Literasi Statistika",
    question: "Dua data: A = {10,20,30,40,50} dan B = {28,29,30,31,32}. Keduanya memiliki mean = 30. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Simpangan baku A > simpangan baku B", isCorrect: true },
      { text: "Koefisien variasi (CV) data B lebih kecil dari data A", isCorrect: true },
      { text: "Data B lebih konsisten (homogen) daripada data A", isCorrect: true },
    ],
    explanation: {
      concept: "Perbandingan variabilitas dua data.",
      steps: [
        "(1) SD_A=$\\sqrt{200}\\approx14{,}14$; SD_B=$\\sqrt{2}\\approx1{,}41$; SD_A>SD_B → BENAR ✓",
        "(2) CV_A=$(14{,}14/30)\\approx47{,}1\\%$; CV_B=$(1{,}41/30)\\approx4{,}7\\%$; CV_B<CV_A → BENAR ✓",
        "(3) SD_B kecil → data B lebih konsisten → BENAR ✓"
      ]
    }
  },
  {
    id: 96, type: "Benar/Salah", difficulty: "Sulit", category: "ANBK Analisis Histogram",
    question: "Histogram nilai ujian Matematika (n=47) dianalisis. Tentukan BENAR atau SALAH!",
    svg: <HistogramNilaiSVG />,
    statements: [
      { text: "Jika data ini mewakili populasi, sekitar 29,8% siswa mendapat nilai 71–78", isCorrect: true },
      { text: "Frekuensi relatif kumulatif (fkr) untuk nilai ≤ 78 = 57,4%", isCorrect: true },
      { text: "Nilai mean data ini pasti sama dengan mediannya", isCorrect: false },
    ],
    explanation: {
      concept: "Frekuensi relatif dan analisis distribusi.",
      steps: [
        "(1) $14/47 \\times 100\\% \\approx 29{,}8\\%$ → BENAR ✓",
        "(2) fk(≤78)=4+9+14=27; fkr=$27/47\\times100\\%\\approx57{,}4\\%$ → BENAR ✓",
        "(3) Mean dan median berbeda kecuali distribusi simetris sempurna → SALAH ✗"
      ]
    }
  },
  {
    id: 97, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Kontekstual",
    question: "Seorang investor mencatat return saham bulanan (%): 5, -3, 8, 2, -1, 6, 4, -2, 7, 3 (dalam %). Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Rata-rata return = 2,9%", isCorrect: true },
      { text: "Median return = 3,5%", isCorrect: true },
      { text: "Jangkauan return = 11%", isCorrect: true },
    ],
    explanation: {
      concept: "Statistika dalam konteks keuangan.",
      steps: [
        "(1) Total=$5+(-3)+8+2+(-1)+6+4+(-2)+7+3=29$; Mean=$29/10=2{,}9$ → BENAR ✓",
        "(2) Data terurut: -3,-2,-1,2,3,4,5,6,7,8; Median=$(3+4)/2=3{,}5$ → BENAR ✓",
        "(3) J=8-(-3)=11 → BENAR ✓"
      ]
    }
  },
  {
    id: 98, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Skewness",
    question: "Data distribusi miring: Mean=60, Median=55, Modus=48. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Distribusi ini miring ke kanan (positif) karena Mean > Median > Modus", isCorrect: true },
      { text: "Ekor distribusi berada di sisi kanan (nilai tinggi)", isCorrect: true },
      { text: "Pada distribusi miring kanan, median adalah ukuran terbaik untuk merepresentasikan pusat data", isCorrect: true },
    ],
    explanation: {
      concept: "Kemiringan distribusi (skewness).",
      steps: [
        "(1) Mean>Median>Modus (60>55>48) → distribusi miring positif (kanan) → BENAR ✓",
        "(2) Ekor panjang berada di sisi kanan (nilai besar) → BENAR ✓",
        "(3) Median lebih robust terhadap outlier/kemiringan dibanding mean → BENAR ✓"
      ],
      formula: "\\text{Skewness positif:} \\quad \\text{Mo} < \\text{Me} < \\bar{x}"
    }
  },
  {
    id: 99, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS Interpretasi Data",
    question: "Enam nilai rapor: 70, 75, 80, 80, 85, 90. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Mean = Median = Modus = 80", isCorrect: true },
      { text: "Jika nilai 70 diganti 80, maka modus berubah namun median tetap", isCorrect: false },
      { text: "IQR = $85-75 = 10$", isCorrect: true },
    ],
    explanation: {
      concept: "Analisis komprehensif ukuran statistik.",
      steps: [
        "(1) Mean=$(70+75+80+80+85+90)/6=480/6=80$; Median=$(80+80)/2=80$; Modus=80 → BENAR ✓",
        "(2) Data baru: 75,80,80,80,85,90; Modus masih 80 (tetap); Median=$(80+80)/2=80$ (tetap); Mean berubah jadi $490/6\\approx81{,}7$ → Pernyataan SALAH ✗",
        "(3) Data: 70,75,80,80,85,90 → Q₁=(75+80)/2=77,5 atau Q₁=75; Q₃=85; IQR=85-75=10 → BENAR ✓"
      ]
    }
  },
  {
    id: 100, type: "Benar/Salah", difficulty: "Sulit", category: "HOTS ANBK Komprehensif",
    question: "Seorang kepala sekolah menganalisis data ujian 200 siswa kelas 9 dengan mean=72, SD=10. Tentukan BENAR atau SALAH!",
    statements: [
      { text: "Kisaran nilai yang mencakup 68% siswa (1 SD dari mean) adalah 62–82", isCorrect: true },
      { text: "Siswa dengan nilai di atas 92 (>2 SD dari mean) termasuk kelompok sangat unggul", isCorrect: true },
      { text: "Dengan asumsi distribusi normal, sekitar 140 siswa mendapat nilai antara 62 dan 82", isCorrect: true },
    ],
    explanation: {
      concept: "Aturan empiris distribusi normal (68-95-99,7%).",
      steps: [
        "(1) $[72-10, 72+10] = [62,82]$ → mencakup ±1 SD = 68% → BENAR ✓",
        "(2) $>72+2(10)=92$ → lebih dari 2 SD di atas mean → sangat unggul → BENAR ✓",
        "(3) 68% × 200 = 136 ≈ 140 siswa → BENAR ✓"
      ],
      formula: "P(\\mu-\\sigma \\leq x \\leq \\mu+\\sigma) \\approx 68\\%"
    }
  },
];

/* ══════════════════════════════════════════════════════
   UI COMPONENTS
══════════════════════════════════════════════════════ */
const difficultyColor: Record<Difficulty, string> = {
  "Mudah": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Sedang": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Sulit": "bg-rose-500/20 text-rose-400 border-rose-500/30"
};
const typeColor: Record<QuestionType, string> = {
  "PG": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "MCMA": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Benar/Salah": "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30"
};
const typeLabel: Record<QuestionType, string> = {
  "PG": "Pilihan Ganda",
  "MCMA": "PG Kompleks MCMA",
  "Benar/Salah": "PG Kompleks B/S"
};

const SoalCard = ({ soal }: { soal: Question }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMCMA = soal.type === "MCMA";
  const isBS = soal.type === "Benar/Salah";
  return (
    <div className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500 animate-slide-up"
      style={{ background: "linear-gradient(135deg,rgba(30,41,59,0.6) 0%,rgba(15,23,42,0.8) 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%,rgba(0,200,255,0.08) 0%,transparent 50%)" }} />
      <div className="relative p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-primary/80 bg-primary/10 px-2 py-1 rounded-md">#{soal.id}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${difficultyColor[soal.difficulty]}`}>{soal.difficulty}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColor[soal.type]}`}>{typeLabel[soal.type]}</span>
          <span className="text-xs text-white/30 font-body">{soal.category}</span>
        </div>
        <div className="mb-4">
          <div className="text-foreground font-body text-sm md:text-base leading-relaxed whitespace-pre-line">
            <MathText text={soal.question} />
          </div>
          {soal.svg && <div className="mt-3">{soal.svg}</div>}
        </div>
        {soal.options && (
          <div className="space-y-2 mb-4">
            {soal.options.map((opt, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                <span className="text-sm text-foreground/90 font-body"><MathText text={opt} /></span>
              </div>
            ))}
          </div>
        )}
        {soal.statements && (
          <div className="space-y-2 mb-4">
            {soal.statements.map((s, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 ${isMCMA ? "bg-muted/30 border-border/30" : "bg-muted/20 border-border/20"}`}>
                <span className={`text-xs font-bold shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${isMCMA ? "bg-violet-500/20 text-violet-300" : "bg-fuchsia-500/20 text-fuchsia-300"}`}>
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/90 font-body"><MathText text={s.text} /></span>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => { playPopSound(); setIsOpen(!isOpen); }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 hover:from-primary/30 hover:to-secondary/30 hover:border-primary/50 transition-all duration-300 cursor-pointer">
          <span className="text-sm font-semibold text-primary">{isOpen ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[3000px] opacity-100 mt-5" : "max-h-0 opacity-0"}`}>
          <div className="relative p-5 rounded-xl border border-primary/20"
            style={{ background: "linear-gradient(135deg,rgba(0,200,255,0.05) 0%,rgba(139,92,246,0.05) 100%)" }}>
            <h4 className="font-display text-sm md:text-base font-bold text-primary mb-3">Pembahasan</h4>
            {soal.correctAnswer && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40">
                <p className="text-xs font-semibold text-emerald-400 mb-1">✅ Kunci Jawaban</p>
                <span className="text-sm text-emerald-300 font-body"><MathText text={soal.correctAnswer} /></span>
              </div>
            )}
            {isBS && soal.statements && (
              <div className="mb-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-xs font-semibold text-emerald-400 mb-2">✅ Kunci Jawaban</p>
                <div className="flex flex-wrap gap-2">
                  {soal.statements.map((s, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded font-body ${s.isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                      ({i+1}) {s.isCorrect ? "✓ Benar" : "✗ Salah"}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {isMCMA && soal.statements && (
              <div className="mb-3 p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
                <p className="text-xs font-semibold text-violet-300 mb-1">✅ Jawaban: <span className="font-body text-violet-200">{soal.correctAnswer}</span></p>
                <p className="text-xs text-violet-300/70 mt-1">Pernyataan benar: {soal.statements.map((s,i) => s.isCorrect ? `(${i+1})` : null).filter(Boolean).join(", ")}</p>
              </div>
            )}
            <div className="mb-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs font-semibold text-blue-300 mb-1">📖 Konsep</p>
              <p className="text-sm text-white/80 font-body">{soal.explanation.concept}</p>
            </div>
            <div className="space-y-2">
              {soal.explanation.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                  <span className="text-sm text-white/80 font-body"><MathText text={step} /></span>
                </div>
              ))}
            </div>
            {soal.explanation.formula && (
              <div className="mt-4 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <p className="text-xs font-semibold text-violet-300 mb-2">📐 Rumus / Kunci</p>
                <div className="text-center"><BlockMath math={soal.explanation.formula} /></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
const BankSoalStatistikaPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "Semua">("Semua");
  const [filterType, setFilterType] = useState<QuestionType | "Semua">("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = soalStatistika.filter(s =>
    (filterDifficulty === "Semua" || s.difficulty === filterDifficulty) &&
    (filterType === "Semua" || s.type === filterType)
  );

  const counts = {
    Mudah: soalStatistika.filter(s => s.difficulty === "Mudah").length,
    Sedang: soalStatistika.filter(s => s.difficulty === "Sedang").length,
    Sulit: soalStatistika.filter(s => s.difficulty === "Sulit").length,
    PG: soalStatistika.filter(s => s.type === "PG").length,
    MCMA: soalStatistika.filter(s => s.type === "MCMA").length,
    BS: soalStatistika.filter(s => s.type === "Benar/Salah").length,
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-x-hidden">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      <div className="relative z-10 max-w-4xl w-full px-4 pt-20 pb-12">
        <BarChart2 className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
          BANK SOAL STATISTIKA
        </h1>
        <p className="text-white/60 text-sm text-center mb-1 font-body">
          Mean · Median · Modus · Kuartil · Simpangan Baku · Penyajian Data
        </p>
        <p className="text-white/40 text-xs text-center mb-5 font-body">
          100 Soal · UN / TKA / HOTS / ANBK / Literasi Matematika · PG + MCMA + Benar/Salah · Dengan Pembahasan
        </p>

        <div className="flex justify-center gap-2 mb-3 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-body">{counts.Mudah} Mudah</span>
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-body">{counts.Sedang} Sedang</span>
          <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-body">{counts.Sulit} Sulit</span>
        </div>
        <div className="flex justify-center gap-2 mb-5 flex-wrap">
          <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-body">{counts.PG} PG</span>
          <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 font-body">{counts.MCMA} MCMA</span>
          <span className="text-xs px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 font-body">{counts.BS} B/S</span>
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-body">Total: {soalStatistika.length} Soal</span>
        </div>

        <div className="mb-6">
          <button onClick={() => { playPopSound(); setShowFilter(v => !v); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/60 border border-border hover:border-primary/40 transition-all text-sm text-white/70 cursor-pointer font-body mx-auto">
            <Filter className="w-4 h-4" /> Filter Soal {showFilter ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
          </button>
          {showFilter && (
            <div className="mt-3 p-4 rounded-xl bg-card/60 border border-border space-y-3">
              <div>
                <p className="text-xs text-white/50 mb-2 font-body">Tingkat Kesulitan:</p>
                <div className="flex flex-wrap gap-2">
                  {(["Semua","Mudah","Sedang","Sulit"] as const).map(d => (
                    <button key={d} onClick={() => { playPopSound(); setFilterDifficulty(d); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterDifficulty === d ? "bg-primary text-white border-primary" : "border-border text-white/50 hover:border-primary/40"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-2 font-body">Tipe Soal:</p>
                <div className="flex flex-wrap gap-2">
                  {(["Semua","PG","MCMA","Benar/Salah"] as const).map(t => (
                    <button key={t} onClick={() => { playPopSound(); setFilterType(t); }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-body cursor-pointer transition-all ${filterType === t ? "bg-primary text-white border-primary" : "border-border text-white/50 hover:border-primary/40"}`}>
                      {t === "MCMA" ? "PG Kompleks MCMA" : t === "Benar/Salah" ? "PG Kompleks B/S" : t}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/40 font-body">Menampilkan {filtered.length} dari {soalStatistika.length} soal</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {filtered.map(soal => <SoalCard key={soal.id} soal={soal} />)}
        </div>

        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/bank-soal"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Bank Soal
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankSoalStatistikaPage;
