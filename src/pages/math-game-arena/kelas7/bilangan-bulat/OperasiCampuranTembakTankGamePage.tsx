import BattleTankPage, { MQ } from "@/pages/math-game-arena/umum/BattleTankPage";

import { OPERASI_CAMPURAN_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const questions: MQ[] = [
    { q: "5 + 4 × 2 = ...", opts: ["13", "18", "9", "20"], ans: 0 },
    { q: "(6 - 2) × 3 = ...", opts: ["12", "10", "0", "18"], ans: 0 },
    { q: "10 ÷ 2 + 3 = ...", opts: ["8", "2", "13", "5"], ans: 0 },
    { q: "8 - 6 ÷ 2 = ...", opts: ["5", "1", "8", "11"], ans: 0 },
    { q: "3 × 4 - 5 = ...", opts: ["7", "17", "-7", "12"], ans: 0 },
    { q: "(-2) + 3 × 4 = ...", opts: ["10", "-14", "4", "20"], ans: 0 },
    { q: "16 ÷ 2 + 1 = ...", opts: ["9", "8", "17", "7"], ans: 0 },
    { q: "20 - 5 × 2 = ...", opts: ["10", "30", "5", "15"], ans: 0 },
    { q: "9 - 12 ÷ 4 = ...", opts: ["6", "0", "12", "-1"], ans: 0 },
    { q: "(7 + 3) ÷ 5 = ...", opts: ["2", "10", "5", "8"], ans: 0 },
    { q: "4 × 3 + 2 = ...", opts: ["14", "20", "10", "24"], ans: 0 },
    { q: "(-3) × 5 + 10 = ...", opts: ["-5", "5", "10", "-25"], ans: 0 },
  ];

  const OperasiCampuranTembakTankGamePage = () => (
    <BattleTankPage
      questions={questions}
      topicLabel="OPERASI HITUNG CAMPURAN BILANGAN BULAT · Tembak tank dengan jawaban benar!"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran"
      homePath="/menu"

      quizQuestions={OPERASI_CAMPURAN_QUIZ}
    />
  );

  export default OperasiCampuranTembakTankGamePage;
  