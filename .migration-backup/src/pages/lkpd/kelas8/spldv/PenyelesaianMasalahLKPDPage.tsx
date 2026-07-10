import { useState, createContext, useContext, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { ChevronDown, ChevronUp, Lightbulb, BookOpen } from "lucide-react";

function normalize(s: string) { return s.toLowerCase().replace(/\s+/g, " ").trim(); }
function checkAnswer(val: string, accepted: string[]): boolean {
  return accepted.some(a => normalize(a) === normalize(val));
}

const ANSWERS: Record<string, string[]> = {
  /* Kasus 1 — Harga tiket */
  k1_var1: ["x", "tiket dewasa", "harga tiket dewasa"],
  k1_var2: ["y", "tiket anak", "harga tiket anak"],
  k1_p1: ["3x + 2y = 70000", "3x + 2y = 70.000"],
  k1_p2: ["2x + 4y = 80000", "2x + 4y = 80.000"],
  k1_x: ["10000", "10.000"],
  k1_y: ["20000", "20.000"],
  k1_jawab: ["50000", "50.000"],

  /* Kasus 2 — Penjualan barang */
  k2_var1: ["x", "harga kemeja", "kemeja"],
  k2_var2: ["y", "harga celana", "celana"],
  k2_p1: ["2x + y = 350000", "2x + y = 350.000"],
  k2_p2: ["x + 2y = 400000", "x + 2y = 400.000"],
  k2_x: ["100000", "100.000"],
  k2_y: ["150000", "150.000"],
  k2_jawab: ["250000", "250.000"],

  /* Kasus 3 — Gabungan dua bilangan */
  k3_p1: ["x + y = 24", "y + x = 24"],
  k3_p2: ["2x + y = 35", "y + 2x = 35"],
  k3_x: ["11"],
  k3_y: ["13"],

  /* Kasus 4 — Masalah campuran */
  k4_var1: ["x", "banyak sapi"],
  k4_var2: ["y", "banyak ayam"],
  k4_p1: ["x + y = 30", "y + x = 30"],
  k4_p2: ["4x + 2y = 80", "2y + 4x = 80"],
  k4_x: ["10"],
  k4_y: ["20"],
};

const SECTIONS: Record<string, string[]> = {
  k1model: ["k1_var1","k1_var2","k1_p1","k1_p2"],
  k1jawab: ["k1_x","k1_y","k1_jawab"],
  k2model: ["k2_var1","k2_var2","k2_p1","k2_p2"],
  k2jawab: ["k2_x","k2_y","k2_jawab"],
  k3model: ["k3_p1","k3_p2"],
  k3jawab: ["k3_x","k3_y"],
  k4: ["k4_var1","k4_var2","k4_p1","k4_p2","k4_x","k4_y"],
};

type PageCtxType = { vals: Record<string,string>; res: Record<string,boolean|null>; onChange:(id:string,v:string)=>void; onCek:(k:string)=>void; };
const PageCtx = createContext<PageCtxType>({ vals:{}, res:{}, onChange:()=>{}, onCek:()=>{} });

function Blank({ id, w="w-20", mono=true }: { id:string; w?:string; mono?:boolean }) {
  const { vals, res, onChange } = useContext(PageCtx);
  const r = res[id] ?? null;
  const border = r===null?"border-2 border-dashed border-cyan-400/70 focus:border-cyan-300":r?"border-2 border-solid border-emerald-400":"border-2 border-solid border-red-400";
  const bg = r===null?"bg-white/5":r?"bg-emerald-500/20":"bg-red-500/20";
  const tc = r===null?"text-white":r?"text-emerald-200":"text-red-200";
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

const PenyelesaianMasalahLKPDPage = () => {
  const [vals, setVals] = useState<Record<string,string>>({});
  const [res, setRes] = useState<Record<string,boolean|null>>({});
  const [materiOpen, setMateriOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["polya"]);
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
          <p className="font-display text-xs font-bold tracking-widest text-cyan-300 uppercase mb-1">Lembar Kerja Peserta Didik (LKPD 7)</p>
          <h1 className="font-display text-xl md:text-2xl font-black text-white mb-2 drop-shadow-lg">Penyelesaian Masalah<br/>yang Berkaitan dengan SPLDV</h1>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-body text-white/70">
            <p>Mata Pelajaran: <span className="text-white font-bold">Matematika</span></p>
            <p>Kelas / Semester: <span className="text-white font-bold">VIII / I</span></p>
            <p>Alokasi Waktu: <span className="text-white font-bold">2 × 40 menit</span></p>
            <p>Satuan Pendidikan: <span className="text-white font-bold">SMP</span></p>
          </div>
          <p className="mt-3 text-sm text-white/80 font-body leading-relaxed text-left">
            <span className="text-cyan-300 font-bold">Tujuan Pembelajaran :</span> Peserta didik dapat menyelesaikan masalah kontekstual yang berkaitan dengan SPLDV secara lengkap: memahami masalah, membuat model, menyelesaikan, dan menafsirkan jawaban.
          </p>
        </div>

        {/* Panduan Materi */}
        <div className="mb-6">
          <button onClick={()=>setMateriOpen(v=>!v)} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-yellow-400/60 bg-gradient-to-r from-yellow-600/30 via-amber-600/20 to-orange-600/20 shadow-[0_0_24px_rgba(234,179,8,0.2)] hover:opacity-90 active:scale-[0.99] transition-all">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div className="text-left">
                <p className="font-display text-sm font-black text-yellow-200 tracking-wide uppercase">Panduan Materi — Penyelesaian Masalah</p>
                <p className="font-body text-xs text-yellow-300/70 mt-0.5">{materiOpen?"Tutup panduan materi":"Buka untuk membaca teori sebelum mengerjakan"}</p>
              </div>
            </div>
            {materiOpen?<ChevronUp className="w-5 h-5 text-yellow-300 shrink-0"/>:<div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse"/><ChevronDown className="w-5 h-5 text-yellow-300 shrink-0"/></div>}
          </button>
          {materiOpen && (
            <div className="mt-3 rounded-2xl border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-950/60 via-amber-950/50 to-orange-950/40 overflow-hidden">
              <div className="border-b border-yellow-400/20">
                <button onClick={()=>toggleSec("polya")} className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-400"/><span className="font-body text-sm font-semibold text-white">🧠 Langkah Polya dalam Pemecahan Masalah</span></div>
                  {openSections.includes("polya")?<ChevronUp className="w-4 h-4 text-yellow-300"/>:<ChevronDown className="w-4 h-4 text-yellow-300"/>}
                </button>
                {openSections.includes("polya") && (
                  <div className="px-5 pb-5 space-y-3">
                    {[
                      { step:"Memahami Masalah", desc:"Identifikasi apa yang diketahui, apa yang ditanyakan, dan apakah informasi cukup untuk menyelesaikan masalah.", icon:"📖", color:"border-cyan-500/30 bg-cyan-900/10" },
                      { step:"Menyusun Rencana", desc:"Tentukan metode yang akan digunakan (grafik, substitusi, eliminasi, atau campuran) dan buat model SPLDV.", icon:"📐", color:"border-violet-500/30 bg-violet-900/10" },
                      { step:"Melaksanakan Rencana", desc:"Selesaikan SPLDV dengan metode yang dipilih, langkah demi langkah secara sistematis.", icon:"⚙️", color:"border-green-500/30 bg-green-900/10" },
                      { step:"Memeriksa Kembali", desc:"Substitusikan solusi ke persamaan awal dan pastikan jawaban sesuai dengan konteks masalah (satuan, makna, dll).", icon:"✅", color:"border-amber-500/30 bg-amber-900/10" },
                    ].map(({step,desc,icon,color})=>(
                      <div key={step} className={`border ${color} rounded-xl p-3 flex gap-3`}>
                        <span className="text-2xl shrink-0">{icon}</span>
                        <div><p className="font-body text-sm font-semibold text-white">{step}</p><p className="font-body text-xs text-white/60 mt-0.5">{desc}</p></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <button onClick={()=>toggleSec("tips")} className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-yellow-400"/><span className="font-body text-sm font-semibold text-white">💡 Tips Menafsirkan Jawaban</span></div>
                  {openSections.includes("tips")?<ChevronUp className="w-4 h-4 text-yellow-300"/>:<ChevronDown className="w-4 h-4 text-yellow-300"/>}
                </button>
                {openSections.includes("tips") && (
                  <div className="px-5 pb-5 space-y-3">
                    {[
                      { poin:"Jawaban harus bermakna sesuai konteks: umur tidak boleh negatif, jumlah barang harus bilangan bulat positif.", icon:"⚠️" },
                      { poin:"Selalu tuliskan kesimpulan yang menjawab pertanyaan soal, bukan sekadar nilai x dan y.", icon:"📝" },
                      { poin:"Periksa: apakah kedua persamaan awal terpenuhi dengan nilai yang diperoleh?", icon:"🔍" },
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
          <p className="font-bold text-white text-lg mb-3">Contoh: Penyelesaian Masalah SPLDV</p>
          <p className="text-sm text-blue-200/80 mb-4 leading-relaxed">Di sebuah toko, harga 2 kg mangga dan 1 kg jeruk adalah Rp25.000. Harga 1 kg mangga dan 2 kg jeruk adalah Rp20.000. Berapa harga 3 kg mangga dan 3 kg jeruk?</p>
          <div className="space-y-3">
            <div className="rounded-xl bg-cyan-900/40 border border-cyan-400/30 p-4">
              <p className="text-sm font-bold text-cyan-300 mb-2">① Memahami &amp; Model</p>
              <p className="text-xs text-white/70 mb-2">Misal: harga 1 kg mangga = x, harga 1 kg jeruk = y</p>
              <div className="font-mono text-sm text-white space-y-1">
                <p><span className="text-yellow-300">2x + y = 25.000 …(1)</span></p>
                <p><span className="text-yellow-300">x + 2y = 20.000 …(2)</span></p>
              </div>
            </div>
            <div className="rounded-xl bg-emerald-900/40 border border-emerald-400/30 p-4">
              <p className="text-sm font-bold text-emerald-300 mb-2">② Penyelesaian (Eliminasi)</p>
              <div className="font-mono text-sm text-white space-y-1">
                <p>(1) − (2): x − y = 5.000  →  x = y + 5.000</p>
                <p>Substitusi ke (2): y + 5.000 + 2y = 20.000</p>
                <p className="text-yellow-300 font-black">y = 5.000  dan  x = 10.000</p>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-700/20 border-2 border-amber-400/60 p-3">
              <p className="text-sm font-bold text-amber-300 mb-1">③ Memeriksa: 2(10.000) + 5.000 = 25.000 ✓ dan 10.000 + 2(5.000) = 20.000 ✓</p>
              <p className="text-white font-mono font-black text-sm">3 kg mangga + 3 kg jeruk = 3(10.000) + 3(5.000) = <span className="text-yellow-300">Rp45.000</span></p>
            </div>
          </div>
        </div>

        {/* Kasus 1 */}
        <SectionHeader label="Kasus 1 — Harga Tiket Masuk Wahana" color="cyan"/>
        <div className="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/50 to-indigo-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-blue-200/80 mb-4 leading-relaxed">
            Sebuah wahana menetapkan harga tiket dewasa dan tiket anak. Kelompok A membeli <strong className="text-yellow-300">3 tiket dewasa + 2 tiket anak = Rp70.000</strong>. Kelompok B membeli <strong className="text-yellow-300">2 tiket dewasa + 4 tiket anak = Rp80.000</strong>. Berapa total biaya untuk <strong className="text-white">1 tiket dewasa + 3 tiket anak?</strong>
          </p>
          <div className="bg-blue-950/40 border border-blue-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-blue-300 mb-3">📐 Pemisalan &amp; Model:</p>
            <div className="space-y-2 font-body text-sm text-white/85">
              <p>Misal harga tiket dewasa = <B id="k1_var1" w="w-36" mono={false}/></p>
              <p>Misal harga tiket anak = <B id="k1_var2" w="w-36" mono={false}/></p>
              <p className="flex flex-wrap items-center gap-2 mt-2">P1: <B id="k1_p1" w="w-44" mono={false}/></p>
              <p className="flex flex-wrap items-center gap-2">P2: <B id="k1_p2" w="w-44" mono={false}/></p>
            </div>
            <CK sectionKey="k1model"/>
          </div>
          <div className="bg-indigo-950/40 border border-indigo-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-indigo-300 mb-3">⚙️ Penyelesaian (gunakan metode pilihanmu):</p>
            <div className="flex flex-wrap items-center gap-4 font-body text-sm">
              <span className="text-white/70">Harga tiket dewasa = Rp <B id="k1_x" w="w-24"/></span>
              <span className="text-white/70">Harga tiket anak = Rp <B id="k1_y" w="w-24"/></span>
            </div>
          </div>
          <div className="bg-cyan-950/40 border border-cyan-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-cyan-300 mb-3">📝 Tafsirkan jawaban:</p>
            <p className="font-body text-sm text-white/85">
              Total biaya 1 tiket dewasa + 3 tiket anak = 1 × Rp <B id="k1_x" w="w-20"/> + 3 × Rp <B id="k1_y" w="w-20"/> = Rp <B id="k1_jawab" w="w-24"/>
            </p>
          </div>
          <CK sectionKey="k1jawab"/>
        </div>

        {/* Kasus 2 */}
        <SectionHeader label="Kasus 2 — Penjualan Pakaian" color="emerald"/>
        <div className="rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-900/50 to-teal-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-emerald-200/80 mb-4 leading-relaxed">
            Toko Baju Raya menjual kemeja dan celana. Penjualan hari pertama: <strong className="text-yellow-300">2 kemeja + 1 celana = Rp350.000</strong>. Hari kedua: <strong className="text-yellow-300">1 kemeja + 2 celana = Rp400.000</strong>. Berapa harga <strong className="text-white">1 kemeja + 1 celana?</strong>
          </p>
          <div className="bg-emerald-950/40 border border-emerald-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-emerald-300 mb-3">📐 Pemisalan &amp; Model:</p>
            <div className="space-y-2 font-body text-sm text-white/85">
              <p>Misal harga 1 kemeja = <B id="k2_var1" w="w-36" mono={false}/></p>
              <p>Misal harga 1 celana = <B id="k2_var2" w="w-36" mono={false}/></p>
              <p className="flex flex-wrap items-center gap-2 mt-2">P1: <B id="k2_p1" w="w-48" mono={false}/></p>
              <p className="flex flex-wrap items-center gap-2">P2: <B id="k2_p2" w="w-48" mono={false}/></p>
            </div>
            <CK sectionKey="k2model"/>
          </div>
          <div className="bg-teal-950/40 border border-teal-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-teal-300 mb-3">⚙️ Penyelesaian:</p>
            <div className="flex flex-wrap items-center gap-4 font-body text-sm">
              <span className="text-white/70">Harga kemeja = Rp <B id="k2_x" w="w-24"/></span>
              <span className="text-white/70">Harga celana = Rp <B id="k2_y" w="w-24"/></span>
            </div>
          </div>
          <div className="bg-green-950/40 border border-green-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-green-300 mb-3">📝 Tafsirkan jawaban:</p>
            <p className="font-body text-sm text-white/85">
              1 kemeja + 1 celana = Rp <B id="k2_x" w="w-20"/> + Rp <B id="k2_y" w="w-20"/> = Rp <B id="k2_jawab" w="w-24"/>
            </p>
          </div>
          <CK sectionKey="k2jawab"/>
        </div>

        {/* Kasus 3 */}
        <SectionHeader label="Kasus 3 — Dua Bilangan" color="amber"/>
        <div className="rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-900/50 to-orange-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-amber-200/80 mb-4 leading-relaxed">
            Jumlah dua bilangan adalah <strong className="text-yellow-300">24</strong>. Jika bilangan pertama ditambah dua kali bilangan kedua hasilnya <strong className="text-yellow-300">35</strong>. Tentukan kedua bilangan tersebut!
          </p>
          <div className="bg-amber-950/40 border border-amber-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-amber-300 mb-3">📐 Misal bilangan pertama = x, bilangan kedua = y. Buat model:</p>
            <div className="space-y-2 font-body text-sm">
              <p className="flex flex-wrap items-center gap-2 text-white/85">Kondisi jumlah: <B id="k3_p1" w="w-40" mono={false}/></p>
              <p className="flex flex-wrap items-center gap-2 text-white/85">Kondisi kombinasi: <B id="k3_p2" w="w-40" mono={false}/></p>
            </div>
            <CK sectionKey="k3model"/>
          </div>
          <div className="bg-orange-950/40 border border-orange-400/25 rounded-xl p-4">
            <p className="text-sm font-bold text-orange-300 mb-3">⚙️ Penyelesaian:</p>
            <div className="flex flex-wrap items-center gap-4 font-body text-sm">
              <span className="text-white/70">Bilangan pertama = <B id="k3_x" w="w-14"/></span>
              <span className="text-white/70">Bilangan kedua = <B id="k3_y" w="w-14"/></span>
            </div>
            <CK sectionKey="k3jawab"/>
          </div>
        </div>

        {/* Kasus 4 */}
        <SectionHeader label="Kasus 4 — Masalah Peternakan" color="violet"/>
        <div className="rounded-2xl border-2 border-violet-400/40 bg-gradient-to-br from-violet-900/50 to-purple-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-violet-200/80 mb-4 leading-relaxed">
            Pak Budi memelihara sapi dan ayam. Jumlah keseluruhan <strong className="text-yellow-300">30 ekor</strong>. Jumlah kaki seluruh hewan <strong className="text-yellow-300">80 kaki</strong> (sapi berkaki 4, ayam berkaki 2). Berapa banyak sapi dan ayam?
          </p>
          <div className="bg-violet-950/40 border border-violet-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-violet-300 mb-3">📐 Pemisalan &amp; Model:</p>
            <div className="space-y-2 font-body text-sm text-white/85">
              <p>Banyak sapi = <B id="k4_var1" w="w-32" mono={false}/></p>
              <p>Banyak ayam = <B id="k4_var2" w="w-32" mono={false}/></p>
              <p className="flex flex-wrap items-center gap-2 mt-2">Jumlah hewan: <B id="k4_p1" w="w-40" mono={false}/></p>
              <p className="flex flex-wrap items-center gap-2">Jumlah kaki: <B id="k4_p2" w="w-44" mono={false}/></p>
            </div>
          </div>
          <div className="bg-purple-950/40 border border-purple-400/25 rounded-xl p-4">
            <p className="text-sm font-bold text-purple-300 mb-3">⚙️ Penyelesaian &amp; Tafsiran:</p>
            <div className="flex flex-wrap items-center gap-4 font-body text-sm">
              <span className="text-white/70">Banyak sapi = <B id="k4_x" w="w-14"/> ekor</span>
              <span className="text-white/70">Banyak ayam = <B id="k4_y" w="w-14"/> ekor</span>
            </div>
            <div className="mt-3 rounded-xl bg-gradient-to-br from-emerald-600/20 to-teal-700/10 border border-emerald-400/40 p-3">
              <p className="text-xs text-white/70 font-body">Cek: jumlah hewan = 10 + 20 = 30 ✓, jumlah kaki = 4(10) + 2(20) = 80 ✓</p>
            </div>
          </div>
          <CK sectionKey="k4"/>
        </div>

        {/* Kesimpulan */}
        <div className="rounded-3xl border-2 border-cyan-400/40 bg-gradient-to-br from-cyan-900/50 via-blue-900/40 to-violet-900/40 p-6 mb-6 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-3 mb-4"><span className="text-3xl">✨</span><h2 className="font-display text-lg font-black text-cyan-200 tracking-wide uppercase">Kesimpulan Penyelesaian Masalah SPLDV</h2></div>
          {[
            { icon:"🧠", title:"Pahami Dulu, Hitung Kemudian", body:"Sebelum menghitung, luangkan waktu memahami soal sepenuhnya. Identifikasi semua informasi dan apa yang ditanyakan.", tc:"text-cyan-300", bc:"from-cyan-800/40 to-blue-800/30 border-cyan-400/30" },
            { icon:"🔗", title:"Model adalah Jembatan", body:"Model SPLDV adalah jembatan antara masalah nyata dan solusi matematika. Semakin tepat modelnya, semakin akurat jawabannya.", tc:"text-violet-300", bc:"from-violet-800/40 to-purple-800/30 border-violet-400/30" },
            { icon:"🔍", title:"Verifikasi & Tafsirkan", body:"Solusi matematis (x, y) harus dikembalikan ke konteks masalah. Pastikan jawabannya masuk akal dan menjawab pertanyaan.", tc:"text-emerald-300", bc:"from-emerald-800/40 to-teal-800/30 border-emerald-400/30" },
            { icon:"🌟", title:"Refleksi Akhir", body:"Kemampuan memecahkan masalah adalah bekal hidup. Setiap soal SPLDV yang diselesaikan melatih kita berpikir sistematis dan logis!", tc:"text-amber-300", bc:"from-amber-800/40 to-orange-800/30 border-amber-400/30" },
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
            <div className="flex items-center gap-3"><span className="text-2xl">🎮</span><div className="text-left"><p className="font-display text-sm font-black text-rose-200 uppercase tracking-wide">POSTES — PENYELESAIAN MASALAH SPLDV</p><p className="font-body text-xs text-rose-300/70 mt-0.5">Ayo ukur pemahamanmu dengan memilih salah satu game!</p></div></div>
            {postesOpen?<ChevronUp className="text-rose-300 shrink-0" size={20}/>:<div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400 animate-pulse"/><ChevronDown className="text-rose-300 shrink-0" size={20}/></div>}
          </button>
          {postesOpen && (
            <div className="mt-3 rounded-2xl border border-rose-400/25 bg-gradient-to-br from-rose-950/50 to-slate-900/60 p-4">
              <p className="font-body text-xs text-white/50 text-center mb-4">Pilih mode game favoritmu!</p>
              <div className="grid grid-cols-3 gap-2">
                {POSTES_GAMES.map(g=>(
                  <button key={g.id} onClick={()=>navigate(`/math-game-arena/kelas-8/spldv/penyelesaian-masalah/${g.id}`)} className={`rounded-xl border-2 bg-gradient-to-br ${g.bg} p-3 text-center active:scale-95 transition-all hover:brightness-110`} style={{boxShadow:`0 0 16px ${g.glow}`}}>
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
            <div className="flex items-center gap-3"><span className="text-2xl">✍️</span><div className="text-left"><p className="font-display text-sm font-black text-cyan-200 uppercase tracking-wide">Kesanku Belajar Hari Ini</p><p className="font-body text-xs text-cyan-300/70 mt-0.5">Tuliskan kesanmu setelah menyelesaikan LKPD terakhir SPLDV ini!</p></div></div>
            {kesanOpen?<ChevronUp className="text-cyan-300 shrink-0" size={20}/>:<div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"/><ChevronDown className="text-cyan-300 shrink-0" size={20}/></div>}
          </button>
          {kesanOpen && (
            <div className="mt-3 rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-cyan-950/50 to-slate-900/60 p-5 space-y-4">
              {[{label:"1. Masalah mana yang paling menantang dan mengapa?",color:"cyan"},{label:"2. Bagaimana kamu memeriksa bahwa jawabanmu benar dan masuk akal?",color:"violet"},{label:"3. Tuliskan satu masalah nyata di sekitarmu yang bisa diselesaikan dengan SPLDV!",color:"emerald"}].map(({label,color})=>(
                <div key={label}><label className={`block font-body text-sm font-semibold text-${color}-300 mb-2`}>{label}</label><textarea rows={3} placeholder="Tuliskan jawabanmu di sini..." className={`w-full rounded-xl border-2 border-dashed border-${color}-400/50 bg-white/5 text-white placeholder-white/25 font-body text-sm px-4 py-3 outline-none focus:border-${color}-300 resize-none transition-all duration-200 leading-relaxed`}/></div>
              ))}
              <div>
                <label className="block font-body text-sm font-semibold text-amber-300 mb-3">4. Seberapa paham kamu dengan seluruh materi SPLDV?</label>
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
          <p className="text-yellow-300 font-display font-black text-base mb-1">🏆 Selamat Menyelesaikan Semua LKPD SPLDV!</p>
          <p className="text-white/75 font-body text-sm leading-relaxed">Kamu telah menguasai definisi, grafik, substitusi, eliminasi, campuran, pemodelan, dan penyelesaian masalah SPLDV. Luar biasa! 🌟</p>
        </div>
        <div className="text-center"><button onClick={()=>window.history.back()} className="text-sm text-white/50 hover:text-cyan-400 transition-colors font-body">← Kembali ke menu SPLDV</button></div>
      </div>
    </div>
    </PageCtx.Provider>
  );
};

export default PenyelesaianMasalahLKPDPage;
