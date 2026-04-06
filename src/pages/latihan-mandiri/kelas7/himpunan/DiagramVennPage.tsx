import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { InlineMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─── SVG DIAGRAMS ─── */

/* Two-set Venn diagram */
const VennDua = ({ labelA = "A", labelB = "B", colorA = "#60a5fa", colorB = "#a78bfa",
  itemsLeft = ["2","4"], itemsMiddle = ["6"], itemsRight = ["8","10"],
  sLabel = "S" }) => (
  <svg viewBox="0 0 380 220" className="w-full max-w-sm mx-auto my-3" aria-label="Diagram Venn dua himpunan">
    <rect x="5" y="5" width="370" height="210" rx="10" fill="none" stroke="#ffffff30" strokeWidth="1.5" />
    <text x="14" y="24" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">{sLabel}</text>
    <ellipse cx="145" cy="110" rx="100" ry="75" fill={colorA + "20"} stroke={colorA} strokeWidth="2" />
    <ellipse cx="235" cy="110" rx="100" ry="75" fill={colorB + "20"} stroke={colorB} strokeWidth="2" />
    <text x="90"  y="40" fill={colorA} fontSize="14" fontFamily="monospace" fontWeight="bold">{labelA}</text>
    <text x="280" y="40" fill={colorB} fontSize="14" fontFamily="monospace" fontWeight="bold">{labelB}</text>
    {itemsLeft.map((v, i) => <text key={i} x="88" y={95 + i * 20} fill="#e2e8f0" fontSize="13" fontFamily="monospace" textAnchor="middle">{v}</text>)}
    {itemsMiddle.map((v, i) => <text key={i} x="190" y={103 + i * 20} fill="#facc15" fontSize="13" fontFamily="monospace" textAnchor="middle">{v}</text>)}
    {itemsRight.map((v, i) => <text key={i} x="290" y={95 + i * 20} fill="#e2e8f0" fontSize="13" fontFamily="monospace" textAnchor="middle">{v}</text>)}
  </svg>
);

/* Three-set Venn diagram */
const VennTiga = () => (
  <svg viewBox="0 0 380 270" className="w-full max-w-sm mx-auto my-3" aria-label="Diagram Venn tiga himpunan">
    <rect x="5" y="5" width="370" height="260" rx="10" fill="none" stroke="#ffffff30" strokeWidth="1.5" />
    <text x="14" y="24" fill="#e2e8f0" fontSize="13" fontFamily="monospace" fontWeight="bold">S</text>
    <ellipse cx="155" cy="105" rx="95" ry="70" fill="rgba(96,165,250,0.15)" stroke="#60a5fa" strokeWidth="2" />
    <ellipse cx="225" cy="105" rx="95" ry="70" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="2" />
    <ellipse cx="190" cy="175" rx="95" ry="70" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="2" />
    <text x="110" y="65"  fill="#60a5fa"  fontSize="14" fontFamily="monospace" fontWeight="bold">A</text>
    <text x="270" y="65"  fill="#a78bfa"  fontSize="14" fontFamily="monospace" fontWeight="bold">B</text>
    <text x="190" y="260" fill="#4ade80"  fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">C</text>
    {/* region labels */}
    <text x="115" y="105"  fill="#e2e8f0" fontSize="12" fontFamily="monospace" textAnchor="middle">hanya A</text>
    <text x="268" y="105"  fill="#e2e8f0" fontSize="12" fontFamily="monospace" textAnchor="middle">hanya B</text>
    <text x="190" y="235"  fill="#e2e8f0" fontSize="12" fontFamily="monospace" textAnchor="middle">hanya C</text>
    <text x="190" y="95"   fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">A∩B</text>
    <text x="148" y="165"  fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">A∩C</text>
    <text x="232" y="165"  fill="#facc15" fontSize="11" fontFamily="monospace" textAnchor="middle">B∩C</text>
    <text x="190" y="138"  fill="#f87171" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">A∩B∩C</text>
  </svg>
);

/* Venn for survey problem */
const VennSurvei = () => (
  <svg viewBox="0 0 380 200" className="w-full max-w-sm mx-auto my-3" aria-label="Diagram Venn survei">
    <rect x="5" y="5" width="370" height="190" rx="10" fill="none" stroke="#ffffff30" strokeWidth="1.5" />
    <text x="14" y="22" fill="#e2e8f0" fontSize="12" fontFamily="monospace" fontWeight="bold">S (40 siswa)</text>
    <ellipse cx="145" cy="100" rx="100" ry="68" fill="rgba(251,146,60,0.15)" stroke="#fb923c" strokeWidth="2" />
    <ellipse cx="235" cy="100" rx="100" ry="68" fill="rgba(248,113,113,0.15)" stroke="#f87171" strokeWidth="2" />
    <text x="80"  y="35" fill="#fb923c" fontSize="13" fontFamily="monospace" fontWeight="bold">Mtk</text>
    <text x="270" y="35" fill="#f87171" fontSize="13" fontFamily="monospace" fontWeight="bold">IPA</text>
    <text x="82"  y="105" fill="#facc15" fontSize="14" fontFamily="monospace" textAnchor="middle">?</text>
    <text x="190" y="105" fill="#facc15" fontSize="14" fontFamily="monospace" textAnchor="middle">8</text>
    <text x="298" y="105" fill="#facc15" fontSize="14" fontFamily="monospace" textAnchor="middle">?</text>
    <text x="340" y="160" fill="#e2e8f0" fontSize="12" fontFamily="monospace" textAnchor="middle">5</text>
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
const DiagramVennLatihanPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.4)" }}>
            <BookOpen className="w-7 h-7 text-green-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1">
            DIAGRAM VENN
          </h1>
          <p className="text-white/50 text-xs font-body">Kelas 7 · Latihan Mandiri · Himpunan</p>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            {["UN", "TKA", "ANBK"].map(tag => (
              <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/30">{tag}</span>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-green-500/10 border border-green-500/30 px-5 py-4 mb-4 text-sm text-white/80 font-body">
          <p className="font-bold text-green-300 mb-2">Cara Membaca Diagram Venn</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
            <span>• Persegi = himpunan semesta (S)</span>
            <span>• Lingkaran = satu himpunan</span>
            <span>• Irisan = <InlineMath math="A \cap B" /></span>
            <span>• Di luar lingkaran tapi dalam S = di luar <InlineMath math="A \cup B" /></span>
          </div>
        </div>

        <VennDua
          labelA="A" labelB="B"
          colorA="#60a5fa" colorB="#a78bfa"
          itemsLeft={["1","3","5"]} itemsMiddle={["7"]} itemsRight={["9","11"]}
          sLabel="S"
        />

        <div className="space-y-5 animate-slide-up">
          <Section title="Bagian A · Membaca Diagram Venn" color="#60a5fa">

            <Q no={1} badge="Membaca" badgeColor="#60a5fa"
              diagram={<VennDua labelA="A" labelB="B" colorA="#60a5fa" colorB="#a78bfa"
                itemsLeft={["2","4","8"]} itemsMiddle={["6","12"]} itemsRight={["3","9","15"]} sLabel="S" />}>
              <p>
                Dari diagram Venn di atas, tentukan:
                (a) anggota <InlineMath math="A" />,&nbsp;
                (b) anggota <InlineMath math="B" />,&nbsp;
                (c) <InlineMath math="A \cap B" />,&nbsp;
                (d) <InlineMath math="A \cup B" />,&nbsp;
                (e) anggota <InlineMath math="S" /> yang tidak ada di <InlineMath math="A" /> maupun <InlineMath math="B" />
              </p>
            </Q>

            <Q no={2} badge="Menghitung" badgeColor="#60a5fa">
              <p>
                Diketahui dari diagram Venn: <InlineMath math="n(S) = 30" />, <InlineMath math="n(A) = 18" />,
                <InlineMath math="\; n(B) = 14" />, <InlineMath math="\; n(A \cap B) = 6" />.
                Tentukan:
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="n(A \cup B)" /></li>
                <li>(b) Banyak anggota yang hanya ada di <InlineMath math="A" /></li>
                <li>(c) Banyak anggota yang hanya ada di <InlineMath math="B" /></li>
                <li>(d) Banyak anggota yang tidak ada di <InlineMath math="A" /> maupun <InlineMath math="B" /></li>
              </ul>
            </Q>

            <Q no={3} badge="Melengkapi" badgeColor="#60a5fa">
              <p>
                Lengkapi diagram Venn dengan data berikut:<br/>
                <InlineMath math="S = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}" />,<br/>
                <InlineMath math="A = \{1, 2, 3, 4, 5\}" />,<br/>
                <InlineMath math="B = \{3, 4, 5, 6, 7\}" /><br/>
                Lalu tentukan <InlineMath math="A \cap B" /> dan <InlineMath math="A \cup B" />!
              </p>
            </Q>

            <Q no={4} badge="Tiga Himpunan" badgeColor="#60a5fa" diagram={<VennTiga />}>
              <p>
                Perhatikan diagram Venn tiga himpunan di atas. Sebutkan daerah-daerah yang mewakili:
              </p>
              <ul className="list-none mt-2 space-y-1 text-white/75 text-xs">
                <li>(a) <InlineMath math="A \cap B \cap C" /></li>
                <li>(b) Anggota yang hanya ada di <InlineMath math="A" /> saja</li>
                <li>(c) Anggota yang ada di <InlineMath math="A" /> dan <InlineMath math="B" /> tapi bukan <InlineMath math="C" /></li>
              </ul>
            </Q>

            <Q no={5} badge="UN Style" badgeColor="#60a5fa">
              <p>
                Diketahui <InlineMath math="S = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}" />,
                <InlineMath math="\; A = \{2, 4, 6, 8, 10\}" />,
                <InlineMath math="\; B = \{1, 2, 3, 4, 5\}" />.
                Gambarkan diagram Venn-nya dan tentukan <InlineMath math="A^c" />!
              </p>
            </Q>
          </Section>

          <Section title="Bagian B · Soal Cerita Diagram Venn" color="#4ade80">

            <Q no={6} badge="Survei" badgeColor="#4ade80" diagram={<VennSurvei />}>
              <p>
                Dari 40 siswa, 25 suka Matematika, 20 suka IPA, dan 8 suka keduanya.
                Lengkapi diagram Venn di atas dan tentukan berapa siswa yang <strong className="text-green-300">tidak suka keduanya</strong>!
              </p>
            </Q>

            <Q no={7} badge="ANBK" badgeColor="#4ade80">
              <p>
                Dalam satu keluarga terdapat 50 orang. Dari mereka 30 orang punya HP Android, 25 orang
                punya HP iPhone, dan 10 orang punya keduanya.
                Buat diagram Venn dan tentukan:<br/>
                (a) Berapa orang yang hanya punya Android?<br/>
                (b) Berapa orang yang tidak punya HP sama sekali?
              </p>
            </Q>

            <Q no={8} badge="Tiga Kelompok" badgeColor="#4ade80">
              <p>
                Dari 60 peserta lomba: 30 ikut lomba lari, 25 ikut renang, 20 ikut bersepeda.
                10 ikut lari dan renang, 8 ikut renang dan bersepeda, 7 ikut lari dan bersepeda,
                dan 4 orang ikut ketiganya.
              </p>
              <p className="mt-1">
                Tentukan berapa peserta yang:
                (a) hanya ikut 1 lomba, (b) ikut tepat 2 lomba, (c) tidak ikut satupun lomba
              </p>
            </Q>

            <Q no={9} badge="UN 2021" badgeColor="#4ade80">
              <p>
                Dari diagram Venn diketahui <InlineMath math="n(A \cup B) = 35" />,
                <InlineMath math="\; n(A) = 20" />, <InlineMath math="\; n(A \cap B) = 7" />.
                Tentukan <InlineMath math="n(B)" />!
              </p>
            </Q>

            <Q no={10} badge="TKA" badgeColor="#4ade80">
              <p>
                Diketahui dari survei 100 responden: 60 suka kopi, 50 suka teh, dan 20 suka keduanya.
                Berapa persen responden yang tidak suka kopi maupun teh?
              </p>
            </Q>
          </Section>

          <Section title="Bagian C · Aplikasi Kompleks" color="#fb923c">

            <Q no={11} badge="Kontekstual" badgeColor="#fb923c">
              <p>
                Nilai ujian 30 siswa diperiksa. Hasilnya: 18 lulus Matematika, 22 lulus Bahasa Indonesia,
                dan 12 lulus keduanya. Gambarlah diagram Venn situasi ini dan tentukan:<br/>
                (a) Berapa yang hanya lulus Matematika?<br/>
                (b) Berapa yang tidak lulus keduanya?
              </p>
            </Q>

            <Q no={12} badge="HOTS" badgeColor="#fb923c">
              <p>
                Dari 80 pengunjung pameran: 45 melihat lukisan, 40 melihat patung, dan 25 melihat keduanya.
                Seorang pengunjung dipilih secara acak. Berapa persen kemungkinan pengunjung tersebut
                <strong className="text-orange-300"> hanya melihat patung</strong>?
              </p>
            </Q>

            <Q no={13} badge="Mencari Anggota" badgeColor="#fb923c">
              <p>
                Diketahui <InlineMath math="n(S) = 50" />, <InlineMath math="n(A \cup B) = 42" />,
                <InlineMath math="\; n(A) = 2 \cdot n(B)" />, dan <InlineMath math="\; n(A \cap B) = 8" />.
                Tentukan <InlineMath math="n(A)" /> dan <InlineMath math="n(B)" />!
              </p>
            </Q>

            <Q no={14} badge="UN 2022" badgeColor="#fb923c">
              <p>
                Terdapat 45 siswa di kelas 7C. Setelah didata: 30 suka olahraga, 28 suka seni,
                dan <InlineMath math="x" /> orang suka keduanya. Jika ada 5 siswa yang tidak menyukai
                keduanya, tentukan nilai <InlineMath math="x" />!
              </p>
            </Q>

            <Q no={15} badge="HOTS 3 Himpunan" badgeColor="#fb923c">
              <p>
                Dari 100 siswa SMP:
              </p>
              <ul className="list-none mt-1 space-y-0.5 text-white/75 text-xs">
                <li>• 55 suka musik</li>
                <li>• 48 suka olahraga</li>
                <li>• 42 suka membaca</li>
                <li>• 22 suka musik dan olahraga</li>
                <li>• 20 suka olahraga dan membaca</li>
                <li>• 18 suka musik dan membaca</li>
                <li>• 10 suka ketiganya</li>
              </ul>
              <p className="mt-2">
                (a) Gambarkan diagram Venn-nya!<br/>
                (b) Berapa siswa yang tidak menyukai satupun dari ketiga kegiatan tersebut?
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

export default DiagramVennLatihanPage;
