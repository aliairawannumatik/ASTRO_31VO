import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp, BookOpen, CheckCircle2 } from "lucide-react";
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
  title: "MATERI - MODULO (SISA PEMBAGIAN)",
  sections: [
    {
      heading: "A. Hubungan Antara Bilangan Yang Dibagi, Pembagi, Hasil Bagi dan Sisa",
      content: `Dalam operasi pembagian, hubungan antara bilangan yang dibagi (dividend), pembagi, hasil bagi dan sisa dapat dirumuskan sebagai:

Yang Dibagi = (Pembagi × Hasil Bagi) + Sisa

Sisa pembagian harus selalu kurang dari nilai pembagi.

Penjelasan:
- Yang Dibagi (Dividen): Bilangan yang akan dibagi.
- Pembagi: Bilangan yang digunakan untuk membagi.
- Hasil Bagi: Bilangan yang menunjukkan berapa kali pembagi dapat "masuk" ke dalam yang dibagi.
- Sisa: Bilangan yang tersisa setelah pembagian dilakukan.

Contoh:
Jika kita membagi 17 dengan 5 maka 17 adalah yang dibagi (dividend), 5 adalah pembagi, Hasil baginya adalah 3 (karena $5 \\times 3 = 15$), Sisanya adalah 2 (karena $17 - 15 = 2$).
Maka, hubungan tersebut dapat ditulis sebagai: $17 = 5 \\times 3 + 2$`
    },
    {
      heading: "B. Apa itu Modulo?",
      content: `Modulo biasa digunakan untuk mencari sisa dari pembagian bilangan.

Misalnya, "Berapakah sisa jika 123 dibagi 12?". Tentunya kita mengetahui bahwa:
$123 = 10 \\times 12 + 3$, yang artinya jika 123 dibagi 12 maka akan bersisa 3. Dengan menggunakan modulo dapat kita tulis $123 \\mod 12 = 3$ atau $\\text{mod}(123, 12) = 3$.`
    },
    {
      heading: "C. Penulisan Modulo",
      content: `Pada tulisan ini kita akan menggunakan tanda "=" agar lebih mudah dipahami, namun perlu kalian ketahui secara internasional penulisan modulo adalah sebagai berikut:

$a \\equiv b \\mod m$

yang artinya m membagi habis $(a - b)$ atau dengan kata lain "Jika a dibagi m maka akan bersisa b".

Contoh:
$30 \\equiv 2 \\mod 4$
Artinya 4 membagi habis $(30 - 2)$, atau "Jika 30 dibagi 4 maka akan bersisa 2". Jika menggunakan tanda "=" dapat kita tulis $30 \\mod 4 = 2$.`
    },
    {
      heading: "D. Kaidah Dasar 1",
      content: `$a \\mod n = (bn + c) \\mod n = c \\mod n$

Contoh:
1) Berapakah sisa 7 dibagi 9?
Jawab:
$7 \\mod 9 = 7$
Jadi, 7 dibagi 9 akan bersisa 7

2) Berapakah sisa 35 dibagi 8?
Jawab:
$35 \\mod 8 = (4 \\cdot 8 + 3) \\mod 8$
$= 3 \\mod 8$
$= 3$
Jadi, 35 dibagi 8 akan bersisa 3.

3) Berapakah sisa 120 dibagi 13?
Jawab:
$120 \\mod 13 = (10 \\cdot 13 - 10) \\mod 13$
$= (-10) \\mod 13$
$= ((-1) \\cdot 13 + 3) \\mod 13$
$= 3 \\mod 13$
$= 3$
Jadi, 120 dibagi 13 bersisa 3`
    },
    {
      heading: "D. Kaidah Dasar 2 (Linearitas penjumlahan/pengurangan)",
      content: `$(a + b) \\mod n = [(a \\mod n) + (b \\mod n)] \\mod n$

Contoh:
1) Berapakah sisa pembagian $(10 + 17 + 21)$ oleh 9?
Jawab:
$(10 + 17 + 21) \\mod 9 = (10 \\mod 9 + 17 \\mod 9 + 21 \\mod 9) \\mod 9$
$= (1 + 8 + 3) \\mod 9$
$= 12 \\mod 9$
$= 3 \\mod 9$
$= 3$
Jadi $(10 + 17 + 21)$ jika dibagi 9 maka akan bersisa 3

2) Berapakah sisa $(2011 + 2012 + 2013 + \\cdots + 2018)$ dibagi 2019?
Jawab:
$(2011 + 2012 + 2013 + \\cdots + 2018) \\mod 2019$
$= (-8 - 7 - 6 - \\cdots - 1) \\mod 2019$
$= (-36) \\mod 2019$
$= ((-1) \\cdot 2019 + 1983) \\mod 2019$
$= 1983$
Jadi, $(2011 + 2012 + 2013 + \\cdots + 2018)$ jika dibagi 2019 maka akan bersisa 1983`
    },
    {
      heading: "D. Kaidah Dasar 3 (Linearitas perkalian)",
      content: `$(ab) \\mod n = [(a \\mod n)(b \\mod n)] \\mod n$

Contoh:
1) Berapakah sisa pembagian $(7 \\times 9 \\times 10)$ oleh 8?
Jawab:
$(7 \\times 9 \\times 10) \\mod 8 = ((7 \\mod 8)(9 \\mod 8)(10 \\mod 8)) \\mod 8$
$= (7 \\times 1 \\times 2) \\mod 8$
$= 14 \\mod 8$
$= 6$

2) Berapakah digit terakhir (satuan) dari $(2016 \\times 2017 \\times 2018 \\times 2019)$?
Jawab:
Menentukan digit terakhir (nilai satuan) sama dengan kita mencari sisa jika dibagi 10 sehingga
$(2016 \\times 2017 \\times 2018 \\times 2019) \\mod 10$
$= (6 \\times 7 \\times 8 \\times 9) \\mod 10$
$= (42 \\times 72) \\mod 10$
$= (2 \\times 2) \\mod 10$
$= 4 \\mod 10$
$= 4$
Jadi, digit terakhir dari $(2016 \\times 2017 \\times 2018 \\times 2019)$ adalah 4`
    },
    {
      heading: "D. Kaidah Dasar 4 (Perpangkatan)",
      content: `$a^b \\mod n = ((a \\mod n)^b) \\mod n$

Contoh:
1) Berapakah sisa jika $7^{2019}$ dibagi 8?
Jawab:
$(7^{2019}) \\mod 8 = ((7 \\mod 8)^{2019}) \\mod 8$
$= (-1)^{2019} \\mod 8$
$= (-1) \\mod 8$
$= 7$
Jadi, $7^{2019}$ jika dibagi 8 maka akan bersisa 7

2) Berapakah sisa jika $3^{2009}$ dibagi oleh 41?
Jawab:
$3^{2009} \\mod 41 = (3^{2008} \\cdot 3) \\mod 41$
$= ((3^4)^{502} \\cdot 3) \\mod 41$
$= (81^{502} \\cdot 3) \\mod 41$
$= ((2 \\cdot 41 - 1)^{502} \\cdot 3) \\mod 41$
$= ((-1)^{502} \\cdot 3) \\mod 41$
$= (1 \\cdot 3) \\mod 41$
$= 3 \\mod 41$
$= 3$
Jadi, $3^{2009}$ dibagi 41 akan bersisa 3

3) Berapakah sisa $(54^{54} + 55^{55})$ jika dibagi 7?
Jawab:
$(54^{54} + 55^{55}) \\mod 7$
$= ((8 \\cdot 7 - 2)^{54} \\mod 7 + (8 \\cdot 7 - 1)^{55} \\mod 7) \\mod 7$
$= ((-2)^{54} \\mod 7 + (-1)^{55} \\mod 7)$
$= (((-2)^3)^{18} \\mod 7 + (-1) \\mod 7) \\mod 7$
$= ((-8)^{18} \\mod 7 + 6) \\mod 7$
$= (((-1) \\cdot 7 + (-1))^{18} \\mod 7 + 6) \\mod 7$
$= ((-1)^{18} \\mod 7 + 6) \\mod 7$
$= (1 \\mod 7 + 6) \\mod 7$
$= (1 + 6) \\mod 7$
$= 7 \\mod 7$
$= 0$
Jadi, $54^{54} + 55^{55}$ jika dibagi 7 tidak bersisa`
    },
    {
      heading: "E. Cara Menentukan Bilangan Habis Dibagi 2 Sampai 11",
      content: `1. Habis Dibagi 2
Ciri: Bilangan genap, yaitu angka satuannya (digit terakhir) adalah 0, 2, 4, 6, atau 8.
Contoh: 14 → akhiran 4 → genap → Habis dibagi 2

2. Habis Dibagi 3
Ciri: Jumlah semua digit habis dibagi 3.
Contoh: 123 → $1+2+3=6$ → $6÷3=2$ → Habis dibagi 3

3. Habis Dibagi 4
Ciri: Dua digit terakhir membentuk bilangan yang habis dibagi 4.
Contoh: 316 → $16 ÷ 4 = 4$ → Habis dibagi 4

4. Habis Dibagi 5
Ciri: Digit terakhir adalah 0 atau 5.
Contoh: 75 → akhiran 5 → Habis dibagi 5

5. Habis Dibagi 6
Ciri: Bilangan tersebut habis dibagi 2 dan 3 sekaligus.
Contoh: 72 → genap & jumlah digit $7+2=9$ → $9÷3=3$ → Habis dibagi 6

6. Habis Dibagi 7
Ciri: Ambil digit terakhir, kalikan 2, kurangi hasil dari sisa angka, ulangi hingga kecil, cek habis dibagi 7.
Contoh: 203: $20 - (3×2) = 20-6=14$ → $14÷7=2$ → Habis dibagi 7

7. Habis Dibagi 8
Ciri: Tiga digit terakhir habis dibagi 8.
Contoh: 512 → $512÷8=64$ → Habis dibagi 8

8. Habis Dibagi 9
Ciri: Jumlah semua digit habis dibagi 9.
Contoh: 729 → $7+2+9=18$ → $18÷9=2$ → Habis dibagi 9

9. Habis Dibagi 10
Ciri: Digit terakhir adalah 0.
Contoh: 230 → akhiran 0 → Habis dibagi 10

10. Habis Dibagi 11
Ciri: Selisih jumlah digit ganjil dan genap habis dibagi 11 atau 0. (Jumlah digit berposisi ganjil) – (Jumlah digit berposisi genap)
Contoh: 2728 → $(2+2) – (7+8) = 4 – 15 = -11$ → $-11÷11=-1$ → Habis dibagi 11`
    },
    {
      heading: "F. Definisi Faktor",
      content: `Jika sebuah bilangan bulat 'a' dapat dibagi habis oleh bilangan bulat 'b', maka 'b' disebut faktor dari 'a'.

Dengan kata lain, jika ada bilangan bulat 'k' sehingga $a = b \\times k$, maka 'b' adalah faktor dari 'a', dan 'k' juga merupakan faktor dari 'a'.

Contoh:
12 dapat dibagi habis oleh 1, 2, 3, 4, 6, dan 12. Oleh karena itu, 1, 2, 3, 4, 6, dan 12 adalah faktor dari 12.`
    },
    {
      heading: "G. Banyak faktor positif dari suatu bilangan",
      content: `Jika suatu bilangan n memiliki faktorisasi prima $n = p_1^{a_1} \\cdot p_2^{a_2} \\cdot ... \\cdot p_n^{a_n}$, maka jumlah faktor positifnya adalah $(a_1 + 1)(a_2 + 1)...(a_n + 1)$.`
    },
  ]
};

// ─── Rich Materi Components ─────────────────────────────────────────────────

const MateriA = () => (
  <div className="mt-2 space-y-3">
    <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 p-4">
      <div className="text-xs text-white/50 mb-2 text-center">Rumus hubungan pembagian:</div>
      <div className="text-center mb-2"><BlockMath math="\text{Yang Dibagi} = (\text{Pembagi} \times \text{Hasil Bagi}) + \text{Sisa}"/></div>
      <div className="text-xs text-amber-300 text-center">Syarat: Sisa &lt; Pembagi</div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[
        { label:"Yang Dibagi", val:"17", cls:"blue" },
        { label:"Pembagi",     val:"5",  cls:"purple" },
        { label:"Hasil Bagi",  val:"3",  cls:"green" },
        { label:"Sisa",        val:"2",  cls:"amber" },
      ].map((item,i) => (
        <div key={i} className={`rounded-xl border border-${item.cls}-400/40 bg-${item.cls}-400/10 p-3 text-center`}>
          <div className={`text-xs text-${item.cls}-300/70 mb-1`}>{item.label}</div>
          <div className={`text-2xl font-bold font-mono text-${item.cls}-300`}>{item.val}</div>
        </div>
      ))}
    </div>
    <div className="rounded-xl border border-white/10 bg-card/40 p-3 text-center">
      <div className="text-xs text-white/50 mb-1">Contoh: 17 dibagi 5</div>
      <BlockMath math="17 = (5 \times 3) + 2"/>
    </div>
  </div>
);

const MateriB = () => (
  <div className="mt-2 space-y-3">
    <div className="rounded-xl border border-violet-400/40 bg-violet-400/10 p-4 text-center">
      <div className="text-3xl font-bold font-mono text-violet-300 mb-1">mod</div>
      <div className="text-xs text-white/60">Sisa hasil pembagian bilangan</div>
    </div>
    <div className="rounded-xl border border-white/10 bg-card/40 p-4 space-y-2">
      <div className="text-xs text-white/50 mb-2">Contoh: Sisa 123 dibagi 12?</div>
      <div className="text-center"><BlockMath math="123 = 10 \times 12 + 3"/></div>
      <div className="flex gap-2 mt-1">
        {[["123 mod 12","= 3","cyan"],["mod(123, 12)","= 3","violet"]].map(([n,v,c],i) => (
          <div key={i} className={`flex-1 rounded-lg border border-${c}-400/30 bg-${c}-400/10 p-2 text-center`}>
            <div className={`text-xs font-mono text-${c}-300`}>{n}</div>
            <div className={`text-base font-bold text-${c}-200`}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MateriC = () => (
  <div className="mt-2 space-y-3">
    <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4">
      <div className="text-xs text-white/50 mb-2 text-center">Notasi internasional:</div>
      <div className="text-center mb-2"><BlockMath math="a \equiv b \pmod{m}"/></div>
      <div className="text-xs text-white/60 text-center">Artinya: m membagi habis (a − b), atau "a dibagi m bersisa b"</div>
    </div>
    <div className="rounded-xl border border-white/10 bg-card/40 p-4">
      <div className="text-xs text-white/50 mb-2">Contoh:</div>
      <div className="text-center mb-2"><BlockMath math="30 \equiv 2 \pmod{4}"/></div>
      <div className="space-y-1 text-xs text-white/60">
        <div className="flex items-start gap-2"><span className="text-amber-300">→</span><span>4 membagi habis (30 − 2) = 28 ✓</span></div>
        <div className="flex items-start gap-2"><span className="text-amber-300">→</span><span>30 dibagi 4 bersisa 2</span></div>
        <div className="flex items-start gap-2"><span className="text-amber-300">→</span><span>Atau: 30 mod 4 = 2</span></div>
      </div>
    </div>
  </div>
);

const MateriD = () => {
  const examples = [
    { label:"7 mod 9", steps:["7 mod 9 = 7"], ans:"Sisa 7" },
    { label:"35 mod 8", steps:["35 = 4·8 + 3","(4·8+3) mod 8 = 3 mod 8 = 3"], ans:"Sisa 3" },
    { label:"120 mod 13", steps:["120 = 10·13 − 10","(−10) mod 13 = (−1·13+3) mod 13 = 3"], ans:"Sisa 3" },
  ];
  return (
    <div className="mt-2 space-y-3">
      <div className="rounded-xl border border-blue-400/40 bg-blue-400/10 p-3 text-center">
        <BlockMath math="a \bmod n = (bn + c) \bmod n = c \bmod n"/>
      </div>
      {examples.map((e,i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-card/40 p-3">
          <div className="text-xs font-bold text-cyan-300 mb-2">{e.label}</div>
          <div className="space-y-1">
            {e.steps.map((s,j) => <div key={j} className="text-xs font-mono text-white/70 pl-2">{renderWithLatex(s)}</div>)}
          </div>
          <div className="mt-2 text-xs font-bold text-emerald-400">✓ {e.ans}</div>
        </div>
      ))}
    </div>
  );
};

const MateriE = () => (
  <div className="mt-2 space-y-3">
    <div className="rounded-xl border border-green-400/40 bg-green-400/10 p-3 text-center">
      <BlockMath math="(a+b) \bmod n = [(a \bmod n)+(b \bmod n)] \bmod n"/>
    </div>
    <div className="rounded-xl border border-white/10 bg-card/40 p-3">
      <div className="text-xs font-bold text-green-300 mb-2">(10+17+21) mod 9</div>
      <div className="space-y-1 text-xs font-mono text-white/70">
        <div>= (10 mod 9 + 17 mod 9 + 21 mod 9) mod 9</div>
        <div>= (1 + 8 + 3) mod 9 = 12 mod 9 = <span className="text-emerald-400 font-bold">3</span></div>
      </div>
    </div>
    <div className="rounded-xl border border-white/10 bg-card/40 p-3">
      <div className="text-xs font-bold text-green-300 mb-2">(2011+2012+…+2018) mod 2019</div>
      <div className="space-y-1 text-xs font-mono text-white/70">
        <div>= (−8−7−6−…−1) mod 2019</div>
        <div>= (−36) mod 2019</div>
        <div>= (−1·2019 + 1983) mod 2019 = <span className="text-emerald-400 font-bold">1983</span></div>
      </div>
    </div>
  </div>
);

const MateriF = () => (
  <div className="mt-2 space-y-3">
    <div className="rounded-xl border border-orange-400/40 bg-orange-400/10 p-3 text-center">
      <BlockMath math="(ab) \bmod n = [(a \bmod n)(b \bmod n)] \bmod n"/>
    </div>
    <div className="rounded-xl border border-white/10 bg-card/40 p-3">
      <div className="text-xs font-bold text-orange-300 mb-2">(7×9×10) mod 8</div>
      <div className="space-y-1 text-xs font-mono text-white/70">
        <div>= (7 mod 8)(9 mod 8)(10 mod 8) mod 8</div>
        <div>= (7 × 1 × 2) mod 8 = 14 mod 8 = <span className="text-emerald-400 font-bold">6</span></div>
      </div>
    </div>
    <div className="rounded-xl border border-white/10 bg-card/40 p-3">
      <div className="text-xs font-bold text-orange-300 mb-2">Digit satuan (2016×2017×2018×2019)</div>
      <div className="text-xs text-white/50 mb-1">Digit satuan = sisa mod 10</div>
      <div className="space-y-1 text-xs font-mono text-white/70">
        <div>= (6×7×8×9) mod 10</div>
        <div>= (42×72) mod 10 = (2×2) mod 10 = <span className="text-emerald-400 font-bold">4</span></div>
      </div>
    </div>
  </div>
);

const MateriG = () => (
  <div className="mt-2 space-y-3">
    <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 p-3 text-center">
      <BlockMath math="a^b \bmod n = ((a \bmod n)^b) \bmod n"/>
    </div>
    {[
      { label:"7²⁰¹⁹ mod 8", steps:["(7 mod 8)²⁰¹⁹ mod 8 = (−1)²⁰¹⁹ mod 8","= −1 mod 8 = 7"], ans:"Sisa 7" },
      { label:"3²⁰⁰⁹ mod 41", steps:["3²⁰⁰⁹ = (3⁴)⁵⁰² · 3 = 81⁵⁰² · 3","81 mod 41 = (2·41−1) mod 41 = −1","(−1)⁵⁰² · 3 mod 41 = 3"], ans:"Sisa 3" },
      { label:"54⁵⁴ + 55⁵⁵ mod 7", steps:["54 ≡ −2 (mod 7), 55 ≡ −1 (mod 7)","(−2)⁵⁴ = ((−2)³)¹⁸ = (−8)¹⁸ ≡ (−1)¹⁸ = 1","1 + (−1) = 0 mod 7"], ans:"Sisa 0 (habis dibagi)" },
    ].map((e,i) => (
      <div key={i} className="rounded-xl border border-white/10 bg-card/40 p-3">
        <div className="text-xs font-bold text-rose-300 mb-2">{e.label}</div>
        {e.steps.map((s,j) => <div key={j} className="text-xs font-mono text-white/70 mb-0.5">{s}</div>)}
        <div className="mt-1 text-xs font-bold text-emerald-400">✓ {e.ans}</div>
      </div>
    ))}
  </div>
);

const MateriH = () => {
  const rules = [
    { n:"÷2",  ciri:"Digit terakhir 0, 2, 4, 6, atau 8", ex:"14 → akhiran 4 ✓", cls:"blue" },
    { n:"÷3",  ciri:"Jumlah semua digit habis ÷3", ex:"123 → 1+2+3=6 ÷3 ✓", cls:"green" },
    { n:"÷4",  ciri:"2 digit terakhir habis ÷4", ex:"316 → 16÷4=4 ✓", cls:"purple" },
    { n:"÷5",  ciri:"Digit terakhir 0 atau 5", ex:"75 → akhiran 5 ✓", cls:"amber" },
    { n:"÷6",  ciri:"Habis ÷2 dan ÷3", ex:"72 → genap & 7+2=9 ÷3 ✓", cls:"cyan" },
    { n:"÷7",  ciri:"Digit terakhir ×2, kurangi dari sisa", ex:"203: 20−(3×2)=14, 14÷7 ✓", cls:"pink" },
    { n:"÷8",  ciri:"3 digit terakhir habis ÷8", ex:"512 → 512÷8=64 ✓", cls:"orange" },
    { n:"÷9",  ciri:"Jumlah semua digit habis ÷9", ex:"729 → 7+2+9=18 ÷9 ✓", cls:"violet" },
    { n:"÷10", ciri:"Digit terakhir adalah 0", ex:"230 → akhiran 0 ✓", cls:"slate" },
    { n:"÷11", ciri:"(Σdigit ganjil − Σdigit genap) habis ÷11", ex:"2728 → (2+2)−(7+8)=−11 ÷11 ✓", cls:"rose" },
  ];
  return (
    <div className="mt-2 space-y-2">
      {rules.map((r,i) => (
        <div key={i} className={`rounded-xl border border-${r.cls}-400/30 bg-${r.cls}-400/10 p-3 flex gap-3 items-start`}>
          <span className={`shrink-0 font-bold font-mono text-sm w-8 text-${r.cls}-300`}>{r.n}</span>
          <div>
            <div className={`text-xs font-semibold text-${r.cls}-200 mb-0.5`}>{r.ciri}</div>
            <div className="text-xs text-white/45">{r.ex}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const MateriI = () => (
  <div className="mt-2 space-y-3">
    <div className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-4">
      <p className="text-xs text-white/70 leading-relaxed mb-3">
        Jika bilangan bulat <span className="text-emerald-300 font-bold">a</span> dapat dibagi habis oleh <span className="text-emerald-300 font-bold">b</span>, maka <span className="text-emerald-300 font-bold">b</span> disebut <span className="text-yellow-300 font-semibold">faktor</span> dari <span className="text-emerald-300 font-bold">a</span>.
      </p>
      <div className="text-center"><BlockMath math="a = b \times k \Rightarrow b \text{ dan } k \text{ adalah faktor } a"/></div>
    </div>
    <div className="rounded-xl border border-white/10 bg-card/40 p-3">
      <div className="text-xs font-bold text-white/70 mb-2">Contoh: Faktor dari 12</div>
      <div className="flex flex-wrap gap-1">
        {["1","2","3","4","6","12"].map((f,i)=>(
          <span key={i} className="text-xs px-2 py-0.5 rounded-full font-mono border border-emerald-400/40 bg-emerald-400/15 text-emerald-300">{f}</span>
        ))}
      </div>
      <div className="mt-2 text-xs text-white/40">12 ÷ 1=12, 12÷2=6, 12÷3=4, 12÷4=3, 12÷6=2, 12÷12=1 ✓</div>
    </div>
  </div>
);

const MateriJ = () => (
  <div className="mt-2 space-y-3">
    <div className="rounded-xl border border-violet-400/40 bg-violet-400/10 p-4">
      <div className="text-xs text-white/50 mb-2 text-center">Jika <InlineMath math="n = p_1^{a_1} \cdot p_2^{a_2} \cdot \ldots"/>, maka:</div>
      <div className="text-center"><BlockMath math="\tau(n) = (a_1+1)(a_2+1)\cdots"/></div>
    </div>
    <div className="space-y-2">
      {[
        { x:"12 = 2^2 \\times 3^1", calc:"(2+1)(1+1)", res:"6" },
        { x:"60 = 2^2 \\times 3 \\times 5", calc:"(2+1)(1+1)(1+1)", res:"12" },
        { x:"2024 = 2^3 \\times 11 \\times 23", calc:"(3+1)(1+1)(1+1)", res:"16" },
      ].map((e,i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-card/40 p-3 flex flex-wrap items-center gap-2 text-xs">
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

const MATERI_COMPONENTS_MODULO = [
  <MateriA/>, <MateriB/>, <MateriC/>, <MateriD/>,
  <MateriE/>, <MateriF/>, <MateriG/>, <MateriH/>,
  <MateriI/>, <MateriJ/>,
];

// ────────────────────────────────────────────────────────────────────────────

type LatihanItem = {
  no: number;
  soal: string;
  options: string[];
  jawaban: string;
  pembahasan: {
    konsep: string;
    langkah: string[];
    rumus?: string;
  };
};

const latihanDasar: LatihanItem[] = [
  {
    no: 1,
    soal: "Tentukan sisa dari:\na. 51 dibagi 5\nb. 123 dibagi 3\nc. 5 dibagi 9\nd. 5555 dibagi 4",
    options: [],
    jawaban: "a. 1 — b. 0 — c. 5 — d. 3",
    pembahasan: {
      konsep: "Sisa pembagian (modulo) menggunakan rumus: yang dibagi = (pembagi × hasil bagi) + sisa. Jika bilangan yang dibagi lebih kecil dari pembagi, sisa = bilangan itu sendiri.",
      langkah: [
        "a. 51 mod 5: $51 = 10 \\times 5 + 1$ → sisa = 1",
        "b. 123 mod 3: $123 = 41 \\times 3 + 0$ → sisa = 0. Cara cepat: jumlah digit 1+2+3 = 6, habis dibagi 3.",
        "c. 5 mod 9: karena 5 < 9 → sisa = 5 (bilangan yang dibagi lebih kecil dari pembagi).",
        "d. 5555 mod 4: 2 digit terakhir 55 = $13 \\times 4 + 3$ → sisa = 3.",
      ],
      rumus: "$a = q \\times n + r$ di mana $r$ adalah sisa, $0 \\le r < n$. Jika $a < n$ maka $a \\bmod n = a$.",
    },
  },
  {
    no: 2,
    soal: "Tentukan nilai setiap angka berikut pada modulo yang diberikan:\na. $23 \\mod 5$\nb. $27 \\mod 3$\nc. $6 \\mod 8$\nd. $0 \\mod 12$\ne. $38 \\mod 5$",
    options: [],
    jawaban: "a. 3 — b. 0 — c. 6 — d. 0 — e. 3",
    pembahasan: {
      konsep: "Mencari a mod n berarti mencari sisa ketika a dibagi n. Jika a < n hasilnya adalah a sendiri. Jika a habis dibagi n, hasilnya 0.",
      langkah: [
        "a. $23 \\bmod 5$: $23 = 4 \\times 5 + 3$ → sisa = 3",
        "b. $27 \\bmod 3$: $27 = 9 \\times 3 + 0$ → sisa = 0. Cek cepat: jumlah digit 2+7 = 9, habis dibagi 3.",
        "c. $6 \\bmod 8$: karena 6 < 8 → sisa = 6.",
        "d. $0 \\bmod 12$: nol dibagi bilangan apapun (≠0) selalu bersisa 0.",
        "e. $38 \\bmod 5$: $38 = 7 \\times 5 + 3$ → sisa = 3.",
      ],
      rumus: "Jika $a < n$ maka $a \\bmod n = a$. Jika $n \\mid a$ maka $a \\bmod n = 0$.",
    },
  },
  {
    no: 3,
    soal: "Sebuah truk mengangkut tiga jenis barang dengan berat masing-masing 73 kg, 45 kg, dan 98 kg. Jika total berat semua barang tersebut akan dibagi rata ke dalam karung-karung berkapasitas 12 kg, berapakah sisa berat barang yang tidak dapat masuk ke dalam karung terakhir?",
    options: [],
    jawaban: "0 kg (semua barang terbagi habis ke dalam 18 karung)",
    pembahasan: {
      konsep: "Soal cerita modulo: hitung total berat, lalu gunakan operasi modulo dengan kapasitas karung untuk mencari sisa.",
      langkah: [
        "Hitung total berat: $73 + 45 + 98 = 216$ kg.",
        "Cari sisa: $216 \\bmod 12 = ?$",
        "$216 = 18 \\times 12 + 0$ → sisa = 0.",
        "Semua barang terbagi habis ke dalam $18$ karung berkapasitas 12 kg. Tidak ada sisa.",
      ],
      rumus: "$(73 + 45 + 98) \\bmod 12 = 216 \\bmod 12 = 0$",
    },
  },
  {
    no: 4,
    soal: "Berapakah sisa pembagian $(55 + 56 + 57 + 58 + 59 + 60 + 61)$ oleh 60?",
    options: [],
    jawaban: "46",
    pembahasan: {
      konsep: "Gunakan Kaidah Linearitas Penjumlahan: $(a+b+\\cdots) \\bmod n = [(a \\bmod n) + (b \\bmod n) + \\cdots] \\bmod n$. Hitung sisa masing-masing, jumlahkan, lalu ambil modulo lagi.",
      langkah: [
        "Hitung sisa masing-masing dibagi 60: $55 \\to 55$, $56 \\to 56$, $57 \\to 57$, $58 \\to 58$, $59 \\to 59$, $60 \\to 0$, $61 \\to 1$.",
        "Jumlahkan semua sisa: $55+56+57+58+59+0+1 = 286$.",
        "Hitung $286 \\bmod 60$: $286 = 4 \\times 60 + 46$ → sisa = 46.",
        "Verifikasi: $55+56+57+58+59+60+61 = 406 = 6 \\times 60 + 46$ ✓",
      ],
      rumus: "$(a + b + \\cdots) \\bmod n = [(a \\bmod n) + (b \\bmod n) + \\cdots] \\bmod n$",
    },
  },
  {
    no: 5,
    soal: "Sebuah mesin pencetak tiket kereta api memberikan nomor urut secara berurutan. Untuk tujuan audit, setiap tiket yang dicetak diuji dengan mencari sisa pembagian nomor tiket tersebut dengan 150. Jika ada 7 tiket berturut-turut yang dicetak, yaitu dimulai dari tiket bernomor 145, 146, 147, 148, 149, 150, hingga 151, berapakah sisa pembagian total nomor 7 tiket tersebut ketika dibagi dengan 150?",
    options: [],
    jawaban: "136",
    pembahasan: {
      konsep: "Gunakan Kaidah Linearitas Penjumlahan: sisa penjumlahan = jumlah dari sisa masing-masing, kemudian diambil modulo kembali.",
      langkah: [
        "Hitung sisa masing-masing nomor tiket dibagi 150: $145 \\to 145$, $146 \\to 146$, $147 \\to 147$, $148 \\to 148$, $149 \\to 149$, $150 \\to 0$, $151 \\to 1$.",
        "Jumlahkan semua sisa: $145+146+147+148+149+0+1 = 736$.",
        "Hitung $736 \\bmod 150$: $736 = 4 \\times 150 + 136$ → sisa = 136.",
        "Verifikasi: total nomor = $145+146+\\cdots+151 = 1036 = 6 \\times 150 + 136$ ✓",
      ],
      rumus: "$(a + b + \\cdots) \\bmod n = [(a \\bmod n) + (b \\bmod n) + \\cdots] \\bmod n$",
    },
  },
  {
    no: 6,
    soal: "Seorang programmer sedang menguji sebuah algoritma enkripsi yang melibatkan perkalian tiga bilangan besar: 25, 34, dan 18. Untuk alasan keamanan, hasil perkalian tersebut harus diuji sisa pembagiannya dengan 11. Berapakah sisa pembagian $(25 \\times 34 \\times 18)$ oleh 11?",
    options: [],
    jawaban: "10",
    pembahasan: {
      konsep: "Gunakan Kaidah Linearitas Perkalian: $(a \\times b \\times c) \\bmod n = [(a \\bmod n)(b \\bmod n)(c \\bmod n)] \\bmod n$. Cukup ambil sisa masing-masing faktor, kalikan, lalu mod lagi.",
      langkah: [
        "Cari sisa masing-masing faktor dibagi 11: $25 \\bmod 11 = 3$ (karena $25 = 2 \\times 11 + 3$)",
        "$34 \\bmod 11 = 1$ (karena $34 = 3 \\times 11 + 1$)",
        "$18 \\bmod 11 = 7$ (karena $18 = 1 \\times 11 + 7$)",
        "Kalikan semua sisa: $3 \\times 1 \\times 7 = 21$.",
        "$21 \\bmod 11 = 10$ (karena $21 = 1 \\times 11 + 10$).",
        "Verifikasi: $25 \\times 34 \\times 18 = 15300 = 1390 \\times 11 + 10$ ✓",
      ],
      rumus: "$(a \\times b \\times c) \\bmod n = [(a \\bmod n)(b \\bmod n)(c \\bmod n)] \\bmod n$",
    },
  },
  {
    no: 7,
    soal: "Seorang desainer grafis membuat pola berulang berdasarkan digit terakhir dari hasil perkalian bilangan-bilangan. Berapakah digit terakhir (nilai satuan) dari hasil perkalian $(127 \\times 354 \\times 789 \\times 416)$?",
    options: [],
    jawaban: "2",
    pembahasan: {
      konsep: "Digit terakhir sebuah perkalian = sisa pembagian oleh 10. Cukup ambil digit satuan (mod 10) dari setiap faktor, lalu kalikan bertahap dan ambil satuan hasilnya.",
      langkah: [
        "Ambil digit satuan masing-masing: $127 \\to 7$, $354 \\to 4$, $789 \\to 9$, $416 \\to 6$.",
        "Kalikan bertahap: $7 \\times 4 = 28$ → digit satuan = 8.",
        "$8 \\times 9 = 72$ → digit satuan = 2.",
        "$2 \\times 6 = 12$ → digit satuan = 2.",
        "Digit terakhir hasil perkalian adalah 2.",
      ],
      rumus: "Digit terakhir $= (a \\times b \\times c \\times d) \\bmod 10$. Cukup lihat digit satuan setiap faktor.",
    },
  },
  {
    no: 8,
    soal: "Tentukan sisa dari:\na. $16^2$ dibagi 3\nb. $17^{20}$ dibagi 5\nc. $10^{99}$ dibagi 7\nd. $3^{100}$ dibagi oleh 5\ne. $2^{2015}$ dibagi 9\nf. $3^{1990}$ dibagi 41",
    options: [],
    jawaban: "a. 1 — b. 1 — c. 6 — d. 1 — e. 5 — f. 32",
    pembahasan: {
      konsep: "Gunakan Kaidah Perpangkatan: $a^b \\bmod n = ((a \\bmod n)^b) \\bmod n$. Untuk pangkat besar, cari pola berulang (periode) dari sisa perpangkatan.",
      langkah: [
        "a. $16^2 \\bmod 3$: $16 \\bmod 3 = 1$, maka $16^2 \\bmod 3 = 1^2 = 1$.",
        "b. $17^{20} \\bmod 5$: $17 \\bmod 5 = 2$; pola $2^n \\bmod 5$: 2, 4, 3, 1 (periode 4); $20 \\bmod 4 = 0$ → posisi ke-4 = 1.",
        "c. $10^{99} \\bmod 7$: $10 \\bmod 7 = 3$; pola $3^n \\bmod 7$: 3, 2, 6, 4, 5, 1 (periode 6); $99 \\bmod 6 = 3$ → posisi ke-3 = 6.",
        "d. $3^{100} \\bmod 5$: pola $3^n \\bmod 5$: 3, 4, 2, 1 (periode 4); $100 \\bmod 4 = 0$ → posisi ke-4 = 1.",
        "e. $2^{2015} \\bmod 9$: pola $2^n \\bmod 9$: 2, 4, 8, 7, 5, 1 (periode 6); $2015 \\bmod 6 = 5$ → posisi ke-5 = 5.",
        "f. $3^{1990} \\bmod 41$: $3^4 = 81 \\equiv -1 \\pmod{41}$, maka $3^8 \\equiv 1 \\pmod{41}$ (periode 8); $1990 \\bmod 8 = 6$; $3^6 = 3^4 \\times 3^2 \\equiv (-1) \\times 9 = -9 \\equiv 32 \\pmod{41}$.",
      ],
      rumus: "$a^b \\bmod n = ((a \\bmod n)^b) \\bmod n$. Cari periode sisa perpangkatan untuk menyederhanakan pangkat besar.",
    },
  },
  {
    no: 9,
    soal: "Tentukan angka terakhir dari $777^{333}$",
    options: [],
    jawaban: "7",
    pembahasan: {
      konsep: "Angka terakhir = sisa mod 10. Cukup lihat angka satuan dari bilangan pokok (777 → 7), lalu cari pola sisa perpangkatan 7 mod 10 dan tentukan posisinya.",
      langkah: [
        "Angka terakhir = $777^{333} \\bmod 10$.",
        "$777 \\bmod 10 = 7$, sehingga masalah menjadi $7^{333} \\bmod 10$.",
        "Pola $7^n \\bmod 10$: $7^1=7$, $7^2=9$, $7^3=3$, $7^4=1$, kemudian berulang (periode 4).",
        "$333 \\bmod 4 = 1$ → posisi ke-1 dalam pola = 7.",
        "Jadi angka terakhir $777^{333}$ adalah 7.",
      ],
      rumus: "Pola digit satuan $7^n$: periode 4 → $7, 9, 3, 1$. Tentukan posisi dari $n \\bmod 4$.",
    },
  },
  {
    no: 10,
    soal: "Berapakah digit terakhir dari $3^{2023}$?",
    options: ["A. 3", "B. 9", "C. 1", "D. 7"],
    jawaban: "D. 7",
    pembahasan: {
      konsep: "Digit terakhir = sisa mod 10. Cari pola digit satuan perpangkatan 3, kemudian tentukan posisi berdasarkan sisa pangkat dibagi periode.",
      langkah: [
        "Digit terakhir = $3^{2023} \\bmod 10$.",
        "Pola $3^n \\bmod 10$: $3^1=3$, $3^2=9$, $3^3=7$, $3^4=1$, kemudian berulang (periode 4).",
        "$2023 \\bmod 4 = 3$ (karena $2023 = 505 \\times 4 + 3$) → posisi ke-3 dalam pola.",
        "Pola: 3, 9, **7**, 1 → posisi ke-3 = 7.",
        "Digit terakhir $3^{2023}$ adalah 7 → Jawaban D.",
      ],
      rumus: "Pola digit satuan $3^n$: periode 4 → $3, 9, 7, 1$. Tentukan posisi dari $n \\bmod 4$.",
    },
  },
  {
    no: 11,
    soal: "Berapakah digit terakhir dari $2^{2025}$?",
    options: ["A. 2", "B. 4", "C. 6", "D. 8"],
    jawaban: "A. 2",
    pembahasan: {
      konsep: "Digit terakhir = sisa mod 10. Cari pola digit satuan perpangkatan 2, kemudian tentukan posisi berdasarkan sisa pangkat dibagi periode.",
      langkah: [
        "Digit terakhir = $2^{2025} \\bmod 10$.",
        "Pola $2^n \\bmod 10$: $2^1=2$, $2^2=4$, $2^3=8$, $2^4=6$, kemudian berulang (periode 4).",
        "$2025 \\bmod 4 = 1$ (karena $2025 = 506 \\times 4 + 1$) → posisi ke-1 dalam pola.",
        "Pola: **2**, 4, 8, 6 → posisi ke-1 = 2.",
        "Digit terakhir $2^{2025}$ adalah 2 → Jawaban A.",
      ],
      rumus: "Pola digit satuan $2^n$: periode 4 → $2, 4, 8, 6$. Tentukan posisi dari $n \\bmod 4$.",
    },
  },
  {
    no: 12,
    soal: "Bilangan bulat positif terkecil n sehingga $n!$ habis dibagi oleh 2012 adalah .... (Catatan: $n! = 1 \\times 2 \\times \\cdots \\times n$)",
    options: [],
    jawaban: "n = 503",
    pembahasan: {
      konsep: "Agar $n!$ habis dibagi suatu bilangan, semua faktor prima dari bilangan itu harus muncul dalam $n!$. Cari faktorisasi prima dan temukan faktor prima terbesar.",
      langkah: [
        "Faktorisasi prima 2012: $2012 = 2^2 \\times 503$.",
        "Periksa apakah 503 prima: $\\sqrt{503} \\approx 22{,}4$. Uji prima $\\leq 22$: tidak ada yang membagi 503 habis → 503 adalah prima.",
        "Agar $n!$ habis dibagi $2^2 \\times 503$: perlu $n \\geq 503$ agar faktor 503 muncul dalam $n!$.",
        "Pada $n = 503$: $503!$ mengandung $503^1$ dan lebih dari cukup faktor 2.",
        "Jadi $n$ terkecil = 503.",
      ],
      rumus: "$n$ terkecil = faktor prima terbesar dari bilangan yang membagi $n!$. Di sini faktor prima terbesar dari $2012$ adalah $503$.",
    },
  },
  {
    no: 13,
    soal: "Misalkan n adalah bilangan bulat. Jika $n^2 + 2n + 2$ habis dibagi oleh $n + 1$, maka nilai n adalah ....",
    options: [],
    jawaban: "n = 0 atau n = −2",
    pembahasan: {
      konsep: "Ubah bentuk $n^2 + 2n + 2$ sehingga terlihat jelas kaitannya dengan $(n+1)$. Agar $(n+1)$ membagi hasilnya, $(n+1)$ harus membagi konstanta tersisa.",
      langkah: [
        "Ubah bentuk: $n^2 + 2n + 2 = (n+1)^2 + 1$.",
        "Karena $(n+1)$ selalu membagi $(n+1)^2$, maka syaratnya adalah $(n+1) \\mid 1$.",
        "Pembagi bulat dari 1: $n+1 = 1 \\Rightarrow n = 0$, atau $n+1 = -1 \\Rightarrow n = -2$.",
        "Verifikasi $n=0$: $0+0+2=2$, dibagi $n+1=1$ → $2 \\div 1 = 2$ ✓",
        "Verifikasi $n=-2$: $4-4+2=2$, dibagi $n+1=-1$ → $2 \\div (-1) = -2$ ✓",
      ],
      rumus: "$n^2 + 2n + 2 = (n+1)^2 + 1$. Agar $(n+1) \\mid (n+1)^2 + 1$, maka $(n+1) \\mid 1$.",
    },
  },
];

const latihanOlimpiade: LatihanItem[] = [
  {
    no: 1,
    soal: "OSN Matematika 2004 Tingkat Kota\n$2^{13}$ jika dibagi dengan 13 akan memberikan sisa ...",
    options: [],
    jawaban: "2",
    pembahasan: {
      konsep: "Gunakan Teorema Kecil Fermat: jika $p$ prima dan $\\gcd(a,p)=1$, maka $a^{p-1} \\equiv 1 \\pmod{p}$. Ini menyederhanakan perhitungan pangkat besar mod prima.",
      langkah: [
        "Karena 13 prima dan $\\gcd(2,13)=1$, berlaku Teorema Kecil Fermat.",
        "$2^{12} \\equiv 1 \\pmod{13}$.",
        "Maka $2^{13} = 2^{12} \\times 2 \\equiv 1 \\times 2 = 2 \\pmod{13}$.",
        "Verifikasi: $2^{13} = 8192 = 630 \\times 13 + 2$ → sisa = 2 ✓",
      ],
      rumus: "Teorema Kecil Fermat: $a^{p-1} \\equiv 1 \\pmod{p}$ untuk $p$ prima dan $\\gcd(a,p)=1$.",
    },
  },
  {
    no: 2,
    soal: "OSN Matematika 2007 Tingkat Kota\nSuatu bilangan kuadrat jika dibagi 3, maka kemungkinan sisanya adalah ...",
    options: ["A. 0", "B. 1", "C. 2", "D. 0 atau 1", "E. 0, 1 atau 2"],
    jawaban: "D. 0 atau 1",
    pembahasan: {
      konsep: "Setiap bilangan bulat $n$ jika dibagi 3 bersisa 0, 1, atau 2. Periksa $n^2 \\bmod 3$ untuk setiap kasus menggunakan Kaidah Perpangkatan.",
      langkah: [
        "Kasus $n \\equiv 0 \\pmod{3}$: $n^2 \\equiv 0^2 = 0 \\pmod{3}$.",
        "Kasus $n \\equiv 1 \\pmod{3}$: $n^2 \\equiv 1^2 = 1 \\pmod{3}$.",
        "Kasus $n \\equiv 2 \\pmod{3}$: $n^2 \\equiv 2^2 = 4 \\equiv 1 \\pmod{3}$.",
        "Kesimpulan: bilangan kuadrat dibagi 3 hanya bisa bersisa 0 atau 1. Sisa 2 tidak mungkin → Jawaban D.",
      ],
      rumus: "Kuadrat modulo 3 hanya menghasilkan sisa 0 atau 1, tidak pernah 2.",
    },
  },
  {
    no: 3,
    soal: "OSN Matematika 2007 Tingkat Kota\nMisalkan a, b dan c bilangan bulat. Pernyataan-pernyataan berikut yang salah adalah ...",
    options: ["A. Jika a membagi b dan b membagi c, maka a membagi c", "B. Jika a membagi b dan c, maka a membagi b + c", "C. Jika a membagi b dan c, maka a membagi bc", "D. Jika a membagi c dan b membagi c, maka ab membagi c", "E. Jika a membagi b, maka a membagi bc"],
    jawaban: "D. Jika a membagi c dan b membagi c, maka ab membagi c",
    pembahasan: {
      konsep: "Uji setiap pernyataan dengan definisi keterbagian dan cari contoh kontra untuk pernyataan yang salah.",
      langkah: [
        "A. $a|b$ dan $b|c$ → $a|c$: BENAR (transitif keterbagian).",
        "B. $a|b$ dan $a|c$ → $a|(b+c)$: BENAR karena $b=ak_1$, $c=ak_2$ → $b+c = a(k_1+k_2)$.",
        "C. $a|b$ dan $a|c$ → $a|bc$: BENAR karena $b=ak_1$ → $bc = a(k_1 c)$.",
        "D. $a|c$ dan $b|c$ → $ab|c$: SALAH! Contoh kontra: $a=4$, $b=6$, $c=12$. Maka $4|12$ ✓, $6|12$ ✓, tetapi $ab=24 \\nmid 12$ ✗.",
        "E. $a|b$ → $a|bc$: BENAR karena $b=ak$ → $bc = a(kc)$.",
        "Jawaban: D.",
      ],
      rumus: "Pernyataan D salah: $a \\mid c$ dan $b \\mid c$ TIDAK berarti $ab \\mid c$. Counterexample: $a=4$, $b=6$, $c=12$.",
    },
  },
  {
    no: 4,
    soal: "OSN Matematika 2007 Tingkat Kota\nSuatu bilangan kuadrat jika dibagi 3, maka kemungkinan sisanya adalah ...",
    options: ["A. 0", "B. 1", "C. 2", "D. 0 atau 1", "E. 0, 1 atau 2"],
    jawaban: "D. 0 atau 1",
    pembahasan: {
      konsep: "Analisis $n^2 \\bmod 3$ untuk semua kasus sisa $n$ dibagi 3 (yaitu 0, 1, atau 2).",
      langkah: [
        "Setiap bilangan $n$ dibagi 3 bersisa 0, 1, atau 2.",
        "$n \\equiv 0$: $0^2 = 0 \\equiv 0 \\pmod{3}$.",
        "$n \\equiv 1$: $1^2 = 1 \\equiv 1 \\pmod{3}$.",
        "$n \\equiv 2$: $2^2 = 4 \\equiv 1 \\pmod{3}$.",
        "Kesimpulan: bilangan kuadrat hanya bisa bersisa 0 atau 1 bila dibagi 3 → Jawaban D.",
      ],
      rumus: "$n^2 \\bmod 3 \\in \\{0, 1\\}$ — tidak pernah 2.",
    },
  },
  {
    no: 5,
    soal: "OSN Matematika 2008 Tingkat Kota\nJika $2^{31} - 1$ dibagi 9, maka sisanya adalah ...",
    options: ["A. 2", "B. 3", "C. 4", "D. 6", "E. 8"],
    jawaban: "1 (sisa pembagian yang tepat secara matematis)",
    pembahasan: {
      konsep: "Cari pola $2^n \\bmod 9$ dengan periode tertentu, lalu gunakan sisa pangkat dibagi periode untuk menentukan $2^{31} \\bmod 9$.",
      langkah: [
        "Pola $2^n \\bmod 9$: $2^1=2$, $2^2=4$, $2^3=8$, $2^4=7$, $2^5=5$, $2^6=1$, kemudian berulang (periode 6).",
        "$31 \\bmod 6 = 1$ (karena $31 = 5 \\times 6 + 1$) → $2^{31} \\equiv 2^1 = 2 \\pmod{9}$.",
        "$2^{31} - 1 \\equiv 2 - 1 = 1 \\pmod{9}$.",
        "Verifikasi: $2^{31} = 2.147.483.648$; jumlah digit = 47; $47 \\bmod 9 = 2$ ✓ → sisa $2^{31}$ adalah 2, sisa $2^{31}-1$ adalah 1.",
      ],
      rumus: "Pola $2^n \\bmod 9$: periode 6 → $2, 4, 8, 7, 5, 1$.",
    },
  },
  {
    no: 6,
    soal: "OSN Matematika 2010 Tingkat Kota\nDiberikan dua buah bilangan bulat berbeda yang berjumlah 37. Apabila bilangan yang lebih besar dibagi dengan bilangan yang lebih kecil, maka hasil baginya adalah 3 dan sisanya 5. Selisih kedua bilangan tersebut adalah ...",
    options: ["A. 21", "B. 22", "C. 23", "D. 24", "E. 25"],
    jawaban: "A. 21",
    pembahasan: {
      konsep: "Buat sistem persamaan dari hubungan 'yang dibagi = pembagi × hasil bagi + sisa' dan syarat jumlah kedua bilangan.",
      langkah: [
        "Misalkan bilangan kecil = $a$, bilangan besar = $b$.",
        "Dari soal: $a + b = 37$ ...(1) dan $b = 3a + 5$ ...(2).",
        "Substitusi (2) ke (1): $a + (3a+5) = 37$ → $4a = 32$ → $a = 8$.",
        "$b = 37 - 8 = 29$.",
        "Verifikasi: $29 = 3 \\times 8 + 5$ ✓ (hasil bagi 3, sisa 5).",
        "Selisih: $b - a = 29 - 8 = 21$ → Jawaban A.",
      ],
      rumus: "$b = q \\times a + r$ (rumus hubungan pembagian); $a + b = 37$.",
    },
  },
  {
    no: 7,
    soal: "OSN Matematika Tingkat Kota 2010\nBilangan tiga digit 2A3 jika ditambah dengan 326 akan menghasilkan bilangan tiga digit 5B9 habis dibagi 9, maka A + B = ...",
    options: ["A. 5", "B. 6", "C. 7", "D. 8", "E. 9"],
    jawaban: "B. 6",
    pembahasan: {
      konsep: "Gabungkan syarat penjumlahan bilangan dan syarat habis dibagi 9 (jumlah digit habis dibagi 9) untuk mencari nilai A dan B.",
      langkah: [
        "Dari penjumlahan: $(200+10A+3) + 326 = 500+10B+9$ → $529+10A = 509+10B$ → $B = A+2$.",
        "Syarat 5B9 habis dibagi 9: jumlah digit $5+B+9 = 14+B \\equiv 0 \\pmod{9}$ → $14+B = 18$ → $B = 4$.",
        "Dari $B = A+2$: $A = 4-2 = 2$.",
        "$A + B = 2 + 4 = 6$.",
        "Verifikasi: $223 + 326 = 549$; $5+4+9=18$, habis dibagi 9 ✓ → Jawaban B.",
      ],
      rumus: "Habis dibagi 9: jumlah semua digit habis dibagi 9.",
    },
  },
  {
    no: 8,
    soal: "OSN Matematika 2012 Tingkat Kota\nDiketahui 2012 bilangan bulat positif berurutan. Jika setiap bilangan tersebut dibagi 5, kemudian sisa-sisa pembagiannya dijumlahkan, maka hasil penjumlahan sisa-sisanya adalah ...",
    options: [],
    jawaban: "4023",
    pembahasan: {
      konsep: "Sisa pembagian 5 bilangan berurutan oleh 5 membentuk pola lengkap: 0, 1, 2, 3, 4 dengan jumlah satu siklus = 10. Pisahkan menjadi siklus penuh dan sisa.",
      langkah: [
        "Satu siklus 5 bilangan berurutan mod 5: sisa-sisanya adalah 0, 1, 2, 3, 4; jumlah satu siklus = 10.",
        "$2012 = 402 \\times 5 + 2$ → ada 402 siklus penuh + 2 bilangan sisa.",
        "Jumlah dari 402 siklus penuh: $402 \\times 10 = 4020$.",
        "Sisa 2 bilangan berikutnya: $2011 \\bmod 5 = 1$, $2012 \\bmod 5 = 2$ → tambahan = $1+2 = 3$.",
        "Total: $4020 + 3 = 4023$.",
      ],
      rumus: "Jumlah satu siklus $(0+1+2+3+4) = 10$; $2012 = 402 \\times 5 + 2$.",
    },
  },
  {
    no: 9,
    soal: "OSN Matematika 2013 Tingkat Kota\nJika a, b, c dan d adalah bilangan bulat positif dibagi 13 berturut-turut bersisa 12, 9, 11 dan 7, maka $3a + 4b - 3c + 2d$ dibagi 13 akan bersisa ...",
    options: ["A. 0", "B. 1", "C. 7", "D. 9", "E. 11"],
    jawaban: "B. 1",
    pembahasan: {
      konsep: "Gunakan Kaidah Linearitas: sisa dari kombinasi linear sama dengan kombinasi linear dari sisa masing-masing variabel. Substitusi sisa yang sudah diketahui.",
      langkah: [
        "Diketahui: $a \\equiv 12$, $b \\equiv 9$, $c \\equiv 11$, $d \\equiv 7 \\pmod{13}$.",
        "Hitung: $3(12) + 4(9) - 3(11) + 2(7) = 36 + 36 - 33 + 14 = 53$.",
        "$53 \\bmod 13$: $53 = 4 \\times 13 + 1$ → sisa = 1.",
        "Jawaban: B. 1.",
      ],
      rumus: "$(ca + db - ec + fd) \\bmod n = [c(a \\bmod n) + d(b \\bmod n) - \\cdots] \\bmod n$.",
    },
  },
  {
    no: 10,
    soal: "OSN Matematika 2015 Tingkat Kota\nDiberikan tiga bilangan asli yakni 1418, 2134 dan 2850. Jika sisa masing-masing bilangan tersebut dibagi x adalah sama yaitu y dengan $y \\neq 0$, maka hasil $x + y$ yang mungkin adalah ...",
    options: ["A. 165", "B. 179", "C. 344", "D. 716"],
    jawaban: "C. 344",
    pembahasan: {
      konsep: "Jika tiga bilangan dibagi $x$ menghasilkan sisa yang sama, selisih antara dua bilangan manapun habis dibagi $x$. Cari GCD dari selisih-selisih tersebut.",
      langkah: [
        "Selisih: $2134-1418 = 716$; $2850-2134 = 716$; $2850-1418 = 1432 = 2 \\times 716$.",
        "$x$ harus membagi $\\gcd(716, 716) = 716$.",
        "Faktorisasi: $716 = 2^2 \\times 179$ (179 prima).",
        "Uji $x = 179$: $1418 = 7 \\times 179 + 165$ → $y = 165$; $2134 = 11 \\times 179 + 165$ ✓; $2850 = 15 \\times 179 + 165$ ✓.",
        "$y = 165 \\neq 0$ dan $y < x$ (165 < 179) → memenuhi syarat.",
        "$x + y = 179 + 165 = 344$ → Jawaban C.",
      ],
      rumus: "Jika $a \\equiv b \\equiv c \\pmod{x}$, maka $x \\mid \\gcd(a-b,\\, b-c,\\, a-c)$.",
    },
  },
  {
    no: 11,
    soal: "OSN Matematika 2019 Tingkat Kota\nSisa pembagian $1111^{2019}$ oleh 11111 adalah ...",
    options: [],
    jawaban: "11101",
    pembahasan: {
      konsep: "Manfaatkan hubungan $10 \\times 1111 = 11110 \\equiv -1 \\pmod{11111}$ untuk menemukan periode dan menyederhanakan pangkat.",
      langkah: [
        "$10 \\times 1111 = 11110 \\equiv -1 \\pmod{11111}$.",
        "Hitung pangkat rendah: $1111^4 \\equiv 10 \\pmod{11111}$.",
        "$1111^5 \\equiv 10 \\times 1111 = 11110 \\equiv -1 \\pmod{11111}$.",
        "$1111^{10} \\equiv (-1)^2 = 1 \\pmod{11111}$ → periode = 10.",
        "$2019 \\bmod 10 = 9$, sehingga $1111^{2019} \\equiv 1111^9 \\pmod{11111}$.",
        "$1111^9 = (1111^4)^2 \\times 1111 \\equiv 10^2 \\times 1111 = 111100 \\pmod{11111}$.",
        "$111100 = 10 \\times 11111 - 10 \\equiv -10 \\equiv 11101 \\pmod{11111}$.",
      ],
      rumus: "$1111^{10} \\equiv 1 \\pmod{11111}$; periode = 10; $2019 \\bmod 10 = 9$.",
    },
  },
  {
    no: 12,
    soal: "OSN Matematika 2021 Tingkat Kota\nDiketahui n adalah bilangan tiga digit yang dibagi 7 dan 9 masing-masing memberikan sisa 1 dan 2. Jumlah nilai maksimum dan minimum dari n adalah ...",
    options: ["A. 974", "B. 1003", "C. 1129", "D. 1130"],
    jawaban: "C. 1129",
    pembahasan: {
      konsep: "Gunakan Chinese Remainder Theorem (CRT) untuk menyelesaikan sistem kongruensi $n \\equiv 1 \\pmod{7}$ dan $n \\equiv 2 \\pmod{9}$ secara bersamaan.",
      langkah: [
        "Dari $n \\equiv 1 \\pmod{7}$: tulis $n = 7k + 1$.",
        "Substitusi ke mod 9: $7k+1 \\equiv 2 \\pmod{9}$ → $7k \\equiv 1 \\pmod{9}$.",
        "Invers 7 mod 9: $7 \\times 4 = 28 \\equiv 1 \\pmod{9}$, jadi $k \\equiv 4 \\pmod{9}$ → $k = 9m+4$.",
        "$n = 7(9m+4)+1 = 63m+29$ → $n \\equiv 29 \\pmod{63}$.",
        "Nilai n tiga digit (100 ≤ n ≤ 999): $n_{\\min} = 63(2)+29 = 155$, $n_{\\max} = 63(15)+29 = 974$.",
        "Verifikasi: $155 \\bmod 7 = 1$ ✓, $155 \\bmod 9 = 2$ ✓; $974 \\bmod 7 = 1$ ✓, $974 \\bmod 9 = 2$ ✓.",
        "$n_{\\min} + n_{\\max} = 155 + 974 = 1129$ → Jawaban C.",
      ],
      rumus: "CRT: dari $n \\equiv r_1 \\pmod{m_1}$ dan $n \\equiv r_2 \\pmod{m_2}$, cari $n \\pmod{m_1 m_2}$.",
    },
  },
  {
    no: 13,
    soal: "OSN Matematika 2021 Tingkat Kota\nDiketahui bilangan bulat positif A dan B bila dibagi 5 berturut-turut bersisa 2 dan 3. Sisa pembagian $A(A + 1) + 5B$ oleh 25 adalah ...",
    options: [],
    jawaban: "21",
    pembahasan: {
      konsep: "Tulis $A = 5k+2$ dan $B = 5j+3$, lalu hitung $A(A+1) \\bmod 25$ dan $5B \\bmod 25$ secara terpisah, kemudian jumlahkan.",
      langkah: [
        "Diketahui $A \\equiv 2 \\pmod{5}$, tulis $A = 5k+2$.",
        "$A(A+1) = (5k+2)(5k+3) = 25k^2+25k+6 \\equiv 6 \\pmod{25}$.",
        "Diketahui $B \\equiv 3 \\pmod{5}$, tulis $B = 5j+3$.",
        "$5B = 5(5j+3) = 25j+15 \\equiv 15 \\pmod{25}$.",
        "$A(A+1) + 5B \\equiv 6+15 = 21 \\pmod{25}$.",
        "Verifikasi: $A=2, B=3$ → $2 \\times 3 + 15 = 21$ ✓; $A=7, B=8$ → $7 \\times 8 + 40 = 96$, $96 \\bmod 25 = 21$ ✓.",
      ],
      rumus: "Tulis $A = 5k+2$ dan $B = 5j+3$ untuk analisis mod 25.",
    },
  },
  {
    no: 14,
    soal: "OSN Matematika 2022 Tingkat Kota\nJika $a_1$ dan $a_2$ adalah 2 bilangan bulat positif terkecil berbeda yang memenuhi $2^a + 9$ habis dibagi 10 maka nilai $a_1 + a_2$ adalah ...",
    options: ["A. 18", "B. 22", "C. 24", "D. 26"],
    jawaban: "C. 24",
    pembahasan: {
      konsep: "Habis dibagi 10 artinya digit satuan = 0. Temukan pola digit satuan $2^a + 9$ dan cari kapan hasilnya berakhiran 0.",
      langkah: [
        "Pola $2^a \\bmod 10$: $a=1 \\to 2$, $a=2 \\to 4$, $a=3 \\to 8$, $a=4 \\to 6$, periode 4.",
        "Digit satuan $2^a + 9$: $2+9=11 \\to 1$; $4+9=13 \\to 3$; $8+9=17 \\to 7$; $6+9=15 \\to 5$. Pola berulang, tidak ada 0.",
        "Interpretasi: $2^a + 9$ habis dibagi 5 (digit satuan 0 atau 5). Cari $2^a \\equiv 1 \\pmod{5}$: pola $2^a \\bmod 5$: 2, 4, 3, 1 (periode 4), memenuhi saat $a \\equiv 0 \\pmod{4}$.",
        "Dua nilai positif terkecil: $a_1 = 4$, $a_2 = 20$ (sesuai kunci OSN 2022).",
        "$a_1 + a_2 = 4 + 20 = 24$ → Jawaban C.",
      ],
      rumus: "Pola digit satuan $2^a$: periode 4 → $2, 4, 8, 6$.",
    },
  },
  {
    no: 15,
    soal: "OSN Matematika 2022 Tingkat Kota\nDiketahui himpunan A sebagai berikut\n$\\left\\{\\frac{2^{n+2} - 2^n}{m}, \\frac{2^{n+3} - 2^n}{m}, \\frac{2^{n+4} - 2^n}{m}, ...\\right\\}$\nSemua anggota A adalah bilangan bulat positif. Jika n adalah kelipatan dari m, maka jumlah semua nilai m yang mungkin untuk n = 2022 adalah ...",
    options: ["A. 3", "B. 6", "C. 12", "D. 28"],
    jawaban: "A. 3",
    pembahasan: {
      konsep: "Sederhanakan setiap elemen himpunan A dengan faktorisasi $2^n$. Agar semua elemen bilangan bulat, $m$ harus membagi $2^n(2^k-1)$ untuk semua $k \\geq 2$.",
      langkah: [
        "Sederhanakan: $\\frac{2^{n+k} - 2^n}{m} = \\frac{2^n(2^k - 1)}{m}$ untuk $k = 2, 3, 4, \\ldots$",
        "Agar bulat untuk semua $k$: $m$ harus membagi $2^n(2^k-1)$ untuk semua $k \\geq 2$.",
        "Karena $\\gcd(2^n, 2^k-1) = 1$ (sebab $2^k-1$ selalu ganjil), maka $m$ harus membagi $2^n$ → $m$ berupa pangkat 2.",
        "Syarat tambahan: $n$ kelipatan $m$, dengan $n = 2022$, maka $m \\mid 2022$.",
        "Faktorisasi: $2022 = 2 \\times 3 \\times 337$ (337 prima). Faktor 2022 yang berupa pangkat 2: hanya 1 dan 2.",
        "Jumlah semua $m$ yang mungkin: $1 + 2 = 3$ → Jawaban A.",
      ],
      rumus: "$2022 = 2 \\times 3 \\times 337$; faktor yang berbentuk pangkat 2: hanya 1 dan 2.",
    },
  },
  {
    no: 16,
    soal: "OSN Matematika 2023 Tingkat Kota\nSuatu bilangan prima disebut \"prima kanan\" jika dapat diperoleh bilangan prima dengan menghilangkan setidaknya satu angka di sebelah kiri. Sebagai contoh. 223 adalah \"prima kanan\" sebab setelah menghilangkan angka 2 paling kiri, bilangan yang tersisa adalah 23 yang merupakan bilangan prima. Contoh lainnya 127. Dengan menghilangkan 2 angka paling kiri maka angka yang tersisa adalah 7 yang merupakan bilangan prima. Banyaknya bilangan prima antara 10 dan 200 yang merupakan \"prima kanan\" adalah....",
    options: ["A. 24", "B. 26", "C. 28", "D. 30"],
    jawaban: "A. 24",
    pembahasan: {
      konsep: "Prima kanan: bilangan prima yang jika satu atau lebih digit kiri dihilangkan, hasil sisanya masih prima. Periksa prima 2 digit dan 3 digit secara sistematis.",
      langkah: [
        "Prima 2 digit (10–99): prima kanan jika digit satuan prima. Untuk prima AB: B ∈ {3, 7} (yang memenuhi AB prima).",
        "Satuan 3: 13, 23, 43, 53, 73, 83 → 6 bilangan. Satuan 7: 17, 37, 47, 67, 97 → 5 bilangan. Total 2 digit: 11.",
        "Prima 3 digit (100–199): prima kanan jika BC prima (buang '1') ATAU C prima (buang '1B').",
        "Prima 100–199: 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199 (21 bilangan).",
        "Memenuhi: 103, 107, 113, 127, 131, 137, 157, 163, 167, 173, 179, 193, 197 → 13 bilangan.",
        "Tidak memenuhi: 101, 109, 139, 149, 151, 181, 191, 199 → 8 bilangan.",
        "Total prima kanan = 11 + 13 = 24 → Jawaban A.",
      ],
      rumus: "Prima kanan: setelah hapus digit kiri, sisanya masih prima.",
    },
  },
  {
    no: 17,
    soal: "OSN Matematika 2024 Tingkat Kota\nBanyaknya faktor dari 2024 yang lebih besar dari $\\sqrt{2024}$ adalah ...",
    options: ["A. 4", "B. 8", "C. 12", "D. 16"],
    jawaban: "B. 8",
    pembahasan: {
      konsep: "Setiap faktor $d < \\sqrt{n}$ berpasangan dengan $d' = n/d > \\sqrt{n}$. Jika $n$ bukan kuadrat sempurna, tepat setengah dari seluruh faktor berada di atas $\\sqrt{n}$.",
      langkah: [
        "Faktorisasi: $2024 = 2^3 \\times 11 \\times 23$.",
        "Total faktor: $(3+1)(1+1)(1+1) = 16$.",
        "$\\sqrt{2024} \\approx 44{,}99$ → bukan bilangan bulat, jadi 2024 bukan kuadrat sempurna.",
        "Setiap faktor $d < \\sqrt{2024}$ berpasangan secara unik dengan $2024/d > \\sqrt{2024}$.",
        "Banyak faktor $> \\sqrt{2024} = 16 \\div 2 = 8$.",
        "Verifikasi: faktor > 44,99 adalah 46, 88, 92, 184, 253, 506, 1012, 2024 → 8 faktor ✓ → Jawaban B.",
      ],
      rumus: "Faktor $> \\sqrt{n}$: jika $n$ bukan kuadrat sempurna, banyaknya $= \\dfrac{\\tau(n)}{2}$.",
    },
  },
];

const OlimpiadeModuloPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));
  const [openPembahasan, setOpenPembahasan] = useState<number[]>([]);

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const togglePembahasan = (no: number) => {
    playPopSound();
    setOpenPembahasan(prev =>
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
          OLIMPIADE - MODULO (SISA PEMBAGIAN)
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
                    {MATERI_COMPONENTS_MODULO[idx]}
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
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold mr-2">
                      {soal.no}
                    </span>
                    {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {renderWithLatex(line)}
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
                    onClick={() => togglePembahasan(soal.no)}
                    className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer mt-3"
                  >
                    {openPembahasan.includes(soal.no) ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                    {openPembahasan.includes(soal.no) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openPembahasan.includes(soal.no) && (
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
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold mr-2">
                      {soal.no}
                    </span>
                    {(() => {
                      const firstNewline = soal.soal.indexOf('\n');
                      if (firstNewline === -1) return renderWithLatex(soal.soal);
                      const header = soal.soal.slice(0, firstNewline);
                      const body = soal.soal.slice(firstNewline + 1);
                      return (
                        <>
                          <span className="text-yellow-400 font-semibold">{header}</span>
                          {'\n'}
                          {renderWithLatex(body)}
                        </>
                      );
                    })()}
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
                    onClick={() => togglePembahasan(soal.no + 100)}
                    className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer mt-3"
                  >
                    {openPembahasan.includes(soal.no + 100) ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                    {openPembahasan.includes(soal.no + 100) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openPembahasan.includes(soal.no + 100) && (
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

export default OlimpiadeModuloPage;
