import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Globe } from "lucide-react";

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; math?: string; parts?: Part[]; img?: string; type: string };

const accent = "#facc15";

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
    n: 1, type: "kontekstual", title: "Tangga & Dinding",
    img: "/kontekstual/soal-1.png",
    content: "Sebuah tangga bersandar pada dinding. Jarak kaki tangga ke dinding adalah 5 m dan tinggi dinding yang dicapai tangga adalah 3,5 m. Berapakah panjang tangga tersebut?",
    parts: [
      { label: "a.", math: "c^2 = 5^2 + 3{,}5^2 = 25 + 12{,}25 = ..." },
      { label: "b.", math: "c = \\sqrt{37{,}25} \\approx ...\\ \\text{m}" },
      { label: "Hint:", text: "Panjang tangga adalah hipotenusa." },
    ],
  },
  {
    n: 2, type: "kontekstual", title: "Pesawat & Penurunan Ketinggian",
    img: "/kontekstual/soal-2.png",
    content: "Sebuah pesawat terbang pada ketinggian 0,8 km dengan kecepatan 125 m/s selama 16 detik. Berapakah jarak mendatar (horizontal) yang ditempuh pesawat?",
    parts: [
      { label: "a.", math: "\\text{Jarak lintasan} = 125 \\times 16 = 2000\\ \\text{m} = 2\\ \\text{km}" },
      { label: "b.", math: "d^2 = 2^2 - 0{,}8^2 = 4 - 0{,}64 = ..." },
      { label: "c.", math: "d = \\sqrt{3{,}36} \\approx ...\\ \\text{km}" },
    ],
  },
  {
    n: 3, type: "kontekstual", title: "Pengecatan Rumah",
    img: "/kontekstual/soal-3.png",
    content: "Sisi samping rumah terdiri dari persegi panjang (lebar 6 m, tinggi 4 m) dan atap segitiga (lebar 6 m, tinggi 3,6 m). Harga cat Rp40.000/m². Hitunglah total biaya pengecatan sisi samping rumah!",
    parts: [
      { label: "a.", math: "\\text{Luas persegi panjang} = 6 \\times 4 = 24\\ \\text{m}^2" },
      { label: "b.", math: "\\text{Luas segitiga} = \\tfrac{1}{2} \\times 6 \\times 3{,}6 = ...\\ \\text{m}^2" },
      { label: "c.", math: "\\text{Total biaya} = (24 + \\text{luas segitiga}) \\times 40.000 = \\text{Rp}\\ ..." },
    ],
  },
  {
    n: 4, type: "kontekstual", title: "Layang-layang & Pohon",
    img: "/kontekstual/soal-4.png",
    content: "Seseorang menerbangkan layang-layang dengan dua tali masing-masing sepanjang 91 m. Tinggi tangan dari tanah adalah 1,4 m. Berapakah tinggi layang-layang dari permukaan tanah?",
    parts: [
      { label: "a.", text: "Karena kedua tali sama panjang (91 m), layang-layang tepat di atas titik tengah." },
      { label: "b.", math: "h_{rel}^2 = 91^2 - 91^2 = ...\\ \\text{(cek dengan jarak horizontal)}" },
      { label: "c.", math: "h_{total} = h_{rel} + 1{,}4\\ \\text{m}" },
    ],
  },
  {
    n: 5, type: "kontekstual", title: "Jarak Benang Layang-layang",
    img: "/kontekstual/soal-5.png",
    content: "Benang layang-layang sepanjang 35 m ditarik kencang (thread is taut). Berapakah tinggi layang-layang dari tanah (Ground to Kite)?",
    parts: [
      { label: "a.", text: "Benang adalah hipotenusa. Identifikasi jarak mendatar dari gambar." },
      { label: "b.", math: "\\text{tinggi}^2 = 35^2 - \\text{jarak mendatar}^2" },
      { label: "c.", text: "Hitung tinggi layang-layang dari tanah." },
    ],
  },
  {
    n: 6, type: "kontekstual", title: "Struktur Rangka Atap",
    img: "/kontekstual/soal-6.png",
    content: "Rangka atap memiliki lebar total 8 m dan tinggi puncak (ridge height) 1,6 m. Terdapat overlap 1 m di ujung balok sisi. Hitunglah panjang side beam (? m) dan total panjang balok sisi termasuk overlap (b m)!",
    parts: [
      { label: "a.", math: "\\text{Setengah lebar} = 8 \\div 2 = 4\\ \\text{m}" },
      { label: "b.", math: "\\text{Side beam}^2 = 4^2 + 1{,}6^2 = 16 + 2{,}56 = 18{,}56" },
      { label: "c.", math: "\\text{Side beam} = \\sqrt{18{,}56} \\approx ...\\ \\text{m}" },
      { label: "d.", math: "b = \\text{side beam} + 1\\ \\text{(overlap)} \\approx ...\\ \\text{m}" },
    ],
  },
  {
    n: 7, type: "kontekstual", title: "Kapal & Radar Pesawat",
    img: "/kontekstual/soal-7.png",
    content: "Radar kapal mendeteksi Pesawat A pada jarak 12 km dan Pesawat B pada jarak 10 km. Jarak horizontal kapal ke titik acuan adalah 9 km. Jarak Pesawat B secara horizontal juga 10 km. Hitunglah selisih ketinggian kedua pesawat!",
    parts: [
      { label: "a.", math: "h_A^2 = 12^2 - 9^2 = 144 - 81 = 63\\ \\Rightarrow\\ h_A = \\sqrt{63} \\approx ...\\ \\text{km}" },
      { label: "b.", math: "h_B^2 = 10^2 - 10^2 = 0\\ \\Rightarrow\\ h_B = 0\\ \\text{km}" },
      { label: "c.", math: "\\Delta h = h_A - h_B \\approx ...\\ \\text{km}" },
    ],
  },
  {
    n: 8, type: "kontekstual", title: "Pohon & Kawat Penopang",
    img: "/kontekstual/soal-8.png",
    content: "Dua kawat penopang masing-masing sepanjang 1,2 m dipasang dari puncak pohon ke tanah. Jarak horizontal kawat pertama ke pohon adalah 0,8 m dan kawat kedua adalah 0,9 m. Hitunglah tinggi pohon dari masing-masing kawat!",
    parts: [
      { label: "a.", math: "h_1^2 = 1{,}2^2 - 0{,}8^2 = 1{,}44 - 0{,}64 = 0{,}80\\ \\Rightarrow\\ h_1 = \\sqrt{0{,}8} \\approx ...\\ \\text{m}" },
      { label: "b.", math: "h_2^2 = 1{,}2^2 - 0{,}9^2 = 1{,}44 - 0{,}81 = 0{,}63\\ \\Rightarrow\\ h_2 = \\sqrt{0{,}63} \\approx ...\\ \\text{m}" },
      { label: "c.", text: "Bandingkan h₁ dan h₂. Mengapa hasilnya berbeda jika kawat sama panjang?" },
    ],
  },
];

const MasalahKontekstualPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Globe className="w-7 h-7" style={{ color: accent }} />
          <h1 className="font-display text-lg md:text-xl font-bold text-center" style={{ color: accent, textShadow: '0 0 20px #facc1588' }}>
            PENERAPAN TEOREMA PYTHAGORAS
          </h1>
        </div>
        <p className="text-white/40 text-xs text-center mb-1 font-body">Kelas 8 · Latihan Mandiri · 8 Soal</p>
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {badge("Kontekstual", "#34d399")}
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

export default MasalahKontekstualPage;
