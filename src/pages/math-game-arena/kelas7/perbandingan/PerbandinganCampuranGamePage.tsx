import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "4 orang menyelesaikan 2 pekerjaan dalam 6 hari. Berapa hari yang diperlukan 3 orang untuk menyelesaikan 1 pekerjaan?",
    options: ["2 hari", "3 hari", "4 hari", "5 hari"],
    correctIndex: 2,
  },
  {
    question: "5 mesin memproduksi 100 barang dalam 4 jam. Berapa barang yang dapat diproduksi 10 mesin dalam 2 jam?",
    options: ["50 barang", "100 barang", "150 barang", "200 barang"],
    correctIndex: 1,
  },
  {
    question: "3 pompa mengisi 2 kolam dalam 8 jam. Berapa jam yang diperlukan 4 pompa untuk mengisi 1 kolam?",
    options: ["2 jam", "3 jam", "4 jam", "6 jam"],
    correctIndex: 1,
  },
  {
    question: "6 pekerja membuat 2 meja dalam 4 hari. Berapa hari yang diperlukan 4 pekerja untuk membuat 3 meja?",
    options: ["6 hari", "8 hari", "9 hari", "12 hari"],
    correctIndex: 2,
  },
  {
    question: "8 sapi menghabiskan 4 karung jerami dalam 2 hari. Berapa karung jerami yang dibutuhkan 4 sapi dalam 6 hari?",
    options: ["3 karung", "4 karung", "6 karung", "8 karung"],
    correctIndex: 2,
  },
];

const PerbandinganCampuranGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PERBANDINGAN CAMPURAN"
    backPath="/math-game-arena/kelas-7/perbandingan"
    backLabel="Kembali ke Perbandingan"
  />
);

export default PerbandinganCampuranGamePage;
