import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { MapPin } from "lucide-react";
import CoordPlane from "./CoordPlane";

const accent = "sky";
const accentHex = "#38bdf8";
const accentDim = "rgba(56,189,248,0.15)";

type Part = { label: string; math?: string; text?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: Diagram;
  type: "essay" | "mixed" | "diagram-only";
};

const Q = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Q(1, "Membaca Koordinat Titik", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 4, y: 3, label: "A(?,?)", color: "#f472b6", labelPos: "tr" },
        { x: -3, y: 5, label: "B(?,?)", color: "#fb923c", labelPos: "tl" },
        { x: -4, y: -2, label: "C(?,?)", color: "#a78bfa", labelPos: "bl" },
        { x: 2, y: -4, label: "D(?,?)", color: "#34d399", labelPos: "br" },
        { x: 0, y: 3, label: "E(?,?)", color: "#facc15", labelPos: "tr" },
        { x: -5, y: 0, label: "F(?,?)", color: "#f87171", labelPos: "top" },
      ],
    },
    parts: [
      { label: "a.", text: "Nyatakan koordinat titik A, B, C, D, E, dan F dari diagram di atas." },
      { label: "b.", text: "Titik mana yang terletak pada sumbu-x? Titik mana yang pada sumbu-y?" },
      { label: "c.", text: "Titik mana yang memiliki nilai absis (x) negatif?" },
    ],
  }),

  Q(2, "Menentukan Kuadran", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 3, y: 4, label: "P", color: "#f472b6", labelPos: "tr" },
        { x: -2, y: 3, label: "Q", color: "#fb923c", labelPos: "tl" },
        { x: -4, y: -3, label: "R", color: "#a78bfa", labelPos: "bl" },
        { x: 5, y: -2, label: "S", color: "#34d399", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan kuadran dari titik P, Q, R, dan S." },
      { label: "b.", text: "Jelaskan tanda koordinat (positif/negatif) untuk setiap kuadran." },
    ],
  }),

  Q(3, "Identifikasi Kuadran dari Koordinat", {
    type: "mixed",
    content: "Tentukan di kuadran mana atau pada sumbu mana setiap titik berikut berada:",
    parts: [
      { label: "a.", math: "A(5,\\ 3)" },
      { label: "b.", math: "B(-2,\\ 4)" },
      { label: "c.", math: "C(-3,\\ -1)" },
      { label: "d.", math: "D(4,\\ -5)" },
      { label: "e.", math: "E(0,\\ 7)" },
      { label: "f.", math: "F(-6,\\ 0)" },
      { label: "g.", math: "G(0,\\ -4)" },
      { label: "h.", math: "H(0,\\ 0)" },
    ],
  }),

  Q(4, "Titik pada Sumbu Koordinat", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 4, y: 0, label: "K", color: "#facc15", labelPos: "top" },
        { x: 0, y: 3, label: "L", color: "#60a5fa", labelPos: "tr" },
        { x: -3, y: 0, label: "M", color: "#f472b6", labelPos: "top" },
        { x: 0, y: -4, label: "N", color: "#34d399", labelPos: "tr" },
        { x: 3, y: 2, label: "P", color: "#fb923c", labelPos: "tr" },
      ],
    },
    parts: [
      { label: "a.", text: "Tuliskan koordinat titik K, L, M, N, dan P." },
      { label: "b.", text: "Titik mana yang terletak pada sumbu-x? Sumbu-y?" },
      { label: "c.", text: "Titik mana yang TIDAK berada pada kuadran manapun? Mengapa?" },
    ],
  }),

  Q(5, "Koordinat pada Sumbu-x", {
    type: "mixed",
    content: "Jika titik P(-3, y) terletak pada sumbu-x:",
    parts: [
      { label: "a.", text: "Tentukan nilai y." },
      { label: "b.", text: "Tuliskan koordinat lengkap titik P." },
      { label: "c.", text: "Di mana posisi titik P relatif terhadap titik asal?" },
    ],
  }),

  Q(6, "Titik Tengah Segmen", {
    type: "mixed",
    content: "Tentukan koordinat titik tengah dari setiap segmen berikut:",
    parts: [
      { label: "a.", math: "A(2,\\ 4) \\text{ dan } B(6,\\ 8)" },
      { label: "b.", math: "C(-3,\\ 5) \\text{ dan } D(7,\\ -1)" },
      { label: "c.", math: "E(0,\\ 0) \\text{ dan } F(-4,\\ -6)" },
    ],
  }),

  Q(7, "Mencari Ujung Segmen dari Titik Tengah", {
    type: "mixed",
    content: "Titik M adalah titik tengah segmen PQ. Tentukan koordinat Q jika:",
    parts: [
      { label: "a.", math: "P(1,\\ 2),\\ M(3,\\ 5)" },
      { label: "b.", math: "P(-4,\\ 6),\\ M(0,\\ 2)" },
      { label: "c.", math: "P(3,\\ -5),\\ M(-1,\\ 1)" },
    ],
  }),

  Q(8, "Jarak Titik ke Sumbu-x", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 4, y: 3, label: "A(4,3)", color: "#f472b6", labelPos: "tr" },
        { x: 4, y: 0, label: "", color: "#f472b6" },
      ],
      segs: [
        { x1: 4, y1: 3, x2: 4, y2: 0, color: "#f472b6", dashed: true, label: "?" },
      ],
    },
    parts: [
      { label: "a.", text: "Berapa jarak titik A(4, 3) ke sumbu-x? Jelaskan caramu." },
      { label: "b.", math: "\\text{Jika } P(x,\\ y) \\text{, rumus jarak ke sumbu-x adalah } ..." },
      { label: "c.", text: "Tentukan jarak titik B(−5, 7) ke sumbu-x." },
    ],
  }),

  Q(9, "Jarak Titik ke Sumbu-y", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: -4, y: 3, label: "B(−4,3)", color: "#60a5fa", labelPos: "tl" },
        { x: 0, y: 3, label: "", color: "#60a5fa" },
      ],
      segs: [
        { x1: -4, y1: 3, x2: 0, y2: 3, color: "#60a5fa", dashed: true, label: "?" },
      ],
    },
    parts: [
      { label: "a.", text: "Berapa jarak titik B(−4, 3) ke sumbu-y?" },
      { label: "b.", math: "\\text{Jika } P(x,\\ y) \\text{, rumus jarak ke sumbu-y adalah } ..." },
      { label: "c.", text: "Tentukan jarak titik C(3, −6) ke sumbu-y." },
    ],
  }),

  Q(10, "Titik ke-4 Persegi Panjang", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 1, y: 1, label: "A(1,1)", color: "#f472b6", labelPos: "bl" },
        { x: 5, y: 1, label: "B(5,1)", color: "#fb923c", labelPos: "br" },
        { x: 5, y: 4, label: "C(5,4)", color: "#34d399", labelPos: "tr" },
        { x: 1, y: 4, label: "D(?,?)", color: "#facc15", labelPos: "tl" },
      ],
      segs: [
        { x1: 1, y1: 1, x2: 5, y2: 1, color: "rgba(255,255,255,0.3)" },
        { x1: 5, y1: 1, x2: 5, y2: 4, color: "rgba(255,255,255,0.3)" },
        { x1: 5, y1: 4, x2: 1, y2: 4, color: "rgba(255,255,255,0.3)" },
        { x1: 1, y1: 4, x2: 1, y2: 1, color: "rgba(255,255,255,0.3)", dashed: true },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan koordinat titik D." },
      { label: "b.", text: "Hitung keliling persegi panjang ABCD." },
      { label: "c.", text: "Hitung luas persegi panjang ABCD." },
    ],
  }),

  Q(11, "Segitiga dari Koordinat", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: -3, y: -2, label: "A", color: "#f472b6", labelPos: "bl" },
        { x: 4, y: -2, label: "B", color: "#fb923c", labelPos: "br" },
        { x: 1, y: 4, label: "C", color: "#34d399", labelPos: "top" },
      ],
      segs: [
        { x1: -3, y1: -2, x2: 4, y2: -2, color: "#60a5fa" },
        { x1: 4, y1: -2, x2: 1, y2: 4, color: "#60a5fa" },
        { x1: 1, y1: 4, x2: -3, y2: -2, color: "#60a5fa" },
      ],
    },
    parts: [
      { label: "a.", text: "Tuliskan koordinat semua titik dari diagram." },
      { label: "b.", text: "Apakah segitiga ABC siku-siku? Jelaskan berdasarkan posisi titik A dan B." },
      { label: "c.", text: "Titik manakah yang paling tinggi posisinya?" },
    ],
  }),

  Q(12, "Titik di Kuadran IV", {
    type: "mixed",
    content: "Perhatikan titik-titik berikut:\nA(5, −3),  B(−2, −4),  C(4, −1),  D(−3, 6),  E(7, −5),  F(0, −2)",
    parts: [
      { label: "a.", text: "Titik mana saja yang berada di Kuadran IV? Sebutkan absisnya (nilai x) dan ordinatnya (nilai y) masing-masing!" },
      { label: "b.", text: "Mengapa titik F(0, −2) tidak termasuk Kuadran IV meskipun nilai y-nya negatif?" },
    ],
  }),

  Q(13, "Koordinat di Atas Sumbu-x", {
    type: "mixed",
    content: "Dari daftar koordinat berikut, tentukan manakah yang berada di atas sumbu-x:\nP(−3, 5),  Q(4, −2),  R(0, 7),  S(−1, −6),  T(6, 3),  U(2, 0)",
    parts: [
      { label: "a.", text: "Tuliskan semua titik yang berada di atas sumbu-x beserta alasannya." },
      { label: "b.", text: "Apakah titik yang tepat berada pada sumbu-x (y = 0) dianggap 'di atas sumbu-x'? Jelaskan!" },
    ],
  }),

  Q(14, "Jarak Titik ke Garis Vertikal", {
    type: "essay",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: -1, y: 2, label: "A(−1, 2)", color: "#f472b6", labelPos: "tl" },
        { x: 3, y: -5, label: "(3, −5)", color: "#60a5fa", labelPos: "br" },
        { x: 3, y: 4, label: "(3, 4)", color: "#60a5fa", labelPos: "tr" },
      ],
      segs: [
        { x1: 3, y1: -5, x2: 3, y2: 4, color: "#60a5fa", label: "garis" },
        { x1: -1, y1: 2, x2: 3, y2: 2, color: "#f472b6", dashed: true, label: "?" },
      ],
    },
    content: "Hitung jarak titik A(−1, 2) terhadap garis yang melalui titik (3, 4) dan (3, −5) dalam satuan.",
  }),

  Q(15, "Soal ANBK - Evaluasi Pernyataan", {
    type: "mixed",
    content: "Tentukan pernyataan BENAR (B) atau SALAH (S) tentang koordinat:",
    parts: [
      { label: "(1)", text: "Titik (0, 0) berada di Kuadran I." },
      { label: "(2)", text: "Titik yang berada di Kuadran II memiliki x < 0 dan y > 0." },
      { label: "(3)", text: "Titik (5, 0) terletak pada sumbu-x." },
      { label: "(4)", text: "Jika x = 0 dan y ≠ 0, titik tersebut terletak pada sumbu-y." },
    ],
  }),

];

const UnsurUnsurPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400/60 flex items-center justify-center mb-3">
            <MapPin className="w-7 h-7 text-sky-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-sky-300 text-center mb-1"
            style={{ textShadow: '0 0 20px rgba(56,189,248,0.7)' }}>
            UNSUR-UNSUR DIAGRAM KARTESIUS
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Koordinat Kartesius · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 rounded-lg px-4 py-2">
            <span className="text-sky-400 text-xs font-bold">📋 15 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-sky-900/20 border border-sky-500/20 rounded-xl p-4">
          <p className="text-sky-300 text-xs font-bold mb-2">📌 Keterangan Sumbu &amp; Kuadran</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-body">
            {[
              { q: "Kuadran I", c: "x > 0, y > 0", col: "text-yellow-400" },
              { q: "Kuadran II", c: "x < 0, y > 0", col: "text-violet-400" },
              { q: "Kuadran III", c: "x < 0, y < 0", col: "text-emerald-400" },
              { q: "Kuadran IV", c: "x > 0, y < 0", col: "text-rose-400" },
            ].map(r => (
              <div key={r.q} className="bg-white/5 rounded-lg px-3 py-2">
                <span className={`font-bold ${r.col}`}>{r.q}: </span>
                <span className="text-white/60">{r.c}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div key={q.n} className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-slate-900/80 to-blue-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-sky-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky-400 to-blue-500 rounded-l-2xl" />
              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0">
                    <span className="text-sky-300 text-xs font-bold">{q.n}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sky-400 text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 px-2 py-0.5 rounded inline-block mb-2">
                      {q.title}
                    </span>
                    {q.content && <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-3">{q.content}</p>}
                    {q.diagram && (
                      <div className="mb-3 flex justify-center">
                        <CoordPlane {...q.diagram} lightBg={true} />
                      </div>
                    )}
                    {q.parts && (
                      <div className="flex flex-col gap-2">
                        {q.parts.map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-sky-300 text-xs font-bold shrink-0 mt-0.5 min-w-[28px]">{p.label}</span>
                            {p.math
                              ? <div className="text-white text-sm overflow-x-auto"><InlineMath math={p.math} /></div>
                              : <p className="font-body text-sm text-white/80 whitespace-pre-line">{p.text}</p>
                            }
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
          <button onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/koordinat-cartesius"); }}
            className="text-sm text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer font-body">
            {t('practice.backTo')} Koordinat Kartesius
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsurUnsurPage;
