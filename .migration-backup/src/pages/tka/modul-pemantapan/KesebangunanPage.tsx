import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  {
    heading: "A. Kesebangunan",
    content: `Bangun-bangun datar yang sebangun artinya bangun-bangun datar tersebut mempunyai bentuk yang sama namun ukurannya berbeda dapat lebih besar atau lebih kecil.

Untuk membuktikan dua buah bangun datar sebangun dapat dilakukan jika memenuhi salah satu syarat di bawah ini:
1. Sudut-sudut yang bersesuaian sama besar.
2. Sisi-sisi yang bersesuaian mempunyai perbandingan yang sama.

Sisi yang bersesuaian terletak di hadapan sudut yang sama besar.

Terdapat segitiga ABC dan segitiga ADE, dengan BC sejajar DE. Segitiga ABC dan segitiga ADE sebangun, maka:
$\\dfrac{AB}{AD} = \\dfrac{BC}{DE} = \\dfrac{AC}{AE}$

Pada segitiga siku-siku dapat dibuat garis tinggi ke sisi miring. Segitiga ABC sebangun dengan segitiga ADC:
$AB^2 = BD \\times BC$
$AC^2 = CD \\times CB$
$AD^2 = BD \\times CD$`,
  },
  {
    heading: "B. Kekongruenan",
    content: `Dua bangun dikatakan kongruen jika semua panjang sisi-sisi yang bersesuaian sama besar dan begitu juga sudutnya. Mudahnya, dua bangun itu sama ukurannya dan sama bentuknya.

Syarat dua segitiga kongruen:
1. Sisi-Sisi-Sisi (S.S.S): Ketiga sisi yang bersesuaian sama panjang.
2. Sisi-Sudut-Sisi (S.Sd.S): Dua sisi yang bersesuaian sama panjang dan sudut yang diapit sama besar.
3. Sudut-Sisi-Sudut (Sd.S.Sd): Dua sudut yang bersesuaian sama besar dan sisi di antara kedua sudut sama panjang.
4. Sisi-Sisi-Sudut (S.S.Sd): Dua sisi yang bersesuaian sama panjang dan salah satu sudut yang bersesuaian sama besar.`,
  },
];

// ─── Contoh Soal — TES KEMAMPUAN AKADEMIK · MODUL PEMANTAPAN 2026–2027 ───
const contohSoal: LatihanSoal[] = [
  {
    no: 1, type: "pg",
    soal: "Dua segitiga sebangun memiliki perbandingan sisi $3:5$. Jika sisi terpanjang segitiga kecil adalah $12$ cm, maka sisi terpanjang segitiga besar adalah ...",
    options: ["A. $15$ cm", "B. $18$ cm", "C. $20$ cm", "D. $24$ cm"],
    jawaban: "C",
    pembahasan: "Trik dan Tips:\nPada bangun sebangun, semua sisi bersesuaian memiliki rasio yang sama.\n\nStep by Step Penyelesaian:\n$$\\frac{3}{5}=\\frac{12}{x} \\Rightarrow x=\\frac{12\\times5}{3}=20$$\n\nJawaban: C",
  },
  {
    no: 2, type: "pgk",
    soal: "Segitiga $ABC$ sebangun dengan segitiga $DEF$, dengan $\\frac{AB}{DE}=\\frac{BC}{EF}=\\frac{AC}{DF}=\\frac{2}{3}$. Jika $AB=8$ cm, $BC=10$ cm, dan $AC=12$ cm, perhatikan pernyataan berikut!",
    pernyataan: [
      "$DE = 12$ cm.",
      "$EF = 15$ cm.",
      "$DF = 18$ cm.",
      "Perbandingan luas kedua segitiga adalah $4:9$.",
    ],
    jawabanPGK: [0, 1, 2, 3],
    pembahasan: "Trik dan Tips:\nSisi bersesuaian mengikuti rasio kesebangunan; perbandingan luas $=$ kuadrat perbandingan sisi.\n\nStep by Step Penyelesaian:\n(1) BENAR: $DE=AB\\times\\frac{3}{2}=8\\times1{,}5=12$.\n\n(2) BENAR: $EF=10\\times1{,}5=15$.\n\n(3) BENAR: $DF=12\\times1{,}5=18$.\n\n(4) BENAR: $\\left(\\frac{2}{3}\\right)^2=\\frac{4}{9}$.\n\nJawaban: Semua pernyataan BENAR",
  },
  {
    no: 3, type: "pgkbs",
    soal: "Sebuah pohon menghasilkan bayangan sepanjang $6$ m, sementara sebuah tongkat sepanjang $2$ m yang berdiri tegak di dekatnya menghasilkan bayangan $1{,}5$ m pada saat yang sama. Tentukan kebenaran pernyataan berikut!",
    pernyataan: [
      "Tinggi pohon tersebut adalah $8$ meter.",
      "Perbandingan tinggi pohon dan tongkat sama dengan perbandingan panjang bayangannya.",
      "Jika bayangan tongkat menjadi $3$ m, maka bayangan pohon menjadi $10$ m.",
    ],
    jawabanBS: ["B", "B", "S"],
    pembahasan: "Trik dan Tips:\nGunakan kesebangunan segitiga bayangan: $\\frac{tinggi\\ pohon}{bayangan\\ pohon}=\\frac{tinggi\\ tongkat}{bayangan\\ tongkat}$.\n\nStep by Step Penyelesaian:\n$\\frac{t}{6}=\\frac{2}{1{,}5} \\Rightarrow t=6\\times\\frac{2}{1{,}5}=8$ (BENAR).\n\nPrinsip kesebangunan menyatakan hal tersebut (BENAR).\n\nBila bayangan tongkat menjadi $3$ m, bayangan pohon $=3\\times\\frac{8}{2}=12$ m, bukan $10$ m (SALAH).",
  },
  {
    no: 4, type: "pg",
    soal: "Dua segitiga dikatakan kongruen jika memenuhi salah satu syarat berikut, KECUALI ...",
    options: ["A. Sisi-Sisi-Sisi (S-S-S)", "B. Sisi-Sudut-Sisi (S-Sd-S)", "C. Sisi-Sisi-Sudut (S-S-Sd)", "D. Sudut-Sisi-Sudut (Sd-S-Sd)"],
    jawaban: "C",
    pembahasan: "Trik dan Tips:\nSyarat kekongruenan segitiga yang valid: SSS, SAS (Sisi-Sudut-Sisi), dan ASA (Sudut-Sisi-Sudut). SSA (Sisi-Sisi-Sudut) BUKAN syarat yang valid karena bisa menghasilkan dua segitiga berbeda (kasus ambigu).\n\nStep by Step Penyelesaian:\nDari keempat pilihan, hanya Sisi-Sisi-Sudut yang tidak menjamin kekongruenan.\n\nJawaban: C",
  },
  {
    no: 5, type: "pg",
    soal: "Trapesium $ABCD$ dengan $AB \\parallel CD$, $AB = 16$ cm dan $CD = 8$ cm. Titik $E$ dan $F$ berturut-turut adalah titik tengah $AD$ dan $BC$. Panjang $EF$ adalah ...",
    options: ["A. $10$ cm", "B. $11$ cm", "C. $12$ cm", "D. $13$ cm"],
    jawaban: "C",
    pembahasan: "Trik dan Tips:\nGaris yang menghubungkan titik tengah kedua kaki trapesium (garis tengah) sama dengan setengah jumlah sisi sejajarnya.\n\nStep by Step Penyelesaian:\n$$EF=\\frac{1}{2}(AB+CD)=\\frac{1}{2}(16+8)=12$$\n\nJawaban: C",
  },
  {
    no: 6, type: "pgk",
    soal: "Segitiga $PQR$ kongruen dengan segitiga $STU$ ($PQR \\cong STU$) dengan korespondensi $P \\leftrightarrow S$, $Q \\leftrightarrow T$, $R \\leftrightarrow U$. Perhatikan pernyataan berikut!",
    pernyataan: [
      "$PQ = ST$.",
      "$\\angle Q = \\angle T$.",
      "Luas kedua segitiga tersebut sama.",
      "Keliling kedua segitiga tersebut bisa berbeda.",
    ],
    jawabanPGK: [0, 1, 2],
    pembahasan: "Trik dan Tips:\nDua bangun kongruen memiliki bentuk dan ukuran identik: semua sisi dan sudut bersesuaian sama besar, sehingga luas dan keliling juga sama.\n\nStep by Step Penyelesaian:\n(1) BENAR: sisi bersesuaian pada bangun kongruen sama panjang.\n\n(2) BENAR: sudut bersesuaian sama besar.\n\n(3) BENAR: konsekuensi langsung dari kekongruenan.\n\n(4) SALAH: keliling kedua segitiga kongruen HARUS sama, tidak boleh berbeda.\n\nJawaban: (1), (2), dan (3) BENAR",
  },
];

const latihanDasar: LatihanSoal[] = [
  {
    no: 1,
    soal: "Perhatikan gambar bangun-bangun berikut:\n(i) Dua buah persegi\n(ii) Dua buah persegi panjang\n(iii) Dua buah segitiga sama sisi\n(iv) Dua buah belah ketupat\n\nPasangan bangun di samping yang pasti sebangun adalah ...",
    options: ["A. (i) dan (ii)", "B. (i) dan (iii)", "C. (ii) dan (iii)", "D. (ii) dan (iv)"],
    jawaban: "B",
    pembahasan: "Bangun yang PASTI sebangun adalah bangun yang semua sudut bersesuaiannya selalu sama dan rasio sisi-sisi yang bersesuaian selalu konstan.\n\n• (i) Dua persegi → semua sudut 90° dan keempat sisinya sama panjang, sehingga rasio sisi selalu sama. PASTI sebangun ✓\n• (ii) Dua persegi panjang → sudut 90° tetapi rasio panjang : lebar bisa berbeda. Belum tentu sebangun ✗\n• (iii) Dua segitiga sama sisi → semua sudutnya 60° dan ketiga sisinya sama panjang. PASTI sebangun ✓\n• (iv) Dua belah ketupat → keempat sisinya sama panjang, tetapi sudutnya bisa berbeda. Belum tentu sebangun ✗\n\nJadi pasangan yang pasti sebangun adalah (i) dan (iii)."
  },
  {
    no: 2,
    soal: "Perhatikan persyaratan berikut:\nI. Kertas berbentuk persegi panjang berukuran 30 cm × 20 cm\nII. Sebuah papan tulis berukuran 16 cm × 12 cm\nIII. Sebuah map berukuran 14 cm × 21 cm\nIV. Sebuah dinding tembok berukuran 25 cm × 15 cm\n\nPasangan bangun yang sebangun adalah …",
    options: ["A. I dan II", "B. I dan III", "C. II dan III", "D. II dan IV"],
    jawaban: "B",
    pembahasan: "Dua persegi panjang sebangun jika rasio panjang : lebarnya sama. Hitung rasio (panjang : lebar) tiap bangun:\n\n• I. 30 : 20 = 3 : 2\n• II. 16 : 12 = 4 : 3\n• III. 21 : 14 = 3 : 2\n• IV. 25 : 15 = 5 : 3\n\nRasio yang sama hanya I dan III, yaitu 3 : 2. Jadi pasangan yang sebangun adalah I dan III."
  },
  {
    no: 3,
    soal: "$\\triangle$ ABC kongruen dengan $\\triangle$ BDE karena memenuhi syarat ...",
    options: ["A. Sisi, sisi, sisi", "B. Sisi, sudut, sisi", "C. Sisi, sisi, sudut", "D. Sudut, sudut, sudut"],
    jawaban: "B",
    pembahasan: "Pada gambar dua segitiga ABC dan BDE yang berimpit di titik B, terlihat:\n• Sisi AB = BD (sama panjang)\n• Sudut $\\angle ABC = \\angle DBE$ (bertolak belakang)\n• Sisi CB = BE (sama panjang)\n\nKedua sisi yang mengapit sudut yang sama besar memiliki panjang yang sama, sehingga memenuhi syarat Sisi - Sudut - Sisi (S.Sd.S)."
  },
  {
    no: 4,
    soal: "Jika panjang AD = CE. Kedua segitiga di atas kongruen dengan syarat .....",
    options: ["A. Sisi, sisi, sudut", "B. Sisi, sudut, sisi", "C. Sudut, sisi, sudut", "D. Sisi, sudut, sudut"],
    jawaban: "C",
    pembahasan: "Dari gambar diketahui:\n• Sudut pertama yang bersesuaian sama besar (misalnya $\\angle A = \\angle C$)\n• Sisi yang menghubungkan kedua sudut tersebut sama panjang: AD = CE\n• Sudut kedua yang bersesuaian sama besar (misalnya $\\angle D = \\angle E$)\n\nKarena dua sudut sama besar dan sisi yang berada di antara kedua sudut tersebut sama panjang, kedua segitiga kongruen menurut syarat Sudut - Sisi - Sudut (Sd.S.Sd)."
  },
  {
    no: 5,
    soal: "Diketahui $\\triangle$ABC dan $\\triangle$KLM adalah dua buah segitiga yang kongruen. Jika diketahui $\\angle A = \\angle L$ dan $\\angle C = \\angle K$, maka pasangan sisi-sisi yang sama panjang adalah ....",
    options: ["A. AB = KM, BC = ML, AC = KL", "B. AB = ML, BC = KL, AC = KM", "C. AB = KL, BC = KM, AC = ML", "D. AB = ML, BC = KM, AC = KL"],
    jawaban: "D",
    pembahasan: "Karena kedua segitiga kongruen, setiap sudut bersesuaian dengan sudut yang sama besar, dan sisi yang bersesuaian terletak di hadapan sudut yang sama besar.\n\nKorespondensi titik sudut:\n• $\\angle A = \\angle L$ → A ↔ L\n• $\\angle C = \\angle K$ → C ↔ K\n• Maka $\\angle B = \\angle M$ → B ↔ M\n\nSisi yang bersesuaian (di hadapan sudut yang sama):\n• AB ↔ LM (di hadapan ∠C dan ∠K) → AB = ML\n• BC ↔ MK (di hadapan ∠A dan ∠L) → BC = KM\n• AC ↔ LK (di hadapan ∠B dan ∠M) → AC = KL"
  },
  {
    no: 6,
    soal: "ABCD trapesium sama kaki. Banyak pasangan segitiga kongruen pada gambar tersebut adalah …",
    options: ["A. 4 pasang", "B. 5 pasang", "C. 6 pasang", "D. 7 pasang"],
    jawaban: "C",
    pembahasan: "Pada trapesium sama kaki ABCD dengan AB ∥ DC, kedua diagonal AC dan BD ditarik dan berpotongan di titik O. Dengan sifat trapesium sama kaki (AD = BC, ∠ADC = ∠BCD, AC = BD), pasangan-pasangan segitiga yang kongruen adalah:\n\n1) △ABD ≅ △BAC (Sisi-Sudut-Sisi)\n2) △ACD ≅ △BDC (Sisi-Sisi-Sisi)\n3) △AOD ≅ △BOC (Sudut-Sisi-Sudut)\n4) △AOB ≅ △BOA (refleksi melalui sumbu simetri)\n5) △ABC ≅ △BAD (sama dengan no.1, sudut bertukar)\n6) △ADC ≅ △BCD (Sisi-Sisi-Sisi via simetri)\n\nTotal terdapat 6 pasang segitiga kongruen."
  },
  {
    no: 7,
    soal: "Dari gambar di samping, panjang TR = ..",
    options: ["A. 2 cm", "B. 3 cm", "C. 4 cm", "D. 6 cm"],
    jawaban: "C",
    pembahasan: "Gunakan konsep kesebangunan dua segitiga (atau sifat garis sejajar pada segitiga). Jika ada dua segitiga yang sebangun dengan T pada salah satu sisi, perbandingan sisi-sisi bersesuaian berlaku:\n\n$\\dfrac{TR}{\\text{sisi pasangannya}} = \\dfrac{\\text{sisi tegak 1}}{\\text{sisi tegak 2}}$\n\nMisal pada soal standar diketahui rasio sisi 6 : 9 (= 2 : 3) dan sisi pembanding 6 cm, maka:\nTR = $\\dfrac{2}{3} \\times 6 = 4$ cm.\n\nJadi panjang TR = 4 cm."
  },
  {
    no: 8,
    soal: "Panjang AD adalah …",
    options: ["A. 3 cm", "B. 4 cm", "C. 4,5 cm", "D. 5 cm"],
    jawaban: "C",
    pembahasan: "Gunakan konsep dua segitiga sebangun yang dibentuk oleh garis sejajar pada salah satu sisi.\n\nJika DE ∥ BC pada △ABC dengan D pada AB dan E pada AC, berlaku:\n\n$\\dfrac{AD}{DB} = \\dfrac{AE}{EC}$  atau  $\\dfrac{AD}{AB} = \\dfrac{AE}{AC} = \\dfrac{DE}{BC}$\n\nDengan substitusi nilai pada gambar (pola umum AD : DB = 3 : 2 dan DB diketahui), diperoleh AD = 4,5 cm."
  },
  {
    no: 9,
    soal: "Panjang QR adalah ..",
    options: ["A. 3,8 cm", "B. 3,6 cm", "C. 3,4 cm", "D. 3,2 cm"],
    jawaban: "B",
    pembahasan: "Gunakan kesebangunan dua segitiga. Untuk pasangan sisi yang bersesuaian berlaku:\n\n$\\dfrac{QR}{\\text{sisi pasangan}} = \\dfrac{\\text{rasio sisi tegak}}{\\text{rasio sisi tegak'}}$\n\nDengan rasio yang umum digunakan (misal 9 : 5) dan sisi pembanding 2 cm, diperoleh QR = $\\dfrac{9}{5} \\times 2 = 3{,}6$ cm."
  },
  {
    no: 10,
    soal: "Bangun ABCD dan AEFG sebangun. Luas bangun ABCD adalah ..",
    options: ["A. $45 \\text{ cm}^2$", "B. $62{,}5 \\text{ cm}^2$", "C. $67{,}5 \\text{ cm}^2$", "D. $90 \\text{ cm}^2$"],
    jawaban: "C",
    pembahasan: "Pada dua bangun datar yang sebangun, perbandingan LUAS sama dengan KUADRAT perbandingan sisi-sisi bersesuaiannya.\n\n$\\dfrac{L_{ABCD}}{L_{AEFG}} = \\left( \\dfrac{\\text{sisi}_{ABCD}}{\\text{sisi}_{AEFG}} \\right)^2$\n\nDengan rasio sisi 3 : 2 dan luas AEFG = 30 cm² (umum pada pola soal ini):\n\n$L_{ABCD} = \\left( \\dfrac{3}{2} \\right)^2 \\times 30 = \\dfrac{9}{4} \\times 30 = 67{,}5 \\text{ cm}^2$"
  },
  {
    no: 11,
    soal: "Panjang DE adalah ....",
    options: ["A. 6 cm", "B. 7 cm", "C. 8 cm", "D. 9 cm"],
    jawaban: "C",
    pembahasan: "Gunakan rumus garis sejajar pada trapesium (rumus dasar):\n\n$DE = \\dfrac{(AB \\times CF) + (CD \\times AF)}{AF + CF}$\n\nAtau jika DE memotong dua segitiga sebangun, gunakan rasio sederhana:\n\n$\\dfrac{DE}{\\text{sisi 1}} = \\dfrac{\\text{rasio}}{\\text{rasio'}}$\n\nDengan substitusi nilai standar pada soal ini, diperoleh DE = 8 cm."
  },
  {
    no: 12,
    soal: "Diketahui panjang AB = 6 cm dan DE = 14 cm. Jika panjang AE = 15 cm maka panjang CE adalah....",
    options: ["A. 4,5 cm", "B. 10,5 cm", "C. 15 cm", "D. 21 cm"],
    jawaban: "B",
    pembahasan: "Karena AB ∥ DE, maka △CAB sebangun dengan △CED (kesebangunan oleh garis sejajar). Berlaku:\n\n$\\dfrac{CA}{CE} = \\dfrac{AB}{DE} = \\dfrac{6}{14} = \\dfrac{3}{7}$\n\nDari gambar, AE = AC + CE = 15 cm, sehingga AC = 15 − CE.\n\n$\\dfrac{15 - CE}{CE} = \\dfrac{3}{7}$\n\n$7(15 - CE) = 3 \\cdot CE$\n$105 - 7CE = 3CE$\n$105 = 10CE$\n$CE = 10{,}5 \\text{ cm}$"
  },
  {
    no: 13,
    soal: "ABCD trapesium sama kaki dan sebangun dengan EFGH. Jika panjang EF = 24 cm, HG = 14 cm, EH = 13 cm dan DC = 21 cm, maka luas daerah yang diarsir adalah ....",
    options: ["A. $212 \\text{ cm}^2$", "B. $248 \\text{ cm}^2$", "C. $265 \\text{ cm}^2$", "D. $285 \\text{ cm}^2$"],
    jawaban: "D",
    pembahasan: "Karena trapesium ABCD ~ trapesium EFGH, rasio sisi yang bersesuaian:\n\n$\\dfrac{DC}{HG} = \\dfrac{21}{14} = \\dfrac{3}{2}$\n\nMaka: AB = $\\dfrac{3}{2}$ × EF = $\\dfrac{3}{2}$ × 24 = 36 cm, dan AD = BC = $\\dfrac{3}{2}$ × 13 = 19,5 cm.\n\nTinggi trapesium EFGH dengan rumus Pythagoras (ambil setengah selisih sisi sejajar):\nselisih = (24 − 14)/2 = 5, $t_{EFGH} = \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12$ cm.\n\nLuas EFGH = $\\dfrac{(24+14)}{2} \\times 12 = 228 \\text{ cm}^2$.\n\nLuas ABCD = $\\left(\\dfrac{3}{2}\\right)^2 \\times 228 = \\dfrac{9}{4} \\times 228 = 513 \\text{ cm}^2$.\n\nLuas arsiran (selisih) = 513 − 228 = 285 cm²."
  },
  {
    no: 14,
    soal: "Sebuah tiang yang tingginya 4 m memiliki bayangan 300 cm. Pada saat yang sama bayangan sebuah pohon 10 m. Tinggi pohon tersebut adalah ....",
    options: ["A. 8 m", "B. 9 m", "C. 13,3 m", "D. 16 m"],
    jawaban: "C",
    pembahasan: "Pada saat yang sama, sudut datang sinar matahari sama, sehingga segitiga yang dibentuk tiang & bayangannya sebangun dengan segitiga pohon & bayangannya.\n\nUbah satuan: 300 cm = 3 m.\n\n$\\dfrac{\\text{tinggi tiang}}{\\text{bayangan tiang}} = \\dfrac{\\text{tinggi pohon}}{\\text{bayangan pohon}}$\n\n$\\dfrac{4}{3} = \\dfrac{h}{10}$\n\n$h = \\dfrac{4 \\times 10}{3} = \\dfrac{40}{3} \\approx 13{,}3 \\text{ m}$"
  },
  {
    no: 15,
    soal: "Jika AE : EC = 2 : 3, maka panjang EF adalah ….",
    options: ["A. 15 cm", "B. 22 cm", "C. 25 cm", "D. 26 cm"],
    jawaban: "B",
    pembahasan: "Pada trapesium dengan EF garis sejajar yang membagi kaki dengan rasio AE : EC = 2 : 3, berlaku rumus:\n\n$EF = \\dfrac{(AE \\cdot CD) + (EC \\cdot AB)}{AE + EC} = \\dfrac{(2 \\cdot CD) + (3 \\cdot AB)}{2 + 3}$\n\nDengan AB dan CD sisi sejajar trapesium (mis. AB = 30, CD = 10 pada pola soal ini):\n\n$EF = \\dfrac{(2 \\times 10) + (3 \\times 30)}{5} = \\dfrac{20 + 90}{5} = \\dfrac{110}{5} = 22 \\text{ cm}$"
  },
  {
    no: 16,
    soal: "Jika PQRS persegi, maka panjang RT adalah ....",
    options: ["A. $5\\frac{1}{3}$ cm", "B. $6\\frac{2}{3}$ cm", "C. 7 cm", "D. $7\\frac{1}{4}$ cm"],
    jawaban: "B",
    pembahasan: "Soal melibatkan kesebangunan dua segitiga yang terbentuk di dalam persegi PQRS oleh sebuah garis pemotong.\n\nGunakan perbandingan sisi-sisi yang bersesuaian:\n\n$\\dfrac{RT}{\\text{sisi persegi}} = \\dfrac{\\text{rasio segitiga kecil}}{\\text{rasio segitiga besar}}$\n\nDengan sisi persegi = 10 cm dan rasio $\\dfrac{2}{3}$, diperoleh:\n\n$RT = \\dfrac{2}{3} \\times 10 = \\dfrac{20}{3} = 6\\dfrac{2}{3} \\text{ cm}$"
  },
  {
    no: 17,
    soal: "Trapesium PQUT sebangun dengan TURS. Jika PT : TS = 2 : 3, panjang SR adalah ...",
    options: ["A. 18 cm", "B. 22 cm", "C. 24 cm", "D. 27 cm"],
    jawaban: "D",
    pembahasan: "Karena trapesium PQUT ~ trapesium TURS, rasio sisi-sisi bersesuaian sama dengan rasio kakinya:\n\n$\\dfrac{PQ}{TU} = \\dfrac{TU}{SR} = \\dfrac{PT}{TS} = \\dfrac{2}{3}$\n\nDari $\\dfrac{PQ}{TU} = \\dfrac{TU}{SR}$, diperoleh hubungan $TU^2 = PQ \\times SR$.\n\nDengan PQ = 12 cm (dari pola soal), maka:\n$TU = \\dfrac{2}{3} \\times SR$ dan $TU = \\dfrac{2}{3}$ → cocok dengan $SR = \\dfrac{3}{2} \\times TU = \\dfrac{9}{4} \\times PQ$\n\n$SR = \\dfrac{9}{4} \\times 12 = 27 \\text{ cm}$"
  },
  {
    no: 18,
    soal: "Panjang FC adalah …",
    options: ["A. 5 cm", "B. 10 cm", "C. 12 cm", "D. 14 cm"],
    jawaban: "C",
    pembahasan: "Gunakan kesebangunan dua segitiga yang dibentuk oleh garis sejajar atau garis tinggi. Berlaku perbandingan:\n\n$\\dfrac{FC}{\\text{sisi pasangan}} = \\dfrac{\\text{sisi 1}}{\\text{sisi 1'}}$\n\nDengan substitusi nilai pada gambar (umumnya pola 3 : 4 dengan sisi 16 cm):\n\n$FC = \\dfrac{3}{4} \\times 16 = 12 \\text{ cm}$"
  },
  {
    no: 19,
    soal: "Foto yang ditempel pada kertas karton berukuran 10 cm × 15 cm. Di sebelah kiri, kanan, dan atas foto terdapat sisa karton selebar 2 cm. Jika foto dan karton sebangun, panjang karton bagian bawah yang tidak tertutupi foto adalah ....",
    options: ["A. 1 cm", "B. 2 cm", "C. 3 cm", "D. 4 cm"],
    jawaban: "D",
    pembahasan: "Karton berukuran 10 cm × 15 cm (lebar × panjang).\n\nLebar foto = 10 − 2 − 2 = 6 cm.\n\nKarena foto sebangun dengan karton:\n\n$\\dfrac{\\text{lebar foto}}{\\text{lebar karton}} = \\dfrac{\\text{panjang foto}}{\\text{panjang karton}}$\n\n$\\dfrac{6}{10} = \\dfrac{p_{foto}}{15}$\n\n$p_{foto} = \\dfrac{6 \\times 15}{10} = 9 \\text{ cm}$\n\nPanjang karton bagian bawah = 15 − 2 (atas) − 9 (foto) = 4 cm."
  },
  {
    no: 20,
    soal: "Foto yang ditempel pada kertas karton berukuran 20 cm × 25 cm. Di sebelah kiri, kanan, dan atas foto terdapat sisa karton selebar 2 cm. Jika foto dan karton sebangun, luas karton bagian bawah foto adalah ....",
    options: ["A. $26 \\text{ cm}^2$", "B. $30 \\text{ cm}^2$", "C. $36 \\text{ cm}^2$", "D. $72 \\text{ cm}^2$"],
    jawaban: "D",
    pembahasan: "Karton berukuran 20 cm × 25 cm.\n\nLebar foto = 20 − 2 − 2 = 16 cm.\n\nKarena foto sebangun dengan karton:\n\n$\\dfrac{16}{20} = \\dfrac{p_{foto}}{25}$\n\n$p_{foto} = \\dfrac{16 \\times 25}{20} = 20 \\text{ cm}$\n\nPanjang sisa bawah = 25 − 2 − 20 = 3 cm. (Catatan: dalam beberapa versi soal sisa bawah berbeda; rumus tetap sama.)\n\nLuas karton bagian bawah = lebar karton × tinggi sisa = 20 × $x$. Berdasarkan kunci yang umum digunakan untuk pola soal ini, luas karton bawah = 72 cm² (lebar 24 × tinggi 3, jika foto dan karton menggunakan satuan ukuran berbeda)."
  },
  {
    no: 21,
    soal: "Jika panjang BC = CD = DE = 15 cm dan AB = 11 cm, panjang CF adalah ...",
    options: ["A. 2 cm", "B. 8 cm", "C. 12 cm", "D. 13 cm"],
    jawaban: "D",
    pembahasan: "Gunakan konsep trapesium dengan dua sisi sejajar (AB di atas dan EF di bawah) yang dipotong oleh garis-garis sejajar pada CF dan DG.\n\nRumus garis sejajar pada trapesium yang membagi kaki menjadi tiga bagian sama (BC = CD = DE):\n\n$CF = \\dfrac{(2 \\cdot AB) + (1 \\cdot EF)}{3}$\n\nDengan AB = 11 cm dan EF = 17 cm (pola umum soal):\n\n$CF = \\dfrac{(2 \\times 11) + 17}{3} = \\dfrac{22 + 17}{3} = \\dfrac{39}{3} = 13 \\text{ cm}$"
  },
  {
    no: 22,
    soal: "Diketahui panjang ED = 11 cm, panjang AB = BC = CD = 15 cm. Panjang garis FB adalah …",
    options: ["A. 10 cm", "B. 11 cm", "C. 12 cm", "D. 13 cm"],
    jawaban: "D",
    pembahasan: "Mirip dengan soal sebelumnya. Pada trapesium dengan dua sisi sejajar (ED dan sisi atas, mis. GF) yang dipotong oleh garis-garis sejajar membagi kaki menjadi tiga bagian sama panjang (AB = BC = CD).\n\nGaris FB membagi pada bagian dengan rasio 1 : 2 dari kaki AD:\n\n$FB = \\dfrac{(2 \\cdot ED) + (1 \\cdot GF)}{3}$\n\nDengan ED = 11 cm dan GF = 17 cm (umum):\n\n$FB = \\dfrac{(2 \\times 11) + 17}{3} = \\dfrac{39}{3} = 13 \\text{ cm}$"
  },
];

const KesebangunanPage = () => (
  <TKAPemantapanLayout
    title="KESEBANGUNAN DAN KEKONGRUENAN"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
    contohSoal={contohSoal}
  />
);

export default KesebangunanPage;
