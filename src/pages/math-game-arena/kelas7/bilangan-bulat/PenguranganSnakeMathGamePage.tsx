import SnakeMathPage from "@/pages/math-game-arena/umum/SnakeMathPage";
  import type { GuruQuestion } from "@/hooks/useGuruQuiz";

  const QUESTIONS: GuruQuestion[] = [
    { question: "Hasil dari 9 − 4 adalah ...", options: ["3", "5", "-3", "-5"], correctIdx: 1 },
    { question: "Hasil dari 6 − 11 adalah ...", options: ["5", "-5", "17", "-17"], correctIdx: 1 },
    { question: "Hasil dari (−3) − 5 adalah ...", options: ["8", "-8", "2", "-2"], correctIdx: 1 },
    { question: "Hasil dari 8 − (−2) adalah ...", options: ["6", "10", "-6", "-10"], correctIdx: 1 },
    { question: "Hasil dari (−4) − (−9) adalah ...", options: ["-13", "13", "5", "-5"], correctIdx: 2 },
    { question: "Hasil dari 0 − 7 adalah ...", options: ["7", "-7", "0", "1"], correctIdx: 1 },
    { question: "Hasil dari 12 − 12 adalah ...", options: ["0", "24", "1", "-1"], correctIdx: 0 },
    { question: "Hasil dari (−6) − 4 adalah ...", options: ["10", "-10", "2", "-2"], correctIdx: 1 },
    { question: "Hasil dari 5 − (−5) adalah ...", options: ["10", "0", "-10", "5"], correctIdx: 0 },
    { question: "Suhu mula-mula 7°C lalu turun 12°C. Suhu sekarang adalah ...", options: ["-5°C", "5°C", "19°C", "-19°C"], correctIdx: 0 },
    { question: "Saldo Rp8.000 ditarik Rp10.000. Saldo akhir adalah ...", options: ["-Rp2.000", "Rp2.000", "Rp18.000", "-Rp18.000"], correctIdx: 0 },
    { question: "Sifat: a − b = a + ...", options: ["b", "-b", "0", "1"], correctIdx: 1 },
  ];

  const PenguranganSnakeMathGamePage = () => (
    <SnakeMathPage
      topicLabel="PENGURANGAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/pengurangan"
      homePath="/menu"
      quizQuestions={QUESTIONS}
      quizIntervalMs={25_000}
    />
  );

  export default PenguranganSnakeMathGamePage;
  