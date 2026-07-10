import { useState, createContext, useContext, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { ChevronDown, ChevronUp, Lightbulb, BookOpen, BookMarked } from "lucide-react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

function normalize(s: string) { return s.toLowerCase().replace(/\s+/g, " ").trim(); }
function checkAnswer(val: string, accepted: string[]): boolean {
  const n = normalize(val);
  return accepted.some((a) => normalize(a) === n);
}

const ANSWERS: Record<string, string[]> = {
  /* Bagian A — Ciri PLDV */
  a1: ["dua variabel", "2 variabel", "dua", "2"],
  a2: ["satu", "1", "pangkat satu", "pangkat 1"],
  a3: ["real", "bilangan real", "nyata"],
  a4: ["tak hingga", "tak terhingga", "banyak", "lebih dari satu", "infinit"],

  /* Bagian B — Bentuk Umum SPLDV */
  b1: ["a", "koefisien x"],
  b2: ["b", "koefisien y"],
  b3: ["c", "konstanta"],
  b4: ["dua persamaan", "2 persamaan"],
  b5: ["dua variabel", "2 variabel"],

  /* Kasus 1 — Identifikasi SPLDV */
  k1a_p1: ["spldv", "ya", "iya", "benar"],
  k1a_p2: ["bukan spldv", "bukan", "tidak", "tidak, karena pangkat 2"],
  k1a_p3: ["spldv", "ya", "iya", "benar"],
  k1a_p4: ["bukan spldv", "bukan", "tidak", "tidak, karena satu variabel"],

  /* Kasus 2 — Tulis bentuk umum */
  k2_a1: ["3"], k2_b1: ["2"], k2_c1: ["12"],
  k2_a2: ["1", "1x"], k2_b2: ["-4", "−4"], k2_c2: ["7"],

  /* Kasus 3 — Hubungan PLDV dan SPLDV */
  k3_var1: ["x", "y"],
  k3_coef1: ["3"],
  k3_coef2: ["5"],
  k3_const: ["15"],
  k3_p1: ["pldv", "persamaan linear dua variabel"],
  k3_p2: ["spldv", "sistem persamaan linear dua variabel"],

  /* Kasus 4 — Model dari cerita */
  k4_var1: ["x", "harga pensil"],
  k4_var2: ["y", "harga buku"],
  k4_p1l: ["3x"], k4_p1r: ["2y"], k4_p1c: ["13.000", "13000"],
  k4_p2l: ["2x"], k4_p2r: ["y"], k4_p2c: ["8.000", "8000"],
};

const SECTIONS: Record<string, string[]> = {
  a: ["a1","a2","a3","a4"],
  b: ["b1","b2","b3","b4","b5"],
  k1a: ["k1a_p1","k1a_p2","k1a_p3","k1a_p4"],
  k2: ["k2_a1","k2_b1","k2_c1","k2_a2","k2_b2","k2_c2"],
  k3: ["k3_var1","k3_coef1","k3_coef2","k3_const","k3_p1","k3_p2"],
  k4: ["k4_var1","k4_var2","k4_p1l","k4_p1r","k4_p1c","k4_p2l","k4_p2r","k4_p2c"],
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
        className={`${w} min-w-0 ${border} ${bg} ${tc} rounded-md text-center text-sm outline-none px-1 py-1 transition-all duration-200 ${mono?"font-mono":"font-body"} placeholder-white/30 font-bold`} />
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
const B = ({ id, w, mono }: { id:string; w?:string; mono?:boolean }) => <Blank id={id} w={w} mono={mono} />;
const CK = ({ sectionKey }: { sectionKey:string }) => <CekButton sectionKey={sectionKey} />;

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

const POSTES_GAMES = [
  { id:"meteor",  emoji:"🚀", name:"Pesawat Tembak Meteor",  bg:"from-red-700/50 to-orange-700/40 border-red-400/50",     glow:"rgba(239,68,68,0.35)" },
  { id:"flappy",  emoji:"🛸", name:"Flappy Rocket",           bg:"from-cyan-700/50 to-blue-700/40 border-cyan-400/50",      glow:"rgba(6,182,212,0.35)" },
  { id:"tank",    emoji:"🎯", name:"Shoot Tank",              bg:"from-green-700/50 to-emerald-700/40 border-green-400/50", glow:"rgba(16,185,129,0.35)" },
  { id:"space",   emoji:"🌌", name:"Space Impact Math",       bg:"from-indigo-700/50 to-blue-900/40 border-indigo-400/50",  glow:"rgba(99,102,241,0.35)" },
  { id:"turtle",  emoji:"🐢", name:"Turtle Run Math",         bg:"from-teal-700/50 to-green-700/40 border-teal-400/50",    glow:"rgba(20,184,166,0.35)" },
  { id:"tetris",  emoji:"🧩", name:"Tetris Numatik",          bg:"from-pink-700/50 to-rose-700/40 border-pink-400/50",     glow:"rgba(236,72,153,0.35)" },
  { id:"snake",   emoji:"🐍", name:"Snake Matematika",        bg:"from-lime-700/50 to-green-800/40 border-lime-400/50",    glow:"rgba(132,204,22,0.35)" },
];

const DefinisiSPLDVLKPDPage = () => {
  const [vals, setVals] = useState<Record<string,string>>({});
  const [res, setRes] = useState<Record<string,boolean|null>>({});
  const [materiOpen, setMateriOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["pengertian"]);
  const [postesOpen, setPostesOpen] = useState(false);
  const [kesanOpen, setKesanOpen] = useState(false);
  const navigate = useNavigate();
  const valsRef = useRef(vals);
  valsRef.current = vals;
  const toggleSec = (id:string) => setOpenSections(p => p.includes(id) ? p.filter(s=>s!==id) : [...p,id]);

  const handleChange = useCallback((id:string, v:string) => {
    setVals(p=>({...p,[id]:v}));
    setRes(p=>({...p,[id]:null}));
  }, []);
  const handleCek = useCallback((sectionKey:string) => {
    const ids = SECTIONS[sectionKey] ?? [];
    const updates: Record<string,boolean|null> = {};
    ids.forEach(id => { updates[id] = checkAnswer(valsRef.current[id]??"", ANSWERS[id]??[]); });
    setRes(p=>({...p,...updates}));
  }, []);

  return (
    <PageCtx.Provider value={{ vals, res, onChange:handleChange, onCek:handleCek }}>
    <div className="relative min-h-screen flex flex-col gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/lkpd/kelas-8/spldv" />
      <div className="relative z-10 max-w-2xl w-full mx-auto px-4 pt-6 pb-24">

        {/* Header */}
        <div className="rounded-3xl border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-600/30 via-blue-700/25 to-violet-600/25 p-6 mb-6 text-center shadow-[0_0_40px_rgba(6,182,212,0.25)]">
          <p className="font-display text-xs font-bold tracking-widest text-cyan-300 uppercase mb-1">Lembar Kerja Peserta Didik (LKPD 1)</p>
          <h1 className="font-display text-xl md:text-2xl font-black text-white mb-2 drop-shadow-lg">Definisi dan Bentuk Umum SPLDV<br/>Beserta Kaitannya dengan PLDV</h1>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-body text-white/70">
            <p>Mata Pelajaran: <span className="text-white font-bold">Matematika</span></p>
            <p>Kelas / Semester: <span className="text-white font-bold">VIII / I</span></p>
            <p>Alokasi Waktu: <span className="text-white font-bold">2 × 40 menit</span></p>
            <p>Satuan Pendidikan: <span className="text-white font-bold">SMP</span></p>
          </div>
          <p className="mt-3 text-sm text-white/80 font-body leading-relaxed text-left">
            <span className="text-cyan-300 font-bold">Tujuan Pembelajaran :</span> Peserta didik dapat menjelaskan pengertian SPLDV, menuliskan bentuk umumnya, serta mengaitkan hubungan PLDV dengan SPLDV.
          </p>
        </div>

        {/* Panduan Materi */}
        <div className="mb-6">
          <button onClick={()=>setMateriOpen(v=>!v)} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-yellow-400/60 bg-gradient-to-r from-yellow-600/30 via-amber-600/20 to-orange-600/20 shadow-[0_0_24px_rgba(234,179,8,0.2)] hover:opacity-90 active:scale-[0.99] transition-all">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div className="text-left">
                <p className="font-display text-sm font-black text-yellow-200 tracking-wide uppercase">Panduan Materi — Definisi SPLDV</p>
                <p className="font-body text-xs text-yellow-300/70 mt-0.5">{materiOpen?"Tutup panduan materi":"Buka untuk membaca teori sebelum mengerjakan"}</p>
              </div>
            </div>
            {materiOpen ? <ChevronUp className="w-5 h-5 text-yellow-300 shrink-0"/> : <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse"/><ChevronDown className="w-5 h-5 text-yellow-300 shrink-0"/></div>}
          </button>

          {materiOpen && (
            <div className="mt-3 rounded-2xl border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-950/60 via-amber-950/50 to-orange-950/40 overflow-hidden">

              {/* Sub: Pengertian PLDV */}
              <div className="border-b border-yellow-400/20">
                <button onClick={()=>toggleSec("pengertian")} className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-400"/><span className="font-body text-sm font-semibold text-white">📐 Dari PLDV ke SPLDV</span></div>
                  {openSections.includes("pengertian")?<ChevronUp className="w-4 h-4 text-yellow-300"/>:<ChevronDown className="w-4 h-4 text-yellow-300"/>}
                </button>
                {openSections.includes("pengertian") && (
                  <div className="px-5 pb-5 space-y-4">
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      <strong className="text-cyan-300">Persamaan Linear Dua Variabel (PLDV)</strong> adalah persamaan yang memiliki dua variabel berpangkat satu. Bentuk umumnya: <InlineMath math="ax + by = c" />, dengan <InlineMath math="a \neq 0" /> atau <InlineMath math="b \neq 0" />.
                    </p>
                    <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4">
                      <p className="font-body text-xs font-bold text-cyan-300 uppercase mb-2">🔑 Bentuk Umum PLDV</p>
                      <BlockMath math="ax + by = c" />
                      <p className="text-xs text-white/60 mt-1">di mana <InlineMath math="a, b, c \in \mathbb{R}"/>, <InlineMath math="a \neq 0"/> atau <InlineMath math="b \neq 0"/></p>
                    </div>
                    <p className="font-body text-sm text-white/80 leading-relaxed">
                      <strong className="text-yellow-300">Sistem Persamaan Linear Dua Variabel (SPLDV)</strong> terdiri dari <em>dua atau lebih</em> PLDV dengan variabel yang sama. Solusi SPLDV adalah pasangan nilai <InlineMath math="(x, y)"/> yang memenuhi <em>kedua</em> persamaan secara serentak.
                    </p>
                    <div className="bg-violet-900/30 border border-violet-500/30 rounded-xl p-4">
                      <p className="font-body text-xs font-bold text-violet-300 uppercase mb-2">🔑 Bentuk Umum SPLDV</p>
                      <BlockMath math="\begin{cases} a_1x + b_1y = c_1 \\ a_2x + b_2y = c_2 \end{cases}" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label:"PLDV", ex:"2x + 3y = 6", color:"border-cyan-500/30 bg-cyan-900/10", tc:"text-cyan-300" },
                        { label:"SPLDV", ex:"2x + 3y = 6\nx − y = 1", color:"border-violet-500/30 bg-violet-900/10", tc:"text-violet-300" },
                      ].map(({label,ex,color,tc})=>(
                        <div key={label} className={`border ${color} rounded-xl p-3 text-center`}>
                          <p className={`font-display text-xs font-bold mb-2 ${tc}`}>{label}</p>
                          <p className="font-mono text-sm text-white whitespace-pre-line">{ex}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sub: Ciri-Ciri */}
              <div className="border-b border-yellow-400/20">
                <button onClick={()=>toggleSec("ciri")} className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2"><BookMarked className="w-4 h-4 text-yellow-400"/><span className="font-body text-sm font-semibold text-white">✅ Ciri-Ciri SPLDV</span></div>
                  {openSections.includes("ciri")?<ChevronUp className="w-4 h-4 text-yellow-300"/>:<ChevronDown className="w-4 h-4 text-yellow-300"/>}
                </button>
                {openSections.includes("ciri") && (
                  <div className="px-5 pb-5 space-y-3">
                    {[
                      { no:"1", title:"Terdiri dari dua persamaan", desc:"Sebuah SPLDV memiliki tepat dua PLDV yang dinyatakan secara bersamaan.", color:"border-cyan-500/30 bg-cyan-900/10" },
                      { no:"2", title:"Dua variabel yang sama", desc:"Kedua persamaan memiliki variabel yang sama, misal x dan y.", color:"border-violet-500/30 bg-violet-900/10" },
                      { no:"3", title:"Pangkat variabel = 1", desc:"Semua variabel berpangkat satu (linear), tidak ada x² atau y².", color:"border-green-500/30 bg-green-900/10" },
                      { no:"4", title:"Satu pasang penyelesaian", desc:"Solusi berupa satu pasang nilai (x, y) yang memenuhi kedua persamaan.", color:"border-amber-500/30 bg-amber-900/10" },
                    ].map(({no,title,desc,color})=>(
                      <div key={no} className={`border ${color} rounded-xl p-3 flex gap-3`}>
                        <span className="font-display text-sm font-bold text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0">{no}</span>
                        <div><p className="font-body text-sm font-semibold text-white">{title}</p><p className="font-body text-xs text-white/60 mt-0.5">{desc}</p></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sub: Contoh */}
              <div className="border-b border-yellow-400/20">
                <button onClick={()=>toggleSec("contoh")} className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2"><span className="text-yellow-400 text-base">🎯</span><span className="font-body text-sm font-semibold text-white">📝 Contoh SPLDV dalam Kehidupan</span></div>
                  {openSections.includes("contoh")?<ChevronUp className="w-4 h-4 text-yellow-300"/>:<ChevronDown className="w-4 h-4 text-yellow-300"/>}
                </button>
                {openSections.includes("contoh") && (
                  <div className="px-5 pb-5 space-y-4">
                    <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4">
                      <p className="font-body text-sm text-white/90 mb-3">Andi membeli 2 buku dan 3 pensil seharga Rp13.000. Rio membeli 1 buku dan 2 pensil seharga Rp8.000. Berapa harga masing-masing?</p>
                      <p className="font-body text-xs text-white/60 mb-2">Misal harga buku = <InlineMath math="x"/> dan harga pensil = <InlineMath math="y"/>:</p>
                      <BlockMath math="\begin{cases} 2x + 3y = 13.000 \\ x + 2y = 8.000 \end{cases}"/>
                      <p className="font-body text-xs text-green-300 mt-2">Ini adalah SPLDV dengan variabel x (buku) dan y (pensil)!</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <p className="font-body text-sm text-yellow-200"><strong>Ingat:</strong> PLDV hanya satu persamaan. SPLDV adalah <em>sistem</em> (gabungan) dari dua PLDV.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub: Rangkuman */}
              <div>
                <button onClick={()=>toggleSec("rangkuman")} className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary"/><span className="font-body text-sm font-semibold text-white">📋 Rangkuman</span></div>
                  {openSections.includes("rangkuman")?<ChevronUp className="w-4 h-4 text-yellow-300"/>:<ChevronDown className="w-4 h-4 text-yellow-300"/>}
                </button>
                {openSections.includes("rangkuman") && (
                  <div className="px-5 pb-5 space-y-3">
                    {[
                      { poin:"PLDV: satu persamaan dengan dua variabel berpangkat satu, bentuk ax + by = c.", icon:"1️⃣" },
                      { poin:"SPLDV: sistem dua PLDV dengan variabel yang sama, dicari pasangan (x, y) yang memenuhi keduanya.", icon:"2️⃣" },
                      { poin:"Pangkat setiap variabel harus 1 (linear) — tidak boleh ada x² atau xy.", icon:"⚠️" },
                      { poin:"Koefisien a, b, c adalah bilangan real. Solusi dinyatakan sebagai himpunan: {(x, y)}.", icon:"✅" },
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
          <p className="font-bold text-white text-lg mb-1">Contoh: Mengenali SPLDV</p>
          <p className="text-sm text-blue-200/80 mb-4">Perhatikan persamaan-persamaan berikut. Manakah yang merupakan SPLDV?</p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label:"A", eq:"2x + y = 5  dan  x − y = 1", verdict:"SPLDV ✓", why:"Dua PLDV, dua variabel (x,y), pangkat 1", vc:"text-emerald-300", bc:"border-emerald-500/30 bg-emerald-900/10" },
              { label:"B", eq:"x² + y = 3  dan  x − y = 1", verdict:"Bukan SPLDV ✗", why:"Persamaan pertama berpangkat 2 (bukan linear)", vc:"text-red-300", bc:"border-red-500/30 bg-red-900/10" },
              { label:"C", eq:"3x + 2y = 6  dan  x + 4y = 10", verdict:"SPLDV ✓", why:"Dua PLDV, dua variabel (x,y), pangkat 1", vc:"text-emerald-300", bc:"border-emerald-500/30 bg-emerald-900/10" },
            ].map(({label,eq,verdict,why,vc,bc})=>(
              <div key={label} className={`border ${bc} rounded-xl p-3`}>
                <div className="flex items-start gap-3">
                  <span className="font-display text-sm font-black text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">{label}</span>
                  <div>
                    <p className="font-mono text-sm text-white whitespace-pre-line mb-1">{eq}</p>
                    <p className={`font-body text-xs font-bold ${vc}`}>{verdict}</p>
                    <p className="font-body text-xs text-white/55 mt-0.5">{why}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-2 border-emerald-400/60 p-3">
            <p className="text-sm font-black text-emerald-300 font-display">✅ Kunci Identifikasi SPLDV:</p>
            <p className="text-white/80 text-sm font-body mt-1">Dua PLDV + dua variabel yang sama + pangkat 1 = SPLDV</p>
          </div>
        </div>

        {/* Bagian A */}
        <SectionHeader label="A. Ciri-Ciri Persamaan Linear Dua Variabel (PLDV)" color="cyan" />
        <div className="rounded-2xl border-2 border-cyan-400/30 bg-gradient-to-br from-cyan-900/40 to-blue-900/30 p-5 mb-4 font-body text-base text-white/90">
          <p className="mb-4 text-white font-semibold">Lengkapi ciri-ciri PLDV berikut ini!</p>
          <div className="space-y-4 pl-2">
            <p className="flex flex-wrap items-baseline gap-2"><span className="text-cyan-300 font-bold shrink-0 text-lg">1.</span><span>Memiliki</span><B id="a1" w="w-28" mono={false}/><span className="text-cyan-200/70">(misalnya variabel <span className="text-yellow-300 font-bold font-mono text-lg">x</span> dan <span className="text-yellow-300 font-bold font-mono text-lg">y</span>)</span></p>
            <p className="flex flex-wrap items-baseline gap-2"><span className="text-cyan-300 font-bold shrink-0 text-lg">2.</span><span>Pangkat masing-masing variabelnya adalah</span><B id="a2" w="w-16" mono={false}/><span className="text-cyan-200/70">(disebut linear)</span></p>
            <p className="flex flex-wrap items-baseline gap-2"><span className="text-cyan-300 font-bold shrink-0 text-lg">3.</span><span>Koefisien variabel berupa bilangan</span><B id="a3" w="w-20" mono={false}/></p>
            <p className="flex flex-wrap items-baseline gap-2"><span className="text-cyan-300 font-bold shrink-0 text-lg">4.</span><span>Memiliki</span><B id="a4" w="w-28" mono={false}/><span>penyelesaian</span></p>
          </div>
          <CK sectionKey="a"/>
        </div>

        {/* Bagian B */}
        <SectionHeader label="B. Bentuk Umum SPLDV" color="emerald" />
        <div className="rounded-2xl border-2 border-emerald-400/30 bg-gradient-to-br from-emerald-900/40 to-teal-900/30 p-5 mb-4 font-body text-base text-white/90">
          <p className="mb-4 text-white font-semibold">Isilah titik-titik berikut untuk melengkapi bentuk umum SPLDV!</p>
          <div className="bg-emerald-950/50 rounded-xl p-4 border border-emerald-400/30 mb-4 text-center">
            <BlockMath math="\begin{cases} a_1x + b_1y = c_1 \\ a_2x + b_2y = c_2 \end{cases}"/>
          </div>
          <div className="space-y-4 pl-2">
            <p className="flex flex-wrap items-baseline gap-2"><span className="text-emerald-300 font-bold shrink-0">•</span><B id="b1" w="w-12"/><span>dan</span><B id="b2" w="w-12"/><span>adalah koefisien variabel x dan y</span></p>
            <p className="flex flex-wrap items-baseline gap-2"><span className="text-emerald-300 font-bold shrink-0">•</span><B id="b3" w="w-12"/><span>adalah konstanta (bilangan tetap di ruas kanan)</span></p>
            <p className="flex flex-wrap items-baseline gap-2"><span className="text-emerald-300 font-bold shrink-0">•</span><span>SPLDV terdiri dari</span><B id="b4" w="w-32" mono={false}/><span>yang memiliki</span><B id="b5" w="w-28" mono={false}/><span>yang sama</span></p>
          </div>
          <CK sectionKey="b"/>
        </div>

        {/* Kasus 1 */}
        <SectionHeader label="Kasus 1 — Identifikasi Manakah yang Merupakan SPLDV" color="cyan" />
        <div className="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/50 to-indigo-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-blue-200/80 mb-4">Tentukan apakah persamaan berikut merupakan SPLDV atau bukan, lalu berikan alasanmu!</p>
          <div className="space-y-4">
            {[
              { id:"k1a_p1", no:"1", eq:"x + 2y = 6  dan  3x − y = 4", hint:"(cek: berapa persamaan? berapa variabel? berapa pangkat?)"},
              { id:"k1a_p2", no:"2", eq:"x² + y = 5  dan  x − y = 2",  hint:"(perhatikan pangkat variabelnya!)"},
              { id:"k1a_p3", no:"3", eq:"2x − y = 3  dan  x + 4y = 7", hint:"(cek semua syarat SPLDV!)"},
              { id:"k1a_p4", no:"4", eq:"3x = 9  dan  2x − 1 = 5",     hint:"(berapa variabel yang ada?)"},
            ].map(({id,no,eq,hint})=>(
              <div key={id} className="bg-blue-950/40 border border-blue-400/25 rounded-xl p-4">
                <p className="font-mono text-sm text-white mb-1 font-bold">{no}. {eq}</p>
                <p className="text-xs text-blue-300/60 mb-3 font-body">{hint}</p>
                <div className="flex flex-wrap items-center gap-2 font-body text-sm">
                  <span className="text-white/70">Jawaban:</span>
                  <B id={id} w="w-36" mono={false}/>
                </div>
              </div>
            ))}
          </div>
          <CK sectionKey="k1a"/>
        </div>

        {/* Kasus 2 */}
        <SectionHeader label="Kasus 2 — Menulis SPLDV dalam Bentuk Umum" color="emerald" />
        <div className="rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-900/50 to-teal-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-emerald-200/80 mb-4">Tuliskan nilai koefisien dan konstanta dari setiap SPLDV berikut <span className="text-yellow-300 font-bold">dalam bentuk</span> <InlineMath math="ax + by = c"/>!</p>
          <div className="space-y-5">
            <div className="bg-emerald-950/40 border border-emerald-400/25 rounded-xl p-4">
              <p className="font-mono text-base font-bold text-white mb-3">3x + 2y = 12 <span className="text-white/40 text-sm">… (P1)</span></p>
              <div className="flex flex-wrap items-center gap-3 text-sm font-body">
                <span className="text-white/70">a =</span><B id="k2_a1" w="w-14"/>
                <span className="text-white/70 ml-2">b =</span><B id="k2_b1" w="w-14"/>
                <span className="text-white/70 ml-2">c =</span><B id="k2_c1" w="w-14"/>
              </div>
            </div>
            <div className="bg-teal-950/40 border border-teal-400/25 rounded-xl p-4">
              <p className="font-mono text-base font-bold text-white mb-3">x − 4y = 7 <span className="text-white/40 text-sm">… (P2)</span></p>
              <div className="flex flex-wrap items-center gap-3 text-sm font-body">
                <span className="text-white/70">a =</span><B id="k2_a2" w="w-14"/>
                <span className="text-white/70 ml-2">b =</span><B id="k2_b2" w="w-14"/>
                <span className="text-white/70 ml-2">c =</span><B id="k2_c2" w="w-14"/>
              </div>
            </div>
          </div>
          <CK sectionKey="k2"/>
        </div>

        {/* Kasus 3 */}
        <SectionHeader label="Kasus 3 — Kaitan PLDV dengan SPLDV" color="amber" />
        <div className="rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-900/50 to-orange-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-amber-200/80 mb-4">Perhatikan ilustrasi berikut. Lengkapi bagian yang kosong!</p>
          <div className="bg-amber-950/40 border border-amber-400/25 rounded-xl p-4 mb-4">
            <p className="font-body text-sm text-white/85 mb-3">
              Satu persamaan "<span className="font-mono text-yellow-300 font-bold">3x + 5y = 15</span>" adalah sebuah&nbsp;
              <B id="k3_p1" w="w-44" mono={false}/>.
            </p>
            <p className="font-body text-sm text-white/85">
              Jika digabungkan dengan persamaan "<span className="font-mono text-yellow-300 font-bold">2x − y = 4</span>", maka keduanya membentuk sebuah&nbsp;
              <B id="k3_p2" w="w-52" mono={false}/>.
            </p>
          </div>
          <p className="text-sm text-amber-200/80 mb-3">Dari persamaan <span className="font-mono text-yellow-300 font-bold">3x + 5y = 15</span>, tentukan nilai koefisien dan konstanta:</p>
          <div className="flex flex-wrap gap-4 font-body text-sm">
            <span className="text-white/70">Variabel pertama:</span><B id="k3_var1" w="w-14"/>
            <span className="text-white/70">Koefisien x =</span><B id="k3_coef1" w="w-14"/>
            <span className="text-white/70">Koefisien y =</span><B id="k3_coef2" w="w-14"/>
            <span className="text-white/70">Konstanta =</span><B id="k3_const" w="w-14"/>
          </div>
          <CK sectionKey="k3"/>
        </div>

        {/* Kasus 4 */}
        <SectionHeader label="Kasus 4 — Membuat Model SPLDV dari Cerita" color="violet" />
        <div className="rounded-2xl border-2 border-violet-400/40 bg-gradient-to-br from-violet-900/50 to-purple-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-violet-200/80 mb-4 leading-relaxed">
            Andi membeli <strong className="text-yellow-300">3 pensil</strong> dan <strong className="text-yellow-300">2 buku</strong> seharga <strong className="text-white">Rp13.000</strong>. Budi membeli <strong className="text-yellow-300">2 pensil</strong> dan <strong className="text-yellow-300">1 buku</strong> seharga <strong className="text-white">Rp8.000</strong>.
          </p>
          <div className="bg-violet-950/40 border border-violet-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-violet-300 mb-3">📐 Membuat Pemisalan:</p>
            <div className="space-y-2 font-body text-sm text-white/85">
              <p>Misal harga 1 pensil = <B id="k4_var1" w="w-28" mono={false}/></p>
              <p>Misal harga 1 buku = <B id="k4_var2" w="w-28" mono={false}/></p>
            </div>
          </div>
          <div className="bg-purple-950/40 border border-purple-400/25 rounded-xl p-4">
            <p className="text-sm font-bold text-purple-300 mb-3">📝 Model Matematika:</p>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex flex-wrap items-center gap-2 text-white/85">
                <span className="text-violet-300 font-bold text-xs">Andi :</span>
                <B id="k4_p1l" w="w-14"/> + <B id="k4_p1r" w="w-14"/> = Rp <B id="k4_p1c" w="w-20"/>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-white/85">
                <span className="text-violet-300 font-bold text-xs">Budi :</span>
                <B id="k4_p2l" w="w-14"/> + <B id="k4_p2r" w="w-14"/> = Rp <B id="k4_p2c" w="w-20"/>
              </div>
            </div>
          </div>
          <CK sectionKey="k4"/>
        </div>

        {/* Kesimpulan */}
        <div className="rounded-3xl border-2 border-cyan-400/40 bg-gradient-to-br from-cyan-900/50 via-blue-900/40 to-violet-900/40 p-6 mb-6 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-3 mb-4"><span className="text-3xl">✨</span><h2 className="font-display text-lg font-black text-cyan-200 tracking-wide uppercase">Kesimpulan SPLDV</h2></div>
          {[
            { icon:"🔵", title:"PLDV vs SPLDV", body:"PLDV adalah satu persamaan; SPLDV adalah sistem dari dua PLDV dengan variabel yang sama.", tc:"text-cyan-300", bc:"from-cyan-800/40 to-blue-800/30 border-cyan-400/30" },
            { icon:"📐", title:"Bentuk Umum", body:"Setiap persamaan dalam SPLDV berbentuk ax + by = c, dengan a, b, c ∈ ℝ.", tc:"text-violet-300", bc:"from-violet-800/40 to-purple-800/30 border-violet-400/30" },
            { icon:"✅", title:"Solusi SPLDV", body:"Solusi SPLDV adalah pasangan (x, y) yang memenuhi kedua persamaan secara bersamaan.", tc:"text-emerald-300", bc:"from-emerald-800/40 to-teal-800/30 border-emerald-400/30" },
            { icon:"🌟", title:"Aplikasi Nyata", body:"SPLDV banyak digunakan untuk memecahkan masalah sehari-hari seperti harga barang, kecepatan, dan umur.", tc:"text-amber-300", bc:"from-amber-800/40 to-orange-800/30 border-amber-400/30" },
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
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎮</span>
              <div className="text-left">
                <p className="font-display text-sm font-black text-rose-200 uppercase tracking-wide">POSTES — DEFINISI DAN BENTUK UMUM SPLDV</p>
                <p className="font-body text-xs text-rose-300/70 mt-0.5">Ayo ukur pemahamanmu dengan memilih salah satu game berikut</p>
              </div>
            </div>
            {postesOpen ? <ChevronUp className="text-rose-300 shrink-0" size={20}/> : <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400 animate-pulse"/><ChevronDown className="text-rose-300 shrink-0" size={20}/></div>}
          </button>
          {postesOpen && (
            <div className="mt-3 rounded-2xl border border-rose-400/25 bg-gradient-to-br from-rose-950/50 to-slate-900/60 p-4">
              <p className="font-body text-xs text-white/50 text-center mb-4">Pilih mode game favoritmu!</p>
              <div className="grid grid-cols-3 gap-2">
                {POSTES_GAMES.map(g=>(
                  <button key={g.id} onClick={()=>navigate(`/math-game-arena/kelas-8/spldv/definisi-spldv/${g.id}`)} className={`rounded-xl border-2 bg-gradient-to-br ${g.bg} p-3 text-center active:scale-95 transition-all hover:brightness-110`} style={{boxShadow:`0 0 16px ${g.glow}`}}>
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
            <div className="flex items-center gap-3">
              <span className="text-2xl">✍️</span>
              <div className="text-left">
                <p className="font-display text-sm font-black text-cyan-200 uppercase tracking-wide">Kesanku Belajar Hari Ini</p>
                <p className="font-body text-xs text-cyan-300/70 mt-0.5">Tuliskan kesanmu secara jujur setelah mengerjakan LKPD ini!</p>
              </div>
            </div>
            {kesanOpen ? <ChevronUp className="text-cyan-300 shrink-0" size={20}/> : <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"/><ChevronDown className="text-cyan-300 shrink-0" size={20}/></div>}
          </button>
          {kesanOpen && (
            <div className="mt-3 rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-cyan-950/50 to-slate-900/60 p-5 space-y-4">
              {[
                {label:"1. Apa yang kamu pahami tentang perbedaan PLDV dan SPLDV?", color:"cyan"},
                {label:"2. Bagian mana yang menurutmu paling membingungkan? Mengapa?", color:"violet"},
                {label:"3. Berikan satu contoh SPLDV dari kehidupan sehari-harimu!", color:"emerald"},
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
          <div className="flex gap-2 items-start">
            <span className="text-white/40 text-xs font-mono mt-0.5 shrink-0">•</span>
            <p className="text-xs text-white/60 font-body leading-relaxed"><span className="font-semibold text-white/75">Sumber Referensi Internet:</span>{" "}<a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 transition-colors break-all">https://gemini.google.com/app</a></p>
          </div>
        </div>

        {/* Motivasi */}
        <div className="rounded-2xl bg-gradient-to-r from-yellow-500/20 to-amber-500/15 border border-yellow-400/40 p-4 text-center mb-6">
          <p className="text-yellow-300 font-display font-black text-base mb-1">🏆 Selamat! Kamu Telah Memahami Dasar SPLDV!</p>
          <p className="text-white/75 font-body text-sm leading-relaxed">Dengan memahami definisi dan bentuk umum SPLDV, kamu siap mempelajari berbagai metode penyelesaiannya. Terus semangat! 💪</p>
        </div>

        <div className="text-center">
          <button onClick={()=>window.history.back()} className="text-sm text-white/50 hover:text-cyan-400 transition-colors font-body">← Kembali ke menu SPLDV</button>
        </div>
      </div>
    </div>
    </PageCtx.Provider>
  );
};

export default DefinisiSPLDVLKPDPage;
