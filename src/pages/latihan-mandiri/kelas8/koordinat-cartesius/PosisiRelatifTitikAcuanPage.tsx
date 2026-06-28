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
  // ── Bagian 1: Posisi Relatif terhadap Titik Acuan ──────────────────────
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

  // ── Bagian 2: Posisi Relatif terhadap Suatu Garis ─────────────────────
  Qn(7, "Posisi Titik terhadap Sumbu-x", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 3, y: 4, label: "A(3,4)", color: "#f472b6", labelPos: "tr" },
        { x: -2, y: -3, label: "B(−2,−3)", color: "#60a5fa", labelPos: "bl" },
        { x: 5, y: 0, label: "C(5,0)", color: "#facc15", labelPos: "top" },
        { x: -4, y: 2, label: "D(−4,2)", color: "#34d399", labelPos: "tl" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik mana yang berada DI ATAS sumbu-x?" },
      { label: "b.", text: "Titik mana yang berada DI BAWAH sumbu-x?" },
      { label: "c.", text: "Titik mana yang berada PADA sumbu-x?" },
      { label: "d.", text: "Apa syarat koordinat untuk titik di atas sumbu-x?" },
    ],
  }),

  Qn(8, "Posisi Titik terhadap Sumbu-y", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      pts: [
        { x: 4, y: 2, label: "P(4,2)", color: "#f472b6", labelPos: "tr" },
        { x: -3, y: 5, label: "Q(−3,5)", color: "#fb923c", labelPos: "tl" },
        { x: 0, y: -4, label: "R(0,−4)", color: "#facc15", labelPos: "tr" },
        { x: -2, y: -2, label: "S(−2,−2)", color: "#a78bfa", labelPos: "bl" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik mana yang berada di sebelah KANAN sumbu-y?" },
      { label: "b.", text: "Titik mana yang berada di sebelah KIRI sumbu-y?" },
      { label: "c.", text: "Titik mana yang berada PADA sumbu-y?" },
      { label: "d.", text: "Apa syarat koordinat untuk titik di sebelah kiri sumbu-y?" },
    ],
  }),

  Qn(9, "Posisi terhadap Garis y = 3", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [{ x1: -6.5, y1: 3, x2: 6.5, y2: 3, color: "#facc15", label: "y = 3" }],
      pts: [
        { x: 4, y: 5, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: -3, y: 1, label: "B", color: "#60a5fa", labelPos: "tl" },
        { x: 2, y: 3, label: "C", color: "#34d399", labelPos: "top" },
        { x: -5, y: 6, label: "D", color: "#fb923c", labelPos: "tl" },
        { x: 1, y: -2, label: "E", color: "#a78bfa", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik mana yang berada di ATAS garis y = 3?" },
      { label: "b.", text: "Titik mana yang berada di BAWAH garis y = 3?" },
      { label: "c.", text: "Titik mana yang berada PADA garis y = 3?" },
      { label: "d.", text: "Apa syarat ordinat untuk titik di atas garis y = 3?" },
    ],
  }),

  Qn(10, "Posisi terhadap Garis x = −2", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [{ x1: -2, y1: -6.5, x2: -2, y2: 6.5, color: "#a78bfa", label: "x=−2" }],
      pts: [
        { x: 3, y: 4, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: -5, y: 2, label: "B", color: "#60a5fa", labelPos: "tl" },
        { x: -2, y: -3, label: "C", color: "#34d399", labelPos: "tr" },
        { x: 1, y: -4, label: "D", color: "#facc15", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Titik mana yang berada di KANAN garis x = −2?" },
      { label: "b.", text: "Titik mana yang berada di KIRI garis x = −2?" },
      { label: "c.", text: "Titik mana yang berada PADA garis x = −2?" },
      { label: "d.", text: "Apa syarat absis untuk titik di kanan garis x = −2?" },
    ],
  }),

  Qn(11, "Menentukan Posisi Relatif Kelompok Titik", {
    type: "mixed",
    content: "Tentukan posisi setiap titik terhadap garis y = 4 (di atas, di bawah, atau pada):",
    parts: [
      { label: "a.", math: "A(2,\\ 7)" },
      { label: "b.", math: "B(-3,\\ 4)" },
      { label: "c.", math: "C(5,\\ 1)" },
      { label: "d.", math: "D(-1,\\ -2)" },
      { label: "e.", math: "E(0,\\ 4)" },
      { label: "f.", math: "F(8,\\ 10)" },
    ],
  }),

  Qn(12, "Menentukan Posisi terhadap Garis x = 5", {
    type: "mixed",
    content: "Tentukan posisi setiap titik terhadap garis x = 5 (di kanan, di kiri, atau pada):",
    parts: [
      { label: "a.", math: "A(8,\\ 3)" },
      { label: "b.", math: "B(5,\\ -2)" },
      { label: "c.", math: "C(2,\\ 7)" },
      { label: "d.", math: "D(-4,\\ 1)" },
      { label: "e.", math: "E(5,\\ 0)" },
      { label: "f.", math: "F(11,\\ -5)" },
    ],
  }),

  Qn(13, "Posisi Relatif terhadap Dua Garis", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [
        { x1: -6.5, y1: 2, x2: 6.5, y2: 2, color: "#facc15", label: "y=2" },
        { x1: -1, y1: -6.5, x2: -1, y2: 6.5, color: "#a78bfa", label: "x=−1" },
      ],
      pts: [
        { x: 3, y: 5, label: "A", color: "#f472b6", labelPos: "tr" },
        { x: -4, y: 4, label: "B", color: "#fb923c", labelPos: "tl" },
        { x: -3, y: -2, label: "C", color: "#34d399", labelPos: "bl" },
        { x: 4, y: -3, label: "D", color: "#60a5fa", labelPos: "br" },
      ],
    },
    parts: [
      { label: "a.", text: "Tentukan posisi setiap titik terhadap garis y = 2 (atas/bawah/pada)." },
      { label: "b.", text: "Tentukan posisi setiap titik terhadap garis x = −1 (kanan/kiri/pada)." },
      { label: "c.", text: "Titik mana yang berada di atas y = 2 DAN di kanan x = −1?" },
    ],
  }),

  Qn(14, "Titik pada Garis — Persamaan Garis Lurus", {
    type: "mixed",
    diagram: {
      size: 260, range: 6,
      segs: [{ x1: -3, y1: -4, x2: 4, y2: 10, color: "#facc15" }],
      pts: [
        { x: 0, y: 2, label: "A(0,2)", color: "#f472b6", labelPos: "tl" },
        { x: 1, y: 4, label: "B(1,4)", color: "#60a5fa", labelPos: "tr" },
        { x: 2, y: 5, label: "C(2,5)", color: "#34d399", labelPos: "tr" },
      ],
      extraTexts: [{ x: 3.5, y: 9, text: "y=2x+2", color: "#facc15", size: 10 }],
    },
    parts: [
      { label: "Garis:", math: "y = 2x + 2" },
      { label: "a.", text: "Periksa apakah titik A(0, 2) terletak pada garis y = 2x + 2." },
      { label: "b.", text: "Periksa apakah titik B(1, 4) terletak pada garis y = 2x + 2." },
      { label: "c.", text: "Periksa apakah titik C(2, 5) terletak pada garis y = 2x + 2." },
    ],
  }),

  Qn(15, "Apakah Titik Memenuhi Persamaan Garis?", {
    type: "mixed",
    content: "Periksa apakah setiap titik berikut terletak pada garis y = 3x − 1:",
    parts: [
      { label: "a.", math: "P(1,\\ 2)" },
      { label: "b.", math: "Q(2,\\ 5)" },
      { label: "c.", math: "R(-1,\\ -4)" },
      { label: "d.", math: "S(0,\\ -1)" },
      { label: "e.", math: "T(3,\\ 7)" },
    ],
  }),

  Qn(16, "Soal ANBK — Gabungan Posisi Relatif", {
    type: "mixed",
    diagram: {
      size: 260, range: 7,
      segs: [
        { x1: -6.5, y1: 3, x2: 6.5, y2: 3, color: "#facc15", label: "y=3" },
        { x1: 2, y1: -6.5, x2: 2, y2: 6.5, color: "#f472b6", label: "x=2" },
        { x1: -5.5, y1: -5.5, x2: 5.5, y2: 5.5, color: "#60a5fa", dashed: true },
      ],
      pts: [
        { x: -2, y: 5, label: "A", color: "#34d399", labelPos: "tl" },
        { x: 4, y: 5, label: "B", color: "#fb923c", labelPos: "tr" },
        { x: -3, y: -2, label: "C", color: "#a78bfa", labelPos: "bl" },
        { x: 5, y: -1, label: "D", color: "#f87171", labelPos: "br" },
      ],
      extraTexts: [{ x: 5, y: 5.5, text: "y=x", color: "#60a5fa", size: 10 }],
    },
    content: "Tiga garis: y = 3, x = 2, y = x (putus-putus).",
    parts: [
      { label: "a.", text: "Tentukan posisi setiap titik A, B, C, D terhadap garis y = 3." },
      { label: "b.", text: "Tentukan posisi setiap titik terhadap garis x = 2." },
      { label: "c.", text: "Tentukan posisi setiap titik terhadap garis y = x." },
      { label: "d.", text: "Titik mana yang berada di atas y = 3 DAN di kiri x = 2 DAN di atas y = x?" },
    ],
  }),
];

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
            POSISI RELATIF SETIAP TITIK TERHADAP SEMBARANG TITIK ACUAN DAN TERHADAP SUATU GARIS
          </h1>
          <p className="text-white/50 text-xs text-center font-body mb-3">Koordinat Kartesius · Kelas 8 · {t('practice.breadcrumb')}</p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-2">
            <span className="text-violet-400 text-sm">🎯</span>
            <span className="text-white/70 text-xs font-body">16 Soal · Posisi Relatif Titik &amp; Garis</span>
            <span className="text-violet-400 text-sm">🎯</span>
          </div>
        </div>

        {/* Referensi: Titik Acuan */}
        <div className="mb-4 bg-violet-900/20 border border-violet-500/20 rounded-xl p-4">
          <p className="text-violet-300 text-xs font-bold mb-2">📌 Posisi Relatif terhadap Titik Acuan</p>
          <p className="text-white/60 text-xs font-body leading-relaxed">
            Posisi titik B(x₂,y₂) terhadap titik acuan A(x₁,y₁): <span className="text-violet-300 font-bold">Δx = x₂−x₁</span> (positif = kanan, negatif = kiri) · <span className="text-violet-300 font-bold">Δy = y₂−y₁</span> (positif = atas, negatif = bawah)
          </p>
        </div>

        {/* Referensi: Posisi terhadap Garis */}
        <div className="mb-6 bg-rose-900/20 border border-rose-500/20 rounded-xl p-4">
          <p className="text-rose-300 text-xs font-bold mb-3">📌 Posisi Relatif terhadap Suatu Garis</p>
          <div className="flex flex-col gap-2 text-xs font-body">
            {[
              { rule: "Di atas garis y = k", cond: "y₀ > k" },
              { rule: "Di bawah garis y = k", cond: "y₀ < k" },
              { rule: "Di kanan garis x = k", cond: "x₀ > k" },
              { rule: "Di kiri garis x = k", cond: "x₀ < k" },
              { rule: "Di atas garis y = mx + c", cond: "y₀ > mx₀ + c" },
              { rule: "Di bawah garis y = mx + c", cond: "y₀ < mx₀ + c" },
            ].map(r => (
              <div key={r.rule} className="bg-white/5 rounded-lg px-3 py-2 flex gap-3">
                <span className="text-rose-300 font-bold w-44 shrink-0">{r.rule}:</span>
                <span className="text-white/60">{r.cond}</span>
              </div>
            ))}
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
