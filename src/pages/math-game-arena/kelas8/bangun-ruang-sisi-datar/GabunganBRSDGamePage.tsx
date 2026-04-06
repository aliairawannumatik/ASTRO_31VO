import MeteorShootingGame from "@/components/MeteorShootingGame";

const questions = [
  {
    question: "Volume bangun gabungan dihitung dengan cara ...",
    options: ["Mengalikan volume masing-masing bangun", "Menjumlahkan volume masing-masing bangun", "Membagi volume total dengan 2", "Mengurangi volume bangun terbesar"],
    correctIndex: 1,
  },
  {
    question: "Sebuah atap berbentuk limas di atas dinding berbentuk balok. Volume total = ...",
    options: ["Volume limas saja", "Volume balok saja", "Volume limas + Volume balok", "Volume limas × Volume balok"],
    correctIndex: 2,
  },
  {
    question: "Sebuah prisma dengan volume 200 cm³ ditumpuk di atas kubus dengan volume 125 cm³. Volume total adalah ...",
    options: ["275 cm³", "300 cm³", "325 cm³", "350 cm³"],
    correctIndex: 2,
  },
  {
    question: "Luas permukaan bangun gabungan harus memperhatikan ...",
    options: ["Sisi yang tertutup tidak dihitung", "Semua sisi dihitung dua kali", "Hanya sisi luar yang dihitung", "Hanya sisi atas yang dihitung"],
    correctIndex: 2,
  },
  {
    question: "Akuarium berbentuk balok (30×20×15 cm) di atas meja berbentuk balok (50×50×80 cm). Volume akuarium saja adalah ...",
    options: ["6000 cm³", "9000 cm³", "200000 cm³", "4500 cm³"],
    correctIndex: 1,
  },
];

const GabunganBRSDGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="BANGUN RUANG SISI DATAR GABUNGAN"
    backPath="/math-game-arena/kelas-8/bangun-ruang-sisi-datar"
    backLabel="Kembali ke Bangun Ruang Sisi Datar"
  />
);

export default GabunganBRSDGamePage;
