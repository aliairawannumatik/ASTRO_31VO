import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Ruler } from "lucide-react";
import { SimilarTriangles, SimilarRects, ParallelLinesTriangle, ScaleFigure } from "./GeoFigure";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; diagram?: React.ReactNode; type: string; };
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const TrapezoidABCDPQRSSVG = () => (
  <svg viewBox="0 0 295 130" width="295" height="130" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="25,108 115,108 97,48 47,48" fill="rgba(251,146,60,0.15)" stroke="#fb923c" strokeWidth="1.5"/>
    <text x="11" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">A</text>
    <text x="116" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">B</text>
    <text x="97" y="43" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">C</text>
    <text x="37" y="43" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">D</text>
    <text x="58" y="123" fill="#fbbf24" fontSize="10" fontWeight="bold">14 cm</text>
    <text x="108" y="75" fill="#fbbf24" fontSize="10" fontWeight="bold">10 cm</text>
    <polygon points="145,108 280,108 253,18 178,18" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="131" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">P</text>
    <text x="282" y="122" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">Q</text>
    <text x="254" y="13" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">R</text>
    <text x="163" y="13" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">S</text>
    <text x="196" y="123" fill="#fbbf24" fontSize="10" fontWeight="bold">21 cm</text>
    <text x="260" y="67" fill="#fb923c" fontSize="13" fontWeight="bold">?</text>
  </svg>
);

const SimilarQuadNSVG = () => (
  <svg viewBox="0 0 290 130" width="290" height="130" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <polygon points="25,108 100,108 80,48 25,55" fill="rgba(251,146,60,0.15)" stroke="#fb923c" strokeWidth="1.5"/>
    <polyline points="25,98 35,98 35,108" fill="none" stroke="#fb923c" strokeWidth="1"/>
    <text x="51" y="84" fill="#64748b" fontSize="15">✕</text>
    <text x="52" y="123" fill="#fbbf24" fontSize="10" fontWeight="bold">10 cm</text>
    <text x="85" y="82" fill="#fbbf24" fontSize="10" fontWeight="bold">8 cm</text>
    <polygon points="155,108 268,108 238,18 155,29" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1.5"/>
    <polyline points="155,98 165,98 165,108" fill="none" stroke="#fbbf24" strokeWidth="1"/>
    <text x="193" y="80" fill="#64748b" fontSize="15">✕</text>
    <text x="192" y="123" fill="#fbbf24" fontSize="10" fontWeight="bold">15 cm</text>
    <text x="248" y="67" fill="#fb923c" fontSize="11" fontWeight="bold">n cm</text>
  </svg>
);

const SimilarRectRatioSVG = () => (
  <svg viewBox="0 0 265 130" width="265" height="130" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    <rect x="15" y="22" width="100" height="62" fill="rgba(251,146,60,0.15)" stroke="#fb923c" strokeWidth="1.5"/>
    <text x="4" y="19" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">A</text>
    <text x="116" y="19" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">B</text>
    <text x="116" y="97" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">C</text>
    <text x="4" y="97" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">D</text>
    <text x="50" y="101" fill="#fbbf24" fontSize="10" fontWeight="bold">10 cm</text>
    <text x="119" y="57" fill="#fbbf24" fontSize="10" fontWeight="bold">6 cm</text>
    <rect x="150" y="32" width="95" height="58" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1.5"/>
    <text x="138" y="29" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">E</text>
    <text x="246" y="29" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">F</text>
    <text x="246" y="103" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">G</text>
    <text x="138" y="103" fill="#e2e8f0" fontSize="11" fontStyle="italic" fontFamily="serif">H</text>
    <text x="185" y="103" fill="#fb923c" fontSize="13" fontWeight="bold">m</text>
    <text x="248" y="65" fill="#fb923c" fontSize="13" fontWeight="bold">n</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Persegi Panjang Sebangun – UN", {
    type: "mixed",
    content: "Persegi panjang berukuran 12 cm × 8 cm akan sebangun dengan persegi panjang berukuran ....",
    parts: [
      { label: "A.", text: "9 cm × 5 cm" },
      { label: "B.", text: "6 cm × 4 cm" },
      { label: "C.", text: "15 cm × 9 cm" },
      { label: "D.", text: "18 cm × 14 cm" },
    ],
  }),
  Qn(2, "Trapesium Sebangun – UN", {
    type: "mixed",
    content: "Pada gambar tersebut trapesium ABCD sebangun dengan trapesium PQRS. Panjang rusuk QR adalah ....",
    diagram: <TrapezoidABCDPQRSSVG />,
    parts: [
      { label: "A.", text: "9 cm" },
      { label: "B.", text: "12 cm" },
      { label: "C.", text: "15 cm" },
      { label: "D.", text: "18 cm" },
    ],
  }),
  Qn(3, "Bangun Datar Sebangun – Nilai n – UN", {
    type: "mixed",
    content: "Jika kedua bangun datar di atas sebangun, maka nilai n adalah ....",
    diagram: <SimilarQuadNSVG />,
    parts: [
      { label: "A.", text: "8" },
      { label: "B.", text: "10" },
      { label: "C.", text: "12" },
      { label: "D.", text: "15" },
    ],
  }),
  Qn(4, "Gambar Diperbesar – UN", {
    type: "mixed",
    content: "Gambar berukuran 30 cm × 20 cm diperbesar sebesar 150%. Ukuran gambar hasil perbesaran berukuran ....",
    parts: [
      { label: "A.", text: "40 cm × 28 cm" },
      { label: "B.", text: "45 cm × 30 cm" },
      { label: "C.", text: "48 cm × 32 cm" },
      { label: "D.", text: "42 cm × 25 cm" },
    ],
  }),
  Qn(5, "Bayangan Tiang dan Pohon – UN", {
    type: "mixed",
    content: "Suatu tiang dengan tinggi 4 m mempunyai panjang bayangan 2,4 m. Jika suatu pohon mempunyai panjang bayangan 3 m, maka tinggi pohon tersebut adalah ....",
    parts: [
      { label: "A.", text: "4 m" },
      { label: "B.", text: "5 m" },
      { label: "C.", text: "6 m" },
      { label: "D.", text: "7 m" },
    ],
  }),
  Qn(6, "Lapangan Sebangun – Nilai p – ANBK", {
    type: "mixed",
    content: "Dua lapangan masing-masing berbentuk persegi panjang. Lapangan pertama berukuran 72 m × 45 m dan lapangan kedua berukuran p m × 135 m. Jika kedua lapangan tersebut sebangun, maka nilai p adalah ....",
    parts: [
      { label: "A.", text: "180" },
      { label: "B.", text: "198" },
      { label: "C.", text: "216" },
      { label: "D.", text: "240" },
    ],
  }),
  Qn(7, "Rasio Sisi Persegi Panjang Sebangun – ANBK", {
    type: "mixed",
    content: "Gambar berikut menunjukkan bahwa persegi panjang ABCD dan persegi panjang EFGH sebangun. Jika EF = m dan FG = n, pernyataan yang benar adalah ....",
    diagram: <SimilarRectRatioSVG />,
    parts: [
      { label: "A.", math: "m : n = 5 : 3" },
      { label: "B.", math: "m : n = 3 : 5" },
      { label: "C.", math: "m : n = 2 : 3" },
      { label: "D.", math: "m : n = 1 : 1" },
    ],
  }),
  Qn(8, "Foto di Karton – TKA", {
    type: "mixed",
    content: "Sebuah foto berukuran 16 cm × 24 cm diletakkan secara vertikal di atas karton. Ternyata di sebelah kiri, kanan, dan atas foto masih tersisa 2 cm karton. Jika karton dan foto sebangun, lebar karton di bagian bawah foto adalah ....",
    parts: [
      { label: "A.", text: "3 cm" },
      { label: "B.", text: "4 cm" },
      { label: "C.", text: "5 cm" },
      { label: "D.", text: "6 cm" },
    ],
  }),
  Qn(9, "Bayangan Anak dan Tiang Bendera – ANBK", {
    type: "mixed",
    content: "Seorang anak dengan tinggi 120 cm mempunyai panjang bayangan 1,8 m di tanah mendatar. Suatu tiang bendera mempunyai panjang bayangan 5,4 m. Tinggi tiang bendera sebenarnya adalah ....",
    parts: [
      { label: "A.", text: "200 cm" },
      { label: "B.", text: "300 cm" },
      { label: "C.", text: "360 cm" },
      { label: "D.", text: "400 cm" },
    ],
  }),
  Qn(10, "Menara dan Tiang – TKA", {
    type: "mixed",
    content: "Suatu menara yang tingginya 30 m mempunyai panjang bayangan 45 m, sedangkan suatu tiang mempunyai panjang bayangan 12 m. Panjang tiang sebenarnya adalah ....",
    parts: [
      { label: "A.", text: "6 m" },
      { label: "B.", text: "8 m" },
      { label: "C.", text: "10 m" },
      { label: "D.", text: "12 m" },
    ],
  }),
  Qn(11, "Persegi Panjang Sebangun – Cari Panjang", {
    type: "mixed",
    diagram: <SimilarRects w1={60} h1={40} w2={90} h2={60} sides1={["8 cm","5 cm","",""]} sides2={["12 cm","? cm","",""]} color1="#f97316" color2="#fbbf24"/>,
    parts: [
      { label: "a.", math: "\\frac{AB}{EF} = \\frac{BC}{FG} \\Rightarrow \\frac{8}{12} = \\frac{5}{FG}" },
      { label: "b.", text: "Hitunglah panjang FG." },
      { label: "c.", text: "Berapa faktor skala dari ABCD ke EFGH?" },
    ],
  }),
  Qn(12, "Segitiga Sebangun – Mencari Sisi", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["P","Q","R"]} sideLabels1={["6","8","?"]} sideLabels2={["9","12","15"]} color1="#f97316" color2="#fb923c" type="right"/>,
    parts: [
      { label: "a.", math: "\\frac{AB}{PQ} = \\frac{6}{9} = \\frac{2}{3}" },
      { label: "b.", text: "Tentukan panjang AC." },
      { label: "c.", text: "Berapa keliling △ABC jika keliling △PQR = 36 cm?" },
    ],
  }),
  Qn(13, "Bangun Sebangun – Foto dan Bingkai", {
    type: "mixed",
    content: "Sebuah foto berukuran 6 cm × 9 cm akan dipasang pada bingkai yang sebangun dengan foto. Lebar bingkai 15 cm.",
    parts: [
      { label: "a.", text: "Tentukan panjang bingkai." },
      { label: "b.", text: "Berapa faktor skala dari foto ke bingkai?" },
      { label: "c.", text: "Berapa luas bingkai?" },
    ],
  }),
  Qn(14, "Garis Sejajar dalam Segitiga (Thales)", {
    type: "mixed",
    diagram: <ParallelLinesTriangle topLabel="DE" botLabel="BC" leftA="AD=3" leftB="DB=6" rightA="AE=4" rightB="EC=?" topSide="DE" botSide="BC" color1="#f97316" color2="#fbbf24"/>,
    parts: [
      { label: "a.", math: "\\frac{AD}{DB} = \\frac{AE}{EC} \\Rightarrow \\frac{3}{6} = \\frac{4}{EC}" },
      { label: "b.", text: "Hitunglah EC." },
      { label: "c.", text: "Hitunglah BC jika DE = 5 cm menggunakan rasio kesebangunan." },
    ],
  }),
  Qn(15, "Soal Kontekstual – Bayangan Pohon", {
    type: "mixed",
    content: "Sebuah tiang listrik setinggi 6 m menghasilkan bayangan 4 m di tanah. Pada saat yang sama, pohon di sampingnya menghasilkan bayangan 10 m.",
    parts: [
      { label: "a.", math: "\\frac{\\text{tinggi tiang}}{\\text{bayangan tiang}} = \\frac{\\text{tinggi pohon}}{\\text{bayangan pohon}}" },
      { label: "b.", text: "Hitunglah tinggi pohon." },
      { label: "c.", text: "Mengapa bayangan dan benda membentuk segitiga yang sebangun?" },
    ],
  }),
  Qn(16, "Segitiga Sebangun dalam Soal Cerita", {
    type: "mixed",
    content: "Dua gedung berdiri di sisi jalan. Gedung A setinggi 20 m memiliki bayangan 8 m. Gedung B memiliki bayangan 12 m di waktu yang sama.",
    parts: [
      { label: "a.", text: "Buatlah perbandingan tinggi badan terhadap bayangan untuk gedung A." },
      { label: "b.", text: "Hitunglah tinggi gedung B." },
      { label: "c.", math: "\\frac{20}{8} = \\frac{h_B}{12} \\Rightarrow h_B = \\ldots" },
    ],
  }),
  Qn(17, "Menghitung Sisi Sebangun dengan Persamaan", {
    type: "mixed",
    content: "△ABC ~ △DEF. AB = (x+2) cm, DE = 12 cm, BC = 6 cm, EF = 9 cm.",
    parts: [
      { label: "a.", math: "\\frac{AB}{DE} = \\frac{BC}{EF} \\Rightarrow \\frac{x+2}{12} = \\frac{6}{9}" },
      { label: "b.", text: "Selesaikan persamaan untuk mencari x." },
      { label: "c.", text: "Hitunglah panjang AB." },
    ],
  }),
  Qn(18, "Faktor Skala dari Luas", {
    type: "mixed",
    content: "Dua segitiga sebangun. Luas segitiga pertama 50 cm² dan luas segitiga kedua 200 cm².",
    parts: [
      { label: "a.", math: "k^2 = \\frac{200}{50} = 4 \\Rightarrow k = \\ldots" },
      { label: "b.", text: "Jika alas segitiga pertama 10 cm, berapa alas segitiga kedua?" },
      { label: "c.", text: "Jika keliling segitiga pertama 24 cm, berapa keliling segitiga kedua?" },
    ],
  }),
  Qn(19, "Garis Sejajar Membagi Sisi Sebanding", {
    type: "mixed",
    diagram: <ParallelLinesTriangle topLabel="MN" botLabel="PQ" leftA="AM=5" leftB="MP=10" rightA="AN=4" rightB="NQ=?" topSide="MN" botSide="PQ" color1="#f97316" color2="#fb923c"/>,
    parts: [
      { label: "a.", math: "\\frac{AM}{MP} = \\frac{AN}{NQ}" },
      { label: "b.", text: "Hitunglah NQ." },
      { label: "c.", math: "\\frac{MN}{PQ} = \\frac{AM}{AP} = \\frac{5}{15} = \\ldots" },
    ],
  }),
  Qn(20, "Perbandingan pada Foto dan Benda", {
    type: "mixed",
    content: "Sebuah mobil sepanjang 4 m difoto. Dalam foto, panjang mobil 8 cm. Lebar mobil 1,6 m.",
    parts: [
      { label: "a.", text: "Tentukan skala foto." },
      { label: "b.", text: "Berapa lebar mobil dalam foto (dalam cm)?" },
      { label: "c.", text: "Apakah foto dan mobil asli sebangun? Buktikan." },
    ],
  }),
  Qn(21, "Menghitung Panjang dengan Perbandingan", {
    type: "mixed",
    content: "Dua segitiga ABC dan PQR sebangun. AB = 7 cm, BC = 14 cm, CA = 21 cm. PQ = 5 cm.",
    parts: [
      { label: "a.", text: "Tentukan faktor skala dari △ABC ke △PQR." },
      { label: "b.", text: "Hitunglah QR dan RP." },
      { label: "c.", text: "Hitunglah keliling △PQR." },
    ],
  }),
];

const MenghitungRusukPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-400/60 flex items-center justify-center mb-3">
            <Ruler className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-orange-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,146,60,0.7)' }}>
            MENGHITUNG PANJANG RUSUK BANGUN DATAR YANG SEBANGUN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Kesebangunan & Kekongruenan · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <span className="text-orange-400 text-xs font-bold">📋 21 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-orange-900/20 border border-orange-500/20 rounded-xl p-4">
          <p className="text-orange-300 text-xs font-bold mb-2">📌 Rumus Kunci</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Perbandingan Sisi", math: "\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = k" },
              { label: "Rasio Luas", math: "\\frac{L_1}{L_2} = k^2" },
            ].map(r => (
              <div key={r.label} className="bg-white/5 rounded-lg px-3 py-2">
                <p className="text-orange-300 text-[10px] font-bold mb-1">{r.label}</p>
                <div className="text-white/80 text-xs"><InlineMath math={r.math} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900/80 to-amber-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-orange-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-400/50 flex items-center justify-center shrink-0">
                    <span className="text-orange-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center rounded-xl overflow-hidden">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-orange-400 text-xs font-bold shrink-0 mt-0.5">{p.label}</span>}
                            <div className="flex-1">
                              {p.text && <p className="font-body text-sm text-white/80 leading-relaxed">{p.text}</p>}
                              {p.math && <div className="text-white/80 text-sm mt-0.5"><InlineMath math={p.math} /></div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {q.math && !q.parts && <div className="mt-2 bg-white/5 rounded-lg px-3 py-2"><BlockMath math={q.math} /></div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/kesebangunan-kekongruenan"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Kesebangunan & Kekongruenan
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenghitungRusukPage;
