import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Compass } from "lucide-react";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; img?: string; type: string };

const accent = "#f472b6";

const badge = (label: string, color: string) => (
  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mr-2 uppercase tracking-wider"
    style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}>{label}</span>
);

const rp = (p: Part, i: number) => (
  <div key={i} className="flex gap-2 items-start">
    <span className="text-xs font-bold mt-0.5 shrink-0" style={{ color: accent }}>{p.label}</span>
    <div className="text-sm text-white/85 font-body leading-relaxed">
      {p.math ? <InlineMath math={p.math} /> : p.text}
    </div>
  </div>
);

const questions: Q[] = [
  {
    n: 1, type: "mixed", title: "Segitiga ABC — Sudut 30°",
    img: "/sudut-khusus/soal-1.png",
    content: "Sebuah segitiga △ABC memiliki sudut siku-siku di B. Diketahui besar ∠C = 30° dan panjang sisi BC = 18√3 cm. Tentukanlah panjang dari:",
    parts: [
      { label: "a.", math: "AB\\ (\\text{sisi di depan } 30°)\\ =\\ BC \\times \\tan 30° = 18\\sqrt{3} \\times \\frac{1}{\\sqrt{3}} = ...\\ \\text{cm}" },
      { label: "b.", math: "AC\\ (\\text{hipotenusa})\\ =\\ \\frac{BC}{\\cos 30°} = \\frac{18\\sqrt{3}}{\\tfrac{1}{2}\\sqrt{3}} = ...\\ \\text{cm}" },
    ],
  },
  {
    n: 2, type: "mixed", title: "Segitiga XYZ — Sudut 60°",
    img: "/sudut-khusus/soal-2.png",
    content: "△XYZ merupakan segitiga siku-siku di Y dengan besar ∠X = 60°. Jika panjang sisi di depan sudut X (YZ) adalah 24 cm, hitunglah:",
    parts: [
      { label: "a.", math: "XY\\ (\\text{sisi samping } 60°)\\ =\\ \\frac{YZ}{\\tan 60°} = \\frac{24}{\\sqrt{3}} = 8\\sqrt{3} \\approx ...\\ \\text{cm}" },
      { label: "b.", math: "XZ\\ (\\text{hipotenusa})\\ =\\ \\frac{YZ}{\\sin 60°} = \\frac{24}{\\tfrac{1}{2}\\sqrt{3}} = \\frac{48}{\\sqrt{3}} = 16\\sqrt{3} \\approx ...\\ \\text{cm}" },
    ],
  },
  {
    n: 3, type: "mixed", title: "Belah Ketupat ABCD — Sudut 60°",
    img: "/sudut-khusus/soal-3.png",
    content: "Pada sebuah belah ketupat ABCD, diagonal-diagonalnya berpotongan di titik O. Diketahui besar ∠DAB = 60° dan panjang setengah diagonal AO = 15 cm. Hitunglah:",
    parts: [
      { label: "a.", math: "\\text{Sisi} = \\frac{AO}{\\cos 30°} = \\frac{15}{\\tfrac{1}{2}\\sqrt{3}} = \\frac{30}{\\sqrt{3}} = 10\\sqrt{3}\\ \\text{cm}" },
      { label: "", math: "\\text{Keliling} = 4 \\times 10\\sqrt{3} = 40\\sqrt{3} \\approx ...\\ \\text{cm}" },
      { label: "b.", math: "DO = \\text{sisi} \\times \\sin 30° = 10\\sqrt{3} \\times \\tfrac{1}{2} = 5\\sqrt{3}\\ \\text{cm}" },
      { label: "", math: "\\text{Luas} = d_1 \\times d_2 = (2 \\times 15)(2 \\times 5\\sqrt{3}) = 30 \\times 10\\sqrt{3} = 300\\sqrt{3} \\approx ...\\ \\text{cm}^2" },
    ],
  },
  {
    n: 4, type: "mixed", title: "Tiang Listrik & Bayangan — Sudut 30°",
    img: "/sudut-khusus/soal-4.png",
    content: "Sebatang tiang listrik memiliki tinggi 12 meter. Sinar matahari melewati ujung tiang membentuk sudut 30° dengan tanah (garis horizontal). Tentukan:",
    parts: [
      { label: "a.", math: "\\text{Jarak ujung tiang ke ujung bayangan (hipotenusa)} = \\frac{12}{\\sin 30°} = \\frac{12}{0{,}5} = ...\\ \\text{m}" },
      { label: "b.", math: "\\text{Panjang bayangan} = \\frac{12}{\\tan 30°} = \\frac{12}{\\tfrac{1}{\\sqrt{3}}} = 12\\sqrt{3} \\approx ...\\ \\text{m}" },
    ],
  },
  {
    n: 5, type: "mixed", title: "Atap Rumah — Sudut 45°",
    img: "/sudut-khusus/soal-5.png",
    content: "Bagian depan atap rumah berbentuk dua segitiga siku-siku identik yang saling membelakangi. Total lebar bagian bawah atap adalah 6 meter dan sudut kemiringan atap adalah 45°. Hitunglah total panjang garis miring (keliling bagian atas) atap tersebut!",
    parts: [
      { label: "a.", math: "\\text{Setengah lebar} = 6 \\div 2 = 3\\ \\text{m}" },
      { label: "b.", math: "\\text{Satu sisi miring} = \\frac{3}{\\cos 45°} = \\frac{3}{\\tfrac{1}{2}\\sqrt{2}} = 3\\sqrt{2}\\ \\text{m}" },
      { label: "c.", math: "\\text{Total garis miring} = 2 \\times 3\\sqrt{2} = 6\\sqrt{2} \\approx ...\\ \\text{m}" },
    ],
  },
  {
    n: 6, type: "mixed", title: "Persegi Panjang PQRS — Diagonal 26 cm",
    content: "Diketahui persegi panjang PQRS memiliki panjang diagonal PR = 26 cm. Jika sudut yang terbentuk antara diagonal PR dan sisi PQ adalah ∠RPQ = 60°, hitunglah:",
    parts: [
      { label: "a.", math: "PQ = PR \\times \\cos 60° = 26 \\times 0{,}5 = 13\\ \\text{cm}" },
      { label: "", math: "QR = PR \\times \\sin 60° = 26 \\times \\tfrac{1}{2}\\sqrt{3} = 13\\sqrt{3}\\ \\text{cm}" },
      { label: "", math: "\\text{Keliling} = 2(PQ + QR) = 2(13 + 13\\sqrt{3}) = 26(1 + \\sqrt{3}) \\approx ...\\ \\text{cm}" },
      { label: "b.", math: "\\text{Luas} = PQ \\times QR = 13 \\times 13\\sqrt{3} = 169\\sqrt{3} \\approx ...\\ \\text{cm}^2" },
    ],
  },
  {
    n: 7, type: "mixed", title: "Pengamat & Menara — Sudut Elevasi 45°",
    content: "Seorang pengamat berdiri sejauh 15 meter dari sebuah menara. Ia melihat puncak menara dengan sudut elevasi 45°. Jika tinggi mata pengamat dari tanah adalah 1,6 meter, berapakah tinggi menara tersebut?",
    parts: [
      { label: "a.", math: "h_{rel} = 15 \\times \\tan 45° = 15 \\times 1 = 15\\ \\text{m}" },
      { label: "b.", math: "h_{menara} = h_{rel} + 1{,}6 = 15 + 1{,}6 = ...\\ \\text{m}" },
    ],
  },
  {
    n: 8, type: "mixed", title: "Balkon & Puncak Gedung — Sudut 30° dan 60°",
    img: "/sudut-khusus/soal-8.png",
    content: "Dari titik A di permukaan tanah yang berjarak 40 meter dari kaki apartemen, seseorang melihat balkon lantai 5 dan puncak gedung dengan sudut elevasi masing-masing 30° dan 60°. Hitunglah jarak (tinggi) antara balkon lantai 5 dengan puncak gedung!",
    parts: [
      { label: "a.", math: "h_{\\text{balkon}} = 40 \\times \\tan 30° = 40 \\times \\frac{1}{\\sqrt{3}} = \\frac{40\\sqrt{3}}{3} \\approx ...\\ \\text{m}" },
      { label: "b.", math: "h_{\\text{puncak}} = 40 \\times \\tan 60° = 40\\sqrt{3} \\approx ...\\ \\text{m}" },
      { label: "c.", math: "\\Delta h = 40\\sqrt{3} - \\frac{40\\sqrt{3}}{3} = \\frac{80\\sqrt{3}}{3} \\approx ...\\ \\text{m}" },
    ],
  },
];

const SudutKhususPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Compass className="w-7 h-7" style={{ color: accent }} />
          <h1 className="font-display text-lg md:text-xl font-bold text-center" style={{ color: accent, textShadow: '0 0 20px #f472b688' }}>
            PERBANDINGAN SISI SEGITIGA SIKU-SIKU SUDUT KHUSUS
          </h1>
        </div>
        <p className="text-white/40 text-xs text-center mb-1 font-body">Kelas 8 · Tugas - Latihan Mandiri · 8 Soal</p>
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {badge("UN/USBN", "#34d399")}
          {badge("ANBK", "#60a5fa")}
          {badge("TKA", "#f472b6")}
        </div>
        <div className="flex flex-col gap-5">
          {questions.map((q) => (
            <div key={q.n} className="rounded-2xl border overflow-hidden"
              style={{ background: 'rgba(10,15,40,0.85)', borderColor: `${accent}33`, boxShadow: `0 0 12px ${accent}11` }}>
              <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: `${accent}22`, background: `${accent}11` }}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display shrink-0"
                  style={{ background: `${accent}22`, color: accent, border: `1.5px solid ${accent}55` }}>{q.n}</span>
                <span className="text-sm font-bold text-white/90 font-display">{q.title}</span>
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                {q.img && (
                  <div className="flex justify-center my-1">
                    <img src={q.img} alt={q.title} className="rounded-xl max-h-56 object-contain border border-white/10" />
                  </div>
                )}
                {q.content && <p className="text-sm text-white/80 font-body leading-relaxed">{q.content}</p>}
                {q.math && <div className="text-sm text-white/90"><BlockMath math={q.math} /></div>}
                {q.parts && (
                  <div className="flex flex-col gap-2 mt-1 pl-2 border-l-2" style={{ borderColor: `${accent}44` }}>
                    {q.parts.map(rp)}
                  </div>
                )}
                <div className="mt-2 rounded-xl p-3 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
                  <span className="text-white/30 text-xs font-body">Jawaban:</span>
                  <div className="flex-1 border-b border-dashed border-white/10 min-h-[18px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/teorema-pythagoras"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Teorema Pythagoras
          </button>
        </div>
      </div>
    </div>
  );
};

export default SudutKhususPage;
