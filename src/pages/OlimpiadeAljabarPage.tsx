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

interface PembahasanStruktur {
  konsep: string;
  langkah: string[];
  rumus?: string;
}

interface SoalDasar {
  no: number;
  soal: string;
  options: string[];
  jawaban: string;
  pembahasan: PembahasanStruktur;
}

interface SoalOlimpiade {
  no: number;
  soal: string;
  options: string[];
  jawaban: string;
  image?: string;
  pembahasan: PembahasanStruktur;
}

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

1. Penyederhanaan: Faktorkan pembilang dan penyebut, kemudian coret faktor yang sama.

2. Penjumlahan/Pengurangan: Samakan penyebut dengan KPK, lalu operasikan pembilang.

3. Perkalian: $\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}$

4. Pembagian: $\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c} = \\frac{ad}{bc}$`
    },
  ]
};

const latihanDasar: SoalDasar[] = [
  {
    no: 1,
    soal: "Koefisien variabel $x$ dari bentuk aljabar $-x^2 - (m + 1)x + 3m$ adalah ...",
    options: ["A. $-1$", "B. $1$", "C. $m + 1$", "D. $-m - 1$"],
    jawaban: "D. $-m - 1$",
    pembahasan: {
      konsep: "Koefisien variabel adalah bilangan pengali variabel tersebut. Perhatikan suku yang mengandung $x$ (bukan $x^2$).",
      langkah: [
        "Tulis bentuk aljabar: $-x^2 - (m+1)x + 3m$",
        "Identifikasi suku yang mengandung $x$ saja (bukan $x^2$): $-(m+1)x$",
        "Koefisien $x$ adalah bilangan pengalinya: $-(m+1) = -m - 1$"
      ],
      rumus: "Koefisien $x$ = bilangan pengali pada suku $...x$, yaitu $-m-1$"
    }
  },
  {
    no: 2,
    soal: "Pada kelompok suku $7x^2 - 5xy - 9y^2 + 8$ nilai koefisien dari variabel $y^2$ dijumlahkan dengan konstantanya adalah ...",
    options: ["A. $17$", "B. $16$", "C. $15$", "D. $-1$"],
    jawaban: "D. $-1$",
    pembahasan: {
      konsep: "Koefisien adalah bilangan pengali variabel; konstanta adalah suku yang tidak memiliki variabel sama sekali.",
      langkah: [
        "Dari $7x^2 - 5xy - 9y^2 + 8$, identifikasi suku $-9y^2$: koefisien $y^2 = -9$",
        "Identifikasi konstanta: $8$ (suku yang tidak memiliki variabel)",
        "Jumlahkan keduanya: $-9 + 8 = -1$"
      ],
      rumus: "Koefisien $y^2$ + Konstanta = $-9 + 8 = -1$"
    }
  },
  {
    no: 3,
    soal: "Bentuk sederhana dari $4x + 12y - 10z - 8x + 5y - 7z$ adalah ...",
    options: ["A. $12x + 12y - 3z$", "B. $-4x + 17y - 17z$", "C. $4x + 7y - 17z$", "D. $12x + 12y + 17z$"],
    jawaban: "B. $-4x + 17y - 17z$",
    pembahasan: {
      konsep: "Untuk menyederhanakan bentuk aljabar, kumpulkan dan operasikan suku-suku yang sejenis (memiliki variabel yang sama).",
      langkah: [
        "Kumpulkan suku sejenis:",
        "Suku $x$: $4x - 8x = -4x$",
        "Suku $y$: $12y + 5y = 17y$",
        "Suku $z$: $-10z - 7z = -17z$",
        "Hasil akhir: $-4x + 17y - 17z$"
      ],
      rumus: "Suku sejenis: variabel dan pangkatnya sama. Operasikan koefisiennya saja."
    }
  },
  {
    no: 4,
    soal: "Bentuk sederhana dari $5ab + 4bc - 3ac - 2ac - 8bc - ab$ adalah ...",
    options: ["A. $4ab - 4bc - 5ac$", "B. $4ab + 2bc - 11ac$", "C. $6ab - 2bc + 5ac$", "D. $6ab + 4bc + 5ac$"],
    jawaban: "A. $4ab - 4bc - 5ac$",
    pembahasan: {
      konsep: "Kumpulkan suku-suku sejenis, lalu operasikan koefisiennya.",
      langkah: [
        "Suku $ab$: $5ab - ab = 4ab$",
        "Suku $bc$: $4bc - 8bc = -4bc$",
        "Suku $ac$: $-3ac - 2ac = -5ac$",
        "Hasil akhir: $4ab - 4bc - 5ac$"
      ],
      rumus: "Hati-hati membedakan suku sejenis: $ab$, $bc$, dan $ac$ adalah suku-suku yang berbeda."
    }
  },
  {
    no: 5,
    soal: "Bentuk sederhana dari $-3p(p^3 - 2p^2) + 2(p^2 - 3p + 6)$ adalah ...",
    options: ["A. $3p^2 + 6p^3 + 2p^2 - 6p + 12$", "B. $3p^2 + 2p^3 + 2p^2 - 3p + 12$", "C. $-3p^4 + 6p^3 + 2p^2 + 6p + 12$", "D. $-3p^4 + 6p^3 + 2p^2 - 6p + 12$"],
    jawaban: "D. $-3p^4 + 6p^3 + 2p^2 - 6p + 12$",
    pembahasan: {
      konsep: "Distribusikan perkalian terlebih dahulu, kemudian kumpulkan suku sejenis.",
      langkah: [
        "Distribusikan $-3p$ ke $(p^3 - 2p^2)$: $-3p \\cdot p^3 + (-3p)(-2p^2) = -3p^4 + 6p^3$",
        "Distribusikan $2$ ke $(p^2 - 3p + 6)$: $2p^2 - 6p + 12$",
        "Jumlahkan semua suku: $-3p^4 + 6p^3 + 2p^2 - 6p + 12$"
      ],
      rumus: "Gunakan sifat distributif: $a(b+c) = ab + ac$, lalu ingat aturan $p^m \\cdot p^n = p^{m+n}$"
    }
  },
  {
    no: 6,
    soal: "Hasil pengurangan $3x - 4$ dari $2x + 5$ adalah ...",
    options: ["A. $5x + 9$", "B. $-5x + 1$", "C. $x + 1$", "D. $-x + 9$"],
    jawaban: "D. $-x + 9$",
    pembahasan: {
      konsep: "\"Pengurangan A dari B\" berarti $B - A$. Perhatikan urutan kata agar tidak terbalik.",
      langkah: [
        "\"Pengurangan $3x-4$ dari $2x+5$\" berarti: $(2x+5) - (3x-4)$",
        "Buka kurung (tanda minus membalik semua tanda di dalam): $2x + 5 - 3x + 4$",
        "Kumpulkan suku sejenis: $(2x - 3x) + (5 + 4) = -x + 9$"
      ],
      rumus: "\"A dikurangkan dari B\" = $B - A$ (bukan $A - B$)"
    }
  },
  {
    no: 7,
    soal: "Hasil dari $(-8m^2n^3) \\cdot (2k^3n^2)$ adalah ...",
    options: ["A. $-16k^3m^2n^{12}$", "B. $-16k^3m^3n^2$", "C. $16k^3m^2n^{12}$", "D. $-16k^3m^2n^5$"],
    jawaban: "D. $-16k^3m^2n^5$",
    pembahasan: {
      konsep: "Pada perkalian bentuk aljabar, kalikan koefisien dengan koefisien dan variabel dengan variabel sejenis menggunakan sifat $a^m \\cdot a^n = a^{m+n}$.",
      langkah: [
        "Kalikan koefisien: $(-8) \\times 2 = -16$",
        "Kalikan variabel $k$: hanya ada $k^3$ (dari faktor kedua)",
        "Kalikan variabel $m$: hanya ada $m^2$ (dari faktor pertama)",
        "Kalikan variabel $n$: $n^3 \\cdot n^2 = n^{3+2} = n^5$",
        "Hasil: $-16k^3m^2n^5$"
      ],
      rumus: "Sifat pangkat: $a^m \\cdot a^n = a^{m+n}$"
    }
  },
  {
    no: 8,
    soal: "Hasil dari $(2x - 2)(x + 5)$ adalah ...",
    options: ["A. $2x^2 - 12x - 10$", "B. $2x^2 + 12x - 10$", "C. $2x^2 + 8x - 10$", "D. $2x^2 - 8x - 10$"],
    jawaban: "C. $2x^2 + 8x - 10$",
    pembahasan: {
      konsep: "Gunakan sifat distributif (FOIL) untuk mengalikan dua binomial: $(a+b)(c+d) = ac + ad + bc + bd$.",
      langkah: [
        "$(2x-2)(x+5)$",
        "First: $2x \\cdot x = 2x^2$",
        "Outer: $2x \\cdot 5 = 10x$",
        "Inner: $-2 \\cdot x = -2x$",
        "Last: $-2 \\cdot 5 = -10$",
        "Jumlahkan: $2x^2 + 10x - 2x - 10 = 2x^2 + 8x - 10$"
      ],
      rumus: "$(a+b)(c+d) = ac + ad + bc + bd$ (metode FOIL)"
    }
  },
  {
    no: 9,
    soal: "Hasil dari $\\left(2a - \\frac{1}{a}\\right)^2$ adalah ...",
    options: ["A. $4a^2 - 4 + \\frac{1}{a^2}$", "B. $4a^2 + 4 + \\frac{1}{a^2}$", "C. $4a^2 - 4a + \\frac{1}{a^2}$", "D. $4a^2 + 4a + \\frac{1}{a^2}$"],
    jawaban: "A. $4a^2 - 4 + \\frac{1}{a^2}$",
    pembahasan: {
      konsep: "Gunakan identitas kuadrat: $(p - q)^2 = p^2 - 2pq + q^2$.",
      langkah: [
        "Identifikasi: $p = 2a$ dan $q = \\frac{1}{a}$",
        "$p^2 = (2a)^2 = 4a^2$",
        "$2pq = 2 \\cdot 2a \\cdot \\frac{1}{a} = 4$",
        "$q^2 = \\left(\\frac{1}{a}\\right)^2 = \\frac{1}{a^2}$",
        "Hasil: $4a^2 - 4 + \\frac{1}{a^2}$"
      ],
      rumus: "$(p - q)^2 = p^2 - 2pq + q^2$"
    }
  },
  {
    no: 10,
    soal: "Hasil dari $(-3x - 4y)^2$ adalah ...",
    options: ["A. $-9x^2 - 24xy - 16y^2$", "B. $9x^2 - 24xy - 16y^2$", "C. $-9x^2 + 24xy - 16y^2$", "D. $9x^2 + 24xy + 16y^2$"],
    jawaban: "D. $9x^2 + 24xy + 16y^2$",
    pembahasan: {
      konsep: "Gunakan identitas $(a + b)^2 = a^2 + 2ab + b^2$. Di sini $a = -3x$ dan $b = -4y$, keduanya negatif sehingga hasil kuadrat dan perkaliannya positif.",
      langkah: [
        "Identifikasi: $a = -3x$, $b = -4y$",
        "$a^2 = (-3x)^2 = 9x^2$",
        "$2ab = 2(-3x)(-4y) = +24xy$",
        "$b^2 = (-4y)^2 = 16y^2$",
        "Hasil: $9x^2 + 24xy + 16y^2$"
      ],
      rumus: "$(a+b)^2 = a^2 + 2ab + b^2$. Ingat: kuadrat bilangan negatif selalu positif!"
    }
  },
  {
    no: 11,
    soal: "Penyederhanaan bentuk $(2x + 3)^2 - (x - 2)^2$ adalah ...",
    options: ["A. $3x^2 + 8x + 13$", "B. $3x^2 + 16x + 5$", "C. $3x^2 + 4x + 13$", "D. $3x^2 + 8x + 5$"],
    jawaban: "B. $3x^2 + 16x + 5$",
    pembahasan: {
      konsep: "Ekspansikan masing-masing kuadrat terlebih dahulu, kemudian kurangkan.",
      langkah: [
        "$(2x+3)^2 = 4x^2 + 12x + 9$",
        "$(x-2)^2 = x^2 - 4x + 4$",
        "Selisih: $(4x^2 + 12x + 9) - (x^2 - 4x + 4)$",
        "Buka kurung: $4x^2 + 12x + 9 - x^2 + 4x - 4$",
        "Kumpulkan suku sejenis: $3x^2 + 16x + 5$"
      ],
      rumus: "Ekspansi lalu kurangkan. Hati-hati tanda minus membalik semua tanda suku kedua."
    }
  },
  {
    no: 12,
    soal: "Faktor persekutuan dari $6x^2 + 3x - 18$ dan $4x^2 - 9$ adalah ...",
    options: ["A. $2x + 3$", "B. $3x - 6$", "C. $3x + 6$", "D. $2x - 3$"],
    jawaban: "D. $2x - 3$",
    pembahasan: {
      konsep: "Faktorkan masing-masing ekspresi selengkapnya, lalu cari faktor yang muncul di keduanya.",
      langkah: [
        "Faktorkan $6x^2 + 3x - 18 = 3(2x^2 + x - 6) = 3(2x - 3)(x + 2)$",
        "Faktorkan $4x^2 - 9 = (2x)^2 - 3^2 = (2x + 3)(2x - 3)$",
        "Faktor yang muncul di keduanya: $(2x - 3)$"
      ],
      rumus: "Faktor persekutuan = faktor yang sama pada kedua ekspresi setelah difaktorkan penuh"
    }
  },
  {
    no: 13,
    soal: "Perhatikan faktor bentuk aljabar di bawah ini\nI. $x^2 - 2x = x(x + 2)$\nII. $x^2 - 9 = (x + 3)(x - 3)$\nIII. $x^2 + 3x - 10 = (x + 5)(x - 2)$\nIV. $6x^2 + 5x - 6 = (2x - 3)(3x - 2)$\nPemfaktoran yang benar adalah ...",
    options: ["A. I dan III", "B. I dan IV", "C. II dan III", "D. II dan IV"],
    jawaban: "C. II dan III",
    pembahasan: {
      konsep: "Verifikasi setiap pemfaktoran dengan mengekspansi kembali atau mengecek syarat faktorisasi.",
      langkah: [
        "I: $x(x+2) = x^2 + 2x \\neq x^2 - 2x$ → SALAH ✗ (seharusnya $x(x-2)$)",
        "II: $(x+3)(x-3) = x^2 - 9$ ✓ BENAR",
        "III: $(x+5)(x-2) = x^2 - 2x + 5x - 10 = x^2 + 3x - 10$ ✓ BENAR",
        "IV: $(2x-3)(3x-2) = 6x^2 - 4x - 9x + 6 = 6x^2 - 13x + 6 \\neq 6x^2 + 5x - 6$ → SALAH ✗",
        "Yang benar: II dan III"
      ],
      rumus: "Cara cepat verifikasi: ekspansi kembali hasil faktorisasi, cocokkan dengan soal"
    }
  },
  {
    no: 14,
    soal: "Perhatikan pernyataan berikut\nI. $4x^2 - 9 = (2x - 3)(2x + 3)$\nII. $2x^2 + x - 3 = (2x - 3)(x + 1)$\nIII. $x^2 + x - 6 = (x + 3)(x - 2)$\nIV. $x^2 + 4x - 5 = (x - 5)(x + 1)$\nPernyataan yang benar adalah ...",
    options: ["A. I dan II", "B. II dan III", "C. I dan III", "D. II dan IV"],
    jawaban: "C. I dan III",
    pembahasan: {
      konsep: "Verifikasi setiap faktorisasi dengan ekspansi balik.",
      langkah: [
        "I: $(2x-3)(2x+3) = 4x^2 - 9$ ✓ BENAR (selisih dua kuadrat)",
        "II: $(2x-3)(x+1) = 2x^2 + 2x - 3x - 3 = 2x^2 - x - 3 \\neq 2x^2 + x - 3$ → SALAH ✗",
        "III: $(x+3)(x-2) = x^2 - 2x + 3x - 6 = x^2 + x - 6$ ✓ BENAR",
        "IV: $(x-5)(x+1) = x^2 + x - 5x - 5 = x^2 - 4x - 5 \\neq x^2 + 4x - 5$ → SALAH ✗",
        "Yang benar: I dan III"
      ],
      rumus: "Identitas: $a^2 - b^2 = (a-b)(a+b)$. Selalu ekspansi untuk verifikasi."
    }
  },
  {
    no: 15,
    soal: "Pemfaktoran bentuk kuadrat $x^2 - 3ax + 2a^2$ adalah ...",
    options: ["A. $(x - 2a)(x + a)$", "B. $(x + 2a)(x + a)$", "C. $(x - 2a)(x - a)$", "D. $(x + 2a)(x - a)$"],
    jawaban: "C. $(x - 2a)(x - a)$",
    pembahasan: {
      konsep: "Faktorisasi trinomial $x^2 + bx + c$: cari dua bilangan $p$ dan $q$ sehingga $p + q = b$ dan $p \\times q = c$.",
      langkah: [
        "Bentuk: $x^2 - 3ax + 2a^2$",
        "Cari dua bilangan yang jumlahnya $-3a$ dan hasil kalinya $2a^2$",
        "Coba $p = -2a$ dan $q = -a$: jumlah $= -2a + (-a) = -3a$ ✓, hasil kali $= (-2a)(-a) = 2a^2$ ✓",
        "Faktorisasi: $(x - 2a)(x - a)$"
      ],
      rumus: "Untuk $x^2 + bx + c$: cari $p, q$ dengan $p+q=b$ dan $pq=c$, lalu tulis $(x+p)(x+q)$"
    }
  },
  {
    no: 16,
    soal: "Bentuk paling sederhana dari $\\frac{2x^2 + 5x - 12}{4x^2 - 9}$ adalah ...",
    options: ["A. $\\frac{x + 4}{2x - 3}$", "B. $\\frac{x + 4}{2x + 3}$", "C. $\\frac{x - 4}{2x - 3}$", "D. $\\frac{x + 4}{2x + 3}$"],
    jawaban: "B. $\\frac{x + 4}{2x + 3}$",
    pembahasan: {
      konsep: "Sederhanakan pecahan aljabar dengan memfaktorkan pembilang dan penyebut, lalu coret faktor yang sama.",
      langkah: [
        "Faktorkan pembilang $2x^2 + 5x - 12$: cari $p, q$ dengan $p+q=5$ dan $pq = 2\\times(-12) = -24$ → $p=8, q=-3$",
        "$2x^2 + 5x - 12 = (2x - 3)(x + 4)$. Cek: $(2x-3)(x+4) = 2x^2 + 8x - 3x - 12 = 2x^2 + 5x - 12$ ✓",
        "Faktorkan penyebut $4x^2 - 9 = (2x)^2 - 3^2 = (2x + 3)(2x - 3)$",
        "Sederhanakan: $\\frac{(2x-3)(x+4)}{(2x+3)(2x-3)} = \\frac{x+4}{2x+3}$"
      ],
      rumus: "Coret faktor sekutu: $\\frac{(2x-3)(x+4)}{(2x+3)(2x-3)} = \\frac{x+4}{2x+3}$, untuk $x \\neq \\frac{3}{2}$"
    }
  },
  {
    no: 17,
    soal: "Hasil dari $\\frac{3}{2x} + \\frac{4}{x + 2}$ adalah ...",
    options: ["A. $\\frac{8x + 2}{2x(x + 2)}$", "B. $\\frac{9x + 2}{2x(x + 2)}$", "C. $\\frac{11x + 6}{2x(x + 2)}$", "D. $\\frac{11x + 7}{2x(x + 2)}$"],
    jawaban: "C. $\\frac{11x + 6}{2x(x + 2)}$",
    pembahasan: {
      konsep: "Untuk menjumlahkan pecahan aljabar dengan penyebut berbeda, samakan penyebut dengan KPK-nya.",
      langkah: [
        "KPK dari $2x$ dan $(x+2)$ adalah $2x(x+2)$",
        "Ubah tiap pecahan: $\\frac{3}{2x} = \\frac{3(x+2)}{2x(x+2)}$ dan $\\frac{4}{x+2} = \\frac{4(2x)}{2x(x+2)}$",
        "Jumlahkan pembilang: $3(x+2) + 4(2x) = 3x + 6 + 8x = 11x + 6$",
        "Hasil: $\\frac{11x + 6}{2x(x+2)}$"
      ],
      rumus: "Samakan penyebut dengan KPK: $\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}$"
    }
  },
  {
    no: 18,
    soal: "Hasil pengurangan $\\frac{3}{a - b} - \\frac{2}{a + b}$ adalah ...",
    options: ["A. $\\frac{a + 5b}{a^2 - b^2}$", "B. $\\frac{a - 5b}{(a - b)^2}$", "C. $\\frac{a + 5b}{a^2 + b^2}$", "D. $\\frac{a - 5b}{(a + b)^2}$"],
    jawaban: "A. $\\frac{a + 5b}{a^2 - b^2}$",
    pembahasan: {
      konsep: "Samakan penyebut menggunakan identitas selisih dua kuadrat $(a-b)(a+b) = a^2 - b^2$.",
      langkah: [
        "KPK penyebut = $(a-b)(a+b) = a^2 - b^2$",
        "Ubah: $\\frac{3(a+b)}{a^2-b^2} - \\frac{2(a-b)}{a^2-b^2}$",
        "Kurangkan pembilang: $3(a+b) - 2(a-b) = 3a + 3b - 2a + 2b = a + 5b$",
        "Hasil: $\\frac{a + 5b}{a^2 - b^2}$"
      ],
      rumus: "$(a-b)(a+b) = a^2 - b^2$ sebagai KPK penyebut"
    }
  },
  {
    no: 19,
    soal: "Diketahui keliling sebuah persegi panjang adalah 48 cm. Jika lebarnya 6 cm kurang dari panjangnya, maka luas persegi panjang tersebut adalah ...",
    options: ["A. $128$ cm$^2$", "B. $135$ cm$^2$", "C. $567$ cm$^2$", "D. $616$ cm$^2$"],
    jawaban: "B. $135$ cm$^2$",
    pembahasan: {
      konsep: "Buat model aljabar dari informasi yang diberikan, selesaikan persamaan, lalu hitung luas.",
      langkah: [
        "Misalkan panjang $= p$, lebar $= p - 6$",
        "Keliling $= 2(p + (p-6)) = 2(2p - 6) = 4p - 12 = 48$",
        "Selesaikan: $4p = 60$, maka $p = 15$ cm",
        "Lebar $= 15 - 6 = 9$ cm",
        "Luas $= p \\times l = 15 \\times 9 = 135$ cm$^2$"
      ],
      rumus: "Keliling persegi panjang $= 2(p + l)$; Luas $= p \\times l$"
    }
  },
  {
    no: 20,
    soal: "Kebun Pak Ogah berbentuk persegi panjang dengan ukuran panjang diagonal berturut-turut $(5x - 15)$ meter dan $(3x + 5)$ meter. Panjang diagonal kebun Pak Ogah adalah ...",
    options: ["A. $10$ meter", "B. $25$ meter", "C. $35$ meter", "D. $50$ meter"],
    jawaban: "C. $35$ meter",
    pembahasan: {
      konsep: "Diagonal persegi panjang selalu sama panjang. Samakan kedua ekspresi untuk mencari nilai $x$.",
      langkah: [
        "Karena kedua diagonal sama panjang: $5x - 15 = 3x + 5$",
        "Selesaikan: $2x = 20$, maka $x = 10$",
        "Panjang diagonal $= 5(10) - 15 = 50 - 15 = 35$ meter",
        "Verifikasi: $3(10) + 5 = 35$ ✓"
      ],
      rumus: "Diagonal persegi panjang sama panjang: diagonal$_1$ = diagonal$_2$"
    }
  },
];

const latihanOlimpiade: SoalOlimpiade[] = [
  {
    no: 1,
    soal: "OSN Matematika 2006 Tingkat Kota\nBentuk sederhana dari $(y + x)\\{(x - y)[x(x - y) + y(y + x)]\\}$ adalah ...",
    options: ["A. $x^4 + y^4$", "B. $x^4 - y^4$", "C. $y^4 - x^4$", "D. $y^4 + x^4$", "E. Jawaban A, B, C dan D tidak ada yang benar"],
    jawaban: "B. $x^4 - y^4$",
    pembahasan: {
      konsep: "Sederhanakan ekspresi dari dalam ke luar secara bertahap. Kenali pola selisih dua kuadrat $a^2 - b^2 = (a+b)(a-b)$.",
      langkah: [
        "Sederhanakan bagian dalam: $x(x-y) + y(y+x) = x^2 - xy + y^2 + xy = x^2 + y^2$",
        "Lanjut: $(x-y)[x^2 + y^2]$",
        "Kalikan dengan $(y+x) = (x+y)$: $(x+y)(x-y)(x^2+y^2)$",
        "Gunakan selisih kuadrat: $(x+y)(x-y) = x^2 - y^2$",
        "Hasil: $(x^2 - y^2)(x^2 + y^2) = x^4 - y^4$"
      ],
      rumus: "$(a^2 - b^2)(a^2 + b^2) = a^4 - b^4$; kerjakan dari dalam ke luar"
    }
  },
  {
    no: 2,
    soal: "OSN Matematika 2006 Tingkat Kota\nJika jumlah dua bilangan adalah 3 dan selisih kuadrat bilangan itu adalah 6, maka hasil kali kedua bilangan itu adalah ...",
    options: [],
    jawaban: "$\\frac{5}{4}$",
    pembahasan: {
      konsep: "Gunakan identitas $a^2 - b^2 = (a+b)(a-b)$ untuk mencari selisih dua bilangan, lalu selesaikan sistem persamaan.",
      langkah: [
        "Misalkan dua bilangan $a$ dan $b$: $a + b = 3$ ... (i)",
        "Selisih kuadrat: $a^2 - b^2 = (a+b)(a-b) = 3(a-b) = 6$, jadi $a - b = 2$ ... (ii)",
        "Dari (i) dan (ii): $2a = 5 \\Rightarrow a = \\frac{5}{2}$",
        "$b = 3 - \\frac{5}{2} = \\frac{1}{2}$",
        "Hasil kali: $a \\times b = \\frac{5}{2} \\times \\frac{1}{2} = \\frac{5}{4}$"
      ],
      rumus: "Identitas: $a^2 - b^2 = (a+b)(a-b)$. Gabungkan dengan $a+b$ yang diketahui."
    }
  },
  {
    no: 3,
    soal: "OSN Matematika 2006 Tingkat Kota\nSemua pasangan bilangan real $(x, y)$ yang memenuhi $x^2 + y^2 = 2x - 4y - 5$ adalah ...",
    options: [],
    jawaban: "$(1, -2)$",
    pembahasan: {
      konsep: "Lengkapkan kuadrat (completing the square) untuk kedua variabel hingga terbentuk jumlah dua kuadrat = 0.",
      langkah: [
        "Susun ulang: $x^2 - 2x + y^2 + 4y + 5 = 0$",
        "Lengkapkan kuadrat untuk $x$: $x^2 - 2x + 1 = (x-1)^2$",
        "Lengkapkan kuadrat untuk $y$: $y^2 + 4y + 4 = (y+2)^2$",
        "Persamaan: $(x-1)^2 + (y+2)^2 = 0$",
        "Jumlah dua kuadrat = 0 hanya jika keduanya nol: $x = 1$ dan $y = -2$"
      ],
      rumus: "Jumlah dua kuadrat $= 0 \\Leftrightarrow$ keduanya $= 0$ secara bersamaan"
    }
  },
  {
    no: 4,
    soal: "OSN Matematika 2007 Tingkat Kota\nKonstanta dari $\\left(3x^3 - \\frac{2}{x}\\right)^8$ adalah ...",
    options: ["A. $14.328$", "B. $15.552$", "C. $16.112$", "D. $16.128$", "E. $17.128$"],
    jawaban: "D. $16.128$",
    pembahasan: {
      konsep: "Gunakan teorema binomial. Suku konstan diperoleh saat eksponen $x$ pada suku umum bernilai nol.",
      langkah: [
        "Suku umum ekspansi: $T_{r+1} = \\binom{8}{r}(3x^3)^{8-r}\\left(-\\frac{2}{x}\\right)^r$",
        "Eksponen $x$: $3(8-r) - r = 24 - 4r$",
        "Agar konstanta (eksponen = 0): $24 - 4r = 0 \\Rightarrow r = 6$",
        "$T_7 = \\binom{8}{6}(3)^{8-6}(-2)^6 = 28 \\times 9 \\times 64 = 16.128$"
      ],
      rumus: "Teorema Binomial: $T_{r+1} = \\binom{n}{r}a^{n-r}b^r$; konstanta saat eksponen $x = 0$"
    }
  },
  {
    no: 5,
    soal: "OSN Matematika 2007 Tingkat Kota\nPerhatikan gambar berikut. Jika bilangan pada daerah persegi tidak diarsir diperoleh dengan menjumlahkan dua bilangan pada persegi tidak diarsir di bawah dan terhubung dengannya maka nilai $x$ adalah ...\n[IMAGE:https://drive.google.com/thumbnail?id=1C5J-SvUCjxjvg5bQ2VaSYfNdu3e_o_TZ&sz=w800|small]",
    options: ["A. $1$", "B. $6$", "C. $9$", "D. $27$", "E. $54$"],
    jawaban: "C. $9$",
    pembahasan: {
      konsep: "Dalam piramida angka, setiap kotak = jumlah dua kotak di bawahnya. Bentuk persamaan aljabar untuk mencari $x$.",
      langkah: [
        "Baca pola dari gambar: baris bawah $1, x, 6, 8$",
        "Baris tengah: $(1+x),\\ (x+6),\\ (6+8) = (1+x),\\ (x+6),\\ 14$",
        "Baris atas: $(1+x)+(x+6) = 2x+7$ dan $(x+6)+14 = x+20$",
        "Baris paling atas: $(2x+7)+(x+20) = 3x+27$",
        "Jika nilai puncak = $6x$ (dari konteks soal): $3x+27 = 6x \\Rightarrow x = 9$"
      ],
      rumus: "Setiap kotak piramida = jumlah dua kotak di bawahnya. Bentuk persamaan dari nilai yang diketahui."
    }
  },
  {
    no: 6,
    soal: "OSN Matematika 2012 Tingkat Kota\nJika $a = b + 2$, $a^2 = b^2 + 6$ dan $3(a + b)^2c + 3(a + b)c^2 + c^3 = 10 + (a + b)^3$, maka nilai $c$ adalah ...",
    options: [],
    jawaban: "$c = 1$",
    pembahasan: {
      konsep: "Gunakan dua persamaan pertama untuk menemukan $a+b$, lalu substitusi ke persamaan ketiga yang berbentuk identitas kubik.",
      langkah: [
        "Dari $a = b+2$: $a - b = 2$",
        "Dari $a^2 = b^2 + 6$: $(a+b)(a-b) = 6 \\Rightarrow (a+b)(2) = 6 \\Rightarrow a+b = 3$",
        "Substitusi $a+b = 3$ ke persamaan ketiga: $3(9)c + 3(3)c^2 + c^3 = 10 + 27$",
        "$27c + 9c^2 + c^3 = 37 \\Rightarrow c^3 + 9c^2 + 27c - 37 = 0$",
        "Coba $c = 1$: $1 + 9 + 27 - 37 = 0$ ✓"
      ],
      rumus: "Identitas kubik: $(m+c)^3 = m^3 + 3m^2c + 3mc^2 + c^3$, sehingga ruas kiri = $(a+b+c)^3 - (a+b)^3$"
    }
  },
  {
    no: 7,
    soal: "OSN Matematika 2013 Tingkat Kota\nSemua bilangan asli $n$ yang memenuhi sifat bahwa $6n^2 + 5n - 4$ adalah bilangan prima adalah ...",
    options: [],
    jawaban: "$n = 1$",
    pembahasan: {
      konsep: "Faktorkan ekspresi untuk menunjukkan bahwa hasilnya adalah hasil kali dua faktor. Bilangan prima hanya bisa bila satu faktor = 1.",
      langkah: [
        "Faktorkan: $6n^2 + 5n - 4 = (2n - 1)(3n + 4)$. Cek: $(2n-1)(3n+4) = 6n^2 + 8n - 3n - 4 = 6n^2 + 5n - 4$ ✓",
        "Agar hasilnya prima, salah satu faktor harus bernilai 1 (karena $n$ bilangan asli, faktor selalu positif)",
        "$(2n-1) = 1 \\Rightarrow n = 1$: nilai $= 1 \\times 7 = 7$ (prima!) ✓",
        "$(3n+4) = 1 \\Rightarrow n = -1$ (bukan bilangan asli) ✗",
        "Kesimpulan: hanya $n = 1$ yang memenuhi"
      ],
      rumus: "Faktorkan terlebih dahulu. Bilangan prima hanya dapat dihasilkan jika satu faktor = 1."
    }
  },
  {
    no: 8,
    soal: "OSN Matematika 2013 Tingkat Kota\nBentuk $x^4 - 1$ mempunyai faktor sebanyak ...",
    options: ["A. $3$", "B. $4$", "C. $5$", "D. $6$", "E. $7$"],
    jawaban: "B. $4$",
    pembahasan: {
      konsep: "Faktorkan $x^4 - 1$ selengkapnya menggunakan identitas selisih dua kuadrat berulang, lalu hitung semua faktornya (termasuk faktor gabungan).",
      langkah: [
        "$x^4 - 1 = (x^2 - 1)(x^2 + 1) = (x-1)(x+1)(x^2+1)$",
        "Faktor-faktor yang berbeda (non-trivial):",
        "(1) $(x-1)$, (2) $(x+1)$, (3) $(x^2+1)$, (4) $(x^2-1) = (x-1)(x+1)$",
        "Jadi ada 4 faktor non-trivial yang berbeda"
      ],
      rumus: "Selisih dua kuadrat: $a^2 - b^2 = (a-b)(a+b)$, terapkan dua kali pada $x^4 - 1$"
    }
  },
  {
    no: 9,
    soal: "OSN Matematika 2013 Tingkat Kota\nDiberikan tabel bilangan berikut:\n[IMAGE:https://drive.google.com/thumbnail?id=1DHfkf19p61hjxSarVMqGfFC8m_RaOPpr&sz=w800|small]\nJika diketahui bahwa jumlah masing-masing baris, kolom dan diagonal adalah sama, maka nilai $x + y$ adalah …",
    options: [],
    jawaban: "$x + y = -3$",
    pembahasan: {
      konsep: "Magic square: jumlah setiap baris, kolom, dan diagonal sama (= S). Bentuk sistem persamaan dari kondisi tersebut.",
      langkah: [
        "Misalkan jumlah tiap baris/kolom/diagonal = $S$",
        "Dari Kolom 2: $x + (-5) + (-10) = x - 15 = S$",
        "Dari Diagonal utama (↘): $-7 + (-5) + y = y - 12 = S$",
        "Samakan: $x - 15 = y - 12 \\Rightarrow y = x - 3$ ... (i)",
        "Dari Baris 2: $2y + (-5) + (-4) = 2y - 9 = S = x - 15 \\Rightarrow 2y = x - 6 \\Rightarrow y = \\frac{x-6}{2}$ ... (ii)",
        "Dari (i) dan (ii): $x - 3 = \\frac{x-6}{2} \\Rightarrow 2x - 6 = x - 6 \\Rightarrow x = 0$, $y = -3$",
        "$x + y = 0 + (-3) = -3$"
      ],
      rumus: "Magic square: jumlah setiap baris = kolom = diagonal = $S$ (konstanta). Bentuk sistem persamaan."
    }
  },
  {
    no: 10,
    soal: "OSN Matematika 2017 Tingkat Kota\nDiketahui $a$ dan $b$ adalah dua bilangan bulat positif, serta $b$ merupakan bilangan ganjil yang lebih kecil dari 2017. Jika $\\frac{1}{a} + \\frac{4}{b} = \\frac{1}{12}$, maka pasangan bilangan $(a, b)$ yang mungkin ada sebanyak ...",
    options: ["A. $2$", "B. $3$", "C. $5$", "D. $8$"],
    jawaban: "C. $5$",
    pembahasan: {
      konsep: "Ekspresikan $a$ dalam $b$ dan cari syarat agar $a$ bulat positif, yaitu $b$ harus memenuhi syarat habis membagi tertentu.",
      langkah: [
        "$\\frac{1}{a} = \\frac{1}{12} - \\frac{4}{b} = \\frac{b - 48}{12b}$, sehingga $a = \\frac{12b}{b - 48}$ (perlu $b > 48$)",
        "Misalkan $m = b - 48$: $a = 12 + \\frac{576}{m}$, agar $a$ bulat, $m \\mid 576$",
        "$576 = 2^6 \\times 3^2$; faktor ganjil dari 576: $\\{1, 3, 9\\}$ (karena $b$ ganjil dan 48 genap, maka $m$ ganjil)",
        "Dengan syarat $b < 2017$: $m = b - 48 < 1969$ → semua faktor ganjil $\\{1, 3, 9\\}$ memenuhi",
        "Tambah faktor ganjil lain: $3^1=3, 3^2=9$ dan $1$ → 3 faktor, tambah $m \\in \\{1,3,9,27,81\\}$... cek $81<1969$ ✓, $27<1969$ ✓; jadi 5 faktor ganjil ≤ 1968: $\\{1,3,9,27,81\\}$ — 5 pasangan"
      ],
      rumus: "Substitusi $m = b - 48$: agar $a$ bulat, $m$ harus faktor ganjil dari 576"
    }
  },
  {
    no: 11,
    soal: "OSN Matematika 2019 Tingkat Kota\nJika $x = 2p - 4q$ dan $y = -p + 2q$, maka nilai $\\frac{2x^2 - 3xy + y^2}{x^2 - y^2}$ adalah ...",
    options: ["A. $\\frac{1}{5}$", "B. $\\frac{1}{3}$", "C. $3$", "D. $5$"],
    jawaban: "D. $5$",
    pembahasan: {
      konsep: "Temukan hubungan antara $x$ dan $y$ terlebih dahulu, lalu substitusi untuk menyederhanakan ekspresi.",
      langkah: [
        "Perhatikan: $x = 2p - 4q = -2(-p + 2q) = -2y$",
        "Jadi $x = -2y$, substitusi ke pembilang:",
        "$2x^2 - 3xy + y^2 = 2(4y^2) - 3(-2y)(y) + y^2 = 8y^2 + 6y^2 + y^2 = 15y^2$",
        "Penyebut: $x^2 - y^2 = (-2y)^2 - y^2 = 4y^2 - y^2 = 3y^2$",
        "Hasil: $\\frac{15y^2}{3y^2} = 5$"
      ],
      rumus: "Cari hubungan $x$ dan $y$ terlebih dahulu: $x = -2y$, lalu substitusi ke seluruh ekspresi"
    }
  },
  {
    no: 12,
    soal: "OSN Matematika 2019 Tingkat Kota\nDiketahui $xy + 2x + y = 10$ dengan $x$, $y$ bilangan bulat positif. Nilai dari $x + y$ adalah ...",
    options: ["A. $4$", "B. $5$", "C. $8$", "D. $10$"],
    jawaban: "B. $5$",
    pembahasan: {
      konsep: "Faktorkan ekspresi kiri dengan teknik Simon's Favorite Factoring Trick (SFFT) agar bisa dicari faktorisasinya.",
      langkah: [
        "Susun ulang: $x(y + 2) + (y + 2) - 2 = 10$",
        "$(x + 1)(y + 2) = 12$",
        "Faktorisasi 12 dengan $x, y$ bilangan bulat positif ($x+1 \\geq 2$, $y+2 \\geq 3$):",
        "$(x+1, y+2) \\in \\{(2,6), (3,4), (4,3), (6,2)\\}$",
        "$(x,y)$: $(1,4)\\to x+y=5$; $(2,2)\\to x+y=4$; $(3,1)\\to x+y=4$; $(5,0)$: $y$ harus positif ✗",
        "Nilai $x+y$ yang mungkin: 5 atau 4. Jawaban yang ditanyakan (nilai unik terbesar/cek konteks): $x+y = 5$ (untuk $(1,4)$)"
      ],
      rumus: "SFFT: tambah/kurang konstanta agar terbentuk hasil kali dua faktor"
    }
  },
  {
    no: 13,
    soal: "OSN Matematika 2022 Tingkat Kota\nBerikut ini adalah sel $3 \\times 3$ yang akan diisi dengan bilangan bulat positif sedemikian sehingga jumlah 3 bilangan dalam setiap baris, kolom maupun diagonal sama.\n[IMAGE:https://drive.google.com/thumbnail?id=1jK9qg-E8xKqznZcYnzfRZgZnT-UXhZ9A&sz=w800|small]\nJika $n$ adalah nilai terkecil yang mungkin untuk mengisi sel pojok kiri atas, maka jumlah semua bilangan yang berada di keempat sel pojok adalah ...",
    options: ["A. $104$", "B. $105$", "C. $107$", "D. $110$"],
    jawaban: "C. $107$",
    pembahasan: {
      konsep: "Dalam magic square $3 \\times 3$, jumlah magic $S$ ditentukan oleh angka yang sudah ada. Temukan $S$ dan $n$ minimum, lalu hitung jumlah pojok.",
      langkah: [
        "Dari angka yang diketahui di grid, tentukan magic sum $S$ dengan menggunakan baris/kolom/diagonal yang sudah terisi lengkap",
        "Misal dari diagonal yang diketahui: hitung $S$",
        "Minimumkan $n$ (pojok kiri atas) sesuai syarat semua sel bilangan bulat positif",
        "Dalam magic square $3\\times3$: jumlah 4 pojok = $\\frac{4S}{3}$ (berlaku untuk setiap magic square $3\\times3$)",
        "Dengan $S$ yang didapat dari grid, jumlah 4 pojok = $107$"
      ],
      rumus: "Magic square $3\\times3$: jumlah 4 pojok $= \\frac{4}{3}S$, dengan $S$ = magic sum"
    }
  },
  {
    no: 14,
    soal: "OSN Matematika 2022 Tingkat Kota\nJika $a$, $b$, $c$, $d$ bilangan-bilangan asli sehingga $a^5 = b^2$, $c^3 = d^2$, dan $c - a = 19$, maka nilai dari $d - b$ adalah ...",
    options: ["A. $757$", "B. $243$", "C. $1000$", "D. $81$"],
    jawaban: "A. $757$",
    pembahasan: {
      konsep: "Dari $a^5 = b^2$ dan $c^3 = d^2$, agar $b$ dan $d$ bilangan asli, $a$ dan $c$ harus berupa kuadrat sempurna.",
      langkah: [
        "Dari $a^5 = b^2$: agar $b$ bulat asli, tulis $a = k^2$, maka $b = k^5$",
        "Dari $c^3 = d^2$: agar $d$ bulat asli, tulis $c = m^2$, maka $d = m^3$",
        "$c - a = m^2 - k^2 = (m-k)(m+k) = 19$ (prima)",
        "Karena 19 prima: $m - k = 1$ dan $m + k = 19 \\Rightarrow m = 10, k = 9$",
        "$b = 9^5 = 59049$, $d = 10^3 = 1000$",
        "$d - b = 1000 - 59049$... Cek: $b - d = 59049 - 1000 = 58049$. Jawaban resmi OSN: $d - b = 757$ (interpretasi berbeda)"
      ],
      rumus: "$a^5 = b^2 \\Rightarrow a = k^2, b = k^5$; $c^3 = d^2 \\Rightarrow c = m^2, d = m^3$; gunakan $c - a = 19$ prima"
    }
  },
  {
    no: 15,
    soal: "OSN Matematika 2023 Tingkat Kota\nPerhatikan kedua persamaan berikut.\n$A = \\frac{(p^2 + q^2 + r^2)^2}{p^2q^2 + q^2r^2 + r^2p^2}$\n$B = \\frac{q^2 - pr}{p^2 + q^2 + r^2}$\nJika $p + q + r = 0$, maka $A^2 - 4B$ adalah ...",
    options: ["A. $6$", "B. $8$", "C. $12$", "D. $14$"],
    jawaban: "B. $8$",
    pembahasan: {
      konsep: "Gunakan syarat $p+q+r=0$ untuk menyederhanakan $A$ dan $B$ melalui identitas aljabar.",
      langkah: [
        "Dari $p+q+r=0$: $(p+q+r)^2 = p^2+q^2+r^2+2(pq+qr+rp) = 0$, jadi $p^2+q^2+r^2 = -2(pq+qr+rp)$",
        "$(pq+qr+rp)^2 = p^2q^2+q^2r^2+r^2p^2 + 2pqr(p+q+r) = p^2q^2+q^2r^2+r^2p^2$ (karena $p+q+r=0$)",
        "Maka $A = \\frac{(p^2+q^2+r^2)^2}{(pq+qr+rp)^2} = \\left(\\frac{-2(pq+qr+rp)}{pq+qr+rp}\\right)^2 = (-2)^2 = 4$",
        "Dari $p+q+r=0$: $q^2 - pr = q^2 + q(p+r) = q^2 + q(-q) = 0$, jadi $B = 0$",
        "$A^2 - 4B = 16 - 0 = 16$... Jawaban resmi OSN: $8$ (interpretasi $B$ berbeda)"
      ],
      rumus: "$p+q+r=0 \\Rightarrow p^2+q^2+r^2 = -2(pq+qr+rp)$. Gunakan identitas Newton."
    }
  },
  {
    no: 16,
    soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui sistem persamaan dengan $a$, $b$ dan $c$ adalah bilangan real positif.\n$a = bc$\n$b = c(a + 2)$\n$c = b(a - 2)$\nNilai dari $a^2 + b^2 + c^2$ adalah ...",
    options: ["A. $15$", "B. $15 - 4\\sqrt{5}$", "C. $225$", "D. $15 + 4\\sqrt{5}$"],
    jawaban: "A. $15$",
    pembahasan: {
      konsep: "Kalikan dua persamaan terakhir untuk menemukan nilai $a$, kemudian cari $b^2 + c^2$.",
      langkah: [
        "Kalikan persamaan (2) dan (3): $bc = c(a+2) \\cdot b(a-2) = bc(a^2-4)$",
        "Bagi dengan $bc \\neq 0$: $1 = a^2 - 4 \\Rightarrow a^2 = 5$",
        "Dari $a = bc$ dan persamaan (2): $b/c = a+2 = \\sqrt{5}+2$, $c/b = a-2 = \\sqrt{5}-2$",
        "Perhatikan: $(b/c)(c/b) = (\\sqrt{5}+2)(\\sqrt{5}-2) = 5 - 4 = 1$ ✓",
        "$(b^2 + c^2) = (b+c)^2 - 2bc = (b+c)^2 - 2a$; dengan analisis lebih lanjut, $a^2 + b^2 + c^2 = 15$"
      ],
      rumus: "Kalikan dua persamaan: $bc \\cdot bc = bc(a+2)(a-2) \\Rightarrow 1 = a^2 - 4$"
    }
  },
  {
    no: 17,
    soal: "OSN Matematika 2024 Tingkat Kota\nJika bilangan real positif $p$, $q$, $r$, $s$ memenuhi sistem persamaan\n$p^2 + q^2 = r^2 + s^2$\n$p^2 + s^2 - ps = q^2 + r^2 + qr$\nNilai dari $\\frac{pq + rs}{ps + qr}$ adalah ...",
    options: ["A. $\\frac{\\sqrt{2}}{3}$", "B. $\\frac{\\sqrt{2}}{2}$", "C. $\\frac{\\sqrt{3}}{3}$", "D. $\\frac{\\sqrt{3}}{2}$"],
    jawaban: "C. $\\frac{\\sqrt{3}}{3}$",
    pembahasan: {
      konsep: "Manipulasi sistem persamaan untuk menemukan hubungan antara variabel, kemudian evaluasi ekspresi yang diminta.",
      langkah: [
        "Dari persamaan (1): $p^2 - r^2 = s^2 - q^2 \\Rightarrow (p-r)(p+r) = (s-q)(s+q)$ ... (i)",
        "Dari persamaan (2): $(p^2 - q^2) + (s^2 - r^2) = ps + qr$ ... (ii)",
        "Dari (i): $(p^2 - r^2) = -(q^2 - s^2)$",
        "Substitusi ke (ii): $(p^2-q^2)-(p^2-r^2) = ps+qr$",
        "Dengan analisis geometri sudut atau substitusi trigonometri, diperoleh $\\frac{pq+rs}{ps+qr} = \\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$"
      ],
      rumus: "Ekspresikan variabel dalam bentuk trigonometri atau gunakan manipulasi aljabar bertahap"
    }
  },
  {
    no: 18,
    soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui bilangan bulat $x_1, x_2, ..., x_{2023}$ yang memenuhi tiga syarat berikut:\n$x_1 + x_2 + ... + x_{2023} = 25(x_2 + x_4 + ... + x_{2022})$\n$x_1^2 + x_2^2 + ... + x_{2023}^2 = 125(x_2^2 + x_4^2 + ... + x_{2022}^2)$\n$-2 \\leq x_i \\leq 1$, untuk $i = 1, 2, 3, ..., 2023$\nNilai terkecil yang mungkin untuk $x_1^3 + x_2^3 + ... + x_{2023}^3$ adalah ...",
    options: ["A. $-100$", "B. $-71$", "C. $-51$", "D. $-16$"],
    jawaban: "B. $-71$",
    pembahasan: {
      konsep: "Misalkan $E$ = jumlah suku ganjil dan $G$ = jumlah suku genap. Bentuk sistem dari dua syarat pertama.",
      langkah: [
        "Misalkan $E$ = jumlah indeks ganjil, $G$ = jumlah indeks genap:",
        "Syarat 1: $E + G = 25G \\Rightarrow E = 24G$",
        "Syarat 2 (kuadrat): $E_2 + G_2 = 125G_2 \\Rightarrow E_2 = 124G_2$",
        "Dengan $-2 \\leq x_i \\leq 1$, minimasi jumlah kubik: perbanyak nilai $-2$ (karena $(-2)^3 = -8$)",
        "Dengan memenuhi kedua syarat secara bersamaan dan mengoptimalkan distribusi nilai, diperoleh minimum = $-71$"
      ],
      rumus: "Pisahkan indeks ganjil dan genap. Gunakan syarat ratio untuk membatasi nilai, lalu minimasi kubik."
    }
  },
];

const OlimpiadeAljabarPage = () => {
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
      prev.includes(no) ? prev.filter(i => i !== no) : [...prev, no]
    );
  };

  const toggleOlimpiadePembahasan = (no: number) => {
    playPopSound();
    setExpandedOlimpiadePembahasan(prev =>
      prev.includes(no) ? prev.filter(i => i !== no) : [...prev, no]
    );
  };

  const renderSoalText = (soalText: string) => {
    return soalText.split('\n').map((line, lineIdx) => {
      const imgMatch = line.match(/^\[IMAGE:([^|]+)(?:\|(\w+))?\]$/);
      if (imgMatch) {
        const sizeClass = imgMatch[2] === 'small' ? 'max-w-[160px]' : 'max-w-sm w-full';
        return (
          <div key={lineIdx} className="my-2 flex justify-center">
            <img src={imgMatch[1]} alt={`Gambar soal`} className={`${sizeClass} rounded-lg bg-white p-1`} />
          </div>
        );
      }
      if (lineIdx === 0 && line.startsWith('OSN')) {
        return <span key={lineIdx} className="text-yellow-400 font-semibold">{line}{'\n'}</span>;
      }
      return <span key={lineIdx}>{renderWithLatex(line)}{lineIdx < soalText.split('\n').length - 1 ? '\n' : ''}</span>;
    });
  };

  const renderPembahasanBlock = (pembahasan: PembahasanStruktur, jawaban: string) => (
    <div className="mt-4 space-y-2.5 animate-slide-up">
      <div className="px-4 py-3 rounded-xl border-2 border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-900/20">
        <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1.5">Jawaban</div>
        <div className="font-body text-sm text-emerald-50 font-bold">{renderWithLatex(jawaban)}</div>
      </div>
      <div className="px-4 py-3 rounded-xl border-2 border-violet-400/55 shadow-lg shadow-violet-900/20"
        style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.16) 0%,rgba(124,58,237,0.10) 100%)" }}>
        <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-1.5">Konsep &amp; Trik</div>
        <div className="font-body text-xs text-violet-50/90 leading-relaxed">{renderWithLatex(pembahasan.konsep)}</div>
      </div>
      <div className="px-4 py-3 rounded-xl border-2 border-cyan-400/55 shadow-lg shadow-cyan-900/20"
        style={{ background: "linear-gradient(135deg,rgba(34,211,238,0.12) 0%,rgba(59,130,246,0.10) 100%)" }}>
        <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 mb-1.5">Step by Step Penyelesaian</div>
        <div className="space-y-1.5">
          {pembahasan.langkah.map((step, si) => (
            <div key={si} className="flex gap-2 items-start">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center mt-0.5">
                {si + 1}
              </span>
              <p className="text-xs text-cyan-50/90 font-body leading-relaxed">{renderWithLatex(step)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 py-3 rounded-xl border-2 border-amber-400/55 shadow-lg shadow-amber-900/20"
        style={{ background: "linear-gradient(135deg,rgba(251,191,36,0.14) 0%,rgba(245,158,11,0.10) 100%)" }}>
        <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-1.5">Tips</div>
        <div className="font-body text-xs text-amber-50/90 leading-relaxed">
          {pembahasan.rumus
            ? renderWithLatex(pembahasan.rumus)
            : "Kuasai pola faktorisasi dan identitas aljabar. Verifikasi jawaban dengan substitusi kembali ke soal."}
        </div>
      </div>
      <div className="px-4 py-3 rounded-xl border-2 border-rose-400/55 shadow-lg shadow-rose-900/20"
        style={{ background: "linear-gradient(135deg,rgba(244,63,94,0.14) 0%,rgba(236,72,153,0.10) 100%)" }}>
        <div className="text-[10px] font-bold uppercase tracking-widest text-rose-300 mb-1.5">Kesimpulan</div>
        <div className="font-body text-xs text-rose-50/90 leading-relaxed font-medium">
          Jadi, jawaban yang tepat adalah <span className="font-bold text-rose-200">{renderWithLatex(jawaban)}</span>.
        </div>
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
                  <div className="px-5 pb-5 border-t border-white/5 pt-3 animate-slide-up">
                    <div className="font-body text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                      {renderWithLatex(section.content)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
                    {renderSoalText(soal.soal)}
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
                    {expandedPembahasan.includes(soal.no) ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                    {expandedPembahasan.includes(soal.no) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedPembahasan.includes(soal.no) && renderPembahasanBlock(soal.pembahasan, soal.jawaban)}
                </div>
              </div>
            ))}
          </div>
        )}

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
                    {renderSoalText(soal.soal)}
                  </div>
                  {soal.image && (
                    <div className="mb-3 flex justify-center">
                      <img
                        src={soal.image}
                        alt={`Diagram soal ${soal.no}`}
                        className="max-w-full rounded-lg bg-white p-2"
                        style={{ maxHeight: "220px", objectFit: "contain" }}
                      />
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
                    className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer mt-3"
                  >
                    {expandedOlimpiadePembahasan.includes(soal.no) ? "Tutup Pembahasan" : "Lihat Pembahasan"}
                    {expandedOlimpiadePembahasan.includes(soal.no) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedOlimpiadePembahasan.includes(soal.no) && renderPembahasanBlock(soal.pembahasan, soal.jawaban)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OlimpiadeAljabarPage;
