import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Roda sepeda berdiameter 70 cm berputar satu kali. Jarak yang ditempuh (π = 22/7) adalah ...",
    options: ["110 cm", "154 cm", "220 cm", "440 cm"],
    correctIndex: 2,
  },
  {
    question: "Kolam berbentuk lingkaran berdiameter 14 m. Luas kolam (π = 22/7) adalah ...",
    options: ["44 m²", "154 m²", "308 m²", "616 m²"],
    correctIndex: 1,
  },
  {
    question: "Jam dinding berbentuk lingkaran dengan r = 21 cm. Keliling jam (π = 22/7) adalah ...",
    options: ["66 cm", "132 cm", "154 cm", "264 cm"],
    correctIndex: 1,
  },
  {
    question: "Pita untuk melilit tabung dengan r = 7 cm sebanyak 2 keliling (π = 22/7) membutuhkan pita sepanjang ...",
    options: ["22 cm", "44 cm", "88 cm", "154 cm"],
    correctIndex: 2,
  },
  {
    question: "Lapangan berbentuk setengah lingkaran dengan r = 14 m. Luas lapangan (π = 22/7) adalah ...",
    options: ["44 m²", "77 m²", "154 m²", "308 m²"],
    correctIndex: 1,
  },
];

const PenerapanKontekstualLingkaranGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="PENERAPAN KONSEP LINGKARAN PADA PERMASALAHAN KONTEKSTUAL"
    backPath="/math-game-arena/kelas-8/lingkaran"
    backLabel="Kembali ke Lingkaran"
  />
);

export default PenerapanKontekstualLingkaranGamePage;
