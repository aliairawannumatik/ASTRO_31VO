import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { InlineMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─────────────────────────────────────────────
   IMAGE DIAGRAMS
───────────────────────────────────────────── */

const DiagramQ1 = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">a.</span>
      <img src={"/images/1a_1774935683575.png"} alt="Segitiga a soal 1" className="w-full max-w-[220px] mx-auto rounded-lg" />
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">b.</span>
      <img src={"/images/1b_1774935683576.png"} alt="Segitiga b soal 1" className="w-full max-w-[220px] mx-auto rounded-lg" />
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">c.</span>
      <img src={"/images/1c_1774935683576.png"} alt="Segitiga c soal 1" className="w-full max-w-[220px] mx-auto rounded-lg" />
    </div>
  </div>
);

const DiagramQ2 = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">a.</span>
      <img src={"/images/2a_1774935683577.png"} alt="Segitiga a soal 2" className="w-full max-w-[260px] mx-auto rounded-lg" />
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">b.</span>
      <img src={"/images/2b_1774935683577.png"} alt="Segitiga b soal 2" className="w-full max-w-[260px] mx-auto rounded-lg" />
    </div>
  </div>
);

const DiagramQ3 = () => (
  <img src={"/images/3_1774935683577.png"} alt="Segitiga ABC soal 3" className="w-full max-w-sm mx-auto my-4 rounded-lg" />
);

const DiagramQ4 = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">a.</span>
      <img src={"/images/4a_1774935683578.png"} alt="Bangun a soal 4" className="w-full max-w-[240px] mx-auto rounded-lg" />
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">b.</span>
      <img src={"/images/4b_1774935683578.png"} alt="Bangun b soal 4" className="w-full max-w-[240px] mx-auto rounded-lg" />
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">c.</span>
      <img src={"/images/4c_1774935683579.png"} alt="Bangun c soal 4" className="w-full max-w-[240px] mx-auto rounded-lg" />
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-accent font-semibold text-sm">d.</span>
      <img src={"/images/4d_1774935683579.png"} alt="Bangun d soal 4" className="w-full max-w-[240px] mx-auto rounded-lg" />
    </div>
  </div>
);

const DiagramQ5 = () => (
  <img src={"/images/5_1774935683579.png"} alt="Belah ketupat ABCD soal 5" className="w-full max-w-xs mx-auto my-4 rounded-lg" />
);

/* Q6: Trapezoid ABCD — DC=10 cm (top), AB=16 cm (bottom), AD=8 cm, BC=6 cm */
const DiagramQ6 = () => (
  <svg viewBox="0 0 340 210" className="w-full max-w-sm mx-auto my-4" aria-label="Trapesium ABCD">
    <polygon points="20,175 300,175 250,35 90,35" fill="rgba(248,113,113,0.10)" stroke="#f87171" strokeWidth="2" />
    <text x="4"   y="192" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="304" y="192" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="255" y="28"  fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">C</text>
    <text x="72"  y="28"  fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">D</text>
    <text x="150" y="28"  fill="#ffffff" fontSize="13" fontFamily="monospace">10 cm</text>
    <text x="145" y="195" fill="#ffffff" fontSize="13" fontFamily="monospace">16 cm</text>
    <text x="18"  y="115" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(-75 35 115)">8 cm</text>
    <text x="292" y="115" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(65 292 115)">6 cm</text>
  </svg>
);

/* ─────────────────────────────────────────────
   QUESTION CARD COMPONENT
───────────────────────────────────────────── */
type QuestionCardProps = {
  no: number;
  question: React.ReactNode;
  diagram?: React.ReactNode;
};

const QuestionCard = ({ no, question, diagram }: QuestionCardProps) => (
  <div className="flex gap-3 items-start">
    <span className="shrink-0 font-bold text-accent text-sm min-w-[28px] pt-0.5 text-right">{no}.</span>
    <div className="flex-1 space-y-3">
      <div className="text-white/90 text-sm leading-relaxed">{question}</div>
      {diagram && <div>{diagram}</div>}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */
const KelilingSegitigaSegiempatLatihanPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-lg md:text-xl font-bold text-primary text-glow-cyan mb-2 text-center">
          KELILING SEGITIGA DAN SEGIEMPAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          Kelas 7 – Latihan Mandiri – Segitiga dan Segiempat
        </p>

        <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <h2 className="text-lg font-bold text-accent mb-4 font-display">Latihan Mandiri</h2>
          <p className="text-white/70 text-sm mb-6 font-body">
            Kerjakan soal-soal berikut dengan teliti.
          </p>

          <div className="space-y-8 font-body">

            <QuestionCard
              no={1}
              diagram={<DiagramQ1 />}
              question={<p>Tentukan keliling bangun segitiga berikut.</p>}
            />

            <QuestionCard
              no={2}
              diagram={<DiagramQ2 />}
              question={
                <p>
                  Jika diketahui keliling segitiga sama kaki berikut masing-masing adalah{" "}
                  <InlineMath math="70 \text{ cm}" />, berapakah panjang sisi <InlineMath math="LM" />?
                </p>
              }
            />

            <QuestionCard
              no={3}
              diagram={<DiagramQ3 />}
              question={
                <p>
                  Jika diketahui keliling segitiga sama sisi berikut adalah{" "}
                  <InlineMath math="18 \text{ cm}" />, tentukan panjang sisi{" "}
                  <InlineMath math="AB" />, <InlineMath math="AC" />, dan <InlineMath math="BC" />.
                </p>
              }
            />

            <QuestionCard
              no={4}
              diagram={<DiagramQ4 />}
              question={<p>Tentukan keliling bangun segiempat berikut.</p>}
            />

            <QuestionCard
              no={5}
              diagram={<DiagramQ5 />}
              question={
                <p>
                  Tentukan keliling bangun belah ketupat berikut jika diketahui panjang{" "}
                  <InlineMath math="AB = 8 \text{ cm}" />.
                </p>
              }
            />

            <QuestionCard
              no={6}
              diagram={<DiagramQ6 />}
              question={<p>Tentukan keliling trapesium berikut.</p>}
            />

            <QuestionCard
              no={7}
              question={
                <p>
                  Sebuah taman rekreasi berbentuk persegi. Jika kelilingnya <InlineMath math="100" /> meter,
                  berapakah ukuran sisinya taman tersebut?
                </p>
              }
            />

            <QuestionCard
              no={8}
              question={
                <p>
                  Sepetak sawah berbentuk persegi panjang. Perbandingan ukuran panjang dan lebarnya
                  adalah <InlineMath math="2 : 1" />. Jika lebarnya <InlineMath math="15" /> meter,
                  berapakah kelilingnya?
                </p>
              }
            />

            <QuestionCard
              no={9}
              question={
                <p>
                  Sebuah layang-layang memiliki perbandingan ukuran antara sisi yang panjang dengan
                  sisi yang pendek sebesar <InlineMath math="3 : 2" />. Jika ukuran sisi yang pendek{" "}
                  <InlineMath math="24 \text{ cm}" />, tentukan ukuran sisi yang panjang dan keliling
                  layang-layang itu.
                </p>
              }
            />

            <QuestionCard
              no={10}
              question={
                <p>
                  Sebuah trapesium siku-siku perbandingan panjang dari sisi-sisi sejajarnya{" "}
                  <InlineMath math="2 : 1" />, sedangkan perbandingan panjang sisi tegak dan sisi
                  miringnya <InlineMath math="2 : 3" />. Jika panjang sisi sejajarnya yang pendek sama
                  panjang dengan panjang sisi tegaknya dan kelilingnya <InlineMath math="55 \text{ cm}" />,
                  tentukan panjang masing-masing dari keempat sisinya.
                </p>
              }
            />

            <QuestionCard
              no={11}
              question={
                <p>
                  Segitiga memiliki sisi <InlineMath math="x" />,{" "}
                  <InlineMath math="x+2" />, dan <InlineMath math="x+4" />. Jika kelilingnya{" "}
                  <InlineMath math="24 \text{ cm}" />, berapakah nilai <InlineMath math="x" />?
                </p>
              }
            />

            <QuestionCard
              no={12}
              question={
                <p>
                  Persegi panjang memiliki lebar <InlineMath math="y" /> dan panjang{" "}
                  <InlineMath math="2y" />. Jika kelilingnya <InlineMath math="36 \text{ cm}" />,
                  berapakah nilai <InlineMath math="y" />?
                </p>
              }
            />

            <QuestionCard
              no={13}
              question={
                <p>
                  Sebuah belah ketupat memiliki sisi <InlineMath math="(2x-1) \text{ cm}" />. Jika
                  kelilingnya <InlineMath math="44 \text{ cm}" />, berapakah nilai{" "}
                  <InlineMath math="x" />?
                </p>
              }
            />

            <QuestionCard
              no={14}
              question={
                <p>
                  Sebuah kebun berbentuk persegi panjang memiliki panjang <InlineMath math="20 \text{ m}" />{" "}
                  dan lebar <InlineMath math="10 \text{ m}" />. Di sekeliling kebun tersebut akan ditanami
                  pohon dengan jarak antar pohon <InlineMath math="5 \text{ m}" />. Tentukanlah banyak
                  pohon yang dibutuhkan.
                </p>
              }
            />

            <QuestionCard
              no={15}
              question={
                <p>
                  Sebuah taman berbentuk trapesium sama kaki dengan panjang sisi-sisi sejajar
                  masing-masing <InlineMath math="40 \text{ m}" /> dan <InlineMath math="16 \text{ m}" />.
                  Jika panjang sisi miring taman tersebut adalah <InlineMath math="15 \text{ m}" />, dan
                  di sekeliling taman akan dipasang lampu dengan jarak antar tiang adalah{" "}
                  <InlineMath math="4 \text{ m}" />. Tentukanlah banyak tiang lampu yang dibutuhkan.
                </p>
              }
            />

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

export default KelilingSegitigaSegiempatLatihanPage;
