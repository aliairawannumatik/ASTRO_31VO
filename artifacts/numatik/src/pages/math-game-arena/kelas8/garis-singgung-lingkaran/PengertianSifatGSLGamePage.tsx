import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Garis singgung lingkaran adalah garis yang menyentuh lingkaran di ...",
    options: ["Dua titik", "Tepat satu titik", "Tiga titik", "Tidak ada titik"],
    correctIndex: 1,
  },
  {
    question: "Garis singgung lingkaran tegak lurus terhadap ...",
    options: ["Tali busur", "Diameter", "Jari-jari di titik singgung", "Busur"],
    correctIndex: 2,
  },
  {
    question: "Dari satu titik di luar lingkaran, dapat dibuat berapa garis singgung?",
    options: ["1", "2", "3", "Tak hingga"],
    correctIndex: 1,
  },
  {
    question: "Dari satu titik di dalam lingkaran, dapat dibuat berapa garis singgung?",
    options: ["1", "2", "Tidak ada", "Tak hingga"],
    correctIndex: 2,
  },
  {
    question: "Sudut antara garis singgung dan jari-jari di titik singgung adalah ...",
    options: ["45°", "60°", "90°", "180°"],
    correctIndex: 2,
  },
];

const PengertianSifatGSLGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENGERTIAN DAN SIFAT GARIS SINGGUNG LINGKARAN"
    backPath="/math-game-arena/kelas-8/garis-singgung-lingkaran"
    backLabel="Kembali ke Garis Singgung Lingkaran"
  />
);

export default PengertianSifatGSLGamePage;
