import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { playPopSound } from "@/hooks/useAudio";

/* ── Fixed geometry (viewBox 0 0 300 290) ── */
const Ox = 152, Oy = 148, R = 108;
// A at math 0°, B at math 100°, C (vertex) at math 250°
const A  = { x: 260, y: 148 };
const B  = { x: 133, y: 42  };
const Cv = { x: 115, y: 250 };
// D: extension of C-O line beyond O (70 units from O)
const D  = { x: 178, y: 80 };

const f  = (n: number) => n.toFixed(1);

function arcPath(cx:number,cy:number,r:number,a1:number,a2:number){
  const r1=a1*Math.PI/180, r2=a2*Math.PI/180;
  const p1={x:cx+r*Math.cos(r1),y:cy-r*Math.sin(r1)};
  const p2={x:cx+r*Math.cos(r2),y:cy-r*Math.sin(r2)};
  const large=((a2-a1)+360)%360>180?1:0;
  return `M ${f(p1.x)},${f(p1.y)} A ${r},${r} 0 ${large} 0 ${f(p2.x)},${f(p2.y)}`;
}
function wedge(cx:number,cy:number,r:number,a1:number,a2:number){
  const r1=a1*Math.PI/180, r2=a2*Math.PI/180;
  const p1={x:cx+r*Math.cos(r1),y:cy-r*Math.sin(r1)};
  const p2={x:cx+r*Math.cos(r2),y:cy-r*Math.sin(r2)};
  const large=((a2-a1)+360)%360>180?1:0;
  return `M ${cx},${cy} L ${f(p1.x)},${f(p1.y)} A ${r},${r} 0 ${large} 0 ${f(p2.x)},${f(p2.y)} Z`;
}

const STEPS = [
  {
    key:"setup",
    title:"📌 Persiapan",
    desc:"Lingkaran dengan pusat O, titik A dan B di tepi (ujung busur), dan titik C juga di tepi (di busur besar, berlawanan dari AB).",
    formula: null,
    color:"text-white/70",
  },
  {
    key:"arc",
    title:"🎯 Busur AB — Busur yang Sama",
    desc:"Busur AB (busur kecil, disorot kuning) adalah busur yang SAMA yang akan dihadapi oleh sudut pusat di O dan sudut keliling di C.",
    formula: null,
    color:"text-amber-300",
  },
  {
    key:"central",
    title:"⭐ Sudut Pusat ∠AOB = α = 100°",
    desc:"Hubungkan O ke A dan O ke B. Terbentuk sudut pusat ∠AOB = α = 100° di titik O (pusat). OA dan OB adalah jari-jari lingkaran.",
    formula:"\\angle AOB = \\alpha = 100°",
    color:"text-amber-300",
  },
  {
    key:"inscribed",
    title:"🔵 Sudut Keliling ∠ACB = β = 50°",
    desc:"Hubungkan C ke A dan C ke B. Terbentuk sudut keliling ∠ACB = β = 50° di titik C. Kedua sudut menghadap busur AB yang SAMA!",
    formula:"\\angle ACB = \\beta = 50°",
    color:"text-purple-300",
  },
  {
    key:"oc",
    title:"✏️ Tarik OC — Semua Jari-Jari!",
    desc:"Tarik garis OC. Karena OA, OB, dan OC semuanya jari-jari lingkaran yang sama, maka OA = OB = OC = r.",
    formula:"OA = OB = OC = r",
    color:"text-cyan-300",
  },
  {
    key:"isosceles",
    title:"📐 Segitiga Sama Kaki — Kunci Bukti",
    desc:"△OCA sama kaki (OC=OA=r) ⟹ ∠OCA = ∠OAC = β₂ = 35°. △OCB sama kaki (OC=OB=r) ⟹ ∠OCB = ∠OBC = β₁ = 15°. Jadi β = β₁ + β₂.",
    formula:"\\beta = \\beta_1 + \\beta_2 = 15° + 35° = 50°",
    color:"text-green-300",
  },
  {
    key:"proof",
    title:"🎉 Terbukti! ∠AOB = 2 × ∠ACB",
    desc:"Sudut luar △OCA di O = 2β₂ = 70°. Sudut luar △OCB di O = 2β₁ = 30°. Jumlah: ∠AOB = 2β₁ + 2β₂ = 2(β₁+β₂) = 2β = 2×∠ACB ✓",
    formula:"\\angle AOB = 2\\beta_1 + 2\\beta_2 = 2\\angle ACB \\ ✓",
    color:"text-cyan-300",
  },
];

export default function SudutPusatProofAnim() {
  const [step, setStep] = useState(0);
  const total = STEPS.length;

  const go = (n: number) => { playPopSound(); setStep(Math.max(0, Math.min(total-1, n))); };
  const s = (min: number, max = 99) => step >= min && step <= max;

  return (
    <div className="flex flex-col items-center gap-3 px-1 py-3">
      {/* SVG */}
      <div className="w-full max-w-xs sm:max-w-sm mx-auto">
        <svg viewBox="0 0 300 290" className="w-full" aria-label="Pembuktian sudut pusat = 2 × sudut keliling">

          {/* ── Full circle ── */}
          <circle cx={Ox} cy={Oy} r={R} fill="rgba(6,182,212,0.06)" stroke="#06b6d4" strokeWidth="1.8"/>

          {/* ── Minor arc AB (busur kecil) ── */}
          {s(1) && (
            <path d={arcPath(Ox,Oy,R,0,100)} fill="none" stroke="#f59e0b" strokeWidth="4.5"
              strokeLinecap="round" style={{opacity:s(1)?1:0,transition:"opacity 0.4s"}} />
          )}

          {/* ── Major arc (dim) ── */}
          <path d={arcPath(Ox,Oy,R,100,360)} fill="none" stroke="#06b6d4" strokeWidth="1.8" opacity="0.35"/>

          {/* ── Filled triangles for isosceles step ── */}
          {s(5) && <>
            <polygon
              points={`${Ox},${Oy} ${Cv.x},${Cv.y} ${A.x},${A.y}`}
              fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.4)" strokeWidth="1"
              style={{opacity:s(5)?1:0,transition:"opacity 0.4s"}} />
            <polygon
              points={`${Ox},${Oy} ${Cv.x},${Cv.y} ${B.x},${B.y}`}
              fill="rgba(168,85,247,0.15)" stroke="rgba(168,85,247,0.4)" strokeWidth="1"
              style={{opacity:s(5)?1:0,transition:"opacity 0.4s"}} />
          </>}

          {/* ── Angle sector at O (central angle) ── */}
          {s(2,5) && (
            <path d={wedge(Ox,Oy,24,0,100)} fill="rgba(245,158,11,0.2)" stroke="none"
              style={{opacity:s(2,5)?1:0,transition:"opacity 0.4s"}} />
          )}

          {/* ── 2β₁ and 2β₂ sectors at O (proof step) ── */}
          {s(6) && <>
            <path d={wedge(Ox,Oy,28,0,70)} fill="rgba(34,197,94,0.25)" stroke="rgba(34,197,94,0.6)" strokeWidth="0.5"
              style={{opacity:s(6)?1:0,transition:"opacity 0.4s"}} />
            <path d={wedge(Ox,Oy,28,70,100)} fill="rgba(168,85,247,0.25)" stroke="rgba(168,85,247,0.6)" strokeWidth="0.5"
              style={{opacity:s(6)?1:0,transition:"opacity 0.4s"}} />
          </>}

          {/* ── Angle sector at C (inscribed angle) ── */}
          {s(3) && (
            <path d={wedge(Cv.x,Cv.y,20,35,85)} fill="rgba(168,85,247,0.2)" stroke="none"
              style={{opacity:s(3)?1:0,transition:"opacity 0.4s"}} />
          )}

          {/* ── β₁ sector at C ── */}
          {s(5) && (
            <path d={wedge(Cv.x,Cv.y,22,70,85)} fill="rgba(168,85,247,0.3)" stroke="rgba(168,85,247,0.6)" strokeWidth="0.5"
              style={{opacity:s(5)?1:0,transition:"opacity 0.4s"}} />
          )}
          {/* ── β₂ sector at C ── */}
          {s(5) && (
            <path d={wedge(Cv.x,Cv.y,22,35,70)} fill="rgba(34,197,94,0.3)" stroke="rgba(34,197,94,0.6)" strokeWidth="0.5"
              style={{opacity:s(5)?1:0,transition:"opacity 0.4s"}} />
          )}

          {/* ── Equal angle marks at A (∠OAC = β₂) ── */}
          {s(5) && (
            <path d={arcPath(A.x,A.y,16,180,215)} fill="none" stroke="#22c55e" strokeWidth="1.8"
              style={{opacity:s(5)?1:0,transition:"opacity 0.4s"}} />
          )}
          {/* ── Equal angle marks at B (∠OBC = β₁) ── */}
          {s(5) && (
            <path d={arcPath(B.x,B.y,16,265,280)} fill="none" stroke="#a855f7" strokeWidth="1.8"
              style={{opacity:s(5)?1:0,transition:"opacity 0.4s"}} />
          )}

          {/* ── Lines OA, OB (central angle sides) ── */}
          {s(2) && <>
            <line x1={Ox} y1={Oy} x2={A.x} y2={A.y} stroke="#22c55e" strokeWidth="2"
              style={{opacity:s(2)?1:0,transition:"opacity 0.4s"}} />
            <line x1={Ox} y1={Oy} x2={B.x} y2={B.y} stroke="#22c55e" strokeWidth="2"
              style={{opacity:s(2)?1:0,transition:"opacity 0.4s"}} />
          </>}

          {/* ── Lines CA, CB (inscribed angle sides) ── */}
          {s(3) && <>
            <line x1={Cv.x} y1={Cv.y} x2={A.x} y2={A.y} stroke="#a855f7" strokeWidth="2"
              style={{opacity:s(3)?1:0,transition:"opacity 0.4s"}} />
            <line x1={Cv.x} y1={Cv.y} x2={B.x} y2={B.y} stroke="#a855f7" strokeWidth="2"
              style={{opacity:s(3)?1:0,transition:"opacity 0.4s"}} />
          </>}

          {/* ── OC dashed line ── */}
          {s(4) && (
            <line x1={Ox} y1={Oy} x2={Cv.x} y2={Cv.y} stroke="#06b6d4" strokeWidth="2"
              strokeDasharray="5 3"
              style={{opacity:s(4)?1:0,transition:"opacity 0.4s"}} />
          )}

          {/* ── Extension line C→D (passes through O) for proof ── */}
          {s(6) && (
            <line x1={Cv.x} y1={Cv.y} x2={D.x} y2={D.y} stroke="#94a3b8" strokeWidth="1.5"
              strokeDasharray="4 2"
              style={{opacity:s(6)?1:0,transition:"opacity 0.4s"}} />
          )}

          {/* ── Equal-length tick marks on OC and OA ── */}
          {s(4) && <>
            {/* mid-tick on OA */}
            <line x1="209" y1="145" x2="211" y2="139" stroke="#22c55e" strokeWidth="1.8"/>
            <line x1="213" y1="145" x2="215" y2="139" stroke="#22c55e" strokeWidth="1.8"/>
            {/* mid-tick on OB */}
            <line x1="143" y1="93" x2="148" y2="89" stroke="#22c55e" strokeWidth="1.8"/>
            <line x1="147" y1="97" x2="152" y2="93" stroke="#22c55e" strokeWidth="1.8"/>
            {/* mid-tick on OC */}
            <line x1="131" y1="200" x2="138" y2="197" stroke="#06b6d4" strokeWidth="1.8"/>
            <line x1="135" y1="206" x2="142" y2="203" stroke="#06b6d4" strokeWidth="1.8"/>
          </>}

          {/* ── Points ── */}
          <circle cx={Ox} cy={Oy} r="5" fill="#f59e0b"/>
          <circle cx={A.x} cy={A.y} r="5" fill="#22c55e"/>
          <circle cx={B.x} cy={B.y} r="5" fill="#22c55e"/>
          <circle cx={Cv.x} cy={Cv.y} r="5" fill="#a855f7"/>
          {s(6) && <circle cx={D.x} cy={D.y} r="3.5" fill="#94a3b8"
            style={{opacity:s(6)?1:0,transition:"opacity 0.4s"}}/>}

          {/* ── Labels ── */}
          <text x={Ox+7} y={Oy-6} fill="#fbbf24" fontSize="12" fontWeight="bold" fontFamily="monospace">O</text>
          <text x={A.x+7} y={A.y+4} fill="#4ade80" fontSize="12" fontWeight="bold" fontFamily="monospace">A</text>
          <text x={B.x-7} y={B.y-6} fill="#4ade80" fontSize="12" fontWeight="bold" fontFamily="monospace">B</text>
          <text x={Cv.x-16} y={Cv.y+14} fill="#c084fc" fontSize="12" fontWeight="bold" fontFamily="monospace">C</text>
          {s(6) && <text x={D.x+5} y={D.y-4} fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="monospace"
            style={{opacity:s(6)?1:0,transition:"opacity 0.4s"}}>D</text>}

          {/* ── Angle label α at O ── */}
          {s(2,5) && (
            <text x={Ox+26} y={Oy-20} fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace"
              style={{opacity:s(2,5)?1:0,transition:"opacity 0.4s"}}>α=100°</text>
          )}

          {/* ── Angle label β at C ── */}
          {s(3) && (
            <text x={Cv.x+12} y={Cv.y-16} fill="#c084fc" fontSize="11" fontWeight="bold" fontFamily="monospace"
              style={{opacity:s(3)?1:0,transition:"opacity 0.4s"}}>β=50°</text>
          )}

          {/* ── β₁ and β₂ labels at C ── */}
          {s(5) && <>
            <text x={Cv.x+22} y={Cv.y-22} fill="#a855f7" fontSize="10" fontWeight="bold" fontFamily="monospace"
              style={{opacity:s(5)?1:0,transition:"opacity 0.4s"}}>β₁=15°</text>
            <text x={Cv.x+20} y={Cv.y-36} fill="#22c55e" fontSize="10" fontWeight="bold" fontFamily="monospace"
              style={{opacity:s(5)?1:0,transition:"opacity 0.4s"}}>β₂=35°</text>
          </>}

          {/* ── 2β₂ and 2β₁ labels at O in proof step ── */}
          {s(6) && <>
            <text x="188" y="128" fill="#22c55e" fontSize="10" fontWeight="bold" fontFamily="monospace"
              style={{opacity:s(6)?1:0,transition:"opacity 0.4s"}}>2β₂</text>
            <text x="163" y="113" fill="#a855f7" fontSize="10" fontWeight="bold" fontFamily="monospace"
              style={{opacity:s(6)?1:0,transition:"opacity 0.4s"}}>2β₁</text>
          </>}

          {/* ── OC label ── */}
          {s(4) && (
            <text x="121" y="193" fill="#22d3ee" fontSize="10" fontFamily="monospace"
              style={{opacity:s(4)?1:0,transition:"opacity 0.4s"}}>r</text>
          )}
        </svg>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-sm"
        >
          <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl p-3.5 space-y-2">
            <p className={`font-display text-sm font-bold ${STEPS[step].color}`}>
              {STEPS[step].title}
            </p>
            <p className="font-body text-xs text-white/75 leading-relaxed">
              {STEPS[step].desc}
            </p>
            {STEPS[step].formula && (
              <div className="bg-slate-900/60 rounded-lg px-3 py-1 text-center overflow-x-auto">
                <BlockMath math={STEPS[step].formula!} />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center gap-3 w-full max-w-sm justify-between">
        <button
          onClick={() => go(step - 1)}
          disabled={step === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/8 hover:bg-white/15 disabled:opacity-30 transition cursor-pointer disabled:cursor-default font-display text-xs font-bold text-white/80"
        >
          <ChevronLeft className="w-4 h-4" /> Sebelumnya
        </button>

        {/* Dots */}
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <button key={i} onClick={() => go(i)} className="cursor-pointer">
              <div className={`rounded-full transition-all duration-200 ${
                i === step ? "w-5 h-2.5 bg-cyan-400" : "w-2.5 h-2.5 bg-white/25 hover:bg-white/50"
              }`} />
            </button>
          ))}
        </div>

        <button
          onClick={() => go(step + 1)}
          disabled={step === total - 1}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/8 hover:bg-white/15 disabled:opacity-30 transition cursor-pointer disabled:cursor-default font-display text-xs font-bold text-white/80"
        >
          Selanjutnya <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Step counter */}
      <p className="font-body text-[10px] text-white/30">
        Langkah {step + 1} dari {total}
      </p>
    </div>
  );
}
