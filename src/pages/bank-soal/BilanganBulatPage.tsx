import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

// Helper function to render text with LaTeX
const MathText = ({ text, className = "" }: { text: string; className?: string }) => {
  const elements = useMemo(() => {
    const result: React.ReactNode[] = [];
    let key = 0;
    
    // Split by block math ($$...$$) first
    const blockParts = text.split(/(\$\$[^$]+\$\$)/g);
    
    blockParts.forEach((part) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        // Block math
        const math = part.slice(2, -2).trim();
        result.push(
          <span key={key++} className="mx-1">
            <InlineMath math={math} />
          </span>
        );
      } else if (part) {
        // Check for inline math ($...$)
        const inlineParts = part.split(/(\$[^$]+\$)/g);
        inlineParts.forEach((inlinePart) => {
          if (inlinePart.startsWith("$") && inlinePart.endsWith("$")) {
            const math = inlinePart.slice(1, -1).trim();
            result.push(
              <span key={key++} className="mx-0.5">
                <InlineMath math={math} />
              </span>
            );
          } else if (inlinePart) {
            result.push(<span key={key++}>{inlinePart}</span>);
          }
        });
      }
    });
    
    return result;
  }, [text]);
  
  return <span className={className}>{elements}</span>;
};

type Difficulty = "Mudah" | "Sedang" | "Sulit";
type QuestionType = "PG" | "PG Kompleks" | "Benar/Salah";

interface Question {
  id: number;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  options?: string[];
  statements?: { text: string; isCorrect: boolean }[];
  correctAnswer?: string | string[];
  explanation: {
    concept: string;
    steps: string[];
    formula?: string;
  };
}

const soalBilanganBulat: Question[] = [
  // SOAL 1 - PG MUDAH
  {
    id: 1,
    type: "PG",
    difficulty: "Mudah",
    question: "Hasil dari $$(-5) + 8$$ adalah ...",
    options: ["A. -13", "B. -3", "C. 3", "D. 13"],
    correctAnswer: "C. 3",
    explanation: {
      concept: "Penjumlahan bilangan bulat dengan tanda berbeda: kurangi nilai mutlak yang lebih besar dengan yang lebih kecil, hasilnya mengikuti tanda bilangan dengan nilai mutlak lebih besar.",
      steps: [
        "Identifikasi: $$-5$$ (negatif) dan $$8$$ (positif)",
        "Bandingkan nilai mutlak: $$|-5| = 5$$ dan $$|8| = 8$$",
        "Karena $$|8| > |-5|$$, hasil akan positif",
        "Hitung: $$8 - 5 = 3$$",
        "Jadi, $$(-5) + 8 = 3$$"
      ],
      formula: "$$a + (-b) = a - b$$ atau $$(-a) + b = b - a$$ (jika $$b > a$$)"
    }
  },
  // SOAL 2 - PG MUDAH
  {
    id: 2,
    type: "PG",
    difficulty: "Mudah",
    question: "Hasil dari $$12 - 18$$ adalah ...",
    options: ["A. -6", "B. 6", "C. -30", "D. 30"],
    correctAnswer: "A. -6",
    explanation: {
      concept: "Pengurangan bilangan bulat: jika pengurang lebih besar dari yang dikurangi, hasilnya negatif.",
      steps: [
        "Identifikasi: $$12$$ dikurangi $$18$$",
        "Karena $$18 > 12$$, hasil akan negatif",
        "Hitung: $$12 - 18 = -(18 - 12) = -6$$",
        "Jadi, $$12 - 18 = -6$$"
      ],
      formula: "$$a - b = -(b - a)$$ jika $$b > a$$"
    }
  },
  // SOAL 3 - PG MUDAH
  {
    id: 3,
    type: "PG",
    difficulty: "Mudah",
    question: "Hasil dari $$(-4) \\times (-6)$$ adalah ...",
    options: ["A. -24", "B. 24", "C. -10", "D. 10"],
    correctAnswer: "B. 24",
    explanation: {
      concept: "Perkalian dua bilangan negatif menghasilkan bilangan positif.",
      steps: [
        "Aturan: negatif × negatif = positif",
        "Kalikan nilai mutlaknya: $$4 \\times 6 = 24$$",
        "Tentukan tanda: $$(-)\\times(-) = (+)$$",
        "Jadi, $$(-4) \\times (-6) = +24 = 24$$"
      ],
      formula: "$$(-a) \\times (-b) = a \\times b$$"
    }
  },
  // SOAL 4 - PG MUDAH
  {
    id: 4,
    type: "PG",
    difficulty: "Mudah",
    question: "Hasil dari $$(-36) : 6$$ adalah ...",
    options: ["A. 6", "B. -6", "C. 42", "D. -42"],
    correctAnswer: "B. -6",
    explanation: {
      concept: "Pembagian bilangan negatif dengan bilangan positif menghasilkan bilangan negatif.",
      steps: [
        "Aturan: negatif : positif = negatif",
        "Bagi nilai mutlaknya: $$36 : 6 = 6$$",
        "Tentukan tanda: $$(-) : (+) = (-)$$",
        "Jadi, $$(-36) : 6 = -6$$"
      ],
      formula: "$$(-a) : b = -(a : b)$$"
    }
  },
  // SOAL 5 - PG SEDANG
  {
    id: 5,
    type: "PG",
    difficulty: "Sedang",
    question: "Hasil dari $$(-8) + 15 - (-7)$$ adalah ...",
    options: ["A. 0", "B. 14", "C. -14", "D. 30"],
    correctAnswer: "B. 14",
    explanation: {
      concept: "Operasi campuran penjumlahan dan pengurangan bilangan bulat dikerjakan dari kiri ke kanan. Ingat: mengurangi bilangan negatif sama dengan menambah bilangan positif.",
      steps: [
        "Ubah pengurangan bilangan negatif: $$-(-7) = +7$$",
        "Persamaan menjadi: $$(-8) + 15 + 7$$",
        "Hitung bertahap: $$(-8) + 15 = 7$$",
        "Lanjutkan: $$7 + 7 = 14$$",
        "Jadi, $$(-8) + 15 - (-7) = 14$$"
      ],
      formula: "$$a - (-b) = a + b$$"
    }
  },
  // SOAL 6 - PG SEDANG
  {
    id: 6,
    type: "PG",
    difficulty: "Sedang",
    question: "Hasil dari $$(-5)^3$$ adalah ...",
    options: ["A. 125", "B. -125", "C. 15", "D. -15"],
    correctAnswer: "B. -125",
    explanation: {
      concept: "Bilangan negatif dipangkatkan dengan pangkat ganjil menghasilkan bilangan negatif.",
      steps: [
        "$$(-5)^3 = (-5) \\times (-5) \\times (-5)$$",
        "Langkah 1: $$(-5) \\times (-5) = 25$$",
        "Langkah 2: $$25 \\times (-5) = -125$$",
        "Jadi, $$(-5)^3 = -125$$"
      ],
      formula: "$$(-a)^n = -a^n$$ jika $$n$$ ganjil; $$(-a)^n = a^n$$ jika $$n$$ genap"
    }
  },
  // SOAL 7 - PG SEDANG
  {
    id: 7,
    type: "PG",
    difficulty: "Sedang",
    question: "Nilai dari $$|{-12}| + |{5 - 9}|$$ adalah ...",
    options: ["A. 8", "B. 16", "C. -8", "D. -16"],
    correctAnswer: "B. 16",
    explanation: {
      concept: "Nilai mutlak selalu menghasilkan bilangan non-negatif. Nilai mutlak dari suatu bilangan adalah jarak bilangan tersebut dari nol.",
      steps: [
        "Hitung $$|{-12}| = 12$$",
        "Hitung $$5 - 9 = -4$$",
        "Hitung $$|{-4}| = 4$$",
        "Jumlahkan: $$12 + 4 = 16$$",
        "Jadi, $$|{-12}| + |{5 - 9}| = 16$$"
      ],
      formula: "$$|a| = a$$ jika $$a \\geq 0$$; $$|a| = -a$$ jika $$a < 0$$"
    }
  },
  // SOAL 8 - PG SULIT
  {
    id: 8,
    type: "PG",
    difficulty: "Sulit",
    question: "Hasil dari $$\\frac{(-24) \\times 6}{(-8) + (-4)}$$ adalah ...",
    options: ["A. 12", "B. -12", "C. 18", "D. -18"],
    correctAnswer: "A. 12",
    explanation: {
      concept: "Operasi pecahan dengan bilangan bulat: hitung pembilang dan penyebut terlebih dahulu, lalu bagi.",
      steps: [
        "Hitung pembilang: $$(-24) \\times 6 = -144$$",
        "Hitung penyebut: $$(-8) + (-4) = -12$$",
        "Bagi: $$\\frac{-144}{-12} = 12$$",
        "Negatif dibagi negatif = positif",
        "Jadi, hasilnya adalah $$12$$"
      ],
      formula: "$$\\frac{-a}{-b} = \\frac{a}{b}$$"
    }
  },
  // SOAL 9 - PG KOMPLEKS
  {
    id: 9,
    type: "PG Kompleks",
    difficulty: "Sulit",
    question: "Perhatikan pernyataan berikut!\n(1) $$(-3) \\times 4 = -12$$\n(2) $$(-2)^4 = -16$$\n(3) $$15 : (-3) = -5$$\n(4) $$(-8) - (-10) = 2$$\n\nPernyataan yang benar adalah ...",
    options: ["A. (1), (2), dan (3)", "B. (1), (3), dan (4)", "C. (2), (3), dan (4)", "D. (1), (2), dan (4)"],
    correctAnswer: "B. (1), (3), dan (4)",
    explanation: {
      concept: "Verifikasi setiap pernyataan dengan aturan operasi bilangan bulat.",
      steps: [
        "(1) $$(-3) \\times 4 = -12$$ ✓ Benar (negatif × positif = negatif)",
        "(2) $$(-2)^4 = (-2)\\times(-2)\\times(-2)\\times(-2) = 16$$ ✗ Salah (harusnya +16, bukan -16)",
        "(3) $$15 : (-3) = -5$$ ✓ Benar (positif : negatif = negatif)",
        "(4) $$(-8) - (-10) = -8 + 10 = 2$$ ✓ Benar",
        "Pernyataan yang benar: (1), (3), dan (4)"
      ],
      formula: "$$(-a)^n > 0$$ jika $$n$$ genap"
    }
  },
  // SOAL 10 - BENAR/SALAH
  {
    id: 10,
    type: "Benar/Salah",
    difficulty: "Sedang",
    question: "Tentukan benar atau salah pernyataan berikut tentang bilangan bulat!",
    statements: [
      { text: "$$(-7) + (-3) = -10$$", isCorrect: true },
      { text: "$$(-5)^2 = -25$$", isCorrect: false },
      { text: "$$0$$ adalah bilangan bulat positif", isCorrect: false },
      { text: "$$(-12) : (-4) = 3$$", isCorrect: true }
    ],
    explanation: {
      concept: "Operasi bilangan bulat mengikuti aturan tanda dan sifat bilangan.",
      steps: [
        "$$(-7) + (-3) = -10$$ → BENAR (negatif + negatif = negatif yang lebih besar)",
        "$$(-5)^2 = (-5) \\times (-5) = 25$$ → SALAH (harusnya +25)",
        "$$0$$ bukan positif dan bukan negatif → SALAH",
        "$$(-12) : (-4) = 3$$ → BENAR (negatif : negatif = positif)"
      ],
      formula: "$$0$$ adalah bilangan netral, bukan positif maupun negatif"
    }
  },
  // SOAL 11 - PG MUDAH
  {
    id: 11,
    type: "PG",
    difficulty: "Mudah",
    question: "Urutan bilangan dari yang terkecil ke terbesar adalah ...",
    options: ["A. $$-3, -1, 0, 2, 5$$", "B. $$5, 2, 0, -1, -3$$", "C. $$-1, -3, 0, 2, 5$$", "D. $$0, -1, -3, 2, 5$$"],
    correctAnswer: "A. $$-3, -1, 0, 2, 5$$",
    explanation: {
      concept: "Pada garis bilangan, semakin ke kanan semakin besar. Bilangan negatif selalu lebih kecil dari nol dan bilangan positif.",
      steps: [
        "Bilangan negatif: $$-3 < -1$$",
        "Nol: $$-1 < 0$$",
        "Bilangan positif: $$0 < 2 < 5$$",
        "Urutan terkecil ke terbesar: $$-3, -1, 0, 2, 5$$"
      ],
      formula: "$$... < -3 < -2 < -1 < 0 < 1 < 2 < 3 < ...$$"
    }
  },
  // SOAL 12 - PG SEDANG
  {
    id: 12,
    type: "PG",
    difficulty: "Sedang",
    question: "Suhu di kota A adalah $$-5°C$$. Suhu di kota B adalah $$8°C$$ lebih tinggi dari kota A. Suhu di kota B adalah ...",
    options: ["A. $$-13°C$$", "B. $$-3°C$$", "C. $$3°C$$", "D. $$13°C$$"],
    correctAnswer: "C. $$3°C$$",
    explanation: {
      concept: "Soal cerita bilangan bulat tentang suhu. 'Lebih tinggi' berarti penjumlahan.",
      steps: [
        "Suhu kota A = $$-5°C$$",
        "Kota B lebih tinggi $$8°C$$ → tambahkan",
        "Suhu kota B = $$-5 + 8 = 3°C$$"
      ],
      formula: "Suhu akhir = Suhu awal + perubahan"
    }
  },
  // SOAL 13 - PG SULIT
  {
    id: 13,
    type: "PG",
    difficulty: "Sulit",
    question: "Jika $$a = -4$$, $$b = 3$$, dan $$c = -2$$, maka nilai dari $$a^2 - 2bc + c^3$$ adalah ...",
    options: ["A. 20", "B. 28", "C. 4", "D. -4"],
    correctAnswer: "A. 20",
    explanation: {
      concept: "Substitusi nilai variabel ke dalam bentuk aljabar dengan operasi bilangan bulat.",
      steps: [
        "Substitusi: $$a = -4$$, $$b = 3$$, $$c = -2$$",
        "$$a^2 = (-4)^2 = 16$$",
        "$$2bc = 2 \\times 3 \\times (-2) = -12$$",
        "$$c^3 = (-2)^3 = -8$$",
        "Hitung: $$16 - (-12) + (-8) = 16 + 12 - 8 = 20$$",
        "Koreksi: $$a^2 - 2bc + c^3 = 16 - (-12) + (-8) = 16 + 12 - 8 = 20$$",
        "Tunggu, mari hitung ulang: $$16 - 2(3)(-2) + (-8) = 16 - (-12) + (-8) = 16 + 12 - 8 = 20$$",
        "Hitung: $$a^2 - 2bc + c^3 = 16 - (-12) + (-8) = 16 + 12 - 8 = 20$$",
      ],
      formula: "Substitusi dan operasi bilangan bulat"
    }
  },
  // SOAL 14 - PG MUDAH
  {
    id: 14,
    type: "PG",
    difficulty: "Mudah",
    question: "Lawan dari bilangan $$-15$$ adalah ...",
    options: ["A. $$-15$$", "B. $$15$$", "C. $$\\frac{1}{15}$$", "D. $$-\\frac{1}{15}$$"],
    correctAnswer: "B. $$15$$",
    explanation: {
      concept: "Lawan (invers aditif) dari suatu bilangan adalah bilangan yang jika dijumlahkan dengan bilangan tersebut hasilnya nol.",
      steps: [
        "Lawan dari $$a$$ adalah $$-a$$",
        "Lawan dari $$-15$$ adalah $$-(-15) = 15$$",
        "Verifikasi: $$-15 + 15 = 0$$ ✓"
      ],
      formula: "Lawan dari $$a$$ adalah $$-a$$, sehingga $$a + (-a) = 0$$"
    }
  },
  // SOAL 15 - PG SEDANG
  {
    id: 15,
    type: "PG",
    difficulty: "Sedang",
    question: "Hasil dari $$(-2) \\times (-3) \\times (-4)$$ adalah ...",
    options: ["A. 24", "B. -24", "C. 12", "D. -12"],
    correctAnswer: "B. -24",
    explanation: {
      concept: "Perkalian tiga bilangan negatif: jumlah tanda negatif ganjil menghasilkan hasil negatif.",
      steps: [
        "Hitung bertahap dari kiri:",
        "$$(-2) \\times (-3) = 6$$ (negatif × negatif = positif)",
        "$$6 \\times (-4) = -24$$ (positif × negatif = negatif)",
        "Atau: 3 bilangan negatif → hasil negatif",
        "Nilai: $$2 \\times 3 \\times 4 = 24$$",
        "Jadi, $$(-2) \\times (-3) \\times (-4) = -24$$"
      ],
      formula: "Banyaknya faktor negatif ganjil → hasil negatif"
    }
  },
  // SOAL 16 - BENAR/SALAH
  {
    id: 16,
    type: "Benar/Salah",
    difficulty: "Mudah",
    question: "Tentukan benar atau salah pernyataan berikut!",
    statements: [
      { text: "Semua bilangan bulat adalah bilangan asli", isCorrect: false },
      { text: "$$-5$$ lebih kecil dari $$-3$$", isCorrect: true },
      { text: "Hasil kali dua bilangan negatif adalah negatif", isCorrect: false },
      { text: "$$0$$ termasuk bilangan bulat", isCorrect: true }
    ],
    explanation: {
      concept: "Pemahaman definisi dan sifat bilangan bulat.",
      steps: [
        "Bilangan asli: $$1, 2, 3, ...$$ (tidak termasuk 0 dan negatif) → SALAH",
        "$$-5 < -3$$ karena $$-5$$ lebih jauh dari 0 ke kiri → BENAR",
        "Negatif × negatif = positif → SALAH",
        "Bilangan bulat: $$..., -2, -1, 0, 1, 2, ...$$ → BENAR"
      ],
      formula: "Bilangan bulat = $$\\{..., -2, -1, 0, 1, 2, ...\\}$$"
    }
  },
  // SOAL 17 - PG KOMPLEKS
  {
    id: 17,
    type: "PG Kompleks",
    difficulty: "Sulit",
    question: "Perhatikan operasi berikut!\n(1) $$(-8) + 12 - 7 = -3$$\n(2) $$|{-15}| - |{10}| = 5$$\n(3) $$(-6)^2 \\times (-1) = -36$$\n(4) $$\\frac{(-20)}{(-5)} + (-1) = 5$$\n\nOperasi yang benar adalah ...",
    options: ["A. (1) dan (2)", "B. (2) dan (3)", "C. (1), (2), dan (3)", "D. (2), (3), dan (4)"],
    correctAnswer: "C. (1), (2), dan (3)",
    explanation: {
      concept: "Verifikasi setiap operasi bilangan bulat.",
      steps: [
        "(1) $$(-8) + 12 - 7 = 4 - 7 = -3$$ ✓ BENAR",
        "(2) $$|{-15}| - |{10}| = 15 - 10 = 5$$ ✓ BENAR",
        "(3) $$(-6)^2 \\times (-1) = 36 \\times (-1) = -36$$ ✓ BENAR",
        "(4) $$\\frac{(-20)}{(-5)} + (-1) = 4 + (-1) = 3$$ ✗ SALAH (bukan 5)",
        "Jawaban: (1), (2), dan (3)"
      ]
    }
  },
  // SOAL 18 - PG SEDANG
  {
    id: 18,
    type: "PG",
    difficulty: "Sedang",
    question: "FPB dari $$24$$ dan $$36$$ adalah ...",
    options: ["A. 6", "B. 12", "C. 24", "D. 72"],
    correctAnswer: "B. 12",
    explanation: {
      concept: "FPB (Faktor Persekutuan Terbesar) adalah faktor terbesar yang membagi habis kedua bilangan.",
      steps: [
        "Faktorisasi prima: $$24 = 2^3 \\times 3$$",
        "Faktorisasi prima: $$36 = 2^2 \\times 3^2$$",
        "FPB = pangkat terkecil dari faktor prima yang sama",
        "FPB = $$2^2 \\times 3^1 = 4 \\times 3 = 12$$"
      ],
      formula: "FPB = hasil kali faktor prima dengan pangkat terkecil"
    }
  },
  // SOAL 19 - PG SULIT
  {
    id: 19,
    type: "PG",
    difficulty: "Sulit",
    question: "KPK dari $$18$$, $$24$$, dan $$30$$ adalah ...",
    options: ["A. 120", "B. 180", "C. 360", "D. 720"],
    correctAnswer: "C. 360",
    explanation: {
      concept: "KPK (Kelipatan Persekutuan Terkecil) adalah kelipatan terkecil dari semua bilangan yang diberikan.",
      steps: [
        "Faktorisasi: $$18 = 2 \\times 3^2$$",
        "Faktorisasi: $$24 = 2^3 \\times 3$$",
        "Faktorisasi: $$30 = 2 \\times 3 \\times 5$$",
        "KPK = pangkat tertinggi dari semua faktor prima",
        "KPK = $$2^3 \\times 3^2 \\times 5 = 8 \\times 9 \\times 5 = 360$$"
      ],
      formula: "KPK = hasil kali faktor prima dengan pangkat tertinggi"
    }
  },
  // SOAL 20 - PG SULIT
  {
    id: 20,
    type: "PG",
    difficulty: "Sulit",
    question: "Seorang penyelam berada pada kedalaman $$-25$$ meter. Ia naik $$8$$ meter, lalu turun lagi $$12$$ meter. Posisi penyelam sekarang adalah ...",
    options: ["A. $$-17$$ meter", "B. $$-29$$ meter", "C. $$-45$$ meter", "D. $$-5$$ meter"],
    correctAnswer: "B. $$-29$$ meter",
    explanation: {
      concept: "Soal cerita bilangan bulat tentang posisi/ketinggian. Naik (+), turun (-).",
      steps: [
        "Posisi awal: $$-25$$ meter",
        "Naik 8 meter: $$-25 + 8 = -17$$ meter",
        "Turun 12 meter: $$-17 + (-12) = -17 - 12 = -29$$ meter",
        "Posisi akhir: $$-29$$ meter"
      ],
      formula: "Posisi akhir = Posisi awal + naik - turun"
    }
  }
];

const difficultyColor: Record<Difficulty, string> = {
  "Mudah": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Sedang": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Sulit": "bg-rose-500/20 text-rose-400 border-rose-500/30"
};

const typeColor: Record<QuestionType, string> = {
  "PG": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "PG Kompleks": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Benar/Salah": "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30"
};

const SoalCard = ({ soal }: { soal: Question }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden
        hover:border-primary/40 transition-all duration-500 animate-slide-up"
      style={{ 
        background: "linear-gradient(135deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
      }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(0,200,255,0.1) 0%, transparent 50%)"
        }}
      />
      
      <div className="relative p-5 md:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-primary/80 bg-primary/10 px-2 py-1 rounded-md">
            #{soal.id}
          </span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${difficultyColor[soal.difficulty]}`}>
            {soal.difficulty}
          </span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeColor[soal.type]}`}>
            {soal.type}
          </span>
        </div>

        {/* Question */}
        <div className="mb-5">
          <div className="text-foreground font-body text-sm md:text-base leading-relaxed whitespace-pre-line">
            <MathText text={soal.question} />
          </div>
        </div>

        {/* Options for PG */}
        {soal.options && (
          <div className="space-y-2 mb-5">
            {soal.options.map((option, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30
                  hover:bg-muted/50 hover:border-primary/30 transition-all duration-200"
              >
                <span className="text-sm text-foreground/90 font-body">
                  <MathText text={option} />
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Statements for Benar/Salah */}
        {soal.statements && (
          <div className="space-y-2 mb-5">
            {soal.statements.map((statement, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30"
              >
                <span className="text-xs font-bold text-muted-foreground">({idx + 1})</span>
                <span className="text-sm text-foreground/90 font-body">
                  <MathText text={statement.text} />
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => { playPopSound(); setIsOpen(!isOpen); }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
            bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30
            hover:from-primary/30 hover:to-secondary/30 hover:border-primary/50
            transition-all duration-300 cursor-pointer group/btn"
        >
          <span className="text-sm font-semibold text-primary">
            {isOpen ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-primary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-primary" />
          )}
        </button>

        {/* Pembahasan Accordion */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-out ${
            isOpen ? "max-h-[2000px] opacity-100 mt-5" : "max-h-0 opacity-0"
          }`}
        >
          <div className="relative p-5 rounded-xl border border-primary/20"
            style={{
              background: "linear-gradient(135deg, rgba(0,200,255,0.05) 0%, rgba(139,92,246,0.05) 100%)"
            }}
          >
            {/* ─── Jawaban ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-900/20 mb-2.5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1.5">Jawaban</div>
              {soal.correctAnswer && (
                <div className="font-body text-sm text-emerald-50 font-bold">
                  <MathText text={Array.isArray(soal.correctAnswer) ? soal.correctAnswer.join(", ") : soal.correctAnswer} />
                </div>
              )}
              {soal.statements && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {soal.statements.map((s, i) => (
                    <span key={i} className={`text-xs px-2 py-0.5 rounded font-body font-semibold ${s.isCorrect ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-300"}`}>
                      ({i+1}) {s.isCorrect ? "✓ Benar" : "✗ Salah"}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* ─── Konsep & Trik ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-violet-400/55 shadow-lg shadow-violet-900/20 mb-2.5" style={{background:"linear-gradient(135deg,rgba(139,92,246,0.16) 0%,rgba(124,58,237,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-1.5">Konsep &amp; Trik</div>
              <div className="font-body text-xs text-violet-50/90 leading-relaxed">
                <MathText text={soal.explanation.concept} />
              </div>
            </div>
            {/* ─── Step by Step ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-cyan-400/55 shadow-lg shadow-cyan-900/20 mb-2.5" style={{background:"linear-gradient(135deg,rgba(34,211,238,0.12) 0%,rgba(59,130,246,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 mb-1.5">Step by Step Penyelesaian</div>
              <div className="space-y-1.5">
                {soal.explanation.steps.map((step, si) => (
                  <div key={si} className="flex gap-2 items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center mt-0.5">{si + 1}</span>
                    <p className="text-xs text-cyan-50/90 font-body leading-relaxed"><MathText text={step} /></p>
                  </div>
                ))}
              </div>
            </div>
            {/* ─── Tips ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-amber-400/55 shadow-lg shadow-amber-900/20 mb-2.5" style={{background:"linear-gradient(135deg,rgba(251,191,36,0.14) 0%,rgba(245,158,11,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-1.5">Tips</div>
              <div className="font-body text-xs text-amber-50/90 leading-relaxed">
                {soal.explanation.formula ? <MathText text={soal.explanation.formula} /> : "Kuasai konsep utama dan latih langkah penyelesaian secara berurutan. Verifikasi jawaban dengan substitusi kembali ke soal."}
              </div>
            </div>
            {/* ─── Kesimpulan ─── */}
            <div className="px-4 py-3 rounded-xl border-2 border-rose-400/55 shadow-lg shadow-rose-900/20" style={{background:"linear-gradient(135deg,rgba(244,63,94,0.14) 0%,rgba(236,72,153,0.10) 100%)"}}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-rose-300 mb-1.5">Kesimpulan</div>
              <div className="font-body text-xs text-rose-50/90 leading-relaxed font-medium">
                Jadi, jawaban yang tepat adalah{" "}
                <span className="font-bold text-rose-200">
                  {soal.correctAnswer ? <MathText text={Array.isArray(soal.correctAnswer) ? soal.correctAnswer.join(", ") : soal.correctAnswer} /> : "lihat kunci jawaban di atas"}
                </span>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BankSoalBilanganBulatPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Difficulty | "Semua">("Semua");

  const filteredSoal = filter === "Semua" 
    ? soalBilanganBulat 
    : soalBilanganBulat.filter(s => s.difficulty === filter);

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden py-8">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />
      
      {/* Nebula effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative z-10 max-w-4xl w-full px-4 mt-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl 
            bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 mb-4">
            <Calculator className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2">
            BANK SOAL
          </h1>
          <h2 className="font-display text-lg md:text-xl font-semibold text-foreground mb-2">
            Bilangan Bulat
          </h2>
          <p className="text-muted-foreground text-sm font-body max-w-md mx-auto">
            Koleksi 20 soal pilihan ganda, PG kompleks, dan benar/salah dengan pembahasan lengkap
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(["Semua", "Mudah", "Sedang", "Sulit"] as const).map((level) => (
            <button
              key={level}
              onClick={() => { playPopSound(); setFilter(level); }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer
                ${filter === level 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                  : "bg-card/60 text-foreground/70 border border-border hover:border-primary/50"
                }`}
            >
              {level} {level !== "Semua" && `(${soalBilanganBulat.filter(s => s.difficulty === level).length})`}
            </button>
          ))}
        </div>

        {/* Soal Grid */}
        <div className="space-y-5">
          {filteredSoal.map((soal, index) => (
            <div key={soal.id} style={{ animationDelay: `${index * 0.05}s` }}>
              <SoalCard soal={soal} />
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => { playPopSound(); navigate("/bank-soal"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            Kembali ke Bank Soal
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankSoalBilanganBulatPage;
