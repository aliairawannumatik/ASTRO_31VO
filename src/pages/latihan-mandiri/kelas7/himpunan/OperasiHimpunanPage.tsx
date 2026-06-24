import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─── SVG diagrams for operations ─── */

/* Union */
const VennUnion = () => (
  <svg viewBox="0 0 320 160" className="w-full max-w-xs mx-auto my-2" aria-label="Irisan / Gabungan">
    <rect x="5" y="5" width="310" height="150" rx="10" fill="none" stroke="#ffffff30" strokeWidth="1.5" />
    {/* A ∪ B shaded */}
    <ellipse cx="120" cy="80" rx="90" ry="60" fill="rgba(96,165,250,0.30)" stroke="#60a5fa" strokeWidth="2" />
    <ellipse cx="200" cy="80" rx="90" ry="60" fill="rgba(96,165,250,0.30)" stroke="#60a5fa" strokeWidth="2" />
    <text x="72"  y="55" fill="#60a5fa" fontSize="14" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="234" y="55" fill="#60a5fa" fontSize="14" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="160" y="88" fill="#facc15" fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="bold">A∪B</text>
  </svg>
);

/* Intersection */
const VennIntersection = () => (
  <svg viewBox="0 0 320 160" className="w-full max-w-xs mx-auto my-2" aria-label="Irisan">
    <rect x="5" y="5" width="310" height="150" rx="10" fill="none" stroke="#ffffff30" strokeWidth="1.5" />
    <ellipse cx="120" cy="80" rx="90" ry="60" fill="rgba(96,165,250,0.12)" stroke="#60a5fa" strokeWidth="2" />
    <ellipse cx="200" cy="80" rx="90" ry="60" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="2" />
    {/* Intersection region shaded darker */}
    <ellipse cx="160" cy="80" rx="30" ry="55" fill="rgba(250,204,21,0.30)" />
    <text x="72"  y="55" fill="#60a5fa" fontSize="14" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="234" y="55" fill="#a78bfa" fontSize="14" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="160" y="88" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">A∩B</text>
  </svg>
);

/* Difference A - B */
const VennDifference = () => (
  <svg viewBox="0 0 320 160" className="w-full max-w-xs mx-auto my-2" aria-label="Selisih A minus B">
    <rect x="5" y="5" width="310" height="150" rx="10" fill="none" stroke="#ffffff30" strokeWidth="1.5" />
    <ellipse cx="120" cy="80" rx="90" ry="60" fill="rgba(251,146,60,0.30)" stroke="#fb923c" strokeWidth="2" />
    <ellipse cx="200" cy="80" rx="90" ry="60" fill="rgba(167,139,250,0.10)" stroke="#a78bfa" strokeWidth="2" />
    {/* Subtract intersection */}
    <ellipse cx="160" cy="80" rx="30" ry="55" fill="rgba(10,10,30,0.60)" />
    <text x="72"  y="55" fill="#fb923c" fontSize="14" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="234" y="55" fill="#a78bfa" fontSize="14" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="88"  y="88" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">A\B</text>
  </svg>
);

/* Complement */
const VennComplement = () => (
  <svg viewBox="0 0 320 160" className="w-full max-w-xs mx-auto my-2" aria-label="Komplemen A">
    <rect x="5" y="5" width="310" height="150" rx="10" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="1.5" />
    <ellipse cx="160" cy="80" rx="90" ry="60" fill="rgba(10,10,30,0.60)" stroke="#60a5fa" strokeWidth="2" />
    <text x="18"  y="30" fill="#4ade80" fontSize="13" fontFamily="monospace" fontWeight="bold">S</text>
    <text x="152" y="88" fill="#60a5fa" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">A</text>
    <text x="258" y="95" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Aᶜ</text>
    <text x="55"  y="95" fill="#facc15" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Aᶜ</text>
  </svg>
);

/* ─── REUSABLE ─── */
type SectionProps = { title: string; color: string; children: React.ReactNode };
const Section = ({ title, color, children }: SectionProps) => (
  <div className="rounded-xl border p-5 space-y-6" style={{ borderColor: color + "55", background: color + "0a" }}>
    <h3 className="font-display font-bold text-sm uppercase tracking-widest" style={{ color }}>{title}</h3>
    {children}
  </div>
);

type QProps = { no: number; children: React.ReactNode; diagram?: React.ReactNode; badge?: string; badgeColor?: string };
const Q = ({ no, children, diagram, badge, badgeColor = "#60a5fa" }: QProps) => (
  <div className="flex gap-3">
    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-black" style={{ background: badgeColor }}>
      {no}
    </div>
    <div className="flex-1 space-y-2">
      {badge && (
        <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-1" style={{ background: badgeColor + "33", color: badgeColor }}>
          {badge}
        </span>
      )}
      {diagram && <div>{diagram}</div>}
      <div className="text-white/90 text-sm leading-relaxed font-body">{children}</div>
    </div>
  </div>
);

/* ─── PAGE ─── */
const OperasiHimpunanLatihanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.4)" }}>
            <BookOpen className="w-7 h-7 text-red-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1">
            OPERASI HIMPUNAN
          </h1>
          <p className="text-white/50 text-xs font-body">Kelas 7 · {t('practice.breadcrumb')} · Himpunan</p>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            {["UN", "TKA", "ANBK"].map(tag => (
              <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/30">{tag}</span>
            ))}
          </div>
        </div>

        {/* Operasi ringkas */}
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-5 py-4 mb-4 text-sm text-white/80 font-body">
          <p className="font-bold text-red-300 mb-2">Jenis Operasi Himpunan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/70">
            <div><span className="text-yellow-300 font-bold">Irisan (∩)</span><br/><InlineMath math="A \cap B = \{x \mid x \in A \text{ dan } x \in B\}" /></div>
            <div><span className="text-yellow-300 font-bold">Gabungan (∪)</span><br/><InlineMath math="A \cup B = \{x \mid x \in A \text{ atau } x \in B\}" /></div>
            <div><span className="text-yellow-300 font-bold">Selisih (\)</span><br/><InlineMath math="A \setminus B = \{x \mid x \in A \text{ dan } x \notin B\}" /></div>
            <div><span className="text-yellow-300 font-bold">Komplemen (ᶜ)</span><br/><InlineMath math="A^c = \{x \mid x \in S, x \notin A\}" /></div>
          </div>
        </div>

        {/* 4 operasi mini diagrams */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl bg-white/5 p-2"><VennUnion /><p className="text-center text-xs text-blue-300 font-mono mt-1">Gabungan A∪B</p></div>
          <div className="rounded-xl bg-white/5 p-2"><VennIntersection /><p className="text-center text-xs text-yellow-300 font-mono mt-1">Irisan A∩B</p></div>
          <div className="rounded-xl bg-white/5 p-2"><VennDifference /><p className="text-center text-xs text-orange-300 font-mono mt-1">Selisih A\B</p></div>
          <div className="rounded-xl bg-white/5 p-2"><VennComplement /><p className="text-center text-xs text-green-300 font-mono mt-1">Komplemen Aᶜ</p></div>
        </div>

        <div className="space-y-5 animate-slide-up">
          <Section title="Bagian A · Irisan (∩) dan Gabungan (∪)" color="#60a5fa">

            <Q no={1} badge="Dasar" badgeColor="#60a5fa">
              <p>
                Diketahui <InlineMath math="A = \{1,2,3,4,5,6\}" /> dan <InlineMath math="B = \{2,4,6,8,10\}" />.
                Tentukan:
                (a) <InlineMath math="A \cap B" />,&nbsp;
                (b) <InlineMath math="A \cup B" />,&nbsp;
                (c) <InlineMath math="n(A \cap B)" />,&nbsp;
                (d) <InlineMath math="n(A \cup B)" />
              </p>
            </Q>

            <Q no={2} badge="Notasi Pembentuk" badgeColor="#60a5fa">
              <p>
                Diketahui <InlineMath math="P = \{x \mid x \text{ bilangan prima} \leq 15\}" /> dan
                <InlineMath math="\; Q = \{x \mid x \text{ bilangan ganjil} \leq 10\}" />.
                Tentukan <InlineMath math="P \cap Q" /> dan <InlineMath math="P \cup Q" />!
              </p>
            </Q>

            <Q no={3} badge="Rumus" badgeColor="#60a5fa">
              <p>
                Diketahui <InlineMath math="n(A) = 20" />, <InlineMath math="n(B) = 15" />,
                <InlineMath math="\; n(A \cap B) = 7" />.
                Gunakan rumus <InlineMath math="n(A \cup B) = n(A) + n(B) - n(A \cap B)" /> untuk mencari <InlineMath math="n(A \cup B)" />!
              </p>
            </Q>

            <Q no={4} badge="UN Style" badgeColor="#60a5fa">
              <p>
                Diketahui <InlineMath math="n(A \cup B) = 40" />, <InlineMath math="n(A) = 25" />,
                <InlineMath math="\; n(A \cap B) = 10" />. Nilai <InlineMath math="n(B)" /> adalah …
              </p>
            </Q>

            <Q no={5} badge="Sifat" badgeColor="#60a5fa">
              <p>
                Tentukan mana yang benar berdasarkan sifat operasi irisan dan gabungan!
              </p>
              <BlockMath math={`\\begin{array}{l}
(a)\\; A \\cap B = B \\cap A\\\\
(b)\\; A \\cup \\emptyset = \\emptyset\\\\
(c)\\; A \\cap A = A\\\\
(d)\\; A \\cup S = A
\\end{array}`} />
            </Q>
          </Section>

          <Section title="Bagian B · Selisih (\\) dan Komplemen (ᶜ)" color="#f87171">

            <Q no={6} badge="Selisih" badgeColor="#f87171">
              <p>
                Diketahui <InlineMath math="A = \{1,2,3,4,5,6,7,8\}" /> dan <InlineMath math="B = \{2,4,6,8,10,12\}" />.
                Tentukan: (a) <InlineMath math="A \setminus B" />, (b) <InlineMath math="B \setminus A" />
              </p>
            </Q>

            <Q no={7} badge="Komplemen" badgeColor="#f87171">
              <p>
                Diketahui <InlineMath math="S = \{1,2,3,4,5,6,7,8,9,10\}" /> dan <InlineMath math="A = \{1,3,5,7,9\}" />.
                Tentukan: (a) <InlineMath math="A^c" />, (b) <InlineMath math="n(A^c)" />, (c) <InlineMath math="A \cup A^c" />, (d) <InlineMath math="A \cap A^c" />
              </p>
            </Q>

            <Q no={8} badge="ANBK" badgeColor="#f87171">
              <p>
                Diketahui <InlineMath math="S = \{a,b,c,d,e,f,g,h\}" />, <InlineMath math="A = \{a,c,e,g\}" />, <InlineMath math="B = \{b,c,d,e\}" />.
                Tentukan:
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A^c" /></li>
                <li>(b) <InlineMath math="B^c" /></li>
                <li>(c) <InlineMath math="(A \cup B)^c" /></li>
                <li>(d) <InlineMath math="A^c \cap B^c" /></li>
              </ul>
            </Q>

            <Q no={9} badge="TKA" badgeColor="#f87171">
              <p>
                Diketahui <InlineMath math="n(S) = 50" />, <InlineMath math="n(A) = 30" />.
                Tentukan <InlineMath math="n(A^c)" /> dan verifikasi bahwa <InlineMath math="n(A) + n(A^c) = n(S)" />!
              </p>
            </Q>

            <Q no={10} badge="Hukum De Morgan" badgeColor="#f87171">
              <p>
                Diketahui <InlineMath math="S = \{1,2,3,4,5,6,7,8,9,10\}" />,
                <InlineMath math="\; A = \{1,2,3,4,5\}" />, <InlineMath math="\; B = \{4,5,6,7,8\}" />.
                Verifikasi Hukum De Morgan: <InlineMath math="(A \cup B)^c = A^c \cap B^c" />
              </p>
            </Q>
          </Section>

          <Section title="Bagian C · Soal Cerita & HOTS" color="#4ade80">

            <Q no={11} badge="Kontekstual" badgeColor="#4ade80">
              <p>
                Di sebuah kelas terdapat 35 siswa. Setelah didata ekstrakurikuler:
                17 ikut Pramuka, 20 ikut Seni, dan 8 ikut keduanya.
              </p>
              <p className="mt-1">
                (a) Berapa yang hanya ikut Pramuka?<br/>
                (b) Berapa yang hanya ikut Seni?<br/>
                (c) Berapa yang tidak ikut keduanya?<br/>
                (d) Buat diagram Venn situasi ini!
              </p>
            </Q>

            <Q no={12} badge="UN 2021" badgeColor="#4ade80">
              <p>
                Dari 50 orang penduduk, 30 punya motor, 28 punya mobil, 12 punya keduanya.
                Berapa orang yang <strong className="text-green-300">tidak punya motor maupun mobil</strong>?
              </p>
            </Q>

            <Q no={13} badge="Mencari x" badgeColor="#4ade80">
              <p>
                Diketahui <InlineMath math="n(S) = 60" />, <InlineMath math="n(A) = 35" />,
                <InlineMath math="\; n(B) = 28" />, dan banyaknya yang tidak ada di <InlineMath math="A \cup B" /> adalah 7.
                Tentukan <InlineMath math="n(A \cap B)" />!
              </p>
            </Q>

            <Q no={14} badge="Gabungan Operasi" badgeColor="#4ade80">
              <p>
                Diketahui <InlineMath math="S = \{1,2,3,\ldots,12\}" />,
                <InlineMath math="\; A = \{2,4,6,8,10,12\}" />,
                <InlineMath math="\; B = \{3,6,9,12\}" />.
                Tentukan:
                (a) <InlineMath math="A \cap B" />,
                (b) <InlineMath math="A \cup B" />,
                (c) <InlineMath math="A \setminus B" />,
                (d) <InlineMath math="(A \cap B)^c" />
              </p>
            </Q>

            <Q no={15} badge="HOTS" badgeColor="#4ade80">
              <p>
                Dalam sebuah kota, 1000 warga disurvei tentang konsumsi buah:
              </p>
              <ul className="list-none mt-1 space-y-0.5 text-white/75 text-xs">
                <li>• 600 makan apel</li>
                <li>• 500 makan jeruk</li>
                <li>• 400 makan mangga</li>
                <li>• 250 makan apel dan jeruk</li>
                <li>• 200 makan apel dan mangga</li>
                <li>• 150 makan jeruk dan mangga</li>
                <li>• 100 makan ketiganya</li>
              </ul>
              <p className="mt-2">
                (a) Berapa warga yang makan setidaknya satu buah?<br/>
                (b) Berapa warga yang tidak makan satu pun buah?<br/>
                (c) Berapa warga yang hanya makan apel saja?
              </p>
            </Q>
          </Section>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-7/himpunan"); }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Himpunan
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperasiHimpunanLatihanPage;
