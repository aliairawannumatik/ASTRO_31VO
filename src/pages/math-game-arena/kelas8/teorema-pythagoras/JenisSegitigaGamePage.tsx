import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Segitiga dengan sisi a, b, c (c terbesar) adalah siku-siku jika ...",
    options: ["a² + b² > c²", "a² + b² = c²", "a² + b² < c²", "a + b = c"],
    correctIndex: 1,
  },
  {
    question: "Segitiga lancip memenuhi syarat ...",
    options: ["a² + b² = c²", "a² + b² < c²", "a² + b² > c²", "c > a + b"],
    correctIndex: 2,
  },
  {
    question: "Segitiga tumpul memenuhi syarat ...",
    options: ["a² + b² = c²", "a² + b² > c²", "a² + b² < c²", "a = b = c"],
    correctIndex: 2,
  },
  {
    question: "Segitiga dengan sisi 5, 5, 5 adalah segitiga ...",
    options: ["Siku-siku", "Tumpul", "Lancip", "Sama sisi"],
    correctIndex: 3,
  },
  {
    question: "Segitiga dengan sisi 3, 4, 6: karena 3² + 4² = 25 < 36 = 6², maka segitiga ini adalah ...",
    options: ["Siku-siku", "Lancip", "Tumpul", "Sama kaki"],
    correctIndex: 2,
  },
];

const JenisSegitigaGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PYTHAGORAS DAN JENIS-JENIS SEGITIGA"
    backPath="/math-game-arena/kelas-8/teorema-pythagoras"
    backLabel="Kembali ke Teorema Pythagoras"
  />
);

export default JenisSegitigaGamePage;
