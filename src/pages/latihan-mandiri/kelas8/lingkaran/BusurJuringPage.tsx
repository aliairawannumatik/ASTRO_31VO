import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { Circle } from "lucide-react";

type Choice = { label: string; text: string };
type Soal = {
  n: number;
  question: string;
  note?: string;
  img?: string;
  imgAlt?: string;
  choices?: Choice[];
};

const soalList: Soal[] = [
  {
    n: 1,
    question: "Perhatikan gambar lingkaran di samping! Jika O pusat lingkaran dan panjang OP = 21 cm, maka panjang busur kecil PQ adalah...",
    note: "(π = 22/7)",
    img: "/soal-busur-5.png",
    imgAlt: "Lingkaran dengan juring sudut 60°, titik O dan P",
    choices: [
      { label: "a.", text: "11 cm" },
      { label: "b.", text: "22 cm" },
      { label: "c.", text: "33 cm" },
      { label: "d.", text: "44 cm" },
    ],
  },
  {
    n: 2,
    question: "Perhatikan gambar! Jika O adalah pusat lingkaran, r = 21 cm dan π = 22/7, maka luas daerah yang diarsir adalah...",
    img: "/soal-busur-2.png",
    imgAlt: "Lingkaran dengan juring sudut 40° yang diarsir",
    choices: [
      { label: "a.", text: "77 cm²" },
      { label: "b.", text: "154 cm²" },
      { label: "c.", text: "231 cm²" },
      { label: "d.", text: "308 cm²" },
    ],
  },
  {
    n: 3,
    question: "Luas juring dengan sudut pusat 120° dan panjang jari-jari 7 cm adalah...",
    note: "(π = 22/7)",
    choices: [
      { label: "a.", text: "77 cm²" },
      { label: "b.", text: "51,33 cm²" },
      { label: "c.", text: "38,50 cm²" },
      { label: "d.", text: "14,67 cm²" },
    ],
  },
  {
    n: 4,
    question: "Perhatikan gambar! Jika luas juring ORS = 60 cm², luas juring OPQ adalah...",
    img: "/soal-busur-1.png",
    imgAlt: "Lingkaran dengan juring ORS dan OPQ, sudut POQ = 135°",
    choices: [
      { label: "a.", text: "40 cm²" },
      { label: "b.", text: "75 cm²" },
      { label: "c.", text: "90 cm²" },
      { label: "d.", text: "105 cm²" },
    ],
  },
  {
    n: 5,
    question: "Perhatikanlah gambar berikut! Diketahui O adalah titik pusat lingkaran. Jika panjang busur QR = 60 cm, panjang busur PQ adalah...",
    img: "/soal-busur-3.png",
    imgAlt: "Lingkaran dengan juring OPQ sudut 50° dan juring OQR sudut 75°",
    choices: [
      { label: "a.", text: "30 cm" },
      { label: "b.", text: "40 cm" },
      { label: "c.", text: "45 cm" },
      { label: "d.", text: "80 cm" },
    ],
  },
  {
    n: 6,
    question: "Perhatikan gambar! Pada suatu lingkaran dengan pusat O, diketahui ∠AOB = 35° dan ∠COD = 140°. Jika panjang busur AB = 14 cm, panjang busur CD adalah...",
    img: "/soal-busur-6.png",
    imgAlt: "Lingkaran dengan titik A, B, C, D; sudut AOB=35°, COD=140°, busur AB=14cm",
    choices: [
      { label: "a.", text: "28 cm" },
      { label: "b.", text: "42 cm" },
      { label: "c.", text: "56 cm" },
      { label: "d.", text: "70 cm" },
    ],
  },
];

const BusurJuringPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-yellow-500/20 border-2 border-yellow-400/60 flex items-center justify-center mb-3">
            <Circle className="w-7 h-7 text-yellow-400" />
          </div>
          <h1
            className="font-display text-xl md:text-2xl font-bold text-yellow-300 text-center mb-1"
            style={{ textShadow: "0 0 20px rgba(250,204,21,0.7)" }}
          >
            PANJANG BUSUR DAN LUAS JURING
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Lingkaran · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2">
            <span className="text-yellow-400 text-xs font-bold">📋 6 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {soalList.map((soal, i) => (
            <div
              key={soal.n}
              className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/30 via-slate-900/80 to-amber-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-yellow-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-amber-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-400/50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-yellow-300 text-xs font-bold">{soal.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-white/90 leading-relaxed mb-1">{soal.question}</p>
                    {soal.note && (
                      <p className="text-yellow-300/70 text-xs mb-3">{soal.note}</p>
                    )}
                    {soal.img && (
                      <div className="flex justify-center my-3">
                        <div className="bg-white/95 rounded-lg p-3 [@media(orientation:landscape)]:w-fit [@media(orientation:landscape)]:mx-auto">
                          <img
                            src={soal.img}
                            alt={soal.imgAlt}
                            className="max-w-[220px] [@media(orientation:landscape)]:max-w-[160px] w-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                    {soal.choices && (
                      <div className="flex flex-col gap-1.5 mt-3">
                        {soal.choices.map((c) => (
                          <div key={c.label} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-yellow-300 text-xs font-bold shrink-0 min-w-[20px]">{c.label}</span>
                            <span className="font-body text-sm text-white/80">{c.text}</span>
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
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/lingkaran"); }}
            className="text-sm text-muted-foreground hover:text-yellow-400 transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Lingkaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusurJuringPage;
