import type { ReactNode } from "react";
import TKAPemantapanLayout from "@/components/tka/TKAPemantapanLayout";
import type { MateriSection, LatihanSoal } from "@/components/tka/TKAPemantapanLayout";

const materiSections: MateriSection[] = [
  { heading: "A. Barisan", content: `Barisan adalah daftar urutan bilangan dari kiri ke kanan yang mempunyai pola tertentu. Setiap bilangan dalam barisan merupakan suku barisan.` },
  { heading: "B. Barisan Aritmatika", content: `Barisan dengan selisih antara dua suku berurutan selalu tetap (beda = b).\n\n$b = U_n - U_{n-1}$\n$U_n = a + (n-1)b$\n$S_n = \\dfrac{n}{2}(2a + (n-1)b) = \\dfrac{n}{2}(a + U_n)$\n\nKeterangan:\n- $a = U_1$ = suku pertama\n- $b$ = beda\n- $n$ = banyak suku\n- $U_n$ = suku ke-n\n- $S_n$ = jumlah n suku pertama` },
  { heading: "C. Barisan Geometri", content: `Barisan dengan rasio antara dua suku berurutan selalu tetap (rasio = r).\n\n$r = \\dfrac{U_n}{U_{n-1}}$\n$U_n = ar^{n-1}$\n$S_n = \\dfrac{a(r^n - 1)}{r - 1}$ untuk $r > 1$\n$S_n = \\dfrac{a(1 - r^n)}{1 - r}$ untuk $r < 1$` },
  { heading: "D. Barisan Bertingkat", content: `1. Pola Bilangan Persegi: $U_n = n^2$\n2. Pola Bilangan Persegi Panjang: $U_n = n(n+1)$\n3. Pola Bilangan Segitiga: $U_n = \\dfrac{n(n+1)}{2}$` },
  { heading: "E. Rumus Suku Ke-n", content: `Jika selisih tetap ditemukan pada:\n- Satu tingkat: $U_n = an + b$ (derajat 1)\n- Dua tingkat: $U_n = an^2 + bn + c$ (derajat 2)\n- Tiga tingkat: $U_n = an^3 + bn^2 + cn + d$ (derajat 3)` },
  { heading: "F. Deret Geometri Tak Hingga", content: `Untuk $|r| < 1$:\n$S_\\infty = \\dfrac{a}{1 - r}$\n\nContoh:\n$16 + 8 + 4 + 2 + ...$\n$S_\\infty = \\dfrac{16}{1 - \\frac{1}{2}} = 32$` },
  { heading: "G. Deret Teleskopik", content: `Prinsip dasar:\n$\\dfrac{1}{k(k+1)} = \\dfrac{1}{k} - \\dfrac{1}{k+1}$\n$\\dfrac{1}{k(k+m)} = \\dfrac{1}{m}\\left(\\dfrac{1}{k} - \\dfrac{1}{k+m}\\right)$\n\nSehingga sebagian besar suku saling meniadakan.` },
];

/* ============================================================
   Ilustrasi soal No. 27, 28, 30, 31 (SVG) — disalin persis dari
   OlimpiadePolaBilanganPage.tsx supaya tampilan identik.
   Ditempel langsung ke field `gambar` pada LatihanSoal (ReactNode).
   ============================================================ */
const dotColor = "#5b9ec9";
const dotR = 5;
const sp = 14;

// Soal 27: Persegi satuan in 2-row rectangular grids (2×2, 2×3, 2×4)
const Soal27SVG = () => {
  const sq = 18;
  const gap = 22;
  const patterns = [{ cols: 2 }, { cols: 3 }, { cols: 4 }];
  let curX = 8;
  const positions: number[] = [];
  for (const p of patterns) { positions.push(curX); curX += p.cols * sq + gap; }
  const totalW = curX - gap + 8;
  return (
    <svg width={totalW} height={2 * sq + 12}>
      {patterns.map((p, i) => {
        const x = positions[i];
        const rects: ReactNode[] = [];
        for (let r = 0; r < 2; r++)
          for (let c = 0; c < p.cols; c++)
            rects.push(<rect key={`${r}-${c}`} x={x + c * sq} y={6 + r * sq} width={sq} height={sq} fill="#5b9ec9" stroke="var(--icon-stroke)" strokeWidth="1.5" rx="1" />);
        return <g key={i}>{rects}</g>;
      })}
    </svg>
  );
};

// Soal 28: Circles in bowling-pin triangle (n=1,2,3,4) — triangular numbers
const Soal28SVG = () => {
  const r = 7;
  const sp28 = 17;
  const patterns = [1, 2, 3, 4];
  const gap = 22;
  let curX = 8;
  const positions: number[] = [];
  for (const n of patterns) { positions.push(curX); curX += n * sp28 + gap; }
  const maxH = 4 * sp28;
  const totalW = curX - gap + 8;
  return (
    <svg width={totalW} height={maxH + 30}>
      {patterns.map((n, i) => {
        const x = positions[i];
        const patW = n * sp28;
        const circles: ReactNode[] = [];
        for (let row = 0; row < n; row++) {
          const num = n - row;
          const rowOffsetX = (patW - num * sp28) / 2;
          const cy = 8 + maxH - (row + 1) * sp28 + sp28 / 2;
          for (let c = 0; c < num; c++)
            circles.push(<circle key={`${row}-${c}`} cx={x + rowOffsetX + c * sp28 + sp28 / 2} cy={cy} r={r} fill="none" stroke="#5b9ec9" strokeWidth="1.5" />);
        }
        return (
          <g key={i}>
            {circles}
            <text x={x + patW / 2} y={8 + maxH + 20} textAnchor="middle" fill="#ffffffcc" fontSize="12" fontFamily="sans-serif">{n}</text>
          </g>
        );
      })}
    </svg>
  );
};

// Soal 30: Dots in n×(n+2) rectangles (n=1..4), U_n = n(n+2), U_10 = 120
const Soal30SVG = () => {
  const patterns = [
    { rows: 1, cols: 3 },
    { rows: 2, cols: 4 },
    { rows: 3, cols: 5 },
    { rows: 4, cols: 6 },
  ];
  const gap = 18;
  let curX = 8;
  const positions: number[] = [];
  for (const p of patterns) { positions.push(curX); curX += p.cols * sp + gap; }
  const maxH = 4 * sp;
  const totalW = curX - gap + 8;
  return (
    <svg width={totalW} height={maxH + 12}>
      {patterns.map((p, i) => {
        const x = positions[i];
        const h = p.rows * sp;
        const offsetY = 6 + maxH - h;
        const dots: ReactNode[] = [];
        for (let r = 0; r < p.rows; r++)
          for (let c = 0; c < p.cols; c++)
            dots.push(<circle key={`${r}-${c}`} cx={x + c * sp + dotR} cy={offsetY + r * sp + dotR} r={dotR} fill={dotColor} />);
        return <g key={i}>{dots}</g>;
      })}
    </svg>
  );
};

// Soal 31: L-shaped dot patterns (n=1..4), U_n = 2n−1, U_30 = 59
const Soal31SVG = () => {
  const patterns = [1, 2, 3, 4];
  const gap = 22;
  let curX = 8;
  const positions: number[] = [];
  for (const n of patterns) { positions.push(curX); curX += n * sp + gap; }
  const maxH = 4 * sp;
  const totalW = curX - gap + 8;
  return (
    <svg width={totalW} height={maxH + 12}>
      {patterns.map((n, i) => {
        const x = positions[i];
        const baseY = 6 + maxH;
        const dots: ReactNode[] = [];
        // Bottom row: n dots
        for (let c = 0; c < n; c++)
          dots.push(<circle key={`b${c}`} cx={x + c * sp + dotR} cy={baseY - dotR} r={dotR} fill={dotColor} />);
        // Right column: n-1 dots going up (excluding corner already in bottom row)
        for (let r = 1; r < n; r++)
          dots.push(<circle key={`rc${r}`} cx={x + (n - 1) * sp + dotR} cy={baseY - r * sp - dotR} r={dotR} fill={dotColor} />);
        return <g key={i}>{dots}</g>;
      })}
    </svg>
  );
};

const latihanDasar: LatihanSoal[] = [
  { no: 1, soal: "Diketahui barisan bilangan aritmetika sebagai berikut.\n$-8, -4, 0, 4, 8, 12, n, 20, 24$\nNilai n yang memenuhi adalah ....", options: ["A. 10", "B. 14", "C. 16", "D. 18"] },
  { no: 2, soal: "Tiga suku berikutnya dari 1, 3, 5, 8, 9, 13, …, …., … adalah ....", options: ["A. 13, 18, 17", "B. 13, 17, 18", "C. 14, 17, 18", "D. 14, 18, 18"] },
  { no: 3, soal: "Suku ke-22 dari barisan 99, 93, 87, 81, … adalah ....", options: ["A. –27", "B. –21", "C. –15", "D. –9"] },
  { no: 4, soal: "Suku pertama dari barisan aritmatika adalah 3 dan bedanya 4, suku ke-10 dari barisan aritmatika tersebut adalah ....", options: ["A. 30", "B. 33", "C. 36", "D. 39"] },
  { no: 5, soal: "Dari barisan aritmetika diketahui $U_3 = 18$ dan $U_7 = 38$. Jumlah 24 suku pertama adalah ....", options: ["A. 786", "B. 1248", "C. 1572", "D. 3144"] },
  { no: 6, soal: "Dalam gedung pertunjukkan disusun kursi dengan baris paling depan terdiri dari 12 buah, baris kedua berisi 14 buah, baris ketiga 16 buah dan seterusnya selalu bertambah 2. Banyaknya kursi pada baris ke-20 adalah ....", options: ["A. 28 buah", "B. 50 buah", "C. 58 buah", "D. 60 buah"] },
  { no: 7, soal: "Pada tumpukan batu bata, banyak batu bata paling atas ada 8 buah, tepat di bawahnya ada 10 buah, dan seterusnya setiap tumpukan di bawahnya selalu lebih banyak 2 buah dari tumpukan di atasnya. Jika ada 15 tumpukan batu bata (dari atas sampai bawah), berapa banyak batu bata pada tumpukan paling bawah?", options: ["A. 35 buah", "B. 36 buah", "C. 38 buah", "D. 40 buah"] },
  { no: 8, soal: "Dalam suatu ruang terdapat 15 baris kursi, baris paling depan terdapat 23 kursi, baris berikutnya 2 kursi lebih banyak dari baris di depannya. Jumlah kursi dalam ruang tersebut adalah ....", options: ["A. 555", "B. 385", "C. 1.110", "D. 1.140"] },
  { no: 9, soal: "Permintaan suatu produk barang diperkirakan mengalami kenaikan 5.000 unit setiap bulan. Jika jumlah produk pertamanya 100.000, maka jumlah produk selama satu tahun pertama adalah ....", options: ["A. 1.205.000 unit", "B. 1.255.000 unit", "C. 1.260.000 unit", "D. 1.530.000 unit", "E. 1.560.000 unit"] },
  { no: 10, soal: "Diketahui barisan aritmatika, suku ke-7 dan suku ke-4 adalah 26 dan 14. Jika $U_n$ menyatakan suku ke-n dan $S_n$ menyatakan jumlah sampai n suku pertama, pernyataan yang benar adalah ....", options: ["A. $U_{30} = 108$", "B. $U_{35} = 158$", "C. $S_{15} = 450$", "D. $S_{20} = 1.600$"] },
  { no: 11, soal: "Tentukan jumlah semua bilangan asli antara 200 dan 400 yang habis dibagi 4 dan habis dibagi 6.", options: ["A. 3.000", "B. 3.200", "C. 3.600", "D. 3.800"] },
  { no: 12, soal: "Berapakah jumlah semua bilangan bulat dari 100 sampai 500 yang habis dibagi 8 dan habis dibagi 12?", options: ["A. 3.000", "B. 3.120", "C. 3.360", "D. 3.600"] },
  { no: 13, soal: "Tentukan jumlah semua bilangan asli antara 100 dan 300 yang habis dibagi 7 tetapi tidak habis dibagi 5.", options: ["A. 3.424", "B. 3.696", "C. 4.060", "D. 4.200"] },
  { no: 14, soal: "Diberikan deret bilangan bulat positif: 1, 2, 3, …, 200. Tentukan jumlah bilangan dalam deret tersebut yang habis dibagi 4 tetapi tidak habis dibagi 10.", options: ["A. 4.000", "B. 4.200", "C. 4.400", "D. 4.800"] },
  { no: 15, soal: "Diketahui barisan bilangan 8, 4, 2, 1, …. Rumus suku ke-n barisan tersebut adalah ....", options: ["A. $2^{n+2}$", "B. $2^{n-4}$", "C. $2^{-n+4}$", "D. $2^{n-1}$"] },
  { no: 16, soal: "Suku pertama dan kelima suatu barisan geometri berturut-turut 5 dan 80. Suku ke-9 barisan geometri tersebut adalah ....", options: ["A. 90", "B. 405", "C. 940", "D. 1.280"] },
  { no: 17, soal: "Suku ke-2 dan ke-4 barisan geometri adalah 384 dan 96. Suku ke-8 barisan tersebut adalah ....", options: ["A. 3", "B. 6", "C. 9", "D. 12"] },
  { no: 18, soal: "Suku ke-1 dan suku ke-4 barisan geometri adalah 5 dan 40. Jumlah 6 suku pertama dari barisan tersebut adalah ....", options: ["A. 155", "B. 160", "C. 315", "D. 320"] },
  { no: 19, soal: "Celin melipat-lipat kertas berkali-kali. Jika ketebalan kertas mula-mula 2 mm, maka butuh berapa kali lipatan sehingga ketebalan kertas menjadi 256 mm?", options: ["A. 7 kali", "B. 8 kali", "C. 9 kali", "D. 10 kali"] },
  { no: 20, soal: "Seutas tali dibagi menjadi enam bagian, sehingga bagian-bagiannya membentuk barisan geometri. Jika panjang tali terpendek 9 cm dan panjang tali terpanjang 288 cm, maka panjang tali mula-mula adalah ....", options: ["A. 567 cm", "B. 576 cm", "C. 586 cm", "D. 596 cm"] },
  { no: 21, soal: "Setiap bakteri akan membelah diri menjadi 2 setiap 15 menit. Jika banyak bakteri pada pukul 10.00 ada 25 buah, maka banyak bakteri pada pukul 12.15 adalah ....", options: ["A. 800", "B. 1600", "C. 3200", "D. 6400"] },
  { no: 22, soal: "Suku ke-14 barisan 15, 24, 35, 48, 63, … adalah ....", options: ["A. 185", "B. 194", "C. 288", "D. 312"] },
  { no: 23, soal: "Suku ke-40 dari 3, 5, 9, 15, 23, … adalah ....", options: ["A. 1560", "B. 1563", "C. 1600", "D. 1603"] },
  { no: 24, soal: "Tiga suku berikutnya dari 1, 3, 6, 7, 11, 11, … adalah ....", options: ["A. 13, 18, 17", "B. 13, 17, 18", "C. 16, 15, 21", "D. 16, 15, 20"] },
  { no: 25, soal: "Rumus suku ke-n barisan adalah $U_n = 2n(n-1)$. Hasil dari $U_9 - U_7$ adalah ....", options: ["A. 80", "B. 70", "C. 60", "D. 50"] },
  { no: 26, soal: "Rumus suku ke-n dari barisan bilangan 0, 4, 10, 18, … adalah ....", options: ["A. $\\frac{1}{2}n(n+1)$", "B. $2n(n+1)$", "C. $(n-1)(n+2)$", "D. $(n+1)(n+2)$"] },
  {
    no: 27,
    soal: "Perhatikan gambar berikut!\nBanyak persegi satuan pada pola ke-19 adalah ....",
    options: ["A. 36", "B. 38", "C. 40", "D. 42"],
    gambar: <Soal27SVG />,
  },
  {
    no: 28,
    soal: "Perhatikan gambar pola berikut.\nBanyak lingkaran pada pola ke-15 adalah ....",
    options: ["A. 105", "B. 120", "C. 210", "D. 240"],
    gambar: <Soal28SVG />,
  },
  {
    no: 29,
    soal: "Gambar berikut adalah pola segitiga.\nBanyak segitiga satu-satuan pada pola ke-7 adalah ....",
    options: ["A. 28", "B. 36", "C. 42", "D. 49"],
    gambar: (
      <img
        src="https://drive.google.com/thumbnail?id=1f-EBr1I4CaOwcZbixjEMgb5NxepLfmoM&sz=w800"
        alt="Pola segitiga"
        className="my-2 max-w-xs w-full rounded"
      />
    ),
  },
  {
    no: 30,
    soal: "Perhatikan gambar pola berikut!\nBanyak lingkaran pada pola ke-10 adalah ....",
    options: ["A. 99 buah", "B. 104 buah", "C. 115 buah", "D. 120 buah"],
    gambar: <Soal30SVG />,
  },
  {
    no: 31,
    soal: "Perhatikanlah pola berikut.\nBanyak lingkaran pada pola ke-30 adalah ....",
    options: ["A. 39", "B. 41", "C. 57", "D. 59"],
    gambar: <Soal31SVG />,
  },
  { no: 32, soal: "Hitunglah jumlah tak hingga dari deret geometri berikut:\n$18 + 6 + 2 + \\frac{2}{3} + ...$", options: ["A. 24", "B. 27", "C. 36", "D. Tak hingga"] },
  { no: 33, soal: "Jumlah tak hingga dari deret:\n$\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\frac{1}{16} + ...$", options: ["A. 4", "B. 5", "C. 1", "D. Deret divergen (tidak memiliki jumlah)"] },
  { no: 34, soal: "Sebuah bola tenis dijatuhkan dari ketinggian 12 meter. Setelah menyentuh lantai, bola memantul kembali dengan ketinggian $\\frac{2}{3}$ dari ketinggian sebelumnya. Pantulan ini terjadi terus-menerus hingga bola berhenti. Total panjang lintasan yang ditempuh bola tersebut adalah ....", options: ["A. 24 m", "B. 36 m", "C. 48 m", "D. 60 m"] },
  { no: 35, soal: "Bentuk sederhana dari $\\left(1-\\frac{1}{2^2}\\right)\\left(1-\\frac{1}{3^2}\\right)\\left(1-\\frac{1}{4^2}\\right)...\\left(1-\\frac{1}{2022^2}\\right)$ adalah ....", options: ["A. $\\frac{2023}{4044}$", "B. $\\frac{1011}{2022}$", "C. $\\frac{2023}{2022}$", "D. $\\frac{1}{4044}$"] },
  { no: 36, soal: "Nilai dari $\\frac{1}{2} + \\frac{1}{6} + \\frac{1}{12} + \\frac{1}{20} + ... + \\frac{1}{420}$ adalah ....", options: ["A. $\\frac{21}{20}$", "B. $\\frac{20}{21}$", "C. $\\frac{21}{10}$", "D. $\\frac{10}{21}$"] },
  { no: 37, soal: "Nilai dari $\\frac{1}{1 \\cdot 4} + \\frac{1}{4 \\cdot 7} + \\frac{1}{7 \\cdot 10} + ... + \\frac{1}{1999 \\cdot 2002}$ adalah ....", options: ["A. $\\frac{1}{3}$", "B. $\\frac{667}{2002}$", "C. $\\frac{2001}{6006}$", "D. $\\frac{1}{2002}$"] },
  { no: 38, soal: "Perhatikan persamaan berikut.\n$(2+1)(2^2+1)(2^4+1)(2^8+1)...(2^{2048}+1) = 2^a - b$\nNilai a dan b yang memenuhi persamaan tersebut adalah ....", options: ["A. $a = 4096,\\ b = 1$", "B. $a = 2048,\\ b = 1$", "C. $a = 4096,\\ b = 3$", "D. $a = 4095,\\ b = 1$"] },
  { no: 39, soal: "Hasil dari $\\sqrt{1+\\frac{1}{3}} \\cdot \\sqrt{1+\\frac{1}{4}} \\cdot \\sqrt{1+\\frac{1}{5}} \\cdot ... \\cdot \\sqrt{1+\\frac{1}{2018}}$ adalah ....", options: ["A. $\\sqrt{672}$", "B. $\\sqrt{673}$", "C. $\\sqrt{2018}$", "D. $\\sqrt{2019}$"] },
  { no: 40, soal: "Perhatikan bentuk berikut:\n$\\left(1-\\frac{1}{4}\\right)\\left(1-\\frac{1}{9}\\right)\\left(1-\\frac{1}{16}\\right)...\\left(1-\\frac{1}{n^2}\\right)$\nNilai dari bentuk di atas adalah ....", options: ["A. $\\frac{n+1}{2n}$", "B. $\\frac{n+1}{2}$", "C. $\\frac{n}{2(n+1)}$", "D. $\\frac{2n}{n+1}$"] },
  { no: 41, soal: "Nilai dari $\\frac{1}{1 \\cdot 2} + \\frac{1}{2 \\cdot 3} + \\frac{1}{3 \\cdot 4} + ... + \\frac{1}{n(n+1)}$ adalah ....", options: ["A. $\\frac{n}{n+1}$", "B. $\\frac{n+1}{n}$", "C. $\\frac{1}{n(n+1)}$", "D. $\\frac{n}{2(n+1)}$"] },
  { no: 42, soal: "Tentukan nilai dari\n$\\frac{1}{1} + \\frac{1}{1+2} + \\frac{1}{1+2+3} + \\frac{1}{1+2+3+4} + ... + \\frac{1}{1+2+3+...+2024}$", options: ["A. $\\frac{4048}{2025}$", "B. $\\frac{2024}{2025}$", "C. $\\frac{4048}{2024}$", "D. $\\frac{2023}{2025}$"] },
];

const PolaBilanganPage = () => (
  <TKAPemantapanLayout
    title="POLA BILANGAN (BARISAN DAN DERET)"
    materiSections={materiSections}
    latihanDasar={latihanDasar}
  />
);

export default PolaBilanganPage;
