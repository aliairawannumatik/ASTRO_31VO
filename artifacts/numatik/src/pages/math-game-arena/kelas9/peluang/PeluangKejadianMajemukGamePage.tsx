import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Rumus peluang gabungan untuk dua kejadian SALING LEPAS adalah ...",
    options: [
      "P(A∪B) = P(A) × P(B)",
      "P(A∪B) = P(A) + P(B) − P(A∩B)",
      "P(A∪B) = P(A) + P(B)",
      "P(A∪B) = P(A) − P(B)",
    ],
    correctIndex: 2,
  },
  {
    question: "Sebuah dadu dilempar. A = muncul angka 2, B = muncul angka 5. Nilai P(A∪B) adalah ...",
    options: ["1/36", "1/3", "1/6", "2/36"],
    correctIndex: 1,
  },
  {
    question: "Dua kejadian A dan B disebut SALING BEBAS jika ...",
    options: [
      "A ∩ B = ∅",
      "P(A∩B) = P(A) + P(B)",
      "P(A∩B) = P(A) × P(B)",
      "P(A|B) = P(B)",
    ],
    correctIndex: 2,
  },
  {
    question: "Dari 52 kartu bridge, satu kartu diambil. P(kartu merah ∪ kartu As) = ...",
    options: ["28/52", "30/52", "7/13", "6/13"],
    correctIndex: 2,
  },
  {
    question: "Rumus peluang bersyarat P(A|B) adalah ...",
    options: [
      "P(A) × P(B)",
      "P(A∩B) / P(B)",
      "P(A) / P(B)",
      "P(A∩B) × P(B)",
    ],
    correctIndex: 1,
  },
  {
    question: "Kotak berisi 5 merah dan 3 biru. Dua bola diambil tanpa pengembalian. P(keduanya merah) = ...",
    options: ["25/64", "20/56", "5/14", "10/56"],
    correctIndex: 2,
  },
  {
    question: "A dan B saling lepas jika ...",
    options: [
      "P(A∩B) = 1",
      "A ∩ B = ∅",
      "P(A) = P(B)",
      "P(A∪B) = 0",
    ],
    correctIndex: 1,
  },
  {
    question: "P(A) = 0,4 dan P(B) = 0,5. A dan B saling bebas. Nilai P(A∩B) = ...",
    options: ["0,9", "0,1", "0,2", "0,45"],
    correctIndex: 2,
  },
  {
    question: "Dua dadu dilempar bersamaan. Peluang setidaknya satu dadu menunjukkan angka 6 adalah ...",
    options: ["11/36", "12/36", "10/36", "1/6"],
    correctIndex: 0,
  },
  {
    question: "P(A) = 0,3, P(B) = 0,4, P(A∩B) = 0,2. Nilai P(A∪B) = ...",
    options: ["0,7", "0,5", "0,9", "0,12"],
    correctIndex: 1,
  },
  {
    question: "Aturan perkalian untuk dua kejadian TIDAK saling bebas adalah ...",
    options: [
      "P(A∩B) = P(A) × P(B)",
      "P(A∩B) = P(A) × P(B|A)",
      "P(A∩B) = P(A) + P(B)",
      "P(A∩B) = P(A|B) + P(B)",
    ],
    correctIndex: 1,
  },
  {
    question: "Peluang A dan B saling lepas dengan P(A) = 1/4 dan P(B) = 1/3. Nilai P(A∪B) = ...",
    options: ["1/12", "7/12", "1/2", "5/12"],
    correctIndex: 1,
  },
  {
    question: "Dari 52 kartu bridge, satu diambil. A = kartu merah, B = kartu As. P(A|B) = ...",
    options: ["2/4 = 1/2", "4/52", "2/52", "26/52"],
    correctIndex: 0,
  },
  {
    question: "Sebuah kotak berisi 4 merah dan 6 biru. Dua bola diambil dengan pengembalian. P(keduanya merah) = ...",
    options: ["4/10", "12/100", "16/100", "20/100"],
    correctIndex: 2,
  },
  {
    question: "Rumus P(A∪B) yang PALING UMUM (berlaku untuk semua kasus) adalah ...",
    options: [
      "P(A) + P(B)",
      "P(A) × P(B)",
      "P(A) + P(B) − P(A∩B)",
      "P(A) − P(A∩B)",
    ],
    correctIndex: 2,
  },
];

const PeluangKejadianMajemukGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PELUANG KEJADIAN MAJEMUK"
    backPath="/math-game-arena/kelas-9/peluang"
    backLabel="Kembali ke Peluang"
  />
);

export default PeluangKejadianMajemukGamePage;
