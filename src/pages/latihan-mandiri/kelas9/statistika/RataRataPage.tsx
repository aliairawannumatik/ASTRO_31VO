import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const TableRataRata = () => (
  <svg width="320" height="160" viewBox="0 0 320 160" className="mx-auto">
    <rect x="4" y="4" width="312" height="152" rx="10" fill="#1e3a5f" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1.5" />
    <text x="160" y="20" fill="#93c5fd" fontSize="10" textAnchor="middle" fontWeight="bold">Tabel Distribusi Nilai Siswa</text>
    <rect x="10" y="25" width="292" height="20" rx="4" fill="#1d4ed8" fillOpacity="0.35" />
    <text x="55" y="39" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Nilai (xᵢ)</text>
    <text x="130" y="39" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi (fᵢ)</text>
    <text x="215" y="39" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">fᵢ · xᵢ</text>
    <text x="280" y="39" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Titik Tengah</text>
    {[
      ["60", "3", "180", "—"],
      ["70", "8", "560", "—"],
      ["80", "12", "960", "—"],
      ["90", "5", "450", "—"],
      ["100", "2", "200", "—"],
    ].map(([xi, fi, fixi, tt], i) => (
      <g key={i}>
        <rect x="10" y={47 + i * 20} width="292" height="19" fill={i % 2 === 0 ? "#1e3a5f" : "transparent"} fillOpacity="0.3" />
        <text x="55" y={60 + i * 20} fill="#bfdbfe" fontSize="9" textAnchor="middle">{xi}</text>
        <text x="130" y={60 + i * 20} fill="#bfdbfe" fontSize="9" textAnchor="middle">{fi}</text>
        <text x="215" y={60 + i * 20} fill="#60a5fa" fontSize="9" textAnchor="middle">{fixi}</text>
        <text x="280" y={60 + i * 20} fill="#94a3b8" fontSize="9" textAnchor="middle">{tt}</text>
      </g>
    ))}
    <rect x="10" y="147" width="292" height="6" rx="2" fill="#1d4ed8" fillOpacity="0.3" />
    <text x="55" y="153" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Σ = 30</text>
    <text x="215" y="153" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Σ = 2350</text>
  </svg>
);

const RataRataGabunganDiagram = () => (
  <svg width="310" height="160" viewBox="0 0 310 160" className="mx-auto">
    <rect x="4" y="4" width="302" height="152" rx="10" fill="#1e3a5f" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1.5" />
    <text x="155" y="20" fill="#93c5fd" fontSize="10" textAnchor="middle" fontWeight="bold">Rumus Rata-Rata Gabungan</text>
    <rect x="20" y="28" width="270" height="50" rx="6" fill="#1d4ed8" fillOpacity="0.2" />
    <text x="155" y="44" fill="#60a5fa" fontSize="10" textAnchor="middle">x̄_gab = (n₁·x̄₁ + n₂·x̄₂ + n₃·x̄₃)</text>
    <line x1="60" y1="52" x2="250" y2="52" stroke="#3b82f6" strokeWidth="1" />
    <text x="155" y="67" fill="#60a5fa" fontSize="10" textAnchor="middle">n₁ + n₂ + n₃</text>
    <text x="155" y="95" fill="#94a3b8" fontSize="9" textAnchor="middle">Contoh:</text>
    <text x="155" y="110" fill="#bfdbfe" fontSize="9" textAnchor="middle">Kelas A: n₁=30, x̄₁=75</text>
    <text x="155" y="124" fill="#bfdbfe" fontSize="9" textAnchor="middle">Kelas B: n₂=25, x̄₂=80</text>
    <text x="155" y="138" fill="#60a5fa" fontSize="9" textAnchor="middle">x̄_gab = (30×75 + 25×80)/(30+25) = ?</text>
    <text x="155" y="152" fill="#34d399" fontSize="9" textAnchor="middle">(2250 + 2000)/55 = 4250/55 ≈ 77,27</text>
  </svg>
);

const TabelSkorSeni = () => (
  <svg width="280" height="152" viewBox="0 0 280 152" className="mx-auto">
    <rect x="4" y="4" width="272" height="144" rx="10" fill="#1e3a5f" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1.5" />
    <text x="140" y="20" fill="#93c5fd" fontSize="10" textAnchor="middle" fontWeight="bold">Tabel Skor Karya Seni</text>
    <rect x="10" y="25" width="260" height="18" rx="3" fill="#1d4ed8" fillOpacity="0.35" />
    <text x="80" y="37" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Skor (xᵢ)</text>
    <text x="200" y="37" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi (fᵢ)</text>
    {[["5","2"],["6","5"],["7","8"],["8","9"],["9","5"],["10","1"]].map(([x,f],i) => (
      <g key={i}>
        <rect x="10" y={44+i*15} width="260" height="14" fill={i%2===0?"#1e3a5f":"transparent"} fillOpacity="0.3"/>
        <text x="80" y={55+i*15} fill="#bfdbfe" fontSize="9" textAnchor="middle">{x}</text>
        <text x="200" y={55+i*15} fill="#60a5fa" fontSize="9" textAnchor="middle">{f}</text>
      </g>
    ))}
    <rect x="10" y="134" width="260" height="14" rx="2" fill="#1d4ed8" fillOpacity="0.25"/>
    <text x="80" y="144" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Σ = 30 siswa</text>
    <text x="200" y="144" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Σfᵢxᵢ = 223</text>
  </svg>
);

const TabelAplikasi = () => (
  <svg width="280" height="167" viewBox="0 0 280 167" className="mx-auto">
    <rect x="4" y="4" width="272" height="159" rx="10" fill="#1e3a5f" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1.5" />
    <text x="140" y="20" fill="#93c5fd" fontSize="10" textAnchor="middle" fontWeight="bold">Tabel Banyak Aplikasi Belajar</text>
    <rect x="10" y="25" width="260" height="18" rx="3" fill="#1d4ed8" fillOpacity="0.35" />
    <text x="80" y="37" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Jumlah Aplikasi (xᵢ)</text>
    <text x="210" y="37" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi (fᵢ)</text>
    {[["2","0"],["3","3"],["4","9"],["5","10"],["6","12"],["7","2"]].map(([x,f],i) => (
      <g key={i}>
        <rect x="10" y={44+i*15} width="260" height="14" fill={i%2===0?"#1e3a5f":"transparent"} fillOpacity="0.3"/>
        <text x="80" y={55+i*15} fill="#bfdbfe" fontSize="9" textAnchor="middle">{x}</text>
        <text x="210" y={55+i*15} fill="#60a5fa" fontSize="9" textAnchor="middle">{f}</text>
      </g>
    ))}
    <rect x="10" y="134" width="260" height="14" rx="2" fill="#1d4ed8" fillOpacity="0.25"/>
    <text x="80" y="144" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Σ = 36 siswa</text>
    <text x="210" y="144" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Σfᵢxᵢ = 181</text>
  </svg>
);

const TabelKuis = () => (
  <svg width="280" height="137" viewBox="0 0 280 137" className="mx-auto">
    <rect x="4" y="4" width="272" height="129" rx="10" fill="#1e3a5f" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1.5" />
    <text x="140" y="20" fill="#93c5fd" fontSize="10" textAnchor="middle" fontWeight="bold">Tabel Nilai Kuis Matematika</text>
    <rect x="10" y="25" width="260" height="18" rx="3" fill="#1d4ed8" fillOpacity="0.35" />
    <text x="80" y="37" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Nilai (xᵢ)</text>
    <text x="200" y="37" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Frekuensi (fᵢ)</text>
    {[["6","x"],["7","8"],["8","5"],["9","4"],["10","3"]].map(([x,f],i) => (
      <g key={i}>
        <rect x="10" y={44+i*15} width="260" height="14" fill={i%2===0?"#1e3a5f":"transparent"} fillOpacity="0.3"/>
        <text x="80" y={55+i*15} fill="#bfdbfe" fontSize="9" textAnchor="middle">{x}</text>
        <text x="200" y={55+i*15} fill={f==="x"?"#fbbf24":"#60a5fa"} fontSize="9" textAnchor="middle" fontWeight={f==="x"?"bold":"normal"}>{f}</text>
      </g>
    ))}
    <rect x="10" y="119" width="260" height="14" rx="2" fill="#1d4ed8" fillOpacity="0.25"/>
    <text x="140" y="129" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">n = x + 20, rata-rata = 7,5</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Rata-Rata Data Survei – ANBK", {
    type: "mixed",
    content: "Sebuah survei dilakukan terhadap 10 siswa tentang durasi olahraga mereka setiap hari (dalam jam, dibulatkan ke jam terdekat). Data yang diperoleh:\n9, 7, 8, 9, 6, 8, 8, 9, 10, 7\nHitunglah rata-rata durasi olahraga tersebut, dibulatkan ke satu desimal!",
    parts: [
      { label: "a.", math: "\\text{Jumlah} = 9+7+8+9+6+8+8+9+10+7 = \\ldots" },
      { label: "b.", math: "\\bar{x} = \\frac{\\ldots}{10} = \\ldots" },
      { label: "c.", text: "Berapa banyak siswa yang durasi olahraganya di atas rata-rata?" },
    ],
  }),
  Qn(2, "Rata-Rata Data Pengukuran – UN", {
    type: "mixed",
    content: "Seorang atlet lempar lembing mencatat hasil 6 kali lemparan dalam sesi latihan (dalam meter):\n58,50 ; 57,80 ; 59,20 ; 60,10 ; 58,90 ; 59,50\nHitunglah rata-rata jarak lemparannya!",
    parts: [
      { label: "a.", math: "\\text{Jumlah} = 58{,}50+57{,}80+59{,}20+60{,}10+58{,}90+59{,}50 = \\ldots \\text{ m}" },
      { label: "b.", math: "\\bar{x} = \\frac{\\ldots}{6} = \\ldots \\text{ m}" },
      { label: "c.", text: "Lemparan ke berapa saja yang jaraknya melebihi rata-rata?" },
    ],
  }),
  Qn(3, "Rata-Rata Gabungan – Mencari n₂ – TKA", {
    type: "mixed",
    content: "Rata-rata nilai ulangan 12 siswa kelompok A adalah 74. Nilai-nilai tersebut kemudian digabungkan dengan nilai sejumlah siswa kelompok B yang memiliki rata-rata 82, sehingga rata-rata gabungan menjadi 76.",
    parts: [
      { label: "a.", text: "Misalkan jumlah siswa kelompok B = n₂. Tuliskan persamaan rata-rata gabungannya!" },
      { label: "b.", math: "\\frac{12 \\times 74 + n_2 \\times 82}{12 + n_2} = 76" },
      { label: "c.", math: "888 + 82n_2 = 912 + 76n_2 \\Rightarrow 6n_2 = 24 \\Rightarrow n_2 = \\ldots" },
    ],
  }),
  Qn(4, "Rata-Rata Gabungan – Mencari x̄₂ – ANBK", {
    type: "mixed",
    content: "Tim renang sekolah terdiri dari 5 perenang utama dan 3 perenang cadangan. Rata-rata tinggi badan perenang utama adalah 168 cm. Jika rata-rata tinggi badan seluruh 8 anggota tim adalah 171 cm, hitunglah rata-rata tinggi badan perenang cadangan!",
    parts: [
      { label: "a.", math: "\\text{Total tinggi seluruh tim} = 171 \\times 8 = \\ldots \\text{ cm}" },
      { label: "b.", math: "\\text{Total tinggi perenang utama} = 168 \\times 5 = \\ldots \\text{ cm}" },
      { label: "c.", math: "\\bar{x}_{\\text{cadangan}} = \\frac{1368 - 840}{3} = \\frac{\\ldots}{3} = \\ldots \\text{ cm}" },
    ],
  }),
  Qn(5, "Rata-Rata dari Tabel Frekuensi – UN", {
    type: "mixed",
    diagram: <TabelSkorSeni />,
    content: "Penilaian karya seni 30 siswa dicatat dalam tabel di atas.",
    parts: [
      { label: "a.", math: "\\sum f_i x_i = 5(2)+6(5)+7(8)+8(9)+9(5)+10(1) = \\ldots" },
      { label: "b.", math: "\\bar{x} = \\frac{\\ldots}{30} = \\ldots" },
      { label: "c.", text: "Berapa banyak siswa yang mendapat skor di atas rata-rata?" },
    ],
  }),
  Qn(6, "Mean dan Modus dari Tabel – ANBK", {
    type: "mixed",
    diagram: <TabelAplikasi />,
    content: "Data banyak aplikasi belajar yang terinstal di ponsel sekelompok siswa tercatat dalam tabel di atas.",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{2(0)+3(3)+4(9)+5(10)+6(12)+7(2)}{36} = \\frac{\\ldots}{36} = \\ldots" },
      { label: "b.", text: "Tentukan modus data tersebut dan jelaskan alasannya!" },
      { label: "c.", text: "Berapa banyak siswa yang menginstal kurang dari 5 aplikasi?" },
    ],
  }),
  Qn(7, "Menentukan x dari Mean – TKA", {
    type: "mixed",
    diagram: <TabelKuis />,
    content: "Tabel di atas menunjukkan nilai kuis matematika sejumlah siswa. Rata-rata nilainya adalah 7,5.",
    parts: [
      { label: "a.", math: "\\frac{6x + 7(8)+8(5)+9(4)+10(3)}{x+20} = 7{,}5" },
      { label: "b.", math: "6x + 162 = 7{,}5(x+20) \\Rightarrow 6x+162 = 7{,}5x+150 \\Rightarrow x = \\ldots" },
      { label: "c.", text: "Berapa banyak siswa yang mendapat nilai tidak kurang dari 8?" },
    ],
  }),
  Qn(8, "Rata-Rata Data Tunggal – UN", {
    type: "mixed",
    mathContent: "\\bar{x} = \\frac{x_1 + x_2 + \\ldots + x_n}{n} = \\frac{\\sum x_i}{n}",
    content: "Hitung rata-rata dari data berikut:",
    parts: [
      { label: "a.", math: "\\text{Data: } 6, 7, 8, 9, 10. \\quad \\bar{x} = \\frac{6+7+8+9+10}{5} = \\ldots" },
      { label: "b.", math: "\\text{Data: } 75, 80, 65, 90, 85, 70. \\quad \\bar{x} = \\ldots" },
      { label: "c.", math: "\\text{Data: } 4, 4, 5, 6, 7, 8, 8. \\quad \\bar{x} = \\ldots" },
    ],
  }),
  Qn(9, "Rata-Rata dari Tabel – ANBK", {
    type: "mixed",
    diagram: <TableRataRata />,
    content: "Dari tabel distribusi nilai siswa di atas:",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i} = \\frac{2350}{30} = \\ldots" },
      { label: "b.", text: "Berapa jumlah seluruh siswa?" },
      { label: "c.", text: "Nilai berapa yang memiliki frekuensi terbesar?" },
    ],
  }),
  Qn(10, "Menentukan Nilai Hilang – UN", {
    type: "mixed",
    content: "Rata-rata nilai 5 siswa adalah 78. Empat nilai diketahui: 75, 82, 70, 88.",
    parts: [
      { label: "a.", math: "\\text{Jumlah} = \\bar{x} \\times n = 78 \\times 5 = \\ldots" },
      { label: "b.", math: "\\text{Nilai ke-5} = 390 - (75+82+70+88) = 390 - 315 = \\ldots" },
      { label: "c.", text: "Apakah nilai ke-5 di atas atau di bawah rata-rata?" },
    ],
  }),
  Qn(11, "Rata-Rata Data Berbobot – TKA", {
    type: "mixed",
    mathContent: "\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i}",
    content: "Nilai ujian: 6 (frekuensi 3), 7 (frekuensi 8), 8 (frekuensi 12), 9 (frekuensi 7).",
    parts: [
      { label: "a.", math: "\\sum f_i x_i = 6(3) + 7(8) + 8(12) + 9(7) = \\ldots" },
      { label: "b.", math: "\\sum f_i = 3+8+12+7 = \\ldots" },
      { label: "c.", math: "\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i} = \\ldots" },
    ],
  }),
  Qn(12, "Rata-Rata Gabungan Dua Kelompok – ANBK", {
    type: "mixed",
    diagram: <RataRataGabunganDiagram />,
    content: "Kelas A: 30 siswa, rata-rata 75. Kelas B: 25 siswa, rata-rata 80.",
    parts: [
      { label: "a.", math: "\\bar{x}_{\\text{gab}} = \\frac{n_1 \\bar{x}_1 + n_2 \\bar{x}_2}{n_1 + n_2} = \\frac{30(75) + 25(80)}{30+25}" },
      { label: "b.", math: "= \\frac{2250 + 2000}{55} = \\frac{4250}{55} = \\ldots" },
      { label: "c.", text: "Apakah rata-rata gabungan selalu berada di antara kedua rata-rata? Jelaskan." },
    ],
  }),
  Qn(13, "Rata-Rata Gabungan Tiga Kelompok – UN", {
    type: "mixed",
    mathContent: "\\bar{x}_{\\text{gab}} = \\frac{n_1 \\bar{x}_1 + n_2 \\bar{x}_2 + n_3 \\bar{x}_3}{n_1+n_2+n_3}",
    content: "Kelas 9A (35 siswa, x̄=72), 9B (30 siswa, x̄=78), 9C (25 siswa, x̄=80).",
    parts: [
      { label: "a.", math: "n_1 \\bar{x}_1 + n_2 \\bar{x}_2 + n_3 \\bar{x}_3 = 35(72)+30(78)+25(80) = \\ldots" },
      { label: "b.", math: "n_1+n_2+n_3 = 35+30+25 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{gab}} = \\frac{\\ldots}{\\ldots} = \\ldots" },
    ],
  }),
  Qn(14, "Pengaruh Penambahan Data – ANBK", {
    type: "mixed",
    content: "Rata-rata nilai 10 siswa adalah 70. Ditambahkan 2 siswa dengan nilai 80 dan 90.",
    parts: [
      { label: "a.", math: "\\text{Total nilai awal} = 70 \\times 10 = \\ldots" },
      { label: "b.", math: "\\text{Total nilai baru} = 700 + 80 + 90 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{baru}} = \\frac{870}{12} = \\ldots" },
    ],
  }),
  Qn(15, "Rata-Rata Berbobot (Nilai Akhir) – TKA", {
    type: "mixed",
    mathContent: "\\text{NA} = \\frac{40\\% \\cdot UH + 30\\% \\cdot UTS + 30\\% \\cdot UAS}{100\\%}",
    content: "Bobot: UH=40%, UTS=30%, UAS=30%. Nilai: UH=80, UTS=75, UAS=85.",
    parts: [
      { label: "a.", math: "NA = 0{,}4(80) + 0{,}3(75) + 0{,}3(85)" },
      { label: "b.", math: "= 32 + 22{,}5 + 25{,}5 = \\ldots" },
      { label: "c.", text: "Apakah nilai akhir ini sudah tuntas jika KKM = 75?" },
    ],
  }),
  Qn(16, "Soal Cerita Rata-Rata – UN", {
    type: "mixed",
    content: "Seorang pedagang mencatat pendapatannya selama 6 hari: Rp120.000, Rp150.000, Rp130.000, Rp160.000, Rp140.000, Rp130.000.",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{120+150+130+160+140+130}{6} \\times 1000 = \\ldots" },
      { label: "b.", text: "Pada hari berapa saja pendapatan di atas rata-rata?" },
      { label: "c.", text: "Berapa total pendapatan dalam 6 hari tersebut?" },
    ],
  }),
  Qn(17, "Rata-Rata dan Jumlah Data – TKA", {
    type: "mixed",
    content: "Diketahui rata-rata dari 8 bilangan adalah 12,5. Jika 2 bilangan dihapus yaitu 10 dan 15.",
    parts: [
      { label: "a.", math: "\\text{Jumlah awal} = 12{,}5 \\times 8 = \\ldots" },
      { label: "b.", math: "\\text{Jumlah setelah hapus} = 100 - 10 - 15 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{baru}} = \\frac{75}{6} = \\ldots" },
    ],
  }),
  Qn(18, "Rata-Rata Berubah karena Koreksi – UN", {
    type: "mixed",
    content: "Rata-rata nilai 20 siswa adalah 75. Ternyata nilai seorang siswa yang dicatat 60 seharusnya 80.",
    parts: [
      { label: "a.", math: "\\text{Total awal} = 75 \\times 20 = \\ldots" },
      { label: "b.", math: "\\text{Total setelah koreksi} = 1500 - 60 + 80 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{baru}} = \\frac{1520}{20} = \\ldots" },
    ],
  }),
  Qn(19, "Pemahaman Rata-Rata – ANBK", {
    type: "mixed",
    content: "Rata-rata gaji 5 karyawan adalah Rp3.000.000. Jika seorang manajer dengan gaji Rp8.000.000 bergabung:",
    parts: [
      { label: "a.", math: "\\text{Total gaji awal} = 3.000.000 \\times 5 = \\ldots" },
      { label: "b.", math: "\\text{Rata-rata baru} = \\frac{15.000.000 + 8.000.000}{6} = \\ldots" },
      { label: "c.", text: "Mengapa rata-rata gaji naik meskipun tidak semua karyawan naik gaji?" },
    ],
  }),
  Qn(20, "Nilai yang Harus Dicapai – UN", {
    type: "mixed",
    content: "Dari 4 ujian, rata-rata seorang siswa adalah 75. Ia ingin rata-rata menjadi 78 setelah ujian ke-5.",
    parts: [
      { label: "a.", math: "\\text{Total saat ini} = 75 \\times 4 = \\ldots" },
      { label: "b.", math: "\\text{Total yang diinginkan} = 78 \\times 5 = \\ldots" },
      { label: "c.", math: "\\text{Nilai ujian ke-5} = 390 - 300 = \\ldots" },
    ],
  }),
  Qn(21, "Soal UN – Rata-Rata Bertingkat", {
    type: "mixed",
    content: "Dari 3 sekolah:\n- Sekolah A: 200 siswa, rata-rata 75\n- Sekolah B: 150 siswa, rata-rata 80\n- Sekolah C: 250 siswa, rata-rata 70",
    parts: [
      { label: "a.", math: "\\sum n_i \\bar{x}_i = 200(75)+150(80)+250(70) = \\ldots" },
      { label: "b.", math: "\\sum n_i = 200+150+250 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{gab}} = \\frac{\\ldots}{\\ldots} = \\ldots" },
    ],
  }),
  Qn(22, "Soal TKA – Rata-Rata dengan Syarat", {
    type: "mixed",
    content: "Rata-rata 6 bilangan genap berurutan adalah 19.",
    parts: [
      { label: "a.", text: "Misalkan bilangan pertama = n. Tuliskan 6 bilangan genap berurutan tersebut." },
      { label: "b.", math: "\\frac{n+(n+2)+(n+4)+(n+6)+(n+8)+(n+10)}{6} = 19" },
      { label: "c.", math: "6n+30 = 114 \\Rightarrow n = \\ldots" },
    ],
  }),
  Qn(23, "Mean dari Diagram Batang – UN", {
    type: "mixed",
    diagram: (() => (
      <svg width="300" height="175" viewBox="0 0 300 175" className="mx-auto">
        <rect x="4" y="4" width="292" height="167" rx="10" fill="#1e3a5f" fillOpacity="0.35" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="150" y="18" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Nilai Ulangan IPA – 20 Siswa</text>
        {[0,15,30,45,60,75,90].map((h,i) => (
          <g key={i}>
            <line x1="38" y1={145-h} x2="285" y2={145-h} stroke="#1d4ed8" strokeWidth="0.5" strokeOpacity="0.4"/>
            <text x="35" y={148-h} fill="#94a3b8" fontSize="7" textAnchor="end">{i}</text>
          </g>
        ))}
        {[["5",2,"#60a5fa"],["6",4,"#3b82f6"],["7",6,"#2563eb"],["8",5,"#1d4ed8"],["9",2,"#60a5fa"],["10",1,"#93c5fd"]].map(([val,freq,color],i) => (
          <g key={i}>
            <rect x={48+i*38} y={145-Number(freq)*15} width="28" height={Number(freq)*15} fill={color as string} fillOpacity="0.8" rx="3"/>
            <text x={62+i*38} y={142-Number(freq)*15} fill="#dbeafe" fontSize="8" textAnchor="middle">{freq}</text>
            <text x={62+i*38} y="158" fill="#93c5fd" fontSize="8" textAnchor="middle">{val}</text>
          </g>
        ))}
        <line x1="40" y1="145" x2="285" y2="145" stroke="#3b82f6" strokeWidth="1.5"/>
        <line x1="40" y1="25" x2="40" y2="145" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="162" y="170" fill="#94a3b8" fontSize="8" textAnchor="middle">Nilai</text>
      </svg>
    ))(),
    content: "Diagram batang di atas menunjukkan nilai ulangan IPA dari 20 siswa.",
    parts: [
      { label: "a.", math: "\\sum f_i x_i = 5(2)+6(4)+7(6)+8(5)+9(2)+10(1) = \\ldots" },
      { label: "b.", math: "\\bar{x} = \\frac{\\ldots}{20} = \\ldots" },
      { label: "c.", text: "Berapa banyak siswa yang mendapat nilai di bawah rata-rata?" },
    ],
  }),
  Qn(24, "Perbandingan Jumlah Siswa dari Mean – UN", {
    type: "mixed",
    content: "Dalam suatu kelas, rata-rata nilai ujian siswa laki-laki adalah 7,2 dan rata-rata nilai siswa perempuan adalah 8,1. Rata-rata nilai seluruh kelas adalah 7,5.",
    parts: [
      { label: "a.", text: "Misalkan banyak siswa laki-laki = L dan perempuan = P. Tuliskan persamaan rata-rata gabungannya!" },
      { label: "b.", math: "7{,}2L + 8{,}1P = 7{,}5(L+P) \\Rightarrow 0{,}6P = 0{,}3L" },
      { label: "c.", math: "\\frac{L}{P} = \\frac{0{,}6}{0{,}3} = \\ldots \\Rightarrow L : P = \\ldots" },
    ],
  }),
  Qn(25, "Mencari Jumlah Siswa dari Mean Gabungan – TKA", {
    type: "mixed",
    content: "Rata-rata nilai ulangan matematika siswa perempuan adalah 75 dan siswa laki-laki adalah 66. Rata-rata nilai seluruh kelas adalah 72. Jumlah siswa dalam kelas adalah 36 orang.",
    parts: [
      { label: "a.", text: "Misalkan banyak siswa laki-laki = L dan perempuan = P, maka L + P = 36." },
      { label: "b.", math: "75P + 66L = 72 \\times 36 = 2592" },
      { label: "c.", math: "75(36-L)+66L = 2592 \\Rightarrow 2700-9L = 2592 \\Rightarrow L = \\ldots" },
    ],
  }),
  Qn(26, "Selisih Siswa dari Data Remedial – ANBK", {
    type: "mixed",
    content: "Sebanyak 20 siswa mengikuti remedial matematika. Rata-rata nilai mereka adalah 7. Rata-rata nilai siswa laki-laki adalah 6 dan rata-rata nilai siswa perempuan adalah 8,5.",
    parts: [
      { label: "a.", text: "Misalkan banyak siswa laki-laki = L. Tuliskan persamaan jumlah nilai seluruh siswa!" },
      { label: "b.", math: "6L + 8{,}5(20-L) = 7 \\times 20 \\Rightarrow 170-2{,}5L = 140 \\Rightarrow L = \\ldots" },
      { label: "c.", text: "Berapa selisih banyak siswa laki-laki dan perempuan?" },
    ],
  }),
  Qn(27, "Banyak Siswa di Atas Rata-Rata – UN", {
    type: "mixed",
    diagram: (() => (
      <svg width="300" height="115" viewBox="0 0 300 115" className="mx-auto">
        <rect x="4" y="4" width="292" height="107" rx="10" fill="#1e3a5f" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="150" y="18" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Tabel Nilai Ulangan Harian</text>
        <rect x="10" y="23" width="280" height="16" rx="3" fill="#1d4ed8" fillOpacity="0.35"/>
        <text x="80" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Nilai</text>
        <text x="130" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">3</text>
        <text x="157" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">4</text>
        <text x="184" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">5</text>
        <text x="211" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">6</text>
        <text x="238" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">7</text>
        <text x="262" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">8</text>
        <text x="284" y="34" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">9</text>
        <rect x="10" y="39" width="280" height="16" fill="#1e3a5f" fillOpacity="0.25"/>
        <text x="80" y="50" fill="#bfdbfe" fontSize="8" textAnchor="middle">Frekuensi</text>
        {[["130","2"],["157","3"],["184","4"],["211","5"],["238","3"],["262","2"],["284","1"]].map(([cx,f],i) => (
          <text key={i} x={Number(cx)} y="50" fill="#60a5fa" fontSize="8" textAnchor="middle">{f}</text>
        ))}
        <rect x="10" y="55" width="280" height="14" fill="#1d4ed8" fillOpacity="0.2"/>
        <text x="150" y="65" fill="#94a3b8" fontSize="7" textAnchor="middle">n = 20 siswa</text>
        <text x="150" y="85" fill="#fbbf24" fontSize="8" textAnchor="middle" fontWeight="bold">Σfᵢxᵢ = 3(2)+4(3)+5(4)+6(5)+7(3)+8(2)+9(1) = 114</text>
        <text x="150" y="100" fill="#34d399" fontSize="8" textAnchor="middle">Rata-rata = 114 ÷ 20 = 5,7</text>
      </svg>
    ))(),
    content: "Dari tabel nilai ulangan harian di atas:",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{3(2)+4(3)+5(4)+6(5)+7(3)+8(2)+9(1)}{20} = \\frac{114}{20} = \\ldots" },
      { label: "b.", text: "Siswa yang mendapat nilai lebih dari rata-rata adalah yang mendapat nilai 6, 7, 8, atau 9." },
      { label: "c.", math: "n_{>\\bar{x}} = f_6+f_7+f_8+f_9 = 5+3+2+1 = \\ldots \\text{ siswa}" },
    ],
  }),
  Qn(28, "Mean dan Data Tidak Diketahui – ANBK", {
    type: "mixed",
    diagram: (() => (
      <svg width="300" height="175" viewBox="0 0 300 175" className="mx-auto">
        <rect x="4" y="4" width="292" height="167" rx="10" fill="#1e3a5f" fillOpacity="0.35" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="150" y="18" fill="#93c5fd" fontSize="9" textAnchor="middle" fontWeight="bold">Pengunjung Perpustakaan (5 Hari)</text>
        {[0,10,20,30,40,50].map((h,i) => (
          <g key={i}>
            <line x1="45" y1={145-h*2} x2="285" y2={145-h*2} stroke="#1d4ed8" strokeWidth="0.5" strokeOpacity="0.4"/>
            <text x="42" y={148-h*2} fill="#94a3b8" fontSize="7" textAnchor="end">{h}</text>
          </g>
        ))}
        {[["Sen",35,"#3b82f6"],["Sel",40,"#2563eb"],["Rab",0,"#64748b"],["Kam",50,"#1d4ed8"],["Jum",45,"#3b82f6"]].map(([day,val,color],i) => (
          <g key={i}>
            {Number(val) > 0
              ? <rect x={52+i*44} y={145-Number(val)*2} width="30" height={Number(val)*2} fill={color as string} fillOpacity="0.8" rx="3"/>
              : <>
                  <rect x={52+i*44} y={85} width="30" height={60} fill="#334155" fillOpacity="0.5" rx="3" strokeDasharray="4,3" stroke="#fbbf24" strokeWidth="1"/>
                  <text x={67+i*44} y="118" fill="#fbbf24" fontSize="11" textAnchor="middle" fontWeight="bold">?</text>
                </>
            }
            {Number(val) > 0 && <text x={67+i*44} y={140-Number(val)*2} fill="#dbeafe" fontSize="7" textAnchor="middle">{val}</text>}
            <text x={67+i*44} y="158" fill="#93c5fd" fontSize="8" textAnchor="middle">{day as string}</text>
          </g>
        ))}
        <line x1="45" y1="145" x2="285" y2="145" stroke="#3b82f6" strokeWidth="1.5"/>
        <line x1="45" y1="25" x2="45" y2="145" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="60" y="170" fill="#fbbf24" fontSize="7" textAnchor="start">Rata-rata = 41 orang/hari</text>
      </svg>
    ))(),
    content: "Diagram batang di atas menunjukkan data pengunjung perpustakaan sekolah selama 5 hari. Data hari Rabu tidak terbaca. Diketahui rata-rata pengunjung adalah 41 orang per hari.",
    parts: [
      { label: "a.", math: "\\text{Total} = 41 \\times 5 = \\ldots \\text{ orang}" },
      { label: "b.", math: "35 + 40 + R + 50 + 45 = \\ldots \\Rightarrow R = \\ldots \\text{ orang}" },
      { label: "c.", text: "Hari apa saja pengunjungnya di atas rata-rata?" },
    ],
  }),
  Qn(29, "Interpretasi Nilai Rata-Rata – TKA", {
    type: "mixed",
    content: "Sebuah kelas memiliki 25 siswi. Rata-rata tinggi badan mereka adalah 130 cm.\nPeriksa setiap pernyataan berikut: BENAR atau SALAH?",
    parts: [
      { label: "A.", text: "Jika ada siswi dengan tinggi 132 cm, maka pasti ada siswi lain yang tingginya 128 cm." },
      { label: "B.", text: "Jika 23 siswi masing-masing tingginya 130 cm dan satu siswi tingginya 133 cm, maka siswi ke-25 tingginya 127 cm." },
      { label: "C.", text: "Jika diurutkan dari terpendek ke tertinggi, siswi urutan ke-13 (tengah) pasti tingginya 130 cm." },
      { label: "D.", text: "Setengah dari siswi di kelas pasti lebih pendek dari 130 cm dan setengahnya lagi pasti lebih tinggi." },
    ],
  }),
];

const RataRataPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-500/20 border-2 border-blue-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📐</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-blue-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(96,165,250,0.7)' }}>
            UKURAN PEMUSATAN DATA
          </h1>
          <p className="text-blue-200/70 text-sm text-center font-body mb-1">Rata-Rata dan Rata-Rata Gabungan</p>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-2">
            <span className="text-blue-400 text-xs font-bold">📋 29 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-blue-900/20 border border-blue-500/20 rounded-xl p-4">
          <p className="text-blue-300 text-xs font-bold mb-3">📌 Rumus Kunci</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { name: "Rata-Rata Tunggal", math: "\\bar{x} = \\frac{\\sum x_i}{n}" },
              { name: "Rata-Rata Berbobot", math: "\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i}" },
              { name: "Rata-Rata Gabungan", math: "\\bar{x}_{gab} = \\frac{n_1\\bar{x}_1 + n_2\\bar{x}_2}{n_1+n_2}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-3">
                <div className="text-blue-400 text-[9px] uppercase font-bold min-w-[100px]">{r.name}</div>
                <div className="text-blue-200 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-slate-900/80 to-indigo-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-blue-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center shrink-0">
                    <span className="text-blue-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-blue-400 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3 whitespace-pre-line">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-blue-900/20 border border-blue-500/20 rounded-lg px-4 py-3 flex justify-center overflow-x-auto"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3 overflow-x-auto">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-blue-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-blue-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};
export default RataRataPage;
