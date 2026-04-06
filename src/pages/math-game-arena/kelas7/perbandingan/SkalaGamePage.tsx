import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Peta dengan skala 1 : 500.000. Jarak dua kota di peta 3 cm. Jarak sesungguhnya adalah ...",
    options: ["1.500 km", "150 km", "15 km", "1.500 m"],
    correctIndex: 2,
  },
  {
    question: "Jarak dua kota sesungguhnya 240 km. Pada peta skala 1 : 3.000.000, jarak di peta adalah ...",
    options: ["6 cm", "7 cm", "8 cm", "9 cm"],
    correctIndex: 2,
  },
  {
    question: "Sebuah denah rumah menggunakan skala 1 : 200. Jika panjang ruangan di denah 4 cm, panjang sesungguhnya adalah ...",
    options: ["4 m", "6 m", "8 m", "10 m"],
    correctIndex: 2,
  },
  {
    question: "Jarak dua kota 150 km, di peta tercatat 5 cm. Skala peta tersebut adalah ...",
    options: ["1 : 1.500.000", "1 : 2.000.000", "1 : 3.000.000", "1 : 750.000"],
    correctIndex: 2,
  },
  {
    question: "Lebar sungai sesungguhnya 80 m. Pada peta skala 1 : 4.000, lebar sungai di peta adalah ...",
    options: ["1 cm", "2 cm", "3 cm", "4 cm"],
    correctIndex: 1,
  },
];

const SkalaGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="SKALA"
    backPath="/math-game-arena/kelas-7/perbandingan"
    backLabel="Kembali ke Perbandingan"
  />
);

export default SkalaGamePage;
