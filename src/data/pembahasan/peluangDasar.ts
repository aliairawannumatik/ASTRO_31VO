import type { Pembahasan } from "@/components/PembahasanCard";

export const peluangDasarPembahasan: Record<number, Pembahasan> = {
  1: {
    jawaban: "C. 55",
    konsepTrik:
      "Aturan perkalian + kasus. Bilangan 3-digit yang habis dibagi 5 memiliki digit terakhir 0 atau 5. Pisahkan dua kasus ini.",
    stepByStep:
      "Kasus 1 (digit akhir = 0): digit pertama 6 pilihan (1–6), digit tengah 5 pilihan\n" +
      "→ $6 \\times 5 = 30$\n" +
      "Kasus 2 (digit akhir = 5): digit pertama 5 pilihan (bukan 0 dan 5), digit tengah 5 pilihan\n" +
      "→ $5 \\times 5 = 25$\n" +
      "Total = $30 + 25 = 55$ bilangan",
    tips:
      "Habis dibagi 5 → digit terakhir = 0 atau 5. Pisahkan dua kasus karena syarat digit pertama berbeda.",
    kesimpulan:
      "Terdapat 55 bilangan 3-digit dari digit 0–6 yang habis dibagi 5.",
  },
  2: {
    jawaban: "A. 120.960",
    konsepTrik:
      "Susunan total − susunan dengan 2M berdampingan. Untuk M berdampingan, anggap MM sebagai 1 blok (9 elemen).",
    stepByStep:
      "MATEMATIKA: 10 huruf (M:2, A:3, T:2, E:1, I:1, K:1)\n" +
      "Susunan total = $\\frac{10!}{2! \\cdot 3! \\cdot 2!} = 151.200$\n" +
      "MM berdampingan (9 elemen, A:3, T:2): $\\frac{9!}{3! \\cdot 2!} = 30.240$\n" +
      "Tidak bersebelahan = $151.200 - 30.240 = 120.960$",
    tips:
      "Komplemen: total − (yang berdampingan). Untuk 'berdampingan', gabungkan elemen menjadi 1 blok.",
    kesimpulan:
      "Banyak susunan huruf MATEMATIKA dengan 2M tidak bersebelahan = 120.960.",
  },
  3: {
    jawaban: "D. 768",
    konsepTrik:
      "Anggap tiap pasangan sebagai 1 blok → permutasi melingkar 5 blok. Lalu tiap pasangan dapat bertukar posisi dalam blok.",
    stepByStep:
      "5 pasangan → 5 blok, susunan melingkar = $(5-1)! = 24$\n" +
      "Tiap pasangan dapat bertukar: $2^5 = 32$\n" +
      "Total = $24 \\times 32 = 768$ cara",
    tips:
      "Permutasi melingkar n objek = (n−1)!. Ingat untuk mengalikan dengan $2^n$ jika tiap pasangan bisa bertukar.",
    kesimpulan:
      "Banyak cara duduk melingkar dengan tiap pasangan berdekatan = 768.",
  },
  4: {
    jawaban: "D. 186",
    konsepTrik:
      "Minimal 2 wanita → gunakan kasus: 2W3P + 3W2P + 4W1P. Hitung dengan kombinasi.",
    stepByStep:
      "$C(4,2)C(6,3) + C(4,3)C(6,2) + C(4,4)C(6,1)$\n" +
      "$= 6 \\cdot 20 + 4 \\cdot 15 + 1 \\cdot 6$\n" +
      "$= 120 + 60 + 6 = 186$",
    tips:
      "Atau gunakan komplemen: total − kasus 0W − kasus 1W = C(10,5) − C(6,5) − C(4,1)C(6,4).",
    kesimpulan:
      "Banyak cara memilih tim dengan minimal 2 wanita = 186.",
  },
  5: {
    jawaban: "C. 21",
    konsepTrik:
      "3 soal wajib sudah pasti dipilih. Dari 7 soal bebas, pilih 5 menggunakan kombinasi.",
    stepByStep:
      "3 soal wajib → harus dikerjakan (1 cara)\n" +
      "Dari 7 soal bebas, pilih 5:\n" +
      "$C(7,5) = \\frac{7!}{5! \\cdot 2!} = 21$ cara",
    tips:
      "Soal 'wajib' tidak memberikan pilihan — langsung hitung kombinasi untuk soal bebasnya.",
    kesimpulan:
      "Banyak cara memilih soal = 21.",
  },
  6: {
    jawaban: "A. 0",
    konsepTrik:
      "Prinsip Inklusi-Eksklusi: $|M \\cup F \\cup K| = |M| + |F| + |K| - |M\\cap F| - |M\\cap K| - |F\\cap K| + |M\\cap F\\cap K|$.",
    stepByStep:
      "$|M \\cup F \\cup K| = 15+20+10 - 8-5-3 + 2 = 31$\n" +
      "Karena $31 \\ge 30$ (total siswa), semua siswa menyukai minimal 1 pelajaran\n" +
      "Siswa tidak suka satupun = $30 - 30 = 0$",
    tips:
      "Jika hasil inklusi-eksklusi ≥ total, berarti semua orang masuk setidaknya satu himpunan.",
    kesimpulan:
      "Tidak ada siswa yang tidak menyukai satupun dari ketiga pelajaran.",
  },
  7: {
    jawaban: "C. 13",
    konsepTrik:
      "Prinsip Pigeonhole: skenario terburuk adalah mengambil 4 bola dari setiap warna (belum ada 5 dari satu warna). Bola berikutnya pasti memenuhi syarat.",
    stepByStep:
      "3 warna, masing-masing 4 bola: ambil 4+4+4 = 12 bola, belum ada 5 dari satu warna\n" +
      "Bola ke-13 pasti membuat salah satu warna ≥ 5 bola",
    tips:
      "Pigeon hole: jika n+1 merpati di n sarang, minimal 1 sarang ada 2 merpati. Di sini: ingin 5 dari 1 warna.",
    kesimpulan:
      "Minimal 13 bola harus diambil untuk memastikan ada 5 bola dengan warna yang sama.",
  },
  8: {
    jawaban: "B. 9",
    konsepTrik:
      "Derangement (permutasi tanpa titik tetap). $D_n = n! \\sum_{k=0}^{n} \\frac{(-1)^k}{k!}$.",
    stepByStep:
      "$D_4 = 4! \\left(1 - \\frac{1}{1!} + \\frac{1}{2!} - \\frac{1}{3!} + \\frac{1}{4!}\\right)$\n" +
      "$= 24 \\left(1 - 1 + \\frac{1}{2} - \\frac{1}{6} + \\frac{1}{24}\\right)$\n" +
      "$= 24 \\cdot \\frac{9}{24} = 9$",
    tips:
      "Hafal nilai kecil: $D_1=0, D_2=1, D_3=2, D_4=9$. Rekursi: $D_n = (n-1)(D_{n-1}+D_{n-2})$.",
    kesimpulan:
      "Banyak cara memasukkan surat sehingga tidak ada yang sesuai alamatnya = 9 cara.",
  },
  9: {
    jawaban: "B. 16",
    konsepTrik:
      "Jabat tangan = $C(n,2) = \\frac{n(n-1)}{2}$. Cari n dari persamaan ini.",
    stepByStep:
      "$C(n,2) = 120$\n" +
      "$\\frac{n(n-1)}{2} = 120$\n" +
      "$n(n-1) = 240$\n" +
      "$n = 16$ (karena $16 \\times 15 = 240$)",
    tips:
      "Setiap pasangan berjabat tangan 1 kali → gunakan kombinasi C(n,2). Selesaikan dengan trial atau persamaan kuadrat.",
    kesimpulan:
      "Banyak orang dalam kelompok = 16 orang.",
  },
  10: {
    jawaban: "C. 60",
    konsepTrik:
      "Total jabat tangan − jabat tangan yang tidak boleh terjadi (antar pasangan suami-istri).",
    stepByStep:
      "Total jabat tangan semua orang = $C(12,2) = 66$\n" +
      "Kurangi 6 pasangan suami-istri yang tidak berjabat: $66 - 6 = 60$",
    tips:
      "Komplemen sederhana: hitung total, lalu kurangi yang dilarang.",
    kesimpulan:
      "Banyak jabat tangan yang terjadi = 60.",
  },
  11: {
    jawaban: "C. 90",
    konsepTrik:
      "Bilangan 3-digit GENAP dari {0,1,2,3,4,5} boleh berulang. Digit terakhir harus genap (0,2,4), digit pertama bukan 0.",
    stepByStep:
      "Digit terakhir (genap: 0,2,4): 3 pilihan\n" +
      "Digit pertama (bukan 0): 5 pilihan\n" +
      "Digit tengah (bebas): 6 pilihan\n" +
      "Total = $5 \\times 6 \\times 3 = 90$",
    tips:
      "Isi digit terakhir dulu (yang memiliki syarat kegenap), lalu digit pertama (syarat ≠ 0), lalu tengah.",
    kesimpulan:
      "Banyak bilangan 3-digit genap yang dapat dibentuk = 90.",
  },
  12: {
    jawaban: "C. 3/6",
    konsepTrik:
      "Peluang = banyak kejadian / banyak ruang sampel. Bilangan prima dari 1–6: {2, 3, 5}.",
    stepByStep:
      "Ruang sampel dadu = {1,2,3,4,5,6}, n(S) = 6\n" +
      "Bilangan prima: {2,3,5}, n(A) = 3\n" +
      "$P = \\frac{3}{6} = \\frac{1}{2}$",
    tips:
      "1 bukan bilangan prima! Prima dari 1–10: {2,3,5,7}.",
    kesimpulan:
      "Peluang muncul bilangan prima = 3/6.",
  },
  13: {
    jawaban: "A. 1/9",
    konsepTrik:
      "Lempar dua dadu: n(S) = 36. Hitung pasangan (a,b) dengan a+b = 9.",
    stepByStep:
      "Pasangan jumlah 9: (3,6),(4,5),(5,4),(6,3) → 4 cara\n" +
      "$P = \\frac{4}{36} = \\frac{1}{9}$",
    tips:
      "Dua dadu: n(S) = 36. Sistematiskan dengan tabel 6×6 untuk menghindari kelupaan.",
    kesimpulan:
      "Peluang jumlah dua dadu = 9 adalah 1/9.",
  },
  14: {
    jawaban: "C. 5/12",
    konsepTrik:
      "Hitung pasangan (a,b) dengan a+b > 7, yaitu jumlah 8 s.d. 12. Atau gunakan komplemen: 1 − P(jumlah ≤ 7).",
    stepByStep:
      "Jumlah 8: (2,6),(3,5),(4,4),(5,3),(6,2) = 5 cara\n" +
      "Jumlah 9: (3,6),(4,5),(5,4),(6,3) = 4 cara\n" +
      "Jumlah 10: (4,6),(5,5),(6,4) = 3 cara\n" +
      "Jumlah 11: (5,6),(6,5) = 2 cara\n" +
      "Jumlah 12: (6,6) = 1 cara\n" +
      "Total = 15. $P = \\frac{15}{36} = \\frac{5}{12}$",
    tips:
      "Komplemen lebih cepat: P(>7) = 1 − P(≤7). P(≤7) = 21/36, sehingga P(>7) = 15/36.",
    kesimpulan:
      "Peluang jumlah dua dadu > 7 = 5/12.",
  },
  15: {
    jawaban: "D. 1/3",
    konsepTrik:
      "Peluang = banyak huruf yang dimaksud / total huruf. Hitung huruf A dalam kata MATEMATIKA.",
    stepByStep:
      "MATEMATIKA: M-A-T-E-M-A-T-I-K-A = 10 huruf\n" +
      "Huruf A muncul: posisi 2, 6, 10 = 3 kali\n" +
      "$P(A) = \\frac{3}{10} \\approx \\frac{1}{3}$",
    tips:
      "Saat memilih huruf secara acak, setiap kartu huruf adalah 1 titik sampel.",
    kesimpulan:
      "Peluang terpilih huruf A = 3/10 ≈ 1/3.",
  },
  16: {
    jawaban: "B. 7/14",
    konsepTrik:
      "Peluang bersyarat: kelereng 9 sudah keluar. Update ruang sampel dan banyaknya bilangan ganjil.",
    stepByStep:
      "Ruang sampel baru: 15 − 1 = 14 kelereng (9 sudah keluar)\n" +
      "Ganjil dari 1–15: {1,3,5,7,9,11,13,15} = 8, kurangi 9 → 7 ganjil tersisa\n" +
      "$P = \\frac{7}{14}$",
    tips:
      "Peluang bersyarat: kurangi ruang sampel dengan kejadian yang sudah terjadi.",
    kesimpulan:
      "Peluang terambil kelereng ganjil (setelah kelereng 9 diambil) = 7/14.",
  },
  17: {
    jawaban: "C. 1/6",
    konsepTrik:
      "Peluang bersyarat: setelah bola biru diambil, update ruang sampel. Identifikasi bola putih kelipatan 3.",
    stepByStep:
      "Bola biru diambil → sisa 12 bola\n" +
      "Bola putih = nomor 9–13: {9,10,11,12,13}\n" +
      "Putih kelipatan 3: {9,12} → 2 bola\n" +
      "$P = \\frac{2}{12} = \\frac{1}{6}$",
    tips:
      "Selalu perbarui ruang sampel setelah pengambilan sebelumnya. Identifikasi himpunan yang diminta dengan cermat.",
    kesimpulan:
      "Peluang terambil bola putih dengan nomor kelipatan 3 = 1/6.",
  },
  18: {
    jawaban: "D. 1/6",
    konsepTrik:
      "Inklusi-Eksklusi untuk mencari total peserta, lalu hitung yang hanya lulus fisik.",
    stepByStep:
      "Total peserta = $25 + 20 - 15 = 30$ (inkl-ekskl)\n" +
      "Lulus fisik saja = lulus fisik − keduanya = $20 - 15 = 5$\n" +
      "$P = \\frac{5}{30} = \\frac{1}{6}$",
    tips:
      "Lulus fisik saja = (lulus fisik) − (lulus keduanya). Jangan tertukar dengan 'lulus fisik' secara keseluruhan.",
    kesimpulan:
      "Peluang peserta yang hanya lulus tes fisik = 1/6.",
  },
  19: {
    jawaban: "C. 3/8",
    konsepTrik:
      "3 koin dilempar: n(S) = $2^3 = 8$. Hitung banyaknya hasil dengan tepat 2 angka dan 1 gambar.",
    stepByStep:
      "n(S) = $2^3 = 8$\n" +
      "Susunan 2A1G: pilih posisi G dari 3 → $C(3,1) = 3$\n" +
      "$(AAG, AGA, GAA)$\n" +
      "$P = \\frac{3}{8}$",
    tips:
      "Banyak hasil dengan tepat k angka dari n koin = $C(n,k)$.",
    kesimpulan:
      "Peluang tepat 2 angka dari 3 koin = 3/8.",
  },
  20: {
    jawaban: "B. 0,500",
    konsepTrik:
      "Minimal 2 angka dari 3 koin = (tepat 2 angka) + (tepat 3 angka). Hitung dengan kombinasi.",
    stepByStep:
      "n(S) = 8\n" +
      "Tepat 2A: $C(3,2) = 3$\n" +
      "Tepat 3A: $C(3,3) = 1$\n" +
      "Total = 4\n" +
      "$P = \\frac{4}{8} = 0{,}500$",
    tips:
      "Min 2A = P(2A) + P(3A) = komplemen dari P(0A) + P(1A).",
    kesimpulan:
      "Peluang minimal 2 angka dari 3 koin = 0,500.",
  },
  21: {
    jawaban: "B. 20%",
    konsepTrik:
      "Peluang = frekuensi kejadian / total frekuensi. Hitung total permen dan banyak permen merah.",
    stepByStep:
      "Total permen = 4+2+8+6 = 20\n" +
      "Permen merah = 4\n" +
      "$P = \\frac{4}{20} = 20\\%$",
    tips:
      "Persentase peluang = (banyak yang diminta / total) × 100%.",
    kesimpulan:
      "Peluang terambil permen merah = 20%.",
  },
  22: {
    jawaban: "C. 3/14",
    konsepTrik:
      "Ambil 2 bola sekaligus → kombinasi. Bola genap dari {1..8}: {2,4,6,8} = 4 buah.",
    stepByStep:
      "n(S) = $C(8,2) = 28$\n" +
      "Bola genap: {2,4,6,8}, n(A) = $C(4,2) = 6$\n" +
      "$P = \\frac{6}{28} = \\frac{3}{14}$",
    tips:
      "Pengambilan sekaligus (tidak berurutan) → gunakan kombinasi C(n,r).",
    kesimpulan:
      "Peluang terambil 2 bola bernomor genap = 3/14.",
  },
  23: {
    jawaban: "B. 3/10",
    konsepTrik:
      "Ambil 2 bola dari 5 bola (bernomor 1–5). Bola ganjil: {1,3,5} = 3 buah.",
    stepByStep:
      "n(S) = $C(5,2) = 10$\n" +
      "Bola ganjil: {1,3,5}, n(A) = $C(3,2) = 3$\n" +
      "$P = \\frac{3}{10}$",
    tips:
      "Ingat: $C(3,2) = 3$ (pilih 2 dari 3 = sama dengan memilih yang tidak dipilih).",
    kesimpulan:
      "Peluang terambil 2 bola ganjil = 3/10.",
  },
  24: {
    jawaban: "C. 30",
    konsepTrik:
      "Susunan 2 angka BERBEDA (permutasi) dari 6 angka yang tersedia.",
    stepByStep:
      "$P(6,2) = 6 \\times 5 = 30$",
    tips:
      "Permutasi P(n,r) = n!/(n-r)! digunakan ketika urutan penting dan tanpa pengulangan.",
    kesimpulan:
      "Banyak susunan 2 angka berbeda = 30.",
  },
  25: {
    jawaban: "D. 0,28",
    konsepTrik:
      "Jumlah kejadian yang saling lepas (mutually exclusive) → $P(A \\cup B) = P(A) + P(B)$.",
    stepByStep:
      "Jumlah 5: (1,4),(2,3),(3,2),(4,1) = 4 pasangan\n" +
      "Jumlah 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 pasangan\n" +
      "$P = \\frac{4+6}{36} = \\frac{10}{36} \\approx 0{,}28$",
    tips:
      "Jumlah 5 dan jumlah 7 adalah kejadian yang mutually exclusive (tidak bisa terjadi bersamaan dengan 2 dadu).",
    kesimpulan:
      "Peluang jumlah dua dadu = 5 atau 7 ≈ 0,28.",
  },
  26: {
    jawaban: "B. 1/6",
    konsepTrik:
      "Kejadian independen: koin dan dadu tidak saling mempengaruhi. $P(A \\cap B) = P(A) \\times P(B)$.",
    stepByStep:
      "$P(\\text{Gambar}) = \\frac{1}{2}$\n" +
      "$P(\\text{dadu} > 4) = P(\\{5,6\\}) = \\frac{2}{6} = \\frac{1}{3}$\n" +
      "$P = \\frac{1}{2} \\times \\frac{1}{3} = \\frac{1}{6}$",
    tips:
      "Kejadian independen: hasil satu percobaan tidak mempengaruhi yang lain → kalikan peluangnya.",
    kesimpulan:
      "Peluang gambar dan dadu > 4 = 1/6.",
  },
  27: {
    jawaban: "C. 1/13",
    konsepTrik:
      "Dalam satu set kartu, ada 52 kartu dan 4 As (satu per lambang).",
    stepByStep:
      "Total kartu = 52, kartu As = 4\n" +
      "$P = \\frac{4}{52} = \\frac{1}{13}$",
    tips:
      "Kartu remi standar: 52 kartu, 4 lambang, tiap lambang 13 kartu (A,2,...,10,J,Q,K).",
    kesimpulan:
      "Peluang mengambil kartu As = 1/13.",
  },
  28: {
    jawaban: "B. 20 kali",
    konsepTrik:
      "Frekuensi harapan = peluang × banyak percobaan.",
    stepByStep:
      "$P(\\text{dadu} < 3) = P(\\{1,2\\}) = \\frac{2}{6} = \\frac{1}{3}$\n" +
      "Frekuensi harapan = $60 \\times \\frac{1}{3} = 20$ kali",
    tips:
      "Frekuensi harapan bukan berarti pasti terjadi, tapi merupakan nilai yang diharapkan dalam banyak percobaan.",
    kesimpulan:
      "Dadu diharapkan muncul kurang dari 3 sebanyak 20 kali dalam 60 pelemparan.",
  },
  29: {
    jawaban: "C. 1/3",
    konsepTrik:
      "Peluang dasar: banyak bola merah / total bola.",
    stepByStep:
      "Total bola = 4+6+5 = 15\n" +
      "Bola merah = 5\n" +
      "$P = \\frac{5}{15} = \\frac{1}{3}$",
    tips:
      "Hitung total bola dari semua warna terlebih dahulu.",
    kesimpulan:
      "Peluang terambil bola merah = 1/3.",
  },
  30: {
    jawaban: "A. 1/8",
    konsepTrik:
      "3 koin: n(S) = $2^3 = 8$. Hanya 1 cara untuk mendapatkan 3 gambar (GGG).",
    stepByStep:
      "n(S) = 8\n" +
      "n(3 Gambar) = 1 (GGG)\n" +
      "$P = \\frac{1}{8}$",
    tips:
      "Kejadian dengan hasil spesifik tunggal selalu memiliki peluang 1/n(S).",
    kesimpulan:
      "Peluang ketiga koin menunjukkan gambar = 1/8.",
  },
  31: {
    jawaban: "C. 1/2",
    konsepTrik:
      "Peluang dadu: hitung banyaknya mata yang memenuhi syarat.",
    stepByStep:
      "Mata < 4: {1,2,3} → 3 angka\n" +
      "$P = \\frac{3}{6} = \\frac{1}{2}$",
    tips:
      "Peluang dadu muncul < 4 = P(1) + P(2) + P(3) = 3/6.",
    kesimpulan:
      "Peluang muncul mata dadu kurang dari 4 = 1/2.",
  },
  32: {
    jawaban: "B. 4/15",
    konsepTrik:
      "Peluang total dengan dua kasus berdasarkan apa yang dipindahkan dari Kotak A ke B.",
    stepByStep:
      "Kotak A: 5M, 7K, 3B (total 15). Kotak B: 3M, 5K, 3B (total 11)\n" +
      "Kasus 1 — Ibu ambil biru ($P = 3/15$): B punya 4B dari 12. $P(\\text{anak biru}) = 4/12$\n" +
      "Kasus 2 — Ibu ambil tidak biru ($P = 12/15$): B punya 3B dari 12. $P(\\text{anak biru}) = 3/12$\n" +
      "$P = \\frac{3}{15} \\cdot \\frac{4}{12} + \\frac{12}{15} \\cdot \\frac{3}{12}$\n" +
      "$= \\frac{12}{180} + \\frac{36}{180} = \\frac{48}{180} = \\frac{4}{15}$",
    tips:
      "Peluang total = jumlah peluang tiap kasus × peluang kasusnya. Pisahkan berdasarkan apa yang terjadi di tahap pertama.",
    kesimpulan:
      "Peluang anak mengambil bola biru = 4/15.",
  },
  33: {
    jawaban: "C. 11/16",
    konsepTrik:
      "4 koin: n(S) = $2^4 = 16$. Paling banyak 2L (laki-laki) = 0L + 1L + 2L.",
    stepByStep:
      "n(S) = 16\n" +
      "$C(4,0) + C(4,1) + C(4,2) = 1 + 4 + 6 = 11$\n" +
      "$P = \\frac{11}{16}$",
    tips:
      "Komplemen: P(≤2L) = 1 − P(3L) − P(4L) = 1 − 4/16 − 1/16 = 11/16.",
    kesimpulan:
      "Peluang lahir paling banyak 2 anak laki-laki = 11/16.",
  },
  34: {
    jawaban: "C. 1/32",
    konsepTrik:
      "Kejadian independen berantai: hitung peluang B masuk final × F masuk final × F menang final.",
    stepByStep:
      "P(B masuk final) = $(\\frac{1}{2})^2 = \\frac{1}{4}$\n" +
      "P(F masuk final) = $(\\frac{1}{2})^2 = \\frac{1}{4}$\n" +
      "P(F menang final) = $\\frac{1}{2}$\n" +
      "$P = \\frac{1}{4} \\cdot \\frac{1}{4} \\cdot \\frac{1}{2} = \\frac{1}{32}$",
    tips:
      "Untuk turnamen, hitung berapa ronde yang harus dimenangkan setiap pemain untuk sampai ke final.",
    kesimpulan:
      "Peluang F menjadi juara melalui babak lawan B di final = 1/32.",
  },
  35: {
    jawaban: "C. 18",
    konsepTrik:
      "Aturan perkalian: jika ada m cara untuk satu pilihan dan n cara untuk pilihan lain (independen), total = m × n.",
    stepByStep:
      "3 pilihan baju × 3 pilihan celana × 2 pilihan sepatu = $3 \\times 3 \\times 2 = 18$ kombinasi",
    tips:
      "Aturan perkalian berlaku jika setiap pilihan independen (tidak mempengaruhi pilihan lain).",
    kesimpulan:
      "Total kombinasi pakaian = 18.",
  },
  36: {
    jawaban: "D. 1/2",
    konsepTrik:
      "Identifikasi bola yang memenuhi syarat (ganjil ATAU vokal), lalu gabungkan — pastikan tidak ada irisan.",
    stepByStep:
      "Total bola = 7 (kuning) + 5 (merah) = 12\n" +
      "Kuning ganjil: {1,3,5,7} → 4 bola\n" +
      "Merah huruf vokal: {a,e} → 2 bola\n" +
      "(irisan = 0 karena beda warna)\n" +
      "$P = \\frac{4+2}{12} = \\frac{6}{12} = \\frac{1}{2}$",
    tips:
      "Dua himpunan dari kategori berbeda (warna berbeda) pasti tidak beririsan.",
    kesimpulan:
      "Peluang terambil bola kuning bernomor ganjil atau bola merah berhuruf vokal = 1/2.",
  },
  37: {
    jawaban: "B. 3/10",
    konsepTrik:
      "Peluang dasar: banyak bola kuning / total bola.",
    stepByStep:
      "Total bola = 5+6+9 = 20\n" +
      "Bola kuning = 6\n" +
      "$P = \\frac{6}{20} = \\frac{3}{10}$",
    tips:
      "Selalu jumlahkan semua bola untuk mendapatkan total ruang sampel.",
    kesimpulan:
      "Peluang terambil bola kuning = 3/10.",
  },
  38: {
    jawaban: "C. 19/30",
    konsepTrik:
      "Inklusi-Eksklusi: $|A \\cup B| = |A| + |B| - |A \\cap B|$. Kelipatan 3 ATAU prima.",
    stepByStep:
      "Dari 1–30:\n" +
      "Kelipatan 3: {3,6,9,...,30} = 10 kartu\n" +
      "Prima: {2,3,5,7,11,13,17,19,23,29} = 10 kartu\n" +
      "Irisan (kelipatan 3 dan prima): {3} = 1 kartu\n" +
      "$|A \\cup B| = 10 + 10 - 1 = 19$\n" +
      "$P = \\frac{19}{30}$",
    tips:
      "Hati-hati: 3 adalah satu-satunya bilangan prima yang juga kelipatan 3.",
    kesimpulan:
      "Peluang terambil kartu berlipatan 3 atau prima = 19/30.",
  },
  39: {
    jawaban: "B. 0,60",
    konsepTrik:
      "Frekuensi relatif = frekuensi / total percobaan. Nilainya stabil (konvergen) setelah banyak percobaan.",
    stepByStep:
      "Frekuensi relatif angka = $\\frac{36}{60} = 0{,}60$",
    tips:
      "Frekuensi relatif tidak berubah jika proporsi tetap sama, meski total percobaan berubah.",
    kesimpulan:
      "Frekuensi relatif muncul angka = 0,60.",
  },
  40: {
    jawaban: "B. 5/24",
    konsepTrik:
      "Cari semua triplet (a,b,c) dari dadu dengan a+b=c. Hitung semua permutasi terurut triplet ini. Bagi dengan total kemungkinan $6^3 = 216$.",
    stepByStep:
      "Triplet (a≤b) dengan a+b=c, c≤6:\n" +
      "{1,1,2}(3 perm), {1,2,3}(6), {1,3,4}(6), {2,2,4}(3),\n" +
      "{1,4,5}(6), {2,3,5}(6), {1,5,6}(6), {2,4,6}(6), {3,3,6}(3)\n" +
      "Total permutasi = $3+6+6+3+6+6+6+6+3 = 45$\n" +
      "$P = \\frac{45}{216} = \\frac{5}{24}$",
    tips:
      "Hati-hati dengan triplet yang ada angka sama — permutasinya lebih sedikit (3, bukan 6).",
    kesimpulan:
      "Peluang satu mata dadu = jumlah dua mata dadu lainnya = 5/24.",
  },
};
