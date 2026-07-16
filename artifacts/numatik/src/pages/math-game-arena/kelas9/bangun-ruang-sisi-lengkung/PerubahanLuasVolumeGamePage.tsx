import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Jika jari-jari tabung diperbesar 2 kali (tinggi tetap), volume menjadi ... kali semula.",
    options: ["2", "4", "6", "8"],
    correctIndex: 1,
  },
  {
    question: "Jika tinggi kerucut diperbesar 3 kali (jari-jari tetap), volume menjadi ... kali semula.",
    options: ["9", "6", "3", "27"],
    correctIndex: 2,
  },
  {
    question: "Jika jari-jari bola diperbesar 3 kali, luas permukaan menjadi ... kali semula.",
    options: ["3", "6", "9", "27"],
    correctIndex: 2,
  },
  {
    question: "Tabung A berjari-jari 4 cm dan tabung B berjari-jari 8 cm (tinggi sama). Perbandingan volume A : B adalah ...",
    options: ["1:2", "1:4", "2:1", "4:1"],
    correctIndex: 1,
  },
  {
    question: "Jika semua dimensi kerucut diperbesar 2 kali, volumenya menjadi ... kali semula.",
    options: ["2", "4", "6", "8"],
    correctIndex: 3,
  },
];

const PerubahanLuasVolumeGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PERUBAHAN LUAS DAN VOLUME BANGUN RUANG SISI LENGKUNG"
    backPath="/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung"
    backLabel="Kembali ke Bangun Ruang Sisi Lengkung"
  />
);

export default PerubahanLuasVolumeGamePage;
