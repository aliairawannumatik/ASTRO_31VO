import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Pengertian Modulo (Aritmatika Modular)", content: `$a \\equiv b \\pmod{m}$ dibaca "$a$ kongruen $b$ modulo $m$"\n\nArtinya: $m \\mid (a - b)$ atau selisih $a$ dan $b$ habis dibagi $m$.\n\nEkuivalen dengan: ketika $a$ dan $b$ dibagi $m$, sisanya sama.\n\nNotasi: $a \\mod m = r$ artinya $r$ adalah sisa pembagian $a$ oleh $m$.` },
  { heading: "B. Sifat-sifat Modulo", content: `Jika $a \\equiv b \\pmod{m}$ dan $c \\equiv d \\pmod{m}$, maka:\n\n1. $(a + c) \\equiv (b + d) \\pmod{m}$\n2. $(a - c) \\equiv (b - d) \\pmod{m}$\n3. $(a \\times c) \\equiv (b \\times d) \\pmod{m}$\n4. $a^k \\equiv b^k \\pmod{m}$` },
  { heading: "C. Perhitungan Sisa Pembagian", content: `Untuk menghitung $a \\mod m$:\n1. Bagi $a$ dengan $m$\n2. Sisa pembagian adalah hasilnya\n\nContoh:\n$17 \\mod 5 = 2$ (karena $17 = 3 \\times 5 + 2$)\n$-7 \\mod 4 = 1$ (karena $-7 = -2 \\times 4 + 1$)` },
  { heading: "D. Aplikasi Modulo", content: `1. Menentukan hari dalam seminggu:\n   - Setiap minggu berulang setiap 7 hari\n   - Gunakan modulo 7\n\n2. Jam dan menit (modulo 12 atau 24)\n\n3. Pola berulang dalam barisan\n\n4. Digit terakhir suatu perpangkatan:\n   - Cari pola siklus digit terakhir\n\nContoh digit terakhir $2^n$:\n$2^1=2$, $2^2=4$, $2^3=8$, $2^4=16$ → pola 4-digit: 2,4,8,6` },
  { heading: "E. Teorema Fermat Kecil", content: `Jika $p$ adalah bilangan prima dan $a$ tidak habis dibagi $p$, maka:\n$a^{p-1} \\equiv 1 \\pmod{p}$\n\nContoh:\n$2^6 \\equiv 1 \\pmod{7}$ (karena $p=7$, $p-1=6$)` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Nilai dari $17 \\mod 5$ adalah …", options: ["A. 1", "B. 2", "C. 3", "D. 4"], jawaban: "B", pembahasan: "$17 = 3 \\times 5 + 2 \\Rightarrow 17 \\mod 5 = 2$ → Jawaban B" },
  { no: 2, soal: "Nilai dari $105 \\mod 7$ adalah …", options: ["A. 0", "B. 1", "C. 2", "D. 3"], jawaban: "A", pembahasan: "$105 = 15 \\times 7 + 0 \\Rightarrow 105 \\mod 7 = 0$ → Jawaban A" },
  { no: 3, soal: "Nilai dari $(-13) \\mod 5$ adalah …", options: ["A. -3", "B. 2", "C. 3", "D. -2"], jawaban: "B", pembahasan: "$-13 = -3 \\times 5 + 2 \\Rightarrow (-13) \\mod 5 = 2$ → Jawaban B" },
  { no: 4, soal: "Jika hari ini Senin, maka 100 hari lagi adalah hari …", options: ["A. Selasa", "B. Rabu", "C. Kamis", "D. Jumat"], jawaban: "B", pembahasan: "$100 \\mod 7 = 2$ (100 = 14×7 + 2)\nSenin + 2 = Rabu → Jawaban B" },
  { no: 5, soal: "Digit terakhir dari $7^{2024}$ adalah …", options: ["A. 1", "B. 3", "C. 7", "D. 9"], jawaban: "A", pembahasan: "Pola digit terakhir $7^n$: 7,9,3,1,7,9,3,1,... (siklus 4)\n$2024 \\mod 4 = 0 \\Rightarrow$ digit = 1 → Jawaban A" },
  { no: 6, soal: "Digit terakhir dari $3^{100}$ adalah …", options: ["A. 1", "B. 3", "C. 7", "D. 9"], jawaban: "A", pembahasan: "Pola digit terakhir $3^n$: 3,9,7,1,3,... (siklus 4)\n$100 \\mod 4 = 0 \\Rightarrow$ digit = 1 → Jawaban A" },
  { no: 7, soal: "Berapakah nilai $35 \\equiv ? \\pmod{8}$", options: ["A. 1", "B. 2", "C. 3", "D. 4"], jawaban: "C", pembahasan: "$35 = 4 \\times 8 + 3 \\Rightarrow 35 \\equiv 3 \\pmod{8}$ → Jawaban C" },
  { no: 8, soal: "Jika $x \\equiv 3 \\pmod{7}$ dan $y \\equiv 5 \\pmod{7}$, maka $(x + y) \\mod 7$ adalah …", options: ["A. 0", "B. 1", "C. 2", "D. 8"], jawaban: "B", pembahasan: "$(x+y) \\equiv (3+5) \\equiv 8 \\equiv 1 \\pmod{7}$ → Jawaban B" },
  { no: 9, soal: "Jika $x \\equiv 4 \\pmod{6}$ dan $y \\equiv 5 \\pmod{6}$, maka $(x \\times y) \\mod 6$ adalah …", options: ["A. 0", "B. 2", "C. 4", "D. 5"], jawaban: "B", pembahasan: "$xy \\equiv 4 \\times 5 = 20 \\equiv 2 \\pmod{6}$ → Jawaban B" },
  { no: 10, soal: "Sisa pembagian $2^{50}$ oleh 7 adalah …", options: ["A. 1", "B. 2", "C. 4", "D. 6"], jawaban: "C", pembahasan: "$2^3 = 8 \\equiv 1 \\pmod{7}$\n$50 = 3 \\times 16 + 2 \\Rightarrow 2^{50} = (2^3)^{16} \\times 2^2 \\equiv 1 \\times 4 = 4 \\pmod{7}$ → Jawaban C" },
  { no: 11, soal: "Digit terakhir dari $2^{2025}$ adalah …", options: ["A. 2", "B. 4", "C. 6", "D. 8"], jawaban: "D", pembahasan: "Pola digit terakhir $2^n$: 2,4,8,6,2,4,8,6,... (siklus 4)\n$2025 \\mod 4 = 1 \\Rightarrow$ digit = 2 → Jawaban A" },
  { no: 12, soal: "Pukul berapa 150 jam setelah pukul 07.00?", options: ["A. 01.00", "B. 07.00", "C. 13.00", "D. 19.00"], jawaban: "C", pembahasan: "$150 \\mod 24 = 6$\nPukul 07.00 + 6 jam = 13.00 → Jawaban C" },
  { no: 13, soal: "Nilai dari $(2^3 + 3^2) \\mod 5$ adalah …", options: ["A. 0", "B. 1", "C. 2", "D. 3"], jawaban: "B", pembahasan: "$2^3 + 3^2 = 8 + 9 = 17$\n$17 \\mod 5 = 2$ → Jawaban C" },
  { no: 14, soal: "Barisan bilangan: 1, 5, 9, 13, ... Suku ke-100 dari barisan ini, jika dibagi 7 sisanya adalah …", options: ["A. 0", "B. 1", "C. 2", "D. 3"], jawaban: "D", pembahasan: "$U_{100} = 1 + 99 \\times 4 = 397$\n$397 = 56 \\times 7 + 5 \\Rightarrow 397 \\mod 7 = 5$" },
  { no: 15, soal: "Jika $n \\equiv 2 \\pmod{3}$, maka $n^2 \\pmod{3}$ adalah …", options: ["A. 0", "B. 1", "C. 2", "D. 4"], jawaban: "B", pembahasan: "$n^2 \\equiv 2^2 = 4 \\equiv 1 \\pmod{3}$ → Jawaban B" },
];

const ModuloPage = () => (
  <TKAPemantapanLayout
    title="ARITMATIKA MODULAR (MODULO)"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default ModuloPage;
