import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Faktor dan Kelipatan", content: `Faktor dari suatu bilangan adalah bilangan yang habis membagi bilangan tersebut.\nKelipatan dari suatu bilangan adalah hasil perkalian bilangan itu dengan 1, 2, 3, ...\n\nContoh:\nFaktor dari 12: 1, 2, 3, 4, 6, 12\nKelipatan dari 4: 4, 8, 12, 16, 20, 24, ...` },
  { heading: "B. Bilangan Prima dan Faktorisasi Prima", content: `Bilangan prima adalah bilangan yang tepat memiliki 2 faktor, yaitu 1 dan bilangan itu sendiri.\n\nDaftar bilangan prima: 2, 3, 5, 7, 11, 13, 17, 19, 23, ...\n\nFaktorisasi prima: menyatakan suatu bilangan sebagai perkalian bilangan-bilangan prima.\n\nContoh:\n$60 = 2^2 \\times 3 \\times 5$\n$84 = 2^2 \\times 3 \\times 7$` },
  { heading: "C. FPB (Faktor Persekutuan Terbesar)", content: `FPB dari dua atau lebih bilangan adalah faktor persekutuan terbesar dari bilangan-bilangan tersebut.\n\nCara menghitung FPB:\n- Pilih faktor prima yang sama\n- Gunakan pangkat terkecil\n\nContoh: FPB(60, 84)\n$60 = 2^2 \\times 3 \\times 5$\n$84 = 2^2 \\times 3 \\times 7$\nFPB = $2^2 \\times 3 = 12$` },
  { heading: "D. KPK (Kelipatan Persekutuan Terkecil)", content: `KPK dari dua atau lebih bilangan adalah kelipatan persekutuan terkecil dari bilangan-bilangan tersebut.\n\nCara menghitung KPK:\n- Pilih SEMUA faktor prima yang muncul\n- Gunakan pangkat terbesar\n\nContoh: KPK(60, 84)\n$60 = 2^2 \\times 3 \\times 5$\n$84 = 2^2 \\times 3 \\times 7$\nKPK = $2^2 \\times 3 \\times 5 \\times 7 = 420$` },
  { heading: "E. Hubungan KPK dan FPB", content: `$\\text{KPK}(a, b) \\times \\text{FPB}(a, b) = a \\times b$\n\nContoh:\nKPK(12, 18) × FPB(12, 18) = 12 × 18\n36 × 6 = 216 ✓` },
  { heading: "F. Aplikasi KPK dan FPB", content: `KPK digunakan saat mencari:\n- Saat dua kejadian bertemu kembali (serentak)\n- Waktu paling awal/cepat yang memenuhi syarat berganda\n\nFPB digunakan saat:\n- Membagi sesuatu menjadi kelompok sama besar tanpa sisa\n- Ukuran terbesar dari suatu pembagian` },
];

const latihanDasar: LatihanSoal[] = [
  {
    no: 1,
    soal: "a) Tulislah bilangan-bilangan kelipatan 5 dan kelipatan 7 yang kurang dari 75.\nb) Tentukan kelipatan Persekutuan dari 5 dan 7 yang kurang dari 75.\nc) Berapakah KPK dari 5 dan 7.",
    options: [],
    jawaban: "a) Kelipatan 5: 5,10,15,20,25,30,35,40,45,50,55,60,65,70 | Kelipatan 7: 7,14,21,28,35,42,49,56,63,70\nb) KP(5,7) < 75: 35 dan 70\nc) KPK(5,7) = 35",
    pembahasan: "KPK dari dua bilangan prima adalah hasil kalinya. Kelipatan persekutuan terkecil adalah kelipatan bersama yang paling kecil.\n1. Kelipatan 5 < 75: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70\n2. Kelipatan 7 < 75: 7, 14, 21, 28, 35, 42, 49, 56, 63, 70\n3. Kelipatan persekutuan (yang muncul di keduanya) < 75: 35 dan 70\n4. KPK(5, 7) = bilangan terkecil dari kelipatan persekutuan = 35\n5. Atau: $5 = 5$ dan $7 = 7$ (keduanya prima, tidak ada faktor sama) → KPK $= 5 \\times 7 = 35$\nRumus: Untuk dua bilangan prima $p$ dan $q$: $\\text{KPK}(p,q) = p \\times q$"
  },
  {
    no: 2,
    soal: "a) Tulislah bilangan-bilangan kelipatan 4, 8 dan 12.\nb) Tentukan kelipatan Persekutuan dari 4, 8 dan 12.\nc) Berapakah KPK dari 4, 8 dan 12.",
    options: [],
    jawaban: "a) Kelipatan 4: 4,8,12,16,20,24,28,32,... | Kelipatan 8: 8,16,24,32,... | Kelipatan 12: 12,24,36,...\nb) KP(4,8,12): 24, 48, 72, ...\nc) KPK(4,8,12) = 24",
    pembahasan: "KPK dari tiga bilangan diperoleh dari faktorisasi prima dengan mengambil pangkat tertinggi dari setiap faktor prima.\n1. Kelipatan 4: 4, 8, 12, 16, 20, 24, ...\n2. Kelipatan 8: 8, 16, 24, 32, ...\n3. Kelipatan 12: 12, 24, 36, ...\n4. Kelipatan persekutuan: 24, 48, 72, ... → KPK = 24\n5. Verifikasi via faktorisasi: $4 = 2^2$, $8 = 2^3$, $12 = 2^2 \\times 3$\n6. KPK $= 2^3 \\times 3 = 8 \\times 3 = 24$ ✓\nRumus: $\\text{KPK} = $ hasil kali faktor prima dengan pangkat tertinggi"
  },
  {
    no: 3,
    soal: "a) Tulislah faktor-faktor dari 36 dan 48.\nb) Tentukan faktor-faktor Persekutuan dari 36 dan 48.\nc) Berapakah FPB dari 36 dan 48.",
    options: [],
    jawaban: "a) Faktor 36: 1,2,3,4,6,9,12,18,36 | Faktor 48: 1,2,3,4,6,8,12,16,24,48\nb) Faktor persekutuan: 1,2,3,4,6,12\nc) FPB(36,48) = 12",
    pembahasan: "FPB adalah faktor persekutuan terbesar, yaitu bilangan terbesar yang membagi habis semua bilangan yang ditinjau.\n1. Faktor dari 36: 1, 2, 3, 4, 6, 9, 12, 18, 36\n2. Faktor dari 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48\n3. Faktor persekutuan (muncul di keduanya): 1, 2, 3, 4, 6, 12\n4. FPB = faktor persekutuan terbesar = 12\n5. Verifikasi: $36 = 2^2 \\times 3^2$, $48 = 2^4 \\times 3$\n6. FPB $= 2^2 \\times 3 = 4 \\times 3 = 12$ ✓\nRumus: $\\text{FPB} = $ hasil kali faktor prima yang sama dengan pangkat terkecil"
  },
  {
    no: 4,
    soal: "a) Tulislah faktor-faktor dari 30, 75 dan 105.\nb) Tentukan faktor Persekutuan dari 30, 75 dan 105.\nc) Berapakah FPB dari 30, 75 dan 105.",
    options: [],
    jawaban: "a) Faktor 30: 1,2,3,5,6,10,15,30 | Faktor 75: 1,3,5,15,25,75 | Faktor 105: 1,3,5,7,15,21,35,105\nb) Faktor persekutuan: 1, 3, 5, 15\nc) FPB(30,75,105) = 15",
    pembahasan: "FPB tiga bilangan diperoleh dari faktor prima yang sama dengan pangkat terkecil yang muncul di semua bilangan.\n1. Faktorisasi prima: $30 = 2 \\times 3 \\times 5$\n2. $75 = 3 \\times 5^2$\n3. $105 = 3 \\times 5 \\times 7$\n4. Faktor prima yang muncul di ketiga bilangan: 3 dan 5\n5. Pangkat terkecil masing-masing: $3^1$ dan $5^1$\n6. FPB $= 3 \\times 5 = 15$\nRumus: $\\text{FPB} = $ faktor prima bersama dengan pangkat terkecil"
  },
  {
    no: 5,
    soal: "Tentukan KPK dari pasangan bilangan berikut dengan cara memfaktorkan.\na) 24 dan 60\nb) 36 dan 81\nc) 42 dan 18\nd) 68 dan 85\ne) 105 dan 120\nf) 42, 63 dan 84\ng) 45, 75 dan 120\nh) 98, 126 dan 196",
    options: [],
    jawaban: "a) 120 | b) 324 | c) 126 | d) 340 | e) 840 | f) 252 | g) 1800 | h) 1764",
    pembahasan: "KPK diperoleh dari faktorisasi prima setiap bilangan, lalu mengambil pangkat tertinggi dari setiap faktor prima yang muncul.\n1. a) $24 = 2^3 \\times 3$, $60 = 2^2 \\times 3 \\times 5$ → KPK $= 2^3 \\times 3 \\times 5 = 120$\n2. b) $36 = 2^2 \\times 3^2$, $81 = 3^4$ → KPK $= 2^2 \\times 3^4 = 4 \\times 81 = 324$\n3. c) $42 = 2 \\times 3 \\times 7$, $18 = 2 \\times 3^2$ → KPK $= 2 \\times 3^2 \\times 7 = 126$\n4. d) $68 = 2^2 \\times 17$, $85 = 5 \\times 17$ → KPK $= 2^2 \\times 5 \\times 17 = 340$\n5. e) $105 = 3 \\times 5 \\times 7$, $120 = 2^3 \\times 3 \\times 5$ → KPK $= 2^3 \\times 3 \\times 5 \\times 7 = 840$\n6. f) $42 = 2 \\times 3 \\times 7$, $63 = 3^2 \\times 7$, $84 = 2^2 \\times 3 \\times 7$ → KPK $= 2^2 \\times 3^2 \\times 7 = 252$\n7. g) $45 = 3^2 \\times 5$, $75 = 3 \\times 5^2$, $120 = 2^3 \\times 3 \\times 5$ → KPK $= 2^3 \\times 3^2 \\times 5^2 = 1800$\n8. h) $98 = 2 \\times 7^2$, $126 = 2 \\times 3^2 \\times 7$, $196 = 2^2 \\times 7^2$ → KPK $= 2^2 \\times 3^2 \\times 7^2 = 1764$\nRumus: $\\text{KPK} = $ pangkat tertinggi setiap faktor prima"
  },
  {
    no: 6,
    soal: "Tentukan FPB dari pasangan bilangan berikut dengan cara memfaktorkan.\na) 36 dan 48\nb) 56 dan 84\nc) 45 dan 75\nd) 81 dan 36\ne) 120 dan 168\nf) 14, 42 dan 70\ng) 30, 75 dan 105\nh) 84, 126 dan 168",
    options: [],
    jawaban: "a) 12 | b) 28 | c) 15 | d) 9 | e) 24 | f) 14 | g) 15 | h) 42",
    pembahasan: "FPB diperoleh dari faktor prima yang sama di semua bilangan, diambil dengan pangkat terkecil.\n1. a) $36 = 2^2 \\times 3^2$, $48 = 2^4 \\times 3$ → FPB $= 2^2 \\times 3 = 12$\n2. b) $56 = 2^3 \\times 7$, $84 = 2^2 \\times 3 \\times 7$ → FPB $= 2^2 \\times 7 = 28$\n3. c) $45 = 3^2 \\times 5$, $75 = 3 \\times 5^2$ → FPB $= 3 \\times 5 = 15$\n4. d) $81 = 3^4$, $36 = 2^2 \\times 3^2$ → FPB $= 3^2 = 9$\n5. e) $120 = 2^3 \\times 3 \\times 5$, $168 = 2^3 \\times 3 \\times 7$ → FPB $= 2^3 \\times 3 = 24$\n6. f) $14 = 2 \\times 7$, $42 = 2 \\times 3 \\times 7$, $70 = 2 \\times 5 \\times 7$ → FPB $= 2 \\times 7 = 14$\n7. g) $30 = 2 \\times 3 \\times 5$, $75 = 3 \\times 5^2$, $105 = 3 \\times 5 \\times 7$ → FPB $= 3 \\times 5 = 15$\n8. h) $84 = 2^2 \\times 3 \\times 7$, $126 = 2 \\times 3^2 \\times 7$, $168 = 2^3 \\times 3 \\times 7$ → FPB $= 2 \\times 3 \\times 7 = 42$\nRumus: $\\text{FPB} = $ pangkat terkecil faktor prima yang sama"
  },
  {
    no: 7,
    soal: "Sebuah terminal bus melayani tiga jurusan. Bus-bus yang menuju ke jurusan pertama berangkat setiap 45 menit ke jurusan kedua berangkat setiap 60 menit dan ke jurusan ketiga berangkat setiap 75 menit. Jika pada pukul 06.00 ada tiga bus yang berangkat menuju ketiga jurusan tersebut secara bersamaan, pada pukul berapakah bus-bus berikutnya akan berangkat secara bersamaan menuju jurusan tersebut.",
    options: [],
    jawaban: "Pukul 21.00",
    pembahasan: "Soal ini meminta waktu mereka berangkat bersamaan lagi, sehingga digunakan KPK dari interval waktu keberangkatan.\n1. Faktorisasi prima: $45 = 3^2 \\times 5$, $60 = 2^2 \\times 3 \\times 5$, $75 = 3 \\times 5^2$\n2. KPK $= 2^2 \\times 3^2 \\times 5^2 = 4 \\times 9 \\times 25 = 900$ menit\n3. Konversi: $900 \\div 60 = 15$ jam\n4. Pukul 06.00 + 15 jam = pukul 21.00\n5. Jadi, bus-bus berikutnya akan berangkat bersamaan pada pukul 21.00\nRumus: Soal berangkat/bertemu bersamaan → gunakan KPK"
  },
  {
    no: 8,
    soal: "Aldi mengunjungi sebuah perpustakaan setiap 6 hari sekali. Shifa dan Dinda mengunjungi perpustakaan tersebut masing-masing setiap 10 hari dan 12 hari sekali. Jika pada tanggal 28 agustus mereka mengunjungi perpustakaan itu bersama-sama, pada tanggal berapa mereka akan mengunjungi perpustakaan tersebut bersama-sama lagi berikutnya.",
    options: [],
    jawaban: "27 Oktober",
    pembahasan: "Waktu mereka bertemu lagi ditentukan oleh KPK dari interval kunjungan masing-masing.\n1. Faktorisasi prima: $6 = 2 \\times 3$, $10 = 2 \\times 5$, $12 = 2^2 \\times 3$\n2. KPK $= 2^2 \\times 3 \\times 5 = 60$ hari\n3. 28 Agustus + 60 hari:\n4. Agustus memiliki 31 hari → sisa Agustus dari tgl 28: $31 - 28 = 3$ hari\n5. 60 - 3 = 57 hari lagi setelah 31 Agustus\n6. September: 30 hari → 57 - 30 = 27 hari lagi\n7. 27 hari di bulan Oktober → tanggal 27 Oktober\n8. Jadi mereka bertemu lagi pada tanggal 27 Oktober\nRumus: Soal bertemu kembali → KPK dari interval waktu"
  },
  {
    no: 9,
    soal: "Jadwal Latihan tim voli A di lapangan yang sama adalah 4 hari sekali, tim bola voli B 5 hari sekali dan tim bola voli C 6 hari sekali. Jika tanggal 10 desember ketiga tim tersebut mengadakan Latihan bersama, kapan mereka akan Latihan bersama lagi berikutnya?",
    options: [],
    jawaban: "8 Februari (tahun berikutnya)",
    pembahasan: "KPK menentukan kapan ketiga tim berlatih bersama kembali setelah siklus terpendek.\n1. Faktorisasi prima: $4 = 2^2$, $5 = 5$, $6 = 2 \\times 3$\n2. KPK $= 2^2 \\times 3 \\times 5 = 60$ hari\n3. 10 Desember + 60 hari:\n4. Sisa Desember dari tgl 10: $31 - 10 = 21$ hari\n5. 60 - 21 = 39 hari setelah 31 Desember (masuk Januari tahun berikutnya)\n6. Januari: 31 hari → 39 - 31 = 8 hari\n7. 8 hari di Februari → tanggal 8 Februari\n8. Jadi ketiga tim berlatih bersama lagi pada 8 Februari\nRumus: $\\text{KPK}(4,5,6) = 60$ hari"
  },
  {
    no: 10,
    soal: "Tersedia 84 anggur, 56 buah stroberi dan 140 buah jambu yang akan dibagikan kepada sejumlah anak. Jika buah-buahan tersebut dibagi sama rata, berapa anak sebanyak-banyaknya yang dapat menerima pembagian buah-buahan tersebut?",
    options: [],
    jawaban: "28 anak",
    pembahasan: "Soal 'dibagi sama rata sebanyak-banyaknya' berarti mencari FPB dari jumlah masing-masing buah.\n1. Faktorisasi prima: $84 = 2^2 \\times 3 \\times 7$\n2. $56 = 2^3 \\times 7$\n3. $140 = 2^2 \\times 5 \\times 7$\n4. Faktor prima bersama dengan pangkat terkecil: $2^2$ dan $7$\n5. FPB $= 2^2 \\times 7 = 4 \\times 7 = 28$\n6. Jadi, sebanyak-banyaknya 28 anak yang dapat menerima\n7. Masing-masing mendapat: $84/28 = 3$ anggur, $56/28 = 2$ stroberi, $140/28 = 5$ jambu\nRumus: Soal 'dibagi sama rata maksimal' → FPB"
  },
  {
    no: 11,
    soal: "Tersedia 175 kantong gula pasir dan 105 botol minyak goreng. Jika gula pasir dan minyak goreng tersebut akan dibagi rata, berapa orang terbanyak yang dapat menerima gula pasir dan minyak goreng tersebut?",
    options: [],
    jawaban: "35 orang",
    pembahasan: "Mencari jumlah orang terbanyak yang mendapat bagian sama berarti mencari FPB.\n1. Faktorisasi prima: $175 = 5^2 \\times 7$\n2. $105 = 3 \\times 5 \\times 7$\n3. Faktor prima bersama dengan pangkat terkecil: $5^1$ dan $7^1$\n4. FPB $= 5 \\times 7 = 35$\n5. Jadi, sebanyak-banyaknya 35 orang yang dapat menerima\n6. Masing-masing mendapat: $175/35 = 5$ kantong gula, $105/35 = 3$ botol minyak\nRumus: Soal distribusi maksimal → FPB"
  },
  {
    no: 12,
    soal: "Bu Sinta akan membuat parsel yang berisi sirop, mi instan dan beras. Bu Sinta mempunyai 24 botol sirop, 90 bungkus mi instan dan 42 kg beras. Jika Bu Sinta ingin membuat parsel sebanyak-banyaknya dengan jenis dan banyak isi yang sama, berapa banyak keranjang yang diperlukan?",
    options: [],
    jawaban: "6 keranjang",
    pembahasan: "Parsel sebanyak-banyaknya dengan isi sama berarti mencari FPB dari jumlah tiap jenis barang.\n1. Faktorisasi prima: $24 = 2^3 \\times 3$\n2. $90 = 2 \\times 3^2 \\times 5$\n3. $42 = 2 \\times 3 \\times 7$\n4. Faktor prima bersama dengan pangkat terkecil: $2^1$ dan $3^1$\n5. FPB $= 2 \\times 3 = 6$\n6. Jadi, Bu Sinta memerlukan 6 keranjang\n7. Isi tiap keranjang: $24/6 = 4$ sirop, $90/6 = 15$ mi, $42/6 = 7$ kg beras\nRumus: Parsel maksimal dengan isi sama → FPB"
  },
  {
    no: 13,
    soal: "Lampu merah menyala setiap 6 menit, kemudian padam. Lampu kuning menyala setiap 9 menit, kemudian padam. Kedua lampu menyala bersama-sama pada pukul 07.15. Pukul berapa kedua lampu akan menyala bersama-sama lagi?",
    options: [],
    jawaban: "Pukul 07.33",
    pembahasan: "Lampu menyala bersama lagi setelah selang waktu sebesar KPK dari masing-masing interval.\n1. Faktorisasi prima: $6 = 2 \\times 3$, $9 = 3^2$\n2. KPK $= 2 \\times 3^2 = 2 \\times 9 = 18$ menit\n3. Pukul 07.15 + 18 menit = pukul 07.33\n4. Jadi, kedua lampu menyala bersama lagi pada pukul 07.33\nRumus: $\\text{KPK}(6,9) = 18$ menit"
  },
  {
    no: 14,
    soal: "Arkan mengunjungi perpustakaan setiap 6 hari sekali, Dimas setiap 4 hari sekali sedangkan Sukma setiap 8 hari sekali. Jika pada tanggal 28 januari mereka mengunjungi perpustakaan bersama-sama, pada tanggal berapa mereka akan mengunjungi perpustakaan bersama-sama lagi berikutnya.",
    options: [],
    jawaban: "21 Februari",
    pembahasan: "Waktu bertemu kembali ditentukan oleh KPK dari interval kunjungan masing-masing orang.\n1. Faktorisasi prima: $6 = 2 \\times 3$, $4 = 2^2$, $8 = 2^3$\n2. KPK $= 2^3 \\times 3 = 8 \\times 3 = 24$ hari\n3. 28 Januari + 24 hari:\n4. Sisa Januari dari tgl 28: $31 - 28 = 3$ hari\n5. 24 - 3 = 21 hari masuk Februari\n6. Tanggal 21 Februari\n7. Jadi mereka bertemu lagi pada tanggal 21 Februari\nRumus: $\\text{KPK}(6,4,8) = 24$ hari"
  },
  {
    no: 15,
    soal: "Tersedia 84 buku, 56 pensil dan 140 krayon. Jika buku, pensil dan krayon tersebut akan dibagi rata kepada sejumlah anak, berapa anak sebanyak-banyaknya yang dapat menerima pembagian tersebut?",
    options: [],
    jawaban: "28 anak",
    pembahasan: "Pembagian rata sebanyak-banyaknya orang → gunakan FPB dari jumlah semua barang.\n1. Faktorisasi prima: $84 = 2^2 \\times 3 \\times 7$\n2. $56 = 2^3 \\times 7$\n3. $140 = 2^2 \\times 5 \\times 7$\n4. Faktor prima bersama dengan pangkat terkecil: $2^2$ dan $7$\n5. FPB $= 2^2 \\times 7 = 28$\n6. Jadi, sebanyak-banyaknya 28 anak\n7. Masing-masing mendapat: $84/28 = 3$ buku, $56/28 = 2$ pensil, $140/28 = 5$ krayon\nRumus: Distribusi rata maksimal → FPB"
  },
  {
    no: 16,
    soal: "Pada tahun 2024, tiga acara diadakan secara periodik:\nAcara A setiap 15 hari\nAcara B setiap 20 hari\nAcara C setiap 30 hari\nJika semua acara diadakan pada tanggal 1 Januari 2024, maka berapa kali semua acara diadakan bersama-sama selama tahun 2024?",
    options: [],
    jawaban: "7 kali (termasuk 1 Januari)",
    pembahasan: "Cari KPK untuk menentukan siklus pertemuan, lalu hitung berapa kali terjadi dalam 366 hari (2024 kabisat).\n1. Faktorisasi prima: $15 = 3 \\times 5$, $20 = 2^2 \\times 5$, $30 = 2 \\times 3 \\times 5$\n2. KPK $= 2^2 \\times 3 \\times 5 = 60$ hari\n3. 2024 adalah tahun kabisat → 366 hari\n4. Hari ke-1 (1 Jan), 61, 121, 181, 241, 301, 361 → semua ≤ 366\n5. Hari ke-421 > 366 (tidak termasuk)\n6. Jumlah: $\\lfloor 366/60 \\rfloor + 1 = 6 + 1 = 7$ kali (termasuk hari pertama)\n7. Jadi semua acara diadakan bersama-sama sebanyak 7 kali\nRumus: $\\text{KPK}(15,20,30) = 60$ hari; banyak pertemuan $= \\lfloor 366/60 \\rfloor + 1$"
  },
  {
    no: 17,
    soal: "Jika FPB(x, y) = 12 dan KPK(x, y) = 210, maka $xy$ = ...",
    options: ["A. 2010", "B. 2520", "C. 2250", "D. 2100"],
    jawaban: "B",
    pembahasan: "Terdapat hubungan penting: untuk dua bilangan bulat positif, $\\text{FPB}(x,y) \\times \\text{KPK}(x,y) = x \\times y$.\n1. Menggunakan sifat: $\\text{FPB}(x,y) \\times \\text{KPK}(x,y) = x \\times y$\n2. $xy = 12 \\times 210$\n3. $xy = 2520$\n4. Jawaban: B. 2520\nRumus: $\\text{FPB}(x,y) \\times \\text{KPK}(x,y) = x \\times y$"
  },
  {
    no: 18,
    soal: "Misalkan a dan b adalah bilangan asli yang memenuhi:\n- FPB(a, b) = 12\n- KPK(a, b) = 180\nJika a < b, maka berapakah banyak pasangan bilangan (a,b) yang memenuhi syarat tersebut?",
    options: [],
    jawaban: "2 pasangan: (12, 180) dan (36, 60)",
    pembahasan: "Tulis $a = 12p$ dan $b = 12q$ dengan $\\gcd(p,q) = 1$ dan $pq = \\text{KPK}/\\text{FPB} = 180/12 = 15$.\n1. Karena FPB$(a,b) = 12$, tulis $a = 12p$ dan $b = 12q$ dengan $\\gcd(p,q) = 1$\n2. KPK$(a,b) = 12pq = 180$ → $pq = 15$\n3. Cari semua pasangan $(p,q)$ dengan $p < q$, $pq = 15$, dan $\\gcd(p,q) = 1$:\n4. $(p,q) = (1, 15)$: $\\gcd(1,15) = 1$ ✓ → $(a,b) = (12, 180)$\n5. $(p,q) = (3, 5)$: $\\gcd(3,5) = 1$ ✓ → $(a,b) = (36, 60)$\n6. $(p,q) = (5, 3)$: tidak karena $p < q$ sudah diharuskan\n7. Jadi ada 2 pasangan: $(12, 180)$ dan $(36, 60)$\nRumus: $a = \\text{FPB} \\cdot p$, $b = \\text{FPB} \\cdot q$, $\\gcd(p,q)=1$, $pq = \\text{KPK}/\\text{FPB}$"
  },
  {
    no: 19,
    soal: "Dua bilangan memiliki FPB = 6 dan KPK = 180. Jika salah satu bilangan adalah 30, maka bilangan lainnya adalah ...",
    options: [],
    jawaban: "36",
    pembahasan: "Gunakan hubungan $\\text{FPB} \\times \\text{KPK} = x \\times y$ untuk mencari bilangan yang belum diketahui.\n1. Diketahui: FPB $= 6$, KPK $= 180$, salah satu bilangan $x = 30$\n2. Gunakan: $x \\times y = \\text{FPB} \\times \\text{KPK}$\n3. $30 \\times y = 6 \\times 180 = 1080$\n4. $y = \\frac{1080}{30} = 36$\n5. Verifikasi: $\\text{FPB}(30, 36) = 6$ ✓ dan $\\text{KPK}(30, 36) = 180$ ✓\n6. Jadi bilangan lainnya adalah 36\nRumus: $y = \\frac{\\text{FPB} \\times \\text{KPK}}{x}$"
  },
  {
    no: 20,
    soal: "Jika a dan b adalah bilangan bulat positif sehingga gcd(a, b) = 12, $a \\cdot b = 2016$, maka nilai terkecil yang mungkin untuk a + b adalah .... (Catatan: gcd adalah greatest common divisor atau FPB)",
    options: [],
    jawaban: "108",
    pembahasan: "Tulis $a = 12m$ dan $b = 12n$ dengan $\\gcd(m,n)=1$, lalu cari pasangan yang meminimalkan $a+b$.\n1. Karena $\\gcd(a,b) = 12$, tulis $a = 12m$, $b = 12n$ dengan $\\gcd(m,n) = 1$\n2. $a \\cdot b = 144mn = 2016$ → $mn = \\frac{2016}{144} = 14$\n3. Cari semua pasangan $(m,n)$ dengan $\\gcd(m,n)=1$ dan $mn = 14$:\n4. $(m,n) = (1, 14)$: $\\gcd(1,14) = 1$ ✓ → $(a,b) = (12, 168)$ → $a+b = 180$\n5. $(m,n) = (2, 7)$: $\\gcd(2,7) = 1$ ✓ → $(a,b) = (24, 84)$ → $a+b = 108$\n6. Bandingkan: $108 < 180$\n7. Nilai terkecil $a + b = 108$\nRumus: $a = 12m$, $b = 12n$, $\\gcd(m,n)=1$, $mn = 14$; minimumkan $12(m+n)$"
  },
];

const KPKFPBPage = () => (
  <TKAPemantapanLayout
    title="KPK DAN FPB"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default KPKFPBPage;
