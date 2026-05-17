import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Pengertian Peluang", content: `Peluang (probabilitas) adalah ukuran kemungkinan suatu kejadian terjadi.\n\nNotasi: $P(A) = \\dfrac{n(A)}{n(S)}$\n\n- $n(A)$ = banyak kejadian yang diharapkan\n- $n(S)$ = banyak semua kemungkinan (ruang sampel)\n- $0 \\leq P(A) \\leq 1$\n- $P(\\text{pasti terjadi}) = 1$\n- $P(\\text{mustahil}) = 0$` },
  { heading: "B. Ruang Sampel", content: `Ruang sampel (S) = himpunan semua kemungkinan hasil percobaan.\n\nKejadian (A) = bagian dari ruang sampel.\n\nContoh:\n- Melempar dadu: S = {1, 2, 3, 4, 5, 6}, n(S) = 6\n- Melempar koin: S = {A (angka), G (gambar)}, n(S) = 2\n- Melempar 2 koin: S = {AA, AG, GA, GG}, n(S) = 4` },
  { heading: "C. Peluang Komplemen", content: `Peluang komplemen suatu kejadian:\n$P(A^c) = 1 - P(A)$\n\nDimana $A^c$ = kejadian bukan A.` },
  { heading: "D. Peluang Kejadian Majemuk", content: `1. Kejadian saling lepas (mutually exclusive):\n$P(A \\cup B) = P(A) + P(B)$\n\n2. Kejadian tidak saling lepas:\n$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$\n\n3. Kejadian bebas (independent):\n$P(A \\cap B) = P(A) \\times P(B)$\n\n4. Kejadian bersyarat:\n$P(A|B) = \\dfrac{P(A \\cap B)}{P(B)}$` },
  { heading: "E. Aturan Pencacahan", content: `1. Aturan perkalian: pilihan A cara ada m, pilihan B ada n → total = m × n\n\n2. Permutasi (urutan penting):\n$P(n, r) = \\dfrac{n!}{(n-r)!}$\n\n3. Kombinasi (urutan tidak penting):\n$C(n, r) = \\dfrac{n!}{r!(n-r)!}$\n\n$n! = n \\times (n-1) \\times ... \\times 2 \\times 1$` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Sebuah dadu dilempar sekali. Peluang munculnya angka genap adalah …", options: ["A. $\\frac{1}{6}$", "B. $\\frac{1}{3}$", "C. $\\frac{1}{2}$", "D. $\\frac{2}{3}$"], jawaban: "C", pembahasan: "Angka genap: {2, 4, 6}, n(A) = 3, n(S) = 6\n$P = \\frac{3}{6} = \\frac{1}{2}$ → Jawaban C" },
  { no: 2, soal: "Dari kartu angka 1 sampai 20, satu kartu diambil acak. Peluang terambilnya kartu kelipatan 3 adalah …", options: ["A. $\\frac{1}{5}$", "B. $\\frac{3}{10}$", "C. $\\frac{2}{5}$", "D. $\\frac{1}{2}$"], jawaban: "B", pembahasan: "Kelipatan 3: {3,6,9,12,15,18} → 6 kartu\n$P = \\frac{6}{20} = \\frac{3}{10}$ → Jawaban B" },
  { no: 3, soal: "Sebuah koin dilempar 3 kali. Peluang muncul tepat 2 angka adalah …", options: ["A. $\\frac{1}{8}$", "B. $\\frac{1}{4}$", "C. $\\frac{3}{8}$", "D. $\\frac{1}{2}$"], jawaban: "C", pembahasan: "n(S) = 8, kejadian 2A: {AAG,AGA,GAA} = 3\n$P = \\frac{3}{8}$ → Jawaban C" },
  { no: 4, soal: "Dalam sebuah kotak terdapat 5 bola merah, 4 bola biru, 3 bola kuning. Satu bola diambil acak. Peluang terambilnya bola bukan merah adalah …", options: ["A. $\\frac{5}{12}$", "B. $\\frac{7}{12}$", "C. $\\frac{1}{2}$", "D. $\\frac{3}{4}$"], jawaban: "B", pembahasan: "n(S) = 12, bukan merah = 7\n$P = \\frac{7}{12}$ → Jawaban B" },
  { no: 5, soal: "Dua dadu dilempar bersamaan. Peluang jumlah kedua dadu = 7 adalah …", options: ["A. $\\frac{1}{9}$", "B. $\\frac{1}{6}$", "C. $\\frac{7}{36}$", "D. $\\frac{1}{4}$"], jawaban: "B", pembahasan: "n(S) = 36\nJumlah 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6\n$P = \\frac{6}{36} = \\frac{1}{6}$ → Jawaban B" },
  { no: 6, soal: "Peluang seseorang lulus ujian A adalah 0,8 dan ujian B adalah 0,75. Jika kedua ujian bebas, peluang lulus keduanya adalah …", options: ["A. 0,45", "B. 0,55", "C. 0,60", "D. 0,65"], jawaban: "C", pembahasan: "$P(A \\cap B) = 0,8 \\times 0,75 = 0,60$ → Jawaban C" },
  { no: 7, soal: "Dari 5 siswa pria dan 4 siswa wanita, dipilih 1 siswa secara acak sebagai ketua kelas. Peluang terpilihnya siswa wanita adalah …", options: ["A. $\\frac{1}{4}$", "B. $\\frac{4}{9}$", "C. $\\frac{5}{9}$", "D. $\\frac{3}{4}$"], jawaban: "B", pembahasan: "$P = \\frac{4}{9}$ → Jawaban B" },
  { no: 8, soal: "Sebuah dadu dilempar. Peluang muncul angka lebih dari 4 adalah …", options: ["A. $\\frac{1}{6}$", "B. $\\frac{1}{3}$", "C. $\\frac{1}{2}$", "D. $\\frac{2}{3}$"], jawaban: "B", pembahasan: "Angka > 4: {5, 6} → n = 2\n$P = \\frac{2}{6} = \\frac{1}{3}$ → Jawaban B" },
  { no: 9, soal: "Banyak cara menyusun 3 huruf dari kata 'AKAR' tanpa pengulangan adalah …", options: ["A. 12", "B. 18", "C. 24", "D. 36"], jawaban: "C", pembahasan: "AKAR memiliki huruf A(2), K, R → 4 huruf berbeda jika dihitung A berbeda\nPermutasi = $4 \\times 3 \\times 2 = 24$ → Jawaban C" },
  { no: 10, soal: "Dari 8 siswa akan dipilih 3 siswa untuk menjadi pengurus OSIS. Banyak cara pemilihan adalah …", options: ["A. 24", "B. 36", "C. 56", "D. 336"], jawaban: "C", pembahasan: "$C(8,3) = \\frac{8!}{3! \\times 5!} = \\frac{8 \\times 7 \\times 6}{6} = 56$ → Jawaban C" },
  { no: 11, soal: "Dari sebuah kotak berisi 6 bola merah dan 4 bola putih, dua bola diambil sekaligus. Peluang keduanya merah adalah …", options: ["A. $\\frac{1}{3}$", "B. $\\frac{2}{5}$", "C. $\\frac{1}{2}$", "D. $\\frac{2}{3}$"], jawaban: "A", pembahasan: "$P = \\frac{C(6,2)}{C(10,2)} = \\frac{15}{45} = \\frac{1}{3}$ → Jawaban A" },
  { no: 12, soal: "Peluang suatu tim menang adalah $\\frac{2}{5}$. Peluang tim tersebut kalah atau seri adalah …", options: ["A. $\\frac{2}{5}$", "B. $\\frac{3}{5}$", "C. $\\frac{4}{5}$", "D. $\\frac{1}{5}$"], jawaban: "B", pembahasan: "$P(\\text{tidak menang}) = 1 - \\frac{2}{5} = \\frac{3}{5}$ → Jawaban B" },
  { no: 13, soal: "Banyak cara mengatur 5 buku berbeda di rak adalah …", options: ["A. 60", "B. 80", "C. 100", "D. 120"], jawaban: "D", pembahasan: "$5! = 120$ → Jawaban D" },
  { no: 14, soal: "Dari kartu bernomor 1-10, kartu diambil sekali. Peluang angka prima atau genap adalah …", options: ["A. $\\frac{3}{5}$", "B. $\\frac{7}{10}$", "C. $\\frac{4}{5}$", "D. $1$"], jawaban: "B", pembahasan: "Prima: {2,3,5,7} = 4, Genap: {2,4,6,8,10} = 5, Keduanya (2) = 1\n$P = \\frac{4+5-1}{10} = \\frac{8}{10} = \\frac{4}{5}$ → Jawaban C" },
  { no: 15, soal: "Dua kartu diambil satu per satu tanpa pengembalian dari 5 kartu bernomor 1-5. Peluang kartu pertama dan kedua keduanya ganjil adalah …", options: ["A. $\\frac{3}{10}$", "B. $\\frac{1}{5}$", "C. $\\frac{2}{5}$", "D. $\\frac{9}{25}$"], jawaban: "A", pembahasan: "Ganjil: {1,3,5} = 3 kartu\n$P = \\frac{3}{5} \\times \\frac{2}{4} = \\frac{6}{20} = \\frac{3}{10}$ → Jawaban A" },
];

const PeluangPage = () => (
  <TKAPemantapanLayout
    title="PELUANG"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default PeluangPage;
