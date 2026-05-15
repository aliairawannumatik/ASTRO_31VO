import { useState, createContext, useContext, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { ChevronDown, ChevronUp, Lightbulb, BookOpen } from "lucide-react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

function normalize(s: string) { return s.toLowerCase().replace(/\s+/g, " ").trim(); }
function checkAnswer(val: string, accepted: string[]): boolean {
  return accepted.some(a => normalize(a) === normalize(val));
}

const ANSWERS: Record<string, string[]> = {
  /* Kasus 1 — Titik potong x + y = 5 dan x − y = 1 */
  k1_t1x0: ["5"], k1_t1y0: ["0"],
  k1_t1x1: ["0"], k1_t1y1: ["5"],
  k1_t2x0: ["1"], k1_t2y0: ["0"],
  k1_t2x1: ["0"], k1_t2y1: ["-1", "−1"],
  k1_titik: ["(3, 2)", "3, 2", "x=3, y=2", "x = 3, y = 2"],
  k1_hp: ["{(3, 2)}", "(3, 2)", "3 dan 2", "x=3 y=2"],

  /* Kasus 2 — Titik potong 2x + y = 6 dan x − y = 0 */
  k2_t1x0: ["3"], k2_t1y0: ["0"],
  k2_t1x1: ["0"], k2_t1y1: ["6"],
  k2_t2x0: ["0"], k2_t2y0: ["0"],
  k2_t2x1: ["2"], k2_t2y1: ["2"],
  k2_titik: ["(2, 2)", "2, 2", "x=2, y=2"],
  k2_hp: ["{(2, 2)}", "(2, 2)", "2 dan 2"],

  /* Kasus 3 — Titik potong 3x + y = 9 dan x + y = 5 */
  k3_t1x0: ["3"], k3_t1y0: ["0"],
  k3_t1x1: ["0"], k3_t1y1: ["9"],
  k3_t2x0: ["5"], k3_t2y0: ["0"],
  k3_t2x1: ["0"], k3_t2y1: ["5"],
  k3_titik: ["(2, 3)", "2, 3", "x=2, y=3"],
  k3_hp: ["{(2, 3)}", "(2, 3)", "2 dan 3"],

  /* Kasus 4 — Kontekstual */
  k4_p1: ["x + y = 10", "y + x = 10"],
  k4_p2: ["x − y = 4", "y − x = -4", "y = x − 4"],
  k4_jawab_x: ["7"], k4_jawab_y: ["3"],
};

const SECTIONS: Record<string, string[]> = {
  k1tabel: ["k1_t1x0","k1_t1y0","k1_t1x1","k1_t1y1","k1_t2x0","k1_t2y0","k1_t2x1","k1_t2y1"],
  k1titik: ["k1_titik","k1_hp"],
  k2tabel: ["k2_t1x0","k2_t1y0","k2_t1x1","k2_t1y1","k2_t2x0","k2_t2y0","k2_t2x1","k2_t2y1"],
  k2titik: ["k2_titik","k2_hp"],
  k3tabel: ["k3_t1x0","k3_t1y0","k3_t1x1","k3_t1y1","k3_t2x0","k3_t2y0","k3_t2x1","k3_t2y1"],
  k3titik: ["k3_titik","k3_hp"],
  k4: ["k4_p1","k4_p2","k4_jawab_x","k4_jawab_y"],
};

type PageCtxType = { vals: Record<string,string>; res: Record<string,boolean|null>; onChange:(id:string,v:string)=>void; onCek:(k:string)=>void; };
const PageCtx = createContext<PageCtxType>({ vals:{}, res:{}, onChange:()=>{}, onCek:()=>{} });

function Blank({ id, w="w-20", mono=true }: { id:string; w?:string; mono?:boolean }) {
  const { vals, res, onChange } = useContext(PageCtx);
  const r = res[id] ?? null;
  const border = r===null ? "border-2 border-dashed border-cyan-400/70 focus:border-cyan-300" : r ? "border-2 border-solid border-emerald-400" : "border-2 border-solid border-red-400";
  const bg = r===null ? "bg-white/5" : r ? "bg-emerald-500/20" : "bg-red-500/20";
  const tc = r===null ? "text-white" : r ? "text-emerald-200" : "text-red-200";
  return (
    <span className="inline-flex items-center gap-0.5 align-middle">
      <input value={vals[id]??""} onChange={e=>onChange(id,e.target.value)} placeholder="···"
        className={`${w} min-w-0 ${border} ${bg} ${tc} rounded-md text-center text-sm outline-none px-1 py-1 transition-all duration-200 ${mono?"font-mono":"font-body"} placeholder-white/30 font-bold`}/>
      {r!==null && <span className={`text-sm font-bold ${r?"text-emerald-400":"text-red-400"}`}>{r?"✓":"✗"}</span>}
    </span>
  );
}
function CekButton({ sectionKey }: { sectionKey:string }) {
  const { res, onCek } = useContext(PageCtx);
  const ids = SECTIONS[sectionKey] ?? [];
  const checked = ids.some(id => res[id]!==null && res[id]!==undefined);
  const correct = ids.filter(id => res[id]===true).length;
  return (
    <div className="flex items-center gap-3 mt-4">
      <button onClick={()=>onCek(sectionKey)} className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold font-display tracking-wide hover:opacity-90 active:scale-95 transition-all shadow-[0_0_16px_rgba(6,182,212,0.4)]">Cek Jawaban</button>
      {checked && <span className={`text-sm font-bold font-display ${correct===ids.length?"text-emerald-400":"text-amber-400"}`}>{correct}/{ids.length} benar</span>}
    </div>
  );
}
const B = ({ id, w, mono }: { id:string; w?:string; mono?:boolean }) => <Blank id={id} w={w} mono={mono}/>;
const CK = ({ sectionKey }: { sectionKey:string }) => <CekButton sectionKey={sectionKey}/>;

function SectionHeader({ label, color="cyan", children }: { label:string; color?:string; children?:React.ReactNode }) {
  const colors: Record<string,string> = {
    cyan:    "from-cyan-500/50 to-blue-600/40 border-cyan-400/60 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.2)]",
    emerald: "from-emerald-500/50 to-teal-600/40 border-emerald-400/60 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    violet:  "from-violet-500/50 to-purple-600/40 border-violet-400/60 text-violet-100 shadow-[0_0_20px_rgba(139,92,246,0.2)]",
    amber:   "from-amber-500/50 to-orange-600/40 border-amber-400/60 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.2)]",
  };
  return (
    <div className={`rounded-2xl p-4 mb-4 bg-gradient-to-br border ${colors[color]}`}>
      <p className={`font-display text-base font-black tracking-wide ${colors[color].split(" ").slice(-1)}`}>{label}</p>
      {children && <div className="mt-2 text-sm text-white/85 font-body">{children}</div>}
    </div>
  );
}

/* Simple SVG graph component */
function GrafikSPLDV({ eq1, eq2, xp, yp, color1="rgb(34,211,238)", color2="rgb(52,211,153)" }:{eq1:string;eq2:string;xp:number;yp:number;color1?:string;color2?:string}) {
  const W=260, H=220, ox=80, oy=110, sc=25;
  const toSvg=(x:number,y:number)=>({sx:ox+x*sc, sy:oy-y*sc});
  const pts1=[{x:-1,y:eq1==="x+y=5"?6:eq1==="2x+y=6"?8:eq1==="3x+y=9"?12:6},{x:5,y:eq1==="x+y=5"?0:eq1==="2x+y=6"?-4:eq1==="3x+y=9"?-6:0}];
  const pts2=[{x:-1,y:eq2==="x-y=1"?-2:eq2==="x-y=0"?-1:eq2==="x+y=5"?6:2},{x:5,y:eq2==="x-y=1"?4:eq2==="x-y=0"?5:eq2==="x+y=5"?0:4}];
  const {sx:ix,sy:iy}=toSvg(xp,yp);
  return (
    <svg width={W} height={H} className="mx-auto my-2" style={{maxWidth:"100%"}}>
      <rect width={W} height={H} fill="rgba(15,23,42,0.8)" rx={10}/>
      {/* grid */}
      {[-2,-1,0,1,2,3,4,5].map(x=><line key={`gx${x}`} x1={ox+x*sc} y1={10} x2={ox+x*sc} y2={H-10} stroke="rgba(255,255,255,0.06)" strokeWidth={1}/>)}
      {[-3,-2,-1,0,1,2,3,4].map(y=><line key={`gy${y}`} x1={10} y1={oy-y*sc} x2={W-10} y2={oy-y*sc} stroke="rgba(255,255,255,0.06)" strokeWidth={1}/>)}
      {/* axes */}
      <line x1={10} y1={oy} x2={W-10} y2={oy} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5}/>
      <line x1={ox} y1={10} x2={ox} y2={H-10} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5}/>
      {/* axis labels */}
      <text x={W-8} y={oy-4} fill="rgba(255,255,255,0.4)" fontSize={10} textAnchor="end">x</text>
      <text x={ox+4} y={16} fill="rgba(255,255,255,0.4)" fontSize={10}>y</text>
      {[-2,-1,1,2,3,4,5].map(n=><text key={`lx${n}`} x={ox+n*sc} y={oy+14} fill="rgba(255,255,255,0.3)" fontSize={8} textAnchor="middle">{n}</text>)}
      {[-2,-1,1,2,3,4].map(n=><text key={`ly${n}`} x={ox-6} y={oy-n*sc+3} fill="rgba(255,255,255,0.3)" fontSize={8} textAnchor="end">{n}</text>)}
      {/* line 1 */}
      <line x1={toSvg(pts1[0].x,pts1[0].y).sx} y1={toSvg(pts1[0].x,pts1[0].y).sy} x2={toSvg(pts1[1].x,pts1[1].y).sx} y2={toSvg(pts1[1].x,pts1[1].y).sy} stroke={color1} strokeWidth={2}/>
      {/* line 2 */}
      <line x1={toSvg(pts2[0].x,pts2[0].y).sx} y1={toSvg(pts2[0].x,pts2[0].y).sy} x2={toSvg(pts2[1].x,pts2[1].y).sx} y2={toSvg(pts2[1].x,pts2[1].y).sy} stroke={color2} strokeWidth={2}/>
      {/* intersection */}
      <circle cx={ix} cy={iy} r={6} fill="rgba(250,204,21,0.9)" stroke="white" strokeWidth={1.5}/>
      <text x={ix+8} y={iy-5} fill="rgb(250,204,21)" fontSize={11} fontWeight="bold">({xp},{yp})</text>
      {/* legend */}
      <line x1={14} y1={H-20} x2={34} y2={H-20} stroke={color1} strokeWidth={2}/>
      <text x={38} y={H-16} fill="rgba(255,255,255,0.7)" fontSize={9}>{eq1}</text>
      <line x1={W/2+10} y1={H-20} x2={W/2+30} y2={H-20} stroke={color2} strokeWidth={2}/>
      <text x={W/2+34} y={H-16} fill="rgba(255,255,255,0.7)" fontSize={9}>{eq2}</text>
    </svg>
  );
}

const POSTES_GAMES = [
  { id:"meteor", emoji:"🚀", name:"Pesawat Tembak Meteor", bg:"from-red-700/50 to-orange-700/40 border-red-400/50", glow:"rgba(239,68,68,0.35)" },
  { id:"flappy", emoji:"🛸", name:"Flappy Rocket", bg:"from-cyan-700/50 to-blue-700/40 border-cyan-400/50", glow:"rgba(6,182,212,0.35)" },
  { id:"tank",   emoji:"🎯", name:"Shoot Tank", bg:"from-green-700/50 to-emerald-700/40 border-green-400/50", glow:"rgba(16,185,129,0.35)" },
  { id:"space",  emoji:"🌌", name:"Space Impact Math", bg:"from-indigo-700/50 to-blue-900/40 border-indigo-400/50", glow:"rgba(99,102,241,0.35)" },
  { id:"turtle", emoji:"🐢", name:"Turtle Run Math", bg:"from-teal-700/50 to-green-700/40 border-teal-400/50", glow:"rgba(20,184,166,0.35)" },
  { id:"tetris", emoji:"🧩", name:"Tetris Numatik", bg:"from-pink-700/50 to-rose-700/40 border-pink-400/50", glow:"rgba(236,72,153,0.35)" },
  { id:"snake",  emoji:"🐍", name:"Snake Matematika", bg:"from-lime-700/50 to-green-800/40 border-lime-400/50", glow:"rgba(132,204,22,0.35)" },
];

const MetodeGrafikLKPDPage = () => {
  const [vals, setVals] = useState<Record<string,string>>({});
  const [res, setRes] = useState<Record<string,boolean|null>>({});
  const [materiOpen, setMateriOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["ide"]);
  const [postesOpen, setPostesOpen] = useState(false);
  const [kesanOpen, setKesanOpen] = useState(false);
  const navigate = useNavigate();
  const valsRef = useRef(vals);
  valsRef.current = vals;
  const toggleSec = (id:string) => setOpenSections(p => p.includes(id) ? p.filter(s=>s!==id) : [...p,id]);

  const handleChange = useCallback((id:string, v:string) => {
    setVals(p=>({...p,[id]:v})); setRes(p=>({...p,[id]:null}));
  },[]);
  const handleCek = useCallback((sectionKey:string) => {
    const ids = SECTIONS[sectionKey]??[];
    const updates: Record<string,boolean|null>={};
    ids.forEach(id=>{ updates[id]=checkAnswer(valsRef.current[id]??"",ANSWERS[id]??[]); });
    setRes(p=>({...p,...updates}));
  },[]);

  return (
    <PageCtx.Provider value={{ vals, res, onChange:handleChange, onCek:handleCek }}>
    <div className="relative min-h-screen flex flex-col gradient-space overflow-hidden">
      <Starfield/>
      <PageNavigation prevPath="/lkpd/kelas-8/spldv"/>
      <div className="relative z-10 max-w-2xl w-full mx-auto px-4 pt-6 pb-24">

        {/* Header */}
        <div className="rounded-3xl border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-600/30 via-blue-700/25 to-violet-600/25 p-6 mb-6 text-center shadow-[0_0_40px_rgba(6,182,212,0.25)]">
          <p className="font-display text-xs font-bold tracking-widest text-cyan-300 uppercase mb-1">Lembar Kerja Peserta Didik (LKPD 2)</p>
          <h1 className="font-display text-xl md:text-2xl font-black text-white mb-2 drop-shadow-lg">Penyelesaian SPLDV<br/>Dengan Metode Grafik</h1>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-body text-white/70">
            <p>Mata Pelajaran: <span className="text-white font-bold">Matematika</span></p>
            <p>Kelas / Semester: <span className="text-white font-bold">VIII / I</span></p>
            <p>Alokasi Waktu: <span className="text-white font-bold">2 × 40 menit</span></p>
            <p>Satuan Pendidikan: <span className="text-white font-bold">SMP</span></p>
          </div>
          <p className="mt-3 text-sm text-white/80 font-body leading-relaxed text-left">
            <span className="text-cyan-300 font-bold">Tujuan Pembelajaran :</span> Peserta didik dapat menyelesaikan SPLDV dengan metode grafik melalui penggambaran dua garis lurus dan menentukan titik potongnya.
          </p>
        </div>

        {/* Panduan Materi */}
        <div className="mb-6">
          <button onClick={()=>setMateriOpen(v=>!v)} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-yellow-400/60 bg-gradient-to-r from-yellow-600/30 via-amber-600/20 to-orange-600/20 shadow-[0_0_24px_rgba(234,179,8,0.2)] hover:opacity-90 active:scale-[0.99] transition-all">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div className="text-left">
                <p className="font-display text-sm font-black text-yellow-200 tracking-wide uppercase">Panduan Materi — Metode Grafik</p>
                <p className="font-body text-xs text-yellow-300/70 mt-0.5">{materiOpen?"Tutup panduan materi":"Buka untuk membaca teori sebelum mengerjakan"}</p>
              </div>
            </div>
            {materiOpen?<ChevronUp className="w-5 h-5 text-yellow-300 shrink-0"/>:<div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse"/><ChevronDown className="w-5 h-5 text-yellow-300 shrink-0"/></div>}
          </button>
          {materiOpen && (
            <div className="mt-3 rounded-2xl border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-950/60 via-amber-950/50 to-orange-950/40 overflow-hidden">
              <div className="border-b border-yellow-400/20">
                <button onClick={()=>toggleSec("ide")} className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-400"/><span className="font-body text-sm font-semibold text-white">📈 Ide Dasar Metode Grafik</span></div>
                  {openSections.includes("ide")?<ChevronUp className="w-4 h-4 text-yellow-300"/>:<ChevronDown className="w-4 h-4 text-yellow-300"/>}
                </button>
                {openSections.includes("ide") && (
                  <div className="px-5 pb-5 space-y-4">
                    <p className="font-body text-sm text-white/80 leading-relaxed">Setiap PLDV <InlineMath math="ax + by = c"/> dapat digambar sebagai <strong className="text-cyan-300">garis lurus</strong> pada bidang koordinat. Solusi SPLDV adalah <strong className="text-yellow-300">titik potong</strong> kedua garis tersebut — yaitu titik <InlineMath math="(x,y)"/> yang terletak di kedua garis sekaligus.</p>
                    <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                      <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-2">🔑 Langkah-Langkah Metode Grafik</p>
                      <div className="space-y-2 text-sm font-body text-white/80">
                        {["Buat tabel nilai (x, y) untuk masing-masing persamaan (minimal 2 titik per garis).","Gambar kedua garis pada bidang koordinat yang sama.","Tentukan titik potong kedua garis → itulah solusi SPLDV.","Verifikasi titik potong ke kedua persamaan awal."].map((s,i)=>(
                          <div key={i} className="flex gap-2 items-start"><span className="text-cyan-400 font-black shrink-0">{i+1}.</span><p>{s}</p></div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <p className="font-body text-sm text-yellow-200"><strong>Tips:</strong> Pilih x = 0 untuk mencari titik potong sumbu y, dan y = 0 untuk mencari titik potong sumbu x. Dua titik sudah cukup untuk menggambar sebuah garis!</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-b border-yellow-400/20">
                <button onClick={()=>toggleSec("titik")} className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2"><span className="text-yellow-400">📋</span><span className="font-body text-sm font-semibold text-white">📌 Cara Membuat Tabel Nilai</span></div>
                  {openSections.includes("titik")?<ChevronUp className="w-4 h-4 text-yellow-300"/>:<ChevronDown className="w-4 h-4 text-yellow-300"/>}
                </button>
                {openSections.includes("titik") && (
                  <div className="px-5 pb-5 space-y-4">
                    <p className="font-body text-sm text-white/80">Contoh untuk <InlineMath math="x + y = 5"/>:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm font-mono border-collapse">
                        <thead><tr className="bg-cyan-900/40"><th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">x</th><th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">y = 5 − x</th><th className="border border-cyan-500/30 px-4 py-2 text-cyan-200">Titik</th></tr></thead>
                        <tbody>
                          {[[0,5,"(0, 5)"],[5,0,"(5, 0)"]].map(([x,y,t],i)=>(
                            <tr key={i} className={i%2===0?"bg-white/5":""}><td className="border border-white/10 px-4 py-2 text-center text-white">{x}</td><td className="border border-white/10 px-4 py-2 text-center text-yellow-300 font-bold">{y}</td><td className="border border-white/10 px-4 py-2 text-center text-emerald-300">{t}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="font-body text-xs text-white/60">Titik (0,5) dan (5,0) cukup untuk menggambar garis <InlineMath math="x + y = 5"/>.</p>
                  </div>
                )}
              </div>
              <div>
                <button onClick={()=>toggleSec("rangkuman")} className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary"/><span className="font-body text-sm font-semibold text-white">📋 Rangkuman</span></div>
                  {openSections.includes("rangkuman")?<ChevronUp className="w-4 h-4 text-yellow-300"/>:<ChevronDown className="w-4 h-4 text-yellow-300"/>}
                </button>
                {openSections.includes("rangkuman") && (
                  <div className="px-5 pb-5 space-y-3">
                    {[
                      { poin:"Setiap PLDV dapat divisualisasikan sebagai garis lurus di koordinat Kartesius.", icon:"📈" },
                      { poin:"Solusi SPLDV = titik potong dua garis (x, y yang memenuhi keduanya).", icon:"✂️" },
                      { poin:"Jika dua garis sejajar → tidak ada solusi. Jika berhimpit → tak hingga solusi.", icon:"⚠️" },
                      { poin:"Metode grafik mudah dipahami secara visual tapi kurang akurat untuk bilangan desimal.", icon:"💡" },
                    ].map(({poin,icon})=>(
                      <div key={poin} className="flex items-start gap-3 bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3">
                        <span className="text-lg shrink-0">{icon}</span><p className="font-body text-sm text-white/80">{poin}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contoh pengantar */}
        <div className="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/50 to-indigo-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="font-bold text-white text-lg mb-1">Contoh: Metode Grafik untuk SPLDV</p>
          <p className="text-sm text-blue-200/80 mb-3">Tentukan himpunan penyelesaian dari <InlineMath math="x + y = 5"/> dan <InlineMath math="x - y = 1"/>.</p>
          <div className="space-y-4">
            <div className="bg-cyan-900/40 border border-cyan-400/30 rounded-xl p-4">
              <p className="text-sm font-bold text-cyan-300 mb-3">① Tabel nilai untuk <InlineMath math="x + y = 5"/></p>
              <div className="overflow-x-auto"><table className="w-full text-sm font-mono border-collapse"><thead><tr className="bg-cyan-900/40"><th className="border border-cyan-500/30 px-3 py-1.5 text-cyan-200">x</th><th className="border border-cyan-500/30 px-3 py-1.5 text-cyan-200">0</th><th className="border border-cyan-500/30 px-3 py-1.5 text-cyan-200">5</th></tr></thead><tbody><tr className="bg-white/5"><td className="border border-white/10 px-3 py-1.5 text-center text-white font-bold">y</td><td className="border border-white/10 px-3 py-1.5 text-center text-yellow-300 font-bold">5</td><td className="border border-white/10 px-3 py-1.5 text-center text-yellow-300 font-bold">0</td></tr></tbody></table></div>
              <p className="text-xs text-cyan-200/60 mt-2">Titik: (0, 5) dan (5, 0)</p>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-400/30 rounded-xl p-4">
              <p className="text-sm font-bold text-emerald-300 mb-3">② Tabel nilai untuk <InlineMath math="x - y = 1"/></p>
              <div className="overflow-x-auto"><table className="w-full text-sm font-mono border-collapse"><thead><tr className="bg-emerald-900/40"><th className="border border-emerald-500/30 px-3 py-1.5 text-emerald-200">x</th><th className="border border-emerald-500/30 px-3 py-1.5 text-emerald-200">0</th><th className="border border-emerald-500/30 px-3 py-1.5 text-emerald-200">1</th></tr></thead><tbody><tr className="bg-white/5"><td className="border border-white/10 px-3 py-1.5 text-center text-white font-bold">y</td><td className="border border-white/10 px-3 py-1.5 text-center text-yellow-300 font-bold">−1</td><td className="border border-white/10 px-3 py-1.5 text-center text-yellow-300 font-bold">0</td></tr></tbody></table></div>
              <p className="text-xs text-emerald-200/60 mt-2">Titik: (0, −1) dan (1, 0)</p>
            </div>
            <div className="bg-blue-950/50 rounded-xl border border-blue-400/30 p-3">
              <p className="text-sm font-bold text-white mb-2 text-center">③ Grafik Kedua Garis</p>
              <GrafikSPLDV eq1="x+y=5" eq2="x-y=1" xp={3} yp={2}/>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-700/20 border-2 border-amber-400/60 p-4">
              <div className="flex items-center gap-2 mb-2"><span className="bg-amber-400 text-black text-xs font-black px-2 py-0.5 rounded-full font-display">🔍 MEMERIKSA HASIL</span></div>
              <p className="text-sm text-white/80 font-body mb-2">Titik potong = <span className="text-yellow-300 font-black font-mono">(3, 2)</span></p>
              <div className="font-mono text-sm space-y-1">
                <p className="text-white"><span className="text-amber-300">P1:</span> 3 + 2 = 5 ✓</p>
                <p className="text-white"><span className="text-amber-300">P2:</span> 3 − 2 = 1 ✓</p>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-2 border-emerald-400/60 p-3">
              <p className="text-base font-black text-emerald-300 font-display">✅ HP = {"{(3, 2)}"}</p>
            </div>
          </div>
        </div>

        {/* Kasus 1 */}
        <SectionHeader label="Kasus 1 — Metode Grafik: x + y = 5 dan x − y = 1" color="cyan"/>
        <div className="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/50 to-indigo-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-blue-200/80 mb-4">Lengkapi tabel nilai dan tentukan titik potong grafik!</p>
          <div className="space-y-4">
            <div className="bg-cyan-900/40 border border-cyan-400/30 rounded-xl p-4">
              <p className="text-sm font-bold text-cyan-300 mb-3">Tabel nilai untuk <InlineMath math="x + y = 5"/></p>
              <div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="bg-cyan-900/40"><th className="border border-cyan-500/30 px-3 py-1.5 text-cyan-200 font-mono">x</th><th className="border border-cyan-500/30 px-3 py-1.5 text-cyan-200 font-mono">0</th><th className="border border-cyan-500/30 px-3 py-1.5 text-cyan-200 font-mono">5</th></tr></thead><tbody>
                <tr className="bg-white/5"><td className="border border-white/10 px-3 py-2 text-center text-white font-bold font-mono">y</td><td className="border border-white/10 px-3 py-2 text-center"><B id="k1_t1y0" w="w-14"/></td><td className="border border-white/10 px-3 py-2 text-center"><B id="k1_t1y1" w="w-14"/></td></tr>
              </tbody></table></div>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-400/30 rounded-xl p-4">
              <p className="text-sm font-bold text-emerald-300 mb-3">Tabel nilai untuk <InlineMath math="x - y = 1"/></p>
              <div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="bg-emerald-900/40"><th className="border border-emerald-500/30 px-3 py-1.5 text-emerald-200 font-mono">x</th><th className="border border-emerald-500/30 px-3 py-1.5 text-emerald-200 font-mono">0</th><th className="border border-emerald-500/30 px-3 py-1.5 text-emerald-200 font-mono">1</th></tr></thead><tbody>
                <tr className="bg-white/5"><td className="border border-white/10 px-3 py-2 text-center text-white font-bold font-mono">y</td><td className="border border-white/10 px-3 py-2 text-center"><B id="k1_t2y0" w="w-14"/></td><td className="border border-white/10 px-3 py-2 text-center"><B id="k1_t2y1" w="w-14"/></td></tr>
              </tbody></table></div>
            </div>
            <CK sectionKey="k1tabel"/>
            <div className="bg-blue-950/50 rounded-xl border border-blue-400/30 p-3">
              <p className="text-sm font-bold text-white mb-2 text-center">Grafik Kedua Garis</p>
              <GrafikSPLDV eq1="x+y=5" eq2="x-y=1" xp={3} yp={2}/>
            </div>
            <div className="rounded-xl bg-amber-900/40 border border-amber-400/30 p-4">
              <p className="text-sm font-bold text-amber-300 mb-3">Dari grafik, titik potong kedua garis:</p>
              <div className="flex flex-wrap items-center gap-3 font-body text-sm">
                <span className="text-white/70">Titik potong =</span><B id="k1_titik" w="w-28"/>
                <span className="text-white/70 ml-2">Himpunan Penyelesaian =</span><B id="k1_hp" w="w-28"/>
              </div>
              <CK sectionKey="k1titik"/>
            </div>
          </div>
        </div>

        {/* Kasus 2 */}
        <SectionHeader label="Kasus 2 — Metode Grafik: 2x + y = 6 dan x − y = 0" color="emerald"/>
        <div className="rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-900/50 to-teal-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-emerald-200/80 mb-4">Lengkapi tabel nilai dan tentukan titik potong!</p>
          <div className="space-y-4">
            <div className="bg-teal-900/40 border border-teal-400/30 rounded-xl p-4">
              <p className="text-sm font-bold text-teal-300 mb-3">Tabel nilai untuk <InlineMath math="2x + y = 6"/></p>
              <div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="bg-teal-900/40"><th className="border border-teal-500/30 px-3 py-1.5 text-teal-200 font-mono">x</th><th className="border border-teal-500/30 px-3 py-1.5 text-teal-200 font-mono">0</th><th className="border border-teal-500/30 px-3 py-1.5 text-teal-200 font-mono">3</th></tr></thead><tbody>
                <tr className="bg-white/5"><td className="border border-white/10 px-3 py-2 text-center text-white font-bold font-mono">y</td><td className="border border-white/10 px-3 py-2 text-center"><B id="k2_t1y0" w="w-14"/></td><td className="border border-white/10 px-3 py-2 text-center"><B id="k2_t1y1" w="w-14"/></td></tr>
              </tbody></table></div>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-400/30 rounded-xl p-4">
              <p className="text-sm font-bold text-emerald-300 mb-3">Tabel nilai untuk <InlineMath math="x - y = 0"/> (y = x)</p>
              <div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="bg-emerald-900/40"><th className="border border-emerald-500/30 px-3 py-1.5 text-emerald-200 font-mono">x</th><th className="border border-emerald-500/30 px-3 py-1.5 text-emerald-200 font-mono">0</th><th className="border border-emerald-500/30 px-3 py-1.5 text-emerald-200 font-mono">2</th></tr></thead><tbody>
                <tr className="bg-white/5"><td className="border border-white/10 px-3 py-2 text-center text-white font-bold font-mono">y</td><td className="border border-white/10 px-3 py-2 text-center"><B id="k2_t2y0" w="w-14"/></td><td className="border border-white/10 px-3 py-2 text-center"><B id="k2_t2y1" w="w-14"/></td></tr>
              </tbody></table></div>
            </div>
            <CK sectionKey="k2tabel"/>
            <div className="rounded-xl bg-amber-900/40 border border-amber-400/30 p-4">
              <p className="text-sm font-bold text-amber-300 mb-3">Dari grafik, titik potong kedua garis:</p>
              <div className="flex flex-wrap items-center gap-3 font-body text-sm">
                <span className="text-white/70">Titik potong =</span><B id="k2_titik" w="w-28"/>
                <span className="text-white/70 ml-2">HP =</span><B id="k2_hp" w="w-28"/>
              </div>
              <CK sectionKey="k2titik"/>
            </div>
          </div>
        </div>

        {/* Kasus 3 */}
        <SectionHeader label="Kasus 3 — Metode Grafik: 3x + y = 9 dan x + y = 5" color="amber"/>
        <div className="rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-900/50 to-orange-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-amber-200/80 mb-4">Lengkapi tabel nilai dan tentukan titik potong!</p>
          <div className="space-y-4">
            <div className="bg-orange-900/40 border border-orange-400/30 rounded-xl p-4">
              <p className="text-sm font-bold text-orange-300 mb-3">Tabel nilai untuk <InlineMath math="3x + y = 9"/></p>
              <div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="bg-orange-900/40"><th className="border border-orange-500/30 px-3 py-1.5 text-orange-200 font-mono">x</th><th className="border border-orange-500/30 px-3 py-1.5 text-orange-200 font-mono">0</th><th className="border border-orange-500/30 px-3 py-1.5 text-orange-200 font-mono">3</th></tr></thead><tbody>
                <tr className="bg-white/5"><td className="border border-white/10 px-3 py-2 text-center text-white font-bold font-mono">y</td><td className="border border-white/10 px-3 py-2 text-center"><B id="k3_t1y0" w="w-14"/></td><td className="border border-white/10 px-3 py-2 text-center"><B id="k3_t1y1" w="w-14"/></td></tr>
              </tbody></table></div>
            </div>
            <div className="bg-amber-900/40 border border-amber-400/30 rounded-xl p-4">
              <p className="text-sm font-bold text-amber-300 mb-3">Tabel nilai untuk <InlineMath math="x + y = 5"/></p>
              <div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><thead><tr className="bg-amber-900/40"><th className="border border-amber-500/30 px-3 py-1.5 text-amber-200 font-mono">x</th><th className="border border-amber-500/30 px-3 py-1.5 text-amber-200 font-mono">0</th><th className="border border-amber-500/30 px-3 py-1.5 text-amber-200 font-mono">5</th></tr></thead><tbody>
                <tr className="bg-white/5"><td className="border border-white/10 px-3 py-2 text-center text-white font-bold font-mono">y</td><td className="border border-white/10 px-3 py-2 text-center"><B id="k3_t2y0" w="w-14"/></td><td className="border border-white/10 px-3 py-2 text-center"><B id="k3_t2y1" w="w-14"/></td></tr>
              </tbody></table></div>
            </div>
            <CK sectionKey="k3tabel"/>
            <div className="rounded-xl bg-amber-900/40 border border-amber-400/30 p-4">
              <p className="text-sm font-bold text-amber-300 mb-3">Dari grafik, titik potong kedua garis:</p>
              <div className="flex flex-wrap items-center gap-3 font-body text-sm">
                <span className="text-white/70">Titik potong =</span><B id="k3_titik" w="w-28"/>
                <span className="text-white/70 ml-2">HP =</span><B id="k3_hp" w="w-28"/>
              </div>
              <CK sectionKey="k3titik"/>
            </div>
          </div>
        </div>

        {/* Kasus 4 */}
        <SectionHeader label="Kasus 4 — Model dari Cerita dan Metode Grafik" color="violet"/>
        <div className="rounded-2xl border-2 border-violet-400/40 bg-gradient-to-br from-violet-900/50 to-purple-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-violet-200/80 mb-4 leading-relaxed">
            Jumlah dua bilangan adalah <strong className="text-yellow-300">10</strong>. Selisih kedua bilangan tersebut adalah <strong className="text-yellow-300">4</strong> (bilangan pertama lebih besar). Tentukan kedua bilangan tersebut!
          </p>
          <div className="bg-violet-950/40 border border-violet-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-violet-300 mb-3">📐 Buat Model SPLDV (misal bilangan: x dan y)</p>
            <div className="space-y-3 font-body text-sm">
              <div className="flex flex-wrap items-center gap-2 text-white/85">
                <span className="text-violet-300 font-bold">Persamaan 1 (jumlah):</span><B id="k4_p1" w="w-36" mono={false}/>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-white/85">
                <span className="text-violet-300 font-bold">Persamaan 2 (selisih):</span><B id="k4_p2" w="w-36" mono={false}/>
              </div>
            </div>
          </div>
          <div className="bg-purple-950/40 border border-purple-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-purple-300 mb-3">📊 Dari grafik kedua persamaan, titik potong:</p>
            <div className="flex flex-wrap items-center gap-3 font-body text-sm">
              <span className="text-white/70">Bilangan pertama (x) =</span><B id="k4_jawab_x" w="w-14"/>
              <span className="text-white/70 ml-2">Bilangan kedua (y) =</span><B id="k4_jawab_y" w="w-14"/>
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-2 border-emerald-400/60 p-3">
            <p className="text-sm font-black text-emerald-300 font-display">✅ Verifikasi: 7 + 3 = 10 ✓ dan 7 − 3 = 4 ✓</p>
          </div>
          <CK sectionKey="k4"/>
        </div>

        {/* Kesimpulan */}
        <div className="rounded-3xl border-2 border-cyan-400/40 bg-gradient-to-br from-cyan-900/50 via-blue-900/40 to-violet-900/40 p-6 mb-6 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-3 mb-4"><span className="text-3xl">✨</span><h2 className="font-display text-lg font-black text-cyan-200 tracking-wide uppercase">Kesimpulan Metode Grafik</h2></div>
          {[
            { icon:"📈", title:"Visual & Intuitif", body:"Metode grafik memperlihatkan solusi secara visual — titik potong dua garis adalah jawaban dari SPLDV.", tc:"text-cyan-300", bc:"from-cyan-800/40 to-blue-800/30 border-cyan-400/30" },
            { icon:"⚠️", title:"Keterbatasan", body:"Kurang akurat untuk jawaban berupa pecahan. Cocok untuk nilai bulat yang mudah dibaca dari grafik.", tc:"text-amber-300", bc:"from-amber-800/40 to-orange-800/30 border-amber-400/30" },
            { icon:"🔑", title:"Cara Efisien", body:"Gunakan titik (x=0) dan (y=0) untuk menentukan dua titik yang cukup menggambar setiap garis.", tc:"text-emerald-300", bc:"from-emerald-800/40 to-teal-800/30 border-emerald-400/30" },
            { icon:"🌟", title:"Refleksi", body:"Memahami metode grafik memperkuat intuisi geometri kita — persamaan bukan sekadar angka, tapi juga gambar!", tc:"text-violet-300", bc:"from-violet-800/40 to-purple-800/30 border-violet-400/30" },
          ].map(({icon,title,body,tc,bc})=>(
            <div key={title} className={`rounded-2xl bg-gradient-to-br ${bc} border p-4 mb-3 flex gap-3 items-start`}>
              <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
              <div><p className={`font-display text-sm font-black mb-1 ${tc}`}>{title}</p><p className="text-white/80 font-body text-sm leading-relaxed">{body}</p></div>
            </div>
          ))}
        </div>

        {/* POSTES */}
        <div className="mb-6">
          <button onClick={()=>setPostesOpen(v=>!v)} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-rose-400/60 bg-gradient-to-r from-rose-600/30 via-pink-600/20 to-orange-600/20 shadow-[0_0_24px_rgba(244,63,94,0.2)] hover:opacity-90 active:scale-[0.99] transition-all">
            <div className="flex items-center gap-3"><span className="text-2xl">🎮</span><div className="text-left"><p className="font-display text-sm font-black text-rose-200 uppercase tracking-wide">POSTES — METODE GRAFIK</p><p className="font-body text-xs text-rose-300/70 mt-0.5">Ayo ukur pemahamanmu dengan memilih salah satu game!</p></div></div>
            {postesOpen?<ChevronUp className="text-rose-300 shrink-0" size={20}/>:<div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400 animate-pulse"/><ChevronDown className="text-rose-300 shrink-0" size={20}/></div>}
          </button>
          {postesOpen && (
            <div className="mt-3 rounded-2xl border border-rose-400/25 bg-gradient-to-br from-rose-950/50 to-slate-900/60 p-4">
              <p className="font-body text-xs text-white/50 text-center mb-4">Pilih mode game favoritmu!</p>
              <div className="grid grid-cols-3 gap-2">
                {POSTES_GAMES.map(g=>(
                  <button key={g.id} onClick={()=>navigate(`/math-game-arena/kelas-8/spldv/metode-grafik/${g.id}`)} className={`rounded-xl border-2 bg-gradient-to-br ${g.bg} p-3 text-center active:scale-95 transition-all hover:brightness-110`} style={{boxShadow:`0 0 16px ${g.glow}`}}>
                    <p className="text-2xl mb-1">{g.emoji}</p><p className="font-body text-[10px] text-white/85 font-semibold leading-tight">{g.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Kesan */}
        <div className="mb-6">
          <button onClick={()=>setKesanOpen(v=>!v)} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-cyan-400/60 bg-gradient-to-r from-cyan-600/30 via-teal-600/20 to-blue-600/20 shadow-[0_0_24px_rgba(6,182,212,0.2)] hover:opacity-90 active:scale-[0.99] transition-all">
            <div className="flex items-center gap-3"><span className="text-2xl">✍️</span><div className="text-left"><p className="font-display text-sm font-black text-cyan-200 uppercase tracking-wide">Kesanku Belajar Hari Ini</p><p className="font-body text-xs text-cyan-300/70 mt-0.5">Tuliskan kesanmu setelah mengerjakan LKPD ini!</p></div></div>
            {kesanOpen?<ChevronUp className="text-cyan-300 shrink-0" size={20}/>:<div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"/><ChevronDown className="text-cyan-300 shrink-0" size={20}/></div>}
          </button>
          {kesanOpen && (
            <div className="mt-3 rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-cyan-950/50 to-slate-900/60 p-5 space-y-4">
              {[
                {label:"1. Apa yang paling menarik dari metode grafik?", color:"cyan"},
                {label:"2. Apa kelemahan metode grafik menurutmu?", color:"violet"},
                {label:"3. Apa yang ingin kamu pelajari lebih lanjut setelah ini?", color:"emerald"},
              ].map(({label,color})=>(
                <div key={label}>
                  <label className={`block font-body text-sm font-semibold text-${color}-300 mb-2`}>{label}</label>
                  <textarea rows={3} placeholder="Tuliskan jawabanmu di sini..." className={`w-full rounded-xl border-2 border-dashed border-${color}-400/50 bg-white/5 text-white placeholder-white/25 font-body text-sm px-4 py-3 outline-none focus:border-${color}-300 resize-none transition-all duration-200 leading-relaxed`}/>
                </div>
              ))}
              <div>
                <label className="block font-body text-sm font-semibold text-amber-300 mb-3">4. Seberapa paham kamu dengan materi hari ini?</label>
                <div className="grid grid-cols-4 gap-2">
                  {[{emoji:"😕",label:"Belum Paham",color:"border-red-400/50 bg-red-900/20 hover:bg-red-900/40"},{emoji:"🙂",label:"Cukup Paham",color:"border-yellow-400/50 bg-yellow-900/20 hover:bg-yellow-900/40"},{emoji:"😊",label:"Paham",color:"border-blue-400/50 bg-blue-900/20 hover:bg-blue-900/40"},{emoji:"🤩",label:"Sangat Paham",color:"border-emerald-400/50 bg-emerald-900/20 hover:bg-emerald-900/40"}].map(({emoji,label,color})=>(
                    <button key={label} type="button" className={`rounded-xl border-2 ${color} p-3 text-center transition-all duration-200 active:scale-95`} onClick={e=>{const p=(e.currentTarget as HTMLElement).parentElement!;p.querySelectorAll("button").forEach(b=>b.classList.remove("ring-2","ring-white/60","scale-105"));(e.currentTarget as HTMLElement).classList.add("ring-2","ring-white/60","scale-105");}}>
                      <p className="text-2xl mb-1">{emoji}</p><p className="font-body text-xs text-white/80 font-semibold leading-tight">{label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Daftar Pustaka */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5 mb-6">
          <p className="text-sm font-black text-white/80 font-display mb-3 tracking-wide uppercase">📚 Daftar Pustaka</p>
          <div className="flex gap-2 items-start"><span className="text-white/40 text-xs font-mono mt-0.5 shrink-0">•</span><p className="text-xs text-white/60 font-body leading-relaxed"><span className="font-semibold text-white/75">Sumber Referensi Internet:</span>{" "}<a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 transition-colors break-all">https://gemini.google.com/app</a></p></div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-yellow-500/20 to-amber-500/15 border border-yellow-400/40 p-4 text-center mb-6">
          <p className="text-yellow-300 font-display font-black text-base mb-1">🏆 Selamat! Kamu Telah Menguasai Metode Grafik!</p>
          <p className="text-white/75 font-body text-sm leading-relaxed">Terus berlatih menggambar grafik dan mencari titik potong. Visualisasi matematika adalah kekuatan yang luar biasa! 💪</p>
        </div>
        <div className="text-center"><button onClick={()=>window.history.back()} className="text-sm text-white/50 hover:text-cyan-400 transition-colors font-body">← Kembali ke menu SPLDV</button></div>
      </div>
    </div>
    </PageCtx.Provider>
  );
};

export default MetodeGrafikLKPDPage;
