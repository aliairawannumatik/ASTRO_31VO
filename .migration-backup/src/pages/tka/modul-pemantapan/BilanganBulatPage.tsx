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
  { 
    no: 1, 
    soal: "Hasil dari $25 - (-90 : 18) + (-3) \\times 14$ adalah ...", 
    options: ["A. -12", "B. -9", "C. 24", "D. 97"],
    jawaban: "A",
    pembahasan: "Operasi hitung campuran bilangan bulat mengikuti urutan: kurung, pangkat/akar, kali/bagi, tambah/kurang.\n1. Hitung pembagian: $-90 : 18 = -5$\n2. Hitung perkalian: $(-3) \\times 14 = -42$\n3. Substitusi: $25 - (-5) + (-42)$\n4. Hitung: $25 + 5 - 42 = 30 - 42 = -12$\nRumus: $a - (-b) = a + b$"
  },
  { 
    no: 2, 
    soal: "Hasil dari $-20 : 5 \\times 2 - [7 + (-9)] + [2 - (-7)]$ adalah ...", 
    options: ["A. 3", "B. 9", "C. 10", "D. -23"],
    jawaban: "A",
    pembahasan: "Selesaikan operasi dalam kurung terlebih dahulu, kemudian kali/bagi dari kiri ke kanan, lalu tambah/kurang.\n1. Hitung dalam kurung pertama: $7 + (-9) = -2$\n2. Hitung dalam kurung kedua: $2 - (-7) = 2 + 7 = 9$\n3. Hitung bagi dan kali dari kiri: $-20 : 5 = -4$, lalu $-4 \\times 2 = -8$\n4. Substitusi: $-8 - (-2) + 9 = -8 + 2 + 9 = 3$\nRumus: Urutan operasi: kurung $\\rightarrow$ kali/bagi $\\rightarrow$ tambah/kurang"
  },
  { 
    no: 3, 
    soal: "Dalam kompetensi Bahasa Inggris yang terdiri dari 50 soal, peserta akan mendapatkan skor 4 untuk setiap jawaban benar, skor -2 untuk setiap jawaban salah, dan skor -1 untuk soal yang tidak dijawab. Jika Budi menjawab 44 soal dan yang benar 36 soal, maka skor yang diperoleh Budi adalah ...", 
    options: ["A. 134", "B. 126", "C. 122", "D. 120"],
    jawaban: "C",
    pembahasan: "Soal cerita tentang sistem penskoran dengan bilangan bulat positif dan negatif.\n1. Jawaban benar = 36 soal, skor = $36 \\times 4 = 144$\n2. Jawaban salah = $44 - 36 = 8$ soal, skor = $8 \\times (-2) = -16$\n3. Tidak dijawab = $50 - 44 = 6$ soal, skor = $6 \\times (-1) = -6$\n4. Total skor = $144 + (-16) + (-6) = 144 - 16 - 6 = 122$\nRumus: Skor total = (benar $\\times$ poin benar) + (salah $\\times$ poin salah) + (kosong $\\times$ poin kosong)"
  },
  { 
    no: 4, 
    soal: "Dalam kompetensi matematika, setiap jawaban benar diberi skor 2, salah skor -1 dan tidak menjawab poin nol. Dari 40 soal yang diberikan, Andi dapat menjawab 36 soal. Jika skor yang diperoleh Andi adalah 51, maka banyak soal yang dijawab benar adalah ...", 
    options: ["A. 31", "B. 30", "C. 29", "D. 28"],
    jawaban: "C",
    pembahasan: "Sistem persamaan linear untuk menentukan jumlah jawaban benar dan salah.\n1. Misalkan benar = $x$, salah = $y$\n2. Persamaan 1: $x + y = 36$ (total dijawab)\n3. Persamaan 2: $2x + (-1)y = 51$ atau $2x - y = 51$\n4. Jumlahkan kedua persamaan: $3x = 87$, maka $x = 29$\n5. Jadi banyak jawaban benar = 29 soal\nRumus: Gunakan sistem persamaan linear dua variabel"
  },
  { 
    no: 5, 
    soal: "Dalam suatu ujian perguruan tinggi, setiap soal bernilai benar mendapat nilai 4, salah bernilai -1 dan tidak dijawab bernilai 0. Dari 60 soal yang diberikan, Nafisha mengerjakan 31 soal dan mendapatkan skor 94. Maka banyak jawaban benar yang diperoleh Nafisha adalah ...", 
    options: ["A. 25", "B. 24", "C. 23", "D. 22"],
    jawaban: "A",
    pembahasan: "Sistem persamaan linear untuk menentukan jumlah jawaban benar.\n1. Misalkan benar = $x$, salah = $y$\n2. Persamaan 1: $x + y = 31$ (total dikerjakan)\n3. Persamaan 2: $4x + (-1)y = 94$ atau $4x - y = 94$\n4. Jumlahkan: $5x = 125$, maka $x = 25$\n5. Jadi banyak jawaban benar = 25 soal\nRumus: $4x - y = 94$ dan $x + y = 31$"
  },
  { 
    no: 6, 
    soal: "Suhu di kota Moskow $11^\\circ C$. Pada saat turun salju, suhunya turun $4^\\circ C$ setiap 15 menit. Suhu di kota tersebut setelah turun salju 1 jam adalah ...", 
    options: ["A. $-9^\\circ C$", "B. $-5^\\circ C$", "C. $5^\\circ C$", "D. $9^\\circ C$"],
    jawaban: "B",
    pembahasan: "Soal cerita tentang perubahan suhu dengan operasi bilangan bulat.\n1. Suhu awal = $11^\\circ C$\n2. 1 jam = 60 menit = $\\frac{60}{15} = 4$ kali penurunan\n3. Total penurunan = $4 \\times 4^\\circ C = 16^\\circ C$\n4. Suhu akhir = $11 - 16 = -5^\\circ C$\nRumus: Suhu akhir = Suhu awal - (banyak interval $\\times$ penurunan per interval)"
  },
  { 
    no: 7, 
    soal: "Suhu di dalam kulkas sebelum dihidupkan $29^\\circ C$. Setelah dihidupkan, suhunya turun $3^\\circ C$ setiap 5 menit. Setelah 10 menit suhu dalam kulkas adalah ...", 
    options: ["A. $23^\\circ C$", "B. $26^\\circ C$", "C. $32^\\circ C$", "D. $35^\\circ C$"],
    jawaban: "A",
    pembahasan: "Perubahan suhu secara berkala menggunakan pengurangan.\n1. Suhu awal = $29^\\circ C$\n2. 10 menit = $\\frac{10}{5} = 2$ kali penurunan\n3. Total penurunan = $2 \\times 3^\\circ C = 6^\\circ C$\n4. Suhu akhir = $29 - 6 = 23^\\circ C$\nRumus: Suhu akhir = Suhu awal - (total penurunan)"
  },
  { 
    no: 8, 
    soal: "Operasi \"#\" artinya kalikan bilangan pertama dengan bilangan kedua, kemudian kurangkan hasilnya dengan dua kali bilangan kedua. Hasil dari $5 \\# (-4)$ adalah ...", 
    options: ["A. -28", "B. -24", "C. -16", "D. -12"],
    jawaban: "D",
    pembahasan: "Operasi khusus yang didefinisikan dengan rumus tertentu.\n1. Definisi: $a \\# b = (a \\times b) - (2 \\times b)$\n2. Substitusi $a = 5$ dan $b = -4$\n3. Hitung $a \\times b = 5 \\times (-4) = -20$\n4. Hitung $2 \\times b = 2 \\times (-4) = -8$\n5. Hasil = $-20 - (-8) = -20 + 8 = -12$\nRumus: $a \\# b = ab - 2b$"
  },
  { 
    no: 9, 
    soal: "Operasi \"*\" artinya kalikan dua kali bilangan pertama dengan bilangan kedua, kemudian kurangkan hasilnya dengan tiga kali bilangan kedua. Hasil dari $-3 * (-2)$ adalah ...", 
    options: ["A. 18", "B. -18", "C. -6", "D. 6"],
    jawaban: "A",
    pembahasan: "Operasi khusus dengan definisi: kalikan 2 kali bilangan pertama dengan bilangan kedua, lalu kurangi 3 kali bilangan kedua.\n1. Definisi: $a * b = (2a \\times b) - (3 \\times b)$\n2. Substitusi $a = -3$ dan $b = -2$\n3. Hitung $2a \\times b = 2(-3) \\times (-2) = -6 \\times (-2) = 12$\n4. Hitung $3 \\times b = 3 \\times (-2) = -6$\n5. Hasil = $12 - (-6) = 12 + 6 = 18$\nRumus: $a * b = 2ab - 3b$"
  },
  { 
    no: 10, 
    soal: "Pada suhu ruangan ber-AC mencapai $16^\\circ C$, sedangkan di tempat penyimpanan daging suhunya $25^\\circ C$ lebih rendah dari suhu di ruangan ber-AC. Suhu di tempat penyimpanan daging adalah ...", 
    options: ["A. $16^\\circ C$", "B. $11^\\circ C$", "C. $-9^\\circ C$", "D. $-39^\\circ C$"],
    jawaban: "C",
    pembahasan: "'Lebih rendah' berarti pengurangan pada bilangan bulat.\n1. Suhu ruangan AC = $16^\\circ C$\n2. Suhu penyimpanan daging = $25^\\circ C$ lebih rendah\n3. Suhu daging = $16 - 25 = -9^\\circ C$\nRumus: Lebih rendah $\\rightarrow$ kurangi"
  },
  { 
    no: 11, 
    soal: "Suhu di suatu ruangan $-12^\\circ C$, sedangkan suhu dalam ruangan $20^\\circ C$. Perbedaan suhu di kedua tempat tersebut adalah ...", 
    options: ["A. $-32^\\circ C$", "B. $-8^\\circ C$", "C. $8^\\circ C$", "D. $32^\\circ C$"],
    jawaban: "D",
    pembahasan: "Perbedaan/selisih suhu adalah nilai mutlak dari pengurangan dua suhu.\n1. Suhu luar = $-12^\\circ C$, Suhu dalam = $20^\\circ C$\n2. Perbedaan = $|20 - (-12)| = |20 + 12| = |32| = 32^\\circ C$\n3. Atau: $|-12 - 20| = |-32| = 32^\\circ C$\nRumus: Selisih = $|a - b|$"
  },
  { 
    no: 12, 
    soal: "Perhatikan suhu udara di beberapa negara berikut!\nWina $-7^\\circ C$, Soul $-1^\\circ C$, Baghdad $39^\\circ C$, Surabaya $33^\\circ C$\nSelisih suhu udara yang benar di bawah ini adalah ...", 
    options: ["A. Selisih suhu udara Wina dan Soul $-6^\\circ C$", "B. Selisih suhu udara Baghdad dan Wina $30^\\circ C$", "C. Selisih suhu udara Surabaya dan Soul adalah $34^\\circ C$", "D. Selisih udara Surabaya dan Wina adalah $39^\\circ C$"],
    jawaban: "C",
    pembahasan: "Verifikasi setiap pilihan dengan menghitung selisih suhu.\n1. A. Wina - Soul = $-7 - (-1) = -7 + 1 = -6^\\circ C$ (salah, selisih harus positif = $6^\\circ C$)\n2. B. Baghdad - Wina = $39 - (-7) = 39 + 7 = 46^\\circ C$ (bukan $30^\\circ C$)\n3. C. Surabaya - Soul = $33 - (-1) = 33 + 1 = 34^\\circ C$ ✓ BENAR\n4. D. Surabaya - Wina = $33 - (-7) = 33 + 7 = 40^\\circ C$ (bukan $39^\\circ C$)\nRumus: Selisih = nilai terbesar - nilai terkecil"
  },
  { 
    no: 13, 
    soal: "Diberikan $x = 1 - 2 + 3 - 4 + 5 - ... + 99 - 100$. Berapakah nilai dari $x$?", 
    options: ["A. -100", "B. -50", "C. 0", "D. 50"],
    jawaban: "B",
    pembahasan: "Pola bilangan dengan pengelompokan pasangan berurutan.\n1. Kelompokkan: $(1-2) + (3-4) + (5-6) + ... + (99-100)$\n2. Setiap pasangan menghasilkan $-1$\n3. Banyak pasangan = $\\frac{100}{2} = 50$ pasangan\n4. Total = $50 \\times (-1) = -50$\nRumus: $(2k-1) - 2k = -1$ untuk setiap pasangan"
  },
  { 
    no: 14, 
    soal: "Berapakah digit terakhir dari $3^{2023}$?", 
    options: ["A. 3", "B. 9", "C. 1", "D. 7"],
    jawaban: "D",
    pembahasan: "Pola digit satuan perpangkatan bilangan 3 berulang dengan periode 4.\n1. Pola digit satuan $3^n$: $3^1=3$, $3^2=9$, $3^3=27$, $3^4=81$, $3^5=243$ (kembali ke 3)\n2. Periode = 4, yaitu: 3, 9, 7, 1, 3, 9, 7, 1, ...\n3. Sisa $2023 : 4 = 505$ sisa $3$\n4. Sisa 3 $\\rightarrow$ digit satuan sama dengan $3^3 = 7$\nRumus: Digit satuan $3^n$ bergantung pada $n \\mod 4$"
  },
  { 
    no: 15, 
    soal: "Berapakah digit terakhir dari $2^{2025}$?", 
    options: ["A. 2", "B. 4", "C. 6", "D. 8"],
    jawaban: "A",
    pembahasan: "Pola digit satuan perpangkatan bilangan 2 berulang dengan periode 4.\n1. Pola digit satuan $2^n$: $2^1=2$, $2^2=4$, $2^3=8$, $2^4=16$, $2^5=32$ (kembali ke 2)\n2. Periode = 4, yaitu: 2, 4, 8, 6, 2, 4, 8, 6, ...\n3. Sisa $2025 : 4 = 506$ sisa $1$\n4. Sisa 1 $\\rightarrow$ digit satuan sama dengan $2^1 = 2$\nRumus: Digit satuan $2^n$ bergantung pada $n \\mod 4$"
  },
  { 
    no: 16, 
    soal: "Jika $a$, $b$, dan $c$ adalah tiga bilangan bulat berbeda sedemikian rupa sehingga $a \\times b \\times c = 16$, berapakah nilai terbesar yang mungkin untuk $a + b + c$?", 
    options: ["A. 11", "B. 8", "C. 10", "D. 13"],
    jawaban: "A",
    pembahasan: "Faktorisasi 16 menjadi tiga faktor berbeda untuk memaksimalkan jumlah.\n1. Faktorisasi 16: $16 = 2^4$\n2. Cari semua kombinasi tiga bilangan bulat BERBEDA dengan hasil kali 16:\n3. $(1, 2, 8)$: $1 \\times 2 \\times 8 = 16$ ✓, jumlah = $1+2+8 = 11$\n4. $(1, 4, 4)$: angka 4 berulang ✗ (tidak valid)\n5. $(2, 2, 4)$: angka 2 berulang ✗ (tidak valid)\n6. $(-1, -2, 8)$: $(-1)(-2)(8)=16$ ✓, jumlah = $-1-2+8 = 5$\n7. $(-1, -4, 4)$: $(-1)(-4)(4)=16$ ✓, jumlah = $-1-4+4 = -1$\n8. Nilai jumlah terbesar dari semua kombinasi valid = 11, dari $(1, 2, 8)$\nRumus: Cari semua faktorisasi $a \\times b \\times c = 16$ dengan $a \\neq b \\neq c$"
  },
  { 
    no: 17, 
    soal: "Jika $m$ dan $n$ adalah bilangan bulat positif sehingga $m^2 - n^2 = 13$, berapakah nilai dari $m$?", 
    options: ["A. 7", "B. 13", "C. 6", "D. 12"],
    jawaban: "A",
    pembahasan: "Faktorisasi selisih kuadrat: $m^2 - n^2 = (m+n)(m-n)$\n1. Gunakan rumus: $m^2 - n^2 = (m+n)(m-n) = 13$\n2. 13 adalah bilangan prima, faktornya: $1 \\times 13$ atau $13 \\times 1$\n3. Karena $m, n > 0$ dan $m > n$, maka $m+n > m-n > 0$\n4. Jadi: $m+n = 13$ dan $m-n = 1$\n5. Jumlahkan: $2m = 14$, maka $m = 7$\n6. Periksa: $n = 6$, dan $7^2 - 6^2 = 49 - 36 = 13$ ✓\nRumus: $a^2 - b^2 = (a+b)(a-b)$"
  },
  { 
    no: 18, 
    soal: "Jika $a$ dan $b$ adalah bilangan bulat positif sehingga $a^2 - b^2 = 2023$, maka nilai terkecil yang mungkin untuk $a + b$ adalah ...", 
    options: ["A. 44", "B. 119", "C. 289", "D. 2023"],
    jawaban: "B",
    pembahasan: "Faktorisasi selisih kuadrat dan mencari pasangan faktor yang meminimalkan $a+b$.\n1. Gunakan: $(a+b)(a-b) = 2023$\n2. Faktorisasi 2023: $2023 = 7 \\times 17^2 = 7 \\times 289$ atau $1 \\times 2023$, $7 \\times 289$, $17 \\times 119$\n3. Untuk $a+b$ minimum, pilih faktor yang selisihnya terkecil\n4. Jika $(a+b) = 119$ dan $(a-b) = 17$: $2a = 136$, $a = 68$, $b = 51$\n5. Periksa: $68^2 - 51^2 = 4624 - 2601 = 2023$ ✓\nRumus: $a = \\frac{(a+b)+(a-b)}{2}$, $b = \\frac{(a+b)-(a-b)}{2}$"
  },
  { 
    no: 19, 
    soal: "Diberikan $a$ dan $b$ adalah bilangan bulat positif sedemikian sehingga $a^2 - b^2 = 2019$. Nilai terkecil yang mungkin untuk $a - b$ adalah ...", 
    options: ["A. 1", "B. 3", "C. 673", "D. 2019"],
    jawaban: "A",
    pembahasan: "Mencari nilai $(a-b)$ terkecil dari faktorisasi selisih kuadrat.\n1. Gunakan: $(a+b)(a-b) = 2019$\n2. Faktorisasi 2019: $2019 = 3 \\times 673 = 1 \\times 2019$\n3. Faktor-faktor pasangan (keduanya harus ganjil agar $a, b$ bilangan bulat): $(1, 2019)$, $(3, 673)$\n4. Jika $(a-b) = 1$ dan $(a+b) = 2019$: $a = \\frac{1+2019}{2} = 1010$, $b = 1009$ — keduanya bilangan bulat positif ✓\n5. Ini memberikan $a - b = 1$ (minimum!)\n6. Jika $(a-b) = 3$ dan $(a+b) = 673$: $a = 338$, $b = 335$, $a-b = 3$ (lebih besar)\n7. Nilai terkecil $(a-b)$ adalah 1, dari pasangan $(a, b) = (1010, 1009)$\nRumus: $(a-b)$ minimum saat memilih faktor terkecil dari 2019"
  },
];

const BilanganBulatPage = () => (
  <TKAPemantapanLayout
    title="BILANGAN BULAT"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default BilanganBulatPage;
