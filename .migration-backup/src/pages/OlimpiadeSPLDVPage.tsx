import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import PembahasanCard from "@/components/PembahasanCard";
import { spldvDasarPembahasan } from "@/data/pembahasan/spldvDasar";
import { spldvOlimpiadePembahasan } from "@/data/pembahasan/spldvOlimpiade";

// Helper function to render text with LaTeX
const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.slice(1, -1);
      return <InlineMath key={index} math={latex} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const materiSection = {
  title: "MATERI - SISTEM PERSAMAAN LINEAR DUA VARIABEL",
  sections: [
    {
      heading: "A. Persamaan Linear Dua Variabel (PLDV)",
      content: `Bentuk umum PLDV: $ax + by = c$ dengan $a, b \\neq 0$, variabel x dan y.`
    },
    {
      heading: "B. Sistem Persamaan Linear Dua Variabel (SPLDV)",
      content: `$a_1x + b_1y = c_1$
$a_2x + b_2y = c_2$`
    },
    {
      heading: "C. Penyelesaian SPLDV",
      content: `Penyelesaian SPLDV digunakan untuk menentukan nilai (x, y) yang memenuhi kedua persamaan melalui metode sebagai berikut:
a. Metode Grafik
b. Metode Substitusi
c. Metode Eliminasi
d. Metode Campuran`
    },
    {
      heading: "D. Penyelesaian Soal Menggunakan Metode Campuran",
      content: `$x + 3y = 2$ (persamaan 1)
$2x + y = 9$ (persamaan 2)

Langkah berikutnya adalah menyamakan koefisien salah satu variabel untuk dihilangkan (dieliminasi), bisa koefisien x atau koefisien y. Pada kasus ini kita coba pilih untuk menyamakan koefisien x yaitu dengan cara $\\times 2$ pada persamaan 1 agar sama-sama 2x seperti pada uraian berikut:

$x + 3y = 2 \\quad \\times 2 \\quad \\Rightarrow \\quad 2x + 6y = 4$
$2x + y = 9 \\quad \\times 1 \\quad \\Rightarrow \\quad 2x + y = 9$
$\\hspace{5.5cm} 5y = -5$
$\\hspace{5.5cm} y = -1$

Untuk mendapatkan nilai variabel x kita substitusikan nilai y yang sudah diketahui ke salah satu persamaan, baik persamaan 1 ataupun persamaan 2.

Kita coba substitusikan $y = -1$ ke persamaan 1 yaitu $x + 3y = 2$
$x + 3(-1) = 2$
$x - 3 = 2$
$x = 2 + 3$
$x = 5$

Jadi, penyelesaian SPLDV di atas adalah $x = 5$ dan $y = -1$ atau $(5, -1)$`
    },
    {
      heading: "E. SPLDV Memiliki Penyelesaian Tak Hingga",
      content: `Pada kasus SPLDV dimana memiliki penyelesaian tak hingga adalah ketika sistem persamaan yang ada membentuk PLDV.

Contoh:
Tentukan penyelesaian SPLDV berikut:
$x + y = 5$
$2x + 2y = 10$

Kedua persamaan tersebut sebenarnya adalah persamaan yang sama (persamaan kedua adalah 2 kali persamaan pertama), sehingga memiliki tak hingga penyelesaian.`
    },
    {
      heading: "F. SPLDV Tidak Memiliki Himpunan Penyelesaian",
      content: `Pada kasus SPLDV dimana kedua persamaan memiliki persamaan yang sama namun dengan hasil yang berbeda (tidak konsisten).

Contoh:
Tentukan penyelesaian SPLDV berikut:
$x + y = 5$
$x + y = -3$

Kedua persamaan tersebut tidak konsisten karena sisi kiri sama tetapi sisi kanan berbeda, sehingga tidak memiliki penyelesaian.`
    },
    {
      heading: "G. SPLDV Memiliki 1 Himpunan Penyelesaian",
      content: `Pada kasus SPLDV dimana kedua persamaan tidak membentuk PLDV dan tidak terdapat 2 persamaan yang sama dengan menghasilkan nilai yang berbeda.

Ini adalah kasus yang paling umum dijumpai dalam soal-soal SPLDV.`
    }
  ]
};

const latihanDasar = [
  { no: 1, soal: "Diketahui sistem persamaan $x - 3y - 5 = 0$ dan $2x - 5y = 9$. Nilai dari $3x + 2y$ adalah", options: ["A. -1", "B. 1", "C. 3", "D. 4"] },
  { no: 2, soal: "Penyelesaian sistem persamaan $3x - 2y = 12$ dan $5x + y = 7$ adalah $x = p$ dan $y = q$. Nilai dari $4p + 3q$ adalah ...", options: ["A. -2", "B. 7", "C. 14", "D. 16"] },
  { no: 3, soal: "Jika a dan b merupakan penyelesaian dari sistem persamaan $-3x + 2y = 8$ dan $2x - y = -10$, nilai dari $a - 2b$ adalah ...", options: ["A. 16", "B. 32", "C. 40", "D. 48"] },
  { no: 4, soal: "Penyelesaian dari $\\frac{2}{x} + \\frac{1}{y} = 6$ dan $\\frac{1}{x} + \\frac{1}{y} = 2$ adalah $x = a$ dan $y = b$. Nilai dari $a - 2b$ adalah ...", options: ["A. -2", "B. 7", "C. 14", "D. 16"] },
  { no: 5, soal: "Diketahui $\\frac{3}{x} + \\frac{1}{y} = 4$ dan $\\frac{1}{x} - \\frac{2}{y} = -2$. Nilai $2x - y$ adalah ...", options: ["A. 0", "B. 2", "C. 4", "D. 8"] },
  { no: 6, soal: "Diketahui sistem persamaan berikut:\n$\\frac{2}{x} + \\frac{3}{y} = 2$\n$\\frac{4}{x} - \\frac{3}{y} = 1$\nNilai x sama dengan ...", options: ["A. 2", "B. 3", "C. $\\frac{1}{2}$", "D. $\\frac{1}{3}$"] },
  { no: 7, soal: "Perhatikan sistem persamaan 'campuran' berikut:\n$\\sqrt{y} - \\sqrt{x} = 1$\n$\\frac{4}{\\sqrt{x}} + \\frac{3}{\\sqrt{y}} = 3$\nJika diketahui x dan y adalah bilangan bulat positif, maka nilai dari xy adalah ...", options: ["A. 6", "B. 3", "C. 2", "D. 5"] },
  { no: 8, soal: "Hanna membeli 3 buah buku dan 2 buah pensil. Hanna membayar dengan dua lembar uang Rp 10.000,00 dan mendapatkan kembalian Rp 3.000,00. Jika harga sebuah buku x rupiah dan pensil y rupiah, maka model matematikanya adalah..", options: ["A. $10.000 - 3x - 2y = 3.000$", "B. $10.000 - 3x + 2y = 3.000$", "C. $20.000 - (3x - 2y) = 3.000$", "D. $20.000 - (3x + 2y) = 3.000$"] },
  { no: 9, soal: "Indra membeli 2 buah buku dan 3 buah pensil. Indra membayar dengan dua lembar uang Rp 20.000,00 dan mendapatkan kembalian Rp 13.000,00. Jika harga sebuah buku x rupiah dan pensil y rupiah, maka model matematikanya adalah..", options: ["A. $20.000 - 2x - 3y = 13.000$", "B. $20.000 - 2x + 3y = 13.000$", "C. $40.000 - (2x - 3y) = 13.000$", "D. $40.000 - (2x + 3y) = 13.000$"] },
  { no: 10, soal: "Harga 4 buku tulis dan 3 pensil adalah Rp. 13.500,00. Harga 3 buku tulis dan 2 pensil adalah Rp. 9.750,00. Harga 2 buku tulis dan 3 pensil adalah ..", options: ["A. Rp 11.250,00", "B. Rp 10.000,00", "C. Rp 9.500,00", "D. Rp 9.000,00"] },
  { no: 11, soal: "Jika harga sebuah mesin cetak adalah 5 kali harga sebuah komputer sedangkan harga 2 buah mesin cetak dan 5 buah komputer adalah Rp 60.000.000,00, maka harga sebuah mesin cetak adalah ...", options: ["A. Rp 8.000.000,00", "B. Rp 12.000.000,00", "C. Rp 20.000.000,00", "D. Rp 24.000.000,00"] },
  { no: 12, soal: "Di kandang Pak Karto terdapat ayam dan kambing sebanyak 75 ekor. Jika banyaknya kaki ada 198 buah maka banyaknya kambing adalah ....", options: ["A. 24 ekor", "B. 23 ekor", "C. 22 ekor", "D. 21 ekor"] },
  { no: 13, soal: "Tempat parkir pada saat itu menampung 90 kendaraan sepeda motor dan mobil, sedangkan jumlah roda seluruhnya ada 290 buah. Jika tarif parkir sepeda motor Rp2.000,00/jam dan mobil Rp5.000,00/jam, maka pendapatan tukang parkir saat itu selama 2 jam adalah ....", options: ["A. Rp345.000,00", "B. Rp325.000,00", "C. Rp285.000,00", "D. Rp690.000,00"] },
  { no: 14, soal: "Hazky mengambil uang di bank sebesar Rp.1.850.000,00 yang terdiri dari uang seratus ribuan dan uang lima puluh ribuan. Jika banyaknya uang lima puluh ribuan 7 lembar lebih banyak dari uang seratus ribuan, maka banyaknya uang lima puluh ribuan adalah...", options: ["A. 10 lembar", "B. 12 lembar", "C. 15 lembar", "D. 17 lembar"] },
  { no: 15, soal: "Dalam sebuah tempat pertunjukan terdapat 200 orang yang terdiri dari penonton dewasa dan anak-anak. Dari penjualan tiket diperoleh uang sebesar Rp 780.000,00. Jika harga tiket orang dewasa Rp 4.000,00 dan harga tiket anak-anak Rp 3.500,00, banyak penonton anak-anak adalah....", options: ["A. 40 orang", "B. 35 orang", "C. 30 orang", "D. 160 orang"] },
  { no: 16, soal: "Lima tahun yang lalu, usia Ayah adalah empat kali usia Paman. Lima tahun yang akan datang, dua kali usia Ayah sama dengan tiga kali usia Paman ditambah 7 tahun. Berapakah usia Ayah sekarang?", options: ["A. 40 tahun", "B. 35 tahun", "C. 25 tahun", "D. 45 tahun"] },
  { no: 17, soal: "Jumlah dua buah kebalikan bilangan adalah 5, sedangkan selisihnya adalah 1. (Kebalikan bilangan x adalah $\\frac{1}{x}$). Tentukan hasil kali kedua bilangan tersebut.", options: ["A. 6", "B. $\\frac{1}{6}$", "C. 5", "D. $\\frac{1}{5}$"] },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2005 Tingkat Kota\nTiga ekor ayam (besar, sedang dan kecil) ditimbang. Jika yang besar dan kecil ditimbang, beratnya adalah 2,6 kg. Jika yang besar dan sedang ditimbang, beratnya 3 kg dan jika yang sedang dan kecil ditimbang, beratnya 2 kg. Berat ketiga ayam tersebut seluruhnya adalah", options: ["A. 4 kg", "B. 4,2 kg", "C. 3,8 kg", "D. 4,6 kg"] },
  { no: 2, soal: "OSN Matematika 2006 Tingkat Kota\nSeorang ayah berumur 39 tahun mempunyai 2 anak bernama Budi dan Wati. Tahun depan selisih umur ayah dan Budi banding selisih umur ayah dan Wati adalah 14:19. Jika umur ayah sekarang adalah 3 kali umur Budi ditambah enam kali umur Wati, maka jumlah umur Budi dan Wati 3 tahun yang akan datang adalah ...", options: ["A. 17", "B. 18", "C. 19", "D. 20", "E. 21"] },
  { no: 3, soal: "OSN Matematika 2006 Tingkat Kota\nAli, Ani dan Budi pergi ke suatu toko untuk membeli pensil dan buku yang sama. Ali membeli dua buku dan dua pensil, Ani membeli tiga pensil dan 4 buku, sedangkan Budi membeli satu pensil dan dua buku. Jika Ali dan Ani berturut-turut membayar Rp. 2500,00 dan Rp. 4500,00 maka Budi harus membayar?", options: ["A. Rp1000,00", "B. Rp1500,00", "C. Rp2000,00", "D. Rp2500,00", "E. Rp3000,00"] },
  { no: 4, soal: "OSN Matematika 2010 Tingkat Kota\nDiberikan dua buah bilangan bulat berbeda yang berjumlah 37. Apabila bilangan yang lebih besar dibagi dengan bilangan yang lebih kecil, maka hasil baginya adalah 3 dan sisanya 5. Selisih kedua bilangan tersebut adalah ...", options: ["A. 21", "B. 22", "C. 23", "D. 24", "E. 25"] },
  { no: 5, soal: "OSN Matematika 2013 Tingkat Kota\nAni mempunyai Rp16.500,00. Sejumlah uang itu akan dihabiskan untuk membeli 6 peralatan sekolah. Ia membeli beberapa pensil dengan harga Rp2.000,00 per pensil. Ia membeli beberapa buku dengan harga Rp2.500,00 per buku, dan ia juga membeli beberapa kotak pensil dengan harga Rp4.000,00 per kotak. Banyak buku yang dibeli Ani adalah ...", options: [] },
  { no: 6, soal: "OSN Matematika 2015 Tingkat Kota\nAnton dan kakaknya berulang tahun pada tanggal 1 Januari. Pada tahun 2015 umur Anton dan kakaknya sama dengan jumlah angka-angka tahun kelahirannya masing-masing. Jika orang tua mereka menikah 25 tahun yang lalu maka jumlah umur Anton dan kakaknya pada tahun 2015 yang mungkin adalah ... tahun.", options: ["A. 22", "B. 24", "C. 26", "D. 30"] },
  { no: 7, soal: "OSN Matematika 2016 Tingkat Kota\nJika sistem persamaan\n$mx + 3y = 21$\n$4x - 3y = 0$\nMemiliki penyelesaian yang bulat untuk x dan y, maka nilai $m + x + y$ yang mungkin adalah", options: ["A. 9", "B. 10", "C. 11", "D. 12"] },
  { no: 8, soal: "OSN Matematika 2016 Tingkat Kota\nMisalkan x dan y merupakan bilangan asli berbeda yang memenuhi $4x + 7y = 2016$. Banyak pasangan (x, y) yang mungkin adalah ...", options: [] },
  { no: 9, soal: "OSN Matematika 2017 Tingkat Kota\nJika bilangan bulat positif x dan y merupakan solusi sistem persamaan linear\n$x + 2y = p + 6$\n$2x - y = 25 - 2p$\nMaka banyak nilai p adalah ...", options: ["A. 2", "B. 3", "C. 4", "D. 5"] },
  { no: 10, soal: "OSN Matematika 2018 Tingkat Kota\nSalah satu contoh situasi sistem persamaan $2x + y = 10000$ dan $x + 3y = 20000$ adalah ...", options: ["A. Dua orang siswa membeli pulpen dan buku tulis seharga Rp10.000,00. Salah seorang siswa tersebut membeli pensil dan tiga buku tulis seharga Rp20.000,00. Berapakah harga masing-masing sebuah pulpen dan sebuah buku tulis?", "B. Dua orang siswa membeli dua buah pulpen dan tiga buah buku tulis seharga Rp10.000,00. Selain itu dia juga membeli dua buah pulpen dan sebuah buku untuk adiknya seharga Rp20.000,00. Berapakah harga masing-masing sebuah pulpen dan sebuah buku tulis?", "C. Seorang siswa akan membeli dua buah pulpen dan tiga buah buku tulis. Siswa tersebut memiliki uang Rp30.000,00. Berapakah harga masing-masing pulpen dan sebuah buku tulis?", "D. Seorang siswa membeli sebuah pulpen dan buku tulis seharga Rp20.000,00. Selain itu, dia juga membeli dua buah pulpen dan sebuah buku tulis untuk adiknya seharga Rp10.000,00. Berapakah harga masing-masing sebuah pulpen dan sebuah buku tulis?"] },
  { no: 11, soal: "OSN Matematika 2024 Tingkat Kota\nTiga bersaudara Ana, Bona dan Cinta mendapatkan uang saku bulanan mereka dalam bentuk uang pecahan Rp5.000,00, Rp10.000, serta Rp20.000,00 dengan pembagian sebagai berikut:\n- Ana mendapatkan x lembar Rp5.000, y lembar Rp10.000 serta z lembar Rp20.000\n- Bona mendapat y lembar Rp5.000, z lembar Rp10.000 serta x lembar Rp20.000\n- Cinta mendapatkan z lembar Rp5.000, x lembar Rp10.000 serta y lembar Rp20.000\nDiketahui total uang saku ketiganya Rp700.000, maka pernyataan benar tentang uang saku mereka yang dapat disimpulkan dari informasi tersebut adalah ...", options: ["A. Ana mendapatkan uang sejumlah tepat 20 lembar", "B. Bona mendapatkan uang saku dengan nilai terbesar", "C. Cinta mendapatkan uang saku dengan nilai terkecil", "D. Ana, Bona dan Cinta mendapatkan uang saku lembaran Rp10.000 yang sama banyaknya"] },
  { no: 12, soal: "OSN Matematika 2026 Tingkat Kota\nBanyaknya pasangan bilangan real $(a, b)$ yang mengakibatkan himpunan penyelesaian sistem persamaan\n$x + y = \\sqrt{2xy + 4x + 4y - 4}$\n$ax + by = 1$\ntidak kosong dan menyebabkan semua $(x, y)$ merupakan pasangan bilangan bulat adalah ....", options: ["A. 4", "B. 6", "C. 8", "D. 10"] },
];

const OlimpiadeSPLDVPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - SPLDV
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "Materi" },
            { key: "dasar" as const, label: "Latihan Dasar" },
            { key: "olimpiade" as const, label: "Latihan Olimpiade" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`font-display text-xs px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                activeTab === tab.key
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-white/70 border-border hover:border-accent/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Materi Tab */}
        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSection.sections.map((section, idx) => (
              <div
                key={idx}
                className="backdrop-blur border rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(30,41,59,0.75) 0%, rgba(15,23,42,0.85) 100%)",
                  borderColor: expandedSections.includes(idx) ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)",
                  boxShadow: expandedSections.includes(idx)
                    ? "0 0 24px rgba(251,191,36,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.35)" }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-display text-sm text-accent font-bold group-hover:text-yellow-300 transition-colors">
                      {section.heading}
                    </span>
                  </div>
                  {expandedSections.includes(idx)
                    ? <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 animate-slide-up">
                    <div className="font-body text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                      {section.content.split('\n').map((line, i) => {
                        const trimmed = line.trim();
                        if (/^\d+\. [A-Z]/.test(trimmed)) {
                          return <div key={i} className="mt-4 mb-1 font-bold text-yellow-400 text-sm">{trimmed}</div>;
                        }
                        if (/^Rumus/.test(trimmed)) {
                          return <div key={i} className="mt-3 mb-1 font-semibold text-yellow-300 text-xs uppercase tracking-wide">{renderWithLatex(trimmed)}</div>;
                        }
                        if (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length > 2) {
                          return (
                            <div key={i} className="my-3 px-4 py-3 rounded-xl border-2 border-cyan-400/60 bg-cyan-950/40 text-center font-bold text-white text-base shadow-lg shadow-cyan-900/30">
                              <span className="block text-[10px] text-cyan-400 font-semibold uppercase tracking-widest mb-1">Rumus Penting</span>
                              {renderWithLatex(trimmed)}
                            </div>
                          );
                        }
                        if (trimmed === '') return <div key={i} className="h-2" />;
                        return <div key={i} className="mb-1">{renderWithLatex(line)}</div>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Dasar Tab */}
        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span> {soal.soal.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {lineIdx > 0 && <br />}
                      {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                    </span>
                  ))}
                </div>
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {spldvDasarPembahasan[soal.no] && (
                  <PembahasanCard pembahasanKey={`dasar-${soal.no}`} pembahasan={spldvDasarPembahasan[soal.no]} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Olimpiade Tab */}
        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span> {soal.soal.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {lineIdx > 0 && <br />}
                      {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                    </span>
                  ))}
                </div>
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {spldvOlimpiadePembahasan[soal.no] && (
                  <PembahasanCard pembahasanKey={`olim-${soal.no}`} pembahasan={spldvOlimpiadePembahasan[soal.no]} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadeSPLDVPage;
