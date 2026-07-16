import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Jika 5 pensil seharga Rp 10.000, maka 8 pensil seharga ...",
    options: ["Rp 14.000", "Rp 16.000", "Rp 18.000", "Rp 20.000"],
    correctIndex: 1,
  },
  {
    question: "Sebuah mobil menempuh 120 km dalam 2 jam. Dengan kecepatan yang sama, berapa km dalam 5 jam?",
    options: ["240 km", "280 km", "300 km", "320 km"],
    correctIndex: 2,
  },
  {
    question: "Jika 3 kg beras seharga Rp 36.000, maka 7 kg beras seharga ...",
    options: ["Rp 72.000", "Rp 80.000", "Rp 84.000", "Rp 90.000"],
    correctIndex: 2,
  },
  {
    question: "Perbandingan 4 : 6 adalah perbandingan senilai dengan ...",
    options: ["2 : 5", "6 : 9", "5 : 8", "8 : 10"],
    correctIndex: 1,
  },
  {
    question: "Jika diperlukan 6 pekerja untuk menyelesaikan pekerjaan dalam 10 hari, berapa pekerja untuk menyelesaikan dalam 5 hari? (perbandingan berbalik nilai)",
    options: ["8 pekerja", "10 pekerja", "12 pekerja", "15 pekerja"],
    correctIndex: 2,
  },
];

const PerbandinganSenilaiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PERBANDINGAN SENILAI DAN BERBALIK NILAI"
    backPath="/math-game-arena/kelas-7/perbandingan"
    backLabel="Kembali ke Perbandingan"
  />
);

export default PerbandinganSenilaiGamePage;
