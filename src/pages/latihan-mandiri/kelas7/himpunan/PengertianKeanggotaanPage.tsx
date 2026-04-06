import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─── REUSABLE COMPONENTS ─── */
type SectionProps = { title: string; color: string; children: React.ReactNode };
const Section = ({ title, color, children }: SectionProps) => (
  <div className="rounded-xl border p-5 space-y-6" style={{ borderColor: color + "55", background: color + "0a" }}>
    <h3 className="font-display font-bold text-sm uppercase tracking-widest" style={{ color }}>{title}</h3>
    {children}
  </div>
);

type QProps = { no: number; children: React.ReactNode; badge?: string; badgeColor?: string };
const Q = ({ no, children, badge, badgeColor = "#60a5fa" }: QProps) => (
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

/* ─── PAGE ─── */
const PengertianKeanggotaanLatihanPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.4)" }}>
            <BookOpen className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1">
            PENGERTIAN DAN KEANGGOTAAN HIMPUNAN
          </h1>
          <p className="text-white/50 text-xs font-body">Kelas 7 · Latihan Mandiri · Himpunan</p>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            {["UN", "TKA", "ANBK"].map(tag => (
              <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/30">{tag}</span>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 px-5 py-4 mb-6 text-sm text-white/80 font-body leading-relaxed">
          <p className="font-bold text-blue-300 mb-1">Notasi Penting</p>
          <ul className="text-xs text-white/70 space-y-1">
            <li><InlineMath math="a \in A" /> → <em>a</em> adalah anggota himpunan <em>A</em></li>
            <li><InlineMath math="a \notin A" /> → <em>a</em> bukan anggota himpunan <em>A</em></li>
            <li><InlineMath math="n(A)" /> → banyak anggota himpunan <em>A</em></li>
          </ul>
        </div>

        <div className="space-y-5 animate-slide-up">
          <Section title="Bagian A · Menentukan Anggota Himpunan" color="#60a5fa">

            <Q no={1} badge="Definisi" badgeColor="#60a5fa">
              <p>Dari kumpulan berikut, manakah yang termasuk <strong className="text-blue-300">himpunan</strong> dan mana yang bukan himpunan? Jelaskan alasanmu!</p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) Kumpulan siswa yang tinggi di kelas 7A</li>
                <li>(b) Kumpulan bilangan prima kurang dari 10</li>
                <li>(c) Kumpulan makanan enak</li>
                <li>(d) Kumpulan huruf vokal dalam alfabet</li>
              </ul>
            </Q>

            <Q no={2} badge="Notasi Anggota" badgeColor="#60a5fa">
              <p>
                Diketahui <InlineMath math="A = \{2, 4, 6, 8, 10\}" />. Tentukan apakah pernyataan berikut benar atau salah!
              </p>
              <BlockMath math={`\\begin{array}{ll}
(a)\\; 4 \\in A & (b)\\; 5 \\in A \\\\
(c)\\; 10 \\notin A & (d)\\; 1 \\notin A
\\end{array}`} />
            </Q>

            <Q no={3} badge="Mendaftar Anggota" badgeColor="#60a5fa">
              <p>
                Nyatakan himpunan berikut dengan mendaftar anggota-anggotanya!
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="P" /> = himpunan bilangan genap antara 1 dan 15</li>
                <li>(b) <InlineMath math="Q" /> = himpunan faktor dari 24</li>
                <li>(c) <InlineMath math="R" /> = himpunan huruf pada kata "MATEMATIKA"</li>
              </ul>
            </Q>

            <Q no={4} badge="Banyak Anggota" badgeColor="#60a5fa">
              <p>
                Tentukan <InlineMath math="n(A)" /> dari himpunan-himpunan berikut!
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A = \{1, 3, 5, 7, 9, 11\}" /></li>
                <li>(b) <InlineMath math="B" /> = himpunan bilangan prima kurang dari 20</li>
                <li>(c) <InlineMath math="C" /> = himpunan huruf konsonan pada kata "HIMPUNAN"</li>
              </ul>
            </Q>

            <Q no={5} badge="UN Style" badgeColor="#60a5fa">
              <p>
                Diketahui <InlineMath math="K = \{x \mid x \text{ adalah bilangan asli kelipatan 3 yang kurang dari 20}\}" />.
                Anggota himpunan <InlineMath math="K" /> adalah …
              </p>
            </Q>
          </Section>

          <Section title="Bagian B · Menyatakan Keanggotaan" color="#a78bfa">

            <Q no={6} badge="Deskripsi → Daftar" badgeColor="#a78bfa">
              <p>
                Himpunan <InlineMath math="B = \{x \mid 3 \leq x \leq 12,\; x \in \mathbb{N}\}" />.
                Daftarkan semua anggota <InlineMath math="B" /> dan tentukan <InlineMath math="n(B)" />!
              </p>
            </Q>

            <Q no={7} badge="Daftar → Notasi" badgeColor="#a78bfa">
              <p>
                Ubah himpunan <InlineMath math="A = \{1, 4, 9, 16, 25, 36\}" /> ke bentuk notasi pembentuk himpunan!
              </p>
            </Q>

            <Q no={8} badge="ANBK" badgeColor="#a78bfa">
              <p>
                Perhatikan himpunan <InlineMath math="P = \{p, e, l, a, j, r\}" /> (huruf penyusun kata "PELAJAR" tanpa pengulangan).
                Manakah pernyataan yang BENAR?
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(A) <InlineMath math="n(P) = 7" /></li>
                <li>(B) <InlineMath math="'a' \notin P" /></li>
                <li>(C) <InlineMath math="n(P) = 6" /></li>
                <li>(D) <InlineMath math="'z' \in P" /></li>
              </ul>
            </Q>

            <Q no={9} badge="Kelipatan & Faktor" badgeColor="#a78bfa">
              <p>
                Tentukan anggota himpunan berikut dan hitung jumlah seluruh anggotanya!
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A" /> = himpunan kelipatan 4 antara 10 dan 40</li>
                <li>(b) <InlineMath math="B" /> = himpunan faktor persekutuan dari 24 dan 36</li>
              </ul>
            </Q>

            <Q no={10} badge="TKA" badgeColor="#a78bfa">
              <p>
                Diketahui <InlineMath math="A = \{x \mid x^2 - 5x + 6 = 0,\; x \in \mathbb{Z}\}" />.
                Tentukan anggota himpunan <InlineMath math="A" /> dan nilai <InlineMath math="n(A)" />!
              </p>
            </Q>
          </Section>

          <Section title="Bagian C · Aplikasi & Penalaran" color="#4ade80">

            <Q no={11} badge="Kontekstual" badgeColor="#4ade80">
              <p>
                Di kelas 7B terdapat 32 siswa. Diketahui bahwa siswa yang menyukai olahraga bola basket
                adalah mereka yang bernomor absen 3, 6, 9, 12, 15, 18, 21, 24, 27, dan 30.
                Nyatakan himpunan siswa pecinta basket dengan notasi pembentuk himpunan dan tentukan <InlineMath math="n" />-nya!
              </p>
            </Q>

            <Q no={12} badge="Bilangan" badgeColor="#4ade80">
              <p>
                Diketahui himpunan <InlineMath math="M = \{1, 2, 3, \ldots, 10\}" />.
                Tentukan himpunan bagian <InlineMath math="M" /> yang memuat bilangan-bilangan:
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) Bilangan ganjil</li>
                <li>(b) Bilangan prima</li>
                <li>(c) Kelipatan 2 sekaligus kelipatan 3</li>
              </ul>
            </Q>

            <Q no={13} badge="UN 2020" badgeColor="#4ade80">
              <p>
                Dari 40 siswa, diketahui 25 siswa suka matematika, 20 siswa suka IPA, dan 10 siswa suka keduanya.
                Berapa banyak siswa yang <strong className="text-green-300">tidak suka keduanya</strong>?
              </p>
            </Q>

            <Q no={14} badge="Penalaran" badgeColor="#4ade80">
              <p>
                Himpunan <InlineMath math="A" /> memiliki <InlineMath math="n(A) = 4" />.
                Himpunan <InlineMath math="B" /> memiliki <InlineMath math="n(B) = 3" />.
                Jika <InlineMath math="A \cap B = \{2, 5\}" />, berapakah kemungkinan nilai <InlineMath math="n(A \cup B)" />?
              </p>
            </Q>

            <Q no={15} badge="HOTS" badgeColor="#4ade80">
              <p>
                Dalam sebuah survei terhadap 50 pengunjung toko buku, diperoleh data:
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>• 30 orang membeli buku matematika</li>
                <li>• 25 orang membeli buku IPA</li>
                <li>• 12 orang membeli keduanya</li>
              </ul>
              <p className="mt-2">
                (a) Berapa orang yang hanya membeli buku matematika?<br/>
                (b) Berapa orang yang tidak membeli keduanya?<br/>
                (c) Jika dua pengunjung tambahan membeli hanya buku IPA, berapakah <InlineMath math="n(A \cup B)" /> sekarang?
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

export default PengertianKeanggotaanLatihanPage;
