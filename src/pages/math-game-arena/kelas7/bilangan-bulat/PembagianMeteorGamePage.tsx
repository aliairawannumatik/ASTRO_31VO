import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

  const questions: QuizQuestion[] = [
    {
      question: "Hasil dari 12 ÷ 4 adalah ...",
      options: ["3", "8", "−3", "16"],
      correctIndex: 0,
    },
    {
      question: "Hasil dari (−18) ÷ 6 adalah ...",
      options: ["3", "−3", "12", "−12"],
      correctIndex: 1,
    },
    {
      question: "Hasil dari (−20) ÷ (−5) adalah ...",
      options: ["4", "−4", "15", "−15"],
      correctIndex: 0,
    },
    {
      question: "Hasil dari 0 ÷ 7 adalah ...",
      options: ["7", "1", "0", "Tak terdefinisi"],
      correctIndex: 2,
    },
    {
      question: "Hasil dari 9 ÷ 0 adalah ...",
      options: ["0", "9", "1", "Tak terdefinisi"],
      correctIndex: 3,
    },
    {
      question: "30 buah jeruk dibagikan ke 6 anak sama banyak. Tiap anak dapat ...",
      options: ["6 buah", "5 buah", "24 buah", "36 buah"],
      correctIndex: 1,
    },
  ];

  const PembagianMeteorGamePage = () => (
    <MeteorShootingGame
      questions={questions}
      topicLabel="PEMBAGIAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/pembagian"
      backLabel="Kembali ke Pilihan Game"
      homePath="/menu"
    />
  );

  export default PembagianMeteorGamePage;
  