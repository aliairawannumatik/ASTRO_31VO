import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Barisan geometri adalah barisan yang rasio antara dua suku berurutan selalu ...",
    options: ["Sama (tetap)", "Berubah-ubah", "Bertambah 1", "Berkurang 1"],
    correctIndex: 0,
  },
  {
    question: "Pada barisan 2, 6, 18, 54, ... rasio (r) adalah ...",
    options: ["2", "3", "4", "6"],
    correctIndex: 1,
  },
  {
    question: "Suku ke-5 dari barisan 1, 2, 4, 8, ... adalah ...",
    options: ["12", "14", "16", "18"],
    correctIndex: 2,
  },
  {
    question: "Rumus suku ke-n dari barisan geometri adalah ...",
    options: ["Un = a + (n-1)r", "Un = a × r^(n-1)", "Un = a × r^n", "Un = a + r^n"],
    correctIndex: 1,
  },
  {
    question: "Suku pertama barisan geometri adalah 3 dan rasionya 2. Suku ke-4 adalah ...",
    options: ["18", "20", "24", "27"],
    correctIndex: 2,
  },
];

const PolaGeometriGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="POLA GEOMETRI"
    backPath="/math-game-arena/kelas-8/pola-bilangan"
    backLabel="Kembali ke Pola Bilangan"
  />
);

export default PolaGeometriGamePage;
