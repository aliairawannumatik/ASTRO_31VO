import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Diagram yang menggunakan lingkaran dan dibagi menjadi beberapa bagian untuk menyajikan data disebut ...",
    options: ["Diagram batang", "Diagram garis", "Diagram lingkaran", "Histogram"],
    correctIndex: 2,
  },
  {
    question: "Penyajian data yang cocok untuk menunjukkan perubahan data dari waktu ke waktu adalah ...",
    options: ["Diagram batang", "Diagram garis", "Tabel frekuensi", "Diagram lingkaran"],
    correctIndex: 1,
  },
  {
    question: "Dari 40 siswa, 10 menyukai sepak bola. Besar sudut sektor pada diagram lingkaran adalah ...",
    options: ["45°", "90°", "60°", "120°"],
    correctIndex: 1,
  },
  {
    question: "Tabel distribusi frekuensi digunakan untuk ...",
    options: [
      "Menampilkan data tunggal saja",
      "Mengelompokkan data ke dalam kelas-kelas interval",
      "Membandingkan dua data berbeda",
      "Menghitung rata-rata saja",
    ],
    correctIndex: 1,
  },
  {
    question: "Banyak data yang masuk ke dalam suatu kelas interval disebut ...",
    options: ["Modus", "Frekuensi", "Median", "Rata-rata"],
    correctIndex: 1,
  },
];

const PenyajianDataGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENYAJIAN DATA"
    backPath="/math-game-arena/kelas-9/statistika"
    backLabel="Kembali ke Statistika"
  />
);

export default PenyajianDataGamePage;
