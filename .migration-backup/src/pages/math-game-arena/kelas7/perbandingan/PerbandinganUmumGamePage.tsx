import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Perbandingan 15 : 25 dalam bentuk paling sederhana adalah ...",
    options: ["5 : 8", "3 : 5", "15 : 25", "1 : 3"],
    correctIndex: 1,
  },
  {
    question: "Di sebuah kelas ada 16 siswa perempuan dan 24 siswa laki-laki. Perbandingan perempuan terhadap laki-laki adalah ...",
    options: ["2 : 3", "3 : 2", "2 : 5", "3 : 5"],
    correctIndex: 0,
  },
  {
    question: "Perbandingan umur Andi dan Budi adalah 3 : 4. Jika umur Andi 15 tahun, maka umur Budi adalah ...",
    options: ["18 tahun", "20 tahun", "22 tahun", "25 tahun"],
    correctIndex: 1,
  },
  {
    question: "Rasio 0,4 : 0,6 dalam bentuk paling sederhana adalah ...",
    options: ["1 : 2", "2 : 3", "4 : 6", "2 : 4"],
    correctIndex: 1,
  },
  {
    question: "Perbandingan 1 jam : 45 menit dalam bentuk paling sederhana adalah ...",
    options: ["3 : 4", "4 : 3", "1 : 45", "4 : 1"],
    correctIndex: 1,
  },
];

const PerbandinganUmumGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PERBANDINGAN UMUM DAN RASIO"
    backPath="/math-game-arena/kelas-7/perbandingan"
    backLabel="Kembali ke Perbandingan"
  />
);

export default PerbandinganUmumGamePage;
