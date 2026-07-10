import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Pada bidang Kartesius, sumbu yang mendatar (horizontal) disebut ...",
    options: ["Sumbu Y", "Sumbu Z", "Sumbu X", "Ordinat"],
    correctIndex: 2,
  },
  {
    question: "Titik O(0, 0) pada bidang Kartesius disebut ...",
    options: ["Titik koordinat", "Titik pusat", "Titik asal (origin)", "Titik acuan"],
    correctIndex: 2,
  },
  {
    question: "Koordinat titik A adalah (3, 5). Angka 5 disebut ...",
    options: ["Absis", "Sumbu X", "Ordinat", "Koordinat X"],
    correctIndex: 2,
  },
  {
    question: "Titik P(4, -2) berada di kuadran ...",
    options: ["I", "II", "III", "IV"],
    correctIndex: 3,
  },
  {
    question: "Titik yang berada di sumbu Y adalah ...",
    options: ["(3, 0)", "(0, 5)", "(2, 4)", "(-3, -1)"],
    correctIndex: 1,
  },
];

const UnsurUnsurCartesiusGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="UNSUR-UNSUR PADA DIAGRAM KARTESIUS"
    backPath="/math-game-arena/kelas-8/koordinat-cartesius"
    backLabel="Kembali ke Koordinat Kartesius"
  />
);

export default UnsurUnsurCartesiusGamePage;
