import { useState, useRef, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";

/* ══════════════════════════════════════════════════════════
   SHARED LINE TYPES  (same as OperasiCampuran page)
══════════════════════════════════════════════════════════ */

type BoxAnswers = string[];

type EqLine = {
  kind?: "eq";
  text: string;
  boxes: BoxAnswers[];
  hint?: string;
  isHeader?: boolean;
};

type ChoiceLine = {
  kind: "choice";
  label: string;
  choices: { key: string; text: string }[];
  correct: string;
  hint?: string;
};

type Line = EqLine | ChoiceLine;

/* ══════════════════════════════════════════════════════════
   POLYA STEP & KASUS TYPES
══════════════════════════════════════════════════════════ */

type PolyaStep = {
  icon: string;
  title: string;
  description: string;
  lines: Line[];
};

type Kasus = {
  n: number;
  emoji: string;
  title: string;
  concept: "KPK" | "FPB";
  context: string;
  color: string;
  border: string;
  badge: string;
  answer: string;
  polyaSteps: PolyaStep[];
};

/* ══════════════════════════════════════════════════════════
   KASUS DATA  (4 kasus dari LKPD)
══════════════════════════════════════════════════════════ */

const kasusList: Kasus[] = [
  /* ────────────────────────────────────────────────────────
     KASUS 1 — Terminal Bus  (KPK)
  ──────────────────────────────────────────────────────── */
  {
    n: 1, emoji: "🚌", title: "Terminal Bus Tiga Jurusan", concept: "KPK",
    context: "Sebuah terminal bus melayani tiga jurusan. Bus jurusan pertama berangkat setiap 45 menit, jurusan kedua setiap 60 menit, dan jurusan ketiga setiap 75 menit. Jika pada pukul 06.00 ada tiga bus yang berangkat bersamaan, pukul berapakah bus-bus berikutnya akan berangkat secara bersamaan?",
    color: "from-sky-900/60 to-blue-900/60", border: "border-sky-500/40", badge: "bg-sky-500/20 text-sky-300",
    answer: "Pukul 21.00",
    polyaSteps: [
      {
        icon: "🔍", title: "Memahami Masalah",
        description: "Identifikasi informasi yang diketahui dan apa yang ditanyakan.",
        lines: [
          { text: "Diketahui:", boxes: [], isHeader: true },
          { text: "Bus jurusan 1 berangkat setiap %% menit", boxes: [["45"]], hint: "Lihat soal: 45 menit" },
          { text: "Bus jurusan 2 berangkat setiap %% menit", boxes: [["60"]], hint: "Lihat soal: 60 menit" },
          { text: "Bus jurusan 3 berangkat setiap %% menit", boxes: [["75"]], hint: "Lihat soal: 75 menit" },
          { text: "Ketiga bus berangkat bersama pukul %%", boxes: [["06.00","6.00"]], hint: "Waktu awal: pukul 06.00" },
          { text: "Ditanyakan:", boxes: [], isHeader: true },
          { text: "Pukul berapa bus berikutnya berangkat secara %% ?", boxes: [["bersamaan"]], hint: "Kata kunci di akhir soal" },
        ],
      },
      {
        icon: "🎯", title: "Merencanakan Strategi",
        description: "Tentukan konsep dan langkah yang akan digunakan.",
        lines: [
          { text: "Kata kunci 'berangkat secara bersamaan' → gunakan konsep %%", boxes: [["KPK"]], hint: "KPK untuk kejadian berulang yang terjadi bersama" },
          { text: "Langkah: Cari KPK dari %%, %%, dan %%", boxes: [["45"], ["60"], ["75"]], hint: "Tiga bilangan dari soal" },
          { text: "Kemudian tambahkan hasilnya ke pukul %%", boxes: [["06.00","6.00"]], hint: "Waktu awal keberangkatan" },
        ],
      },
      {
        icon: "⚙️", title: "Menjalankan Rencana",
        description: "Lakukan perhitungan untuk mencari KPK dan waktu keberangkatan.",
        lines: [
          { text: "Faktorisasi prima:", boxes: [], isHeader: true },
          { text: "45 = 3² × %%", boxes: [["5"]], hint: "45 = 9 × 5 = 3² × 5" },
          { text: "60 = 2² × %% × 5", boxes: [["3"]], hint: "60 = 4 × 15 = 2² × 3 × 5" },
          { text: "75 = %% × 5²", boxes: [["3"]], hint: "75 = 3 × 25 = 3 × 5²" },
          { text: "Ambil semua faktor prima dengan pangkat TERBESAR:", boxes: [], isHeader: true },
          { text: "KPK = 2² × 3² × 5² = 4 × 9 × 25 = %%", boxes: [["900"]], hint: "4 × 9 = 36, 36 × 25 = 900" },
          { text: "%% menit = %% jam", boxes: [["900"], ["15"]], hint: "900 ÷ 60 = 15 jam" },
          { text: "Pukul 06.00 + %% jam = pukul %%", boxes: [["15"], ["21.00","21.00 WIB"]], hint: "06 + 15 = 21 → pukul 21.00" },
        ],
      },
      {
        icon: "✅", title: "Memeriksa Kembali",
        description: "Pastikan 900 adalah kelipatan persekutuan dari ketiga bilangan.",
        lines: [
          { text: "900 ÷ 45 = %%  → habis dibagi ✓", boxes: [["20"]], hint: "900 ÷ 45 = 20" },
          { text: "900 ÷ 60 = %%  → habis dibagi ✓", boxes: [["15"]], hint: "900 ÷ 60 = 15" },
          { text: "900 ÷ 75 = %%  → habis dibagi ✓", boxes: [["12"]], hint: "900 ÷ 75 = 12" },
          { text: "Kesimpulan: Bus berikutnya berangkat bersama pada pukul %%", boxes: [["21.00","21.00 WIB"]], hint: "Jawaban akhir: pukul 21.00" },
        ],
      },
    ],
  },

  /* ────────────────────────────────────────────────────────
     KASUS 2 — Aldi, Shifa, Dinda Perpustakaan  (KPK)
  ──────────────────────────────────────────────────────── */
  {
    n: 2, emoji: "📚", title: "Aldi, Shifa & Dinda ke Perpustakaan", concept: "KPK",
    context: "Aldi mengunjungi sebuah perpustakaan setiap 6 hari sekali. Shifa dan Dinda mengunjungi perpustakaan tersebut masing-masing setiap 10 hari dan 12 hari sekali. Jika pada tanggal 28 Agustus mereka mengunjungi perpustakaan bersama-sama, pada tanggal berapa mereka akan mengunjungi perpustakaan tersebut bersama-sama lagi?",
    color: "from-violet-900/60 to-purple-900/60", border: "border-violet-500/40", badge: "bg-violet-500/20 text-violet-300",
    answer: "27 Oktober",
    polyaSteps: [
      {
        icon: "🔍", title: "Memahami Masalah",
        description: "Identifikasi informasi yang diketahui dan apa yang ditanyakan.",
        lines: [
          { text: "Diketahui:", boxes: [], isHeader: true },
          { text: "Aldi mengunjungi perpustakaan setiap %% hari", boxes: [["6"]], hint: "Lihat soal: 6 hari" },
          { text: "Shifa mengunjungi perpustakaan setiap %% hari", boxes: [["10"]], hint: "Lihat soal: 10 hari" },
          { text: "Dinda mengunjungi perpustakaan setiap %% hari", boxes: [["12"]], hint: "Lihat soal: 12 hari" },
          { text: "Terakhir bertemu bersama: tanggal %% %%", boxes: [["28"], ["Agustus"]], hint: "Tanggal dan bulan dari soal" },
          { text: "Ditanyakan:", boxes: [], isHeader: true },
          { text: "Tanggal berapa mereka bertemu bersama-sama %%?", boxes: [["lagi"]], hint: "Kata 'lagi' ada di soal" },
        ],
      },
      {
        icon: "🎯", title: "Merencanakan Strategi",
        description: "Tentukan konsep dan langkah yang akan digunakan.",
        lines: [
          { text: "Kata kunci 'bersama-sama lagi' dan 'setiap ... sekali' → gunakan konsep %%", boxes: [["KPK"]], hint: "Kejadian berulang yang terjadi bersama = KPK" },
          { text: "Langkah 1: Cari KPK dari %%, %%, dan %%", boxes: [["6"], ["10"], ["12"]], hint: "Tiga bilangan dari soal" },
          { text: "Langkah 2: Tambahkan hasil KPK ke tanggal %% %%", boxes: [["28"], ["Agustus"]], hint: "Tanggal awal kunjungan bersama" },
        ],
      },
      {
        icon: "⚙️", title: "Menjalankan Rencana",
        description: "Lakukan faktorisasi prima, cari KPK, lalu hitung tanggal.",
        lines: [
          { text: "Faktorisasi prima:", boxes: [], isHeader: true },
          { text: "6  = 2 × %%", boxes: [["3"]], hint: "6 = 2 × 3" },
          { text: "10 = 2 × %%", boxes: [["5"]], hint: "10 = 2 × 5" },
          { text: "12 = 2² × %%", boxes: [["3"]], hint: "12 = 4 × 3 = 2² × 3" },
          { text: "KPK = 2² × 3 × 5 = %%", boxes: [["60"]], hint: "4 × 3 × 5 = 60" },
          { text: "28 Agustus + %% hari:", boxes: [["60"]], hint: "Tambahkan KPK = 60 hari" },
          { text: "Sisa hari Agustus = 31 − 28 = %% hari", boxes: [["3"]], hint: "Agustus punya 31 hari, sudah sampai tgl 28" },
          { text: "Sisa yang dihitung = 60 − 3 = %% hari", boxes: [["57"]], hint: "60 − 3 = 57 hari lagi setelah Agustus habis" },
          { text: "Bulan September = %% hari → sisa = 57 − 30 = %% hari", boxes: [["30"], ["27"]], hint: "September punya 30 hari" },
          { text: "Jadi mereka bertemu lagi tanggal %% Oktober", boxes: [["27"]], hint: "Sisa 27 hari masuk Oktober → 27 Oktober" },
        ],
      },
      {
        icon: "✅", title: "Memeriksa Kembali",
        description: "Pastikan 60 adalah KPK terkecil dan tanggal sudah benar.",
        lines: [
          { text: "60 ÷ 6 = %%  → habis dibagi ✓", boxes: [["10"]], hint: "60 ÷ 6 = 10" },
          { text: "60 ÷ 10 = %%  → habis dibagi ✓", boxes: [["6"]], hint: "60 ÷ 10 = 6" },
          { text: "60 ÷ 12 = %%  → habis dibagi ✓", boxes: [["5"]], hint: "60 ÷ 12 = 5" },
          { text: "28 Agustus + 3 (sisa Agustus) + 30 (September) + 27 = %% hari ✓", boxes: [["60"]], hint: "3 + 30 + 27 = 60 hari ✓" },
          { text: "Kesimpulan: Mereka akan bertemu bersama lagi tanggal %% %%", boxes: [["27"], ["Oktober"]], hint: "Jawaban akhir: 27 Oktober" },
        ],
      },
    ],
  },

  /* ────────────────────────────────────────────────────────
     KASUS 3 — Tim Voli  (KPK)
  ──────────────────────────────────────────────────────── */
  {
    n: 3, emoji: "🏐", title: "Jadwal Latihan Tim Bola Voli", concept: "KPK",
    context: "Jadwal latihan tim bola voli Rajawali Bandung di lapangan yang sama adalah 4 hari sekali, tim Bandung Tectona 5 hari sekali, dan tim BJB Tanda Mata 6 hari sekali. Jika tanggal 10 Desember ketiga tim tersebut mengadakan latihan bersama, kapan mereka akan latihan bersama lagi berikutnya?",
    color: "from-emerald-900/60 to-green-900/60", border: "border-emerald-500/40", badge: "bg-emerald-500/20 text-emerald-300",
    answer: "8 Februari",
    polyaSteps: [
      {
        icon: "🔍", title: "Memahami Masalah",
        description: "Identifikasi informasi yang diketahui dan apa yang ditanyakan.",
        lines: [
          { text: "Diketahui:", boxes: [], isHeader: true },
          { text: "Tim Rajawali Bandung latihan setiap %% hari", boxes: [["4"]], hint: "Lihat soal: 4 hari sekali" },
          { text: "Tim Bandung Tectona latihan setiap %% hari", boxes: [["5"]], hint: "Lihat soal: 5 hari sekali" },
          { text: "Tim BJB Tanda Mata latihan setiap %% hari", boxes: [["6"]], hint: "Lihat soal: 6 hari sekali" },
          { text: "Terakhir latihan bersama: %% Desember", boxes: [["10"]], hint: "Tanggal dari soal: 10 Desember" },
          { text: "Ditanyakan:", boxes: [], isHeader: true },
          { text: "Kapan mereka akan latihan bersama lagi %%?", boxes: [["berikutnya"]], hint: "Kata kunci di akhir soal" },
        ],
      },
      {
        icon: "🎯", title: "Merencanakan Strategi",
        description: "Tentukan konsep dan langkah yang akan digunakan.",
        lines: [
          { text: "Kata kunci 'latihan bersama lagi' → gunakan konsep %%", boxes: [["KPK"]], hint: "Kejadian berulang yang terjadi bersama = KPK" },
          { text: "Langkah 1: Cari KPK dari %%, %%, dan %%", boxes: [["4"], ["5"], ["6"]], hint: "Tiga bilangan interval latihan" },
          { text: "Langkah 2: Tambahkan hasil KPK ke tanggal %% Desember", boxes: [["10"]], hint: "Tanggal awal latihan bersama" },
        ],
      },
      {
        icon: "⚙️", title: "Menjalankan Rencana",
        description: "Lakukan faktorisasi prima, cari KPK, lalu hitung tanggal.",
        lines: [
          { text: "Faktorisasi prima:", boxes: [], isHeader: true },
          { text: "4 = %%", boxes: [["2²","2^2"]], hint: "4 = 2 × 2 = 2²" },
          { text: "5 = %%", boxes: [["5"]], hint: "5 adalah bilangan prima" },
          { text: "6 = 2 × %%", boxes: [["3"]], hint: "6 = 2 × 3" },
          { text: "KPK = 2² × 3 × 5 = %%", boxes: [["60"]], hint: "4 × 3 × 5 = 60" },
          { text: "10 Desember + %% hari:", boxes: [["60"]], hint: "Tambahkan KPK = 60 hari" },
          { text: "Sisa hari Desember = 31 − 10 = %% hari", boxes: [["21"]], hint: "Desember punya 31 hari, sudah sampai tgl 10" },
          { text: "Sisa yang dihitung = 60 − 21 = %% hari", boxes: [["39"]], hint: "60 − 21 = 39 hari lagi setelah Desember habis" },
          { text: "Bulan Januari = %% hari → sisa = 39 − 31 = %% hari", boxes: [["31"], ["8"]], hint: "Januari punya 31 hari" },
          { text: "Jadi mereka latihan bersama lagi tanggal %% Februari", boxes: [["8"]], hint: "Sisa 8 hari masuk Februari → 8 Februari" },
        ],
      },
      {
        icon: "✅", title: "Memeriksa Kembali",
        description: "Pastikan 60 adalah KPK terkecil dan tanggal sudah benar.",
        lines: [
          { text: "60 ÷ 4 = %%  → habis dibagi ✓", boxes: [["15"]], hint: "60 ÷ 4 = 15" },
          { text: "60 ÷ 5 = %%  → habis dibagi ✓", boxes: [["12"]], hint: "60 ÷ 5 = 12" },
          { text: "60 ÷ 6 = %%  → habis dibagi ✓", boxes: [["10"]], hint: "60 ÷ 6 = 10" },
          { text: "10 Des + 21 (sisa Des) + 31 (Jan) + 8 = %% hari ✓", boxes: [["60"]], hint: "21 + 31 + 8 = 60 hari ✓" },
          { text: "Kesimpulan: Ketiga tim latihan bersama lagi tanggal %% %%", boxes: [["8"], ["Februari"]], hint: "Jawaban akhir: 8 Februari" },
        ],
      },
    ],
  },

  /* ────────────────────────────────────────────────────────
     KASUS 4 — Bu Sinta Parsel  (FPB)
  ──────────────────────────────────────────────────────── */
  {
    n: 4, emoji: "🎁", title: "Bu Sinta Membuat Parsel", concept: "FPB",
    context: "Bu Sinta ingin membuat parsel berisi sirop, mi instan, dan beras. Ia memiliki 24 botol sirop, 90 bungkus mi instan, dan 42 kg beras. Jika setiap parsel harus memiliki jenis dan jumlah isi yang sama, dan Bu Sinta ingin membuat parsel sebanyak-banyaknya, berapa banyak parsel yang bisa dibuat? Dan berapa banyak masing-masing isi di setiap parsel?",
    color: "from-rose-900/60 to-pink-900/60", border: "border-rose-500/40", badge: "bg-rose-500/20 text-rose-300",
    answer: "6 parsel (4 sirop, 15 mi, 7 kg beras)",
    polyaSteps: [
      {
        icon: "🔍", title: "Memahami Masalah",
        description: "Identifikasi informasi yang diketahui dan apa yang ditanyakan.",
        lines: [
          { text: "Diketahui:", boxes: [], isHeader: true },
          { text: "Jumlah sirop  = %% botol", boxes: [["24"]], hint: "Lihat soal: 24 botol sirop" },
          { text: "Jumlah mi instan = %% bungkus", boxes: [["90"]], hint: "Lihat soal: 90 bungkus mi" },
          { text: "Jumlah beras  = %% kg", boxes: [["42"]], hint: "Lihat soal: 42 kg beras" },
          { text: "Setiap parsel isinya harus %% dan dibuat sebanyak-%%", boxes: [["sama"], ["banyaknya"]], hint: "Syarat parsel dari soal" },
          { text: "Ditanyakan:", boxes: [], isHeader: true },
          { text: "Berapa banyak parsel yang bisa dibuat? Berapa isi tiap parsel?", boxes: [], isHeader: true },
        ],
      },
      {
        icon: "🎯", title: "Merencanakan Strategi",
        description: "Tentukan konsep dan langkah yang akan digunakan.",
        lines: [
          { text: "Kata kunci 'dibagi sama rata' & 'sebanyak-banyaknya' → gunakan konsep %%", boxes: [["FPB"]], hint: "FPB untuk membagi barang ke kelompok sama banyak" },
          { text: "Langkah 1: Cari FPB dari %%, %%, dan %%", boxes: [["24"], ["90"], ["42"]], hint: "Tiga bilangan jumlah barang" },
          { text: "Langkah 2: Hasil FPB = banyak %% yang bisa dibuat", boxes: [["parsel"]], hint: "FPB = banyaknya parsel maksimal" },
          { text: "Langkah 3: Bagi masing-masing barang dengan jumlah parsel untuk tiap %%", boxes: [["parsel"]], hint: "Isi tiap parsel = total barang ÷ jumlah parsel" },
        ],
      },
      {
        icon: "⚙️", title: "Menjalankan Rencana",
        description: "Lakukan faktorisasi prima, cari FPB, lalu hitung isi tiap parsel.",
        lines: [
          { text: "Faktorisasi prima:", boxes: [], isHeader: true },
          { text: "24 = 2³ × %%", boxes: [["3"]], hint: "24 = 8 × 3 = 2³ × 3" },
          { text: "90 = 2 × 3² × %%", boxes: [["5"]], hint: "90 = 2 × 9 × 5 = 2 × 3² × 5" },
          { text: "42 = 2 × 3 × %%", boxes: [["7"]], hint: "42 = 2 × 3 × 7" },
          { text: "Ambil faktor prima yang SAMA dengan pangkat TERKECIL:", boxes: [], isHeader: true },
          { text: "FPB = %% × %% = %%", boxes: [["2"], ["3"], ["6"]], hint: "Faktor sama: 2¹ dan 3¹ → 2 × 3 = 6" },
          { text: "Banyak parsel = %%", boxes: [["6"]], hint: "FPB = 6 parsel" },
          { text: "Sirop per parsel  = 24 ÷ 6 = %% botol", boxes: [["4"]], hint: "24 ÷ 6 = 4" },
          { text: "Mi per parsel = 90 ÷ 6 = %% bungkus", boxes: [["15"]], hint: "90 ÷ 6 = 15" },
          { text: "Beras per parsel = 42 ÷ 6 = %% kg", boxes: [["7"]], hint: "42 ÷ 6 = 7" },
        ],
      },
      {
        icon: "✅", title: "Memeriksa Kembali",
        description: "Verifikasi dengan mengalikan kembali isi parsel dengan jumlah parsel.",
        lines: [
          { text: "6 parsel × %% botol sirop = %% botol ✓", boxes: [["4"], ["24"]], hint: "6 × 4 = 24 ✓" },
          { text: "6 parsel × %% bungkus mi = %% bungkus ✓", boxes: [["15"], ["90"]], hint: "6 × 15 = 90 ✓" },
          { text: "6 parsel × %% kg beras = %% kg ✓", boxes: [["7"], ["42"]], hint: "6 × 7 = 42 ✓" },
          { text: "Kesimpulan: Bu Sinta dapat membuat %% parsel", boxes: [["6"]], hint: "Jawaban: 6 parsel" },
          { text: "Isi tiap parsel: %% sirop, %% mi, %% kg beras", boxes: [["4"], ["15"], ["7"]], hint: "4 sirop, 15 mi, 7 kg beras" },
        ],
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════
   STATE TYPES
══════════════════════════════════════════════════════════ */

type BoxState  = { value: string; status: "idle"|"correct"|"wrong" };
type LineState = { boxStates: BoxState[]; choiceSelected?: string; status: "idle"|"correct"|"wrong" };
type StepState = { lineStates: LineState[]; expanded: boolean };

function initLineState(line: Line): LineState {
  if (line.kind === "choice") return { boxStates: [], status: "idle" };
  const eq = line as EqLine;
  if (eq.isHeader || eq.boxes.length === 0) return { boxStates: [], status: "correct" };
  return { boxStates: eq.boxes.map(() => ({ value: "", status: "idle" as const })), status: "idle" };
}

/* ══════════════════════════════════════════════════════════
   INLINE BOX
══════════════════════════════════════════════════════════ */

function InlineBox({ value, status, onChange, onEnter, disabled }: {
  value: string; status: "idle"|"correct"|"wrong";
  onChange: (v: string) => void;
  onEnter: () => void;
  disabled: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const width = Math.max(44, value.length * 10 + 28);
  return (
    <input ref={ref} type="text"
      disabled={disabled || status === "correct"}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") onEnter(); }}
      style={{ width }}
      className={`
        inline-block mx-1 px-2 py-0.5 rounded-lg border text-center font-mono text-sm align-baseline
        outline-none transition-all duration-200
        ${status === "correct" ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-200 cursor-default"
        : status === "wrong"   ? "bg-rose-500/15 border-rose-400/60 text-rose-200"
        : disabled             ? "bg-white/5 border-white/10 text-white/25 cursor-not-allowed"
        : "bg-white/10 border-white/30 text-white focus:border-yellow-400/70 focus:bg-white/15"}
      `}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   EQ LINE ROW
══════════════════════════════════════════════════════════ */

function EqLineRow({ line, lineState, onBoxChange, onCheck, locked }: {
  line: EqLine; lineState: LineState;
  onBoxChange: (bi: number, v: string) => void;
  onCheck: () => void;
  locked: boolean;
}) {
  const isDone   = lineState.status === "correct";
  const isWrong  = lineState.status === "wrong";
  const noBoxes  = line.isHeader || line.boxes.length === 0;
  const allFilled = lineState.boxStates.every(b => b.value.trim() !== "");
  const parts    = line.text.split("%%");

  return (
    <div className={`transition-all duration-300 ${locked ? "opacity-25 select-none pointer-events-none" : ""}`}>
      <div className={`flex items-center flex-wrap gap-y-1 rounded-xl px-3 py-2 border font-mono text-sm leading-relaxed transition-all
        ${noBoxes  ? "border-white/8 bg-white/3 text-white/60 italic"
        : isDone   ? "border-emerald-500/30 bg-emerald-500/8 text-white"
        : isWrong  ? "border-rose-500/30 bg-rose-500/8 text-white"
        :            "border-white/10 bg-white/5 text-white"}`}>
        {noBoxes ? (
          <span className="text-yellow-300/80 font-bold text-xs tracking-wide uppercase">{line.text}</span>
        ) : (
          <>
            {parts.map((part, pi) => (
              <span key={pi} className="inline-flex items-center flex-wrap">
                <span>{part}</span>
                {pi < parts.length - 1 && (
                  <InlineBox
                    value={lineState.boxStates[pi]?.value ?? ""}
                    status={lineState.boxStates[pi]?.status ?? "idle"}
                    onChange={v => onBoxChange(pi, v)}
                    onEnter={() => { if (allFilled) onCheck(); }}
                    disabled={locked || isDone}
                  />
                )}
              </span>
            ))}
            {!isDone && (
              <button disabled={!allFilled} onClick={() => { playPopSound(); onCheck(); }}
                className="ml-2 inline-flex items-center gap-1 px-3 py-0.5 rounded-lg border text-xs font-bold transition-all cursor-pointer
                  bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white
                  disabled:opacity-30 disabled:cursor-not-allowed">
                Cek ✓
              </button>
            )}
            {isDone  && <span className="ml-2 text-emerald-400 text-xs font-bold">✅</span>}
            {isWrong && <span className="ml-2 text-rose-400 text-xs">✗ {line.hint && <span className="text-white/45 ml-1">💡 {line.hint}</span>}</span>}
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CHOICE LINE ROW
══════════════════════════════════════════════════════════ */

function ChoiceLineRow({ line, lineState, onSelect, onCheck, locked }: {
  line: ChoiceLine; lineState: LineState;
  onSelect: (key: string) => void;
  onCheck: () => void;
  locked: boolean;
}) {
  const isDone  = lineState.status === "correct";
  const isWrong = lineState.status === "wrong";
  const sel     = lineState.choiceSelected;
  return (
    <div className={`transition-all duration-300 ${locked ? "opacity-25 select-none pointer-events-none" : ""}`}>
      <div className={`rounded-xl border px-3 py-3 transition-all
        ${isDone ? "border-emerald-500/30 bg-emerald-500/8" : isWrong ? "border-rose-500/30 bg-rose-500/8" : "border-white/10 bg-white/5"}`}>
        <p className="text-white/80 text-sm font-body mb-3 leading-relaxed">{line.label}</p>
        <div className="grid grid-cols-1 gap-2">
          {line.choices.map(ch => {
            const isSelected = sel === ch.key;
            const isCorrect  = isDone && ch.key === line.correct;
            const isWrongSel = isWrong && isSelected;
            return (
              <button key={ch.key} disabled={isDone}
                onClick={() => { playPopSound(); onSelect(ch.key); }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-left text-sm font-body transition-all cursor-pointer
                  ${isCorrect  ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-200"
                  : isWrongSel ? "bg-rose-500/15 border-rose-400/60 text-rose-200 line-through"
                  : isSelected ? "bg-white/15 border-white/40 text-white"
                  :              "bg-white/5 border-white/10 text-white/75 hover:bg-white/10 hover:border-white/25"}`}>
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0
                  ${isCorrect ? "border-emerald-400 text-emerald-300" : isSelected ? "border-white/60 text-white" : "border-white/20 text-white/40"}`}>{ch.key}</span>
                <span>{ch.text}</span>
                {isCorrect  && <span className="ml-auto text-emerald-400">✓</span>}
                {isWrongSel && <span className="ml-auto text-rose-400">✗</span>}
              </button>
            );
          })}
        </div>
        {sel && !isDone && (
          <button onClick={() => { playPopSound(); onCheck(); }}
            className="mt-3 w-full py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/15 transition-all cursor-pointer font-body">
            Cek Jawaban ✓
          </button>
        )}
        {isWrong && <p className="mt-2 text-rose-400 text-xs">❌ Kurang tepat. {line.hint && <span className="text-white/45">💡 {line.hint}</span>}</p>}
        {isDone  && <p className="mt-2 text-emerald-400 text-xs font-bold">✅ Benar!</p>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   POLYA STEP CARD
══════════════════════════════════════════════════════════ */

const POLYA_COLORS = [
  { ring: "ring-sky-500/40", bg: "bg-sky-500/15", text: "text-sky-300", border: "border-sky-500/30" },
  { ring: "ring-amber-500/40", bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30" },
  { ring: "ring-violet-500/40", bg: "bg-violet-500/15", text: "text-violet-300", border: "border-violet-500/30" },
  { ring: "ring-emerald-500/40", bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30" },
];

function PolyaStepCard({ step, stepIdx, lineStates, isLocked, isExpanded, onToggle, onBoxChange, onCheck, onChoiceSelect, onChoiceCheck }: {
  step: PolyaStep; stepIdx: number;
  lineStates: LineState[];
  isLocked: boolean; isExpanded: boolean;
  onToggle: () => void;
  onBoxChange: (li: number, bi: number, v: string) => void;
  onCheck: (li: number) => void;
  onChoiceSelect: (li: number, key: string) => void;
  onChoiceCheck: (li: number) => void;
}) {
  const col = POLYA_COLORS[stepIdx];
  const done = lineStates.filter(s => s.status === "correct" && (s.boxStates.length > 0 || s.choiceSelected !== undefined)).length;
  const total = lineStates.filter(s => s.boxStates.length > 0 || s.choiceSelected !== undefined).length;
  const allDone = done === total && total > 0;

  return (
    <div className={`rounded-xl border transition-all duration-300
      ${isLocked ? "border-white/8 opacity-45" : allDone ? `${col.border} ring-1 ${col.ring}` : "border-white/15"}`}>
      <button onClick={() => { if (!isLocked) { playPopSound(); onToggle(); } }}
        disabled={isLocked}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
          ${isLocked ? "cursor-not-allowed" : "cursor-pointer hover:bg-white/5"}`}>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 ${allDone ? col.bg : "bg-white/8"}`}>
          {isLocked ? "🔒" : step.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${allDone ? col.text : isLocked ? "text-white/35" : "text-white/90"}`}>
            Langkah {stepIdx + 1}: {step.title}
          </p>
          <p className="text-white/40 text-xs font-body truncate">{step.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isLocked && total > 0 && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${allDone ? `${col.bg} ${col.text}` : "bg-white/8 text-white/50"}`}>
              {done}/{total}
            </span>
          )}
          {!isLocked && (
            <span className="text-white/40 text-xs">{isExpanded ? "▲" : "▼"}</span>
          )}
        </div>
      </button>

      {isExpanded && !isLocked && (
        <div className="px-4 pb-4 flex flex-col gap-2 border-t border-white/8 pt-3">
          {step.lines.map((line, li) => {
            const prevDone = li === 0 || lineStates[li - 1].status === "correct";
            if (line.kind === "choice") {
              return (
                <ChoiceLineRow key={li}
                  line={line} lineState={lineStates[li]}
                  onSelect={key => onChoiceSelect(li, key)}
                  onCheck={() => onChoiceCheck(li)}
                  locked={!prevDone} />
              );
            }
            const eq = line as EqLine;
            return (
              <EqLineRow key={li}
                line={eq} lineState={lineStates[li]}
                onBoxChange={(bi, v) => onBoxChange(li, bi, v)}
                onCheck={() => onCheck(li)}
                locked={!prevDone} />
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   KASUS CARD
══════════════════════════════════════════════════════════ */

function KasusCard({ kasus, stepStates, onBoxChange, onCheck, onChoiceSelect, onChoiceCheck, onToggleStep }: {
  kasus: Kasus;
  stepStates: StepState[];
  onBoxChange: (si: number, li: number, bi: number, v: string) => void;
  onCheck: (si: number, li: number) => void;
  onChoiceSelect: (si: number, li: number, key: string) => void;
  onChoiceCheck: (si: number, li: number) => void;
  onToggleStep: (si: number) => void;
}) {
  const allStepsDone = stepStates.every(ss => {
    const total = ss.lineStates.filter(s => s.boxStates.length > 0 || s.choiceSelected !== undefined).length;
    const done  = ss.lineStates.filter(s => s.status === "correct" && (s.boxStates.length > 0 || s.choiceSelected !== undefined)).length;
    return done === total && total > 0;
  });

  return (
    <div className={`relative rounded-2xl overflow-hidden border ${kasus.border} bg-gradient-to-br ${kasus.color} backdrop-blur-sm`}>
      {allStepsDone && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["⭐","✨","🎉","💫","🌟","🎊"].map((e, i) => (
            <span key={i} className="absolute text-base animate-bounce"
              style={{ top: `${8 + i * 13}%`, left: `${4 + i * 16}%`, animationDelay: `${i * 0.12}s`, opacity: 0.5 }}>{e}</span>
          ))}
        </div>
      )}

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full ${kasus.badge} border border-white/20 flex items-center justify-center text-lg shrink-0 font-black`}>
            {allStepsDone ? "✅" : kasus.n}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${kasus.badge}`}>{kasus.emoji} Kasus {kasus.n}</span>
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${kasus.badge}`}>Konsep: {kasus.concept}</span>
            </div>
            <h3 className="text-white font-bold text-sm mb-1">{kasus.title}</h3>
            <p className="text-white/80 text-sm font-body leading-relaxed">{kasus.context}</p>
          </div>
        </div>

        {/* Polya Steps */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-white/35 text-[10px] font-bold uppercase tracking-widest">Metode Polya — 4 Langkah</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="flex flex-col gap-2">
          {kasus.polyaSteps.map((step, si) => {
            const prevStepDone = si === 0 || (() => {
              const prev = stepStates[si - 1];
              const total = prev.lineStates.filter(s => s.boxStates.length > 0 || s.choiceSelected !== undefined).length;
              const done  = prev.lineStates.filter(s => s.status === "correct" && (s.boxStates.length > 0 || s.choiceSelected !== undefined)).length;
              return done === total && total > 0;
            })();
            return (
              <PolyaStepCard key={si}
                step={step} stepIdx={si}
                lineStates={stepStates[si].lineStates}
                isLocked={!prevStepDone}
                isExpanded={stepStates[si].expanded}
                onToggle={() => onToggleStep(si)}
                onBoxChange={(li, bi, v) => onBoxChange(si, li, bi, v)}
                onCheck={li => onCheck(si, li)}
                onChoiceSelect={(li, key) => onChoiceSelect(si, li, key)}
                onChoiceCheck={li => onChoiceCheck(si, li)}
              />
            );
          })}
        </div>

        {allStepsDone && (
          <div className="mt-4 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
            <p className="text-emerald-300 text-sm font-bold text-center">
              🎯 Jawaban: {kasus.answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */

const KPKFPBLKPDPage = () => {
  const navigate = useNavigate();

  const [allStates, setAllStates] = useState<StepState[][][]>(
    kasusList.map(k =>
      k.polyaSteps.map((step, si) => ({
        expanded: si === 0,
        lineStates: step.lines.map(initLineState),
      }))
    )
  );

  const patch = (ki: number, si: number, li: number, patch: Partial<LineState>) =>
    setAllStates(prev => {
      const next = prev.map(k => k.map(s => ({ ...s, lineStates: s.lineStates.map(l => ({ ...l, boxStates: l.boxStates.map(b => ({ ...b })) })) })));
      next[ki][si].lineStates[li] = { ...next[ki][si].lineStates[li], ...patch };
      return next;
    });

  const handleBoxChange = (ki: number, si: number, li: number, bi: number, v: string) =>
    setAllStates(prev => {
      const next = prev.map(k => k.map(s => ({ ...s, lineStates: s.lineStates.map(l => ({ ...l, boxStates: l.boxStates.map(b => ({ ...b })) })) })));
      next[ki][si].lineStates[li].boxStates[bi] = { value: v, status: "idle" };
      next[ki][si].lineStates[li].status = "idle";
      return next;
    });

  const handleCheck = (ki: number, si: number, li: number) => {
    const line = kasusList[ki].polyaSteps[si].lines[li] as EqLine;
    const ls   = allStates[ki][si].lineStates[li];
    const norm = (s: string) => s.trim().replace(/\s/g, "").toLowerCase();
    const newBoxes = ls.boxStates.map((b, bi) => ({
      ...b,
      status: (line.boxes[bi].some(a => norm(a) === norm(b.value)) ? "correct" : "wrong") as "correct"|"wrong",
    }));
    const allCorrect = newBoxes.every(b => b.status === "correct");
    patch(ki, si, li, { boxStates: newBoxes, status: allCorrect ? "correct" : "wrong" });
    if (allCorrect) {
      // auto-expand next polya step if all lines in this step are done
      setTimeout(() => {
        setAllStates(prev => {
          const lsAll = prev[ki][si].lineStates;
          const total = lsAll.filter(s => s.boxStates.length > 0 || s.choiceSelected !== undefined).length;
          const done  = lsAll.filter(s => s.status === "correct" && (s.boxStates.length > 0 || s.choiceSelected !== undefined)).length;
          const newBoxesDone = newBoxes.every(b => b.status === "correct");
          const stepComplete = (done + (newBoxesDone ? 1 : 0)) >= total;
          if (stepComplete && si + 1 < prev[ki].length) {
            const next = prev.map(k => k.map(s => ({ ...s, lineStates: [...s.lineStates] })));
            next[ki][si + 1] = { ...next[ki][si + 1], expanded: true };
            return next;
          }
          return prev;
        });
      }, 400);
    }
  };

  const handleChoiceSelect = (ki: number, si: number, li: number, key: string) =>
    patch(ki, si, li, { choiceSelected: key, status: "idle" });

  const handleChoiceCheck = (ki: number, si: number, li: number) => {
    const line = kasusList[ki].polyaSteps[si].lines[li] as ChoiceLine;
    const sel  = allStates[ki][si].lineStates[li].choiceSelected;
    patch(ki, si, li, { status: sel === line.correct ? "correct" : "wrong" });
  };

  const handleToggleStep = (ki: number, si: number) =>
    setAllStates(prev => {
      const next = prev.map(k => k.map(s => ({ ...s })));
      next[ki][si] = { ...next[ki][si], expanded: !next[ki][si].expanded };
      return next;
    });

  const totalInteractive = allStates.reduce((a, k) =>
    a + k.reduce((b, s) => b + s.lineStates.filter(l => l.boxStates.length > 0 || l.choiceSelected !== undefined).length, 0), 0);
  const doneInteractive = allStates.reduce((a, k) =>
    a + k.reduce((b, s) => b + s.lineStates.filter(l => l.status === "correct" && (l.boxStates.length > 0 || l.choiceSelected !== undefined)).length, 0), 0);
  const pct = totalInteractive > 0 ? Math.round((doneInteractive / totalInteractive) * 100) : 0;
  const allDone = doneInteractive === totalInteractive;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-7 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-400/60 flex items-center justify-center mb-3">
            <span className="text-3xl">🔢</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-yellow-300 mb-1"
            style={{ textShadow: "0 0 24px rgba(234,179,8,0.7)" }}>
            KPK DAN FPB — MASALAH KONTEKSTUAL
          </h1>
          <p className="text-white/50 text-xs font-body">Kelas 7 · Bilangan Bulat · LKPD Interaktif</p>
          <p className="mt-2 text-white/60 text-sm font-body max-w-xl">
            Selesaikan setiap kasus menggunakan <strong className="text-yellow-300">Metode Polya</strong> — 4 langkah berpikir sistematis yang akan membantumu memecahkan masalah matematika!
          </p>
        </div>

        {/* POLYA INTRODUCTION */}
        <div className="mb-5 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-yellow-300 text-xs font-bold mb-3">🧠 Metode Polya — 4 Langkah Pemecahan Masalah</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { n: "1", icon: "🔍", lbl: "Memahami Masalah", sub: "Apa yang diketahui & ditanyakan?",       cls: "border-sky-500/30 bg-sky-500/10 text-sky-300" },
              { n: "2", icon: "🎯", lbl: "Merencanakan Strategi", sub: "Gunakan KPK atau FPB?",             cls: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
              { n: "3", icon: "⚙️", lbl: "Menjalankan Rencana", sub: "Hitung faktorisasi & jawaban",       cls: "border-violet-500/30 bg-violet-500/10 text-violet-300" },
              { n: "4", icon: "✅", lbl: "Memeriksa Kembali", sub: "Periksa apakah jawaban masuk akal",    cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
            ].map(r => (
              <div key={r.n} className={`border rounded-lg p-2 text-center ${r.cls}`}>
                <div className="text-xl mb-1">{r.icon}</div>
                <div className="text-xs font-bold leading-tight">{r.lbl}</div>
                <div className="text-[10px] opacity-70 mt-0.5 leading-tight font-body">{r.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* KPK vs FPB TIPS */}
        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-sky-900/25 border border-sky-500/25 rounded-xl p-4">
            <p className="text-sky-300 text-xs font-bold mb-2">⏱️ Kapan pakai KPK?</p>
            <p className="text-white/70 text-xs font-body leading-relaxed">Gunakan KPK saat soal menggunakan kata kunci seperti <strong className="text-sky-300">"bersama-sama lagi"</strong>, <strong className="text-sky-300">"setiap … sekali"</strong>, atau <strong className="text-sky-300">"kapan bertemu kembali"</strong>.</p>
          </div>
          <div className="bg-rose-900/25 border border-rose-500/25 rounded-xl p-4">
            <p className="text-rose-300 text-xs font-bold mb-2">📦 Kapan pakai FPB?</p>
            <p className="text-white/70 text-xs font-body leading-relaxed">Gunakan FPB saat soal menggunakan kata kunci seperti <strong className="text-rose-300">"dibagi sama rata"</strong>, <strong className="text-rose-300">"sebanyak-banyaknya kelompok"</strong>, atau <strong className="text-rose-300">"ukuran terbesar"</strong>.</p>
          </div>
        </div>

        {/* PROGRESS */}
        <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-xs font-bold">Progress</span>
            <span className={`text-xs font-bold ${allDone ? "text-emerald-400" : "text-yellow-400"}`}>
              {doneInteractive}/{totalInteractive} langkah ({pct}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${pct}%` }} />
          </div>
          {allDone && (
            <p className="mt-2 text-center text-emerald-400 text-sm font-bold animate-bounce">
              🎉 Luar biasa! Semua kasus berhasil diselesaikan dengan Metode Polya! 🌟
            </p>
          )}
        </div>

        {/* KASUS CARDS */}
        <div className="flex flex-col gap-6">
          {kasusList.map((kasus, ki) => (
            <KasusCard key={ki}
              kasus={kasus}
              stepStates={allStates[ki]}
              onBoxChange={(si, li, bi, v) => handleBoxChange(ki, si, li, bi, v)}
              onCheck={(si, li) => handleCheck(ki, si, li)}
              onChoiceSelect={(si, li, key) => handleChoiceSelect(ki, si, li, key)}
              onChoiceCheck={(si, li) => handleChoiceCheck(ki, si, li)}
              onToggleStep={si => handleToggleStep(ki, si)}
            />
          ))}
        </div>

        {/* BACK */}
        <div className="mt-10 text-center">
          <button onClick={() => { playPopSound(); navigate("/lkpd/kelas-7/bilangan-bulat"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke LKPD Bilangan Bulat
          </button>
        </div>
      </div>
    </div>
  );
};

export default KPKFPBLKPDPage;
