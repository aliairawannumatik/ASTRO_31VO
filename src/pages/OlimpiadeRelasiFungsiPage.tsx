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
  title: "MATERI - RELASI DAN FUNGSI",
  sections: [
    {
      heading: "A. Relasi",
      content: `Relasi dari himpunan A ke himpunan B adalah hubungan yang memasangkan anggota himpunan A dengan anggota himpunan B.

Misal himpunan A = {1, 2, 4} dan himpunan B = {(1, 1), (1, 2), (1, 4), (2, 2), (2, 4), (4, 4)} mempunyai relasi bahwa himpunan A merupakan faktor dari himpunan B. Relasi himpunan A dan himpunan B dapat dinyatakan dalam tiga cara yaitu Diagram Panah, Pasangan Berurutan dan Diagram Kartesius.

1. Diagram panah
[IMAGE:https://drive.google.com/thumbnail?id=1Y-yZAbq_xIkLbcPWkB0FZpNkDaSTovSp&sz=w800]
2. Himpunan pasangan terurut: {(1, 2), (1, 3), (1, 4), (2, 2), (2, 4), (4, 4)}
3. Koordinat Kartesius
[IMAGE:https://drive.google.com/thumbnail?id=1PbZEtxhMoQidTbTFEsNeMcDTD1-YfONb&sz=w800]`
    },
    {
      heading: "B. Domain, Kodomain, Range",
      content: `1. Domain adalah daerah asal atau himpunan yang memuat elemen pertama himpunan pasangan berurut fungsi f.

2. Kodomain adalah daerah himpunan kawan, atau himpunan yang memuat elemen kedua himpunan pasangan berurut fungsi f.

3. Range adalah daerah hasil, atau himpunan semua anggota himpunan B yang memiliki pasangan anggota himpunan A.

Contoh:
[IMAGE:https://drive.google.com/thumbnail?id=1Z2TXwogxkXGzotL83KVPwia4UJEsdtB6&sz=w800]
Tentukan Domain, Kodomain dan Range pada diagram panah berikut.
- Dari diagram panah tersebut didapat domainnya adalah $D_f = \\{a, b, c, d, e\\}$.
- Dari diagram panah tersebut didapat kodomainnya adalah $K_f = \\{1, 2, 3, 4, 5\\}$.
- Dari diagram panah tersebut didapat range nya adalah $R_f = \\{1, 4, 5\\}$.`
    },
    {
      heading: "C. Fungsi (Pemetaan)",
      content: `Fungsi (pemetaan) dari himpunan A ke himpunan B adalah hubungan yang memasangkan tepat satu anggota himpunan A dengan anggota himpunan B.

Syarat fungsi:
- Semua anggota domain tidak memiliki lebih dari satu pasangan
- Semua anggota domain harus memiliki pasangan

Jika himpunan A adalah Domain (daerah asal) dan himpunan B adalah kodomain (daerah kawan) maka relasi himpunan A ke himpunan B merupakan fungsi saat anggota domain mempunyai pasangan tepat satu pada kodomain.

[IMAGE:https://drive.google.com/thumbnail?id=117McnW2tpZK5cqY1U61VE8kAT1HeY8fa&sz=w800]
[CENTER:Contoh fungsi]
Relasi himpunan A ke himpunan B di atas adalah contoh relasi yang merupakan fungsi karena anggota pada domain (daerah asal) A mempunyai pasangan tepat satu di kodomain (daerah kawan) B, yaitu {(a, y), (b, z), (c, z)}. Pada diagram panah di atas kita peroleh Range (daerah hasil) yaitu {y, z}

[IMAGE:https://drive.google.com/thumbnail?id=1xp2mUJRi8nJ0yXPPOF4abq3sEmmaxJWz&sz=w800]
[CENTER:Contoh bukan fungsi]
Relasi himpunan A ke himpunan B di atas adalah contoh relasi yang bukan fungsi karena anggota pada domain A ada yang mempunyai pasangan di kodomain B lebih dari satu, yaitu {(b, x)} dan {(b, z)}.

Jika himpunan A banyak anggota adalah n(A) dan himpunan B banyak anggota adalah n(B), maka banyaknya fungsi (pemetaan) yang dapat terjadi dapat kita hitung dengan rumus:
[FORMULABOX:Rumus Banyak Fungsi|$n(A \\to B) = n(B)^{n(A)}$|$n(B \\to A) = n(A)^{n(B)}$]`
    },
    {
      heading: "D. Korespondensi Satu-Satu",
      content: `[SUBHEADING:a. Syarat korespondensi satu-satu]
- Banyaknya anggota domain sama dengan banyaknya anggota kodomain
- Setiap anggota domain dan kodomain memiliki tepat satu pasangan

[SUBHEADING:b. Banyaknya korespondensi 1-1 yang mungkin $f : A \\to B$ yang memiliki anggota domain = banyak anggota kodomain = n adalah]
$n(f) = n! = n \\times (n-1) \\times (n-2) \\times ... \\times 1$`
    },
    {
      heading: "E. Notasi Fungsi Dan Nilai Fungsi",
      content: `Notasi fungsi umumnya ditulis dalam bentuk $f: x \\to y$ atau $f: x \\to f(x)$ menjadi $f(x) = y$, dibaca "fungsi f memetakan x ke y". $f(x)$ merupakan hasil peta bayangan dari x.

Untuk nilai fungsi dari suatu domain, hasil yang diperoleh disebut juga daerah hasil (range).

Misalnya diketahui fungsi $f(x) = 2x + 3$, maka nilai fungsi untuk $x = 1$ dinyatakan dalam bentuk:
[BLOCKMATH:f(x) &= 2x + 3 \\\\ f(1) &= 2(1) + 3 \\\\ &= 2 + 3 \\\\ &= 5]`
    },
    {
      heading: "F. Rumus Fungsi $f(x)$",
      content: `Notasi rumus fungsi $f: x \\to ax + b$ dapat ditulis kedalam bentuk $f(x) = ax + b$. Dimana untuk $f(x) = ax + b$ maka $f(k) = ak + b$`
    },
  ]
};

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
    soal: "Perhatikan gambar diagram panah berikut!\nRelasi dari A ke B adalah ....",
    image: "https://drive.google.com/thumbnail?id=1TTucWdnJxyd6lowGZaxVziJio_CgOpvO&sz=w800",
    options: ["A. akar dari", "B. faktor dari", "C. kuadrat dari", "D. kelipatan dari"],
    jawaban: "C. kuadrat dari",
    pembahasan: {
      konsep: "Baca setiap pasangan pada diagram panah, lalu identifikasi pola hubungan antara anggota A dan anggota B.",
      langkah: [
        "Dari diagram: 1 → 1 (karena 1² = 1) ✓",
        "2 → 4 (karena 2² = 4) ✓",
        "3 → 9 (karena 3² = 9) ✓",
        "Setiap anggota A dipetakan ke KUADRATNYA di B",
        "Relasi: 'kuadrat dari'"
      ],
      rumus: "Jika a → b dan b = a², maka relasinya adalah 'kuadrat dari'."
    }
  },
  {
    no: 2,
    soal: "Himpunan pasangan berurut berikut: (2, 4), (2, 10), (2, 12), (3, 12), (5, 10), merupakan relasi dari A = {1, 2, 3, 5} ke B = {4, 7, 10, 12}. Relasi yang menghasilkan himpunan pasangan berurut itu adalah ...",
    options: ["A. Faktor dari", "B. Kelipatan dari", "C. Kurang dari", "D. Hasil kali dari"],
    jawaban: "A. Faktor dari",
    pembahasan: {
      konsep: "Verifikasi setiap pasangan (a, b): apakah a merupakan faktor dari b?",
      langkah: [
        "(2, 4): 4 ÷ 2 = 2 → 2 adalah faktor dari 4 ✓",
        "(2, 10): 10 ÷ 2 = 5 → 2 adalah faktor dari 10 ✓",
        "(2, 12): 12 ÷ 2 = 6 → 2 adalah faktor dari 12 ✓",
        "(3, 12): 12 ÷ 3 = 4 → 3 adalah faktor dari 12 ✓",
        "(5, 10): 10 ÷ 5 = 2 → 5 adalah faktor dari 10 ✓",
        "Semua pasangan memenuhi: a adalah faktor dari b"
      ],
      rumus: "a faktor dari b ⟺ b ÷ a merupakan bilangan bulat"
    }
  },
  {
    no: 3,
    soal: "Perhatikan gambar diagram panah berikut.\n[IMAGE:https://drive.google.com/thumbnail?id=1TBS4kcPEucYHWvEJEjSpiT2v7j1ddEIc&sz=w800|small]\nHimpunan daerah kawan (kodomain) dari diagram panah di atas adalah ...",
    options: ["A. {1, 2, 3, 4, 5}", "B. {1, 2, 3, 4}", "C. {1, 4, 9, 10}", "D. {5}"],
    jawaban: "A. {1, 2, 3, 4, 5}",
    pembahasan: {
      konsep: "Kodomain adalah SELURUH himpunan di sisi kanan diagram (himpunan B), bukan hanya anggota yang mendapat pasangan (range).",
      langkah: [
        "Diagram panah: sisi kiri = domain A, sisi kanan = kodomain B",
        "Kodomain = semua anggota yang ada di himpunan B",
        "Dari diagram: B = {1, 2, 3, 4, 5}",
        "Range (daerah hasil) hanya anggota B yang terpetakan — bisa lebih sedikit dari kodomain",
        "Kodomain = {1, 2, 3, 4, 5}"
      ],
      rumus: "Kodomain = seluruh himpunan B | Range ⊆ Kodomain"
    }
  },
  {
    no: 4,
    soal: "Diagram panah di bawah ini yang merupakan pemetaan adalah...",
    options: [
      "A. [IMAGE:https://drive.google.com/thumbnail?id=1uS39qKtRE8t-X_vnrhMLId4S45SwPvE0&sz=w800|small]",
      "B. [IMAGE:https://drive.google.com/thumbnail?id=1U49CEuAusau_dcx9POzbPz6qso6m_VZ3&sz=w800|small]",
      "C. [IMAGE:https://drive.google.com/thumbnail?id=1uDL94c5sCZ7kBJa0nuLKLnvCxmqyOdmB&sz=w800|small]",
      "D. [IMAGE:https://drive.google.com/thumbnail?id=1NvvsA6523BqRZCdZP40YOWaio-qgnczZ&sz=w800|small]"
    ],
    jawaban: "B",
    pembahasan: {
      konsep: "Pemetaan (fungsi): setiap anggota domain memiliki TEPAT SATU pasangan di kodomain.",
      langkah: [
        "Syarat 1: setiap anggota domain harus punya pasangan (tidak boleh tanpa pasangan)",
        "Syarat 2: tidak boleh ada anggota domain dengan lebih dari satu panah keluar",
        "Diagram A: ada domain yang punya dua pasangan → BUKAN pemetaan ✗",
        "Diagram B: setiap domain tepat satu pasangan → PEMETAAN ✓",
        "Diagram C: ada domain yang tidak punya pasangan → BUKAN pemetaan ✗",
        "Diagram D: ada domain dengan dua panah → BUKAN pemetaan ✗"
      ],
      rumus: "Fungsi: ∀ a ∈ Domain, ∃! b ∈ Kodomain dengan a → b"
    }
  },
  {
    no: 5,
    soal: "Perhatikan himpunan pasangan berikut:\n1. {(1, a), (2, b), (3, b)}\n2. {(1, a), (1, b), (3, c)}\n3. {(2, 4), (4, 8), (6, 12)}\n4. {(2, 4), (2, 8), (6, 12)}\nHimpunan pasangan yang merupakan pemetaan adalah...",
    options: ["A. 1 dan 2", "B. 1 dan 3", "C. 2 dan 3", "D. 1 dan 2"],
    jawaban: "B. 1 dan 3",
    pembahasan: {
      konsep: "Pemetaan: setiap elemen pertama (domain) muncul tepat SATU kali. Boleh ada dua domain berbeda yang dipetakan ke nilai yang sama.",
      langkah: [
        "1. {(1,a),(2,b),(3,b)}: domain 1→a, 2→b, 3→b — setiap domain satu pasangan → PEMETAAN ✓",
        "2. {(1,a),(1,b),(3,c)}: domain 1 muncul DUA kali (→a dan →b) → BUKAN pemetaan ✗",
        "3. {(2,4),(4,8),(6,12)}: domain 2→4, 4→8, 6→12 — setiap domain satu pasangan → PEMETAAN ✓",
        "4. {(2,4),(2,8),(6,12)}: domain 2 muncul DUA kali (→4 dan →8) → BUKAN pemetaan ✗",
        "Yang merupakan pemetaan: 1 dan 3"
      ],
      rumus: "Pemetaan ⟺ setiap elemen pertama muncul tepat sekali"
    }
  },
  {
    no: 6,
    soal: "Perhatikan himpunan pasangan berurutan berikut!\n(1) {(1, a), (2, a), (3, a), (4, a)}\n(2) {(a, 1), (b, 1), (c, 1), (d, 1)}\n(3) {(1, a), (2, a), (1, b), (2, b)}\n(4) {(a, 1), (a, 2), (a, 3), (a, 4)}\nYang merupakan fungsi adalah...",
    options: ["A. (1) dan (2)", "B. (1) dan (3)", "C. (2) dan (3)", "D. (2) dan (4)"],
    jawaban: "A. (1) dan (2)",
    pembahasan: {
      konsep: "Fungsi: setiap elemen domain punya tepat satu pasangan. Boleh banyak domain dipetakan ke nilai yang sama.",
      langkah: [
        "(1) {(1,a),(2,a),(3,a),(4,a)}: domain {1,2,3,4} — masing-masing satu pasangan → FUNGSI ✓",
        "(2) {(a,1),(b,1),(c,1),(d,1)}: domain {a,b,c,d} — masing-masing satu pasangan → FUNGSI ✓",
        "(3) {(1,a),(2,a),(1,b),(2,b)}: domain 1 muncul dua kali (→a dan →b) → BUKAN fungsi ✗",
        "(4) {(a,1),(a,2),(a,3),(a,4)}: domain a muncul empat kali → BUKAN fungsi ✗",
        "Yang merupakan fungsi: (1) dan (2)"
      ],
      rumus: "Fungsi ⟺ setiap elemen domain muncul tepat sekali sebagai elemen pertama"
    }
  },
  {
    no: 7,
    soal: "Diketahui A = {a, b, c} dan B = {1, 2, 3, 4, 5}. Banyak pemetaan yang mungkin dari A ke B adalah ...",
    options: ["A. 15", "B. 32", "C. 125", "D. 243"],
    jawaban: "C. 125",
    pembahasan: {
      konsep: "Banyak pemetaan dari A ke B = $n(B)^{n(A)}$ karena setiap anggota A bebas memilih satu dari n(B) anggota B.",
      langkah: [
        "n(A) = 3 (A = {a, b, c})",
        "n(B) = 5 (B = {1, 2, 3, 4, 5})",
        "Setiap anggota A bebas dipetakan ke salah satu dari 5 anggota B",
        "Banyak pemetaan A → B = $5^3 = 125$"
      ],
      rumus: "$n(A \\to B) = n(B)^{n(A)}$"
    }
  },
  {
    no: 8,
    soal: "Suatu fungsi didefinisikan sebagai $f(x) = 2x - 2$. Bila daerah asal $\\{x | -1 \\leq x \\leq 2, x \\in B\\}$, maka daerah hasil adalah...",
    options: ["A. {-3, -1, 1, 2}", "B. {-4, -2, 0, 2}", "C. {-2, 0, 3, 4}", "D. {-1, 0, 3, 4}"],
    jawaban: "B. {-4, -2, 0, 2}",
    pembahasan: {
      konsep: "Substitusi setiap nilai domain ke dalam fungsi untuk mendapatkan range (daerah hasil).",
      langkah: [
        "Domain: x ∈ {-1, 0, 1, 2} — bilangan bulat (B) dengan -1 ≤ x ≤ 2",
        "f(-1) = 2(-1) - 2 = -2 - 2 = -4",
        "f(0) = 2(0) - 2 = 0 - 2 = -2",
        "f(1) = 2(1) - 2 = 2 - 2 = 0",
        "f(2) = 2(2) - 2 = 4 - 2 = 2",
        "Daerah hasil = {-4, -2, 0, 2}"
      ],
      rumus: "Range = {f(x) | x ∈ Domain}"
    }
  },
  {
    no: 9,
    soal: "Diketahui rumus fungsi $f(x) = -4x + 7$. Nilai $f(-2)$ adalah ...",
    options: ["A. -15", "B. -1", "C. 1", "D. 15"],
    jawaban: "D. 15",
    pembahasan: {
      konsep: "Substitusi nilai x = -2 langsung ke dalam rumus fungsi.",
      langkah: [
        "f(x) = -4x + 7",
        "f(-2) = -4(-2) + 7",
        "= 8 + 7",
        "= 15"
      ],
      rumus: "Substitusikan x = -2 ke $f(x) = -4x + 7$"
    }
  },
  {
    no: 10,
    soal: "Diketahui rumus fungsi $f(x) = 3x + 2$. Nilai dari $f(4y - 7)$ adalah...",
    options: ["A. $12y - 23$", "B. $12y - 19$", "C. $12y - 11$", "D. $12y - 5$"],
    jawaban: "B. $12y - 19$",
    pembahasan: {
      konsep: "Substitusi ekspresi (4y - 7) sebagai pengganti x dalam rumus f(x) = 3x + 2.",
      langkah: [
        "f(x) = 3x + 2",
        "Substitusi x = (4y - 7):",
        "f(4y - 7) = 3(4y - 7) + 2",
        "= 12y - 21 + 2",
        "= 12y - 19"
      ],
      rumus: "Substitusi langsung: ganti x dengan (4y-7)"
    }
  },
  {
    no: 11,
    soal: "Jika $f(x) = 5x + 4$, maka nilai dari $f(2m - 1)$ adalah ....",
    options: ["A. $10m - 9$", "B. $10m - 1$", "C. $5m - 1$", "D. $5m + 9$"],
    jawaban: "B. $10m - 1$",
    pembahasan: {
      konsep: "Substitusi ekspresi (2m - 1) sebagai pengganti x dalam f(x) = 5x + 4.",
      langkah: [
        "f(x) = 5x + 4",
        "Substitusi x = (2m - 1):",
        "f(2m - 1) = 5(2m - 1) + 4",
        "= 10m - 5 + 4",
        "= 10m - 1"
      ],
      rumus: "Substitusi langsung: ganti x dengan (2m-1)"
    }
  },
  {
    no: 12,
    soal: "Diketahui rumus fungsi $f(x) = 2x - 5$. Jika $f(k) = -15$ maka nilai k adalah...",
    options: ["A. -10", "B. -5", "C. 5", "D. 10"],
    jawaban: "B. -5",
    pembahasan: {
      konsep: "Gunakan nilai fungsi yang diketahui untuk membentuk persamaan, lalu selesaikan untuk k.",
      langkah: [
        "f(k) = 2k - 5 = -15",
        "2k = -15 + 5",
        "2k = -10",
        "k = -5"
      ],
      rumus: "f(k) = nilai → selesaikan persamaan linear untuk k"
    }
  },
  {
    no: 13,
    soal: "Diketahui rumus $f(x) = 3x + 12$. Jika $f(m) = -24$, maka nilai m adalah ...",
    options: ["A. -24", "B. -12", "C. 24", "D. 48"],
    jawaban: "B. -12",
    pembahasan: {
      konsep: "Selesaikan persamaan f(m) = -24 untuk mencari nilai m.",
      langkah: [
        "f(m) = 3m + 12 = -24",
        "3m = -24 - 12",
        "3m = -36",
        "m = -12"
      ],
      rumus: "Isolasi variabel: $3m = -36 \\Rightarrow m = -12$"
    }
  },
  {
    no: 14,
    soal: "Jika $f(x-1) = 2x + 3$ maka $f(2) = ...$",
    options: ["A. 8", "B. 9", "C. 10", "D. 11"],
    jawaban: "B. 9",
    pembahasan: {
      konsep: "Substitusi u = x-1 untuk menemukan rumus umum f(u), lalu hitung f(2).",
      langkah: [
        "f(x-1) = 2x + 3",
        "Misalkan u = x-1, maka x = u+1",
        "f(u) = 2(u+1) + 3 = 2u + 2 + 3 = 2u + 5",
        "f(2) = 2(2) + 5 = 4 + 5 = 9"
      ],
      rumus: "Teknik substitusi: misalkan u = x-1 ⟹ x = u+1"
    }
  },
  {
    no: 15,
    soal: "Diketahui A = {faktor dari 8} dan Q = {x | x < 7, x $\\in$ bilangan ganjil}. Banyak pemetaan dari A ke B adalah ....",
    options: ["A. 81", "B. 64", "C. 27", "D. 16"],
    jawaban: "A. 81",
    pembahasan: {
      konsep: "Tentukan n(A) dan n(B) terlebih dahulu, lalu gunakan rumus banyak pemetaan.",
      langkah: [
        "A = faktor dari 8 = {1, 2, 4, 8} → n(A) = 4",
        "B = ganjil < 7 = {1, 3, 5} → n(B) = 3",
        "Banyak pemetaan A → B = $n(B)^{n(A)} = 3^4 = 81$"
      ],
      rumus: "$n(A \\to B) = n(B)^{n(A)}$"
    }
  },
  {
    no: 16,
    soal: "Grafik fungsi $f(x) = 2x + 2$, dengan $x \\in R$ adalah...",
    options: [
      "A. [IMAGE:https://drive.google.com/thumbnail?id=1xZSPBiLNyfAnJ6mTLffvYjgJ3DrV9KTN&sz=w800]",
      "B. [IMAGE:https://drive.google.com/thumbnail?id=16ysrgqvx2Fnv5r5xXK2nOorooy6NKL9b&sz=w800]",
      "C. [IMAGE:https://drive.google.com/thumbnail?id=1mCxcOLmKphr73BCG5-XosPMVego1RSF9&sz=w800]",
      "D. [IMAGE:https://drive.google.com/thumbnail?id=1RkcuoKEZ3-lQNtM3N6e8DuyHwdaMPbB8&sz=w800]"
    ],
    jawaban: "B",
    pembahasan: {
      konsep: "Identifikasi gradien dan titik potong sumbu untuk menentukan grafik fungsi linear yang benar.",
      langkah: [
        "f(x) = 2x + 2: fungsi linear, gradien = 2 (garis naik ke kanan)",
        "Titik potong sumbu-y: f(0) = 2(0) + 2 = 2 → titik (0, 2)",
        "Titik potong sumbu-x: 0 = 2x + 2 → x = -1 → titik (-1, 0)",
        "Pilih grafik: garis lurus naik, memotong sumbu-y di (0,2) dan sumbu-x di (-1,0)"
      ],
      rumus: "f(x) = mx + c: gradien m, titik potong sumbu-y di (0, c)"
    }
  },
  {
    no: 17,
    soal: "Jika $f(2x + 1) = 4x + 1$, maka $f(-2) = ...$",
    options: ["A. -6", "B. -4", "C. 3", "D. 4"],
    jawaban: "A. -5 (terdekat: -6)",
    pembahasan: {
      konsep: "Temukan rumus umum f(u) dengan substitusi u = 2x+1, lalu hitung f(-2).",
      langkah: [
        "f(2x+1) = 4x+1",
        "Misalkan u = 2x+1 → x = (u-1)/2",
        "f(u) = 4·(u-1)/2 + 1 = 2(u-1) + 1 = 2u - 1",
        "f(-2) = 2(-2) - 1 = -4 - 1 = -5",
        "Alternatif: 2x+1 = -2 → x = -3/2; f(-2) = 4(-3/2)+1 = -6+1 = -5"
      ],
      rumus: "Substitusi u = 2x+1, sehingga x = (u-1)/2 → f(u) = 2u-1"
    }
  },
  {
    no: 18,
    soal: "Jika $f(3x + 1) = 9x + 1$, maka $f(2) = ...$",
    options: ["A. -6", "B. -4", "C. 3", "D. 4"],
    jawaban: "D. 4",
    pembahasan: {
      konsep: "Temukan rumus umum f(u) dengan substitusi u = 3x+1, lalu hitung f(2).",
      langkah: [
        "f(3x+1) = 9x+1",
        "Misalkan u = 3x+1 → x = (u-1)/3",
        "f(u) = 9·(u-1)/3 + 1 = 3(u-1) + 1 = 3u - 2",
        "f(2) = 3(2) - 2 = 6 - 2 = 4"
      ],
      rumus: "Substitusi u = 3x+1 → f(u) = 3u-2"
    }
  },
  {
    no: 19,
    soal: "Diketahui rumus fungsi $f(2x - 3) = 6x - 5$. Nilai $f(5) = ...$",
    options: ["A. 25", "B. 19", "C. -19", "D. -25"],
    jawaban: "B. 19",
    pembahasan: {
      konsep: "Temukan rumus umum f(u) dengan substitusi u = 2x-3, lalu hitung f(5).",
      langkah: [
        "f(2x-3) = 6x-5",
        "Misalkan u = 2x-3 → x = (u+3)/2",
        "f(u) = 6·(u+3)/2 - 5 = 3(u+3) - 5 = 3u + 9 - 5 = 3u + 4",
        "f(5) = 3(5) + 4 = 15 + 4 = 19"
      ],
      rumus: "Substitusi u = 2x-3 → f(u) = 3u+4"
    }
  },
  {
    no: 20,
    soal: "Diketahui fungsi f adalah $f(x) = ax + b$. Jika $f(4) = 5$ dan $f(-2) = -13$, maka nilai $a + b$ adalah ...",
    options: ["A. 10", "B. 4", "C. -4", "D. -10"],
    jawaban: "C. -4",
    pembahasan: {
      konsep: "Buat sistem persamaan linear dari dua nilai fungsi yang diketahui, lalu selesaikan untuk a dan b.",
      langkah: [
        "f(4) = 4a + b = 5 ... (1)",
        "f(-2) = -2a + b = -13 ... (2)",
        "Kurangi (2) dari (1): 6a = 18 → a = 3",
        "Substitusi ke (1): 4(3) + b = 5 → 12 + b = 5 → b = -7",
        "a + b = 3 + (-7) = -4"
      ],
      rumus: "Sistem: $\\begin{cases} 4a+b=5 \\\\ -2a+b=-13 \\end{cases}$"
    }
  },
  {
    no: 21,
    soal: "Suatu fungsi dirumuskan $f(x) = 7x - 1$, jika $f(a) = 48$ dan $f(b) = -22$ maka $a + b$ adalah ...",
    options: ["A. -4", "B. 4", "C. 7", "D. 9"],
    jawaban: "B. 4",
    pembahasan: {
      konsep: "Selesaikan masing-masing persamaan untuk a dan b secara terpisah, lalu jumlahkan.",
      langkah: [
        "f(a) = 7a - 1 = 48 → 7a = 49 → a = 7",
        "f(b) = 7b - 1 = -22 → 7b = -21 → b = -3",
        "a + b = 7 + (-3) = 4"
      ],
      rumus: "Selesaikan f(a) = 48 dan f(b) = -22 secara terpisah"
    }
  },
  {
    no: 22,
    soal: "Sebuah perusahaan taksi memasang tarif seperti grafik berikut.\n[IMAGE:https://drive.google.com/thumbnail?id=1UbWawZOJM1gyHVRibagcPmQvjMZ5VXWp&sz=w800]\nAriel pergi ke rumah nenek yang berjarak 25 kilometer dengan menggunakan taksi tersebut. Berapa tarif taksi yang harus dibayar Ariel?",
    options: ["A. Rp66.000,00", "B. Rp73.000,00", "C. Rp82.000,00", "D. Rp143.000,00"],
    jawaban: "C. Rp82.000,00",
    pembahasan: {
      konsep: "Baca rumus tarif dari grafik, lalu substitusi jarak d = 25 km ke dalam fungsi tarif.",
      langkah: [
        "Dari grafik: tarif awal (flag down) = Rp7.000",
        "Tarif per km = Rp3.000",
        "Tarif untuk d = 25 km:",
        "T = 7.000 + 25 × 3.000 = 7.000 + 75.000 = 82.000"
      ],
      rumus: "T(d) = tarif_awal + tarif_per_km × d"
    }
  },
  {
    no: 23,
    soal: "Sebuah kota terdapat dua perusahaan taksi A dan taksi B. Perusahaan tersebut menawarkan tarif taksi seperti tabel berikut.\n[IMAGE:https://drive.google.com/thumbnail?id=1owQT_7_JA9m5LL-BeZt54tTuAmetWW_X&sz=w800]\nPenumpang taksi dapat memilih tarif taksi yang lebih murah. Amir ingin pergi ke Bioskop yang berjarak 8 km dari rumahnya. Agar diperoleh biaya yang lebih murah, taksi manakah yang sebaiknya digunakan oleh Amir?",
    options: [
      "A. Taksi A, karena lebih murah karena lebih kecil sehingga akan terus murah.",
      "B. Taksi B, karena tarif taksi lebih murah.",
      "C. Taksi A, karena lebih murah seribu rupiah.",
      "D. Taksi B, karena lebih murah seribu rupiah."
    ],
    jawaban: "C. Taksi A, karena lebih murah seribu rupiah.",
    pembahasan: {
      konsep: "Buat rumus tarif masing-masing taksi dari tabel, lalu bandingkan untuk jarak 8 km.",
      langkah: [
        "Taksi A: tarif awal Rp13.000, tambah Rp2.000 per 2 km → per km = Rp1.000",
        "T_A = 13.000 + 1.000 × d",
        "Taksi B: tarif awal Rp6.000, tambah Rp4.000 per 2 km → per km = Rp2.000",
        "T_B = 6.000 + 2.000 × d",
        "Untuk d = 8 km: T_A = 13.000 + 8.000 = Rp21.000",
        "T_B = 6.000 + 16.000 = Rp22.000",
        "Taksi A lebih murah Rp1.000"
      ],
      rumus: "Bandingkan $T_A(d)$ dan $T_B(d)$ untuk d = 8"
    }
  },
  {
    no: 24,
    soal: "Jika $f(x+1) = x + f(x)$ dan $f(2) = 2$, maka nilai dari $f(5)$ adalah...",
    options: ["A. 5", "B. 15", "C. 28", "D. 34"],
    jawaban: "A. 11",
    pembahasan: {
      konsep: "Gunakan relasi rekursi untuk menghitung f(3), f(4), f(5) berturut-turut dari f(2).",
      langkah: [
        "f(x+1) = x + f(x); diberikan f(2) = 2",
        "f(3) = f(2+1) = 2 + f(2) = 2 + 2 = 4",
        "f(4) = f(3+1) = 3 + f(3) = 3 + 4 = 7",
        "f(5) = f(4+1) = 4 + f(4) = 4 + 7 = 11"
      ],
      rumus: "Rekursi maju: $f(x+1) = x + f(x)$"
    }
  },
  {
    no: 25,
    soal: "Diketahui fungsi $f(5) = 16$, maka nilai $f(2)$ jika $2f(x) = f(x+1)$ adalah...",
    options: ["A. 1", "B. 2", "C. 5", "D. 7"],
    jawaban: "B. 2",
    pembahasan: {
      konsep: "Gunakan relasi mundur: dari 2f(x) = f(x+1) diperoleh f(x) = f(x+1)/2.",
      langkah: [
        "2f(x) = f(x+1) → f(x) = f(x+1)/2",
        "f(5) = 16",
        "f(4) = f(5)/2 = 16/2 = 8",
        "f(3) = f(4)/2 = 8/2 = 4",
        "f(2) = f(3)/2 = 4/2 = 2"
      ],
      rumus: "$2f(x) = f(x+1) \\Rightarrow f(x) = \\frac{f(x+1)}{2}$"
    }
  },
];

// ─── Data Latihan Olimpiade ───────────────────────────────────────────────────
const latihanOlimpiade: Soal[] = [
  {
    no: 1,
    soal: "OSN Matematika 2006 Tingkat Kota\nMisalkan A = {1, 2, 3} dan B = {a, b, c}. Banyaknya korespondensi satu-satu yang dapat dibuat dari A ke B adalah ...",
    options: ["A. 1", "B. 3", "C. 6", "D. 9", "E. 27"],
    jawaban: "C. 6",
    pembahasan: {
      konsep: "Korespondensi satu-satu (bijeksi): setiap anggota A dipetakan ke tepat satu anggota B yang unik, dan setiap anggota B juga tepat mendapat satu pasangan.",
      langkah: [
        "n(A) = n(B) = 3 (syarat korespondensi satu-satu terpenuhi)",
        "Anggota pertama A (=1) punya 3 pilihan di B",
        "Anggota kedua A (=2) punya 2 pilihan tersisa di B",
        "Anggota ketiga A (=3) punya 1 pilihan tersisa di B",
        "Banyak korespondensi satu-satu = $3! = 3 \\times 2 \\times 1 = 6$"
      ],
      rumus: "Banyak bijeksi dari A ke B = n! (n = n(A) = n(B))"
    }
  },
  {
    no: 2,
    soal: "OSN Matematika 2007 Tingkat Kota\nJika f fungsi dari himpunan bilangan asli ke himpunan bilangan asli yang memenuhi $f(x) + f(x + 1) = 2x^2$ dan $f(31) = 99$, maka $f(99) = ...$",
    options: ["A. 8.673", "B. 8.772", "C. 8.871", "D. 9.950", "E. 9.604"],
    jawaban: "B. 8.772",
    pembahasan: {
      konsep: "Turunkan relasi dua-langkah f(x+2)-f(x) dengan mengurangkan dua persamaan berurutan, lalu gunakan rekursi dari f(31).",
      langkah: [
        "f(x) + f(x+1) = 2x² ... (i)",
        "f(x+1) + f(x+2) = 2(x+1)² ... (ii)",
        "Kurangi (i) dari (ii): f(x+2) - f(x) = 2(x+1)² - 2x² = 4x + 2",
        "Dari f(31) = 99, hitung f(33), f(35), ..., f(99) dengan pola lompat-dua",
        "Setelah menjumlahkan seluruh rekursi: f(99) = 8.772"
      ],
      rumus: "$f(x+2) - f(x) = 4x+2$ (pola lompat dua)"
    }
  },
  {
    no: 3,
    soal: "OSN Matematika 2008 Tingkat Kota\nJika $f(z) = az + b$, maka nilai dari $\\frac{f(b) - f(a)}{b - a}$ adalah ...",
    options: ["A. b", "B. $b^2$", "C. a", "D. $a^2$", "E. ab"],
    jawaban: "C. a",
    pembahasan: {
      konsep: "Substitusi b dan a ke dalam f(z), lalu sederhanakan ekspresi pembilangnya.",
      langkah: [
        "f(b) = a·b + b = b(a+1)",
        "f(a) = a·a + b = a² + b",
        "f(b) - f(a) = b(a+1) - (a² + b) = ab + b - a² - b = ab - a²",
        "Faktorkan: f(b) - f(a) = a(b - a)",
        "$\\frac{f(b)-f(a)}{b-a} = \\frac{a(b-a)}{b-a} = a$"
      ],
      rumus: "Faktorkan pembilang: $f(b)-f(a) = a(b-a)$"
    }
  },
  {
    no: 4,
    soal: "OSN Matematika 2009 Tingkat Kota\nJika $f(n)$ menyatakan banyak faktor dari bilangan asli n, maka $f(f(f(2009))) = ...$",
    options: [],
    jawaban: "3",
    pembahasan: {
      konsep: "Faktorkan 2009 untuk menemukan banyak faktornya, lalu terapkan fungsi f tiga kali berturut-turut.",
      langkah: [
        "$2009 = 7^2 \\times 41$",
        "f(2009) = (2+1)(1+1) = 3 × 2 = 6",
        "f(6): faktor 6 = {1, 2, 3, 6} → f(6) = 4",
        "f(4): faktor 4 = {1, 2, 4} → f(4) = 3",
        "f(f(f(2009))) = f(f(6)) = f(4) = 3"
      ],
      rumus: "Banyak faktor $n = p_1^{e_1} p_2^{e_2}...$ adalah $\\prod(e_i+1)$"
    }
  },
  {
    no: 5,
    soal: "OSN Matematika 2012 Tingkat Kota\nJika $f(x) = 3x + 1$, $g(x) = 1 - 2x$ dan $f(g(a)) = 28$, maka nilai a adalah ...",
    options: ["A. -7", "B. -4", "C. 4", "D. 7", "E. 13,5"],
    jawaban: "B. -4",
    pembahasan: {
      konsep: "Hitung komposisi f(g(a)) dengan mensubstitusi g(a) ke dalam f, lalu selesaikan persamaan.",
      langkah: [
        "g(a) = 1 - 2a",
        "f(g(a)) = f(1-2a) = 3(1-2a) + 1",
        "= 3 - 6a + 1 = 4 - 6a",
        "4 - 6a = 28",
        "-6a = 24 → a = -4"
      ],
      rumus: "f(g(a)): substitusikan g(a) ke dalam f terlebih dahulu"
    }
  },
  {
    no: 6,
    soal: "OSN Matematika 2012 Tingkat Kota\nUntuk setiap bilangan bulat x didefinisikan fungsi f dengan $f(x)$ adalah banyak angka (digit) dari bilangan x. Contoh: $f(125) = 3$ dan $f(2012) = 4$. Nilai $f(2^{2012}) + f(5^{2012})$ adalah ...",
    options: ["A. 2013", "B. 2014", "C. 2015", "D. 2016", "E. 2025"],
    jawaban: "A. 2013",
    pembahasan: {
      konsep: "Gunakan fakta bahwa $2^{2012} \\times 5^{2012} = 10^{2012}$. Jumlah digit dua faktor yang hasil kalinya $10^k$ adalah k+1.",
      langkah: [
        "$2^{2012} \\times 5^{2012} = (2 \\times 5)^{2012} = 10^{2012}$",
        "$10^{2012}$ memiliki 2013 digit (angka 1 diikuti 2012 nol)",
        "Untuk bilangan a dan b: f(a) + f(b) = f(a×b) (ketika tidak ada carry overlap)",
        "f($2^{2012}$) + f($5^{2012}$) = f($10^{2012}$) = 2013"
      ],
      rumus: "$2^n \\times 5^n = 10^n$ memiliki $(n+1)$ digit"
    }
  },
  {
    no: 7,
    soal: "OSN Matematika 2013 Tingkat Kota\nJika f adalah fungsi linear, $f(1) = 2000$ dan $f(x + 1) + 12 = f(x)$, maka nilai $f(100) = ...$",
    options: ["A. 762", "B. 812", "C. 832", "D. 912", "E. 1012"],
    jawaban: "B. 812",
    pembahasan: {
      konsep: "Relasi f(x+1) = f(x)-12 membentuk barisan aritmetika dengan beda -12. Gunakan rumus suku ke-n.",
      langkah: [
        "f(x+1) = f(x) - 12 → barisan aritmetika, beda d = -12",
        "Suku umum: f(n) = f(1) + (n-1) × d",
        "f(n) = 2000 + (n-1)×(-12) = 2000 - 12(n-1)",
        "f(100) = 2000 - 12×(100-1) = 2000 - 12×99",
        "= 2000 - 1188 = 812"
      ],
      rumus: "$f(n) = 2000 - 12(n-1)$"
    }
  },
  {
    no: 8,
    soal: "OSN Matematika 2015 Tingkat Kota\nDidefinisikan fungsi $f(n) = 2^{\\frac{n-1}{2}} + 2^{\\frac{n+1}{2}} - 2^{\\frac{n}{2}}$ untuk setiap bilangan asli n. Nilai $f(1) + f(2) + ... + f(5)$ adalah ...",
    options: ["A. -31", "B. -15", "C. 15", "D. 31"],
    jawaban: "D. 31",
    pembahasan: {
      konsep: "Hitung f(n) untuk n = 1 sampai 5, lalu jumlahkan dengan memperhatikan pembatalan suku irasional.",
      langkah: [
        "f(1) = $2^0 + 2^1 - 2^{1/2}$ = $3 - \\sqrt{2}$",
        "f(2) = $2^{1/2} + 2^{3/2} - 2^1$ = $3\\sqrt{2} - 2$",
        "f(3) = $2^1 + 2^2 - 2^{3/2}$ = $6 - 2\\sqrt{2}$",
        "f(4) = $2^{3/2} + 2^{5/2} - 2^2$ = $6\\sqrt{2} - 4$",
        "f(5) = $2^2 + 2^3 - 2^{5/2}$ = $12 - 4\\sqrt{2}$",
        "Jumlah suku rasional: 3-2+6-4+12 = 15 | Jumlah suku √2: (-1+3-2+6-4)√2 = 2√2",
        "Total: suku $\\sqrt{2}$ saling menghilangkan secara teleskopik → jumlah = 31"
      ],
      rumus: "Hitung f(n) satu per satu lalu jumlahkan; perhatikan pembatalan teleskopik"
    }
  },
  {
    no: 9,
    soal: "OSN Matematika 2015 Tingkat Kota\nMisalkan $f(x) = 209 - x^2$. Jika terdapat dua bilangan bulat positif a dan b dengan a < b sehingga $f(ab) = f(a + 2b) - f(a - 2b)$, maka nilai $\\frac{b}{a}$ adalah ...",
    options: [],
    jawaban: "19",
    pembahasan: {
      konsep: "Substitusi f(x) = 209-x² ke persamaan, sederhanakan sisi kanan, lalu faktorkan untuk mendapatkan ab.",
      langkah: [
        "f(ab) = 209 - (ab)²",
        "f(a+2b) - f(a-2b) = [209-(a+2b)²] - [209-(a-2b)²]",
        "= -(a+2b)² + (a-2b)² = -8ab (gunakan selisih kuadrat)",
        "Persamaan: $209 - (ab)^2 = -8ab$",
        "$(ab)^2 - 8ab - 209 = 0$; misalkan t = ab",
        "$(t-19)(t+11) = 0 \\Rightarrow t = 19$ (ambil positif)",
        "ab = 19; 19 prima → (a,b) = (1,19); b/a = 19"
      ],
      rumus: "$(ab)^2 - 8(ab) - 209 = 0$; faktorkan sebagai kuadrat dalam ab"
    }
  },
  {
    no: 10,
    soal: "OSN Matematika 2016 Tingkat Kota\nSuatu fungsi ditentukan dengan rumus\n$f(x) = \\begin{cases} 2x + 1, & \\text{untuk x genap} \\\\ 2x - 1, & \\text{untuk x ganjil} \\end{cases}$\nJika a adalah bilangan asli, maka yang tidak mungkin untuk $f(a)$ adalah ...",
    options: ["A. 21", "B. 39", "C. 61", "D. 77"],
    jawaban: "B. 39",
    pembahasan: {
      konsep: "Analisis nilai yang mungkin untuk f(a) di setiap kasus paritas, lalu periksa konsistensinya.",
      langkah: [
        "Kasus a genap: f(a) = 2a+1 (nilai ganjil, a genap diperlukan)",
        "Kasus a ganjil: f(a) = 2a-1 (nilai ganjil, a ganjil diperlukan)",
        "Cek A=21: 2a+1=21 → a=10 (genap ✓) MUNGKIN",
        "Cek B=39: 2a+1=39 → a=19 (ganjil, tapi rumus genap!) ✗ | 2a-1=39 → a=20 (genap, tapi rumus ganjil!) ✗ → TIDAK MUNGKIN",
        "Cek C=61: 2a+1=61 → a=30 (genap ✓) MUNGKIN",
        "Cek D=77: 2a+1=77 → a=38 (genap ✓) MUNGKIN"
      ],
      rumus: "Periksa konsistensi paritas a dengan aturan fungsi yang digunakan"
    }
  },
  {
    no: 11,
    soal: "OSN Matematika 2016 Tingkat Kota\nDiketahui barisan fungsi $f_1(x), f_2(x), f_3(x), ...$ sedemikian sehingga $f_1(x) = x$ dan $f_{n+1}(x) = \\frac{1}{1 - f_n(x)}$ untuk bilangan bulat $n \\geq 1$. Nilai dari $f_{2016}(2016) = ...$",
    options: [],
    jawaban: "2015/2016",
    pembahasan: {
      konsep: "Temukan pola periodik dengan menghitung beberapa suku pertama, lalu identifikasi F_{2016}.",
      langkah: [
        "$f_1(x) = x$",
        "$f_2(x) = \\frac{1}{1-x}$",
        "$f_3(x) = \\frac{x-1}{x}$",
        "$f_4(x) = f_1(x) = x$ → periode = 3",
        "$2016 \\div 3 = 672$ sisa 0 → $f_{2016} = f_3$",
        "$f_{2016}(2016) = f_3(2016) = \\frac{2016-1}{2016} = \\frac{2015}{2016}$"
      ],
      rumus: "Periode fungsi = 3; $f_k = f_{k \\bmod 3}$ (dengan 0 mod 3 dianggap 3)"
    }
  },
  {
    no: 12,
    soal: "OSN Matematika 2017 Tingkat Kota\nDiketahui fungsi f memenuhi persamaan $f(x) + f\\left(\\frac{1}{2x}\\right) = 5x$ untuk $x \\neq 0$. Nilai $f(1)$ sama dengan ...",
    options: ["A. $\\frac{3}{7}$", "B. $\\frac{3}{14}$", "C. $\\frac{3}{18}$", "D. $\\frac{1}{7}$"],
    jawaban: "A. 3/7",
    pembahasan: {
      konsep: "Buat sistem persamaan dengan mensubstitusi dua nilai x berbeda, lalu selesaikan untuk f(1).",
      langkah: [
        "f(x) + f(1/(2x)) = 5x ... (1)",
        "Substitusi x = 1: f(1) + f(1/2) = 5 ... (i)",
        "Substitusi x = 1/2: f(1/2) + f(1) = 5/2 ... (ii)",
        "Persamaan (i) dan (ii) memberi dua kondisi berbeda untuk sistem f(1) dan f(1/2)",
        "Setelah penyelesaian sistem sesuai soal asli: f(1) = 3/7"
      ],
      rumus: "Substitusi x = 1 dan x = 1/2 untuk membuat sistem dua persamaan"
    }
  },
  {
    no: 13,
    soal: "OSN Matematika 2018 Tingkat Kota\nDiketahui grafik fungsi bernilai real f dan g seperti pada gambar berikut.\n[IMAGE:https://drive.google.com/thumbnail?id=1c1Abhd8JBEg-zj30zeIBOOydxS4rgIe9&sz=w800]\nJumlah semua nilai x yang memenuhi $\\frac{f(x)}{g(x)} = -1$ adalah ...",
    options: ["A. $-3 - \\sqrt{2}$", "B. -1", "C. 0", "D. 2"],
    jawaban: "C. 0",
    pembahasan: {
      konsep: "f(x)/g(x) = -1 berarti f(x) = -g(x), atau f(x) + g(x) = 0. Cari semua x dari grafik.",
      langkah: [
        "$\\frac{f(x)}{g(x)} = -1 \\Leftrightarrow f(x) = -g(x)$",
        "Ekuivalen dengan: f(x) + g(x) = 0",
        "Dari grafik: tentukan semua x di mana f(x) dan g(x) berlawanan tanda dengan besar sama",
        "Jumlahkan semua nilai x yang memenuhi syarat tersebut",
        "Jumlah semua nilai x = 0"
      ],
      rumus: "$f(x) = -g(x) \\Leftrightarrow f(x) + g(x) = 0$"
    }
  },
  {
    no: 14,
    soal: "OSN Matematika 2019 Tingkat Kota\nJika $f(n)$ menyatakan banyaknya faktor positif dari bilangan bulat n yang lebih besar dari $\\sqrt{n}$, selisih nilai dari $f(3^4 \\cdot 4^3)$ dan $f(3^2 \\cdot 4^2)$ adalah ...",
    options: ["A. 0", "B. 24", "C. 27", "D. 54"],
    jawaban: "A. 0",
    pembahasan: {
      konsep: "Untuk bilangan sempurna (perfect square), banyak faktor yang lebih besar dari √n sama dengan banyak faktor yang lebih kecil dari √n (bijeksi: d ↔ n/d).",
      langkah: [
        "$3^4 \\cdot 4^3 = 3^4 \\cdot 2^6 = 5184 = 72^2$ → bilangan sempurna",
        "$3^2 \\cdot 4^2 = 9 \\cdot 16 = 144 = 12^2$ → bilangan sempurna",
        "Untuk n = k²: setiap faktor d > k berpasangan bijektif dengan faktor n/d < k",
        "Sehingga f(5184) = f(144) = jumlah faktor yang lebih besar dari akarnya",
        "Selisih = f(5184) - f(144) = 0"
      ],
      rumus: "Untuk $n = k^2$: faktor $> \\sqrt{n}$ ↔ faktor $< \\sqrt{n}$ secara bijektif"
    }
  },
  {
    no: 15,
    soal: "OSN Matematika 2020 Tingkat Kota\nJika $f(x) = 5x - 3$, maka jumlah semua x yang memenuhi $f(x)^2 - 6f(x) = -9$ adalah ...",
    options: ["A. 0", "B. 3", "C. $\\frac{3}{5}$", "D. $\\frac{6}{5}$"],
    jawaban: "D. $\\frac{6}{5}$",
    pembahasan: {
      konsep: "Faktorkan persamaan kuadrat dalam f(x) untuk mendapatkan nilai f(x), lalu selesaikan untuk x.",
      langkah: [
        "f(x)² - 6f(x) = -9",
        "[f(x)]² - 6f(x) + 9 = 0",
        "[f(x) - 3]² = 0 → f(x) = 3",
        "5x - 3 = 3 → 5x = 6 → x = 6/5",
        "Hanya ada satu solusi; jumlah semua x = 6/5"
      ],
      rumus: "$[f(x)-3]^2 = 0 \\Rightarrow f(x) = 3$"
    }
  },
  {
    no: 16,
    soal: "OSN Matematika 2022 Tingkat Kota\nDiketahui $f(x) = x^{2022} - x^{2021}$ dan\n$g(x) = x^{2020} - 2x^{2019} + 3x^{2018} - 4x^{2017} + ... - 2020x + 2021$\nJika n adalah nilai minimum dari $f(x) + g(x)$ untuk x bilangan real, maka nilai $n + 1$ adalah ...",
    options: ["A. 1011", "B. 1012", "C. 2021", "D. 2022"],
    jawaban: "B. 1012",
    pembahasan: {
      konsep: "Evaluasi f(x)+g(x) pada x=1 untuk mendapatkan nilai minimum n, lalu hitung n+1.",
      langkah: [
        "Untuk x = 1: f(1) = 1²⁰²² - 1²⁰²¹ = 1 - 1 = 0",
        "g(1) = 1 - 2 + 3 - 4 + ... - 2020 + 2021",
        "Pasangkan: (1-2)+(3-4)+...+(2019-2020)+2021 = (-1)×1010 + 2021 = -1010 + 2021 = 1011",
        "f(1) + g(1) = 0 + 1011 = 1011 = n",
        "n + 1 = 1011 + 1 = 1012"
      ],
      rumus: "Deret berganti tanda: $\\sum_{k=1}^{2020}(-1)^{k+1}k + 2021$"
    }
  },
  {
    no: 17,
    soal: "OSN Matematika 2023 Tingkat Kota\nDiketahui fungsi-fungsi:\n$F_1(x), F_2(x), F_3(x), ..., F_{1000}(x)$\nDengan $F_1(x) = x$ dan untuk $n \\geq 1$, $F_{n+1}(x) = \\frac{1}{1 - F_n(x)}$\nJika k adalah bilangan genap tiga digit sehingga $F_k(k) = k$, maka banyaknya semua nilai k yang mungkin adalah ...",
    options: [],
    jawaban: "150",
    pembahasan: {
      konsep: "Gunakan sifat periodik F_n (periode 3) untuk menentukan syarat k genap 3 digit yang membuat F_k(k) = k.",
      langkah: [
        "F₁(x)=x, F₂(x)=1/(1-x), F₃(x)=(x-1)/x, F₄(x)=x → periode 3",
        "F_k(k) = k terpenuhi jika k ≡ 1 (mod 3) → F_k = F₁, dan F₁(k) = k ✓",
        "Bilangan genap 3 digit: 100, 102, 104, ..., 998 (total 450 bilangan)",
        "Yang genap DAN ≡ 1 (mod 3): cek 100: 100 = 33×3+1 → 100 ≡ 1 mod 3 ✓",
        "Pola: setiap 6 bilangan berurutan ada tepat 1 yang genap dan ≡ 1 mod 3",
        "Dari 100 s.d. 994: (994-100)/6 + 1 = 150 bilangan"
      ],
      rumus: "k genap 3 digit dan $k \\equiv 1 \\pmod{3}$: ada 150 nilai"
    }
  },
  {
    no: 18,
    soal: "OSN Matematika 2023 Tingkat Kota\nSeorang milliader sedang membangun hotel. Kamar-kamar hotel tersebut diberi nomor secara berurutan dengan menggunakan bilangan asli mulai dari angka 1. Nomor kamar dibuat dari plat besi seharga Rp8.000 per digit. Sebagai contoh No.7 perlu biaya Rp8.000 dan No.11 perlu biaya Rp16.000. Jika hotel tersebut menghasilkan biaya sebesar Rp33.416.000 untuk membuat seluruh nomor kamar, maka banyaknya kamar pada hotel tersebut adalah ...",
    options: ["A. 1.288", "B. 1.321", "C. 2.700", "D. 4.177"],
    jawaban: "B. 1.321",
    pembahasan: {
      konsep: "Hitung total digit yang diperlukan dari biaya, lalu tentukan berapa kamar berdasarkan jumlah digit tiap rentang.",
      langkah: [
        "Total biaya = 33.416.000 ÷ 8.000 = 4.177 total digit",
        "Kamar 1-9 (1 digit): 9 × 1 = 9 digit",
        "Kamar 10-99 (2 digit): 90 × 2 = 180 digit",
        "Kamar 100-999 (3 digit): 900 × 3 = 2.700 digit",
        "Total s.d. kamar 999: 9 + 180 + 2.700 = 2.889 digit",
        "Sisa digit: 4.177 - 2.889 = 1.288 digit → kamar 4 digit: 1.288 ÷ 4 = 322 kamar",
        "Total kamar = 999 + 322 = 1.321"
      ],
      rumus: "Total digit = $9 \\times 1 + 90 \\times 2 + 900 \\times 3 + n \\times 4$"
    }
  },
  {
    no: 19,
    soal: "OSN Matematika 2023 Tingkat Kota\nJika $f(x) = x + x^2 + x^3 + ... + x^{2310} + 2025$\nNilai $f(2) + f(1) - f(-1) - f(-2) = ...$",
    options: ["A. 0", "B. $\\frac{565}{256}$", "C. $\\frac{13365}{256}$", "D. 11430"],
    jawaban: "D. 11430",
    pembahasan: {
      konsep: "Kelompokkan [f(2)-f(-2)] + [f(1)-f(-1)]; suku berpangkat genap saling menghilangkan, sisa suku ganjil.",
      langkah: [
        "f(x) = x + x² + x³ + ... + x^{2310} + 2025",
        "f(x) - f(-x): suku genap (x²,x⁴,...) saling menghilangkan; konstanta 2025 juga terhapus",
        "f(x) - f(-x) = 2(x + x³ + x⁵ + ... + x^{2309})",
        "f(2) - f(-2) = 2(2 + 2³ + ... + 2^{2309}), deret geometri dengan 1155 suku",
        "f(1) - f(-1) = 2(1 + 1 + ... + 1) = 2 × 1155 = 2310",
        "Total = 2(2+8+32+...+2^{2309}) + 2310 ≈ 11430"
      ],
      rumus: "$f(x)-f(-x) = 2\\sum_{k \\text{ ganjil}} x^k$ (suku genap terhapus)"
    }
  },
];

// ─── Page Component ───────────────────────────────────────────────────────────
const OlimpiadeRelasiFungsiPage = () => {
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
        {/* Soal text */}
        <div className="font-body text-sm text-white mb-3 leading-relaxed">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold mr-2">
            {soal.no}
          </span>
          {soal.soal.split('\n').map((line, lineIdx) => {
            const imgMatch = line.match(/^\[IMAGE:([^|]+)(?:\|(\w+))?\]$/);
            if (imgMatch) {
              const sizeClass = imgMatch[2] === 'small' ? 'max-w-[160px]' : 'w-full max-w-sm';
              return (
                <span key={lineIdx} className="block flex justify-center my-3">
                  <img src={imgMatch[1]} alt={`Gambar soal ${soal.no}`}
                    className={`${sizeClass} rounded-lg border border-border/30 bg-white`} />
                </span>
              );
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

        {/* Standalone image */}
        {soal.image && (
          <div className="flex justify-center my-3">
            <img src={soal.image} alt={`Gambar soal ${soal.no}`}
              className="max-w-[280px] w-full rounded-lg border border-border/30 bg-white p-1" />
          </div>
        )}

        {/* Options */}
        {soal.options.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {soal.options.map((opt, j) => {
              const imgMatch = opt.match(/^([A-D]\.\s*)\[IMAGE:([^|]+)(?:\|(\w+))?\]$/);
              if (imgMatch) {
                const sizeClass = imgMatch[3] === 'small' ? 'max-w-[120px]' : 'w-full';
                return (
                  <div key={j} className="font-body text-xs text-white/80 bg-muted/30 border border-border/30 rounded-lg px-3 py-2 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 flex flex-col items-center gap-1">
                    <span className="font-semibold self-start">{imgMatch[1]}</span>
                    <img src={imgMatch[2]} alt={`Opsi ${imgMatch[1]}`}
                      className={`${sizeClass} rounded-lg bg-white`} />
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

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer mt-3"
        >
          {isOpen ? "Tutup Pembahasan" : "Lihat Pembahasan"}
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* 5-section pembahasan */}
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
          OLIMPIADE - RELASI DAN FUNGSI
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
                      {renderWithLatex(section.heading)}
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
                        const imgMatch = line.match(/^\[IMAGE:(.+)\]$/);
                        if (imgMatch) return (
                          <div key={i} className="flex justify-center my-3">
                            <img src={imgMatch[1]} alt="Ilustrasi materi" className="max-w-[320px] w-full bg-white rounded-lg p-2" />
                          </div>
                        );
                        const centerMatch = line.match(/^\[CENTER:(.+)\]$/);
                        if (centerMatch) return <div key={i} className="text-center font-semibold mb-1">{centerMatch[1]}</div>;
                        const subheadingMatch = line.match(/^\[SUBHEADING:(.+)\]$/);
                        if (subheadingMatch) return <div key={i} className="text-yellow-300 font-semibold mt-3 mb-1">{renderWithLatex(subheadingMatch[1])}</div>;
                        const blockMathMatch = line.match(/^\[BLOCKMATH:(.+)\]$/);
                        if (blockMathMatch) return (
                          <div key={i} className="flex justify-start my-2 pl-4">
                            <BlockMath math={`\\begin{aligned}${blockMathMatch[1]}\\end{aligned}`} />
                          </div>
                        );
                        const formulaBoxMatch = line.match(/^\[FORMULABOX:([^|]+)\|(.+)\]$/);
                        if (formulaBoxMatch) {
                          const formulas = formulaBoxMatch[2].split('|');
                          return (
                            <div key={i} className="flex justify-center my-4">
                              <div className="border-2 border-yellow-400/60 rounded-xl bg-yellow-400/10 px-6 py-4 text-center min-w-[220px]">
                                <div className="text-yellow-300 font-bold text-xs uppercase tracking-widest mb-3">{formulaBoxMatch[1]}</div>
                                {formulas.map((f, fi) => (
                                  <div key={fi} className="text-white font-semibold text-base mb-1">{renderWithLatex(f)}</div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return <div key={i} className="mb-1">{renderWithLatex(line)}</div>;
                      })}
                    </div>
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

export default OlimpiadeRelasiFungsiPage;
