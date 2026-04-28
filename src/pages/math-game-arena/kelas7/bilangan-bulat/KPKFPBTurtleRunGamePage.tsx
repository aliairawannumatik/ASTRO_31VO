import DinoRunGamePage, { MQ } from "@/pages/math-game-arena/umum/DinoRunGamePage";

  const questions: MQ[] = [
    { q: "FPB(6, 9) = ?", opts: ["1", "2", "3", "6"], correctIndex: 2, bonus: 25 },
    { q: "KPK(3, 4) = ?", opts: ["7", "12", "6", "24"], correctIndex: 1, bonus: 30 },
    { q: "FPB(10, 15) = ?", opts: ["5", "10", "3", "15"], correctIndex: 0, bonus: 25 },
    { q: "KPK(2, 5) = ?", opts: ["5", "10", "7", "20"], correctIndex: 1, bonus: 25 },
    { q: "FPB(12, 18) = ?", opts: ["2", "4", "6", "9"], correctIndex: 2, bonus: 30 },
    { q: "KPK(4, 6) = ?", opts: ["10", "12", "24", "8"], correctIndex: 1, bonus: 30 },
    { q: "FPB(20, 30) = ?", opts: ["5", "10", "15", "20"], correctIndex: 1, bonus: 30 },
    { q: "Lampu A 6 menit, B 8 menit. Bersama lagi tiap?", opts: ["12", "16", "24", "48"], correctIndex: 2, bonus: 35 },
  ];

  const KPKFPBTurtleRunGamePage = () => (
    <DinoRunGamePage
      questions={questions}
      topicLabel="KPK DAN FPB"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/kpk-fpb"
      homePath="/menu"
    />
  );

  export default KPKFPBTurtleRunGamePage;
  