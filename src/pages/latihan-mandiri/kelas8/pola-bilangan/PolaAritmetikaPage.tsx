import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { TrendingUp } from "lucide-react";

const SvgBarisanAritmetika = () => (
  <svg viewBox="0 0 420 130" className="w-full max-w-md mx-auto my-3" aria-label="Ilustrasi barisan aritmetika 7, 11, 15, 19">
    {[
      { cx: 52, val: "7", label: "U₁" },
      { cx: 152, val: "11", label: "U₂" },
      { cx: 252, val: "15", label: "U₃" },
      { cx: 352, val: "19", label: "U₄" },
    ].map(({ cx, val, label }) => (
      <g key={cx}>
        <circle cx={cx} cy={52} r={36} fill="#064e3b" stroke="#34d399" strokeWidth="2" />
        <text x={cx} y={57} textAnchor="middle" fill="#6ee7b7" fontSize="18" fontWeight="bold">{val}</text>
        <text x={cx} y={105} textAnchor="middle" fill="#6ee7b7" fontSize="11">{label}</text>
      </g>
    ))}
    {[102, 202, 302].map((x) => (
      <g key={x}>
        <line x1={x - 2} y1={52} x2={x + 2} y2={52} stroke="none" />
        <path d={`M${x - 14},52 L${x + 14},52`} stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arr)" />
        <text x={x} y={38} textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">+4</text>
      </g>
    ))}
    <defs>
      <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L6,3 Z" fill="#fbbf24" />
      </marker>
    </defs>
    <text x={52} y={122} textAnchor="middle" fill="#34d399" fontSize="10">a = 7</text>
    <rect x={4} y={108} width={94} height={16} rx={4} fill="#064e3b" stroke="#34d399" strokeWidth="1" />
    <text x={51} y={120} textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold">a = 7 (suku pertama)</text>
    <rect x={76} y={26} width={52} height={16} rx={4} fill="#78350f" stroke="#fbbf24" strokeWidth="1" />
    <text x={102} y={37} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">b = 4 (beda)</text>
  </svg>
);

const SvgBatuBata = () => {
  const rows = [8, 10, 12, 14];
  const brickW = 28;
  const brickH = 14;
  const gap = 3;
  const rowGap = 5;
  const maxBricks = 16;
  const svgW = maxBricks * (brickW + gap) + 20;
  const totalRows = 6;

  return (
    <svg viewBox={`0 0 ${svgW} 220`} className="w-full max-w-lg mx-auto my-3" aria-label="Ilustrasi tumpukan batu bata">
      {rows.map((count, ri) => {
        const y = ri * (brickH + rowGap) + 10;
        const totalW = count * (brickW + gap) - gap;
        const startX = (svgW - totalW) / 2;
        const rowNum = ri + 1;
        return (
          <g key={ri}>
            {Array.from({ length: count }).map((_, bi) => (
              <rect
                key={bi}
                x={startX + bi * (brickW + gap)}
                y={y}
                width={brickW}
                height={brickH}
                rx={2}
                fill={ri === 0 ? "#b45309" : ri === 1 ? "#b45309" : "#92400e"}
                stroke="#fbbf24"
                strokeWidth="0.8"
              />
            ))}
            <text x={svgW - 8} y={y + brickH / 2 + 4} textAnchor="end" fill="#fbbf24" fontSize="10">
              {count} bata (tumpukan {rowNum})
            </text>
          </g>
        );
      })}

      <text x={svgW / 2} y={rows.length * (brickH + rowGap) + 22} textAnchor="middle" fill="#6ee7b7" fontSize="13" fontWeight="bold">
        ⋮
      </text>
      <text x={svgW / 2} y={rows.length * (brickH + rowGap) + 36} textAnchor="middle" fill="#6ee7b7" fontSize="11">
        (tumpukan 5 s.d. 14)
      </text>

      {(() => {
        const lastCount = 8 + 14 * 2;
        const lastY = rows.length * (brickH + rowGap) + 50;
        const totalW = Math.min(lastCount, maxBricks) * (brickW + gap) - gap;
        const startX = (svgW - totalW) / 2;
        return (
          <g>
            {Array.from({ length: Math.min(lastCount, maxBricks) }).map((_, bi) => (
              <rect
                key={bi}
                x={startX + bi * (brickW + gap)}
                y={lastY}
                width={brickW}
                height={brickH}
                rx={2}
                fill="#7c3aed"
                stroke="#c4b5fd"
                strokeWidth="0.8"
              />
            ))}
            <text x={svgW - 8} y={lastY + brickH / 2 + 4} textAnchor="end" fill="#c4b5fd" fontSize="10">
              ? bata (tumpukan 15)
            </text>
          </g>
        );
      })()}

      <text x={10} y={200} fill="#34d399" fontSize="10">↑ Atas</text>
      <text x={10} y={212} fill="#c4b5fd" fontSize="10">↓ Bawah (paling bawah)</text>
    </svg>
  );
};

const PolaAritmetikaPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const questions = [
    {
      number: 1,
      title: "Menentukan Suku ke-n Barisan Aritmetika",
      content: "Diketahui barisan aritmetika berikut:",
      type: "mixed",
      svg: <SvgBarisanAritmetika />,
      parts: [
        { label: "Barisan:", math: "7,\\ 11,\\ 15,\\ 19,\\ \\ldots" },
        { label: "a.", text: "Tentukan suku pertama (a) dan beda (b) dari barisan tersebut." },
        { label: "b.", math: "\\text{Tuliskan rumus } U_n \\text{ dari barisan tersebut.}" },
        { label: "c.", math: "\\text{Hitung nilai } U_{20}." },
      ],
    },
    {
      number: 2,
      title: "Menentukan Beda (b) Barisan Aritmetika",
      content: "Dalam suatu barisan aritmetika, diketahui:",
      type: "mixed",
      parts: [
        { label: "Info:", math: "U_3 = 15 \\quad \\text{dan} \\quad U_8 = 35" },
        { label: "a.", text: "Tentukan nilai beda (b) dari barisan tersebut." },
        { label: "b.", text: "Tentukan nilai suku pertama (a)." },
        { label: "c.", math: "\\text{Tentukan nilai } U_{15}." },
      ],
    },
    {
      number: 3,
      title: "Barisan Aritmetika - Soal UN",
      content: "Suku ke-5 suatu barisan aritmetika adalah 17 dan suku ke-9 adalah 33.",
      type: "mixed",
      parts: [
        { label: "a.", text: "Tentukan beda dan suku pertama barisan tersebut." },
        { label: "b.", math: "\\text{Tentukan } U_{30} \\text{ dari barisan tersebut.}" },
        { label: "c.", text: "Suku ke berapa yang bernilai 81?" },
      ],
    },
    {
      number: 4,
      title: "Jumlah n Suku Pertama Barisan Aritmetika",
      content: "Rumus jumlah n suku pertama barisan aritmetika:",
      type: "mixed",
      parts: [
        { label: "Rumus:", math: "S_n = \\frac{n}{2}(2a + (n-1)b)" },
        { label: "", math: "\\text{atau} \\quad S_n = \\frac{n}{2}(U_1 + U_n)" },
        { label: "Soal:", text: "Hitung jumlah 20 suku pertama dari barisan: 3, 7, 11, 15, ..." },
      ],
    },
    {
      number: 5,
      title: "Aplikasi Barisan Aritmetika - Gaji Karyawan",
      content: "Seorang karyawan mendapatkan gaji bulan pertama sebesar Rp2.500.000. Setiap bulan gajinya naik Rp150.000.\n\na. Berapa gaji karyawan tersebut pada bulan ke-12?\nb. Berapa total gaji yang diterima selama 1 tahun (12 bulan)?\nc. Pada bulan ke berapa karyawan mendapatkan gaji Rp4.150.000?",
      type: "essay",
    },
    {
      number: 6,
      title: "Menyisipkan Bilangan dalam Barisan Aritmetika",
      content: "Di antara bilangan 4 dan 28, disisipkan 5 bilangan sehingga membentuk barisan aritmetika.\n\na. Tentukan beda barisan yang terbentuk.\nb. Tuliskan barisan lengkapnya.\nc. Berapakah jumlah semua bilangan dalam barisan itu?",
      type: "essay",
    },
    {
      number: 7,
      title: "Soal TKA - Barisan Aritmetika",
      content: "Jumlah 10 suku pertama suatu barisan aritmetika adalah 155 dan suku ke-10 adalah 28.",
      type: "mixed",
      parts: [
        { label: "a.", text: "Tentukan suku pertama barisan tersebut." },
        { label: "b.", text: "Tentukan beda barisan tersebut." },
        { label: "c.", math: "\\text{Hitung } U_{25}." },
      ],
    },
    {
      number: 8,
      title: "Soal Kontekstual - Kursi Gedung Pertunjukan",
      content: "Sebuah gedung pertunjukan memiliki 20 baris kursi. Baris pertama berisi 15 kursi, baris kedua 18 kursi, baris ketiga 21 kursi, dan seterusnya membentuk barisan aritmetika.\n\na. Berapa banyak kursi pada baris ke-20?\nb. Berapa total kursi di seluruh gedung pertunjukan?",
      type: "essay",
    },
    {
      number: 9,
      title: "Menentukan Suku Pertama dari Informasi S_n",
      content: "Jumlah n suku pertama suatu barisan aritmetika dinyatakan dengan:",
      type: "mixed",
      parts: [
        { label: "Diket:", math: "S_n = 3n^2 + 5n" },
        { label: "a.", math: "\\text{Tentukan } U_1,\\ U_2,\\ U_3." },
        { label: "b.", text: "Tentukan beda barisan tersebut." },
        { label: "c.", math: "\\text{Tentukan rumus } U_n." },
      ],
    },
    {
      number: 10,
      title: "Soal ANBK - Deret Aritmetika Terapan",
      content: "Seorang siswa menabung setiap hari. Hari pertama ia menabung Rp5.000, hari kedua Rp7.000, hari ketiga Rp9.000, dan seterusnya.\n\na. Berapa banyak uang yang ditabung pada hari ke-30?\nb. Berapa total tabungan selama 30 hari?\nc. Pada hari ke berapa total tabungannya mencapai Rp192.000?",
      type: "essay",
    },
    {
      number: 11,
      title: "Soal Kontekstual - Tumpukan Batu Bata",
      content: "Pada tumpukan batu bata, banyak batu bata paling atas ada 8 buah, tepat di bawahnya ada 10 buah, dan seterusnya setiap tumpukan di bawahnya selalu lebih banyak 2 buah dari tumpukan di atasnya. Jika ada 15 tumpukan batu bata (dari atas sampai bawah), berapa banyak batu bata pada tumpukan paling bawah?",
      type: "mixed",
      svg: <SvgBatuBata />,
      parts: [
        { label: "Diket:", math: "a = 8,\\quad b = 2,\\quad n = 15" },
        { label: "Tanya:", text: "Banyak batu bata pada tumpukan ke-15 (paling bawah) = U₁₅ = ?" },
        { label: "Rumus:", math: "U_n = a + (n-1)\\,b" },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center mb-3">
            <TrendingUp className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-emerald-300 text-center mb-1" style={{ textShadow: '0 0 20px rgba(52,211,153,0.7)' }}>
            BARISAN DAN DERET ARITMETIKA
          </h1>
          <p className="text-white/50 text-xs text-center font-body">Kelas 8 · Pola Bilangan · {t('practice.breadcrumb')}</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-400 text-xs font-bold">📋 11 {t('practice.suffixSoal')}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/50 text-xs">Tingkat: UN / ANBK / TKA</span>
          </div>
        </div>

        <div className="mb-5 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-emerald-300 text-xs font-bold mb-3">📌 Rumus Barisan Aritmetika</p>
          <div className="flex flex-col gap-3">
            {[
              { label: "Suku ke-n", math: "U_n = a + (n-1)b" },
              { label: "Jumlah n suku pertama", math: "S_n = \\frac{n}{2}(2a + (n-1)b)" },
              { label: "Alternatif Sn", math: "S_n = \\frac{n}{2}(U_1 + U_n)" },
            ].map((r, i) => (
              <div key={i} className="bg-white/5 rounded-lg px-4 py-3">
                <p className="text-white/40 text-[10px] mb-1">{r.label}</p>
                <div className="text-emerald-200">
                  <BlockMath math={r.math} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 animate-slide-up">
          {questions.map((q, i) => (
            <div
              key={q.number}
              className="relative rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-slate-900/80 to-green-900/30 backdrop-blur" />
              <div className="absolute inset-0 border border-emerald-500/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-green-500 rounded-l-2xl" />

              <div className="relative px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
                      <span className="text-emerald-300 text-xs font-bold">{q.number}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {q.title && (
                      <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2">
                        {q.title}
                      </span>
                    )}
                    {q.content && (
                      <p className="font-body text-sm text-white/90 whitespace-pre-line leading-relaxed mb-2">{q.content}</p>
                    )}
                    {'svg' in q && q.svg && (
                      <div className="my-2 bg-white/5 rounded-xl p-3 border border-emerald-500/20">
                        {q.svg}
                      </div>
                    )}
                    {q.type === "mixed" && q.parts && (
                      <div className="flex flex-col gap-2 mt-2">
                        {q.parts.map((part, pi) => (
                          <div key={pi} className="flex items-start gap-2 bg-white/5 rounded-lg px-3 py-2">
                            <span className="text-emerald-300 text-xs font-bold shrink-0 mt-0.5 min-w-[40px]">{part.label}</span>
                            {part.math ? (
                              <div className="text-white text-sm overflow-x-auto">
                                <InlineMath math={part.math} />
                              </div>
                            ) : (
                              <p className="font-body text-sm text-white/80 whitespace-pre-line">{part.text}</p>
                            )}
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
          <button
            onClick={() => { playPopSound(); navigate("/latihan-mandiri/kelas-8/pola-bilangan"); }}
            className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors cursor-pointer font-body"
          >
            {t('practice.backTo')} Pola Bilangan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolaAritmetikaPage;
