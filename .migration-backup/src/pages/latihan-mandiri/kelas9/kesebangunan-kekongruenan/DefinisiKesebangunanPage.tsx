import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Shapes } from "lucide-react";
import { SimilarTriangles, SimilarRects, CongruentTriangles, TwoShapesCongruent } from "./GeoFigure";

const accent = "cyan";
const accentHex = "#22d3ee";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  type: "essay" | "mixed" | "diagram-only";
};
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const SimilarRightTrianglesPQRXYZ = () => (
  <svg viewBox="0 0 275 148" width="275" height="148" className="lm-kkg-svg" style={{ background: "rgba(15,23,42,0.6)", borderRadius: 8 }}>
    {/* Y axis */}
    <line x1="18" y1="6" x2="18" y2="128" stroke="#64748b" strokeWidth="1.5"/>
    <polygon points="18,4 14,12 22,12" fill="#64748b"/>
    {/* X axis */}
    <line x1="14" y1="122" x2="264" y2="122" stroke="#64748b" strokeWidth="1.5"/>
    <polygon points="265,122 257,118 257,126" fill="#64748b"/>
    {/* Axis labels */}
    <text x="10" y="8" fill="#94a3b8" fontSize="11" fontStyle="italic">Y</text>
    <text x="258" y="135" fill="#94a3b8" fontSize="11" fontStyle="italic">X</text>
    {/* Small triangle PQR — right angle at Q */}
    <polygon points="50,60 50,122 115,122" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1.5"/>
    <polyline points="50,112 60,112 60,122" fill="none" stroke="#22d3ee" strokeWidth="1"/>
    <text x="37" y="59" fill="#e2e8f0" fontSize="12" fontStyle="italic" fontFamily="serif">P</text>
    <text x="35" y="137" fill="#e2e8f0" fontSize="12" fontStyle="italic" fontFamily="serif">Q</text>
    <text x="117" y="137" fill="#e2e8f0" fontSize="12" fontStyle="italic" fontFamily="serif">R</text>
    {/* Large triangle XYZ — right angle at Y, scale ×1.5 */}
    <polygon points="143,23 143,122 240,122" fill="rgba(244,114,182,0.15)" stroke="#f472b6" strokeWidth="1.5"/>
    <polyline points="143,112 153,112 153,122" fill="none" stroke="#f472b6" strokeWidth="1"/>
    <text x="146" y="20" fill="#e2e8f0" fontSize="12" fontStyle="italic" fontFamily="serif">X</text>
    <text x="129" y="137" fill="#e2e8f0" fontSize="12" fontStyle="italic" fontFamily="serif">Y</text>
    <text x="242" y="137" fill="#e2e8f0" fontSize="12" fontStyle="italic" fontFamily="serif">Z</text>
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pengertian Kesebangunan", {
    type: "mixed",
    content: "Dua bangun datar dikatakan sebangun jika memenuhi dua syarat. Perhatikan dua persegi panjang berikut:",
    diagram: <SimilarRects w1={60} h1={40} w2={90} h2={60} sides1={["6 cm","4 cm","",""]as any} sides2={["9 cm","6 cm","",""]as any} color1="#22d3ee" color2="#a78bfa"/>,
    parts: [
      { label: "a.", text: "Sebutkan dua syarat dua bangun datar dikatakan sebangun." },
      { label: "b.", text: "Apakah dua persegi panjang di atas sebangun? Periksa perbandingan sisi-sisinya." },
      { label: "c.", math: "\\text{Hitung: } \\frac{AB}{EF} = \\frac{BC}{FG} = \\ldots" },
    ],
  }),
  Qn(2, "Syarat Kesebangunan – Sudut", {
    type: "mixed",
    content: "Perhatikan dua segitiga berikut. Sudut-sudut segitiga ABC: ∠A = 50°, ∠B = 70°, ∠C = 60°. Sudut-sudut segitiga DEF: ∠D = 50°, ∠E = 70°, ∠F = 60°.",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["D","E","F"]} sideLabels1={["","",""]} sideLabels2={["","",""]} color1="#22d3ee" color2="#f472b6"/>,
    parts: [
      { label: "a.", text: "Apakah syarat sudut kesebangunan terpenuhi? Jelaskan." },
      { label: "b.", text: "Pasangkan sudut-sudut yang sama besar dari kedua segitiga." },
      { label: "c.", math: "\\text{Jika } AB = 6 \\text{ cm dan } DE = 9 \\text{ cm, berapakah rasio kesebangunannya?}" },
    ],
  }),
  Qn(3, "Identifikasi Pasangan Sebangun", {
    type: "mixed",
    content: "Tentukan pasangan bangun yang pasti sebangun:",
    parts: [
      { label: "A.", text: "Semua persegi" },
      { label: "B.", text: "Semua persegi panjang" },
      { label: "C.", text: "Semua lingkaran" },
      { label: "D.", text: "Semua segitiga sama sisi" },
      { label: "", text: "Dari pilihan A–D, mana yang pasti sebangun? Jelaskan alasan untuk setiap pilihan." },
    ],
  }),
  Qn(4, "Syarat Kesebangunan – Sisi", {
    type: "mixed",
    content: "Dua segitiga PQR dan STU memiliki panjang sisi: PQ = 4, QR = 6, PR = 8 dan ST = 6, TU = 9, SU = 12.",
    parts: [
      { label: "a.", text: "Periksa apakah perbandingan sisi-sisi yang bersesuaian sama." },
      { label: "b.", math: "\\frac{PQ}{ST} = \\frac{QR}{TU} = \\frac{PR}{SU} = \\ldots" },
      { label: "c.", text: "Apakah kedua segitiga itu sebangun? Berapa rasio perbandingannya?" },
    ],
  }),
  Qn(5, "Sisi Sebanding – {t('practice.multipleChoice')} – UN", {
    type: "mixed",
    content: "Perhatikan gambar berikut! △PQR sebangun dengan △XYZ karena m∠P = m∠X, m∠Q = m∠Y, dan m∠R = m∠Z. Panjang rusuk-rusuk yang sebanding adalah ....",
    diagram: <SimilarRightTrianglesPQRXYZ />,
    parts: [
      { label: "A.", math: "\\dfrac{PQ}{XY} = \\dfrac{PR}{ZY} = \\dfrac{QR}{XZ}" },
      { label: "B.", math: "\\dfrac{PQ}{XY} = \\dfrac{PR}{XZ} = \\dfrac{QR}{YZ}" },
      { label: "C.", math: "\\dfrac{PQ}{XZ} = \\dfrac{XY}{QR} = \\dfrac{ZY}{PR}" },
      { label: "D.", math: "\\dfrac{PR}{PQ} = \\dfrac{QR}{XY} = \\dfrac{ZY}{ZX}" },
    ],
  }),
  Qn(6, "Faktor Skala / Rasio Kesebangunan", {
    type: "mixed",
    diagram: <SimilarRects w1={50} h1={35} w2={100} h2={70} sides1={["5 cm","3,5 cm","",""]as any} sides2={["10 cm","7 cm","",""]as any} color1="#38bdf8" color2="#34d399"/>,
    parts: [
      { label: "a.", text: "Tentukan faktor skala dari persegi panjang kecil ke persegi panjang besar." },
      { label: "b.", math: "k = \\frac{\\text{sisi besar}}{\\text{sisi kecil}} = \\ldots" },
      { label: "c.", text: "Apa yang terjadi pada luas bangun jika faktor skalanya k?" },
      { label: "d.", math: "\\frac{L_{besar}}{L_{kecil}} = k^2 = \\ldots" },
    ],
  }),
  Qn(7, "Membandingkan Segitiga", {
    type: "mixed",
    diagram: <SimilarTriangles vertices1={["A","B","C"]} vertices2={["D","E","F"]} sideLabels1={["6","8","10"]} sideLabels2={["9","12","15"]} color1="#38bdf8" color2="#34d399" type="right"/>,
    parts: [
      { label: "a.", text: "Periksa apakah perbandingan sisi-sisi yang bersesuaian sama." },
      { label: "b.", text: "Apakah kedua segitiga sebangun? Berapa faktor skalanya?" },
      { label: "c.", text: "Apakah kedua segitiga itu merupakan segitiga siku-siku? Periksa dengan Teorema Pythagoras." },
    ],
  }),
  Qn(8, "Foto dan Bayangan", {
    type: "mixed",
    content: "Sebuah foto berukuran 4 cm × 6 cm akan diperbesar menjadi 10 cm × 15 cm.",
    parts: [
      { label: "a.", text: "Hitunglah rasio panjang foto asli terhadap foto diperbesar." },
      { label: "b.", text: "Hitunglah rasio lebar foto asli terhadap foto diperbesar." },
      { label: "c.", text: "Apakah kedua foto tersebut sebangun? Tunjukkan!" },
      { label: "d.", math: "\\text{Rasio luas} = \\left(\\frac{4}{10}\\right)^2 = \\ldots" },
    ],
  }),
  Qn(9, "Faktor Skala dari Luas", {
    type: "mixed",
    content: "Dua bangun sebangun. Luas bangun pertama 36 cm² dan luas bangun kedua 81 cm².",
    parts: [
      { label: "a.", math: "\\frac{L_2}{L_1} = \\frac{81}{36} = k^2 \\Rightarrow k = \\ldots" },
      { label: "b.", text: "Jika keliling bangun pertama 24 cm, berapa keliling bangun kedua?" },
      { label: "c.", text: "Jika sebuah sisi bangun pertama 6 cm, berapa sisi yang bersesuaian pada bangun kedua?" },
    ],
  }),
  Qn(10, "Kekongruenan dan Luas", {
    type: "mixed",
    content: "Dua bangun yang kongruen selalu memiliki luas yang sama.",
    parts: [
      { label: "a.", text: "Apakah pernyataan tersebut benar? Jelaskan." },
      { label: "b.", text: "Sebutkan dua sifat yang selalu sama pada dua bangun yang kongruen." },
      { label: "c.", text: "Bolehkah dua bangun yang luasnya sama langsung disebut kongruen? Berikan contoh kontra." },
    ],
  }),
];

const DefinisiKesebangunanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <Shapes className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(34,211,238,0.7)' }}>
            DEFINISI KESEBANGUNAN DAN KEKONGRUENAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Kesebangunan & Kekongruenan · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 10 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4 lm-kkg-hint">
          <p className="text-cyan-300 text-xs font-bold mb-2">📌 Ingat — Syarat Dua Bangun Sebangun</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { name: "Sudut Sama", emoji: "📐", desc: "Sudut-sudut yang bersesuaian sama besar" },
              { name: "Sisi Sebanding", emoji: "📏", desc: "Sisi-sisi yang bersesuaian sebanding" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-lg mb-1">{r.emoji}</div>
                <p className="text-cyan-300 text-[10px] font-bold">{r.name}</p>
                <p className="text-white/50 text-[9px]">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur lm-kkg-overlay" />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                    <span className="text-cyan-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center rounded-xl overflow-hidden">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${p.label ? 'bg-white/5' : 'bg-transparent px-0'}`}>
                            {p.label && <span className="text-cyan-400 text-xs font-bold shrink-0 mt-0.5">{p.label}</span>}
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
            {t('practice.backTo')} Kesebangunan & Kekongruenan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DefinisiKesebangunanPage;
