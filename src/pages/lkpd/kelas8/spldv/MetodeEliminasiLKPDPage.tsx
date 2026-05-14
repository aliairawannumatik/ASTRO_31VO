import InteractiveLKPD, {
  GuidedItem,
  PracticeItem,
  SituationCard,
  SummaryCard,
} from "@/components/InteractiveLKPD";
import { LKPDGame } from "@/components/LKPDGameZone";

const situations: SituationCard[] = [
  {
    title: "Apa itu Metode Eliminasi?",
    visual: (
      <div className="space-y-3">
        <div className="rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/20 border border-cyan-300/40 p-4">
          <p className="text-xs font-bold text-cyan-200 mb-2 text-center">SISTEM PERSAMAAN</p>
          <div className="text-center font-mono text-white text-sm space-y-1">
            <p className="text-yellow-200 font-bold">2x + y = 8</p>
            <p className="text-pink-300 font-bold"> x − y = 10</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-xs text-white/60">dijumlahkan (y hilang!)</span>
          <div className="h-px flex-1 bg-white/20" />
        </div>
        <div className="rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border border-emerald-300/40 p-3 text-center">
          <p className="font-mono text-white text-sm font-bold">3x = 18 → <span className="text-emerald-300">x = 6</span></p>
          <p className="text-xs text-white/60 mt-1">Variabel y TERELIMINASI (hilang)</p>
        </div>
      </div>
    ),
    text:
      "Metode ELIMINASI berarti MENGHILANGKAN salah satu variabel dari sistem persamaan. Caranya: samakan koefisien variabel yang ingin dihilangkan, lalu jumlahkan atau kurangkan kedua persamaan. Variabel itu akan lenyap, dan kita tinggal menyelesaikan persamaan satu variabel yang tersisa!",
  },
  {
    title: "Kapan Koefisien Sudah Sama?",
    visual: (
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gradient-to-br from-emerald-500/30 to-green-500/20 border border-emerald-300/40 p-3 text-center">
          <p className="text-xs font-bold text-emerald-300 mb-2">✅ Koefisien y SAMA</p>
          <p className="font-mono text-xs text-white">2x <span className="text-yellow-200 font-bold">+ y</span> = 8</p>
          <p className="font-mono text-xs text-white"> x <span className="text-yellow-200 font-bold">− y</span> = 10</p>
          <p className="text-xs text-emerald-300 mt-2">Koef y: 1 dan −1</p>
          <p className="text-xs text-white/70">→ Langsung jumlahkan!</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/20 border border-amber-300/40 p-3 text-center">
          <p className="text-xs font-bold text-amber-300 mb-2">⚠️ Koefisien x BEDA</p>
          <p className="font-mono text-xs text-white"><span className="text-rose-300 font-bold">2x</span> + y = 8</p>
          <p className="font-mono text-xs text-white"><span className="text-rose-300 font-bold"> x</span> − y = 10</p>
          <p className="text-xs text-amber-300 mt-2">Koef x: 2 dan 1</p>
          <p className="text-xs text-white/70">→ Perlu dikalikan dulu!</p>
        </div>
      </div>
    ),
    text:
      "Agar variabel bisa DIHILANGKAN, koefisiennya di kedua persamaan harus SAMA BESAR (boleh berbeda tanda). Jika sudah sama dan berlawanan tanda → JUMLAHKAN. Jika sudah sama dan tanda sama → KURANGKAN. Jika belum sama → kalikan salah satu/kedua persamaan dengan bilangan yang tepat terlebih dahulu, lalu eliminasi!",
  },
];

const guidedItems: GuidedItem[] = [
  {
    id: "g1",
    label:
      "Ciri-ciri Persamaan Linear Dua Variabel (PLDV): memiliki … variabel.",
    kind: "choice",
    options: ["satu", "dua", "tiga", "empat"],
    correctIndex: 1,
    discussion: [
      "PLDV = Persamaan Linear DUA Variabel.",
      "Contoh: 2x + y = 8 memiliki dua variabel, yaitu x dan y.",
      "Pangkat masing-masing variabelnya adalah 1 (linear).",
    ],
  },
  {
    id: "g2",
    label:
      "Pada SPLDV 2x + y = 8 dan x − y = 10, SPLDV terdiri dari berapa persamaan?",
    kind: "choice",
    options: ["Satu persamaan", "Dua persamaan", "Tiga persamaan", "Tidak tentu"],
    correctIndex: 1,
    discussion: [
      "S pada SPLDV = 'Sistem', artinya kumpulan DUA atau lebih PLDV.",
      "Penyelesaian SPLDV harus memenuhi KEDUA persamaan sekaligus.",
      "Dalam kasus ini: 2x + y = 8 (persamaan 1) dan x − y = 10 (persamaan 2).",
    ],
  },
  {
    id: "g3",
    label:
      "KASUS 1 — Unsur yang DIKETAHUI dari soal: Tentukan penyelesaian dari 2x + y = 8 dan x − y = 10. Yang diketahui adalah …",
    kind: "choice",
    options: [
      "Nilai x dan y",
      "Sistem persamaan 2x + y = 8 dan x − y = 10",
      "Hanya nilai koefisien",
      "Jumlah kedua persamaan",
    ],
    correctIndex: 1,
    discussion: [
      "Langkah pertama: MEMAHAMI MASALAH.",
      "Unsur yang diketahui adalah sistem persamaannya: 2x + y = 8 dan x − y = 10.",
      "Unsur yang ditanyakan adalah nilai x dan y yang memenuhi kedua persamaan tersebut.",
    ],
  },
  {
    id: "g4",
    label:
      "Pada 2x + y = 8 dan x − y = 10, koefisien variabel y pada persamaan 1 adalah … dan pada persamaan 2 adalah …",
    kind: "choice",
    options: [
      "1 dan 1",
      "1 dan −1",
      "2 dan 1",
      "−1 dan 1",
    ],
    correctIndex: 1,
    discussion: [
      "Persamaan 1: 2x + y = 8. Koefisien y = +1.",
      "Persamaan 2: x − y = 10. Koefisien y = −1.",
      "Koefisien y besarnya SAMA (1) tetapi BERLAWANAN tanda (+1 dan −1).",
      "Karena berlawanan tanda → kedua persamaan DIJUMLAHKAN agar y hilang.",
    ],
  },
  {
    id: "g5",
    label:
      "Jika 2x + y = 8 DIJUMLAHKAN dengan x − y = 10 ruas per ruas, maka hasilnya …",
    kind: "choice",
    options: [
      "3x + 2y = 18",
      "x = 18",
      "3x = 18",
      "2x = 18",
    ],
    correctIndex: 2,
    discussion: [
      "Ruas kiri: (2x + y) + (x − y) = 2x + x + y − y = 3x + 0 = 3x.",
      "Ruas kanan: 8 + 10 = 18.",
      "Hasilnya: 3x = 18 → y TERELIMINASI (hilang)!",
    ],
  },
  {
    id: "g6",
    label:
      "Dari 3x = 18, nilai x = …",
    kind: "fill",
    answers: ["6"],
    discussion: [
      "3x = 18 → x = 18 ÷ 3 = 6.",
      "Sekarang kita sudah tahu x = 6. Selanjutnya kita cari nilai y.",
    ],
  },
  {
    id: "g7",
    label:
      "Untuk mencari nilai y, variabel x harus DIELIMINASI. Koefisien x di persamaan 1 adalah 2 dan di persamaan 2 adalah 1. KPK dari 2 dan 1 adalah …",
    kind: "fill",
    answers: ["2"],
    discussion: [
      "KPK dari 2 dan 1 adalah 2.",
      "Agar koefisien x di kedua persamaan menjadi 2, persamaan 2 harus dikalikan 2.",
      "Persamaan 1 × 1: 2x + y = 8.",
      "Persamaan 2 × 2: 2x − 2y = 20.",
    ],
  },
  {
    id: "g8",
    label:
      "Setelah persamaan 2 dikalikan 2 menjadi 2x − 2y = 20, lalu DIKURANGKAN dari persamaan 1 (2x + y = 8), maka: (2x + y) − (2x − 2y) = 8 − 20, hasilnya …",
    kind: "choice",
    options: [
      "3y = −12",
      "−y = −12",
      "3y = 12",
      "y = −12",
    ],
    correctIndex: 0,
    discussion: [
      "Ruas kiri: (2x + y) − (2x − 2y) = 2x − 2x + y + 2y = 0 + 3y = 3y.",
      "Ruas kanan: 8 − 20 = −12.",
      "Hasilnya: 3y = −12.",
      "Perhatikan: −(−2y) = +2y (karena kita kurangkan persamaan 2 dari persamaan 1).",
    ],
  },
  {
    id: "g9",
    label:
      "Dari 3y = −12, maka nilai y = …",
    kind: "fill",
    answers: ["-4", "−4"],
    discussion: [
      "3y = −12 → y = −12 ÷ 3 = −4.",
      "Jadi nilai x = 6 dan y = −4.",
    ],
  },
  {
    id: "g10",
    label:
      "Langkah terakhir: MEMERIKSA hasil kembali. Substitusikan x = 6 dan y = −4 ke persamaan 1 (2x + y = 8). Hasilnya …",
    kind: "choice",
    options: [
      "2(6) + (−4) = 12 − 4 = 8 ✔ BENAR",
      "2(6) + (−4) = 12 + 4 = 16 ✘",
      "2(6) + (−4) = 8 + 4 = 12 ✘",
      "2(6) + (−4) = 6 + 4 = 10 ✘",
    ],
    correctIndex: 0,
    discussion: [
      "2(6) + (−4) = 12 − 4 = 8. ✔ Sama dengan ruas kanan.",
      "Cek persamaan 2: (6) − (−4) = 6 + 4 = 10. ✔ Sama dengan ruas kanan.",
      "Kedua persamaan terpenuhi → solusinya adalah x = 6 dan y = −4.",
    ],
  },
  {
    id: "g11",
    label:
      "Urutan langkah METODE ELIMINASI yang benar adalah …",
    kind: "sort",
    items: [
      "Samakan koefisien variabel yang ingin dihilangkan",
      "Jumlahkan atau kurangkan kedua persamaan",
      "Selesaikan persamaan satu variabel yang tersisa",
      "Ulangi untuk variabel satunya, lalu periksa jawaban",
    ],
    correctOrder: [
      "Samakan koefisien variabel yang ingin dihilangkan",
      "Jumlahkan atau kurangkan kedua persamaan",
      "Selesaikan persamaan satu variabel yang tersisa",
      "Ulangi untuk variabel satunya, lalu periksa jawaban",
    ],
    discussion: [
      "Langkah 1: Samakan koefisien variabel yang hendak dihilangkan (kalikan bila perlu).",
      "Langkah 2: Jika koefisien berlawanan tanda → JUMLAHKAN. Jika tanda sama → KURANGKAN.",
      "Langkah 3: Selesaikan persamaan satu variabel hasil eliminasi.",
      "Langkah 4: Eliminasi variabel satunya untuk mendapat nilai variabel kedua, lalu cek.",
    ],
  },
  {
    id: "g12",
    label:
      "Pasangkan setiap situasi koefisien dengan operasi yang digunakan untuk mengeliminasi.",
    kind: "match",
    pairs: [
      { left: "Koefisien sama, tanda berlawanan (+1 dan −1)", right: "JUMLAHKAN kedua persamaan" },
      { left: "Koefisien sama, tanda sama (1 dan 1)", right: "KURANGKAN kedua persamaan" },
      { left: "Koefisien berbeda (2 dan 1)", right: "Kalikan dulu, baru eliminasi" },
    ],
    discussion: [
      "+y dan −y: dijumlahkan → +y + (−y) = 0, variabel y hilang.",
      "+y dan +y: dikurangkan → y − y = 0, variabel y hilang.",
      "Jika koefisien berbeda, kalikan persamaan agar koefisiennya sama (pakai KPK).",
    ],
  },
];

const summaryCards: SummaryCard[] = [
  {
    title: "🎯 Ide Dasar Eliminasi",
    text: "Hilangkan salah satu variabel dengan menyamakan koefisiennya di kedua persamaan, lalu jumlahkan (tanda berlawanan) atau kurangkan (tanda sama). Variabel yang koefisiennya sama akan bernilai nol (lenyap).",
    tone: "cyan",
  },
  {
    title: "🔢 Langkah-langkah",
    text: "1) Pilih variabel yang dihilangkan. 2) Samakan koefisiennya (kalikan bila perlu). 3) Jumlahkan/kurangkan → dapat nilai satu variabel. 4) Ulangi untuk variabel kedua. 5) Periksa hasil dengan substitusi ke kedua persamaan.",
    tone: "emerald",
  },
  {
    title: "💡 Tips Cepat",
    text: "Pilih variabel yang koefisiennya SUDAH SAMA di kedua persamaan agar tidak perlu mengalikan. Jika koefisien berbeda, cari KPK keduanya untuk menentukan pengali yang tepat.",
    tone: "violet",
  },
];

const games: LKPDGame[] = [
  {
    kind: "drag-match",
    id: "game-operasi",
    title: "🎯 Game 1 — Jumlahkan atau Kurangkan?",
    description:
      "Tentukan operasi yang tepat untuk mengeliminasi variabel y dari setiap pasang persamaan. Tarik ke bucket yang sesuai!",
    buckets: [
      { id: "jumlah", label: "JUMLAHKAN (tanda berlawanan)", emoji: "➕", color: "cyan" },
      { id: "kurang", label: "KURANGKAN (tanda sama)", emoji: "➖", color: "violet" },
      { id: "kalikan", label: "Kalikan dulu baru eliminasi", emoji: "✖️", color: "amber" },
    ],
    items: [
      { id: "o1", label: "2x + y = 8 dan x − y = 10", bucketId: "jumlah", emoji: "📘" },
      { id: "o2", label: "x + y = 5 dan 3x + y = 9", bucketId: "kurang", emoji: "📗" },
      { id: "o3", label: "x + y = 7 dan x − y = 3", bucketId: "jumlah", emoji: "📙" },
      { id: "o4", label: "2x + y = 9 dan 2x + y = 5", bucketId: "kurang", emoji: "📕" },
      { id: "o5", label: "3x + 2y = 12 dan x + y = 5", bucketId: "kalikan", emoji: "📓" },
      { id: "o6", label: "4x + 3y = 20 dan 2x + y = 8", bucketId: "kalikan", emoji: "📔" },
    ],
  },
  {
    kind: "arrow-match",
    id: "game-solusi",
    title: "🎯 Game 2 — Temukan Solusi dengan Eliminasi",
    description:
      "Selesaikan setiap SPLDV menggunakan metode eliminasi, lalu jodohkan dengan solusinya yang benar.",
    rightOptions: ["(6, −4)", "(5, 3)", "(3, 2)", "(4, 1)", "(2, 1)"],
    pairs: [
      { id: "s1", left: "2x + y = 8 dan x − y = 10", correctRight: "(6, −4)", emoji: "🧩" },
      { id: "s2", left: "x + y = 8 dan x − y = 2", correctRight: "(5, 3)", emoji: "🧩" },
      { id: "s3", left: "x + y = 5 dan x − y = 1", correctRight: "(3, 2)", emoji: "🧩" },
      { id: "s4", left: "x + y = 5 dan 2x + y = 9", correctRight: "(4, 1)", emoji: "🧩" },
      { id: "s5", left: "x + y = 3 dan x − y = 1", correctRight: "(2, 1)", emoji: "🧩" },
    ],
  },
];

const practiceItems: PracticeItem[] = [
  {
    id: "p1",
    question:
      "Selesaikan dengan METODE ELIMINASI: x + y = 7 dan x − y = 3. Nilai x = …",
    kind: "fill",
    answers: ["5"],
    hint: "Jumlahkan kedua persamaan untuk menghilangkan y (tanda berlawanan).",
    discussion: [
      "(x + y) + (x − y) = 7 + 3 → 2x = 10 → x = 5.",
      "Lanjut: substitusi x = 5 ke x + y = 7 → y = 2.",
      "Solusinya (5, 2).",
    ],
  },
  {
    id: "p2",
    question:
      "Lanjutan soal sebelumnya: x + y = 7 dan x − y = 3. Nilai y = …",
    kind: "fill",
    answers: ["2"],
    hint: "Setelah tahu x = 5, kurangkan kedua persamaan untuk mengeliminasi x.",
    discussion: [
      "(x + y) − (x − y) = 7 − 3 → 2y = 4 → y = 2.",
      "Cek: 5 + 2 = 7 ✔ dan 5 − 2 = 3 ✔. Solusinya (5, 2).",
    ],
  },
  {
    id: "p3",
    question:
      "Selesaikan: 3x + y = 11 dan x + y = 5. Variabel y dapat dihilangkan dengan cara …",
    kind: "choice",
    options: [
      "Menjumlahkan kedua persamaan",
      "Mengurangkan persamaan 2 dari persamaan 1",
      "Mengalikan persamaan 1 dengan 2",
      "Membagi persamaan 2 dengan 3",
    ],
    correctIndex: 1,
    hint: "Koefisien y di kedua persamaan sama-sama 1, tanda sama → operasinya?",
    discussion: [
      "Koefisien y: +1 dan +1 (tanda SAMA).",
      "Tanda sama → KURANGKAN: (3x + y) − (x + y) = 11 − 5 → 2x = 6 → x = 3.",
      "Lanjut: substitusi x = 3 ke x + y = 5 → y = 2. Solusinya (3, 2).",
    ],
  },
  {
    id: "p4",
    question:
      "Selesaikan: 2x + y = 9 dan x − 2y = 0. Untuk mengeliminasi y, persamaan 1 perlu dikalikan … agar koefisien y sama dengan persamaan 2.",
    kind: "fill",
    answers: ["2"],
    hint: "Koefisien y di persamaan 1 adalah 1 dan di persamaan 2 adalah 2 (KPK = 2).",
    discussion: [
      "Persamaan 1: 2x + y = 9. Koefisien y = 1.",
      "Persamaan 2: x − 2y = 0. Koefisien y = 2.",
      "KPK(1, 2) = 2 → persamaan 1 × 2: 4x + 2y = 18.",
      "Jumlahkan (tanda berlawanan +2y dan −2y): 4x + 2y + x − 2y = 18 + 0 → 5x = 18 → x = 18/5.",
      "Hmm, coba eliminasi x: persamaan 1 × 1 dan persamaan 2 × 2: x − 2y = 0 × 2 = 2x − 4y = 0.",
      "Kurangkan dari 2 × persamaan 1 (4x + 2y = 18) → masih fraksional. Lebih mudah pakai campuran.",
    ],
  },
  {
    id: "p5",
    question:
      "Pernyataan: 'Pada metode eliminasi, variabel yang dihilangkan boleh dipilih bebas (variabel x atau y), hasil akhirnya tetap sama.' Apakah benar?",
    kind: "truefalse",
    correct: true,
    hint: "Coba eliminasi x dulu, lalu eliminasi y — apakah solusinya berbeda?",
    discussion: [
      "BENAR. Kita bebas memilih variabel mana yang dihilangkan lebih dulu.",
      "Hasilnya (nilai x dan y) akan selalu sama, karena kita menyelesaikan sistem yang sama.",
      "Namun, memilih variabel yang koefisiennya sudah sama akan lebih EFISIEN.",
    ],
  },
  {
    id: "p6",
    question:
      "Pasangkan setiap sistem dengan nilai x yang diperoleh dari metode eliminasi.",
    kind: "match",
    pairs: [
      { left: "x + y = 5 dan x − y = 1", right: "x = 3" },
      { left: "2x + y = 8 dan x − y = 10", right: "x = 6" },
      { left: "x + y = 8 dan x − y = 2", right: "x = 5" },
      { left: "3x + y = 11 dan x + y = 5", right: "x = 3" },
    ],
    hint: "Gunakan eliminasi: jumlahkan atau kurangkan kedua persamaan untuk menghilangkan y.",
    discussion: [
      "Sistem 1: (x+y)+(x−y)=5+1 → 2x=6 → x=3.",
      "Sistem 2: (2x+y)+(x−y)=8+10 → 3x=18 → x=6.",
      "Sistem 3: (x+y)+(x−y)=8+2 → 2x=10 → x=5.",
      "Sistem 4: (3x+y)−(x+y)=11−5 → 2x=6 → x=3.",
    ],
  },
  {
    id: "p7",
    question:
      "Harga 2 buku dan 1 penggaris = Rp 9.000. Harga 1 buku dan 1 penggaris = Rp 6.000. Misal x = harga buku dan y = harga penggaris. Gunakan eliminasi untuk menemukan harga 1 buku (x) = Rp …",
    kind: "fill",
    answers: ["3000", "3.000", "Rp3000", "Rp 3000"],
    suffix: "rupiah",
    hint: "Model: 2x + y = 9000 dan x + y = 6000. Kurangkan persamaan 2 dari persamaan 1.",
    discussion: [
      "Persamaan 1: 2x + y = 9.000.",
      "Persamaan 2: x + y = 6.000.",
      "Koefisien y sama (+1 dan +1), tanda sama → KURANGKAN.",
      "(2x + y) − (x + y) = 9.000 − 6.000 → x = 3.000.",
      "Substitusi x = 3.000 ke persamaan 2: 3.000 + y = 6.000 → y = 3.000.",
      "Jadi harga 1 buku = Rp 3.000 dan 1 penggaris = Rp 3.000.",
    ],
  },
  {
    id: "p8",
    question:
      "Diketahui 3x + 2y = 16 dan x + 2y = 8. Nilai y = …",
    kind: "fill",
    answers: ["2.5", "2,5", "5/2"],
    hint: "Koefisien y sama (2 dan 2), tanda sama → kurangkan. Setelah dapat x, substitusi untuk y.",
    discussion: [
      "Koefisien y = 2 di keduanya, tanda sama → KURANGKAN.",
      "(3x + 2y) − (x + 2y) = 16 − 8 → 2x = 8 → x = 4.",
      "Substitusi x = 4 ke x + 2y = 8 → 4 + 2y = 8 → 2y = 4 → y = 2.",
      "Cek: 3(4) + 2(2) = 12 + 4 = 16 ✔ dan 4 + 2(2) = 8 ✔.",
      "Jadi x = 4 dan y = 2.",
    ],
  },
];

const MetodeEliminasiLKPDPage = () => (
  <InteractiveLKPD
    badgeText="LKPD · Kelas 8 · SPLDV"
    title="Penyelesaian SPLDV dengan Metode Eliminasi"
    intro="Sobat Numatik, pada LKPD ini kamu akan mempelajari cara menyelesaikan Sistem Persamaan Linear Dua Variabel (SPLDV) menggunakan Metode ELIMINASI — yaitu dengan menghilangkan salah satu variabel agar persamaan menjadi lebih sederhana. Ikuti setiap langkahnya dan kerjakan soal dengan teliti!"
    situations={situations}
    guidedIntro="Kerjakan langkah demi langkah sesuai urutan. Setiap soal terbimbing akan membawamu memahami metode eliminasi secara mendalam berdasarkan KASUS 1: 2x + y = 8 dan x − y = 10."
    guidedItems={guidedItems}
    summaryCards={summaryCards}
    games={games}
    practiceIntro="Sekarang saatnya berlatih mandiri! Terapkan metode eliminasi pada soal-soal berikut. Ingat: samakan koefisien dulu, lalu jumlahkan atau kurangkan. Jangan lupa periksa jawabanmu!"
    practiceItems={practiceItems}
    prevPath="/lkpd/kelas-8/spldv"
    backLabel="Kembali ke menu SPLDV"
    scoreMessages={{
      perfect: "Luar biasa, Sobat Numatik! Kamu sudah mahir metode eliminasi!",
      high: "Bagus sekali! Periksa kembali langkah pengali koefisien agar lebih mantap.",
      medium: "Sudah mulai paham! Coba ulangi bagian penyamaan koefisien dan uji lagi.",
      low: "Semangat terus! Baca ulang situasi 1 & 2, lalu coba soal terbimbing dari awal.",
    }}
  />
);

export default MetodeEliminasiLKPDPage;
