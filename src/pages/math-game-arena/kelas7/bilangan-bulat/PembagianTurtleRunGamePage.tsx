import DinoRunGamePage, { MQ } from "@/pages/math-game-arena/umum/DinoRunGamePage";

  const questions: MQ[] = [
    { q: "14 ÷ 2 = ?", opts: ["6", "7", "-7", "-6"], correctIndex: 1, bonus: 25 },
    { q: "(-12) ÷ 3 = ?", opts: ["4", "-4", "-9", "9"], correctIndex: 1, bonus: 25 },
    { q: "(-15) ÷ (-5) = ?", opts: ["3", "-3", "10", "-10"], correctIndex: 0, bonus: 30 },
    { q: "10 ÷ (-2) = ?", opts: ["5", "-5", "8", "-8"], correctIndex: 1, bonus: 30 },
    { q: "0 ÷ 5 = ?", opts: ["5", "0", "1", "tak terdefinisi"], correctIndex: 1, bonus: 25 },
    { q: "(-18) ÷ 6 = ?", opts: ["3", "-3", "12", "-12"], correctIndex: 1, bonus: 30 },
    { q: "24 ÷ 8 = ?", opts: ["3", "16", "-3", "-16"], correctIndex: 0, bonus: 25 },
    { q: "30 jeruk : 6 anak = ?", opts: ["6", "5", "4", "3"], correctIndex: 1, bonus: 35 },
  ];

  const PembagianTurtleRunGamePage = () => (
    <DinoRunGamePage
      questions={questions}
      topicLabel="PEMBAGIAN BILANGAN BULAT"
      backPath="/math-game-arena/kelas-7/bilangan-bulat/pembagian"
      homePath="/menu"
    />
  );

  export default PembagianTurtleRunGamePage;
  