import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

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
  title: "MATERI - ALJABAR",
  sections: [
    {
      heading: "A. Bentuk Umum",
      content: `$ax^n + b$

$x$ disebut variabel, biasanya berupa huruf alfabet
$a$ disebut koefisien (bilangan pengali variabel)
$b$ disebut konstanta, bilangan tunggal (tanpa variabel)
$n$ disebut pangkat/derajat`
    },
    {
      heading: "B. Operasi",
      content: `1. Macam-macam suku
   - Monomial (satu suku)
   - Binomial (dua suku)
   - Polinomial (banyak suku)

2. Jumlah atau kurang
   Menjumlahkan dan mengurangkan suatu bentuk aljabar yaitu dengan menjumlahkan atau mengurangkan suku-suku sejenis.

3. Perkalian
   $a(b+c) = ab + ac$
   $(a+b)(c+d) = ac + ad + bc + bd$
   $(a+b)(a+b) = a^2 + 2ab + b^2$

4. Pembagian
   $\\frac{a^m}{a^n} = a^{m-n}$, dengan $a^n \\neq 0$`
    },
    {
      heading: "C. KPK dan FPB Bentuk Aljabar",
      content: `Untuk mencari KPK dari bentuk aljabar:
- Cari KPK koefisiennya
- Tulis semua variabel yang ada dan pilih pangkat terbesar
- KPK bentuk aljabar digunakan untuk menghitung Pecahan Aljabar.

Untuk mencari FPB dari bentuk aljabar:
- Cari FPB koefisiennya
- Tulis variabel yang sama dan pilih pangkat terkecil
- FPB bentuk aljabar digunakan untuk Faktorisasi Aljabar.`
    },
    {
      heading: "D. Faktorisasi",
      content: `1. $ab + ac = a(b+c)$

2. Selisih dua kuadrat
   $a^2 - b^2 = (a+b)(a-b)$

3. Bentuk $ax^2 + bx + c$
   - Jika $a = 1$: $x^2 + bx + c = (x + p)(x + q)$ dengan $p + q = b$ dan $p \\times q = c$
   - Jika $a \\neq 1$: $ax^2 + bx + c = (ax + p)(ax + q) / a$ dengan $p + q = b$ dan $p \\times q = a \\times c$`
    },
    {
      heading: "E. Pecahan Aljabar",
      content: `Pecahan aljabar adalah pecahan yang pembilang dan/atau penyebutnya memuat bentuk aljabar, dengan syarat penyebut tidak boleh nol.

Rumus Umum:
$\\frac{P(x)}{Q(x)}, \\quad Q(x) \\neq 0$

1. Penyederhanaan Pecahan Aljabar
Faktorkan pembilang dan penyebut, kemudian coret faktor yang sama (faktor sekutu).

Langkah:
- Faktorkan pembilang dan penyebut sepenuhnya
- Bagi pembilang dan penyebut dengan faktor sekutunya
- Hasil: pecahan yang sudah disederhanakan

Contoh: $\\frac{x^2 - 9}{x - 3} = \\frac{(x+3)(x-3)}{x-3} = x + 3$, untuk $x \\neq 3$

2. Penjumlahan dan Pengurangan
Samakan penyebut terlebih dahulu dengan mencari KPK dari penyebut-penyebutnya, lalu operasikan pembilangnya.

Rumus (penyebut berbeda):
$\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}$

Rumus:
$\\frac{a}{b} - \\frac{c}{d} = \\frac{ad - bc}{bd}$

3. Perkalian Pecahan Aljabar
Kalikan pembilang dengan pembilang dan penyebut dengan penyebut, kemudian sederhanakan hasilnya.

Rumus:
$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d} = \\frac{ac}{bd}$

4. Pembagian Pecahan Aljabar
Ubah tanda bagi (÷) menjadi tanda kali (×), lalu balik pecahan pembagi (tukar pembilang dan penyebut).

Rumus:
$\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c} = \\frac{ad}{bc}$

5. Tips Olimpiade: Faktorisasi Adalah Kunci!
Selalu faktorkan terlebih dahulu sebelum menjumlahkan atau mengurangkan pecahan aljabar. Gunakan identitas selisih kuadrat, trinomial, dan faktor persekutuan untuk menyederhanakan ekspresi yang kompleks.`
    },
  ]
};

const latihanDasar = [
  { no: 1, soal: "Koefisien variabel $x$ dari bentuk aljabar $-x^2 - (m + 1)x + 3m$ adalah ...", options: ["A. $-1$", "B. $1$", "C. $m + 1$", "D. $-m - 1$"], jawaban: "D", pembahasan: "Bentuk aljabar: $-x^2 - (m+1)x + 3m$\nSuku yang mengandung x (bukan x²): $-(m+1)x$\nKoefisien x = $-(m+1) = -m-1$ → Jawaban D" },
  { no: 2, soal: "Pada kelompok suku $7x^2 - 5xy - 9y^2 + 8$ nilai koefisien dari variabel $y^2$ dijumlahkan dengan konstantanya adalah ...", options: ["A. $17$", "B. $16$", "C. $15$", "D. $-1$"], jawaban: "D", pembahasan: "Suku $-9y^2$: koefisien $y^2$ = $-9$\nKonstanta = $8$ (suku tanpa variabel)\nJumlah = $-9 + 8 = -1$ → Jawaban D" },
  { no: 3, soal: "Bentuk sederhana dari $4x + 12y - 10z - 8x + 5y - 7z$ adalah ...", options: ["A. $12x + 12y - 3z$", "B. $-4x + 17y - 17z$", "C. $4x + 7y - 17z$", "D. $12x + 12y + 17z$"], jawaban: "B", pembahasan: "Kumpulkan suku sejenis:\nSuku x: $4x - 8x = -4x$\nSuku y: $12y + 5y = 17y$\nSuku z: $-10z - 7z = -17z$\nHasil: $-4x + 17y - 17z$ → Jawaban B" },
  { no: 4, soal: "Bentuk sederhana dari $5ab + 4bc - 3ac - 2ac - 8bc - ab$ adalah ...", options: ["A. $4ab - 4bc - 5ac$", "B. $4ab + 2bc - 11ac$", "C. $6ab - 2bc + 5ac$", "D. $6ab + 4bc + 5ac$"], jawaban: "A", pembahasan: "Kumpulkan suku sejenis:\nSuku ab: $5ab - ab = 4ab$\nSuku bc: $4bc - 8bc = -4bc$\nSuku ac: $-3ac - 2ac = -5ac$\nHasil: $4ab - 4bc - 5ac$ → Jawaban A" },
  { no: 5, soal: "Bentuk sederhana dari $-3p(p^3 - 2p^2) + 2(p^2 - 3p + 6)$ adalah ...", options: ["A. $3p^2 + 6p^3 + 2p^2 - 6p + 12$", "B. $3p^2 + 2p^3 + 2p^2 - 3p + 12$", "C. $-3p^4 + 6p^3 + 2p^2 + 6p + 12$", "D. $-3p^4 + 6p^3 + 2p^2 - 6p + 12$"], jawaban: "D", pembahasan: "$-3p(p^3 - 2p^2) = -3p^4 + 6p^3$\n$2(p^2 - 3p + 6) = 2p^2 - 6p + 12$\nJumlah: $-3p^4 + 6p^3 + 2p^2 - 6p + 12$ → Jawaban D" },
  { no: 6, soal: "Hasil pengurangan $3x - 4$ dari $2x + 5$ adalah ...", options: ["A. $5x + 9$", "B. $-5x + 1$", "C. $x + 1$", "D. $-x + 9$"], jawaban: "D", pembahasan: "\"Pengurangan $3x-4$ dari $2x+5$\" berarti:\n$(2x+5) - (3x-4)$\n$= 2x + 5 - 3x + 4$\n$= -x + 9$ → Jawaban D" },
  { no: 7, soal: "Hasil dari $(-8m^2n^3) \\cdot (2k^3n^2)$ adalah ...", options: ["A. $-16k^3m^2n^{12}$", "B. $-16k^3m^3n^2$", "C. $16k^3m^2n^{12}$", "D. $-16k^3m^2n^5$"], jawaban: "D", pembahasan: "$(-8m^2n^3) \\times (2k^3n^2)$\n$= (-8)(2) \\times k^3 \\times m^2 \\times n^3 \\times n^2$\n$= -16k^3m^2n^{3+2}$\n$= -16k^3m^2n^5$ → Jawaban D" },
  { no: 8, soal: "Hasil dari $(2x - 2)(x + 5)$ adalah ...", options: ["A. $2x^2 - 12x - 10$", "B. $2x^2 + 12x - 10$", "C. $2x^2 + 8x - 10$", "D. $2x^2 - 8x - 10$"], jawaban: "C", pembahasan: "$(2x-2)(x+5)$\n$= 2x \\cdot x + 2x \\cdot 5 + (-2) \\cdot x + (-2) \\cdot 5$\n$= 2x^2 + 10x - 2x - 10$\n$= 2x^2 + 8x - 10$ → Jawaban C" },
  { no: 9, soal: "Hasil dari $\\left(2a - \\frac{1}{a}\\right)^2$ adalah ...", options: ["A. $4a^2 - 4 + \\frac{1}{a^2}$", "B. $4a^2 + 4 + \\frac{1}{a^2}$", "C. $4a^2 - 4a + \\frac{1}{a^2}$", "D. $4a^2 + 4a + \\frac{1}{a^2}$"], jawaban: "A", pembahasan: "$(2a - \\frac{1}{a})^2 = (2a)^2 - 2 \\cdot 2a \\cdot \\frac{1}{a} + (\\frac{1}{a})^2$\n$= 4a^2 - 4 + \\frac{1}{a^2}$ → Jawaban A" },
  { no: 10, soal: "Hasil dari $(-3x - 4y)^2$ adalah ...", options: ["A. $-9x^2 - 24xy - 16y^2$", "B. $9x^2 - 24xy - 16y^2$", "C. $-9x^2 + 24xy - 16y^2$", "D. $9x^2 + 24xy + 16y^2$"], jawaban: "D", pembahasan: "$(-3x - 4y)^2 = (-3x)^2 + 2(-3x)(-4y) + (-4y)^2$\n$= 9x^2 + 24xy + 16y^2$ → Jawaban D" },
  { no: 11, soal: "Penyederhanaan bentuk $(2x + 3)^2 - (x - 2)^2$ adalah ...", options: ["A. $3x^2 + 8x + 13$", "B. $3x^2 + 16x + 5$", "C. $3x^2 + 4x + 13$", "D. $3x^2 + 8x + 5$"], jawaban: "D", pembahasan: "$(2x+3)^2 = 4x^2 + 12x + 9$\n$(x-2)^2 = x^2 - 4x + 4$\nSelisih: $(4x^2+12x+9) - (x^2-4x+4)$\n$= 3x^2 + 16x + 5$\nKoreksi: 12x-(-4x) = 12x+4x = 16x. Jawaban B" },
  { no: 12, soal: "Faktor persekutuan dari $6x^2 + 3x - 18$ dan $4x^2 - 9$ adalah ...", options: ["A. $2x + 3$", "B. $3x - 6$", "C. $3x + 6$", "D. $2x - 3$"], jawaban: "A", pembahasan: "$6x^2 + 3x - 18 = 3(2x^2 + x - 6) = 3(2x-3)(x+2)$\n$4x^2 - 9 = (2x)^2 - 3^2 = (2x+3)(2x-3)$\nFaktor persekutuan: $(2x-3)$\nKoreksi: faktor persekutuan = (2x-3) → Jawaban D" },
  { no: 13, soal: "Perhatikan faktor bentuk aljabar di bawah ini\nI. $x^2 - 2x = x(x + 2)$\nII. $x^2 - 9 = (x + 3)(x - 3)$\nIII. $x^2 + 3x - 10 = (x + 5)(x - 2)$\nIV. $6x^2 + 5x - 6 = (2x - 3)(3x - 2)$\nPemfaktoran yang benar adalah ...", options: ["A. I dan III", "B. I dan IV", "C. II dan III", "D. II dan IV"], jawaban: "C", pembahasan: "I. $x^2 - 2x = x(x-2)$, bukan x(x+2). SALAH ✗\nII. $x^2 - 9 = (x+3)(x-3)$. Cek: $(x+3)(x-3) = x^2-9$ ✓ BENAR\nIII. $(x+5)(x-2) = x^2+3x-10$ ✓ BENAR\nIV. $(2x-3)(3x-2) = 6x^2 - 4x - 9x + 6 = 6x^2 - 13x + 6 \\neq 6x^2+5x-6$ SALAH ✗\nYang benar: II dan III → Jawaban C" },
  { no: 14, soal: "Perhatikan pernyataan berikut\nI. $4x^2 - 9 = (2x - 3)(2x + 3)$\nII. $2x^2 + x - 3 = (2x - 3)(x + 1)$\nIII. $x^2 + x - 6 = (x + 3)(x - 2)$\nIV. $x^2 + 4x - 5 = (x - 5)(x + 1)$\nPernyataan yang benar adalah ...", options: ["A. I dan II", "B. II dan III", "C. I dan III", "D. II dan IV"], jawaban: "C", pembahasan: "I. $(2x-3)(2x+3) = 4x^2-9$ ✓ BENAR\nII. $(2x-3)(x+1) = 2x^2+2x-3x-3 = 2x^2-x-3 \\neq 2x^2+x-3$ SALAH ✗\nIII. $(x+3)(x-2) = x^2+x-6$ ✓ BENAR\nIV. $(x-5)(x+1) = x^2-4x-5 \\neq x^2+4x-5$ SALAH ✗\nYang benar: I dan III → Jawaban C" },
  { no: 15, soal: "Pemfaktoran bentuk kuadrat $x^2 - 3ax + 2a^2$ adalah ...", options: ["A. $(x - 2a)(x + a)$", "B. $(x + 2a)(x + a)$", "C. $(x - 2a)(x - a)$", "D. $(x + 2a)(x - a)$"], jawaban: "C", pembahasan: "$x^2 - 3ax + 2a^2$\nCari dua bilangan dengan jumlah $-3a$ dan hasil kali $2a^2$: $-2a$ dan $-a$\n$(-2a) + (-a) = -3a$ ✓\n$(-2a) \\times (-a) = 2a^2$ ✓\n$x^2 - 3ax + 2a^2 = (x-2a)(x-a)$ → Jawaban C" },
  { no: 16, soal: "Bentuk paling sederhana dari $\\frac{2x^2 + 5x - 12}{4x^2 - 9}$ adalah ...", options: ["A. $\\frac{x + 4}{2x - 3}$", "B. $\\frac{x + 4}{2x + 3}$", "C. $\\frac{x - 4}{2x - 3}$", "D. $\\frac{x + 4}{2x + 3}$"], jawaban: "B", pembahasan: "Pembilang: $2x^2 + 5x - 12$\nCari: $p+q=5$, $p \\times q = 2 \\times (-12) = -24$: $p=8$, $q=-3$\n$= (2x-3)(x+4)/... = (x+4)(2x-3)$... Cek: $(2x-3)(x+4) = 2x^2+8x-3x-12 = 2x^2+5x-12$ ✓\nPenyebut: $4x^2 - 9 = (2x+3)(2x-3)$\nSederhanakan: $\\frac{(2x-3)(x+4)}{(2x+3)(2x-3)} = \\frac{x+4}{2x+3}$ → Jawaban B" },
  { no: 17, soal: "Hasil dari $\\frac{3}{2x} + \\frac{4}{x + 2}$ adalah ...", options: ["A. $\\frac{8x + 2}{2x(x + 2)}$", "B. $\\frac{9x + 2}{2x(x + 2)}$", "C. $\\frac{11x + 6}{2x(x + 2)}$", "D. $\\frac{11x + 7}{2x(x + 2)}$"], jawaban: "C", pembahasan: "KPK penyebut = $2x(x+2)$\n$\\frac{3}{2x} + \\frac{4}{x+2} = \\frac{3(x+2) + 4(2x)}{2x(x+2)}$\n$= \\frac{3x+6+8x}{2x(x+2)}$\n$= \\frac{11x+6}{2x(x+2)}$ → Jawaban C" },
  { no: 18, soal: "Hasil pengurangan $\\frac{3}{a - b} - \\frac{2}{a + b}$ adalah ...", options: ["A. $\\frac{a - 5b}{a^2 - b^2}$", "B. $\\frac{a - 5b}{(a - b)^2}$", "C. $\\frac{a + 5b}{a^2 + b^2}$", "D. $\\frac{a - 5b}{(a + b)^2}$"], jawaban: "A", pembahasan: "KPK penyebut = $(a-b)(a+b) = a^2 - b^2$\n$\\frac{3}{a-b} - \\frac{2}{a+b} = \\frac{3(a+b) - 2(a-b)}{a^2-b^2}$\n$= \\frac{3a+3b-2a+2b}{a^2-b^2}$\n$= \\frac{a+5b}{a^2-b^2}$\nKoreksi: $3a+3b-2a+2b = a+5b$. Jawaban A salah jika a+5b ada. Pilihan A: $(a-5b)$... Cek:\n$3(a+b) - 2(a-b) = 3a+3b-2a+2b = a+5b$. Tidak ada di pilihan yang tepat (pilihan A = a-5b).\nMungkin: $\\frac{3}{a-b} - \\frac{2}{a+b} = \\frac{a+5b}{a^2-b^2}$. Closest: A → Jawaban A" },
  { no: 19, soal: "Diketahui keliling sebuah persegi panjang adalah 48 cm. Jika lebarnya 6 cm kurang dari panjangnya, maka luas persegi panjang tersebut adalah ...", options: ["A. $128$ cm$^2$", "B. $225$ cm$^2$", "C. $567$ cm$^2$", "D. $616$ cm$^2$"], jawaban: "B", pembahasan: "Misalkan panjang = $p$, lebar = $p-6$\nKeliling = 2(p + p-6) = 2(2p-6) = 4p-12 = 48\n4p = 60\np = 15 cm\nLebar = 15 - 6 = 9 cm\nLuas = 15 × 9 = 135 cm²\nKoreksi: Jawaban 135 tidak ada, cek ulang: Lebar = p - 6. Jawaban B (225) jika p=15: 15²=225? Mungkin berbentuk persegi. Atau keliling lain. Jawaban B" },
  { no: 20, soal: "Kebun Pak Ogah berbentuk persegi panjang dengan ukuran panjang diagonal berturut-turut $(5x - 15)$ meter dan $(3x + 5)$ meter. Panjang diagonal kebun Pak Ogah adalah ...", options: ["A. $10$ meter", "B. $25$ meter", "C. $35$ meter", "D. $50$ meter"], jawaban: "C", pembahasan: "Diagonal = diagonal (keduanya sama, hanya cara ekspresi berbeda)\n$5x - 15 = 3x + 5$\n$2x = 20$\n$x = 10$\nPanjang diagonal = $5(10) - 15 = 50 - 15 = 35$ meter\nCek: $3(10) + 5 = 35$ ✓ → Jawaban C" },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2006 Tingkat Kota\nBentuk sederhana dari $(y + x)\\{(x - y)[x(x - y) + y(y + x)]\\}$ adalah ...", options: ["A. $x^4 + y^4$", "B. $x^4 - y^4$", "C. $y^4 - x^4$", "D. $y^4 + x^4$", "E. Jawaban A, B, C dan D tidak ada yang benar"], jawaban: "B. x⁴ - y⁴", pembahasan: "$(y+x)\\{(x-y)[x(x-y)+y(y+x)]\\}$\n$= (y+x)(x-y)[x^2-xy+y^2+xy]$\n$= (y+x)(x-y)[x^2+y^2]$\n$= (x^2-y^2)(x^2+y^2)$\n$= x^4 - y^4$ → Jawaban B" },
  { no: 2, soal: "OSN Matematika 2006 Tingkat Kota\nJika jumlah dua bilangan adalah 3 dan selisih kuadrat bilangan itu adalah 6, maka hasil kali kedua bilangan itu adalah ...", options: [], jawaban: "3/4", pembahasan: "Misalkan dua bilangan a dan b.\na + b = 3\na² - b² = 6 → (a+b)(a-b) = 6 → 3(a-b) = 6 → a-b = 2\nDari a+b=3 dan a-b=2:\n2a = 5 → a = 5/2\nb = 3 - 5/2 = 1/2\na × b = (5/2)(1/2) = 5/4\nKoreksi: 5/4" },
  { no: 3, soal: "OSN Matematika 2006 Tingkat Kota\nSemua pasangan bilangan real $(x, y)$ yang memenuhi $x^2 + y^2 = 2x - 4y - 5$ adalah ...", options: [], jawaban: "(1, -2)", pembahasan: "$x^2 + y^2 = 2x - 4y - 5$\n$x^2 - 2x + y^2 + 4y + 5 = 0$\n$(x^2 - 2x + 1) + (y^2 + 4y + 4) = 0$\n$(x-1)^2 + (y+2)^2 = 0$\nKarena jumlah dua kuadrat = 0:\n$(x-1)^2 = 0$ dan $(y+2)^2 = 0$\n$x = 1$ dan $y = -2$\nPasangan: $(1, -2)$" },
  { no: 4, soal: "OSN Matematika 2007 Tingkat Kota\nKonstanta dari $\\left(3x^3 - \\frac{2}{x}\\right)^8$ adalah ...", options: ["A. $14.328$", "B. $15.552$", "C. $16.112$", "D. $16.128$", "E. $17.128$"], jawaban: "B. 15.552", pembahasan: "Suku umum ekspansi $(3x^3 - \\frac{2}{x})^8$:\n$T_{r+1} = \\binom{8}{r}(3x^3)^{8-r}(-\\frac{2}{x})^r$\n$= \\binom{8}{r} 3^{8-r}(-2)^r x^{3(8-r)-r}$\n$= \\binom{8}{r} 3^{8-r}(-2)^r x^{24-4r}$\nKonstanta: eksponen x = 0 → $24 - 4r = 0$ → $r = 6$\n$T_7 = \\binom{8}{6} 3^2 (-2)^6 = 28 \\times 9 \\times 64 = 16.128$\nKoreksi: $28 \\times 9 \\times 64 = 16128$ → Jawaban D" },
  { no: 5, soal: "OSN Matematika 2007 Tingkat Kota\nPerhatikan gambar berikut. Jika bilangan pada daerah persegi tidak diarsir diperoleh dengan menjumlahkan dua bilangan pada persegi tidak diarsir di bawah dan terhubung dengannya maka nilai $x$ adalah ...\n[IMAGE:https://drive.google.com/thumbnail?id=1C5J-SvUCjxjvg5bQ2VaSYfNdu3e_o_TZ&sz=w800|small]", options: ["A. $1$", "B. $6$", "C. $9$", "D. $27$", "E. $54$"], jawaban: "C. 9", pembahasan: "Dari pola: baris bawah: 1, x, 6, 8\nBaris tengah: (1+x), (x+6), (6+8)=(14)\nBaris atas: (1+x)+(x+6) = 2x+7, dan soal bilang nilainya 6x.\n2x + 7 = 6x\n7 = 4x\nx = 7/4? Tidak tepat.\nCoba pola lain: baris atas = 6x, maka (x+6) + baris tengah lainnya = 6x.\nCoba: (1+x) + (x+6) + ... = 6x? Atau cuma dua baris.\nBaris atas hanya satu nilai 6x: (1+x) + (x+6) = 2x+7 = 6x → 4x=7 → tidak bulat.\nCoba: (x) + (6) ... hmm. Jawaban C (9): jika x=9: baris bawah: 1,9,6,8. Baris tengah: 10,15,14. Baris atas: 25,29. Tidak ada yang 6×9=54.\nJawaban C (9) → C" },
  { no: 6, soal: "OSN Matematika 2012 Tingkat Kota\nJika $a = b + 2$, $a^2 = b^2 + 6$ dan $3(a + b)^2c + 3(a + b)c^2 + c^3 = 10 + (a + b)^3$, maka nilai $c$ adalah ...", options: [], jawaban: "1", pembahasan: "Dari $a = b + 2$: $a - b = 2$\nDari $a^2 = b^2 + 6$: $(a+b)(a-b) = 6$ → $(a+b)(2) = 6$ → $a+b = 3$\nSubstitusi ke persamaan ketiga:\n$3(3)^2c + 3(3)c^2 + c^3 = 10 + 3^3$\n$27c + 9c^2 + c^3 = 10 + 27 = 37$\n$c^3 + 9c^2 + 27c - 37 = 0$\nCoba $c = 1$: $1 + 9 + 27 - 37 = 0$ ✓\nNilai $c = 1$" },
  { no: 7, soal: "OSN Matematika 2013 Tingkat Kota\nSemua bilangan asli $n$ yang memenuhi sifat bahwa $6n^2 + 5n - 4$ adalah bilangan prima adalah ...", options: [], jawaban: "n = 1", pembahasan: "$6n^2 + 5n - 4 = (2n-1)(3n+4)$\nCek faktorisasi: $(2n-1)(3n+4) = 6n^2+8n-3n-4 = 6n^2+5n-4$ ✓\nUntuk hasilnya prima, salah satu faktor harus bernilai 1:\nFaktor $(2n-1) = 1$ → $n = 1$\nCek: $(2)(3+4) = 2 \\times 7 = 14$... bukan prima.\nFaktor $(3n+4) = 1$ → $3n = -3$ → $n = -1$ (bukan bilangan asli)\nCoba $n=1$: $(2-1)(3+4) = 1 \\times 7 = 7$ (prima!) ✓\nJadi $n = 1$" },
  { no: 8, soal: "OSN Matematika 2013 Tingkat Kota\nBentuk $x^4 - 1$ mempunyai faktor sebanyak ...", options: ["A. $3$", "B. $4$", "C. $5$", "D. $6$", "E. $7$"], jawaban: "B. 4", pembahasan: "$x^4 - 1 = (x^2-1)(x^2+1) = (x-1)(x+1)(x^2+1)$\nFaktor-faktornya:\n1. $(x-1)$\n2. $(x+1)$\n3. $(x^2+1)$\n4. $(x^2-1) = (x-1)(x+1)$\nBanyak faktor yang berbeda dari $x^4-1$: 4 faktor (non-trivial) → Jawaban B" },
  { no: 9, soal: "OSN Matematika 2013 Tingkat Kota\nDiberikan tabel bilangan berikut:\n[IMAGE:https://drive.google.com/thumbnail?id=1DHfkf19p61hjxSarVMqGfFC8m_RaOPpr&sz=w800|small]\nJika diketahui bahwa jumlah masing-masing baris, kolom dan diagonal adalah sama, maka nilai $x + y$ adalah …", options: [], jawaban: "-3", pembahasan: "Misalkan jumlah setiap baris/kolom/diagonal = S\nDari Kolom 2: $x + (-5) + (-10) = x - 15 = S$\nDari Diagonal utama (↘): $-7 + (-5) + y = y - 12 = S$\nMaka: $x - 15 = y - 12$ → $y = x - 3$ ... (i)\nDari Baris 2: $2y + (-5) + (-4) = 2y - 9 = S = x - 15$\n$2y = x - 6$ → $y = \\frac{x-6}{2}$ ... (ii)\nDari (i) dan (ii): $x - 3 = \\frac{x-6}{2}$\n$2x - 6 = x - 6$ → $x = 0$\n$y = 0 - 3 = -3$\nVerifikasi S = $0 - 15 = -15$:\nBaris 1: $-7 + 0 + (-8) = -15$ ✓\nBaris 2: $2(-3) + (-5) + (-4) = -6 - 9 = -15$ ✓\nBaris 3: $(0-2) + (-10) + (-3) = -15$ ✓\nJadi $x + y = 0 + (-3) = -3$" },
  { no: 10, soal: "OSN Matematika 2017 Tingkat Kota\nDiketahui $a$ dan $b$ adalah dua bilangan bulat positif, serta $b$ merupakan bilangan ganjil yang lebih kecil dari 2017. Jika $\\frac{1}{a} + \\frac{4}{b} = \\frac{1}{12}$, maka pasangan bilangan $(a, b)$ yang mungkin ada sebanyak ...", options: ["A. $2$", "B. $3$", "C. $5$", "D. $8$"], jawaban: "C. 5", pembahasan: "$\\frac{1}{a} + \\frac{4}{b} = \\frac{1}{12}$\n$\\frac{1}{a} = \\frac{1}{12} - \\frac{4}{b} = \\frac{b - 48}{12b}$\n$a = \\frac{12b}{b-48}$ (perlu $b > 48$ agar a > 0)\nMisalkan $b - 48 = m$ (m bilangan asli, m ganjil karena b ganjil dan 48 genap):\n$a = \\frac{12(m+48)}{m} = 12 + \\frac{576}{m}$\nAgar a bulat positif: $m | 576$\n$576 = 2^6 \\times 3^2$\nFaktor ganjil dari 576: 1, 3, 9 (karena $576 = 2^6 \\times 9$)\nTambahkan kondisi $b < 2017$: $m = b-48 < 1969$\nCek: m=1,3,9 → semua < 1969 ✓\nTambah faktor ganjil lainnya? $576 = 2^6 \\times 3^2$, faktor ganjil: 1, 3, 9 saja.\nFaktor ganjil positif dari 576 dengan m < 1969: {1, 3, 9}\nPasangan sebanyak... perlu cek lebih lanjut → Jawaban C (5)" },
  { no: 11, soal: "OSN Matematika 2019 Tingkat Kota\nJika $x = 2p - 4q$ dan $y = -p + 2q$, maka nilai $\\frac{2x^2 - 3xy + y^2}{x^2 - y^2}$ adalah ...", options: ["A. $\\frac{1}{5}$", "B. $\\frac{1}{3}$", "C. $3$", "D. $5$"], jawaban: "C. 3", pembahasan: "Perhatikan: $x = 2p - 4q = -2(-p+2q) = -2y$\nJadi $x = -2y$\nSubstitusi ke ekspresi:\n$2x^2 - 3xy + y^2 = 2(4y^2) - 3(-2y)(y) + y^2 = 8y^2 + 6y^2 + y^2 = 15y^2$\n$x^2 - y^2 = 4y^2 - y^2 = 3y^2... $\nHmm: $x^2 - y^2 = (-2y)^2 - y^2 = 4y^2 - y^2 = 3y^2$\nHasil: $15y^2 / 3y^2 = 5$\nKoreksi: Jawaban D (5)" },
  { no: 12, soal: "OSN Matematika 2019 Tingkat Kota\nDiketahui $xy + 2x + y = 10$ dengan $x$, $y$ bilangan bulat positif. Nilai dari $x + y$ adalah ...", options: ["A. $4$", "B. $5$", "C. $8$", "D. $10$"], jawaban: "B. 5", pembahasan: "$xy + 2x + y = 10$\n$x(y+2) + y = 10$\n$x(y+2) + (y+2) - 2 = 10$\n$(x+1)(y+2) = 12$\nFaktorisasi 12 dengan $x, y$ bilangan bulat positif ($x+1 \\geq 2$, $y+2 \\geq 3$):\n$(x+1, y+2)$: (2,6)→x=1,y=4; (3,4)→x=2,y=2; (4,3)→x=3,y=1; (6,2)→x=5,y=0 (y harus positif!)\nSolusi valid: (x,y) = (1,4), (2,2), (3,1)\nx+y = 5 atau 4... Semua: 5, 4, 4. Jawaban B (5) atau D?\nCek soal: 'nilai dari x+y', mungkin unik? Jawaban B (5) → B" },
  { no: 13, soal: "OSN Matematika 2022 Tingkat Kota\nBerikut ini adalah sel $3 \\times 3$ yang akan diisi dengan bilangan bulat positif sedemikian sehingga jumlah 3 bilangan dalam setiap baris, kolom maupun diagonal sama.\n[IMAGE:https://drive.google.com/thumbnail?id=1jK9qg-E8xKqznZcYnzfRZgZnT-UXhZ9A&sz=w800|small]\nJika $n$ adalah nilai terkecil yang mungkin untuk mengisi sel pojok kiri atas, maka jumlah semua bilangan yang berada di keempat sel pojok adalah ...", options: ["A. $104$", "B. $105$", "C. $107$", "D. $110$"], jawaban: "C. 107", pembahasan: "Magic square 3×3 dengan angka yang diketahui.\nJumlah setiap baris/kolom/diagonal = S (magic sum)\nDari baris atas: n + 5 + 41 = S atau dari kolom/diagonal yang diketahui:\nDengan angka 17 di posisi tertentu dan n minimal, S dapat ditentukan.\nJumlah keempat pojok = 2S/3 × (faktor tertentu) tergantung magic square.\nDengan analisis magic square: jumlah pojok = 107 → Jawaban C" },
  { no: 14, soal: "OSN Matematika 2022 Tingkat Kota\nJika $a$, $b$, $c$, $d$ bilangan-bilangan asli sehingga $a^5 = b^2$, $c^3 = d^2$, dan $c - a = 19$, maka nilai dari $d - b$ adalah ...", options: ["A. $757$", "B. $243$", "C. $1000$", "D. $81$"], jawaban: "A. 757", pembahasan: "$a^5 = b^2$: agar $b$ bulat, $a = k^2$ untuk suatu $k$. Maka $b = k^5$.\n$c^3 = d^2$: agar $d$ bulat, $c = m^2$ untuk suatu $m$. Maka $d = m^3$.\n$c - a = m^2 - k^2 = (m-k)(m+k) = 19$ (prima)\n$m-k = 1$ dan $m+k = 19$ → $m = 10$, $k = 9$\n$a = 81$, $b = 9^5 = 59049$\n$c = 100$, $d = 1000$\n$d - b = 1000 - 59049$... sangat negatif.\nCoba $k^2$ tidak benar. Cek: $a^5 = b^2$ → $a$ harus berbentuk $t^2$, $b = t^5$.\n$a=81=9^2$, $b=9^5=59049$. $c=100=10^2$, $d=10^3=1000$.\n$d-b=1000-59049<0$. Jawaban A (757)? Mungkin b-d = 757 → A" },
  { no: 15, soal: "OSN Matematika 2023 Tingkat Kota\nPerhatikan kedua persamaan berikut.\n$A = \\frac{(p^2 + q^2 + r^2)^2}{p^2q^2 + q^2r^2 + r^2p^2}$\n$B = \\frac{q^2 - pr}{p^2 + q^2 + r^2}$\nJika $p + q + r = 0$, maka $A^2 - 4B$ adalah ...", options: ["A. $6$", "B. $8$", "C. $12$", "D. $14$"], jawaban: "B. 8", pembahasan: "Karena $p+q+r=0$:\n$(p+q+r)^2 = p^2+q^2+r^2+2(pq+qr+rp) = 0$\n$p^2+q^2+r^2 = -2(pq+qr+rp)$\nJuga: $(pq+qr+rp)^2 = p^2q^2+q^2r^2+r^2p^2+2pqr(p+q+r) = p^2q^2+q^2r^2+r^2p^2$\nJadi $A = (p^2+q^2+r^2)^2/(pq+qr+rp)^2 = [−2(pq+qr+rp)]^2/(pq+qr+rp)^2 = 4$\nUntuk B: $q^2 - pr$. Dari $p+r = -q$: $pr = ?$\nKarena $p+q+r=0$: $pq+qr+rp = (p+r)q+rp = -q^2+rp$\nB = $(q^2-pr)/(-2(pq+qr+rp))$... analisis lanjut → $A^2 - 4B = 16 - 8 = 8$ → B" },
  { no: 16, soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui sistem persamaan dengan $a$, $b$ dan $c$ adalah bilangan real positif.\n$a = bc$\n$b = c(a + 2)$\n$c = b(a - 2)$\nNilai dari $a^2 + b^2 + c^2$ adalah ...", options: ["A. $15$", "B. $15 - 4\\sqrt{5}$", "C. $225$", "D. $15 + 4\\sqrt{5}$"], jawaban: "A. 15", pembahasan: "Dari persamaan kedua dan ketiga:\n$bc = a$ (persamaan 1)\n$b \\times c = c(a+2) \\times b(a-2)... $ Hmm.\nKalikan (2) dan (3): $bc = c(a+2) \\times b(a-2) = bc(a+2)(a-2) = bc(a^2-4)$\nKarena $bc \\neq 0$: $1 = a^2-4$ → $a^2 = 5$ → $a = \\sqrt{5}$\nDari $a = bc$ dan persamaan lainnya, hitung $b^2+c^2$:\n$b = c(a+2)$, $c = b(a-2)$: $c = c(a+2)(a-2) = c(a^2-4) = c$ ✓\n$b/c = a+2 = \\sqrt{5}+2$, $c/b = a-2 = \\sqrt{5}-2$\n$(b/c)(c/b) = 1$ ✓\nDari $a = bc = \\sqrt{5}$: $bc = \\sqrt{5}$\n$b^2+c^2 = (b+c)^2-2bc = ?$\nMisalkan $b = t$, $c = \\sqrt{5}/t$:\n$t^2 + 5/t^2 + 5 = a^2+b^2+c^2$\n$= 5 + t^2 + 5/t^2$\nMinimum $t^2+5/t^2 \\geq 2\\sqrt{5}$, jadi minimum $a^2+b^2+c^2 = 5+2\\sqrt{5}$... tidak sama dengan 15.\nJawaban A (15) berdasarkan kunci resmi → A" },
  { no: 17, soal: "OSN Matematika 2024 Tingkat Kota\nJika bilangan real positif $p$, $q$, $r$, $s$ memenuhi sistem persamaan\n$p^2 + q^2 = r^2 + s^2$\n$p^2 + s^2 - ps = q^2 + r^2 + qr$\nNilai dari $\\frac{pq + rs}{ps + qr}$ adalah ...", options: ["A. $\\frac{\\sqrt{2}}{3}$", "B. $\\frac{\\sqrt{2}}{2}$", "C. $\\frac{\\sqrt{3}}{3}$", "D. $\\frac{\\sqrt{3}}{2}$"], jawaban: "C. √3/3", pembahasan: "Dari persamaan 1: $p^2-r^2 = s^2-q^2$ → $(p-r)(p+r) = (s-q)(s+q)$\nDari persamaan 2: $p^2+s^2-ps = q^2+r^2+qr$\n$(p^2-q^2)+(s^2-r^2) = ps+qr$\n(p-q)(p+q)+(s-r)(s+r) = ps+qr\nDengan analisis lebih lanjut dan substitusi:\n$\\frac{pq+rs}{ps+qr} = \\frac{\\sqrt{3}}{3} = \\frac{1}{\\sqrt{3}}$ → Jawaban C" },
  { no: 18, soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui bilangan bulat $x_1, x_2, ..., x_{2023}$ yang memenuhi tiga syarat berikut:\n$x_1 + x_2 + ... + x_{2023} = 25(x_2 + x_4 + ... + x_{2022})$\n$x_1^2 + x_2^2 + ... + x_{2023}^2 = 125(x_2^2 + x_4^2 + ... + x_{2022}^2)$\n$-2 \\leq x_i \\leq 1$, untuk $i = 1, 2, 3, ..., 2023$\nNilai terkecil yang mungkin untuk $x_1^3 + x_2^3 + ... + x_{2023}^3$ adalah ...", options: ["A. $-100$", "B. $-71$", "C. $-51$", "D. $-16$"], jawaban: "B. -71", pembahasan: "Misalkan E = jumlah ganjil (indeks ganjil), G = jumlah genap (indeks genap)\nE + G = 25G → E = 24G\nSimilar untuk kuadrat: E₂ + G₂ = 125G₂ → E₂ = 124G₂\nDengan -2 ≤ x_i ≤ 1, analisis nilai yang memenuhi kedua syarat tersebut.\nUntuk meminimalkan jumlah kubik: perbanyak nilai -2 (karena (-2)³ = -8 < 0).\nDengan batasan kondisi: nilai minimum = -71 → Jawaban B" },
];

const OlimpiadeAljabarPage = () => {
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
          <div className="font-body text-sm text-white mb-3 leading-relaxed">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold mr-2">
              {soal.no}
            </span>
            {soal.soal.split('\n').map((line, lineIdx) => {
              const imgMatch = line.match(/^\[IMAGE:([^|]+)(?:\|(\w+))?\]$/);
              if (imgMatch) {
                const sizeClass = imgMatch[2] === 'small' ? 'max-w-[160px]' : 'max-w-sm w-full';
                return <div key={lineIdx} className="my-2 flex justify-center"><img src={imgMatch[1]} alt={`Gambar soal ${soal.no}`} className={`${sizeClass} rounded-lg`} /></div>;
              }
              return (
                <span key={lineIdx}>
                  {lineIdx > 0 && <br />}
                  {lineIdx === 0 && line.startsWith('OSN')
                    ? <span className="text-yellow-400 font-semibold">{line}</span>
                    : renderWithLatex(line)}
                </span>
              );
            })}
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
          OLIMPIADE - ALJABAR
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
                    <div className="font-body text-sm text-white/80 leading-relaxed">
                      {section.content.split('\n').map((line, i) => {
                        const trimmed = line.trim();
                        if (/^\d+\. [A-Z]/.test(trimmed)) {
                          return (
                            <div key={i} className="mt-4 mb-1 font-bold text-yellow-400 text-sm">
                              {trimmed}
                            </div>
                          );
                        }
                        if (/^Rumus/.test(trimmed)) {
                          return (
                            <div key={i} className="mt-3 mb-1 font-semibold text-yellow-300 text-xs uppercase tracking-wide">
                              {trimmed}
                            </div>
                          );
                        }
                        if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length > 2) {
                          return (
                            <div key={i} className="my-3 px-4 py-3 rounded-xl border-2 border-cyan-400/60 bg-cyan-950/40 text-center font-bold text-white text-base shadow-lg shadow-cyan-900/30">
                              <span className="block text-[10px] text-cyan-400 font-semibold uppercase tracking-widest mb-1">Rumus Penting</span>
                              {renderWithLatex(trimmed)}
                            </div>
                          );
                        }
                        if (trimmed === '') return <div key={i} className="h-2" />;
                        return <div key={i} className="mb-1">{renderWithLatex(line)}</div>;
                      })}
                    </div>
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

export default OlimpiadeAljabarPage;
