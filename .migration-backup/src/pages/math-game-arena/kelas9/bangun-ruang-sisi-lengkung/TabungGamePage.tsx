import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Rumus volume tabung dengan jari-jari r dan tinggi t adalah ...",
    options: ["V = πr²t", "V = 2πrt", "V = πrt²", "V = 2πr²t"],
    correctIndex: 0,
  },
  {
    question: "Sebuah tabung memiliki jari-jari 7 cm dan tinggi 10 cm. Volumenya adalah ... (π = 22/7)",
    options: ["1.540 cm³", "440 cm³", "220 cm³", "2.200 cm³"],
    correctIndex: 0,
  },
  {
    question: "Rumus luas selimut tabung adalah ...",
    options: ["πr²", "2πrh", "2πr(r+h)", "πr²h"],
    correctIndex: 1,
  },
  {
    question: "Tabung dengan jari-jari 5 cm dan tinggi 8 cm. Luas selimutnya adalah ... (π = 3,14)",
    options: ["251,2 cm²", "125,6 cm²", "502,4 cm²", "78,5 cm²"],
    correctIndex: 0,
  },
  {
    question: "Rumus luas permukaan tabung (termasuk tutup dan alas) adalah ...",
    options: ["2πrh", "πr²h", "2πr(r+h)", "4πr²"],
    correctIndex: 2,
  },
];

const TabungGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="TABUNG"
    backPath="/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung"
    backLabel="Kembali ke Bangun Ruang Sisi Lengkung"
  />
);

export default TabungGamePage;
