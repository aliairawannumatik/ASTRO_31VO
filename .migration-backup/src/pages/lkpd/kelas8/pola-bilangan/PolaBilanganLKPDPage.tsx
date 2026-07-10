import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Perhatikan barisan: 2, 4, 6, 8, … . Suku berikutnya setelah 8 adalah …",
    kind: "fill",
    answers: ["10"],
    discussion: [
      "Setiap suku bertambah 2 (selisih tetap = 2).",
      "Suku setelah 8 = 8 + 2 = 10.",
    ],
  },
  {
    id: "g2",
    label:
      "Pola di soal nomor 1 disebut pola bilangan …",
    kind: "choice",
    options: ["Ganjil", "Genap", "Persegi", "Segitiga"],
    correctIndex: 1,
    discussion: [
      "Bilangan 2, 4, 6, 8, 10 semua habis dibagi 2.",
      "Disebut pola bilangan GENAP. Rumus suku ke-n: Uₙ = 2n.",
    ],
  },
  {
    id: "g3",
    label:
      "Suku ke-10 dari pola bilangan ganjil (1, 3, 5, 7, …) adalah … (gunakan Uₙ = 2n − 1).",
    kind: "fill",
    answers: ["19"],
    discussion: [
      "Uₙ = 2n − 1, dengan n = nomor suku.",
      "U₁₀ = 2(10) − 1 = 20 − 1 = 19.",
    ],
  },
  {
    id: "g4",
    label:
      "Pasangkan setiap pola bilangan dengan rumus suku ke-n yang tepat.",
    kind: "match",
    pairs: [
      { left: "Pola Genap", right: "Uₙ = 2n" },
      { left: "Pola Ganjil", right: "Uₙ = 2n − 1" },
      { left: "Pola Persegi", right: "Uₙ = n²" },
      { left: "Pola Persegi Panjang", right: "Uₙ = n(n + 1)" },
      { left: "Pola Segitiga", right: "Uₙ = n(n + 1)/2" },
    ],
    discussion: [
      "Pola Genap: 2, 4, 6, 8, … → Uₙ = 2n.",
      "Pola Ganjil: 1, 3, 5, 7, … → Uₙ = 2n − 1.",
      "Pola Persegi: 1, 4, 9, 16, … → Uₙ = n².",
      "Pola Persegi Panjang: 2, 6, 12, 20, … → Uₙ = n(n+1).",
      "Pola Segitiga: 1, 3, 6, 10, … → Uₙ = n(n+1)/2.",
    ],
  },
  {
    id: "g5",
    label:
      "Perhatikan barisan persegi: 1, 4, 9, 16, 25, … . Suku ke-7 adalah …",
    kind: "fill",
    answers: ["49"],
    discussion: [
      "Pola persegi: Uₙ = n².",
      "U₇ = 7² = 49.",
    ],
  },
  {
    id: "g6",
    label:
      "Barisan 1, 1, 2, 3, 5, 8, 13, … disebut barisan …",
    kind: "choice",
    options: ["Aritmetika", "Geometri", "Fibonacci", "Persegi"],
    correctIndex: 2,
    discussion: [
      "Setiap suku adalah jumlah dua suku sebelumnya: 1+1=2, 1+2=3, 2+3=5, ….",
      "Pola ini disebut barisan FIBONACCI.",
    ],
  },
  {
    id: "g7",
    label:
      "Suku berikutnya dari barisan Fibonacci 1, 1, 2, 3, 5, 8, 13, … adalah …",
    kind: "fill",
    answers: ["21"],
    discussion: [
      "Suku berikutnya = 8 + 13 = 21.",
    ],
  },
  {
    id: "g8",
    label:
      "Perhatikan barisan: 5, 8, 11, 14, 17, … . Selisih antar suku (beda b) adalah …",
    kind: "fill",
    answers: ["3"],
    discussion: [
      "b = U₂ − U₁ = 8 − 5 = 3.",
      "Beda yang tetap menandakan barisan ARITMETIKA.",
    ],
  },
  {
    id: "g9",
    label:
      "Rumus suku ke-n barisan aritmetika adalah Uₙ = a + (n − 1)b. Untuk barisan 5, 8, 11, 14, … (a = 5, b = 3), suku ke-20 adalah …",
    kind: "fill",
    answers: ["62"],
    discussion: [
      "U₂₀ = 5 + (20 − 1)(3) = 5 + 19 × 3 = 5 + 57 = 62.",
    ],
  },
  {
    id: "g10",
    label:
      "Perhatikan barisan: 3, 6, 12, 24, 48, … . Setiap suku dikalikan dengan bilangan tetap. Bilangan tetap (rasio r) tersebut adalah …",
    kind: "fill",
    answers: ["2"],
    discussion: [
      "r = U₂ ÷ U₁ = 6 ÷ 3 = 2.",
      "Karena rasio antar suku tetap, barisan ini adalah barisan GEOMETRI.",
    ],
  },
  {
    id: "g11",
    label:
      "Rumus suku ke-n barisan geometri adalah Uₙ = a · rⁿ⁻¹. Untuk barisan 3, 6, 12, 24, … (a = 3, r = 2), suku ke-6 adalah …",
    kind: "fill",
    answers: ["96"],
    discussion: [
      "U₆ = 3 × 2⁶⁻¹ = 3 × 2⁵ = 3 × 32 = 96.",
    ],
  },
  {
    id: "g12",
    label:
      "Benar atau salah: Barisan 2, 4, 8, 16, 32 adalah barisan aritmetika.",
    kind: "truefalse",
    correct: false,
    discussion: [
      "Selisihnya tidak tetap (2, 4, 8, 16), tetapi rasionya tetap (×2).",
      "Jadi ini barisan GEOMETRI, bukan aritmetika. Pernyataan SALAH.",
    ],
  },
  {
    id: "g13",
    label:
      "Urutkan langkah menentukan suku ke-n suatu barisan aritmetika.",
    kind: "sort",
    items: [
      "Substitusikan a, b, dan n ke dalam rumus.",
      "Tentukan suku pertama (a).",
      "Hitung selisih antar suku (b = U₂ − U₁).",
      "Tulis rumus Uₙ = a + (n − 1)b.",
    ],
    correctOrder: [
      "Tentukan suku pertama (a).",
      "Hitung selisih antar suku (b = U₂ − U₁).",
      "Tulis rumus Uₙ = a + (n − 1)b.",
      "Substitusikan a, b, dan n ke dalam rumus.",
    ],
    discussion: [
      "Pertama: kenali suku pertama a.",
      "Kedua: hitung beda b dari dua suku berurutan.",
      "Ketiga: tuliskan rumus umum Uₙ.",
      "Terakhir: substitusi nilai dan hitung.",
    ],
  },
  {
    id: "g14",
    label:
      "Diketahui barisan aritmetika dengan suku ke-3 = 11 dan suku ke-7 = 27. Nilai beda (b) adalah …",
    kind: "fill",
    answers: ["4"],
    discussion: [
      "U₇ − U₃ = (7 − 3) × b → 27 − 11 = 4b → 16 = 4b.",
      "Jadi b = 4.",
    ],
  },
  {
    id: "g15",
    label:
      "Dari soal nomor 14, suku pertama (a) adalah …",
    kind: "fill",
    answers: ["3"],
    discussion: [
      "U₃ = a + 2b → 11 = a + 2(4) → 11 = a + 8 → a = 3.",
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question:
      "Tentukan tiga suku berikutnya dari barisan: 7, 12, 17, 22, … . Tulis suku ke-7!",
    kind: "fill",
    answers: ["37"],
    hint: "Beda b = 5. Lanjutkan: 27, 32, 37.",
    discussion: [
      "b = 12 − 7 = 5.",
      "U₅ = 27, U₆ = 32, U₇ = 37.",
    ],
  },
  {
    id: "p2",
    question:
      "Suku ke-15 dari pola bilangan persegi (1, 4, 9, 16, …) adalah …",
    kind: "fill",
    answers: ["225"],
    hint: "Gunakan Uₙ = n².",
    discussion: [
      "U₁₅ = 15² = 225.",
    ],
  },
  {
    id: "p3",
    question:
      "Manakah barisan berikut yang merupakan barisan GEOMETRI?",
    kind: "choice",
    options: [
      "1, 4, 7, 10, 13",
      "2, 6, 18, 54, 162",
      "1, 3, 6, 10, 15",
      "5, 5, 5, 5, 5",
    ],
    correctIndex: 1,
    hint: "Barisan geometri memiliki rasio (perbandingan) yang tetap.",
    discussion: [
      "Pilihan A: aritmetika (b = 3).",
      "Pilihan B: rasio 6/2 = 3, 18/6 = 3, 54/18 = 3 → GEOMETRI dengan r = 3.",
      "Pilihan C: pola segitiga.",
      "Pilihan D: barisan konstan (bisa juga dianggap aritmetika dengan b = 0).",
    ],
  },
  {
    id: "p4",
    question:
      "Suku ke-8 barisan geometri 4, 8, 16, 32, … adalah …",
    kind: "fill",
    answers: ["512"],
    hint: "a = 4, r = 2. Gunakan Uₙ = a · rⁿ⁻¹.",
    discussion: [
      "U₈ = 4 × 2⁷ = 4 × 128 = 512.",
    ],
  },
  {
    id: "p5",
    question:
      "Barisan 1, 3, 6, 10, 15, 21, … merupakan pola bilangan …",
    kind: "choice",
    options: ["Ganjil", "Persegi", "Segitiga", "Persegi Panjang"],
    correctIndex: 2,
    hint: "Selisihnya berurutan: 2, 3, 4, 5, 6, … (selisih tidak tetap).",
    discussion: [
      "Selisih antar suku: 2, 3, 4, 5, 6 — naik 1 setiap langkah.",
      "Inilah pola SEGITIGA dengan rumus Uₙ = n(n+1)/2.",
    ],
  },
  {
    id: "p6",
    question:
      "Sebuah tumpukan kayu disusun: baris paling bawah 20 batang, di atasnya 18 batang, lalu 16, dan seterusnya. Berapa banyak kayu pada baris ke-7?",
    kind: "fill",
    answers: ["8"],
    hint: "a = 20, b = −2. Gunakan Uₙ = a + (n − 1)b.",
    discussion: [
      "U₇ = 20 + (7 − 1)(−2) = 20 + (−12) = 8 batang.",
    ],
  },
  {
    id: "p7",
    question:
      "Sebuah amoeba membelah diri menjadi 2 setiap 30 menit. Jika mula-mula ada 1 amoeba, berapa banyak amoeba setelah 3 jam (6 kali pembelahan)?",
    kind: "fill",
    answers: ["64"],
    hint: "Barisan geometri: 1, 2, 4, 8, … . Hitung suku ke-7 (atau gunakan 2⁶).",
    discussion: [
      "Setelah 1 jam: 2, lalu 4, 8, 16, 32, 64.",
      "Setelah 6 pembelahan: 2⁶ = 64 amoeba.",
    ],
  },
  {
    id: "p8",
    question:
      "Benar atau salah: Suku ke-50 dari pola bilangan ganjil adalah 99.",
    kind: "truefalse",
    correct: true,
    hint: "Gunakan Uₙ = 2n − 1.",
    discussion: [
      "U₅₀ = 2(50) − 1 = 100 − 1 = 99. Pernyataan BENAR.",
    ],
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-jenis-pola",
    title: "🎯 Game 1: Klasifikasi Jenis Pola",
    description:
      "Pindahkan setiap barisan ke kategori yang tepat: Aritmetika, Geometri, atau Fibonacci.",
    buckets: [
      { id: "b-arit", label: "Aritmetika", emoji: "➕", color: "cyan" },
      { id: "b-geo", label: "Geometri", emoji: "✖️", color: "violet" },
      { id: "b-fib", label: "Fibonacci", emoji: "🌀", color: "amber" },
    ],
    items: [
      { id: "j1", label: "3, 7, 11, 15, …", bucketId: "b-arit" },
      { id: "j2", label: "2, 6, 18, 54, …", bucketId: "b-geo" },
      { id: "j3", label: "1, 1, 2, 3, 5, 8, …", bucketId: "b-fib" },
      { id: "j4", label: "10, 7, 4, 1, …", bucketId: "b-arit" },
      { id: "j5", label: "5, 10, 20, 40, …", bucketId: "b-geo" },
      { id: "j6", label: "2, 2, 4, 6, 10, 16, …", bucketId: "b-fib" },
      { id: "j7", label: "100, 90, 80, 70, …", bucketId: "b-arit" },
      { id: "j8", label: "1, 3, 9, 27, 81, …", bucketId: "b-geo" },
    ],
  },
  {
    kind: "drag-match",
    id: "game-pola-khusus",
    title: "🧩 Game 2: Cocokkan Pola Khusus",
    description:
      "Letakkan setiap barisan ke nama pola khususnya.",
    buckets: [
      { id: "ganjil", label: "Pola Ganjil", emoji: "🔢", color: "rose" },
      { id: "genap", label: "Pola Genap", emoji: "🔢", color: "cyan" },
      { id: "persegi", label: "Pola Persegi", emoji: "⬛", color: "violet" },
      { id: "segitiga", label: "Pola Segitiga", emoji: "🔺", color: "emerald" },
    ],
    items: [
      { id: "k1", label: "1, 3, 5, 7, 9, …", bucketId: "ganjil" },
      { id: "k2", label: "2, 4, 6, 8, 10, …", bucketId: "genap" },
      { id: "k3", label: "1, 4, 9, 16, 25, …", bucketId: "persegi" },
      { id: "k4", label: "1, 3, 6, 10, 15, …", bucketId: "segitiga" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-rumus-suku-n",
    title: "🧮 Game 3: Tebak Rumus Uₙ",
    description:
      "Gunakan tombol ◀ ▶ untuk memilih rumus suku ke-n yang tepat untuk setiap pola.",
    rightOptions: [
      "Uₙ = 2n",
      "Uₙ = 2n − 1",
      "Uₙ = n²",
      "Uₙ = n(n+1)",
      "Uₙ = n(n+1)/2",
    ],
    pairs: [
      { id: "r1", left: "Pola Genap (2, 4, 6, …)", correctRight: "Uₙ = 2n", emoji: "🟢" },
      { id: "r2", left: "Pola Ganjil (1, 3, 5, …)", correctRight: "Uₙ = 2n − 1", emoji: "🟡" },
      { id: "r3", left: "Pola Persegi (1, 4, 9, …)", correctRight: "Uₙ = n²", emoji: "🟦" },
      { id: "r4", left: "Pola Persegi Panjang (2, 6, 12, …)", correctRight: "Uₙ = n(n+1)", emoji: "🟪" },
      { id: "r5", left: "Pola Segitiga (1, 3, 6, …)", correctRight: "Uₙ = n(n+1)/2", emoji: "🔺" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-hitung-suku",
    title: "⚡ Game 4: Hitung Cepat Suku ke-n",
    description:
      "Tebak nilai suku ke-n dari setiap barisan. Pilih jawaban yang tepat.",
    rightOptions: ["20", "29", "37", "49", "64", "100", "128", "243"],
    pairs: [
      { id: "h1", left: "Pola ganjil, U₁₅ = ?", correctRight: "29", emoji: "🎯" },
      { id: "h2", left: "Pola persegi, U₇ = ?", correctRight: "49", emoji: "🎲" },
      { id: "h3", left: "Aritmetika a=5, b=4, U₉ = ?", correctRight: "37", emoji: "🚀" },
      { id: "h4", left: "Geometri a=2, r=2, U₆ = ?", correctRight: "64", emoji: "💡" },
      { id: "h5", left: "Geometri a=1, r=3, U₆ = ?", correctRight: "243", emoji: "🌟" },
    ],
  },
  {
    kind: "page-link",
    id: "game-arena-pola",
    title: "🚀 Game 5: Arena Pola Bilangan Layar Penuh",
    description:
      "Buka mode permainan layar penuh untuk menantang dirimu menjawab soal pola bilangan secepat kilat!",
    path: "/math-game-arena/kelas-8/pola-bilangan",
    buttonLabel: "MAINKAN DI MATH GAME ARENA",
    emoji: "🎮",
  },
];

const situations: SituationCard[] = [
  {
    title: "Situasi 1: Susunan Lego Berundak 🧱",
    visual: (
      <div className="text-center space-y-2 font-body">
        <div className="space-y-1">
          <div className="text-2xl">🟦🟦🟦🟦🟦</div>
          <div className="text-2xl">🟦🟦🟦🟦</div>
          <div className="text-2xl">🟦🟦🟦</div>
          <div className="text-2xl">🟦🟦</div>
          <div className="text-2xl">🟦</div>
        </div>
        <p className="text-sm text-white/85">
          Banyak balok dari atas: 1, 2, 3, 4, 5 — selisihnya tetap{" "}
          <span className="font-bold text-cyan-300">+1</span>.
        </p>
        <p className="text-sm text-yellow-200 font-bold">
          Ini contoh barisan ARITMETIKA.
        </p>
      </div>
    ),
    text:
      "Pola adalah aturan tetap pada urutan bilangan. Bila selisih antar suku tetap, disebut barisan aritmetika.",
  },
  {
    title: "Situasi 2: Pertumbuhan Bakteri 🦠",
    visual: (
      <div className="text-center space-y-2 font-body">
        <div className="grid grid-cols-5 gap-1 text-xs">
          {[
            { jam: "0", n: 1 },
            { jam: "1", n: 2 },
            { jam: "2", n: 4 },
            { jam: "3", n: 8 },
            { jam: "4", n: 16 },
          ].map((d) => (
            <div
              key={d.jam}
              className="rounded-lg border border-violet-300/40 bg-violet-400/15 p-2"
            >
              <p className="font-bold text-violet-100">Jam {d.jam}</p>
              <p className="text-white text-base">{d.n} 🦠</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-white/85">
          Setiap jam, jumlah bakteri DIKALIKAN{" "}
          <span className="font-bold text-violet-200">2</span>.
        </p>
        <p className="text-sm text-yellow-200 font-bold">
          Ini contoh barisan GEOMETRI dengan r = 2.
        </p>
      </div>
    ),
    text:
      "Bila perbandingan (rasio) antar suku tetap, disebut barisan geometri. Rumus: Uₙ = a · rⁿ⁻¹.",
  },
  {
    title: "Situasi 3: Bunga Matahari & Fibonacci 🌻",
    visual: (
      <div className="text-center space-y-2 font-body">
        <div className="text-4xl">🌻</div>
        <div className="rounded-2xl border border-amber-300/40 bg-amber-400/15 p-3">
          <p className="text-amber-100 font-bold text-sm">
            Barisan Fibonacci
          </p>
          <p className="text-white text-base">1, 1, 2, 3, 5, 8, 13, 21, 34, …</p>
          <p className="text-white/80 text-xs mt-1">
            Setiap suku = jumlah dua suku sebelumnya.
          </p>
        </div>
        <p className="text-sm text-white/85">
          Banyak kelopak bunga matahari & susunan biji mengikuti pola
          Fibonacci di alam!
        </p>
      </div>
    ),
    text:
      "Pola bilangan banyak ditemukan di alam: deret Fibonacci, pola persegi, segitiga, dan banyak lagi.",
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "Pola Khusus & Rumusnya",
    text:
      "Genap Uₙ=2n, Ganjil Uₙ=2n−1, Persegi Uₙ=n², Persegi Panjang Uₙ=n(n+1), Segitiga Uₙ=n(n+1)/2.",
    tone: "cyan",
  },
  {
    title: "Barisan Aritmetika",
    text:
      "Selisih (beda) tetap: b = U₂ − U₁. Rumus suku ke-n: Uₙ = a + (n − 1)b.",
    tone: "yellow",
  },
  {
    title: "Barisan Geometri",
    text:
      "Rasio tetap: r = U₂ ÷ U₁. Rumus suku ke-n: Uₙ = a · rⁿ⁻¹.",
    tone: "violet",
  },
  {
    title: "Barisan Fibonacci",
    text:
      "Setiap suku adalah jumlah dua suku sebelumnya: Uₙ = Uₙ₋₁ + Uₙ₋₂. Contoh: 1, 1, 2, 3, 5, 8, 13, …",
    tone: "emerald",
  },
  {
    title: "Tips Cepat",
    text:
      "Selalu cek selisih dulu (jika tetap → aritmetika), lalu rasio (jika tetap → geometri), baru pola khusus seperti persegi/segitiga/Fibonacci.",
    tone: "rose",
  },
];

const PolaBilanganLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD Interaktif Pola Bilangan • Kelas 8"
    title="🔢 Pola Bilangan: Petualangan Menemukan Aturan"
    intro="Halo Sobat Numatik! Mari kita berpetualang menemukan aturan tersembunyi di balik barisan bilangan. Kamu akan mengenal pola khusus, barisan aritmetika, geometri, sampai Fibonacci — sambil bermain game seru yang bisa kamu gerakkan langsung!"
    situations={situations}
    guidedIntro="Lengkapi setiap langkah penemuan terbimbing berikut. Variasi soal: isian, pilihan, benar/salah, mencocokkan, dan menyusun urutan langkah."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    practiceIntro="Sekarang giliranmu menerapkan konsep pola bilangan pada beragam soal kontekstual!"
    practiceItems={practiceItems}
    games={games}
    prevPath="/lkpd/kelas-8"
    backLabel="Kembali ke menu LKPD Kelas 8"
    scoreMessages={{
      perfect:
        "Luar biasa! Konsep pola bilangan, rumus aritmetika, geometri, dan Fibonacci sudah kamu kuasai dengan sempurna! ✨",
      high: "Hebat! Pemahamanmu sudah kuat. Periksa kembali bagian yang masih merah agar makin mantap.",
      medium:
        "Kamu sudah mulai memahami. Baca lagi penemuan terbimbing dan rumusnya, lalu coba perbaiki jawaban yang belum tepat.",
      low: "Tetap semangat, Sobat Numatik! Pelan-pelan ikuti langkah dari pola khusus, aritmetika, sampai geometri. Kamu pasti bisa!",
    }}
  />
);

export default PolaBilanganLKPDPage;
