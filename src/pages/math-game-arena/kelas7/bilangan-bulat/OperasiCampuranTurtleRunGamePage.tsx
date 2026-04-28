import DinoRunGamePage, { MQ } from "@/pages/math-game-arena/umum/DinoRunGamePage";

  const questions: MQ[] = [
    { q: "4 + 2 × 3 = ?", opts: ["18", "10", "12", "9"], correctIndex: 1, bonus: 25 },
    { q: "(6 - 2) × 4 = ?", opts: ["10", "16", "12", "20"], correctIndex: 1, bonus: 30 },
    { q: "12 ÷ 3 + 2 = ?", opts: ["6", "5", "8", "4"], correctIndex: 0, bonus: 25 },
    { q: "10 - 2 × 4 = ?", opts: ["32", "2", "8", "-8"], correctIndex: 1, bonus: 30 },
    { q: "3 × (4 + 1) = ?", opts: ["13", "15", "18", "9"], correctIndex: 1, bonus: 30 },
    { q: "(-2) × 3 + 8 = ?", opts: ["2", "-2", "8", "14"], correctIndex: 0, bonus: 30 },
    { q: "20 ÷ 5 + 3 = ?", opts: ["7", "5", "11", "4"], correctIndex: 0, bonus: 25 },
    { q: "8 - 4 ÷ 2 = ?", opts: ["6", "2", "0", "8"], correctIndex: 0, bonus: 35 },
  ];

  const OperasiCampuranTurtleRunGamePage = () => (
    <DinoRunGamePage
      questions={questions}
      topicLabel="OPERASI HITUNG CAMPURAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/operasi-campuran"
      homePath="/menu"
    />
  );

  export default OperasiCampuranTurtleRunGamePage;
  