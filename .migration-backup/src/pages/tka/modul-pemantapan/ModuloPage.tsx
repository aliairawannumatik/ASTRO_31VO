import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Pengertian Modulo (Aritmatika Modular)", content: `$a \\equiv b \\pmod{m}$ dibaca "$a$ kongruen $b$ modulo $m$"\n\nArtinya: $m \\mid (a - b)$ atau selisih $a$ dan $b$ habis dibagi $m$.\n\nEkuivalen dengan: ketika $a$ dan $b$ dibagi $m$, sisanya sama.\n\nNotasi: $a \\mod m = r$ artinya $r$ adalah sisa pembagian $a$ oleh $m$.` },
  { heading: "B. Sifat-sifat Modulo", content: `Jika $a \\equiv b \\pmod{m}$ dan $c \\equiv d \\pmod{m}$, maka:\n\n1. $(a + c) \\equiv (b + d) \\pmod{m}$\n2. $(a - c) \\equiv (b - d) \\pmod{m}$\n3. $(a \\times c) \\equiv (b \\times d) \\pmod{m}$\n4. $a^k \\equiv b^k \\pmod{m}$` },
  { heading: "C. Perhitungan Sisa Pembagian", content: `Untuk menghitung $a \\mod m$:\n1. Bagi $a$ dengan $m$\n2. Sisa pembagian adalah hasilnya\n\nContoh:\n$17 \\mod 5 = 2$ (karena $17 = 3 \\times 5 + 2$)\n$-7 \\mod 4 = 1$ (karena $-7 = -2 \\times 4 + 1$)` },
  { heading: "D. Aplikasi Modulo", content: `1. Menentukan hari dalam seminggu:\n   - Setiap minggu berulang setiap 7 hari\n   - Gunakan modulo 7\n\n2. Jam dan menit (modulo 12 atau 24)\n\n3. Pola berulang dalam barisan\n\n4. Digit terakhir suatu perpangkatan:\n   - Cari pola siklus digit terakhir\n\nContoh digit terakhir $2^n$:\n$2^1=2$, $2^2=4$, $2^3=8$, $2^4=16$ → pola 4-digit: 2,4,8,6` },
  { heading: "E. Teorema Fermat Kecil", content: `Jika $p$ adalah bilangan prima dan $a$ tidak habis dibagi $p$, maka:\n$a^{p-1} \\equiv 1 \\pmod{p}$\n\nContoh:\n$2^6 \\equiv 1 \\pmod{7}$ (karena $p=7$, $p-1=6$)` },
];

const latihanDasar: LatihanItem[] = [
  {
    no: 1,
    soal: "Tentukan sisa dari:\na. 51 dibagi 5\nb. 123 dibagi 3\nc. 5 dibagi 9\nd. 5555 dibagi 4",
    options: [],
    pembahasan: "",
  },
  {
    no: 2,
    soal: "Tentukan nilai setiap angka berikut pada modulo yang diberikan:\na. $23 \\mod 5$\nb. $27 \\mod 3$\nc. $6 \\mod 8$\nd. $0 \\mod 12$\ne. $38 \\mod 5$",
    options: [],
    pembahasan: "",
  },
  {
    no: 3,
    soal: "Sebuah truk mengangkut tiga jenis barang dengan berat masing-masing 73 kg, 45 kg, dan 98 kg. Jika total berat semua barang tersebut akan dibagi rata ke dalam karung-karung berkapasitas 12 kg, berapakah sisa berat barang yang tidak dapat masuk ke dalam karung terakhir?",
    options: [],
    pembahasan: "",
  },
  {
    no: 4,
    soal: "Berapakah sisa pembagian $(55 + 56 + 57 + 58 + 59 + 60 + 61)$ oleh 60?",
    options: [],
    pembahasan: "",
  },
  {
    no: 5,
    soal: "Sebuah mesin pencetak tiket kereta api memberikan nomor urut secara berurutan. Untuk tujuan audit, setiap tiket yang dicetak diuji dengan mencari sisa pembagian nomor tiket tersebut dengan 150. Jika ada 7 tiket berturut-turut yang dicetak, yaitu dimulai dari tiket bernomor 145, 146, 147, 148, 149, 150, hingga 151, berapakah sisa pembagian total nomor 7 tiket tersebut ketika dibagi dengan 150?",
    options: [],
    pembahasan: "",
  },
  {
    no: 6,
    soal: "Seorang programmer sedang menguji sebuah algoritma enkripsi yang melibatkan perkalian tiga bilangan besar: 25, 34, dan 18. Untuk alasan keamanan, hasil perkalian tersebut harus diuji sisa pembagiannya dengan 11. Berapakah sisa pembagian $(25 \\times 34 \\times 18)$ oleh 11?",
    options: [],
    pembahasan: "",
  },
  {
    no: 7,
    soal: "Seorang desainer grafis membuat pola berulang berdasarkan digit terakhir dari hasil perkalian bilangan-bilangan. Berapakah digit terakhir (nilai satuan) dari hasil perkalian $(127 \\times 354 \\times 789 \\times 416)$?",
    options: [],
    pembahasan: "",
  },
  {
    no: 8,
    soal: "Tentukan sisa dari:\na. $16^2$ dibagi 3\nb. $17^{20}$ dibagi 5\nc. $10^{99}$ dibagi 7\nd. $3^{100}$ dibagi oleh 5\ne. $2^{2015}$ dibagi 9\nf. $3^{1990}$ dibagi 41",
    options: [],
    pembahasan: "",
  },
  {
    no: 9,
    soal: "Tentukan angka terakhir dari $777^{333}$",
    options: [],
    pembahasan: "",
  },
  {
    no: 10,
    soal: "Berapakah digit terakhir dari $3^{2023}$?",
    options: ["A. 3", "B. 9", "C. 1", "D. 7"],
    pembahasan: "",
  },
  {
    no: 11,
    soal: "Berapakah digit terakhir dari $2^{2025}$?",
    options: ["A. 2", "B. 4", "C. 6", "D. 8"],
    pembahasan: "",
  },
  {
    no: 12,
    soal: "Bilangan bulat positif terkecil n sehingga $n!$ habis dibagi oleh 2012 adalah .... (Catatan: $n! = 1 \\times 2 \\times \\cdots \\times n$)",
    options: [],
    pembahasan: "",
  },
  {
    no: 13,
    soal: "Misalkan n adalah bilangan bulat. Jika $n^2 + 2n + 2$ habis dibagi oleh $n + 1$, maka nilai n adalah ....",
    options: [],
    pembahasan: "",
  },
];

const ModuloPage = () => (
  <TKAPemantapanLayout
    title="ARITMATIKA MODULAR (MODULO)"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default ModuloPage;
