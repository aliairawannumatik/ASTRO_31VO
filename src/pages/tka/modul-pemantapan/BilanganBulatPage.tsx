import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Pengertian Bilangan Bulat", content: `Bilangan bulat terdiri dari:\n- Bilangan bulat negatif: ..., -3, -2, -1\n- Nol: 0\n- Bilangan bulat positif: 1, 2, 3, ...\n\nDinotasikan: $\\mathbb{Z} = \\{..., -3, -2, -1, 0, 1, 2, 3, ...\\}$` },
  { heading: "B. Operasi Bilangan Bulat", content: `1. Penjumlahan:\n   - (+) + (+) = (+)\n   - (−) + (−) = (−)\n   - (+) + (−) = nilai mutlak yang lebih besar, tanda ikut yang lebih besar\n\n2. Pengurangan: $a - b = a + (-b)$\n\n3. Perkalian dan Pembagian:\n   - (+) × (+) = (+)\n   - (−) × (−) = (+)\n   - (+) × (−) = (−)\n   - (−) × (+) = (−)` },
  { heading: "C. Nilai Mutlak", content: `$|a| = a$ jika $a \\geq 0$\n$|a| = -a$ jika $a < 0$\n\nSifat:\n- $|a| \\geq 0$\n- $|a| = |-a|$\n- $|ab| = |a| \\cdot |b|$\n- $|a + b| \\leq |a| + |b|$ (ketidaksamaan segitiga)` },
  { heading: "D. Sifat-sifat Operasi", content: `1. Komutatif: $a + b = b + a$; $a \\times b = b \\times a$\n2. Asosiatif: $(a+b)+c = a+(b+c)$; $(a \\times b) \\times c = a \\times (b \\times c)$\n3. Distributif: $a \\times (b+c) = a \\times b + a \\times c$` },
  { heading: "E. Pemangkatan Bilangan Bulat", content: `$a^n = a \\times a \\times ... \\times a$ (sebanyak n faktor)\n\nSifat:\n$a^m \\times a^n = a^{m+n}$\n$a^m \\div a^n = a^{m-n}$\n$(a^m)^n = a^{mn}$\n$(ab)^n = a^n b^n$\n$a^0 = 1$ (untuk $a \\neq 0$)` },
];

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Hasil dari $-15 + 8 - (-3) + (-4)$ adalah …", options: ["A. -8", "B. -6", "C. 6", "D. 8"], jawaban: "A", pembahasan: "$-15 + 8 + 3 - 4 = -8$ → Jawaban A" },
  { no: 2, soal: "Hasil dari $(-6) \\times 4 + (-3) \\times (-8)$ adalah …", options: ["A. -48", "B. 0", "C. 6", "D. 12"], jawaban: "B", pembahasan: "$-24 + 24 = 0$ → Jawaban B" },
  { no: 3, soal: "Hasil dari $(-36) \\div 4 + (-2) \\times 5$ adalah …", options: ["A. -19", "B. -1", "C. 1", "D. 19"], jawaban: "A", pembahasan: "$-9 + (-10) = -19$ → Jawaban A" },
  { no: 4, soal: "Nilai dari $|-5 + 3| - |8 - 12|$ adalah …", options: ["A. -6", "B. -2", "C. 2", "D. 6"], jawaban: "B", pembahasan: "$|-2| - |-4| = 2 - 4 = -2$ → Jawaban B" },
  { no: 5, soal: "Suhu kota A adalah $-8°C$ dan suhu kota B adalah $14°C$. Selisih suhunya adalah …", options: ["A. 6°C", "B. 16°C", "C. 22°C", "D. 24°C"], jawaban: "C", pembahasan: "$|14 - (-8)| = 22°C$ → Jawaban C" },
  { no: 6, soal: "Sebuah kapal selam berada pada kedalaman 200 m di bawah permukaan laut. Ia naik 75 m, kemudian turun lagi 130 m. Posisi kapal sekarang adalah …", options: ["A. 255 m di bawah permukaan laut", "B. 245 m di bawah permukaan laut", "C. 125 m di bawah permukaan laut", "D. 5 m di bawah permukaan laut"], jawaban: "A", pembahasan: "$-200 + 75 - 130 = -255$\nKapal 255 m di bawah permukaan laut → Jawaban A" },
  { no: 7, soal: "Hasil dari $(-3)^2 \\times (-2)^3$ adalah …", options: ["A. -72", "B. -36", "C. 36", "D. 72"], jawaban: "A", pembahasan: "$9 \\times (-8) = -72$ → Jawaban A" },
  { no: 8, soal: "Hasil dari $(-2)^5 + 3^3$ adalah …", options: ["A. -5", "B. -2", "C. 5", "D. 59"], jawaban: "A", pembahasan: "$-32 + 27 = -5$ → Jawaban A" },
  { no: 9, soal: "Jika $n = -3$, nilai dari $n^2 - 2n + 4$ adalah …", options: ["A. 5", "B. 9", "C. 13", "D. 19"], jawaban: "D", pembahasan: "$(-3)^2 - 2(-3) + 4 = 9 + 6 + 4 = 19$ → Jawaban D" },
  { no: 10, soal: "Bilangan bulat antara $-\\sqrt{50}$ dan $\\sqrt{20}$ adalah …", options: ["A. 11 bilangan", "B. 12 bilangan", "C. 13 bilangan", "D. 14 bilangan"], jawaban: "A", pembahasan: "$-\\sqrt{50} \\approx -7,07$ dan $\\sqrt{20} \\approx 4,47$\nBilangan: -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4 = 12 bilangan → Jawaban B" },
  { no: 11, soal: "Hasil dari $\\frac{(-4)^3 \\times (-3)^2}{(-2)^4}$ adalah …", options: ["A. -36", "B. -18", "C. 18", "D. 36"], jawaban: "A", pembahasan: "$\\frac{(-64)(9)}{16} = \\frac{-576}{16} = -36$ → Jawaban A" },
  { no: 12, soal: "Pak Andi mempunyai utang Rp500.000. Ia mendapat uang Rp750.000, lalu membeli barang Rp300.000. Uang Pak Andi sekarang adalah …", options: ["A. Rp50.000", "B. Rp100.000", "C. -Rp50.000", "D. -Rp100.000"], jawaban: "C", pembahasan: "$-500.000 + 750.000 - 300.000 = -50.000$\nPak Andi masih punya utang Rp50.000 → Jawaban C" },
  { no: 13, soal: "Pada sebuah bangunan, lantai dasar berada pada ketinggian 0. Lantai 5 berada pada ketinggian 20 m. Basement 2 berada pada kedalaman 6 m. Selisih ketinggian lantai 5 dan basement 2 adalah …", options: ["A. 14 m", "B. 20 m", "C. 26 m", "D. 46 m"], jawaban: "C", pembahasan: "$20 - (-6) = 26$ m → Jawaban C" },
  { no: 14, soal: "Hasil dari $(-5 + 3)^3 - (2 - 4)^2$ adalah …", options: ["A. -12", "B. -4", "C. 4", "D. 12"], jawaban: "A", pembahasan: "$(-2)^3 - (-2)^2 = -8 - 4 = -12$ → Jawaban A" },
  { no: 15, soal: "Suatu kereta bergerak dari stasiun A ke stasiun B menempuh jarak 240 km dalam 3 jam. Kecepatan rata-rata kereta adalah …", options: ["A. 70 km/jam", "B. 80 km/jam", "C. 90 km/jam", "D. 100 km/jam"], jawaban: "B", pembahasan: "$v = 240 / 3 = 80$ km/jam → Jawaban B" },
];

const BilanganBulatPage = () => (
  <TKAPemantapanLayout
    title="BILANGAN BULAT"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default BilanganBulatPage;
