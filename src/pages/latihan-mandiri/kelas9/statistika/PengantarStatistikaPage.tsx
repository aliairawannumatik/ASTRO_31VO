import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Part = { label: string; math?: string; text?: string };
type Q = { n: number; title: string; content?: string; mathContent?: string; parts?: Part[]; diagram?: React.ReactNode; type: "essay" | "mixed" };
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const TableJenisData = () => (
  <svg width="320" height="150" viewBox="0 0 320 150" className="mx-auto">
    <rect x="4" y="4" width="312" height="142" rx="10" fill="#0e7490" fillOpacity="0.12" stroke="#22d3ee" strokeWidth="1.5" />
    <rect x="10" y="10" width="300" height="26" rx="6" fill="#22d3ee" fillOpacity="0.25" />
    <text x="60" y="27" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Jenis Data</text>
    <text x="190" y="27" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Contoh</text>
    <text x="275" y="27" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Skala</text>
    <line x1="10" y1="36" x2="310" y2="36" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.4" />
    {[
      ["Data Kualitatif", "Warna, Nama", "Nominal"],
      ["Data Ordinal", "Peringkat, Nilai Huruf", "Ordinal"],
      ["Data Diskrit", "Jumlah Siswa", "Rasio"],
      ["Data Kontinu", "Tinggi, Berat Badan", "Interval"],
    ].map(([jenis, contoh, skala], i) => (
      <g key={i}>
        <rect x="10" y={38 + i * 26} width="300" height="25" fill={i % 2 === 0 ? "#0e7490" : "transparent"} fillOpacity="0.1" />
        <text x="60" y={53 + i * 26} fill="#a5f3fc" fontSize="9" textAnchor="middle">{jenis}</text>
        <text x="190" y={53 + i * 26} fill="#e0f2fe" fontSize="9" textAnchor="middle">{contoh}</text>
        <text x="275" y={53 + i * 26} fill="#7dd3fc" fontSize="9" textAnchor="middle">{skala}</text>
      </g>
    ))}
  </svg>
);

const TeknikSamplingDiagram = () => (
  <svg width="320" height="160" viewBox="0 0 320 160" className="mx-auto">
    <rect x="4" y="4" width="312" height="152" rx="10" fill="#0e7490" fillOpacity="0.12" stroke="#22d3ee" strokeWidth="1.5" />
    <text x="160" y="22" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Teknik Pengambilan Sampel</text>
    <rect x="120" y="28" width="80" height="22" rx="4" fill="#0891b2" fillOpacity="0.4" stroke="#22d3ee" strokeWidth="1" />
    <text x="160" y="43" fill="#e0f2fe" fontSize="9" textAnchor="middle">Populasi</text>
    <line x1="80" y1="56" x2="160" y2="50" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.5" />
    <line x1="160" y1="50" x2="240" y2="56" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.5" />
    <line x1="160" y1="50" x2="160" y2="62" stroke="#22d3ee" strokeWidth="0.8" strokeOpacity="0.5" />
    {[
      [20, 62, "Acak\nSederhana"],
      [120, 62, "Sistematis"],
      [220, 62, "Stratifikasi"],
    ].map(([x, y, label], i) => (
      <g key={i}>
        <rect x={Number(x) - 35} y={Number(y)} width="70" height="24" rx="4" fill="#164e63" stroke="#0891b2" strokeWidth="0.8" />
        <text x={Number(x)} y={Number(y) + 10} fill="#a5f3fc" fontSize="8" textAnchor="middle">{String(label).split("\n")[0]}</text>
        <text x={Number(x)} y={Number(y) + 20} fill="#a5f3fc" fontSize="8" textAnchor="middle">{String(label).split("\n")[1] || ""}</text>
      </g>
    ))}
    <text x="160" y="105" fill="#94a3b8" fontSize="8" textAnchor="middle">Purposive · Cluster · Quota Sampling</text>
    <rect x="30" y="115" width="260" height="34" rx="6" fill="#164e63" stroke="#0891b2" strokeWidth="0.8" />
    <text x="160" y="127" fill="#7dd3fc" fontSize="8" textAnchor="middle" fontWeight="bold">Rumus Slovin:</text>
    <text x="160" y="143" fill="#e0f2fe" fontSize="10" textAnchor="middle">n = N / (1 + N·e²)</text>
  </svg>
);

const TablePopulasiSampel = () => (
  <svg width="300" height="130" viewBox="0 0 300 130" className="mx-auto">
    <rect x="4" y="4" width="292" height="122" rx="10" fill="#0e7490" fillOpacity="0.12" stroke="#22d3ee" strokeWidth="1.5" />
    <text x="150" y="20" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">Populasi vs Sampel</text>
    <rect x="10" y="25" width="136" height="18" rx="4" fill="#0891b2" fillOpacity="0.3" />
    <rect x="154" y="25" width="136" height="18" rx="4" fill="#0891b2" fillOpacity="0.3" />
    <text x="78" y="38" fill="#22d3ee" fontSize="9" textAnchor="middle" fontWeight="bold">Populasi</text>
    <text x="222" y="38" fill="#22d3ee" fontSize="9" textAnchor="middle" fontWeight="bold">Sampel</text>
    {[
      ["Seluruh objek", "Sebagian objek"],
      ["Parameter (μ, σ)", "Statistik (x̄, s)"],
      ["Sensus (lengkap)", "Survei (efisien)"],
      ["Lebih akurat", "Lebih hemat"],
    ].map(([pop, samp], i) => (
      <g key={i}>
        <text x="78" y={54 + i * 18} fill="#a5f3fc" fontSize="8" textAnchor="middle">{pop}</text>
        <line x1="148" y1={45 + i * 18} x2="148" y2={61 + i * 18} stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.4" />
        <text x="222" y={54 + i * 18} fill="#e0f2fe" fontSize="8" textAnchor="middle">{samp}</text>
      </g>
    ))}
  </svg>
);

const questions: Q[] = [
  Qn(1, "Pengertian Statistika – UN", {
    type: "mixed",
    content: "Statistika adalah ilmu yang mempelajari cara mengumpulkan, menyajikan, menganalisis, dan menarik kesimpulan dari data.",
    parts: [
      { label: "a.", text: "Jelaskan perbedaan antara statistika deskriptif dan statistika inferensial." },
      { label: "b.", text: "Berikan masing-masing satu contoh penggunaan statistika dalam kehidupan nyata." },
      { label: "c.", text: "Mengapa statistika penting dalam pengambilan keputusan?" },
    ],
  }),
  Qn(2, "Populasi dan Sampel – ANBK", {
    type: "mixed",
    diagram: <TablePopulasiSampel />,
    content: "Di sebuah sekolah terdapat 800 siswa. Peneliti ingin mengetahui rata-rata tinggi badan siswa.",
    parts: [
      { label: "a.", text: "Tentukan populasi dari penelitian tersebut." },
      { label: "b.", text: "Jika diambil sampel 80 siswa, berapa persen sampel dari populasi?" },
      { label: "c.", math: "\\text{Dengan rumus Slovin } n = \\frac{N}{1+Ne^2}, \\text{ jika } e=10\\%, \\text{ tentukan } n" },
    ],
  }),
  Qn(3, "Penyajian Data dan Kesimpulan – UN", {
    type: "mixed",
    content: "Dari 25 siswa yang disurvei mengenai hobi: Membaca (8), Olahraga (7), Bermain Game (6), Menggambar (4).",
    parts: [
      { label: "a.", math: "\\text{Persentase hobi membaca} = \\frac{8}{25} \\times 100\\% = \\ldots" },
      { label: "b.", text: "Hobi apa yang paling sedikit diminati?" },
      { label: "c.", text: "Sajikan data ini dalam bentuk tabel frekuensi lengkap dengan frekuensi relatif." },
    ],
  }),
  Qn(4, "Jenis-Jenis Data – UN", {
    type: "mixed",
    diagram: <TableJenisData />,
    content: "Perhatikan tabel jenis data di atas, kemudian jawab pertanyaan berikut:",
    parts: [
      { label: "a.", text: "Sebutkan perbedaan antara data kualitatif dan data kuantitatif. Berikan masing-masing dua contoh." },
      { label: "b.", text: "Apakah 'jumlah siswa dalam kelas' termasuk data diskrit atau kontinu? Jelaskan." },
      { label: "c.", text: "Apakah 'berat badan siswa' termasuk data diskrit atau kontinu? Jelaskan." },
    ],
  }),
  Qn(5, "Data Primer dan Sekunder", {
    type: "mixed",
    content: "Tentukan apakah data berikut termasuk data primer atau data sekunder, kemudian jelaskan alasannya:",
    parts: [
      { label: "a.", text: "Hasil kuesioner yang disebarkan langsung oleh peneliti kepada responden." },
      { label: "b.", text: "Data jumlah penduduk dari Badan Pusat Statistik (BPS)." },
      { label: "c.", text: "Hasil wawancara langsung antara peneliti dan narasumber." },
    ],
  }),
];

const PengantarStatistikaPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center mb-3">
            <span className="text-2xl">📊</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-cyan-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(34,211,238,0.7)' }}>
            PENGANTAR STATISTIKA & PENGUMPULAN DATA
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 9 · Statistika · Latihan Mandiri</p>
          <div className="mt-3 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
            <span className="text-cyan-400 text-xs font-bold">📋 5 Soal</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-cyan-900/20 border border-cyan-500/20 rounded-xl p-4">
          <p className="text-cyan-300 text-xs font-bold mb-3">📌 Konsep Kunci</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Populasi", desc: "Seluruh objek penelitian" },
              { name: "Sampel", desc: "Sebagian dari populasi" },
              { name: "Data Primer", desc: "Dikumpulkan langsung" },
              { name: "Data Sekunder", desc: "Dari sumber lain" },
              { name: "Sensus", desc: "Data seluruh populasi" },
              { name: "Sampling", desc: "Data sebagian populasi" },
            ].map(r => (
              <div key={r.name} className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-cyan-400 text-[9px] uppercase font-bold mb-0.5">{r.name}</div>
                <div className="text-white/60 text-[9px]">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-900/80 to-teal-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-teal-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0">
                    <span className="text-cyan-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded inline-block mb-2">{q.title}</span>
                    {q.content && <p className="font-body text-sm text-white/90 leading-relaxed mb-3 whitespace-pre-line">{q.content}</p>}
                    {q.mathContent && <div className="mb-3 bg-cyan-900/20 border border-cyan-500/20 rounded-lg px-4 py-3 flex justify-center overflow-x-auto"><BlockMath math={q.mathContent} /></div>}
                    {q.diagram && <div className="mb-3 flex justify-center bg-white/5 rounded-xl p-3 overflow-x-auto">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 rounded-lg px-3 py-2 bg-white/5">
                            <span className="text-cyan-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80">{p.text}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-9/statistika"); }}
            className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer font-body">
            ← Kembali ke Statistika
          </button>
        </div>
      </div>
    </div>
  );
};
export default PengantarStatistikaPage;
