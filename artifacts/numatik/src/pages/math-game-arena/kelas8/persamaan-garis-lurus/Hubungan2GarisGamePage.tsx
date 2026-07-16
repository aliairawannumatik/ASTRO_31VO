import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Dua garis sejajar memiliki gradien yang ...",
    options: ["Berbeda", "Saling berlawanan", "Sama", "Saling tegak lurus"],
    correctIndex: 2,
  },
  {
    question: "Dua garis saling tegak lurus jika hasil kali gradiennya adalah ...",
    options: ["0", "1", "-1", "2"],
    correctIndex: 2,
  },
  {
    question: "Garis y = 3x + 1 sejajar dengan garis ...",
    options: ["y = 2x + 1", "y = 3x - 4", "y = -3x + 1", "y = x + 3"],
    correctIndex: 1,
  },
  {
    question: "Garis y = 2x + 3 tegak lurus dengan garis bergradien ...",
    options: ["2", "-2", "1/2", "-1/2"],
    correctIndex: 3,
  },
  {
    question: "Dua garis berimpit artinya ...",
    options: ["Berpotongan di satu titik", "Sejajar dan tidak pernah bertemu", "Merupakan garis yang sama", "Tegak lurus satu sama lain"],
    correctIndex: 2,
  },
];

const Hubungan2GarisGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="HUBUNGAN 2 GARIS"
    backPath="/math-game-arena/kelas-8/persamaan-garis-lurus"
    backLabel="Kembali ke Persamaan Garis Lurus"
  />
);

export default Hubungan2GarisGamePage;
