import DinoRunGamePage, { MQ } from "@/pages/math-game-arena/umum/DinoRunGamePage";

import { PENGURANGAN_TURTLE_QUIZ } from "@/data/mga-k7-bilbul-quiz";
  const questions: MQ[] = [
    { q: "10 - 4 = ?", opts: ["14", "6", "-6", "-14"], correctIndex: 1, bonus: 25 },
    { q: "6 - 9 = ?", opts: ["3", "-3", "15", "-15"], correctIndex: 1, bonus: 25 },
    { q: "(-5) - 3 = ?", opts: ["2", "-2", "-8", "8"], correctIndex: 2, bonus: 30 },
    { q: "8 - (-2) = ?", opts: ["6", "10", "-10", "-6"], correctIndex: 1, bonus: 30 },
    { q: "(-7) - (-2) = ?", opts: ["5", "-5", "9", "-9"], correctIndex: 1, bonus: 30 },
    { q: "0 - 6 = ?", opts: ["6", "-6", "0", "1"], correctIndex: 1, bonus: 25 },
    { q: "Lift lt -2 turun 3 lt → lantai?", opts: ["1", "-5", "5", "-1"], correctIndex: 1, bonus: 30 },
    { q: "Suhu 4°C turun 7°C → ?", opts: ["3°C", "-3°C", "11°C", "-11°C"], correctIndex: 1, bonus: 35 },
  ];

  const PenguranganTurtleRunGamePage = () => (
    <DinoRunGamePage
      questions={questions}
      topicLabel="PENGURANGAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/pengurangan"
      homePath="/menu"

      quizQuestions={PENGURANGAN_TURTLE_QUIZ}
    />
  );

  export default PenguranganTurtleRunGamePage;
  