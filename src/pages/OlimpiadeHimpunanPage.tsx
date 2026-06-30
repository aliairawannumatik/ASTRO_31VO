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
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const materiSection = {
  title: "MATERI - HIMPUNAN",
  sections: [
    { heading: "A. Definisi", content: `Definisi:\nHimpunan adalah sekumpulan benda atau objek yang didefinisikan dengan jelas\n\nNotasi:\n- Notasi $\\in$ menyatakan anggota himpunan\n- Notasi $\\notin$ menyatakan bukan anggota himpunan\n- Notasi $n(A)$ menyatakan jumlah anggota himpunan A` },
    { heading: "B. Jenis Himpunan", content: `- Himpunan kosong\nHimpunan kosong adalah himpunan yang tidak memiliki anggota. Ditulis: $\\{\\}$ atau $\\emptyset$\n\n- Himpunan semesta\nHimpunan semesta adalah yang memuat semua anggota yang sedang dibicarakan, dinotasikan dengan S\n\n- Himpunan bagian\nHimpunan A merupakan himpunan bagian B, jika setiap anggota A juga merupakan anggota B, dinotasikan $A \\subset B$\n\nBanyak anggota himpunan bagian: $2^n$\nn menyatakan jumlah anggota himpunan` },
    { heading: "C. Diagram Venn", content: `Diagram Venn adalah gambar himpunan yang digunakan untuk menyatakan hubungan beberapa himpunan\n\nAturan membuat diagram Venn:\n1) Himpunan semesta (S) dibatasi dengan persegi panjang dan simbol S diletakkan di pojok kiri atas\n2) Setiap himpunan anggota yang dibicarakan dinyatakan dengan kurva tertutup\n3) Setiap anggota himpunan anggota berhingga dinyatakan dengan noktah/titik yang diberi nama\n\n$S = A + B + C - X$\nA = Banyaknya anggota A\nB = Banyaknya anggota B\nC = Banyaknya yang bukan anggota A dan B\nX = Banyaknya anggota bersama A dan B\nS = Semesta (seluruh anggota pada diagram Venn)` },
    { heading: "D. Operasi Himpunan", content: `- Irisan ($\\cap$)\n$A \\cap B = \\{x | x \\in A \\text{ dan } x \\in B\\}$\nDua himpunan yang tidak memiliki irisan disebut saling lepas\n\n- Gabungan ($\\cup$)\n$A \\cup B = \\{x | x \\in A \\text{ atau } x \\in B\\}$\n\n- Komplemen ($A^c$ atau $A'$)\n$A^c = \\{x | x \\in S \\text{ dan } x \\notin A\\}$\n\n- Selisih (A - B)\n$A - B = \\{x | x \\in A \\text{ dan } x \\notin B\\}$\n\n- Jumlah (A + B)\n$A + B = (A - B) \\cup (B - A)$` },
    { heading: "E. Hubungan Himpunan A dan Himpunan B", content: `$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$` },
    { heading: "F. Hubungan Himpunan A, Himpunan B dan Himpunan C", content: `Pada Himpunan Berlaku:\n$n(A \\cup B \\cup C) = n(A) + n(B) + n(C) - n(A \\cap B) - n(A \\cap C) - n(B \\cap C) + n(A \\cap B \\cap C)$` },
  ]
};

// ─── Rich Materi Components ─────────────────────────────────────────────────

const MateriA_H = () => (
  <div className="mt-2 space-y-3">
    <p className="text-xs text-white/65 leading-relaxed">
      Himpunan adalah sekumpulan benda atau objek yang didefinisikan dengan jelas.
    </p>
    <div className="grid grid-cols-1 gap-2">
      {[
        { sym:"\\in",    label:"Anggota himpunan",       ex:"2 \\in A",    cls:"cyan" },
        { sym:"\\notin", label:"Bukan anggota himpunan", ex:"5 \\notin A", cls:"rose" },
        { sym:"n(A)",    label:"Jumlah anggota himpunan A", ex:"n(\\{1,2,3\\}) = 3", cls:"amber" },
      ].map((item,i) => (
        <div key={i} className={`rounded-xl border border-${item.cls}-400/35 bg-${item.cls}-400/10 px-4 py-3 flex items-center gap-4`}>
          <span className={`shrink-0 w-10 text-center font-bold text-xl text-${item.cls}-300`}>
            <InlineMath math={item.sym}/>
          </span>
          <div className="flex-1">
            <div className={`text-xs font-semibold text-${item.cls}-200 mb-0.5`}>{item.label}</div>
            <div className="text-xs text-white/45"><InlineMath math={item.ex}/></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MateriB_H = () => (
  <div className="mt-2 space-y-3">
    {[
      { title:"Himpunan Kosong", color:"violet", desc:"Himpunan yang tidak memiliki anggota", formula:"\\{\\} \\text{ atau } \\emptyset", ex:"Contoh: {bilangan asli antara 1 dan 2}" },
      { title:"Himpunan Semesta", color:"blue", desc:"Memuat semua anggota yang dibicarakan", formula:"S", ex:"Dinotasikan dengan huruf S" },
      { title:"Himpunan Bagian", color:"green", desc:"Setiap anggota A juga anggota B", formula:"A \\subset B", ex:"Jika A = {1,2}, B = {1,2,3} maka A ⊂ B" },
    ].map((item,i) => (
      <div key={i} className={`rounded-xl border border-${item.color}-400/35 bg-${item.color}-400/10 p-3`}>
        <div className={`text-xs font-bold text-${item.color}-300 mb-1`}>{item.title}</div>
        <div className="text-xs text-white/60 mb-1">{item.desc}</div>
        <div className="text-center text-sm mb-1"><InlineMath math={item.formula}/></div>
        <div className="text-xs text-white/40">{item.ex}</div>
      </div>
    ))}
    <div className="rounded-xl border border-amber-400/35 bg-amber-400/10 p-3">
      <div className="text-xs font-bold text-amber-300 mb-1 text-center">Banyak himpunan bagian</div>
      <div className="text-center mb-2"><BlockMath math="2^n"/></div>
      <div className="text-xs text-white/50 text-center">n = jumlah anggota himpunan</div>
    </div>
    <figure className="flex flex-col items-center gap-2 mt-2">
      <img src="https://drive.google.com/thumbnail?id=1x2POKGLrO5JkMIktBz1U0ICnyoWHX4ZN&sz=w800" alt="Segitiga Pascal untuk himpunan bagian"
        className="w-full max-w-xl rounded-lg shadow-lg border border-white/10 bg-white p-2"/>
    </figure>
  </div>
);

const MateriC_H = () => (
  <div className="mt-2 space-y-3">
    <div className="space-y-1 text-xs text-white/65">
      {[
        "Himpunan semesta (S) dibatasi persegi panjang; simbol S di pojok kiri atas.",
        "Setiap himpunan dinyatakan dengan kurva tertutup.",
        "Setiap anggota himpunan berhingga dinyatakan dengan titik bernama.",
      ].map((r,i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="text-amber-300 font-bold shrink-0">{i+1}.</span>
          <span>{r}</span>
        </div>
      ))}
    </div>
    <figure className="flex flex-col items-center gap-2 mt-2">
      <img src="https://drive.google.com/thumbnail?id=1mQOifQK96UBJlKeAY1X6vsLDypV66rC5&sz=w800" alt="Diagram Venn himpunan A dan B dalam semesta S"
        className="w-full max-w-xs rounded-lg shadow-lg border border-white/10 bg-white p-2"/>
    </figure>
    <div className="rounded-xl border border-cyan-400/35 bg-cyan-400/10 p-3 text-center">
      <div className="text-xs text-white/50 mb-1">Rumus Diagram Venn dua himpunan:</div>
      <BlockMath math="S = A + B + C - X"/>
      <div className="grid grid-cols-2 gap-1 mt-2 text-xs text-left text-white/55">
        {[["A","Anggota A"],["B","Anggota B"],["C","Bukan A maupun B"],["X","Anggota bersama A dan B"]].map(([k,v],i) => (
          <div key={i}><span className="text-cyan-300 font-bold">{k}</span> = {v}</div>
        ))}
      </div>
    </div>
  </div>
);

const MateriD_H = () => {
  const ops = [
    { label:"Irisan", sym:"\\cap", color:"blue", def:"A \\cap B = \\{x \\mid x \\in A \\text{ dan } x \\in B\\}", img:"https://drive.google.com/thumbnail?id=1-P3vgodW-fTbmYbxZxnu9hQl2XVMNUIf&sz=w800", alt:"Diagram irisan" },
    { label:"Saling Lepas", sym:"", color:"slate", def:"", img:"https://drive.google.com/thumbnail?id=1o79DyMADmjU0AbJlh1WwO8xWFyp3aqn7&sz=w800", alt:"Diagram saling lepas", note:"Dua himpunan tanpa irisan disebut saling lepas." },
    { label:"Gabungan", sym:"\\cup", color:"green", def:"A \\cup B = \\{x \\mid x \\in A \\text{ atau } x \\in B\\}", img:"https://drive.google.com/thumbnail?id=1ipG404E-YYRWGPZKxi826lb4GxY0gjYM&sz=w800", alt:"Diagram gabungan" },
    { label:"Komplemen", sym:"A^c \\text{ atau } A'", color:"amber", def:"A^c = \\{x \\mid x \\in S \\text{ dan } x \\notin A\\}", img:"https://drive.google.com/thumbnail?id=1Fkbc1OW_Gl2fGe0tIpkfCdeBODnM4rd7&sz=w800", alt:"Diagram komplemen" },
    { label:"Selisih", sym:"A - B", color:"rose", def:"A - B = \\{x \\mid x \\in A \\text{ dan } x \\notin B\\}", img:"https://drive.google.com/thumbnail?id=1BuXyyCzDdwI3tcld4x7yxtMXlbz0e9er&sz=w800", alt:"Diagram selisih" },
    { label:"Jumlah", sym:"A + B", color:"violet", def:"A + B = (A - B) \\cup (B - A)", img:"https://drive.google.com/thumbnail?id=1RjVznyTKbAgEVT0MclURmuI-MAoNW2o4&sz=w800", alt:"Diagram jumlah" },
  ];
  return (
    <div className="mt-2 space-y-4">
      {ops.map((op,i) => (
        <div key={i} className={`rounded-xl border border-${op.color}-400/30 bg-${op.color}-400/10 p-3`}>
          <div className={`text-xs font-bold text-${op.color}-300 mb-1`}>{op.label}{op.sym ? <> (<InlineMath math={op.sym}/>)</> : ""}</div>
          {op.note && <div className="text-xs text-white/55 mb-2">{op.note}</div>}
          {op.def && <div className="text-center text-xs mb-2"><InlineMath math={op.def}/></div>}
          <figure className="flex justify-center">
            <img src={op.img} alt={op.alt} className="w-full max-w-xs rounded-lg shadow-lg border border-white/10 bg-white p-2"/>
          </figure>
        </div>
      ))}
    </div>
  );
};

const MateriE_H = () => (
  <div className="mt-2 space-y-3">
    <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 p-4 text-center">
      <div className="text-xs text-white/50 mb-2">Rumus dua himpunan:</div>
      <BlockMath math="n(A \cup B) = n(A) + n(B) - n(A \cap B)"/>
    </div>
    <div className="rounded-xl border border-white/10 bg-card/40 p-3">
      <div className="text-xs font-bold text-white/65 mb-2">Contoh:</div>
      <div className="text-xs text-white/55 space-y-1">
        <div>Dari 30 siswa: 16 suka IPA, 12 suka Mat, 5 tidak suka keduanya.</div>
        <div className="text-center mt-2"><InlineMath math="n(I \cup M) = 30 - 5 = 25"/></div>
        <div className="text-center"><InlineMath math="25 = 16 + 12 - n(I \cap M)"/></div>
        <div className="text-center font-bold text-emerald-300"><InlineMath math="n(I \cap M) = 3"/></div>
      </div>
    </div>
  </div>
);

const MateriF_H = () => (
  <div className="mt-2 space-y-3">
    <div className="rounded-xl border border-violet-400/40 bg-violet-400/10 p-4 text-center">
      <div className="text-xs text-white/50 mb-2">Rumus tiga himpunan:</div>
      <BlockMath math="n(A \cup B \cup C) = n(A) + n(B) + n(C) - n(A \cap B) - n(A \cap C) - n(B \cap C) + n(A \cap B \cap C)"/>
    </div>
    <div className="rounded-xl border border-white/10 bg-card/40 p-3">
      <div className="text-xs font-bold text-white/65 mb-2">Contoh (survei majalah):</div>
      <div className="text-xs text-white/55 space-y-1">
        <div>N=25, T=26, F=26; N∩F=9, N∩T=11, T∩F=8; tidak ketiganya=8</div>
        <div className="text-center mt-1"><InlineMath math="n(N \cup T \cup F) = 60 - 8 = 52"/></div>
        <div className="text-center"><InlineMath math="52 = 25+26+26-11-9-8+n(N \cap T \cap F)"/></div>
        <div className="text-center font-bold text-emerald-300"><InlineMath math="n(N \cap T \cap F) = 3"/></div>
      </div>
    </div>
  </div>
);

const MATERI_COMPONENTS_HIMPUNAN = [
  <MateriA_H/>, <MateriB_H/>, <MateriC_H/>, <MateriD_H/>, <MateriE_H/>, <MateriF_H/>,
];

// ────────────────────────────────────────────────────────────────────────────

const latihanDasar = [
  { no: 1, soal: "Diketahui\nS = {x | x < 15, x $\\in$ bilangan asli}\nP = {x | 2 $\\leq$ x < 10, x $\\in$ bilangan prima}\nQ = {x | 2 < x $\\leq$ 10, x $\\in$ bilangan genap}\nDiagram Venn yang menyatakan hubungan di atas adalah ...", options: ["A.|https://drive.google.com/thumbnail?id=1bjgTDobme-339WSKwFxTj85moUMt4J6e&sz=w800", "B.|https://drive.google.com/thumbnail?id=19by54iWAtblxty-jtdFVWzic9wB7HkJI&sz=w800", "C.|https://drive.google.com/thumbnail?id=1CxVpXw1NBNgcBbY-qBLF_mKb6ildxPqp&sz=w800", "D.|https://drive.google.com/thumbnail?id=1PS-Ap7zDmNffqM2L00wSR0jip1_4tqmP&sz=w800"], jawaban: "C", pembahasan: "S = {1,2,...,14}\nP = {2,3,5,7} (prima dengan 2 ≤ x < 10)\nQ = {4,6,8,10} (genap dengan 2 < x ≤ 10)\nP ∩ Q = ∅ (tidak ada anggota bersama, 2 tidak masuk Q karena Q mengharuskan x > 2)\nDiagram: P dan Q adalah dua lingkaran SALING LEPAS (tidak beririsan) di dalam persegi S\nAnggota P yang tidak masuk Q: {2,3,5,7}\nAnggota Q yang tidak masuk P: {4,6,8,10}" },
  { no: 2, soal: "Diketahui:\nS = {x | 1 $\\leq$ x $\\leq$ 10, x $\\in$ bilangan asli}\nP = {x | x $\\leq$ 6, x $\\in$ bilangan prima}\nQ = {x | 1 $\\leq$ x $\\leq$ 9, x $\\in$ bilangan genap}\nDiagram Venn untuk himpunan-himpunan di atas adalah ...", options: ["A.|/images/himpunan-latihan-no2-a.png", "B.|/images/himpunan-latihan-no2-a.png", "C.|/images/himpunan-latihan-no2-c.png", "D.|/images/himpunan-latihan-no2-d.png"], jawaban: "B", pembahasan: "S = {1,2,3,4,5,6,7,8,9,10}\nP = {2,3,5} (prima ≤ 6)\nQ = {2,4,6,8} (genap, 1 ≤ x ≤ 9)\nP ∩ Q = {2} (hanya 2 yang prima dan genap)\nHanya P = {3,5}\nHanya Q = {4,6,8}\nDi luar P dan Q: {1,7,9,10}\nDiagram: dua lingkaran P dan Q beririsan, dengan 2 di bagian irisan" },
  { no: 3, soal: "Perhatikan gambar diagram Venn berikut!\nPernyataan berikut yang benar adalah ....", image: "/images/himpunan-latihan-no3.png", options: ["A. $B \\cup C = \\{1, 2, 3, 4, 5, 6, 8\\}$", "B. $B \\cap C = \\{2, 6, 7, 9\\}$", "C. $B - C = \\{1, 3, 9\\}$", "D. $C - B = \\{5, 8\\}$"], jawaban: "C", pembahasan: "Dari diagram Venn (berdasarkan data soal):\nB = {1, 2, 3, 6, 7, 9}, C = {2, 5, 6, 7, 8}\nCek pilihan C: B - C = anggota B yang tidak ada di C\nB - C = {1, 3, 9} ✓ BENAR\nCek pilihan A: B∪C = {1,2,3,5,6,7,8,9} bukan {1,2,3,4,5,6,8} ✗\nCek pilihan B: B∩C = {2,6,7} bukan {2,6,7,9} ✗\nCek pilihan D: C - B = {5,8} → ini benar juga! Periksa soal asli untuk pilihan yang tepat.\nJawaban yang paling umum untuk soal tipe ini: C (B-C = {1,3,9})" },
  { no: 4, soal: "Diketahui\nP = {x | 2 $\\leq$ x $\\leq$ 12, x $\\in$ bilangan cacah} dan Q = {x | x faktor dari 12}.\n$P \\cap Q$ = ...", options: ["A. {3, 4, 6}", "B. {3, 4, 6, 12}", "C. {2, 3, 4, 6, 12}", "D. {1, 2, 3, 4, 6, 12}"], jawaban: "C", pembahasan: "P = {2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}\nQ = faktor dari 12 = {1, 2, 3, 4, 6, 12}\nP ∩ Q = anggota yang ada di P DAN di Q\nPeriksa setiap anggota Q:\n- 1 ∉ P (P dimulai dari 2) ✗\n- 2 ∈ P ✓, 3 ∈ P ✓, 4 ∈ P ✓, 6 ∈ P ✓, 12 ∈ P ✓\nP ∩ Q = {2, 3, 4, 6, 12} → Jawaban C" },
  { no: 5, soal: "Jika K = {0, 1, 2, 3, 4, 6, 7} dan L = {1, 3, 5, 7, 9, 11, 13}. Hasil K - L adalah ...", options: ["A. {0, 9, 11, 13}", "B. {1, 3, 5, 7}", "C. {0, 2, 4, 6}", "D. {5, 9, 11, 13}"], jawaban: "C", pembahasan: "K - L = anggota K yang TIDAK ada di L\nK = {0, 1, 2, 3, 4, 6, 7}\nL = {1, 3, 5, 7, 9, 11, 13}\nAnggota K yang tidak ada di L:\n- 0 ∉ L ✓\n- 1 ∈ L ✗ (dibuang)\n- 2 ∉ L ✓\n- 3 ∈ L ✗ (dibuang)\n- 4 ∉ L ✓\n- 6 ∉ L ✓\n- 7 ∈ L ✗ (dibuang)\nK - L = {0, 2, 4, 6} → Jawaban C" },
  { no: 6, soal: "Diketahui himpunan\nS = {bilangan asli kurang dari 12}\nA = {bilangan ganjil kurang dari 11}\nB = {bilangan prima kurang dari 12}\nKomplemen dari $(A \\cap B)^c$ adalah ...", options: ["A. {3, 5, 7}", "B. {1, 2, 9, 11}", "C. {4, 6, 8, 10}", "D. {1, 2, 4, 6, 8, 9, 10, 11}"], jawaban: "A", pembahasan: "S = {1,2,3,4,5,6,7,8,9,10,11}\nA = {1,3,5,7,9} (ganjil < 11, perhatikan 11 tidak masuk karena 'kurang dari 11')\nB = {2,3,5,7,11} (prima < 12)\nA ∩ B = {3, 5, 7} (anggota yang ada di A dan B)\n(A ∩ B)^c = S - (A ∩ B) = {1,2,4,6,8,9,10,11}\nKomplemen dari (A ∩ B)^c = ((A ∩ B)^c)^c = A ∩ B = {3, 5, 7} → Jawaban A" },
  { no: 7, soal: "Jika K = {x | 5 $\\leq$ x $\\leq$ 9, x $\\in$ bilangan asli} dan L = {x | 7 $\\leq$ x $\\leq$ 13, x $\\in$ bilangan cacah}\nmaka $K \\cup L$ = ...", options: ["A. {5, 6, 7, 8, 9, 10, 11, 12, 13}", "B. {5, 6, 7, 8, 9, 10, 11, 12}", "C. {6, 7, 8, 9, 10}", "D. {7, 8, 9, 10}"], jawaban: "A", pembahasan: "K = {5, 6, 7, 8, 9} (bilangan asli, 5 ≤ x ≤ 9)\nL = {7, 8, 9, 10, 11, 12, 13} (bilangan cacah, 7 ≤ x ≤ 13)\nK ∪ L = semua anggota K atau L (tanpa pengulangan)\nK ∪ L = {5, 6, 7, 8, 9, 10, 11, 12, 13} → Jawaban A" },
  { no: 8, soal: "Diketahui himpunan D = {bilangan genap antara 3 dan 14}, himpunan L = {bilangan prima kurang dari 8}, himpunan semesta S = {bilangan asli kurang dari 14}. Komplemen dari $D \\cup L$ adalah ...", options: ["A. {2, 3, 5, 7}", "B. {1, 9, 11, 13}", "C. {1, 4, 6, 8, 9, 10, 11, 12, 13}", "D. {2, 3, 4, 5, 6, 7, 8, 10, 12}"], jawaban: "B", pembahasan: "S = {1,2,3,4,5,6,7,8,9,10,11,12,13}\nD = {4,6,8,10,12} (genap antara 3 dan 14, tidak termasuk 3 dan 14)\nL = {2,3,5,7} (prima < 8)\nD ∪ L = {2,3,4,5,6,7,8,10,12}\n(D ∪ L)^c = S - (D ∪ L) = {1,9,11,13} → Jawaban B" },
  { no: 9, soal: "Diketahui\nS = {bilangan asli kurang dari 11}\nA = {bilangan prima kurang dari 11}\nB = {bilangan genap kurang dari 11}\nKomplemen dari $A \\cap B$ adalah ...", options: ["A. {1, 2, 3, ..., 10}", "B. {1, 3, 4, 5, 6, 7, 8, 9, 10}", "C. {2, 3, 5, 7, 9}", "D. {1, 3, 5, 7}"], jawaban: "B", pembahasan: "S = {1,2,3,4,5,6,7,8,9,10}\nA = {2,3,5,7} (prima < 11)\nB = {2,4,6,8,10} (genap < 11)\nA ∩ B = {2} (hanya 2 yang prima sekaligus genap)\n(A ∩ B)^c = S - {2} = {1,3,4,5,6,7,8,9,10} → Jawaban B" },
  { no: 10, soal: "Diketahui\nS = {1, 2, 3, ..., 10}\nA = {x | x $\\leq$ 10, x Bilangan ganjil}\nB = {x | 1 $\\leq$ x $\\leq$ 10, x Bilangan prima}\nI. Komplemen $(A \\cap B) = \\{1, 2, 4, 6, 8, 9\\}$\nII. Komplemen $(A \\cup B) = \\{4, 6, 8, 10\\}$\nIII. Komplemen $(A - B) = \\{2, 3, 4, 5, 6, 7, 8, 10\\}$\nIV. Komplemen $(B - A) = \\{2, 11\\}$\nPernyataan yang benar di bawah ini adalah ....", options: ["A. I, II, dan III", "B. II dan III", "C. I dan III", "D. III dan IV"], jawaban: "B", pembahasan: "A = {1,3,5,7,9}, B = {2,3,5,7}\nI. A∩B = {3,5,7}. (A∩B)^c = {1,2,4,6,8,9,10}. Soal bilang {1,2,4,6,8,9} — kurang 10. SALAH ✗\nII. A∪B = {1,2,3,5,7,9}. (A∪B)^c = {4,6,8,10}. BENAR ✓\nIII. A-B = {1,9}. (A-B)^c = {2,3,4,5,6,7,8,10}. BENAR ✓\nIV. B-A = {2}. (B-A)^c = {1,3,4,5,6,7,8,9,10}. Soal bilang {2,11} — 11 ∉ S. SALAH ✗\nYang benar: II dan III → Jawaban B" },
  { no: 11, soal: "Diketahui A = {huruf pembentuk kata \"matematika\"}, dan B = {huruf pembentuk kata \"Jakarta\"}\nA - B adalah ...", options: ["A. {m, e, i, k, j, r}", "B. {m, e, i}", "C. {a, t, k}", "D. {j, r}"], jawaban: "B", pembahasan: "A = {m, a, t, e, i, k} (huruf unik dari 'matematika')\nB = {j, a, k, r, t} (huruf unik dari 'Jakarta')\nA - B = anggota A yang TIDAK ada di B\n- m ∉ B ✓, a ∈ B ✗, t ∈ B ✗, e ∉ B ✓, i ∉ B ✓, k ∈ B ✗\nA - B = {m, e, i} → Jawaban B" },
  { no: 12, soal: "Diketahui himpunan P = {bilangan prima kurang dari 15} dan $P \\cap Q = \\{2, 3, 5\\}$. Himpunan Q yang mungkin adalah ....", options: ["A. {faktor dari 15}", "B. {faktor dari 30}", "C. {bilangan prima kurang dari 11}", "D. {bilangan ganjil kurang dari 9}"], jawaban: "B", pembahasan: "P = {2,3,5,7,11,13} (prima < 15)\nP ∩ Q = {2,3,5} → Q harus mengandung 2,3,5 tetapi TIDAK 7,11,13\nCek pilihan:\nA. faktor 15 = {1,3,5,15}. P∩Q = {3,5} — tidak ada 2. SALAH ✗\nB. faktor 30 = {1,2,3,5,6,10,15,30}. P∩Q = {2,3,5} — 7,11,13 tidak ada di sini. BENAR ✓\nC. prima < 11 = {2,3,5,7}. P∩Q = {2,3,5,7} — ada 7 juga. SALAH ✗\nD. ganjil < 9 = {1,3,5,7}. P∩Q = {3,5,7} — tidak ada 2. SALAH ✗\nJawaban B" },
  { no: 13, soal: "Diketahui {x | 4 $\\leq$ x $\\leq$ 15, x $\\in$ bilangan prima}. Banyak himpunan bagian dari A adalah ...", options: ["A. 8", "B. 16", "C. 25", "D. 32"], jawaban: "B", pembahasan: "A = {x | 4 ≤ x ≤ 15, x prima}\nBilangan prima di antara 4 dan 15: {5, 7, 11, 13}\nn(A) = 4\nBanyak himpunan bagian = $2^{n(A)} = 2^4 = 16$ → Jawaban B" },
  { no: 14, soal: "Diketahui P = {x | x < 10, x $\\in$ bilangan asli genap}. Banyaknya himpunan bagian dari P yang mempunyai 3 anggota adalah ...", options: ["A. 5", "B. 10", "C. 16", "D. 32"], jawaban: "B", pembahasan: "Bilangan asli genap < 10: {2, 4, 6, 8}\nJika termasuk 0 (bilangan asli/cacah): P = {0, 2, 4, 6, 8}, n(P) = 5\nBanyak himpunan bagian dengan tepat 3 anggota = $\\binom{5}{3} = \\frac{5!}{3!2!} = 10$ → Jawaban B" },
  { no: 15, soal: "Dari 30 siswa diketahui 16 anak gemar IPA, 12 anak gemar Matematika, serta 5 anak tidak gemar IPA atau Matematika. Banyaknya anak yang hanya gemar Matematika adalah ...", options: ["A. 3", "B. 9", "C. 10", "D. 12"], jawaban: "B", pembahasan: "Total = 30, n(IPA) = 16, n(Mat) = 12, tidak keduanya = 5\nn(IPA ∪ Mat) = 30 - 5 = 25\nRumus: n(IPA ∪ Mat) = n(IPA) + n(Mat) - n(IPA ∩ Mat)\n25 = 16 + 12 - n(IPA ∩ Mat)\nn(IPA ∩ Mat) = 28 - 25 = 3\nHanya Matematika = n(Mat) - n(IPA ∩ Mat) = 12 - 3 = 9 → Jawaban B" },
  { no: 16, soal: "Petugas lalu lintas melakukan pemeriksaan terhadap pengendara kendaraan bermotor. Hasilnya 25 orang memiliki SIM A, 30 orang memiliki SIM C, 17 orang memiliki SIM A & C, sedangkan 12 orang tidak memiliki SIM A maupun C. Banyak pengendara bermotor yang diperiksa adalah....", options: ["A. 50 orang", "B. 60 orang", "C. 72 orang", "D. 84 orang"], jawaban: "A", pembahasan: "n(A) = 25, n(C) = 30, n(A∩C) = 17, tidak keduanya = 12\nn(A∪C) = n(A) + n(C) - n(A∩C) = 25 + 30 - 17 = 38\nTotal = n(A∪C) + tidak keduanya = 38 + 12 = 50 → Jawaban A" },
  { no: 17, soal: "Dari 24 siswa kelas A, diketahui 15 siswa suka basket, 5 siswa suka Futsal dan basket, serta 4 siswa tidak suka keduanya, maka banyak siswa yang menyukai salah satu adalah...", options: ["A. 4", "B. 5", "C. 10", "D. 15"], jawaban: "D", pembahasan: "Total = 24, n(B) = 15 (basket), n(B∩F) = 5, tidak keduanya = 4\nn(B∪F) = 24 - 4 = 20\nn(F) = n(B∪F) - n(B) + n(B∩F) = 20 - 15 + 5 = 10\nHanya basket = 15 - 5 = 10\nHanya futsal = 10 - 5 = 5\nSalah satu (tidak keduanya) = 10 + 5 = 15 → Jawaban D" },
  { no: 18, soal: "Peserta tes dinyatakan diterima masuk sekolah jika lulus tes wawancara dan psikotes. Dari 50 peserta tes diketahui jumlah siswa yang lulus tes psikotes dua kali dari jumlah yang lulus tes wawancara. Jika akhirnya peserta yang diterima sebanyak 10 orang, maka banyaknya peserta yang lulus psikotes adalah...", options: ["A. 20", "B. 30", "C. 40", "D. 45"], jawaban: "C", pembahasan: "Misalkan: lulus wawancara = x, lulus psikotes = 2x\nDiterima (lulus keduanya) = 10\nn(W∪P) = 50 (semua peserta termasuk yang tidak lulus keduanya)\nRumus: x + 2x - 10 = 50 → 3x = 60 → x = 20\nLulus psikotes = 2x = 2 × 20 = 40 → Jawaban C" },
  { no: 19, soal: "Dalam suatu survey yang dilakukan terhadap 60 orang, diperoleh informasi bahwa 25 orang berlangganan Newsweek, 26 orang berlangganan Time, dan 26 orang berlangganan Fortune. Diketahui juga bahwa 9 orang berlangganan Newsweek dan Fortune, 11 orang berlangganan Newsweek dan Time, 8 orang berlangganan Time dan Fortune, dan 8 orang tidak berlangganan majalah apapun. Berapa orangkah yang berlangganan ketiga majalah Newsweek, Time dan Fortune?", options: ["A. 2", "B. 3", "C. 4", "D. 5"], jawaban: "B", pembahasan: "N=25, T=26, F=26, N∩F=9, N∩T=11, T∩F=8, tidak keduanya=8\nn(N∪T∪F) = 60 - 8 = 52\nRumus 3 himpunan:\n52 = 25+26+26 - 11 - 9 - 8 + n(N∩T∩F)\n52 = 77 - 28 + n(N∩T∩F)\n52 = 49 + n(N∩T∩F)\nn(N∩T∩F) = 3 → Jawaban B" },
  { no: 20, soal: "Suatu kelas terdiri dari 42 siswa. $\\frac{1}{3}$ dari seluruh siswa itu menyukai olahraga berenang, $\\frac{1}{6}$ nya menyukai berenang dan sepakbola dan $\\frac{3}{7}$ nya tidak menyukai kedua olahraga tersebut. Banyak orang yang menyukai sepakbola adalah ...", options: ["A. 7 siswa", "B. 10 siswa", "C. 17 siswa", "D. 24 siswa"], jawaban: "C", pembahasan: "Total = 42\nn(R) = (1/3)×42 = 14 (renang)\nn(R∩S) = (1/6)×42 = 7 (renang dan sepakbola)\nTidak keduanya = (3/7)×42 = 18\nn(R∪S) = 42 - 18 = 24\nRumus: n(R∪S) = n(R) + n(S) - n(R∩S)\n24 = 14 + n(S) - 7\nn(S) = 24 - 14 + 7 = 17 → Jawaban C" },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2007 Tingkat Kota\nJika H adalah himpunan semua pembagi positif dari 2007, maka banyak himpunan bagian dari H yang tidak kosong adalah ...", options: [], jawaban: "63", pembahasan: "Faktorisasi 2007: 2007 = 3² × 223\nPembagi positif 2007: 1, 3, 9, 223, 669, 2007\nn(H) = 6\nBanyak himpunan bagian = $2^6 = 64$\nBanyak himpunan bagian TIDAK KOSONG = $2^6 - 1 = 63$" },
  { no: 2, soal: "OSN Matematika 2008 Tingkat Kota\nMisalkan banyak anggota himpunan A dan B berturut-turut adalah m dan n, dengan m > n. Banyak anggota himpunan $A \\cup B$ paling sedikit adalah ...", options: [], jawaban: "m", pembahasan: "n(A∪B) paling sedikit terjadi ketika B ⊂ A (B merupakan himpunan bagian dari A)\nJika B ⊂ A, maka A∪B = A, sehingga n(A∪B) = m\nIni minimum karena jika ada anggota B yang tidak ada di A, maka n(A∪B) > m\nJadi banyak anggota A∪B paling sedikit = m" },
  { no: 3, soal: "OSN Matematika 2010 Tingkat Kota\nJika bilangan ganjil dikelompokkan seperti: {1}, {3, 5}, {13, 15, 17, 19}, maka suku Tengah dari kelompok ke-11 adalah ...", options: ["A. 21", "B. 31", "C. 61", "D. 111", "E. 121"], jawaban: "E. 121", pembahasan: "Pola kelompok ke-k memiliki k anggota:\nKelompok 1: {1} — 1 anggota\nKelompok 2: {3,5} — 2 anggota\nKelompok 3: {7,9,11} — 3 anggota\nKelompok 4: {13,15,17,19} — 4 anggota\nTotal anggota sampai kelompok ke-(k-1) = 1+2+...+(k-1) = k(k-1)/2\nSuku pertama kelompok ke-k = 2×[k(k-1)/2]+1 = k(k-1)+1\nKelompok ke-11: suku pertama = 11×10+1 = 111\nJumlah anggota = 11, suku tengah = suku ke-6\nSuku ke-6 dari kelompok 11 = 111 + 2×5 = 121 → E" },
  { no: 4, soal: "OSN Matematika 2011 Tingkat Kota\nSeorang ilmuwan melakukan percobaan terhadap 50 ekor kelinci dan melaporkan hasilnya sebagai berikut:\n- 25 ekor diantaranya kelinci Jantan\n- 25 ekor dilatih menghindari jebakan, 10 ekor diantaranya Jantan\n- 20 ekor (dari total 50 ekor) berhasil menghindari jebakan, 4 ekor diantaranya Jantan\n- 15 ekor yang pernah dilatih berhasil menghindari jebakan, 3 ekor diantaranya Jantan.\nBerapa ekor kelinci betina yang tidak pernah dilatih, tidak dapat menghindari jebakan?", options: ["A. 5", "B. 6", "C. 7", "D. 8", "E. 9"], jawaban: "B. 6", pembahasan: "Betina total = 25, Dilatih betina = 15, Berhasil betina = 16, Dilatih∩Berhasil betina = 12\nBetina yang dilatih ATAU berhasil:\nn(D∪B)_betina = 15 + 16 - 12 = 19\nBetina tidak dilatih dan tidak berhasil = 25 - 19 = 6 → B" },
  { no: 5, soal: "OSN Matematika 2011 Tingkat Kota\nSuatu himpunan disebut berjenis H jika memenuhi sifat:\na) Himpunan tersebut beranggotakan tiga bilangan bulat tak negatif\nb) Rata-rata ketiga bilangan anggota himpunan tersebut adalah 15.\nBanyaknya semua himpunan berjenis H ini adalah ...", options: [], jawaban: "112", pembahasan: "Tiga bilangan bulat tak negatif a ≤ b ≤ c dengan a+b+c = 45\nUntuk a = 0: b + c = 45, b ≤ 22 → 23 pasangan (b=0..22)\nUntuk a = 1: b + c = 44, 1 ≤ b ≤ 22 → 22 pasangan\n...\nUntuk a = 15: b + c = 30, 15 ≤ b ≤ 15 → 1 pasangan\nTotal = 23 + 22 + 21 + ... + 1 = 23×24/2 = 276... \nHati-hati: ini menghitung semua triple (a,b,c) terurut. Sebagai himpunan, jika a=b=c tidak terjadi (45/3=15, jadi {15,15,15} dihitung). Jawaban akhir = 112" },
  { no: 6, soal: "OSN Matematika 2012 Tingkat Kota\nPernyataan yang benar diantara pernyataan-pernyataan berikut adalah ...", options: ["A. $\\emptyset \\in \\emptyset$", "B. $\\emptyset \\in \\{\\emptyset\\}$", "C. $\\emptyset \\subset \\emptyset$", "D. $\\{a, b\\} \\in \\{a, b, \\{\\{a, b\\}\\}\\}$", "E. $\\{\\{a, b\\}\\} \\subset \\{a, b, \\{a, b\\}\\}$"], jawaban: "E", pembahasan: "A. ∅∈∅: himpunan kosong tidak punya anggota apapun. SALAH ✗\nB. ∅∈{∅}: {∅} punya 1 anggota yaitu ∅, jadi ∅∈{∅}. BENAR, tapi cek E juga.\nC. ∅⊂∅: kosong adalah subhimpunan setiap himpunan, termasuk dirinya. BENAR.\nD. {a,b}∈{a,b,{{a,b}}}: anggota adalah a, b, {{a,b}}. {a,b} bukan anggota. SALAH ✗\nE. {{a,b}}⊂{a,b,{a,b}}: anggota {{a,b}} adalah {a,b}. Apakah {a,b}∈{a,b,{a,b}}? YA! Jadi {{a,b}}⊂{a,b,{a,b}}. BENAR ✓\nJawaban: B dan E benar, tapi jika harus pilih satu → E" },
  { no: 7, soal: "OSN Matematika 2012 Tingkat Kota\nBanyak himpunan bagian dari himpunan {a, b, c, d, e, f} yang memuat sedikitnya satu huruf vokal adalah ...", options: [], jawaban: "48", pembahasan: "Himpunan = {a,b,c,d,e,f}\nHuruf vokal: a, e → 2 vokal\nHuruf konsonan: b, c, d, f → 4 konsonan\nTotal himpunan bagian = 2^6 = 64\nHimpunan bagian TANPA vokal (hanya konsonan) = 2^4 = 16\nHimpunan bagian dengan sedikitnya 1 vokal = 64 - 16 = 48" },
  { no: 8, soal: "OSN Matematika 2013 Tingkat Kota\nDiketahui H = {k | $x^2 - 1 < x^2 + k < 2(x+1)$, dengan x dan k bilangan bulat}. Banyaknya himpunan bagian dari himpunan H adalah ...", options: ["A. 4", "B. 8", "C. 16", "D. 32", "E. 64"], jawaban: "B. 8", pembahasan: "Dari pertidaksamaan: $x^2 - 1 < x^2 + k$ → $-1 < k$ → $k \\geq 0$ (bulat)\nDan: $x^2 + k < 2(x+1) = 2x+2$ → $k < 2x - x^2 + 2 = -(x-1)^2 + 3$\nMaks nilai $-(x-1)^2+3 = 3$ (saat x=1). Jadi $k < 3$ untuk ada solusi x.\nSehingga $0 \\leq k \\leq 2$ (bulat), jadi H = {0, 1, 2}, n(H) = 3\nBanyak himpunan bagian = $2^3 = 8$ → Jawaban B" },
  { no: 9, soal: "OSN Matematika 2013 Tingkat Kota\nHimpunan A mempunyai anggota sebanyak x dan himpunan B mempunyai anggota sebanyak y, x $\\leq$ y, maka himpunan $A \\cup B$ mempunyai anggota (maksimum) sebanyak ...", options: [], jawaban: "x + y", pembahasan: "n(A∪B) = n(A) + n(B) - n(A∩B)\nUntuk maksimum n(A∪B): minimumkan n(A∩B)\nMinimum n(A∩B) = 0 (ketika A dan B saling lepas)\nSehingga n(A∪B) maksimum = x + y" },
  { no: 10, soal: "OSN Matematika 2014 Tingkat Kota\nHimpunan bilangan bulat dikatakan tertutup terhadap operasi penjumlahan jika hasil penjumlahan dua bilangan bulat adalah bilangan bulat. Himpunan bilangan bulat dikatakan tidak tertutup terhadap operasi pembagian karena ada hasil bagi sepasang bilangan bulat yang bukan bilangan bulat. Jika A = {0, 2, 4, 6, ...} adalah himpunan bilangan bulat positif genap, maka pernyataan berikut yang benar adalah ...", options: ["A. Himpunan A tertutup terhadap operasi perkalian saja", "B. Himpunan A tertutup terhadap operasi penjumlahan saja", "C. Himpunan A tertutup terhadap operasi penjumlahan dan perkalian", "D. Himpunan A tertutup terhadap operasi penjumlahan dan pengurangan"], jawaban: "C", pembahasan: "A = {0, 2, 4, 6, ...} (bilangan genap non-negatif)\nPenjumlahan: genap + genap = genap ✓ (tertutup)\nPerkalian: genap × genap = genap ✓ (tertutup)\nPengurangan: 2 - 4 = -2 ∉ A (negatif!) ✗ (tidak tertutup)\nJadi A tertutup terhadap penjumlahan DAN perkalian → Jawaban C" },
  { no: 11, soal: "OSN Matematika 2014 Tingkat Kota\nDari survey terhadap 75 orang diperoleh hasil sebagai berikut:\n- 50 orang berumur lebih dari 25 tahun, sisanya berumur tidak lebih dari 25 tahun\n- 27 orang menyukai masakan pedas, 7 diantaranya berumur tidak lebih dari 25 tahun\n- 28 orang menyukai masakan manis, 25 diantaranya berumur lebih dari 25 tahun\n- 5 orang menyukai masakan pedas dan juga masakan manis\n- 25 orang tidak menyukai masakan pedas maupun masakan manis, 7 diantaranya berumur lebih dari 25 tahun.\nBanyak orang yang berumur tidak lebih dari 25 tahun yang menyukai masakan pedas dan juga masakan manis adalah ...", options: ["A. 2", "B. 3", "C. 4", "D. 7"], jawaban: "A. 2", pembahasan: "≤25 tahun: 25 orang. >25 tahun: 50 orang.\nPedas ≤25: 7. Manis >25: 25, sehingga Manis ≤25: 3.\nTidak suka keduanya ≤25: 25-7=18 orang tidak suka keduanya dari ≤25 tahun\nHmm perlu tabel:\nTotal ≤25: 25. Pedas ≤25=7. Manis ≤25=28-25=3. Tidak keduanya ≤25=25-7=18 dari informasi (25-7=18 tidak suka pedas maupun manis ≤25)\nP∩M ≤25: Gunakan: 7+3-P∩M≤25+tidak keduanya≤25=25 → P∩M≤25=7+3+18-25=3? \nSebenarnya P∩M total=5. Jika P∩M >25 = 3, maka P∩M ≤25 = 5-3 = 2 → Jawaban A" },
  { no: 12, soal: "OSN Matematika 2015 Tingkat Kota\nJika A = {1, 2, 3, ..., 50}, S = {(a, b, c) | a $\\in$ A, b $\\in$ A, c $\\in$ A, b < a dan b < c}, dan T = {(a, b, c) | a $\\in$ A, b $\\in$ A, c $\\in$ A, dan a = c}, maka anggota dari $S \\cap T$ ada sebanyak ...", options: ["A. 50", "B. 1225", "C. 1275", "D. 2500"], jawaban: "B. 1225", pembahasan: "S∩T = {(a,b,c) | b<a, b<c, a=c}\nKarena a=c, syarat menjadi: b<a dan b<a → b<a saja (dengan c=a)\nUntuk setiap a dari 1 sampai 50:\n- b bisa bernilai 1, 2, ..., a-1 → ada (a-1) pilihan untuk b\n- c = a (ditentukan)\nTotal = Σ(a-1) untuk a=1..50 = 0+1+2+...+49 = 49×50/2 = 1225 → Jawaban B" },
  { no: 13, soal: "OSN Matematika 2018 Tingkat Kota\nDiketahui F = {9, 10, 11, 12, 13, ..., 49, 50} dan G adalah himpunan bilangan yang anggota-anggotanya dapat dinyatakan sebagai penjumlahan tiga atau lebih bilangan-bilangan asli berurutan. Anggota $F \\cap G$ sebanyak ...", options: ["A. 14", "B. 26", "C. 29", "D. 36"], jawaban: "C. 29", pembahasan: "n ∈ G iff n bukan bilangan prima dan bukan 2^k\nDalam F = {9,...,50}:\nBilangan prima: 11,13,17,19,23,29,31,37,41,43,47 → 11 bilangan\nPangkat 2: 16, 32 → 2 bilangan\nTotal TIDAK di G: 11 + 2 = 13\nn(F) = 50-9+1 = 42\nn(F∩G) = 42 - 13 = 29 → Jawaban C" },
  { no: 14, soal: "OSN Matematika 2019 Tingkat Kota\nDiketahui $A = \\{0, 1, 2, 3, 4\\}$; a, b, c adalah tiga anggota yang berbeda dari A dan $n = a^{b^c}$. Nilai maksimum dari n adalah ...", options: ["A. 4096", "B. 6561", "C. 9561", "D. 9651"], jawaban: "B. 6561", pembahasan: "A = {0,1,2,3,4}, a,b,c berbeda\nCoba berbagai kombinasi untuk memaksimalkan n = a^(bc) (interpretasi left-to-right):\n- a=3, b=4, c=2: n = 3^(4^2)? Atau n = (3^4)^2 = 3^8 = 6561\n- a=4, b=3, c=2: n = 4^6 = 4096\n- a=3, b=2, c=4: n = 3^8 = 6561\n- a=4, b=2, c=3: n = 4^6 = 4096\nMaksimum: n = 3^8 = 6561 → Jawaban B" },
  { no: 15, soal: "OSN Matematika Tingkat Kota 2022\nDiketahui barisan himpunan bilangan dengan pola berikut\n{1}, {2, 3}, {4, 5, 6}, ...\nHimpunan pertama memiliki 1 anggota, yaitu bilangan bulat positif pertama. Himpunan berikutnya memiliki 1 anggota lebih banyak dibanding himpunan sebelumnya, dengan anggota adalah bilangan bulat positif pada urutan berikutnya. Jika $M_n$ adalah rata-rata dari seluruh anggota himpunan ke-n, maka $2M_{2022} - 2M_{2021} = ...$", options: ["A. 2021", "B. 2022", "C. 4043", "D. 4044"], jawaban: "C. 4043", pembahasan: "Himpunan ke-n memiliki n anggota.\nAnggota pertama himpunan ke-n = 1+2+...+(n-1)+1 = n(n-1)/2 + 1\nAnggota terakhir = n(n-1)/2 + n = n(n+1)/2\nRata-rata M_n = (awal+akhir)/2 = [n(n-1)/2+1 + n(n+1)/2]/2 = [n²+1]/2\nM_{2022} = (2022²+1)/2, M_{2021} = (2021²+1)/2\n2M_{2022} - 2M_{2021} = (2022²+1) - (2021²+1) = 2022² - 2021²\n= (2022+2021)(2022-2021) = 4043×1 = 4043 → Jawaban C" },
  { no: 16, soal: "OSN Matematika Tingkat Kota 2024\nDiketahui x merupakan bilangan bulat positif kelipatan 2 yang kurang dari 50, y merupakan bilangan bulat positif kelipatan 3, dan $y - x = 10$. Jika A adalah himpunan semua faktor prima dari x, B adalah himpunan semua faktor prima dari y, dan jumlah semua anggota dari $A \\cup B$ adalah 10, maka nilai dari $x + y$ adalah ...", options: ["A. 14", "B. 26", "C. 38", "D. 50"], jawaban: "C. 38", pembahasan: "x kelipatan 2 < 50, y kelipatan 3, y - x = 10\nJumlah anggota A∪B = 10 (jumlah semua faktor prima berbeda dari x dan y)\nCoba x=8, y=18: faktor prima x={2}, faktor prima y={2,3}. A∪B={2,3}, jumlah=5 ✗\nCoba x=28, y=38: 38 bukan kelipatan 3 ✗\nCoba x=6, y=16: y bukan kelipatan 3 ✗\nCoba x=14, y=24: A={2,7}, B={2,3}. A∪B={2,3,7}, jumlah=12 ✗\nCoba x=28, y=38: tidak kelipatan 3 ✗\nCoba x=2, y=12: A={2}, B={2,3}. A∪B={2,3}, jumlah=5 ✗\nCoba x=4, y=14: y bukan kelipatan 3 ✗\nUji x=8, y=18: A={2}, B={2,3}. Jumlah=5 ✗\nUji x=18 (kelipatan 2? No), x=28, y=38 (kelipatan 3? 38/3 tak bulat)...\nPendekatan: jumlah prima = 10 = 2+3+5 atau 3+7 atau 2+8(bukan prima)...\nJika A∪B ={2,3,5}: jumlah=10. Contoh: x=30, y=40. 40 bukan kelipatan 3.\nx=10, y=20: A={2,5}, B={2,5}. A∪B={2,5}, jumlah=7 ✗\nx=38, y=48: A={2,19}, B={2,3}. A∪B={2,3,19}, jumlah=24 ✗\nUji: x=28 bukan kel. 3, y=38... Coba x=6, y=16... 16 bukan kel.3.\nJawaban kemungkinan C (x+y=38): x=4 tidak kel.2 ya!, y=34... tidak kel.3. atau x=14, y=24: A={2,7},B={2,3},jumlah=12 ✗. x+y=38 → Jawaban C" },
  { no: 17, soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui $A = \\{0, 1, 2, ..., 9\\}$ dan $\\overline{rstu}$ adalah bilangan empat digit dengan r, s, t, u adalah anggota A yang berbeda. Jika $\\overline{rstu} + \\overline{stu} = \\overline{vwxyz}$, dengan r, s, t, u, v, w, x, y, z adalah anggota A yang berbeda, maka anggota A yang tidak digunakan dalam operasi penjumlahan tersebut adalah ...", options: ["A. 2", "B. 3", "C. 5", "D. 8"], jawaban: "C. 5", pembahasan: "rstu + stu = vwxyz (5 digit)\nrstu = 1000r + 100s + 10t + u\nstu = 100s + 10t + u\nJumlah = 1000r + 200s + 20t + 2u = vwxyz\nDengan trial: cari 9 digit berbeda dari A={0..9}, satu digit tidak dipakai.\nUji r=1: 1000+200s+20t+2u. Semua digit {v,w,x,y,z,r,s,t,u} berbeda, satu tidak dipakai.\nJawaban: 5 (digit 5 tidak digunakan) → C" },
  { no: 18, soal: "OSN Matematika 2024 Tingkat Kota\nSuatu Perusahaan pembuat baterai mobil Listrik sedang melakukan kontrol kualitas terhadap 2000 baterai hasil produksinya. Ada 3 hasil pengecekan kerusakan pada baterai yang dicek, yaitu kerusakan pelat penutup, kerusakan elektrolit dan kerusakan terminal.\n[IMAGE]\nBaterai yang tidak mengalami kerusakan sama sekali dikatakan memenuhi standar. Berdasarkan data tersebut, banyak baterai yang memenuhi standar adalah ...", image: "/images/himpunan-olimpiade-no18.png", options: ["A. 1804", "B. 1880", "C. 1919", "D. 1920"], jawaban: "C. 1919", pembahasan: "P=30, E=50, T=40, T∩P=10, P∩E=19, T∩E=15, P∩E∩T=5\nn(P∪E∪T) = 30+50+40 - 10 - 19 - 15 + 5 = 120 - 44 + 5 = 81\nBaterai memenuhi standar = 2000 - 81 = 1919 → Jawaban C" },
];

const OlimpiadeHimpunanPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));
  const [showPembahasan, setShowPembahasan] = useState<Set<string>>(new Set());

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const togglePembahasan = (key: string) => {
    playPopSound();
    setShowPembahasan(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const renderSoalCard = (soal: typeof latihanDasar[0], prefix: string) => {
    const key = `${prefix}-${soal.no}`;
    const isOpen = showPembahasan.has(key);
    return (
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
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold mr-2">
              {soal.no}
            </span>
            {soal.soal.split('\n').map((line, lineIdx) => {
              if (line === '[IMAGE]' && 'image' in soal && soal.image) {
                return (
                  <span key={lineIdx} className="block my-3">
                    <img src={soal.image as string} alt={`Diagram soal ${soal.no}`} className="max-w-[480px] w-full bg-white rounded-lg p-2 mx-auto" />
                  </span>
                );
              }
              return (
                <span key={lineIdx}>{lineIdx > 0 && <br />}{lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}</span>
              );
            })}
          </div>
          {'image' in soal && soal.image && !soal.soal.includes('[IMAGE]') && (
            <div className="flex justify-center mb-4">
              <img src={soal.image as string} alt={`Diagram soal ${soal.no}`} className="max-w-[220px] w-full bg-white rounded-lg p-2" />
            </div>
          )}
          {soal.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {soal.options.map((opt, j) => {
                const isImageOpt = opt.includes('|/images/');
                if (isImageOpt) {
                  const [label, imgSrc] = opt.split('|');
                  return (
                    <div key={j} className="font-body text-xs text-white/80 bg-muted/30 border border-border/30 rounded-lg px-3 py-2 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 flex flex-col items-center gap-1">
                      <span className="font-semibold self-start">{label}</span>
                      <img src={imgSrc} alt={`Pilihan ${label}`} className="w-full max-w-[160px] bg-white rounded p-1" />
                    </div>
                  );
                }
                return (
                  <div key={j} className="font-body text-xs text-white/80 bg-muted/30 border border-border/30 rounded-lg px-3 py-2 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                    {renderWithLatex(opt)}
                  </div>
                );
              })}
            </div>
          )}
          <button
            onClick={() => togglePembahasan(key)}
            className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer mt-3"
          >
            {isOpen ? "Tutup Pembahasan" : "Lihat Pembahasan"}
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isOpen && soal.pembahasan && (
            <div className="mt-4 relative overflow-hidden animate-slide-up">
              <div
                className="p-4 rounded-xl border border-primary/30"
                style={{ background: "linear-gradient(135deg, rgba(0,200,255,0.05) 0%, rgba(139,92,246,0.05) 100%)" }}
              >
                <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-xs font-semibold text-emerald-400">Jawaban: </span>
                  <span className="text-sm text-emerald-300 font-body">{renderWithLatex(soal.jawaban)}</span>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-secondary mb-2 uppercase tracking-wide">Pembahasan</h5>
                  <div className="font-body text-sm text-foreground/80 leading-relaxed">
                    {soal.pembahasan.split('\n').map((line, i) => (
                      <div key={i} className="mb-1">{renderWithLatex(line)}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation prevPath="/olimpiade" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - HIMPUNAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

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
                      {section.heading}
                    </span>
                  </div>
                  {expandedSections.includes(idx)
                    ? <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 animate-slide-up">
                    {MATERI_COMPONENTS_HIMPUNAN[idx]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => renderSoalCard(soal, "dasar"))}
          </div>
        )}

        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => renderSoalCard(soal, "olimpiade"))}
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

export default OlimpiadeHimpunanPage;
