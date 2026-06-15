import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n"|"title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Ekspansi Bentuk Pangkat – UN", {
    type: "mixed",
    content: "Nyatakan dalam bentuk perkalian berulang lalu hitung nilainya:",
    parts: [
      { label: "a.", math: "4^3" },
      { label: "b.", math: "(-5)^2" },
      { label: "c.", math: "\\left(\\frac{1}{2}\\right)^5" },
      { label: "d.", text: "Sebuah kubus memiliki panjang sisi 4 cm. Volume kubus = sisi³. Nyatakan volumenya dalam bentuk pangkat lalu hitung!" },
      { label: "e.", text: "Sebuah tali dipotong menjadi ½ bagian sebanyak 5 kali berturut-turut. Nyatakan sisa panjang tali dalam bentuk pangkat dan hitung nilainya!" },
      { label: "f.", text: "Suhu di kutub dinyatakan sebagai (−5)² derajat Celsius dalam model matematis. Nyatakan dalam bentuk perkalian berulang dan hitung!" },
    ],
  }),
  Qn(2, "Penulisan Bentuk Pangkat – UN Style", {
    type: "mixed",
    content: "Tuliskan dalam bentuk pangkat:",
    parts: [
      { label: "a.", math: "7 \\times 7 \\times 7 \\times 7 = \\ldots" },
      { label: "b.", math: "(-3) \\times (-3) \\times (-3) = \\ldots" },
      { label: "c.", math: "a \\times a \\times a \\times a \\times a = \\ldots" },
      { label: "d.", text: "Populasi bakteri dalam suatu koloni bertambah dengan pola 5×5×5×5×5. Tuliskan dalam bentuk pangkat!" },
      { label: "e.", text: "Volume sebuah ruangan berbentuk kubus dinyatakan p×p×p meter kubik. Tuliskan dalam bentuk pangkat!" },
      { label: "f.", text: "Kecepatan perambatan sinyal dinyatakan 10×10×10×10×10×10×10×10 m/s. Tuliskan dalam bentuk pangkat!" },
    ],
  }),
  Qn(3, "Nilai Pangkat dengan Basis Negatif – UN", {
    type: "mixed",
    parts: [
      { label: "a.", math: "(-2)^4 = \\ldots" },
      { label: "b.", math: "(-3)^3 = \\ldots" },
      { label: "c.", math: "(-1)^{100} = \\ldots" },
      { label: "d.", text: "Suhu sebuah ruangan berubah sebesar (−2)⁴ derajat dari titik awal. Positif atau negatifkah perubahan suhu itu? Hitung nilainya!" },
      { label: "e.", text: "Dalam simulasi fisika, kecepatan sebuah partikel dinyatakan (−3)³ m/s. Hitung nilainya dan tentukan arahnya (positif/negatif)!" },
      { label: "f.", text: "Sebuah pola bilangan menggunakan (−1)^{100}. Apakah hasilnya positif atau negatif? Berikan alasanmu!" },
    ],
  }),
  Qn(4, "Perbedaan (−a)ⁿ dan −aⁿ – Konsep Penting", {
    type: "mixed",
    content: "Perhatikan perbedaan antara (−a)ⁿ dan −aⁿ. Pada (−a)ⁿ, tanda negatif ikut dipangkatkan; pada −aⁿ, hanya a yang dipangkatkan kemudian hasilnya dinegatifkan.",
    parts: [
      { label: "a.", math: "(-2)^4 = \\ldots" },
      { label: "b.", math: "-2^4 = \\ldots" },
      { label: "c.", math: "(-3)^2 = \\ldots \\quad \\text{dan} \\quad -3^2 = \\ldots" },
      { label: "d.", math: "-3^2 = \\ldots" },
      { label: "e.", text: "Tuliskan kesimpulan: kapan (−a)ⁿ ≠ −aⁿ dan kapan (−a)ⁿ = −aⁿ?" },
      { label: "f.", text: "Seorang siswa menghitung nilai −4² dan mendapat 16. Apakah ia benar? Jelaskan perbedaan antara (−4)² dan −4²!" },
      { label: "g.", text: "Dalam soal fisika, energi potensial dinyatakan −5². Apakah nilainya sama dengan (−5)²? Hitung dan bandingkan!" },
      { label: "h.", text: "Buat dua contoh soal sendiri yang menunjukkan perbedaan (−a)ⁿ dan −aⁿ, lalu hitung masing-masing!" },
    ],
  }),
  Qn(5, "Eksponen Basis Pecahan – UN/ANBK", {
    type: "mixed",
    parts: [
      { label: "a.", math: "\\left(\\frac{2}{3}\\right)^3 = \\ldots" },
      { label: "b.", math: "\\left(\\frac{1}{4}\\right)^2 = \\ldots" },
      { label: "c.", math: "\\left(\\frac{3}{5}\\right)^2 = \\ldots" },
      { label: "d.", text: "Sebuah tangki berbentuk kubus memiliki sisi (2/3) meter. Hitung volume tangki tersebut!" },
      { label: "e.", text: "Peluang hujan pada suatu hari adalah (1/4). Jika peluang hujan dua hari berturut-turut adalah (1/4)², hitung nilai peluang tersebut!" },
      { label: "f.", text: "Resep kue membutuhkan (3/5)² kg tepung per loyang. Berapa kg tepung yang dibutuhkan?" },
    ],
  }),
  Qn(6, "Menentukan Bilangan Pokok – TKA", {
    type: "mixed",
    content: "Tentukan nilai n yang memenuhi persamaan berikut:",
    parts: [
      { label: "a.", math: "n^3 = 27 \\Rightarrow n = \\ldots" },
      { label: "b.", math: "n^2 = 144 \\Rightarrow n = \\ldots" },
      { label: "c.", math: "n^4 = 16 \\Rightarrow n = \\ldots" },
      { label: "d.", text: "Luas ubin berbentuk persegi adalah 81 cm². Jika luas = n², berapa panjang sisi ubin?" },
      { label: "e.", text: "Volume sebuah kotak berbentuk kubus adalah 125 cm³. Jika volume = n³, berapa panjang sisi kotak?" },
      { label: "f.", text: "Sebuah bak air berbentuk kubus memiliki volume 256 liter. Jika volume = n⁴, tentukan nilai n!" },
    ],
  }),
  Qn(7, "Menentukan Pangkat – UN", {
    type: "mixed",
    content: "Tentukan nilai n yang memenuhi:",
    parts: [
      { label: "a.", math: "2^n = 64 \\Rightarrow n = \\ldots" },
      { label: "b.", math: "3^n = 243 \\Rightarrow n = \\ldots" },
      { label: "c.", math: "5^n = 3125 \\Rightarrow n = \\ldots" },
      { label: "d.", text: "Tabungan Andi berlipat ganda setiap tahun. Setelah n tahun, tabungannya menjadi 2ⁿ kali lipat. Jika tabungannya sudah 64 kali lipat, sudah berapa tahunkah ia menabung?" },
      { label: "e.", text: "Sebuah sel membelah menjadi 3 bagian setiap siklus. Setelah n siklus ada 3ⁿ sel. Jika jumlah sel sekarang 243, sudah berapa sikluskah pembelahan itu?" },
      { label: "f.", text: "Sebuah bakteri berkembang biak dengan faktor 5 setiap jam. Setelah n jam ada 5ⁿ bakteri. Jika ada 3.125 bakteri, sudah berapa jamkah berlalu?" },
    ],
  }),
  Qn(8, "Nilai Pangkat Basis 10 – TKA", {
    type: "mixed",
    parts: [
      { label: "a.", math: "10^4 = \\ldots" },
      { label: "b.", math: "10^6 = \\ldots" },
      { label: "c.", math: "\\text{Berapa digit angka 0 pada } 10^8?" },
      { label: "d.", text: "Jarak Bumi ke Matahari kira-kira 10⁸ km. Tuliskan jarak tersebut dalam bentuk bilangan biasa!" },
      { label: "e.", text: "Sebuah negara berpenduduk sekitar 10⁸ jiwa. Tuliskan angka populasinya secara lengkap!" },
      { label: "f.", text: "Sebuah prosesor komputer mampu melakukan 10⁹ operasi per detik. Berapa banyak operasi per detik itu dalam bentuk bilangan biasa?" },
    ],
  }),
  Qn(9, "Identifikasi Pangkat Ganjil/Genap – TKA", {
    type: "mixed",
    content: "Tentukan apakah hasil bilangan berpangkat positif atau negatif:",
    parts: [
      { label: "a.", math: "(-7)^{15}: \\text{ positif atau negatif?}" },
      { label: "b.", math: "(-4)^{22}: \\text{ positif atau negatif?}" },
      { label: "c.", text: "Buat aturan umum: kapan (−a)ⁿ bernilai positif dan kapan negatif?" },
      { label: "d.", text: "Suhu di kutub selatan berubah (−12)¹⁵ derajat dalam model simulasi. Apakah perubahan suhu itu positif atau negatif?" },
      { label: "e.", text: "Seorang investor mencatat perubahan nilai saham sebagai (−200)²² rupiah. Apakah nilai akhirnya untung atau rugi? Jelaskan!" },
      { label: "f.", text: "Tanpa menghitung nilainya, tentukan tanda (positif/negatif) dari: (−3)^{101}, (−5)^{50}, dan (−2)^{77}. Jelaskan polamu!" },
    ],
  }),
];

const PengertianNotasiPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">🔢</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-sky-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(56,189,248,0.7)' }}>
            PENGERTIAN DAN NOTASI PANGKAT
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Bilangan Berpangkat · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 rounded-lg px-4 py-2">
            <span className="text-sky-400 text-xs font-bold">📋 9 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-sky-900/20 border border-sky-500/20 rounded-xl p-4">
          <p className="text-sky-300 text-xs font-bold mb-3">📐 Konsep Penting</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Definisi", math: "a^n = \\underbrace{a \\times a \\times \\cdots \\times a}_{n}" },
              { name: "Kuadrat Sempurna", math: "1,4,9,16,25,36,49,64,81,100" },
              { name: "Kubik Sempurna", math: "1,8,27,64,125,216,343" },
              { name: "Pangkat Basis 10", math: "10^n = 1\\underbrace{00\\ldots0}_{n}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-white/40 text-[9px] uppercase mb-1">{r.name}</div>
                <div className="text-sky-300 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-slate-900/80 to-cyan-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-sky-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-cyan-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0">
                    <span className="text-sky-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sky-400 text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-sky-900/20 border border-sky-500/20 rounded-lg px-4 py-3 flex justify-center"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-sky-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/bilangan-berpangkat"); }}
            className="text-sm text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Bilangan Berpangkat
          </button>
        </div>
      </div>
    </div>
  );
};
export default PengertianNotasiPage;
