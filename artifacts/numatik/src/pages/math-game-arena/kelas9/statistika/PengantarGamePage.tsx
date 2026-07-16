import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Statistika adalah ilmu yang mempelajari ...",
    options: [
      "Tentang persamaan matematika",
      "Pengumpulan, penyajian, analisis, dan interpretasi data",
      "Tentang bilangan prima",
      "Pengukuran bangun datar",
    ],
    correctIndex: 1,
  },
  {
    question: "Data yang diperoleh melalui pengamatan langsung disebut data ...",
    options: ["Sekunder", "Kualitatif", "Primer", "Ordinal"],
    correctIndex: 2,
  },
  {
    question: "Nilai ujian siswa: 70, 80, 90, 85, 75. Ini merupakan contoh data ...",
    options: ["Kualitatif", "Kuantitatif", "Deskriptif", "Nominal"],
    correctIndex: 1,
  },
  {
    question: "Metode pengumpulan data dengan memberikan daftar pertanyaan tertulis disebut ...",
    options: ["Wawancara", "Observasi", "Angket/Kuesioner", "Dokumentasi"],
    correctIndex: 2,
  },
  {
    question: "Data tentang warna favorit siswa merupakan data ...",
    options: ["Kuantitatif", "Kontinu", "Diskrit", "Kualitatif"],
    correctIndex: 3,
  },
];

const PengantarGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENGANTAR STATISTIKA DAN PENGUMPULAN DATA"
    backPath="/math-game-arena/kelas-9/statistika"
    backLabel="Kembali ke Statistika"
  />
);

export default PengantarGamePage;
