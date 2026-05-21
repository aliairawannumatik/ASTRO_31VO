import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { CheckSquare } from "lucide-react";
import imgQ1 from "@assets/image_1779360053350.png";
import imgQ2 from "@assets/Gemini_Generated_Image_ngxre9ngxre9ngxr_(1)_1779360148381.png";
import imgQ4 from "@assets/image_1779360180879.png";
import imgQ5 from "@assets/Gemini_Generated_Image_wd58awd58awd58aw_(1)_1779360225111.png";
import imgQ6 from "@assets/image_1779360254264.png";

type Q = { n: number; title: string; content: string; diagram?: React.ReactNode; options: { label: string; text: string }[] };
const Qn = (n: number, title: string, rest: Omit<Q,"n"|"title">): Q => ({ n, title, ...rest });

const SvgQ1 = () => (
  <img src={imgQ1} alt="Diagram Soal 1 - Kekongruenan" style={{maxWidth:'100%', maxHeight:280, borderRadius:12, background:'#f5f0e8'}} />
);

const SvgQ84 = () => (
  <img src={imgQ2} alt="Diagram Soal 2 - Banyak Segitiga Kongruen" style={{maxWidth:'100%', maxHeight:280, borderRadius:12, background:'#f5f0e8'}} />
);

const SvgQ86 = () => (
  <img src={imgQ4} alt="Diagram Soal 4 - Segitiga Sama Kaki Garis Bagi" style={{maxWidth:'100%', maxHeight:280, borderRadius:12, background:'#f5f0e8'}} />
);

const SvgQ88 = () => (
  <img src={imgQ5} alt="Diagram Soal 5 - Garis Sejajar Kekongruenan" style={{maxWidth:'100%', maxHeight:280, borderRadius:12, background:'#f5f0e8'}} />
);

const SvgQ89 = () => (
  <img src={imgQ6} alt="Diagram Soal 6 - Segitiga Sama Kaki Garis Tinggi" style={{maxWidth:'100%', maxHeight:280, borderRadius:12, background:'#f5f0e8'}} />
);

const questions: Q[] = [
  Qn(1, "Aksioma Kekongruenan – BC = CD", {
    diagram: <SvgQ1 />,
    content: "Diketahui panjang BC = CD. ΔCDA ≅ ΔCBE menurut aksioma . . . .",
    options: [
      { label: "A.", text: "sisi, sisi, sisi" },
      { label: "B.", text: "sisi, sisi, sudut" },
      { label: "C.", text: "sisi, sudut, sisi" },
      { label: "D.", text: "sudut, sisi, sudut" },
    ],
  }),
  Qn(2, "Banyak Segitiga Kongruen", {
    diagram: <SvgQ84 />,
    content: "Perhatikan gambar berikut. Banyak segitiga kongruen pada gambar adalah . . . .",
    options: [
      { label: "A.", text: "8 buah" },
      { label: "B.", text: "6 buah" },
      { label: "C.", text: "4 buah" },
      { label: "D.", text: "3 buah" },
    ],
  }),
  Qn(3, "Segitiga Kongruen – Panjang Sisi", {
    content: "Segitiga ABC dan segitiga DEF kongruen dengan ∠B = ∠D = 90°, panjang AB = 8 cm, dan BC = 15 cm. Panjang EF adalah . . . .",
    options: [
      { label: "A.", text: "17 cm" },
      { label: "B.", text: "15 cm" },
      { label: "C.", text: "8 cm" },
      { label: "D.", text: "7 cm" },
    ],
  }),
  Qn(4, "Segitiga Sama Kaki – Garis Bagi", {
    diagram: <SvgQ86 />,
    content: "Gambar berikut adalah ΔABC sama kaki dengan AC = BC. Jika CD adalah garis bagi dari C ke garis AB, maka dengan aksioma . . . ΔADC ≅ ΔBDC.",
    options: [
      { label: "A.", text: "sisi, sisi, sisi" },
      { label: "B.", text: "sisi, sudut, sisi" },
      { label: "C.", text: "sisi, sisi, sudut" },
      { label: "D.", text: "sudut, sisi, sudut" },
    ],
  }),
  Qn(5, "Garis Sejajar – Kekongruenan", {
    diagram: <SvgQ88 />,
    content: "Dari titik B ditarik garis sejajar AC ke bawah dan dari titik A ditarik garis sejajar BC sehingga memotong garis sebelumnya di D. ΔABC ≅ ΔBAD menurut aksioma . . . .",
    options: [
      { label: "A.", text: "sisi, sisi, sisi" },
      { label: "B.", text: "sisi, sudut, sisi" },
      { label: "C.", text: "sudut, sisi, sudut" },
      { label: "D.", text: "sisi, sisi, sudut" },
    ],
  }),
  Qn(6, "Segitiga Sama Kaki – Garis Tinggi", {
    diagram: <SvgQ89 />,
    content: "Gambar berikut menunjukkan ΔABC sama kaki dengan AB = AC. Jika CE dan BD masing-masing merupakan garis tinggi pada AB dan AC, maka ΔACE ≅ ΔABD menurut aksioma . . . .",
    options: [
      { label: "A.", text: "sisi, sisi, sisi" },
      { label: "B.", text: "sisi, sisi, sudut" },
      { label: "C.", text: "sisi, sudut, sisi" },
      { label: "D.", text: "sisi, sudut, sudut" },
    ],
  }),
];

const KekongruenBangunDatarPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <CheckSquare className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,113,133,0.7)' }}>
            KEKONGRUENAN PADA BANGUN DATAR
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Kesebangunan & Kekongruenan · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 6 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>
        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-2">📌 Empat Aksioma Kekongruenan Segitiga</p>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {[
              { name: "SSS", desc: "Sisi-Sisi-Sisi" },
              { name: "SAS", desc: "Sisi-∠-Sisi" },
              { name: "ASA", desc: "∠-Sisi-∠" },
              { name: "AAS", desc: "∠-∠-Sisi" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-2 py-2 text-center">
                <p className="text-rose-300 font-bold text-sm mb-0.5">{r.name}</p>
                <p className="text-white/50 text-[9px]">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                    <span className="text-rose-300 text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.diagram && <div className="mb-3 flex justify-center rounded-xl overflow-hidden">{q.diagram}</div>}
                    <p className="font-body text-sm text-white/90 leading-relaxed mb-3">{q.content}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                          <span className="text-amber-400 text-xs font-bold shrink-0">{opt.label}</span>
                          <span className="font-body text-sm text-white/80">{opt.text}</span>
                        </div>
                      ))}
                    </div>
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

export default KekongruenBangunDatarPage;
