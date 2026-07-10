import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Metode campuran menggabungkan metode ...",
    options: ["Grafik dan substitusi", "Eliminasi dan substitusi", "Grafik dan eliminasi", "Substitusi dan tabel"],
    correctIndex: 1,
  },
  {
    question: "Pada metode campuran, langkah pertama adalah ...",
    options: ["Substitusi dulu baru eliminasi", "Eliminasi satu variabel dulu, lalu substitusi nilai ke persamaan", "Gambar grafik dulu", "Membagi persamaan"],
    correctIndex: 1,
  },
  {
    question: "Dari 2x + y = 7 dan x - y = 2. Eliminasi y: 3x = 9, x = 3. Substitusi ke x - y = 2: y = ...",
    options: ["0", "1", "2", "3"],
    correctIndex: 1,
  },
  {
    question: "Dari x + 2y = 8 dan x - y = 2. Eliminasi x: 3y = 6, y = 2. Substitusi ke x + 2y = 8: x = ...",
    options: ["2", "4", "6", "8"],
    correctIndex: 1,
  },
  {
    question: "Metode campuran digunakan karena ...",
    options: ["Lebih rumit", "Lebih efisien untuk soal tertentu", "Hanya untuk soal sulit", "Selalu lebih cepat dari metode lain"],
    correctIndex: 1,
  },
];

const MetodeCampuranGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENYELESAIAN SPLDV DENGAN METODE CAMPURAN"
    backPath="/math-game-arena/kelas-8/spldv"
    backLabel="Kembali ke SPLDV"
  />
);

export default MetodeCampuranGamePage;
