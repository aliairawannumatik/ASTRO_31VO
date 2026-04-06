import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Sebuah kotak kado berbentuk kubus dengan sisi 20 cm. Berapa kertas kado minimal yang diperlukan?",
    options: ["1200 cm²", "2400 cm²", "4800 cm²", "8000 cm²"],
    correctIndex: 1,
  },
  {
    question: "Kolam renang berbentuk balok 25 m × 10 m × 2 m. Volume air yang diisi penuh adalah ...",
    options: ["370 m³", "500 m³", "250 m³", "370 m³"],
    correctIndex: 1,
  },
  {
    question: "Tenda berbentuk prisma segitiga dengan alas 3 m, tinggi alas 2 m, dan tinggi prisma 5 m. Volume tenda adalah ...",
    options: ["10 m³", "15 m³", "20 m³", "30 m³"],
    correctIndex: 1,
  },
  {
    question: "Piramida (limas) dari pasir dengan alas persegi 6 m × 6 m dan tinggi 4 m. Volume pasir adalah ...",
    options: ["36 m³", "48 m³", "72 m³", "144 m³"],
    correctIndex: 1,
  },
  {
    question: "Kaleng berbentuk balok (10×8×15 cm) diisi gula. Volume gula maksimal yang bisa masuk adalah ...",
    options: ["1000 cm³", "1200 cm³", "1500 cm³", "1800 cm³"],
    correctIndex: 1,
  },
];

const KontekstualBRSDGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="MASALAH KONTEKSTUAL BANGUN RUANG SISI DATAR"
    backPath="/math-game-arena/kelas-8/bangun-ruang-sisi-datar"
    backLabel="Kembali ke Bangun Ruang Sisi Datar"
  />
);

export default KontekstualBRSDGamePage;
