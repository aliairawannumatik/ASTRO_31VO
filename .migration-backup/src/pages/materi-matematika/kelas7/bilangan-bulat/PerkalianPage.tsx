import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Calculator, Target, AlertCircle, Zap } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { useLanguage } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ── Helper: buat komponen animasi busur generik ──────────────── */
const makePatternSVG = (
  rows: string[],
  arcLabel: string,
  rowColor: string,
  rowBg: string,
  rowBorder: string,
  arcStroke: string,
  arcLabel_color: string,
  conclusionColor1: string,
  conclusionColor2: string,
) => {
  const rowY    = (i: number) => 46 + i * 52;
  const rightX  = 390;
  const arcOutX = 448;
  const nArcs   = rows.length - 1;
  const svgH    = rowY(rows.length) + 60;

  return function PatternSVG({ conclusionText }: { conclusionText: string }) {
    const [step, setStep] = useState(0);
    useEffect(() => {
      const delay =
        step === 0             ? 700  :
        step <= nArcs          ? 820  :
        step === nArcs + 1     ? 2200 :
        500;
      const t = setTimeout(
        () => setStep(s => (s >= nArcs + 2 ? 0 : s + 1)),
        delay,
      );
      return () => clearTimeout(t);
    }, [step]);

    const numArcs = Math.min(step, nArcs);

    return (
      <svg viewBox={`0 0 490 ${svgH}`} width="100%" xmlns="http://www.w3.org/2000/svg">
        {rows.map((label, i) => (
          <g key={i}>
            <rect x="12" y={rowY(i) - 18} width="374" height="34" rx="6"
              fill={rowBg} stroke={rowBorder} strokeWidth="1"/>
            <text x="28" y={rowY(i) + 7} fontSize="14" fontFamily="monospace"
              fill={rowColor} letterSpacing="0.5">{label}</text>
          </g>
        ))}

        {Array.from({ length: numArcs }, (_, i) => {
          const y1 = rowY(i);
          const y2 = rowY(i + 1);
          return (
            <g key={`arc${i}`}>
              <path
                d={`M ${rightX},${y1} C ${arcOutX},${y1+20} ${arcOutX},${y2-20} ${rightX},${y2}`}
                fill="none" stroke={arcStroke} strokeWidth="2.2" strokeLinecap="round"/>
              <path
                d={`M ${rightX-6},${y2-10} L ${rightX},${y2} L ${rightX+6},${y2-10}`}
                fill="none" stroke={arcStroke} strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round"/>
              <text x={arcOutX + 10} y={(y1 + y2) / 2 + 5}
                fill={arcLabel_color} fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                {arcLabel}
              </text>
            </g>
          );
        })}

        <g>
          <rect x="12" y={rowY(rows.length) + 4} width="466" height="44" rx="8"
            fill="#0f172a50" strokeWidth="2">
            <animate attributeName="stroke"
              values={`${conclusionColor1}70;${conclusionColor1}bb;${conclusionColor1}70`}
              dur="5s" repeatCount="indefinite"/>
            <animate attributeName="fill-opacity" values="0.25;0.45;0.25" dur="5s" repeatCount="indefinite"/>
          </rect>
          <text x="245" y={rowY(rows.length) + 27} textAnchor="middle"
            fontSize="12.5" fontFamily="sans-serif" fontWeight="bold">
            <animate attributeName="fill"
              values={`${conclusionColor1};${conclusionColor2};${conclusionColor1}`}
              dur="5s" repeatCount="indefinite"/>
            {conclusionText}
          </text>
        </g>
      </svg>
    );
  };
};

const PosTimesPosPatternSVG = makePatternSVG(
  ["1 \u00d7 3 = 3", "2 \u00d7 3 = 6", "3 \u00d7 3 = 9", "4 \u00d7 3 = 12"],
  "+3",
  "#4ade80", "#14532d40", "#16a34a50",
  "#4ade80cc", "#4ade80",
  "#4ade80", "#86efac",
);

const PosTimesNegPatternSVG = makePatternSVG(
  ["1 \u00d7 (\u22123) = \u22123", "2 \u00d7 (\u22123) = \u22126",
   "3 \u00d7 (\u22123) = \u22129", "4 \u00d7 (\u22123) = \u221212"],
  "\u22123",
  "#fb923c", "#431a0540", "#c2410c50",
  "#fb923ccc", "#fb923c",
  "#fb923c", "#fdba74",
);

const NegTimesPosPatternSVG = () => {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const delay =
      step === 0 ? 700  :
      step === 4 ? 1000 :
      step === 7 ? 3200 :
      step === 8 ? 500  :
      860;
    const t = setTimeout(() => setStep(s => (s >= 8 ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [step]);

  const conclusionText =
    language === "en"
      ? "Each factor \u22121 \u2192 result falls \u22122  \u2234 (\u2212) \u00d7 (+) = (\u2212) \u2713"
      : language === "ja"
      ? "\u5404\u56e0\u6570 \u22121 \u2192 \u7a4d\u306f \u22122 \u305a\u3064\u6e1b\u5c11  \u2234 (\u2212) \u00d7 (+) = (\u2212) \u2713"
      : "Setiap faktor \u22121 \u2192 hasil turun \u22122  \u2234 (\u2212) \u00d7 (+) = (\u2212) \u2713";

  const rows = [
    { label: "3 \u00d7 2 = 6",       isNegPos: false },
    { label: "2 \u00d7 2 = 4",       isNegPos: false },
    { label: "1 \u00d7 2 = 2",       isNegPos: false },
    { label: "0 \u00d7 2 = 0",       isNegPos: false },
    { label: "(\u22121) \u00d7 2 = \u22122", isNegPos: true  },
    { label: "(\u22122) \u00d7 2 = \u22124", isNegPos: true  },
    { label: "(\u22123) \u00d7 2 = \u22126", isNegPos: true  },
  ];

  const rowY    = (i: number) => 48 + i * 52;
  const rightX  = 390;
  const arcOutX = 446;
  const numArcs = Math.min(step, 6);

  return (
    <svg viewBox="0 0 490 490" width="100%" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="10" y={rowY(4) - 22} width="388" height={52 * 3 + 18}
        rx="8" fill="#450a0a18" stroke="#dc262630" strokeWidth="1"
      />

      {rows.map((row, i) => {
        const y    = rowY(i);
        const isNP = row.isNegPos;
        return (
          <g key={i}>
            <rect
              x="12" y={y - 17} width="374" height="34" rx="6"
              fill={isNP ? "#450a0a50" : "#0f172a80"}
              stroke={isNP ? "#dc262660" : "#ffffff15"}
              strokeWidth="1"
            />
            <text x="28" y={y + 7} fontSize="14" fontFamily="monospace"
              fill={isNP ? "#f87171" : "#e2e8f0"} letterSpacing="0.5">
              {row.label}
            </text>
          </g>
        );
      })}

      {Array.from({ length: numArcs }, (_, i) => {
        const y1       = rowY(i);
        const y2       = rowY(i + 1);
        const isNPArc  = i >= 3;
        const stroke   = isNPArc ? "#f87171dd" : "#64748b60";
        const lbl      = isNPArc ? "#f87171"   : "#475569";
        const sw       = isNPArc ? 2.2 : 1.4;
        const dash     = isNPArc ? undefined : "5 3";
        return (
          <g key={`arc${i}`}>
            <path
              d={`M ${rightX},${y1} C ${arcOutX},${y1 + 20} ${arcOutX},${y2 - 20} ${rightX},${y2}`}
              fill="none" stroke={stroke} strokeWidth={sw} strokeDasharray={dash}
            />
            <path
              d={`M ${rightX - 6},${y2 - 10} L ${rightX},${y2} L ${rightX + 6},${y2 - 10}`}
              fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
            />
            <text x={arcOutX + 10} y={(y1 + y2) / 2 + 5}
              fill={lbl} fontSize="12" fontFamily="sans-serif" fontWeight="bold">
              -1
            </text>
          </g>
        );
      })}

      <g>
        <rect
          x="12" y={rowY(7) + 6} width="466" height="44" rx="8"
          fill="#450a0a50" strokeWidth="2"
        >
          <animate attributeName="stroke" values="#dc262670;#f87171aa;#dc262670" dur="5s" repeatCount="indefinite"/>
          <animate attributeName="fill-opacity" values="0.25;0.4;0.25" dur="5s" repeatCount="indefinite"/>
        </rect>
        <text x="245" y={rowY(7) + 29} textAnchor="middle"
          fontSize="12.5" fontFamily="sans-serif" fontWeight="bold">
          <animate attributeName="fill" values="#f87171;#fca5a5;#ef4444;#f87171" dur="5s" repeatCount="indefinite"/>
          {conclusionText}
        </text>
      </g>
    </svg>
  );
};

const NegTimesNegPatternSVG = () => {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const delay =
      step === 0 ? 700  :
      step === 3 ? 1000 :
      step === 6 ? 700  :
      step === 7 ? 3200 :
      step === 8 ? 500  :
      860;
    const t = setTimeout(() => setStep(s => (s >= 8 ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [step]);

  const line1 =
    language === "en"
      ? "Pattern always +1 downward \u2192 when the multiplier becomes negative,"
      : language === "ja"
      ? "\u30d1\u30bf\u30fc\u30f3\u306f\u5e38\u306b\u4e0b\u3078 +1 \u2192 \u56e0\u6570\u304c\u8ca0\u306b\u306a\u308b\u3068\uff0c"
      : "Pola selalu +1 ke bawah \u2192 ketika pengurang menjadi negatif,";
  const line2 =
    language === "en"
      ? "the result becomes positive! \u2234 (\u2212) \u00d7 (\u2212) = (+) \u2713"
      : language === "ja"
      ? "\u7a4d\u306f\u6b63\u306b\u306a\u308b\uff01\u2234 (\u2212) \u00d7 (\u2212) = (+) \u2713"
      : "hasilnya menjadi positif! \u2234 (\u2212) \u00d7 (\u2212) = (+) \u2713";

  const rows = [
    { label: "-1 \u00d7 2 = -2",    isNegNeg: false },
    { label: "-1 \u00d7 1 = -1",    isNegNeg: false },
    { label: "-1 \u00d7 0 =  0",    isNegNeg: false },
    { label: "-1 \u00d7 (\u22121) = 1",  isNegNeg: true  },
    { label: "-1 \u00d7 (\u22122) = 2",  isNegNeg: true  },
    { label: "-1 \u00d7 (\u22123) = 3",  isNegNeg: true  },
  ];

  const rowY    = (i: number) => 48 + i * 56;
  const rightX  = 390;
  const arcOutX = 446;
  const numArcs = Math.min(step, 5);

  return (
    <svg viewBox="0 0 490 452" width="100%" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="10" y={rowY(3) - 22} width="388" height={56 * 3 + 18}
        rx="8" fill="#78350f18" stroke="#d9770630" strokeWidth="1"
      />

      {rows.map((row, i) => {
        const y    = rowY(i);
        const isNN = row.isNegNeg;
        return (
          <g key={i}>
            <rect
              x="12" y={y - 17} width="374" height="34" rx="6"
              fill={isNN ? "#78350f50" : "#0f172a80"}
              stroke={isNN ? "#d9770660" : "#ffffff15"}
              strokeWidth="1"
            />
            <text x="28" y={y + 7} fontSize="14" fontFamily="monospace"
              fill={isNN ? "#FDE047" : "#e2e8f0"} letterSpacing="0.5">
              {row.label}
            </text>
          </g>
        );
      })}

      {Array.from({ length: numArcs }, (_, i) => {
        const y1      = rowY(i);
        const y2      = rowY(i + 1);
        const isNNArc = i >= 2;
        const stroke  = isNNArc ? "#f59e0bdd" : "#64748b60";
        const lbl     = isNNArc ? "#FBBF24"   : "#475569";
        const sw      = isNNArc ? 2.2 : 1.4;
        const dash    = isNNArc ? undefined : "5 3";

        return (
          <g key={`arc${i}`}>
            <path
              d={`M ${rightX},${y1} C ${arcOutX},${y1 + 20} ${arcOutX},${y2 - 20} ${rightX},${y2}`}
              fill="none" stroke={stroke} strokeWidth={sw} strokeDasharray={dash}
            />
            <path
              d={`M ${rightX - 6},${y2 - 10} L ${rightX},${y2} L ${rightX + 6},${y2 - 10}`}
              fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
            />
            <text
              x={arcOutX + 10} y={(y1 + y2) / 2 + 5}
              fill={lbl} fontSize="12" fontFamily="sans-serif" fontWeight="bold"
            >+1</text>
          </g>
        );
      })}

      <g>
        <rect
          x="12" y={rowY(6) + 6} width="466" height="50" rx="8"
          fill="#14532d50" strokeWidth="2"
        >
          <animate attributeName="stroke" values="#16a34a70;#4ade80aa;#16a34a70" dur="5s" repeatCount="indefinite"/>
          <animate attributeName="fill-opacity" values="0.25;0.4;0.25" dur="5s" repeatCount="indefinite"/>
        </rect>
        <text x="245" y={rowY(6) + 27} textAnchor="middle"
          fontSize="12.5" fontFamily="sans-serif" fontWeight="bold">
          <animate attributeName="fill" values="#4ade80;#86efac;#22c55e;#4ade80" dur="5s" repeatCount="indefinite"/>
          {line1}
        </text>
        <text x="245" y={rowY(6) + 44} textAnchor="middle"
          fontSize="12.5" fontFamily="sans-serif" fontWeight="bold">
          <animate attributeName="fill" values="#86efac;#4ade80;#bbf7d0;#86efac" dur="5s" repeatCount="indefinite"/>
          {line2}
        </text>
      </g>
    </svg>
  );
};

const PerkalianBilanganBulatPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<string[]>(["intro", "positifPositif", "positifNegatif", "negatifNegatif", "nolSatu", "contoh", "sifatPerkalian", "kesimpulan"]);

  const toggleSection = (section: string) => {
    playPopSound();
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const translations = {
    id: {
      title: "PERKALIAN BILANGAN BULAT",
      subtitle: "Kelas 7 - Bilangan Bulat - Materi Matematika",
      svgPosPos: "Setiap faktor +1 \u2192 hasil naik +3  \u2234 (+) \u00d7 (+) = (+) \u2713",
      svgPosNeg: "Setiap faktor +1 \u2192 hasil turun \u22123  \u2234 (+) \u00d7 (\u2212) = (\u2212) \u2713",
      secIntroTitle: "Memahami Makna Perkalian",
      secPosPosTitle: "Positif \u00d7 Positif = Positif",
      secPosNegTitle: "Positif \u00d7 Negatif = Negatif",
      secNegPosTitle: "Negatif \u00d7 Positif = Negatif",
      secNolSatuTitle: "Perkalian dengan 0 dan 1",
      secContohTitle: "Contoh Soal dan Pembahasan",
      secSifatTitle: "Sifat-Sifat Perkalian Bilangan Bulat",
      secKesimpulanTitle: "Kesimpulan & Tips Perkalian Bilangan Bulat",
      introP: "Sebelum masuk ke perkalian bilangan bulat, yuk kita ingat lagi arti perkalian yang sudah dipelajari sejak SD.",
      introBold: "Perkalian adalah penjumlahan berulang!",
      basicConceptTitle: "Konsep Dasar Perkalian:",
      desc2x3: "artinya ada",
      desc2x3Bold: "dua buah tigaan",
      desc4x5Bold: "empat buah limaan",
      rememberTitle: "Ingat!",
      rememberBody: "artinya",
      rememberBody2: "ditambahkan sebanyak",
      rememberBody3: "kali, BUKAN sebaliknya! Jadi",
      rememberBody4: "bukan",
      posPosIntro: "Ini adalah kasus paling mudah dan sudah kamu kenal sejak SD. Karena perkalian adalah",
      posPosIntroBold: "penjumlahan berulang",
      posPosIntroC: ", hasil positif dikali positif sudah pasti positif.",
      posPosPatternTitle: "Perhatikan polanya (mengalikan dengan 3):",
      posPosG1: "(satu buah 3)",
      posPosG2: "(dua buah 3)",
      posPosG3: "(tiga buah 3)",
      posPosG4: "(empat buah 3)",
      conclusionLabel: "Kesimpulan:",
      katexPosPos: "\\text{Positif} \\times \\text{Positif} = \\textbf{Positif}",
      logicTitle: "Logika Sederhana:",
      posPosLogic: "Jika kamu punya",
      posPosLogic2: "kelompok yang masing-masing berisi",
      posPosLogic3: "benda, totalnya selalu",
      posPosLogic4: "benda \u2014 tidak pernah negatif!",
      posNegIntro: "Dengan konsep penjumlahan berulang, kita bisa menghitung perkalian bilangan positif dengan negatif:",
      posNegPatternTitle: "Perhatikan polanya:",
      posNegG1: "(satu buah -3)",
      posNegG2: "(dua buah -3)",
      posNegG3: "(tiga buah -3)",
      posNegG4: "(empat buah -3)",
      katexPosNeg: "\\text{Positif} \\times \\text{Negatif} = \\textbf{Negatif}",
      negPosIntro: "Bagaimana jika bilangan",
      negPosIntroB: "negatif",
      negPosIntroC: "dikalikan dengan bilangan",
      negPosIntroD: "positif",
      negPosIntroE: "? Perhatikan pola berikut \u2014 setiap kali faktor pertama turun 1 (menjadi negatif), hasilnya pun terus turun!",
      negPosPatternLabel: "(\u2212) \u00d7 (+) \u2014 pola turun:",
      katexNegPos: "\\text{Negatif} \\times \\text{Positif} = \\textbf{Negatif}",
      negNegTitle: "Negatif \u00d7 Negatif = Positif",
      negNegDesc: "Ikuti busur",
      negNegDescB: "ke bawah \u2014 setiap kali faktor pertama turun 1 (menjadi negatif), hasilnya justru",
      negNegDescC: "naik menjadi positif",
      negNegDescD: "! Busur redup = pola awal, busur terang = wilayah negatif \u00d7 negatif.",
      katexNegNeg: "\\text{Negatif} \\times \\text{Negatif} = \\textbf{Positif}",
      easyMemoBold: "Cara Mudah Mengingat:",
      easyMemoText: "Bayangkan tanda negatif seperti \"berbalik arah\". Satu negatif membalik ke arah negatif, tapi dua negatif membalik dua kali sehingga kembali ke arah positif!",
      mulBy0Title: "Perkalian dengan 0:",
      mulBy0Desc: "Bilangan apapun jika dikalikan dengan 0, hasilnya selalu 0. Logikanya? Jika kamu punya 0 kelompok dari suatu benda, ya tidak ada benda sama sekali!",
      mulBy1Title: "Perkalian dengan 1 (Elemen Identitas):",
      mulBy1DescA: "Bilangan apapun jika dikalikan dengan 1, hasilnya adalah bilangan itu sendiri. Angka 1 disebut",
      identityTerm: "elemen identitas",
      mulBy1DescB: "perkalian.",
      signRuleSummaryTitle: "Ringkasan Aturan Tanda Perkalian:",
      thNum1: "Bilangan 1",
      thNum2: "Bilangan 2",
      thResult: "Hasil",
      tdPositive: "Positif (+)",
      tdNegative: "Negatif (-)",
      badgeEasy: "MUDAH",
      badgeMedium: "SEDANG",
      badgeHard: "SULIT",
      badgeBonus: "BONUS",
      ex1: "Contoh 1",
      ex2: "Contoh 2",
      ex3: "Contoh 3: Soal Cerita",
      ex4: "Contoh 4: Operasi Gabungan",
      exQLabel: "Hitunglah hasil perkalian berikut:",
      solutionLabel: "PEMBAHASAN:",
      ruleLabel: "Aturan:",
      rulePosNeg: "Positif x Negatif = Negatif",
      ruleNegPos: "Negatif x Positif = Negatif",
      ruleNegNeg: "Negatif x Negatif = Positif",
      answerLabel: "Jawaban:",
      step1: "Langkah 1:",
      step2: "Langkah 2:",
      ex2aS1: "Hitung yang dalam kurung dulu.",
      ex2aS2: "Kalikan hasilnya dengan 9.",
      ex2bS1: "Hitung penjumlahan dalam kurung.",
      ex2bS2: "Kalikan hasilnya dengan 12.",
      ex2cS1: "Hitung perkalian dalam kurung.",
      ex2cS2: "Kalikan hasilnya dengan -8. (Negatif x Negatif = Positif)",
      ex3Q: "Suhu udara di puncak sebuah gunung pada sore hari adalah 18\u00b0C. Setiap 2 jam, suhu turun 4\u00b0C. Tentukan suhu di puncak gunung tersebut setelah 10 jam!",
      ex3S1: "Tentukan berapa kali suhu turun dalam 10 jam.",
      ex3S2: "Hitung total penurunan suhu. Suhu turun artinya perubahan negatif!",
      ex3S3: "Hitung suhu akhir dengan menambahkan perubahan suhu ke suhu awal.",
      katexEx3Drops: "\\text{Jumlah penurunan} = \\frac{10}{2} = 5 \\text{ kali}",
      katexEx3Total: "\\text{Total penurunan} = 5 \\times (-4) = -20\\degree C",
      katexEx3Final: "\\text{Suhu akhir} = 18 + (-20) = 18 - 20 = -2\\degree C",
      ex3Answer: "Jadi, suhu di puncak gunung setelah 10 jam adalah",
      ex4QLabel: "Hitunglah:",
      ex4QAnd: "dan",
      prop1Title: "1. Sifat Komutatif (Pertukaran)",
      prop1Desc: "Urutan faktor dalam perkalian tidak mempengaruhi hasil. Menukar posisi kedua bilangan tidak mengubah hasilnya.",
      prop2Title: "2. Unsur Identitas Perkalian",
      prop2DescA: "Bilangan",
      prop2DescB: "adalah unsur identitas perkalian. Apapun bilangan yang dikalikan dengan 1, hasilnya adalah bilangan itu sendiri.",
      prop3Title: "3. Sifat Asosiatif (Pengelompokan)",
      prop3Desc: "Cara mengelompokkan tiga bilangan yang dikalikan tidak mempengaruhi hasil akhirnya.",
      exampleLabel: "Contoh:",
      prop4Title: "4. Sifat Tertutup",
      prop4Desc: "Hasil perkalian dua bilangan bulat selalu berupa bilangan bulat juga. Perkalian tidak pernah menghasilkan bilangan di luar himpunan bilangan bulat.",
      katexClosure: "\\text{Jika } a, b \\in \\mathbb{Z} \\text{, maka } a \\times b \\in \\mathbb{Z}",
      signRuleConcTitle: "Kesimpulan Aturan Tanda:",
      memoBold: "Cara mudah mengingat:",
      memoText: "Tanda sama \u2192 positif \u00a0|\u00a0 Tanda beda \u2192 negatif",
      propSummaryTitle: "Ringkasan Sifat-Sifat:",
      commLabel: "Komutatif:",
      identLabel: "Identitas:",
      assocLabel: "Asosiatif:",
      closureLabel: "Tertutup:",
      closureDesc: "Hasil perkalian bilangan bulat selalu bilangan bulat",
      tipsSectionTitle: "Tips Cepat Mengerjakan Soal:",
      tip1Bold: "Hitung nilai mutlaknya dulu",
      tip1Body: ", baru tentukan tandanya. Misalnya \u00a0\u22126 \u00d7 \u22127\u00a0: nilai mutlak = 42, tanda: (\u2212)\u00d7(\u2212) = (+), jadi hasilnya 42.",
      tip2Bold: "Kerjakan kurung terdalam dahulu",
      tip2Body: "pada perkalian bertingkat, baru lanjutkan ke luar.",
      tip3Bold: "Hitung jumlah tanda negatif",
      tip3Body: ": genap \u2192 hasil positif, ganjil \u2192 hasil negatif. Contoh: (\u22121)\u00d7(\u22122)\u00d7(\u22123) = \u22126 (3 tanda negatif = ganjil \u2192 negatif).",
      tip4Bold: "Gunakan sifat komutatif",
      tip4Body: "untuk mempermudah perhitungan. Susun ulang urutan faktor agar lebih mudah dikalikan.",
      summaryTitle: "\u00d7\ufe0f RANGKUMAN LENGKAP",
      summarySubtitle: "Perkalian Bilangan Bulat \u2014 Kelas 7",
      sum1Title: "Aturan Tanda Perkalian \u2014 Hafal Ini!",
      quickFormulaLabel: "\ud83d\udd11 Rumus Cepat:",
      qfSameWord: "Tanda",
      qfSame: "SAMA",
      qfPosResult: "\u2192 hasil",
      qfPos: "POSITIF",
      qfDiffSep: "\u00a0|\u00a0 Tanda",
      qfDiff: "BERBEDA",
      qfNegResult: "\u2192 hasil",
      qfNeg: "NEGATIF",
      sum2Title: "Sifat-Sifat Perkalian Bilangan Bulat",
      sum3Title: "Tips & Trik Jitu Perkalian",
      trickSameSign: "Tanda sama = positif, tanda beda = negatif",
      trickSameSignDetail: "Ini adalah satu-satunya aturan tanda yang perlu kamu hafal. Semua variasi kasus tercakup oleh aturan sederhana ini!",
      trickCountNeg: "Hitung tanda negatif dalam perkalian berantai",
      trickCountNegDetail: "Jumlah tanda negatif genap \u2192 hasil positif. Jumlah ganjil \u2192 hasil negatif. Contoh: (\u22122)\u00d7(\u22123)\u00d7(\u22124) = 3 negatif (ganjil) \u2192 hasil negatif.",
      trickDistrib: "Pecah perkalian besar dengan distributif",
      trickDistribDetail: "Hitung 7 \u00d7 (\u221218) dengan cara 7 \u00d7 (\u221220 + 2) = 7\u00d7(\u221220) + 7\u00d72 = \u2212140 + 14 = \u2212126. Lebih mudah!",
      trickVerify: "Cek dengan perkalian terbalik",
      trickVerifyDetail: "Jika a \u00d7 b = c, maka c \u00f7 b harus = a. Gunakan ini untuk verifikasi jawaban perkalianmu.",
      conclusionFinal: "KESIMPULAN",
      conclusionBody: "Perkalian bilangan bulat hanya punya",
      conclusionBodyB: "satu aturan emas",
      conclusionBodyC: ": tanda sama menghasilkan positif, tanda berbeda menghasilkan negatif. Dengan sifat",
      conclusionBodyD: "komutatif, asosiatif, dan distributif",
      conclusionBodyE: ", perkalian bilangan bulat sebesar apapun bisa diselesaikan dengan cepat dan sistematis!",
      tags: ["Tanda Sama = +", "Tanda Beda = \u2212", "Genap Negatif = +", "Komutatif", "Distributif"],
      nextLabel: "\ud83d\ude80 Selanjutnya: Pembagian Bilangan Bulat!",
      prevBtn: "\u2190 Pengurangan",
      backBtn: "Kembali ke Menu",
      propKomutatif: "Komutatif",
      propAsosiatif: "Asosiatif",
      propDistributif: "Distributif",
      propIdentitas: "Identitas",
      propNol: "Nol",
    },
    en: {
      title: "MULTIPLICATION OF INTEGERS",
      subtitle: "Grade 7 - Integers - Mathematics",
      svgPosPos: "Each factor +1 \u2192 result rises +3  \u2234 (+) \u00d7 (+) = (+) \u2713",
      svgPosNeg: "Each factor +1 \u2192 result falls \u22123  \u2234 (+) \u00d7 (\u2212) = (\u2212) \u2713",
      secIntroTitle: "Understanding Multiplication",
      secPosPosTitle: "Positive \u00d7 Positive = Positive",
      secPosNegTitle: "Positive \u00d7 Negative = Negative",
      secNegPosTitle: "Negative \u00d7 Positive = Negative",
      secNolSatuTitle: "Multiplication by 0 and 1",
      secContohTitle: "Worked Examples",
      secSifatTitle: "Properties of Integer Multiplication",
      secKesimpulanTitle: "Conclusion & Tips for Integer Multiplication",
      introP: "Before diving into integer multiplication, let's recall the meaning of multiplication you've already learned.",
      introBold: "Multiplication is repeated addition!",
      basicConceptTitle: "Basic Concept of Multiplication:",
      desc2x3: "means",
      desc2x3Bold: "two groups of three",
      desc4x5Bold: "four groups of five",
      rememberTitle: "Remember!",
      rememberBody: "means",
      rememberBody2: "added",
      rememberBody3: "times, NOT the other way around! So",
      rememberBody4: "not",
      posPosIntro: "This is the easiest case and one you already know from primary school. Since multiplication is",
      posPosIntroBold: "repeated addition",
      posPosIntroC: ", the product of two positive numbers is always positive.",
      posPosPatternTitle: "Observe the pattern (multiplying by 3):",
      posPosG1: "(one group of 3)",
      posPosG2: "(two groups of 3)",
      posPosG3: "(three groups of 3)",
      posPosG4: "(four groups of 3)",
      conclusionLabel: "Conclusion:",
      katexPosPos: "\\text{Positive} \\times \\text{Positive} = \\textbf{Positive}",
      logicTitle: "Simple Logic:",
      posPosLogic: "If you have",
      posPosLogic2: "groups each containing",
      posPosLogic3: "objects, the total is always",
      posPosLogic4: "objects \u2014 never negative!",
      posNegIntro: "Using the concept of repeated addition, we can calculate the product of a positive and a negative number:",
      posNegPatternTitle: "Observe the pattern:",
      posNegG1: "(one group of -3)",
      posNegG2: "(two groups of -3)",
      posNegG3: "(three groups of -3)",
      posNegG4: "(four groups of -3)",
      katexPosNeg: "\\text{Positive} \\times \\text{Negative} = \\textbf{Negative}",
      negPosIntro: "What happens when a",
      negPosIntroB: "negative",
      negPosIntroC: "number is multiplied by a",
      negPosIntroD: "positive",
      negPosIntroE: "number? Observe the pattern below \u2014 each time the first factor decreases by 1 (becoming negative), the result keeps decreasing!",
      negPosPatternLabel: "(\u2212) \u00d7 (+) \u2014 decreasing pattern:",
      katexNegPos: "\\text{Negative} \\times \\text{Positive} = \\textbf{Negative}",
      negNegTitle: "Negative \u00d7 Negative = Positive",
      negNegDesc: "Follow the arcs of",
      negNegDescB: "downward \u2014 each time the first factor decreases by 1 (becoming negative), the result",
      negNegDescC: "rises and becomes positive",
      negNegDescD: "! Dim arcs = initial pattern, bright arcs = negative \u00d7 negative region.",
      katexNegNeg: "\\text{Negative} \\times \\text{Negative} = \\textbf{Positive}",
      easyMemoBold: "Easy Way to Remember:",
      easyMemoText: "Think of a negative sign as \"reversing direction\". One negative reverses to the negative direction, but two negatives reverse twice and return to the positive direction!",
      mulBy0Title: "Multiplication by 0:",
      mulBy0Desc: "Any number multiplied by 0 always gives 0. The logic? If you have 0 groups of something, there is nothing at all!",
      mulBy1Title: "Multiplication by 1 (Identity Element):",
      mulBy1DescA: "Any number multiplied by 1 gives that number itself. The number 1 is called the",
      identityTerm: "identity element",
      mulBy1DescB: "for multiplication.",
      signRuleSummaryTitle: "Multiplication Sign Rules \u2014 Summary:",
      thNum1: "Number 1",
      thNum2: "Number 2",
      thResult: "Result",
      tdPositive: "Positive (+)",
      tdNegative: "Negative (-)",
      badgeEasy: "Easy",
      badgeMedium: "Medium",
      badgeHard: "Hard",
      badgeBonus: "BONUS",
      ex1: "Example 1",
      ex2: "Example 2",
      ex3: "Example 3: Word Problem",
      ex4: "Example 4: Combined Operations",
      exQLabel: "Calculate the following products:",
      solutionLabel: "SOLUTION:",
      ruleLabel: "Rule:",
      rulePosNeg: "Positive \u00d7 Negative = Negative",
      ruleNegPos: "Negative \u00d7 Positive = Negative",
      ruleNegNeg: "Negative \u00d7 Negative = Positive",
      answerLabel: "Answer:",
      step1: "Step 1:",
      step2: "Step 2:",
      ex2aS1: "Calculate the bracket first.",
      ex2aS2: "Multiply the result by 9.",
      ex2bS1: "Calculate the addition inside the bracket.",
      ex2bS2: "Multiply the result by 12.",
      ex2cS1: "Calculate the multiplication inside the bracket.",
      ex2cS2: "Multiply the result by \u22128. (Negative \u00d7 Negative = Positive)",
      ex3Q: "The temperature at a mountain summit in the afternoon is 18\u00b0C. Every 2 hours the temperature drops 4\u00b0C. Find the temperature at the summit after 10 hours!",
      ex3S1: "Find how many times the temperature drops in 10 hours.",
      ex3S2: "Calculate the total temperature drop. A drop means a negative change!",
      ex3S3: "Calculate the final temperature by adding the change to the initial temperature.",
      katexEx3Drops: "\\text{Number of drops} = \\frac{10}{2} = 5 \\text{ times}",
      katexEx3Total: "\\text{Total drop} = 5 \\times (-4) = -20\\degree C",
      katexEx3Final: "\\text{Final temperature} = 18 + (-20) = 18 - 20 = -2\\degree C",
      ex3Answer: "Therefore, the mountain temperature after 10 hours is",
      ex4QLabel: "Calculate:",
      ex4QAnd: "and",
      prop1Title: "1. Commutative Property",
      prop1Desc: "The order of factors in multiplication does not affect the result. Swapping the positions of the two numbers does not change the product.",
      prop2Title: "2. Multiplicative Identity",
      prop2DescA: "The number",
      prop2DescB: "is the multiplicative identity. Any number multiplied by 1 gives that number itself.",
      prop3Title: "3. Associative Property",
      prop3Desc: "The way three numbers are grouped for multiplication does not affect the final result.",
      exampleLabel: "Example:",
      prop4Title: "4. Closure Property",
      prop4Desc: "The product of two integers is always an integer. Multiplication never produces a number outside the set of integers.",
      katexClosure: "\\text{If } a, b \\in \\mathbb{Z} \\text{, then } a \\times b \\in \\mathbb{Z}",
      signRuleConcTitle: "Sign Rule Summary:",
      memoBold: "Easy way to remember:",
      memoText: "Same sign \u2192 positive \u00a0|\u00a0 Different signs \u2192 negative",
      propSummaryTitle: "Properties Summary:",
      commLabel: "Commutative:",
      identLabel: "Identity:",
      assocLabel: "Associative:",
      closureLabel: "Closure:",
      closureDesc: "The product of integers is always an integer",
      tipsSectionTitle: "Quick Problem-Solving Tips:",
      tip1Bold: "Calculate the absolute value first",
      tip1Body: ", then determine the sign. For example \u00a0(\u22126) \u00d7 (\u22127)\u00a0: absolute value = 42, sign: (\u2212)\u00d7(\u2212) = (+), so the answer is 42.",
      tip2Bold: "Work out the innermost bracket first",
      tip2Body: "in chained multiplication, then work outward.",
      tip3Bold: "Count the number of negative signs",
      tip3Body: ": even \u2192 positive result, odd \u2192 negative result. Example: (\u22121)\u00d7(\u22122)\u00d7(\u22123) = \u22126 (3 negative signs = odd \u2192 negative).",
      tip4Bold: "Use the commutative property",
      tip4Body: "to simplify calculations. Rearrange the order of factors for easier multiplication.",
      summaryTitle: "\u00d7\ufe0f COMPLETE SUMMARY",
      summarySubtitle: "Integer Multiplication \u2014 Grade 7",
      sum1Title: "Multiplication Sign Rules \u2014 Memorise These!",
      quickFormulaLabel: "\ud83d\udd11 Quick Formula:",
      qfSameWord: "Sign",
      qfSame: "SAME",
      qfPosResult: "\u2192 result",
      qfPos: "POSITIVE",
      qfDiffSep: "\u00a0|\u00a0 Sign",
      qfDiff: "DIFFERENT",
      qfNegResult: "\u2192 result",
      qfNeg: "NEGATIVE",
      sum2Title: "Properties of Integer Multiplication",
      sum3Title: "Smart Tips & Tricks for Multiplication",
      trickSameSign: "Same sign = positive, different signs = negative",
      trickSameSignDetail: "This is the only sign rule you need to memorise. All possible cases are covered by this one simple rule!",
      trickCountNeg: "Count negative signs in chained multiplication",
      trickCountNegDetail: "Even number of negative signs \u2192 positive result. Odd number \u2192 negative result. Example: (\u22122)\u00d7(\u22123)\u00d7(\u22124) = 3 negatives (odd) \u2192 negative result.",
      trickDistrib: "Break large products using the distributive property",
      trickDistribDetail: "Calculate 7 \u00d7 (\u221218) as 7 \u00d7 (\u221220 + 2) = 7\u00d7(\u221220) + 7\u00d72 = \u2212140 + 14 = \u2212126. Much easier!",
      trickVerify: "Verify with reverse multiplication",
      trickVerifyDetail: "If a \u00d7 b = c, then c \u00f7 b must equal a. Use this to check your multiplication answers.",
      conclusionFinal: "CONCLUSION",
      conclusionBody: "Integer multiplication has only",
      conclusionBodyB: "one golden rule",
      conclusionBodyC: ": same signs give a positive result, different signs give a negative result. Using the",
      conclusionBodyD: "commutative, associative, and distributive properties",
      conclusionBodyE: ", any integer multiplication can be solved quickly and systematically!",
      tags: ["Same Sign = +", "Different Signs = \u2212", "Even Negatives = +", "Commutative", "Distributive"],
      nextLabel: "\ud83d\ude80 Next: Division of Integers!",
      prevBtn: "\u2190 Subtraction",
      backBtn: "Back to Menu",
      propKomutatif: "Commutative",
      propAsosiatif: "Associative",
      propDistributif: "Distributive",
      propIdentitas: "Identity",
      propNol: "Zero",
    },
    ja: {
      title: "\u6574\u6570\u306e\u4e57\u6cd5",
      subtitle: "\u4e2d\u5b661\u5e74 - \u6574\u6570 - \u6570\u5b66",
      svgPosPos: "\u5404\u56e0\u6570 +1 \u2192 \u7a4d\u306f +3 \u305a\u3064\u5897\u52a0  \u2234 (+) \u00d7 (+) = (+) \u2713",
      svgPosNeg: "\u5404\u56e0\u6570 +1 \u2192 \u7a4d\u306f \u22123 \u305a\u3064\u6e1b\u5c11  \u2234 (+) \u00d7 (\u2212) = (\u2212) \u2713",
      secIntroTitle: "\u4e57\u6cd5\u306e\u610f\u5473\u3092\u7406\u89e3\u3059\u308b",
      secPosPosTitle: "\u6b63 \u00d7 \u6b63 = \u6b63",
      secPosNegTitle: "\u6b63 \u00d7 \u8ca0 = \u8ca0",
      secNegPosTitle: "\u8ca0 \u00d7 \u6b63 = \u8ca0",
      secNolSatuTitle: "0\u3068 1 \u306e\u4e57\u6cd5",
      secContohTitle: "\u4f8b\u984c\u3068\u89e3\u8aac",
      secSifatTitle: "\u6574\u6570\u306e\u4e57\u6cd5\u306e\u6027\u8cea",
      secKesimpulanTitle: "\u7d50\u8ad6\u3068\u6574\u6570\u4e57\u6cd5\u306e\u30b3\u30c4",
      introP: "\u6574\u6570\u306e\u4e57\u6cd5\u306b\u5165\u308b\u524d\u306b\u3001\u3053\u308c\u307e\u3067\u5b66\u3093\u3060\u4e57\u6cd5\u306e\u610f\u5473\u3092\u632f\u308a\u8fd4\u308a\u307e\u3057\u3087\u3046\u3002",
      introBold: "\u4e57\u6cd5\u306f\u7e70\u308a\u8fd4\u3057\u306e\u52a0\u6cd5\u3067\u3059\uff01",
      basicConceptTitle: "\u4e57\u6cd5\u306e\u57fa\u672c\u6982\u5ff5\uff1a",
      desc2x3: "\u306f",
      desc2x3Bold: "3 \u306e 2 \u3064\u5206",
      desc4x5Bold: "5 \u306e 4 \u3064\u5206",
      rememberTitle: "\u899a\u3048\u3088\u3046\uff01",
      rememberBody: "\u306f",
      rememberBody2: "\u3092",
      rememberBody3: "\u56de\u52a0\u3048\u308b\u3053\u3068\u3092\u610f\u5473\u3057\u307e\u3059\u3002\u9006\u3067\u306f\u3042\u308a\u307e\u305b\u3093\uff01\u3064\u307e\u308a",
      rememberBody4: "\u3067\u306f\u306a\u304f",
      posPosIntro: "\u3053\u308c\u306f\u6700\u3082\u7c21\u5358\u306a\u30b1\u30fc\u30b9\u3067\u3001\u5c0f\u5b66\u6821\u3067\u3059\u3067\u306b\u77e5\u3063\u3066\u3044\u307e\u3059\u3002\u4e57\u6cd5\u306f",
      posPosIntroBold: "\u7e70\u308a\u8fd4\u3057\u306e\u52a0\u6cd5",
      posPosIntroC: "\u306a\u306e\u3067\u3001\u6b63 \u00d7 \u6b63 \u306e\u7a4d\u306f\u5fc5\u305a\u6b63\u306b\u306a\u308a\u307e\u3059\u3002",
      posPosPatternTitle: "\u30d1\u30bf\u30fc\u30f3\u3092\u78ba\u8a8d\u3057\u3088\u3046\uff083 \u3092\u639b\u3051\u308b\uff09\uff1a",
      posPosG1: "\uff083 \u304c 1 \u3064\uff09",
      posPosG2: "\uff083 \u304c 2 \u3064\uff09",
      posPosG3: "\uff083 \u304c 3 \u3064\uff09",
      posPosG4: "\uff083 \u304c 4 \u3064\uff09",
      conclusionLabel: "\u7d50\u8ad6\uff1a",
      katexPosPos: "\\text{\u6b63} \\times \\text{\u6b63} = \\textbf{\u6b63}",
      logicTitle: "\u7c21\u5358\u306a\u8ad6\u7406\uff1a",
      posPosLogic: "",
      posPosLogic2: "\u500b\u306e\u30b0\u30eb\u30fc\u30d7\u306b\u305d\u308c\u305e\u308c",
      posPosLogic3: "\u500b\u306e\u30e2\u30ce\u304c\u3042\u308c\u3070\u3001\u5408\u8a08\u306f\u5e38\u306b",
      posPosLogic4: "\u500b \u2014 \u6c7a\u3057\u3066\u8ca0\u306b\u306a\u308a\u307e\u305b\u3093\uff01",
      posNegIntro: "\u7e70\u308a\u8fd4\u3057\u306e\u52a0\u6cd5\u306e\u6982\u5ff5\u3092\u4f7f\u3063\u3066\u3001\u6b63\u6570\u3068\u8ca0\u6570\u306e\u7a4d\u3092\u8a08\u7b97\u3067\u304d\u307e\u3059\uff1a",
      posNegPatternTitle: "\u30d1\u30bf\u30fc\u30f3\u3092\u78ba\u8a8d\u3057\u3088\u3046\uff1a",
      posNegG1: "\uff08-3 \u304c 1 \u3064\uff09",
      posNegG2: "\uff08-3 \u304c 2 \u3064\uff09",
      posNegG3: "\uff08-3 \u304c 3 \u3064\uff09",
      posNegG4: "\uff08-3 \u304c 4 \u3064\uff09",
      katexPosNeg: "\\text{\u6b63} \\times \\text{\u8ca0} = \\textbf{\u8ca0}",
      negPosIntro: "",
      negPosIntroB: "\u8ca0",
      negPosIntroC: "\u306e\u6570\u306b",
      negPosIntroD: "\u6b63",
      negPosIntroE: "\u306e\u6570\u3092\u639b\u3051\u308b\u3068\u3069\u3046\u306a\u308b\u3067\u3057\u3087\u3046\u304b\uff1f\u6b21\u306e\u30d1\u30bf\u30fc\u30f3\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044 \u2014 \u7b2c 1 \u56e0\u6570\u304c 1 \u6e1b\u308b\uff08\u8ca0\u306b\u306a\u308b\uff09\u305f\u3073\u306b\u7d50\u679c\u3082\u6e1b\u308a\u7d9a\u3051\u307e\u3059\uff01",
      negPosPatternLabel: "(\u2212) \u00d7 (+) \u2014 \u6e1b\u5c11\u30d1\u30bf\u30fc\u30f3\uff1a",
      katexNegPos: "\\text{\u8ca0} \\times \\text{\u6b63} = \\textbf{\u8ca0}",
      negNegTitle: "\u8ca0 \u00d7 \u8ca0 = \u6b63",
      negNegDesc: "",
      negNegDescB: "\u306e\u30d6\u30b8\u3092\u4e0b\u306b\u305f\u3069\u308b\u3068 \u2014 \u7b2c 1 \u56e0\u6570\u304c 1 \u6e1b\u3063\u3066\u8ca0\u306b\u306a\u308b\u305f\u3073\u306b\u3001\u7a4d\u306f",
      negNegDescC: "\u6b63\u306b\u306a\u308a\u307e\u3059",
      negNegDescD: "\uff01\u8584\u3044\u5f27 = \u521d\u671f\u30d1\u30bf\u30fc\u30f3\u3001\u660e\u308b\u3044\u5f27 = \u8ca0 \u00d7 \u8ca0 \u306e\u9818\u57df\u3002",
      katexNegNeg: "\\text{\u8ca0} \\times \\text{\u8ca0} = \\textbf{\u6b63}",
      easyMemoBold: "\u899a\u3048\u65b9\uff1a",
      easyMemoText: "\u8ca0\u306e\u7b26\u53f7\u3092\u300c\u65b9\u5411\u3092\u9006\u8ee2\u3059\u308b\u300d\u3068\u8003\u3048\u307e\u3057\u3087\u3046\u3002\u8ca0\u304c 1 \u3064\u3042\u308b\u3068\u8ca0\u65b9\u5411\u306b\u9006\u8ee2\u3057\u307e\u3059\u304c\u3001\u8ca0\u304c 2 \u3064\u3042\u308b\u3068 2 \u56de\u9006\u8ee2\u3057\u3066\u6b63\u306e\u65b9\u5411\u306b\u623b\u308a\u307e\u3059\uff01",
      mulBy0Title: "0 \u3092\u639b\u3051\u308b\uff1a",
      mulBy0Desc: "\u3069\u3093\u306a\u6570\u306b 0 \u3092\u639b\u3051\u3066\u3082\u7d50\u679c\u306f\u5e38\u306b 0 \u3067\u3059\u3002\u8ad6\u7406\u306f\uff1f0 \u500b\u306e\u30b0\u30eb\u30fc\u30d7\u304c\u3042\u308c\u3070\u3001\u4f55\u3082\u306a\u3044\u306e\u3067\u3059\uff01",
      mulBy1Title: "1 \u3092\u639b\u3051\u308b\uff08\u5358\u4f4d\u5143\uff09\uff1a",
      mulBy1DescA: "\u3069\u3093\u306a\u6570\u306b 1 \u3092\u639b\u3051\u3066\u3082\u305d\u306e\u6570\u81ea\u8eab\u306b\u306a\u308a\u307e\u3059\u3002\u6570 1 \u306f\u4e57\u6cd5\u306e",
      identityTerm: "\u5358\u4f4d\u5143",
      mulBy1DescB: "\u3068\u547c\u3070\u308c\u307e\u3059\u3002",
      signRuleSummaryTitle: "\u4e57\u6cd5\u306e\u7b26\u53f7\u898f\u5247\u307e\u3068\u3081\uff1a",
      thNum1: "\u6570 1",
      thNum2: "\u6570 2",
      thResult: "\u7d50\u679c",
      tdPositive: "\u6b63 (+)",
      tdNegative: "\u8ca0 (-)",
      badgeEasy: "\u57fa\u672c",
      badgeMedium: "\u6a19\u6e96",
      badgeHard: "\u767a\u5c55",
      badgeBonus: "\u30dc\u30fc\u30ca\u30b9",
      ex1: "\u4f8b\u984c 1",
      ex2: "\u4f8b\u984c 2",
      ex3: "\u4f8b\u984c 3\uff1a\u6587\u7ae0\u984c",
      ex4: "\u4f8b\u984c 4\uff1a\u8907\u5408\u6f14\u7b97",
      exQLabel: "\u6b21\u306e\u7a4d\u3092\u8a08\u7b97\u305b\u3088\uff1a",
      solutionLabel: "\u89e3\u8aac\uff1a",
      ruleLabel: "\u898f\u5247\uff1a",
      rulePosNeg: "\u6b63 \u00d7 \u8ca0 = \u8ca0",
      ruleNegPos: "\u8ca0 \u00d7 \u6b63 = \u8ca0",
      ruleNegNeg: "\u8ca0 \u00d7 \u8ca0 = \u6b63",
      answerLabel: "\u7b54\u3048\uff1a",
      step1: "\u624b\u9806 1\uff1a",
      step2: "\u624b\u9806 2\uff1a",
      ex2aS1: "\u307e\u305a\u62ec\u5f27\u306e\u4e2d\u3092\u8a08\u7b97\u3059\u308b\u3002",
      ex2aS2: "\u7d50\u679c\u306b 9 \u3092\u639b\u3051\u308b\u3002",
      ex2bS1: "\u62ec\u5f27\u5185\u306e\u52a0\u6cd5\u3092\u8a08\u7b97\u3059\u308b\u3002",
      ex2bS2: "\u7d50\u679c\u306b 12 \u3092\u639b\u3051\u308b\u3002",
      ex2cS1: "\u62ec\u5f27\u5185\u306e\u4e57\u6cd5\u3092\u8a08\u7b97\u3059\u308b\u3002",
      ex2cS2: "\u7d50\u679c\u306b \u22128 \u3092\u639b\u3051\u308b\u3002\uff08\u8ca0 \u00d7 \u8ca0 = \u6b63\uff09",
      ex3Q: "\u3042\u308b\u5c71\u306e\u5c71\u9802\u306e\u5348\u5f8c\u306e\u6c17\u6e29\u306f 18\u00b0C \u3067\u3059\u30022 \u6642\u9593\u3054\u3068\u306b\u6c17\u6e29\u304c 4\u00b0C \u4e0b\u304c\u308a\u307e\u3059\u300010 \u6642\u9593\u5f8c\u306e\u5c71\u9802\u306e\u6c17\u6e29\u3092\u6c42\u3081\u3088\uff01",
      ex3S1: "10 \u6642\u9593\u3067\u6c17\u6e29\u304c\u4f55\u56de\u4e0b\u304c\u308b\u304b\u6c42\u3081\u308b\u3002",
      ex3S2: "\u6c17\u6e29\u306e\u5408\u8a08\u4e0b\u964d\u91cf\u3092\u8a08\u7b97\u3059\u308b\u3002\u4e0b\u964d\u306f\u8ca0\u306e\u5909\u5316\u3092\u610f\u5473\u3059\u308b\uff01",
      ex3S3: "\u521d\u671f\u6c17\u6e29\u306b\u5909\u5316\u91cf\u3092\u52a0\u3048\u3066\u6700\u7d42\u6c17\u6e29\u3092\u8a08\u7b97\u3059\u308b\u3002",
      katexEx3Drops: "\\text{\u4e0b\u964d\u56de\u6570} = \\frac{10}{2} = 5 \\text{ \u56de}",
      katexEx3Total: "\\text{\u5408\u8a08\u4e0b\u964d\u91cf} = 5 \\times (-4) = -20\\degree C",
      katexEx3Final: "\\text{\u6700\u7d42\u6c17\u6e29} = 18 + (-20) = 18 - 20 = -2\\degree C",
      ex3Answer: "\u3057\u305f\u304c\u3063\u3066\u300110 \u6642\u9593\u5f8c\u306e\u5c71\u9802\u306e\u6c17\u6e29\u306f",
      ex4QLabel: "\u8a08\u7b97\u305b\u3088\uff1a",
      ex4QAnd: "\u3068",
      prop1Title: "1. \u4ea4\u63db\u6cd5\u5247",
      prop1Desc: "\u4e57\u6cd5\u306e\u56e0\u6570\u306e\u9806\u5e8f\u306f\u7d50\u679c\u306b\u5f71\u97ff\u3057\u307e\u305b\u3093\u30022 \u3064\u306e\u6570\u306e\u4f4d\u7f6e\u3092\u5165\u308c\u66ff\u3048\u3066\u3082\u7a4d\u306f\u5909\u308f\u308a\u307e\u305b\u3093\u3002",
      prop2Title: "2. \u4e57\u6cd5\u306e\u5358\u4f4d\u5143",
      prop2DescA: "\u6570",
      prop2DescB: "\u306f\u4e57\u6cd5\u306e\u5358\u4f4d\u5143\u3067\u3059\u3002\u3069\u3093\u306a\u6570\u306b 1 \u3092\u639b\u3051\u3066\u3082\u305d\u306e\u6570\u81ea\u8eab\u306b\u306a\u308a\u307e\u3059\u3002",
      prop3Title: "3. \u7d50\u5408\u6cd5\u5247",
      prop3Desc: "3 \u3064\u306e\u6570\u306e\u639b\u3051\u65b9\u306e\u30b0\u30eb\u30fc\u30d7\u5316\u306e\u4ed5\u65b9\u306f\u6700\u7d42\u7d50\u679c\u306b\u5f71\u97ff\u3057\u307e\u305b\u3093\u3002",
      exampleLabel: "\u4f8b\uff1a",
      prop4Title: "4. \u9589\u5305\u6027",
      prop4Desc: "2 \u3064\u306e\u6574\u6570\u306e\u7a4d\u306f\u5e38\u306b\u6574\u6570\u3067\u3059\u3002\u4e57\u6cd5\u306b\u3088\u3063\u3066\u6574\u6570\u306e\u96c6\u5408\u306e\u5916\u306e\u6570\u304c\u751f\u3058\u308b\u3053\u3068\u306f\u3042\u308a\u307e\u305b\u3093\u3002",
      katexClosure: "a, b \\in \\mathbb{Z} \\text{ \u306a\u3089\u3070 } a \\times b \\in \\mathbb{Z}",
      signRuleConcTitle: "\u7b26\u53f7\u898f\u5247\u307e\u3068\u3081\uff1a",
      memoBold: "\u899a\u3048\u65b9\uff1a",
      memoText: "\u7b26\u53f7\u304c\u540c\u3058 \u2192 \u6b63 \u00a0|\u00a0 \u7b26\u53f7\u304c\u9055\u3046 \u2192 \u8ca0",
      propSummaryTitle: "\u6027\u8cea\u307e\u3068\u3081\uff1a",
      commLabel: "\u4ea4\u63db\u6cd5\u5247\uff1a",
      identLabel: "\u5358\u4f4d\u5143\uff1a",
      assocLabel: "\u7d50\u5408\u6cd5\u5247\uff1a",
      closureLabel: "\u9589\u5305\u6027\uff1a",
      closureDesc: "\u6574\u6570\u306e\u7a4d\u306f\u5e38\u306b\u6574\u6570",
      tipsSectionTitle: "\u554f\u984c\u89e3\u6cd5\u306e\u30af\u30a4\u30c3\u30af\u30d2\u30f3\u30c8\uff1a",
      tip1Bold: "\u307e\u305a\u7d76\u5bfe\u5024\u3092\u8a08\u7b97\u3059\u308b",
      tip1Body: "\u3001\u305d\u308c\u304b\u3089\u7b26\u53f7\u3092\u6c7a\u3081\u308b\u3002\u4f8b\uff1a(\u22126) \u00d7 (\u22127)\uff1a\u7d76\u5bfe\u5024 = 42\u3001\u7b26\u53f7\uff1a(\u2212)\u00d7(\u2212) = (+)\u3001\u3088\u3063\u3066 42\u3002",
      tip2Bold: "\u6700\u3082\u5185\u5074\u306e\u62ec\u5f27\u304b\u3089\u8a08\u7b97\u3059\u308b",
      tip2Body: "\u9023\u9396\u4e57\u6cd5\u3067\u306f\u3001\u5916\u5074\u306b\u5411\u304b\u3063\u3066\u8a08\u7b97\u3092\u7d9a\u3051\u308b\u3002",
      tip3Bold: "\u8ca0\u306e\u7b26\u53f7\u306e\u6570\u3092\u6570\u3048\u308b",
      tip3Body: "\uff1a\u5076\u6570 \u2192 \u6b63\u3001\u5947\u6570 \u2192 \u8ca0\u3002\u4f8b\uff1a(\u22121)\u00d7(\u22122)\u00d7(\u22123) = \u22126\uff083\u500b\u306e\u8ca0 = \u5947\u6570 \u2192 \u8ca0\uff09\u3002",
      tip4Bold: "\u4ea4\u63db\u6cd5\u5247\u3092\u5229\u7528\u3059\u308b",
      tip4Body: "\u8a08\u7b97\u3092\u7c21\u7d75\u5316\u3059\u308b\u305f\u3081\u306b\u3002\u56e0\u6570\u306e\u9806\u5e8f\u3092\u4e26\u3073\u66ff\u3048\u3066\u639b\u3051\u3084\u3059\u304f\u3059\u308b\u3002",
      summaryTitle: "\u00d7\ufe0f \u5b8c\u5168\u307e\u3068\u3081",
      summarySubtitle: "\u6574\u6570\u306e\u4e57\u6cd5 \u2014 \u4e2d\u5b661\u5e74",
      sum1Title: "\u4e57\u6cd5\u306e\u7b26\u53f7\u898f\u5247 \u2014 \u899a\u3048\u3088\u3046\uff01",
      quickFormulaLabel: "\ud83d\udd11 \u65e9\u898b\uff1a",
      qfSameWord: "\u7b26\u53f7\u304c",
      qfSame: "\u540c\u3058",
      qfPosResult: "\u2192 \u7d50\u679c\u306f",
      qfPos: "\u6b63",
      qfDiffSep: "\u00a0|\u00a0 \u7b26\u53f7\u304c",
      qfDiff: "\u9055\u3046",
      qfNegResult: "\u2192 \u7d50\u679c\u306f",
      qfNeg: "\u8ca0",
      sum2Title: "\u6574\u6570\u306e\u4e57\u6cd5\u306e\u6027\u8cea",
      sum3Title: "\u4e57\u6cd5\u306e\u30b9\u30de\u30fc\u30c8\u306a\u30d2\u30f3\u30c8\u3068\u30b3\u30c4",
      trickSameSign: "\u7b26\u53f7\u304c\u540c\u3058 = \u6b63\u3001\u7b26\u53f7\u304c\u9055\u3046 = \u8ca0",
      trickSameSignDetail: "\u899a\u3048\u308b\u5fc5\u8981\u304c\u3042\u308b\u7b26\u53f7\u306e\u898f\u5247\u306f\u3053\u306e 1 \u3064\u3060\u3051\u3067\u3059\u3002\u3059\u3079\u3066\u306e\u30b1\u30fc\u30b9\u304c\u3053\u306e\u7c21\u5358\u306a\u898f\u5247\u3067\u30ab\u30d0\u30fc\u3055\u308c\u307e\u3059\uff01",
      trickCountNeg: "\u9023\u9396\u4e57\u6cd5\u3067\u8ca0\u306e\u7b26\u53f7\u3092\u6570\u3048\u308b",
      trickCountNegDetail: "\u8ca0\u306e\u7b26\u53f7\u304c\u5076\u6570 \u2192 \u6b63\u3002\u5947\u6570 \u2192 \u8ca0\u3002\u4f8b\uff1a(\u22122)\u00d7(\u22123)\u00d7(\u22124) = 3 \u500b\u306e\u8ca0\uff08\u5947\u6570\uff09\u2192 \u8ca0\u3002",
      trickDistrib: "\u5206\u914d\u6cd5\u5247\u3067\u5927\u304d\u306a\u7a4d\u3092\u5206\u89e3\u3059\u308b",
      trickDistribDetail: "7 \u00d7 (\u221218) \u3092 7 \u00d7 (\u221220 + 2) = 7\u00d7(\u221220) + 7\u00d72 = \u2212140 + 14 = \u2212126 \u3068\u8a08\u7b97\u3002\u3082\u3063\u3068\u7c21\u5358\uff01",
      trickVerify: "\u9006\u7b97\u3067\u691c\u8a3c\u3059\u308b",
      trickVerifyDetail: "a \u00d7 b = c \u306a\u3089\u3070\u3001c \u00f7 b = a \u306e\u306f\u305a\u3002\u8a08\u7b97\u7d50\u679c\u306e\u691c\u8a3c\u306b\u4f7f\u3044\u307e\u3057\u3087\u3046\u3002",
      conclusionFinal: "\u7d50\u8ad6",
      conclusionBody: "\u6574\u6570\u306e\u4e57\u6cd5\u306f",
      conclusionBodyB: "\u300c\u7b26\u53f7\u304c\u540c\u3058\u306a\u3089\u6b63\u3001\u9055\u3046\u306a\u3089\u8ca0\u300d\u3068\u3044\u3046",
      conclusionBodyC: "\u305f\u3063\u305f 1 \u3064\u306e\u9ec4\u91d1\u5247\u3057\u304b\u3042\u308a\u307e\u305b\u3093\u3002",
      conclusionBodyD: "\u4ea4\u63db\u30fb\u7d50\u5408\u30fb\u5206\u914d\u6cd5\u5247",
      conclusionBodyE: "\u3092\u4f7f\u3048\u3070\u3001\u3069\u3093\u306a\u5927\u304d\u306a\u6574\u6570\u306e\u4e57\u6cd5\u3082\u7d20\u65e9\u304f\u7cfb\u7d71\u7684\u306b\u89e3\u3051\u307e\u3059\uff01",
      tags: ["\u7b26\u53f7\u540c\u3058 = +", "\u7b26\u53f7\u9055\u3046 = \u2212", "\u8ca0\u5076\u6570\u500b = +", "\u4ea4\u63db\u6cd5\u5247", "\u5206\u914d\u6cd5\u5247"],
      nextLabel: "\ud83d\ude80 \u6b21\u3078\uff1a\u6574\u6570\u306e\u9664\u6cd5\uff01",
      prevBtn: "\u2190 \u6e1b\u6cd5",
      backBtn: "\u30e1\u30cb\u30e5\u30fc\u306b\u623b\u308b",
      propKomutatif: "\u4ea4\u63db\u6cd5\u5247",
      propAsosiatif: "\u7d50\u5408\u6cd5\u5247",
      propDistributif: "\u5206\u914d\u6cd5\u5247",
      propIdentitas: "\u5358\u4f4d\u5143",
      propNol: "\u96f6",
    },
  };

  const c = translations[language];

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden">
      <Starfield />
      <PageNavigation />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-xl md:text-2xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {c.title}
        </h1>
        <p className="text-white/50 text-xs text-center mb-6 font-body">
          {c.subtitle}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {/* Section: Pengantar */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("intro")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{c.secIntroTitle}</span>
              </div>
              {expandedSections.includes("intro") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("intro") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.introP} <strong className="text-primary">{c.introBold}</strong>
                </p>

                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">{c.basicConceptTitle}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1">
                        <InlineMath math="2 \times 3" /> {c.desc2x3} <strong>{c.desc2x3Bold}</strong>:
                      </p>
                      <BlockMath math="2 \times 3 = 3 + 3 = 6" />
                    </div>
                    <div className="bg-slate-900/50 rounded p-3">
                      <p className="text-white/70 text-xs mb-1">
                        <InlineMath math="4 \times 5" /> {c.desc2x3} <strong>{c.desc4x5Bold}</strong>:
                      </p>
                      <BlockMath math="4 \times 5 = 5 + 5 + 5 + 5 = 20" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-yellow-200 leading-relaxed">
                    <strong>{c.rememberTitle}</strong>{" "}
                    <InlineMath math="a \times b" /> {c.rememberBody}{" "}
                    <InlineMath math="b" /> {c.rememberBody2}{" "}
                    <InlineMath math="a" /> {c.rememberBody3}{" "}
                    <InlineMath math="2 \times 3 = 3 + 3" />, {c.rememberBody4}{" "}
                    <InlineMath math="2 + 2 + 2" />.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Positif × Positif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("positifPositif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                <span className="font-body font-semibold text-white">{c.secPosPosTitle}</span>
              </div>
              {expandedSections.includes("positifPositif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("positifPositif") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.posPosIntro} <strong className="text-primary">{c.posPosIntroBold}</strong>{c.posPosIntroC}
                </p>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-3">{c.posPosPatternTitle}</p>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="1 \times 3 = 3" /></span>
                      <span className="text-white/50 text-xs">{c.posPosG1}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="2 \times 3 = 3 + 3 = 6" /></span>
                      <span className="text-white/50 text-xs">{c.posPosG2}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="3 \times 3 = 3 + 3 + 3 = 9" /></span>
                      <span className="text-white/50 text-xs">{c.posPosG3}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="4 \times 3 = 3 + 3 + 3 + 3 = 12" /></span>
                      <span className="text-white/50 text-xs">{c.posPosG4}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="bg-slate-900/60 rounded-xl p-2 border border-green-500/20">
                    <PosTimesPosPatternSVG conclusionText={c.svgPosPos} />
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{c.conclusionLabel}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math={c.katexPosPos} />
                    <BlockMath math="a \times b = ab \quad (a, b > 0)" />
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>{c.logicTitle}</strong>{" "}
                    {language === "ja"
                      ? <>{c.posPosLogic2.replace("個の", "")} <InlineMath math="a" /> {c.posPosLogic2} <InlineMath math="b" /> {c.posPosLogic3} <InlineMath math="a \times b" /> {c.posPosLogic4}</>
                      : <>{c.posPosLogic} <InlineMath math="a" /> {c.posPosLogic2} <InlineMath math="b" /> {c.posPosLogic3} <InlineMath math="a \times b" /> {c.posPosLogic4}</>
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Positif × Negatif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("positifNegatif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="font-body font-semibold text-white">{c.secPosNegTitle}</span>
              </div>
              {expandedSections.includes("positifNegatif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("positifNegatif") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {c.posNegIntro}
                </p>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-3">{c.posNegPatternTitle}</p>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="1 \times (-3) = -3" /></span>
                      <span className="text-white/50 text-xs">{c.posNegG1}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="2 \times (-3) = (-3) + (-3) = -6" /></span>
                      <span className="text-white/50 text-xs">{c.posNegG2}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="3 \times (-3) = (-3) + (-3) + (-3) = -9" /></span>
                      <span className="text-white/50 text-xs">{c.posNegG3}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 flex items-center justify-between">
                      <span><InlineMath math="4 \times (-3) = (-3) + (-3) + (-3) + (-3) = -12" /></span>
                      <span className="text-white/50 text-xs">{c.posNegG4}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <div className="bg-slate-900/60 rounded-xl p-2 border border-orange-500/20">
                    <PosTimesNegPatternSVG conclusionText={c.svgPosNeg} />
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{c.conclusionLabel}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math={c.katexPosNeg} />
                    <BlockMath math="a \times (-b) = -ab" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Negatif × Positif + Negatif × Negatif */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("negatifNegatif")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">{c.secNegPosTitle}</span>
              </div>
              {expandedSections.includes("negatifNegatif") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("negatifNegatif") && (
              <div className="px-5 pb-5 space-y-4">
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === "ja" ? (
                    <><strong className="text-red-400">{c.negPosIntroB}</strong>{c.negPosIntroC}<strong className="text-white">{c.negPosIntroD}</strong>{c.negPosIntroE}</>
                  ) : (
                    <>{c.negPosIntro} <strong className="text-red-400">{c.negPosIntroB}</strong> {c.negPosIntroC} <strong className="text-white">{c.negPosIntroD}</strong>{c.negPosIntroE}</>
                  )}
                </p>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="font-body text-xs font-semibold text-red-300 mb-2">
                    {c.negPosPatternLabel}
                  </p>
                  <div className="bg-slate-900/60 rounded-xl p-2 border border-red-500/20">
                    <NegTimesPosPatternSVG />
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-2">{c.conclusionLabel}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math={c.katexNegPos} />
                    <BlockMath math="-a \times b = -ab" />
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <p className="font-body font-semibold text-white">{c.negNegTitle}</p>
                  </div>
                  <p className="font-body text-sm text-white/80">
                    {language === "ja" ? (
                      <><InlineMath math="-1 \times \ldots" />{c.negNegDescB} <strong className="text-yellow-300">{c.negNegDescC}</strong>{c.negNegDescD}</>
                    ) : (
                      <>{c.negNegDesc} <InlineMath math="-1 \times \ldots" /> {c.negNegDescB} <strong className="text-yellow-300">{c.negNegDescC}</strong>{c.negNegDescD}</>
                    )}
                  </p>
                  <div className="bg-slate-900/60 rounded-xl p-3 border border-yellow-500/20">
                    <NegTimesNegPatternSVG />
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{c.conclusionLabel}</p>
                  <div className="bg-slate-900/50 rounded p-3">
                    <BlockMath math={c.katexNegNeg} />
                    <BlockMath math="(-a) \times (-b) = ab" />
                  </div>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm text-cyan-200 leading-relaxed">
                    <strong>{c.easyMemoBold}</strong> {c.easyMemoText}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Perkalian dengan 0 dan 1 */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("nolSatu")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="font-body font-semibold text-white">{c.secNolSatuTitle}</span>
              </div>
              {expandedSections.includes("nolSatu") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("nolSatu") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-red-300 mb-3">{c.mulBy0Title}</p>
                  <p className="font-body text-sm text-white/80 mb-3">{c.mulBy0Desc}</p>
                  <div className="space-y-2">
                    <div className="bg-slate-900/50 rounded p-2"><InlineMath math="5 \times 0 = 0" /></div>
                    <div className="bg-slate-900/50 rounded p-2"><InlineMath math="0 \times (-7) = 0" /></div>
                    <div className="bg-slate-900/50 rounded p-2"><InlineMath math="(-100) \times 0 = 0" /></div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-3 mt-3">
                    <BlockMath math="a \times 0 = 0 \times a = 0" />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-3">{c.mulBy1Title}</p>
                  <p className="font-body text-sm text-white/80 mb-3">
                    {c.mulBy1DescA} <strong className="text-primary">{c.identityTerm}</strong> {c.mulBy1DescB}
                  </p>
                  <div className="space-y-2">
                    <div className="bg-slate-900/50 rounded p-2"><InlineMath math="8 \times 1 = 8" /></div>
                    <div className="bg-slate-900/50 rounded p-2"><InlineMath math="1 \times (-15) = -15" /></div>
                    <div className="bg-slate-900/50 rounded p-2"><InlineMath math="(-99) \times 1 = -99" /></div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-3 mt-3">
                    <BlockMath math="a \times 1 = 1 \times a = a" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/40 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-green-300 mb-3">{c.signRuleSummaryTitle}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="py-2 px-3 text-left text-white/70">{c.thNum1}</th>
                          <th className="py-2 px-3 text-center text-white/70">×</th>
                          <th className="py-2 px-3 text-left text-white/70">{c.thNum2}</th>
                          <th className="py-2 px-3 text-center text-white/70">=</th>
                          <th className="py-2 px-3 text-left text-white/70">{c.thResult}</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono">
                        <tr className="border-b border-white/10">
                          <td className="py-2 px-3 text-green-400">{c.tdPositive}</td>
                          <td className="py-2 px-3 text-center text-white/50">×</td>
                          <td className="py-2 px-3 text-green-400">{c.tdPositive}</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-green-400 font-bold">{c.tdPositive}</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 px-3 text-green-400">{c.tdPositive}</td>
                          <td className="py-2 px-3 text-center text-white/50">×</td>
                          <td className="py-2 px-3 text-red-400">{c.tdNegative}</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-red-400 font-bold">{c.tdNegative}</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 px-3 text-red-400">{c.tdNegative}</td>
                          <td className="py-2 px-3 text-center text-white/50">×</td>
                          <td className="py-2 px-3 text-green-400">{c.tdPositive}</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-red-400 font-bold">{c.tdNegative}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-red-400">{c.tdNegative}</td>
                          <td className="py-2 px-3 text-center text-white/50">×</td>
                          <td className="py-2 px-3 text-red-400">{c.tdNegative}</td>
                          <td className="py-2 px-3 text-center text-white/50">=</td>
                          <td className="py-2 px-3 text-green-400 font-bold">{c.tdPositive}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Contoh Soal */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("contoh")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-body font-semibold text-white">{c.secContohTitle}</span>
              </div>
              {expandedSections.includes("contoh") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("contoh") && (
              <div className="px-5 pb-5 space-y-6">
                {/* Contoh 1 */}
                <div className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{c.badgeEasy}</span>
                    <span className="font-body font-semibold text-white">{c.ex1}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">{c.exQLabel}</p>
                    <div className="space-y-1 ml-4">
                      <p className="text-white/80">a. <InlineMath math="6 \times (-10)" /></p>
                      <p className="text-white/80">b. <InlineMath math="-4 \times 7" /></p>
                      <p className="text-white/80">c. <InlineMath math="-8 \times (-12)" /></p>
                    </div>
                  </div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-green-400 mb-3">{c.solutionLabel}</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">a. <InlineMath math="6 \times (-10)" /></p>
                        <p className="mb-1"><strong>{c.ruleLabel}</strong> {c.rulePosNeg}</p>
                        <BlockMath math="6 \times (-10) = -(6 \times 10) = -60" />
                        <p className="text-primary font-semibold">{c.answerLabel} <InlineMath math="-60" /></p>
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">b. <InlineMath math="-4 \times 7" /></p>
                        <p className="mb-1"><strong>{c.ruleLabel}</strong> {c.ruleNegPos}</p>
                        <BlockMath math="-4 \times 7 = -(4 \times 7) = -28" />
                        <p className="text-primary font-semibold">{c.answerLabel} <InlineMath math="-28" /></p>
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">c. <InlineMath math="-8 \times (-12)" /></p>
                        <p className="mb-1"><strong>{c.ruleLabel}</strong> {c.ruleNegNeg}</p>
                        <BlockMath math="-8 \times (-12) = 8 \times 12 = 96" />
                        <p className="text-primary font-semibold">{c.answerLabel} <InlineMath math="96" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 2 */}
                <div className="border-l-4 border-yellow-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded">{c.badgeMedium}</span>
                    <span className="font-body font-semibold text-white">{c.ex2}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">{c.exQLabel}</p>
                    <div className="space-y-1 ml-4">
                      <p className="text-white/80">a. <InlineMath math="9 \times [2 \times (-12)]" /></p>
                      <p className="text-white/80">b. <InlineMath math="12 \times [8 + (-19)]" /></p>
                      <p className="text-white/80">c. <InlineMath math="(-7 \times 3) \times (-8)" /></p>
                    </div>
                  </div>
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-yellow-400 mb-3">{c.solutionLabel}</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">a. <InlineMath math="9 \times [2 \times (-12)]" /></p>
                        <p className="mb-1"><strong>{c.step1}</strong> {c.ex2aS1}</p>
                        <BlockMath math="2 \times (-12) = -24" />
                        <p className="mb-1"><strong>{c.step2}</strong> {c.ex2aS2}</p>
                        <BlockMath math="9 \times (-24) = -216" />
                        <p className="text-primary font-semibold">{c.answerLabel} <InlineMath math="-216" /></p>
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">b. <InlineMath math="12 \times [8 + (-19)]" /></p>
                        <p className="mb-1"><strong>{c.step1}</strong> {c.ex2bS1}</p>
                        <BlockMath math="8 + (-19) = 8 - 19 = -11" />
                        <p className="mb-1"><strong>{c.step2}</strong> {c.ex2bS2}</p>
                        <BlockMath math="12 \times (-11) = -132" />
                        <p className="text-primary font-semibold">{c.answerLabel} <InlineMath math="-132" /></p>
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2">c. <InlineMath math="(-7 \times 3) \times (-8)" /></p>
                        <p className="mb-1"><strong>{c.step1}</strong> {c.ex2cS1}</p>
                        <BlockMath math="-7 \times 3 = -21" />
                        <p className="mb-1"><strong>{c.step2}</strong> {c.ex2cS2}</p>
                        <BlockMath math="(-21) \times (-8) = 168" />
                        <p className="text-primary font-semibold">{c.answerLabel} <InlineMath math="168" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contoh 3 - Soal Cerita */}
                <div className="border-l-4 border-red-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">{c.badgeHard}</span>
                    <span className="font-body font-semibold text-white">{c.ex3}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">{c.ex3Q}</p>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-red-400 mb-3">{c.solutionLabel}</p>
                    <div className="space-y-3 font-body text-sm text-white/80">
                      <p><strong>{c.step1}</strong> {c.ex3S1}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={c.katexEx3Drops} />
                      </div>
                      <p><strong>{c.step2}</strong> {c.ex3S2}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={c.katexEx3Total} />
                      </div>
                      <p><strong>{language === "ja" ? "\u624b\u9806 3:" : c.step1.replace("1", "3")}</strong> {c.ex3S3}</p>
                      <div className="bg-slate-900/50 rounded p-3">
                        <BlockMath math={c.katexEx3Final} />
                      </div>
                      <p className="text-primary font-semibold">
                        {c.ex3Answer} <InlineMath math="-2°C" />.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contoh 4 - Bonus */}
                <div className="border-l-4 border-purple-500 pl-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded">{c.badgeBonus}</span>
                    <span className="font-body font-semibold text-white">{c.ex4}</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="font-body text-sm text-white mb-2">
                      {c.ex4QLabel} <InlineMath math="-4 \times [5 \times (-6)]" /> {c.ex4QAnd} <InlineMath math="[10 + (-24)] \times (-9)" />
                    </p>
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                    <p className="font-body text-xs font-semibold text-purple-400 mb-3">{c.solutionLabel}</p>
                    <div className="space-y-4 font-body text-sm text-white/80">
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2"><InlineMath math="-4 \times [5 \times (-6)]" /></p>
                        <p className="mb-1"><strong>{c.step1}</strong> <InlineMath math="5 \times (-6) = -30" /></p>
                        <p className="mb-1"><strong>{c.step2}</strong> <InlineMath math="-4 \times (-30) = 120" /></p>
                        <p className="text-primary font-semibold">{c.answerLabel} <InlineMath math="120" /></p>
                      </div>
                      <div className="bg-slate-900/30 rounded p-3">
                        <p className="font-semibold text-white mb-2"><InlineMath math="[10 + (-24)] \times (-9)" /></p>
                        <p className="mb-1"><strong>{c.step1}</strong> <InlineMath math="10 + (-24) = 10 - 24 = -14" /></p>
                        <p className="mb-1"><strong>{c.step2}</strong> <InlineMath math="(-14) \times (-9) = 126" /></p>
                        <p className="text-primary font-semibold">{c.answerLabel} <InlineMath math="126" /></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Sifat-Sifat Perkalian */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("sifatPerkalian")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="font-body font-semibold text-white">{c.secSifatTitle}</span>
              </div>
              {expandedSections.includes("sifatPerkalian") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("sifatPerkalian") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-cyan-300 mb-2">{c.prop1Title}</p>
                  <p className="font-body text-sm text-white/80 mb-3">{c.prop1Desc}</p>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <BlockMath math="a \times b = b \times a" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <span className="text-cyan-300"><InlineMath math="3 \times (-5) = -15" /></span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <span className="text-cyan-300"><InlineMath math="(-5) \times 3 = -15" /></span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-blue-300 mb-2">{c.prop2Title}</p>
                  <p className="font-body text-sm text-white/80 mb-3">
                    {c.prop2DescA} <strong className="text-primary">1</strong> {c.prop2DescB}
                  </p>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <BlockMath math="a \times 1 = 1 \times a = a" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <span className="text-blue-300"><InlineMath math="(-7) \times 1 = -7" /></span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <span className="text-blue-300"><InlineMath math="1 \times 15 = 15" /></span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-purple-300 mb-2">{c.prop3Title}</p>
                  <p className="font-body text-sm text-white/80 mb-3">{c.prop3Desc}</p>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <BlockMath math="(a \times b) \times c = a \times (b \times c)" />
                  </div>
                  <div className="bg-slate-900/50 rounded p-3">
                    <p className="text-white/60 text-xs mb-1">{c.exampleLabel}</p>
                    <BlockMath math="(2 \times (-3)) \times 4 = 2 \times ((-3) \times 4)" />
                    <BlockMath math="(-6) \times 4 = 2 \times (-12) = -24 \checkmark" />
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-semibold text-green-300 mb-2">{c.prop4Title}</p>
                  <p className="font-body text-sm text-white/80 mb-3">{c.prop4Desc}</p>
                  <div className="bg-slate-900/50 rounded p-3 mb-3">
                    <BlockMath math={c.katexClosure} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <span className="text-green-300"><InlineMath math="(-4) \times 6 = -24 \in \mathbb{Z}" /></span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 text-center">
                      <span className="text-green-300"><InlineMath math="(-9) \times (-3) = 27 \in \mathbb{Z}" /></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Kesimpulan */}
          <div className="bg-card/80 backdrop-blur border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("kesimpulan")}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-body font-semibold text-white">{c.secKesimpulanTitle}</span>
              </div>
              {expandedSections.includes("kesimpulan") ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </button>
            {expandedSections.includes("kesimpulan") && (
              <div className="px-5 pb-5 space-y-4">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-cyan-300 mb-3">{c.signRuleConcTitle}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-green-400 font-mono text-sm font-bold w-36">(+) × (+)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-green-400 font-bold">{c.tdPositive}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-orange-400 font-mono text-sm font-bold w-36">(+) × (−)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-red-400 font-bold">{c.tdNegative}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-orange-400 font-mono text-sm font-bold w-36">(−) × (+)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-red-400 font-bold">{c.tdNegative}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900/50 rounded p-3">
                      <span className="text-yellow-400 font-mono text-sm font-bold w-36">(−) × (−)</span>
                      <span className="text-white/50">=</span>
                      <span className="text-green-400 font-bold">{c.tdPositive}</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded p-3 mt-3">
                    <p className="text-white/70 text-xs text-center"><strong className="text-cyan-300">{c.memoBold}</strong> {c.memoText}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-purple-300 mb-3">{c.propSummaryTitle}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2 items-start">
                      <span className="text-cyan-400 font-bold min-w-fit">{c.commLabel}</span>
                      <span className="text-white/80"><InlineMath math="a \times b = b \times a" /></span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <span className="text-blue-400 font-bold min-w-fit">{c.identLabel}</span>
                      <span className="text-white/80"><InlineMath math="a \times 1 = a" /></span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <span className="text-purple-400 font-bold min-w-fit">{c.assocLabel}</span>
                      <span className="text-white/80"><InlineMath math="(a \times b) \times c = a \times (b \times c)" /></span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <span className="text-green-400 font-bold min-w-fit">{c.closureLabel}</span>
                      <span className="text-white/80">{c.closureDesc}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="font-body text-sm font-bold text-yellow-300 mb-3">{c.tipsSectionTitle}</p>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">1.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">{c.tip1Bold}</strong>{c.tip1Body}
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">2.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">{c.tip2Bold}</strong> {c.tip2Body}
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">3.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">{c.tip3Bold}</strong>{c.tip3Body}
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-yellow-400 font-bold text-lg leading-none">4.</span>
                      <p className="font-body text-sm text-white/80">
                        <strong className="text-yellow-300">{c.tip4Bold}</strong> {c.tip4Body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ══ RANGKUMAN AKHIR HALAMAN ══ */}
          <div className="mt-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-600 px-5 py-4 text-center">
              <p className="font-display text-lg font-bold text-white tracking-wide">{c.summaryTitle}</p>
              <p className="font-body text-xs text-white/80 mt-0.5">{c.summarySubtitle}</p>
            </div>
            <div className="bg-slate-900/90 backdrop-blur px-5 py-5 space-y-5">

              {/* Aturan Tanda */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-violet-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-500/30 border border-violet-500 flex items-center justify-center text-[10px]">1</span>
                  {c.sum1Title}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { kiri: "(+) × (+)", kanan: "= (+)", contoh: "4 × 3 = 12", color: "bg-green-900/50 border-green-500/40 text-green-200" },
                    { kiri: "(−) × (−)", kanan: "= (+)", contoh: "(−4) × (−3) = 12", color: "bg-cyan-900/50 border-cyan-500/40 text-cyan-200" },
                    { kiri: "(+) × (−)", kanan: "= (−)", contoh: "4 × (−3) = −12", color: "bg-red-900/50 border-red-500/40 text-red-200" },
                    { kiri: "(−) × (+)", kanan: "= (−)", contoh: "(−4) × 3 = −12", color: "bg-orange-900/50 border-orange-500/40 text-orange-200" },
                  ].map(({ kiri, kanan, contoh, color }) => (
                    <div key={kiri} className={`${color} border rounded-xl px-3 py-2`}>
                      <p className="font-mono text-xs font-bold">{kiri} {kanan}</p>
                      <p className="font-body text-[11px] text-white/55 mt-0.5">{contoh}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-violet-900/50 to-purple-900/30 border border-violet-500/40 rounded-xl px-4 py-3 text-center mt-1">
                  <p className="font-body text-xs font-bold text-violet-200">{c.quickFormulaLabel}</p>
                  <p className="font-body text-sm text-white/80 mt-1">
                    {c.qfSameWord} <strong className="text-green-300">{c.qfSame}</strong> {c.qfPosResult} <strong className="text-green-300">{c.qfPos}</strong>
                    {c.qfDiffSep} <strong className="text-red-300">{c.qfDiff}</strong> {c.qfNegResult} <strong className="text-red-300">{c.qfNeg}</strong>
                  </p>
                </div>
              </div>

              {/* Sifat-Sifat */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-fuchsia-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-fuchsia-500/30 border border-fuchsia-500 flex items-center justify-center text-[10px]">2</span>
                  {c.sum2Title}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { sifat: c.propKomutatif, rumus: "a × b = b × a", contoh: "3 × (−5) = (−5) × 3 = −15", color: "from-violet-900/50 to-violet-800/20 border-violet-500/40 text-violet-200" },
                    { sifat: c.propAsosiatif, rumus: "(a × b) × c = a × (b × c)", contoh: "(2 × 3) × (−4) = 2 × (3 × (−4)) = −24", color: "from-purple-900/50 to-purple-800/20 border-purple-500/40 text-purple-200" },
                    { sifat: c.propDistributif, rumus: "a × (b + c) = a × b + a × c", contoh: "3 × (4 + (−2)) = 3×4 + 3×(−2) = 6", color: "from-fuchsia-900/50 to-fuchsia-800/20 border-fuchsia-500/40 text-fuchsia-200" },
                    { sifat: c.propIdentitas, rumus: "a × 1 = 1 × a = a", contoh: "(−7) × 1 = −7", color: "from-pink-900/50 to-pink-800/20 border-pink-500/40 text-pink-200" },
                    { sifat: c.propNol, rumus: "a × 0 = 0 × a = 0", contoh: "(−100) × 0 = 0", color: "from-slate-800/70 to-slate-700/30 border-slate-500/40 text-slate-200" },
                  ].map(({ sifat, rumus, contoh, color }) => (
                    <div key={sifat} className={`bg-gradient-to-r ${color} border rounded-xl px-4 py-2.5 flex gap-3 items-start`}>
                      <div className="min-w-[90px]">
                        <p className="font-body text-xs font-bold">{sifat}</p>
                        <p className="font-mono text-[10px] text-white/50">{rumus}</p>
                      </div>
                      <p className="font-body text-xs text-white/60 border-l border-white/10 pl-3">{contoh}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips & Trik */}
              <div className="space-y-2">
                <p className="font-body text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-500/30 border border-yellow-500 flex items-center justify-center text-[10px]">3</span>
                  {c.sum3Title}
                </p>
                <div className="space-y-2">
                  {[
                    { icon: "🔑", tip: c.trickSameSign, detail: c.trickSameSignDetail, color: "bg-violet-900/30 border-violet-500/30" },
                    { icon: "📊", tip: c.trickCountNeg, detail: c.trickCountNegDetail, color: "bg-purple-900/30 border-purple-500/30" },
                    { icon: "⚡", tip: c.trickDistrib, detail: c.trickDistribDetail, color: "bg-fuchsia-900/30 border-fuchsia-500/30" },
                    { icon: "✅", tip: c.trickVerify, detail: c.trickVerifyDetail, color: "bg-green-900/30 border-green-500/30" },
                  ].map(({ icon, tip, detail, color }) => (
                    <div key={tip} className={`${color} border rounded-xl p-3 flex gap-3`}>
                      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className="font-body text-xs font-bold text-white">{tip}</p>
                        <p className="font-body text-xs text-white/60 mt-0.5 leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kesimpulan Final */}
              <div className="bg-gradient-to-br from-violet-500/20 via-purple-500/15 to-fuchsia-500/20 border border-white/20 rounded-2xl p-5 text-center space-y-3">
                <div className="text-3xl">⭐</div>
                <p className="font-display text-base font-bold text-white">{c.conclusionFinal}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed">
                  {language === "ja" ? (
                    <>{c.conclusionBodyB}{c.conclusionBodyC}{c.conclusionBodyD}{c.conclusionBodyE}</>
                  ) : (
                    <>{c.conclusionBody}{" "}<strong className="text-violet-300">{c.conclusionBodyB}</strong>{c.conclusionBodyC}{" "}<strong className="text-yellow-300">{c.conclusionBodyD}</strong>{c.conclusionBodyE}</>
                  )}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {c.tags.map(tag => (
                    <span key={tag} className="bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="font-display text-sm font-semibold text-yellow-300 mt-2">{c.nextLabel}</p>
              </div>

            </div>
          </div>

          {/* Tombol Navigasi */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => {
                playPopSound();
                navigate("/materi-matematika/kelas-7/bilangan-bulat/pengurangan");
              }}
              className="bg-card/80 backdrop-blur border border-border rounded-xl px-5 py-3 text-white/70 hover:text-white hover:border-primary/60 transition-all duration-300"
            >
              {c.prevBtn}
            </button>
            <button
              onClick={() => {
                playPopSound();
                navigate("/materi-matematika/kelas-7/bilangan-bulat");
              }}
              className="bg-primary/20 backdrop-blur border border-primary/60 rounded-xl px-5 py-3 text-primary hover:bg-primary/30 transition-all duration-300"
            >
              {c.backBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerkalianBilanganBulatPage;
