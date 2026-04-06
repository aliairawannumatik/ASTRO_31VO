import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Titik A(2, 3) terhadap titik acuan O(0, 0) berada di ...",
    options: ["Kuadran II", "Kuadran III", "Kuadran I", "Kuadran IV"],
    correctIndex: 2,
  },
  {
    question: "Titik B(-4, 5) terhadap titik acuan O(0, 0) berada di ...",
    options: ["Kuadran I", "Kuadran II", "Kuadran III", "Kuadran IV"],
    correctIndex: 1,
  },
  {
    question: "Titik yang berada di sebelah kiri sumbu Y memiliki absis yang bernilai ...",
    options: ["Positif", "Nol", "Negatif", "Tak tentu"],
    correctIndex: 2,
  },
  {
    question: "Titik C(5, -3) terhadap titik acuan O(0, 0) berada di ...",
    options: ["Kuadran I", "Kuadran II", "Kuadran III", "Kuadran IV"],
    correctIndex: 3,
  },
  {
    question: "Titik D(-2, -5) berada di ...",
    options: ["Kuadran I", "Kuadran II", "Kuadran III", "Kuadran IV"],
    correctIndex: 2,
  },
];

const PosisiRelatifGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="POSISI RELATIF SUATU TITIK TERHADAP SUATU GARIS"
    backPath="/math-game-arena/kelas-8/koordinat-cartesius"
    backLabel="Kembali ke Koordinat Cartesius"
  />
);

export default PosisiRelatifGamePage;
