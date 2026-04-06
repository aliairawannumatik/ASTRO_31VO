import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Harga 2 pensil dan 1 buku adalah Rp9.000. Model matematikanya adalah ...",
    options: ["2p + b = 9000", "p + 2b = 9000", "2p × b = 9000", "p + b = 9000"],
    correctIndex: 0,
  },
  {
    question: "Jumlah dua bilangan adalah 15 dan selisihnya adalah 3. Model SPLDV-nya adalah ...",
    options: ["x + y = 15 dan x - y = 3", "x + y = 3 dan x - y = 15", "x × y = 15 dan x - y = 3", "x + y = 15 dan x + y = 3"],
    correctIndex: 0,
  },
  {
    question: "Umur ayah 4 kali umur anak, dan jumlah umur mereka 40 tahun. Model matematikanya adalah ...",
    options: ["a = 4y dan a + y = 40", "a + 4y = 40 dan a = y + 4", "4a = y dan a + y = 40", "a = 4y dan a - y = 40"],
    correctIndex: 0,
  },
  {
    question: "Langkah pertama membuat model SPLDV dari soal cerita adalah ...",
    options: ["Langsung menghitung", "Mendefinisikan variabel terlebih dahulu", "Membuat grafik", "Menebak jawabannya"],
    correctIndex: 1,
  },
  {
    question: "3 buku dan 4 pena seharga Rp26.000, 2 buku dan 3 pena seharga Rp19.000. Jika b = harga buku dan p = harga pena, model SPLDV yang tepat adalah ...",
    options: ["3b + 4p = 26000 dan 2b + 3p = 19000", "4b + 3p = 26000 dan 3b + 2p = 19000", "3b - 4p = 26000 dan 2b - 3p = 19000", "b + p = 26000 dan b + p = 19000"],
    correctIndex: 0,
  },
];

const ModelSPLDVGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="MEMBUAT MODEL DARI PERMASALAHAN SPLDV"
    backPath="/math-game-arena/kelas-8/spldv"
    backLabel="Kembali ke SPLDV"
  />
);

export default ModelSPLDVGamePage;
