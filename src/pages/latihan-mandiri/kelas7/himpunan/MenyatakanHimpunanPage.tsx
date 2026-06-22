import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─── REUSABLE ─── */
type SectionProps = { title: string; color: string; children: React.ReactNode };
const Section = ({ title, color, children }: SectionProps) => (
  <div className="rounded-xl border p-5 space-y-6" style={{ borderColor: color + "55", background: color + "0a" }}>
    <h3 className="font-display font-bold text-sm uppercase tracking-widest" style={{ color }}>{title}</h3>
    {children}
  </div>
);

type QProps = { no: number; children: React.ReactNode; badge?: string; badgeColor?: string };
const Q = ({ no, children, badge, badgeColor = "#a78bfa" }: QProps) => (
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
      <div className="text-white/90 text-sm leading-relaxed font-body">{children}</div>
    </div>
  </div>
);

/* ─── SVG: empty set symbol diagram ─── */
const EmptySetDiagram = () => (
  <svg viewBox="0 0 260 120" className="w-full max-w-xs mx-auto my-3" aria-label="Himpunan kosong">
    <rect x="10" y="15" width="110" height="90" rx="12" fill="rgba(96,165,250,0.10)" stroke="#60a5fa" strokeWidth="1.5" />
    <text x="65" y="70" fill="#60a5fa" fontSize="28" fontFamily="monospace" textAnchor="middle">∅</text>
    <text x="65" y="105" fill="#e2e8f0" fontSize="11" fontFamily="monospace" textAnchor="middle">Himpunan Kosong</text>
    <rect x="140" y="15" width="110" height="90" rx="12" fill="rgba(74,222,128,0.10)" stroke="#4ade80" strokeWidth="1.5" />
    <text x="195" y="55" fill="#4ade80" fontSize="11" fontFamily="monospace" textAnchor="middle">S = {"{bilangan"}</text>
    <text x="195" y="72" fill="#4ade80" fontSize="11" fontFamily="monospace" textAnchor="middle">asli ≤ 10{"}"}</text>
    <text x="195" y="105" fill="#e2e8f0" fontSize="11" fontFamily="monospace" textAnchor="middle">Himpunan Semesta</text>
  </svg>
);

/* ─── PAGE ─── */
const MenyatakanHimpunanLatihanPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.4)" }}>
            <BookOpen className="w-7 h-7 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1">
            MENYATAKAN HIMPUNAN, HIMPUNAN KOSONG &amp; SEMESTA
          </h1>
          <p className="text-white/50 text-xs font-body">Kelas 7 · Tugas - Latihan Mandiri · Himpunan</p>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            {["UN", "TKA", "ANBK"].map(tag => (
              <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/30">{tag}</span>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-violet-500/10 border border-violet-500/30 px-5 py-4 mb-6 text-sm text-white/80 font-body">
          <p className="font-bold text-violet-300 mb-2">Cara Menyatakan Himpunan</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-white/70">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="font-semibold text-violet-200 mb-1">1. Mendaftar Anggota</p>
              <InlineMath math="A = \{1, 2, 3, 4, 5\}" />
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="font-semibold text-violet-200 mb-1">2. Notasi Pembentuk</p>
              <InlineMath math="A = \{x \mid 1 \leq x \leq 5\}" />
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="font-semibold text-violet-200 mb-1">3. Kata-kata</p>
              <p>A = himpunan bilangan asli 1–5</p>
            </div>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-white/70">
            <span><InlineMath math="\emptyset" /> atau <InlineMath math="\{\}" /> = Himpunan kosong (tidak ada anggota)</span>
          </div>
        </div>

        <EmptySetDiagram />

        <div className="space-y-5 animate-slide-up">
          <Section title="Bagian A · Cara Menyatakan Himpunan" color="#a78bfa">

            <Q no={1} badge="3 Cara" badgeColor="#a78bfa">
              <p>
                Nyatakan himpunan <InlineMath math="A" /> = bilangan bulat antara <InlineMath math="-3" /> dan <InlineMath math="4" />
                dengan <strong className="text-violet-300">tiga cara</strong> (mendaftar, notasi pembentuk, dan kata-kata)!
              </p>
            </Q>

            <Q no={2} badge="Mendaftar" badgeColor="#a78bfa">
              <p>
                Ubah himpunan berikut ke bentuk <strong className="text-violet-300">daftar anggota</strong>!
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="P = \{x \mid x \text{ adalah bilangan prima antara 10 dan 30}\}" /></li>
                <li>(b) <InlineMath math="Q = \{x \mid x \text{ adalah kuadrat sempurna}, x \leq 50\}" /></li>
                <li>(c) <InlineMath math="R = \{x \mid x \text{ habis dibagi 6}, 6 \leq x \leq 36\}" /></li>
              </ul>
            </Q>

            <Q no={3} badge="Notasi Pembentuk" badgeColor="#a78bfa">
              <p>
                Ubah himpunan berikut ke bentuk <strong className="text-violet-300">notasi pembentuk himpunan</strong>!
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A = \{5, 10, 15, 20, 25\}" /></li>
                <li>(b) <InlineMath math="B = \{1, 4, 9, 16, 25, 36, 49\}" /></li>
                <li>(c) <InlineMath math="C = \{2, 3, 5, 7, 11, 13\}" /></li>
              </ul>
            </Q>

            <Q no={4} badge="UN Style" badgeColor="#a78bfa">
              <p>
                Himpunan <InlineMath math="K = \{x \mid 2 \leq x \leq 8,\; x \in \mathbb{Z}\}" />.
                Pernyataan berikut yang <strong className="text-green-300">benar</strong> adalah …
              </p>
              <BlockMath math={`\\begin{array}{ll}
(A)\\; n(K) = 6 & (B)\\; n(K) = 7 \\\\
(C)\\; 2 \\notin K & (D)\\; 9 \\in K
\\end{array}`} />
            </Q>

            <Q no={5} badge="Kata-kata" badgeColor="#a78bfa">
              <p>
                Nyatakan himpunan <InlineMath math="S = \{Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu\}" /> dengan
                notasi pembentuk himpunan dan tentukan <InlineMath math="n(S)" />!
              </p>
            </Q>
          </Section>

          <Section title="Bagian B · Himpunan Kosong & Himpunan Semesta" color="#4ade80">

            <Q no={6} badge="Himpunan Kosong" badgeColor="#4ade80">
              <p>
                Tentukan manakah dari berikut yang merupakan <strong className="text-green-300">himpunan kosong</strong>!
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A = \{x \mid x \text{ bilangan prima genap yang lebih dari 5}\}" /></li>
                <li>(b) <InlineMath math="B = \{x \mid x^2 = -4,\; x \in \mathbb{R}\}" /></li>
                <li>(c) <InlineMath math="C = \{x \mid x + 5 = 5,\; x \in \mathbb{Z}\}" /></li>
                <li>(d) <InlineMath math="D = \{x \mid x \text{ adalah bulan yang memiliki 32 hari}\}" /></li>
              </ul>
            </Q>

            <Q no={7} badge="Semesta" badgeColor="#4ade80">
              <p>
                Tuliskan satu contoh himpunan semesta yang tepat untuk himpunan berikut!
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A = \{2, 4, 6, 8, 10\}" /></li>
                <li>(b) <InlineMath math="B = \{merah, kuning, biru\}" /></li>
                <li>(c) <InlineMath math="C = \{anjing, kucing, sapi, kambing\}" /></li>
              </ul>
            </Q>

            <Q no={8} badge="ANBK" badgeColor="#4ade80">
              <p>
                Diketahui semesta <InlineMath math="S = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}" /> dan
                himpunan <InlineMath math="A = \{1, 3, 5, 7, 9\}" />.
                Tentukan komplemen dari <InlineMath math="A" /> terhadap <InlineMath math="S" />!
              </p>
            </Q>

            <Q no={9} badge="Benar/Salah" badgeColor="#4ade80">
              <p>Tentukan apakah pernyataan berikut <strong className="text-green-300">BENAR</strong> atau <strong className="text-red-400">SALAH</strong>!</p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) Himpunan kosong adalah <InlineMath math="\emptyset = \{0\}" /></li>
                <li>(b) <InlineMath math="n(\emptyset) = 0" /></li>
                <li>(c) Himpunan semesta adalah himpunan yang memuat semua himpunan yang sedang dibicarakan</li>
                <li>(d) <InlineMath math="\{0\}" /> adalah himpunan kosong</li>
              </ul>
            </Q>

            <Q no={10} badge="TKA" badgeColor="#4ade80">
              <p>
                Dari semesta <InlineMath math="S = \{x \mid x \leq 15,\; x \in \mathbb{N}\}" />,
                diketahui <InlineMath math="A" /> = himpunan bilangan prima,
                dan <InlineMath math="B" /> = himpunan kelipatan 3.
              </p>
              <p className="mt-1">
                Tentukan: (a) <InlineMath math="A" />,&nbsp;
                (b) <InlineMath math="B" />,&nbsp;
                (c) <InlineMath math="A^c" /> (komplemen <InlineMath math="A" />),&nbsp;
                (d) <InlineMath math="n(A^c)" />
              </p>
            </Q>
          </Section>

          <Section title="Bagian C · Aplikasi & Pemecahan Masalah" color="#fb923c">

            <Q no={11} badge="Kontekstual" badgeColor="#fb923c">
              <p>
                Dalam sebuah kelas, guru meminta siswa menyebutkan bulan kelahiran mereka.
                Nyatakan himpunan semesta yang tepat dan tentukan himpunan kosong dari konteks ini
                (contoh: himpunan siswa yang lahir di bulan ke-13)!
              </p>
            </Q>

            <Q no={12} badge="UN 2019" badgeColor="#fb923c">
              <p>
                Diketahui <InlineMath math="S = \{1, 2, 3, \ldots, 12\}" />,
                <InlineMath math="\; A = \{x \mid x \text{ faktor dari } 12\}" />,
                <InlineMath math="\; B = \{x \mid x \text{ bilangan genap}\}" />.
                Tentukan: (a) <InlineMath math="A" />, (b) <InlineMath math="B" />, (c) <InlineMath math="A^c" />
              </p>
            </Q>

            <Q no={13} badge="Ekuivalen" badgeColor="#fb923c">
              <p>
                Himpunan <InlineMath math="P = \{a, b, c, d\}" /> dan <InlineMath math="Q = \{1, 2, 3, 4\}" />.
                Apakah <InlineMath math="P" /> dan <InlineMath math="Q" /> ekuivalen? Jelaskan alasannya!
                Apakah keduanya sama (equal)?
              </p>
            </Q>

            <Q no={14} badge="Membuat Himpunan" badgeColor="#fb923c">
              <p>
                Budi mendapat tugas membuat 3 himpunan berbeda dari topik mata pelajaran di sekolah.
                Buatlah 3 contoh himpunan tersebut menggunakan notasi pembentuk himpunan,
                dan nyatakan himpunan semestanya!
              </p>
            </Q>

            <Q no={15} badge="HOTS" badgeColor="#fb923c">
              <p>
                Diketahui semesta <InlineMath math="S = \{x \mid x \text{ bilangan bulat}, -5 \leq x \leq 5\}" />.
                Tentukan himpunan-himpunan berikut dan sebutkan mana yang merupakan himpunan kosong!
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A = \{x \mid x^2 = 4\}" /></li>
                <li>(b) <InlineMath math="B = \{x \mid x < -5\}" /></li>
                <li>(c) <InlineMath math="C = \{x \mid x \text{ ganjil dan genap sekaligus}\}" /></li>
                <li>(d) <InlineMath math="D = \{x \mid |x| \leq 2\}" /></li>
              </ul>
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

export default MenyatakanHimpunanLatihanPage;
