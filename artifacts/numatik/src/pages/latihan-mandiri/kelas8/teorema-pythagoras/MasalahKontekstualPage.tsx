import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
    n: 2, type: "kontekstual", title: "Pesawat dan Pendaratan",
    img: "/kontekstual/soal-2.png",
    content: "Sebuah pesawat tempur berada di ketinggian 1.200 meter dari permukaan tanah. Pilot mulai menurunkan ketinggian secara konstan sejauh 150 meter per detik selama 10 detik. Berapakah jarak mendatar (horizontal) yang telah ditempuh pesawat jika total jarak lintasannya adalah 2.500 meter?",
    parts: [
      { label: "a.", math: "\\text{Penurunan ketinggian} = 150 \\times 10 = 1500\\ \\text{m}" },
      { label: "b.", math: "\\text{Ketinggian akhir} = 1200 - 1500\\ \\Rightarrow\\ \\text{cek: pesawat sudah mendarat?}" },
      { label: "c.", math: "d^2 = 2500^2 - 1200^2 = 6.250.000 - 1.440.000 = ..." },
      { label: "d.", math: "d = \\sqrt{4.810.000} \\approx ...\\ \\text{m}" },
    ],
  },
  {
    n: 3, type: "kontekstual", title: "Pengecatan Gudang",
    img: "/kontekstual/soal-3.png",
    content: "Pak Rahmat ingin mengecat sisi samping gudangnya. Dinding berbentuk persegi panjang dengan tinggi 5 m dan lebar alas 8 m, ditambah atap segitiga setinggi 3 m. Jika biaya pengecatan Rp50.000 per m², hitunglah total biaya yang harus dikeluarkan!",
    parts: [
      { label: "a.", math: "\\text{Luas persegi panjang} = 8 \\times 5 = 40\\ \\text{m}^2" },
      { label: "b.", math: "\\text{Luas segitiga atap} = \\tfrac{1}{2} \\times 8 \\times 3 = 12\\ \\text{m}^2" },
      { label: "c.", math: "\\text{Total luas} = 40 + 12 = 52\\ \\text{m}^2" },
      { label: "d.", math: "\\text{Biaya} = 52 \\times 50.000 = \\text{Rp}\\ ..." },
    ],
  },
  {
    n: 4, type: "kontekstual", title: "Layang-layang & Pohon",
    img: "/kontekstual/soal-4.png",
    content: "Dinda sedang bermain layang-layang dengan panjang tali 50 meter. Jarak posisi Dinda berdiri dengan titik tepat di bawah layang-layang adalah 30 meter. Jika tinggi tangan Dinda saat memegang tali adalah 1,5 meter dari tanah, berapakah tinggi layang-layang tersebut dari permukaan tanah?",
    parts: [
      { label: "a.", math: "h_{rel}^2 = 50^2 - 30^2 = 2500 - 900 = 1600" },
      { label: "b.", math: "h_{rel} = \\sqrt{1600} = 40\\ \\text{m}" },
      { label: "c.", math: "h_{total} = 40 + 1{,}5 = ...\\ \\text{m}" },
    ],
  },
  {
    n: 5, type: "kontekstual", title: "Jarak Tali Layang-layang",
    img: "/kontekstual/soal-5.png",
    content: "Sebuah layang-layang diikat dengan tali sepanjang 50 meter yang ditarik kencang (benang dalam keadaan tegang). Jarak dari titik pegang ke titik tepat di bawah layang-layang adalah 30 meter. Berapakah tinggi layang-layang dari tanah (Ground to Kite)?",
    parts: [
      { label: "a.", math: "h^2 = 50^2 - 30^2 = 2500 - 900 = ..." },
      { label: "b.", math: "h = \\sqrt{1600} = ...\\ \\text{m}" },
      { label: "c.", text: "Berapa meter tinggi layang-layang dari tanah?" },
    ],
  },
  {
    n: 6, type: "kontekstual", title: "Kuda-kuda Gudang",
    img: "/kontekstual/soal-6.png",
    content: "Gambar di bawah menunjukkan kerangka atap (kuda-kuda) sebuah gudang. Hitunglah total panjang kayu yang dibutuhkan jika panjang alasnya adalah 12 meter dan tinggi puncaknya adalah 4 meter!",
    parts: [
      { label: "a.", math: "\\text{Setengah alas} = 12 \\div 2 = 6\\ \\text{m}" },
      { label: "b.", math: "\\text{Sisi miring}^2 = 6^2 + 4^2 = 36 + 16 = 52" },
      { label: "c.", math: "\\text{Sisi miring} = \\sqrt{52} = 2\\sqrt{13} \\approx ...\\ \\text{m}" },
      { label: "d.", math: "\\text{Total kayu} = 12 + 2 \\times \\sqrt{52} \\approx ...\\ \\text{m}" },
    ],
  },
  {
    n: 7, type: "kontekstual", title: "Kapal & Radar",
    img: "/kontekstual/soal-7.png",
    content: "Dua buah helikopter terdeteksi oleh radar sebuah kapal induk. Radar mendeteksi helikopter A pada jarak 13 km dan helikopter B pada jarak 15 km. Jika jarak horizontal kedua helikopter dari kapal masing-masing adalah 12 km, hitunglah selisih ketinggian antara helikopter A dan helikopter B!",
    parts: [
      { label: "a.", math: "h_A^2 = 13^2 - 12^2 = 169 - 144 = 25\\ \\Rightarrow\\ h_A = 5\\ \\text{km}" },
      { label: "b.", math: "h_B^2 = 15^2 - 12^2 = 225 - 144 = 81\\ \\Rightarrow\\ h_B = 9\\ \\text{km}" },
      { label: "c.", math: "\\Delta h = h_B - h_A = 9 - 5 = ...\\ \\text{km}" },
    ],
  },
  {
    n: 8, type: "kontekstual", title: "Pohon & Kawat",
    img: "/kontekstual/soal-8.png",
    content: "Dua kawat penopang masing-masing sepanjang 1,2 m dipasang dari puncak pohon ke tanah. Jarak horizontal kawat pertama ke batang pohon adalah 0,8 m dan kawat kedua adalah 0,9 m. Berapakah tinggi pohon dari masing-masing kawat?",
    parts: [
      { label: "a.", math: "h_1^2 = 1{,}2^2 - 0{,}8^2 = 1{,}44 - 0{,}64 = 0{,}80\\ \\Rightarrow\\ h_1 = \\sqrt{0{,}8} \\approx ...\\ \\text{m}" },
      { label: "b.", math: "h_2^2 = 1{,}2^2 - 0{,}9^2 = 1{,}44 - 0{,}81 = 0{,}63\\ \\Rightarrow\\ h_2 = \\sqrt{0{,}63} \\approx ...\\ \\text{m}" },
      { label: "c.", text: "Bandingkan h₁ dan h₂. Mengapa hasilnya berbeda jika kawat sama panjang?" },
    ],
  },
];

const MasalahKontekstualPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
        <p className="text-white/40 text-xs text-center mb-1 font-body">Kelas 8 · {t('practice.breadcrumb')} · 8 Soal</p>
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
            {t('practice.backTo')} Teorema Pythagoras
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasalahKontekstualPage;
