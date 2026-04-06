import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const TableJenisData = () => (
  <svg width="320" height="150" viewBox="0 0 320 150" className="mx-auto">
    <rect x="4" y="4" width="312" height="142" rx="10" fill="#0e7490" fillOpacity="0.12" stroke="#22d3ee" strokeWidth="1.5" />
    <rect x="10" y="10" width="300" height="26" rx="6" fill="#22d3ee" fillOpacity="0.25" />
    <text x="60" y="27" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Jenis Data</text>
    <text x="190" y="27" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Contoh</text>
    <text x="275" y="27" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Skala</text>
    <line x1="10" y1="36" x2="310" y2="36" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.4" />
    {[
      ["Data Kualitatif", "Warna, Nama", "Nominal"],
      ["Data Ordinal", "Peringkat, Nilai Huruf", "Ordinal"],
      ["Data Diskrit", "Jumlah Siswa", "Rasio"],
      ["Data Kontinu", "Tinggi, Berat Badan", "Interval"],
    ].map(([jenis, contoh, skala], i) => (
      <g key={i}>
        <rect x="10" y={38 + i * 26} width="300" height="25" fill={i % 2 === 0 ? "#0e7490" : "transparent"} fillOpacity="0.1" />
        <text x="60" y={53 + i * 26} fill="#a5f3fc" fontSize="9" textAnchor="middle">{jenis}</text>
        <text x="190" y={53 + i * 26} fill="#e0f2fe" fontSize="9" textAnchor="middle">{contoh}</text>
        <text x="275" y={53 + i * 26} fill="#7dd3fc" fontSize="9" textAnchor="middle">{skala}</text>
      </g>
    ))}
  </svg>
);

const TeknikSamplingDiagram = () => (
  <svg width="320" height="160" viewBox="0 0 320 160" className="mx-auto">
    <rect x="4" y="4" width="312" height="152" rx="10" fill="#0e7490" fillOpacity="0.12" stroke="#22d3ee" strokeWidth="1.5" />
    <text x="160" y="22" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Teknik Pengambilan Sampel</text>
    <rect x="120" y="28" width="80" height="22" rx="4" fill="#0891b2" fillOpacity="0.4" stroke="#22d3ee" strokeWidth="1" />
    <text x="160" y="43" fill="#e0f2fe" fontSize="9" textAnchor="middle">Populasi</text>
    <line x1="80" y1="56" x2="160" y2="50" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.5" />
    <line x1="160" y1="50" x2="240" y2="56" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.5" />
    <line x1="160" y1="50" x2="160" y2="62" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.5" />
    {[
      [20, 62, "Acak\nSederhana"],
      [120, 62, "Sistematis"],
      [220, 62, "Stratifikasi"],
    ].map(([x, y, label], i) => (
      <g key={i}>
        <rect x={Number(x) - 35} y={Number(y)} width="70" height="24" rx="4" fill="#164e63" stroke="#0891b2" strokeWidth="0.8" />
        <text x={Number(x)} y={Number(y) + 10} fill="#a5f3fc" fontSize="8" textAnchor="middle">{String(label).split("\n")[0]}</text>
        <text x={Number(x)} y={Number(y) + 20} fill="#a5f3fc" fontSize="8" textAnchor="middle">{String(label).split("\n")[1] || ""}</text>
      </g>
    ))}
    <text x="160" y="105" fill="#94a3b8" fontSize="8" textAnchor="middle">Purposive · Cluster · Quota Sampling</text>
    <rect x="30" y="115" width="260" height="34" rx="6" fill="#164e63" stroke="#0891b2" strokeWidth="0.8" />
    <text x="160" y="127" fill="#7dd3fc" fontSize="8" textAnchor="middle" fontWeight="bold">Rumus Slovin:</text>
    <text x="160" y="143" fill="#e0f2fe" fontSize="10" textAnchor="middle">n = N / (1 + N·e²)</text>
  </svg>
);

const TablePopulasiSampel = () => (
  <svg width="300" height="130" viewBox="0 0 300 130" className="mx-auto">
    <rect x="4" y="4" width="292" height="122" rx="10" fill="#0e7490" fillOpacity="0.12" stroke="#22d3ee" strokeWidth="1.5" />
    <text x="150" y="20" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Populasi vs Sampel</text>
    <rect x="10" y="25" width="136" height="18" rx="4" fill="#0891b2" fillOpacity="0.3" />
    <rect x="154" y="25" width="136" height="18" rx="4" fill="#0891b2" fillOpacity="0.3" />
    <text x="78" y="38" fill="#22d3ee" fontSize="9" textAnchor="middle" fontWeight="bold">Populasi</text>
    <text x="222" y="38" fill="#22d3ee" fontSize="9" textAnchor="middle" fontWeight="bold">Sampel</text>
    {[
      ["Seluruh objek", "Sebagian objek"],
      ["Parameter (μ, σ)", "Statistik (x̄, s)"],
      ["Sensus (lengkap)", "Survei (efisien)"],
      ["Lebih akurat", "Lebih hemat"],
    ].map(([pop, samp], i) => (
      <g key={i}>
        <text x="78" y={54 + i * 18} fill="#a5f3fc" fontSize="8" textAnchor="middle">{pop}</text>
        <line x1="148" y1={45 + i * 18} x2="148" y2={61 + i * 18} stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.4" />
        <text x="222" y={54 + i * 18} fill="#e0f2fe" fontSize="8" textAnchor="middle">{samp}</text>
      </g>
    ))}
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pengertian Statistika – UN", {
    type: "mixed",
    content: "Statistika adalah ilmu yang mempelajari cara mengumpulkan, menyajikan, menganalisis, dan menarik kesimpulan dari data.",
    parts: [
      { label: "a.", text: "Jelaskan perbedaan antara statistika deskriptif dan statistika inferensial." },
      { label: "b.", text: "Berikan masing-masing satu contoh penggunaan statistika dalam kehidupan nyata." },
      { label: "c.", text: "Mengapa statistika penting dalam pengambilan keputusan?" },
    ],
  }),
  Qn(2, "Populasi dan Sampel – ANBK", {
    type: "mixed",
    diagram: <TablePopulasiSampel />,
    content: "Di sebuah sekolah terdapat 800 siswa. Peneliti ingin mengetahui rata-rata tinggi badan siswa.",
    parts: [
      { label: "a.", text: "Tentukan populasi dari penelitian tersebut." },
      { label: "b.", text: "Jika diambil sampel 80 siswa, berapa persen sampel dari populasi?" },
      { label: "c.", math: "\\text{Dengan rumus Slovin } n = \\frac{N}{1+Ne^2}, \\text{ jika } e=10\\%, \\text{ tentukan } n" },
    ],
  }),
  Qn(3, "Jenis-Jenis Data – UN", {
    type: "mixed",
    diagram: <TableJenisData />,
    content: "Klasifikasikan data berikut berdasarkan jenisnya:",
    parts: [
      { label: "a.", text: "Jumlah siswa dalam kelas (diskrit / kontinu?)" },
      { label: "b.", text: "Berat badan siswa (diskrit / kontinu?)" },
      { label: "c.", text: "Peringkat ujian: sangat baik, baik, cukup, kurang (data apa?)" },
    ],
  }),
  Qn(4, "Data Primer dan Sekunder – TKA", {
    type: "mixed",
    content: "Tentukan apakah data berikut termasuk data primer atau data sekunder:",
    parts: [
      { label: "a.", text: "Hasil kuesioner yang disebarkan langsung kepada responden." },
      { label: "b.", text: "Data Badan Pusat Statistik (BPS) tentang jumlah penduduk." },
      { label: "c.", text: "Wawancara langsung dengan narasumber." },
    ],
  }),
  Qn(5, "Teknik Pengumpulan Data – ANBK", {
    type: "mixed",
    diagram: <TeknikSamplingDiagram />,
    content: "Sebutkan dan jelaskan 4 teknik pengumpulan data:",
    parts: [
      { label: "a.", text: "Observasi: pengamatan langsung terhadap objek penelitian." },
      { label: "b.", text: "Wawancara: pengumpulan data melalui tanya jawab." },
      { label: "c.", text: "Angket/kuesioner: daftar pertanyaan tertulis yang dikirim kepada responden." },
    ],
  }),
  Qn(6, "Sensus vs Sampling – UN", {
    type: "mixed",
    content: "Suatu kota memiliki 500.000 penduduk. Pemerintah ingin mengetahui tingkat pendidikan warganya.",
    parts: [
      { label: "a.", text: "Apa keuntungan menggunakan metode sensus dalam penelitian ini?" },
      { label: "b.", text: "Apa keuntungan menggunakan metode sampling?" },
      { label: "c.", text: "Metode mana yang lebih praktis? Jelaskan alasanmu." },
    ],
  }),
  Qn(7, "Teknik Sampling Acak Sederhana – TKA", {
    type: "mixed",
    content: "Dalam kelas 9A terdapat 30 siswa. Akan dipilih 6 siswa sebagai sampel secara acak.",
    parts: [
      { label: "a.", text: "Jelaskan cara melakukan sampling acak sederhana dengan undian." },
      { label: "b.", math: "\\text{Berapa peluang setiap siswa terpilih? } P = \\frac{6}{30} = \\ldots" },
      { label: "c.", text: "Apa kelebihan metode acak sederhana?" },
    ],
  }),
  Qn(8, "Sampling Sistematis – ANBK", {
    type: "mixed",
    content: "Dari 120 anggota koperasi akan diambil 12 orang sampel secara sistematis.",
    parts: [
      { label: "a.", math: "\\text{Interval sampling: } k = \\frac{N}{n} = \\frac{120}{12} = \\ldots" },
      { label: "b.", text: "Jika nomor pertama yang dipilih adalah 5, sebutkan nomor sampel berikutnya (3 nomor)." },
      { label: "c.", text: "Kapan sampling sistematis lebih baik dari sampling acak sederhana?" },
    ],
  }),
  Qn(9, "Sampling Stratifikasi – UN", {
    type: "mixed",
    content: "Sebuah sekolah terdiri dari 200 siswa kelas 7, 150 siswa kelas 8, dan 150 siswa kelas 9. Akan diambil 50 sampel secara proporsional.",
    parts: [
      { label: "a.", math: "\\text{Sampel kelas 7: } \\frac{200}{500} \\times 50 = \\ldots \\text{ siswa}" },
      { label: "b.", math: "\\text{Sampel kelas 8: } \\frac{150}{500} \\times 50 = \\ldots \\text{ siswa}" },
      { label: "c.", math: "\\text{Sampel kelas 9: } \\frac{150}{500} \\times 50 = \\ldots \\text{ siswa}" },
    ],
  }),
  Qn(10, "Membuat Tabel Frekuensi – UN", {
    type: "mixed",
    content: "Data nilai ulangan 20 siswa: 65, 70, 75, 80, 65, 75, 80, 90, 70, 65, 80, 75, 90, 65, 70, 80, 75, 90, 70, 65",
    parts: [
      { label: "a.", text: "Urutkan data tersebut dari terkecil ke terbesar." },
      { label: "b.", text: "Buat tabel frekuensi dari data di atas." },
      { label: "c.", text: "Nilai berapa yang paling sering muncul?" },
    ],
  }),
  Qn(11, "Rentang Data – TKA", {
    type: "mixed",
    content: "Data tinggi badan 10 siswa (cm): 145, 150, 148, 162, 155, 158, 145, 160, 155, 150",
    parts: [
      { label: "a.", math: "\\text{Rentang} = \\text{data terbesar} - \\text{data terkecil} = \\ldots" },
      { label: "b.", text: "Tentukan nilai minimum dan maksimum data tersebut." },
      { label: "c.", text: "Berapa banyak data yang berada di atas 155 cm?" },
    ],
  }),
  Qn(12, "Tabel Frekuensi Bergolong – UN", {
    type: "mixed",
    content: "Data berat badan 30 siswa (kg): nilai terkecil 40 kg, terbesar 69 kg. Buat tabel dengan 6 kelas interval.",
    parts: [
      { label: "a.", math: "\\text{Panjang interval: } \\frac{69-40}{6} = \\frac{29}{6} \\approx 5" },
      { label: "b.", text: "Tentukan batas-batas kelas: 40–44, 45–49, 50–54, 55–59, 60–64, 65–69" },
      { label: "c.", text: "Apa yang dimaksud dengan batas bawah dan batas atas kelas?" },
    ],
  }),
  Qn(13, "Titik Tengah Kelas – ANBK", {
    type: "mixed",
    mathContent: "\\text{Titik tengah} = \\frac{\\text{batas bawah} + \\text{batas atas}}{2}",
    content: "Tentukan titik tengah dari masing-masing kelas berikut:",
    parts: [
      { label: "a.", math: "\\text{Kelas } 40-49: \\frac{40+49}{2} = \\ldots" },
      { label: "b.", math: "\\text{Kelas } 50-59: \\frac{50+59}{2} = \\ldots" },
      { label: "c.", math: "\\text{Kelas } 60-69: \\frac{60+69}{2} = \\ldots" },
    ],
  }),
  Qn(14, "Frekuensi Relatif – UN", {
    type: "mixed",
    mathContent: "f_r = \\frac{f_i}{n} \\times 100\\%",
    content: "Dari 40 data, suatu kelas memiliki frekuensi sebagai berikut: 8, 12, 10, 6, 4",
    parts: [
      { label: "a.", math: "f_r \\text{ kelas pertama} = \\frac{8}{40} \\times 100\\% = \\ldots \\%" },
      { label: "b.", math: "f_r \\text{ kelas kedua} = \\frac{12}{40} \\times 100\\% = \\ldots \\%" },
      { label: "c.", text: "Verifikasi bahwa jumlah semua frekuensi relatif = 100%." },
    ],
  }),
  Qn(15, "Frekuensi Kumulatif – TKA", {
    type: "mixed",
    content: "Data nilai (frekuensi): 60–69 (5), 70–79 (10), 80–89 (12), 90–99 (3). Hitung frekuensi kumulatif.",
    parts: [
      { label: "a.", text: "F.kum s/d 69 = 5" },
      { label: "b.", text: "F.kum s/d 79 = 5 + 10 = ?" },
      { label: "c.", text: "F.kum s/d 89 = ?" },
    ],
  }),
  Qn(16, "Menentukan Banyak Kelas – ANBK", {
    type: "mixed",
    mathContent: "k = 1 + 3{,}322 \\log n \\quad \\text{(Aturan Sturges)}",
    content: "Tentukan banyak kelas yang ideal untuk data berikut:",
    parts: [
      { label: "a.", math: "n = 30: k = 1 + 3{,}322 \\log 30 = 1 + 3{,}322 \\times 1{,}477 = \\ldots" },
      { label: "b.", math: "n = 50: k = 1 + 3{,}322 \\log 50 = \\ldots" },
      { label: "c.", math: "n = 100: k = 1 + 3{,}322 \\log 100 = \\ldots" },
    ],
  }),
  Qn(17, "Pengertian Variabel – UN", {
    type: "mixed",
    content: "Jelaskan konsep variabel dalam statistika:",
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan variabel bebas (independen)?" },
      { label: "b.", text: "Apa yang dimaksud dengan variabel terikat (dependen)?" },
      { label: "c.", text: "Dalam penelitian 'pengaruh jam belajar terhadap nilai ujian', identifikasikan variabel bebas dan variabel terikatnya." },
    ],
  }),
  Qn(18, "Skala Pengukuran – TKA", {
    type: "mixed",
    content: "Tentukan skala pengukuran dari variabel-variabel berikut:",
    parts: [
      { label: "a.", text: "Jenis kelamin (Laki-laki/Perempuan) → Skala apa?" },
      { label: "b.", text: "Suhu dalam derajat Celcius → Skala apa?" },
      { label: "c.", text: "Peringkat kelas (1, 2, 3, dst.) → Skala apa?" },
    ],
  }),
  Qn(19, "Menyusun Data Tunggal – ANBK", {
    type: "mixed",
    content: "Nilai ulangan matematika 15 siswa: 7, 8, 6, 9, 7, 8, 10, 6, 7, 9, 8, 7, 6, 8, 9",
    parts: [
      { label: "a.", text: "Urutkan data dari kecil ke besar." },
      { label: "b.", text: "Buat tabel distribusi frekuensi tunggal." },
      { label: "c.", text: "Nilai berapa yang memiliki frekuensi terbanyak?" },
    ],
  }),
  Qn(20, "Pengumpulan Data dengan Observasi – UN", {
    type: "mixed",
    content: "Peneliti ingin mengumpulkan data jumlah kendaraan yang melintas di suatu jalan dalam 1 jam.",
    parts: [
      { label: "a.", text: "Teknik pengumpulan data apa yang paling tepat? Jelaskan." },
      { label: "b.", text: "Bagaimana cara mencatat data agar akurat?" },
      { label: "c.", text: "Apa kelemahan metode observasi langsung?" },
    ],
  }),
  Qn(21, "Data Berkelompok – ANBK", {
    type: "mixed",
    content: "Dari 40 siswa, nilai ulangan dikelompokkan: 50–59 (4 siswa), 60–69 (8 siswa), 70–79 (14 siswa), 80–89 (10 siswa), 90–99 (4 siswa).",
    parts: [
      { label: "a.", text: "Berapa persen siswa yang mendapat nilai 70 ke atas?" },
      { label: "b.", math: "\\frac{14+10+4}{40} \\times 100\\% = \\ldots \\%" },
      { label: "c.", text: "Kelas mana yang memiliki frekuensi tertinggi?" },
    ],
  }),
  Qn(22, "Panjang Kelas Interval – UN", {
    type: "mixed",
    mathContent: "p = \\frac{\\text{rentang}}{k} = \\frac{x_{\\max} - x_{\\min}}{k}",
    content: "Tentukan panjang kelas interval untuk data berikut:",
    parts: [
      { label: "a.", math: "x_{\\max}=95, x_{\\min}=45, k=5: p = \\frac{95-45}{5} = \\ldots" },
      { label: "b.", math: "x_{\\max}=100, x_{\\min}=40, k=6: p = \\frac{100-40}{6} = \\ldots" },
      { label: "c.", math: "x_{\\max}=80, x_{\\min}=20, k=6: p = \\ldots" },
    ],
  }),
  Qn(23, "Membaca Tabel Distribusi – TKA", {
    type: "mixed",
    content: "Tabel distribusi frekuensi tinggi badan siswa:\nKelas: 150–154 (f=3), 155–159 (f=7), 160–164 (f=12), 165–169 (f=8), 170–174 (f=5). Total = 35.",
    parts: [
      { label: "a.", text: "Berapa banyak siswa yang tingginya kurang dari 160 cm?" },
      { label: "b.", text: "Berapa persen siswa yang tingginya antara 160–169 cm?" },
      { label: "c.", text: "Kelas interval mana yang memiliki frekuensi terbanyak?" },
    ],
  }),
  Qn(24, "Kuesioner dalam Penelitian – ANBK", {
    type: "mixed",
    content: "Seorang peneliti membuat kuesioner untuk mengetahui minat belajar siswa.",
    parts: [
      { label: "a.", text: "Apa perbedaan kuesioner terbuka dan kuesioner tertutup?" },
      { label: "b.", text: "Berikan contoh pertanyaan kuesioner tertutup tentang minat belajar." },
      { label: "c.", text: "Apa keunggulan kuesioner dibanding wawancara?" },
    ],
  }),
  Qn(25, "Soal Cerita – Populasi Penelitian – UN", {
    type: "mixed",
    content: "Seorang guru ingin meneliti kebiasaan belajar siswa SMP di kotanya. Terdapat 15 sekolah dengan total 4.500 siswa.",
    parts: [
      { label: "a.", text: "Tentukan populasi penelitian tersebut." },
      { label: "b.", math: "\\text{Dengan } e=5\\%, n = \\frac{4500}{1+4500(0{,}05)^2} = \\ldots" },
      { label: "c.", text: "Teknik sampling apa yang tepat jika ingin mewakili semua sekolah?" },
    ],
  }),
  Qn(26, "Validitas dan Reliabilitas – TKA", {
    type: "mixed",
    content: "Dalam penelitian statistika, instrumen pengumpulan data harus valid dan reliabel.",
    parts: [
      { label: "a.", text: "Apa yang dimaksud dengan validitas suatu instrumen?" },
      { label: "b.", text: "Apa yang dimaksud dengan reliabilitas suatu instrumen?" },
      { label: "c.", text: "Apakah suatu instrumen bisa reliabel tapi tidak valid? Jelaskan." },
    ],
  }),
  Qn(27, "Data Numerik dan Kategorik – ANBK", {
    type: "mixed",
    content: "Dari hasil survei berikut, identifikasi jenis data:",
    parts: [
      { label: "a.", text: "Nilai ujian: 75, 80, 65, 90, 85 → data apa?" },
      { label: "b.", text: "Warna favorit: merah, biru, hijau → data apa?" },
      { label: "c.", text: "Indeks prestasi: 3.5, 3.0, 2.8 → data apa?" },
    ],
  }),
  Qn(28, "Menghitung Batas Kelas – UN", {
    type: "mixed",
    mathContent: "\\text{Batas bawah nyata} = \\text{batas bawah} - 0{,}5",
    content: "Hitung batas nyata untuk kelas interval berikut:",
    parts: [
      { label: "a.", math: "\\text{Kelas } 60-69: \\text{ batas bawah nyata} = 60 - 0{,}5 = \\ldots" },
      { label: "b.", math: "\\text{Kelas } 70-79: \\text{ batas atas nyata} = 79 + 0{,}5 = \\ldots" },
      { label: "c.", text: "Mengapa batas nyata digunakan dalam histogram?" },
    ],
  }),
  Qn(29, "Sampling Cluster – TKA", {
    type: "mixed",
    content: "Suatu kota terbagi menjadi 20 kelurahan. Untuk survei, dipilih 4 kelurahan secara acak, lalu seluruh warga kelurahan terpilih diwawancarai.",
    parts: [
      { label: "a.", text: "Metode sampling apa yang digunakan?" },
      { label: "b.", text: "Apa keunggulan sampling cluster dibanding sampling acak biasa?" },
      { label: "c.", text: "Apa kelemahan sampling cluster?" },
    ],
  }),
  Qn(30, "Analisis Tabel Frekuensi – ANBK", {
    type: "mixed",
    content: "Tabel nilai IPA kelas 9: 50–59 (f=2), 60–69 (f=5), 70–79 (f=13), 80–89 (f=8), 90–99 (f=2). n=30.",
    parts: [
      { label: "a.", math: "f_r \\text{ kelas 70–79} = \\frac{13}{30} \\times 100\\% = \\ldots" },
      { label: "b.", text: "Berapa siswa yang nilainya kurang dari 70?" },
      { label: "c.", text: "Berapa persen siswa yang nilainya di atas 80?" },
    ],
  }),
  Qn(31, "Penyajian Data dan Kesimpulan – UN", {
    type: "mixed",
    content: "Dari 25 siswa yang disurvei mengenai hobi: Membaca (8), Olahraga (7), Bermain Game (6), Menggambar (4).",
    parts: [
      { label: "a.", math: "\\text{Persentase hobi membaca} = \\frac{8}{25} \\times 100\\% = \\ldots" },
      { label: "b.", text: "Hobi apa yang paling sedikit diminati?" },
      { label: "c.", text: "Sajikan data ini dalam bentuk tabel frekuensi lengkap dengan frekuensi relatif." },
    ],
  }),
  Qn(32, "Identifikasi Datum dan Data – TKA", {
    type: "mixed",
    content: "Dalam statistika, data adalah kumpulan fakta atau informasi, sedangkan datum adalah satu nilai tunggal.",
    parts: [
      { label: "a.", text: "Contoh data: nilai ulangan semua siswa kelas 9A. Apa yang dimaksud datum dari contoh ini?" },
      { label: "b.", text: "Sebutkan 3 sumber data sekunder yang sering digunakan dalam penelitian." },
      { label: "c.", text: "Apakah data yang dikumpulkan dari internet termasuk data primer atau sekunder?" },
    ],
  }),
  Qn(33, "Ukuran Sampel Ideal – ANBK", {
    type: "mixed",
    mathContent: "n = \\frac{N}{1 + Ne^2}",
    content: "Gunakan rumus Slovin untuk menentukan ukuran sampel:",
    parts: [
      { label: "a.", math: "N = 200, e = 10\\%: n = \\frac{200}{1 + 200(0{,}1)^2} = \\frac{200}{1+2} = \\ldots" },
      { label: "b.", math: "N = 500, e = 5\\%: n = \\frac{500}{1+500(0{,}05)^2} = \\ldots" },
      { label: "c.", math: "N = 1000, e = 5\\%: n = \\ldots" },
    ],
  }),
  Qn(34, "Pengertian Datum Pencilan – UN", {
    type: "mixed",
    content: "Data IPK mahasiswa: 2.5, 3.0, 3.2, 3.1, 2.8, 3.5, 1.0, 3.3, 3.0, 2.9",
    parts: [
      { label: "a.", text: "Identifikasi datum yang terlihat berbeda jauh dari yang lain (pencilan/outlier)." },
      { label: "b.", text: "Apa pengaruh adanya pencilan terhadap rata-rata data?" },
      { label: "c.", text: "Bagaimana cara menangani data pencilan dalam analisis statistika?" },
    ],
  }),
  Qn(35, "Tabel Distribusi Frekuensi Kumulatif – TKA", {
    type: "mixed",
    content: "Data berat badan (frekuensi): 40–44 (3), 45–49 (6), 50–54 (11), 55–59 (8), 60–64 (2).",
    parts: [
      { label: "a.", text: "Buat tabel frekuensi kumulatif kurang dari (fk<)." },
      { label: "b.", text: "Buat tabel frekuensi kumulatif lebih dari (fk>)." },
      { label: "c.", text: "Berapa banyak data yang beratnya kurang dari 55 kg?" },
    ],
  }),
  Qn(36, "Soal UN – Memilih Teknik Sampling yang Tepat", {
    type: "mixed",
    content: "Pilih teknik sampling yang paling tepat untuk situasi berikut:",
    parts: [
      { label: "a.", text: "Memilih 10 siswa dari 30 siswa satu kelas secara acak." },
      { label: "b.", text: "Meneliti kepuasan pelanggan dari berbagai kota di Indonesia." },
      { label: "c.", text: "Mengambil sampel dari daftar pelanggan yang sudah diurutkan." },
    ],
  }),
  Qn(37, "Soal ANBK – Menyusun Pertanyaan Penelitian", {
    type: "mixed",
    content: "Seorang siswa ingin meneliti hubungan antara durasi tidur dan konsentrasi belajar.",
    parts: [
      { label: "a.", text: "Rumuskan judul penelitian yang tepat." },
      { label: "b.", text: "Tentukan variabel bebas dan variabel terikat." },
      { label: "c.", text: "Teknik pengumpulan data apa yang paling sesuai? Jelaskan." },
    ],
  }),
  Qn(38, "Soal TKA – Frekuensi dan Persentase", {
    type: "mixed",
    content: "Survei transportasi 50 siswa: Sepeda motor (20), Mobil (10), Angkot (12), Jalan kaki (8).",
    parts: [
      { label: "a.", math: "\\text{Persen sepeda motor} = \\frac{20}{50} \\times 100\\% = \\ldots" },
      { label: "b.", math: "\\text{Persen mobil} = \\frac{10}{50} \\times 100\\% = \\ldots" },
      { label: "c.", text: "Moda transportasi apa yang paling sedikit digunakan?" },
    ],
  }),
  Qn(39, "Soal ANBK – Interpretasi Data", {
    type: "mixed",
    content: "Nilai rata-rata ujian 3 sekolah: Sekolah A = 75, Sekolah B = 82, Sekolah C = 68.",
    parts: [
      { label: "a.", text: "Sekolah mana yang memiliki rata-rata tertinggi dan terendah?" },
      { label: "b.", text: "Apakah nilai rata-rata yang tinggi selalu berarti semua siswa pandai? Jelaskan." },
      { label: "c.", text: "Informasi tambahan apa yang kamu butuhkan untuk membandingkan ketiga sekolah tersebut secara adil?" },
    ],
  }),
  Qn(40, "Soal UN/ANBK/TKA – Gabungan Pengantar Statistika", {
    type: "mixed",
    content: "Penelitian tentang nilai matematika 100 siswa SMP menggunakan sampling stratifikasi proporsional dari 3 kelas (Kelas A: 40 siswa, Kelas B: 35 siswa, Kelas C: 25 siswa).",
    parts: [
      { label: "a.", math: "\\text{Sampel kelas A jika total sampel 20: } \\frac{40}{100} \\times 20 = \\ldots" },
      { label: "b.", math: "\\text{Sampel kelas B: } \\frac{35}{100} \\times 20 = \\ldots" },
      { label: "c.", math: "\\text{Sampel kelas C: } \\frac{25}{100} \\times 20 = \\ldots" },
      { label: "d.", text: "Apakah hasil penjumlahan sampel dari ketiga kelas = 20? Verifikasi." },
    ],
  }),
];

const PengantarStatistikaPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📊</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(34,211,238,0.7)' }}>
            PENGANTAR STATISTIKA & PENGUMPULAN DATA
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 40 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-cyan-300 text-xs font-bold mb-3">📌 Konsep Kunci</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Populasi", desc: "Seluruh objek penelitian" },
              { name: "Sampel", desc: "Sebagian dari populasi" },
              { name: "Data Primer", desc: "Dikumpulkan langsung" },
              { name: "Data Sekunder", desc: "Dari sumber lain" },
              { name: "Sensus", desc: "Data seluruh populasi" },
              { name: "Sampling", desc: "Data sebagian populasi" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-cyan-400 text-[9px] uppercase font-bold mb-0.5">{r.name}</div>
                <div className="text-white/60 text-[9px]">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                    <span className="text-cyan-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3 whitespace-pre-line">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-cyan-900/20 border border-cyan-500/20 rounded-lg px-4 py-3 flex justify-center overflow-x-auto"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3 overflow-x-auto">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-cyan-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
            className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};
export default PengantarStatistikaPage;
