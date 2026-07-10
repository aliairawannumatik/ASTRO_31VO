import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Teorema Pythagoras menyatakan bahwa pada segitiga siku-siku berlaku ...",
    options: ["a + b = c", "a² + b² = c²", "a × b = c²", "a² - b² = c²"],
    correctIndex: 1,
  },
  {
    question: "Pada segitiga siku-siku, sisi terpanjang yang berhadapan dengan sudut siku-siku disebut ...",
    options: ["Sisi tegak", "Sisi alas", "Hipotenusa", "Kaki segitiga"],
    correctIndex: 2,
  },
  {
    question: "Teorema Pythagoras pertama kali dikemukakan oleh ...",
    options: ["Euclid", "Archimedes", "Pythagoras", "Thales"],
    correctIndex: 2,
  },
  {
    question: "Pada segitiga dengan sisi a = 3, b = 4, c adalah hipotenusa. Nilai c = ...",
    options: ["5", "6", "7", "8"],
    correctIndex: 0,
  },
  {
    question: "Teorema Pythagoras hanya berlaku untuk segitiga ...",
    options: ["Sama sisi", "Sama kaki", "Siku-siku", "Sembarang"],
    correctIndex: 2,
  },
];

const PembuktianPythagorasGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PEMBUKTIAN TEOREMA PYTHAGORAS"
    backPath="/math-game-arena/kelas-8/teorema-pythagoras"
    backLabel="Kembali ke Teorema Pythagoras"
  />
);

export default PembuktianPythagorasGamePage;
