import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const GarisBilangan = () => {
  const Y = 82;
  const step = 45;
  const x0 = 270;
  const x = (n: number) => x0 + n * step;
  const nums = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

  return (
    <div className="my-3 overflow-x-auto">
      <svg
        viewBox="0 0 540 172"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full min-w-[320px] max-w-[540px] mx-auto block"
      >
        {/* ── Axis ── */}
        <line x1="22" y1={Y} x2="518" y2={Y} stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
        {/* Arrow left */}
        <polygon points={`17,${Y} 28,${Y - 5} 28,${Y + 5}`} fill="rgba(255,255,255,0.55)" />
        {/* Arrow right */}
        <polygon points={`523,${Y} 512,${Y - 5} 512,${Y + 5}`} fill="rgba(255,255,255,0.55)" />

        {/* ── Label: Bilangan bulat negatif ── */}
        <text x={(x(-5) + x(-1)) / 2} y="14" textAnchor="middle" fontSize="9.5" fill="#67e8f9" fontWeight="600">Bilangan bulat negatif</text>
        <line x1={x(-5)} y1="18" x2={x(-1)} y2="18" stroke="#67e8f9" strokeWidth="1" />
        <line x1={x(-5)} y1="14" x2={x(-5)} y2="22" stroke="#67e8f9" strokeWidth="1" />
        <line x1={x(-1)} y1="14" x2={x(-1)} y2="22" stroke="#67e8f9" strokeWidth="1" />
        <line x1={(x(-5) + x(-1)) / 2} y1="22" x2={(x(-5) + x(-1)) / 2} y2={Y - 7} stroke="#67e8f9" strokeWidth="0.8" strokeDasharray="3,2" opacity="0.35" />

        {/* ── Label: Nol ── */}
        <text x={x(0)} y="50" textAnchor="middle" fontSize="9.5" fill="rgba(255,255,255,0.5)">Nol</text>
        <line x1={x(0)} y1="53" x2={x(0)} y2={Y - 7} stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeDasharray="3,2" />

        {/* ── Label: Bilangan bulat positif ── */}
        <text x={(x(1) + x(5)) / 2} y="14" textAnchor="middle" fontSize="9.5" fill="#86efac" fontWeight="600">Bilangan bulat positif</text>
        <line x1={x(1)} y1="18" x2={x(5)} y2="18" stroke="#86efac" strokeWidth="1" />
        <line x1={x(1)} y1="14" x2={x(1)} y2="22" stroke="#86efac" strokeWidth="1" />
        <line x1={x(5)} y1="14" x2={x(5)} y2="22" stroke="#86efac" strokeWidth="1" />
        <line x1={(x(1) + x(5)) / 2} y1="22" x2={(x(1) + x(5)) / 2} y2={Y - 7} stroke="#86efac" strokeWidth="0.8" strokeDasharray="3,2" opacity="0.35" />

        {/* ── Tick marks & numbers ── */}
        {nums.map(n => (
          <g key={n}>
            <line x1={x(n)} y1={Y - 6} x2={x(n)} y2={Y + 6}
              stroke={n === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)"}
              strokeWidth={n === 0 ? 2 : 1.5} />
            <text x={x(n)} y={Y + 20} textAnchor="middle" fontSize="11"
              fill={n < 0 ? "#93c5fd" : n === 0 ? "rgba(255,255,255,0.85)" : "#86efac"}
              fontWeight={n === 0 ? "700" : "400"}>
              {n}
            </text>
          </g>
        ))}

        {/* ── Bilangan asli: 1 to 5 ── */}
        <line x1={x(1)} y1="118" x2={x(5)} y2="118" stroke="#fcd34d" strokeWidth="1" />
        <line x1={x(1)} y1="113" x2={x(1)} y2="123" stroke="#fcd34d" strokeWidth="1" />
        <line x1={x(5)} y1="113" x2={x(5)} y2="123" stroke="#fcd34d" strokeWidth="1" />
        <text x={(x(1) + x(5)) / 2} y="134" textAnchor="middle" fontSize="9" fill="#fcd34d">Bilangan asli</text>

        {/* ── Bilangan cacah: 0 to 5 ── */}
        <line x1={x(0)} y1="147" x2={x(5)} y2="147" stroke="#c4b5fd" strokeWidth="1" />
        <line x1={x(0)} y1="142" x2={x(0)} y2="152" stroke="#c4b5fd" strokeWidth="1" />
        <line x1={x(5)} y1="142" x2={x(5)} y2="152" stroke="#c4b5fd" strokeWidth="1" />
        <text x={(x(0) + x(5)) / 2} y="163" textAnchor="middle" fontSize="9" fill="#c4b5fd">Bilangan cacah</text>
      </svg>
    </div>
  );
};

const UrutanOperasi = () => {
  const steps = [
    {
      no: 1,
      symbol: "( )",
      title: "Tanda Kurung",
      desc: "Kerjakan yang di dalam kurung dulu",
      bg: "linear-gradient(135deg,rgba(202,138,4,0.25),rgba(161,98,7,0.12))",
      border: "rgba(234,179,8,0.4)",
      numBg: "rgba(234,179,8,0.3)",
      numColor: "#fde047",
      textColor: "#fef08a",
    },
    {
      no: 2,
      symbol: "xⁿ √",
      title: "Pangkat / Akar",
      desc: "Operasi pangkat atau akar",
      bg: "linear-gradient(135deg,rgba(3,105,161,0.25),rgba(2,132,199,0.12))",
      border: "rgba(56,189,248,0.4)",
      numBg: "rgba(14,165,233,0.3)",
      numColor: "#7dd3fc",
      textColor: "#bae6fd",
    },
    {
      no: 3,
      symbol: "× ÷",
      title: "Kali / Bagi",
      desc: "Kerjakan dari kiri ke kanan",
      bg: "linear-gradient(135deg,rgba(6,78,59,0.25),rgba(5,150,105,0.12))",
      border: "rgba(52,211,153,0.4)",
      numBg: "rgba(16,185,129,0.3)",
      numColor: "#6ee7b7",
      textColor: "#a7f3d0",
    },
    {
      no: 4,
      symbol: "+ −",
      title: "Tambah / Kurang",
      desc: "Kerjakan dari kiri ke kanan",
      bg: "linear-gradient(135deg,rgba(88,28,135,0.25),rgba(126,34,206,0.12))",
      border: "rgba(167,139,250,0.4)",
      numBg: "rgba(139,92,246,0.3)",
      numColor: "#c4b5fd",
      textColor: "#ddd6fe",
    },
  ] as const;

  return (
    <div className="my-1">
      <p className="text-center text-xs text-white/45 mb-3 italic font-body">
        Ingat singkatan: <span className="text-white/70 not-italic font-semibold">Ka – Pa – Ka – Ta</span>
      </p>
      <div className="flex flex-col gap-2">
        {steps.map(s => (
          <div
            key={s.no}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}
          >
            <div
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display"
              style={{ background: s.numBg, color: s.numColor }}
            >
              {s.no}
            </div>
            <div
              className="shrink-0 w-12 text-center font-display text-sm font-bold"
              style={{ color: s.numColor }}
            >
              {s.symbol}
            </div>
            <div className="flex-1">
              <p className="font-display text-sm font-bold" style={{ color: s.textColor }}>{s.title}</p>
              <p className="font-body text-xs text-white/55 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const materiSections: MateriSection[] = [
  {
    heading: "A. Ragam Jenis Bilangan",
    content: `Dalam matematika, bilangan dikelompokkan menjadi beberapa jenis berikut:\n- **Bilangan asli** — ditulis sebagai himpunan $\\{1, 2, 3, 4, 5, ...\\}$\n- **Bilangan cacah** — ditulis sebagai himpunan $\\{0, 1, 2, 3, 4, 5, ...\\}$\n- **Bilangan bulat** — mencakup semua bilangan bulat negatif, nol, dan positif: $\\{..., -4, -3, -2, -1, 0, 1, 2, 3, 4, ...\\}$\n- **Bilangan rasional** — setiap bilangan yang dapat dinyatakan dalam bentuk $\\frac{a}{b}$, di mana $a$ dan $b$ adalah bilangan bulat serta $b \\neq 0$\n- **Bilangan irasional** — bilangan yang tidak bisa dinyatakan dalam bentuk $\\frac{a}{b}$ dengan $b \\neq 0$ (contoh: $\\sqrt{2}$, $\\pi$)`
  },
  {
    heading: "B. Bilangan Bulat dan Garis Bilangan",
    content: `Bilangan bulat adalah gabungan dari bilangan bulat positif, nol, dan bilangan bulat negatif. Ketiga kelompok ini dapat digambarkan pada sebuah garis bilangan.\n\n- **Bilangan bulat positif** — nilainya lebih dari 0; terletak di sisi kanan angka 0 pada garis bilangan\n- **Bilangan bulat negatif** — nilainya kurang dari 0; terletak di sisi kiri angka 0 pada garis bilangan\n- **Nol (0)** — disebut bilangan netral karena bukan positif maupun negatif\n\n> Bilangan asli = bilangan bulat positif. Bilangan cacah = bilangan bulat positif + nol.`,
    jsx: <GarisBilangan />,
  },
  {
    heading: "C. Membandingkan Bilangan Bulat",
    content: `Membandingkan dua bilangan bulat berarti menentukan hubungan besarnya — apakah lebih besar, lebih kecil, atau sama besar.\n\nSimbol yang digunakan:\n- Lebih dari: $>$\n- Kurang dari: $<$\n- Sama dengan: $=$\n\nCara membandingkan menggunakan garis bilangan:\n- Posisi bilangan yang lebih jauh ke **kanan** menunjukkan nilai yang **lebih besar**\n- Posisi bilangan yang lebih jauh ke **kiri** menunjukkan nilai yang **lebih kecil**\n\n**Contoh:**\nBandingkan $-5$ dengan $1$.\n\n*Penyelesaian:*\nPada garis bilangan, $-5$ terletak di sebelah kiri $1$.\nKesimpulan: $-5 < 1$ (−5 kurang dari 1).`
  },
  {
    heading: "D. Sifat-Sifat Operasi Hitung Bilangan Bulat",
    content: `Misalkan $a$, $b$, dan $c$ adalah bilangan bulat sebarang. Operasi hitung pada bilangan bulat memiliki sifat-sifat berikut:\n\n**a. Tertutup** — hasil penjumlahan, pengurangan, maupun perkalian dua bilangan bulat selalu merupakan bilangan bulat.\n\n**b. Komutatif** — urutan operasi tidak mempengaruhi hasil:\n$a + b = b + a \\quad \\text{dan} \\quad a \\times b = b \\times a$\n\n**c. Unsur Identitas** — terdapat elemen yang tidak mengubah nilai bilangan:\n$a + 0 = 0 + a = a \\quad \\text{dan} \\quad a \\times 1 = 1 \\times a = a$\n\n**d. Asosiatif** — pengelompokan operasi tidak mempengaruhi hasil:\n$(a + b) + c = a + (b + c) \\quad \\text{dan} \\quad (a \\times b) \\times c = a \\times (b \\times c)$\n\n**e. Distributif** — perkalian terhadap penjumlahan dan pengurangan:\n$a \\times (b + c) = (a \\times b) + (a \\times c)$\n$a \\times (b - c) = (a \\times b) - (a \\times c)$`
  },
  {
    heading: "E. Urutan Operasi Hitung Campuran",
    content: `Ketika sebuah ekspresi memuat lebih dari satu jenis operasi, selesaikan selalu mengikuti urutan Ka–Pa–Ka–Ta berikut.`,
    jsx: <UrutanOperasi />,
  },
  {
    heading: "F. Strategi Menyelesaikan Soal Cerita",
    content: `Permasalahan kontekstual yang melibatkan bilangan bulat dapat diselesaikan secara sistematis melalui langkah-langkah berikut:\n\n1. **Cermati soal** — baca dengan teliti untuk memahami apa yang diketahui dan apa yang ditanyakan\n2. **Susun model matematika** — ubah informasi dari soal ke dalam kalimat atau persamaan matematika\n3. **Selesaikan perhitungan** — kerjakan model matematika yang telah dibuat\n4. **Tuliskan jawaban** — nyatakan hasil sesuai dengan pertanyaan di soal`
  },
  {
    heading: "G. Faktorisasi Prima",
    content: `Faktorisasi prima adalah proses menguraikan suatu bilangan menjadi perkalian dari faktor-faktor prima penyusunnya.\n\n**Contoh:**\nTentukan faktorisasi prima dari 12.\n\n*Penyelesaian:*\nFaktor-faktor dari 12 adalah 1, 2, 3, 4, 6, dan 12.\nDi antara faktor-faktor tersebut, yang merupakan bilangan prima adalah 2 dan 3.\n\nDengan pohon faktor:\n$12 = 2 \\times 6 = 2 \\times 2 \\times 3 = 2^2 \\times 3$\n\nJadi, faktorisasi prima dari $12$ adalah $2^2 \\times 3$.`
  },
  {
    heading: "H. Estimasi Hasil Perhitungan",
    content: `Estimasi adalah cara memperkirakan hasil operasi hitung bilangan bulat secara cepat dan masuk akal, tanpa harus menghitung secara tepat satu per satu.\n\nEstimasi berguna untuk:\n- Mengecek kewajaran jawaban sebelum menghitung rinci\n- Mempercepat pengerjaan soal pada kondisi waktu terbatas\n\n**Teknik umum estimasi:**\n- **Pembulatan** — bulatkan setiap bilangan ke puluhan atau ratusan terdekat sebelum dihitung\n- **Estimasi batas atas/bawah** — tentukan nilai terkecil dan terbesar yang mungkin untuk memperkirakan kisaran jawaban\n\n**Contoh:**\nEstimasi dari $49 \\times 21$:\n- Bulatkan: $50 \\times 20 = 1.000$\n- Nilai sesungguhnya: $49 \\times 21 = 1.029$ (perkiraan cukup dekat ✓)`
  },
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
