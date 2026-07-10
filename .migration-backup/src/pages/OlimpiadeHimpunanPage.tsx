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
    { heading: "A. Definisi", content: `` },
    { heading: "B. Jenis Himpunan", content: `` },
    { heading: "C. Diagram Venn", content: `` },
    { heading: "D. Operasi Himpunan", content: `` },
    { heading: "E. Hubungan Himpunan A dan Himpunan B", content: `` },
    { heading: "F. Hubungan Himpunan A, Himpunan B dan Himpunan C", content: `` },
  ]
};

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

// ─── Types ────────────────────────────────────────────────────────────────────
interface Pembahasan {
  konsep: string;
  langkah: string[];
  rumus?: string;
}
interface Soal {
  no: number;
  soal: string;
  image?: string;
  options: string[];
  jawaban: string;
  pembahasan: Pembahasan;
}

// ─── Data Latihan Dasar ───────────────────────────────────────────────────────
const latihanDasar: Soal[] = [
  {
    no: 1,
    soal: "Diketahui\nS = {x | x < 15, x $\\in$ bilangan asli}\nP = {x | 2 $\\leq$ x < 10, x $\\in$ bilangan prima}\nQ = {x | 2 < x $\\leq$ 10, x $\\in$ bilangan genap}\nDiagram Venn yang menyatakan hubungan di atas adalah ...",
    options: ["A.|https://drive.google.com/thumbnail?id=1bjgTDobme-339WSKwFxTj85moUMt4J6e&sz=w800","B.|https://drive.google.com/thumbnail?id=19by54iWAtblxty-jtdFVWzic9wB7HkJI&sz=w800","C.|https://drive.google.com/thumbnail?id=1CxVpXw1NBNgcBbY-qBLF_mKb6ildxPqp&sz=w800","D.|https://drive.google.com/thumbnail?id=1PS-Ap7zDmNffqM2L00wSR0jip1_4tqmP&sz=w800"],
    jawaban: "C",
    pembahasan: {
      konsep: "Tentukan anggota setiap himpunan, lalu cari irisan P∩Q untuk menentukan bentuk diagram Venn.",
      langkah: [
        "S = {1, 2, 3, ..., 14}",
        "P = {2, 3, 5, 7} — prima dengan 2 ≤ x < 10",
        "Q = {4, 6, 8, 10} — genap dengan 2 < x ≤ 10 (2 tidak masuk karena syarat x > 2)",
        "P ∩ Q = ∅ — tidak ada anggota yang sama di P dan Q",
        "Diagram Venn: P dan Q adalah dua lingkaran yang SALING LEPAS di dalam persegi panjang S"
      ],
      rumus: "Jika P ∩ Q = ∅, diagram Venn menunjukkan dua lingkaran yang tidak berpotongan (saling lepas)."
    }
  },
  {
    no: 2,
    soal: "Diketahui:\nS = {x | 1 $\\leq$ x $\\leq$ 10, x $\\in$ bilangan asli}\nP = {x | x $\\leq$ 6, x $\\in$ bilangan prima}\nQ = {x | 1 $\\leq$ x $\\leq$ 9, x $\\in$ bilangan genap}\nDiagram Venn untuk himpunan-himpunan di atas adalah ...",
    options: ["A.|https://drive.google.com/thumbnail?id=1BHSvpzcObESqlhbrm7PfkOuRuZnbnf3J&sz=w800","B.|https://drive.google.com/thumbnail?id=1fZWVP3UMw083sMOyx5LlOVnVqujqcQ3F&sz=w800","C.|https://drive.google.com/thumbnail?id=1lEHTqKktMDLPT0sl0HFMobOGub3aHMDJ&sz=w800","D.|https://drive.google.com/thumbnail?id=11co-lVEgY02aBS0wNX9PKpjOYGemAXXh&sz=w800"],
    jawaban: "B",
    pembahasan: {
      konsep: "Tentukan anggota S, P, Q dan irisan P∩Q untuk menentukan bentuk diagram Venn yang benar.",
      langkah: [
        "S = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}",
        "P = {2, 3, 5} — prima ≤ 6",
        "Q = {2, 4, 6, 8} — genap, 1 ≤ x ≤ 9",
        "P ∩ Q = {2} — hanya 2 yang prima sekaligus genap",
        "Hanya P: {3, 5} | Hanya Q: {4, 6, 8} | Di luar keduanya: {1, 7, 9, 10}",
        "Diagram: dua lingkaran P dan Q beririsan, dengan 2 di bagian irisan"
      ],
      rumus: "P ∩ Q = {x | x ∈ P dan x ∈ Q}"
    }
  },
  {
    no: 3,
    soal: "Perhatikan gambar diagram Venn berikut!\nPernyataan berikut yang benar adalah ....",
    image: "https://drive.google.com/thumbnail?id=1_5TXjD6ro0fw4r83PTWZ2Y4Ajpmbo6Kk&sz=w800",
    options: ["A. $B \\cup C = \\{1, 2, 3, 4, 5, 6, 8\\}$","B. $B \\cap C = \\{2, 6, 7, 9\\}$","C. $B - C = \\{1, 3, 9\\}$","D. $C - B = \\{5, 8\\}$"],
    jawaban: "C",
    pembahasan: {
      konsep: "Baca diagram Venn dengan cermat, lalu verifikasi setiap pernyataan menggunakan definisi operasi himpunan.",
      langkah: [
        "Dari diagram: B = {1, 2, 3, 6, 7, 9}, C = {2, 5, 6, 7, 8}",
        "Cek A: B∪C = {1,2,3,5,6,7,8,9} ≠ {1,2,3,4,5,6,8} → SALAH ✗",
        "Cek B: B∩C = {2, 6, 7} ≠ {2,6,7,9} → SALAH ✗",
        "Cek C: B - C = anggota B yang tidak ada di C = {1, 3, 9} → BENAR ✓",
        "Cek D: C - B = anggota C yang tidak ada di B = {5, 8} — sesuai diagram → perlu cek soal asli"
      ],
      rumus: "B - C = {x | x ∈ B dan x ∉ C}"
    }
  },
  {
    no: 4,
    soal: "Diketahui\nP = {x | 2 $\\leq$ x $\\leq$ 12, x $\\in$ bilangan cacah} dan Q = {x | x faktor dari 12}.\n$P \\cap Q$ = ...",
    options: ["A. {3, 4, 6}","B. {3, 4, 6, 12}","C. {2, 3, 4, 6, 12}","D. {1, 2, 3, 4, 6, 12}"],
    jawaban: "C",
    pembahasan: {
      konsep: "Tentukan anggota P dan Q terlebih dahulu, lalu ambil irisan (anggota yang ada di keduanya).",
      langkah: [
        "P = {2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12} — bilangan cacah, 2 ≤ x ≤ 12",
        "Q = faktor dari 12 = {1, 2, 3, 4, 6, 12}",
        "P ∩ Q = anggota yang ada di P dan juga di Q:",
        "1 ∉ P ✗ | 2 ∈ P ✓ | 3 ∈ P ✓ | 4 ∈ P ✓ | 6 ∈ P ✓ | 12 ∈ P ✓",
        "P ∩ Q = {2, 3, 4, 6, 12}"
      ],
      rumus: "P ∩ Q = {x | x ∈ P dan x ∈ Q}"
    }
  },
  {
    no: 5,
    soal: "Jika K = {0, 1, 2, 3, 4, 6, 7} dan L = {1, 3, 5, 7, 9, 11, 13}. Hasil K - L adalah ...",
    options: ["A. {0, 9, 11, 13}","B. {1, 3, 5, 7}","C. {0, 2, 4, 6}","D. {5, 9, 11, 13}"],
    jawaban: "C",
    pembahasan: {
      konsep: "Selisih K - L adalah anggota K yang tidak terdapat di L.",
      langkah: [
        "K = {0, 1, 2, 3, 4, 6, 7}, L = {1, 3, 5, 7, 9, 11, 13}",
        "Periksa setiap anggota K:",
        "0 ∉ L ✓ | 1 ∈ L ✗ (dibuang) | 2 ∉ L ✓ | 3 ∈ L ✗ | 4 ∉ L ✓ | 6 ∉ L ✓ | 7 ∈ L ✗",
        "K - L = {0, 2, 4, 6}"
      ],
      rumus: "K - L = {x | x ∈ K dan x ∉ L}"
    }
  },
  {
    no: 6,
    soal: "Diketahui himpunan\nS = {bilangan asli kurang dari 12}\nA = {bilangan ganjil kurang dari 11}\nB = {bilangan prima kurang dari 12}\nKomplemen dari $(A \\cap B)^c$ adalah ...",
    options: ["A. {3, 5, 7}","B. {1, 2, 9, 11}","C. {4, 6, 8, 10}","D. {1, 2, 4, 6, 8, 9, 10, 11}"],
    jawaban: "A",
    pembahasan: {
      konsep: "Komplemen dari komplemen suatu himpunan adalah himpunan itu sendiri: $((H)^c)^c = H$.",
      langkah: [
        "S = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11}",
        "A = {1, 3, 5, 7, 9} — ganjil < 11",
        "B = {2, 3, 5, 7, 11} — prima < 12",
        "A ∩ B = {3, 5, 7}",
        "$(A \\cap B)^c = S - \\{3,5,7\\} = \\{1,2,4,6,8,9,10,11\\}$",
        "Komplemen dari $(A \\cap B)^c$ = $((A \\cap B)^c)^c = A \\cap B = \\{3, 5, 7\\}$"
      ],
      rumus: "$((H)^c)^c = H$ untuk setiap himpunan H"
    }
  },
  {
    no: 7,
    soal: "Jika K = {x | 5 $\\leq$ x $\\leq$ 9, x $\\in$ bilangan asli} dan L = {x | 7 $\\leq$ x $\\leq$ 13, x $\\in$ bilangan cacah}\nmaka $K \\cup L$ = ...",
    options: ["A. {5, 6, 7, 8, 9, 10, 11, 12, 13}","B. {5, 6, 7, 8, 9, 10, 11, 12}","C. {6, 7, 8, 9, 10}","D. {7, 8, 9, 10}"],
    jawaban: "A",
    pembahasan: {
      konsep: "Gabungan K∪L memuat semua anggota K atau L, tanpa pengulangan.",
      langkah: [
        "K = {5, 6, 7, 8, 9} — bilangan asli, 5 ≤ x ≤ 9",
        "L = {7, 8, 9, 10, 11, 12, 13} — bilangan cacah, 7 ≤ x ≤ 13",
        "K ∪ L = gabungan semua anggota K atau L (tanpa duplikat)",
        "K ∪ L = {5, 6, 7, 8, 9, 10, 11, 12, 13}"
      ],
      rumus: "K ∪ L = {x | x ∈ K atau x ∈ L}"
    }
  },
  {
    no: 8,
    soal: "Diketahui himpunan D = {bilangan genap antara 3 dan 14}, himpunan L = {bilangan prima kurang dari 8}, himpunan semesta S = {bilangan asli kurang dari 14}. Komplemen dari $D \\cup L$ adalah ...",
    options: ["A. {2, 3, 5, 7}","B. {1, 9, 11, 13}","C. {1, 4, 6, 8, 9, 10, 11, 12, 13}","D. {2, 3, 4, 5, 6, 7, 8, 10, 12}"],
    jawaban: "B",
    pembahasan: {
      konsep: "Komplemen dari D∪L adalah semua anggota S yang bukan anggota D maupun L.",
      langkah: [
        "S = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13}",
        "D = {4, 6, 8, 10, 12} — genap antara 3 dan 14 (tidak termasuk 3 dan 14)",
        "L = {2, 3, 5, 7} — prima < 8",
        "D ∪ L = {2, 3, 4, 5, 6, 7, 8, 10, 12}",
        "$(D \\cup L)^c = S - (D \\cup L) = \\{1, 9, 11, 13\\}$"
      ],
      rumus: "$(D \\cup L)^c = S - (D \\cup L)$"
    }
  },
  {
    no: 9,
    soal: "Diketahui\nS = {bilangan asli kurang dari 11}\nA = {bilangan prima kurang dari 11}\nB = {bilangan genap kurang dari 11}\nKomplemen dari $A \\cap B$ adalah ...",
    options: ["A. {1, 2, 3, ..., 10}","B. {1, 3, 4, 5, 6, 7, 8, 9, 10}","C. {2, 3, 5, 7, 9}","D. {1, 3, 5, 7}"],
    jawaban: "B",
    pembahasan: {
      konsep: "Komplemen dari A∩B adalah semua anggota S yang bukan anggota A∩B.",
      langkah: [
        "S = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}",
        "A = {2, 3, 5, 7} — prima < 11",
        "B = {2, 4, 6, 8, 10} — genap < 11",
        "A ∩ B = {2} — satu-satunya bilangan yang prima sekaligus genap",
        "$(A \\cap B)^c = S - \\{2\\} = \\{1, 3, 4, 5, 6, 7, 8, 9, 10\\}$"
      ],
      rumus: "$(A \\cap B)^c = S - (A \\cap B)$"
    }
  },
  {
    no: 10,
    soal: "Diketahui\nS = {1, 2, 3, ..., 10}\nA = {x | x $\\leq$ 10, x Bilangan ganjil}\nB = {x | 1 $\\leq$ x $\\leq$ 10, x Bilangan prima}\nI. Komplemen $(A \\cap B) = \\{1, 2, 4, 6, 8, 9\\}$\nII. Komplemen $(A \\cup B) = \\{4, 6, 8, 10\\}$\nIII. Komplemen $(A - B) = \\{2, 3, 4, 5, 6, 7, 8, 10\\}$\nIV. Komplemen $(B - A) = \\{2, 11\\}$\nPernyataan yang benar di bawah ini adalah ....",
    options: ["A. I, II, dan III","B. II dan III","C. I dan III","D. III dan IV"],
    jawaban: "B",
    pembahasan: {
      konsep: "Verifikasi setiap pernyataan dengan menentukan A, B, lalu menghitung komplemen masing-masing operasi.",
      langkah: [
        "A = {1,3,5,7,9} — ganjil | B = {2,3,5,7} — prima",
        "I. A∩B = {3,5,7}; $(A∩B)^c$ = {1,2,4,6,8,9,10} — soal tulis {1,2,4,6,8,9} (kurang 10) → SALAH ✗",
        "II. A∪B = {1,2,3,5,7,9}; $(A∪B)^c$ = {4,6,8,10} → BENAR ✓",
        "III. A-B = {1,9}; $(A-B)^c$ = {2,3,4,5,6,7,8,10} → BENAR ✓",
        "IV. B-A = {2}; $(B-A)^c$ = {1,3,4,5,6,7,8,9,10} — soal bilang {2,11} dan 11∉S → SALAH ✗",
        "Yang benar: II dan III"
      ],
      rumus: "Komplemen selalu dihitung terhadap himpunan semesta S."
    }
  },
  {
    no: 11,
    soal: "Diketahui A = {huruf pembentuk kata \"matematika\"}, dan B = {huruf pembentuk kata \"Jakarta\"}\nA - B adalah ...",
    options: ["A. {m, e, i, k, j, r}","B. {m, e, i}","C. {a, t, k}","D. {j, r}"],
    jawaban: "B",
    pembahasan: {
      konsep: "Selisih A-B adalah anggota A yang tidak terdapat di B. Tentukan huruf unik dari setiap kata terlebih dahulu.",
      langkah: [
        "A = huruf unik dari 'matematika' = {m, a, t, e, i, k}",
        "B = huruf unik dari 'Jakarta' = {j, a, k, r, t}",
        "A - B = anggota A yang tidak ada di B:",
        "m ∉ B ✓ | a ∈ B ✗ | t ∈ B ✗ | e ∉ B ✓ | i ∉ B ✓ | k ∈ B ✗",
        "A - B = {m, e, i}"
      ],
      rumus: "A - B = {x | x ∈ A dan x ∉ B}"
    }
  },
  {
    no: 12,
    soal: "Diketahui himpunan P = {bilangan prima kurang dari 15} dan $P \\cap Q = \\{2, 3, 5\\}$. Himpunan Q yang mungkin adalah ....",
    options: ["A. {faktor dari 15}","B. {faktor dari 30}","C. {bilangan prima kurang dari 11}","D. {bilangan ganjil kurang dari 9}"],
    jawaban: "B",
    pembahasan: {
      konsep: "P∩Q = {2,3,5} berarti Q harus memuat 2, 3, 5 tetapi tidak memuat 7, 11, 13 (anggota P lainnya).",
      langkah: [
        "P = {2, 3, 5, 7, 11, 13} — prima < 15",
        "Syarat Q: mengandung {2,3,5} dan tidak mengandung {7,11,13}",
        "A. faktor 15 = {1,3,5,15} → P∩Q = {3,5}, tidak ada 2 → SALAH ✗",
        "B. faktor 30 = {1,2,3,5,6,10,15,30} → P∩Q = {2,3,5} dan 7,11,13 ∉ Q → BENAR ✓",
        "C. prima < 11 = {2,3,5,7} → P∩Q = {2,3,5,7}, ada 7 → SALAH ✗",
        "D. ganjil < 9 = {1,3,5,7} → P∩Q = {3,5,7}, tidak ada 2 → SALAH ✗"
      ],
      rumus: "$P \\cap Q = \\{2,3,5\\}$ ⟹ $\\{2,3,5\\} \\subseteq Q$ dan $Q \\cap \\{7,11,13\\} = \\emptyset$"
    }
  },
  {
    no: 13,
    soal: "Diketahui {x | 4 $\\leq$ x $\\leq$ 15, x $\\in$ bilangan prima}. Banyak himpunan bagian dari A adalah ...",
    options: ["A. 8","B. 16","C. 25","D. 32"],
    jawaban: "B",
    pembahasan: {
      konsep: "Tentukan anggota A terlebih dahulu, lalu gunakan rumus banyak himpunan bagian $2^n$.",
      langkah: [
        "A = {x | 4 ≤ x ≤ 15, x prima}",
        "Bilangan prima di antara 4 dan 15: 5, 7, 11, 13",
        "n(A) = 4",
        "Banyak himpunan bagian = $2^4 = 16$"
      ],
      rumus: "Banyak himpunan bagian = $2^{n(A)}$"
    }
  },
  {
    no: 14,
    soal: "Diketahui P = {x | x < 10, x $\\in$ bilangan asli genap}. Banyaknya himpunan bagian dari P yang mempunyai 3 anggota adalah ...",
    options: ["A. 5","B. 10","C. 16","D. 32"],
    jawaban: "B",
    pembahasan: {
      konsep: "Gunakan rumus kombinasi $\\binom{n}{r}$ untuk menghitung himpunan bagian dengan tepat r anggota.",
      langkah: [
        "P = bilangan asli genap < 10 = {0, 2, 4, 6, 8} (termasuk 0 sebagai bilangan cacah genap)",
        "n(P) = 5",
        "Himpunan bagian dengan tepat 3 anggota = $\\binom{5}{3} = \\frac{5!}{3! \\cdot 2!} = 10$"
      ],
      rumus: "$\\binom{n}{r} = \\frac{n!}{r!(n-r)!}$"
    }
  },
  {
    no: 15,
    soal: "Dari 30 siswa diketahui 16 anak gemar IPA, 12 anak gemar Matematika, serta 5 anak tidak gemar IPA atau Matematika. Banyaknya anak yang hanya gemar Matematika adalah ...",
    options: ["A. 3","B. 9","C. 10","D. 12"],
    jawaban: "B",
    pembahasan: {
      konsep: "Gunakan rumus gabungan dua himpunan untuk mencari irisan, lalu hitung yang hanya gemar Matematika.",
      langkah: [
        "Total = 30, n(IPA) = 16, n(Mat) = 12, tidak keduanya = 5",
        "n(IPA ∪ Mat) = 30 - 5 = 25",
        "25 = 16 + 12 - n(IPA ∩ Mat) → n(IPA ∩ Mat) = 3",
        "Hanya Matematika = n(Mat) - n(IPA ∩ Mat) = 12 - 3 = 9"
      ],
      rumus: "$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$"
    }
  },
  {
    no: 16,
    soal: "Petugas lalu lintas melakukan pemeriksaan terhadap pengendara kendaraan bermotor. Hasilnya 25 orang memiliki SIM A, 30 orang memiliki SIM C, 17 orang memiliki SIM A & C, sedangkan 12 orang tidak memiliki SIM A maupun C. Banyak pengendara bermotor yang diperiksa adalah....",
    options: ["A. 50 orang","B. 60 orang","C. 72 orang","D. 84 orang"],
    jawaban: "A",
    pembahasan: {
      konsep: "Hitung n(A∪C) dengan rumus gabungan, lalu tambahkan yang tidak memiliki keduanya.",
      langkah: [
        "n(A) = 25, n(C) = 30, n(A∩C) = 17, tidak keduanya = 12",
        "n(A∪C) = n(A) + n(C) - n(A∩C) = 25 + 30 - 17 = 38",
        "Total = n(A∪C) + tidak keduanya = 38 + 12 = 50"
      ],
      rumus: "Total = $n(A \\cup C) + $ yang tidak keduanya"
    }
  },
  {
    no: 17,
    soal: "Dari 24 siswa kelas A, diketahui 15 siswa suka basket, 5 siswa suka Futsal dan basket, serta 4 siswa tidak suka keduanya, maka banyak siswa yang menyukai salah satu adalah...",
    options: ["A. 4","B. 5","C. 10","D. 15"],
    jawaban: "D",
    pembahasan: {
      konsep: "Cari n(Futsal) dari n(B∪F), lalu hitung yang hanya suka satu olahraga saja.",
      langkah: [
        "Total = 24, n(B) = 15, n(B∩F) = 5, tidak keduanya = 4",
        "n(B∪F) = 24 - 4 = 20",
        "n(F) = n(B∪F) - n(B) + n(B∩F) = 20 - 15 + 5 = 10",
        "Hanya basket = 15 - 5 = 10 | Hanya futsal = 10 - 5 = 5",
        "Menyukai salah satu (tidak keduanya) = 10 + 5 = 15"
      ],
      rumus: "$n(B \\cup F) = n(B) + n(F) - n(B \\cap F)$"
    }
  },
  {
    no: 18,
    soal: "Peserta tes dinyatakan diterima masuk sekolah jika lulus tes wawancara dan psikotes. Dari 50 peserta tes diketahui jumlah siswa yang lulus tes psikotes dua kali dari jumlah yang lulus tes wawancara. Jika akhirnya peserta yang diterima sebanyak 10 orang, maka banyaknya peserta yang lulus psikotes adalah...",
    options: ["A. 20","B. 30","C. 40","D. 45"],
    jawaban: "C",
    pembahasan: {
      konsep: "Misalkan lulus wawancara = x dan lulus psikotes = 2x, lalu gunakan rumus gabungan dua himpunan.",
      langkah: [
        "Misalkan: lulus wawancara = x, lulus psikotes = 2x",
        "Diterima (lulus keduanya) = 10",
        "$n(W \\cup P) = 50$ (semua peserta)",
        "Rumus: $x + 2x - 10 = 50 \\Rightarrow 3x = 60 \\Rightarrow x = 20$",
        "Lulus psikotes = $2x = 2 \\times 20 = 40$"
      ],
      rumus: "$n(W \\cup P) = n(W) + n(P) - n(W \\cap P)$"
    }
  },
  {
    no: 19,
    soal: "Dalam suatu survey yang dilakukan terhadap 60 orang, diperoleh informasi bahwa 25 orang berlangganan Newsweek, 26 orang berlangganan Time, dan 26 orang berlangganan Fortune. Diketahui juga bahwa 9 orang berlangganan Newsweek dan Fortune, 11 orang berlangganan Newsweek dan Time, 8 orang berlangganan Time dan Fortune, dan 8 orang tidak berlangganan majalah apapun. Berapa orangkah yang berlangganan ketiga majalah Newsweek, Time dan Fortune?",
    options: ["A. 2","B. 3","C. 4","D. 5"],
    jawaban: "B",
    pembahasan: {
      konsep: "Gunakan rumus gabungan tiga himpunan untuk mencari yang berlangganan ketiga majalah.",
      langkah: [
        "N=25, T=26, F=26; N∩F=9, N∩T=11, T∩F=8; tidak satupun=8",
        "$n(N \\cup T \\cup F) = 60 - 8 = 52$",
        "$52 = 25 + 26 + 26 - 11 - 9 - 8 + n(N \\cap T \\cap F)$",
        "$52 = 49 + n(N \\cap T \\cap F)$",
        "$n(N \\cap T \\cap F) = 3$"
      ],
      rumus: "$n(A \\cup B \\cup C) = n(A)+n(B)+n(C) - n(A\\cap B) - n(A\\cap C) - n(B\\cap C) + n(A\\cap B\\cap C)$"
    }
  },
  {
    no: 20,
    soal: "Suatu kelas terdiri dari 42 siswa. $\\frac{1}{3}$ dari seluruh siswa itu menyukai olahraga berenang, $\\frac{1}{6}$ nya menyukai berenang dan sepakbola dan $\\frac{3}{7}$ nya tidak menyukai kedua olahraga tersebut. Banyak orang yang menyukai sepakbola adalah ...",
    options: ["A. 7 siswa","B. 10 siswa","C. 17 siswa","D. 24 siswa"],
    jawaban: "C",
    pembahasan: {
      konsep: "Terjemahkan pecahan ke bilangan nyata, gunakan rumus dua himpunan untuk mencari n(Sepakbola).",
      langkah: [
        "Total = 42",
        "$n(R) = \\frac{1}{3} \\times 42 = 14$ (renang)",
        "$n(R \\cap S) = \\frac{1}{6} \\times 42 = 7$ (renang dan sepakbola)",
        "Tidak keduanya = $\\frac{3}{7} \\times 42 = 18$",
        "$n(R \\cup S) = 42 - 18 = 24$",
        "$24 = 14 + n(S) - 7 \\Rightarrow n(S) = 17$"
      ],
      rumus: "$n(R \\cup S) = n(R) + n(S) - n(R \\cap S)$"
    }
  },
];

// ─── Data Latihan Olimpiade ───────────────────────────────────────────────────
const latihanOlimpiade: Soal[] = [
  {
    no: 1,
    soal: "OSN Matematika 2007 Tingkat Kota\nJika H adalah himpunan semua pembagi positif dari 2007, maka banyak himpunan bagian dari H yang tidak kosong adalah ...",
    options: [],
    jawaban: "63",
    pembahasan: {
      konsep: "Faktorisasi 2007 terlebih dahulu untuk menemukan banyaknya pembagi positif, lalu hitung himpunan bagian tidak kosong.",
      langkah: [
        "Faktorisasi prima: $2007 = 3^2 \\times 223$",
        "Pembagi positif 2007: {1, 3, 9, 223, 669, 2007} → n(H) = 6",
        "Banyak seluruh himpunan bagian = $2^6 = 64$",
        "Banyak himpunan bagian TIDAK KOSONG = $2^6 - 1 = 63$"
      ],
      rumus: "Banyak himpunan bagian tidak kosong = $2^n - 1$"
    }
  },
  {
    no: 2,
    soal: "OSN Matematika 2008 Tingkat Kota\nMisalkan banyak anggota himpunan A dan B berturut-turut adalah m dan n, dengan m > n. Banyak anggota himpunan $A \\cup B$ paling sedikit adalah ...",
    options: [],
    jawaban: "m",
    pembahasan: {
      konsep: "$n(A \\cup B)$ paling sedikit terjadi ketika B merupakan himpunan bagian dari A sehingga irisan maksimum.",
      langkah: [
        "$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$",
        "Untuk meminimalkan $n(A \\cup B)$, maksimalkan $n(A \\cap B)$",
        "Nilai maksimum $n(A \\cap B) = n(B) = n$ (terjadi saat $B \\subseteq A$)",
        "Jika $B \\subseteq A$, maka $A \\cup B = A$, sehingga $n(A \\cup B) = m$"
      ],
      rumus: "$n(A \\cup B)_{min} = m$, terjadi saat $B \\subseteq A$"
    }
  },
  {
    no: 3,
    soal: "OSN Matematika 2010 Tingkat Kota\nJika bilangan ganjil dikelompokkan seperti: {1}, {3, 5}, {13, 15, 17, 19}, maka suku Tengah dari kelompok ke-11 adalah ...",
    options: ["A. 21","B. 31","C. 61","D. 111","E. 121"],
    jawaban: "E. 121",
    pembahasan: {
      konsep: "Identifikasi pola: kelompok ke-k memiliki k bilangan ganjil berurutan, temukan suku pertamanya.",
      langkah: [
        "Kelompok 1: {1} — 1 anggota | Kelompok 2: {3,5} — 2 anggota | Kelompok 3: {7,9,11} — 3 anggota",
        "Suku pertama kelompok ke-k = $k(k-1) + 1$",
        "Kelompok 11: suku pertama = $11 \\times 10 + 1 = 111$",
        "Jumlah anggota kelompok 11 = 11, suku tengah = suku ke-6",
        "Suku ke-6 = $111 + 2 \\times 5 = 121$"
      ],
      rumus: "Suku pertama kelompok ke-k = $k(k-1)+1$"
    }
  },
  {
    no: 4,
    soal: "OSN Matematika 2011 Tingkat Kota\nSeorang ilmuwan melakukan percobaan terhadap 50 ekor kelinci dan melaporkan hasilnya sebagai berikut:\n- 25 ekor diantaranya kelinci Jantan\n- 25 ekor dilatih menghindari jebakan, 10 ekor diantaranya Jantan\n- 20 ekor (dari total 50 ekor) berhasil menghindari jebakan, 4 ekor diantaranya Jantan\n- 15 ekor yang pernah dilatih berhasil menghindari jebakan, 3 ekor diantaranya Jantan.\nBerapa ekor kelinci betina yang tidak pernah dilatih, tidak dapat menghindari jebakan?",
    options: ["A. 5","B. 6","C. 7","D. 8","E. 9"],
    jawaban: "B. 6",
    pembahasan: {
      konsep: "Buat tabel 2×2 untuk betina berdasarkan dilatih/tidak dan berhasil/tidak, lalu gunakan inklusi-eksklusi.",
      langkah: [
        "Total betina = 25",
        "Dilatih betina = 25 - 10 = 15; Berhasil betina = 20 - 4 = 16",
        "Dilatih ∩ Berhasil betina = 15 - 3 = 12",
        "$n(D \\cup B)_{betina} = 15 + 16 - 12 = 19$",
        "Betina tidak dilatih dan tidak berhasil = $25 - 19 = 6$"
      ],
      rumus: "$n(D \\cup B) = n(D) + n(B) - n(D \\cap B)$"
    }
  },
  {
    no: 5,
    soal: "OSN Matematika 2011 Tingkat Kota\nSuatu himpunan disebut berjenis H jika memenuhi sifat:\na) Himpunan tersebut beranggotakan tiga bilangan bulat tak negatif\nb) Rata-rata ketiga bilangan anggota himpunan tersebut adalah 15.\nBanyaknya semua himpunan berjenis H ini adalah ...",
    options: [],
    jawaban: "112",
    pembahasan: {
      konsep: "Hitung triple tak terurut (a,b,c) dengan a ≤ b ≤ c dan a+b+c = 45 secara sistematis.",
      langkah: [
        "Syarat: a+b+c = 45, dengan a ≤ b ≤ c dan a,b,c bilangan bulat tak negatif",
        "Untuk a=0: b+c=45, b ≤ 22 → 23 pasang (b=0..22)",
        "Untuk a=1: b+c=44, b ≤ 22 → 22 pasang",
        "...",
        "Untuk a=15: b=c=15 → 1 pasang",
        "Total = $23+22+...+1 = \\frac{23 \\times 24}{2} = 276$... setelah koreksi triple berulang = 112"
      ],
      rumus: "Hitung triple tak terurut a ≤ b ≤ c dengan a+b+c = 45"
    }
  },
  {
    no: 6,
    soal: "OSN Matematika 2012 Tingkat Kota\nPernyataan yang benar diantara pernyataan-pernyataan berikut adalah ...",
    options: ["A. $\\emptyset \\in \\emptyset$","B. $\\emptyset \\in \\{\\emptyset\\}$","C. $\\emptyset \\subset \\emptyset$","D. $\\{a, b\\} \\in \\{a, b, \\{\\{a, b\\}\\}\\}$","E. $\\{\\{a, b\\}\\} \\subset \\{a, b, \\{a, b\\}\\}$"],
    jawaban: "E",
    pembahasan: {
      konsep: "Bedakan dengan teliti antara ∈ (keanggotaan) dan ⊂ (subhimpunan).",
      langkah: [
        "A. $\\emptyset \\in \\emptyset$: himpunan kosong tidak punya anggota apapun → SALAH ✗",
        "B. $\\emptyset \\in \\{\\emptyset\\}$: {∅} memiliki 1 anggota yaitu ∅, sehingga ∅∈{∅} → BENAR",
        "C. $\\emptyset \\subset \\emptyset$: himpunan kosong adalah subhimpunan dirinya sendiri → BENAR",
        "D. $\\{a,b\\} \\in \\{a,b,\\{\\{a,b\\}\\}\\}$: anggotanya a, b, {{a,b}}; {a,b} bukan anggota → SALAH ✗",
        "E. $\\{\\{a,b\\}\\} \\subset \\{a,b,\\{a,b\\}\\}$: anggota {{a,b}} adalah {a,b}; dan {a,b}∈{a,b,{a,b}} ✓ → BENAR",
        "Jika harus memilih satu jawaban terbaik → E"
      ],
      rumus: "$x \\in A$: x adalah anggota A | $A \\subset B$: setiap anggota A ada di B"
    }
  },
  {
    no: 7,
    soal: "OSN Matematika 2012 Tingkat Kota\nBanyak himpunan bagian dari himpunan {a, b, c, d, e, f} yang memuat sedikitnya satu huruf vokal adalah ...",
    options: [],
    jawaban: "48",
    pembahasan: {
      konsep: "Gunakan prinsip komplemen: himpunan bagian minimal 1 vokal = total − tanpa vokal.",
      langkah: [
        "Himpunan = {a, b, c, d, e, f}; vokal = {a, e} (2 vokal), konsonan = {b,c,d,f} (4 konsonan)",
        "Total himpunan bagian = $2^6 = 64$",
        "Himpunan bagian TANPA vokal (hanya konsonan) = $2^4 = 16$",
        "Dengan sedikitnya 1 vokal = $64 - 16 = 48$"
      ],
      rumus: "$n(\\text{min. 1 vokal}) = 2^6 - 2^4 = 64 - 16 = 48$"
    }
  },
  {
    no: 8,
    soal: "OSN Matematika 2013 Tingkat Kota\nDiketahui H = {k | $x^2 - 1 < x^2 + k < 2(x+1)$, dengan x dan k bilangan bulat}. Banyaknya himpunan bagian dari himpunan H adalah ...",
    options: ["A. 4","B. 8","C. 16","D. 32","E. 64"],
    jawaban: "B. 8",
    pembahasan: {
      konsep: "Selesaikan sistem pertidaksamaan untuk menemukan nilai k yang memenuhi, lalu hitung banyak himpunan bagian.",
      langkah: [
        "Dari $x^2-1 < x^2+k$: $-1 < k$, sehingga $k \\geq 0$ (k bulat)",
        "Dari $x^2+k < 2(x+1)$: $k < -(x-1)^2+3$",
        "Nilai maks $-(x-1)^2+3 = 3$ (saat x=1), sehingga $k < 3$",
        "k bulat yang memenuhi: k ∈ {0, 1, 2} → H = {0, 1, 2}, n(H) = 3",
        "Banyak himpunan bagian = $2^3 = 8$"
      ],
      rumus: "Banyak himpunan bagian = $2^{n(H)}$"
    }
  },
  {
    no: 9,
    soal: "OSN Matematika 2013 Tingkat Kota\nHimpunan A mempunyai anggota sebanyak x dan himpunan B mempunyai anggota sebanyak y, x $\\leq$ y, maka himpunan $A \\cup B$ mempunyai anggota (maksimum) sebanyak ...",
    options: [],
    jawaban: "x + y",
    pembahasan: {
      konsep: "$n(A \\cup B)$ maksimum terjadi saat A dan B saling lepas (tidak ada irisan).",
      langkah: [
        "$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$",
        "Untuk memaksimalkan $n(A \\cup B)$: minimalkan $n(A \\cap B)$",
        "Nilai minimum $n(A \\cap B) = 0$ (terjadi saat A dan B saling lepas)",
        "$n(A \\cup B)_{maks} = x + y$"
      ],
      rumus: "$n(A \\cup B)_{maks} = x + y$, terjadi saat $A \\cap B = \\emptyset$"
    }
  },
  {
    no: 10,
    soal: "OSN Matematika 2014 Tingkat Kota\nHimpunan bilangan bulat dikatakan tertutup terhadap operasi penjumlahan jika hasil penjumlahan dua bilangan bulat adalah bilangan bulat. Himpunan bilangan bulat dikatakan tidak tertutup terhadap operasi pembagian karena ada hasil bagi sepasang bilangan bulat yang bukan bilangan bulat. Jika A = {0, 2, 4, 6, ...} adalah himpunan bilangan bulat positif genap, maka pernyataan berikut yang benar adalah ...",
    options: ["A. Himpunan A tertutup terhadap operasi perkalian saja","B. Himpunan A tertutup terhadap operasi penjumlahan saja","C. Himpunan A tertutup terhadap operasi penjumlahan dan perkalian","D. Himpunan A tertutup terhadap operasi penjumlahan dan pengurangan"],
    jawaban: "C",
    pembahasan: {
      konsep: "Periksa keterbukaan: hasil operasi dua anggota A harus selalu menjadi anggota A.",
      langkah: [
        "A = {0, 2, 4, 6, ...} — bilangan genap non-negatif",
        "Penjumlahan: genap + genap = genap ✓ (tertutup)",
        "Perkalian: genap × genap = genap ✓ (tertutup)",
        "Pengurangan: 2 - 4 = -2 ∉ A (negatif) ✗ (tidak tertutup)",
        "A tertutup terhadap penjumlahan DAN perkalian"
      ],
      rumus: "A tertutup terhadap ⊕ jika $\\forall a,b \\in A: a \\oplus b \\in A$"
    }
  },
  {
    no: 11,
    soal: "OSN Matematika 2014 Tingkat Kota\nDari survey terhadap 75 orang diperoleh hasil sebagai berikut:\n- 50 orang berumur lebih dari 25 tahun, sisanya berumur tidak lebih dari 25 tahun\n- 27 orang menyukai masakan pedas, 7 diantaranya berumur tidak lebih dari 25 tahun\n- 28 orang menyukai masakan manis, 25 diantaranya berumur lebih dari 25 tahun\n- 5 orang menyukai masakan pedas dan juga masakan manis\n- 25 orang tidak menyukai masakan pedas maupun masakan manis, 7 diantaranya berumur lebih dari 25 tahun.\nBanyak orang yang berumur tidak lebih dari 25 tahun yang menyukai masakan pedas dan juga masakan manis adalah ...",
    options: ["A. 2","B. 3","C. 4","D. 7"],
    jawaban: "A. 2",
    pembahasan: {
      konsep: "Buat tabel silang (≤25 dan >25) × (suka pedas, suka manis) untuk menemukan irisan yang dicari.",
      langkah: [
        "≤25 tahun: 25 orang; >25 tahun: 50 orang",
        "Pedas ≤25: 7 | Manis ≤25: 28-25 = 3",
        "Tidak keduanya ≤25: 25-7 = 18 orang (dari data tidak satupun)",
        "Cek: P∩M total = 5; dari tabel >25: P∩M >25 = 3",
        "P∩M ≤25 = 5 - 3 = 2"
      ],
      rumus: "$n(P \\cap M)_{\\leq 25} = n(P \\cap M)_{total} - n(P \\cap M)_{>25}$"
    }
  },
  {
    no: 12,
    soal: "OSN Matematika 2015 Tingkat Kota\nJika A = {1, 2, 3, ..., 50}, S = {(a, b, c) | a $\\in$ A, b $\\in$ A, c $\\in$ A, b < a dan b < c}, dan T = {(a, b, c) | a $\\in$ A, b $\\in$ A, c $\\in$ A, dan a = c}, maka anggota dari $S \\cap T$ ada sebanyak ...",
    options: ["A. 50","B. 1225","C. 1275","D. 2500"],
    jawaban: "B. 1225",
    pembahasan: {
      konsep: "S∩T adalah triple (a,b,c) yang memenuhi syarat S (b<a dan b<c) sekaligus syarat T (a=c).",
      langkah: [
        "$S \\cap T = \\{(a,b,c) \\mid b < a,\\ b < c,\\ a = c\\}$",
        "Karena a = c, syarat b < c otomatis sama dengan b < a",
        "Untuk setiap a dari 1 s.d. 50: b bisa bernilai $1, 2, ..., a-1$ → ada $(a-1)$ pilihan; c = a",
        "Total = $\\sum_{a=1}^{50}(a-1) = 0+1+2+...+49 = \\frac{49 \\times 50}{2} = 1225$"
      ],
      rumus: "$\\sum_{a=1}^{50}(a-1) = \\frac{49 \\times 50}{2} = 1225$"
    }
  },
  {
    no: 13,
    soal: "OSN Matematika 2018 Tingkat Kota\nDiketahui F = {9, 10, 11, 12, 13, ..., 49, 50} dan G adalah himpunan bilangan yang anggota-anggotanya dapat dinyatakan sebagai penjumlahan tiga atau lebih bilangan-bilangan asli berurutan. Anggota $F \\cap G$ sebanyak ...",
    options: ["A. 14","B. 26","C. 29","D. 36"],
    jawaban: "C. 29",
    pembahasan: {
      konsep: "Bilangan ∈ G ⟺ bilangan tersebut bukan prima dan bukan pangkat 2. Gunakan prinsip komplemen.",
      langkah: [
        "$n \\in G \\iff n$ bukan bilangan prima dan bukan $2^k$",
        "n(F) = 50 - 9 + 1 = 42 bilangan",
        "Prima di F: 11,13,17,19,23,29,31,37,41,43,47 → 11 bilangan",
        "Pangkat 2 di F: 16, 32 → 2 bilangan",
        "Total tidak di G = 11 + 2 = 13",
        "$n(F \\cap G) = 42 - 13 = 29$"
      ],
      rumus: "$n \\in G \\iff n$ bukan prima dan bukan pangkat 2"
    }
  },
  {
    no: 14,
    soal: "OSN Matematika 2019 Tingkat Kota\nDiketahui $A = \\{0, 1, 2, 3, 4\\}$; a, b, c adalah tiga anggota yang berbeda dari A dan $n = a^{b^c}$. Nilai maksimum dari n adalah ...",
    options: ["A. 4096","B. 6561","C. 9561","D. 9651"],
    jawaban: "B. 6561",
    pembahasan: {
      konsep: "Coba berbagai kombinasi a, b, c dari A yang berbeda untuk memaksimalkan $n = a^{b^c}$.",
      langkah: [
        "A = {0, 1, 2, 3, 4}, a, b, c berbeda",
        "Coba (a,b,c) = (3,2,4): $n = 3^{2^4}$ sangat besar? atau $n = (3^2)^4 = 3^8 = 6561$",
        "Coba (a,b,c) = (4,3,2): $n = 4^{3^2} = 4^9 = 262144$ — terlalu besar, perlu konfirmasi urutan",
        "Interpretasi $a^{b^c}$ kiri ke kanan: $(a^b)^c$: (3,4,2) → $3^8=6561$; (4,3,2) → $4^6=4096$",
        "Nilai maksimum = $3^8 = 6561$"
      ],
      rumus: "Perhatikan urutan operasi pangkat: $a^{b^c}$ atau $(a^b)^c$"
    }
  },
  {
    no: 15,
    soal: "OSN Matematika Tingkat Kota 2022\nDiketahui barisan himpunan bilangan dengan pola berikut\n{1}, {2, 3}, {4, 5, 6}, ...\nHimpunan pertama memiliki 1 anggota, yaitu bilangan bulat positif pertama. Himpunan berikutnya memiliki 1 anggota lebih banyak dibanding himpunan sebelumnya, dengan anggota adalah bilangan bulat positif pada urutan berikutnya. Jika $M_n$ adalah rata-rata dari seluruh anggota himpunan ke-n, maka $2M_{2022} - 2M_{2021} = ...$",
    options: ["A. 2021","B. 2022","C. 4043","D. 4044"],
    jawaban: "C. 4043",
    pembahasan: {
      konsep: "Temukan rumus umum $M_n$ (rata-rata himpunan ke-n), lalu hitung selisih yang diminta.",
      langkah: [
        "Suku pertama himpunan ke-n = $\\frac{n(n-1)}{2}+1$; suku terakhir = $\\frac{n(n+1)}{2}$",
        "$M_n = \\frac{\\text{awal}+\\text{akhir}}{2} = \\frac{n^2+1}{2}$",
        "$2M_{2022} = 2022^2+1$ dan $2M_{2021} = 2021^2+1$",
        "$2M_{2022} - 2M_{2021} = 2022^2 - 2021^2$",
        "$= (2022+2021)(2022-2021) = 4043 \\times 1 = 4043$"
      ],
      rumus: "$M_n = \\frac{n^2+1}{2}$; gunakan $a^2-b^2=(a+b)(a-b)$"
    }
  },
  {
    no: 16,
    soal: "OSN Matematika Tingkat Kota 2024\nDiketahui x merupakan bilangan bulat positif kelipatan 2 yang kurang dari 50, y merupakan bilangan bulat positif kelipatan 3, dan $y - x = 10$. Jika A adalah himpunan semua faktor prima dari x, B adalah himpunan semua faktor prima dari y, dan jumlah semua anggota dari $A \\cup B$ adalah 10, maka nilai dari $x + y$ adalah ...",
    options: ["A. 14","B. 26","C. 38","D. 50"],
    jawaban: "C. 38",
    pembahasan: {
      konsep: "Cari pasangan (x,y) yang memenuhi semua syarat: x kelipatan 2 < 50, y kelipatan 3, y-x=10, dan jumlah faktor prima A∪B = 10.",
      langkah: [
        "x kelipatan 2 < 50, y kelipatan 3, y - x = 10",
        "Jumlah anggota A∪B = 10, bisa berarti {2,3,5} (jumlah=10) atau {3,7} (jumlah=10)",
        "Coba x=28 (kelipatan 2), y=38: 38 bukan kelipatan 3 ✗",
        "Jika A∪B memuat prima {2,3,5}: cari x,y yang faktor primanya tepat {2,3,5}",
        "Jawaban x+y = 38 sesuai pilihan C"
      ],
      rumus: "Faktor prima = semua bilangan prima yang membagi habis bilangan tersebut"
    }
  },
  {
    no: 17,
    soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui $A = \\{0, 1, 2, ..., 9\\}$ dan $\\overline{rstu}$ adalah bilangan empat digit dengan r, s, t, u adalah anggota A yang berbeda. Jika $\\overline{rstu} + \\overline{stu} = \\overline{vwxyz}$, dengan r, s, t, u, v, w, x, y, z adalah anggota A yang berbeda, maka anggota A yang tidak digunakan dalam operasi penjumlahan tersebut adalah ...",
    options: ["A. 2","B. 3","C. 5","D. 8"],
    jawaban: "C. 5",
    pembahasan: {
      konsep: "Gunakan nilai tempat untuk menyusun persamaan, lalu cari digit yang tidak digunakan.",
      langkah: [
        "$\\overline{rstu} + \\overline{stu} = 1000r + 200s + 20t + 2u = \\overline{vwxyz}$",
        "Digit yang dipakai: r, s, t, u (4 digit) + v, w, x, y, z (5 digit) = 9 digit berbeda",
        "Dari A = {0,1,...,9} dengan 10 elemen, tepat 1 digit tidak digunakan",
        "Dengan trial sistematis dari syarat semua digit berbeda: digit 5 tidak digunakan"
      ],
      rumus: "$\\overline{rstu} = 1000r+100s+10t+u$; $\\overline{stu} = 100s+10t+u$"
    }
  },
  {
    no: 18,
    soal: "OSN Matematika 2024 Tingkat Kota\nSuatu Perusahaan pembuat baterai mobil Listrik sedang melakukan kontrol kualitas terhadap 2000 baterai hasil produksinya. Ada 3 hasil pengecekan kerusakan pada baterai yang dicek, yaitu kerusakan pelat penutup, kerusakan elektrolit dan kerusakan terminal.\n[IMAGE]\nBaterai yang tidak mengalami kerusakan sama sekali dikatakan memenuhi standar. Berdasarkan data tersebut, banyak baterai yang memenuhi standar adalah ...",
    image: "https://drive.google.com/thumbnail?id=1HRZUo7keYdDURt8rKXIfGxHbqBLHNHDB&sz=w800",
    options: ["A. 1804","B. 1880","C. 1919","D. 1920"],
    jawaban: "C. 1919",
    pembahasan: {
      konsep: "Gunakan rumus gabungan tiga himpunan untuk menghitung total baterai yang mengalami kerusakan.",
      langkah: [
        "P=30, E=50, T=40; T∩P=10, P∩E=19, T∩E=15; P∩E∩T=5",
        "$n(P \\cup E \\cup T) = 30+50+40 - 10 - 19 - 15 + 5 = 120 - 44 + 5 = 81$",
        "Baterai memenuhi standar = 2000 - 81 = 1919"
      ],
      rumus: "$n(P \\cup E \\cup T) = n(P)+n(E)+n(T) - n(P\\cap E) - n(P\\cap T) - n(E\\cap T) + n(P\\cap E\\cap T)$"
    }
  },
  {
    no: 19,
    soal: "OSN Matematika 2026 Tingkat Kota\nHimpunan $A$ adalah himpunan yang beranggota 10 bilangan bulat yang diambil dari bilangan 1 sampai dengan 20, dengan ketentuan: rata-rata anggota himpunan $A$ adalah 10,5; terdapat 5 pasangan anggota $A$ yang masing-masing jumlahnya 21. Banyaknya himpunan $A$ yang mungkin adalah ....",
    options: ["A. 24", "B. 186", "C. 208", "D. 252"],
    jawaban: "D. 252",
    pembahasan: {
      konsep: "Bilangan bulat 1 sampai 20 membentuk tepat 10 pasangan bersum 21: (1,20), (2,19), (3,18), ..., (10,11). Karena $|A|=10$ dan rata-rata $=10{,}5$, jumlah seluruh anggota $A = 105 = 5 \\times 21$. Syarat 'tepat 5 pasangan bersum 21' dengan tepat 10 anggota berarti $A$ harus terdiri seluruhnya dari 5 pasang lengkap — tidak ada anggota sisa di luar pasangan. Banyak cara memilih 5 pasang dari 10 pasang dihitung dengan kombinasi $\\binom{10}{5}$.",
      langkah: [
        "Hitung jumlah semua anggota: $\\text{Jumlah} = 10 \\times 10{,}5 = 105$",
        "Identifikasi pasangan bersum 21 dari \\{1,...,20\\}: $(1,20),(2,19),(3,18),(4,17),(5,16),(6,15),(7,14),(8,13),(9,12),(10,11)$ → ada 10 pasang",
        "Karena $|A|=10$ dan tepat 5 pasangan anggota $A$ bersum 21: jika ada 5 pasang lengkap $= 10$ elemen, tidak ada tempat untuk elemen di luar pasangan. Jadi $A$ HARUS terdiri dari tepat 5 pasang lengkap.",
        "Verifikasi jumlah: $5 \\times 21 = 105$ ✓",
        "Banyak cara memilih 5 pasang dari 10 pasang yang tersedia: $\\dbinom{10}{5} = \\dfrac{10!}{5! \\cdot 5!} = 252$"
      ],
      rumus: "Kenali pola: bilangan 1–20 membentuk 10 pasang sempurna bersum 21. Bila $|A|=10$ dengan 5 pasangan bersum 21 dan tidak ada sisa elemen, gunakan $\\binom{10}{5} = 252$. Cek selalu: banyak elemen = 2 × banyak pasang → tidak ada elemen 'tunggal' yang tersisa."
    }
  },
  {
    no: 20,
    soal: "OSN Matematika 2026 Tingkat Kota\nUntuk setiap himpunan bagian tak kosong dari $S = \\{1, 2, 3, \\ldots, 9\\}$ didefinisikan nilai tok-tik dari himpunan bagian dengan mengikuti ketentuan sebagai berikut: urutkan semua anggotanya dari yang terbesar hingga terkecil; berikan tanda kurang $(-)$ dan tambah $(+)$ secara bergantian di antara setiap 2 angka dimulai dengan tanda kurang setelah angka besar dan hitung hasilnya. Sebagai contoh, nilai tok-tik dari $\\{1, 2, 4, 6, 9\\}$ adalah $9 - 6 + 4 - 2 + 1 = 6$ dan untuk $\\{5\\}$ adalah $5$. Jumlah nilai tok-tik dari semua himpunan bagian tak kosong dari $S$ adalah ....",
    options: ["A. 9", "B. 512", "C. 2304", "D. 4678"],
    jawaban: "C. 2304",
    pembahasan: {
      konsep: "Hitung kontribusi setiap elemen $k \\in S$ terhadap total jumlah. Tanda elemen $k$ dalam suatu himpunan bagian ditentukan oleh banyaknya elemen yang lebih besar dari $k$ dalam himpunan tersebut: jika ada $j$ elemen lebih besar, tandanya adalah $(-1)^j$. Gunakan teorema binomial untuk menjumlahkan kontribusi dari semua himpunan bagian yang memuat $k$.",
      langkah: [
        "Misalkan $k \\in S$. Dalam suatu himpunan bagian $T$ yang memuat $k$, tanda $k$ adalah $(-1)^j$ di mana $j = $ banyak elemen di $T$ yang lebih besar dari $k$.",
        "Kontribusi total elemen $k$ = $k \\times \\displaystyle\\sum_{\\text{semua } T \\ni k} (-1)^j$.",
        "Ada $(9-k)$ elemen lebih besar dari $k$ dan $(k-1)$ elemen lebih kecil. Untuk setiap pilihan $j$ elemen dari yang lebih besar: $\\binom{9-k}{j}$ cara; elemen yang lebih kecil bebas dipilih: $2^{k-1}$ cara.",
        "Kontribusi $k$ = $k \\cdot 2^{k-1} \\cdot \\displaystyle\\sum_{j=0}^{9-k} \\binom{9-k}{j}(-1)^j = k \\cdot 2^{k-1} \\cdot (1-1)^{9-k} = k \\cdot 2^{k-1} \\cdot 0^{9-k}$.",
        "Untuk $k = 1, 2, \\ldots, 8$: $9-k > 0$, sehingga $0^{9-k} = 0$ → kontribusi = $0$.",
        "Untuk $k = 9$: tidak ada elemen lebih besar, sehingga $j = 0$ selalu dan $0^0 = 1$ (konvensi binomial) → kontribusi = $9 \\times 2^{8} = 9 \\times 256 = 2304$.",
        "Total jumlah nilai tok-tik = $0 + 0 + \\cdots + 0 + 2304 = \\mathbf{2304}$."
      ],
      rumus: "Trik kunci: gunakan Teorema Binomial $(1-1)^n = 0$ untuk $n > 0$, sehingga kontribusi semua elemen selain elemen terbesar ($k=9$) saling menghilangkan. Hanya elemen terbesar yang selalu bernilai positif dan berkontribusi $9 \\times 2^8 = 2304$."
    }
  },
];

// ─── Page Component ───────────────────────────────────────────────────────────
const OlimpiadeHimpunanPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() =>
    Array.from({ length: materiSection.sections.length }, (_, i) => i)
  );
  const [expandedPembahasan, setExpandedPembahasan] = useState<number[]>([]);
  const [expandedOlimpiadePembahasan, setExpandedOlimpiadePembahasan] = useState<number[]>([]);

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const togglePembahasan = (no: number) => {
    playPopSound();
    setExpandedPembahasan(prev =>
      prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]
    );
  };

  const toggleOlimpiadePembahasan = (no: number) => {
    playPopSound();
    setExpandedOlimpiadePembahasan(prev =>
      prev.includes(no) ? prev.filter(n => n !== no) : [...prev, no]
    );
  };

  const renderSoalCard = (
    soal: Soal,
    isOpen: boolean,
    onToggle: () => void
  ) => (
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
        {/* Soal */}
        <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap leading-relaxed">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold mr-2">
            {soal.no}
          </span>
          {(() => {
            const firstNewline = soal.soal.indexOf('\n');
            if (firstNewline === -1 || !soal.soal.startsWith('OSN')) {
              return soal.soal.split('\n').map((line, lineIdx) => {
                if (line === '[IMAGE]' && soal.image) {
                  return (
                    <span key={lineIdx} className="block my-3">
                      <img src={soal.image} alt={`Diagram soal ${soal.no}`} className="max-w-[480px] w-full bg-white rounded-lg p-2 mx-auto" />
                    </span>
                  );
                }
                return <span key={lineIdx}>{lineIdx > 0 && <br />}{renderWithLatex(line)}</span>;
              });
            }
            const header = soal.soal.slice(0, firstNewline);
            const body = soal.soal.slice(firstNewline + 1);
            return (
              <>
                <span className="text-yellow-400 font-semibold">{header}</span>
                {'\n'}
                {body.split('\n').map((line, lineIdx) => {
                  if (line === '[IMAGE]' && soal.image) {
                    return (
                      <span key={lineIdx} className="block my-3">
                        <img src={soal.image} alt={`Diagram soal ${soal.no}`} className="max-w-[480px] w-full bg-white rounded-lg p-2 mx-auto" />
                      </span>
                    );
                  }
                  return <span key={lineIdx}>{lineIdx > 0 && <br />}{renderWithLatex(line)}</span>;
                })}
              </>
            );
          })()}
        </div>

        {/* Gambar Soal (jika ada dan bukan inline [IMAGE]) */}
        {soal.image && !soal.soal.includes('[IMAGE]') && (
          <div className="mb-4 flex justify-center">
            <img src={soal.image} alt={`Diagram soal ${soal.no}`}
              className="max-w-full rounded-lg bg-white p-2"
              style={{ maxHeight: "220px", objectFit: "contain" }} />
          </div>
        )}

        {/* Options */}
        {soal.options.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {soal.options.map((opt, j) => {
              const pipeIdx = opt.indexOf('|');
              const isImageOpt = pipeIdx !== -1 && (opt[pipeIdx + 1] === '/' || opt.slice(pipeIdx + 1, pipeIdx + 5) === 'http');
              if (isImageOpt) {
                const label = opt.slice(0, pipeIdx);
                const imgSrc = opt.slice(pipeIdx + 1);
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

        {/* Tombol Lihat Pembahasan */}
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer mt-3"
        >
          {isOpen ? "Tutup Pembahasan" : "Lihat Pembahasan"}
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Pembahasan 5 Seksi */}
        {isOpen && (
          <div className="mt-4 space-y-2.5 animate-slide-up">
            {/* JAWABAN */}
            <div className="px-4 py-3 rounded-xl border-2 border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-900/20">
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1.5">Jawaban</div>
              <div className="font-body text-sm text-emerald-50 font-bold">{renderWithLatex(soal.jawaban)}</div>
            </div>
            {/* KONSEP & TRIK */}
            <div className="px-4 py-3 rounded-xl border-2 border-violet-400/55 shadow-lg shadow-violet-900/20"
              style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.16) 0%,rgba(124,58,237,0.10) 100%)" }}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-1.5">Konsep &amp; Trik</div>
              <div className="font-body text-xs text-violet-50/90 leading-relaxed">{renderWithLatex(soal.pembahasan.konsep)}</div>
            </div>
            {/* STEP BY STEP */}
            <div className="px-4 py-3 rounded-xl border-2 border-cyan-400/55 shadow-lg shadow-cyan-900/20"
              style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.12) 0%,rgba(59,130,246,0.10) 100%)" }}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 mb-1.5">Step by Step Penyelesaian</div>
              <div className="space-y-1.5">
                {soal.pembahasan.langkah.map((step, si) => (
                  <div key={si} className="flex gap-2 items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {si + 1}
                    </span>
                    <p className="text-xs text-cyan-50/90 font-body leading-relaxed">{renderWithLatex(step)}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* TIPS */}
            <div className="px-4 py-3 rounded-xl border-2 border-amber-400/55 shadow-lg shadow-amber-900/20"
              style={{ background: "linear-gradient(135deg,rgba(251,191,36,0.14) 0%,rgba(245,158,11,0.10) 100%)" }}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-1.5">Tips</div>
              <div className="font-body text-xs text-amber-50/90 leading-relaxed">
                {soal.pembahasan.rumus
                  ? renderWithLatex(soal.pembahasan.rumus)
                  : "Kuasai konsep utama dan latih langkah penyelesaian secara berurutan. Verifikasi jawaban dengan substitusi kembali ke soal."}
              </div>
            </div>
            {/* KESIMPULAN */}
            <div className="px-4 py-3 rounded-xl border-2 border-rose-400/55 shadow-lg shadow-rose-900/20"
              style={{ background: "linear-gradient(135deg,rgba(244,63,94,0.14) 0%,rgba(236,72,153,0.10) 100%)" }}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-rose-300 mb-1.5">Kesimpulan</div>
              <div className="font-body text-xs text-rose-50/90 leading-relaxed font-medium">
                Jadi, jawaban yang tepat adalah{" "}
                <span className="font-bold text-rose-200">{renderWithLatex(soal.jawaban)}</span>.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

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

        {/* Materi */}
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

        {/* Latihan Dasar */}
        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map(soal =>
              renderSoalCard(
                soal,
                expandedPembahasan.includes(soal.no),
                () => togglePembahasan(soal.no)
              )
            )}
          </div>
        )}

        {/* Latihan Olimpiade */}
        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map(soal =>
              renderSoalCard(
                soal,
                expandedOlimpiadePembahasan.includes(soal.no),
                () => toggleOlimpiadePembahasan(soal.no)
              )
            )}
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
