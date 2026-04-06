import MeteorShootingGame, { QuizQuestion } from "@/components/MeteorShootingGame";

const questions: QuizQuestion[] = [
  {
    question: "Rumus bunga tunggal (B) adalah ...",
    options: ["B = M × b × n / 12", "B = M × b × n / 100", "B = M + b × n", "B = M/b × n"],
    correctIndex: 1,
  },
  {
    question: "Modal Rp 2.000.000 disimpan selama 1 tahun dengan bunga tunggal 6% per tahun. Besar bunganya adalah ...",
    options: ["Rp 100.000", "Rp 120.000", "Rp 150.000", "Rp 200.000"],
    correctIndex: 1,
  },
  {
    question: "Modal Rp 5.000.000 dengan bunga 8% per tahun selama 6 bulan. Jumlah akhir tabungan adalah ...",
    options: ["Rp 5.200.000", "Rp 5.300.000", "Rp 5.400.000", "Rp 5.500.000"],
    correctIndex: 0,
  },
  {
    question: "Budi meminjam uang Rp 4.000.000 dengan bunga 10% per tahun selama 2 tahun. Total uang yang harus dikembalikan adalah ...",
    options: ["Rp 4.600.000", "Rp 4.700.000", "Rp 4.800.000", "Rp 5.000.000"],
    correctIndex: 2,
  },
  {
    question: "Modal Rp 3.000.000 menghasilkan bunga Rp 360.000 dalam 2 tahun. Besar suku bunga per tahun adalah ...",
    options: ["4%", "5%", "6%", "7%"],
    correctIndex: 2,
  },
];

const BungaTunggalGamePage = () => (
  <MeteorShootingGame
    questions={questions}
    topicLabel="BUNGA TUNGGAL"
    backPath="/math-game-arena/kelas-7/aritmetika-sosial"
    backLabel="Kembali ke Aritmetika Sosial"
  />
);

export default BungaTunggalGamePage;
