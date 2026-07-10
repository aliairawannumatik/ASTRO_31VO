import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Bangun gabungan terdiri dari tabung (r=7 cm, t=10 cm) dan setengah bola (r=7 cm) di atasnya. Volume bangun gabungan = ... (π=22/7)",
    options: ["2.157,67 cm³", "1.848,67 cm³", "1.540 cm³", "2.156 cm³"],
    correctIndex: 0,
  },
  {
    question: "Sebuah es krim terdiri dari kerucut (r=3, t=4) dan setengah bola (r=3) di atasnya. Volume setengah bolanya = ... (π=3,14)",
    options: ["56,52 cm³", "113,04 cm³", "28,26 cm³", "18,84 cm³"],
    correctIndex: 0,
  },
  {
    question: "Untuk menghitung volume bangun gabungan, kita ...",
    options: [
      "Kalikan volume masing-masing bagian",
      "Jumlahkan volume masing-masing bagian",
      "Kurangkan volume bagian terbesar",
      "Rata-ratakan semua volume",
    ],
    correctIndex: 1,
  },
  {
    question: "Luas permukaan bangun gabungan tabung dan setengah bola = luas selimut tabung + luas alas tabung + ...",
    options: [
      "Luas permukaan penuh bola",
      "Luas setengah bola",
      "Luas alas setengah bola",
      "Luas lingkaran",
    ],
    correctIndex: 1,
  },
  {
    question: "Sebuah lilin berbentuk tabung dengan ujung berbentuk kerucut. Jika tabung (r=2, t=8) dan kerucut (r=2, t=3), volume totalnya = ... (π=3,14)",
    options: ["100,48 cm³", "112,6 cm³", "138,16 cm³", "113,04 cm³"],
    correctIndex: 0,
  },
];

const GabunganGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="BANGUN RUANG SISI LENGKUNG GABUNGAN"
    backPath="/math-game-arena/kelas-9/bangun-ruang-sisi-lengkung"
    backLabel="Kembali ke Bangun Ruang Sisi Lengkung"
  />
);

export default GabunganGamePage;
