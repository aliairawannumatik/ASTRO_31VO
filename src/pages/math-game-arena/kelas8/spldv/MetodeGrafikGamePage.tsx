import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Pada metode grafik, solusi SPLDV adalah ...",
    options: ["Titik potong dua garis", "Titik tertinggi dua garis", "Luas daerah dua garis", "Kemiringan dua garis"],
    correctIndex: 0,
  },
  {
    question: "Jika dua garis dalam SPLDV sejajar, maka solusinya adalah ...",
    options: ["Satu solusi", "Dua solusi", "Tak hingga solusi", "Tidak ada solusi"],
    correctIndex: 3,
  },
  {
    question: "Jika dua garis dalam SPLDV berimpit, maka solusinya adalah ...",
    options: ["Satu solusi", "Tidak ada solusi", "Tak hingga solusi", "Dua solusi"],
    correctIndex: 2,
  },
  {
    question: "Untuk menggambar garis x + y = 4, titik potong dengan sumbu X adalah ...",
    options: ["(0, 4)", "(4, 0)", "(2, 2)", "(1, 3)"],
    correctIndex: 1,
  },
  {
    question: "Untuk menggambar garis 2x + y = 6, titik potong dengan sumbu Y adalah ...",
    options: ["(0, 6)", "(3, 0)", "(6, 0)", "(0, 3)"],
    correctIndex: 0,
  },
];

const MetodeGrafikGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENYELESAIAN SPLDV DENGAN METODE GRAFIK"
    backPath="/math-game-arena/kelas-8/spldv"
    backLabel="Kembali ke SPLDV"
  />
);

export default MetodeGrafikGamePage;
