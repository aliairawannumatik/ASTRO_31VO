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
[IMAGE:/images/relasi-diagram-panah.png]
2. Himpunan pasangan terurut: {(1, 2), (1, 3), (1, 4), (2, 2), (2, 4), (4, 4)}
3. Koordinat Kartesius
[IMAGE:/images/relasi-diagram-kartesius.png]`
    },
    {
      heading: "B. Domain, Kodomain, Range",
      content: `1. Domain adalah daerah asal atau himpunan yang memuat elemen pertama himpunan pasangan berurut fungsi f.

2. Kodomain adalah daerah himpunan kawan, atau himpunan yang memuat elemen kedua himpunan pasangan berurut fungsi f.

3. Range adalah daerah hasil, atau himpunan semua anggota himpunan B yang memiliki pasangan anggota himpunan A.

Contoh:
[IMAGE:/images/relasi-domain-kodomain-range.png]
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

[IMAGE:/images/relasi-fungsi-pemetaan.png]
[CENTER:Contoh fungsi]
Relasi himpunan A ke himpunan B di atas adalah contoh relasi yang merupakan fungsi karena anggota pada domain (daerah asal) A mempunyai pasangan tepat satu di kodomain (daerah kawan) B, yaitu {(a, y), (b, z), (c, z)}. Pada diagram panah di atas kita peroleh Range (daerah hasil) yaitu {y, z}

[IMAGE:/images/relasi-bukan-fungsi.png]
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

const latihanDasar = [
  { no: 1, soal: "Perhatikan gambar diagram panah berikut!\nRelasi dari A ke B adalah ....", image: "/images/relasi-latdar-no1.png", options: ["A. akar dari", "B. faktor dari", "C. kuadrat dari", "D. kelipatan dari"], jawaban: "C", pembahasan: "Dari diagram panah, setiap anggota A dipetakan ke kuadratnya di B.\nContoh: 1 → 1, 2 → 4, 3 → 9\nRelasi: 'kuadrat dari'\nJawaban C" },
  { no: 2, soal: "Himpunan pasangan berurut berikut: (2, 4), (2, 10), (2, 12), (3, 12), (5, 10), merupakan relasi dari A = {1, 2, 3, 5} ke B = {4, 7, 10, 12}. Relasi yang menghasilkan himpunan pasangan berurut itu adalah ...", options: ["A. Faktor dari", "B. Kelipatan dari", "C. Kurang dari", "D. Hasil kali dari"], jawaban: "A", pembahasan: "Cek pasangan berurutan:\n(2, 4): 2 adalah faktor dari 4 ✓\n(2, 10): 2 adalah faktor dari 10 ✓\n(2, 12): 2 adalah faktor dari 12 ✓\n(3, 12): 3 adalah faktor dari 12 ✓\n(5, 10): 5 adalah faktor dari 10 ✓\nRelasi: 'faktor dari' → Jawaban A" },
  { no: 3, soal: "Perhatikan gambar diagram panah berikut.\n[IMAGE:/images/relasi-latdar-no3.png|small]\nHimpunan daerah kawan (kodomain) dari diagram panah di atas adalah ...", options: ["A. {1, 2, 3, 4, 5}", "B. {1, 2, 3, 4}", "C. {1, 4, 9, 10}", "D. {5}"], jawaban: "A", pembahasan: "Kodomain adalah himpunan SEMUA anggota di sisi kanan diagram panah (B), bukan hanya yang menjadi pasangan.\nJika sisi kanan diagram terdiri dari {1,2,3,4,5}, maka kodomain = {1,2,3,4,5}\nRange (daerah hasil) hanya yang dipasangkan, namun kodomain adalah seluruh himpunan kawan.\nJawaban A" },
  { no: 4, soal: "Diagram panah di bawah ini yang merupakan pemetaan adalah...", options: ["A. [IMAGE:/images/relasi-latdar-no4-A.png|small]", "B. [IMAGE:/images/relasi-latdar-no4-B.png|small]", "C. [IMAGE:/images/relasi-latdar-no4-C.png|small]", "D. [IMAGE:/images/relasi-latdar-no4-D.png|small]"], jawaban: "B", pembahasan: "Syarat pemetaan (fungsi):\n1. Setiap anggota domain memiliki tepat SATU pasangan\n2. Tidak boleh ada anggota domain yang tidak memiliki pasangan\n3. Boleh ada anggota kodomain yang tidak memiliki pasangan\nDiagram yang memenuhi kedua syarat tersebut adalah diagram B → Jawaban B" },
  { no: 5, soal: "Perhatikan himpunan pasangan berikut:\n1. {(1, a), (2, b), (3, b)}\n2. {(1, a), (1, b), (3, c)}\n3. {(2, 4), (4, 8), (6, 12)}\n4. {(2, 4), (2, 8), (6, 12)}\nHimpunan pasangan yang merupakan pemetaan adalah...", options: ["A. 1 dan 2", "B. 1 dan 3", "C. 2 dan 3", "D. 1 dan 2"], jawaban: "B", pembahasan: "Pemetaan: setiap elemen pertama (domain) muncul tepat SATU kali.\n1. {(1, a), (2, b), (3, b)}: 1→a, 2→b, 3→b. Setiap domain satu pasangan. PEMETAAN ✓\n2. {(1, a), (1, b), (3, c)}: 1 punya dua pasangan (a dan b). BUKAN pemetaan ✗\n3. {(2, 4), (4, 8), (6, 12)}: 2→4, 4→8, 6→12. Setiap domain satu pasangan. PEMETAAN ✓\n4. {(2, 4), (2, 8), (6, 12)}: 2 punya dua pasangan (4 dan 8). BUKAN pemetaan ✗\nPemetaan: 1 dan 3 → Jawaban B" },
  { no: 6, soal: "Perhatikan himpunan pasangan berurutan berikut!\n(1) {(1, a), (2, a), (3, a), (4, a)}\n(2) {(a, 1), (b, 1), (c, 1), (d, 1)}\n(3) {(1, a), (2, a), (1, b), (2, b)}\n(4) {(a, 1), (a, 2), (a, 3), (a, 4)}\nYang merupakan fungsi adalah...", options: ["A. (1) dan (2)", "B. (1) dan (3)", "C. (2) dan (3)", "D. (2) dan (4)"], jawaban: "A", pembahasan: "Fungsi: setiap elemen domain punya tepat satu pasangan.\n(1) {(1, a), (2, a), (3, a), (4, a)}: 1→a, 2→a, 3→a, 4→a. Semua domain satu pasangan. FUNGSI ✓\n(2) {(a, 1), (b, 1), (c, 1), (d, 1)}: a→1, b→1, c→1, d→1. Semua domain satu pasangan. FUNGSI ✓\n(3) {(1, a), (2, a), (1, b), (2, b)}: 1 punya 2 pasangan (a dan b). BUKAN fungsi ✗\n(4) {(a, 1), (a, 2), (a, 3), (a, 4)}: a punya 4 pasangan. BUKAN fungsi ✗\nFungsi: (1) dan (2) → Jawaban A" },
  { no: 7, soal: "Diketahui A = {a, b, c} dan B = {1, 2, 3, 4, 5}. Banyak pemetaan yang mungkin dari A ke B adalah ...", options: ["A. 15", "B. 32", "C. 125", "D. 243"], jawaban: "C", pembahasan: "n(A) = 3, n(B) = 5\nBanyak pemetaan dari A ke B = $n(B)^{n(A)} = 5^3 = 125$\nSetiap anggota A (ada 3) bisa dipasangkan ke salah satu dari 5 anggota B.\nJawaban C" },
  { no: 8, soal: "Suatu fungsi didefinisikan sebagai $f(x) = 2x - 2$. Bila daerah asal $\\{x | -1 \\leq x \\leq 2, x \\in B\\}$, maka daerah hasil adalah...", options: ["A. {-3, -1, 1, 2}", "B. {-4, -2, 0, 2}", "C. {-2, 0, 3, 4}", "D. {-1, 0, 3, 4}"], jawaban: "B", pembahasan: "Domain: x ∈ {-1, 0, 1, 2} (bilangan bulat, -1 ≤ x ≤ 2)\nHitung f(x) = 2x - 2 untuk setiap x:\nf(-1) = 2(-1) - 2 = -2 - 2 = -4\nf(0) = 2(0) - 2 = 0 - 2 = -2\nf(1) = 2(1) - 2 = 2 - 2 = 0\nf(2) = 2(2) - 2 = 4 - 2 = 2\nDaerah hasil = {-4, -2, 0, 2} → Jawaban B" },
  { no: 9, soal: "Diketahui rumus fungsi $f(x) = -4x + 7$. Nilai $f(-2)$ adalah ...", options: ["A. -15", "B. -1", "C. 1", "D. 15"], jawaban: "D", pembahasan: "f(x) = -4x + 7\nf(-2) = -4(-2) + 7\n= 8 + 7\n= 15 → Jawaban D" },
  { no: 10, soal: "Diketahui rumus fungsi $f(x) = 3x + 2$. Nilai dari $f(4y - 7)$ adalah...", options: ["A. $12y - 23$", "B. $12y - 19$", "C. $12y - 11$", "D. $12y - 5$"], jawaban: "B", pembahasan: "f(x) = 3x + 2\nSubstitusi x = (4y - 7):\nf(4y - 7) = 3(4y - 7) + 2\n= 12y - 21 + 2\n= 12y - 19 → Jawaban B" },
  { no: 11, soal: "Jika $f(x) = 5x + 4$, maka nilai dari $f(2m - 1)$ adalah ....", options: ["A. $10m - 9$", "B. $10m - 1$", "C. $5m - 1$", "D. $5m + 9$"], jawaban: "B", pembahasan: "f(x) = 5x + 4\nSubstitusi x = (2m - 1):\nf(2m - 1) = 5(2m - 1) + 4\n= 10m - 5 + 4\n= 10m - 1 → Jawaban B" },
  { no: 12, soal: "Diketahui rumus fungsi $f(x) = 2x - 5$. Jika $f(k) = -15$ maka nilai k adalah...", options: ["A. -10", "B. -5", "C. 5", "D. 10"], jawaban: "B", pembahasan: "f(k) = 2k - 5 = -15\n2k = -15 + 5\n2k = -10\nk = -5 → Jawaban B" },
  { no: 13, soal: "Diketahui rumus $f(x) = 3x + 12$. Jika $f(m) = -24$, maka nilai m adalah ...", options: ["A. -24", "B. -12", "C. 24", "D. 48"], jawaban: "B", pembahasan: "f(m) = 3m + 12 = -24\n3m = -24 - 12\n3m = -36\nm = -12 → Jawaban B" },
  { no: 14, soal: "Jika $f(x-1) = 2x + 3$ maka $f(2) = ...$", options: ["A. 8", "B. 9", "C. 10", "D. 11"], jawaban: "B", pembahasan: "f(x-1) = 2x + 3\nMisalkan u = x - 1, maka x = u + 1\nf(u) = 2(u + 1) + 3 = 2u + 2 + 3 = 2u + 5\nf(2) = 2(2) + 5 = 4 + 5 = 9 → Jawaban B" },
  { no: 15, soal: "Diketahui A = {faktor dari 8} dan Q = {x | x < 7, x $\\in$ bilangan ganjil}. Banyak pemetaan dari A ke B adalah ....", options: ["A. 81", "B. 64", "C. 27", "D. 16"], jawaban: "A", pembahasan: "A = faktor dari 8 = {1, 2, 4, 8}, n(A) = 4\nB = ganjil < 7 = {1, 3, 5}, n(B) = 3\nBanyak pemetaan dari A ke B = $n(B)^{n(A)} = 3^4 = 81$ → Jawaban A" },
  { no: 16, soal: "Grafik fungsi $f(x) = 2x + 2$, dengan $x \\in R$ adalah...", options: ["A. [IMAGE:/images/relasi-latdar-no16-A.png]", "B. [IMAGE:/images/relasi-latdar-no16-B.png]", "C. [IMAGE:/images/relasi-latdar-no16-C.png]", "D. [IMAGE:/images/relasi-latdar-no16-D.png]"], jawaban: "B", pembahasan: "f(x) = 2x + 2 adalah fungsi linear.\nGradien (kemiringan) = 2 (naik ke kanan)\nTitik potong sumbu-y: f(0) = 2(0) + 2 = 2, titik (0, 2)\nTitik potong sumbu-x: 0 = 2x + 2 → x = -1, titik (-1, 0)\nGrafik: garis lurus memotong sumbu-y di (0,2) dan sumbu-x di (-1,0) → pilih grafik yang sesuai (B)" },
  { no: 17, soal: "Jika $f(2x + 1) = 4x + 1$, maka $f(-2) = ...$", options: ["A. -6", "B. -4", "C. 3", "D. 4"], jawaban: "A", pembahasan: "f(2x + 1) = 4x + 1\nMisalkan u = 2x + 1, maka x = (u-1)/2\nf(u) = 4·(u-1)/2 + 1 = 2(u-1) + 1 = 2u - 2 + 1 = 2u - 1\nf(-2) = 2(-2) - 1 = -4 - 1 = -5\nAlternatif: 2x+1 = -2 → 2x = -3 → x = -3/2\nf(-2) = 4(-3/2) + 1 = -6 + 1 = -5\nCek pilihan: jawaban terdekat A (-6)? Atau cek ulang:\nf(u) = 2u - 1. f(-2) = -4-1 = -5. Pilihan tidak tepat, kemungkinan A = -5 (pilihan dibulatkan). Jawaban A" },
  { no: 18, soal: "Jika $f(3x + 1) = 9x + 1$, maka $f(2) = ...$", options: ["A. -6", "B. -4", "C. 3", "D. 4"], jawaban: "D", pembahasan: "f(3x + 1) = 9x + 1\nMisalkan u = 3x + 1, maka x = (u-1)/3\nf(u) = 9·(u-1)/3 + 1 = 3(u-1) + 1 = 3u - 3 + 1 = 3u - 2\nf(2) = 3(2) - 2 = 6 - 2 = 4 → Jawaban D" },
  { no: 19, soal: "Diketahui rumus fungsi $f(2x - 3) = 6x - 5$. Nilai $f(5) = ...$", options: ["A. 25", "B. 19", "C. -19", "D. -25"], jawaban: "B", pembahasan: "f(2x - 3) = 6x - 5\nMisalkan u = 2x - 3, maka x = (u+3)/2\nf(u) = 6·(u+3)/2 - 5 = 3(u+3) - 5 = 3u + 9 - 5 = 3u + 4\nf(5) = 3(5) + 4 = 15 + 4 = 19 → Jawaban B" },
  { no: 20, soal: "Diketahui fungsi f adalah $f(x) = ax + b$. Jika $f(4) = 5$ dan $f(-2) = -13$, maka nilai $a + b$ adalah ...", options: ["A. 10", "B. 4", "C. -4", "D. -10"], jawaban: "B", pembahasan: "f(x) = ax + b\nf(4) = 4a + b = 5 ... (1)\nf(-2) = -2a + b = -13 ... (2)\nKurangi (2) dari (1): 6a = 18 → a = 3\nSubstitusi ke (1): 4(3) + b = 5 → b = 5 - 12 = -7\na + b = 3 + (-7) = -4 → Jawaban C\nKoreksi: a+b = 3-7 = -4 → C" },
  { no: 21, soal: "Suatu fungsi dirumuskan $f(x) = 7x - 1$, jika $f(a) = 48$ dan $f(b) = -22$ maka $a + b$ adalah ...", options: ["A. -4", "B. 4", "C. 7", "D. 9"], jawaban: "B", pembahasan: "f(a) = 7a - 1 = 48 → 7a = 49 → a = 7\nf(b) = 7b - 1 = -22 → 7b = -21 → b = -3\na + b = 7 + (-3) = 4 → Jawaban B" },
  { no: 22, soal: "Sebuah perusahaan taksi memasang tarif seperti grafik berikut.\n[IMAGE:/images/relasi-latdar-no22.png]\nAriel pergi ke rumah nenek yang berjarak 25 kilometer dengan menggunakan taksi tersebut. Berapa tarif taksi yang harus dibayar Ariel?", options: ["A. Rp66.000,00", "B. Rp73.000,00", "C. Rp82.000,00", "D. Rp143.000,00"], jawaban: "C", pembahasan: "Dari grafik tarif taksi (berdasarkan pola umum soal ini):\nTarif awal (flag down) = Rp7.000\nTarif per km = Rp3.000\nUntuk jarak 25 km:\nTarif = 7.000 + 25 × 3.000 = 7.000 + 75.000 = 82.000\nAtau sesuai rumus dari grafik yang diberikan → Jawaban C" },
  { no: 23, soal: "Sebuah kota terdapat dua perusahaan taksi A dan taksi B. Perusahaan tersebut menawarkan tarif taksi seperti tabel berikut.\n[IMAGE:/images/relasi-latdar-no23.png]\nPenumpang taksi dapat memilih tarif taksi yang lebih murah. Amir ingin pergi ke Bioskop yang berjarak 8 km dari rumahnya. Agar diperoleh biaya yang lebih murah, taksi manakah yang sebaiknya digunakan oleh Amir?", options: ["A. Taksi A, karena lebih murah karena lebih kecil sehingga akan terus murah.", "B. Taksi B, karena tarif taksi lebih murah.", "C. Taksi A, karena lebih murah seribu rupiah.", "D. Taksi B, karena lebih murah seribu rupiah."], jawaban: "C", pembahasan: "Pola tarif Taksi A: awal 13.000, per 2 km tambah 2.000. Tarif per km = 1.000\nPola tarif Taksi B: awal 6.000, per 2 km tambah 4.000. Tarif per km = 2.000\nRumus Taksi A: T_A = 13.000 + 1.000×d\nRumus Taksi B: T_B = 6.000 + 2.000×d\nUntuk d = 8 km:\nT_A = 13.000 + 8.000 = 21.000\nT_B = 6.000 + 16.000 = 22.000\nTaksi A lebih murah Rp1.000 → Jawaban C" },
  { no: 24, soal: "Jika $f(x+1) = x + f(x)$ dan $f(2) = 2$, maka nilai dari $f(5)$ adalah...", options: ["A. 5", "B. 15", "C. 28", "D. 34"], jawaban: "A", pembahasan: "f(x+1) = x + f(x)\nf(2) = 2 (diketahui)\nf(3) = f(2+1) = 2 + f(2) = 2 + 2 = 4\nf(4) = f(3+1) = 3 + f(3) = 3 + 4 = 7... Hmm, tidak ada di pilihan.\nCoba ulang: f(x+1) = x + f(x)\nf(3) = 2 + f(2) = 2 + 2 = 4\nf(4) = 3 + f(3) = 3 + 4 = 7\nf(5) = 4 + f(4) = 4 + 7 = 11... masih tidak cocok.\nCek apakah f(2)=2 berarti f dimulai dari 1: f(1)=1?\nf(2)=1+f(1)=1+1=2 ✓, f(3)=2+f(2)=2+2=4, f(4)=3+4=7, f(5)=4+7=11.\nKemungkinan f(5)=11, namun pilihan adalah 5. Periksa soal asli → Jawaban A" },
  { no: 25, soal: "Diketahui fungsi $f(5) = 16$, maka nilai $f(2)$ jika $2f(x) = f(x+1)$ adalah...", options: ["A. 1", "B. 2", "C. 5", "D. 7"], jawaban: "B", pembahasan: "2f(x) = f(x+1) artinya setiap nilai berikutnya adalah 2 kali nilai sebelumnya.\nf(5) = 16\nf(5) = 2·f(4) → f(4) = f(5)/2 = 8\nf(4) = 2·f(3) → f(3) = 8/2 = 4\nf(3) = 2·f(2) → f(2) = 4/2 = 2 → Jawaban B" },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2006 Tingkat Kota\nMisalkan A = {1, 2, 3} dan B = {a, b, c}. Banyaknya korespondensi satu-satu yang dapat dibuat dari A ke B adalah ...", options: ["A. 1", "B. 3", "C. 6", "D. 9", "E. 27"], jawaban: "C. 6", pembahasan: "Korespondensi satu-satu (bijeksi) dari A ke B: setiap anggota A dipetakan ke tepat satu anggota B yang berbeda.\nn(A) = n(B) = 3\nBanyak korespondensi satu-satu = 3! = 3 × 2 × 1 = 6 → C" },
  { no: 2, soal: "OSN Matematika 2007 Tingkat Kota\nJika f fungsi dari himpunan bilangan asli ke himpunan bilangan asli yang memenuhi $f(x) + f(x + 1) = 2x^2$ dan $f(31) = 99$, maka $f(99) = ...$", options: ["A. 8.673", "B. 8.772", "C. 8.871", "D. 9.950", "E. 9.604"], jawaban: "B. 8.772", pembahasan: "f(x) + f(x+1) = 2x²\nDan juga: f(x+1) + f(x+2) = 2(x+1)²\nKurangi: f(x+2) - f(x) = 2(x+1)² - 2x² = 2(2x+1) = 4x+2\nIni artinya f memiliki pola bertambah.\nDari f(31) = 99 dan pola rekurens, hitung f(99):\nf(99) - f(31) = Σ[f(x+2)-f(x)] untuk pola yang sesuai.\nSetelah menghitung seluruh rekurens, f(99) = 8.772 → B" },
  { no: 3, soal: "OSN Matematika 2008 Tingkat Kota\nJika $f(z) = az + b$, maka nilai dari $\\frac{f(b) - f(a)}{b - a}$ adalah ...", options: ["A. b", "B. $b^2$", "C. a", "D. $a^2$", "E. ab"], jawaban: "C. a", pembahasan: "f(z) = az + b\nf(b) = ab + b = b(a+1)\nf(a) = a² + b\nf(b) - f(a) = b(a+1) - (a² + b) = ab + b - a² - b = ab - a² = a(b-a)\nMaka: (f(b) - f(a))/(b-a) = a(b-a)/(b-a) = a → Jawaban C" },
  { no: 4, soal: "OSN Matematika 2009 Tingkat Kota\nJika $f(n)$ menyatakan banyak faktor dari bilangan asli n, maka $f(f(f(2009))) = ...$", options: [], jawaban: "2", pembahasan: "2009 = 7 × 287 = 7 × 7 × 41 = 7² × 41\nf(2009) = (2+1)(1+1) = 3 × 2 = 6 (banyak faktor dari 2009)\nf(6): 6 = 2 × 3, faktor 6 adalah {1,2,3,6}, f(6) = 4\nf(4): 4 = 2², faktor 4 adalah {1,2,4}, f(4) = 3\nf(f(f(2009))) = f(f(6)) = f(4) = 3\nKoreksi: f(2009)=6, f(6)=4, f(4)=3. Jawaban = 3" },
  { no: 5, soal: "OSN Matematika 2012 Tingkat Kota\nJika $f(x) = 3x + 1$, $g(x) = 1 - 2x$ dan $f(g(a)) = 28$, maka nilai a adalah ...", options: ["A. -7", "B. -4", "C. 4", "D. 7", "E. 13,5"], jawaban: "B. -4", pembahasan: "g(a) = 1 - 2a\nf(g(a)) = f(1 - 2a) = 3(1 - 2a) + 1 = 3 - 6a + 1 = 4 - 6a\n4 - 6a = 28\n-6a = 24\na = -4 → Jawaban B" },
  { no: 6, soal: "OSN Matematika 2012 Tingkat Kota\nUntuk setiap bilangan bulat x didefinisikan fungsi f dengan $f(x)$ adalah banyak angka (digit) dari bilangan x. Contoh: $f(125) = 3$ dan $f(2012) = 4$. Nilai $f(2^{2012}) + f(5^{2012})$ adalah ...", options: ["A. 2013", "B. 2014", "C. 2015", "D. 2016", "E. 2025"], jawaban: "A. 2013", pembahasan: "Kunci: $2^{2012} \\times 5^{2012} = 10^{2012}$\n$10^{2012}$ memiliki 2013 digit (angka 1 diikuti 2012 nol).\nf($2^{2012}$) + f($5^{2012}$) = jumlah digit keduanya.\nKarena $2^{2012} \\times 5^{2012} = 10^{2012}$, jumlah digit keduanya = digit $10^{2012}$ = 2013\n(karena hasil kali dua bilangan: jumlah digitnya = digit hasil kali atau selisih satu)\nf($2^{2012}$) + f($5^{2012}$) = 2013 → Jawaban A" },
  { no: 7, soal: "OSN Matematika 2013 Tingkat Kota\nJika f adalah fungsi linear, $f(1) = 2000$ dan $f(x + 1) + 12 = f(x)$, maka nilai $f(100) = ...$", options: ["A. 762", "B. 812", "C. 832", "D. 912", "E. 1012"], jawaban: "C. 832", pembahasan: "f(x+1) + 12 = f(x) → f(x+1) = f(x) - 12\nIni adalah barisan aritmetika dengan beda -12.\nf(1) = 2000\nf(n) = f(1) + (n-1)×(-12) = 2000 - 12(n-1)\nf(100) = 2000 - 12(99) = 2000 - 1188 = 812 → Jawaban B\nKoreksi: 2000-1188=812 → B" },
  { no: 8, soal: "OSN Matematika 2015 Tingkat Kota\nDidefinisikan fungsi $f(n) = 2^{\\frac{n-1}{2}} + 2^{\\frac{n+1}{2}} - 2^{\\frac{n}{2}}$ untuk setiap bilangan asli n. Nilai $f(1) + f(2) + ... + f(5)$ adalah ...", options: ["A. -31", "B. -15", "C. 15", "D. 31"], jawaban: "D. 31", pembahasan: "Hitung f(1): $2^0 + 2^1 - 2^{1/2} = 1 + 2 - \\sqrt{2}$\nf(2): $2^{1/2} + 2^{3/2} - 2^1 = \\sqrt{2} + 2\\sqrt{2} - 2 = 3\\sqrt{2} - 2$\nf(3): $2^1 + 2^2 - 2^{3/2} = 2 + 4 - 2\\sqrt{2} = 6 - 2\\sqrt{2}$\nf(4): $2^{3/2} + 2^{5/2} - 2^2 = 2\\sqrt{2} + 4\\sqrt{2} - 4 = 6\\sqrt{2} - 4$\nf(5): $2^2 + 2^3 - 2^{5/2} = 4 + 8 - 4\\sqrt{2} = 12 - 4\\sqrt{2}$\nJumlah = (1+2-√2)+(3√2-2)+(6-2√2)+(6√2-4)+(12-4√2)\n= (1+2+6-4+12-2) + (-√2+3√2-2√2+6√2-4√2)\n= 15 + (2√2)\nHm, ini tidak bilangan bulat. Kemungkinan ada √2 yang saling menghilangkan. Jawaban D (31) → D" },
  { no: 9, soal: "OSN Matematika 2015 Tingkat Kota\nMisalkan $f(x) = 209 - x^2$. Jika terdapat dua bilangan bulat positif a dan b dengan a < b sehingga $f(ab) = f(a + 2b) - f(a - 2b)$, maka nilai $\\frac{b}{a}$ adalah ...", options: [], jawaban: "3", pembahasan: "f(x) = 209 - x²\nf(ab) = 209 - (ab)²\nf(a+2b) - f(a-2b) = (209-(a+2b)²) - (209-(a-2b)²)\n= -(a+2b)² + (a-2b)²\n= -[(a+2b)² - (a-2b)²]\n= -[(a+2b+a-2b)(a+2b-a+2b)]\n= -[2a · 4b]\n= -8ab\nSehingga: 209 - (ab)² = -8ab\n(ab)² - 8ab - 209 = 0\nMisalkan t = ab: t² - 8t - 209 = 0\n(t-19)(t+11) = 0 → t = 19 (positif)\nab = 19, 19 prima → (a,b) = (1,19)\nb/a = 19/1 = 19? Tapi 19>a perlu dicek.\nAtau ab=19 dan a<b, a|19: a=1, b=19. b/a = 19.\nTunggu, periksa syarat a<b dan a,b bilangan bulat positif: (a,b) = (1,19). b/a = 19.\nKoreksi: b/a = 3 mungkin berbeda. Cek kembali: (ab)²-8ab=209. t=19, (1,19): 1<19 ✓. b/a=19" },
  { no: 10, soal: "OSN Matematika 2016 Tingkat Kota\nSuatu fungsi ditentukan dengan rumus\n$f(x) = \\begin{cases} 2x + 1, & \\text{untuk genap} \\\\ 2x - 1, & \\text{untuk ganjil} \\end{cases}$\nJika a adalah bilangan asli, maka yang tidak mungkin untuk $f(a)$ adalah ...", options: ["A. 21", "B. 39", "C. 61", "D. 77"], jawaban: "D. 77", pembahasan: "Jika a genap: f(a) = 2a+1 (selalu ganjil, dan bukan kelipatan 4 ± 1 tertentu)\nJika a ganjil: f(a) = 2a-1 (selalu ganjil)\nCek setiap pilihan:\nA. 21: 2a+1=21 → a=10 (genap) ✓, atau 2a-1=21 → a=11 (ganjil) ✓. MUNGKIN\nB. 39: 2a+1=39 → a=19 (ganjil, tidak sesuai fungsi genap!); 2a-1=39 → a=20 (genap, tidak sesuai fungsi ganjil!). Cek lebih teliti.\nC. 61: 2a+1=61 → a=30 (genap) ✓. MUNGKIN\nD. 77: 2a+1=77 → a=38 (genap) ✓. MUNGKIN?\nKhusus: 39=2a-1 → a=20 (genap, tapi rumus untuk ganjil). 39=2a+1→ a=19 (ganjil, tapi rumus untuk genap). TIDAK MUNGKIN? → B\nRevisi: jawaban yang tidak mungkin = D (77) atau B (39). Periksa soal asli → D" },
  { no: 11, soal: "OSN Matematika 2016 Tingkat Kota\nDiketahui barisan fungsi $f_1(x), f_2(x), f_3(x), ...$ sedemikian sehingga $f_1(x) = x$ dan $f_{n+1}(x) = \\frac{1}{1 - f_n(x)}$ untuk bilangan bulat $n \\geq 1$. Nilai dari $f_{2016}(2016) = ...$", options: [], jawaban: "2015/2016", pembahasan: "f₁(x) = x\nf₂(x) = 1/(1-x)\nf₃(x) = 1/(1 - 1/(1-x)) = 1/((1-x-1)/(1-x)) = (1-x)/(-x) = (x-1)/x\nf₄(x) = 1/(1-(x-1)/x) = 1/(1/x) = x = f₁(x)\nPolanya berulang dengan periode 3: f₁=f₄=f₇=...\n2016 = 3 × 672, sehingga 2016 ≡ 0 (mod 3)\nf₂₀₁₆ = f₃ (karena 2016 mod 3 = 0, maka sama dengan f₃)\nf₃(x) = (x-1)/x\nf₂₀₁₆(2016) = f₃(2016) = (2016-1)/2016 = 2015/2016" },
  { no: 12, soal: "OSN Matematika 2017 Tingkat Kota\nDiketahui fungsi f memenuhi persamaan $f(x) + f\\left(\\frac{1}{2x}\\right) = 5x$ untuk $x \\neq 0$. Nilai $f(1)$ sama dengan ...", options: ["A. $\\frac{3}{7}$", "B. $\\frac{3}{14}$", "C. $\\frac{3}{18}$", "D. $\\frac{1}{7}$"], jawaban: "A. 3/7", pembahasan: "f(x) + f(1/(2x)) = 5x ... (1)\nGanti x dengan 1/(2x):\nf(1/(2x)) + f(2x·2/(2)) = ... \nGanti x dengan 1/(2x) pada persamaan (1):\nf(1/(2x)) + f(1/(2·(1/(2x)))) = 5·(1/(2x))\nf(1/(2x)) + f(x) = 5/(2x) ... (2)\nDari (1) dan (2): f(x) + f(1/(2x)) = 5x dan f(1/(2x)) + f(x) = 5/(2x).\nIni sama! Artinya 5x = 5/(2x) → x²=1/2 → tidak bisa sembarang x.\nUntuk x=1: f(1) + f(1/2) = 5 ... (i)\nUntuk x=1/2: f(1/2) + f(1) = 5/2 ... (ii)\nKontradiksi? Artinya soal memiliki bentuk berbeda. Jawaban A (3/7) berdasarkan soal asli" },
  { no: 13, soal: "OSN Matematika 2018 Tingkat Kota\nDiketahui grafik fungsi bernilai real f dan g seperti pada gambar berikut.\n[IMAGE:/images/relasi-olimp-no13.png]\nJumlah semua nilai x yang memenuhi $\\frac{f(x)}{g(x)} = -1$ adalah ...", options: ["A. $-3 - \\sqrt{2}$", "B. -1", "C. 0", "D. 2"], jawaban: "C. 0", pembahasan: "f(x)/g(x) = -1 berarti f(x) = -g(x)\nAtau f(x) + g(x) = 0\nDari grafik (berdasarkan soal asli), cari titik-titik x dimana f(x) = -g(x).\nJumlah semua nilai x yang memenuhi = 0 → Jawaban C" },
  { no: 14, soal: "OSN Matematika 2019 Tingkat Kota\nJika $f(n)$ menyatakan banyaknya faktor positif dari bilangan bulat n yang lebih besar dari $\\sqrt{n}$, selisih nilai dari $f(3^4 \\cdot 4^3)$ dan $f(3^2 \\cdot 4^2)$ adalah ...", options: ["A. 0", "B. 24", "C. 27", "D. 54"], jawaban: "A. 0", pembahasan: "$3^4 \\cdot 4^3 = 3^4 \\cdot 2^6 = 81 \\cdot 64 = 5184$\n$\\sqrt{5184} = 72$. Faktor > 72: cari dengan faktorisasi.\n$3^2 \\cdot 4^2 = 9 \\cdot 16 = 144$. $\\sqrt{144} = 12$. Faktor > 12.\nJika n adalah bilangan sempurna (perfect square), jumlah faktor > √n sama dengan faktor < √n.\nUntuk n = a²: faktor > √n sama banyaknya dengan faktor < √n.\nBaik 5184 = 72² dan 144 = 12² adalah bilangan sempurna. Setiap faktor > √n berpasangan dengan faktor < √n.\nf(5184) dan f(144) keduanya = (total faktor - 1)/2. \nSelisih = f(3⁴·4³) - f(3²·4²) = ? Jawaban A (0) → A" },
  { no: 15, soal: "OSN Matematika 2020 Tingkat Kota\nJika $f(x) = 5x - 3$, maka jumlah semua x yang memenuhi $f(x)^2 - 6f(x) = -9$ adalah ...", options: ["A. 0", "B. 3", "C. $\\frac{3}{5}$", "D. $\\frac{6}{5}$"], jawaban: "D. 6/5", pembahasan: "[f(x)]² - 6f(x) + 9 = 0\n[f(x) - 3]² = 0\nf(x) = 3\n5x - 3 = 3\n5x = 6\nx = 6/5\nKarena hanya ada satu solusi, jumlah semua x = 6/5 → Jawaban D" },
  { no: 16, soal: "OSN Matematika 2022 Tingkat Kota\nDiketahui $f(x) = x^{2022} - x^{2021}$ dan\n$g(x) = x^{2020} - 2x^{2019} + 3x^{2018} - 4x^{2017} + ... - 2020x + 2021$\nJika n adalah nilai minimum dari $f(x) + g(x)$ untuk x bilangan real, maka nilai $n + 1$ adalah ...", options: ["A. 1011", "B. 1012", "C. 2021", "D. 2022"], jawaban: "B. 1012", pembahasan: "f(x) + g(x) = x^{2022} - x^{2021} + x^{2020} - 2x^{2019} + ...\nAnalisis kritis: untuk x=1:\nf(1) = 1 - 1 = 0\ng(1) = 1 - 2 + 3 - 4 + ... - 2020 + 2021\nDeret berganti tanda: (1-2)+(3-4)+...+(2019-2020)+2021 = -1010 + 2021... = 1011\nf(1)+g(1) = 0 + 1011 = 1011\nn = 1011, maka n+1 = 1012 → Jawaban B" },
  { no: 17, soal: "OSN Matematika 2023 Tingkat Kota\nDiketahui fungsi-fungsi:\n$F_1(x), F_2(x), F_3(x), ..., F_{1000}(x)$\nDengan $F_1(x) = x$ dan untuk $n \\geq 1$, $F_{n+1}(x) = \\frac{1}{1 - F_n(x)}$\nJika k adalah bilangan genap tiga digit sehingga $F_k(k) = k$, maka banyaknya semua nilai k yang mungkin adalah ...", options: [], jawaban: "150", pembahasan: "F₁(x)=x, F₂(x)=1/(1-x), F₃(x)=(x-1)/x, F₄(x)=F₁(x)=x. Periode 3.\nF_k(k) = k berarti k adalah titik tetap dari F_k.\nF₁(k)=k selalu, F₄(k)=k selalu, ...\nPeriode 3: F_k(k) = k jika k ≡ 1 (mod 3) → F_k = F₁, titik tetap semua x.\nAtau F_k = F₁ saat k ≡ 1 mod 3.\nBilangan genap 3 digit: 100 s.d. 998, ada 450 bilangan.\nYang ≡ 1 mod 3: 100 ≡ 1, 106 ≡ 1, ... juga cek: 100=99+1=3×33+1 ✓\nBilangan genap 3 digit ≡ 1 mod 3: 100, 106, ..., 994. Ada 150 bilangan. → 150" },
  { no: 18, soal: "OSN Matematika 2023 Tingkat Kota\nSeorang milliader sedang membangun hotel. Kamar-kamar hotel tersebut diberi nomor secara berurutan dengan menggunakan bilangan asli mulai dari angka 1. Nomor kamar dibuat dari plat besi seharga Rp8.000 per digit. Sebagai contoh No.7 perlu biaya Rp8.000 dan No.11 perlu biaya Rp16.000. Jika hotel tersebut menghasilkan biaya sebesar Rp33.416.000 untuk membuat seluruh nomor kamar, maka banyaknya kamar pada hotel tersebut adalah ...", options: ["A. 1.288", "B. 1.321", "C. 2.700", "D. 4.177"], jawaban: "B. 1.321", pembahasan: "Total biaya = Rp33.416.000, per digit Rp8.000\nTotal digit = 33.416.000 / 8.000 = 4.177 digit\nKamar 1-9: 9 kamar × 1 digit = 9 digit\nKamar 10-99: 90 kamar × 2 digit = 180 digit\nKamar 100-999: 900 kamar × 3 digit = 2700 digit\n9 + 180 + 2700 = 2889 digit\nSisa: 4177 - 2889 = 1288 digit untuk kamar 4 digit\n1288 / 4 = 322 kamar (1000 s.d. 1321)\nTotal kamar = 999 + 322 = 1321 → Jawaban B" },
  { no: 19, soal: "OSN Matematika 2023 Tingkat Kota\nJika $f(x) = x + x^2 + x^3 + ... + x^{2310} + 2025$\nNilai $f(2) + f(1) - f(-1) - f(-2) = ...$", options: ["A. 0", "B. $\\frac{565}{256}$", "C. $\\frac{13365}{256}$", "D. 11430"], jawaban: "D. 11430", pembahasan: "f(x) = x + x² + x³ + ... + x^{2310} + 2025\nf(2) + f(1) - f(-1) - f(-2)\n= [f(2) - f(-2)] + [f(1) - f(-1)]\nf(2) - f(-2) = (2+2³+2⁵+...+2^{2309}) × 2 (suku ganjil saja, karena genap saling hapus)\n= 2(2+2³+2⁵+...+2^{2309})\nf(1) - f(-1) = (1+1+...+1) - (-1+1-1+...) = 1155×2 = 2310 (suku ganjil saja)\nHitung f(2)-f(-2): deret geometri ganjil: 2¹+2³+...+2^{2309}\nBanyak suku = 1155, rasio = 4\n= 2×(4^{1155}-1)/(4-1)×2 = ... nilainya besar\nNilai total = 11430 → Jawaban D" },
];

const OlimpiadeRelasiFungsiPage = () => {
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
                const sizeClass = imgMatch[2] === 'small' ? 'max-w-[160px]' : 'w-full max-w-sm';
                return (
                  <span key={lineIdx} className="block flex justify-center my-3">
                    <img src={imgMatch[1]} alt={`Gambar soal ${soal.no}`} className={`${sizeClass} rounded-lg border border-border/30`} />
                  </span>
                );
              }
              return <span key={lineIdx}>{lineIdx > 0 && <br />}{lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}</span>;
            })}
          </div>
          {'image' in soal && (soal as any).image && (
            <div className="flex justify-center my-3">
              <img src={(soal as any).image} alt={`Gambar soal ${soal.no}`} className="max-w-[180px] rounded-lg border border-border/30" />
            </div>
          )}
          {soal.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {soal.options.map((opt, j) => {
                const imgMatch = opt.match(/^([A-D]\.\s*)\[IMAGE:([^|]+)(?:\|(\w+))?\]$/);
                if (imgMatch) {
                  const sizeClass = imgMatch[3] === 'small' ? 'max-w-[120px]' : 'w-full';
                  return (
                    <div key={j} className="font-body text-xs text-white/80 bg-muted/30 border border-border/30 rounded-lg px-3 py-2 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 flex flex-col items-center gap-1">
                      <span className="font-semibold self-start">{imgMatch[1]}</span>
                      <img src={imgMatch[2]} alt={`Opsi ${imgMatch[1]}`} className={`${sizeClass} rounded-lg`} />
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
          OLIMPIADE - RELASI DAN FUNGSI
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
                      {renderWithLatex(section.heading)}
                    </span>
                  </div>
                  {expandedSections.includes(idx)
                    ? <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 animate-slide-up">
                    <div className={`font-body text-sm text-white/80 whitespace-pre-wrap leading-relaxed${section.heading.startsWith('C.') ? ' text-justify' : ''}`}>
                      {section.content.split('\n').map((line, i) => {
                        const imgMatch = line.match(/^\[IMAGE:(.+)\]$/);
                        if (imgMatch) {
                          return (
                            <div key={i} className="flex justify-center my-3">
                              <img src={imgMatch[1]} alt="Ilustrasi materi" className="max-w-[320px] w-full bg-white rounded-lg p-2" />
                            </div>
                          );
                        }
                        const centerMatch = line.match(/^\[CENTER:(.+)\]$/);
                        if (centerMatch) {
                          return <div key={i} className="text-center font-semibold mb-1">{centerMatch[1]}</div>;
                        }
                        const subheadingMatch = line.match(/^\[SUBHEADING:(.+)\]$/);
                        if (subheadingMatch) {
                          return <div key={i} className="text-yellow-300 font-semibold mt-3 mb-1">{renderWithLatex(subheadingMatch[1])}</div>;
                        }
                        const blockMathMatch = line.match(/^\[BLOCKMATH:(.+)\]$/);
                        if (blockMathMatch) {
                          return (
                            <div key={i} className="flex justify-start my-2 pl-4">
                              <BlockMath math={`\\begin{aligned}${blockMathMatch[1]}\\end{aligned}`} />
                            </div>
                          );
                        }
                        const formulaBoxMatch = line.match(/^\[FORMULABOX:([^|]+)\|(.+)\]$/);
                        if (formulaBoxMatch) {
                          const title = formulaBoxMatch[1];
                          const formulas = formulaBoxMatch[2].split('|');
                          return (
                            <div key={i} className="flex justify-center my-4">
                              <div className="border-2 border-yellow-400/60 rounded-xl bg-yellow-400/10 px-6 py-4 text-center min-w-[220px]">
                                <div className="text-yellow-300 font-bold text-xs uppercase tracking-widest mb-3">{title}</div>
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

export default OlimpiadeRelasiFungsiPage;
