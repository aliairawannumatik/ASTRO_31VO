import { useState, createContext, useContext, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { ChevronDown, ChevronUp, Lightbulb, BookOpen } from "lucide-react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

function normalize(s: string) { return s.toLowerCase().replace(/\s+/g, " ").trim(); }
function checkAnswer(val: string, accepted: string[]): boolean {
  return accepted.some(a => normalize(a) === normalize(val));
}

const ANSWERS: Record<string, string[]> = {
  /* Kasus 1 — 2x − y = 4 dan x + y = 5 */
  k1_isolated: ["x = (y + 4) / 2", "x = y/2 + 2", "2x = y + 4", "x = (4+y)/2"],
  k1_subst: ["y + 4", "4 + y"],
  k1_eq: ["2y + 4 + 2y = 10", "4 + 2y = 10 - y", "3y = 6"],
  k1_y: ["2"],
  k1_x: ["3"],
  k1_cek1: ["4", "2(3)−2=4"],
  k1_cek2: ["5", "3+2=5"],
  k1_hp: ["{(3, 2)}", "(3, 2)", "3 dan 2"],

  /* Kasus 2 — 3x + 2y = 12 dan x − y = 1 */
  k2_isolated: ["x = y + 1", "x = 1 + y"],
  k2_subst: ["y + 1", "1 + y"],
  k2_eq: ["3(y+1) + 2y = 12", "3y + 3 + 2y = 12", "5y = 9"],
  k2_y: ["9/5", "1,8", "1.8"],
  k2_x: ["14/5", "2,8", "2.8"],
  k2_hp: ["{(2,8; 1,8)}", "(2.8, 1.8)", "x=2,8 y=1,8"],

  /* Kasus 3 — 2x + y = 5 dan 3x − 2y = 11 */
  k3_isolated: ["y = 5 − 2x", "y = 5 - 2x", "y = −2x + 5"],
  k3_subst: ["5 − 2x", "5 - 2x"],
  k3_expand: ["15 − 6x − 4x", "15 - 6x - 4x", "15 - 10x"],
  k3_x: ["3"],
  k3_y: ["-1", "−1"],
  k3_hp: ["{(3, -1)}", "(3, -1)", "(3, −1)"],

  /* Kasus 4 — Kontekstual */
  k4_var1: ["x", "a", "harga apel"],
  k4_var2: ["y", "b", "harga jeruk"],
  k4_p1: ["2x + 3y = 13000", "2x + 3y = 13.000"],
  k4_p2: ["x + y = 5000", "x + y = 5.000"],
  k4_isolated: ["x = 5000 − y", "x = 5.000 − y"],
  k4_x: ["2000", "2.000"],
  k4_y: ["3000", "3.000"],
};

const SECTIONS: Record<string, string[]> = {
  k1step1: ["k1_isolated","k1_subst","k1_eq","k1_y"],
  k1step2: ["k1_x","k1_cek1","k1_cek2"],
  k1hp: ["k1_hp"],
  k2step1: ["k2_isolated","k2_subst","k2_eq","k2_y"],
  k2hp: ["k2_x","k2_hp"],
  k3step1: ["k3_isolated","k3_subst","k3_expand","k3_x","k3_y"],
  k3hp: ["k3_hp"],
  k4: ["k4_var1","k4_var2","k4_p1","k4_p2","k4_isolated","k4_x","k4_y"],
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
  const ids = SECTIONS[sectionKey]??[];
  const checked = ids.some(id=>res[id]!==null&&res[id]!==undefined);
  const correct = ids.filter(id=>res[id]===true).length;
  return (
    <div className="flex items-center gap-3 mt-4">
      <button onClick={()=>onCek(sectionKey)} className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold font-display tracking-wide hover:opacity-90 active:scale-95 transition-all shadow-[0_0_16px_rgba(6,182,212,0.4)]">Cek Jawaban</button>
      {checked && <span className={`text-sm font-bold font-display ${correct===ids.length?"text-emerald-400":"text-amber-400"}`}>{correct}/{ids.length} benar</span>}
    </div>
  );
}
const B = ({ id, w, mono }: { id:string; w?:string; mono?:boolean }) => <Blank id={id} w={w} mono={mono}/>;
const CK = ({ sectionKey }: { sectionKey:string }) => <CekButton sectionKey={sectionKey}/>;

function SectionHeader({ label, color="cyan" }: { label:string; color?:string }) {
  const colors: Record<string,string> = {
    cyan:    "from-cyan-500/50 to-blue-600/40 border-cyan-400/60 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.2)]",
    emerald: "from-emerald-500/50 to-teal-600/40 border-emerald-400/60 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    violet:  "from-violet-500/50 to-purple-600/40 border-violet-400/60 text-violet-100 shadow-[0_0_20px_rgba(139,92,246,0.2)]",
    amber:   "from-amber-500/50 to-orange-600/40 border-amber-400/60 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.2)]",
  };
  return <div className={`rounded-2xl p-4 mb-4 bg-gradient-to-br border ${colors[color]}`}><p className={`font-display text-base font-black tracking-wide ${colors[color].split(" ").slice(-1)}`}>{label}</p></div>;
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

const MetodeSubstitusiLKPDPage = () => {
  const [vals, setVals] = useState<Record<string,string>>({});
  const [res, setRes] = useState<Record<string,boolean|null>>({});
  const [materiOpen, setMateriOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["langkah"]);
  const [postesOpen, setPostesOpen] = useState(false);
  const [kesanOpen, setKesanOpen] = useState(false);
  const navigate = useNavigate();
  const valsRef = useRef(vals);
  valsRef.current = vals;
  const toggleSec = (id:string) => setOpenSections(p => p.includes(id)?p.filter(s=>s!==id):[...p,id]);

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
          <p className="font-display text-xs font-bold tracking-widest text-cyan-300 uppercase mb-1">Lembar Kerja Peserta Didik (LKPD 3)</p>
          <h1 className="font-display text-xl md:text-2xl font-black text-white mb-2 drop-shadow-lg">Penyelesaian SPLDV<br/>Dengan Metode Substitusi</h1>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-body text-white/70">
            <p>Mata Pelajaran: <span className="text-white font-bold">Matematika</span></p>
            <p>Kelas / Semester: <span className="text-white font-bold">VIII / I</span></p>
            <p>Alokasi Waktu: <span className="text-white font-bold">2 × 40 menit</span></p>
            <p>Satuan Pendidikan: <span className="text-white font-bold">SMP</span></p>
          </div>
          <p className="mt-3 text-sm text-white/80 font-body leading-relaxed text-left">
            <span className="text-cyan-300 font-bold">Tujuan Pembelajaran :</span> Peserta didik dapat menyelesaikan SPLDV dengan metode substitusi melalui langkah-langkah: mengisolasi satu variabel, mensubstitusikan ke persamaan lain, dan menentukan himpunan penyelesaian.
          </p>
        </div>

        {/* Panduan Materi */}
        <div className="mb-6">
          <button onClick={()=>setMateriOpen(v=>!v)} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-yellow-400/60 bg-gradient-to-r from-yellow-600/30 via-amber-600/20 to-orange-600/20 shadow-[0_0_24px_rgba(234,179,8,0.2)] hover:opacity-90 active:scale-[0.99] transition-all">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div className="text-left">
                <p className="font-display text-sm font-black text-yellow-200 tracking-wide uppercase">Panduan Materi — Metode Substitusi</p>
                <p className="font-body text-xs text-yellow-300/70 mt-0.5">{materiOpen?"Tutup panduan materi":"Buka untuk membaca teori sebelum mengerjakan"}</p>
              </div>
            </div>
            {materiOpen?<ChevronUp className="w-5 h-5 text-yellow-300 shrink-0"/>:<div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse"/><ChevronDown className="w-5 h-5 text-yellow-300 shrink-0"/></div>}
          </button>
          {materiOpen && (
            <div className="mt-3 rounded-2xl border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-950/60 via-amber-950/50 to-orange-950/40 overflow-hidden">
              <div className="border-b border-yellow-400/20">
                <button onClick={()=>toggleSec("langkah")} className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-400"/><span className="font-body text-sm font-semibold text-white">🔄 Ide Dasar Metode Substitusi</span></div>
                  {openSections.includes("langkah")?<ChevronUp className="w-4 h-4 text-yellow-300"/>:<ChevronDown className="w-4 h-4 text-yellow-300"/>}
                </button>
                {openSections.includes("langkah") && (
                  <div className="px-5 pb-5 space-y-4">
                    <p className="font-body text-sm text-white/80 leading-relaxed">Metode substitusi bekerja dengan <strong className="text-cyan-300">menggantikan</strong> (men-substitusi-kan) salah satu variabel ke persamaan lain. Langkahnya: nyatakan satu variabel dalam bentuk variabel lain, lalu masukkan ke persamaan kedua.</p>
                    <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4 space-y-2 text-sm font-body text-white/80">
                      <p className="font-bold text-cyan-300 text-xs uppercase mb-1">🔑 Langkah-Langkah</p>
                      {[
                        "Pilih salah satu persamaan, nyatakan satu variabel dalam variabel lain (misal: x = ... atau y = ...).",
                        "Substitusikan (gantikan) ke persamaan yang lain.",
                        "Selesaikan persamaan satu variabel yang diperoleh.",
                        "Substitusikan kembali nilainya untuk mencari variabel yang lain.",
                        "Periksa kembali solusi ke kedua persamaan awal.",
                      ].map((s,i)=><div key={i} className="flex gap-2 items-start"><span className="text-cyan-400 font-black shrink-0">{i+1}.</span><p>{s}</p></div>)}
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <p className="font-body text-sm text-yellow-200"><strong>Tips:</strong> Pilih persamaan yang salah satu koefisien variabelnya = 1 untuk memudahkan isolasi!</p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <button onClick={()=>toggleSec("rangkuman")} className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-yellow-400"/><span className="font-body text-sm font-semibold text-white">📋 Rangkuman</span></div>
                  {openSections.includes("rangkuman")?<ChevronUp className="w-4 h-4 text-yellow-300"/>:<ChevronDown className="w-4 h-4 text-yellow-300"/>}
                </button>
                {openSections.includes("rangkuman") && (
                  <div className="px-5 pb-5 space-y-3">
                    {[
                      { poin:"Isolasi satu variabel dari persamaan yang lebih sederhana.", icon:"1️⃣" },
                      { poin:"Substitusikan ekspresi tersebut ke persamaan lainnya → persamaan satu variabel.", icon:"2️⃣" },
                      { poin:"Selesaikan, lalu substitusikan balik untuk variabel kedua.", icon:"3️⃣" },
                      { poin:"Metode substitusi sangat efektif jika salah satu koefisien variabel = 1.", icon:"✅" },
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

        {/* Contoh Pengantar */}
        <div className="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/50 to-indigo-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="font-bold text-white text-lg mb-1">Contoh: Metode Substitusi</p>
          <p className="text-sm text-blue-200/80 mb-4">Tentukan himpunan penyelesaian dari <InlineMath math="x + y = 5"/> dan <InlineMath math="x - y = 1"/>.</p>
          <div className="space-y-4">
            <div className="rounded-xl bg-cyan-900/40 border border-cyan-400/30 p-4">
              <p className="text-sm font-bold text-cyan-300 mb-2">① Isolasi x dari persamaan 1:</p>
              <p className="font-mono text-sm text-white">x + y = 5  →  <span className="text-yellow-300 font-black">x = 5 − y</span></p>
            </div>
            <div className="rounded-xl bg-emerald-900/40 border border-emerald-400/30 p-4">
              <p className="text-sm font-bold text-emerald-300 mb-2">② Substitusikan x = 5 − y ke persamaan 2:</p>
              <div className="font-mono text-sm text-white space-y-1">
                <p>(<span className="text-yellow-300 font-black">5 − y</span>) − y = 1</p>
                <p>5 − 2y = 1</p>
                <p>−2y = −4</p>
                <p className="text-yellow-300 font-black text-base">y = 2</p>
              </div>
            </div>
            <div className="rounded-xl bg-teal-900/40 border border-teal-400/30 p-4">
              <p className="text-sm font-bold text-teal-300 mb-2">③ Substitusikan y = 2 ke x = 5 − y:</p>
              <p className="font-mono text-sm text-white">x = 5 − 2 = <span className="text-yellow-300 font-black text-base">3</span></p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-700/20 border-2 border-amber-400/60 p-4">
              <div className="flex items-center gap-2 mb-2"><span className="bg-amber-400 text-black text-xs font-black px-2 py-0.5 rounded-full font-display">🔍 MEMERIKSA HASIL KEMBALI</span></div>
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
        <SectionHeader label="Kasus 1 — Substitusi: 2x − y = 4 dan x + y = 5" color="cyan"/>
        <div className="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/50 to-indigo-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-blue-200/80 mb-4">Tentukan himpunan penyelesaian dari <InlineMath math="2x - y = 4"/> dan <InlineMath math="x + y = 5"/>.</p>

          <div className="rounded-xl bg-cyan-900/40 border border-cyan-400/30 p-4 mb-4">
            <p className="text-sm font-bold text-cyan-300 mb-3">① Dari persamaan 2 (x + y = 5), isolasi x:</p>
            <div className="flex flex-wrap items-center gap-2 font-body text-sm">
              <span className="text-white/70">x =</span><B id="k1_isolated" w="w-40"/>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-900/40 border border-emerald-400/30 p-4 mb-4">
            <p className="text-sm font-bold text-emerald-300 mb-3">② Substitusikan ke persamaan 1 (2x − y = 4):</p>
            <div className="space-y-3 font-mono text-sm">
              <p className="flex flex-wrap items-center gap-2 text-white/80">
                <span>2(</span><B id="k1_subst" w="w-28"/><span>) − y = 4</span>
              </p>
              <div className="flex flex-wrap items-center gap-2 text-white/80">
                <span>Sederhanakan:</span><B id="k1_eq" w="w-44" mono={false}/>
              </div>
              <p className="flex flex-wrap items-center gap-2 text-white/80">
                <span className="text-yellow-300 font-black text-base">y =</span><B id="k1_y" w="w-14"/>
              </p>
            </div>
            <CK sectionKey="k1step1"/>
          </div>

          <div className="rounded-xl bg-teal-900/40 border border-teal-400/30 p-4 mb-4">
            <p className="text-sm font-bold text-teal-300 mb-3">③ Substitusikan y ke salah satu persamaan, cari x:</p>
            <div className="flex flex-wrap items-center gap-2 font-body text-sm">
              <span className="text-white/70">x =</span><B id="k1_x" w="w-14"/>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-700/20 border-2 border-amber-400/60 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3"><span className="bg-amber-400 text-black text-xs font-black px-2 py-0.5 rounded-full font-display">🔍 MEMERIKSA HASIL KEMBALI</span></div>
            <div className="space-y-2 font-mono text-sm">
              <p className="flex flex-wrap items-center gap-2 text-white/80">
                <span className="text-amber-300 font-bold text-xs">P1:</span> 2(<B id="k1_x" w="w-10"/>) − (<B id="k1_y" w="w-10"/>) = <B id="k1_cek1" w="w-14"/>
                <span className="text-white/50 text-xs">(harus 4)</span>
              </p>
              <p className="flex flex-wrap items-center gap-2 text-white/80">
                <span className="text-amber-300 font-bold text-xs">P2:</span> <B id="k1_x" w="w-10"/> + (<B id="k1_y" w="w-10"/>) = <B id="k1_cek2" w="w-14"/>
                <span className="text-white/50 text-xs">(harus 5)</span>
              </p>
            </div>
            <CK sectionKey="k1step2"/>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-2 border-emerald-400/60 p-4">
            <p className="text-base font-black text-emerald-300 font-display mb-2">✅ Kesimpulan:</p>
            <p className="text-white text-lg font-mono font-bold flex flex-wrap items-center gap-2">
              Himpunan penyelesaian = {"{"}(<B id="k1_x" w="w-14"/>, <B id="k1_y" w="w-14"/>){"}"}
            </p>
            <CK sectionKey="k1hp"/>
          </div>
        </div>

        {/* Kasus 2 */}
        <SectionHeader label="Kasus 2 — Substitusi: 3x + 2y = 12 dan x − y = 1" color="emerald"/>
        <div className="rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-900/50 to-teal-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-emerald-200/80 mb-4">Tentukan himpunan penyelesaian dari <InlineMath math="3x + 2y = 12"/> dan <InlineMath math="x - y = 1"/>.</p>

          <div className="rounded-xl bg-teal-900/40 border border-teal-400/30 p-4 mb-4">
            <p className="text-sm font-bold text-teal-300 mb-3">① Dari persamaan 2 (x − y = 1), isolasi x:</p>
            <div className="flex flex-wrap items-center gap-2 font-body text-sm">
              <span className="text-white/70">x =</span><B id="k2_isolated" w="w-36"/>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-900/40 border border-emerald-400/30 p-4 mb-4">
            <p className="text-sm font-bold text-emerald-300 mb-3">② Substitusikan ke persamaan 1 (3x + 2y = 12):</p>
            <div className="space-y-3 font-mono text-sm">
              <p className="flex flex-wrap items-center gap-2 text-white/80">
                <span>3(</span><B id="k2_subst" w="w-28"/><span>) + 2y = 12</span>
              </p>
              <div className="flex flex-wrap items-center gap-2 text-white/80">
                <span>Sederhanakan:</span><B id="k2_eq" w="w-44" mono={false}/>
              </div>
              <p className="flex flex-wrap items-center gap-2 text-white/80">
                <span className="text-yellow-300 font-black text-base">y =</span><B id="k2_y" w="w-14"/>
              </p>
            </div>
            <CK sectionKey="k2step1"/>
          </div>

          <div className="rounded-xl bg-teal-900/40 border border-teal-400/30 p-4 mb-4">
            <p className="text-sm font-bold text-teal-300 mb-3">③ Substitusikan y ke persamaan 2, cari x:</p>
            <div className="flex flex-wrap items-center gap-2 font-body text-sm">
              <span className="text-white/70">x =</span><B id="k2_x" w="w-14"/>
            </div>
            <CK sectionKey="k2hp"/>
          </div>
        </div>

        {/* Kasus 3 */}
        <SectionHeader label="Kasus 3 — Substitusi: 2x + y = 5 dan 3x − 2y = 11" color="amber"/>
        <div className="rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-900/50 to-orange-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-amber-200/80 mb-4">Tentukan himpunan penyelesaian dari <InlineMath math="2x + y = 5"/> dan <InlineMath math="3x - 2y = 11"/>.</p>

          <div className="rounded-xl bg-orange-900/40 border border-orange-400/30 p-4 mb-4">
            <p className="text-sm font-bold text-orange-300 mb-3">① Dari persamaan 1 (2x + y = 5), isolasi y:</p>
            <div className="flex flex-wrap items-center gap-2 font-body text-sm">
              <span className="text-white/70">y =</span><B id="k3_isolated" w="w-40"/>
            </div>
          </div>

          <div className="rounded-xl bg-amber-900/40 border border-amber-400/30 p-4 mb-4">
            <p className="text-sm font-bold text-amber-300 mb-3">② Substitusikan ke persamaan 2 (3x − 2y = 11):</p>
            <div className="space-y-3 font-mono text-sm">
              <p className="flex flex-wrap items-center gap-2 text-white/80">
                <span>3x − 2(</span><B id="k3_subst" w="w-28"/><span>) = 11</span>
              </p>
              <p className="flex flex-wrap items-center gap-2 text-white/80">
                <span>Distribusikan:</span><B id="k3_expand" w="w-44" mono={false}/>
              </p>
              <p className="flex flex-wrap items-center gap-2 text-white/80">
                <span className="text-yellow-300 font-black text-base">x =</span><B id="k3_x" w="w-14"/>
                <span className="ml-4">maka y =</span><B id="k3_y" w="w-14"/>
              </p>
            </div>
            <CK sectionKey="k3step1"/>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-2 border-emerald-400/60 p-4">
            <p className="text-base font-black text-emerald-300 font-display mb-2">✅ Kesimpulan:</p>
            <p className="text-white text-lg font-mono font-bold flex flex-wrap items-center gap-2">
              HP = {"{"}(<B id="k3_x" w="w-14"/>, <B id="k3_y" w="w-14"/>){"}"}
            </p>
            <CK sectionKey="k3hp"/>
          </div>
        </div>

        {/* Kasus 4 */}
        <SectionHeader label="Kasus 4 — Kontekstual: Harga Buah" color="violet"/>
        <div className="rounded-2xl border-2 border-violet-400/40 bg-gradient-to-br from-violet-900/50 to-purple-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-violet-200/80 mb-4 leading-relaxed">
            Ratna membeli <strong className="text-yellow-300">2 apel</strong> dan <strong className="text-yellow-300">3 jeruk</strong> seharga <strong className="text-white">Rp13.000</strong>. Harga 1 apel dan 1 jeruk adalah <strong className="text-white">Rp5.000</strong>. Tentukan harga masing-masing buah menggunakan metode substitusi!
          </p>
          <div className="bg-violet-950/40 border border-violet-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-violet-300 mb-3">📐 Pemisalan dan Model Matematika:</p>
            <div className="space-y-2 font-body text-sm text-white/85">
              <p>Misalkan harga 1 apel = <B id="k4_var1" w="w-28" mono={false}/> dan harga 1 jeruk = <B id="k4_var2" w="w-28" mono={false}/></p>
              <p className="flex flex-wrap items-center gap-2 mt-2">Persamaan 1: <B id="k4_p1" w="w-44" mono={false}/></p>
              <p className="flex flex-wrap items-center gap-2">Persamaan 2: <B id="k4_p2" w="w-44" mono={false}/></p>
            </div>
          </div>
          <div className="bg-purple-950/40 border border-purple-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-purple-300 mb-3">🔄 Isolasi x dari persamaan 2 (x + y = 5000):</p>
            <div className="flex flex-wrap items-center gap-2 font-body text-sm">
              <span className="text-white/70">x =</span><B id="k4_isolated" w="w-44"/>
            </div>
          </div>
          <div className="bg-indigo-950/40 border border-indigo-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-indigo-300 mb-3">✏️ Hasil substitusi:</p>
            <div className="flex flex-wrap items-center gap-4 font-body text-sm">
              <span className="text-white/70">Harga 1 apel = Rp <B id="k4_x" w="w-24"/></span>
              <span className="text-white/70">Harga 1 jeruk = Rp <B id="k4_y" w="w-24"/></span>
            </div>
          </div>
          <CK sectionKey="k4"/>
        </div>

        {/* Kesimpulan */}
        <div className="rounded-3xl border-2 border-cyan-400/40 bg-gradient-to-br from-cyan-900/50 via-blue-900/40 to-violet-900/40 p-6 mb-6 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-3 mb-4"><span className="text-3xl">✨</span><h2 className="font-display text-lg font-black text-cyan-200 tracking-wide uppercase">Kesimpulan Metode Substitusi</h2></div>
          {[
            { icon:"🔄", title:"Kekuatan Metode Substitusi", body:"Metode substitusi bagaikan memasukkan kunci ke lubang kunci — variabel pertama 'masuk' ke persamaan lain sehingga tersisa satu persamaan satu variabel yang mudah diselesaikan.", tc:"text-cyan-300", bc:"from-cyan-800/40 to-blue-800/30 border-cyan-400/30" },
            { icon:"💡", title:"Cocok untuk Koefisien 1", body:"Metode ini paling efisien ketika salah satu variabel memiliki koefisien 1, sehingga isolasi variabel tidak menghasilkan pecahan.", tc:"text-violet-300", bc:"from-violet-800/40 to-purple-800/30 border-violet-400/30" },
            { icon:"🎯", title:"Verifikasi Wajib", body:"Selalu substitusikan kembali solusi (x, y) ke kedua persamaan awal untuk memastikan keduanya terpenuhi.", tc:"text-emerald-300", bc:"from-emerald-800/40 to-teal-800/30 border-emerald-400/30" },
            { icon:"🌟", title:"Refleksi", body:"Metode substitusi mengajarkan kita pentingnya memilih langkah yang paling mudah terlebih dahulu — kecerdasan bukan tentang kecepatan, tapi tentang strategi!", tc:"text-amber-300", bc:"from-amber-800/40 to-orange-800/30 border-amber-400/30" },
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
            <div className="flex items-center gap-3"><span className="text-2xl">🎮</span><div className="text-left"><p className="font-display text-sm font-black text-rose-200 uppercase tracking-wide">POSTES — METODE SUBSTITUSI</p><p className="font-body text-xs text-rose-300/70 mt-0.5">Ayo ukur pemahamanmu dengan memilih salah satu game!</p></div></div>
            {postesOpen?<ChevronUp className="text-rose-300 shrink-0" size={20}/>:<div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400 animate-pulse"/><ChevronDown className="text-rose-300 shrink-0" size={20}/></div>}
          </button>
          {postesOpen && (
            <div className="mt-3 rounded-2xl border border-rose-400/25 bg-gradient-to-br from-rose-950/50 to-slate-900/60 p-4">
              <p className="font-body text-xs text-white/50 text-center mb-4">Pilih mode game favoritmu!</p>
              <div className="grid grid-cols-3 gap-2">
                {POSTES_GAMES.map(g=>(
                  <button key={g.id} onClick={()=>navigate(`/math-game-arena/kelas-8/spldv/metode-substitusi/${g.id}`)} className={`rounded-xl border-2 bg-gradient-to-br ${g.bg} p-3 text-center active:scale-95 transition-all hover:brightness-110`} style={{boxShadow:`0 0 16px ${g.glow}`}}>
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
              {[{label:"1. Apa yang paling kamu sukai dari metode substitusi?",color:"cyan"},{label:"2. Bagian mana yang menurutmu paling sulit? Mengapa?",color:"violet"},{label:"3. Apa yang ingin kamu pelajari lebih lanjut setelah ini?",color:"emerald"}].map(({label,color})=>(
                <div key={label}><label className={`block font-body text-sm font-semibold text-${color}-300 mb-2`}>{label}</label><textarea rows={3} placeholder="Tuliskan jawabanmu di sini..." className={`w-full rounded-xl border-2 border-dashed border-${color}-400/50 bg-white/5 text-white placeholder-white/25 font-body text-sm px-4 py-3 outline-none focus:border-${color}-300 resize-none transition-all duration-200 leading-relaxed`}/></div>
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

        <div className="rounded-2xl border border-white/15 bg-white/5 p-5 mb-6">
          <p className="text-sm font-black text-white/80 font-display mb-3 tracking-wide uppercase">📚 Daftar Pustaka</p>
          <div className="flex gap-2 items-start"><span className="text-white/40 text-xs font-mono mt-0.5 shrink-0">•</span><p className="text-xs text-white/60 font-body leading-relaxed"><span className="font-semibold text-white/75">Sumber Referensi Internet:</span>{" "}<a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 transition-colors break-all">https://gemini.google.com/app</a></p></div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-yellow-500/20 to-amber-500/15 border border-yellow-400/40 p-4 text-center mb-6">
          <p className="text-yellow-300 font-display font-black text-base mb-1">🏆 Selamat! Kamu Telah Menguasai Metode Substitusi!</p>
          <p className="text-white/75 font-body text-sm leading-relaxed">Teruslah berlatih dan jangan takut mencoba soal-soal baru. Setiap soal yang diselesaikan membuktikan kemampuanmu! 💪</p>
        </div>
        <div className="text-center"><button onClick={()=>window.history.back()} className="text-sm text-white/50 hover:text-cyan-400 transition-colors font-body">← Kembali ke menu SPLDV</button></div>
      </div>
    </div>
    </PageCtx.Provider>
  );
};

export default MetodeSubstitusiLKPDPage;
