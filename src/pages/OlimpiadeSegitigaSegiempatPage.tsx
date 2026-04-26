import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import PembahasanCard from "@/components/PembahasanCard";
import { segitigaSegiempatDasarPembahasan } from "@/data/pembahasan/segitigaSegiempatDasar";
import { segitigaSegiempatOlimpiadePembahasan } from "@/data/pembahasan/segitigaSegiempatOlimpiade";

// Helper function to render text with LaTeX
const renderWithLatex = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.slice(1, -1);
      return <InlineMath key={index} math={latex} />;
    }
    return <span key={index}>{part}</span>;
  });
};

/* ============================================================
   SVG MINI-DIAGRAMS untuk Materi Segitiga & Segiempat
   ============================================================ */
const fillCol = "rgba(34,211,238,0.15)";
const strokeCol = "#22d3ee";
const labCol = "#fbbf24";

const PersegiSVG = () => (
  <svg viewBox="0 0 130 110" className="w-full max-w-[130px]" data-testid="svg-persegi">
    <rect x="25" y="20" width="80" height="80" fill={fillCol} stroke={strokeCol} strokeWidth="2" />
    <text x="65" y="14" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">s</text>
    <text x="112" y="64" textAnchor="start" fill={labCol} fontSize="11" fontWeight="bold">s</text>
  </svg>
);

const PersegiPanjangSVG = () => (
  <svg viewBox="0 0 160 110" className="w-full max-w-[160px]" data-testid="svg-persegi-panjang">
    <rect x="20" y="25" width="120" height="65" fill={fillCol} stroke={strokeCol} strokeWidth="2" />
    <text x="80" y="18" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">p</text>
    <text x="146" y="60" textAnchor="start" fill={labCol} fontSize="11" fontWeight="bold">l</text>
  </svg>
);

const JajarGenjangSVG = () => (
  <svg viewBox="0 0 170 110" className="w-full max-w-[170px]" data-testid="svg-jajar-genjang">
    <polygon points="35,90 135,90 145,25 45,25" fill={fillCol} stroke={strokeCol} strokeWidth="2" />
    <line x1="135" y1="90" x2="135" y2="25" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
    <text x="85" y="103" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">a</text>
    <text x="142" y="60" textAnchor="start" fill={labCol} fontSize="11" fontWeight="bold">t</text>
    <text x="155" y="60" textAnchor="start" fill={labCol} fontSize="11" fontWeight="bold">b</text>
  </svg>
);

const BelahKetupatSVG = () => (
  <svg viewBox="0 0 140 130" className="w-full max-w-[140px]" data-testid="svg-belah-ketupat">
    <polygon points="70,15 125,65 70,115 15,65" fill={fillCol} stroke={strokeCol} strokeWidth="2" />
    <line x1="15" y1="65" x2="125" y2="65" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="70" y1="15" x2="70" y2="115" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
    <text x="40" y="60" textAnchor="middle" fill={labCol} fontSize="10" fontWeight="bold">d₁</text>
    <text x="78" y="40" textAnchor="start" fill={labCol} fontSize="10" fontWeight="bold">d₂</text>
    <text x="100" y="35" textAnchor="middle" fill={labCol} fontSize="10" fontWeight="bold">s</text>
  </svg>
);

const LayangLayangSVG = () => (
  <svg viewBox="0 0 140 140" className="w-full max-w-[140px]" data-testid="svg-layang-layang">
    <polygon points="70,10 120,50 70,130 20,50" fill={fillCol} stroke={strokeCol} strokeWidth="2" />
    <line x1="20" y1="50" x2="120" y2="50" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="70" y1="10" x2="70" y2="130" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
    <text x="42" y="46" textAnchor="middle" fill={labCol} fontSize="10" fontWeight="bold">d₁</text>
    <text x="78" y="32" textAnchor="start" fill={labCol} fontSize="10" fontWeight="bold">d₂</text>
    <text x="100" y="28" textAnchor="middle" fill={labCol} fontSize="10" fontWeight="bold">a</text>
    <text x="100" y="100" textAnchor="middle" fill={labCol} fontSize="10" fontWeight="bold">b</text>
  </svg>
);

const TrapesiumSVG = () => (
  <svg viewBox="0 0 180 120" className="w-full max-w-[180px]" data-testid="svg-trapesium">
    <polygon points="40,95 140,95 115,25 65,25" fill={fillCol} stroke={strokeCol} strokeWidth="2" />
    <line x1="115" y1="25" x2="115" y2="95" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
    <text x="90" y="18" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">a</text>
    <text x="90" y="110" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">b</text>
    <text x="122" y="62" textAnchor="start" fill={labCol} fontSize="11" fontWeight="bold">t</text>
    <text x="48" y="62" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">c</text>
    <text x="138" y="62" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">d</text>
  </svg>
);

const SegitigaSVG = () => (
  <svg viewBox="0 0 160 130" className="w-full max-w-[160px]" data-testid="svg-segitiga">
    <polygon points="20,110 140,110 95,20" fill={fillCol} stroke={strokeCol} strokeWidth="2" />
    <line x1="95" y1="20" x2="95" y2="110" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
    <text x="80" y="124" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">a</text>
    <text x="100" y="68" textAnchor="start" fill={labCol} fontSize="11" fontWeight="bold">t</text>
    <text x="48" y="62" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">c</text>
    <text x="124" y="62" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">b</text>
  </svg>
);

const SegitigaSikuSVG = () => (
  <svg viewBox="0 0 150 130" className="w-full max-w-[150px]" data-testid="svg-segitiga-siku">
    <polygon points="25,110 130,110 25,25" fill={fillCol} stroke={strokeCol} strokeWidth="2" />
    <rect x="25" y="100" width="10" height="10" fill="none" stroke="#94a3b8" strokeWidth="1" />
    <text x="78" y="124" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">alas</text>
    <text x="20" y="68" textAnchor="end" fill={labCol} fontSize="11" fontWeight="bold">tinggi</text>
    <text x="90" y="62" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">miring</text>
  </svg>
);

const SegitigaSamaSisiSVG = () => (
  <svg viewBox="0 0 150 130" className="w-full max-w-[150px]" data-testid="svg-segitiga-sama-sisi">
    <polygon points="25,110 125,110 75,25" fill={fillCol} stroke={strokeCol} strokeWidth="2" />
    <text x="75" y="124" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">s</text>
    <text x="40" y="62" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">s</text>
    <text x="112" y="62" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">s</text>
  </svg>
);

const SegitigaSamaKakiSVG = () => (
  <svg viewBox="0 0 150 130" className="w-full max-w-[150px]" data-testid="svg-segitiga-sama-kaki">
    <polygon points="30,110 120,110 75,20" fill={fillCol} stroke={strokeCol} strokeWidth="2" />
    <text x="75" y="124" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">a</text>
    <text x="42" y="62" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">b</text>
    <text x="110" y="62" textAnchor="middle" fill={labCol} fontSize="11" fontWeight="bold">b</text>
  </svg>
);

/* ============================================================
   Reusable visual building blocks
   ============================================================ */
const FormulaBox = ({ label, latex }: { label: string; latex: string }) => (
  <div className="rounded-lg border border-cyan-400/40 bg-cyan-950/30 px-3 py-2">
    <div className="text-[10px] uppercase tracking-widest text-cyan-300/80 font-semibold mb-1">{label}</div>
    <div className="text-white text-sm"><BlockMath math={latex} /></div>
  </div>
);

const ShapeCard = ({
  no, nama, svg, luas, keliling, ciri, testId,
}: {
  no: string; nama: string; svg: ReactNode; luas: string; keliling: string; ciri: string[]; testId: string;
}) => (
  <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3 sm:p-4" data-testid={testId}>
    <div className="flex items-start gap-3 mb-3">
      <span className="flex-shrink-0 w-7 h-7 rounded-md bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 text-xs font-bold flex items-center justify-center">
        {no}
      </span>
      <div className="font-display text-sm text-yellow-300 font-bold pt-1">{nama}</div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3 items-start">
      <div className="flex justify-center bg-slate-950/60 rounded-lg p-2 border border-white/5">{svg}</div>
      <div className="space-y-2">
        <FormulaBox label="Luas" latex={luas} />
        <FormulaBox label="Keliling" latex={keliling} />
      </div>
    </div>
    <div className="mt-3">
      <div className="text-[10px] uppercase tracking-widest text-yellow-300/70 font-semibold mb-1">Ciri-ciri</div>
      <ul className="list-disc list-inside text-xs text-white/75 space-y-0.5">
        {ciri.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
    </div>
  </div>
);

/* ============================================================
   Materi sections (render-based)
   ============================================================ */
type MateriSection = { heading: string; render: () => ReactNode };

const segiempatList: Array<{ no: string; nama: string; svg: ReactNode; luas: string; keliling: string; ciri: string[]; testId: string }> = [
  {
    no: "1", nama: "Persegi", svg: <PersegiSVG />, testId: "card-persegi",
    luas: "L = s \\times s = s^{2}", keliling: "K = 4 \\times s",
    ciri: ["Keempat sisinya sama panjang.", "Keempat sudutnya siku-siku (90°).", "Diagonalnya sama panjang dan saling tegak lurus."],
  },
  {
    no: "2", nama: "Persegi Panjang", svg: <PersegiPanjangSVG />, testId: "card-persegi-panjang",
    luas: "L = p \\times l", keliling: "K = 2(p + l)",
    ciri: ["Sisi yang berhadapan sama panjang dan sejajar.", "Keempat sudutnya siku-siku.", "Kedua diagonalnya sama panjang dan saling membagi dua sama panjang."],
  },
  {
    no: "3", nama: "Jajar Genjang", svg: <JajarGenjangSVG />, testId: "card-jajar-genjang",
    luas: "L = a \\times t", keliling: "K = 2(a + b)",
    ciri: ["Sisi yang berhadapan sama panjang dan sejajar.", "Sudut yang berhadapan sama besar.", "Diagonalnya saling membagi dua sama panjang."],
  },
  {
    no: "4", nama: "Belah Ketupat", svg: <BelahKetupatSVG />, testId: "card-belah-ketupat",
    luas: "L = \\tfrac{1}{2} \\times d_{1} \\times d_{2}", keliling: "K = 4 \\times s",
    ciri: ["Keempat sisinya sama panjang.", "Sudut yang berhadapan sama besar.", "Diagonalnya saling tegak lurus dan membagi dua sama panjang."],
  },
  {
    no: "5", nama: "Layang-layang", svg: <LayangLayangSVG />, testId: "card-layang-layang",
    luas: "L = \\tfrac{1}{2} \\times d_{1} \\times d_{2}", keliling: "K = 2(a + b)",
    ciri: ["Memiliki 2 pasang sisi sama panjang yang berdekatan.", "Sepasang sudut yang berhadapan sama besar.", "Diagonalnya saling tegak lurus, salah satunya membagi yang lain sama panjang."],
  },
  {
    no: "6", nama: "Trapesium", svg: <TrapesiumSVG />, testId: "card-trapesium",
    luas: "L = \\tfrac{1}{2} \\times (a + b) \\times t", keliling: "K = a + b + c + d",
    ciri: ["Memiliki tepat sepasang sisi sejajar (a dan b).", "Jumlah sudut antara dua sisi sejajar adalah 180°.", "Jenis: trapesium sembarang, sama kaki, dan siku-siku."],
  },
];

const segitigaList: Array<{ no: string; nama: string; svg: ReactNode; luas: string; keliling: string; ciri: string[]; testId: string }> = [
  {
    no: "1", nama: "Segitiga (Umum)", svg: <SegitigaSVG />, testId: "card-segitiga-umum",
    luas: "L = \\tfrac{1}{2} \\times a \\times t", keliling: "K = a + b + c",
    ciri: ["Memiliki 3 sisi dan 3 sudut.", "Jumlah ketiga sudutnya 180°.", "Tinggi (t) tegak lurus terhadap alas (a)."],
  },
  {
    no: "2", nama: "Segitiga Siku-siku", svg: <SegitigaSikuSVG />, testId: "card-segitiga-siku",
    luas: "L = \\tfrac{1}{2} \\times \\text{alas} \\times \\text{tinggi}", keliling: "K = a + b + c",
    ciri: ["Salah satu sudutnya 90°.", "Sisi miring (hipotenusa) ada di depan sudut siku-siku.", "Berlaku Teorema Pythagoras: $a^2 + b^2 = c^2$."],
  },
  {
    no: "3", nama: "Segitiga Sama Sisi", svg: <SegitigaSamaSisiSVG />, testId: "card-segitiga-sama-sisi",
    luas: "L = \\tfrac{\\sqrt{3}}{4} \\times s^{2}", keliling: "K = 3 \\times s",
    ciri: ["Ketiga sisinya sama panjang.", "Ketiga sudutnya sama besar (60°).", "Memiliki 3 sumbu simetri."],
  },
  {
    no: "4", nama: "Segitiga Sama Kaki", svg: <SegitigaSamaKakiSVG />, testId: "card-segitiga-sama-kaki",
    luas: "L = \\tfrac{1}{2} \\times a \\times t", keliling: "K = a + 2b",
    ciri: ["Memiliki 2 sisi sama panjang (kaki).", "Dua sudut alas sama besar.", "Memiliki 1 sumbu simetri."],
  },
];

const materiSection = {
  title: "MATERI - SEGITIGA DAN SEGIEMPAT",
  sections: [
    {
      heading: "A. Pengertian Segitiga dan Segiempat",
      render: () => (
        <div className="space-y-3 text-white/85 text-sm leading-relaxed">
          <p>
            <span className="text-yellow-300 font-semibold">Bangun datar</span> adalah bangun dua dimensi yang dibatasi oleh garis-garis lurus atau lengkung.
            Pada bab ini kita fokus pada dua keluarga bangun datar:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-white/10 bg-slate-900/50 p-3">
              <div className="text-yellow-300 font-bold text-sm mb-1">Segitiga</div>
              <p className="text-xs text-white/75">
                Bangun datar yang dibentuk oleh tiga ruas garis yang saling bertemu pada tiga titik sudut.
                Jumlah ketiga sudut dalamnya selalu <span className="text-cyan-300 font-semibold">180°</span>.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-900/50 p-3">
              <div className="text-yellow-300 font-bold text-sm mb-1">Segiempat</div>
              <p className="text-xs text-white/75">
                Bangun datar yang memiliki empat sisi dan empat titik sudut.
                Jumlah keempat sudut dalamnya selalu <span className="text-cyan-300 font-semibold">360°</span>.
              </p>
            </div>
          </div>
          <p className="text-xs text-white/70">
            Setiap bangun datar memiliki dua besaran utama yang akan kita pelajari, yaitu
            <span className="text-cyan-300 font-semibold"> Luas (L)</span> — ukuran daerah di dalam bangun, dan
            <span className="text-cyan-300 font-semibold"> Keliling (K)</span> — total panjang seluruh sisinya.
          </p>
        </div>
      ),
    },
    {
      heading: "B. Bangun Datar Segiempat",
      render: () => (
        <div className="space-y-4">
          <p className="text-xs text-white/70">
            Berikut enam jenis segiempat beserta gambar, rumus luas, rumus keliling, dan ciri-cirinya.
          </p>
          {segiempatList.map((s) => (
            <ShapeCard key={s.nama} {...s} />
          ))}
        </div>
      ),
    },
    {
      heading: "C. Bangun Datar Segitiga",
      render: () => (
        <div className="space-y-4">
          <p className="text-xs text-white/70">
            Segitiga dibedakan berdasarkan panjang sisi dan besar sudutnya. Berikut jenis-jenis utamanya
            beserta rumus luas dan keliling.
          </p>
          {segitigaList.map((s) => (
            <ShapeCard key={s.nama} {...s} />
          ))}
        </div>
      ),
    },
    {
      heading: "D. Rangkuman Rumus",
      render: () => (
        <div className="space-y-3">
          <p className="text-xs text-white/70">
            Tabel ringkas seluruh rumus luas dan keliling bangun segitiga dan segiempat.
          </p>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-xs text-left" data-testid="table-rangkuman-rumus">
              <thead className="bg-yellow-400/10 text-yellow-300">
                <tr>
                  <th className="px-3 py-2 font-semibold">No</th>
                  <th className="px-3 py-2 font-semibold">Bangun</th>
                  <th className="px-3 py-2 font-semibold">Rumus Luas</th>
                  <th className="px-3 py-2 font-semibold">Rumus Keliling</th>
                </tr>
              </thead>
              <tbody className="text-white/85">
                {[
                  { n: 1, b: "Persegi", l: "s \\times s", k: "4 \\times s" },
                  { n: 2, b: "Persegi Panjang", l: "p \\times l", k: "2(p + l)" },
                  { n: 3, b: "Jajar Genjang", l: "a \\times t", k: "2(a + b)" },
                  { n: 4, b: "Belah Ketupat", l: "\\tfrac{1}{2} \\, d_{1} \\, d_{2}", k: "4 \\times s" },
                  { n: 5, b: "Layang-layang", l: "\\tfrac{1}{2} \\, d_{1} \\, d_{2}", k: "2(a + b)" },
                  { n: 6, b: "Trapesium", l: "\\tfrac{1}{2}(a + b) \\, t", k: "a + b + c + d" },
                  { n: 7, b: "Segitiga", l: "\\tfrac{1}{2} \\times a \\times t", k: "a + b + c" },
                  { n: 8, b: "Segitiga Sama Sisi", l: "\\tfrac{\\sqrt{3}}{4} \\, s^{2}", k: "3 \\times s" },
                ].map((r) => (
                  <tr key={r.n} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-3 py-2 align-top">{r.n}</td>
                    <td className="px-3 py-2 align-top font-semibold text-yellow-200/90">{r.b}</td>
                    <td className="px-3 py-2 align-top"><InlineMath math={r.l} /></td>
                    <td className="px-3 py-2 align-top"><InlineMath math={r.k} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-lg border border-cyan-400/30 bg-cyan-950/20 p-3">
            <div className="text-[10px] uppercase tracking-widest text-cyan-300/80 font-semibold mb-1">Tips Cepat</div>
            <ul className="list-disc list-inside text-xs text-white/75 space-y-1">
              <li>Belah ketupat & layang-layang punya rumus luas yang <span className="text-cyan-300">sama</span>: setengah hasil kali diagonal.</li>
              <li>Persegi adalah kasus khusus persegi panjang (saat <InlineMath math="p = l" />).</li>
              <li>Persegi panjang, jajar genjang, belah ketupat, dan persegi semuanya termasuk <span className="text-cyan-300">jajar genjang</span> bila sisi berhadapannya sejajar.</li>
              <li>Pada segitiga siku-siku berlaku <span className="text-cyan-300">Teorema Pythagoras</span>: <InlineMath math="a^{2} + b^{2} = c^{2}" />.</li>
            </ul>
          </div>
        </div>
      ),
    },
  ] as MateriSection[],
};

/* SVG soal Latihan Dasar No. 2 — bangun L dengan langkah di kiri-bawah (label 4 cm + tick mark) */
const BangunSoal2SegiSVG = () => {
  const stroke = "#1e293b";
  // Skala 1 cm = 14 px, padding 30 px. Bounding 18 cm × 20 cm.
  // Path titik (clockwise dari kiri-atas):
  // A(30,30) -> B(282,30) -> C(282,310) -> D(156,310) -> E(156,198)
  // -> F(100,198) -> G(100,254) -> H(30,254) -> back to A
  const points = "30,30 282,30 282,310 156,310 156,198 100,198 100,254 30,254";
  return (
    <svg viewBox="0 0 320 350" className="w-full max-w-[320px]" data-testid="svg-soal-segi-dasar-2">
      <polygon points={points} fill="white" stroke={stroke} strokeWidth="2" />
      {/* Label 18 cm di atas */}
      <text x="156" y="22" textAnchor="middle" fill={stroke} fontSize="13" fontWeight="bold">18 cm</text>
      {/* Label 20 cm di kanan */}
      <text x="295" y="172" textAnchor="middle" fill={stroke} fontSize="13" fontWeight="bold" transform="rotate(90, 295, 172)">20 cm</text>
      {/* Label 9 cm di bawah segmen bottom-right */}
      <text x="219" y="328" textAnchor="middle" fill={stroke} fontSize="13" fontWeight="bold">9 cm</text>
      {/* Label 4 cm di kiri segmen langkah (E→F horizontal di y=198) */}
      <text x="78" y="217" textAnchor="end" fill={stroke} fontSize="13" fontWeight="bold">4 cm</text>
      {/* Tanda strip pada segmen yang sama panjang (E-F dan F-G keduanya 4 cm) */}
      {/* Tick di tengah E-F (horizontal, midpoint ≈ (128,198)) */}
      <line x1="126" y1="194" x2="130" y2="202" stroke={stroke} strokeWidth="1.5" />
      {/* Tick di tengah F-G (vertical, midpoint ≈ (100,226)) */}
      <line x1="96" y1="224" x2="104" y2="228" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
};

/* SVG soal Latihan Dasar No. 3 — bangun tangga (staircase) 15 × 28 dengan 10 cm di kanan-atas */
const BangunSoal3SegiSVG = () => {
  const stroke = "#1e293b";
  // Skala 1 cm = 10 px, padding kiri 40, padding atas 30. Bounding 15 × 28 cm.
  // Path clockwise dari (0,0):
  // (15,0) → (15,10) → (11,10) → (11,16) → (7,16) → (7,22) → (3,22) → (3,28) → (0,28)
  const points = "40,30 190,30 190,130 150,130 150,190 110,190 110,250 70,250 70,310 40,310";
  return (
    <svg viewBox="0 0 240 340" className="w-full max-w-[260px]" data-testid="svg-soal-segi-dasar-3">
      <polygon points={points} fill="white" stroke={stroke} strokeWidth="2" />
      {/* Label 15 cm di atas */}
      <text x="115" y="22" textAnchor="middle" fill={stroke} fontSize="13" fontWeight="bold">15 cm</text>
      {/* Label 10 cm di kanan-atas */}
      <text x="200" y="84" textAnchor="start" fill={stroke} fontSize="13" fontWeight="bold">10 cm</text>
      {/* Label 28 cm di kiri (rotasi) */}
      <text x="28" y="170" textAnchor="middle" fill={stroke} fontSize="13" fontWeight="bold" transform="rotate(-90, 28, 170)">28 cm</text>
      {/* Tick mark pada segmen horizontal sama panjang (4 cm) */}
      {[
        { x: 170, y: 130 }, // midpoint (190,130)-(150,130)
        { x: 130, y: 190 }, // midpoint (150,190)-(110,190)
        { x: 90,  y: 250 }, // midpoint (110,250)-(70,250)
      ].map((p, i) => (
        <line key={`h${i}`} x1={p.x} y1={p.y - 4} x2={p.x} y2={p.y + 4} stroke={stroke} strokeWidth="1.5" />
      ))}
      {/* Tick mark pada segmen vertical sama panjang (6 cm) */}
      {[
        { x: 150, y: 160 }, // midpoint (150,130)-(150,190)
        { x: 110, y: 220 }, // midpoint (110,190)-(110,250)
        { x: 70,  y: 280 }, // midpoint (70,250)-(70,310)
      ].map((p, i) => (
        <line key={`v${i}`} x1={p.x - 4} y1={p.y} x2={p.x + 4} y2={p.y} stroke={stroke} strokeWidth="1.5" />
      ))}
    </svg>
  );
};

/* SVG soal Latihan Dasar No. 1 — bangun majemuk dengan 2 takik di atas & 1 takik kanan-bawah */
const BangunSoal1SegiSVG = () => {
  const stroke = "#1e293b";
  const points = "20,20 100,20 100,60 140,60 140,20 180,20 180,60 220,60 220,20 300,20 300,160 260,160 260,220 20,220";
  return (
    <svg viewBox="0 0 320 240" className="w-full max-w-[300px]" data-testid="svg-soal-segi-dasar-1">
      <polygon points={points} fill="white" stroke={stroke} strokeWidth="2" />
      {/* label "4 cm" untuk segmen kiri-atas (20,20)-(100,20) panjang 4 cm */}
      <text x="60" y="14" textAnchor="middle" fill={stroke} fontSize="12" fontWeight="bold">4 cm</text>
      {/* label "10 cm" untuk sisi kiri (20,20)-(20,220) panjang 10 cm */}
      <text x="14" y="120" textAnchor="middle" fill={stroke} fontSize="12" fontWeight="bold" transform="rotate(-90, 14, 120)">10 cm</text>
      {/* Tanda strip pada segmen 2 cm yang sama panjang */}
      {[
        { x1: 118, y1: 56, x2: 122, y2: 64 },   // notch1 bottom (100,60)-(140,60)
        { x1: 158, y1: 16, x2: 162, y2: 24 },   // top middle (140,20)-(180,20)
        { x1: 198, y1: 56, x2: 202, y2: 64 },   // notch2 bottom (180,60)-(220,60)
        { x1: 96,  y1: 38, x2: 104, y2: 42 },   // notch1 left wall (100,20)-(100,60)
        { x1: 136, y1: 38, x2: 144, y2: 42 },   // notch1 right wall (140,20)-(140,60)
        { x1: 176, y1: 38, x2: 184, y2: 42 },   // notch2 left wall (180,20)-(180,60)
        { x1: 216, y1: 38, x2: 224, y2: 42 },   // notch2 right wall (220,20)-(220,60)
      ].map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={stroke} strokeWidth="1.5" />
      ))}
    </svg>
  );
};

const latihanDasar = [
  { no: 1, soal: "Perhatikan gambar berikut.\nKeliling bangun di atas adalah ...", options: ["A. 44 cm", "B. 48 cm", "C. 49 cm", "D. 52 cm"] },
  { no: 2, soal: "Perhatikan gambar berikut ini.\nKeliling bangun di atas adalah ...", options: ["A. 61 cm", "B. 84 cm", "C. 90 cm", "D. 94 cm"] },
  { no: 3, soal: "Perhatikan gambar.\nLuas gambar di samping adalah ...", options: ["A. 294 $cm^2$", "B. 290 $cm^2$", "C. 258 $cm^2$", "D. 250 $cm^2$"] },
  { no: 4, soal: "Perhatikan gambar berikut. Luas huruf capital di samping adalah ..", options: ["A. 425 $cm^2$", "B. 450 $cm^2$", "C. 500 $cm^2$", "D. 525 $cm^2$"] },
  { no: 5, soal: "Perhatikan gambar.\nDiketahui AB = 20 cm, AF = 13 cm dan BD = 10 cm. luas bangun di samping adalah ...", options: ["A. 280 $cm^2$", "B. 320 $cm^2$", "C. 360 $cm^2$", "D. 480 $cm^2$"] },
  { no: 6, soal: "Perhatikan gambar berikut.\nPanjang AD = BE = 17 cm dan DE = 15 cm. luas bangun AGBCHD adalah...", options: ["A. 375 $cm^2$", "B. 525 $cm^2$", "C. 600 $cm^2$", "D. 750 $cm^2$"] },
  { no: 7, soal: "Perhatikan gambar berikut.\nLuas daerah yang diarsir adalah ...", options: ["A. 60 $cm^2$", "B. 66 $cm^2$", "C. 72 $cm^2$", "D. 90 $cm^2$"] },
  { no: 8, soal: "Perhatikan gambar di bawah!\nLuas daerah yang diarsir adalah ....", options: ["A. 42 $cm^2$", "B. 56 $cm^2$", "C. 70 $cm^2$", "D. 84 $cm^2$"] },
  { no: 9, soal: "Perhatikan gambar persegi ABCD dan persegi panjang EFGH berikut!\nJika luas daerah yang tidak diarsir 68 $cm^2$ luas daerah yang diarsir adalah ....", options: ["A. 24 $cm^2$", "B. 28 $cm^2$", "C. 30 $cm^2$", "D. 56 $cm^2$"] },
  { no: 10, soal: "Sebuah taman bebentuk trapesium sama kaki dengan Panjang sisi yang sejajar adalah 40 m dan 16 m, tinggi trapesium 16 m. taman itu akan diterangi dengan lampu di pinggir taman dengan jarak tiang lampu adalah 4 m, maka banyaknya tiang yang dibutuhkan seluruhnya adalah ..", options: ["A. 18 tiang", "B. 20 tiang", "C. 24 tiang", "D. 28 tiang"] },
  { no: 11, soal: "Taman berbentuk lingkaran dengan Panjang diameter 14 m akan dipasangkan tiang lampu dengan jarak antar tiang 4 m. jika biaya 1 tiang lampu Rp 200.000,00, maka biaya seluruhnya untuk memasang tiang lampu tersebut adalah ..", options: ["A. Rp 2.200.000,00", "B. Rp 2.800.000,00", "C. Rp 3.300.000,00", "D. Rp 4.400.000,00"] },
  { no: 12, soal: "Lantai ruang tamu berukuran 4,2 m x 3,6 m. Jika akan ditutup dengan keramik persegi berukuran 30 cm. maka banyaknya keramik yang diperlukan adalah.....", options: ["A. 150", "B. 168", "C. 180", "D. 200"] },
  { no: 13, soal: "Sebuah kolam renang berbentuk persegi panjang, mempunyai ukuran panjang 20 meter dan lebar 10 meter. Di sekeliling kolam renang bagian luar akan dibuat jalan dengan lebar 1 meter. Jika jalan akan dipasang keramik dengan biaya Rp60.000,00 setiap meter persegi, maka biaya yang diperlukan untuk pemasangan keramik adalah", options: ["A. Rp1.860.000,00", "B. Rp3.600.000,00", "C. Rp3.840.000,00", "D. Rp12.000.000,00"] },
];

const latihanOlimpiade = [
  { no: 1, soal: "OSN Matematika 2003 Tingkat Kota\nBanyaknya segitiga pada gambar berikut adalah ...", options: [] },
  { no: 2, soal: "OSN Matematika 2003 Tingkat Kota\nGambar bangun berikut disusun oleh 5 persegi yang kongruen. Kalua keliling bangun ini 72 cm, maka luas bangun tersebut adalah ...", options: [] },
  { no: 3, soal: "OSN Matematika 2003 Tingkat Kota\nGambar bangun berikut, ABCD adalah persegi dengan sisi 6 satuan. Titik E dan F membagi diagonal AC menjadi tiga bagian sama panjang. Luas segitiga DEF = ...", options: [] },
  { no: 4, soal: "OSN Matematika 2004 Tingkat Kota\nPersegi panjang besar berukuran 9 cm x 5 cm. daerah yang diarsir adalah satu-satunya bangun di dalam persegi panjang yang bukan persegi. Berapakah luas daerah yang diarsir.", options: ["A. 1,5 $cm^2$", "B. 2 $cm^2$", "C. 3 $cm^2$", "D. 3,5 $cm^2$", "E. 4 $cm^2$"] },
  { no: 5, soal: "OSN Matematika 2004 Tingkat Kota\nPersegi pada gambar disamping memiliki luas satu satuan luas. Pecahan yang menyatakan luas dari daerah yang tidak diarsir adalah ...", options: ["A. $\\frac{1}{3}$", "B. $\\frac{2}{5}$", "C. $\\frac{3}{5}$", "D. $\\frac{3}{7}$", "E. $\\frac{3}{8}$"] },
  { no: 6, soal: "OSN Matematika 2005 Tingkat Kota\nPerhatikan gambar berikut.\nJika jarak terdekat titik-titik tersebut secara vertical maupun harisontal adalah 2 satuan, maka luas daerah persegi pada gambar adalah ... satuan", options: ["A. 10", "B. 40", "C. 20", "D. 30", "E. 50"] },
  { no: 7, soal: "OSN Matematika 2005 Tingkat Kota\nPersegi ABCD dengan panjang sisi satu satuan panjang. Misalkan P suatu titik di dalam sehingga ukuran sutu APB $120^0$. Jumlah luas daerah segitiga APB dan segitiga CPD adalah ...", options: [] },
  { no: 8, soal: "OSN Matematika 2007 Tingkat Kota\nPerhatikan gambar berikut.\n(Salah satu daerah persegi yang dimaksud adalah daerah yang diarsir)\nBanyak persegi yang terletak pada daerah persegi ABCD berukuran 9 x 9 dan paling sedikit satu sisinya terletak pada persegi ABCD adalah ...", options: [] },
  { no: 9, soal: "OSN Matematika 2007 Tingkat Kota\nDi laboratorium Matematika terdapat 6 batang kayu sejenis yang panjangnya berturut-turut 4 dm, 4 dm, 10 dm, 22 dm dan 37 dm. jika keenam batang kayu tersebut harus digunakan untuk membuat trapesium samakaki, maka banyak trapesium sama kaki yang dapat dibentuk adalah ...", options: [] },
  { no: 10, soal: "OSN Matematika 2008 Tingkat Kota\nPerhatikan gambar berikut.\nABCD merupakan persegi panjang dan EFGH adalah jajaran genjang, maka panjang sisi x adalah ...", options: ["A. 6,8", "B. 7,2", "C. 7,6", "D. 8,0", "E. 8,1"] },
  { no: 11, soal: "OSN Matematika 2008 Tingkat Kota\nDiberikan sebuah persegi dengan sisi a satuan.\nEmpat buah segitiga siku-siku dipotong dari persegi tersebut seperti digambarkan sebagai daerah berarsir abu-abu. Diketahui semua siku-siku yang lebih pendek memiliki panjang $\\frac{3}{8}a$ satuan. Luas daerah tak berarsir pada persegi tersebut adalah ...", options: [] },
  { no: 12, soal: "OSN Matematika 2009 Tingkat Kota\nGambar di bawah ini menunjukkan suatu persegi yang dibagikan menjadi 6 bagian yang sama. Setiap bagian berupa persegipanjang yang mempunyai keliling 70 cm. luas persegi tersebut adalah ...", options: ["A. 625 $cm^2$", "B. 784 $cm^2$", "C. 900 $cm^2$", "D. 961 $cm^2$"] },
  { no: 13, soal: "OSN Matematika 2009 Tingkat Kota\nLuas persegipanjang ABCD adalah 112 satuan luas. Titik E dan F berada di diagonal AC seperti gambar di bawah ini sedemikian hingga 3 (AE + FC) = 4 EF. Luas segitiga DEF adalah ... satuan luas", options: [] },
  { no: 14, soal: "OSN Matematika 2009 Tingkat Kota\nLantai suatu ruangan berbentuk persegi. Lantai tersebut akan dipasang keramik berbentuk persegi juga. Bila keramik yang terletak pada diagonalnya sebanyak 33, maka banyaknya keramik yang menutupi lantai adalah ...", options: [] },
  { no: 15, soal: "OSN Matematika 2009 Tingkat Kota\nDua belas segi delapan beraturan dengan panjang sisi 2 cm. disusun dalam sebuah persegi seperti gambar berikut.\nLuas persegi di atas sama dengan ...", options: [] },
  { no: 16, soal: "OSN Matematika 2010 Tingkat Kota\nSebuah segitiga ABC sama kaki dipotong menjadi dua buah segitiga sama kaki (tidak harus kongruen) dengan membagi dua sama besar salah satu sudut alasnya. Ukuran sudut yang terkecil dari segitiga ABC adalah ...", options: [] },
  { no: 17, soal: "OSN Matematika 2010 Tingkat Kota\nDiketahui ABCD adalah persegi. Titik E merupakan perpotongan AC dan BD pada persegi ABCD yang membentuk persegi baru EFGH. EF berpotongan dengan CD di I dan EH berpotongan dengan AD di J. panjang sisi ABCD adalah 4 cm dan panjang sisi EFGH adalah 8 cm. jika sudut EID = $60^0$, maka luas segiempat EIDJ adalah ... $cm^2$", options: [] },
  { no: 18, soal: "OSN Matematika 2011 Tingkat Kota\nDiketahui jajargenjang ABCD. Titik P dan Q terletak pada AC sehingga DP dan BQ tegak lurus AC. Jika panjang AD = 13 cm, AD = 25 cm dan luas jajargenjang tersebut adalah 125 $cm^2$, maka panjang PQ adalah ... cm", options: ["A. $\\frac{1}{2}$", "B. 1", "C. $\\sqrt{2}$", "D. $\\sqrt{3}$", "E. $\\frac{4}{3}$"] },
  { no: 19, soal: "OSN Matematika 2011 Tingkat Kota\nSebuah bingkai foto yang berbentuk persegi diputar $45^0$ dengan sumbu putar titik perpotongan diagonal-diagonalnya. Jika panjang sisi persegi adalah 1 cm. luas irisan antara bingkai foto sebelum dan sesudah diputar adalah ... $cm^2$", options: ["A. $1 + 2\\sqrt{2}$", "B. $2 + 2\\sqrt{2}$", "C. 2", "D. $2 - 2\\sqrt{2}$", "E. $2\\sqrt{2} - 2$"] },
  { no: 20, soal: "OSN Matematika 2011 Tingkat Kota\nPerhatikan gambar berikut. ABCD persegi dengan panjang sisi-sisinya adalah 2 cm. E adalah titik Tengah CD dan F adalah titik Tengah AD. Luas daerah EDFGH adalah ...", options: [] },
  { no: 21, soal: "OSN Matematika 2012 Tingkat Kota\nDiketahui persegi ABCD. Jika titik E terletak pada BC dan titik F terletak pada CD sehingga AE dan AF membagi persegi ABCD menjadi 3 daerah yang luasnya sama, maka perbandingan luas segitiga AEF terhadap luas persegi ABCD adalah ...", options: ["A. 4/18", "B. 5/18", "C. 6/18", "D. 7/18", "E. 8/18"] },
  { no: 22, soal: "OSN Matematika 2013 Tingkat Kota\nJika gambar di bawah ini adalah segi delapan beraturan, maka perbandingan luas antara daerah yang diarsir dan luas segi delapan beraturan adalah ...", options: ["A. 1 : 3", "B. 1 : 4", "C. 2 : 5", "D. 3 : 8", "E. 3 : 7"] },
  { no: 23, soal: "OSN Matematika 2013 Tingkat Kota\nPada $\\triangle ABC$ terdapat titik D pada BC sehingga BD : DC = 1 : 3. Titik L pada AD sehingga AL : LD = 1 : 4. Perbadingan luas $\\triangle ACL$ dan $\\triangle BDL$ adalah ...", options: [] },
  { no: 24, soal: "OSN Matematika 2014 Tingkat Kota\nJika luas suatu persegi 4 $m^2$, maka luas bangun datar pada gambar di bawah adalah ...", options: ["A. 36", "B. 96", "C. 144", "D. 162"] },
  { no: 25, soal: "OSN Matematika 2014 Tingkat Kota\nBanyak persegi pada gambar berikut adalah ...", options: [] },
  { no: 26, soal: "OSN Matematika 2014 Tingkat Kota\nBerikut adalah gambar sebuah persegi panjang yang terdiri dari beberapa persegi yang dibuat dari korek api. Sebagai contoh, 1 x 5 memerlukan 16 batang korek api, bentuk 2 x 5 memerlukan 27 batang korek api.\nBanyak batang korek api yang diperlukan untuk membuat persegi panjang dengan bentuk 51 x 5 adalah ...", options: [] },
  { no: 27, soal: "OSN Matematika 2014 Tingkat Kota\nPerhatikan gambar di bawah ini. ABC adalah segitiga sama sisi. PQ tegak lurus AB, PS tegak lurus AC dan PR tegak lurus BC.\nJika PQ = 1 cm, PR = 2 cm dan PS = 3 cm, maka panjang AB adalah ...", options: [] },
  { no: 28, soal: "OSN Matematika 2016 Tingkat Kota\nDiketahui ABCD dan CEGH adalah dua persegipanjang kongruen dengan panjang 17 cm dan lebar 8 cm. titik F adalah titik potong sisi AD dan EG. Luas segiempat EFDC adalah ... $cm^2$", options: ["A. 74,00", "B. 72,25", "C. 68,00", "D. 63,75"] },
  { no: 29, soal: "OSN Matematika 2017 Tingkat Kota\nPada jajar genjang ABCD, jarak antara sepasang sisi sejajar pertama adalah 4 cm dan jarak antara sepasang sisi sejajar lainnya adalah 9 cm. luas jajar genjang ABCD adalah ...", options: ["A. Minimal 36 $cm^2$", "B. Tepat 36 $cm^2$", "C. Maksimal 36 $cm^2$", "D. Antara 36 $cm^2$ dan 81 $cm^2$"] },
  { no: 30, soal: "OSN Matematika 2017 Tingkat Kota\nMisalkan ADEN dan BMDF adalah persegi dengan F merupakan titik Tengah AD. Luas segitiga CDE adalah 6 satuan luas. Luas segitiga ABC adalah ...", options: [] },
  { no: 31, soal: "OSN Matematika 2018 Tingkat Kota\nDiketahui sisi-sisi trapesium adalah 5 cm, 7 cm, 7 cm dan 13 cm. pernyataan di bawah ini yang salah adalah ...", options: ["A. Tinggi trapesium = $\\sqrt{33}$ cm", "B. Tinggi trapesium = $\\sqrt{26}$ cm", "C. Tinggi trapesium = $10\\sqrt{6}$ $cm^2$", "D. Tinggi trapesium = $9\\sqrt{33}$ $cm^2$"] },
  { no: 32, soal: "OSN Matematika 2019 Tingkat Kota\nDalam segitiga sama sisi ABC titik D, E dan F pada sisi BC, CA dan AB sehingga $\\angle AFE = \\angle BFD$; $\\angle BDF = \\angle CDE$; dan $\\angle CED = \\angle AEF$. Jika sisi segitiga ABC adalah 8 cm, maka luas segitiga DEF adalah ...", options: ["A. $2\\sqrt{3}$", "B. $4\\sqrt{3}$", "C. $6\\sqrt{3}$", "D. $6\\sqrt{3}$"] },
  { no: 33, soal: "OSN Matematika 2019 Tingkat Kota\nPerhatikan gambar berikut.\nJika panjang AB = 11 cm, BC = 15 cm dan EF = 20 cm, maka luas bangun ABCDEF adalah ... $cm^2$", options: [] },
  { no: 34, soal: "OSN Matematika 2020 Tingkat Kota\nDiketahui segi delapan ABCDEFGH dengan panjang sisina 2 cm. akan dipilih secara acak 3 titik seudutnya dan digunakan untuk membentuk suatu segitiga yang akan dihitung luas daerahnya. Jika A adalah himpunan semua luas daerah segitiga yang mungkin dan jumlah semua anggota A adalah $(a + b\\sqrt{2})$ $cm^2$, maka nilai dari a + b adalah ...", options: ["A. 9", "B. 12", "C. 21", "D. 33"] },
  { no: 35, soal: "OSN Matematika 2021 Tingkat Kota\nTenda A dan tenda B seperti dalam gambar memiliki lebar 3 m dan tinggi 2 m. luas bahan yang digunakan untuk membuat tenda A dan tenda B sama. Jika panjang tenda A adalah 6 m, maka p sama dengan ...", options: ["A. $3\\sqrt{2} + \\frac{2}{4}$", "B. 6", "C. $\\frac{3 + 18\\sqrt{2}}{25}$", "D. 8"] },
  { no: 36, soal: "OSN Matematika 2021 Tingkat Kota\nDiberikan persegi panjang ABCD dengan AB = 12 dan BC = 6. Titik E, F, G, H dipilih sehingga BE = BF + DG + DH + p. jika garis FH dan EG berpotongan di Tengah-tengah persegi panjang, dan luas daerah yang diarsir adalah 12,5% dari luas ABCD, maka nilai p adalah ...", options: ["A. 1/3", "B. 1/2", "C. 1", "D. 3/2"] },
  { no: 37, soal: "OSN Matematika 2022 Tingkat Kota\nTiga puluh koin dengan jari-jari 3,5 cm ditumpuk menjadi 4 tingkat sehingga meyerupai limas tegak segi empat beraturan dengan sisi angka menghadap ke atas. Tingkat pertama (paling bawah) terdiri dari 16 koin, tingkat kedua terdiri dari 9 koin, tingkat ketiga terdiri dari 4 koin dan tingkat keempat terdiri dari 1 koin. Pada setiap tingkat, koin akan disusun menyerupai persegi dengan setiap koin yang berdekatan saling bersinggungan. Jika dilihat dari atas, total luas sisi angka yang tertutup oleh koin lainnya adalah... $cm^2$.", options: ["A. 381,5", "B. 444,5", "C. 539", "D. 1155"] },
  { no: 38, soal: "OSN Matematika 2022 Tingkat Kota\nPerhatikan urutan lima bangun datar berikut.\nUrutan kelima bangun datar tersebut dikatakan ideal jika ketiga syarat berikut terpenuhi.\n(1) ada tepat satu bangun di antara segi lima dan segi enam,\n(2) ada lebih dari satu bangun di antara segitiga dan segi delapan,\n(3) segi empat tidak di sebelah segi enam ataupun segi delapan.\nBanyak urutan yang tidak ideal dari kelima bangun datar tersebut adalah ....", options: ["A. 1", "B. 2", "C. 118", "D. 119"] },
  { no: 39, soal: "OSN Matematika 2022 Tingkat Kota\nDiketahui suatu persegi panjang ABCD dengan titik P dan Q masing-masing berada pada sisi AB dan CD sedemikian sehingga APCQ merupakan belah ketupat. Titik R merupakan titik pusat persegi panjang ABCD. Titik S terletak di sisi CD dan PS tegak lurus dengan sisi CD. Jika panjang AB = a dan panjang BC = b selisih panjang RS dan QS adalah ...", options: ["A. $\\frac{a^2 + 2ab - b^2}{2a}$", "B. $\\frac{b^2 + 2ab - a^2}{2b}$", "C. $\\frac{b^2 + 2ab - a^2}{2a}$", "D. $\\frac{a^2 + 2ab - b^2}{2b}$"] },
  { no: 40, soal: "OSN Matematika 2023 Tingkat Kota\nDisamping kolam ikan berbentuk segitiga, dibangun jalan berbentuk L dengan panjang 3 meter dan lebar x meter.\nJika luas segitiga tersebut sama dengan luas daerah yang berbentuk L, maka nilai x adalah ... meter", options: ["A. $\\sqrt{6} - 3$", "B. $2\\sqrt{3} - 3$", "C. $\\sqrt{6} + 3$", "D. $2\\sqrt{3} + 3$"] },
  { no: 41, soal: "OSN Matematika 2023 Tingkat Kota\nSegitiga ABC terletak pada setengah lingkaran berdiameter AB dengan $\\angle ABC = 30^0$. Titik E terletak pada AB sehingga AB = 4 EB dan EC = 14 cm. luas segitiga BEC sama dengan ... $cm^2$", options: ["A. $14\\sqrt{3}$", "B. $16\\sqrt{7}$", "C. $28\\sqrt{3}$", "D. $32\\sqrt{3}$"] },
  { no: 42, soal: "OSN Matematika 2023 Tingkat Kota\nDua kapal memiliki tempat bersandar (berlabuh) yang sama di suatu pelabuhan. Diketahui bahwa waktu kedatangan kedua kapal saling bebas dan memiliki kemungkinan yang sama untuk bersandar pada suatu hari Minggu (jam 00.00-24.00). Jika waktu bersandar kapal pertama adalah 2 jam dan waktu bersandar kapal kedua adalah 4 jam, peluang bahwa satu kapal harus menunggu sampai tempat bersandar dapat digunakan adalah....", options: ["A. 67/44", "B. 1/4", "C. 67/288", "D. 23/144"] },
  { no: 43, soal: "OSN Matematika 2023 Tingkat Kota\nEmpat titik berbeda A, B, C dan D terletak pada lingkaran berjari-jari 7 cm. diketahui AB : BC = 3 : 4, AB = AD dan BC = CD. Titik E adalah perpotongan AC dan BD, melalui titik E dibuat garis k dan l. garis k tegak lurus BC dan memotong AD di P. sementara, garis l tegak lurus AD dan memotong BC di Q. perbandingan luas daerah segitiga AQP dan PDQ adalah 1 : ...", options: [] },
  { no: 44, soal: "OSN Matematika 2024 Tingkat Kota\nPerhatikan gambar berikut.\nDiketahui panjang BD = CD, BE = DE, AJ = JD dan DG sejajar CF. jika perbandingan luas daerah segitiga ADH dan segitiga ABC dinyakan dalam bentuk paling sederhana m : n, maka nilai dari m + n adalah ...", options: ["A. 5", "B. 6", "C. 7", "D. 8"] },
  { no: 45, soal: "OSN Matematika 2024 Tingkat Kota\nSuatu segidelapan ABCDEFGH dibentuk dari suatu persegi ABCD dan persegi panjang EFGH yang panjang sisi-sisinya merupakan bilangan bulat positif.\nJika luas persegi adalah x $cm^2$, luas persegi panjang adalah y $cm^2$, x > y dan xy = 98, maka keliling segi delapan ABCDEFGH yang mungkin adalah ... cm.", options: ["A. 30", "B. 33", "C. 34", "D. 51"] },
  { no: 46, soal: "OSN Matematika 2024 Tingkat Kota\nSepuluh persegi panjang kecil dengan ukuran 1 cm x 2 cm akan digunakan untuk membentuk persegi panjang dengan ukuran 10 cm x 2 cm. banyaknya cara membentuk persegi panjang besar tersebut adalah ...", options: ["A. 78", "B. 89", "C. 144", "D. 233"] },
  { no: 47, soal: "OSN Matematika 2024 Tingkat Kota\nDiketahui segitiga sama kaki ABC dengan AB = BC = 8 cm dan $\\angle ABC = 120^0$. Titik Tengah AB dan BC masing-masing adalah D dan E. garis DF tegak lurus AB dan EF tegak lurus BC. Luas daerah yang diarsir adalah ... $cm^2$.", options: ["A. $\\frac{8\\sqrt{3}}{3}$", "B. $\\frac{16\\sqrt{3}}{3}$", "C. $8\\sqrt{3}$", "D. $16\\sqrt{3}$"] },
  { no: 48, soal: "OSN Matematika 2024 Tingkat Kota\nDari segi lima ABCDE dipilih 21 titik yang berbeda. Satu titik sisi AB dua titik dari sisi BC, tiga titik dari sisi CD, empat titik dari sisi DE, lima titik sudut A, B, C, D, E dan enam titik dari sisi AE. Banyaknya segitiga yang dapat dibentuk dari seluruh titik yang dipilih adalah ...", options: ["A. 560", "B. 770", "C. 1239", "D. 1330"] },
  { no: 49, soal: "OSN Matematika 2024 Tingkat Kota\nSegi enam beraturan ABCDEF memiliki panjang sisi 2024 mm. titik G adalah titik Tengah AB dan titik H adalah titik Tengah EG. Perbandingan luas daerah segitiga CDH dan segi enam ABCDEF adalah ...", options: ["A. 4 : 24", "B. 5 : 24", "C. 6 : 24", "D. 7 : 24"] },
  { no: 50, soal: "OSN Matematika 2025 Tingkat Kota\nSegitiga sama sisi ABC dan DEF dengan panjang sisi sama, yaitu 1 cm. titik B terletak pada sisi DE, titik D terletak pada sisi AB dan titik G adalah perpotongan sisi BC dan sisi DF. Jika luas daerah segiempat ADGC sama dengan luas daerah segiempat BEFG dan juga sama dengan luas daerah BDG, maka keliling segilima AEFGC adalah ... cm", options: ["A. $6 - \\frac{\\sqrt{2}}{2}$", "B. $6 - \\sqrt{2}$", "C. $6 - \\frac{3\\sqrt{2}}{2}$", "D. $6 + \\sqrt{3} - 2$"] },
  { no: 51, soal: "OSN Matematika 2025 Tingkat Kota\nSuatu segitiga ABC sama kaki dengan AC = BC dan AB = 10 cm memiliki luas 25 $cm^2$. Titik D, E dan F terletak berturut-turut pada sisi BC, AC dan AB dengan BD : DC = CE : EA = AF : FB = 2 : 3. Titik P, Q dan R berturut-turut adalah titik potong garis AD dan CF, garis AD dan CF, garis AD dan BE serta garis BE dan CF. perbandingan luas segitiga PQR dan ABC adalah ...", options: ["A. 1 : 19", "B. 2 : 19", "C. 3 : 25", "D. 1 : 5"] },
];

const OlimpiadeSegitigaSegiempatPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"materi" | "dasar" | "olimpiade">("materi");
  const [expandedSections, setExpandedSections] = useState<number[]>(() => Array.from({ length: materiSection.sections.length }, (_, i) => i));

  const toggleSection = (idx: number) => {
    playPopSound();
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Trophy className="w-10 h-10 text-accent mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          OLIMPIADE - SEGITIGA DAN SEGIEMPAT
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">Irawan Sutiawan, M.Pd</p>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          {[
            { key: "materi" as const, label: "Materi" },
            { key: "dasar" as const, label: "Latihan Dasar" },
            { key: "olimpiade" as const, label: "Latihan Olimpiade" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { playPopSound(); setActiveTab(tab.key); }}
              className={`font-display text-xs px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                activeTab === tab.key
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card/80 text-white/70 border-border hover:border-accent/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Materi Tab */}
        {activeTab === "materi" && (
          <div className="space-y-3 animate-slide-up">
            {materiSection.sections.map((section, idx) => (
              <div
                key={idx}
                className="backdrop-blur border rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(30,41,59,0.75) 0%, rgba(15,23,42,0.85) 100%)",
                  borderColor: expandedSections.includes(idx) ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)",
                  boxShadow: expandedSections.includes(idx)
                    ? "0 0 24px rgba(251,191,36,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <button
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.35)" }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-display text-sm text-accent font-bold group-hover:text-yellow-300 transition-colors">
                      {section.heading}
                    </span>
                  </div>
                  {expandedSections.includes(idx)
                    ? <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
                </button>
                {expandedSections.includes(idx) && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 animate-slide-up">
                    {section.render()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Dasar Tab */}
        {activeTab === "dasar" && (
          <div className="space-y-4 animate-slide-up">
            {latihanDasar.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                {soal.no === 1 ? (
                  <>
                    <div className="font-body text-sm text-white mb-2 whitespace-pre-wrap">
                      <span className="text-accent font-bold">{soal.no}.</span> Perhatikan gambar berikut.
                    </div>
                    <div className="flex justify-center my-3">
                      <div className="bg-white rounded-lg p-3 shadow-md max-w-xs w-full flex justify-center">
                        <BangunSoal1SegiSVG />
                      </div>
                    </div>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      Keliling bangun di atas adalah ...
                    </div>
                  </>
                ) : soal.no === 2 ? (
                  <>
                    <div className="font-body text-sm text-white mb-2 whitespace-pre-wrap">
                      <span className="text-accent font-bold">{soal.no}.</span> Perhatikan gambar berikut ini.
                    </div>
                    <div className="flex justify-center my-3">
                      <div className="bg-white rounded-lg p-3 shadow-md max-w-sm w-full flex justify-center">
                        <BangunSoal2SegiSVG />
                      </div>
                    </div>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      Keliling bangun di atas adalah ...
                    </div>
                  </>
                ) : soal.no === 3 ? (
                  <>
                    <div className="font-body text-sm text-white mb-2 whitespace-pre-wrap">
                      <span className="text-accent font-bold">{soal.no}.</span> Perhatikan gambar.
                    </div>
                    <div className="flex justify-center my-3">
                      <div className="bg-white rounded-lg p-3 shadow-md max-w-xs w-full flex justify-center">
                        <BangunSoal3SegiSVG />
                      </div>
                    </div>
                    <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                      Luas gambar di samping adalah ...
                    </div>
                  </>
                ) : (
                  <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                    <span className="text-accent font-bold">{soal.no}.</span> {soal.soal.split('\n').map((line, lineIdx) => (
                      <span key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                      </span>
                    ))}
                  </div>
                )}
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {segitigaSegiempatDasarPembahasan[soal.no] && (
                  <PembahasanCard pembahasanKey={`segi-dasar-${soal.no}`} pembahasan={segitigaSegiempatDasarPembahasan[soal.no]} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Latihan Olimpiade Tab */}
        {activeTab === "olimpiade" && (
          <div className="space-y-4 animate-slide-up">
            {latihanOlimpiade.map((soal) => (
              <div key={soal.no} className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-4">
                <div className="font-body text-sm text-white mb-3 whitespace-pre-wrap">
                  <span className="text-accent font-bold">{soal.no}.</span> {soal.soal.split('\n').map((line, lineIdx) => (
                    <span key={lineIdx}>
                      {lineIdx > 0 && <br />}
                      {lineIdx === 0 && line.startsWith('OSN') ? <span className="text-yellow-400 font-semibold">{line}</span> : renderWithLatex(line)}
                    </span>
                  ))}
                </div>
                {soal.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {soal.options.map((opt, j) => (
                      <div key={j} className="font-body text-xs text-white/70 bg-muted/30 rounded-lg px-3 py-2">
                        {renderWithLatex(opt)}
                      </div>
                    ))}
                  </div>
                )}
                {segitigaSegiempatOlimpiadePembahasan[soal.no] && (
                  <PembahasanCard pembahasanKey={`segi-olim-${soal.no}`} pembahasan={segitigaSegiempatOlimpiadePembahasan[soal.no]} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/olimpiade"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Olimpiade
          </button>
        </div>
      </div>
    </div>
  );
};

export default OlimpiadeSegitigaSegiempatPage;
