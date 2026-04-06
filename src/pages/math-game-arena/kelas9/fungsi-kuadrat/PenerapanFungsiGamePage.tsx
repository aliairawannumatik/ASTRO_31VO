import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Tinggi peluru yang ditembakkan vertikal: h(t) = -5t² + 20t. Tinggi maksimum yang dicapai adalah ...",
    options: ["15 m", "20 m", "25 m", "30 m"],
    correctIndex: 1,
  },
  {
    question: "Keuntungan toko: K(x) = -x² + 10x - 16, x = banyak barang terjual. Keuntungan maksimum dicapai saat x = ...",
    options: ["4", "5", "6", "8"],
    correctIndex: 1,
  },
  {
    question: "Dari soal h(t) = -5t² + 20t, peluru menyentuh tanah kembali saat t = ...",
    options: ["2 detik", "4 detik", "5 detik", "20 detik"],
    correctIndex: 1,
  },
  {
    question: "Suatu ladang berbentuk persegi panjang dengan keliling 40 m. Luas maksimum yang dapat dicapai adalah ...",
    options: ["80 m²", "100 m²", "120 m²", "160 m²"],
    correctIndex: 1,
  },
  {
    question: "Nilai minimum dari f(x) = 2x² - 8x + 10 adalah ...",
    options: ["2", "10", "8", "4"],
    correctIndex: 0,
  },
];

const PenerapanFungsiGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENERAPAN FUNGSI KUADRAT (NILAI MAKS/MIN)"
    backPath="/math-game-arena/kelas-9/fungsi-kuadrat"
    backLabel="Kembali ke Fungsi Kuadrat"
  />
);

export default PenerapanFungsiGamePage;
