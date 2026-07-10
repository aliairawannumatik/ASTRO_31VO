import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Cara menghitung luas bangun tak beraturan adalah dengan ...",
    options: ["Memecah menjadi bangun-bangun beraturan", "Mengukur sisi-sisinya saja", "Menghitung jumlah titik sudutnya", "Membagi dengan π"],
    correctIndex: 0,
  },
  {
    question: "Sebuah bangun tak beraturan dipecah menjadi persegi panjang 6 × 4 cm dan segitiga dengan alas 6 cm tinggi 3 cm. Luas totalnya adalah ...",
    options: ["30 cm²", "33 cm²", "36 cm²", "39 cm²"],
    correctIndex: 1,
  },
  {
    question: "Keliling bangun tak beraturan dihitung dengan cara ...",
    options: ["Menjumlahkan luas semua bagian", "Menjumlahkan semua sisi yang membentuk bangun", "Mengalikan panjang dan lebar", "Membagi luas dengan 2"],
    correctIndex: 1,
  },
  {
    question: "Sebuah denah berbentuk huruf L. Bagian atas berukuran 4 × 3 m dan bagian bawah 6 × 2 m. Luas denah seluruhnya adalah ...",
    options: ["20 m²", "22 m²", "24 m²", "26 m²"],
    correctIndex: 2,
  },
  {
    question: "Sebuah bangun terdiri dari persegi sisi 5 cm dan setengah lingkaran berdiameter 5 cm. Keliling bangun (tanpa diameter setengah lingkaran) kira-kira adalah ...",
    options: ["≈ 22,85 cm", "≈ 25,85 cm", "≈ 27,85 cm", "≈ 30,85 cm"],
    correctIndex: 1,
  },
];

const BangunTakBeraturanGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="KELILING DAN LUAS BANGUN TAK BERATURAN"
    backPath="/math-game-arena/kelas-7/segitiga-dan-segiempat"
    backLabel="Kembali ke Segitiga & Segiempat"
  />
);

export default BangunTakBeraturanGamePage;
