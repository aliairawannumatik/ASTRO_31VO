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
    content: "Sebuah tangga dengan panjang 13 meter disandarkan pada dinding sebuah gedung. Jika jarak antara pangkal tangga di tanah dengan dinding gedung adalah 5 meter, berapakah tinggi dinding yang dapat dicapai oleh ujung tangga tersebut?",
    parts: [
      { label: "a.", math: "h^2 = 13^2 - 5^2 = 169 - 25 = ..." },
      { label: "b.", math: "h = \\sqrt{144} = ...\\ \\text{m}" },
      { label: "Hint:", text: "Gunakan Teorema Pythagoras" },
    ],
  },
  {
    n: 2, type: "kontekstual", title: "Pesawat & Penurunan Ketinggian",
    img: "/kontekstual/soal-2.png",
    content: "Sebuah pesawat berada di ketinggian 1.200 meter dari permukaan tanah. Pilot menurunkan ketinggian secara konstan sejauh 150 meter per detik selama 10 detik. Jika total jarak lintasannya adalah 2.500 meter, berapakah jarak mendatar (horizontal) yang ditempuh pesawat?",
    parts: [
      { label: "a.", math: "\\text{Penurunan} = 150 \\times 10 = ...\\ \\text{m}" },
      { label: "b.", math: "\\text{Ketinggian akhir} = 1200 - 1500 = ...\\ \\text{m}" },
      { label: "c.", math: "d^2 = 2500^2 - 1200^2 = ...\\ \\Rightarrow\\ d = ..." },
    ],
  },
  {
    n: 3, type: "kontekstual", title: "Biaya Cat Tembok Gudang",
    img: "/kontekstual/soal-3.png",
    content: "Pak Rahmat ingin mengecat sisi samping gudangnya. Tembok berbentuk trapesium dengan tinggi dasar 5 m, lebar 8 m, dan atap segitiga setinggi 3 m. Biaya pengecatan Rp50.000 per m². Hitunglah total biaya yang harus dikeluarkan!",
    parts: [
      { label: "a.", math: "\\text{Sisi miring atap} = \\sqrt{4^2 + 3^2} = \\sqrt{25} = ...\\ \\text{m}" },
      { label: "b.", math: "\\text{Luas dinding} = (8 \\times 5) + \\tfrac{1}{2}(8)(3) = ...\\ \\text{m}^2" },
      { label: "c.", math: "\\text{Biaya} = \\text{luas} \\times 50.000 = \\text{Rp}\\ ..." },
    ],
  },
  {
    n: 4, type: "kontekstual", title: "Layang-layang & Pohon",
    img: "/kontekstual/soal-4.png",
    content: "Dinda bermain layang-layang dengan panjang tali 50 meter. Jarak posisi Dinda berdiri dengan titik tepat di bawah layang-layang adalah 30 meter. Jika tinggi tangan Dinda saat memegang tali adalah 1,5 meter dari tanah, berapakah tinggi layang-layang dari permukaan tanah?",
    parts: [
      { label: "a.", math: "h_{rel}^2 = 50^2 - 30^2 = 2500 - 900 = ..." },
      { label: "b.", math: "h_{rel} = \\sqrt{1600} = ...\\ \\text{m}" },
      { label: "c.", math: "h_{total} = h_{rel} + 1{,}5 = ...\\ \\text{m}" },
    ],
  },
  {
    n: 5, type: "kontekstual", title: "Jarak Titik & Benang Layang-layang",
    img: "/kontekstual/soal-5.png",
    content: "Sebuah layang-layang terhubung dengan benang sepanjang 35 m yang ditarik kencang. Jarak mendatar dari pegang benang ke titik di bawah layang-layang belum diketahui. Berapakah tinggi layang-layang dari tanah jika jaraknya diketahui dari gambar?",
    parts: [
      { label: "a.", text: "Identifikasi sisi mana yang merupakan hipotenusa." },
      { label: "b.", math: "\\text{tinggi}^2 = 35^2 - \\text{jarak}^2" },
      { label: "c.", text: "Hitung nilai tinggi dari persamaan di atas." },
    ],
  },
  {
    n: 6, type: "kontekstual", title: "Struktur Rangka Atap",
    img: "/kontekstual/soal-6.png",
    content: "Sebuah kuda-kuda atap memiliki lebar total 8 m dan tinggi puncak 1,6 m dari balok tengah. Sisi balok (side beam) memiliki panjang miring yang belum diketahui (? m) dengan overlap 1 m.",
    parts: [
      { label: "a.", math: "\\text{Setengah lebar} = 8 \\div 2 = 4\\ \\text{m}" },
      { label: "b.", math: "\\text{Sisi miring}^2 = 4^2 + 1{,}6^2 = 16 + 2{,}56 = ..." },
      { label: "c.", math: "\\text{Sisi miring} = \\sqrt{18{,}56} \\approx ...\\ \\text{m}" },
      { label: "d.", text: "Tambahkan overlap 1 m untuk panjang total balok sisi." },
    ],
  },
  {
    n: 7, type: "kontekstual", title: "Kapal & Radar Pesawat",
    img: "/kontekstual/soal-7.png",
    content: "Radar kapal di laut mendeteksi Pesawat A pada jarak 12 km dan Pesawat B pada jarak 10 km. Jarak horizontal kapal dari titik referensi adalah 9 km, sedangkan Pesawat B berada pada jarak horizontal 10 km. Hitunglah selisih ketinggian antara kedua pesawat!",
    parts: [
      { label: "a.", math: "h_A^2 = 12^2 - 9^2 = 144 - 81 = ...\\ \\Rightarrow\\ h_A = ..." },
      { label: "b.", math: "h_B^2 = 10^2 - 10^2 = ...\\ \\Rightarrow\\ h_B = ..." },
      { label: "c.", math: "\\Delta h = h_A - h_B = ...\\ \\text{km}" },
    ],
  },
  {
    n: 8, type: "kontekstual", title: "Pohon & Kawat Penopang",
    img: "/kontekstual/soal-8.png",
    content: "Dua kawat penopang masing-masing sepanjang 1,2 m dipasang dari puncak pohon ke tanah. Jarak horizontal kawat pertama ke batang pohon adalah 0,8 m dan kawat kedua adalah 0,9 m. Berapakah tinggi pohon yang didapat dari masing-masing kawat? Apakah tingginya sama?",
    parts: [
      { label: "a.", math: "h_1^2 = 1{,}2^2 - 0{,}8^2 = 1{,}44 - 0{,}64 = ...\\ \\Rightarrow\\ h_1 = ..." },
      { label: "b.", math: "h_2^2 = 1{,}2^2 - 0{,}9^2 = 1{,}44 - 0{,}81 = ...\\ \\Rightarrow\\ h_2 = ..." },
      { label: "c.", text: "Bandingkan h₁ dan h₂. Apakah data kawat ini konsisten?" },
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
