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

const TableDataBerkelompok = () => (
  <svg width="310" height="155" viewBox="0 0 310 155" className="mx-auto">
    <rect x="4" y="4" width="302" height="147" rx="10" fill="#1e3a5f" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1.5" />
    <text x="155" y="20" fill="#93c5fd" fontSize="10" textAnchor="middle" fontWeight="bold">Data Berkelompok – Rata-Rata</text>
    <rect x="10" y="25" width="282" height="18" rx="3" fill="#1d4ed8" fillOpacity="0.4" />
    <text x="50" y="37" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Kelas</text>
    <text x="100" y="37" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">fᵢ</text>
    <text x="155" y="37" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">xᵢ (titik tengah)</text>
    <text x="255" y="37" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">fᵢ · xᵢ</text>
    {[
      ["50–59","4","54,5","218"],
      ["60–69","8","64,5","516"],
      ["70–79","14","74,5","1043"],
      ["80–89","10","84,5","845"],
      ["90–99","4","94,5","378"],
    ].map(([kls, fi, xi, fixi], i) => (
      <g key={i}>
        <rect x="10" y={44+i*20} width="282" height="19" fill={i%2===0?"#1e3a5f":"transparent"} fillOpacity="0.2"/>
        <text x="50" y={57+i*20} fill="#bfdbfe" fontSize="8" textAnchor="middle">{kls}</text>
        <text x="100" y={57+i*20} fill="#bfdbfe" fontSize="8" textAnchor="middle">{fi}</text>
        <text x="155" y={57+i*20} fill="#60a5fa" fontSize="8" textAnchor="middle">{xi}</text>
        <text x="255" y={57+i*20} fill="#34d399" fontSize="8" textAnchor="middle">{fixi}</text>
      </g>
    ))}
    <text x="100" y="148" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Σf=40</text>
    <text x="255" y="148" fill="#93c5fd" fontSize="8" textAnchor="middle" fontWeight="bold">Σfx=3000</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Rata-Rata Data Tunggal – UN", {
    type: "mixed",
    mathContent: "\\bar{x} = \\frac{x_1 + x_2 + \\ldots + x_n}{n} = \\frac{\\sum x_i}{n}",
    content: "Hitung rata-rata dari data berikut:",
    parts: [
      { label: "a.", math: "\\text{Data: } 6, 7, 8, 9, 10. \\quad \\bar{x} = \\frac{6+7+8+9+10}{5} = \\ldots" },
      { label: "b.", math: "\\text{Data: } 75, 80, 65, 90, 85, 70. \\quad \\bar{x} = \\ldots" },
      { label: "c.", math: "\\text{Data: } 4, 4, 5, 6, 7, 8, 8. \\quad \\bar{x} = \\ldots" },
    ],
  }),
  Qn(2, "Rata-Rata dari Tabel – ANBK", {
    type: "mixed",
    diagram: <TableRataRata />,
    content: "Dari tabel distribusi nilai siswa di atas:",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i} = \\frac{2350}{30} = \\ldots" },
      { label: "b.", text: "Berapa jumlah seluruh siswa?" },
      { label: "c.", text: "Nilai berapa yang memiliki frekuensi terbesar?" },
    ],
  }),
  Qn(3, "Menentukan Nilai Hilang – UN", {
    type: "mixed",
    content: "Rata-rata nilai 5 siswa adalah 78. Empat nilai diketahui: 75, 82, 70, 88.",
    parts: [
      { label: "a.", math: "\\text{Jumlah} = \\bar{x} \\times n = 78 \\times 5 = \\ldots" },
      { label: "b.", math: "\\text{Nilai ke-5} = 390 - (75+82+70+88) = 390 - 315 = \\ldots" },
      { label: "c.", text: "Apakah nilai ke-5 di atas atau di bawah rata-rata?" },
    ],
  }),
  Qn(4, "Rata-Rata Data Berbobot – TKA", {
    type: "mixed",
    mathContent: "\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i}",
    content: "Nilai ujian: 6 (frekuensi 3), 7 (frekuensi 8), 8 (frekuensi 12), 9 (frekuensi 7).",
    parts: [
      { label: "a.", math: "\\sum f_i x_i = 6(3) + 7(8) + 8(12) + 9(7) = \\ldots" },
      { label: "b.", math: "\\sum f_i = 3+8+12+7 = \\ldots" },
      { label: "c.", math: "\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i} = \\ldots" },
    ],
  }),
  Qn(5, "Rata-Rata Data Berkelompok – UN", {
    type: "mixed",
    diagram: <TableDataBerkelompok />,
    content: "Dari tabel distribusi frekuensi di atas, hitunglah rata-rata data berkelompok:",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i} = \\frac{3000}{40} = \\ldots" },
      { label: "b.", text: "Apakah rata-rata ini pasti sama dengan rata-rata data aslinya? Jelaskan." },
      { label: "c.", text: "Mengapa kita menggunakan titik tengah kelas pada data berkelompok?" },
    ],
  }),
  Qn(6, "Rata-Rata Gabungan Dua Kelompok – ANBK", {
    type: "mixed",
    diagram: <RataRataGabunganDiagram />,
    content: "Kelas A: 30 siswa, rata-rata 75. Kelas B: 25 siswa, rata-rata 80.",
    parts: [
      { label: "a.", math: "\\bar{x}_{\\text{gab}} = \\frac{n_1 \\bar{x}_1 + n_2 \\bar{x}_2}{n_1 + n_2} = \\frac{30(75) + 25(80)}{30+25}" },
      { label: "b.", math: "= \\frac{2250 + 2000}{55} = \\frac{4250}{55} = \\ldots" },
      { label: "c.", text: "Apakah rata-rata gabungan selalu berada di antara kedua rata-rata? Jelaskan." },
    ],
  }),
  Qn(7, "Rata-Rata Gabungan Tiga Kelompok – UN", {
    type: "mixed",
    mathContent: "\\bar{x}_{\\text{gab}} = \\frac{n_1 \\bar{x}_1 + n_2 \\bar{x}_2 + n_3 \\bar{x}_3}{n_1+n_2+n_3}",
    content: "Kelas 9A (35 siswa, x̄=72), 9B (30 siswa, x̄=78), 9C (25 siswa, x̄=80).",
    parts: [
      { label: "a.", math: "n_1 \\bar{x}_1 + n_2 \\bar{x}_2 + n_3 \\bar{x}_3 = 35(72)+30(78)+25(80) = \\ldots" },
      { label: "b.", math: "n_1+n_2+n_3 = 35+30+25 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{gab}} = \\frac{\\ldots}{\\ldots} = \\ldots" },
    ],
  }),
  Qn(8, "Menentukan n dari Rata-Rata – TKA", {
    type: "mixed",
    content: "Rata-rata dari n bilangan adalah 15. Jika ditambah satu bilangan baru yaitu 21, rata-ratanya menjadi 16.",
    parts: [
      { label: "a.", math: "\\text{Total awal} = 15n, \\quad \\text{Total baru} = 15n + 21" },
      { label: "b.", math: "\\frac{15n+21}{n+1} = 16 \\Rightarrow 15n+21 = 16n+16 \\Rightarrow n = \\ldots" },
      { label: "c.", text: "Verifikasi jawabanmu." },
    ],
  }),
  Qn(9, "Pengaruh Penambahan Data – ANBK", {
    type: "mixed",
    content: "Rata-rata nilai 10 siswa adalah 70. Ditambahkan 2 siswa dengan nilai 80 dan 90.",
    parts: [
      { label: "a.", math: "\\text{Total nilai awal} = 70 \\times 10 = \\ldots" },
      { label: "b.", math: "\\text{Total nilai baru} = 700 + 80 + 90 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{baru}} = \\frac{870}{12} = \\ldots" },
    ],
  }),
  Qn(10, "Rata-Rata Nilai UN – UN", {
    type: "mixed",
    content: "Nilai ujian nasional 5 mata pelajaran: Matematika 82, IPA 78, B.Indonesia 85, B.Inggris 80, IPS 75.",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{82+78+85+80+75}{5} = \\ldots" },
      { label: "b.", text: "Mata pelajaran apa yang nilainya di atas rata-rata?" },
      { label: "c.", text: "Berapa poin selisih nilai Matematika dengan rata-rata?" },
    ],
  }),
  Qn(11, "Rata-Rata Berbobot (Nilai Akhir) – TKA", {
    type: "mixed",
    mathContent: "\\text{NA} = \\frac{40\\% \\cdot UH + 30\\% \\cdot UTS + 30\\% \\cdot UAS}{100\\%}",
    content: "Bobot: UH=40%, UTS=30%, UAS=30%. Nilai: UH=80, UTS=75, UAS=85.",
    parts: [
      { label: "a.", math: "NA = 0{,}4(80) + 0{,}3(75) + 0{,}3(85)" },
      { label: "b.", math: "= 32 + 22{,}5 + 25{,}5 = \\ldots" },
      { label: "c.", text: "Apakah nilai akhir ini sudah tuntas jika KKM = 75?" },
    ],
  }),
  Qn(12, "Rata-Rata Titik Tengah – ANBK", {
    type: "mixed",
    content: "Tabel: 40–49 (f=5, x=44,5), 50–59 (f=10, x=54,5), 60–69 (f=20, x=64,5), 70–79 (f=15, x=74,5).",
    parts: [
      { label: "a.", math: "\\sum f_i x_i = 5(44{,}5)+10(54{,}5)+20(64{,}5)+15(74{,}5) = \\ldots" },
      { label: "b.", math: "\\sum f_i = 5+10+20+15 = \\ldots" },
      { label: "c.", math: "\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i} = \\ldots" },
    ],
  }),
  Qn(13, "Soal Cerita Rata-Rata – UN", {
    type: "mixed",
    content: "Seorang pedagang mencatat pendapatannya selama 6 hari: Rp120.000, Rp150.000, Rp130.000, Rp160.000, Rp140.000, Rp130.000.",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{120+150+130+160+140+130}{6} \\times 1000 = \\ldots" },
      { label: "b.", text: "Pada hari berapa saja pendapatan di atas rata-rata?" },
      { label: "c.", text: "Berapa total pendapatan dalam 6 hari tersebut?" },
    ],
  }),
  Qn(14, "Rata-Rata dan Jumlah Data – TKA", {
    type: "mixed",
    content: "Diketahui rata-rata dari 8 bilangan adalah 12,5. Jika 2 bilangan dihapus yaitu 10 dan 15.",
    parts: [
      { label: "a.", math: "\\text{Jumlah awal} = 12{,}5 \\times 8 = \\ldots" },
      { label: "b.", math: "\\text{Jumlah setelah hapus} = 100 - 10 - 15 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{baru}} = \\frac{75}{6} = \\ldots" },
    ],
  }),
  Qn(15, "Soal Cerita Rata-Rata Gabungan – ANBK", {
    type: "mixed",
    content: "Nilai rata-rata ujian matematika: Kelas 9A (40 siswa) = 74 dan Kelas 9B (36 siswa) = 79.",
    parts: [
      { label: "a.", math: "\\bar{x}_{\\text{gab}} = \\frac{40(74)+36(79)}{40+36} = \\frac{2960+2844}{76} = \\ldots" },
      { label: "b.", text: "Kelas mana yang nilai rata-ratanya lebih tinggi?" },
      { label: "c.", text: "Apakah rata-rata gabungan = (74+79)/2? Mengapa?" },
    ],
  }),
  Qn(16, "Rata-Rata Berubah karena Koreksi – UN", {
    type: "mixed",
    content: "Rata-rata nilai 20 siswa adalah 75. Ternyata nilai seorang siswa yang dicatat 60 seharusnya 80.",
    parts: [
      { label: "a.", math: "\\text{Total awal} = 75 \\times 20 = \\ldots" },
      { label: "b.", math: "\\text{Total setelah koreksi} = 1500 - 60 + 80 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{baru}} = \\frac{1520}{20} = \\ldots" },
    ],
  }),
  Qn(17, "Rata-Rata Tinggi Badan – TKA", {
    type: "mixed",
    content: "Tinggi badan 12 siswa (cm): 155, 160, 158, 162, 157, 165, 163, 159, 161, 156, 164, 160.",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{155+160+158+162+157+165+163+159+161+156+164+160}{12} = \\ldots" },
      { label: "b.", text: "Berapa siswa yang tingginya di atas rata-rata?" },
      { label: "c.", text: "Berapa siswa yang tingginya sama dengan rata-rata?" },
    ],
  }),
  Qn(18, "Rata-Rata Data Berkelompok – ANBK", {
    type: "mixed",
    content: "Data nilai IPA: 61–65 (f=3,x=63), 66–70 (f=7,x=68), 71–75 (f=15,x=73), 76–80 (f=10,x=78), 81–85 (f=5,x=83).",
    parts: [
      { label: "a.", math: "\\sum f_i x_i = 3(63)+7(68)+15(73)+10(78)+5(83) = \\ldots" },
      { label: "b.", math: "\\sum f_i = 3+7+15+10+5 = \\ldots" },
      { label: "c.", math: "\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i} = \\ldots" },
    ],
  }),
  Qn(19, "Menentukan Frekuensi dari Rata-Rata – UN", {
    type: "mixed",
    content: "Nilai (frekuensi): 60 (2), 70 (f₂), 80 (8), 90 (4). Rata-rata = 77.",
    parts: [
      { label: "a.", math: "\\text{Total} = 77 \\times (2+f_2+8+4) = 77(14+f_2)" },
      { label: "b.", math: "\\sum f_i x_i = 60(2)+70f_2+80(8)+90(4) = 120+70f_2+640+360 = 1120+70f_2" },
      { label: "c.", math: "77(14+f_2) = 1120+70f_2 \\Rightarrow 1078+77f_2 = 1120+70f_2 \\Rightarrow f_2 = \\ldots" },
    ],
  }),
  Qn(20, "Soal Cerita – Rata-Rata Produksi – TKA", {
    type: "mixed",
    content: "Produksi padi per hari selama 5 hari: 120, 135, 118, 142, 125 kg.",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{120+135+118+142+125}{5} = \\ldots \\text{ kg}" },
      { label: "b.", text: "Hari berapa saja produksi di atas rata-rata?" },
      { label: "c.", text: "Berapa kg total produksi selama 5 hari?" },
    ],
  }),
  Qn(21, "Rata-Rata Gabungan 3 Kelas – ANBK", {
    type: "mixed",
    mathContent: "\\bar{x}_{\\text{gab}} = \\frac{\\sum n_i \\bar{x}_i}{\\sum n_i}",
    content: "Kelas 9A: 32 siswa (x̄=76), 9B: 28 siswa (x̄=82), 9C: 30 siswa (x̄=79).",
    parts: [
      { label: "a.", math: "\\sum n_i \\bar{x}_i = 32(76)+28(82)+30(79) = \\ldots" },
      { label: "b.", math: "\\sum n_i = 32+28+30 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{gab}} = \\ldots" },
    ],
  }),
  Qn(22, "Rata-Rata Nilai Akhir Semester – UN", {
    type: "mixed",
    content: "Nilai rapor 6 mata pelajaran: 80, 75, 90, 85, 70, 88.",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{80+75+90+85+70+88}{6} = \\frac{488}{6} = \\ldots" },
      { label: "b.", text: "Berapa mata pelajaran yang nilainya di atas rata-rata?" },
      { label: "c.", text: "Jika nilai IPA yang 70 dikoreksi menjadi 78, berapa rata-rata baru?" },
    ],
  }),
  Qn(23, "Rata-Rata dan Nilai Maksimum – TKA", {
    type: "mixed",
    content: "Dari 7 ujian, seorang siswa mendapat rata-rata 82. Diketahui 6 nilainya: 78, 85, 80, 90, 76, 88.",
    parts: [
      { label: "a.", math: "\\text{Jumlah} = 82 \\times 7 = \\ldots" },
      { label: "b.", math: "\\text{Nilai ke-7} = 574 - (78+85+80+90+76+88) = \\ldots" },
      { label: "c.", text: "Apakah nilai ke-7 memungkinkan (antara 0–100)?" },
    ],
  }),
  Qn(24, "Pemahaman Rata-Rata – ANBK", {
    type: "mixed",
    content: "Rata-rata gaji 5 karyawan adalah Rp3.000.000. Jika seorang manajer dengan gaji Rp8.000.000 bergabung:",
    parts: [
      { label: "a.", math: "\\text{Total gaji awal} = 3.000.000 \\times 5 = \\ldots" },
      { label: "b.", math: "\\text{Rata-rata baru} = \\frac{15.000.000 + 8.000.000}{6} = \\ldots" },
      { label: "c.", text: "Mengapa rata-rata gaji naik meskipun tidak semua karyawan naik gaji?" },
    ],
  }),
  Qn(25, "Nilai yang Harus Dicapai – UN", {
    type: "mixed",
    content: "Dari 4 ujian, rata-rata seorang siswa adalah 75. Ia ingin rata-rata menjadi 78 setelah ujian ke-5.",
    parts: [
      { label: "a.", math: "\\text{Total saat ini} = 75 \\times 4 = \\ldots" },
      { label: "b.", math: "\\text{Total yang diinginkan} = 78 \\times 5 = \\ldots" },
      { label: "c.", math: "\\text{Nilai ujian ke-5} = 390 - 300 = \\ldots" },
    ],
  }),
  Qn(26, "Rata-Rata Berbobot Nilai Pelajaran – TKA", {
    type: "mixed",
    content: "Nilai Matematika 90 (bobot 4), IPA 80 (bobot 3), IPS 75 (bobot 2), B.Indonesia 85 (bobot 1).",
    parts: [
      { label: "a.", math: "\\sum w_i x_i = 4(90)+3(80)+2(75)+1(85) = \\ldots" },
      { label: "b.", math: "\\sum w_i = 4+3+2+1 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{terbobot}} = \\frac{\\sum w_i x_i}{\\sum w_i} = \\ldots" },
    ],
  }),
  Qn(27, "Perbandingan Mean dan Median – ANBK", {
    type: "mixed",
    content: "Data: 5, 6, 7, 8, 9, 100.",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{5+6+7+8+9+100}{6} = \\frac{135}{6} = \\ldots" },
      { label: "b.", text: "Tentukan median dari data tersebut." },
      { label: "c.", text: "Nilai mana (mean atau median) yang lebih mewakili data ini? Mengapa?" },
    ],
  }),
  Qn(28, "Rata-Rata dengan Metode Coding – UN", {
    type: "mixed",
    mathContent: "\\bar{x} = c + \\bar{d}, \\quad d_i = x_i - c",
    content: "Metode deviasi: misalkan c = 70. Data: 65, 70, 72, 68, 75.",
    parts: [
      { label: "a.", math: "d_i: -5, 0, 2, -2, 5" },
      { label: "b.", math: "\\bar{d} = \\frac{-5+0+2-2+5}{5} = \\frac{0}{5} = \\ldots" },
      { label: "c.", math: "\\bar{x} = c + \\bar{d} = 70 + 0 = \\ldots" },
    ],
  }),
  Qn(29, "Rata-Rata Gabungan Skor Tim – TKA", {
    type: "mixed",
    content: "Tim A (5 anggota, rata-rata skor 80) bertanding dengan Tim B (7 anggota, rata-rata skor 75).",
    parts: [
      { label: "a.", math: "\\text{Total skor A} = 5 \\times 80 = \\ldots" },
      { label: "b.", math: "\\text{Total skor B} = 7 \\times 75 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{gab}} = \\frac{400+525}{5+7} = \\frac{925}{12} = \\ldots" },
    ],
  }),
  Qn(30, "Rata-Rata Data Berulang – ANBK", {
    type: "mixed",
    content: "Data nilai: 7 muncul 4 kali, 8 muncul 6 kali, 9 muncul 5 kali, 10 muncul 5 kali.",
    parts: [
      { label: "a.", math: "\\sum f_i x_i = 4(7)+6(8)+5(9)+5(10) = 28+48+45+50 = \\ldots" },
      { label: "b.", math: "\\sum f_i = 4+6+5+5 = \\ldots" },
      { label: "c.", math: "\\bar{x} = \\frac{171}{20} = \\ldots" },
    ],
  }),
  Qn(31, "Aplikasi Rata-Rata dalam Kehidupan – UN", {
    type: "mixed",
    content: "Konsumsi listrik rumah tangga selama 6 bulan: 120, 135, 128, 142, 130, 125 kWh.",
    parts: [
      { label: "a.", math: "\\bar{x} = \\frac{120+135+128+142+130+125}{6} = \\ldots \\text{ kWh}" },
      { label: "b.", text: "Bulan berapa konsumsinya paling tinggi?" },
      { label: "c.", text: "Jika rata-rata target ≤ 130 kWh, apakah rumah ini hemat energi?" },
    ],
  }),
  Qn(32, "Soal UN – Rata-Rata Data Campuran", {
    type: "mixed",
    content: "Diketahui rata-rata dari 12 nilai adalah 8,5. Jika 3 nilai baru yaitu 7, 8, dan 9 ditambahkan:",
    parts: [
      { label: "a.", math: "\\text{Jumlah 12 nilai} = 8{,}5 \\times 12 = \\ldots" },
      { label: "b.", math: "\\text{Jumlah baru} = 102 + 7+8+9 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{baru}} = \\frac{126}{15} = \\ldots" },
    ],
  }),
  Qn(33, "Soal ANBK – Rata-Rata Bersyarat", {
    type: "mixed",
    content: "Dari 10 siswa, yang mendapat nilai di atas 75 ada 6 orang dengan nilai: 80, 85, 90, 78, 82, 88.",
    parts: [
      { label: "a.", math: "\\bar{x}_{\\text{atas 75}} = \\frac{80+85+90+78+82+88}{6} = \\ldots" },
      { label: "b.", text: "4 siswa sisanya mendapat rata-rata 68. Hitung rata-rata gabungan semua 10 siswa." },
      { label: "c.", math: "\\bar{x}_{\\text{gab}} = \\frac{6(\\bar{x}_1)+4(68)}{10} = \\ldots" },
    ],
  }),
  Qn(34, "Soal TKA – Rata-Rata Bergerak", {
    type: "mixed",
    content: "Harga saham selama 5 hari: 1000, 1050, 1020, 1080, 1060 (rupiah).",
    parts: [
      { label: "a.", math: "\\text{Rata-rata 3 hari pertama} = \\frac{1000+1050+1020}{3} = \\ldots" },
      { label: "b.", math: "\\text{Rata-rata hari 2-4} = \\frac{1050+1020+1080}{3} = \\ldots" },
      { label: "c.", math: "\\text{Rata-rata hari 3-5} = \\frac{1020+1080+1060}{3} = \\ldots" },
    ],
  }),
  Qn(35, "Soal UN – Rata-Rata Bertingkat", {
    type: "mixed",
    content: "Dari 3 sekolah:\n- Sekolah A: 200 siswa, rata-rata 75\n- Sekolah B: 150 siswa, rata-rata 80\n- Sekolah C: 250 siswa, rata-rata 70",
    parts: [
      { label: "a.", math: "\\sum n_i \\bar{x}_i = 200(75)+150(80)+250(70) = \\ldots" },
      { label: "b.", math: "\\sum n_i = 200+150+250 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{gab}} = \\frac{\\ldots}{\\ldots} = \\ldots" },
    ],
  }),
  Qn(36, "Soal ANBK – Mencari n", {
    type: "mixed",
    content: "Rata-rata dari n+3 data adalah 72. Rata-rata dari n data pertama adalah 68, dan 3 data tambahan nilainya 80, 85, 90.",
    parts: [
      { label: "a.", math: "72(n+3) = 68n + 80+85+90" },
      { label: "b.", math: "72n+216 = 68n+255 \\Rightarrow 4n = 39 \\Rightarrow n = \\ldots" },
      { label: "c.", text: "Apakah nilai n yang diperoleh masuk akal? Jelaskan." },
    ],
  }),
  Qn(37, "Soal TKA – Rata-Rata dengan Syarat", {
    type: "mixed",
    content: "Rata-rata 6 bilangan genap berurutan adalah 19.",
    parts: [
      { label: "a.", text: "Misalkan bilangan pertama = n. Tuliskan 6 bilangan genap berurutan tersebut." },
      { label: "b.", math: "\\frac{n+(n+2)+(n+4)+(n+6)+(n+8)+(n+10)}{6} = 19" },
      { label: "c.", math: "6n+30 = 114 \\Rightarrow n = \\ldots" },
    ],
  }),
  Qn(38, "Soal UN – Rata-Rata dalam Konteks Sains", {
    type: "mixed",
    content: "Percepatan gravitasi diukur 5 kali: 9,80; 9,81; 9,79; 9,82; 9,78 m/s².",
    parts: [
      { label: "a.", math: "\\bar{g} = \\frac{9{,}80+9{,}81+9{,}79+9{,}82+9{,}78}{5} = \\ldots \\text{ m/s}^2" },
      { label: "b.", text: "Apakah nilai rata-rata ini mendekati nilai standar g = 9,8 m/s²?" },
      { label: "c.", text: "Mengapa pengukuran berulang dilakukan dan kemudian diambil rata-ratanya?" },
    ],
  }),
  Qn(39, "Soal ANBK – Rata-Rata dan Kesalahan", {
    type: "mixed",
    content: "Rata-rata 8 bilangan adalah 45. Ternyata satu bilangan yang seharusnya 52 dicatat sebagai 25.",
    parts: [
      { label: "a.", math: "\\text{Total awal (salah)} = 45 \\times 8 = \\ldots" },
      { label: "b.", math: "\\text{Total setelah koreksi} = 360 - 25 + 52 = \\ldots" },
      { label: "c.", math: "\\bar{x}_{\\text{benar}} = \\frac{387}{8} = \\ldots" },
    ],
  }),
  Qn(40, "Soal UN/ANBK/TKA – Gabungan Rata-Rata", {
    type: "mixed",
    content: "Dua kelas mengikuti kompetisi matematika:\nKelas 9A: 30 siswa, nilai rata-rata 82\nKelas 9B: 20 siswa, nilai rata-rata 77\nKemudian ditambah kelompok baru: 10 siswa, nilai rata-rata 90.",
    parts: [
      { label: "a.", math: "\\bar{x}_{\\text{gab A+B}} = \\frac{30(82)+20(77)}{50} = \\frac{2460+1540}{50} = \\ldots" },
      { label: "b.", math: "\\bar{x}_{\\text{gab semua}} = \\frac{50(\\bar{x}_{AB})+10(90)}{60} = \\ldots" },
      { label: "c.", text: "Apakah penambahan 10 siswa dengan rata-rata 90 menaikkan rata-rata keseluruhan? Jelaskan." },
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
            <span className="text-blue-400 text-xs font-bold">📋 40 Soal</span>
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
