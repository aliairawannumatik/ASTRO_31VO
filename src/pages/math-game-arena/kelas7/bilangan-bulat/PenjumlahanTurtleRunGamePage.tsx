import DinoRunGamePage, { MQ } from "@/pages/math-game-arena/umum/DinoRunGamePage";

const questions: MQ[] = [
  { q: "(-8) + 5 = ?", opts: ["-13", "-3", "3", "13"], correctIndex: 1, bonus: 25 },
  { q: "12 + (-7) = ?", opts: ["19", "-5", "5", "-19"], correctIndex: 2, bonus: 25 },
  { q: "(-15) + (-6) = ?", opts: ["21", "9", "-9", "-21"], correctIndex: 3, bonus: 30 },
  { q: "(-20) + 35 = ?", opts: ["-15", "15", "-55", "55"], correctIndex: 1, bonus: 30 },
  { q: "(-9) + (-11) + 5 = ?", opts: ["25", "-25", "-15", "15"], correctIndex: 2, bonus: 35 },
  { q: "Suhu -4°C naik 9°C, suhu sekarang?", opts: ["-13°C", "13°C", "5°C", "-5°C"], correctIndex: 2, bonus: 30 },
  { q: "Lift di lantai -2 naik 7 lantai → lantai?", opts: ["5", "-9", "9", "-5"], correctIndex: 0, bonus: 30 },
  { q: "Saldo Rp10.000 + utang Rp15.000 = ?", opts: ["Rp25.000", "Rp5.000", "-Rp25.000", "-Rp5.000"], correctIndex: 3, bonus: 35 },
];

const PenjumlahanTurtleRunGamePage = () => (
  <DinoRunGamePage
    questions={questions}
    topicLabel="PENJUMLAHAN BILANGAN BULAT"
    backPath="/math-game-arena/kelas-7/bilangan-bulat/penjumlahan"
    homePath="/math-game-arena"
  />
);

export default PenjumlahanTurtleRunGamePage;
