import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Jumlah dua bilangan adalah 20 dan selisihnya adalah 4. Bilangan yang lebih besar adalah ...",
    options: ["10", "12", "14", "16"],
    correctIndex: 1,
  },
  {
    question: "Harga 1 pensil = Rp2.000 dan 1 buku = Rp5.000. Total 3 pensil dan 2 buku adalah ...",
    options: ["Rp14.000", "Rp16.000", "Rp17.000", "Rp19.000"],
    correctIndex: 1,
  },
  {
    question: "Dari x + y = 10 dan x - y = 2, nilai x adalah ...",
    options: ["4", "5", "6", "7"],
    correctIndex: 2,
  },
  {
    question: "Dari 2x + y = 11 dan x + y = 7, nilai x adalah ...",
    options: ["2", "3", "4", "5"],
    correctIndex: 2,
  },
  {
    question: "Harga 2 tiket dewasa dan 1 tiket anak = Rp35.000. Harga 1 tiket dewasa dan 2 tiket anak = Rp25.000. Harga 1 tiket dewasa adalah ...",
    options: ["Rp10.000", "Rp12.000", "Rp15.000", "Rp20.000"],
    correctIndex: 2,
  },
];

const PenyelesaianMasalahSPLDVGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENYELESAIAN MASALAH YANG BERKAITAN DENGAN SPLDV"
    backPath="/math-game-arena/kelas-8/spldv"
    backLabel="Kembali ke SPLDV"
  />
);

export default PenyelesaianMasalahSPLDVGamePage;
