import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "SPLDV adalah singkatan dari ...",
    options: ["Sistem Persamaan Linear Dua Variabel", "Sistem Perkalian Linear Dua Variabel", "Satu Persamaan Linear Dua Variabel", "Sistem Persamaan Lurus Dua Variabel"],
    correctIndex: 0,
  },
  {
    question: "Manakah yang merupakan bentuk umum SPLDV?",
    options: ["ax + by = c dan dx + ey = f", "ax² + bx = c", "ax + b = 0", "ax² + bx + c = 0"],
    correctIndex: 0,
  },
  {
    question: "PLDV (Persamaan Linear Dua Variabel) memiliki ... variabel.",
    options: ["1", "2", "3", "4"],
    correctIndex: 1,
  },
  {
    question: "Persamaan 3x + 2y = 12 adalah contoh ...",
    options: ["PLDV", "SPLDV", "Persamaan kuadrat", "Pertidaksamaan"],
    correctIndex: 0,
  },
  {
    question: "Solusi dari SPLDV adalah pasangan nilai (x, y) yang memenuhi ...",
    options: ["Salah satu persamaan saja", "Kedua persamaan sekaligus", "Tidak ada persamaan", "Persamaan pertama saja"],
    correctIndex: 1,
  },
];

const DefinisiSPLDVGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="DEFINISI DAN BENTUK UMUM SPLDV"
    backPath="/math-game-arena/kelas-8/spldv"
    backLabel="Kembali ke SPLDV"
  />
);

export default DefinisiSPLDVGamePage;
