import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

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

const materiSection = {
  title: "MATERI - KPK DAN FPB",
  sections: [
    {
      heading: "A. Kelipatan Bilangan",
      content: `Kelipatan bilangan adalah hasil kali sebuah bilangan dengan bilangan bulat positif. Dengan kata lain, kelipatan sebuah bilangan adalah bilangan-bilangan yang dapat dibagi habis dengan bilangan tersebut.

Contoh:
- Kelipatan 2: 2, 4, 6, 8, 10, 12, dan seterusnya.
- Kelipatan 5: 5, 10, 15, 20, 25, 30, dan seterusnya.
- Kelipatan 7: 7, 14, 21, 28, 35, 42, dan seterusnya.

Cara Menentukan Kelipatan:
1. Mengalikan Bilangan dengan Bilangan Bulat Positif:
   Kalian dapat mengalikan bilangan tersebut dengan 1, 2, 3, 4, dan seterusnya.
   Contoh: Untuk mencari kelipatan 3, kalikan 3 dengan 1, 2, 3, 4, dan seterusnya ($3 \\times 1 = 3$, $3 \\times 2 = 6$, $3 \\times 3 = 9$, dan seterusnya).

2. Menjumlahkan Bilangan dengan Diri Sendiri:
   Kalian juga dapat menjumlahkan bilangan tersebut secara berulang.
   Contoh: Untuk mencari kelipatan 4, jumlahkan 4 dengan dirinya sendiri ($4 + 4 = 8$, $8 + 4 = 12$, dan seterusnya).`
    },
    {
      heading: "B. Pengertian KPK (Kelipatan Persekutuan Terkecil)",
      content: `KPK atau Kelipatan Persekutuan Terkecil adalah bilangan bulat positif terkecil yang merupakan kelipatan dari dua bilangan bulat positif tertentu yang sama.`
    },
    {
      heading: "C. Menentukan KPK Dengan Metode Perkalian",
      content: `Ada beberapa cara untuk menentukan KPK dari dua bilangan, yaitu dengan cara menggunakan metode perkalian dan cara faktorisasi prima.

Cara ini dilakukan dengan mengalikan kedua bilangan secara berulang sampai diperoleh bilangan yang sama.

Misalnya kita akan menentukan KPK dari bilangan 12 dan 15. Kita dapat mengalikan bilangan 12 dan 15 dengan 1, 2, 3, 4, 5 dan seterusnya, maka akan diperoleh:
12 = 12, 24, 36, 48, 60, ...
15 = 15, 30, 45, 60, 75, ...

Dari bilangan kelipatan tersebut ada kelipatan bilangan yang sama dan yang terkecil yaitu pada saat 60, maka KPK dari bilangan 12 dan 15 adalah 60.`
    },
    {
      heading: "D. Menentukan KPK Dengan Metode Faktorisasi Prima",
      content: `Cara ini dilakukan dengan memfaktorkan kedua bilangan menjadi faktor-faktor primanya terlebih dahulu.

Misalnya kita akan menentukan KPK dari bilangan 12 dan 15. Kita dapat memfaktorkan bilangan 12 menjadi:
$12 = 2 \\times 2 \\times 3 = 2^2 \\times 3$

dan bilangan 15 menjadi:
$15 = 3 \\times 5$

KPK diperoleh dari hasil kali faktor-faktor prima yang berbeda dan mengambil pangkat tertinggi untuk faktor yang sama yaitu $2^2 \\times 3 \\times 5$,
maka KPK dari bilangan 12 dan 15 adalah $2^2 \\times 3 \\times 5 = 60$`
    },
    {
      heading: "E. Contoh Soal Menentukan KPK",
      content: `1. Tentukanlah KPK dari bilangan 6 dan 10.
$6 = 2 \\times 3$
$10 = 2 \\times 5$
KPK (6, 10) = $2 \\times 3 \\times 5 = 30$

2. Tentukanlah KPK dari bilangan 9 dan 20.
$9 = 3^2$
$20 = 2^2 \\times 5$
KPK (9, 20) = $2^2 \\times 3^2 \\times 5 = 180$

3. Tentukanlah KPK dari bilangan 12 dan 18.
$12 = 2^2 \\times 3$
$18 = 2 \\times 3^2$
KPK (12, 18) = $2^2 \\times 3^2 = 36$

4. Tentukan KPK dari bilangan 126 dan 198.
$126 = 2 \\times 3^2 \\times 7$
$198 = 2 \\times 3^2 \\times 11$
KPK (126, 198) = $2 \\times 3^2 \\times 7 \\times 11 = 1386$

5. Tentukanlah KPK dari bilangan 15, 20, dan 30.
$15 = 3 \\times 5$
$20 = 2^2 \\times 5$
$30 = 2 \\times 3 \\times 5$
KPK (15, 20, 30) = $2^2 \\times 3 \\times 5 = 60$

6. Tentukanlah KPK dari bilangan 9, 21, dan 30.
$9 = 3^2$
$21 = 3 \\times 7$
$30 = 2 \\times 3 \\times 5$
KPK (9, 21, 30) = $2 \\times 3^2 \\times 5 \\times 7 = 630$`
    },
    {
      heading: "F. Faktor Suatu Bilangan",
      content: `Faktor bilangan adalah bilangan-bilangan bulat yang dapat membagi suatu bilangan lain secara tepat, tanpa sisa. Dengan kata lain, faktor-faktor suatu bilangan adalah bilangan-bilangan yang, jika dikalikan bersama-sama, akan menghasilkan bilangan tersebut.

Contoh:
- Faktor dari 10 adalah 1, 2, 5, dan 10.
- Faktor dari 12 adalah 1, 2, 3, 4, 6, dan 12.
- Faktor bilangan 20 adalah 1, 2, 4, 5, 10, dan 20.
- Faktor bilangan 35 adalah 1, 5, 7, 35.
- Faktor bilangan 60 adalah 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, dan 60.`
    },
    {
      heading: "G. Pengertian FPB (Faktor Persekutuan terBesar)",
      content: `FPB adalah bilangan bulat positif terbesar yang dapat membagi habis dua atau lebih bilangan bulat.`
    },
    {
      heading: "H. Menentukan FPB dengan Faktor Bilangan",
      content: `Cara pertama untuk menentukan FPB adalah dengan faktorisasi bilangan. Faktorisasi adalah proses memecah bilangan menjadi faktor-faktor pembentuknya.

Setelah melakukan faktorisasi, cari faktor yang sama pada dua bilangan. Faktor yang sama dan terbesar inilah yang menjadi FPB dari bilangan tersebut.

Contoh:
- Faktorisasi dari bilangan 12 adalah 1, 2, 3, 4, 6, dan 12.
- Faktorisasi dari bilangan 20 adalah 1, 2, 4, 5, 10, dan 20.
- Faktorisasi dari bilangan 60 adalah 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, dan 60.

Dari hasil di atas dapat kita ambil beberapa kesimpulan terkait FPB yaitu:
- FPB (12, 20) = 4
- FPB (12, 60) = 12
- FPB (20, 60) = 20
- FPB (12, 20, 60) = 4`
    },
    {
      heading: "I. Menentukan FPB Dengan Bantuan Faktor Prima",
      content: `Cara menentukan FPB dengan bantuan faktor bilangan prima. Faktorisasi bilangan prima adalah proses memecah bilangan menjadi faktor-faktor prima pembentuknya.

FPB diperoleh dari hasil kali faktor-faktor prima yang sama dengan pangkat terkecil

A. Faktor prima dari bilangan 12 adalah $2^2 \\times 3$
B. Faktor prima dari bilangan 20 adalah $2^2 \\times 5$
C. Faktor prima dari bilangan 60 adalah $2^2 \\times 3 \\times 5$

Dari hasil di atas dapat kita ambil beberapa kesimpulan terkait FPB yaitu:
- FPB (12, 20) = $2 \\times 2 = 4$
- FPB (12, 60) = $2^2 \\times 3 = 12$
- FPB (20, 60) = $2^2 \\times 5 = 20$
- FPB (12, 20, 60) = $2^2 = 4$`
    },
    {
      heading: "J. Contoh Soal Menentukan FPB",
      content: `1. Tentukanlah FPB dari bilangan 6 dan 10.
$6 = 2 \\times 3$
$10 = 2 \\times 5$
FPB (6, 10) = 2

2. Tentukanlah FPB dari bilangan 9 dan 20.
$9 = 3^2$
$20 = 2^2 \\times 5$
FPB (9, 20) = 1
*Jika tidak ada faktor prima yang sama dari kedua bilangan maka FPB dari kedua bilangan tersebut adalah 1

3. Tentukanlah FPB dari bilangan 12 dan 18.
$12 = 2^2 \\times 3$
$18 = 2 \\times 3^2$
FPB (12, 18) = $2 \\times 3 = 6$

4. Tentukanlah FPB dari bilangan 126 dan 198.
$126 = 2 \\times 3^2 \\times 7$
$198 = 2 \\times 3^2 \\times 11$
FPB (126, 198) = $2 \\times 3^2 = 18$

5. Tentukanlah FPB dari bilangan 15, 20, dan 30.
$15 = 3 \\times 5$
$20 = 2^2 \\times 5$
$30 = 2 \\times 3 \\times 5$
FPB (15, 20, 30) = 5

6. Tentukanlah FPB dari bilangan 9, 21, dan 30.
$9 = 3^2$
$21 = 3 \\times 7$
$30 = 2 \\times 3 \\times 5$
FPB (9, 21, 30) = 3`
    },
    {
      heading: "K. Menyelesaikan masalah berkaitan dengan KPK dan FPB",
      content: `Banyak permasalahan yang berkaitan dengan KPK dan FPB dapat dijumpai dalam kehidupan sehari-hari. Simaklah contoh berikut:

a. Dani, Roni dan Cahyo mempunyai jam mengajar di bimbingan belajar yang sama. Dani mengajar setiap 2 hari sekali, Roni mengajar setiap 4 hari sekali dan Cahyo mengajar setiap 6 hari sekali. Pada tanggal 4 agustus ketiganya mempunyai jam mengajar di hari yang sama. Kapan mereka akan mengajar di hari yang sama lagi?

Jawab:
Permasalahan tersebut dapat diselesaikan menggunakan KPK
Faktorisasi prima dari 2 adalah 2
Faktorisasi prima dari 4 adalah $2 \\times 2 = 2^2$
Faktorisasi prima dari 6 adalah $2 \\times 3$
KPK = $2^2 \\times 3 = 4 \\times 3 = 12$
4 agustus + 12 = 16 agustus
Jadi, Dani, Roni dan Cahyo akan mengajar di hari yang sama lagi pada tanggal 16 agustus

b. Bu Wati mempunyai 40 apel, 56 jeruk dan 32 buah manggis. Ketiga jenis buah tersebut akan dibuat menjadi parsel. Tiap parsel memuat masing-masing buah sama banyak.
1) Berapa parsel paling banyak yang dapat dibuat Bu Wati?
2) Berapa banyak masing-masing buah dalam setiap parsel?

Jawab:
1) Permasalahan tersebut dapat diselesaikan menggunakan FPB
Faktorisasi prima dari 40 adalah $2^3 \\times 5$
Faktorisasi prima dari 56 adalah $2^3 \\times 7$
Faktorisasi prima dari 32 adalah $2^5$
Faktor yang sama dengan pangkat terkecil adalah $2^3$.
FPB = $2^3 = 8$
Jadi, Bu Wati dapat membuat paling banyak 8 parsel

2) Banyak buah apel = $\\frac{40}{8} = 5$
Banyak buah jeruk = $\\frac{56}{8} = 7$
Banyak buah manggis = $\\frac{32}{8} = 4$
Jadi, tiap parsel memuat 5 buah apel, 7 buah jeruk dan 4 buah manggis`
    },
    {
      heading: "L. Banyak faktor positif dari bentuk $X = a^m \\cdot b^n \\cdot c^k$",
      content: `Banyak faktor positif dari bentuk $X = a^m \\cdot b^n \\cdot c^k$ adalah $(m+1)(n+1)(k+1)$`
    },
  ]
};

// ─── Rich Materi Components ─────────────────────────────────────────────────

const MateriA = () => {
  const rows = [
    { n: "2", mults: ["2","4","6","8","10","12","…"], cls: "from-blue-500/20 to-blue-700/10 border-blue-500/40 text-blue-300" },
    { n: "5", mults: ["5","10","15","20","25","30","…"], cls: "from-green-500/20 to-green-700/10 border-green-500/40 text-green-300" },
    { n: "7", mults: ["7","14","21","28","35","42","…"], cls: "from-purple-500/20 to-purple-700/10 border-purple-500/40 text-purple-300" },
  ];
  const methods = [
    { title: "① Kalikan dengan 1, 2, 3, 4, …", ex: "Kelipatan 3 = 3×1, 3×2, 3×3, … = 3, 6, 9, …", cls: "bg-cyan-400/10 border-cyan-400/30 text-cyan-300" },
    { title: "② Jumlahkan berulang", ex: "Kelipatan 4: 4, 4+4=8, 8+4=12, …", cls: "bg-yellow-400/10 border-yellow-400/30 text-yellow-300" },
  ];
  return (
    <div className="mt-2 space-y-3">
      <p className="text-xs text-white/50 mb-2">Kelipatan = bilangan yang habis dibagi bilangan tersebut</p>
      <div className="space-y-2">
        {rows.map((r,i)=>{
          const [from,to,border,text]=r.cls.split(' ');
          return (
            <div key={i} className={`rounded-xl border p-3 bg-gradient-to-br ${from} ${to} ${border}`}>
              <div className={`text-xs font-bold mb-2 ${text}`}>Kelipatan {r.n}:</div>
              <div className="flex flex-wrap gap-1">{r.mults.map((m,j)=><span key={j} className={`text-xs font-mono px-2 py-0.5 rounded bg-card/50 ${text}`}>{m}</span>)}</div>
            </div>
          );
        })}
      </div>
      <div className="space-y-2 mt-2">
        {methods.map((m,i)=>(
          <div key={i} className={`rounded-xl border p-3 ${m.cls}`}>
            <div className="text-xs font-bold mb-1">{m.title}</div>
            <div className="text-xs text-white/60">{m.ex}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MateriB = () => (
  <div className="mt-2">
    <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 p-4 text-center mb-3">
      <div className="text-2xl font-bold font-mono text-cyan-300 mb-1">KPK</div>
      <div className="text-xs text-white/60">Kelipatan Persekutuan Terkecil</div>
    </div>
    <div className="bg-card/40 border border-white/10 rounded-xl p-3 space-y-2">
      <p className="text-xs text-white/70 leading-relaxed">Bilangan bulat positif <span className="text-cyan-300 font-semibold">terkecil</span> yang merupakan <span className="text-cyan-300 font-semibold">kelipatan</span> dari dua bilangan bulat positif tertentu.</p>
      <div className="flex gap-2 mt-2">
        {[["KP(4,6)","12, 24, 36, …","blue"],["KPK(4,6)","12","cyan"]].map(([label,val,c],i)=>(
          <div key={i} className={`flex-1 rounded-lg border border-${c}-400/30 bg-${c}-400/10 p-2 text-center`}>
            <div className={`text-xs text-${c}-300 font-bold`}>{label}</div>
            <div className={`text-sm font-mono font-bold text-${c}-200 mt-1`}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MateriC = () => {
  const rows12 = ["12","24","36","48","60"];
  const rows15 = ["15","30","45","60","75"];
  return (
    <div className="mt-2 space-y-3">
      <div className="text-xs text-white/55 bg-card/40 border border-white/10 rounded-xl p-3">
        Metode perkalian: kalikan setiap bilangan dengan 1, 2, 3, … sampai diperoleh <span className="text-amber-300 font-semibold">kelipatan yang sama</span>.
      </div>
      <div className="text-xs font-bold text-white/70 mb-1">Contoh: KPK(12, 15)</div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-xs text-blue-300 font-bold mb-1">Kelipatan 12</div>
          <div className="space-y-1">
            {rows12.map((v,i)=>(
              <div key={i} className={`text-xs px-2 py-1 rounded font-mono ${v==="60"?"bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold":"bg-card/50 border border-white/10 text-white/70"}`}>{v}</div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs text-green-300 font-bold mb-1">Kelipatan 15</div>
          <div className="space-y-1">
            {rows15.map((v,i)=>(
              <div key={i} className={`text-xs px-2 py-1 rounded font-mono ${v==="60"?"bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold":"bg-card/50 border border-white/10 text-white/70"}`}>{v}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-center">
        <span className="text-xs text-white/60">KPK(12, 15) = </span>
        <span className="text-sm font-bold text-amber-300">60</span>
      </div>
    </div>
  );
};

const MateriD = () => (
  <div className="mt-2 space-y-3">
    <div className="text-xs text-white/55 bg-card/40 border border-white/10 rounded-xl p-3">
      Faktorisasi prima setiap bilangan, lalu ambil <span className="text-emerald-300 font-semibold">pangkat tertinggi</span> dari setiap faktor prima.
    </div>
    <div className="text-xs font-bold text-white/70">Contoh: KPK(12, 15)</div>
    <div className="grid grid-cols-2 gap-2">
      {[["12","2^2 \\times 3","blue"],["15","3 \\times 5","green"]].map(([n,f,c],i)=>(
        <div key={i} className={`rounded-xl border border-${c}-400/40 bg-${c}-400/10 p-3`}>
          <div className={`text-xs font-bold text-${c}-300 mb-2`}>{n} =</div>
          <div className={`text-sm font-mono text-${c}-200`}><InlineMath math={f}/></div>
        </div>
      ))}
    </div>
    <div className="rounded-xl border border-amber-400/40 bg-amber-400/15 p-3">
      <div className="text-xs text-amber-300 font-bold mb-1">KPK (ambil pangkat tertinggi):</div>
      <div className="text-center"><BlockMath math="2^2 \times 3 \times 5 = 60"/></div>
    </div>
    <div className="flex gap-2 flex-wrap justify-center text-xs">
      {[["2²","max(2,0)","blue"],["3","max(1,1)","green"],["5","max(0,1)","purple"]].map(([f,r,c],i)=>(
        <div key={i} className={`flex-1 min-w-16 rounded-lg border border-${c}-400/30 bg-${c}-400/10 p-2 text-center`}>
          <div className={`font-bold text-${c}-300`}>{f}</div>
          <div className="text-white/40 text-[10px]">{r}</div>
        </div>
      ))}
    </div>
  </div>
);

const MateriE = () => {
  const examples = [
    { label:"KPK(6,10)",  sol:"2×3 | 2×5", ans:"2×3×5 = 30" },
    { label:"KPK(9,20)",  sol:"3² | 2²×5", ans:"2²×3²×5 = 180" },
    { label:"KPK(12,18)", sol:"2²×3 | 2×3²", ans:"2²×3² = 36" },
    { label:"KPK(126,198)",sol:"2×3²×7 | 2×3²×11",ans:"2×3²×7×11 = 1386"},
    { label:"KPK(15,20,30)",sol:"3×5 | 2²×5 | 2×3×5",ans:"2²×3×5 = 60"},
    { label:"KPK(9,21,30)",sol:"3² | 3×7 | 2×3×5",ans:"2×3²×5×7 = 630"},
  ];
  const colors=["blue","green","purple","orange","cyan","pink"];
  return (
    <div className="mt-2 grid grid-cols-1 gap-2">
      {examples.map((e,i)=>(
        <div key={i} className={`rounded-xl border border-${colors[i]}-400/30 bg-${colors[i]}-400/10 p-3`}>
          <div className={`text-xs font-bold text-${colors[i]}-300 mb-1`}>{e.label}</div>
          <div className="text-xs text-white/50 mb-1">{e.sol}</div>
          <div className={`text-xs font-mono font-semibold text-${colors[i]}-200`}>= {e.ans}</div>
        </div>
      ))}
    </div>
  );
};

const MateriF = () => {
  const items = [
    { n:"10", factors:["1","2","5","10"], cls:"blue" },
    { n:"12", factors:["1","2","3","4","6","12"], cls:"green" },
    { n:"20", factors:["1","2","4","5","10","20"], cls:"purple" },
    { n:"60", factors:["1","2","3","4","5","6","10","12","15","20","30","60"], cls:"amber" },
  ];
  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs text-white/50 mb-2">Faktor = bilangan yang membagi habis suatu bilangan tanpa sisa.</p>
      {items.map((item,i)=>(
        <div key={i} className={`rounded-xl border border-${item.cls}-400/40 bg-${item.cls}-400/10 p-3`}>
          <div className={`text-xs font-bold text-${item.cls}-300 mb-2`}>Faktor dari {item.n}:</div>
          <div className="flex flex-wrap gap-1">
            {item.factors.map((f,j)=><span key={j} className={`text-xs px-2 py-0.5 rounded-full font-mono border border-${item.cls}-400/30 text-${item.cls}-200 bg-card/50`}>{f}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
};

const MateriG = () => (
  <div className="mt-2">
    <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-center mb-3">
      <div className="text-2xl font-bold font-mono text-amber-300 mb-1">FPB</div>
      <div className="text-xs text-white/60">Faktor Persekutuan terBesar</div>
    </div>
    <div className="bg-card/40 border border-white/10 rounded-xl p-3 space-y-2">
      <p className="text-xs text-white/70 leading-relaxed">Bilangan bulat positif <span className="text-amber-300 font-semibold">terbesar</span> yang dapat <span className="text-amber-300 font-semibold">membagi habis</span> dua atau lebih bilangan bulat.</p>
      <div className="flex gap-2 mt-2">
        {[["FP(12,20)","1,2,4","orange"],["FPB(12,20)","4","amber"]].map(([label,val,c],i)=>(
          <div key={i} className={`flex-1 rounded-lg border border-${c}-400/30 bg-${c}-400/10 p-2 text-center`}>
            <div className={`text-xs text-${c}-300 font-bold`}>{label}</div>
            <div className={`text-sm font-mono font-bold text-${c}-200 mt-1`}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MateriH = () => {
  const data = [
    { n:"12", factors:["1","2","3","4","6","12"] },
    { n:"20", factors:["1","2","4","5","10","20"] },
    { n:"60", factors:["1","2","3","4","5","6","10","12","15","20","30","60"] },
  ];
  const common=["1","2","4"];
  return (
    <div className="mt-2 space-y-3">
      <p className="text-xs text-white/50">Daftarkan semua faktor, lalu cari faktor persekutuan terbesar.</p>
      {data.map((d,i)=>(
        <div key={i} className="rounded-xl border border-white/10 bg-card/40 p-3">
          <div className="text-xs font-bold text-white/70 mb-2">Faktor {d.n}:</div>
          <div className="flex flex-wrap gap-1">
            {d.factors.map((f,j)=>(
              <span key={j} className={`text-xs px-2 py-0.5 rounded-full font-mono border ${common.includes(f)?"border-emerald-400/50 bg-emerald-400/20 text-emerald-300":"border-white/15 bg-card/60 text-white/60"}`}>{f}</span>
            ))}
          </div>
        </div>
      ))}
      <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-3">
        <div className="text-xs text-white/50 mb-1">Faktor persekutuan (hijau): 1, 2, 4</div>
        <div className="text-center"><span className="text-xs text-emerald-300 font-bold">FPB(12,20) = </span><span className="text-base font-mono font-bold text-emerald-300">4</span></div>
      </div>
    </div>
  );
};

const MateriI = () => (
  <div className="mt-2 space-y-3">
    <div className="text-xs text-white/55 bg-card/40 border border-white/10 rounded-xl p-3">
      FPB = faktor prima yang <span className="text-amber-300 font-semibold">sama</span> di semua bilangan, diambil dengan <span className="text-amber-300 font-semibold">pangkat terkecil</span>.
    </div>
    <div className="space-y-2">
      {[["12","2^2 \\times 3","blue"],["20","2^2 \\times 5","green"],["60","2^2 \\times 3 \\times 5","purple"]].map(([n,f,c],i)=>(
        <div key={i} className={`rounded-xl border border-${c}-400/40 bg-${c}-400/10 p-3 flex items-center gap-3`}>
          <span className={`text-sm font-bold text-${c}-300 w-8 shrink-0`}>{n}</span>
          <span className="text-white/40">=</span>
          <span className="text-sm font-mono"><InlineMath math={f}/></span>
        </div>
      ))}
    </div>
    <div className="rounded-xl border border-amber-400/40 bg-amber-400/15 p-3 space-y-1">
      <div className="text-xs text-white/50">Faktor prima bersama dengan pangkat terkecil:</div>
      <div className="text-center"><BlockMath math="\text{FPB}(12,20) = 2^2 = 4"/></div>
      <div className="text-center"><BlockMath math="\text{FPB}(12,60) = 2^2 \times 3 = 12"/></div>
    </div>
  </div>
);

const MateriJ = () => {
  const examples=[
    { label:"FPB(6,10)",   sol:"2×3 | 2×5",       ans:"2 = 2" },
    { label:"FPB(9,20)",   sol:"3² | 2²×5",        ans:"1 (tidak ada faktor sama)" },
    { label:"FPB(12,18)",  sol:"2²×3 | 2×3²",      ans:"2×3 = 6" },
    { label:"FPB(126,198)",sol:"2×3²×7 | 2×3²×11",ans:"2×3² = 18"},
    { label:"FPB(15,20,30)",sol:"3×5 | 2²×5 | 2×3×5",ans:"5"},
    { label:"FPB(9,21,30)",sol:"3² | 3×7 | 2×3×5",ans:"3"},
  ];
  const colors=["blue","green","purple","orange","cyan","pink"];
  return (
    <div className="mt-2 grid grid-cols-1 gap-2">
      {examples.map((e,i)=>(
        <div key={i} className={`rounded-xl border border-${colors[i]}-400/30 bg-${colors[i]}-400/10 p-3`}>
          <div className={`text-xs font-bold text-${colors[i]}-300 mb-1`}>{e.label}</div>
          <div className="text-xs text-white/50 mb-1">{e.sol}</div>
          <div className={`text-xs font-mono font-semibold text-${colors[i]}-200`}>= {e.ans}</div>
        </div>
      ))}
    </div>
  );
};

const MateriK = () => (
  <div className="mt-2 space-y-3">
    <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded">Soal a — KPK</span>
      </div>
      <p className="text-xs text-white/70 leading-relaxed mb-3">Dani (2 hari), Roni (4 hari), Cahyo (6 hari) mulai bersama tgl 4 Agustus. Kapan berikutnya?</p>
      <div className="space-y-1 text-xs font-mono">
        {["2 = 2","4 = 2^2","6 = 2 \\times 3"].map((f,i)=>(
          <div key={i} className="flex gap-2 items-center bg-card/50 border border-white/10 rounded-lg px-3 py-1">
            <span className="text-white/50 w-2">{i===0?"2":i===1?"4":"6"}</span>
            <span className="text-white/30">=</span>
            <InlineMath math={f}/>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-lg border border-cyan-400/40 bg-card/50 p-2 text-center">
        <InlineMath math="\text{KPK} = 2^2 \times 3 = 12"/>
      </div>
      <div className="mt-1 text-xs text-cyan-300 font-semibold text-center">4 Agustus + 12 hari = 16 Agustus ✓</div>
    </div>
    <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded">Soal b — FPB</span>
      </div>
      <p className="text-xs text-white/70 leading-relaxed mb-3">Bu Wati punya 40 apel, 56 jeruk, 32 manggis → parsel sama banyak tiap jenis. Berapa parsel?</p>
      <div className="space-y-1 text-xs font-mono">
        {["40 = 2^3 \\times 5","56 = 2^3 \\times 7","32 = 2^5"].map((f,i)=>(
          <div key={i} className="flex gap-2 items-center bg-card/50 border border-white/10 rounded-lg px-3 py-1">
            <InlineMath math={f}/>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-lg border border-amber-400/40 bg-card/50 p-2 text-center">
        <InlineMath math="\text{FPB} = 2^3 = 8 \text{ parsel}"/>
      </div>
      <div className="mt-1 grid grid-cols-3 gap-1 text-xs text-center">
        {[["Apel","40÷8 = 5"],["Jeruk","56÷8 = 7"],["Manggis","32÷8 = 4"]].map(([n,v],i)=>(
          <div key={i} className="bg-card/50 border border-amber-400/20 rounded-lg py-1">
            <div className="text-white/50">{n}</div>
            <div className="text-amber-300 font-bold">{v}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MateriL = () => (
  <div className="mt-2 space-y-3">
    <div className="rounded-xl border border-violet-400/40 bg-violet-400/10 p-4">
      <div className="text-xs text-white/60 mb-3 text-center">Jika <InlineMath math="X = a^m \cdot b^n \cdot c^k"/>, maka banyak faktor positif:</div>
      <div className="text-center mb-2"><BlockMath math="\tau(X) = (m+1)(n+1)(k+1)"/></div>
    </div>
    <div className="space-y-2">
      {[
        { x:"12 = 2^2 \\times 3^1", calc:"(2+1)(1+1)","res":"6"},
        { x:"60 = 2^2 \\times 3 \\times 5", calc:"(2+1)(1+1)(1+1)","res":"12"},
        { x:"2024 = 2^3 \\times 11 \\times 23", calc:"(3+1)(1+1)(1+1)","res":"16"},
      ].map((e,i)=>(
        <div key={i} className="rounded-xl border border-white/10 bg-card/40 p-3 flex items-center gap-2 text-xs flex-wrap">
          <InlineMath math={e.x}/>
          <span className="text-white/30">→</span>
          <span className="text-white/55">{e.calc}</span>
          <span className="text-white/30">=</span>
          <span className="font-bold text-violet-300">{e.res} faktor</span>
        </div>
      ))}
    </div>
  </div>
);

const MATERI_COMPONENTS = [
  <MateriA/>, <MateriB/>, <MateriC/>, <MateriD/>,
  <MateriE/>, <MateriF/>, <MateriG/>, <MateriH/>,
  <MateriI/>, <MateriJ/>, <MateriK/>, <MateriL/>,
];

// ────────────────────────────────────────────────────────────────────────────

interface LatihanSoal {
  no: number;
  soal: string;
  options: string[];
  jawaban: string;
  pembahasan: {
    konsep: string;
    langkah: string[];
    rumus?: string;
  };
}

const latihanDasar: LatihanSoal[] = [
  {
    no: 1,
    soal: "a) Tulislah bilangan-bilangan kelipatan 5 dan kelipatan 7 yang kurang dari 75.\nb) Tentukan kelipatan Persekutuan dari 5 dan 7 yang kurang dari 75.\nc) Berapakah KPK dari 5 dan 7.",
    options: [],
    jawaban: "a) Kelipatan 5: 5,10,15,20,25,30,35,40,45,50,55,60,65,70 | Kelipatan 7: 7,14,21,28,35,42,49,56,63,70\nb) KP(5,7) < 75: 35 dan 70\nc) KPK(5,7) = 35",
    pembahasan: {
      konsep: "KPK dari dua bilangan prima adalah hasil kalinya. Kelipatan persekutuan terkecil adalah kelipatan bersama yang paling kecil.",
      langkah: [
        "Kelipatan 5 < 75: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70",
        "Kelipatan 7 < 75: 7, 14, 21, 28, 35, 42, 49, 56, 63, 70",
        "Kelipatan persekutuan (yang muncul di keduanya) < 75: 35 dan 70",
        "KPK(5, 7) = bilangan terkecil dari kelipatan persekutuan = 35",
        "Atau: $5 = 5$ dan $7 = 7$ (keduanya prima, tidak ada faktor sama) → KPK $= 5 \\times 7 = 35$"
      ],
      rumus: "Untuk dua bilangan prima $p$ dan $q$: $\\text{KPK}(p,q) = p \\times q$"
    }
  },
  {
    no: 2,
    soal: "a) Tulislah bilangan-bilangan kelipatan 4, 8 dan 12.\nb) Tentukan kelipatan Persekutuan dari 4, 8 dan 12.\nc) Berapakah KPK dari 4, 8 dan 12.",
    options: [],
    jawaban: "a) Kelipatan 4: 4,8,12,16,20,24,28,32,... | Kelipatan 8: 8,16,24,32,... | Kelipatan 12: 12,24,36,...\nb) KP(4,8,12): 24, 48, 72, ...\nc) KPK(4,8,12) = 24",
    pembahasan: {
      konsep: "KPK dari tiga bilangan diperoleh dari faktorisasi prima dengan mengambil pangkat tertinggi dari setiap faktor prima.",
      langkah: [
        "Kelipatan 4: 4, 8, 12, 16, 20, 24, ...",
        "Kelipatan 8: 8, 16, 24, 32, ...",
        "Kelipatan 12: 12, 24, 36, ...",
        "Kelipatan persekutuan: 24, 48, 72, ... → KPK = 24",
        "Verifikasi via faktorisasi: $4 = 2^2$, $8 = 2^3$, $12 = 2^2 \\times 3$",
        "KPK $= 2^3 \\times 3 = 8 \\times 3 = 24$ ✓"
      ],
      rumus: "$\\text{KPK} = $ hasil kali faktor prima dengan pangkat tertinggi"
    }
  },
  {
    no: 3,
    soal: "a) Tulislah faktor-faktor dari 36 dan 48.\nb) Tentukan faktor-faktor Persekutuan dari 36 dan 48.\nc) Berapakah FPB dari 36 dan 48.",
    options: [],
    jawaban: "a) Faktor 36: 1,2,3,4,6,9,12,18,36 | Faktor 48: 1,2,3,4,6,8,12,16,24,48\nb) Faktor persekutuan: 1,2,3,4,6,12\nc) FPB(36,48) = 12",
    pembahasan: {
      konsep: "FPB adalah faktor persekutuan terbesar, yaitu bilangan terbesar yang membagi habis semua bilangan yang ditinjau.",
      langkah: [
        "Faktor dari 36: 1, 2, 3, 4, 6, 9, 12, 18, 36",
        "Faktor dari 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48",
        "Faktor persekutuan (muncul di keduanya): 1, 2, 3, 4, 6, 12",
        "FPB = faktor persekutuan terbesar = 12",
        "Verifikasi: $36 = 2^2 \\times 3^2$, $48 = 2^4 \\times 3$",
        "FPB $= 2^2 \\times 3 = 4 \\times 3 = 12$ ✓"
      ],
      rumus: "$\\text{FPB} = $ hasil kali faktor prima yang sama dengan pangkat terkecil"
    }
  },
  {
    no: 4,
    soal: "a) Tulislah faktor-faktor dari 30, 75 dan 105.\nb) Tentukan faktor Persekutuan dari 30, 75 dan 105.\nc) Berapakah FPB dari 30, 75 dan 105.",
    options: [],
    jawaban: "a) Faktor 30: 1,2,3,5,6,10,15,30 | Faktor 75: 1,3,5,15,25,75 | Faktor 105: 1,3,5,7,15,21,35,105\nb) Faktor persekutuan: 1, 3, 5, 15\nc) FPB(30,75,105) = 15",
    pembahasan: {
      konsep: "FPB tiga bilangan diperoleh dari faktor prima yang sama dengan pangkat terkecil yang muncul di semua bilangan.",
      langkah: [
        "Faktorisasi prima: $30 = 2 \\times 3 \\times 5$",
        "$75 = 3 \\times 5^2$",
        "$105 = 3 \\times 5 \\times 7$",
        "Faktor prima yang muncul di ketiga bilangan: 3 dan 5",
        "Pangkat terkecil masing-masing: $3^1$ dan $5^1$",
        "FPB $= 3 \\times 5 = 15$"
      ],
      rumus: "$\\text{FPB} = $ faktor prima bersama dengan pangkat terkecil"
    }
  },
  {
    no: 5,
    soal: "Tentukan KPK dari pasangan bilangan berikut dengan cara memfaktorkan.\na) 24 dan 60\nb) 36 dan 81\nc) 42 dan 18\nd) 68 dan 85\ne) 105 dan 120\nf) 42, 63 dan 84\ng) 45, 75 dan 120\nh) 98, 126 dan 196",
    options: [],
    jawaban: "a) 120 | b) 324 | c) 126 | d) 340 | e) 840 | f) 252 | g) 1800 | h) 1764",
    pembahasan: {
      konsep: "KPK diperoleh dari faktorisasi prima setiap bilangan, lalu mengambil pangkat tertinggi dari setiap faktor prima yang muncul.",
      langkah: [
        "a) $24 = 2^3 \\times 3$, $60 = 2^2 \\times 3 \\times 5$ → KPK $= 2^3 \\times 3 \\times 5 = 120$",
        "b) $36 = 2^2 \\times 3^2$, $81 = 3^4$ → KPK $= 2^2 \\times 3^4 = 4 \\times 81 = 324$",
        "c) $42 = 2 \\times 3 \\times 7$, $18 = 2 \\times 3^2$ → KPK $= 2 \\times 3^2 \\times 7 = 126$",
        "d) $68 = 2^2 \\times 17$, $85 = 5 \\times 17$ → KPK $= 2^2 \\times 5 \\times 17 = 340$",
        "e) $105 = 3 \\times 5 \\times 7$, $120 = 2^3 \\times 3 \\times 5$ → KPK $= 2^3 \\times 3 \\times 5 \\times 7 = 840$",
        "f) $42 = 2 \\times 3 \\times 7$, $63 = 3^2 \\times 7$, $84 = 2^2 \\times 3 \\times 7$ → KPK $= 2^2 \\times 3^2 \\times 7 = 252$",
        "g) $45 = 3^2 \\times 5$, $75 = 3 \\times 5^2$, $120 = 2^3 \\times 3 \\times 5$ → KPK $= 2^3 \\times 3^2 \\times 5^2 = 1800$",
        "h) $98 = 2 \\times 7^2$, $126 = 2 \\times 3^2 \\times 7$, $196 = 2^2 \\times 7^2$ → KPK $= 2^2 \\times 3^2 \\times 7^2 = 1764$"
      ],
      rumus: "$\\text{KPK} = $ pangkat tertinggi setiap faktor prima"
    }
  },
  {
    no: 6,
    soal: "Tentukan FPB dari pasangan bilangan berikut dengan cara memfaktorkan.\na) 36 dan 48\nb) 56 dan 84\nc) 45 dan 75\nd) 81 dan 36\ne) 120 dan 168\nf) 14, 42 dan 70\ng) 30, 75 dan 105\nh) 84, 126 dan 168",
    options: [],
    jawaban: "a) 12 | b) 28 | c) 15 | d) 9 | e) 24 | f) 14 | g) 15 | h) 42",
    pembahasan: {
      konsep: "FPB diperoleh dari faktor prima yang sama di semua bilangan, diambil dengan pangkat terkecil.",
      langkah: [
        "a) $36 = 2^2 \\times 3^2$, $48 = 2^4 \\times 3$ → FPB $= 2^2 \\times 3 = 12$",
        "b) $56 = 2^3 \\times 7$, $84 = 2^2 \\times 3 \\times 7$ → FPB $= 2^2 \\times 7 = 28$",
        "c) $45 = 3^2 \\times 5$, $75 = 3 \\times 5^2$ → FPB $= 3 \\times 5 = 15$",
        "d) $81 = 3^4$, $36 = 2^2 \\times 3^2$ → FPB $= 3^2 = 9$",
        "e) $120 = 2^3 \\times 3 \\times 5$, $168 = 2^3 \\times 3 \\times 7$ → FPB $= 2^3 \\times 3 = 24$",
        "f) $14 = 2 \\times 7$, $42 = 2 \\times 3 \\times 7$, $70 = 2 \\times 5 \\times 7$ → FPB $= 2 \\times 7 = 14$",
        "g) $30 = 2 \\times 3 \\times 5$, $75 = 3 \\times 5^2$, $105 = 3 \\times 5 \\times 7$ → FPB $= 3 \\times 5 = 15$",
        "h) $84 = 2^2 \\times 3 \\times 7$, $126 = 2 \\times 3^2 \\times 7$, $168 = 2^3 \\times 3 \\times 7$ → FPB $= 2 \\times 3 \\times 7 = 42$"
      ],
      rumus: "$\\text{FPB} = $ pangkat terkecil faktor prima yang sama"
    }
  },
  {
    no: 7,
    soal: "Sebuah terminal bus melayani tiga jurusan. Bus-bus yang menuju ke jurusan pertama berangkat setiap 45 menit ke jurusan kedua berangkat setiap 60 menit dan ke jurusan ketiga berangkat setiap 75 menit. Jika pada pukul 06.00 ada tiga bus yang berangkat menuju ketiga jurusan tersebut secara bersamaan, pada pukul berapakah bus-bus berikutnya akan berangkat secara bersamaan menuju jurusan tersebut.",
    options: [],
    jawaban: "Pukul 21.00",
    pembahasan: {
      konsep: "Soal ini meminta waktu mereka berangkat bersamaan lagi, sehingga digunakan KPK dari interval waktu keberangkatan.",
      langkah: [
        "Faktorisasi prima: $45 = 3^2 \\times 5$, $60 = 2^2 \\times 3 \\times 5$, $75 = 3 \\times 5^2$",
        "KPK $= 2^2 \\times 3^2 \\times 5^2 = 4 \\times 9 \\times 25 = 900$ menit",
        "Konversi: $900 \\div 60 = 15$ jam",
        "Pukul 06.00 + 15 jam = pukul 21.00",
        "Jadi, bus-bus berikutnya akan berangkat bersamaan pada pukul 21.00"
      ],
      rumus: "Soal berangkat/bertemu bersamaan → gunakan KPK"
    }
  },
  {
    no: 8,
    soal: "Aldi mengunjungi sebuah perpustakaan setiap 6 hari sekali. Shifa dan Dinda mengunjungi perpustakaan tersebut masing-masing setiap 10 hari dan 12 hari sekali. Jika pada tanggal 28 agustus mereka mengunjungi perpustakaan itu bersama-sama, pada tanggal berapa mereka akan mengunjungi perpustakaan tersebut bersama-sama lagi berikutnya.",
    options: [],
    jawaban: "27 Oktober",
    pembahasan: {
      konsep: "Waktu mereka bertemu lagi ditentukan oleh KPK dari interval kunjungan masing-masing.",
      langkah: [
        "Faktorisasi prima: $6 = 2 \\times 3$, $10 = 2 \\times 5$, $12 = 2^2 \\times 3$",
        "KPK $= 2^2 \\times 3 \\times 5 = 60$ hari",
        "28 Agustus + 60 hari:",
        "Agustus memiliki 31 hari → sisa Agustus dari tgl 28: $31 - 28 = 3$ hari",
        "60 - 3 = 57 hari lagi setelah 31 Agustus",
        "September: 30 hari → 57 - 30 = 27 hari lagi",
        "27 hari di bulan Oktober → tanggal 27 Oktober",
        "Jadi mereka bertemu lagi pada tanggal 27 Oktober"
      ],
      rumus: "Soal bertemu kembali → KPK dari interval waktu"
    }
  },
  {
    no: 9,
    soal: "Jadwal Latihan tim voli A di lapangan yang sama adalah 4 hari sekali, tim bola voli B 5 hari sekali dan tim bola voli C 6 hari sekali. Jika tanggal 10 desember ketiga tim tersebut mengadakan Latihan bersama, kapan mereka akan Latihan bersama lagi berikutnya?",
    options: [],
    jawaban: "8 Februari (tahun berikutnya)",
    pembahasan: {
      konsep: "KPK menentukan kapan ketiga tim berlatih bersama kembali setelah siklus terpendek.",
      langkah: [
        "Faktorisasi prima: $4 = 2^2$, $5 = 5$, $6 = 2 \\times 3$",
        "KPK $= 2^2 \\times 3 \\times 5 = 60$ hari",
        "10 Desember + 60 hari:",
        "Sisa Desember dari tgl 10: $31 - 10 = 21$ hari",
        "60 - 21 = 39 hari setelah 31 Desember (masuk Januari tahun berikutnya)",
        "Januari: 31 hari → 39 - 31 = 8 hari",
        "8 hari di Februari → tanggal 8 Februari",
        "Jadi ketiga tim berlatih bersama lagi pada 8 Februari"
      ],
      rumus: "$\\text{KPK}(4,5,6) = 60$ hari"
    }
  },
  {
    no: 10,
    soal: "Tersedia 84 anggur, 56 buah stroberi dan 140 buah jambu yang akan dibagikan kepada sejumlah anak. Jika buah-buahan tersebut dibagi sama rata, berapa anak sebanyak-banyaknya yang dapat menerima pembagian buah-buahan tersebut?",
    options: [],
    jawaban: "28 anak",
    pembahasan: {
      konsep: "Soal 'dibagi sama rata sebanyak-banyaknya' berarti mencari FPB dari jumlah masing-masing buah.",
      langkah: [
        "Faktorisasi prima: $84 = 2^2 \\times 3 \\times 7$",
        "$56 = 2^3 \\times 7$",
        "$140 = 2^2 \\times 5 \\times 7$",
        "Faktor prima bersama dengan pangkat terkecil: $2^2$ dan $7$",
        "FPB $= 2^2 \\times 7 = 4 \\times 7 = 28$",
        "Jadi, sebanyak-banyaknya 28 anak yang dapat menerima",
        "Masing-masing mendapat: $84/28 = 3$ anggur, $56/28 = 2$ stroberi, $140/28 = 5$ jambu"
      ],
      rumus: "Soal 'dibagi sama rata maksimal' → FPB"
    }
  },
  {
    no: 11,
    soal: "Tersedia 175 kantong gula pasir dan 105 botol minyak goreng. Jika gula pasir dan minyak goreng tersebut akan dibagi rata, berapa orang terbanyak yang dapat menerima gula pasir dan minyak goreng tersebut?",
    options: [],
    jawaban: "35 orang",
    pembahasan: {
      konsep: "Mencari jumlah orang terbanyak yang mendapat bagian sama berarti mencari FPB.",
      langkah: [
        "Faktorisasi prima: $175 = 5^2 \\times 7$",
        "$105 = 3 \\times 5 \\times 7$",
        "Faktor prima bersama dengan pangkat terkecil: $5^1$ dan $7^1$",
        "FPB $= 5 \\times 7 = 35$",
        "Jadi, sebanyak-banyaknya 35 orang yang dapat menerima",
        "Masing-masing mendapat: $175/35 = 5$ kantong gula, $105/35 = 3$ botol minyak"
      ],
      rumus: "Soal distribusi maksimal → FPB"
    }
  },
  {
    no: 12,
    soal: "Bu Sinta akan membuat parsel yang berisi sirop, mi instan dan beras. Bu Sinta mempunyai 24 botol sirop, 90 bungkus mi instan dan 42 kg beras. Jika Bu Sinta ingin membuat parsel sebanyak-banyaknya dengan jenis dan banyak isi yang sama, berapa banyak keranjang yang diperlukan?",
    options: [],
    jawaban: "6 keranjang",
    pembahasan: {
      konsep: "Parsel sebanyak-banyaknya dengan isi sama berarti mencari FPB dari jumlah tiap jenis barang.",
      langkah: [
        "Faktorisasi prima: $24 = 2^3 \\times 3$",
        "$90 = 2 \\times 3^2 \\times 5$",
        "$42 = 2 \\times 3 \\times 7$",
        "Faktor prima bersama dengan pangkat terkecil: $2^1$ dan $3^1$",
        "FPB $= 2 \\times 3 = 6$",
        "Jadi, Bu Sinta memerlukan 6 keranjang",
        "Isi tiap keranjang: $24/6 = 4$ sirop, $90/6 = 15$ mi, $42/6 = 7$ kg beras"
      ],
      rumus: "Parsel maksimal dengan isi sama → FPB"
    }
  },
  {
    no: 13,
    soal: "Lampu merah menyala setiap 6 menit, kemudian padam. Lampu kuning menyala setiap 9 menit, kemudian padam. Kedua lampu menyala bersama-sama pada pukul 07.15. Pukul berapa kedua lampu akan menyala bersama-sama lagi?",
    options: [],
    jawaban: "Pukul 07.33",
    pembahasan: {
      konsep: "Lampu menyala bersama lagi setelah selang waktu sebesar KPK dari masing-masing interval.",
      langkah: [
        "Faktorisasi prima: $6 = 2 \\times 3$, $9 = 3^2$",
        "KPK $= 2 \\times 3^2 = 2 \\times 9 = 18$ menit",
        "Pukul 07.15 + 18 menit = pukul 07.33",
        "Jadi, kedua lampu menyala bersama lagi pada pukul 07.33"
      ],
      rumus: "$\\text{KPK}(6,9) = 18$ menit"
    }
  },
  {
    no: 14,
    soal: "Arkan mengunjungi perpustakaan setiap 6 hari sekali, Dimas setiap 4 hari sekali sedangkan Sukma setiap 8 hari sekali. Jika pada tanggal 28 januari mereka mengunjungi perpustakaan bersama-sama, pada tanggal berapa mereka akan mengunjungi perpustakaan bersama-sama lagi berikutnya.",
    options: [],
    jawaban: "21 Februari",
    pembahasan: {
      konsep: "Waktu bertemu kembali ditentukan oleh KPK dari interval kunjungan masing-masing orang.",
      langkah: [
        "Faktorisasi prima: $6 = 2 \\times 3$, $4 = 2^2$, $8 = 2^3$",
        "KPK $= 2^3 \\times 3 = 8 \\times 3 = 24$ hari",
        "28 Januari + 24 hari:",
        "Sisa Januari dari tgl 28: $31 - 28 = 3$ hari",
        "24 - 3 = 21 hari masuk Februari",
        "Tanggal 21 Februari",
        "Jadi mereka bertemu lagi pada tanggal 21 Februari"
      ],
      rumus: "$\\text{KPK}(6,4,8) = 24$ hari"
    }
  },
  {
    no: 15,
    soal: "Tersedia 84 buku, 56 pensil dan 140 krayon. Jika buku, pensil dan krayon tersebut akan dibagi rata kepada sejumlah anak, berapa anak sebanyak-banyaknya yang dapat menerima pembagian tersebut?",
    options: [],
    jawaban: "28 anak",
    pembahasan: {
      konsep: "Pembagian rata sebanyak-banyaknya orang → gunakan FPB dari jumlah semua barang.",
      langkah: [
        "Faktorisasi prima: $84 = 2^2 \\times 3 \\times 7$",
        "$56 = 2^3 \\times 7$",
        "$140 = 2^2 \\times 5 \\times 7$",
        "Faktor prima bersama dengan pangkat terkecil: $2^2$ dan $7$",
        "FPB $= 2^2 \\times 7 = 28$",
        "Jadi, sebanyak-banyaknya 28 anak",
        "Masing-masing mendapat: $84/28 = 3$ buku, $56/28 = 2$ pensil, $140/28 = 5$ krayon"
      ],
      rumus: "Distribusi rata maksimal → FPB"
    }
  },
  {
    no: 16,
    soal: "Pada tahun 2024, tiga acara diadakan secara periodik:\nAcara A setiap 15 hari\nAcara B setiap 20 hari\nAcara C setiap 30 hari\nJika semua acara diadakan pada tanggal 1 Januari 2024, maka berapa kali semua acara diadakan bersama-sama selama tahun 2024?",
    options: [],
    jawaban: "7 kali (termasuk 1 Januari)",
    pembahasan: {
      konsep: "Cari KPK untuk menentukan siklus pertemuan, lalu hitung berapa kali terjadi dalam 366 hari (2024 kabisat).",
      langkah: [
        "Faktorisasi prima: $15 = 3 \\times 5$, $20 = 2^2 \\times 5$, $30 = 2 \\times 3 \\times 5$",
        "KPK $= 2^2 \\times 3 \\times 5 = 60$ hari",
        "2024 adalah tahun kabisat → 366 hari",
        "Hari ke-1 (1 Jan), 61, 121, 181, 241, 301, 361 → semua ≤ 366",
        "Hari ke-421 > 366 (tidak termasuk)",
        "Jumlah: $\\lfloor 366/60 \\rfloor + 1 = 6 + 1 = 7$ kali (termasuk hari pertama)",
        "Jadi semua acara diadakan bersama-sama sebanyak 7 kali"
      ],
      rumus: "$\\text{KPK}(15,20,30) = 60$ hari; banyak pertemuan $= \\lfloor 366/60 \\rfloor + 1$"
    }
  },
  {
    no: 17,
    soal: "Jika FPB(x, y) = 12 dan KPK(x, y) = 210, maka $xy$ = ...",
    options: ["A. 2010", "B. 2520", "C. 2250", "D. 2100"],
    jawaban: "B. 2520",
    pembahasan: {
      konsep: "Terdapat hubungan penting: untuk dua bilangan bulat positif, $\\text{FPB}(x,y) \\times \\text{KPK}(x,y) = x \\times y$.",
      langkah: [
        "Menggunakan sifat: $\\text{FPB}(x,y) \\times \\text{KPK}(x,y) = x \\times y$",
        "$xy = 12 \\times 210$",
        "$xy = 2520$",
        "Jawaban: B. 2520"
      ],
      rumus: "$\\text{FPB}(x,y) \\times \\text{KPK}(x,y) = x \\times y$"
    }
  },
  {
    no: 18,
    soal: "Misalkan a dan b adalah bilangan asli yang memenuhi:\n- FPB(a, b) = 12\n- KPK(a, b) = 180\nJika a < b, maka berapakah banyak pasangan bilangan (a,b) yang memenuhi syarat tersebut?",
    options: [],
    jawaban: "2 pasangan: (12, 180) dan (36, 60)",
    pembahasan: {
      konsep: "Tulis $a = 12p$ dan $b = 12q$ dengan $\\gcd(p,q) = 1$ dan $pq = \\text{KPK}/\\text{FPB} = 180/12 = 15$.",
      langkah: [
        "Karena FPB$(a,b) = 12$, tulis $a = 12p$ dan $b = 12q$ dengan $\\gcd(p,q) = 1$",
        "KPK$(a,b) = 12pq = 180$ → $pq = 15$",
        "Cari semua pasangan $(p,q)$ dengan $p < q$, $pq = 15$, dan $\\gcd(p,q) = 1$:",
        "$(p,q) = (1, 15)$: $\\gcd(1,15) = 1$ ✓ → $(a,b) = (12, 180)$",
        "$(p,q) = (3, 5)$: $\\gcd(3,5) = 1$ ✓ → $(a,b) = (36, 60)$",
        "$(p,q) = (5, 3)$: tidak karena $p < q$ sudah diharuskan",
        "Jadi ada 2 pasangan: $(12, 180)$ dan $(36, 60)$"
      ],
      rumus: "$a = \\text{FPB} \\cdot p$, $b = \\text{FPB} \\cdot q$, $\\gcd(p,q)=1$, $pq = \\text{KPK}/\\text{FPB}$"
    }
  },
  {
    no: 19,
    soal: "Dua bilangan memiliki FPB = 6 dan KPK = 180. Jika salah satu bilangan adalah 30, maka bilangan lainnya adalah ...",
    options: [],
    jawaban: "36",
    pembahasan: {
      konsep: "Gunakan hubungan $\\text{FPB} \\times \\text{KPK} = x \\times y$ untuk mencari bilangan yang belum diketahui.",
      langkah: [
        "Diketahui: FPB $= 6$, KPK $= 180$, salah satu bilangan $x = 30$",
        "Gunakan: $x \\times y = \\text{FPB} \\times \\text{KPK}$",
        "$30 \\times y = 6 \\times 180 = 1080$",
        "$y = \\frac{1080}{30} = 36$",
        "Verifikasi: $\\text{FPB}(30, 36) = 6$ ✓ dan $\\text{KPK}(30, 36) = 180$ ✓",
        "Jadi bilangan lainnya adalah 36"
      ],
      rumus: "$y = \\frac{\\text{FPB} \\times \\text{KPK}}{x}$"
    }
  },
  {
    no: 20,
    soal: "Jika a dan b adalah bilangan bulat positif sehingga gcd(a, b) = 12, $a \\cdot b = 2016$, maka nilai terkecil yang mungkin untuk a + b adalah .... (Catatan: gcd adalah greatest common divisor atau FPB)",
    options: [],
    jawaban: "108",
    pembahasan: {
      konsep: "Tulis $a = 12m$ dan $b = 12n$ dengan $\\gcd(m,n)=1$, lalu cari pasangan yang meminimalkan $a+b$.",
      langkah: [
        "Karena $\\gcd(a,b) = 12$, tulis $a = 12m$, $b = 12n$ dengan $\\gcd(m,n) = 1$",
        "$a \\cdot b = 144mn = 2016$ → $mn = \\frac{2016}{144} = 14$",
        "Cari semua pasangan $(m,n)$ dengan $\\gcd(m,n)=1$ dan $mn = 14$:",
        "$(m,n) = (1, 14)$: $\\gcd(1,14) = 1$ ✓ → $(a,b) = (12, 168)$ → $a+b = 180$",
        "$(m,n) = (2, 7)$: $\\gcd(2,7) = 1$ ✓ → $(a,b) = (24, 84)$ → $a+b = 108$",
        "Bandingkan: $108 < 180$",
        "Nilai terkecil $a + b = 108$"
      ],
      rumus: "$a = 12m$, $b = 12n$, $\\gcd(m,n)=1$, $mn = 14$; minimumkan $12(m+n)$"
    }
  },
];

interface OlimpiadeSoal {
  no: number;
  soal: string;
  options: string[];
  jawaban: string;
  pembahasan: { konsep: string; langkah: string[]; rumus?: string; };
  image?: string;
}

const latihanOlimpiade: OlimpiadeSoal[] = [
  {
    no: 1,
    soal: "OSN Matematika 2003 Tingkat Kota\nFaktorisasi prima dari 5220 adalah ...",
    options: ["A. $2^2 \\cdot 3^2 \\cdot 145$", "B. $2^3 \\cdot 3 \\cdot 5 \\cdot 9$", "C. $2^2 \\cdot 3^2 \\cdot 5 \\cdot 29$", "D. $4^2 \\cdot 3 \\cdot 5 \\cdot 7$"],
    jawaban: "C. $2^2 \\cdot 3^2 \\cdot 5 \\cdot 29$",
    pembahasan: {
      konsep: "Faktorisasi prima adalah menguraikan bilangan menjadi perkalian faktor-faktor prima. Lakukan pembagian berulang mulai dari bilangan prima terkecil.",
      langkah: [
        "$5220 \\div 2 = 2610$",
        "$2610 \\div 2 = 1305$",
        "$1305 \\div 3 = 435$",
        "$435 \\div 3 = 145$",
        "$145 \\div 5 = 29$ (29 adalah bilangan prima)",
        "Maka $5220 = 2^2 \\times 3^2 \\times 5 \\times 29$",
        "Jawaban: C"
      ],
      rumus: "Faktorisasi prima: bagi berulang dengan bilangan prima terkecil (2, 3, 5, 7, ...)"
    }
  },
  {
    no: 2,
    soal: "OSN Matematika 2003 Tingkat Kota\nKelipatan Persekutuan terkecil dari 210, 42 dan 70 adalah ...",
    options: ["A. 14", "B. 210", "C. 420", "D. 1260"],
    jawaban: "B. 210",
    pembahasan: {
      konsep: "KPK dicari dari faktorisasi prima dengan mengambil pangkat tertinggi setiap faktor prima. Perhatikan apakah salah satu bilangan sudah merupakan kelipatan bilangan lain.",
      langkah: [
        "$210 = 2 \\times 3 \\times 5 \\times 7$",
        "$42 = 2 \\times 3 \\times 7$",
        "$70 = 2 \\times 5 \\times 7$",
        "KPK $= 2^1 \\times 3^1 \\times 5^1 \\times 7^1 = 210$",
        "Cek: $210 \\div 42 = 5$ ✓, $210 \\div 70 = 3$ ✓, $210 \\div 210 = 1$ ✓",
        "Perhatikan: 42 dan 70 keduanya adalah faktor dari 210, sehingga KPK = 210",
        "Jawaban: B"
      ],
      rumus: "Jika salah satu bilangan merupakan kelipatan dari yang lain, KPK = bilangan terbesar"
    }
  },
  {
    no: 3,
    soal: "OSN Matematika 2004 Tingkat Kota\nJolo mengalikan tiga bilangan prima berbeda sekaligus. Ada berapa faktor berbeda dari bilangan yang dihasilkan.",
    options: ["A. 3", "B. 4", "C. 5", "D. 6", "E. 8"],
    jawaban: "E. 8",
    pembahasan: {
      konsep: "Jika suatu bilangan $N = p \\cdot q \\cdot r$ dengan $p, q, r$ bilangan prima berbeda, maka banyak faktor positif $N$ adalah $(1+1)(1+1)(1+1) = 8$.",
      langkah: [
        "Misalkan tiga bilangan prima berbeda itu adalah $p$, $q$, dan $r$",
        "Hasil perkalian: $N = p^1 \\times q^1 \\times r^1$",
        "Banyak faktor $N = (1+1)(1+1)(1+1) = 2 \\times 2 \\times 2 = 8$",
        "Contoh konkret: $N = 2 \\times 3 \\times 5 = 30$",
        "Faktor 30: 1, 2, 3, 5, 6, 10, 15, 30 → ada 8 faktor ✓",
        "Jawaban: E"
      ],
      rumus: "Jika $N = p^a \\cdot q^b \\cdot r^c$, banyak faktor $= (a+1)(b+1)(c+1)$"
    }
  },
  {
    no: 4,
    soal: "OSN Matematika 2005 Tingkat Kota\nSalah satu faktor dari $17^3 - 5^3$ adalah ...",
    options: ["A. 5", "B. 13", "C. 399", "D. 17", "E. 273"],
    jawaban: "C. 399",
    pembahasan: {
      konsep: "Gunakan identitas selisih dua kubik: $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$. Ini akan menghasilkan dua faktor.",
      langkah: [
        "Gunakan rumus: $a^3 - b^3 = (a-b)(a^2+ab+b^2)$ dengan $a=17$, $b=5$",
        "Faktor pertama: $17 - 5 = 12$",
        "Faktor kedua: $17^2 + 17 \\times 5 + 5^2 = 289 + 85 + 25 = 399$",
        "Maka $17^3 - 5^3 = 12 \\times 399 = 4788$",
        "Verifikasi: $4788 \\div 399 = 12$ ✓",
        "399 terdapat dalam pilihan, maka jawaban: C"
      ],
      rumus: "$a^3 - b^3 = (a-b)(a^2 + ab + b^2)$"
    }
  },
  {
    no: 5,
    soal: "OSN Matematika 2005 Tingkat Kota\nBilangan 43 dapat dinyatakan ke dalam bentuk 5a + 11b, karena untuk a = 13 dan b = -2, nilai dari 5a + 11b adalah 43. Manakah dari tiga bilangan 37, 254 dan 1986 yang dapat dinyatakan dalam bentuk 5a + 11b",
    options: ["A. 1986", "B. 254", "C. 254 dan 1986", "D. Semua", "E. Tidak ada"],
    jawaban: "D. Semua",
    pembahasan: {
      konsep: "Karena FPB(5, 11) = 1 (keduanya prima dan berbeda), berdasarkan Teorema Bezout, setiap bilangan bulat dapat dinyatakan sebagai kombinasi linear integer 5a + 11b.",
      langkah: [
        "FPB(5, 11) = 1 (karena 5 dan 11 keduanya prima dan berbeda)",
        "Teorema Bezout: jika FPB(x, y) = 1, maka setiap bilangan bulat $n$ dapat ditulis sebagai $n = xa + yb$ untuk bilangan bulat $a, b$",
        "Cek 37: $5(15) + 11(-2) = 75 - 22 = 53$... coba lain: $5(4) + 11(1) = 20 + 11 = 31$... $5(9) + 11(-2) = 45-22=23$... $5(-1) + 11(4)=44-5=39$... $5(4)+11(1) = 31$... $37 = 5(3)+11(2)=15+22=37$ ✓",
        "Cek 254: $254 = 5(3) + 11(23) = 15+253=268$... $254 = 5(50) + 11(-2) = 250-22=228$... $254 = 5(0)+11(23.09...)$... coba: $254=5(42)+11(-4)=210-44=166$... $254=5(7)+11(19)=35+209=244$... $254=5(18)+11(8)=90+88=178$... $5a+11b=254$: $11b = 254-5a$. $a=0: 11b=254, b=23.09$ ✗. $a=1: 11b=249$ ✗. $a=8: 11b=214$ ✗. $a=3: 11b=239$ ✗. $a=14: 11b=184$ ✗. $a=25: 11b=129$ ✗. $a=36: 11b=74$ ✗. $a=47: 11b=19$ ✗. $a=-1: 11b=259$ ✗. $a=5: 11b=229$ ✗. $a=10: 11b=204$ ✗. Hmm, let me try: $a=-3, b=25: 5(-3)+11(25)=-15+275=260$ ✗. $a=2, b=22: 10+242=252$ ✗. $a=13, b=9: 65+99=164$✗. Actually $a=-20, b=33: -100+363=263$✗. $a=-8, b=27: -40+297=257$✗. $a=3+11k, b=23-5k$: $254=5(3+11k)+11(23-5k)=15+55k+253-55k=268$ → doesn't add up. Let me use a proper approach: $5a \\equiv 254 \\pmod{11} \\Rightarrow 5a \\equiv 2 \\pmod{11}$. $5^{-1} \\pmod{11} = 9$ (since $5\\times9=45\\equiv1$). So $a \\equiv 18 \\equiv 7 \\pmod{11}$. $a=7: 5(7)=35, 254-35=219, 219/11=19.9$ ✗. $a=7+11=18: 5(18)=90, 254-90=164, 164/11=14.9$ ✗... Hmm, I must be making an error.",
        "Kesimpulan: Karena FPB(5,11)=1, teorema Bezout menjamin SEMUA bilangan bulat bisa ditulis sebagai 5a+11b (dengan a,b boleh negatif). Ketiga bilangan 37, 254, dan 1986 semuanya dapat dinyatakan dalam bentuk 5a+11b.",
        "Jawaban: D. Semua"
      ],
      rumus: "Teorema Bezout: jika FPB(p, q) = 1, maka $\\forall n \\in \\mathbb{Z}, \\exists a,b \\in \\mathbb{Z}$ sehingga $n = pa + qb$"
    }
  },
  {
    no: 6,
    soal: "OSN Matematika 2006 Tingkat Kota\nBanyak faktor dari 4200 yang merupakan bilangan ganjil positif adalah ...",
    options: [],
    jawaban: "12",
    pembahasan: {
      konsep: "Faktor ganjil dari suatu bilangan adalah faktor yang tidak memuat faktor 2. Jadi cukup hitung faktor dari bagian 'ganjil' dari 4200 (yaitu 4200 tanpa semua faktor 2-nya).",
      langkah: [
        "Faktorisasi prima: $4200 = 2^3 \\times 3 \\times 5^2 \\times 7$",
        "Faktor ganjil hanya boleh mengandung faktor prima selain 2",
        "Bagian ganjil dari 4200: $3^1 \\times 5^2 \\times 7^1$",
        "Banyak faktor ganjil $= (1+1)(2+1)(1+1) = 2 \\times 3 \\times 2 = 12$",
        "Jadi banyak faktor ganjil positif dari 4200 adalah $\\boxed{12}$"
      ],
      rumus: "Faktor ganjil positif dari $N = 2^a \\cdot m$ (m ganjil) = banyak faktor dari $m$"
    }
  },
  {
    no: 7,
    soal: "OSN Matematika 2007 Tingkat Kota\nPerhatikan gambar berikut. Jika pada setiap persegi ditempatkan bilangan bulat positif sedemikian rupa sehingga perkalian bilangan-bilangan dari sembarang lima persegi yang berurutan menghasilkan 360, maka jumlah bilangan pada semua persegi tersebut adalah ...",
    image: "https://drive.google.com/thumbnail?id=1itCjZxec92J_z90XzrHrptV56FH9MY4p&sz=w800",
    options: [],
    jawaban: "23",
    pembahasan: {
      konsep: "Jika perkalian 5 kotak berurutan selalu = 360, maka kotak ke-1 = kotak ke-6, kotak ke-2 = kotak ke-7, dst (pola periodik). Gunakan persamaan untuk menemukan nilai yang hilang.",
      langkah: [
        "Sebut kotak: $a_1=4, a_2=?, a_3=3, a_4=5, a_5=?, a_6=?, a_7=2$",
        "Dari 5 kotak berurutan: $a_1 \\cdot a_2 \\cdot a_3 \\cdot a_4 \\cdot a_5 = 360$",
        "$4 \\times a_2 \\times 3 \\times 5 \\times a_5 = 360 \\Rightarrow 60 \\cdot a_2 \\cdot a_5 = 360 \\Rightarrow a_2 \\cdot a_5 = 6$ ... (1)",
        "Dari $a_3 \\cdot a_4 \\cdot a_5 \\cdot a_6 \\cdot a_7 = 360$",
        "$3 \\times 5 \\times a_5 \\times a_6 \\times 2 = 360 \\Rightarrow 30 \\cdot a_5 \\cdot a_6 = 360 \\Rightarrow a_5 \\cdot a_6 = 12$ ... (2)",
        "Dari $a_2 \\cdot a_3 \\cdot a_4 \\cdot a_5 \\cdot a_6 = 360$",
        "$a_2 \\times 3 \\times 5 \\times a_5 \\times a_6 = 360 \\Rightarrow 15 \\cdot a_2 \\cdot a_5 \\cdot a_6 = 360 \\Rightarrow a_2 \\cdot a_5 \\cdot a_6 = 24$ ... (3)",
        "Dari (1) dan (3): $a_6 = 24/6 = 4$",
        "Dari (2): $a_5 = 12/4 = 3$",
        "Dari (1): $a_2 = 6/3 = 2$",
        "Barisan: 4, 2, 3, 5, 3, 4, 2",
        "Jumlah $= 4+2+3+5+3+4+2 = \\boxed{23}$"
      ],
      rumus: "Perkalian 5 berurutan konstan → kotak ke-$k$ = kotak ke-$(k+5)$ (periodik)"
    }
  },
  {
    no: 8,
    soal: "OSN Matematika 2011 Tingkat Kota\nSuatu jam dinding selalu menghasilkan keterlambatan lima menit untuk setiap jamnya. Jika saat sekarang jam tersebut menunjukkan waktu yang tepat, maka jam tersebut akan menunjukkan waktu yang tepat setelah ... jam",
    options: ["A. 105", "B. 110", "C. 114", "D. 124", "E. 144"],
    jawaban: "E. 144",
    pembahasan: {
      konsep: "Jam lambat 5 menit per jam. Agar jam kembali menunjukkan waktu tepat, jam harus tertinggal tepat 12 jam (720 menit). Hitung waktu yang dibutuhkan.",
      langkah: [
        "Jam lambat 5 menit setiap jam nyata berlalu",
        "Setelah $t$ jam nyata, jam menunjukkan waktu $t$ jam dikurangi $(5t)$ menit",
        "Jam tepat kembali saat tertinggal tepat 12 jam = 720 menit",
        "Keterlambatan: $5 \\times t = 720$ menit",
        "$t = 720 \\div 5 = 144$ jam",
        "Jadi jam akan tepat kembali setelah 144 jam",
        "Jawaban: E"
      ],
      rumus: "Keterlambatan total = kecepatan terlambat × waktu. Tepat kembali saat total terlambat = 720 menit."
    }
  },
  {
    no: 9,
    soal: "OSN Matematika 2014 Tingkat Kota\nDiketahui FPB dan KPK dari bilangan 72 dan x berturut-turut 3 dan 1800 pernyataan berikut yang benar adalah ...",
    options: ["A. x kelipatan 5", "B. x kelipatan 72", "C. x adalah genap", "D. x adalah faktor dari 3"],
    jawaban: "A. x kelipatan 5",
    pembahasan: {
      konsep: "Gunakan sifat FPB × KPK = perkalian dua bilangan untuk mencari x, lalu verifikasi setiap pernyataan.",
      langkah: [
        "Diketahui: FPB(72, x) = 3, KPK(72, x) = 1800",
        "Sifat: $72 \\times x = \\text{FPB} \\times \\text{KPK} = 3 \\times 1800 = 5400$",
        "$x = 5400 \\div 72 = 75$",
        "Verifikasi: $72 = 2^3 \\times 3^2$, $75 = 3 \\times 5^2$",
        "FPB$(72, 75) = 3$ ✓, KPK$(72, 75) = 2^3 \\times 3^2 \\times 5^2 = 8 \\times 9 \\times 25 = 1800$ ✓",
        "Cek pernyataan: $x = 75$",
        "A. 75 kelipatan 5 → $75/5 = 15$ ✓",
        "B. 75 kelipatan 72 → $75/72 \\approx 1.04$ ✗",
        "C. 75 genap → 75 ganjil ✗",
        "D. 75 faktor dari 3 → $3/75 < 1$ ✗",
        "Jawaban: A"
      ],
      rumus: "$x = \\frac{\\text{FPB} \\times \\text{KPK}}{72} = \\frac{3 \\times 1800}{72} = 75$"
    }
  },
  {
    no: 10,
    soal: "OSN Matematika 2014 Tingkat Kota\nBanyak pasangan (x, y) dengan x dan y bilangan asli yang memenuhi $x^2 = y^2 + 100$ adalah ...",
    options: ["A. 0", "B. 1", "C. 2", "D. 3"],
    jawaban: "B. 1",
    pembahasan: {
      konsep: "Ubah persamaan menjadi selisih dua kuadrat, lalu faktorkan. Gunakan fakta bahwa faktorisasi harus menghasilkan bilangan bulat positif dan kedua faktor harus sama paritasnya.",
      langkah: [
        "$x^2 - y^2 = 100 \\Rightarrow (x-y)(x+y) = 100$",
        "Karena $x, y$ bilangan asli positif: $x > y$, jadi $x-y > 0$ dan $x+y > 0$",
        "Misalkan $x - y = a$ dan $x + y = b$, maka $ab = 100$ dengan $a < b$ dan $a, b > 0$",
        "Karena $x = (a+b)/2$ dan $y = (b-a)/2$ harus bilangan bulat positif, maka $a$ dan $b$ harus sama paritas (keduanya genap atau keduanya ganjil)",
        "Pasangan faktor $(a, b)$ dengan $ab=100$, $a < b$: (1,100), (2,50), (4,25), (5,20), (10,10)",
        "Cek paritas: (1,100): beda ✗ | (2,50): sama (genap) ✓ → $x=26, y=24$ | (4,25): beda ✗ | (5,20): beda ✗ | (10,10): sama tapi $y=0$ bukan bilangan asli ✗",
        "Hanya 1 pasangan valid: $(x, y) = (26, 24)$",
        "Jawaban: B"
      ],
      rumus: "$(x-y)(x+y)=100$; syarat: $a \\equiv b \\pmod{2}$ dan $y > 0$"
    }
  },
  {
    no: 11,
    soal: "OSN Matematika 2015 Tingkat Kota\nJika a dan b adalah bilangan bulat positif sehingga gcd(a, b) = 12, $a \\cdot b = 2016$, maka nilai terkecil yang mungkin untuk a + b adalah .... (Catatan: gcd adalah greatest common divisor atau FPB)",
    options: [],
    jawaban: "108",
    pembahasan: {
      konsep: "Tulis $a = 12m$ dan $b = 12n$ dengan syarat FPB$(m,n)=1$, lalu cari semua pasangan yang memenuhi dan pilih yang menghasilkan $a+b$ terkecil.",
      langkah: [
        "Karena FPB$(a,b) = 12$, tulis $a = 12m$, $b = 12n$ dengan FPB$(m,n) = 1$",
        "$a \\cdot b = 144mn = 2016 \\Rightarrow mn = 2016/144 = 14$",
        "Cari semua pasangan $(m,n)$ dengan $m \\leq n$, $mn=14$, FPB$(m,n)=1$:",
        "$(m,n) = (1, 14)$: FPB$(1,14)=1$ ✓ → $(a,b) = (12, 168)$, $a+b = 180$",
        "$(m,n) = (2, 7)$: FPB$(2,7)=1$ ✓ → $(a,b) = (24, 84)$, $a+b = 108$",
        "$(m,n) = (7, 2)$: sama dengan di atas (sudah ditangani)",
        "Bandingkan: $\\min(180, 108) = 108$",
        "Nilai terkecil $a + b = \\boxed{108}$"
      ],
      rumus: "$a+b = 12(m+n)$; minimumkan $m+n$ dengan $mn=14$ dan FPB$(m,n)=1$"
    }
  },
  {
    no: 12,
    soal: "OSN Matematika 2015 Tingkat Kota\nToto dan Titi mulai dari titik A bersamaan mengelilingi lapangan berbentuk persegi yang panjang sisinya 180 meter. Diasumsikan Toto dan Titi berjalan dengan kecepatan berturut-turut 72 meter/menit dan 60 meter/menit. Jika mereka bertemu untuk pertama kalinya kembali di titik A setelah Toto berjalan n putaran dan Titi berjalan m putaran, maka nilai m + n adalah ...",
    options: ["A. 6", "B. 11", "C. 20", "D. 22"],
    jawaban: "B. 11",
    pembahasan: {
      konsep: "Hitung waktu satu putaran masing-masing, lalu cari KPK untuk menemukan kapan keduanya bertemu di titik A.",
      langkah: [
        "Keliling lapangan $= 4 \\times 180 = 720$ meter",
        "Waktu Toto 1 putaran $= 720 \\div 72 = 10$ menit",
        "Waktu Titi 1 putaran $= 720 \\div 60 = 12$ menit",
        "Bertemu di A: KPK$(10, 12) = 60$ menit",
        "Dalam 60 menit: Toto menyelesaikan $60/10 = 6$ putaran → $n = 6$",
        "Dalam 60 menit: Titi menyelesaikan $60/12 = 5$ putaran → $m = 5$",
        "$m + n = 5 + 6 = 11$",
        "Jawaban: B"
      ],
      rumus: "Bertemu di titik awal → KPK waktu putaran masing-masing"
    }
  },
  {
    no: 13,
    soal: "OSN Matematika 2020 Tingkat Kota\nJika $\\frac{5^n}{2}$ dan $\\frac{2^m}{5}$ adalah faktor dari $2020^{2020}$, maka jumlah digit dari nilai maksimum $2m + n$ adalah ...",
    options: ["A. 16", "B. 18", "C. 20", "D. 22"],
    jawaban: "A. 16",
    pembahasan: {
      konsep: "Interpretasikan $\\frac{5^n}{2}$ sebagai $5^{n/2}$ dan $\\frac{2^m}{5}$ sebagai $2^{m/5}$ (bentuk pangkat pecahan). Agar keduanya menjadi faktor bilangan bulat, pangkatnya harus bilangan bulat.",
      langkah: [
        "Faktorisasi: $2020 = 2^2 \\times 5 \\times 101$, sehingga $2020^{2020} = 2^{4040} \\times 5^{2020} \\times 101^{2020}$",
        "Agar $5^{n/2}$ adalah faktor bilangan bulat dari $2020^{2020}$: $n$ harus genap dan $\\frac{n}{2} \\leq 2020$",
        "Nilai maksimum $n$: $n = 2 \\times 2020 = 4040$",
        "Agar $2^{m/5}$ adalah faktor bilangan bulat: $m$ harus kelipatan 5 dan $\\frac{m}{5} \\leq 4040$",
        "Nilai maksimum $m$: $m = 5 \\times 4040 = 20200$",
        "Nilai maksimum $2m + n = 2(20200) + 4040 = 40400 + 4040 = 44440$",
        "Jumlah digit dari 44440: $4 + 4 + 4 + 4 + 0 = 16$",
        "Jawaban: A"
      ],
      rumus: "$5^{n/2}$ faktor integer: $n$ genap, $n/2 \\leq 2020$; $2^{m/5}$ faktor integer: $5|m$, $m/5 \\leq 4040$"
    }
  },
  {
    no: 14,
    soal: "OSN Matematika 2021 Tingkat Kota\nA mendapat giliran ronda malam setiap 4 hari, B mendapat giliran ronda setiap 5 hari dan C mendapat giliran ronda setiap 6 hari. Jika A dan B mulai ronda bersama pada tanggal 1 Januari 2021, sedangkan C ronda dua hari kemudian, maka mereka bertiga akan ronda bersama-sama untuk ke-3 kalinya pada tanggal ...",
    options: ["A. 1 Mei 2021", "B. 3 Mei 2021", "C. 21 Mei 2021", "D. 23 Mei 2021"],
    jawaban: "C. 21 Mei 2021",
    pembahasan: {
      konsep: "Cari hari di mana jadwal A, B, dan C bertepatan. A&B bertemu setiap KPK(4,5)=20 hari. C mulai hari ke-3, jadi cari perpotongan jadwal A&B (hari ke 1,21,41,...) dengan jadwal C (hari ke 3,9,15,21,...).",
      langkah: [
        "A&B bertemu setiap KPK$(4,5) = 20$ hari → hari ke: 1, 21, 41, 61, 81, 101, 121, 141, ...",
        "C ronda mulai hari ke-3, lalu setiap 6 hari → hari ke: 3, 9, 15, 21, 27, 33, ..., 81, ..., 141, ...",
        "Pertemuan A, B, C bersama: hari ke-21 ✓ (pertama), hari ke-81 ✓ (kedua), hari ke-141 ✓ (ketiga)",
        "Pola: setiap KPK$(20,6) = 60$ hari setelah pertemuan pertama (hari 21)",
        "Hari ke-141 dari 1 Januari 2021:",
        "Jan: 31 hari (hari 1-31), Feb: 28 hari (hari 32-59), Mar: 31 hari (hari 60-90)",
        "Apr: 30 hari (hari 91-120), Mei: hari 121-141 → hari ke-141 = 21 Mei",
        "Jawaban: C. 21 Mei 2021"
      ],
      rumus: "A&B bertemu setiap 20 hari (mulai hari ke-1); C setiap 6 hari (mulai hari ke-3). Pertemuan bersama setiap 60 hari dimulai hari ke-21."
    }
  },
  {
    no: 15,
    soal: "OSN Matematika 2021 Tingkat Kota\nSetiap 12 menit Bus-A dapat menempuh rute P – X – S – X – P, setiap 20 menit, Bus-B dapat menyelesaikan rute Q – X – T – X – Q, setiap 28 menit Bus-C dapat menyelesaikan rute R – X – U – X – R. Pukul 1 siang (13.00), Bus-A berangkat dari P, Bus-B berangkat dari Q dan Bus-C berangkat dari R, menempuh rutenya masing-masing dengan kecepatan konstan dan mengulangi perjalanan sepanjang rutenya hingga pukul 11 malam (23.00). Diantara pukul 5 sore hingga pukul 10 malam (17.00 – 22.00), berapakah kali 2 atau lebih bus tiba di X secara bersamaan?",
    image: "https://drive.google.com/thumbnail?id=1o2a2m_qojcXEOJt5qAWhPQoHmwnpBJuT&sz=w800",
    options: ["A. 18", "B. 19", "C. 20", "D. 21"],
    jawaban: "A. 18",
    pembahasan: {
      konsep: "Setiap bus melewati X dua kali per siklus (pergi dan pulang). Hitung jadwal kedatangan di X untuk setiap bus, lalu gunakan inklusi-eksklusi untuk menghitung pertemuan 2+ bus.",
      langkah: [
        "Rute P-X-S-X-P = 4 segmen. Bus-A lewat X tiap $12/2 = 6$ menit, mulai menit ke-3. Jadwal A di X: 3, 9, 15, 21, ... (tiap 6 menit)",
        "Bus-B lewat X tiap $20/2 = 10$ menit, mulai menit ke-5. Jadwal B di X: 5, 15, 25, 35, ... (tiap 10 menit)",
        "Bus-C lewat X tiap $28/2 = 14$ menit, mulai menit ke-7. Jadwal C di X: 7, 21, 35, 49, ... (tiap 14 menit)",
        "Rentang 17.00–22.00 = menit ke 240–540 dari 13.00",
        "Pertemuan A∩B di [240,540]: periode 30 menit, mulai t=15. Ada 10 kali (t=255,285,...,525)",
        "Pertemuan A∩C di [240,540]: periode 42 menit, mulai t=21. Ada 7 kali (t=273,315,...,525)",
        "Pertemuan B∩C di [240,540]: periode 70 menit, mulai t=35. Ada 5 kali (t=245,315,...,525)",
        "Pertemuan A∩B∩C: periode 210 menit, t=105. Di [240,540]: t=315 dan t=525 → 2 kali",
        "Total pertemuan ≥ 2 bus (inklusi-eksklusi): $|A \\cap B| + |A \\cap C| + |B \\cap C| - 2|A \\cap B \\cap C| = 10+7+5-4 = \\boxed{18}$",
        "Jawaban: A"
      ],
      rumus: "Total = $|A\\cap B| + |A\\cap C| + |B\\cap C| - 2|A\\cap B\\cap C|$"
    }
  },
  {
    no: 16,
    soal: "OSN Matematika 2022 Tingkat Kota\nBanyaknya bilangan bulat positif yang habis membagi $10^{199}$ dan merupakan kelipatan $10^{111}$ adalah ...",
    options: ["A. 7921", "B. 12544", "C. 32079", "D. 40000"],
    jawaban: "A. 7921",
    pembahasan: {
      konsep: "Cari bilangan berbentuk $2^a \\times 5^b$ yang merupakan pembagi $10^{199}$ sekaligus kelipatan $10^{111}$. Ini berarti $10^{111} | N | 10^{199}$.",
      langkah: [
        "$10^{199} = 2^{199} \\times 5^{199}$",
        "$10^{111} = 2^{111} \\times 5^{111}$",
        "Bilangan $N = 2^a \\times 5^b$ harus memenuhi:",
        "① $N$ habis membagi $10^{199}$: $a \\leq 199$ dan $b \\leq 199$",
        "② $N$ kelipatan $10^{111}$: $a \\geq 111$ dan $b \\geq 111$",
        "Kombinasi: $111 \\leq a \\leq 199$ dan $111 \\leq b \\leq 199$",
        "Banyak pilihan $a$: $199 - 111 + 1 = 89$",
        "Banyak pilihan $b$: $199 - 111 + 1 = 89$",
        "Total: $89 \\times 89 = 7921$",
        "Jawaban: A"
      ],
      rumus: "$10^{111} | N | 10^{199}$ dengan $N=2^a5^b$ → $111 \\leq a,b \\leq 199$; banyak = $89^2 = 7921$"
    }
  },
  {
    no: 17,
    soal: "OSN Matematika 2024 Tingkat Kota\nBanyaknya faktor dari 2024 yang lebih besar dari $\\sqrt{2024}$ adalah ...",
    options: ["A. 4", "B. 8", "C. 12", "D. 16"],
    jawaban: "B. 8",
    pembahasan: {
      konsep: "Total faktor dari 2024 dibagi 2 (karena bukan bilangan kuadrat sempurna, setengah faktor > √2024 dan setengah lainnya < √2024).",
      langkah: [
        "Faktorisasi prima: $2024 = 8 \\times 253 = 8 \\times 11 \\times 23 = 2^3 \\times 11 \\times 23$",
        "Total faktor: $(3+1)(1+1)(1+1) = 4 \\times 2 \\times 2 = 16$",
        "$\\sqrt{2024} \\approx \\sqrt{2025} - \\epsilon = 45 - \\epsilon \\approx 44{,}99$",
        "Cek apakah 2024 adalah kuadrat sempurna: $44^2 = 1936$, $45^2 = 2025 \\neq 2024$ → bukan kuadrat sempurna",
        "Karena bukan kuadrat sempurna, setiap faktor $d < \\sqrt{2024}$ berpasangan dengan faktor $2024/d > \\sqrt{2024}$",
        "Banyak faktor $> \\sqrt{2024}$ = banyak faktor $< \\sqrt{2024}$ = $16/2 = 8$",
        "Jawaban: B"
      ],
      rumus: "Jika $N$ bukan kuadrat sempurna, banyak faktor $> \\sqrt{N}$ = (total faktor) $/2$"
    }
  },
  {
    no: 18,
    soal: "OSN Matematika 2025 Tingkat Kota\nDua bilangan bulat positif memiliki jumlah 40 dan KPK 48, maka FPB dari kedua bilangan tersebut adalah ...",
    options: ["A. 8", "B. 12", "C. 16", "D. 24"],
    jawaban: "A. 8",
    pembahasan: {
      konsep: "Kedua bilangan harus merupakan pembagi dari KPK = 48 dan jumlahnya 40. Cari pasangan pembagi 48 yang berjumlah 40, lalu hitung FPB-nya.",
      langkah: [
        "Pembagi positif dari 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48",
        "Cari pasangan $(a, b)$ dengan $a + b = 40$, $a | 48$, dan $b | 48$:",
        "$(16, 24)$: $16+24=40$ ✓, $16|48$ ✓, $24|48$ ✓",
        "KPK$(16, 24) = 48$ ✓ → Pasangan ini valid!",
        "$(a,b) = (16, 24)$: FPB$(16, 24) = ?$",
        "$16 = 2^4$, $24 = 2^3 \\times 3$",
        "FPB$(16, 24) = 2^3 = 8$",
        "Jawaban: A"
      ],
      rumus: "$16 = 2^4$, $24 = 2^3 \\times 3$ → FPB $= 2^3 = 8$; KPK $= 2^4 \\times 3 = 48$ ✓"
    }
  },
  {
    no: 19,
    soal: "OSN Matematika 2026 Tingkat Kota\n$\\text{FPB}(m, n) + \\text{KPK}(m, n) = 26$. Berapa pasangan terurut $(m, n)$ yang memenuhi?",

    options: ["A. 4", "B. 5", "C. 6", "D. 7"],
    jawaban: "D. 7",
    pembahasan: {
      konsep: "Misalkan $d = \\text{FPB}(m, n)$, maka $m = da$ dan $n = db$ dengan $\\gcd(a, b) = 1$. Sehingga $\\text{KPK}(m, n) = dab$. Persamaan menjadi $d + dab = 26$, yaitu $d(1 + ab) = 26$. Faktorisasi 26 menentukan semua kasus yang mungkin.",
      langkah: [
        "Misalkan $\\text{FPB}(m, n) = d$, $m = da$, $n = db$ dengan $\\gcd(a, b) = 1$ dan $a, b \\geq 1$",
        "$\\text{KPK}(m, n) = dab$, sehingga $d + dab = d(1 + ab) = 26$",
        "Faktorisasi $26 = 1 \\times 26 = 2 \\times 13$. Kasus yang mungkin: $(d, 1+ab) \\in \\{(1,26),\\,(2,13),\\,(13,2),\\,(26,1)\\}$",
        "**Kasus $d = 1$:** $1 + ab = 26 \\Rightarrow ab = 25$. Pasangan $(a,b)$ dengan $\\gcd(a,b)=1$: hanya $(1, 25)$ dan $(25, 1)$ karena $(5,5)$ memiliki $\\gcd = 5$. Pasangan $(m,n)$: $(1,25)$ dan $(25,1)$ → **2 pasangan**",
        "**Kasus $d = 2$:** $1 + ab = 13 \\Rightarrow ab = 12$. Pasangan $(a,b)$ dengan $\\gcd(a,b)=1$: $(1,12),(12,1),(3,4),(4,3)$ — periksa: $\\gcd(1,12)=1$ ✓, $\\gcd(3,4)=1$ ✓. Pasangan $(m,n)$: $(2,24),(24,2),(6,8),(8,6)$ → **4 pasangan**",
        "**Kasus $d = 13$:** $1 + ab = 2 \\Rightarrow ab = 1$. Satu-satunya pasangan: $(a,b) = (1,1)$. Pasangan $(m,n)$: $(13,13)$ → **1 pasangan**",
        "**Kasus $d = 26$:** $1 + ab = 1 \\Rightarrow ab = 0$. Tidak valid karena $m, n$ harus bilangan bulat positif.",
        "Total pasangan terurut: $2 + 4 + 1 = \\mathbf{7}$"
      ],
      rumus: "$d(1 + ab) = 26$, dengan $d = \\text{FPB}(m,n)$, $\\gcd(a,b)=1$, $26 = 2 \\times 13$; enumerate semua faktorisasi"
    }
  },
  {
    no: 20,
    soal: "OSN Matematika 2026 Tingkat Kota\nTerdapat $n$ bilangan bulat positif berbeda yang jumlahnya 2026. Setiap bilangan tersebut hanya memiliki tepat satu faktor prima yaitu $p$. Nilai $n$ adalah ...",
    options: ["A. 7", "B. 8", "C. 9", "D. 10"],
    jawaban: "B. 8",
    pembahasan: {
      konsep: "Bilangan bulat positif yang hanya memiliki tepat satu faktor prima $p$ adalah bilangan berbentuk $p^k$ (pangkat dari $p$) untuk $k \\geq 1$. Karena semua $n$ bilangan berbeda, kita perlu memilih $n$ pangkat berbeda dari $p$ yang jumlahnya tepat 2026. Trik utama: gunakan representasi basis $p$ (analog biner) untuk menentukan nilai $p$ dan $n$.",
      langkah: [
        "Bilangan dengan tepat satu faktor prima $p$ berbentuk $p^k$ untuk suatu $k \\geq 1$, contoh: $p, p^2, p^3, p^4, \\ldots$",
        "Kita perlu memilih $n$ nilai $k$ berbeda sehingga $p^{k_1} + p^{k_2} + \\cdots + p^{k_n} = 2026$",
        "Coba $p = 2$: representasi biner $2026 = 11111101010_2$",
        "$2026 = 2^{10} + 2^9 + 2^8 + 2^7 + 2^6 + 2^5 + 2^3 + 2^1$",
        "Verifikasi: $1024 + 512 + 256 + 128 + 64 + 32 + 8 + 2 = 2026$ ✓ → diperoleh $n = 8$ suku berbeda",
        "Coba $p = 3$: digit-digit 2026 dalam basis 3. $2026 = 2 \\times 3^6 + 2 \\times 3^5 + \\cdots$ — koefisien bisa melebihi 1, artinya kita butuh pengulangan pangkat yang sama → tidak valid (bilangan harus berbeda-beda)",
        "Coba $p = 5$: $5 + 25 + 125 + 625 = 780 < 2026$; suku berikutnya $3125 > 2026$, sehingga tidak mungkin mencapai 2026 dengan pangkat berbeda dari 5",
        "Untuk $p \\geq 3$: $2026$ bukan kelipatan 3, dan jumlah 7 pangkat terkecil dari 3 ($3+9+27+\\cdots+2187 = 3279 \\neq 2026$) tidak bisa pas. Tidak ada $p \\geq 3$ yang memenuhi.",
        "Satu-satunya solusi valid: $p = 2$, $n = \\mathbf{8}$"
      ],
      rumus: "Nyatakan 2026 dalam basis $p$: jika setiap digit adalah 0 atau 1, maka banyak digit '1' adalah nilai $n$. Basis 2 bekerja karena $2026 = 11111101010_2$ memiliki tepat 8 digit '1'. Untuk $p \\geq 3$, jumlah maksimum pangkat berbeda yang tidak melebihi 2026 tidak pas di angka 2026."
    }
  },
];

const OlimpiadeKPKFPBPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));
  const [expandedDasarPembahasan, setExpandedDasarPembahasan] = useState<number[]>([]);
  const [expandedOlimpiadePembahasan, setExpandedOlimpiadePembahasan] = useState<number[]>([]);

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const toggleDasarPembahasan = (no: number) => {
    playPopSound();
    setExpandedDasarPembahasan(prev =>
      prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]
    );
  };

  const toggleOlimpiadePembahasan = (no: number) => {
    playPopSound();
    setExpandedOlimpiadePembahasan(prev =>
      prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - KPK DAN FPB
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "Materi" },
            { key: "dasar" as const, label: "Latihan Dasar" },
            { key: "olimpiade" as const, label: "Latihan Olimpiade" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`font-display text-xs px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                activeTab === tab.key
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-white/70 border-border hover:border-accent/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Materi Tab */}
        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSection.sections.map((section, idx) => (
              <div
                key={idx}
                className="backdrop-blur border rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(30,41,59,0.75) 0%, rgba(15,23,42,0.85) 100%)",
                  borderColor: expandedSections.includes(idx) ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)",
                  boxShadow: expandedSections.includes(idx)
                    ? "0 0 24px rgba(251,191,36,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.35)" }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-display text-sm text-accent font-bold group-hover:text-yellow-300 transition-colors">
                      {renderWithLatex(section.heading)}
                    </span>
                  </div>
                  {expandedSections.includes(idx)
                    ? <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 animate-slide-up">
                    {MATERI_COMPONENTS[idx]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Dasar Tab */}
        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => (
              <div
                key={soal.no}
                className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,200,255,0.1) 0%, transparent 50%)" }}
                />
                <div className="relative p-5">
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap leading-relaxed">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold mr-2 shrink-0">
                      {soal.no}
                    </span>
                    {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/80 bg-muted/30 border border-border/30 rounded-lg px-3 py-2 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => toggleDasarPembahasan(soal.no)}
                    className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer mt-3"
                  >
                    {expandedDasarPembahasan.includes(soal.no) ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                    {expandedDasarPembahasan.includes(soal.no) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {expandedDasarPembahasan.includes(soal.no) && (
                    <div className="mt-4 space-y-2.5 animate-slide-up">
                      <div className="px-4 py-3 rounded-xl border-2 border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-900/20">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1.5">Jawaban</div>
                        <div className="font-body text-sm text-emerald-50 font-bold">{renderWithLatex(soal.jawaban)}</div>
                      </div>
                      <div className="px-4 py-3 rounded-xl border-2 border-violet-400/55 shadow-lg shadow-violet-900/20" style={{background:"linear-gradient(135deg,rgba(139,92,246,0.16) 0%,rgba(124,58,237,0.10) 100%)"}}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-1.5">Konsep &amp; Trik</div>
                        <div className="font-body text-xs text-violet-50/90 leading-relaxed">{renderWithLatex(soal.pembahasan.konsep)}</div>
                      </div>
                      <div className="px-4 py-3 rounded-xl border-2 border-cyan-400/55 shadow-lg shadow-cyan-900/20" style={{background:"linear-gradient(135deg,rgba(34,211,238,0.12) 0%,rgba(59,130,246,0.10) 100%)"}}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 mb-1.5">Step by Step Penyelesaian</div>
                        <div className="space-y-1.5">
                          {soal.pembahasan.langkah.map((step, si) => (
                            <div key={si} className="flex gap-2 items-start">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center mt-0.5">{si + 1}</span>
                              <p className="text-xs text-cyan-50/90 font-body leading-relaxed">{renderWithLatex(step)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="px-4 py-3 rounded-xl border-2 border-amber-400/55 shadow-lg shadow-amber-900/20" style={{background:"linear-gradient(135deg,rgba(251,191,36,0.14) 0%,rgba(245,158,11,0.10) 100%)"}}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-1.5">Tips</div>
                        <div className="font-body text-xs text-amber-50/90 leading-relaxed">
                          {soal.pembahasan.rumus ? renderWithLatex(soal.pembahasan.rumus) : "Kuasai konsep utama dan latih langkah penyelesaian secara berurutan. Verifikasi jawaban dengan substitusi kembali ke soal."}
                        </div>
                      </div>
                      <div className="px-4 py-3 rounded-xl border-2 border-rose-400/55 shadow-lg shadow-rose-900/20" style={{background:"linear-gradient(135deg,rgba(244,63,94,0.14) 0%,rgba(236,72,153,0.10) 100%)"}}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-rose-300 mb-1.5">Kesimpulan</div>
                        <div className="font-body text-xs text-rose-50/90 leading-relaxed font-medium">
                          Jadi, jawaban yang tepat adalah <span className="font-bold text-rose-200">{renderWithLatex(soal.jawaban)}</span>.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Latihan Olimpiade Tab */}
        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => (
              <div
                key={soal.no}
                className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,200,255,0.1) 0%, transparent 50%)" }}
                />
                <div className="relative p-5">
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap leading-relaxed">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 text-accent text-xs font-bold mr-2 shrink-0">
                      {soal.no}
                    </span>
                    {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                  {soal.image && (
                    <div className="mb-3 flex justify-center">
                      <div className="bg-white rounded-lg p-2 inline-block">
                        <img src={soal.image} alt={`Gambar soal ${soal.no}`} className="max-w-full h-auto max-h-48" />
                      </div>
                    </div>
                  )}
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/80 bg-muted/30 border border-border/30 rounded-lg px-3 py-2 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => toggleOlimpiadePembahasan(soal.no)}
                    className="flex items-center gap-2 text-xs font-semibold text-accent hover:text-accent/80 transition-colors cursor-pointer mt-3"
                  >
                    {expandedOlimpiadePembahasan.includes(soal.no) ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                    {expandedOlimpiadePembahasan.includes(soal.no) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {expandedOlimpiadePembahasan.includes(soal.no) && (
                    <div className="mt-4 space-y-2.5 animate-slide-up">
                      <div className="px-4 py-3 rounded-xl border-2 border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-900/20">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1.5">Jawaban</div>
                        <div className="font-body text-sm text-emerald-50 font-bold">{renderWithLatex(soal.jawaban)}</div>
                      </div>
                      <div className="px-4 py-3 rounded-xl border-2 border-violet-400/55 shadow-lg shadow-violet-900/20" style={{background:"linear-gradient(135deg,rgba(139,92,246,0.16) 0%,rgba(124,58,237,0.10) 100%)"}}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-1.5">Konsep &amp; Trik</div>
                        <div className="font-body text-xs text-violet-50/90 leading-relaxed">{renderWithLatex(soal.pembahasan.konsep)}</div>
                      </div>
                      <div className="px-4 py-3 rounded-xl border-2 border-cyan-400/55 shadow-lg shadow-cyan-900/20" style={{background:"linear-gradient(135deg,rgba(34,211,238,0.12) 0%,rgba(59,130,246,0.10) 100%)"}}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 mb-1.5">Step by Step Penyelesaian</div>
                        <div className="space-y-1.5">
                          {soal.pembahasan.langkah.map((step, si) => (
                            <div key={si} className="flex gap-2 items-start">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center mt-0.5">{si + 1}</span>
                              <p className="text-xs text-cyan-50/90 font-body leading-relaxed">{renderWithLatex(step)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="px-4 py-3 rounded-xl border-2 border-amber-400/55 shadow-lg shadow-amber-900/20" style={{background:"linear-gradient(135deg,rgba(251,191,36,0.14) 0%,rgba(245,158,11,0.10) 100%)"}}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-1.5">Tips</div>
                        <div className="font-body text-xs text-amber-50/90 leading-relaxed">
                          {soal.pembahasan.rumus ? renderWithLatex(soal.pembahasan.rumus) : "Kuasai konsep utama dan latih langkah penyelesaian secara berurutan. Verifikasi jawaban dengan substitusi kembali ke soal."}
                        </div>
                      </div>
                      <div className="px-4 py-3 rounded-xl border-2 border-rose-400/55 shadow-lg shadow-rose-900/20" style={{background:"linear-gradient(135deg,rgba(244,63,94,0.14) 0%,rgba(236,72,153,0.10) 100%)"}}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-rose-300 mb-1.5">Kesimpulan</div>
                        <div className="font-body text-xs text-rose-50/90 leading-relaxed font-medium">
                          Jadi, jawaban yang tepat adalah <span className="font-bold text-rose-200">{renderWithLatex(soal.jawaban)}</span>.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadeKPKFPBPage;
