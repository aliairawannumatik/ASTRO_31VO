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
  /* Kasus 1 — Harga barang */
  k1_var1: ["x", "harga pensil", "pensil"],
  k1_var2: ["y", "harga buku", "buku"],
  k1_p1l: ["3x"], k1_p1r: ["2y"], k1_p1c: ["11000", "11.000", "Rp 11.000"],
  k1_p2l: ["2x"], k1_p2r: ["y"],  k1_p2c: ["7000",  "7.000",  "Rp 7.000"],

  /* Kasus 2 — Umur */
  k2_var1: ["x", "umur ayah"],
  k2_var2: ["y", "umur anak"],
  k2_p1: ["x + y = 58", "y + x = 58"],
  k2_p2: ["x = y + 30", "x - y = 30"],

  /* Kasus 3 — Kecepatan */
  k3_var1: ["x", "kecepatan mobil"],
  k3_var2: ["y", "kecepatan motor"],
  k3_p1: ["x = 2y", "x - 2y = 0"],
  k3_p2: ["x + y = 180", "y + x = 180"],

  /* Kasus 4 — Panjang & lebar persegi panjang */
  k4_var1: ["p", "panjang", "l"],
  k4_var2: ["l", "lebar", "p"],
  k4_p1: ["2(p + l) = 54", "p + l = 27", "2p + 2l = 54"],
  k4_p2: ["p = l + 9", "p - l = 9"],
  k4_p_val: ["18"],
  k4_l_val: ["9"],
};

const SECTIONS: Record<string, string[]> = {
  k1: ["k1_var1","k1_var2","k1_p1l","k1_p1r","k1_p1c","k1_p2l","k1_p2r","k1_p2c"],
  k2: ["k2_var1","k2_var2","k2_p1","k2_p2"],
  k3: ["k3_var1","k3_var2","k3_p1","k3_p2"],
  k4: ["k4_var1","k4_var2","k4_p1","k4_p2","k4_p_val","k4_l_val"],
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

const ModelSPLDVLKPDPage = () => {
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
          <p className="font-display text-xs font-bold tracking-widest text-cyan-300 uppercase mb-1">Lembar Kerja Peserta Didik (LKPD 6)</p>
          <h1 className="font-display text-xl md:text-2xl font-black text-white mb-2 drop-shadow-lg">Membuat Model dari Permasalahan<br/>yang Berkaitan dengan SPLDV</h1>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-body text-white/70">
            <p>Mata Pelajaran: <span className="text-white font-bold">Matematika</span></p>
            <p>Kelas / Semester: <span className="text-white font-bold">VIII / I</span></p>
            <p>Alokasi Waktu: <span className="text-white font-bold">2 × 40 menit</span></p>
            <p>Satuan Pendidikan: <span className="text-white font-bold">SMP</span></p>
          </div>
          <p className="mt-3 text-sm text-white/80 font-body leading-relaxed text-left">
            <span className="text-cyan-300 font-bold">Tujuan Pembelajaran :</span> Peserta didik dapat mengidentifikasi informasi dari masalah kontekstual, memisalkan variabel, dan menyusun model SPLDV yang tepat.
          </p>
        </div>

        {/* Panduan Materi */}
        <div className="mb-6">
          <button onClick={()=>setMateriOpen(v=>!v)} className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-yellow-400/60 bg-gradient-to-r from-yellow-600/30 via-amber-600/20 to-orange-600/20 shadow-[0_0_24px_rgba(234,179,8,0.2)] hover:opacity-90 active:scale-[0.99] transition-all">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div className="text-left">
                <p className="font-display text-sm font-black text-yellow-200 tracking-wide uppercase">Panduan Materi — Membuat Model SPLDV</p>
                <p className="font-body text-xs text-yellow-300/70 mt-0.5">{materiOpen?"Tutup panduan materi":"Buka untuk membaca teori sebelum mengerjakan"}</p>
              </div>
            </div>
            {materiOpen?<ChevronUp className="w-5 h-5 text-yellow-300 shrink-0"/>:<div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse"/><ChevronDown className="w-5 h-5 text-yellow-300 shrink-0"/></div>}
          </button>
          {materiOpen && (
            <div className="mt-3 rounded-2xl border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-950/60 via-amber-950/50 to-orange-950/40 overflow-hidden">
              <div className="border-b border-yellow-400/20">
                <button onClick={()=>toggleSec("langkah")} className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-400"/><span className="font-body text-sm font-semibold text-white">📐 Langkah Membuat Model SPLDV</span></div>
                  {openSections.includes("langkah")?<ChevronUp className="w-4 h-4 text-yellow-300"/>:<ChevronDown className="w-4 h-4 text-yellow-300"/>}
                </button>
                {openSections.includes("langkah") && (
                  <div className="px-5 pb-5 space-y-4">
                    <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-xl p-4 space-y-3 text-sm font-body text-white/80">
                      <p className="font-bold text-cyan-300 text-xs uppercase">🔑 Langkah-Langkah</p>
                      {[
                        { step:"Baca dan pahami soal cerita dengan teliti. Identifikasi apa yang diketahui dan apa yang ditanyakan.", icon:"📖" },
                        { step:"Tentukan variabel: misalkan besaran yang tidak diketahui sebagai x dan y (atau huruf lain).", icon:"🔤" },
                        { step:"Terjemahkan setiap kondisi dalam soal menjadi persamaan matematika.", icon:"✏️" },
                        { step:"Pastikan persamaan yang terbentuk berjumlah dua dan berupa PLDV dengan dua variabel yang sama.", icon:"✅" },
                      ].map(({step,icon})=>(
                        <div key={step} className="flex gap-2 items-start"><span className="text-lg shrink-0">{icon}</span><p>{step}</p></div>
                      ))}
                    </div>
                    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4">
                      <p className="font-body text-sm text-white/80 mb-2"><span className="text-emerald-300 font-bold">Kata kunci penting:</span></p>
                      <div className="grid grid-cols-2 gap-2 text-xs font-body text-white/70">
                        {[["jumlah / total","persamaan penjumlahan"],["selisih / lebih / kurang","persamaan pengurangan"],["dua kali / tiga kali","persamaan perkalian"],["harga / biaya","persamaan nilai"]].map(([kw,tp])=>(
                          <div key={kw} className="bg-white/5 rounded-lg p-2">
                            <p className="text-yellow-300 font-bold">{kw}</p>
                            <p className="text-white/60">{tp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <button onClick={()=>toggleSec("contoh")} className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-yellow-400"/><span className="font-body text-sm font-semibold text-white">📝 Contoh Membuat Model</span></div>
                  {openSections.includes("contoh")?<ChevronUp className="w-4 h-4 text-yellow-300"/>:<ChevronDown className="w-4 h-4 text-yellow-300"/>}
                </button>
                {openSections.includes("contoh") && (
                  <div className="px-5 pb-5 space-y-4">
                    <div className="bg-violet-900/20 border border-violet-500/30 rounded-xl p-4">
                      <p className="font-body text-sm text-white/85 mb-3">Harga 4 apel dan 2 pisang Rp12.000. Harga 3 apel dan 1 pisang Rp9.000.</p>
                      <div className="space-y-2 text-sm font-body">
                        <p className="text-violet-300 font-bold">Pemisalan:</p>
                        <p className="text-white/80">Harga 1 apel = x, harga 1 pisang = y</p>
                        <p className="text-violet-300 font-bold mt-2">Model SPLDV:</p>
                        <p className="font-mono text-yellow-300 font-bold">4x + 2y = 12.000 … (1)</p>
                        <p className="font-mono text-yellow-300 font-bold">3x + y = 9.000 … (2)</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contoh Pengantar */}
        <div className="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/50 to-indigo-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="font-bold text-white text-lg mb-3">Contoh: Membuat Model SPLDV</p>
          <p className="text-sm text-blue-200/80 mb-4 leading-relaxed">Kelas 8A memiliki <strong className="text-yellow-300">32 siswa</strong>. Jumlah siswa perempuan lebih banyak <strong className="text-yellow-300">4 orang</strong> daripada siswa laki-laki. Berapa siswa laki-laki dan perempuan?</p>
          <div className="space-y-3">
            <div className="rounded-xl bg-cyan-900/40 border border-cyan-400/30 p-4">
              <p className="text-sm font-bold text-cyan-300 mb-2">Langkah 1 — Pemisalan</p>
              <p className="text-sm text-white/80">Misal: jumlah siswa laki-laki = <span className="font-mono text-yellow-300 font-bold">x</span>, jumlah siswa perempuan = <span className="font-mono text-yellow-300 font-bold">y</span></p>
            </div>
            <div className="rounded-xl bg-emerald-900/40 border border-emerald-400/30 p-4">
              <p className="text-sm font-bold text-emerald-300 mb-2">Langkah 2 — Model Matematika</p>
              <div className="font-mono text-sm text-white space-y-1">
                <p>Jumlah: <span className="text-yellow-300 font-black">x + y = 32</span> <span className="text-white/40 text-xs ml-2">… (1)</span></p>
                <p>Selisih: <span className="text-yellow-300 font-black">y = x + 4</span> <span className="text-white/40 text-xs ml-2">… (2)</span></p>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-700/20 border-2 border-emerald-400/60 p-3">
              <p className="text-sm font-black text-emerald-300 font-display">✅ Model SPLDV terbentuk dengan 2 variabel (x dan y) dan 2 persamaan linear!</p>
            </div>
          </div>
        </div>

        {/* Kasus 1 */}
        <SectionHeader label="Kasus 1 — Model dari Masalah Harga Barang" color="cyan"/>
        <div className="rounded-2xl border-2 border-blue-400/40 bg-gradient-to-br from-blue-900/50 to-indigo-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-blue-200/80 mb-4 leading-relaxed">
            Santi membeli <strong className="text-yellow-300">3 pensil</strong> dan <strong className="text-yellow-300">2 buku</strong> seharga <strong className="text-white">Rp11.000</strong>. Dani membeli <strong className="text-yellow-300">2 pensil</strong> dan <strong className="text-yellow-300">1 buku</strong> seharga <strong className="text-white">Rp7.000</strong>. Buatlah model SPLDV dari masalah ini!
          </p>
          <div className="bg-blue-950/40 border border-blue-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-blue-300 mb-3">📐 Pemisalan:</p>
            <div className="space-y-2 font-body text-sm text-white/85">
              <p>Misal harga 1 pensil = <B id="k1_var1" w="w-28" mono={false}/></p>
              <p>Misal harga 1 buku = <B id="k1_var2" w="w-28" mono={false}/></p>
            </div>
          </div>
          <div className="bg-indigo-950/40 border border-indigo-400/25 rounded-xl p-4">
            <p className="text-sm font-bold text-indigo-300 mb-3">✏️ Model Matematika:</p>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex flex-wrap items-center gap-2 text-white/85">
                <span className="text-blue-300 font-bold text-xs">Santi :</span>
                <B id="k1_p1l" w="w-12"/> + <B id="k1_p1r" w="w-12"/> = Rp <B id="k1_p1c" w="w-20"/>
                <span className="text-white/40 text-xs ml-2">… (1)</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-white/85">
                <span className="text-blue-300 font-bold text-xs">Dani :</span>
                <B id="k1_p2l" w="w-12"/> + <B id="k1_p2r" w="w-12"/> = Rp <B id="k1_p2c" w="w-20"/>
                <span className="text-white/40 text-xs ml-2">… (2)</span>
              </div>
            </div>
          </div>
          <CK sectionKey="k1"/>
        </div>

        {/* Kasus 2 */}
        <SectionHeader label="Kasus 2 — Model dari Masalah Umur" color="emerald"/>
        <div className="rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-br from-emerald-900/50 to-teal-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-emerald-200/80 mb-4 leading-relaxed">
            Jumlah umur ayah dan anaknya <strong className="text-yellow-300">58 tahun</strong>. Umur ayah lebih tua <strong className="text-yellow-300">30 tahun</strong> daripada anaknya. Buatlah model SPLDV-nya!
          </p>
          <div className="bg-emerald-950/40 border border-emerald-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-emerald-300 mb-3">📐 Pemisalan:</p>
            <div className="space-y-2 font-body text-sm text-white/85">
              <p>Misalkan umur ayah = <B id="k2_var1" w="w-32" mono={false}/></p>
              <p>Misalkan umur anak = <B id="k2_var2" w="w-32" mono={false}/></p>
            </div>
          </div>
          <div className="bg-teal-950/40 border border-teal-400/25 rounded-xl p-4">
            <p className="text-sm font-bold text-teal-300 mb-3">✏️ Model Matematika:</p>
            <div className="space-y-3 font-body text-sm">
              <p className="flex flex-wrap items-center gap-2 text-white/85">
                <span className="text-teal-300 font-bold text-xs">Jumlah umur :</span>
                <B id="k2_p1" w="w-40" mono={false}/>
                <span className="text-white/40 text-xs">… (1)</span>
              </p>
              <p className="flex flex-wrap items-center gap-2 text-white/85">
                <span className="text-teal-300 font-bold text-xs">Selisih umur :</span>
                <B id="k2_p2" w="w-40" mono={false}/>
                <span className="text-white/40 text-xs">… (2)</span>
              </p>
            </div>
          </div>
          <CK sectionKey="k2"/>
        </div>

        {/* Kasus 3 */}
        <SectionHeader label="Kasus 3 — Model dari Masalah Kecepatan" color="amber"/>
        <div className="rounded-2xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-900/50 to-orange-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-amber-200/80 mb-4 leading-relaxed">
            Kecepatan sebuah mobil <strong className="text-yellow-300">dua kali</strong> kecepatan motor. Jika keduanya bergerak searah dan jumlah kecepatan mereka adalah <strong className="text-yellow-300">180 km/jam</strong>, buatlah model SPLDV-nya!
          </p>
          <div className="bg-amber-950/40 border border-amber-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-amber-300 mb-3">📐 Pemisalan:</p>
            <div className="space-y-2 font-body text-sm text-white/85">
              <p>Kecepatan mobil = <B id="k3_var1" w="w-36" mono={false}/></p>
              <p>Kecepatan motor = <B id="k3_var2" w="w-36" mono={false}/></p>
            </div>
          </div>
          <div className="bg-orange-950/40 border border-orange-400/25 rounded-xl p-4">
            <p className="text-sm font-bold text-orange-300 mb-3">✏️ Model Matematika:</p>
            <div className="space-y-3 font-body text-sm">
              <p className="flex flex-wrap items-center gap-2 text-white/85">
                <span className="text-orange-300 font-bold text-xs">Perbandingan kecepatan :</span>
                <B id="k3_p1" w="w-40" mono={false}/>
                <span className="text-white/40 text-xs">… (1)</span>
              </p>
              <p className="flex flex-wrap items-center gap-2 text-white/85">
                <span className="text-orange-300 font-bold text-xs">Jumlah kecepatan :</span>
                <B id="k3_p2" w="w-40" mono={false}/>
                <span className="text-white/40 text-xs">… (2)</span>
              </p>
            </div>
          </div>
          <CK sectionKey="k3"/>
        </div>

        {/* Kasus 4 */}
        <SectionHeader label="Kasus 4 — Model dari Masalah Geometri" color="violet"/>
        <div className="rounded-2xl border-2 border-violet-400/40 bg-gradient-to-br from-violet-900/50 to-purple-900/40 p-5 mb-6 font-body text-base text-white/90">
          <p className="text-sm text-violet-200/80 mb-4 leading-relaxed">
            Keliling sebuah persegi panjang adalah <strong className="text-yellow-300">54 cm</strong>. Panjangnya lebih dari lebarnya <strong className="text-yellow-300">9 cm</strong>. Buatlah model SPLDV dan tentukan ukuran persegi panjang tersebut!
          </p>
          <div className="bg-violet-950/40 border border-violet-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-violet-300 mb-3">📐 Pemisalan:</p>
            <div className="space-y-2 font-body text-sm text-white/85">
              <p>Panjang = <B id="k4_var1" w="w-28" mono={false}/></p>
              <p>Lebar = <B id="k4_var2" w="w-28" mono={false}/></p>
            </div>
          </div>
          <div className="bg-purple-950/40 border border-purple-400/25 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-purple-300 mb-3">✏️ Model Matematika:</p>
            <div className="space-y-3 font-body text-sm">
              <p className="flex flex-wrap items-center gap-2 text-white/85">
                <span className="text-purple-300 font-bold text-xs">Keliling :</span>
                <B id="k4_p1" w="w-44" mono={false}/>
                <span className="text-white/40 text-xs">… (1)</span>
              </p>
              <p className="flex flex-wrap items-center gap-2 text-white/85">
                <span className="text-purple-300 font-bold text-xs">Hubungan p & l :</span>
                <B id="k4_p2" w="w-44" mono={false}/>
                <span className="text-white/40 text-xs">… (2)</span>
              </p>
            </div>
          </div>
          <div className="bg-indigo-950/40 border border-indigo-400/25 rounded-xl p-4">
            <p className="text-sm font-bold text-indigo-300 mb-3">📏 Selesaikan SPLDV dan tentukan ukurannya:</p>
            <div className="flex flex-wrap items-center gap-4 font-body text-sm">
              <span className="text-white/70">Panjang = <B id="k4_p_val" w="w-14"/> cm</span>
              <span className="text-white/70">Lebar = <B id="k4_l_val" w="w-14"/> cm</span>
            </div>
          </div>
          <CK sectionKey="k4"/>
        </div>

        {/* Kesimpulan */}
        <div className="rounded-3xl border-2 border-cyan-400/40 bg-gradient-to-br from-cyan-900/50 via-blue-900/40 to-violet-900/40 p-6 mb-6 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-3 mb-4"><span className="text-3xl">✨</span><h2 className="font-display text-lg font-black text-cyan-200 tracking-wide uppercase">Kesimpulan Membuat Model SPLDV</h2></div>
          {[
            { icon:"🔤", title:"Pemisalan Variabel", body:"Langkah pertama dan terpenting: tentukan dengan jelas apa yang diwakili oleh setiap variabel (x dan y). Sertakan satuannya!", tc:"text-cyan-300", bc:"from-cyan-800/40 to-blue-800/30 border-cyan-400/30" },
            { icon:"🔗", title:"Kondisi → Persamaan", body:"Setiap kondisi atau informasi dalam soal diterjemahkan menjadi satu persamaan. Dua kondisi → dua persamaan → SPLDV.", tc:"text-violet-300", bc:"from-violet-800/40 to-purple-800/30 border-violet-400/30" },
            { icon:"✅", title:"Cek Model", body:"Pastikan model yang dibentuk: dua persamaan, dua variabel yang sama, dan setiap persamaan bersifat linear (pangkat 1).", tc:"text-emerald-300", bc:"from-emerald-800/40 to-teal-800/30 border-emerald-400/30" },
            { icon:"🌟", title:"Dari Cerita ke Matematika", body:"Kemampuan memodelkan masalah adalah inti dari pemecahan masalah matematika. Setelah model terbentuk, solusi tinggal menunggu!", tc:"text-amber-300", bc:"from-amber-800/40 to-orange-800/30 border-amber-400/30" },
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
            <div className="flex items-center gap-3"><span className="text-2xl">🎮</span><div className="text-left"><p className="font-display text-sm font-black text-rose-200 uppercase tracking-wide">POSTES — MEMBUAT MODEL SPLDV</p><p className="font-body text-xs text-rose-300/70 mt-0.5">Ayo ukur pemahamanmu dengan memilih salah satu game!</p></div></div>
            {postesOpen?<ChevronUp className="text-rose-300 shrink-0" size={20}/>:<div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400 animate-pulse"/><ChevronDown className="text-rose-300 shrink-0" size={20}/></div>}
          </button>
          {postesOpen && (
            <div className="mt-3 rounded-2xl border border-rose-400/25 bg-gradient-to-br from-rose-950/50 to-slate-900/60 p-4">
              <p className="font-body text-xs text-white/50 text-center mb-4">Pilih mode game favoritmu!</p>
              <div className="grid grid-cols-3 gap-2">
                {POSTES_GAMES.map(g=>(
                  <button key={g.id} onClick={()=>navigate(`/math-game-arena/kelas-8/spldv/model-spldv/${g.id}`)} className={`rounded-xl border-2 bg-gradient-to-br ${g.bg} p-3 text-center active:scale-95 transition-all hover:brightness-110`} style={{boxShadow:`0 0 16px ${g.glow}`}}>
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
              {[{label:"1. Bagian mana dari membuat model yang paling menantang bagimu?",color:"cyan"},{label:"2. Berikan satu contoh masalah sehari-hari yang bisa dibuat model SPLDV-nya!",color:"violet"},{label:"3. Apa strategi yang paling membantu kamu dalam membuat model?",color:"emerald"}].map(({label,color})=>(
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
          <p className="text-yellow-300 font-display font-black text-base mb-1">🏆 Selamat! Kamu Bisa Membuat Model SPLDV!</p>
          <p className="text-white/75 font-body text-sm leading-relaxed">Kemampuan memodelkan masalah nyata adalah keterampilan matematika paling berharga! 💪</p>
        </div>
        <div className="text-center"><button onClick={()=>window.history.back()} className="text-sm text-white/50 hover:text-cyan-400 transition-colors font-body">← Kembali ke menu SPLDV</button></div>
      </div>
    </div>
    </PageCtx.Provider>
  );
};

export default ModelSPLDVLKPDPage;
