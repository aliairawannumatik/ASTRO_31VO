import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─── SVG: subset diagram ─── */
const SubsetDiagram = () => (
  <svg viewBox="0 0 320 200" className="w-full max-w-xs mx-auto my-3" aria-label="Diagram himpunan bagian">
    <rect x="10" y="10" width="300" height="180" rx="12" fill="none" stroke="#ffffff30" strokeWidth="1.5" />
    <text x="20" y="30" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">S</text>
    <ellipse cx="160" cy="105" rx="120" ry="75" fill="rgba(96,165,250,0.12)" stroke="#60a5fa" strokeWidth="2" />
    <ellipse cx="145" cy="115" rx="60" ry="45" fill="rgba(167,139,250,0.18)" stroke="#a78bfa" strokeWidth="2" />
    <text x="225" y="60"  fill="#60a5fa"  fontSize="14" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="162" y="100" fill="#a78bfa"  fontSize="14" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="134" y="118" fill="#facc15"  fontSize="12" fontFamily="monospace">B⊆A</text>
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
const HimpunanBagianLatihanPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.4)" }}>
            <BookOpen className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1">
            HIMPUNAN BAGIAN
          </h1>
          <p className="text-white/50 text-xs font-body">Kelas 7 · Tugas - Latihan Mandiri · Himpunan</p>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            {["UN", "TKA", "ANBK"].map(tag => (
              <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/30">{tag}</span>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-orange-500/10 border border-orange-500/30 px-5 py-4 mb-4 text-sm text-white/80 font-body">
          <p className="font-bold text-orange-300 mb-2">Konsep Penting Himpunan Bagian</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/70">
            <span>• <InlineMath math="B \subseteq A" /> → setiap anggota <InlineMath math="B" /> juga anggota <InlineMath math="A" /></span>
            <span>• <InlineMath math="B \subsetneq A" /> → himpunan bagian sejati</span>
            <span>• <InlineMath math="\emptyset \subseteq A" /> untuk setiap <InlineMath math="A" /></span>
            <span>• Banyak himpunan bagian dari <InlineMath math="A" /> dengan <InlineMath math="n(A)=n" /> adalah <InlineMath math="2^n" /></span>
          </div>
        </div>

        <SubsetDiagram />

        <div className="space-y-5 animate-slide-up">
          <Section title="Bagian A · Menentukan Himpunan Bagian" color="#fb923c">

            <Q no={1} badge="Benar/Salah" badgeColor="#fb923c">
              <p>
                Tentukan apakah pernyataan berikut <strong className="text-green-300">BENAR</strong> atau <strong className="text-red-400">SALAH</strong>!
              </p>
              <BlockMath math={`\\begin{array}{l}
(a)\\; \\{1,2\\} \\subseteq \\{1,2,3,4\\}\\\\
(b)\\; \\{5\\} \\subseteq \\{1,2,3,4\\}\\\\
(c)\\; \\emptyset \\subseteq \\{a,b,c\\}\\\\
(d)\\; \\{1,2,3\\} \\subseteq \\{1,2,3\\}
\\end{array}`} />
            </Q>

            <Q no={2} badge="Mendaftar Subset" badgeColor="#fb923c">
              <p>
                Daftarkan semua himpunan bagian dari himpunan-himpunan berikut!
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A = \{p, q\}" /></li>
                <li>(b) <InlineMath math="B = \{1, 2, 3\}" /></li>
                <li>(c) <InlineMath math="C = \emptyset" /></li>
              </ul>
            </Q>

            <Q no={3} badge="Menghitung" badgeColor="#fb923c">
              <p>
                Tentukan banyak himpunan bagian dari:
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A = \{a, b, c, d\}" /></li>
                <li>(b) <InlineMath math="B" /> dengan <InlineMath math="n(B) = 5" /></li>
                <li>(c) <InlineMath math="C = \{x \mid x \text{ faktor dari 6}\}" /></li>
              </ul>
            </Q>

            <Q no={4} badge="UN Style" badgeColor="#fb923c">
              <p>
                Diketahui <InlineMath math="P = \{1, 2, 3, 4, 5\}" />. Banyak himpunan bagian <InlineMath math="P" /> yang
                memiliki tepat <strong className="text-orange-300">3 anggota</strong> adalah …
              </p>
            </Q>

            <Q no={5} badge="Himpunan Kuasa" badgeColor="#fb923c">
              <p>
                Himpunan kuasa (power set) dari <InlineMath math="A = \{x, y, z\}" /> adalah kumpulan
                semua himpunan bagian dari <InlineMath math="A" />.
                Tuliskan semua anggota himpunan kuasa <InlineMath math="\mathcal{P}(A)" /> dan tentukan <InlineMath math="n(\mathcal{P}(A))" />!
              </p>
            </Q>
          </Section>

          <Section title="Bagian B · Relasi Antar Himpunan" color="#a78bfa">

            <Q no={6} badge="Subset atau Bukan" badgeColor="#a78bfa">
              <p>
                Diketahui <InlineMath math="S = \{1,2,3,\ldots,10\}" />. Tentukan apakah <InlineMath math="A \subseteq B" />!
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A = \{2,4,6\}" />, <InlineMath math="B = \{2,4,6,8,10\}" /></li>
                <li>(b) <InlineMath math="A = \{1,3,5,7\}" />, <InlineMath math="B = \{1,2,3,4\}" /></li>
                <li>(c) <InlineMath math="A = \{9\}" />, <InlineMath math="B = \{3,6,9\}" /></li>
              </ul>
            </Q>

            <Q no={7} badge="ANBK" badgeColor="#a78bfa">
              <p>
                Diketahui <InlineMath math="A \subseteq B" /> dan <InlineMath math="B \subseteq A" />.
                Apa yang dapat disimpulkan tentang hubungan <InlineMath math="A" /> dan <InlineMath math="B" />? Berikan contoh!
              </p>
            </Q>

            <Q no={8} badge="Melengkapi" badgeColor="#a78bfa">
              <p>
                Lengkapi titik-titik dengan <InlineMath math="\subseteq" /> atau <InlineMath math="\not\subseteq" />!
              </p>
              <BlockMath math={`\\begin{array}{l}
(a)\\; \\{a,e,i\\} \\;\\_\\_\\_\\; \\{a,b,c,d,e,f,i\\}\\\\
(b)\\; \\{2,4,6\\} \\;\\_\\_\\_\\; \\{1,3,5,7,9\\}\\\\
(c)\\; \\emptyset \\;\\_\\_\\_\\; \\{0\\}
\\end{array}`} />
            </Q>

            <Q no={9} badge="TKA" badgeColor="#a78bfa">
              <p>
                Jika <InlineMath math="n(A) = 4" />, berapakah banyak himpunan bagian <InlineMath math="A" /> yang:
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) Memiliki 0 anggota</li>
                <li>(b) Memiliki 1 anggota</li>
                <li>(c) Memiliki 2 anggota</li>
                <li>(d) Memiliki tepat 4 anggota</li>
              </ul>
            </Q>

            <Q no={10} badge="Penalaran" badgeColor="#a78bfa">
              <p>
                Diketahui himpunan <InlineMath math="A = \{1, 2, 3\}" />.
                Berapa banyak himpunan bagian <InlineMath math="A" /> yang <strong className="text-violet-300">bukan himpunan kosong</strong> dan
                <strong className="text-violet-300"> bukan</strong> <InlineMath math="A" /> itu sendiri?
              </p>
            </Q>
          </Section>

          <Section title="Bagian C · Aplikasi & HOTS" color="#4ade80">

            <Q no={11} badge="Kontekstual" badgeColor="#4ade80">
              <p>
                Diketahui <InlineMath math="M" /> = himpunan makanan bergizi = {"{nasi, sayur, buah, ikan, telur}"}.
                Seorang anak makan nasi, sayur, dan buah hari ini.
                Nyatakan makanan yang dimakan sebagai himpunan <InlineMath math="D" /> dan tunjukkan bahwa <InlineMath math="D \subseteq M" />!
              </p>
            </Q>

            <Q no={12} badge="UN 2020" badgeColor="#4ade80">
              <p>
                Himpunan <InlineMath math="Q = \{x \mid 1 \leq x \leq 4,\; x \in \mathbb{N}\}" />.
                Tentukan banyaknya himpunan bagian <InlineMath math="Q" /> yang memiliki anggota lebih dari 2!
              </p>
            </Q>

            <Q no={13} badge="Menyimpulkan" badgeColor="#4ade80">
              <p>
                Perhatikan pernyataan berikut. Tentukan mana yang BENAR!
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(A) Setiap himpunan adalah himpunan bagian dari dirinya sendiri</li>
                <li>(B) Himpunan kosong bukan himpunan bagian dari semua himpunan</li>
                <li>(C) Jika <InlineMath math="n(A) = 3" />, banyak himpunan bagian <InlineMath math="A" /> adalah 6</li>
                <li>(D) Himpunan kosong tidak memiliki himpunan bagian</li>
              </ul>
            </Q>

            <Q no={14} badge="HOTS" badgeColor="#4ade80">
              <p>
                Diketahui <InlineMath math="A \subseteq B" />, <InlineMath math="n(A) = 3" />, dan <InlineMath math="n(B) = 5" />.
                Berapa banyak kemungkinan himpunan <InlineMath math="B \setminus A" /> (anggota B yang bukan anggota A)?
                Jika <InlineMath math="A = \{1,2,3\}" /> dan <InlineMath math="B = \{1,2,3,4,5\}" />, sebutkan anggota <InlineMath math="B \setminus A" />!
              </p>
            </Q>

            <Q no={15} badge="UN Style" badgeColor="#4ade80">
              <p>
                Dari pernyataan berikut, tentukan yang <strong className="text-green-300">BENAR</strong>!
              </p>
              <BlockMath math={`\\begin{array}{l}
(1)\\; \\{0\\} \\subseteq \\{0, 1, 2\\}\\\\
(2)\\; \\{\\} \\subseteq \\{1, 2, 3\\}\\\\
(3)\\; \\{1,2,3\\} \\subseteq \\{1,2\\}\\\\
(4)\\; n(\\mathcal{P}(\\{a,b\\})) = 4
\\end{array}`} />
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

export default HimpunanBagianLatihanPage;
