import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, Lightbulb, Calculator, Target } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const DiagramTrapesium = () => (
  <svg viewBox="0 0 340 175" className="w-full max-w-sm mx-auto">
    {/* Trapesium siku-siku ABCD (kiri, biru) */}
    {/* Siku-siku di A (bawah-kiri) dan D (atas-kiri) — sisi AD vertikal */}
    {/* A=bawah-kiri, B=bawah-kanan, C=atas-kanan, D=atas-kiri */}
    <polygon points="18,140 82,140 68,92 18,92" fill="#3b82f6" fillOpacity="0.3" stroke="#60a5fa" strokeWidth="2"/>
    {/* Tanda siku-siku di A */}
    <polyline points="18,132 26,132 26,140" fill="none" stroke="#93c5fd" strokeWidth="1.2"/>
    {/* Tanda siku-siku di D */}
    <polyline points="18,100 26,100 26,92" fill="none" stroke="#93c5fd" strokeWidth="1.2"/>
    {/* Label titik sudut */}
    <text x="7"  y="150" fontSize="9" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="84" y="150" fontSize="9" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="70" y="89"  fontSize="9" fill="#93c5fd" fontWeight="bold">C</text>
    <text x="5"  y="89"  fontSize="9" fill="#93c5fd" fontWeight="bold">D</text>
    {/* Nama */}
    <text x="50" y="122" textAnchor="middle" fontSize="9" fill="#93c5fd" fontWeight="bold">ABCD</text>

    {/* Simbol ~ */}
    <text x="122" y="122" fontSize="18" fill="#facc15" textAnchor="middle">~</text>

    {/* Trapesium siku-siku PQRS (kanan, hijau, lebih besar) */}
    {/* Siku-siku di P (bawah-kiri) dan S (atas-kiri) — sisi PS vertikal */}
    {/* P=bawah-kiri, Q=bawah-kanan, R=atas-kanan, S=atas-kiri */}
    <polygon points="155,144 263,144 241,82 155,82" fill="#22c55e" fillOpacity="0.25" stroke="#4ade80" strokeWidth="2"/>
    {/* Tanda siku-siku di P */}
    <polyline points="155,136 163,136 163,144" fill="none" stroke="#86efac" strokeWidth="1.2"/>
    {/* Tanda siku-siku di S */}
    <polyline points="155,90 163,90 163,82" fill="none" stroke="#86efac" strokeWidth="1.2"/>
    {/* Label titik sudut */}
    <text x="143" y="155" fontSize="9" fill="#86efac" fontWeight="bold">P</text>
    <text x="265" y="155" fontSize="9" fill="#86efac" fontWeight="bold">Q</text>
    <text x="243" y="79"  fontSize="9" fill="#86efac" fontWeight="bold">R</text>
    <text x="142" y="79"  fontSize="9" fill="#86efac" fontWeight="bold">S</text>
    {/* Nama */}
    <text x="209" y="122" textAnchor="middle" fontSize="9" fill="#86efac" fontWeight="bold">PQRS</text>

    {/* Info box */}
    <rect x="10" y="8" width="185" height="20" rx="4" fill="#1e293b" stroke="#334155"/>
    <text x="102" y="22" textAnchor="middle" fontSize="9" fill="#fde68a" fontWeight="bold">dengan faktor skala k</text>
  </svg>
);


const DiagramContoh1 = () => (
  <svg viewBox="0 0 360 195" className="w-full max-w-lg mx-auto">
    {/* === ABCD (kiri, biru) === */}
    {/* A=bawah-kiri, B=bawah-kanan, C=atas-kanan, D=atas-kiri */}
    {/* AB=8, DC=6, AD=4(vertikal), BC=miring */}
    <polygon points="20,155 80,155 65,115 20,115" fill="#3b82f6" fillOpacity="0.25" stroke="#60a5fa" strokeWidth="1.8"/>
    {/* siku-siku A */}
    <polyline points="20,147 28,147 28,155" fill="none" stroke="#93c5fd" strokeWidth="1.1"/>
    {/* siku-siku D */}
    <polyline points="20,123 28,123 28,115" fill="none" stroke="#93c5fd" strokeWidth="1.1"/>
    {/* label titik */}
    <text x="10" y="167" fontSize="9" fill="#93c5fd" fontWeight="bold">A</text>
    <text x="82" y="167" fontSize="9" fill="#93c5fd" fontWeight="bold">B</text>
    <text x="67" y="111" fontSize="9" fill="#93c5fd" fontWeight="bold">C</text>
    <text x="8"  y="111" fontSize="9" fill="#93c5fd" fontWeight="bold">D</text>
    {/* dimensi AB */}
    <text x="50" y="170" textAnchor="middle" fontSize="8" fill="#7dd3fc">8 cm</text>
    {/* dimensi DC */}
    <text x="43" y="110" textAnchor="middle" fontSize="8" fill="#7dd3fc">6 cm</text>
    {/* dimensi AD */}
    <text x="5" y="138" textAnchor="middle" fontSize="8" fill="#7dd3fc">4</text>
    {/* dimensi BC */}
    <text x="84" y="138" textAnchor="start" fontSize="8" fill="#7dd3fc">5</text>

    {/* simbol ~ */}
    <text x="118" y="140" fontSize="20" fill="#facc15" textAnchor="middle">~</text>

    {/* === PQRS (kanan, hijau, 2× lebih besar) === */}
    {/* P=bawah-kiri, Q=bawah-kanan, R=atas-kanan, S=atas-kiri */}
    {/* PQ=16, RS=?, PS=?(vertikal), QR=? */}
    <polygon points="148,160 268,160 238,80 148,80" fill="#22c55e" fillOpacity="0.2" stroke="#4ade80" strokeWidth="1.8"/>
    {/* siku-siku P */}
    <polyline points="148,152 156,152 156,160" fill="none" stroke="#86efac" strokeWidth="1.1"/>
    {/* siku-siku S */}
    <polyline points="148,88 156,88 156,80" fill="none" stroke="#86efac" strokeWidth="1.1"/>
    {/* label titik */}
    <text x="137" y="173" fontSize="9" fill="#86efac" fontWeight="bold">P</text>
    <text x="270" y="173" fontSize="9" fill="#86efac" fontWeight="bold">Q</text>
    <text x="240" y="77"  fontSize="9" fill="#86efac" fontWeight="bold">R</text>
    <text x="136" y="77"  fontSize="9" fill="#86efac" fontWeight="bold">S</text>
    {/* dimensi PQ */}
    <text x="208" y="175" textAnchor="middle" fontSize="8" fill="#86efac">16 cm</text>
    {/* dimensi RS */}
    <text x="193" y="75" textAnchor="middle" fontSize="8" fill="#fbbf24">RS = ?</text>
    {/* dimensi PS */}
    <text x="130" y="122" textAnchor="middle" fontSize="8" fill="#fbbf24">PS=?</text>
    {/* dimensi QR */}
    <text x="274" y="122" textAnchor="start" fontSize="8" fill="#fbbf24">QR=?</text>
  </svg>
);

const MenghitungRusukPage = () => {
  const navigate = useNavigate();
  const Header = ({ id, icon, color, label }: { id: string; icon: React.ReactNode; color: string; label: string }) => (
    <div className="w-full flex items-center px-5 py-4">
      <div className="flex items-center gap-3"><span style={{ color }}>{icon}</span><span className="font-body font-semibold text-white">{label}</span></div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">MENGHITUNG PANJANG RUSUK BANGUN DATAR YANG SEBANGUN</h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Kelas 9 · Kesebangunan dan Kekongruenan · Materi Matematika</p>

        <div className="flex flex-col gap-4 animate-slide-up">

          {/* INTRO */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="intro" icon={<Lightbulb className="w-5 h-5" />} color="#facc15" label="📐 Cara Menghitung Rusuk yang Belum Diketahui" />
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  Kalau dua bangun sudah terbukti sebangun, kita bisa memanfaatkan sifat <strong className="text-cyan-300">rusuk-rusuk sebanding</strong> untuk mencari panjang rusuk yang belum diketahui. Caranya sangat sistematis!
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200">
                    <strong>Langkah Umum:</strong>
                  </p>
                  <ol className="font-body text-sm text-cyan-100 space-y-1 list-decimal list-inside mt-2">
                    <li>Identifikasi pasangan rusuk yang bersesuaian</li>
                    <li>Bentuk persamaan perbandingan: <InlineMath math="\frac{a}{p} = \frac{b}{q} = \frac{c}{r}" /></li>
                    <li>Gunakan perkalian silang untuk mencari rusuk yang belum diketahui</li>
                  </ol>
                </div>
              </div>
          </div>

          {/* KONSEP */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="konsep1" icon={<Target className="w-5 h-5" />} color="#4ade80" label="📘 Konsep: Rumus Perbandingan Rusuk" />
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-3">
                  <p className="font-body text-sm font-semibold text-green-300">🎯 Ringkasan Intisari</p>
                  <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                    <DiagramTrapesium />
                    <p className="font-body text-xs text-white/50 text-center mt-2">Trapesium ABCD ~ PQRS dengan faktor skala k</p>
                  </div>
                  <p className="font-body text-sm text-white/80">Jika bangun <InlineMath math="ABCD \sim PQRS" />, maka berlaku:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4">
                    <BlockMath math="\frac{AB}{PQ} = \frac{BC}{QR} = \frac{CD}{RS} = \frac{DA}{SP} = k" />
                  </div>
                  <p className="font-body text-sm text-white/80">Dari persamaan tersebut, jika tiga nilai diketahui, nilai ke-4 dapat dicari dengan <strong className="text-green-300">perkalian silang</strong>:</p>
                  <div className="bg-slate-900/60 rounded-lg p-4">
                    <BlockMath math="\frac{a}{p} = \frac{b}{q} \Rightarrow a \times q = b \times p" />
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-3">
                    <p className="font-body text-xs font-semibold text-green-300 mb-1">Kasus Bayangan (Kontekstual):</p>
                    <BlockMath math="\frac{\text{tinggi orang}}{\text{tinggi pohon}} = \frac{\text{tinggi bayangan orang}}{\text{tinggi bayangan pohon}}" />
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-4">
                  <p className="font-body text-xs font-semibold text-slate-300 mb-2">🌳 ILUSTRASI BAYANGAN:</p>
                  <img src="/bayangan-orang-pohon.png" alt="Ilustrasi bayangan orang dan pohon" className="w-full max-w-lg mx-auto rounded-lg block" />
                  <p className="font-body text-xs text-white/40 text-center mt-2">gemini.google.com/app</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200">
                    <strong>Tips:</strong> Selalu pastikan satuan panjangnya sama sebelum menghitung! Jika ada yang dalam cm dan ada yang dalam meter, ubah dulu ke satuan yang sama.
                  </p>
                </div>
              </div>
          </div>

          {/* CONTOH SOAL */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <Header id="contoh1" icon={<Calculator className="w-5 h-5" />} color="#60a5fa" label="📝 Contoh Soal — Menghitung Panjang Rusuk" />
              <div className="px-5 pb-5 space-y-6">
                {/* MUDAH */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">MUDAH</span>
                    <span className="font-body font-semibold text-white">Contoh 1</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Trapesium ABCD sebangun dengan trapesium PQRS. Diketahui <InlineMath math="AB = 8" /> cm, <InlineMath math="DC = 6" /> cm, <InlineMath math="BC = 5" /> cm, <InlineMath math="AD = 4" /> cm, dan <InlineMath math="PQ = 16" /> cm. Tentukan panjang <InlineMath math="QR" />, <InlineMath math="RS" />, dan <InlineMath math="PS" />!
                    </p>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-600/40 rounded-lg p-3">
                    <DiagramContoh1 />
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p>Karena ABCD ∼ PQRS, sisi-sisi yang bersesuaian membentuk perbandingan yang sama:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AB}{PQ} = \frac{BC}{QR} = \frac{DC}{RS} = \frac{AD}{PS}" />
                      </div>
                      <p><strong>Mencari QR</strong> (AB bersesuaian dengan PQ, BC bersesuaian dengan QR):</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AB}{PQ} = \frac{BC}{QR} \Rightarrow \frac{8}{16} = \frac{5}{QR}" />
                        <BlockMath math="8 \times QR = 16 \times 5 \Rightarrow QR = \frac{80}{8} = 10 \text{ cm}" />
                      </div>
                      <p><strong>Mencari RS</strong> (DC bersesuaian dengan RS):</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AB}{PQ} = \frac{DC}{RS} \Rightarrow \frac{8}{16} = \frac{6}{RS}" />
                        <BlockMath math="8 \times RS = 16 \times 6 \Rightarrow RS = \frac{96}{8} = 12 \text{ cm}" />
                      </div>
                      <p><strong>Mencari PS</strong> (AD bersesuaian dengan PS):</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AB}{PQ} = \frac{AD}{PS} \Rightarrow \frac{8}{16} = \frac{4}{PS}" />
                        <BlockMath math="8 \times PS = 16 \times 4 \Rightarrow PS = \frac{64}{8} = 8 \text{ cm}" />
                      </div>
                      <p><strong className="text-green-300">QR = 10 cm, RS = 12 cm, PS = 8 cm.</strong></p>
                    </div>
                  </div>
                </div>
                {/* SEDANG */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">SEDANG</span>
                    <span className="font-body font-semibold text-white">Contoh 2</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Segiempat ABCD sebangun dengan PQRS. Diketahui <InlineMath math="AD = 4" /> cm, <InlineMath math="PS = 6" /> cm, <InlineMath math="CD = 3" /> cm, dan <InlineMath math="\angle A = 75°" />. Tentukan panjang <InlineMath math="RS" /> dan besar <InlineMath math="\angle P" />!
                    </p>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Cari RS:</strong> AD bersesuaian dengan PS, CD bersesuaian dengan RS:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{AD}{PS} = \frac{CD}{RS} \Rightarrow \frac{4}{6} = \frac{3}{RS}" />
                        <BlockMath math="RS = \frac{3 \times 6}{4} = \frac{18}{4} = 4{,}5 \text{ cm}" />
                      </div>
                      <p><strong>Cari ∠P:</strong> Sudut yang bersesuaian sama besar:</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\angle P = \angle A = 75°" />
                      </div>
                      <p><strong className="text-yellow-300">RS = 4,5 cm dan ∠P = 75°.</strong></p>
                    </div>
                  </div>
                </div>
                {/* SULIT */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">SULIT</span>
                    <span className="font-body font-semibold text-white">Contoh 3</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white">
                      Pada siang hari, sebuah tiang bendera setinggi 3 m mempunyai bayangan 1,8 m. Pada saat yang sama, sebuah pohon mempunyai bayangan sepanjang 2,1 m. Tentukan tinggi pohon tersebut!
                    </p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">PEMBAHASAN:</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>Konsep:</strong> Tiang dan bayangan membentuk segitiga yang sebangun dengan pohon dan bayangannya (karena sudut elevasi matahari sama).</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="\frac{\text{tinggi tiang}}{\text{bayangan tiang}} = \frac{\text{tinggi pohon}}{\text{bayangan pohon}}" />
                        <BlockMath math="\frac{3}{1{,}8} = \frac{h}{2{,}1}" />
                      </div>
                      <p><strong>Selesaikan:</strong></p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math="h = \frac{3 \times 2{,}1}{1{,}8} = \frac{6{,}3}{1{,}8} = 3{,}5 \text{ m}" />
                      </div>
                      <p><strong className="text-primary">Tinggi pohon = 3,5 m.</strong></p>
                    </div>
                  </div>
                </div>
              </div>
          </div>

        </div>
        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/materi-matematika/kelas-9/kesebangunan-kekongruenan"); }} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body">
            ← Kembali ke Kesebangunan dan Kekongruenan
          </button>
        </div>
      </div>
    </div>
  );
};
export default MenghitungRusukPage;
