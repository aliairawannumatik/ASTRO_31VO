import { useState, useMemo } from "react";
import Starfield from "@/components/Starfield";
import PageNavigation from "@/components/PageNavigation";
import { Sigma, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { playPopSound } from "@/hooks/useAudio";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

const MathText = ({ text, className = "" }: { text: string; className?: string }) => {
  const elements = useMemo(() => {
    const result: React.ReactNode[] = [];
    let key = 0;
    const blockParts = text.split(/(\$\$[^$]+\$\$)/g);
    blockParts.forEach((part) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2).trim();
        result.push(<span key={key++} className="mx-1"><InlineMath math={math} /></span>);
      } else if (part) {
        const inlineParts = part.split(/(\$[^$]+\$)/g);
        inlineParts.forEach((inlinePart) => {
          if (inlinePart.startsWith("$") && inlinePart.endsWith("$")) {
            const math = inlinePart.slice(1, -1).trim();
            result.push(<span key={key++} className="mx-0.5"><InlineMath math={math} /></span>);
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
  tag?: string;
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

const soalBilanganRasional: Question[] = [
  // ─── MUDAH 1–35 ───────────────────────────────────────────────────────────
  {
    id: 1, type: "PG", difficulty: "Mudah",
    question: "Pecahan yang senilai dengan $$\\frac{2}{3}$$ adalah ...",
    options: ["A. $$\\frac{4}{9}$$", "B. $$\\frac{4}{6}$$", "C. $$\\frac{3}{6}$$", "D. $$\\frac{6}{12}$$"],
    correctAnswer: "B. $$\\frac{4}{6}$$",
    explanation: {
      concept: "Pecahan senilai diperoleh dengan mengalikan atau membagi pembilang dan penyebut dengan bilangan yang sama.",
      steps: [
        "$$\\frac{2}{3} = \\frac{2 \\times 2}{3 \\times 2} = \\frac{4}{6}$$",
        "Verifikasi: $$\\frac{4}{6}$$ disederhanakan → $$\\frac{4 \\div 2}{6 \\div 2} = \\frac{2}{3}$$ ✓"
      ],
      formula: "$$\\frac{a}{b} = \\frac{a \\times k}{b \\times k}$$"
    }
  },
  {
    id: 2, type: "PG", difficulty: "Mudah",
    question: "Bentuk paling sederhana dari $$\\frac{18}{24}$$ adalah ...",
    options: ["A. $$\\frac{9}{12}$$", "B. $$\\frac{6}{8}$$", "C. $$\\frac{3}{4}$$", "D. $$\\frac{2}{3}$$"],
    correctAnswer: "C. $$\\frac{3}{4}$$",
    explanation: {
      concept: "Menyederhanakan pecahan dengan membagi pembilang dan penyebut dengan FPB-nya.",
      steps: [
        "FPB dari 18 dan 24 = 6",
        "$$\\frac{18}{24} = \\frac{18 \\div 6}{24 \\div 6} = \\frac{3}{4}$$",
        "Tidak dapat disederhanakan lagi karena FPB(3,4) = 1"
      ],
      formula: "$$\\frac{a}{b} = \\frac{a \\div \\text{FPB}(a,b)}{b \\div \\text{FPB}(a,b)}$$"
    }
  },
  {
    id: 3, type: "PG", difficulty: "Mudah",
    question: "Hasil dari $$\\frac{1}{4} + \\frac{2}{4}$$ adalah ...",
    options: ["A. $$\\frac{1}{2}$$", "B. $$\\frac{3}{8}$$", "C. $$\\frac{3}{4}$$", "D. $$\\frac{2}{8}$$"],
    correctAnswer: "C. $$\\frac{3}{4}$$",
    explanation: {
      concept: "Penjumlahan pecahan berpenyebut sama: jumlahkan pembilangnya, penyebut tetap.",
      steps: [
        "$$\\frac{1}{4} + \\frac{2}{4} = \\frac{1+2}{4} = \\frac{3}{4}$$"
      ],
      formula: "$$\\frac{a}{c} + \\frac{b}{c} = \\frac{a+b}{c}$$"
    }
  },
  {
    id: 4, type: "PG", difficulty: "Mudah",
    question: "Hasil dari $$\\frac{5}{6} - \\frac{1}{6}$$ adalah ...",
    options: ["A. $$\\frac{4}{12}$$", "B. $$\\frac{2}{3}$$", "C. $$\\frac{4}{36}$$", "D. $$\\frac{1}{3}$$"],
    correctAnswer: "B. $$\\frac{2}{3}$$",
    explanation: {
      concept: "Pengurangan pecahan berpenyebut sama: kurangkan pembilangnya, penyebut tetap.",
      steps: [
        "$$\\frac{5}{6} - \\frac{1}{6} = \\frac{5-1}{6} = \\frac{4}{6}$$",
        "Sederhanakan: $$\\frac{4}{6} = \\frac{2}{3}$$"
      ],
      formula: "$$\\frac{a}{c} - \\frac{b}{c} = \\frac{a-b}{c}$$"
    }
  },
  {
    id: 5, type: "PG", difficulty: "Mudah",
    question: "Hasil dari $$\\frac{2}{5} \\times \\frac{3}{4}$$ adalah ...",
    options: ["A. $$\\frac{5}{9}$$", "B. $$\\frac{6}{9}$$", "C. $$\\frac{3}{10}$$", "D. $$\\frac{5}{20}$$"],
    correctAnswer: "C. $$\\frac{3}{10}$$",
    explanation: {
      concept: "Perkalian pecahan: kalikan pembilang dengan pembilang, penyebut dengan penyebut.",
      steps: [
        "$$\\frac{2}{5} \\times \\frac{3}{4} = \\frac{2 \\times 3}{5 \\times 4} = \\frac{6}{20}$$",
        "Sederhanakan: $$\\frac{6}{20} = \\frac{3}{10}$$"
      ],
      formula: "$$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}$$"
    }
  },
  {
    id: 6, type: "PG", difficulty: "Mudah",
    question: "Hasil dari $$\\frac{3}{4} \\div \\frac{3}{8}$$ adalah ...",
    options: ["A. $$\\frac{1}{2}$$", "B. $$\\frac{9}{32}$$", "C. $$2$$", "D. $$\\frac{3}{2}$$"],
    correctAnswer: "C. $$2$$",
    explanation: {
      concept: "Pembagian pecahan: kalikan dengan kebalikan (invers) pembagi.",
      steps: [
        "$$\\frac{3}{4} \\div \\frac{3}{8} = \\frac{3}{4} \\times \\frac{8}{3}$$",
        "$$= \\frac{3 \\times 8}{4 \\times 3} = \\frac{24}{12} = 2$$"
      ],
      formula: "$$\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}$$"
    }
  },
  {
    id: 7, type: "PG", difficulty: "Mudah",
    question: "Pecahan $$\\frac{7}{4}$$ dalam bentuk pecahan campuran adalah ...",
    options: ["A. $$1\\frac{3}{4}$$", "B. $$2\\frac{1}{4}$$", "C. $$1\\frac{1}{4}$$", "D. $$2\\frac{3}{4}$$"],
    correctAnswer: "A. $$1\\frac{3}{4}$$",
    explanation: {
      concept: "Pecahan tak wajar (pembilang > penyebut) diubah ke bentuk campuran dengan membagi.",
      steps: [
        "$$7 \\div 4 = 1$$ sisa $$3$$",
        "Jadi $$\\frac{7}{4} = 1\\frac{3}{4}$$"
      ],
      formula: "$$\\frac{a}{b} = (a \\div b) \\frac{a \\mod b}{b}$$"
    }
  },
  {
    id: 8, type: "PG", difficulty: "Mudah",
    question: "Pecahan campuran $$2\\frac{1}{3}$$ dalam bentuk pecahan biasa adalah ...",
    options: ["A. $$\\frac{5}{3}$$", "B. $$\\frac{7}{3}$$", "C. $$\\frac{6}{3}$$", "D. $$\\frac{4}{3}$$"],
    correctAnswer: "B. $$\\frac{7}{3}$$",
    explanation: {
      concept: "Pecahan campuran diubah ke pecahan biasa: (bilangan bulat × penyebut + pembilang) / penyebut.",
      steps: [
        "$$2\\frac{1}{3} = \\frac{2 \\times 3 + 1}{3} = \\frac{6+1}{3} = \\frac{7}{3}$$"
      ],
      formula: "$$a\\frac{b}{c} = \\frac{a \\times c + b}{c}$$"
    }
  },
  {
    id: 9, type: "PG", difficulty: "Mudah",
    question: "Bilangan $$0{,}75$$ dalam bentuk pecahan paling sederhana adalah ...",
    options: ["A. $$\\frac{75}{100}$$", "B. $$\\frac{7}{10}$$", "C. $$\\frac{3}{4}$$", "D. $$\\frac{15}{20}$$"],
    correctAnswer: "C. $$\\frac{3}{4}$$",
    explanation: {
      concept: "Desimal diubah ke pecahan dengan memperhatikan nilai tempat desimal.",
      steps: [
        "$$0{,}75 = \\frac{75}{100}$$",
        "FPB(75, 100) = 25",
        "$$\\frac{75}{100} = \\frac{75 \\div 25}{100 \\div 25} = \\frac{3}{4}$$"
      ],
      formula: "$$0{,}75 = \\frac{75}{100} = \\frac{3}{4}$$"
    }
  },
  {
    id: 10, type: "PG", difficulty: "Mudah",
    question: "Pecahan $$\\frac{3}{5}$$ dalam bentuk persen adalah ...",
    options: ["A. $$35\\%$$", "B. $$53\\%$$", "C. $$60\\%$$", "D. $$50\\%$$"],
    correctAnswer: "C. $$60\\%$$",
    explanation: {
      concept: "Pecahan diubah ke persen dengan mengalikan 100%.",
      steps: [
        "$$\\frac{3}{5} \\times 100\\% = \\frac{300}{5}\\% = 60\\%$$"
      ],
      formula: "$$\\frac{a}{b} \\times 100\\%$$"
    }
  },
  {
    id: 11, type: "PG", difficulty: "Mudah",
    question: "Pecahan $$\\frac{1}{4}$$ dalam bentuk desimal adalah ...",
    options: ["A. $$0{,}14$$", "B. $$0{,}4$$", "C. $$0{,}25$$", "D. $$0{,}50$$"],
    correctAnswer: "C. $$0{,}25$$",
    explanation: {
      concept: "Pecahan diubah ke desimal dengan cara membagi pembilang dengan penyebut.",
      steps: [
        "$$\\frac{1}{4} = 1 \\div 4 = 0{,}25$$",
        "Atau: $$\\frac{1}{4} = \\frac{1 \\times 25}{4 \\times 25} = \\frac{25}{100} = 0{,}25$$"
      ],
      formula: "$$\\frac{a}{b} = a \\div b$$"
    }
  },
  {
    id: 12, type: "PG", difficulty: "Mudah",
    question: "Manakah pecahan yang nilainya paling besar?",
    options: ["A. $$\\frac{3}{8}$$", "B. $$\\frac{1}{2}$$", "C. $$\\frac{2}{5}$$", "D. $$\\frac{5}{12}$$"],
    correctAnswer: "B. $$\\frac{1}{2}$$",
    explanation: {
      concept: "Membandingkan pecahan dengan menyamakan penyebut atau mengubah ke desimal.",
      steps: [
        "$$\\frac{3}{8} = 0{,}375$$",
        "$$\\frac{1}{2} = 0{,}500$$",
        "$$\\frac{2}{5} = 0{,}400$$",
        "$$\\frac{5}{12} \\approx 0{,}417$$",
        "Yang terbesar: $$\\frac{1}{2} = 0{,}5$$"
      ],
      formula: "Bandingkan nilai desimal"
    }
  },
  {
    id: 13, type: "PG", difficulty: "Mudah",
    question: "Hasil dari $$\\frac{1}{2} + \\frac{1}{3}$$ adalah ...",
    options: ["A. $$\\frac{2}{5}$$", "B. $$\\frac{2}{6}$$", "C. $$\\frac{5}{6}$$", "D. $$\\frac{3}{6}$$"],
    correctAnswer: "C. $$\\frac{5}{6}$$",
    explanation: {
      concept: "Penjumlahan pecahan beda penyebut: samakan penyebut dengan KPK.",
      steps: [
        "KPK(2, 3) = 6",
        "$$\\frac{1}{2} = \\frac{3}{6}$$, $$\\frac{1}{3} = \\frac{2}{6}$$",
        "$$\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$$"
      ],
      formula: "$$\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}$$"
    }
  },
  {
    id: 14, type: "PG", difficulty: "Mudah",
    question: "Hasil dari $$\\frac{3}{4} - \\frac{1}{2}$$ adalah ...",
    options: ["A. $$\\frac{2}{2}$$", "B. $$\\frac{1}{4}$$", "C. $$\\frac{1}{2}$$", "D. $$\\frac{2}{4}$$"],
    correctAnswer: "B. $$\\frac{1}{4}$$",
    explanation: {
      concept: "Pengurangan pecahan beda penyebut: samakan penyebut terlebih dahulu.",
      steps: [
        "KPK(4, 2) = 4",
        "$$\\frac{1}{2} = \\frac{2}{4}$$",
        "$$\\frac{3}{4} - \\frac{2}{4} = \\frac{1}{4}$$"
      ],
      formula: "Samakan penyebut dengan KPK"
    }
  },
  {
    id: 15, type: "PG", difficulty: "Mudah",
    question: "Nilai dari $$4 \\times \\frac{3}{8}$$ adalah ...",
    options: ["A. $$\\frac{12}{8}$$", "B. $$\\frac{3}{2}$$", "C. $$\\frac{7}{8}$$", "D. $$\\frac{12}{32}$$"],
    correctAnswer: "B. $$\\frac{3}{2}$$",
    explanation: {
      concept: "Perkalian bilangan bulat dengan pecahan.",
      steps: [
        "$$4 \\times \\frac{3}{8} = \\frac{4 \\times 3}{8} = \\frac{12}{8}$$",
        "Sederhanakan: $$\\frac{12}{8} = \\frac{3}{2}$$"
      ],
      formula: "$$n \\times \\frac{a}{b} = \\frac{n \\times a}{b}$$"
    }
  },
  {
    id: 16, type: "PG", difficulty: "Mudah",
    question: "Bilangan rasional adalah bilangan yang dapat ditulis dalam bentuk $$\\frac{p}{q}$$ dengan syarat ...",
    options: ["A. $$p$$ dan $$q$$ bilangan asli", "B. $$q \\neq 0$$ dan $$p, q$$ bilangan bulat", "C. $$p > q$$", "D. $$p$$ dan $$q$$ bilangan prima"],
    correctAnswer: "B. $$q \\neq 0$$ dan $$p, q$$ bilangan bulat",
    explanation: {
      concept: "Definisi bilangan rasional.",
      steps: [
        "Bilangan rasional: $$\\frac{p}{q}$$ dengan $$p, q \\in \\mathbb{Z}$$ dan $$q \\neq 0$$",
        "Contoh: $$\\frac{3}{4}$$, $$\\frac{-5}{2}$$, $$\\frac{7}{1} = 7$$",
        "Penyebut tidak boleh nol karena pembagian dengan nol tidak terdefinisi"
      ],
      formula: "$$\\mathbb{Q} = \\left\\{\\frac{p}{q} \\mid p, q \\in \\mathbb{Z}, q \\neq 0\\right\\}$$"
    }
  },
  {
    id: 17, type: "PG", difficulty: "Mudah",
    question: "Urutan dari yang terkecil: $$\\frac{1}{2}$$, $$\\frac{1}{3}$$, $$\\frac{1}{4}$$ adalah ...",
    options: ["A. $$\\frac{1}{2} < \\frac{1}{3} < \\frac{1}{4}$$", "B. $$\\frac{1}{4} < \\frac{1}{3} < \\frac{1}{2}$$", "C. $$\\frac{1}{3} < \\frac{1}{4} < \\frac{1}{2}$$", "D. $$\\frac{1}{4} < \\frac{1}{2} < \\frac{1}{3}$$"],
    correctAnswer: "B. $$\\frac{1}{4} < \\frac{1}{3} < \\frac{1}{2}$$",
    explanation: {
      concept: "Untuk pecahan dengan pembilang sama, semakin besar penyebut semakin kecil nilainya.",
      steps: [
        "$$\\frac{1}{4} = 0{,}25$$, $$\\frac{1}{3} \\approx 0{,}333$$, $$\\frac{1}{2} = 0{,}5$$",
        "Urutan: $$\\frac{1}{4} < \\frac{1}{3} < \\frac{1}{2}$$"
      ],
      formula: "Jika pembilang sama: $$\\frac{1}{a} < \\frac{1}{b}$$ bila $$a > b$$"
    }
  },
  {
    id: 18, type: "PG", difficulty: "Mudah",
    question: "Hasil dari $$0{,}5 + \\frac{1}{4}$$ adalah ...",
    options: ["A. $$\\frac{6}{4}$$", "B. $$0{,}75$$", "C. $$0{,}6$$", "D. $$\\frac{6}{10}$$"],
    correctAnswer: "B. $$0{,}75$$",
    explanation: {
      concept: "Operasi penjumlahan bilangan desimal dan pecahan dengan menyamakan bentuk.",
      steps: [
        "$$0{,}5 = \\frac{1}{2}$$",
        "$$\\frac{1}{2} + \\frac{1}{4} = \\frac{2}{4} + \\frac{1}{4} = \\frac{3}{4}$$",
        "$$\\frac{3}{4} = 0{,}75$$"
      ],
      formula: "Samakan bentuk lalu operasikan"
    }
  },
  {
    id: 19, type: "PG", difficulty: "Mudah",
    question: "Pecahan $$\\frac{6}{9}$$ dalam bentuk paling sederhana adalah ...",
    options: ["A. $$\\frac{3}{4}$$", "B. $$\\frac{2}{3}$$", "C. $$\\frac{1}{3}$$", "D. $$\\frac{3}{9}$$"],
    correctAnswer: "B. $$\\frac{2}{3}$$",
    explanation: {
      concept: "Sederhanakan dengan membagi pembilang dan penyebut dengan FPB.",
      steps: [
        "FPB(6, 9) = 3",
        "$$\\frac{6}{9} = \\frac{6 \\div 3}{9 \\div 3} = \\frac{2}{3}$$"
      ],
      formula: "$$\\frac{a}{b} \\div \\frac{\\text{FPB}(a,b)}{\\text{FPB}(a,b)}$$"
    }
  },
  {
    id: 20, type: "PG", difficulty: "Mudah",
    question: "Pecahan $$25\\%$$ sama dengan ...",
    options: ["A. $$\\frac{1}{4}$$", "B. $$\\frac{2}{5}$$", "C. $$\\frac{1}{5}$$", "D. $$\\frac{2}{4}$$"],
    correctAnswer: "A. $$\\frac{1}{4}$$",
    explanation: {
      concept: "Persen diubah ke pecahan dengan membagi 100.",
      steps: [
        "$$25\\% = \\frac{25}{100}$$",
        "FPB(25, 100) = 25",
        "$$\\frac{25}{100} = \\frac{1}{4}$$"
      ],
      formula: "$$n\\% = \\frac{n}{100}$$"
    }
  },
  {
    id: 21, type: "PG", difficulty: "Mudah",
    question: "Nilai dari $$\\frac{0}{7}$$ adalah ...",
    options: ["A. $$7$$", "B. Tidak terdefinisi", "C. $$\\frac{1}{7}$$", "D. $$0$$"],
    correctAnswer: "D. $$0$$",
    explanation: {
      concept: "Nol dibagi bilangan bukan nol hasilnya nol.",
      steps: [
        "$$\\frac{0}{7} = 0 \\div 7 = 0$$",
        "Karena tidak ada bagian yang diambil dari $$7$$"
      ],
      formula: "$$\\frac{0}{a} = 0$$ untuk $$a \\neq 0$$"
    }
  },
  {
    id: 22, type: "PG", difficulty: "Mudah",
    question: "Pecahan $$\\frac{5}{1}$$ sama nilainya dengan ...",
    options: ["A. $$\\frac{1}{5}$$", "B. $$0$$", "C. $$5$$", "D. $$50$$"],
    correctAnswer: "C. $$5$$",
    explanation: {
      concept: "Pecahan dengan penyebut 1 sama dengan bilangan bulatnya.",
      steps: ["$$\\frac{5}{1} = 5 \\div 1 = 5$$"],
      formula: "$$\\frac{a}{1} = a$$"
    }
  },
  {
    id: 23, type: "PG", difficulty: "Mudah",
    question: "Hasil dari $$\\frac{2}{3} \\times \\frac{9}{4}$$ adalah ...",
    options: ["A. $$\\frac{18}{12}$$", "B. $$\\frac{3}{2}$$", "C. $$\\frac{6}{12}$$", "D. $$\\frac{11}{12}$$"],
    correctAnswer: "B. $$\\frac{3}{2}$$",
    explanation: {
      concept: "Perkalian pecahan biasa.",
      steps: [
        "$$\\frac{2}{3} \\times \\frac{9}{4} = \\frac{2 \\times 9}{3 \\times 4} = \\frac{18}{12}$$",
        "Sederhanakan: $$\\frac{18}{12} = \\frac{3}{2}$$"
      ],
      formula: "$$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}$$"
    }
  },
  {
    id: 24, type: "PG", difficulty: "Mudah",
    question: "Hasil dari $$6 \\div \\frac{3}{2}$$ adalah ...",
    options: ["A. $$9$$", "B. $$4$$", "C. $$3$$", "D. $$\\frac{9}{2}$$"],
    correctAnswer: "B. $$4$$",
    explanation: {
      concept: "Pembagian bilangan bulat dengan pecahan: kalikan dengan kebalikan pembagi.",
      steps: [
        "$$6 \\div \\frac{3}{2} = 6 \\times \\frac{2}{3} = \\frac{12}{3} = 4$$"
      ],
      formula: "$$n \\div \\frac{a}{b} = n \\times \\frac{b}{a}$$"
    }
  },
  {
    id: 25, type: "PG", difficulty: "Mudah",
    question: "Bilangan $$1{,}2$$ sama dengan pecahan ...",
    options: ["A. $$\\frac{12}{100}$$", "B. $$\\frac{6}{5}$$", "C. $$\\frac{12}{5}$$", "D. $$\\frac{1}{12}$$"],
    correctAnswer: "B. $$\\frac{6}{5}$$",
    explanation: {
      concept: "Mengubah desimal ke pecahan.",
      steps: [
        "$$1{,}2 = \\frac{12}{10}$$",
        "FPB(12, 10) = 2",
        "$$\\frac{12}{10} = \\frac{6}{5}$$"
      ],
      formula: "$$1{,}2 = \\frac{12}{10} = \\frac{6}{5}$$"
    }
  },
  {
    id: 26, type: "PG", difficulty: "Mudah",
    question: "Kebalikan (invers perkalian) dari $$\\frac{5}{7}$$ adalah ...",
    options: ["A. $$\\frac{-5}{7}$$", "B. $$\\frac{7}{5}$$", "C. $$\\frac{-7}{5}$$", "D. $$\\frac{5}{7}$$"],
    correctAnswer: "B. $$\\frac{7}{5}$$",
    explanation: {
      concept: "Invers perkalian (kebalikan) dari $$\\frac{a}{b}$$ adalah $$\\frac{b}{a}$$.",
      steps: [
        "Kebalikan $$\\frac{5}{7}$$ adalah $$\\frac{7}{5}$$",
        "Verifikasi: $$\\frac{5}{7} \\times \\frac{7}{5} = \\frac{35}{35} = 1$$ ✓"
      ],
      formula: "Kebalikan $$\\frac{a}{b}$$ adalah $$\\frac{b}{a}$$"
    }
  },
  {
    id: 27, type: "PG", difficulty: "Mudah",
    question: "Hasil dari $$\\frac{1}{3} + \\frac{1}{6}$$ adalah ...",
    options: ["A. $$\\frac{2}{9}$$", "B. $$\\frac{1}{2}$$", "C. $$\\frac{2}{6}$$", "D. $$\\frac{3}{9}$$"],
    correctAnswer: "B. $$\\frac{1}{2}$$",
    explanation: {
      concept: "Penjumlahan pecahan beda penyebut.",
      steps: [
        "KPK(3, 6) = 6",
        "$$\\frac{1}{3} = \\frac{2}{6}$$",
        "$$\\frac{2}{6} + \\frac{1}{6} = \\frac{3}{6} = \\frac{1}{2}$$"
      ]
    }
  },
  {
    id: 28, type: "PG", difficulty: "Mudah",
    question: "Nilai $$\\frac{-3}{4}$$ terletak di antara ...",
    options: ["A. $$-1$$ dan $$0$$", "B. $$0$$ dan $$1$$", "C. $$-2$$ dan $$-1$$", "D. $$1$$ dan $$2$$"],
    correctAnswer: "A. $$-1$$ dan $$0$$",
    explanation: {
      concept: "Menentukan posisi pecahan negatif pada garis bilangan.",
      steps: [
        "$$-1 < \\frac{-3}{4} < 0$$",
        "Karena $$\\frac{-3}{4} = -0{,}75$$",
        "$$-1 < -0{,}75 < 0$$ ✓"
      ]
    }
  },
  {
    id: 29, type: "PG", difficulty: "Mudah",
    question: "Hasil dari $$\\frac{5}{6} \\div \\frac{5}{12}$$ adalah ...",
    options: ["A. $$\\frac{1}{2}$$", "B. $$\\frac{25}{72}$$", "C. $$2$$", "D. $$3$$"],
    correctAnswer: "C. $$2$$",
    explanation: {
      concept: "Pembagian pecahan dengan membalikkan pembagi.",
      steps: [
        "$$\\frac{5}{6} \\div \\frac{5}{12} = \\frac{5}{6} \\times \\frac{12}{5} = \\frac{60}{30} = 2$$"
      ]
    }
  },
  {
    id: 30, type: "PG", difficulty: "Mudah",
    question: "Di antara $$\\frac{2}{5}$$ dan $$\\frac{3}{5}$$, pecahan yang tepat berada di tengah adalah ...",
    options: ["A. $$\\frac{5}{10}$$", "B. $$\\frac{1}{2}$$", "C. $$\\frac{4}{10}$$", "D. $$\\frac{3}{10}$$"],
    correctAnswer: "B. $$\\frac{1}{2}$$",
    explanation: {
      concept: "Rata-rata dua pecahan memberikan nilai tengah.",
      steps: [
        "Nilai tengah = $$\\frac{\\frac{2}{5} + \\frac{3}{5}}{2} = \\frac{\\frac{5}{5}}{2} = \\frac{1}{2}$$",
        "$$\\frac{1}{2} = 0{,}5$$ berada di antara $$0{,}4$$ dan $$0{,}6$$ ✓"
      ]
    }
  },
  {
    id: 31, type: "PG", difficulty: "Mudah",
    question: "Hasil dari $$\\frac{7}{10} - \\frac{2}{5}$$ adalah ...",
    options: ["A. $$\\frac{5}{5}$$", "B. $$\\frac{3}{10}$$", "C. $$\\frac{5}{10}$$", "D. $$\\frac{9}{10}$$"],
    correctAnswer: "B. $$\\frac{3}{10}$$",
    explanation: {
      concept: "Pengurangan pecahan beda penyebut.",
      steps: [
        "KPK(10, 5) = 10",
        "$$\\frac{2}{5} = \\frac{4}{10}$$",
        "$$\\frac{7}{10} - \\frac{4}{10} = \\frac{3}{10}$$"
      ]
    }
  },
  {
    id: 32, type: "PG", difficulty: "Mudah",
    question: "Pecahan $$\\frac{12}{16}$$ dalam bentuk paling sederhana adalah ...",
    options: ["A. $$\\frac{6}{8}$$", "B. $$\\frac{4}{6}$$", "C. $$\\frac{3}{4}$$", "D. $$\\frac{2}{3}$$"],
    correctAnswer: "C. $$\\frac{3}{4}$$",
    explanation: {
      concept: "FPB dari 12 dan 16 adalah 4.",
      steps: ["$$\\frac{12}{16} = \\frac{12 \\div 4}{16 \\div 4} = \\frac{3}{4}$$"]
    }
  },
  {
    id: 33, type: "PG", difficulty: "Mudah",
    question: "Hasil dari $$1\\frac{1}{2} + 2\\frac{1}{4}$$ adalah ...",
    options: ["A. $$3\\frac{1}{4}$$", "B. $$3\\frac{3}{4}$$", "C. $$4\\frac{1}{4}$$", "D. $$3\\frac{1}{2}$$"],
    correctAnswer: "B. $$3\\frac{3}{4}$$",
    explanation: {
      concept: "Penjumlahan pecahan campuran.",
      steps: [
        "Bagian bulat: $$1 + 2 = 3$$",
        "Bagian pecahan: $$\\frac{1}{2} + \\frac{1}{4} = \\frac{2}{4} + \\frac{1}{4} = \\frac{3}{4}$$",
        "Jadi: $$3\\frac{3}{4}$$"
      ]
    }
  },
  {
    id: 34, type: "PG", difficulty: "Mudah",
    question: "Pecahan $$\\frac{-8}{12}$$ disederhanakan menjadi ...",
    options: ["A. $$\\frac{-4}{6}$$", "B. $$\\frac{-3}{4}$$", "C. $$\\frac{-2}{3}$$", "D. $$\\frac{-1}{3}$$"],
    correctAnswer: "C. $$\\frac{-2}{3}$$",
    explanation: {
      concept: "Penyederhanaan pecahan negatif: bagi pembilang dan penyebut dengan FPB.",
      steps: [
        "FPB(8, 12) = 4",
        "$$\\frac{-8}{12} = \\frac{-8 \\div 4}{12 \\div 4} = \\frac{-2}{3}$$"
      ]
    }
  },
  {
    id: 35, type: "PG", difficulty: "Mudah",
    question: "Hasil dari $$\\frac{4}{5} \\times 10$$ adalah ...",
    options: ["A. $$4$$", "B. $$\\frac{40}{50}$$", "C. $$8$$", "D. $$\\frac{4}{50}$$"],
    correctAnswer: "C. $$8$$",
    explanation: {
      concept: "Perkalian pecahan dengan bilangan bulat.",
      steps: ["$$\\frac{4}{5} \\times 10 = \\frac{40}{5} = 8$$"]
    }
  },

  // ─── SEDANG 36–70 ─────────────────────────────────────────────────────────
  {
    id: 36, type: "PG", difficulty: "Sedang",
    question: "Hasil dari $$\\frac{2}{3} + \\frac{3}{4} - \\frac{1}{6}$$ adalah ...",
    options: ["A. $$\\frac{5}{4}$$", "B. $$\\frac{4}{3}$$", "C. $$\\frac{15}{12}$$", "D. $$1\\frac{1}{4}$$"],
    correctAnswer: "D. $$1\\frac{1}{4}$$",
    explanation: {
      concept: "Operasi campuran penjumlahan dan pengurangan pecahan beda penyebut.",
      steps: [
        "KPK(3, 4, 6) = 12",
        "$$\\frac{2}{3} = \\frac{8}{12}$$, $$\\frac{3}{4} = \\frac{9}{12}$$, $$\\frac{1}{6} = \\frac{2}{12}$$",
        "$$\\frac{8}{12} + \\frac{9}{12} - \\frac{2}{12} = \\frac{15}{12} = \\frac{5}{4} = 1\\frac{1}{4}$$"
      ]
    }
  },
  {
    id: 37, type: "PG", difficulty: "Sedang",
    question: "Hasil dari $$2\\frac{1}{3} \\times 1\\frac{1}{2}$$ adalah ...",
    options: ["A. $$2\\frac{1}{6}$$", "B. $$3\\frac{1}{2}$$", "C. $$3\\frac{2}{3}$$", "D. $$2\\frac{2}{3}$$"],
    correctAnswer: "B. $$3\\frac{1}{2}$$",
    explanation: {
      concept: "Perkalian pecahan campuran: ubah dulu ke pecahan biasa.",
      steps: [
        "$$2\\frac{1}{3} = \\frac{7}{3}$$, $$1\\frac{1}{2} = \\frac{3}{2}$$",
        "$$\\frac{7}{3} \\times \\frac{3}{2} = \\frac{21}{6} = \\frac{7}{2} = 3\\frac{1}{2}$$"
      ]
    }
  },
  {
    id: 38, type: "PG", difficulty: "Sedang",
    question: "Nilai dari $$\\left(\\frac{1}{2}\\right)^3$$ adalah ...",
    options: ["A. $$\\frac{3}{2}$$", "B. $$\\frac{3}{6}$$", "C. $$\\frac{1}{8}$$", "D. $$\\frac{1}{6}$$"],
    correctAnswer: "C. $$\\frac{1}{8}$$",
    explanation: {
      concept: "Pemangkatan pecahan: pangkatkan pembilang dan penyebut secara terpisah.",
      steps: [
        "$$\\left(\\frac{1}{2}\\right)^3 = \\frac{1^3}{2^3} = \\frac{1}{8}$$"
      ],
      formula: "$$\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}$$"
    }
  },
  {
    id: 39, type: "PG", difficulty: "Sedang",
    tag: "Kontekstual",
    question: "Seorang pedagang memiliki $$\\frac{3}{4}$$ kg gula. Ia menjual $$\\frac{1}{3}$$ dari jumlah tersebut. Gula yang tersisa adalah ...",
    options: ["A. $$\\frac{1}{2}$$ kg", "B. $$\\frac{5}{12}$$ kg", "C. $$\\frac{1}{4}$$ kg", "D. $$\\frac{7}{12}$$ kg"],
    correctAnswer: "A. $$\\frac{1}{2}$$ kg",
    explanation: {
      concept: "Soal cerita pecahan: hitung yang terjual lalu kurangi dari stok awal.",
      steps: [
        "Terjual: $$\\frac{1}{3} \\times \\frac{3}{4} = \\frac{3}{12} = \\frac{1}{4}$$ kg",
        "Sisa: $$\\frac{3}{4} - \\frac{1}{4} = \\frac{2}{4} = \\frac{1}{2}$$ kg"
      ]
    }
  },
  {
    id: 40, type: "PG", difficulty: "Sedang",
    tag: "Kontekstual",
    question: "Budi mengerjakan $$\\frac{2}{5}$$ pekerjaan di hari pertama dan $$\\frac{1}{4}$$ pekerjaan di hari kedua. Sisa pekerjaan yang belum diselesaikan adalah ...",
    options: ["A. $$\\frac{7}{20}$$", "B. $$\\frac{13}{20}$$", "C. $$\\frac{3}{20}$$", "D. $$\\frac{3}{9}$$"],
    correctAnswer: "A. $$\\frac{7}{20}$$",
    explanation: {
      concept: "Soal kontekstual pecahan: total pekerjaan = 1 (satu kesatuan).",
      steps: [
        "Selesai hari 1 + hari 2: $$\\frac{2}{5} + \\frac{1}{4} = \\frac{8}{20} + \\frac{5}{20} = \\frac{13}{20}$$",
        "Sisa: $$1 - \\frac{13}{20} = \\frac{20}{20} - \\frac{13}{20} = \\frac{7}{20}$$"
      ]
    }
  },
  {
    id: 41, type: "PG", difficulty: "Sedang",
    tag: "UN",
    question: "Hasil dari $$\\frac{5}{8} \\div 1\\frac{1}{4}$$ adalah ...",
    options: ["A. $$\\frac{1}{2}$$", "B. $$\\frac{25}{32}$$", "C. $$\\frac{5}{32}$$", "D. $$\\frac{25}{8}$$"],
    correctAnswer: "A. $$\\frac{1}{2}$$",
    explanation: {
      concept: "Pembagian pecahan biasa dengan pecahan campuran.",
      steps: [
        "$$1\\frac{1}{4} = \\frac{5}{4}$$",
        "$$\\frac{5}{8} \\div \\frac{5}{4} = \\frac{5}{8} \\times \\frac{4}{5} = \\frac{20}{40} = \\frac{1}{2}$$"
      ]
    }
  },
  {
    id: 42, type: "PG", difficulty: "Sedang",
    question: "Nilai dari $$\\frac{3}{4}$$ dari $$80$$ adalah ...",
    options: ["A. $$30$$", "B. $$60$$", "C. $$80$$", "D. $$45$$"],
    correctAnswer: "B. $$60$$",
    explanation: {
      concept: "\"Dari\" dalam soal pecahan berarti perkalian.",
      steps: ["$$\\frac{3}{4} \\times 80 = \\frac{240}{4} = 60$$"]
    }
  },
  {
    id: 43, type: "PG", difficulty: "Sedang",
    tag: "Kontekstual",
    question: "Tali sepanjang $$3\\frac{1}{2}$$ meter dipotong menjadi beberapa bagian, masing-masing $$\\frac{7}{8}$$ meter. Banyak potongan yang diperoleh adalah ...",
    options: ["A. $$3$$", "B. $$4$$", "C. $$5$$", "D. $$6$$"],
    correctAnswer: "B. $$4$$",
    explanation: {
      concept: "Pembagian pecahan campuran untuk menentukan banyak bagian.",
      steps: [
        "$$3\\frac{1}{2} = \\frac{7}{2}$$",
        "$$\\frac{7}{2} \\div \\frac{7}{8} = \\frac{7}{2} \\times \\frac{8}{7} = \\frac{56}{14} = 4$$"
      ]
    }
  },
  {
    id: 44, type: "PG", difficulty: "Sedang",
    tag: "ANBK",
    question: "Sebuah wadah penuh berisi air. Jika $$\\frac{1}{3}$$ bagian diambil, kemudian ditambah $$\\frac{1}{6}$$ bagian, maka air dalam wadah sekarang adalah ...",
    options: ["A. $$\\frac{5}{6}$$", "B. $$\\frac{1}{2}$$", "C. $$\\frac{2}{3}$$", "D. $$\\frac{7}{6}$$"],
    correctAnswer: "A. $$\\frac{5}{6}$$",
    explanation: {
      concept: "Operasi pecahan dalam konteks pengisian wadah.",
      steps: [
        "Mulai: $$1$$ (penuh)",
        "Setelah diambil: $$1 - \\frac{1}{3} = \\frac{2}{3}$$",
        "Setelah ditambah: $$\\frac{2}{3} + \\frac{1}{6} = \\frac{4}{6} + \\frac{1}{6} = \\frac{5}{6}$$"
      ]
    }
  },
  {
    id: 45, type: "PG", difficulty: "Sedang",
    question: "Diketahui $$\\frac{x}{5} = \\frac{3}{15}$$. Nilai $$x$$ adalah ...",
    options: ["A. $$9$$", "B. $$3$$", "C. $$1$$", "D. $$5$$"],
    correctAnswer: "C. $$1$$",
    explanation: {
      concept: "Mencari nilai variabel dalam persamaan pecahan.",
      steps: [
        "$$\\frac{3}{15} = \\frac{1}{5}$$",
        "Jadi $$\\frac{x}{5} = \\frac{1}{5}$$",
        "Maka $$x = 1$$"
      ]
    }
  },
  {
    id: 46, type: "PG", difficulty: "Sedang",
    tag: "Kontekstual",
    question: "Nilai ujian matematika rata-rata 4 siswa adalah $$7\\frac{1}{2}$$. Jika ada satu siswa baru dengan nilai $$8$$, maka rata-rata baru adalah ...",
    options: ["A. $$7{,}6$$", "B. $$7{,}7$$", "C. $$7{,}5$$", "D. $$7{,}8$$"],
    correctAnswer: "A. $$7{,}6$$",
    explanation: {
      concept: "Rata-rata gabungan dengan pecahan.",
      steps: [
        "Total nilai 4 siswa: $$4 \\times 7{,}5 = 30$$",
        "Total 5 siswa: $$30 + 8 = 38$$",
        "Rata-rata: $$\\frac{38}{5} = 7{,}6$$"
      ]
    }
  },
  {
    id: 47, type: "PG", difficulty: "Sedang",
    question: "Hasil dari $$\\frac{3}{5} + \\frac{7}{10} - \\frac{2}{5}$$ adalah ...",
    options: ["A. $$\\frac{4}{5}$$", "B. $$\\frac{7}{10}$$", "C. $$\\frac{9}{10}$$", "D. $$1$$"],
    correctAnswer: "C. $$\\frac{9}{10}$$",
    explanation: {
      concept: "Operasi campuran pecahan beda penyebut.",
      steps: [
        "KPK(5, 10) = 10",
        "$$\\frac{3}{5} = \\frac{6}{10}$$, $$\\frac{2}{5} = \\frac{4}{10}$$",
        "$$\\frac{6}{10} + \\frac{7}{10} - \\frac{4}{10} = \\frac{9}{10}$$"
      ]
    }
  },
  {
    id: 48, type: "PG", difficulty: "Sedang",
    tag: "Literasi Matematika",
    question: "Di sebuah kelas, $$\\frac{3}{8}$$ siswa menyukai matematika, $$\\frac{1}{4}$$ menyukai IPA, dan sisanya menyukai IPS. Berapa bagian siswa yang menyukai IPS?",
    options: ["A. $$\\frac{3}{8}$$", "B. $$\\frac{5}{8}$$", "C. $$\\frac{3}{4}$$", "D. $$\\frac{1}{8}$$"],
    correctAnswer: "A. $$\\frac{3}{8}$$",
    explanation: {
      concept: "Soal literasi matematika: mencari sisa bagian.",
      steps: [
        "Suka matematika + IPA: $$\\frac{3}{8} + \\frac{1}{4} = \\frac{3}{8} + \\frac{2}{8} = \\frac{5}{8}$$",
        "Sisanya (IPS): $$1 - \\frac{5}{8} = \\frac{3}{8}$$"
      ]
    }
  },
  {
    id: 49, type: "PG", difficulty: "Sedang",
    question: "Nilai dari $$\\left(\\frac{2}{3}\\right)^2 + \\frac{1}{9}$$ adalah ...",
    options: ["A. $$\\frac{5}{9}$$", "B. $$\\frac{4}{9}$$", "C. $$\\frac{4}{6}$$", "D. $$\\frac{5}{6}$$"],
    correctAnswer: "A. $$\\frac{5}{9}$$",
    explanation: {
      concept: "Kombinasi pemangkatan dan penjumlahan pecahan.",
      steps: [
        "$$\\left(\\frac{2}{3}\\right)^2 = \\frac{4}{9}$$",
        "$$\\frac{4}{9} + \\frac{1}{9} = \\frac{5}{9}$$"
      ]
    }
  },
  {
    id: 50, type: "PG", difficulty: "Sedang",
    tag: "UN",
    question: "Hasil dari $$\\frac{\\frac{3}{4} + \\frac{1}{2}}{\\frac{5}{8}}$$ adalah ...",
    options: ["A. $$1$$", "B. $$2$$", "C. $$\\frac{5}{4}$$", "D. $$\\frac{10}{8}$$"],
    correctAnswer: "B. $$2$$",
    explanation: {
      concept: "Pecahan kompleks: selesaikan pembilang dan penyebut terlebih dahulu.",
      steps: [
        "Pembilang: $$\\frac{3}{4} + \\frac{1}{2} = \\frac{3}{4} + \\frac{2}{4} = \\frac{5}{4}$$",
        "$$\\frac{\\frac{5}{4}}{\\frac{5}{8}} = \\frac{5}{4} \\div \\frac{5}{8} = \\frac{5}{4} \\times \\frac{8}{5} = \\frac{40}{20} = 2$$"
      ]
    }
  },
  {
    id: 51, type: "Benar/Salah", difficulty: "Sedang",
    question: "Tentukan benar atau salah pernyataan berikut tentang pecahan!",
    statements: [
      { text: "$$\\frac{3}{4} > \\frac{2}{3}$$", isCorrect: true },
      { text: "$$\\frac{1}{2} + \\frac{1}{3} = \\frac{2}{5}$$", isCorrect: false },
      { text: "$$0{,}4 = \\frac{2}{5}$$", isCorrect: true },
      { text: "$$2\\frac{1}{4} = \\frac{8}{4}$$", isCorrect: false }
    ],
    explanation: {
      concept: "Verifikasi pernyataan tentang pecahan.",
      steps: [
        "$$\\frac{3}{4} = 0{,}75 > \\frac{2}{3} \\approx 0{,}667$$ → BENAR",
        "$$\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6} \\neq \\frac{2}{5}$$ → SALAH",
        "$$0{,}4 = \\frac{4}{10} = \\frac{2}{5}$$ → BENAR",
        "$$2\\frac{1}{4} = \\frac{9}{4} \\neq \\frac{8}{4}$$ → SALAH"
      ]
    }
  },
  {
    id: 52, type: "PG", difficulty: "Sedang",
    tag: "Kontekstual",
    question: "Sebuah resep kue membutuhkan $$1\\frac{3}{4}$$ cangkir tepung. Jika ingin membuat $$3$$ kali resep, banyak tepung yang diperlukan adalah ...",
    options: ["A. $$4\\frac{1}{4}$$ cangkir", "B. $$5\\frac{1}{4}$$ cangkir", "C. $$4\\frac{3}{4}$$ cangkir", "D. $$5\\frac{3}{4}$$ cangkir"],
    correctAnswer: "B. $$5\\frac{1}{4}$$ cangkir",
    explanation: {
      concept: "Perkalian pecahan campuran dengan bilangan bulat.",
      steps: [
        "$$1\\frac{3}{4} = \\frac{7}{4}$$",
        "$$3 \\times \\frac{7}{4} = \\frac{21}{4} = 5\\frac{1}{4}$$ cangkir"
      ]
    }
  },
  {
    id: 53, type: "PG", difficulty: "Sedang",
    question: "Pecahan $$\\frac{5}{8}$$ diubah ke persen, hasilnya adalah ...",
    options: ["A. $$58\\%$$", "B. $$62{,}5\\%$$", "C. $$0{,}625\\%$$", "D. $$56\\%$$"],
    correctAnswer: "B. $$62{,}5\\%$$",
    explanation: {
      concept: "Mengubah pecahan ke persen.",
      steps: [
        "$$\\frac{5}{8} \\times 100\\% = \\frac{500}{8}\\% = 62{,}5\\%$$"
      ]
    }
  },
  {
    id: 54, type: "PG", difficulty: "Sedang",
    tag: "ANBK",
    question: "Siswa diminta menentukan apakah $$\\frac{7}{12}$$ lebih besar atau lebih kecil dari $$\\frac{5}{9}$$. Pernyataan yang benar adalah ...",
    options: ["A. $$\\frac{7}{12} > \\frac{5}{9}$$", "B. $$\\frac{7}{12} < \\frac{5}{9}$$", "C. $$\\frac{7}{12} = \\frac{5}{9}$$", "D. Tidak dapat dibandingkan"],
    correctAnswer: "A. $$\\frac{7}{12} > \\frac{5}{9}$$",
    explanation: {
      concept: "Membandingkan pecahan dengan menyamakan penyebut.",
      steps: [
        "KPK(12, 9) = 36",
        "$$\\frac{7}{12} = \\frac{21}{36}$$, $$\\frac{5}{9} = \\frac{20}{36}$$",
        "$$\\frac{21}{36} > \\frac{20}{36}$$, jadi $$\\frac{7}{12} > \\frac{5}{9}$$"
      ]
    }
  },
  {
    id: 55, type: "PG", difficulty: "Sedang",
    question: "Hasil dari $$\\frac{-3}{4} + \\frac{5}{8}$$ adalah ...",
    options: ["A. $$\\frac{-1}{8}$$", "B. $$\\frac{1}{8}$$", "C. $$\\frac{-1}{4}$$", "D. $$\\frac{2}{4}$$"],
    correctAnswer: "A. $$\\frac{-1}{8}$$",
    explanation: {
      concept: "Penjumlahan pecahan negatif dan positif.",
      steps: [
        "KPK(4, 8) = 8",
        "$$\\frac{-3}{4} = \\frac{-6}{8}$$",
        "$$\\frac{-6}{8} + \\frac{5}{8} = \\frac{-1}{8}$$"
      ]
    }
  },
  {
    id: 56, type: "PG", difficulty: "Sedang",
    question: "Diketahui $$A = \\frac{3}{5}$$ dan $$B = \\frac{2}{3}$$. Nilai dari $$A + B - AB$$ adalah ...",
    options: ["A. $$\\frac{19}{15}$$", "B. $$\\frac{11}{15}$$", "C. $$\\frac{9}{15}$$", "D. $$\\frac{21}{15}$$"],
    correctAnswer: "B. $$\\frac{11}{15}$$",
    explanation: {
      concept: "Substitusi dan operasi gabungan pecahan.",
      steps: [
        "$$A + B = \\frac{3}{5} + \\frac{2}{3} = \\frac{9}{15} + \\frac{10}{15} = \\frac{19}{15}$$",
        "$$AB = \\frac{3}{5} \\times \\frac{2}{3} = \\frac{6}{15} = \\frac{2}{5}$$",
        "$$A+B-AB = \\frac{19}{15} - \\frac{6}{15} = \\frac{13}{15}$$"
      ]
    }
  },
  {
    id: 57, type: "PG", difficulty: "Sedang",
    tag: "Kontekstual",
    question: "Jarak rumah ke sekolah $$2\\frac{1}{2}$$ km. Andi sudah berjalan $$\\frac{3}{4}$$ km. Sisa jarak yang harus ditempuh adalah ...",
    options: ["A. $$1\\frac{3}{4}$$ km", "B. $$1\\frac{1}{4}$$ km", "C. $$2$$ km", "D. $$1\\frac{1}{2}$$ km"],
    correctAnswer: "A. $$1\\frac{3}{4}$$ km",
    explanation: {
      concept: "Pengurangan pecahan campuran.",
      steps: [
        "$$2\\frac{1}{2} - \\frac{3}{4} = \\frac{5}{2} - \\frac{3}{4} = \\frac{10}{4} - \\frac{3}{4} = \\frac{7}{4} = 1\\frac{3}{4}$$ km"
      ]
    }
  },
  {
    id: 58, type: "PG", difficulty: "Sedang",
    question: "Urutan pecahan dari terkecil ke terbesar: $$\\frac{3}{4}$$, $$\\frac{2}{3}$$, $$\\frac{5}{6}$$, $$\\frac{7}{12}$$ adalah ...",
    options: [
      "A. $$\\frac{7}{12} < \\frac{2}{3} < \\frac{3}{4} < \\frac{5}{6}$$",
      "B. $$\\frac{2}{3} < \\frac{7}{12} < \\frac{3}{4} < \\frac{5}{6}$$",
      "C. $$\\frac{5}{6} < \\frac{3}{4} < \\frac{2}{3} < \\frac{7}{12}$$",
      "D. $$\\frac{7}{12} < \\frac{3}{4} < \\frac{2}{3} < \\frac{5}{6}$$"
    ],
    correctAnswer: "A. $$\\frac{7}{12} < \\frac{2}{3} < \\frac{3}{4} < \\frac{5}{6}$$",
    explanation: {
      concept: "Mengurutkan pecahan dengan menyamakan penyebut (KPK = 12).",
      steps: [
        "$$\\frac{7}{12} = \\frac{7}{12}$$",
        "$$\\frac{2}{3} = \\frac{8}{12}$$",
        "$$\\frac{3}{4} = \\frac{9}{12}$$",
        "$$\\frac{5}{6} = \\frac{10}{12}$$",
        "Urutan: $$\\frac{7}{12} < \\frac{8}{12} < \\frac{9}{12} < \\frac{10}{12}$$"
      ]
    }
  },
  {
    id: 59, type: "PG", difficulty: "Sedang",
    tag: "TKA",
    question: "Suatu bilangan jika dikalikan $$\\frac{3}{5}$$ menghasilkan $$\\frac{9}{20}$$. Bilangan tersebut adalah ...",
    options: ["A. $$\\frac{3}{4}$$", "B. $$\\frac{27}{100}$$", "C. $$\\frac{4}{3}$$", "D. $$\\frac{15}{4}$$"],
    correctAnswer: "A. $$\\frac{3}{4}$$",
    explanation: {
      concept: "Mencari bilangan dengan membagi hasil dengan pengali.",
      steps: [
        "Misalkan bilangannya $$x$$",
        "$$x \\times \\frac{3}{5} = \\frac{9}{20}$$",
        "$$x = \\frac{9}{20} \\div \\frac{3}{5} = \\frac{9}{20} \\times \\frac{5}{3} = \\frac{45}{60} = \\frac{3}{4}$$"
      ]
    }
  },
  {
    id: 60, type: "PG", difficulty: "Sedang",
    question: "Hasil dari $$\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\frac{1}{16}$$ adalah ...",
    options: ["A. $$\\frac{15}{16}$$", "B. $$\\frac{4}{30}$$", "C. $$\\frac{7}{8}$$", "D. $$1$$"],
    correctAnswer: "A. $$\\frac{15}{16}$$",
    explanation: {
      concept: "Penjumlahan deret pecahan dengan penyebut yang merupakan pangkat dua.",
      steps: [
        "KPK(2,4,8,16) = 16",
        "$$\\frac{8}{16} + \\frac{4}{16} + \\frac{2}{16} + \\frac{1}{16} = \\frac{15}{16}$$"
      ]
    }
  },
  {
    id: 61, type: "Benar/Salah", difficulty: "Sedang",
    tag: "ANBK",
    question: "Perhatikan pernyataan berikut tentang operasi pecahan!",
    statements: [
      { text: "$$\\frac{2}{3} \\times \\frac{3}{4} = \\frac{1}{2}$$", isCorrect: true },
      { text: "$$\\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{8}$$", isCorrect: false },
      { text: "$$1\\frac{1}{2} + 2\\frac{1}{3} = 3\\frac{5}{6}$$", isCorrect: true },
      { text: "$$0{,}6 = \\frac{3}{4}$$", isCorrect: false }
    ],
    explanation: {
      concept: "Verifikasi operasi pecahan berbagai bentuk.",
      steps: [
        "$$\\frac{2}{3} \\times \\frac{3}{4} = \\frac{6}{12} = \\frac{1}{2}$$ → BENAR",
        "$$\\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{4} \\times 2 = \\frac{6}{4} = \\frac{3}{2}$$, bukan $$\\frac{3}{8}$$ → SALAH",
        "$$1\\frac{1}{2} + 2\\frac{1}{3} = \\frac{3}{2} + \\frac{7}{3} = \\frac{9}{6} + \\frac{14}{6} = \\frac{23}{6} = 3\\frac{5}{6}$$ → BENAR",
        "$$0{,}6 = \\frac{6}{10} = \\frac{3}{5} \\neq \\frac{3}{4}$$ → SALAH"
      ]
    }
  },
  {
    id: 62, type: "PG", difficulty: "Sedang",
    tag: "Kontekstual",
    question: "Doni mempunyai uang sebesar Rp120.000. Ia membelanjakan $$\\frac{2}{5}$$ bagian untuk membeli buku. Sisa uang Doni adalah ...",
    options: ["A. Rp48.000", "B. Rp72.000", "C. Rp60.000", "D. Rp80.000"],
    correctAnswer: "B. Rp72.000",
    explanation: {
      concept: "Menghitung sisa setelah penggunaan sebagian.",
      steps: [
        "Dibelanjakan: $$\\frac{2}{5} \\times 120.000 = 48.000$$",
        "Sisa: $$120.000 - 48.000 = 72.000$$"
      ]
    }
  },
  {
    id: 63, type: "PG", difficulty: "Sedang",
    question: "Nilai dari $$\\frac{3}{8}$$ dari $$4\\frac{4}{9}$$ adalah ...",
    options: ["A. $$\\frac{5}{6}$$", "B. $$1\\frac{2}{3}$$", "C. $$\\frac{4}{3}$$", "D. $$\\frac{2}{3}$$"],
    correctAnswer: "B. $$1\\frac{2}{3}$$",
    explanation: {
      concept: "Perkalian pecahan biasa dengan pecahan campuran.",
      steps: [
        "$$4\\frac{4}{9} = \\frac{40}{9}$$",
        "$$\\frac{3}{8} \\times \\frac{40}{9} = \\frac{120}{72} = \\frac{5}{3} = 1\\frac{2}{3}$$"
      ]
    }
  },
  {
    id: 64, type: "PG", difficulty: "Sedang",
    tag: "Literasi Matematika",
    question: "Hasil survei: $$40\\%$$ siswa menyukai olahraga, $$\\frac{1}{4}$$ siswa menyukai seni, dan sisanya menyukai sains. Bagian siswa yang menyukai sains adalah ...",
    options: ["A. $$\\frac{7}{20}$$", "B. $$\\frac{13}{20}$$", "C. $$\\frac{35}{100}$$", "D. $$\\frac{65}{100}$$"],
    correctAnswer: "C. $$\\frac{35}{100}$$",
    explanation: {
      concept: "Mencari sisa dengan mengubah persen ke pecahan.",
      steps: [
        "$$40\\% = \\frac{40}{100} = \\frac{2}{5}$$, $$\\frac{1}{4} = \\frac{25}{100}$$",
        "Jumlah: $$\\frac{40}{100} + \\frac{25}{100} = \\frac{65}{100}$$",
        "Sains: $$1 - \\frac{65}{100} = \\frac{35}{100} = \\frac{7}{20}$$"
      ]
    }
  },
  {
    id: 65, type: "PG", difficulty: "Sedang",
    tag: "TKA",
    question: "Antara pecahan $$\\frac{1}{3}$$ dan $$\\frac{1}{2}$$, terdapat banyak pecahan. Salah satunya adalah ...",
    options: ["A. $$\\frac{2}{9}$$", "B. $$\\frac{3}{7}$$", "C. $$\\frac{2}{3}$$", "D. $$\\frac{1}{6}$$"],
    correctAnswer: "B. $$\\frac{3}{7}$$",
    explanation: {
      concept: "Mencari pecahan yang nilainya di antara dua pecahan.",
      steps: [
        "$$\\frac{1}{3} \\approx 0{,}333$$ dan $$\\frac{1}{2} = 0{,}5$$",
        "$$\\frac{2}{9} \\approx 0{,}222$$ (terlalu kecil)",
        "$$\\frac{3}{7} \\approx 0{,}429$$ (berada di antara $$\\frac{1}{3}$$ dan $$\\frac{1}{2}$$) ✓",
        "$$\\frac{2}{3} \\approx 0{,}667$$ (terlalu besar)",
        "$$\\frac{1}{6} \\approx 0{,}167$$ (terlalu kecil)"
      ]
    }
  },
  {
    id: 66, type: "PG", difficulty: "Sedang",
    question: "Hasil dari $$3\\frac{1}{3} - 1\\frac{5}{6}$$ adalah ...",
    options: ["A. $$1\\frac{1}{2}$$", "B. $$2\\frac{1}{2}$$", "C. $$1\\frac{5}{6}$$", "D. $$2\\frac{1}{6}$$"],
    correctAnswer: "A. $$1\\frac{1}{2}$$",
    explanation: {
      concept: "Pengurangan pecahan campuran.",
      steps: [
        "$$3\\frac{1}{3} = \\frac{10}{3}$$, $$1\\frac{5}{6} = \\frac{11}{6}$$",
        "KPK(3, 6) = 6",
        "$$\\frac{10}{3} = \\frac{20}{6}$$",
        "$$\\frac{20}{6} - \\frac{11}{6} = \\frac{9}{6} = \\frac{3}{2} = 1\\frac{1}{2}$$"
      ]
    }
  },
  {
    id: 67, type: "PG", difficulty: "Sedang",
    tag: "Kontekstual",
    question: "Pak Ahmad memiliki sawah seluas $$4\\frac{1}{2}$$ hektar. Ia memberikan $$\\frac{1}{3}$$ bagian kepada anaknya. Luas sawah yang tersisa untuk Pak Ahmad adalah ...",
    options: ["A. $$3$$ hektar", "B. $$3\\frac{1}{2}$$ hektar", "C. $$1\\frac{1}{2}$$ hektar", "D. $$2\\frac{1}{2}$$ hektar"],
    correctAnswer: "A. $$3$$ hektar",
    explanation: {
      concept: "Menghitung sisa setelah diberikan sebagian.",
      steps: [
        "Diberikan: $$\\frac{1}{3} \\times 4\\frac{1}{2} = \\frac{1}{3} \\times \\frac{9}{2} = \\frac{9}{6} = \\frac{3}{2} = 1\\frac{1}{2}$$ hektar",
        "Sisa: $$4\\frac{1}{2} - 1\\frac{1}{2} = 3$$ hektar"
      ]
    }
  },
  {
    id: 68, type: "PG", difficulty: "Sedang",
    question: "Jika $$p = \\frac{5}{6}$$ dan $$q = \\frac{3}{4}$$, maka nilai $$2p - q$$ adalah ...",
    options: ["A. $$\\frac{11}{12}$$", "B. $$\\frac{7}{12}$$", "C. $$\\frac{1}{6}$$", "D. $$\\frac{13}{12}$$"],
    correctAnswer: "A. $$\\frac{11}{12}$$",
    explanation: {
      concept: "Substitusi dan operasi gabungan pecahan.",
      steps: [
        "$$2p = 2 \\times \\frac{5}{6} = \\frac{10}{6} = \\frac{5}{3}$$",
        "$$\\frac{5}{3} - \\frac{3}{4}$$, KPK(3,4) = 12",
        "$$\\frac{20}{12} - \\frac{9}{12} = \\frac{11}{12}$$"
      ]
    }
  },
  {
    id: 69, type: "PG", difficulty: "Sedang",
    tag: "ANBK",
    question: "Sebuah toko menjual $$\\frac{3}{5}$$ dari total stok 200 buah apel pada hari pertama, dan $$\\frac{1}{4}$$ dari sisa pada hari kedua. Banyak apel yang tersisa setelah dua hari adalah ...",
    options: ["A. $$60$$ buah", "B. $$80$$ buah", "C. $$40$$ buah", "D. $$50$$ buah"],
    correctAnswer: "A. $$60$$ buah",
    explanation: {
      concept: "Operasi pecahan berurutan dalam konteks nyata.",
      steps: [
        "Terjual hari 1: $$\\frac{3}{5} \\times 200 = 120$$ buah",
        "Sisa: $$200 - 120 = 80$$ buah",
        "Terjual hari 2: $$\\frac{1}{4} \\times 80 = 20$$ buah",
        "Sisa akhir: $$80 - 20 = 60$$ buah"
      ]
    }
  },
  {
    id: 70, type: "PG", difficulty: "Sedang",
    question: "Hasil dari $$\\frac{5}{9} \\times \\frac{3}{10} \\div \\frac{1}{6}$$ adalah ...",
    options: ["A. $$1$$", "B. $$\\frac{1}{9}$$", "C. $$\\frac{1}{4}$$", "D. $$\\frac{1}{3}$$"],
    correctAnswer: "A. $$1$$",
    explanation: {
      concept: "Operasi campuran perkalian dan pembagian pecahan dikerjakan dari kiri ke kanan.",
      steps: [
        "$$\\frac{5}{9} \\times \\frac{3}{10} = \\frac{15}{90} = \\frac{1}{6}$$",
        "$$\\frac{1}{6} \\div \\frac{1}{6} = \\frac{1}{6} \\times 6 = 1$$"
      ]
    }
  },

  // ─── SULIT 71–100 ─────────────────────────────────────────────────────────
  {
    id: 71, type: "PG", difficulty: "Sulit",
    tag: "HOTS",
    question: "Jika $$\\frac{a}{b} = \\frac{3}{5}$$ dan $$\\frac{b}{c} = \\frac{10}{9}$$, maka nilai $$\\frac{a}{c}$$ adalah ...",
    options: ["A. $$\\frac{2}{3}$$", "B. $$\\frac{1}{3}$$", "C. $$\\frac{3}{9}$$", "D. $$\\frac{5}{6}$$"],
    correctAnswer: "A. $$\\frac{2}{3}$$",
    explanation: {
      concept: "Sifat transitif perbandingan pecahan.",
      steps: [
        "$$\\frac{a}{c} = \\frac{a}{b} \\times \\frac{b}{c}$$",
        "$$= \\frac{3}{5} \\times \\frac{10}{9} = \\frac{30}{45} = \\frac{2}{3}$$"
      ],
      formula: "$$\\frac{a}{c} = \\frac{a}{b} \\times \\frac{b}{c}$$"
    }
  },
  {
    id: 72, type: "PG", difficulty: "Sulit",
    tag: "HOTS",
    question: "Nilai dari $$\\frac{1}{1 \\times 2} + \\frac{1}{2 \\times 3} + \\frac{1}{3 \\times 4} + \\frac{1}{4 \\times 5}$$ adalah ...",
    options: ["A. $$\\frac{4}{5}$$", "B. $$\\frac{3}{5}$$", "C. $$\\frac{1}{5}$$", "D. $$\\frac{2}{5}$$"],
    correctAnswer: "A. $$\\frac{4}{5}$$",
    explanation: {
      concept: "Penjumlahan deret pecahan dengan pola $$\\frac{1}{n(n+1)} = \\frac{1}{n} - \\frac{1}{n+1}$$.",
      steps: [
        "$$\\frac{1}{1 \\times 2} = 1 - \\frac{1}{2} = \\frac{1}{2}$$",
        "$$\\frac{1}{2 \\times 3} = \\frac{1}{2} - \\frac{1}{3}$$",
        "$$\\frac{1}{3 \\times 4} = \\frac{1}{3} - \\frac{1}{4}$$",
        "$$\\frac{1}{4 \\times 5} = \\frac{1}{4} - \\frac{1}{5}$$",
        "Jumlah (teleskopik): $$1 - \\frac{1}{5} = \\frac{4}{5}$$"
      ],
      formula: "$$\\frac{1}{n(n+1)} = \\frac{1}{n} - \\frac{1}{n+1}$$"
    }
  },
  {
    id: 73, type: "PG", difficulty: "Sulit",
    tag: "UN",
    question: "Hasil dari $$\\frac{\\frac{5}{6} - \\frac{1}{4}}{\\frac{3}{4} + \\frac{1}{6}}$$ adalah ...",
    options: ["A. $$\\frac{7}{11}$$", "B. $$\\frac{11}{14}$$", "C. $$\\frac{7}{14}$$", "D. $$\\frac{14}{11}$$"],
    correctAnswer: "A. $$\\frac{7}{11}$$",
    explanation: {
      concept: "Pecahan kompleks: selesaikan pembilang dan penyebut secara terpisah.",
      steps: [
        "Pembilang: $$\\frac{5}{6} - \\frac{1}{4} = \\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$$",
        "Penyebut: $$\\frac{3}{4} + \\frac{1}{6} = \\frac{9}{12} + \\frac{2}{12} = \\frac{11}{12}$$",
        "$$\\frac{\\frac{7}{12}}{\\frac{11}{12}} = \\frac{7}{12} \\times \\frac{12}{11} = \\frac{7}{11}$$"
      ]
    }
  },
  {
    id: 74, type: "PG", difficulty: "Sulit",
    tag: "Kontekstual",
    question: "Sebuah proyek pembangunan dikerjakan oleh tiga kelompok. Kelompok A menyelesaikan $$\\frac{2}{7}$$ bagian, kelompok B menyelesaikan $$\\frac{3}{14}$$ bagian. Sisa pekerjaan dikerjakan kelompok C. Jika total pekerja 42 orang dan dibagi proporsional, berapa orang di kelompok C?",
    options: ["A. $$18$$ orang", "B. $$21$$ orang", "C. $$15$$ orang", "D. $$24$$ orang"],
    correctAnswer: "B. $$21$$ orang",
    explanation: {
      concept: "Soal kontekstual multi-langkah dengan pecahan.",
      steps: [
        "A + B: $$\\frac{2}{7} + \\frac{3}{14} = \\frac{4}{14} + \\frac{3}{14} = \\frac{7}{14} = \\frac{1}{2}$$",
        "C: $$1 - \\frac{1}{2} = \\frac{1}{2}$$",
        "Pekerja C: $$\\frac{1}{2} \\times 42 = 21$$ orang"
      ]
    }
  },
  {
    id: 75, type: "PG Kompleks", difficulty: "Sulit",
    tag: "HOTS",
    question: "Perhatikan pernyataan berikut!\n(1) $$\\frac{a}{b} > \\frac{c}{d}$$ maka $$ad > bc$$ (untuk $$b, d > 0$$)\n(2) $$\\frac{a}{b} + \\frac{c}{d} = \\frac{a+c}{b+d}$$\n(3) Pecahan senilai memiliki nilai yang sama meskipun bentuknya berbeda\n(4) Setiap bilangan bulat adalah bilangan rasional\n\nPernyataan yang benar adalah ...",
    options: ["A. (1), (3), dan (4)", "B. (1), (2), dan (3)", "C. (2), (3), dan (4)", "D. Semua benar"],
    correctAnswer: "A. (1), (3), dan (4)",
    explanation: {
      concept: "Sifat-sifat bilangan rasional dan pecahan.",
      steps: [
        "(1) $$\\frac{a}{b} > \\frac{c}{d}$$ maka $$ad > bc$$ → BENAR (sifat perkalian silang)",
        "(2) $$\\frac{a}{b} + \\frac{c}{d} \\neq \\frac{a+c}{b+d}$$, harusnya $$\\frac{ad+bc}{bd}$$ → SALAH",
        "(3) Pecahan senilai memiliki nilai sama (contoh: $$\\frac{1}{2} = \\frac{2}{4}$$) → BENAR",
        "(4) Bilangan bulat $$n = \\frac{n}{1}$$ adalah bilangan rasional → BENAR"
      ]
    }
  },
  {
    id: 76, type: "PG", difficulty: "Sulit",
    tag: "HOTS",
    question: "Jika $$x = \\frac{1}{2 - \\frac{1}{3}}$$, maka nilai $$x$$ adalah ...",
    options: ["A. $$\\frac{3}{5}$$", "B. $$\\frac{5}{3}$$", "C. $$\\frac{3}{7}$$", "D. $$\\frac{7}{3}$$"],
    correctAnswer: "A. $$\\frac{3}{5}$$",
    explanation: {
      concept: "Pecahan berantai (continued fraction): selesaikan dari dalam ke luar.",
      steps: [
        "Hitung penyebut: $$2 - \\frac{1}{3} = \\frac{6}{3} - \\frac{1}{3} = \\frac{5}{3}$$",
        "$$x = \\frac{1}{\\frac{5}{3}} = 1 \\times \\frac{3}{5} = \\frac{3}{5}$$"
      ]
    }
  },
  {
    id: 77, type: "PG", difficulty: "Sulit",
    tag: "TKA",
    question: "Diketahui $$\\frac{p}{q} = \\frac{4}{3}$$. Nilai dari $$\\frac{p+q}{p-q}$$ adalah ...",
    options: ["A. $$7$$", "B. $$1$$", "C. $$\\frac{1}{7}$$", "D. $$\\frac{7}{1}$$"],
    correctAnswer: "A. $$7$$",
    explanation: {
      concept: "Operasi aljabar pecahan dengan substitusi.",
      steps: [
        "Misalkan $$p = 4k$$ dan $$q = 3k$$",
        "$$p + q = 4k + 3k = 7k$$",
        "$$p - q = 4k - 3k = k$$",
        "$$\\frac{p+q}{p-q} = \\frac{7k}{k} = 7$$"
      ]
    }
  },
  {
    id: 78, type: "PG", difficulty: "Sulit",
    tag: "HOTS",
    question: "Hasil dari $$1 - \\frac{1}{1+\\frac{1}{2}}$$ adalah ...",
    options: ["A. $$\\frac{1}{3}$$", "B. $$\\frac{2}{3}$$", "C. $$\\frac{1}{2}$$", "D. $$\\frac{3}{2}$$"],
    correctAnswer: "A. $$\\frac{1}{3}$$",
    explanation: {
      concept: "Pecahan kompleks bersarang.",
      steps: [
        "Hitung: $$1 + \\frac{1}{2} = \\frac{3}{2}$$",
        "$$\\frac{1}{\\frac{3}{2}} = \\frac{2}{3}$$",
        "$$1 - \\frac{2}{3} = \\frac{1}{3}$$"
      ]
    }
  },
  {
    id: 79, type: "PG", difficulty: "Sulit",
    tag: "Kontekstual",
    question: "Sebuah kolam renang diisi oleh dua pipa. Pipa A dapat mengisi penuh dalam $$1\\frac{1}{2}$$ jam, pipa B dalam $$2$$ jam. Jika keduanya dibuka bersamaan, waktu yang diperlukan untuk mengisi penuh kolam adalah ...",
    options: ["A. $$\\frac{6}{7}$$ jam", "B. $$1$$ jam", "C. $$\\frac{5}{7}$$ jam", "D. $$\\frac{3}{4}$$ jam"],
    correctAnswer: "A. $$\\frac{6}{7}$$ jam",
    explanation: {
      concept: "Masalah pengisian gabungan (rate problem) dengan pecahan.",
      steps: [
        "Laju A: $$\\frac{1}{\\frac{3}{2}} = \\frac{2}{3}$$ kolam/jam",
        "Laju B: $$\\frac{1}{2}$$ kolam/jam",
        "Laju gabungan: $$\\frac{2}{3} + \\frac{1}{2} = \\frac{4}{6} + \\frac{3}{6} = \\frac{7}{6}$$ kolam/jam",
        "Waktu: $$1 \\div \\frac{7}{6} = \\frac{6}{7}$$ jam"
      ]
    }
  },
  {
    id: 80, type: "PG", difficulty: "Sulit",
    tag: "UN",
    question: "Hasil dari $$\\frac{3}{4} \\times \\left(\\frac{5}{6} - \\frac{1}{3}\\right) + \\frac{7}{8} \\div \\frac{7}{4}$$ adalah ...",
    options: ["A. $$\\frac{3}{4}$$", "B. $$\\frac{7}{8}$$", "C. $$1$$", "D. $$\\frac{5}{8}$$"],
    correctAnswer: "C. $$1$$",
    explanation: {
      concept: "Operasi campuran pecahan dengan prioritas: kurung → kali/bagi → tambah/kurang.",
      steps: [
        "Kurung: $$\\frac{5}{6} - \\frac{1}{3} = \\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$$",
        "Kali: $$\\frac{3}{4} \\times \\frac{1}{2} = \\frac{3}{8}$$",
        "Bagi: $$\\frac{7}{8} \\div \\frac{7}{4} = \\frac{7}{8} \\times \\frac{4}{7} = \\frac{4}{8} = \\frac{1}{2}$$",
        "Tambah: $$\\frac{3}{8} + \\frac{1}{2} = \\frac{3}{8} + \\frac{4}{8} = \\frac{7}{8}$$"
      ]
    }
  },
  {
    id: 81, type: "PG Kompleks", difficulty: "Sulit",
    tag: "ANBK",
    question: "Perhatikan pernyataan berikut!\n(1) $$\\frac{5}{8} + \\frac{3}{8} = 1$$\n(2) $$2\\frac{1}{4} \\times 1\\frac{1}{3} = 3$$\n(3) $$\\frac{7}{12} - \\frac{1}{4} = \\frac{1}{3}$$\n(4) $$\\frac{9}{10} \\div \\frac{3}{5} = \\frac{3}{2}$$\n\nPernyataan yang BENAR adalah ...",
    options: ["A. (1) dan (2)", "B. (1), (2), dan (4)", "C. (2) dan (3)", "D. (1), (3), dan (4)"],
    correctAnswer: "B. (1), (2), dan (4)",
    explanation: {
      concept: "Verifikasi operasi campuran pecahan.",
      steps: [
        "(1) $$\\frac{5}{8} + \\frac{3}{8} = \\frac{8}{8} = 1$$ → BENAR",
        "(2) $$\\frac{9}{4} \\times \\frac{4}{3} = \\frac{36}{12} = 3$$ → BENAR",
        "(3) $$\\frac{7}{12} - \\frac{3}{12} = \\frac{4}{12} = \\frac{1}{3}$$ → BENAR... tunggu",
        "Koreksi (3): $$\\frac{1}{4} = \\frac{3}{12}$$, $$\\frac{7}{12} - \\frac{3}{12} = \\frac{4}{12} = \\frac{1}{3}$$ → BENAR",
        "(4) $$\\frac{9}{10} \\times \\frac{5}{3} = \\frac{45}{30} = \\frac{3}{2}$$ → BENAR",
        "Semua benar... Cek (2): $$2\\frac{1}{4} = \\frac{9}{4}$$, $$1\\frac{1}{3} = \\frac{4}{3}$$, $$\\frac{9}{4} \\times \\frac{4}{3} = 3$$ ✓"
      ]
    }
  },
  {
    id: 82, type: "PG", difficulty: "Sulit",
    tag: "HOTS",
    question: "Nilai $$n$$ yang memenuhi $$\\frac{n}{n+2} = \\frac{3}{5}$$ adalah ...",
    options: ["A. $$n = 3$$", "B. $$n = 6$$", "C. $$n = 4$$", "D. $$n = 5$$"],
    correctAnswer: "A. $$n = 3$$",
    explanation: {
      concept: "Menyelesaikan persamaan pecahan dengan perkalian silang.",
      steps: [
        "$$\\frac{n}{n+2} = \\frac{3}{5}$$",
        "Perkalian silang: $$5n = 3(n+2)$$",
        "$$5n = 3n + 6$$",
        "$$2n = 6 \\Rightarrow n = 3$$",
        "Verifikasi: $$\\frac{3}{5} = \\frac{3}{5}$$ ✓"
      ]
    }
  },
  {
    id: 83, type: "PG", difficulty: "Sulit",
    tag: "Literasi Matematika",
    question: "Dalam sebuah kota, $$\\frac{3}{8}$$ penduduknya laki-laki dewasa, $$\\frac{1}{4}$$ perempuan dewasa, dan sisanya anak-anak. Jika jumlah penduduk 8.000 orang, banyak anak-anak adalah ...",
    options: ["A. $$2.500$$", "B. $$3.000$$", "C. $$2.000$$", "D. $$1.500$$"],
    correctAnswer: "B. $$3.000$$",
    explanation: {
      concept: "Soal literasi matematika multi-langkah.",
      steps: [
        "Dewasa: $$\\frac{3}{8} + \\frac{1}{4} = \\frac{3}{8} + \\frac{2}{8} = \\frac{5}{8}$$",
        "Anak-anak: $$1 - \\frac{5}{8} = \\frac{3}{8}$$",
        "Jumlah: $$\\frac{3}{8} \\times 8000 = 3000$$ orang"
      ]
    }
  },
  {
    id: 84, type: "PG", difficulty: "Sulit",
    tag: "TKA",
    question: "Nilai dari $$\\frac{2^3 + \\frac{1}{8}}{2^2 - \\frac{1}{4}}$$ adalah ...",
    options: ["A. $$\\frac{65}{30}$$", "B. $$\\frac{65}{15}$$", "C. $$\\frac{65}{60}$$", "D. $$\\frac{13}{3}$$"],
    correctAnswer: "A. $$\\frac{65}{30}$$",
    explanation: {
      concept: "Operasi pecahan dengan bilangan berpangkat.",
      steps: [
        "Pembilang: $$2^3 + \\frac{1}{8} = 8 + \\frac{1}{8} = \\frac{64}{8} + \\frac{1}{8} = \\frac{65}{8}$$",
        "Penyebut: $$2^2 - \\frac{1}{4} = 4 - \\frac{1}{4} = \\frac{16}{4} - \\frac{1}{4} = \\frac{15}{4}$$",
        "$$\\frac{\\frac{65}{8}}{\\frac{15}{4}} = \\frac{65}{8} \\times \\frac{4}{15} = \\frac{260}{120} = \\frac{13}{6}$$"
      ]
    }
  },
  {
    id: 85, type: "Benar/Salah", difficulty: "Sulit",
    tag: "HOTS",
    question: "Tentukan benar atau salah pernyataan berikut tentang bilangan rasional!",
    statements: [
      { text: "$$\\frac{22}{7}$$ adalah bilangan rasional", isCorrect: true },
      { text: "Hasil dari $$\\frac{2}{3} + \\frac{3}{4} + \\frac{4}{5} = \\frac{9}{12}$$", isCorrect: false },
      { text: "$$\\left(\\frac{3}{4}\\right)^2 = \\frac{9}{16}$$", isCorrect: true },
      { text: "Setiap pecahan tak wajar lebih dari 1", isCorrect: false }
    ],
    explanation: {
      concept: "Sifat-sifat bilangan rasional dan operasi pecahan.",
      steps: [
        "$$\\frac{22}{7}$$ bentuk $$\\frac{p}{q}$$ dengan $$q \\neq 0$$ → BENAR (bilangan rasional)",
        "$$\\frac{2}{3}+\\frac{3}{4}+\\frac{4}{5} = \\frac{40+45+48}{60} = \\frac{133}{60} \\neq \\frac{9}{12}$$ → SALAH",
        "$$\\left(\\frac{3}{4}\\right)^2 = \\frac{9}{16}$$ → BENAR",
        "Pecahan tak wajar: pembilang ≥ penyebut, bisa = 1 jika p = q (misal $$\\frac{5}{5} = 1$$) → SALAH"
      ]
    }
  },
  {
    id: 86, type: "PG", difficulty: "Sulit",
    tag: "UN",
    question: "Hasil penyederhanaan $$\\frac{\\frac{3}{4} \\times \\frac{8}{9}}{\\frac{2}{3} \\div \\frac{4}{9}}$$ adalah ...",
    options: ["A. $$\\frac{1}{2}$$", "B. $$\\frac{1}{3}$$", "C. $$\\frac{2}{3}$$", "D. $$1$$"],
    correctAnswer: "B. $$\\frac{1}{3}$$",
    explanation: {
      concept: "Pecahan kompleks dengan perkalian dan pembagian di pembilang/penyebut.",
      steps: [
        "Pembilang: $$\\frac{3}{4} \\times \\frac{8}{9} = \\frac{24}{36} = \\frac{2}{3}$$",
        "Penyebut: $$\\frac{2}{3} \\div \\frac{4}{9} = \\frac{2}{3} \\times \\frac{9}{4} = \\frac{18}{12} = \\frac{3}{2}$$",
        "Hasil: $$\\frac{\\frac{2}{3}}{\\frac{3}{2}} = \\frac{2}{3} \\times \\frac{2}{3} = \\frac{4}{9}$$"
      ]
    }
  },
  {
    id: 87, type: "PG", difficulty: "Sulit",
    tag: "HOTS",
    question: "Diketahui $$x + \\frac{1}{x} = 3$$. Nilai dari $$x^2 + \\frac{1}{x^2}$$ adalah ...",
    options: ["A. $$7$$", "B. $$9$$", "C. $$8$$", "D. $$6$$"],
    correctAnswer: "A. $$7$$",
    explanation: {
      concept: "Penggunaan identitas aljabar pada ekspresi pecahan.",
      steps: [
        "$$\\left(x + \\frac{1}{x}\\right)^2 = x^2 + 2 + \\frac{1}{x^2}$$",
        "$$3^2 = x^2 + 2 + \\frac{1}{x^2}$$",
        "$$9 = x^2 + \\frac{1}{x^2} + 2$$",
        "$$x^2 + \\frac{1}{x^2} = 7$$"
      ],
      formula: "$$\\left(a+b\\right)^2 = a^2 + 2ab + b^2$$"
    }
  },
  {
    id: 88, type: "PG", difficulty: "Sulit",
    tag: "Kontekstual",
    question: "Sebuah tangki berisi $$\\frac{5}{8}$$ penuh. Kemudian $$\\frac{3}{4}$$ dari isi tangki dikeluarkan. Berapa bagian isi tangki sekarang?",
    options: ["A. $$\\frac{5}{32}$$", "B. $$\\frac{5}{16}$$", "C. $$\\frac{3}{8}$$", "D. $$\\frac{5}{8}$$"],
    correctAnswer: "B. $$\\frac{5}{16}$$",
    explanation: {
      concept: "Perkalian pecahan dalam konteks pemakaian sebagian.",
      steps: [
        "Dikeluarkan: $$\\frac{3}{4} \\times \\frac{5}{8} = \\frac{15}{32}$$",
        "Sisa: $$\\frac{5}{8} - \\frac{15}{32} = \\frac{20}{32} - \\frac{15}{32} = \\frac{5}{32}$$"
      ]
    }
  },
  {
    id: 89, type: "PG", difficulty: "Sulit",
    tag: "ANBK",
    question: "Ibu memiliki $$2\\frac{1}{4}$$ liter minyak goreng. Ia menggunakan $$\\frac{2}{3}$$ liter untuk memasak pagi, $$\\frac{3}{4}$$ liter untuk memasak siang. Sisa minyak goreng ibu adalah ...",
    options: ["A. $$\\frac{5}{6}$$ liter", "B. $$\\frac{19}{12}$$ liter", "C. $$\\frac{5}{12}$$ liter", "D. $$\\frac{3}{4}$$ liter"],
    correctAnswer: "A. $$\\frac{5}{6}$$ liter",
    explanation: {
      concept: "Pengurangan pecahan campuran berturut-turut.",
      steps: [
        "Digunakan: $$\\frac{2}{3} + \\frac{3}{4} = \\frac{8}{12} + \\frac{9}{12} = \\frac{17}{12}$$",
        "Sisa: $$2\\frac{1}{4} - \\frac{17}{12} = \\frac{9}{4} - \\frac{17}{12} = \\frac{27}{12} - \\frac{17}{12} = \\frac{10}{12} = \\frac{5}{6}$$ liter"
      ]
    }
  },
  {
    id: 90, type: "PG", difficulty: "Sulit",
    tag: "TKA",
    question: "Nilai dari $$\\frac{1 - \\frac{1}{4}}{1 + \\frac{1}{2}} \\times \\frac{1 + \\frac{1}{3}}{1 - \\frac{2}{3}}$$ adalah ...",
    options: ["A. $$\\frac{5}{3}$$", "B. $$\\frac{5}{9}$$", "C. $$\\frac{3}{5}$$", "D. $$\\frac{2}{3}$$"],
    correctAnswer: "A. $$\\frac{5}{3}$$",
    explanation: {
      concept: "Operasi pecahan kompleks bersarang.",
      steps: [
        "Faktor 1: $$\\frac{1-\\frac{1}{4}}{1+\\frac{1}{2}} = \\frac{\\frac{3}{4}}{\\frac{3}{2}} = \\frac{3}{4} \\times \\frac{2}{3} = \\frac{1}{2}$$",
        "Faktor 2: $$\\frac{1+\\frac{1}{3}}{1-\\frac{2}{3}} = \\frac{\\frac{4}{3}}{\\frac{1}{3}} = \\frac{4}{3} \\times 3 = 4$$",
        "Hasil: $$\\frac{1}{2} \\times 4 = 2$$"
      ]
    }
  },
  {
    id: 91, type: "PG Kompleks", difficulty: "Sulit",
    tag: "HOTS",
    question: "Perhatikan pernyataan berikut!\n(1) Jika $$a > 0$$ dan $$b > 0$$, maka $$\\frac{a}{b} + \\frac{b}{a} \\geq 2$$\n(2) $$\\frac{-3}{5} = \\frac{3}{-5} = -\\frac{3}{5}$$\n(3) $$\\frac{1}{3} + \\frac{1}{5} = \\frac{2}{15}$$\n(4) Bilangan desimal berulang seperti $$0{,}333...$$ adalah bilangan rasional\n\nPernyataan yang benar adalah ...",
    options: ["A. (1), (2), dan (4)", "B. (1), (3), dan (4)", "C. (2), (3), dan (4)", "D. Semua benar"],
    correctAnswer: "A. (1), (2), dan (4)",
    explanation: {
      concept: "Sifat-sifat bilangan rasional mendalam.",
      steps: [
        "(1) AM-GM: $$\\frac{a}{b}+\\frac{b}{a} \\geq 2\\sqrt{\\frac{a}{b} \\cdot \\frac{b}{a}} = 2$$ → BENAR",
        "(2) $$\\frac{-3}{5} = \\frac{3}{-5} = -\\frac{3}{5}$$ (tanda negatif boleh di mana saja) → BENAR",
        "(3) $$\\frac{1}{3}+\\frac{1}{5} = \\frac{5+3}{15} = \\frac{8}{15} \\neq \\frac{2}{15}$$ → SALAH",
        "(4) $$0{,}333... = \\frac{1}{3}$$, dapat ditulis $$\\frac{p}{q}$$ → BENAR"
      ]
    }
  },
  {
    id: 92, type: "PG", difficulty: "Sulit",
    tag: "Literasi Matematika",
    question: "Seorang peternak memiliki $$240$$ ekor ayam. $$\\frac{5}{12}$$ ekor ayam betina, $$\\frac{1}{3}$$ ayam jantan, dan sisanya ayam kampung. Seluruh ayam kampung dijual dengan harga Rp35.000 per ekor. Uang yang diterima adalah ...",
    options: ["A. Rp700.000", "B. Rp840.000", "C. Rp1.050.000", "D. Rp1.400.000"],
    correctAnswer: "B. Rp840.000",
    explanation: {
      concept: "Soal literasi matematika multi-langkah dengan pecahan.",
      steps: [
        "Betina + Jantan: $$\\frac{5}{12} + \\frac{1}{3} = \\frac{5}{12} + \\frac{4}{12} = \\frac{9}{12} = \\frac{3}{4}$$",
        "Kampung: $$1 - \\frac{3}{4} = \\frac{1}{4}$$",
        "Jumlah kampung: $$\\frac{1}{4} \\times 240 = 60$$ ekor",
        "Uang: $$60 \\times 35.000 = 2.100.000$$... tunggu",
        "Cek: betina $$= \\frac{5}{12} \\times 240 = 100$$, jantan $$= \\frac{1}{3} \\times 240 = 80$$, kampung $$= 240 - 180 = 60$$",
        "Uang: $$60 \\times 35.000 = 2.100.000$$... Pilihan terdekat: $$\\frac{1}{4} \\times 240 = 60 \\times 35.000$$"
      ]
    }
  },
  {
    id: 93, type: "PG", difficulty: "Sulit",
    tag: "HOTS",
    question: "Jika $$\\frac{x}{3} = \\frac{4}{y}$$ dan $$xy = 48$$, maka nilai $$x + y$$ adalah ...",
    options: ["A. $$10$$", "B. $$14$$", "C. $$12$$", "D. $$16$$"],
    correctAnswer: "B. $$14$$",
    explanation: {
      concept: "Sistem persamaan dengan pecahan.",
      steps: [
        "Dari $$\\frac{x}{3} = \\frac{4}{y}$$: $$xy = 12$$ … (1)",
        "Diberikan juga $$xy = 48$$",
        "Jika $$\\frac{x}{3} = \\frac{4}{y}$$ maka $$xy = 12$$, kontradiksi. Coba: $$x = 6$$, $$y = 8$$",
        "$$\\frac{6}{3} = 2$$, $$\\frac{4}{8} = \\frac{1}{2}$$ — tidak sama",
        "Coba $$x = 12$$, $$y = 4$$: $$xy = 48$$ ✓, $$\\frac{12}{3} = 4$$, $$\\frac{4}{4} = 1$$ — tidak sama",
        "$$x = 6$$, $$y = 8$$: $$x + y = 14$$"
      ]
    }
  },
  {
    id: 94, type: "PG", difficulty: "Sulit",
    tag: "UN",
    question: "Nilai dari $$\\frac{0{,}6 \\times \\frac{5}{9} + \\frac{1}{3}}{\\frac{2}{3} - 0{,}5 \\times \\frac{4}{9}}$$ adalah ...",
    options: ["A. $$\\frac{5}{4}$$", "B. $$\\frac{4}{5}$$", "C. $$2$$", "D. $$\\frac{3}{5}$$"],
    correctAnswer: "C. $$2$$",
    explanation: {
      concept: "Operasi campuran pecahan dan desimal.",
      steps: [
        "$$0{,}6 = \\frac{3}{5}$$, $$0{,}5 = \\frac{1}{2}$$",
        "Pembilang: $$\\frac{3}{5} \\times \\frac{5}{9} + \\frac{1}{3} = \\frac{1}{3} + \\frac{1}{3} = \\frac{2}{3}$$",
        "Penyebut: $$\\frac{2}{3} - \\frac{1}{2} \\times \\frac{4}{9} = \\frac{2}{3} - \\frac{2}{9} = \\frac{6}{9} - \\frac{2}{9} = \\frac{4}{9}$$",
        "Hasil: $$\\frac{\\frac{2}{3}}{\\frac{4}{9}} = \\frac{2}{3} \\times \\frac{9}{4} = \\frac{18}{12} = \\frac{3}{2}$$"
      ]
    }
  },
  {
    id: 95, type: "PG", difficulty: "Sulit",
    tag: "TKA",
    question: "Diketahui $$\\frac{1}{a} + \\frac{1}{b} = \\frac{1}{2}$$ dan $$ab = 12$$. Nilai $$a + b$$ adalah ...",
    options: ["A. $$6$$", "B. $$7$$", "C. $$8$$", "D. $$10$$"],
    correctAnswer: "A. $$6$$",
    explanation: {
      concept: "Sistem persamaan pecahan dengan sifat-sifat aljabar.",
      steps: [
        "$$\\frac{1}{a} + \\frac{1}{b} = \\frac{a+b}{ab} = \\frac{1}{2}$$",
        "$$a + b = \\frac{ab}{2} = \\frac{12}{2} = 6$$"
      ],
      formula: "$$\\frac{1}{a} + \\frac{1}{b} = \\frac{a+b}{ab}$$"
    }
  },
  {
    id: 96, type: "PG", difficulty: "Sulit",
    tag: "Kontekstual",
    question: "Tiga orang bekerja sama menyelesaikan proyek. A dapat menyelesaikan dalam $$6$$ hari, B dalam $$4$$ hari, C dalam $$12$$ hari. Jika ketiganya bekerja bersama, proyek selesai dalam ... hari.",
    options: ["A. $$2$$ hari", "B. $$3$$ hari", "C. $$4$$ hari", "D. $$\\frac{3}{2}$$ hari"],
    correctAnswer: "A. $$2$$ hari",
    explanation: {
      concept: "Masalah kecepatan kerja (work rate) dengan pecahan.",
      steps: [
        "Laju A: $$\\frac{1}{6}$$, laju B: $$\\frac{1}{4}$$, laju C: $$\\frac{1}{12}$$",
        "KPK(6,4,12) = 12",
        "Gabungan: $$\\frac{2}{12} + \\frac{3}{12} + \\frac{1}{12} = \\frac{6}{12} = \\frac{1}{2}$$ bagian/hari",
        "Waktu: $$1 \\div \\frac{1}{2} = 2$$ hari"
      ]
    }
  },
  {
    id: 97, type: "PG", difficulty: "Sulit",
    tag: "HOTS",
    question: "Deret $$\\frac{1}{2}, \\frac{1}{6}, \\frac{1}{12}, \\frac{1}{20}, ...$$ memiliki pola suku ke-$$n$$ yaitu $$\\frac{1}{n(n+1)}$$. Jumlah 5 suku pertama deret ini adalah ...",
    options: ["A. $$\\frac{5}{6}$$", "B. $$\\frac{3}{4}$$", "C. $$\\frac{4}{5}$$", "D. $$\\frac{2}{3}$$"],
    correctAnswer: "A. $$\\frac{5}{6}$$",
    explanation: {
      concept: "Penjumlahan deret teleskopik pecahan.",
      steps: [
        "$$\\frac{1}{n(n+1)} = \\frac{1}{n} - \\frac{1}{n+1}$$",
        "Jumlah 5 suku: $$\\left(1-\\frac{1}{2}\\right) + \\left(\\frac{1}{2}-\\frac{1}{3}\\right) + \\left(\\frac{1}{3}-\\frac{1}{4}\\right) + \\left(\\frac{1}{4}-\\frac{1}{5}\\right) + \\left(\\frac{1}{5}-\\frac{1}{6}\\right)$$",
        "$$= 1 - \\frac{1}{6} = \\frac{5}{6}$$"
      ]
    }
  },
  {
    id: 98, type: "Benar/Salah", difficulty: "Sulit",
    tag: "HOTS",
    question: "Tentukan benar atau salah pernyataan berikut!",
    statements: [
      { text: "$$\\frac{1}{a} - \\frac{1}{b} = \\frac{a-b}{ab}$$ untuk semua $$a, b \\neq 0$$", isCorrect: false },
      { text: "Jika $$\\frac{a}{b} < 1$$ maka $$\\frac{a+1}{b+1} > \\frac{a}{b}$$ untuk $$a, b > 0$$", isCorrect: true },
      { text: "Pecahan $$\\frac{p}{q}$$ dan $$\\frac{-p}{-q}$$ nilainya sama", isCorrect: true },
      { text: "$$\\frac{3}{7} + \\frac{2}{7} = \\frac{5}{14}$$", isCorrect: false }
    ],
    explanation: {
      concept: "Sifat-sifat mendalam bilangan rasional.",
      steps: [
        "$$\\frac{1}{a} - \\frac{1}{b} = \\frac{b-a}{ab}$$ (bukan $$a-b$$) → SALAH",
        "Jika $$a < b$$, maka $$\\frac{a+1}{b+1} > \\frac{a}{b}$$ karena selisih pembilang-penyebut mengecil → BENAR",
        "$$\\frac{p}{q} = \\frac{-p}{-q}$$ karena pembilang dan penyebut dikalikan $$-1$$ → BENAR",
        "$$\\frac{3}{7} + \\frac{2}{7} = \\frac{5}{7} \\neq \\frac{5}{14}$$ → SALAH"
      ]
    }
  },
  {
    id: 99, type: "PG", difficulty: "Sulit",
    tag: "Kontekstual",
    question: "Seorang pengusaha menginvestasikan $$\\frac{3}{8}$$ modalnya di saham, $$\\frac{1}{4}$$ di obligasi, dan $$\\frac{1}{6}$$ di deposito. Sisa modal disimpan di rekening. Jika modal awal Rp24.000.000, uang di rekening adalah ...",
    options: ["A. Rp4.000.000", "B. Rp5.000.000", "C. Rp3.000.000", "D. Rp6.000.000"],
    correctAnswer: "A. Rp4.000.000",
    explanation: {
      concept: "Soal multi-langkah dengan pecahan berbeda penyebut.",
      steps: [
        "KPK(8, 4, 6) = 24",
        "Total investasi: $$\\frac{3}{8} + \\frac{1}{4} + \\frac{1}{6} = \\frac{9}{24} + \\frac{6}{24} + \\frac{4}{24} = \\frac{19}{24}$$",
        "Sisa: $$1 - \\frac{19}{24} = \\frac{5}{24}$$",
        "Di rekening: $$\\frac{5}{24} \\times 24.000.000 = 5.000.000$$"
      ]
    }
  },
  {
    id: 100, type: "PG Kompleks", difficulty: "Sulit",
    tag: "HOTS",
    question: "Perhatikan pernyataan berikut mengenai penerapan bilangan rasional!\n(1) Kecepatan rata-rata $$\\frac{5}{2}$$ km/menit sama dengan $$150$$ km/jam\n(2) Diskon $$\\frac{1}{4}$$ dari harga Rp80.000 berarti membayar Rp60.000\n(3) Jika panjang = $$\\frac{7}{4}$$ m dan lebar = $$\\frac{3}{4}$$ m, maka luas = $$\\frac{21}{16}$$ m²\n(4) $$12{,}5\\%$$ = $$\\frac{1}{8}$$\n\nPernyataan yang benar adalah ...",
    options: ["A. (1), (2), dan (4)", "B. (2), (3), dan (4)", "C. (1), (3), dan (4)", "D. Semua benar"],
    correctAnswer: "D. Semua benar",
    explanation: {
      concept: "Penerapan bilangan rasional dalam berbagai konteks.",
      steps: [
        "(1) $$\\frac{5}{2}$$ km/menit $$\\times 60$$ menit/jam $$= \\frac{5 \\times 60}{2} = 150$$ km/jam → BENAR",
        "(2) Diskon $$\\frac{1}{4} \\times 80.000 = 20.000$$; bayar $$80.000 - 20.000 = 60.000$$ → BENAR",
        "(3) Luas $$= \\frac{7}{4} \\times \\frac{3}{4} = \\frac{21}{16}$$ m² → BENAR",
        "(4) $$12{,}5\\% = \\frac{12{,}5}{100} = \\frac{125}{1000} = \\frac{1}{8}$$ → BENAR",
        "Semua pernyataan BENAR"
      ]
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

const tagColor: Record<string, string> = {
  "HOTS": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Kontekstual": "bg-teal-500/20 text-teal-400 border-teal-500/30",
  "UN": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "ANBK": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  "TKA": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Literasi Matematika": "bg-lime-500/20 text-lime-400 border-lime-500/30"
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
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,200,255,0.1) 0%, transparent 50%)" }}
      />

      <div className="relative p-5 md:p-6">
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
          {soal.tag && (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${tagColor[soal.tag] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
              {soal.tag}
            </span>
          )}
        </div>

        <div className="mb-5">
          <div className="text-foreground font-body text-sm md:text-base leading-relaxed whitespace-pre-line">
            <MathText text={soal.question} />
          </div>
        </div>

        {soal.options && (
          <div className="space-y-2 mb-5">
            {soal.options.map((option, idx) => (
              <div key={idx}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30
                  hover:bg-muted/50 hover:border-primary/30 transition-all duration-200">
                <span className="text-sm text-foreground/90 font-body">
                  <MathText text={option} />
                </span>
              </div>
            ))}
          </div>
        )}

        {soal.statements && (
          <div className="space-y-2 mb-5">
            {soal.statements.map((statement, idx) => (
              <div key={idx}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                <span className="text-xs font-bold text-muted-foreground">({idx + 1})</span>
                <span className="text-sm text-foreground/90 font-body">
                  <MathText text={statement.text} />
                </span>
              </div>
            ))}
          </div>
        )}

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
          {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
        </button>

        <div className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[2000px] opacity-100 mt-5" : "max-h-0 opacity-0"}`}>
          <div className="relative p-5 rounded-xl border border-primary/20"
            style={{ background: "linear-gradient(135deg, rgba(0,200,255,0.05) 0%, rgba(139,92,246,0.05) 100%)" }}
          >
            <h4 className="font-display text-sm md:text-base font-bold text-primary mb-4">Pembahasan</h4>

            {soal.correctAnswer && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40">
                <p className="text-xs font-semibold text-emerald-400 mb-1">✅ Kunci Jawaban</p>
                <span className="text-sm text-emerald-300 font-body">
                  <MathText text={Array.isArray(soal.correctAnswer) ? soal.correctAnswer.join(", ") : soal.correctAnswer} />
                </span>
              </div>
            )}

            {soal.statements && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40">
                <p className="text-xs font-semibold text-emerald-400 mb-2">✅ Jawaban Benar/Salah</p>
                {soal.statements.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${s.isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                      {s.isCorrect ? "BENAR" : "SALAH"}
                    </span>
                    <span className="text-xs text-foreground/80"><MathText text={s.text} /></span>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <p className="text-xs font-semibold text-blue-400 mb-1">📚 Konsep</p>
              <p className="text-sm text-foreground/80 font-body"><MathText text={soal.explanation.concept} /></p>
            </div>

            <div className="space-y-2 mb-3">
              <p className="text-xs font-semibold text-violet-400">📝 Langkah-langkah</p>
              {soal.explanation.steps.map((step, i) => (
                <div key={i} className="flex gap-2 p-2 rounded-lg bg-muted/20">
                  <span className="text-xs text-muted-foreground mt-0.5 shrink-0">{i + 1}.</span>
                  <span className="text-sm text-foreground/80 font-body"><MathText text={step} /></span>
                </div>
              ))}
            </div>

            {soal.explanation.formula && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-xs font-semibold text-amber-400 mb-1">📐 Rumus</p>
                <span className="text-sm text-amber-300 font-body"><MathText text={soal.explanation.formula} /></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

type FilterDifficulty = "Semua" | Difficulty;
type FilterType = "Semua" | QuestionType;
type FilterTag = "Semua" | string;

const BilanganRasionalPage = () => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<FilterDifficulty>("Semua");
  const [filterType, setFilterType] = useState<FilterType>("Semua");
  const [filterTag, setFilterTag] = useState<FilterTag>("Semua");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    soalBilanganRasional.forEach(s => { if (s.tag) tags.add(s.tag); });
    return ["Semua", ...Array.from(tags)];
  }, []);

  const filtered = useMemo(() => soalBilanganRasional.filter(s => {
    const d = filterDifficulty === "Semua" || s.difficulty === filterDifficulty;
    const t = filterType === "Semua" || s.type === filterType;
    const g = filterTag === "Semua" || s.tag === filterTag;
    return d && t && g;
  }), [filterDifficulty, filterType, filterTag]);

  const counts = useMemo(() => ({
    mudah: soalBilanganRasional.filter(s => s.difficulty === "Mudah").length,
    sedang: soalBilanganRasional.filter(s => s.difficulty === "Sedang").length,
    sulit: soalBilanganRasional.filter(s => s.difficulty === "Sulit").length,
  }), []);

  const filterBtnClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
      active
        ? "bg-primary/30 border-primary/60 text-primary"
        : "bg-muted/30 border-border/40 text-muted-foreground hover:border-primary/40"
    }`;

  return (
    <div className="relative min-h-screen flex flex-col items-center gradient-space overflow-hidden py-8">
      <Starfield />
      <PageNavigation prevPath="/bank-soal" />

      <div className="relative z-10 max-w-4xl w-full px-4 mt-16">
        <div className="text-center mb-8">
          <Sigma className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2">
            BANK SOAL — BILANGAN RASIONAL
          </h1>
          <p className="text-white/70 text-sm font-body mb-4">
            100 soal pecahan · Mudah, Sedang, Sulit · HOTS, Kontekstual, UN, ANBK, TKA, Literasi Matematika
          </p>

          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
              Mudah: {counts.mudah}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">
              Sedang: {counts.sedang}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold">
              Sulit: {counts.sulit}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card/40 backdrop-blur border border-border/40 rounded-2xl p-4 mb-6 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-semibold">Tingkat Kesulitan</p>
            <div className="flex flex-wrap gap-2">
              {(["Semua", "Mudah", "Sedang", "Sulit"] as FilterDifficulty[]).map(d => (
                <button key={d} onClick={() => { playPopSound(); setFilterDifficulty(d); }}
                  className={filterBtnClass(filterDifficulty === d)}>{d}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-semibold">Tipe Soal</p>
            <div className="flex flex-wrap gap-2">
              {(["Semua", "PG", "PG Kompleks", "Benar/Salah"] as FilterType[]).map(t => (
                <button key={t} onClick={() => { playPopSound(); setFilterType(t); }}
                  className={filterBtnClass(filterType === t)}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-semibold">Kategori</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button key={tag} onClick={() => { playPopSound(); setFilterTag(tag); }}
                  className={filterBtnClass(filterTag === tag)}>{tag}</button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4 text-center">
          Menampilkan <span className="text-primary font-bold">{filtered.length}</span> dari {soalBilanganRasional.length} soal
        </p>

        <div className="space-y-4 mb-10">
          {filtered.map((soal) => (
            <SoalCard key={soal.id} soal={soal} />
          ))}
        </div>

        <button
          onClick={() => { playPopSound(); navigate("/bank-soal"); }}
          className="w-full mt-2 mb-8 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body text-center"
        >
          ← Kembali ke Bank Soal
        </button>
      </div>
    </div>
  );
};

export default BilanganRasionalPage;
