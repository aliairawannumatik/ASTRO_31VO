import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { InlineMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─────────────── SVG DIAGRAMS ─────────────── */

const DiagramQ1a = () => (
  <svg viewBox="0 0 280 190" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga alas 12 tinggi 9">
    <polygon points="40,160 240,160 140,30" fill="rgba(59,130,246,0.12)" stroke="#60a5fa" strokeWidth="2" />
    <line x1="140" y1="30" x2="140" y2="160" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,4" />
    <polyline points="140,148 152,148 152,160" fill="none" stroke="#facc15" strokeWidth="1.5" />
    <text x="145" y="100" fill="#ffffff" fontSize="12" fontFamily="monospace">9 cm</text>
    <text x="130" y="178" fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle">12 cm</text>
  </svg>
);

const DiagramQ1b = () => (
  <svg viewBox="0 0 260 200" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga siku-siku alas 8 tinggi 6">
    <polygon points="30,170 30,50 190,170" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="2" />
    <polyline points="30,158 42,158 42,170" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
    <text x="4"  y="115" fill="#ffffff" fontSize="12" fontFamily="monospace">6 cm</text>
    <text x="100" y="188" fill="#ffffff" fontSize="12" fontFamily="monospace">8 cm</text>
  </svg>
);

const DiagramQ1c = () => (
  <svg viewBox="0 0 300 210" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga alas 14 tinggi 10">
    <polygon points="30,180 270,180 80,40" fill="rgba(74,222,128,0.12)" stroke="#4ade80" strokeWidth="2" />
    <line x1="80" y1="40" x2="80" y2="180" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,4" />
    <polyline points="80,168 92,168 92,180" fill="none" stroke="#facc15" strokeWidth="1.5" />
    <text x="87" y="115" fill="#ffffff" fontSize="12" fontFamily="monospace">10 cm</text>
    <text x="130" y="198" fill="#ffffff" fontSize="12" fontFamily="monospace">14 cm</text>
  </svg>
);

const DiagramQ2a = () => (
  <svg viewBox="0 0 280 200" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga alas 20 tinggi 15">
    <polygon points="40,170 240,170 150,30" fill="rgba(251,146,60,0.12)" stroke="#fb923c" strokeWidth="2" />
    <line x1="150" y1="30" x2="150" y2="170" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,4" />
    <polyline points="150,158 162,158 162,170" fill="none" stroke="#facc15" strokeWidth="1.5" />
    <text x="156" y="105" fill="#ffffff" fontSize="12" fontFamily="monospace">15 cm</text>
    <text x="128" y="188" fill="#ffffff" fontSize="12" fontFamily="monospace">20 cm</text>
  </svg>
);

const DiagramQ2b = () => (
  <svg viewBox="0 0 280 210" className="w-full max-w-xs mx-auto my-2" aria-label="Segitiga sama kaki alas 18 kaki 15">
    <polygon points="140,20 30,185 250,185" fill="rgba(34,211,238,0.12)" stroke="#22d3ee" strokeWidth="2" />
    <line x1="90" y1="105" x2="100" y2="93" stroke="#22d3ee" strokeWidth="2" />
    <line x1="180" y1="93" x2="190" y2="105" stroke="#22d3ee" strokeWidth="2" />
    <line x1="140" y1="20" x2="140" y2="185" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,4" />
    <polyline points="140,173 152,173 152,185" fill="none" stroke="#facc15" strokeWidth="1.5" />
    <text x="148" y="110" fill="#ffffff" fontSize="11" fontFamily="monospace">t</text>
    <text x="110" y="202" fill="#ffffff" fontSize="12" fontFamily="monospace">18 cm</text>
    <text x="60"  y="103" fill="#ffffff" fontSize="11" fontFamily="monospace" transform="rotate(-56 80 110)">15 cm</text>
  </svg>
);

/* ─────────────── OPTION COMPONENT ─────────────── */
type OptionProps = { label: string; children: React.ReactNode };
const Opt = ({ label, children }: OptionProps) => (
  <div className="flex items-start gap-2 text-white/85 text-sm">
    <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white/70">{label}</span>
    <span className="flex-1 pt-0.5">{children}</span>
  </div>
);

/* ─────────────── SECTION HEADER ─────────────── */
type SectionProps = { title: string; color: string; children: React.ReactNode };
const Section = ({ title, color, children }: SectionProps) => (
  <div className="rounded-xl border p-5 space-y-6" style={{ borderColor: color + "55", background: color + "0a" }}>
    <h3 className="font-display font-bold text-sm uppercase tracking-widest" style={{ color }}>{title}</h3>
    {children}
  </div>
);

/* ─────────────── QUESTION CARD ─────────────── */
type QProps = { no: number; children: React.ReactNode; diagram?: React.ReactNode; badgeColor?: string };
const Q = ({ no, children, diagram, badgeColor = "#60a5fa" }: QProps) => (
  <div className="flex gap-3">
    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-black" style={{ background: badgeColor }}>
      {no}
    </div>
    <div className="flex-1 space-y-3">
      {diagram && <div>{diagram}</div>}
      <div className="text-white/90 text-sm leading-relaxed font-body">{children}</div>
    </div>
  </div>
);

/* ─────────────── PAGE ─────────────── */
const LuasSegitigaLatihanPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.4)" }}>
            <BookOpen className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1">
            LUAS SEGITIGA
          </h1>
          <p className="text-white/50 text-xs font-body">Kelas 7 · Latihan Mandiri · Segitiga dan Segiempat</p>
        </div>

        {/* Info box */}
        <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 px-5 py-4 mb-6 text-sm text-white/80 font-body leading-relaxed">
          <span className="font-bold text-blue-300">Ingat! </span>
          Rumus luas segitiga:{" "}
          <InlineMath math="L = \dfrac{1}{2} \times alas \times tinggi" />
        </div>

        <div className="space-y-5 animate-slide-up">

          {/* ── BAGIAN I: Soal Isian Pendek ── */}
          <Section title="Bagian I · Soal Isian Pendek" color="#60a5fa">

            <div>
              <p className="text-white/80 text-sm font-body mb-4">Tentukan luas dari masing-masing segitiga berikut.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-blue-300 font-semibold text-sm">a.</span>
                  <DiagramQ1a />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-blue-300 font-semibold text-sm">b.</span>
                  <DiagramQ1b />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-blue-300 font-semibold text-sm">c.</span>
                  <DiagramQ1c />
                </div>
              </div>
            </div>

            <div>
              <p className="text-white/80 text-sm font-body mb-4">Tentukan luas dari masing-masing segitiga berikut.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-blue-300 font-semibold text-sm">a.</span>
                  <DiagramQ2a />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-blue-300 font-semibold text-sm">b.</span>
                  <DiagramQ2b />
                </div>
              </div>
            </div>

          </Section>

          {/* ── BAGIAN II: Soal Pilihan Ganda ── */}
          <Section title="Bagian II · Soal Pilihan Ganda" color="#a78bfa">

            <Q no={1} badgeColor="#a78bfa">
              <p className="mb-3">
                Sebuah segitiga memiliki perbandingan alas dan tinggi <InlineMath math="3:4" />. Jika luas segitiga
                tersebut adalah <InlineMath math="96 \text{ cm}^2" />, berapakah panjang alasnya?
              </p>
              <div className="space-y-2">
                <Opt label="A">12 cm</Opt>
                <Opt label="B">16 cm</Opt>
                <Opt label="C">8 cm</Opt>
                <Opt label="D">24 cm</Opt>
              </div>
            </Q>

            <Q no={2} badgeColor="#a78bfa">
              <p className="mb-3">
                Sebuah atap rumah berbentuk segitiga dengan alas <InlineMath math="6 \text{ m}" /> dan tinggi{" "}
                <InlineMath math="2{,}5 \text{ m}" />. Jika atap tersebut akan dicat dan setiap kaleng cat bisa
                menutupi <InlineMath math="3 \text{ m}^2" />, berapa kaleng cat yang dibutuhkan?
              </p>
              <div className="space-y-2">
                <Opt label="A">4 kaleng</Opt>
                <Opt label="B">5 kaleng</Opt>
                <Opt label="C">2 kaleng</Opt>
                <Opt label="D">3 kaleng</Opt>
              </div>
            </Q>

            <Q no={3} badgeColor="#a78bfa">
              <p className="mb-3">
                Jika alas suatu segitiga bertambah 20% dan tingginya berkurang 10%, maka luas segitiga
                tersebut akan...
              </p>
              <div className="space-y-2">
                <Opt label="A">Tetap</Opt>
                <Opt label="B">Bertambah 8%</Opt>
                <Opt label="C">Bertambah 10%</Opt>
                <Opt label="D">Berkurang 2%</Opt>
              </div>
            </Q>

            <Q no={4} badgeColor="#a78bfa">
              <p className="mb-3">
                Sebuah segitiga memiliki luas <InlineMath math="x \text{ cm}^2" />. Jika alasnya dijadikan 3 kali
                semula dan tingginya dijadikan <InlineMath math="\tfrac{1}{2}" /> kali semula, berapakah luasnya
                yang baru?
              </p>
              <div className="space-y-2">
                <Opt label="A"><InlineMath math="3x \text{ cm}^2" /></Opt>
                <Opt label="B"><InlineMath math="\tfrac{1}{2}x \text{ cm}^2" /></Opt>
                <Opt label="C"><InlineMath math="\tfrac{2}{3}x \text{ cm}^2" /></Opt>
                <Opt label="D"><InlineMath math="\tfrac{3}{2}x \text{ cm}^2" /></Opt>
              </div>
            </Q>

            <Q no={5} badgeColor="#a78bfa">
              <p className="mb-3">
                Segitiga <InlineMath math="ABC" /> memiliki luas <InlineMath math="40 \text{ cm}^2" />. Titik{" "}
                <InlineMath math="D" /> terletak pada <InlineMath math="BC" /> sehingga{" "}
                <InlineMath math="BD : DC = 1 : 3" />. Berapakah luas segitiga <InlineMath math="ABD" />?
              </p>
              <div className="space-y-2">
                <Opt label="A"><InlineMath math="20 \text{ cm}^2" /></Opt>
                <Opt label="B"><InlineMath math="13{,}3 \text{ cm}^2" /></Opt>
                <Opt label="C"><InlineMath math="10 \text{ cm}^2" /></Opt>
                <Opt label="D"><InlineMath math="30 \text{ cm}^2" /></Opt>
              </div>
            </Q>

            <Q no={6} badgeColor="#a78bfa">
              <p className="mb-3">
                Sebuah taman berbentuk segitiga siku-siku dengan panjang sisi-sisi tegaknya{" "}
                <InlineMath math="(x+2) \text{ m}" /> dan <InlineMath math="(x+5) \text{ m}" />. Jika luas
                taman tersebut <InlineMath math="27 \text{ m}^2" />, berapakah nilai <InlineMath math="x" />?
              </p>
              <div className="space-y-2">
                <Opt label="A">2</Opt>
                <Opt label="B">7</Opt>
                <Opt label="C">1</Opt>
                <Opt label="D">4</Opt>
              </div>
            </Q>

            <Q no={7} badgeColor="#a78bfa">
              <p className="mb-3">
                Sebuah papan reklame berbentuk segitiga dengan alas <InlineMath math="4 \text{ m}" /> dan tinggi{" "}
                <InlineMath math="3 \text{ m}" />. Jika biaya pembuatan adalah{" "}
                <InlineMath math="Rp\,50.000" /> per <InlineMath math="\text{m}^2" />, berapakah total biayanya?
              </p>
              <div className="space-y-2">
                <Opt label="A">Rp 450.000</Opt>
                <Opt label="B">Rp 300.000</Opt>
                <Opt label="C">Rp 600.000</Opt>
                <Opt label="D">Rp 150.000</Opt>
              </div>
            </Q>

            <Q no={8} badgeColor="#a78bfa">
              <p className="mb-3">
                Sebuah segitiga memiliki luas <InlineMath math="120 \text{ cm}^2" /> dan perbandingan{" "}
                alas : tinggi <InlineMath math="= 3 : 5" />. Berapakah panjang alasnya?
              </p>
              <div className="space-y-2">
                <Opt label="A">15 cm</Opt>
                <Opt label="B">20 cm</Opt>
                <Opt label="C">12 cm</Opt>
                <Opt label="D">8 cm</Opt>
              </div>
            </Q>

          </Section>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/segitiga-dan-segiempat"); }}
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

export default LuasSegitigaLatihanPage;
