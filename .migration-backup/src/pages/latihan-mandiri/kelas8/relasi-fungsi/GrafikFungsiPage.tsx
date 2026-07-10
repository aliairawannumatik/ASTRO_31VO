import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { TrendingUp } from "lucide-react";
import CoordPlane from "../koordinat-cartesius/CoordPlane";

type Part = { label: string; math?: string; text?: string };
type Q = {
  n: number; title: string;
  content?: string;
  parts?: Part[];
  diagram?: React.ReactNode;
  options?: string[];
  type: "pilgan" | "essay" | "mixed";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const SvgProfitGraph = () => (
  <svg viewBox="0 0 270 195" width="100%" style={{ maxWidth: 300 }}>
    <line x1="87" y1="20" x2="87" y2="165" stroke="#1e3a5f" strokeWidth="0.5" strokeDasharray="3,2" />
    <line x1="129" y1="20" x2="129" y2="165" stroke="#1e3a5f" strokeWidth="0.5" strokeDasharray="3,2" />
    <line x1="171" y1="20" x2="171" y2="165" stroke="#1e3a5f" strokeWidth="0.5" strokeDasharray="3,2" />
    <line x1="213" y1="20" x2="213" y2="165" stroke="#1e3a5f" strokeWidth="0.5" strokeDasharray="3,2" />
    <line x1="45" y1="136" x2="240" y2="136" stroke="#1e3a5f" strokeWidth="0.5" strokeDasharray="3,2" />
    <line x1="45" y1="107" x2="240" y2="107" stroke="#1e3a5f" strokeWidth="0.5" strokeDasharray="3,2" />
    <line x1="45" y1="78" x2="240" y2="78" stroke="#1e3a5f" strokeWidth="0.5" strokeDasharray="3,2" />
    <line x1="45" y1="49" x2="240" y2="49" stroke="#1e3a5f" strokeWidth="0.5" strokeDasharray="3,2" />
    <line x1="45" y1="165" x2="248" y2="165" stroke="#64748b" strokeWidth="1.5" />
    <line x1="45" y1="165" x2="45" y2="18" stroke="#64748b" strokeWidth="1.5" />
    <polygon points="245,161 253,165 245,169" fill="#64748b" />
    <polygon points="41,21 45,13 49,21" fill="#64748b" />
    <text x="40" y="139" fill="#94a3b8" fontSize="8" textAnchor="end">250</text>
    <text x="40" y="110" fill="#94a3b8" fontSize="8" textAnchor="end">500</text>
    <text x="40" y="81" fill="#94a3b8" fontSize="8" textAnchor="end">750</text>
    <text x="40" y="52" fill="#94a3b8" fontSize="8" textAnchor="end">1.000</text>
    <text x="87" y="178" fill="#94a3b8" fontSize="7" textAnchor="middle">5.000</text>
    <text x="129" y="178" fill="#94a3b8" fontSize="7" textAnchor="middle">10.000</text>
    <text x="171" y="178" fill="#94a3b8" fontSize="7" textAnchor="middle">15.000</text>
    <text x="213" y="178" fill="#94a3b8" fontSize="7" textAnchor="middle">20.000</text>
    <text x="148" y="192" fill="#94a3b8" fontSize="8" textAnchor="middle">modal (dalam rupiah)</text>
    <text x="13" y="100" fill="#94a3b8" fontSize="8" textAnchor="middle" transform="rotate(-90,13,100)">untung (dalam rupiah)</text>
    <line x1="45" y1="165" x2="242" y2="22" stroke="#3b82f6" strokeWidth="2.5" />
    <circle cx="87" cy="136" r="4" fill="#3b82f6" />
    <circle cx="129" cy="107" r="4" fill="#3b82f6" />
    <circle cx="171" cy="78" r="4" fill="#3b82f6" />
    <circle cx="213" cy="49" r="4" fill="#3b82f6" />
  </svg>
);

const SvgTaxiLinear = () => (
  <svg viewBox="0 0 260 200" width="100%" style={{ maxWidth: 300 }}>
    <line x1="45" y1="107" x2="96" y2="107" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,3" />
    <line x1="96" y1="107" x2="96" y2="168" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,3" />
    <line x1="45" y1="78" x2="148" y2="78" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,3" />
    <line x1="148" y1="78" x2="148" y2="168" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,3" />
    <line x1="45" y1="49" x2="200" y2="49" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,3" />
    <line x1="200" y1="49" x2="200" y2="168" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,3" />
    <line x1="45" y1="168" x2="228" y2="168" stroke="#64748b" strokeWidth="1.5" />
    <line x1="45" y1="168" x2="45" y2="18" stroke="#64748b" strokeWidth="1.5" />
    <polygon points="225,164 233,168 225,172" fill="#64748b" />
    <polygon points="41,21 45,13 49,21" fill="#64748b" />
    <text x="40" y="110" fill="#94a3b8" fontSize="9" textAnchor="end">12</text>
    <text x="40" y="81" fill="#94a3b8" fontSize="9" textAnchor="end">18</text>
    <text x="40" y="52" fill="#94a3b8" fontSize="9" textAnchor="end">24</text>
    <text x="40" y="26" fill="#94a3b8" fontSize="8" textAnchor="end">30 Ribuan</text>
    <text x="96" y="181" fill="#94a3b8" fontSize="9" textAnchor="middle">2</text>
    <text x="148" y="181" fill="#94a3b8" fontSize="9" textAnchor="middle">4</text>
    <text x="200" y="181" fill="#94a3b8" fontSize="9" textAnchor="middle">6</text>
    <text x="225" y="175" fill="#94a3b8" fontSize="8">jarak</text>
    <line x1="45" y1="136" x2="228" y2="33" stroke="#60a5fa" strokeWidth="2.5" />
    <circle cx="96" cy="107" r="4" fill="#60a5fa" />
    <text x="102" y="103" fill="#facc15" fontSize="9" fontWeight="bold">12</text>
    <circle cx="148" cy="78" r="4" fill="#60a5fa" />
    <text x="154" y="74" fill="#facc15" fontSize="9" fontWeight="bold">18</text>
    <circle cx="200" cy="49" r="4" fill="#60a5fa" />
    <text x="206" y="45" fill="#facc15" fontSize="9" fontWeight="bold">24</text>
  </svg>
);

const SvgTaxiTable = () => (
  <div className="w-full text-xs border border-white/20 rounded-lg overflow-hidden">
    <div className="bg-white/10 px-3 py-1.5 text-center text-white/70 font-bold text-[10px] tracking-wider">"Tarif Taksi"</div>
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-white/5">
          <th className="border border-white/10 px-2 py-1.5 text-white/60 font-semibold text-left text-[10px]">Jarak (km)</th>
          <th className="border border-white/10 px-2 py-1.5 text-white/60 font-semibold text-center text-[10px]">Awal (0)</th>
          <th className="border border-white/10 px-2 py-1.5 text-white/60 font-semibold text-center text-[10px]">2</th>
          <th className="border border-white/10 px-2 py-1.5 text-white/60 font-semibold text-center text-[10px]">4</th>
          <th className="border border-white/10 px-2 py-1.5 text-white/60 font-semibold text-center text-[10px]">...</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-white/10 px-2 py-1.5 text-white/80 text-[10px]">Taksi Sinar</td>
          <td className="border border-white/10 px-2 py-1.5 text-white/80 text-center text-[10px]">10.000</td>
          <td className="border border-white/10 px-2 py-1.5 text-white/80 text-center text-[10px]">13.000</td>
          <td className="border border-white/10 px-2 py-1.5 text-white/80 text-center text-[10px]">16.000</td>
          <td className="border border-white/10 px-2 py-1.5 text-white/80 text-center text-[10px]">...</td>
        </tr>
        <tr>
          <td className="border border-white/10 px-2 py-1.5 text-white/80 text-[10px]">Taksi Bintang</td>
          <td className="border border-white/10 px-2 py-1.5 text-white/80 text-center text-[10px]">4.000</td>
          <td className="border border-white/10 px-2 py-1.5 text-white/80 text-center text-[10px]">8.000</td>
          <td className="border border-white/10 px-2 py-1.5 text-white/80 text-center text-[10px]">12.000</td>
          <td className="border border-white/10 px-2 py-1.5 text-white/80 text-center text-[10px]">...</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const SvgStepFunction = () => (
  <svg viewBox="0 0 260 200" width="100%" style={{ maxWidth: 300 }}>
    <line x1="45" y1="110" x2="90" y2="110" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,3" />
    <line x1="90" y1="110" x2="90" y2="170" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,3" />
    <line x1="45" y1="80" x2="135" y2="80" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,3" />
    <line x1="135" y1="80" x2="135" y2="170" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,3" />
    <line x1="45" y1="50" x2="180" y2="50" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,3" />
    <line x1="180" y1="50" x2="180" y2="170" stroke="#334155" strokeWidth="0.8" strokeDasharray="4,3" />
    <line x1="45" y1="170" x2="220" y2="170" stroke="#64748b" strokeWidth="1.5" />
    <line x1="45" y1="170" x2="45" y2="20" stroke="#64748b" strokeWidth="1.5" />
    <polygon points="217,166 225,170 217,174" fill="#64748b" />
    <polygon points="41,23 45,15 49,23" fill="#64748b" />
    <text x="40" y="113" fill="#94a3b8" fontSize="9" textAnchor="end">12</text>
    <text x="40" y="83" fill="#94a3b8" fontSize="9" textAnchor="end">18</text>
    <text x="40" y="53" fill="#94a3b8" fontSize="9" textAnchor="end">24</text>
    <text x="40" y="30" fill="#94a3b8" fontSize="8" textAnchor="end">30</text>
    <text x="45" y="184" fill="#94a3b8" fontSize="9" textAnchor="middle">O</text>
    <text x="90" y="184" fill="#94a3b8" fontSize="9" textAnchor="middle">2</text>
    <text x="135" y="184" fill="#94a3b8" fontSize="9" textAnchor="middle">4</text>
    <text x="180" y="184" fill="#94a3b8" fontSize="9" textAnchor="middle">6</text>
    <text x="215" y="175" fill="#94a3b8" fontSize="8">Jarak (km)</text>
    <text x="13" y="100" fill="#94a3b8" fontSize="8" textAnchor="middle" transform="rotate(-90,13,100)">Tarif (ribuan)</text>
    <line x1="45" y1="110" x2="90" y2="110" stroke="#f472b6" strokeWidth="2.5" />
    <line x1="90" y1="110" x2="90" y2="80" stroke="#f472b6" strokeWidth="2.5" />
    <line x1="90" y1="80" x2="135" y2="80" stroke="#f472b6" strokeWidth="2.5" />
    <line x1="135" y1="80" x2="135" y2="50" stroke="#f472b6" strokeWidth="2.5" />
    <line x1="135" y1="50" x2="180" y2="50" stroke="#f472b6" strokeWidth="2.5" />
  </svg>
);

const questions: Q[] = [
  Qn(1, "Rumus Fungsi dari Diagram Panah", {
    type: "pilgan",
    content: "Perhatikan gambar diagram panah berikut. Rumus fungsi diagram tersebut adalah ...",
    diagram: (
      <CoordPlane size={240} range={4}
        segs={[{ x1: -2, y1: -3, x2: 2, y2: 5, color: "#60a5fa" }]}
        pts={[
          { x: 0, y: 1, label: "(0, 1)", color: "#f472b6", labelPos: "tl" },
          { x: 1, y: 3, label: "(1, 3)", color: "#facc15", labelPos: "tr" },
        ]}
      />
    ),
    options: ["f(x) = x + 1", "f(x) = 2x + 1", "f(x) = 3x + 1", "f(x) = 4x − 1"],
  }),
  Qn(2, "Menentukan Rumus Fungsi dari Grafik", {
    type: "pilgan",
    content: "Grafik fungsi di bawah ini rumus fungsinya adalah ...",
    diagram: (
      <CoordPlane size={240} range={5}
        segs={[{ x1: -5, y1: -3, x2: 4, y2: 6, color: "#60a5fa" }]}
        pts={[
          { x: -2, y: 0, label: "(−2, 0)", color: "#34d399", labelPos: "top" },
          { x: 0, y: 2, label: "(0, 2)", color: "#f472b6", labelPos: "tl" },
        ]}
      />
    ),
    options: ["f(x) = x − 2", "f(x) = x + 2", "f(x) = 2x − 2", "f(x) = 2x + 2"],
  }),
  Qn(3, "Rumus Fungsi dari Grafik Bergradien Negatif", {
    type: "pilgan",
    content: "Perhatikan grafik berikut. Rumus fungsi dari grafik di atas adalah ...",
    diagram: (
      <CoordPlane size={240} range={6}
        segs={[{ x1: -3, y1: 2, x2: 2, y2: -8, color: "#f87171" }]}
        pts={[
          { x: -2, y: 0, label: "(−2, 0)", color: "#fb923c", labelPos: "top" },
          { x: 0, y: -4, label: "(0, −4)", color: "#fb923c", labelPos: "bl" },
        ]}
      />
    ),
    options: ["f(x) = 2x − 4", "f(x) = 2x + 4", "f(x) = −2x − 4", "f(x) = −2x + 4"],
  }),
  Qn(4, "Membaca Grafik Untung dan Modal", {
    type: "pilgan",
    content: "Perhatikan grafik berikut!",
    diagram: <SvgProfitGraph />,
    parts: [{ label: "", text: "Dengan modal Rp 30.000,00, berapakah untung yang diperoleh?" }],
    options: ["Rp 1.200,00", "Rp 1.350,00", "Rp 1.500,00", "Rp 1.800,00"],
  }),
  Qn(5, "Membaca Grafik Tarif Ojek Online", {
    type: "pilgan",
    content: "Suatu perusahaan ojek online memasang tarif seperti grafik berikut.",
    diagram: <SvgTaxiLinear />,
    parts: [{ label: "", text: "Dito pergi ke sekolah yang berjarak 10 km menggunakan ojek online tersebut. Berapa tarif yang harus dibayar Dito?" }],
    options: ["Rp 30.000,00", "Rp 33.000,00", "Rp 36.000,00", "Rp 39.000,00"],
  }),
  Qn(6, "Memilih Taksi Paling Hemat", {
    type: "pilgan",
    content: "Sebuah kota terdapat dua perusahaan taksi, Taksi Sinar dan Taksi Bintang. Perusahaan tersebut menawarkan tarif taksi seperti tabel berikut.",
    diagram: <SvgTaxiTable />,
    parts: [{ label: "", text: "Rima ingin pergi ke perpustakaan yang berjarak 9 km dari rumahnya. Agar diperoleh biaya yang lebih hemat, taksi manakah yang sebaiknya digunakan Rima?" }],
    options: [
      "Taksi Sinar, karena tarif awalnya lebih kecil sehingga akan terus lebih murah.",
      "Taksi Bintang, karena tarif per km lebih murah.",
      "Taksi Sinar, karena lebih hemat Rp 1.500,00.",
      "Taksi Bintang, karena lebih hemat Rp 1.500,00.",
    ],
  }),
  Qn(7, "Membaca Grafik Tarif Bertangga", {
    type: "pilgan",
    content: "Suatu perusahaan taksi memasang tarif seperti grafik berikut.",
    diagram: <SvgStepFunction />,
    parts: [{ label: "", text: "Jika Sari naik taksi tersebut sejauh 16 km, ia harus membayar tarif sebesar ..." }],
    options: ["Rp 48.000,00", "Rp 54.000,00", "Rp 60.000,00", "Rp 66.000,00"],
  }),
];

const optionLabels = ["A", "B", "C", "D"];

const GrafikFungsiPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center mb-3">
            <TrendingUp className="w-7 h-7 text-rose-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-rose-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(251,113,133,0.7)' }}>
            GRAFIK FUNGSI (PENGAYAAN)
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Relasi dan Fungsi · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
            <span className="text-rose-400 text-xs font-bold">📋 7 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-2">📌 Tips Membaca Grafik Fungsi</p>
          <div className="grid grid-cols-1 gap-2 text-xs font-body">
            {[
              "Grafik naik ke kanan → gradien m > 0 | turun ke kanan → m < 0",
              "Titik potong sumbu-y: set x = 0 → f(0) = b",
              "Titik potong sumbu-x: set f(x) = 0 → x = −b/m",
              "Baca grafik kontekstual: perhatikan satuan dan skala pada setiap sumbu",
            ].map((s, i) => (
              <div key={i} className="bg-white/5 rounded-lg px-3 py-2 flex gap-2">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span className="text-white/60">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-slate-900/80 to-pink-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-rose-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-400 to-pink-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center shrink-0">
                    <span className="text-rose-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && <div className="mb-3 flex justify-center">{q.diagram}</div>}
                    {q.parts && (
                      <div className="flex flex-col gap-2 mb-3">
                        {q.parts.map((p, pi) => (
                          p.text ? (
                            <p key={pi} className="font-body text-sm text-white/90 leading-relaxed">{p.text}</p>
                          ) : null
                        ))}
                      </div>
                    )}
                    {q.options && (
                      <div className="flex flex-col gap-1.5 mt-1">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                            <span className="text-rose-300 text-xs font-bold shrink-0 min-w-[20px]">{optionLabels[oi]}.</span>
                            <span className="font-body text-sm text-white/80">{opt}</span>
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/relasi-dan-fungsi"); }}
            className="text-sm text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Relasi dan Fungsi
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrafikFungsiPage;
