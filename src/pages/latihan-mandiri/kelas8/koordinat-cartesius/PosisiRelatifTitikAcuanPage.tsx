import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Crosshair } from "lucide-react";
import CoordPlane from "./CoordPlane";

type Part = { label: string; math?: string; text?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: Diagram;
  type: "essay" | "mixed" | "diagram-only";
};
const Qn = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const questions: Q[] = [
  Qn(1, "Posisi Titik terhadap Titik Acuan O(0,0)", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 0, y: 0, label: "O(0,0)", color: "#facc15", labelPos: "tr" },
        { x: 3, y: 4, label: "A(3,4)", color: "#f472b6", labelPos: "tr" },
        { x: -2, y: 3, label: "B(−2,3)", color: "#60a5fa", labelPos: "tl" },
      ],
    },
    parts: [
      { label: "a.", text: "Nyatakan posisi titik A terhadap titik acuan O(0,0)! (berapa satuan ke kanan/kiri dan ke atas/bawah)" },
      { label: "b.", text: "Nyatakan posisi titik B terhadap titik acuan O(0,0)!" },
      { label: "c.", text: "Jika titik acuan O bergeser ke (1,1), bagaimana posisi relatif A terhadap titik acuan baru itu?" },
    ],
  }),

  Qn(2, "Posisi Titik P terhadap Titik Acuan A", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      pts: [
        { x: 2, y: 1, label: "A(2,1)", color: "#facc15", labelPos: "tr" },
        { x: 5, y: 4, label: "P(5,4)", color: "#f472b6", labelPos: "tr" },
        { x: -1, y: 3, label: "Q(−1,3)", color: "#34d399", labelPos: "tl" },
        { x: 2, y: -2, label: "R(2,−2)", color: "#fb923c", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik A(2,1) sebagai titik acuan. Nyatakan posisi titik P terhadap A!" },
      { label: "b.", text: "Nyatakan posisi titik Q terhadap A(2,1)!" },
      { label: "c.", text: "Nyatakan posisi titik R terhadap A(2,1)!" },
      { label: "d.", text: "Titik mana yang berada tepat di atas titik A? (sebutkan alasannya)" },
    ],
  }),

  Qn(3, "Menentukan Titik Acuan dari Informasi Posisi Relatif", {
    type: "essay",
    content: "Titik P berada 3 satuan ke kanan dan 4 satuan ke atas dari titik acuan Q.",
    parts: [
      { label: "a.", text: "Jika koordinat P adalah (5, 6), tentukan koordinat titik acuan Q!", math: "Q = (5 - 3,\\; 6 - 4) = (2, 2)" },
      { label: "b.", text: "Jika P(−1, 3) berada 2 satuan ke kiri dan 5 satuan ke atas dari Q, tentukan Q!" },
      { label: "c.", text: "Jika R(4, −2) berada 6 satuan ke kanan dan 3 satuan ke bawah dari S, tentukan S!" },
    ],
  }),

  Qn(4, "Posisi Relatif Titik terhadap Titik Tengah Segmen", {
    type: "essay",
    content: "Titik tengah dari segmen AB dengan A(2, 4) dan B(6, 2) dapat dihitung.",
    math: "M = \\left(\\frac{2+6}{2},\\; \\frac{4+2}{2}\\right) = (4, 3)",
    parts: [
      { label: "a.", text: "Hitung koordinat titik tengah M dari segmen AB dengan A(2,4) dan B(6,2)!" },
      { label: "b.", text: "Dengan M sebagai titik acuan, nyatakan posisi relatif titik C(7, 5) terhadap M!" },
      { label: "c.", text: "Titik D berada 2 satuan ke kiri dan 3 satuan ke bawah dari M. Tentukan koordinat D!" },
    ],
  }),

  Qn(5, "Posisi Relatif pada Peta Sederhana", {
    type: "essay",
    content: "Sebuah peta menggunakan sistem koordinat. Perpustakaan berada di titik P(3, 5), kantin di K(7, 2), kelas di C(1, 8).",
    parts: [
      { label: "a.", text: "Dengan perpustakaan P(3,5) sebagai acuan, nyatakan posisi kantin K(7,2) terhadap P!" },
      { label: "b.", text: "Dengan perpustakaan P(3,5) sebagai acuan, nyatakan posisi kelas C(1,8) terhadap P!" },
      { label: "c.", text: "Jika kamu berada di kantin K(7,2) dan ingin ke kelas C(1,8), berapa satuan kamu harus bergerak dan ke arah mana?" },
    ],
  }),

  Qn(6, "Posisi Relatif dalam Sistem Navigasi Sederhana", {
    type: "essay",
    content: "Sebuah kapal berada di posisi K(2, 3). Mercusuar A berada di (5, 7), mercusuar B di (−1, 6), pulau C di (4, −2).",
    parts: [
      { label: "a.", text: "Dengan posisi kapal K(2,3) sebagai acuan, nyatakan posisi mercusuar A!" },
      { label: "b.", text: "Nyatakan posisi mercusuar B terhadap kapal K(2,3)!" },
      { label: "c.", text: "Nyatakan posisi pulau C terhadap kapal K(2,3) dan tentukan ke arah mana kapal harus bergerak untuk menuju pulau C!" },
    ],
  }),
];

const accent = "violet";
const accentHex = "#a78bfa";

const PosisiRelatifTitikAcuanPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 border-2 border-violet-400/40 flex items-center justify-center mb-4">
            <Crosshair className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-violet-300 text-center mb-1">
            POSISI RELATIF SETIAP TITIK TERHADAP SEMBARANG TITIK ACUAN
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-3">Koordinat Kartesius · Kelas 8 · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2">
            <span className="text-violet-400 text-sm">🎯</span>
            <span className="text-white/70 text-xs font-body">6 Soal · Posisi Relatif Titik Acuan</span>
            <span className="text-violet-400 text-sm">🎯</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q) => (
            <div
              key={q.n}
              className="rounded-2xl overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-900/30 to-purple-900/20 backdrop-blur"
            >
              <div className="flex items-center gap-3 px-5 py-3 border-b border-violet-500/15 bg-violet-500/10">
                <span className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300 font-bold text-sm shrink-0">
                  {q.n}
                </span>
                <span className="font-display text-sm font-bold text-violet-200">{q.title}</span>
              </div>

              <div className="px-5 py-4 space-y-3">
                {q.diagram && (
                  <div className="flex justify-center my-2">
                    <CoordPlane {...q.diagram} lightBg />
                  </div>
                )}

                {q.content && (
                  <p className="text-white/80 text-sm font-body leading-relaxed">{q.content}</p>
                )}

                {q.math && (
                  <div className="bg-white/5 rounded-xl px-4 py-2 text-center overflow-x-auto">
                    <BlockMath math={q.math} />
                  </div>
                )}

                {q.parts && (
                  <div className="space-y-2 mt-2">
                    {q.parts.map((p, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-violet-400 font-bold text-sm shrink-0 mt-0.5">{p.label}</span>
                        <div className="flex-1">
                          {p.text && <p className="text-white/75 text-sm font-body">{p.text}</p>}
                          {p.math && (
                            <div className="mt-1 overflow-x-auto">
                              <InlineMath math={p.math} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/koordinat-cartesius"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Koordinat Kartesius
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosisiRelatifTitikAcuanPage;
