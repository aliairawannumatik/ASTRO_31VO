import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Metode eliminasi dilakukan dengan cara ...",
    options: ["Menggambar dua garis", "Menghilangkan salah satu variabel dengan penjumlahan/pengurangan", "Mengganti satu variabel dengan nilai", "Membagi kedua persamaan"],
    correctIndex: 1,
  },
  {
    question: "Dari x + y = 7 dan x - y = 3, eliminasi y menghasilkan 2x = ...",
    options: ["4", "8", "10", "14"],
    correctIndex: 2,
  },
  {
    question: "Dari 2x + y = 9 dan x + y = 6, kurangkan persamaan kedua dari pertama: x = ...",
    options: ["1", "2", "3", "4"],
    correctIndex: 2,
  },
  {
    question: "Untuk mengeliminasi y dari 3x + 2y = 12 dan x + 2y = 6, kita ...",
    options: ["Jumlahkan kedua persamaan", "Kalikan persamaan kedua dengan 2 lalu jumlahkan", "Kurangkan persamaan kedua dari pertama", "Bagi kedua persamaan"],
    correctIndex: 2,
  },
  {
    question: "Dari x + y = 5 dan x - y = 1, nilai y = ...",
    options: ["1", "2", "3", "4"],
    correctIndex: 1,
  },
];

const MetodeEliminasiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENYELESAIAN SPLDV DENGAN METODE ELIMINASI"
    backPath="/math-game-arena/kelas-8/spldv"
    backLabel="Kembali ke SPLDV"
  />
);

export default MetodeEliminasiGamePage;
