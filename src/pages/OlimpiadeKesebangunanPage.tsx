import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.slice(1, -1);
      return <InlineMath key={index} math={latex} />;
    }
    return <span key={index}>{part}</span>;
  });
};

const materiSection = {
  title: "MATERI - KESEBANGUNAN DAN KEKONGRUENAN",
  sections: [
    {
      heading: "Indikator 23",
      content: `Menyelesaikan masalah menggunakan konsep perbandingan pada kesebangunan dan kongruenan.`
    },
    {
      heading: "A. Kesebangunan",
      content: `Bangun-bangun datar yang sebangun artinya bangun-bangun datar tersebut mempunyai bentuk yang sama namun ukurannya berbeda dapat lebih besar atau lebih kecil.

Untuk membuktikan dua buah bangun datar sebangun dapat dilakukan jika memenuhi salah satu syarat di bawah ini:
1. Sudut-sudut yang bersesuaian sama besar.
2. Sisi-sisi yang bersesuaian mempunyai perbandingan yang sama.

Sisi yang bersesuaian terletak di hadapan sudut yang sama besar.

Terdapat segitiga ABC dan segitiga ADE, dengan BC sejajar DE.
Segitiga ABC dan segitiga ADE sebangun, maka:

$\\dfrac{AB}{AD} = \\dfrac{BC}{DE} = \\dfrac{AC}{AE}$  atau  $\\dfrac{AD}{AB} = \\dfrac{DE}{BC} = \\dfrac{AE}{AC}$

Pada segitiga siku-siku dapat dibuat garis tinggi ke sisi miring.
Segitiga ABC sebangun dengan segitiga ADC. Dengan menggunakan konsep kesebangunan maka diperoleh:

$AB^2 = BD \\times BC$
$AC^2 = CD \\times CB$
$AD^2 = BD \\times CD$`
    },
    {
      heading: "B. Kekongruenan",
      content: `Dua bangun dikatakan kongruen jika semua panjang sisi-sisi yang bersesuaian sama besar dan begitu juga sudutnya. Mudahnya, kita katakan bahwa dua bangun itu sama ukurannya dan sama bentuknya.

Syarat dua segitiga kongruen:
1. Sisi-Sisi-Sisi (S.S.S): Ketiga sisi yang bersesuaian sama panjang.
2. Sisi-Sudut-Sisi (S.Sd.S): Dua sisi yang bersesuaian sama panjang dan sudut yang diapit sama besar.
3. Sudut-Sisi-Sudut (Sd.S.Sd): Dua sudut yang bersesuaian sama besar dan sisi di antara kedua sudut sama panjang.
4. Sisi-Sisi-Sudut (S.S.Sd): Dua sisi yang bersesuaian sama panjang dan salah satu sudut yang bersesuaian sama besar.`
    },
  ]
};

const latihanDasar = [
  {
    no: 1,
    soal: "Perhatikan gambar bangun-bangun berikut:\n(i) Dua buah persegi\n(ii) Dua buah persegi panjang\n(iii) Dua buah segitiga sama sisi\n(iv) Dua buah belah ketupat\n\nPasangan bangun di samping yang pasti sebangun adalah ...",
    options: ["A. (i) dan (ii)", "B. (i) dan (iii)", "C. (ii) dan (iii)", "D. (ii) dan (iv)"]
  },
  {
    no: 2,
    soal: "Perhatikan persyaratan berikut:\nI. Kertas berbentuk persegi panjang berukuran 30 cm × 20 cm\nII. Sebuah papan tulis berukuran 16 cm × 12 cm\nIII. Sebuah map berukuran 14 cm × 21 cm\nIV. Sebuah dinding tembok berukuran 25 cm × 15 cm\n\nPasangan bangun yang sebangun adalah …",
    options: ["A. I dan II", "B. I dan III", "C. II dan III", "D. II dan IV"]
  },
  {
    no: 3,
    soal: "$\\triangle$ ABC kongruen dengan $\\triangle$ BDE karena memenuhi syarat ...",
    options: ["A. Sisi, sisi, sisi", "B. Sisi, sudut, sisi", "C. Sisi, sisi, sudut", "D. Sudut, sudut, sudut"]
  },
  {
    no: 4,
    soal: "Jika panjang AD = CE. Kedua segitiga di atas kongruen dengan syarat .....",
    options: ["A. Sisi, sisi, sudut", "B. Sisi, sudut, sisi", "C. Sudut, sisi, sudut", "D. Sisi, sudut, sudut"]
  },
  {
    no: 5,
    soal: "Diketahui $\\triangle$ABC dan $\\triangle$KLM adalah dua buah segitiga yang kongruen. Jika diketahui $\\angle A = \\angle L$ dan $\\angle C = \\angle K$, maka pasangan sisi-sisi yang sama panjang adalah ....",
    options: ["A. AB = KM, BC = ML, AC = KL", "B. AB = ML, BC = KL, AC = KM", "C. AB = KL, BC = KM, AC = ML", "D. AB = ML, BC = KM, AC = KL"]
  },
  {
    no: 6,
    soal: "ABCD trapesium sama kaki. Banyak pasangan segitiga kongruen pada gambar tersebut adalah …",
    options: ["A. 4 pasang", "B. 5 pasang", "C. 6 pasang", "D. 7 pasang"]
  },
  {
    no: 7,
    soal: "Dari gambar di samping, panjang TR = ..",
    options: ["A. 2 cm", "B. 3 cm", "C. 4 cm", "D. 6 cm"]
  },
  {
    no: 8,
    soal: "Panjang AD adalah …",
    options: ["A. 3 cm", "B. 4 cm", "C. 4,5 cm", "D. 5 cm"]
  },
  {
    no: 9,
    soal: "Panjang QR adalah ..",
    options: ["A. 3,8 cm", "B. 3,6 cm", "C. 3,4 cm", "D. 3,2 cm"]
  },
  {
    no: 10,
    soal: "Bangun ABCD dan AEFG sebangun. Luas bangun ABCD adalah ..",
    options: ["A. $45 \\text{ cm}^2$", "B. $62{,}5 \\text{ cm}^2$", "C. $67{,}5 \\text{ cm}^2$", "D. $90 \\text{ cm}^2$"]
  },
  {
    no: 11,
    soal: "Panjang DE adalah ....",
    options: ["A. 6 cm", "B. 7 cm", "C. 8 cm", "D. 9 cm"]
  },
  {
    no: 12,
    soal: "Diketahui panjang AB = 6 cm dan DE = 14 cm. Jika panjang AE = 15 cm maka panjang CE adalah....",
    options: ["A. 4,5 cm", "B. 10,5 cm", "C. 15 cm", "D. 21 cm"]
  },
  {
    no: 13,
    soal: "ABCD trapesium sama kaki dan sebangun dengan EFGH. Jika panjang EF = 24 cm, HG = 14 cm, EH = 13 cm dan DC = 21 cm, maka luas daerah yang diarsir adalah ....",
    options: ["A. $212 \\text{ cm}^2$", "B. $248 \\text{ cm}^2$", "C. $265 \\text{ cm}^2$", "D. $285 \\text{ cm}^2$"]
  },
  {
    no: 14,
    soal: "Sebuah tiang yang tingginya 4 m memiliki bayangan 300 cm. Pada saat yang sama bayangan sebuah pohon 10 m. Tinggi pohon tersebut adalah ....",
    options: ["A. 8 m", "B. 9 m", "C. 13,3 m", "D. 16 m"]
  },
  {
    no: 15,
    soal: "Jika AE : EC = 2 : 3, maka panjang EF adalah ….",
    options: ["A. 15 cm", "B. 22 cm", "C. 25 cm", "D. 26 cm"]
  },
  {
    no: 16,
    soal: "Jika PQRS persegi, maka panjang RT adalah ....",
    options: ["A. $5\\frac{1}{3}$ cm", "B. $6\\frac{2}{3}$ cm", "C. 7 cm", "D. $7\\frac{1}{4}$ cm"]
  },
  {
    no: 17,
    soal: "Trapesium PQUT sebangun dengan TURS. Jika PT : TS = 2 : 3, panjang SR adalah ...",
    options: ["A. 18 cm", "B. 22 cm", "C. 24 cm", "D. 27 cm"]
  },
  {
    no: 18,
    soal: "Panjang FC adalah …",
    options: ["A. 5 cm", "B. 10 cm", "C. 12 cm", "D. 14 cm"]
  },
  {
    no: 19,
    soal: "Foto yang ditempel pada kertas karton berukuran 10 cm × 15 cm. Di sebelah kiri, kanan, dan atas foto terdapat sisa karton selebar 2 cm. Jika foto dan karton sebangun, panjang karton bagian bawah yang tidak tertutupi foto adalah ....",
    options: ["A. 1 cm", "B. 2 cm", "C. 3 cm", "D. 4 cm"]
  },
  {
    no: 20,
    soal: "Foto yang ditempel pada kertas karton berukuran 20 cm × 25 cm. Di sebelah kiri, kanan, dan atas foto terdapat sisa karton selebar 2 cm. Jika foto dan karton sebangun, luas karton bagian bawah foto adalah ....",
    options: ["A. $26 \\text{ cm}^2$", "B. $30 \\text{ cm}^2$", "C. $36 \\text{ cm}^2$", "D. $72 \\text{ cm}^2$"]
  },
  {
    no: 21,
    soal: "Jika panjang BC = CD = DE = 15 cm dan AB = 11 cm, panjang CF adalah ...",
    options: ["A. 2 cm", "B. 8 cm", "C. 12 cm", "D. 13 cm"]
  },
  {
    no: 22,
    soal: "Diketahui panjang ED = 11 cm, panjang AB = BC = CD = 15 cm. Panjang garis FB adalah …",
    options: ["A. 10 cm", "B. 11 cm", "C. 12 cm", "D. 13 cm"]
  },
];

const latihanOlimpiade = [
  {
    no: 1,
    soal: "OSN Matematika 2006 Tingkat Kota\nPada segitiga PQR, S adalah titik tengah QP dan T titik tengah QR. Perbandingan antara TS dan QR adalah ...",
    options: ["A. 1 : 2", "B. 1 : 3", "C. 2 : 3", "D. 3 : 4", "E. 3 : 5"]
  },
  {
    no: 2,
    soal: "OSN Matematika 2006 Tingkat Kota\nJika CE = EB, AD = DB, besar $\\angle ABC = 30^{\\circ}$ dan panjang CA = 4 cm, maka panjang CF adalah …",
    options: ["A. $\\frac{4}{3}\\sqrt{3}$", "B. $\\frac{2}{3}\\sqrt{3}$", "C. $\\frac{4\\sqrt{3}}{6}$", "D. $\\frac{2\\sqrt{3}}{6}$", "E. $\\frac{\\sqrt{3}}{3}$"]
  },
  {
    no: 3,
    soal: "OSN Matematika 2006 Tingkat Kota\nJika luas BCDE = luas ABE, dan panjang $CD = \\sqrt{8}$, maka panjang BE = …",
    options: ["A. 4", "B. 2", "C. $\\sqrt{2}$", "D. $\\frac{1}{2}\\sqrt{2}$", "E. Jawaban A, B, C dan D tidak ada yang benar"]
  },
  {
    no: 4,
    soal: "OSN Matematika 2007 Tingkat Kota\nDiketahui PQRS adalah jajar genjang dan misalkan garis SU memotong diagonal PR di titik T, memotong ruas garis QR di titik U dan memotong garis PQ di titik V. Jika panjang ruas garis ST = 16 cm dan panjang ruas garis TU = 8 cm, maka panjang ruas garis UV adalah ... cm",
    options: ["A. 12", "B. 18", "C. 20", "D. 22", "E. 24"]
  },
  {
    no: 5,
    soal: "OSN Matematika 2010 Tingkat Kota\nPada segitiga ABC (siku-siku di C), titik Q pada AC, titik P pada AB, dan PQ sejajar BC. Panjang AQ = 3, AP = 5, BC = 8, maka luas segitiga ABC adalah ...",
    options: ["A. 48", "B. 36", "C. 24", "D. 22", "E. 12"]
  },
  {
    no: 6,
    soal: "OSN Matematika 2010 Tingkat Kota\nDiketahui jajar genjang ABCD dengan $\\angle A = \\angle C = 45^{\\circ}$. Lingkaran K dengan pusat C melalui B dan D. AD diperpanjang memotong lingkaran di E dan BE memotong CD di H. Perbandingan antara luas segitiga BCH dengan segitiga EHD adalah ...",
    options: []
  },
  {
    no: 7,
    soal: "OSN Matematika 2012 Tingkat Kota\nDiketahui persegi panjang PQRS. Panjang PV = QT = PS = 6. Titik U adalah perpotongan antara garis SV dan RT. Jika PQ = 10 maka luas segiempat PTUS adalah ...",
    options: ["A. 15", "B. 17", "C. 19", "D. 21", "E. 23"]
  },
  {
    no: 8,
    soal: "OSN Matematika 2014 Tingkat Kota\nDiketahui titik W, F dan G pada trapesium ABCD. Sisi FE sejajar dengan sisi AB. Jika AB = 7, DC = 14, DG = 8, FG = 4, BF = x dan GE = y, maka nilai x + y adalah ...",
    options: ["A. 10", "B. 11", "C. 12", "D. 13"]
  },
  {
    no: 9,
    soal: "OSN Matematika 2016 Tingkat Kota\nJika BE = 2 cm, EF = 6 cm dan FC = 4 cm, maka panjang DE adalah ...",
    options: ["A. $\\frac{6\\sqrt{6}}{4}$ cm", "B. $\\frac{6\\sqrt{3}}{3}$ cm", "C. $\\frac{3\\sqrt{6}}{4}$ cm", "D. $\\frac{2\\sqrt{3}}{3}$ cm"]
  },
  {
    no: 10,
    soal: "OSN Matematika 2016 Tingkat Kota\nPada pagi hari yang cerah, suatu bola raksasa ditempatkan di tanah lapang yang datar. Panjang bayangan bola tersebut apabila diukur dari titik singgung bola dengan tanah adalah 15 m. Di samping bola tersebut terdapat tiang vertikal dengan tinggi 1 m yang mempunyai bayangan sepanjang 3 m. Radius bola tersebut adalah ... meter",
    options: ["A. $\\dfrac{15}{10+\\sqrt{3}}$", "B. $\\dfrac{15}{10-\\sqrt{3}}$", "C. $\\dfrac{10}{5\\sqrt{2}}$", "D. $\\dfrac{10}{5-\\sqrt{2}}$"]
  },
  {
    no: 11,
    soal: "OSN Matematika 2017 Tingkat Kota\nDiketahui persegi panjang ABCD dengan AB = 12 dan BC = 5. Panjang lintasan DPQB pada gambar adalah ...",
    options: ["A. $\\dfrac{119}{13}$", "B. $\\dfrac{120}{13}$", "C. $\\dfrac{214}{13}$", "D. $\\dfrac{239}{13}$"]
  },
  {
    no: 12,
    soal: "OSN Matematika 2018 Tingkat Kota\nDiketahui jajar genjang ABCD dengan AB = 10 cm. Titik P berada di garis diagonal BD dan sebagai titik potong garis BD dan AQ, serta titik Q terletak pada CD dan BP = 2 DP. Panjang DQ adalah ... cm",
    options: ["A. 2", "B. $\\dfrac{10}{3}$", "C. 7", "D. 5"]
  },
  {
    no: 13,
    soal: "OSN Matematika 2020 Tingkat Kota\nDiketahui D titik tengah sisi AC, F titik tengah sisi BD dan DE sejajar BC. Jika G adalah titik potong AF dan DE, maka perbandingan BC : DG adalah ...",
    options: ["A. 12 : 1", "B. 8 : 1", "C. 6 : 1", "D. 4 : 1"]
  },
  {
    no: 14,
    soal: "OSN Matematika 2022 Tingkat Kota\nABCD adalah suatu persegi panjang. Dari titik C ditarik garis lurus yang memotong sisi AB di titik X. Garis CX memotong perpanjangan sisi AD di titik Y. Jika panjang BX adalah b cm, panjang DY adalah d cm, dan luas persegi panjang ABCD adalah $L$ cm², maka pernyataan yang benar adalah ...",
    options: ["A. $b \\times d = L$", "B. $b \\times d = 2L$", "C. $L < b \\times d < 2L$", "D. $b \\times d < L$"]
  },
  {
    no: 15,
    soal: "OSN Matematika 2023 Tingkat Kota\nDiketahui dua buah segitiga OAB dan OCB dengan O(0,0), A(4,0), B(0,3) dan C(2,3). Jika segitiga OCB digeser searah sumbu-x sehingga titik O terletak di tengah sisi OA, maka perbandingan antara luas irisan kedua segitiga mula-mula dan luas irisan kedua segitiga setelah segitiga OCB digeser adalah ...",
    options: ["A. 3 : 2", "B. 2 : 1", "C. 3 : 1", "D. 4 : 1"]
  },
  {
    no: 16,
    soal: "OSN Matematika 2023 Tingkat Kota\nSegitiga ABC siku-siku di A dan ADEC adalah persegi panjang. Titik H terletak pada DE dan lingkaran dengan pusat H menyinggung sisi segitiga ABC. Jika FG = 2 cm dan EF = 4 cm, maka luas segitiga ABC adalah ... $\\text{cm}^2$",
    options: ["A. 8", "B. 27", "C. 54", "D. 108"]
  },
  {
    no: 17,
    soal: "OSN Matematika 2025 Tingkat Kota\nJajargenjang ABCD memiliki keliling 106 cm dengan panjang sisi AB = (3x + 1) cm dan BC = (5x - 20) cm. Titik E pada sisi AB sehingga DE tegak lurus AB. Titik F dan H pada ruas garis CE. Titik K pada sisi AB sehingga FK sejajar DE. Jika panjang DE = (3x - 7) cm, HC = 2 × EF dan FK = 5 cm, luas daerah bangun datar yang diarsir adalah ...",
    options: ["A. 122,5", "B. 185", "C. 262,5", "D. 280"]
  },
];

const OlimpiadeKesebangunanPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - KESEBANGUNAN DAN KEKONGRUENAN
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "Materi" },
            { key: "dasar" as const, label: "Latihan Dasar" },
            { key: "olimpiade" as const, label: "Latihan Olimpiade" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`font-display text-xs px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                activeTab === tab.key
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-white/70 border-border hover:border-accent/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Materi Tab */}
        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSection.sections.map((section, idx) => (
              <div key={idx} className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
                >
                  <span className="font-display text-sm text-accent font-bold">{section.heading}</span>
                  {expandedSections.includes(idx) ? (
                    <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/50 shrink-0" />
                  )}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-5 pb-5">
                    <div className="font-body text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                      {section.content.split('\n').map((line, i) => (
                        <div key={i} className="mb-1">{renderWithLatex(line)}</div>
                      ))}
                    </div>

                    {/* Diagram: A. Kesebangunan */}
                    {idx === 1 && (
                      <div className="mt-5 space-y-5">
                        {/* Diagram 1: Segitiga ABC dengan DE sejajar BC */}
                        <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-3">
                          <p className="text-xs text-center text-cyan-400 font-display mb-2">Segitiga ABC dengan DE ∥ BC</p>
                          <svg viewBox="0 0 280 210" className="w-full max-w-xs mx-auto block" aria-label="Segitiga ABC dengan DE sejajar BC">
                            <defs>
                              <marker id="arr-kb" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                                <path d="M0,0 L6,3 L0,6 Z" fill="#22d3ee" />
                              </marker>
                            </defs>
                            {/* Triangle ABC */}
                            <line x1="140" y1="25" x2="40" y2="185" stroke="#22d3ee" strokeWidth="2" />
                            <line x1="140" y1="25" x2="240" y2="185" stroke="#22d3ee" strokeWidth="2" />
                            <line x1="40" y1="185" x2="240" y2="185" stroke="#22d3ee" strokeWidth="2" />
                            {/* Line DE parallel to BC */}
                            <line x1="85" y1="113" x2="195" y2="113" stroke="#f59e0b" strokeWidth="2.2" />
                            {/* Parallel marks on DE */}
                            <line x1="137" y1="108" x2="137" y2="118" stroke="#f59e0b" strokeWidth="1.5" />
                            <line x1="143" y1="108" x2="143" y2="118" stroke="#f59e0b" strokeWidth="1.5" />
                            {/* Parallel marks on BC */}
                            <line x1="137" y1="180" x2="137" y2="190" stroke="#22d3ee" strokeWidth="1.5" />
                            <line x1="143" y1="180" x2="143" y2="190" stroke="#22d3ee" strokeWidth="1.5" />
                            {/* Labels */}
                            <text x="140" y="16" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">A</text>
                            <text x="24" y="192" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">B</text>
                            <text x="256" y="192" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">C</text>
                            <text x="72" y="115" textAnchor="end" fill="#f59e0b" fontSize="13" fontWeight="bold">D</text>
                            <text x="208" y="115" textAnchor="start" fill="#f59e0b" fontSize="13" fontWeight="bold">E</text>
                            {/* Ratio label */}
                            <text x="140" y="105" textAnchor="middle" fill="#94a3b8" fontSize="10">DE ∥ BC</text>
                          </svg>
                        </div>

                        {/* Diagram 2: Segitiga siku-siku dengan garis tinggi ke sisi miring */}
                        <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-3">
                          <p className="text-xs text-center text-cyan-400 font-display mb-2">Segitiga Siku-Siku dengan Garis Tinggi ke Sisi Miring</p>
                          <svg viewBox="0 0 280 220" className="w-full max-w-xs mx-auto block" aria-label="Segitiga siku-siku dengan garis tinggi">
                            {/* Triangle ABC: right angle at A (140,55), B(40,190), C(240,190) */}
                            <line x1="140" y1="55" x2="40" y2="190" stroke="#22d3ee" strokeWidth="2" />
                            <line x1="140" y1="55" x2="240" y2="190" stroke="#22d3ee" strokeWidth="2" />
                            <line x1="40" y1="190" x2="240" y2="190" stroke="#22d3ee" strokeWidth="2" />
                            {/* Altitude from A down to D (140, 190) */}
                            <line x1="140" y1="55" x2="140" y2="190" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5 3" />
                            {/* Right angle mark at A (isoceles, AD is vertical, BA and CA symmetric) */}
                            <path d="M 131 64 L 140 73 L 149 64" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
                            {/* Right angle mark at D (foot of altitude) */}
                            <rect x="140" y="181" width="9" height="9" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
                            {/* Labels */}
                            <text x="140" y="46" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">A</text>
                            <text x="26" y="197" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">B</text>
                            <text x="254" y="197" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">C</text>
                            <text x="140" y="208" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold">D</text>
                            {/* BD and DC labels */}
                            <text x="90" y="208" textAnchor="middle" fill="#94a3b8" fontSize="10">BD</text>
                            <text x="190" y="208" textAnchor="middle" fill="#94a3b8" fontSize="10">DC</text>
                            {/* Formula labels */}
                            <text x="60" y="130" textAnchor="middle" fill="#f59e0b" fontSize="10">AB²=BD×BC</text>
                            <text x="220" y="130" textAnchor="middle" fill="#f59e0b" fontSize="10">AC²=DC×BC</text>
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Diagram: B. Kekongruenan */}
                    {idx === 2 && (
                      <div className="mt-5 bg-white/5 border border-cyan-500/20 rounded-xl p-3">
                        <p className="text-xs text-center text-cyan-400 font-display mb-2">Dua Segitiga yang Kongruen (≅)</p>
                        <svg viewBox="0 0 300 160" className="w-full max-w-sm mx-auto block" aria-label="Dua segitiga kongruen">
                          {/* Triangle 1: A(50,30) B(20,140) C(110,140) */}
                          <polygon points="50,30 20,140 110,140" fill="none" stroke="#22d3ee" strokeWidth="2" />
                          {/* Tick marks - SSS */}
                          {/* Side AB - 1 tick */}
                          <line x1="29" y1="82" x2="39" y2="74" stroke="#f59e0b" strokeWidth="2" />
                          {/* Side BC - 2 ticks */}
                          <line x1="59" y1="136" x2="59" y2="144" stroke="#f59e0b" strokeWidth="2" />
                          <line x1="66" y1="136" x2="66" y2="144" stroke="#f59e0b" strokeWidth="2" />
                          {/* Side AC - 3 ticks */}
                          <line x1="75" y1="78" x2="87" y2="90" stroke="#f59e0b" strokeWidth="2" />
                          <line x1="80" y1="73" x2="92" y2="85" stroke="#f59e0b" strokeWidth="2" />
                          <line x1="85" y1="68" x2="97" y2="80" stroke="#f59e0b" strokeWidth="2" />
                          {/* Labels */}
                          <text x="50" y="22" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">A</text>
                          <text x="10" y="148" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">B</text>
                          <text x="118" y="148" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">C</text>

                          {/* Congruent symbol */}
                          <text x="150" y="90" textAnchor="middle" fill="#a78bfa" fontSize="22" fontWeight="bold">≅</text>

                          {/* Triangle 2: P(230,30) Q(195,140) R(275,140) -- mirror */}
                          <polygon points="230,30 195,140 275,140" fill="none" stroke="#22d3ee" strokeWidth="2" />
                          {/* Tick marks matching */}
                          {/* Side PQ - 1 tick */}
                          <line x1="208" y1="78" x2="218" y2="86" stroke="#f59e0b" strokeWidth="2" />
                          {/* Side QR - 2 ticks */}
                          <line x1="230" y1="136" x2="230" y2="144" stroke="#f59e0b" strokeWidth="2" />
                          <line x1="237" y1="136" x2="237" y2="144" stroke="#f59e0b" strokeWidth="2" />
                          {/* Side PR - 3 ticks */}
                          <line x1="248" y1="74" x2="260" y2="86" stroke="#f59e0b" strokeWidth="2" />
                          <line x1="253" y1="69" x2="265" y2="81" stroke="#f59e0b" strokeWidth="2" />
                          <line x1="258" y1="64" x2="270" y2="76" stroke="#f59e0b" strokeWidth="2" />
                          {/* Labels */}
                          <text x="230" y="22" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">P</text>
                          <text x="184" y="148" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">Q</text>
                          <text x="283" y="148" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">R</text>
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Dasar Tab */}
        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span>{" "}
                  {soal.soal.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {lineIdx > 0 && <br />}
                      {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                    </span>
                  ))}
                </div>
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Olimpiade Tab */}
        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span>{" "}
                  {soal.soal.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {lineIdx > 0 && <br />}
                      {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                    </span>
                  ))}
                </div>
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            ← Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadeKesebangunanPage;
