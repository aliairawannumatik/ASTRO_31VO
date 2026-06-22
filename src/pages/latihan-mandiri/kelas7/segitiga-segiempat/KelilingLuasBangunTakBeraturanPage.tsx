import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronLeft } from "lucide-react";
import { InlineMath } from "react-katex";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";

/* ─────────────── SVG DIAGRAMS ─────────────── */

/* Q1: L-shape */
const DiagramQ1 = () => (
  <svg viewBox="0 0 380 280" className="w-full max-w-sm mx-auto my-3" aria-label="Bangun L">
    <polygon points="30,30 200,30 200,140 310,140 310,250 30,250"
      fill="rgba(96,165,250,0.12)" stroke="#60a5fa" strokeWidth="2" />
    <polyline points="30,42 42,42 42,30"   fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <polyline points="188,30 188,42 200,42" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <polyline points="200,128 212,128 212,140" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <polyline points="298,140 298,152 310,152" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <polyline points="298,250 298,238 310,238" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <polyline points="30,238 42,238 42,250"   fill="none" stroke="#60a5fa" strokeWidth="1.5" />
    <text x="106" y="22"  fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle">10 cm</text>
    <text x="255" y="135" fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle">8 cm</text>
    <text x="170" y="268" fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle">14 cm</text>
    <text x="316" y="198" fill="#ffffff" fontSize="12" fontFamily="monospace">6 cm</text>
    <text x="14"  y="145" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(-90 14 145)">11 cm</text>
    <text x="194" y="88"  fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(-90 194 88)">? cm</text>
    {/* keliling arrow */}
    <text x="60" y="170" fill="#ffffff" fontSize="11" fontFamily="monospace">Hitung keliling!</text>
  </svg>
);

/* Q2: T-shape (stepped) */
const DiagramQ2 = () => (
  <svg viewBox="0 0 380 280" className="w-full max-w-sm mx-auto my-3" aria-label="Bangun bertingkat">
    <polygon points="30,250 30,150 120,150 120,30 260,30 260,150 350,150 350,250"
      fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="2" />
    <text x="185" y="22"  fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle">14 cm</text>
    <text x="185" y="268" fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle">32 cm</text>
    <text x="14"  y="200" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(-90 14 200)">10 cm</text>
    <text x="364" y="200" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(90 360 200)">10 cm</text>
    <text x="73"  y="145" fill="#ffffff" fontSize="11" fontFamily="monospace">9 cm</text>
    <text x="261" y="145" fill="#ffffff" fontSize="11" fontFamily="monospace">9 cm</text>
    <text x="114" y="92"  fill="#ffffff" fontSize="11" fontFamily="monospace" transform="rotate(-90 114 92)">12 cm</text>
    <text x="261" y="92"  fill="#ffffff" fontSize="11" fontFamily="monospace" transform="rotate(90 260 92)">12 cm</text>
  </svg>
);

/* Q3: House shape (pentagon) */
const DiagramQ3 = () => (
  <svg viewBox="0 0 320 300" className="w-full max-w-xs mx-auto my-3" aria-label="Rumah (gabungan persegi + segitiga)">
    <rect  x="50" y="140" width="210" height="140" fill="rgba(74,222,128,0.10)" stroke="#4ade80" strokeWidth="2" />
    <polygon points="155,20 50,140 260,140" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="2" />
    <line x1="155" y1="20" x2="155" y2="140" stroke="#facc15" strokeWidth="1.5" strokeDasharray="5,4" />
    <polyline points="155,128 167,128 167,140" fill="none" stroke="#facc15" strokeWidth="1.5" />
    <text x="155" y="268" fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle">21 cm</text>
    <text x="270" y="214" fill="#ffffff" fontSize="12" fontFamily="monospace" transform="rotate(90 268 214)">14 cm</text>
    <text x="163" y="85"  fill="#ffffff" fontSize="11" fontFamily="monospace">8 cm</text>
  </svg>
);

/* Q4: Cross / plus shape */
const DiagramQ4 = () => (
  <svg viewBox="0 0 320 320" className="w-full max-w-xs mx-auto my-3" aria-label="Bangun plus/salip">
    <polygon points="110,30 200,30 200,110 280,110 280,200 200,200 200,280 110,280 110,200 30,200 30,110 110,110"
      fill="rgba(251,146,60,0.12)" stroke="#fb923c" strokeWidth="2" />
    <text x="155" y="24"  fill="#ffffff" fontSize="11" fontFamily="monospace" textAnchor="middle">6 cm</text>
    <text x="155" y="298" fill="#ffffff" fontSize="11" fontFamily="monospace" textAnchor="middle">6 cm</text>
    <text x="14"  y="160" fill="#ffffff" fontSize="11" fontFamily="monospace" transform="rotate(-90 14 160)">6 cm</text>
    <text x="304" y="160" fill="#ffffff" fontSize="11" fontFamily="monospace" transform="rotate(90 304 160)">6 cm</text>
    <text x="148" y="160" fill="#ffffff" fontSize="11" fontFamily="monospace" textAnchor="middle">6 cm</text>
    <text x="100" y="25"  fill="#ffffff" fontSize="10" fontFamily="monospace">6 cm</text>
  </svg>
);

/* Q5: Grid-based irregular shape */
const DiagramQ5 = () => {
  const cell = 36;
  const grid = [
    [0,1,1,0],
    [1,1,1,1],
    [1,1,1,0],
    [0,1,0,0],
  ];
  return (
    <svg viewBox="0 0 200 200" className="w-36 mx-auto my-3" aria-label="Bangun pada grid">
      {grid.map((row, r) =>
        row.map((val, c) =>
          val ? (
            <rect key={`${r}-${c}`} x={c * cell + 10} y={r * cell + 10} width={cell} height={cell}
              fill="rgba(96,165,250,0.20)" stroke="#60a5fa" strokeWidth="1.5" />
          ) : null
        )
      )}
      <text x="100" y="190" fill="#ffffff" fontSize="11" fontFamily="monospace" textAnchor="middle">1 kotak = 1 cm²</text>
    </svg>
  );
};

/* ─────────────── SECTION & QUESTION ─────────────── */
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

/* ─────────────── PAGE ─────────────── */
const KelilingLuasBangunTakBeraturanLatihanPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.4)" }}>
            <BookOpen className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1">
            KELILING &amp; LUAS BANGUN TAK BERATURAN
          </h1>
          <p className="text-white/50 text-xs font-body">Kelas 7 · Tugas - Latihan Mandiri · Segitiga dan Segiempat</p>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            {["UN", "TKA", "ANBK"].map(tag => (
              <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/30">{tag}</span>
            ))}
          </div>
        </div>

        {/* Tip Box */}
        <div className="rounded-xl bg-orange-500/10 border border-orange-500/30 px-5 py-4 mb-6 text-sm text-white/80 font-body leading-relaxed">
          <p className="font-bold text-orange-300 mb-1">Strategi Menyelesaikan Bangun Tak Beraturan</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-white/70">
            <li>Urai bangun menjadi bangun-bangun sederhana (persegi, segitiga, dll.)</li>
            <li>Hitung luas masing-masing bagian lalu jumlahkan (atau kurangkan).</li>
            <li>Untuk keliling, jumlahkan semua sisi terluar saja.</li>
          </ul>
        </div>

        <div className="space-y-5 animate-slide-up">

          {/* ── BAGIAN A: Keliling ── */}
          <Section title="Bagian A · Keliling Bangun Tak Beraturan" color="#60a5fa">

            <Q no={1} badge="Bangun L" badgeColor="#60a5fa" diagram={<DiagramQ1 />}>
              <p>
                Bangun di atas berbentuk huruf L dengan ukuran seperti pada gambar.
                Sisi yang belum diketahui dapat dihitung dari sisi yang ada.
                Tentukan <span className="text-blue-300 font-semibold">keliling</span> bangun tersebut!
              </p>
            </Q>

            <Q no={2} badge="Bangun Bertingkat" badgeColor="#60a5fa" diagram={<DiagramQ2 />}>
              <p>
                Bangun berbentuk tangga memiliki ukuran seperti gambar.
                Tentukan <span className="text-blue-300 font-semibold">keliling</span> bangun tersebut!
              </p>
            </Q>

            <Q no={3} badge="Kontekstual" badgeColor="#60a5fa">
              <p>
                Sebuah taman kota berbentuk huruf U dengan ukuran: lebar luar <InlineMath math="20 \text{ m}" />,
                panjang luar <InlineMath math="30 \text{ m}" />, lebar dalam <InlineMath math="10 \text{ m}" />,
                dan kedalaman dalam <InlineMath math="15 \text{ m}" />.
                Taman akan dipagari di sekeliling <em>tepi terluar</em> saja.
                Tentukan keliling taman!
              </p>
            </Q>

            <Q no={4} badge="UN Style" badgeColor="#60a5fa">
              <p>
                Sebuah denah lapangan berbentuk huruf T dengan ukuran:
                lebar atas <InlineMath math="18 \text{ m}" />, tinggi batang <InlineMath math="12 \text{ m}" />,
                lebar batang <InlineMath math="6 \text{ m}" />, dan tinggi kepala <InlineMath math="8 \text{ m}" />.
                Tentukan keliling lapangan!
              </p>
            </Q>

            <Q no={5} badge="Gabungan Bangun" badgeColor="#60a5fa">
              <p>
                Sebuah bangun terdiri dari persegi panjang berukuran{" "}
                <InlineMath math="16 \text{ cm} \times 10 \text{ cm}" /> dengan segitiga siku-siku yang ditempel di
                sisi kanan (alas <InlineMath math="6 \text{ cm}" />, tinggi <InlineMath math="10 \text{ cm}" />).
                Tentukan keliling bangun gabungan tersebut!
                <span className="block mt-1 text-white/50 text-xs">(Petunjuk: hitung sisi miring segitiga dengan Pythagoras)</span>
              </p>
            </Q>
          </Section>

          {/* ── BAGIAN B: Luas ── */}
          <Section title="Bagian B · Luas Bangun Tak Beraturan" color="#4ade80">

            <Q no={6} badge="Bangun Rumah" badgeColor="#4ade80" diagram={<DiagramQ3 />}>
              <p>
                Tampak depan sebuah rumah terdiri dari persegi panjang berukuran{" "}
                <InlineMath math="21 \text{ cm} \times 14 \text{ cm}" /> (badan) dan segitiga sama kaki di atasnya
                dengan alas <InlineMath math="21 \text{ cm}" /> dan tinggi <InlineMath math="8 \text{ cm}" />.
                Hitung total luas tampak depan rumah!
              </p>
            </Q>

            <Q no={7} badge="Bangun Plus" badgeColor="#4ade80" diagram={<DiagramQ4 />}>
              <p>
                Bangun berbentuk tanda plus (+) terdiri dari gabungan 5 persegi kecil yang masing-masing berukuran{" "}
                <InlineMath math="6 \text{ cm} \times 6 \text{ cm}" />.
                Tentukan luas bangun tersebut!
              </p>
            </Q>

            <Q no={8} badge="Pengurangan" badgeColor="#4ade80">
              <p>
                Sebuah persegi besar berukuran <InlineMath math="20 \text{ cm} \times 20 \text{ cm}" />.
                Di dalam persegi tersebut dipotong sebuah persegi panjang berukuran{" "}
                <InlineMath math="8 \text{ cm} \times 5 \text{ cm}" /> di pojok kanan atas.
                Tentukan luas bangun yang tersisa!
              </p>
            </Q>

            <Q no={9} badge="Grid" badgeColor="#4ade80" diagram={<DiagramQ5 />}>
              <p>
                Gambar di atas menunjukkan bangun pada kertas berpetak. Setiap kotak berukuran{" "}
                <InlineMath math="1 \text{ cm} \times 1 \text{ cm}" />.
                Tentukan luas bangun tersebut!
              </p>
            </Q>

            <Q no={10} badge="Penyesuaian" badgeColor="#4ade80">
              <p>
                Sebuah kolam renang berbentuk L memiliki bagian pertama berukuran{" "}
                <InlineMath math="12 \text{ m} \times 8 \text{ m}" /> dan bagian kedua berukuran{" "}
                <InlineMath math="6 \text{ m} \times 4 \text{ m}" />.
                Tentukan luas permukaan kolam!
              </p>
            </Q>
          </Section>

          {/* ── BAGIAN C: Aplikasi ── */}
          <Section title="Bagian C · Aplikasi & Pemecahan Masalah" color="#f87171">

            <Q no={11} badge="Biaya Cat" badgeColor="#f87171">
              <p>
                Dinding luar sebuah gudang berbentuk persegi panjang berukuran{" "}
                <InlineMath math="15 \text{ m} \times 8 \text{ m}" />. Di dinding tersebut terdapat 3 jendela
                masing-masing berukuran <InlineMath math="1{,}2 \text{ m} \times 1 \text{ m}" /> dan 1 pintu
                berukuran <InlineMath math="2 \text{ m} \times 1{,}5 \text{ m}" />.
                Jika biaya cat <InlineMath math="Rp\,45.000/\text{m}^2" />, berapakah total biaya mengecat dinding?
              </p>
            </Q>

            <Q no={12} badge="ANBK" badgeColor="#f87171">
              <p>
                Lantai aula sekolah berbentuk huruf L dengan ukuran: bagian panjang{" "}
                <InlineMath math="20 \text{ m} \times 6 \text{ m}" /> dan bagian lebar{" "}
                <InlineMath math="12 \text{ m} \times 8 \text{ m}" />. Lantai akan dipasangi keramik berukuran{" "}
                <InlineMath math="60 \text{ cm} \times 60 \text{ cm}" />.
                Berapa banyak keramik yang dibutuhkan?
              </p>
            </Q>

            <Q no={13} badge="TKA" badgeColor="#f87171">
              <p>
                Sebuah kebun sayur berbentuk persegi panjang berukuran{" "}
                <InlineMath math="24 \text{ m} \times 16 \text{ m}" />.
                Di sudut kanan atas kebun, terdapat kolam ikan berbentuk segitiga siku-siku dengan
                sisi siku-siku masing-masing <InlineMath math="6 \text{ m}" /> dan <InlineMath math="8 \text{ m}" />.
                Tentukan luas kebun sayur yang bisa ditanami (di luar kolam)!
              </p>
            </Q>

            <Q no={14} badge="UN 2018" badgeColor="#f87171">
              <p>
                Sebuah taman berbentuk persegi panjang berukuran <InlineMath math="40 \text{ m} \times 25 \text{ m}" />.
                Di dalam taman terdapat jalan setapak selebar <InlineMath math="2 \text{ m}" /> yang memotong
                taman secara horizontal dan vertikal tepat di tengah.
                Tentukan luas daerah hijau (taman di luar jalan setapak)!
              </p>
            </Q>

            <Q no={15} badge="HOTS" badgeColor="#f87171">
              <p>
                Perhatikan gambar denah ruangan berbentuk huruf C berikut (ukuran dalam meter):
              </p>
              <div className="bg-white/5 rounded-lg p-4 my-2 text-xs font-mono text-white/80 leading-loose">
                <span className="block">Sisi luar: panjang 18 m, tinggi 14 m</span>
                <span className="block">Cerukan dalam: lebar 10 m, tinggi 6 m (di bagian tengah kanan)</span>
              </div>
              <p>
                a) Tentukan keliling ruangan (jumlah semua sisi terluar)!<br/>
                b) Tentukan luas ruangan!<br/>
                c) Jika biaya pemasangan karpet <InlineMath math="Rp\,180.000/\text{m}^2" />, berapa total biayanya?
              </p>
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

export default KelilingLuasBangunTakBeraturanLatihanPage;
