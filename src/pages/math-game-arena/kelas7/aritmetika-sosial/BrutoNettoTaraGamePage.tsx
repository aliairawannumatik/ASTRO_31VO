import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Rumus matematis yang benar untuk mencari Bruto adalah...",
    options: ["Netto × Tara", "Netto - Tara", "Netto + Tara", "Tara - Netto"],
    correctIndex: 2,
  },
  {
    question: "Sebuah kaleng biskuit memiliki berat bersih 400 gram dan berat kalengnya saja adalah 50 gram. Berapa Bruto kaleng biskuit tersebut?",
    options: ["400 gram", "450 gram", "500 gram", "350 gram"],
    correctIndex: 1,
  },
  {
    question: "Seorang pedagang membeli 5 karung beras dengan Bruto masing-masing 50 kg dan Tara 1%. Berapakah total Netto seluruh beras tersebut?",
    options: ["49,5 kg", "250 kg", "247,5 kg", "245 kg"],
    correctIndex: 2,
  },
  {
    question: "Sekarung beras memiliki Bruto 50 kg dan Netto 48 kg. Berapakah persentase Tara dari sekarung beras tersebut?",
    options: ["5%", "2%", "4%", "10%"],
    correctIndex: 2,
  },
  {
    question: "Pada kemasan makanan ringan tertulis Netto 114 gram. Jika diketahui Taranya adalah 6 gram, berapakah Bruto makanan ringan tersebut?",
    options: ["120 gram", "108 gram", "126 gram", "114 gram"],
    correctIndex: 0,
  },
];

const BrutoNettoTaraGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="BRUTO, NETTO DAN TARA"
    backPath="/math-game-arena/kelas-7/aritmetika-sosial"
    backLabel="Kembali ke Aritmetika Sosial"
  />
);

export default BrutoNettoTaraGamePage;
