import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import CoordPlane from "../koordinat-cartesius/CoordPlane";
import { contextualIllustrations } from "./ContextualIllustrations";

type Part = { label: string; math?: string; text?: string };
type Diagram = Parameters<typeof CoordPlane>[0];
type Q = {
  n: number; title: string;
  content?: string; math?: string;
  parts?: Part[]; diagram?: Diagram;
  type: "essay" | "mixed" | "diagram-only";
};
const Qf = (n: number, title: string, rest: Omit<Q, "n" | "title">): Q => ({ n, title, ...rest });

const AplikasiKontekstualPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const p = 'practice.persamaanGarisLurus.aplikasiKontekstual';

  const questions: Q[] = [
    /* ── Q1: Tarif Taksi Online ─── */
    Qf(1, t(`${p}.q1.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 6, lightBg: true,
        segs: [{ x1: 0, y1: 1, x2: 5, y2: 6, color: "#2563eb", label: t(`${p}.q1.segTarif`) }],
        pts: [
          { x: 0, y: 1, label: "(0,10rb)", color: "#2563eb", labelPos: "tr" },
          { x: 5, y: 6, label: "(5km,60rb)", color: "#2563eb", labelPos: "tr" },
        ],
        extraTexts: [
          { x: 1, y: 5, text: t(`${p}.q1.extX`), color: "rgba(0,0,0,0.45)", size: 8 },
          { x: -2, y: 3, text: t(`${p}.q1.extY`), color: "rgba(0,0,0,0.45)", size: 8 },
        ],
      },
      content: t(`${p}.q1.content`),
      parts: [
        { label: "a.", text: t(`${p}.q1.pA`) },
        { label: "b.", text: t(`${p}.q1.pB`) },
        { label: "c.", text: t(`${p}.q1.pC`) },
      ],
    }),

    /* ── Q2: Harga Paket Data ─── */
    Qf(2, t(`${p}.q2.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 6, lightBg: true,
        segs: [{ x1: 0, y1: 1, x2: 5, y2: 6, color: "#0ea5e9", label: t(`${p}.q2.segHarga`) }],
        pts: [
          { x: 0, y: 1, label: "(0GB,3rb)", color: "#0ea5e9", labelPos: "tl" },
          { x: 5, y: 6, label: "(5GB,28rb)", color: "#0ea5e9", labelPos: "tr" },
        ],
        extraTexts: [
          { x: 1, y: 5, text: t(`${p}.q2.extX`), color: "rgba(0,0,0,0.45)", size: 8 },
          { x: -2, y: 3, text: t(`${p}.q2.extY`), color: "rgba(0,0,0,0.45)", size: 8 },
        ],
      },
      content: t(`${p}.q2.content`),
      parts: [
        { label: "a.", text: t(`${p}.q2.pA`) },
        { label: "b.", text: t(`${p}.q2.pB`) },
        { label: "c.", text: t(`${p}.q2.pC`) },
        { label: "d.", text: t(`${p}.q2.pD`) },
      ],
    }),

    /* ── Q3: UN 2019 — Biaya Produksi ─── */
    Qf(3, t(`${p}.q3.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 6, lightBg: true,
        segs: [{ x1: 0, y1: 1, x2: 5, y2: 5.5, color: "#64748b", label: t(`${p}.q3.segBiaya`) }],
        pts: [
          { x: 0, y: 1, label: "(0,200rb)", color: "#64748b", labelPos: "tl" },
          { x: 5, y: 5.5, label: "(100,700rb)", color: "#64748b", labelPos: "tr" },
        ],
        extraTexts: [
          { x: 1, y: 5, text: t(`${p}.q3.extX`), color: "rgba(0,0,0,0.45)", size: 8 },
          { x: -2, y: 3, text: t(`${p}.q3.extY`), color: "rgba(0,0,0,0.45)", size: 8 },
        ],
      },
      content: t(`${p}.q3.content`),
      parts: [
        { label: "a.", text: t(`${p}.q3.pA`) },
        { label: "b.", text: t(`${p}.q3.pB`) },
        { label: "c.", text: t(`${p}.q3.pC`) },
        { label: "d.", text: t(`${p}.q3.pD`) },
      ],
    }),

    /* ── Q4: Tabungan Bertambah Rutin ─── */
    Qf(4, t(`${p}.q4.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 6, lightBg: true,
        segs: [{ x1: 0, y1: 1, x2: 5, y2: 6, color: "#ca8a04", label: t(`${p}.q4.segTabungan`) }],
        pts: [
          { x: 0, y: 1, label: "(0, 50rb)", color: "#ca8a04", labelPos: "tr" },
          { x: 4, y: 5, label: "(4bln, 250rb)", color: "#ca8a04", labelPos: "tr" },
        ],
      },
      content: t(`${p}.q4.content`),
      parts: [
        { label: "a.", text: t(`${p}.q4.pA`) },
        { label: "b.", text: t(`${p}.q4.pB`) },
        { label: "c.", text: t(`${p}.q4.pC`) },
      ],
    }),

    /* ── Q5: Penurunan Nilai Barang ─── */
    Qf(5, t(`${p}.q5.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 8, lightBg: true,
        segs: [{ x1: 0, y1: 8, x2: 6, y2: 2, color: "#dc2626", label: t(`${p}.q5.segNilai`) }],
        pts: [
          { x: 0, y: 8, label: "(0,8jt)", color: "#dc2626", labelPos: "tl" },
          { x: 6, y: 2, label: "(6th,2jt)", color: "#dc2626", labelPos: "br" },
        ],
        extraTexts: [
          { x: 2, y: -6, text: t(`${p}.q5.extX`), color: "rgba(0,0,0,0.45)", size: 8 },
          { x: -3, y: 4, text: t(`${p}.q5.extY`), color: "rgba(0,0,0,0.45)", size: 8 },
        ],
      },
      content: t(`${p}.q5.content`),
      parts: [
        { label: "a.", text: t(`${p}.q5.pA`) },
        { label: "b.", text: t(`${p}.q5.pB`) },
        { label: "c.", text: t(`${p}.q5.pC`) },
        { label: "d.", text: t(`${p}.q5.pD`) },
      ],
    }),

    /* ── Q6: Isi Bahan Bakar ─── */
    Qf(6, t(`${p}.q6.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 6, lightBg: true,
        segs: [{ x1: 0, y1: 6, x2: 6, y2: 0, color: "#db2777", label: t(`${p}.q6.segBBM`) }],
        pts: [
          { x: 0, y: 6, label: "(0, 60L)", color: "#db2777", labelPos: "tr" },
          { x: 6, y: 0, label: "(600km, 0)", color: "#db2777", labelPos: "top" },
        ],
      },
      content: t(`${p}.q6.content`),
      parts: [
        { label: "a.", text: t(`${p}.q6.pA`) },
        { label: "b.", text: t(`${p}.q6.pB`) },
        { label: "c.", text: t(`${p}.q6.pC`) },
      ],
    }),

    /* ── Q7: Grafik Populasi Linier ─── */
    Qf(7, t(`${p}.q7.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 8, lightBg: true,
        segs: [{ x1: 0, y1: 5, x2: 6, y2: 6.2, color: "#16a34a", label: t(`${p}.q7.segPopulasi`) }],
        pts: [
          { x: 0, y: 5, label: "(2020,5000)", color: "#16a34a", labelPos: "tl" },
          { x: 6, y: 6.2, label: "(2026,6200)", color: "#16a34a", labelPos: "tr" },
        ],
        extraTexts: [
          { x: 2, y: -6, text: t(`${p}.q7.extX`), color: "rgba(0,0,0,0.45)", size: 8 },
          { x: -3, y: 3, text: t(`${p}.q7.extY`), color: "rgba(0,0,0,0.45)", size: 8 },
        ],
      },
      content: t(`${p}.q7.content`),
      parts: [
        { label: "a.", text: t(`${p}.q7.pA`) },
        { label: "b.", text: t(`${p}.q7.pB`) },
        { label: "c.", text: t(`${p}.q7.pC`) },
      ],
    }),

    /* ── Q8: Harga Tiket Masuk ─── */
    Qf(8, t(`${p}.q8.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 8, lightBg: true,
        segs: [{ x1: 0, y1: 2, x2: 5, y2: 7, color: "#d97706", label: t(`${p}.q8.segBiaya`) }],
        pts: [
          { x: 0, y: 2, label: "(0,10rb)", color: "#d97706", labelPos: "tl" },
          { x: 5, y: 7, label: "(5org,35rb)", color: "#d97706", labelPos: "tr" },
        ],
        extraTexts: [
          { x: 1, y: -6, text: t(`${p}.q8.extX`), color: "rgba(0,0,0,0.45)", size: 8 },
          { x: -3, y: 4, text: t(`${p}.q8.extY`), color: "rgba(0,0,0,0.45)", size: 8 },
        ],
      },
      content: t(`${p}.q8.content`),
      parts: [
        { label: "a.", text: t(`${p}.q8.pA`) },
        { label: "b.", text: t(`${p}.q8.pB`) },
        { label: "c.", text: t(`${p}.q8.pC`) },
      ],
    }),

    /* ── Q9: Debit Air — Volume dan Waktu ─── */
    Qf(9, t(`${p}.q9.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 12, lightBg: true,
        segs: [{ x1: 0, y1: 10, x2: 10, y2: 5, color: "#0284c7", label: "Volume" }],
        pts: [
          { x: 0, y: 10, label: "(0,500L)", color: "#0284c7", labelPos: "tl" },
          { x: 10, y: 5, label: "(10mnt,250L)", color: "#0284c7", labelPos: "br" },
        ],
        extraTexts: [
          { x: 3, y: -9, text: t(`${p}.q9.extX`), color: "rgba(0,0,0,0.45)", size: 8 },
          { x: -6, y: 6, text: t(`${p}.q9.extY`), color: "rgba(0,0,0,0.45)", size: 8 },
        ],
      },
      content: t(`${p}.q9.content`),
      parts: [
        { label: "a.", text: t(`${p}.q9.pA`) },
        { label: "b.", text: t(`${p}.q9.pB`) },
        { label: "c.", text: t(`${p}.q9.pC`) },
        { label: "d.", text: t(`${p}.q9.pD`) },
      ],
    }),

    /* ── Q10: Grafik Dua Tarif — Titik Kesamaan ─── */
    Qf(10, t(`${p}.q10.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 6, lightBg: true,
        segs: [
          { x1: 0, y1: 2, x2: 5, y2: 7, color: "#db2777", label: t(`${p}.q10.segTarifA`) },
          { x1: 0, y1: 4, x2: 5, y2: 5.5, color: "#2563eb", label: t(`${p}.q10.segTarifB`) },
        ],
        pts: [{ x: 4, y: 6, label: t(`${p}.q10.ptTitikSama`), color: "#ca8a04", labelPos: "tl" }],
      },
      content: t(`${p}.q10.content`),
      parts: [
        { label: "a.", text: t(`${p}.q10.pA`) },
        { label: "b.", text: t(`${p}.q10.pB`) },
        { label: "c.", text: t(`${p}.q10.pC`) },
      ],
    }),

    /* ── Q11: TKA — Gaji dan Bonus ─── */
    Qf(11, t(`${p}.q11.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 8, lightBg: true,
        segs: [{ x1: 0, y1: 4, x2: 6, y2: 7, color: "#059669", label: t(`${p}.q11.segGaji`) }],
        pts: [
          { x: 0, y: 4, label: "(0,2jt)", color: "#059669", labelPos: "tl" },
          { x: 6, y: 7, label: "(30unit,3.5jt)", color: "#059669", labelPos: "tr" },
        ],
        extraTexts: [
          { x: 1, y: -6, text: t(`${p}.q11.extX`), color: "rgba(0,0,0,0.45)", size: 8 },
          { x: -3, y: 5, text: t(`${p}.q11.extY`), color: "rgba(0,0,0,0.45)", size: 8 },
        ],
      },
      content: t(`${p}.q11.content`),
      parts: [
        { label: "a.", text: t(`${p}.q11.pA`) },
        { label: "b.", text: t(`${p}.q11.pB`) },
        { label: "c.", text: t(`${p}.q11.pC`) },
      ],
    }),

    /* ── Q12: ANBK — Soal Kontekstual Pilih Garis ─── */
    Qf(12, t(`${p}.q12.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 12, lightBg: true,
        segs: [{ x1: 0, y1: 8, x2: 3, y2: 11, color: "#65a30d", label: t(`${p}.q12.segLuasPanen`) }],
        pts: [
          { x: 0, y: 8, label: "(2019,400ha)", color: "#65a30d", labelPos: "tl" },
          { x: 3, y: 11, label: "(2022,550ha)", color: "#65a30d", labelPos: "tr" },
        ],
        extraTexts: [
          { x: 1, y: -9, text: t(`${p}.q12.extX`), color: "rgba(0,0,0,0.45)", size: 8 },
          { x: -6, y: 3, text: t(`${p}.q12.extY`), color: "rgba(0,0,0,0.45)", size: 8 },
        ],
      },
      content: t(`${p}.q12.content`),
      parts: [
        { label: "a.", text: t(`${p}.q12.pA`) },
        { label: "b.", text: t(`${p}.q12.pB`) },
        { label: "c.", text: t(`${p}.q12.pC`) },
      ],
    }),

    /* ── Q13: Tarif Telepon ─── */
    Qf(13, t(`${p}.q13.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 10, lightBg: true,
        segs: [
          { x1: 0, y1: 0, x2: 2, y2: 5, color: "#7c3aed", label: t(`${p}.q13.seg010mnt`) },
          { x1: 2, y1: 5, x2: 5, y2: 9.5, color: "#f97316", label: t(`${p}.q13.segGt10mnt`) },
        ],
        pts: [
          { x: 2, y: 5, label: "(10mnt,5rb)", color: "#7c3aed", labelPos: "tl" },
          { x: 5, y: 9.5, label: "(25mnt,9.5rb)", color: "#f97316", labelPos: "tr" },
        ],
        extraTexts: [
          { x: 1, y: -8, text: t(`${p}.q13.extX`), color: "rgba(0,0,0,0.45)", size: 8 },
          { x: -5, y: 5, text: t(`${p}.q13.extY`), color: "rgba(0,0,0,0.45)", size: 8 },
        ],
      },
      content: t(`${p}.q13.content`),
      parts: [
        { label: "a.", text: t(`${p}.q13.pA`) },
        { label: "b.", text: t(`${p}.q13.pB`) },
        { label: "c.", text: t(`${p}.q13.pC`) },
      ],
    }),

    /* ── Q14: Tantangan — Model Matematika Dunia Nyata ─── */
    Qf(14, t(`${p}.q14.title`), {
      type: "mixed",
      diagram: {
        size: 260, range: 6, lightBg: true,
        segs: [
          { x1: 0, y1: 2, x2: 4, y2: 6, color: "#059669", label: t(`${p}.q14.segTokoA`) },
          { x1: 0, y1: 5, x2: 4, y2: 5, color: "#db2777", label: t(`${p}.q14.segTokoB`) },
        ],
        pts: [
          { x: 3, y: 5, label: t(`${p}.q14.ptSama`), color: "#ca8a04", labelPos: "tl" },
        ],
      },
      content: t(`${p}.q14.content`),
      parts: [
        { label: "a.", text: t(`${p}.q14.pA`) },
        { label: "b.", text: t(`${p}.q14.pB`) },
        { label: "c.", text: t(`${p}.q14.pC`) },
        { label: "d.", text: t(`${p}.q14.pD`) },
      ],
    }),
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1 mb-3">
            <span className="text-purple-400 text-xs font-body">
              {questions.length} {t('practice.suffixSoal')} {t(`${p}.badgeSuffix`)}
            </span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-1 text-center">
            {t(`${p}.h1`)}
          </h1>
          <p className="text-white/50 text-xs text-center font-body">{t(`${p}.grade`)}</p>
        </div>

        <div className="flex flex-col gap-6">
          {questions.map((q, i) => (
            <div
              key={q.n}
              className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 via-slate-900/40 to-violet-900/20 backdrop-blur p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.02}s` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {q.n}
                </div>
                <div className="flex-1">
                  <p className="text-purple-300 text-xs font-body font-semibold uppercase tracking-wider mb-1">{q.title}</p>
                  {q.content && (
                    <p className="text-white/80 text-sm font-body leading-relaxed">{q.content}</p>
                  )}
                  {q.math && (
                    <div className="text-white/90 text-sm mt-1"><InlineMath math={q.math} /></div>
                  )}
                </div>
              </div>

              {contextualIllustrations[q.n] && (
                <div className="flex justify-center my-4">
                  <div className="rounded-xl overflow-hidden shadow-lg border border-white/10">
                    {contextualIllustrations[q.n]({})}
                  </div>
                </div>
              )}

              {q.diagram && (
                <div className="flex justify-center my-4">
                  <div className="rounded-xl border border-white/10 overflow-hidden shadow-lg">
                    <CoordPlane {...q.diagram} />
                  </div>
                </div>
              )}

              {q.parts && (
                <div className="flex flex-col gap-2 mt-2 pl-2">
                  {q.parts.map((part, pi) => (
                    <div key={pi} className="flex items-start gap-2">
                      <span className="text-purple-400 text-xs font-body font-bold shrink-0 mt-0.5 min-w-[60px]">{part.label}</span>
                      <div className="text-white/75 text-sm font-body leading-relaxed">
                        {part.math ? <InlineMath math={part.math} /> : <span>{part.text}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/persamaan-garis-lurus"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} {t(`${p}.backTo`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AplikasiKontekstualPage;
