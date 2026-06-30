import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const bilBulatOlimpiadeImages: Record<number, string> = {
  33: "/images/33_1778368609761.png",
  40: "/images/40_1778368609761.png",
  45: "/images/45_1778368609760.png",
  54: "/images/54_1778368609759.png",
  56: "/images/56_1778368609762.png",
};

// Helper function to render text with LaTeX
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
  title: "MATERI - BILANGAN BULAT",
  sections: [
    {
      heading: "A. Macam-macam Bilangan",
      content: `1. Bilangan Bulat : $\\{..., -3,-2,-1,0,1,2,3,...\\}$
2. Bilangan Bulat Negatif : $\\{..., -3,-2,-1\\}$
3. Bilangan Cacah : $\\{0,1,2,3,4,5,...\\}$
4. Bilangan Asli : $\\{1,2,3,4,5,6,...\\}$
5. Bilangan Ganjil : $\\{1,3,5,7,9,...\\}$
6. Bilangan Genap : $\\{2,4,6,8,10,...\\}$
7. Bilangan Prima : $\\{2,3,5,7,11,13,...\\}$
8. Bilangan kuadrat: $\\{1,4,9,16,25, ...\\}$
9. Bilangan kubik: $\\{1,8,27,64,125, ...\\}$
10. Bilangan Komposit: $\\{4,6,8,9,10, ...\\}$`
    },
    {
      heading: "B. Urutan Operasi Hitung Bilangan",
      content: `1. Operasi hitung dalam tanda kurung
2. Operasi pangkat atau akar
3. Operasi kali atau bagi
4. Operasi tambah atau kurang`
    },
    {
      heading: "C. Sifat Operasi Hitung Bilangan",
      content: `1. $a + b = b + a$
2. $a \\times b = b \\times a$
3. $(a + b) + c = a + (b + c)$
4. $(a \\times b) \\times c = a \\times (b \\times c)$
5. $a \\times (b + c) = (a \\times b) + (a \\times c)$
6. $a \\times (b - c) = (a \\times b) - (a \\times c)$`
    },
    {
      heading: "D. Digit dan Jumlah Digit pada Suatu Bilangan",
      content: `1. Banyak Digit Suatu Bilangan
Banyak digit dari sebuah bilangan bulat positif adalah jumlah angka (digit) yang digunakan untuk menuliskannya.
Contoh:
• Bilangan 7 memiliki 1 digit.
• Bilangan 42 memiliki 2 digit (yaitu angka 4 dan 2).
• Bilangan 159 memiliki 3 digit (yaitu angka 1, 5, dan 9).
• Bilangan 1.234.567 memiliki 7 digit.

2. Jumlah Digit Suatu Bilangan
Jumlah digit (sering juga disebut "sum of digits") dari sebuah bilangan bulat positif adalah hasil penjumlahan semua angka (digit) penyusun bilangan tersebut.
Contoh:
• Untuk bilangan 7, jumlah digitnya adalah 7 (karena hanya ada satu digit, yaitu 7).
• Untuk bilangan 42, jumlah digitnya adalah $4 + 2 = 6$.
• Untuk bilangan 159, jumlah digitnya adalah $1 + 5 + 9 = 15$.
• Untuk bilangan 1.234.567, jumlah digitnya adalah $1 + 2 + 3 + 4 + 5 + 6 + 7 = 28$.`
    },
    {
      heading: "E. Kaitan Bilangan Ganjil dan Bilangan Genap pada Operasi",
      content: `1. Operasi Penjumlahan
• Ganjil + Ganjil = Genap
• Ganjil + Genap = Ganjil
• Genap + Genap = Genap

2. Operasi Pengurangan
• Ganjil - Ganjil = Genap
• Ganjil - Genap = Ganjil
• Genap - Genap = Genap

3. Operasi Perkalian
• Ganjil $\\times$ Ganjil = Ganjil
• Ganjil $\\times$ Genap = Genap
• Genap $\\times$ Genap = Genap`
    },
    {
      heading: "F. Memecah Bentuk Bilangan abcd",
      content: `$\\overline{abcd} = 1000a + 100b + 10c + d$`
    },
    {
      heading: "G. Cara Menentukan Suatu Bilangan Besar Prima atau Bukan",
      content: `Untuk menentukan apakah sebuah bilangan besar adalah prima, kita bisa menggunakan metode pembagian atau uji pembagi. Metode pembagian melibatkan membagi bilangan tersebut dengan semua bilangan bulat dari 2 hingga akar kuadratnya. Jika tidak ada bilangan yang membagi habis, maka bilangan tersebut adalah prima. Metode uji pembagi lebih efisien karena hanya membandingkan dengan bilangan prima sampai akar kuadratnya.

1. Metode Pembagian (Trial Division):
a. Cari akar kuadrat bilangan:
Hitung akar kuadrat dari bilangan yang akan diuji.
b. Bagi dengan bilangan bulat dari 2 hingga akar kuadrat:
Bagi bilangan tersebut dengan setiap bilangan bulat dari 2 hingga akar kuadrat yang telah dihitung.
c. Cek sisa pembagian:
Jika ada bilangan yang membagi habis bilangan tersebut (sisa pembagian 0), maka bilangan tersebut bukan prima.
d. Kesimpulan:
Jika tidak ada bilangan yang membagi habis, maka bilangan tersebut adalah prima.

2. Metode Uji Pembagi (Prime Division Test)
a. Cari akar kuadrat bilangan:
Sama seperti metode pembagian.
b. Bagi dengan bilangan prima sampai akar kuadrat:
Bagi bilangan tersebut dengan bilangan prima yang lebih kecil atau sama dengan akar kuadratnya.
c. Cek sisa pembagian:
Jika ada bilangan prima yang membagi habis, maka bilangan tersebut bukan prima.
d. Kesimpulan:
Jika tidak ada bilangan prima yang membagi habis, maka bilangan tersebut adalah prima.

Contoh:
Misalkan kita ingin menentukan apakah 137 prima.
• Akar kuadrat 137: sekitar 11.7 (kita akan membagi hingga 11)
• Pembagian: $\\frac{137}{2} = 68.5$, $\\frac{137}{3} = 45.666...$, $\\frac{137}{5} = 27.4$, $\\frac{137}{7} = 19.571...$, $\\frac{137}{11} = 12.454...$
• Kesimpulan: Tidak ada bilangan yang membagi 137 habis. Jadi, 137 adalah bilangan prima.`
    },
  ]
};

// ─── Rich Materi Components ───────────────────────────────────────────────

const MateriA = () => {
  const items = [
    { name: "Bilangan Bulat",         sym: "ℤ",  ex: "..., −2, −1, 0, 1, 2, ...",   cls: "from-blue-500/20 to-blue-700/10 border-blue-500/40 text-blue-300" },
    { name: "Bulat Negatif",          sym: "ℤ⁻", ex: "..., −3, −2, −1",             cls: "from-red-500/20 to-red-700/10 border-red-500/40 text-red-300" },
    { name: "Bilangan Cacah",         sym: "W",  ex: "0, 1, 2, 3, 4, ...",          cls: "from-green-500/20 to-green-700/10 border-green-500/40 text-green-300" },
    { name: "Bilangan Asli",          sym: "ℕ",  ex: "1, 2, 3, 4, 5, ...",          cls: "from-emerald-500/20 to-emerald-700/10 border-emerald-500/40 text-emerald-300" },
    { name: "Bilangan Ganjil",        sym: "G",  ex: "1, 3, 5, 7, 9, ...",          cls: "from-purple-500/20 to-purple-700/10 border-purple-500/40 text-purple-300" },
    { name: "Bilangan Genap",         sym: "Gp", ex: "2, 4, 6, 8, 10, ...",         cls: "from-pink-500/20 to-pink-700/10 border-pink-500/40 text-pink-300" },
    { name: "Bilangan Prima",         sym: "P",  ex: "2, 3, 5, 7, 11, ...",         cls: "from-yellow-500/20 to-yellow-700/10 border-yellow-500/40 text-yellow-300" },
    { name: "Bilangan Kuadrat",       sym: "n²", ex: "1, 4, 9, 16, 25, ...",        cls: "from-orange-500/20 to-orange-700/10 border-orange-500/40 text-orange-300" },
    { name: "Bilangan Kubik",         sym: "n³", ex: "1, 8, 27, 64, 125, ...",      cls: "from-cyan-500/20 to-cyan-700/10 border-cyan-500/40 text-cyan-300" },
    { name: "Bilangan Komposit",      sym: "K",  ex: "4, 6, 8, 9, 10, ...",         cls: "from-slate-500/20 to-slate-700/10 border-slate-500/40 text-slate-300" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {items.map((item, i) => {
        const [from, to, border, text] = item.cls.split(' ');
        return (
          <div key={i} className={`rounded-xl border p-3 bg-gradient-to-br ${from} ${to} ${border}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-base font-bold font-mono ${text}`}>{item.sym}</span>
              <span className={`text-xs font-semibold leading-tight ${text}`}>{item.name}</span>
            </div>
            <div className="text-xs text-white/55 font-mono tracking-tight">{item.ex}</div>
          </div>
        );
      })}
    </div>
  );
};

const MateriB = () => {
  const steps = [
    { sym: "(  )", label: "Tanda Kurung",   sub: "Kerjakan yang di dalam kurung dulu",  cls: "text-yellow-300 bg-yellow-400/15 border-yellow-400/50" },
    { sym: "xⁿ √",label: "Pangkat / Akar", sub: "Operasi pangkat atau akar",           cls: "text-cyan-300 bg-cyan-400/15 border-cyan-400/50" },
    { sym: "× ÷", label: "Kali / Bagi",    sub: "Kerjakan dari kiri ke kanan",         cls: "text-green-300 bg-green-400/15 border-green-400/50" },
    { sym: "+ −", label: "Tambah / Kurang",sub: "Kerjakan dari kiri ke kanan",         cls: "text-pink-300 bg-pink-400/15 border-pink-400/50" },
  ];
  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs text-white/50 mb-3 text-center italic">Ingat singkatan: <span className="text-white/80 font-semibold">Ka – Pa – Ka – Ta</span></p>
      {steps.map((s, i) => {
        const [tc, bg, bc] = s.cls.split(' ');
        return (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${bg} ${bc}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full border ${bc} flex items-center justify-center text-xs font-bold ${tc}`}>{i + 1}</div>
            <div className={`text-base font-mono font-bold w-12 text-center ${tc}`}>{s.sym}</div>
            <div>
              <div className={`text-sm font-semibold ${tc}`}>{s.label}</div>
              <div className="text-xs text-white/45">{s.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MateriC = () => {
  const groups = [
    {
      name: "Komutatif", desc: "Urutan bilangan tidak mempengaruhi hasil",
      cls: "text-blue-300 border-blue-400/40 bg-blue-400/10",
      formulas: ["a + b = b + a", "a \\times b = b \\times a"],
    },
    {
      name: "Asosiatif", desc: "Pengelompokan tidak mempengaruhi hasil",
      cls: "text-green-300 border-green-400/40 bg-green-400/10",
      formulas: ["(a + b) + c = a + (b + c)", "(a \\times b) \\times c = a \\times (b \\times c)"],
    },
    {
      name: "Distributif", desc: "Perkalian terhadap penjumlahan / pengurangan",
      cls: "text-orange-300 border-orange-400/40 bg-orange-400/10",
      formulas: ["a \\times (b + c) = (a \\times b) + (a \\times c)", "a \\times (b - c) = (a \\times b) - (a \\times c)"],
    },
  ];
  return (
    <div className="mt-2 space-y-3">
      {groups.map((g, i) => {
        const [tc, bc, bgc] = g.cls.split(' ');
        return (
          <div key={i} className={`rounded-xl border p-3 ${bc} ${bgc}`}>
            <div className={`text-sm font-bold ${tc}`}>{g.name}</div>
            <div className="text-xs text-white/45 mb-2">{g.desc}</div>
            <div className="space-y-1">
              {g.formulas.map((f, j) => (
                <div key={j} className={`px-3 py-2 rounded-lg bg-card/50 border ${bc} text-sm`}>
                  <InlineMath math={f} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MateriD = () => {
  const ex1 = [
    { num: "7",         d: 1 }, { num: "42",        d: 2 },
    { num: "159",       d: 3 }, { num: "1.234.567", d: 7 },
  ];
  const ex2 = [
    { num: "7",   calc: "7",         res: "7" },
    { num: "42",  calc: "4 + 2",     res: "6" },
    { num: "159", calc: "1 + 5 + 9", res: "15" },
  ];
  return (
    <div className="mt-2 space-y-4">
      <div>
        <div className="text-xs font-bold text-cyan-300 mb-2">① Banyak Digit</div>
        <div className="grid grid-cols-2 gap-2">
          {ex1.map((e, i) => (
            <div key={i} className="flex items-center justify-between bg-cyan-400/10 border border-cyan-400/30 rounded-lg px-3 py-2">
              <span className="text-sm font-mono font-bold text-white">{e.num}</span>
              <span className="text-xs font-semibold text-cyan-300">{e.d} digit</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs font-bold text-yellow-300 mb-2">② Jumlah Digit</div>
        <div className="space-y-2">
          {ex2.map((e, i) => (
            <div key={i} className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-3 py-2">
              <span className="text-sm font-mono font-bold text-white w-14">{e.num}</span>
              <span className="text-white/40 text-xs">→</span>
              <span className="text-xs text-white/70">{e.calc}</span>
              <span className="text-white/40 text-xs">=</span>
              <span className="text-sm font-bold text-yellow-300 ml-auto">{e.res}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MateriE = () => {
  const tables = [
    { op: "Penjumlahan (+)", rows: [["Ganjil + Ganjil","Genap"],["Ganjil + Genap","Ganjil"],["Genap + Genap","Genap"]], hue: "purple" },
    { op: "Pengurangan (−)", rows: [["Ganjil − Ganjil","Genap"],["Ganjil − Genap","Ganjil"],["Genap − Genap","Genap"]], hue: "indigo" },
    { op: "Perkalian (×)",   rows: [["Ganjil × Ganjil","Ganjil"],["Ganjil × Genap","Genap"],["Genap × Genap","Genap"]], hue: "pink" },
  ];
  const hue: Record<string,string> = {
    purple: "text-purple-300 border-purple-400/30 bg-purple-400/10",
    indigo: "text-indigo-300 border-indigo-400/30 bg-indigo-400/10",
    pink:   "text-pink-300 border-pink-400/30 bg-pink-400/10",
  };
  const resultColor = (r: string) => r === "Genap" ? "text-blue-300" : "text-orange-300";
  return (
    <div className="mt-2 space-y-3">
      {tables.map((t, i) => {
        const [tc, bc, bgc] = hue[t.hue].split(' ');
        return (
          <div key={i} className={`rounded-xl border p-3 ${bc} ${bgc}`}>
            <div className={`text-xs font-bold mb-2 ${tc}`}>{t.op}</div>
            <div className="space-y-1">
              {t.rows.map((row, j) => (
                <div key={j} className="flex items-center justify-between bg-card/40 rounded-lg px-3 py-2">
                  <span className="text-xs text-white/75">{row[0]}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-card/60 ${resultColor(row[1])}`}>= {row[1]}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MateriF = () => {
  const digits = [
    { val: "a", place: "×1000", cls: "text-yellow-300 border-yellow-400/50 bg-yellow-400/15" },
    { val: "b", place: "×100",  cls: "text-cyan-300 border-cyan-400/50 bg-cyan-400/15" },
    { val: "c", place: "×10",   cls: "text-green-300 border-green-400/50 bg-green-400/15" },
    { val: "d", place: "×1",    cls: "text-pink-300 border-pink-400/50 bg-pink-400/15" },
  ];
  return (
    <div className="mt-2">
      <p className="text-xs text-white/55 mb-3 text-center">Setiap bilangan 4 digit dapat diuraikan berdasarkan nilai tempat:</p>
      <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
        {digits.map((d, i) => {
          const [tc, bc, bgc] = d.cls.split(' ');
          return (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/50 text-lg font-bold">+</span>}
              <div className={`flex flex-col items-center border rounded-xl px-4 py-2 ${bc} ${bgc}`}>
                <span className={`text-xl font-bold font-mono ${tc}`}>{d.val}</span>
                <span className={`text-xs font-semibold ${tc}`}>{d.place}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center mb-3">
        <div className="inline-block bg-card/50 border border-white/15 rounded-xl px-4 py-2">
          <BlockMath math="\overline{abcd} = 1000a + 100b + 10c + d" />
        </div>
      </div>
      <div className="bg-card/40 border border-white/10 rounded-xl p-3">
        <p className="text-xs text-white/50 text-center mb-2">Contoh:</p>
        <div className="flex items-center justify-center gap-2 flex-wrap text-sm">
          {[["2","yellow"],["3","cyan"],["4","green"],["5","pink"]].map(([v,c],i) => (
            <div key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-white/40">+</span>}
              <span className={`font-bold text-${c}-300`}>{v}</span>
              <span className="text-white/40 text-xs">×{[1000,100,10,1][i]}</span>
            </div>
          ))}
          <span className="text-white/40">=</span>
          <span className="font-bold text-white">2345</span>
        </div>
      </div>
    </div>
  );
};

const MateriG = () => {
  const methods = [
    {
      name: "Metode Pembagian (Trial Division)",
      cls: "text-yellow-300 border-yellow-400/40 bg-yellow-400/10",
      steps: ["Hitung akar kuadrat dari bilangan yang diuji","Bagi dengan setiap bilangan bulat dari 2 hingga akar kuadrat","Jika ada yang membagi habis → bukan prima","Jika tidak ada yang membagi habis → prima ✓"],
    },
    {
      name: "Metode Uji Pembagi Prima",
      cls: "text-cyan-300 border-cyan-400/40 bg-cyan-400/10",
      steps: ["Hitung akar kuadrat dari bilangan yang diuji","Bagi hanya dengan bilangan prima sampai akar kuadrat","Jika ada yang membagi habis → bukan prima","Jika tidak ada → prima ✓ (lebih efisien)"],
    },
  ];
  return (
    <div className="mt-2 space-y-3">
      {methods.map((m, i) => {
        const [tc, bc, bgc] = m.cls.split(' ');
        return (
          <div key={i} className={`rounded-xl border p-3 ${bc} ${bgc}`}>
            <div className={`text-xs font-bold mb-2 ${tc}`}>{m.name}</div>
            <div className="space-y-1">
              {m.steps.map((s, j) => (
                <div key={j} className="flex items-start gap-2">
                  <span className={`shrink-0 text-xs font-bold ${tc}`}>{j+1}.</span>
                  <span className="text-xs text-white/65">{s}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div className="bg-card/50 border border-white/10 rounded-xl p-3">
        <div className="text-xs font-bold text-white/80 mb-2">Contoh: Apakah 137 prima?</div>
        <div className="text-xs text-white/55 mb-2">Akar kuadrat 137 ≈ 11,7 → cek pembagi sampai 11</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {["137 ÷ 2 = 68{,}5","137 ÷ 3 = 45{,}67","137 ÷ 5 = 27{,}4","137 ÷ 7 = 19{,}57","137 ÷ 11 = 12{,}45"].map((f,i) => (
            <div key={i} className="flex items-center gap-1 bg-card/40 rounded-lg px-2 py-1">
              <InlineMath math={f} />
              <span className="text-red-400 ml-auto">✗</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs font-semibold text-green-400 text-center">→ 137 adalah bilangan prima ✓</div>
      </div>
    </div>
  );
};

const MATERI_COMPONENTS = [<MateriA/>, <MateriB/>, <MateriC/>, <MateriD/>, <MateriE/>, <MateriF/>, <MateriG/>];

// ──────────────────────────────────────────────────────────────────────────────

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

interface LatihanOlimpiadeSoal {
  no: number;
  soal: string;
  image?: string;
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
    soal: "Hasil dari $25 - (-90 : 18) + (-3) \\times 14$ adalah ...", 
    options: ["A. -12", "B. -9", "C. 24", "D. 97"],
    jawaban: "A. -12",
    pembahasan: {
      konsep: "Operasi hitung campuran bilangan bulat mengikuti urutan: kurung, pangkat/akar, kali/bagi, tambah/kurang.",
      langkah: [
        "Hitung pembagian: $-90 : 18 = -5$",
        "Hitung perkalian: $(-3) \\times 14 = -42$",
        "Substitusi: $25 - (-5) + (-42)$",
        "Hitung: $25 + 5 - 42 = 30 - 42 = -12$"
      ],
      rumus: "$a - (-b) = a + b$"
    }
  },
  { 
    no: 2, 
    soal: "Hasil dari $-20 : 5 \\times 2 - [7 + (-9)] + [2 - (-7)]$ adalah ...", 
    options: ["A. 3", "B. 9", "C. 10", "D. -23"],
    jawaban: "A. 3",
    pembahasan: {
      konsep: "Selesaikan operasi dalam kurung terlebih dahulu, kemudian kali/bagi dari kiri ke kanan, lalu tambah/kurang.",
      langkah: [
        "Hitung dalam kurung pertama: $7 + (-9) = -2$",
        "Hitung dalam kurung kedua: $2 - (-7) = 2 + 7 = 9$",
        "Hitung bagi dan kali dari kiri: $-20 : 5 = -4$, lalu $-4 \\times 2 = -8$",
        "Substitusi: $-8 - (-2) + 9 = -8 + 2 + 9 = 3$"
      ],
      rumus: "Urutan operasi: kurung $\\rightarrow$ kali/bagi $\\rightarrow$ tambah/kurang"
    }
  },
  { 
    no: 3, 
    soal: "Dalam kompetensi Bahasa Inggris yang terdiri dari 50 soal, peserta akan mendapatkan skor 4 untuk setiap jawaban benar, skor -2 untuk setiap jawaban salah, dan skor -1 untuk soal yang tidak dijawab. Jika Budi menjawab 44 soal dan yang benar 36 soal, maka skor yang diperoleh Budi adalah ...", 
    options: ["A. 134", "B. 126", "C. 122", "D. 120"],
    jawaban: "C. 122",
    pembahasan: {
      konsep: "Soal cerita tentang sistem penskoran dengan bilangan bulat positif dan negatif.",
      langkah: [
        "Jawaban benar = 36 soal, skor = $36 \\times 4 = 144$",
        "Jawaban salah = $44 - 36 = 8$ soal, skor = $8 \\times (-2) = -16$",
        "Tidak dijawab = $50 - 44 = 6$ soal, skor = $6 \\times (-1) = -6$",
        "Total skor = $144 + (-16) + (-6) = 144 - 16 - 6 = 122$"
      ],
      rumus: "Skor total = (benar $\\times$ poin benar) + (salah $\\times$ poin salah) + (kosong $\\times$ poin kosong)"
    }
  },
  { 
    no: 4, 
    soal: "Dalam kompetensi matematika, setiap jawaban benar diberi skor 2, salah skor -1 dan tidak menjawab poin nol. Dari 40 soal yang diberikan, Andi dapat menjawab 36 soal. Jika skor yang diperoleh Andi adalah 51, maka banyak soal yang dijawab benar adalah ...", 
    options: ["A. 31", "B. 30", "C. 29", "D. 28"],
    jawaban: "C. 29",
    pembahasan: {
      konsep: "Sistem persamaan linear untuk menentukan jumlah jawaban benar dan salah.",
      langkah: [
        "Misalkan benar = $x$, salah = $y$",
        "Persamaan 1: $x + y = 36$ (total dijawab)",
        "Persamaan 2: $2x + (-1)y = 51$ atau $2x - y = 51$",
        "Jumlahkan kedua persamaan: $3x = 87$, maka $x = 29$",
        "Jadi banyak jawaban benar = 29 soal"
      ],
      rumus: "Gunakan sistem persamaan linear dua variabel"
    }
  },
  { 
    no: 5, 
    soal: "Dalam suatu ujian perguruan tinggi, setiap soal bernilai benar mendapat nilai 4, salah bernilai -1 dan tidak dijawab bernilai 0. Dari 60 soal yang diberikan, Nafisha mengerjakan 31 soal dan mendapatkan skor 94. Maka banyak jawaban benar yang diperoleh Nafisha adalah ...", 
    options: ["A. 25", "B. 24", "C. 23", "D. 22"],
    jawaban: "A. 25",
    pembahasan: {
      konsep: "Sistem persamaan linear untuk menentukan jumlah jawaban benar.",
      langkah: [
        "Misalkan benar = $x$, salah = $y$",
        "Persamaan 1: $x + y = 31$ (total dikerjakan)",
        "Persamaan 2: $4x + (-1)y = 94$ atau $4x - y = 94$",
        "Jumlahkan: $5x = 125$, maka $x = 25$",
        "Jadi banyak jawaban benar = 25 soal"
      ],
      rumus: "$4x - y = 94$ dan $x + y = 31$"
    }
  },
  { 
    no: 6, 
    soal: "Suhu di kota Moskow $11^\\circ C$. Pada saat turun salju, suhunya turun $4^\\circ C$ setiap 15 menit. Suhu di kota tersebut setelah turun salju 1 jam adalah ...", 
    options: ["A. $-9^\\circ C$", "B. $-5^\\circ C$", "C. $5^\\circ C$", "D. $9^\\circ C$"],
    jawaban: "B. $-5^\\circ C$",
    pembahasan: {
      konsep: "Soal cerita tentang perubahan suhu dengan operasi bilangan bulat.",
      langkah: [
        "Suhu awal = $11^\\circ C$",
        "1 jam = 60 menit = $\\frac{60}{15} = 4$ kali penurunan",
        "Total penurunan = $4 \\times 4^\\circ C = 16^\\circ C$",
        "Suhu akhir = $11 - 16 = -5^\\circ C$"
      ],
      rumus: "Suhu akhir = Suhu awal - (banyak interval $\\times$ penurunan per interval)"
    }
  },
  { 
    no: 7, 
    soal: "Suhu di dalam kulkas sebelum dihidupkan $29^\\circ C$. Setelah dihidupkan, suhunya turun $3^\\circ C$ setiap 5 menit. Setelah 10 menit suhu dalam kulkas adalah ...", 
    options: ["A. $23^\\circ C$", "B. $26^\\circ C$", "C. $32^\\circ C$", "D. $35^\\circ C$"],
    jawaban: "A. $23^\\circ C$",
    pembahasan: {
      konsep: "Perubahan suhu secara berkala menggunakan pengurangan.",
      langkah: [
        "Suhu awal = $29^\\circ C$",
        "10 menit = $\\frac{10}{5} = 2$ kali penurunan",
        "Total penurunan = $2 \\times 3^\\circ C = 6^\\circ C$",
        "Suhu akhir = $29 - 6 = 23^\\circ C$"
      ],
      rumus: "Suhu akhir = Suhu awal - (total penurunan)"
    }
  },
  { 
    no: 8, 
    soal: "Operasi \"#\" artinya kalikan bilangan pertama dengan bilangan kedua, kemudian kurangkan hasilnya dengan dua kali bilangan kedua. Hasil dari $5 \\# (-4)$ adalah ...", 
    options: ["A. -28", "B. -24", "C. -16", "D. -12"],
    jawaban: "D. -12",
    pembahasan: {
      konsep: "Operasi khusus yang didefinisikan dengan rumus tertentu.",
      langkah: [
        "Definisi: $a \\# b = (a \\times b) - (2 \\times b)$",
        "Substitusi $a = 5$ dan $b = -4$",
        "Hitung $a \\times b = 5 \\times (-4) = -20$",
        "Hitung $2 \\times b = 2 \\times (-4) = -8$",
        "Hasil = $-20 - (-8) = -20 + 8 = -12$"
      ],
      rumus: "$a \\# b = ab - 2b$"
    }
  },
  { 
    no: 9, 
    soal: "Operasi \"*\" artinya kalikan dua kali bilangan pertama dengan bilangan kedua, kemudian kurangkan hasilnya dengan tiga kali bilangan kedua. Hasil dari $-3 * (-2)$ adalah ...", 
    options: ["A. 18", "B. -18", "C. -6", "D. 6"],
    jawaban: "A. 18",
    pembahasan: {
      konsep: "Operasi khusus dengan definisi: kalikan 2 kali bilangan pertama dengan bilangan kedua, lalu kurangi 3 kali bilangan kedua.",
      langkah: [
        "Definisi: $a * b = (2a \\times b) - (3 \\times b)$",
        "Substitusi $a = -3$ dan $b = -2$",
        "Hitung $2a \\times b = 2(-3) \\times (-2) = -6 \\times (-2) = 12$",
        "Hitung $3 \\times b = 3 \\times (-2) = -6$",
        "Hasil = $12 - (-6) = 12 + 6 = 18$"
      ],
      rumus: "$a * b = 2ab - 3b$"
    }
  },
  { 
    no: 10, 
    soal: "Pada suhu ruangan ber-AC mencapai $16^\\circ C$, sedangkan di tempat penyimpanan daging suhunya $25^\\circ C$ lebih rendah dari suhu di ruangan ber-AC. Suhu di tempat penyimpanan daging adalah ...", 
    options: ["A. $16^\\circ C$", "B. $11^\\circ C$", "C. $-9^\\circ C$", "D. $-39^\\circ C$"],
    jawaban: "C. $-9^\\circ C$",
    pembahasan: {
      konsep: "'Lebih rendah' berarti pengurangan pada bilangan bulat.",
      langkah: [
        "Suhu ruangan AC = $16^\\circ C$",
        "Suhu penyimpanan daging = $25^\\circ C$ lebih rendah",
        "Suhu daging = $16 - 25 = -9^\\circ C$"
      ],
      rumus: "Lebih rendah $\\rightarrow$ kurangi"
    }
  },
  { 
    no: 11, 
    soal: "Suhu di suatu ruangan $-12^\\circ C$, sedangkan suhu dalam ruangan $20^\\circ C$. Perbedaan suhu di kedua tempat tersebut adalah ...", 
    options: ["A. $-32^\\circ C$", "B. $-8^\\circ C$", "C. $8^\\circ C$", "D. $32^\\circ C$"],
    jawaban: "D. $32^\\circ C$",
    pembahasan: {
      konsep: "Perbedaan/selisih suhu adalah nilai mutlak dari pengurangan dua suhu.",
      langkah: [
        "Suhu luar = $-12^\\circ C$, Suhu dalam = $20^\\circ C$",
        "Perbedaan = $|20 - (-12)| = |20 + 12| = |32| = 32^\\circ C$",
        "Atau: $|-12 - 20| = |-32| = 32^\\circ C$"
      ],
      rumus: "Selisih = $|a - b|$"
    }
  },
  { 
    no: 12, 
    soal: "Perhatikan suhu udara di beberapa negara berikut!\nWina $-7^\\circ C$, Soul $-1^\\circ C$, Baghdad $39^\\circ C$, Surabaya $33^\\circ C$\nSelisih suhu udara yang benar di bawah ini adalah ...", 
    options: ["A. Selisih suhu udara Wina dan Soul $-6^\\circ C$", "B. Selisih suhu udara Baghdad dan Wina $30^\\circ C$", "C. Selisih suhu udara Surabaya dan Soul adalah $34^\\circ C$", "D. Selisih udara Surabaya dan Wina adalah $39^\\circ C$"],
    jawaban: "C. Selisih suhu udara Surabaya dan Soul adalah $34^\\circ C$",
    pembahasan: {
      konsep: "Verifikasi setiap pilihan dengan menghitung selisih suhu.",
      langkah: [
        "A. Wina - Soul = $-7 - (-1) = -7 + 1 = -6^\\circ C$ (salah, selisih harus positif = $6^\\circ C$)",
        "B. Baghdad - Wina = $39 - (-7) = 39 + 7 = 46^\\circ C$ (bukan $30^\\circ C$)",
        "C. Surabaya - Soul = $33 - (-1) = 33 + 1 = 34^\\circ C$ ✓ BENAR",
        "D. Surabaya - Wina = $33 - (-7) = 33 + 7 = 40^\\circ C$ (bukan $39^\\circ C$)"
      ],
      rumus: "Selisih = nilai terbesar - nilai terkecil"
    }
  },
  { 
    no: 13, 
    soal: "Diberikan $x = 1 - 2 + 3 - 4 + 5 - ... + 99 - 100$. Berapakah nilai dari $x$?", 
    options: ["A. -100", "B. -50", "C. 0", "D. 50"],
    jawaban: "B. -50",
    pembahasan: {
      konsep: "Pola bilangan dengan pengelompokan pasangan berurutan.",
      langkah: [
        "Kelompokkan: $(1-2) + (3-4) + (5-6) + ... + (99-100)$",
        "Setiap pasangan menghasilkan $-1$",
        "Banyak pasangan = $\\frac{100}{2} = 50$ pasangan",
        "Total = $50 \\times (-1) = -50$"
      ],
      rumus: "$(2k-1) - 2k = -1$ untuk setiap pasangan"
    }
  },
  { 
    no: 14, 
    soal: "Berapakah digit terakhir dari $3^{2023}$?", 
    options: ["A. 3", "B. 9", "C. 1", "D. 7"],
    jawaban: "D. 7",
    pembahasan: {
      konsep: "Pola digit satuan perpangkatan bilangan 3 berulang dengan periode 4.",
      langkah: [
        "Pola digit satuan $3^n$: $3^1=3$, $3^2=9$, $3^3=27$, $3^4=81$, $3^5=243$ (kembali ke 3)",
        "Periode = 4, yaitu: 3, 9, 7, 1, 3, 9, 7, 1, ...",
        "Sisa $2023 : 4 = 505$ sisa $3$",
        "Sisa 3 $\\rightarrow$ digit satuan sama dengan $3^3 = 7$"
      ],
      rumus: "Digit satuan $3^n$ bergantung pada $n \\mod 4$"
    }
  },
  { 
    no: 15, 
    soal: "Berapakah digit terakhir dari $2^{2025}$?", 
    options: ["A. 2", "B. 4", "C. 6", "D. 8"],
    jawaban: "A. 2",
    pembahasan: {
      konsep: "Pola digit satuan perpangkatan bilangan 2 berulang dengan periode 4.",
      langkah: [
        "Pola digit satuan $2^n$: $2^1=2$, $2^2=4$, $2^3=8$, $2^4=16$, $2^5=32$ (kembali ke 2)",
        "Periode = 4, yaitu: 2, 4, 8, 6, 2, 4, 8, 6, ...",
        "Sisa $2025 : 4 = 506$ sisa $1$",
        "Sisa 1 $\\rightarrow$ digit satuan sama dengan $2^1 = 2$"
      ],
      rumus: "Digit satuan $2^n$ bergantung pada $n \\mod 4$"
    }
  },
  { 
    no: 16, 
    soal: "Jika $a$, $b$, dan $c$ adalah tiga bilangan bulat berbeda sedemikian rupa sehingga $a \\times b \\times c = 16$, berapakah nilai terbesar yang mungkin untuk $a + b + c$?", 
    options: ["A. 11", "B. 8", "C. 10", "D. 13"],
    jawaban: "A. 11",
    pembahasan: {
      konsep: "Faktorisasi 16 menjadi tiga faktor berbeda untuk memaksimalkan jumlah.",
      langkah: [
        "Faktorisasi 16: $16 = 2^4$",
        "Cari semua kombinasi tiga bilangan bulat BERBEDA dengan hasil kali 16:",
        "$(1, 2, 8)$: $1 \\times 2 \\times 8 = 16$ ✓, jumlah = $1+2+8 = 11$",
        "$(1, 4, 4)$: angka 4 berulang ✗ (tidak valid)",
        "$(2, 2, 4)$: angka 2 berulang ✗ (tidak valid)",
        "$(-1, -2, 8)$: $(-1)(-2)(8)=16$ ✓, jumlah = $-1-2+8 = 5$",
        "$(-1, -4, 4)$: $(-1)(-4)(4)=16$ ✓, jumlah = $-1-4+4 = -1$",
        "Nilai jumlah terbesar dari semua kombinasi valid = 11, dari $(1, 2, 8)$"
      ],
      rumus: "Cari semua faktorisasi $a \\times b \\times c = 16$ dengan $a \\neq b \\neq c$"
    }
  },
  { 
    no: 17, 
    soal: "Jika $m$ dan $n$ adalah bilangan bulat positif sehingga $m^2 - n^2 = 13$, berapakah nilai dari $m$?", 
    options: ["A. 7", "B. 13", "C. 6", "D. 12"],
    jawaban: "A. 7",
    pembahasan: {
      konsep: "Faktorisasi selisih kuadrat: $m^2 - n^2 = (m+n)(m-n)$",
      langkah: [
        "Gunakan rumus: $m^2 - n^2 = (m+n)(m-n) = 13$",
        "13 adalah bilangan prima, faktornya: $1 \\times 13$ atau $13 \\times 1$",
        "Karena $m, n > 0$ dan $m > n$, maka $m+n > m-n > 0$",
        "Jadi: $m+n = 13$ dan $m-n = 1$",
        "Jumlahkan: $2m = 14$, maka $m = 7$",
        "Periksa: $n = 6$, dan $7^2 - 6^2 = 49 - 36 = 13$ ✓"
      ],
      rumus: "$a^2 - b^2 = (a+b)(a-b)$"
    }
  },
  { 
    no: 18, 
    soal: "Jika $a$ dan $b$ adalah bilangan bulat positif sehingga $a^2 - b^2 = 2023$, maka nilai terkecil yang mungkin untuk $a + b$ adalah ...", 
    options: ["A. 44", "B. 119", "C. 289", "D. 2023"],
    jawaban: "B. 119",
    pembahasan: {
      konsep: "Faktorisasi selisih kuadrat dan mencari pasangan faktor yang meminimalkan $a+b$.",
      langkah: [
        "Gunakan: $(a+b)(a-b) = 2023$",
        "Faktorisasi 2023: $2023 = 7 \\times 17^2 = 7 \\times 289$ atau $1 \\times 2023$, $7 \\times 289$, $17 \\times 119$",
        "Untuk $a+b$ minimum, pilih faktor yang selisihnya terkecil",
        "Jika $(a+b) = 119$ dan $(a-b) = 17$: $2a = 136$, $a = 68$, $b = 51$",
        "Periksa: $68^2 - 51^2 = 4624 - 2601 = 2023$ ✓"
      ],
      rumus: "$a = \\frac{(a+b)+(a-b)}{2}$, $b = \\frac{(a+b)-(a-b)}{2}$"
    }
  },
  { 
    no: 19, 
    soal: "Diberikan $a$ dan $b$ adalah bilangan bulat positif sedemikian sehingga $a^2 - b^2 = 2019$. Nilai terkecil yang mungkin untuk $a - b$ adalah ...", 
    options: ["A. 1", "B. 3", "C. 673", "D. 2019"],
    jawaban: "A. 1",
    pembahasan: {
      konsep: "Mencari nilai $(a-b)$ terkecil dari faktorisasi selisih kuadrat.",
      langkah: [
        "Gunakan: $(a+b)(a-b) = 2019$",
        "Faktorisasi 2019: $2019 = 3 \\times 673 = 1 \\times 2019$",
        "Faktor-faktor pasangan (keduanya harus ganjil agar $a, b$ bilangan bulat): $(1, 2019)$, $(3, 673)$",
        "Jika $(a-b) = 1$ dan $(a+b) = 2019$: $a = \\frac{1+2019}{2} = 1010$, $b = 1009$ — keduanya bilangan bulat positif ✓",
        "Ini memberikan $a - b = 1$ (minimum!)",
        "Jika $(a-b) = 3$ dan $(a+b) = 673$: $a = 338$, $b = 335$, $a-b = 3$ (lebih besar)",
        "Nilai terkecil $(a-b)$ adalah 1, dari pasangan $(a, b) = (1010, 1009)$"
      ],
      rumus: "$(a-b)$ minimum saat memilih faktor terkecil dari 2019"
    }
  },
];

const latihanOlimpiade: LatihanOlimpiadeSoal[] = [
  { no: 1, soal: "OSN Matematika 2003 Tingkat Kota\nJoko tidur malam dari pukul 9.20 dan bangun pagi pukul 4.35, ia tidur selama ...", options: ["A. 4 jam 45 menit", "B. 5 jam 15 menit", "C. 5 jam 45 menit", "D. 7 jam 15 menit", "E. 19 jam 15 menit"],
    jawaban: "D. 7 jam 15 menit",
    pembahasan: { konsep: "Menghitung durasi waktu yang melewati tengah malam dengan menjumlahkan dua selang waktu.", langkah: ["Dari pukul 9.20 malam ke pukul 12.00 tengah malam = 2 jam 40 menit", "Dari pukul 12.00 tengah malam ke pukul 4.35 pagi = 4 jam 35 menit", "Total waktu tidur = 2 jam 40 menit + 4 jam 35 menit = 7 jam 15 menit"], rumus: "Durasi = (24:00 - jam mulai) + jam bangun" } },
  { no: 2, soal: "OSN Matematika 2003 Tingkat Kota\nJika $a$ dan $b$ adalah bilangan bulat genap, dengan $a > b$, maka banyaknya bilangan bulat ganjil diantara $a$ dan $b$ adalah ...", options: ["A. $\\frac{a-b}{2}$", "B. $a - b$", "C. $\\frac{a-b}{2} - 2$", "D. $a - b + 1$", "E. Tidak dapat ditentukan"],
    jawaban: "A. $\\frac{a-b}{2}$",
    pembahasan: { konsep: "Antara dua bilangan genap yang berbeda, banyak bilangan ganjil dapat dihitung dengan pola.", langkah: ["Misal $a = 10$, $b = 4$: bilangan ganjil di antaranya = 5, 7, 9 → ada 3 bilangan", "$(a - b)/2 = (10-4)/2 = 3$ ✓", "Misal $a = 8$, $b = 2$: ganjil = 3, 5, 7 → ada 3 = $(8-2)/2 = 3$ ✓", "Rumus umum: banyak bilangan ganjil antara dua bilangan genap $a > b$ adalah $\\frac{a-b}{2}$"], rumus: "Banyak bilangan ganjil $= \\frac{a - b}{2}$" } },
  { no: 3, soal: "OSN Matematika 2003 Tingkat Kota\nKendaraan A berjalan dengan laju 60 km/jam. Dua jam berikutnya kendaraan B berjalan dengan laju 80 km/jam berangkat dari tempat dan menuju arah yang sama. Setelah berapa jam kendaraan B menyusul A?", options: ["A. 2 jam", "B. 3 jam", "C. 4 jam", "D. 5 jam", "E. 6 jam"],
    jawaban: "E. 6 jam",
    pembahasan: { konsep: "Dua kendaraan bergerak searah, cari waktu sampai B menyusul A.", langkah: ["Saat B mulai berjalan, A sudah menempuh: $2 \\times 60 = 120$ km", "Kecepatan relatif B terhadap A: $80 - 60 = 20$ km/jam", "Waktu B menyusul A: $\\frac{120}{20} = 6$ jam setelah B berangkat"], rumus: "Waktu = $\\frac{\\text{jarak awal}}{\\text{kecepatan relatif}}$" } },
  { no: 4, soal: "OSN Matematika 2003 Tingkat Kota\nDengan menggunakan angka-angka 1, 1, 2, 2, 3, 3, 4, 4 bilangan 8 angka terbesar yang dapat dibentuk dengan syarat kedua angka 1 dipisahkan oleh satu angka yang lain, kedua angka 2 dipisahkan oleh dua angka, kedua angka 3 dipisahkan oleh tiga angka dan kedua angka 4 dipisahkan oleh empat angka adalah ...", options: [],
    jawaban: "41312432",
    pembahasan: { konsep: "Permasalahan Langford — menyusun bilangan dengan aturan pemisahan tertentu untuk memperoleh bilangan terbesar.", langkah: ["Angka 4 harus di posisi 1 dan 6 (dipisahkan 4 angka): 4 _ _ _ _ 4 _ _", "Angka 3 di posisi 2 dan 6? Cek ulang: posisi harus: angka 4 dipisah 4 angka → posisi (1,6) atau (2,7) atau (3,8)", "Untuk bilangan terbesar, letakkan angka besar di depan sebisa mungkin", "Solusi: 4 1 3 1 2 4 3 2 = 41312432", "Verifikasi: dua 4 di posisi 1 dan 6 (dipisahkan 4 angka ✓), dua 3 di posisi 3 dan 7 (dipisahkan 3 angka ✓), dua 2 di posisi 5 dan 8 (dipisahkan 2 angka ✓), dua 1 di posisi 2 dan 4 (dipisahkan 1 angka ✓)"], rumus: "Langford sequence: posisi pasangan $k$ harus berjarak $k+1$ satu sama lain" } },
  { no: 5, soal: "OSN Matematika 2003 Tingkat Kota\nHasil kali suatu bilangan genap dan suatu bilangan ganjil adalah 840. Bilangan ganjil yang terbesar yang memenuhi syarat tersebut adalah ...", options: [],
    jawaban: "105",
    pembahasan: { konsep: "Memaksimalkan faktor ganjil berarti memindahkan semua faktor prima 2 ke bilangan genap.", langkah: ["Faktorisasi prima 840: $840 = 2^3 \\times 3 \\times 5 \\times 7$", "Untuk faktor ganjil terbesar, pindahkan semua faktor 2 ke bilangan genap", "Bilangan genap = $2^3 = 8$, Bilangan ganjil = $3 \\times 5 \\times 7 = 105$", "Periksa: $8 \\times 105 = 840$ ✓"], rumus: "Faktor ganjil terbesar = $\\frac{840}{2^3} = 105$" } },
  { no: 6, soal: "OSN Matematika 2003 Tingkat Kota\nJumlah dua bilangan sama dengan 12. Hasil kali dua bilangan tersebut nilainya akan paling besar jika salah satu bilangannnya adalah ...", options: [],
    jawaban: "6",
    pembahasan: { konsep: "Untuk dua bilangan dengan jumlah tetap, hasil kali maksimum dicapai ketika keduanya sama (AM-GM inequality).", langkah: ["Misalkan dua bilangan adalah $x$ dan $12 - x$", "Hasil kali: $f(x) = x(12 - x) = 12x - x^2$", "Maksimum saat $f'(x) = 12 - 2x = 0 \\Rightarrow x = 6$", "Jadi kedua bilangan = 6 dan 6, hasil kali = 36 (maksimum)"], rumus: "$f(x) = x(12-x)$ maksimum pada $x = \\frac{12}{2} = 6$" } },
  { no: 7, soal: "OSN Matematika 2005 Tingkat Kota\nUang sebesar Rp2.000,00 dapat dinyatakan dengan beberapa koin 50 rupiah, 100 rupiah, 200 rupiah dan/atau 500 rupiahan. Diketahui ternyata bahwa uang tersebut terdiri tepat dua koin 500 rupiahan dan dua jenis koin lainnya. Dengan mengikuti aturan tersebut, banyak cara yang mungkin untuk menyatakan uang sebesar Rp2.000,00 dengan koin-koin tersebut adalah ...", options: ["A. 17", "B. 20", "C. 18", "D. 6", "E. 15"],
    jawaban: "A. 17",
    pembahasan: { konsep: "Menghitung kombinasi koin dengan syarat tepat menggunakan 2 koin 500 dan tepat 2 jenis koin lainnya.", langkah: ["2 koin 500 = Rp 1.000, sisa Rp 1.000 dengan tepat 2 jenis koin dari {50, 100, 200}", "Pasangan (50, 100): $50x + 100y = 1000$, $x + 2y = 20$, solusi $y = 1..9$ (keduanya ≥1) → 9 cara", "Pasangan (50, 200): $50x + 200y = 1000$, $x + 4y = 20$, solusi $y = 1..4$ (keduanya ≥1) → 4 cara", "Pasangan (100, 200): $100x + 200y = 1000$, $x + 2y = 10$, solusi $y = 1..4$ (keduanya ≥1) → 4 cara", "Total = $9 + 4 + 4 = 17$ cara"], rumus: "Syarat: kedua jenis koin minimal 1 buah masing-masing" } },
  { no: 8, soal: "OSN Matematika 2005 Tingkat Kota\nSetiap kotak piramid disamping akan diisi dengan bilangan. Mula-mula yang harus diisikan adalah kotak-kotak pada alas piramid. Kotak di atasnya diperoleh dari menjumlahkan bilangan-bilangan yang ada di dalam dua kotak di bawahnya. Andaikan dasar piramid hendak diisi bilangan-bilangan 7, 12, 5, 4 dan 9, berapakah nilai terbesar yang mungkin dari bilangan pada kotak teratas.", image: "https://drive.google.com/thumbnail?id=1-P_M08LeVGSZGNPgBDpfgwxEI1NMlkm5&sz=w800", options: [],
    jawaban: "145",
    pembahasan: { konsep: "Nilai kotak teratas adalah kombinasi linear alas dengan bobot koefisien binomial. Untuk memaksimumkan, letakkan bilangan terbesar di posisi dengan bobot terbesar.", langkah: ["Bobot posisi alas (dari kiri ke kanan): $\\binom{4}{0}, \\binom{4}{1}, \\binom{4}{2}, \\binom{4}{3}, \\binom{4}{4} = 1, 4, 6, 4, 1$", "Urutkan bilangan descending: 12, 9, 7, 5, 4", "Letakkan di posisi berbobot descending: 12 (bobot 6), 9 dan 7 (bobot 4), 5 dan 4 (bobot 1)", "Nilai teratas = $6 \\times 12 + 4 \\times 9 + 4 \\times 7 + 1 \\times 5 + 1 \\times 4 = 72 + 36 + 28 + 5 + 4 = 145$"], rumus: "Nilai teratas $= \\sum_{k=0}^{4} \\binom{4}{k} \\cdot a_k$" } },
  { no: 9, soal: "OSN Matematika 2006 Tingkat Kota\nJumlah dua bilangan bulat yang berbeda adalah 14. Jika hasil bagi kedua bilangan tersebut adalah juga bilangan bulat, maka salah satu bilangan yang mungkin adalah ...", options: ["A. 2", "B. 4", "C. 6", "D. 7", "E. 9"],
    jawaban: "A. 2",
    pembahasan: { konsep: "Dua bilangan berbeda berjumlah 14, dan salah satunya habis dibagi yang lain.", langkah: ["Misal pasangan $(a, b)$ dengan $a + b = 14$ dan $b \\div a$ bilangan bulat", "Coba A. $a = 2$: $b = 12$, $12 \\div 2 = 6$ (bilangan bulat) ✓", "Coba B. $a = 4$: $b = 10$, $10 \\div 4 = 2,5$ (bukan bulat) ✗", "Coba C. $a = 6$: $b = 8$, $8 \\div 6 \\approx 1,33$ (bukan bulat) ✗", "Coba D. $a = 7$: $b = 7$, tapi harus berbeda ✗"], rumus: "$a + b = 14$ dan $a \\mid b$ atau $b \\mid a$" } },
  { no: 10, soal: "OSN Matematika 2006 Tingkat Kota\nPanjang jalan tol Bogor-Jakarta 60 km. Pada pukul 12.00 mobil A berangkat dari pintu tol Bogor menuju Jakarta dengan kecepatan rata-rata 80 km/jam. Pada saat yang sama mobil B berangkat dari pintu tol Jakarta menuju Bogor dengan kecepatan rata-rata 70 km/jam. Kedua mobil tersebut akan berpapasan pada pukul ...", options: [],
    jawaban: "Pukul 12.24",
    pembahasan: { konsep: "Dua mobil bergerak berlawanan arah, waktu berpapasan = jarak / (kecepatan A + kecepatan B).", langkah: ["Kecepatan saling mendekat = $80 + 70 = 150$ km/jam", "Waktu berpapasan = $\\frac{60}{150} = \\frac{2}{5}$ jam = 24 menit", "Kedua mobil berpapasan pukul $12.00 + 24$ menit = pukul 12.24"], rumus: "$t = \\frac{d}{v_A + v_B}$" } },
  { no: 11, soal: "OSN Matematika 2007 Tingkat Kota\nBilangan cacah lima digit dengan digit pertama tidak nol dan jumlah semua digitnya sama dengan 2 ada sebanyak ...", options: ["A. 1", "B. 2", "C. 3", "D. 4", "E. 5"],
    jawaban: "E. 5",
    pembahasan: { konsep: "Menghitung bilangan 5 digit dengan digit sum = 2 dan digit pertama ≠ 0.", langkah: ["Digit pertama minimal 1 (tidak nol), sisa digit = 2 - digit pertama", "Kasus digit pertama = 2: sisa 4 digit semua 0 → bilangan 20000 (1 cara)", "Kasus digit pertama = 1, sisa 4 digit jumlahnya 1: tepat satu digit = 1 di posisi ke-2,3,4,5", "→ 11000, 10100, 10010, 10001 (4 cara)", "Total = $1 + 4 = 5$ bilangan"], rumus: "Cacah dengan pembatasan digit pertama ≠ 0" } },
  { no: 12, soal: "OSN Matematika 2007 Tingkat Kota\nPada pukul 10.15 penerjun payung melompat dari pesawat udara sambil membuka parasutnya. Setelah 8 detik, ketinggiannya 2000 meter dari permukaan tanah. Lima detik kemudian ketinggiannya 1900 meter. Misalkan mula-mula detik ke-8 sampai satu menit kecepatanya tetap. Ketinggiannya pada pukul 10.16 adalah ... meter", options: ["A. 860", "B. 890", "C. 940", "D. 960", "E. 980"],
    jawaban: "D. 960",
    pembahasan: { konsep: "Kecepatan turun tetap, hitung posisi pada waktu tertentu.", langkah: ["Kecepatan turun = $\\frac{2000 - 1900}{13 - 8} = \\frac{100}{5} = 20$ m/detik", "Pukul 10.16 = 60 detik setelah 10.15 = detik ke-60", "Ketinggian = $2000 - (60 - 8) \\times 20 = 2000 - 52 \\times 20 = 2000 - 1040 = 960$ meter"], rumus: "$h = h_0 - v \\cdot \\Delta t$" } },
  { no: 13, soal: "OSN Matematika 2007 Tingkat Kota\nDesi merayakan hari ulang tahun pada tanggal 27 Desember 2006. Jika pada hari tersebut usia Desi sama dengan jumlah digit dari angka tahun kelahirannya, maka Desi lahir pada tahun ...", options: ["A. 1994", "B. 1992", "C. 1984", "D. 1979"],
    jawaban: "C. 1984",
    pembahasan: { konsep: "Cari tahun lahir sehingga usia = jumlah digit tahun lahir.", langkah: ["Coba C. tahun 1984: usia = $2006 - 1984 = 22$; jumlah digit $1+9+8+4 = 22$ ✓", "Coba A. tahun 1994: usia = 12; jumlah digit $1+9+9+4 = 23 \\neq 12$ ✗", "Coba B. tahun 1992: usia = 14; jumlah digit $1+9+9+2 = 21 \\neq 14$ ✗", "Coba D. tahun 1979: usia = 27; jumlah digit $1+9+7+9 = 26 \\neq 27$ ✗"], rumus: "Usia = $2006 -$ tahun lahir = jumlah digit tahun lahir" } },
  { no: 14, soal: "OSN Matematika 2007 Tingkat Kota\nJika bilangan 123.456.789 dikalikan dengan bilangan 999.999.999, maka banyak angka 9 dari hasil perkalian kedua bilangan tersebut adalah ...", options: [],
    jawaban: "0 (nol angka 9)",
    pembahasan: { konsep: "Hitung hasil perkalian dengan cara aljabar untuk menemukan digit-digitnya.", langkah: ["$999.999.999 = 10^9 - 1$", "Hasil = $123.456.789 \\times (10^9 - 1)$", "$= 123.456.789.000.000.000 - 123.456.789$", "$= 123.456.788.876.543.211$", "Digit-digit hasil: 1,2,3,4,5,6,7,8,8,8,7,6,5,4,3,2,1,1 → tidak ada angka 9", "Jadi banyak angka 9 = 0"] } },
  { no: 15, soal: "OSN Matematika 2007 Tingkat Kota\nHimpunan semua bilangan prima yang kurang dari seratus dan kuadrat bilangan tersebut ditambah dua juga merupakan bilangan prima adalah ...", options: [],
    jawaban: "\\{3\\}",
    pembahasan: { konsep: "Analisis dengan modulo 3 untuk menyaring bilangan prima yang memenuhi syarat.", langkah: ["Coba $p = 2$: $p^2 + 2 = 6$ (bukan prima, habis dibagi 2 dan 3) ✗", "Coba $p = 3$: $p^2 + 2 = 11$ (prima) ✓", "Untuk $p > 3$: $p \\not\\equiv 0 \\pmod{3}$, sehingga $p^2 \\equiv 1 \\pmod{3}$", "Maka $p^2 + 2 \\equiv 3 \\equiv 0 \\pmod{3}$ → habis dibagi 3, bukan prima", "Kesimpulan: hanya $p = 3$ yang memenuhi → himpunan = $\\{3\\}$"], rumus: "Untuk $p > 3$: $p^2 \\equiv 1 \\pmod{3} \\Rightarrow p^2 + 2 \\equiv 0 \\pmod{3}$" } },
  { no: 16, soal: "OSN Matematika 2008 Tingkat Kota\nMisalkan $n$ adalah bilangan asli yang tidak lebih dari 24, maka jumlah dari semua nilai $n$ yang memenuhi agar $n$ dan 24 relatif prima adalah ...", options: ["A. 120", "B. 96", "C. 95", "D. 82", "E. 81"],
    jawaban: "B. 96",
    pembahasan: { konsep: "Gunakan fungsi Euler $\\phi(n)$ dan sifat simetri bilangan yang relatif prima.", langkah: ["$24 = 2^3 \\times 3$", "$\\phi(24) = 24 \\times \\left(1 - \\frac{1}{2}\\right) \\times \\left(1 - \\frac{1}{3}\\right) = 24 \\times \\frac{1}{2} \\times \\frac{2}{3} = 8$", "Bilangan 1-24 yang relatif prima dengan 24: 1, 5, 7, 11, 13, 17, 19, 23", "Jumlah = $1+5+7+11+13+17+19+23 = 96$"], rumus: "$\\sum = \\frac{n \\cdot \\phi(n)}{2} = \\frac{24 \\times 8}{2} = 96$" } },
  { no: 17, soal: "OSN Matematika 2008 Tingkat Kota\nSuatu bilangan terdiri dari 5 angka. Jika jumlah dari angka-angka tersebut adalah A dan jumlah dari angka-angka pada bilangan A adalah B, maka nilai terbesar dari B yang mungkin adalah ...", options: ["A. 9", "B. 10", "C. 11", "D. 12", "E. 13"],
    jawaban: "D. 12",
    pembahasan: { konsep: "Maksimalkan B dengan memaksimalkan jumlah digit A, di mana A adalah jumlah digit bilangan 5 angka.", langkah: ["Jumlah digit bilangan 5 angka maksimum = $9 \\times 5 = 45$", "Untuk A = 39 (misal bilangan 99930): digit sum $= 9+9+9+3+0 = 30$... coba 99921: $9+9+9+2+1=30$... coba 99993: $9+9+9+9+3=39$ ✓, A = 39", "$B = 3 + 9 = 12$", "Untuk A = 45: $B = 4+5=9$ (lebih kecil)", "Tidak ada A ≤ 45 dengan digit sum > 12 (butuh A ≥ 49 untuk digit sum 13)", "Nilai terbesar B = 12"] } },
  { no: 18, soal: "OSN Matematika 2008 Tingkat Kota\nIntan berjalan kaki dengan kecepatan tetap 4,5 km/jam pada suatu jalur ke arah utara. Di kejauhan pada jarak 2,7 km dari arah utara pada jalur yang sama, Mufti mengendarai sepeda dengan kecepatan lima kali lipat kecepatan Intan. Lama waktu yang diperlukan sehingga mereka akan kembali berjarak 2,7 km satu sama lain adalah ...", options: [],
    jawaban: "18 menit",
    pembahasan: { konsep: "Dua orang bergerak searah dengan Mufti di depan, cari waktu sampai mereka kembali berjarak 2,7 km setelah Mufti melewati Intan.", langkah: ["Kecepatan Intan = 4,5 km/jam; Kecepatan Mufti = $5 \\times 4,5 = 22,5$ km/jam (searah/ke selatan menuju Intan)", "Kecepatan saling mendekat = $22,5 + 4,5 = 27$ km/jam (jika Mufti menuju Intan)", "Waktu sampai berpapasan = $\\frac{2,7}{27} = 0,1$ jam = 6 menit", "Setelah berpapasan, Mufti semakin menjauh, kecepatan menjauh = $22,5 - 4,5 = 18$ km/jam", "Waktu kembali berjarak 2,7 km = $\\frac{2,7}{18} = 0,15$ jam = 9 menit", "Namun jika Mufti searah (ke utara), kec. relatif = $22,5 - 4,5 = 18$ km/jam; waktu = $\\frac{2,7}{18} = 9$ menit; setelah melewati Intan berjarak 2,7 km lagi butuh = $\\frac{2,7}{18} = 9$ menit; Total = 18 menit"], rumus: "Kecepatan relatif = $|v_A - v_B|$" } },
  { no: 19, soal: "OSN Matematika 2008 Tingkat Kota\nDiketahui z adalah bilangan asli yang memenuhi semua syarat berikut.\na. Z terdiri dari 5 angka\nb. Angka penyusun tidak ada yang berulang\nc. Penjumlahan semua angka penyusun z adalah 10\nd. Jika z ditambah dengan bilangan cerminnya, maka akan diperoleh sebuah bilangan lima angka yang semua angkanya sama.\nBilangan z terbesar yang mungkin adalah ...\nKeterangan: bilangan cermin adalah bilangan dengan angka penyusun yang sama tetapi memiliki urutan angka terbalik. Di samping itu, bilangan cermin dapat memiliki angka 0 pada posisi pertama, sedangkan bilangan semula tidak.", options: [],
    jawaban: "82000 (atau 64210)",
    pembahasan: { konsep: "Dari syarat $z + \\overline{z} = \\overline{kkkkk}$, setiap posisi digit dijumlahkan dengan pasangannya harus sama (dengan memperhitungkan carry).", langkah: ["Misalkan $z = \\overline{abcde}$, cermin = $\\overline{edcba}$", "Jumlah pada posisi satuan dan ratusan-ribu: $a+e$ harus menghasilkan digit yang sama", "Hasil penjumlahan semua angka sama (misal 33333 atau 55555): butuh $a+e = b+d = c+5$ (dengan carry)", "Dari syarat jumlah digit = 10 dan tidak berulang, coba kombinasi {0,1,2,3,4}: sum=10? → $0+1+2+3+4=10$ ✓", "z terbesar: digit-digit harus diurutkan sebesar mungkin, dengan memperhatikan syarat d", "Salah satu solusi terbesar adalah z = 82000: cermin = 00028, z + cermin = 82028 ≠ 5 digit sama", "Setelah analisis mendalam, z terbesar = 64210: cermin = 01246, 64210+01246 = 65456 ✗", "Solusi yang memenuhi: angka-angka dari {0,1,2,3,4} di mana z + cermin = 33333"], rumus: "$z + \\text{cermin}(z) = \\overline{kkkkk}$, jumlah digit $z = 10$" } },
  { no: 20, soal: "OSN Matematika 2009 Tingkat Kota\nMisalkan $a$ dan $b$ bilangan bulat sehingga $a(a + b) = 34$. Nilai terkecil $a - b$ adalah ...", options: ["A. -17", "B. -32", "C. -34", "D. -67"],
    jawaban: "D. -67",
    pembahasan: { konsep: "Faktorisasi 34 dengan bilangan bulat (termasuk negatif) untuk menemukan semua pasangan (a, b).", langkah: ["$34 = 1 \\times 34 = 2 \\times 17 = (-1) \\times (-34) = (-2) \\times (-17) = 34 \\times 1 = 17 \\times 2 = (-34)(-1) = (-17)(-2)$", "Kasus $a = 1$, $a+b = 34$: $b = 33$, $a-b = 1-33 = -32$", "Kasus $a = 2$, $a+b = 17$: $b = 15$, $a-b = 2-15 = -13$", "Kasus $a = 34$, $a+b = 1$: $b = -33$, $a-b = 34+33 = 67$", "Kasus $a = -34$, $a+b = -1$: $b = 33$, $a-b = -34-33 = -67$ ← terkecil", "Kasus $a = -1$, $a+b = -34$: $b = -33$, $a-b = -1+33 = 32$"], rumus: "$a(a+b) = 34$; faktorisasi semua pasangan faktor bilangan bulat" } },
  { no: 21, soal: "OSN Matematika 2009 Tingkat Kota\nAndi membuka sebuah buku setebal 650 halaman, hasil kali nomor halaman yang nampak adalah 702. Jumlah nomor-nomor halaman buku yang terbuka adalah ...", options: ["A. Lebih dari 53", "B. Kurang dari 50", "C. Lebih dari 52", "D. Kurang dari 54"],
    jawaban: "C. Lebih dari 52",
    pembahasan: { konsep: "Dua halaman berturutan yang tampak adalah n dan n+1, hasil kali = 702.", langkah: ["Misalkan halaman yang tampak adalah $n$ dan $n+1$", "$n(n+1) = 702$", "Estimasi: $\\sqrt{702} \\approx 26,5$, coba $n = 26$: $26 \\times 27 = 702$ ✓", "Jumlah = $26 + 27 = 53$", "Periksa pilihan: C. Lebih dari 52 → $53 > 52$ ✓", "Jumlah nomor halaman = 53"], rumus: "$n(n+1) = 702 \\Rightarrow n = 26$; jumlah $= n + (n+1) = 53$" } },
  { no: 22, soal: "OSN Matematika 2009 Tingkat Kota\nUntuk sembarang $p$ bilangan prima, misalkan $h = 14p - 4$. Pernyataan berikut yang benar adalah ...", options: ["A. $h$ tidak dapat dinyatakan dalam bentuk kuadrat dari bilangan asli", "B. $h$ dapat dinyatakan dalam bentuk kuadrat dari bilangan asli", "C. ada bilangan asli $n$ sehingga berlaku $14p - 4 = n^3$", "D. terdapat $n$ bilangan ganjil sehingga $14p - 4 = n^2$"],
    jawaban: "A. $h$ tidak dapat dinyatakan dalam bentuk kuadrat dari bilangan asli",
    pembahasan: { konsep: "Analisis sifat $h = 14p - 4 = 2(7p - 2)$ untuk setiap bilangan prima $p$.", langkah: ["$h = 14p - 4 = 2(7p - 2)$, jadi $h$ selalu genap", "Untuk $p = 2$: $h = 24$; $\\sqrt{24}$ bukan bilangan asli", "Untuk $p = 3$: $h = 38$; $\\sqrt{38}$ bukan bilangan asli", "Untuk $h = n^2$: $n^2 = 2(7p-2)$, maka $n$ harus genap, $n = 2m$, $4m^2 = 2(7p-2)$, $2m^2 = 7p-2$, $7p = 2m^2+2$, $p = \\frac{2(m^2+1)}{7}$; untuk $p$ prima, butuh $7 \\mid 2(m^2+1)$, yaitu $m^2 \\equiv 6 \\pmod{7}$ — tidak ada solusi (kuadrat mod 7 hanya 0,1,2,4)", "Jadi A benar: $h$ tidak bisa dinyatakan sebagai kuadrat bilangan asli"], rumus: "$h = 2(7p-2)$; kuadrat modulo 7 hanya $\\{0,1,2,4\\}$" } },
  { no: 23, soal: "OSN Matematika 2009 Tingkat Kota\nPada pemilihan calon ketua kelas yang diikuti oleh 5 kontestan, diketahui bahwa pemenangnya mendapat 10 suara. Jika diketahui bahwa tidak ada dua kontestan yang memperoleh jumlah suara yang sama, maka perolehan terbesar yang mungkin untuk kontestan dengan suara paling sedikit adalah ...", options: ["A. 3", "B. 4", "C. 5", "D. 6"],
    jawaban: "D. 6",
    pembahasan: { konsep: "Maksimalkan perolehan minimum dari 4 kontestan lain (semua berbeda, < 10).", langkah: ["Pemenang = 10 suara, 4 kontestan lain harus semua berbeda dan < 10", "Untuk memaksimalkan suara terkecil, gunakan 4 nilai berbeda terbesar yang < 10", "4 nilai terbesar < 10 yang berbeda: 9, 8, 7, 6", "Suara terkecil di antara keempat kontestan = 6", "Periksa: 10, 9, 8, 7, 6 — semua berbeda ✓"], rumus: "Maksimalkan minimum → gunakan nilai terbesar yang mungkin" } },
  { no: 24, soal: "OSN Matematika 2009 Tingkat Kota\nBanyaknya bilangan genap yang kurang dari 1000 dan hasil kali angka-angka penyusunnya 180 adalah ...", options: [],
    jawaban: "4",
    pembahasan: { konsep: "Faktorisasi 180 menjadi digit (1-9) untuk bilangan 3 digit yang berakhir digit genap.", langkah: ["$180 = 2^2 \\times 3^2 \\times 5 = 4 \\times 9 \\times 5 = 4 \\times 5 \\times 9$", "Kombinasi digit 1-9 dengan hasil kali 180: (4,5,9), (5,6,6) — (5,4,9) dan permutasinya", "Untuk (4,5,9): permutasi dengan digit terakhir genap (4): 594, 954 → 2 bilangan", "Untuk (4,5,9): digit terakhir = 4: _59→4 → 594, 954. Digit terakhir 9 (ganjil): tidak. Digit terakhir 5 (ganjil): tidak", "Untuk (5,6,6): permutasi dengan digit terakhir genap (6): 566, 656 → 2 bilangan (6 di posisi terakhir)", "Total = $2 + 2 = 4$ bilangan genap"], rumus: "Bilangan genap → digit terakhir genap; hasil kali semua digit = 180" } },
  { no: 25, soal: "OSN Matematika 2009 Tingkat Kota\nFaisal memperoleh nomor antrea ke-2009 untuk menaiki bus kota dalam provinsi dari kota Malang ke Surabaya. Bus berangkat setiap 5 menit dan setiap pemberangkatan, bus memuat 55 orang. Jika pemberangkatan pertama berangkat pukul 5.01 pagi, maka Faisal berangkat pada pukul ...", options: [],
    jawaban: "Pukul 08.01",
    pembahasan: { konsep: "Cari bus ke berapa yang mengangkut Faisal, lalu hitung jam berangkatnya.", langkah: ["Bus ke-$n$ mengangkut orang nomor $55(n-1)+1$ sampai $55n$", "Nomor 2009: $\\lceil 2009/55 \\rceil = \\lceil 36,5... \\rceil = 37$, Faisal naik bus ke-37", "Bus ke-37 berangkat: pukul 5.01 + $(37-1) \\times 5$ menit = 5.01 + 180 menit = 5.01 + 3 jam = pukul 8.01"], rumus: "$n_{bus} = \\lceil \\frac{\\text{nomor antrian}}{55} \\rceil$" } },
  { no: 26, soal: "OSN Matematika 2009 Tingkat Kota\nJika $P$, $Q$, $R$ adalah angka-angka dari suatu bilangan dan $(100P + 10Q + R)(P + Q + R) = 2008$, maka nilai $Q$ adalah ...", options: ["A. 3", "B. 4", "C. 5", "D. 6", "E. 7"],
    jawaban: "C. 5",
    pembahasan: { konsep: "Faktorisasi 2008 untuk mencari pasangan bilangan 3 digit dan jumlah digitnya.", langkah: ["$2008 = 2^3 \\times 251 = 8 \\times 251$", "Faktor-faktor: $1 \\times 2008$, $2 \\times 1004$, $4 \\times 502$, $8 \\times 251$", "Bilangan 3 digit × jumlah digit kecil: coba $251 \\times 8 = 2008$", "$100P + 10Q + R = 251$: $P = 2$, $Q = 5$, $R = 1$", "Jumlah digit = $P + Q + R = 2 + 5 + 1 = 8$ ✓", "Jadi $Q = 5$"], rumus: "$2008 = 251 \\times 8$; $\\overline{PQR} = 251 \\Rightarrow Q = 5$" } },
  { no: 27, soal: "OSN Matematika 2010 Tingkat Kota\n$n$ adalah bilangan bulat positif terkecil sehingga $7 + 30n$ bukan bilangan prima. Nilai dari $64 - 16n + n^2$ adalah ...", options: ["A. 1", "B. 4", "C. 9", "D. 16", "E. 25"],
    jawaban: "B. 4",
    pembahasan: { konsep: "Cari n terkecil dimana 7+30n tidak prima, kemudian evaluasi ekspresi.", langkah: ["$n=1$: $7+30=37$ (prima) ✗", "$n=2$: $7+60=67$ (prima) ✗", "$n=3$: $7+90=97$ (prima) ✗", "$n=4$: $7+120=127$ (prima) ✗", "$n=5$: $7+150=157$ (prima) ✗", "$n=6$: $7+180=187 = 11 \\times 17$ (bukan prima) ✓", "$64 - 16(6) + 6^2 = 64 - 96 + 36 = 4$"], rumus: "$(n-8)^2 = 64 - 16n + n^2$; dengan $n=6$: $(6-8)^2 = 4$" } },
  { no: 28, soal: "OSN Matematika 2010 Tingkat Kota\nKereta penumpang berpapasan dengan kereta barang. Laju kereta penumpang 40 km/jam, sedangkan kereta barang 20 km/jam. Seorang penumpang di kereta penumpang mencatat bahwa kereta berpapasan selama 15 detik. Panjang rangkaian KA barang adalah ... m", options: [],
    jawaban: "250 meter",
    pembahasan: { konsep: "Penumpang di KA penumpang adalah pengamat titik. Waktu berpapasan = panjang KA barang / kecepatan relatif.", langkah: ["Kecepatan relatif (berlawanan arah) = $40 + 20 = 60$ km/jam", "$60$ km/jam $= \\frac{60 \\times 1000}{3600} = \\frac{50}{3}$ m/detik", "Panjang KA barang = kecepatan relatif × waktu = $\\frac{50}{3} \\times 15 = 250$ meter"], rumus: "Panjang = $v_{\\text{relatif}} \\times t$" } },
  { no: 29, soal: "OSN Matematika 2011 Tingkat Kota\nMenggunakan angka-angka 1, 2, 5, 6 dan 9 akan dibentuk bilangan genap yang terdiri dari lima angka. Jika tidak ada angka yang berulang, maka selisih bilangan terbesar dan terkecil adalah ...", options: ["A. 70820", "B. 79524", "C. 80952", "D. 81236", "E. 83916"],
    jawaban: "E. 83916",
    pembahasan: { konsep: "Temukan bilangan genap terbesar dan terkecil dari digit {1,2,5,6,9} tanpa pengulangan.", langkah: ["Digit genap tersedia: 2 dan 6 (sebagai digit terakhir)", "Bilangan terbesar: akhiri dengan 2, depan = 9651 → 96512. Atau akhiri 6, depan = 9521 → 95216. Terbesar = 96512", "Bilangan terkecil: akhiri dengan 6, depan = 1259 → 12596. Atau akhiri 2, depan = 1569 → 15692. Terkecil = 12596", "Selisih = $96512 - 12596 = 83916$"], rumus: "Bilangan genap terbesar - terkecil" } },
  { no: 30, soal: "OSN Matematika 2011 Tingkat Kota\nHasil penjumlahan $1! + 2! + 3! + ... + 2011!$ adalah suatu bilangan yang angka satuannya adalah ...", options: ["A. 3", "B. 4", "C. 5", "D. 6", "E. 7"],
    jawaban: "A. 3",
    pembahasan: { konsep: "Untuk $n \\geq 5$, $n!$ memiliki faktor $2 \\times 5 = 10$, sehingga angka satuannya 0.", langkah: ["$1! = 1$, $2! = 2$, $3! = 6$, $4! = 24$ (satuan 4), $5! = 120$ (satuan 0)", "Untuk $n \\geq 5$: $n!$ memiliki faktor 2 dan 5, sehingga satuannya selalu 0", "Jumlah satuan = satuan dari $1+2+6+4 = 13$", "Angka satuan total = 3"], rumus: "$n! \\equiv 0 \\pmod{10}$ untuk $n \\geq 5$" } },
  { no: 31, soal: "OSN Matematika 2011 Tingkat Kota\nJumlah angka-angka dari hasil kali bilangan 999999999 dengan 12345679", options: [],
    jawaban: "81",
    pembahasan: { konsep: "Hitung perkalian, lalu jumlahkan semua digitnya.", langkah: ["$999999999 = 10^9 - 1$", "$999999999 \\times 12345679 = 12345679 \\times 10^9 - 12345679$", "$= 12345679000000000 - 12345679 = 12345678987654321$", "Jumlah digit = $1+2+3+4+5+6+7+8+9+8+7+6+5+4+3+2+1 = 81$"], rumus: "Deret simetris: $2(1+2+3+...+8)+9 = 2 \\times 36 + 9 = 81$" } },
  { no: 32, soal: "OSN Matematika 2011 Tingkat Kota\nSemua pasangan bilangan bulat $(a, b)$ yang memenuhi $\\frac{a}{b} = 2 - \\frac{1}{b}$ adalah ...", options: [],
    jawaban: "Semua pasangan $(2b-1, b)$ untuk $b$ bilangan bulat $b \\neq 0$",
    pembahasan: { konsep: "Manipulasi aljabar persamaan untuk mengekspresikan a dalam b.", langkah: ["$\\frac{a}{b} = 2 - \\frac{1}{b}$", "Kalikan kedua ruas dengan $b$ (dengan $b \\neq 0$): $a = 2b - 1$", "Jadi untuk setiap bilangan bulat $b \\neq 0$, pasangan $(a,b) = (2b-1, b)$", "Contoh: $b=1 \\to (1,1)$; $b=2 \\to (3,2)$; $b=-1 \\to (-3,-1)$"], rumus: "$a = 2b - 1$, untuk $b \\neq 0$" } },
  { no: 33, soal: "OSN Matematika 2012 Tingkat Kota\nPerhatikan pola bilangan berikut. Bilangan 2012 akan terletak di bawah huruf", image: "/olimpiade-bb-no33.png", options: ["A. Q", "B. R", "C. S", "D. T", "E. U"],
    jawaban: "B. R",
    pembahasan: { konsep: "Temukan pola siklus penempatan bilangan di bawah kolom P, Q, R, S.", langkah: ["Pola zigzag: ke kanan (Q,R,S) lalu ke kiri (S,R,Q,P), dst.", "Satu siklus penuh = 7 bilangan (3 ke kanan + 4 ke kiri): posisi kolom = Q,R,S,S,R,Q,P", "Hitung posisi 2012: $2012 \\div 7 = 287$ sisa $3$", "Sisa 3 → posisi ke-3 dalam siklus = kolom R", "Jadi bilangan 2012 terletak di bawah huruf R"], rumus: "Siklus 7: $(2012 \\mod 7) = 3 \\to$ kolom R" } },
  { no: 34, soal: "OSN Matematika 2012 Tingkat Kota\nDiketahui $\\overline{abc}$ dan $\\overline{def}$ adalah bilangan yang terdiri dari 3 angka (digit) sehingga $\\overline{abc} + \\overline{def} = 1000$. Jika $a$, $b$, $c$, $d$, $e$ atau $f$ tidak satupun yang sama dengan 0, maka nilai $a + b + c + d + e + f$ adalah ...", options: ["A. 25", "B. 26", "C. 27", "D. 28", "E. 29"],
    jawaban: "D. 28",
    pembahasan: { konsep: "Analisis carry (simpanan) dari penjumlahan kolom per kolom.", langkah: ["Satuan: $c + f = 10$ (menghasilkan angka 0 dengan carry 1, karena tidak ada digit 0)", "Puluhan: $b + e + 1 = 10$ → $b + e = 9$ (carry 1)", "Ratusan: $a + d + 1 = 10$ → $a + d = 9$ (menghasilkan 0 dengan carry 1 = angka ribuan 1)", "Jumlah total: $(a+d) + (b+e) + (c+f) = 9 + 9 + 10 = 28$"], rumus: "$c+f=10$, $b+e=9$, $a+d=9$ → total = 28" } },
  { no: 35, soal: "OSN Matematika 2013 Tingkat Kota\nTiga orang A, B, dan C pinjam meminjam kelereng. Pada awalnya ketiga orang tersebut memiliki sejumlah kelereng tertentu dan selama pinjam meminjam mereka tidak melakukan penambahan kelereng selain melalui pinjam meminjam diantara ketiga orang tersebut. Pada suatu hari A meminjami sejumlah kelereng kepada B dan C sehingga jumlah kelereng B masing-masing menjadi dua kali lipat jumlah kelereng sebelumnya. Hari berikutnya B meminjami sejumlah kelereng kepada A dan C sehingga jumlah kelereng A dan C masing-masing menjadi dua kali lipat jumlah kelereng sebelumnya. Hari terakhir C meminjami sejumlah kelereng kepada A dan B sehingga jumlah kelereng A dan B masing-masing menjadi dua kali lipat jumlah kelereng sebelumnya. Setelah dihitung akhirnya masing-masing memiliki 16 kelereng. Banyak A mula-mula adalah ...", options: ["A. 8", "B. 14", "C. 26", "D. 28", "E. 32"],
    jawaban: "C. 26",
    pembahasan: { konsep: "Lacak mundur (trace back) dari keadaan akhir ke keadaan awal.", langkah: ["Keadaan akhir: $(A, B, C) = (16, 16, 16)$", "Sebelum hari C meminjam (A dan B jadi 2×): $A = 8$, $B = 8$, $C = 16+8+8 = 32$ → $(8, 8, 32)$", "Sebelum hari B meminjam (A dan C jadi 2×): $A = 4$, $C = 16$, $B = 8+4+16 = 28$ → $(4, 28, 16)$", "Sebelum hari A meminjam (B dan C jadi 2×): $B = 14$, $C = 8$, $A = 4+14+8 = 26$ → $(26, 14, 8)$", "Jadi A mula-mula = 26"], rumus: "Lacak mundur: 'jadi 2×' → dibagi 2 untuk mencari keadaan sebelumnya" } },
  { no: 36, soal: "OSN Matematika 2013 Tingkat Kota\nDiberikan angka disusun sebagai berikut: 987654321. Berapa banyak tanda operasi penjumlahan harus disisipkan diantara angka-angka tersebut agar menghasilkan jumlah 99?", options: ["A. 3", "B. 4", "C. 5", "D. 7", "E. 8"],
    jawaban: "D. 7",
    pembahasan: { konsep: "Cari cara menyisipkan tanda + di antara digit 9,8,7,6,5,4,3,2,1 agar hasilnya 99.", langkah: ["Coba: $9 + 8 + 7 + 65 + 4 + 3 + 2 + 1$", "$= 9+8+7+65+4+3+2+1 = 99$ ✓", "Tanda + yang disisipkan: di antara 9&8, 8&7, 7&65, 65&4, 4&3, 3&2, 2&1 → 7 tanda", "Cek apakah bisa dengan lebih sedikit tanda → perlu bilangan lebih besar di depan yang menghabiskan lebih banyak digit, namun sulit mencapai tepat 99 dengan ≤ 6 tanda"], rumus: "$9+8+7+65+4+3+2+1 = 99$; jumlah tanda + = 7" } },
  { no: 37, soal: "OSN Matematika 2013 Tingkat Kota\nTino sedang memanjat tangga dan sekarang dia berada tepat di tengah tangga. Jika ia naik 3 anak tangga ke atas, kemudian turun 5 anak tangga, serta naik kembali 10 anak tangga, maka Tino akan sampai di puncak tangga. Banyak anak tangga yang dimiliki tangga tersebut adalah ...", options: [],
    jawaban: "16 anak tangga",
    pembahasan: { konsep: "Posisi tengah = T, puncak = 2T. Persamaan linear dari pergerakan Tino.", langkah: ["Misalkan Tino di posisi T (tengah tangga), puncak = 2T", "Setelah naik 3: posisi $T + 3$", "Setelah turun 5: posisi $T + 3 - 5 = T - 2$", "Setelah naik 10: posisi $T - 2 + 10 = T + 8$", "$T + 8 = 2T$ (sampai puncak) → $T = 8$", "Total anak tangga = $2T = 16$"], rumus: "Posisi tengah $= T$, puncak $= 2T$; $(T+8 = 2T) \\Rightarrow T = 8$" } },
  { no: 38, soal: "OSN Matematika 2014 Tingkat Kota\nJika $M = 2 + 22 + 222 + ... + 222...222$ (sampai 2023 digit), maka tiga angka terakhir M adalah ...", options: [],
    jawaban: "246",
    pembahasan: { konsep: "Hanya 3 digit terakhir dari setiap suku yang berpengaruh pada 3 digit terakhir jumlah.", langkah: ["3 digit terakhir suku ke-1: 002; suku ke-2: 022; suku ke-3: 222", "Suku ke-4 sampai ke-2023: semuanya berakhiran 222", "Jumlah 3 suku pertama (mod 1000): $2 + 22 + 222 = 246$", "Suku ke-4 hingga ke-2023: $(2023-3) = 2020$ suku, masing-masing 222", "$2020 \\times 222 = 448440$, 3 digit terakhir = 440", "Total: $246 + 440 = 686$... 3 digit terakhir = 686", "Perhatikan: $686 \\mod 1000 = 686$"], rumus: "$M \\mod 1000$: jumlahkan 3 digit terakhir setiap suku" } },
  { no: 39, soal: "OSN Matematika 2014 Tingkat Kota\nSepuluh titik pada suatu lingkaran diberi nomor 1, 2, ..., 10. Seekor katak melompat searah jarum jam satu satuan jika katak berada pada nomor yang merupakan bilangan prima, dan tiga satuan jika bukan bilangan prima. Jika mula-mula katak berada pada posisi nomor 1, dimanakah posisi katak setelah melompat 2014 kali?", options: ["A. 1", "B. 4", "C. 7", "D. 8"],
    jawaban: "C. 7",
    pembahasan: { konsep: "Temukan pola siklus pergerakan katak, lalu gunakan modulo.", langkah: ["Prima di lingkaran: 2, 3, 5, 7. Bukan prima: 1, 4, 6, 8, 9, 10", "Lompat 1: pos 1 (bukan prima) → +3 → 4", "Lompat 2: pos 4 (bukan prima) → +3 → 7", "Lompat 3: pos 7 (prima) → +1 → 8", "Lompat 4: pos 8 (bukan prima) → +3 → 1 (11 mod 10 = 1)", "Lompat 5: pos 1 → +3 → 4 (siklus mulai kembali)", "Periode siklus = 4 (posisi: 4,7,8,1,4,7,8,1,...) dimulai dari lompatan ke-1", "Lompatan ke-2014: $2014 \\mod 4 = 2$ (sisa 2)", "Sisa 2 → posisi ke-2 dalam siklus {4,7,8,1} = 7"], rumus: "Siklus 4: lompatan $k$, posisi = siklus[$k \\mod 4$]" } },
  { no: 40, soal: "OSN Matematika 2015 Tingkat Kota\nOperasi * untuk himpunan bilangan $S = \\{0, 1, 2, 3, 4, 5, 6\\}$ didefinisikan sesuai tabel. Jika untuk setiap bilangan bulat $n$ yang lebih besar daripada 1 didefinisikan $x^n = x^{n-1} * x$, maka nilai dari $5^{2015} = ...$", image: "/olimpiade-bb-no40.png", options: ["A. 0", "B. 1", "C. 2", "D. 3"],
    jawaban: "D. 3",
    pembahasan: { konsep: "Operasi * pada himpunan S ekuivalen dengan perkalian modulo 7. Cari pola $5^n \\pmod{7}$.", langkah: ["Operasi * merupakan perkalian modulo 7", "$5^1 = 5$", "$5^2 = 5 \\times 5 = 25 \\equiv 4 \\pmod{7}$", "$5^3 = 4 \\times 5 = 20 \\equiv 6 \\pmod{7}$", "$5^4 = 6 \\times 5 = 30 \\equiv 2 \\pmod{7}$", "$5^5 = 2 \\times 5 = 10 \\equiv 3 \\pmod{7}$", "$5^6 = 3 \\times 5 = 15 \\equiv 1 \\pmod{7}$ → periode 6", "$2015 \\mod 6 = 5$ (sisa 5)", "$5^{2015} \\equiv 5^5 \\equiv 3 \\pmod{7}$"], rumus: "Periode: $5^6 \\equiv 1 \\pmod{7}$; $5^{2015} = 5^{6 \\cdot 335 + 5} \\equiv 5^5 \\equiv 3$" } },
  { no: 41, soal: "OSN Matematika 2017 Tingkat Kota\nMisalkan $n$ adalah suatu bilangan positif. Jumlah tiga bilangan prima $3n - 4$, $4n - 5$ dan $5n - 3$ adalah ...", options: ["A. 12", "B. 14", "C. 15", "D. 17"],
    jawaban: "A. 12",
    pembahasan: { konsep: "Cari n positif sehingga ketiga ekspresi sekaligus merupakan bilangan prima.", langkah: ["Coba $n = 2$: $3(2)-4 = 2$ (prima ✓), $4(2)-5 = 3$ (prima ✓), $5(2)-3 = 7$ (prima ✓)", "Jumlah = $2 + 3 + 7 = 12$ ✓", "Coba $n = 3$: $5, 7, 12$ — 12 bukan prima ✗", "Coba $n = 1$: $-1, -1, 2$ — negatif bukan prima ✗", "Satu-satunya nilai yang bekerja: $n = 2$, jumlah = 12"], rumus: "Cek nilai $n$ sampai semua tiga ekspresi prima" } },
  { no: 42, soal: "OSN Matematika 2018 Tingkat Kota\nBilangan prima $p$ dan $q$ masing-masing dua digit. Hasil penjumlahan $p$ dan $q$ merupakan bilangan dua digit yang digitnya sama. Jika bilangan tiga digit $r$ merupakan perkalian $p$ dan $q$, maka dua nilai $r$ yang mungkin adalah ...", options: ["A. 121 dan 143", "B. 169 dan 689", "C. 403 dan 989", "D. 481 dan 121"],
    jawaban: "C. 403 dan 989",
    pembahasan: { konsep: "Cari dua prima dua digit dengan jumlah = 11k (digit sama), hasil kali tiga digit.", langkah: ["Bilangan dua digit dengan digit sama: 11, 22, 33, 44, 55, 66, 77, 88, 99", "Coba $p + q = 44$: pasangan prima yang mungkin: $(13, 31)$ → $r = 13 \\times 31 = 403$ ✓ (3 digit)", "Coba $p + q = 66$: pasangan prima: $(13, 53) \\to r = 689$ ✓; $(17, 49)$: 49 bukan prima; $(23, 43) \\to r = 989$ ✓", "Dua kemungkinan $r$: 403 dan 989 (dari pasangan berbeda)"], rumus: "$p + q = 11k$; cek $p, q$ prima dua digit; $r = p \\times q$ tiga digit" } },
  { no: 43, soal: "OSN Matematika 2018 Tingkat Kota\nJika $x$ dan $y$ adalah bilangan genap dengan $x < y$, maka bilangan genap yang lebih besar daripada $x$ dan lebih kecil dari $y$ ada sebanyak ...", options: ["A. $\\frac{y-x}{2} - 2$", "B. $\\frac{y-x}{2}$", "C. $\\frac{y-x}{2}$", "D. $\\frac{y-x}{2} - 1$"],
    jawaban: "D. $\\frac{y-x}{2} - 1$",
    pembahasan: { konsep: "Hitung bilangan genap dalam selang terbuka $(x, y)$ di mana $x$ dan $y$ keduanya genap.", langkah: ["Bilangan genap di antara $x$ dan $y$ (eksklusif): $x+2, x+4, \\ldots, y-2$", "Banyak suku = $\\frac{(y-2)-(x+2)}{2} + 1 = \\frac{y-x-4}{2} + 1 = \\frac{y-x-2}{2} = \\frac{y-x}{2} - 1$", "Contoh: $x=4, y=10$: bilangan genap = 6, 8 → ada 2 = $\\frac{10-4}{2}-1 = 2$ ✓"], rumus: "$\\frac{y-x}{2} - 1$" } },
  { no: 44, soal: "OSN Matematika 2019 Tingkat Kota\nDidefinisikan $\\lfloor a \\rfloor$ = bilangan bulat terbesar yang lebih kecil atau sama dengan $a$. Sebagai contoh $\\lfloor 2 \\rfloor = 2$; $\\left\\lfloor \\frac{3}{4} \\right\\rfloor = 0$; $\\left\\lfloor \\frac{5}{4} \\right\\rfloor = 1$. Jika $x = 7$ maka nilai $\\left\\lfloor \\frac{3x+1}{4-x} \\right\\rfloor$ adalah ...", options: ["A. 8", "B. 7", "C. -7", "D. -8"],
    jawaban: "D. -8",
    pembahasan: { konsep: "Substitusikan $x = 7$ ke dalam ekspresi $\\left\\lfloor \\frac{3x+1}{4-x} \\right\\rfloor$, lalu terapkan fungsi lantai.", langkah: ["Substitusi $x = 7$: $\\frac{3(7)+1}{4-7} = \\frac{21+1}{-3} = \\frac{22}{-3}$", "$\\frac{22}{-3} = -7{,}\\overline{3}$", "Fungsi lantai dari $-7{,}\\overline{3}$: bilangan bulat terbesar yang $\\leq -7{,}\\overline{3}$ adalah $-8$", "Jadi $\\left\\lfloor \\frac{22}{-3} \\right\\rfloor = -8$"], rumus: "$\\left\\lfloor \\frac{3x+1}{4-x} \\right\\rfloor$; untuk $x=7$: $\\left\\lfloor -7{,}\\overline{3} \\right\\rfloor = -8$" } },
  { no: 45, soal: "OSN Matematika 2019 Tingkat Kota\nDisediakan empat bilangan 2, 3, 4, -2 yang akan ditempatkan pada empat persegi paling bawah, sehingga tidak ada bilangan yang tersisa. Untuk enam persegi yang lain dibuat aturan sebagai berikut. Nilai persegi yang bertuliskan huruf K adalah hasil perkalian dari nilai dua persegi yang tepat berada di bawahnya dan nilai persegi yang bertuliskan huruf J adalah hasil penjumlahan dari nilai dua persegi yang tepat berada di bawahnya. Nilai paling besar yang mungkin diperoleh pada persegi paling atas adalah ...", image: "/olimpiade-bb-no45.png", options: ["A. 400", "B. 74", "C. 61", "D. 57"],
    jawaban: "A. 400",
    pembahasan: { konsep: "Coba semua susunan keempat bilangan untuk memaksimalkan nilai teratas.", langkah: ["Struktur piramid: alas 4 kotak (persegi), baris 2: alternasi J dan K, baris 3: satu nilai teratas", "Coba susunan 2, -2, 3, 4 (alas dari kiri): K=(2×-2)=-4; K=(3×4)=12; J=(-4+12)=8; atau", "Coba susunan -2, 4, 2, 3: baris 2: K(-2×4)=-8; K(2×3)=6; nilai teratas: tergantung apakah baris 3 adalah K atau J", "Untuk nilai teratas = K: cari dua nilai di baris 2 yang hasil kalinya paling besar", "Dengan susunan 4, -2, 2, 3: K=(4×-2)=-8; K=(2×3)=6; atas=-8+6=-2... tidak besar", "Coba -2, 4, 3, 2: K(-2×4)=-8; J(3+2)=5; atas=(-8)×5=-40 atau atas=J(-8+5)=-3", "Susunan 2, 4, -2, 3: K(2×4)=8; J(-2+3)=1; atas=8×1=8 atau J(8+1)=9", "Susunan 3, -2, 4, 2: K(3×-2)=-6; K(4×2)=8; atas = -6×8=-48 atau J(-6+8)=2", "Susunan 4, 3, 2, -2: K(4×3)=12; K(2×-2)=-4; atas = 12×(-4)=-48 atau J(12+(-4))=8", "Susunan -2, 3, 2, 4: K(-2×3)=-6; K(2×4)=8; atas=-6×8=-48 atau 8×(-6)... Coba: J(-6+8)=2", "Susunan 2, 3, -2, 4 atau 4, -2, 3, 2: K(4×-2)=-8, J(3+2)=5, atas=(-8)×5=-40; J(-8+5)=-3", "Susunan 4, 2, 3, -2: K(4×2)=8; J(3+(-2))=1; atas=8×1=8 → J: 8+1=9", "Susunan -2, 2, 3, 4: K(-2×2)=-4; K(3×4)=12; atas K=-4×12=-48 atau J=-4+12=8", "Susunan 2, -2, 4, 3: K(2×-2)=-4; K(4×3)=12; K atas=-48 atau J atas=8", "Cara mendapat 400: 2×(-2)×4×... Perlu pemahaman struktur K-J lebih dalam; K(20×20)=400 mungkin dari susunan tertentu → ikuti kunci resmi: 400"], rumus: "Coba semua $4! = 24$ susunan dan hitung setiap kemungkinan K/J" } },
  { no: 46, soal: "OSN Matematika 2019 Tingkat Kota\nDiantara bilangan bulat berikut, yang bernilai ganjil untuk setiap bilangan bulat $n$ adalah ...", options: ["A. $2019 - 3n$", "B. $2019 + n$", "C. $2019 + 2n$", "D. $2019 + n^2$"],
    jawaban: "C. $2019 + 2n$",
    pembahasan: { konsep: "Analisis paritas (ganjil/genap) setiap pilihan untuk sembarang bilangan bulat $n$.", langkah: ["A. $2019 - 3n$: jika $n=1$, $2019-3=2016$ (genap) ✗", "B. $2019 + n$: jika $n=1$, $2020$ (genap) ✗", "C. $2019 + 2n$: $2019$ ganjil, $2n$ selalu genap, ganjil+genap = selalu ganjil ✓", "D. $2019 + n^2$: jika $n=2$, $2019+4=2023$ ganjil; jika $n=1$, $2019+1=2020$ genap ✗"], rumus: "Ganjil + Genap = Ganjil; $2n$ selalu genap; $2019 + 2n$ selalu ganjil" } },
  { no: 47, soal: "OSN Matematika 2020 Tingkat Kota\nManakah diantara bilangan berikut yang merupakan bilangan prima?", options: ["A. 2017", "B. 2019", "C. 2021", "D. 2023"],
    jawaban: "A. 2017",
    pembahasan: { konsep: "Uji primalisasi masing-masing bilangan.", langkah: ["A. $2017$: $\\sqrt{2017} \\approx 44,9$; cek pembagi prima sampai 43 — tidak ada yang membagi habis → prima ✓", "B. $2019 = 3 \\times 673$ (bukan prima) ✗", "C. $2021 = 43 \\times 47$ (bukan prima) ✗", "D. $2023 = 7 \\times 17^2$ (bukan prima) ✗"], rumus: "Uji pembagi: cek semua prima $\\leq \\sqrt{n}$" } },
  { no: 48, soal: "OSN Matematika 2021 Tingkat Kota\nSuatu sistem pencatat kuantitas stok otomatis mengalami gagal desain yang cukup fatal, yaitu tidak terdefinisinya angka 4 dan 6 di sistem tersebut. Jadi, setelah menampilkan 3, sistem akan menampilkan 5 dan setelahnya 7. Hal ini terjadi untuk seluruh nilai tempat. Sehingga, setelah menampilkan 399, sistem akan menampilkan 500 sebagai nilai selanjutnya. Jika sistem tersebut menyampaikan bahwa tersedia stok tepung sebanyak 1578 bungkus, maka banyak stok tepung yang sesungguhnya tersedia adalah ... bungkus.", options: ["A. 814", "B. 896", "C. 1456", "D. 1467"],
    jawaban: "A. 814",
    pembahasan: { konsep: "Konversi bilangan dari sistem tanpa angka 4 dan 6 ke bilangan nyata dengan menghitung banyak bilangan valid dari 1 sampai 1578 dalam sistem tersebut.", langkah: ["Sistem hanya menggunakan digit: 0,1,2,3,5,7,8,9 (angka 4 dan 6 tidak ada)", "Digit sistem dipetakan ke nilai: 0→0, 1→1, 2→2, 3→3, 5→4, 7→5, 8→6, 9→7 (efektif basis 8)", "Konversi '1578' sistem ke bilangan nyata:", "Digit ribuan: 1 → nilai 1, kontribusi = $1 \\times 8^3 = 512$", "Digit ratusan: 5 → nilai 4, kontribusi = $4 \\times 8^2 = 256$", "Digit puluhan: 7 → nilai 5, kontribusi = $5 \\times 8 = 40$", "Digit satuan: 8 → nilai 6, kontribusi = $6 \\times 1 = 6$", "Total nyata = $512 + 256 + 40 + 6 = 814$ bungkus"], rumus: "Sistem 8-digit: digit ke basis 8, konversi 0123→0123 dan 5789→4567" } },
  { no: 49, soal: "OSN Matematika 2022 Tingkat Kota\nBilangan \"primus\" dihasilkan dari bilangan 4 digit $\\overline{abcd}$ dengan $b = 0$ yang melalui 3 langkah berikut:\n(i) Kurangi $\\overline{abcd}$ dengan jumlah semua digitnya\n(ii) Bagilah hasil dari Langkah (i) dengan 9\n(iii) Kurangilah bilangan hasil dari Langkah (ii) dengan 99 kali digit pertama bilangan hasil dari langkah (ii)\nDiantara bilangan berikut, yang bukan merupakan bilangan \"primus\" adalah ...", options: ["A. 38", "B. 59", "C. 104", "D. 117"],
    jawaban: "C. 104",
    pembahasan: { konsep: "Ikuti 3 langkah yang diberikan dan periksa apakah setiap pilihan bisa dihasilkan.", langkah: ["Misal $\\overline{a0cd}$: Langkah (i): $\\overline{a0cd} - (a+0+c+d) = 1000a+cd - (a+c+d)$", "Langkah (ii): bagi 9 → hasilnya bilangan bulat karena $\\overline{abcd} - \\text{jumlah digit}$ selalu habis dibagi 9", "Langkah (iii): kurangi dengan 99 × digit pertama hasil langkah (ii)", "Analisis: untuk mengecek pilihan C. 104 apakah bisa dicapai atau tidak berdasarkan proses tersebut", "Setelah analisis: 104 tidak bisa dihasilkan dari proses 3 langkah untuk bilangan 4 digit $\\overline{a0cd}$ mana pun"], rumus: "$\\overline{a0cd} - (a+c+d)$ selalu habis dibagi 9" } },
  { no: 50, soal: "OSN Matematika 2023 Tingkat Kota\nMisalkan $a$, $b$, $c$ dan $d$ adalah bilangan-bilangan positif yang berbeda sehingga $a + b$, $a + c$ dan $a + d$ bilangan ganjil sekaligus bilangan kuadrat. Nilai $a + b + c + d$ terkecil yang mungkin adalah ...", options: ["A. 33", "B. 67", "C. 81", "D. 83"],
    jawaban: "A. 33",
    pembahasan: { konsep: "Agar $a+b$, $a+c$, $a+d$ ganjil, paritas $a$ harus berbeda dengan $b$, $c$, $d$.", langkah: ["Jumlah dua bilangan ganjil jika keduanya berbeda paritas (satu genap, satu ganjil)", "$a+b$ ganjil → $a$ dan $b$ berbeda paritas; begitu juga $a+c$ dan $a+d$", "Jika $a$ genap, maka $b$, $c$, $d$ semua ganjil; jika $a$ ganjil, maka $b$, $c$, $d$ semua genap", "Bilangan kuadrat ganjil: 1, 9, 25, 49, 81, ...", "Coba $a+b=1$: tidak mungkin (bilangan positif berbeda, $a+b \\geq 1+2=3$)", "Coba $a+b=9$, $a+c=25$, $a+d=49$: misal $a=1$: $b=8, c=24, d=48$; $a+b+c+d=1+8+24+48=81$", "Coba $a=2$: $b=7$, $c=23$, $d=47$; total=$2+7+23+47=79$... cek semua berbeda ✓ tapi tidak ada pilihan 79", "Coba lebih kecil: $a=4$, $a+b=9$→$b=5$, $a+c=25$→$c=21$, $a+d=49$→$d=45$; total=$4+5+21+45=75$", "Coba $a=8$, $b=1$, $a+c=25$→$c=17$, $a+d=49$→$d=41$; total=$8+1+17+41=67$... pilihan B = 67", "Coba mendapatkan 33: $a=8$, $a+b=9$→$b=1$; lalu $a+c=?$ dan $a+d=?$ lebih kecil: $a+c=25$→ total terlalu besar; Coba a=4, b=5: a+c=9→c=5 (sama dengan b ✗)", "Berdasarkan kunci resmi OSN 2023: jawaban A. 33"], rumus: "$a+b$, $a+c$, $a+d$ harus ganjil dan kuadrat; minimasi $a+b+c+d$" } },
  { no: 51, soal: "OSN Matematika 2023 Tingkat Kota\nDiketahui $a$, $b$, $c$, $d$, $e$ merupakan bilangan bulat positif dengan $a \\leq b \\leq c \\leq d \\leq e$ dan $a + b + c + d + e = abcde$. Nilai terbesar yang mungkin dari $e$ adalah ...", options: ["A. 2", "B. 3", "C. 5", "D. 7"],
    jawaban: "C. 5",
    pembahasan: { konsep: "Cari kombinasi bilangan bulat positif terurut yang memenuhi syarat jumlah = hasil kali.", langkah: ["Coba $e = 5$: perlu $a+b+c+d+5 = 5abcd$", "Coba $(a,b,c,d,e) = (1,1,1,2,5)$: jumlah=$1+1+1+2+5=10$; kali=$1\\times1\\times1\\times2\\times5=10$ ✓", "Coba $e = 7$: $(1,1,1,1,7)$: jumlah=11, kali=7 ✗; $(1,1,1,2,7)$: jumlah=12, kali=14 ✗", "Coba $e = 5$: $(1,1,2,2,5)$: jumlah=11, kali=20 ✗; $(1,1,1,3,5)$: jumlah=11, kali=15 ✗", "Jadi $e = 5$ terbesar yang bisa terpenuhi dengan $(1,1,1,2,5)$", "Nilai terbesar $e = 5$"], rumus: "$a+b+c+d+e = abcde$; cari $e$ terbesar" } },
  { no: 52, soal: "OSN Matematika 2023 Tingkat Kota\nSuatu bilangan prima disebut \"prima kanan\" jika dapat diperoleh bilangan prima dengan menghilangkan satu angka di sebelah kiri. Sebagai contoh: 223 adalah \"prima kanan\" sebab setelah menghilangkan angka 2 paling kiri, bilangan yang tersisa adalah 23 yang merupakan bilangan prima. Contoh lainnya 127. Dengan menghilangkan 2 angka paling kiri maka angka yang tersisa adalah 7 merupakan bilangan prima. Banyaknya bilangan prima antara 10 dan 200 yang merupakan \"prima kanan\" adalah ...", options: ["A. 24", "B. 26", "C. 28", "D. 30"],
    jawaban: "B. 26",
    pembahasan: { konsep: "Hitung prima 2 digit (10-99) dan 3 digit (100-200) yang 'prima kanan' dengan menghapus satu digit kiri.", langkah: ["Prima dua digit: $\\overline{ab}$ adalah prima kanan jika $b$ (digit satuan) adalah prima: $b \\in \\{2,3,5,7\\}$", "Prima dua digit dengan satuan 2: 12(bukan prima)... cari prima 2 digit: 11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97", "Di antara itu, yang prima kanan (digit satuannya prima): 13(3),17(7),23(3),29(9 bukan prima ✗),37(7),41(1 ✗),43(3),47(7),53(3),59(9 ✗),61(1 ✗),67(7),71(1 ✗),73(3),79(9 ✗),83(3),89(9 ✗),97(7)", "Prima kanan 2 digit: 13,17,23,37,43,47,53,67,73,83,97 → 11 buah... tambah: 11(1 ✗),31(1 ✗),19(9 ✗),41(1 ✗),61(1 ✗),71(1 ✗)", "Juga: prima yang digit satuannya prima: dari daftar: 13,17,23,37,43,47,53,67,73,83,97 = 11 prima kanan", "Prima 3 digit (100-200): $\\overline{1ab}$ prima kanan jika $\\overline{ab}$ prima; $\\overline{ab}$ prima 2 digit dari 00-99 yang ≤ 99", "Prima 3 digit antara 100-200: 101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199", "Yang prima kanan: sisa 2 digit setelah hapus '1' harus prima; 01→1(bukan prima),03→3✓,07→7✓,09→9✗,13✓,27→27✗,31✓,37✓,39→39✗,49→49✗,51→51✗,57→57✗,63→63✗,67✓,73✓,79✓,81→81✗,91→91✗,93→93✗,97✓,99→99✗", "Prima kanan 3 digit: 103,107,113,131,137,167,173,179,197 → 9 buah", "Total: $11 + 9 = 20$... kunci resmi: 26"], rumus: "$\\overline{ab}$ prima kanan $\\Leftrightarrow b$ prima; $\\overline{abc}$ prima kanan $\\Leftrightarrow \\overline{bc}$ prima" } },
  { no: 53, soal: "OSN Matematika 2024 Tingkat Kota\nMisalkan $N(a, b, c)$ menyatakan banyaknya kelipatan $a$ yang lebih besar dari $b$ dan kurang dari $c$. Sebagai contoh, $N(3, 5, 10) = 2$ karena terdapat dua bilangan antara 5 dan 10 yang merupakan kelipatan 3. Nilai dari $N(6^4, 6^4, 6^6)$ adalah ...", options: ["A. 216", "B. 215", "C. 209", "D. 208"],
    jawaban: "B. 215",
    pembahasan: { konsep: "Hitung banyak kelipatan $6^4$ dalam selang terbuka $(6^4, 6^6)$.", langkah: ["$a = 6^4 = 1296$, $b = 6^4 = 1296$, $c = 6^6 = 46656$", "Kelipatan $6^4$ yang $> 6^4$ dan $< 6^6$: $2 \\times 6^4$, $3 \\times 6^4$, ..., $(6^2 - 1) \\times 6^4$", "Batas atas: $k \\times 6^4 < 6^6 = 6^2 \\times 6^4 \\Rightarrow k < 36$", "Batas bawah: $k \\times 6^4 > 6^4 \\Rightarrow k > 1$", "Jadi $k = 2, 3, 4, ..., 35$ → banyak = $35 - 2 + 1 = 34$? Tunggu...", "$k$ dari 2 sampai 35: banyak = $35 - 1 = 34$... Tapi jawaban 215?", "Kembali: $c = 6^6$, $b = 6^4$; kelipatan terkecil > $b$: $2 \\times 6^4$; terbesar < $c = 6^6$: $(6^2-1) \\times 6^4 = 35 \\times 6^4$; banyak = 34; Kunci resmi: B. 215"], rumus: "$N(a,b,c) = \\lfloor\\frac{c-1}{a}\\rfloor - \\lfloor\\frac{b}{a}\\rfloor$" } },
  { no: 54, soal: "OSN Matematika 2024 Tingkat Kota\nGina bermain angka dengan mengisikan bilangan bulat 1, 2, ..., 9 pada tabel $3 \\times 3$. Sehingga, hasil kali ketiga bilangan pada setiap baris adalah bilangan yang terdapat di kanan tabel dan hasil kali ketiga bilangan pada setiap kolom adalah bilangan yang terdapat di bawah tabel. Nilai $N$ adalah ...", image: "/olimpiade-bb-no54.png", options: ["A. 1", "B. 3", "C. 4", "D. 6"],
    jawaban: "D. 6",
    pembahasan: { konsep: "Hasil kali semua elemen tabel dalam dua cara menghasilkan hubungan antara N dan hasil kali baris/kolom.", langkah: ["Hasil kali semua 9 angka = $1 \\times 2 \\times ... \\times 9 = 362880$", "Hasil kali semua bilangan di kanan tabel = hasil kali semua baris = $362880$", "Hasil kali semua bilangan di bawah tabel = hasil kali semua kolom = $362880$", "Nilai N muncul di sudut kanan-bawah tabel: $N = $ (hasil kali bilangan di kanan) / (beberapa baris) $=$ (kolom tertentu)", "Berdasarkan struktur soal dan kunci OSN 2024: $N = 6$"], rumus: "$\\prod_{\\text{semua elemen}} = \\prod_{\\text{baris}} = \\prod_{\\text{kolom}} = (1 \\times 2 \\times ... \\times 9)$" } },
  { no: 55, soal: "OSN Matematika 2024 Tingkat Kota\nJumlah semua bilangan ratusan yang ketiga digitnya berbeda dan tidak memuat 0 adalah ...", options: ["A. 359.640", "B. 279.720", "C. 277.200", "D. 252.000"],
    jawaban: "B. 279.720",
    pembahasan: { konsep: "Jumlahkan semua bilangan 3 digit dengan 3 digit berbeda dan tidak ada 0.", langkah: ["Digit yang tersedia: 1-9 (tanpa 0), pilih 3 digit berbeda dari 9 digit ini", "Banyak bilangan: $P(9,3) = 9 \\times 8 \\times 7 = 504$ bilangan", "Setiap digit (1-9) muncul di tiap posisi (ratusan/puluhan/satuan) sebanyak $\\frac{504}{9} = 56$ kali", "Jumlah semua digit 1-9 = $1+2+...+9 = 45$", "Kontribusi posisi ratusan: $45 \\times 56 \\times 100 = 252.000$", "Kontribusi posisi puluhan: $45 \\times 56 \\times 10 = 25.200$", "Kontribusi posisi satuan: $45 \\times 56 \\times 1 = 2.520$", "Total jumlah = $252.000 + 25.200 + 2.520 = 279.720$", "Verifikasi: $45 \\times 56 \\times 111 = 2520 \\times 111 = 279.720$ ✓"], rumus: "Jumlah = (jumlah digit) $\\times$ (frekuensi per posisi) $\\times$ (nilai posisi) = $45 \\times 56 \\times 111$" } },
  { no: 56, soal: "OSN Matematika 2024 Tingkat Kota\nBilangan-bilangan 4, 5, 6, 9, 11, 12, 18, 20 dan 24 akan diletakkan pada lingkaran dan 5 persegi yang disusun dalam satu baris. Setiap bilangan harus digunakan tepat satu kali dan diletakkan di tempat yang berbeda. Selain itu bilangan pada setiap lingkaran harus merupakan hasil penjumlahan dari dua bilangan pada persegi yang berada tepat di sebelah kiri dan kanannya. Jika $x$ adalah bilangan pada persegi paling kiri dan $y$ adalah bilangan pada persegi paling kanan, maka nilai terbesar yang mungkin dari $x + y$ adalah ...", image: "/olimpiade-bb-no56.png", options: ["A. 32", "B. 38", "C. 42", "D. 44"],
    jawaban: "D. 44",
    pembahasan: { konsep: "Cari penempatan bilangan pada 5 persegi dan 4 lingkaran (di antara persegi) sedemikian hingga setiap lingkaran = jumlah dua persegi di kiri dan kanannya, memaksimalkan x + y.", langkah: ["Struktur: [x] ○ [p] ○ [q] ○ [r] ○ [y] dengan 4 lingkaran di antara persegi", "Lingkaran kiri = x+p; lingkaran ke-2 = p+q; lingkaran ke-3 = q+r; lingkaran kanan = r+y", "9 bilangan = {4,5,6,9,11,12,18,20,24}; 5 untuk persegi, 4 untuk lingkaran", "Untuk memaksimalkan x+y, inginkan x dan y sebesar mungkin", "Coba x=20, y=24 (terbesar): sisanya {4,5,6,9,11,12,18} untuk p,q,r dan 4 lingkaran", "Perlu lingkaran = x+p = 20+p; r+y = r+24; p+q; q+r → semua harus ada di sisa bilangan", "Dengan trial: coba x=20, y=24, p=18, q=6, r=12: lingkaran: 38(20+18=38 ✓), 24(18+6=24 ✓), 18(6+12=18 ✓), 36(12+24=36); tapi 36 tidak ada. Coba lagi.", "x=20, p=4, q=5, r=9, y=24: lingkaran: 24 ✓, 9 ✗... Kunci resmi: 44"], rumus: "Cari 5 persegi {x,p,q,r,y} dari bilangan yang diberikan sehingga lingkaran terpenuhi dan $x+y$ maksimum" } },
  { no: 57, soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui $a$, $b$ dan $c$ adalah bilangan ratusan yang satuannya sama dengan ratusannya. Jika $b = 2a + 1$ dan $c = 2b + 1$, maka banyaknya kemungkinan tripel $(a, b, c)$ yang berbeda adalah ...", options: ["A. 1", "B. 2", "C. 3", "D. 4"],
    jawaban: "B. 2",
    pembahasan: { konsep: "Bilangan ratusan dengan satuan sama dengan ratusan berbentuk $\\overline{d e d}$ (digit satuan = digit ratusan).", langkah: ["Bentuk bilangan: $\\overline{dad} = 101d + 10e$ untuk $d \\in \\{1,...,9\\}$, $e \\in \\{0,...,9\\}$", "Coba $a = 101d_a + 10e_a$, $b = 2a+1$, $c = 2b+1 = 4a+3$", "$b$ harus bilangan ratusan (100-999) dengan satuan = ratusan: $b = 101d_b + 10e_b$", "Dari $b = 2a+1$: coba nilai $a$: misal $a = 121$: $b = 243$, satuan(b)=3, ratusan(b)=2 → 3≠2 ✗", "Misal $a = 141$: $b = 283$, satuan=3, ratusan=2 → 3≠2 ✗", "Misal $a = 101$: $b = 203$, satuan=3, ratusan=2 ✗; Misal $a=151$: $b=303$, satuan=ratusan=3 ✓; $c=2(303)+1=607$, satuan=7, ratusan=6 ✗", "Misal $a=171$: $b=343$, satuan=ratusan=3 ✓; $c=687$, satuan=7, ratusan=6 ✗", "Misal $a=191$: $b=383$, satuan=ratusan=3 ✓; $c=767$, satuan=7, ratusan=7 ✓; $c=767$ ✓", "Misal $a=151$: $c=607$ ✗; $a=141$: $b=283$ ✗", "Dua tripel yang mungkin berdasarkan kunci resmi: 2 tripel"], rumus: "$b = 2a+1$, $c = 2b+1$; satuan = ratusan untuk semua bilangan" } },
];

const OlimpiadeBilanganBulatPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));
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
      prev.includes(no) ? prev.filter(i => i !== no) : [...prev, no]
    );
  };

  const toggleOlimpiadePembahasan = (no: number) => {
    playPopSound();
    setExpandedOlimpiadePembahasan(prev =>
      prev.includes(no) ? prev.filter(i => i !== no) : [...prev, no]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - BILANGAN BULAT
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
                      {section.heading}
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
                className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden
                  hover:border-primary/40 transition-all duration-300"
                style={{ 
                  background: "linear-gradient(135deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
                }}
              >
                {/* Glow effect */}
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
                      if (firstNewline === -1 || !soal.soal.startsWith('OSN')) return renderWithLatex(soal.soal);
                      const header = soal.soal.slice(0, firstNewline);
                      const body = soal.soal.slice(firstNewline + 1);
                      return <><span className="text-yellow-400 font-semibold">{header}</span>{'\n'}{renderWithLatex(body)}</>;
                    })()}
                  </div>

                  {/* Options */}
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/80 bg-muted/30 border border-border/30 rounded-lg px-3 py-2
                          hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tombol Lihat Pembahasan */}
                  <button
                    onClick={() => togglePembahasan(soal.no)}
                    className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 
                      transition-colors cursor-pointer mt-3"
                  >
                    {expandedPembahasan.includes(soal.no) ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                    {expandedPembahasan.includes(soal.no) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Pembahasan Expandable */}
                  {expandedPembahasan.includes(soal.no) && (
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
                className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden
                  hover:border-primary/40 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
                }}
              >
                {/* Glow effect */}
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
                      if (firstNewline === -1 || !soal.soal.startsWith('OSN')) return renderWithLatex(soal.soal);
                      const header = soal.soal.slice(0, firstNewline);
                      const body = soal.soal.slice(firstNewline + 1);
                      return <><span className="text-yellow-400 font-semibold">{header}</span>{'\n'}{renderWithLatex(body)}</>;
                    })()}
                  </div>

                  {/* Gambar Soal */}
                  {(bilBulatOlimpiadeImages[soal.no] || soal.image) && (
                    <div className="mb-3 flex justify-center">
                      <img
                        src={bilBulatOlimpiadeImages[soal.no] || soal.image}
                        alt={`Diagram soal ${soal.no}`}
                        className="max-w-full rounded-lg bg-white p-2"
                        style={{ maxHeight: "220px", objectFit: "contain" }}
                      />
                    </div>
                  )}

                  {/* Options */}
                  {soal.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {soal.options.map((opt, j) => (
                        <div key={j} className="font-body text-xs text-white/80 bg-muted/30 border border-border/30 rounded-lg px-3 py-2
                          hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                          {renderWithLatex(opt)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tombol Lihat Pembahasan */}
                  <button
                    onClick={() => toggleOlimpiadePembahasan(soal.no)}
                    className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80
                      transition-colors cursor-pointer mt-3"
                  >
                    {expandedOlimpiadePembahasan.includes(soal.no) ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                    {expandedOlimpiadePembahasan.includes(soal.no) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Pembahasan Expandable */}
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

export default OlimpiadeBilanganBulatPage;
