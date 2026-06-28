import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { TrendingUp } from "lucide-react";

const SvgBarisanObjek = () => {
  const terms = [7, 11, 15, 19];
  const dotsPerRow = 5;
  const dotR = 5;
  const dx = 14;
  const dy = 14;
  const groupCenters = [42, 138, 234, 330];
  const topY = 14;
  const labelY = 80;

  return (
    <svg viewBox="0 0 374 92" className="w-full max-w-md mx-auto my-3" aria-label="Ilustrasi barisan aritmetika dengan bola">
      {terms.map((count, gi) => {
        const cx0 = groupCenters[gi] - Math.floor(dotsPerRow / 2) * dx;
        return (
          <g key={gi}>
            {Array.from({ length: count }, (_, i) => {
              const col = i % dotsPerRow;
              const row = Math.floor(i / dotsPerRow);
              return (
                <circle
                  key={i}
                  cx={cx0 + col * dx}
                  cy={topY + row * dy}
                  r={dotR}
                  fill="#34d399"
                  stroke="#064e3b"
                  strokeWidth="0.8"
                  opacity="0.92"
                />
              );
            })}
            <text x={groupCenters[gi]} y={labelY} textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="bold">
              {`U${gi + 1}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const SvgBatuBata = () => {
  const brickW = 28;
  const brickH = 14;
  const gap = 3;
  const rowGap = 5;
  const maxBricks = 16;
  const svgW = maxBricks * (brickW + gap) + 20;

  return (
    <svg viewBox={`0 0 ${svgW} 170`} className="w-full max-w-lg mx-auto my-3" aria-label="Ilustrasi tumpukan batu bata">
      {[8, 10, 12, 14].map((count, ri) => {
        const y = ri * (brickH + rowGap) + 10;
        const totalW = count * (brickW + gap) - gap;
        const startX = (svgW - totalW) / 2;
        return (
          <g key={ri}>
            {Array.from({ length: count }, (_, bi) => (
              <rect key={bi} x={startX + bi * (brickW + gap)} y={y} width={brickW} height={brickH}
                rx={2} fill="#b45309" stroke="#fbbf24" strokeWidth="0.8" />
            ))}
          </g>
        );
      })}
      <text x={svgW / 2} y={4 * (brickH + rowGap) + 22} textAnchor="middle" fill="#6ee7b7" fontSize="13" fontWeight="bold">⋮</text>
      {(() => {
        const lastCount = 36;
        const lastY = 4 * (brickH + rowGap) + 50;
        const totalW = Math.min(lastCount, maxBricks) * (brickW + gap) - gap;
        const startX = (svgW - totalW) / 2;
        return (
          <g>
            {Array.from({ length: Math.min(lastCount, maxBricks) }, (_, bi) => (
              <rect key={bi} x={startX + bi * (brickW + gap)} y={lastY} width={brickW} height={brickH}
                rx={2} fill="#7c3aed" stroke="#c4b5fd" strokeWidth="0.8" />
            ))}
          </g>
        );
      })()}
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
      content: "Perhatikan barisan benda berikut yang membentuk barisan aritmetika:",
      type: "mixed",
      svg: <SvgBarisanObjek />,
      parts: [
        { label: "a.", text: "Tentukan suku pertama (a) dan beda (b) dari barisan tersebut." },
        { label: "b.", math: "\\text{Tuliskan rumus } U_n \\text{ dari barisan tersebut.}" },
        { label: "c.", math: "\\text{Hitung nilai } U_{20}." },
      ],
    },
    {
      number: 2,
      title: "Barisan Aritmetika Sederhana",
      content: "Diketahui barisan aritmetika: 3, 7, 11, 15, ...",
      type: "mixed",
      parts: [
        { label: "a.", text: "Tentukan suku pertama (a) barisan tersebut." },
        { label: "b.", text: "Tentukan beda (b) barisan tersebut." },
        { label: "c.", math: "\\text{Hitung nilai } U_{25}." },
      ],
    },
    {
      number: 3,
      title: "Barisan Aritmetika Turun",
      content: "Diketahui barisan aritmetika: 10, 7, 4, 1, −2, ...",
      type: "mixed",
      parts: [
        { label: "a.", text: "Tentukan suku pertama (a) barisan tersebut." },
        { label: "b.", text: "Tentukan beda (b) barisan tersebut." },
        { label: "c.", math: "\\text{Hitung nilai } U_{40}." },
      ],
    },
    {
      number: 4,
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
      number: 5,
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
      number: 6,
      title: "Deret Aritmetika - Mencari Jumlah Suku",
      content: "Dalam suatu barisan aritmetika, diketahui suku ke-4 adalah 11 dan suku ke-10 adalah 35.",
      type: "mixed",
      parts: [
        { label: "a.", text: "Tentukan suku pertama (a) dan beda (b)." },
        { label: "b.", math: "\\text{Tentukan nilai } S_{20}." },
      ],
    },
    {
      number: 7,
      title: "Jumlah n Suku Pertama Barisan Aritmetika",
      content: "Rumus jumlah n suku pertama barisan aritmetika:",
      type: "mixed",
      parts: [
        { label: "Rumus:", math: "S_n = \\frac{n}{2}(2a + (n-1)b)" },
        { label: "", math: "\\text{atau} \\quad S_n = \\frac{n}{2}(U_1 + U_n)" },
        { label: "Soal:", text: "Hitung jumlah 20 suku pertama dari deret: 3 + 7 + 11 + 15 + ..." },
      ],
    },
    {
      number: 8,
      title: "Aplikasi Barisan Aritmetika - Gaji Karyawan",
      content: "Seorang karyawan mendapatkan gaji bulan pertama sebesar Rp2.500.000. Setiap bulan gajinya naik Rp150.000.\n\na. Berapa gaji karyawan tersebut pada bulan ke-12?\nb. Berapa total gaji yang diterima selama 1 tahun (12 bulan)?\nc. Pada bulan ke berapa karyawan mendapatkan gaji Rp4.150.000?",
      type: "essay",
    },
    {
      number: 9,
      title: "Soal Kontekstual - Kursi Gedung Pertunjukan",
      content: "Sebuah gedung pertunjukan memiliki 20 baris kursi. Baris pertama berisi 15 kursi, baris kedua 18 kursi, baris ketiga 21 kursi, dan seterusnya membentuk barisan aritmetika.\n\na. Berapa banyak kursi pada baris ke-20?\nb. Berapa total kursi di seluruh gedung pertunjukan?",
      type: "essay",
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
      content: "Pada tumpukan batu bata, banyak batu bata paling atas ada 8 buah, tepat di bawahnya ada 10 buah, dan seterusnya setiap tumpukan di bawahnya selalu lebih banyak 2 buah dari tumpukan di atasnya.\n\nJika ada 15 tumpukan batu bata (dari atas sampai bawah), tentukan banyak batu bata pada tumpukan paling bawah (U₁₅) = ?",
      type: "essay",
      svg: <SvgBatuBata />,
    },
    {
      number: 12,
      title: "Menyisipkan Bilangan dalam Barisan Aritmetika",
      content: "Di antara bilangan 4 dan 28, disisipkan 5 bilangan sehingga membentuk barisan aritmetika.\n\na. Tentukan beda barisan yang terbentuk.\nb. Tuliskan barisan lengkapnya.\nc. Berapakah jumlah semua bilangan dalam barisan itu?",
      type: "essay",
    },
    {
      number: 13,
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
      number: 14,
      title: "Jumlah Kelipatan 3",
      content: "Tentukan jumlah semua bilangan kelipatan 3 yang berada di antara 1 dan 100.",
      type: "essay",
    },
    {
      number: 15,
      title: "Jumlah Kelipatan 6",
      content: "Tentukan jumlah semua bilangan yang merupakan kelipatan 6 yang berada di antara 120 dan 300.",
      type: "essay",
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
            <span className="text-emerald-400 text-xs font-bold">📋 15 {t('practice.suffixSoal')}</span>
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
