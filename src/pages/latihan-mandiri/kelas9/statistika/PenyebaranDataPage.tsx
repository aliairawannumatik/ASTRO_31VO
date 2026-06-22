import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type Q = { n: number; title: string; content: string; diagram?: React.ReactNode };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const VariansSimpanganDiagram = () => (
  <svg width="310" height="145" viewBox="0 0 310 145" className="mx-auto">
    <rect x="4" y="4" width="302" height="137" rx="10" fill="#7c2d12" fillOpacity="0.2" stroke="#fb923c" strokeWidth="1.5" />
    <text x="155" y="18" fill="#fb923c" fontSize="10" textAnchor="middle" fontWeight="bold">Varians dan Simpangan Baku</text>
    <rect x="15" y="24" width="133" height="50" rx="6" fill="#7c2d12" fillOpacity="0.4" />
    <text x="81" y="37" fill="#fed7aa" fontSize="8" textAnchor="middle" fontWeight="bold">Varians (s²)</text>
    <text x="81" y="52" fill="#fb923c" fontSize="9" textAnchor="middle">s² = Σ(xᵢ − x̄)² / n</text>
    <text x="81" y="68" fill="#94a3b8" fontSize="7" textAnchor="middle">atau dengan frekuensi:</text>
    <rect x="158" y="24" width="140" height="50" rx="6" fill="#7c2d12" fillOpacity="0.4" />
    <text x="228" y="37" fill="#fed7aa" fontSize="8" textAnchor="middle" fontWeight="bold">Simpangan Baku (s)</text>
    <text x="228" y="52" fill="#fb923c" fontSize="9" textAnchor="middle">s = √(varians)</text>
    <text x="228" y="68" fill="#94a3b8" fontSize="7" textAnchor="middle">s = √(Σ(xᵢ−x̄)²/n)</text>
    <rect x="15" y="80" width="283" height="30" rx="6" fill="#431407" fillOpacity="0.6" />
    <text x="155" y="93" fill="#fed7aa" fontSize="8" textAnchor="middle" fontWeight="bold">Simpangan rata-rata (SR)</text>
    <text x="155" y="107" fill="#fb923c" fontSize="9" textAnchor="middle">SR = Σ|xᵢ − x̄| / n</text>
    <rect x="15" y="116" width="283" height="22" rx="6" fill="#431407" fillOpacity="0.4" />
    <text x="155" y="131" fill="#94a3b8" fontSize="8" textAnchor="middle">Semakin kecil s → data semakin seragam (tidak bervariasi)</text>
  </svg>
);

const TableSimpangan = () => (
  <svg width="310" height="180" viewBox="0 0 310 180" className="mx-auto">
    <rect x="4" y="4" width="302" height="172" rx="10" fill="#7c2d12" fillOpacity="0.2" stroke="#fb923c" strokeWidth="1.5" />
    <text x="155" y="18" fill="#fb923c" fontSize="10" textAnchor="middle" fontWeight="bold">Tabel Menghitung Varians</text>
    <rect x="10" y="24" width="282" height="18" rx="3" fill="#c2410c" fillOpacity="0.35" />
    <text x="45" y="36" fill="#fed7aa" fontSize="8" textAnchor="middle" fontWeight="bold">xᵢ</text>
    <text x="100" y="36" fill="#fed7aa" fontSize="8" textAnchor="middle" fontWeight="bold">xᵢ − x̄</text>
    <text x="170" y="36" fill="#fed7aa" fontSize="8" textAnchor="middle" fontWeight="bold">(xᵢ − x̄)²</text>
    <text x="255" y="36" fill="#fed7aa" fontSize="8" textAnchor="middle" fontWeight="bold">|xᵢ − x̄|</text>
    {[
      ["4","-3","9","3"],
      ["5","-2","4","2"],
      ["7","0","0","0"],
      ["8","1","1","1"],
      ["11","4","16","4"],
    ].map(([xi,dev,dev2,absdev], i) => (
      <g key={i}>
        <rect x="10" y={43+i*22} width="282" height="21" fill={i%2===0?"#7c2d12":"transparent"} fillOpacity="0.25"/>
        <text x="45" y={57+i*22} fill="#fed7aa" fontSize="9" textAnchor="middle">{xi}</text>
        <text x="100" y={57+i*22} fill={Number(dev)<0?"#fca5a5":"#86efac"} fontSize="9" textAnchor="middle">{dev}</text>
        <text x="170" y={57+i*22} fill="#fdba74" fontSize="9" textAnchor="middle">{dev2}</text>
        <text x="255" y={57+i*22} fill="#fed7aa" fontSize="9" textAnchor="middle">{absdev}</text>
      </g>
    ))}
    <rect x="10" y="153" width="282" height="18" rx="3" fill="#c2410c" fillOpacity="0.25"/>
    <text x="45" y="165" fill="#fb923c" fontSize="8" textAnchor="middle" fontWeight="bold">Σ=35</text>
    <text x="100" y="165" fill="#94a3b8" fontSize="8" textAnchor="middle">Σ=0</text>
    <text x="170" y="165" fill="#fb923c" fontSize="8" textAnchor="middle" fontWeight="bold">Σ=30</text>
    <text x="255" y="165" fill="#fb923c" fontSize="8" textAnchor="middle" fontWeight="bold">Σ=10</text>
    <text x="155" y="178" fill="#94a3b8" fontSize="7" textAnchor="middle">x̄ = 35/5 = 7, s² = 30/5 = 6, s = √6 ≈ 2,45, SR = 10/5 = 2</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Jangkauan (Range) – ANBK", {
    content: "Nilai ulangan harian enam siswa adalah: 65, 72, 58, 80, 90, 45. Tentukan jangkauan dari data nilai tersebut, kemudian jelaskan satu kelemahan jangkauan sebagai ukuran penyebaran data!",
  }),
  Qn(2, "Jangkauan Interkuartil (IQR) – UN", {
    content: "Data nilai 10 siswa yang sudah diurutkan: 55, 60, 65, 70, 72, 75, 80, 82, 88, 95. Diketahui Q₁ = 63,75 dan Q₃ = 83,5. Tentukan IQR (Jangkauan Interkuartil) dari data tersebut!",
  }),
  Qn(3, "Simpangan Kuartil (SQ) – TKA", {
    content: "Data yang sudah diurutkan: 10, 15, 20, 25, 30, 35, 40, 45, 50. Diketahui Q₁ = 17,5 dan Q₃ = 42,5. Tentukan IQR dan simpangan kuartil (SQ) dari data tersebut!",
  }),
  Qn(4, "IQR dan Simpangan Kuartil dari Data – ANBK", {
    content: "Data nilai 10 siswa yang sudah diurutkan: 55, 60, 65, 70, 72, 75, 80, 82, 88, 95. Tentukan Q₁, Q₃, IQR, dan simpangan kuartil dari data tersebut!",
  }),
  Qn(5, "Simpangan Rata-Rata – UN", {
    diagram: <TableSimpangan />,
    content: "Data nilai: 4, 5, 7, 8, 11. Rata-rata dari data tersebut adalah 7. Perhatikan tabel di atas sebagai panduan. Tentukan simpangan rata-rata (SR) dari data tersebut!",
  }),
  Qn(6, "Varians dan Simpangan Baku Tunggal – TKA", {
    content: "Data nilai: 4, 5, 7, 8, 11. Diketahui rata-rata data tersebut adalah 7. Tentukan varians (s²) dan simpangan baku (s) dari data tersebut!",
  }),
  Qn(7, "Simpangan Baku – ANBK", {
    content: "Data nilai ulangan lima siswa: 6, 7, 8, 9, 10. Tentukan rata-rata, varians, dan simpangan baku dari data tersebut!",
  }),
  Qn(8, "Varians dan Simpangan Baku Berbobot – UN", {
    content: "Data nilai ulangan beserta frekuensinya: nilai 6 sebanyak 2 siswa, nilai 7 sebanyak 5 siswa, nilai 8 sebanyak 8 siswa, nilai 9 sebanyak 4 siswa, dan nilai 10 sebanyak 1 siswa. Diketahui rata-rata = 7,75. Tentukan varians dan simpangan baku dari data tersebut!",
  }),
  Qn(9, "Perbandingan Penyebaran Dua Kelas – ANBK", {
    content: "Kelas A memiliki nilai ulangan: 70, 72, 74, 76, 78. Kelas B memiliki nilai ulangan: 60, 68, 74, 80, 88. Keduanya memiliki rata-rata yang sama yaitu 74. Hitung simpangan baku masing-masing kelas, kemudian tentukan kelas mana yang datanya lebih seragam!",
  }),
  Qn(10, "Jangkauan Suhu Udara – UN", {
    content: "Suhu udara di suatu kota selama 7 hari berturut-turut tercatat sebagai berikut (dalam °C): 28, 30, 27, 32, 29, 31, 26. Tentukan jangkauan suhu udara selama 7 hari tersebut!",
  }),
  Qn(11, "IQR dan Simpangan Kuartil Data Berurut – ANBK", {
    content: "Data yang sudah diurutkan dari kecil ke besar: 10, 15, 20, 25, 30, 35, 40, 45, 50. Tentukan Q₁, Q₃, IQR, dan simpangan kuartil dari data tersebut!",
  }),
  Qn(12, "Simpangan Rata-Rata Berbobot – UN", {
    content: "Data nilai beserta frekuensinya: nilai 5 sebanyak 3 siswa, nilai 7 sebanyak 5 siswa, nilai 9 sebanyak 2 siswa. Tentukan rata-rata dan simpangan rata-rata dari data tersebut!",
  }),
  Qn(13, "Deteksi Data Pencilan (Outlier) – TKA", {
    content: "Data hasil ulangan: 20, 22, 24, 26, 28, 30, 32, 34, 36, 80. Diketahui Q₁ = 23 dan Q₃ = 33. Gunakan aturan IQR (batas bawah = Q₁ − 1,5 × IQR dan batas atas = Q₃ + 1,5 × IQR) untuk menentukan apakah nilai 80 merupakan data pencilan (outlier)!",
  }),
  Qn(14, "Simpangan Baku Data Berbobot – UN", {
    content: "Data nilai beserta frekuensinya: nilai 60 sebanyak 4 siswa, nilai 70 sebanyak 8 siswa, nilai 80 sebanyak 12 siswa, nilai 90 sebanyak 6 siswa. Diketahui rata-rata = 77. Tentukan varians dan simpangan baku dari data tersebut!",
  }),
  Qn(15, "Membandingkan Dua Ukuran Penyebaran – TKA", {
    content: "Data A: 4, 6, 8, 10, 12. Data B: 2, 4, 8, 12, 14. Keduanya memiliki rata-rata yang sama yaitu 8. Hitung jangkauan dan IQR masing-masing data, kemudian tentukan data mana yang lebih bervariasi!",
  }),
  Qn(16, "Efek Perkalian Konstanta terhadap Varians – TKA", {
    content: "Diketahui varians suatu data adalah 25. Jika setiap nilai data dikali 2, tentukan varians dan simpangan baku yang baru! Jelaskan aturan umum perubahan varians akibat perkalian konstanta!",
  }),
  Qn(17, "Simpangan Baku Produksi Pabrik – ANBK", {
    content: "Produksi harian suatu pabrik selama 5 hari (dalam unit) tercatat sebagai berikut: 100, 105, 98, 103, 104. Tentukan rata-rata produksi harian dan simpangan baku dari data tersebut!",
  }),
  Qn(18, "Membandingkan IQR Dua Kelompok – TKA", {
    content: "Dua kelompok data, A dan B, memiliki median yang sama. Kelompok A memiliki IQR = 10 sedangkan kelompok B memiliki IQR = 30. Tentukan simpangan kuartil masing-masing kelompok, kemudian simpulkan kelompok mana yang datanya lebih terkonsentrasi di sekitar median dan mana yang lebih menyebar!",
  }),
  Qn(19, "Jangkauan, IQR, dan Simpangan Kuartil – UN", {
    content: "Data nilai: 10, 14, 16, 18, 20, 22, 24, 26, 30. Diketahui Q₁ = 15 dan Q₃ = 25. Tentukan jangkauan, IQR, dan simpangan kuartil dari data tersebut!",
  }),
  Qn(20, "Memilih Ukuran Penyebaran yang Tepat – ANBK", {
    content: "Data gaji 10 karyawan (dalam juta rupiah): 3, 3, 4, 4, 4, 5, 5, 6, 6, 50. Seorang manajer memiliki gaji sangat tinggi yaitu 50 juta. Tentukan jangkauan dan IQR dari data tersebut, kemudian jelaskan ukuran penyebaran mana yang lebih tepat digunakan untuk menggambarkan kondisi gaji di perusahaan ini dan mengapa!",
  }),
  Qn(21, "Efek Penambahan Konstanta terhadap Simpangan Baku – TKA", {
    content: "Diketahui data dengan rata-rata 70 dan simpangan baku 8. Jika setiap nilai data ditambah 10, tentukan rata-rata dan simpangan baku yang baru! Jelaskan mengapa simpangan baku tidak berubah ketika semua data ditambah dengan konstanta yang sama!",
  }),
  Qn(22, "Perbandingan Tiga Ukuran Penyebaran – UN", {
    diagram: <VariansSimpanganDiagram />,
    content: "Perhatikan diagram di atas yang merangkum tiga ukuran penyebaran data. Jelaskan perbedaan antara jangkauan, IQR/simpangan kuartil, dan simpangan baku! Sebutkan kondisi kapan sebaiknya menggunakan IQR dibandingkan jangkauan atau simpangan baku!",
  }),
];

const PenyebaranDataPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📡</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,146,60,0.7)' }}>
            UKURAN PENYEBARAN DATA
          </h1>
          <p className="text-orange-200/70 text-sm text-center font-body mb-1">Jangkauan, IQR, dan Simpangan Kuartil</p>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 22 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-3">📌 Rumus Kunci</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { name: "Jangkauan", math: "J = x_{\\max} - x_{\\min}" },
              { name: "IQR", math: "\\text{IQR} = Q_3 - Q_1" },
              { name: "Simpangan Kuartil", math: "SQ = \\frac{Q_3-Q_1}{2}" },
              { name: "Simpangan Rata-Rata", math: "SR = \\frac{\\sum|x_i-\\bar{x}|}{n}" },
              { name: "Varians", math: "s^2 = \\frac{\\sum(x_i-\\bar{x})^2}{n}" },
              { name: "Simpangan Baku", math: "s = \\sqrt{s^2}" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-3">
                <div className="text-orange-400 text-[9px] uppercase font-bold min-w-[130px]">{r.name}</div>
                <div className="text-orange-200 text-xs overflow-x-auto"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-red-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-red-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center shrink-0">
                    <span className="text-orange-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3 overflow-x-auto">{q.diagram}</div>}
                    <p className="font-body text-sm text-white/90 leading-relaxed">{q.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-orange-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};
export default PenyebaranDataPage;
