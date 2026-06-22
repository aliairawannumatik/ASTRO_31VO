import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Circle } from "lucide-react";
import CircleDiagram, { CircleDiagramProps } from "./CircleDiagram";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string;
  parts?: Part[]; diagram?: CircleDiagramProps;
  img?: string; imgAlt?: string; imgCaption?: string;
  type: "essay" | "mixed";
};
const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Roda Sepeda", {
    type: "mixed",
    img: "/soal-roda-sepeda.png",
    imgAlt: "Roda sepeda dengan jari-jari 35 cm",
    imgCaption: "https://www.cycle-eirin.com/wordpress",
    content: "Roda sepeda berjari-jari 35 cm berputar di jalan.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling roda. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Jika roda berputar 100 kali, berapa meter jarak yang ditempuh?" },
      { label: "c.", text: "Berapa banyak putaran roda untuk menempuh jarak 1,1 km?" },
    ],
  }),

  Q(2, "Kolam Renang Melingkar", {
    type: "essay",
    img: "/soal-kolam-renang.png",
    imgAlt: "Kolam renang berbentuk lingkaran tampak atas",
    imgCaption: "https://www.bing.com/images/create",
    content: "Sebuah kolam renang berbentuk lingkaran berdiameter 28 m. Di sekeliling kolam dibuat jalan setapak lebar 3,5 m.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas kolam renang. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Hitung luas jalan setapak (cincin di luar kolam)." },
      { label: "c.", text: "Jika paving jalan seharga Rp 80.000/m², berapa total biaya pembuatan jalan?" },
    ],
  }),

  Q(3, "Jam Dinding", {
    type: "mixed",
    img: "/soal-jam-dinding.png",
    imgAlt: "Jam dinding berbentuk lingkaran",
    imgCaption: "https://www.bing.com/images/create",
    content: "Jam dinding berbentuk lingkaran. Jarum menit panjang 21 cm, jarum jam panjang 14 cm.",
    parts: [
      { label: "a.", text: "Berapa jarak yang ditempuh ujung jarum menit dalam 1 jam?" },
      { label: "b.", text: "Berapa jarak yang ditempuh ujung jarum jam dalam 12 jam?" },
      { label: "c.", text: "Perbandingan kecepatan ujung jarum menit : ujung jarum jam = ?" },
    ],
  }),

  Q(4, "Pizza Melingkar", {
    type: "mixed",
    img: "/soal-pizza.png",
    imgAlt: "Pizza melingkar dibagi menjadi 6 potongan sama besar",
    imgCaption: "https://www.bing.com/images/create",
    content: "Pizza berbentuk lingkaran berjari-jari 21 cm dibagi menjadi 6 bagian sama besar untuk 6 orang.",
    parts: [
      { label: "a.", math: "\\text{Hitung luas seluruh pizza. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Hitung luas setiap potongan pizza." },
      { label: "c.", text: "Jika harga pizza Rp 126.000, berapa harga per potongan?" },
    ],
  }),

  Q(5, "Taman Kota Melingkar", {
    type: "essay",
    img: "/soal-taman-kota.png",
    imgAlt: "Taman kota berbentuk lingkaran tampak atas",
    imgCaption: "https://www.bing.com/images/create",
    content: "Taman kota berbentuk lingkaran berjari-jari 70 m. Sekeliling taman akan dipasangi pagar dengan harga Rp 250.000 per meter.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling taman. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Hitung biaya total pemasangan pagar." },
      { label: "c.", text: "Jika taman akan ditanami rumput seharga Rp 50.000/m², berapa total biayanya?" },
    ],
  }),

  Q(6, "Lapangan Lari Melingkar", {
    type: "essay",
    img: "/soal-lintasan-lari.png",
    imgAlt: "Lintasan lari berbentuk melingkar tampak samping",
    imgCaption: "https://www.bing.com/images/create",
    content: "Lintasan lari berbentuk lingkaran berjari-jari 63 m. Seorang atlet berlari 5 kali putaran setiap hari selama 7 hari.",
    parts: [
      { label: "a.", math: "\\text{Hitung keliling lintasan. (} \\pi = \\tfrac{22}{7})" },
      { label: "b.", text: "Berapa meter total lintasan yang ditempuh atlet dalam sehari?" },
      { label: "c.", text: "Berapa km total lintasan selama 7 hari?" },
    ],
  }),

  Q(7, "Soal UN — Drum Silinder", {
    type: "essay",
    img: "/image_1778761973928.png",
    imgAlt: "Nelayan melempar jaring ikan berbentuk lingkaran dari perahu",
    imgCaption: "https://www.bing.com/images/create",
    content: "Jaring ikan berbentuk lingkaran. Jika diameter jaring 14 m, dan nelayan melempar jaring setiap 10 menit.",
    parts: [
      { label: "a.", text: "Berapa luas area yang tertutup jaring setiap kali dilempar?" },
      { label: "b.", text: "Dalam 1 jam, berapa kali jaring dilempar?" },
      { label: "c.", text: "Jika setiap 10 m² menghasilkan 2 kg ikan rata-rata, berapa kg ikan dalam 1 jam?" },
    ],
  }),

  Q(8, "Soal ANBK — Penangkap Ikan Jaring Melingkar", {
    type: "essay",
    img: "/image_1778762091357.png",
    imgAlt: "Meja makan berbentuk lingkaran dengan taplak meja putih",
    imgCaption: "https://www.bing.com/images/create",
    content: "Meja makan berbentuk lingkaran dengan diameter 1,4 m akan dilapisi taplak meja. Taplak menjuntai 20 cm di setiap sisi.",
    parts: [
      { label: "a.", text: "Tentukan diameter taplak meja." },
      { label: "b.", text: "Hitung luas taplak meja." },
      { label: "c.", text: "Hitung luas meja asli. Berapa persen taplak lebih luas dari meja?" },
    ],
  }),

  Q(9, "Meja Makan Melingkar", {
    type: "essay",
    img: "/image_1778762340281.png",
    imgAlt: "Diagram geometri orbit satelit mengelilingi bumi",
    imgCaption: "https://www.bing.com/images/create",
    content: "Satelit mengorbit bumi pada ketinggian 7.000 km. Jari-jari bumi ≈ 6.400 km. Orbit dianggap melingkar.",
    parts: [
      { label: "a.", text: "Tentukan jari-jari orbit satelit dari pusat bumi." },
      { label: "b.", math: "\\text{Hitung keliling orbit satelit. (} \\pi = 3{,}14)" },
      { label: "c.", text: "Jika satelit mengorbit dengan kecepatan 7 km/s, berapa detik untuk satu putaran penuh?" },
    ],
  }),

  Q(10, "Ban Mobil", {
    type: "essay",
    img: "/image_1778762645992.png",
    imgAlt: "Ban mobil melingkar di jalan basah malam hari",
    imgCaption: "https://www.bing.com/images/create",
    content: "Ban mobil memiliki jari-jari luar 35 cm. Mobil bergerak sejauh 440 m.",
    parts: [
      { label: "a.", text: "Hitung keliling ban." },
      { label: "b.", text: "Berapa kali ban berputar selama 440 m?" },
      { label: "c.", text: "Jika ban berputar 400 rpm (rotasi per menit), berapa kecepatan mobil dalam km/jam?" },
    ],
  }),

  Q(11, "Soal UN — Kolam Ikan", {
    type: "essay",
    img: "/image_1778762749930.png",
    imgAlt: "Kolam ikan berbentuk lingkaran tampak atas dengan pemilik memberi pakan",
    imgCaption: "https://www.bing.com/images/create",
    content: "Kolam ikan berbentuk lingkaran dengan diameter 14 m. Pemilik ingin memberi pakan ikan yang disebar merata.",
    parts: [
      { label: "a.", text: "Hitung luas permukaan kolam." },
      { label: "b.", text: "Jika 1 kg pakan untuk 10 m², berapa kg pakan yang diperlukan?" },
      { label: "c.", text: "Jika harga pakan Rp 25.000/kg, berapa biaya pakan sekali memberi makan?" },
    ],
  }),

  Q(12, "Soal ANBK Gabungan — Desain Taman Terpadu", {
    type: "mixed",
    img: "/image_1778763445513.png",
    imgAlt: "Desain taman terpadu 3 zona: kolam (r=3,5 m), taman bunga (r=7,7 m), lintasan jogging (r=12,6 m)",
    imgCaption: "https://www.bing.com/images/create",
    content: "Taman terpadu 3 zona:\n• Kolam: r = 3,5 m\n• Taman Bunga: r = 7,7 m (annulus)\n• Lintasan Jogging: r = 12,6 m (annulus)\n(π = 22/7)",
    parts: [
      { label: "a.", text: "Hitung luas Kolam." },
      { label: "b.", text: "Hitung luas Taman Bunga (antara kolam dan r = 7,7 m)." },
      { label: "c.", text: "Hitung luas Lintasan Jogging (antara r = 7,7 m dan r = 12,6 m)." },
      { label: "d.", text: "Jika biaya per m²: kolam Rp 500rb, taman Rp 200rb, jogging Rp 150rb — berapa total anggaran?" },
    ],
  }),
];

const PenerapanKontekstualPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,113,133,0.7)' }}>
            PENERAPAN KONSEP LINGKARAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Lingkaran · Tugas - Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 {questions.length} Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-2">🌍 Rumus untuk Penerapan Kontekstual</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { n: "Keliling", d: "K = 2πr = πd", c: "text-cyan-400" },
              { n: "Luas", d: "L = πr²", c: "text-emerald-400" },
              { n: "Panjang Busur", d: "(α/360°) × 2πr", c: "text-yellow-400" },
              { n: "Luas Juring", d: "(α/360°) × πr²", c: "text-violet-400" },
              { n: "Luas Annulus", d: "π(R² − r²)", c: "text-orange-400" },
              { n: "π ≈ 22/7", d: "jika r atau d kelipatan 7", c: "text-pink-400" },
            ].map(r => (
              <div key={r.n} className="bg-white/5 rounded-lg px-3 py-2">
                <span className={`font-bold ${r.c}`}>{r.n}: </span>
                <span className="text-white/60">{r.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                    <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.img && (
                      <div className="mb-3 flex flex-col items-center gap-1">
                        <img src={q.img} alt={q.imgAlt ?? ""} className="max-w-[220px] w-full object-contain rounded-lg bg-white/90 p-2" />
                        {q.imgCaption && (
                          <a href={q.imgCaption} target="_blank" rel="noopener noreferrer"
                            className="text-[10px] text-white/40 hover:text-rose-300 transition-colors break-all text-center font-body">
                            {q.imgCaption}
                          </a>
                        )}
                      </div>
                    )}
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CircleDiagram {...q.diagram} />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-rose-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{p.text}</p>
                            }
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenerapanKontekstualPage;
