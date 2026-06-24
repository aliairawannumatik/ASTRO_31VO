import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─────────────────────────────────────────────
   SVG DIAGRAMS
───────────────────────────────────────────── */

/* Q3–Q5: Triangle ABC with three special lines:
   A(150,20), B(20,185), C(290,185)
   D = midpoint of BC = (155,185)  → AD = garis berat
   E ≈ (211,92) on AC             → EB = garis bagi (angle bisector from B)
   F ≈ (123,54) on AB             → CF = garis tinggi (altitude from C)
*/
const DiagramQ3Q4Q5 = () => (
  <svg viewBox="0 0 320 215" className="w-full max-w-sm mx-auto my-3" aria-label="Segitiga ABC dengan garis berat AD, garis bagi EB, dan garis tinggi CF">
    {/* Triangle */}
    <polygon points="150,20 20,185 290,185" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.75" />

    {/* AD – garis berat (median from A to midpoint D of BC) */}
    <line x1="150" y1="20" x2="155" y2="185" stroke="#22d3ee" strokeWidth="2" />

    {/* EB – garis bagi (angle bisector from B to E on AC) */}
    <line x1="20" y1="185" x2="211" y2="92" stroke="#a78bfa" strokeWidth="2" />

    {/* CF – garis tinggi (altitude from C to F on AB) */}
    <line x1="290" y1="185" x2="123" y2="54" stroke="#fb923c" strokeWidth="2" />
    {/* Right-angle mark at F(123,54) — AB direction ≈ (-0.621, 0.788), perp ≈ (0.788, 0.621) */}
    <rect
      x="115" y="50"
      width="10" height="10"
      fill="none" stroke="#fb923c" strokeWidth="1.5"
      transform="rotate(-39 120 55)"
    />

    {/* Midpoint D mark */}
    <circle cx="155" cy="185" r="3.5" fill="#22d3ee" />

    {/* Vertex labels */}
    <text x="143" y="14" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="4"   y="198" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="294" y="198" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>

    {/* Special-point labels */}
    <text x="158" y="200" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="214" y="90"  fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">E</text>
    <text x="110" y="52"  fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">F</text>

    {/* Side AB label */}
    <text x="58"  y="110" fill="#ffffff" fontSize="11" fontFamily="monospace">AB</text>
  </svg>
);

/* Q9: Triangle with garis tinggi PQ – P is apex, Q is foot on base RS */
const DiagramQ9 = () => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto my-3" aria-label="Segitiga dengan garis tinggi PQ">
    {/* Triangle R(20,175) P(110,20) S(240,175) */}
    <polygon points="110,20 20,175 240,175" fill="none" stroke="#e2e8f0" strokeWidth="2" opacity="0.75" />

    {/* Altitude PQ from P(110,20) to Q(110,175) on RS */}
    <line x1="110" y1="20" x2="110" y2="175" stroke="#fb923c" strokeWidth="2.5" />
    {/* Right angle mark at Q */}
    <rect x="110" y="163" width="12" height="12" fill="none" stroke="#fb923c" strokeWidth="1.8" />

    {/* Q point */}
    <circle cx="110" cy="175" r="3.5" fill="#fb923c" />

    {/* Labels */}
    <text x="103" y="14" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">P</text>
    <text x="3"   y="190" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">R</text>
    <text x="244" y="190" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">S</text>
    <text x="116" y="185" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">Q</text>
  </svg>
);

/* ─── Q11 option SVGs: which line is garis bagi? ─── */

/* Q11-A: line from A to midpoint of BC → garis berat (WRONG for Q11) */
const Q11A = () => (
  <svg viewBox="0 0 140 110" className="w-full h-20" aria-label="Opsi A Q11">
    <polygon points="70,10 10,95 130,95" fill="none" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.7" />
    <line x1="70" y1="10" x2="70" y2="95" stroke="#22d3ee" strokeWidth="1.8" />
    <circle cx="70" cy="95" r="3" fill="#22d3ee" />
    <text x="64" y="7"  fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="1"  y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="131" y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">C</text>
  </svg>
);

/* Q11-B: line from B perpendicular to AC → garis tinggi (WRONG for Q11) */
const Q11B = () => (
  <svg viewBox="0 0 140 110" className="w-full h-20" aria-label="Opsi B Q11">
    {/* Triangle A(70,10) B(10,95) C(130,95) */}
    <polygon points="70,10 10,95 130,95" fill="none" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.7" />
    {/* Altitude from B(10,95) to foot on AC */}
    {/* AC: A(70,10) to C(130,95). dir=(60,85). |AC|²=3600+7225=10825. (B-A)=(-60,85). dot=(-60)(60)+(85)(85)=-3600+7225=3625. t=3625/10825≈0.335. foot=(70+0.335×60,10+0.335×85)=(90.1,38.5)≈(90,39) */}
    <line x1="10" y1="95" x2="90" y2="39" stroke="#fb923c" strokeWidth="1.8" />
    <rect x="87" y="36" width="7" height="7" fill="none" stroke="#fb923c" strokeWidth="1.2" transform="rotate(35 91 40)" />
    <text x="64" y="7"  fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="1"  y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="131" y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">C</text>
  </svg>
);

/* Q11-C: line from A bisecting angle A → garis bagi (CORRECT for Q11) */
const Q11C = () => (
  <svg viewBox="0 0 140 110" className="w-full h-20" aria-label="Opsi C Q11">
    {/* Triangle A(70,10) B(10,95) C(130,95) */}
    <polygon points="70,10 10,95 130,95" fill="none" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.7" />
    {/* Angle bisector from A(70,10) to D on BC */}
    {/* AB=sqrt(60²+85²)=sqrt(10825)≈104.0, AC=sqrt(60²+85²)≈104.0 (isoceles, so D=midpoint=(70,95)) */}
    <line x1="70" y1="10" x2="70" y2="95" stroke="#a78bfa" strokeWidth="1.8" />
    {/* Angle arcs at A */}
    <path d="M 57,28 A 20,20 0 0,0 70,10" fill="none" stroke="#fb923c" strokeWidth="1" strokeDasharray="2,2" />
    <path d="M 70,10 A 20,20 0 0,0 83,28" fill="none" stroke="#fb923c" strokeWidth="1" strokeDasharray="2,2" />
    <text x="64" y="7"  fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="1"  y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="131" y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">C</text>
  </svg>
);

/* Q11-D: perpendicular bisector of BC → garis sumbu (WRONG for Q11) */
const Q11D = () => (
  <svg viewBox="0 0 140 110" className="w-full h-20" aria-label="Opsi D Q11">
    <polygon points="70,10 10,95 130,95" fill="none" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.7" />
    {/* Perpendicular bisector of BC: midpoint (70,95), goes vertically */}
    <line x1="70" y1="10" x2="70" y2="105" stroke="#4ade80" strokeWidth="1.8" strokeDasharray="4,2" />
    <rect x="70" y="88" width="7" height="7" fill="none" stroke="#4ade80" strokeWidth="1.2" />
    <circle cx="70" cy="95" r="3" fill="#4ade80" />
    <text x="64" y="7"  fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="1"  y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="131" y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">C</text>
  </svg>
);

/* ─── Q12 option SVGs: which line is garis berat? ─── */

/* Q12-A: line from A to midpoint of BC → garis berat (CORRECT for Q12) */
const Q12A = () => (
  <svg viewBox="0 0 140 110" className="w-full h-20" aria-label="Opsi A Q12">
    {/* Non-symmetric triangle A(50,10) B(10,95) C(130,95) */}
    <polygon points="50,10 10,95 130,95" fill="none" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.7" />
    {/* Midpoint of BC = (70,95) */}
    <line x1="50" y1="10" x2="70" y2="95" stroke="#22d3ee" strokeWidth="1.8" />
    <circle cx="70" cy="95" r="3" fill="#22d3ee" />
    <text x="44" y="7"  fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="1"  y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="131" y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">C</text>
  </svg>
);

/* Q12-B: line from A bisecting angle A → garis bagi (WRONG for Q12) */
const Q12B = () => (
  <svg viewBox="0 0 140 110" className="w-full h-20" aria-label="Opsi B Q12">
    {/* A(50,10) B(10,95) C(130,95) */}
    <polygon points="50,10 10,95 130,95" fill="none" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.7" />
    {/* Angle bisector from A: AB=sqrt(40²+85²)=sqrt(8825)≈93.9, AC=sqrt(80²+85²)=sqrt(13625)≈116.7 */}
    {/* D on BC: BD/DC=AB/AC=93.9/116.7. BC=120. BD=120×93.9/210.6≈53.5. D=(10+53.5,95)=(63.5,95)≈(64,95) */}
    <line x1="50" y1="10" x2="64" y2="95" stroke="#a78bfa" strokeWidth="1.8" />
    <path d="M 38,26 A 18,18 0 0,0 50,10" fill="none" stroke="#fb923c" strokeWidth="1" strokeDasharray="2,2" />
    <path d="M 50,10 A 18,18 0 0,0 64,24" fill="none" stroke="#fb923c" strokeWidth="1" strokeDasharray="2,2" />
    <text x="44" y="7"  fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="1"  y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="131" y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">C</text>
  </svg>
);

/* Q12-C: line from A perpendicular to BC → garis tinggi (WRONG for Q12) */
const Q12C = () => (
  <svg viewBox="0 0 140 110" className="w-full h-20" aria-label="Opsi C Q12">
    <polygon points="50,10 10,95 130,95" fill="none" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.7" />
    {/* Altitude from A(50,10) to BC (horizontal line y=95): foot = (50,95) */}
    <line x1="50" y1="10" x2="50" y2="95" stroke="#fb923c" strokeWidth="1.8" />
    <rect x="50" y="83" width="7" height="7" fill="none" stroke="#fb923c" strokeWidth="1.2" />
    <text x="44" y="7"  fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="1"  y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="131" y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">C</text>
  </svg>
);

/* Q12-D: perpendicular bisector of BC → garis sumbu (WRONG for Q12) */
const Q12D = () => (
  <svg viewBox="0 0 140 110" className="w-full h-20" aria-label="Opsi D Q12">
    <polygon points="50,10 10,95 130,95" fill="none" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.7" />
    {/* Perp bisector of BC: midpoint (70,95), vertical */}
    <line x1="70" y1="5" x2="70" y2="105" stroke="#4ade80" strokeWidth="1.8" strokeDasharray="4,2" />
    <rect x="70" y="88" width="7" height="7" fill="none" stroke="#4ade80" strokeWidth="1.2" />
    <circle cx="70" cy="95" r="3" fill="#4ade80" />
    <text x="44" y="7"  fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="1"  y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="131" y="105" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">C</text>
  </svg>
);

/* ─────────────────────────────────────────────
   QUESTIONS DATA
───────────────────────────────────────────── */

const OPTION_LABELS = ["A", "B", "C", "D"];

type Question = {
  id: number;
  svgDiagram?: React.ReactNode;
  content: React.ReactNode;
  options: React.ReactNode[];
};

const questions: Question[] = [
  {
    id: 1,
    content: (
      <p>
        Diketahui segitiga KLM. Titik O berada pada sisi KL. Jika O dihubungkan
        dengan titik M dengan sebuah garis, maka garis MO tegak lurus dengan
        sisi KL. Garis MO disebut ...
      </p>
    ),
    options: ["Garis berat", "Garis bagi", "Garis tinggi", "Garis sumbu"],
  },
  {
    id: 2,
    content: (
      <p>
        Diketahui segitiga PQR tumpul di P. Garis <em>k</em> tegak lurus dan
        memotong titik tengah QR. Garis <em>k</em> dinamakan ...
      </p>
    ),
    options: ["Garis berat", "Garis bagi", "Garis tinggi", "Garis sumbu"],
  },
  {
    id: 3,
    svgDiagram: <img src={"/images/segitiga_1774935300727.png"} alt="Segitiga ABC dengan garis berat, garis bagi, dan garis tinggi" className="w-full max-w-sm mx-auto my-3 rounded-lg" />,
    content: <p>Yang merupakan garis berat adalah …</p>,
    options: ["AD", "CF", "EB", "AB"],
  },
  {
    id: 4,
    svgDiagram: <img src={"/images/segitiga_1774935300727.png"} alt="Segitiga ABC dengan garis berat, garis bagi, dan garis tinggi" className="w-full max-w-sm mx-auto my-3 rounded-lg" />,
    content: <p>Yang merupakan garis bagi adalah …</p>,
    options: ["AD", "CF", "EB", "AB"],
  },
  {
    id: 5,
    svgDiagram: <img src={"/images/segitiga_1774935300727.png"} alt="Segitiga ABC dengan garis berat, garis bagi, dan garis tinggi" className="w-full max-w-sm mx-auto my-3 rounded-lg" />,
    content: <p>Yang merupakan garis tinggi adalah …</p>,
    options: ["AD", "CF", "EB", "AB"],
  },
  {
    id: 6,
    content: (
      <p>
        Garis yang membagi sebuah sudut segitiga menjadi dua sama besar
        dinamakan ...
      </p>
    ),
    options: ["Garis berat", "Garis bagi", "Garis tinggi", "Garis sumbu"],
  },
  {
    id: 7,
    content: <p>Garis sumbu adalah ....</p>,
    options: [
      "Garis yang ditarik dari sebuah sudut dalam segitiga yang tegak lurus pada sisi yang berada di hadapannya",
      "Garis yang ditarik dari sebuah sudut dalam segitiga dan membagi sisi di hadapan sudut itu menjadi dua bagian yang sama panjang",
      "Garis yang membagi sebuah sudut segitiga menjadi dua sama besar",
      "Garis yang melalui pertengahan sisi dan tegak lurus pada sisi tersebut",
    ],
  },
  {
    id: 8,
    content: (
      <p>
        Garis yang ditarik dari sebuah sudut dalam segitiga dan membagi sisi di
        hadapan sudut itu menjadi dua bagian yang sama panjang dinamakan ...
      </p>
    ),
    options: ["Garis berat", "Garis bagi", "Garis tinggi", "Garis sumbu"],
  },
  {
    id: 9,
    svgDiagram: <DiagramQ9 />,
    content: <p>garis PQ adalah garis …</p>,
    options: ["garis berat", "garis bagi", "garis tinggi", "garis sumbu"],
  },
  {
    id: 10,
    content: (
      <p>
        Garis istimewa pada segitiga yang melalui salah satu titik sudut dan
        membagi sisi di hadapan sudut tersebut menjadi dua sama panjang adalah
        garis....
      </p>
    ),
    options: ["garis berat", "garis sumbu", "garis bagi", "garis tinggi"],
  },
  {
    id: 11,
    content: <p>yang merupakan garis bagi pada segitiga ABC adalah</p>,
    options: [
      <img key="11a" src={"/images/a_1774935527164.png"} alt="Opsi A soal 11" className="w-full max-w-xs mx-auto rounded-lg" />,
      <img key="11b" src={"/images/b_1774935527165.png"} alt="Opsi B soal 11" className="w-full max-w-xs mx-auto rounded-lg" />,
      <img key="11c" src={"/images/c_1774935527166.png"} alt="Opsi C soal 11" className="w-full max-w-xs mx-auto rounded-lg" />,
      <img key="11d" src={"/images/d_1774935527166.png"} alt="Opsi D soal 11" className="w-full max-w-xs mx-auto rounded-lg" />,
    ],
  },
  {
    id: 12,
    content: <p>yang merupakan garis berat pada segitiga ABC adalah ...</p>,
    options: [
      <img key="12a" src={"/images/a_1774935527164.png"} alt="Opsi A soal 12" className="w-full max-w-xs mx-auto rounded-lg" />,
      <img key="12b" src={"/images/b_1774935527165.png"} alt="Opsi B soal 12" className="w-full max-w-xs mx-auto rounded-lg" />,
      <img key="12c" src={"/images/c_1774935527166.png"} alt="Opsi C soal 12" className="w-full max-w-xs mx-auto rounded-lg" />,
      <img key="12d" src={"/images/d_1774935527166.png"} alt="Opsi D soal 12" className="w-full max-w-xs mx-auto rounded-lg" />,
    ],
  },
];

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */

const GarisBeratBagiTinggiLatihanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          GARIS BERAT, GARIS BAGI DAN GARIS TINGGI PADA SEGITIGA
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 – Latihan Mandiri – Segitiga dan Segiempat
        </p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <h2 className="text-lg font-bold text-accent mb-4 font-display">
            Latihan Mandiri
          </h2>
          <p className="text-white/70 text-sm mb-6 font-body">
            Pilihlah jawaban yang benar.
          </p>

          <div className="space-y-8 text-white/90 font-body text-sm leading-relaxed">
            {questions.map((q) => (
              <div key={q.id} className="flex gap-3 items-start">
                <span className="shrink-0 font-bold text-accent text-sm min-w-[28px] pt-0.5 text-right">{q.id}.</span>
                <div className="flex-1 space-y-3">
                  <div>{q.content}</div>

                  {q.svgDiagram && (
                    <div>{q.svgDiagram}</div>
                  )}

                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-white/80">
                        <span className="font-semibold text-white/60 shrink-0 w-5 mt-0.5">
                          {OPTION_LABELS[idx]}.
                        </span>
                        <span className="flex-1">{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              playPopSound();
              navigate("/latihan-mandiri/kelas-7/segitiga-dan-segiempat");
            }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Segitiga dan Segiempat
          </button>
        </div>
      </div>
    </div>
  );
};

export default GarisBeratBagiTinggiLatihanPage;
